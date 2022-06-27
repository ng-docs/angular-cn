/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {dirname, resolve} from 'path';
import ts from 'typescript';

/**
 * Update recorder for managing imports.
 *
 * 用于管理导入的更新记录器。
 *
 */
export interface ImportManagerUpdateRecorder {
  addNewImport(start: number, importText: string): void;
  updateExistingImport(namedBindings: ts.NamedImports, newNamedBindings: string): void;
}

/**
 * Import manager that can be used to add TypeScript imports to given source
 * files. The manager ensures that multiple transformations are applied properly
 * without shifted offsets and that similar existing import declarations are re-used.
 *
 * 可用于将 TypeScript
 * 导入添加到给定源文件的导入管理器。管理器确保在不偏移偏移的情况下正确应用多重转换，并且重新使用类似的现有导入声明。
 *
 */
export class ImportManager {
  /**
   * Map of import declarations that need to be updated to include the given symbols.
   *
   * 需要更新以包含给定符号的导入声明映射表。
   *
   */
  private updatedImports =
      new Map<ts.ImportDeclaration, {propertyName?: ts.Identifier, importName: ts.Identifier}[]>();
  /**
   * Map of source-files and their previously used identifier names.
   *
   * 源文件及其以前使用的标识符名称的映射。
   *
   */
  private usedIdentifierNames = new Map<ts.SourceFile, string[]>();
  /**
   * Array of previously resolved symbol imports. Cache can be re-used to return
   * the same identifier without checking the source-file again.
   *
   * 以前解析的符号导入的数组。缓存可以重用以返回相同的标识符，而无需再次检查源文件。
   *
   */
  private importCache: {
    sourceFile: ts.SourceFile,
    symbolName: string|null,
    moduleName: string,
    identifier: ts.Identifier
  }[] = [];

  constructor(
      private getUpdateRecorder: (sf: ts.SourceFile) => ImportManagerUpdateRecorder,
      private printer: ts.Printer) {}

  /**
   * Adds an import to the given source-file and returns the TypeScript
   * identifier that can be used to access the newly imported symbol.
   *
   * 添加对给定 source-file 的导入，并返回可用于访问新导入的符号的 TypeScript 标识符。
   *
   */
  addImportToSourceFile(
      sourceFile: ts.SourceFile, symbolName: string|null, moduleName: string,
      typeImport = false): ts.Expression {
    const sourceDir = dirname(sourceFile.fileName);
    let importStartIndex = 0;
    let existingImport: ts.ImportDeclaration|null = null;

    // In case the given import has been already generated previously, we just return
    // the previous generated identifier in order to avoid duplicate generated imports.
    const cachedImport = this.importCache.find(
        c => c.sourceFile === sourceFile && c.symbolName === symbolName &&
            c.moduleName === moduleName);
    if (cachedImport) {
      return cachedImport.identifier;
    }

    // Walk through all source-file top-level statements and search for import declarations
    // that already match the specified "moduleName" and can be updated to import the
    // given symbol. If no matching import can be found, the last import in the source-file
    // will be used as starting point for a new import that will be generated.
    for (let i = sourceFile.statements.length - 1; i >= 0; i--) {
      const statement = sourceFile.statements[i];

      if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier) ||
          !statement.importClause) {
        continue;
      }

      if (importStartIndex === 0) {
        importStartIndex = this._getEndPositionOfNode(statement);
      }

      const moduleSpecifier = statement.moduleSpecifier.text;

      if (moduleSpecifier.startsWith('.') &&
              resolve(sourceDir, moduleSpecifier) !== resolve(sourceDir, moduleName) ||
          moduleSpecifier !== moduleName) {
        continue;
      }

      if (statement.importClause.namedBindings) {
        const namedBindings = statement.importClause.namedBindings;

        // In case a "Type" symbol is imported, we can't use namespace imports
        // because these only export symbols available at runtime (no types)
        if (ts.isNamespaceImport(namedBindings) && !typeImport) {
          return ts.factory.createPropertyAccessExpression(
              ts.factory.createIdentifier(namedBindings.name.text),
              ts.factory.createIdentifier(symbolName || 'default'));
        } else if (ts.isNamedImports(namedBindings) && symbolName) {
          const existingElement = namedBindings.elements.find(
              e =>
                  e.propertyName ? e.propertyName.text === symbolName : e.name.text === symbolName);

          if (existingElement) {
            return ts.factory.createIdentifier(existingElement.name.text);
          }

          // In case the symbol could not be found in an existing import, we
          // keep track of the import declaration as it can be updated to include
          // the specified symbol name without having to create a new import.
          existingImport = statement;
        }
      } else if (statement.importClause.name && !symbolName) {
        return ts.factory.createIdentifier(statement.importClause.name.text);
      }
    }

    if (existingImport) {
      const propertyIdentifier = ts.factory.createIdentifier(symbolName!);
      const generatedUniqueIdentifier = this._getUniqueIdentifier(sourceFile, symbolName!);
      const needsGeneratedUniqueName = generatedUniqueIdentifier.text !== symbolName;
      const importName = needsGeneratedUniqueName ? generatedUniqueIdentifier : propertyIdentifier;

      // Since it can happen that multiple classes need to be imported within the
      // specified source file and we want to add the identifiers to the existing
      // import declaration, we need to keep track of the updated import declarations.
      // We can't directly update the import declaration for each identifier as this
      // would throw off the recorder offsets. We need to keep track of the new identifiers
      // for the import and perform the import transformation as batches per source-file.
      this.updatedImports.set(
          existingImport, (this.updatedImports.get(existingImport) || []).concat({
            propertyName: needsGeneratedUniqueName ? propertyIdentifier : undefined,
            importName: importName,
          }));

      // Keep track of all updated imports so that we don't generate duplicate
      // similar imports as these can't be statically analyzed in the source-file yet.
      this.importCache.push({sourceFile, moduleName, symbolName, identifier: importName});

      return importName;
    }

    let identifier: ts.Identifier|null = null;
    let newImport: ts.ImportDeclaration|null = null;

    if (symbolName) {
      const propertyIdentifier = ts.factory.createIdentifier(symbolName);
      const generatedUniqueIdentifier = this._getUniqueIdentifier(sourceFile, symbolName);
      const needsGeneratedUniqueName = generatedUniqueIdentifier.text !== symbolName;
      identifier = needsGeneratedUniqueName ? generatedUniqueIdentifier : propertyIdentifier;

      newImport = ts.factory.createImportDeclaration(
          undefined, undefined,
          ts.factory.createImportClause(
              false, undefined,
              ts.factory.createNamedImports([ts.factory.createImportSpecifier(
                  false, needsGeneratedUniqueName ? propertyIdentifier : undefined, identifier)])),
          ts.factory.createStringLiteral(moduleName));
    } else {
      identifier = this._getUniqueIdentifier(sourceFile, 'defaultExport');
      newImport = ts.factory.createImportDeclaration(
          undefined, undefined, ts.factory.createImportClause(false, identifier, undefined),
          ts.factory.createStringLiteral(moduleName));
    }

    const newImportText = this.printer.printNode(ts.EmitHint.Unspecified, newImport, sourceFile);
    // If the import is generated at the start of the source file, we want to add
    // a new-line after the import. Otherwise if the import is generated after an
    // existing import, we need to prepend a new-line so that the import is not on
    // the same line as the existing import anchor.
    this.getUpdateRecorder(sourceFile)
        .addNewImport(
            importStartIndex, importStartIndex === 0 ? `${newImportText}\n` : `\n${newImportText}`);

    // Keep track of all generated imports so that we don't generate duplicate
    // similar imports as these can't be statically analyzed in the source-file yet.
    this.importCache.push({sourceFile, symbolName, moduleName, identifier});

    return identifier;
  }

  /**
   * Stores the collected import changes within the appropriate update recorders. The
   * updated imports can only be updated *once* per source-file because previous updates
   * could otherwise shift the source-file offsets.
   *
   * 将收集的导入更改存储在适当的更新记录器中。每个源文件只能更新*一次*更新的导入，因为以前的更新可能会移动源文件的偏移量。
   *
   */
  recordChanges() {
    this.updatedImports.forEach((expressions, importDecl) => {
      const sourceFile = importDecl.getSourceFile();
      const recorder = this.getUpdateRecorder(sourceFile);
      const namedBindings = importDecl.importClause!.namedBindings as ts.NamedImports;
      const newNamedBindings = ts.factory.updateNamedImports(
          namedBindings,
          namedBindings.elements.concat(expressions.map(
              ({propertyName, importName}) =>
                  ts.factory.createImportSpecifier(false, propertyName, importName))));

      const newNamedBindingsText =
          this.printer.printNode(ts.EmitHint.Unspecified, newNamedBindings, sourceFile);
      recorder.updateExistingImport(namedBindings, newNamedBindingsText);
    });
  }

  /**
   * Gets an unique identifier with a base name for the given source file.
   *
   * 获取具有给定源文件的基本名称的唯一标识符。
   *
   */
  private _getUniqueIdentifier(sourceFile: ts.SourceFile, baseName: string): ts.Identifier {
    if (this.isUniqueIdentifierName(sourceFile, baseName)) {
      this._recordUsedIdentifier(sourceFile, baseName);
      return ts.factory.createIdentifier(baseName);
    }

    let name = null;
    let counter = 1;
    do {
      name = `${baseName}_${counter++}`;
    } while (!this.isUniqueIdentifierName(sourceFile, name));

    this._recordUsedIdentifier(sourceFile, name!);
    return ts.factory.createIdentifier(name!);
  }

  /**
   * Checks whether the specified identifier name is used within the given
   * source file.
   *
   * 检查给定的源文件中是否使用了指定的标识符名称。
   *
   */
  private isUniqueIdentifierName(sourceFile: ts.SourceFile, name: string) {
    if (this.usedIdentifierNames.has(sourceFile) &&
        this.usedIdentifierNames.get(sourceFile)!.indexOf(name) !== -1) {
      return false;
    }

    // Walk through the source file and search for an identifier matching
    // the given name. In that case, it's not guaranteed that this name
    // is unique in the given declaration scope and we just return false.
    const nodeQueue: ts.Node[] = [sourceFile];
    while (nodeQueue.length) {
      const node = nodeQueue.shift()!;
      if (ts.isIdentifier(node) && node.text === name) {
        return false;
      }
      nodeQueue.push(...node.getChildren());
    }
    return true;
  }

  private _recordUsedIdentifier(sourceFile: ts.SourceFile, identifierName: string) {
    this.usedIdentifierNames.set(
        sourceFile, (this.usedIdentifierNames.get(sourceFile) || []).concat(identifierName));
  }

  /**
   * Determines the full end of a given node. By default the end position of a node is
   * before all trailing comments. This could mean that generated imports shift comments.
   *
   * 确定给定节点的完整结尾。默认情况下，节点的结束位置在所有尾随注释之前。这可能意味着生成的导入会转移注释。
   *
   */
  private _getEndPositionOfNode(node: ts.Node) {
    const nodeEndPos = node.getEnd();
    const commentRanges = ts.getTrailingCommentRanges(node.getSourceFile().text, nodeEndPos);
    if (!commentRanges || !commentRanges.length) {
      return nodeEndPos;
    }
    return commentRanges[commentRanges.length - 1]!.end;
  }
}

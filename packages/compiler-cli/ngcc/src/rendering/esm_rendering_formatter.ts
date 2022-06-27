/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Statement} from '@angular/compiler';
import MagicString from 'magic-string';
import ts from 'typescript';

import {absoluteFromSourceFile, AbsoluteFsPath, PathManipulation, toRelativeImport} from '../../../src/ngtsc/file_system';
import {Reexport} from '../../../src/ngtsc/imports';
import {Import, ImportManager, translateStatement} from '../../../src/ngtsc/translator';
import {isDtsPath} from '../../../src/ngtsc/util/src/typescript';
import {ModuleWithProvidersInfo} from '../analysis/module_with_providers_analyzer';
import {ExportInfo} from '../analysis/private_declarations_analyzer';
import {CompiledClass} from '../analysis/types';
import {getContainingStatement, isAssignment} from '../host/esm2015_host';
import {NgccReflectionHost} from '../host/ngcc_host';

import {RedundantDecoratorMap, RenderingFormatter} from './rendering_formatter';
import {stripExtension} from './utils';

/**
 * A RenderingFormatter that works with ECMAScript Module import and export statements.
 *
 * 与 ECMAScript 模块导入和导出语句一起使用的 RenderingFormatter。
 *
 */
export class EsmRenderingFormatter implements RenderingFormatter {
  protected printer = ts.createPrinter({newLine: ts.NewLineKind.LineFeed});

  constructor(
      protected fs: PathManipulation, protected host: NgccReflectionHost,
      protected isCore: boolean) {}

  /**
   * Add the imports at the top of the file, after any imports that are already there.
   *
   * 在文件顶部已经存在的任何导入之后添加导入。
   *
   */
  addImports(output: MagicString, imports: Import[], sf: ts.SourceFile): void {
    if (imports.length === 0) {
      return;
    }

    const insertionPoint = this.findEndOfImports(sf);
    const renderedImports =
        imports.map(i => `import * as ${i.qualifier.text} from '${i.specifier}';\n`).join('');
    output.appendLeft(insertionPoint, renderedImports);
  }

  /**
   * Add the exports to the end of the file.
   *
   * 将导出添加到文件末尾。
   *
   */
  addExports(
      output: MagicString, entryPointBasePath: AbsoluteFsPath, exports: ExportInfo[],
      importManager: ImportManager, file: ts.SourceFile): void {
    exports.forEach(e => {
      let exportFrom = '';
      const isDtsFile = isDtsPath(entryPointBasePath);
      const from = isDtsFile ? e.dtsFrom : e.from;

      if (from) {
        const basePath = stripExtension(from);
        const relativePath = this.fs.relative(this.fs.dirname(entryPointBasePath), basePath);
        const relativeImport = toRelativeImport(relativePath);
        exportFrom = entryPointBasePath !== basePath ? ` from '${relativeImport}'` : '';
      }

      const exportStr = `\nexport {${e.identifier}}${exportFrom};`;
      output.append(exportStr);
    });
  }


  /**
   * Add plain exports to the end of the file.
   *
   * 将普通导出添加到文件末尾。
   *
   * Unlike `addExports`, direct exports go directly in a .js and .d.ts file and don't get added to
   * an entrypoint.
   *
   * 与 `addExports` 不同，直接导出直接在 .js 和 .d.ts 文件中，不会被添加到入口点。
   *
   */
  addDirectExports(
      output: MagicString, exports: Reexport[], importManager: ImportManager,
      file: ts.SourceFile): void {
    for (const e of exports) {
      const exportStatement = `\nexport {${e.symbolName} as ${e.asAlias}} from '${e.fromModule}';`;
      output.append(exportStatement);
    }
  }

  /**
   * Add the constants directly after the imports.
   *
   * 在导入之后直接添加常量。
   *
   */
  addConstants(output: MagicString, constants: string, file: ts.SourceFile): void {
    if (constants === '') {
      return;
    }
    const insertionPoint = this.findEndOfImports(file);

    // Append the constants to the right of the insertion point, to ensure they get ordered after
    // added imports (those are appended left to the insertion point).
    output.appendRight(insertionPoint, '\n' + constants + '\n');
  }

  /**
   * Add the definitions directly after their decorated class.
   *
   * 在其装饰类之后直接添加定义。
   *
   */
  addDefinitions(output: MagicString, compiledClass: CompiledClass, definitions: string): void {
    const classSymbol = this.host.getClassSymbol(compiledClass.declaration);
    if (!classSymbol) {
      throw new Error(`Compiled class does not have a valid symbol: ${compiledClass.name}`);
    }
    const declarationStatement =
        getContainingStatement(classSymbol.implementation.valueDeclaration);
    const insertionPoint = declarationStatement.getEnd();
    output.appendLeft(insertionPoint, '\n' + definitions);
  }

  /**
   * Add the adjacent statements after all static properties of the class.
   *
   * 在类的所有静态属性之后添加相邻的语句。
   *
   */
  addAdjacentStatements(output: MagicString, compiledClass: CompiledClass, statements: string):
      void {
    const classSymbol = this.host.getClassSymbol(compiledClass.declaration);
    if (!classSymbol) {
      throw new Error(`Compiled class does not have a valid symbol: ${compiledClass.name}`);
    }
    const endOfClass = this.host.getEndOfClass(classSymbol);
    output.appendLeft(endOfClass.getEnd(), '\n' + statements);
  }

  /**
   * Remove static decorator properties from classes.
   *
   * 从类中删除静态装饰器属性。
   *
   */
  removeDecorators(output: MagicString, decoratorsToRemove: RedundantDecoratorMap): void {
    decoratorsToRemove.forEach((nodesToRemove, containerNode) => {
      if (ts.isArrayLiteralExpression(containerNode)) {
        const items = containerNode.elements;
        if (items.length === nodesToRemove.length) {
          // Remove the entire statement
          const statement = findStatement(containerNode);
          if (statement) {
            if (ts.isExpressionStatement(statement)) {
              // The statement looks like: `SomeClass = __decorate(...);`
              // Remove it completely
              output.remove(statement.getFullStart(), statement.getEnd());
            } else if (
                ts.isReturnStatement(statement) && statement.expression &&
                isAssignment(statement.expression)) {
              // The statement looks like: `return SomeClass = __decorate(...);`
              // We only want to end up with: `return SomeClass;`
              const startOfRemoval = statement.expression.left.getEnd();
              const endOfRemoval = getEndExceptSemicolon(statement);
              output.remove(startOfRemoval, endOfRemoval);
            }
          }
        } else {
          nodesToRemove.forEach(node => {
            // remove any trailing comma
            const nextSibling = getNextSiblingInArray(node, items);
            let end: number;

            if (nextSibling !== null &&
                output.slice(nextSibling.getFullStart() - 1, nextSibling.getFullStart()) === ',') {
              end = nextSibling.getFullStart() - 1 + nextSibling.getLeadingTriviaWidth();
            } else if (output.slice(node.getEnd(), node.getEnd() + 1) === ',') {
              end = node.getEnd() + 1;
            } else {
              end = node.getEnd();
            }
            output.remove(node.getFullStart(), end);
          });
        }
      }
    });
  }

  /**
   * Add the type parameters to the appropriate functions that return `ModuleWithProviders`
   * structures.
   *
   * 将类型参数添加到返回 `ModuleWithProviders` 结构的适当函数。
   *
   * This function will only get called on typings files.
   *
   * 此函数只会在 typings 文件上调用。
   *
   */
  addModuleWithProvidersParams(
      outputText: MagicString, moduleWithProviders: ModuleWithProvidersInfo[],
      importManager: ImportManager): void {
    moduleWithProviders.forEach(info => {
      const ngModuleName = info.ngModule.node.name.text;
      const declarationFile = absoluteFromSourceFile(info.declaration.getSourceFile());
      const ngModuleFile = absoluteFromSourceFile(info.ngModule.node.getSourceFile());
      const relativePath = this.fs.relative(this.fs.dirname(declarationFile), ngModuleFile);
      const relativeImport = toRelativeImport(relativePath);
      const importPath = info.ngModule.ownedByModuleGuess ||
          (declarationFile !== ngModuleFile ? stripExtension(relativeImport) : null);
      const ngModule = generateImportString(importManager, importPath, ngModuleName);

      if (info.declaration.type) {
        const typeName = info.declaration.type && ts.isTypeReferenceNode(info.declaration.type) ?
            info.declaration.type.typeName :
            null;
        if (this.isCoreModuleWithProvidersType(typeName)) {
          // The declaration already returns `ModuleWithProvider` but it needs the `NgModule` type
          // parameter adding.
          outputText.overwrite(
              info.declaration.type.getStart(), info.declaration.type.getEnd(),
              `ModuleWithProviders<${ngModule}>`);
        } else {
          // The declaration returns an unknown type so we need to convert it to a union that
          // includes the ngModule property.
          const originalTypeString = info.declaration.type.getText();
          outputText.overwrite(
              info.declaration.type.getStart(), info.declaration.type.getEnd(),
              `(${originalTypeString})&{ngModule:${ngModule}}`);
        }
      } else {
        // The declaration has no return type so provide one.
        const lastToken = info.declaration.getLastToken();
        const insertPoint = lastToken && lastToken.kind === ts.SyntaxKind.SemicolonToken ?
            lastToken.getStart() :
            info.declaration.getEnd();
        outputText.appendLeft(
            insertPoint,
            `: ${generateImportString(importManager, '@angular/core', 'ModuleWithProviders')}<${
                ngModule}>`);
      }
    });
  }

  /**
   * Convert a `Statement` to JavaScript code in a format suitable for rendering by this formatter.
   *
   * 将 `Statement` 转换为适合此格式化程序呈现的格式的 JavaScript 代码。
   *
   * @param stmt The `Statement` to print.
   *
   * 要打印的 `Statement` 。
   *
   * @param sourceFile A `ts.SourceFile` that provides context for the statement. See
   *     `ts.Printer#printNode()` for more info.
   *
   * 为语句提供上下文的 `ts.SourceFile` 。有关更多信息，请参阅 `ts.Printer#printNode()` 。
   *
   * @param importManager The `ImportManager` to use for managing imports.
   *
   * 用于管理导入的 `ImportManager` 。
   *
   * @return The JavaScript code corresponding to `stmt` (in the appropriate format).
   *
   * 与 `stmt` 对应的 JavaScript 代码（采用适当的格式）。
   *
   */
  printStatement(stmt: Statement, sourceFile: ts.SourceFile, importManager: ImportManager): string {
    const node = translateStatement(stmt, importManager);
    const code = this.printer.printNode(ts.EmitHint.Unspecified, node, sourceFile);

    return code;
  }

  protected findEndOfImports(sf: ts.SourceFile): number {
    for (const stmt of sf.statements) {
      if (!ts.isImportDeclaration(stmt) && !ts.isImportEqualsDeclaration(stmt) &&
          !ts.isNamespaceImport(stmt)) {
        return stmt.getStart();
      }
    }
    return 0;
  }

  /**
   * Check whether the given type is the core Angular `ModuleWithProviders` interface.
   *
   * 检查给定的类型是否是核心 Angular `ModuleWithProviders` 接口。
   *
   * @param typeName The type to check.
   *
   * 要检查的类型。
   *
   * @returns
   *
   * true if the type is the core Angular `ModuleWithProviders` interface.
   *
   * 如果类型是核心 Angular `ModuleWithProviders` 接口，则为 true 。
   *
   */
  private isCoreModuleWithProvidersType(typeName: ts.EntityName|null) {
    const id =
        typeName && ts.isIdentifier(typeName) ? this.host.getImportOfIdentifier(typeName) : null;
    return (
        id && id.name === 'ModuleWithProviders' && (this.isCore || id.from === '@angular/core'));
  }
}

function findStatement(node: ts.Node): ts.Statement|undefined {
  while (node) {
    if (ts.isExpressionStatement(node) || ts.isReturnStatement(node)) {
      return node;
    }
    node = node.parent;
  }
  return undefined;
}

function generateImportString(
    importManager: ImportManager, importPath: string|null, importName: string) {
  const importAs = importPath ? importManager.generateNamedImport(importPath, importName) : null;
  return importAs && importAs.moduleImport ? `${importAs.moduleImport.text}.${importAs.symbol}` :
                                             `${importName}`;
}

function getNextSiblingInArray<T extends ts.Node>(node: T, array: ts.NodeArray<T>): T|null {
  const index = array.indexOf(node);
  return index !== -1 && array.length > index + 1 ? array[index + 1] : null;
}

function getEndExceptSemicolon(statement: ts.Statement): number {
  const lastToken = statement.getLastToken();
  return (lastToken && lastToken.kind === ts.SyntaxKind.SemicolonToken) ? statement.getEnd() - 1 :
                                                                          statement.getEnd();
}

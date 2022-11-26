/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

export type Import = {
  name: string,
  importModule: string,
  node: ts.ImportDeclaration
};

/**
 * Gets import information about the specified identifier by using the Type checker.
 *
 * 使用类型检查器获取有关指定标识符的导入信息。
 *
 */
export function getImportOfIdentifier(typeChecker: ts.TypeChecker, node: ts.Identifier): Import|
    null {
  const symbol = typeChecker.getSymbolAtLocation(node);

  if (!symbol || symbol.declarations === undefined || !symbol.declarations.length) {
    return null;
  }

  const decl = symbol.declarations[0];

  if (!ts.isImportSpecifier(decl)) {
    return null;
  }

  const importDecl = decl.parent.parent.parent;

  if (!ts.isStringLiteral(importDecl.moduleSpecifier)) {
    return null;
  }

  return {
    // Handles aliased imports: e.g. "import {Component as myComp} from ...";
    name: decl.propertyName ? decl.propertyName.text : decl.name.text,
    importModule: importDecl.moduleSpecifier.text,
    node: importDecl
  };
}


/**
 * Gets a top-level import specifier with a specific name that is imported from a particular module.
 * E.g. given a file that looks like:
 *
 * 获取从特定模块导入的具有特定名称的顶级导入说明符。例如，给定一个类似于以下内容的文件：
 *
 * ```
 * import { Component, Directive } from '@angular/core';
 * import { Foo } from './foo';
 * ```
 *
 * Calling `getImportSpecifier(sourceFile, '@angular/core', 'Directive')` will yield the node
 * referring to `Directive` in the top import.
 *
 * 调用 `getImportSpecifier(sourceFile, '@angular/core', 'Directive')` 将产生在顶级导入中引用
 * `Directive` 的节点。
 *
 * @param sourceFile File in which to look for imports.
 *
 * 要在其中查找导入的文件。
 *
 * @param moduleName Name of the import's module.
 *
 * 导入的模块的名称。
 *
 * @param specifierName Original name of the specifier to look for. Aliases will be resolved to
 *    their original name.
 *
 * 要查找的说明符的原始名称。别名将被解析为其原始名称。
 *
 */
export function getImportSpecifier(
    sourceFile: ts.SourceFile, moduleName: string, specifierName: string): ts.ImportSpecifier|null {
  for (const node of sourceFile.statements) {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier) &&
        node.moduleSpecifier.text === moduleName) {
      const namedBindings = node.importClause && node.importClause.namedBindings;
      if (namedBindings && ts.isNamedImports(namedBindings)) {
        const match = findImportSpecifier(namedBindings.elements, specifierName);
        if (match) {
          return match;
        }
      }
    }
  }

  return null;
}


/**
 * Replaces an import inside a named imports node with a different one.
 *
 * 将命名导入节点中的导入替换为不同的导入。
 *
 * @param node Node that contains the imports.
 *
 * 包含导入的节点。
 *
 * @param existingImport Import that should be replaced.
 *
 * 应该替换的导入。
 *
 * @param newImportName Import that should be inserted.
 *
 * 应该插入的导入。
 *
 */
export function replaceImport(
    node: ts.NamedImports, existingImport: string, newImportName: string) {
  const isAlreadyImported = findImportSpecifier(node.elements, newImportName);
  if (isAlreadyImported) {
    return node;
  }

  const existingImportNode = findImportSpecifier(node.elements, existingImport);
  if (!existingImportNode) {
    return node;
  }

  const importPropertyName =
      existingImportNode.propertyName ? ts.factory.createIdentifier(newImportName) : undefined;
  const importName = existingImportNode.propertyName ? existingImportNode.name :
                                                       ts.factory.createIdentifier(newImportName);

  return ts.factory.updateNamedImports(node, [
    ...node.elements.filter(current => current !== existingImportNode),
    // Create a new import while trying to preserve the alias of the old one.
    ts.factory.createImportSpecifier(false, importPropertyName, importName)
  ]);
}

/**
 * Removes a symbol from the named imports and updates a node
 * that represents a given named imports.
 *
 * @param node Node that contains the imports.
 * @param symbol Symbol that should be removed.
 * @returns An updated node (ts.NamedImports).
 */
export function removeSymbolFromNamedImports(node: ts.NamedImports, symbol: ts.ImportSpecifier) {
  return ts.factory.updateNamedImports(node, [
    ...node.elements.filter(current => current !== symbol),
  ]);
}

/**
 * Finds an import specifier with a particular name.
 *
 * 查找具有特定名称的导入说明符。
 *
 */
export function findImportSpecifier(
    nodes: ts.NodeArray<ts.ImportSpecifier>, specifierName: string): ts.ImportSpecifier|undefined {
  return nodes.find(element => {
    const {name, propertyName} = element;
    return propertyName ? propertyName.text === specifierName : name.text === specifierName;
  });
}

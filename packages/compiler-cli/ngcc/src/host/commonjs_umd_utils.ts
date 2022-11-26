/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {Declaration} from '../../../src/ngtsc/reflection';
import {isAssignment} from '../../../src/ngtsc/util/src/typescript';

export interface ExportDeclaration {
  name: string;
  declaration: Declaration;
}

/**
 * A CommonJS or UMD wildcard re-export statement.
 *
 * CommonJS 或 UMD 通配符重新导出语句。
 *
 * The CommonJS or UMD version of `export * from 'blah';`.
 *
 * `export * from 'blah';` .
 *
 * These statements can have several forms (depending, for example, on whether
 * the TypeScript helpers are imported or emitted inline). The expression can have one of the
 * following forms:
 *
 * 这些语句可以有多种形式（例如，取决于 TypeScript
 * 帮助器是导入的还是内联发出的）。表达式可以有以下形式之一：
 *
 * - `__export(firstArg)`
 *
 * - `__exportStar(firstArg)`
 *
 * - `tslib.__export(firstArg, exports)`
 *
 * - `tslib.__exportStar(firstArg, exports)`
 *
 * In all cases, we only care about `firstArg`, which is the first argument of the re-export call
 * expression and can be either a `require('...')` call or an identifier (initialized via a
 * `require('...')` call).
 *
 * 在所有情况下，我们只关心 `firstArg` ，它是 re-export 调用表达式的第一个参数，可以是
 * `require('...')` 调用或标识符（通过 `require('...')` 初始化）`require('...')` 调用)。
 *
 */
export interface WildcardReexportStatement extends ts.ExpressionStatement {
  expression: ts.CallExpression;
}

/**
 * A CommonJS or UMD re-export statement using an `Object.defineProperty()` call.
 * For example:
 *
 * 使用 `Object.defineProperty()` 调用的 CommonJS 或 UMD 重新导出语句。例如：
 *
 * ```
 * Object.defineProperty(exports, "<exported-id>",
 *     { enumerable: true, get: function () { return <imported-id>; } });
 * ```
 *
 */
export interface DefinePropertyReexportStatement extends ts.ExpressionStatement {
  expression: ts.CallExpression&
      {arguments: [ts.Identifier, ts.StringLiteral, ts.ObjectLiteralExpression]};
}

/**
 * A call expression that has a string literal for its first argument.
 *
 * 第一个参数有字符串文字的调用表达式。
 *
 */
export interface RequireCall extends ts.CallExpression {
  arguments: ts.CallExpression['arguments']&[ts.StringLiteral];
}


/**
 * Return the "namespace" of the specified `ts.Identifier` if the identifier is the RHS of a
 * property access expression, i.e. an expression of the form `<namespace>.<id>` (in which case a
 * `ts.Identifier` corresponding to `<namespace>` will be returned). Otherwise return `null`.
 *
 * 如果标识符是属性访问表达式的 RHS，即 `<namespace>.<id>` 格式的表达式（在这种情况下
 * `ts.Identifier` 与 `<namespace>` 对应的 `ts.Identifier` 将被退回）。否则返回 `null` 。
 *
 */
export function findNamespaceOfIdentifier(id: ts.Identifier): ts.Identifier|null {
  return id.parent && ts.isPropertyAccessExpression(id.parent) && id.parent.name === id &&
          ts.isIdentifier(id.parent.expression) ?
      id.parent.expression :
      null;
}

/**
 * Return the `RequireCall` that is used to initialize the specified `ts.Identifier`, if the
 * specified identifier was indeed initialized with a require call in a declaration of the form:
 * `var <id> = require('...')`
 *
 * 如果指定的标识符确实是使用以下形式的声明中的 require 调用初始化的，则返回用于初始化指定的
 * `RequireCall` 的 `ts.Identifier` ： `var <id> = require('...')`
 *
 */
export function findRequireCallReference(id: ts.Identifier, checker: ts.TypeChecker): RequireCall|
    null {
  const symbol = checker.getSymbolAtLocation(id) || null;
  const declaration = symbol?.valueDeclaration ?? symbol?.declarations?.[0];
  const initializer =
      declaration && ts.isVariableDeclaration(declaration) && declaration.initializer || null;
  return initializer && isRequireCall(initializer) ? initializer : null;
}

/**
 * Check whether the specified `ts.Statement` is a wildcard re-export statement.
 * I.E. an expression statement of one of the following forms:
 *
 * 检查指定的 `ts.Statement` 是否是通配符重新导出语句。 IE 以下形式之一的表达式语句：
 *
 * - `__export(<foo>)`
 *
 * - `__exportStar(<foo>)`
 *
 * - `tslib.__export(<foo>, exports)`
 *
 * - `tslib.__exportStar(<foo>, exports)`
 *
 */
export function isWildcardReexportStatement(stmt: ts.Statement): stmt is WildcardReexportStatement {
  // Ensure it is a call expression statement.
  if (!ts.isExpressionStatement(stmt) || !ts.isCallExpression(stmt.expression)) {
    return false;
  }

  // Get the called function identifier.
  // NOTE: Currently, it seems that `__export()` is used when emitting helpers inline and
  //       `__exportStar()` when importing them
  //       ([source](https://github.com/microsoft/TypeScript/blob/d7c83f023/src/compiler/transformers/module/module.ts#L1796-L1797)).
  //       So, theoretically, we only care about the formats `__export(<foo>)` and
  //       `tslib.__exportStar(<foo>, exports)`.
  //       The current implementation accepts the other two formats (`__exportStar(...)` and
  //       `tslib.__export(...)`) as well to be more future-proof (given that it is unlikely that
  //       they will introduce false positives).
  let fnName: string|null = null;
  if (ts.isIdentifier(stmt.expression.expression)) {
    // Statement of the form `someFn(...)`.
    fnName = stmt.expression.expression.text;
  } else if (
      ts.isPropertyAccessExpression(stmt.expression.expression) &&
      ts.isIdentifier(stmt.expression.expression.name)) {
    // Statement of the form `tslib.someFn(...)`.
    fnName = stmt.expression.expression.name.text;
  }

  // Ensure the called function is either `__export()` or `__exportStar()`.
  if ((fnName !== '__export') && (fnName !== '__exportStar')) {
    return false;
  }

  // Ensure there is at least one argument.
  // (The first argument is the exported thing and there will be a second `exports` argument in the
  // case of imported helpers).
  return stmt.expression.arguments.length > 0;
}


/**
 * Check whether the statement is a re-export of the form:
 *
 * 检查该语句是否是以下表单的重新导出：
 *
 * ```
 * Object.defineProperty(exports, "<export-name>",
 *     { enumerable: true, get: function () { return <import-name>; } });
 * ```
 *
 */
export function isDefinePropertyReexportStatement(stmt: ts.Statement):
    stmt is DefinePropertyReexportStatement {
  if (!ts.isExpressionStatement(stmt) || !ts.isCallExpression(stmt.expression)) {
    return false;
  }

  // Check for Object.defineProperty
  if (!ts.isPropertyAccessExpression(stmt.expression.expression) ||
      !ts.isIdentifier(stmt.expression.expression.expression) ||
      stmt.expression.expression.expression.text !== 'Object' ||
      !ts.isIdentifier(stmt.expression.expression.name) ||
      stmt.expression.expression.name.text !== 'defineProperty') {
    return false;
  }

  const args = stmt.expression.arguments;
  if (args.length !== 3) {
    return false;
  }
  const exportsObject = args[0];
  if (!ts.isIdentifier(exportsObject) || exportsObject.text !== 'exports') {
    return false;
  }

  const propertyKey = args[1];
  if (!ts.isStringLiteral(propertyKey)) {
    return false;
  }

  const propertyDescriptor = args[2];
  if (!ts.isObjectLiteralExpression(propertyDescriptor)) {
    return false;
  }

  return (propertyDescriptor.properties.some(
      prop => prop.name !== undefined && ts.isIdentifier(prop.name) && prop.name.text === 'get'));
}

/**
 * Extract the "value" of the getter in a `defineProperty` statement.
 *
 * 在 `defineProperty` 语句中提取 getter 的“值”。
 *
 * This will return the `ts.Expression` value of a single `return` statement in the `get` method
 * of the property definition object, or `null` if that is not possible.
 *
 * 这将返回属性定义对象的 `get` 方法中单个 `return` 语句的 `ts.Expression` 值，如果不可能，则返回
 * `null` 。
 *
 */
export function extractGetterFnExpression(statement: DefinePropertyReexportStatement):
    ts.Expression|null {
  const args = statement.expression.arguments;
  const getterFn = args[2].properties.find(
      prop => prop.name !== undefined && ts.isIdentifier(prop.name) && prop.name.text === 'get');
  if (getterFn === undefined || !ts.isPropertyAssignment(getterFn) ||
      !ts.isFunctionExpression(getterFn.initializer)) {
    return null;
  }
  const returnStatement = getterFn.initializer.body.statements[0];
  if (!ts.isReturnStatement(returnStatement) || returnStatement.expression === undefined) {
    return null;
  }
  return returnStatement.expression;
}

/**
 * Check whether the specified `ts.Node` represents a `require()` call, i.e. an call expression of
 * the form: `require('<foo>')`
 *
 * 检查指定的 `ts.Node` 是否表示 `require()` 调用，即以下形式的调用表达式： `require('<foo>')`
 *
 */
export function isRequireCall(node: ts.Node): node is RequireCall {
  return ts.isCallExpression(node) && ts.isIdentifier(node.expression) &&
      node.expression.text === 'require' && node.arguments.length === 1 &&
      ts.isStringLiteral(node.arguments[0]);
}

/**
 * Check whether the specified `path` is an "external" import.
 * In other words, that it comes from a entry-point outside the current one.
 *
 * 检查指定的 `path` 是否是“外部”导入。换句话说，它来自当前入口点之外的入口点。
 *
 */
export function isExternalImport(path: string): boolean {
  return !/^\.\.?(\/|$)/.test(path);
}

/**
 * A UMD/CommonJS style export declaration of the form `exports.<name>`.
 *
 * 格式为 exclude `exports.<name>` 的 UMD/CommonJS 风格的导出声明。
 *
 */
export interface ExportsDeclaration extends ts.PropertyAccessExpression {
  name: ts.Identifier;
  expression: ts.Identifier;
  parent: ExportsAssignment;
}

/**
 * Check whether the specified `node` is a property access expression of the form
 * `exports.<foo>`.
 *
 * 检查指定的 `node` 是否是 `exports.<foo>` 形式的属性访问表达式。
 *
 */
export function isExportsDeclaration(expr: ts.Node): expr is ExportsDeclaration {
  return expr.parent && isExportsAssignment(expr.parent);
}

/**
 * A UMD/CommonJS style export assignment of the form `exports.<foo> = <bar>`.
 *
 * 格式为 exclude `exports.<foo> = <bar>` 的 UMD/CommonJS 风格的导出分配。
 *
 */
export interface ExportsAssignment extends ts.BinaryExpression {
  left: ExportsDeclaration;
}

/**
 * Check whether the specified `node` is an assignment expression of the form
 * `exports.<foo> = <bar>`.
 *
 * 检查指定的 `node` 是否是 `exports.<foo> = <bar>` 形式的赋值表达式。
 *
 */
export function isExportsAssignment(expr: ts.Node): expr is ExportsAssignment {
  return isAssignment(expr) && ts.isPropertyAccessExpression(expr.left) &&
      ts.isIdentifier(expr.left.expression) && expr.left.expression.text === 'exports' &&
      ts.isIdentifier(expr.left.name);
}

/**
 * An expression statement of the form `exports.<foo> = <bar>;`.
 *
 * `exports.<foo> = <bar>;` 形式的表达式语句.
 *
 */
export interface ExportsStatement extends ts.ExpressionStatement {
  expression: ExportsAssignment;
}

/**
 * Check whether the specified `stmt` is an expression statement of the form
 * `exports.<foo> = <bar>;`.
 *
 * 检查指定的 `stmt` 是否是 `exports.<foo> = <bar>;` 形式的表达式语句.
 *
 */
export function isExportsStatement(stmt: ts.Node): stmt is ExportsStatement {
  return ts.isExpressionStatement(stmt) && isExportsAssignment(stmt.expression);
}

/**
 * Find the far right hand side of a sequence of aliased assignments of the form
 *
 * 查找以下形式的别名赋值序列的最右侧
 *
 * ```
 * exports.MyClass = alias1 = alias2 = <<declaration>>
 * ```
 *
 * @param node the expression to parse
 *
 * 要解析的表达式
 *
 * @returns
 *
 * the original `node` or the far right expression of a series of assignments.
 *
 * 一系列赋值的原始 `node` 或最右边的表达式。
 *
 */
export function skipAliases(node: ts.Expression): ts.Expression {
  while (isAssignment(node)) {
    node = node.right;
  }
  return node;
}

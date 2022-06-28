/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {ClassDeclaration} from '../../reflection';

const PARSED_TS_VERSION = parseFloat(ts.versionMajorMinor);


/**
 * A `Set` of `ts.SyntaxKind`s of `ts.Expression` which are safe to wrap in a `ts.AsExpression`
 * without needing to be wrapped in parentheses.
 *
 * `ts.SyntaxKind` 的 `ts.Expression` 的 `Set` ，可以安全地包装在 `ts.AsExpression`
 * 中，无需用括号括起来。
 *
 * For example, `foo.bar()` is a `ts.CallExpression`, and can be safely cast to `any` with
 * `foo.bar() as any`. however, `foo !== bar` is a `ts.BinaryExpression`, and attempting to cast
 * without the parentheses yields the expression `foo !== bar as any`. This is semantically
 * equivalent to `foo !== (bar as any)`, which is not what was intended. Thus,
 * `ts.BinaryExpression`s need to be wrapped in parentheses before casting.
 *
 * 例如，`foo.bar()` 是 `ts.CallExpression` ，并且可以用 `foo.bar() as any` `any` 但是，`foo !==
 * bar` 是 `ts.BinaryExpression` ，并尝试在不带括号的情况下进行转换，会将表达式 `foo !== bar as any`
 * 。这在语义上等效于 `foo !== (bar as any)` ，这不是预期的。因此，`ts.BinaryExpression`
 * 需要在强制转换之前用括号括起来。
 *
 */
//
const SAFE_TO_CAST_WITHOUT_PARENS: Set<ts.SyntaxKind> = new Set([
  // Expressions which are already parenthesized can be cast without further wrapping.
  ts.SyntaxKind.ParenthesizedExpression,

  // Expressions which form a single lexical unit leave no room for precedence issues with the cast.
  ts.SyntaxKind.Identifier,
  ts.SyntaxKind.CallExpression,
  ts.SyntaxKind.NonNullExpression,
  ts.SyntaxKind.ElementAccessExpression,
  ts.SyntaxKind.PropertyAccessExpression,
  ts.SyntaxKind.ArrayLiteralExpression,
  ts.SyntaxKind.ObjectLiteralExpression,

  // The same goes for various literals.
  ts.SyntaxKind.StringLiteral,
  ts.SyntaxKind.NumericLiteral,
  ts.SyntaxKind.TrueKeyword,
  ts.SyntaxKind.FalseKeyword,
  ts.SyntaxKind.NullKeyword,
  ts.SyntaxKind.UndefinedKeyword,
]);

export function tsCastToAny(expr: ts.Expression): ts.Expression {
  // Wrap `expr` in parentheses if needed (see `SAFE_TO_CAST_WITHOUT_PARENS` above).
  if (!SAFE_TO_CAST_WITHOUT_PARENS.has(expr.kind)) {
    expr = ts.factory.createParenthesizedExpression(expr);
  }

  // The outer expression is always wrapped in parentheses.
  return ts.factory.createParenthesizedExpression(ts.factory.createAsExpression(
      expr, ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)));
}


/**
 * Create an expression which instantiates an element by its HTML tagName.
 *
 * 创建一个表达式，该表达式通过其 HTML tagName 实例化元素。
 *
 * Thanks to narrowing of `document.createElement()`, this expression will have its type inferred
 * based on the tag name, including for custom elements that have appropriate .d.ts definitions.
 *
 * 由于 `document.createElement()` 的缩小，此表达式将根据标签名称推断其类型，包括具有适当 .d.ts
 * 定义的自定义元素。
 *
 */
export function tsCreateElement(tagName: string): ts.Expression {
  const createElement = ts.factory.createPropertyAccessExpression(
      /* expression */ ts.factory.createIdentifier('document'), 'createElement');
  return ts.factory.createCallExpression(
      /* expression */ createElement,
      /* typeArguments */ undefined,
      /* argumentsArray */[ts.factory.createStringLiteral(tagName)]);
}

/**
 * Create a `ts.VariableStatement` which declares a variable without explicit initialization.
 *
 * 创建一个 `ts.VariableStatement` ，它在没有显式初始化的情况下声明变量。
 *
 * The initializer `null!` is used to bypass strict variable initialization checks.
 *
 * 初始化器 `null!` 用于绕过严格的变量初始化检查。
 *
 * Unlike with `tsCreateVariable`, the type of the variable is explicitly specified.
 *
 * 与 `tsCreateVariable` 不同，变量的类型是显式指定的。
 *
 */
export function tsDeclareVariable(id: ts.Identifier, type: ts.TypeNode): ts.VariableStatement {
  const decl = ts.factory.createVariableDeclaration(
      /* name */ id,
      /* exclamationToken */ undefined,
      /* type */ type,
      /* initializer */ ts.factory.createNonNullExpression(ts.factory.createNull()));
  return ts.factory.createVariableStatement(
      /* modifiers */ undefined,
      /* declarationList */[decl]);
}

/**
 * Creates a `ts.TypeQueryNode` for a coerced input.
 *
 * 为强制输入创建 `ts.TypeQueryNode` 。
 *
 * For example: `typeof MatInput.ngAcceptInputType_value`, where MatInput is `typeName` and `value`
 * is the `coercedInputName`.
 *
 * 例如： `typeof MatInput.ngAcceptInputType_value` ，其中 MatInput 是 `typeName` ，`value` 是
 * `coercedInputName` 。
 *
 * @param typeName The `EntityName` of the Directive where the static coerced input is defined.
 *
 * 定义静态强制输入的指令的 `EntityName` 。
 *
 * @param coercedInputName The field name of the coerced input.
 *
 * 强制输入的字段名称。
 *
 */
export function tsCreateTypeQueryForCoercedInput(
    typeName: ts.EntityName, coercedInputName: string): ts.TypeQueryNode {
  return ts.factory.createTypeQueryNode(
      ts.factory.createQualifiedName(typeName, `ngAcceptInputType_${coercedInputName}`));
}

/**
 * Create a `ts.VariableStatement` that initializes a variable with a given expression.
 *
 * 创建一个使用给定表达式初始化变量的 `ts.VariableStatement` 。
 *
 * Unlike with `tsDeclareVariable`, the type of the variable is inferred from the initializer
 * expression.
 *
 * 与 `tsDeclareVariable` 不同，变量的类型是从初始化器表达式中推断的。
 *
 */
export function tsCreateVariable(
    id: ts.Identifier, initializer: ts.Expression): ts.VariableStatement {
  const decl = ts.factory.createVariableDeclaration(
      /* name */ id,
      /* exclamationToken */ undefined,
      /* type */ undefined,
      /* initializer */ initializer);
  return ts.factory.createVariableStatement(
      /* modifiers */ undefined,
      /* declarationList */[decl]);
}

/**
 * Construct a `ts.CallExpression` that calls a method on a receiver.
 *
 * 构造一个调用接收器上的方法的 `ts.CallExpression` 。
 *
 */
export function tsCallMethod(
    receiver: ts.Expression, methodName: string, args: ts.Expression[] = []): ts.CallExpression {
  const methodAccess = ts.factory.createPropertyAccessExpression(receiver, methodName);
  return ts.factory.createCallExpression(
      /* expression */ methodAccess,
      /* typeArguments */ undefined,
      /* argumentsArray */ args);
}

/**
 * Updates a `ts.TypeParameter` declaration.
 *
 * 更新 `ts.TypeParameter` 声明。
 *
 * TODO(crisbeto): this is a backwards-compatibility layer for versions of TypeScript less than 4.7.
 * We should remove it once we have dropped support for the older versions.
 *
 * TODO(crisbeto) ：这是针对低于 4.7 的 TypeScript
 * 版本的向后兼容层。一旦我们放弃了对旧版本的支持，我们就应该将其删除。
 *
 */
export function tsUpdateTypeParameterDeclaration(
    node: ts.TypeParameterDeclaration, name: ts.Identifier, constraint: ts.TypeNode|undefined,
    defaultType: ts.TypeNode|undefined): ts.TypeParameterDeclaration {
  return PARSED_TS_VERSION < 4.7 ?
      ts.factory.updateTypeParameterDeclaration(node, name, constraint, defaultType) :
      (ts.factory.updateTypeParameterDeclaration as any)(
          node, /* modifiers */[], name, constraint, defaultType);
}

export function checkIfClassIsExported(node: ClassDeclaration): boolean {
  // A class is exported if one of two conditions is met:
  // 1) it has the 'export' modifier.
  // 2) it's declared at the top level, and there is an export statement for the class.
  if (node.modifiers !== undefined &&
      node.modifiers.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword)) {
    // Condition 1 is true, the class has an 'export' keyword attached.
    return true;
  } else if (
      node.parent !== undefined && ts.isSourceFile(node.parent) &&
      checkIfFileHasExport(node.parent, node.name.text)) {
    // Condition 2 is true, the class is exported via an 'export {}' statement.
    return true;
  }
  return false;
}

function checkIfFileHasExport(sf: ts.SourceFile, name: string): boolean {
  for (const stmt of sf.statements) {
    if (ts.isExportDeclaration(stmt) && stmt.exportClause !== undefined &&
        ts.isNamedExports(stmt.exportClause)) {
      for (const element of stmt.exportClause.elements) {
        if (element.propertyName === undefined && element.name.text === name) {
          // The named declaration is directly exported.
          return true;
        } else if (element.propertyName !== undefined && element.propertyName.text == name) {
          // The named declaration is exported via an alias.
          return true;
        }
      }
    }
  }
  return false;
}

export function checkIfGenericTypesAreUnbound(node: ClassDeclaration<ts.ClassDeclaration>):
    boolean {
  if (node.typeParameters === undefined) {
    return true;
  }
  return node.typeParameters.every(param => param.constraint === undefined);
}

export function isAccessExpression(node: ts.Node): node is ts.ElementAccessExpression|
    ts.PropertyAccessExpression {
  return ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node);
}

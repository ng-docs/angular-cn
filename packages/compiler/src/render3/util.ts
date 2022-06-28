/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {escapeIdentifier} from '../output/abstract_emitter';
import * as o from '../output/output_ast';

import {Identifiers} from './r3_identifiers';

export function typeWithParameters(type: o.Expression, numParams: number): o.ExpressionType {
  if (numParams === 0) {
    return o.expressionType(type);
  }
  const params: o.Type[] = [];
  for (let i = 0; i < numParams; i++) {
    params.push(o.DYNAMIC_TYPE);
  }
  return o.expressionType(type, undefined, params);
}

export interface R3Reference {
  value: o.Expression;
  type: o.Expression;
}

/**
 * Result of compilation of a render3 code unit, e.g. component, directive, pipe, etc.
 *
 * render3 代码单元的编译结果，例如组件、指令、管道等。
 *
 */
export interface R3CompiledExpression {
  expression: o.Expression;
  type: o.Type;
  statements: o.Statement[];
}

const ANIMATE_SYMBOL_PREFIX = '@';
export function prepareSyntheticPropertyName(name: string) {
  return `${ANIMATE_SYMBOL_PREFIX}${name}`;
}

export function prepareSyntheticListenerName(name: string, phase: string) {
  return `${ANIMATE_SYMBOL_PREFIX}${name}.${phase}`;
}

export function getSafePropertyAccessString(accessor: string, name: string): string {
  const escapedName = escapeIdentifier(name, false, false);
  return escapedName !== name ? `${accessor}[${escapedName}]` : `${accessor}.${name}`;
}

export function prepareSyntheticListenerFunctionName(name: string, phase: string) {
  return `animation_${name}_${phase}`;
}

export function jitOnlyGuardedExpression(expr: o.Expression): o.Expression {
  return guardedExpression('ngJitMode', expr);
}

export function devOnlyGuardedExpression(expr: o.Expression): o.Expression {
  return guardedExpression('ngDevMode', expr);
}

export function guardedExpression(guard: string, expr: o.Expression): o.Expression {
  const guardExpr = new o.ExternalExpr({name: guard, moduleName: null});
  const guardNotDefined = new o.BinaryOperatorExpr(
      o.BinaryOperator.Identical, new o.TypeofExpr(guardExpr), o.literal('undefined'));
  const guardUndefinedOrTrue = new o.BinaryOperatorExpr(
      o.BinaryOperator.Or, guardNotDefined, guardExpr, /* type */ undefined,
      /* sourceSpan */ undefined, true);
  return new o.BinaryOperatorExpr(o.BinaryOperator.And, guardUndefinedOrTrue, expr);
}

export function wrapReference(value: any): R3Reference {
  const wrapped = new o.WrappedNodeExpr(value);
  return {value: wrapped, type: wrapped};
}

export function refsToArray(refs: R3Reference[], shouldForwardDeclare: boolean): o.Expression {
  const values = o.literalArr(refs.map(ref => ref.value));
  return shouldForwardDeclare ? o.fn([], [new o.ReturnStatement(values)]) : values;
}


/**
 * Describes an expression that may have been wrapped in a `forwardRef()` guard.
 *
 * 描述可能已包装在 `forwardRef()` 保护器中的表达式。
 *
 * This is used when describing expressions that can refer to types that may eagerly reference types
 * that have not yet been defined.
 *
 * 在描述可以引用可能热切引用尚未定义类型的类型的表达式时会使用此方法。
 *
 */
export interface MaybeForwardRefExpression<T extends o.Expression = o.Expression> {
  /**
   * The unwrapped expression.
   *
   * 展开的表达式。
   *
   */
  expression: T;
  /**
   * Specified whether the `expression` contains a reference to something that has not yet been
   * defined, and whether the expression is still wrapped in a `forwardRef()` call.
   *
   * 指定 `expression` 是否包含对尚未定义的内容的引用，以及表达式是否仍包装在 `forwardRef()`
   * 调用中。
   *
   * If this value is `ForwardRefHandling.None` then the `expression` is safe to use as-is.
   *
   * 如果此值为 `ForwardRefHandling.None` ，则 `expression` 可以按原样安全使用。
   *
   * Otherwise the `expression` was wrapped in a call to `forwardRef()` and must not be eagerly
   * evaluated. Instead it must be wrapped in a function closure that will be evaluated lazily to
   * allow the definition of the expression to be evaluated first.
   *
   * 否则，`expression` 会被包装在对 `forwardRef()`
   * 的调用中，并且不能被热切估算。相反，它必须包装在一个将延迟估算的函数闭包中，以允许首先估算表达式的定义。
   *
   * In full AOT compilation it can be safe to unwrap the `forwardRef()` call up front if the
   * expression will actually be evaluated lazily inside a function call after the value of
   * `expression` has been defined.
   *
   * 在完整的 AOT 编译中，如果表达式实际上会在定义 `expression`
   * 的值之后在函数调用中延迟估算，则预先解开 `forwardRef()` 调用是安全的。
   *
   * But in other cases, such as partial AOT compilation or JIT compilation the expression will be
   * evaluated eagerly in top level code so will need to continue to be wrapped in a `forwardRef()`
   * call.
   *
   * 但在其他情况下，例如部分 AOT 编译或 JIT
   * 编译，表达式将在顶级代码中被热切估算，因此需要继续包装在 `forwardRef()` 调用中。
   *
   */
  forwardRef: ForwardRefHandling;
}

export function createMayBeForwardRefExpression<T extends o.Expression>(
    expression: T, forwardRef: ForwardRefHandling): MaybeForwardRefExpression<T> {
  return {expression, forwardRef};
}

/**
 * Convert a `MaybeForwardRefExpression` to an `Expression`, possibly wrapping its expression in a
 * `forwardRef()` call.
 *
 * 将 `MaybeForwardRefExpression` 转换为 `Expression` ，可能将其表达式包装在 `forwardRef()` 调用中。
 *
 * If `MaybeForwardRefExpression.forwardRef` is `ForwardRefHandling.Unwrapped` then the expression
 * was originally wrapped in a `forwardRef()` call to prevent the value from being eagerly evaluated
 * in the code.
 *
 * 如果 `MaybeForwardRefExpression.forwardRef` 是 `ForwardRefHandling.Unwrapped`
 * ，则表达式最初被包装在 `forwardRef()` 调用中，以防止在代码中对该值进行热切估算。
 *
 * See `packages/compiler-cli/src/ngtsc/annotations/src/injectable.ts` and
 * `packages/compiler/src/jit_compiler_facade.ts` for more information.
 *
 * 有关更多信息，请参阅 `packages/compiler-cli/src/ngtsc/annotations/src/injectable.ts` 和
 * `packages/compiler/src/jit_compiler_facade.ts` 。
 *
 */
export function convertFromMaybeForwardRefExpression(
    {expression, forwardRef}: MaybeForwardRefExpression): o.Expression {
  switch (forwardRef) {
    case ForwardRefHandling.None:
    case ForwardRefHandling.Wrapped:
      return expression;
    case ForwardRefHandling.Unwrapped:
      return generateForwardRef(expression);
  }
}

/**
 * Generate an expression that has the given `expr` wrapped in the following form:
 *
 * 生成一个表达式，其中的给定 `expr` 以以下形式包装：
 *
 * ```
 * forwardRef(() => expr)
 * ```
 *
 */
export function generateForwardRef(expr: o.Expression): o.Expression {
  return o.importExpr(Identifiers.forwardRef).callFn([o.fn([], [new o.ReturnStatement(expr)])]);
}

/**
 * Specifies how a forward ref has been handled in a MaybeForwardRefExpression
 *
 * 指定在 MaybeForwardRefExpression 中如何处理前向引用
 *
 */
export const enum ForwardRefHandling {
  /**
   * The expression was not wrapped in a `forwardRef()` call in the first place.
   *
   * 首先，表达式没有包装在 `forwardRef()` 调用中。
   *
   */
  None,
  /**
   * The expression is still wrapped in a `forwardRef()` call.
   *
   * 表达式仍然包含在 `forwardRef()` 调用中。
   *
   */
  Wrapped,
  /**
   * The expression was wrapped in a `forwardRef()` call but has since been unwrapped.
   *
   * 该表达式被包装在 `forwardRef()` 调用中，但此后已被解包。
   *
   */
  Unwrapped,
}

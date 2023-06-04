/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as o from '../../../../output/output_ast';
import type {ParseSourceSpan} from '../../../../parse_util';

import {ExpressionKind, OpKind} from './enums';
import {ConsumesVarsTrait, UsesSlotIndex, UsesSlotIndexTrait, UsesVarOffset, UsesVarOffsetTrait} from './traits';

import type {XrefId} from './operations';
import type {CreateOp} from './ops/create';
import type {UpdateOp} from './ops/update';

/**
 * An `o.Expression` subtype representing a logical expression in the intermediate representation.
 *
 * 表示中间表示中的逻辑表达式的 `o.Expression` 子类型。
 *
 */
export type Expression = LexicalReadExpr|ReferenceExpr|ContextExpr|NextContextExpr|
    GetCurrentViewExpr|RestoreViewExpr|ResetViewExpr|ReadVariableExpr|PureFunctionExpr|
    PureFunctionParameterExpr|PipeBindingExpr|PipeBindingVariadicExpr;

/**
 * Transformer type which converts expressions into general `o.Expression`s \(which may be an
 * identity transformation\).
 *
 * 将表达式转换为通用 `o.Expression` 转换器类型（可能是身份转换）。
 *
 */
export type ExpressionTransform = (expr: o.Expression, flags: VisitorContextFlag) => o.Expression;

/**
 * Check whether a given `o.Expression` is a logical IR expression type.
 *
 * 检查给定的 `o.Expression` 是否是逻辑 IR 表达式类型。
 *
 */
export function isIrExpression(expr: o.Expression): expr is Expression {
  return expr instanceof ExpressionBase;
}

/**
 * Base type used for all logical IR expressions.
 *
 * 用于所有逻辑 IR 表达式的基本类型。
 *
 */
export abstract class ExpressionBase extends o.Expression {
  abstract readonly kind: ExpressionKind;

  constructor(sourceSpan: ParseSourceSpan|null = null) {
    super(null, sourceSpan);
  }

  /**
   * Run the transformer against any nested expressions which may be present in this IR expression
   * subtype.
   *
   * 针对此 IR 表达式子类型中可能存在的任何嵌套表达式运行转换器。
   *
   */
  abstract transformInternalExpressions(transform: ExpressionTransform, flags: VisitorContextFlag):
      void;
}

/**
 * Logical expression representing a lexical read of a variable name.
 *
 * 表示变量名称的词法读取的逻辑表达式。
 *
 */
export class LexicalReadExpr extends ExpressionBase {
  override readonly kind = ExpressionKind.LexicalRead;

  constructor(readonly name: string) {
    super();
  }

  override visitExpression(visitor: o.ExpressionVisitor, context: any): void {}

  override isEquivalent(): boolean {
    return false;
  }

  override isConstant(): boolean {
    return false;
  }

  override transformInternalExpressions(): void {}
}

/**
 * Runtime operation to retrieve the value of a local reference.
 *
 * 运行时操作以检索本地引用的值。
 *
 */
export class ReferenceExpr extends ExpressionBase implements UsesSlotIndexTrait {
  override readonly kind = ExpressionKind.Reference;

  readonly[UsesSlotIndex] = true;

  slot: number|null = null;

  constructor(readonly target: XrefId, readonly offset: number) {
    super();
  }

  override visitExpression(): void {}

  override isEquivalent(e: o.Expression): boolean {
    return e instanceof ReferenceExpr && e.target === this.target;
  }

  override isConstant(): boolean {
    return false;
  }

  override transformInternalExpressions(): void {}
}

/**
 * A reference to the current view context \(usually the `ctx` variable in a template function\).
 *
 * 对当前视图上下文的引用（通常是模板函数中的 `ctx` 变量）。
 *
 */
export class ContextExpr extends ExpressionBase {
  override readonly kind = ExpressionKind.Context;

  constructor(readonly view: XrefId) {
    super();
  }

  override visitExpression(): void {}

  override isEquivalent(e: o.Expression): boolean {
    return e instanceof ContextExpr && e.view === this.view;
  }

  override isConstant(): boolean {
    return false;
  }

  override transformInternalExpressions(): void {}
}

/**
 * Runtime operation to navigate to the next view context in the view hierarchy.
 *
 * 运行时操作导航到视图层次结构中的下一个视图上下文。
 *
 */
export class NextContextExpr extends ExpressionBase {
  override readonly kind = ExpressionKind.NextContext;

  steps = 1;

  constructor() {
    super();
  }

  override visitExpression(): void {}

  override isEquivalent(e: o.Expression): boolean {
    return e instanceof NextContextExpr && e.steps === this.steps;
  }

  override isConstant(): boolean {
    return false;
  }

  override transformInternalExpressions(): void {}
}

/**
 * Runtime operation to snapshot the current view context.
 *
 * 快照当前视图上下文的运行时操作。
 *
 * The result of this operation can be stored in a variable and later used with the `RestoreView`
 * operation.
 *
 * 此操作的结果可以存储在一个变量中，稍后与 `RestoreView` 操作一起使用。
 *
 */
export class GetCurrentViewExpr extends ExpressionBase {
  override readonly kind = ExpressionKind.GetCurrentView;

  constructor() {
    super();
  }

  override visitExpression(): void {}

  override isEquivalent(e: o.Expression): boolean {
    return e instanceof GetCurrentViewExpr;
  }

  override isConstant(): boolean {
    return false;
  }

  override transformInternalExpressions(): void {}
}

/**
 * Runtime operation to restore a snapshotted view.
 *
 * 恢复快照视图的运行时操作。
 *
 */
export class RestoreViewExpr extends ExpressionBase {
  override readonly kind = ExpressionKind.RestoreView;

  constructor(public view: XrefId|o.Expression) {
    super();
  }

  override visitExpression(visitor: o.ExpressionVisitor, context: any): void {
    if (typeof this.view !== 'number') {
      this.view.visitExpression(visitor, context);
    }
  }

  override isEquivalent(e: o.Expression): boolean {
    if (!(e instanceof RestoreViewExpr) || typeof e.view !== typeof this.view) {
      return false;
    }

    if (typeof this.view === 'number') {
      return this.view === e.view;
    } else {
      return this.view.isEquivalent(e.view as o.Expression);
    }
  }

  override isConstant(): boolean {
    return false;
  }

  override transformInternalExpressions(transform: ExpressionTransform, flags: VisitorContextFlag):
      void {
    if (typeof this.view !== 'number') {
      this.view = transformExpressionsInExpression(this.view, transform, flags);
    }
  }
}

/**
 * Runtime operation to reset the current view context after `RestoreView`.
 *
 * 在 `RestoreView` 之后重置当前视图上下文的运行时操作。
 *
 */
export class ResetViewExpr extends ExpressionBase {
  override readonly kind = ExpressionKind.ResetView;

  constructor(public expr: o.Expression) {
    super();
  }

  override visitExpression(visitor: o.ExpressionVisitor, context: any): any {
    this.expr.visitExpression(visitor, context);
  }

  override isEquivalent(e: o.Expression): boolean {
    return e instanceof ResetViewExpr && this.expr.isEquivalent(e.expr);
  }

  override isConstant(): boolean {
    return false;
  }

  override transformInternalExpressions(transform: ExpressionTransform, flags: VisitorContextFlag):
      void {
    this.expr = transformExpressionsInExpression(this.expr, transform, flags);
  }
}

/**
 * Read of a variable declared as an `ir.VariableOp` and referenced through its `ir.XrefId`.
 *
 * 读取声明为 `ir.VariableOp` 并通过其 `ir.XrefId` 引用的变量。
 *
 */
export class ReadVariableExpr extends ExpressionBase {
  override readonly kind = ExpressionKind.ReadVariable;
  name: string|null = null;
  constructor(readonly xref: XrefId) {
    super();
  }

  override visitExpression(): void {}

  override isEquivalent(other: o.Expression): boolean {
    return other instanceof ReadVariableExpr && other.xref === this.xref;
  }

  override isConstant(): boolean {
    return false;
  }

  override transformInternalExpressions(): void {}
}

export class PureFunctionExpr extends ExpressionBase implements ConsumesVarsTrait,
                                                                UsesVarOffsetTrait {
  override readonly kind = ExpressionKind.PureFunctionExpr;
  readonly[ConsumesVarsTrait] = true;
  readonly[UsesVarOffset] = true;

  varOffset: number|null = null;

  /**
   * The expression which should be memoized as a pure computation.
   *
   * 应该作为纯计算记忆的表达式。
   *
   * This expression contains internal `PureFunctionParameterExpr`s, which are placeholders for the
   * positional argument expressions in \`args.
   *
   * 该表达式包含内部 `PureFunctionParameterExpr` s，它们是 \`args 中位置参数表达式的占位符。
   *
   */
  body: o.Expression|null;

  /**
   * Positional arguments to the pure function which will memoize the `body` expression, which act
   * as memoization keys.
   *
   * 纯函数的位置参数将记忆 `body` 表达式，充当记忆键。
   *
   */
  args: o.Expression[];

  /**
   * Once extracted to the `ConstantPool`, a reference to the function which defines the computation
   * of `body`.
   *
   * 一旦提取到 `ConstantPool`，对定义 `body` 计算的函数的引用。
   *
   */
  fn: o.Expression|null = null;

  constructor(expression: o.Expression, args: o.Expression[]) {
    super();
    this.body = expression;
    this.args = args;
  }

  override visitExpression(visitor: o.ExpressionVisitor, context: any) {
    this.body?.visitExpression(visitor, context);
    for (const arg of this.args) {
      arg.visitExpression(visitor, context);
    }
  }

  override isEquivalent(other: o.Expression): boolean {
    if (!(other instanceof PureFunctionExpr) || other.args.length !== this.args.length) {
      return false;
    }

    return other.body !== null && this.body !== null && other.body.isEquivalent(this.body) &&
        other.args.every((arg, idx) => arg.isEquivalent(this.args[idx]));
  }

  override isConstant(): boolean {
    return false;
  }

  override transformInternalExpressions(transform: ExpressionTransform, flags: VisitorContextFlag):
      void {
    if (this.body !== null) {
      // TODO: figure out if this is the right flag to pass here.
      this.body = transformExpressionsInExpression(
          this.body, transform, flags | VisitorContextFlag.InChildOperation);
    } else if (this.fn !== null) {
      this.fn = transformExpressionsInExpression(this.fn, transform, flags);
    }

    for (let i = 0; i < this.args.length; i++) {
      this.args[i] = transformExpressionsInExpression(this.args[i], transform, flags);
    }
  }
}

export class PureFunctionParameterExpr extends ExpressionBase {
  override readonly kind = ExpressionKind.PureFunctionParameterExpr;

  constructor(public index: number) {
    super();
  }

  override visitExpression(): void {}

  override isEquivalent(other: o.Expression): boolean {
    return other instanceof PureFunctionParameterExpr && other.index === this.index;
  }

  override isConstant(): boolean {
    return true;
  }

  override transformInternalExpressions(): void {}
}

export class PipeBindingExpr extends ExpressionBase implements UsesSlotIndexTrait,
                                                               ConsumesVarsTrait,
                                                               UsesVarOffsetTrait {
  override readonly kind = ExpressionKind.PipeBinding;
  readonly[UsesSlotIndex] = true;
  readonly[ConsumesVarsTrait] = true;
  readonly[UsesVarOffset] = true;

  slot: number|null = null;
  varOffset: number|null = null;

  constructor(readonly target: XrefId, readonly name: string, readonly args: o.Expression[]) {
    super();
  }

  override visitExpression(visitor: o.ExpressionVisitor, context: any): void {
    for (const arg of this.args) {
      arg.visitExpression(visitor, context);
    }
  }

  override isEquivalent(): boolean {
    return false;
  }

  override isConstant(): boolean {
    return false;
  }

  override transformInternalExpressions(transform: ExpressionTransform, flags: VisitorContextFlag):
      void {
    for (let idx = 0; idx < this.args.length; idx++) {
      this.args[idx] = transformExpressionsInExpression(this.args[idx], transform, flags);
    }
  }
}

export class PipeBindingVariadicExpr extends ExpressionBase implements UsesSlotIndexTrait,
                                                                       ConsumesVarsTrait,
                                                                       UsesVarOffsetTrait {
  override readonly kind = ExpressionKind.PipeBindingVariadic;
  readonly[UsesSlotIndex] = true;
  readonly[ConsumesVarsTrait] = true;
  readonly[UsesVarOffset] = true;

  slot: number|null = null;
  varOffset: number|null = null;

  constructor(
      readonly target: XrefId, readonly name: string, public args: o.Expression,
      public numArgs: number) {
    super();
  }

  override visitExpression(visitor: o.ExpressionVisitor, context: any): void {
    this.args.visitExpression(visitor, context);
  }

  override isEquivalent(): boolean {
    return false;
  }

  override isConstant(): boolean {
    return false;
  }

  override transformInternalExpressions(transform: ExpressionTransform, flags: VisitorContextFlag):
      void {
    this.args = transformExpressionsInExpression(this.args, transform, flags);
  }
}

/**
 * Visits all `Expression`s in the AST of `op` with the `visitor` function.
 *
 * 使用 `visitor` 函数访问 `op` 的 AST 中的所有 `Expression`。
 *
 */
export function visitExpressionsInOp(
    op: CreateOp|UpdateOp, visitor: (expr: o.Expression, flags: VisitorContextFlag) => void): void {
  transformExpressionsInOp(op, (expr, flags) => {
    visitor(expr, flags);
    return expr;
  }, VisitorContextFlag.None);
}

export enum VisitorContextFlag {
  None = 0b0000,
  InChildOperation = 0b0001,
}

/**
 * Transform all `Expression`s in the AST of `op` with the `transform` function.
 *
 * 使用 `transform` 函数转换 `op` 的 AST 中的所有 `Expression`。
 *
 * All such operations will be replaced with the result of applying `transform`, which may be an
 * identity transformation.
 *
 * 所有此类操作都将替换为应用 `transform` 的结果，这可能是身份转换。
 *
 */
export function transformExpressionsInOp(
    op: CreateOp|UpdateOp, transform: ExpressionTransform, flags: VisitorContextFlag): void {
  switch (op.kind) {
    case OpKind.Property:
      op.expression = transformExpressionsInExpression(op.expression, transform, flags);
      break;
    case OpKind.InterpolateProperty:
      for (let i = 0; i < op.expressions.length; i++) {
        op.expressions[i] = transformExpressionsInExpression(op.expressions[i], transform, flags);
      }
      break;
    case OpKind.Statement:
      transformExpressionsInStatement(op.statement, transform, flags);
      break;
    case OpKind.Variable:
      op.initializer = transformExpressionsInExpression(op.initializer, transform, flags);
      break;
    case OpKind.InterpolateText:
      for (let i = 0; i < op.expressions.length; i++) {
        op.expressions[i] = transformExpressionsInExpression(op.expressions[i], transform, flags);
      }
      break;
    case OpKind.Listener:
      for (const innerOp of op.handlerOps) {
        transformExpressionsInOp(innerOp, transform, flags | VisitorContextFlag.InChildOperation);
      }
      break;
    case OpKind.Element:
    case OpKind.ElementStart:
    case OpKind.ElementEnd:
    case OpKind.Container:
    case OpKind.ContainerStart:
    case OpKind.ContainerEnd:
    case OpKind.Template:
    case OpKind.Text:
    case OpKind.Pipe:
    case OpKind.Advance:
      // These operations contain no expressions.
      break;
    default:
      throw new Error(`AssertionError: transformExpressionsInOp doesn't handle ${OpKind[op.kind]}`);
  }
}

/**
 * Transform all `Expression`s in the AST of `expr` with the `transform` function.
 *
 * 使用 `transform` 函数转换 `expr` 的 AST 中的所有 `Expression`。
 *
 * All such operations will be replaced with the result of applying `transform`, which may be an
 * identity transformation.
 *
 * 所有此类操作都将替换为应用 `transform` 的结果，这可能是身份转换。
 *
 */
export function transformExpressionsInExpression(
    expr: o.Expression, transform: ExpressionTransform, flags: VisitorContextFlag): o.Expression {
  if (expr instanceof ExpressionBase) {
    expr.transformInternalExpressions(transform, flags);
  } else if (expr instanceof o.BinaryOperatorExpr) {
    expr.lhs = transformExpressionsInExpression(expr.lhs, transform, flags);
    expr.rhs = transformExpressionsInExpression(expr.rhs, transform, flags);
  } else if (expr instanceof o.ReadPropExpr) {
    expr.receiver = transformExpressionsInExpression(expr.receiver, transform, flags);
  } else if (expr instanceof o.ReadKeyExpr) {
    expr.receiver = transformExpressionsInExpression(expr.receiver, transform, flags);
    expr.index = transformExpressionsInExpression(expr.index, transform, flags);
  } else if (expr instanceof o.WritePropExpr) {
    expr.receiver = transformExpressionsInExpression(expr.receiver, transform, flags);
    expr.value = transformExpressionsInExpression(expr.value, transform, flags);
  } else if (expr instanceof o.WriteKeyExpr) {
    expr.receiver = transformExpressionsInExpression(expr.receiver, transform, flags);
    expr.index = transformExpressionsInExpression(expr.index, transform, flags);
    expr.value = transformExpressionsInExpression(expr.value, transform, flags);
  } else if (expr instanceof o.InvokeFunctionExpr) {
    expr.fn = transformExpressionsInExpression(expr.fn, transform, flags);
    for (let i = 0; i < expr.args.length; i++) {
      expr.args[i] = transformExpressionsInExpression(expr.args[i], transform, flags);
    }
  } else if (expr instanceof o.LiteralArrayExpr) {
    for (let i = 0; i < expr.entries.length; i++) {
      expr.entries[i] = transformExpressionsInExpression(expr.entries[i], transform, flags);
    }
  } else if (expr instanceof o.LiteralMapExpr) {
    for (let i = 0; i < expr.entries.length; i++) {
      expr.entries[i].value =
          transformExpressionsInExpression(expr.entries[i].value, transform, flags);
    }
  } else if (expr instanceof o.ConditionalExpr) {
    expr.condition = transformExpressionsInExpression(expr.condition, transform, flags);
    expr.trueCase = transformExpressionsInExpression(expr.trueCase, transform, flags);
    if (expr.falseCase !== null) {
      expr.falseCase = transformExpressionsInExpression(expr.falseCase, transform, flags);
    }
  } else if (
      expr instanceof o.ReadVarExpr || expr instanceof o.ExternalExpr ||
      expr instanceof o.LiteralExpr) {
    // No action for these types.
  } else {
    throw new Error(`Unhandled expression kind: ${expr.constructor.name}`);
  }
  return transform(expr, flags);
}

/**
 * Transform all `Expression`s in the AST of `stmt` with the `transform` function.
 *
 * 使用 `transform` 函数转换 `stmt` 的 AST 中的所有 `Expression`。
 *
 * All such operations will be replaced with the result of applying `transform`, which may be an
 * identity transformation.
 *
 * 所有此类操作都将替换为应用 `transform` 的结果，这可能是身份转换。
 *
 */
export function transformExpressionsInStatement(
    stmt: o.Statement, transform: ExpressionTransform, flags: VisitorContextFlag): void {
  if (stmt instanceof o.ExpressionStatement) {
    stmt.expr = transformExpressionsInExpression(stmt.expr, transform, flags);
  } else if (stmt instanceof o.ReturnStatement) {
    stmt.value = transformExpressionsInExpression(stmt.value, transform, flags);
  } else {
    throw new Error(`Unhandled statement kind: ${stmt.constructor.name}`);
  }
}

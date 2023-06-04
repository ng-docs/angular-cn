/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as o from '../../../../../output/output_ast';
import {OpKind} from '../enums';
import {Op, XrefId} from '../operations';
import {SemanticVariable} from '../variable';

/**
 * A special `Op` which is used internally in the `OpList` linked list to represent the head and
 * tail nodes of the list.
 *
 * `OpList` 链表内部使用的特殊 `Op`，表示链表的头节点和尾节点。
 *
 * `ListEndOp` is created internally in the `OpList` and should not be instantiated directly.
 *
 * `ListEndOp` 是在 `OpList` 内部创建的，不应直接实例化。
 *
 */
export interface ListEndOp<OpT extends Op<OpT>> extends Op<OpT> {
  kind: OpKind.ListEnd;
}

/**
 * An `Op` which directly wraps an output `Statement`.
 *
 * 直接包装输出 `Statement` `Op`。
 *
 * Often `StatementOp`s are the final result of IR processing.
 *
 * 通常 `StatementOp` 是 IR 处理的最终结果。
 *
 */
export interface StatementOp<OpT extends Op<OpT>> extends Op<OpT> {
  kind: OpKind.Statement;

  /**
   * The output statement.
   *
   * 输出语句。
   *
   */
  statement: o.Statement;
}

/**
 * Create a `StatementOp`.
 *
 * 创建一个 `StatementOp`。
 *
 */
export function createStatementOp<OpT extends Op<OpT>>(statement: o.Statement): StatementOp<OpT> {
  return {
    kind: OpKind.Statement,
    statement,
    ...NEW_OP,
  };
}

/**
 * Operation which declares and initializes a `SemanticVariable`, that is valid either in create or
 * update IR.
 *
 * 声明并初始化 `SemanticVariable` 操作，该操作在创建或更新 IR 中均有效。
 *
 */
export interface VariableOp<OpT extends Op<OpT>> extends Op<OpT> {
  kind: OpKind.Variable;

  /**
   * `XrefId` which identifies this specific variable, and is used to reference this variable from
   * other parts of the IR.
   *
   * `XrefId` 标识此特定变量，并用于从 IR 的其他部分引用此变量。
   *
   */
  xref: XrefId;

  /**
   * The `SemanticVariable` which describes the meaning behind this variable.
   *
   * 描述此变量背后含义的 `SemanticVariable`。
   *
   */
  variable: SemanticVariable;

  /**
   * Expression representing the value of the variable.
   *
   * 表示变量值的表达式。
   *
   */
  initializer: o.Expression;
}

/**
 * Create a `VariableOp`.
 *
 * 创建一个 `VariableOp`。
 *
 */
export function createVariableOp<OpT extends Op<OpT>>(
    xref: XrefId, variable: SemanticVariable, initializer: o.Expression): VariableOp<OpT> {
  return {
    kind: OpKind.Variable,
    xref,
    variable,
    initializer,
    ...NEW_OP,
  };
}

/**
 * Static structure shared by all operations.
 *
 * 所有操作共享的静态结构。
 *
 * Used as a convenience via the spread operator \(`...NEW_OP`\) when creating new operations, and
 * ensures the fields are always in the same order.
 *
 * 在创建新操作时通过扩展运算符 \( `...NEW_OP` \) 方便使用，并确保字段始终处于相同顺序。
 *
 */
export const NEW_OP: Pick<Op<any>, 'debugListId'|'prev'|'next'> = {
  debugListId: null,
  prev: null,
  next: null,
};

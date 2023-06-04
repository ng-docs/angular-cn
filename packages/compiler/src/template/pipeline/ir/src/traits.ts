/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import type {Op, XrefId} from './operations';
import type {Expression} from './expression';

/**
 * Marker symbol for `ConsumesSlotOpTrait`.
 *
 * `ConsumesSlotOpTrait` 的标记符号。
 *
 */
export const ConsumesSlot = Symbol('ConsumesSlot');

/**
 * Marker symbol for `DependsOnSlotContextOpTrait`.
 *
 * `DependsOnSlotContextOpTrait` 的标记符号。
 *
 */
export const DependsOnSlotContext = Symbol('DependsOnSlotContext');

/**
 * Marker symbol for `UsesSlotIndex` trait.
 *
 * `UsesSlotIndex` 特征的标记符号。
 *
 */
export const UsesSlotIndex = Symbol('UsesSlotIndex');

/**
 * Marker symbol for `ConsumesVars` trait.
 *
 * `ConsumesVars` 特征的标记符号。
 *
 */
export const ConsumesVarsTrait = Symbol('ConsumesVars');

/**
 * Marker symbol for `UsesVarOffset` trait.
 *
 * `UsesVarOffset` 特征的标记符号。
 *
 */
export const UsesVarOffset = Symbol('UsesVarOffset');

/**
 * Marks an operation as requiring allocation of one or more data slots for storage.
 *
 * 将一项操作标记为需要分配一个或多个数据槽进行存储。
 *
 */
export interface ConsumesSlotOpTrait {
  readonly[ConsumesSlot]: true;

  /**
   * Assigned data slot \(the starting index, if more than one slot is needed\) for this operation, or
   * `null` if slots have not yet been assigned.
   *
   * 为此操作分配的数据槽（起始索引，如果需要多个槽），如果槽尚未分配，则为 `null`。
   *
   */
  slot: number|null;

  /**
   * The number of slots which will be used by this operation. By default 1, but can be increased if
   * necessary.
   *
   * 此操作将使用的插槽数。默认为 1，但可以根据需要增加。
   *
   */
  numSlotsUsed: number;

  /**
   * `XrefId` of this operation \(e.g. the element stored in the assigned slot\). This `XrefId` is
   * used to link this `ConsumesSlotOpTrait` operation with `DependsOnSlotContextTrait` or
   * `UsesSlotIndexExprTrait` implementors and ensure that the assigned slot is propagated through
   * the IR to all consumers.
   *
   * 此操作的 `XrefId` （例如，存储在分配槽中的元素）。此 `XrefId` 用于将此 `ConsumesSlotOpTrait` 操作与 `DependsOnSlotContextTrait` 或 `UsesSlotIndexExprTrait` 实现程序链接起来，并确保分配的插槽通过 IR 传播到所有消费者。
   *
   */
  xref: XrefId;
}


/**
 * Marks an operation as depending on the runtime's implicit slot context being set to a particular
 * slot.
 *
 * 将操作标记为取决于设置为特定槽的运行时的隐式槽上下文。
 *
 * The runtime has an implicit slot context which is adjusted using the `advance()` instruction
 * during the execution of template update functions. This trait marks an operation as requiring
 * this implicit context to be `advance()`'d to point at a particular slot prior to execution.
 *
 * 运行时有一个隐式槽上下文，它在执行模板更新函数期间使用 `advance()` 指令进行调整。此特征将操作标记为要求此隐式上下文在执行前被 `advance()` 指向特定插槽。
 *
 */
export interface DependsOnSlotContextOpTrait {
  readonly[DependsOnSlotContext]: true;

  /**
   * `XrefId` of the `ConsumesSlotOpTrait` which the implicit slot context must reference before
   * this operation can be executed.
   *
   * `ConsumesSlotOpTrait` 的 `XrefId`，隐式插槽上下文必须在执行此操作之前引用它。
   *
   */
  target: XrefId;
}


/**
 * Marks an expression which requires knowledge of the assigned slot of a given
 * `ConsumesSlotOpTrait` implementor \(e.g. an element slot\).
 *
 * 标记一个表达式，它需要了解给定 `ConsumesSlotOpTrait` 实现者（例如元素槽）的分配槽。
 *
 * During IR processing, assigned slots of `ConsumesSlotOpTrait` implementors will be propagated to
 * `UsesSlotIndexTrait` implementors by matching their `XrefId`s.
 *
 * 在 IR 处理期间，`ConsumesSlotOpTrait` 实现者的分配槽将通过匹配它们的 `XrefId` 传播到 `UsesSlotIndexTrait` 实现者。
 *
 */
export interface UsesSlotIndexTrait {
  readonly[UsesSlotIndex]: true;

  /**
   * `XrefId` of the `ConsumesSlotOpTrait` which this expression needs to reference by its assigned
   * slot index.
   *
   * 此表达式需要通过其分配的插槽索引引用的 `ConsumesSlotOpTrait` 的 `XrefId`。
   *
   */
  target: XrefId;

  /**
   * The slot index of `target`, or `null` if slots have not yet been assigned.
   *
   * `target` 的插槽索引，如果尚未分配插槽，则为 `null`。
   *
   */
  slot: number|null;
}

/**
 * Marker trait indicating that an operation or expression consumes variable storage space.
 *
 * 指示操作或表达式占用变量存储空间的标记特征。
 *
 */
export interface ConsumesVarsTrait {
  [ConsumesVarsTrait]: true;
}

/**
 * Marker trait indicating that an expression requires knowledge of the number of variable storage
 * slots used prior to it.
 *
 * 标记特征表明表达式需要知道在它之前使用的变量存储槽的数量。
 *
 */
export interface UsesVarOffsetTrait {
  [UsesVarOffset]: true;

  varOffset: number|null;
}
/**
 * Default values for most `ConsumesSlotOpTrait` fields \(used with the spread operator to initialize
 * implementors of the trait\).
 *
 * 大多数 `ConsumesSlotOpTrait` 字段的默认值（与扩展运算符一起用于初始化特征的实现者）。
 *
 */
export const TRAIT_CONSUMES_SLOT: Omit<ConsumesSlotOpTrait, 'xref'> = {
  [ConsumesSlot]: true,
  slot: null,
  numSlotsUsed: 1,
} as const;

/**
 * Default values for most `UsesSlotIndexTrait` fields \(used with the spread operator to initialize
 * implementors of the trait\).
 *
 * 大多数 `UsesSlotIndexTrait` 字段的默认值（与扩展运算符一起用于初始化特征的实现者）。
 *
 */
export const TRAIT_USES_SLOT_INDEX: Omit<UsesSlotIndexTrait, 'target'> = {
  [UsesSlotIndex]: true,
  slot: null,
} as const;

/**
 * Default values for most `DependsOnSlotContextOpTrait` fields \(used with the spread operator to
 * initialize implementors of the trait\).
 *
 * 大多数 `DependsOnSlotContextOpTrait` 字段的默认值（与扩展运算符一起用于初始化特征的实现者）。
 *
 */
export const TRAIT_DEPENDS_ON_SLOT_CONTEXT: Omit<DependsOnSlotContextOpTrait, 'target'> = {
  [DependsOnSlotContext]: true,
} as const;

/**
 * Default values for `UsesVars` fields \(used with the spread operator to initialize
 * implementors of the trait\).
 *
 * `UsesVars` 字段的默认值（与扩展运算符一起用于初始化特征的实现者）。
 *
 */
export const TRAIT_CONSUMES_VARS: ConsumesVarsTrait = {
  [ConsumesVarsTrait]: true,
} as const;

/**
 * Default values for `UsesVarOffset` fields \(used with the spread operator to initialize
 * implementors of this trait\).
 *
 * `UsesVarOffset` 字段的默认值（与扩展运算符一起用于初始化此特征的实现者）。
 *
 */
export const TRAIT_USES_VAR_OFFSET: UsesVarOffsetTrait = {
  [UsesVarOffset]: true,
  varOffset: null,
} as const;

/**
 * Test whether an operation implements `ConsumesSlotOpTrait`.
 *
 * 测试操作是否实现了 `ConsumesSlotOpTrait`。
 *
 */
export function hasConsumesSlotTrait<OpT extends Op<OpT>>(op: OpT): op is OpT&ConsumesSlotOpTrait {
  return (op as Partial<ConsumesSlotOpTrait>)[ConsumesSlot] === true;
}

/**
 * Test whether an operation implements `DependsOnSlotContextOpTrait`.
 *
 * 测试操作是否实现 `DependsOnSlotContextOpTrait`。
 *
 */
export function hasDependsOnSlotContextTrait<OpT extends Op<OpT>>(op: OpT): op is OpT&
    DependsOnSlotContextOpTrait {
  return (op as Partial<DependsOnSlotContextOpTrait>)[DependsOnSlotContext] === true;
}

/**
 * Test whether an operation implements `ConsumesVarsTrait`.
 *
 * 测试操作是否实现了 `ConsumesVarsTrait`。
 *
 */
export function hasConsumesVarsTrait<ExprT extends Expression>(expr: ExprT): expr is ExprT&
    ConsumesVarsTrait;
export function hasConsumesVarsTrait<OpT extends Op<OpT>>(op: OpT): op is OpT&ConsumesVarsTrait;
export function hasConsumesVarsTrait(value: any): boolean {
  return (value as Partial<ConsumesVarsTrait>)[ConsumesVarsTrait] === true;
}

/**
 * Test whether an expression implements `UsesVarOffsetTrait`.
 *
 * 测试表达式是否实现 `UsesVarOffsetTrait`。
 *
 */
export function hasUsesVarOffsetTrait<ExprT extends Expression>(expr: ExprT): expr is ExprT&
    UsesVarOffsetTrait {
  return (expr as Partial<UsesVarOffsetTrait>)[UsesVarOffset] === true;
}

/**
 * Test whether an operation or expression implements `UsesSlotIndexTrait`.
 *
 * 测试操作或表达式是否实现 `UsesSlotIndexTrait`。
 *
 */
export function hasUsesSlotIndexTrait<ExprT extends Expression>(expr: ExprT): expr is ExprT&
    UsesSlotIndexTrait;
export function hasUsesSlotIndexTrait<OpT extends Op<OpT>>(op: OpT): op is OpT&UsesSlotIndexTrait;
export function hasUsesSlotIndexTrait(value: any): boolean {
  return (value as Partial<UsesSlotIndexTrait>)[UsesSlotIndex] === true;
}

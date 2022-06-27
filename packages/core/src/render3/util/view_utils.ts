/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {assertDomNode, assertGreaterThan, assertGreaterThanOrEqual, assertIndexInRange, assertLessThan} from '../../util/assert';
import {assertTNode, assertTNodeForLView} from '../assert';
import {LContainer, TYPE} from '../interfaces/container';
import {TConstants, TNode} from '../interfaces/node';
import {isProceduralRenderer} from '../interfaces/renderer';
import {RNode} from '../interfaces/renderer_dom';
import {isLContainer, isLView} from '../interfaces/type_checks';
import {FLAGS, HEADER_OFFSET, HOST, LView, LViewFlags, PARENT, PREORDER_HOOK_FLAGS, RENDERER, TData, TRANSPLANTED_VIEWS_TO_REFRESH, TView} from '../interfaces/view';



/**
 * For efficiency reasons we often put several different data types (`RNode`, `LView`, `LContainer`)
 * in same location in `LView`. This is because we don't want to pre-allocate space for it
 * because the storage is sparse. This file contains utilities for dealing with such data types.
 *
 * 出于效率原因，我们通常将几种不同的数据类型（ `RNode` 、 `LView` 、 `LContainer` ）放在 `LView`
 * 的同一个位置。这是因为我们不想为它预分配空间，因为存储是稀疏的。此文件包含用于处理此类数据类型的工具。
 *
 * How do we know what is stored at a given location in `LView`.
 *
 * 我们怎么知道 `LView` 中给定位置存储的内容。
 *
 * - `Array.isArray(value) === false` => `RNode` (The normal storage value)
 *
 *   `Array.isArray(value) === false` => `RNode` （正常存储值）
 *
 * - `Array.isArray(value) === true` => then the `value[0]` represents the wrapped value.
 *
 *   `Array.isArray(value) === true` => 则 `value[0]` 表示包装后的值。
 *
 *   - `typeof value[TYPE] === 'object'` => `LView`
 *
 *     - This happens when we have a component at a given location
 *
 *       当我们在给定位置有一个组件时，会发生这种情况
 *
 *   - `typeof value[TYPE] === true` => `LContainer`
 *
 *     - This happens when we have `LContainer` binding at a given location.
 *
 *       当我们在给定位置有 `LContainer` 绑定时，会发生这种情况。
 *
 * NOTE: it is assumed that `Array.isArray` and `typeof` operations are very efficient.
 *
 * 注意：假定 `Array.isArray` 和 `typeof` 操作非常高效。
 *
 */

/**
 * Returns `RNode`.
 *
 * 返回 `RNode` 。
 *
 * @param value wrapped value of `RNode`, `LView`, `LContainer`
 *
 * `RNode` 、 `LView` 、 `LContainer` 的包装值
 *
 */
export function unwrapRNode(value: RNode|LView|LContainer): RNode {
  while (Array.isArray(value)) {
    value = value[HOST] as any;
  }
  return value as RNode;
}

/**
 * Returns `LView` or `null` if not found.
 *
 * 如果找不到，则返回 `LView` 或 `null` 。
 *
 * @param value wrapped value of `RNode`, `LView`, `LContainer`
 *
 * `RNode` 、 `LView` 、 `LContainer` 的包装值
 *
 */
export function unwrapLView(value: RNode|LView|LContainer): LView|null {
  while (Array.isArray(value)) {
    // This check is same as `isLView()` but we don't call at as we don't want to call
    // `Array.isArray()` twice and give JITer more work for inlining.
    if (typeof value[TYPE] === 'object') return value as LView;
    value = value[HOST] as any;
  }
  return null;
}

/**
 * Returns `LContainer` or `null` if not found.
 *
 * 如果找不到，则返回 `LContainer` 或 `null` 。
 *
 * @param value wrapped value of `RNode`, `LView`, `LContainer`
 *
 * `RNode` 、 `LView` 、 `LContainer` 的包装值
 *
 */
export function unwrapLContainer(value: RNode|LView|LContainer): LContainer|null {
  while (Array.isArray(value)) {
    // This check is same as `isLContainer()` but we don't call at as we don't want to call
    // `Array.isArray()` twice and give JITer more work for inlining.
    if (value[TYPE] === true) return value as LContainer;
    value = value[HOST] as any;
  }
  return null;
}

/**
 * Retrieves an element value from the provided `viewData`, by unwrapping
 * from any containers, component views, or style contexts.
 *
 * 通过从任何容器、组件视图或样式上下文展开，从提供的 `viewData` 中检索元素值。
 *
 */
export function getNativeByIndex(index: number, lView: LView): RNode {
  ngDevMode && assertIndexInRange(lView, index);
  ngDevMode && assertGreaterThanOrEqual(index, HEADER_OFFSET, 'Expected to be past HEADER_OFFSET');
  return unwrapRNode(lView[index]);
}

/**
 * Retrieve an `RNode` for a given `TNode` and `LView`.
 *
 * 检索给定 `RNode` 和 `TNode` 的 `LView` 。
 *
 * This function guarantees in dev mode to retrieve a non-null `RNode`.
 *
 * 此函数保证在 dev 模式下检索非 null `RNode` 。
 *
 * @param tNode
 * @param lView
 */
export function getNativeByTNode(tNode: TNode, lView: LView): RNode {
  ngDevMode && assertTNodeForLView(tNode, lView);
  ngDevMode && assertIndexInRange(lView, tNode.index);
  const node: RNode = unwrapRNode(lView[tNode.index]);
  ngDevMode && !isProceduralRenderer(lView[RENDERER]) && assertDomNode(node);
  return node;
}

/**
 * Retrieve an `RNode` or `null` for a given `TNode` and `LView`.
 *
 * 检索给定 `TNode` 和 `LView` 的 `RNode` 或 `null` 。
 *
 * Some `TNode`s don't have associated `RNode`s. For example `Projection`
 *
 * 某些 `TNode` 没有关联的 `RNode` 。例如 `Projection`
 *
 * @param tNode
 * @param lView
 */
export function getNativeByTNodeOrNull(tNode: TNode|null, lView: LView): RNode|null {
  const index = tNode === null ? -1 : tNode.index;
  if (index !== -1) {
    ngDevMode && assertTNodeForLView(tNode!, lView);
    const node: RNode|null = unwrapRNode(lView[index]);
    ngDevMode && node !== null && !isProceduralRenderer(lView[RENDERER]) && assertDomNode(node);
    return node;
  }
  return null;
}


// fixme(misko): The return Type should be `TNode|null`
export function getTNode(tView: TView, index: number): TNode {
  ngDevMode && assertGreaterThan(index, -1, 'wrong index for TNode');
  ngDevMode && assertLessThan(index, tView.data.length, 'wrong index for TNode');
  const tNode = tView.data[index] as TNode;
  ngDevMode && tNode !== null && assertTNode(tNode);
  return tNode;
}

/**
 * Retrieves a value from any `LView` or `TData`.
 *
 * 从任何 `LView` 或 `TData` 检索值。
 *
 */
export function load<T>(view: LView|TData, index: number): T {
  ngDevMode && assertIndexInRange(view, index);
  return view[index];
}

export function getComponentLViewByIndex(nodeIndex: number, hostView: LView): LView {
  // Could be an LView or an LContainer. If LContainer, unwrap to find LView.
  ngDevMode && assertIndexInRange(hostView, nodeIndex);
  const slotValue = hostView[nodeIndex];
  const lView = isLView(slotValue) ? slotValue : slotValue[HOST];
  return lView;
}

/**
 * Checks whether a given view is in creation mode
 *
 * 检查给定视图是否处于创建模式
 *
 */
export function isCreationMode(view: LView): boolean {
  return (view[FLAGS] & LViewFlags.CreationMode) === LViewFlags.CreationMode;
}

/**
 * Returns a boolean for whether the view is attached to the change detection tree.
 *
 * 返回视图是否附加到更改检测树的布尔值。
 *
 * Note: This determines whether a view should be checked, not whether it's inserted
 * into a container. For that, you'll want `viewAttachedToContainer` below.
 *
 * 注意：这确定是否要检查视图，而不是确定它是否插入到容器中。为此，你会在下面需要
 * `viewAttachedToContainer` 。
 *
 */
export function viewAttachedToChangeDetector(view: LView): boolean {
  return (view[FLAGS] & LViewFlags.Attached) === LViewFlags.Attached;
}

/**
 * Returns a boolean for whether the view is attached to a container.
 *
 * 返回视图是否附加到容器的布尔值。
 *
 */
export function viewAttachedToContainer(view: LView): boolean {
  return isLContainer(view[PARENT]);
}

/**
 * Returns a constant from `TConstants` instance.
 *
 * 从 `TConstants` 实例返回一个常量。
 *
 */
export function getConstant<T>(consts: TConstants|null, index: null|undefined): null;
export function getConstant<T>(consts: TConstants, index: number): T|null;
export function getConstant<T>(consts: TConstants|null, index: number|null|undefined): T|null;
export function getConstant<T>(consts: TConstants|null, index: number|null|undefined): T|null {
  if (index === null || index === undefined) return null;
  ngDevMode && assertIndexInRange(consts!, index);
  return consts![index] as unknown as T;
}

/**
 * Resets the pre-order hook flags of the view.
 *
 * 重置视图的预购钩子标志。
 *
 * @param lView the LView on which the flags are reset
 *
 * 重置标志的 LView
 *
 */
export function resetPreOrderHookFlags(lView: LView) {
  lView[PREORDER_HOOK_FLAGS] = 0;
}

/**
 * Updates the `TRANSPLANTED_VIEWS_TO_REFRESH` counter on the `LContainer` as well as the parents
 * whose
 *  1\. counter goes from 0 to 1, indicating that there is a new child that has a view to refresh
 *  or
 *  2\. counter goes from 1 to 0, indicating there are no more descendant views to refresh
 *
 * 更新 LContainer 上的 `TRANSPLANTED_VIEWS_TO_REFRESH` 计数器以及 `LContainer` 从 0 到 1
 * 的父级，表明有一个新的子项可以刷新，或者 2.counter 从 1 变为 0，表明没有更多要刷新的后代视图
 *
 */
export function updateTransplantedViewCount(lContainer: LContainer, amount: 1|- 1) {
  lContainer[TRANSPLANTED_VIEWS_TO_REFRESH] += amount;
  let viewOrContainer: LView|LContainer = lContainer;
  let parent: LView|LContainer|null = lContainer[PARENT];
  while (parent !== null &&
         ((amount === 1 && viewOrContainer[TRANSPLANTED_VIEWS_TO_REFRESH] === 1) ||
          (amount === -1 && viewOrContainer[TRANSPLANTED_VIEWS_TO_REFRESH] === 0))) {
    parent[TRANSPLANTED_VIEWS_TO_REFRESH] += amount;
    viewOrContainer = parent;
    parent = parent[PARENT];
  }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {TNode, TNodeFlags} from '../render3/interfaces/node';
import {LView} from '../render3/interfaces/view';

/**
 * The name of an attribute that can be added to the hydration boundary node
 * \(component host node\) to disable hydration for the content within that boundary.
 *
 * 可以添加到水合边界节点（组件宿主节点）以禁用该边界内内容的水合的属性的名称。
 *
 */
export const SKIP_HYDRATION_ATTR_NAME = 'ngSkipHydration';

/**
 * Helper function to check if a given node has the 'ngSkipHydration' attribute
 *
 * 检查给定节点是否具有“ngSkipHydration”属性的辅助函数
 *
 */
export function hasNgSkipHydrationAttr(tNode: TNode): boolean {
  const SKIP_HYDRATION_ATTR_NAME_LOWER_CASE = SKIP_HYDRATION_ATTR_NAME.toLowerCase();

  const attrs = tNode.mergedAttrs;
  if (attrs === null) return false;
  // only ever look at the attribute name and skip the values
  for (let i = 0; i < attrs.length; i += 2) {
    const value = attrs[i];
    // This is a marker, which means that the static attributes section is over,
    // so we can exit early.
    if (typeof value === 'number') return false;
    if (typeof value === 'string' && value.toLowerCase() === SKIP_HYDRATION_ATTR_NAME_LOWER_CASE) {
      return true;
    }
  }
  return false;
}

/**
 * Checks whether a TNode has a flag to indicate that it's a part of
 * a skip hydration block.
 *
 * 检查 TNode 是否有一个标志来指示它是跳过水化块的一部分。
 *
 */
export function hasInSkipHydrationBlockFlag(tNode: TNode): boolean {
  return (tNode.flags & TNodeFlags.inSkipHydrationBlock) === TNodeFlags.inSkipHydrationBlock;
}

/**
 * Helper function that determines if a given node is within a skip hydration block
 * by navigating up the TNode tree to see if any parent nodes have skip hydration
 * attribute.
 *
 * 通过向上导航 TNode 树以查看是否有任何父节点具有跳过水化属性来确定给定节点是否在跳过水化块内的辅助函数。
 *
 * TODO\(akushnir\): this function should contain the logic of `hasInSkipHydrationBlockFlag`,
 * there is no need to traverse parent nodes when we have a TNode flag \(which would also
 * make this lookup O\(1\)\).
 *
 * TODO\(akushnir\)：这个函数应该包含 `hasInSkipHydrationBlockFlag` 的逻辑，当我们有一个 TNode 标志时不需要遍历父节点（这也会使这个查找 O\(1\)）。
 *
 */
export function isInSkipHydrationBlock(tNode: TNode): boolean {
  let currentTNode: TNode|null = tNode.parent;
  while (currentTNode) {
    if (hasNgSkipHydrationAttr(currentTNode)) {
      return true;
    }
    currentTNode = currentTNode.parent;
  }
  return false;
}

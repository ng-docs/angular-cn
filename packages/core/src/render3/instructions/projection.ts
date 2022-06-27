/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {newArray} from '../../util/array_utils';
import {TAttributes, TElementNode, TNode, TNodeFlags, TNodeType} from '../interfaces/node';
import {ProjectionSlots} from '../interfaces/projection';
import {DECLARATION_COMPONENT_VIEW, HEADER_OFFSET, T_HOST} from '../interfaces/view';
import {applyProjection} from '../node_manipulation';
import {getProjectAsAttrValue, isNodeMatchingSelectorList, isSelectorInSelectorList} from '../node_selector_matcher';
import {getLView, getTView, setCurrentTNodeAsNotParent} from '../state';

import {getOrCreateTNode} from './shared';



/**
 * Checks a given node against matching projection slots and returns the
 * determined slot index. Returns "null" if no slot matched the given node.
 *
 * 根据匹配的投影槽检查给定节点并返回确定的槽索引。如果没有槽与给定节点匹配，则返回“null”。
 *
 * This function takes into account the parsed ngProjectAs selector from the
 * node's attributes. If present, it will check whether the ngProjectAs selector
 * matches any of the projection slot selectors.
 *
 * 此函数会考虑从节点属性中解析的 ngProjectAs 选择器。如果存在，它将检查 ngProjectAs
 * 选择器是否与任何投影槽选择器匹配。
 *
 */
export function matchingProjectionSlotIndex(tNode: TNode, projectionSlots: ProjectionSlots): number|
    null {
  let wildcardNgContentIndex = null;
  const ngProjectAsAttrVal = getProjectAsAttrValue(tNode);
  for (let i = 0; i < projectionSlots.length; i++) {
    const slotValue = projectionSlots[i];
    // The last wildcard projection slot should match all nodes which aren't matching
    // any selector. This is necessary to be backwards compatible with view engine.
    if (slotValue === '*') {
      wildcardNgContentIndex = i;
      continue;
    }
    // If we ran into an `ngProjectAs` attribute, we should match its parsed selector
    // to the list of selectors, otherwise we fall back to matching against the node.
    if (ngProjectAsAttrVal === null ?
            isNodeMatchingSelectorList(tNode, slotValue, /* isProjectionMode */ true) :
            isSelectorInSelectorList(ngProjectAsAttrVal, slotValue)) {
      return i;  // first matching selector "captures" a given node
    }
  }
  return wildcardNgContentIndex;
}

/**
 * Instruction to distribute projectable nodes among <ng-content> occurrences in a given template.
 * It takes all the selectors from the entire component's template and decides where
 * each projected node belongs (it re-distributes nodes among "buckets" where each "bucket" is
 * backed by a selector).
 *
 * 在之间分配可投影节点的操作指南<ng-content>在给定模板中的出现。它从整个组件的模板中获取所有选择器，并确定每个投影节点的所属位置（它会在“桶”中重新分配节点，其中每个“桶”都由选择器支持）。
 *
 * This function requires CSS selectors to be provided in 2 forms: parsed (by a compiler) and text,
 * un-parsed form.
 *
 * 此函数需要 CSS 选择器以 2 种形式提供：解析的（由编译器）和文本的未解析形式。
 *
 * The parsed form is needed for efficient matching of a node against a given CSS selector.
 * The un-parsed, textual form is needed for support of the ngProjectAs attribute.
 *
 * 需要解析的形式来有效地将节点与给定的 CSS 选择器进行匹配。支持 ngProjectAs
 * 属性需要未解析的文本形式。
 *
 * Having a CSS selector in 2 different formats is not ideal, but alternatives have even more
 * drawbacks:
 *
 * 拥有 2 种不同格式的 CSS 选择器并不理想，但替代方案有更多缺点：
 *
 * - having only a textual form would require runtime parsing of CSS selectors;
 *
 *   只有文本形式需要对 CSS 选择器进行运行时解析；
 *
 * - we can't have only a parsed as we can't re-construct textual form from it (as entered by a
 *   template author).
 *
 *   我们不能只有一个 parsed ，因为我们不能从中重新构建文本形式（由模板作者输入）。
 *
 * @param projectionSlots? A collection of projection slots. A projection slot can be based
 *        on a parsed CSS selectors or set to the wildcard selector ("*") in order to match
 *        all nodes which do not match any selector. If not specified, a single wildcard
 *        selector projection slot will be defined.
 * @codeGenApi
 */
export function ɵɵprojectionDef(projectionSlots?: ProjectionSlots): void {
  const componentNode = getLView()[DECLARATION_COMPONENT_VIEW][T_HOST] as TElementNode;

  if (!componentNode.projection) {
    // If no explicit projection slots are defined, fall back to a single
    // projection slot with the wildcard selector.
    const numProjectionSlots = projectionSlots ? projectionSlots.length : 1;
    const projectionHeads: (TNode|null)[] = componentNode.projection =
        newArray(numProjectionSlots, null! as TNode);
    const tails: (TNode|null)[] = projectionHeads.slice();

    let componentChild: TNode|null = componentNode.child;

    while (componentChild !== null) {
      const slotIndex =
          projectionSlots ? matchingProjectionSlotIndex(componentChild, projectionSlots) : 0;

      if (slotIndex !== null) {
        if (tails[slotIndex]) {
          tails[slotIndex]!.projectionNext = componentChild;
        } else {
          projectionHeads[slotIndex] = componentChild;
        }
        tails[slotIndex] = componentChild;
      }

      componentChild = componentChild.next;
    }
  }
}


/**
 * Inserts previously re-distributed projected nodes. This instruction must be preceded by a call
 * to the projectionDef instruction.
 *
 * 插入以前重新分布的投影节点。此指令必须在调用 projectDef 指令之前。
 *
 * @param nodeIndex
 * @param selectorIndex:
 *        - 0 when the selector is `*` (or unspecified as this is the default value),
 *        - 1 based index of the selector from the {@link projectionDef}
 * @codeGenApi
 */
export function ɵɵprojection(
    nodeIndex: number, selectorIndex: number = 0, attrs?: TAttributes): void {
  const lView = getLView();
  const tView = getTView();
  const tProjectionNode =
      getOrCreateTNode(tView, HEADER_OFFSET + nodeIndex, TNodeType.Projection, null, attrs || null);

  // We can't use viewData[HOST_NODE] because projection nodes can be nested in embedded views.
  if (tProjectionNode.projection === null) tProjectionNode.projection = selectorIndex;

  // `<ng-content>` has no content
  setCurrentTNodeAsNotParent();

  if ((tProjectionNode.flags & TNodeFlags.isDetached) !== TNodeFlags.isDetached) {
    // re-distribution of projectable nodes is stored on a component's view level
    applyProjection(tView, lView, tProjectionNode);
  }
}

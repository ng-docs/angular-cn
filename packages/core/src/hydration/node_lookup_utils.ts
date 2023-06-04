/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {TNode, TNodeType} from '../render3/interfaces/node';
import {RElement, RNode} from '../render3/interfaces/renderer_dom';
import {DECLARATION_COMPONENT_VIEW, HEADER_OFFSET, HOST, LView, TView} from '../render3/interfaces/view';
import {getFirstNativeNode} from '../render3/node_manipulation';
import {ɵɵresolveBody} from '../render3/util/misc_utils';
import {renderStringify} from '../render3/util/stringify_utils';
import {getNativeByTNode, unwrapRNode} from '../render3/util/view_utils';
import {assertDefined} from '../util/assert';

import {compressNodeLocation, decompressNodeLocation} from './compression';
import {nodeNotFoundAtPathError, nodeNotFoundError, validateSiblingNodeExists} from './error_handling';
import {DehydratedView, NodeNavigationStep, NODES, REFERENCE_NODE_BODY, REFERENCE_NODE_HOST} from './interfaces';
import {calcSerializedContainerSize, getSegmentHead} from './utils';


/**
 * Whether current TNode is a first node in an <ng-container>.
 *
 * 当前 TNode 是否是一个节点中的第一个节点
 *
 */
function isFirstElementInNgContainer(tNode: TNode): boolean {
  return !tNode.prev && tNode.parent?.type === TNodeType.ElementContainer;
}

/**
 * Returns an instruction index \(subtracting HEADER_OFFSET\).
 *
 * 返回指令索引（减去 HEADER_OFFSET）。
 *
 */
function getNoOffsetIndex(tNode: TNode): number {
  return tNode.index - HEADER_OFFSET;
}

/**
 * Locate a node in DOM tree that corresponds to a given TNode.
 *
 * 在 DOM 树中定位与给定 TNode 对应的节点。
 *
 * @param hydrationInfo The hydration annotation data
 *
 * 水合注释数据
 *
 * @param tView the current tView
 *
 * 当前的 TView
 * @param lView the current lView
 *
 * 当前 lView
 *
 * @param tNode the current tNode
 *
 * 当前 TNode
 * @returns
 *
 * an RNode that represents a given tNode
 *
 * 表示给定 tNode 的 RNode
 *
 */
export function locateNextRNode<T extends RNode>(
    hydrationInfo: DehydratedView, tView: TView, lView: LView<unknown>, tNode: TNode): T|null {
  let native: RNode|null = null;
  const noOffsetIndex = getNoOffsetIndex(tNode);
  const nodes = hydrationInfo.data[NODES];
  if (nodes?.[noOffsetIndex]) {
    // We know the exact location of the node.
    native = locateRNodeByPath(nodes[noOffsetIndex], lView);
  } else if (tView.firstChild === tNode) {
    // We create a first node in this view, so we use a reference
    // to the first child in this DOM segment.
    native = hydrationInfo.firstChild;
  } else {
    // Locate a node based on a previous sibling or a parent node.
    const previousTNodeParent = tNode.prev === null;
    const previousTNode = (tNode.prev ?? tNode.parent)!;
    ngDevMode &&
        assertDefined(
            previousTNode,
            'Unexpected state: current TNode does not have a connection ' +
                'to the previous node or a parent node.');
    if (isFirstElementInNgContainer(tNode)) {
      const noOffsetParentIndex = getNoOffsetIndex(tNode.parent!);
      native = getSegmentHead(hydrationInfo, noOffsetParentIndex);
    } else {
      let previousRElement = getNativeByTNode(previousTNode, lView);
      if (previousTNodeParent) {
        native = (previousRElement as RElement).firstChild;
      } else {
        // If the previous node is an element, but it also has container info,
        // this means that we are processing a node like `<div #vcrTarget>`, which is
        // represented in the DOM as `<div></div>...<!--container-->`.
        // In this case, there are nodes *after* this element and we need to skip
        // all of them to reach an element that we are looking for.
        const noOffsetPrevSiblingIndex = getNoOffsetIndex(previousTNode);
        const segmentHead = getSegmentHead(hydrationInfo, noOffsetPrevSiblingIndex);
        if (previousTNode.type === TNodeType.Element && segmentHead) {
          const numRootNodesToSkip =
              calcSerializedContainerSize(hydrationInfo, noOffsetPrevSiblingIndex);
          // `+1` stands for an anchor comment node after all the views in this container.
          const nodesToSkip = numRootNodesToSkip + 1;
          // First node after this segment.
          native = siblingAfter(nodesToSkip, segmentHead);
        } else {
          native = previousRElement.nextSibling;
        }
      }
    }
  }
  return native as T;
}

/**
 * Skips over a specified number of nodes and returns the next sibling node after that.
 *
 * 跳过指定数量的节点并返回其后的下一个兄弟节点。
 *
 */
export function siblingAfter<T extends RNode>(skip: number, from: RNode): T|null {
  let currentNode = from;
  for (let i = 0; i < skip; i++) {
    ngDevMode && validateSiblingNodeExists(currentNode);
    currentNode = currentNode.nextSibling!;
  }
  return currentNode as T;
}

/**
 * Helper function to produce a string representation of the navigation steps
 * \(in terms of `nextSibling` and `firstChild` navigations\). Used in error
 * messages in dev mode.
 *
 * 生成导航步骤的字符串表示形式的辅助函数（根据 `nextSibling` 和 `firstChild` 导航）。 在开发模式下用于错误消息。
 *
 */
function stringifyNavigationInstructions(instructions: (number|NodeNavigationStep)[]): string {
  const container = [];
  for (let i = 0; i < instructions.length; i += 2) {
    const step = instructions[i];
    const repeat = instructions[i + 1] as number;
    for (let r = 0; r < repeat; r++) {
      container.push(step === NodeNavigationStep.FirstChild ? 'firstChild' : 'nextSibling');
    }
  }
  return container.join('.');
}

/**
 * Helper function that navigates from a starting point node \(the `from` node\)
 * using provided set of navigation instructions \(within `path` argument\).
 *
 * 使用提供的导航指令集（ `from` `path` 参数内）从起点节点（起始节点）导航的辅助函数。
 *
 */
function navigateToNode(from: Node, instructions: (number|NodeNavigationStep)[]): RNode {
  let node = from;
  for (let i = 0; i < instructions.length; i += 2) {
    const step = instructions[i];
    const repeat = instructions[i + 1] as number;
    for (let r = 0; r < repeat; r++) {
      if (ngDevMode && !node) {
        throw nodeNotFoundAtPathError(from, stringifyNavigationInstructions(instructions));
      }
      switch (step) {
        case NodeNavigationStep.FirstChild:
          node = node.firstChild!;
          break;
        case NodeNavigationStep.NextSibling:
          node = node.nextSibling!;
          break;
      }
    }
  }
  if (ngDevMode && !node) {
    throw nodeNotFoundAtPathError(from, stringifyNavigationInstructions(instructions));
  }
  return node as RNode;
}

/**
 * Locates an RNode given a set of navigation instructions \(which also contains
 * a starting point node info\).
 *
 * 给定一组导航指令（其中还包含起点节点信息）定位 RNode。
 *
 */
function locateRNodeByPath(path: string, lView: LView): RNode {
  const [referenceNode, ...navigationInstructions] = decompressNodeLocation(path);
  let ref: Element;
  if (referenceNode === REFERENCE_NODE_HOST) {
    ref = lView[DECLARATION_COMPONENT_VIEW][HOST] as unknown as Element;
  } else if (referenceNode === REFERENCE_NODE_BODY) {
    ref = ɵɵresolveBody(
        lView[DECLARATION_COMPONENT_VIEW][HOST] as RElement & {ownerDocument: Document});
  } else {
    const parentElementId = Number(referenceNode);
    ref = unwrapRNode((lView as any)[parentElementId + HEADER_OFFSET]) as Element;
  }
  return navigateToNode(ref, navigationInstructions);
}

/**
 * Generate a list of DOM navigation operations to get from node `start` to node `finish`.
 *
 * 生成从节点 `start` 到节点 `finish` DOM 导航操作列表。
 *
 * Note: assumes that node `start` occurs before node `finish` in an in-order traversal of the DOM
 * tree. That is, we should be able to get from `start` to `finish` purely by using `.firstChild`
 * and `.nextSibling` operations.
 *
 * 注意：假设在 DOM 树的有序遍历中节点 `start` 发生在节点 `finish` 之前。 也就是说，我们应该能够完全通过使用 `.firstChild` 和 `.nextSibling` 操作 `start` `finish` 。
 *
 */
export function navigateBetween(start: Node, finish: Node): NodeNavigationStep[]|null {
  if (start === finish) {
    return [];
  } else if (start.parentElement == null || finish.parentElement == null) {
    return null;
  } else if (start.parentElement === finish.parentElement) {
    return navigateBetweenSiblings(start, finish);
  } else {
    // `finish` is a child of its parent, so the parent will always have a child.
    const parent = finish.parentElement!;

    const parentPath = navigateBetween(start, parent);
    const childPath = navigateBetween(parent.firstChild!, finish);
    if (!parentPath || !childPath) return null;

    return [
      // First navigate to `finish`'s parent
      ...parentPath,
      // Then to its first child.
      NodeNavigationStep.FirstChild,
      // And finally from that node to `finish` (maybe a no-op if we're already there).
      ...childPath,
    ];
  }
}

/**
 * Calculates a path between 2 sibling nodes \(generates a number of `NextSibling` navigations\).
 * Returns `null` if no such path exists between the given nodes.
 *
 * 计算 2 个兄弟节点之间的路径（生成多个 `NextSibling` 导航）。 如果给定节点之间不存在这样的路径，则返回 `null` 。
 *
 */
function navigateBetweenSiblings(start: Node, finish: Node): NodeNavigationStep[]|null {
  const nav: NodeNavigationStep[] = [];
  let node: Node|null = null;
  for (node = start; node != null && node !== finish; node = node.nextSibling) {
    nav.push(NodeNavigationStep.NextSibling);
  }
  // If the `node` becomes `null` or `undefined` at the end, that means that we
  // didn't find the `end` node, thus return `null` (which would trigger serialization
  // error to be produced).
  return node == null ? null : nav;
}

/**
 * Calculates a path between 2 nodes in terms of `nextSibling` and `firstChild`
 * navigations:
 *
 * 根据 `nextSibling` 和 `firstChild` 导航计算 2 个节点之间的路径：
 *
 * - the `from` node is a known node, used as an starting point for the lookup
 *   \(the `fromNodeName` argument is a string representation of the node\).
 *
 *   `from` 节点是已知节点，用作查找的起点（ `fromNodeName` 参数是节点的字符串表示形式）。
 *
 * - the `to` node is a node that the runtime logic would be looking up,
 *   using the path generated by this function.
 *
 *   `to` 节点是运行时逻辑将使用此函数生成的路径查找的节点。
 *
 */
export function calcPathBetween(from: Node, to: Node, fromNodeName: string): string|null {
  const path = navigateBetween(from, to);
  return path === null ? null : compressNodeLocation(fromNodeName, path);
}

/**
 * Invoked at serialization time \(on the server\) when a set of navigation
 * instructions needs to be generated for a TNode.
 *
 * 当需要为 TNode 生成一组导航指令时，在序列化时（在服务器上）调用。
 *
 */
export function calcPathForNode(tNode: TNode, lView: LView): string {
  const parentTNode = tNode.parent;
  let parentIndex: number|string;
  let parentRNode: RNode;
  let referenceNodeName: string;
  if (parentTNode === null || !(parentTNode.type & TNodeType.AnyRNode)) {
    // If there is no parent TNode or a parent TNode does not represent an RNode
    // (i.e. not a DOM node), use component host element as a reference node.
    parentIndex = referenceNodeName = REFERENCE_NODE_HOST;
    parentRNode = lView[DECLARATION_COMPONENT_VIEW][HOST]!;
  } else {
    // Use parent TNode as a reference node.
    parentIndex = parentTNode.index;
    parentRNode = unwrapRNode(lView[parentIndex]);
    referenceNodeName = renderStringify(parentIndex - HEADER_OFFSET);
  }
  let rNode = unwrapRNode(lView[tNode.index]);
  if (tNode.type & TNodeType.AnyContainer) {
    // For <ng-container> nodes, instead of serializing a reference
    // to the anchor comment node, serialize a location of the first
    // DOM element. Paired with the container size (serialized as a part
    // of `ngh.containers`), it should give enough information for runtime
    // to hydrate nodes in this container.
    const firstRNode = getFirstNativeNode(lView, tNode);

    // If container is not empty, use a reference to the first element,
    // otherwise, rNode would point to an anchor comment node.
    if (firstRNode) {
      rNode = firstRNode;
    }
  }
  let path: string|null = calcPathBetween(parentRNode as Node, rNode as Node, referenceNodeName);
  if (path === null && parentRNode !== rNode) {
    // Searching for a path between elements within a host node failed.
    // Trying to find a path to an element starting from the `document.body` instead.
    //
    // Important note: this type of reference is relatively unstable, since Angular
    // may not be able to control parts of the page that the runtime logic navigates
    // through. This is mostly needed to cover "portals" use-case (like menus, dialog boxes,
    // etc), where nodes are content-projected (including direct DOM manipulations) outside
    // of the host node. The better solution is to provide APIs to work with "portals",
    // at which point this code path would not be needed.
    const body = (parentRNode as Node).ownerDocument!.body as Node;
    path = calcPathBetween(body, rNode as Node, REFERENCE_NODE_BODY);

    if (path === null) {
      // If the path is still empty, it's likely that this node is detached and
      // won't be found during hydration.
      throw nodeNotFoundError(lView, tNode);
    }
  }
  return path!;
}

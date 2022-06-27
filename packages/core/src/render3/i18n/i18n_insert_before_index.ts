/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {assertEqual} from '../../util/assert';
import {TNode, TNodeType} from '../interfaces/node';
import {setI18nHandling} from '../node_manipulation';
import {getInsertInFrontOfRNodeWithI18n, processI18nInsertBefore} from '../node_manipulation_i18n';

/**
 * Add `tNode` to `previousTNodes` list and update relevant `TNode`s in `previousTNodes` list
 * `tNode.insertBeforeIndex`.
 *
 * 将 `tNode` 添加到 `previousTNodes` 列表，并更新 `previousTNodes` 列表 `tNode.insertBeforeIndex`
 * `TNode`
 *
 * Things to keep in mind:
 * 1\. All i18n text nodes are encoded as `TNodeType.Element` and are created eagerly by the
 *    `ɵɵi18nStart` instruction.
 * 2\. All `TNodeType.Placeholder` `TNodes` are elements which will be created later by
 *    `ɵɵelementStart` instruction.
 * 3\. `ɵɵelementStart` instruction will create `TNode`s in the ascending `TNode.index` order. (So a
 *    smaller index `TNode` is guaranteed to be created before a larger one)
 *
 * 要记住的事情： 1.所有 i18n 文本节点都被编码为 `TNodeType.Element` ，并且由 `ɵɵi18nStart`
 * 指令立即创建。 2.所有 `TNodeType.Placeholder` `TNodes` 都是稍后将由 `ɵɵelementStart`
 * 指令创建的元素。 3. `ɵɵelementStart` 指令将按 `TNode` `TNode.index` （因此可以保证在较大的索引
 * `TNode` 之前创建）
 *
 * We use the above three invariants to determine `TNode.insertBeforeIndex`.
 *
 * 我们使用上述三个不变量来确定 `TNode.insertBeforeIndex` 。
 *
 * In an ideal world `TNode.insertBeforeIndex` would always be `TNode.next.index`. However,
 * this will not work because `TNode.next.index` may be larger than `TNode.index` which means that
 * the next node is not yet created and therefore we can't insert in front of it.
 *
 * 在理想的世界 `TNode.insertBeforeIndex` 将始终是 `TNode.next.index` 。但是，这将行不通，因为
 * `TNode.next.index` 可能比 `TNode.index`
 * 大，这意味着下一个节点尚未创建，因此我们不能在它前面插入。
 *
 * Rule1: `TNode.insertBeforeIndex = null` if `TNode.next === null` (Initial condition, as we don't
 *        know if there will be further `TNode`s inserted after.)
 * Rule2: If `previousTNode` is created after the `tNode` being inserted, then
 *        `previousTNode.insertBeforeNode = tNode.index` (So when a new `tNode` is added we check
 *        previous to see if we can update its `insertBeforeTNode`)
 *
 * 规则 1： `TNode.insertBeforeIndex = null` if `TNode.next === null`
 * （初始条件，因为我们不知道之后是否会插入更多 `TNode` 。）规则 2：如果 `previousTNode` 是在插入
 * `previousTNode.insertBeforeNode = tNode.index` 之后创建，则 `tNode`
 * `previousTNode.insertBeforeNode = tNode.index` （因此，当添加新的 `tNode`
 * 时，我们会检查上一个以查看是否可以更新其 `insertBeforeTNode` ）
 *
 * See `TNode.insertBeforeIndex` for more context.
 *
 * 有关更多上下文，请参阅 `TNode.insertBeforeIndex` 。
 *
 * @param previousTNodes A list of previous TNodes so that we can easily traverse `TNode`s in
 *     reverse order. (If `TNode` would have `previous` this would not be necessary.)
 *
 * 以前的 TNode 的列表，以便我们可以轻松地以相反的顺序遍历 `TNode` 。 （如果 `TNode` 有 `previous`
 * 的，则没有必要。）
 *
 * @param newTNode A TNode to add to the `previousTNodes` list.
 *
 * 要添加到 `previousTNodes` 列表的 TNode。
 *
 */
export function addTNodeAndUpdateInsertBeforeIndex(previousTNodes: TNode[], newTNode: TNode) {
  // Start with Rule1
  ngDevMode &&
      assertEqual(newTNode.insertBeforeIndex, null, 'We expect that insertBeforeIndex is not set');

  previousTNodes.push(newTNode);
  if (previousTNodes.length > 1) {
    for (let i = previousTNodes.length - 2; i >= 0; i--) {
      const existingTNode = previousTNodes[i];
      // Text nodes are created eagerly and so they don't need their `indexBeforeIndex` updated.
      // It is safe to ignore them.
      if (!isI18nText(existingTNode)) {
        if (isNewTNodeCreatedBefore(existingTNode, newTNode) &&
            getInsertBeforeIndex(existingTNode) === null) {
          // If it was created before us in time, (and it does not yet have `insertBeforeIndex`)
          // then add the `insertBeforeIndex`.
          setInsertBeforeIndex(existingTNode, newTNode.index);
        }
      }
    }
  }
}

function isI18nText(tNode: TNode): boolean {
  return !(tNode.type & TNodeType.Placeholder);
}

function isNewTNodeCreatedBefore(existingTNode: TNode, newTNode: TNode): boolean {
  return isI18nText(newTNode) || existingTNode.index > newTNode.index;
}

function getInsertBeforeIndex(tNode: TNode): number|null {
  const index = tNode.insertBeforeIndex;
  return Array.isArray(index) ? index[0] : index;
}

function setInsertBeforeIndex(tNode: TNode, value: number): void {
  const index = tNode.insertBeforeIndex;
  if (Array.isArray(index)) {
    // Array is stored if we have to insert child nodes. See `TNode.insertBeforeIndex`
    index[0] = value;
  } else {
    setI18nHandling(getInsertInFrontOfRNodeWithI18n, processI18nInsertBefore);
    tNode.insertBeforeIndex = value;
  }
}

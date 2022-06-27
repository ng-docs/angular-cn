/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {assertEqual, assertGreaterThan, assertGreaterThanOrEqual, throwError} from '../../util/assert';
import {assertTIcu, assertTNode} from '../assert';
import {createTNodeAtIndex} from '../instructions/shared';
import {IcuCreateOpCode, TIcu} from '../interfaces/i18n';
import {TIcuContainerNode, TNode, TNodeType} from '../interfaces/node';
import {LView, TView} from '../interfaces/view';
import {assertTNodeType} from '../node_assert';
import {setI18nHandling} from '../node_manipulation';
import {getInsertInFrontOfRNodeWithI18n, processI18nInsertBefore} from '../node_manipulation_i18n';

import {addTNodeAndUpdateInsertBeforeIndex} from './i18n_insert_before_index';


/**
 * Retrieve `TIcu` at a given `index`.
 *
 * 在给定的 `index` 处检索 `TIcu` 。
 *
 * The `TIcu` can be stored either directly (if it is nested ICU) OR
 * it is stored inside tho `TIcuContainer` if it is top level ICU.
 *
 * `TIcu` 可以直接存储（如果是嵌套 ICU），如果是顶级 ICU，则可以存储在 `TIcuContainer` 中。
 *
 * The reason for this is that the top level ICU need a `TNode` so that they are part of the render
 * tree, but nested ICU's have no TNode, because we don't know ahead of time if the nested ICU is
 * expressed (parent ICU may have selected a case which does not contain it.)
 *
 * 原因是顶级 ICU 需要一个 `TNode` ，以便它们是渲染树的一部分，但嵌套 ICU 没有
 * TNode，因为我们无法提前知道嵌套 ICU 是否被表达（父 ICU 可能有选择了一个不包含它的案例。）
 *
 * @param tView Current `TView`.
 *
 * 当前 `TView` 。
 *
 * @param index Index where the value should be read from.
 *
 * 应该从中读取值的索引。
 *
 */
export function getTIcu(tView: TView, index: number): TIcu|null {
  const value = tView.data[index] as null | TIcu | TIcuContainerNode | string;
  if (value === null || typeof value === 'string') return null;
  if (ngDevMode &&
      !(value.hasOwnProperty('tViews') || value.hasOwnProperty('currentCaseLViewIndex'))) {
    throwError('We expect to get \'null\'|\'TIcu\'|\'TIcuContainer\', but got: ' + value);
  }
  // Here the `value.hasOwnProperty('currentCaseLViewIndex')` is a polymorphic read as it can be
  // either TIcu or TIcuContainerNode. This is not ideal, but we still think it is OK because it
  // will be just two cases which fits into the browser inline cache (inline cache can take up to
  // 4)
  const tIcu = value.hasOwnProperty('currentCaseLViewIndex') ? value as TIcu :
                                                               (value as TIcuContainerNode).value;
  ngDevMode && assertTIcu(tIcu);
  return tIcu;
}

/**
 * Store `TIcu` at a give `index`.
 *
 * `TIcu` 存储在给定的 `index` 处。
 *
 * The `TIcu` can be stored either directly (if it is nested ICU) OR
 * it is stored inside tho `TIcuContainer` if it is top level ICU.
 *
 * `TIcu` 可以直接存储（如果是嵌套 ICU），如果是顶级 ICU，则可以存储在 `TIcuContainer` 中。
 *
 * The reason for this is that the top level ICU need a `TNode` so that they are part of the render
 * tree, but nested ICU's have no TNode, because we don't know ahead of time if the nested ICU is
 * expressed (parent ICU may have selected a case which does not contain it.)
 *
 * 原因是顶级 ICU 需要一个 `TNode` ，以便它们是渲染树的一部分，但嵌套 ICU 没有
 * TNode，因为我们无法提前知道嵌套 ICU 是否被表达（父 ICU 可能有选择了一个不包含它的案例。）
 *
 * @param tView Current `TView`.
 *
 * 当前 `TView` 。
 *
 * @param index Index where the value should be stored at in `Tview.data`
 *
 * `Tview.data` 中应该存储值的索引
 *
 * @param tIcu The TIcu to store.
 *
 * 要存储的 TIcu。
 *
 */
export function setTIcu(tView: TView, index: number, tIcu: TIcu): void {
  const tNode = tView.data[index] as null | TIcuContainerNode;
  ngDevMode &&
      assertEqual(
          tNode === null || tNode.hasOwnProperty('tViews'), true,
          'We expect to get \'null\'|\'TIcuContainer\'');
  if (tNode === null) {
    tView.data[index] = tIcu;
  } else {
    ngDevMode && assertTNodeType(tNode, TNodeType.Icu);
    tNode.value = tIcu;
  }
}

/**
 * Set `TNode.insertBeforeIndex` taking the `Array` into account.
 *
 * 考虑 `Array` 设置 `TNode.insertBeforeIndex` 。
 *
 * See `TNode.insertBeforeIndex`
 *
 * 请参阅 `TNode.insertBeforeIndex`
 *
 */
export function setTNodeInsertBeforeIndex(tNode: TNode, index: number) {
  ngDevMode && assertTNode(tNode);
  let insertBeforeIndex = tNode.insertBeforeIndex;
  if (insertBeforeIndex === null) {
    setI18nHandling(getInsertInFrontOfRNodeWithI18n, processI18nInsertBefore);
    insertBeforeIndex = tNode.insertBeforeIndex =
        [null!/* may be updated to number later */, index];
  } else {
    assertEqual(Array.isArray(insertBeforeIndex), true, 'Expecting array here');
    (insertBeforeIndex as number[]).push(index);
  }
}

/**
 * Create `TNode.type=TNodeType.Placeholder` node.
 *
 * 创建 `TNode.type=TNodeType.Placeholder` 节点。
 *
 * See `TNodeType.Placeholder` for more information.
 *
 * 有关更多信息，请参阅 `TNodeType.Placeholder` 。
 *
 */
export function createTNodePlaceholder(
    tView: TView, previousTNodes: TNode[], index: number): TNode {
  const tNode = createTNodeAtIndex(tView, index, TNodeType.Placeholder, null, null);
  addTNodeAndUpdateInsertBeforeIndex(previousTNodes, tNode);
  return tNode;
}


/**
 * Returns current ICU case.
 *
 * 返回当前的 ICU 病例。
 *
 * ICU cases are stored as index into the `TIcu.cases`.
 * At times it is necessary to communicate that the ICU case just switched and that next ICU update
 * should update all bindings regardless of the mask. In such a case the we store negative numbers
 * for cases which have just been switched. This function removes the negative flag.
 *
 * ICU 病例作为索引存储到 `TIcu.cases` 中。有时有必要传达 ICU 病例刚刚切换，并且下一次 ICU
 * 更新应该更新所有绑定，无论掩码如何。在这种情况下，我们会为刚刚切换的情况存储负数。此函数删除否定标志。
 *
 */
export function getCurrentICUCaseIndex(tIcu: TIcu, lView: LView) {
  const currentCase: number|null = lView[tIcu.currentCaseLViewIndex];
  return currentCase === null ? currentCase : (currentCase < 0 ? ~currentCase : currentCase);
}

export function getParentFromIcuCreateOpCode(mergedCode: number): number {
  return mergedCode >>> IcuCreateOpCode.SHIFT_PARENT;
}

export function getRefFromIcuCreateOpCode(mergedCode: number): number {
  return (mergedCode & IcuCreateOpCode.MASK_REF) >>> IcuCreateOpCode.SHIFT_REF;
}

export function getInstructionFromIcuCreateOpCode(mergedCode: number): number {
  return mergedCode & IcuCreateOpCode.MASK_INSTRUCTION;
}

export function icuCreateOpCode(opCode: IcuCreateOpCode, parentIdx: number, refIdx: number) {
  ngDevMode && assertGreaterThanOrEqual(parentIdx, 0, 'Missing parent index');
  ngDevMode && assertGreaterThan(refIdx, 0, 'Missing ref index');
  return opCode | parentIdx << IcuCreateOpCode.SHIFT_PARENT | refIdx << IcuCreateOpCode.SHIFT_REF;
}

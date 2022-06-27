/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {RuntimeError, RuntimeErrorCode} from '../../errors';
import {getPluralCase} from '../../i18n/localization';
import {assertDefined, assertDomNode, assertEqual, assertGreaterThan, assertIndexInRange, throwError} from '../../util/assert';
import {assertIndexInExpandoRange, assertTIcu} from '../assert';
import {attachPatchData} from '../context_discovery';
import {elementPropertyInternal, setElementAttribute} from '../instructions/shared';
import {ELEMENT_MARKER, I18nCreateOpCode, I18nCreateOpCodes, I18nUpdateOpCode, I18nUpdateOpCodes, ICU_MARKER, IcuCreateOpCode, IcuCreateOpCodes, IcuType, TI18n, TIcu} from '../interfaces/i18n';
import {TNode} from '../interfaces/node';
import {RElement, RNode, RText} from '../interfaces/renderer_dom';
import {SanitizerFn} from '../interfaces/sanitization';
import {HEADER_OFFSET, LView, RENDERER, TView} from '../interfaces/view';
import {createCommentNode, createElementNode, createTextNode, nativeInsertBefore, nativeParentNode, nativeRemoveNode, updateTextNode} from '../node_manipulation';
import {getBindingIndex} from '../state';
import {renderStringify} from '../util/stringify_utils';
import {getNativeByIndex, unwrapRNode} from '../util/view_utils';

import {getLocaleId} from './i18n_locale_id';
import {getCurrentICUCaseIndex, getParentFromIcuCreateOpCode, getRefFromIcuCreateOpCode, getTIcu} from './i18n_util';



/**
 * Keep track of which input bindings in `ɵɵi18nExp` have changed.
 *
 * 跟踪 `ɵɵi18nExp` 中的哪些输入绑定发生了更改。
 *
 * This is used to efficiently update expressions in i18n only when the corresponding input has
 * changed.
 *
 * 这用于仅当对应的输入发生更改时才有效地更新 i18n 中的表达式。
 *
 * 1) Each bit represents which of the `ɵɵi18nExp` has changed.
 * 2) There are 32 bits allowed in JS.
 * 3) Bit 32 is special as it is shared for all changes past 32. (In other words if you have more
 * than 32 `ɵɵi18nExp` then all changes past 32nd `ɵɵi18nExp` will be mapped to same bit. This means
 * that we may end up changing more than we need to. But i18n expressions with 32 bindings is rare
 * so in practice it should not be an issue.)
 *
 * 1) 每个位都表示 `ɵɵi18nExp` 中的哪个发生了变化。 2）JS 中允许使用 32 位。 3）第 32
 * 位是特殊的，因为它是为 32 以后的所有更改共享的。（换句话说，如果你有超过 32 `ɵɵi18nExp`
 * ，那么超过 32nd `ɵɵi18nExp`
 * 的所有更改都将映射到同一个位。这意味着我们最终可能会更改超过我们需要。但具有 32 个绑定的 i18n
 * 表达式很少见，因此在实践中这应该不是问题。）
 *
 */
let changeMask = 0b0;

/**
 * Keeps track of which bit needs to be updated in `changeMask`
 *
 * 跟踪需要在 `changeMask` 中更新的位
 *
 * This value gets incremented on every call to `ɵɵi18nExp`
 *
 * 每次调用 `ɵɵi18nExp` 时，此值都会增加
 *
 */
let changeMaskCounter = 0;

/**
 * Keep track of which input bindings in `ɵɵi18nExp` have changed.
 *
 * 跟踪 `ɵɵi18nExp` 中的哪些输入绑定发生了更改。
 *
 * `setMaskBit` gets invoked by each call to `ɵɵi18nExp`.
 *
 * 每次调用 `setMaskBit` 都会调用 `ɵɵi18nExp` 。
 *
 * @param hasChange did `ɵɵi18nExp` detect a change.
 *
 * `ɵɵi18nExp` 检测到更改。
 *
 */
export function setMaskBit(hasChange: boolean) {
  if (hasChange) {
    changeMask = changeMask | (1 << Math.min(changeMaskCounter, 31));
  }
  changeMaskCounter++;
}

export function applyI18n(tView: TView, lView: LView, index: number) {
  if (changeMaskCounter > 0) {
    ngDevMode && assertDefined(tView, `tView should be defined`);
    const tI18n = tView.data[index] as TI18n | I18nUpdateOpCodes;
    // When `index` points to an `ɵɵi18nAttributes` then we have an array otherwise `TI18n`
    const updateOpCodes: I18nUpdateOpCodes =
        Array.isArray(tI18n) ? tI18n as I18nUpdateOpCodes : (tI18n as TI18n).update;
    const bindingsStartIndex = getBindingIndex() - changeMaskCounter - 1;
    applyUpdateOpCodes(tView, lView, updateOpCodes, bindingsStartIndex, changeMask);
  }
  // Reset changeMask & maskBit to default for the next update cycle
  changeMask = 0b0;
  changeMaskCounter = 0;
}


/**
 * Apply `I18nCreateOpCodes` op-codes as stored in `TI18n.create`.
 *
 * 应用存储在 `TI18n.create` 中的 `I18nCreateOpCodes` 操作码。
 *
 * Creates text (and comment) nodes which are internationalized.
 *
 * 创建国际化的文本（和注释）节点。
 *
 * @param lView Current lView
 *
 * 当前的 lView
 *
 * @param createOpCodes Set of op-codes to apply
 *
 * 要应用的操作码集
 *
 * @param parentRNode Parent node (so that direct children can be added eagerly) or `null` if it is
 *     a root node.
 *
 * 父节点（以便可以立即添加直接子项），如果是根节点，则为 `null` 。
 *
 * @param insertInFrontOf DOM node that should be used as an anchor.
 *
 * 应该用作锚点的 DOM 节点。
 *
 */
export function applyCreateOpCodes(
    lView: LView, createOpCodes: I18nCreateOpCodes, parentRNode: RElement|null,
    insertInFrontOf: RElement|null): void {
  const renderer = lView[RENDERER];
  for (let i = 0; i < createOpCodes.length; i++) {
    const opCode = createOpCodes[i++] as any;
    const text = createOpCodes[i] as string;
    const isComment = (opCode & I18nCreateOpCode.COMMENT) === I18nCreateOpCode.COMMENT;
    const appendNow =
        (opCode & I18nCreateOpCode.APPEND_EAGERLY) === I18nCreateOpCode.APPEND_EAGERLY;
    const index = opCode >>> I18nCreateOpCode.SHIFT;
    let rNode = lView[index];
    if (rNode === null) {
      // We only create new DOM nodes if they don't already exist: If ICU switches case back to a
      // case which was already instantiated, no need to create new DOM nodes.
      rNode = lView[index] =
          isComment ? renderer.createComment(text) : createTextNode(renderer, text);
    }
    if (appendNow && parentRNode !== null) {
      nativeInsertBefore(renderer, parentRNode, rNode, insertInFrontOf, false);
    }
  }
}

/**
 * Apply `I18nMutateOpCodes` OpCodes.
 *
 * 应用 `I18nMutateOpCodes` 。
 *
 * @param tView Current `TView`
 *
 * 当前 `TView`
 *
 * @param mutableOpCodes Mutable OpCodes to process
 *
 * 要处理的可变操作码
 *
 * @param lView Current `LView`
 *
 * 当前 `LView`
 *
 * @param anchorRNode place where the i18n node should be inserted.
 *
 * 应该插入 i18n 节点的地方。
 *
 */
export function applyMutableOpCodes(
    tView: TView, mutableOpCodes: IcuCreateOpCodes, lView: LView, anchorRNode: RNode): void {
  ngDevMode && assertDomNode(anchorRNode);
  const renderer = lView[RENDERER];
  // `rootIdx` represents the node into which all inserts happen.
  let rootIdx: number|null = null;
  // `rootRNode` represents the real node into which we insert. This can be different from
  // `lView[rootIdx]` if we have projection.
  //  - null we don't have a parent (as can be the case in when we are inserting into a root of
  //    LView which has no parent.)
  //  - `RElement` The element representing the root after taking projection into account.
  let rootRNode!: RElement|null;
  for (let i = 0; i < mutableOpCodes.length; i++) {
    const opCode = mutableOpCodes[i];
    if (typeof opCode == 'string') {
      const textNodeIndex = mutableOpCodes[++i] as number;
      if (lView[textNodeIndex] === null) {
        ngDevMode && ngDevMode.rendererCreateTextNode++;
        ngDevMode && assertIndexInRange(lView, textNodeIndex);
        lView[textNodeIndex] = createTextNode(renderer, opCode);
      }
    } else if (typeof opCode == 'number') {
      switch (opCode & IcuCreateOpCode.MASK_INSTRUCTION) {
        case IcuCreateOpCode.AppendChild:
          const parentIdx = getParentFromIcuCreateOpCode(opCode);
          if (rootIdx === null) {
            // The first operation should save the `rootIdx` because the first operation
            // must insert into the root. (Only subsequent operations can insert into a dynamic
            // parent)
            rootIdx = parentIdx;
            rootRNode = nativeParentNode(renderer, anchorRNode);
          }
          let insertInFrontOf: RNode|null;
          let parentRNode: RElement|null;
          if (parentIdx === rootIdx) {
            insertInFrontOf = anchorRNode;
            parentRNode = rootRNode;
          } else {
            insertInFrontOf = null;
            parentRNode = unwrapRNode(lView[parentIdx]) as RElement;
          }
          // FIXME(misko): Refactor with `processI18nText`
          if (parentRNode !== null) {
            // This can happen if the `LView` we are adding to is not attached to a parent `LView`.
            // In such a case there is no "root" we can attach to. This is fine, as we still need to
            // create the elements. When the `LView` gets later added to a parent these "root" nodes
            // get picked up and added.
            ngDevMode && assertDomNode(parentRNode);
            const refIdx = getRefFromIcuCreateOpCode(opCode);
            ngDevMode && assertGreaterThan(refIdx, HEADER_OFFSET, 'Missing ref');
            // `unwrapRNode` is not needed here as all of these point to RNodes as part of the i18n
            // which can't have components.
            const child = lView[refIdx] as RElement;
            ngDevMode && assertDomNode(child);
            nativeInsertBefore(renderer, parentRNode, child, insertInFrontOf, false);
            const tIcu = getTIcu(tView, refIdx);
            if (tIcu !== null && typeof tIcu === 'object') {
              // If we just added a comment node which has ICU then that ICU may have already been
              // rendered and therefore we need to re-add it here.
              ngDevMode && assertTIcu(tIcu);
              const caseIndex = getCurrentICUCaseIndex(tIcu, lView);
              if (caseIndex !== null) {
                applyMutableOpCodes(tView, tIcu.create[caseIndex], lView, lView[tIcu.anchorIdx]);
              }
            }
          }
          break;
        case IcuCreateOpCode.Attr:
          const elementNodeIndex = opCode >>> IcuCreateOpCode.SHIFT_REF;
          const attrName = mutableOpCodes[++i] as string;
          const attrValue = mutableOpCodes[++i] as string;
          // This code is used for ICU expressions only, since we don't support
          // directives/components in ICUs, we don't need to worry about inputs here
          setElementAttribute(
              renderer, getNativeByIndex(elementNodeIndex, lView) as RElement, null, null, attrName,
              attrValue, null);
          break;
        default:
          if (ngDevMode) {
            throw new RuntimeError(
                RuntimeErrorCode.INVALID_I18N_STRUCTURE,
                `Unable to determine the type of mutate operation for "${opCode}"`);
          }
      }
    } else {
      switch (opCode) {
        case ICU_MARKER:
          const commentValue = mutableOpCodes[++i] as string;
          const commentNodeIndex = mutableOpCodes[++i] as number;
          if (lView[commentNodeIndex] === null) {
            ngDevMode &&
                assertEqual(
                    typeof commentValue, 'string',
                    `Expected "${commentValue}" to be a comment node value`);
            ngDevMode && ngDevMode.rendererCreateComment++;
            ngDevMode && assertIndexInExpandoRange(lView, commentNodeIndex);
            const commentRNode = lView[commentNodeIndex] =
                createCommentNode(renderer, commentValue);
            // FIXME(misko): Attaching patch data is only needed for the root (Also add tests)
            attachPatchData(commentRNode, lView);
          }
          break;
        case ELEMENT_MARKER:
          const tagName = mutableOpCodes[++i] as string;
          const elementNodeIndex = mutableOpCodes[++i] as number;
          if (lView[elementNodeIndex] === null) {
            ngDevMode &&
                assertEqual(
                    typeof tagName, 'string',
                    `Expected "${tagName}" to be an element node tag name`);

            ngDevMode && ngDevMode.rendererCreateElement++;
            ngDevMode && assertIndexInExpandoRange(lView, elementNodeIndex);
            const elementRNode = lView[elementNodeIndex] =
                createElementNode(renderer, tagName, null);
            // FIXME(misko): Attaching patch data is only needed for the root (Also add tests)
            attachPatchData(elementRNode, lView);
          }
          break;
        default:
          ngDevMode &&
              throwError(`Unable to determine the type of mutate operation for "${opCode}"`);
      }
    }
  }
}


/**
 * Apply `I18nUpdateOpCodes` OpCodes
 *
 * 应用 `I18nUpdateOpCodes`
 *
 * @param tView Current `TView`
 *
 * 当前 `TView`
 *
 * @param lView Current `LView`
 *
 * 当前 `LView`
 *
 * @param updateOpCodes OpCodes to process
 *
 * 要处理的操作码
 *
 * @param bindingsStartIndex Location of the first `ɵɵi18nApply`
 *
 * 第一个 `ɵɵi18nApply` 的位置
 *
 * @param changeMask Each bit corresponds to a `ɵɵi18nExp` (Counting backwards from
 *     `bindingsStartIndex`)
 *
 * 每个位对应一个 `ɵɵi18nExp` （从 `bindingsStartIndex` 倒数）
 *
 */
export function applyUpdateOpCodes(
    tView: TView, lView: LView, updateOpCodes: I18nUpdateOpCodes, bindingsStartIndex: number,
    changeMask: number) {
  for (let i = 0; i < updateOpCodes.length; i++) {
    // bit code to check if we should apply the next update
    const checkBit = updateOpCodes[i] as number;
    // Number of opCodes to skip until next set of update codes
    const skipCodes = updateOpCodes[++i] as number;
    if (checkBit & changeMask) {
      // The value has been updated since last checked
      let value = '';
      for (let j = i + 1; j <= (i + skipCodes); j++) {
        const opCode = updateOpCodes[j];
        if (typeof opCode == 'string') {
          value += opCode;
        } else if (typeof opCode == 'number') {
          if (opCode < 0) {
            // Negative opCode represent `i18nExp` values offset.
            value += renderStringify(lView[bindingsStartIndex - opCode]);
          } else {
            const nodeIndex = (opCode >>> I18nUpdateOpCode.SHIFT_REF);
            switch (opCode & I18nUpdateOpCode.MASK_OPCODE) {
              case I18nUpdateOpCode.Attr:
                const propName = updateOpCodes[++j] as string;
                const sanitizeFn = updateOpCodes[++j] as SanitizerFn | null;
                const tNodeOrTagName = tView.data[nodeIndex] as TNode | string;
                ngDevMode && assertDefined(tNodeOrTagName, 'Experting TNode or string');
                if (typeof tNodeOrTagName === 'string') {
                  // IF we don't have a `TNode`, then we are an element in ICU (as ICU content does
                  // not have TNode), in which case we know that there are no directives, and hence
                  // we use attribute setting.
                  setElementAttribute(
                      lView[RENDERER], lView[nodeIndex], null, tNodeOrTagName, propName, value,
                      sanitizeFn);
                } else {
                  elementPropertyInternal(
                      tView, tNodeOrTagName, lView, propName, value, lView[RENDERER], sanitizeFn,
                      false);
                }
                break;
              case I18nUpdateOpCode.Text:
                const rText = lView[nodeIndex] as RText | null;
                rText !== null && updateTextNode(lView[RENDERER], rText, value);
                break;
              case I18nUpdateOpCode.IcuSwitch:
                applyIcuSwitchCase(tView, getTIcu(tView, nodeIndex)!, lView, value);
                break;
              case I18nUpdateOpCode.IcuUpdate:
                applyIcuUpdateCase(tView, getTIcu(tView, nodeIndex)!, bindingsStartIndex, lView);
                break;
            }
          }
        }
      }
    } else {
      const opCode = updateOpCodes[i + 1] as number;
      if (opCode > 0 && (opCode & I18nUpdateOpCode.MASK_OPCODE) === I18nUpdateOpCode.IcuUpdate) {
        // Special case for the `icuUpdateCase`. It could be that the mask did not match, but
        // we still need to execute `icuUpdateCase` because the case has changed recently due to
        // previous `icuSwitchCase` instruction. (`icuSwitchCase` and `icuUpdateCase` always come in
        // pairs.)
        const nodeIndex = (opCode >>> I18nUpdateOpCode.SHIFT_REF);
        const tIcu = getTIcu(tView, nodeIndex)!;
        const currentIndex = lView[tIcu.currentCaseLViewIndex];
        if (currentIndex < 0) {
          applyIcuUpdateCase(tView, tIcu, bindingsStartIndex, lView);
        }
      }
    }
    i += skipCodes;
  }
}

/**
 * Apply OpCodes associated with updating an existing ICU.
 *
 * 应用与更新现有 ICU 相关的 OpCode。
 *
 * @param tView Current `TView`
 *
 * 当前 `TView`
 *
 * @param tIcu Current `TIcu`
 *
 * 当前 `TIcu`
 *
 * @param bindingsStartIndex Location of the first `ɵɵi18nApply`
 *
 * 第一个 `ɵɵi18nApply` 的位置
 *
 * @param lView Current `LView`
 *
 * 当前 `LView`
 *
 */
function applyIcuUpdateCase(tView: TView, tIcu: TIcu, bindingsStartIndex: number, lView: LView) {
  ngDevMode && assertIndexInRange(lView, tIcu.currentCaseLViewIndex);
  let activeCaseIndex = lView[tIcu.currentCaseLViewIndex];
  if (activeCaseIndex !== null) {
    let mask = changeMask;
    if (activeCaseIndex < 0) {
      // Clear the flag.
      // Negative number means that the ICU was freshly created and we need to force the update.
      activeCaseIndex = lView[tIcu.currentCaseLViewIndex] = ~activeCaseIndex;
      // -1 is same as all bits on, which simulates creation since it marks all bits dirty
      mask = -1;
    }
    applyUpdateOpCodes(tView, lView, tIcu.update[activeCaseIndex], bindingsStartIndex, mask);
  }
}

/**
 * Apply OpCodes associated with switching a case on ICU.
 *
 * 应用与在 ICU 上切换病例相关的 OpCodes。
 *
 * This involves tearing down existing case and than building up a new case.
 *
 * 这涉及拆除现有的案例，而不是建立一个新的案例。
 *
 * @param tView Current `TView`
 *
 * 当前 `TView`
 *
 * @param tIcu Current `TIcu`
 *
 * 当前 `TIcu`
 *
 * @param lView Current `LView`
 *
 * 当前 `LView`
 *
 * @param value Value of the case to update to.
 *
 * 要更新到的案例的值。
 *
 */
function applyIcuSwitchCase(tView: TView, tIcu: TIcu, lView: LView, value: string) {
  // Rebuild a new case for this ICU
  const caseIndex = getCaseIndex(tIcu, value);
  let activeCaseIndex = getCurrentICUCaseIndex(tIcu, lView);
  if (activeCaseIndex !== caseIndex) {
    applyIcuSwitchCaseRemove(tView, tIcu, lView);
    lView[tIcu.currentCaseLViewIndex] = caseIndex === null ? null : ~caseIndex;
    if (caseIndex !== null) {
      // Add the nodes for the new case
      const anchorRNode = lView[tIcu.anchorIdx];
      if (anchorRNode) {
        ngDevMode && assertDomNode(anchorRNode);
        applyMutableOpCodes(tView, tIcu.create[caseIndex], lView, anchorRNode);
      }
    }
  }
}

/**
 * Apply OpCodes associated with tearing ICU case.
 *
 * 应用与撕裂 ICU 病例相关的 OpCodes。
 *
 * This involves tearing down existing case and than building up a new case.
 *
 * 这涉及拆除现有的案例，而不是建立一个新的案例。
 *
 * @param tView Current `TView`
 *
 * 当前 `TView`
 *
 * @param tIcu Current `TIcu`
 *
 * 当前 `TIcu`
 *
 * @param lView Current `LView`
 *
 * 当前 `LView`
 *
 */
function applyIcuSwitchCaseRemove(tView: TView, tIcu: TIcu, lView: LView) {
  let activeCaseIndex = getCurrentICUCaseIndex(tIcu, lView);
  if (activeCaseIndex !== null) {
    const removeCodes = tIcu.remove[activeCaseIndex];
    for (let i = 0; i < removeCodes.length; i++) {
      const nodeOrIcuIndex = removeCodes[i] as number;
      if (nodeOrIcuIndex > 0) {
        // Positive numbers are `RNode`s.
        const rNode = getNativeByIndex(nodeOrIcuIndex, lView);
        rNode !== null && nativeRemoveNode(lView[RENDERER], rNode);
      } else {
        // Negative numbers are ICUs
        applyIcuSwitchCaseRemove(tView, getTIcu(tView, ~nodeOrIcuIndex)!, lView);
      }
    }
  }
}


/**
 * Returns the index of the current case of an ICU expression depending on the main binding value
 *
 * 根据主绑定值返回 ICU 表达式的当前案例的索引
 *
 * @param icuExpression
 * @param bindingValue The value of the main binding used by this ICU expression
 *
 * 此 ICU 表达式使用的主绑定的值
 *
 */
function getCaseIndex(icuExpression: TIcu, bindingValue: string): number|null {
  let index = icuExpression.cases.indexOf(bindingValue);
  if (index === -1) {
    switch (icuExpression.type) {
      case IcuType.plural: {
        const resolvedCase = getPluralCase(bindingValue, getLocaleId());
        index = icuExpression.cases.indexOf(resolvedCase);
        if (index === -1 && resolvedCase !== 'other') {
          index = icuExpression.cases.indexOf('other');
        }
        break;
      }
      case IcuType.select: {
        index = icuExpression.cases.indexOf('other');
        break;
      }
    }
  }
  return index === -1 ? null : index;
}

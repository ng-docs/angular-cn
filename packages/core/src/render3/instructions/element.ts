/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {assertDefined, assertEqual, assertIndexInRange} from '../../util/assert';
import {assertFirstCreatePass, assertHasParent} from '../assert';
import {attachPatchData} from '../context_discovery';
import {registerPostOrderHooks} from '../hooks';
import {hasClassInput, hasStyleInput, TAttributes, TElementNode, TNodeFlags, TNodeType} from '../interfaces/node';
import {RElement} from '../interfaces/renderer_dom';
import {isContentQueryHost, isDirectiveHost} from '../interfaces/type_checks';
import {HEADER_OFFSET, LView, RENDERER, TView} from '../interfaces/view';
import {assertTNodeType} from '../node_assert';
import {appendChild, createElementNode, setupStaticAttributes} from '../node_manipulation';
import {decreaseElementDepthCount, getBindingIndex, getCurrentTNode, getElementDepthCount, getLView, getNamespace, getTView, increaseElementDepthCount, isCurrentTNodeParent, setCurrentTNode, setCurrentTNodeAsNotParent} from '../state';
import {computeStaticStyling} from '../styling/static_styling';
import {getConstant} from '../util/view_utils';

import {validateElementIsKnown} from './element_validation';
import {setDirectiveInputsWhichShadowsStyling} from './property';
import {createDirectivesInstances, executeContentQueries, getOrCreateTNode, resolveDirectives, saveResolvedLocalsInData} from './shared';


function elementStartFirstCreatePass(
    index: number, tView: TView, lView: LView, native: RElement, name: string,
    attrsIndex?: number|null, localRefsIndex?: number): TElementNode {
  ngDevMode && assertFirstCreatePass(tView);
  ngDevMode && ngDevMode.firstCreatePass++;

  const tViewConsts = tView.consts;
  const attrs = getConstant<TAttributes>(tViewConsts, attrsIndex);
  const tNode = getOrCreateTNode(tView, index, TNodeType.Element, name, attrs);

  const hasDirectives =
      resolveDirectives(tView, lView, tNode, getConstant<string[]>(tViewConsts, localRefsIndex));
  if (ngDevMode) {
    validateElementIsKnown(native, lView, tNode.value, tView.schemas, hasDirectives);
  }

  if (tNode.attrs !== null) {
    computeStaticStyling(tNode, tNode.attrs, false);
  }

  if (tNode.mergedAttrs !== null) {
    computeStaticStyling(tNode, tNode.mergedAttrs, true);
  }

  if (tView.queries !== null) {
    tView.queries.elementStart(tView, tNode);
  }

  return tNode;
}

/**
 * Create DOM element. The instruction must later be followed by `elementEnd()` call.
 *
 * 创建 DOM 元素。该指令稍后必须跟 `elementEnd()` 调用。
 *
 * @param index Index of the element in the LView array
 *
 * LView 数组中元素的索引
 *
 * @param name Name of the DOM Node
 *
 * DOM 节点的名称
 *
 * @param attrsIndex Index of the element's attributes in the `consts` array.
 *
 * 元素属性在 `consts` 数组中的索引。
 *
 * @param localRefsIndex Index of the element's local references in the `consts` array.
 *
 * 元素的本地引用在 `consts` 数组中的索引。
 *
 * @returns
 *
 * This function returns itself so that it may be chained.
 *
 * 此函数返回自己，以便它可以被链接。
 *
 * Attributes and localRefs are passed as an array of strings where elements with an even index
 * hold an attribute name and elements with an odd index hold an attribute value, ex.:
 * ['id', 'warning5', 'class', 'alert']
 *
 * 属性和 localRefs
 * 以字符串数组的形式传递，其中具有偶数索引的元素保存属性名称，具有奇数索引的元素保存属性值，例如：
 * ['id'、'warning5'、'class'、'alert']['id', 'warning5', 'class', 'alert']
 *
 * @codeGenApi
 */
export function ɵɵelementStart(
    index: number, name: string, attrsIndex?: number|null,
    localRefsIndex?: number): typeof ɵɵelementStart {
  const lView = getLView();
  const tView = getTView();
  const adjustedIndex = HEADER_OFFSET + index;

  ngDevMode &&
      assertEqual(
          getBindingIndex(), tView.bindingStartIndex,
          'elements should be created before any bindings');
  ngDevMode && assertIndexInRange(lView, adjustedIndex);

  const renderer = lView[RENDERER];
  const native = lView[adjustedIndex] = createElementNode(renderer, name, getNamespace());
  const tNode = tView.firstCreatePass ?
      elementStartFirstCreatePass(
          adjustedIndex, tView, lView, native, name, attrsIndex, localRefsIndex) :
      tView.data[adjustedIndex] as TElementNode;
  setCurrentTNode(tNode, true);
  setupStaticAttributes(renderer, native, tNode);

  if ((tNode.flags & TNodeFlags.isDetached) !== TNodeFlags.isDetached) {
    // In the i18n case, the translation may have removed this element, so only add it if it is not
    // detached. See `TNodeType.Placeholder` and `LFrame.inI18n` for more context.
    appendChild(tView, lView, native, tNode);
  }

  // any immediate children of a component or template container must be pre-emptively
  // monkey-patched with the component view data so that the element can be inspected
  // later on using any element discovery utility methods (see `element_discovery.ts`)
  if (getElementDepthCount() === 0) {
    attachPatchData(native, lView);
  }
  increaseElementDepthCount();


  if (isDirectiveHost(tNode)) {
    createDirectivesInstances(tView, lView, tNode);
    executeContentQueries(tView, tNode, lView);
  }
  if (localRefsIndex !== null) {
    saveResolvedLocalsInData(lView, tNode);
  }
  return ɵɵelementStart;
}

/**
 * Mark the end of the element.
 *
 * 标记元素的结尾。
 *
 * @returns
 *
 * This function returns itself so that it may be chained.
 *
 * 此函数返回自己，以便它可以被链接。
 *
 * @codeGenApi
 */
export function ɵɵelementEnd(): typeof ɵɵelementEnd {
  let currentTNode = getCurrentTNode()!;
  ngDevMode && assertDefined(currentTNode, 'No parent node to close.');
  if (isCurrentTNodeParent()) {
    setCurrentTNodeAsNotParent();
  } else {
    ngDevMode && assertHasParent(getCurrentTNode());
    currentTNode = currentTNode.parent!;
    setCurrentTNode(currentTNode, false);
  }

  const tNode = currentTNode;
  ngDevMode && assertTNodeType(tNode, TNodeType.AnyRNode);


  decreaseElementDepthCount();

  const tView = getTView();
  if (tView.firstCreatePass) {
    registerPostOrderHooks(tView, currentTNode);
    if (isContentQueryHost(currentTNode)) {
      tView.queries!.elementEnd(currentTNode);
    }
  }

  if (tNode.classesWithoutHost != null && hasClassInput(tNode)) {
    setDirectiveInputsWhichShadowsStyling(tView, tNode, getLView(), tNode.classesWithoutHost, true);
  }

  if (tNode.stylesWithoutHost != null && hasStyleInput(tNode)) {
    setDirectiveInputsWhichShadowsStyling(tView, tNode, getLView(), tNode.stylesWithoutHost, false);
  }
  return ɵɵelementEnd;
}

/**
 * Creates an empty element using {@link elementStart} and {@link elementEnd}
 *
 * 使用 {@link elementStart} 和 {@link elementEnd} 创建一个空元素
 *
 * @param index Index of the element in the data array
 *
 * 数据数组中元素的索引
 *
 * @param name Name of the DOM Node
 *
 * DOM 节点的名称
 *
 * @param attrsIndex Index of the element's attributes in the `consts` array.
 *
 * 元素属性在 `consts` 数组中的索引。
 *
 * @param localRefsIndex Index of the element's local references in the `consts` array.
 *
 * 元素的本地引用在 `consts` 数组中的索引。
 *
 * @returns
 *
 * This function returns itself so that it may be chained.
 *
 * 此函数返回自己，以便它可以被链接。
 *
 * @codeGenApi
 */
export function ɵɵelement(
    index: number, name: string, attrsIndex?: number|null,
    localRefsIndex?: number): typeof ɵɵelement {
  ɵɵelementStart(index, name, attrsIndex, localRefsIndex);
  ɵɵelementEnd();
  return ɵɵelement;
}

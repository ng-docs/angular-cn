/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {assertDataInRange, assertDefined, assertEqual} from '../../util/assert';
import {assertFirstCreatePass, assertHasParent} from '../assert';
import {attachPatchData} from '../context_discovery';
import {registerPostOrderHooks} from '../hooks';
import {TAttributes, TElementNode, TNode, TNodeFlags, TNodeType} from '../interfaces/node';
import {RElement} from '../interfaces/renderer';
import {StylingMapArray, TStylingContext} from '../interfaces/styling';
import {isContentQueryHost, isDirectiveHost} from '../interfaces/type_checks';
import {HEADER_OFFSET, LView, RENDERER, TVIEW, TView, T_HOST} from '../interfaces/view';
import {assertNodeType} from '../node_assert';
import {appendChild} from '../node_manipulation';
import {decreaseElementDepthCount, getBindingIndex, getElementDepthCount, getIsParent, getLView, getNamespace, getPreviousOrParentTNode, getSelectedIndex, increaseElementDepthCount, setIsNotParent, setPreviousOrParentTNode} from '../state';
import {setUpAttributes} from '../util/attrs_utils';
import {getInitialStylingValue, hasClassInput, hasStyleInput, selectClassBasedInputName} from '../util/styling_utils';
import {getConstant, getNativeByTNode, getTNode} from '../util/view_utils';

import {createDirectivesInstances, elementCreate, executeContentQueries, getOrCreateTNode, matchingSchemas, renderInitialStyling, resolveDirectives, saveResolvedLocalsInData, setInputsForProperty} from './shared';
import {registerInitialStylingOnTNode} from './styling';

function elementStartFirstCreatePass(
    index: number, tView: TView, lView: LView, native: RElement, name: string,
    attrsIndex?: number | null, localRefsIndex?: number): TElementNode {
  ngDevMode && assertFirstCreatePass(tView);
  ngDevMode && ngDevMode.firstCreatePass++;

  const tViewConsts = tView.consts;
  const attrs = getConstant<TAttributes>(tViewConsts, attrsIndex);
  const tNode = getOrCreateTNode(tView, lView[T_HOST], index, TNodeType.Element, name, attrs);

  const hasDirectives =
      resolveDirectives(tView, lView, tNode, getConstant<string[]>(tViewConsts, localRefsIndex));
  ngDevMode && warnAboutUnknownElement(lView, native, tNode, hasDirectives);

  if (tNode.mergedAttrs !== null) {
    registerInitialStylingOnTNode(tNode, tNode.mergedAttrs, 0);
  }

  if (tView.queries !== null) {
    tView.queries.elementStart(tView, tNode);
  }

  return tNode;
}

/**
 * Create DOM element. The instruction must later be followed by `elementEnd()` call.
 *
 * @param index Index of the element in the LView array
 * @param name Name of the DOM Node
 * @param attrsIndex Index of the element's attributes in the `consts` array.
 * @param localRefsIndex Index of the element's local references in the `consts` array.
 *
 * Attributes and localRefs are passed as an array of strings where elements with an even index
 * hold an attribute name and elements with an odd index hold an attribute value, ex.:
 * ['id', 'warning5', 'class', 'alert']
 *
 * @codeGenApi
 */
export function ɵɵelementStart(
    index: number, name: string, attrsIndex?: number | null, localRefsIndex?: number): void {
  const lView = getLView();
  const tView = lView[TVIEW];
  const adjustedIndex = HEADER_OFFSET + index;

  ngDevMode && assertEqual(
                   getBindingIndex(), tView.bindingStartIndex,
                   'elements should be created before any bindings');
  ngDevMode && ngDevMode.rendererCreateElement++;
  ngDevMode && assertDataInRange(lView, adjustedIndex);

  const renderer = lView[RENDERER];
  const native = lView[adjustedIndex] = elementCreate(name, renderer, getNamespace());

  const tNode = tView.firstCreatePass ?
      elementStartFirstCreatePass(index, tView, lView, native, name, attrsIndex, localRefsIndex) :
      tView.data[adjustedIndex] as TElementNode;
  setPreviousOrParentTNode(tNode, true);

  const mergedAttrs = tNode.mergedAttrs;
  if (mergedAttrs !== null) {
    setUpAttributes(renderer, native, mergedAttrs);
  }
  if ((tNode.flags & TNodeFlags.hasInitialStyling) === TNodeFlags.hasInitialStyling) {
    renderInitialStyling(renderer, native, tNode, false);
  }

  appendChild(native, tNode, lView);

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
}

/**
 * Mark the end of the element.
 *
 * @codeGenApi
 */
export function ɵɵelementEnd(): void {
  let previousOrParentTNode = getPreviousOrParentTNode();
  ngDevMode && assertDefined(previousOrParentTNode, 'No parent node to close.');
  if (getIsParent()) {
    setIsNotParent();
  } else {
    ngDevMode && assertHasParent(getPreviousOrParentTNode());
    previousOrParentTNode = previousOrParentTNode.parent !;
    setPreviousOrParentTNode(previousOrParentTNode, false);
  }

  const tNode = previousOrParentTNode;
  ngDevMode && assertNodeType(tNode, TNodeType.Element);

  const lView = getLView();
  const tView = lView[TVIEW];

  decreaseElementDepthCount();

  if (tView.firstCreatePass) {
    registerPostOrderHooks(tView, previousOrParentTNode);
    if (isContentQueryHost(previousOrParentTNode)) {
      tView.queries !.elementEnd(previousOrParentTNode);
    }
  }

  if (hasClassInput(tNode)) {
    const inputName: string = selectClassBasedInputName(tNode.inputs !);
    setDirectiveStylingInput(tNode.classes, lView, tNode.inputs ![inputName], inputName);
  }

  if (hasStyleInput(tNode)) {
    setDirectiveStylingInput(tNode.styles, lView, tNode.inputs !['style'], 'style');
  }
}


/**
 * Creates an empty element using {@link elementStart} and {@link elementEnd}
 *
 * @param index Index of the element in the data array
 * @param name Name of the DOM Node
 * @param attrsIndex Index of the element's attributes in the `consts` array.
 * @param localRefsIndex Index of the element's local references in the `consts` array.
 *
 * @codeGenApi
 */
export function ɵɵelement(
    index: number, name: string, attrsIndex?: number | null, localRefsIndex?: number): void {
  ɵɵelementStart(index, name, attrsIndex, localRefsIndex);
  ɵɵelementEnd();
}

function setDirectiveStylingInput(
    context: TStylingContext | StylingMapArray | string | null, lView: LView,
    stylingInputs: (string | number)[], propName: string) {
  // older versions of Angular treat the input as `null` in the
  // event that the value does not exist at all. For this reason
  // we can't have a styling value be an empty string.
  const value = (context && getInitialStylingValue(context)) || null;

  // Ivy does an extra `[class]` write with a falsy value since the value
  // is applied during creation mode. This is a deviation from VE and should
  // be (Jira Issue = FW-1467).
  setInputsForProperty(lView, stylingInputs, propName, value);
}

function warnAboutUnknownElement(
    hostView: LView, element: RElement, tNode: TNode, hasDirectives: boolean): void {
  const schemas = hostView[TVIEW].schemas;

  // If `schemas` is set to `null`, that's an indication that this Component was compiled in AOT
  // mode where this check happens at compile time. In JIT mode, `schemas` is always present and
  // defined as an array (as an empty array in case `schemas` field is not defined) and we should
  // execute the check below.
  if (schemas === null) return;

  const tagName = tNode.tagName;

  // If the element matches any directive, it's considered as valid.
  if (!hasDirectives && tagName !== null) {
    // The element is unknown if it's an instance of HTMLUnknownElement or it isn't registered
    // as a custom element. Note that unknown elements with a dash in their name won't be instances
    // of HTMLUnknownElement in browsers that support web components.
    const isUnknown =
        // Note that we can't check for `typeof HTMLUnknownElement === 'function'`,
        // because while most browsers return 'function', IE returns 'object'.
        (typeof HTMLUnknownElement !== 'undefined' && HTMLUnknownElement &&
         element instanceof HTMLUnknownElement) ||
        (typeof customElements !== 'undefined' && tagName.indexOf('-') > -1 &&
         !customElements.get(tagName));

    if (isUnknown && !matchingSchemas(hostView, tagName)) {
      let warning = `'${tagName}' is not a known element:\n`;
      warning +=
          `1. If '${tagName}' is an Angular component, then verify that it is part of this module.\n`;
      if (tagName && tagName.indexOf('-') > -1) {
        warning +=
            `2. If '${tagName}' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message.`;
      } else {
        warning +=
            `2. To allow any element add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component.`;
      }
      console.warn(warning);
    }
  }
}

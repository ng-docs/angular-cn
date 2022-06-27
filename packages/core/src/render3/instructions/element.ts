/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {formatRuntimeError, RuntimeError, RuntimeErrorCode} from '../../errors';
import {SchemaMetadata} from '../../metadata/schema';
import {assertDefined, assertEqual, assertIndexInRange} from '../../util/assert';
import {assertFirstCreatePass, assertHasParent} from '../assert';
import {attachPatchData} from '../context_discovery';
import {registerPostOrderHooks} from '../hooks';
import {hasClassInput, hasStyleInput, TAttributes, TElementNode, TNodeFlags, TNodeType} from '../interfaces/node';
import {RElement} from '../interfaces/renderer_dom';
import {isContentQueryHost, isDirectiveHost} from '../interfaces/type_checks';
import {HEADER_OFFSET, LView, RENDERER, TView} from '../interfaces/view';
import {assertTNodeType} from '../node_assert';
import {appendChild, createElementNode, writeDirectClass, writeDirectStyle} from '../node_manipulation';
import {decreaseElementDepthCount, getBindingIndex, getCurrentTNode, getElementDepthCount, getLView, getNamespace, getTView, increaseElementDepthCount, isCurrentTNodeParent, setCurrentTNode, setCurrentTNodeAsNotParent} from '../state';
import {computeStaticStyling} from '../styling/static_styling';
import {setUpAttributes} from '../util/attrs_utils';
import {getConstant} from '../util/view_utils';

import {setDirectiveInputsWhichShadowsStyling} from './property';
import {createDirectivesInstances, executeContentQueries, getOrCreateTNode, getTemplateLocationDetails, isHostComponentStandalone, matchingSchemas, resolveDirectives, saveResolvedLocalsInData} from './shared';

let shouldThrowErrorOnUnknownElement = false;

/**
 * Sets a strict mode for JIT-compiled components to throw an error on unknown elements,
 * instead of just logging the error.
 * (for AOT-compiled ones this check happens at build time).
 *
 * 为 JIT 编译的组件设置严格模式，以在未知元素上抛出错误，而不仅仅是记录错误。 （对于 AOT
 * 编译的，此检查发生在构建时）。
 *
 */
export function ɵsetUnknownElementStrictMode(shouldThrow: boolean) {
  shouldThrowErrorOnUnknownElement = shouldThrow;
}

/**
 * Gets the current value of the strict mode.
 *
 * 获取严格模式的当前值。
 *
 */
export function ɵgetUnknownElementStrictMode() {
  return shouldThrowErrorOnUnknownElement;
}

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

  const mergedAttrs = tNode.mergedAttrs;
  if (mergedAttrs !== null) {
    setUpAttributes(renderer, native, mergedAttrs);
  }
  const classes = tNode.classes;
  if (classes !== null) {
    writeDirectClass(renderer, native, classes);
  }
  const styles = tNode.styles;
  if (styles !== null) {
    writeDirectStyle(renderer, native, styles);
  }

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

/**
 * Validates that the element is known at runtime and produces
 * an error if it's not the case.
 * This check is relevant for JIT-compiled components (for AOT-compiled
 * ones this check happens at build time).
 *
 * 验证元素在运行时已知，如果不是这种情况，则生成错误。此检查与 JIT 编译的组件相关（对于 AOT
 * 编译的组件，此检查发生在构建时）。
 *
 * The element is considered known if either:
 *
 * 在以下任一情况下，该元素被认为是已知的：
 *
 * - it's a known HTML element
 *
 *   这是一个已知的 HTML 元素
 *
 * - it's a known custom element
 *
 *   这是一个已知的自定义元素
 *
 * - the element matches any directive
 *
 *   该元素与任何指令匹配
 *
 * - the element is allowed by one of the schemas
 *
 *   模式之一允许该元素
 *
 * @param element Element to validate
 *
 * 要验证的元素
 *
 * @param lView An `LView` that represents a current component that is being rendered.
 *
 * 一个 `LView` ，表示正在呈现的当前组件。
 *
 * @param tagName Name of the tag to check
 *
 * 要检查的标签名称
 *
 * @param schemas Array of schemas
 *
 * 模式数组
 *
 * @param hasDirectives Boolean indicating that the element matches any directive
 *
 * 指示元素与任何指令匹配的布尔值
 *
 */
function validateElementIsKnown(
    element: RElement, lView: LView, tagName: string|null, schemas: SchemaMetadata[]|null,
    hasDirectives: boolean): void {
  // If `schemas` is set to `null`, that's an indication that this Component was compiled in AOT
  // mode where this check happens at compile time. In JIT mode, `schemas` is always present and
  // defined as an array (as an empty array in case `schemas` field is not defined) and we should
  // execute the check below.
  if (schemas === null) return;

  // If the element matches any directive, it's considered as valid.
  if (!hasDirectives && tagName !== null) {
    // The element is unknown if it's an instance of HTMLUnknownElement, or it isn't registered
    // as a custom element. Note that unknown elements with a dash in their name won't be instances
    // of HTMLUnknownElement in browsers that support web components.
    const isUnknown =
        // Note that we can't check for `typeof HTMLUnknownElement === 'function'`,
        // because while most browsers return 'function', IE returns 'object'.
        (typeof HTMLUnknownElement !== 'undefined' && HTMLUnknownElement &&
         element instanceof HTMLUnknownElement) ||
        (typeof customElements !== 'undefined' && tagName.indexOf('-') > -1 &&
         !customElements.get(tagName));

    if (isUnknown && !matchingSchemas(schemas, tagName)) {
      const isHostStandalone = isHostComponentStandalone(lView);
      const templateLocation = getTemplateLocationDetails(lView);
      const schemas = `'${isHostStandalone ? '@Component' : '@NgModule'}.schemas'`;

      let message = `'${tagName}' is not a known element${templateLocation}:\n`;
      message += `1. If '${tagName}' is an Angular component, then verify that it is ${
          isHostStandalone ? 'included in the \'@Component.imports\' of this component' :
                             'a part of an @NgModule where this component is declared'}.\n`;
      if (tagName && tagName.indexOf('-') > -1) {
        message +=
            `2. If '${tagName}' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the ${
                schemas} of this component to suppress this message.`;
      } else {
        message +=
            `2. To allow any element add 'NO_ERRORS_SCHEMA' to the ${schemas} of this component.`;
      }
      if (shouldThrowErrorOnUnknownElement) {
        throw new RuntimeError(RuntimeErrorCode.UNKNOWN_ELEMENT, message);
      } else {
        console.error(formatRuntimeError(RuntimeErrorCode.UNKNOWN_ELEMENT, message));
      }
    }
  }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {bindingUpdated} from '../bindings';
import {TNode} from '../interfaces/node';
import {SanitizerFn} from '../interfaces/sanitization';
import {LView, RENDERER, TView} from '../interfaces/view';
import {getLView, getSelectedTNode, getTView, nextBindingIndex} from '../state';

import {elementPropertyInternal, setInputsForProperty, storePropertyBindingMetadata} from './shared';


/**
 * Update a property on a selected element.
 *
 * 更新所选元素的属性。
 *
 * Operates on the element selected by index via the {@link select} instruction.
 *
 * 通过 {@link select} 指令对按索引选择的元素进行操作。
 *
 * If the property name also exists as an input property on one of the element's directives,
 * the component property will be set instead of the element property. This check must
 * be conducted at runtime so child components that add new `@Inputs` don't have to be re-compiled
 *
 * 如果属性名称也作为元素指令之一的输入属性存在，则将设置 component 属性而不是 element
 * 属性。此检查必须在运行时进行，因此添加新 `@Inputs` 的子组件不必重新编译
 *
 * @param propName Name of property. Because it is going to DOM, this is not subject to
 *        renaming as part of minification.
 *
 * 属性的名称。因为它将转到 DOM，因此不会作为缩小的一部分重命名。
 *
 * @param value New value to write.
 *
 * 要写入的新值。
 *
 * @param sanitizer An optional function used to sanitize the value.
 *
 * 用于清理值的可选函数。
 *
 * @returns
 *
 * This function returns itself so that it may be chained
 * (e.g. `property('name', ctx.name)('title', ctx.title)`)
 *
 * 此函数返回自身，以便它可以被链接（例如 `property('name', ctx.name)('title', ctx.title)` ）
 *
 * @codeGenApi
 */
export function ɵɵproperty<T>(
    propName: string, value: T, sanitizer?: SanitizerFn|null): typeof ɵɵproperty {
  const lView = getLView();
  const bindingIndex = nextBindingIndex();
  if (bindingUpdated(lView, bindingIndex, value)) {
    const tView = getTView();
    const tNode = getSelectedTNode();
    elementPropertyInternal(
        tView, tNode, lView, propName, value, lView[RENDERER], sanitizer, false);
    ngDevMode && storePropertyBindingMetadata(tView.data, tNode, propName, bindingIndex);
  }
  return ɵɵproperty;
}

/**
 * Given `<div style="..." my-dir>` and `MyDir` with `@Input('style')` we need to write to
 * directive input.
 *
 * 给定 `<div style="..." my-dir>` 和带有 `MyDir` `@Input('style')` MyDir ，我们需要写入指令输入。
 *
 */
export function setDirectiveInputsWhichShadowsStyling(
    tView: TView, tNode: TNode, lView: LView, value: any, isClassBased: boolean) {
  const inputs = tNode.inputs!;
  const property = isClassBased ? 'class' : 'style';
  // We support both 'class' and `className` hence the fallback.
  setInputsForProperty(tView, lView, inputs[property], property, value);
}

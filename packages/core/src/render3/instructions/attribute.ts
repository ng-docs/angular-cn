/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {bindingUpdated} from '../bindings';
import {SanitizerFn} from '../interfaces/sanitization';
import {getLView, getSelectedTNode, getTView, nextBindingIndex} from '../state';

import {elementAttributeInternal, storePropertyBindingMetadata} from './shared';



/**
 * Updates the value of or removes a bound attribute on an Element.
 *
 * 更新 Element 上的绑定属性的值或删除。
 *
 * Used in the case of `[attr.title]="value"`
 *
 * 在 `[attr.title]="value"` 的情况下使用
 *
 * @param name name The name of the attribute.
 *
 * name 属性的名称。
 *
 * @param value value The attribute is removed when value is `null` or `undefined`.
 *                  Otherwise the attribute value is set to the stringified value.
 *
 * value 当 value 为 `null` 或 `undefined` 时，此属性会被删除。否则，属性值被设置为字符串化值。
 *
 * @param sanitizer An optional function used to sanitize the value.
 *
 * 用于清理值的可选函数。
 *
 * @param namespace Optional namespace to use when setting the attribute.
 *
 * 设置属性时要使用的可选命名空间。
 *
 * @codeGenApi
 */
export function ɵɵattribute(
    name: string, value: any, sanitizer?: SanitizerFn|null,
    namespace?: string): typeof ɵɵattribute {
  const lView = getLView();
  const bindingIndex = nextBindingIndex();
  if (bindingUpdated(lView, bindingIndex, value)) {
    const tView = getTView();
    const tNode = getSelectedTNode();
    elementAttributeInternal(tNode, lView, name, value, sanitizer, namespace);
    ngDevMode && storePropertyBindingMetadata(tView.data, tNode, 'attr.' + name, bindingIndex);
  }
  return ɵɵattribute;
}

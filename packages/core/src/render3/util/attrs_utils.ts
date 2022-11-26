/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {CharCode} from '../../util/char_code';
import {AttributeMarker, TAttributes} from '../interfaces/node';
import {CssSelector} from '../interfaces/projection';
import {Renderer} from '../interfaces/renderer';
import {RElement} from '../interfaces/renderer_dom';



/**
 * Assigns all attribute values to the provided element via the inferred renderer.
 *
 * 通过推断的渲染器将所有属性值分配给提供的元素。
 *
 * This function accepts two forms of attribute entries:
 *
 * 此函数接受两种形式的属性条目：
 *
 * default: (key, value):
 *  attrs = [key1, value1, key2, value2]
 *
 * 默认值：（键，值）： attrs = [key1, value1, key2, value2][key1, value1, key2, value2]
 *
 * namespaced: (NAMESPACE_MARKER, uri, name, value)
 *  attrs = [NAMESPACE_MARKER, uri, name, value, NAMESPACE_MARKER, uri, name, value]
 *
 * 命名空间： (NAMESPACE_MARKER, uri, name, value) attrs = [NAMESPACE_MARKER, uri, name, value,
 * NAMESPACE_MARKER, uri, name, value][NAMESPACE_MARKER, uri, name, value, NAMESPACE_MARKER, uri,
 * name, value]
 *
 * The `attrs` array can contain a mix of both the default and namespaced entries.
 * The "default" values are set without a marker, but if the function comes across
 * a marker value then it will attempt to set a namespaced value. If the marker is
 * not of a namespaced value then the function will quit and return the index value
 * where it stopped during the iteration of the attrs array.
 *
 * `attrs` 数组可以包含默认条目和命名空间条目的混合。
 * “默认”值是在没有标记的情况下设置的，但如果函数遇到标记值，那么它将尝试设置一个命名空间值。如果标记不属于命名空间值，则函数将退出并返回它在
 * attrs 数组迭代期间停止的索引值。
 *
 * See [AttributeMarker] to understand what the namespace marker value is.
 *
 * 请参阅[AttributeMarker][AttributeMarker]以了解命名空间标记的值。
 *
 * Note that this instruction does not support assigning style and class values to
 * an element. See `elementStart` and `elementHostAttrs` to learn how styling values
 * are applied to an element.
 *
 * 请注意，本操作指南不支持为元素分配 style 和 class 值。请参阅 `elementStart` 和 `elementHostAttrs`
 * 以了解如何将样式值应用于元素。
 *
 * @param renderer The renderer to be used
 *
 * 要使用的渲染器
 *
 * @param native The element that the attributes will be assigned to
 *
 * 属性将分配给的元素
 *
 * @param attrs The attribute array of values that will be assigned to the element
 *
 * 将分配给元素的值的属性数组
 *
 * @returns
 *
 * the index value that was last accessed in the attributes array
 *
 * 属性数组中最后访问的索引值
 *
 */
export function setUpAttributes(renderer: Renderer, native: RElement, attrs: TAttributes): number {
  let i = 0;
  while (i < attrs.length) {
    const value = attrs[i];
    if (typeof value === 'number') {
      // only namespaces are supported. Other value types (such as style/class
      // entries) are not supported in this function.
      if (value !== AttributeMarker.NamespaceURI) {
        break;
      }

      // we just landed on the marker value ... therefore
      // we should skip to the next entry
      i++;

      const namespaceURI = attrs[i++] as string;
      const attrName = attrs[i++] as string;
      const attrVal = attrs[i++] as string;
      ngDevMode && ngDevMode.rendererSetAttribute++;
      renderer.setAttribute(native, attrName, attrVal, namespaceURI);
    } else {
      // attrName is string;
      const attrName = value as string;
      const attrVal = attrs[++i];
      // Standard attributes
      ngDevMode && ngDevMode.rendererSetAttribute++;
      if (isAnimationProp(attrName)) {
        renderer.setProperty(native, attrName, attrVal);
      } else {
        renderer.setAttribute(native, attrName, attrVal as string);
      }
      i++;
    }
  }

  // another piece of code may iterate over the same attributes array. Therefore
  // it may be helpful to return the exact spot where the attributes array exited
  // whether by running into an unsupported marker or if all the static values were
  // iterated over.
  return i;
}

/**
 * Test whether the given value is a marker that indicates that the following
 * attribute values in a `TAttributes` array are only the names of attributes,
 * and not name-value pairs.
 *
 * 测试给定值是否是一个标记，该标记表明 `TAttributes`
 * 数组中的以下属性值只是属性名称，而不是名称-值对。
 *
 * @param marker The attribute marker to test.
 *
 * 要测试的属性标记。
 *
 * @returns
 *
 * true if the marker is a "name-only" marker (e.g. `Bindings`, `Template` or `I18n`).
 *
 * 如果标记是“仅名称”标记（例如 `Bindings`、`Template` 或 `I18n`），则为 true 。
 *
 */
export function isNameOnlyAttributeMarker(marker: string|AttributeMarker|CssSelector) {
  return marker === AttributeMarker.Bindings || marker === AttributeMarker.Template ||
      marker === AttributeMarker.I18n;
}

export function isAnimationProp(name: string): boolean {
  // Perf note: accessing charCodeAt to check for the first character of a string is faster as
  // compared to accessing a character at index 0 (ex. name[0]). The main reason for this is that
  // charCodeAt doesn't allocate memory to return a substring.
  return name.charCodeAt(0) === CharCode.AT_SIGN;
}

/**
 * Merges `src` `TAttributes` into `dst` `TAttributes` removing any duplicates in the process.
 *
 * 将 `src` `TAttributes` 合并到 `dst` `TAttributes` 中，删除过程中的任何重复项。
 *
 * This merge function keeps the order of attrs same.
 *
 * 此合并函数保持 attrs 的顺序相同。
 *
 * @param dst Location of where the merged `TAttributes` should end up.
 *
 * 合并的 `TAttributes` 应该最终到达的位置。
 *
 * @param src `TAttributes` which should be appended to `dst`
 *
 * 应该附加到 `dst` 的 `TAttributes`
 *
 */
export function mergeHostAttrs(dst: TAttributes|null, src: TAttributes|null): TAttributes|null {
  if (src === null || src.length === 0) {
    // do nothing
  } else if (dst === null || dst.length === 0) {
    // We have source, but dst is empty, just make a copy.
    dst = src.slice();
  } else {
    let srcMarker: AttributeMarker = AttributeMarker.ImplicitAttributes;
    for (let i = 0; i < src.length; i++) {
      const item = src[i];
      if (typeof item === 'number') {
        srcMarker = item;
      } else {
        if (srcMarker === AttributeMarker.NamespaceURI) {
          // Case where we need to consume `key1`, `key2`, `value` items.
        } else if (
            srcMarker === AttributeMarker.ImplicitAttributes ||
            srcMarker === AttributeMarker.Styles) {
          // Case where we have to consume `key1` and `value` only.
          mergeHostAttribute(dst, srcMarker, item as string, null, src[++i] as string);
        } else {
          // Case where we have to consume `key1` only.
          mergeHostAttribute(dst, srcMarker, item as string, null, null);
        }
      }
    }
  }
  return dst;
}

/**
 * Append `key`/`value` to existing `TAttributes` taking region marker and duplicates into account.
 *
 * 将 `key` / `value` 附加到现有的 `TAttributes` ，同时考虑区域标记和重复项。
 *
 * @param dst `TAttributes` to append to.
 *
 * 要附加到的 `TAttributes` 。
 *
 * @param marker Region where the `key`/`value` should be added.
 *
 * 应该添加 `key` / `value` 的区域。
 *
 * @param key1 Key to add to `TAttributes`
 *
 * 要添加到 `TAttributes` 的键
 *
 * @param key2 Key to add to `TAttributes` (in case of `AttributeMarker.NamespaceURI`)
 *
 * 要添加到 `TAttributes` 的键（在 `AttributeMarker.NamespaceURI` 的情况下）
 *
 * @param value Value to add or to overwrite to `TAttributes` Only used if `marker` is not Class.
 *
 * 要添加或覆盖 `TAttributes` 的值仅在 `marker` 不是 Class 时使用。
 *
 */
export function mergeHostAttribute(
    dst: TAttributes, marker: AttributeMarker, key1: string, key2: string|null,
    value: string|null): void {
  let i = 0;
  // Assume that new markers will be inserted at the end.
  let markerInsertPosition = dst.length;
  // scan until correct type.
  if (marker === AttributeMarker.ImplicitAttributes) {
    markerInsertPosition = -1;
  } else {
    while (i < dst.length) {
      const dstValue = dst[i++];
      if (typeof dstValue === 'number') {
        if (dstValue === marker) {
          markerInsertPosition = -1;
          break;
        } else if (dstValue > marker) {
          // We need to save this as we want the markers to be inserted in specific order.
          markerInsertPosition = i - 1;
          break;
        }
      }
    }
  }

  // search until you find place of insertion
  while (i < dst.length) {
    const item = dst[i];
    if (typeof item === 'number') {
      // since `i` started as the index after the marker, we did not find it if we are at the next
      // marker
      break;
    } else if (item === key1) {
      // We already have same token
      if (key2 === null) {
        if (value !== null) {
          dst[i + 1] = value;
        }
        return;
      } else if (key2 === dst[i + 1]) {
        dst[i + 2] = value!;
        return;
      }
    }
    // Increment counter.
    i++;
    if (key2 !== null) i++;
    if (value !== null) i++;
  }

  // insert at location.
  if (markerInsertPosition !== -1) {
    dst.splice(markerInsertPosition, 0, marker);
    i = markerInsertPosition + 1;
  }
  dst.splice(i++, 0, key1);
  if (key2 !== null) {
    dst.splice(i++, 0, key2);
  }
  if (value !== null) {
    dst.splice(i++, 0, value);
  }
}

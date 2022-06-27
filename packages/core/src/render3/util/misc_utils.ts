/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {global} from '../../util/global';
import {RElement} from '../interfaces/renderer_dom';


export const defaultScheduler =
    (() => (
               typeof requestAnimationFrame !== 'undefined' &&
                   requestAnimationFrame ||  // browser only
               setTimeout                    // everything else
               )
               .bind(global))();

/**
 *
 * @codeGenApi
 */
export function ɵɵresolveWindow(element: RElement&{ownerDocument: Document}) {
  return element.ownerDocument.defaultView;
}

/**
 *
 * @codeGenApi
 */
export function ɵɵresolveDocument(element: RElement&{ownerDocument: Document}) {
  return element.ownerDocument;
}

/**
 *
 * @codeGenApi
 */
export function ɵɵresolveBody(element: RElement&{ownerDocument: Document}) {
  return element.ownerDocument.body;
}

/**
 * The special delimiter we use to separate property names, prefixes, and suffixes
 * in property binding metadata. See storeBindingMetadata().
 *
 * 我们用来分隔属性绑定元数据中的属性名称、前缀和后缀的特殊分隔符。请参阅 storeBindingMetadata() 。
 *
 * We intentionally use the Unicode "REPLACEMENT CHARACTER" (U+FFFD) as a delimiter
 * because it is a very uncommon character that is unlikely to be part of a user's
 * property names or interpolation strings. If it is in fact used in a property
 * binding, DebugElement.properties will not return the correct value for that
 * binding. However, there should be no runtime effect for real applications.
 *
 * 我们特意使用 Unicode “替换字符” (U+FFFD)
 * 作为分隔符，因为它是一个非常罕见的字符，不太可能是用户属性名称或插值字符串的一部分。如果它实际上用于属性绑定，则
 * DebugElement.properties 将不会返回该绑定的正确值。但是，对于真实应用程序，不应该有运行时效果。
 *
 * This character is typically rendered as a question mark inside of a diamond.
 * See <https://en.wikipedia.org/wiki/Specials_(Unicode_block>)
 *
 * 此字符通常呈现为钻石内的问号。请参阅<https://en.wikipedia.org/wiki/Specials_(Unicode_block> )
 *
 */
export const INTERPOLATION_DELIMITER = `�`;

/**
 * Unwrap a value which might be behind a closure (for forward declaration reasons).
 *
 * 展开一个可能在闭包后面的值（出于前向声明的原因）。
 *
 */
export function maybeUnwrapFn<T>(value: T|(() => T)): T {
  if (value instanceof Function) {
    return value();
  } else {
    return value;
  }
}

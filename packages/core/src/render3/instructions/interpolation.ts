/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {assertEqual, assertLessThan} from '../../util/assert';
import {bindingUpdated, bindingUpdated2, bindingUpdated3, bindingUpdated4} from '../bindings';
import {LView} from '../interfaces/view';
import {getBindingIndex, incrementBindingIndex, nextBindingIndex, setBindingIndex} from '../state';
import {NO_CHANGE} from '../tokens';
import {renderStringify} from '../util/stringify_utils';



/**
 * Create interpolation bindings with a variable number of expressions.
 *
 * 创建使用可变数量的表达式的插值绑定。
 *
 * If there are 1 to 8 expressions `interpolation1()` to `interpolation8()` should be used instead.
 * Those are faster because there is no need to create an array of expressions and iterate over it.
 *
 * 如果有 1 到 8 个表达式，则应改用 `interpolation1()` 到 `interpolation8()`
 * 。那些更快，因为无需创建表达式数组并迭代它。
 *
 * `values`:
 *
 * `values` ：
 *
 * - has static text at even indexes,
 *
 *   在偶数索引处有静态文本，
 *
 * - has evaluated expressions at odd indexes.
 *
 *   在奇数索引处估算了表达式。
 *
 * Returns the concatenated string when any of the arguments changes, `NO_CHANGE` otherwise.
 *
 * 当任何参数更改时返回连接字符串，否则返回 `NO_CHANGE` 。
 *
 */
export function interpolationV(lView: LView, values: any[]): string|NO_CHANGE {
  ngDevMode && assertLessThan(2, values.length, 'should have at least 3 values');
  ngDevMode && assertEqual(values.length % 2, 1, 'should have an odd number of values');
  let isBindingUpdated = false;
  let bindingIndex = getBindingIndex();

  for (let i = 1; i < values.length; i += 2) {
    // Check if bindings (odd indexes) have changed
    isBindingUpdated = bindingUpdated(lView, bindingIndex++, values[i]) || isBindingUpdated;
  }
  setBindingIndex(bindingIndex);

  if (!isBindingUpdated) {
    return NO_CHANGE;
  }

  // Build the updated content
  let content = values[0];
  for (let i = 1; i < values.length; i += 2) {
    content += renderStringify(values[i]) + values[i + 1];
  }

  return content;
}

/**
 * Creates an interpolation binding with 1 expression.
 *
 * 创建具有 1 个表达式的插值绑定。
 *
 * @param prefix static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v0 value checked for change.
 *
 * 检查更改的值。
 *
 * @param suffix static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 */
export function interpolation1(lView: LView, prefix: string, v0: any, suffix: string): string|
    NO_CHANGE {
  const different = bindingUpdated(lView, nextBindingIndex(), v0);
  return different ? prefix + renderStringify(v0) + suffix : NO_CHANGE;
}

/**
 * Creates an interpolation binding with 2 expressions.
 *
 * 创建使用 2 个表达式的插值绑定。
 *
 */
export function interpolation2(
    lView: LView, prefix: string, v0: any, i0: string, v1: any, suffix: string): string|NO_CHANGE {
  const bindingIndex = getBindingIndex();
  const different = bindingUpdated2(lView, bindingIndex, v0, v1);
  incrementBindingIndex(2);

  return different ? prefix + renderStringify(v0) + i0 + renderStringify(v1) + suffix : NO_CHANGE;
}

/**
 * Creates an interpolation binding with 3 expressions.
 *
 * 创建具有 3 个表达式的插值绑定。
 *
 */
export function interpolation3(
    lView: LView, prefix: string, v0: any, i0: string, v1: any, i1: string, v2: any,
    suffix: string): string|NO_CHANGE {
  const bindingIndex = getBindingIndex();
  const different = bindingUpdated3(lView, bindingIndex, v0, v1, v2);
  incrementBindingIndex(3);

  return different ?
      prefix + renderStringify(v0) + i0 + renderStringify(v1) + i1 + renderStringify(v2) + suffix :
      NO_CHANGE;
}

/**
 * Create an interpolation binding with 4 expressions.
 *
 * 创建使用 4 个表达式的插值绑定。
 *
 */
export function interpolation4(
    lView: LView, prefix: string, v0: any, i0: string, v1: any, i1: string, v2: any, i2: string,
    v3: any, suffix: string): string|NO_CHANGE {
  const bindingIndex = getBindingIndex();
  const different = bindingUpdated4(lView, bindingIndex, v0, v1, v2, v3);
  incrementBindingIndex(4);

  return different ? prefix + renderStringify(v0) + i0 + renderStringify(v1) + i1 +
          renderStringify(v2) + i2 + renderStringify(v3) + suffix :
                     NO_CHANGE;
}

/**
 * Creates an interpolation binding with 5 expressions.
 *
 * 创建具有 5 个表达式的插值绑定。
 *
 */
export function interpolation5(
    lView: LView, prefix: string, v0: any, i0: string, v1: any, i1: string, v2: any, i2: string,
    v3: any, i3: string, v4: any, suffix: string): string|NO_CHANGE {
  const bindingIndex = getBindingIndex();
  let different = bindingUpdated4(lView, bindingIndex, v0, v1, v2, v3);
  different = bindingUpdated(lView, bindingIndex + 4, v4) || different;
  incrementBindingIndex(5);

  return different ? prefix + renderStringify(v0) + i0 + renderStringify(v1) + i1 +
          renderStringify(v2) + i2 + renderStringify(v3) + i3 + renderStringify(v4) + suffix :
                     NO_CHANGE;
}

/**
 * Creates an interpolation binding with 6 expressions.
 *
 * 创建具有 6 个表达式的插值绑定。
 *
 */
export function interpolation6(
    lView: LView, prefix: string, v0: any, i0: string, v1: any, i1: string, v2: any, i2: string,
    v3: any, i3: string, v4: any, i4: string, v5: any, suffix: string): string|NO_CHANGE {
  const bindingIndex = getBindingIndex();
  let different = bindingUpdated4(lView, bindingIndex, v0, v1, v2, v3);
  different = bindingUpdated2(lView, bindingIndex + 4, v4, v5) || different;
  incrementBindingIndex(6);

  return different ?
      prefix + renderStringify(v0) + i0 + renderStringify(v1) + i1 + renderStringify(v2) + i2 +
          renderStringify(v3) + i3 + renderStringify(v4) + i4 + renderStringify(v5) + suffix :
      NO_CHANGE;
}

/**
 * Creates an interpolation binding with 7 expressions.
 *
 * 创建具有 7 个表达式的插值绑定。
 *
 */
export function interpolation7(
    lView: LView, prefix: string, v0: any, i0: string, v1: any, i1: string, v2: any, i2: string,
    v3: any, i3: string, v4: any, i4: string, v5: any, i5: string, v6: any, suffix: string): string|
    NO_CHANGE {
  const bindingIndex = getBindingIndex();
  let different = bindingUpdated4(lView, bindingIndex, v0, v1, v2, v3);
  different = bindingUpdated3(lView, bindingIndex + 4, v4, v5, v6) || different;
  incrementBindingIndex(7);

  return different ? prefix + renderStringify(v0) + i0 + renderStringify(v1) + i1 +
          renderStringify(v2) + i2 + renderStringify(v3) + i3 + renderStringify(v4) + i4 +
          renderStringify(v5) + i5 + renderStringify(v6) + suffix :
                     NO_CHANGE;
}

/**
 * Creates an interpolation binding with 8 expressions.
 *
 * 创建具有 8 个表达式的插值绑定。
 *
 */
export function interpolation8(
    lView: LView, prefix: string, v0: any, i0: string, v1: any, i1: string, v2: any, i2: string,
    v3: any, i3: string, v4: any, i4: string, v5: any, i5: string, v6: any, i6: string, v7: any,
    suffix: string): string|NO_CHANGE {
  const bindingIndex = getBindingIndex();
  let different = bindingUpdated4(lView, bindingIndex, v0, v1, v2, v3);
  different = bindingUpdated4(lView, bindingIndex + 4, v4, v5, v6, v7) || different;
  incrementBindingIndex(8);

  return different ? prefix + renderStringify(v0) + i0 + renderStringify(v1) + i1 +
          renderStringify(v2) + i2 + renderStringify(v3) + i3 + renderStringify(v4) + i4 +
          renderStringify(v5) + i5 + renderStringify(v6) + i6 + renderStringify(v7) + suffix :
                     NO_CHANGE;
}

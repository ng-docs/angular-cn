/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {keyValueArraySet} from '../../util/array_utils';
import {getLView} from '../state';

import {interpolation1, interpolation2, interpolation3, interpolation4, interpolation5, interpolation6, interpolation7, interpolation8, interpolationV} from './interpolation';
import {checkStylingMap, classStringParser} from './styling';



/**
 * Update an interpolated class on an element with single bound value surrounded by text.
 *
 * 使用被文本包围的单个绑定值更新元素上的插值类。
 *
 * Used when the value passed to a property has 1 interpolated value in it:
 *
 * 当传递给属性的值中有 1 个插值时使用：
 *
 * ```html
 * <div class="prefix{{v0}}suffix"></div>
 * ```
 *
 * Its compiled representation is:
 *
 * 其编译后的表示是：
 *
 * ```ts
 * ɵɵclassMapInterpolate1('prefix', v0, 'suffix');
 * ```
 *
 * @param prefix Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v0 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param suffix Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @codeGenApi
 */
export function ɵɵclassMapInterpolate1(prefix: string, v0: any, suffix: string): void {
  const lView = getLView();
  const interpolatedValue = interpolation1(lView, prefix, v0, suffix);
  checkStylingMap(keyValueArraySet, classStringParser, interpolatedValue, true);
}

/**
 * Update an interpolated class on an element with 2 bound values surrounded by text.
 *
 * 使用 2 个被文本包围的绑定值更新元素上的插值类。
 *
 * Used when the value passed to a property has 2 interpolated values in it:
 *
 * 当传递给属性的值中有 2 个插值时使用：
 *
 * ```html
 * <div class="prefix{{v0}}-{{v1}}suffix"></div>
 * ```
 *
 * Its compiled representation is:
 *
 * 其编译后的表示是：
 *
 * ```ts
 * ɵɵclassMapInterpolate2('prefix', v0, '-', v1, 'suffix');
 * ```
 *
 * @param prefix Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v0 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i0 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v1 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param suffix Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @codeGenApi
 */
export function ɵɵclassMapInterpolate2(
    prefix: string, v0: any, i0: string, v1: any, suffix: string): void {
  const lView = getLView();
  const interpolatedValue = interpolation2(lView, prefix, v0, i0, v1, suffix);
  checkStylingMap(keyValueArraySet, classStringParser, interpolatedValue, true);
}

/**
 * Update an interpolated class on an element with 3 bound values surrounded by text.
 *
 * 使用 3 个被文本包围的绑定值更新元素上的插值类。
 *
 * Used when the value passed to a property has 3 interpolated values in it:
 *
 * 当传递给属性的值中有 3 个插值时使用：
 *
 * ```html
 * <div class="prefix{{v0}}-{{v1}}-{{v2}}suffix"></div>
 * ```
 *
 * Its compiled representation is:
 *
 * 其编译后的表示是：
 *
 * ```ts
 * ɵɵclassMapInterpolate3(
 * 'prefix', v0, '-', v1, '-', v2, 'suffix');
 * ```
 *
 * @param prefix Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v0 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i0 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v1 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i1 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v2 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param suffix Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @codeGenApi
 */
export function ɵɵclassMapInterpolate3(
    prefix: string, v0: any, i0: string, v1: any, i1: string, v2: any, suffix: string): void {
  const lView = getLView();
  const interpolatedValue = interpolation3(lView, prefix, v0, i0, v1, i1, v2, suffix);
  checkStylingMap(keyValueArraySet, classStringParser, interpolatedValue, true);
}

/**
 * Update an interpolated class on an element with 4 bound values surrounded by text.
 *
 * 使用 4 个被文本包围的绑定值更新元素上的插值类。
 *
 * Used when the value passed to a property has 4 interpolated values in it:
 *
 * 当传递给属性的值中有 4 个插值时使用：
 *
 * ```html
 * <div class="prefix{{v0}}-{{v1}}-{{v2}}-{{v3}}suffix"></div>
 * ```
 *
 * Its compiled representation is:
 *
 * 其编译后的表示是：
 *
 * ```ts
 * ɵɵclassMapInterpolate4(
 * 'prefix', v0, '-', v1, '-', v2, '-', v3, 'suffix');
 * ```
 *
 * @param prefix Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v0 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i0 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v1 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i1 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v2 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i2 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v3 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param suffix Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @codeGenApi
 */
export function ɵɵclassMapInterpolate4(
    prefix: string, v0: any, i0: string, v1: any, i1: string, v2: any, i2: string, v3: any,
    suffix: string): void {
  const lView = getLView();
  const interpolatedValue = interpolation4(lView, prefix, v0, i0, v1, i1, v2, i2, v3, suffix);
  checkStylingMap(keyValueArraySet, classStringParser, interpolatedValue, true);
}

/**
 * Update an interpolated class on an element with 5 bound values surrounded by text.
 *
 * 使用 5 个被文本包围的绑定值更新元素上的插值类。
 *
 * Used when the value passed to a property has 5 interpolated values in it:
 *
 * 当传递给属性的值中有 5 个插值时使用：
 *
 * ```html
 * <div class="prefix{{v0}}-{{v1}}-{{v2}}-{{v3}}-{{v4}}suffix"></div>
 * ```
 *
 * Its compiled representation is:
 *
 * 其编译后的表示是：
 *
 * ```ts
 * ɵɵclassMapInterpolate5(
 * 'prefix', v0, '-', v1, '-', v2, '-', v3, '-', v4, 'suffix');
 * ```
 *
 * @param prefix Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v0 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i0 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v1 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i1 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v2 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i2 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v3 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i3 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v4 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param suffix Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @codeGenApi
 */
export function ɵɵclassMapInterpolate5(
    prefix: string, v0: any, i0: string, v1: any, i1: string, v2: any, i2: string, v3: any,
    i3: string, v4: any, suffix: string): void {
  const lView = getLView();
  const interpolatedValue =
      interpolation5(lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, suffix);
  checkStylingMap(keyValueArraySet, classStringParser, interpolatedValue, true);
}

/**
 * Update an interpolated class on an element with 6 bound values surrounded by text.
 *
 * 使用 6 个被文本包围的绑定值更新元素上的插值类。
 *
 * Used when the value passed to a property has 6 interpolated values in it:
 *
 * 当传递给属性的值中有 6 个插值时使用：
 *
 * ```html
 * <div class="prefix{{v0}}-{{v1}}-{{v2}}-{{v3}}-{{v4}}-{{v5}}suffix"></div>
 * ```
 *
 * Its compiled representation is:
 *
 * 其编译后的表示是：
 *
 * ```ts
 * ɵɵclassMapInterpolate6(
 *    'prefix', v0, '-', v1, '-', v2, '-', v3, '-', v4, '-', v5, 'suffix');
 * ```
 *
 * @param prefix Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v0 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i0 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v1 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i1 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v2 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i2 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v3 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i3 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v4 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i4 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v5 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param suffix Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @codeGenApi
 */
export function ɵɵclassMapInterpolate6(
    prefix: string, v0: any, i0: string, v1: any, i1: string, v2: any, i2: string, v3: any,
    i3: string, v4: any, i4: string, v5: any, suffix: string): void {
  const lView = getLView();
  const interpolatedValue =
      interpolation6(lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, suffix);
  checkStylingMap(keyValueArraySet, classStringParser, interpolatedValue, true);
}

/**
 * Update an interpolated class on an element with 7 bound values surrounded by text.
 *
 * 使用 7 个被文本包围的绑定值更新元素上的插值类。
 *
 * Used when the value passed to a property has 7 interpolated values in it:
 *
 * 当传递给属性的值中有 7 个插值时使用：
 *
 * ```html
 * <div class="prefix{{v0}}-{{v1}}-{{v2}}-{{v3}}-{{v4}}-{{v5}}-{{v6}}suffix"></div>
 * ```
 *
 * Its compiled representation is:
 *
 * 其编译后的表示是：
 *
 * ```ts
 * ɵɵclassMapInterpolate7(
 *    'prefix', v0, '-', v1, '-', v2, '-', v3, '-', v4, '-', v5, '-', v6, 'suffix');
 * ```
 *
 * @param prefix Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v0 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i0 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v1 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i1 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v2 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i2 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v3 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i3 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v4 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i4 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v5 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i5 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v6 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param suffix Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @codeGenApi
 */
export function ɵɵclassMapInterpolate7(
    prefix: string, v0: any, i0: string, v1: any, i1: string, v2: any, i2: string, v3: any,
    i3: string, v4: any, i4: string, v5: any, i5: string, v6: any, suffix: string): void {
  const lView = getLView();
  const interpolatedValue =
      interpolation7(lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, i5, v6, suffix);
  checkStylingMap(keyValueArraySet, classStringParser, interpolatedValue, true);
}

/**
 * Update an interpolated class on an element with 8 bound values surrounded by text.
 *
 * 使用 8 个被文本包围的绑定值更新元素上的插值类。
 *
 * Used when the value passed to a property has 8 interpolated values in it:
 *
 * 当传递给属性的值中有 8 个插值时使用：
 *
 * ```html
 * <div class="prefix{{v0}}-{{v1}}-{{v2}}-{{v3}}-{{v4}}-{{v5}}-{{v6}}-{{v7}}suffix"></div>
 * ```
 *
 * Its compiled representation is:
 *
 * 其编译后的表示是：
 *
 * ```ts
 * ɵɵclassMapInterpolate8(
 *  'prefix', v0, '-', v1, '-', v2, '-', v3, '-', v4, '-', v5, '-', v6, '-', v7, 'suffix');
 * ```
 *
 * @param prefix Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v0 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i0 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v1 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i1 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v2 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i2 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v3 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i3 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v4 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i4 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v5 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i5 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v6 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param i6 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v7 Value checked for change.
 *
 * 检查更改的值。
 *
 * @param suffix Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @codeGenApi
 */
export function ɵɵclassMapInterpolate8(
    prefix: string, v0: any, i0: string, v1: any, i1: string, v2: any, i2: string, v3: any,
    i3: string, v4: any, i4: string, v5: any, i5: string, v6: any, i6: string, v7: any,
    suffix: string): void {
  const lView = getLView();
  const interpolatedValue = interpolation8(
      lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, i5, v6, i6, v7, suffix);
  checkStylingMap(keyValueArraySet, classStringParser, interpolatedValue, true);
}

/**
 * Update an interpolated class on an element with 9 or more bound values surrounded by text.
 *
 * 使用 9 个或更多被文本包围的绑定值更新元素上的插值类。
 *
 * Used when the number of interpolated values exceeds 8.
 *
 * 当内插值的数量超过 8 时使用。
 *
 * ```html
 * <div
 *  class="prefix{{v0}}-{{v1}}-{{v2}}-{{v3}}-{{v4}}-{{v5}}-{{v6}}-{{v7}}-{{v8}}-{{v9}}suffix"></div>
 * ```
 *
 * Its compiled representation is:
 *
 * 其编译后的表示是：
 *
 * ```ts
 * ɵɵclassMapInterpolateV(
 *  ['prefix', v0, '-', v1, '-', v2, '-', v3, '-', v4, '-', v5, '-', v6, '-', v7, '-', v9,
 *  'suffix']);
 * ```
 *
 * .
 *
 * @param values The collection of values and the strings in-between those values, beginning with
 * a string prefix and ending with a string suffix.
 * (e.g. `['prefix', value0, '-', value1, '-', value2, ..., value99, 'suffix']`)
 *
 * 值和这些值之间的字符串的集合，以字符串前缀开头并以字符串后缀结尾。（例如 `['prefix', value0,
 * '-', value1, '-', value2, ..., value99, 'suffix']`）
 *
 * @codeGenApi
 */
export function ɵɵclassMapInterpolateV(values: any[]): void {
  const lView = getLView();
  const interpolatedValue = interpolationV(lView, values);
  checkStylingMap(keyValueArraySet, classStringParser, interpolatedValue, true);
}

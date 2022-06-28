/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {getLView, getSelectedIndex} from '../state';
import {NO_CHANGE} from '../tokens';

import {interpolation1, interpolation2, interpolation3, interpolation4, interpolation5, interpolation6, interpolation7, interpolation8, interpolationV} from './interpolation';
import {textBindingInternal} from './shared';


/**
 * Update text content with a lone bound value
 *
 * 使用唯一绑定值更新文本内容
 *
 * Used when a text node has 1 interpolated value in it, an no additional text
 * surrounds that interpolated value:
 *
 * 当文本节点中有 1 个内插值时使用，并且该内插值周围没有额外的文本：
 *
 * ```html
 * <div>{{v0}}</div>
 * ```
 *
 * Its compiled representation is:
 *
 * 其编译后的表示是：
 *
 * ```ts
 * ɵɵtextInterpolate(v0);
 * ```
 *
 * @returns
 *
 * itself, so that it may be chained.
 *
 * 本身，以便它可以被链接起来。
 *
 * @see textInterpolateV
 *
 * 文本插值 V
 *
 * @codeGenApi
 */
export function ɵɵtextInterpolate(v0: any): typeof ɵɵtextInterpolate {
  ɵɵtextInterpolate1('', v0, '');
  return ɵɵtextInterpolate;
}


/**
 * Update text content with single bound value surrounded by other text.
 *
 * 使用被其他文本包围的单个绑定值更新文本内容。
 *
 * Used when a text node has 1 interpolated value in it:
 *
 * 当文本节点中有 1 个插值时使用：
 *
 * ```html
 * <div>prefix{{v0}}suffix</div>
 * ```
 *
 * Its compiled representation is:
 *
 * 其编译后的表示是：
 *
 * ```ts
 * ɵɵtextInterpolate1('prefix', v0, 'suffix');
 * ```
 *
 * @returns
 *
 * itself, so that it may be chained.
 *
 * 本身，以便它可以被链接起来。
 *
 * @see textInterpolateV
 *
 * 文本插值 V
 *
 * @codeGenApi
 */
export function ɵɵtextInterpolate1(
    prefix: string, v0: any, suffix: string): typeof ɵɵtextInterpolate1 {
  const lView = getLView();
  const interpolated = interpolation1(lView, prefix, v0, suffix);
  if (interpolated !== NO_CHANGE) {
    textBindingInternal(lView, getSelectedIndex(), interpolated as string);
  }
  return ɵɵtextInterpolate1;
}

/**
 * Update text content with 2 bound values surrounded by other text.
 *
 * 使用被其他文本包围的 2 个绑定值更新文本内容。
 *
 * Used when a text node has 2 interpolated values in it:
 *
 * 当文本节点中有 2 个插值时使用：
 *
 * ```html
 * <div>prefix{{v0}}-{{v1}}suffix</div>
 * ```
 *
 * Its compiled representation is:
 *
 * 其编译后的表示是：
 *
 * ```ts
 * ɵɵtextInterpolate2('prefix', v0, '-', v1, 'suffix');
 * ```
 *
 * @returns
 *
 * itself, so that it may be chained.
 *
 * 本身，以便它可以被链接起来。
 *
 * @see textInterpolateV
 *
 * 文本插值 V
 *
 * @codeGenApi
 */
export function ɵɵtextInterpolate2(
    prefix: string, v0: any, i0: string, v1: any, suffix: string): typeof ɵɵtextInterpolate2 {
  const lView = getLView();
  const interpolated = interpolation2(lView, prefix, v0, i0, v1, suffix);
  if (interpolated !== NO_CHANGE) {
    textBindingInternal(lView, getSelectedIndex(), interpolated as string);
  }
  return ɵɵtextInterpolate2;
}

/**
 * Update text content with 3 bound values surrounded by other text.
 *
 * 使用被其他文本包围的 3 个绑定值更新文本内容。
 *
 * Used when a text node has 3 interpolated values in it:
 *
 * 当文本节点中有 3 个插值时使用：
 *
 * ```html
 * <div>prefix{{v0}}-{{v1}}-{{v2}}suffix</div>
 * ```
 *
 * Its compiled representation is:
 *
 * 其编译后的表示是：
 *
 * ```ts
 * ɵɵtextInterpolate3(
 * 'prefix', v0, '-', v1, '-', v2, 'suffix');
 * ```
 *
 * @returns
 *
 * itself, so that it may be chained.
 *
 * 本身，以便它可以被链接起来。
 *
 * @see textInterpolateV
 *
 * 文本插值 V
 *
 * @codeGenApi
 */
export function ɵɵtextInterpolate3(
    prefix: string, v0: any, i0: string, v1: any, i1: string, v2: any,
    suffix: string): typeof ɵɵtextInterpolate3 {
  const lView = getLView();
  const interpolated = interpolation3(lView, prefix, v0, i0, v1, i1, v2, suffix);
  if (interpolated !== NO_CHANGE) {
    textBindingInternal(lView, getSelectedIndex(), interpolated as string);
  }
  return ɵɵtextInterpolate3;
}

/**
 * Update text content with 4 bound values surrounded by other text.
 *
 * 使用被其他文本包围的 4 个绑定值更新文本内容。
 *
 * Used when a text node has 4 interpolated values in it:
 *
 * 当文本节点中有 4 个插值时使用：
 *
 * ```html
 * <div>prefix{{v0}}-{{v1}}-{{v2}}-{{v3}}suffix</div>
 * ```
 *
 * Its compiled representation is:
 *
 * 其编译后的表示是：
 *
 * ```ts
 * ɵɵtextInterpolate4(
 * 'prefix', v0, '-', v1, '-', v2, '-', v3, 'suffix');
 * ```
 *
 * @returns
 *
 * itself, so that it may be chained.
 *
 * 本身，以便它可以被链接起来。
 *
 * @see ɵɵtextInterpolateV
 *
 * ɵɵtextInterplateV
 *
 * @codeGenApi
 */
export function ɵɵtextInterpolate4(
    prefix: string, v0: any, i0: string, v1: any, i1: string, v2: any, i2: string, v3: any,
    suffix: string): typeof ɵɵtextInterpolate4 {
  const lView = getLView();
  const interpolated = interpolation4(lView, prefix, v0, i0, v1, i1, v2, i2, v3, suffix);
  if (interpolated !== NO_CHANGE) {
    textBindingInternal(lView, getSelectedIndex(), interpolated as string);
  }
  return ɵɵtextInterpolate4;
}

/**
 * Update text content with 5 bound values surrounded by other text.
 *
 * 使用被其他文本包围的 5 个绑定值更新文本内容。
 *
 * Used when a text node has 5 interpolated values in it:
 *
 * 当文本节点中有 5 个插值时使用：
 *
 * ```html
 * <div>prefix{{v0}}-{{v1}}-{{v2}}-{{v3}}-{{v4}}suffix</div>
 * ```
 *
 * Its compiled representation is:
 *
 * 其编译后的表示是：
 *
 * ```ts
 * ɵɵtextInterpolate5(
 * 'prefix', v0, '-', v1, '-', v2, '-', v3, '-', v4, 'suffix');
 * ```
 *
 * @returns
 *
 * itself, so that it may be chained.
 *
 * 本身，以便它可以被链接起来。
 *
 * @see textInterpolateV
 *
 * 文本插值 V
 *
 * @codeGenApi
 */
export function ɵɵtextInterpolate5(
    prefix: string, v0: any, i0: string, v1: any, i1: string, v2: any, i2: string, v3: any,
    i3: string, v4: any, suffix: string): typeof ɵɵtextInterpolate5 {
  const lView = getLView();
  const interpolated = interpolation5(lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, suffix);
  if (interpolated !== NO_CHANGE) {
    textBindingInternal(lView, getSelectedIndex(), interpolated as string);
  }
  return ɵɵtextInterpolate5;
}

/**
 * Update text content with 6 bound values surrounded by other text.
 *
 * 使用被其他文本包围的 6 个绑定值更新文本内容。
 *
 * Used when a text node has 6 interpolated values in it:
 *
 * 当文本节点中有 6 个插值时使用：
 *
 * ```html
 * <div>prefix{{v0}}-{{v1}}-{{v2}}-{{v3}}-{{v4}}-{{v5}}suffix</div>
 * ```
 *
 * Its compiled representation is:
 *
 * 其编译后的表示是：
 *
 * ```ts
 * ɵɵtextInterpolate6(
 *    'prefix', v0, '-', v1, '-', v2, '-', v3, '-', v4, '-', v5, 'suffix');
 * ```
 *
 * @param i4 Static value used for concatenation only.
 *
 * 仅用于连接的静态值。
 *
 * @param v5 Value checked for change.
 *
 * 检查更改的值。
 *
 * @returns
 *
 * itself, so that it may be chained.
 *
 * 本身，以便它可以被链接起来。
 *
 * @see textInterpolateV
 *
 * 文本插值 V
 *
 * @codeGenApi
 */
export function ɵɵtextInterpolate6(
    prefix: string, v0: any, i0: string, v1: any, i1: string, v2: any, i2: string, v3: any,
    i3: string, v4: any, i4: string, v5: any, suffix: string): typeof ɵɵtextInterpolate6 {
  const lView = getLView();
  const interpolated =
      interpolation6(lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, suffix);
  if (interpolated !== NO_CHANGE) {
    textBindingInternal(lView, getSelectedIndex(), interpolated as string);
  }
  return ɵɵtextInterpolate6;
}

/**
 * Update text content with 7 bound values surrounded by other text.
 *
 * 使用被其他文本包围的 7 个绑定值更新文本内容。
 *
 * Used when a text node has 7 interpolated values in it:
 *
 * 当文本节点中有 7 个插值时使用：
 *
 * ```html
 * <div>prefix{{v0}}-{{v1}}-{{v2}}-{{v3}}-{{v4}}-{{v5}}-{{v6}}suffix</div>
 * ```
 *
 * Its compiled representation is:
 *
 * 其编译后的表示是：
 *
 * ```ts
 * ɵɵtextInterpolate7(
 *    'prefix', v0, '-', v1, '-', v2, '-', v3, '-', v4, '-', v5, '-', v6, 'suffix');
 * ```
 *
 * @returns
 *
 * itself, so that it may be chained.
 *
 * 本身，以便它可以被链接起来。
 *
 * @see textInterpolateV
 *
 * 文本插值 V
 *
 * @codeGenApi
 */
export function ɵɵtextInterpolate7(
    prefix: string, v0: any, i0: string, v1: any, i1: string, v2: any, i2: string, v3: any,
    i3: string, v4: any, i4: string, v5: any, i5: string, v6: any,
    suffix: string): typeof ɵɵtextInterpolate7 {
  const lView = getLView();
  const interpolated =
      interpolation7(lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, i5, v6, suffix);
  if (interpolated !== NO_CHANGE) {
    textBindingInternal(lView, getSelectedIndex(), interpolated as string);
  }
  return ɵɵtextInterpolate7;
}

/**
 * Update text content with 8 bound values surrounded by other text.
 *
 * 使用被其他文本包围的 8 个绑定值更新文本内容。
 *
 * Used when a text node has 8 interpolated values in it:
 *
 * 当文本节点中有 8 个插值时使用：
 *
 * ```html
 * <div>prefix{{v0}}-{{v1}}-{{v2}}-{{v3}}-{{v4}}-{{v5}}-{{v6}}-{{v7}}suffix</div>
 * ```
 *
 * Its compiled representation is:
 *
 * 其编译后的表示是：
 *
 * ```ts
 * ɵɵtextInterpolate8(
 *  'prefix', v0, '-', v1, '-', v2, '-', v3, '-', v4, '-', v5, '-', v6, '-', v7, 'suffix');
 * ```
 *
 * @returns
 *
 * itself, so that it may be chained.
 *
 * 本身，以便它可以被链接起来。
 *
 * @see textInterpolateV
 *
 * 文本插值 V
 *
 * @codeGenApi
 */
export function ɵɵtextInterpolate8(
    prefix: string, v0: any, i0: string, v1: any, i1: string, v2: any, i2: string, v3: any,
    i3: string, v4: any, i4: string, v5: any, i5: string, v6: any, i6: string, v7: any,
    suffix: string): typeof ɵɵtextInterpolate8 {
  const lView = getLView();
  const interpolated = interpolation8(
      lView, prefix, v0, i0, v1, i1, v2, i2, v3, i3, v4, i4, v5, i5, v6, i6, v7, suffix);
  if (interpolated !== NO_CHANGE) {
    textBindingInternal(lView, getSelectedIndex(), interpolated as string);
  }
  return ɵɵtextInterpolate8;
}

/**
 * Update text content with 9 or more bound values other surrounded by text.
 *
 * 使用 9 个或更多被文本包围的绑定值更新文本内容。
 *
 * Used when the number of interpolated values exceeds 8.
 *
 * 当内插值的数量超过 8 时使用。
 *
 * ```html
 * <div>prefix{{v0}}-{{v1}}-{{v2}}-{{v3}}-{{v4}}-{{v5}}-{{v6}}-{{v7}}-{{v8}}-{{v9}}suffix</div>
 * ```
 *
 * Its compiled representation is:
 *
 * 其编译后的表示是：
 *
 * ```ts
 * ɵɵtextInterpolateV(
 *  ['prefix', v0, '-', v1, '-', v2, '-', v3, '-', v4, '-', v5, '-', v6, '-', v7, '-', v9,
 *  'suffix']);
 * ```
 *
 * .
 *
 * @param values The collection of values and the strings in between those values, beginning with
 * a string prefix and ending with a string suffix.
 * (e.g. `['prefix', value0, '-', value1, '-', value2, ..., value99, 'suffix']`)
 *
 * 值以及这些值之间的字符串的集合，以字符串前缀开头并以字符串后缀结尾。（例如 `['prefix', value0,
 * '-', value1, '-', value2, ..., value99, 'suffix']`）
 *
 * @returns
 *
 * itself, so that it may be chained.
 *
 * 本身，以便它可以被链接起来。
 *
 * @codeGenApi
 */
export function ɵɵtextInterpolateV(values: any[]): typeof ɵɵtextInterpolateV {
  const lView = getLView();
  const interpolated = interpolationV(lView, values);
  if (interpolated !== NO_CHANGE) {
    textBindingInternal(lView, getSelectedIndex(), interpolated as string);
  }
  return ɵɵtextInterpolateV;
}

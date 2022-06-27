/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * A value produced which originated in a `ForeignFunctionResolver` and doesn't come from the
 * template itself.
 *
 * 生成的值，源于 `ForeignFunctionResolver` ，而不来自模板本身。
 *
 * Synthetic values cannot be further evaluated, and attempts to do so produce `DynamicValue`s
 * instead.
 *
 * 无法进一步估算合成值，并且尝试这样做会生成 `DynamicValue` 。
 *
 */
export class SyntheticValue<T> {
  constructor(readonly value: T) {}
}

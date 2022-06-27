/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Special markers which can be left on `Type.__NG_ELEMENT_ID__` which are used by the Ivy's
 * `NodeInjector`. Usually these markers contain factory functions. But in case of this special
 * marker we can't leave behind a function because it would create tree shaking problem.
 *
 * 可以留在 `Type.__NG_ELEMENT_ID__` 上的特殊标记，供 Ivy 的 `NodeInjector`
 * 使用。通常，这些标记包含工厂函数。但在这种特殊标记的情况下，我们不能留下函数，因为它会创建树抖动问题。
 *
 * Currently only `Injector` is special.
 *
 * 目前只有 `Injector` 是特殊的。
 *
 * NOTE: the numbers here must be negative, because positive numbers are used as IDs for bloom
 * filter.
 *
 * 注意：这里的数字必须是负数，因为正数被用作布隆过滤器的 ID。
 *
 */
export const enum InjectorMarkers {
  /**
   * Marks that the current type is `Injector`
   *
   * 标记当前类型是 `Injector`
   *
   */
  Injector = -1
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Convince closure compiler that the wrapped function has no side-effects.
 *
 * 让闭包编译器相信包装的函数没有副作用。
 *
 * Closure compiler always assumes that `toString` has no side-effects. We use this quirk to
 * allow us to execute a function but have closure compiler mark the call as no-side-effects.
 * It is important that the return value for the `noSideEffects` function be assigned
 * to something which is retained otherwise the call to `noSideEffects` will be removed by closure
 * compiler.
 *
 * 闭包编译器始终假定 `toString`
 * 没有副作用。我们用这个怪癖来允许我们执行一个函数，但让闭包编译器将调用标记为
 * no-side-effects。重要的是将 `noSideEffects` 函数的返回值分配给保留的内容，否则对 `noSideEffects`
 * 的调用将被闭包编译器删除。
 *
 */
export function noSideEffects<T>(fn: () => T): T {
  return {toString: fn}.toString() as unknown as T;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ReactiveNode} from './graph';

/**
 * Symbol used to tell `Signal`s apart from other functions.
 *
 * 用于区分 `Signal` 和其他函数的符号。
 *
 * This can be used to auto-unwrap signals in various cases, or to auto-wrap non-signal values.
 *
 * 这可用于在各种情况下自动展开信号，或自动包裹非信号值。
 *
 */
const SIGNAL = Symbol('SIGNAL');

/**
 * A reactive value which notifies consumers of any changes.
 *
 * 通知消费者任何更改的反应值。
 *
 * Signals are functions which returns their current value. To access the current value of a signal,
 * call it.
 *
 * 信号是返回其当前值的函数。 要访问信号的当前值，请调用它。
 *
 * Ordinary values can be turned into `Signal`s with the `signal` function.
 *
 * 可以使用 `signal` 函数将普通值转换为 `Signal` 。
 *
 * @developerPreview
 */
export type Signal<T> = (() => T)&{
  [SIGNAL]: unknown;
};

/**
 * Checks if the given `value` is a reactive `Signal`.
 *
 * 检查给定 `value` 是否为反应 `Signal` 。
 *
 * @developerPreview
 */
export function isSignal(value: unknown): value is Signal<unknown> {
  return typeof value === 'function' && (value as Signal<unknown>)[SIGNAL] !== undefined;
}

/**
 * Converts `fn` into a marked signal function \(where `isSignal(fn)` will be `true`\).
 *
 * 将 `fn` 转换为标记信号函数（其中 `isSignal(fn)` 将为 `true` ）。
 *
 * @param fn A zero-argument function which will be converted into a `Signal`.
 *
 * 将转换为 `Signal` 零参数函数。
 *
 */
export function createSignalFromFunction<T>(node: ReactiveNode, fn: () => T): Signal<T>;

/**
 * Converts `fn` into a marked signal function \(where `isSignal(fn)` will be `true`\), and
 * potentially add some set of extra properties \(passed as an object record `extraApi`\).
 *
 * 将 `fn` 转换为标记信号函数（其中 `isSignal(fn)` 将为 `true` ），并可能添加一些额外属性集（作为对象记录 `extraApi` 传递）。
 *
 * @param fn A zero-argument function which will be converted into a `Signal`.
 *
 * 将转换为 `Signal` 零参数函数。
 *
 * @param extraApi An object whose properties will be copied onto `fn` in order to create a specific
 *     desired interface for the `Signal`.
 *
 * 一个对象，其属性将被复制到 `fn` 上，以便为 `Signal` 创建一个特定的所需接口。
 *
 */
export function createSignalFromFunction<T, U extends Record<string, unknown>>(
    node: ReactiveNode, fn: () => T, extraApi: U): Signal<T>&U;

/**
 * Converts `fn` into a marked signal function \(where `isSignal(fn)` will be `true`\), and
 * potentially add some set of extra properties \(passed as an object record `extraApi`\).
 *
 * 将 `fn` 转换为标记信号函数（其中 `isSignal(fn)` 将为 `true` ），并可能添加一些额外属性集（作为对象记录 `extraApi` 传递）。
 *
 */
export function createSignalFromFunction<T, U extends Record<string, unknown> = {}>(
    node: ReactiveNode, fn: () => T, extraApi: U = ({} as U)): Signal<T>&U {
  (fn as any)[SIGNAL] = node;
  // Copy properties from `extraApi` to `fn` to complete the desired API of the `Signal`.
  return Object.assign(fn, extraApi) as (Signal<T>& U);
}

/**
 * A comparison function which can determine if two values are equal.
 *
 * 可以确定两个值是否相等的比较函数。
 *
 * @developerPreview
 */
export type ValueEqualityFn<T> = (a: T, b: T) => boolean;

/**
 * The default equality function used for `signal` and `computed`, which treats objects and arrays
 * as never equal, and all other primitive values using identity semantics.
 *
 * 用于 `signal` 和 `computed` 的默认相等函数，它将对象和数组视为永远不相等，所有其他原始值使用身份语义。
 *
 * This allows signals to hold non-primitive values \(arrays, objects, other collections\) and still
 * propagate change notification upon explicit mutation without identity change.
 *
 * 这允许信号保存非原始值（数组、对象、其他集合），并且在没有标识更改的情况下在显式突变时仍然传播更改通知。
 *
 * @developerPreview
 */
export function defaultEquals<T>(a: T, b: T) {
  // `Object.is` compares two values using identity semantics which is desired behavior for
  // primitive values. If `Object.is` determines two values to be equal we need to make sure that
  // those don't represent objects (we want to make sure that 2 objects are always considered
  // "unequal"). The null check is needed for the special case of JavaScript reporting null values
  // as objects (`typeof null === 'object'`).
  return (a === null || typeof a !== 'object') && Object.is(a, b);
}

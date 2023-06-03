/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {assertInInjectionContext, computed, DestroyRef, inject, Injector, signal, Signal, WritableSignal} from '@angular/core';
import {Observable} from 'rxjs';

import {RuntimeError, RuntimeErrorCode} from '../../src/errors';
import {untracked} from '../../src/signals';

/**
 * Options for `toSignal`.
 *
 * `toSignal` 的选项。
 *
 * @publicApi
 */
export interface ToSignalOptions<T> {
  /**
   * Initial value for the signal produced by `toSignal`.
   *
   * `toSignal` 产生的信号的初始值。
   *
   * This will be the value of the signal until the observable emits its first value.
   *
   * 这将是信号的值，直到 observable 发出它的第一个值。
   *
   */
  initialValue?: T;

  /**
   * Whether to require that the observable emits synchronously when `toSignal` subscribes.
   *
   * 是否要求可观察对象在订阅 `toSignal` 时同步发出。
   *
   * If this is `true`, `toSignal` will assert that the observable produces a value immediately upon
   * subscription. Setting this option removes the need to either deal with `undefined` in the
   * signal type or provide an `initialValue`, at the cost of a runtime error if this requirement is
   * not met.
   *
   * 如果这是 `true` ， `toSignal` 将断言可观察对象在订阅后立即产生一个值。 设置此选项可以消除处理信号类型中 `undefined` 或提供 `initialValue` 的需要，如果不满足此要求，则会出现运行时错误。
   *
   */
  requireSync?: boolean;

  /**
   * `Injector` which will provide the `DestroyRef` used to clean up the Observable subscription.
   *
   * `Injector` 将提供用于清理 Observable 订阅的 `DestroyRef` 。
   *
   * If this is not provided, a `DestroyRef` will be retrieved from the current injection context,
   * unless manual cleanup is requested.
   *
   * 如果未提供，则将从当前注入上下文中检索 `DestroyRef` ，除非请求手动清理。
   *
   */
  injector?: Injector;

  /**
   * Whether the subscription should be automatically cleaned up \(via `DestroyRef`\) when
   * `toObservable`'s creation context is destroyed.
   *
   * 当 `toObservable` 的创建上下文被销毁时，是否应该自动清理订阅（通过 `DestroyRef` ）。
   *
   * If manual cleanup is enabled, then `DestroyRef` is not used, and the subscription will persist
   * until the `Observable` itself completes.
   *
   * 如果启用手动清理，则不使用 `DestroyRef` ，并且订阅将持续到 `Observable` 本身完成。
   *
   */
  manualCleanup?: boolean;
}

/**
 * Get the current value of an `Observable` as a reactive `Signal`.
 *
 * 获取 `Observable` 的当前值作为反应 `Signal` 。
 *
 * `toSignal` returns a `Signal` which provides synchronous reactive access to values produced
 * by the given `Observable`, by subscribing to that `Observable`. The returned `Signal` will always
 * have the most recent value emitted by the subscription, and will throw an error if the
 * `Observable` errors.
 *
 * `toSignal` 返回一个 `Signal` ，它通过订阅给定的 `Observable` 来提供对给定 `Observable` 产生的值的同步反应访问。 返回的 `Signal` 将始终具有订阅发出的最新值，如果 `Observable` 出错，则会抛出错误。
 *
 * Before the `Observable` emits its first value, the `Signal` will return `undefined`. To avoid
 * this, either an `initialValue` can be passed or the `requireSync` option enabled.
 *
 * 在 `Observable` 发出它的第一个值之前， `Signal` 将返回 `undefined` 。 为避免这种情况，可以传递 `initialValue` 或启用 `requireSync` 选项。
 *
 * By default, the subscription will be automatically cleaned up when the current injection context
 * is destroyed. For example, when `toObservable` is called during the construction of a component,
 * the subscription will be cleaned up when the component is destroyed. If an injection context is
 * not available, an explicit `Injector` can be passed instead.
 *
 * 默认情况下，订阅会在当前注入上下文被销毁时自动清理。 例如，在组件构建过程中调用 `toObservable` 时，订阅将在组件销毁时被清除。 如果注入上下文不可用，则可以传递显式 `Injector` 。
 *
 * If the subscription should persist until the `Observable` itself completes, the `manualCleanup`
 * option can be specified instead, which disables the automatic subscription teardown. No injection
 * context is needed in this configuration as well.
 *
 * 如果订阅应该持续到 `Observable` 本身完成，则可以指定 `manualCleanup` 选项，这会禁用自动订阅拆卸。 此配置中也不需要注入上下文。
 *
 */
export function toSignal<T>(source: Observable<T>): Signal<T|undefined>;

/**
 * Get the current value of an `Observable` as a reactive `Signal`.
 *
 * 获取 `Observable` 的当前值作为反应 `Signal` 。
 *
 * `toSignal` returns a `Signal` which provides synchronous reactive access to values produced
 * by the given `Observable`, by subscribing to that `Observable`. The returned `Signal` will always
 * have the most recent value emitted by the subscription, and will throw an error if the
 * `Observable` errors.
 *
 * `toSignal` 返回一个 `Signal` ，它通过订阅给定的 `Observable` 来提供对给定 `Observable` 产生的值的同步反应访问。 返回的 `Signal` 将始终具有订阅发出的最新值，如果 `Observable` 出错，则会抛出错误。
 *
 * Before the `Observable` emits its first value, the `Signal` will return the configured
 * `initialValue`, or `undefined` if no `initialValue` is provided. If the `Observable` is
 * guaranteed to emit synchronously, then the `requireSync` option can be passed instead.
 *
 * 在 `Observable` 发出它的第一个值之前， `Signal` 将返回配置的 `initialValue` ，如果没有提供 `initialValue` 则 `undefined` 。 如果 `Observable` 保证同步发出，则可以传递 `requireSync` 选项。
 *
 * By default, the subscription will be automatically cleaned up when the current injection context
 * is destroyed. For example, when `toObservable` is called during the construction of a component,
 * the subscription will be cleaned up when the component is destroyed. If an injection context is
 * not available, an explicit `Injector` can be passed instead.
 *
 * 默认情况下，订阅会在当前注入上下文被销毁时自动清理。 例如，在组件构建过程中调用 `toObservable` 时，订阅将在组件销毁时被清除。 如果注入上下文不可用，则可以传递显式 `Injector` 。
 *
 * If the subscription should persist until the `Observable` itself completes, the `manualCleanup`
 * option can be specified instead, which disables the automatic subscription teardown. No injection
 * context is needed in this configuration as well.
 *
 * 如果订阅应该持续到 `Observable` 本身完成，则可以指定 `manualCleanup` 选项，这会禁用自动订阅拆卸。 此配置中也不需要注入上下文。
 *
 * @developerPreview
 */
export function toSignal<T>(
    source: Observable<T>,
    options?: ToSignalOptions<undefined>&{requireSync?: false}): Signal<T|undefined>;


/**
 * Get the current value of an `Observable` as a reactive `Signal`.
 *
 * 获取 `Observable` 的当前值作为反应 `Signal` 。
 *
 * `toSignal` returns a `Signal` which provides synchronous reactive access to values produced
 * by the given `Observable`, by subscribing to that `Observable`. The returned `Signal` will always
 * have the most recent value emitted by the subscription, and will throw an error if the
 * `Observable` errors.
 *
 * `toSignal` 返回一个 `Signal` ，它通过订阅给定的 `Observable` 来提供对给定 `Observable` 产生的值的同步反应访问。 返回的 `Signal` 将始终具有订阅发出的最新值，如果 `Observable` 出错，则会抛出错误。
 *
 * Before the `Observable` emits its first value, the `Signal` will return the configured
 * `initialValue`. If the `Observable` is guaranteed to emit synchronously, then the `requireSync`
 * option can be passed instead.
 *
 * 在 `Observable` 发出它的第一个值之前， `Signal` 将返回配置的 `initialValue` 。 如果 `Observable` 保证同步发出，则可以传递 `requireSync` 选项。
 *
 * By default, the subscription will be automatically cleaned up when the current injection context
 * is destroyed. For example, when `toObservable` is called during the construction of a component,
 * the subscription will be cleaned up when the component is destroyed. If an injection context is
 * not available, an explicit `Injector` can be passed instead.
 *
 * 默认情况下，订阅会在当前注入上下文被销毁时自动清理。 例如，在组件构建过程中调用 `toObservable` 时，订阅将在组件销毁时被清除。 如果注入上下文不可用，则可以传递显式 `Injector` 。
 *
 * If the subscription should persist until the `Observable` itself completes, the `manualCleanup`
 * option can be specified instead, which disables the automatic subscription teardown. No injection
 * context is needed in this configuration as well.
 *
 * 如果订阅应该持续到 `Observable` 本身完成，则可以指定 `manualCleanup` 选项，这会禁用自动订阅拆卸。 此配置中也不需要注入上下文。
 *
 * @developerPreview
 */
export function toSignal<T, U extends T|null|undefined>(
    source: Observable<T>,
    options: ToSignalOptions<U>&{initialValue: U, requireSync?: false}): Signal<T|U>;

/**
 * Get the current value of an `Observable` as a reactive `Signal`.
 *
 * 获取 `Observable` 的当前值作为反应 `Signal` 。
 *
 * `toSignal` returns a `Signal` which provides synchronous reactive access to values produced
 * by the given `Observable`, by subscribing to that `Observable`. The returned `Signal` will always
 * have the most recent value emitted by the subscription, and will throw an error if the
 * `Observable` errors.
 *
 * `toSignal` 返回一个 `Signal` ，它通过订阅给定的 `Observable` 来提供对给定 `Observable` 产生的值的同步反应访问。 返回的 `Signal` 将始终具有订阅发出的最新值，如果 `Observable` 出错，则会抛出错误。
 *
 * With `requireSync` set to `true`, `toSignal` will assert that the `Observable` produces a value
 * immediately upon subscription. No `initialValue` is needed in this case, and the returned signal
 * does not include an `undefined` type.
 *
 * 当 `requireSync` 设置为 `true` 时， `toSignal` 将断言 `Observable` 在订阅后立即产生一个值。 在这种情况下不需要 `initialValue` ，并且返回的信号不包含 `undefined` 类型。
 *
 * By default, the subscription will be automatically cleaned up when the current injection context
 * is destroyed. For example, when `toObservable` is called during the construction of a component,
 * the subscription will be cleaned up when the component is destroyed. If an injection context is
 * not available, an explicit `Injector` can be passed instead.
 *
 * 默认情况下，订阅会在当前注入上下文被销毁时自动清理。 例如，在组件构建过程中调用 `toObservable` 时，订阅将在组件销毁时被清除。 如果注入上下文不可用，则可以传递显式 `Injector` 。
 *
 * If the subscription should persist until the `Observable` itself completes, the `manualCleanup`
 * option can be specified instead, which disables the automatic subscription teardown. No injection
 * context is needed in this configuration as well.
 *
 * 如果订阅应该持续到 `Observable` 本身完成，则可以指定 `manualCleanup` 选项，这会禁用自动订阅拆卸。 此配置中也不需要注入上下文。
 *
 * @developerPreview
 */
export function toSignal<T>(
    source: Observable<T>, options: ToSignalOptions<undefined>&{requireSync: true}): Signal<T>;
export function toSignal<T, U = undefined>(
    source: Observable<T>, options?: ToSignalOptions<U>): Signal<T|U> {
  const requiresCleanup = !options?.manualCleanup;
  requiresCleanup && !options?.injector && assertInInjectionContext(toSignal);
  const cleanupRef =
      requiresCleanup ? options?.injector?.get(DestroyRef) ?? inject(DestroyRef) : null;

  // Note: T is the Observable value type, and U is the initial value type. They don't have to be
  // the same - the returned signal gives values of type `T`.
  let state: WritableSignal<State<T|U>>;
  if (options?.requireSync) {
    // Initially the signal is in a `NoValue` state.
    state = signal({kind: StateKind.NoValue});
  } else {
    // If an initial value was passed, use it. Otherwise, use `undefined` as the initial value.
    state = signal<State<T|U>>({kind: StateKind.Value, value: options?.initialValue as U});
  }

  const sub = source.subscribe({
    next: value => state.set({kind: StateKind.Value, value}),
    error: error => state.set({kind: StateKind.Error, error}),
    // Completion of the Observable is meaningless to the signal. Signals don't have a concept of
    // "complete".
  });

  if (ngDevMode && options?.requireSync && untracked(state).kind === StateKind.NoValue) {
    throw new RuntimeError(
        RuntimeErrorCode.REQUIRE_SYNC_WITHOUT_SYNC_EMIT,
        '`toSignal()` called with `requireSync` but `Observable` did not emit synchronously.');
  }

  // Unsubscribe when the current context is destroyed, if requested.
  cleanupRef?.onDestroy(sub.unsubscribe.bind(sub));

  // The actual returned signal is a `computed` of the `State` signal, which maps the various states
  // to either values or errors.
  return computed(() => {
    const current = state();
    switch (current.kind) {
      case StateKind.Value:
        return current.value;
      case StateKind.Error:
        throw current.error;
      case StateKind.NoValue:
        // This shouldn't really happen because the error is thrown on creation.
        // TODO(alxhub): use a RuntimeError when we finalize the error semantics
        throw new RuntimeError(
            RuntimeErrorCode.REQUIRE_SYNC_WITHOUT_SYNC_EMIT,
            '`toSignal()` called with `requireSync` but `Observable` did not emit synchronously.');
    }
  });
}

const enum StateKind {
  NoValue,
  Value,
  Error,
}

interface NoValueState {
  kind: StateKind.NoValue;
}

interface ValueState<T> {
  kind: StateKind.Value;
  value: T;
}

interface ErrorState {
  kind: StateKind.Error;
  error: unknown;
}

type State<T> = NoValueState|ValueState<T>|ErrorState;

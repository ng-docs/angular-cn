/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {createSignalFromFunction, defaultEquals, Signal, ValueEqualityFn} from './api';
import {ReactiveNode, setActiveConsumer} from './graph';

/**
 * Options passed to the `computed` creation function.
 *
 * 传递给 `computed` 创建函数的选项。
 *
 * @developerPreview
 */
export interface CreateComputedOptions<T> {
  /**
   * A comparison function which defines equality for computed values.
   *
   * 定义计算值相等性的比较函数。
   *
   */
  equal?: ValueEqualityFn<T>;
}


/**
 * Create a computed `Signal` which derives a reactive value from an expression.
 *
 * 创建一个计算 `Signal`，它从表达式中导出反应值。
 *
 * @developerPreview
 */
export function computed<T>(computation: () => T, options?: CreateComputedOptions<T>): Signal<T> {
  const node = new ComputedImpl(computation, options?.equal ?? defaultEquals);

  // Casting here is required for g3, as TS inference behavior is slightly different between our
  // version/options and g3's.
  return createSignalFromFunction(node, node.signal.bind(node)) as unknown as Signal<T>;
}

/**
 * A dedicated symbol used before a computed value has been calculated for the first time.
 * Explicitly typed as `any` so we can use it as signal's value.
 *
 * 在第一次计算计算值之前使用的专用符号。显式键入 `any` 以便我们可以将其用作信号的值。
 *
 */
const UNSET: any = Symbol('UNSET');

/**
 * A dedicated symbol used in place of a computed signal value to indicate that a given computation
 * is in progress. Used to detect cycles in computation chains.
 * Explicitly typed as `any` so we can use it as signal's value.
 *
 * 用于代替计算信号值的专用符号，用于指示给定计算正在进行中。用于检测计算链中的循环。显式键入 `any` 以便我们可以将其用作信号的值。
 *
 */
const COMPUTING: any = Symbol('COMPUTING');

/**
 * A dedicated symbol used in place of a computed signal value to indicate that a given computation
 * failed. The thrown error is cached until the computation gets dirty again.
 * Explicitly typed as `any` so we can use it as signal's value.
 *
 * 用于代替计算信号值的专用符号，用于指示给定计算失败。抛出的错误会被缓存，直到计算再次变脏。显式键入 `any` 以便我们可以将其用作信号的值。
 *
 */
const ERRORED: any = Symbol('ERRORED');

/**
 * A computation, which derives a value from a declarative reactive expression.
 *
 * 一种计算，它从声明性反应表达式中派生出一个值。
 *
 * `Computed`s are both producers and consumers of reactivity.
 *
 * `Computed` s 既是反应性的生产者又是消费者。
 *
 */
class ComputedImpl<T> extends ReactiveNode {
  constructor(private computation: () => T, private equal: (oldValue: T, newValue: T) => boolean) {
    super();
  }
  /**
   * Current value of the computation.
   *
   * This can also be one of the special values `UNSET`, `COMPUTING`, or `ERRORED`.
   */
  private value: T = UNSET;

  /**
   * If `value` is `ERRORED`, the error caught from the last computation attempt which will
   * be re-thrown.
   */
  private error: unknown = null;

  /**
   * Flag indicating that the computation is currently stale, meaning that one of the
   * dependencies has notified of a potential change.
   *
   * It's possible that no dependency has _actually_ changed, in which case the `stale`
   * state can be resolved without recomputing the value.
   */
  private stale = true;

  protected override readonly consumerAllowSignalWrites = false;

  protected override onConsumerDependencyMayHaveChanged(): void {
    if (this.stale) {
      // We've already notified consumers that this value has potentially changed.
      return;
    }

    // Record that the currently cached value may be stale.
    this.stale = true;

    // Notify any consumers about the potential change.
    this.producerMayHaveChanged();
  }

  protected override onProducerUpdateValueVersion(): void {
    if (!this.stale) {
      // The current value and its version are already up to date.
      return;
    }

    // The current value is stale. Check whether we need to produce a new one.

    if (this.value !== UNSET && this.value !== COMPUTING &&
        !this.consumerPollProducersForChange()) {
      // Even though we were previously notified of a potential dependency update, all of
      // our dependencies report that they have not actually changed in value, so we can
      // resolve the stale state without needing to recompute the current value.
      this.stale = false;
      return;
    }

    // The current value is stale, and needs to be recomputed. It still may not change -
    // that depends on whether the newly computed value is equal to the old.
    this.recomputeValue();
  }

  private recomputeValue(): void {
    if (this.value === COMPUTING) {
      // Our computation somehow led to a cyclic read of itself.
      throw new Error('Detected cycle in computations.');
    }

    const oldValue = this.value;
    this.value = COMPUTING;

    // As we're re-running the computation, update our dependent tracking version number.
    this.trackingVersion++;
    const prevConsumer = setActiveConsumer(this);
    let newValue: T;
    try {
      newValue = this.computation();
    } catch (err) {
      newValue = ERRORED;
      this.error = err;
    } finally {
      setActiveConsumer(prevConsumer);
    }

    this.stale = false;

    if (oldValue !== UNSET && oldValue !== ERRORED && newValue !== ERRORED &&
        this.equal(oldValue, newValue)) {
      // No change to `valueVersion` - old and new values are
      // semantically equivalent.
      this.value = oldValue;
      return;
    }

    this.value = newValue;
    this.valueVersion++;
  }

  signal(): T {
    // Check if the value needs updating before returning it.
    this.onProducerUpdateValueVersion();

    // Record that someone looked at this signal.
    this.producerAccessed();

    if (this.value === ERRORED) {
      throw this.error;
    }

    return this.value;
  }
}

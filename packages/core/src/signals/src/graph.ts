/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

// Required as the signals library is in a separate package, so we need to explicitly ensure the
// global `ngDevMode` type is defined.
import '../../util/ng_dev_mode';

import {newWeakRef, WeakRef} from './weak_ref';

/**
 * Counter tracking the next `ProducerId` or `ConsumerId`.
 *
 * 计数器跟踪下一个 `ProducerId` 或 `ConsumerId` 。
 *
 */
let _nextReactiveId: number = 0;

/**
 * Tracks the currently active reactive consumer \(or `null` if there is no active
 * consumer\).
 *
 * 跟踪当前活跃的反应式消费者（如果没有活跃的消费者，则为 `null` ）。
 *
 */
let activeConsumer: ReactiveNode|null = null;

/**
 * Whether the graph is currently propagating change notifications.
 *
 * 该图当前是否正在传播更改通知。
 *
 */
let inNotificationPhase = false;

export function setActiveConsumer(consumer: ReactiveNode|null): ReactiveNode|null {
  const prev = activeConsumer;
  activeConsumer = consumer;
  return prev;
}

/**
 * A bidirectional edge in the dependency graph of `ReactiveNode`s.
 *
 * `ReactiveNode` 的依赖图中的双向边。
 *
 */
interface ReactiveEdge {
  /**
   * Weakly held reference to the consumer side of this edge.
   *
   * 弱引用此边缘的消费者方面。
   *
   */
  readonly producerNode: WeakRef<ReactiveNode>;

  /**
   * Weakly held reference to the producer side of this edge.
   *
   * 对该边缘的生产者方面的引用很弱。
   *
   */
  readonly consumerNode: WeakRef<ReactiveNode>;
  /**
   * `trackingVersion` of the consumer at which this dependency edge was last observed.
   *
   * `trackingVersion` 最后一次观察到此依赖边缘的消费者。
   *
   * If this doesn't match the consumer's current `trackingVersion`, then this dependency record
   * is stale, and needs to be cleaned up.
   *
   * 如果这与消费者当前的 `trackingVersion` 不匹配，那么这个依赖记录是陈旧的，需要清理。
   *
   */
  atTrackingVersion: number;

  /**
   * `valueVersion` of the producer at the time this dependency was last accessed.
   *
   * 上次访问此依赖项时生产者的 `valueVersion` 。
   *
   */
  seenValueVersion: number;
}

/**
 * A node in the reactive graph.
 *
 * 反应图中的一个节点。
 *
 * Nodes can be producers of reactive values, consumers of other reactive values, or both.
 *
 * 节点可以是反应值的生产者，其他反应值的消费者，或两者兼而有之。
 *
 * Producers are nodes that produce values, and can be depended upon by consumer nodes.
 *
 * 生产者是产生价值的节点，可以被消费者节点所依赖。
 *
 * Producers expose a monotonic `valueVersion` counter, and are responsible for incrementing this
 * version when their value semantically changes. Some producers may produce their values lazily and
 * thus at times need to be polled for potential updates to their value \(and by extension their
 * `valueVersion`\). This is accomplished via the `onProducerUpdateValueVersion` method for
 * implemented by producers, which should perform whatever calculations are necessary to ensure
 * `valueVersion` is up to date.
 *
 * 生产者公开一个单调的 `valueVersion` 计数器，并负责在其值语义发生变化时增加此版本。 一些生产者可能会懒惰地产生他们的价值，因此有时需要轮询他们的价值的潜在更新（以及他们的 `valueVersion` ）。 这是通过生产者实现的 `onProducerUpdateValueVersion` 方法完成的，生产者应该执行任何必要的计算以确保 `valueVersion` 是最新的。
 *
 * Consumers are nodes that depend on the values of producers and are notified when those values
 * might have changed.
 *
 * 消费者是依赖于生产者值的节点，并在这些值可能发生变化时收到通知。
 *
 * Consumers do not wrap the reads they consume themselves, but rather can be set as the active
 * reader via `setActiveConsumer`. Reads of producers that happen while a consumer is active will
 * result in those producers being added as dependencies of that consumer node.
 *
 * 消费者不会包装他们自己消费的读取，而是可以通过 `setActiveConsumer` 将其设置为活动读取器。 在消费者处于活动状态时发生的生产者读取将导致这些生产者被添加为该消费者节点的依赖项。
 *
 * The set of dependencies of a consumer is dynamic. Implementers expose a monotonically increasing
 * `trackingVersion` counter, which increments whenever the consumer is about to re-run any reactive
 * reads it needs and establish a new set of dependencies as a result.
 *
 * 消费者的依赖集是动态的。 实现者公开了一个单调递增的 `trackingVersion` 计数器，每当消费者要重新运行它需要的任何反应式读取并因此建立一组新的依赖关系时，它就会递增。
 *
 * Producers store the last `trackingVersion` they've seen from `Consumer`s which have read them.
 * This allows a producer to identify whether its record of the dependency is current or stale, by
 * comparing the consumer's `trackingVersion` to the version at which the dependency was
 * last observed.
 *
 * 生产者存储他们从读过它们的 `Consumer` 那里看到的最后一个 `trackingVersion` 。 这允许生产者通过将消费者的 `trackingVersion` 与上次观察到的依赖项的版本进行比较来识别其依赖项记录是最新的还是过时的。
 *
 */
export abstract class ReactiveNode {
  private readonly id = _nextReactiveId++;

  /**
   * A cached weak reference to this node, which will be used in `ReactiveEdge`s.
   */
  private readonly ref = newWeakRef(this);

  /**
   * Edges to producers on which this node depends (in its consumer capacity).
   */
  private readonly producers = new Map<number, ReactiveEdge>();

  /**
   * Edges to consumers on which this node depends (in its producer capacity).
   */
  private readonly consumers = new Map<number, ReactiveEdge>();

  /**
   * Monotonically increasing counter representing a version of this `Consumer`'s
   * dependencies.
   *
   * 表示此 `Consumer` 依赖项版本的单调递增计数器。
   *
   */
  protected trackingVersion = 0;

  /**
   * Monotonically increasing counter which increases when the value of this `Producer`
   * semantically changes.
   *
   * 单调递增计数器，当此 `Producer` 的值在语义上发生变化时它会增加。
   *
   */
  protected valueVersion = 0;

  /**
   * Whether signal writes should be allowed while this `ReactiveNode` is the current consumer.
   *
   * 当此 `ReactiveNode` 是当前消费者时是否应允许信号写入。
   *
   */
  protected abstract readonly consumerAllowSignalWrites: boolean;

  /**
   * Called for consumers whenever one of their dependencies notifies that it might have a new
   * value.
   *
   * 每当他们的依赖项之一通知它可能具有新值时调用消费者。
   *
   */
  protected abstract onConsumerDependencyMayHaveChanged(): void;

  /**
   * Called for producers when a dependent consumer is checking if the producer's value has actually
   * changed.
   *
   * 当依赖消费者正在检查生产者的价值是否实际发生变化时调用生产者。
   *
   */
  protected abstract onProducerUpdateValueVersion(): void;

  /**
   * Polls dependencies of a consumer to determine if they have actually changed.
   *
   * 轮询消费者的依赖关系以确定它们是否真的发生了变化。
   *
   * If this returns `false`, then even though the consumer may have previously been notified of a
   * change, the values of its dependencies have not actually changed and the consumer should not
   * rerun any reactions.
   *
   * 如果这返回 `false` ，那么即使消费者之前可能已收到更改通知，其依赖项的值实际上并未更改，并且消费者不应重新运行任何反应。
   *
   */
  protected consumerPollProducersForChange(): boolean {
    for (const [producerId, edge] of this.producers) {
      const producer = edge.producerNode.deref();

      if (producer === undefined || edge.atTrackingVersion !== this.trackingVersion) {
        // This dependency edge is stale, so remove it.
        this.producers.delete(producerId);
        producer?.consumers.delete(this.id);
        continue;
      }

      if (producer.producerPollStatus(edge.seenValueVersion)) {
        // One of the dependencies reports a real value change.
        return true;
      }
    }

    // No dependency reported a real value change, so the `Consumer` has also not been
    // impacted.
    return false;
  }

  /**
   * Notify all consumers of this producer that its value may have changed.
   *
   * 通知该生产者的所有消费者它的值可能已经改变。
   *
   */
  protected producerMayHaveChanged(): void {
    // Prevent signal reads when we're updating the graph
    const prev = inNotificationPhase;
    inNotificationPhase = true;
    try {
      for (const [consumerId, edge] of this.consumers) {
        const consumer = edge.consumerNode.deref();
        if (consumer === undefined || consumer.trackingVersion !== edge.atTrackingVersion) {
          this.consumers.delete(consumerId);
          consumer?.producers.delete(this.id);
          continue;
        }

        consumer.onConsumerDependencyMayHaveChanged();
      }
    } finally {
      inNotificationPhase = prev;
    }
  }

  /**
   * Mark that this producer node has been accessed in the current reactive context.
   *
   * 标记此生产者节点已在当前反应式上下文中被访问。
   *
   */
  protected producerAccessed(): void {
    if (inNotificationPhase) {
      throw new Error(
          typeof ngDevMode !== 'undefined' && ngDevMode ?
              `Assertion error: signal read during notification phase` :
              '');
    }

    if (activeConsumer === null) {
      return;
    }

    // Either create or update the dependency `Edge` in both directions.
    let edge = activeConsumer.producers.get(this.id);
    if (edge === undefined) {
      edge = {
        consumerNode: activeConsumer.ref,
        producerNode: this.ref,
        seenValueVersion: this.valueVersion,
        atTrackingVersion: activeConsumer.trackingVersion,
      };
      activeConsumer.producers.set(this.id, edge);
      this.consumers.set(activeConsumer.id, edge);
    } else {
      edge.seenValueVersion = this.valueVersion;
      edge.atTrackingVersion = activeConsumer.trackingVersion;
    }
  }

  /**
   * Whether this consumer currently has any producers registered.
   *
   * 该消费者当前是否注册了任何生产者。
   *
   */
  protected get hasProducers(): boolean {
    return this.producers.size > 0;
  }

  /**
   * Whether this `ReactiveNode` in its producer capacity is currently allowed to initiate updates,
   * based on the current consumer context.
   *
   * 基于当前的消费者上下文，当前是否允许此 `ReactiveNode` 在其生产者能力中启动更新。
   *
   */
  protected get producerUpdatesAllowed(): boolean {
    return activeConsumer?.consumerAllowSignalWrites !== false;
  }

  /**
   * Checks if a `Producer` has a current value which is different than the value
   * last seen at a specific version by a `Consumer` which recorded a dependency on
   * this `Producer`.
   */
  private producerPollStatus(lastSeenValueVersion: number): boolean {
    // `producer.valueVersion` may be stale, but a mismatch still means that the value
    // last seen by the `Consumer` is also stale.
    if (this.valueVersion !== lastSeenValueVersion) {
      return true;
    }

    // Trigger the `Producer` to update its `valueVersion` if necessary.
    this.onProducerUpdateValueVersion();

    // At this point, we can trust `producer.valueVersion`.
    return this.valueVersion !== lastSeenValueVersion;
  }
}

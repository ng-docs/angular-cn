Counter tracking the next `ProducerId` or `ConsumerId`.

计数器跟踪下一个 `ProducerId` 或 `ConsumerId`。

Tracks the currently active reactive consumer \(or `null` if there is no active
consumer\).

跟踪当前活跃的反应式消费者（如果没有活跃的消费者，则为 `null` ）。

Whether the graph is currently propagating change notifications.

该图当前是否正在传播更改通知。

A bidirectional edge in the dependency graph of `ReactiveNode`s.

`ReactiveNode` 的依赖图中的双向边。

Weakly held reference to the consumer side of this edge.

弱引用此边缘的消费者方面。

Weakly held reference to the producer side of this edge.

对该边缘的生产者方面的引用很弱。

`trackingVersion` of the consumer at which this dependency edge was last observed.

`trackingVersion` 最后一次观察到此依赖边缘的消费者。

If this doesn't match the consumer's current `trackingVersion`, then this dependency record
is stale, and needs to be cleaned up.

如果这与消费者当前的 `trackingVersion` 不匹配，那么这个依赖记录是陈旧的，需要清理。

`valueVersion` of the producer at the time this dependency was last accessed.

上次访问此依赖项时生产者的 `valueVersion`。

A node in the reactive graph.

反应图中的一个节点。

Nodes can be producers of reactive values, consumers of other reactive values, or both.

节点可以是反应值的生产者，其他反应值的消费者，或两者兼而有之。

Producers are nodes that produce values, and can be depended upon by consumer nodes.

生产者是产生价值的节点，可以被消费者节点所依赖。

Producers expose a monotonic `valueVersion` counter, and are responsible for incrementing this
version when their value semantically changes. Some producers may produce their values lazily and
thus at times need to be polled for potential updates to their value \(and by extension their
`valueVersion`\). This is accomplished via the `onProducerUpdateValueVersion` method for
implemented by producers, which should perform whatever calculations are necessary to ensure
`valueVersion` is up to date.

生产者公开一个单调的 `valueVersion` 计数器，并负责在其值语义发生变化时增加此版本。一些生产者可能会懒惰地产生他们的价值，因此有时需要轮询他们的价值的潜在更新（以及他们的 `valueVersion` ）。这是通过生产者实现的 `onProducerUpdateValueVersion` 方法完成的，生产者应该执行任何必要的计算以确保 `valueVersion` 是最新的。

Consumers are nodes that depend on the values of producers and are notified when those values
might have changed.

消费者是依赖于生产者值的节点，并在这些值可能发生变化时收到通知。

Consumers do not wrap the reads they consume themselves, but rather can be set as the active
reader via `setActiveConsumer`. Reads of producers that happen while a consumer is active will
result in those producers being added as dependencies of that consumer node.

消费者不会包装他们自己消费的读取，而是可以通过 `setActiveConsumer` 将其设置为活动读取器。在消费者处于活动状态时发生的生产者读取将导致这些生产者被添加为该消费者节点的依赖项。

The set of dependencies of a consumer is dynamic. Implementers expose a monotonically increasing
`trackingVersion` counter, which increments whenever the consumer is about to re-run any reactive
reads it needs and establish a new set of dependencies as a result.

消费者的依赖集是动态的。实现者公开了一个单调递增的 `trackingVersion` 计数器，每当消费者要重新运行它需要的任何反应式读取并因此建立一组新的依赖关系时，它就会递增。

Producers store the last `trackingVersion` they've seen from `Consumer`s which have read them.
This allows a producer to identify whether its record of the dependency is current or stale, by
comparing the consumer's `trackingVersion` to the version at which the dependency was
last observed.

生产者存储他们从读过它们的 `Consumer` 那里看到的最后一个 `trackingVersion`。这允许生产者通过将消费者的 `trackingVersion` 与上次观察到的依赖项的版本进行比较来识别其依赖项记录是最新的还是过时的。

Monotonically increasing counter representing a version of this `Consumer`'s
dependencies.

表示此 `Consumer` 依赖项版本的单调递增计数器。

Monotonically increasing counter which increases when the value of this `Producer`
semantically changes.

单调递增计数器，当此 `Producer` 的值在语义上发生变化时它会增加。

Whether signal writes should be allowed while this `ReactiveNode` is the current consumer.

当此 `ReactiveNode` 是当前消费者时是否应允许信号写入。

Called for consumers whenever one of their dependencies notifies that it might have a new
value.

每当他们的依赖项之一通知它可能具有新值时调用消费者。

Called for producers when a dependent consumer is checking if the producer's value has actually
changed.

当依赖消费者正在检查生产者的价值是否实际发生变化时调用生产者。

Polls dependencies of a consumer to determine if they have actually changed.

轮询消费者的依赖关系以确定它们是否真的发生了变化。

If this returns `false`, then even though the consumer may have previously been notified of a
change, the values of its dependencies have not actually changed and the consumer should not
rerun any reactions.

如果这返回 `false`，那么即使消费者之前可能已收到更改通知，其依赖项的值实际上并未更改，并且消费者不应重新运行任何反应。

Notify all consumers of this producer that its value may have changed.

通知该生产者的所有消费者它的值可能已经改变。

Mark that this producer node has been accessed in the current reactive context.

标记此生产者节点已在当前反应式上下文中被访问。

Whether this consumer currently has any producers registered.

该消费者当前是否注册了任何生产者。

Whether this `ReactiveNode` in its producer capacity is currently allowed to initiate updates,
based on the current consumer context.

基于当前的消费者上下文，当前是否允许此 `ReactiveNode` 在其生产者能力中启动更新。
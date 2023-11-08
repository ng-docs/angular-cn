Create a new template consumer pointing at the specified LView.
Sometimes, a previously created consumer may be reused, in order to save on allocations. In that
case, the LView will be updated.

创建一个指向指定 LView 的新模板消费者。有时，可能会重用先前创建的消费者，以节省分配。在这种情况下，LView 将被更新。

Assigns the `currentTemplateContext` to its LView's `REACTIVE_CONSUMER` slot if there are tracked
producers.

如果有被跟踪的生产者，则将 `currentTemplateContext` 分配给它的 LView 的 `REACTIVE_CONSUMER` 插槽。

The presence of producers means that a signal was read while the consumer was the active
consumer.

生产者的存在意味着当消费者是活跃的消费者时，信号被读取。

If no producers are present, we do not assign the current template context. This also means we
can just reuse the template context for the next LView.

如果不存在生产者，我们不分配当前模板上下文。这也意味着我们可以为下一个 LView 重用模板上下文。
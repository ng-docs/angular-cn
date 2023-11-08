Assign data slots for all operations which implement `ConsumesSlotOpTrait`, and propagate the
assigned data slots of those operations to any expressions which reference them via
`UsesSlotIndexTrait`.

为实现 `ConsumesSlotOpTrait` 的所有操作分配数据槽，并将这些操作的分配数据槽传播到通过 `UsesSlotIndexTrait` 引用它们的任何表达式。

This phase is also responsible for counting the number of slots used for each view \(its `decls`\)
and propagating that number into the `Template` operations which declare embedded views.

此阶段还负责计算用于每个视图（其 `decls` ）的插槽数，并将该数字传播到声明嵌入式视图的 `Template` 操作中。
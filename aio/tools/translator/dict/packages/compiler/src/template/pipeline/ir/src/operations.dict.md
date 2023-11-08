Branded type for a cross-reference ID. During ingest, `XrefId`s are generated to link together
different IR operations which need to reference each other.

交叉引用 ID 的品牌类型。在摄取期间，生成 `XrefId` 以将需要相互引用的不同 IR 操作链接在一起。

a specific narrower type of `Op` \(for example, creation operations\) which this
    specific subtype of `Op` can be linked with in a linked list.

特定的更窄类型的 `Op` （例如，创建操作），该特定的 `Op` 子类型可以在链表中与之链接。

Base interface for semantic operations being performed within a template.

在模板中执行的语义操作的基本接口。

All operations have a distinct kind.

所有操作都有不同的种类。

The previous operation in the linked list, if any.

链表中的前一个操作，如果有的话。

This is `null` for operation nodes not currently in a list, or for the special head/tail nodes.

对于当前不在列表中的操作节点或特殊的头/尾节点，这为 `null`。

The next operation in the linked list, if any.

链表中的下一个操作，如果有的话。

Debug id of the list to which this node currently belongs, or `null` if this node is not part
of a list.

此节点当前所属列表的调试 ID，如果此节点不属于列表，则为 `null`。

specific subtype of `Op` nodes which this list contains.

此列表包含的 `Op` 节点的特定子类型。

A linked list of `Op` nodes of a given subtype.

给定子类型的 `Op` 节点的链表。

Debug ID of this `OpList` instance.

此 `OpList` 实例的调试 ID。

Push a new operation to the tail of the list.

将新操作推送到列表的尾部。

Prepend one or more nodes to the start of the list.

将一个或多个节点添加到列表的开头。

`OpList` is iterable via the iteration protocol.

`OpList` 可通过迭代协议进行迭代。

It's safe to mutate the part of the list that has already been returned by the iterator, up to
and including the last operation returned. Mutations beyond that point _may_ be safe, but may
also corrupt the iteration position and should be avoided.

改变迭代器已经返回的列表部分是安全的，直到并包括返回的最后一个操作。超过该点的突变 _ 可能 _ 是安全的，但也可能破坏迭代位置，应该避免。

Replace `oldOp` with `newOp` in the list.

将列表中的 `oldOp` 替换为 `newOp`。

Replace `oldOp` with some number of new operations in the list \(which may include `oldOp`\).

将 `oldOp` 替换为列表中的一些新操作（可能包括 `oldOp` ）。

Remove the given node from the list which contains it.

从包含它的列表中删除给定的节点。

Insert `op` before `before`.

在 `before` 插入 `op`。

Asserts that `op` does not currently belong to a list.

断言 `op` 当前不属于列表。

Asserts that `op` currently belongs to a list. If `byList` is passed, `op` is asserted to
specifically belong to that list.

断言 `op` 当前属于列表。如果传递了 `byList`，则断言 `op` 明确属于该列表。

Asserts that `op` is not a special `ListEnd` node.

断言 `op` 不是特殊的 `ListEnd` 节点。
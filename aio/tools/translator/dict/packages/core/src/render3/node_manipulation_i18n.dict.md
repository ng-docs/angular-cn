parent `TNode`

父 `TNode`

current `TNode` \(The node which we would like to insert into the DOM\)

当前 `TNode`（我们要插入到 DOM 中的节点）

current `LView`

当前的 `LView`

Find a node in front of which `currentTNode` should be inserted \(takes i18n into account\).

查找应该在其前面插入 `currentTNode` 的节点（考虑 i18n）。

This method determines the `RNode` in front of which we should insert the `currentRNode`. This
takes `TNode.insertBeforeIndex` into account.

此方法确定我们应该在其前面插入 `currentRNode` 的 `RNode`。这会考虑 `TNode.insertBeforeIndex`。

Process `TNode.insertBeforeIndex` by adding i18n text nodes.

通过添加 i18n 文本节点来处理 `TNode.insertBeforeIndex`。

See `TNode.insertBeforeIndex`

请参阅 `TNode.insertBeforeIndex`
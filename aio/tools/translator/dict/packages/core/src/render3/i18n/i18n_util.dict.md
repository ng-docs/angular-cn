Current `TView`.

当前 `TView`。

Index where the value should be read from.

应该从中读取值的索引。

Retrieve `TIcu` at a given `index`.

在给定的 `index` 处检索 `TIcu`。

The `TIcu` can be stored either directly \(if it is nested ICU\) OR
it is stored inside tho `TIcuContainer` if it is top level ICU.

`TIcu` 可以直接存储（如果是嵌套 ICU），如果是顶级 ICU，则可以存储在 `TIcuContainer` 中。

The reason for this is that the top level ICU need a `TNode` so that they are part of the render
tree, but nested ICU's have no TNode, because we don't know ahead of time if the nested ICU is
expressed \(parent ICU may have selected a case which does not contain it.\)

原因是顶级 ICU 需要一个 `TNode`，以便它们是渲染树的一部分，但嵌套 ICU 没有
TNode，因为我们无法提前知道嵌套 ICU 是否被表达（父 ICU 可能有选择了一个不包含它的案例。）

Index where the value should be stored at in `Tview.data`

`Tview.data` 中应该存储值的索引

The TIcu to store.

要存储的 TIcu。

Store `TIcu` at a give `index`.

`TIcu` 存储在给定的 `index` 处。

Set `TNode.insertBeforeIndex` taking the `Array` into account.

考虑 `Array` 设置 `TNode.insertBeforeIndex`。

See `TNode.insertBeforeIndex`

请参阅 `TNode.insertBeforeIndex`

Create `TNode.type=TNodeType.Placeholder` node.

创建 `TNode.type=TNodeType.Placeholder` 节点。

See `TNodeType.Placeholder` for more information.

有关更多信息，请参阅 `TNodeType.Placeholder`。

Returns current ICU case.

返回当前的 ICU 病例。

ICU cases are stored as index into the `TIcu.cases`.
At times it is necessary to communicate that the ICU case just switched and that next ICU update
should update all bindings regardless of the mask. In such a case the we store negative numbers
for cases which have just been switched. This function removes the negative flag.

ICU 病例作为索引存储到 `TIcu.cases` 中。有时有必要传达 ICU 病例刚刚切换，并且下一次 ICU
更新应该更新所有绑定，无论掩码如何。在这种情况下，我们会为刚刚切换的情况存储负数。此函数删除否定标志。
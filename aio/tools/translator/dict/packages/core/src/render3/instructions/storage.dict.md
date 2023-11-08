Store a value in the `data` at a given `index`.

在给定 `index` 处的 `data` 中存储一个值。

The index of the local ref in contextViewData.

contextViewData 中本地引用的索引。

Retrieves a local reference from the current contextViewData.

从当前的 contextViewData 中检索本地引用。

If the reference to retrieve is in a parent view, this instruction is used in conjunction
with a `nextContext()` call, which walks up the tree and updates the contextViewData instance.

如果要检索的引用在父视图中，则此指令会与 `nextContext()` 调用结合使用，它会沿着树走并更新
contextViewData 实例。
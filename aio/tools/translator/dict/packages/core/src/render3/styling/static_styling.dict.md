The `TNode` into which the styling information should be loaded.

应该加载样式信息的 `TNode`。

`TAttributes` containing the styling information.

包含样式信息的 `TAttributes`。

Where should the resulting static styles be written?

生成的静态样式应该写在哪里？

`false` Write to `TNode.stylesWithoutHost` / `TNode.classesWithoutHost`

`false` 写入 `TNode.stylesWithoutHost` / `TNode.classesWithoutHost`

`true` Write to `TNode.styles` / `TNode.classes`

`true` 写入 `TNode.styles` / `TNode.classes`

Compute the static styling \(class/style\) from `TAttributes`.

从 `TAttributes` 计算静态样式（类/样式）。

This function should be called during `firstCreatePass` only.

此函数应仅在 `firstCreatePass` 期间调用。
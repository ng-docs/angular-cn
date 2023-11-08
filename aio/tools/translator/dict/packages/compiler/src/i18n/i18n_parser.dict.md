Returns a function converting html nodes to an i18n Message given an interpolationConfig

返回给定插值配置的将 html 节点转换为 i18n 消息的函数

The `Text` and `Placeholder` nodes to be processed.

要处理的 `Text` 和 `Placeholder` 节点。

Any i18n metadata for these `nodes` stored from a previous pass.

从上一次传递中存储的这些 `nodes` 的任何 i18n 元数据。

Re-use the source-spans from `previousI18n` metadata for the `nodes`.

为 `nodes` 重用 `previousI18n` 元数据中的 source-spans。

Whitespace removal can invalidate the source-spans of interpolation nodes, so we
reuse the source-span stored from a previous pass before the whitespace was removed.

删除空格可能会导致插值节点的 source-span 无效，因此我们重用了在删除空格之前从上一次传递中存储的
source-span。

Asserts that the `message` contains exactly one `Container` node.

断言 `message` 正好包含一个 `Container` 节点。

Asserts that the `previousNodes` and `node` collections have the same number of elements and
corresponding elements have the same node type.

断言 `previousNodes` 和 `node` 集合具有相同数量的元素，并且对应的元素具有相同的节点类型。
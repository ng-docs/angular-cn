This is an R3 `Node`-like wrapper for a raw `html.Comment` node. We do not currently
require the implementation of a visitor for Comments as they are only collected at
the top-level of the R3 AST, and only if `Render3ParseOptions['collectCommentNodes']`
is true.

这是原始 `html.Comment` 节点的类似于 R3 `Node` 的包装器。我们当前不要求为 Comments
实现访问器，因为它们只会在 R3 AST 的顶级收集，并且 `Render3ParseOptions['collectCommentNodes']`
为 true。

Represents a text attribute in the template.

表示模板中的文本属性。

`valueSpan` may not be present in cases where there is no value `<div a></div>`.
`keySpan` may also not be present for synthetic attributes from ICU expansions.

在不存在值 `<div a></div>` 的情况下，可能不存在 `valueSpan`。对于 ICU 扩展的合成属性，`keySpan`
也可能不存在。
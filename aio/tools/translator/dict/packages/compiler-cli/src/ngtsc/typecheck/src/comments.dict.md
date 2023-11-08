Reads the trailing comments and finds the first match which is a span comment \(i.e. 4,10\) on a
node and returns it as an `AbsoluteSourceSpan`.

读取尾部注释并查找第一个匹配项，这是节点上的跨度注释（即 4,10），并将其作为 `AbsoluteSourceSpan`
返回。

Will return `null` if no trailing comments on the node match the expected form of a source span.

如果节点上没有尾随注释与源 span 的预期形式匹配，将返回 `null`。

Used to identify what type the comment is.

用于标识注释是什么类型。

Identifies what the TCB expression is for \(for example, a directive declaration\).

标识 TCB 表达式的用途（例如，指令声明）。

Tags the node with the given expression identifier.

使用给定的表达式标识符来标记节点。

Tag the `ts.Node` with an indication that any errors arising from the evaluation of the node
should be ignored.

使用 `ts.Node` 标记，以表明由节点估算引起的任何错误都应该被忽略。

Returns true if the node has a marker that indicates diagnostics errors should be ignored.

如果节点有一个表明应忽略诊断错误的标记，则返回 true。

Given a `ts.Node` with finds the first node whose matching the criteria specified
by the `FindOptions`.

给定一个 `ts.Node` with，查找与 `FindOptions` 指定的条件匹配的第一个节点。

Returns `null` when no `ts.Node` matches the given conditions.

当没有 `ts.Node` 满足给定条件时返回 `null`。

Given a `ts.Node` with source span comments, finds the first node whose source span comment
matches the given `sourceSpan`. Additionally, the `filter` function allows matching only
`ts.Nodes` of a given type, which provides the ability to select only matches of a given type
when there may be more than one.

给定带有源 span 注释的 `ts.Node`，查找其源 span 注释与给定 `sourceSpan` 匹配的第一个节点。此外，
`filter` 函数允许仅匹配给定类型的 `ts.Nodes`
，它提供了在可能有多个时仅选择给定类型的匹配项的能力。
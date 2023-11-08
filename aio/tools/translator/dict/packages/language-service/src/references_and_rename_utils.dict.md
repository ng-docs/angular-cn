Represents a location in a file.

表示文件中的位置。

Converts a `TcbLocation` to a more genericly named `FilePosition`.

将 `TcbLocation` 转换为更通用的 `FilePosition`。

A target node in a template.

模板中的目标节点。

TypeScript locations which the template node maps to. A given template node might map to
several TS nodes. For example, a template node for an attribute might resolve to several
directives or a directive and one of its inputs.

模板节点映射到的 TypeScript 位置。给定的模板节点可能会映射到多个 TS
节点。例如，属性的模板节点可能会解析为多个指令或一个指令及其输入之一。

The resolved Symbol for the template target.

模板目标的解析后的 Symbol。

Takes a position in a template and finds equivalent targets in TS files as well as details about
the targeted template node.

在模板中获取一个位置，并在 TS 文件中查找等效目标以及有关目标模板节点的详细信息。

Given a set of `DirectiveSymbol`s, finds the equivalent `FilePosition` of the class declaration.

给定一组 `DirectiveSymbol`，查找类声明的等效 `FilePosition`。

Creates a "key" for a rename/reference location by concatenating file name, span start, and span
length. This allows us to de-duplicate template results when an item may appear several times
in the TCB but map back to the same template location.

通过连接文件名、跨度开始和跨度长度为重命名/引用位置创建“键”。这允许我们当一个条目可能在 TCB
中出现多次但映射回同一个模板位置时，可以对模板结果进行重复数据删除。

Converts a given `ts.DocumentSpan` in a shim file to its equivalent `ts.DocumentSpan` in the
template.

将 shim 文件中的给定 `ts.DocumentSpan` 转换为模板中的等效 `ts.DocumentSpan`。

You can optionally provide a `requiredNodeText` that ensures the equivalent template node's text
matches. If it does not, this function will return `null`.

你可以选择提供 `requiredNodeText`，以确保等效模板节点的文本匹配。如果不是，此函数将返回 `null`
。

Finds the text and `ts.TextSpan` for the node at a position in a template.

在模板中的某个位置查找节点的文本和 `ts.TextSpan`。

Retrieves the `PipeMeta` or `DirectiveMeta` of the given `ts.Node`'s parent class.

检索给定 `ts.Node` 父类的 `PipeMeta` 或 `DirectiveMeta`。

Returns `null` if the node has no parent class or there is no meta associated with the class.

如果节点没有父类或没有与类关联的元，则返回 `null`。
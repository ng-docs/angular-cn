Regexp that extracts a reference node information from the compressed node location.
The reference node is represented as either:

从压缩节点位置提取参考节点信息的正则表达式。参考节点表示为：

a number which points to an LView slot

一个指向 LView 插槽的数字

the `b` char which indicates that the lookup should start from the `document.body`

`b` 字符，表示查找应从 `document.body` 开始

the `h` char to start lookup from the component host node \(`lView[HOST]`\)

从组件宿主节点 \( `lView[HOST]` \) 开始查找的 `h` 字符

Helper function that takes a reference node location and a set of navigation steps
\(from the reference node\) to a target node and outputs a string that represents
a location.

将参考节点位置和一组导航步骤（从参考节点）获取到目标节点并输出表示位置的字符串的辅助函数。

For example, given: referenceNode = 'b' \(body\) and path = ['firstChild', 'firstChild',
'nextSibling'], the function returns: `bf2n`.

例如，给定：referenceNode = 'b' \(body\) 和 path = ['firstChild', 'firstChild', 'nextSibling']['firstChild', 'firstChild',
'nextSibling']，函数返回：`bf2n`。

Helper function that reverts the `compressNodeLocation` and transforms a given
string into an array where at 0th position there is a reference node info and
after that it contains information \(in pairs\) about a navigation step and the
number of repetitions.

恢复 `compressNodeLocation` 并将给定字符串转换为数组的辅助函数，其中第 0 个位置有一个参考节点信息，之后它包含有关导航步骤和重复次数的信息（成对）。

For example, the path like 'bf2n' will be transformed to:
['b', 'firstChild', 2, 'nextSibling', 1].

例如，像 'bf2n' 这样的路径将被转换为：['b', 'firstChild', 2, 'nextSibling', 1]['b', 'firstChild', 2, 'nextSibling', 1]。

This information is later consumed by the code that navigates the DOM to find
a given node by its location.

此信息稍后由导航 DOM 的代码使用，以根据其位置查找给定节点。
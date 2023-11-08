Router.isActive



A set of options which specify how to determine if a `UrlTree` is active, given the `UrlTree`
for the current router state.

一组选项，指定如何在给定当前路由器状态的 `UrlTree` 的情况下确定 `UrlTree` 是否处于活动状态。

Defines the strategy for comparing the matrix parameters of two `UrlTree`s.

定义比较两个 `UrlTree` 的矩阵参数的策略。

The matrix parameter matching is dependent on the strategy for matching the
segments. That is, if the `paths` option is set to `'subset'`, only
the matrix parameters of the matching segments will be compared.

矩阵参数匹配取决于匹配段的策略。也就是说，如果 `paths` 选项设置为 `'subset'`，则只会比较匹配段的矩阵参数。

`'exact'`: Requires that matching segments also have exact matrix parameter
matches.

`'exact'`：要求匹配的段也具有精确的矩阵参数匹配。

`'subset'`: The matching segments in the router's active `UrlTree` may contain
extra matrix parameters, but those that exist in the `UrlTree` in question must match.

`'subset'`：路由器的活动 `UrlTree` 中的匹配段可能包含额外的矩阵参数，但相关 `UrlTree` 中存在的那些必须匹配。

`'ignored'`: When comparing `UrlTree`s, matrix params will be ignored.

`'ignored'`：比较 `UrlTree` 时，矩阵参数将被忽略。

Defines the strategy for comparing the query parameters of two `UrlTree`s.

定义比较两个 `UrlTree` 的查询参数的策略。

`'exact'`: the query parameters must match exactly.

`'exact'`：查询参数必须完全匹配。

`'subset'`: the active `UrlTree` may contain extra parameters,
but must match the key and value of any that exist in the `UrlTree` in question.

`'subset'`：活动的 `UrlTree` 可能包含额外的参数，但必须与相关 `UrlTree` 中存在的任何参数的键和值匹配。

`'ignored'`: When comparing `UrlTree`s, query params will be ignored.

`'ignored'`：比较 `UrlTree` 时，查询参数将被忽略。

Defines the strategy for comparing the `UrlSegment`s of the `UrlTree`s.

定义用于比较 `UrlSegment` 的 `UrlTree` 的策略。

`'exact'`: all segments in each `UrlTree` must match.

`'exact'`：每个 `UrlTree` 中的所有段都必须匹配。

`'subset'`: a `UrlTree` will be determined to be active if it
is a subtree of the active route. That is, the active route may contain extra
segments, but must at least have all the segments of the `UrlTree` in question.

`'subset'`：如果 `UrlTree` 是活动路由的子树，则将其确定为活动状态。也就是说，活动路由可能包含额外的段，但必须至少具有相关的 `UrlTree` 的所有段。

`'exact'`: indicates that the `UrlTree` fragments must be equal.

`'exact'`：表明 `UrlTree` 片段必须相等。

`'ignored'`: the fragments will not be compared when determining if a
`UrlTree` is active.

`'ignored'`：确定 `UrlTree` 是否处于活动状态时，不会比较片段。

Represents the parsed URL.

代表已解析的 URL。

Since a router state is a tree, and the URL is nothing but a serialized state, the URL is a
serialized tree.
UrlTree is a data structure that provides a lot of affordances in dealing with URLs

由于路由器状态是一棵树，而 URL 只是序列化的状态，所以 URL 就是序列化的树。UrlTree 是一种数据结构，在处理 URL 时提供了很多便利

Example

范例

Represents the parsed URL segment group.

表示已解析的 URL 段组。

See `UrlTree` for more information.

有关更多信息，请参见 `UrlTree`。

The parent node in the url tree

网址树中的父节点

Whether the segment has child segments

该网址段是否有子段

Number of child segments

子段数

Represents a single URL segment.

表示一个 URL 段。

A UrlSegment is a part of a URL between the two slashes. It contains a path and the matrix
parameters associated with the segment.

UrlSegment 是两个斜杠之间的 URL 的一部分。它包含路径和与该段关联的矩阵参数。

Serializes and deserializes a URL string into a URL tree.

将 URL 字符串序列化和反序列化为 URL 树。

The url serialization strategy is customizable. You can
make all URLs case insensitive by providing a custom UrlSerializer.

有关 URL 序列化程序的示例，请参见 `DefaultUrlSerializer`。

See `DefaultUrlSerializer` for an example of a URL serializer.

有关 URL 序列化程序的示例，请参见 `DefaultUrlSerializer`。

Parse a url into a `UrlTree`

将网址解析为 `UrlTree`

Converts a `UrlTree` into a url

将 `UrlTree` 转换为 url

A default implementation of the `UrlSerializer`.

`UrlSerializer` 的默认实现。

Example URLs:

范例网址：

DefaultUrlSerializer uses parentheses to serialize secondary segments \(e.g., popup:compose\), the
colon syntax to specify the outlet, and the ';parameter=value' syntax \(e.g., open=true\) to
specify route specific parameters.

DefaultUrlSerializer 使用圆括号序列化辅助段（比如，popup:compose），使用冒号语法指定出口，并使用';parameter=value' 语法（比如 open=true）来指定路由的特有参数。

Parses a url into a `UrlTree`

将网址解析为 `UrlTree`

Encodes a URI string with the default encoding. This function will only ever be called from
`encodeUriQuery` or `encodeUriSegment` as it's the base set of encodings to be used. We need
a custom encoding because encodeURIComponent is too aggressive and encodes stuff that doesn't
have to be encoded per https://url.spec.whatwg.org.

使用默认编码对 URI 字符串进行编码。此函数只会从 `encodeUriQuery` 或 `encodeUriSegment` 调用，因为它是要使用的基本编码集。我们需要自定义编码，因为 encodeURIComponent 过于激进，并且编码的内容不必按照 https://url.spec.whatwg.org 进行编码。

This function should be used to encode both keys and values in a query string key/value. In
the following URL, you need to call encodeUriQuery on "k" and "v":

此函数应用于对查询字符串键/值中的键和值进行编码。在以下 URL 中，你需要对“k”和“v”调用 encodeUriQuery：

http://www.site.org/html;mk=mv?k=v#f



This function should be used to encode a URL fragment. In the following URL, you need to call
encodeUriFragment on "f":

此函数应用于对 URL 片段进行编码。在以下 URL 中，你需要在“f”上调用 encodeUriFragment：

This function should be run on any URI segment as well as the key and value in a key/value
pair for matrix params. In the following URL, you need to call encodeUriSegment on "html",
"mk", and "mv":

此函数应在任何 URI 段以及矩阵参数的键/值对中的键和值上运行。在以下 URL 中，你需要对“html”、“mk”和“mv”调用 encodeUriSegment：

Recursively

递归地

merges primary segment children into their parents

将主要部分的子节点合并到他们的父节点中

drops empty children \(those which have no segments and no children themselves\). This latter
prevents serializing a group into something like `/a(aux:)`, where `aux` is an empty child
segment.

丢弃空子节点（那些没有段并且自己也没有子节点的子节点）。后者防止将组序列化为类似 `/a(aux:)` 的内容，其中 `aux` 是一个空的子段。

merges named outlets without a primary segment sibling into the children. This prevents
serializing a URL like `//(a:a)(b:b) instead of`/\(a:a//b:b\)`when the aux b route lives on the
root but the`a\` route lives under an empty path primary route.

将没有主要段兄弟的命名出口合并到子节点中。`when the aux b route lives on the root but the` a\` 路由位于空路径下时，这可以防止序列化像 `//(a:a)(b:b) instead of` /\(a:a//b:b\) 这样的 URL 主要路线。

When possible, merges the primary outlet child into the parent `UrlSegmentGroup`.

如果可能，将主要子出口合并到父 `UrlSegmentGroup` 中。

When a segment group has only one child which is a primary outlet, merges that child into the
parent. That is, the child segment group's segments are merged into the `s` and the child's
children become the children of `s`. Think of this like a 'squash', merging the child segment
group into the parent.

当一个段组只有一个作为主要出口的子节点时，将该子节点合并到父节点中。也就是说，子段组的段合并到 `s` 中，子段的子段成为 `s` 的子段。把这想象成一个“壁球”，将子段组合并到父段组中。
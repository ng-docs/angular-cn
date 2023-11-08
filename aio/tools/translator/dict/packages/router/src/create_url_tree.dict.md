The `ActivatedRouteSnapshot` to apply the commands to

要应用命令的 `ActivatedRouteSnapshot`

An array of URL fragments with which to construct the new URL tree.
If the path is static, can be the literal URL string. For a dynamic path, pass an array of path
segments, followed by the parameters for each segment.
The fragments are applied to the one provided in the `relativeTo` parameter.

用于构建新 URL 树的 URL 片段数组。如果路径是静态的，则可以是文字 URL 字符串。对于动态路径，请传递一个路径段数组，后跟每个段的参数。片段会应用于 `relativeTo` 参数中提供的片段。

The query parameters for the `UrlTree`. `null` if the `UrlTree` does not have
    any query parameters.

可选值。默认值为 `null`。

The fragment for the `UrlTree`. `null` if the `UrlTree` does not have a fragment.

可选值。默认值为 `null`。

Creates a `UrlTree` relative to an `ActivatedRouteSnapshot`.

创建相对于 `ActivatedRouteSnapshot` 的 `UrlTree`。

Determines if a given command has an `outlets` map. When we encounter a command
with an outlets k/v map, we need to apply each outlet individually to the existing segment.

确定给定命令是否具有 `outlets` 映射。当我们遇到带有出口 k/v 映射的命令时，我们需要将每个出口单独应用于现有段。

Replaces the `oldSegment` which is located in some child of the `current` with the `newSegment`.
This also has the effect of creating new `UrlSegmentGroup` copies to update references. This
shouldn't be necessary but the fallback logic for an invalid ActivatedRoute in the creation uses
the Router's current url tree. If we don't create new segment groups, we end up modifying that
value.

用 `newSegment` 替换 `current` 的某个子节点中的 `oldSegment`。这也具有创建新的 `UrlSegmentGroup` 副本以更新引用的效果。这不是必需的，但创建中无效 ActivatedRoute 的回退逻辑使用路由器的当前 url 树。如果我们不创建新的段组，我们最终会修改该值。

Transforms commands to a normalized `Navigation`

将命令转换为规范化的 `Navigation`
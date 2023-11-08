The `Routes` to match against

要匹配的 `Routes`

The `UrlSegmentGroup` whose children need to be matched against the
  config.

`UrlSegmentGroup` 的子项需要与配置匹配。

Matches every child outlet in the `segmentGroup` to a `Route` in the config. Returns `null` if
we cannot find a match for _any_ of the children.

将 `segmentGroup` 中的每个子出口与配置中的 `Route` 匹配。如果找不到 _ 任何子 _ 项的匹配项，则返回 `null`。

Finds `TreeNode`s with matching empty path route configs and merges them into `TreeNode` with
the children from each duplicate. This is necessary because different outlets can match a
single empty path route config and the results need to then be merged.

查找具有匹配的空路径路由配置的 `TreeNode`，并将它们与每个副本的子项合并到 `TreeNode` 中。这是必要的，因为不同的出口可以匹配单个空路径路由配置，然后需要合并结果。
The renderer to be used

要使用的渲染器

The element that the attributes will be assigned to

属性将分配给的元素

The attribute array of values that will be assigned to the element

将分配给元素的值的属性数组

the index value that was last accessed in the attributes array

属性数组中最后访问的索引值

Assigns all attribute values to the provided element via the inferred renderer.

通过推断的渲染器将所有属性值分配给提供的元素。

This function accepts two forms of attribute entries:

此函数接受两种形式的属性条目：

default: `(key, value)`:

默认值：`(key, value)`:

namespaced: `(NAMESPACE_MARKER, uri, name, value)`

加命名空间后：`(NAMESPACE_MARKER, uri, name, value)`

The `attrs` array can contain a mix of both the default and namespaced entries.
The "default" values are set without a marker, but if the function comes across
a marker value then it will attempt to set a namespaced value. If the marker is
not of a namespaced value then the function will quit and return the index value
where it stopped during the iteration of the attrs array.

`attrs` 数组可以包含默认条目和命名空间条目的混合。
“默认”值是在没有标记的情况下设置的，但如果函数遇到标记值，那么它将尝试设置一个命名空间值。如果标记不属于命名空间值，则函数将退出并返回它在
attrs 数组迭代期间停止的索引值。

See [AttributeMarker] to understand what the namespace marker value is.

请参阅[AttributeMarker][AttributeMarker]以了解命名空间标记的值。

Note that this instruction does not support assigning style and class values to
an element. See `elementStart` and `elementHostAttrs` to learn how styling values
are applied to an element.

请注意，本操作指南不支持为元素分配 style 和 class 值。请参阅 `elementStart` 和 `elementHostAttrs`
以了解如何将样式值应用于元素。

The attribute marker to test.

要测试的属性标记。

true if the marker is a "name-only" marker \(e.g. `Bindings`, `Template` or `I18n`\).

如果标记是“仅名称”标记（例如 `Bindings`、`Template` 或 `I18n`），则为 true。

Test whether the given value is a marker that indicates that the following
attribute values in a `TAttributes` array are only the names of attributes,
and not name-value pairs.

测试给定值是否是一个标记，该标记表明 `TAttributes`
数组中的以下属性值只是属性名称，而不是名称-值对。

Location of where the merged `TAttributes` should end up.

合并的 `TAttributes` 应该最终到达的位置。

`TAttributes` which should be appended to `dst`

应该附加到 `dst` 的 `TAttributes`

Merges `src` `TAttributes` into `dst` `TAttributes` removing any duplicates in the process.

将 `src` `TAttributes` 合并到 `dst` `TAttributes` 中，删除过程中的任何重复项。

This merge function keeps the order of attrs same.

此合并函数保持 attrs 的顺序相同。

`TAttributes` to append to.

要附加到的 `TAttributes`。

Region where the `key`/`value` should be added.

应该添加 `key` / `value` 的区域。

Key to add to `TAttributes`

要添加到 `TAttributes` 的键

Key to add to `TAttributes` \(in case of `AttributeMarker.NamespaceURI`\)

要添加到 `TAttributes` 的键（在 `AttributeMarker.NamespaceURI` 的情况下）

Value to add or to overwrite to `TAttributes` Only used if `marker` is not Class.

要添加或覆盖 `TAttributes` 的值仅在 `marker` 不是 Class 时使用。

Append `key`/`value` to existing `TAttributes` taking region marker and duplicates into account.

将 `key` / `value` 附加到现有的 `TAttributes`，同时考虑区域标记和重复项。
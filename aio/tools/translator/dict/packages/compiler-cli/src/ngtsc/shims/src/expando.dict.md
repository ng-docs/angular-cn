A `Symbol` which is used to patch extension data onto `ts.SourceFile`s.

一个 `Symbol`，用于将扩展名数据修补到 `ts.SourceFile` s。

Contents of the `NgExtension` property of a `ts.SourceFile`.

ts.SourceFile 的 `NgExtension` 属性的 `ts.SourceFile`。

The contents of the `referencedFiles` array, before modification by a `ShimReferenceTagger`.

`referencedFiles` 数组的内容，在被 `ShimReferenceTagger` 修改之前。

The contents of the `referencedFiles` array, after modification by a `ShimReferenceTagger`.

由 `ShimReferenceTagger` 修改后的 `referencedFiles` 数组的内容。

A `ts.SourceFile` which may or may not have `NgExtension` data.

一个 `ts.SourceFile`，可能有也可能没有 `NgExtension` 数据。

A `ts.SourceFile` which has `NgExtension` data.

具有 `ts.SourceFile` 数据的 `NgExtension`。

Overrides the type of `referencedFiles` to be writeable.

将 `referencedFiles` 的类型覆盖为可写。

Narrows a `ts.SourceFile` if it has an `NgExtension` property.

如果 `NgExtension` `ts.SourceFile`，则缩小它。

Returns the `NgExtensionData` for a given `ts.SourceFile`, adding it if none exists.

返回给定 `NgExtensionData` 的 `ts.SourceFile`，如果不存在，则添加它。

Data associated with a per-shim instance `ts.SourceFile`.

与每个 shim 实例 `ts.SourceFile` 关联的数据。

An `NgExtendedSourceFile` that is a per-file shim and has `NgFileShimData`.

一个 `NgExtendedSourceFile`，它是每个文件的 shim 并具有 `NgFileShimData`。

Check whether `sf` is a per-file shim `ts.SourceFile`.

检查 `sf` 是否是每个文件的 shim `ts.SourceFile`。

Check whether `sf` is a shim `ts.SourceFile` \(either a per-file shim or a top-level shim\).

检查 `sf` 是否是 shim `ts.SourceFile`（每个文件的 shim 或顶级 shim）。

Copy any shim data from one `ts.SourceFile` to another.

将任何 shim 数据从一个 `ts.SourceFile` 到另一个。

For those `ts.SourceFile`s in the `program` which have previously been tagged by a
`ShimReferenceTagger`, restore the original `referencedFiles` array that does not have shim tags.

对于 `program` 中以前被 `ShimReferenceTagger` `ts.SourceFile` 恢复没有 shim 标签的原始
`referencedFiles` 数组。

For those `ts.SourceFile`s in the `program` which have previously been tagged by a
`ShimReferenceTagger`, re-apply the effects of tagging by updating the `referencedFiles` array to
the tagged version produced previously.

对于 `program` 中以前被 `ShimReferenceTagger` `ts.SourceFile` 请通过将 `referencedFiles`
数组更新为以前生成的标记版本来重新应用标记的效果。

Restore the original `referencedFiles` for the given `ts.SourceFile`.

恢复给定 `ts.SourceFile` 的原始 `referencedFiles`。

Apply the previously tagged `referencedFiles` to the given `ts.SourceFile`, if it was previously
tagged.

将以前标记的 `referencedFiles` 应用于给定的 `ts.SourceFile`（如果以前被标记）。
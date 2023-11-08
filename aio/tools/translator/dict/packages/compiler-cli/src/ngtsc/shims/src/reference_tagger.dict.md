Manipulates the `referencedFiles` property of `ts.SourceFile`s to add references to shim files
for each original source file, causing the shims to be loaded into the program as well.

操作 `ts.SourceFile` s 的 `referencedFiles` 属性以添加对每个原始源文件的 shim 文件的引用，从而使
shims 也被加载到程序中。

`ShimReferenceTagger`s are intended to operate during program creation only.

`ShimReferenceTagger` 旨在仅在程序创建期间运行。

Tag `sf` with any needed references if it's not a shim itself.

如果 `sf` 不是 shim 本身，则使用任何需要的引用标记它。

Disable the `ShimReferenceTagger` and free memory associated with tracking tagged files.

禁用 `ShimReferenceTagger` 并释放与跟踪标记文件关联的内存。
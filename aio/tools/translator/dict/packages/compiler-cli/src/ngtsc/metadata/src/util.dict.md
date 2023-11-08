Inspects the class' members and extracts the metadata that is used when type-checking templates
that use the directive. This metadata does not contain information from a base class, if any,
making this metadata invariant to changes of inherited classes.

检查类的成员并提取在对使用该指令的模板进行类型检查时使用的元数据。此元数据不包含来自基类的信息（如果有），使此元数据对于继承类的更改保持不变。

A `MetadataReader` that reads from an ordered set of child readers until it obtains the requested
metadata.

一种 `MetadataReader`，它会从一组有序的子读取器中读取，直到获得所请求的元数据。

This is used to combine `MetadataReader`s that read from different sources \(e.g. from a registry
and from .d.ts files\).

这用于组合从不同来源（例如从注册表和从 .d.ts 文件）读取的 `MetadataReader`。

Returns whether a class declaration has the necessary class fields to make it injectable.

返回类声明是否具有使其可注入所需的类字段。
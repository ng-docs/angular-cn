Represents an resource for a component and contains the `AbsoluteFsPath`
to the file which was resolved by evaluating the `ts.Expression` \(generally, a relative or
absolute string path to the resource\).

表示组件的资源，并包含通过估算 `ts.Expression`（通常是资源的相对或绝对字符串路径）解析的文件的
`AbsoluteFsPath`。

If the resource is inline, the `path` will be `null`.

如果资源是内联的，则 `path` 将是 `null`。

Represents the either inline or external resources of a component.

表示组件的内联或外部资源。

A resource with a `path` of `null` is considered inline.

`path` 为 `null` 的资源被认为是内联的。

Tracks the mapping between external template/style files and the component\(s\) which use them.

跟踪外部模板/样式文件与使用它们的组件之间的映射。

This information is produced during analysis of the program and is used mainly to support
external tooling, for which such a mapping is challenging to determine without compiler
assistance.

这些信息是在程序分析期间产生的，主要用于支持外部工具，对于这些工具，如果没有编译器的帮助，很难确定这样的映射。
A `ShimGenerator` which adds type-checking files to the `ts.Program`.

一个 `ShimGenerator`，它将类型检查文件添加到 `ts.Program`。

This is a requirement for performant template type-checking, as TypeScript will only reuse
information in the main program when creating the type-checking program if the set of files in
each are exactly the same. Thus, the main program also needs the synthetic type-checking files.

这是性能模板类型检查的要求，因为 TypeScript
只会在每个中的文件集完全相同的情况下，在创建类型检查程序时重用主程序中的信息。因此，主程序还需要合成类型检查文件。
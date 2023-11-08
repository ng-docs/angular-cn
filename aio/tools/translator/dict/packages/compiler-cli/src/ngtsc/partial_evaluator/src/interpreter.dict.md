Tracks the scope of a function body, which includes `ResolvedValue`s for the parameters of that
body.

跟踪函数体的范围，包括该函数体参数的 `ResolvedValue`。

The module name \(if any\) which was used to reach the currently resolving symbols.

用于访问当前解析符号的模块名称（如果有）。

A file name representing the context in which the current `absoluteModuleName`, if any, was
resolved.

表示当前 `absoluteModuleName`（如果有）的上下文的文件名。

Gets the original keyword kind of an identifier. This is a compatibility
layer while we need to support TypeScript versions less than 5.1
TODO\(crisbeto\): remove this function once support for TS 4.9 is removed.

获取标识符的原始关键字种类。这是一个兼容层，我们需要支持低于 5.1 的 TypeScript 版本 TODO\(crisbeto\)：删除对 TS 4.9 的支持后删除此功能。
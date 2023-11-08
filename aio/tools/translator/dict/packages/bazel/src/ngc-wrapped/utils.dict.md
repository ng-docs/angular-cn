Adds support for the optional `fileNameToModuleName` operation to a given `ng.CompilerHost`.

向给定的 `ng.CompilerHost` 添加对可选 `fileNameToModuleName` 操作的支持。

This is used within `ngc-wrapped` and the Bazel compilation flow, but is exported here to allow
for other consumers of the compiler to access this same logic. For example, the xi18n operation
in g3 configures its own `ng.CompilerHost` which also requires `fileNameToModuleName` to work
correctly.

这在 `ngc-wrapped` 和 Bazel 编译流程中使用，但在此处导出以允许编译器的其他消费者访问相同的逻辑。例如，g3 中的 xi18n 操作配置了它自己的 `ng.CompilerHost`，它也需要 `fileNameToModuleName` 才能正常工作。
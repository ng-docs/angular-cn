Delegates all methods of `ts.CompilerHost` to a delegate, with the exception of
`getSourceFile`, `fileExists` and `writeFile` which are implemented in `TypeCheckProgramHost`.

将 `ts.CompilerHost` 的所有方法委托给委托，但在 `TypeCheckProgramHost` 中实现的 `getSourceFile`
、`fileExists` 和 `writeFile` 除外。

If a new method is added to `ts.CompilerHost` which is not delegated, a type error will be
generated for this class.

如果将新方法添加到未委托的 `ts.CompilerHost`，则会为此类生成类型错误。

A `ts.CompilerHost` which augments source files.

一个 `ts.CompilerHost`，可扩展源文件。

Updates a `ts.Program` instance with a new one that incorporates specific changes, using the
TypeScript compiler APIs for incremental program creation.

使用 TypeScript 编译器 API 进行增量程序创建，使用包含特定更改的新实例更新 `ts.Program` 实例。
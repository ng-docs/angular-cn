Delegates all methods of `ExtendedTsCompilerHost` to a delegate, with the exception of
`getSourceFile` and `fileExists` which are implemented in `NgCompilerHost`.

将 `ExtendedTsCompilerHost` 的所有方法委托给委托，但在 NgCompilerHost 中实现的 `getSourceFile` 和
`fileExists` `NgCompilerHost`。

If a new method is added to `ts.CompilerHost` which is not delegated, a type error will be
generated for this class.

如果将新方法添加到未委托的 `ts.CompilerHost`，则会为此类生成类型错误。

A wrapper around `ts.CompilerHost` \(plus any extension methods from `ExtendedTsCompilerHost`\).

`ts.CompilerHost` 的包装器（加上 `ExtendedTsCompilerHost` 的任何扩展方法）。

In order for a consumer to include Angular compilation in their TypeScript compiler, the
`ts.Program` must be created with a host that adds Angular-specific files \(e.g.
the template type-checking file, etc\) to the compilation. `NgCompilerHost` is the
host implementation which supports this.

为了让消费者在他们的 TypeScript 编译器中包含 Angular 编译，必须使用将 Angular
特定文件（例如工厂、摘要、模板类型检查文件等）添加到编译中的宿主来创建 `ts.Program`。
`NgCompilerHost` 是支持此操作的宿主实现。

The interface implementations here ensure that `NgCompilerHost` fully delegates to
`ExtendedTsCompilerHost` methods whenever present.

此处的接口实现可确保 `NgCompilerHost` 完全委托给 `ExtendedTsCompilerHost` 方法（只要存在）。

Retrieves a set of `ts.SourceFile`s which should not be emitted as JS files.

检索一组不应该作为 JS 文件发出的 `ts.SourceFile`。

Available after this host is used to create a `ts.Program` \(which causes all the files in the
program to be enumerated\).

在此宿主用于创建 `ts.Program`（这会导致程序中的所有文件被枚举）之后可用。

Retrieve the array of shim extension prefixes for which shims were created for each original
file.

检索为每个原始文件创建 shim 的 shim 扩展前缀数组。

Performs cleanup that needs to happen after a `ts.Program` has been created using this host.

执行使用此宿主创建 `ts.Program` 之后需要发生的清理。

Create an `NgCompilerHost` from a delegate host, an array of input filenames, and the full set
of TypeScript and Angular compiler options.

从委托宿主、输入文件名数组以及完整的 TypeScript 和 Angular 编译器选项集创建一个
`NgCompilerHost`。

Check whether the given `ts.SourceFile` is a shim file.

检查给定的 `ts.SourceFile` 是否是 shim 文件。

If this returns false, the file is user-provided.

如果返回 false，则文件是用户提供的。

Check whether the given `ts.SourceFile` is a resource file.

检查给定的 `ts.SourceFile` 是否是资源文件。

This simply returns `false` for the compiler-cli since resource files are not added as root
files to the project.

这只是为 compiler-cli 返回 `false`，因为资源文件不会作为根文件添加到项目中。
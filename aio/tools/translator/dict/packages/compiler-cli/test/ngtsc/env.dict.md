Manages a temporary testing directory structure and environment for testing ngtsc by feeding it
TypeScript code.

通过向其提供 TypeScript 代码来管理用于测试 ngtsc 的临时测试目录结构和环境。

Set up a new testing environment.

设置新的测试环境。

Installs a compiler host that allows for asynchronous reading of resources by implementing the
`CompilerHost.readResource` method. Note that only asynchronous compilations are affected, as
synchronous compilations do not use the asynchronous resource loader.

安装一个编译器宿主，该宿主通过实现 `CompilerHost.readResource`
方法来允许异步读取资源。请注意，只有异步编译会受到影响，因为同步编译不使用异步资源加载器。

Older versions of the CLI do not provide the `CompilerHost.getModifiedResourceFiles()` method.
This results in the `changedResources` set being `null`.

较旧版本的 CLI 不提供 `CompilerHost.getModifiedResourceFiles()` 方法。这导致 `changedResources`
设置为 `null`。

Run the compiler to completion, and assert that no errors occurred.

运行编译器以完成，并断言没有发生错误。

Run the compiler to completion, and return any `ts.Diagnostic` errors that may have occurred.

运行编译器以完成，并返回可能发生的任何 `ts.Diagnostic` 错误。
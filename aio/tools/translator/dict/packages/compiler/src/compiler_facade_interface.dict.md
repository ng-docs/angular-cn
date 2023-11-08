A set of interfaces which are shared between `@angular/core` and `@angular/compiler` to allow
for late binding of `@angular/compiler` for JIT purposes.

在 `@angular/core` 和 `@angular/compiler` 之间共享的一组接口，以允许出于 JIT 目的后期绑定
`@angular/compiler`。

This file has two copies. Please ensure that they are in sync:

此文件有两个副本。请确保它们是同步的：

packages/compiler/src/compiler_facade_interface.ts          \(main\)

package/compiler/src/compiler_facade_interface.ts（主）

packages/core/src/compiler/compiler_facade_interface.ts     \(replica\)

package/core/src/compiler/compiler_facade_interface.ts（副本）

Please ensure that the two files are in sync using this command:

请使用此命令确保这两个文件是同步的：
Search the file specified by `fileName` in the given `program` for a declaration that has the
name `name` and passes the `predicate` function.

在给定 `program` 中的 `fileName` 指定的文件中搜索名为 `name` 并传递 `predicate` 函数的声明。

An error will be thrown if there is not at least one AST node with the given `name` and passes
the `predicate` test.

如果不是至少一个具有给定 `name` 的 AST 节点并且通过了 `predicate` 测试，将抛出错误。

Walk the AST tree from the `rootNode` looking for a declaration that has the given `name`.

从 `rootNode` AST 树，寻找具有给定 `name` 的声明。

Extracted from TypeScript's internal enum `StructureIsReused`.

从 TypeScript 的内部枚举 `StructureIsReused` 中提取。
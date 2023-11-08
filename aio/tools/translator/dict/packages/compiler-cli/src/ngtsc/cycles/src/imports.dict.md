A cached graph of imports in the `ts.Program`.

`ts.Program` 中的缓存导入图。

The `ImportGraph` keeps track of dependencies \(imports\) of individual `ts.SourceFile`s. Only
dependencies within the same program are tracked; imports into packages on NPM are not.

`ImportGraph` 会跟踪单个 `ts.SourceFile` 的依赖项（导入）。仅跟踪同一程序中的依赖项；导入到 NPM
上的包中的则不是。

List the direct \(not transitive\) imports of a given `ts.SourceFile`.

列出给定 `ts.SourceFile` 的直接（不可传递）导入。

This operation is cached.

此操作被缓存。

the starting point of the path.

路径的起点。

the ending point of the path.

路径的终点。

an array of source files that connect the `start` and `end` source files, or `null` if
    no path could be found.

连接 `start` 和 `end` 源文件的源文件数组，如果找不到路径，则为 `null`。

Find an import path from the `start` SourceFile to the `end` SourceFile.

查找从 `start` SourceFile 到 `end` SourceFile 的导入路径。

This function implements a breadth first search that results in finding the
shortest path between the `start` and `end` points.

此函数实现了广度优先搜索，以查找 `start` 和 `end` 之间的最短路径。

Add a record of an import from `sf` to `imported`, that's not present in the original
`ts.Program` but will be remembered by the `ImportGraph`.

添加从 `sf` 到 enabled 的 `imported` 记录，该记录在原始 `ts.Program` 中不存在，但会被
`ImportGraph` 记住。

A helper class to track which SourceFiles are being processed when searching for a path in
`getPath()` above.

一个帮助器类，用于在上面的 `getPath()` 中搜索路径时跟踪正在处理的 SourceFiles。

Back track through this found SourceFile and its ancestors to generate an array of
SourceFiles that form am import path between two SourceFiles.

通过此找到的 SourceFile 及其祖先进行回溯，以生成一个 SourceFiles 数组，这些数组形成两个
SourceFile 之间的导入路径。
An implementation of the `DependencyTracker` dependency graph API.

`DependencyTracker` 依赖图 API 的实现。

The `FileDependencyGraph`'s primary job is to determine whether a given file has "logically"
changed, given the set of physical changes \(direct changes to files on disk\).

`FileDependencyGraph`
的主要工作是在给定物理更改集（直接更改磁盘上的文件）的情况下确定给定文件是否“逻辑上”更改。

A file is logically changed if at least one of three conditions is met:

如果至少满足三个条件之一，则文件在逻辑上被更改：

The file itself has physically changed.

文件本身已发生物理更改。

One of its dependencies has physically changed.

它的依赖项之一发生了物理变化。

One of its resource dependencies has physically changed.

其资源依赖项之一发生了物理变化。

Update the current dependency graph from a previous one, incorporating a set of physical
changes.

从以前的依赖图更新当前的依赖图，合并一组物理更改。

This method performs two tasks:

此方法会执行两个任务：

For files which have not logically changed, their dependencies from `previous` are added to
`this` graph.

对于逻辑上没有更改的文件，它们对 `previous` 的依赖项会添加 `this` 图中。

For files which have logically changed, they're added to a set of logically changed files
which is eventually returned.

对于逻辑上更改的文件，它们会被添加到最终返回的一组逻辑更改的文件中。

In essence, for build `n`, this method performs:

本质上，对于构建 `n`，此方法会执行：

where:

其中：

G\(n\) = the dependency graph of build `n`

G\(n\) = 构建 `n` 的依赖图

L\(n\) = the logically changed files from build n - 1 to build n.

L\(n\) = 从构建 n - 1 到构建 n 逻辑上更改的文件。

P\(n\) = the physically changed files from build n - 1 to build n.

P\(n\) = 从构建 n - 1 到构建 n 的物理更改的文件。

Determine whether `sf` has logically changed, given its dependencies and the set of physically
changed files and resources.

给定其依赖项以及物理更改的文件和资源集，确定 `sf` 是否在逻辑上发生了更改。
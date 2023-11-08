A path that's relative to the logical root of a TypeScript project \(one of the project's
rootDirs\).

相对于 TypeScript 项目的逻辑根（项目的 rootDirs 之一）的路径。

Paths in the type system use POSIX format.

类型系统中的路径使用 POSIX 格式。

A utility class which can translate absolute paths to source files into logical paths in
TypeScript's logical file system, based on the root directories of the project.

一个工具类，可以根据项目的根目录将源文件的绝对路径转换为 TypeScript 逻辑文件系统中的逻辑路径。

Get the logical path in the project of a `ts.SourceFile`.

获取 `ts.SourceFile` 项目中的逻辑路径。

This method is provided as a convenient alternative to calling
`logicalPathOfFile(absoluteFromSourceFile(sf))`.

提供此方法是作为调用 `logicalPathOfFile(absoluteFromSourceFile(sf))` 的便利替代方案。

A `LogicalProjectPath` to the source file, or `null` if the source file is not in any
of the TS project's root directories.

源文件的 `LogicalProjectPath`，如果源文件不在 TS 项目的任何根目录中，则为 `null`。

Get the logical path in the project of a source file.

获取源文件在项目中的逻辑路径。

Is the `path` a descendant of the `base`?
E.g. `foo/bar/zee` is within `foo/bar` but not within `foo/car`.

`path` 是 `base` 的后代吗？例如，`foo/bar/zee` 在 `foo/bar` 内，但不在 `foo/car` 内。
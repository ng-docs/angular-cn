Convert the path `path` to an `AbsoluteFsPath`, throwing an error if it's not an absolute path.

将路径 `path` 转换为 `AbsoluteFsPath`，如果不是绝对路径，则会抛出错误。

Extract an `AbsoluteFsPath` from a `ts.SourceFile`-like object.

从 `ts.SourceFile` 类对象中提取 `AbsoluteFsPath`。

Convert the path `path` to a `PathSegment`, throwing an error if it's not a relative path.

将路径 `path` 转换为 `PathSegment`，如果不是相对路径，则抛出错误。

Static access to `dirname`.

对 `dirname` 的静态访问。

Static access to `join`.

要 `join` 的静态访问。

Static access to `resolve`s.

对 `resolve` 的静态访问。

Returns true when the path provided is the root path.

当提供的路径是根路径时返回 true。

Static access to `isRooted`.

对 `isRooted` 的静态访问。

Static access to `relative`.

对 `relative` 的静态访问。

Static access to `basename`.

对 `basename` 的静态访问。

Returns true if the given path is locally relative.

如果给定的路径是本地相对的，则返回 true。

This is used to work out if the given path is relative \(i.e. not absolute\) but also is not
escaping the current directory.

这用于确定给定的路径是否是相对的（即不是绝对的），但也没有转义当前目录。

Converts a path to a form suitable for use as a relative module import specifier.

将路径转换为适合用作相对模块导入说明符的形式。

In other words it adds the `./` to the path if it is locally relative.

换句话说，如果 ./ 是本地相对的，则会将 `./` 添加到路径中。
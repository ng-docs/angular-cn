Gets all built Angular NPM package artifacts by querying the Bazel runfiles.
In case there is a runfiles manifest \(e.g. on Windows\), the packages are resolved
through the manifest because the runfiles are not symlinked and cannot be searched
within the real filesystem.

通过查询 Bazel 运行文件来获取所有构建的 Angular NPM 包工件。如果有 runfiles 清单（例如在 Windows
上），则包将通过清单解析，因为 runfiles 没有符号链接，并且无法在真实文件系统中搜索。

Resolves a file or directory from the Bazel runfiles.

从 Bazel 运行文件解析 NPM 包。
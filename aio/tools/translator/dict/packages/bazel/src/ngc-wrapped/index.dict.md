The one FileCache instance used in this process.

此过程中使用的一个 FileCache 实例。

Writes a collection of unused input files and directories which can be
consumed by bazel to avoid triggering rebuilds if only unused inputs are
changed.

写入未使用的输入文件和目录的集合，如果仅更改未使用的输入，bazel 可以使用这些文件和目录以避免触发重建。

See https://bazel.build/contribute/codebase#input-discovery

请参阅 https://bazel.build/contribute/codebase#input-discovery

Kept here just for compatibility with 1P tools. To be removed soon after 1P update.

保留在这里只是为了与 1P 工具兼容。将在 1P 更新后尽快删除。
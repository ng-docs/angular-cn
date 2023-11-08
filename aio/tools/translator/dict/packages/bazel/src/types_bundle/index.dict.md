Bundles the specified entry-point and writes the output `d.ts` bundle to the specified
output path. An optional license banner can be provided to be added to the bundle output.

打包指定的入口点并将输出 `d.ts`
包写入指定的输出路径。可以提供一个可选的许可证横幅以添加到包输出。

Strip the named AMD module for compatibility from Bazel-generated type
definitions. These may end up in the generated type bundles.

从 Bazel 生成的类型定义中剥离命名的 AMD 模块以实现兼容性。这些可能最终会出现在生成的类型包中。

e.g. `/// <amd-module name="@angular/localize/init" />` should be stripped.

例如 `/// <amd-module name="@angular/localize/init" />` 应该被剥离。

Handles logging messages from API extractor.

处理来自 API 提取器的日志消息。

Certain info messages should be omitted and other messages should be printed
to stderr to avoid worker protocol conflicts.

应省略某些信息消息，并应将其他消息打印到 stderr 以避免工作器协议冲突。

Runs one build using the specified build action command line arguments.

使用指定的构建操作命令行参数运行一个构建。
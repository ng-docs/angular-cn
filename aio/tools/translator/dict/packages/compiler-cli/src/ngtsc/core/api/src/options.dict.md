Non-public options which are useful during testing of the compiler.

在编译器测试期间有用的非公共选项。

Whether to use the CompilerHost's fileNameToModuleName utility \(if available\) to generate
import module specifiers. This is false by default, and exists to support running ngtsc
within Google. This option is internal and is used by the ng_module.bzl rule to switch
behavior between Bazel and Blaze.

是否使用 CompilerHost 的 fileNameToModuleName
实用程序（如果可用）来生成导入模块说明符。默认情况下，这是 false，并且存在以支持在 Google
中运行 ngtsc。此选项是内部的，由 ng_module.bzl 规则用于在 Bazel 和 Blaze 之间切换行为。

Enable the Language Service APIs for template type-checking for tests.

为测试的模板类型检查启用语言服务 API。

An option to enable ngtsc's internal performance tracing.

启用 ngtsc 的内部性能跟踪的选项。

This should be a path to a JSON file where trace information will be written. This is sensitive
to the compiler's working directory, and should likely be an absolute path.

这应该是将写入跟踪信息的 JSON 文件的路径。这对编译器的工作目录很敏感，应该是绝对路径。

This is currently not exposed to users as the trace format is still unstable.

这当前不会向用户公开，因为跟踪格式仍然不稳定。

Internal only options for compiler.

编译器的内部选项。

A merged interface of all of the various Angular compiler options, as well as the standard
`ts.CompilerOptions`.

所有各种 Angular 编译器选项以及标准 `ts.CompilerOptions` 的合并接口。

Also includes a few miscellaneous options.

还包括一些杂项选项。
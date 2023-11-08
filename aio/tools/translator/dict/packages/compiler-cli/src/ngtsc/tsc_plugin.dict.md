A `ts.CompilerHost` which also returns a list of input files, out of which the `ts.Program`
should be created.

一个 `ts.CompilerHost`，它还返回输入文件的列表，应该从中创建 `ts.Program`。

Currently mirrored from &commat;bazel/concatjs/internal/tsc_wrapped/plugin_api \(with the naming of
`fileNameToModuleName` corrected\).

当前从 &commat;bazel/concatjs/internal/tsc_wrapped/plugin_api 镜像（更正了 `fileNameToModuleName`
的命名）。

Mirrors the plugin interface from tsc_wrapped which is currently under active development. To
enable progress to be made in parallel, the upstream interface isn't implemented directly.
Instead, `TscPlugin` here is structurally assignable to what tsc_wrapped expects.

镜像当前正在积极开发的 tsc_wrapped
的插件接口。为了允许并行取得进展，不会直接实现上游接口。相反，这里的 `TscPlugin`
在结构上可以分配给 tsc_wrapped 所期望的。

A plugin for `tsc_wrapped` which allows Angular compilation from a plain `ts_library`.

`tsc_wrapped` 的插件，允许从普通的 `ts_library` 进行 Angular 编译。
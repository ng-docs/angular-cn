Return the real path of a symlink. This method is required in order to
resolve symlinks in node_modules.

返回符号链接的真实路径。为了解析 node_modules 中的符号链接，需要此方法。

readResource\(\) is an Angular-specific method for reading files that are not
managed by the TS compiler host, namely templates and stylesheets.
It is a method on ExtendedTsCompilerHost, see
packages/compiler-cli/src/ngtsc/core/api/src/interfaces.ts

readResource\(\) 是一种特定于 Angular 的方法，用于读取不由 TS
编译器宿主管理的文件，即模板和样式表。它是 ExtendedTsCompilerHost 上的一个方法，请参阅
packages/compiler-cli/src/ngtsc/core/api/src/interfaces.ts

Used to read configuration files.

用于读取配置文件。

A language service parse configuration host is independent of the adapter
because signatures of calls like `FileSystem#readFile` are a bit stricter
than those on the adapter.

语言服务解析配置宿主独立于适配器，因为 `FileSystem#readFile` 等调用的签名比适配器上的签名更严格。
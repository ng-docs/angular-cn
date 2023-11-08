Entrypoint to the Angular Compiler \(Ivy+\) which sits behind the `api.Program` interface, allowing
it to be a drop-in replacement for the legacy View Engine compiler to tooling such as the
command-line main\(\) function or the Angular CLI.

位于 `api.Program` 接口后面的 Angular 编译器 \(Ivy+\) 的入口点，允许它作为命令行 main\(\) 函数或
Angular CLI 等工具的旧版 View Engine 编译器的直接替代方案。

Ensure that the `NgCompiler` has properly analyzed the program, and allow for the asynchronous
loading of any resources during the process.

确保 `NgCompiler` 已正确分析程序，并允许在此过程中异步加载任何资源。

This is used by the Angular CLI to allow for spawning \(async\) child compilations for things
like SASS files used in `styleUrls`.

Angular CLI 用它来允许为 `styleUrls` 中使用的 SASS 文件等内容生成（异步）子编译。
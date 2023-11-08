This file introduces series of globally accessible debug tools
to allow for the Angular debugging story to function.

本文件介绍了一系列可全局访问的调试工具，以允许 Angular 调试故事发挥作用。

To see this in action run the following command:

要查看这一点，请运行以下命令：

bazel run //packages/core/test/bundling/todo:devserver

bazel 运行 //packages/core/test/bundling/todo:devserver

Then load `localhost:5432` and start using the console tools.

然后加载 `localhost:5432` 并开始使用控制台工具。

This value reflects the property on the window where the dev
tools are patched \(window.ng\).

此值反映了修补开发工具的 window（window.ng）上的属性。

Publishes a collection of default debug tools onto`window.ng`.

将默认调试工具的集合发布到 `window.ng` 上。

These functions are available globally when Angular is in development
mode and are automatically stripped away from prod mode is on.

当 Angular 处于开发模式时，这些函数在全局范围内可用，并会自动从 prod 模式打开中剥离。

Warning: this function is *INTERNAL* and should not be relied upon in application's code.
The contract of the function might be changed in any release and/or the function can be
removed completely.

警告：此函数是*INTERNAL*
，不应在应用程序代码中依赖。函数的契约可能会在任何版本中更改和/或可以完全删除该函数。

Publishes the given function to `window.ng` so that it can be
used from the browser console when an application is not in production.

将给定的函数发布到 `window.ng`，以便在应用程序不处于生产状态时可以从浏览器控制台使用它。
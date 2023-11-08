Background processing using web workers

用 Web Worker 处理后台进程

[Web workers](https://developer.mozilla.org/docs/Web/API/Web_Workers_API) lets you run CPU-intensive computations in a background thread, freeing the main thread to update the user interface.
Application's performing a lot of computations, like generating Computer-Aided Design \(CAD\) drawings or doing heavy geometric calculations, can use web workers to increase performance.

[Web Worker](https://developer.mozilla.org/docs/Web/API/Web_Workers_API)允许你在后台线程中运行 CPU 密集型计算，解放主线程以更新用户界面。如果你发现你的应用会进行很多计算，比如生成 CAD 图纸或进行繁重的几何计算，那么使用 Web Worker 可以帮助你提高应用的性能。

Adding a web worker

添加一个 Web Worker

To add a web worker to an existing project, use the Angular CLI `ng generate` command.

要把 Web Worker 添加到现有项目中，请使用 Angular CLI `ng generate` 命令。

You can add a web worker anywhere in your application.
For example, to add a web worker to the root component, `src/app/app.component.ts`, run the following command.

你可以在应用的任何位置添加 Web Worker。比如，要把一个 Web Worker 添加到根组件 `src/app/app.component.ts`，请运行如下命令。

The command performs the following actions.

该命令会执行以下操作。

Configures your project to use web workers, if it isn't already.

把你的项目配置为使用 Web Worker，如果还没有的话。

Adds the following scaffold code to `src/app/app.worker.ts` to  receive messages.

把如下脚手架代码添加到 `src/app/app.worker.ts` 以接收消息。

Adds the following scaffold code to `src/app/app.component.ts` to use the worker.

把如下脚手架代码添加到 `src/app/app.component.ts` 以使用这个 Worker。

After you create this initial scaffold, you must refactor your code to use the web worker by sending messages to and from the worker.

生成这个初始脚手架之后，你必须把代码重构成向这个 Worker 发送消息和从 Worker 接收消息，以便使用 Web Worker。
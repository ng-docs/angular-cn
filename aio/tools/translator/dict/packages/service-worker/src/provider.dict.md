Token that can be used to provide options for `ServiceWorkerModule` outside of
`ServiceWorkerModule.register()`.

可用于在 `ServiceWorkerModule.register()` 之外为 `ServiceWorkerModule` 提供选项的标记。

You can use this token to define a provider that generates the registration options at runtime,
for example via a function call:

你可以用此标记来定义一个在运行时生成注册选项的提供者，例如通过函数调用：

{&commat;example service-worker/registration-options/module.ts region="registration-options"
    header="app.module.ts"}



Whether the ServiceWorker will be registered and the related services \(such as `SwPush` and
`SwUpdate`\) will attempt to communicate and interact with it.

ServiceWorker 是否将被注册，并且相关服务（例如 `SwPush` 和 `SwUpdate` ）将尝试与它进行通信和交互。

Default: true

默认值：true

A URL that defines the ServiceWorker's registration scope; that is, what range of URLs it can
control. It will be used when calling
[ServiceWorkerContainer#register\(\)](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register).

定义 ServiceWorker 的注册范围的 URL；也就是说，它可以控制的 URL 范围。调用[ServiceWorkerContainer#register\(\)](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register)时将使用它。

Defines the ServiceWorker registration strategy, which determines when it will be registered
with the browser.

定义 ServiceWorker 注册策略，该策略确定它将何时注册到浏览器。

The default behavior of registering once the application stabilizes \(i.e. as soon as there are
no pending micro- and macro-tasks\) is designed to register the ServiceWorker as soon as
possible but without affecting the application's first time load.

应用程序稳定后注册的默认行为（即一旦没有挂起的微任务和宏任务）旨在尽快注册 ServiceWorker，但不影响应用程序的首次加载。

Still, there might be cases where you want more control over when the ServiceWorker is
registered \(for example, there might be a long-running timeout or polling interval, preventing
the app from stabilizing\). The available option are:

不过，在某些情况下，你可能希望对 ServiceWorker 的注册时间进行更多控制（例如，可能会有长时间运行的超时或轮询间隔，以防止应用程序稳定）。可用的选项是：

`registerWhenStable:<timeout>`: Register as soon as the application stabilizes \(no pending
  micro-/macro-tasks\) but no later than `<timeout>` milliseconds. If the app hasn't
  stabilized after `<timeout>` milliseconds \(for example, due to a recurrent asynchronous
  task\), the ServiceWorker will be registered anyway.
  If `<timeout>` is omitted, the ServiceWorker will only be registered once the app
  stabilizes.

`registerWhenStable:<timeout>`：一旦应用程序稳定（没有挂起的微/宏任务）后注册，但不迟于 `<timeout>` 毫秒。如果应用程序在 `<timeout>` 毫秒后尚未稳定（例如，由于经常出现的异步任务），则 ServiceWorker 无论如何都会被注册。如果省略 `<timeout>`，则 ServiceWorker 将仅在应用稳定后才会注册。

`registerImmediately`: Register immediately.

`registerImmediately`：立即注册。

`registerWithDelay:<timeout>`: Register with a delay of `<timeout>` milliseconds. For
  example, use `registerWithDelay:5000` to register the ServiceWorker after 5 seconds. If
  `<timeout>` is omitted, is defaults to `0`, which will register the ServiceWorker as soon
  as possible but still asynchronously, once all pending micro-tasks are completed.

`registerWithDelay:<timeout>`：使用 `<timeout>` 毫秒的延迟进行注册。例如，使用 `registerWithDelay:5000` 在 5 秒后注册 ServiceWorker。如果省略 `<timeout>`，则默认为 `0`，一旦所有挂起的微任务完成，它将尽快注册 ServiceWorker，但仍然是异步的。

An [Observable](guide/observables) factory function: A function that returns an `Observable`.
  The function will be used at runtime to obtain and subscribe to the `Observable` and the
  ServiceWorker will be registered as soon as the first value is emitted.

[Observable](guide/observables)工厂函数：返回 `Observable` 的函数。该函数将在运行时用于获取和订阅 `Observable`，并且一旦发出第一个值，ServiceWorker 就会被注册。

Default: 'registerWhenStable:30000'

默认值：“registerWhenStable:30000”
Unwraps a value from an asynchronous primitive.

从一个异步回执中解出一个值。

The `async` pipe subscribes to an `Observable` or `Promise` and returns the latest value it has
emitted. When a new value is emitted, the `async` pipe marks the component to be checked for
changes. When the component gets destroyed, the `async` pipe unsubscribes automatically to avoid
potential memory leaks. When the reference of the expression changes, the `async` pipe
automatically unsubscribes from the old `Observable` or `Promise` and subscribes to the new one.

`async` 管道会订阅一个 `Observable` 或 `Promise`，并返回它发出的最近一个值。
当新值到来时，`async` 管道就会把该组件标记为需要进行变更检测。当组件被销毁时，`async`
管道就会自动取消订阅，以消除潜在的内存泄露问题。

Examples

例子

This example binds a `Promise` to the view. Clicking the `Resolve` button resolves the
promise.

这个例子把一个 `Promise` 绑定到了视图中。点击 `Resolve` 按钮就会解析此 Promise。

{&commat;example common/pipes/ts/async_pipe.ts region='AsyncPipePromise'}



It's also possible to use `async` with Observables. The example below binds the `time` Observable
to the view. The Observable continuously updates the view with the current time.

还可以把 `async` 用于 `Observable`。下面的例子就把 `time` 这个 `Observable` 绑定到了视图上。这个
`Observable` 会不断使用当前时间更新视图。

{&commat;example common/pipes/ts/async_pipe.ts region='AsyncPipeObservable'}
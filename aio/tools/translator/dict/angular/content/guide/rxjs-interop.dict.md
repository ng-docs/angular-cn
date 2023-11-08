RxJS Interop

RxJS 互操作

Angular's `@angular/core/rxjs-interop` package which provides useful utilities to integrate [Angular Signals](/guide/signals) with RxJS Observables.

Angular 的 `@angular/core/rxjs-interop` 包，它提供了有用的实用程序来将 [Angular 信号（Signal）](/guide/signals) 与 RxJS 可观察对象（Observable）集成起来。

The `toSignal` function creates a signal which tracks the value of an Observable. It behaves similarly to the `async` pipe in templates, but is more flexible and can be used anywhere in an application.

`toSignal` 函数创建一个跟踪 Observable 值的信号。它的行为类似于模板中的 `async` 管道，但更灵活，可以在应用程序的任何地方使用。

Like the `async` pipe, `toSignal` subscribes to the Observable immediately, which may trigger side effects. The subscription created by
`toSignal` automatically unsubscribes from the given Observable upon destruction of the the component in which `toSignal` is called.

与 `async` 管道一样，`toSignal` 会立即订阅 Observable，这可能会引发副作用。`toSignal` 创建的订阅会在销毁调用 `toSignal` 的组件时自动取消对给定 Observable 的订阅。

Initial values

初始值

Observables may not produce a value synchronously on subscription, but signals always require a current value. There are several ways to deal with this "initial" value of `toSignal` signals.

Observable 可能不会在订阅时同步产生一个值，但信号总是需要一个当前值。有几种方法可以处理 `toSignal` 信号的这个“初始”值。

The `initialValue` option

`initialValue` 选项

As in the example above, the `initialValue` option specifies the value the signal should return before the Observable emits for the first time.

如上例所示，`initialValue` 选项指定信号在 Observable 首次发射之前应返回的值。

`undefined` initial values

`undefined` 初始值

If `initialValue` is omitted, the signal returned by `toSignal` returns `undefined` until the Observable emits. This is similar to the `async` pipe's behavior of returning `null`.

如果省略了 `initialValue`，则 `toSignal` 返回的信号将返回 `undefined` 直到 Observable 发出为止。这类似于 `async` 管道返回 `null` 的行为。

The `requireSync` option

`requireSync` 选项

Some Observables are known to emit synchronously, such as `BehaviorSubject`. In those cases, you can specify the `requireSync: true` option.

已知一些 Observable 是同步发出的，例如 `BehaviorSubject`。在这些情况下，你可以指定 `requireSync: true` 选项。

When `requiredSync` is `true`, `toSignal` enforces that the Observable emits synchronously on subscription. This guarantees that the signal always has a value, and no `undefined` type or initial value is required.

当 `requiredSync` 为 `true` 时，`toSignal` 强制 Observable 在订阅时同步发出值。这保证了信号总是有一个值，并且不需要用 `undefined` 类型或初始值。

By default, `toSignal` automatically unsubscribes from the Observable upon destruction of the context in which it's created. For example, if `toSignal` is called during creation of a component, it cleans up its subscription when the component is destroyed.

默认情况下，`toSignal` 在创建它的上下文被销毁时自动取消订阅 Observable。例如，如果在组件创建期间调用 `toSignal`，它会在组件销毁时清除其订阅。

The `manualCleanup` option disables this automatic cleanup. You can use this setting for Observables that complete themselves naturally.

`manualCleanup` 选项会禁用此自动清理。你可以将此设置用于会自然结束的 Observable。

Error and Completion

出错与结束

If an Observable used in `toSignal` produces an error, that error is thrown when the signal is read.

如果在 `toSignal` 中使用的 Observable 产生了错误，则在读取信号时就会抛出该错误。

If an Observable used in `toSignal` completes, the signal continues to return the most recently emitted value before completion.

如果 `toSignal` 中使用的 Observable 结束了，则信号会继续返回结束前最近发出的值。

The `toObservable` utility creates an `Observable` which tracks the value of a signal. The signal's value is monitored with an `effect`, which emits the value to the Observable when it changes.

`toObservable` 实用程序会创建一个跟踪信号值的 `Observable`。信号的值由一个 `effect` 监控，它会在值发生变化时将值发送给 Observable。

As the `query` signal changes, the `query$` Observable emits the latest query and triggers a new HTTP request.

随着 `query` 信号的变化，`query$` Observable 发出最新的查询并触发一个新的 HTTP 请求。

Injection context

注入上下文

`toObservable` by default needs to run in an injection context, such as during construction of a component or service. If an injection context is not available, an `Injector` can instead be explicitly specified.

`toObservable` 默认情况下需要在注入上下文中运行，例如在构建组件或服务期间。如果注入上下文不可用，则可以显式指定 `Injector`。

Timing of `toObservable`

`toObservable` 的时序

`toObservable` uses an effect to track the value of the signal in a `ReplaySubject`. On subscription, the first value \(if available\) may be emitted synchronously, and all subsequent values will be asynchronous.

`toObservable` 使用 `effect` 来跟踪 `ReplaySubject` 中的信号值。在订阅时，第一个值（如果可用）可以同步发出，所有后续值都将是异步的。

Unlike Observables, signals never provide a synchronous notification of changes. Even if your code updates a signal's value multiple times, effects which depend on its value run only after the signal has "settled".

与 Observable 不同，信号从来不会提供同步的变化通知。即使你的代码多次更新信号值，依赖于信号值的 `effect` 也只会在信号“稳定”后运行。

Here, only the last value \(3\) will be logged.

在这里，只会记录最后一个值（3）。
Options for `toObservable`.

`toObservable` 的选项。

The `Injector` to use when creating the underlying `effect` which watches the signal.

创建监视信号的底层 `effect` 时使用的 `Injector`。

If this isn't specified, the current injection context will be used.

如果未指定，将使用当前注入上下文。

Exposes the value of an Angular `Signal` as an RxJS `Observable`.

将 Angular `Signal` 的值公开为 RxJS `Observable`。

The signal's value will be propagated into the `Observable`'s subscribers using an `effect`.

信号的值将使用 `effect` 传播到 `Observable` 的订阅者中。

`toObservable` must be called in an injection context unless an injector is provided via options.

除非通过选项提供注入器，否则必须在注入上下文中调用 `toObservable`。
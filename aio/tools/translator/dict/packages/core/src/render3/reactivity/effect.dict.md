An effect can, optionally, register a cleanup function. If registered, the cleanup is executed
before the next effect run. The cleanup function makes it possible to "cancel" any work that the
previous effect run might have started.

一个效果可以选择注册一个清理函数。如果已注册，则在下一次效果运行之前执行清理。清理功能可以“取消”之前效果运行可能已经开始的任何工作。

A callback passed to the effect function that makes it possible to register cleanup logic.

传递给效果函数的回调使注册清理逻辑成为可能。

Tracks all effects registered within a given application and runs them via `flush`.

跟踪在给定应用程序中注册的所有效果并通过 `flush` 运行它们。

A global reactive effect, which can be manually destroyed.

全局反应效果，可以手动销毁。

Shut down the effect, removing it from any upcoming scheduled executions.

关闭效果，将其从任何即将到来的预定执行中移除。

Options passed to the `effect` function.

传递给 `effect` 函数的选项。

The `Injector` in which to create the effect.

在其中创建效果的 `Injector`。

If this is not provided, the current injection context will be used instead \(via `inject`\).

如果未提供，则将使用当前注入上下文（通过 `inject` ）。

Whether the `effect` should require manual cleanup.

`effect` 是否需要手动清理。

If this is `false` \(the default\) the effect will automatically register itself to be cleaned up
with the current `DestroyRef`.

如果这是 `false` （默认值），效果将自动注册自己以使用当前的 `DestroyRef` 进行清理。

Whether the `effect` should allow writing to signals.

`effect` 是否应该允许写入信号。

Using effects to synchronize data by writing to signals can lead to confusing and potentially
incorrect behavior, and should be enabled only when necessary.

使用效果器通过写入信号来同步数据可能会导致混乱和潜在的不正确行为，应仅在必要时启用。

Create a global `Effect` for the given reactive function.

为给定的反应函数创建一个全局 `Effect`。
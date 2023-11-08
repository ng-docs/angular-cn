Serializable performance data for the compilation, using string names.

使用字符串名称的编译的可序列化性能数据。

A `PerfRecorder` that actively tracks performance statistics.

主动跟踪性能统计信息的 `PerfRecorder`。

Creates an `ActivePerfRecorder` with its zero point set to the current time.

创建一个 `ActivePerfRecoder`，其零点设置为当前时间。

Return the current performance metrics as a serializable object.

将当前性能度量作为可序列化对象返回。

A `PerfRecorder` that delegates to a target `PerfRecorder` which can be updated later.

委托给目标 `PerfRecorder` 的 `PerfRecorder`，可以在以后更新。

`DelegatingPerfRecorder` is useful when a compiler class that needs a `PerfRecorder` can outlive
the current compilation. This is true for most compiler classes as resource-only changes reuse
the same `NgCompiler` for a new compilation.

当需要 `PerfRecorder` 的编译器类可以比当前编译寿命长时，`DelegatingPerfRecorder`
会很有用。对于大多数编译器类来说都是如此，因为仅资源的更改会重用同一个 `NgCompiler`
进行新的编译。
Profiler events is an enum used by the profiler to distinguish between different calls of user
code invoked throughout the application lifecycle.

环境分析器事件是分析器用来区分在整个应用程序生命周期中调用的用户代码的不同调用的枚举。

Corresponds to the point in time before the runtime has called the template function of a
component with `RenderFlags.Create`.

对应于运行时使用 `RenderFlags.Create` 调用组件的模板函数之前的时间点。

Corresponds to the point in time after the runtime has called the template function of a
component with `RenderFlags.Create`.

对应于运行时使用 `RenderFlags.Create` 调用组件的模板函数之后的时间点。

Corresponds to the point in time before the runtime has called the template function of a
component with `RenderFlags.Update`.

对应于运行时使用 `RenderFlags.Update` 调用组件的模板函数之前的时间点。

Corresponds to the point in time after the runtime has called the template function of a
component with `RenderFlags.Update`.

对应于运行时使用 `RenderFlags.Update` 调用组件的模板函数之后的时间点。

Corresponds to the point in time before the runtime has called a lifecycle hook of a component
or directive.

对应于运行时调用组件或指令的生命周期钩子之前的时间点。

Corresponds to the point in time after the runtime has called a lifecycle hook of a component
or directive.

对应于运行时调用组件或指令的生命周期钩子之后的时间点。

Corresponds to the point in time before the runtime has evaluated an expression associated with
an event or an output.

对应于运行时估算与事件或输出关联的表达式之前的时间点。

Corresponds to the point in time after the runtime has evaluated an expression associated with
an event or an output.

对应于运行时已估算与事件或输出关联的表达式之后的时间点。

Profiler function which the runtime will invoke before and after user code.

运行时将在用户代码之前和之后调用的分析器函数。

function provided by the caller or null value to disable profiling.

调用者提供的函数或 null 值以禁用分析。

Sets the callback function which will be invoked before and after performing certain actions at
runtime \(for example, before and after running change detection\).

设置将在运行时执行某些操作（例如，运行变更检测之前和之后）之前和之后调用的回调函数。

Warning: this function is *INTERNAL* and should not be relied upon in application's code.
The contract of the function might be changed in any release and/or the function can be removed
completely.

警告：此函数是*INTERNAL*
，不应在应用程序代码中依赖。函数的契约可能会在任何版本中更改和/或可以完全删除该函数。

ProfilerEvent corresponding to the execution context

与执行上下文对应的 ProfilerEvent

component instance

组件实例

lifecycle hook function or output listener. The value depends on the
 execution context

生命周期钩子函数或输出侦听器。该值取决于执行上下文

Profiler function which wraps user code executed by the runtime.

包装运行时执行的用户代码的分析器函数。
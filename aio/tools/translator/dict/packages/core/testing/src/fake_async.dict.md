Clears out the shared fake async zone for a test.
To be called in a global `beforeEach`.

清除共享的伪异步 Zone 以进行测试。在全局 `beforeEach` 中调用。

The function that you want to wrap in the `fakeAsync` zone.

要包装在 `fakeAsync` 区域中的函数。

Example

范例

{&commat;example core/testing/ts/fake_async.ts region='basic'}



The function wrapped to be executed in the `fakeAsync` zone.
Any arguments passed when calling this returned function will be passed through to the `fn`
function in the parameters when it is called.

包装在 `fakeAsync` 区域中执行的函数。调用此返回函数时传递的任何参数都将在调用时传递给参数中的 `fn` 函数。

Wraps a function to be executed in the `fakeAsync` zone:

包装一个函数，以便在 `fakeAsync` Zone 中执行：

Microtasks are manually executed by calling `flushMicrotasks()`.

通过调用 `flushMicrotasks()` 手动执行微任务，。

Timers are synchronous; `tick()` simulates the asynchronous passage of time.

计时器是同步的，用 `tick()` 模拟异步时间的流逝。

If there are any pending timers at the end of the function, an exception is thrown.

如果函数末尾有任何待处理的计时器，则将引发异常。

Can be used to wrap `inject()` calls.

可用于包装 `inject()` 调用。

The number of milliseconds to advance the virtual timer.

可选值。默认值为 `0`。

The options to pass to the `tick()` function.

传给 `tick()` 函数的选项。

The `tick()` option is a flag called `processNewMacroTasksSynchronously`,
which determines whether or not to invoke new macroTasks.

`tick()` 选项是一个名为 `processNewMacroTasksSynchronously` 的标志，它确定是否调用新的 MacroTasks。

If you provide a `tickOptions` object, but do not specify a
`processNewMacroTasksSynchronously` property \(`tick(100, {})`\),
then `processNewMacroTasksSynchronously` defaults to true.

如果你提供了 `tickOptions` 对象，但未指定 `processNewMacroTasksSynchronously` 属性 \( `tick(100, {})` \)，则 `processNewMacroTasksSynchronously` 默认为 true。

If you omit the `tickOptions` parameter \(`tick(100))`\), then
`tickOptions` defaults to `{processNewMacroTasksSynchronously: true}`.

如果你省略了 `tickOptions` 参数 \( `tick(100))` \)，则 `tickOptions` 默认为 `{processNewMacroTasksSynchronously: true}`。

The following example includes a nested timeout \(new macroTask\), and
the `tickOptions` parameter is allowed to default. In this case,
`processNewMacroTasksSynchronously` defaults to true, and the nested
function is executed on each tick.

下面的示例包含一个嵌套超时（新的 macroTask），并且 `tickOptions` 参数允许默认。在这种情况下，`processNewMacroTasksSynchronously` 默认为 true，嵌套函数在每个 tick 上执行。

In the following case, `processNewMacroTasksSynchronously` is explicitly
set to false, so the nested timeout function is not invoked.

在以下情况下，`processNewMacroTasksSynchronously` 显式设置为 false，因此不会调用嵌套超时函数。

Simulates the asynchronous passage of time for the timers in the `fakeAsync` zone.

为 fakeAsync Zone 中的计时器模拟异步时间流逝。

The microtasks queue is drained at the very start of this function and after any timer callback
has been executed.

在此函数开始时以及执行任何计时器回调之后，微任务队列就会耗尽。

The maximum number of times the scheduler attempts to clear its queue before
    throwing an error.

可选值。默认值为 `undefined`。

The simulated time elapsed, in milliseconds.

经过的模拟时间，以毫秒为单位。

Flushes any pending microtasks and simulates the asynchronous passage of time for the timers in
the `fakeAsync` zone by
draining the macrotask queue until it is empty.

通过清空宏任务队列直到其为空，来为 fakeAsync Zone 中的计时器模拟异步时间流逝。返回的值是本应经过的毫秒数。

Discard all remaining periodic tasks.

丢弃所有剩余的定期任务。

Flush any pending microtasks.

刷新所有未完成的微任务。
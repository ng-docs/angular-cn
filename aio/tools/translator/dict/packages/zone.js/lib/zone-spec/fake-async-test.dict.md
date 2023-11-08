Clears out the shared fake async zone for a test.
To be called in a global `beforeEach`.

清除共享的假异步区域以进行测试。在全局 `beforeEach` 中调用。

The function wrapped to be executed in the fakeAsync zone

要在 fakeAsync 区域中执行的包装函数

Wraps a function to be executed in the fakeAsync zone:

包装要在 fakeAsync 区域中执行的函数：

microtasks are manually executed by calling `flushMicrotasks()`,

微任务是通过调用 `flushMicrotasks()` 手动执行的，

timers are synchronous, `tick()` simulates the asynchronous passage of time.

定时器是同步的，`tick()` 模拟时间的异步流逝。

If there are any pending timers at the end of the function, an exception will be thrown.

如果函数结束时有任何挂起的计时器，将抛出异常。

Can be used to wrap inject\(\) calls.

可用于包装 injection\(\) 调用。

Example

例子

{&commat;example core/testing/ts/fake_async.ts region='basic'}



Simulates the asynchronous passage of time for the timers in the fakeAsync zone.

模拟 falseAsync 区域中的计时器的异步时间流逝。

The microtasks queue is drained at the very start of this function and after any timer callback
has been executed.

在此函数的一开始以及执行任何计时器回调之后，微任务队列会被耗尽。

The simulated time elapsed, in millis.

经过的模拟时间，以毫秒为单位。

Simulates the asynchronous passage of time for the timers in the fakeAsync zone by
draining the macrotask queue until it is empty. The returned value is the milliseconds
of time that would have been elapsed.

通过排空宏任务队列直到它为空来模拟 falseAsync
区域中的计时器的异步时间流逝。返回的值是本会经过的毫秒数。

Discard all remaining periodic tasks.

丢弃所有剩余的定期任务。

Flush any pending microtasks.

刷新任何挂起的微任务。
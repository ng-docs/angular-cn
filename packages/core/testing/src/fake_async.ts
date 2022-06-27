/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const _Zone: any = typeof Zone !== 'undefined' ? Zone : null;
const fakeAsyncTestModule = _Zone && _Zone[_Zone.__symbol__('fakeAsyncTest')];

const fakeAsyncTestModuleNotLoadedErrorMessage =
    `zone-testing.js is needed for the fakeAsync() test helper but could not be found.
        Please make sure that your environment includes zone.js/testing`;

/**
 * Clears out the shared fake async zone for a test.
 * To be called in a global `beforeEach`.
 *
 * 清除共享的伪异步 Zone 以进行测试。在全局 `beforeEach` 中调用。
 *
 * @publicApi
 */
export function resetFakeAsyncZone(): void {
  if (fakeAsyncTestModule) {
    return fakeAsyncTestModule.resetFakeAsyncZone();
  }
  throw new Error(fakeAsyncTestModuleNotLoadedErrorMessage);
}

/**
 * Wraps a function to be executed in the `fakeAsync` zone:
 *
 * 包装一个函数，以便在 `fakeAsync` Zone 中执行：
 *
 * - Microtasks are manually executed by calling `flushMicrotasks()`,
 *
 *   通过调用 `flushMicrotasks()` 手动执行微任务，
 *
 * - Timers are synchronous, `tick()` simulates the asynchronous passage of time.
 *
 *   计时器是同步的，用 `tick()` 模拟异步时间的流逝。
 *
 * If there are any pending timers at the end of the function, an exception is thrown.
 *
 * 如果函数末尾有任何待处理的计时器，则将引发异常。
 *
 * Can be used to wrap `inject()` calls.
 *
 * @param fn The function that you want to wrap in the `fakeAysnc` zone.
 *
 * 可用于包装 inject() 调用。
 *
 * @usageNotes
 *
 * ### Example
 *
 * ### 例子
 *
 * {@example core/testing/ts/fake_async.ts region='basic'}
 *
 *
 * @returns The function wrapped to be executed in the `fakeAsync` zone.
 * Any arguments passed when calling this returned function will be passed through to the `fn`
 * function in the parameters when it is called.
 *
 * 要包装为在 fakeAsync Zone 中执行的函数
 *
 * @publicApi
 */
export function fakeAsync(fn: Function): (...args: any[]) => any {
  if (fakeAsyncTestModule) {
    return fakeAsyncTestModule.fakeAsync(fn);
  }
  throw new Error(fakeAsyncTestModuleNotLoadedErrorMessage);
}

/**
 * Simulates the asynchronous passage of time for the timers in the `fakeAsync` zone.
 *
 * 为 fakeAsync Zone 中的计时器模拟异步时间流逝。
 *
 * The microtasks queue is drained at the very start of this function and after any timer callback
 * has been executed.
 *
 * 在此函数开始时以及执行任何计时器回调之后，微任务队列就会耗尽。
 *
 * @param millis The number of milliseconds to advance the virtual timer.
 * @param tickOptions The options to pass to the `tick()` function.
 *
 * @usageNotes
 *
 * The `tick()` option is a flag called `processNewMacroTasksSynchronously`,
 * which determines whether or not to invoke new macroTasks.
 *
 * If you provide a `tickOptions` object, but do not specify a
 * `processNewMacroTasksSynchronously` property (`tick(100, {})`),
 * then `processNewMacroTasksSynchronously` defaults to true.
 *
 * If you omit the `tickOptions` parameter (`tick(100))`), then
 * `tickOptions` defaults to `{processNewMacroTasksSynchronously: true}`.
 *
 * ### Example
 *
 * ### 例子
 *
 * {@example core/testing/ts/fake_async.ts region='basic'}
 *
 * The following example includes a nested timeout (new macroTask), and
 * the `tickOptions` parameter is allowed to default. In this case,
 * `processNewMacroTasksSynchronously` defaults to true, and the nested
 * function is executed on each tick.
 *
 * ```
 * it ('test with nested setTimeout', fakeAsync(() => {
 *   let nestedTimeoutInvoked = false;
 *   function funcWithNestedTimeout() {
 *     setTimeout(() => {
 *       nestedTimeoutInvoked = true;
 *     });
 *   };
 *   setTimeout(funcWithNestedTimeout);
 *   tick();
 *   expect(nestedTimeoutInvoked).toBe(true);
 * }));
 * ```
 *
 * In the following case, `processNewMacroTasksSynchronously` is explicitly
 * set to false, so the nested timeout function is not invoked.
 *
 * ```
 * it ('test with nested setTimeout', fakeAsync(() => {
 *   let nestedTimeoutInvoked = false;
 *   function funcWithNestedTimeout() {
 *     setTimeout(() => {
 *       nestedTimeoutInvoked = true;
 *     });
 *   };
 *   setTimeout(funcWithNestedTimeout);
 *   tick(0, {processNewMacroTasksSynchronously: false});
 *   expect(nestedTimeoutInvoked).toBe(false);
 * }));
 * ```
 *
 *
 * @publicApi
 */
export function tick(
    millis: number = 0, tickOptions: {processNewMacroTasksSynchronously: boolean} = {
      processNewMacroTasksSynchronously: true
    }): void {
  if (fakeAsyncTestModule) {
    return fakeAsyncTestModule.tick(millis, tickOptions);
  }
  throw new Error(fakeAsyncTestModuleNotLoadedErrorMessage);
}

/**
 * Flushes any pending microtasks and simulates the asynchronous passage of time for the timers in
 * the `fakeAsync` zone by
 * draining the macrotask queue until it is empty.
 *
 * 通过清空宏任务队列直到其为空，来为 fakeAsync Zone
 * 中的计时器模拟异步时间流逝。返回的值是本应经过的毫秒数。
 *
 * @param maxTurns The maximum number of times the scheduler attempts to clear its queue before
 *     throwing an error.
 * @returns The simulated time elapsed, in milliseconds.
 *
 * 已流逝的模拟时间（以毫秒为单位）。
 *
 * @publicApi
 */
export function flush(maxTurns?: number): number {
  if (fakeAsyncTestModule) {
    return fakeAsyncTestModule.flush(maxTurns);
  }
  throw new Error(fakeAsyncTestModuleNotLoadedErrorMessage);
}

/**
 * Discard all remaining periodic tasks.
 *
 * 丢弃所有剩余的定期任务。
 *
 * @publicApi
 */
export function discardPeriodicTasks(): void {
  if (fakeAsyncTestModule) {
    return fakeAsyncTestModule.discardPeriodicTasks();
  }
  throw new Error(fakeAsyncTestModuleNotLoadedErrorMessage);
}

/**
 * Flush any pending microtasks.
 *
 * 刷新所有未完成的微任务。
 *
 * @publicApi
 */
export function flushMicrotasks(): void {
  if (fakeAsyncTestModule) {
    return fakeAsyncTestModule.flushMicrotasks();
  }
  throw new Error(fakeAsyncTestModuleNotLoadedErrorMessage);
}

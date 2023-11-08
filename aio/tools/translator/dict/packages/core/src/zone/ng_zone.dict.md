Example

例子

An injectable service for executing work inside or outside of the Angular zone.

一种用于在 Angular Zone 内部或外部执行任务的可注入服务。

The most common use of this service is to optimize performance when starting a work consisting of
one or more asynchronous tasks that don't require UI updates or error handling to be handled by
Angular. Such tasks can be kicked off via {&commat;link #runOutsideAngular} and if needed, these tasks
can reenter the Angular zone via {&commat;link #run}.

此服务最常见的用途是在启动包含一个或多个不需要 Angular 处理的 UI
更新或错误处理的异步任务的工作时优化性能。可以通过 {&commat;link #runOutsideAngular}
启动此类任务，如果需要，这些任务可以通过 {&commat;link #run} 重新进入 Angular zone。

Whether there are no outstanding microtasks or macrotasks.

是否没有未解决的微任务或宏任务。

Notifies when code enters Angular Zone. This gets fired first on VM Turn.

在代码进入 “Angular Zone ” 时通知。这首先在 VM 周期中触发。

Notifies when there is no more microtasks enqueued in the current VM Turn.
This is a hint for Angular to do change detection, which may enqueue more microtasks.
For this reason this event can fire multiple times per VM Turn.

在当前的 VM Turn 中没有更多微任务排队时通知。这是 Angular
进行变更检测的提示，它可能会排队更多的微任务。因此，此事件可在每次 VM 周期中触发多次。

Notifies when the last `onMicrotaskEmpty` has run and there are no more microtasks, which
implies we are about to relinquish VM turn.
This event gets called just once.

在最后一个 `onMicrotaskEmpty` 已运行并且没有更多微任务时通知，这意味着我们将放弃 VM
周期。该事件只会被调用一次。

Notifies that an error has been delivered.

通知已传递的错误。

Executes the `fn` function synchronously within the Angular zone and returns value returned by
the function.

在 Angular Zone 内同步执行的 `fn` 函数，并返回该函数返回的值。

Running functions via `run` allows you to reenter Angular zone from a task that was executed
outside of the Angular zone \(typically started via {&commat;link #runOutsideAngular}\).

通过 `run` 运行的函数可让你从在 Angular Zone 之外执行的任务（通常通过 {&commat;link #runOutsideAngular} 启动）重新进入 Angular Zone。

Any future tasks or microtasks scheduled from within this function will continue executing from
within the Angular zone.

在此功能内计划的任何将来的任务或微任务都将在 Angular Zone 内继续执行。

If a synchronous error happens it will be rethrown and not reported via `onError`.

如果发生同步错误，它将被重新抛出，并且不会通过 `onError` 报告。

Executes the `fn` function synchronously within the Angular zone as a task and returns value
returned by the function.

作为任务在 Angular Zone 中同步执行 `fn` 函数，并返回该函数返回的值。

Same as `run`, except that synchronous errors are caught and forwarded via `onError` and not
rethrown.

与 `run` 相同，但同步错误是通过 `onError` 捕获并转发的，而不是重新抛出。

Executes the `fn` function synchronously in Angular's parent zone and returns value returned by
the function.

在 Angular 的父 Zone 中同步执行 `fn` 函数，并返回该函数返回的值。

Running functions via {&commat;link #runOutsideAngular} allows you to escape Angular's zone and do
work that
doesn't trigger Angular change-detection or is subject to Angular's error handling.

通过 {&commat;link #runOutsideAngular} 运行函数可让你离开 Angular 的 Zone 并执行不会触发 Angular
变更检测或受 Angular 错误处理控制的工作。

Any future tasks or microtasks scheduled from within this function will continue executing from
outside of the Angular zone.

从此函数中计划的任何将来的任务或微任务将在 Angular Zone 之外继续执行。

Use {&commat;link #run} to reenter the Angular zone and do work that updates the application model.

使用 {&commat;link #run} 重新进入 Angular Zone 并执行更新应用程序模型的工作。

A flag to indicate if NgZone is currently inside
checkStable and to prevent re-entry. The flag is
needed because it is possible to invoke the change
detection from within change detection leading to
incorrect behavior.

一个标志，用于表明 NgZone 当前是否在 checkStable
中并防止重新进入。需要该标志，因为有可能从变更检测中调用变更检测导致不正确的行为。

For detail, please refer here,
https://github.com/angular/angular/pull/40540

有关详细信息，请参阅这里，https://github.com/angular/angular/pull/40540

Optionally specify coalescing event change detections or not.
Consider the following case.

（可选）指定或不指定合并事件变更检测。考虑以下情况。

When button is clicked, because of the event bubbling, both
event handlers will be called and 2 change detections will be
triggered. We can coalesce such kind of events to trigger
change detection only once.

单击按钮时，由于事件冒泡，将调用两个事件处理程序，并触发 2
次变更检测。我们可以合并此类事件以仅触发变更检测一次。

By default, this option will be false. So the events will not be
coalesced and the change detection will be triggered multiple times.
And if this option be set to true, the change detection will be
triggered async by scheduling it in an animation frame. So in the case above,
the change detection will only be trigged once.

默认情况下，此选项将是 false
。因此，事件将不会被合并，并且变更检测将被触发多次。如果此选项设置为
true，则变更检测将通过在动画帧中调度来异步触发。因此在上面的情况下，变更检测将只会被触发一次。

Optionally specify if `NgZone#run()` method invocations should be coalesced
into a single change detection.

（可选）指定 `NgZone#run()` 方法调用是否应合并为单个变更检测。

Consider the following case.

考虑以下情况。

for \(let i = 0; i &lt; 10; i ++\) {
  ngZone.run\(\(\) => {
    // do something
  }\);
}

for \(let i = 0; i &lt; 10; i ++\) { ngZone.run\(\(\) => { // 做点什么 }\); }

This case triggers the change detection multiple times.
With ngZoneRunCoalescing options, all change detections in an event loops trigger only once.
In addition, the change detection executes in requestAnimation.

这种情况会多次触发变更检测。使用 ngZoneRunCoalescing
选项，事件循环中的所有变更检测只会触发一次。此外，变更检测是在 requestAnimation 中执行的。

Provides a noop implementation of `NgZone` which does nothing. This zone requires explicit calls
to framework to perform rendering.

提供了 `NgZone` 的 noop 实现，它什么都不做。此区域需要显式调用 Framework 来执行渲染。

Token used to drive ApplicationRef.isStable

用于驱动 ApplicationRef.isStable 的令牌

TODO: This should be moved entirely to NgZone \(as a breaking change\) so it can be tree-shakeable
for `NoopNgZone` which is always just an `Observable` of `true`. Additionally, we should consider
whether the property on `NgZone` should be `Observable` or `Signal`.

TODO：这应该完全移至 NgZone（作为重大更改），以便它可以对 `NoopNgZone` 进行树摇动，而 NoopNgZone 始终只是一个 `Observable` of `true`。此外，我们应该考虑 `NgZone` 上的属性应该是 `Observable` 还是 `Signal`。
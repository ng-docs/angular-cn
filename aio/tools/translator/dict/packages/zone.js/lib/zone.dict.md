Suppress closure compiler errors about unknown 'global' variable

抑制关于未知“全局”变量的闭包编译器错误

Zone is a mechanism for intercepting and keeping track of asynchronous work.

Zone 是一种用于拦截和跟踪异步工作的机制。

A Zone is a global object which is configured with rules about how to intercept and keep track
of the asynchronous callbacks. Zone has these responsibilities:

Zone 是一个全局对象，它配置了有关如何拦截和跟踪异步回调的规则。Zone 有这些责任：

Intercept asynchronous task scheduling

拦截异步任务调度

Wrap callbacks for error-handling and zone tracking across async operations.

包装回调以进行跨异步操作的错误处理和区域跟踪。

Provide a way to attach data to zones

提供一种将数据附加到区域的方法

Provide a context specific last frame error handling

提供特定于上下文的最后一帧错误处理

\(Intercept blocking methods\)

（拦截阻塞方法）

A zone by itself does not do anything, instead it relies on some other code to route existing
platform API through it. \(The zone library ships with code which monkey patches all of the
browsers's asynchronous API and redirects them through the zone for interception.\)

区域本身不做任何事情，而是依赖一些其他代码来通过它路由现有的平台 API。
（区域库附带的代码可以用猴子修补所有浏览器的异步 API 并将它们重定向通过区域以进行拦截。）

In its simplest form a zone allows one to intercept the scheduling and calling of asynchronous
operations, and execute additional code before as well as after the asynchronous task. The rules
of interception are configured using `[ZoneConfig]`. There can be many different zone instances in
a system, but only one zone is active at any given time which can be retrieved using
`[Zone#current]`.

区域最简单的形式允许人们截获异步操作的调度和调用，并在异步任务之前和之后执行额外的代码。拦截规则是使用 `[ZoneConfig]` 配置的。系统中可以有许多不同的区域实例，但在任何给定时间只有一个区域处于活动状态，可以用 `[Zone#current]` 检索。

Callback Wrapping

回调包装

An important aspect of the zones is that they should persist across asynchronous operations. To
achieve this, when a future work is scheduled through async API, it is necessary to capture, and
subsequently restore the current zone. For example if a code is running in zone `b` and it
invokes `setTimeout` to scheduleTask work later, the `setTimeout` method needs to 1\) capture the
current zone and 2\) wrap the `wrapCallback` in code which will restore the current zone `b` once
the wrapCallback executes. In this way the rules which govern the current code are preserved in
all future asynchronous tasks. There could be a different zone `c` which has different rules and
is associated with different asynchronous tasks. As these tasks are processed, each asynchronous
wrapCallback correctly restores the correct zone, as well as preserves the zone for future
asynchronous callbacks.

区域的一个重要方面是它们应该在异步操作中持续存在。为了实现这一点，当通过异步 API
调度未来的工作时，有必要捕获并随后恢复当前区域。例如，如果代码在区域 `b` 中运行，并且它调用
`setTimeout` 来 scheduleTask 稍后工作，则 `setTimeout` 方法需要 1）捕获当前区域，2）将
`wrapCallback` 包装在代码中，一旦 wrapCallback 执行，它将恢复当前区域 `b`
。通过这种方式，管理当前代码的规则会在未来的所有异步任务中保留。可能有一个不同的区域 `c`
，它具有不同的规则并与不同的异步任务相关联。在处理这些任务时，每个异步 wrapCallback
都会正确恢复正确的区域，并保留该区域以供将来的异步回调使用。

Example: Suppose a browser page consist of application code as well as third-party
advertisement code. \(These two code bases are independent, developed by different mutually
unaware developers.\) The application code may be interested in doing global error handling and
so it configures the `app` zone to send all of the errors to the server for analysis, and then
executes the application in the `app` zone. The advertising code is interested in the same
error processing but it needs to send the errors to a different third-party. So it creates the
`ads` zone with a different error handler. Now both advertising as well as application code
create many asynchronous operations, but the `[Zone]` will ensure that all of the asynchronous
operations created from the application code will execute in `app` zone with its error
handler and all of the advertisement code will execute in the `ads` zone with its error handler.
This will not only work for the async operations created directly, but also for all subsequent
asynchronous operations.

示例：假设浏览器页面由应用程序代码以及第三方广告代码组成。
（这两个代码库是独立的，由不同的彼此不了解的开发人员开发。）应用程序代码可能对进行全局错误处理感兴趣，因此它配置
`app` 区域以将所有错误发送到服务器进行分析，然后执行应用 `app`
区域中的应用程序。广告代码对同一个错误处理感兴趣，但它需要将错误发送给不同的第三方。因此它使用不同的错误处理程序创建了
`ads`
区域。现在广告和应用程序代码都创建了许多异步操作，但 `[Zone]` 将确保从应用程序代码创建的所有异步操作都将在带有错误处理程序的
`app` 区域中执行，并且所有广告代码都将在 `ads`
区域中执行及其错误处理程序。这不仅适用于直接创建的异步操作，也适用于所有后续的异步操作。

If you think of chain of asynchronous operations as a thread of execution \(bit of a stretch\)
then [Zone#current] will act as a thread local variable.

如果你将异步操作链视为一个执行线程（有点牵强），那么 `[Zone#current]` 将作为线程局部变量。

Asynchronous operation scheduling

异步操作调度

In addition to wrapping the callbacks to restore the zone, all operations which cause a
scheduling of work for later are routed through the current zone which is allowed to intercept
them by adding work before or after the wrapCallback as well as using different means of
achieving the request. \(Useful for unit testing, or tracking of requests\). In some instances
such as `setTimeout` the wrapping of the wrapCallback and scheduling is done in the same
wrapCallback, but there are other examples such as `Promises` where the `then` wrapCallback is
wrapped, but the execution of `then` is triggered by `Promise` scheduling `resolve` work.

除了包装回调以恢复区域之外，所有导致稍后安排工作的操作都被路由通过当前区域，该区域可以通过在
wrapCallback 之前或之后添加工作以及使用不同的方式来拦截它们请求。
（可用于单元测试或跟踪请求）。在某些情况下，例如 `setTimeout`，wrapCallback
的包装和调度是在同一个 wrapCallback 中完成的，但还有其他示例，例如 `Promises`，其中的 `then`
wrapCallback 被包装，但 `then` 的执行是由 `Promise` 调度 `resolve` 工作触发的。

Fundamentally there are three kinds of tasks which can be scheduled:

从本质上，可以安排三种任务：

`[MicroTask]` used for doing work right after the current task. This is non-cancelable which is
guaranteed to run exactly once and immediately.

`[MicroTask]` 用于在当前任务之后立即工作。这是不可取消的，可以保证正好运行一次并立即运行。

`[MacroTask]` used for doing work later. Such as `setTimeout`. This is typically cancelable
      which is guaranteed to execute at least once after some well understood delay.

`[MacroTask]` 用于以后做工作。例如 `setTimeout`
。这通常是可取消的，它可以保证在一些众所周知的延迟之后至少执行一次。

`[EventTask]` used for listening on some future event. This may execute zero or more times, with
an unknown delay.

`[EventTask]` 用于侦听某些未来的事件。这可能会执行零次或多次，具有未知的延迟。

Each asynchronous API is modeled and routed through one of these APIs.

每个异步 API 都会通过这些 API 之一进行建模和路由。

`[MicroTask]`s represent work which will be done in current VM turn as soon as possible, before VM
yielding.

`[MicroTask]` s 表示将在 VM 屈服之前在当前 VM 轮次中尽快完成的工作。

`[MacroTask]`s represent work which will be done after some delay. \(Sometimes the delay is
approximate such as on next available animation frame\). Typically these methods include:
`setTimeout`, `setImmediate`, `setInterval`, `requestAnimationFrame`, and all browser specific
variants.

`[MacroTask]` s 表示将在一段时间后完成的工作。
（有时延迟是近似值，例如下一个可用的动画帧）。通常，这些方法包括：`setTimeout`、`setImmediate`
、`setInterval`、`requestAnimationFrame` 以及所有浏览器特定的变体。

`[EventTask]`s represent a request to create a listener on an event. Unlike the other task
events they may never be executed, but typically execute more than once. There is no queue of
events, rather their callbacks are unpredictable both in order and time.

`[EventTask]` 表示要在事件上创建侦听器的请求。与其他任务事件不同，它们可能永远不会被执行，但通常会执行多次。没有事件队列，而是它们的回调在顺序和时间上都是不可预测的。

Global Error Handling

全局错误处理

Composability

可组合性

Zones can be composed together through `[Zone.fork()]`. A child zone may create its own set of
rules. A child zone is expected to either:

区域可以通过 `[Zone.fork()]` 组合在一起。子区域可以创建自己的一组规则。子区域应该：

Delegate the interception to a parent zone, and optionally add before and after wrapCallback
hooks.

将拦截委托给父区域，并选择在 wrapCallback 之前和之后添加钩子。

Process the request itself without delegation.

在不委托的情况下处理请求本身。

Composability allows zones to keep their concerns clean. For example a top most zone may choose
to handle error handling, while child zones may choose to do user action tracking.

可组合性允许区域保持它们的关注点清洁。例如，最顶级的区域可以选择处理错误处理，而子区域可以选择进行用户操作跟踪。

Root Zone

根区

At the start the browser will run in a special root zone, which is configured to behave exactly
like the platform, making any existing code which is not zone-aware behave as expected. All
zones are children of the root zone.

一开始，浏览器将在一个特殊的根区域中运行，该根区域被配置为与平台完全相同，使任何不支持区域感知的现有代码的行为方式与预期一样。所有区域都是根区域的子区域。

{Zone} The parent Zone.

父区域。

{string} The Zone name \(useful for debugging\)

区域名称（用于调试）

The key to retrieve.

要检索的键。

{any} The value for the key, or `undefined` if not found.

键的值，如果找不到，则为 `undefined`。

Returns a value associated with the `key`.

返回与 `key` 关联的值。

If the current zone does not have a key, the request is delegated to the parent zone. Use
`[ZoneSpec.properties]` to configure the set of properties associated with the current zone.

如果当前区域没有键，则请求将委托给父区域。使用 `[ZoneSpec.properties]` 配置与当前区域关联的属性集。

The key to use for identification of the returned zone.

用于标识返回的区域的键。

{Zone} The Zone which defines the `key`, `null` if not found.

定义 `key` 的 Zone，如果找不到，则为 `null`。

Returns a Zone which defines a `key`.

返回一个定义了 `key` 的 Zone。

Recursively search the parent Zone until a Zone which has a property `key` is found.

递归搜索父 Zone，直到找到具有属性 `key` 的 Zone。

A set of rules which the child zone should follow.

子区域应该遵循的一组规则。

{Zone} A new child zone.

一个新的子区域。

Used to create a child zone.

用于创建子区域。

the function which will be wrapped in the zone.

将被包装在区域中的函数。

A unique debug location of the API being wrapped.

被包装的 API 的唯一调试位置。

{function\(\): \*} A function which will invoke the `callback` through `[Zone.runGuarded]`.

一个将通过 `[Zone.runGuarded]` 调用 `callback` 的函数。

Wraps a callback function in a new function which will properly restore the current zone upon
invocation.

将回调函数包装在一个新函数中，该函数将在调用时正确恢复当前区域。

The wrapped function will properly forward `this` as well as `arguments` to the `callback`.

包装的函数会正确地将 `this` 以及 `arguments` 转发给 `callback`。

Before the function is wrapped the zone can intercept the `callback` by declaring
`[ZoneSpec.onIntercept]`.

在包装函数之前，区域可以通过声明 `[ZoneSpec.onIntercept]` 来截获 `callback`
。

The function to invoke.

要调用的函数。

A unique debug location of the API being invoked.

正在调用的 API 的唯一调试位置。

{any} Value from the `callback` function.

来自 `callback` 函数的值。

Invokes a function in a given zone.

调用给定区域中的函数。

The invocation of `callback` can be intercepted by declaring `[ZoneSpec.onInvoke]`.

可以通过声明 `[ZoneSpec.onInvoke]` 来截获 `callback` 的调用。

Invokes a function in a given zone and catches any exceptions.

调用给定区域中的函数并捕获任何异常。

Any exceptions thrown will be forwarded to `[Zone.HandleError]`.

抛出的任何异常都将被转发到 `[Zone.HandleError]`。

The invocation of `callback` can be intercepted by declaring `[ZoneSpec.onInvoke]`. The
handling of exceptions can be intercepted by declaring `[ZoneSpec.handleError]`.

可以通过声明 `[ZoneSpec.onInvoke]` 来截获 `callback`
的调用。可以通过声明 `[ZoneSpec.handleError]` 来截获异常的处理。

to run

运行

{any} Value from the `task.callback` function.

来自 `task.callback` 函数的值。

Execute the Task by restoring the `[Zone.currentTask]` in the Task's zone.

通过恢复任务区域中的 `[Zone.currentTask]` 来执行任务。

Schedule a MicroTask.

调度 MicroTask。

Schedule a MacroTask.

调度宏任务。

Schedule an EventTask.

调度 EventTask。

Schedule an existing Task.

计划现有的任务。

Useful for rescheduling a task which was already canceled.

可用于重新安排已经取消的任务。

Allows the zone to intercept canceling of scheduled Task.

允许该区域拦截计划任务的取消。

The interception is configured using `[ZoneSpec.onCancelTask]`. The default canceler invokes
the `[Task.cancelFn]`.

拦截是使用 `[ZoneSpec.onCancelTask]`
配置的。默认取消器调用 `[Task.cancelFn]`。

{Zone} Returns the current `[Zone]`. The only way to change
the current zone is by invoking a `run()` method, which will update the current zone for the
duration of the `run` method callback.

返回当前的 `[Zone]`。更改当前区域的唯一方法是调用 `run()` 方法，该方法将在 `run`
方法回调期间更新当前区域。

{Task} The task associated with the current execution.

与当前执行关联的任务。

Verify that Zone has been correctly patched. Specifically that Promise is zone aware.

验证 Zone 是否已正确修补。具体来说，Promise 是区域感知的。

Return the root zone.

返回根区域。

load patch for specified native module, allow user to
define their own patch, user can use this API after loading zone.js

加载指定原生模块的补丁，允许用户定义自己的补丁，用户可以在加载 zone.js 后使用此 API

Zone symbol API to generate a string with __zone_symbol__ prefix

区域符号 API，用于生成带有 __zone_symbol__ 前缀的字符串

Patch Function to allow user define their own monkey patch module.

补丁函数，允许用户定义自己的猴子补丁模块。

\_ZonePrivate interface to provide helper method to help user implement
their own monkey patch module.

\_ZonePrivate 接口提供帮助器方法来帮助用户实现自己的猴子补丁模块。

\_ZoneFrame represents zone stack frame information

\_ZoneFrame 表示区域堆栈帧信息

Provides a way to configure the interception of zone events.

提供一种配置区域事件拦截的方法。

Only the `name` property is required \(all other are optional\).

只有 `name` 属性是必需的（所有其他都是可选的）。

The name of the zone. Useful when debugging Zones.

区域的名称。调试 Zone 时很有用。

A set of properties to be associated with Zone. Use `[Zone.get]` to retrieve them.

要与 Zone 关联的一组属性。使用 `[Zone.get]` 来检索它们。

Delegate which performs the parent `[ZoneSpec]` operation.

执行父 `[ZoneSpec]` 操作的委托。

The current `[Zone]` where the current interceptor has been declared.

已声明当前拦截器的当前 `[Zone]`。

The `[Zone]` which originally received the request.

最初收到请求的 `[Zone]`。

The argument passed into the `fork` method.

传递给 `fork` 方法的参数。

Allows the interception of zone forking.

允许拦截区域 forking。

When the zone is being forked, the request is forwarded to this method for interception.

当区域被 fork 时，请求会被转发到此方法进行拦截。

The argument passed into the `wrap` method.

传递给 `wrap` 方法的参数。

Allows interception of the wrapping of the callback.

允许拦截回调的包装。

The argument passed into the `run` method.

传递给 `run` 方法的参数。

Allows interception of the callback invocation.

允许拦截回调调用。

The argument passed into the `handleError` method.

传递给 `handleError` 方法的参数。

Allows interception of the error handling.

允许截获错误处理。

The argument passed into the `scheduleTask` method.

传递给 `scheduleTask` 方法的参数。

Allows interception of task scheduling.

允许拦截任务调度。

The argument passed into the `cancelTask` method.

传递给 `cancelTask` 方法的参数。

Allows interception of task cancellation.

允许拦截任务取消。

Notifies of changes to the task queue empty status.

任务队列空状态更改的通知。

A delegate when intercepting zone operations.

拦截区域操作时的委托。

A ZoneDelegate is needed because a child zone can't simply invoke a method on a parent zone. For
 example a child zone wrap can't just call parent zone wrap. Doing so would create a callback
 which is bound to the parent zone. What we are interested in is intercepting the callback before
 it is bound to any zone. Furthermore, we also need to pass the targetZone \(zone which received
 the original request\) to the delegate.

需要 ZoneDelegate
，因为子区域不能简单地调用父区域上的方法。例如，子区域换行不能只调用父区域换行。这样做将创建一个绑定到父区域的回调。我们感兴趣的是在回调绑定到任何区域之前拦截回调。此外，我们还需要将
targetZone（接收到原始请求的区域）传递给委托。

The ZoneDelegate methods mirror those of Zone with an addition of extra targetZone argument in
 the method signature. \(The original Zone which received the request.\) Some methods are renamed
 to prevent confusion, because they have slightly different semantics and arguments.

ZoneDelegate 方法镜像了 Zone 的方法，只是在方法签名中添加了额外的 targetZone 参数。
（收到请求的原始 Zone。）某些方法被重命名以防止混淆，因为它们的语义和参数略有不同。

`wrap` => `intercept`: The `wrap` method delegates to `intercept`. The `wrap` method returns
   a callback which will run in a given zone, where as intercept allows wrapping the callback
   so that additional code can be run before and after, but does not associate the callback
   with the zone.

`wrap` => `intercept`：`wrap` 方法委托给 `intercept`。`wrap`
方法返回一个将在给定区域中运行的回调，其中的 intercept
允许包装回调，以便可以在前后运行其他代码，但不会将回调与区域关联起来。

`run` => `invoke`: The `run` method delegates to `invoke` to perform the actual execution of
     the callback. The `run` method switches to new zone; saves and restores the `Zone.current`;
     and optionally performs error handling. The invoke is not responsible for error handling,
     or zone management.

`run` => `invoke`：`run` 方法委托给 `invoke` 以执行回调的实际执行。`run`
方法会切换到新区域；保存并恢复 `Zone.current`
;并可选地执行错误处理。调用不负责错误处理或区域管理。

Not every method is usually overwritten in the child zone, for this reason the ZoneDelegate
  stores the closest zone which overwrites this behavior along with the closest ZoneSpec.

并非每个方法通常在子区域中被覆盖，因此 ZoneDelegate 存储最近的区域以及最近的 ZoneSpec
会覆盖此行为。

NOTE: We have tried to make this API analogous to Event bubbling with target and current
  properties.

注意：我们已尝试使此 API 类似于使用 target 和 current 属性的事件冒泡。

Note: The ZoneDelegate treats ZoneSpec as class. This allows the ZoneSpec to use its `this` to
  store internal state.

注意：ZoneDelegate 将 ZoneSpec 视为类。这允许 ZoneSpec 使用其 `this` 来存储内部状态。

Task type: `microTask`, `macroTask`, `eventTask`.

任务类型：`microTask`、`macroTask`、`eventTask`。

Task type: `notScheduled`, `scheduling`, `scheduled`, `running`, `canceling`, 'unknown'.

任务类型：`notScheduled`、`scheduling`、`scheduled`、`running`、`canceling` 、
'unknown'。

A periodic `[MacroTask]` is such which get automatically rescheduled after it is executed.

周期性的 `[MacroTask]` 就是这样的，它会在执行后自动重新调度。

Delay in milliseconds when the Task will run.

任务运行时的延迟（以毫秒为单位）。

identifier returned by the native setTimeout.

原生 setTimeout 返回的标识符。

Represents work which is executed with a clean stack.

表示使用干净堆栈执行的工作。

Tasks are used in Zones to mark work which is performed on clean stack frame. There are three
kinds of task. `[MicroTask]`, `[MacroTask]`, and `[EventTask]`.

Zones 中使用任务来标记在干净的堆栈帧上执行的工作。有三种任务。`[MicroTask]` 、
`[MacroTask]` 和 `[EventTask]`。

A JS VM can be modeled as a `[MicroTask]` queue, `[MacroTask]` queue, and `[EventTask]` set.

JS VM 可以建模为 `[MicroTask]` 队列、
`[MacroTask]` 队列和 `[EventTask]` 集。

`[MicroTask]` queue represents a set of tasks which are executing right after the current stack
  frame becomes clean and before a VM yield. All `[MicroTask]`s execute in order of insertion
  before VM yield and the next `[MacroTask]` is executed.

`[MicroTask]` 队列表示一组任务，这些任务正在当前堆栈帧变得干净之后、VM
屈服之前执行。所有 `[MicroTask]` 都会按在 VM yield
之前的插入顺序执行，并执行下一个 `[MacroTask]`。

`[MacroTask]` queue represents a set of tasks which are executed one at a time after each VM
  yield. The queue is ordered by time, and insertions can happen in any location.

`[MacroTask]` 队列表示一组任务，这些任务在每个 VM
屈服之后一次执行一个。队列按时间排序，并且插入可以发生在任何位置。

`[EventTask]` is a set of tasks which can at any time be inserted to the end of the `[MacroTask]`
queue. This happens when the event fires.

`[EventTask]` 是一组任务，可以随时插入到 `[MacroTask]` 队列的末尾。这会在事件触发时发生。

Task state: `notScheduled`, `scheduling`, `scheduled`, `running`, `canceling`, `unknown`.

任务状态：`notScheduled`、`scheduling` 、已 `scheduled`、`running` 、正在 `canceling` 、
`unknown`。

Debug string representing the API which requested the scheduling of the task.

表示请求调度任务的 API 的调试字符串。

The Function to be used by the VM upon entering the `[Task]`. This function will delegate to
`[Zone.runTask]` and delegate to `callback`.

VM 进入 `[Task]` 时要使用的 Function。此函数将委托给 `[Zone.runTask]` 并委托给
`callback`。

Function which needs to be executed by the Task after the `[Zone.currentTask]` has been set to
the current task.

在 `[Zone.currentTask]` 设置为当前任务之后需要由 Task 执行的函数。

Task specific options associated with the current task. This is passed to the `scheduleFn`.

与当前任务关联的任务特定选项。这会传递给 `scheduleFn`。

Represents the default work which needs to be done to schedule the Task by the VM.

表示为由 VM 调度任务需要完成的默认工作。

A zone may choose to intercept this function and perform its own scheduling.

一个区域可以选择截获此函数并执行自己的调度。

Represents the default work which needs to be done to un-schedule the Task from the VM. Not all
Tasks are cancelable, and therefore this method is optional.

表示从 VM 取消调度任务所需完成的默认工作。并非所有任务都是可取消的，因此此方法是可选的。

A zone may chose to intercept this function and perform its own un-scheduling.

一个区域可以选择拦截此功能并执行自己的取消调度。

Number of times the task has been executed, or -1 if canceled.

任务已执行的次数，如果取消，则为 -1。

Cancel the scheduling request. This method can be called from `ZoneSpec.onScheduleTask` to
cancel the current scheduling interception. Once canceled the task can be discarded or
rescheduled using `Zone.scheduleTask` on a different zone.

取消调度请求。可以从 `ZoneSpec.onScheduleTask`
调用此方法以取消当前的调度拦截。取消后，可以在不同的区域上使用 `Zone.scheduleTask`
来丢弃或重新安排任务。
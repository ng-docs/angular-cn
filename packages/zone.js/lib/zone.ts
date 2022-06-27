/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Suppress closure compiler errors about unknown 'global' variable
 *
 * 抑制关于未知“全局”变量的闭包编译器错误
 *
 * @fileoverview
 * @suppress {undefinedVars}
 */

/**
 * Zone is a mechanism for intercepting and keeping track of asynchronous work.
 *
 * Zone 是一种用于拦截和跟踪异步工作的机制。
 *
 * A Zone is a global object which is configured with rules about how to intercept and keep track
 * of the asynchronous callbacks. Zone has these responsibilities:
 *
 * Zone 是一个全局对象，它配置了有关如何拦截和跟踪异步回调的规则。 Zone 有这些责任：
 *
 * 1. Intercept asynchronous task scheduling
 *
 *    拦截异步任务调度
 *
 * 2. Wrap callbacks for error-handling and zone tracking across async operations.
 *
 *    包装回调以进行跨异步操作的错误处理和区域跟踪。
 *
 * 3. Provide a way to attach data to zones
 *
 *    提供一种将数据附加到区域的方法
 *
 * 4. Provide a context specific last frame error handling
 *
 *    提供特定于上下文的最后一帧错误处理
 *
 * 5. (Intercept blocking methods)
 *
 *    （拦截阻塞方法）
 *
 * A zone by itself does not do anything, instead it relies on some other code to route existing
 * platform API through it. (The zone library ships with code which monkey patches all of the
 * browsers's asynchronous API and redirects them through the zone for interception.)
 *
 * 区域本身不做任何事情，而是依赖一些其他代码来通过它路由现有的平台 API。
 * （区域库附带的代码可以用猴子修补所有浏览器的异步 API 并将它们重定向通过区域以进行拦截。）
 *
 * In its simplest form a zone allows one to intercept the scheduling and calling of asynchronous
 * operations, and execute additional code before as well as after the asynchronous task. The rules
 * of interception are configured using [ZoneConfig]. There can be many different zone instances in
 * a system, but only one zone is active at any given time which can be retrieved using
 * [Zone#current].
 *
 * 区域最简单的形式允许人们截获异步操作的调度和调用，并在异步任务之前和之后执行额外的代码。拦截规则是使用[ZoneConfig][ZoneConfig]配置的。系统中可以有许多不同的区域实例，但在任何给定时间只有一个区域处于活动状态，可以用[Zone#current][Zone#current]检索。
 *
 * ## Callback Wrapping
 *
 * ## 回调包装
 *
 * An important aspect of the zones is that they should persist across asynchronous operations. To
 * achieve this, when a future work is scheduled through async API, it is necessary to capture, and
 * subsequently restore the current zone. For example if a code is running in zone `b` and it
 * invokes `setTimeout` to scheduleTask work later, the `setTimeout` method needs to 1) capture the
 * current zone and 2) wrap the `wrapCallback` in code which will restore the current zone `b` once
 * the wrapCallback executes. In this way the rules which govern the current code are preserved in
 * all future asynchronous tasks. There could be a different zone `c` which has different rules and
 * is associated with different asynchronous tasks. As these tasks are processed, each asynchronous
 * wrapCallback correctly restores the correct zone, as well as preserves the zone for future
 * asynchronous callbacks.
 *
 * 区域的一个重要方面是它们应该在异步操作中持续存在。为了实现这一点，当通过异步 API
 * 调度未来的工作时，有必要捕获并随后恢复当前区域。例如，如果代码在区域 `b` 中运行，并且它调用
 * `setTimeout` 来 scheduleTask 稍后工作，则 `setTimeout` 方法需要 1）捕获当前区域，2）将
 * `wrapCallback` 包装在代码中，一旦 wrapCallback 执行，它将恢复当前区域 `b`
 * 。通过这种方式，管理当前代码的规则会在未来的所有异步任务中保留。可能有一个不同的区域 `c`
 * ，它具有不同的规则并与不同的异步任务相关联。在处理这些任务时，每个异步 wrapCallback
 * 都会正确恢复正确的区域，并保留该区域以供将来的异步回调使用。
 *
 * Example: Suppose a browser page consist of application code as well as third-party
 * advertisement code. (These two code bases are independent, developed by different mutually
 * unaware developers.) The application code may be interested in doing global error handling and
 * so it configures the `app` zone to send all of the errors to the server for analysis, and then
 * executes the application in the `app` zone. The advertising code is interested in the same
 * error processing but it needs to send the errors to a different third-party. So it creates the
 * `ads` zone with a different error handler. Now both advertising as well as application code
 * create many asynchronous operations, but the [Zone] will ensure that all of the asynchronous
 * operations created from the application code will execute in `app` zone with its error
 * handler and all of the advertisement code will execute in the `ads` zone with its error handler.
 * This will not only work for the async operations created directly, but also for all subsequent
 * asynchronous operations.
 *
 * 示例：假设浏览器页面由应用程序代码以及第三方广告代码组成。
 * （这两个代码库是独立的，由不同的彼此不了解的开发人员开发。）应用程序代码可能对进行全局错误处理感兴趣，因此它配置
 * `app` 区域以将所有错误发送到服务器进行分析，然后执行应用 `app`
 * 区域中的应用程序。广告代码对同一个错误处理感兴趣，但它需要将错误发送给不同的第三方。因此它使用不同的错误处理程序创建了
 * `ads`
 * 区域。现在广告和应用程序代码都创建了许多异步操作，但[Zone][Zone]将确保从应用程序代码创建的所有异步操作都将在带有错误处理程序的
 * `app` 区域中执行，并且所有广告代码都将在 `ads`
 * 区域中执行及其错误处理程序。这不仅适用于直接创建的异步操作，也适用于所有后续的异步操作。
 *
 * If you think of chain of asynchronous operations as a thread of execution (bit of a stretch)
 * then [Zone#current] will act as a thread local variable.
 *
 * 如果你将异步操作链视为一个执行线程（有点牵强），那么[Zone#current][Zone#current]将作为线程局部变量。
 *
 * ## Asynchronous operation scheduling
 *
 * ## 异步操作调度
 *
 * In addition to wrapping the callbacks to restore the zone, all operations which cause a
 * scheduling of work for later are routed through the current zone which is allowed to intercept
 * them by adding work before or after the wrapCallback as well as using different means of
 * achieving the request. (Useful for unit testing, or tracking of requests). In some instances
 * such as `setTimeout` the wrapping of the wrapCallback and scheduling is done in the same
 * wrapCallback, but there are other examples such as `Promises` where the `then` wrapCallback is
 * wrapped, but the execution of `then` is triggered by `Promise` scheduling `resolve` work.
 *
 * 除了包装回调以恢复区域之外，所有导致稍后安排工作的操作都被路由通过当前区域，该区域可以通过在
 * wrapCallback 之前或之后添加工作以及使用不同的方式来拦截它们请求。
 * （可用于单元测试或跟踪请求）。在某些情况下，例如 `setTimeout` ，wrapCallback
 * 的包装和调度是在同一个 wrapCallback 中完成的，但还有其他示例，例如 `Promises` ，其中的 `then`
 * wrapCallback 被包装，但 `then` 的执行是由 `Promise` 调度 `resolve` 工作触发的。
 *
 * Fundamentally there are three kinds of tasks which can be scheduled:
 *
 * 从本质上，可以安排三种任务：
 *
 * 1. [MicroTask] used for doing work right after the current task. This is non-cancelable which is
 *    guaranteed to run exactly once and immediately.
 *
 *    [MicroTask][MicroTask]用于在当前任务之后立即工作。这是不可取消的，可以保证正好运行一次并立即运行。
 *
 * 2. [MacroTask] used for doing work later. Such as `setTimeout`. This is typically cancelable
 *    which is guaranteed to execute at least once after some well understood delay.
 *
 *    [MacroTask][MacroTask]用于以后做工作。例如 `setTimeout`
 * 。这通常是可取消的，它可以保证在一些众所周知的延迟之后至少执行一次。
 *
 * 3. [EventTask] used for listening on some future event. This may execute zero or more times, with
 *    an unknown delay.
 *
 *    [EventTask][EventTask]用于侦听某些未来的事件。这可能会执行零次或多次，具有未知的延迟。
 *
 * Each asynchronous API is modeled and routed through one of these APIs.
 *
 * 每个异步 API 都会通过这些 API 之一进行建模和路由。
 *
 * ### [MicroTask]
 *
 * ### [微任务][MicroTask]
 *
 * [MicroTask]s represent work which will be done in current VM turn as soon as possible, before VM
 * yielding.
 *
 * [MicroTask][MicroTask] s 表示将在 VM 屈服之前在当前 VM 轮次中尽快完成的工作。
 *
 * ### [MacroTask]
 *
 * ### [宏任务][MacroTask]
 *
 * [MacroTask]s represent work which will be done after some delay. (Sometimes the delay is
 * approximate such as on next available animation frame). Typically these methods include:
 * `setTimeout`, `setImmediate`, `setInterval`, `requestAnimationFrame`, and all browser specific
 * variants.
 *
 * [MacroTask][MacroTask] s 表示将在一段时间后完成的工作。
 * （有时延迟是近似值，例如下一个可用的动画帧）。通常，这些方法包括： `setTimeout` 、 `setImmediate`
 * 、 `setInterval` 、 `requestAnimationFrame` 以及所有浏览器特定的变体。
 *
 * ### [EventTask]
 *
 * ### [事件任务][EventTask]
 *
 * [EventTask]s represent a request to create a listener on an event. Unlike the other task
 * events they may never be executed, but typically execute more than once. There is no queue of
 * events, rather their callbacks are unpredictable both in order and time.
 *
 * [EventTask][EventTask]表示要在事件上创建侦听器的请求。与其他任务事件不同，它们可能永远不会被执行，但通常会执行多次。没有事件队列，而是它们的回调在顺序和时间上都是不可预测的。
 *
 * ## Global Error Handling
 *
 * ## 全局错误处理
 *
 * ## Composability
 *
 * ## 可组合性
 *
 * Zones can be composed together through [Zone.fork()]. A child zone may create its own set of
 * rules. A child zone is expected to either:
 *
 * 区域可以通过[Zone.fork()][Zone.fork()]组合在一起。子区域可以创建自己的一组规则。子区域应该：
 *
 * 1. Delegate the interception to a parent zone, and optionally add before and after wrapCallback
 *    hooks.
 *
 *    将拦截委托给父区域，并选择在 wrapCallback 之前和之后添加钩子。
 *
 * 2. Process the request itself without delegation.
 *
 *    在不委托的情况下处理请求本身。
 *
 * Composability allows zones to keep their concerns clean. For example a top most zone may choose
 * to handle error handling, while child zones may choose to do user action tracking.
 *
 * 可组合性允许区域保持它们的关注点清洁。例如，最顶级的区域可以选择处理错误处理，而子区域可以选择进行用户操作跟踪。
 *
 * ## Root Zone
 *
 * ## 根区
 *
 * At the start the browser will run in a special root zone, which is configured to behave exactly
 * like the platform, making any existing code which is not zone-aware behave as expected. All
 * zones are children of the root zone.
 *
 * 一开始，浏览器将在一个特殊的根区域中运行，该根区域被配置为与平台完全相同，使任何不支持区域感知的现有代码的行为方式与预期一样。所有区域都是根区域的子区域。
 *
 */
interface Zone {
  /**
   *
   * @returns
   *
   * {Zone} The parent Zone.
   *
   * 父区域。
   *
   */
  parent: Zone|null;
  /**
   * @returns
   *
   * {string} The Zone name (useful for debugging)
   *
   * 区域名称（用于调试）
   *
   */
  name: string;

  /**
   * Returns a value associated with the `key`.
   *
   * 返回与 `key` 关联的值。
   *
   * If the current zone does not have a key, the request is delegated to the parent zone. Use
   * [ZoneSpec.properties] to configure the set of properties associated with the current zone.
   *
   * 如果当前区域没有键，则请求将委托给父区域。使用[ZoneSpec.properties][ZoneSpec.properties]配置与当前区域关联的属性集。
   *
   * @param key The key to retrieve.
   *
   * 要检索的键。
   *
   * @returns
   *
   * {any} The value for the key, or `undefined` if not found.
   *
   * 键的值，如果找不到，则为 `undefined` 。
   *
   */
  get(key: string): any;

  /**
   * Returns a Zone which defines a `key`.
   *
   * 返回一个定义了 `key` 的 Zone 。
   *
   * Recursively search the parent Zone until a Zone which has a property `key` is found.
   *
   * 递归搜索父 Zone，直到找到具有属性 `key` 的 Zone。
   *
   * @param key The key to use for identification of the returned zone.
   *
   * 用于标识返回的区域的键。
   *
   * @returns
   *
   * {Zone} The Zone which defines the `key`, `null` if not found.
   *
   * 定义 `key` 的 Zone ，如果找不到，则为 `null` 。
   *
   */
  getZoneWith(key: string): Zone|null;

  /**
   * Used to create a child zone.
   *
   * 用于创建子区域。
   *
   * @param zoneSpec A set of rules which the child zone should follow.
   *
   * 子区域应该遵循的一组规则。
   *
   * @returns
   *
   * {Zone} A new child zone.
   *
   * 一个新的子区域。
   *
   */
  fork(zoneSpec: ZoneSpec): Zone;

  /**
   * Wraps a callback function in a new function which will properly restore the current zone upon
   * invocation.
   *
   * 将回调函数包装在一个新函数中，该函数将在调用时正确恢复当前区域。
   *
   * The wrapped function will properly forward `this` as well as `arguments` to the `callback`.
   *
   * 包装的函数会正确地将 `this` 以及 `arguments` 转发给 `callback` 。
   *
   * Before the function is wrapped the zone can intercept the `callback` by declaring
   * [ZoneSpec.onIntercept].
   *
   * 在包装函数之前，区域可以通过声明[ZoneSpec.onIntercept][ZoneSpec.onIntercept]来截获 `callback`
   * 。
   *
   * @param callback the function which will be wrapped in the zone.
   *
   * 将被包装在区域中的函数。
   *
   * @param source A unique debug location of the API being wrapped.
   *
   * 被包装的 API 的唯一调试位置。
   *
   * @returns
   *
   * {function(): *} A function which will invoke the `callback` through [Zone.runGuarded].
   *
   * 一个将通过[Zone.runGuarded][Zone.runGuarded]调用 `callback` 的函数。
   *
   */
  wrap<F extends Function>(callback: F, source: string): F;

  /**
   * Invokes a function in a given zone.
   *
   * 调用给定区域中的函数。
   *
   * The invocation of `callback` can be intercepted by declaring [ZoneSpec.onInvoke].
   *
   * 可以通过声明[ZoneSpec.onInvoke][ZoneSpec.onInvoke]来截获 `callback` 的调用。
   *
   * @param callback The function to invoke.
   *
   * 要调用的函数。
   *
   * @param applyThis
   * @param applyArgs
   * @param source A unique debug location of the API being invoked.
   *
   * 正在调用的 API 的唯一调试位置。
   *
   * @returns
   *
   * {any} Value from the `callback` function.
   *
   * 来自 `callback` 函数的值。
   *
   */
  run<T>(callback: Function, applyThis?: any, applyArgs?: any[], source?: string): T;

  /**
   * Invokes a function in a given zone and catches any exceptions.
   *
   * 调用给定区域中的函数并捕获任何异常。
   *
   * Any exceptions thrown will be forwarded to [Zone.HandleError].
   *
   * 抛出的任何异常都将被转发到[Zone.HandleError][Zone.HandleError] 。
   *
   * The invocation of `callback` can be intercepted by declaring [ZoneSpec.onInvoke]. The
   * handling of exceptions can be intercepted by declaring [ZoneSpec.handleError].
   *
   * 可以通过声明[ZoneSpec.onInvoke][ZoneSpec.onInvoke]来截获 `callback`
   * 的调用。可以通过声明[ZoneSpec.handleError][ZoneSpec.handleError]来截获异常的处理。
   *
   * @param callback The function to invoke.
   *
   * 要调用的函数。
   *
   * @param applyThis
   * @param applyArgs
   * @param source A unique debug location of the API being invoked.
   *
   * 正在调用的 API 的唯一调试位置。
   *
   * @returns
   *
   * {any} Value from the `callback` function.
   *
   * 来自 `callback` 函数的值。
   *
   */
  runGuarded<T>(callback: Function, applyThis?: any, applyArgs?: any[], source?: string): T;

  /**
   * Execute the Task by restoring the [Zone.currentTask] in the Task's zone.
   *
   * 通过恢复任务区域中的[Zone.currentTask][Zone.currentTask]来执行任务。
   *
   * @param task to run
   *
   * 运行
   *
   * @param applyThis
   * @param applyArgs
   * @returns
   *
   * {any} Value from the `task.callback` function.
   *
   * 来自 `task.callback` 函数的值。
   *
   */
  runTask<T>(task: Task, applyThis?: any, applyArgs?: any): T;

  /**
   * Schedule a MicroTask.
   *
   * 调度 MicroTask 。
   *
   * @param source
   * @param callback
   * @param data
   * @param customSchedule
   */
  scheduleMicroTask(
      source: string, callback: Function, data?: TaskData,
      customSchedule?: (task: Task) => void): MicroTask;

  /**
   * Schedule a MacroTask.
   *
   * 调度宏任务。
   *
   * @param source
   * @param callback
   * @param data
   * @param customSchedule
   * @param customCancel
   */
  scheduleMacroTask(
      source: string, callback: Function, data?: TaskData, customSchedule?: (task: Task) => void,
      customCancel?: (task: Task) => void): MacroTask;

  /**
   * Schedule an EventTask.
   *
   * 调度 EventTask。
   *
   * @param source
   * @param callback
   * @param data
   * @param customSchedule
   * @param customCancel
   */
  scheduleEventTask(
      source: string, callback: Function, data?: TaskData, customSchedule?: (task: Task) => void,
      customCancel?: (task: Task) => void): EventTask;

  /**
   * Schedule an existing Task.
   *
   * 计划现有的任务。
   *
   * Useful for rescheduling a task which was already canceled.
   *
   * 可用于重新安排已经取消的任务。
   *
   * @param task
   */
  scheduleTask<T extends Task>(task: T): T;

  /**
   * Allows the zone to intercept canceling of scheduled Task.
   *
   * 允许该区域拦截计划任务的取消。
   *
   * The interception is configured using [ZoneSpec.onCancelTask]. The default canceler invokes
   * the [Task.cancelFn].
   *
   * 拦截是使用[ZoneSpec.onCancelTask][ZoneSpec.onCancelTask]
   * 配置的。默认取消器调用[Task.cancelFn][Task.cancelFn] 。
   *
   * @param task
   * @returns {any}
   */
  cancelTask(task: Task): any;
}

interface ZoneType {
  /**
   * @returns
   *
   * {Zone} Returns the current [Zone]. The only way to change
   * the current zone is by invoking a run() method, which will update the current zone for the
   * duration of the run method callback.
   *
   * 返回当前的[Zone][Zone] 。更改当前区域的唯一方法是调用 run() 方法，该方法将在 run
   * 方法回调期间更新当前区域。
   *
   */
  current: Zone;

  /**
   * @returns
   *
   * {Task} The task associated with the current execution.
   *
   * 与当前执行关联的任务。
   *
   */
  currentTask: Task|null;

  /**
   * Verify that Zone has been correctly patched. Specifically that Promise is zone aware.
   *
   * 验证 Zone 是否已正确修补。具体来说，Promise 是区域感知的。
   *
   */
  assertZonePatched(): void;

  /**
   * Return the root zone.
   *
   * 返回根区域。
   *
   */
  root: Zone;

  /**
   * load patch for specified native module, allow user to
   * define their own patch, user can use this API after loading zone.js
   *
   * 加载指定本机模块的补丁，允许用户定义自己的补丁，用户可以在加载 zone.js 后使用此 API
   *
   */
  __load_patch(name: string, fn: _PatchFn, ignoreDuplicate?: boolean): void;

  /**
   * Zone symbol API to generate a string with __zone_symbol__ prefix
   *
   * 区域符号 API，用于生成带有 __zone_symbol__ 前缀的字符串
   *
   */
  __symbol__(name: string): string;
}

/**
 * Patch Function to allow user define their own monkey patch module.
 *
 * 补丁函数，允许用户定义自己的猴子补丁模块。
 *
 */
type _PatchFn = (global: Window, Zone: ZoneType, api: _ZonePrivate) => void;

/**
 * \_ZonePrivate interface to provide helper method to help user implement
 * their own monkey patch module.
 *
 * \_ZonePrivate 接口提供帮助器方法来帮助用户实现自己的猴子补丁模块。
 *
 */
interface _ZonePrivate {
  currentZoneFrame: () => _ZoneFrame;
  symbol: (name: string) => string;
  scheduleMicroTask: (task?: MicroTask) => void;
  onUnhandledError: (error: Error) => void;
  microtaskDrainDone: () => void;
  showUncaughtError: () => boolean;
  patchEventTarget: (global: any, api: _ZonePrivate, apis: any[], options?: any) => boolean[];
  patchOnProperties: (obj: any, properties: string[]|null, prototype?: any) => void;
  patchThen: (ctro: Function) => void;
  patchMethod:
      (target: any, name: string,
       patchFn: (delegate: Function, delegateName: string, name: string) =>
           (self: any, args: any[]) => any) => Function | null;
  bindArguments: (args: any[], source: string) => any[];
  patchMacroTask:
      (obj: any, funcName: string, metaCreator: (self: any, args: any[]) => any) => void;
  patchEventPrototype: (_global: any, api: _ZonePrivate) => void;
  isIEOrEdge: () => boolean;
  ObjectDefineProperty:
      (o: any, p: PropertyKey, attributes: PropertyDescriptor&ThisType<any>) => any;
  ObjectGetOwnPropertyDescriptor: (o: any, p: PropertyKey) => PropertyDescriptor | undefined;
  ObjectCreate(o: object|null, properties?: PropertyDescriptorMap&ThisType<any>): any;
  ArraySlice(start?: number, end?: number): any[];
  patchClass: (className: string) => void;
  wrapWithCurrentZone: (callback: any, source: string) => any;
  filterProperties: (target: any, onProperties: string[], ignoreProperties: any[]) => string[];
  attachOriginToPatched: (target: any, origin: any) => void;
  _redefineProperty: (target: any, callback: string, desc: any) => void;
  nativeScheduleMicroTask: (func: Function) => void;
  patchCallbacks:
      (api: _ZonePrivate, target: any, targetName: string, method: string,
       callbacks: string[]) => void;
  getGlobalObjects: () => {
    globalSources: any, zoneSymbolEventNames: any, eventNames: string[], isBrowser: boolean,
        isMix: boolean, isNode: boolean, TRUE_STR: string, FALSE_STR: string,
        ZONE_SYMBOL_PREFIX: string, ADD_EVENT_LISTENER_STR: string,
        REMOVE_EVENT_LISTENER_STR: string
  } | undefined;
}

/**
 * \_ZoneFrame represents zone stack frame information
 *
 * \_ZoneFrame 表示区域堆栈帧信息
 *
 */
interface _ZoneFrame {
  parent: _ZoneFrame|null;
  zone: Zone;
}

interface UncaughtPromiseError extends Error {
  zone: Zone;
  task: Task;
  promise: Promise<any>;
  rejection: any;
  throwOriginal?: boolean;
}

/**
 * Provides a way to configure the interception of zone events.
 *
 * 提供一种配置区域事件拦截的方法。
 *
 * Only the `name` property is required (all other are optional).
 *
 * 只有 `name` 属性是必需的（所有其他都是可选的）。
 *
 */
interface ZoneSpec {
  /**
   * The name of the zone. Useful when debugging Zones.
   *
   * 区域的名称。调试 Zone 时很有用。
   *
   */
  name: string;

  /**
   * A set of properties to be associated with Zone. Use [Zone.get] to retrieve them.
   *
   * 要与 Zone 关联的一组属性。使用[Zone.get][Zone.get]来检索它们。
   *
   */
  properties?: {[key: string]: any};

  /**
   * Allows the interception of zone forking.
   *
   * 允许拦截区域 forking。
   *
   * When the zone is being forked, the request is forwarded to this method for interception.
   *
   * 当区域被 fork 时，请求会被转发到此方法进行拦截。
   *
   * @param parentZoneDelegate Delegate which performs the parent [ZoneSpec] operation.
   *
   * 执行父[ZoneSpec][ZoneSpec]操作的委托。
   *
   * @param currentZone The current [Zone] where the current interceptor has been declared.
   *
   * 已声明当前拦截器的当前[Zone][Zone] 。
   *
   * @param targetZone The [Zone] which originally received the request.
   *
   * 最初收到请求的[Zone][Zone] 。
   *
   * @param zoneSpec The argument passed into the `fork` method.
   *
   * 传递给 `fork` 方法的参数。
   *
   */
  onFork?:
      (parentZoneDelegate: ZoneDelegate, currentZone: Zone, targetZone: Zone,
       zoneSpec: ZoneSpec) => Zone;

  /**
   * Allows interception of the wrapping of the callback.
   *
   * 允许拦截回调的包装。
   *
   * @param parentZoneDelegate Delegate which performs the parent [ZoneSpec] operation.
   *
   * 执行父[ZoneSpec][ZoneSpec]操作的委托。
   *
   * @param currentZone The current [Zone] where the current interceptor has been declared.
   *
   * 已声明当前拦截器的当前[Zone][Zone] 。
   *
   * @param targetZone The [Zone] which originally received the request.
   *
   * 最初收到请求的[Zone][Zone] 。
   *
   * @param delegate The argument passed into the `wrap` method.
   *
   * 传递给 `wrap` 方法的参数。
   *
   * @param source The argument passed into the `wrap` method.
   *
   * 传递给 `wrap` 方法的参数。
   *
   */
  onIntercept?:
      (parentZoneDelegate: ZoneDelegate, currentZone: Zone, targetZone: Zone, delegate: Function,
       source: string) => Function;

  /**
   * Allows interception of the callback invocation.
   *
   * 允许拦截回调调用。
   *
   * @param parentZoneDelegate Delegate which performs the parent [ZoneSpec] operation.
   *
   * 执行父[ZoneSpec][ZoneSpec]操作的委托。
   *
   * @param currentZone The current [Zone] where the current interceptor has been declared.
   *
   * 已声明当前拦截器的当前[Zone][Zone] 。
   *
   * @param targetZone The [Zone] which originally received the request.
   *
   * 最初收到请求的[Zone][Zone] 。
   *
   * @param delegate The argument passed into the `run` method.
   *
   * 传递给 `run` 方法的参数。
   *
   * @param applyThis The argument passed into the `run` method.
   *
   * 传递给 `run` 方法的参数。
   *
   * @param applyArgs The argument passed into the `run` method.
   *
   * 传递给 `run` 方法的参数。
   *
   * @param source The argument passed into the `run` method.
   *
   * 传递给 `run` 方法的参数。
   *
   */
  onInvoke?:
      (parentZoneDelegate: ZoneDelegate, currentZone: Zone, targetZone: Zone, delegate: Function,
       applyThis: any, applyArgs?: any[], source?: string) => any;

  /**
   * Allows interception of the error handling.
   *
   * 允许截获错误处理。
   *
   * @param parentZoneDelegate Delegate which performs the parent [ZoneSpec] operation.
   *
   * 执行父[ZoneSpec][ZoneSpec]操作的委托。
   *
   * @param currentZone The current [Zone] where the current interceptor has been declared.
   *
   * 已声明当前拦截器的当前[Zone][Zone] 。
   *
   * @param targetZone The [Zone] which originally received the request.
   *
   * 最初收到请求的[Zone][Zone] 。
   *
   * @param error The argument passed into the `handleError` method.
   *
   * 传递给 `handleError` 方法的参数。
   *
   */
  onHandleError?:
      (parentZoneDelegate: ZoneDelegate, currentZone: Zone, targetZone: Zone,
       error: any) => boolean;

  /**
   * Allows interception of task scheduling.
   *
   * 允许拦截任务调度。
   *
   * @param parentZoneDelegate Delegate which performs the parent [ZoneSpec] operation.
   *
   * 执行父[ZoneSpec][ZoneSpec]操作的委托。
   *
   * @param currentZone The current [Zone] where the current interceptor has been declared.
   *
   * 已声明当前拦截器的当前[Zone][Zone] 。
   *
   * @param targetZone The [Zone] which originally received the request.
   *
   * 最初收到请求的[Zone][Zone] 。
   *
   * @param task The argument passed into the `scheduleTask` method.
   *
   * 传递给 `scheduleTask` 方法的参数。
   *
   */
  onScheduleTask?:
      (parentZoneDelegate: ZoneDelegate, currentZone: Zone, targetZone: Zone, task: Task) => Task;

  onInvokeTask?:
      (parentZoneDelegate: ZoneDelegate, currentZone: Zone, targetZone: Zone, task: Task,
       applyThis: any, applyArgs?: any[]) => any;

  /**
   * Allows interception of task cancellation.
   *
   * 允许拦截任务取消。
   *
   * @param parentZoneDelegate Delegate which performs the parent [ZoneSpec] operation.
   *
   * 执行父[ZoneSpec][ZoneSpec]操作的委托。
   *
   * @param currentZone The current [Zone] where the current interceptor has been declared.
   *
   * 已声明当前拦截器的当前[Zone][Zone] 。
   *
   * @param targetZone The [Zone] which originally received the request.
   *
   * 最初收到请求的[Zone][Zone] 。
   *
   * @param task The argument passed into the `cancelTask` method.
   *
   * 传递给 `cancelTask` 方法的参数。
   *
   */
  onCancelTask?:
      (parentZoneDelegate: ZoneDelegate, currentZone: Zone, targetZone: Zone, task: Task) => any;

  /**
   * Notifies of changes to the task queue empty status.
   *
   * 任务队列空状态更改的通知。
   *
   * @param parentZoneDelegate Delegate which performs the parent [ZoneSpec] operation.
   *
   * 执行父[ZoneSpec][ZoneSpec]操作的委托。
   *
   * @param currentZone The current [Zone] where the current interceptor has been declared.
   *
   * 已声明当前拦截器的当前[Zone][Zone] 。
   *
   * @param targetZone The [Zone] which originally received the request.
   *
   * 最初收到请求的[Zone][Zone] 。
   *
   * @param hasTaskState
   */
  onHasTask?:
      (parentZoneDelegate: ZoneDelegate, currentZone: Zone, targetZone: Zone,
       hasTaskState: HasTaskState) => void;
}


/**
 * A delegate when intercepting zone operations.
 *
 * 拦截区域操作时的委托。
 *
 *  A ZoneDelegate is needed because a child zone can't simply invoke a method on a parent zone. For
 *  example a child zone wrap can't just call parent zone wrap. Doing so would create a callback
 *  which is bound to the parent zone. What we are interested in is intercepting the callback before
 *  it is bound to any zone. Furthermore, we also need to pass the targetZone (zone which received
 *  the original request) to the delegate.
 *
 * 需要 ZoneDelegate
 * ，因为子区域不能简单地调用父区域上的方法。例如，子区域换行不能只调用父区域换行。这样做将创建一个绑定到父区域的回调。我们感兴趣的是在回调绑定到任何区域之前拦截回调。此外，我们还需要将
 * targetZone （接收到原始请求的区域）传递给委托。
 *
 *  The ZoneDelegate methods mirror those of Zone with an addition of extra targetZone argument in
 *  the method signature. (The original Zone which received the request.) Some methods are renamed
 *  to prevent confusion, because they have slightly different semantics and arguments.
 *
 * ZoneDelegate 方法镜像了 Zone 的方法，只是在方法签名中添加了额外的 targetZone 参数。
 * （收到请求的原始 Zone。）某些方法被重命名以防止混淆，因为它们的语义和参数略有不同。
 *
 * - `wrap` => `intercept`: The `wrap` method delegates to `intercept`. The `wrap` method returns
 *    a callback which will run in a given zone, where as intercept allows wrapping the callback
 *    so that additional code can be run before and after, but does not associate the callback
 *    with the zone.
 *
 *   `wrap` => `intercept` ： `wrap` 方法委托给 `intercept` 。 `wrap`
 * 方法返回一个将在给定区域中运行的回调，其中的 intercept
 * 允许包装回调，以便可以在前后运行其他代码，但不会将回调与区域关联起来。
 *
 * - `run` => `invoke`: The `run` method delegates to `invoke` to perform the actual execution of
 *      the callback. The `run` method switches to new zone; saves and restores the `Zone.current`;
 *      and optionally performs error handling. The invoke is not responsible for error handling,
 *      or zone management.
 *
 *   `run` => `invoke` ： `run` 方法委托给 `invoke` 以执行回调的实际执行。 `run`
 * 方法会切换到新区域；保存并恢复 `Zone.current`
 * ;并可选地执行错误处理。调用不负责错误处理或区域管理。
 *
 *   Not every method is usually overwritten in the child zone, for this reason the ZoneDelegate
 *   stores the closest zone which overwrites this behavior along with the closest ZoneSpec.
 *
 *   并非每个方法通常在子区域中被覆盖，因此 ZoneDelegate 存储最近的区域以及最近的 ZoneSpec
 * 会覆盖此行为。
 *
 *   NOTE: We have tried to make this API analogous to Event bubbling with target and current
 *   properties.
 *
 *   注意：我们已尝试使此 API 类似于使用 target 和 current 属性的事件冒泡。
 *
 *   Note: The ZoneDelegate treats ZoneSpec as class. This allows the ZoneSpec to use its `this` to
 *   store internal state.
 *
 *   注： ZoneDelegate 将 ZoneSpec 视为类。这允许 ZoneSpec 使用其 `this` 来存储内部状态。
 *
 */
interface ZoneDelegate {
  zone: Zone;
  fork(targetZone: Zone, zoneSpec: ZoneSpec): Zone;
  intercept(targetZone: Zone, callback: Function, source: string): Function;
  invoke(targetZone: Zone, callback: Function, applyThis?: any, applyArgs?: any[], source?: string):
      any;
  handleError(targetZone: Zone, error: any): boolean;
  scheduleTask(targetZone: Zone, task: Task): Task;
  invokeTask(targetZone: Zone, task: Task, applyThis?: any, applyArgs?: any[]): any;
  cancelTask(targetZone: Zone, task: Task): any;
  hasTask(targetZone: Zone, isEmpty: HasTaskState): void;
}

type HasTaskState = {
  microTask: boolean; macroTask: boolean; eventTask: boolean; change: TaskType;
};

/**
 * Task type: `microTask`, `macroTask`, `eventTask`.
 *
 * 任务类型： `microTask` 、 `macroTask` 、 `eventTask` 。
 *
 */
type TaskType = 'microTask'|'macroTask'|'eventTask';

/**
 * Task type: `notScheduled`, `scheduling`, `scheduled`, `running`, `canceling`, 'unknown'.
 *
 * 任务类型： `notScheduled` 、 `scheduling` 、 `scheduled` 、 `running` 、 `canceling` 、
 * 'unknown'。
 *
 */
type TaskState = 'notScheduled'|'scheduling'|'scheduled'|'running'|'canceling'|'unknown';


/**
 */
interface TaskData {
  /**
   * A periodic [MacroTask] is such which get automatically rescheduled after it is executed.
   *
   * 周期性的[MacroTask][MacroTask]就是这样的，它会在执行后自动重新调度。
   *
   */
  isPeriodic?: boolean;

  /**
   * Delay in milliseconds when the Task will run.
   *
   * 任务运行时的延迟（以毫秒为单位）。
   *
   */
  delay?: number;

  /**
   * identifier returned by the native setTimeout.
   *
   * 本机 setTimeout 返回的标识符。
   *
   */
  handleId?: number;
}

/**
 * Represents work which is executed with a clean stack.
 *
 * 表示使用干净堆栈执行的工作。
 *
 * Tasks are used in Zones to mark work which is performed on clean stack frame. There are three
 * kinds of task. [MicroTask], [MacroTask], and [EventTask].
 *
 * Zones 中使用任务来标记在干净的堆栈帧上执行的工作。有三种任务。 [MicroTask][MicroTask] 、
 * [MacroTask][MacroTask]和[EventTask][EventTask] 。
 *
 * A JS VM can be modeled as a [MicroTask] queue, [MacroTask] queue, and [EventTask] set.
 *
 * JS VM 可以建模为[MicroTask][MicroTask]队列、
 * [MacroTask][MacroTask]队列和[EventTask][EventTask]集。
 *
 * - [MicroTask] queue represents a set of tasks which are executing right after the current stack
 *   frame becomes clean and before a VM yield. All [MicroTask]s execute in order of insertion
 *   before VM yield and the next [MacroTask] is executed.
 *
 *   [MicroTask][MicroTask]队列表示一组任务，这些任务正在当前堆栈帧变得干净之后、VM
 * 屈服之前执行。所有[MicroTask 都会][MicroTask]按在 VM yield
 * 之前的插入顺序执行，并执行下一个[MacroTask][MacroTask] 。
 *
 * - [MacroTask] queue represents a set of tasks which are executed one at a time after each VM
 *   yield. The queue is ordered by time, and insertions can happen in any location.
 *
 *   [MacroTask][MacroTask]队列表示一组任务，这些任务在每个 VM
 * 屈服之后一次执行一个。队列按时间排序，并且插入可以发生在任何位置。
 *
 * - [EventTask] is a set of tasks which can at any time be inserted to the end of the [MacroTask]
 *   queue. This happens when the event fires.
 *
 *   [EventTask][EventTask]是一组任务，可以随时插入到[MacroTask][MacroTask]队列的末尾。这会在事件触发时发生。
 *
 */
interface Task {
  /**
   * Task type: `microTask`, `macroTask`, `eventTask`.
   *
   * 任务类型： `microTask` 、 `macroTask` 、 `eventTask` 。
   *
   */
  type: TaskType;

  /**
   * Task state: `notScheduled`, `scheduling`, `scheduled`, `running`, `canceling`, `unknown`.
   *
   * 任务状态： `notScheduled` 、 `scheduling` 、已 `scheduled` 、 `running` 、正在 `canceling` 、
   * `unknown` 。
   *
   */
  state: TaskState;

  /**
   * Debug string representing the API which requested the scheduling of the task.
   *
   * 表示请求调度任务的 API 的调试字符串。
   *
   */
  source: string;

  /**
   * The Function to be used by the VM upon entering the [Task]. This function will delegate to
   * [Zone.runTask] and delegate to `callback`.
   *
   * VM 进入[Task][Task]时要使用的 Function 。此函数将委托给[Zone.runTask][Zone.runTask]并委托给
   * `callback` 。
   *
   */
  invoke: Function;

  /**
   * Function which needs to be executed by the Task after the [Zone.currentTask] has been set to
   * the current task.
   *
   * 在[Zone.currentTask][Zone.currentTask]设置为当前任务之后需要由 Task 执行的函数。
   *
   */
  callback: Function;

  /**
   * Task specific options associated with the current task. This is passed to the `scheduleFn`.
   *
   * 与当前任务关联的任务特定选项。这会传递给 `scheduleFn` 。
   *
   */
  data?: TaskData;

  /**
   * Represents the default work which needs to be done to schedule the Task by the VM.
   *
   * 表示为由 VM 调度任务需要完成的默认工作。
   *
   * A zone may choose to intercept this function and perform its own scheduling.
   *
   * 一个区域可以选择截获此函数并执行自己的调度。
   *
   */
  scheduleFn?: (task: Task) => void;

  /**
   * Represents the default work which needs to be done to un-schedule the Task from the VM. Not all
   * Tasks are cancelable, and therefore this method is optional.
   *
   * 表示从 VM 取消调度任务所需完成的默认工作。并非所有任务都是可取消的，因此此方法是可选的。
   *
   * A zone may chose to intercept this function and perform its own un-scheduling.
   *
   * 一个区域可以选择拦截此功能并执行自己的取消调度。
   *
   */
  cancelFn?: (task: Task) => void;

  /**
   * @type {Zone} The zone which will be used to invoke the `callback`. The Zone is captured
   * at the time of Task creation.
   */
  readonly zone: Zone;

  /**
   * Number of times the task has been executed, or -1 if canceled.
   *
   * 任务已执行的次数，如果取消，则为 -1。
   *
   */
  runCount: number;

  /**
   * Cancel the scheduling request. This method can be called from `ZoneSpec.onScheduleTask` to
   * cancel the current scheduling interception. Once canceled the task can be discarded or
   * rescheduled using `Zone.scheduleTask` on a different zone.
   *
   * 取消调度请求。可以从 `ZoneSpec.onScheduleTask`
   * 调用此方法以取消当前的调度拦截。取消后，可以在不同的区域上使用 `Zone.scheduleTask`
   * 来丢弃或重新安排任务。
   *
   */
  cancelScheduleRequest(): void;
}

interface MicroTask extends Task {
  type: 'microTask';
}

interface MacroTask extends Task {
  type: 'macroTask';
}

interface EventTask extends Task {
  type: 'eventTask';
}

/** @internal */
type AmbientZone = Zone;

const Zone: ZoneType = (function(global: any) {
  const performance: {mark(name: string): void; measure(name: string, label: string): void;} =
      global['performance'];
  function mark(name: string) {
    performance && performance['mark'] && performance['mark'](name);
  }
  function performanceMeasure(name: string, label: string) {
    performance && performance['measure'] && performance['measure'](name, label);
  }
  mark('Zone');

  // Initialize before it's accessed below.
  // __Zone_symbol_prefix global can be used to override the default zone
  // symbol prefix with a custom one if needed.
  const symbolPrefix = global['__Zone_symbol_prefix'] || '__zone_symbol__';

  function __symbol__(name: string) {
    return symbolPrefix + name;
  }

  const checkDuplicate = global[__symbol__('forceDuplicateZoneCheck')] === true;
  if (global['Zone']) {
    // if global['Zone'] already exists (maybe zone.js was already loaded or
    // some other lib also registered a global object named Zone), we may need
    // to throw an error, but sometimes user may not want this error.
    // For example,
    // we have two web pages, page1 includes zone.js, page2 doesn't.
    // and the 1st time user load page1 and page2, everything work fine,
    // but when user load page2 again, error occurs because global['Zone'] already exists.
    // so we add a flag to let user choose whether to throw this error or not.
    // By default, if existing Zone is from zone.js, we will not throw the error.
    if (checkDuplicate || typeof global['Zone'].__symbol__ !== 'function') {
      throw new Error('Zone already loaded.');
    } else {
      return global['Zone'];
    }
  }

  class Zone implements AmbientZone {
    // tslint:disable-next-line:require-internal-with-underscore
    static __symbol__: (name: string) => string = __symbol__;

    static assertZonePatched() {
      if (global['Promise'] !== patches['ZoneAwarePromise']) {
        throw new Error(
            'Zone.js has detected that ZoneAwarePromise `(window|global).Promise` ' +
            'has been overwritten.\n' +
            'Most likely cause is that a Promise polyfill has been loaded ' +
            'after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. ' +
            'If you must load one, do so before loading zone.js.)');
      }
    }

    static get root(): AmbientZone {
      let zone = Zone.current;
      while (zone.parent) {
        zone = zone.parent;
      }
      return zone;
    }

    static get current(): AmbientZone {
      return _currentZoneFrame.zone;
    }

    static get currentTask(): Task|null {
      return _currentTask;
    }

    // tslint:disable-next-line:require-internal-with-underscore
    static __load_patch(name: string, fn: _PatchFn, ignoreDuplicate = false): void {
      if (patches.hasOwnProperty(name)) {
        // `checkDuplicate` option is defined from global variable
        // so it works for all modules.
        // `ignoreDuplicate` can work for the specified module
        if (!ignoreDuplicate && checkDuplicate) {
          throw Error('Already loaded patch: ' + name);
        }
      } else if (!global['__Zone_disable_' + name]) {
        const perfName = 'Zone:' + name;
        mark(perfName);
        patches[name] = fn(global, Zone, _api);
        performanceMeasure(perfName, perfName);
      }
    }

    public get parent(): AmbientZone|null {
      return this._parent;
    }

    public get name(): string {
      return this._name;
    }


    private _parent: Zone|null;
    private _name: string;
    private _properties: {[key: string]: any};
    private _zoneDelegate: _ZoneDelegate;

    constructor(parent: Zone|null, zoneSpec: ZoneSpec|null) {
      this._parent = parent;
      this._name = zoneSpec ? zoneSpec.name || 'unnamed' : '<root>';
      this._properties = zoneSpec && zoneSpec.properties || {};
      this._zoneDelegate =
          new _ZoneDelegate(this, this._parent && this._parent._zoneDelegate, zoneSpec);
    }

    public get(key: string): any {
      const zone: Zone = this.getZoneWith(key) as Zone;
      if (zone) return zone._properties[key];
    }

    public getZoneWith(key: string): AmbientZone|null {
      let current: Zone|null = this;
      while (current) {
        if (current._properties.hasOwnProperty(key)) {
          return current;
        }
        current = current._parent;
      }
      return null;
    }

    public fork(zoneSpec: ZoneSpec): AmbientZone {
      if (!zoneSpec) throw new Error('ZoneSpec required!');
      return this._zoneDelegate.fork(this, zoneSpec);
    }

    public wrap<T extends Function>(callback: T, source: string): T {
      if (typeof callback !== 'function') {
        throw new Error('Expecting function got: ' + callback);
      }
      const _callback = this._zoneDelegate.intercept(this, callback, source);
      const zone: Zone = this;
      return function(this: unknown) {
        return zone.runGuarded(_callback, this, <any>arguments, source);
      } as any as T;
    }

    public run(callback: Function, applyThis?: any, applyArgs?: any[], source?: string): any;
    public run<T>(
        callback: (...args: any[]) => T, applyThis?: any, applyArgs?: any[], source?: string): T {
      _currentZoneFrame = {parent: _currentZoneFrame, zone: this};
      try {
        return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
      } finally {
        _currentZoneFrame = _currentZoneFrame.parent!;
      }
    }

    public runGuarded(callback: Function, applyThis?: any, applyArgs?: any[], source?: string): any;
    public runGuarded<T>(
        callback: (...args: any[]) => T, applyThis: any = null, applyArgs?: any[],
        source?: string) {
      _currentZoneFrame = {parent: _currentZoneFrame, zone: this};
      try {
        try {
          return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
        } catch (error) {
          if (this._zoneDelegate.handleError(this, error)) {
            throw error;
          }
        }
      } finally {
        _currentZoneFrame = _currentZoneFrame.parent!;
      }
    }


    runTask(task: Task, applyThis?: any, applyArgs?: any): any {
      if (task.zone != this) {
        throw new Error(
            'A task can only be run in the zone of creation! (Creation: ' +
            (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
      }
      // https://github.com/angular/zone.js/issues/778, sometimes eventTask
      // will run in notScheduled(canceled) state, we should not try to
      // run such kind of task but just return

      if (task.state === notScheduled && (task.type === eventTask || task.type === macroTask)) {
        return;
      }

      const reEntryGuard = task.state != running;
      reEntryGuard && (task as ZoneTask<any>)._transitionTo(running, scheduled);
      task.runCount++;
      const previousTask = _currentTask;
      _currentTask = task;
      _currentZoneFrame = {parent: _currentZoneFrame, zone: this};
      try {
        if (task.type == macroTask && task.data && !task.data.isPeriodic) {
          task.cancelFn = undefined;
        }
        try {
          return this._zoneDelegate.invokeTask(this, task, applyThis, applyArgs);
        } catch (error) {
          if (this._zoneDelegate.handleError(this, error)) {
            throw error;
          }
        }
      } finally {
        // if the task's state is notScheduled or unknown, then it has already been cancelled
        // we should not reset the state to scheduled
        if (task.state !== notScheduled && task.state !== unknown) {
          if (task.type == eventTask || (task.data && task.data.isPeriodic)) {
            reEntryGuard && (task as ZoneTask<any>)._transitionTo(scheduled, running);
          } else {
            task.runCount = 0;
            this._updateTaskCount(task as ZoneTask<any>, -1);
            reEntryGuard &&
                (task as ZoneTask<any>)._transitionTo(notScheduled, running, notScheduled);
          }
        }
        _currentZoneFrame = _currentZoneFrame.parent!;
        _currentTask = previousTask;
      }
    }

    scheduleTask<T extends Task>(task: T): T {
      if (task.zone && task.zone !== this) {
        // check if the task was rescheduled, the newZone
        // should not be the children of the original zone
        let newZone: any = this;
        while (newZone) {
          if (newZone === task.zone) {
            throw Error(`can not reschedule task to ${
                this.name} which is descendants of the original zone ${task.zone.name}`);
          }
          newZone = newZone.parent;
        }
      }
      (task as any as ZoneTask<any>)._transitionTo(scheduling, notScheduled);
      const zoneDelegates: _ZoneDelegate[] = [];
      (task as any as ZoneTask<any>)._zoneDelegates = zoneDelegates;
      (task as any as ZoneTask<any>)._zone = this;
      try {
        task = this._zoneDelegate.scheduleTask(this, task) as T;
      } catch (err) {
        // should set task's state to unknown when scheduleTask throw error
        // because the err may from reschedule, so the fromState maybe notScheduled
        (task as any as ZoneTask<any>)._transitionTo(unknown, scheduling, notScheduled);
        // TODO: @JiaLiPassion, should we check the result from handleError?
        this._zoneDelegate.handleError(this, err);
        throw err;
      }
      if ((task as any as ZoneTask<any>)._zoneDelegates === zoneDelegates) {
        // we have to check because internally the delegate can reschedule the task.
        this._updateTaskCount(task as any as ZoneTask<any>, 1);
      }
      if ((task as any as ZoneTask<any>).state == scheduling) {
        (task as any as ZoneTask<any>)._transitionTo(scheduled, scheduling);
      }
      return task;
    }

    scheduleMicroTask(
        source: string, callback: Function, data?: TaskData,
        customSchedule?: (task: Task) => void): MicroTask {
      return this.scheduleTask(
          new ZoneTask(microTask, source, callback, data, customSchedule, undefined));
    }

    scheduleMacroTask(
        source: string, callback: Function, data?: TaskData, customSchedule?: (task: Task) => void,
        customCancel?: (task: Task) => void): MacroTask {
      return this.scheduleTask(
          new ZoneTask(macroTask, source, callback, data, customSchedule, customCancel));
    }

    scheduleEventTask(
        source: string, callback: Function, data?: TaskData, customSchedule?: (task: Task) => void,
        customCancel?: (task: Task) => void): EventTask {
      return this.scheduleTask(
          new ZoneTask(eventTask, source, callback, data, customSchedule, customCancel));
    }

    cancelTask(task: Task): any {
      if (task.zone != this)
        throw new Error(
            'A task can only be cancelled in the zone of creation! (Creation: ' +
            (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
      (task as ZoneTask<any>)._transitionTo(canceling, scheduled, running);
      try {
        this._zoneDelegate.cancelTask(this, task);
      } catch (err) {
        // if error occurs when cancelTask, transit the state to unknown
        (task as ZoneTask<any>)._transitionTo(unknown, canceling);
        this._zoneDelegate.handleError(this, err);
        throw err;
      }
      this._updateTaskCount(task as ZoneTask<any>, -1);
      (task as ZoneTask<any>)._transitionTo(notScheduled, canceling);
      task.runCount = 0;
      return task;
    }

    private _updateTaskCount(task: ZoneTask<any>, count: number) {
      const zoneDelegates = task._zoneDelegates!;
      if (count == -1) {
        task._zoneDelegates = null;
      }
      for (let i = 0; i < zoneDelegates.length; i++) {
        zoneDelegates[i]._updateTaskCount(task.type, count);
      }
    }
  }

  const DELEGATE_ZS: ZoneSpec = {
    name: '',
    onHasTask:
        (delegate: ZoneDelegate, _: AmbientZone, target: AmbientZone, hasTaskState: HasTaskState):
            void => delegate.hasTask(target, hasTaskState),
    onScheduleTask: (delegate: ZoneDelegate, _: AmbientZone, target: AmbientZone, task: Task):
        Task => delegate.scheduleTask(target, task),
    onInvokeTask:
        (delegate: ZoneDelegate, _: AmbientZone, target: AmbientZone, task: Task, applyThis: any,
         applyArgs: any): any => delegate.invokeTask(target, task, applyThis, applyArgs),
    onCancelTask: (delegate: ZoneDelegate, _: AmbientZone, target: AmbientZone, task: Task): any =>
        delegate.cancelTask(target, task)
  };

  class _ZoneDelegate implements ZoneDelegate {
    public zone: Zone;

    private _taskCounts:
        {microTask: number,
         macroTask: number,
         eventTask: number} = {'microTask': 0, 'macroTask': 0, 'eventTask': 0};

    private _parentDelegate: _ZoneDelegate|null;

    private _forkDlgt: _ZoneDelegate|null;
    private _forkZS: ZoneSpec|null;
    private _forkCurrZone: Zone|null;

    private _interceptDlgt: _ZoneDelegate|null;
    private _interceptZS: ZoneSpec|null;
    private _interceptCurrZone: Zone|null;

    private _invokeDlgt: _ZoneDelegate|null;
    private _invokeZS: ZoneSpec|null;
    private _invokeCurrZone: Zone|null;

    private _handleErrorDlgt: _ZoneDelegate|null;
    private _handleErrorZS: ZoneSpec|null;
    private _handleErrorCurrZone: Zone|null;

    private _scheduleTaskDlgt: _ZoneDelegate|null;
    private _scheduleTaskZS: ZoneSpec|null;
    private _scheduleTaskCurrZone: Zone|null;

    private _invokeTaskDlgt: _ZoneDelegate|null;
    private _invokeTaskZS: ZoneSpec|null;
    private _invokeTaskCurrZone: Zone|null;

    private _cancelTaskDlgt: _ZoneDelegate|null;
    private _cancelTaskZS: ZoneSpec|null;
    private _cancelTaskCurrZone: Zone|null;

    private _hasTaskDlgt: _ZoneDelegate|null;
    private _hasTaskDlgtOwner: _ZoneDelegate|null;
    private _hasTaskZS: ZoneSpec|null;
    private _hasTaskCurrZone: Zone|null;

    constructor(zone: Zone, parentDelegate: _ZoneDelegate|null, zoneSpec: ZoneSpec|null) {
      this.zone = zone;
      this._parentDelegate = parentDelegate;

      this._forkZS = zoneSpec && (zoneSpec && zoneSpec.onFork ? zoneSpec : parentDelegate!._forkZS);
      this._forkDlgt = zoneSpec && (zoneSpec.onFork ? parentDelegate : parentDelegate!._forkDlgt);
      this._forkCurrZone =
          zoneSpec && (zoneSpec.onFork ? this.zone : parentDelegate!._forkCurrZone);

      this._interceptZS =
          zoneSpec && (zoneSpec.onIntercept ? zoneSpec : parentDelegate!._interceptZS);
      this._interceptDlgt =
          zoneSpec && (zoneSpec.onIntercept ? parentDelegate : parentDelegate!._interceptDlgt);
      this._interceptCurrZone =
          zoneSpec && (zoneSpec.onIntercept ? this.zone : parentDelegate!._interceptCurrZone);

      this._invokeZS = zoneSpec && (zoneSpec.onInvoke ? zoneSpec : parentDelegate!._invokeZS);
      this._invokeDlgt =
          zoneSpec && (zoneSpec.onInvoke ? parentDelegate! : parentDelegate!._invokeDlgt);
      this._invokeCurrZone =
          zoneSpec && (zoneSpec.onInvoke ? this.zone : parentDelegate!._invokeCurrZone);

      this._handleErrorZS =
          zoneSpec && (zoneSpec.onHandleError ? zoneSpec : parentDelegate!._handleErrorZS);
      this._handleErrorDlgt =
          zoneSpec && (zoneSpec.onHandleError ? parentDelegate! : parentDelegate!._handleErrorDlgt);
      this._handleErrorCurrZone =
          zoneSpec && (zoneSpec.onHandleError ? this.zone : parentDelegate!._handleErrorCurrZone);

      this._scheduleTaskZS =
          zoneSpec && (zoneSpec.onScheduleTask ? zoneSpec : parentDelegate!._scheduleTaskZS);
      this._scheduleTaskDlgt = zoneSpec &&
          (zoneSpec.onScheduleTask ? parentDelegate! : parentDelegate!._scheduleTaskDlgt);
      this._scheduleTaskCurrZone =
          zoneSpec && (zoneSpec.onScheduleTask ? this.zone : parentDelegate!._scheduleTaskCurrZone);

      this._invokeTaskZS =
          zoneSpec && (zoneSpec.onInvokeTask ? zoneSpec : parentDelegate!._invokeTaskZS);
      this._invokeTaskDlgt =
          zoneSpec && (zoneSpec.onInvokeTask ? parentDelegate! : parentDelegate!._invokeTaskDlgt);
      this._invokeTaskCurrZone =
          zoneSpec && (zoneSpec.onInvokeTask ? this.zone : parentDelegate!._invokeTaskCurrZone);

      this._cancelTaskZS =
          zoneSpec && (zoneSpec.onCancelTask ? zoneSpec : parentDelegate!._cancelTaskZS);
      this._cancelTaskDlgt =
          zoneSpec && (zoneSpec.onCancelTask ? parentDelegate! : parentDelegate!._cancelTaskDlgt);
      this._cancelTaskCurrZone =
          zoneSpec && (zoneSpec.onCancelTask ? this.zone : parentDelegate!._cancelTaskCurrZone);

      this._hasTaskZS = null;
      this._hasTaskDlgt = null;
      this._hasTaskDlgtOwner = null;
      this._hasTaskCurrZone = null;

      const zoneSpecHasTask = zoneSpec && zoneSpec.onHasTask;
      const parentHasTask = parentDelegate && parentDelegate._hasTaskZS;
      if (zoneSpecHasTask || parentHasTask) {
        // If we need to report hasTask, than this ZS needs to do ref counting on tasks. In such
        // a case all task related interceptors must go through this ZD. We can't short circuit it.
        this._hasTaskZS = zoneSpecHasTask ? zoneSpec : DELEGATE_ZS;
        this._hasTaskDlgt = parentDelegate;
        this._hasTaskDlgtOwner = this;
        this._hasTaskCurrZone = zone;
        if (!zoneSpec!.onScheduleTask) {
          this._scheduleTaskZS = DELEGATE_ZS;
          this._scheduleTaskDlgt = parentDelegate!;
          this._scheduleTaskCurrZone = this.zone;
        }
        if (!zoneSpec!.onInvokeTask) {
          this._invokeTaskZS = DELEGATE_ZS;
          this._invokeTaskDlgt = parentDelegate!;
          this._invokeTaskCurrZone = this.zone;
        }
        if (!zoneSpec!.onCancelTask) {
          this._cancelTaskZS = DELEGATE_ZS;
          this._cancelTaskDlgt = parentDelegate!;
          this._cancelTaskCurrZone = this.zone;
        }
      }
    }

    fork(targetZone: Zone, zoneSpec: ZoneSpec): AmbientZone {
      return this._forkZS ? this._forkZS.onFork!(this._forkDlgt!, this.zone, targetZone, zoneSpec) :
                            new Zone(targetZone, zoneSpec);
    }

    intercept(targetZone: Zone, callback: Function, source: string): Function {
      return this._interceptZS ?
          this._interceptZS.onIntercept!
          (this._interceptDlgt!, this._interceptCurrZone!, targetZone, callback, source) :
          callback;
    }

    invoke(
        targetZone: Zone, callback: Function, applyThis: any, applyArgs?: any[],
        source?: string): any {
      return this._invokeZS ? this._invokeZS.onInvoke!
                              (this._invokeDlgt!, this._invokeCurrZone!, targetZone, callback,
                               applyThis, applyArgs, source) :
                              callback.apply(applyThis, applyArgs);
    }

    handleError(targetZone: Zone, error: any): boolean {
      return this._handleErrorZS ?
          this._handleErrorZS.onHandleError!
          (this._handleErrorDlgt!, this._handleErrorCurrZone!, targetZone, error) :
          true;
    }

    scheduleTask(targetZone: Zone, task: Task): Task {
      let returnTask: ZoneTask<any> = task as ZoneTask<any>;
      if (this._scheduleTaskZS) {
        if (this._hasTaskZS) {
          returnTask._zoneDelegates!.push(this._hasTaskDlgtOwner!);
        }
        // clang-format off
        returnTask = this._scheduleTaskZS.onScheduleTask !(
            this._scheduleTaskDlgt !, this._scheduleTaskCurrZone !, targetZone, task) as ZoneTask<any>;
        // clang-format on
        if (!returnTask) returnTask = task as ZoneTask<any>;
      } else {
        if (task.scheduleFn) {
          task.scheduleFn(task);
        } else if (task.type == microTask) {
          scheduleMicroTask(<MicroTask>task);
        } else {
          throw new Error('Task is missing scheduleFn.');
        }
      }
      return returnTask;
    }

    invokeTask(targetZone: Zone, task: Task, applyThis: any, applyArgs?: any[]): any {
      return this._invokeTaskZS ? this._invokeTaskZS.onInvokeTask!
                                  (this._invokeTaskDlgt!, this._invokeTaskCurrZone!, targetZone,
                                   task, applyThis, applyArgs) :
                                  task.callback.apply(applyThis, applyArgs);
    }

    cancelTask(targetZone: Zone, task: Task): any {
      let value: any;
      if (this._cancelTaskZS) {
        value = this._cancelTaskZS.onCancelTask!
                (this._cancelTaskDlgt!, this._cancelTaskCurrZone!, targetZone, task);
      } else {
        if (!task.cancelFn) {
          throw Error('Task is not cancelable');
        }
        value = task.cancelFn(task);
      }
      return value;
    }

    hasTask(targetZone: Zone, isEmpty: HasTaskState) {
      // hasTask should not throw error so other ZoneDelegate
      // can still trigger hasTask callback
      try {
        this._hasTaskZS &&
            this._hasTaskZS.onHasTask!
            (this._hasTaskDlgt!, this._hasTaskCurrZone!, targetZone, isEmpty);
      } catch (err) {
        this.handleError(targetZone, err);
      }
    }

    // tslint:disable-next-line:require-internal-with-underscore
    _updateTaskCount(type: TaskType, count: number) {
      const counts = this._taskCounts;
      const prev = counts[type];
      const next = counts[type] = prev + count;
      if (next < 0) {
        throw new Error('More tasks executed then were scheduled.');
      }
      if (prev == 0 || next == 0) {
        const isEmpty: HasTaskState = {
          microTask: counts['microTask'] > 0,
          macroTask: counts['macroTask'] > 0,
          eventTask: counts['eventTask'] > 0,
          change: type
        };
        this.hasTask(this.zone, isEmpty);
      }
    }
  }

  class ZoneTask<T extends TaskType> implements Task {
    public type: T;
    public source: string;
    public invoke: Function;
    public callback: Function;
    public data: TaskData|undefined;
    public scheduleFn: ((task: Task) => void)|undefined;
    public cancelFn: ((task: Task) => void)|undefined;
    // tslint:disable-next-line:require-internal-with-underscore
    _zone: Zone|null = null;
    public runCount: number = 0;
    // tslint:disable-next-line:require-internal-with-underscore
    _zoneDelegates: _ZoneDelegate[]|null = null;
    // tslint:disable-next-line:require-internal-with-underscore
    _state: TaskState = 'notScheduled';

    constructor(
        type: T, source: string, callback: Function, options: TaskData|undefined,
        scheduleFn: ((task: Task) => void)|undefined, cancelFn: ((task: Task) => void)|undefined) {
      this.type = type;
      this.source = source;
      this.data = options;
      this.scheduleFn = scheduleFn;
      this.cancelFn = cancelFn;
      if (!callback) {
        throw new Error('callback is not defined');
      }
      this.callback = callback;
      const self = this;
      // TODO: @JiaLiPassion options should have interface
      if (type === eventTask && options && (options as any).useG) {
        this.invoke = ZoneTask.invokeTask;
      } else {
        this.invoke = function() {
          return ZoneTask.invokeTask.call(global, self, this, <any>arguments);
        };
      }
    }

    static invokeTask(task: any, target: any, args: any): any {
      if (!task) {
        task = this;
      }
      _numberOfNestedTaskFrames++;
      try {
        task.runCount++;
        return task.zone.runTask(task, target, args);
      } finally {
        if (_numberOfNestedTaskFrames == 1) {
          drainMicroTaskQueue();
        }
        _numberOfNestedTaskFrames--;
      }
    }

    get zone(): Zone {
      return this._zone!;
    }

    get state(): TaskState {
      return this._state;
    }

    public cancelScheduleRequest() {
      this._transitionTo(notScheduled, scheduling);
    }

    // tslint:disable-next-line:require-internal-with-underscore
    _transitionTo(toState: TaskState, fromState1: TaskState, fromState2?: TaskState) {
      if (this._state === fromState1 || this._state === fromState2) {
        this._state = toState;
        if (toState == notScheduled) {
          this._zoneDelegates = null;
        }
      } else {
        throw new Error(`${this.type} '${this.source}': can not transition to '${
            toState}', expecting state '${fromState1}'${
            fromState2 ? ' or \'' + fromState2 + '\'' : ''}, was '${this._state}'.`);
      }
    }

    public toString() {
      if (this.data && typeof this.data.handleId !== 'undefined') {
        return this.data.handleId.toString();
      } else {
        return Object.prototype.toString.call(this);
      }
    }

    // add toJSON method to prevent cyclic error when
    // call JSON.stringify(zoneTask)
    public toJSON() {
      return {
        type: this.type,
        state: this.state,
        source: this.source,
        zone: this.zone.name,
        runCount: this.runCount
      };
    }
  }


  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  ///  MICROTASK QUEUE
  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  const symbolSetTimeout = __symbol__('setTimeout');
  const symbolPromise = __symbol__('Promise');
  const symbolThen = __symbol__('then');
  let _microTaskQueue: Task[] = [];
  let _isDrainingMicrotaskQueue: boolean = false;
  let nativeMicroTaskQueuePromise: any;

  function nativeScheduleMicroTask(func: Function) {
    if (!nativeMicroTaskQueuePromise) {
      if (global[symbolPromise]) {
        nativeMicroTaskQueuePromise = global[symbolPromise].resolve(0);
      }
    }
    if (nativeMicroTaskQueuePromise) {
      let nativeThen = nativeMicroTaskQueuePromise[symbolThen];
      if (!nativeThen) {
        // native Promise is not patchable, we need to use `then` directly
        // issue 1078
        nativeThen = nativeMicroTaskQueuePromise['then'];
      }
      nativeThen.call(nativeMicroTaskQueuePromise, func);
    } else {
      global[symbolSetTimeout](func, 0);
    }
  }

  function scheduleMicroTask(task?: MicroTask) {
    // if we are not running in any task, and there has not been anything scheduled
    // we must bootstrap the initial task creation by manually scheduling the drain
    if (_numberOfNestedTaskFrames === 0 && _microTaskQueue.length === 0) {
      // We are not running in Task, so we need to kickstart the microtask queue.
      nativeScheduleMicroTask(drainMicroTaskQueue);
    }
    task && _microTaskQueue.push(task);
  }

  function drainMicroTaskQueue() {
    if (!_isDrainingMicrotaskQueue) {
      _isDrainingMicrotaskQueue = true;
      while (_microTaskQueue.length) {
        const queue = _microTaskQueue;
        _microTaskQueue = [];
        for (let i = 0; i < queue.length; i++) {
          const task = queue[i];
          try {
            task.zone.runTask(task, null, null);
          } catch (error) {
            _api.onUnhandledError(error as Error);
          }
        }
      }
      _api.microtaskDrainDone();
      _isDrainingMicrotaskQueue = false;
    }
  }

  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  ///  BOOTSTRAP
  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////


  const NO_ZONE = {name: 'NO ZONE'};
  const notScheduled: 'notScheduled' = 'notScheduled', scheduling: 'scheduling' = 'scheduling',
                      scheduled: 'scheduled' = 'scheduled', running: 'running' = 'running',
                      canceling: 'canceling' = 'canceling', unknown: 'unknown' = 'unknown';
  const microTask: 'microTask' = 'microTask', macroTask: 'macroTask' = 'macroTask',
                   eventTask: 'eventTask' = 'eventTask';

  const patches: {[key: string]: any} = {};
  const _api: _ZonePrivate = {
    symbol: __symbol__,
    currentZoneFrame: () => _currentZoneFrame,
    onUnhandledError: noop,
    microtaskDrainDone: noop,
    scheduleMicroTask: scheduleMicroTask,
    showUncaughtError: () => !(Zone as any)[__symbol__('ignoreConsoleErrorUncaughtError')],
    patchEventTarget: () => [],
    patchOnProperties: noop,
    patchMethod: () => noop,
    bindArguments: () => [],
    patchThen: () => noop,
    patchMacroTask: () => noop,
    patchEventPrototype: () => noop,
    isIEOrEdge: () => false,
    getGlobalObjects: () => undefined,
    ObjectDefineProperty: () => noop,
    ObjectGetOwnPropertyDescriptor: () => undefined,
    ObjectCreate: () => undefined,
    ArraySlice: () => [],
    patchClass: () => noop,
    wrapWithCurrentZone: () => noop,
    filterProperties: () => [],
    attachOriginToPatched: () => noop,
    _redefineProperty: () => noop,
    patchCallbacks: () => noop,
    nativeScheduleMicroTask: nativeScheduleMicroTask
  };
  let _currentZoneFrame: _ZoneFrame = {parent: null, zone: new Zone(null, null)};
  let _currentTask: Task|null = null;
  let _numberOfNestedTaskFrames = 0;

  function noop() {}

  performanceMeasure('Zone', 'Zone');
  return global['Zone'] = Zone;
})(typeof window !== 'undefined' && window || typeof self !== 'undefined' && self || global);

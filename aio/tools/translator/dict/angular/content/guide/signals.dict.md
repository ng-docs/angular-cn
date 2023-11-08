Angular Signals

Angular 信号（Signal）

**Angular Signals** is a system that granularly tracks how and where your state is used throughout an application, allowing the framework to optimize
rendering updates.

**Angular 信号（Signal）**是一个体系，可以精细地跟踪你的状态在整个应用程序中的使用方式和位置，从而允许框架优化渲染更新。

What are signals?

什么是信号？

A **signal** is a wrapper around a value that can notify interested consumers when that value changes. Signals can contain any value, from simple primitives to complex data structures.

**信号**是一个值的包装器，可以在该值发生变化时通知感兴趣的消费者。信号可以包含任何值，从简单的原语到复杂的数据结构。

A signal's value is always read through a getter function, which allows Angular to track where the signal is used.

信号的值总会通过 getter 函数读取，这使得 Angular 可以跟踪信号的使用位置。

Signals may be either _writable_ or _read-only_.

信号可以是**可写的**或**只读的**。

Writable signals

可写信号

Writable signals provide an API for updating their values directly. You create writable signals by calling the `signal` function with the signal's initial value:

可写信号提供了一个 API 来直接更新它们的值。你可以通过使用信号的初始值调用 `signal` 函数来创建可写信号：

To change the value of a writable signal, you can either `.set()` it directly:

要更改可写信号的值，你可以直接 `.set()`：

or use the `.update()` operation to compute a new value from the previous one:

或者使用 `.update()` 操作从前一个值计算出一个新值：

When working with signals that contain objects, it's sometimes useful to mutate that object directly. For example, if the object is an array, you may want to push a new value without replacing the array entirely. To make an internal change like this, use the `.mutate` method:

在处理包含对象的信号时，有时直接改变该对象很有用。例如，如果对象是一个数组，你可能希望在不完全替换数组的情况下推送一个新值。要进行这样的内部更改，请使用 `.mutate` 方法：

Writable signals have the type `WritableSignal`.

可写信号的类型为 `WritableSignal`。

Computed signals

计算（computed）信号

A **computed signal** derives its value from other signals. Define one using `computed` and specifying a derivation function:

**计算信号**是从其他信号中派生出来的。可以使用 `computed` 并指定推导函数来定义一个：

The `doubleCount` signal depends on `count`. Whenever `count` updates, Angular knows that anything which depends on either `count` or `doubleCount` needs to update as well.

`doubleCount` 信号取决于 `count`。每当 `count` 更新时，Angular 知道任何依赖于 `count` 或 `doubleCount` 东西也需要更新。

Computeds are both lazily evaluated and memoized

计算信号都是惰性计算和记忆的

`doubleCount`'s derivation function does not run to calculate its value until the first time `doubleCount` is read. Once calculated, this value is cached, and future reads of `doubleCount` will return the cached value without recalculating.

在第一次读取 `doubleCount` 之前，不会运行 `doubleCount` 的派生函数以计算其值。一旦计算出来，这个值就会被缓存起来，以后读取 `doubleCount` 将返回缓存的值而不用重新计算。

When `count` changes, it tells `doubleCount` that its cached value is no longer valid, and the value is only recalculated on the next read of `doubleCount`.

当 `count` 发生变化时，它会告诉 `doubleCount` 它的缓存值不再有效，并且该值只会在下一次读取 `doubleCount` 时重新计算。

As a result, it's safe to perform computationally expensive derivations in computed signals, such as filtering arrays.

因此，在计算信号中执行计算量大的推导（例如过滤数组）是相当安全的。

Computed signals are not writable signals

计算信号不是可写信号

You cannot directly assign values to a computed signal. That is,

你不能直接为计算信号赋值。比如，

produces a compilation error, because `doubleCount` is not a `WritableSignal`.

会产生编译错误，因为 `doubleCount` 不是 `WritableSignal`。

Computed signal dependencies are dynamic

计算信号的依赖性是动态的

Only the signals actually read during the derivation are tracked. For example, in this computed the `count` signal is only read conditionally:

只能跟踪推导期间实际读取过的信号。例如，在此计算中，只会有条件地读取 `count` 信号：

When reading `conditionalCount`, if `showCount` is `false` the "Nothing to see here!" message is returned _without_ reading the `count` signal. This means that updates to `count` will not result in a recomputation.

读取 `conditionalCount` 时，如果 `showCount` 为 `false`，则**没有**读取 `count` 信号就返回了消息 “Nothing to see here!”。这意味着对 `count` 的更新不会导致重新计算。

If `showCount` is later set to `true` and `conditionalCount` is read again, the derivation will re-execute and take the branch where `showCount` is `true`, returning the message which shows the value of `count`. Changes to `count` will then invalidate `conditionalCount`'s cached value.

如果稍后将 `showCount` 设置为 `true` 并再次读取 `conditionalCount`，则将重新执行派生并采用 `showCount` 为 `true` 的分支，返回显示 `count` 值的消息。对 `count` 的更改将使 `conditionalCount` 的缓存值无效。

Note that dependencies can be removed as well as added. If `showCount` is later set to `false` again, then `count` will no longer be considered a dependency of `conditionalCount`.

请注意，可以删除和添加依赖项。如果 `showCount` 稍后再次设置为 `false`，则 `count` 将不再被视为 `conditionalCount` 的依赖项。

Reading signals in `OnPush` components

在 `OnPush` 型组件中读取信号

When an `OnPush` component uses a signal's value in its template, Angular will track the signal as a dependency of that component. When that signal is updated, Angular automatically [marks](/api/core/ChangeDetectorRef#markforcheck) the component to ensure it gets updated the next time change detection runs. Refer to the [Skipping component subtrees](/guide/change-detection-skipping-subtrees) guide for more information about `OnPush` components.

当 `OnPush` 组件在其模板中使用信号值时，Angular 会将信号作为该组件的依赖项进行跟踪。当该信号更新时，Angular 会自动[标记](/api/core/ChangeDetectorRef#markforcheck)组件以确保它在下次运行变更检测时得到更新。有关 `OnPush` 组件的更多信息，请参阅[跳过组件子树](/guide/change-detection-skipping-subtrees)指南。

Effects

副作用（effect）

Signals are useful because they can notify interested consumers when they change. An **effect** is an operation that runs whenever one or more signal values change. You can create an effect with the `effect` function:

信号很有用，因为它们可以在变化时通知感兴趣的消费者。**副作用**是一种操作，只要一个或多个信号值发生变化就会运行。你可以使用 `effect` 函数创建副作用：

Effects always run **at least once.** When an effect runs, it tracks any signal value reads. Whenever any of these signal values change, the effect runs again. Similar to computed signals, effects keep track of their dependencies dynamically, and only track signals which were read in the most recent execution.

副作用**至少会运行一次。** 当副作用运行时，它会跟踪任何信号值读取。只要这些信号值中的任何一个发生变化，副作用就会再次运行。与计算信号类似，副作用会动态跟踪它们的依赖关系，并且仅跟踪在最近一次执行中读取的信号。

Effects always execute **asynchronously**, during the change detection process.

在变化检测过程中，副作用始终**异步**执行。

Uses for effects

何时使用副作用

Effects are rarely needed in most application code, but may be useful in specific circumstances. Here are some examples of situations where an `effect` might be a good solution:

在大多数应用程序代码中很少需要副作用，但在特定情况下可能会有用。下面是一些需要以 `effect` 作为解决方案的例子：

Logging data being displayed and when it changes, either for analytics or as a debugging tool

记录正在显示的数据及其更改时间，用于分析或作为调试工具

Keeping data in sync with `window.localStorage`

在数据与 `window.localStorage` 之间保持同步

Adding custom DOM behavior that can't be expressed with template syntax

添加无法用模板语法表达的自定义 DOM 行为

Performing custom rendering to a `<canvas>`, charting library, or other third party UI library

对 `<canvas>`、图表库或其他第三方 UI 库执行自定义渲染

When not to use effects

何时不使用副作用

Avoid using effects for propagation of state changes. This can result in `ExpressionChangedAfterItHasBeenChecked` errors, infinite circular updates, or unnecessary change detection cycles.

要避免使用副作用来传播状态变更。这可能会导致 `ExpressionChangedAfterItHasBeenChecked` 错误、导致无限循环更新或导致不必要的变更检测周期。

Because of these risks, setting signals is disallowed by default in effects, but can be enabled if absolutely necessary.

由于存在这些风险，在副作用中默认不允许设置信号，但在绝对必要时也可以启用。

Injection context

注入上下文

By default, registering a new effect with the `effect()` function requires an "injection context" \(access to the `inject` function\). The easiest way to provide this is to call `effect` within a component, directive, or service `constructor`:

默认情况下，使用 `effect()` 函数注册新的副作用需要“注入上下文”（访问 `inject` 函数）。提供此功能的最简单方法是在组件、指令或服务的 `constructor` 中调用 `effect`：

Alternatively, the effect can be assigned to a field \(which also gives it a descriptive name\).

或者，可以将副作用赋值给一个字段（这也会为其提供一个描述性名称）。

To create an effect outside of the constructor, you can pass an `Injector` to `effect` via its options:

要在构造函数之外创建副作用，你可以通过 `effect` 的选项传递 `Injector` 以产生 `effect`：

Destroying effects

销毁副作用

When you create an effect, it is automatically destroyed when its enclosing context is destroyed. This means that effects created within components are destroyed when the component is destroyed. The same goes for effects within directives, services, etc.

当你创建一个副作用时，它会在其闭包上下文被销毁时自动销毁。这意味着当组件被销毁时，在组件内创建的副作用也会被销毁。指令、服务等中的副作用也是如此。

Effects return an `EffectRef` that can be used to destroy them manually, via the `.destroy()` operation. This can also be combined with the `manualCleanup` option to create an effect that lasts until it is manually destroyed. Be careful to actually clean up such effects when they're no longer required.

副作用返回一个 `EffectRef`，可用于通过 `.destroy()` 操作手动销毁它们。这也可以与 `manualCleanup` 选项结合使用，以创建持续到手动销毁为止的副作用。当不再需要这些副作用时，要小心地实际清理它们。

Advanced topics

高级主题

Signal equality functions

信号相等性判定函数

When creating a signal, you can optionally provide an equality function, which will be used to check whether the new value is actually different than the previous one.

创建信号时，你可以选择提供相等性判定函数，该函数将用于检查新值是否真的与前一个值不同。

Equality functions can be provided to both writable and computed signals.

可以为可写信号和计算信号提供相等性判定函数。

For writable signals, `.mutate()` does not check for equality because it mutates the current value without producing a new reference.

对于可写信号，`.mutate()` 不会检查相等性，因为它改变了当前值而不会产生新的引用。

Reading without tracking dependencies

阅读而不跟踪依赖关系

Rarely, you may want to execute code which may read signals in a reactive function such as `computed` or `effect` _without_ creating a dependency.

在极少数情况下，你可能希望在响应式函数（如`computed`或`effect`）中执行可能读取信号的代码，但**不希望**创建一个依赖项。

For example, suppose that when `currentUser` changes, the value of a `counter` should be logged. Creating an `effect` which reads both signals:

例如，假设当 `currentUser` 发生变化时，应该记录 `counter` 的值。创建读取这两个信号的 `effect`：

This example logs a message when _either_ `currentUser` or `counter` changes. However, if the effect should only run when `currentUser` changes, then the read of `counter` is only incidental and changes to `counter` shouldn't log a new message.

此示例会在 `counter` 或 `currentUser` 发生变化时，记录一条消息。但是，如果副作用只应该在 `currentUser` 更改时才运行，则只会偶尔读取 `counter`，因此对 `counter` 的更改不应记录新消息。

You can prevent a signal read from being tracked by calling its getter with `untracked`:

你可以通过使用 `untracked` 调用其 getter 来防止对信号的读取被跟踪：

`untracked` is also useful when an effect needs to invoke some external code which shouldn't be treated as a dependency:

当副作用需要调用一些不应被视为依赖项的外部代码时，`untracked` 也很有用：

Effect cleanup functions

副作用清理函数

Effects might start long-running operations, which should be cancelled if the effect is destroyed or runs again before the first operation finished. When you create an effect, your function can optionally accept an `onCleanup` function as its first parameter. This `onCleanup` function lets you register a callback that is invoked before the next run of the effect begins, or when the effect is destroyed.

副作用可能会启动长时间运行的操作，如果副作用在第一个操作完成之前就被销毁或再次运行，则应取消该操作。创建副作用时，你的函数可以用 `onCleanup` 函数作为其第一个参数。这个 `onCleanup` 函数允许你注册一个回调，该回调在副作用的下一次运行开始之前或副作用被销毁时调用。
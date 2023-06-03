# Angular Signals

# 角度信号

**Angular Signals** is a system that granularly tracks how and where your state is used throughout an application, allowing the framework to optimize
rendering updates.

**Angular Signals**是一个系统，可以精细地跟踪您的状态在整个应用程序中的使用方式和位置，从而允许框架优化渲染更新。

<div class="alert is-important">

Angular signals are available for [developer preview](/guide/releases#developer-preview). They're ready for you to try, but may change before they are stable.

</div>

## What are signals?

## 什么是信号？

A **signal** is a wrapper around a value that can notify interested consumers when that value changes. Signals can contain any value, from simple primitives to complex data structures.

**信号**是一个值的包装器，可以在该值发生变化时通知感兴趣的消费者。 信号可以包含任何值，从简单的原语到复杂的数据结构。

A signal's value is always read through a getter function, which allows Angular to track where the signal is used.

信号的值总是通过 getter 函数读取，这使得 Angular 可以跟踪信号的使用位置。

Signals may be either _writable_ or _read-only_.

信号可以是可 _ 写的 _ 或 _ 只读的 _。

### Writable signals

### 可写信号

Writable signals provide an API for updating their values directly. You create writable signals by calling the `signal` function with the signal's initial value:

可写信号提供了一个 API 来直接更新它们的值。 您可以通过使用信号的初始值调用 `signal` 函数来创建可写信号：

```ts
const count = signal(0);

// Signals are getter functions - calling them reads their value.
console.log('The count is: ' + count());
```

To change the value of a writable signal, you can either `.set()` it directly:

要更改可写信号的值，您可以直接 `.set()` ：

```ts
count.set(3);
```

or use the `.update()` operation to compute a new value from the previous one:

或者使用 `.update()` 操作从前一个值计算一个新值：

```ts
// Increment the count by 1.
count.update(value => value + 1);
```

When working with signals that contain objects, it's sometimes useful to mutate that object directly. For example, if the object is an array, you may want to push a new value without replacing the array entirely. To make an internal change like this, use the `.mutate` method:

在处理包含对象的信号时，有时直接改变该对象很有用。 例如，如果对象是一个数组，您可能希望在不完全替换数组的情况下推送一个新值。 要进行这样的内部更改，请使用 `.mutate` 方法：

```ts
const todos = signal([{title: 'Learn signals', done: false}]);

todos.mutate(value => {
  // Change the first TODO in the array to 'done: true' without replacing it.
  value[0].done = true;
});
```

Writable signals have the type `WritableSignal`.

可写信号的类型为 `WritableSignal` 。

### Computed signals

### 计算信号

A **computed signal** derives its value from other signals. Define one using `computed` and specifying a derivation function:

**计算信号**从其他信号中获取其值。 使用 `computed` 并指定推导函数定义一个：

```typescript
const count: WritableSignal<number> = signal(0);
const doubleCount: Signal<number> = computed(() => count() * 2);
```

The `doubleCount` signal depends on `count`. Whenever `count` updates, Angular knows that anything which depends on either `count` or `doubleCount` needs to update as well.

`doubleCount` 信号取决于 `count` 。 每当 `count` 更新时，Angular 知道任何依赖于 `count` 或 `doubleCount` 东西也需要更新。

#### Computeds are both lazily evaluated and memoized

#### Computeds 都被惰性评估和记忆

`doubleCount`'s derivation function does not run to calculate its value until the first time `doubleCount` is read. Once calculated, this value is cached, and future reads of `doubleCount` will return the cached value without recalculating.

在第一次读取 `doubleCount` 之前， `doubleCount` 的派生函数不会运行以计算其值。 一旦计算出来，这个值就被缓存起来，以后读取 `doubleCount` 将返回缓存的值而不用重新计算。

When `count` changes, it tells `doubleCount` that its cached value is no longer valid, and the value is only recalculated on the next read of `doubleCount`.

当 `count` 发生变化时，它会告诉 `doubleCount` 它的缓存值不再有效，并且该值只会在下一次读取 `doubleCount` 时重新计算。

As a result, it's safe to perform computationally expensive derivations in computed signals, such as filtering arrays.

因此，在计算信号中执行计算量大的推导是安全的，例如过滤数组。

#### Computed signals are not writable signals

#### 计算信号不是可写信号

You cannot directly assign values to a computed signal. That is,

您不能直接为计算信号赋值。 那是，

```ts
doubleCount.set(3);
```

produces a compilation error, because `doubleCount` is not a `WritableSignal`.

产生编译错误，因为 `doubleCount` 不是 `WritableSignal` 。

#### Computed signal dependencies are dynamic

#### 计算出的信号相关性是动态的

Only the signals actually read during the derivation are tracked. For example, in this computed the `count` signal is only read conditionally:

仅跟踪推导期间实际读取的信号。 例如，在此计算中，仅有条件地读取 `count` 信号：

```ts
const showCount = signal(false);
const count = signal(0);
const conditionalCount = computed(() => {
  if (showCount()) {
    return `The count is ${count()}.`;
  } else {
    return 'Nothing to see here!';
  }
});
```

When reading `conditionalCount`, if `showCount` is `false` the "Nothing to see here!" message is returned _without_ reading the `count` signal. This means that updates to `count` will not result in a recomputation.

读取 `conditionalCount` 时，如果 `showCount` 为 `false` ，则“Nothing to see here!” _ 不 _ 读取 `count` 信号就返回消息。 这意味着对 `count` 的更新不会导致重新计算。

If `showCount` is later set to `true` and `conditionalCount` is read again, the derivation will re-execute and take the branch where `showCount` is `true`, returning the message which shows the value of `count`. Changes to `count` will then invalidate `conditionalCount`'s cached value.

如果稍后将 `showCount` 设置为 `true` 并再次读取 `conditionalCount` ，则派生将重新执行并采用 `showCount` 为 `true` 分支，返回显示 `count` 值的消息。 对 `count` 的更改将使 `conditionalCount` 的缓存值无效。

Note that dependencies can be removed as well as added. If `showCount` is later set to `false` again, then `count` will no longer be considered a dependency of `conditionalCount`.

请注意，可以删除和添加依赖项。 如果 `showCount` 稍后再次设置为 `false` ，则 `count` 将不再被视为 `conditionalCount` 的依赖项。

## Reading signals in `OnPush` components

## 在 `OnPush` 组件中读取信号

When an `OnPush` component uses a signal's value in its template, Angular will track the signal as a dependency of that component. When that signal is updated, Angular automatically [marks](/api/core/ChangeDetectorRef#markforcheck) the component to ensure it gets updated the next time change detection runs. Refer to the [Skipping component subtrees](/guide/change-detection-skipping-subtrees) guide for more information about `OnPush` components.

当 `OnPush` 组件在其模板中使用信号值时，Angular 会将信号作为该组件的依赖项进行跟踪。 当该信号更新时，Angular 会自动[标记](/api/core/ChangeDetectorRef#markforcheck)组件以确保它在下次运行更改检测时得到更新。 有关 `OnPush` 组件的更多信息，请参阅[跳过组件子树](/guide/change-detection-skipping-subtrees)指南。

## Effects

## 效果

Signals are useful because they can notify interested consumers when they change. An **effect** is an operation that runs whenever one or more signal values change. You can create an effect with the `effect` function:

信号很有用，因为它们可以在变化时通知感兴趣的消费者。 **效果**是一种操作，只要一个或多个信号值发生变化就会运行。 您可以使用 `effect` 函数创建效果：

```ts
effect(() => {
  console.log(`The current count is: ${count()}`);
});
```

Effects always run **at least once.** When an effect runs, it tracks any signal value reads. Whenever any of these signal values change, the effect runs again. Similar to computed signals, effects keep track of their dependencies dynamically, and only track signals which were read in the most recent execution.

效果总是**至少运行一次。** 当效果器运行时，它会跟踪任何信号值读取。 只要这些信号值中的任何一个发生变化，效果就会再次运行。 与计算信号类似，效果动态跟踪它们的依赖关系，并且仅跟踪在最近执行中读取的信号。

Effects always execute **asynchronously**, during the change detection process.

在变化检测过程中，效果始终**异步**执行。

### Uses for effects

### 用于效果

Effects are rarely needed in most application code, but may be useful in specific circumstances. Here are some examples of situations where an `effect` might be a good solution:

在大多数应用程序代码中很少需要效果，但在特定情况下可能会有用。 下面是一些 `effect` 可能是好的解决方案的例子：

* Logging data being displayed and when it changes, either for analytics or as a debugging tool

  记录正在显示的数据及其更改时间，用于分析或作为调试工具

* Keeping data in sync with `window.localStorage`

  保持数据与 `window.localStorage` 同步

* Adding custom DOM behavior that can't be expressed with template syntax

  添加无法用模板语法表达的自定义 DOM 行为

* Performing custom rendering to a `<canvas>`, charting library, or other third party UI library

  对 `<canvas>` 、图表库或其他第三方 UI 库执行自定义渲染

#### When not to use effects

#### 什么时候不使用效果器

Avoid using effects for propagation of state changes. This can result in `ExpressionChangedAfterItHasBeenChecked` errors, infinite circular updates, or unnecessary change detection cycles.

避免使用效果来传播状态变化。 这可能会导致 `ExpressionChangedAfterItHasBeenChecked` 错误、无限循环更新或不必要的更改检测周期。

Because of these risks, setting signals is disallowed by default in effects, but can be enabled if absolutely necessary.

由于存在这些风险，在效果中默认不允许设置信号，但在绝对必要时可以启用。

### Injection context

### 注入上下文

By default, registering a new effect with the `effect()` function requires an "injection context" \(access to the `inject` function\). The easiest way to provide this is to call `effect` within a component, directive, or service `constructor`:

默认情况下，使用 `effect()` 函数注册新效果需要“注入上下文”（访问 `inject` 函数）。 提供此功能的最简单方法是在组件、指令或服务 `constructor` 中调用 `effect` ：

```ts
@Component({...})
export class EffectiveCounterCmp {
  readonly count = signal(0);
  constructor() {
    // Register a new effect.
    effect(() => {
      console.log(`The count is: ${this.count()})`);
    });
  }
}
```

Alternatively, the effect can be assigned to a field \(which also gives it a descriptive name\).

或者，可以将效果分配给一个字段（这也为其提供了一个描述性名称）。

```ts
@Component({...})
export class EffectiveCounterCmp {
  readonly count = signal(0);
  
  private loggingEffect = effect(() => {
    console.log(`The count is: ${this.count()})`);
  });
}
```

To create an effect outside of the constructor, you can pass an `Injector` to `effect` via its options:

要在构造函数之外创建效果，您可以通过其选项传递 `Injector` 以产生 `effect` ：

```ts
@Component({...})
export class EffectiveCounterCmp {
  readonly count = signal(0);
  constructor(private injector: Injector) {}

  initializeLogging(): void {
    effect(() => {
      console.log(`The count is: ${this.count()})`);
    }, {injector: this.injector});
  }
}
```

### Destroying effects

### 破坏效果

When you create an effect, it is automatically destroyed when its enclosing context is destroyed. This means that effects created within components are destroyed when the component is destroyed. The same goes for effects within directives, services, etc.

当您创建一个效果时，它会在其封闭上下文被销毁时自动销毁。 这意味着当组件被销毁时，在组件内创建的效果也会被销毁。 指令、服务等中的效果也是如此。

Effects return an `EffectRef` that can be used to destroy them manually, via the `.destroy()` operation. This can also be combined with the `manualCleanup` option to create an effect that lasts until it is manually destroyed. Be careful to actually clean up such effects when they're no longer required.

效果返回一个 `EffectRef` ，可用于通过 `.destroy()` 操作手动销毁它们。 这也可以与 `manualCleanup` 选项结合使用，以创建持续到手动销毁为止的效果。 当不再需要这些效果时，请小心实际清理它们。

## Advanced topics

## 高级主题

### Signal equality functions

### 信号相等函数

When creating a signal, you can optionally provide an equality function, which will be used to check whether the new value is actually different than the previous one.

创建信号时，您可以选择提供相等函数，该函数将用于检查新值是否实际上与前一个值不同。

```ts
import _ from 'lodash';

const data = signal(['test'], {equal: _.isEqual});

// Even though this is a different array instance, the deep equality
// function will consider the values to be equal, and the signal won't
// trigger any updates.
data.set(['test']);
```

Equality functions can be provided to both writable and computed signals.

可以为可写信号和计算信号提供相等函数。

For writable signals, `.mutate()` does not check for equality because it mutates the current value without producing a new reference.

对于可写信号， `.mutate()` 不检查相等性，因为它改变了当前值而不产生新的引用。

### Reading without tracking dependencies

### 阅读而不跟踪依赖关系

Rarely, you may want to execute code which may read signals in a reactive function such as `computed` or `effect` _without_ creating a dependency.

在极少数情况下，您可能希望执行可以 _ 在不 _ 创建依赖项的情况下读取反应函数（例如 `computed` 或 `effect` 中的信号的代码。

For example, suppose that when `currentUser` changes, the value of a `counter` should be logged. Creating an `effect` which reads both signals:

例如，假设当 `currentUser` 发生变化时，应该记录 `counter` 的值。 创建读取两个信号的 `effect` ：

```ts
effect(() => {
  console.log(`User set to `${currentUser()}` and the counter is ${counter()}`);
});
```

This example logs a message when _either_ `currentUser` or `counter` changes. However, if the effect should only run when `currentUser` changes, then the read of `counter` is only incidental and changes to `counter` shouldn't log a new message.

此示例在 _currentUser_ 或 `counter` 更改 `currentUser` 记录一条消息。 但是，如果效果只应在 `currentUser` 更改时运行，则读取 `counter` 只是偶然的，对 `counter` 的更改不应记录新消息。

You can prevent a signal read from being tracked by calling its getter with `untracked`:

您可以通过使用 `untracked` 调用其 getter 来防止信号读取被跟踪：

```ts
effect(() => {
  console.log(`User set to `${currentUser()}` and the counter is ${untracked(counter)}`);
});
```

`untracked` is also useful when an effect needs to invoke some external code which shouldn't be treated as a dependency:

当效果需要调用一些不应被视为依赖项的外部代码时， `untracked` 也很有用：

```ts
effect(() => {
  const user = currentUser();
  untracked(() => {
    // If the `loggingService` reads signals, they won't be counted as
    // dependencies of this effect.
    this.loggingService.log(`User set to ${user}`);
  });
});
```

### Effect cleanup functions

### 影响清理功能

Effects might start long-running operations, which should be cancelled if the effect is destroyed or runs again before the first operation finished. When you create an effect, your function can optionally accept an `onCleanup` function as its first parameter. This `onCleanup` function lets you register a callback that is invoked before the next run of the effect begins, or when the effect is destroyed.

效果可能会启动长时间运行的操作，如果效果在第一个操作完成之前被破坏或再次运行，则应取消该操作。 创建效果时，您的函数可以选择接受 `onCleanup` 函数作为其第一个参数。 这个 `onCleanup` 函数允许您注册一个回调，该回调在效果的下一次运行开始之前或效果被销毁时调用。

```ts
effect((onCleanup) => {
  const user = currentUser();

  const timer = setTimeout(() => {
    console.log(`1 second ago, the user became ${user}`);
  }, 1000);

  onCleanup(() => {
    clearTimeout(timer);
  });
});
```

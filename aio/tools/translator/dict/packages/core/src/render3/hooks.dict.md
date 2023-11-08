The index of the directive in LView

LView 中指令的索引

The definition containing the hooks to setup in tView

包含要在 tView 中设置的钩子的定义

The current TView

当前的 TView

Adds all directive lifecycle hooks from the given `DirectiveDef` to the given `TView`.

将给定 `DirectiveDef` 中的所有指令生命周期钩子添加到给定的 `TView`。

Must be run *only* on the first template pass.

必须*仅*在第一个模板传递上运行。

Sets up the pre-order hooks on the provided `tView`,
see {&commat;link HookData} for details about the data structure.

在提供的 `tView` 上设置预购钩子，有关数据结构的详细信息，请参阅{&commat;link HookData}。

The TNode whose directives are to be searched for hooks to queue

要搜索其指令以查找要排队的钩子的 TNode

Loops through the directives on the provided `tNode` and queues hooks to be
run that are not initialization hooks.

循环通过提供的 `tNode` 上的指令，并将要运行的不是初始化钩子的钩子排队。

Should be executed during `elementEnd()` and similar to
preserve hook execution order. Content, view, and destroy hooks for projected
components and directives must be called *before* their hosts.

应该在 `elementEnd()`
期间执行，并且类似于保留钩子执行顺序。投影组件和指令的内容、视图和销毁钩子必须在其宿主*之前*调用。

Sets up the content, view, and destroy hooks on the provided `tView`,
see {&commat;link HookData} for details about the data structure.

在提供的 `tView` 上设置内容、视图和销毁钩子，有关数据结构的详细信息，请参阅{&commat;link HookData}。

NOTE: This does not set up `onChanges`, `onInit` or `doCheck`, those are set up
separately at `elementStart`.

注意：这不会设置 `onChanges`、`onInit` 或 `doCheck`，它们是在 `elementStart` 处单独设置的。

Executing hooks requires complex logic as we need to deal with 2 constraints.

执行钩子需要复杂的逻辑，因为我们需要处理 2 个约束。

Init hooks \(ngOnInit, ngAfterContentInit, ngAfterViewInit\) must all be executed once and only
       once, across many change detection cycles. This must be true even if some hooks throw, or
 if some recursively trigger a change detection cycle. To solve that, it is required to track the
 state of the execution of these init hooks. This is done by storing and maintaining flags in the
 view: the {&commat;link InitPhaseState}, and the index within that phase. They can be seen as a cursor
 in the following structure:
`[[onInit1, onInit2], [afterContentInit1], [afterViewInit1, afterViewInit2, afterViewInit3]]`
They are are stored as flags in LView[FLAGS].

初始化钩子（ngOnInit、ngAfterContentInit、ngAfterViewInit）都必须在许多变更检测周期中执行一次，并且只能执行一次。即使某些钩子抛出，或者某些递归触发变更检测周期，也必须是真的。为了解决这个问题，需要跟踪这些初始化钩子的执行状态。这是通过在视图中存储和维护标志来完成的：{&commat;link
 InitPhaseState} 和该阶段中的索引。它们可以被视为以下结构中的游标：
 `[[onInit1, onInit2], [afterContentInit1], [afterViewInit1, afterViewInit2, afterViewInit3]]` 它们作为标志存储在 LView
 [FLAGS][FLAGS]中。

Pre-order hooks can be executed in batches, because of the select instruction.
      To be able to pause and resume their execution, we also need some state about the hook's
array that is being processed:

由于 select
   指令，预购钩子可以分批执行。为了能够暂停和恢复它们的执行，我们还需要正在处理的钩子数组的一些状态：

the index of the next hook to be executed

下一个要执行的钩子的索引

the number of init hooks already found in the processed part of the  array
  They are are stored as flags in `LView[PREORDER_HOOK_FLAGS]`.

在数组的已处理部分中已经找到的初始化钩子的数量它们作为标志存储在 `LView[PREORDER_HOOK_FLAGS]` 中。

The LView where hooks are defined

定义钩子的 LView

Hooks to be run

要运行的挂钩

3 cases depending on the value:

3 种情况，取决于值：

undefined: all hooks from the array should be executed \(post-order case\)

未定义：应该执行数组中的所有钩子（后序案例）

null: execute hooks only from the saved index until the end of the array \(pre-order case, when
flushing the remaining hooks\)

null：仅从保存的索引到数组末尾执行钩子（预购情况，刷新其余钩子时）

number: execute hooks only from the saved index until that node index exclusive \(pre-order
case, when executing select\(number\)\)

number：仅从保存的索引执行钩子，直到该节点索引不包括在内（预购情况，执行 select\(number\) 时）

Executes pre-order check hooks \( OnChanges, DoChanges\) given a view where all the init hooks were
executed once. This is a light version of executeInitAndCheckPreOrderHooks where we can skip read
/ write of the init-hooks related flags.

在给定所有初始化钩子都执行一次的视图的情况下，执行预购检查钩子（OnChanges、DoChanges）。这是
executeInitAndCheckPreOrderHooks 的轻型版本，我们可以在其中跳过与 init-hooks 相关的标志的读/写。

A phase for which hooks should be run

应该运行钩子的阶段

Executes post-order init and check hooks \(one of AfterContentInit, AfterContentChecked,
AfterViewInit, AfterViewChecked\) given a view where there are pending init hooks to be executed.

给定一个视图，其中有要执行的挂起的 init 钩子，执行后序初始化和检查钩子（
AfterContentInit、AfterContentChecked、AfterViewInit、AfterViewChecked 之一）。

The current view

当前视图

The array in which the hooks are found

在其中找到钩子的数组

the current state of the init phase

初始化阶段的当前状态

Calls lifecycle hooks with their contexts, skipping init hooks if it's not
the first LView pass

使用它们的上下文调用生命周期钩子，如果不是第一个 LView 传递，则跳过初始化钩子

Executes a single lifecycle hook, making sure that:

执行单个生命周期挂钩，确保：

it is called in the non-reactive context;

它在非反应性上下文中被调用；

profiling data are registered.

分析数据已注册。

The current index within the hook data array

钩子数据数组中的当前索引

Execute one hook against the current `LView`.

对当前的 `LView` 执行一个钩子。
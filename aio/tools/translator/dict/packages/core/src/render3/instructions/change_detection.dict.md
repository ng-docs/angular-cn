The component which the change detection should be performed on.

应该在其上执行变更检测的组件。

Synchronously perform change detection on a component \(and possibly its sub-components\).

对组件（可能还有其子组件）同步执行变更检测。

This function triggers change detection in a synchronous way on a component.

此函数以同步的方式触发组件上的变更检测。

Different modes of traversing the logical view tree during change detection.

在变更检测期间遍历逻辑视图树的不同模式。

The change detection traversal algorithm switches between these modes based on various
conditions.

变化检测遍历算法根据各种条件在这些模式之间切换。

In `Global` mode, `Dirty` and `CheckAlways` views are refreshed as well as views with the
`RefreshTransplantedView` flag.

在 `Global` 模式下，刷新 `Dirty` 和 `CheckAlways` 视图以及带有 `RefreshTransplantedView` 标志的视图。

In `Targeted` mode, only views with the `RefreshTransplantedView`
flag are refreshed.

在 `Targeted` 模式下，仅刷新带有 `RefreshTransplantedView` 标志的视图。

Used when refreshing a view to force a refresh of its embedded views. This mode
refreshes views without taking into account their LView flags, i.e. non-dirty OnPush components
will be refreshed in this mode.

在刷新视图以强制刷新其嵌入视图时使用。此模式刷新视图时不考虑它们的 LView 标志，即非脏 OnPush 组件将在此模式下刷新。

TODO: we should work to remove this mode. It's used in `refreshView` because that's how the
code worked before introducing ChangeDetectionMode. Instead, it should pass `Global` to the
`detectChangesInEmbeddedViews`. We should aim to fix this by v17 or, at the very least, prevent
this flag from affecting signal views not specifically marked for refresh \(currently, this flag
would _also_ force signal views to be refreshed\).

TODO：我们应该努力移除这个模式。它在 `refreshView` 中使用，因为在引入 ChangeDetectionMode 之前代码就是这样工作的。相反，它应该将 `Global` 传递给 `detectChangesInEmbeddedViews`。我们的目标应该是在 v17 之前解决这个问题，或者至少，防止这个标志影响没有特别标记为刷新的信号视图（目前，这个标志 _ 也会 _ 强制刷新信号视图）。

Processes a view in update mode. This includes a number of steps in a specific order:

在更新模式下处理视图。这包括按特定顺序执行的多个步骤：

executing a template function in update mode;

在更新模式下执行模板函数；

executing hooks;

执行挂钩；

refreshing queries;

刷新查询；

setting host bindings;

设置宿主绑定；

refreshing child \(embedded and component\) views.

刷新子（嵌入式和组件）视图。

Goes over embedded views \(ones created through ViewContainerRef APIs\) and refreshes
them by executing an associated template function.

遍历嵌入式视图（通过 ViewContainerRef API 创建的视图）并通过执行关联的模板函数来刷新它们。

The `LView` that may have transplanted views.

可能有移植视图的 `LView`。

Mark transplanted views as needing to be refreshed at their insertion points.

将移植的视图标记为需要在其插入点刷新。

Element index in LView\[\] \(adjusted for HEADER_OFFSET\)

LView\[\] 中的元素索引（针对 HEADER_OFFSET 进行了调整）

Detects changes in a component by entering the component view and processing its bindings,
queries, etc. if it is CheckAlways, OnPush and Dirty, etc.

通过进入组件视图并处理其绑定、查询等来检测组件中的更改，如果它是 CheckAlways、OnPush 和 Dirty 等。

Visits a view as part of change detection traversal.

作为变更检测遍历的一部分访问视图。

If the view is detached, no additional traversal happens.

如果视图是分离的，则不会发生额外的遍历。

The view is refreshed if:

在以下情况下刷新视图：

If the view is CheckAlways or Dirty and ChangeDetectionMode is `Global`

如果视图是 CheckAlways 或 Dirty 并且 ChangeDetectionMode 是 `Global`

If the view has the `RefreshTransplantedView` flag

如果视图具有 `RefreshTransplantedView` 标志

The view is not refreshed, but descendants are traversed in `ChangeDetectionMode.Targeted` if the
view has a non-zero TRANSPLANTED_VIEWS_TO_REFRESH counter.

不刷新视图，但在 `ChangeDetectionMode.Targeted` 中遍历后代（如果视图具有非零 TRANSPLANTED_VIEWS_TO_REFRESH 计数器）。

Refreshes child components in the current view \(update mode\).

刷新当前视图中的子组件（更新模式）。
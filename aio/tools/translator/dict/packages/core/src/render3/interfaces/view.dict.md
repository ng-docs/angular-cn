Size of LView's header. Necessary to adjust for it when setting slots.

LView 标题的大小。设置插槽时需要对其进行调整。

IMPORTANT: `HEADER_OFFSET` should only be referred to the in the `ɵɵ*` instructions to translate
instruction index into `LView` index. All other indexes should be in the `LView` index space and
there should be no need to refer to `HEADER_OFFSET` anywhere else.

重要提示：`HEADER_OFFSET` 只能在 `ɵɵ*` 指令中引用，以将指令索引转换为 `LView` 索引。所有其他索引都应该在 `LView` 索引空间中，并且不需要在其他任何地方引用 `HEADER_OFFSET`。

`LView` stores all of the information needed to process the instructions as
they are invoked from the template. Each embedded view and component view has its
own `LView`. When processing a particular view, we set the `viewData` to that
`LView`. When that view is done processing, the `viewData` is set back to
whatever the original `viewData` was before \(the parent `LView`\).

`LView` 存储处理指令所需的所有信息，因为它们是从模板调用的。每个嵌入式视图和组件视图都有自己的 `LView`。在处理特定视图时，我们将 `viewData` 设置为该 `LView`。当该视图完成处理后，`viewData` 将设置回原来的 `viewData` 之前的状态（父 `LView` ）。

Keeping separate state for each view facilities view insertion / deletion, so we
don't have to edit the data array based on which views are present.

为每个视图保持单独的状态便于视图插入/删除，因此我们不必根据存在的视图编辑数据数组。

The node into which this `LView` is inserted.

插入此 `LView` 节点。

The static data for this view. We need a reference to this so we can easily walk up the
node tree in DI and get the TView.data array associated with a node \(where the
directive defs are stored\).

此视图的静态数据。我们需要对此的引用，以便我们可以轻松地遍历 DI 中的节点树并获取与节点关联的 TView.data 数组（存储指令定义的位置）。

Flags for this view. See LViewFlags for more info.

此视图的标志。有关详细信息，请参阅 LViewFlags。

This may store an {&commat;link LView} or {&commat;link LContainer}.

这可能会存储一个 {&commat;link LView} 或 {&commat;link LContainer}。

`LView` - The parent view. This is needed when we exit the view and must restore the previous
LView. Without this, the render method would have to keep a stack of
views as it is recursively rendering templates.

`LView` - 父视图。当我们退出视图并且必须恢复之前的 LView 时需要这个。如果没有这个，渲染方法在递归渲染模板时必须保留一堆视图。

`LContainer` - The current view is part of a container, and is an embedded view.

`LContainer` - 当前视图是容器的一部分，并且是嵌入式视图。

The next sibling LView or LContainer.

下一个兄弟 LView 或 LContainer。

Allows us to propagate between sibling view states that aren't in the same
container. Embedded views already have a node.next, but it is only set for
views in the same container. We need a way to link component views and views
across containers as well.

允许我们在不在同一个容器中的兄弟视图状态之间传播。嵌入式视图已经有一个 node.next，但它只是为同一容器中的视图设置的。我们还需要一种方法来链接组件视图和跨容器的视图。

Queries active for this view - nodes from a view are reported to those queries.

此视图的查询活动 - 视图中的节点将报告给这些查询。

Store the `TNode` of the location where the current `LView` is inserted into.

存放当前 `LView` 插入位置的 `TNode`。

Given:

给定：

We end up with two `TView`s.

我们最终得到两个 `TView`。

`parent` `TView` which contains `<div><!-- anchor --></div>`

包含 `<div><!-- anchor --></div>` 的 `parent` `TView`

`child` `TView` which contains `<span></span>`

包含 `<span></span>` 的 `child` `TView`

Typically the `child` is inserted into the declaration location of the `parent`, but it can be
inserted anywhere. Because it can be inserted anywhere it is not possible to store the
insertion information in the `TView` and instead we must store it in the `LView[T_HOST]`.

通常 `child` 被插入到 `parent` 的声明位置，但它可以插入到任何地方。因为它可以插入到任何地方，所以不可能将插入信息存储在 `TView` 中，而我们必须将其存储在 `LView[T_HOST]` 中。

So to determine where is our insertion parent we would execute:

因此，为了确定我们的插入父项在哪里，我们将执行：

If `null`, this is the root view of an application \(root component is in this view\) and it has
no parents.

如果为 `null`，则这是应用程序的根视图（根组件在此视图中）并且它没有父级。

When a view is destroyed, listeners need to be released and outputs need to be
unsubscribed. This context array stores both listener functions wrapped with
their context and output subscription instances for a particular view.

当视图被销毁时，需要释放监听器并取消订阅输出。此上下文数组存储与其上下文一起包装的侦听器函数和特定视图的输出订阅实例。

These change per LView instance, so they cannot be stored on TView. Instead,
TView.cleanup saves an index to the necessary context in this array.

这些每个 LView 实例都会发生变化，因此它们不能存储在 TView 上。相反，TView.cleanup 将索引保存到此数组中的必要上下文。

After `LView` is created it is possible to attach additional instance specific functions at the
end of the `lView[CLEANUP]` because we know that no more `T` level cleanup functions will be
added here.

创建 `LView` 后，可以在 `lView[CLEANUP]` 的末尾附加额外的实例特定函数，因为我们知道这里不会添加更多的 `T` 级清理函数。

For dynamic views, this is the context with which to render the template \(e.g.
`NgForContext`\), or `{}` if not defined explicitly.

对于动态视图，这是用于渲染模板的上下文（例如 `NgForContext` ），如果未明确定义，则为 `{}`。

For root view of the root component it's a reference to the component instance itself.

对于根组件的根视图，它是对组件实例本身的引用。

For components, the context is a reference to the component instance itself.

对于组件，上下文是对组件实例本身的引用。

For inline views, the context is null.

对于内联视图，上下文为空。

An optional Module Injector to be used as fall back after Element Injectors are consulted.

一个可选的模块注入器，在咨询元素注入器后用作回退。

Contextual data that is shared across multiple instances of `LView` in the same application.

在同一应用程序中的多个 `LView` 实例之间共享的上下文数据。

Renderer to be used for this view.

用于此视图的渲染器。

Reference to the first LView or LContainer beneath this LView in
the hierarchy.

引用层次结构中此 LView 下的第一个 LView 或 LContainer。

Necessary to store this so views can traverse through their nested views
to remove listeners and call onDestroy callbacks.

必须存储它，以便视图可以遍历它们的嵌套视图以删除侦听器并调用 onDestroy 回调。

The last LView or LContainer beneath this LView in the hierarchy.

层次结构中此 LView 下的最后一个 LView 或 LContainer。

The tail allows us to quickly add a new state to the end of the view list
without having to propagate starting from the first child.

tail 允许我们快速将新状态添加到视图列表的末尾，而不必从第一个子节点开始传播。

View where this view's template was declared.

查看声明此视图模板的位置。

The template for a dynamically created view may be declared in a different view than
it is inserted. We already track the "insertion view" \(view where the template was
inserted\) in LView[PARENT], but we also need access to the "declaration view"
\(view where the template was declared\). Otherwise, we wouldn't be able to call the
view's template function with the proper contexts. Context should be inherited from
the declaration view tree, not the insertion view tree.

动态创建视图的模板可以在与插入时不同的视图中声明。我们已经在 LView [PARENT][PARENT]中跟踪“插入视图”（模板插入的视图），但我们还需要访问“声明视图”（模板声明的视图）。否则，我们将无法使用适当的上下文调用视图的模板函数。上下文应该继承自声明视图树，而不是插入视图树。

Example \(AppComponent template\):

示例（AppComponent 模板）：

&lt;ng-template #foo></ng-template>       &lt;-- declared here -->
&lt;some-comp [tpl]="foo"></some-comp>    &lt;-- inserted inside this component -->

&lt;ng-模板#foo>

The <ng-template> above is declared in the AppComponent template, but it will be passed into
SomeComp and inserted there. In this case, the declaration view would be the AppComponent,
but the insertion view would be SomeComp. When we are removing views, we would want to
traverse through the insertion view to clean up listeners. When we are calling the
template function during change detection, we need the declaration view to get inherited
context.

这

Points to the declaration component view, used to track transplanted `LView`s.

指向声明组件视图，用于跟踪移植的 `LView`。

See: `DECLARATION_VIEW` which points to the actual `LView` where it was declared, whereas
`DECLARATION_COMPONENT_VIEW` points to the component which may not be same as
`DECLARATION_VIEW`.

请参阅：`DECLARATION_VIEW` 指向声明它的实际 `LView`，而 `DECLARATION_COMPONENT_VIEW` 指向可能与 `DECLARATION_VIEW` 不同的组件。

Example:

范例：

In the above case `DECLARATION_VIEW` for `myTmpl` points to the `LView` of `ngIf` whereas
`DECLARATION_COMPONENT_VIEW` points to `LView` of the `myComp` which owns the template.

在上面的例子中，`myTmpl` 的 `DECLARATION_VIEW` 指向 `ngIf` 的 `LView`，而 `DECLARATION_COMPONENT_VIEW` 指向拥有模板的 `myComp` 的 `LView`。

The reason for this is that all embedded views are always check-always whereas the component
view can be check-always or on-push. When we have a transplanted view it is important to
determine if we have transplanted a view from check-always declaration to on-push insertion
point. In such a case the transplanted view needs to be added to the `LContainer` in the
declared `LView` and CD during the declared view CD \(in addition to the CD at the insertion
point.\) \(Any transplanted views which are intra Component are of no interest because the CD
strategy of declaration and insertion will always be the same, because it is the same
component.\)

这样做的原因是所有嵌入式视图总是检查始终，而组件视图可以始终检查或推送。当我们有一个移植的视图时，重要的是要确定我们是否已经将一个视图从 check-always 声明移植到 on-push 插入点。在这种情况下，需要在声明的视图 CD 期间（除了插入点的 CD 之外）将移植的视图添加到声明的 `LView` 和 CD 中的 `LContainer`。声明和插入的 CD 策略将始终相同，因为它是相同的组件。）

Queries already track moved views in `LView[DECLARATION_LCONTAINER]` and
`LContainer[MOVED_VIEWS]`. However the queries also track `LView`s which moved within the same
component `LView`. Transplanted views are a subset of moved views, and we use
`DECLARATION_COMPONENT_VIEW` to differentiate them. As in this example.

查询已经在 `LView[DECLARATION_LCONTAINER]` 和 `LContainer[MOVED_VIEWS]` 中跟踪移动的视图。但是，查询还会跟踪在同一组件 `LView` 中移动的 `LView`。移植视图是移动视图的子集，我们使用 `DECLARATION_COMPONENT_VIEW` 来区分它们。如本例所示。

Example showing intra component `LView` movement.

显示组件内 `LView` 移动的示例。

The `thenBlock` and `elseBlock` is moved but not transplanted.

`thenBlock` 和 `elseBlock` 被移动但没有被移植。

Example showing inter component `LView` movement \(transplanted view\).

显示组件间 `LView` 移动的示例（移植视图）。

In the above example `myTmpl` is passed into a different component. If `insertion-component`
instantiates `myTmpl` and `insertion-component` is on-push then the `LContainer` needs to be
marked as containing transplanted views and those views need to be CD as part of the
declaration CD.

在上面的示例中，`myTmpl` 被传递到不同的组件中。如果 `insertion-component` 实例化 `myTmpl` 并且 `insertion-component` 是 on-push 那么 `LContainer` 需要被标记为包含移植的视图，并且这些视图需要被 CD 作为声明 CD 的一部分。

When change detection runs, it iterates over `[MOVED_VIEWS]` and CDs any child `LView`s where
the `DECLARATION_COMPONENT_VIEW` of the current component and the child `LView` does not match
\(it has been transplanted across components.\)

当变更检测运行时，它会遍历 `[MOVED_VIEWS]` 并 CD 任何子 `LView`，其中当前组件的 `DECLARATION_COMPONENT_VIEW` 与子 `LView` 不匹配（它已被跨组件移植。）

Note: `[DECLARATION_COMPONENT_VIEW]` points to itself if the LView is a component view \(the
      simplest / most common case\).

注意：如果 LView 是一个组件视图（最简单/最常见的情况） `[DECLARATION_COMPONENT_VIEW]` 指向它自己。

see also:

也可以看看：

[https://hackmd.io/&commat;mhevery/rJUJsvv9H](https://hackmd.io/@mhevery/rJUJsvv9H) write up of the problem

[https://hackmd.io/&commat;mhevery/rJUJsvv9H](https://hackmd.io/@mhevery/rJUJsvv9H)写下问题

`LContainer[HAS_TRANSPLANTED_VIEWS]` which marks which `LContainer` has transplanted views.

`LContainer[HAS_TRANSPLANTED_VIEWS]` 标记哪个 `LContainer` 移植了视图。

`LContainer[TRANSPLANT_HEAD]` and `LContainer[TRANSPLANT_TAIL]` storage for transplanted

`LContainer[TRANSPLANT_HEAD]` 和 `LContainer[TRANSPLANT_TAIL]` 存储用于移植

`LView[DECLARATION_LCONTAINER]` similar problem for queries

`LView[DECLARATION_LCONTAINER]` 查询的类似问题

`LContainer[MOVED_VIEWS]` similar problem for queries

`LContainer[MOVED_VIEWS]` 查询的类似问题

A declaration point of embedded views \(ones instantiated based on the content of a
<ng-template>\), null for other types of views.

嵌入式视图的声明点（基于视图的内容实例化的视图）

We need to track all embedded views created from a given declaration point so we can prepare
query matches in a proper order \(query matches are ordered based on their declaration point and
_not_ the insertion point\).

我们需要跟踪从给定声明点创建的所有嵌入式视图，以便我们可以以正确的顺序准备查询匹配（查询匹配是根据它们的声明点而 _ 不是 _ 插入点排序的）。

More flags for this view. See PreOrderHookFlags for more info.

此视图的更多标志。有关详细信息，请参阅 PreOrderHookFlags。

The number of direct transplanted views which need a refresh or have descendants themselves
that need a refresh but have not marked their ancestors as Dirty. This tells us that during
change detection we should still descend to find those children to refresh, even if the parents
are not `Dirty`/`CheckAlways`.

需要刷新的直接移植视图的数量，或者自身具有需要刷新但未将其祖先标记为脏的后代的数量。这告诉我们，在变化检测期间，我们仍然应该下降以找到那些要刷新的子节点，即使父节点不是 `Dirty` / `CheckAlways`。

Unique ID of the view. Used for `__ngContext__` lookups in the `LView` registry.

视图的唯一 ID。用于 `LView` 注册表中的 `__ngContext__` 查找。

A container related to hydration annotation information that's associated with this LView.

与与此 LView 关联的水合注释信息相关的容器。

Optional injector assigned to embedded views that takes
precedence over the element and module injectors.

分配给优先于元素和模块注入器的嵌入式视图的可选注入器。

A collection of callbacks functions that are executed when a given LView is destroyed. Those
are user defined, LView-specific destroy callbacks that don't have any corresponding TView
entries.

销毁给定 LView 时执行的回调函数的集合。这些是用户定义的、特定于 LView 的销毁回调，没有任何对应的 TView 条目。

The `Consumer` for this `LView`'s template so that signal reads can be tracked.

此 `LView` 模板的 `Consumer`，以便可以跟踪信号读取。

This is initially `null` and gets assigned a consumer after template execution
if any signals were read.

这最初为 `null`，如果读取了任何信号，则会在模板执行后分配给消费者。

Same as REACTIVE_TEMPLATE_CONSUMER, but for the host bindings of the LView.

与 REACTIVE_TEMPLATE_CONSUMER 相同，但用于 LView 的宿主绑定。

Factory to be used for creating Renderer.

用于创建渲染器的工厂。

An optional custom sanitizer.

可选的自定义消毒剂。

Container for reactivity system `effect`s.

反应系统 `effect` 的容器。

Flags associated with an LView \(saved in LView[FLAGS]\)

与 LView 关联的标志（保存在 LView [FLAGS][FLAGS]中）

The state of the init phase on the first 2 bits

前 2 位上初始阶段的状态

Whether or not the view is in creationMode.

视图是否处于 creationMode。

This must be stored in the view rather than using `data` as a marker so that
we can properly support embedded views. Otherwise, when exiting a child view
back into the parent view, `data` will be defined and `creationMode` will be
improperly reported as false.

这必须存储在视图中而不是使用 `data` 作为标记，这样我们才能正确支持嵌入式视图。否则，当退出子视图回到父视图时，`data` 将被定义并且 `creationMode` 将被错误地报告为 false。

Whether or not this LView instance is on its first processing pass.

此 LView 实例是否处于其第一次处理过程中。

An LView instance is considered to be on its "first pass" until it
has completed one creation mode run and one update mode run. At this
time, the flag is turned off.

LView 实例在完成一次创建模式运行和一次更新模式运行之前被认为处于“第一阶段”。此时，flag 被关闭。

Whether this view has default change detection strategy \(checks always\) or onPush

此视图是否具有默认变更检测策略（始终检查）或 onPush

Whether there are any i18n blocks inside this LView.

此 LView 中是否有任何 i18n 块。

Whether or not this view is currently dirty \(needing check\)

此视图当前是否脏（需要检查）

Whether or not this view is currently attached to change detection tree.

此视图当前是否附加到变更检测树。

Whether or not this view is destroyed.

此视图是否被破坏。

Whether or not this view is the root view

此视图是否为根视图

Whether this moved LView was needs to be refreshed. Similar to the Dirty flag, but used for
transplanted and signal views where the parent/ancestor views are not marked dirty as well.
i.e. "Refresh just this view". Used in conjunction with the DESCENDANT_VIEWS_TO_REFRESH
counter.

这个移动的 LView 是否需要刷新。类似于 Dirty 标志，但用于父/祖先视图也未标记为脏的移植视图和信号视图。即“仅刷新此视图”。与 DESCENDANT_VIEWS_TO_REFRESH 计数器结合使用。

Indicates that the view **or any of its ancestors** have an embedded view injector.

指示视图**或其任何祖先**具有嵌入式视图注入器。

Indicates that the view was created with `signals: true`.

表示视图是使用 `signals: true` 创建的。

Index of the current init phase on last 21 bits

最后 21 位上当前初始阶段的索引

This is the count of the bits the 1 was shifted above \(base 10\)

这是 1 向上移动的位数（基数 10）

Possible states of the init phase:

初始化阶段的可能状态：

00: OnInit hooks to be run.

00：要运行的 OnInit 挂钩。

01: AfterContentInit hooks to be run

01：要运行的 AfterContentInit 挂钩

10: AfterViewInit hooks to be run

10：要运行的 AfterViewInit 挂钩

11: All init hooks have been run

11：所有初始化钩子已经运行

More flags associated with an LView \(saved in LView[PREORDER_HOOK_FLAGS]\)

更多与 LView 关联的标志（保存在 LView [PREORDER_HOOK_FLAGS][PREORDER_HOOK_FLAGS]中）

The index of the next pre-order hook to be called in the hooks array, on the first 16
     bits

hooks 数组中下一个要调用的 pre-order hook 的索引，在前 16 位

The number of init hooks that have already been called, on the last 16 bits

在最后 16 位上已经调用的 init hooks 的数量

Stores a set of OpCodes to process `HostBindingsFunction` associated with a current view.

存储一组 OpCodes 以处理与当前视图关联的 `HostBindingsFunction`。

In order to invoke `HostBindingsFunction` we need:

为了调用 `HostBindingsFunction` 我们需要：

`elementIdx`: Index to the element associated with the`HostBindingsFunction`.

`elementIdx`：与 `HostBindingsFunction` 关联的元素的索引。

`directiveIdx`: Index to the directive associated with the`HostBindingsFunction`. \(This will
become the context for the`HostBindingsFunction` invocation.\)

`directiveIdx`：与 `HostBindingsFunction` 关联的指令的索引。（这将成为 `HostBindingsFunction` 调用的上下文。）

`bindingRootIdx`: Location where the bindings for the `HostBindingsFunction` start. Internally
`HostBindingsFunction` binding indexes start from `0` so we need to add `bindingRootIdx` to
it.

`bindingRootIdx`：`HostBindingsFunction` 的绑定开始的位置。在内部 `HostBindingsFunction` 绑定索引从 `0` 开始，因此我们需要向其添加 `bindingRootIdx`。

`HostBindingsFunction`: A host binding function to execute.

`HostBindingsFunction`：要执行的宿主绑定函数。

The above information needs to be encoded into the `HostBindingOpCodes` in an efficient manner.

上述信息需要以高效的方式编码到 `HostBindingOpCodes` 中。

`elementIdx` is encoded into the `HostBindingOpCodes` as `~elementIdx` \(so a negative number\);

`elementIdx` 被编码到 `HostBindingOpCodes` 中作为 `~elementIdx` （所以是负数）；

`HostBindingsFunction` is passed in as is.

`HostBindingsFunction` 按原样传入。

The `HostBindingOpCodes` array contains:

`HostBindingOpCodes` 数组包含：

negative number to select the element index.

选择元素索引的负数。

followed by 1 or more of:

后跟 1 个或多个：

a number to select the directive index

选择指令索引的数字

a number to select the bindingRoot index

用于选择 bindingRoot 索引的数字

and a function to invoke.

和一个要调用的函数。

Example

范例

Pseudocode

伪代码

Explicitly marks `TView` as a specific type in `ngDevMode`

在 `ngDevMode` 中明确将 `TView` 标记为特定类型

It is useful to know conceptually what time of `TView` we are dealing with when
debugging an application \(even if the runtime does not need it.\) For this reason
we store this information in the `ngDevMode` `TView` and than use it for
better debugging experience.

在调试应用程序时，从概念上了解我们正在处理 `TView` 的什么时间是很有用的（即使运行时不需要它。）因此，我们将此信息存储在 `ngDevMode` `TView` 中，而不是使用它来获得更好的调试体验。

Root `TView` is the used to bootstrap components into. It is used in conjunction with
`LView` which takes an existing DOM node not owned by Angular and wraps it in `TView`/`LView`
so that other components can be loaded into it.

Root `TView` 用于引导组件进入。它与 `LView` 结合使用，后者采用不属于 Angular 的现有 DOM 节点并将其包装在 `TView` / `LView` 中，以便可以将其他组件加载到其中。

`TView` associated with a Component. This would be the `TView` directly associated with the
component view \(as opposed an `Embedded` `TView` which would be a child of `Component` `TView`\)

与组件关联的 `TView`。这将是与组件视图直接关联的 `TView` （与作为 `Component` `TView` 的子项的 `Embedded` `TView` 相反）

`TView` associated with a template. Such as `*ngIf`, `<ng-template>` etc... A `Component`
can have zero or more `Embedded` `TView`s.

与模板关联的 `TView`。例如 `*ngIf`，`<ng-template>` 等......一个 `Component` 可以有零个或多个 `Embedded` `TView` s。

The static data for an LView \(shared between all templates of a
given type\).

LView 的静态数据（在给定类型的所有模板之间共享）。

Stored on the `ComponentDef.tView`.

存储在 `ComponentDef.tView` 上。

Type of `TView` \(`Root`\|`Component`\|`Embedded`\).

`TView` 的类型（ `Root` \| `Component` \| `Embedded` ）。

This is a blueprint used to generate LView instances for this TView. Copying this
blueprint is faster than creating a new LView from scratch.

这是用于为该 TView 生成 LView 实例的蓝图。复制这个蓝图比从头开始创建一个新的 LView 更快。

The template function used to refresh the view of dynamically created views
and components. Will be null for inline views.

用于刷新动态创建的视图和组件的视图的模板函数。对于内联视图将为 null。

A function containing query-related instructions.

包含查询相关指令的函数。

A `TNode` representing the declaration location of this `TView` \(not part of this TView\).

表示此 `TView` （不是此 TView 的一部分）的声明位置的 `TNode`。

Whether or not this template has been processed in creation mode.

此模板是否已在创建模式下处理。

Whether or not this template has been processed in update mode \(e.g. change detected\)

此模板是否已在更新模式下处理（例如检测到更改）

`firstUpdatePass` is used by styling to set up `TData` to contain metadata about the styling
instructions. \(Mainly to build up a linked list of styling priority order.\)

样式使用 `firstUpdatePass` 来设置 `TData` 以包含有关样式指令的元数据。（主要是建立一个样式优先顺序的链表。）

Typically this function gets cleared after first execution. If exception is thrown then this
flag can remain turned un until there is first successful \(no exception\) pass. This means that
individual styling instructions keep track of if they have already been added to the linked
list to prevent double adding.

通常这个函数在第一次执行后被清除。如果抛出异常，那么这个标志可以保持打开状态，直到第一次成功（无异常）通过。这意味着单独的样式指令会跟踪它们是否已经被添加到链表中以防止重复添加。

Static data equivalent of LView.data\[\]. Contains TNodes, PipeDefInternal or TI18n.

相当于 LView.data\[\] 的静态数据。包含 TNodes、PipeDefInternal 或 TI18n。

The binding start index is the index at which the data array
starts to store bindings only. Saving this value ensures that we
will begin reading bindings at the correct point in the array when
we are in update mode.

绑定开始索引是数据数组开始仅存储绑定的索引。保存此值可确保我们在更新模式下从数组中的正确位置开始读取绑定。

\-1 means that it has not been initialized.

\-1 表示尚未初始化。

The index where the "expando" section of `LView` begins. The expando
section contains injectors, directive instances, and host binding values.
Unlike the "decls" and "vars" sections of `LView`, the length of this
section cannot be calculated at compile-time because directives are matched
at runtime to preserve locality.

`LView` 的“expando”部分开始的索引。expando 部分包含注入器、指令实例和宿主绑定值。与 `LView` 的“decls”和“vars”部分不同，此部分的长度无法在编译时计算，因为指令在运行时匹配以保留局部性。

We store this start index so we know where to start checking host bindings
in `setHostBindings`.

我们存储此起始索引，以便我们知道从哪里开始检查 `setHostBindings` 中的宿主绑定。

Whether or not there are any static view queries tracked on this view.

是否有在此视图上跟踪的任何静态视图查询。

We store this so we know whether or not we should do a view query
refresh after creation mode to collect static query results.

我们存储它以便我们知道我们是否应该在创建模式后进行视图查询刷新以收集静态查询结果。

Whether or not there are any static content queries tracked on this view.

是否在此视图上跟踪任何静态内容查询。

We store this so we know whether or not we should do a content query
refresh after creation mode to collect static query results.

我们存储它以便我们知道我们是否应该在创建模式后进行内容查询刷新以收集静态查询结果。

A reference to the first child node located in the view.

对位于视图中的第一个子节点的引用。

Stores the OpCodes to be replayed during change-detection to process the `HostBindings`

存储 OpCodes 以在变更检测期间重播以处理 `HostBindings`

See `HostBindingOpCodes` for encoding details.

有关编码详细信息，请参阅 `HostBindingOpCodes`。

Full registry of directives and components that may be found in this view.

可在此视图中找到的指令和组件的完整注册表。

It's necessary to keep a copy of the full def list on the TView so it's possible
to render template functions without a host component.

有必要在 TView 上保留一份完整的 def 列表，这样就可以在没有宿主组件的情况下渲染模板函数。

Full registry of pipes that may be found in this view.

可以在此视图中找到的管道的完整注册表。

The property is either an array of `PipeDefs`s or a function which returns the array of
`PipeDefs`s. The function is necessary to be able to support forward declarations.

该属性是 `PipeDefs` s 的数组或返回 `PipeDefs` s 数组的函数。该函数是支持前向声明所必需的。

Array of ngOnInit, ngOnChanges and ngDoCheck hooks that should be executed for this view in
creation mode.

应在创建模式下为此视图执行的 ngOnInit、ngOnChanges 和 ngDoCheck 挂钩数组。

This array has a flat structure and contains TNode indices, directive indices \(where an
instance can be found in `LView`\) and hook functions. TNode index is followed by the directive
index and a hook function. If there are multiple hooks for a given TNode, the TNode index is
not repeated and the next lifecycle hook information is stored right after the previous hook
function. This is done so that at runtime the system can efficiently iterate over all of the
functions to invoke without having to make any decisions/lookups.

这个数组有一个平面结构，包含 TNode 索引、指令索引（其中一个实例可以在 `LView` 中找到）和挂钩函数。TNode 索引后面是指令索引和一个挂钩函数。如果给定的 TNode 有多个钩子，则 TNode 索引不会重复，并且下一个生命周期钩子信息将存储在前一个钩子函数之后。这样做是为了在运行时系统可以有效地迭代所有要调用的函数，而无需做出任何决定/查找。

Array of ngOnChanges and ngDoCheck hooks that should be executed for this view in update mode.

应在更新模式下为此视图执行的 ngOnChanges 和 ngDoCheck 挂钩数组。

This array has the same structure as the `preOrderHooks` one.

该数组与 `preOrderHooks` 具有相同的结构。

Array of ngAfterContentInit and ngAfterContentChecked hooks that should be executed
for this view in creation mode.

应在创建模式下为此视图执行的 ngAfterContentInit 和 ngAfterContentChecked 挂钩数组。

Even indices: Directive index
Odd indices: Hook function

偶数索引：指令索引 奇数索引：Hook 函数

Array of ngAfterContentChecked hooks that should be executed for this view in update
mode.

应该在更新模式下为此视图执行的 ngAfterContentChecked 挂钩数组。

Array of ngAfterViewInit and ngAfterViewChecked hooks that should be executed for
this view in creation mode.

应在创建模式下为此视图执行的 ngAfterViewInit 和 ngAfterViewChecked 挂钩数组。

Array of ngAfterViewChecked hooks that should be executed for this view in
update mode.

应该在更新模式下为此视图执行的 ngAfterViewChecked 挂钩数组。

Array of ngOnDestroy hooks that should be executed when this view is destroyed.

销毁此视图时应执行的 ngOnDestroy 挂钩数组。

When a view is destroyed, listeners need to be released and outputs need to be
unsubscribed. This cleanup array stores both listener data \(in chunks of 4\)
and output data \(in chunks of 2\) for a particular view. Combining the arrays
saves on memory \(70 bytes per array\) and on a few bytes of code size \(for two
separate for loops\).

当视图被销毁时，需要释放监听器并取消订阅输出。此清理数组存储特定视图的侦听器数据（以 4 个为一组）和输出数据（以 2 个为一组）。组合数组可以节省内存（每个数组 70 字节）和几个字节的代码大小（对于两个单独的 for 循环）。

If it's a native DOM listener or output subscription being stored:
1st index is: event name  `name = tView.cleanup[i+0]`
2nd index is: index of native element or a function that retrieves global target \(window,
              document or body\) reference based on the native element:
   `typeof idxOrTargetGetter === 'function'`: global target getter function
   `typeof idxOrTargetGetter === 'number'`: index of native element

如果它是本地 DOM 侦听器或正在存储的输出订阅：第一个索引是：事件名称 `name = tView.cleanup[i+0]` 第二个索引是：本地元素的索引或检索全局目标（窗口、文档或正文）的函数基于原生元素的引用：`typeof idxOrTargetGetter === 'function'` : global target getter function `typeof idxOrTargetGetter === 'number'` : index of native element

3rd index is: index of listener function `listener = lView[CLEANUP][tView.cleanup[i+2]]`
4th index is: `useCaptureOrIndx = tView.cleanup[i+3]`
   `typeof useCaptureOrIndx == 'boolean' : useCapture boolean`typeof useCaptureOrIndx == 'number':
        `useCaptureOrIndx >= 0` `removeListener = LView[CLEANUP][useCaptureOrIndx]`
        `useCaptureOrIndx <  0` `subscription = LView[CLEANUP][-useCaptureOrIndx]`

第三个索引是：监听器函数的索引 `listener = lView[CLEANUP][tView.cleanup[i+2]]` 第四个索引是：`useCaptureOrIndx = tView.cleanup[i+3]` `typeof useCaptureOrIndx == 'boolean' : useCapture boolean` typeof useCaptureOrIndx == 'number': `useCaptureOrIndx >= 0` `removeListener = LView[CLEANUP][useCaptureOrIndx]` `useCaptureOrIndx < 0` `subscription = LView[CLEANUP][-useCaptureOrIndx]`

If it's an output subscription or query list destroy hook:
1st index is: output unsubscribe function / query list destroy function
2nd index is: index of function context in LView.cleanupInstances\[\]
              `tView.cleanup[i+0].call(lView[CLEANUP][tView.cleanup[i+1]])`

如果是输出订阅或查询列表销毁钩子：第一个索引是：输出取消订阅函数/查询列表销毁函数 第二个索引是：LView.cleanupInstances\[\] `tView.cleanup[i+0].call(lView[CLEANUP][tView.cleanup[i+1]])`

A list of element indices for child components that will need to be
refreshed when the current view has finished its check. These indices have
already been adjusted for the HEADER_OFFSET.

当前视图完成检查后需要刷新的子组件的元素索引列表。这些索引已经针对 HEADER_OFFSET 进行了调整。

A collection of queries tracked in a given view.

在给定视图中跟踪的查询的集合。

An array of indices pointing to directives with content queries alongside with the
corresponding query index. Each entry in this array is a tuple of:

指向指令的索引数组，其中包含内容查询以及相应的查询索引。此数组中的每个条目都是一个元组：

index of the first content query index declared by a given directive;

给定指令声明的第一个内容查询索引的索引；

index of a directive.

指令的索引。

We are storing those indexes so we can refresh content queries as part of a view refresh
process.

我们正在存储这些索引，以便我们可以将内容查询作为视图刷新过程的一部分进行刷新。

Set of schemas that declare elements to be allowed inside the view.

声明视图内允许的元素的模式集。

Array of constants for the view. Includes attribute arrays, local definition arrays etc.
Used for directive matching, attribute bindings, local definitions and more.

视图的常量数组。包括属性数组、局部定义数组等。用于指令匹配、属性绑定、局部定义等。

Indicates that there was an error before we managed to complete the first create pass of the
view. This means that the view is likely corrupted and we should try to recover it.

表示在我们设法完成视图的第一个创建过程之前出现错误。这意味着视图可能已损坏，我们应该尝试恢复它。

Unique id of this TView for hydration purposes:

此 TView 用于水合的唯一 ID：

TViewType.Embedded: a unique id generated during serialization on the server

TViewType.Embedded：在服务端序列化时生成的唯一 id

TViewType.Component: an id generated based on component properties
                     \(see `getComponentId` function for details\)

TViewType.Component：根据组件属性生成的 id（详见 `getComponentId` 函数）

Single hook callback function.

单钩回调函数。

Information necessary to call a hook. E.g. the callback that
needs to invoked and the index at which to find its context.

调用挂钩所需的信息。例如，需要调用的回调和查找其上下文的索引。

Array of hooks that should be executed for a view and their directive indices.

应为视图及其指令索引执行的挂钩数组。

For each node of the view, the following data is stored:
1\) Node index \(optional\)
2\) A series of number/function pairs where:

对于视图的每个节点，存储以下数据：1）节点索引（可选）2）一系列数字/函数对，其中：

even indices are directive indices

偶数指数是指令指数

odd indices are hook functions

奇数索引是钩子函数

Special cases:

特别案例：

a negative directive index flags an init hook \(ngOnInit, ngAfterContentInit, ngAfterViewInit\)

负指令索引标记一个初始化挂钩（ngOnInit、ngAfterContentInit、ngAfterViewInit）

Array of destroy hooks that should be executed for a view and their directive indices.

应为视图及其指令索引执行的销毁挂钩数组。

The array is set up as a series of number/function or number/\(number|function\)\[\]:

该数组设置为一系列数字/函数或数字/（数字|函数）\[\]：

Even indices represent the context with which hooks should be called.

甚至索引也代表应该调用钩子的上下文。

Odd indices are the hook functions themselves. If a value at an odd index is an array,
it represents the destroy hooks of a `multi` provider where:

奇数索引是钩子函数本身。如果奇数索引处的值是数组，则它表示 `multi` 提供程序的销毁挂钩，其中：

Even indices represent the index of the provider for which we've registered a destroy hook,
  inside of the `multi` provider array.

甚至 indices 也代表我们在 `multi` 提供商数组中为其注册销毁挂钩的提供商的索引。

Odd indices are the destroy hook functions.
For example:
LView: `[0, 1, 2, AService, 4, [BService, CService, DService]]`
destroyHooks: `[3, AService.ngOnDestroy, 5, [0, BService.ngOnDestroy, 2, DService.ngOnDestroy]]`

奇数索引是 destroy 钩子函数。例如：LView: `[0, 1, 2, AService, 4, [BService, CService, DService]]` destroyHooks: `[3, AService.ngOnDestroy, 5, [0, BService.ngOnDestroy, 2, DService.ngOnDestroy]]`

In the example above `AService` is a type provider with an `ngOnDestroy`, whereas `BService`,
`CService` and `DService` are part of a `multi` provider where only `BService` and `DService`
have an `ngOnDestroy` hook.

在上面的示例中，`AService` 是具有 `ngOnDestroy` 的类型提供程序，而 `BService` 、 `CService` 和 `DService` 是 `multi` 提供程序的一部分，其中只有 `BService` 和 `DService` 具有 `ngOnDestroy` 挂钩。

Static data that corresponds to the instance-specific data array on an LView.

对应于 LView 上实例特定数据数组的静态数据。

Each node's static data is stored in tData at the same index that it's stored
in the data array.  Any nodes that do not have static data store a null value in
tData to avoid a sparse array.

每个节点的静态数据都存储在 tData 中，其索引与存储在数据数组中的索引相同。任何没有静态数据的节点都会在 tData 中存储一个空值以避免稀疏数组。

Each pipe's definition is stored here at the same index as its pipe instance in
the data array.

每个管道的定义都存储在此处与其在数据数组中的管道实例相同的索引处。

Each host property's name is stored here at the same index as its value in the
data array.

每个宿主属性的名称都存储在此处与其在数据数组中的值相同的索引处。

Each property binding name is stored here at the same index as its value in
the data array. If the binding is an interpolation, the static string values
are stored parallel to the dynamic values. Example:

每个属性绑定名称都存储在此处与其在数据数组中的值相同的索引处。如果绑定是插值，则静态字符串值与动态值并行存储。例子：

`v2` value

`v2` 值

`v1` value

`v1` 值

`v0` value

`v0` 值

TView.data

TView.数据

Injector bloom filters are also stored here.

注入器布隆过滤器也存储在这里。
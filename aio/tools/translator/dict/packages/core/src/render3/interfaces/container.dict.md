Special location which allows easy identification of type. If we have an array which was
retrieved from the `LView` and that array has `true` at `TYPE` location, we know it is
`LContainer`.

便于识别类型的特殊位置。如果我们有一个从 `LView` 中检索到的数组，并且该数组在 `TYPE` 位置为 `true`，我们就知道它是 `LContainer`。

Below are constants for LContainer indices to help us look up LContainer members
without having to remember the specific indices.
Uglify will inline these when minifying so there shouldn't be a cost.

下面是 LContainer 索引的常量，可以帮助我们查找 LContainer 成员，而不必记住具体的索引。Uglify 会在缩小时内联这些，因此不应该有成本。

Flag to signify that this `LContainer` may have transplanted views which need to be change
detected. \(see: `LView[DECLARATION_COMPONENT_VIEW])`.

标志表示此 `LContainer` 可能具有需要变更检测的移植视图。（参见：`LView[DECLARATION_COMPONENT_VIEW])`。

This flag, once set, is never unset for the `LContainer`. This means that when unset we can skip
a lot of work in `refreshEmbeddedViews`. But when set we still need to verify
that the `MOVED_VIEWS` are transplanted and on-push.

这个标志一旦设置，就永远不会为 `LContainer` 取消设置。这意味着当取消设置时，我们可以跳过 `refreshEmbeddedViews` 中的很多工作。但是设置后我们仍然需要验证 `MOVED_VIEWS` 是否被移植和推送。

Size of LContainer's header. Represents the index after which all views in the
container will be inserted. We need to keep a record of current views so we know
which views are already in the DOM \(and don't need to be re-added\) and so we can
remove views from the DOM when they are no longer required.

LContainer 头部的大小。表示将插入容器中所有视图的索引。我们需要保留当前视图的记录，以便我们知道哪些视图已经在 DOM 中（并且不需要重新添加），因此我们可以在不再需要视图时从 DOM 中删除它们。

The state associated with a container.

与容器关联的状态。

This is an array so that its structure is closer to LView. This helps
when traversing the view tree \(which is a mix of containers and component
views\), so we can jump to viewOrContainer[NEXT] in the same way regardless
of type.

这是一个数组，所以它的结构更接近于 LView。这在遍历视图树（容器和组件视图的混合体）时很有帮助，因此我们可以以相同的方式跳转到 viewOrContainer [NEXT][NEXT]，而不管类型如何。

The host element of this LContainer.

此 LContainer 的宿主元素。

The host could be an LView if this container is on a component node.
In that case, the component LView is its HOST.

如果此容器位于组件节点上，则宿主可以是 LView。在那种情况下，组件 LView 是它的宿主。

This is a type field which allows us to differentiate `LContainer` from `StylingContext` in an
efficient way. The value is always set to `true`

这是一个类型字段，它允许我们以有效的方式区分 `LContainer` 和 `StylingContext`。该值始终设置为 `true`

This flag, once set, is never unset for the `LContainer`.

这个标志一旦设置，就永远不会为 `LContainer` 取消设置。

Access to the parent view is necessary so we can propagate back
up from inside a container to parent[NEXT].

访问父视图是必要的，这样我们就可以从容器内部向上传播到父[NEXT][NEXT]。

This allows us to jump from a container to a sibling container or component
view with the same parent, so we can remove listeners efficiently.

这允许我们从一个容器跳转到具有相同父级的同级容器或组件视图，因此我们可以有效地移除监听器。

The number of direct transplanted views which need a refresh or have descendants themselves
that need a refresh but have not marked their ancestors as Dirty. This tells us that during
change detection we should still descend to find those children to refresh, even if the parents
are not `Dirty`/`CheckAlways`.

需要刷新的直接移植视图的数量，或者自身具有需要刷新但未将其祖先标记为脏的后代的数量。这告诉我们，在变化检测期间，我们仍然应该下降以找到那些要刷新的子节点，即使父节点不是 `Dirty` / `CheckAlways`。

A collection of views created based on the underlying `<ng-template>` element but inserted into
a different `LContainer`. We need to track views created from a given declaration point since
queries collect matches from the embedded view declaration point and _not_ the insertion point.

基于底层 `<ng-template>` 元素创建但插入不同 `LContainer` 视图集合。我们需要跟踪从给定声明点创建的视图，因为查询从嵌入式视图声明点而 _ 不是 _ 插入点收集匹配项。

Pointer to the `TNode` which represents the host of the container.

指向代表容器宿主的 `TNode` 指针。

The comment element that serves as an anchor for this LContainer.

用作此 LContainer 锚点的注释元素。

Array of `ViewRef`s used by any `ViewContainerRef`s that point to this container.

指向此容器的任何 `ViewContainerRef` 使用的 `ViewRef` 数组。

This is lazily initialized by `ViewContainerRef` when the first view is inserted.

这是在插入第一个视图时由 `ViewContainerRef` 延迟初始化的。

NOTE: This is stored as `any[]` because render3 should really not be aware of `ViewRef` and
doing so creates circular dependency.

注意：这被存储为 `any[]` 因为 render3 实际上不应该知道 `ViewRef` 并且这样做会产生循环依赖。

Array of dehydrated views within this container.

此容器中的脱水视图数组。

This information is used during the hydration process on the client.
The hydration logic tries to find a matching dehydrated view, "claim" it
and use this information to do further matching. After that, this "claimed"
view is removed from the list. The remaining "unclaimed" views are
"garbage-collected" later on, i.e. removed from the DOM once the hydration
logic finishes.

此信息在客户端的水合过程中使用。水合逻辑试图找到匹配的脱水视图，“声明”它并使用此信息进行进一步匹配。之后，这个“已声明”的视图将从列表中删除。剩下的“无人认领”的视图稍后会被“垃圾收集”，即一旦水合逻辑完成就从 DOM 中删除。
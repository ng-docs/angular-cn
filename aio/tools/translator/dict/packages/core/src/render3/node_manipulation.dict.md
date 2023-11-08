node create in the native environment. Run on initial creation.

在原生环境中创建节点。在初始创建时运行。

node insert in the native environment.
Run when existing node has been detached and needs to be re-attached.

在原生环境中插入节点。当现有节点已分离并需要重新连接时运行。

node detach from the native environment

节点从原生环境中分离

node destruction using the renderer's API

使用渲染器的 API 销毁节点

NOTE: for performance reasons, the possible actions are inlined within the function instead of
being passed as an argument.

注意：出于性能原因，可能的操作内联在函数中而不是作为参数传递。

A renderer to use

要使用的渲染器

the tag name

标签名称

Optional namespace for element.

元素的可选命名空间。

the element created

创建的元素

Creates a native element from a tag name, using a renderer.

使用渲染器从标签名称创建原生元素。

The `TView` of the `LView` from which elements should be added or removed

应从中添加或删除元素的 `LView` 的 `TView`

The view from which elements should be added or removed

应从中添加或删除元素的视图

Removes all DOM elements associated with a view.

删除与视图关联的所有 DOM 元素。

Because some root nodes of the view may be containers, we sometimes need
to propagate deeply into the nested containers to remove all elements in the
views beneath it.

因为视图的某些根节点可能是容器，所以有时我们需要深入传播到嵌套容器中以删除其下方视图中的所有元素。

The `TNode` where the `LView` should be attached to.

`LView` 应附加到的 `TNode`。

Current renderer to use for DOM manipulations.

用于 DOM 操作的当前渲染器。

The parent `RElement` where it should be inserted into.

它应该被插入到的父 `RElement`。

The node before which elements should be added, if insert mode

如果是插入模式，则应在其之前添加元素的节点

Adds all DOM elements associated with a view.

添加与视图关联的所有 DOM 元素。

Because some root nodes of the view may be containers, we sometimes need
to propagate deeply into the nested containers to add all elements in the
views beneath it.

因为视图的某些根节点可能是容器，所以我们有时需要深入传播到嵌套容器中以添加其下方视图中的所有元素。

The `TView` of the `LView` to be detached

要分离的 `LView` 的 `TView`

the `LView` to be detached.

要分离的 `LView`。

Detach a `LView` from the DOM by detaching its nodes.

通过分离节点从 DOM 中分离 `LView`。

The view to destroy

破坏的观点

Traverses down and up the tree of views and containers to remove listeners and
call onDestroy callbacks.

上下遍历视图和容器树以删除侦听器并调用 onDestroy 回调。

Notes:

注意：

Because it's used for onDestroy calls, it needs to be bottom-up.

因为它用于 onDestroy 调用，所以它需要自下而上。

Must process containers instead of their views to avoid splicing
when views are destroyed and re-added.

必须处理容器而不是它们的视图，以避免在视图被销毁和重新添加时拼接。

Using a while loop because it's faster than recursion

使用 while 循环，因为它比递归更快

Destroy only called on movement to sibling or movement to parent \(laterally or up\)

销毁只调用兄弟移动或父移动（横向或向上）

The `TView` of the `LView` to insert

要插入的 `LView` 的 `TView`

The view to insert

要插入的视图。

The container into which the view should be inserted

应该插入视图的容器

Which index in the container to insert the child view into

将子视图插入容器中的哪个索引

Inserts a view into a container.

将视图插入到容器中。

This adds the view to the container's array of active views in the correct
position. It also adds the view's elements to the DOM if the container isn't a
root node of another view \(in that case, the view's elements will be added when
the container's parent view is added later\).

这会将视图添加到容器的活动视图数组中的正确位置。如果容器不是另一个视图的根节点，它还会将视图的元素添加到 DOM（在这种情况下，将在稍后添加容器的父视图时添加视图的元素）。

Track views created from the declaration container \(TemplateRef\) and inserted into a
different LContainer.

跟踪从声明容器 \(TemplateRef\) 创建并插入到不同 LContainer 中的视图。

The container from which to detach a view

从中分离视图的容器

The index of the view to detach

要分离的视图的索引

Detached LView instance.

分离的 LView 实例。

Detaches a view from a container.

从容器中分离视图。

This method removes the view from the container's array of active views. It also
removes the view's elements from the DOM.

此方法从容器的活动视图数组中删除视图。它还从 DOM 中删除视图的元素。

The `TView` of the `LView` to be destroyed

待销毁的 `LView` 的 `TView`

The view to be destroyed.

要销毁的视图。

A standalone function which destroys an LView,
conducting clean up \(e.g. removing listeners, calling onDestroys\).

销毁 LView 的独立函数，进行清理（例如删除侦听器、调用 onDestroys）。

`TView` for the `LView` to clean up.

`TView` 为 `LView` 清理。

The LView to clean up

要清理的 LView

Calls onDestroys hooks for all directives and pipes in a given view and then removes all
listeners. Listeners are removed as the last step so events delivered in the onDestroys hooks
can be propagated to &commat;Output listeners.

为给定视图中的所有指令和管道调用 onDestroys 挂钩，然后删除所有侦听器。最后一步删除了侦听器，因此可以将 onDestroys 挂钩中传递的事件传播到 &commat;Output 侦听器。

Removes listeners and unsubscribes from output subscriptions

从输出订阅中删除监听器和取消订阅

Calls onDestroy hooks for this view

为此视图调用 onDestroy 挂钩

Returns a native element if a node can be inserted into the given parent.

如果可以将节点插入到给定的父级中，则返回原生元素。

There are two reasons why we may not be able to insert a element immediately.

我们可能无法立即插入元素的原因有两个。

Projection: When creating a child content element of a component, we have to skip the
insertion because the content of a component will be projected.
`<component><content>delayed due to projection</content></component>`

投影：当创建组件的子内容元素时，我们必须跳过插入，因为组件的内容将被投影。`<component><content>delayed due to projection</content></component>`

Parent container is disconnected: This can happen when we are inserting a view into
parent container, which itself is disconnected. For example the parent container is part
of a View which has not be inserted or is made for projection but has not been inserted
into destination.

父容器已断开连接：当我们将视图插入父容器时，这可能会发生，而父容器本身已断开连接。例如，父容器是尚未插入或用于投影但尚未插入目标的视图的一部分。

`null` if the `RElement` can't be determined at this time \(no parent / projection\)

如果此时无法确定 `RElement` （无父项/投影），`null`

Get closest `RElement` or `null` if it can't be found.

获取最近的 `RElement`，如果找不到则返回 `null`。

If `TNode` is `TNodeType.Element` => return `RElement` at `LView[tNode.index]` location.
If `TNode` is `TNodeType.ElementContainer|IcuContain` => return the parent \(recursively\).
If `TNode` is `null` then return host `RElement`:

如果 `TNode` 是 `TNodeType.Element` => 在 `LView[tNode.index]` 位置返回 `RElement`。如果 `TNode` 是 `TNodeType.ElementContainer|IcuContain` => 返回父级（递归）。如果 `TNode` 为 `null` 则返回宿主 `RElement`：

return `null` if projection

如果投影返回 `null`

return `null` if parent container is disconnected \(we have no parent.\)

如果父容器断开连接（我们没有父容器），则返回 `null`。

Inserts a native node before another native node for a given parent.
This is a utility function that can be used when native nodes were determined.

在给定父节点的另一个原生节点之前插入一个原生节点。这是一个实用函数，可以在确定原生节点时使用。

Removes a node from the DOM given its native parent.

从给定其原生父节点的 DOM 中移除节点。

Checks if an element is a `<template>` node.

检查元素是否为 `<template>` 节点。

Returns a native parent of a given native node.

返回给定原生节点的原生父节点。

Returns a native sibling of a given native node.

返回给定原生节点的原生兄弟节点。

parent `TNode`

父 `TNode`

current `TNode` \(The node which we would like to insert into the DOM\)

当前 `TNode`（我们要插入到 DOM 中的节点）

current `LView`

当前的 `LView`

Find a node in front of which `currentTNode` should be inserted.

查找应在其前面插入 `currentTNode` 节点。

This method determines the `RNode` in front of which we should insert the `currentRNode`. This
takes `TNode.insertBeforeIndex` into account if i18n code has been invoked.

此方法确定我们应该在其前面插入 `currentRNode` `RNode`。如果已调用 i18n 代码，这会将 `TNode.insertBeforeIndex` 考虑在内。

Find a node in front of which `currentTNode` should be inserted. \(Does not take i18n into
account\)

查找应在其前面插入 `currentTNode` 节点。（不考虑 i18n）

This method determines the `RNode` in front of which we should insert the `currentRNode`. This
does not take `TNode.insertBeforeIndex` into account.

此方法确定我们应该在其前面插入 `currentRNode` `RNode`。这不考虑 `TNode.insertBeforeIndex`。

Tree shakable boundary for `getInsertInFrontOfRNodeWithI18n` function.

`getInsertInFrontOfRNodeWithI18n` 函数的树摇动边界。

This function will only be set if i18n code runs.

只有在 i18n 代码运行时才会设置此功能。

Tree shakable boundary for `processI18nInsertBefore` function.

`processI18nInsertBefore` 函数的树可摇动边界。

The `TView` to be appended

要追加的 `TView`

The current LView

当前的 LView

The native child \(or children\) that should be appended

应该追加的本地子节点（或子节点）

The TNode of the child element

子元素的 TNode

Appends the `child` native node \(or a collection of nodes\) to the `parent`.

将 `child` 原生节点（或节点集合）附加到 `parent`。

Returns the first native node for a given LView, starting from the provided TNode.

返回给定 LView 的第一个原生节点，从提供的 TNode 开始。

Native nodes are returned in the order in which those appear in the native tree \(DOM\).

原生节点按照它们在原生树 \(DOM\) 中出现的顺序返回。

A renderer to be used

要使用的渲染器

The native node that should be removed

应该移除的原生节点

A flag indicating if a node to be removed is a host of a component.

一个标志，指示要删除的节点是否是组件的宿主。

Removes a native node itself using a given renderer. To remove the node we are looking up its
parent from the native tree as not all platforms / browsers support the equivalent of
node.remove\(\).

使用给定的渲染器删除原生节点本身。要删除节点，我们要从原生树中查找其父节点，因为并非所有平台/浏览器都支持 node.remove\(\) 的等价物。

the native RElement to be cleared

要清除的原生 RElement

Clears the contents of a given RElement.

清除给定 RElement 的内容。

Performs the operation of `action` on the node. Typically this involves inserting or removing
nodes on the LView or projection boundary.

在节点上执行 `action` 操作。通常这涉及在 LView 或投影边界上插入或删除节点。

The `TView` which needs to be inserted, detached, destroyed

需要插入、分离、销毁的 `TView`

The LView which needs to be inserted, detached, destroyed.

需要插入、分离、销毁的 LView。

Renderer to use

要使用的渲染器

action to perform \(insert, detach, destroy\)

要执行的操作（插入、分离、销毁）

parent DOM element for insertion \(Removal does not need it\).

用于插入的父 DOM 元素（移除不需要它）。

Before which node the insertions should happen.

插入应该发生在哪个节点之前。

`applyView` performs operation on the view as specified in `action` \(insert, detach, destroy\)

`applyView` 对 `action` 中指定的视图执行操作（插入、分离、销毁）

Inserting a view without projection or containers at top level is simple. Just iterate over the
root nodes of the View, and for each node perform the `action`.

在顶层插入没有投影或容器的视图很简单。只需遍历视图的根节点，并为每个节点执行 `action`。

Things get more complicated with containers and projections. That is because coming across:

容器和投影让事情变得更加复杂。那是因为遇到：

Container: implies that we have to insert/remove/destroy the views of that container as well
           which in turn can have their own Containers at the View roots.

容器：意味着我们必须插入/删除/销毁该容器的视图，而容器又可以在视图根部拥有自己的容器。

Projection: implies that we have to insert/remove/destroy the nodes of the projection. The
            complication is that the nodes we are projecting can themselves have Containers
            or other Projections.

投影：意味着我们必须插入/删除/销毁投影的节点。复杂的是我们投影的节点本身可以​​有容器或其他投影。

As you can see this is a very recursive problem. Yes recursion is not most efficient but the
code is complicated enough that trying to implemented with recursion becomes unmaintainable.

如你所见，这是一个非常递归的问题。是的，递归不是最有效的，但代码足够复杂，以至于尝试用递归实现变得无法维护。

The `TView` of `LView` which needs to be inserted, detached, destroyed

需要插入、分离、销毁的 `LView` 的 `TView`

The `LView` which needs to be inserted, detached, destroyed.

需要插入、分离、销毁的 `LView`。

node to project

项目节点

`applyProjection` performs operation on the projection.

`applyProjection` 对投影执行操作。

Inserting a projection requires us to locate the projected nodes from the parent component. The
complication is that those nodes themselves could be re-projected from their parent component.

插入投影需要我们从父组件定位投影节点。复杂的是，这些节点本身可以​​从它们的父组件中重新投影。

Render to use

渲染使用

parent DOM element for insertion/removal.

用于插入/移除的父 DOM 元素。

`applyProjectionRecursive` performs operation on the projection specified by `action` \(insert,
detach, destroy\)

`applyProjectionRecursive` 对 `action` 指定的投影执行操作（插入、分离、销毁）

The LContainer which needs to be inserted, detached, destroyed.

需要插入、分离、销毁的 LContainer。

`applyContainer` performs an operation on the container and its views as specified by
`action` \(insert, detach, destroy\)

`applyContainer` 对容器及其视图执行操作（插入、分离、销毁）指定的 `action`

Inserting a Container is complicated by the fact that the container may have Views which
themselves have containers or projections.

插入一个容器很复杂，因为容器可能有自己有容器或投影的视图。

Renderer to use.

要使用的渲染器。

`true` if it should be written to `class` \(`false` to write to `style`\)

如果应该写入 `class` 则为 `true` （写入 `style` 为 `false` ）

The Node to write to.

要写入的节点。

Property to write to. This would be the class/style name.

要写入的属性。这将是类/样式名称。

Value to write. If `null`/`undefined`/`false` this is considered a remove \(set/add
       otherwise\).

写值。如果 `null` / `undefined` / `false` 这被认为是删除（否则设置/添加）。

Writes class/style to element.

将类/样式写入元素。

The element which needs to be updated.

需要更新的元素。

The new class list to write.

新班级名单要写。

Write `cssText` to `RElement`.

将 `cssText` 写入 `RElement`。

This function does direct write without any reconciliation. Used for writing initial values, so
that static styling values do not pull in the style parser.

此函数不进行任何协调直接写入。用于写入初始值，以便静态样式值不会引入样式解析器。

Write `className` to `RElement`.

将 `className` 写入 `RElement`。

Sets up the static DOM attributes on an `RNode`.

在 `RNode` 上设置静态 DOM 属性。
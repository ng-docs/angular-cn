the lView whose parent to get

要获取其父级的 lView

Gets the parent LView of the passed LView, if the PARENT is an LContainer, will get the parent of
that LContainer, which is an LView

获取传递的 LView 的父 LView，如果 PARENT 是 LContainer，将获取该 LContainer 的父级，这是一个
LView

any component or `LView`

任何组件或 `LView`

Retrieve the root view from any component or `LView` by walking the parent `LView` until
reaching the root `LView`.

通过步行父 `LView` 直到到达根 `LView` 来从任何组件或 `LView` 中检索根视图。

the `LView` or component to get the root context for.

要获取根上下文的 `LView` 或组件。

Returns the context information associated with the application where the target is situated. It
does this by walking the parent views until it gets to the root view, then getting the context
off of that.

返回与目标所在的应用程序关联的 `RootContext`
实例。它会通过遍历父视图直到到达根视图，然后从中获取上下文来实现。

Gets the first `LContainer` in the LView or `null` if none exists.

获取 `LContainer` 中的第一个 LContainer，如果不存在，则获取 `null`。

Gets the next `LContainer` that is a sibling of the given container.

获取作为给定容器的同级的下一个 `LContainer`。
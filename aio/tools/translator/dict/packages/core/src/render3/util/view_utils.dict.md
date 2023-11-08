For efficiency reasons we often put several different data types \(`RNode`, `LView`, `LContainer`\)
in same location in `LView`. This is because we don't want to pre-allocate space for it
because the storage is sparse. This file contains utilities for dealing with such data types.

出于效率原因，我们经常将几种不同的数据类型（ `RNode` 、 `LView` 、 `LContainer` ）放在 `LView` 的同一位置。这是因为我们不想为它预分配空间，因为存储是稀疏的。该文件包含用于处理此类数据类型的实用程序。

How do we know what is stored at a given location in `LView`.

我们如何知道 `LView` 中给定位置存储的内容。

`Array.isArray(value) === false` => `RNode` \(The normal storage value\)

`Array.isArray(value) === false` => `RNode` \(正常存储值\)

`Array.isArray(value) === true` => then the `value[0]` represents the wrapped value.

`Array.isArray(value) === true` => 然后 `value[0]` 表示包装值。

`typeof value[TYPE] === 'object'` => `LView`



This happens when we have a component at a given location

当我们在给定位置有一个组件时会发生这种情况

`typeof value[TYPE] === true` => `LContainer`



This happens when we have `LContainer` binding at a given location.

当我们在给定位置绑定 `LContainer` 时，就会发生这种情况。

NOTE: it is assumed that `Array.isArray` and `typeof` operations are very efficient.

注意：假设 `Array.isArray` 和 `typeof` 操作非常有效。

wrapped value of `RNode`, `LView`, `LContainer`

`RNode`、`LView`、`LContainer` 的包装值

Returns `RNode`.

返回 `RNode`。

Returns `LView` or `null` if not found.

如果未找到，则返回 `LView` 或 `null`。

Retrieves an element value from the provided `viewData`, by unwrapping
from any containers, component views, or style contexts.

通过从任何容器、组件视图或样式上下文展开，从提供的 `viewData` 中检索元素值。

Retrieve an `RNode` for a given `TNode` and `LView`.

检索给定 `TNode` 和 `LView` 的 `RNode`。

This function guarantees in dev mode to retrieve a non-null `RNode`.

此函数保证在开发模式下检索非空 `RNode`。

Retrieve an `RNode` or `null` for a given `TNode` and `LView`.

检索给定 `TNode` 和 `LView` 的 `RNode` 或 `null`。

Some `TNode`s don't have associated `RNode`s. For example `Projection`

一些 `TNode` 没有关联的 `RNode`。例如 `Projection`

Retrieves a value from any `LView` or `TData`.

从任何 `LView` 或 `TData` 中检索值。

Checks whether a given view is in creation mode

检查给定视图是否处于创建模式

Returns a boolean for whether the view is attached to the change detection tree.

返回一个布尔值，表示视图是否附加到变更检测树。

Note: This determines whether a view should be checked, not whether it's inserted
into a container. For that, you'll want `viewAttachedToContainer` below.

注意：这决定了一个视图是否应该被检查，而不是它是否被插入到一个容器中。为此，你需要下面的 `viewAttachedToContainer`。

Returns a boolean for whether the view is attached to a container.

返回一个布尔值，表示视图是否附加到容器。

Returns a constant from `TConstants` instance.

从 `TConstants` 实例返回一个常量。

the LView on which the flags are reset

重置标志的 LView

Resets the pre-order hook flags of the view.

重置视图的预购挂钩标志。

Adds the `RefreshView` flag from the lView and updates DESCENDANT_VIEWS_TO_REFRESH counters of
parents.

从 lView 添加 `RefreshView` 标志并更新父级的 DESCENDANT_VIEWS_TO_REFRESH 计数器。

Removes the `RefreshView` flag from the lView and updates DESCENDANT_VIEWS_TO_REFRESH counters of
parents.

从 lView 中删除 `RefreshView` 标志并更新父级的 DESCENDANT_VIEWS_TO_REFRESH 计数器。

Updates the `DESCENDANT_VIEWS_TO_REFRESH` counter on the parents of the `LView` as well as the
parents above that whose

更新 `LView` 的父级及其上方父级的 `DESCENDANT_VIEWS_TO_REFRESH` 计数器

counter goes from 0 to 1, indicating that there is a new child that has a view to refresh
or

计数器从 0 变为 1，表明有一个新的子节点有一个视图要刷新或

counter goes from 1 to 0, indicating there are no more descendant views to refresh

计数器从 1 变为 0，表明没有更多的后代视图需要刷新

Stores a LView-specific destroy callback.

存储特定于 LView 的销毁回调。

Removes previously registered LView-specific destroy callback.

删除以前注册的特定于 LView 的销毁回调。
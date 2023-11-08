Removes all dehydrated views from a given LContainer:
both in internal data structure, as well as removing
corresponding DOM nodes that belong to that dehydrated view.

从给定的 LContainer 中删除所有脱水视图：在内部数据结构中，以及删除属于该脱水视图的相应 DOM 节点。

Helper function to remove all nodes from a dehydrated view.

从脱水视图中删除所有节点的辅助函数。

Walks over all views within this LContainer invokes dehydrated views
cleanup function for each one.

遍历此 LContainer 中的所有视图，为每个视图调用脱水视图清理功能。

Walks over `LContainer`s and components registered within
this LView and invokes dehydrated views cleanup function for each one.

遍历在此 LView 中注册的 `LContainer` 和组件，并为每个调用脱水视图清理功能。

Walks over all views registered within the ApplicationRef and removes
all dehydrated views from all `LContainer`s along the way.

遍历 ApplicationRef 中注册的所有视图，并沿途从所有 `LContainer` 中删除所有脱水视图。
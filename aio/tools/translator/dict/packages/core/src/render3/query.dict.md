static data of a node to check

要检查的节点的静态数据

selector to match

要匹配的选择器

directive index, -1 or null if a selector didn't match any of the local names

指令索引，如果选择器与任何本地名称不匹配，则为 -1 或 null

Iterates over local names for a given node and returns directive index
\(or -1 if a local name points to an element\).

迭代给定节点的本地名称并返回指令索引（如果本地名称指向元素，则返回 -1）。

A helper function that creates query results for a given view. This function is meant to do the
processing once and only once for a given view instance \(a set of results for a given view
doesn't change\).

为给定视图创建查询结果的帮助器函数。此函数旨在对给定的视图实例进行一次且仅一次的处理（给定视图的一组结果不会更改）。

A helper function that collects \(already materialized\) query results from a tree of views,
starting with a provided LView.

一个帮助器函数，它从视图树中收集（已经物化）查询结果，从提供的 LView 开始。

`true` if a query got dirty during change detection or if this is a static query
resolving in creation mode, `false` otherwise.

`true` 查询在变更检测期间变脏，或者这是在创建模式下解析的静态查询，则为 true，否则为 `false`。

Refreshes a query by combining matches from all active views and removing matches from deleted
views.

通过组合所有活动视图中的匹配项并从已删除的视图中删除匹配项来刷新查询。

The type for which the query will search

查询将搜索的类型

Flags associated with the query

与查询关联的标志

What to save in the query

要在查询中保存的内容

Creates new QueryList, stores the reference in LView and returns QueryList.

创建新的 QueryList，将引用存储在 LView 中并返回 QueryList。

Current directive index

当前的指令索引

QueryList<T>

查询列表<T>

Registers a QueryList, associated with a content query, for later refresh \(part of a view
refresh\).

注册与内容查询关联的 QueryList 以供以后刷新（视图刷新的一部分）。

Loads a QueryList corresponding to the current view or content query.

加载与当前视图或内容查询对应的 QueryList。
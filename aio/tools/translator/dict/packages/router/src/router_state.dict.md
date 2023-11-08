Every node in the route tree is an `ActivatedRoute` instance
that knows about the "consumed" URL segments, the extracted parameters,
and the resolved data.
Use the `ActivatedRoute` properties to traverse the tree from any node.

以下片段显示了组件如何获取当前状态的根节点以建立其自己的路由树：。

The following fragment shows how a component gets the root node
of the current state to establish its own route tree:

以下片段显示了组件如何获取当前状态的根节点以建立其自己的路由树：

[Getting route information](guide/router#getting-route-information)

[获取路由信息](guide/router#getting-route-information)

Represents the state of the router as a tree of activated routes.

将路由器的状态表示为已激活路由的树。

Provides access to information about a route associated with a component
that is loaded in an outlet.
Use to traverse the `RouterState` tree and extract information from nodes.

允许访问与某出口中加载的组件关联路由信息。用于遍历 `RouterState` 树并从节点提取信息。

The following example shows how to construct a component using information from a
currently activated route.

以下示例演示如何使用当前激活的路由中的信息来构造组件。

Note: the observables in this class only emit when the current and previous values differ based
on shallow equality. For example, changing deeply nested properties in resolved `data` will not
cause the `ActivatedRoute.data` `Observable` to emit a new value.

注意：此类中的 observable 仅当当前值和以前的值基于浅等式而不同时，才会发出。例如，更改解析 `data` 中的深层嵌套属性不会导致 `ActivatedRoute.data` `Observable` 发出新值。

{&commat;example router/activated-route/module.ts region="activated-route"
    header="activated-route.component.ts"}



The current snapshot of this route

本路由此刻的快照

An Observable of the resolved route title

已解析路由标题的 Observable

An observable of the URL segments matched by this route.

与该路由匹配的 URL 段的可观察值。

An observable of the matrix parameters scoped to this route.

此路由范围内的矩阵参数的可观察值。

An observable of the query parameters shared by all the routes.

所有路由共享的查询参数的可观察值。

An observable of the URL fragment shared by all the routes.

所有路由共享的 URL 片段的可观察对象。

An observable of the static and resolved data of this route.

此路由的静态和已解析数据的可观察对象。

The configuration used to match this route.

用于匹配本路由的配置项。

The root of the router state.

路由器状态树的根节点。

The parent of this route in the router state tree.

在路由器状态树中，当前路由的父路由。

The first child of this route in the router state tree.

在路由器状态树中，当前路由的第一个子路由。

The children of this route in the router state tree.

在路由器状态树中，当前路由的所有子路由。

The path from the root of the router state tree to this route.

在路由器状态树中从根节点开始到当前路由的完整路径。

An Observable that contains a map of the required and optional parameters
specific to the route.
The map supports retrieving single and multiple values from the same parameter.

一个 Observable，其中包含特定于路由的必要和可选参数的映射。该映射支持从同一参数中检索单个和多个值。

An Observable that contains a map of the query parameters available to all routes.
The map supports retrieving single and multiple values from the query parameter.

一个 Observable，其中包含可用于所有路由的查询参数的映射。该映射支持从查询参数中检索单个和多个值。

Returns the inherited params, data, and resolve for a given route.
By default, this only inherits values up to the nearest path-less or component-less route.

返回给定路由的继承参数、数据和解析。默认情况下，这只会继承最近的无路径或无组件路由的值。

Contains the information about a route associated with a component loaded in an
outlet at a particular moment in time. ActivatedRouteSnapshot can also be used to
traverse the router state tree.

包含与当前组件相关的路由的当前瞬间信息。`ActivatedRoute` 也可用于遍历路由器的状态树。`ActivatedRouteSnapshot` 也能用于遍历路由器状态树。

The following example initializes a component with route information extracted
from the snapshot of the root node at the time of creation.

以下示例使用在创建时从根节点的快照中提取的路由信息来初始化组件。

The configuration used to match this route

用于匹配本路由的配置项。

The resolved route title

解析的路由标题

The root of the router state

路由器状态树的根节点。

The parent of this route in the router state tree

在路由器状态树中，当前路由的父路由。

The first child of this route in the router state tree

在路由器状态树中，当前路由的第一个子路由。

The children of this route in the router state tree

在路由器状态树中，当前路由的所有子路由。

The path from the root of the router state tree to this route

在路由器状态树中从根节点开始到当前路由的完整路径。

Represents the state of the router at a moment in time.

表示路由器在当前瞬间的状态。

This is a tree of activated route snapshots. Every node in this tree knows about
the "consumed" URL segments, the extracted parameters, and the resolved data.

以下示例演示了如何使用创建时根节点状态快照中的信息初始化组件。

The following example shows how a component is initialized with information
from the snapshot of the root node's state at the time of creation.

以下示例演示了如何使用创建时根节点状态快照中的信息初始化组件。

The expectation is that the activate route is created with the right set of parameters.
So we push new values into the observables only when they are not the initial values.
And we detect that by checking if the snapshot field is set.

期望是使用正确的参数集创建激活路由。因此，只有当新值不是初始值时，我们才会将新值推送到可观察对象中。我们通过检查是否设置了快照字段来检测到这一点。
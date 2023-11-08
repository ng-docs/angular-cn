An interface that defines the contract for developing a component outlet for the `Router`.

一个接口，定义了为 `Router` 开发组件出口的契约。

An outlet acts as a placeholder that Angular dynamically fills based on the current router state.

出口充当占位符，Angular 会根据当前的路由器状态动态填充。

A router outlet should register itself with the `Router` via
`ChildrenOutletContexts#onChildOutletCreated` and unregister with
`ChildrenOutletContexts#onChildOutletDestroyed`. When the `Router` identifies a matched `Route`,
it looks for a registered outlet in the `ChildrenOutletContexts` and activates it.

路由器出口应该通过 ChildrenOutletContexts#onChildOutletCreated 向 `Router` 注册自己，并通过 `ChildrenOutletContexts#onChildOutletCreated` `ChildrenOutletContexts#onChildOutletDestroyed` 注册。当 `Router` 识别到匹配的 `Route` 时，它会在 `ChildrenOutletContexts` 中查找注册的插座并激活它。

Whether the given outlet is activated.

给定的插座是否已激活。

An outlet is considered "activated" if it has an active component.

如果插座有活动组件，则认为它是“激活的”。

The instance of the activated component or `null` if the outlet is not activated.

已激活组件的实例；如果未激活插座，则为 `null`。

The `Data` of the `ActivatedRoute` snapshot.

`ActivatedRoute` 快照的 `Data`。

The `ActivatedRoute` for the outlet or `null` if the outlet is not activated.

插座的 `ActivatedRoute`，如果此插座未激活，则为 `null`。

Called by the `Router` when the outlet should activate \(create a component\).

在插座应该激活（创建组件）时由 `Router` 调用。

A request to destroy the currently activated component.

销毁当前激活的组件的请求。

When a `RouteReuseStrategy` indicates that an `ActivatedRoute` should be removed but stored for
later re-use rather than destroyed, the `Router` will call `detach` instead.

当 `RouteReuseStrategy` 表明应该删除 `ActivatedRoute` 但存储以供以后重用而不是销毁时，`Router` 将改为调用 `detach`。

Called when the `RouteReuseStrategy` instructs to detach the subtree.

受 `RouteReuseStrategy` 的指示，从子树中分离开时调用。

This is similar to `deactivate`, but the activated component should _not_ be destroyed.
Instead, it is returned so that it can be reattached later via the `attach` method.

这类似于 `deactivate`，但激活的组件 _ 不应 _ 被销毁。相反，它会被返回，以便稍后可以通过 `attach` 方法重新附加它。

Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree.

`RouteReuseStrategy` 的指示，把以前分离的子树重新附加回来时调用。

Emits an activate event when a new component is instantiated

实例化新组件时发出 activate 事件

Emits a deactivate event when a component is destroyed.

当组件被销毁时发出 deactivate 事件。

Emits an attached component instance when the `RouteReuseStrategy` instructs to re-attach a
previously detached subtree.

当 `RouteReuseStrategy` 指示重新附加以前分离的子树时，发出一个附加的组件实例。

Emits a detached component instance when the `RouteReuseStrategy` instructs to detach the
subtree.

当 `RouteReuseStrategy` 指示分离子树时发出一个分离的组件实例。

Used to indicate that the outlet is able to bind data from the `Router` to the outlet
component's inputs.

用于指示出口能够将数据从 `Router` 绑定到出口组件的输入。

When this is `undefined` or `false` and the developer has opted in to the
feature using `withComponentInputBinding`, a warning will be logged in dev mode if this outlet
is used in the application.

当这是 `undefined` 或 `false` 并且开发人员已选择使用 `withComponentInputBinding` 功能时，如果在应用程序中使用此出口，将在开发模式下记录警告。

Acts as a placeholder that Angular dynamically fills based on the current router state.

一个占位符，Angular 会根据当前的路由器状态动态填充它。

Each outlet can have a unique name, determined by the optional `name` attribute.
The name cannot be set or changed dynamically. If not set, default value is "primary".

每个出口可以具有唯一的名称，该 `name` 由可选的 name 属性确定。该名称不能动态设置或更改。如果未设置，则默认值为 “primary”。

Named outlets can be the targets of secondary routes.
The `Route` object for a secondary route has an `outlet` property to identify the target outlet:

每当新组件实例化之后，路由出口就会发出一个激活事件；在销毁时则发出取消激活的事件。

Using named outlets and secondary routes, you can target multiple outlets in
the same `RouterLink` directive.

使用命名的出口和辅助路由，你可以在同一 `RouterLink` 指令中定位多个出口。

The router keeps track of separate branches in a navigation tree for each named outlet and
generates a representation of that tree in the URL.
The URL for a secondary route uses the following syntax to specify both the primary and secondary
routes at the same time:

路由器在导航树中跟踪每个命名出口的单独分支，并在 URL 中生成该树的表示形式。辅助路由的 URL 使用以下语法同时指定主要路由和辅助路由：

A router outlet emits an activate event when a new component is instantiated,
deactivate event when a component is destroyed.
An attached event emits when the `RouteReuseStrategy` instructs the outlet to reattach the
subtree, and the detached event emits when the `RouteReuseStrategy` instructs the outlet to
detach the subtree.

每当新组件实例化之后，路由出口就会发出一个激活事件；在销毁时则发出取消激活的事件。

[Routing tutorial](guide/router-tutorial-toh#named-outlets "Example of a named
outlet and secondary route configuration").

[路由导航](guide/router-tutorial-toh#named-outlets "命名出口与第二路由的配置范例")。

[named outlets](guide/router-tutorial-toh#displaying-multiple-routes-in-named-outlets)

[命名网点](guide/router-tutorial-toh#displaying-multiple-routes-in-named-outlets)

The name of the outlet

出口名称

The currently activated component instance.

当前激活的组件实例。

An error if the outlet is not activated.

如果插座未激活，则会出现错误。

Called when the `RouteReuseStrategy` instructs to detach the subtree

受 `RouteReuseStrategy` 的指示，从子树中分离开时调用

Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree

`RouteReuseStrategy` 的指示，把以前分离的子树重新附加回来时调用

Injectable used as a tree-shakable provider for opting in to binding router data to component
inputs.

Injectable 用作 tree-shakable 提供程序，用于选择将路由器数据绑定到组件输入。

The RouterOutlet registers itself with this service when an `ActivatedRoute` is attached or
activated. When this happens, the service subscribes to the `ActivatedRoute` observables \(params,
queryParams, data\) and sets the inputs of the component using `ComponentRef.setInput`.
Importantly, when an input does not have an item in the route data with a matching key, this
input is set to `undefined`. If it were not done this way, the previous information would be
retained if the data got removed from the route \(i.e. if a query parameter is removed\).

当附加或激活 `ActivatedRoute` 时，RouterOutlet 将自己注册到此服务。发生这种情况时，服务会订阅 `ActivatedRoute` 可观察对象（参数、查询参数、数据）并使用 `ComponentRef.setInput` 设置组件的输入。重要的是，当输入在路由数据中没有具有匹配键的项目时，此输入将设置为 `undefined`。如果不这样做，如果数据从路由中移除（即，如果查询参数被移除），先前的信息将被保留。

The `RouterOutlet` should unregister itself when destroyed via `unsubscribeFromRouteData` so that
the subscriptions are cleaned up.

`RouterOutlet` 应该在通过 `unsubscribeFromRouteData` 销毁时自行注销，以便清理订阅。
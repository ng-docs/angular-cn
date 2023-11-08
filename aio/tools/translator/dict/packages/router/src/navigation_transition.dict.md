Options that modify the `Router` URL.
Supply an object containing any of these properties to a `Router` navigation function to
control how the target URL should be constructed.

修改 `Router` URL 的选项。将包含这些属性中的任何一个的对象提供给 `Router` 导航函数，以控制目标 URL 的构建方式。

[Router.navigate\(\) method](api/router/Router#navigate)

[Router.navigate\(\) 方法](api/router/Router#navigate)

[Router.createUrlTree\(\) method](api/router/Router#createurltree)

[Router.createUrlTree\(\) 方法](api/router/Router#createurltree)

[Routing and Navigation guide](guide/router)

[路由和导航指南](guide/router)

Specifies a root URI to use for relative navigation.

允许从当前激活的路由进行相对导航。

For example, consider the following route configuration where the parent route
has two children.

比如，考虑下列路由器配置，parent 路由拥有两个子路由。

The following `go()` function navigates to the `list` route by
interpreting the destination URI as relative to the activated `child`  route

下面的 `go()` 函数会把目标 URI 解释为相对于已激活路由 `child` 的，从而导航到 `list` 路由。

A value of `null` or `undefined` indicates that the navigation commands should be applied
relative to the root.

值为 `null` 或 `undefined` 表明导航命令应该相对于根应用。

Sets query parameters to the URL.

设置 URL 的查询参数。

Sets the hash fragment for the URL.

设置 URL 的哈希片段（`#`）。

How to handle query parameters in the router link for the next navigation.
One of:

如何在路由器链接中处理查询参数以进行下一个导航。为下列值之一：

`preserve` : Preserve current parameters.

`preserve`：保留当前参数。

`merge` : Merge new with current parameters.

`merge`：合并新的当前参数。

The "preserve" option discards any new query params:

“preserve” 选项将放弃所有新的查询参数：

The "merge" option appends new query params to the params from the current URL:

“merge” 选项会将新的查询参数附加到当前 URL 的参数中：

In case of a key collision between current parameters and those in the `queryParams` object,
the new value is used.

`queryParams` 对象中的参数之间发生键名冲突，则使用新值。

When true, preserves the URL fragment for the next navigation

在后续导航时保留 `#` 片段

Options that modify the `Router` navigation strategy.
Supply an object containing any of these properties to a `Router` navigation function to
control how the target URL should be constructed or interpreted.

修改 `Router` 导航策略的选项。将包含这些属性中的任何一个的对象提供给 `Router` 导航函数，以控制目标 URL 的构建或解释方式。

[Router.navigateByUrl\(\) method](api/router/Router#navigatebyurl)

[Router.navigateByUrl\(\) 方法](api/router/Router#navigatebyurl)

Information about a navigation operation.
Retrieve the most recent navigation object with the
[Router.getCurrentNavigation\(\) method](api/router/Router#getcurrentnavigation) .

有关导航操作的信息。使用[Router.getCurrentNavigation\(\) 方法](api/router/Router#getcurrentnavigation)检索最新的导航对象。

*id* : The unique identifier of the current navigation.

*id*：当前导航的唯一标识符。

*initialUrl* : The target URL passed into the `Router#navigateByUrl()` call before navigation.
This is the value before the router has parsed or applied redirects to it.

*initialUrl*：在导航前传给 `Router#navigateByUrl()` 调用的目标 URL。这是路由器解析或对其应用重定向之前的值。

*extractedUrl* : The initial target URL after being parsed with `UrlSerializer.extract()`.

*extractedUrl*：使用 `UrlSerializer.extract()` 解析后的初始目标 URL。

*finalUrl* : The extracted URL after redirects have been applied.
This URL may not be available immediately, therefore this property can be `undefined`.
It is guaranteed to be set after the `RoutesRecognized` event fires.

*finalUrl*：应用重定向之后提取的 URL。该 URL 可能不会立即可用，因此该属性也可以是 `undefined`。在 `RoutesRecognized` 事件触发后进行设置。

*trigger* : Identifies how this navigation was triggered.
\-- 'imperative'--Triggered by `router.navigateByUrl` or `router.navigate`.
\-- 'popstate'--Triggered by a popstate event.
\-- 'hashchange'--Triggered by a hashchange event.

*trigger*：表明这次导航是如何触发的。-- 'imperative'-- 由 `router.navigateByUrl` 或 `router.navigate` 触发。-- 'popstate'-- 由 popstate 事件触发。-- 'hashchange'-- 由 hashchange 事件触发。

*extras* : A `NavigationExtras` options object that controlled the strategy used for this
navigation.

*extras*：一个 `NavigationExtras` 选项对象，它控制用于此导航的策略。

*previousNavigation* : The previously successful `Navigation` object. Only one previous
navigation is available, therefore this previous `Navigation` object has a `null` value for its
own `previousNavigation`.

*previousNavigation*：先前成功的 `Navigation` 对象。只有一个先前的导航可用，因此该先前的 `Navigation` 对象自己的 `previousNavigation` 值为 `null`。

The unique identifier of the current navigation.

当前导航的唯一标识符。

The target URL passed into the `Router#navigateByUrl()` call before navigation. This is
the value before the router has parsed or applied redirects to it.

在导航之前传递给 `Router#navigateByUrl()` 调用的目标 URL。这是路由器解析或应用重定向之前的值。

The initial target URL after being parsed with `UrlHandlingStrategy.extract()`.

使用 `UrlHandlingStrategy.extract()` 解析后的初始目标 URL。

The extracted URL after redirects have been applied.
This URL may not be available immediately, therefore this property can be `undefined`.
It is guaranteed to be set after the `RoutesRecognized` event fires.

应用重定向后提取的 URL。此 URL 可能无法立即使用，因此此属性可以是 `undefined`。保证在 `RoutesRecognized` 事件触发之后设置。

Identifies how this navigation was triggered.

标识此导航的触发方式。

'imperative'--Triggered by `router.navigateByUrl` or `router.navigate`.

“命令式” - 由 `router.navigateByUrl` 或 `router.navigate` 触发。

'popstate'--Triggered by a popstate event.

“popstate”--由 popstate 事件触发。

'hashchange'--Triggered by a hashchange event.

“hashchange”--由 hashchange 事件触发。

Options that controlled the strategy used for this navigation.
See `NavigationExtras`.

控制此导航使用的策略的选项。请参阅 `NavigationExtras`。

The previously successful `Navigation` object. Only one previous navigation
is available, therefore this previous `Navigation` object has a `null` value
for its own `previousNavigation`.

以前成功的 `Navigation` 对象。只有一个以前的导航可用，因此这 `previousNavigation` 的 `Navigation` 对象的 `null`。

The interface from the Router needed by the transitions. Used to avoid a circular dependency on
Router. This interface should be whittled down with future refactors. For example, we do not need
to get `UrlSerializer` from the Router. We can instead inject it in `NavigationTransitions`
directly.

转换所需的来自路由器的接口。用于避免对路由器的循环依赖。这个接口应该在未来的重构中被削减。例如，我们不需要从 Router 获取 `UrlSerializer`。我们可以直接将它注入 `NavigationTransitions`。

Hook that enables you to pause navigation after the preactivation phase.
Used by `RouterModule`.

使你能够在预激活阶段后暂停导航的挂钩。由 `RouterModule` 使用。
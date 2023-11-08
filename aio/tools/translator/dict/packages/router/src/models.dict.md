How to handle a navigation request to the current URL. One of:

定义当路由器收到一个导航到当前 URL 的请求时应该怎么做。可取下列值之一：

`'ignore'` :  The router ignores the request it is the same as the current state.

`'ignore'` : 路由器忽略请求，与当前状态相同。

`'reload'` : The router processes the URL even if it is not different from the current state.
One example of when you might want this option is if a `canMatch` guard depends on
application state and initially rejects navigation to a route. After fixing the state, you want
to re-navigate to the same URL so the route with the `canMatch` guard can activate.

`'reload'`：路由器处理 URL，即使它与当前状态没有区别。你可能需要此选项的一个示例是，如果 `canMatch` 守卫取决于应用程序状态并且最初拒绝导航到路由。修复状态后，你想要重新导航到相同的 URL，以便可以激活带有 `canMatch` 守卫的路由。

Note that this only configures whether the Route reprocesses the URL and triggers related
action and events like redirects, guards, and resolvers. By default, the router re-uses a
component instance when it re-navigates to the same component type without visiting a different
component first. This behavior is configured by the `RouteReuseStrategy`. In order to reload
routed components on same url navigation, you need to set `onSameUrlNavigation` to `'reload'`
_and_ provide a `RouteReuseStrategy` which returns `false` for `shouldReuseRoute`. Additionally,
resolvers and most guards for routes do not run unless the path or path params changed
\(configured by `runGuardsAndResolvers`\).

请注意，这仅配置 Route 是否重新处理 URL 并触发相关操作和事件，如重定向、守卫和解析器。默认情况下，当路由器重新导航到相同的组件类型而不首先访问不同的组件时，它会重新使用组件实例。此行为由 `RouteReuseStrategy` 配置。为了在相同的 url 导航上重新加载路由组件，你需要将 `onSameUrlNavigation` 设置为 `'reload'`_ 并 _ 提供一个 `RouteReuseStrategy`，它为 `shouldReuseRoute` 返回 `false`。此外，除非路径或路径参数更改（由 `runGuardsAndResolvers` 配置），否则解析器和大多数路由守卫不会运行。

The `InjectionToken` and `@Injectable` classes for guards and resolvers are deprecated in favor
of plain JavaScript functions instead.. Dependency injection can still be achieved using the
`inject` function from `@angular/core` and an injectable class can be used as a functional guard
using `inject`: `canActivate: [() => inject(myGuard).canActivate()]`.

守卫和解析器的 `InjectionToken` 和 `@Injectable` 类已弃用，取而代之的是普通的 JavaScript 函数。依赖注入仍然可以使用来自 `@angular/core` `inject` 函数来实现，并且可注入类可以用作使用 `inject` 的功能守卫：`canActivate: [() => inject(myGuard).canActivate()]`。

[Router configuration guide](guide/router-reference#configuration)

[路由器配置指南](guide/router-reference#configuration)

Represents a route configuration for the Router service.
An array of `Route` objects, used in `Router.config` and for nested route configurations
in `Route.children`.

表示 Router 服务的路由配置。`Route` 对象的数组，在 `Route.children` 中使用以及在 `Router.config` 中用于嵌套路由配置。

Represents the result of matching URLs with a custom matching function.

表示使用自定义匹配函数匹配 URL 的结果。

`consumed` is an array of the consumed URL segments.

`consumed` 是一个表示已消费的 URL 片段的数组。

`posParams` is a map of positional parameters.

`posParams` 是一个位置型参数的映射表。

A function for matching a route against URLs. Implement a custom URL matcher
for `Route.matcher` when a combination of `path` and `pathMatch`
is not expressive enough. Cannot be used together with `path` and `pathMatch`.

将路由与 URL 匹配的函数。当 `path` 和 `pathMatch` 的组合没有足够的表现力时，为 `Route.matcher` 实现自定义 URL 匹配器。不能与 `path` 和 `pathMatch` 一起使用。

The function takes the following arguments and returns a `UrlMatchResult` object.

该函数采用以下参数，并返回一个 `UrlMatchResult` 对象。

*segments* : An array of URL segments.

*segment*：URL 段的数组。

*group* : A segment group.

*group*：段组。

*route* : The route to match against.

*route*：要匹配的路由。

The following example implementation matches HTML files.

下列例子中实现的匹配器会匹配 HTML 文件。

Represents static data associated with a particular route.

表示与特定路由关联的静态数据。

`Route#resolve`.



Represents the resolved data associated with a particular route.

表示与特定路由关联的解析数据。

An ES Module object with a default export of the given type.

具有给定类型的默认导出的 ES 模块对象。

Default exports are bound under the name `"default"`, per the ES Module spec:
https://tc39.es/ecma262/#table-export-forms-mapping-to-exportentry-records

根据 ES 模块规范，默认导出绑定在名称 `"default"`：https://tc39.es/ecma262/#table-export-forms-mapping-to-exportentry-records

[Route.loadChildren](api/router/Route#loadChildren)

[路线.loadChildren](api/router/Route#loadChildren)

A function that is called to resolve a collection of lazy-loaded routes.
Must be an arrow function of the following form:
`() => import('...').then(mod => mod.MODULE)`
or
`() => import('...').then(mod => mod.ROUTES)`

为解析惰性加载的路由集合而调用的函数。必须是以下形式的箭头函数：`() => import('...').then(mod => mod.MODULE)` 或 `() => import('...').then(mod => mod.ROUTES)`

For example:

比如：

or

或者

If the lazy-loaded routes are exported via a `default` export, the `.then` can be omitted:

如果惰性加载的路由是通过 `default` 导出来导出的，则 `.then` 可以省略：

A function that returns a set of routes to load.

返回一组要加载的路由的函数。

How to handle query parameters in a router link.
One of:

如何处理路由器链接中的查询参数。之一：

`"merge"` : Merge new parameters with current parameters.

`merge`：将新参数与当前参数合并。

`"preserve"` : Preserve current parameters.

`preserve`：保留当前参数。

`""` : Replace current parameters with new parameters. This is the default behavior.

`preserve`：保留当前参数。

[Route.runGuardsAndResolvers](api/router/Route#runGuardsAndResolvers)



A policy for when to run guards and resolvers on a route.

何时在路由上运行警卫和解析器的策略。

Guards and/or resolvers will always run when a route is activated or deactivated. When a route is
unchanged, the default behavior is the same as `paramsChange`.

激活或停用路由时，守卫和/或解析器将始终运行。当路由未更改时，默认行为与 `paramsChange` 相同。

`paramsChange` : Rerun the guards and resolvers when path or
path param changes. This does not include query parameters. This option is the default.

`paramsChange`：当路径或路径参数更改时重新运行警卫和解析器。这不包括查询参数。此选项是默认值。

`always` : Run on every execution.

`always`：在每次执行时运行。

`pathParamsChange` : Rerun guards and resolvers when the path params
change. This does not compare matrix or query parameters.

`pathParamsChange`：路径参数更改时重新运行保护器和解析器。这不会比较矩阵或查询参数。

`paramsOrQueryParamsChange` : Run when path, matrix, or query parameters change.

`paramsOrQueryParamsChange`：在路径、矩阵或查询参数更改时运行。

`pathParamsOrQueryParamsChange` : Rerun guards and resolvers when the path params
change or query params have changed. This does not include matrix parameters.

`pathParamsOrQueryParamsChange`：当路径参数更改或查询参数更改时，重新运行保护器和解析器。这不包括矩阵参数。

Simple Configuration

简单配置

The following route specifies that when navigating to, for example,
`/team/11/user/bob`, the router creates the 'Team' component
with the 'User' child component in it.

以下路由指定在导航到 `/team/11/user/bob` 时，路由器会在其中创建带有 'User' 子组件的 'Team' 组件。

Multiple Outlets

多重出口

The following route creates sibling components with multiple outlets.
When navigating to `/team/11(aux:chat/jim)`, the router creates the 'Team' component next to
the 'Chat' component. The 'Chat' component is placed into the 'aux' outlet.

以下路由创建具有多个出口的兄弟组件。当导航到 `/team/11(aux:chat/jim)` 时，路由器会在 'Chat' 组件旁边创建 'Team' 组件。'Chat' 组件放置在 'aux' 出口中。

Wild Cards

通配符

The following route uses wild-card notation to specify a component
that is always instantiated regardless of where you navigate to.

以下路由使用通配符表示法来指定始终实例化的组件，无论你导航到何处。

Redirects

重定向

The following route uses the `redirectTo` property to ignore a segment of
a given URL when looking for a child path.

以下路由在查找子路径时使用 `redirectTo` 属性忽略给定 URL 的一部分。

When navigating to '/team/11/legacy/user/jim', the router changes the URL segment
'/team/11/legacy/user/jim' to '/team/11/user/jim', and then instantiates
the Team component with the User child component in it.

当导航到“/team/11/legacy/user/jim”时，路由器将 URL 段“/team/11/legacy/user/jim”更改为“/team/11/user/jim”，然后实例化包含 User 子组件的团队组件。

The redirect path can be relative, as shown in this example, or absolute.
If we change the `redirectTo` value in the example to the absolute URL segment '/user/:name',
the result URL is also absolute, '/user/jim'.

重定向路径可以是相对的（如本示例所示），也可以是绝对的。`redirectTo` 值更改为绝对 URL 段 '/user/:name'，则结果 URL 也是绝对 URL，'/user/jim'。

Empty Path

空路径

Empty-path route configurations can be used to instantiate components that do not 'consume'
any URL segments.

在下列配置中，当导航到 `/team/11` 时，路由器会实例化 'AllUsers' 组件。

In the following configuration, when navigating to
`/team/11`, the router instantiates the 'AllUsers' component.

在以下配置中，导航到 `/team/11` 时，路由器会实例化 'AllUsers' 组件。

Empty-path routes can have children. In the following example, when navigating
to `/team/11/user/jim`, the router instantiates the wrapper component with
the user component in it.

请注意，空路径路由会继承其父级的参数和数据。

Note that an empty path route inherits its parent's parameters and data.

请注意，空路径路由会继承其父级的参数和数据。

Matching Strategy

匹配策略

The default path-match strategy is 'prefix', which means that the router
checks URL elements from the left to see if the URL matches a specified path.
For example, '/team/11/user' matches 'team/:id'.

默认的路径匹配策略是 'prefix'，这意味着路由器从左开始检查 URL 元素以查看 URL 是否与指定的路径匹配。比如，'/team/11/user' 与 'team/:id' 匹配。

You can specify the path-match strategy 'full' to make sure that the path
covers the whole unconsumed URL. It is important to do this when redirecting
empty-path routes. Otherwise, because an empty path is a prefix of any URL,
the router would apply the redirect even when navigating to the redirect destination,
creating an endless loop.

在以下示例中，提供 'full' `pathMatch` 策略可确保路由器仅在导航到 '/' 时才应用重定向。

In the following example, supplying the 'full' `pathMatch` strategy ensures
that the router applies the redirect if and only if navigating to '/'.

在以下示例中，提供 'full' `pathMatch` 策略可确保路由器当且仅当导航到 '/' 时应用重定向。

Componentless Routes

无组件路由

You can share parameters between sibling components.
For example, suppose that two sibling components should go next to each other,
and both of them require an ID parameter. You can accomplish this using a route
that does not specify a component at the top level.

在以下示例中，'MainChild' 和 'AuxChild' 是同级。当导航到 'parent/10/\(a//aux:b\)' 时，该路由会实例化彼此相邻的主要子组件和 aux 子组件。为此，应用程序组件必须定义主要和辅助出口。

In the following example, 'MainChild' and 'AuxChild' are siblings.
When navigating to 'parent/10/\(a//aux:b\)', the route instantiates
the main child and aux child components next to each other.
For this to work, the application component must have the primary and aux outlets defined.

在以下示例中，“MainChild”和“AuxChild”是同级。当导航到 'parent/10/\(a//aux:b\)' 时，该路由会实例化彼此相邻的主子组件和辅助子组件。为此，应用程序组件必须定义主要的出口和辅助出口。

The router merges the parameters, data, and resolve of the componentless
parent into the parameters, data, and resolve of the children.

当用空路径字符串定义子组件时，这特别有用，如以下示例所示。使用此配置，导航到 '/parent/10' 将创建主要子组件和 aux 组件。

This is especially useful when child components are defined
with an empty path string, as in the following example.
With this configuration, navigating to '/parent/10' creates
the main child and aux components.

当使用空路径字符串定义子组件时，这特别有用，如下例所示。使用此配置，导航到 '/parent/10' 会创建主子组件和 aux 组件。

Lazy Loading

惰性加载

Lazy loading speeds up application load time by splitting the application
into multiple bundles and loading them on demand.
To use lazy loading, provide the `loadChildren` property in the `Route` object,
instead of the `children` property.

给定以下示例路由，路由器将使用浏览器原生导入体系按需惰性加载相关模块。

Given the following example route, the router will lazy load
the associated module on demand using the browser native import system.

对于以下示例路由，路由器将使用浏览器原生导入系统按需惰性加载关联的模块。

A configuration object that defines a single route.
A set of routes are collected in a `Routes` array to define a `Router` configuration.
The router attempts to match segments of a given URL against each route,
using the configuration options defined in this object.

定义单个路由的配置对象。一组路由被收集在 `Routes` 数组中以定义 `Router` 配置。路由器会尝试使用此对象中定义的配置选项，将给定 URL 的段与每个路由进行匹配。

Supports static, parameterized, redirect, and wildcard routes, as well as
custom route data and resolve methods.

欲知详情，请参阅[《路由指南》](guide/router)。

For detailed usage information, see the [Routing Guide](guide/router).

有关详细的用法信息，请参阅[路由指南](guide/router)。

Used to define a page title for the route. This can be a static string or an `Injectable` that
implements `Resolve`.

用于定义路由的页面标题。这可以是静态字符串或实现 `Resolve` 的 `Injectable`。

The path to match against. Cannot be used together with a custom `matcher` function.
A URL string that uses router matching notation.
Can be a wild card \(`**`\) that matches any URL \(see Usage Notes below\).
Default is "/" \(the root path\).

匹配的路径。不能与自定义 `matcher` 功能一起使用。使用路由器匹配表示法的 URL 字符串。可以是与任何 URL 匹配的通配符（`**`）（请参阅下面的使用说明）。默认值为 “/”（根路径）。

The path-matching strategy, one of 'prefix' or 'full'.
Default is 'prefix'.

路径匹配策略，为 “prefix” 或 “full” 之一。默认为“prefix”。

By default, the router checks URL elements from the left to see if the URL
matches a given path and stops when there is a config match. Importantly there must still be a
config match for each segment of the URL. For example, '/team/11/user' matches the prefix
'team/:id' if one of the route's children matches the segment 'user'. That is, the URL
'/team/11/user' matches the config
`{path: 'team/:id', children: [{path: ':user', component: User}]}`
but does not match when there are no children as in `{path: 'team/:id', component: Team}`.

默认情况下，路由器会从左侧检查 URL 元素以查看 URL 是否与给定路径匹配，并在匹配上某个配置时停止。重要的是，URL 的每个段仍然必须与某个配置匹配。例如，如果路由的子项（children）之一与段“user”匹配，则认为“/team/11/user”与前缀“team/:id”匹配。也就是说，URL '/team/11/user' 可以匹配 `{path: 'team/:id', children: [{path: ':user', component: User}]}` 配置项，但当 `{path: 'team/:id', component: Team}` 中没有子项（children 属性）时则不匹配。

The path-match strategy 'full' matches against the entire URL.
It is important to do this when redirecting empty-path routes.
Otherwise, because an empty path is a prefix of any URL,
the router would apply the redirect even when navigating
to the redirect destination, creating an endless loop.

路径匹配策略 'full' 匹配整个 URL。重定向空路径路由时，这样做很重要。否则，由于空路径是任何 URL 的前缀，因此路由器即使导航到重定向目标时也会应用重定向，从而创建一个无限循环。

A custom URL-matching function. Cannot be used together with `path`.

自定义 URL 匹配功能。不能与 `path` 一起使用。

The component to instantiate when the path matches.
Can be empty if child routes specify components.

路径匹配时实例化的组件。如果要由其子路由指定组件，则可以为空。

An object specifying a lazy-loaded component.

指定惰性加载组件的对象。

Filled for routes `loadComponent` once the component is loaded.

加载组件后为路由 `loadComponent` 填充。

A URL to redirect to when the path matches.

路径匹配时要重定向到的 URL。

Absolute if the URL begins with a slash \(/\), otherwise relative to the path URL.
Note that no further redirects are evaluated after an absolute redirect.

如果 URL 以斜杠 \(/\) 开头，则为绝对值，否则相对于路径 URL。请注意，在绝对重定向之后不会估算进一步的重定向。

When not present, router does not redirect.

当不存在时，路由器不会重定向。

Name of a `RouterOutlet` object where the component can be placed
when the path matches.

`RouterOutlet` 对象的名字，当路径匹配时会把组件放置在其中。

An array of `CanActivateFn` or DI tokens used to look up `CanActivate()`
handlers, in order to determine if the current user is allowed to
activate the component. By default, any user can activate.

一个依赖注入标记的数组，用于查找 `CanActivate()` 处理程序，以确定是否允许当前用户激活组件。默认情况下，任何用户都可以激活。

When using a function rather than DI tokens, the function can call `inject` to get any required
dependencies. This `inject` call must be done in a synchronous context.

当使用函数而不是 DI 标记时，函数可以调用 `inject` 来获取任何所需的依赖项。此 `inject` 调用必须在同步上下文中完成。

An array of `CanMatchFn` or DI tokens used to look up `CanMatch()`
handlers, in order to determine if the current user is allowed to
match the `Route`. By default, any route can match.

用于查找 `CanMatch()` 处理程序的 `CanMatchFn` 或 DI 标记的数组，以确定是否允许当前用户匹配 `Route`。默认情况下，任何路由都可以匹配。

An array of `CanActivateChildFn` or DI tokens used to look up `CanActivateChild()` handlers,
in order to determine if the current user is allowed to activate
a child of the component. By default, any user can activate a child.

用于查找 `CanActivateChild()` 处理程序的 DI 标记数组，以确定是否允许当前用户激活组件的子项。默认情况下，任何用户都可以激活子项。

An array of `CanDeactivateFn` or DI tokens used to look up `CanDeactivate()`
handlers, in order to determine if the current user is allowed to
deactivate the component. By default, any user can deactivate.

用于查找 `CanDeactivate()` 处理程序的 DI 标记数组，以确定是否允许当前用户停用组件。默认情况下，任何用户都可以停用。

Use `canMatch` instead

改为使用 `canMatch`

An array of `CanLoadFn` or DI tokens used to look up `CanLoad()`
handlers, in order to determine if the current user is allowed to
load the component. By default, any user can load.

用于查找 `CanLoad()` 处理程序的 DI 标记数组，以确定是否允许当前用户加载组件。默认情况下，任何用户都可以加载。

Additional developer-defined data provided to the component via
`ActivatedRoute`. By default, no additional data is passed.

`ActivatedRoute` 提供给组件的由开发人员定义的额外数据。默认情况下，不传递任何额外数据。

A map of DI tokens used to look up data resolvers. See `Resolve`.

DI 令牌的映射，用于查找数据解析器。请参阅 `Resolve`。

An array of child `Route` objects that specifies a nested route
configuration.

一个子 `Route` 对象数组，用于指定嵌套路由配置。

An object specifying lazy-loaded child routes.

一个对象，指定要惰性加载的子路由。

Guards and/or resolvers will always run when a route is activated or deactivated. When a route
is unchanged, the default behavior is the same as `paramsChange`.

激活或停用路由时，守卫和/或解析器将始终运行。当路由未更改时，默认行为与 `paramsChange` 相同。

A `Provider` array to use for this `Route` and its `children`.

用于此 `Route` 及其 `children` 项的 `Provider` 数组。

The `Router` will create a new `EnvironmentInjector` for this
`Route` and use it for this `Route` and its `children`. If this
route also has a `loadChildren` function which returns an `NgModuleRef`, this injector will be
used as the parent of the lazy loaded module.

`Router` 将为此 `Route` 创建一个新的 `EnvironmentInjector`，并将其用于此 `Route` 及其 `children`。如果此路由还有一个返回 `NgModuleRef` 的 `loadChildren` 函数，则此注入器将被用作惰性加载模块的父级。

Injector created from the static route providers

从静态路由提供者创建的注入器

Filled for routes with `loadChildren` once the routes are loaded.

加载路由后，用 `loadChildren` 填充路由。

Filled for routes with `loadChildren` once the routes are loaded

加载路由后，使用 `loadChildren` 填充路由

Interface that a class can implement to be a guard deciding if a route can be activated.
If all guards return `true`, navigation continues. If any guard returns `false`,
navigation is cancelled. If any guard returns a `UrlTree`, the current navigation
is cancelled and a new navigation begins to the `UrlTree` returned from the guard.

类可以实现的接口，作为决定是否可以激活路由的守卫。如果所有警卫都返回 `true`，则导航继续。如果任何警卫返回 `false`，则导航被取消。如果任何警卫返回 `UrlTree`，则当前导航被取消，并开始对从警卫返回的 `UrlTree` 进行新的导航。

The following example implements a `CanActivate` function that checks whether the
current user has permission to activate the requested route.

一个接口，某些类可以实现它以扮演一个守卫，来决定该路由能否激活。如果所有守卫都返回 `true`，就会继续导航。如果任何一个守卫返回了 `false`，就会取消导航。如果任何一个守卫返回了 `UrlTree`，就会取消当前导航，并开始导航到这个守卫所返回的 `UrlTree`。

Here, the defined guard function is provided as part of the `Route` object
in the router configuration:

在此，定义的守卫函数作为路由器配置中的 `Route` 对象：

Class-based `Route` guards are deprecated in favor of functional guards. An
    injectable class can be used as a functional guard using the `inject` function:
    `canActivate: [() => inject(myGuard).canActivate()]`.

基于类的 `Route` 守卫已被弃用，取而代之的是功能性守卫。可注入类可以使用 `inject` 函数用作功能保护：`canActivate: [() => inject(myGuard).canActivate()]`。

The signature of a function used as a `canActivate` guard on a `Route`.

用作 `Route` 上的 `canActivate` 保护的函数的签名。

If all guards return `true`, navigation continues. If any guard returns `false`,
navigation is cancelled. If any guard returns a `UrlTree`, the current navigation
is cancelled and a new navigation begins to the `UrlTree` returned from the guard.

如果所有守卫都返回 `true`，则导航继续。如果任何守卫返回 `false`，导航将被取消。如果任何守卫返回 `UrlTree`，则当前导航被取消，新导航开始到从守卫返回的 `UrlTree`。

The following example implements and uses a `CanActivateChildFn` that checks whether the
current user has permission to activate the requested route.

以下示例实现并使用 `CanActivateChildFn` 检查当前用户是否有权激活请求的路由。

{&commat;example router/route_functional_guards.ts region="CanActivateFn"}



{&commat;example router/route_functional_guards.ts region="CanActivateFnInRoute"}



Interface that a class can implement to be a guard deciding if a child route can be activated.
If all guards return `true`, navigation continues. If any guard returns `false`,
navigation is cancelled. If any guard returns a `UrlTree`, current navigation
is cancelled and a new navigation begins to the `UrlTree` returned from the guard.

类可以实现的接口，作为决定是否可以激活子路由的守卫。如果所有警卫都返回 `true`，则导航继续。如果任何警卫返回 `false`，则导航被取消。如果任何警卫返回 `UrlTree`，则当前导航被取消，并开始对从警卫返回的 `UrlTree` 进行新的导航。

The following example implements a `CanActivateChild` function that checks whether the
current user has permission to activate the requested child route.

一个接口，某些类可以实现它以扮演一个守卫，来决定该路由的子路由能否激活。如果所有守卫都返回 `true`，就会继续导航。如果任何一个守卫返回了 `false`，就会取消导航。如果任何一个守卫返回了 `UrlTree`，就会取消当前导航，并开始导航到这个守卫所返回的 `UrlTree`。

Class-based `Route` guards are deprecated in favor of functional guards. An
    injectable class can be used as a functional guard using the `inject` function:
    `canActivateChild: [() => inject(myGuard).canActivateChild()]`.

基于类的 `Route` 守卫已被弃用，取而代之的是功能性守卫。可注入类可以使用 `inject` 函数用作功能保护：`canActivateChild: [() => inject(myGuard).canActivateChild()]`。

The signature of a function used as a `canActivateChild` guard on a `Route`.

用作 `Route` 上的 `canActivateChild` 保护的函数的签名。

The following example implements a `canActivate` function that checks whether the
current user has permission to activate the requested route.

一个接口，某些类可以实现它以扮演一个守卫，来决定该路由能否激活。如果所有守卫都返回 `true`，就会继续导航。如果任何一个守卫返回了 `false`，就会取消导航。如果任何一个守卫返回了 `UrlTree`，就会取消当前导航，并开始导航到这个守卫所返回的 `UrlTree`。

{&commat;example router/route_functional_guards.ts region="CanActivateChildFn"}



Interface that a class can implement to be a guard deciding if a route can be deactivated.
If all guards return `true`, navigation continues. If any guard returns `false`,
navigation is cancelled. If any guard returns a `UrlTree`, current navigation
is cancelled and a new navigation begins to the `UrlTree` returned from the guard.

类可以实现的接口，作为决定是否可以停用路由的警卫。如果所有警卫都返回 `true`，则导航继续。如果任何警卫返回 `false`，则导航被取消。如果任何警卫返回 `UrlTree`，则当前导航被取消，并开始对从警卫返回的 `UrlTree` 进行新的导航。

The following example implements a `CanDeactivate` function that checks whether the
current user has permission to deactivate the requested route.

一个接口，某些类可以实现它以扮演一个守卫，来决定该路由能否停用。如果所有守卫都返回 `true`，就会继续导航。如果任何一个守卫返回了 `false`，就会取消导航。如果任何一个守卫返回了 `UrlTree`，就会取消当前导航，并开始导航到这个守卫所返回的 `UrlTree`。

Class-based `Route` guards are deprecated in favor of functional guards. An
    injectable class can be used as a functional guard using the `inject` function:
    `canDeactivate: [() => inject(myGuard).canDeactivate()]`.

基于类的 `Route` 守卫已被弃用，取而代之的是功能性守卫。可注入类可以使用 `inject` 函数用作功能保护：`canDeactivate: [() => inject(myGuard).canDeactivate()]`。

The signature of a function used as a `canDeactivate` guard on a `Route`.

用作 `Route` 上的 `canDeactivate` 保护的函数的签名。

The following example implements and uses a `CanDeactivateFn` that checks whether the
user component has unsaved changes before navigating away from the route.

以下示例实现并使用 `CanDeactivateFn`，它在离开路由之前检查用户组件是否有未保存的更改。

{&commat;example router/route_functional_guards.ts region="CanDeactivateFn"}



Interface that a class can implement to be a guard deciding if a `Route` can be matched.
If all guards return `true`, navigation continues and the `Router` will use the `Route` during
activation. If any guard returns `false`, the `Route` is skipped for matching and other `Route`
configurations are processed instead.

类可以实现的接口作为决定是否可以匹配 `Route` 的守卫。如果所有警卫都返回 `true`，则导航继续，并且 `Router` 将在激活期间使用 `Route`。如果任何警卫返回 `false`，则会跳过 `Route` 进行匹配，并改为处理其他 `Route` 配置。

The following example implements a `CanMatch` function that decides whether the
current user has permission to access the users page.

以下示例实现了一个 `CanMatch` 函数，该函数决定当前用户是否有权访问 users 页面。

If the `CanMatchTeamSection` were to return `false`, the router would continue navigating to the
`team/:id` URL, but would load the `NotFoundComponent` because the `Route` for `'team/:id'`
could not be used for a URL match but the catch-all `**` `Route` did instead.

如果 `CanMatchTeamSection` 返回 `false`，路由器将继续导航到 `team/:id` URL，但会加载 `NotFoundComponent`，因为 `'team/:id'` 的 `Route` 不能用于 URL 匹配，但包罗万象 `**` `Route` 代替了。

Class-based `Route` guards are deprecated in favor of functional guards. An
    injectable class can be used as a functional guard using the `inject` function:
    `canMatch: [() => inject(myGuard).canMatch()]`.

基于类的 `Route` 守卫已被弃用，取而代之的是功能性守卫。可注入类可以使用 `inject` 函数用作功能保护：`canMatch: [() => inject(myGuard).canMatch()]`。

The signature of a function used as a `canMatch` guard on a `Route`.

在 `Route` 上用作 `CanMatch` 保护的函数的签名。

If all guards return `true`, navigation continues and the `Router` will use the `Route` during
activation. If any guard returns `false`, the `Route` is skipped for matching and other `Route`
configurations are processed instead.

如果所有守卫都返回 `true`，导航将继续，`Router` 将在激活期间使用该 `Route`。如果任何 guard 返回 `false`，则跳过 `Route` 进行匹配，而是处理其他 `Route` 配置。

The following example implements and uses a `CanMatchFn` that checks whether the
current user has permission to access the team page.

以下示例实现并使用 `CanMatchFn` 检查当前用户是否有权访问团队页面。

{&commat;example router/route_functional_guards.ts region="CanMatchFn"}



Interface that classes can implement to be a data provider.
A data provider class can be used with the router to resolve data during navigation.
The interface defines a `resolve()` method that is invoked right after the `ResolveStart`
router event. The router waits for the data to be resolved before the route is finally activated.

类可以实现为数据提供者的接口。数据提供者类可以与路由器一起使用，以在导航期间解析数据。该接口定义了一个 `resolve()` 方法，该方法会在 `ResolveStart` 路由器事件之后立即调用。路由器会在最终激活路由之前等待数据被解析。

The following example implements a `resolve()` method that retrieves the data
needed to activate the requested route.

一个接口，某些类可以实现它以扮演一个数据提供者。

Here, the defined `resolve()` function is provided as part of the `Route` object
in the router configuration:

在这里，定义的 `resolve()` 函数作为路由器配置中 `Route` 对象的一部分提供：

And you can access to your resolved data from `HeroComponent`:

你可以从 `HeroComponent` 访问你解析的数据：

When both guard and resolvers are specified, the resolvers are not executed until
all guards have run and succeeded.
For example, consider the following route configuration:

如果同时指定了守卫和解析器，则直到所有守卫都运行并成功后，解析器才会执行。比如，考虑以下路由配置：

The order of execution is: BaseGuard, ChildGuard, BaseDataResolver, ChildDataResolver.

执行顺序为：BaseGuard、ChildGuard、BaseDataResolver、ChildDataResolver。

Class-based `Route` resolvers are deprecated in favor of functional resolvers. An
injectable class can be used as a functional guard using the `inject` function: `resolve:
{'user': () => inject(UserResolver).resolve()}`.

基于类的 `Route` 解析器已弃用，取而代之的是函数式解析器。可注入类可以用作使用 `inject` 函数的功能保护：`resolve: {'user': () => inject(UserResolver).resolve()}`。

The order of execution is: baseGuard, childGuard, baseDataResolver, childDataResolver.

执行顺序为：BaseGuard、ChildGuard、BaseDataResolver、ChildDataResolver。

Function type definition for a data provider.

数据提供者的函数类型定义。

A data provider can be used with the router to resolve data during navigation.
The router waits for the data to be resolved before the route is finally activated.

数据提供者可以与路由器一起使用以在导航期间解析数据。路由器在最终激活路由之前等待数据被解析。

The following example implements a function that retrieves the data
needed to activate the requested route.

以下示例实现了一个函数，该函数检索激活请求路由所需的数据。

{&commat;example router/route_functional_guards.ts region="ResolveFn"}



{&commat;example router/route_functional_guards.ts region="ResolveDataUse"}



Interface that a class can implement to be a guard deciding if children can be loaded.
If all guards return `true`, navigation continues. If any guard returns `false`,
navigation is cancelled. If any guard returns a `UrlTree`, current navigation
is cancelled and a new navigation starts to the `UrlTree` returned from the guard.

类可以实现的接口，用于确定是否可以加载子路由。如果所有守卫都返回了 `true`，那么导航将继续。如果任何守卫返回 `false`，则导航将被取消。如果任何守卫返回 `UrlTree`，当前导航被取消，新的导航开始到守卫所返回的 `UrlTree`。

The following example implements a `CanLoad` function that decides whether the
current user has permission to load requested child routes.

一个接口，某些类可以实现它以扮演一个守卫，来决定该路由的子路由能否加载。

Use {&commat;link CanMatchFn} instead

使用 {&commat;link CanMatchFn} 代替

Use `Route.canMatch` and `CanMatchFn` instead

改为使用 `Route.canMatch` 和 `CanMatchFn`

The signature of a function used as a `canLoad` guard on a `Route`.

用作 `Route` 上的 `canLoad` 保护的函数的签名。

Options that modify the `Router` navigation strategy.
Supply an object containing any of these properties to a `Router` navigation function to
control how the navigation should be handled.

修改 `Router` 导航策略的选项。将包含这些属性中的任何一个的对象提供给 `Router` 导航函数，以控制应如何处理导航。

[Router.navigate\(\) method](api/router/Router#navigate)

[Router.navigate\(\) 方法](api/router/Router#navigate)

[Router.navigateByUrl\(\) method](api/router/Router#navigatebyurl)

[Router.navigateByUrl\(\) 方法](api/router/Router#navigatebyurl)

[Routing and Navigation guide](guide/router)

[路由和导航指南](guide/router)

How to handle a navigation request to the current URL.

如何处理对当前 URL 的导航请求。

This value is a subset of the options available in `OnSameUrlNavigation` and
will take precedence over the default value set for the `Router`.

该值是 `OnSameUrlNavigation` 中可用选项的子集，并且将优先于为 `Router` 设置的默认值。

When true, navigates without pushing a new state into history.

导航时不要把新状态记入历史。

When true, navigates while replacing the current state in history.

导航时不要把当前状态记入历史。

Developer-defined state that can be passed to any navigation.
Access this value through the `Navigation.extras` object
returned from the [Router.getCurrentNavigation\(\)
method](api/router/Router#getcurrentnavigation) while a navigation is executing.

由开发人员定义的状态，可以传递给任何导航。当执行导航时会通过由 [Router.getCurrentNavigation\(\) 方法](api/router/Router#getcurrentnavigation)返回的 `Navigation.extras` 对象来访问此值。

After a navigation completes, the router writes an object containing this
value together with a `navigationId` to `history.state`.
The value is written when `location.go()` or `location.replaceState()`
is called before activating this route.

需要注意的是 `history.state` 不应该用于对象相等测试，因为每次导航时路由器都会添加 `navigationId`。

Note that `history.state` does not pass an object equality test because
the router adds the `navigationId` on each navigation.

请注意，`history.state` 不会通过对象相等测试，因为路由器会在每个 `navigationId` 上添加 NavigationId。
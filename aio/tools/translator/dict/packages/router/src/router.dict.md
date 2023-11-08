The equivalent `IsActiveMatchOptions` options for `Router.isActive` is called with `true`
\(exact = true\).

`Router.isActive` 的等效 `IsActiveMatchOptions` 选项使用 `true` \(exact = true\) 调用。

The equivalent `IsActiveMatchOptions` options for `Router.isActive` is called with `false`
\(exact = false\).

`Router.isActive` 的等效 `IsActiveMatchOptions` 选项使用 `false` \(exact = false\) 调用。

A service that provides navigation among views and URL manipulation capabilities.

一个提供导航和操纵 URL 能力的 NgModule。

`Route`.



[Routing and Navigation Guide](guide/router).

[路由和导航指南](guide/router)。

Represents the activated `UrlTree` that the `Router` is configured to handle \(through
`UrlHandlingStrategy`\). That is, after we find the route config tree that we're going to
activate, run guards, and are just about to activate the route, we set the currentUrlTree.

表示 `Router` 配置为处理（通过 `UrlHandlingStrategy` ）的已激活 `UrlTree`。也就是说，在我们找到要激活的路由配置树后，运行守卫，并且即将激活路由，我们设置 currentUrlTree。

This should match the `browserUrlTree` when a navigation succeeds. If the
`UrlHandlingStrategy.shouldProcessUrl` is `false`, only the `browserUrlTree` is updated.

当导航成功时，这应该与 `browserUrlTree` 匹配。如果 `UrlHandlingStrategy.shouldProcessUrl` 为 `false`，则仅更新 `browserUrlTree`。

Meant to represent the entire browser url after a successful navigation. In the life of a
navigation transition:

意味着在成功导航后代表整个浏览器 url。在导航过渡的生活中：

The rawUrl represents the full URL that's being navigated to

rawUrl 表示要导航到的完整 URL

We apply redirects, which might only apply to _part_ of the URL \(due to
`UrlHandlingStrategy`\).

我们应用重定向，这可能只适用于\_ 部分\_URL（由于 `UrlHandlingStrategy` ）。

Right before activation \(because we assume activation will succeed\), we update the
rawUrlTree to be a combination of the urlAfterRedirects \(again, this might only apply to part
of the initial url\) and the rawUrl of the transition \(which was the original navigation url in
its full form\).

在激活之前（因为我们假设激活会成功），我们将 rawUrlTree 更新为 urlAfterRedirects（同样，这可能只适用于部分初始 url）和转换的 rawUrl（这是原始导航 url）的组合完整形式）。

Meant to represent the part of the browser url that the `Router` is set up to handle \(via the
`UrlHandlingStrategy`\). This value is updated immediately after the browser url is updated \(or
the browser url update is skipped via `skipLocationChange`\). With that, note that
`browserUrlTree` _may not_ reflect the actual browser URL for two reasons:

意味着表示 `Router` 设置为处理的浏览器 url 部分（通过 `UrlHandlingStrategy` ）。该值在浏览器 url 更新后立即更新（或通过 `skipLocationChange` 跳过浏览器 url 更新）。因此，请注意 `browserUrlTree`_ 可能不会 _ 反映实际的浏览器 URL，原因有两个：

`UrlHandlingStrategy` only handles part of the URL

`UrlHandlingStrategy` 只处理部分 URL

`skipLocationChange` does not update the browser url.

`skipLocationChange` 不会更新浏览器 url。

So to reiterate, `browserUrlTree` only represents the Router's internal understanding of the
current route, either before guards with `urlUpdateStrategy === 'eager'` or right before
activation with `'deferred'`.

因此，重申一下，`browserUrlTree` 仅代表路由器对当前路由的内部理解，要么在 `urlUpdateStrategy === 'eager'` 守卫之前，要么在使用 `'deferred'` 激活之前。

This should match the `currentUrlTree` when the navigation succeeds.

当导航成功时，这应该与 `currentUrlTree` 匹配。

An event stream for routing events.

用于路由事件的事件流。

The current state of routing in this NgModule.

此 NgModule 中路由的当前状态。

Subscribe to the `Router` events and watch for `NavigationError` instead.
  `provideRouter` has the `withNavigationErrorHandler` feature to make this easier.

订阅 `Router` 事件并观察 `NavigationError`。`provideRouter` 具有 `withNavigationErrorHandler` 功能，使这更容易。

A handler for navigation errors in this NgModule.

本模块中的导航错误处理器。

URI parsing errors should be handled in the `UrlSerializer`.

URI 解析错误应该在 `UrlSerializer` 中处理。

A handler for errors thrown by `Router.parseUrl(url)`
when `url` contains an invalid character.
The most common case is a `%` sign
that's not encoded and is not part of a percent encoded sequence.

uri 格式无效错误的处理器，在 `Router.parseUrl(url)` 由于 `url` 包含无效字符而报错时调用。最常见的情况可能是 `%` 本身既没有被编码，又不是正常 `%` 编码序列的一部分。

True if at least one navigation event has occurred,
false otherwise.

如果为 True 则表示是否发生过至少一次导航，反之为 False。

Configure using `providers` instead:
  `{provide: UrlHandlingStrategy, useClass: MyStrategy}`.

改为使用 `providers` 进行配置：`{provide: UrlHandlingStrategy, useClass: MyStrategy}`。

A strategy for extracting and merging URLs.
Used for AngularJS to Angular migrations.

提取并合并 URL。在 AngularJS 向 Angular 迁移时会用到。

Configure using `providers` instead:
  `{provide: RouteReuseStrategy, useClass: MyStrategy}`.

改为使用 `providers` 进行配置：`{provide: RouteReuseStrategy, useClass: MyStrategy}`。

A strategy for re-using routes.

复用路由的策略。

Configure using `providers` instead:
  `{provide: TitleStrategy, useClass: MyStrategy}`.

改为使用 `providers` 进行配置：`{provide: TitleStrategy, useClass: MyStrategy}`。

A strategy for setting the title based on the `routerState`.

根据 `routerState` 设置标题的策略。

Configure this through `provideRouter` or `RouterModule.forRoot` instead.

通过 `provideRouter` 或 `RouterModule.forRoot` 配置它。

How to handle a navigation request to the current URL.

如何处理对当前 URL 的导航请求。

How to merge parameters, data, resolved data, and title from parent to child
routes. One of:

如何从父路由向子路由合并参数、数据和解析到的数据。可取下列值之一：

`'emptyOnly'` : Inherit parent parameters, data, and resolved data
for path-less or component-less routes.

`'emptyOnly'`：让无路径或无组件的路由继承父级的参数、数据和解析到的数据。

`'always'` : Inherit parent parameters, data, and resolved data
for all child routes.

`'always'`：让所有子路由都继承父级的参数、数据和解析到的数据。

Determines when the router updates the browser URL.
By default \(`"deferred"`\), updates the browser URL after navigation has finished.
Set to `'eager'` to update the browser URL at the beginning of navigation.
You can choose to update early so that, if navigation fails,
you can show an error message with the URL that failed.

确定路由器何时更新浏览器 URL。默认情况下（`"deferred"`）在导航完成后更新浏览器 URL。设置为 `'eager'` 可以在浏览开始时更新浏览器 URL。你可以选择早期更新，这样，如果导航失败，则可以显示带有失败 URL 的错误消息。

Configures how the Router attempts to restore state when a navigation is cancelled.

配置在取消导航时路由器如何尝试恢复状态。

'replace' - Always uses `location.replaceState` to set the browser state to the state of the
router before the navigation started. This means that if the URL of the browser is updated
_before_ the navigation is canceled, the Router will simply replace the item in history rather
than trying to restore to the previous location in the session history. This happens most
frequently with `urlUpdateStrategy: 'eager'` and navigations with the browser back/forward
buttons.

'replace' - 始终使用 `location.replaceState` 将浏览器状态设置为导航开始前的路由器状态。这意味着如果浏览器的 URL 在取消导航 _ 之前 _ 更新，则路由器将简单地替换历史记录中的项目，而不是尝试恢复到会话历史记录中的先前位置。这种情况最常发生在 `urlUpdateStrategy: 'eager'` 和使用浏览器后退/前进按钮的导航中。

'computed' - Will attempt to return to the same index in the session history that corresponds
to the Angular route when the navigation gets cancelled. For example, if the browser back
button is clicked and the navigation is cancelled, the Router will trigger a forward navigation
and vice versa.

“comped” - 当导航被取消时，将尝试返回会话历史记录中与 Angular 路由对应的同一个索引。例如，如果单击浏览器后退按钮并取消导航，则路由器将触发向前导航，反之亦然。

Note: the 'computed' option is incompatible with any `UrlHandlingStrategy` which only
handles a portion of the URL because the history restoration navigates to the previous place in
the browser history rather than simply resetting a portion of the URL.

注意：' `UrlHandlingStrategy` ' 选项与任何仅处理一部分 URL 的 UrlHandlingStrategy 不兼容，因为历史恢复会导航到浏览器历史记录中的上一个位置，而不是简单地重置 URL 的一部分。

The default value is `replace`.

默认值是 `replace`。

Indicates whether the the application has opted in to binding Router data to component inputs.

指示应用程序是否已选择将路由器数据绑定到组件输入。

This option is enabled by the `withComponentInputBinding` feature of `provideRouter` or
`bindToComponentInputs` in the `ExtraOptions` of `RouterModule.forRoot`.

此选项由 `provideRouter` 的 `withComponentInputBinding` 功能或 `RouterModule.forRoot` 的 `ExtraOptions` 中的 `bindToComponentInputs` 启用。

Sets up the location change listener and performs the initial navigation.

设置位置变化监听器，并执行首次导航。

Sets up the location change listener. This listener detects navigations triggered from outside
the Router \(the browser back/forward buttons, for example\) and schedules a corresponding Router
navigation so that the correct events, guards, etc. are triggered.

设置 location 更改监听器。该监听器检测从路由器外部触发的导航（比如，浏览器的后退/前进按钮），并安排相应的路由器导航，以便触发正确的事件、守卫等。

The current URL.

当前 URL。

Returns the current `Navigation` object when the router is navigating,
and `null` when idle.

路由器正在导航时返回当前的 `Navigation` 对象，空闲时返回 `null`。

The `Navigation` object of the most recent navigation to succeed and `null` if there
    has not been a successful navigation yet.

最近一次成功导航的 `Navigation` 对象，如果还没有成功导航则为 `null`。

The route array for the new configuration.

新配置中的路由定义数组。

Resets the route configuration used for navigation and generating links.

重置供导航和生成链接使用的配置项。

Disposes of the router.

销毁路由器。

An array of URL fragments with which to construct the new URL tree.
If the path is static, can be the literal URL string. For a dynamic path, pass an array of path
segments, followed by the parameters for each segment.
The fragments are applied to the current URL tree or the one provided  in the `relativeTo`
property of the options object, if supplied.

一个 URL 段的数组，用于构造新的 URL 树。如果此路径是静态的，则可能是 URL 字符串字面量。对于动态路径，可以传入一个路径段的数组，后跟每个段的参数。这些段会应用到当前 URL 树上，或者在选项对象中的 `relativeTo` 属性上（如果有）。

Options that control the navigation strategy.

控制导航策略的选项。

The new URL tree.

新的 URL 树。

Appends URL segments to the current URL tree to create a new URL tree.

将 URL 段添加到当前 URL 树中以创建新的 URL 树。

An absolute path for a defined route. The function does not apply any delta to the
    current URL.

一个绝对 URL。该函数不会对当前 URL 做任何修改。

An object containing properties that modify the navigation strategy.

一个包含一组属性的对象，它会修改导航策略。

A Promise that resolves to 'true' when navigation succeeds,
to 'false' when navigation fails, or is rejected on error.

一个 Promise，当导航成功时解析为“true”，当导航失败时解析为“false”，或者因错误而被拒绝。

The following calls request navigation to an absolute path.

以下调用要求导航到绝对路径。

[Routing and Navigation guide](guide/router)

[路由和导航指南](guide/router)

Navigates to a view using an absolute route path.

基于所提供的 URL 进行导航，必须使用绝对路径。

An array of URL fragments with which to construct the target URL.
If the path is static, can be the literal URL string. For a dynamic path, pass an array of path
segments, followed by the parameters for each segment.
The fragments are applied to the current URL or the one provided  in the `relativeTo` property
of the options object, if supplied.

一个 URL 段的数组，用于构造目标 URL 树。如果此路径是静态的，则可能是 URL 字符串字面量。对于动态路径，可以传入一个路径段的数组，后跟每个段的参数。这些段会应用到当前 URL，或者在选项对象中的 `relativeTo` 属性上（如果有）。

An options object that determines how the URL should be constructed or
    interpreted.

一个选项对象，用于确定应如何构造或解释 URL。

A Promise that resolves to `true` when navigation succeeds, to `false` when navigation
    fails,
or is rejected on error.

一个 Promise，当导航成功时解析为 `true`，当导航失败时解析为 `false`，或因错误而被拒绝。

The following calls request navigation to a dynamic route path relative to the current URL.

以下调用请求导航到相对于当前 URL 的动态路由路径。

Navigate based on the provided array of commands and a starting point.
If no starting route is provided, the navigation is absolute.

基于所提供的命令数组和起点路由进行导航。如果没有指定起点路由，则从根路由开始进行绝对导航。

Serializes a `UrlTree` into a string

把 `UrlTree` 序列化为字符串

Parses a string into a `UrlTree`

把字符串解析为 `UrlTree`

Use `IsActiveMatchOptions` instead.

请改用 `IsActiveMatchOptions`。

The equivalent `IsActiveMatchOptions` for `true` is
`{paths: 'exact', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored'}`.

`true` 的等效 `IsActiveMatchOptions` 是 `{paths: 'exact', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored'}`。

The equivalent for `false` is
`{paths: 'subset', queryParams: 'subset', fragment: 'ignored', matrixParams: 'ignored'}`.

`false` 的等价物是 `{paths: 'subset', queryParams: 'subset', fragment: 'ignored', matrixParams: 'ignored'}`。

Returns whether the url is activated.

返回 url 是否已激活。

Performs the necessary rollback action to restore the browser URL to the
state before the transition.

执行必要的回滚操作以将浏览器 URL 恢复到转换前的状态。
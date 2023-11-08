Subscribe to the `Router` events and watch for `NavigationError` instead.

订阅 `Router` 事件并观察 `NavigationError`。

Error handler that is invoked when a navigation error occurs.

发生导航错误时调用的错误处理程序。

If the handler returns a value, the navigation Promise is resolved with this value.
If the handler throws an exception, the navigation Promise is rejected with
the exception.

如果处理程序返回一个值，则使用该值解析导航 Promise。如果处理程序抛出异常，则导航 Promise 会因异常而被拒绝。

Allowed values in an `ExtraOptions` object that configure
when the router performs the initial navigation operation.

在路由器执行初始导航操作时配置的 `ExtraOptions` 对象中允许的值。

'enabledNonBlocking' - \(default\) The initial navigation starts after the
root component has been created. The bootstrap is not blocked on the completion of the initial
navigation.

'enabledNonBlocking' -（默认值）在创建根组件之后开始初始导航。初始导航完成后，引导程序不会被阻止。

'enabledBlocking' - The initial navigation starts before the root component is created.
The bootstrap is blocked until the initial navigation is complete. This value is required
for [server-side rendering](guide/universal) to work.

'enabledBlocking' - 初始导航在创建根组件之前开始。引导程序将被阻止，直到完成初始导航为止。该值是让[服务端渲染](guide/universal)正常工作所必需的。

'disabled' - The initial navigation is not performed. The location listener is set up before
the root component gets created. Use if there is a reason to have
more control over when the router starts its initial navigation due to some complex
initialization logic.

`false` - 同 'legacy_disabled'. &commat;deprecated since v4。

Extra configuration options that can be used with the `withRouterConfig` function.

可以与 `withRouterConfig` 函数一起使用的额外配置选项。

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

The default value is `replace` when not set.

默认值是未设置时的 `replace`。

Configures the default for handling a navigation request to the current URL.

配置处理对当前 URL 的导航请求的默认值。

If unset, the `Router` will use `'ignore'`.

如果未设置，`Router` 将使用 `'ignore'`。

Defines how the router merges parameters, data, and resolved data from parent to child
routes. By default \('emptyOnly'\), inherits parent parameters only for
path-less or component-less routes.

定义路由器如何将参数、数据和已解析的数据从父路由合并到子路由。默认情况下（“emptyOnly”），仅继承无路径或无组件路由的父参数。

Set to 'always' to enable unconditional inheritance of parent parameters.

设置为 “always” 时会始终启用父参数的无条件继承。

Note that when dealing with matrix parameters, "parent" refers to the parent `Route`
config which does not necessarily mean the "URL segment to the left". When the `Route` `path`
contains multiple segments, the matrix parameters must appear on the last segment. For example,
matrix parameters for `{path: 'a/b', component: MyComp}` should appear as `a/b;foo=bar` and not
`a;foo=bar/b`.

请注意，在处理矩阵参数时，“parent”是指父 `Route` 配置，并不一定意味着“左侧的 URL 段”。当 `Route` `path` 包含多个段时，矩阵参数必须出现在最后一个段上。例如，`{path: 'a/b', component: MyComp}` 矩阵参数应该显示为 `a/b;foo=bar` 而不是 `a;foo=bar/b`。

Defines when the router updates the browser URL. By default \('deferred'\),
update after successful navigation.
Set to 'eager' if prefer to update the URL at the beginning of navigation.
Updating the URL early allows you to handle a failure of navigation by
showing an error message with the URL that failed.

定义路由器要何时更新浏览器 URL。默认情况下（“deferred”），在成功导航后进行更新。如果希望在导航开始时更新 URL，则设置为 “eager”。以便早期更新 URL，这样可以通过显示带有失败 URL 的错误消息来处理导航失败。

Configuration options for the scrolling feature which can be used with `withInMemoryScrolling`
function.

可与 `withInMemoryScrolling` 函数一起使用的滚动特性的配置选项。

When set to 'enabled', scrolls to the anchor element when the URL has a fragment.
Anchor scrolling is disabled by default.

设置为 “enabled” 时，如果 URL 有一个片段，就滚动到锚点元素。默认情况下，锚定滚动是禁用的。

Anchor scrolling does not happen on 'popstate'. Instead, we restore the position
that we stored or scroll to the top.

锚点滚动不会在 “popstate” 上发生。相反，我们会恢复存储的位置或滚动到顶部。

Configures if the scroll position needs to be restored when navigating back.

配置是否需要在导航回来的时候恢复滚动位置。

'disabled'- \(Default\) Does nothing. Scroll position is maintained on navigation.

'disabled' - 什么也不做（默认）。在导航时，会自动维护滚动位置。

'top'- Sets the scroll position to x = 0, y = 0 on all navigation.

'top' - 在任何一次导航中都把滚动位置设置为 x=0, y=0。

'enabled'- Restores the previous scroll position on backward navigation, else sets the
position to the anchor if one is provided, or sets the scroll position to [0, 0] \\\(forward
navigation\). This option will be the default in the future.

'enabled'- 在向后导航时恢复先前的滚动位置，否则将位置设置为锚点（如果提供），或将滚动位置设置为[0、0][0, 0] \\（向前导航）。此选项将成为未来的默认选项。

You can implement custom scroll restoration behavior by adapting the enabled behavior as
in the following example.

你可以像下面的例子一样适配它启用时的行为，来自定义恢复滚动位置的策略：。

A set of configuration options for a router module, provided in the
`forRoot()` method.

路由器模块的一组配置选项，在 `forRoot()` 方法中提供。

When true, log all internal navigation events to the console.
Use for debugging.

如果为 true，则将所有内部导航事件记录到控制台。用于调试。

When true, enable the location strategy that uses the URL fragment
instead of the history API.

修改位置策略（`LocationStrategy`），用 URL 片段（`#`）代替 `history` API。

One of `enabled`, `enabledBlocking`, `enabledNonBlocking` or `disabled`.
When set to `enabled` or `enabledBlocking`, the initial navigation starts before the root
component is created. The bootstrap is blocked until the initial navigation is complete. This
value is required for [server-side rendering](guide/universal) to work. When set to
`enabledNonBlocking`, the initial navigation starts after the root component has been created.
The bootstrap is not blocked on the completion of the initial navigation. When set to
`disabled`, the initial navigation is not performed. The location listener is set up before the
root component gets created. Use if there is a reason to have more control over when the router
starts its initial navigation due to some complex initialization logic.

`enabled`、`enabledBlocking`、`enabledNonBlocking` 或 `disabled` 之一。设置为 `enabled` 或 `enabledBlocking`，则初始导航在创建根组件之前开始。引导程序将被阻止，直到完成初始导航为止。该值是让[服务端渲染](guide/universal)正常工作所必需的。设置为 `enabledNonBlocking`，则初始导航在创建根组件之后开始。初始导航完成后，引导程序不会被阻止。设置为 `disabled`，不执行初始导航。位置监听器是在创建根组件之前设置的。如果由于某些复杂的初始化逻辑，而有理由对路由器何时开始其初始导航有更多的控制权，请使用它。

When true, enables binding information from the `Router` state directly to the inputs of the
component in `Route` configurations.

如果为真，则启用从 `Router` 状态直接绑定到 `Route` 配置中组件输入的信息。

A custom error handler for failed navigations.
If the handler returns a value, the navigation Promise is resolved with this value.
If the handler throws an exception, the navigation Promise is rejected with the exception.

导航失败的自定义错误处理器。如果处理器返回一个值，则导航的 Promise 将使用该值进行解析。如果处理器引发异常，则导航 Promise 将被拒绝，并带有该异常。

Configures a preloading strategy.
One of `PreloadAllModules` or `NoPreloading` \(the default\).

配置预加载策略，参见 `PreloadAllModules`。

Configures the scroll offset the router will use when scrolling to an element.

配置当滚动到一个元素时，路由器使用的滚动偏移。

When given a tuple with x and y position value,
the router uses that offset each time it scrolls.
When given a function, the router invokes the function every time
it restores scroll position.

当给出两个数字时，路由器总会使用它们。当给出一个函数时，路由器每当要恢复滚动位置时，都会调用该函数。

URI parsing errors should be handled in the `UrlSerializer` instead.

URI 解析错误应该在 `UrlSerializer` 中处理。

A custom handler for malformed URI errors. The handler is invoked when `encodedURI` contains
invalid character sequences.
The default implementation is to redirect to the root URL, dropping
any path or parameter information. The function takes three parameters:

一个自定义的 URI 格式无效错误的处理器。每当 encodeURI 包含无效字符序列时，就会调用该处理器。默认的实现是跳转到根路径，抛弃任何路径和参数信息。该函数传入三个参数：

`'URIError'` - Error thrown when parsing a bad URL.

`'URIError'` - 当传入错误的 URL 时抛出的错误。

`'UrlSerializer'` - UrlSerializer that’s configured with the router.

`'UrlSerializer'` - 路由器所配置的 UrlSerializer。

`'url'` -  The malformed URL that caused the URIError

`'url'` - 导致 URIError 的格式无效的 URL

A [DI token](guide/glossary/#di-token) for the router service.

路由器服务的[DI 令牌](guide/glossary/#di-token)。
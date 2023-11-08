When applied to an element in a template, makes that element a link
that initiates navigation to a route. Navigation opens one or more routed components
in one or more `<router-outlet>` locations on the page.

当应用于模板中的元素时，使该元素成为开始导航到某个路由的链接。导航会在页面上的 `<router-outlet>`
位置上打开一个或多个路由组件。

Given a route configuration `[{ path: 'user/:name', component: UserCmp }]`,
the following creates a static link to the route:
`<a routerLink="/user/bob">link to user component</a>`

给定路由配置 `[{ path: 'user/:name', component: UserCmp }]`
，以下内容将创建一个到该路由的静态链接：`<a routerLink="/user/bob">link to user component</a>`

You can use dynamic values to generate the link.
For a dynamic link, pass an array of path segments,
followed by the params for each segment.
For example, `['/team', teamId, 'user', userName, {details: true}]`
generates a link to `/team/11/user/bob;details=true`.

你也可以使用动态值来生成链接。对于动态链接，请传递路径段数组，然后传递每个段的参数。比如，
`['/team', teamId, 'user', userName, {details: true}]` 生成到 `/team/11/user/bob;details=true`。

Multiple static segments can be merged into one term and combined with dynamic segments.
For example, `['/team/11/user', userName, {details: true}]`

多个静态段可以合并为一个词，并与动态段组合。比如，`['/team/11/user', userName, {details: true}]`

The input that you provide to the link is treated as a delta to the current URL.
For instance, suppose the current URL is `/user/(box//aux:team)`.
The link `<a [routerLink]="['/user/jim']">Jim</a>` creates the URL
`/user/(jim//aux:team)`.
See {&commat;link Router#createUrlTree createUrlTree} for more information.

你提供给链接的输入将被视为当前 URL 的增量。比如，假设当前 URL 是 `/user/(box//aux:team)`。则链接
`<a [routerLink]="['/user/jim']">Jim</a>` 会创建 URL `/user/(jim//aux:team)`
。欲知详情，请参见 {&commat;link Router#createUrlTree createUrlTree}。

You can use absolute or relative paths in a link, set query parameters,
control how parameters are handled, and keep a history of navigation states.

你可以在链接中使用绝对或相对路径、设置查询参数、控制如何处理参数以及保留导航状态的历史记录。

Relative link paths

相对链接路径

The first segment name can be prepended with `/`, `./`, or `../`.

第一段名称可以用 `/`、`./` 或 `../` 开头。

If the first segment begins with `/`, the router looks up the route from the root of the
app.

如果第一个片段用 `/` 开头，则路由器会从应用的根路由开始查找。

If the first segment begins with `./`, or doesn't begin with a slash, the router
looks in the children of the current activated route.

如果第一个片段用 `./` 开头或者没有用斜杠开头，路由器就会从当前激活路由开始查找。

If the first segment begins with `../`, the router goes up one level in the route tree.

如果第一段以 `../` 开头，则路由器将去往路由树中的上一层。

Setting and handling query params and fragments

设置和处理查询参数和片段

The following link adds a query parameter and a fragment to the generated URL:

以下链接将查询参数和一个片段添加到所生成的 URL：

By default, the directive constructs the new URL using the given query parameters.
The example generates the link: `/user/bob?debug=true#education`.

默认情况下，该指令使用给定的查询参数构造新的
URL。该示例生成链接：`/user/bob?debug=true#education`。

You can instruct the directive to handle query parameters differently
by specifying the `queryParamsHandling` option in the link.
Allowed values are:

你可以通过在链接中使用 `queryParamsHandling`
选项，来指示该指令以不同的方式处理查询参数。允许的值为：

`'merge'`: Merge the given `queryParams` into the current query params.

`'merge'`：将给定的 `queryParams` 合并到当前查询参数中。

`'preserve'`: Preserve the current query params.

`'preserve'`：保留当前的查询参数。

For example:

比如：

See {&commat;link UrlCreationOptions.queryParamsHandling UrlCreationOptions#queryParamsHandling}.

请参阅 {&commat;link UrlCreationOptions.queryParamsHandling UrlCreationOptions#queryParamsHandling}。

Preserving navigation history

保留导航历史

You can provide a `state` value to be persisted to the browser's
[`History.state` property](https://developer.mozilla.org/en-US/docs/Web/API/History#Properties).
For example:

你可以提供要持久到浏览器的 [`History.state`
属性](https://developer.mozilla.org/en-US/docs/Web/API/History#Properties)中的 `state` 值。比如：

Use {&commat;link Router.getCurrentNavigation\(\) Router#getCurrentNavigation} to retrieve a saved
navigation-state value. For example, to capture the `tracingId` during the `NavigationStart`
event:

使用 {&commat;link Router.getCurrentNavigation\(\) Router#getCurrentNavigation}
来检索保存的导航状态值。比如，要在 `NavigationStart` 事件中捕获 `tracingId`

Represents an `href` attribute value applied to a host element,
when a host element is `<a>`. For other tags, the value is `null`.

当宿主元素为 `<a>` 时，表示应用于宿主元素的 `href` 属性值。对于其他标签，值为 `null`。

Represents the `target` attribute on a host element.
This is only used when the host element is an `<a>` tag.

表示宿主元素上的 `target` 属性。这仅在宿主元素是 `<a>` 标记时使用。

Passed to {&commat;link Router#createUrlTree Router#createUrlTree} as part of the
`UrlCreationOptions`.

作为 `UrlCreationOptions` 的一部分传递给 {&commat;link Router#createUrlTree Router#createUrlTree}。

Passed to {&commat;link Router#navigateByUrl Router#navigateByUrl} as part of the
`NavigationBehaviorOptions`.

作为 `NavigationBehaviorOptions` 的一部分传递给 {&commat;link Router#navigateByUrl
Router#navigateByUrl}。

Passed to {&commat;link Router#createUrlTree Router#createUrlTree} as part of the
`UrlCreationOptions`.
Specify a value here when you do not want to use the default value
for `routerLink`, which is the current activated route.
Note that a value of `undefined` here will use the `routerLink` default.

作为 UrlCreationOptions 的一部分传递给 {&commat;link Router#createUrlTree Router# `UrlCreationOptions`
}。当你不想使用 `routerLink` 的默认值（当前激活的路由）时，在此指定一个值。请注意，此处的
`undefined` 值将使用 `routerLink` 默认值。

Commands to pass to {&commat;link Router#createUrlTree Router#createUrlTree}.

传递给 {&commat;link Router#createUrlTree Router#createUrlTree} 的命令。

**array**: commands to pass to {&commat;link Router#createUrlTree Router#createUrlTree}.

**array**：传递给 {&commat;link Router#createUrlTree Router#createUrlTree} 的命令。

**string**: shorthand for array of commands with just the string, i.e. `['/route']`

**string**：仅包含字符串的命令数组的简写，即 `['/route']`

**null|undefined**: effectively disables the `routerLink`

**null | undefined**：空命令数组的简写，即 `[]`
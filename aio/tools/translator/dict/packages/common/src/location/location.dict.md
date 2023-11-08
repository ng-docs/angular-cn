A service that applications can use to interact with a browser's URL.

一个服务，应用可以用它来与浏览器的 URL 互动。

Depending on the `LocationStrategy` used, `Location` persists
to the URL's path or the URL's hash segment.

这取决于使用了哪个 `LocationStrategy`，`Location` 可能会使用 URL
的路径或 URL 的哈希片段（`#`）进行持久化。

It's better to use the `Router.navigate()` service to trigger route changes. Use
`Location` only if you need to interact with or create normalized URLs outside of
routing.

最好使用 {&commat;link Router#navigate} 服务来触发路由变更。只有当你要在路由体系之外创建规范化 URL
或与之交互时才会用到 `Location`。

`Location` is responsible for normalizing the URL against the application's base href.
A normalized URL is absolute from the URL host, includes the application's base href, and has no
trailing slash:

`Location` 负责基于应用的基地址（base href）对 URL 进行标准化。
所谓标准化的 URL 就是一个从宿主（host）开始算的绝对地址，包括应用的基地址，但不包括结尾的斜杠：

`/my/app/user/123` is normalized

`/my/app/user/123` 是标准化的

`my/app/user/123` **is not** normalized

`my/app/user/123` 不是标准化的

`/my/app/user/123/` **is not** normalized

`/my/app/user/123/` 不是标准化的

Example

例子

True to include an anchor fragment in the path.

路径中是否包含一个锚点片段（Anchor fragment）。

The normalized URL path.

标准化之后的 URL 路径。

Normalizes the URL path for this location.

返回标准化之后的 URL 路径

The current value of the `history.state` object.

`history.state` 对象的当前值。

Reports the current state of the location history.

报告位置历史记录的当前状态。

The given URL path.

指定的 URL 路径。

Query parameters.

查询参数

True if the given URL path is equal to the current normalized path, false
otherwise.

如果指定的 URL 路径和标准化之后的路径一样，则返回 `true`，否则返回 `false`。

Normalizes the given path and compares to the current normalized path.

对指定的路径进行标准化，并和当前的标准化路径进行比较。

String representing a URL.

表示一个 URL。

The normalized URL string.

标准化之后的 URL 字符串。

Normalizes a URL path by stripping any trailing slashes.

给出一个字符串形式的 URL，返回一个去掉末尾斜杠之后的 URL 路径。

A normalized platform-specific URL.

标准化之后的平台相关 URL。

Normalizes an external URL path.
If the given URL doesn't begin with a leading slash \(`'/'`\), adds one
before normalizing. Adds a hash if `HashLocationStrategy` is
in use, or the `APP_BASE_HREF` if the `PathLocationStrategy` is in use.

标准化外部 URL 路径。如果给定的 URL 并非以斜杠（`'/'`）开头，就会在规范化之前添加一个。如果使用 `HashLocationStrategy` 则添加哈希；如果使用
`PathLocationStrategy` 则添加 `APP_BASE_HREF`。

URL path to normalize.

要标准化的路径

Location history state.

历史状态

Changes the browser's URL to a normalized version of a given URL, and pushes a
new item onto the platform's history.

把浏览器的 URL 修改为指定 URL
的标准化版本，并往所属平台（如浏览器）的历史堆栈中追加一个新条目。

Changes the browser's URL to a normalized version of the given URL, and replaces
the top item on the platform's history stack.

把浏览器的 URL 修改为指定 URL 的标准化版本，并替换所属平台（如浏览器）的历史堆栈的顶部条目。

Navigates forward in the platform's history.

在所属平台（如浏览器）的历史堆栈中前进一步。

Navigates back in the platform's history.

在所属平台（如浏览器）的历史堆栈中后退一步。

Position of the target page in the history relative to the current
    page.
A negative value moves backwards, a positive value moves forwards, e.g. `location.historyGo(2)`
moves forward two pages and `location.historyGo(-2)` moves back two pages. When we try to go
beyond what's stored in the history session, we stay in the current page. Same behaviour occurs
when `relativePosition` equals 0.

目标页面在历史记录中相对于当前页面的位置。负值会向后移动，正值会向前移动，例如
`location.historyGo(2)` 会向前移动两页，`location.historyGo(-2)`
会向后移动两页。当我们尝试超越历史会话中存储的内容时，我们会停留在当前页面。当
`relativePosition` 等于 0 时会发生相同的行为。

https://developer.mozilla.org/en-US/docs/Web/API/History_API#Moving_to_a_specific_point_in_history



Navigate to a specific page from session history, identified by its relative position to the
current page.

从会话历史记录导航到特定页面，由其与当前页面的相对位置标识。

The change handler function, which take a URL and a location history state.

更改处理器函数，接受 URL 和位置历史记录的状态。

A function that, when executed, unregisters a URL change listener.

一个函数，执行时会注销 URL 更改侦听器。

Registers a URL change listener. Use to catch updates performed by the Angular
framework that are not detectible through "popstate" or "hashchange" events.

注册 URL 更改监听器。被 Angular 框架用于捕获那些无法通过 “popstate” 或 “hashchange”
事件检测到的更新。

Event that is triggered when the state history changes.

当状态历史发生变化时触发的事件

The exception to throw.

要抛出的异常。

[onpopstate](https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate)

[onpop 状态](https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate)

Subscribed events.

已订阅的事件。

Subscribes to the platform's `popState` events.

订阅所属平台（如浏览器）的 `popState` 事件。

Note: `Location.go()` does not trigger the `popState` event in the browser. Use
`Location.onUrlChange()` to subscribe to URL changes instead.

注意：`Location.go()` 不会触发浏览器中的 `popState` 事件。改用 `Location.onUrlChange()` 来订阅
URL 更改。

The normalized URL parameters string.

为 URL 参数加上 `?` 前缀，如果原来就有，则原样返回。

Normalizes URL parameters by prepending with `?` if needed.

给定 URL 参数字符串，如果需要则增加 '?' 前缀，否则原样返回。

URL string

URL 字符串

The joined URL string.

联结后的 URL 字符串。

Joins two parts of a URL with a slash if needed.

给定 url 的两个部分，把它们连接（join）在一起，如有必要则添加一个斜杠。

URL string.

URL 字符串。

The URL string, modified if needed.

返回一个 URL 字符串，如果有结尾斜杠，则移除，否则原样返回。

Removes a trailing slash from a URL string if needed.
Looks for the first occurrence of either `#`, `?`, or the end of the
line as `/` characters and removes the trailing slash if one exists.

如果 url 具有结尾斜杠，则移除它，否则原样返回。
该方法会查找第一个 `#`、`?` 之前的结尾 `/` 字符，之后的则不管。如果 url 中没有
`#`、`?`，则替换行尾的。
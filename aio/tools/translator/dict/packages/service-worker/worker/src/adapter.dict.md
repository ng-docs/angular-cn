Adapts the service worker to its runtime environment.

使 Service Worker 适应其运行时环境。

Mostly, this is used to mock out identifiers which are otherwise read
from the global scope.

大多数情况下，这用于模拟从全局范围读取的标识符。

Wrapper around the `Request` constructor.

`Request` 构造函数的包装器。

Wrapper around the `Response` constructor.

`Response` 构造函数的包装器。

Wrapper around the `Headers` constructor.

围绕 `Headers` 构造函数的包装器。

Test if a given object is an instance of `Client`.

测试给定的对象是否是 `Client` 的实例。

Read the current UNIX time in milliseconds.

读取当前的 UNIX 时间（以毫秒为单位）。

The raw request URL.

原始请求 URL。

A normalized representation of the URL.

URL 的规范化表示。

Get a normalized representation of a URL such as those found in the ServiceWorker's `ngsw.json`
configuration.

获取 URL 的规范化表示，例如 ServiceWorker 的 `ngsw.json` 配置中的那些。

More specifically:

更具体地说：

Resolve the URL relative to the ServiceWorker's scope.

解析相对于 ServiceWorker 范围的 URL。

If the URL is relative to the ServiceWorker's own origin, then only return the path part.
Otherwise, return the full URL.

如果 URL 是相对于 ServiceWorker 自己的来源的，则仅返回路径部分。否则，返回完整的 URL。

Parse a URL into its different parts, such as `origin`, `path` and `search`.

将 URL 解析为其不同的部分，例如 `origin`、`path` 和 `search`。

Wait for a given amount of time before completing a Promise.

在完成 Promise 之前等待给定的时间。
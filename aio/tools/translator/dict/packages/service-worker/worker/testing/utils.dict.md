Whether ServiceWorker tests can be run in the current environment.

ServiceWorker 测试是否可以在当前环境中运行。

Determine whether the current environment provides all necessary APIs to run ServiceWorker tests.

确定当前环境是否提供了运行 ServiceWorker 测试的所有必要 API。

The raw URL.

原始 URL。

The base URL to resolve `url` relative to.
    \(This is usually the ServiceWorker's origin or registration scope\).

要解析 `url` 的相对基础 URL。（这通常是 ServiceWorker 的来源或注册范围）。

A normalized representation of the URL.

URL 的规范化表示。

Get a normalized representation of a URL relative to a provided base URL.

获取 URL 相对于提供的基本 URL 的规范化表示。

More specifically:

更具体地说：

Resolve the URL relative to the provided base URL.

解析相对于所提供的基本 URL 的 URL。

If the URL is relative to the base URL, then strip the origin \(and only return the path and
search parts\). Otherwise, return the full URL.

如果 URL 是相对于基本 URL 的，则删除源（并仅返回路径和搜索部分）。否则，返回完整的 URL。

Parse a URL into its different parts, such as `origin`, `path` and `search`.

将 URL 解析为其不同的部分，例如 `origin`、`path` 和 `search`。
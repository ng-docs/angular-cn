When a pending <script> is unsubscribed we'll move it to this document, so it won't be
executed.

当一个待处理<script>已退订，我们将其移动到此文档，因此它不会被执行。

DI token/abstract type representing a map of JSONP callbacks.

表示 JSONP 回调映射的 DI 令牌/抽象类型。

In the browser, this should always be the `window` object.

在浏览器中，这应该始终是 `window` 对象。

Factory function that determines where to store JSONP callbacks.

确定在哪里存储 JSONP 回调的工厂函数。

Ordinarily JSONP callbacks are stored on the `window` object, but this may not exist
in test environments. In that case, callbacks are stored on an anonymous object instead.

通常，JSONP 回调存储在 `window` 对象上，但这在测试环境中可能不存在。在这种情况下，回调会存储在匿名对象上。

Processes an `HttpRequest` with the JSONP method,
by performing JSONP style requests.

通过执行 JSONP 风格的请求，使用 JSONP 方法处理 `HttpRequest`

The request object.

请求对象。

An observable of the response events.

响应事件的可观察对象。

Processes a JSONP request and returns an event stream of the results.

处理 JSONP 请求并返回结果的事件流。

Identifies requests with the method JSONP and shifts them to the `JsonpClientBackend`.

使用 JSONP 方法识别请求并将它们转移到 `JsonpClientBackend`。

Identifies requests with the method JSONP and
shifts them to the `JsonpClientBackend`.

使用 JSONP 方法标识这些请求，并将其转移到 `JsonpClientBackend`。

The outgoing request object to handle.

要处理的传出请求对象。

The next interceptor in the chain, or the backend
if no interceptors remain in the chain.

链中的下一个拦截器，如果链中没有拦截器，则为其后端接口。

An observable of the event stream.

事件流的可观察对象。

Identifies and handles a given JSONP request.

识别并处理给定的 JSONP 请求。
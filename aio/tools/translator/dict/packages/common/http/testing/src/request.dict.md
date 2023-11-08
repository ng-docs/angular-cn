Type that describes options that can be used to create an error
in `TestRequest`.

描述可用于在 `TestRequest` 中创建错误的选项的类型。

A mock requests that was received and is ready to be answered.

已收到并准备好进行应答的模拟请求。

This interface allows access to the underlying `HttpRequest`, and allows
responding with `HttpEvent`s or `HttpErrorResponse`s.

此接口允许访问底层 `HttpRequest`，并允许使用 `HttpEvent` 或 `HttpErrorResponse` 进行响应。

Whether the request was cancelled after it was sent.

请求在发送后是否已被取消。

Resolve the request by returning a body plus additional HTTP information \(such as response
headers\) if provided.
If the request specifies an expected body type, the body is converted into the requested type.
Otherwise, the body is converted to `JSON` by default.

通过返回 body 以及其他 HTTP 信息（比如响应标头）（如果提供过）来解析请求。如果请求指定了预期的
body 类型，则将 body 转换为所请求的类型。否则，body 在默认情况下转换成 `JSON`。

Both successful and unsuccessful responses can be delivered via `flush()`.

成功和失败的响应都可以通过 `flush()` 传递。

Http requests never emit an `ErrorEvent`. Please specify a `ProgressEvent`.

Http 请求永远不会发出 `ErrorEvent`。请指定 `ProgressEvent`。

Resolve the request by returning an `ErrorEvent` \(e.g. simulating a network failure\).

通过返回 `ErrorEvent`（比如，模拟网络故障）来解决请求。

Resolve the request by returning an `ProgressEvent` \(e.g. simulating a network failure\).

通过返回 `ProgressEvent` 来解决请求（例如模拟网络故障）。

Deliver an arbitrary `HttpEvent` \(such as a progress event\) on the response stream for this
request.

在响应流上为此请求传递一个任意的 `HttpEvent`

Helper function to convert a response body to an ArrayBuffer.

将响应主体转换为 ArrayBuffer 的帮助器函数。

Helper function to convert a response body to a Blob.

将响应正文转换为 Blob 的帮助器函数。

Helper function to convert a response body to JSON data.

将响应正文转换为 JSON 数据的帮助器函数。

Helper function to convert a response body to a string.

将响应主体转换为字符串的帮助器函数。

Convert a response body to the requested type.

将响应正文转换为请求的类型。
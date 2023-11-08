Construction interface for `HttpRequest`s.

`HttpRequest` 的构造接口。

All values are optional and will override default values if provided.

所有值都是可选的，如果提供了，则会覆盖默认值。

Determine whether the given HTTP method may include a body.

决定 `body` 中将包含哪种 HTTP 方法。

Safely assert whether the given value is an ArrayBuffer.

安全地断言指定值是否 `ArrayBuffer`。

In some execution environments ArrayBuffer is not defined.

在某些运行环境中可能没有定义 `ArrayBuffer`。

Safely assert whether the given value is a Blob.

安全地断言指定值是否 `Blob`。

In some execution environments Blob is not defined.

在某些运行环境下可能没有定义 `Blob`。

Safely assert whether the given value is a FormData instance.

安全的断言指定的值是否为 `FormData` 实例。

In some execution environments FormData is not defined.

在某些运行环境下可能没有定义 `FormData`。

Safely assert whether the given value is a URLSearchParams instance.

安全地断言给定值是否是 URLSearchParams 实例。

In some execution environments URLSearchParams is not defined.

在某些执行环境中，URLSearchParams 未定义。

An outgoing HTTP request with an optional typed body.

一个外发的 HTTP 请求，带有一个可选的类型化的请求体（`body`）。

`HttpRequest` represents an outgoing request, including URL, method,
headers, body, and other request configuration options. Instances should be
assumed to be immutable. To modify a `HttpRequest`, the `clone`
method should be used.

`HttpRequest` 表示一个外发请求，包括 URL、方法、请求头、请求体和其它请求配置项。
它的实例都是不可变的。要修改 `HttpRequest`，应该使用 `clone` 方法。

The request body, or `null` if one isn't set.

请求体，如果没有则为 `null`。

Bodies are not enforced to be immutable, as they can include a reference to any
user-defined data type. However, interceptors should take care to preserve
idempotence by treating them as such.

请求体无法确保自己是不可变的，因为它们可以包含指向任何自定义数据类型的引用。
不过，在拦截器中，要小心维护其幂等性 —— 把它们当做不可变对象。

Outgoing headers for this request.

本请求的外发请求头。

Shared and mutable context that can be used by interceptors

拦截器可以使用的共享和可变上下文

Whether this request should be made in a way that exposes progress events.

该请求是否应该暴露出进度事件。

Progress events are expensive \(change detection runs on each event\) and so
they should only be requested if the consumer intends to monitor them.

进度事件很昂贵（在每个事件中都会执行一次变更检测），所以只有当消费者关心这些事件时才应该请求这些进度事件。

Whether this request should be sent with outgoing credentials \(cookies\).

此请求是否应该带着凭证（Cookie）一起外发。

The expected response type of the server.

所期待的服务器响应类型。

This is used to parse the response appropriately before returning it to
the requestee.

它用来在把响应对象返回给被请求者之前以恰当的方式解析它。

The outgoing HTTP request method.

外发 HTTP 请求的方法。

Outgoing URL parameters.

外发的 URL 参数。

To pass a string representation of HTTP parameters in the URL-query-string format,
the `HttpParamsOptions`' `fromString` may be used. For example:

要以 URL-query-string 格式传递 HTTP 参数的字符串表示，可以用 `HttpParamsOptions` ' `fromString`
。例如：

The outgoing URL with all URL parameters set.

外发的 URL，及其所有 URL 参数。

Transform the free-form body into a serialized format suitable for
transmission to the server.

把无格式的请求体转换成适合传给服务器的序列化格式。

Examine the body and attempt to infer an appropriate MIME type
for it.

检测请求体，并尝试给它推断出一个合适的 MIME 类型。

If no such type can be inferred, this method will return `null`.

如果没有合适的 MIME 类型，该方法就会返回 `null`。
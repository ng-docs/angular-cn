Type enumeration for the different kinds of `HttpEvent`.

不同种类的 `HttpEvent` 的枚举类型。

The request was sent out over the wire.

该请求已经在路由上发出了。

An upload progress event was received.

收到了上传进度事件。

The response status code and headers were received.

收到了响应状态码和响应头。

A download progress event was received.

收到了下载进度事件。

The full response including the body was received.

收到了包括响应体在内的完整响应对象。

A custom event from an interceptor or a backend.

来自拦截器或后端的自定义事件。

Base interface for progress events.

进度事件的基础接口。

Progress event type is either upload or download.

进度事件的类型或者是上传或者是下载。

Number of bytes uploaded or downloaded.

已经上传或下载的字节数。

Total number of bytes to upload or download. Depending on the request or
response, this may not be computable and thus may not be present.

要上传或下载的总字节数。它可能是无法计算出来的，因此也就可能不存在，取决于是请求还是响应。

A download progress event.

下载进度事件。

The partial response body as downloaded so far.

到目前为止已经下载的那部分响应体。

Only present if the responseType was `text`.

只有当 responseType 是 `text` 时才会出现。

An upload progress event.

上传进度事件。

An event indicating that the request was sent to the server. Useful
when a request may be retried multiple times, to distinguish between
retries on the final event stream.

用于表示请求已经发到服务器的事件。
当请求可能被多次接受时很有用，以区分出最终事件流上的重试行为。

A user-defined event.

用户定义的事件。

Grouping all custom events under this type ensures they will be handled
and forwarded by all implementations of interceptors.

把所有自定义事件都分组在此类型下，以确保它们会被所有的拦截器所处理和转发。

An error that represents a failed attempt to JSON.parse text coming back
from the server.

一个错误对象，用来表示当视图用 JSON.parse 对从服务器返回的文本进行解析时出错。

It bundles the Error object with the actual response body that failed to parse.

它把 `Error` 对象和解析出错的实际响应体绑在一起。

Union type for all possible events on the response stream.

响应流中所有可能出现的事件的联合类型。

Typed according to the expected type of the response.

其类型取决于所期待的响应类型。

Base class for both `HttpResponse` and `HttpHeaderResponse`.

`HttpResponse` 和 `HttpHeaderResponse` 的共同基类。

All response headers.

所有响应头。

Response status code.

响应的状态码。

Textual description of response status code, defaults to OK.

响应状态码的文本描述。

Do not depend on this.

请不要在代码中依赖它。

URL of the resource retrieved, or null if not available.

所接收的资源的 URL，如果不可用则为 `null`。

Whether the status code falls in the 2xx range.

状态码是否位于 2xx 范围内。

Type of the response, narrowed to either the full response or the header.

响应对象的类型，窄化为完整的响应对象或只有响应头。

Super-constructor for all responses.

所有响应体的上级（super）构造器。

The single parameter accepted is an initialization hash. Any properties
of the response passed there will override the default values.

接受的唯一参数是一个初始化哈希值。所传进来的响应对象的任何属性都会覆盖这些默认值。

A partial HTTP response which only includes the status and header data,
but no response body.

一个部分 HTTP 请求，它只包括状态和响应头数据，但没有响应体。

`HttpHeaderResponse` is a `HttpEvent` available on the response
event stream, only when progress events are requested.

`HttpHeaderResponse` 是一个可用于响应事件流的 `HttpEvent`，只有在要求了进度事件时才有效。

Create a new `HttpHeaderResponse` with the given parameters.

根据给定的参数创建新的 `HttpHeaderResponse` 对象。

Copy this `HttpHeaderResponse`, overriding its contents with the
given parameter hash.

复制这个 `HttpHeaderResponse`，使用给定的参数哈希对象覆盖其内容。

A full HTTP response, including a typed response body \(which may be `null`
if one was not returned\).

一个完整的 HTTP 响应对象，包括一个带类型的响应体（如果没返回内容，则为 `null`）。

`HttpResponse` is a `HttpEvent` available on the response event
stream.

`HttpResponse` 是一个用于事件响应流的 `HttpEvent`。

The response body, or `null` if one was not returned.

响应体，如果没有返回内容则为 `null`。

Construct a new `HttpResponse`.

构造一个新的 `HttpResponse`。

A response that represents an error or failure, either from a
non-successful HTTP status, an error while executing the request,
or some other failure which occurred during the parsing of the response.

一个用于表示错误或失败的响应对象，或者来自执行请求时发生的错误给出的失败的 HTTP
状态码，或者来自在解析响应对象期间发生的其它错误。

Any error returned on the `Observable` response stream will be
wrapped in an `HttpErrorResponse` to provide additional context about
the state of the HTTP layer when the error occurred. The error property
will contain either a wrapped Error object or the error response returned
from the server.

任何从 `Observable` 响应流中返回的错误都会被包装成 `HttpErrorResponse`
对象，以便在发生错误时，提供关于 HTTP 层状态的额外上下文信息。
该错误或者包含一个包装好的错误对象，或者包含一个从服务端返回的错误响应体。

Errors are never okay, even when the status code is in the 2xx success range.

只要是错误，其 `ok` 就永远为 `false`，就算其 HTTP 状态码是 2xx 也一样。

Http status codes.
As per https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml

Http 状态代码。根据 https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
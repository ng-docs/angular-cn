HTTP client - Handle request errors

HTTP 客户端 - 处理请求错误

If the request fails on the server, `HttpClient` returns an *error* object instead of a successful response.

如果请求在服务器上失败了，那么 `HttpClient` 就会返回一个*错误*对象而不是一个成功的响应对象。

The same service that performs your server transactions should also perform error inspection, interpretation, and resolution.

执行服务器请求的同一个服务中也应该执行错误检查、解释和解析。

When an error occurs, you can obtain details of what failed to inform your user.
In some cases, you might also automatically [retry the request](#retry).

发生错误时，你可以获得关于通知用户失败的详细信息。在某些情况下，你可能还会自动[重试请求](#retry)。

<a id="error-details"></a>



Getting error details

获取错误详情

An app should give the user useful feedback when data access fails.
A raw error object is not particularly useful as feedback.
In addition to detecting that an error has occurred, you need to get error details and use those details to compose a user-friendly response.

当数据访问失败时，应用会给用户提供有用的反馈。原始的错误对象作为反馈并不是特别有用。除了检测到错误已经发生之外，还需要获取错误详细信息并使用这些细节来撰写用户友好的响应。

Two types of errors can occur.

可能会出现两种类型的错误。

The server backend might reject the request, returning an HTTP response with a status code such as 404 or 500.
These are error *responses*.

服务端可能会拒绝该请求，并返回状态码为 404 或 500 的 HTTP *响应*对象。这些是错误*响应*。

Something could go wrong on the client-side such as a network error that prevents the request from completing successfully or an exception thrown in an RxJS operator.
These errors have `status` set to `0` and the `error` property contains a `ProgressEvent` object, whose `type` might provide further information.

客户端也可能出现问题，比如网络错误会让请求无法成功完成，或者 RxJS 操作符也会抛出异常。这些错误的 `status` 为 `0`，并且其 `error` 属性包含一个 `ProgressEvent` 对象，此对象的 `type` 属性可以提供更详细的信息。

`HttpClient` captures both kinds of errors in its `HttpErrorResponse`.
Inspect that response to identify the error's cause.

`HttpClient` 在其 `HttpErrorResponse` 中会捕获两种错误。可以检查这个响应是否存在错误。

The following example defines an error handler in the previously defined ConfigService.

以下示例在先前定义的 ConfigService 中定义了一个错误处理程序。

The handler returns an RxJS `ErrorObservable` with a user-friendly error message.
The following code updates the `getConfig()` method, using a [pipe](guide/pipes "Pipes guide") to send all observables returned by the `HttpClient.get()` call to the error handler.

该处理程序会返回一个带有用户友好的错误信息的 RxJS `ErrorObservable`。下列代码修改了 `getConfig()` 方法，它使用一个[管道](guide/pipes "管道指南")把 `HttpClient.get()` 调用返回的所有 Observable 发送给错误处理器。

<a id="retry"></a>



Retrying a failed request

重试失败的请求

Sometimes the error is transient and goes away automatically if you try again.
For example, network interruptions are common in mobile scenarios, and trying again can produce a successful result.

有时候，错误只是临时性的，只要重试就可能会自动消失。比如，在移动端场景中可能会遇到网络中断的情况，只要重试一下就能拿到正确的结果。

The [RxJS library](guide/rx-library) offers several *retry* operators.
For example, the `retry()` operator automatically re-subscribes to a failed `Observable` a specified number of times.
*Re-subscribing* to the result of an `HttpClient` method call has the effect of reissuing the HTTP request.

[RxJS 库](guide/rx-library)提供了几个*重试*操作符。比如，`retry()` 操作符会自动重新订阅一个失败的 `Observable` 几次。*重新订阅* `HttpClient` 方法会导致它重新发出 HTTP 请求。

The following example shows how to pipe a failed request to the `retry()` operator before passing it to the error handler.

下面的例子演示了如何在把一个失败的请求传给错误处理程序之前，先通过管道传给 `retry()` 操作符。

Sending data to a server

把数据发送到服务器

In addition to fetching data from a server, `HttpClient` supports other HTTP methods such as PUT, POST, and DELETE, which you can use to modify the remote data.

除了从服务器获取数据外，`HttpClient` 还支持其它一些 HTTP 方法，比如 PUT，POST 和 DELETE，你可以用它们来修改远程数据。

The sample app for this guide includes an abridged version of the "Tour of Heroes" example that fetches heroes and enables users to add, delete, and update them.
The following sections show examples of the data-update methods from the sample's `HeroesService`.

本指南中的这个范例应用包括一个简略版本的《英雄之旅》，它会获取英雄数据，并允许用户添加、删除和修改它们。下面几节在 `HeroesService` 范例中展示了数据更新方法的一些例子。
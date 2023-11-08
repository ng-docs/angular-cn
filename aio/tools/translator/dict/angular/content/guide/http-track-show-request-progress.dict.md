HTTP - Track and show request progress

HTTP - 跟踪和显示请求进度

Sometimes applications transfer large amounts of data and those transfers can take a long time. File uploads are a typical example. You can give the users a better experience by providing feedback on the progress of such transfers.

应用程序有时会传输大量数据，而这些传输可能要花很长时间。文件上传就是典型的例子。你可以通过提供关于此类传输的进度反馈，为用户提供更好的体验。

Make a request

发出请求

To make a request with progress events enabled, create an instance of `HttpRequest` with the `reportProgress` option set true to enable tracking of progress events.

要想发出一个带有进度事件的请求，你可以创建一个 `HttpRequest` 实例，并把 `reportProgress` 选项设置为 true 来启用对进度事件的跟踪。

Track request progress

跟踪请求进度

Next, pass this request object to the `HttpClient.request()` method, which returns an `Observable` of `HttpEvents` \(the same events processed by [interceptors](guide/http-intercept-requests-and-responses#interceptor-events)\).

接下来，将此请求对象传给 `HttpClient.request()` 方法，该方法返回 `HttpEvents`（与[拦截器](guide/http-intercept-requests-and-responses#interceptor-events)处理的事件相同）的 `Observable`。

The `getEventMessage` method interprets each type of `HttpEvent` in the event stream.

`getEventMessage` 方法解释了事件流中每种类型的 `HttpEvent`。
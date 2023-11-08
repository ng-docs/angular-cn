HTTP -  interceptor use-cases

HTTP 拦截器用例

Following are a number of common uses for interceptors.

以下是拦截器的一些常见用法。

Set default headers

设置默认标题

Apps often use an interceptor to set default headers on outgoing requests.

应用通常会使用拦截器来设置外发请求的默认请求头。

The sample app has an `AuthService` that produces an authorization token.
Here is its `AuthInterceptor` that injects that service to get the token and adds an authorization header with that token to every outgoing request:

该范例应用具有一个 `AuthService`，它会生成一个认证令牌。在这里，`AuthInterceptor` 会注入该服务以获取令牌，并对每一个外发的请求添加一个带有该令牌的认证头：

The practice of cloning a request to set new headers is so common that there's a `setHeaders` shortcut for it:

这种在克隆请求的同时设置新请求头的操作太常见了，因此它还有一个快捷方式 `setHeaders`：

An interceptor that alters headers can be used for a number of different operations, including:

这种可以修改头的拦截器可以用于很多不同的操作，比如：

Authentication/authorization

认证 / 授权

Caching behavior; for example, `If-Modified-Since`

控制缓存行为。比如 `If-Modified-Since`

XSRF protection

XSRF 防护

Log request and response pairs

记录请求和响应对

Because interceptors can process the request and response *together*, they can perform tasks such as timing and logging an entire HTTP operation.

因为拦截器可以*同时*处理请求和响应，所以它们也可以对整个 HTTP 操作执行计时和记录日志等任务。

Consider the following `LoggingInterceptor`, which captures the time of the request,
the time of the response, and logs the outcome with the elapsed time
with the injected `MessageService`.

考虑下面这个 `LoggingInterceptor`，它捕获请求的发起时间、响应的接收时间，并使用注入的 `MessageService` 来发送总共花费的时间。

The RxJS `tap` operator captures whether the request succeeded or failed.
The RxJS `finalize` operator is called when the response observable either returns an error or completes and reports the outcome to the `MessageService`.

RxJS 的 `tap` 操作符会捕获请求成功了还是失败了。RxJS 的 `finalize` 操作符无论在返回成功还是失败时都会调用，然后把结果汇报给 `MessageService`。

Neither `tap` nor `finalize` touch the values of the observable stream returned to the caller.

在这个可观察对象的流中，无论是 `tap` 还是 `finalize` 接触过的值，都会照常发送给调用者。

<a id="custom-json-parser"></a>



Custom JSON parsing

自定义 JSON 解析

Interceptors can be used to replace the built-in JSON parsing with a custom implementation.

拦截器可用来以自定义实现替换内置的 JSON 解析。

The `CustomJsonInterceptor` in the following example demonstrates how to achieve this.
If the intercepted request expects a `'json'` response, the `responseType` is changed to `'text'` to disable the built-in JSON parsing.
Then the response is parsed via the injected `JsonParser`.

以下示例中的 `CustomJsonInterceptor` 演示了如何实现此目的。如果截获的请求期望一个 `'json'` 响应，则将 `responseType` 更改为 `'text'` 以禁用内置的 JSON 解析。然后，通过注入的 `JsonParser` 解析响应。

You can then implement your own custom `JsonParser`.
Here is a custom JsonParser that has a special date reviver.

然后，你可以实现自己的自定义 `JsonParser`。这是一个具有特殊日期接收器的自定义 JsonParser。

You provide the `CustomParser` along with the `CustomJsonInterceptor`.

你提供 `CustomParser` 以及 `CustomJsonInterceptor`。

<a id="caching"></a>



Cache requests

缓存请求

Interceptors can handle requests by themselves, without forwarding to `next.handle()`.

拦截器还可以自行处理这些请求，而不用转发给 `next.handle()`。

For example, you might decide to cache certain requests and responses to improve performance.
You can delegate caching to an interceptor without disturbing your existing data services.

比如，你可能会想缓存某些请求和响应，以便提升性能。你可以把这种缓存操作委托给某个拦截器，而不破坏你现有的各个数据服务。

The `CachingInterceptor` in the following example demonstrates this approach.

下例中的 `CachingInterceptor` 演示了这种方法。

The `isCacheable()` function determines if the request is cacheable.
In this sample, only GET requests to the package search API are cacheable.

`isCacheable()` 函数用于决定该请求是否允许缓存。在这个例子中，只有发到包搜索 API 的 GET 请求才是可以缓存的。

If the request is not cacheable, the interceptor forwards the request to the next handler in the chain

如果该请求是不可缓存的，该拦截器会把该请求转发给链表中的下一个处理器

If a cacheable request is found in the cache, the interceptor returns an `of()` *observable* with the cached response, by-passing the `next` handler and all other interceptors downstream

如果可缓存的请求在缓存中找到了，该拦截器就会通过 `of()` 函数返回一个已缓存的响应体的*可观察对象*，然后绕过 `next` 处理器（以及所有其它下游拦截器）

If a cacheable request is not in cache, the code calls `sendRequest()`.
This function forwards the request to `next.handle()` which ultimately calls the server and returns the server's response.

如果可缓存的请求不在缓存中，代码会调用 `sendRequest()`。这个函数会把请求转发给 `next.handle()`，它会最终调用服务器并返回来自服务器的响应对象。

<a id="send-request"></a>



<a id="cache-refresh"></a>



Use interceptors to request multiple values

使用拦截器请求多个值

The `HttpClient.get()` method normally returns an observable that emits a single value, either the data or an error.
An interceptor can change this to an observable that emits [multiple values](guide/observables).

`HttpClient.get()` 方法通常会返回一个可观察对象，它会发出一个值（数据或错误）。拦截器可以把它改成一个可以发出[多个值](guide/observables)的可观察对象。

The following revised version of the `CachingInterceptor` optionally returns an observable that immediately emits the cached response, sends the request on to the package search API, and emits again later with the updated search results.

修改后的 `CachingInterceptor` 版本可以返回一个立即发出所缓存响应的可观察对象，然后把请求发送到包搜索 API，然后把修改过的搜索结果重新发出一次。

The revised `CachingInterceptor` sets up a server request whether there's a cached value or not, using the same `sendRequest()` method described [above](#send-request).
The `results$` observable makes the request when subscribed.

修改后的 `CachingInterceptor` 会发起一个服务器请求，而不管有没有缓存的值。
就像 [前面](#send-request) 的 `sendRequest()` 方法一样进行订阅。
在订阅 `results$` 可观察对象时，就会发起这个请求。

If there's no cached value, the interceptor returns `results$`.

如果没有缓存值，拦截器直接返回 `results$`。

If there is a cached value, the code *pipes* the cached response onto `results$`. This produces a recomposed observable that emits two responses, so subscribers will see a sequence of these two responses:

如果有缓存的值，这些代码就会把缓存的响应加入到 `result$` 的*管道*中。这会生成一个重组后的 Observable，它会发出两次响应，故此订阅者将会看到一个包含这两个响应的序列。

The cached response that's emitted immediately

立即发出的已缓存的响应

The response from the server, that's emitted later

稍后发出来自服务器的响应

<a id="report-progress"></a>
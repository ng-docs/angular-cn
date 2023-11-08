[HTTP Guide](guide/http#intercepting-requests-and-responses)

[HTTP 一章](guide/http#intercepting-requests-and-responses)

To use the same instance of `HttpInterceptors` for the entire app, import the `HttpClientModule`
only in your `AppModule`, and add the interceptors to the root application injector.
If you import `HttpClientModule` multiple times across different modules \(for example, in lazy
loading modules\), each import creates a new copy of the `HttpClientModule`, which overwrites the
interceptors provided in the root module.

要想在整个应用中使用 `HttpInterceptors` 的同一个实例，就只能在 `AppModule` 模块中导入 `HttpClientModule`，并且把拦截器都添加到应用的根注入器中。如果你在不同的模块中多次导入 `HttpClientModule`，则每次导入都会创建 `HttpClientModule` 的一个新复本，它将会覆盖根模块上提供的那些拦截器。

Intercepts and handles an `HttpRequest` or `HttpResponse`.

拦截 `HttpRequest` 并处理它们。

Most interceptors transform the outgoing request before passing it to the
next interceptor in the chain, by calling `next.handle(transformedReq)`.
An interceptor may transform the
response event stream as well, by applying additional RxJS operators on the stream
returned by `next.handle()`.

另一种同样罕见但是有用的拦截器，会为单个请求在事件流上给出多个响应对象。

More rarely, an interceptor may handle the request entirely,
and compose a new event stream instead of invoking `next.handle()`. This is an
acceptable behavior, but keep in mind that further interceptors will be skipped entirely.

极少数情况下，拦截器也可以自己完全处理一个请求，并且组合出新的事件流来而不必调用 `next.handle()`。这也是允许的，不过要时刻记住，这将会完全跳过所有后继拦截器。

It is also rare but valid for an interceptor to return multiple responses on the
event stream for a single request.

另一种同样罕见但是有用的拦截器，会为单个请求在事件流上给出多个响应对象。

The outgoing request object to handle.

要处理的传出请求对象。

The next interceptor in the chain, or the backend
if no interceptors remain in the chain.

链中的下一个拦截器，如果链中没有拦截器，则为其后端接口。

An observable of the event stream.

事件流的可观察对象。

Identifies and handles a given HTTP request.

标识并处理给定的 HTTP 请求。

Represents the next interceptor in an interceptor chain, or the real backend if there are no
further interceptors.

表示拦截器链中的下一个拦截器，如果没有进一步的拦截器，则表示真正的后端。

Most interceptors will delegate to this function, and either modify the outgoing request or the
response when it arrives. Within the scope of the current request, however, this function may be
called any number of times, for any number of downstream requests. Such downstream requests need
not be to the same URL or even the same origin as the current request. It is also valid to not
call the downstream handler at all, and process the current request entirely within the
interceptor.

大多数拦截器将委托给此函数，并在传出请求或到达时修改响应。但是，在当前请求的范围内，可以对于任意数量的下游请求调用任意次数。此类下游请求无需与当前请求来自同一个 URL 甚至与同一个来源。根本不调用下游处理程序，并完全在拦截器中处理当前请求也是有效的。

This function should only be called within the scope of the request that's currently being
intercepted. Once that request is complete, this downstream handler function should not be
called.

此函数只能在当前被截获的请求范围内调用。一旦该请求完成，就不应调用此下游处理程序函数。

An interceptor for HTTP requests made via `HttpClient`.

通过 `HttpClient` 发出的 HTTP 请求的拦截器。

`HttpInterceptorFn`s are middleware functions which `HttpClient` calls when a request is made.
These functions have the opportunity to modify the outgoing request or any response that comes
back, as well as block, redirect, or otherwise change the request or response semantics.

`HttpInterceptorFn` 是 `HttpClient` 在发出请求时调用的中间件函数。这些函数有机会修改传出请求或任何返回的响应，以及阻止、重定向或以其他方式更改请求或响应语义。

An `HttpHandlerFn` representing the next interceptor \(or the backend which will make a real HTTP
request\) is provided. Most interceptors will delegate to this function, but that is not required
\(see `HttpHandlerFn` for more details\).

提供了一个表示下一个拦截器（或将发出真实 HTTP 请求的后端）的 `HttpHandlerFn`。大多数拦截器会委托给此函数，但这不是必需的（有关详细信息，请参阅 `HttpHandlerFn` ）。

`HttpInterceptorFn`s have access to `inject()` via the `EnvironmentInjector` from which they were
configured.

`HttpInterceptorFn` 可以通过配置它们的 `EnvironmentInjector` 访问 injection `inject()`。

Function which invokes an HTTP interceptor chain.

调用 HTTP 拦截器链的函数。

Each interceptor in the interceptor chain is turned into a `ChainedInterceptorFn` which closes
over the rest of the chain \(represented by another `ChainedInterceptorFn`\). The last such
function in the chain will instead delegate to the `finalHandlerFn`, which is passed down when
the chain is invoked.

拦截器链中的每个拦截器都变成一个 `ChainedInterceptorFn`，它关闭链的其余部分（由另一个 `ChainedInterceptorFn` 表示）。链中的最后一个此类函数将委托给 `finalHandlerFn`，它在链被调用时向下传递。

This pattern allows for a chain of many interceptors to be composed and wrapped in a single
`HttpInterceptorFn`, which is a useful abstraction for including different kinds of interceptors
\(e.g. legacy class-based interceptors\) in the same chain.

此模式允许将许多拦截器的链组合并包装在单个 `HttpInterceptorFn` 中，这是在同一链中包含不同类型的拦截器（例如遗留的基于类的拦截器）的有用抽象。

Constructs a `ChainedInterceptorFn` which adapts a legacy `HttpInterceptor` to the
`ChainedInterceptorFn` interface.

构造一个 `ChainedInterceptorFn`，它使旧版 `HttpInterceptor` 适应 `ChainedInterceptorFn` 接口。

Constructs a `ChainedInterceptorFn` which wraps and invokes a functional interceptor in the given
injector.

构造一个 `ChainedInterceptorFn`，它包装并调用给定注入器中的功能拦截器。

A multi-provider token that represents the array of registered
`HttpInterceptor` objects.

一个多重提供者（multi-provider）令牌，它代表所有已注册的 `HttpInterceptor` 构成的数组。

A multi-provided token of `HttpInterceptorFn`s.

多方提供的 `HttpInterceptorFn` 令牌。

A multi-provided token of `HttpInterceptorFn`s that are only set in root.

仅在根中设置的 `HttpInterceptorFn` 的多提供令牌。

Creates an `HttpInterceptorFn` which lazily initializes an interceptor chain from the legacy
class-based interceptors and runs the request through it.

创建一个 `HttpInterceptorFn`，它从遗留的基于类的拦截器延迟初始化拦截器链，并通过它运行请求。
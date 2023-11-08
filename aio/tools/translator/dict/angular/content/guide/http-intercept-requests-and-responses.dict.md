HTTP - Intercept requests and responses

HTTP - 拦截请求和响应

With interception, you declare *interceptors* that inspect and transform HTTP requests from your application to a server.
The same interceptors can also inspect and transform a server's responses on their way back to the application.
Multiple interceptors form a *forward-and-backward* chain of request/response handlers.

借助拦截机制，你可以声明一些*拦截器*，它们可以检查并转换从应用中发给服务器的 HTTP 请求。这些拦截器还可以在返回应用的途中检查和转换来自服务器的响应。多个拦截器构成了请求/响应处理器的*双向*链表。

Interceptors can perform a variety of  *implicit* tasks, from authentication to logging, in a routine, standard way, for every HTTP request/response.

拦截器可以用一种常规的、标准的方式对每一次 HTTP 的请求/响应任务执行从认证到记日志等很多种*隐式*任务。

Without interception, developers would have to implement these tasks *explicitly* for each `HttpClient` method call.

如果没有拦截机制，那么开发人员将不得不对每次 `HttpClient` 调用*显式*实现这些任务。

Write an interceptor

编写拦截器

To implement an interceptor, declare a class that implements the `intercept()` method of the `HttpInterceptor` interface.

要实现拦截器，就要实现一个实现了 `HttpInterceptor` 接口中的 `intercept()` 方法的类。

Here is a do-nothing `noop` interceptor that passes the request through without touching it:

这里是一个什么也不做的 `noop` 拦截器，它只会不做任何修改的传递这个请求。

The `intercept` method transforms a request into an `Observable` that eventually returns the HTTP response.
In this sense, each interceptor is fully capable of handling the request entirely by itself.

`intercept` 方法会把请求转换成一个最终返回 HTTP 响应体的 `Observable`。在这个场景中，每个拦截器都完全能自己处理这个请求。

Most interceptors inspect the request on the way in and forward the potentially altered request to the `handle()` method of the `next` object which implements the [`HttpHandler`](api/common/http/HttpHandler) interface.

大多数拦截器拦截都会在传入时检查请求，然后把潜在的请求转发给 `next` 对象的 `handle()` 方法，而 `next` 对象实现了 [`HttpHandler`](api/common/http/HttpHandler) 接口。

Like `intercept()`, the `handle()` method transforms an HTTP request into an `Observable` of [`HttpEvents`](#interceptor-events) which ultimately include the server's response.
The `intercept()` method could inspect that observable and alter it before returning it to the caller.

像 `intercept()` 一样，`handle()` 方法也会把 HTTP 请求转换成 [`HttpEvents`](#interceptor-events) 组成的 `Observable`，它最终包含的是来自服务器的响应。
`intercept()` 函数可以检查这个可观察对象，并在把它返回给调用者之前修改它。

This `no-op` interceptor calls `next.handle()` with the original request and returns the observable without doing a thing.

这个 `no-op` 拦截器，会使用原始的请求调用 `next.handle()`，并返回它返回的可观察对象，而不做任何后续处理。

The `next` object

`next` 对象

The `next` object represents the next interceptor in the chain of interceptors.
The final `next` in the chain is the `HttpClient` backend handler that sends the request to the server and receives the server's response.

`next` 对象表示拦截器链表中的下一个拦截器。这个链表中的最后一个 `next` 对象就是 `HttpClient` 的后端处理器（backend handler），它会把请求发给服务器，并接收服务器的响应。

Most interceptors call `next.handle()` so that the request flows through to the next interceptor and, eventually, the backend handler.
An interceptor *could* skip calling `next.handle()`, short-circuit the chain, and [return its own `Observable`](guide/http-interceptor-use-cases#caching) with an artificial server response.

大多数拦截器都会调用 `next.handle()` 以便请求流经下一个拦截器，并最终流向后端处理程序。拦截器*可以*跳过对 `next.handle()` 的调用，使调用链短路，并[返回带有人工响应体的自定义 `Observable`](guide/http-interceptor-use-cases#caching)。

This is a common middleware pattern found in frameworks such as Express.js.

这是一种常见的中间件模式，在像 Express.js 这样的框架中也会找到它。

Provide the interceptor

提供这个拦截器

The `NoopInterceptor` is a service managed by Angular's [dependency injection \(DI\)](guide/dependency-injection) system.
Like other services, you must provide the interceptor class before the app can use it.

这个 `NoopInterceptor` 就是一个由 Angular [依赖注入（DI）](guide/dependency-injection)系统管理的服务。像其它服务一样，你也必须先提供这个拦截器类，应用才能使用它。

Because interceptors are optional dependencies of the `HttpClient` service, you must provide them in the same injector or a parent of the injector that provides `HttpClient`.
Interceptors provided *after* DI creates the `HttpClient` are ignored.

由于拦截器是 `HttpClient` 服务的（可选）依赖，所以你必须在提供 `HttpClient` 的同一个（或其各级父注入器）注入器中提供这些拦截器。那些在 DI 创建完 `HttpClient` *之后*再提供的拦截器将会被忽略。

This app provides `HttpClient` in the app's root injector, as a side-effect of importing the `HttpClientModule` in `AppModule`.
You should provide interceptors in `AppModule` as well.

由于在 `AppModule` 中导入了 `HttpClientModule`，导致本应用在其根注入器中提供了 `HttpClient`。所以你也同样要在 `AppModule` 中提供这些拦截器。

After importing the `HTTP_INTERCEPTORS` injection token from `@angular/common/http`, write the `NoopInterceptor` provider like this:

在从 `@angular/common/http` 中导入了 `HTTP_INTERCEPTORS` 注入令牌之后，编写如下的 `NoopInterceptor` 提供者注册语句：

Notice the `multi: true` option.
This required setting tells Angular that `HTTP_INTERCEPTORS` is a token for a *multiprovider* that injects an array of values, rather than a single value.

注意 `multi: true` 选项。这个必须的选项会告诉 Angular `HTTP_INTERCEPTORS` 是一个*多重提供者*的令牌，表示它会注入一个多值的数组，而不是单一的值。

You *could* add this provider directly to the providers array of the `AppModule`.
However, it's rather verbose and there's a good chance that you'll create more interceptors and provide them in the same way.
You must also pay [close attention to the order](#interceptor-order) in which you provide these interceptors.

你*也可以*直接把这个提供者添加到 `AppModule` 中的提供者数组中，不过那样会非常啰嗦。况且，你将来还会用这种方式创建更多的拦截器并提供它们。
你还要[特别注意提供这些拦截器的顺序](#interceptor-order)。

Consider creating a "barrel" file that gathers all the interceptor providers into an `httpInterceptorProviders` array, starting with this first one, the `NoopInterceptor`.

认真考虑创建一个封装桶（barrel）文件，用于把所有拦截器都收集起来，一起提供给 `httpInterceptorProviders` 数组，可以先从这个 `NoopInterceptor` 开始。

Then import and add it to the `AppModule` `providers array` like this:

然后导入它，并把它加到 `AppModule` 的 `providers array` 中，就像这样：

As you create new interceptors, add them to the `httpInterceptorProviders` array and you won't have to revisit the `AppModule`.

当你再创建新的拦截器时，就同样把它们添加到 `httpInterceptorProviders` 数组中，而不用再修改 `AppModule`。

Interceptor order

拦截器的顺序

Angular applies interceptors in the order that you provide them.
For example, consider a situation in which you want to handle the authentication of your HTTP requests and log them before sending them to a server.
To accomplish this task, you could provide an `AuthInterceptor` service and then a `LoggingInterceptor` service.
Outgoing requests would flow from the `AuthInterceptor` to the `LoggingInterceptor`.
Responses from these requests would flow in the other direction, from `LoggingInterceptor` back to `AuthInterceptor`.
The following is a visual representation of the process:

Angular 会按你提供拦截器的顺序应用它们。比如，考虑一个场景：你想处理 HTTP 请求的身份验证并记录它们，然后再将它们发送到服务器。要完成此任务，你可以提供 `AuthInterceptor` 服务，然后提供 `LoggingInterceptor` 服务。发出的请求将从 `AuthInterceptor` 到 `LoggingInterceptor`。这些请求的响应则沿相反的方向流动，从 `LoggingInterceptor` 回到 `AuthInterceptor`。以下是该过程的直观表示：

You cannot change the order or remove interceptors later.
If you need to enable and disable an interceptor dynamically, you'll have to build that capability into the interceptor itself.

以后你就再也不能修改这些顺序或移除某些拦截器了。如果你需要动态启用或禁用某个拦截器，那就要在那个拦截器中自行实现这个功能。

<a id="interceptor-events"></a>



Handle interceptor events

处理拦截器事件

Most `HttpClient` methods return observables of `HttpResponse<any>`.
The `HttpResponse` class itself is actually an event, whose type is `HttpEventType.Response`.
A single HTTP request can, however, generate multiple events of other types, including upload and download progress events.
The methods `HttpInterceptor.intercept()` and `HttpHandler.handle()` return observables of `HttpEvent<any>`.

大多数 `HttpClient` 方法都会返回 `HttpResponse<any>` 型的可观察对象。`HttpResponse` 类本身就是一个事件，它的类型是 `HttpEventType.Response`。但是，单个 HTTP 请求可以生成其它类型的多个事件，包括报告上传和下载进度的事件。`HttpInterceptor.intercept()` 和 `HttpHandler.handle()` 会返回 `HttpEvent<any>` 型的可观察对象。

Many interceptors are only concerned with the outgoing request and return the event stream from `next.handle()` without modifying it.
Some interceptors, however, need to examine and modify the response from `next.handle()`; these operations can see all of these events in the stream.

很多拦截器只关心发出的请求，而对 `next.handle()` 返回的事件流不会做任何修改。但是，有些拦截器需要检查并修改 `next.handle()` 的响应。上述做法就可以在流中看到所有这些事件。

<a id="immutability"></a>



Although interceptors are capable of modifying requests and responses, the `HttpRequest` and `HttpResponse` instance properties are `readonly`, rendering them largely immutable.
They are immutable for a good reason:
An app might retry a request several times before it succeeds, which means that the interceptor chain can re-process the same request multiple times.
If an interceptor could modify the original request object, the re-tried operation would start from the modified request rather than the original.
Immutability ensures that interceptors see the same request for each try.

虽然拦截器有能力改变请求和响应，但 `HttpRequest` 和 `HttpResponse` 实例的属性却是只读（`readonly`）的，
因此让它们基本上是不可变的。

TypeScript prevents you from setting `HttpRequest` read-only properties.

TypeScript 会阻止你设置 `HttpRequest` 的只读属性。

If you must alter a request, clone it first and modify the clone before passing it to `next.handle()`.
You can clone and modify the request in a single step, as shown in the following example.

如果你必须修改一个请求，先把它克隆一份，修改这个克隆体后再把它传给 `next.handle()`。你可以在一步中克隆并修改此请求，例子如下。

The `clone()` method's hash argument lets you mutate specific properties of the request while copying the others.

这个 `clone()` 方法的哈希型参数允许你在复制出克隆体的同时改变该请求的某些特定属性。

Modify a request body

修改请求体

The `readonly` assignment guard can't prevent deep updates and, in particular, it can't prevent you from modifying a property of a request body object.

`readonly` 这种赋值保护，无法防范深修改（修改子对象的属性），也不能防范你修改请求体对象中的属性。

If you must modify the request body, follow these steps.

如果必须修改请求体，请执行以下步骤。

Copy the body and make your change in the copy.

复制请求体并在副本中进行修改。

Clone the request object, using its `clone()` method.

使用 `clone()` 方法克隆这个请求对象。

Replace the clone's body with the modified copy.

用修改过的副本替换被克隆的请求体。

Clear the request body in a clone

清除克隆中的请求正文

Sometimes you need to clear the request body rather than replace it.
To do this, set the cloned request body to `null`.

有时，你需要清除请求体而不是替换它。为此，请将克隆后的请求体设置为 `null`。
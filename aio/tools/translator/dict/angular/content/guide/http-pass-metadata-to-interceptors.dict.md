HTTP - Pass metadata to interceptors

HTTP - 将元数据传递给拦截器

Many interceptors require or benefit from configuration.
Consider an interceptor that retries failed requests.
By default, the interceptor might retry a request three times, but you might want to override this retry count for particularly error-prone or sensitive requests.

许多拦截器都需要进行配置或从配置中受益。考虑一个重试失败请求的拦截器。默认情况下，拦截器可能会重试请求三次，但是对于特别容易出错或敏感的请求，你可能要改写这个重试次数。

`HttpClient` requests contain a *context* that can carry metadata about the request.
This context is available for interceptors to read or modify, though it is not transmitted to the backend server when the request is sent.
This lets applications or other interceptors tag requests with configuration parameters, such as how many times to retry a request.

`HttpClient` 请求包含一个*上下文*，该上下文可以携带有关请求的元数据。该上下文可供拦截器读取或修改，尽管发送请求时它并不会传输到后端服务器。这允许应用程序或其他拦截器使用配置参数来标记这些请求，比如重试请求的次数。

Create a context token

创建上下文标记

Angular stores and retrieves a value in the context using an `HttpContextToken`.
You can create a context token using the `new` operator, as in the following example:

`HttpContextToken` 用于在上下文中存储和检索值。你可以用 `new` 运算符创建上下文令牌，如以下例所示：

The lambda function `() => 3` passed during the creation of the `HttpContextToken` serves two purposes:

`HttpContextToken` 创建期间传递的 lambda 函数 `() => 3` 有两个用途：

It lets TypeScript infer the type of this token:
`HttpContextToken<number>`
The request context is type-safe —reading a token from a request's context returns a value of the appropriate type.

它允许 TypeScript 推断此令牌的类型：`HttpContextToken<number>`。这个请求上下文是类型安全的 —— 从请求上下文中读取令牌将返回适当类型的值。

It sets the default value for the token.
This is the value that the request context returns if no other value was set for this token.
Using a default value avoids the need to check if a particular value is set.

它会设置令牌的默认值。如果尚未为此令牌设置其他值，那么这就是请求上下文返回的值。使用默认值可以避免检查是否已设置了特定值。

Set context values when making a request

发出请求时设置上下文值

When making a request, you can provide an `HttpContext` instance, in which you have already set the context values.

发出请求时，你可以提供一个 `HttpContext` 实例，在该实例中你已经设置了一些上下文值。

Read context values in an interceptor

在拦截器中读取上下文值

Within an interceptor, you can read the value of a token in a given request's context with `HttpContext.get()`.
If you have not explicitly set a value for the token, Angular returns the default value specified in the token.

`HttpContext.get()` 在给定请求的上下文中读取令牌的值。如果尚未显式设置令牌的值，则 Angular 将返回标记中指定的默认值。

Contexts are mutable

上下文是可变的（Mutable）

Unlike most other aspects of `HttpRequest` instances, the request context is mutable and persists across other immutable transformations of the request.
This lets interceptors coordinate operations through the context.
For instance, the `RetryInterceptor` example could use a second context token to track how many errors occur during the execution of a given request:

与 `HttpRequest` 实例的大多数其他方面不同，请求上下文是可变的，并且在请求的其他不可变转换过程中仍然存在。这允许拦截器通过此上下文协调来操作。比如，`RetryInterceptor` 示例可以使用第二个上下文令牌来跟踪在执行给定请求期间发生过多少错误：
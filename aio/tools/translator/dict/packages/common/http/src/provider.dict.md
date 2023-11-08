Identifies a particular kind of `HttpFeature`.

标识一种特定类型的 `HttpFeature`。

A feature for use when configuring `provideHttpClient`.

配置 `provideHttpClient` 时使用的特性。

Configures Angular's `HttpClient` service to be available for injection.

将 Angular 的 `HttpClient` 服务配置为可注入。

By default, `HttpClient` will be configured for injection with its default options for XSRF
protection of outgoing requests. Additional configuration options can be provided by passing
feature functions to `provideHttpClient`. For example, HTTP interceptors can be added using the
`withInterceptors(...)` feature.

默认情况下，`HttpClient` 将配置为注入，其默认选项是对传出请求的 XSRF 保护。可以通过将特性函数传递给 `provideHttpClient` 来提供其他配置选项。例如，可以用 `withInterceptors(...)` 特性添加 HTTP 拦截器。

Adds one or more functional-style HTTP interceptors to the configuration of the `HttpClient`
instance.

将一个或多个功能风格的 HTTP 拦截器添加到 `HttpClient` 实例的配置中。

Includes class-based interceptors configured using a multi-provider in the current injector into
the configured `HttpClient` instance.

包括使用当前注入器中的多重提供器配置的基于类的拦截器到配置的 `HttpClient` 实例中。

Prefer `withInterceptors` and functional interceptors instead, as support for DI-provided
interceptors may be phased out in a later release.

更推荐 `withInterceptors` 和函数式拦截器，因为对 DI 提供的拦截器的支持可能会在以后的版本中逐步淘汰。

Customizes the XSRF protection for the configuration of the current `HttpClient` instance.

为当前 `HttpClient` 实例的配置自定义 XSRF 保护。

This feature is incompatible with the `withNoXsrfProtection` feature.

此特性与 `withNoXsrfProtection` 特性不兼容。

Disables XSRF protection in the configuration of the current `HttpClient` instance.

在当前 `HttpClient` 实例的配置中禁用 XSRF 保护。

This feature is incompatible with the `withXsrfConfiguration` feature.

此特性与 `withXsrfConfiguration` 特性不兼容。

Add JSONP support to the configuration of the current `HttpClient` instance.

将 JSONP 支持添加到当前 `HttpClient` 实例的配置中。

Configures the current `HttpClient` instance to make requests via the parent injector's
`HttpClient` instead of directly.

将当前的 `HttpClient` 实例配置为通过父注入器的 `HttpClient` 而不是直接发出请求。

By default, `provideHttpClient` configures `HttpClient` in its injector to be an independent
instance. For example, even if `HttpClient` is configured in the parent injector with
one or more interceptors, they will not intercept requests made via this instance.

默认情况下，`provideHttpClient` 将其注入器中的 `HttpClient` 配置为独立实例。例如，即使 `HttpClient` 在父注入器中配置为一个或多个拦截器，它们也不会拦截通过此实例发出的请求。

With this option enabled, once the request has passed through the current injector's
interceptors, it will be delegated to the parent injector's `HttpClient` chain instead of
dispatched directly, and interceptors in the parent configuration will be applied to the request.

启用此选项后，一旦请求通过当前注入器的拦截器，它将被委托给父注入器的 `HttpClient` 链，而不是直接分派，并且父配置中的拦截器将应用于请求。

If there are several `HttpClient` instances in the injector hierarchy, it's possible for
`withRequestsMadeViaParent` to be used at multiple levels, which will cause the request to
"bubble up" until either reaching the root level or an `HttpClient` which was not configured with
this option.

如果注入器层次结构中有几个 `HttpClient` 实例，则 `withRequestsMadeViaParent` 可能会在多个级别使用，这将导致请求“冒泡”，直到达到根级别或未配置使用此选项的 `HttpClient`。
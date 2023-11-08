Configures XSRF protection support for outgoing requests.

配置 XSRF 保护，以支持外发请求。

For a server that supports a cookie-based XSRF protection system,
use directly to configure XSRF protection with the correct
cookie and header names.

如果没有提供名字，则默认的 Cookie 名是 `XSRF-TOKEN`，默认的请求头名字是 `X-XSRF-TOKEN`。

If no names are supplied, the default cookie name is `XSRF-TOKEN`
and the default header name is `X-XSRF-TOKEN`.

如果没有提供名字，则默认的 Cookie 名是 `XSRF-TOKEN`，默认的请求头名字是 `X-XSRF-TOKEN`。

Disable the default XSRF protection.

禁用默认的 XSRF 保护。

An object that can specify either or both
cookie name or header name.

一个对象，可以指定 Cookie 名和/或请求头的名字。

Cookie name default is `XSRF-TOKEN`.

Cookie 名默认值是 `XSRF-TOKEN`。

Header name default is `X-XSRF-TOKEN`.

请求头的名字默认是 `X-XSRF-TOKEN`。

Configure XSRF protection.

配置 XSRF 保护。

Configures the [dependency injector](guide/glossary#injector) for `HttpClient`
with supporting services for XSRF. Automatically imported by `HttpClientModule`.

为支持 XSRF 的 `HttpClient` 配置[依赖注入器](guide/glossary#injector)。它会被 `HttpClientModule` 自动导入。

You can add interceptors to the chain behind `HttpClient` by binding them to the
multiprovider for built-in [DI token](guide/glossary#di-token) `HTTP_INTERCEPTORS`.

通过把拦截器提供为内置的 [DI 令牌](guide/glossary#di-token) `HTTP_INTERCEPTORS`（允许有多个），你可以把它们添加到 `HttpClient` 调用链的后面。

Configures the [dependency injector](guide/glossary#injector) for `HttpClient`
with supporting services for JSONP.
Without this module, Jsonp requests reach the backend
with method JSONP, where they are rejected.

为支持 JSONP 的 `HttpClient` 配置[依赖注入器](guide/glossary#injector)。如果没有该模块，Jsonp 请求就会被发送到后端，然后被后端拒绝。
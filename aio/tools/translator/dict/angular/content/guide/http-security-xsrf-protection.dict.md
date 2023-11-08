HTTP client - Security: Cross-Site Request Forgery \(XSRF\) protection

HTTP 客户端 - 安全性：跨站点请求伪造（XSRF）保护

[Cross-Site Request Forgery \(XSRF or CSRF\)](https://en.wikipedia.org/wiki/Cross-site_request_forgery) is an attack technique by which the attacker can trick an authenticated user into unknowingly executing actions on your website.

[跨站请求伪造（XSRF 或 CSRF）](https://en.wikipedia.org/wiki/Cross-site_request_forgery)是一种攻击技术，攻击者可以通过这种技术诱使已完成身份验证的用户在你的网站上不知不觉地执行某些操作。

`HttpClient` supports a [common mechanism](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-header_token) used to prevent XSRF attacks.
When performing HTTP requests, an interceptor reads a token from a cookie, by default `XSRF-TOKEN`, and sets it as an HTTP header, `X-XSRF-TOKEN`.
Because only code that runs on your domain could read the cookie, the backend can be certain that the HTTP request came from your client application and not an attacker.

`HttpClient` 支持用于防止 XSRF 攻击的[通用机制](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-header_token)。当执行 HTTP 请求时，拦截器从 cookie 中读取令牌，默认为 `XSRF-TOKEN`，并将其设置为 HTTP 标头 `X-XSRF-TOKEN`。因为只有在你的域上运行的代码才能读取 cookie，这样后端就可以确定 HTTP 请求来自你的客户端程序而不是攻击者。

By default, an interceptor sends this header on all mutating requests \(such as POST\)
to relative URLs, but not on GET/HEAD requests or on requests with an absolute URL.

默认情况下，拦截器会在所有的修改型请求中（比如 POST 等）把这个请求头发送给使用相对 URL 的请求。但不会在 GET/HEAD 请求中发送，也不会发送给使用绝对 URL 的请求。

To take advantage of this, your server needs to set a token in a JavaScript readable session cookie called `XSRF-TOKEN` on either the page load or the first GET request.
On subsequent requests the server can verify that the cookie matches the `X-XSRF-TOKEN` HTTP header, and therefore be sure that only code running on your domain could have sent the request.
The token must be unique for each user and must be verifiable by the server; this prevents the client from making up its own tokens.
Set the token to a digest of your site's authentication cookie with a salt for added security.

要获得这种优点，你的服务器需要在页面加载或首个 GET 请求中把一个名叫 `XSRF-TOKEN` 的标记写入可被 JavaScript 读到的会话 cookie 中。而在后续的请求中，服务器可以验证这个 cookie 是否与 HTTP 头 `X-XSRF-TOKEN` 的值一致，以确保只有运行在你自己域名下的代码才能发起这个请求。这个标记必须对每个用户都是唯一的，并且必须能被服务器验证，因此不能由客户端自己生成标记。把这个标记设置为你的站点认证信息并且加了盐（salt）的摘要，以提升安全性。

To prevent collisions in environments where multiple Angular apps share the same domain or subdomain, give each application a unique cookie name.

为了防止多个 Angular 应用共享同一个域名或子域时出现冲突，要给每个应用分配一个唯一的 cookie 名称。

Configure custom cookie/header names

配置自定义 cookie/标头名称

If your backend service uses different names for the XSRF token cookie or header, use `HttpClientXsrfModule.withOptions()` to override the defaults.

如果你的后端服务中对 XSRF 标记的 cookie 或头使用了不一样的名字，就要使用 `HttpClientXsrfModule.withOptions()` 来覆盖掉默认值。

<a id="testing-requests"></a>
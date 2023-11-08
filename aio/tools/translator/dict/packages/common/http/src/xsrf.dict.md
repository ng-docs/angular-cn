Retrieves the current XSRF token to use with the next outgoing request.

检索当前的 XSRF 标记以用于下一个传出请求。

Get the XSRF token to use with an outgoing request.

获取 XSRF 标记以用于传出请求。

Will be called for every request, so the token may change between requests.

在每个请求中都会被调用，因此该标记可能会在请求之间更改。

`HttpXsrfTokenExtractor` which retrieves the token from a cookie.

`HttpXsrfTokenExtractor`，它从 Cookie 中检索标记。

`HttpInterceptor` which adds an XSRF token to eligible outgoing requests.

`HttpInterceptor`，它将 XSRF 标记添加到符合条件的传出请求。
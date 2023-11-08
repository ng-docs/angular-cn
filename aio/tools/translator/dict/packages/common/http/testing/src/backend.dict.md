A testing backend for `HttpClient` which both acts as an `HttpBackend`
and as the `HttpTestingController`.

`HttpClient` 的测试后端，既作为 `HttpBackend` 又作为 `HttpTestingController`。

`HttpClientTestingBackend` works by keeping a list of all open requests.
As requests come in, they're added to the list. Users can assert that specific
requests were made and then flush them. In the end, a `verify()` method asserts
that no unexpected requests were made.

`HttpClientTestingBackend`
会通过保留所有打开的请求的列表来工作。当请求进来时，它们会被添加到列表中。用户可以断言已发出特定请求，然后刷新它们。最后，`verify()`
方法会断言没有发出意外请求。

Handle an incoming request by queueing it in the list of open requests.

通过在打开的请求列表中排队来处理传入的请求。

Search for requests in the list of open requests, and return all that match
without asserting anything about the number of matches.

在打开的请求列表中搜索请求，并返回所有匹配项，而不断言任何关于匹配数的内容。

Expect that a single outstanding request matches the given matcher, and return
it.

预期单个未完成的请求与给定的匹配器匹配，并返回它。

Requests returned through this API will no longer be in the list of open requests,
and thus will not match twice.

通过此 API 返回的请求将不再在打开的请求列表中，因此不会匹配两次。

Expect that no outstanding requests match the given matcher, and throw an error
if any do.

预期没有未完成的请求与给定的匹配器匹配，如果有则抛出错误。

Validate that there are no outstanding requests.

验证没有未完成的请求。
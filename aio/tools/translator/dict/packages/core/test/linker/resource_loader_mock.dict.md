A mock implementation of {&commat;link ResourceLoader} that allows outgoing requests to be mocked
and responded to within a single test, without going to the network.

{&commat;link ResourceLoader} 的模拟实现，它允许在单个测试中模拟和响应传出请求，而无需转到网络。

Add an expectation for the given URL. Incoming requests will be checked against
the next expectation \(in FIFO order\). The `verifyNoOutstandingExpectations` method
can be used to check if any expectations have not yet been met.

为给定的 URL 添加期望。将根据下一个期望（按 FIFO 顺序）检查传入的请求。
`verifyNoOutstandingExpectations` 方法可用于检查是否尚未满足任何期望。

The response given will be returned if the expectation matches.

如果期望匹配，将返回给定的响应。

Add a definition for the given URL to return the given response. Unlike expectations,
definitions have no order and will satisfy any matching request at any time. Also
unlike expectations, unused definitions do not cause `verifyNoOutstandingExpectations`
to return an error.

为给定的 URL
添加定义以返回给定的响应。与预期不同，定义没有顺序，并且会随时满足任何匹配的请求。此外，与预期不同，未使用的定义不会导致
`verifyNoOutstandingExpectations` 返回错误。

Process pending requests and verify there are no outstanding expectations. Also fails
if no requests are pending.

处理待处理的请求并验证没有未完成的期望。如果没有待处理的请求，也会失败。

Throw an exception if any expectations have not been satisfied.

如果任何期望未得到满足，则抛出异常。
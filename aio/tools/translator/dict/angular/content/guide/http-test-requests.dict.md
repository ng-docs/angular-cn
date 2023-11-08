HTTP client - Test requests

HTTP 客户端 - 测试请求

As for any external dependency, you must mock the HTTP backend so your tests can simulate interaction with a remote server.
The `@angular/common/http/testing` library makes it straightforward to set up such mocking.

如同所有的外部依赖一样，你必须把 HTTP 后端也 Mock 掉，以便你的测试可以模拟这种与后端的互动。`@angular/common/http/testing` 库能让这种 Mock 工作变得直截了当。

HTTP testing library

HTTP 测试库

Angular's HTTP testing library is designed for a pattern of testing in which the app executes code and makes requests first.
The test then expects that certain requests have or have not been made, performs assertions against those requests, and finally provides responses by "flushing" each expected request.

Angular 的 HTTP 测试库是专为其中的测试模式而设计的。在这种模式下，会首先在应用中执行代码并发起请求。然后，这个测试会期待发起或未发起过某个请求，并针对这些请求进行断言，最终对每个所预期的请求进行刷新（flush）来对这些请求提供响应。

At the end, tests can verify that the app made no unexpected requests.

最终，测试可能会验证这个应用不曾发起过非预期的请求。

Setup for testing

搭建测试环境

To begin testing calls to `HttpClient`, import the `HttpClientTestingModule` and the mocking controller, `HttpTestingController`, along with the other symbols your tests require.

要开始测试那些通过 `HttpClient` 发起的请求，就要导入 `HttpClientTestingModule` 模块和模拟控制器（`HttpTestingController`）以及你测试所需的其他符号。

Then add the `HttpClientTestingModule` to the `TestBed` and continue with the setup of the *service-under-test*.

然后把 `HTTPClientTestingModule` 添加到 `TestBed` 中，并继续设置*被测服务*。

Now requests made in the course of your tests hit the testing backend instead of the normal backend.

现在，在测试中发起的这些请求会发给这些测试用的后端（testing backend），而不是标准的后端。

This setup also calls `TestBed.inject()` to inject the `HttpClient` service and the mocking controller so they can be referenced during the tests.

这种设置还会调用 `TestBed.inject()`，来获取注入的 `HttpClient` 服务和模拟控制器，以便在测试期间引用它们。

Expect and answer requests

期待并回答请求

Now you can write a test that expects a GET Request to occur and provides a mock response.

现在，你就可以编写测试，等待 GET 请求并给出模拟响应。

The last step, verifying that no requests remain outstanding, is common enough for you to move it into an `afterEach()` step:

最后一步，验证没有发起过预期之外的请求，足够通用，因此你可以把它移到 `afterEach()` 中：

Custom request expectations

自定义对请求的预期

If matching by URL isn't sufficient, it's possible to implement your own matching function.
For example, you could look for an outgoing request that has an authorization header:

如果仅根据 URL 匹配还不够，你还可以自行实现匹配函数。比如，你可以验证外发的请求是否带有某个认证头：

As with the previous `expectOne()`, the test fails if 0 or 2+ requests satisfy this predicate.

像前面的 `expectOne()` 测试一样，如果零或两个以上的请求满足了这个断言，它就会抛出异常。

Handle more than one request

处理多个请求

If you need to respond to duplicate requests in your test, use the `match()` API instead of `expectOne()`.
It takes the same arguments but returns an array of matching requests.
Once returned, these requests are removed from future matching and you are responsible for flushing and verifying them.

如果你需要在测试中对重复的请求进行响应，可以使用 `match()` API 来代替 `expectOne()`，它的参数不变，但会返回一个与这些请求相匹配的数组。一旦返回，这些请求就会从将来要匹配的列表中移除，你要自己验证和刷新（flush）它。

Test for errors

对报错进行测试

You should test the app's defenses against HTTP requests that fail.

你还要测试应用对于 HTTP 请求失败时的防护。

Call `request.flush()` with an error message, as seen in the following example.

调用 `request.flush()` 并传入一个错误信息，如下所示。

Alternatively, call `request.error()` with a `ProgressEvent`.

另外，还可以用 `ProgressEvent` 来调用 `request.error()`。
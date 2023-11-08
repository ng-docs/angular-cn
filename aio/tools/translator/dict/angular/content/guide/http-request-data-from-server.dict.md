HTTP&#x3A; Request data from a server

HTTP：从服务器请求数据

Use the [`HttpClient.get()`](api/common/http/HttpClient#get) method to fetch data from a server.
The asynchronous method sends an HTTP request, and returns an Observable that emits the requested data when the response is received.
The return type varies based on the `observe` and `responseType` values that you pass to the call.

使用 [`HttpClient.get()`](api/common/http/HttpClient#get) 方法从服务器获取数据。该异步方法会发送一个 HTTP 请求，并返回一个 Observable，它会在收到响应时发出所请求到的数据。返回的类型取决于你调用时传入的 `observe` 和 `responseType` 参数。

The `get()` method takes two arguments; the endpoint URL from which to fetch, and an *options* object that is used to configure the request.

`get()` 方法有两个参数。要获取的端点 URL，以及一个可以用来配置请求的*选项*对象。

Important options include the *observe* and *responseType* properties.

这些重要的选项包括 *observe* 和 *responseType* 属性。

The *observe* option specifies how much of the response to return

*observe* 选项用于指定要返回的响应内容。

The *responseType* option specifies the format in which to return data

*responseType* 选项指定返回数据的格式。

Applications often request JSON data from a server.
In the `ConfigService` example, the app needs a configuration file on the server, `config.json`, that specifies resource URLs.

应用经常会从服务器请求 JSON 数据。在 `ConfigService` 例子中，该应用需要服务器 `config.json` 上的一个配置文件来指定资源的 URL。

To fetch this kind of data, the `get()` call needs the following options: `{observe: 'body', responseType: 'json'}`.
These are the default values for those options, so the following examples do not pass the options object.
Later sections show some of the additional option possibilities.

要获取这类数据，`get()` 调用需要以下几个选项：`{observe: 'body', responseType: 'json'}`。这些是这些选项的默认值，所以下面的例子不会传递 options 对象。后面几节展示了一些额外的选项。

<a id="config-service"></a>



The example conforms to the best practices for creating scalable solutions by defining a re-usable [injectable service](guide/glossary#service "service definition") to perform the data-handling functionality.
In addition to fetching data, the service can post-process the data, add error handling, and add retry logic.

这个例子符合通过定义一个可复用的可[注入服务](guide/glossary#service "服务定义")来执行数据处理功能来创建可伸缩解决方案的最佳实践。除了提取数据外，该服务还可以对数据进行后处理，添加错误处理，并添加重试逻辑。

The `ConfigService` fetches this file using the `HttpClient.get()` method.

`ConfigService` 使用 `HttpClient.get()` 方法获取这个文件。

The `ConfigComponent` injects the `ConfigService` and calls the `getConfig` service method.

`ConfigComponent` 注入了 `ConfigService` 并调用了 `getConfig` 服务方法。

Because the service method returns an `Observable` of configuration data, the component *subscribes* to the method's return value.
The subscription callback performs minimal post-processing.
It copies the data fields into the component's `config` object, which is data-bound in the component template for display.

由于该服务方法返回了一个 `Observable` 配置数据，该组件会*订阅*该方法的返回值。订阅回调只会对后处理进行最少量的处理。它会把数据字段复制到组件的 `config` 对象中，该对象在组件模板中是数据绑定的，用于显示。

<a id="always-subscribe"></a>



Starting the request

启动请求

For all `HttpClient` methods, the method doesn't begin its HTTP request until you call `subscribe()` on the observable the method returns.

对于所有 `HttpClient` 方法，在你在方法返回的 Observable 上调用 `subscribe()` 之前，该方法都不会开始其 HTTP 请求。

This is true for *all* `HttpClient` *methods*.

这适用于 `HttpClient` 的*所有方法*。

All observables returned from `HttpClient` methods are *cold* by design.
Execution of the HTTP request is *deferred*, letting you extend the observable with additional operations such as  `tap` and `catchError` before anything actually happens.

`HttpClient` 的所有方法返回的可观察对象都设计为*冷的*。HTTP 请求的执行都是*延期执行的*，让你可以用 `tap` 和 `catchError` 这样的操作符来在实际执行 HTTP 请求之前，先对这个可观察对象进行扩展。

Calling `subscribe()` triggers execution of the observable and causes `HttpClient` to compose and send the HTTP request to the server.

调用 `subscribe()` 会触发此 Observable 的执行，并导致 `HttpClient` 合成 HTTP 请求并将其发送到服务器。

Think of these observables as *blueprints* for actual HTTP requests.

可以把这些 Observable 看做实际 HTTP 请求的*蓝图*。

<a id="typed-response"></a>



Requesting a typed response

请求输入一个类型的响应

Structure your `HttpClient` request to declare the type of the response object, to make consuming the output easier and more obvious.
Specifying the response type acts as a type assertion at compile time.

可以构造自己的 `HttpClient` 请求来声明响应对象的类型，以便让输出更容易、更明确。所指定的响应类型会在编译时充当类型断言。

To specify the response object type, first define an interface with the required properties.
Use an interface rather than a class, because the response is a plain object that cannot be automatically converted to an instance of a class.

要指定响应对象类型，首先要定义一个具有必需属性的接口。这里要使用接口而不是类，因为响应对象是普通对象，无法自动转换成类的实例。

Next, specify that interface as the `HttpClient.get()` call's type parameter in the service.

接下来，在服务器中把该接口指定为 `HttpClient.get()` 调用的类型参数。

The callback in the updated component method receives a typed data object, which is easier and safer to consume:

修改后的组件方法，其回调函数中获取一个带类型的对象，它易于使用，且消费起来更安全：

To access properties that are defined in an interface, you must explicitly convert the plain object you get from the JSON to the required response type.
For example, the following `subscribe` callback receives `data` as an Object, and then type-casts it in order to access the properties.

要访问接口中定义的属性，必须将从 JSON 获得的普通对象显式转换为所需的响应类型。比如，以下 `subscribe` 回调会将 `data` 作为对象接收，然后进行类型转换以访问属性。

<a id="string-union-types"></a>



Reading the full response

读取完整的响应体

In the previous example, the call to `HttpClient.get()` did not specify any options.
By default, it returned the JSON data contained in the response body.

在前面的例子中，对 `HttpClient.get()` 的调用没有指定任何选项。默认情况下，它返回了响应体中包含的 JSON 数据。

You might need more information about the transaction than is contained in the response body.
Sometimes servers return special headers or status codes to indicate certain conditions that are important to the application workflow.

你可能还需要关于这次对话的更多信息。比如，有时候服务器会返回一个特殊的响应头或状态码，来指出某些在应用的工作流程中很重要的条件。

Tell `HttpClient` that you want the full response with the `observe` option of the `get()` method:

可以用 `get()` 方法的 `observe` 选项来告诉 `HttpClient`，你想要完整的响应对象：

Now `HttpClient.get()` returns an `Observable` of type `HttpResponse` rather than just the JSON data contained in the body.

现在，`HttpClient.get()` 会返回一个 `HttpResponse` 类型的 `Observable`，而不只是 JSON 数据。

The component's `showConfigResponse()` method displays the response headers as well as the configuration:

该组件的 `showConfigResponse()` 方法会像显示配置数据一样显示响应头：

As you can see, the response object has a `body` property of the correct type.

如你所见，该响应对象具有一个带有正确类型的 `body` 属性。
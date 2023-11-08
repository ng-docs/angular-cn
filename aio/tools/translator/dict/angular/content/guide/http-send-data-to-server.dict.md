HTTP&#x3A; Send data to a server

HTTP：向服务器发送数据

In addition to fetching data from a server, `HttpClient` supports other HTTP methods such as PUT, POST, and DELETE, which you can use to modify the remote data.

除了从服务器获取数据外，`HttpClient` 还支持其它一些 HTTP 方法，比如 PUT，POST 和 DELETE，你可以用它们来修改远程数据。

The sample app for this guide includes an abridged version of the "Tour of Heroes" example that fetches heroes and enables users to add, delete, and update them.
The following sections show examples of the data-update methods from the sample's `HeroesService`.

本指南中的这个范例应用包括一个简略版本的《英雄之旅》，它会获取英雄数据，并允许用户添加、删除和修改它们。下面几节在 `HeroesService` 范例中展示了数据更新方法的一些例子。

Make a POST request

发出 POST 请求

Apps often send data to a server with a POST request when submitting a form.
In the following example, the `HeroesService` makes an HTTP POST request when adding a hero to the database.

应用经常在提交表单时通过 POST 请求向服务器发送数据。下面这个例子中，`HeroesService` 在向数据库添加英雄时发起了一个 HTTP POST 请求。

The `HttpClient.post()` method is similar to `get()` in that it has a type parameter, which you can use to specify that you expect the server to return data of a given type.
The method takes a resource URL and two additional parameters:

`HttpClient.post()` 方法像 `get()` 一样也有类型参数，可以用它来指出你期望服务器返回特定类型的数据。该方法需要一个资源 URL 和两个额外的参数：

options

options

An object containing method options which, in this case, specify required headers.

包含方法选项的对象，在这里用于指定所需的标头。

body

body

The data to POST in the body of the request.

要在请求正文中 POST 的数据。

Parameter

参数

Details

详情

The example catches errors as [described above](guide/http-handle-request-errors#error-details).

该示例[如上所述](guide/http-handle-request-errors#error-details)会捕获错误。

The `HeroesComponent` initiates the actual POST operation by subscribing to the `Observable` returned by this service method.

`HeroesComponent` 通过订阅该服务方法返回的 `Observable` 发起了一次实际的 `POST` 操作。

When the server responds successfully with the newly added hero, the component adds that hero to the displayed `heroes` list.

当服务器成功做出响应时，会带有这个新创建的英雄，然后该组件就会把这个英雄添加到正在显示的 `heroes` 列表中。

Make a DELETE request

发出删除请求

This application deletes a hero with the `HttpClient.delete` method by passing the hero's ID in the request URL.

该应用可以把英雄的 ID 传给 `HttpClient.delete` 方法的请求 URL 来删除一个英雄。

The `HeroesComponent` initiates the actual DELETE operation by subscribing to the `Observable` returned by this service method.

当 `HeroesComponent` 订阅了该服务方法返回的 `Observable` 时，就会发起一次实际的 `DELETE` 操作。

The component isn't expecting a result from the delete operation, so it subscribes without a callback.
Even though you are not using the result, you still have to subscribe.
Calling the `subscribe()` method *executes* the observable, which is what initiates the DELETE request.

该组件不会等待删除操作的结果，所以它的 subscribe（订阅）中没有回调函数。不过就算你不关心结果，也仍然要订阅它。调用 `subscribe()` 方法会**执行**这个可观察对象，这时才会真的发起 DELETE 请求。

Make a PUT request

发出 PUT 请求

An app can send PUT requests using the HTTP client service.
The following `HeroesService` example, like the POST example, replaces a resource with updated data.

应用可以使用 HttpClient 服务发送 PUT 请求。下面的 `HeroesService` 范例（就像 POST 范例一样）用一个修改过的数据替换了该资源。

As for any of the HTTP methods that return an observable, the caller, `HeroesComponent.update()` [must `subscribe()`](guide/http-request-data-from-server#always-subscribe "Why you must always subscribe.") to the observable returned from the `HttpClient.put()` in order to initiate the request.

对于任何返回可观察对象的 HTTP 方法，调用者 `HeroesComponent.update()` [必须 `subscribe()`](guide/http-request-data-from-server#always-subscribe "为什么你必须始终订阅。") 从 `HttpClient.put()` 返回的可观察对象才会发起请求。

Add and updating headers

添加和更新表头

Many servers require extra headers for save operations.
For example, a server might require an authorization token, or "Content-Type" header to explicitly declare the MIME type of the request body.

很多服务器都需要额外的头来执行保存操作。比如，服务器可能需要一个授权令牌，或者需要 `Content-Type` 头来显式声明请求体的 MIME 类型。

Add headers

添加标头

The `HeroesService` defines such headers in an `httpOptions` object that are passed to every `HttpClient` save method.

`HeroesService` 在一个 `httpOptions` 对象中定义了这样的头，它们被传给每个 `HttpClient` 的保存型方法。

Update headers

更新标头

You can't directly modify the existing headers within the previous options
object because instances of the `HttpHeaders` class are immutable.
Use the `set()` method instead, to return a clone of the current instance with the new changes applied.

你不能直接修改前面的选项对象中的 `HttpHeaders` 请求头，因为 `HttpHeaders` 类的实例是不可变对象。请改用 `set()` 方法，以返回当前实例应用了新更改之后的副本。

The following example shows how, when an old token expires, you can update the authorization header before making the next request.

下面的例子演示了当旧令牌过期时，可以在发起下一个请求之前更新授权头。

<a id="url-params"></a>
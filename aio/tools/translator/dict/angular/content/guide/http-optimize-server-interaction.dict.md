HTTP - Optimize server interaction with debouncing

HTTP - 通过防抖优化服务器交互

If you need to make an HTTP request in response to user input, it's not efficient to send a request for every keystroke. It's better to wait until the user stops typing and then send a request. This technique is known as debouncing.

如果你需要发一个 HTTP 请求来响应用户的输入，那么每次按键就发送一个请求的效率显然不高。最好等用户停止输入后再发送请求。这种技术叫做防抖。

Implement debouncing

实现防抖

Consider the following template, which lets a user enter a search term to find a package by name. When the user enters a name in a search-box, the `PackageSearchComponent` sends a search request for a package with that name to the package search API.

考虑下面这个模板，它让用户输入一个搜索词来按名字查找包。当用户在搜索框中输入名字时，`PackageSearchComponent` 就会把这个根据名字搜索包的请求发给包搜索 API。

Here, the `keyup` event binding sends every keystroke to the component's `search()` method.

在这里，`keyup` 事件绑定会将每个按键都发送到组件的 `search()` 方法。

The following snippet implements debouncing for this input using RxJS operators.

下面的代码片段使用 RxJS 的操作符为这个输入实现了防抖。

The `searchText$` is the sequence of search-box values coming from the user.
It's defined as an RxJS `Subject`, which means it is a multicasting `Observable` that can also emit values for itself by calling `next(value)`, as happens in the `search()` method.

`searchText$` 是来自用户的搜索框值的序列。它被定义为 RxJS `Subject` 类型，这意味着它是一个多播 `Observable`，它还可以通过调用 `next(value)` 来自行发出值，就像在 `search()` 方法中一样。

Rather than forward every `searchText` value directly to the injected `PackageSearchService`, the code in `ngOnInit()` pipes search values through three operators, so that a search value reaches the service only if it's a new value and the user stopped typing.

除了把每个 `searchText` 的值都直接转发给 `PackageSearchService` 之外，`ngOnInit()` 中的代码还通过下列三个操作符对这些搜索值进行*管道*处理，以便只有当它是一个新值并且用户已经停止输入时，要搜索的值才会抵达该服务。

`switchMap()`⁠

`switchMap()`⁠

Send the search request to the service.

将搜索请求发送到服务。

Wait until the search text changes.

等待搜索文本发生变化。

`debounceTime(500)`⁠

`debounceTime(500)`⁠

Wait for the user to stop typing, which is 1/2 second in this case.

等待用户停止输入，本例中为 1/2 秒。

RxJS operators

RxJS 操作符

Details

详情

The code sets `packages$` to this re-composed `Observable` of search results.
The template subscribes to `packages$` with the [AsyncPipe](api/common/AsyncPipe) and displays search results as they arrive.

这些代码把 `packages$` 设置成了使用搜索结果组合出的 `Observable` 对象。模板中使用 [AsyncPipe](api/common/AsyncPipe) 订阅了 `packages$`，一旦搜索结果的值发回来了，就显示这些搜索结果。

Using the `switchMap()` operator

使用 `switchMap()` 操作符

The `switchMap()` operator takes a function argument that returns an `Observable`.
In the example, `PackageSearchService.search` returns an `Observable`, as other data service methods do.
If a previous search request is still in-flight, such as when the network connection is poor, the operator cancels that request and sends a new one.

`switchMap()` 操作符接受一个返回 `Observable` 的函数型参数。在这个例子中，`PackageSearchService.search` 像其它数据服务方法那样返回一个 `Observable`。如果先前的搜索请求仍在*进行中*（如网络连接不良），它将取消该请求并发送新的请求。
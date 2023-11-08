Testability API.
`declare` keyword causes tsickle to generate externs, so these methods are
not renamed by Closure Compiler.

`Testability`  API。`declare` 关键字会导致 tsickle 生成外部变量，因此 Closure Compiler
不会重命名这些方法。

Internal injection token that can used to access an instance of a Testability class.

可用于访问 Testability 类的实例的内部注入标记。

This token acts as a bridge between the core bootstrap code and the `Testability` class. This is
needed to ensure that there are no direct references to the `Testability` class, so it can be
tree-shaken away \(if not referenced\). For the environments/setups when the `Testability` class
should be available, this token is used to add a provider that references the `Testability`
class. Otherwise, only this token is retained in a bundle, but the `Testability` class is not.

此标记作为核心引导代码和 `Testability` 类之间的桥梁。这是为了确保没有对 `Testability`
类的直接引用，因此可以对它进行树形摇动（如果没有引用）。对于 `Testability`
类应该可用的环境/设置，此标记用于添加引用 `Testability`
类的提供者。否则，只有此标记会保留在包中，但 `Testability` 类不会。

Internal injection token to retrieve Testability getter class instance.

用于检索 Testability getter 类实例的内部注入标记。

The Testability service provides testing hooks that can be accessed from
the browser.

Testability 服务提供了可以从浏览器访问的测试钩子。

Angular applications bootstrapped using an NgModule \(via `@NgModule.bootstrap` field\) will also
instantiate Testability by default \(in both development and production modes\).

默认情况下，使用 NgModule（通过 `@NgModule.bootstrap` 字段）引导的 Angular 应用程序也将实例化
Testability（在开发和生产模式下）。

For applications bootstrapped using the `bootstrapApplication` function, Testability is not
included by default. You can include it into your applications by getting the list of necessary
providers using the `provideProtractorTestingSupport()` function and adding them into the
`options.providers` array. Example:

对于使用 `bootstrapApplication` 函数引导的应用程序，默认情况下不包括 Testability。你可以通过使用
`provideProtractorTestingSupport()` 函数获取必要的提供程序列表并将它们添加到 `options.providers`
数组中来将其包含到你的应用程序中。示例：

pending requests are now tracked with zones.

现在可以使用 Zone 来跟踪未决请求。

Increases the number of pending request

增加待处理请求的数量

pending requests are now tracked with zones

现在使用 Zone 跟踪待处理的请求

Decreases the number of pending request

减少待处理的请求数

Whether an associated application is stable

关联的应用程序是否稳定

The callback to invoke when Angular is stable or the timeout expires
   whichever comes first.

当 Angular 稳定或超时到期时调用的回调，以先到者为准。

Optional. The maximum time to wait for Angular to become stable. If not
   specified, whenStable\(\) will wait forever.

可选的。等待 Angular 稳定下来的最长时间。如果未指定，那么 whenStable\(\) 将永远等待。

Optional. If specified, this callback will be invoked whenever the set of
   pending macrotasks changes. If this callback returns true doneCb will not be invoked
   and no further updates will be issued.

可选的。如果指定，则每当挂起的宏任务集发生更改时，都会调用此回调。如果此回调返回
true，那么将不会调用 doneCb，并且不会发出进一步的更新。

Wait for the application to be stable with a timeout. If the timeout is reached before that
happens, the callback receives a list of the macro tasks that were pending, otherwise null.

等待应用程序稳定并超时。如果在此之前已达到超时，则回调将收到未决的宏任务的列表，否则为 null。

Get the number of pending requests

获取待处理的请求数

token of application, root element

应用的令牌，根元素

Registers an application with a testability hook so that it can be tracked.

使用可测试性钩子注册应用程序，以便可以跟踪它。

Unregisters an application.

注销应用程序。

The root element to search from

要搜索的根元素

The name of binding variable

绑定变量的名称

Whether using exactMatch

是否使用 exactMatch

Find providers by name

按名称查找提供者

A global registry of {&commat;link Testability} instances for specific elements.

{&commat;link Testability} 实例的全局注册表，用于特定元素。

Testability hook

`Testability` 钩子

Registers an application with a testability hook so that it can be tracked

使用 `Testability` 钩子注册应用程序，以便可以对其进行跟踪

Unregisters all applications

注销所有应用程序

root element

根元素

Get a testability hook associated with the application

获取与应用程序关联的 `Testability` 钩子

Get all registered testabilities

获取所有注册的测试能力

Get all registered applications\(root elements\)

获取所有注册的应用程序（根元素）

node

节点

whether finding testability in ancestors if testability was not found in
current node

在当前节点中未找到 `Testability` 的情况下是否要在祖先中寻找 `Testability`

Find testability of a node in the Tree

在树中查找节点的 `Testability`

Adapter interface for retrieving the `Testability` service associated for a
particular context.

适配器接口，用于检索与特定上下文关联 `Testability`

Set the {&commat;link GetTestability} implementation used by the Angular testing framework.

设置 Angular 测试框架使用的 {&commat;link GetTestability} 实现。
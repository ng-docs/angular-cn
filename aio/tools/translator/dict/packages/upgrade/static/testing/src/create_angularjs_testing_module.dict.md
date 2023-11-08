a collection of Angular modules to include in the configuration.

要包含在配置中的 Angular 模块的集合。

A helper function to use when unit testing AngularJS services that depend upon downgraded Angular
services.

单元测试依赖于降级 Angular 服务的 AngularJS 服务时要使用的帮助器函数。

This function returns an AngularJS module that is configured to wire up the AngularJS and Angular
injectors without the need to actually bootstrap a hybrid application.
This makes it simpler and faster to unit test services.

此函数返回一个 AngularJS 模块，该模块被配置为连接 AngularJS 和 Angular
注入器，而无需实际引导混合应用程序。这使得单元测试服务变得更简单、更快。

Use the returned AngularJS module in a call to
[`angular.mocks.module`](https://docs.angularjs.org/api/ngMock/function/angular.mock.module) to
include this module in the unit test injector.

在对[`angular.mocks.module`](https://docs.angularjs.org/api/ngMock/function/angular.mock.module)的调用中使用返回的
AngularJS 模块，以将此模块包含在单元测试注入器中。

In the following code snippet, we are configuring the `$injector` with two modules:
The AngularJS `ng1AppModule`, which is the AngularJS part of our hybrid application and the
`Ng2AppModule`, which is the Angular part.

在以下代码片段中，我们使用两个模块配置 `$injector`：AngularJS `ng1AppModule`
，它是我们混合应用程序的 AngularJS 部分和 `Ng2AppModule`，它是 Angular 部分。

Once this is done we can get hold of services via the AngularJS `$injector` as normal.
Services that are \(or have dependencies on\) a downgraded Angular service, will be instantiated as
needed by the Angular root `Injector`.

完成后，我们可以像往常一样通过 AngularJS `$injector` 获取服务。作为（或依赖于）降级的 Angular
服务的服务，将根据 Angular 根 `Injector` 的需要实例化。

In the following code snippet, `heroesService` is a downgraded Angular service that we are
accessing from AngularJS.

在以下代码片段中，`heroesService` 是我们从 AngularJS 访问的降级 Angular 服务。

Here is the example application and its unit tests that use `createAngularTestingModule`
and `createAngularJSTestingModule`.

这是使用 `createAngularTestingModule` 和 `createAngularJSTestingModule`
的示例应用程序及其单元测试。
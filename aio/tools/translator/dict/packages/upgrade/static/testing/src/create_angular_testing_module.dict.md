a collection of the names of AngularJS modules to include in the
configuration.

要包含在配置中的 AngularJS 模块名称的集合。

whether the AngularJS injector should have `strictDI` enabled.

AngularJS 注入器是否应该启用 `strictDI`。

A helper function to use when unit testing Angular services that depend upon upgraded AngularJS
services.

单元测试依赖于升级后的 AngularJS 服务的 Angular 服务时要使用的帮助器函数。

This function returns an `NgModule` decorated class that is configured to wire up the Angular
and AngularJS injectors without the need to actually bootstrap a hybrid application.
This makes it simpler and faster to unit test services.

此函数返回一个 `NgModule` 装饰类，该类被配置为连接 Angular 和 AngularJS
注入器，而无需实际引导混合应用程序。这使得单元测试服务变得更简单、更快。

Use the returned class as an "import" when configuring the `TestBed`.

配置 `TestBed` 时，使用返回的类作为“导入”。

In the following code snippet, we are configuring the TestBed with two imports.
The `Ng2AppModule` is the Angular part of our hybrid application and the `ng1AppModule` is the
AngularJS part.

在以下代码片段中，我们使用两个导入配置 TestBed。`Ng2AppModule` 是我们混合应用程序的 Angular
部分，而 `ng1AppModule` 是 AngularJS 部分。

Once this is done we can get hold of services via the Angular `Injector` as normal.
Services that are \(or have dependencies on\) an upgraded AngularJS service, will be instantiated
as needed by the AngularJS `$injector`.

完成后，我们可以像往常一样通过 Angular `Injector` 获取服务。作为（或依赖于）升级后的 AngularJS
服务的服务，将根据 AngularJS `$injector` 的需要实例化。

In the following code snippet, `HeroesService` is an Angular service that depends upon an
AngularJS service, `titleCase`.

在以下代码片段中，`HeroesService` 是一项依赖于 AngularJS 服务 `titleCase` 的 Angular 服务。

Here is the example application and its unit tests that use `createAngularTestingModule`
and `createAngularJSTestingModule`.

这是使用 `createAngularTestingModule` 和 `createAngularJSTestingModule`
的示例应用程序及其单元测试。
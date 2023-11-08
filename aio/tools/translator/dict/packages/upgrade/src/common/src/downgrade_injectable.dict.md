A helper function to allow an Angular service to be accessible from AngularJS.

允许从 AngularJS 访问 Angular 服务的帮助器函数。

*Part of the [upgrade/static](api?query=upgrade%2Fstatic)
library for hybrid upgrade apps that support AOT compilation*

*支持 AOT 编译的混合升级应用程序的[upgrade/静态](api?query=upgrade%2Fstatic)库的一部分*

This helper function returns a factory function that provides access to the Angular
service identified by the `token` parameter.

此帮助器函数返回一个工厂函数，该函数提供对 `token` 参数标识的 Angular 服务的访问。

Examples

例子

First ensure that the service to be downgraded is provided in an `NgModule`
that will be part of the upgrade application. For example, let's assume we have
defined `HeroesService`

首先确保要降级的服务在将作为升级应用程序的一部分的 `NgModule` 中提供。例如，假设我们已经定义
`HeroesService`

{&commat;example upgrade/static/ts/full/module.ts region="ng2-heroes-service"}



and that we have included this in our upgrade app `NgModule`

并且我们已经将其包含在我们的升级应用程序 `NgModule` 中

{&commat;example upgrade/static/ts/full/module.ts region="ng2-module"}



Now we can register the `downgradeInjectable` factory function for the service
on an AngularJS module.

现在我们可以为 AngularJS 模块上的服务注册 `downgradeInjectable` 工厂函数。

{&commat;example upgrade/static/ts/full/module.ts region="downgrade-ng2-heroes-service"}



Inside an AngularJS component's controller we can get hold of the
downgraded service via the name we gave when downgrading.

在 AngularJS 组件的控制器中，我们可以通过我们在降级时提供的名称来获取降级后的服务。

{&commat;example upgrade/static/ts/full/module.ts region="example-app"}



an `InjectionToken` that identifies a service provided from Angular.

一个 `InjectionToken`，用于标识 Angular 提供的服务。

the name of the downgraded module \(if any\) that the injectable
"belongs to", as returned by a call to `downgradeModule()`. It is the module, whose injector will
be used for instantiating the injectable.<br />
\(This option is only necessary when using `downgradeModule()` to downgrade more than one Angular
module.\)

可注入“属于”的降级模块的名称（如果有），由对 `downgradeModule()`
的调用返回。它是模块，其注入器将用于实例化可注入。<br />（仅在使用 `downgradeModule()` 降级多个
Angular 模块时才需要此选项。）

a [factory function](https://docs.angularjs.org/guide/di) that can be
used to register the service on an AngularJS module.

一个[工厂函数](https://docs.angularjs.org/guide/di)，可用于在 AngularJS 模块上注册服务。
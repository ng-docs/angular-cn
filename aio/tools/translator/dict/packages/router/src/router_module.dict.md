The directives defined in the `RouterModule`.

`RouterModule` 中定义的指令。

Adds directives and providers for in-app navigation among views defined in an application.
Use the Angular `Router` service to declaratively specify application states and manage state
transitions.

添加指令和提供者，以便在应用程序中定义的视图之间进行应用内导航。使用 Angular `Router` 服务以声明方式指定应用程序状态并管理状态转换。

You can import this NgModule multiple times, once for each lazy-loaded bundle.
However, only one `Router` service can be active.
To ensure this, there are two ways to register routes when importing this module:

你可以多次导入此 NgModule，对于每个惰性加载的包导入一次。但是，只能有一个 `Router` 服务是活动的。为确保这一点，在导入此模块时有两种方法来注册路由：

The `forRoot()` method creates an `NgModule` that contains all the directives, the given
routes, and the `Router` service itself.

`forRoot()` 方法会创建一个 `NgModule`，其中包含所有指令、给定的路由以及 `Router` 服务本身。

The `forChild()` method creates an `NgModule` that contains all the directives and the given
routes, but does not include the `Router` service.

`forChild()` 方法会创建一个 `NgModule`，其中包含所有指令和给定的路由，但不包括 `Router` 服务。

[Routing and Navigation guide](guide/router) for an
overview of how the `Router` service should be used.

[路由和导航指南](guide/router)，概述了应如何使用 `Router` 服务。

An array of `Route` objects that define the navigation paths for the application.

`Route` 对象的数组，这些对象定义应用程序的导航路径。

An `ExtraOptions` configuration object that controls how navigation is performed.

一个 `ExtraOptions` 配置对象，该对象会控制如何执行导航。

The new `NgModule`.

新的 `NgModule`。

Creates and configures a module with all the router providers and directives.
Optionally sets up an application listener to perform an initial navigation.

带着所有路由器提供者和指令创建和配置模块。（可选）设置应用程序监听器以执行初始导航。

When registering the NgModule at the root, import as follows:

在根目录下注册 NgModule 时，请按以下方式导入：

An array of `Route` objects that define the navigation paths for the submodule.

`Route` 对象的数组，它们定义了子模块的导航路径。

The new NgModule.

新的 NgModule。

Creates a module with all the router directives and a provider registering routes,
without creating a new Router service.
When registering for submodules and lazy-loaded submodules, create the NgModule as follows:

创建带有所有路由器指令和提供者注册的路由的模块，而无需创建新的路由器服务。注册子模块和惰性加载的子模块时，像这样创建 NgModule：

For internal use by `RouterModule` only. Note that this differs from `withInMemoryRouterScroller`
because it reads from the `ExtraOptions` which should not be used in the standalone world.

仅供 `RouterModule` 内部使用。请注意，这与 `withInMemoryRouterScroller` 不同，因为它从不应在独立世界中使用的 `ExtraOptions` 读取。

A [DI token](guide/glossary/#di-token) for the router initializer that
is called after the app is bootstrapped.

一个代表路由器初始化器的令牌，应用引导完毕后就会调用它。
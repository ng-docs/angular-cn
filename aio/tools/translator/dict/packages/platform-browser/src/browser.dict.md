`ApplicationConfig` has moved, please import `ApplicationConfig` from `@angular/core` instead.

`ApplicationConfig` 已移动，请改为从 `@angular/core` 导入 `ApplicationConfig`。

Set of config options available during the application bootstrap operation.

在引导操作期间通过 `bootstrapApplication` 调用可用的一组配置选项。

The root component passed into this function *must* be a standalone one \(should have the
`standalone: true` flag in the `@Component` decorator config\).

传递给此函数的根组件*必须*是独立的（在 `@Component` 装饰器配置中应该有 `standalone: true` 标志）。

You can add the list of providers that should be available in the application injector by
specifying the `providers` field in an object passed as the second argument:

你可以通过在作为第二个参数传递的对象中指定 `providers` 字段来添加应用程序注入器中应该可用的提供者列表：

The `importProvidersFrom` helper method can be used to collect all providers from any
existing NgModule \(and transitively from all NgModules that it imports\):

`importProvidersFrom` 帮助器方法可用于从任何现有的 NgModule （并且从它导入的所有 NgModule 中传递）收集所有提供者：

Note: the `bootstrapApplication` method doesn't include [Testability](api/core/Testability) by
default. You can add [Testability](api/core/Testability) by getting the list of necessary
providers using `provideProtractorTestingSupport()` function and adding them into the `providers`
array, for example:

注意：默认情况下，`bootstrapApplication` 方法不包含[Testability](api/core/Testability)。你可以通过使用 `provideProtractorTestingSupport()` 函数获取必要的提供程序列表并将它们添加到 `providers` 数组中来添加[Testability](api/core/Testability)，例如：

A reference to a standalone component that should be rendered.

对应该渲染的独立组件的引用。

Extra configuration for the bootstrap operation, see `ApplicationConfig` for
    additional info.

可选值。默认值为 `undefined`。

A promise that returns an `ApplicationRef` instance once resolved.

一个承诺，一旦解决就返回一个 `ApplicationRef` 实例。

Bootstraps an instance of an Angular application and renders a standalone component as the
application's root component. More information about standalone components can be found in [this
guide](guide/standalone-components).

引导 Angular 应用程序的实例，并将独立组件渲染为应用程序的根组件。有关独立组件的更多信息，请参阅[本指南](guide/standalone-components)。

Extra configuration for the application environment, see `ApplicationConfig` for
    additional info.

可选值。默认值为 `undefined`。

Create an instance of an Angular application without bootstrapping any components. This is useful
for the situation where one wants to decouple application environment creation \(a platform and
associated injectors\) from rendering components on a screen. Components can be subsequently
bootstrapped on the returned `ApplicationRef`.

在不引导任何组件的情况下创建 Angular 应用程序的实例。这对于希望将应用程序环境创建（平台和关联的注入器）与屏幕上的渲染组件解耦的情况很有用。随后可以在返回的 `ApplicationRef` 上引导组件。

An array of providers required to setup Testability for an application and make it
    available for testing using Protractor.

为应用程序设置可测试性并使其可用于使用 Protractor 进行测试所需的一组提供程序。

Returns a set of providers required to setup [Testability](api/core/Testability) for an
application bootstrapped using the `bootstrapApplication` function. The set of providers is
needed to support testing an application with Protractor \(which relies on the Testability APIs
to be present\).

返回使用 `bootstrapApplication` 函数引导的应用程序设置[Testability](api/core/Testability)所需的一组提供程序。需要这组提供者来支持使用 Protractor（依赖于存在的 Testability API）测试应用程序。

A factory function that returns a `PlatformRef` instance associated with browser service
providers.

一个工厂函数，它返回与浏览器服务提供者关联的 `PlatformRef` 实例。

Internal marker to signal whether providers from the `BrowserModule` are already present in DI.
This is needed to avoid loading `BrowserModule` providers twice. We can't rely on the
`BrowserModule` presence itself, since the standalone-based bootstrap just imports
`BrowserModule` providers without referencing the module itself.

用于指示来自 `BrowserModule` 的提供程序是否已存在于 DI 中的内部标记。这是为了避免两次加载 `BrowserModule` 提供程序所必需的。我们不能依赖 `BrowserModule` 存在本身，因为基于独立的引导程序只是导入 `BrowserModule` 提供者而不引用模块本身。

Exports required infrastructure for all Angular apps.
Included by default in all Angular apps created with the CLI
`new` command.
Re-exports `CommonModule` and `ApplicationModule`, making their
exports and providers available to all apps.

导出所有 Angular 应用都需要的基础设施。默认包含在用 CLI 的 `new` 命令创建的所有 Angular 应用中。它二次导出了 `CommonModule` 和 `ApplicationModule`，以便它们的导出物和提供者能用于所有应用中。

An object containing an identifier for the app to transition.
The ID must match between the client and server versions of the app.

包含要迁移的应用 id 的对象。在应用的客户端版本和服务端版本中这个 ID 必须匹配。

The reconfigured `BrowserModule` to import into the app's root `AppModule`.

重新配置的 `BrowserModule` 导入到应用程序的根 `AppModule` 中。

Use {&commat;link APP_ID} instead to set the application ID.

请改用 {&commat;link APP_ID} 来设置应用程序 ID。

Configures a browser-based app to transition from a server-rendered app, if
one is present on the page.

配置基于浏览器的应用，使其可以从当前页面上的服务端渲染（SSR）应用过渡而来。指定的参数必须包含一个应用 id，在客户端应用和服务端应用之间它必须一致。
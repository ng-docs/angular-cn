Deprecated APIs and features

已弃用的 API 和特性

Angular strives to balance innovation and stability.
Sometimes, APIs and features become obsolete and need to be removed or replaced so that Angular can stay current with new best practices, changing dependencies, or changes in the \(web\) platform itself.

Angular 力图兼顾创新与稳定。但有时，API 和特性已经过时，需要进行删除或替换，以便 Angular 可以及时跟上新的最佳实践、依赖项变更或者 Web 平台自身的变化。

To make these transitions as easy as possible, APIs and features are deprecated for a period of time before they are removed.
This gives you time to update your applications to the latest APIs and best practices.

为了使这些转换尽可能简单，API 和特性在被删除之前会被弃用一段时间。这让你有时间将应用程序更新到最新的 API 和最佳实践。

This guide contains a summary of noteworthy Angular APIs and features that are currently deprecated.
See the [full changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md) for
comprehensive details on deprecations and breaking changes.

本指南包含了当前已弃用的重要 Angular API 和特性的汇总表。参见[完整的变更记录](https://github.com/angular/angular/blob/main/CHANGELOG.md)来更全面地了解这些弃用的详情和重大变更。

Index

索引

To help you future-proof your projects, the following table lists all deprecated APIs and features, organized by the release in which they are candidates for removal.
Each item is linked to the section later in this guide that describes the deprecation reason and replacement options.

为帮助你的项目面向未来，下表列出了所有已弃用的 API 和特性，并按它们将被移除的候选版本进行组织。每个项目都链接到本指南后面描述弃用原因和替换选项的部分。

Deprecated features that can be removed in v11 or later

可以在 v11 或更高版本中删除的已弃用特性

template syntax

模板语法

[`<template>`](#template-tag)

[`<template>`](#template-tag)

v7

v7

v11

v11

polyfills

腻子脚本

[reflect-metadata](#reflect-metadata)

[reflect-metadata](#reflect-metadata)

v8

v8

[`setAngularLib`](#upgrade-static)



[`getAngularLib`](#upgrade-static)



[`@angular/upgrade`](#upgrade)



[`ngModel` with reactive forms](#ngmodel-reactive)

[与响应式表单一起使用的 `ngModel`](#ngmodel-reactive)

v6

v6

[`ANALYZE_FOR_ENTRY_COMPONENTS`](#core)



v9

v9

[`entryComponents`](api/core/NgModule)

[`entryComponents`](api/core/NgModule)

[`defineInjectable`](#core)



[`DefaultIterableDiffer`](#core)



Area

特性区

API or Feature

API 或特性

Deprecated in

已弃用于

May be removed in

可能会移除于

Deprecated features that can be removed in v12 or later

可以在 v12 或更高版本中删除的已弃用特性

[`async`](#testing)



v12



[`TestBed.get`](#testing)



Deprecated features that can be removed in v14 or later

可以在 v14 或更高版本中删除的已弃用特性

[`FormBuilder.group` legacy options parameter](api/forms/FormBuilder#group)

[`FormBuilder.group` 旧版 options 参数](api/forms/FormBuilder#group)

v14

v14

Deprecated features that can be removed in v15 or later

可以在 v15 或更高版本中删除的已弃用特性

[`bind-`, `on-`, `bindon-`, and `ref-`](#bind-syntax)

[`bind-`, `on-`, `bindon-`, and `ref-`](#bind-syntax)

v13

v13

v15

v15

[Factory-based signature of `downgradeModule`](#upgrade-static)

[`downgradeModule` 的基于工厂的签名](#upgrade-static)

[Factory-based signature of `ViewContainerRef.createComponent`](api/core/ViewContainerRef#createComponent)

[`ViewContainerRef.createComponent` 的基于工厂的签名](api/core/ViewContainerRef#createComponent)

[`PlatformRef.bootstrapModuleFactory`](#core)



[Factory-based signature of `ApplicationRef.bootstrap`](#core)

[`ApplicationRef.bootstrap` 的基于工厂的签名](#core)

[`fullTemplateTypeCheck`](#full-template-type-check)



[Input setter coercion](#input-setter-coercion)

[输入属性 Setter 类型转换](#input-setter-coercion)

Deprecated features that can be removed in v16 or later

可以在 v16 或更高版本中删除的已弃用特性

[`SwUpdate#available`](api/service-worker/SwUpdate#available)

[`SwUpdate#available`](api/service-worker/SwUpdate#available)

v16

v16

[`SwUpdate#activated`](api/service-worker/SwUpdate#activated)

[`SwUpdate#activated`](api/service-worker/SwUpdate#activated)

[`ServerTransferStateModule`](#platform-server)



[`RESOURCE_CACHE_PROVIDER`](#platform-browser-dynamic)



[`JitCompilerFactory`](#platform-browser-dynamic)



[`CompilerOptions.useJit and CompilerOptions.missingTranslation config options`](#core)



[`ComponentFactoryResolver`](#core)



[`ComponentFactory`](#core)



[`NgModuleFactory`](#core)



[`CompilerFactory`](#core)



[`Compiler`](#core)



[`ModuleWithComponentFactories`](#core)



[`getModuleFactory`](#core)



[`TestRequest` accepting `ErrorEvent` for error simulation](#testrequest-errorevent)

[`TestRequest` 接受 `ErrorEvent` 进行错误模拟](#testrequest-errorevent)

Deprecated features that can be removed in v17 or later

可以在 v17 或更高版本中删除的已弃用特性

[class and `InjectionToken` guards and resolvers](#router-class-and-injection-token-guards)

[类和 `InjectionToken` 守卫和解析器](#router-class-and-injection-token-guards)

v15.2

v15.2

v17



[Router CanLoad guards](#router-can-load)

[路由器 CanLoad 守卫](#router-can-load)

v15.1

v15.1

[Router writeable properties](#router-writable-properties)

[路由器可写属性](#router-writable-properties)

[`RouterLinkWithHref` directive](#router)

[`RouterLinkWithHref` 指令](#router)

[`@Component.moduleId`](api/core/Component#moduleId)

[`@Component.moduleId`](api/core/Component#moduleId)

NgModule and `'any'` options for [`providedIn`](#core)

用于 [`providedIn`](#core) 中的 NgModule 和 `'any'` 选项

[`DatePipe` - `DATE_PIPE_DEFAULT_TIMEZONE`](api/common/DATE_PIPE_DEFAULT_TIMEZONE)

[`DatePipe` - `DATE_PIPE_DEFAULT_TIMEZONE`](api/common/DATE_PIPE_DEFAULT_TIMEZONE)

[`NgComponentOutlet.ngComponentOutletNgModuleFactory`](#common)



Deprecated features that can be removed in v18 or later

将会在 v18 或更高版本中删除的已弃用功能

[`makeStateKey`, `StateKey` and `TransferState`](#platform-browser), symbols were moved to `@angular/core`

[`makeStateKey`，`StateKey` 和 `TransferState`](#platform-browser)，符号被移动到 `@angular/core`

v18

v18

[`BrowserModule.withServerTransition`](api/platform-browser/BrowserModule#withservertransition)

[`BrowserModule.withServerTransition`](api/platform-browser/BrowserModule#withservertransition)

[`platformDynamicServer`](api/platform-server/platformDynamicServer)

[`platformDynamicServer`](api/platform-server/platformDynamicServer)

[`PlatformConfig.baseUrl` and `PlatformConfig.useAbsoluteUrl` config options](api/platform-server/PlatformConfig)

[`PlatformConfig.baseUrl` and `PlatformConfig.useAbsoluteUrl` config options](api/platform-server/PlatformConfig)

`isPlatformWorkerApp` and `isPlatformWorkerUi`

`isPlatformWorkerApp` 和 `isPlatformWorkerUi`

Deprecated features with no planned removal version

没有计划删除版本的过时特性

[`/deep/`, `>>>`, and `::ng-deep`](#deep-component-style-selector)

[`/deep/`, `>>>`, and `::ng-deep`](#deep-component-style-selector)

unspecified

unspecified

For information about Angular Component Development Kit \(CDK\) and Angular Material deprecations, see the [changelog](https://github.com/angular/components/blob/main/CHANGELOG.md).

有关 Angular 组件开发工具包（CDK）和 Angular Material 弃用的信息，请参阅[更改日志](https://github.com/angular/components/blob/main/CHANGELOG.md)。

Deprecated APIs

已弃用的 API

This section contains a complete list all deprecated APIs, with details to help you plan your migration to a replacement.

本节包含所有已弃用的 API 的完整列表，以及可帮助你计划迁移到替代方案的详细信息。

<a id="common"></a>



&commat;angular/common



None

没了

These two functions have no purpose since the removal of the webworker platform \(they only return `false`\). They can be safely removed.

这两个函数在移除 webworker 平台后就没有用了（它们只返回 `false` ）。它们可以安全地移除。

Use the `DATE_PIPE_DEFAULT_OPTIONS` injection token, which can configure multiple settings at once instead.

使用 `DATE_PIPE_DEFAULT_OPTIONS` 注入令牌，它可以改为一次配置多个设置。

[`NgComponentOutlet.ngComponentOutletNgModuleFactory`](api/common/NgComponentOutlet)

[`NgComponentOutlet.ngComponentOutletNgModuleFactory`](api/common/NgComponentOutlet)

Use the `ngComponentOutletNgModule` input instead. This input doesn't require resolving NgModule factory.

改用 `ngComponentOutletNgModule` 输入。此输入不需要解析 NgModule 工厂。

Replacement

替代品

Deprecation announced

已宣布弃用

Details

详情

<a id="core"></a>



&commat;angular/core



none

没了

[`EnvironmentInjector.runInContext`](api/core/EnvironmentInjector#runInContext)

[`EnvironmentInjector.runInContext`](api/core/EnvironmentInjector#runInContext)

`runInInjectionContext` is a more flexible operation which supports element injectors as well

`runInInjectionContext` 是一种更灵活的操作，它也支持元素注入器

[`providedIn: 'any'`](api/core/Injectable#providedIn)

[`providedIn: 'any'`](api/core/Injectable#providedIn)

This option has confusing semantics and nearly zero usage.

该选项具有容易混淆的语义，并且几乎没人用过。

[`providedIn`](api/core/Injectable#providedIn) with NgModule

使用 NgModule 的 [`providedIn`](api/core/Injectable#providedIn)

Prefer `'root'` providers, or use NgModule `providers` if scoping to an NgModule is necessary

建议改用 `'root'` 提供者，如果必须使用，则使用 NgModule 中的 `providers` 来定义

[`CompilerOptions.useJit and CompilerOptions.missingTranslation config options`](api/core/CompilerOptions)

[`CompilerOptions.useJit and CompilerOptions.missingTranslation config options`](api/core/CompilerOptions)

Since Ivy, those config options are unused, passing them has no effect.

由于 Ivy，这些配置选项未使用，传递它们是没有效果的。

[`ComponentFactoryResolver`](api/core/ComponentFactoryResolver)

[`ComponentFactoryResolver`](api/core/ComponentFactoryResolver)

Use non-factory based framework APIs.

使用不基于工厂的框架 API。

Since Ivy, Component factories are not required, thus there is no need to resolve them.

由于 Ivy，不需要组件工厂，因此无需解析它们。

[`ComponentFactory`](api/core/ComponentFactory)

[`ComponentFactory`](api/core/ComponentFactory)

Since Ivy, Component factories are not required. Angular provides other APIs where Component classes can be used directly.

从 Ivy 开始，就不需要组件工厂。Angular 提供了其他可以直接使用组件类的 API。

[Type-based signature of `ViewContainerRef.createComponent`](api/core/ViewContainerRef#createComponent)

[`ViewContainerRef.createComponent` 的基于类型的签名](api/core/ViewContainerRef#createComponent)

Angular no longer requires component factories to dynamically create components. Use different signature of the `createComponent` method, which allows passing Component class directly.

Angular 不再需要组件工厂动态创建组件。使用 `createComponent` 方法的不同签名，该方法允许直接传递 Component 类。

[`NgModuleFactory`](api/core/NgModuleFactory)

[`NgModuleFactory`](api/core/NgModuleFactory)

Use non-factory based framework APIs like [PlatformRef.bootstrapModule](api/core/PlatformRef#bootstrapModule) and [createNgModule](api/core/createNgModule)

使用不基于工厂的框架 API，例如 [PlatformRef.bootstrapModule](api/core/PlatformRef#bootstrapModule) 和 [createNgModule](api/core/createNgModule)

Ivy JIT mode doesn't require accessing this symbol. See [JIT API changes due to ViewEngine deprecation](#jit-api-changes) for additional context.

Ivy JIT 模式不需要访问此符号。有关其他上下文，参阅[由于 ViewEngine 弃用导致的 JIT API 更改](#jit-api-changes)。

[`CompilerFactory`](api/core/CompilerFactory)

[`CompilerFactory`](api/core/CompilerFactory)

[`Compiler`](api/core/Compiler)

[`Compiler`](api/core/Compiler)

[`ModuleWithComponentFactories`](api/core/ModuleWithComponentFactories)

[`ModuleWithComponentFactories`](api/core/ModuleWithComponentFactories)

[`PlatformRef.bootstrapModuleFactory`](api/core/PlatformRef#bootstrapModuleFactory)

[`PlatformRef.bootstrapModuleFactory`](api/core/PlatformRef#bootstrapModuleFactory)

[`PlatformRef.bootstrapModule`](api/core/PlatformRef#bootstrapModule)

[`PlatformRef.bootstrapModule`](api/core/PlatformRef#bootstrapModule)

With Ivy, there is no need to resolve NgModule factory and NgModule Type can be provided directly.

有了 ivy，就不需要解析 NgModule factory，直接提供 NgModule Type 即可。

Factory-based signature of [`ApplicationRef.bootstrap`](api/core/ApplicationRef#bootstrap)

[`ApplicationRef.bootstrap`](api/core/ApplicationRef#bootstrap)的基于工厂的签名

Type-based signature of [`ApplicationRef.bootstrap`](api/core/ApplicationRef#bootstrap)

[`ApplicationRef.bootstrap`](api/core/ApplicationRef#bootstrap)的基于类型的签名

With Ivy, there is no need to resolve Component factory and Component Type can be provided directly.

有了 ivy，不需要解析 Component factory，直接提供 Component Type 即可。

`ViewChildren.emitDistinctChangesOnly` / `ContentChildren.emitDistinctChangesOnly`

`ViewChildren.emitDistinctChangesOnly` / `ContentChildren.emitDistinctChangesOnly`

none \(was part of [issue #40091](https://github.com/angular/angular/issues/40091)\)

无（是[问题 #40091](https://github.com/angular/angular/issues/40091)的一部分）

This is a temporary flag introduced as part of bug fix of [issue #40091](https://github.com/angular/angular/issues/40091) and will be removed.

这是作为[问题 #40091](https://github.com/angular/angular/issues/40091)的错误修复的一部分引入的临时标志，将被删除。

[`getModuleFactory`](api/core/getModuleFactory)

[`getModuleFactory`](api/core/getModuleFactory)

[`getNgModuleById`](api/core/getNgModuleById)

[`getNgModuleById`](api/core/getNgModuleById)

Ivy allows working with NgModule classes directly, without retrieving corresponding factories.

Ivy 允许直接使用 NgModule 类，而无需检索相应的工厂。

[`async`](api/core/testing/async)

[`async`](api/core/testing/async)

[`waitForAsync`](api/core/testing/waitForAsync)

[`waitForAsync`](api/core/testing/waitForAsync)

The [`async`](api/core/testing/async) function from `@angular/core/testing` has been renamed to `waitForAsync` in order to avoid confusion with the native JavaScript `async` syntax. The existing function is deprecated and can be removed in a future version.

`@angular/core/testing` 中的[`async`](api/core/testing/async)函数已重命名为 `waitForAsync`，以避免与原生 JavaScript `async` 语法混淆。现有的函数已被弃用，可以在未来的版本中删除。

See [`ANALYZE_FOR_ENTRY_COMPONENTS`](#entryComponents)

See [`ANALYZE_FOR_ENTRY_COMPONENTS`](#entryComponents)

See [`entryComponents`](#entryComponents)

参见 [`entryComponents`](#entryComponents)

[`defineInjectable`](api/core/defineInjectable)

[`defineInjectable`](api/core/defineInjectable)

Used only in generated code. No source code should depend on this API.

仅在生成的代码中使用。任何源代码都不应依赖此 API。

[`DefaultIterableDiffer`](api/core/DefaultIterableDiffer)

[`DefaultIterableDiffer`](api/core/DefaultIterableDiffer)

n/a

不适用

v4

v4

Not part of public API.

不再是公共 API。

<a id="testing"></a>



&commat;angular/core/testing



v10

v10

Same behavior, but rename to avoid confusion.

行为相同，只是改名以免混淆。

[`TestBed.get`](api/core/testing/TestBed#get)

[`TestBed.get`](api/core/testing/TestBed#get)

[`TestBed.inject`](api/core/testing/TestBed#inject)

[`TestBed.inject`](api/core/testing/TestBed#inject)

Same behavior, but type safe.

行为没变，但类型安全。

<a id="router"></a>



&commat;angular/router



[class and `InjectionToken` guards and resolvers](api/router/DeprecatedGuard)

[类和 `InjectionToken` 守卫和解析器](api/router/DeprecatedGuard)

Use plain JavaScript functions instead.

请改用纯 JavaScript 函数。

Functional guards are simpler and more powerful than class and token-based guards.

函数式守卫比基于类和令牌的守卫更简单、更强大。

[`setupTestingRouter` function](api/router/testing/setupTestingRouter)

[`setupTestingRouter` 函数](api/router/testing/setupTestingRouter)

Use `provideRouter` or `RouterModule` instead.

请改用 `provideRouter` 或 `RouterModule`。

The `setupTestingRouter` function is not necessary. The `Router` is initialized based on the DI configuration in tests as it would be in production.

`setupTestingRouter` 函数不是必需的。`Router` 根据测试中的 DI 配置进行初始化，就像在生产中一样。

[`provideRoutes` function](api/router/provideRoutes)

[`provideRoutes` 函数](api/router/provideRoutes)

Use `ROUTES` `InjectionToken` instead.

改用 `ROUTES` `InjectionToken`。

The `provideRoutes` helper function is minimally useful and can be unintentionally used instead of `provideRouter` due to similar spelling.

`provideRoutes` 这个帮助器函数的用处很小，由于和 `provideRouter` 拼写相似，可能会无意间用错。

[`RouterLinkWithHref` directive](api/router/RouterLinkWithHref)

[`RouterLinkWithHref` 指令](api/router/RouterLinkWithHref)

Use `RouterLink` instead.

改用 `RouterLink`。

The `RouterLinkWithHref` directive code was merged into `RouterLink`. Now the `RouterLink` directive can be used for all elements that have `routerLink` attribute.

`RouterLinkWithHref` 指令代码已合并到 `RouterLink` 中。现在，`RouterLink` 指令可用于所有具有 `routerLink` 属性的元素。

<a id="platform-browser"></a>



&commat;angular/platform-browser



`makeStateKey`, `StateKey` and `TransferState`

`makeStateKey` , `StateKey` 和 `TransferState`

Import from `@angular/core`.

从 `@angular/core` 导入。

v16.0

v16.0

Same behavior, but exported from a different package.

相同的行为，但从不同的包中导出。

No replacement needed.

无需更换。

The `APP_ID`token should be used instead to set the application ID.

应该使用 `APP_ID` 令牌来设置应用程序 ID。

<a id="platform-browser-dynamic"></a>



&commat;angular/platform-browser-dynamic



[`RESOURCE_CACHE_PROVIDER`](api/platform-browser-dynamic/RESOURCE_CACHE_PROVIDER)

[`RESOURCE_CACHE_PROVIDER`](api/platform-browser-dynamic/RESOURCE_CACHE_PROVIDER)

This was previously necessary in some cases to test AOT-compiled components with View Engine, but is no longer since Ivy.

以前，在某些情况下，要使用 View Engine 测试 AOT 编译的组件，这是必要的，但从 Ivy 开始就不再是这样了。

[`JitCompilerFactory`](api/platform-browser-dynamic/JitCompilerFactory)

[`JitCompilerFactory`](api/platform-browser-dynamic/JitCompilerFactory)

This symbol is no longer necessary. See [JIT API changes due to ViewEngine deprecation](#jit-api-changes) for additional context.

此符号不再需要。有关其他上下文，参阅[由于 ViewEngine 弃用导致的 JIT API 更改](#jit-api-changes)。

<a id="platform-server"></a>



&commat;angular/platform-server



Import `@angular/compiler` and replace the usage with `platformServer` instead.

导入 `@angular/compiler` 并用 `platformServer` 代替用法。

This is done to decrease the server bundle size for AOT builds.

这样做是为了减少 AOT 构建的服务器包大小。

This was previously unused.

这段代码以前未曾用过。

[`ServerTransferStateModule`](api/platform-server/ServerTransferStateModule)

[`ServerTransferStateModule`](api/platform-server/ServerTransferStateModule)

v14.1

v14.1

The `TransferState` class is available for injection without importing additional modules during server side rendering, when `ServerModule` is imported or `renderApplication` function is used for bootstrap.

当已导入 `ServerModule` 或 使用 `renderApplication` 函数进行引导时，`TransferState` 类无需导入额外的模块即在服务端渲染期间使用。

<a id="forms"></a>



&commat;angular/forms



[`AbstractControlOptions` parameter value](api/forms/AbstractControlOptions)

[`AbstractControlOptions` 参数值](api/forms/AbstractControlOptions)

[`FormControlDirective`](api/forms/FormControlDirective)

[`FormControlDirective`](api/forms/FormControlDirective)

<a id="service-worker"></a>



&commat;angular/service-worker



[`SwUpdate#versionUpdates`](api/service-worker/SwUpdate#versionUpdates)

[`SwUpdate#versionUpdates`](api/service-worker/SwUpdate#versionUpdates)

The behavior of `SwUpdate#available` can be rebuilt by filtering for `VersionReadyEvent` events on [`SwUpdate#versionUpdates`](api/service-worker/SwUpdate#versionUpdates)

可以通过过滤[`SwUpdate#versionUpdates`](api/service-worker/SwUpdate#versionUpdates)上的 `VersionReadyEvent` 事件来重建 `SwUpdate#available` 的行为

[`SwUpdate#activateUpdate()` return value](api/service-worker/SwUpdate#activateUpdate)

[`SwUpdate#activateUpdate()` 的返回值](api/service-worker/SwUpdate#activateUpdate)

The return value of `SwUpdate#activateUpdate()` indicates whether an update was successfully activated.

`SwUpdate#activateUpdate()` 的返回值指示更新是否成功激活。

<a id="upgrade"></a>



&commat;angular/upgrade



[All entry points](api/upgrade)

[所有入口点](api/upgrade)

[`@angular/upgrade/static`](api/upgrade/static)

[`@angular/upgrade/static`](api/upgrade/static)

v5

v5

See [Upgrading from AngularJS](guide/upgrade).

参阅[从 AngularJS 升级](guide/upgrade)。

<a id="upgrade-static"></a>



&commat;angular/upgrade/static



[Factory-based signature of `downgradeModule`](api/upgrade/static/downgradeModule)

[`downgradeModule` 的基于工厂的签名](api/upgrade/static/downgradeModule)

[NgModule-based signature of `downgradeModule`](api/upgrade/static/downgradeModule)

[`downgradeModule` 的基于 NgModule 的签名](api/upgrade/static/downgradeModule)

The `downgradeModule` supports more ergonomic NgModule-based API \(versus NgModule factory based API\).

`downgradeModule` 支持更符合人体工程学的基于 NgModule 的 API（与基于 NgModule 工厂的 API 相比）。

[`setAngularLib`](api/upgrade/static/setAngularLib)

[`setAngularLib`](api/upgrade/static/setAngularLib)

[`setAngularJSGlobal`](api/upgrade/static/setAngularJSGlobal)

[`setAngularJSGlobal`](api/upgrade/static/setAngularJSGlobal)

[`getAngularLib`](api/upgrade/static/getAngularLib)

[`getAngularLib`](api/upgrade/static/getAngularLib)

[`getAngularJSGlobal`](api/upgrade/static/getAngularJSGlobal)

[`getAngularJSGlobal`](api/upgrade/static/getAngularJSGlobal)

<a id="deprecated-features"></a>



Deprecated features

已弃用的特性

This section lists all deprecated features, which includes template syntax, configuration options, and any other deprecations not listed in the [Deprecated APIs](#deprecated-apis) section.
It also includes deprecated API usage scenarios or API combinations, to augment the information above.

本节列出了所有已弃用的特性，包括模板语法、配置选项以及“已弃用的[API](#deprecated-apis) ”部分中未列出的任何其他弃用。它还包括已弃用的 API 使用场景或 API 组合，以扩充上面的信息。

<a id="wtf"></a>



Web Tracing Framework integration

Web 跟踪框架集成

Angular previously supported an integration with the [Web Tracing Framework \(WTF\)](https://google.github.io/tracing-framework) for performance testing of Angular applications.
This integration has not been maintained and is now defunct.
As a result, the integration was deprecated in Angular version 8, and due to no evidence of any existing usage, removed in version 9.

Angular 以前支持与[Web 跟踪框架（WTF）](https://google.github.io/tracing-framework)集成，以对 Angular 应用程序进行性能测试。此集成未经维护，现已失效。因此，该集成在 Angular 版本 8 中被弃用，并且由于没有任何现有使用的证据，因此在版本 9 中被删除。

<a id="deep-component-style-selector"></a>



`/deep/`, `>>>`, and `::ng-deep` component style selectors

`/deep/` 、 `>>>` 和 `::ng-deep` 组件样式选择器

The shadow-dom-piercing descendant combinator is deprecated and support is being [removed from major browsers and tools](https://developers.google.com/web/updates/2017/10/remove-shadow-piercing).
As such, in v4, Angular's support for `/deep/`, `>>>`, and `::ng-deep` was deprecated.
Until removal, `::ng-deep` is preferred for broader compatibility with the tools.

不推荐使用 shadow-dom-piercing 后代组合器，并且正在[从主要浏览器和工具](https://developers.google.com/web/updates/2017/10/remove-shadow-piercing)中删除支持。因此，在 v4 中，已弃用 Angular 对 `/deep/` 、 `>>>` 和 `::ng-deep` 的支持。在删除之前，首选 `::ng-deep`，因为它与这些工具具有更广泛的兼容性。

For more information, see [/deep/, >>>, and ::ng-deep](guide/component-styles#deprecated-deep--and-ng-deep "Component Styles guide, Deprecated deep and ngdeep") in the Component Styles guide.

有关更多信息，参阅组件样式指南中的[/deep/、>>> 和 ::ng-deep](guide/component-styles#deprecated-deep--and-ng-deep "组件样式指南，已弃用 deep 和 ngdeep")。

<a id="bind-syntax"></a>



`bind-`, `on-`, `bindon-`, and `ref-` prefixes

`bind-` 、 `on-` 、 `bindon-` 和 `ref-` 前缀

The template prefixes `bind-`, `on-`, `bindon-`, and `ref-` have been deprecated in v13.
Templates should use the more widely documented syntaxes for binding and references:

模板前缀 `bind-` 、 `on-` 、 `bindon-` 和 `ref-` 在 v13 中已被弃用。模板应该使用更广为人知的语法进行绑定和引用：

`[input]="value"` instead of `bind-input="value"`

`[input]="value"` 代替 `bind-input="value"`

`[@trigger]="value"` instead of `bind-animate-trigger="value"`

`[@trigger]="value"` 代替 `bind-animate-trigger="value"`

`(click)="onClick()"` instead of `on-click="onClick()"`

`(click)="onClick()"` 代替 `on-click="onClick()"`

`[(ngModel)]="value"` instead of `bindon-ngModel="value"`

`[(ngModel)]="value"` 代替 `bindon-ngModel="value"`

`#templateRef` instead of `ref-templateRef`

`#templateRef` 代替 `ref-templateRef`

<a id="template-tag"></a>



`<template>` tag

`<template>` 标签

The `<template>` tag was deprecated in v4 to avoid colliding with a DOM element of the same name \(such as when using web components\).
Use `<ng-template>` instead.
For more information, see the [Ahead-of-Time Compilation](guide/aot-compiler) guide.

`<template>` 标签在 v4 中已被弃用，以避免与同名的 DOM 元素冲突（例如使用 Web 组件时）。改用 `<ng-template>`。有关更多信息，请参阅[Ahead-of-Time 编译](guide/aot-compiler)指南。

<a id="ngmodel-reactive"></a>



`ngModel` with reactive forms

和响应式表单一起使用 `ngModel`

Support for using the `ngModel` input property and `ngModelChange` event with reactive form directives has been deprecated in Angular v6 and can be removed in a future version of Angular.

在 Angular v6 中已不推荐把 `ngModel` 输入属性、`ngModelChange` 事件与响应式表单指令一起使用，并将在 Angular 的未来版本中删除。

Now deprecated:

现在已经弃用：

This support was deprecated for several reasons.
First, developers found this pattern confusing.
It seems like the actual `ngModel` directive is being used, but in fact it's an input/output property named `ngModel` on the reactive form directive that approximates some, but not all, of the directive's behavior.
It allows getting and setting a value and intercepting value events, but some  `ngModel` features, such as delaying updates with`ngModelOptions` or exporting the directive, don't work.

出于多种原因，此支持已被弃用。首先，开发人员发现这种模式令人困惑。似乎正在使用实际的 `ngModel` 指令，但实际上它是响应式表单指令上名为 `ngModel` 的输入/输出属性，它模拟了该指令的一些行为，但又不完全一样。它允许获取和设置值并拦截值事件，但 `ngModel` 的一些特性，比如使用 `ngModelOptions` 延迟更新或导出指令，不起作用。

In addition, this pattern mixes template-driven and reactive forms strategies, which prevents taking advantage of the full benefits of either strategy.
Setting the value in the template violates the template-agnostic principles behind reactive forms, whereas adding a `FormControl`/`FormGroup` layer in the class removes the convenience of defining forms in the template.

另外，该模式混用了模板驱动和响应式这两种表单策略，这会妨碍我们获取任何一种策略的全部优点。在模板中设置值的方式，也违反了响应式表单所遵循的“模板无关”原则；反之，在类中添加 `FormControl`/`FormGroup` 层也破坏了“在模板中定义表单”的约定。

To update your code before support is removed, decide whether to stick with reactive form directives \(and get/set values using reactive forms patterns\) or switch to template-driven directives.

要在删除支持之前更新你的代码，请决定是坚持使用响应式表单指令（以及使用响应式表单模式获取/设置值）或切换到模板驱动的指令。

**After** \(choice 1 - use reactive forms\):

**之后**（选择 1 - 使用响应式表单）：

**After** \(choice 2 - use template-driven forms\):

**之后**（选择 2 - 使用模板驱动表单）：

By default, when you use this pattern, you get a deprecation warning once in dev mode.
You can choose to silence this warning by configuring `ReactiveFormsModule` at import time:

默认情况下，当你使用此模式时，你会在开发模式下收到一次弃用警告。你可以选择通过在导入时配置 `ReactiveFormsModule` 来消除此警告：

Alternatively, you can choose to surface a separate warning for each instance of this pattern with a configuration value of `"always"`.
This may help to track down where in the code the pattern is being used as the code is being updated.

或者，你可以选择为该模式的每个实例显示一个单独的警告，配置值为 `"always"`。这可能有助于在更新代码时跟踪代码中使用模式的位置。

<a id="router-class-and-injection-token-guards"></a>



Router class and InjectionToken guards and resolvers

路由器类和 InjectionToken 守卫和解析器

Class and injection token guards and resolvers are deprecated. Instead, `Route`
objects should use functional-style guards and resolvers. Class-based guards can
be converted to functions by instead using `inject` to get dependencies.

类和注入令牌守卫和解析器已弃用。现在 `Route` 对象应该使用函数式风格的守卫和解析器。基于类的守卫可以通过使用 `inject` 来获取依赖项来转换为函数。

For testing a function `canActivate` guard, using `TestBed` and `TestBed.runInInjectionContext` is recommended.
Test mocks and stubs can be provided through DI with `{provide: X, useValue: StubX}`.
Functional guards can also be written in a way that's either testable with
`runInInjectionContext` or by passing mock implementations of dependencies.
For example:

为了测试函数式 `canActivate` 守卫，建议使用 `TestBed` 和 `TestBed.runInInjectionContext`。可以通过 DI 使用 `{provide: X, useValue: StubX}` 来提供测试模拟和存根。函数式守卫也可以用 `runInInjectionContext` 以可测试的方式或通过传递依赖项的模拟实现来编写。例如：

This deprecation only affects the support for class and
`InjectionToken` guards at the `Route` definition. `Injectable` classes
and `InjectionToken` providers are _not_ deprecated in the general
sense. That said, the interfaces like `CanActivate`,
`CanDeactivate`, etc. will be deleted in a future release of Angular. Simply removing the
`implements CanActivate` from the injectable class and updating the route definition
to be a function like `canActivate: [() => inject(MyGuard).canActivate()]` is sufficient
to get rid of the deprecation warning.

此弃用仅影响 `Route` 定义中对类和 `InjectionToken` 守卫的支持。`Injectable` 类和 `InjectionToken` 提供者在通常意义上**并没有**被弃用。也就是说，像 `CanActivate` 、 `CanDeactivate` 等接口将在 Angular 的未来版本中删除。只需从可注入类中删除 `implements CanActivate` 并将路由定义更新为类似 `canActivate: [() => inject(MyGuard).canActivate()]` 就足以消除弃用警告。

Functional guards are robust enough to even support the existing
class-based guards through a transform:

函数式守卫足够健壮，甚至可以通过转换来支持现有的基于类的守卫：

That is to say that guards can continue to be implemented as classes and then converted
to functions at the route definition.

也就是说守卫可以继续作为类实现，然后在路由定义处转为函数。

<a id="router-writable-properties"></a>



Public `Router` properties

`Router` 的公共属性

None of the public properties of the `Router` are meant to be writeable.
They should all be configured using other methods, all of which have been
documented.

`Router` 的所有公共属性都是不可写的。它们都应该使用其他方法进行配置，所有这些方法都有相应文档。

The following strategies are meant to be configured by registering the
application strategy in DI via the `providers` in the root `NgModule` or
`bootstrapApplication`:

以下策略旨在通过根 `NgModule` 或 `bootstrapApplication` 中的 `providers` 在 DI 中注册应用程序策略来配置：

The following options are meant to be configured using the options
available in `RouterModule.forRoot` or `provideRouter` and `withRouterConfig`.

以下选项旨在使用 `RouterModule.forRoot` 或 `provideRouter` 和 `withRouterConfig` 中可用的选项进行配置。

The following options are deprecated in entirely:

以下选项已完全弃用：

`malformedUriErrorHandler` - URI parsing errors should be handled in the `UrlSerializer` instead.

`malformedUriErrorHandler` - URI 解析错误应该在 `UrlSerializer` 中处理。

`errorHandler` - Subscribe to the `Router` events and filter for `NavigationError` instead.

`errorHandler` - 订阅 `Router` 事件并过滤 `NavigationError`。

<a id="router-can-load"></a>



`CanLoad` guards

`CanLoad` 守卫

`CanLoad` guards in the Router are deprecated in favor of `CanMatch`. These guards execute at the same time
in the lifecycle of a navigation. A `CanMatch` guard which returns false will prevent the `Route` from being
matched at all and also prevent loading the children of the `Route`. `CanMatch` guards can accomplish the same
goals as `CanLoad` but with the addition of allowing the navigation to match other routes when they reject
\(such as a wildcard route\). There is no need to have both types of guards in the API surface.

路由器中的 `CanLoad` 守卫已弃用，取而代之的是 `CanMatch`。这些守卫在导航的生命周期中同时执行。返回 `false` 的 `CanMatch` 守卫将完全阻止 `Route` 匹配，并且还会阻止加载 `Route` 的子级。`CanMatch` 守卫可以实现与 `CanLoad` 相同的目标，但允许导航在被拒绝时匹配其他路由（例如通配符路由）。公开 API 接口不需要同时拥有这两种类型的守卫。

<a id="loadChildren"></a>



`loadChildren` string syntax

`loadChildren` 字符串语法

When Angular first introduced lazy routes, there wasn't browser support for dynamically loading additional JavaScript.
Angular created its own scheme using the syntax `loadChildren: './lazy/lazy.module#LazyModule'` and built tooling to support it.
Now that ECMAScript dynamic import is supported in many browsers, Angular is moving toward this new syntax.

当 Angular 第一次引入惰性路由时，还没有浏览器能支持动态加载额外的 JavaScript。因此 Angular 使用语法 `loadChildren: './lazy/lazy.module#LazyModule'` 并且还构建了一些工具来支持它。现在，很多浏览器都已支持 ECMAScript 的动态导入，Angular 也正朝着这个新语法前进。

In version 8, the string syntax for the [`loadChildren`](api/router/LoadChildren) route specification was deprecated, in favor of new syntax that uses `import()` syntax.

在版本 8 中，已弃用 [`loadChildren`](api/router/LoadChildren) 路由规范的字符串语法，而是改用基于 `import()` 的新语法。

**Before**:

**之前**：

**After**:

**之后**：

<a id="reflect-metadata"></a>



Dependency on a reflect-metadata polyfill in JIT mode

JIT 模式下对反射元数据 polyfill 的依赖

Angular applications, and specifically applications that relied on the JIT compiler, used to require a polyfill for the [reflect-metadata](https://github.com/rbuckton/reflect-metadata) APIs.

Angular 应用程序，特别是依赖于 JIT 编译器的应用程序，过去常常需要 [reflect-metadata](https://github.com/rbuckton/reflect-metadata) API 的腻子脚本。

The need for this polyfill was removed in Angular version 8.0 \([see #14473](https://github.com/angular/angular-cli/pull/14473)\), rendering the presence of the polyfill in most Angular applications unnecessary.
Because the polyfill can be depended on by third-party libraries, instead of removing it from all Angular projects, we are deprecating the requirement for this polyfill as of version 8.0.
This should give library authors and application developers sufficient time to evaluate if they need the polyfill, and perform any refactoring necessary to remove the dependency on it.

在 Angular 8.0 版（[见#14473](https://github.com/angular/angular-cli/pull/14473)）中移除了对这个腻子脚本的需求，这将使得大多数 Angular 应用程序不再需要此腻子脚本。因为此腻子脚本可能被第三方库依赖，因此不能从所有 Angular 项目中删除它，我们从 8.0 版本开始弃用对这个腻子脚本的要求。这样可以给库作者和应用程序开发人员足够的时间来评估他们是否需要此腻子脚本，并执行任何必要的重构以消除对它的依赖。

In a typical Angular project, the polyfill is not used in production builds, so removing it should not impact production applications.
The goal behind this removal is overall simplification of the build setup and decrease in the number of external dependencies.

在典型的 Angular 项目中，这个腻子脚本不用于生产版本，因此删除它不会影响生产环境的应用程序。删除它是为了从整体上上简化构建设置并减少外部依赖项的数量。

<a id="static-query-resolution"></a>



`@ViewChild()` / `@ContentChild()` static resolution as the default

`@ViewChild()` / `@ContentChild()` 默认使用静态解析

See the [dedicated migration guide for static queries](guide/static-query-migration).

参阅[静态查询的专用迁移指南](guide/static-query-migration)。

<a id="contentchild-input-together"></a>



`@ContentChild()` / `@Input()` used together

`@ContentChild()` / `@Input()` 一起使用

The following pattern is deprecated:

以下模式已弃用：

Rather than using this pattern, separate the two decorators into their own
properties and add fallback logic as in the following example:

不要再使用此模式，而应该将这两个装饰器分离到它们各自的属性中并添加回退逻辑，如下例所示：

<a id="cant-assign-template-vars"></a>



Cannot assign to template variables

无法赋值给模板变量

In the following example, the two-way binding means that `optionName`
should be written when the `valueChange` event fires.

在以下示例中，双向绑定意味着应在 `valueChange` 事件触发时写入 `optionName`。

However, in practice, Angular ignores two-way bindings to template variables.
Starting in version 8, attempting to write to template variables is deprecated.
In a future version, we will throw to indicate that the write is not supported.

然而，在实践中，Angular 忽略了对模板变量的双向绑定。从版本 8 开始，不推荐对模板变量赋值。在未来的版本中，我们将抛出错误以指出不支持写入。

<a id="binding-to-innertext"></a>



Binding to `innerText` in `platform-server`

在 `platform-server` 中绑定到 `innerText`

[Domino](https://github.com/fgnass/domino), which is used in server-side rendering, doesn't support `innerText`, so in platform-server's *domino adapter*, there was special code to fall back to `textContent` if you tried to bind to `innerText`.

在服务端渲染中使用的 [Domino](https://github.com/fgnass/domino) 不支持 `innerText`，因此在平台服务器中的 “domino 适配器”中，如果尝试绑定到 `innerText`，则有一些特殊代码可以退回到 `textContent`。

These two properties have subtle differences, so switching to `textContent` under the hood can be surprising to users.
For this reason, we are deprecating this behavior.
Going forward, users should explicitly bind to `textContent` when using Domino.

这两个属性有细微的差别，因此在幕后切换到 `textContent` 可能会让用户感到惊讶。出于这个原因，我们弃用了这种行为。展望未来，用户应该在使用 Domino 时显式绑定到 `textContent`。

<a id="wtf-apis"></a>



`wtfStartTimeRange` and all `wtf*` APIs

`wtfStartTimeRange` 和所有 `wtf*` API

All of the `wtf*` APIs are deprecated and will be removed in a future version.

所有 `wtf*` API 均已弃用，并将在未来版本中删除。

<a id="entryComponents"></a>



`entryComponents` and `ANALYZE_FOR_ENTRY_COMPONENTS` no longer required

不再需要 `entryComponents` 和 `ANALYZE_FOR_ENTRY_COMPONENTS`

Previously, the `entryComponents` array in the `NgModule` definition was used to tell the compiler which components would be created and inserted dynamically.
With Ivy, this isn't a requirement anymore and the `entryComponents` array can be removed from existing module declarations.
The same applies to the `ANALYZE_FOR_ENTRY_COMPONENTS` injection token.

以前，`NgModule` 定义中的 `entryComponents` 数组用于告诉编译器将动态创建和插入哪些组件。使用 Ivy 后，这不再是必需的，并且可以从现有模块声明中删除 `entryComponents` 数组。这同样适用于 `ANALYZE_FOR_ENTRY_COMPONENTS` 注入令牌。

<a id="moduleWithProviders"></a>



`ModuleWithProviders` type without a generic

不带泛型的 `ModuleWithProviders` 类型

Some Angular libraries, such as `@angular/router` and `@ngrx/store`, implement APIs that return a type called `ModuleWithProviders` \(typically using a method named `forRoot()`\).
This type represents an `NgModule` along with additional providers.
Angular version 9 deprecates use of `ModuleWithProviders` without an explicitly generic type, where the generic type refers to the type of the `NgModule`.
In a future version of Angular, the generic will no longer be optional.

一些 Angular 库，比如 `@angular/router` 和 `@ngrx/store`，实现的 API 返回名为 ModuleWithProviders 的类型（通常使用名为 `ModuleWithProviders` `forRoot()` 的方法）。这种类型代表一个 `NgModule` 以及其他提供者。Angular 版本 9 已弃用没有明确泛型类型的 `NgModule` `ModuleWithProviders` 类型。在 Angular 的未来版本中，泛型将不再是可选的。

If you're using the CLI, `ng update` should [migrate your code automatically](guide/migration-module-with-providers).
If you're not using the CLI, you can add any missing generic types to your application manually.
For example:

如果你使用的是 CLI，则 `ng update` 应该[会自动迁移代码](guide/migration-module-with-providers)。如果没有使用 CLI，则可以将任何缺失的泛型类型手动添加到应用程序中。比如：

<a id="input-setter-coercion"></a>



Input setter coercion

输入 setter 强制类型转换

Since the `strictTemplates` flag has been introduced in Angular, the compiler has been able to type-check input bindings to the declared input type of the corresponding directive.
When a getter/setter pair is used for the input, the setter might need to accept more types than the getter returns, such as when the setter first converts the input value.
However, until TypeScript 4.3 a getter/setter pair was required to have identical types so this pattern could not be accurately declared.

由于在 Angular 中引入了 `strictTemplates` 标志，编译器已经能够根据相应指令的声明输入类型对输入绑定进行类型检查。当 “getter/setter 对”用于输入时，可能需要让 setter 接受比 getter 返回的类型更宽泛的类型集，比如当 setter 首次转换输入值时。然而，在 TypeScript 4.3 之前，需要 getter/setter 对具有相同的类型，因此无法准确地声明此模式。

To mitigate this limitation, it was made possible to declare [input setter coercion fields](guide/template-typecheck#input-setter-coercion) in directives that are used when type-checking input bindings.
However, since [TypeScript 4.3](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html#separate-write-types-on-properties) the limitation has been removed; setters can now accept a wider type than what is returned by the getter.
This means that input coercion fields are no longer needed, as their effects can be achieved by widening the type of the setter.

为了减轻这种限制，可以在对输入绑定进行类型检查时用到的指令中声明[输入 setter 强制类型转换字段](guide/template-typecheck#input-setter-coercion)。但是，从 [TypeScript 4.3](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html#separate-write-types-on-properties) 开始，此限制已被移除； setter 现在可以接受比 getter 返回的类型更宽泛的类型。这意味着不再需要输入强制类型转换字段，因为它们的效果可以通过拓宽 setter 的类型来实现。

For example, the following directive:

比如，以下指令：

can be refactored as follows:

可以重构如下：

<a id="full-template-type-check"></a>



When compiling your application using the AOT compiler, your templates are type-checked according to a certain strictness level.
Before Angular 9 there existed only two strictness levels of template type checking as determined by [the `fullTemplateTypeCheck` compiler option](guide/angular-compiler-options).
In version 9 the `strictTemplates` family of compiler options has been introduced as a more fine-grained approach to configuring how strict your templates are being type-checked.

使用 AOT 编译器编译你的应用程序时，你的模板会根据特定的严格级别进行类型检查。在 Angular 9 之前，[`fullTemplateTypeCheck` 编译器选项](guide/angular-compiler-options)只支持两个严格级别的模板类型检查。在版本 9 中引入了 `strictTemplates` 系列编译器选项，作为一种更细粒度的方法来配置模板的类型检查的严格程度。

The `fullTemplateTypeCheck` flag is being deprecated in favor of the new `strictTemplates` option and its related compiler options.
Projects that currently have `fullTemplateTypeCheck: true` configured can migrate to the following set of compiler options to achieve the same level of type-checking:

`fullTemplateTypeCheck` 标志已被弃用，取代它的是新的 `strictTemplates` 选项及其相关的编译器选项。当前已配置为 `fullTemplateTypeCheck: true` 的项目可以迁移到以下编译器选项集以实现相同级别的类型检查：

<a id="jit-api-changes"></a>



JIT API changes due to ViewEngine deprecation

由于 ViewEngine 弃用而导致的 JIT API 更改

In ViewEngine, [JIT compilation](/guide/glossary#jit) required special providers \(such as `Compiler` or `CompilerFactory`\) to be injected in the app and corresponding methods to be invoked.
With Ivy, JIT compilation takes place implicitly if the Component, NgModule, etc. have not already been [AOT compiled](/guide/glossary#aot).
Those special providers were made available in Ivy for backwards-compatibility with ViewEngine to make the transition to Ivy smoother.
Since ViewEngine is deprecated and will soon be removed, those symbols are now deprecated as well.

在 ViewEngine 中，[JIT 编译](/guide/glossary#jit)需要在应用程序中注入特殊的提供者（如 `Compiler`、`CompilerFactory` 等）并调用相应的方法。使用 Ivy，如果 Component、NgModule 等尚未进行 [AOT 编译](/guide/glossary#aot)，则 JIT 编译会隐式进行。这些特殊的提供者在 Ivy 中仍然可用，以便与 ViewEngine 向后兼容，从而使向 Ivy 的过渡更加顺畅。由于 ViewEngine 已被弃用并将很快被删除，因此这些符号现在也已被弃用。

<a id="testrequest-errorevent"></a>



`TestRequest` accepting `ErrorEvent`

`TestRequest` 接受 `ErrorEvent` 参数

Angular provides utilities for testing `HttpClient`.
The `TestRequest` class from `@angular/common/http/testing` mocks HTTP request objects for use with `HttpTestingController`.

Angular 提供了一些用于测试 `HttpClient` 的实用工具。`@angular/common/http/testing` 中的 `TestRequest` 类会模拟 HTTP 请求对象以与 `HttpTestingController` 一起使用。

`TestRequest` provides an API for simulating an HTTP response with an error.
In earlier versions of Angular, this API accepted objects of type `ErrorEvent`, which does not match the type of error event that browsers return natively.
If you use `ErrorEvent` with `TestRequest`, you should switch to `ProgressEvent`.

`TestRequest` 提供了一个 API 来模拟带有错误的 HTTP 响应。在早期版本的 Angular 中，此 API 接受 `ErrorEvent` 类型的对象，这与浏览器原生返回的错误事件类型不匹配。如果你要将 `ErrorEvent` 与 `TestRequest` 一起使用，就应该切换到 `ProgressEvent`。

Here is an example using a `ProgressEvent`:

这是使用 `ProgressEvent` 的示例：

<a id="deprecated-cli-flags"></a>



Deprecated CLI APIs and Options

弃用的 CLI API 和选项

This section contains a complete list all of the currently deprecated CLI flags.

本节包含所有当前已弃用的 CLI 标志的完整列表。

&commat;angular-devkit/build-angular



Protractor builder

Protractor 构建器

<!--v12--> v14

<!--v12--> v14

Deprecate as part of the Protractor deprecation.

作为 Protractor 弃用的一部分而弃用。

<!--v13--> v15

<!--v13--> v15

Use `baseHref` option, `APP_BASE_HREF` DI token or a combination of both instead. For more information, see [the deploy url](guide/deployment#the-deploy-url).

使用 `baseHref` 选项、 `APP_BASE_HREF` DI 令牌或两者的组合。有关更多信息，参阅[部署 url](guide/deployment#the-deploy-url)。

API/Option

API/选项

<a id="removed"></a>



Removed APIs

删除的 API

The following APIs have been removed starting with version 11.0.0\*:

从 11.0.0\*开始，已经移除了以下 API：

[`queryParamsHandling`](api/router/UrlCreationOptions#queryParamsHandling)



Package

包

\* To see APIs removed in version 10, check out this guide on the [version 10 docs site](https://v10.angular.io/guide/deprecations#removed).

\* 要查看版本 10 中移除的 API，请查看 [版本 10 文档站点](https://v10.angular.cn/guide/deprecations#removed)上的本指南。

<a id="style-sanitization"></a>



Style Sanitization for `[style]` and `[style.prop]` bindings

`[style]` 和 `[style.prop]` 绑定的样式清理

Angular used to sanitize `[style]` and `[style.prop]` bindings to prevent malicious code from being inserted through `javascript:` expressions in CSS `url()` entries.
However, most modern browsers no longer support the usage of these expressions, so sanitization was only maintained for the sake of IE 6 and 7.
Given that Angular does not support either IE 6 or 7 and sanitization has a performance cost, we will no longer sanitize style bindings as of version 10 of Angular.

Angular 会清理 `[style]` 和 `[style.prop]` 绑定，以防止恶意代码通过 CSS `url()` 条目中的 `javascript:` 表达式进行插入。但是，大多数现代浏览器都已不再支持这些表达式的使用，所以这种清理只对 IE 6 和 7 才有意义。鉴于 Angular 不支持 IE 6 或 7，并且这种清理有性能代价，因此我们将不再清理 Angular 版本 10 中的样式绑定。

`loadChildren` string syntax in `@angular/router`

`@angular/router` 中的 `loadChildren` 字符串语法

It is no longer possible to use the `loadChildren` string syntax to configure lazy routes.
The string syntax has been replaced with dynamic import statements.
The `DeprecatedLoadChildren` type was removed from `@angular/router`.
Find more information about the replacement in the [`LoadChildrenCallback` documentation](api/router/LoadChildrenCallback).

不能再用 `loadChildren` 字符串语法来配置惰性路由。字符串语法已替换为动态导入语句。`DeprecatedLoadChildren` 类型已从 `@angular/router` 中删除。在 [`LoadChildrenCallback` 文档](api/router/LoadChildrenCallback)中查找有关本替换的更多信息。

The supporting classes `NgModuleFactoryLoader`, `SystemJsNgModuleLoader`, and `SystemJsNgModuleLoaderConfig` were removed from `@angular/core`, as well as `SpyNgModuleFactoryLoader` from `@angular/router`.

支持类 `NgModuleFactoryLoader` 、 `SystemJsNgModuleLoader` 和 `SystemJsNgModuleLoaderConfig` 类已从 `@angular/core` 中删除，并且 `SpyNgModuleFactoryLoader` 已从 `@angular/router` 中删除。

The purpose of `WrappedValue` was to allow the same object instance to be treated as different for the purposes of change detection.
It was commonly used with the `async` pipe in the case where the `Observable` produces the same instance of the value.

`WrappedValue` 是为了供变更检测用的，它允许将相同的对象实例视为不同的。在 `Observable` 产生相同值实例的情况下，它通常与 `async` 管道一起使用。

Given that this use case is relatively rare and special handling impacted application performance, the `WrappedValue` API has been removed in Angular 13.

鉴于此用例相对较少且特殊处理会影响应用程序性能，`WrappedValue` API 已在 Angular 13 中删除。

If you rely on the behavior that the same object instance should cause change detection, you have two options:

如果你依赖同一个对象实例应该引起变更检测的行为，你有两个选择：

Clone the resulting value so that it has a new identity

克隆结果值，使其具有新的标识。

Explicitly call [`ChangeDetectorRef.detectChanges()`](api/core/ChangeDetectorRef#detectchanges) to force the update

显式调用[`ChangeDetectorRef.detectChanges()`](api/core/ChangeDetectorRef#detectchanges)以强制更新
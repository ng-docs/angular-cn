# Deprecated APIs and features

# 已弃用的 API 和特性

Angular strives to balance innovation and stability.
Sometimes, APIs and features become obsolete and need to be removed or replaced so that Angular can stay current with new best practices, changing dependencies, or changes in the (web) platform itself.

Angular 力图兼顾创新与稳定。但有时，API 和特性已经过时，需要进行删除或替换，以便 Angular 可以及时跟上新的最佳实践、依赖项变更或者 Web 平台自身的变化。

To make these transitions as easy as possible, we deprecate APIs and features for a period of time before removing them.
This gives you time to update your applications to the latest APIs and best practices.

为了使这些转换尽可能容易，我们在删除这些 API 和特性之前会弃用它们一段时间。这让你有时间将应用程序更新为最新的 API 和最佳实践。

This guide contains a summary of all Angular APIs and features that are currently deprecated.

本指南包含了当前已弃用的所有 Angular API 和特性的汇总表。

<div class="alert is-helpful">

Features and APIs that were deprecated in v6 or earlier are candidates for removal in version 9 or any later major version.
For information about Angular's deprecation and removal practices, see [Angular Release Practices](guide/releases#deprecation-practices "Angular Release Practices: Deprecation practices").

在 v6 或更早版本中已弃用的特性和 API 将在版本 9 或任何更高的主版本中移除。有关 Angular 弃用和移除实践的信息，参阅[Angular 发布实践](guide/releases#deprecation-practices "Angular 发布实践：弃用实践")。

For step-by-step instructions on how to update to the latest Angular release, use the interactive update guide at [update.angular.io](https://update.angular.io).

关于如何更新到最新 Angular 版本的分步说明，参阅 [update.angular.io](https://update.angular.io) 上的交互式更新指南。

</div>

## Index

## 索引

To help you future-proof your projects, the following table lists all deprecated APIs and features, organized by the release in which they are candidates for removal.
Each item is linked to the section later in this guide that describes the deprecation reason and replacement options.

为帮助你的项目面向未来，下表列出了所有已弃用的 API 和特性，并按它们将被移除的候选版本进行组织。每个项目都链接到本指南后面描述弃用原因和替换选项的部分。

<!--
deprecation -> removal cheat sheet
v4 - v7
v5 - v8
v6 - v9
v7 - v10
v8 - v11
v9 - v12
v10 - v13
v11 - v14
v12 - v15
v13 - v16
v14 - v17
-->

| Area | API or Feature | May be removed in |
| :--- | :------------- | :---------------- |
| 特性区 | API 或特性 | 可能移除于 |
| `@angular/common` | [`ReflectiveInjector`](#reflectiveinjector) | <!--  v8 --> v11 |
| `@angular/common` | [`CurrencyPipe` - `DEFAULT_CURRENCY_CODE`](api/common/CurrencyPipe#currency-code-deprecation) | <!--  v9 --> v11 |
| `@angular/common` | [`NgComponentOutlet.ngComponentOutletNgModuleFactory`](#common) | <!-- v14 --> v17 |
| `@angular/common/http` | [`XhrFactory`](api/common/http/XhrFactory) | <!-- v12 --> v15 |
| `@angular/common/http/testing` | [`TestRequest` accepting `ErrorEvent` for error simulation](#testrequest-errorevent) | <!-- v13 --> v16 |
| `@angular/common/http/testing` | [`TestRequest` 接受 `ErrorEvent` 参数以进行错误模拟](#testrequest-errorevent) | <!-- v13 --> v16 |
| `@angular/core` | [`DefaultIterableDiffer`](#core) | <!--  v7 --> v11 |
| `@angular/core` | [`ReflectiveKey`](#core) | <!--  v8 --> v11 |
| `@angular/core` | [`RenderComponentType`](#core) | <!--  v7 --> v11 |
| `@angular/core` | [Factory-based signature of `ApplicationRef.bootstrap`](#core) | <!-- v13 --> v15 |
| `@angular/core` | [`ApplicationRef.bootstrap` 的基于工厂的签名](#core) | <!-- v13 --> v15 |
| `@angular/core` | [`PlatformRef.bootstrapModuleFactory`](#core) | <!-- v13 --> v15 |
| `@angular/core` | [`getModuleFactory`](#core) | <!-- v13 --> v16 |
| `@angular/core` | [`ModuleWithComponentFactories`](#core) | <!-- v13 --> v16 |
| `@angular/core` | [`Compiler`](#core) | <!-- v13 --> v16 |
| `@angular/core` | [`CompilerFactory`](#core) | <!-- v13 --> v16 |
| `@angular/core` | [`NgModuleFactory`](#core) | <!-- v13 --> v16 |
| `@angular/core` | [`ComponentFactory`](#core) | <!-- v13 --> v16 |
| `@angular/core` | [`ComponentFactoryResolver`](#core) | <!-- v13 --> v16 |
| `@angular/core` | [`CompilerOptions.useJit and CompilerOptions.missingTranslation config options`](#core) | <!-- v13 --> v16 |
| `@angular/platform-browser-dynamic` | [`JitCompilerFactory`](#platform-browser-dynamic) | <!-- v13 --> v16 |
| `@angular/platform-browser-dynamic` | [`RESOURCE_CACHE_PROVIDER`](#platform-browser-dynamic) | <!-- v13 --> v16 |
| `@angular/forms` | [`ngModel` with reactive forms](#ngmodel-reactive) | <!--  v6 --> v11 |
| `@angular/forms` | [和响应式表单一起使用 `ngModel`](#ngmodel-reactive) | <!--v6--> v11 |
| `@angular/upgrade` | [`@angular/upgrade`](#upgrade) | <!--  v8 --> v11 |
| `@angular/upgrade` | [`getAngularLib`](#upgrade-static) | <!--  v8 --> v11 |
| `@angular/upgrade` | [`setAngularLib`](#upgrade-static) | <!--  v8 --> v11 |
| `@angular/upgrade` | [Factory-based signature of `downgradeModule`](#upgrade-static) | <!-- v13 --> v15 |
| `@angular/upgrade` | [`downgradeModule` 基于工厂的签名](#upgrade-static) | <!--v13--> v15 |
| template syntax | [`<template>`](#template-tag) | <!--  v7 --> v11 |
| 模板语法 | [`<template>`](#template-tag) | <!--  v7 --> v11 |
| polyfills | [reflect-metadata](#reflect-metadata) | <!--  v8 --> v11 |
| 腻子脚本 | [reflect-metadata](#reflect-metadata) | <!--v8--> v11 |
| `@angular/compiler-cli` | [Input setter coercion](#input-setter-coercion) | <!-- v13 --> v15 |
| `@angular/compiler-cli` | [输入设置器强制类型转换](#input-setter-coercion) | <!-- v13 --> v15 |
| `@angular/compiler-cli` | [`fullTemplateTypeCheck`](#full-template-type-check) | <!-- v13 --> v15 |
| `@angular/core` | [`defineInjectable`](#core) | <!--  v8 --> v11 |
| `@angular/core` | [`entryComponents`](api/core/NgModule#entryComponents) | <!--  v9 --> v11 |
| `@angular/core` | [`ANALYZE_FOR_ENTRY_COMPONENTS`](api/core/ANALYZE_FOR_ENTRY_COMPONENTS) | <!--  v9 --> v11 |
| `@angular/core` | [Factory-based signature of `ViewContainerRef.createComponent`](api/core/ViewContainerRef#createComponent) | <!-- v13 --> v15 |
| `@angular/core` | [`ViewContainerRef.createComponent` 的基于工厂的签名](api/core/ViewContainerRef#createComponent) | <!-- v13 --> v15 |
| `@angular/core/testing` | [`TestBed.get`](#testing) | <!--  v9 --> v12 |
| `@angular/core/testing` | [`async`](#testing) | <!--  v9 --> v12 |
| `@angular/forms` | [`FormBuilder.group` legacy options parameter](api/forms/FormBuilder#group) | <!-- v11 --> v14 |
| `@angular/forms` | [`FormBuilder.group` 老式选项参数](api/forms/FormBuilder#group) | <!--v11--> v14 |
| `@angular/platform-server` | [`renderModuleFactory`](#platform-server) | <!-- v13 --> v15 |
| `@angular/router` | [`relativeLinkResolution`](#relativeLinkResolution) | <!-- v14 --> v16 |
| `@angular/router` | [`resolver` argument in `RouterOutletContract.activateWith`](#router) | <!-- v14 --> v16 |
| `@angular/router` | [`RouterOutletContract.activateWith` 中的 `resolver` 参数](#router) | <!-- v14 --> v16 |
| `@angular/router` | [`resolver` field of the `OutletContext` class](#router) | <!-- v14 --> v16 |
| `@angular/router` | [`OutletContext` 类的 `resolver` 字段](#router) | <!-- v14 --> v16 |
| `@angular/service-worker` | [`SwUpdate#activated`](api/service-worker/SwUpdate#activated) | <!-- v13 --> v16 |
| `@angular/service-worker` | [`SwUpdate#available`](api/service-worker/SwUpdate#available) | <!-- v13 --> v16 |
| template syntax | [`/deep/`, `>>>`, and `::ng-deep`](#deep-component-style-selector) | <!--  v7 --> unspecified |
| 模板语法 | [`/deep/`, `>>>` 和 `::ng-deep`](#deep-component-style-selector) | <!--v7--> 未指定 |
| template syntax | [`bind-`, `on-`, `bindon-`, and `ref-`](#bind-syntax) | <!-- v13 --> v15 |
| 模板语法 | [`bind-`, `on-`, `bindon-` 和 `ref-`](#bind-syntax) | <!--v13--> v15 |

For information about Angular CDK and Angular Material deprecations, see the [changelog](https://github.com/angular/components/blob/main/CHANGELOG.md).

要了解 Angular CDK 和 Angular Material 的弃用情况，参阅[变更记录](https://github.com/angular/components/blob/main/CHANGELOG.md)。

## Deprecated APIs

## 已弃用的 API

This section contains a complete list all of the currently-deprecated APIs, with details to help you plan your migration to a replacement.

本节包含所有当前已弃用的 API 的完整列表，其中包含一些可帮助你规划如何迁移到其替代品的详细信息。

<div class="alert is-helpful">

**TIP**: <br />
In the [API reference section](api) of this site, deprecated APIs are indicated by ~~strikethrough.~~ You can filter the API list by [Status: deprecated](api?status=deprecated).

**提示**：<br />
在本网站的[API 参考部分](api)，已弃用的 API 由~~删除线~~标出。你可以按[状态: 已弃用](api?status=deprecated)过滤 API 列表。

</div>

<a id="common"></a>

### @angular/common

| API | Replacement | Deprecation announced | Details |
| :-- | :---------- | :-------------------- | :------ |
| API | 更换 | 已宣布弃用 | 详细信息 |
| [`CurrencyPipe` - `DEFAULT_CURRENCY_CODE`](api/common/CurrencyPipe#currency-code-deprecation) | `{provide: DEFAULT_CURRENCY_CODE, useValue: 'USD'}` | v9 | From v11 the default code will be extracted from the locale data given by `LOCALE_ID`, rather than `USD`. |
| [`CurrencyPipe` - `DEFAULT_CURRENCY_CODE`](api/common/CurrencyPipe#currency-code-deprecation) | `{provide: DEFAULT_CURRENCY_CODE, useValue: 'USD'}` | v9 | 从 v11 开始，默认代码将从 `LOCALE_ID` 给出的语言环境数据中提取，而不是 `USD`。 |
| [`NgComponentOutlet.ngComponentOutletNgModuleFactory`](api/common/NgComponentOutlet) | `NgComponentOutlet.ngComponentOutletNgModule` | v14 | Use the `ngComponentOutletNgModule` input instead. This input doesn't require resolving NgModule factory. |
| [`NgComponentOutlet.ngComponentOutletNgModuleFactory`](api/common/NgComponentOutlet) | `NgComponentOutlet.ngComponentOutletNgModule` | v14 | 改用 `ngComponentOutletNgModule` 输入。此输入不需要解析 NgModule 工厂。 |

<a id="common-http"></a>

### @angular/common/http

| API | Replacement | Deprecation announced | Details |
| :-- | :---------- | :-------------------- | :------ |
| API | 更换 | 已宣布弃用 | 详细信息 |
| [`XhrFactory`](api/common/http/XhrFactory) | `XhrFactory` in `@angular/common` | v12 | The `XhrFactory` has moved from `@angular/common/http` to `@angular/common`. |
| [`XhrFactory`](api/common/http/XhrFactory) | `@angular/common` 中的 `XhrFactory` | v12 | `XhrFactory` 已从 `@angular/common/http` 移到了 `@angular/common`。 |

<a id="core"></a>

### @angular/core

| API | Replacement | Deprecation announced | Details |
| :-- | :---------- | :-------------------- | :------ |
| API | 更换 | 已宣布弃用 | 详细信息 |
| [`DefaultIterableDiffer`](api/core/DefaultIterableDiffer) | n/a | v4 | Not part of public API. |
| [`DefaultIterableDiffer`](api/core/DefaultIterableDiffer) | 不适用 | v4 | 不再是公共 API。 |
| [`ReflectiveInjector`](api/core/ReflectiveInjector) | [`Injector.create()`](api/core/Injector#create) | v5 | See [`ReflectiveInjector`](#reflectiveinjector) |
| [`ReflectiveInjector`](api/core/ReflectiveInjector) | [`Injector.create()`](api/core/Injector#create) | v5 | 参阅[`ReflectiveInjector`](#reflectiveinjector) |
| [`ReflectiveKey`](api/core/ReflectiveKey) | none | v5 | none |
| [`ReflectiveKey`](api/core/ReflectiveKey) | 没了 | v5 | 没了 |
| [`defineInjectable`](api/core/defineInjectable) | `ɵɵdefineInjectable` | v8 | Used only in generated code. No source code should depend on this API. |
| [`defineInjectable`](api/core/defineInjectable) | `ɵɵdefineInjectable` | v8 | 仅在生成的代码中使用。任何源代码都不应依赖此 API。 |
| [`entryComponents`](api/core/NgModule#entryComponents) | none | v9 | See [`entryComponents`](#entryComponents) |
| [`entryComponents`](api/core/NgModule#entryComponents) | 没了 | v9 | 参见 [`entryComponents`](#entryComponents) |
| [`ANALYZE_FOR_ENTRY_COMPONENTS`](api/core/ANALYZE_FOR_ENTRY_COMPONENTS) | none | v9 | See [`ANALYZE_FOR_ENTRY_COMPONENTS`](#entryComponents) |
| [`ANALYZE_FOR_ENTRY_COMPONENTS`](api/core/ANALYZE_FOR_ENTRY_COMPONENTS) | 没了 | v9 | 参见 [`ANALYZE_FOR_ENTRY_COMPONENTS`](#entryComponents) |
| [`async`](api/core/testing/async) | [`waitForAsync`](api/core/testing/waitForAsync) | v11 | The [`async`](api/core/testing/async) function from `@angular/core/testing` has been renamed to `waitForAsync` in order to avoid confusion with the native JavaScript `async` syntax. The existing function is deprecated and will be removed in a future version. |
| [`async`](api/core/testing/async) | [`waitForAsync`](api/core/testing/waitForAsync) | v11 | 来自 `@angular/core/testing` 的[`async`](api/core/testing/async)函数已重命名为 `waitForAsync` 以避免与原生 JavaScript `async` 语法混淆。现有特性已弃用，将在未来版本中删除。 |
| [`getModuleFactory`](api/core/getModuleFactory) | [`getNgModuleById`](api/core/getNgModuleById) | v13 | Ivy allows working with NgModule classes directly, without retrieving corresponding factories. |
| [`getModuleFactory`](api/core/getModuleFactory) | [`getNgModuleById`](api/core/getNgModuleById) | v13 | Ivy 允许直接使用 NgModule 类，而无需检索相应的工厂。 |
| `ViewChildren.emitDistinctChangesOnly` / `ContentChildren.emitDistinctChangesOnly` | none (was part of [issue #40091](https://github.com/angular/angular/issues/40091)) |  | This is a temporary flag introduced as part of bugfix of [issue #40091](https://github.com/angular/angular/issues/40091) and will be removed. |
| `ViewChildren.emitDistinctChangesOnly` / `ContentChildren.emitDistinctChangesOnly` | 无（是[问题 #40091](https://github.com/angular/angular/issues/40091)的一部分） |  | 这是作为[问题 #40091](https://github.com/angular/angular/issues/40091)的错误修复的一部分引入的临时标志，将被删除。 |
| Factory-based signature of [`ApplicationRef.bootstrap`](api/core/ApplicationRef#bootstrap) | Type-based signature of [`ApplicationRef.bootstrap`](api/core/ApplicationRef#bootstrap) | v13 | With Ivy, there is no need to resolve Component factory and Component Type can be provided directly. |
| [`ApplicationRef.bootstrap`](api/core/ApplicationRef#bootstrap)的基于工厂的签名 | [`ApplicationRef.bootstrap`](api/core/ApplicationRef#bootstrap)的基于类型的签名 | v13 | 有了 ivy，不需要解析 Component factory，直接提供 Component Type 即可。 |
| [`PlatformRef.bootstrapModuleFactory`](api/core/PlatformRef#bootstrapModuleFactory) | [`PlatformRef.bootstrapModule`](api/core/PlatformRef#bootstrapModule) | v13 | With Ivy, there is no need to resolve NgModule factory and NgModule Type can be provided directly. |
| [`PlatformRef.bootstrapModuleFactory`](api/core/PlatformRef#bootstrapModuleFactory) | [`PlatformRef.bootstrapModule`](api/core/PlatformRef#bootstrapModule) | v13 | 有了 ivy，就不需要解析 NgModule factory，直接提供 NgModule Type 即可。 |
| [`ModuleWithComponentFactories`](api/core/ModuleWithComponentFactories) | none | v13 | Ivy JIT mode doesn't require accessing this symbol. See [JIT API changes due to ViewEngine deprecation](#jit-api-changes) for additional context. |
| [`ModuleWithComponentFactories`](api/core/ModuleWithComponentFactories) | 没了 | v13 | Ivy JIT 模式不需要访问此符号。有关其他上下文，参阅[由于 ViewEngine 弃用导致的 JIT API 更改](#jit-api-changes)。 |
| [`Compiler`](api/core/Compiler) | none | v13 | Ivy JIT mode doesn't require accessing this symbol. See [JIT API changes due to ViewEngine deprecation](#jit-api-changes) for additional context. |
| [`Compiler`](api/core/Compiler) | 没了 | v13 | Ivy JIT 模式不需要访问此符号。有关其他上下文，参阅[由于 ViewEngine 弃用导致的 JIT API 更改](#jit-api-changes)。 |
| [`CompilerFactory`](api/core/CompilerFactory) | none | v13 | Ivy JIT mode doesn't require accessing this symbol. See [JIT API changes due to ViewEngine deprecation](#jit-api-changes) for additional context. |
| [`CompilerFactory`](api/core/CompilerFactory) | 没了 | v13 | Ivy JIT 模式不需要访问此符号。有关其他上下文，参阅[由于 ViewEngine 弃用导致的 JIT API 更改](#jit-api-changes)。 |
| [`NgModuleFactory`](api/core/NgModuleFactory) | Use non-factory based framework APIs like [PlatformRef.bootstrapModule](api/core/PlatformRef#bootstrapModule) and [createNgModuleRef](api/core/createNgModuleRef) | v13 | Ivy JIT mode doesn't require accessing this symbol. See [JIT API changes due to ViewEngine deprecation](#jit-api-changes) for additional context. |
| [`NgModuleFactory`](api/core/NgModuleFactory) | 使用基于非工厂的框架 API，比如[PlatformRef.bootstrapModule](api/core/PlatformRef#bootstrapModule)和[createNgModuleRef](api/core/createNgModuleRef) | v13 | Ivy JIT 模式不需要访问此符号。有关其他上下文，参阅[由于 ViewEngine 弃用导致的 JIT API 更改](#jit-api-changes)。 |
| [Factory-based signature of `ViewContainerRef.createComponent`](api/core/ViewContainerRef#createComponent) | [Type-based signature of `ViewContainerRef.createComponent`](api/core/ViewContainerRef#createComponent) | v13 | Angular no longer requires component factories to dynamically create components. Use different signature of the `createComponent` method, which allows passing Component class directly. |
| [`ViewContainerRef.createComponent` 的基于工厂的签名](api/core/ViewContainerRef#createComponent) | [`ViewContainerRef.createComponent` 的基于类型的签名](api/core/ViewContainerRef#createComponent) | v13 | Angular 不再需要组件工厂动态创建组件。使用 `createComponent` 方法的不同签名，该方法允许直接传递 Component 类。 |
| [`ComponentFactory`](api/core/ComponentFactory) | Use non-factory based framework APIs. | v13 | Since Ivy, Component factories are not required. Angular provides other APIs where Component classes can be used directly. |
| [`ComponentFactory`](api/core/ComponentFactory) | 使用不基于工厂的框架 API。 | v13 | 从 Ivy 开始，就不需要组件工厂。Angular 提供了其他可以直接使用组件类的 API。 |
| [`ComponentFactoryResolver`](api/core/ComponentFactoryResolver) | Use non-factory based framework APIs. | v13 | Since Ivy, Component factories are not required, thus there is no need to resolve them. |
| [`ComponentFactoryResolver`](api/core/ComponentFactoryResolver) | 使用不基于工厂的框架 API。 | v13 | 由于 Ivy，不需要组件工厂，因此无需解析它们。 |
| [`CompilerOptions.useJit and CompilerOptions.missingTranslation config options`](api/core/CompilerOptions) | none | v13 | Since Ivy, those config options are unused, passing them has no effect. |
| [`CompilerOptions.useJit and CompilerOptions.missingTranslation config options`](api/core/CompilerOptions) | 没了 | v13 | 由于 Ivy，这些配置选项未使用，传递它们是没有效果的。 |

<a id="testing"></a>

### @angular/core/testing

| API | Replacement | Deprecation announced | Details |
| :-- | :---------- | :-------------------- | :------ |
| API | 更换 | 已宣布弃用 | 详细信息 |
| [`TestBed.get`](api/core/testing/TestBed#get) | [`TestBed.inject`](api/core/testing/TestBed#inject) | v9 | Same behavior, but type safe. |
| [`TestBed.get`](api/core/testing/TestBed#get) | [`TestBed.inject`](api/core/testing/TestBed#inject) | v9 | 行为没变，但类型安全。 |
| [`async`](api/core/testing/async) | [`waitForAsync`](api/core/testing/waitForAsync) | v10 | Same behavior, but rename to avoid confusion. |
| [`async`](api/core/testing/async) | [`waitForAsync`](api/core/testing/waitForAsync) | v10 | 行为相同，只是改名以免混淆。 |

<a id="router"></a>

### @angular/router

| API | Replacement | Deprecation announced | Details |
| :-- | :---------- | :-------------------- | :------ |
| API | 更换 | 已宣布弃用 | 详细信息 |
| [`resolver` argument in `RouterOutletContract.activateWith`](api/router/RouterOutletContract#activatewith) | No replacement needed | v14 | Component factories are not required to create an instance of a component dynamically. Passing a factory resolver via `resolver` argument is no longer needed. |
| [`RouterOutletContract.activateWith` 中的 `resolver` 参数](api/router/RouterOutletContract#activatewith) | 无需更换 | v14 | 组件工厂不需要动态创建组件的实例。不再需要通过 `resolver` 参数传递工厂解析器。 |
| [`resolver` field of the `OutletContext` class](api/router/OutletContext#resolver) | No replacement needed | v14 | Component factories are not required to create an instance of a component dynamically. Passing a factory resolver via `resolver` class field is no longer needed. |
| [`OutletContext` 类的 `resolver` 字段](api/router/OutletContext#resolver) | 无需更换 | v14 | 组件工厂不需要动态创建组件的实例。不再需要通过 `resolver` 类字段传递工厂解析器。 |

<a id="platform-browser-dynamic"></a>

### @angular/platform-browser-dynamic

| API | Replacement | Deprecation announced | Details |
| :-- | :---------- | :-------------------- | :------ |
| API | 更换 | 已宣布弃用 | 详细信息 |
| [`JitCompilerFactory`](api/platform-browser-dynamic/JitCompilerFactory) | none | v13 | This symbol is no longer necessary. See [JIT API changes due to ViewEngine deprecation](#jit-api-changes) for additional context. |
| [`JitCompilerFactory`](api/platform-browser-dynamic/JitCompilerFactory) | 没了 | v13 | 此符号不再需要。有关其他上下文，参阅[由于 ViewEngine 弃用导致的 JIT API 更改](#jit-api-changes)。 |
| [`RESOURCE_CACHE_PROVIDER`](api/platform-browser-dynamic/RESOURCE_CACHE_PROVIDER) | none | v13 | This was previously necessary in some cases to test AOT-compiled components with View Engine, but is no longer since Ivy. |
| [`RESOURCE_CACHE_PROVIDER`](api/platform-browser-dynamic/RESOURCE_CACHE_PROVIDER) | 没了 | v13 | 以前，在某些情况下，要使用 View Engine 测试 AOT 编译的组件，这是必要的，但从 Ivy 开始就不再是这样了。 |

<a id="platform-server"></a>

### @angular/platform-server

| API | Replacement | Deprecation announced | Details |
| :-- | :---------- | :-------------------- | :------ |
| API | 更换 | 已宣布弃用 | 详细信息 |
| [`renderModuleFactory`](api/platform-server/renderModuleFactory) | [`renderModule`](api/platform-server/renderModule) | v13 | This symbol is no longer necessary. See [JIT API changes due to ViewEngine deprecation](#jit-api-changes) for additional context. |
| [`renderModuleFactory`](api/platform-server/renderModuleFactory) | [`renderModule`](api/platform-server/renderModule) | v13 | 此符号不再需要。有关其他上下文，参阅[由于 ViewEngine 弃用导致的 JIT API 更改](#jit-api-changes)。 |

<a id="forms"></a>

### @angular/forms

| API | Replacement | Deprecation announced | Details |
| :-- | :---------- | :-------------------- | :------ |
| API | 更换 | 已宣布弃用 | 详细信息 |
| [`ngModel` with reactive forms](#ngmodel-reactive) | [`FormControlDirective`](api/forms/FormControlDirective) | v6 | none |
| [与响应式表单一起使用的 `ngModel`](#ngmodel-reactive) | [`FormControlDirective`](api/forms/FormControlDirective) | v6 | 没了 |
| [`FormBuilder.group` legacy options parameter](api/forms/FormBuilder#group) | [`AbstractControlOptions` parameter value](api/forms/AbstractControlOptions) | v11 | none |
| [`FormBuilder.group` 旧版 options 参数](api/forms/FormBuilder#group) | [`AbstractControlOptions` 参数值](api/forms/AbstractControlOptions) | v11 | 没了 |

<a id="service-worker"></a>

### @angular/service-worker

| API | Replacement | Deprecation announced | Details |
| :-- | :---------- | :-------------------- | :------ |
| API | 更换 | 已宣布弃用 | 详细信息 |
| [`SwUpdate#activated`](api/service-worker/SwUpdate#activated) | [`SwUpdate#activateUpdate()` return value](api/service-worker/SwUpdate#activateUpdate) | v13 | The return value of `SwUpdate#activateUpdate()` indicates whether an update was successfully activated. |
| [`SwUpdate#activated`](api/service-worker/SwUpdate#activated) | [`SwUpdate#activateUpdate()` 的返回值](api/service-worker/SwUpdate#activateUpdate) | v13 | `SwUpdate#activateUpdate()` 的返回值指示更新是否成功激活。 |
| [`SwUpdate#available`](api/service-worker/SwUpdate#available) | [`SwUpdate#versionUpdates`](api/service-worker/SwUpdate#versionUpdates) | v13 | The behavior of `SwUpdate#available` can be rebuilt by filtering for `VersionReadyEvent` events on [`SwUpdate#versionUpdates`](api/service-worker/SwUpdate#versionUpdates) |
| [`SwUpdate#available`](api/service-worker/SwUpdate#available) | [`SwUpdate#versionUpdates`](api/service-worker/SwUpdate#versionUpdates) | v13 | 可以通过过滤[`SwUpdate#versionUpdates`](api/service-worker/SwUpdate#versionUpdates)上的 `VersionReadyEvent` 事件来重建 `SwUpdate#available` 的行为 |

<a id="upgrade"></a>

### @angular/upgrade

| API | Replacement | Deprecation announced | Details |
| :-- | :---------- | :-------------------- | :------ |
| API | 更换 | 已宣布弃用 | 详细信息 |
| [All entry points](api/upgrade) | [`@angular/upgrade/static`](api/upgrade/static) | v5 | See [Upgrading from AngularJS](guide/upgrade). |
| [所有入口点](api/upgrade) | [`@angular/upgrade/static`](api/upgrade/static) | v5 | 参阅[从 AngularJS 升级](guide/upgrade)。 |

<a id="upgrade-static"></a>

### @angular/upgrade/static

| API | Replacement | Deprecation announced | Details |
| :-- | :---------- | :-------------------- | :------ |
| API | 更换 | 已宣布弃用 | 详细信息 |
| [`getAngularLib`](api/upgrade/static/getAngularLib) | [`getAngularJSGlobal`](api/upgrade/static/getAngularJSGlobal) | v5 | See [Upgrading from AngularJS](guide/upgrade). |
| [`getAngularLib`](api/upgrade/static/getAngularLib) | [`getAngularJSGlobal`](api/upgrade/static/getAngularJSGlobal) | v5 | 参阅[从 AngularJS 升级](guide/upgrade)。 |
| [`setAngularLib`](api/upgrade/static/setAngularLib) | [`setAngularJSGlobal`](api/upgrade/static/setAngularJSGlobal) | v5 | See [Upgrading from AngularJS](guide/upgrade). |
| [`setAngularLib`](api/upgrade/static/setAngularLib) | [`setAngularJSGlobal`](api/upgrade/static/setAngularJSGlobal) | v5 | 参阅[从 AngularJS 升级](guide/upgrade)。 |
| [Factory-based signature of `downgradeModule`](api/upgrade/static/downgradeModule) | [NgModule-based signature of `downgradeModule`](api/upgrade/static/downgradeModule) | v13 | The `downgradeModule` supports more ergonomic NgModule-based API (versus NgModule factory based API). |
| [`downgradeModule` 的基于工厂的签名](api/upgrade/static/downgradeModule) | [`downgradeModule` 的基于 NgModule 的签名](api/upgrade/static/downgradeModule) | v13 | `downgradeModule` 支持更符合人体工程学的基于 NgModule 的 API（与基于 NgModule 工厂的 API 相比）。 |

<a id="deprecated-features"></a>

## Deprecated features

## 已弃用的特性

This section lists all of the currently-deprecated features, which includes template syntax, configuration options, and any other deprecations not listed in the [Deprecated APIs](#deprecated-apis) section above.
It also includes deprecated API usage scenarios or API combinations, to augment the information above.

本部分列出了所有当前已弃用的特性，其中包括模板语法、配置选项以及上述[已弃用 API](#deprecated-apis)部分中未列出的任何其他弃用特性。它还包括已弃用的 API 使用场景或 API 组合，以作为上述信息的补充。

<a id="bazelbuilder"></a>

### Bazel builder and schematics

### Bazel 构建器和原理图

Bazel builder and schematics were introduced in Angular Labs to let users try out Bazel without having to manage Bazel version and BUILD files.
This feature has been deprecated.
For more information, please refer to the [migration doc](https://github.com/angular/angular/blob/main/packages/bazel/docs/BAZEL_SCHEMATICS.md).

Angular Labs 中引入了 Bazel 构建器和原理图，让用户无需管理 Bazel 版本和 BUILD 文件即可试用 Bazel。此特性已被弃用。有关更多信息，参阅[迁移文档](https://github.com/angular/angular/blob/main/packages/bazel/docs/BAZEL_SCHEMATICS.md)。

<a id="wtf"></a>

### Web Tracing Framework integration

### Web 跟踪框架集成

Angular previously supported an integration with the [Web Tracing Framework (WTF)](https://google.github.io/tracing-framework) for performance testing of Angular applications.
This integration has not been maintained and is now defunct.
As a result, the integration was deprecated in Angular version 8, and due to no evidence of any existing usage, removed in version 9.

Angular 以前支持与[Web 跟踪框架 (WTF)](https://google.github.io/tracing-framework)集成，以对 Angular 应用程序进行性能测试。此集成未经维护，现已失效。因此，该集成在 Angular 版本 8 中被弃用，并且由于没有任何现有使用的证据，因此在版本 9 中被删除。

<a id="deep-component-style-selector"></a>

### `/deep/`, `>>>`, and `::ng-deep` component style selectors

### `/deep/` 、 `>>>` 和 `::ng-deep` 组件样式选择器

The shadow-dom-piercing descendant combinator is deprecated and support is being [removed from major browsers and tools](https://developers.google.com/web/updates/2017/10/remove-shadow-piercing).
As such, in v4 we deprecated support in Angular for all three of `/deep/`, `>>>`, and `::ng-deep`.
Until removal, `::ng-deep` is preferred for broader compatibility with the tools.

这类 shadow-dom-piercing 后代组合器已弃用，并且正在[从主要浏览器和工具](https://developers.google.com/web/updates/2017/10/remove-shadow-piercing)中删除支持。因此，在 v4 中，我们弃用了 Angular 对 `/deep/` 、 `>>>` 和 `::ng-deep` 三个的支持。在正式移除之前，`::ng-deep` 是首选，因为它与工具具有更广泛的兼容性。

For more information, see [/deep/, >>>, and ::ng-deep](guide/component-styles#deprecated-deep--and-ng-deep "Component Styles guide, Deprecated deep and ngdeep") in the Component Styles guide.

有关更多信息，参阅组件样式指南中的[/deep/、>>> 和 ::ng-deep](guide/component-styles#deprecated-deep--and-ng-deep "组件样式指南，已弃用 deep 和 ngdeep")。

<a id="bind-syntax"></a>

### `bind-`, `on-`, `bindon-`, and `ref-` prefixes

### `bind-` 、 `on-` 、 `bindon-` 和 `ref-` 前缀

The template prefixes `bind-`, `on-`, `bindon-`, and `ref-` have been deprecated in v13.
Templates should use the more widely documented syntaxes for binding and references:

模板前缀 `bind-` 、 `on-` 、 `bindon-` 和 `ref-` 在 v13 中已被弃用。模板应该使用更广为人知的语法进行绑定和引用：

* `[input]="value"` instead of `bind-input="value"`

  `[input]="value"` 代替 `bind-input="value"`

* `[@trigger]="value"` instead of `bind-animate-trigger="value"`

  `[@trigger]="value"` 代替 `bind-animate-trigger="value"`

* `(click)="onClick()"` instead of `on-click="onClick()"`

  `(click)="onClick()"` 代替 `on-click="onClick()"`

* `[(ngModel)]="value"` instead of `bindon-ngModel="value"`

  `[(ngModel)]="value"` 代替 `bindon-ngModel="value"`

* `#templateRef` instead of `ref-templateRef`

  `#templateRef` 代替 `ref-templateRef`

<a id="template-tag"></a>

### `<template>` tag

### `<template>` 标签

The `<template>` tag was deprecated in v4 to avoid colliding with the DOM's element of the same name (such as when using web components).
Use `<ng-template>` instead.
For more information, see the [Ahead-of-Time Compilation](guide/aot-compiler) guide.

`<template>` 标签在 v4 中已被弃用，以避免与 DOM 的同名元素发生冲突（比如在使用 Web 组件时）。使用 `<ng-template>` 代替。有关更多信息，参阅[预先编译](guide/aot-compiler)指南。

<a id="ngmodel-reactive"></a>

### ngModel with reactive forms

### 和响应式表单一起使用 ngModel

Support for using the `ngModel` input property and `ngModelChange` event with reactive form directives has been deprecated in Angular v6 and will be removed in a future version of Angular.

在 Angular v6 中已不推荐把 `ngModel` 输入属性、`ngModelChange` 事件与响应式表单指令一起使用，并将在 Angular 的未来版本中删除。

Now deprecated:

现在已经弃用：

<code-example path="deprecation-guide/src/app/app.component.html" region="deprecated-example"></code-example>

<code-example path="deprecation-guide/src/app/app.component.ts" region="deprecated-example"></code-example>

This support was deprecated for several reasons.
First, developers found this pattern confusing.
It seems like the actual `ngModel` directive is being used, but in fact it's an input/output property named `ngModel` on the reactive form directive that approximates some, but not all, of the directive's behavior.
It allows getting and setting a value and intercepting value events, but some of `ngModel`'s other features, such as delaying updates with`ngModelOptions` or exporting the directive, don't work.

出于多种原因，此支持已被弃用。首先，开发人员发现这种模式令人困惑。似乎正在使用实际的 `ngModel` 指令，但实际上它是响应式表单指令上名为 `ngModel` 的输入/输出属性，它模拟了该指令的一些行为，但又不完全一样。它允许获取和设置值并拦截值事件，但 `ngModel` 的一些其他特性，比如使用 `ngModelOptions` 延迟更新或导出指令，不起作用。

In addition, this pattern mixes template-driven and reactive forms strategies, which prevents taking advantage of the full benefits of either strategy.
Setting the value in the template violates the template-agnostic principles behind reactive forms, whereas adding a `FormControl`/`FormGroup` layer in the class removes the convenience of defining forms in the template.

另外，该模式混用了模板驱动和响应式这两种表单策略，这会妨碍我们获取任何一种策略的全部优点。在模板中设置值的方式，也违反了响应式表单所遵循的“模板无关”原则；反之，在类中添加 `FormControl`/`FormGroup` 层也破坏了“在模板中定义表单”的约定。

To update your code before support is removed, you'll want to decide whether to stick with reactive form directives (and get/set values using reactive forms patterns) or switch to template-driven directives.

要在移除支持之前更新你的代码。你需要决定是坚持使用响应式表单指令（并使用响应式表单模式来获取/设置值）还是切换到模板驱动表单指令。

**After** (choice 1 - use reactive forms):

**之后**（选择 1 - 使用响应式表单）：

<code-example path="deprecation-guide/src/app/app.component.html" region="reactive-form-example"></code-example>

<code-example path="deprecation-guide/src/app/app.component.ts" region="reactive-form-example"></code-example>

**After** (choice 2 - use template-driven forms):

**之后**（选择 2 - 使用模板驱动表单）：

<code-example path="deprecation-guide/src/app/app.component.html" region="template-driven-form-example"></code-example>

<code-example path="deprecation-guide/src/app/app.component.ts" region="template-driven-form-example"></code-example>

By default, when you use this pattern, you will see a deprecation warning once in dev mode.
You can choose to silence this warning by configuring `ReactiveFormsModule` at import time:

默认情况下，当你使用此模式时，你将在开发模式下看到一次弃用警告。你可以通过在导入时配置 `ReactiveFormsModule` 来选择消除此警告：

<code-example path="deprecation-guide/src/app/app.module.ts" region="reactive-form-no-warning"></code-example>

Alternatively, you can choose to surface a separate warning for each instance of this pattern with a configuration value of `"always"`.
This may help to track down where in the code the pattern is being used as the code is being updated.

或者，你可以选择为该模式的每个实例显示一个单独的警告，配置值为 `"always"`。这可能有助于在更新代码时跟踪代码中使用模式的位置。

<a id="reflectiveinjector"></a>

### ReflectiveInjector

In version 5, Angular replaced the `ReflectiveInjector` with the `StaticInjector`.
The injector no longer requires the Reflect polyfill, reducing application size for most developers.

在版本 5 中，Angular 用 `StaticInjector` 代替了 `ReflectiveInjector`。该注入器不再需要 Reflect 的腻子脚本，对大部分开发人员来说都显著减小了应用的体积。

**Before**:

**之前**：

<code-example path="deprecation-guide/src/app/app.component.ts" language="typescript" region="reflective-injector-deprecated-example"></code-example>

**After**:

**之后**：

<code-example path="deprecation-guide/src/app/app.component.ts" language="typescript" region="static-injector-example"></code-example>

<a id="relativeLinkResolution"></a>

The `relativeLinkResolution` option is deprecated and being removed.
In version 11, the default behavior was changed to the correct one.
After `relativeLinkResolution` is removed, the correct behavior is always used without an option to use the broken behavior.

`relativeLinkResolution` 选项已弃用并被删除。在版本 11 中，默认行为已更改为正确的行为。删除 `relativeLinkResolution` 后，始终使用正确的行为，而没有使用破损行为的选项。

A dev mode warning was added in v14 to warn if a created `UrlTree` relies on the `relativeLinkResolution: 'legacy'` option.

在 v14 中添加了开发模式警告，以警告创建的 `UrlTree` 依赖于 `relativeLinkResolution: 'legacy'` 选项。

<a id="loadChildren"></a>

### loadChildren string syntax

### loadChildren 字符串语法

When Angular first introduced lazy routes, there wasn't browser support for dynamically loading additional JavaScript.
Angular created our own scheme using the syntax `loadChildren: './lazy/lazy.module#LazyModule'` and built tooling to support it.
Now that ECMAScript dynamic import is supported in many browsers, Angular is moving toward this new syntax.

当 Angular 第一次引入惰性路由时，还没有浏览器能支持动态加载额外的 JavaScript。因此 Angular 创建了自己的方案，所用的语法是 `loadChildren: './lazy/lazy.module#LazyModule'` 并且还构建了一些工具来支持它。现在，很多浏览器都已支持 ECMAScript 的动态导入，Angular 也正朝着这个新语法前进。

In version 8, the string syntax for the [`loadChildren`](api/router/LoadChildren) route specification was deprecated, in favor of new syntax that uses `import()` syntax.

在版本 8 中，不推荐使用 [`loadChildren`](api/router/LoadChildren) 路由规范的字符串语法，而是改用基于 `import()` 的新语法。

**Before**:

**之前**：

<code-example path="deprecation-guide/src/app/app.module.ts" language="typescript" region="lazyload-deprecated-syntax"></code-example>

**After**:

**之后**：

<code-example path="deprecation-guide/src/app/app.module.ts" language="typescript" region="lazyload-syntax"></code-example>

<div class="alert is-helpful">

**Version 8 update**: When you update to version 8, the [`ng update`](cli/update) command performs the transformation automatically.
Prior to version 7, the `import()` syntax only works in JIT mode (with view engine).

**版本 8 更新**：当你更新到版本 8 时，[`ng update`](cli/update) 命令会自动执行转换。在版本 7 之前，`import()` 语法仅适用于 JIT 模式（使用视图引擎）。

</div>

<div class="alert is-helpful">

**Declaration syntax**: <br />
It's important to follow the route declaration syntax `loadChildren: () => import('...').then(m => m.ModuleName)` to allow `ngc` to discover the lazy-loaded module and the associated `NgModule`.
You can find the complete list of allowed syntax constructs [here](https://github.com/angular/angular-cli/blob/a491b09800b493fe01301387fa9a025f7c7d4808/packages/ngtools/webpack/src/transformers/import_factory.ts#L104-L113).
These restrictions will be relaxed with the release of Ivy since it'll no longer use `NgFactories`.

**声明语法**：<br />
遵循路由声明语法 `loadChildren: () => import('...').then(m => m.ModuleName)` 很重要，这样 `ngc` 才能发现惰性加载的模块和关联的 `NgModule`。你可以在[此处](https://github.com/angular/angular-cli/blob/a491b09800b493fe01301387fa9a025f7c7d4808/packages/ngtools/webpack/src/transformers/import_factory.ts#L104-L113)找到允许的语法结构的完整列表。这些限制将随着 Ivy 的发布而放宽，因为它将不再使用 `NgFactories`。

</div>

<a id="reflect-metadata"></a>

### Dependency on a reflect-metadata polyfill in JIT mode

### JIT 模式下对反射元数据 polyfill 的依赖

Angular applications, and specifically applications that relied on the JIT compiler, used to require a polyfill for the [reflect-metadata](https://github.com/rbuckton/reflect-metadata) APIs.

Angular 应用程序，特别是依赖于 JIT 编译器的应用程序，过去常常需要 [reflect-metadata](https://github.com/rbuckton/reflect-metadata) API 的腻子脚本。

The need for this polyfill was removed in Angular version 8.0 ([see #14473](https://github.com/angular/angular-cli/pull/14473)), rendering the presence of the poylfill in most Angular applications unnecessary.
Because the polyfill can be depended on by 3rd-party libraries, instead of removing it from all Angular projects, we are deprecating the requirement for this polyfill as of version 8.0.
This should give library authors and application developers sufficient time to evaluate if they need the polyfill, and perform any refactoring necessary to remove the dependency on it.

在 Angular 8.0 版（[见#14473](https://github.com/angular/angular-cli/pull/14473)）中移除了对这个腻子脚本的需求，这将使得大多数 Angular 应用程序不再需要此腻子脚本。因为此腻子脚本可能被第三方库依赖，因此不能从所有 Angular 项目中删除它，我们从 8.0 版本开始弃用对这个腻子脚本的要求。这样可以给库作者和应用程序开发人员足够的时间来评估他们是否需要此腻子脚本，并执行任何必要的重构以消除对它的依赖。

In a typical Angular project, the polyfill is not used in production builds, so removing it should not impact production applications.
The goal behind this removal is overall simplification of the build setup and decrease in the number of external dependencies.

在典型的 Angular 项目中，这个腻子脚本不用于生产版本，因此删除它不会影响生产环境的应用程序。删除它是为了从整体上上简化构建设置并减少外部依赖项的数量。

<a id="static-query-resolution"></a>

### `@ViewChild()` / `@ContentChild()` static resolution as the default

### `@ViewChild()` / `@ContentChild()` 默认使用静态解析

See the [dedicated migration guide for static queries](guide/static-query-migration).

参阅[静态查询的专用迁移指南](guide/static-query-migration)。

<a id="contentchild-input-together"></a>

### `@ContentChild()` / `@Input()` used together

### `@ContentChild()` / `@Input()` 一起使用

The following pattern is deprecated:

以下模式已弃用：

<code-example path="deprecation-guide/src/app/app.component.ts" language="typescript" region="template-with-input-deprecated"></code-example>

Rather than using this pattern, separate the two decorators into their own
properties and add fallback logic as in the following example:

不要再使用此模式，而应该将这两个装饰器分离到它们各自的属性中并添加回退逻辑，如下例所示：

<code-example path="deprecation-guide/src/app/app.component.ts" language="typescript" region="template-with-input"></code-example>

<a id="cant-assign-template-vars"></a>

### Cannot assign to template variables

### 无法赋值给模板变量

In the following example, the two-way binding means that `optionName`
should be written when the `valueChange` event fires.

在以下示例中，双向绑定意味着应在 `valueChange` 事件触发时写入 `optionName`。

<code-example path="deprecation-guide/src/app/app.component.1.html" region="two-way-template-deprecated"></code-example>

However, in practice, Angular ignores two-way bindings to template variables.
Starting in version 8, attempting to write to template variables is deprecated.
In a future version, we will throw to indicate that the write is not supported.

然而，在实践中，Angular 忽略了对模板变量的双向绑定。从版本 8 开始，不推荐对模板变量赋值。在未来的版本中，我们将抛出错误以指出不支持写入。

<code-example path="deprecation-guide/src/app/app.component.html" region="valid-template-bind"></code-example>

<a id="binding-to-innertext"></a>

### Binding to `innerText` in `platform-server`

### 在 `platform-server` 中绑定到 `innerText`

[Domino](https://github.com/fgnass/domino), which is used in server-side rendering, doesn't support `innerText`, so in platform-server's "domino adapter", there was special code to fall back to `textContent` if you tried to bind to `innerText`.

在服务器端渲染中使用的 [Domino](https://github.com/fgnass/domino) 不支持 `innerText`，因此在平台服务器中的 “domino 适配器”中，如果尝试绑定到 `innerText`，则有一些特殊代码可以退回到 `textContent`。

These two properties have subtle differences, so switching to `textContent` under the hood can be surprising to users.
For this reason, we are deprecating this behavior.
Going forward, users should explicitly bind to `textContent` when using Domino.

这两个属性有细微的差别，因此在幕后切换到 `textContent` 可能会让用户感到惊讶。出于这个原因，我们弃用了这种行为。展望未来，用户应该在使用 Domino 时显式绑定到 `textContent`。

<a id="wtf-apis"></a>

### `wtfStartTimeRange` and all `wtf*` APIs

### `wtfStartTimeRange` 和所有 `wtf*` API

All of the `wtf*` APIs are deprecated and will be removed in a future version.

所有 `wtf*` API 均已弃用，并将在未来版本中删除。

<a id="entryComponents"></a>

### `entryComponents` and `ANALYZE_FOR_ENTRY_COMPONENTS` no longer required

### 不再需要 `entryComponents` 和 `ANALYZE_FOR_ENTRY_COMPONENTS`

Previously, the `entryComponents` array in the `NgModule` definition was used to tell the compiler which components would be created and inserted dynamically.
With Ivy, this isn't a requirement anymore and the `entryComponents` array can be removed from existing module declarations.
The same applies to the `ANALYZE_FOR_ENTRY_COMPONENTS` injection token.

以前，`NgModule` 定义中的 `entryComponents` 数组用于告诉编译器将动态创建和插入哪些组件。使用 Ivy 后，这不再是必需的，并且可以从现有模块声明中删除 `entryComponents` 数组。这同样适用于 `ANALYZE_FOR_ENTRY_COMPONENTS` 注入令牌。

<div class="alert is-helpful">

**NOTE**: <br />
You may still need to keep these if building a library that will be consumed by a View Engine application.

**注意**：<br />
如果构建将由 View Engine 应用程序使用的库，你可能仍然需要保留这些。

</div>

<a id="moduleWithProviders"></a>

### `ModuleWithProviders` type without a generic

### 不带泛型的 `ModuleWithProviders` 类型

Some Angular libraries, such as `@angular/router` and `@ngrx/store`, implement APIs that return a type called `ModuleWithProviders` (typically using a method named `forRoot()`).
This type represents an `NgModule` along with additional providers.
Angular version 9 deprecates use of `ModuleWithProviders` without an explicitly generic type, where the generic type refers to the type of the `NgModule`.
In a future version of Angular, the generic will no longer be optional.

一些 Angular 库，比如 `@angular/router` 和 `@ngrx/store`，实现的 API 返回名为 ModuleWithProviders 的类型（通常使用名为 `ModuleWithProviders` `forRoot()` 的方法）。这种类型代表一个 `NgModule` 以及其他提供者。Angular 版本 9 已弃用没有明确泛型类型的 `NgModule` `ModuleWithProviders` 类型。在 Angular 的未来版本中，泛型将不再是可选的。

If you're using the CLI, `ng update` should [migrate your code automatically](guide/migration-module-with-providers).
If you're not using the CLI, you can add any missing generic types to your application manually.
For example:

如果你使用的是 CLI，则 `ng update` 应该[会自动迁移代码](guide/migration-module-with-providers)。如果没有使用 CLI，则可以将任何缺失的泛型类型手动添加到应用程序中。比如：

**Before**:

**之前**：

<code-example path="deprecation-guide/src/app/app.module.ts" language="typescript" region="ModuleWithProvidersNonGeneric"></code-example>

**After**:

**之后**：

<code-example path="deprecation-guide/src/app/app.module.ts" language="typescript" region="ModuleWithProvidersGeneric"></code-example>

<!--

### Internet Explorer 11

Angular support for Microsoft's Internet Explorer 11 (IE11) is deprecated and will be removed in Angular v13.
Ending IE11 support allows Angular to take advantage of web platform APIs present only in evergreen browsers, resulting in better APIs for developers and more capabilities for application users.
An additional motivation behind this removal is the drop in global usage of IE11 to just ~1% (as of March 2021).
For full rationale and discussion behind this deprecation, see [RFC: Internet Explorer 11 support deprecation and removal](https://github.com/angular/angular/issues/41840).

Angular 对 Microsoft 的 Internet Explorer 11 (IE11) 的支持已被弃用，将在 Angular v13 中删除。终止 IE11 支持允许 Angular 利用仅存在于常绿浏览器中的 Web 平台 API，为开发人员提供更好的 API，为应用程序用户提供更多特性。此次删除背后的另一个动机是 IE11 的全球使用量下降到仅 ~1%（截至 2021 年 3 月）。有关此弃用背后的完整理由和讨论，请参阅[RFC：Internet Explorer 11 支持弃用和删除](https://github.com/angular/angular/issues/41840)。

<div class="alert is-helpful">

**NOTE**: <br />
IE11 will be supported in Angular v12 LTS releases through November 2022.

**注意**：<br />
在 2022 年 11 月之前，Angular v12 LTS 版本将支持 IE11。

</div>
-->

<a id="input-setter-coercion"></a>

### Input setter coercion

### 输入 setter 强制类型转换

Since the `strictTemplates` flag has been introduced in Angular the compiler has been able to type-check input bindings to the declared input type of the corresponding directive.
When a getter/setter pair is being used for the input it may be desirable to let the setter accept a broader set of types than what is returned by the getter, for example when the setter first converts the input value.
However, until TypeScript 4.3 a getter/setter pair was required to have identical types so this pattern could not be accurately declared.

由于在 Angular 中引入了 `strictTemplates` 标志，编译器已经能够根据相应指令的声明输入类型对输入绑定进行类型检查。当 “getter/setter 对”用于输入时，可能需要让 setter 接受比 getter 返回的类型更宽泛的类型集，比如当 setter 首次转换输入值时。然而，在 TypeScript 4.3 之前，需要 getter/setter 对具有相同的类型，因此无法准确地声明此模式。

To mitigate this limitation, it was made possible to declare [input setter coercion fields](guide/template-typecheck#input-setter-coercion) in directives that are used when type-checking input bindings.
However, since [TypeScript 4.3](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html#separate-write-types-on-properties) the limitation has been removed; setters can now accept a wider type than what is returned by the getter.
This means that input coercion fields are no longer needed, as their effects can be achieved by widening the type of the setter.

为了减轻这种限制，可以在对输入绑定进行类型检查时用到的指令中声明[输入 setter 强制类型转换字段](guide/template-typecheck#input-setter-coercion)。但是，从 [TypeScript 4.3](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html#separate-write-types-on-properties) 开始，此限制已被移除； setter 现在可以接受比 getter 返回的类型更宽泛的类型。这意味着不再需要输入强制类型转换字段，因为它们的效果可以通过拓宽 setter 的类型来实现。

For example, the following directive:

比如，以下指令：

<code-example path="deprecation-guide/src/app/submit-button/submit-button.component.ts" language="typescript" region="submitButtonNarrow"></code-example>

can be refactored as follows:

可以重构如下：

<code-example path="deprecation-guide/src/app/submit-button/submit-button.component.ts" language="typescript" region="submitButton"></code-example>

<a id="full-template-type-check"></a>

### `fullTemplateTypeCheck`

When compiling your application using the AOT compiler, your templates are type-checked according to a certain strictness level.
Before Angular 9 there existed only two strictness levels of template type checking as determined by [the `fullTemplateTypeCheck` compiler option](guide/angular-compiler-options).
In version 9 the `strictTemplates` family of compiler options has been introduced as a more fine-grained approach to configuring how strict your templates are being type-checked.

使用 AOT 编译器编译你的应用程序时，你的模板会根据特定的严格级别进行类型检查。在 Angular 9 之前，[`fullTemplateTypeCheck` 编译器选项](guide/angular-compiler-options)只支持两个严格级别的模板类型检查。在版本 9 中引入了 `strictTemplates` 系列编译器选项，作为一种更细粒度的方法来配置模板的类型检查的严格程度。

The `fullTemplateTypeCheck` flag is being deprecated in favor of the new `strictTemplates` option and its related compiler options.
Projects that currently have `fullTemplateTypeCheck: true` configured can migrate to the following set of compiler options to achieve the same level of type-checking:

`fullTemplateTypeCheck` 标志已被弃用，取代它的是新的 `strictTemplates` 选项及其相关的编译器选项。当前已配置为 `fullTemplateTypeCheck: true` 的项目可以迁移到以下编译器选项集以实现相同级别的类型检查：

<code-example language="json" header="tsconfig.app.json">

{
  "angularCompilerOptions": {
    &hellip;
    "strictTemplates": true,
    "strictInputTypes": false,
    "strictNullInputTypes": false,
    "strictAttributeTypes": false,
    "strictOutputEventTypes": false,
    "strictDomEventTypes": false,
    "strictDomLocalRefTypes": false,
    "strictSafeNavigationTypes": false,
    "strictContextGenerics": false,
    &hellip;
  }
}

</code-example>

<a id="jit-api-changes"></a>

## JIT API changes due to ViewEngine deprecation

## 由于 ViewEngine 弃用而导致的 JIT API 更改

In ViewEngine, [JIT compilation](https://angular.io/guide/glossary#jit) required special providers (like `Compiler`, `CompilerFactory`, etc.) to be injected in the app and corresponding methods to be invoked.
With Ivy, JIT compilation takes place implicitly if the Component, NgModule, etc have not already been [AOT compiled](https://angular.io/guide/glossary#aot).
Those special providers were made available in Ivy for backwards-compatibility with ViewEngine to make the transition to Ivy smoother.
Since ViewEngine is deprecated and will soon be removed, those symbols are now deprecated as well.

在 ViewEngine 中，[JIT 编译](https://angular.io/guide/glossary#jit)需要在应用程序中注入特殊的提供者（如 `Compiler`、`CompilerFactory` 等）并调用相应的方法。使用 Ivy，如果 Component、NgModule 等尚未进行 [AOT 编译](https://angular.io/guide/glossary#aot)，则 JIT 编译会隐式进行。这些特殊的提供者在 Ivy 中仍然可用，以便与 ViewEngine 向后兼容，从而使向 Ivy 的过渡更加顺畅。由于 ViewEngine 已被弃用并将很快被删除，因此这些符号现在也已被弃用。

<div class="alert is-important">

**IMPORTANT**: <br />
this deprecation doesn't affect JIT mode in Ivy (JIT remains available with Ivy, however we are exploring a possibility of deprecating it in the future.
See [RFC: Exploration of use-cases for Angular JIT compilation mode](https://github.com/angular/angular/issues/43133)).

**重要**：<br />
此弃用不会影响 Ivy 中的 JIT 模式（JIT 在 Ivy 中仍然可用，但是我们正在探索将来弃用它的可能性。参阅 [RFC：Angular JIT 编译模式的用例探索](https://github.com/angular/angular/issues/43133)）。

</div>

<a id="testrequest-errorevent"></a>

### `TestRequest` accepting `ErrorEvent`

### `TestRequest` 接受 `ErrorEvent` 参数

Angular provides utilities for testing `HttpClient`.
The `TestRequest` class from `@angular/common/http/testing` mocks HTTP request objects for use with `HttpTestingController`.

Angular 提供了一些用于测试 `HttpClient` 的实用工具。`@angular/common/http/testing` 中的 `TestRequest` 类会模拟 HTTP 请求对象以与 `HttpTestingController` 一起使用。

`TestRequest` provides an API for simulating an HTTP response with an error.
In earlier versions of Angular, this API accepted objects of type `ErrorEvent`, which does not match the type of error event that browsers return natively.
If you use `ErrorEvent` with `TestRequest`, you should switch to `ProgressEvent`.

`TestRequest` 提供了一个 API 来模拟带有错误的 HTTP 响应。在早期版本的 Angular 中，此 API 接受 `ErrorEvent` 类型的对象，这与浏览器本机返回的错误事件类型不匹配。如果你要将 `ErrorEvent` 与 `TestRequest` 一起使用，就应该切换到 `ProgressEvent`。

Here is an example using a `ProgressEvent`:

这是使用 `ProgressEvent` 的示例：

<code-example format="typescript" language="typescript">

const mockError = new ProgressEvent('error');
const mockRequest = httpTestingController.expectOne(..);

mockRequest.error(mockError);

</code-example>

<a id="deprecated-cli-flags"></a>

## Deprecated CLI APIs and Options

## 弃用的 CLI API 和选项

This section contains a complete list all of the currently deprecated CLI flags.

本节包含所有当前已弃用的 CLI 标志的完整列表。

### @angular/cli

| API/Option | May be removed in | Details |
| :--------- | :---------------- | :------ |
| API/选项 | 可能会在 | 详细信息 |
| `--prod` | <!--v12--> v14 | Use `--configuration production` instead. |
| `--prod` | <!--v12--> v14 | 改用 `--configuration production` 方式。 |
| `ng update --all` | <!--v11--> v14 | No longer has an effect. |
| `ng update --all` | <!--v11--> v14 | 已经不起作用了。 |

### @angular-devkit/build-angular

| API/Option | May be removed in | Details |
| :--------- | :---------------- | :------ |
| API/选项 | 可能会在 | 详细信息 |
| `deployUrl` | <!--v13--> v15 | Use `baseHref` option, `APP_BASE_HREF` DI token or a combination of both instead. For more information, see [the deploy url](guide/deployment#the-deploy-url). |
| `deployUrl` | <!--v13--> v15 | 使用 `baseHref` 选项、 `APP_BASE_HREF` DI 令牌或两者的组合。有关更多信息，参阅[部署 url](guide/deployment#the-deploy-url)。 |
| `showCircularDependencies` | <!--v12--> v14 | The recommended method to detect circular dependencies in project code is to use either a lint rule or other external tooling. |
| `showCircularDependencies` | <!--v12--> v14 | 在项目代码中检测循环依赖的推荐方法是使用 lint 规则或其他外部工具。 |
| Protractor builder | <!--v12--> v14 | Deprecate as part of the Protractor deprecation. |
| Protractor 构建器 | <!--v12--> v14 | 作为 Protractor 弃用的一部分而弃用。 |

### @angular-devkit/build-optimizer

The entire NPM package is deprecated.
It has always been experimental (never hit `1.0.0`) and has
been an internal package for the Angular CLI.
All the relevant functionality has been moved to
`@angular-devkit/build-angular`

整个 NPM 包已弃用。它一直是实验性的（从未达到 `1.0.0`）并且一直是 Angular CLI 的内部包。所有相关特性都已移至 `@angular-devkit/build-angular` 

<a id="removed"></a>

## Removed APIs

## 删除的 API

The following APIs have been removed starting with version 11.0.0\*:

从 11.0.0\*开始，已经移除了以下 API：

| Package | API | Replacement | Details |
| :------ | :-- | :---------- | :------ |
| 包 | API | 替代品 | 详情 |
| `@angular/router` | `preserveQueryParams` | [`queryParamsHandling`](api/router/UrlCreationOptions#queryParamsHandling) |  |

\* To see APIs removed in version 10, check out this guide on the [version 10 docs site](https://v10.angular.io/guide/deprecations#removed).

\* 要查看版本 10 中移除的 API，请查看 [版本 10 文档站点](https://v10.angular.cn/guide/deprecations#removed)上的本指南。

<a id="style-sanitization"></a>

### Style Sanitization for `[style]` and `[style.prop]` bindings

### `[style]` 和 `[style.prop]` 绑定的样式清理

Angular used to sanitize `[style]` and `[style.prop]` bindings to prevent malicious code from being inserted through `javascript:` expressions in CSS `url()` entries.
However, most modern browsers no longer support the usage of these expressions, so sanitization was only maintained for the sake of IE 6 and 7.
Given that Angular does not support either IE 6 or 7 and sanitization has a performance cost, we will no longer sanitize style bindings as of version 10 of Angular.

Angular 会清理 `[style]` 和 `[style.prop]` 绑定，以防止恶意代码通过 CSS `url()` 条目中的 `javascript:` 表达式进行插入。但是，大多数现代浏览器都已不再支持这些表达式的使用，所以这种清理只对 IE 6 和 7 才有意义。鉴于 Angular 不支持 IE 6 或 7，并且这种清理有性能代价，因此我们将不再清理 Angular 版本 10 中的样式绑定。

### `loadChildren` string syntax in `@angular/router`

### `@angular/router` 中的 `loadChildren` 字符串语法

It is no longer possible to use the `loadChildren` string syntax to configure lazy routes.
The string syntax has been replaced with dynamic import statements.
The `DeprecatedLoadChildren` type was removed from `@angular/router`.
Find more information about the replacement in the [`LoadChildrenCallback` documentation](api/router/LoadChildrenCallback).

不能再用 `loadChildren` 字符串语法来配置惰性路由。字符串语法已替换为动态导入语句。`DeprecatedLoadChildren` 类型已从 `@angular/router` 中删除。在 [`LoadChildrenCallback` 文档](api/router/LoadChildrenCallback)中查找有关本替换的更多信息。

The supporting classes `NgModuleFactoryLoader`, `SystemJsNgModuleLoader` and `SystemJsNgModuleLoaderConfig` classes were removed from `@angular/core`, as well as `SpyNgModuleFactoryLoader` from `@angular/router`.

支持类 `NgModuleFactoryLoader` 、 `SystemJsNgModuleLoader` 和 `SystemJsNgModuleLoaderConfig` 类已从 `@angular/core` 中删除，并且 `SpyNgModuleFactoryLoader` 已从 `@angular/router` 中删除。

### `WrappedValue`

The purpose of `WrappedValue` was to allow the same object instance to be treated as different for the purposes of change detection.
It was commonly used with the `async` pipe in the case where the `Observable` produces the same instance of the value.

`WrappedValue` 是为了供变更检测用的，它允许将相同的对象实例视为不同的。在 `Observable` 产生相同值实例的情况下，它通常与 `async` 管道一起使用。

Given that this use case is relatively rare and special handling impacted application performance, the `WrappedValue` API has been removed in Angular 13.

鉴于此用例相对较少且特殊处理会影响应用程序性能，`WrappedValue` API 已在 Angular 13 中删除。

If you rely on the behavior that the same object instance should cause change detection, you have two options:

如果你依赖同一个对象实例应该引起更改检测的行为，你有两个选择：

* Clone the resulting value so that it has a new identity

  克隆结果值，使其具有新的标识。

* Explicitly call [`ChangeDetectorRef.detectChanges()`](api/core/ChangeDetectorRef#detectchanges) to force the update

  显式调用[`ChangeDetectorRef.detectChanges()`](api/core/ChangeDetectorRef#detectchanges)以强制更新

<!-- links -->

[AioGuideI18nCommonMergeDefineLocalesInTheBuildConfiguration]: guide/i18n-common-merge#define-locales-in-the-build-configuration "Define locales in the build configuration - Common Internationalization task #6: Merge translations into the application | Angular"

<!-- end links -->

@reviewed 2022-02-28
# Deprecated APIs and features

# 弃用的 API 和特性

Angular strives to balance innovation and stability.
Sometimes, APIs and features become obsolete and need to be removed or replaced so that Angular can stay current with new best practices, changing dependencies, or changes in the (web) platform itself.

Angular 力图兼顾创新与稳定。但有时，API 和特性已经过时，需要进行删除或替换，以便 Angular 可以及时跟上新的最佳实践、依赖项变更或者 Web 平台自身的变化。

To make these transitions as easy as possible, we deprecate APIs and features for a period of time before removing them. This gives you time to update your applications to the latest APIs and best practices.

为了让这些转换变得尽可能简单，我们会在删除 API 和特性之前先弃用它们一段时间。让你有时间把应用更新到最新的 API 和最佳实践。

This guide contains a summary of all Angular APIs and features that are currently deprecated.

本指南包含了当前不推荐使用的所有 Angular API 和特性的汇总表。

<div class="alert is-helpful">

Features and APIs that were deprecated in v6 or earlier are candidates for removal in version 9 or any later major version. For information about Angular's deprecation and removal practices, see [Angular Release Practices](guide/releases#deprecation-practices "Angular Release Practices: Deprecation practices").

v6 或更早版本中已弃用的特性和 API 将会在版本 9 或更高级版本中删除。要了解 Angular 中关于弃用和删除的实践，参阅[Angular 发布实践](guide/releases#deprecation-practices "Angular 发布实践：弃用实践")。

For step-by-step instructions on how to update to the latest Angular release, use the interactive update guide at [update.angular.io](https://update.angular.io).

关于如何更新到最新 Angular 版本的分步说明，参阅 [update.angular.io](https://update.angular.io) 上的交互式更新指南。

</div>

## Index

## 索引

To help you future-proof your projects, the following table lists all deprecated APIs and features, organized by the release in which they are candidates for removal. Each item is linked to the section later in this guide that describes the deprecation reason and replacement options.

为了帮助你确保项目的前瞻性，下表列出了所有已弃用的 API 和功能，这些 API 和功能按发行版进行组织，它们将被删除。每个条目都链接到本指南后面的部分，该部分描述了弃用原因和替换选项。

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
v13 -> v16
-->

| Area | API or Feature | May be removed in |
| ---- | -------------- | ----------------- |
| 区域 | API 或特性 | 可能会在什么时候移除 |
| `@angular/common` | [`ReflectiveInjector`](#reflectiveinjector) | <!--v8--> v11 |
| `@angular/common` | [`CurrencyPipe` - `DEFAULT_CURRENCY_CODE`](api/common/CurrencyPipe#currency-code-deprecation) | <!--v9--> v11 |
| `@angular/common/http` | [`XhrFactory`](api/common/http/XhrFactory) | <!--v12--> v15 |
| `@angular/core` | [`DefaultIterableDiffer`](#core) | <!--v7--> v11 |
| `@angular/core` | [`ReflectiveKey`](#core) | <!--v8--> v11 |
| `@angular/core` | [`RenderComponentType`](#core) | <!--v7--> v11 |
| `@angular/core` | [Factory-based signature of `ApplicationRef.bootstrap`](#core) | <!--v13--> v15 |
| `@angular/core` | [`ApplicationRef.bootstrap` 的基于工厂的方法签名](#core) | <!--v13--> v15 |
| `@angular/core` | [`PlatformRef.bootstrapModuleFactory`](#core) | <!--v13--> v15 |
| `@angular/core` | [`getModuleFactory`](#core) | <!--v13--> v16 |
| `@angular/core` | [`ModuleWithComponentFactories`](#core) | <!--v13--> v16 |
| `@angular/core` | [`Compiler`](#core) | <!--v13--> v16 |
| `@angular/core` | [`CompilerFactory`](#core) | <!--v13--> v16 |
| `@angular/core` | [`NgModuleFactory`](#core) | <!--v13--> v16 |
| `@angular/platform-browser-dynamic` | [`JitCompilerFactory`](#platform-browser-dynamic) | <!--v13--> v16 |
| `@angular/forms` | [`ngModel` with reactive forms](#ngmodel-reactive) | <!--v6--> v11 |
| `@angular/forms` | [响应式表单中的 `ngModel`](#ngmodel-reactive) | <!--v6-->v11 |
| `@angular/upgrade` | [`@angular/upgrade`](#upgrade) | <!--v8--> v11 |
| `@angular/upgrade` | [`getAngularLib`](#upgrade-static) | <!--v8--> v11 |
| `@angular/upgrade` | [`setAngularLib`](#upgrade-static) | <!--v8--> v11 |
| template syntax | [`<template>`](#template-tag) | <!--v7--> v11 |
| 模板语法 | [`<template>`](#template-tag) | <!--v7-->v11 |
| polyfills | [reflect-metadata](#reflect-metadata) | <!--v8--> v11 |
| 腻子脚本 | [reflect-metadata](#reflect-metadata) | <!--v8-->v11 |
| npm package format | [`esm5` and `fesm5` entry-points in @angular/\* npm packages](guide/deprecations#esm5-fesm5) | <!-- v9 --> v11 |
| npm 软件包格式 | [@angular/\* npm 包中的 `esm5` 和 `fesm5` 入口点](guide/deprecations#esm5-fesm5) | <!-- v9 --> v11 |
| `@angular/compiler-cli` | [Input setter coercion](#input-setter-coercion) | <!--v13--> v15 |
| `@angular/compiler-cli` | [输入属性 setter 的强制类型转换](#input-setter-coercion) | <!--v13--> v15 |
| `@angular/compiler-cli` | [`fullTemplateTypeCheck`](#full-template-type-check) | <!--v13--> v15 |
| `@angular/core` | [`defineInjectable`](#core) | <!--v8--> v11 |
| `@angular/core` | [`entryComponents`](api/core/NgModule#entryComponents) | <!--v9--> v11 |
| `@angular/core` | [`ANALYZE_FOR_ENTRY_COMPONENTS`](api/core/ANALYZE_FOR_ENTRY_COMPONENTS) | <!--v9--> v11 |
| `@angular/core` | [Factory-based signature of `ViewContainerRef.createComponent`](api/core/ViewContainerRef#createComponent) | <!--v13--> v15 |
| `@angular/core` | [`ViewContainerRef.createComponent` 的基于工厂的方法签名](api/core/ViewContainerRef#createComponent) | <!--v13--> v15 |
| `@angular/core/testing` | [`TestBed.get`](#testing) | <!--v9--> v12 |
| `@angular/core/testing` | [`async`](#testing) | <!--v9--> v12 |
| `@angular/core/testing` | [`aotSummaries` argument in `TestBed.initTestEnvironment`](#testing) | <!--v13--> v14 |
| `@angular/core/testing` | [`aotSummaries` 中的 `TestBed.initTestEnvironment` 参数](#testing) | <!--v13--> v14 |
| `@angular/core/testing` | [`aotSummaries` field of the `TestModuleMetadata` type](#testing) | <!--v13--> v14 |
| `@angular/core/testing` | [`TestModuleMetadata` 类型的 `aotSummaries` 字段](#testing) | <!--v13--> v14 |
| `@angular/forms` | [`FormBuilder.group` legacy options parameter](api/forms/FormBuilder#group) | <!--v11--> v14 |
| `@angular/forms` | [`FormBuilder.group` 老式选项参数](api/forms/FormBuilder#group) | <!--v11--> v14 |
| `@angular/router` | [`ActivatedRoute` params and `queryParams` properties](#activatedroute-props) | unspecified |
| `@angular/router` | [`ActivatedRoute` 参数和 `queryParams` 属性](#activatedroute-props) | 未定 |
| `@angular/platform-server` | [`renderModuleFactory`](#platform-server) | <!--v13--> v15 |
| `@angular/service-worker` | [`SwUpdate#activated`](api/service-worker/SwUpdate#activated) | <!--v13--> v16 |
| `@angular/service-worker` | [`SwUpdate#available`](api/service-worker/SwUpdate#available) | <!--v13--> v16 |
| template syntax | [`/deep/`, `>>>`, and `::ng-deep`](#deep-component-style-selector) | <!--v7--> unspecified |
| 模板语法 | [`/deep/`, `>>>`, 和 `::ng-deep`](#deep-component-style-selector) | <!--v7--> 未定 |
| template syntax | [`bind-`, `on-`, `bindon-`, and `ref-`](#bind-syntax) | <!--v13--> v15 |
| 模板语法 | [`bind-`、`on-`、`bindon-` 和 `ref-`](#bind-syntax) | <!--v13--> v15 |

For information about Angular CDK and Angular Material deprecations, see the [changelog](https://github.com/angular/components/blob/master/CHANGELOG.md).

要了解 Angular CDK 和 Angular Material 的弃用情况，参阅[变更记录](https://github.com/angular/components/blob/master/CHANGELOG.md)。

## Deprecated APIs

## 已弃用的 API

This section contains a complete list all of the currently-deprecated APIs, with details to help you plan your migration to a replacement.

本节包含所有当前已弃用的 API 的完整列表，其中包含一些可帮助你规划如何迁移到其替代品的详细信息。

<div class="alert is-helpful">

**TIP**: In the [API reference section](api) of this site, deprecated APIs are indicated by ~~strikethrough.~~ You can filter the API list by [**Status: deprecated**](api?status=deprecated).

**提示**：在本文档站的 [API 参考手册部分](api)，不推荐使用的 API 会用~~删除线~~标记出来。你可以按[**状态**: 已弃用](api?status=deprecated)来过滤 API 列表。

</div>

{@a common}

### @angular/common

| API | Replacement | Deprecation announced | Notes |
| --- | ----------- | --------------------- | ----- |
| API | 替代品 | 宣布弃用 | 备注 |
| [`CurrencyPipe` - `DEFAULT_CURRENCY_CODE`](api/common/CurrencyPipe#currency-code-deprecation) | `{provide: DEFAULT_CURRENCY_CODE, useValue: 'USD'}` | v9 | From v11 the default code will be extracted from the locale data given by `LOCALE_ID`, rather than `USD`. |
| [`CurrencyPipe` - `DEFAULT_CURRENCY_CODE`](api/common/CurrencyPipe#currency-code-deprecation) | `{provide: DEFAULT_CURRENCY_CODE, useValue: 'USD'}` | v9 | 从 v11 开始，默认代码将从由 `LOCALE_ID` 提供的本地环境数据中提取，而不再是固定值 `USD`。 |

{@a common-http}

### @angular/common/http

| API | Replacement | Deprecation announced | Notes |
| --- | ----------- | --------------------- | ----- |
| API | 替代品 | 宣布弃用 | 备注 |
| [`XhrFactory`](api/common/http/XhrFactory) | `XhrFactory` in `@angular/common` | v12 | The `XhrFactory` has moved from `@angular/common/http` to `@angular/common`. |
| [`XhrFactory`](api/common/http/XhrFactory) | `@angular/common` 中的 `XhrFactory` | v12 | `XhrFactory` 已从 `@angular/common/http` 移到了 `@angular/common`。 |

{@a core}

### @angular/core

| API                                                                                | Replacement                                                                        | Deprecation announced | Notes                                                                                                                                                                                                                                    |
| --- | ----------- | --------------------- | ----- |
| API | 替代品 | 宣布弃用 | 备注 |
| [`DefaultIterableDiffer`](api/core/DefaultIterableDiffer) | n/a | v4 | Not part of public API. |
| [`DefaultIterableDiffer`](api/core/DefaultIterableDiffer) | 不适用 | v4 | 不属于公共 API。 |
| [`ReflectiveInjector`](api/core/ReflectiveInjector) | `{@link Injector#create Injector.create()}` | v5 | See [`ReflectiveInjector`](#reflectiveinjector) |
| [`ReflectiveInjector`](api/core/ReflectiveInjector) | `{@link Injector#create Injector.create()}` | v5 | 参阅 [`ReflectiveInjector`](#reflectiveinjector) |
| [`ReflectiveKey`](api/core/ReflectiveKey) | none | v5 | none |
| [`ReflectiveKey`](api/core/ReflectiveKey) | 无 | v5 | 无 |
| [`defineInjectable`](api/core/defineInjectable) | `ɵɵdefineInjectable` | v8 | Used only in generated code. No source code should depend on this API. |
| [`defineInjectable`](api/core/defineInjectable) | `ɵɵdefineInjectable` | v8 | 仅在生成的代码中使用。任何源代码都不应依赖此 API。 |
| [`entryComponents`](api/core/NgModule#entryComponents) | none | v9 | See [`entryComponents`](#entryComponents) |
| [`entryComponents`](api/core/NgModule#entryComponents) | 无 | v9 | 参阅 [`entryComponents`](#entryComponents) |
| [`ANALYZE_FOR_ENTRY_COMPONENTS`](api/core/ANALYZE_FOR_ENTRY_COMPONENTS) | none | v9 | See [`ANALYZE_FOR_ENTRY_COMPONENTS`](#entryComponents) |
| [`ANALYZE_FOR_ENTRY_COMPONENTS`](api/core/ANALYZE_FOR_ENTRY_COMPONENTS) | 无 | v9 | 参见 [`ANALYZE_FOR_ENTRY_COMPONENTS`](#entryComponents) |
| [`async`](api/core/testing/async) | [`waitForAsync`](api/core/testing/waitForAsync) | v11 | The [`async`](api/core/testing/async) function from `@angular/core/testing` has been renamed to `waitForAsync` in order to avoid confusion with the native JavaScript <code class="no-auto-link">async</code> syntax. The existing function is deprecated and will be removed in a future version. |
| [`async`](api/core/testing/async) | [`waitForAsync`](api/core/testing/waitForAsync) | v11 | `@angular/core/testing` 中的 `async` 函数已经改名为 `waitForAsync` 以免与 JavaScript 原生 `async` 语法混淆。现有函数已经标记为弃用，并将在未来版本中移除。 |
| [`getModuleFactory`](api/core/getModuleFactory) | [`getNgModuleById`](api/core/getNgModuleById) | v13 | Ivy allows working with NgModule classes directly, without retrieving corresponding factories. |
| [`getModuleFactory`](api/core/getModuleFactory) | [`getNgModuleById`](api/core/getNgModuleById) | v13 |  Ivy 允许直接使用 NgModule 类，而无需获取相应的工厂。  |
| `ViewChildren.emitDistinctChangesOnly` / `ContentChildren.emitDistinctChangesOnly` | none (was part of [issue #40091](https://github.com/angular/angular/issues/40091)) |                       | This is a temporary flag introduced as part of bugfix of [issue #40091](https://github.com/angular/angular/issues/40091) and will be removed.                                                                                            |
| `ViewChildren.emitDistinctChangesOnly` / `ContentChildren.emitDistinctChangesOnly` | 无（作为 [issue #40091](https://github.com/angular/angular/issues/40091)）的一部分] |  | 这是为了修复 [issue #40091](https://github.com/angular/angular/issues/40091)  而引入的临时标志，以后将会被移除。|
| Factory-based signature of [`ApplicationRef.bootstrap`](api/core/ApplicationRef#bootstrap)                          | Type-based signature of [`ApplicationRef.bootstrap`](api/core/ApplicationRef#bootstrap)                                                                                 | v13                    | With Ivy, there is no need to resolve Component factory and Component Type can be provided directly.                                                                                                                                                                                                                  |
| [`ApplicationRef.bootstrap`](api/core/ApplicationRef#bootstrap) 基于工厂的方法签名                         | [`ApplicationRef.bootstrap`](api/core/ApplicationRef#bootstrap) 基于类型的方法签名                                                                                | v13                    | 使用 Ivy 时，不用再解析组件工厂，可以直接提供组件类型。                                                                                                                                                                                                                  |
| [`PlatformRef.bootstrapModuleFactory`](api/core/PlatformRef#bootstrapModuleFactory)                          | [`PlatformRef.bootstrapModule`](api/core/PlatformRef#bootstrapModule)                                                                                 | v13                    | With Ivy, there is no need to resolve NgModule factory and NgModule Type can be provided directly.                                                                                                                                                                                                                  |
| [`PlatformRef.bootstrapModuleFactory`](api/core/PlatformRef#bootstrapModuleFactory)                          | [`PlatformRef.bootstrapModule`](api/core/PlatformRef#bootstrapModule)                                                                                 | v13                    | 使用 Ivy 时，不用再解析组件工厂，可以直接提供组件类型。                                                                                                                                                                                                           |
| [`ModuleWithComponentFactories`](api/core/ModuleWithComponentFactories)                          | none                                                                                 | v13                    | Ivy JIT mode doesn't require accessing this symbol. See [JIT API changes due to ViewEngine deprecation](#jit-api-changes) for additional context.                                                                                                                                                                                                                  |
| [`ModuleWithComponentFactories`](api/core/ModuleWithComponentFactories)                          | 无                                                                                 | v13                    | Ivy 的 JIT 模式不需要访问此符号。参见[由于弃用 ViewEngine 导致的 JIT API 的变化](#jit-api-changes) 以了解额外的上下文。                                                                                                                                                                                                              |
| [`Compiler`](api/core/Compiler)                          | none                                                                                 | v13                    | Ivy JIT mode doesn't require accessing this symbol. See [JIT API changes due to ViewEngine deprecation](#jit-api-changes) for additional context.                                                                                                                                                                                                                  |
| [`Compiler`](api/core/Compiler)                          | 无                                                                                 | v13                    | Ivy 的 JIT 模式不需要访问此符号。参见[由于弃用 ViewEngine 导致的 JIT API 的变化](#jit-api-changes) 以了解额外的上下文。                                                                                                                                                                                                       |
| [`CompilerFactory`](api/core/CompilerFactory)                          | none                                                                                 | v13                    | Ivy JIT mode doesn't require accessing this symbol. See [JIT API changes due to ViewEngine deprecation](#jit-api-changes) for additional context.                                                                                                                                                                                                                  |
| [`CompilerFactory`](api/core/CompilerFactory)                          | 无                                                                                 | v13                    | Ivy 的 JIT 模式不需要访问此符号。参见[由于弃用 ViewEngine 导致的 JIT API 的变化](#jit-api-changes) 以了解额外的上下文。                                                                                                                                                                                                                  |
| [`NgModuleFactory`](api/core/NgModuleFactory)                          | Use non-factory based framework APIs like [PlatformRef.bootstrapModule](api/core/PlatformRef#bootstrapModule) and [createNgModuleRef](api/core/createNgModuleRef)                                                                                 | v13                    | Ivy JIT mode doesn't require accessing this symbol. See [JIT API changes due to ViewEngine deprecation](#jit-api-changes) for additional context.                                                                                                                                                                                                                 |
| [`NgModuleFactory`](api/core/NgModuleFactory)                          | 使用像 [PlatformRef.bootstrapModule](api/core/PlatformRef#bootstrapModule) 和 [createNgModuleRef](api/core/createNgModuleRef) 这样的不基于工厂的 API。                                                                                | v13                    | Ivy 的 JIT 模式不需要访问此符号。参见[由于弃用 ViewEngine 导致的 JIT API 的变化](#jit-api-changes) 以了解额外的上下文。                                                                                                                                                                                                                 |
| [Factory-based signature of `ViewContainerRef.createComponent`](api/core/ViewContainerRef#createComponent)                                                  | [Type-based signature of `ViewContainerRef.createComponent`](api/core/ViewContainerRef#createComponent)                                    | v13                   | Angular no longer requires component factories to dynamically create components. Use different signature of the `createComponent` method, which allows passing Component class directly. |
| [基于方法的 `ViewContainerRef.createComponent`](api/core/ViewContainerRef#createComponent) 方法签名                                                 | 基于类型的 [`ViewContainerRef.createComponent`](api/core/ViewContainerRef#createComponent) 方法签名                                   | v13                   | Angular 不再需要组件工厂来动态创建组件。使用 `createComponent` 方法的另一个签名，它允许直接传入组件类。 |

{@a testing}

### @angular/core/testing

| API | Replacement | Deprecation announced | Notes |
| --- | ----------- | --------------------- | ----- |
| API | 替代品 | 宣布弃用 | 备注 |
| [`TestBed.get`](api/core/testing/TestBed#get) | [`TestBed.inject`](api/core/testing/TestBed#inject) | v9 | Same behavior, but type safe. |
| [`TestBed.get`](api/core/testing/TestBed#get) | [`TestBed.inject`](api/core/testing/TestBed#inject) | v9 | 行为相同，但类型安全。 |
| [`async`](api/core/testing/async) | [`waitForAsync`](api/core/testing/waitForAsync) | v10 | Same behavior, but rename to avoid confusion. |
| [`async`](api/core/testing/async) | [`waitForAsync`](api/core/testing/waitForAsync) | v10 | 行为相同，只是改名以免混淆。 |
| [`aotSummaries` argument in `TestBed.initTestEnvironment`](api/core/testing/TestBed#inittestenvironment) | No replacement needed | v13 | Summary files are unused in Ivy. |
| [`aotSummaries` 中的 `TestBed.initTestEnvironment` 参数](api/core/testing/TestBed#inittestenvironment) | 无需更换 | v13 | Ivy 中未使用摘要文件。 |  |
| [`aotSummaries` field of the `TestModuleMetadata` type](api/core/testing/TestModuleMetadata) | No replacement needed | v13 | Summary files are unused in Ivy. |
| [`TestModuleMetadata` 类型的 `aotSummaries` 字段](api/core/testing/TestModuleMetadata) | 无需更换 | v13 | Ivy 中未使用摘要文件。 |

{@a platform-browser-dynamic}

### @angular/platform-browser-dynamic

| API | Replacement | Deprecation announced | Notes |
| :-- | :---------- | :-------------------- | :---- |
| API | 替代品 | 宣布弃用 | 备注 |
| [`JitCompilerFactory`](api/platform-browser-dynamic/JitCompilerFactory) | none | v13 | This symbol is no longer necessary. See [JIT API changes due to ViewEngine deprecation](#jit-api-changes) for additional context. |
| [`JitCompilerFactory`](api/platform-browser-dynamic/JitCompilerFactory) | 无 | v13 |不再需要此符号。有关其它上下文，请参阅[由于 ViewEngine 弃用而导致的 JIT API 更改](#jit-api-changes)。 |

{@a platform-server}

### @angular/platform-server

| API | Replacement | Deprecation announced | Notes |
| :-- | :---------- | :-------------------- | :---- |
| API | 替代品 | 宣布弃用 | 备注 |
| [`renderModuleFactory`](api/platform-server/renderModuleFactory) | [`renderModule`](api/platform-server/renderModule) | v13 | This symbol is no longer necessary. See [JIT API changes due to ViewEngine deprecation](#jit-api-changes) for additional context. |
| [`renderModuleFactory`](api/platform-server/renderModuleFactory) | [`renderModule`](api/platform-server/renderModule) | v13 | 不再需要此符号。有关其它上下文，请参阅[由于 ViewEngine 弃用而导致的 JIT API 更改](#jit-api-changes)。 |

{@a forms}

### @angular/forms

| API | Replacement | Deprecation announced | Notes |
| --- | ----------- | --------------------- | ----- |
| API | 替代品 | 宣布弃用 | 备注 |
| [`ngModel` with reactive forms](#ngmodel-reactive) | [`FormControlDirective`](api/forms/FormControlDirective) | v6 | none |
| [响应式表单中的 `ngModel`](#ngmodel-reactive) | 参阅 [FormControlDirective 使用说明](api/forms/FormControlDirective) | v6 | 无 |
| [`FormBuilder.group` legacy options parameter](api/forms/FormBuilder#group) | [`AbstractControlOptions` parameter value](api/forms/AbstractControlOptions) | v11 | none |
| [`FormBuilder.group` 老式选项参数](api/forms/FormBuilder#group) | [`AbstractControlOptions` 参数值](api/forms/AbstractControlOptions) | v11 | 无 |

{@a service-worker}

### @angular/service-worker

| API | Replacement | Deprecation announced | Notes |
| :-- | :---------- | :-------------------- | :---- |
| API | 替代品 | 宣布弃用 | 备注 |
| [`SwUpdate#activated`](api/service-worker/SwUpdate#activated) | [`SwUpdate#activateUpdate()` return value](api/service-worker/SwUpdate#activateUpdate) | v13 | The return value of `SwUpdate#activateUpdate()` indicates whether an update was successfully activated. |
| [`SwUpdate#activated`](api/service-worker/SwUpdate#activated) | [`SwUpdate#activateUpdate()` 的返回值](api/service-worker/SwUpdate#activateUpdate) | v13 |  `SwUpdate#activateUpdate()` 的返回值指示更新是否成功激活。 |
| [`SwUpdate#available`](api/service-worker/SwUpdate#available) | [`SwUpdate#versionUpdates`](api/service-worker/SwUpdate#versionUpdates) | v13 | The behavior of `SwUpdate#available` can be rebuilt by filtering for `VersionReadyEvent` events on [`SwUpdate#versionUpdates`](api/service-worker/SwUpdate#versionUpdates) |
| [`SwUpdate#available`](api/service-worker/SwUpdate#available) | [`SwUpdate#versionUpdates`](api/service-worker/SwUpdate#versionUpdates) | v13 | `SwUpdate#available` 的行为可以通过过滤[`SwUpdate#versionUpdates`](api/service-worker/SwUpdate#versionUpdates)上的 `VersionReadyEvent` 事件来重建 |

{@a upgrade}

### @angular/upgrade

| API | Replacement | Deprecation announced | Notes |
| --- | ----------- | --------------------- | ----- |
| API | 替代品 | 宣布弃用 | 备注 |
| [All entry points](api/upgrade) | [`@angular/upgrade/static`](api/upgrade/static) | v5 | See [Upgrading from AngularJS](guide/upgrade). |
| [所有入口点](api/upgrade) | [`@angular/upgrade/static`](api/upgrade/static) | v5 | 参阅 [从 AngularJS 升级](guide/upgrade)。 |

{@a upgrade-static}

### @angular/upgrade/static

| API | Replacement | Deprecation announced | Notes |
| --- | ----------- | --------------------- | ----- |
| API | 替代品 | 宣布弃用 | 备注 |
| [`getAngularLib`](api/upgrade/static/getAngularLib) | [`getAngularJSGlobal`](api/upgrade/static/getAngularJSGlobal) | v5 | See [Upgrading from AngularJS](guide/upgrade). |
| [`getAngularLib`](api/upgrade/static/getAngularLib) | [`getAngularJSGlobal`](api/upgrade/static/getAngularJSGlobal) | v5 | 参阅[从 AngularJS 升级](guide/upgrade)。 |
| [`setAngularLib`](api/upgrade/static/setAngularLib) | [`setAngularJSGlobal`](api/upgrade/static/setAngularJSGlobal) | v5 | See [Upgrading from AngularJS](guide/upgrade). |
| [`setAngularLib`](api/upgrade/static/setAngularLib) | [`setAngularJSGlobal`](api/upgrade/static/setAngularJSGlobal) | v5 | 参阅[从 AngularJS 升级](guide/upgrade)。 |

{@a deprecated-features}

## Deprecated features

## 已弃用的特性

This section lists all of the currently-deprecated features, which includes template syntax, configuration options, and any other deprecations not listed in the [Deprecated APIs](#deprecated-apis) section above. It also includes deprecated API usage scenarios or API combinations, to augment the information above.

本节列出了所有当前已弃用的特性，包括模板语法、配置选项，以及前面[已弃用的 API ](#deprecated-apis)部分未列出的其它弃用。它还包括已弃用的 API 用例或 API 组合，以增强上述信息。

{@a bazelbuilder}

### Bazel builder and schematics

### Bazel 构建器及其原理图

Bazel builder and schematics were introduced in Angular Labs to let users try out Bazel without having to manage Bazel version and BUILD files.
This feature has been deprecated. For more information, please refer to the [migration doc](https://github.com/angular/angular/blob/master/packages/bazel/docs/BAZEL_SCHEMATICS.md).

Bazel 构建器及其原理图曾经被引入到 Angular Labs 中，以便让用户尝试 Bazel，而不用管理 Bazel 的版本和 BUILD 文件。
该特性已经弃用了。欲知详情，参阅[迁移文档](https://github.com/angular/angular/blob/master/packages/bazel/docs/BAZEL_SCHEMATICS.md)。

{@a wtf}

### Web Tracing Framework integration

### Web 跟踪框架集成

Angular previously supported an integration with the [Web Tracing Framework (WTF)](https://google.github.io/tracing-framework) for performance testing of Angular applications. This integration has not been maintained and is now defunct. As a result, the integration was deprecated in Angular version 8, and due to no evidence of any existing usage, removed in version 9.

Angular 以前支持与 [Web 跟踪框架（WTF）](https://google.github.io/tracing-framework/)集成，用于 Angular 应用程序的性能测试。此集成已经停止维护并失效。因此，该集成在 Angular 版本 8 中被弃用，并且由于没有证据表明在版本 9 中删除了任何现有用法。

{@a deep-component-style-selector}

### `/deep/`, `>>>`, and `::ng-deep` component style selectors

### `/deep/`，`>>>` 和 `:ng-deep` 组件样式选择器

The shadow-dom-piercing descendant combinator is deprecated and support is being [removed from major browsers and tools](https://developers.google.com/web/updates/2017/10/remove-shadow-piercing). As such, in v4 we deprecated support in Angular for all three of `/deep/`, `>>>`, and `::ng-deep`. Until removal, `::ng-deep` is preferred for broader compatibility with the tools.

刺穿 Shadow DOM 的 CSS 组合符已经弃用，并且[主要的浏览器和工具都已删除它](https://developers.google.com/web/updates/2017/10/remove-shadow-piercing)。因此，在 v4 中，Angular 也弃用了对 `/deep/`，`>>>` 和 `::ng-deep` 的支持。在彻底删除它之前，我们首选 `::ng-deep`，以便和各种工具实现更广泛的兼容。

For more information, see [/deep/, >>>, and ::ng-deep](guide/component-styles#deprecated-deep--and-ng-deep "Component Styles guide, Deprecated deep and ngdeep") in the Component Styles guide.

欲知详情，参阅“组件样式”一章中的 [/deep/，>>> 和 :: ng-deep](guide/component-styles#deprecated-deep--and-ng-deep "“组件样式”指南，代号为 deep 和 ngdeep")。

{@a bind-syntax}

### `bind-`, `on-`, `bindon-`, and `ref-` prefixes

### `bind-` 、 `on-` 、 `bindon-` 和 `ref-` 前缀

The template prefixes `bind-`, `on-`, `bindon-`, and `ref-` have been deprecated in v13. Templates
should use the more widely documented syntaxes for binding and references:

模板前缀 `bind-` 、 `on-` 、 `bindon-` 和 `ref-` 在 v13 中已被弃用。模板应该使用文档的主流语法进行绑定和引用：

* `[input]="value"` instead of `bind-input="value"`

  `[input]="value"` 而不是 `bind-input="value"`

* `[@trigger]="value"` instead of	`bind-animate-trigger="value"`

  `[@trigger]="value"` 而不是 `bind-animate-trigger="value"`

* `(click)="onClick()"` instead of `on-click="onClick()"`

  `(click)="onClick()"` 而不是 `on-click="onClick()"`

* `[(ngModel)]="value"` instead of `bindon-ngModel="value"`

  `[(ngModel)]="value"` 而不是 `bindon-ngModel="value"`

* `#templateRef` instead of `ref-templateRef`

  `#templateRef` 而不是 `ref-templateRef`

{@a template-tag}

### `<template>` tag

### `<template>` 标签

The `<template>` tag was deprecated in v4 to avoid colliding with the DOM's element of the same name (such as when using web components). Use `<ng-template>` instead. For more information, see the [Ahead-of-Time Compilation](guide/aot-compiler) guide.

`<template>` 标签在 v4 中已经弃用，以消除和 DOM 中同名元素的冲突（比如在使用 Web Components 时）。请用 `<ng-template>` 代替。欲知详情，参阅[预先编译](guide/aot-compiler)一章。

{@a ngmodel-reactive}

### ngModel with reactive forms

### 和响应式表单一起使用 ngModel

Support for using the `ngModel` input property and `ngModelChange` event with reactive form directives has been deprecated in Angular v6 and will be removed in a future version of Angular.

对于和响应式表单指令一起使用输入属性 `ngModel` 和事件 `ngModelChange` 的支持已经在 Angular 6 中弃用，并且会在未来的 Angular 版本中移除。

Now deprecated:

现在已经弃用：

<code-example language="html">

&lt;input [formControl]="control" [(ngModel)]="value"&gt;

</code-example>

<code-example language="typescript">

this.value = 'some value';

</code-example>

This support was deprecated for several reasons. First, developers found this pattern confusing. It seems like the actual `ngModel` directive is being used, but in fact it's an input/output property named `ngModel` on the reactive form directive that approximates some, but not all, of the directive's behavior.
It allows getting and setting a value and intercepting value events, but some of `ngModel`'s other features, such as delaying updates with`ngModelOptions` or exporting the directive, don't work.

出于多种原因，此支持已被弃用。首先，开发人员发现这种模式令人困惑。似乎正在使用实际的 `ngModel` 指令，但实际上它是响应式表单指令上名为 `ngModel` 的输入/输出属性，它与该指令的某些行为相近，但又不是全同。它允许获取和设置值并拦截值事件，但 `ngModel` 的一些其它功能，例如使用 `ngModelOptions`、延迟更新或导出指令，都不起作用。

In addition, this pattern mixes template-driven and reactive forms strategies, which prevents taking advantage of the full benefits of either strategy.
Setting the value in the template violates the template-agnostic principles behind reactive forms, whereas adding a `FormControl`/`FormGroup` layer in the class removes the convenience of defining forms in the template.

另外，该模式混用了模板驱动和响应式这两种表单策略，这会妨碍我们获取任何一种策略的全部优点。
在模板中设置值的方式，违反了响应式表单所遵循的“模板无关”原则；反之，在类中添加 `FormControl`/`FormGroup` 层也破坏了“在模板中定义表单”的约定。

To update your code before support is removed, you'll want to decide whether to stick with reactive form directives (and get/set values using reactive forms patterns) or switch to template-driven directives.

要想在它被移除之间修改代码，你需要决定是选定响应式表单指令（以及使用响应式表单模式来存取这些值），还是切换到模板驱动指令。

**After** (choice 1 - use reactive forms):

**之后** (选择 1 - 使用响应式表单)：

<code-example language="html">

&lt;input [formControl]="control"&gt;

</code-example>

<code-example language="typescript">

this.control.setValue('some value');

</code-example>

**After** (choice 2 - use template-driven forms):

**改后**（选择 2 - 使用模板驱动表单）：

<code-example language="html">

&lt;input [(ngModel)]="value"&gt;

</code-example>

<code-example language="typescript">

this.value = 'some value';

</code-example>

By default, when you use this pattern, you will see a deprecation warning once in dev mode. You can choose to silence this warning by configuring `ReactiveFormsModule` at import time:

默认情况下，当使用这种模式时，你会在开发模式下看到一个弃用警告。你可以通过在导入 `ReactiveFormsModule` 时进行配置来来禁用此警告：

<code-example language="typescript">

imports: [
  ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'});
]

</code-example>

Alternatively, you can choose to surface a separate warning for each instance of this pattern with a configuration value of `"always"`. This may help to track down where in the code the pattern is being used as the code is being updated.

另外，你可以选择针对使用此模式的每个实例来使用配置值 `"always"` 来为它们单独显示警告。当修改代码时，这可以帮助你跟踪都有哪里使用了该模式。

{@a reflectiveinjector}

### ReflectiveInjector

In v5, Angular replaced the `ReflectiveInjector` with the `StaticInjector`. The injector no longer requires the Reflect polyfill, reducing application size for most developers.

在 v5 中，Angular 用 `StaticInjector` 代替了 `ReflectiveInjector`。该注入器不再需要 Reflect 的腻子脚本，对大部分开发人员来说都显著减小了应用的体积。

**Before**:

**之前**:

<code-example language="typescript">

ReflectiveInjector.resolveAndCreate(providers);

</code-example>

**After**:

**之后**：

<code-example language="typescript">

Injector.create({providers});

</code-example>

{@a loadChildren}

### loadChildren string syntax

### loadChildren 字符串语法

When Angular first introduced lazy routes, there wasn't browser support for dynamically loading additional JavaScript. Angular created our own scheme using the syntax `loadChildren: './lazy/lazy.module#LazyModule'` and built tooling to support it. Now that ECMAScript dynamic import is supported in many browsers, Angular is moving toward this new syntax.

当 Angular 第一次引入惰性路由时，还没有浏览器能支持动态加载额外的 JavaScript。因此 Angular 创建了自己的方案，所用的语法是 `loadChildren: './lazy/lazy.module#LazyModule'` 并且还构建了一些工具来支持它。现在，很多浏览器都已支持 ECMAScript 的动态导入，Angular 也正朝着这个新语法前进。

In version 8, the string syntax for the [`loadChildren`](api/router/LoadChildren) route specification was deprecated, in favor of new syntax that uses `import()` syntax.

在第 8 版中，不推荐使用 [`loadChildren`](api/router/LoadChildren) 路由规范的字符串语法，[`loadChildren`](api/router/LoadChildren) 支持使用基于 `import()` 的新语法。

**Before**:

**之前**:

<code-example language="typescript">

const routes: Routes = [{
  path: 'lazy',
  // The following string syntax for loadChildren is deprecated
  loadChildren: './lazy/lazy.module#LazyModule'
}];

</code-example>

**After**:

**之后**:

<code-example language="typescript">

const routes: Routes = [{
  path: 'lazy',
  // The new import() syntax
  loadChildren: () => import('./lazy/lazy.module').then(m => m.LazyModule)
}];

</code-example>

<div class="alert is-helpful">

**Version 8 update**: When you update to version 8, the [`ng update`](cli/update) command performs the transformation automatically. Prior to version 7, the `import()` syntax only works in JIT mode (with view engine).

**版本 8 更新**：当你升级到版本 8 时，[`ng update`](cli/update) 命令会自动执行转换。在版本 7 之前，`import()` 语法只能在 JIT 模式下运行（和视图引擎一起）。

</div>

<div class="alert is-helpful">

**Declaration syntax**: It's important to follow the route declaration syntax `loadChildren: () => import('...').then(m => m.ModuleName)` to allow `ngc` to discover the lazy-loaded module and the associated `NgModule`. You can find the complete list of allowed syntax constructs [here](https://github.com/angular/angular-cli/blob/a491b09800b493fe01301387fa9a025f7c7d4808/packages/ngtools/webpack/src/transformers/import_factory.ts#L104-L113). These restrictions will be relaxed with the release of Ivy since it'll no longer use `NgFactories`.

**声明语法**：遵循路由声明语法 `loadChildren: () => import('...').then(m => m.ModuleName)` 是很重要的，这样 `ngc` 才能发现这个惰性加载模块及其相关的 `NgModule`。你可以在[这里](https://github.com/angular/angular-cli/blob/a491b09800b493fe01301387fa9a025f7c7d4808/packages/ngtools/webpack/src/transformers/import_factory.ts#L104-L113)找到受支持的语法的完整列表。在 Ivy 发布后会放松这种限制，因为 Ivy 不再用 `NgFactories` 了。

</div>

{@a activatedroute-props}

### ActivatedRoute params and queryParams properties

### ActivatedRoute 的 params 和 queryParams 属性

[ActivatedRoute](api/router/ActivatedRoute) contains two [properties](api/router/ActivatedRoute#properties) that are less capable than their replacements and may be deprecated in a future Angular version.

[ActivatedRoute](api/router/ActivatedRoute) 包含两个[属性](api/router/ActivatedRoute#properties)，它们的能力低于它们的替代品，在将来的 Angular 版本中可能会弃用。

| Property | Replacement |
| -------- | ----------- |
| 属性 | 替代品 |
| `params` | `paramMap` |
| `queryParams` | `queryParamMap` |

For more information see the [Getting route information](guide/router-reference#activated-route) section of the [Router guide](guide/router).

欲知详情，参阅[路由器指南](guide/router-reference#activated-route)。

{@a reflect-metadata}

### Dependency on a reflect-metadata polyfill in JIT mode

### 在 JIT 模式下对 reflect-metadata 腻子脚本的依赖

Angular applications, and specifically applications that relied on the JIT compiler, used to require a polyfill for the [reflect-metadata](https://github.com/rbuckton/reflect-metadata) APIs.

Angular 应用程序，特别是依赖于 JIT 编译器的应用程序，过去常常需要 [reflect-metadata](https://github.com/rbuckton/reflect-metadata) API 的腻子脚本。

The need for this polyfill was removed in Angular version 8.0 ([see #14473](https://github.com/angular/angular-cli/pull/14473)), rendering the presence of the poylfill in most Angular applications unnecessary. Because the polyfill can be depended on by 3rd-party libraries, instead of removing it from all Angular projects, we are deprecating the requirement for this polyfill as of version 8.0. This should give library authors and application developers sufficient time to evaluate if they need the polyfill, and perform any refactoring necessary to remove the dependency on it.

在 Angular 8.0 版中不再需要这种 polyfill（[参阅#14473](https://github.com/angular/angular-cli/pull/14473) ），从而使大多数 Angular 应用程序中都不需要使用这个腻子脚本。因为这个腻子脚本可能由第三方库依赖，所以没有从所有 Angular 项目中删除它，所以我们不建议从 8.0 版本开始再使用这个腻子脚本。这应该能给库作者和应用程序开发人员足够的时间来评估他们是否需要这个腻子脚本，并执行必要的重构以消除对它的依赖。

In a typical Angular project, the polyfill is not used in production builds, so removing it should not impact production applications. The goal behind this removal is overall simplification of the build setup and decrease in the number of external dependencies.

在典型的 Angular 项目中，这个腻子脚本不用于生产版本，因此删除它不会影响生产环境的应用程序。删除它是为了从整体上上简化构建设置并减少外部依赖项的数量。

{@a static-query-resolution}

### `@ViewChild()` / `@ContentChild()` static resolution as the default

### 把 `@ViewChild()` / `@ContentChild()` 静态解析为默认值

See the [dedicated migration guide for static queries](guide/static-query-migration).

参阅[静态查询的专用迁移指南](guide/static-query-migration)。

{@a contentchild-input-together}

### `@ContentChild()` / `@Input()` used together

### `@ContentChild()` / `@Input()` 一起使用

The following pattern is deprecated:

以下模式已弃用：

<code-example language="typescript">

@Input() @ContentChild(TemplateRef) tpl !: TemplateRef&lt;any&gt;;

</code-example>

Rather than using this pattern, separate the two decorators into their own
properties and add fallback logic as in the following example:

与其使用这种模式，还不如将两个装饰器添加到各自的属性上并添加回退逻辑，如以下范例所示：

<code-example language="typescript">

@Input() tpl !: TemplateRef&lt;any&gt;;
@ContentChild(TemplateRef) inlineTemplate !: TemplateRef&lt;any&gt;;

</code-example>

{@a cant-assign-template-vars}

### Cannot assign to template variables

### 无法赋值给模板变量

In the following example, the two-way binding means that `optionName`
should be written when the `valueChange` event fires.

在下面的范例中，双向绑定意味着在 `valueChange` 事件触发时应该写入 `optionName`。

<code-example language="html">

&lt;option *ngFor="let optionName of options" [(value)]="optionName"&gt;&lt;/option&gt;

</code-example>

However, in practice, Angular ignores two-way bindings to template variables. Starting in version 8, attempting to write to template variables is deprecated. In a future version, we will throw to indicate that the write is not supported.

但实际上，Angular 只是忽略了对模板变量的双向绑定。从版本 8 开始，试图写入模板变量已弃用。在将来的版本中，我们将不支持这种写操作。

<code-example language="html">

&lt;option *ngFor="let optionName of options" [value]="optionName"&gt;&lt;/option&gt;

</code-example>

{@a binding-to-innertext}

### Binding to `innerText` in `platform-server`

### 在 `platform-server` 中绑定到 `innerText`

[Domino](https://github.com/fgnass/domino), which is used in server-side rendering, doesn't support `innerText`, so in platform-server's "domino adapter", there was special code to fall back to `textContent` if you tried to bind to `innerText`.

在服务器端渲染中使用的 [Domino](https://github.com/fgnass/domino) 不支持 `innerText`，因此在平台服务器中的 “domino 适配器”中，如果尝试绑定到 `innerText`，则有一些特殊代码可以退回到 `textContent`。

These two properties have subtle differences, so switching to `textContent` under the hood can be surprising to users. For this reason, we are deprecating this behavior. Going forward, users should explicitly bind to `textContent` when using Domino.

这两个属性有细微的差异，切换到 `textContent` 可能会让用户感到惊讶。因此，我们弃用了此行为。展望未来，用户应该在使用 Domino 时显式绑定到 `textContent`。

{@a wtf-apis}

### `wtfStartTimeRange` and all `wtf*` APIs

### `wtfStartTimeRange` 和所有 `wtf*` API

All of the `wtf*` APIs are deprecated and will be removed in a future version.

所有 `wtf*` API 均已弃用，并将在以后的版本中删除。

{@a entryComponents}

### `entryComponents` and `ANALYZE_FOR_ENTRY_COMPONENTS` no longer required

### 不再需要 `entryComponents` 和 `ANALYZE_FOR_ENTRY_COMPONENTS`

Previously, the `entryComponents` array in the `NgModule` definition was used to tell the compiler which components would be created and inserted dynamically.
With Ivy, this isn't a requirement anymore and the `entryComponents` array can be removed from existing module declarations.
The same applies to the `ANALYZE_FOR_ENTRY_COMPONENTS` injection token.

以前，`NgModule` 定义中的 `entryComponents` 数组用于告诉编译器将动态创建和插入哪些组件。改用 Ivy 后，将不再需要它们，并且可以从现有模块声明中删除 `entryComponents` 数组。`ANALYZE_FOR_ENTRY_COMPONENTS` 注入令牌也是如此。

**NOTE**: You may still need to keep these if building a library that will be consumed by a View Engine application.

**注意**：如果构建将由 View Engine 应用程序使用的库，你可能仍需要保留这些。

{@a moduleWithProviders}

### `ModuleWithProviders` type without a generic

### 不带泛型的 `ModuleWithProviders` 类型

Some Angular libraries, such as `@angular/router` and `@ngrx/store`, implement APIs that return a type called `ModuleWithProviders` (typically using a method named `forRoot()`).
This type represents an `NgModule` along with additional providers.
Angular version 9 deprecates use of `ModuleWithProviders` without an explicitly generic type, where the generic type refers to the type of the `NgModule`.
In a future version of Angular, the generic will no longer be optional.

一些 Angular 库，例如 `@angular/router` 和 `@ngrx/store`，实现了一种返回 `ModuleWithProviders` 类型的 API（通常借助名为 `forRoot()` 的方法）。此类型表示 `NgModule` 以及其它服务提供者。Angular 版本 9 不建议使用不带显式泛型类型的 `ModuleWithProviders`，泛型类型是指 `NgModule` 的类型。在 Angular 的未来版本中，泛型将不再是可选的。

If you're using the CLI, `ng update` should [migrate your code automatically](guide/migration-module-with-providers).
If you're not using the CLI, you can add any missing generic types to your application manually.
For example:

如果你使用的是 CLI，则 `ng update` 应该[会自动迁移代码](guide/migration-module-with-providers)。如果没有使用 CLI，则可以将任何缺失的泛型类型手动添加到应用程序中。例如：

**Before**

**之前**

<code-example language="typescript">

@NgModule({...})
export class MyModule {
  static forRoot(config: SomeConfig): ModuleWithProviders {
    return {
      ngModule: SomeModule,
      providers: [
        {provide: SomeConfig, useValue: config}
      ]
    };
  }
}

</code-example>

**After**:

**之后**：

<code-example language="typescript">

@NgModule({...})
export class MyModule {
  static forRoot(config: SomeConfig): ModuleWithProviders<SomeModule> {
    return {
      ngModule: SomeModule,
      providers: [
        {provide: SomeConfig, useValue: config }
      ]
    };
  }
}

</code-example>

<!--
### Internet Explorer 11

Angular support for Microsoft's Internet Explorer 11 (IE11) is deprecated and will be removed in Angular v13.
Ending IE11 support allows Angular to take advantage of web platform APIs present only in evergreen browsers, resulting in better APIs for developers and more capabilities for application users.
An additional motivation behind this removal is the drop in global usage of IE11 to just ~1% (as of March 2021).
For full rationale and discussion behind this deprecation, see [RFC: Internet Explorer 11 support deprecation and removal](https://github.com/angular/angular/issues/41840).

Angular 对 IE11 的支持已经弃用，将会在 Angular v13 中移除。
结束对 IE11 的支持，可以让 Angular 从那些只出现在长青浏览器中的 Web 平台 API 中受益，为开发人员带来更好地 API，并为应用的用户提供更多的能力。
本次移除还有一个动机在于全球范围内 IE11 的使用率已经只有 ~1%（2021 年 3 月）。关于这次弃用的全部论证和讨论，参见 [RFC: Internet Explorer 11 support deprecation and removal](https://github.com/angular/angular/issues/41840)。

**Note**: IE11 will be supported in Angular v12 LTS releases through November 2022.

*注意：Angular v12 的 LTS 版本将会继续支持 IE11，一直到 2022 年 11 月。

-->

{@a input-setter-coercion}

### Input setter coercion

### 输入属性 setter 的强制类型转换

Since the `strictTemplates` flag has been introduced in Angular the compiler has been able to type-check input bindings to the declared input type of the corresponding directive.
When a getter/setter pair is being used for the input it may be desirable to let the setter accept a broader set of types than what is returned by the getter, for example when the setter first converts the input value.
However, until TypeScript 4.3 a getter/setter pair was required to have identical types so this pattern could not be accurately declared.

由于在 Angular 中引入了 `strictTemplates` 标志，编译器已经能够对输入绑定进行类型检查，该输入属性绑定到相应指令的声明输入类型。当 getter/setter 对用于输入时，可能需要让 setter 接受比 getter 返回的类型更广泛的类型集，例如当 setter 首次转换输入值时。然而，在 TypeScript 4.3 之前，需要 getter/setter 具有相同的类型，因此无法准确声明此模式。

To mitigate this limitation, it was made possible to declare [input setter coercion fields](guide/template-typecheck#input-setter-coercion) in directives that are used when type-checking input bindings.
However, since [TypeScript 4.3](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html#separate-write-types-on-properties) the limitation has been removed; setters can now accept a wider type than what is returned by the getter.
This means that input coercion fields are no longer needed, as their effects can be achieved by widening the type of the setter.

为了减轻这种限制，可以在类型检查输入绑定时使用的指令中声明[输入属性 setter 的强制转换字段](guide/template-typecheck#input-setter-coercion)。但是，从[TypeScript 4.3](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html#separate-write-types-on-properties)开始，次限制已被移除； setter 现在可以接受比 getter 返回的类型更广泛的类型。这意味着不再需要输入强制类型转换字段，因为它们的效果可以通过放宽 setter 的类型来实现。

For example, the following directive:

例如，以下指令：

```typescript
@Component({...})
class SubmitButton {
  private _disabled: boolean;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = (value === '') || value;
  }

  static ngAcceptInputType_disabled: boolean|'';
}
```

can be refactored as follows:

可以重构如下：

```typescript
@Component({...})
class SubmitButton {
  private _disabled: boolean;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean|'') {
    this._disabled = (value === '') || value;
  }
}
```

{@a full-template-type-check}

### `fullTemplateTypeCheck`

When compiling your application using the AOT compiler, your templates are type-checked according to a certain strictness level.
Before Angular 9 there existed only two strictness levels of template type checking as determined by [the `fullTemplateTypeCheck` compiler option](guide/angular-compiler-options).
In version 9 the `strictTemplates` family of compiler options has been introduced as a more fine-grained approach to configuring how strict your templates are being type-checked.

使用 AOT 编译器编译你的应用程序时，你的模板会根据特定的严格级别进行类型检查。在 Angular 9 之前，[`fullTemplateTypeCheck` 编译器选项](guide/angular-compiler-options) 只支持两个严格级别的模板类型检查。在版本 9 中引入了 `strictTemplates` 系列编译器选项，作为一种更细粒度的方法来配置模板类型检查的严格程度。

The `fullTemplateTypeCheck` flag is being deprecated in favor of the new `strictTemplates` option and its related compiler options.
Projects that currently have `fullTemplateTypeCheck: true` configured can migrate to the following set of compiler options to achieve the same level of type-checking:

`fullTemplateTypeCheck` 标志已被弃用，代替它的是新的 `strictTemplates` 选项及其相关的编译器选项。当前已配置 `fullTemplateTypeCheck: true` 的项目可以迁移到以下编译器选项集以实现相同级别的类型检查：

<code-example language="json" header="tsconfig.app.json">

{
  "angularCompilerOptions": {
    ...
    "strictTemplates": true,
    "strictInputTypes": false,
    "strictNullInputTypes": false,
    "strictAttributeTypes": false,
    "strictOutputEventTypes": false,
    "strictDomEventTypes": false,
    "strictDomLocalRefTypes": false,
    "strictSafeNavigationTypes": false,
    "strictContextGenerics": false,
    ...
  }
}

</code-example>

{@a jit-api-changes}

## JIT API changes due to ViewEngine deprecation

## 由于 ViewEngine 弃用而导致的 JIT API 更改

In ViewEngine, [JIT compilation](https://angular.io/guide/glossary#jit) required special providers (like `Compiler`, `CompilerFactory`, etc) to be injected in the app and corresponding methods to be invoked. With Ivy, JIT compilation takes place implicitly if the Component, NgModule, etc have not already been [AOT compiled](https://angular.io/guide/glossary#aot). Those special providers were made available in Ivy for backwards-compatibility with ViewEngine to make the transition to Ivy smoother. Since ViewEngine is deprecated and will soon be removed, those symbols are now deprecated as well.

在 ViewEngine 中， [JIT 编译](https://angular.io/guide/glossary#jit)需要在应用程序中注入特殊的提供者（如 `Compiler` 、 `CompilerFactory` 等）并调用相应的方法。使用 Ivy 时，如果 Component、NgModule 等尚未进行 [AOT 编译](https://angular.io/guide/glossary#aot)，则会隐式进行 JIT 编译。这些特殊的提供者在 Ivy 中可用，以便与 ViewEngine 向后兼容，从而使向 Ivy 的过渡更加顺畅。由于 ViewEngine 已被弃用并将很快被删除，因此这些符号现在也已被弃用。

Important note: this deprecation doesn't affect JIT mode in Ivy (JIT remains available with Ivy, however we are exploring a possibility of deprecating it in the future. See [RFC: Exploration of use-cases for Angular JIT compilation mode](https://github.com/angular/angular/issues/43133)).

重要说明：此弃用不会影响 Ivy 中的 JIT 模式（JIT 在 Ivy 中仍然可用，但是我们正在探索将来弃用它的可能性。请参阅 [RFC：Angular JIT 编译模式的用例探索](https://github.com/angular/angular/issues/43133)）。

{@a deprecated-cli-flags}

## Deprecated CLI APIs and Options

## 弃用的 CLI API 和选项

This section contains a complete list all of the currently deprecated CLI flags.

本节包含所有当前已弃用的 CLI 标志的完整列表。

### @angular-devkit/build-angular

| API/Option | May be removed in | Notes |
| ---------- | ----------------- | ----- |
| API/选项 | 可能删除于 | 备注 |
| `i18nFile` | <!--v9--> v11 |  |
| `extractCss` | <!--v11--> v13 | No longer required to disable CSS extraction during development. |
| `extractCss` | <!--v11--> v13 | 不需要在开发期间禁用 CSS 抽取。 |
| `i18nFormat` | <!--v9--> v12 | Format is now automatically detected. |
| `i18nFormat` | <!--v9--> v12 | 格式现在是自动检测的。 |
| `i18nLocale` | <!--v9--> v12 | New [localization option][AioGuideI18nCommonMergeDefineLocalesInTheBuildConfiguration] in version 9 and later. |
| `i18nLocale` | <!--v9--> v12 | 版本 9 和更高版本中新的[本地化选项][AioGuideI18nCommonMergeDefineLocalesInTheBuildConfiguration]。 |
| `hmrWarning` | <!--v11--> v13 | No longer has an effect. |
| `hmrWarning` | <!--v11--> v13 | 已无效果 |
| `servePathDefaultWarning` | <!--v11--> v13 | No longer has an effect. |
| `servePathDefaultWarning` | <!--v11--> v13 | 已无效果。 |

### @schematics/angular

| API/Option | May be removed in | Notes |
| ---------- | ----------------- | ----- |
| API /选项 | 可能删除于 | 备注 |
| `lintFix` | <!--v11--> v12 | Deprecated as part of TSLint deprecation. |
| `lintFix` | <!--v11--> v12 | 作为 TSLint 的一部分而被弃用。 |

{@a removed}

## Removed APIs

## 删除的 API

The following APIs have been removed starting with version 11.0.0\*:

下列 API 已从 11.0.0\* 版本开始移除：

| Package | API | Replacement | Notes |
| ------- | --- | ----------- | ----- |
| 包 | API | 替代品 | 备注 |
| `@angular/router` | `preserveQueryParams` | [`queryParamsHandling`](api/router/UrlCreationOptions#queryParamsHandling) |  |

\* To see APIs removed in version 10, check out this guide on the [version 10 docs site](https://v10.angular.io/guide/deprecations#removed).

\*要查看版本 10 中移除的 API，请查看[版本 10 文档站](https://v10.angular.cn/guide/deprecations#removed)上本指南\*。

{@a esm5-fesm5}

### `esm5` and `fesm5` code formats in @angular/* npm packages

### `@angular/*` npm 软件包中的 `esm5` 和 `fesm5` 代码格式

As of Angular v8, the CLI primarily consumes the `fesm2015` variant of the code distributed as part of `@angular/*` npm packages.
This renders the `esm5` and `fesm5` distributions obsolete and unnecessary, adding bloat to the package size and slowing down npm installations.

从 Angular v8 开始，CLI 就主要使用通过 `@angular/*` 系列 npm 包分发的 `fesm2015` 变体代码。这就让 `esm5` 和 `fesm5` 的发行版变得过时和不必要，只会增加软件包大小并拖累 npm 的安装速度。

This removal has no impact on CLI users, unless they modified their build configuration to explicitly consume these code distributions.

移除它们不会对 CLI 用户产生任何影响，除非他们修改了自己的构建配置以显式使用代码的这些发行版。

Any application still relying on the `esm5` and `fesm5` as the input to its build system will need to ensure that the build pipeline is capable of accepting JavaScript code conforming to ECMAScript 2015 (ES2015) language specification.

任何仍依赖 `esm5` 和 `fesm5` 作为其构建系统输入的应用程序都需要确保构建管道能够接受符合 ECMAScript 2015（ES2015） 语言规范的 JavaScript 代码。

Note that this change doesn't make existing libraries distributed in this format incompatible with the Angular CLI.
The CLI will fall back and consume libraries in less desirable formats if others are not available.
However, we do recommend that libraries ship their code in ES2015 format in order to make builds faster and build output smaller.

请注意，此更改不会使以这种格式分发的现有库与 Angular CLI 不兼容。如果其它发行版不可用，CLI 将回退并以不太理想的格式使用库。但是，我们确实建议库以 ES2015 格式发布其代码，以加快构建速度并减小构建输出。

In practical terms, the `package.json` of all `@angular` packages has changed in the following way:

实际上，所有 `@angular` 软件包的 `package.json` 都将以如下方式更改：

**Before**:

**之前**：

<code-example language="json" header="package.app.json">

{
  "name": "@angular/core",
  "version": "9.0.0",
  "main": "./bundles/core.umd.js",
  "module": "./fesm5/core.js",
  "es2015": "./fesm2015/core.js",
  "esm5": "./esm5/core.js",
  "esm2015": "./esm2015/core.js",
  "fesm5": "./fesm5/core.js",
  "fesm2015": "./fesm2015/core.js",
  ...
}

</code-example>

**After**:

**之后**：

<code-example language="json" header="package.app.json">

{
  "name": "@angular/core",
  "version": "10.0.0",
  "main": "./bundles/core.umd.js",
  "module": "./fesm2015/core.js",
  "es2015": "./fesm2015/core.js",
  "esm2015": "./esm2015/core.js",
  "fesm2015": "./fesm2015/core.js",
  ...
}

</code-example>

For more information about the npm package format, see the [Angular Package Format spec](https://goo.gl/jB3GVv).

关于 npm 软件包格式的更多信息，请参阅 [Angular 软件包格式规范](https://goo.gl/jB3GVv)。

{@a style-sanitization}

### Style Sanitization for `[style]` and `[style.prop]` bindings

### `[style]` 和 `[style.prop]` 绑定的样式无害化

Angular used to sanitize `[style]` and `[style.prop]` bindings to prevent malicious code from being inserted through `javascript:` expressions in CSS `url()` entries. However, most modern browsers no longer support the usage of these expressions, so sanitization was only maintained for the sake of IE 6 and 7. Given that Angular does not support either IE 6 or 7 and sanitization has a performance cost, we will no longer sanitize style bindings as of version 10 of Angular.

Angular 会清理 `[style]` 和 `[style.prop]` 绑定，以防止恶意代码通过 CSS `url()` 条目中的 `javascript:` 表达式进行插入。但是，大多数现代浏览器都已不再支持这些表达式的使用，所以这种清理只对 IE 6 和 7 才有意义。鉴于 Angular 不支持 IE 6 或 7，并且这种清理有性能代价，因此我们将不再清理 Angular 版本 10 中的样式绑定。

### `loadChildren` string syntax in `@angular/router`

### `@angular/router` 中的 `loadChildren` 字符串语法

It is no longer possible to use the `loadChildren` string syntax to configure lazy routes.
The string syntax has been replaced with dynamic import statements.
The `DeprecatedLoadChildren` type was removed from `@angular/router`.
Find more information about the replacement in the [`LoadChildrenCallback` documentation](api/router/LoadChildrenCallback).

不能再用 `loadChildren` 字符串语法来配置惰性路由。字符串语法已改为动态导入语句。 `DeprecatedLoadChildren` 类型已从 `@angular/router` 中删除。在[`LoadChildrenCallback` 文档](api/router/LoadChildrenCallback)中查找关于此替换的更多信息。

The supporting classes `NgModuleFactoryLoader`, `SystemJsNgModuleLoader` and `SystemJsNgModuleLoaderConfig` classes were removed from `@angular/core`, as well as `SpyNgModuleFactoryLoader` from `@angular/router`.

支持类 `NgModuleFactoryLoader`、 `SystemJsNgModuleLoader` 和 `SystemJsNgModuleLoaderConfig` 类已从 `@angular/core` 中删除，而且 `SpyNgModuleFactoryLoader` 也从 `@angular/router` 中删除了。

<!-- links -->

[AioGuideI18nCommonMergeDefineLocalesInTheBuildConfiguration]: guide/i18n-common-merge#define-locales-in-the-build-configuration "Define locales in the build configuration - Common Internationalization task #6: Merge translations into the application | Angular"

<!-- end links -->

@reviewed 2021-09-15

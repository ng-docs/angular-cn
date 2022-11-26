# Update Angular to v14

# 更新 Angular

This guide contains information to update to Angular version 14.

本指南包含更新到 Angular 版本 14 的信息。

## Update Angular CLI applications

## 更新 Angular CLI 应用程序

For step-by-step instructions on how to update to the latest Angular release and leverage the Angular automated migration tools, use the interactive update guide at [update.angular.io](https://update.angular.io).

有关如何更新到最新的 Angular 版本和利用 Angular 自动迁移工具的分步说明，请使用 [update.angular.io](https://update.angular.io) 上的交互式更新指南。

## Changes and deprecations in version 14

## 版本 14 中的更改与弃用

<div class="alert is-helpful">

For information about the deprecation and removal practices of Angular, see [Angular Release Practices](guide/releases#deprecation-practices).

有关 Angular 的弃用和删除实践的信息，请参阅[Angular 发布实践](guide/releases#deprecation-practices)。

</div>

* **Strictly Typed Reactive Forms**

  **严格类型的响应式表单**

  The Reactive Forms types `AbstractControl`, `FormControl`, `FormGroup`, and `FormArray` now support a generic parameter which allows for strict typing of the controls. An automatic migration will convert existing usages of these types to special `Untyped` aliases which preserve the existing behavior.

  响应式表单类型 `AbstractControl` 、 `FormControl` 、 `FormGroup` 和 `FormArray` 现在支持一个泛型参数，该参数允许对控件进行严格键入。自动迁移会将这些类型的现有用法转换为特殊的 `Untyped` 别名，以保留现有行为。

  The `initialValueIsDefault` option for `FormControl` construction has been deprecated in favor of the `nonNullable` option (which has identical behavior). This renaming aligns the `FormControl` constructor with other strictly typed APIs related to nullability.

  `FormControl` 构造的 `initialValueIsDefault` 选项已被弃用，以支持 `nonNullable` 选项（具有相同的行为）。这种重命名使 `FormControl` 构造函数与其他与可空性相关的严格类型 API 保持一致。

* **`ComponentFactory` and `NgModuleFactory` cleanup**

  **`ComponentFactory` 和 `NgModuleFactory` 清理**

  Many APIs which use either `ComponentFactory` or `NgModuleFactory` have been deprecated and replaced with new APIs that use component or NgModule classes directly.

  许多使用 `ComponentFactory` 或 `NgModuleFactory` 的 API 已被弃用，并替换为直接使用组件或 NgModule 类的新 API。

### Breaking changes in Angular version 14

### Angular 版本 14 中的重大更改

<a id="breaking-changes"></a>

|  | Details |
| :-- | :------ |
|  | 详情 |
| [**PR&nbsp;#45729**](https://github.com/angular/angular/pull/45729) | `initialNavigation: 'enabled'` was deprecated in v11 and is replaced by `initialNavigation: 'enabledBlocking'.`. |
| [**PR&nbsp;#45729**](https://github.com/angular/angular/pull/45729) | `initialNavigation: 'enabled'` 在 v11 中已弃用，并由 `initialNavigation: 'enabledBlocking'.` 代替. |
| [**PR&nbsp;#42803**](https://github.com/angular/angular/pull/42803) | Forms `email` input coercion: forms `email` input value will be considered as true if it is defined with any value rather than false and 'false'. |
| [**PR&nbsp;#42803**](https://github.com/angular/angular/pull/42803) | 表单 `email` 输入强制：如果表单 `email` 输入值是使用任何值而不是 false 和 'false' 定义的，则将被视为 true。 |
| [**PR&nbsp;#33729**](https://github.com/angular/angular/pull/33729) | Objects with a length key set to zero will no longer validate as empty. This is technically a breaking change, since objects with a key `length` and value `0` will no longer validate as empty. This is a very minor change, and any reliance on this behavior is probably a bug anyway. |
| [**PR&nbsp;#33729**](https://github.com/angular/angular/pull/33729) | 长度键设置为零的对象将不再验证为空。从技术上讲，这是一个突破性更改，因为键 `length` 和值为 `0` 的对象将不再验证为空。这是一个非常小的更改，无论如何，对此行为的任何依赖都可能是一个错误。 |
| [**PR&nbsp;#44921**](https://github.com/angular/angular/pull/44921) | Do not run change detection when loading Hammer. This change may cause unit tests that are implicitly asserting on the specific number or the ordering of change detections to fail. |
| [**PR&nbsp;#44921**](https://github.com/angular/angular/pull/44921) | 加载 Hammer 时不要运行变更检测。此更改可能会导致在特定数字上隐式断言的单元测试或变更检测的顺序失败。 |
| [**PR&nbsp;#23020**](https://github.com/angular/angular/pull/23020) | Parameter types of `TransferState` usage have increased type safety, and this may reveal existing problematic calls. |
| [**PR&nbsp;#23020**](https://github.com/angular/angular/pull/23020) | `TransferState` 使用的参数类型提高了类型安全性，这可能会揭示现有的有问题的调用。 |
| [**PR&nbsp;#43863**](https://github.com/angular/angular/pull/43863) | The type of `Navigation#initialUrl` has been narrowed to `UrlTree` to reflect reality. Additionally, the value for `initialUrl` now matches its documentation: "The target URL passed into the Router#navigateByUrl() call before navigation". Previously, this was incorrectly set to the current internal `UrlTree` of the Router at the time navigation occurs. |
| [**PR&nbsp;#43863**](https://github.com/angular/angular/pull/43863) | `Navigation#initialUrl` 的类型已从 <code>string&verbar;UrlTree</code> 缩小为 `UrlTree`，以反映现实。另外，`initialUrl` 的值现在与其文档一致了：“在导航之前传给 Router#navigateByUrl() 调用的目标 URL。以前，它被错误的设置为了在导航发生时 `UrlTree` 的内部当前值。” |
| [**PR&nbsp;#45114**](https://github.com/angular/angular/pull/45114) | The `AnimationDriver.getParentElement` method has become required, so any implementors of this interface are now required to provide an implementation for this method. |
| [**PR&nbsp;#45114**](https://github.com/angular/angular/pull/45114) | `AnimationDriver.getParentElement` 方法已成为必需，因此现在要求此接口的任何实现者提供此方法的实现。 |
| [**PR&nbsp;#45176**](https://github.com/angular/angular/pull/45176) | The type of `Route.pathMatch` is now more strict. Places that use `pathMatch` will likely need to be updated to have an explicit `Route`/`Routes` type so that TypeScript does not infer the type as `string`. |
| [**PR&nbsp;#45176**](https://github.com/angular/angular/pull/45176) | `Route.pathMatch` 的类型现在更严格。使用 `pathMatch` 的地方可能需要更新为显式 `Route` / `Routes` 类型，以便 TypeScript 不会将类型推断为 `string`。 |
| [**PR&nbsp;#44573**](https://github.com/angular/angular/pull/44573) | The router now takes only the first emitted value by the resolvers and then proceeds with navigation. This is now consistent with `Observables` returned by other guards: only the first value is used. |
| [**PR&nbsp;#44573**](https://github.com/angular/angular/pull/44573) | 路由器现在仅获取解析器发出的第一个值，然后继续导航。这现在与其他警卫返回的 `Observables` 一致：仅使用第一个值。 |
| [**PR&nbsp;#45394**](https://github.com/angular/angular/pull/45394) | TypeScript versions older than `4.6.0` are no longer supported. |
| [**PR&nbsp;#45394**](https://github.com/angular/angular/pull/45394) | 不再支持早于 `4.6.0` 的 TypeScript 版本。 |
| [**PR&nbsp;#45210**](https://github.com/angular/angular/pull/45210) | `HttpClient` will throw an error when headers are set on a JSONP request. |
| [**PR&nbsp;#45210**](https://github.com/angular/angular/pull/45210) | 在 JSONP 请求上设置标头时，`HttpClient` 将抛出错误。 |
| [**PR&nbsp;#43834**](https://github.com/angular/angular/pull/43834) | Reactive form types such as `FormControl` and `FormGroup` now have generic type parameters and infer stricter types. A migration will convert existing usages to new `Untyped`-prefixed aliases which preserve the existing behavior. |
| [**PR&nbsp;#43834**](https://github.com/angular/angular/pull/43834) | 响应式表单类型（例如 `FormControl` 和 `FormGroup` 现在具有泛型类型参数并推断更严格的类型。迁移会将现有的用法转换为新的 `Untyped` 前缀的别名，以保留现有的行为。 |
| [**PR&nbsp;#45487**](https://github.com/angular/angular/pull/45487) | The deprecated `aotSummaries` field in the `TestBed` configuration has been removed. |
| [**PR&nbsp;#45487**](https://github.com/angular/angular/pull/45487) | `TestBed` 配置中已过时的 `aotSummaries` 字段已删除。 |
| [**PR&nbsp;#45648**](https://github.com/angular/angular/pull/45648) | A new required class member `LocationStrategy#getState` has been added, that any implementers of this interface will need to provide. |
| [**PR&nbsp;#45648**](https://github.com/angular/angular/pull/45648) | 添加了一个新的必需类成员 `LocationStrategy#getState`，此接口的任何实现者都需要提供。 |
| [**PR&nbsp;#45735**](https://github.com/angular/angular/pull/45735) | When a guard returns a `UrlTree`, the router would previously schedule the redirect navigation within a `setTimeout`. This timeout is now removed, which can result in test failures due to incorrectly written tests. |
| [**PR&nbsp;#45735**](https://github.com/angular/angular/pull/45735) | 当守卫返回 `UrlTree` 时，以前路由器会在 `setTimeout` 内安排重定向导航。现在删除了此超时，这可能会由于测试编写不正确而导致测试失败。 |

### New deprecations

### 新的弃用

<a id="deprecations"></a>

| Removed | Replacement | Details |
| :------ | :---------- | :------ |
| 已移除 | 替代品 | 详情 |
| [`FormControlOptions#initialValueIsDefault`](api/forms/FormControlOptions#initialValueIsDefault) | [`FormControlOptions#nonNullable`](api/forms/FormControlOptions#nonNullable) | The `initialValueIsDefault` option for `FormControl` construction has been deprecated in favor of the `nonNullable` option (which has identical behavior). This renaming aligns the `FormControl` constructor with other strictly typed APIs related to nullability. |
| [`FormControlOptions#initialValueIsDefault`](api/forms/FormControlOptions#initialValueIsDefault) | [`FormControlOptions#nonNullable`](api/forms/FormControlOptions#nonNullable) | `FormControl` 构造的 `initialValueIsDefault` 选项已被弃用，以支持 `nonNullable` 选项（具有相同的行为）。这种重命名使 `FormControl` 构造函数与其他与可空性相关的严格类型 API 保持一致。 |
| `ErrorEvent`s passed to [`TestRequest#error`](api/common/http/testing/TestRequest#error) | `ProgressEvent` | Http requests never emit an `ErrorEvent`. Use a `ProgressEvent` instead. |
| 传递给[`TestRequest#error`](api/common/http/testing/TestRequest#error)的 `ErrorEvent` | `ProgressEvent` | Http 请求永远不会发出 `ErrorEvent`。改用 `ProgressEvent`。 |
| [`getModuleFactory`](api/core/getModuleFactory) | `getNgModuleById` | `NgModuleFactory` itself is deprecated. |
| [`getModuleFactory`](api/core/getModuleFactory) | `getNgModuleById` | `NgModuleFactory` 本身已被弃用。 |
| [`ModuleWithComponentFactories`](api/core/ModuleWithComponentFactories) | n/a | Ivy JIT mode doesn't require accessing this symbol. See [JIT API changes due to ViewEngine deprecation](guide/deprecations#jit-api-changes) for additional context. |
| [`ModuleWithComponentFactories`](api/core/ModuleWithComponentFactories) | 不适用 | Ivy JIT 模式不需要访问这个符号。有关其他上下文，请参阅[由于 ViewEngine 弃用而导致的 JIT API 更改](guide/deprecations#jit-api-changes)。 |
| [`Compiler`](api/core/Compiler) | n/a | Ivy JIT mode doesn't require accessing this symbol. See [JIT API changes due to ViewEngine deprecation](guide/deprecations#jit-api-changes) for additional context. |
| [`Compiler`](api/core/Compiler) | 不适用 | Ivy JIT 模式不需要访问这个符号。有关其他上下文，请参阅[由于 ViewEngine 弃用而导致的 JIT API 更改](guide/deprecations#jit-api-changes)。 |
| [`CompilerFactory`](api/core/CompilerFactory) | n/a | Ivy JIT mode doesn't require accessing this symbol. See [JIT API changes due to ViewEngine deprecation](guide/deprecations#jit-api-changes) for additional context. |
| [`CompilerFactory`](api/core/CompilerFactory) | 不适用 | Ivy JIT 模式不需要访问这个符号。有关其他上下文，请参阅[由于 ViewEngine 弃用而导致的 JIT API 更改](guide/deprecations#jit-api-changes)。 |
| [`NgModuleFactory`](api/core/NgModuleFactory) | n/a | This class was mostly used as a part of ViewEngine-based JIT API and is no longer needed in Ivy JIT mode. See [JIT API changes due to ViewEngine deprecation](guide/deprecations#jit-api-changes) for additional context. Angular provides APIs that accept NgModule classes directly (such as [`PlatformRef.bootstrapModule`](api/core/PlatformRef#bootstrapModule) and [`createNgModuleRef`](api/core/createNgModuleRef)), consider switching to those APIs instead of using factory-based ones. |
| [`NgModuleFactory`](api/core/NgModuleFactory) | 不适用 | 此类主要是作为基于 ViewEngine 的 JIT API 的一部分，在 Ivy JIT 模式下不再需要。有关其他上下文，请参阅[由于 ViewEngine 弃用而导致的 JIT API 更改](guide/deprecations#jit-api-changes)。 Angular 提供了能直接接受 NgModule 类的 API（例如[`PlatformRef.bootstrapModule`](api/core/PlatformRef#bootstrapModule)和[`createNgModuleRef`](api/core/createNgModuleRef) ），考虑切换到这些 API 而不再使用基于工厂的 API。 |
| [`ComponentFactory`](api/core/ComponentFactory) | n/a | Angular no longer requires `ComponentFactory`s. Other APIs allow Component classes to be used directly. |
| [`ComponentFactory`](api/core/ComponentFactory) | 不适用 | Angular 不再需要 `ComponentFactory` 。其他 API 允许直接使用组件类。 |
| [`ComponentFactoryResolver`](api/core/ComponentFactoryResolver) | n/a | Angular no longer requires `ComponentFactory`s. Other APIs allow Component classes to be used directly. |
| [`ComponentFactoryResolver`](api/core/ComponentFactoryResolver) | 不适用 | Angular 不再需要 `ComponentFactory` 。其他 API 允许直接使用组件类。 |
| `useJit` and `missingTranslation` in [`CompilerOptions`](api/core/CompilerOptions) | n/a | Ivy JIT mode does not support these options. See [JIT API changes due to ViewEngine deprecation](guide/deprecations#jit-api-changes) for additional context. |
| [`CompilerOptions`](api/core/CompilerOptions)中的 `useJit` 和 `missingTranslation` | 不适用 | Ivy JIT 模式不支持这些选项。有关其他上下文，请参阅[由于 ViewEngine 弃用而导致的 JIT API 更改](guide/deprecations#jit-api-changes)。 |
| [`JitCompilerFactory`](api/platform-browser-dynamic/JitCompilerFactory) | n/a | Ivy JIT mode doesn't require accessing this symbol. See [JIT API changes due to ViewEngine deprecation](guide/deprecations#jit-api-changes) for additional context. |
| [`JitCompilerFactory`](api/platform-browser-dynamic/JitCompilerFactory) | 不适用 | Ivy JIT 模式不需要访问这个符号。有关其他上下文，请参阅[由于 ViewEngine 弃用而导致的 JIT API 更改](guide/deprecations#jit-api-changes)。 |
| [`RESOURCE_CACHE_PROVIDER`](api/platform-browser-dynamic/RESOURCE_CACHE_PROVIDER) | n/a | This was previously necessary in some cases to test AOT-compiled components with View Engine, but is no longer since Ivy. |
| [`RESOURCE_CACHE_PROVIDER`](api/platform-browser-dynamic/RESOURCE_CACHE_PROVIDER) | 不适用 | 以前在某些情况下需要使用 View Engine 测试 AOT 编译的组件，但自 Ivy 以来不再需要。 |
| `relativeLinkResolution` in the Router [`ExtraOptions`](api/router/ExtraOptions) | Switch to the default of `'corrected'` link resolution | This option was introduced to fix a bug with link resolution in a backwards compatible way. Existing apps which still depend on the buggy legacy behavior should switch to the new corrected behavior and stop passing this flag. |
| 路由器[`ExtraOptions`](api/router/ExtraOptions)中的 `relativeLinkResolution` | 切换到默认的 `'corrected'` 链接解析方式 | 引入此选项是为了以向后兼容的方式修复具有链接解析的错误。仍然依赖于有问题的旧版行为的现有应用程序应该切换到更正后的新行为并停止传递此标志。 |
| `resolver` argument in [`RouterOutletContract.activateWith`](api/router/RouterOutletContract#activateWith) | n/a | `ComponentFactory` and `ComponentFactoryResolver` afre deprecated, and passing an argument for a resolver to retrieve a `ComponentFactory` is no longer required. |
| [`RouterOutletContract.activateWith`](api/router/RouterOutletContract#activateWith)中的 `resolver` | 不适用 | `ComponentFactory` 和 `ComponentFactoryResolver` 已经弃用，不再需要传 resolver 参数以获取 `ComponentFactory`。 |
| [`OutletContext#resolver`](api/router/OutletContext#resolver) | n/a | `ComponentFactory` and `ComponentFactoryResolver` are deprecated, and using a resolver to retrieve a `ComponentFactory` is no longer required. |
| [`OutletContext#resolver`](api/router/OutletContext#resolver) | 不适用 | `ComponentFactory` 和 `ComponentFactoryResolver` 已经弃用，不再需要传 resolver 参数以获取 `ComponentFactory`。 |
| [`SwUpdate#activated`](api/service-worker/SwUpdate#activated) | Return value of [`SwUpdate#activateUpdate`](api/service-worker/SwUpdate#activateUpdate) | The `activated` property is deprecated. Existing usages can migrate to [`SwUpdate#activateUpdate`](api/service-worker/SwUpdate#activateUpdate). |
| [`SwUpdate#activated`](api/service-worker/SwUpdate#activated) | [`SwUpdate#activateUpdate`](api/service-worker/SwUpdate#activateUpdate)的返回值 | `activated` 属性已被弃用。现有用法可以迁移到[`SwUpdate#activateUpdate`](api/service-worker/SwUpdate#activateUpdate)。 |
| [`SwUpdate#available`](api/service-worker/SwUpdate#available) | [`SwUpdate#versionUpdates`](api/service-worker/SwUpdate#versionUpdates) | The behavior of [`SwUpdate#available`](api/service-worker/SwUpdate#available) can be achieved by filtering for the [`VersionReadyEvent`](api/service-worker/VersionReadyEvent) from [`SwUpdate#versionUpdates`](api/service-worker/SwUpdate#versionUpdates) |
| [`SwUpdate#available`](api/service-worker/SwUpdate#available) | [`SwUpdate#versionUpdates`](api/service-worker/SwUpdate#versionUpdates) | [`SwUpdate#available`](api/service-worker/SwUpdate#available)的行为可以通过从[`SwUpdate#versionUpdates`](api/service-worker/SwUpdate#versionUpdates)中过滤[`VersionReadyEvent`](api/service-worker/VersionReadyEvent)来实现 |

@reviewed 2022-05-31
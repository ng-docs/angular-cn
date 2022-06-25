# Update Angular

# 更新 Angular

This guide contains information to update to Angular version 13.

本指南包含更新到 Angular 版本 13 的信息。

## Update Angular CLI applications

## 更新 Angular CLI 应用程序

For step-by-step instructions on how to update to the latest Angular release and leverage the Angular automated migration tools, use the interactive update guide at [update.angular.io][AngularUpdateMain].

有关如何更新到最新的 Angular 版本和利用 Angular 自动迁移工具的分步说明，请使用 [update.angular.io][AngularUpdateMain] 上的交互式更新指南。

## Changes and deprecations in version 13

## 版本 13 中的更改与弃用

<div class="alert is-helpful">

For information about the deprecation and removal practices of Angular, see [Angular Release Practices][AioGuideReleasesDeprecationPractices].

有关 Angular 的弃用和移除实践的信息，请参阅 [Angular 版本发布实践][AioGuideReleasesDeprecationPractices]。

</div>

* **Removal of View Engine**

  **移除视图引擎**

  Requires all applications and libraries to build using Ivy.
  See the [Upcoming improvements to Angular library distribution][AngularBlog76c02f782aa4] blog.

  需要使用 Ivy 构建所有应用程序和库。请参阅[即将到来的 Angular 库分发改进][AngularBlog76c02f782aa4] 博客。

* **Modernization of the Angular Package Format (APF)**

  **Angular 包格式 (APF) 的现代化**

  Removed older output formats, including View Engine specific metadata.

  移除了旧的输出格式，包括视图引擎特有的元数据。

* **Removal of IE11 Support**

  **移除对 IE11 的支持**

  Removes all support for Microsoft Internet Explorer 11 (IE11).
  See [Issue&nbsp;#41840][GithubAngularAngularIssues41840].

  移除对 Microsoft Internet Explorer 11 (IE11) 的所有支持。请参阅 [问题 #41840][GithubAngularAngularIssues41840]。

* **Testbed module teardown**

  **测试平台模块清理**

  Adds the option in `initTestEnvironment` to completely remove test environments from an application.
  See the [Improving Angular tests by enabling Angular testing module teardown][DevThisIsAngularImprovingAngularTestsByEnablingAngularTestingModuleTeardown38kh] article.

  在 `initTestEnvironment` 中添加选项以从应用程序中完全移除测试环境。请参阅 [通过启用 Angular 测试模块清理来改进 Angular 测试][DevThisIsAngularImprovingAngularTestsByEnablingAngularTestingModuleTeardown38kh] 文章。

* **`$localize` tagged message strings**

  **`$localize` 标记的消息字符串**

  Adds documentation for the Angular `$localize` API and tagged message strings.

  添加 Angular `$localize` API 和标记消息字符串的文档。

* **Disk Cache**

  **磁盘缓存**

  Enables the persistent build cache by default for all applications.
  See [Issue&nbsp;#21545][GithubAngularAngularCliIssues21545].

  默认情况下会为所有应用程序启用持久构建缓存。请参阅 [问题 #21545][GithubAngularAngularCliIssues21545]。

### Breaking changes in Angular version 13

### Angular 版本 13 中的重大变化

<a id="breaking-changes"></a>

|  | Details |
| :-- | :------ |
|  | 详情 |
| [**PR&nbsp;#43642**][GithubAngularAngularPull43642] | TypeScript versions older than `4.4.2` are no longer supported. |
| [ **PR #43642** ][GithubAngularAngularPull43642] | 不再支持 `4.4.2` 之前的 TypeScript 版本。 |
| [**PR&nbsp;#43740**][GithubAngularAngularPull43740] | NodeJS versions older than `v12.20.0` are no longer supported. The Angular packages now use the NodeJS package exports feature with subpath patterns and requires a NodeJS version above `14.15.0` or `16.10.0`. |
| [ **PR #43740** ][GithubAngularAngularPull43740] | 不再支持早于 `v12.20.0` 的 NodeJS 版本。 Angular 包现在使用带有子路径模式的 NodeJS 包导出功能，并且需要高于 `14.15.0` 或 `16.10.0` 的 NodeJS 版本。 |
| [PR&nbsp;#31187][GithubAngularAngularPull31187] | Previously, the default url serializer dropped everything after and including a question mark in query parameters. That is, for a navigation to `/path?q=hello?&other=123`, the query parameters parsed to just `{q: 'hello'}`. This is incorrect, because the URI spec allows for question mark characers in query data. This change now correctly parses the query parameters for `/path?q=hello?&other=123` as `{v: 'hello?', other: '123'}`. |
| [PR #31187][GithubAngularAngularPull31187] | 以前，默认的 url 序列化程序移除了查询参数中包含问号之后的所有内容。也就是说，如果要导航到 `/path?q=hello?&other=123`，查询参数解析为仅 `{q: 'hello'}`。这是不正确的，因为 URI 规范允许在查询数据中使用问号字符。此更改现在会正确地将 `/path?q=hello?&other=123` 的查询参数解析为 `{v: 'hello?', other: '123'}`。 |
| [PR&nbsp;#41730][GithubAngularAngularPull41730] | The behavior of the `SpyLocation` used by the `RouterTestingModule` has changed to match the behavior of browsers. It no longer emits a `popstate` event when `Location.go` is called. In addition, `simulateHashChange` now triggers *both* a `hashchange` event and a `popstate` event. Tests that use `location.go` and expect the changes to be picked up by the `Router` should migrate to `simulateHashChange`. Each test is different in what it attempts to assert, so there is no single change that works for all tests. Each test that uses the `SpyLocation` to simulate changes in the browser URL should be evaluated on a case-by-case basis. |
| [PR #41730][GithubAngularAngularPull41730] | `SpyLocation` 使用的 `RouterTestingModule` 的行为已更改以匹配浏览器的行为。当 `Location.go` 被调用时，它不再发出 `popstate` 事件。此外， `simulateHashChange` 现在会*同时*触发 `hashchange` 事件和 `popstate` 事件。那些用到了 `location.go` 并期望 `Router` 获取更改的测试应迁移到 `simulateHashChange`。每个测试尝试断言的内容都不同，因此没有任何一种改法能适用于所有测试。每个使用 `SpyLocation` 来模拟浏览器 URL 更改的测试都应根据具体情况进行评估。 |
| [PR&nbsp;#42952][GithubAngularAngularPull42952] | A new type called `FormControlStatus` has been introduced, which is a union of all possible status strings for form controls. `AbstractControl.status` has been narrowed from `string` to `FormControlStatus`, and `statusChanges` has been narrowed from `Observable<any>` to `Observable<FormControlStatus>`. Most applications should consume the new types seamlessly. Any breakage caused by this change is likely due to one of the following two problems: <br/> 1. The app is comparing <code>AbstractControl.status</code> against a string which is not a valid status.<br/> 2. The app is using `statusChanges` events as if they were something other than strings. |
| [PR #42952][GithubAngularAngularPull42952] | 引入了一种称为 `FormControlStatus` 的新类型，它是表单控件所有可能状态字符串的联合。 `AbstractControl.status` 已经从 `string` 收窄到 `FormControlStatus` ， `statusChanges` 已经从 `Observable<any>` 收窄到 `Observable<FormControlStatus>` 。大多数应用程序应该都能无缝地使用新类型。此更改导致的任何损坏都可能是由于以下两个问题之一造成的：<br/> 1. 该应用程序正在将 `AbstractControl.status` 与无效的状态字符串进行比较。<br/> 2. 该应用程序正在使用 `statusChanges` 事件，而它们不是字符串。 |
| [PR&nbsp;#43087][GithubAngularAngularPull43087] | Previously ,`null` and `undefined` inputs for `routerLink` were equivalent to empty string and there was no way to disable the navigation of the link. In addition, the `href` is changed from a property `HostBinding()` to an attribute binding (`HostBinding('attr.href')`). The effect of this change is that `DebugElement.properties['href']` now returns the `href` value returned by the native element which is the full URL rather than the internal value of the `RouterLink` `href` property. |
| [PR #43087][GithubAngularAngularPull43087] | 以前， `routerLink` 的 `null` 和 `undefined` 输入等效于空字符串，并且无法禁用链接的导航。此外，`href` 从 `HostBinding()` Property 绑定更改为 Attribute 绑定（ `HostBinding('attr.href')` ）。此更改的效果是 `DebugElement.properties['href']` 现在会返回由原生元素返回的 `href` 值，该值是完整的 URL，而不是 `RouterLink` `href` 属性的内部值。 |
| [PR&nbsp;#43496][GithubAngularAngularPull43496] | The router no longer replaces the browser URL when a new navigation cancels an ongoing navigation. The replacement of the browser URL often caused URL flicker and was only in place to support some AngularJS hybrid applications. Hybrid applications which rely on the presence of `navigationId` on each initial navigation handled by the Angular router should instead subscribe to `NavigationCancel` events and manually perform the `location.replaceState` to add `navigationId` to the Router state.<br />In addition, tests that assert `urlChanges` on the `SpyLocation` should be adjusted to account for the lack of the `replaceState` trigger. |
| [PR #43496][GithubAngularAngularPull43496] | 当新导航取消了正在进行的导航时，路由器不再替换浏览器 URL。浏览器 URL 的替换经常导致 URL 闪烁，这只是为了支持一些 AngularJS 混合应用程序。依赖于 Angular 路由器处理的每个初始导航上存在 `navigationId` 的混合应用程序应改为订阅 `NavigationCancel` 事件并手动执行 `location.replaceState` 以将 `navigationId` 添加到路由器状态中。此外，应调整在 `SpyLocation` 上断言 `urlChanges` 的测试以解决缺少 `replaceState` 触发器的问题。 |
| [PR&nbsp;#43507][GithubAngularAngularPull43507] | The `WrappedValue` class is no longer imported from `@angular/core`. This change may result in compile errors or failures at runtime, if outdated libraries are used that rely on `WrappedValue`. Dependancy on `WrappedValue` should be removed since no replacement is available. |
| [PR #43507][GithubAngularAngularPull43507] | `WrappedValue` 类不再从 `@angular/core` 导入。如果使用依赖 `WrappedValue` 的过时库，则此更改可能会导致编译错误或运行时失败。由于没有可用的替代品，因此应移除对 `WrappedValue` 的依赖。 |
| [PR&nbsp;#43591][GithubAngularAngularPull43591] | It is no longer possible to use `Route.loadChildren` with a string value. The following supporting classes were removed from `@angular/core`: <br/> \* <code>NgModuleFactoryLoader</code> <br/> \* <code>SystemJsNgModuleFactoryLoader</code><br/> The `@angular/router` package no longer exports the following symbols: <br/> \* <code>SpyNgModuleFactoryLoader</code><br/> \* <code>DeprecatedLoadChildren</code><br/> The signature of the `setupTestingRouter` function from `@angular/core/testing` was changed to drop the `NgModuleFactoryLoader` parameter, since an value for that parameter can not be created. |
| [PR #43591][GithubAngularAngularPull43591] | 不能再将 `Route.loadChildren` 与字符串值一起使用。从 `@angular/core` 中移除了以下支持类： <br/> \* <code>NgModuleFactoryLoader</code> <br/> \* <code>SystemJsNgModuleFactoryLoader</code><br/> `@angular/router` 包不再导出下列符号： <br/> \* <code>SpyNgModuleFactoryLoader</code><br/> \* <code>DeprecatedLoadChildren</code><br/> 来自 `@angular/core/testing` 的 `setupTestingRouter` 函数的签名已更改，移除了 `NgModuleFactoryLoader` 参数，因为无法创建该参数的值。 |
| [PR&nbsp;#43668][GithubAngularAngularPull43668] | The return type of `SwUpdate#activateUpdate` and `SwUpdate#checkForUpdate` changed to `Promise<boolean>`.<br />Although unlikely, this change may cause TypeScript type-checking to fail in some cases. If necessary, update your types to account for the new return type. |
| [PR #43668][GithubAngularAngularPull43668] | `SwUpdate#activateUpdate` 和 `SwUpdate#checkForUpdate` 的返回类型更改为 `Promise<boolean>` 。<br/>尽管不太可能，但在某些情况下，此更改可能会导致 TypeScript 类型检查失败。如有必要，请更新你的类型以说明新的返回类型。 |
| [Issue&nbsp;#22159][GithubAngularAngularCliIssues22159] | Scripts that load via dynamic `import()` are now treated as ES modules (meaning they must be strict mode-compatible). |
| [问题 #22159][GithubAngularAngularCliIssues22159] | 通过动态 `import()` 加载的脚本现在被视为 ES 模块（意味着它们必须是严格模式兼容的）。 |

### New deprecations

### 新的弃用

<a id="deprecations"></a>

| Removed | Replacement | Details |
| :------ | :---------- | :------ |
| 已移除 | 替代品 | 详情 |
| [`getModuleFactory`][AioApiCoreGetmodulefactory] | [`getNgModuleById`][AioApiCoreGetngmodulebyid] |  |
| [ `getModuleFactory` ][AioApiCoreGetmodulefactory] | [ `getNgModuleById` ][AioApiCoreGetngmodulebyid] |  |
| Factory-based signature of [`ApplicationRef.bootstrap`][AioApiCoreApplicationrefBootstrap] | Type-based signature of [`ApplicationRef.bootstrap`][AioApiCoreApplicationrefBootstrap] | Use the Type-based signature in place of the Factory-based signature. |
| [ `ApplicationRef.bootstrap` ][AioApiCoreApplicationrefBootstrap] 的基于工厂的签名 | [ `ApplicationRef.bootstrap` ][AioApiCoreApplicationrefBootstrap]的基于类型的签名 | 使用基于类型的签名代替基于工厂的签名。 |
| [`PlatformRef.bootstrapModuleFactory`][AioApiCorePlatformrefBootstrapmodulefactory] | [`PlatformRef.bootstrapModule`][AioApiCorePlatformrefBootstrapmodule] |  |
| [`ModuleWithComponentFactories`][AioApiCoreModulewithcomponentfactories] | none |  |
| [`ModuleWithComponentFactories`][AioApiCoreModulewithcomponentfactories] | 无 |  |
| [`Compiler`][AioApiCoreCompiler] | none |  |
| [`Compiler`][AioApiCoreCompiler] | 无 |  |
| [`CompilerFactory`][AioApiCoreCompilerfactory] | none |  |
| [`CompilerFactory`][AioApiCoreCompilerfactory] | 无 |  |
| [`NgModuleFactory`][AioApiCoreNgmodulefactory] | Non-factory based framework APIs | Use the non-factory based framework APIs, such as [`PlatformRef.bootstrapModule`][AioApiCorePlatformrefBootstrapmodule] and [`createNgModuleRef`][AioApiCoreCreatengmoduleref]. |
| [`NgModuleFactory`][AioApiCoreNgmodulefactory] | 非基于工厂的框架 API | 使用非基于工厂的框架 API，例如 [ `PlatformRef.bootstrapModule` ][AioApiCorePlatformrefBootstrapmodule] 和 [ `createNgModuleRef` ][AioApiCoreCreatengmoduleref]。 |
| Factory-based signature of [`ViewContainerRef.createComponent`][AioApiCoreViewcontainerrefCreatecomponent] | Type-based signature of [`ViewContainerRef.createComponent`][AioApiCoreViewcontainerrefCreatecomponent] | Use the Type-based signature in place of the Factory-based signature. |
| [ `ViewContainerRef.createComponent` ][AioApiCoreViewcontainerrefCreatecomponent]的基于工厂的签名 | [ `ViewContainerRef.createComponent` ][AioApiCoreViewcontainerrefCreatecomponent] 基于类型的签名 | 使用基于类型的签名代替基于工厂的签名。 |
| `aotSummaries` parameter of the [`TestBed.initTestEnvironment` method][AioApiCoreTestingTestbedInittestenvironment] | none |  |
| [ `TestBed.initTestEnvironment` 方法][AioApiCoreTestingTestbedInittestenvironment] 的 `aotSummaries` 参数 | 无 |  |
| `aotSummaries` parameter of the [`TestModuleMetadata` type][AioApiCoreTestingTestmodulemetadata] | none |  |
| [ `TestModuleMetadata` 类型][AioApiCoreTestingTestmodulemetadata] 的 `aotSummaries` 参数 | 无 |  |
| [`renderModuleFactory`][AioApiPlatformServerRendermodulefactory] | [`renderModule`][AioApiPlatformServerRendermodule] |  |
| [`SwUpdate#activated`][AioApiServiceWorkerSwupdateActivated] | [`SwUpdate#activateUpdate()`][AioApiServiceWorkerSwupdateActivateupdate] | Use the return value of [`SwUpdate#activateUpdate()`][AioApiServiceWorkerSwupdateActivateupdate]. |
| [ `SwUpdate#activated` ][AioApiServiceWorkerSwupdateActivated] | [ `SwUpdate#activateUpdate()` ][AioApiServiceWorkerSwupdateActivateupdate] | 使用 [ `SwUpdate#activateUpdate()` ][AioApiServiceWorkerSwupdateActivateupdate] 的返回值。 |
| [`SwUpdate#available`][AioApiServiceWorkerSwupdateAvailable] | [`SwUpdate#versionUpdates`][AioApiServiceWorkerSwupdateVersionupdates] |  |
| `bind-input="value"` | `[input]="value"` |  |
| `bind-animate-trigger="value"` | `[@trigger]="value"` |  |
| `on-click="onClick()"` | `(click)="onClick()"` |  |
| `bindon-ngModel="value"` | `[(ngModel)]="value"` |  |
| `ref-templateRef` | `#templateRef` |  |

<!-- links -->

[AioApiCoreApplicationrefBootstrap]: api/core/ApplicationRef#bootstrap "bootstrap - ApplicationRef | Core - API | Angular"

[AioApiCoreCompiler]: api/core/Compiler "Compiler | Core - API | Angular"

[AioApiCoreCompilerfactory]: api/core/CompilerFactory "CompilerFactory | Core - API | Angular"

[AioApiCoreCreatengmoduleref]: api/core/createNgModuleRef "createNgModuleRef | Core - API | Angular"

[AioApiCoreGetmodulefactory]: api/core/getModuleFactory "getModuleFactory | Core - API | Angular"

[AioApiCoreGetngmodulebyid]: api/core/getNgModuleById "getNgModuleById | Core - API | Angular"

[AioApiCoreModulewithcomponentfactories]: api/core/ModuleWithComponentFactories "ModuleWithComponentFactories | Core - API | Angular"

[AioApiCoreNgmodulefactory]: api/core/NgModuleFactory "NgModuleFactory | Core - API | Angular"

[AioApiCorePlatformrefBootstrapmodulefactory]: api/core/PlatformRef#bootstrapModuleFactory "bootstrapModuleFactory - PlatformRef | Core - API | Angular"

[AioApiCorePlatformrefBootstrapmodule]: api/core/PlatformRef#bootstrapModule "bootstrapModule - PlatformRef | Core - API | Angular"

[AioApiCoreTestingTestbedInittestenvironment]: api/core/testing/TestBed#inittestenvironment "inittestenvironment - TestBed | Testing - Core - API | Angular"

[AioApiCoreTestingTestmodulemetadata]: api/core/testing/TestModuleMetadata "TestModuleMetadata | Testing - Core - API | Angular"

[AioApiCoreViewcontainerrefCreatecomponent]: api/core/ViewContainerRef#createComponent "createComponent - ViewContainerRef | Core - API | Angular"

[AioApiPlatformServerRendermodulefactory]: api/platform-server/renderModuleFactory "renderModuleFactory | Platform server - API | Angular"

[AioApiPlatformServerRendermodule]: api/platform-server/renderModule "renderModule | Platform server - API | Angular"

[AioApiServiceWorkerSwupdateActivated]: api/service-worker/SwUpdate#activated "activated - SwUpdate | Service worker - API | Angular"

[AioApiServiceWorkerSwupdateActivateupdate]: api/service-worker/SwUpdate#activateUpdate "activateUpdate - SwUpdate | Service worker - API | Angular"

[AioApiServiceWorkerSwupdateAvailable]: api/service-worker/SwUpdate#available "available - SwUpdate | Service worker - API | Angular"

[AioApiServiceWorkerSwupdateVersionupdates]: api/service-worker/SwUpdate#versionUpdates "versionUpdates - SwUpdate | Service worker - API | Angular"

[AioGuideReleasesDeprecationPractices]: guide/releases#deprecation-practices "Deprecation practices - Angular versioning and releases | Angular"

<!-- external links -->

[AngularBlog76c02f782aa4]: https://blog.angular.io/76c02f782aa4 "Upcoming improvements to Angular library distribution | Angular Blog"

[AngularUpdateMain]: https://update.angular.io " Angular Update Guide"

[DevThisIsAngularImprovingAngularTestsByEnablingAngularTestingModuleTeardown38kh]: https://dev.to/this-is-angular/improving-angular-tests-by-enabling-angular-testing-module-teardown-38kh "Improving Angular tests by enabling Angular testing module teardown | This is Angular | DEV Community"

[GithubAngularAngularIssues41840]: https://github.com/angular/angular/issues/41840 "RFC: Internet Explorer 11 support deprecation and removal #41840 | angular/angular | GitHub"

[GithubAngularAngularPull31187]: https://github.com/angular/angular/pull/31187 "fix(router): Allow question marks in query param values #31187 | angular/angular | GitHub"

[GithubAngularAngularPull41730]: https://github.com/angular/angular/pull/41730 "fix(common): synchronise location mock behavior with the navigators #41730 | angular/angular | GitHub"

[GithubAngularAngularPull42952]: https://github.com/angular/angular/pull/42952 "feat(forms): Give form statuses a more specific type #42952 | angular/angular | GitHub"

[GithubAngularAngularPull43087]: https://github.com/angular/angular/pull/43087 "fix(router): null/undefined routerLink should disable navigation #43087 | angular/angular | GitHub"

[GithubAngularAngularPull43496]: https://github.com/angular/angular/pull/43496 "fix(router): Prevent URL flicker when new navigations cancel ongoing ... #43496 | angular/angular | GitHub"

[GithubAngularAngularPull43507]: https://github.com/angular/angular/pull/43507 "perf(core): remove support for the deprecated WrappedValue #43507 | angular/angular | GitHub"

[GithubAngularAngularPull43591]: https://github.com/angular/angular/pull/43591 "refactor(router): remove support for loadChildren string syntax #43591 | angular/angular | GitHub"

[GithubAngularAngularPull43642]: https://github.com/angular/angular/pull/43642 "feat(core): drop support for TypeScript 4.2 and 4.3 #43642 | angular/angular | GitHub"

[GithubAngularAngularPull43668]: https://github.com/angular/angular/pull/43668 "feat(service-worker): improve ergonomics of the SwUpdate APIs #43668 | angular/angular | GitHub"

[GithubAngularAngularPull43740]: https://github.com/angular/angular/pull/43740 "feat(bazel): expose esm2020 and es2020 conditions in APF package exports #43740 | angular/angular | GitHub"

[GithubAngularAngularCliIssues21545]: https://github.com/angular/angular-cli/issues/21545 "[RFC] Persistent build cache by default #21545 | angular/angular-cli | GitHub"

[GithubAngularAngularCliIssues22159]: https://github.com/angular/angular-cli/issues/22159 "Script imports are modules by default #22159 | angular/angular-cli | GitHub"

<!-- end links -->

@reviewed 2021-11-01

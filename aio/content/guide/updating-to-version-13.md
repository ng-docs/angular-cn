# Update Angular
# 升级 Angular

This guide contains information to update to Angular version 13.

本指南包含有关升级到 Angular v13 的信息。

## Update Angular CLI applications

## 升级 CLI 应用

For step-by-step instructions on how to update to the latest Angular release and leverage the Angular automated migration tools, use the interactive update guide at [update.angular.io][AngularUpdateMain].

有关如何升级到最新的 Angular 版本以及如何利用我们的自动迁移工具进行升级的分步说明，请使用 [update.angular.io][AngularUpdateMain] 上的交互式升级指南。

## Changes and deprecations in version 13

## 版本 13 中的更改和弃用

<div class="alert is-helpful">

For information about the deprecation and removal practices of Angular, see [Angular Release Practices][AioGuideReleasesDeprecationPractices].

有关 Angular 弃用和删除实践的信息，请参阅 [Angular 发布实践][AioGuideReleasesDeprecationPractices]。

</div>

*   **Removal of View Engine**

    **弃用 View Engine**

    Requires all applications and libraries to build using Ivy.
    See the [Upcoming improvements to Angular library distribution][AngularBlog76c02f782aa4] blog.

    要求所有的应用程序和库都使用 Ivy 构建。
    详情参阅 [即将对 Angular 库的改进][AngularBlog76c02f782aa4] 博客。

*   **Modernization of the Angular Package Format \(APF\)**

    **Angular Package Format (APF) 的现代化**

    Removed older output formats, including View Engine specific metadata.

    移除了旧的输出格式，包括来自 View Engine 的特定元数据。

*   **Removal of IE11 Support**

    **结束对 IE11 的支持**

    Removes all support for Microsoft Internet Explorer 11 \(IE11\).
    See [Issue&nbsp;#41840][GithubAngularAngularIssues41840].

    移除对 Internet Explorer 11 (IE11) 的所有支持。查看 [Issue&nbsp;#41840][GithubAngularAngularIssues41840] 。

*   **Testbed module teardown**

    **Testbed 模块销毁**

    Adds the option in `initTestEnvironment` to completely remove test environments from an application.
    See the [Improving Angular tests by enabling Angular testing module teardown][DevThisIsAngularImprovingAngularTestsByEnablingAngularTestingModuleTeardown38kh] article.

    添加 `initTestEnvironment` 中的一个选项以完整地从应用程序中删除测试环境。
    查看 [通过启用 Angular 测试模块销毁以改进 Angular 测试][DevThisIsAngularImprovingAngularTestsByEnablingAngularTestingModuleTeardown38kh] 文章。

*   **`$localize` tagged message strings**

    **`$localize` 标记信息字符串**

    Adds documentation for the Angular `$localize` API and tagged message strings.

    为 Angular 的 `$localize` API 和标记信息字符串添加文档说明

*   **Disk Cache**

    **磁盘缓存**

    Enables the persistent build cache by default for all applications.
    See [Issue&nbsp;#21545][GithubAngularAngularCliIssues21545].

    为所有应用程序默认开启持续的构建缓存。
    查看 [Issue&nbsp;#21545][GithubAngularAngularCliIssues21545] 。

### Breaking changes in Angular version 13

### Angular 13 版本中的重大更改

{@a breaking-changes}

|                                                         | Details                                                      |
| :------------------------------------------------------ | :----------------------------------------------------------- |
|                                                         | 详情                                                         |
| [**PR&nbsp;#43642**][GithubAngularAngularPull43642]     | TypeScript versions older than `4.4.2` are no longer supported. |
| [**PR&nbsp;#43642**][GithubAngularAngularPull43642]     | 不再支持版本号低于 `4.4.2`  的 TypeScript。                  |
| [**PR&nbsp;#43740**][GithubAngularAngularPull43740]     | NodeJS versions older than `v12.20.0` are no longer supported. The Angular packages now use the NodeJS package exports feature with subpath patterns and requires a NodeJS version above `14.15.0` or `16.10.0`. |
| [**PR&nbsp;#43740**][GithubAngularAngularPull43740]     | 不再支持版本号低于 `v12.20.0` 的 NodeJS 。Angular 包现在使用 NodeJS 包的子路径导出功能，需要 NodeJS 版本高于`14.15.0` 或 `16.10.0` 。 |
| [PR&nbsp;#31187][GithubAngularAngularPull31187]         | Previously, the default url serializer dropped everything after and including a question mark in query parameters. That is, for a navigation to `/path?q=hello?&other=123`, the query parameters parsed to just `{q: 'hello'}`. This is incorrect, because the URI spec allows for question mark characers in query data. This change now correctly parses the query parameters for `/path?q=hello?&other=123` as `{v: 'hello?', other: '123'}`. |
| [PR&nbsp;#31187][GithubAngularAngularPull31187]         | 以前，默认的 url 序列化器会在 query 参数中删除包括问号在内后面的所有内容。也就是说，对于一个 `/path?q=hello?&other=123` 的导航，query 参数的结果只解析了 `{q: 'hello'}`。这是不正确的，因为 URI 规范允许在 query 中使用问号字符。本次修改可以将 `/path?q=hello?&other=123` 正确地解析为 `{v: 'hello?', other: '123'}` |
| [PR&nbsp;#41730][GithubAngularAngularPull41730]         | The behavior of the `SpyLocation` used by the `RouterTestingModule` has changed to match the behavior of browsers. It no longer emits a `popstate` event when `Location.go` is called. In addition, `simulateHashChange` now triggers *both* a `hashchange` event and a `popstate` event. Tests that use `location.go` and expect the changes to be picked up by the `Router` should migrate to `simulateHashChange`. Each test is different in what it attempts to assert, so there is no single change that works for all tests. Each test that uses the `SpyLocation` to simulate changes in the browser URL should be evaluated on a case-by-case basis. |
| [PR&nbsp;#41730][GithubAngularAngularPull41730]         | `RouterTestingModule` 使用的 `SpyLocation` 行为已经改变了，以适配浏览器的行为。当 `Location.go` 被调用时，它将不再发出 `popstate` 事件。此外，`simulateHashChange` 现在会同时触发 `hashchange` 事件和 `popstate` 事件。使用 `location.go` 并希望被 `Router` 接收到变化的测试应迁移到 `simulateHashChange` 中。每一个测试试图断言的内容都是不一样的，因此没有一个变化能适用于所有的测试。每一个使用 `SpyLocation` 来模拟浏览器 URL 变化的测试都应具体问题具体分析。 |
| [PR&nbsp;#42952][GithubAngularAngularPull42952]         | 引入了一个名为 `FormControlStatus` 的新类型，它是所有表单控件所有可能的状态字符串的集合。`AbstractControl.status` 的范围已经从 `string` 缩小到 `FormControlStatus` ，`statusChanges` 的范围从 `Observable<any>` 缩小到 `Observable<FormControlStatus>` 了。大多数的应用程序可以无缝使用新的类型。任何由这一变化引起的破坏可能是由于以下两个问题之一： <ol><li>应用程序正在将 `AbstractControl.status` 与一个不是有效状态的字符串进行比较。</li><li>应用程序将 `statusChanges` 事件当作是字符串以外的东西来使用。</li></ol> |
| [PR&nbsp;#43087][GithubAngularAngularPull43087]         | Previously ,`null` and `undefined` inputs for `routerLink` were equivalent to empty string and there was no way to disable the navigation of the link. In addition, the `href` is changed from a property `HostBinding()` to an attribute binding \(`HostBinding('attr.href')`\). The effect of this change is that `DebugElement.properties['href']` now returns the `href` value returned by the native element which is the full URL rather than the internal value of the `RouterLink` `href` property. |
| [PR&nbsp;#43087][GithubAngularAngularPull43087]         | 以前，`routerLink` 中的 `null` 和 `undefined` 输入等同于空字符串，且没办法禁用这个链接的导航。此外，`href` 从属性 `HostBinding()` 改为了一个属性绑定 (`HostBinding('attr.href')`)。这个改动的效果是，`DebugElement.properties['href']` 现在返回的是由原生元素的返回的完整 URL 的 `href` 值，而不是 `RouterLink` 中 `href` 属性的内容值。 |
| [PR&nbsp;#43496][GithubAngularAngularPull43496]         | The router no longer replaces the browser URL when a new navigation cancels an ongoing navigation. The replacement of the browser URL often caused URL flicker and was only in place to support some AngularJS hybrid applications. Hybrid applications which rely on the presence of `navigationId` on each initial navigation handled by the Angular router should instead subscribe to `NavigationCancel` events and manually perform the `location.replaceState` to add `navigationId` to the Router state.<br />In addition, tests that assert `urlChanges` on the `SpyLocation` should be adjusted to account for the lack of the `replaceState` trigger. |
| [PR&nbsp;#43496][GithubAngularAngularPull43496]         | 当一个新的导航取消正在进行的导航时，路由器将不再替换浏览器的 URL。浏览器 URL 的替换通常会导致 URL 闪烁，并且这只是为了支持一些 AngularJS 的 Hybrid 混合应用。依赖于 Angular 路由器控制每个初始导航的 `navigationId` 的 Hybrid 混合应用应该改为订阅 `NavigationCancel` 事件和手动执行 `location.replaceState` 来添加 `navigationId` 到路由器状态。<br />此外，在 `SpyLocation` 中断言 `urlChanges` 的测试应为了 `replaceState` 的缺少做调整。 |
| [PR&nbsp;#43507][GithubAngularAngularPull43507]         | The `WrappedValue` class is no longer imported from `@angular/core`. This change may result in compile errors or failures at runtime, if outdated libraries are used that rely on `WrappedValue`. Dependancy on `WrappedValue` should be removed since no replacement is available. |
| [PR&nbsp;#43507][GithubAngularAngularPull43507]         | 不再支持从 `@angular/core` 中导入`WrappedValue` 类。如果用了依赖 `WrappedValue` 的过时库，那么此改动可能会导致运行时的编译错误或者失败。因没有可用的替代方案，故应移除对 `WrappedValue` 的依赖。 |
| [PR&nbsp;#43591][GithubAngularAngularPull43591]         | 不再支持将 `Route.loadChildren` 用在字符串身上。以下正在支持的类已从 `@angular/core` 中被移除：  <ul><li><code>NgModuleFactoryLoader</code></li><li><code>SystemJsNgModuleFactoryLoader</code></li></ul> `@angular/router` 包不再导出如下类型： <ul><li><code>SpyNgModuleFactoryLoader</code></li><li><code>DeprecatedLoadChildren</code></li></ul> 修改了 `@angular/core/testing` 中的 `setupTestingRouter` 方法的签名以删除 `NgModuleFactoryLoader` 的参数，因为无法创建该参数的值。 |
| [PR&nbsp;#43668][GithubAngularAngularPull43668]         | The return type of `SwUpdate#activateUpdate` and `SwUpdate#checkForUpdate` changed to `Promise<boolean>`.<br />Although unlikely, this change may cause TypeScript type-checking to fail in some cases. If necessary, update your types to account for the new return type. |
| [PR&nbsp;#43668][GithubAngularAngularPull43668]         | `SwUpdate#activateUpdate` 和 `SwUpdate#checkForUpdate` 的返回类型更改为了 `Promise<boolean>`。<br />虽然不太可能，但这个变化可能会导致 TypeScript 的类型检查会在某些情况下失败。如有必要，根据新的返回类型更新你的类型。 |
| [Issue&nbsp;#22159][GithubAngularAngularCliIssues22159] | Scripts that load via dynamic `import()` are now treated as ES modules (meaning they must be strict mode-compatible). |
| [Issue&nbsp;#22159][GithubAngularAngularCliIssues22159] | 通过动态 `import()` 加载的 脚本文件现在可以当作是 ES 模块处理（意味着它们必须兼容于严格模式）。 |

### New deprecations

### 新的弃用

{@a deprecations}

| Removed                                                      | Replacement                                                  | Details                                                      |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| 移除                                                         | 替换                                                         | 详情                                                         |
| [`getModuleFactory`][AioApiCoreGetmodulefactory]             | [`getNgModuleById`][AioApiCoreGetngmodulebyid]               |                                                              |
| Factory-based signature of [`ApplicationRef.bootstrap`][AioApiCoreApplicationrefBootstrap] | Type-based signature of [`ApplicationRef.bootstrap`][AioApiCoreApplicationrefBootstrap] | Use the Type-based signature in place of the Factory-based signature. |
| [`ApplicationRef.bootstrap`][AioApiCoreApplicationrefBootstrap] 基于工厂的签名 | [`ApplicationRef.bootstrap`][AioApiCoreApplicationrefBootstrap] 基于类型的签名 | 使用基于类型的签名替换掉基于工厂的签名。                     |
| [`PlatformRef.bootstrapModuleFactory`][AioApiCorePlatformrefBootstrapmodulefactory] | [`PlatformRef.bootstrapModule`][AioApiCorePlatformrefBootstrapmodule] |                                                              |
| [`ModuleWithComponentFactories`][AioApiCoreModulewithcomponentfactories] | none                                                         |                                                              |
| [`ModuleWithComponentFactories`][AioApiCoreModulewithcomponentfactories] | 无                                                           |                                                              |
| [`Compiler`][AioApiCoreCompiler]                             | none                                                         |                                                              |
| [`Compiler`][AioApiCoreCompiler]                             | 无                                                           |                                                              |
| [`CompilerFactory`][AioApiCoreCompilerfactory]               | none                                                         |                                                              |
| [`CompilerFactory`][AioApiCoreCompilerfactory]               | 无                                                           |                                                              |
| [`NgModuleFactory`][AioApiCoreNgmodulefactory]               | Non-factory based framework APIs                             | Use the non-factory based framework APIs, such as [`PlatformRef.bootstrapModule`][AioApiCorePlatformrefBootstrapmodule] and [`createNgModuleRef`][AioApiCoreCreatengmoduleref]. |
| [`NgModuleFactory`][AioApiCoreNgmodulefactory]               | 非基于工厂的框架 API                                         | 使用非基于工厂的框架 API，比如 `PlatformRef.bootstrapModule` 和 `createNgModuleRef` 。 |
| Factory-based signature of [`ViewContainerRef.createComponent`][AioApiCoreViewcontainerrefCreatecomponent] | Type-based signature of [`ViewContainerRef.createComponent`][AioApiCoreViewcontainerrefCreatecomponent] | Use the Type-based signature in place of the Factory-based signature. |
| Factory-based signature of [`ViewContainerRef.createComponent`][AioApiCoreViewcontainerrefCreatecomponent] | `ViewContainerRef.createComponent` 基于类型的签名            | 使用基于类型的签名替换掉基于工厂的签名。                     |
| `aotSummaries` parameter of the [`TestBed.initTestEnvironment` method][AioApiCoreTestingTestbedInittestenvironment] | none                                                         |                                                              |
| [`TestBed.initTestEnvironment` 方法][AioApiCoreTestingTestbedInittestenvironment] 的`aotSummaries` 参数 | 无                                                           |                                                              |
| `aotSummaries` parameter of the [`TestModuleMetadata` type][AioApiCoreTestingTestmodulemetadata] | none                                                         |                                                              |
| [`TestModuleMetadata` 类型][AioApiCoreTestingTestmodulemetadata]的 `aotSummaries` 参数 | 无                                                           |                                                              |
| [`renderModuleFactory`][AioApiPlatformServerRendermodulefactory] | [`renderModule`][AioApiPlatformServerRendermodule]           |                                                              |
| [`SwUpdate#activated`][AioApiServiceWorkerSwupdateActivated] | [`SwUpdate#activateUpdate()`][AioApiServiceWorkerSwupdateActivateupdate] | Use the return value of [`SwUpdate#activateUpdate()`][AioApiServiceWorkerSwupdateActivateupdate]. |
| [`SwUpdate#activated`][AioApiServiceWorkerSwupdateActivated] | [`SwUpdate#activateUpdate()`][AioApiServiceWorkerSwupdateActivateupdate] | 使用 [`SwUpdate#activateUpdate()`][AioApiServiceWorkerSwupdateActivateupdate]的返回值。 |
| [`SwUpdate#available`][AioApiServiceWorkerSwupdateAvailable] | [`SwUpdate#versionUpdates`][AioApiServiceWorkerSwupdateVersionupdates] |                                                              |
| `bind-input="value"`                                         | `[input]="value"`                                            |                                                              |
| `bind-animate-trigger="value"`                               | `[@trigger]="value"`                                         |                                                              |
| `on-click="onClick()"`                                       | `(click)="onClick()"`                                        |                                                              |
| `bindon-ngModel="value"`                                     | `[(ngModel)]="value"`                                        |                                                              |
| `ref-templateRef`                                            | `#templateRef`                                               |                                                              |

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
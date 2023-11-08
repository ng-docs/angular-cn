Update Angular to v16

更新到 Angular v16

This topic provides information about updating your Angular applications to Angular version 16.

本主题会提供如何将 Angular 应用程序更新到第 16 版的信息。

For a summary of this information and the step-by-step procedure to update your Angular application
to v16, see the [Angular Update Guide](https://update.angular.io).

有关此信息的摘要以及将 Angular 应用程序更新到 v16 的分步过程，请参阅[Angular 更新指南](https://update.angular.io)。

The information in the [Angular Update Guide](https://update.angular.io) and this topic is
summarized from these changelogs:

[Angular 更新指南](https://update.angular.io)和本主题中的信息是从这些更改日志中总结的：

[angular/angular changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)

[angular/angular 库的变更日志](https://github.com/angular/angular/blob/main/CHANGELOG.md)

[angular/angular-cli changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)

[angular/angular-cli 库的变更日志](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)

[angular/components changelog](https://github.com/angular/components/blob/main/CHANGELOG.md)

[angular/components 库的变更日志](https://github.com/angular/components/blob/main/CHANGELOG.md)

Information about updating Angular applications to v15 is archived at
[Update to version 15](/guide/update-to-version-15).

有关将 Angular 应用程序更新到 v15 的信息已归档在[更新到版本 15](/guide/update-to-version-15)中。

<a id="new-features"></a>



Feature highlights in Angular v16

Angular v16 中的亮点特性

For a more comprehensive list of new features, see the
[Angular blog post on the update to v16](https://blog.angular.io).

如需更全面的新特性列表，请参阅[有关 v16 更新的 Angular 博客文章](https://blog.angular.io)。

Angular Signals developer preview

Angular 信号（Signal）的开发者预览

This release includes the first developer preview of Angular's new reactivity primitives: `signal`,
`computed`, and `effect`. See the [signals guide](/guide/signals) for details and the
[Angular Signals RFC](https://github.com/angular/angular/discussions/49685) for more background.

此版本包括 Angular 的新响应式基础的第一个开发者预览：`signal`、`computed` 和 `effect`。有关详细信息，请参阅[信号指南](/guide/signals)；有关更多背景信息，请参阅[Angular Signals RFC](https://github.com/angular/angular/discussions/49685)。

Enhanced hydration developer preview

增强水合功能的开发者预览版

Previously, when Angular bootstrapped on a page that was server-side rendered or compile-time
pre-rendered, the framework would discard any existing DOM nodes and re-render from scratch. With
v16's enhanced hydration support, you can opt into Angular reusing these existing DOM nodes. This
developer preview feature can improve page load performance in many scenarios. See the full
[hydration guide](/guide/hydration) for details.

以前，当 Angular 在服务端渲染或编译时预渲染过的页面上启动时，框架会丢弃任何现有的 DOM 节点并从头开始重新渲染。借助 v16 增强的水合支持，你可以选择让 Angular 复用这些现有的 DOM 节点。此开发者预览功能可以在许多场景中提高页面加载性能。有关详细信息，请参阅完整的[水合指南](/guide/hydration)。

Faster builds with the esbuild developer preview

使用 esbuild 开发者预览版加快构建速度

v16 brings you the developer preview of Angular CLI's new builders based on
[esbuild](https://esbuild.github.io). This new architecture can significantly improve build times in
many scenarios. This preview additionally includes integration with [Vite](https://vitejs.dev)
powering the CLI's development server.

v16 为你带来了 Angular CLI 基于 [esbuild](https://esbuild.github.io) 的新构建器的开发者预览版。这种新架构可以在许多场景中显著缩短构建时间。此预览版还包括与 [Vite](https://vitejs.dev) 的集成，以支持 CLI 开发服务器。

You can try this new build setup by updating your `angular.json`:

你可以通过更新 `angular.json` 来尝试这种新的构建设置：

Standalone component migration and scaffolding

独立组件迁移和脚手架

To support developers transitioning their apps to standalone APIs, Angular v16 includes migration
schematics and a standalone migration guide. These tools dramatically reduce the effort required to
move your code to standalone components, directives, and pipes. Visit the 
[standalone migration guide](/guide/standalone-migration) for details.

为了支持开发者将他们的应用程序转换为独立 API，Angular v16 包括了一些迁移原理图和独立迁移指南。这些工具大大减少了将代码迁移到独立组件、指令和管道时所需的工作量。有关详细信息，请访问 [独立迁移指南](/guide/standalone-migration)。

You can now also generate new Angular applications with standalone components by running:

你现在还可以通过运行以下命令来生成具有独立组件的新 Angular 应用程序：

Required inputs

必备的输入属性

You can now mark component and directive inputs as _required_:

你现在可以把组件和指令的输入属性标记为**必备的**：

If a template includes a component without specifying all of its required inputs, Angular reports
an error at build time.

如果模板包含一个组件，但没有指定其所有必备输入属性，Angular 就会在构建时报告错误。

<a id="breaking-changes"></a>



Highlighted breaking changes in Angular v16

Angular v16 重大变更中的亮点

For a comprehensive list of breaking changes, see the full changelogs on GitHub.

有关重大更改的完整列表，请参阅 GitHub 上的完整变更日志。

<a id="v16-bc-01"></a>



Angular v16 requires node.js version v16 or v18

Angular v16 需要 node.js 版本 v16 或 v18

Angular requires node.js v16 or v18. [PR #47730](https://github.com/angular/angular/pull/49255)

Angular 需要 node.js v16 或 v18。[PR #47730](https://github.com/angular/angular/pull/49255)

See [Version compatibility](/guide/versions) for full version compatibility details.

有关完整版本兼容性的详细信息，请参阅[版本兼容性](/guide/versions)。

<a id="v16-bc-02"></a>



Angular v16 requires TypeScript version 4.9 or later

Angular v16 需要 TypeScript 4.9 或更高版本

Angular v16 no longer supports TypeScript versions older than 4.9. [PR #49155](https://github.com/angular/angular/pull/49155)

Angular v16 不再支持早于 4.9 的 TypeScript 版本。[PR #49155](https://github.com/angular/angular/pull/49155)

<a id="v16-bc-03"></a>



Angular Compatibility Compiler \(ngcc\) has been removed

Angular 兼容性编译器（ngcc）已被删除

The Angular Compatibility Compiler \(ngcc\) was a build tool that facilitated compatibility between
Angular's previous compiler and rendering architecture \(View Engine\) and its new architecture \(Ivy\).

Angular 兼容性编译器（ngcc）是一种构建工具，可促进 Angular 之前的编译器和渲染架构（View Engine）与其新架构（Ivy）之间的兼容性。

View Engine was removed in Angular v13, and v16 finally removes ngcc. As a result, Angular
libraries built with View Engine cannot be used in Angular v16+.

View Engine 已在 Angular v13 中移除了，到 v16 也最终移除了 ngcc。因此，使用 View Engine 构建的 Angular 库不能在 Angular v16+ 中使用。

<a id="v16-bc-04"></a>



Angular Package Format changes

Angular 包格式更改

The Angular Package Format \(APF\) has been updated
with the following changes:

Angular 包格式（APF）已更新，包含以下更改：

Flattened ESM 2015 \(FESM2015\) outputs have been removed.

扁平化 ESM 2015（FESM2015）输出已被移除。

EcmaScript 2020 outputs have been updated to EcmaScript 2022 \(including the flattened output\).

EcmaScript 2020 输出已更新为 EcmaScript 2022（包括扁平化输出）。

See [Angular Package Format](/guide/angular-package-format) for background.

有关背景，请参阅 [Angular 包格式](/guide/angular-package-format)。

<a id="v16-bc-06"></a>



`ReflectiveInjector` has been removed

`ReflectiveInjector` 已移除

The ReflectiveInjector and related symbols were removed. Please update the code to avoid references
to the ReflectiveInjector symbol. Use `Injector.create` to create an injector instead.

`ReflectiveInjector` 和相关符号已移除。请更新代码以避免引用 `ReflectiveInjector` 符号。请改用 `Injector.create` 来创建一个注入器。

<a id="v16-bc-07"></a>



Updated behavior for `Router.createUrlTree`

更新了 `Router.createUrlTree` 的行为

Tests which mock `ActivatedRoute` instances may need to be adjusted because Router.createUrlTree now
does the right thing in more scenarios. This means that tests with invalid/incomplete ActivatedRoute
mocks may behave differently than before. Additionally, tests may now navigate to a real URL where
before they would navigate to the root. Ensure that tests provide expected routes to match. There is
rarely production impact, but it has been found that relative navigations when using
an `ActivatedRoute` that does not appear in the current router state were effectively ignored in the
past. By creating the correct URLs, this sometimes resulted in different navigation behavior in the
application. Most often, this happens when attempting to create a navigation that only updates query
params using an empty command array, for
example `router.navigate([], {relativeTo: route, queryParams: newQueryParams})`. In this case,
the `relativeTo` property should be removed.

可能需要调整对 `ActivatedRoute` 实例的测试进行模拟（Mock），因为 Router.createUrlTree 现在可以在更多场景中做正确的事情。这意味着使用无效/不完整的 ActivatedRoute 进行模拟时的测试行为可能与以前不同。此外，测试现在可以导航到真正的 URL 了，而之前它们会导航到根目录。请确保测试提供了匹配的预期路由。这很少会对生产代码产生影响，但已经发现，当使用未出现在当前路由器状态中的 `ActivatedRoute` 时的相对导航以前被忽略了（现在与期望的行为一致）。通过创建正确的 URL，这偶尔会导致应用程序中出现与以前不同的导航行为。大多数情况下，当尝试创建仅使用空命令数组更新查询参数的导航时就会发生这种情况，例如 `router.navigate([], {relativeTo: route, queryParams: newQueryParams})`。在这种情况下，应该删除 `relativeTo` 属性。

<a id="deprecations"></a>



Deprecations highlights in Angular v16

Angular v16 弃用中的亮点

These APIs remain available in v16, but may be removed in future versions as described by Angular's
[deprecation practices](/guide/releases#deprecation-practices).

这些 API 在 v16 中仍然可用，但可能会在未来的版本中被删除，如 Angular 的[弃用实践](/guide/releases#deprecation-practices)所述。

To maintain the reliability of your Angular application, always update your application as soon as
practicable.

为了保持 Angular 应用程序的可靠性，只要条件允许，就应该尽快更新应用程序。

<a id="v16-dp-02"></a>The `ripple` properties of several Angular Material components

<a id="v16-dp-02"></a>几个 Angular Material 组件的 `ripple` 属性

None

没有了

The `ripple` property of `MatButton`, `MatCheckbox`, `MatChip` is deprecated. This change moves ripples to being a private implementation detail of the components.

`MatButton` 、 `MatCheckbox` 、 `MatChip` 的 `ripple` 属性已弃用。此更改令涟漪成为组件的私有实现细节。

<a id="v16-dp-01"></a>Class and `InjectionToken` router guards and resolvers

<a id="v16-dp-01"></a>类和 `InjectionToken` 形式的路由守卫和解析器

See details

查看具体信息

Class and `InjectionToken` guards and resolvers are deprecated. Instead, write guards as plain JavaScript functions and inject dependencies with `inject` from `@angular/core`.<br>[PR #47924](https://github.com/angular/angular/pull/47924)

类和 `InjectionToken` 形式的守卫和解析器已弃用。现在应该将守卫编写为纯 JavaScript 函数，并使用来自 `@angular/core` 的 `inject` 来注入依赖项。<br>[PR #47924](https://github.com/angular/angular/pull/47924)

Removed

已移除

Replacement

替代品

Details

详情
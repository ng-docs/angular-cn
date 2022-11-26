# Update Angular to v15

# 将 Angular 更新到 v15

<!-- NOTE to writers: When creating the topic for the next version,                               -->

<!--   remember to update the redirect link in angular/aio/firebase.json                          -->

<!-- To update the redirect link in angular/aio/firebase.json:                                    -->

<!--   1. Search for the entry in firebase.json with "source": "guide/update-to-latest-version"   -->

<!--   2,  Update the destination value to refer to the new guide's URL                           -->

<!--                                                                                              -->

This topic provides information about updating your Angular applications to Angular version 15.

本主题提供了有关将 Angular 应用程序更新到 Angular 版本 15 的信息。

For a summary of this information and the step-by-step procedure to update your Angular application to v15, see the [Angular Update Guide](https://update.angular.io).

有关此类信息的摘要以及将 Angular 应用程序更新到 v15 的分步过程，请参阅 [Angular 更新指南](https://update.angular.io)。

The information in the [Angular Update Guide](https://update.angular.io) and this topic is summarized from these change logs:

[Angular 更新指南](https://update.angular.io)和本主题中的信息是从这些更改日志中总结的：

* [angular/angular changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)

* [angular/angular-cli changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)

* [angular/components changelog](https://github.com/angular/components/blob/main/CHANGELOG.md)

Information about updating Angular applications to v14 is archived at [Update to version 14](/guide/update-to-version-14).

有关将 Angular 应用程序更新到 v14 的信息会在[更新到版本 14](/guide/update-to-version-14)中存档。

<a id="new-features"></a>

## New features in Angular v15

## Angular v15 中的新特性

Angular v15 brings many improvements and new features.
This section only contains some of the innovations in v15.

Angular v15 带来了许多改进和新特性。本节仅包含 v15 中的一些创新。

For a comprehensive list of the new features, see the [Angular blog post on the update to v15](https://blog.angular.io/angular-v15-is-now-available-df7be7f2f4c8).

有关新特性的完整列表，请参阅[有关 v15 更新的 Angular 博客文章](https://blog.angular.io/angular-v15-is-now-available-df7be7f2f4c8)。

<!-- markdownLint-disable MD001 -->

#### Standalone components are stable

#### 独立组件是稳定的

The standalone components API lets you build Angular applications without the need to use NgModules. For more information about using these APIs in your next Angular application, see [Standalone components](guide/standalone-components).

独立组件 API 允许你在无需使用 NgModules 的情况下构建 Angular 应用程序。有关在下一个 Angular 应用程序中使用这些 API 的更多信息，请参阅[独立组件](guide/standalone-components)。

#### The `NgOptimizedImage` directive is stable

#### `NgOptimizedImage` 指令现在是稳定版了

Adding `NgOptimizedImage` directive to your component or NgModule can help reduce the download time of images in your Angular application. For more information about using the `NgOptimizedImage` directive, see [Getting started with `NgOptimizedImage`](guide/image-directive).

将 `NgOptimizedImage` 指令添加到你的组件或 NgModule 可以帮助减少 Angular 应用程序中图像的下载时间。有关使用 `NgOptimizedImage` 指令的更多信息，请参阅 [`NgOptimizedImage` 入门](guide/image-directive)。

#### Directives can be added to host elements

#### 可以将指令添加到宿主元素了

The directive composition API makes it possible to add directives to host elements, addressing [feature request #8785](https://github.com/angular/angular/issues/8785). Directives let you add behaviors to your components behaviors without using inheritance.

指令组合 API 可以将指令添加到宿主元素，以解决[特性请求 #8785](https://github.com/angular/angular/issues/8785) 。指令允许你在不使用继承的情况下将行为添加到组件行为中。

#### Stack traces are more helpful

#### 堆栈跟踪更有帮助

Angular v15 makes debugging Angular applications easier with cleaner stack traces.
Angular worked with Google Chrome developers to present stack traces that show more of your application's code and less from the libraries it calls.

Angular v15 使用更清洁的堆栈跟踪，使调试 Angular 应用程序更轻松。 Angular 与 Google Chrome 开发人员合作提供了堆栈跟踪，这些堆栈跟踪显示了更多应用程序代码，而不是它调用的库中的。

For more information about the Chrome DevTools and Angular's support for the cleaner stack traces, see [Modern web debugging in Chrome DevTools](https://developer.chrome.com/blog/devtools-modern-web-debugging/).

有关 Chrome DevTools 和 Angular 对更清洁堆栈跟踪的支持的更多信息，请参阅[Chrome DevTools 中的现代 Web 调试](https://developer.chrome.com/blog/devtools-modern-web-debugging/)。

<!-- vale Angular.Google_Acronyms = NO -->

#### MDC-based components are stable

#### 基于 MDC 的组件是稳定版了

<!-- vale Angular.Google_Acronyms = YES -->

Many of the components in Angular Material v15 have been refactored to be based on Angular Material Design Components (MDC) for the Web.
The refactored components offer improved accessibility and adherence to the Material Design spec.

Angular Material v15 中的许多组件已被重构为基于 Web 的 Angular Material 设计组件 (MDC)。重构的组件提供了改进的无障碍性和对 Material Design 规范的遵守。

For more information about the updated components, see [Migrating to MDC-based Angular Material Components](https://material.angular.io/guide/mdc-migration).

有关更新后的组件的更多信息，请参阅[迁移到基于 MDC 的 Angular Material 组件](https://material.angular.io/guide/mdc-migration)。

<a id="breaking-changes"></a>

## Breaking changes in Angular v15

## Angular v15 中的重大更改

These are the aspects of Angular that behave differently in v15 and that might require you to review and refactor parts of your Angular application.

这些是 Angular 的方面，在 v15 中行为方式不同，可能需要你查看和重构 Angular 应用程序的某些部分。

<a id="v15-bc-01"></a>

#### Angular v15 supports node.js versions: 14.20.x, 16.13.x and 18.10.x

#### Angular v15 支持 node.js 版本： 14.20.x、16.13.x 和 18.10.x

In v15, Angular no longer supports node.js versions 14.\[15-19].x or 16.\[10-12].x. [PR #47730](https://github.com/angular/angular/pull/47730)

在 v15 中，Angular 不再支持 node.js 版本 14.\[15-19].x 或 16.\[10-12].x。[PR #47730](https://github.com/angular/angular/pull/47730)

<a id="v15-bc-02"></a>

#### Angular v15 supports TypeScript version 4.8 or later

#### Angular v15 支持 TypeScript 4.8 或更高版本

In v15, Angular no longer supports TypeScript versions older than 4.8. [PR #47690](https://github.com/angular/angular/pull/47690)

在 v15 中，Angular 不再支持 4.8 之前的 TypeScript 版本。[PR #47690](https://github.com/angular/angular/pull/47690)

<a id="v15-bc-03"></a>

#### `@keyframes` name format changes

#### `@keyframes` 名称格式更改

In v15, `@keyframes` names are prefixed with the component's *scope name*. [PR #42608](https://github.com/angular/angular/pull/42608)

在 v15 中， `@keyframes` 名称以组件的*范围名*为前缀。[PR #42608](https://github.com/angular/angular/pull/42608)

For example, in a component definition whose *scope name* is `host-my-cmp`, a  `@keyframes` rule with a name in v14 of:

例如，在*范围名称*为 `host-my-cmp` 的组件定义中， `@keyframes` 规则在 v14 中的名称为：

<code-example language="ts" hideCopy>

@keyframes foo { ... }

</code-example>

becomes in v15:

在 v15 中变为：

<code-example language="ts" hideCopy>

@keyframes host-my-cmp_foo { ... }

</code-example>

This change can break any TypeScript or JavaScript code that use the names of `@keyframes` rules.

此更改可能会中断任何使用 `@keyframes` 规则名称的 TypeScript 或 JavaScript 代码。

To accommodate this breaking change, you can:

为了适应这种破坏性更改，你可以：

* Change the component's view encapsulation to `None` or `ShadowDom`.

  将组件的视图封装更改为 `None` 或 `ShadowDom` 。

* Define `@keyframes` rules in global stylesheets, such as `styles.css`.

  在全局样式表中定义 `@keyframes` 规则，例如 `styles.css` 。

* Define `@keyframes` rules in your own code.

  在你自己的代码中定义 `@keyframes` 规则。

<a id="v15-bc-05"></a>

#### Invalid constructors for dependency injection can report compilation errors

#### 依赖注入的无效构造函数会报告编译错误

When a class inherits its constructor from a base class, the compiler can report an error when that constructor cannot be used for dependency injection purposes. [PR #44615](https://github.com/angular/angular/pull/44615)

当一个类从基类继承其构造函数时，当该构造函数不能用于依赖注入目的时，编译器可以报告错误。[PR #44615](https://github.com/angular/angular/pull/44615)

This can happen:

这可能会发生在：

* When the base class is missing an Angular decorator such as `@Injectable()` or `@Directive()`

  当基类缺少 Angular 装饰器时，例如 `@Injectable()` 或 `@Directive()`

* When the constructor contains parameters that do not have an associated token ,such as primitive types like `string`.

  当构造函数包含没有关联令牌的参数时，例如 `string` 等基本类型。

These situations used to behave unexpectedly at runtime. For example, a class might be constructed without any of its constructor parameters.
In v15, this is reported as a compilation error.

这些情况过去在运行时会出现意外行为。例如，一个类可能是在没有任何构造函数参数的情况下构造的。在 v15 中，这会报告为编译错误。

New errors reported because of this change can be resolved by either:

由于此更改而报告的新错误可以通过以下任何一种方式解决：

* Decorating the base class from which the constructor is inherited.

  为要从中继承构造函数的基类添加装饰器。

* Adding an explicit constructor to the class for which the error is reported.

  向报告错误的类添加显式构造函数。

<a id="v15-bc-06"></a>

#### `setDisabledState` is always called when a `ControlValueAccessor` is attached

#### 附加 `ControlValueAccessor` 时总是会调用 `setDisabledState`

In v15, `setDisabledState` is always called when a `ControlValueAccessor` is attached. [PR #47576](https://github.com/angular/angular/pull/47576)

在 v15 中，附加 `ControlValueAccessor` 时总是会调用 `setDisabledState` 。[PR #47576](https://github.com/angular/angular/pull/47576)

You can opt out of this behavior with `FormsModule.withConfig` or `ReactiveFormsModule.withConfig`.

你可以用 `FormsModule.withConfig` 或 `ReactiveFormsModule.withConfig` 选择退出此行为。

<a id="v15-bc-07"></a>

#### The `canParse` method has been removed

#### `canParse` 方法已被删除

The `canParse` method has been removed from all translation parsers in `@angular/localize/tools`. [PR #47275](https://github.com/angular/angular/pull/47275)

`canParse` 方法已从 `@angular/localize/tools` 中的所有翻译解析器中删除。[PR #47275](https://github.com/angular/angular/pull/47275)

In v15, use `analyze` should instead and the `hint` parameter in the parse methods is mandatory.

在 v15 中，要用 `analyze` 代替，并且 parse 方法中的 `hint` 参数变成了强制性的。

<a id="v15-bc-08"></a>

#### The `title` property is required on `ActivatedRouteSnapshot`

#### `ActivatedRouteSnapshot` 上需要 `title` 属性

In v15, the `title` property is required on [`ActivatedRouteSnapshot`](api/router/ActivatedRouteSnapshot). [PR #47481](https://github.com/angular/angular/pull/47481)

在 v15 中， [`ActivatedRouteSnapshot`](api/router/ActivatedRouteSnapshot)上的 `title` 属性是必需的。[PR #47481](https://github.com/angular/angular/pull/47481)

<a id="v15-bc-09"></a>

#### `RouterOutlet` instantiates the component after change detection

#### `RouterOutlet` 会在变更检测后才实例化组件

Before v15, during navigation, `RouterOutlet` instantiated the component being activated immediately. [PR #46554](https://github.com/angular/angular/pull/46554)

在 v15 之前，在导航期间， `RouterOutlet` 会立即实例化被激活的组件。[PR #46554](https://github.com/angular/angular/pull/46554)

In v15, the component is not instantiated until after change detection runs.
This change could affect tests that do not trigger change detection after a router navigation,
for example, if your component's constructor calls `router.getCurrentNavigation()`.
Less common, this could affect production code that relies on the exact timing of component availability.

在 v15 中，在变更检测运行之前，不会实例化组件。此更改可能会影响在路由器导航后不触发变更检测的测试，例如，如果你的组件的构造函数调用 `router.getCurrentNavigation()` 。不太常见的情况是，这可能会影响依赖组件可用性确切时间的生产代码。

<a id="v15-bc-10"></a>

#### `relativeLinkResolution` is not configurable in the Router

#### `relativeLinkResolution` 在路由器中不可配置

In v15, `relativeLinkResolution` is not configurable in the Router. [PR #47623](https://github.com/angular/angular/pull/47623)

在 v15 中， `relativeLinkResolution` 在路由器中是不可配置的。[PR #47623](https://github.com/angular/angular/pull/47623)

In previous versions, this option was used to opt out of a bug fix.

在以前的版本中，此选项用于选择退出错误修复。

<a id="v15-bc-04"></a>

#### Angular compiler option `enableIvy` has been removed

#### Angular 编译器选项 `enableIvy` 已删除

The Angular compiler option `enableIvy` has been removed because Ivy is Angular's only rendering engine. [PR #47346](https://github.com/angular/angular/pull/47346)

Angular 编译器选项 `enableIvy` 已删除，因为现在 Ivy 是 Angular 的唯一渲染引擎。[PR #47346](https://github.com/angular/angular/pull/47346)

<a id="v15-bc-10"></a>

#### Angular Material components based on MDC

#### 基于 MDC 的 Angular Material 组件

In Angular Material v15, many components have been refactored to be based on the official Material Design Components for Web (MDC).
For information about breaking changes in Material components v15, see [Migrating to MDC-based Angular Material Components](https://material.angular.io/guide/mdc-migration).

在 Angular Material v15 中，许多组件已被重构为基于官方的 Web Material Design 组件 (MDC) 。有关 Material 组件 v15 中的重大更改的信息，请参阅[迁移到基于 MDC 的 Angular Material 组件](https://material.angular.io/guide/mdc-migration)。

<a id="v15-bc-11"></a>

#### Hardening attribute and property binding rules for `<iframe>` elements

#### 强化 `<iframe>` 元素的属性和属性绑定规则

Existing `<iframe>` instances might have security-sensitive attributes applied to them as an attribute or property binding.
These security-sensitive attributes can occur in a template or in a directive's host bindings.
Such occurrences require an update to ensure compliance with the new and stricter rules about `<iframe>` bindings.
For more information, see [the error page](/errors/NG0910).

现有的 `<iframe>` 实例可能具有作为 Attribute 或 Property 绑定的安全敏感属性。这些安全敏感的属性可以出现在模板或指令的宿主绑定中。此类事件需要更新，以确保符合有关 `<iframe>` 绑定的新的和更严格的规则。有关更多信息，请参阅[错误页面](/errors/NG0910)。

<a id="deprecations"></a>

## Deprecations in Angular v15

## Angular v15 中的弃用

These are the aspects of Angular that are being phased out.
They are still available in v15, but they can be removed in future versions as Angular's [deprecation practices](/guide/releases#deprecation-practices) describe.

这些是 Angular 正在被逐步淘汰的方面。它们在 v15 中仍然可用，但正如 Angular 的[弃用实践](/guide/releases#deprecation-practices)所描述的，它们可以在未来的版本中删除。

To maintain the reliability of your Angular application, review these notes and update your application as soon as practicable.

为了保持 Angular 应用程序的可靠性，请查看这些说明并尽快更新你的应用程序。

| Removed | Replacement | Details |
| :------ | :---------- | :------ |
| 已移除 | 替代品 | 详情 |
| <a id="v15-dp-01"></a>[`DATE_PIPE_DEFAULT_TIMEZONE`](api/common/DATE_PIPE_DEFAULT_TIMEZONE) | [`DATE_PIPE_DEFAULT_OPTIONS`](api/common/DATE_PIPE_DEFAULT_OPTIONS) | The `timezone` field in `DATE_PIPE_DEFAULT_OPTIONS` defines the time zone.<br>[PR #43611](https://github.com/angular/angular/pull/43611) |
| <a id="v15-dp-01"></a>[`DATE_PIPE_DEFAULT_TIMEZONE`](api/common/DATE_PIPE_DEFAULT_TIMEZONE) | [`DATE_PIPE_DEFAULT_OPTIONS`](api/common/DATE_PIPE_DEFAULT_OPTIONS) | `DATE_PIPE_DEFAULT_OPTIONS` 中的 `timezone` 字段定义了时区。<br>[PR #43611](https://github.com/angular/angular/pull/43611) |
| <a id="v15-dp-02"></a>[`Injector.get()`](api/core/Injector#get) with the `InjectFlags` parameter | [`Injector.get()`](api/core/Injector#get) with the `InjectOptions` object | [PR #41592](https://github.com/angular/angular/pull/41592) |
| <a id="v15-dp-02"></a>带有 `InjectFlags` 参数的 [`Injector.get()`](api/core/Injector#get) | [`Injector.get()`](api/core/Injector#get) 与 `InjectOptions` 对象 | [PR #41592](https://github.com/angular/angular/pull/41592) |
| <a id="v15-dp-03"></a>[`TestBed.inject()`](api/core/testing/TestBed#inject) with the `InjectFlags` parameter | [`TestBed.inject()`](api/core/testing/TestBed#inject) with the `InjectOptions` object. | [PR #46761](https://github.com/angular/angular/pull/46761) |
| <a id="v15-dp-03"></a>[`TestBed.inject()`](api/core/testing/TestBed#inject) 与 `InjectFlags` 参数 | [`TestBed.inject()`](api/core/testing/TestBed#inject) 与 `InjectOptions` 对象。 | [PR #46761](https://github.com/angular/angular/pull/46761) |
| <a id="v15-dp-04"></a>`providedIn: NgModule` for [`@Injectable`](api/core/Injectable) and [`InjectionToken`](api/core/InjectionToken)<br><a id="v15-dp-05"></a>`providedIn: 'any'` for an `@Injectable` or `InjectionToken` | See Details | `providedIn: NgModule` was intended to be a tree-shakable alternative to `NgModule` providers. It does not have wide usage and is often used incorrectly in cases where `providedIn: 'root'` would be preferred. If providers must be scoped to a specific [`NgModule`](api/core/NgModule), use `NgModule.providers` instead. [PR #47616](https://github.com/angular/angular/pull/47616) |
| <a id="v15-dp-04"></a>`providedIn: NgModule` 用于 [`@Injectable`](api/core/Injectable) 和 [`InjectionToken`](api/core/InjectionToken) 的 NgModule<br><a id="v15-dp-05"></a>providerIn `providedIn: 'any'` 对于 `@Injectable` 或 `InjectionToken` | 查看详细信息 | `providedIn: NgModule` 旨在成为 `NgModule` 提供者的可树形抖动替代方案。它没有广泛的用途，并且在首选 `providedIn: 'root'` 的情况下经常被错误地使用。如果提供者必须限定为特定的[`NgModule`](api/core/NgModule) ，请改用 `NgModule.providers` 。[PR #47616](https://github.com/angular/angular/pull/47616) |
| <a id="v15-dp-06"></a>[`RouterLinkWithHref`](api/router/RouterLinkWithHref) directive | [`RouterLink`](api/router/RouterLink) directive | The `RouterLink` directive contains the code from the `RouterLinkWithHref` directive to handle elements with `href` attributes. [PR #47630](https://github.com/angular/angular/pull/47630), [PR #47599](https://github.com/angular/angular/pull/47599) |
| <a id="v15-dp-06"></a>[`RouterLinkWithHref`](api/router/RouterLinkWithHref) 指令 | [`RouterLink`](api/router/RouterLink) 指令 | `RouterLink` 指令包含 `RouterLinkWithHref` 指令中的代码，用于处理具有 `href` 属性的元素。[PR #47630](https://github.com/angular/angular/pull/47630) ，[PR #47599](https://github.com/angular/angular/pull/47599) |

For information about deprecations in Material components v15, see [Migrating to MDC-based Angular Material Components](https://material.angular.io/guide/mdc-migration).

有关 Material 组件 v15 中弃用的信息，请参阅[迁移到基于 MDC 的 Angular Material 组件](https://material.angular.io/guide/mdc-migration)。

@reviewed 2022-11-15
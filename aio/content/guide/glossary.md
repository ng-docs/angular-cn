# Glossary

# Angular 词汇表

Angular has its own vocabulary.
Most Angular terms are common English words or computing terms that have a specific meaning within the Angular system.

Angular 有自己的词汇表。
虽然大多数 Angular 短语都是日常用语或计算机术语，但是在 Angular 体系中，它们有特别的含义。

This glossary lists the most prominent terms and a few less familiar ones with unusual or unexpected definitions.

本词汇表列出了常用术语和少量具有反常或意外含义的不常用术语。

[A][AioGuideGlossaryA]
[B][AioGuideGlossaryB]
[C][AioGuideGlossaryC]
[D][AioGuideGlossaryD]
[E][AioGuideGlossaryE]
[F][AioGuideGlossaryF]
[G][AioGuideGlossaryG]
[H][AioGuideGlossaryH]
[I][AioGuideGlossaryI]
[J][AioGuideGlossaryJ]
[K][AioGuideGlossaryK]
[L][AioGuideGlossaryL]
[M][AioGuideGlossaryM]
[N][AioGuideGlossaryN]
[O][AioGuideGlossaryO]
[P][AioGuideGlossaryP]
[Q][AioGuideGlossaryQ]
[R][AioGuideGlossaryR]
[S][AioGuideGlossaryS]
[T][AioGuideGlossaryT]
[U][AioGuideGlossaryU]
[V][AioGuideGlossaryV]
[W][AioGuideGlossaryW]
[X][AioGuideGlossaryX]
[Y][AioGuideGlossaryY]
[Z][AioGuideGlossaryZ]

<a id="aot"></a>

## ahead-of-time (AOT) compilation

## 预先 (ahead-of-time, AOT) 编译

The Angular ahead-of-time (AOT) compiler converts Angular HTML and TypeScript code into efficient JavaScript code during the build phase, before the browser downloads and runs that code.
This is the best compilation mode for production environments, with decreased load time and increased performance compared to [just-in-time (JIT) compilation][AioGuideGlossaryJustInTimeJitCompilation].

Angular 的预先（AOT）编译器可以在编译期间把 Angular 的 HTML 代码和 TypeScript 代码转换成高效的 JavaScript 代码，这样浏览器就可以直接下载并运行它们。
对于产品环境，这是最好的编译模式，相对于[即时 (JIT) 编译][AioGuideGlossaryJustInTimeJitCompilation].而言，它能减小加载时间，并提高性能。

By compiling your application using the `ngc` command-line tool, you can bootstrap directly to a module factory, so you do not need to include the Angular compiler in your JavaScript bundle.

使用命令行工具 `ngc` 来编译你的应用之后，就可以直接启动一个模块工厂，这意味着你不必再在 JavaScript 打包文件中包含 Angular 编译器。

## Angular element

## Angular 元素（element）

An Angular [component][AioGuideGlossaryComponent] packaged as a [custom element][AioGuideGlossaryCustomElement].

被包装成[自定义元素][AioGuideGlossaryComponent]的 Angular [组件][AioGuideGlossaryCustomElement]。

Learn more in [Angular Elements Overview][AioGuideElements].

在 [Angular 元素概览][AioGuideElements]中了解更多信息。

## Angular package format (APF)

## Angular 包格式 (APF)

An Angular specific specification for layout of npm packages that is used by all first-party Angular packages, and most third-party Angular libraries.

所有第一方 Angular 包和大多数第三方 Angular 库都在使用的 npm 包布局的 Angular 专有规范。

Learn more in the [Angular Package Format specification][AioGuideAngularPackageFormat].

在 [Angular 包格式规范][AioGuideAngularPackageFormat]中了解更多信息。

## annotation

## 注解（Annotation）

A structure that provides metadata for a class.
To learn more, see [decorator][AioGuideGlossaryDecoratorDecoration].

为类提供元数据的结构。欲知详情，参阅[装饰器][AioGuideGlossaryDecoratorDecoration]。

## app-shell

## 应用外壳（app-shell）

App shell is a way to render a portion of your application using a route at build time.
This gives users a meaningful first paint of your application that appears quickly because the browser can render static HTML and CSS without the need to initialize JavaScript.
To learn more, see [The App Shell Model][GoogleDevelopersWebFundamentalsArchitectureAppShell].

应用外壳是一种在构建期间通过路由为应用渲染出部分内容的方式。
这样就能为用户快速渲染出一个有意义的首屏页面，因为浏览器可以在初始化脚本之前渲染出静态的 HTML 和 CSS。
欲知详情，参阅[应用外壳模型][GoogleDevelopersWebFundamentalsArchitectureAppShell]。

You can use the Angular CLI to [generate][AioCliGenerateAppShell] an app shell.
This can improve the user experience by quickly launching a static rendered page while the browser downloads the full client version and switches to it automatically after the code loads.
A static rendered page is a skeleton common to all pages.
To learn more, see [Service Worker and PWA][AioGuideServiceWorkerIntro].

你可以使用 Angular CLI 来[生成][AioCliGenerateAppShell]一个应用外壳。
它可以在浏览器下载完整版应用之前，先快速启动一个静态渲染页面（所有页面的公共骨架）来增强用户体验，等代码加载完毕后再自动切换到完整版。
这个静态渲染的页面是所有页面的公共骨架。
欲知详情，参见 [Service Worker 与 PWA][AioGuideServiceWorkerIntro]。

## Architect

## 建筑师（Architect）

The tool that the Angular CLI uses to perform complex tasks such as compilation and test running, according to a provided configuration.
Architect is a shell that runs a [builder][AioGuideGlossaryBuilder] with a given [target configuration][AioGuideGlossaryTarget].
The [builder][AioGuideGlossaryBuilder] is defined in an [npm package][AioGuideGlossaryNpmPackage].

CLI 用来根据所提供的配置执行复杂任务（比如编译和执行测试）的工具。
建筑师是一个外壳，它用来对一个指定的[目标配置][AioGuideGlossaryTarget]来执行一个[构建器（builder）][AioGuideGlossaryBuilder] (定义在一个 [npm 包][AioGuideGlossaryNpmPackage]中)。
[构建器][AioGuideGlossaryBuilder]在 [npm 包][AioGuideGlossaryNpmPackage]中定义。

In the [workspace configuration file][AioGuideWorkspaceConfigProjectToolConfigurationOptions], an "architect" section provides configuration options for Architect builders.

在[工作区配置文件][AioGuideWorkspaceConfigProjectToolConfigurationOptions]中，"architect" 区可以为建筑师的各个构建器提供配置项。

For example, a built-in builder for linting is defined in the package `@angular-devkit/build_angular:tslint`, which uses the [TSLint][GithubPalantirTslint] tool to perform linting, with a configuration specified in a `tslint.json` file.

比如，内置的 linting 构建器定义在 `@angular-devkit/build_angular:tslint` 包中，它使用 [TSLint][GithubPalantirTslint] 工具来执行 linting 操作，其配置是在 `tslint.json` 文件中指定的。

Use the [`ng run`][AioCliRun] Angular CLI command to invoke a builder by specifying a [target configuration][AioGuideGlossaryTarget] associated with that builder.
Integrators can add builders to enable tools and workflows to run through the Angular CLI.
For example, a custom builder can replace the third-party tools used by the built-in implementations for Angular CLI commands, such as `ng build` or `ng test`.

使用 [CLI 命令 `ng run`][AioCliRun]可以通过指定与某个构建器相关联的[目标配置][AioGuideGlossaryTarget]来调用此构建器。
整合器（Integrator）可以添加一些构建器来启用某些工具和工作流，以便通过 Angular CLI 来运行它。比如，自定义构建器可以把 CLI 命令（如 `ng build` 或 `ng test`）的内置实现替换为第三方工具。

## attribute directive

## 属性型指令（attribute directive）

A category of [directive][AioGuideGlossaryDirective] that can listen to and modify the behavior of other HTML elements, attributes, properties, and components.
They are usually represented as HTML attributes, hence the name.

[指令 (directive)][AioGuideGlossaryDirective]的一种。可以监听或修改其它 HTML 元素、特性 (attribute)、属性 (property)、组件的行为。通常用作 HTML 属性，就像它的名字所暗示的那样。

Learn more in [Attribute Directives][AioGuideAttributeDirectives].

要了解更多，参阅[*属性型指令*][AioGuideAttributeDirectives]。

## binding

## 绑定 (binding)

Generally, the practice of setting a variable or property to a data value.
Within Angular, typically refers to [data binding][AioGuideGlossaryDataBinding], which coordinates DOM object properties with data object properties.

广义上是指把变量或属性设置为某个数据值的一种实践。
在 Angular 中，一般是指[数据绑定][AioGuideGlossaryDataBinding]，它会根据数据对象属性的值来设置 DOM 对象的属性。

Sometimes refers to a [dependency-injection][AioGuideGlossaryDependencyInjectionDi] binding between a [token][AioGuideGlossaryToken] and a dependency [provider][AioGuideGlossaryProvider].

有时也会指在“[令牌（Token）][AioGuideGlossaryToken]”和依赖[提供者（Provider）][AioGuideGlossaryProvider]
之间的[依赖注入][AioGuideGlossaryDependencyInjectionDi] 绑定。

## bootstrap

## 引导（bootstrap）

A way to initialize and launch an application or system.

一种用来初始化和启动应用或系统的途径。

In Angular, the `AppModule` root NgModule of an application has a `bootstrap` property that identifies the top-level [components][AioGuideGlossaryComponent] of the application.
During the bootstrap process, Angular creates and inserts these components into the `index.html` host web page.
You can bootstrap multiple applications in the same `index.html`.
Each application contains its own components.

在 Angular 中，应用的根模块（`AppModule`）有一个 `bootstrap` 属性，用于指出该应用的的顶层[组件][AioGuideGlossaryComponent]。
在引导期间，Angular 会创建这些组件，并插入到宿主页面 `index.html` 中。
你可以在同一个 `index.html` 中引导多个应用，每个应用都有一些自己的组件。

Learn more in [Bootstrapping][AioGuideBootstrapping].

要了解更多，参阅[引导启动][AioGuideBootstrapping]一章。

## builder

## 构建器（Builder）

A function that uses the [Architect][AioGuideGlossaryArchitect] API to perform a complex process such as "build" or "test".
The builder code is defined in an [npm package][AioGuideGlossaryNpmPackage].

一个函数，它使用 [Architect][AioGuideGlossaryArchitect] API 来执行复杂的过程，比如构建或测试。
构建器的代码定义在一个 [npm 包][AioGuideGlossaryNpmPackage]中。

For example, [BrowserBuilder][GithubAngularAngularCliTreePrimaryPackagesAngularDevkitBuildAngularSrcBuildersBrowser] runs a [webpack][JsWebpackMain] build for a browser target and [KarmaBuilder][GithubAngularAngularCliTreePrimaryPackagesAngularDevkitBuildAngularSrcBuildersKarma] starts the Karma server and runs a webpack build for unit tests.

比如，[BrowserBuilder][GithubAngularAngularCliTreePrimaryPackagesAngularDevkitBuildAngularSrcBuildersBrowser] 针对某个浏览器目标运行 [webpack][JsWebpackMain] 构建，而 [KarmaBuilder][GithubAngularAngularCliTreePrimaryPackagesAngularDevkitBuildAngularSrcBuildersKarma] 则启动 Karma 服务器，并且针对单元测试运行 webpack 构建。

The [`ng run`][AioCliRun] Angular CLI command invokes a builder with a specific [target configuration][AioGuideGlossaryTarget].
The [workspace configuration][AioGuideWorkspaceConfig] file, `angular.json`, contains default configurations for built-in builders.

[CLI 命令 `ng run`][AioCliRun] 使用一个特定的[目标配置][AioGuideGlossaryTarget]来调用构建器。
[工作区配置][AioGuideWorkspaceConfig]文件 `angular.json` 中包含这些内置构建器的默认配置。

<a id ="camelcase"></a>

<a id="case-conventions"></a>
<a id="dash-case"></a>

## case types

## 大小写类型（case types）

Angular uses capitalization conventions to distinguish the names of various types, as described in the [naming guidelines section][AioGuideStyleguide0201] of the Style Guide.
Here is a summary of the case types:

Angular 使用大小写约定来区分多种名字，详见[风格指南中的 "命名" 一节][AioGuideStyleguide0201]。下面是这些大小写类型的汇总表：

|  | Details | example |
| :-- | :------ | :------ |
|  | 详细信息 | 例子 |
| camelCase | Symbols, properties, methods, pipe names, non-component directive selectors, constants. <br /> Standard or lower camel case uses lowercase on the first letter of the item. | `selectedHero` |
| 小驼峰形式（camelCase） | 符号、属性、方法、管道名称、非组件指令选择器、常量。<br />标准或小驼峰形式在每个单词的第一个字母上使用小写。 | `selectedHero` |
| UpperCamelCase <br /> PascalCase | Class names, including classes that define components, interfaces, NgModules, directives, and pipes. <br /> Upper camel case uses uppercase on the first letter of the item. | `HeroListComponent` |
| 大驼峰形式<br />Pascal 形式 | 类名，包括定义组件、接口、NgModules、指令和管道的类。<br />大驼峰形式在每个单词的第一个字母上使用大写。 | `HeroListComponent` |
| dash-case <br /> kebab-case | Descriptive part of file names, component selectors. | `app-hero-list` |
| 中线形式（dash-case）<br />烤串形式（kebab-case） | 文件名中的描述部分，组件的选择器。 | `app-hero-list` |
| underscore_case <br /> snake_case | Not typically used in Angular. <br /> Snake case uses words connected with underscores. | `convert_link_mode` |
| 下划线形式（underscore_case）<br />蛇形形式（snake_case） | 通常不在 Angular 中使用。<br />蛇形形式使用下划线连接各个单词。 | `convert_link_mode` |
| UPPER_UNDERSCORE_CASE <br /> UPPER_SNAKE_CASE <br /> SCREAMING_SNAKE_CASE | Traditional for constants. <br /> This case is acceptable, but camelCase is preferred. <br /> Upper snake case uses words in all capital letters connected with underscores. | `FIX_ME` |
| 大写下划线形式（UPPER_UNDERSCORE_CASE）<br />大写蛇形形式（UPPER_SNAKE_CASE）<br /> 尖叫蛇形形式（SCREAMING_SNAKE_CASE） | 传统的常量写法（可以接受，但更推荐用小驼峰形式（camelCase））<br />大蛇形形式使用下划线分隔的全大写单词。 | `FIX_ME` |

## change detection

## 变更检测（change detection）

The mechanism by which the Angular framework synchronizes the state of the UI of an application with the state of the data.
The change detector checks the current state of the data model whenever it runs, and maintains it as the previous state to compare on the next iteration.

Angular 框架会通过此机制将应用程序 UI 的状态与数据的状态同步。变更检测器在运行时会检查数据模型的当前状态，并在下一轮迭代时将其和先前保存的状态进行比较。

As the application logic updates component data, values that are bound to DOM properties in the view can change.
The change detector is responsible for updating the view to reflect the current data model.
Similarly, the user can interact with the UI, causing events that change the state of the data model.
These events can trigger change detection.

当应用逻辑更改组件数据时，绑定到视图中 DOM 属性上的值也要随之更改。变更检测器负责更新视图以反映当前的数据模型。类似地，用户也可以与 UI 进行交互，从而引发要更改数据模型状态的事件。这些事件可以触发变更检测。

Using the default change-detection strategy, the change detector goes through the [view hierarchy][AioGuideGlossaryViewHierarchy] on each VM turn to check every [data-bound property][AioGuideGlossaryDataBinding] in the template.
In the first phase, it compares the current state of the dependent data with the previous state, and collects changes.
In the second phase, it updates the page DOM to reflect any new data values.

使用默认的变更检测策略，变更检测器将遍历每个视图模型上的[视图层次结构][AioGuideGlossaryViewHierarchy]，以检查模板中的每个[数据绑定属性][AioGuideGlossaryDataBinding]。在第一阶段，它将所依赖的数据的当前状态与先前状态进行比较，并收集更改。在第二阶段，它将更新页面上的 DOM 以反映出所有新的数据值。

If you set the `OnPush` change-detection strategy, the change detector runs only when [explicitly invoked][AioApiCoreChangedetectorref], or when it is triggered by an `Input` reference change or event handler.
This typically improves performance.
To learn more, see [Optimize the change detection in Angular][WebDevFasterAngularChangeDetection].

如果设置了 `OnPush` 变更检测策略，则变更检测器仅在[显式调用][AioApiCoreChangedetectorref]它或由 `@Input` 引用的变化或触发事件处理程序时运行。这通常可以提高性能。欲知详情，参阅[优化 Angular 的变更检测][WebDevFasterAngularChangeDetection]。

<a id="decorator"></a>

## class decorator

## 类装饰器（class decorator）

A [decorator][AioGuideGlossaryDecoratorDecoration] that appears immediately before a class definition, which declares the class to be of the given type, and provides metadata suitable to the type.

[装饰器][AioGuideGlossaryDecoratorDecoration]会出现在类定义的紧前方，用来声明该类具有指定的类型，并且提供适合该类型的元数据。

The following decorators can declare Angular class types.

可以用下列装饰器来声明 Angular 的类：

* `@Component()`

* `@Directive()`

* `@Pipe()`

* `@Injectable()`

* `@NgModule()`

## class field decorator

## 类字段装饰器（class field decorator）

A [decorator][AioGuideGlossaryDecoratorDecoration] statement immediately before a field in a class definition that declares the type of that field.
Some examples are `@Input` and `@Output`.

出现在类定义中属性紧前方的[装饰器][AioGuideGlossaryDecoratorDecoration]语句用来声明该字段的类型。比如 `@Input` 和 `@Output`。

## collection

## 集合（collection）

In Angular, a set of related [schematics][AioGuideGlossarySchematic] collected in an [npm package][AioGuideGlossaryNpmPackage].

在 Angular 中，是指收录在同一个 [npm 包][AioGuideGlossaryNpmPackage] 中的[一组原理图（schematics）][AioGuideGlossarySchematic]。

<a id="cli"></a>

## command-line interface (CLI)

## 命令行界面（CLI）

The [Angular CLI][AioCliMain] is a command-line tool for managing the Angular development cycle.
Use it to create the initial filesystem scaffolding for a [workspace][AioGuideGlossaryWorkspace] or [project][AioGuideGlossaryProject], and to run [schematics][AioGuideGlossarySchematic] that add and modify code for initial generic versions of various elements.
The Angular CLI supports all stages of the development cycle, including building, testing, bundling, and deployment.

[Angular CLI][AioCliMain] 是一个命令行工具，用于管理 Angular 的开发周期。它用于为[工作区][AioGuideGlossaryWorkspace]或[项目][AioGuideGlossaryProject]创建初始的脚手架，并且运行[生成器（schematics）][AioGuideGlossarySchematic]来为初始生成的版本添加或修改各类代码。
CLI 支持开发周期中的所有阶段，比如构建、测试、打包和部署。

* To begin using the Angular CLI for a new project, see [Local Environment Setup][AioGuideSetupLocal].

  要开始使用 CLI 来创建新项目，参阅[建立本地开发环境][AioGuideSetupLocal]。

* To learn more about the full capabilities of the Angular CLI, see the [Angular CLI command reference][AioCliMain].

  要了解 CLI 的全部功能，参阅 [CLI 命令参考手册][AioCliMain]。

See also [Schematics CLI][AioGuideGlossarySchematicsCli].

参阅[Schematics CLI][AioGuideGlossarySchematicsCli]。

## component

## 组件 (component)

A class with the `@Component()` [decorator][AioGuideGlossaryDecoratorDecoration] that associates it with a companion [template][AioGuideGlossaryTemplate].
Together, the component class and template define a [view][AioGuideGlossaryView].
A component is a special type of [directive][AioGuideGlossaryDirective].
The `@Component()` decorator extends the `@Directive()` decorator with template-oriented features.

一个带有 `@Component()` [装饰器][AioGuideGlossaryDecoratorDecoration]的类，和它的伴生[模板][AioGuideGlossaryTemplate]关联在一起。组件类及其模板共同定义了一个[视图][AioGuideGlossaryView]。
组件是[指令][AioGuideGlossaryDirective]的一种特例。`@Component()` 装饰器扩展了 `@Directive()` 装饰器，增加了一些与模板有关的特性。

An Angular component class is responsible for exposing data and handling most of the display and user-interaction logic of the view through [data binding][AioGuideGlossaryDataBinding].

Angular 的组件类负责暴露数据，并通过[数据绑定机制][AioGuideGlossaryDataBinding]来处理绝大多数视图的显示和用户交互逻辑。

Read more about component classes, templates, and views in [Introduction to Angular concepts][AioGuideArchitecture].

要了解更多关于组件类、模板和视图的知识，参阅 [架构概览][AioGuideArchitecture] 一章。

## configuration

## 配置（configuration）

See [workspace configuration][AioGuideGlossaryWorkspaceConfig]

参阅[工作区配置][AioGuideGlossaryWorkspaceConfig]

## content projection

## 内容投影（content projection）

A way to insert DOM content from outside a component into the view of the component in a designated spot.

一种从组件外把 DOM 内容插入到当前组件视图的特定位置上的方式。

To learn more, see [Responding to changes in content][AioGuideLifecycleHooksRespondingToProjectedContentChanges].

欲知详情，参阅[内容变化的应对方式][AioGuideLifecycleHooksRespondingToProjectedContentChanges]。

## custom element

## 自定义元素（Custom element）

A web platform feature, currently supported by most browsers and available in other browsers through polyfills.
See [Browser support][AioGuideBrowserSupport].

一种 Web 平台的特性，目前已经被绝大多数浏览器支持，在其它浏览器中也可以通过腻子脚本获得支持（参阅[浏览器支持][AioGuideBrowserSupport]）。

The custom element feature extends HTML by allowing you to define a tag whose content is created and controlled by JavaScript code.
A custom element is recognized by a browser when it is added to the [CustomElementRegistry][MdnDocsWebApiCustomelementregistry].
A custom element is also referenced as a *web component*.

这种自定义元素特性通过允许你定义标签（其内容是由 JavaScript 代码来创建和控制的）来扩展 HTML。当自定义元素被添加到 [CustomElementRegistry][MdnDocsWebApiCustomelementregistry] 之后就会被浏览器识别。
自定义元素也叫 *Web Component*。

You can use the API to transform an Angular component so that it can be registered with the browser and used in any HTML that you add directly to the DOM within an Angular application.
The custom element tag inserts the view of the component, with change-detection and data-binding functionality, into content that would otherwise be displayed without Angular processing.
See [Angular element][AioGuideGlossaryAngularElement].
See also [dynamic component loading][AioGuideGlossaryDynamicComponentLoading].

你可以使用 API 来转换 Angular 组件，以便它能够注册进浏览器中，并且可以用在你往 DOM 中添加的任意 HTML 中。
自定义元素标签可以把组件的视图（包括变更检测和数据绑定功能）插入到不受 Angular 控制的内容中。
参见 [Angular 元素][AioGuideGlossaryAngularElement]。
另见[动态组件加载][AioGuideGlossaryDynamicComponentLoading]。

## data binding

## 数据绑定（data binding）

A process that allows applications to display data values to a user and respond to user actions.
User actions include clicks, touches, keystrokes, and so on.

这个过程可以让应用程序将数据展示给用户，并对用户的操作（点击、触屏、按键）做出回应。

In data binding, you declare the relationship between an HTML widget and a data source and let the framework handle the details.
Data binding is an alternative to manually pushing application data values into HTML, attaching event listeners, pulling changed values from the screen, and updating application data values.

在数据绑定机制下，你只要声明一下 HTML 部件和数据源之间的关系，把细节交给框架去处理。
而以前的手动操作过程是：将数据推送到 HTML 页面中、添加事件监听器、从屏幕获取变化后的数据，并更新应用中的值。

Read about the following forms of binding of the [Template Syntax][AioGuideTemplateSyntax] in Angular:

更多的绑定形式，见[模板语法][AioGuideTemplateSyntax]：

* [Interpolation][AioGuideInterpolation]

  [插值][AioGuideInterpolation]

* [Property binding][AioGuidePropertyBinding]

  [property 绑定][AioGuidePropertyBinding]

* [Event binding][AioGuideEventBinding]

  [事件绑定][AioGuideEventBinding]

* [Attribute binding][AioGuideAttributeBinding]

  [attribute 绑定][AioGuideAttributeBinding]

* [Class and style binding][AioGuideAttributeBindingBindingToTheClassAttribute]

  [CSS 类绑定与样式绑定][AioGuideAttributeBindingBindingToTheClassAttribute]

* [Two-way data binding with ngModel][AioGuideBuiltInDirectivesDisplayingAndUpdatingPropertiesWithNgmodel]

  [基于 ngModel 的双向数据绑定][AioGuideBuiltInDirectivesDisplayingAndUpdatingPropertiesWithNgmodel]

## declarable

## 可声明对象（declarable）

A class type that you can add to the `declarations` list of an [NgModule][AioGuideGlossaryNgmodule].
You can declare [components][AioGuideGlossaryComponent], [directives][AioGuideGlossaryDirective], and [pipes][AioGuideGlossaryPipe].

类的一种类型，你可以把它们添加到 [NgModule][AioGuideGlossaryNgmodule] 的 `declarations` 列表中。
你可以声明[组件][AioGuideGlossaryComponent]、[指令][AioGuideGlossaryDirective]和[管道][AioGuideGlossaryPipe]。

Do not declare the following:

*不要*声明：

* A class that is already declared in another NgModule

  已经在其它 NgModule 中声明过的类

* An array of directives imported from another package.
  For example, do not declare `FORMS_DIRECTIVES` from `@angular/forms`

  从其它包中导入的指令数组。比如，不要再次声明来自 `@angular/forms` 中的 `FORMS_DIRECTIVES`

* NgModule classes

  NgModule 类

* Service classes

  服务类

* Non-Angular classes and objects, such as strings, numbers, functions, entity models, configurations, business logic, and helper classes

  非 Angular 的类和对象，比如：字符串、数字、函数、实体模型、配置、业务逻辑和辅助类

## decorator | decoration

## 装饰器（decorator | decoration）

A function that modifies a class or property definition.
Decorators are an experimental (stage 3) [JavaScript language feature][GithubTC39ProposalDecorators].
A decorator is also referenced as an *annotation*.
TypeScript adds support for decorators.

一个函数，用来修饰紧随其后的类或属性定义。
装饰器（也叫注解）是一种处于阶段 3（stage 3）的试验性 [JavaScript 语言特性][GithubTC39ProposalDecorators]。

Angular defines decorators that attach metadata to classes or properties so that it knows what those classes or properties mean and how they should work.

Angular 定义了一些装饰器，用来为类或属性附加元数据，来让自己知道那些类或属性的含义，以及该如何处理它们。

To learn more, see [class decorator][AioGuideGlossaryClassDecorator].
See also [class field decorator][AioGuideGlossaryClassFieldDecorator].

欲知详情，参阅 [类装饰器][AioGuideGlossaryClassDecorator]、[类属性装饰器][AioGuideGlossaryClassFieldDecorator]。

## dependency injection (DI)

## 依赖注入（dependency injection）

A design pattern and mechanism for creating and delivering some parts of an application (dependencies) to other parts of an application that require them.

依赖注入既是设计模式，同时又是一种机制：当应用程序的一些部件（即一些依赖）需要另一些部件时，
利用依赖注入来创建被请求的部件，并将它们注入到需要它们的部件中。

In Angular, dependencies are typically services, but they also can be values, such as strings or functions.
An [injector][AioGuideGlossaryInjector] for an application (created automatically during bootstrap) instantiates dependencies when needed, using a configured [provider][AioGuideGlossaryProvider] of the service or value.
Learn more in [Dependency Injection in Angular][AioGuideDependencyInjection].

在 Angular 中，依赖通常是服务，但是也可以是值，比如字符串或函数。应用的[注入器][AioGuideGlossaryInjector]（它是在启动期间自动创建的）会使用该服务或值的配置好的[提供者][AioGuideGlossaryProvider]来按需实例化这些依赖。各个不同的提供者可以为同一个服务提供不同的实现。

## DI token

## DI 令牌（token）

A lookup token associated with a dependency [provider][AioGuideGlossaryProvider], for use with the [dependency injection][AioGuideGlossaryDependencyInjectionDi] system.

一种用来查阅的令牌，它关联到一个依赖[提供者][AioGuideGlossaryProvider]，用于[依赖注入][AioGuideGlossaryDependencyInjectionDi]系统中。

## directive

## 指令（directive）

A class that can modify the structure of the DOM or modify attributes in the DOM and component data model.
A directive class definition is immediately preceded by a `@Directive()` [decorator][AioGuideGlossaryDecoratorDecoration] that supplies metadata.

一个可以修改 DOM 结构或修改 DOM 和组件数据模型中某些属性的类。
指令类的定义紧跟在 `@Directive()` [装饰器][AioGuideGlossaryDecoratorDecoration]之后，以提供元数据。

A directive class is usually associated with an HTML element or attribute, and that element or attribute is often referred to as the directive itself.
When Angular finds a directive in an HTML [template][AioGuideGlossaryTemplate], it creates the matching directive class instance and gives the instance control over that portion of the browser DOM.

指令类几乎总与 HTML 元素或属性 (attribute) 相关。
通常会把这些 HTML 元素或者属性 (attribute) 当做指令本身。
当 Angular 在 HTML [模板中][AioGuideGlossaryTemplate]发现某个指令时，会创建与之相匹配的指令类的实例，并且把这部分 DOM 的控制权交给它。

There are three categories of directive:

指令分为三类：

* [Components][AioGuideGlossaryComponent] use `@Component()` to associate a template with a class.
  `@Component()` is an extension of `@Directive()`.

  [组件][AioGuideGlossaryComponent]使用 `@Component()` 为某个类关联一个模板。
  `@Component()` 是对 `@Directive()` 的扩展。

* [Attribute directives][AioGuideGlossaryAttributeDirective] modify behavior and appearance of page elements.

  [属性型指令][AioGuideGlossaryAttributeDirective]修改页面元素的行为和外观。

* [Structural directives][AioGuideGlossaryStructuralDirective] modify the structure of the DOM.

  [结构型指令][AioGuideGlossaryStructuralDirective]修改 DOM 的结构。

Angular supplies a number of built-in directives that begin with the `ng` prefix.
You can also create new directives to implement your own functionality.
You associate a *selector* with a custom directive; this extends the [template syntax][AioGuideTemplateSyntax] that you can use in your applications.
A *selector* is an HTML tag, such as `<my-directive>`.

Angular 提供了一些以 `ng` 为前缀的内置指令。你也可以创建新的指令来实现自己的功能。
你可以为自定义指令关联一个*选择器*，以扩展[模板语法][AioGuideTemplateSyntax]，从而让你能在应用中使用它。
*选择器*是一个 HTML 标签，比如 `<my-directive>`。

**UpperCamelCase**, such as `NgIf`, refers to a directive class.
You can use **UpperCamelCase** when describing properties and directive behavior.

**UpperCamelCase**（比如 `NgIf`）用于引用指令类。在描述属性和指令行为时，使用 **UpperCamelCase**。

**lowerCamelCase**, such as `ngIf` refers to the attribute name of a directive.
You can use **lowerCamelCase** when describing how to apply the directive to an element in the HTML template.

**lowerCamelCase**（比如 `ngIf`）用于引用指令的属性名。在描述如何将指令应用于 HTML 模板中的元素时，使用 **lowerCamelCase**。

## domain-specific language (DSL)

## 领域特定语言（DSL)

A special-purpose library or API.
To learn more, see [Domain-specific language][WikipediaWikiDomainSpecificLanguage].
Angular extends TypeScript with domain-specific languages for a number of domains relevant to Angular applications, defined in NgModules such as [animations][AioGuideAnimations], [forms][AioGuideForms], and [routing and navigation][AioGuideRouter].

一种特殊用途的库或 API。欲知详情，参阅[领域特定语言][WikipediaWikiDomainSpecificLanguage]词条。
Angular 使用领域特定语言扩展了 TypeScript，用于与 Angular 应用相关的许多领域。这些 DSL 都定义在 NgModule 中，比如 [动画][AioGuideAnimations]、[表单][AioGuideForms]和[路由与导航][AioGuideRouter]

## dynamic component loading

## 动态组件加载（dynamic component loading）

A technique for adding a component to the DOM at run time.
Requires that you exclude the component from compilation and then connect it to the change-detection and event-handling framework of Angular when you add it to the DOM.

一种在运行期间把组件添加到 DOM 中的技术，它需要你从编译期间排除该组件，然后，当你把它添加到 DOM 中时，再把它接入 Angular 的变更检测与事件处理框架。

See also [custom element][AioGuideGlossaryCustomElement], which provides an easier path with the same result.

参阅[自定义元素][AioGuideGlossaryCustomElement]，它提供了一种更简单的方式来达到相同的效果。

## eager loading

## 急性加载（Eager Loading）

NgModules or components that are loaded on launch are referenced as eager-loaded, to distinguish them from those that are loaded at run time that are referenced as lazy-loaded.
See also [lazy loading][AioGuideGlossaryLazyLoading].

在启动时加载的 NgModule 和组件称为急性加载，与之相对的是那些在运行期间才加载的方式称为惰性加载。
参阅[惰性加载][AioGuideGlossaryLazyLoading]。

## ECMAScript

The [official JavaScript language specification][WikipediaWikiEcmascript].

[官方 JavaScript 语言规范][WikipediaWikiEcmascript]。

Not all browsers support the latest ECMAScript standard, but you can use a [transpiler][AioGuideGlossaryTranspile] to write code using the latest features, which will then be transpiled to code that runs on versions that are supported by browsers.
A example of a [transpiler][AioGuideGlossaryTranspile] is [TypeScript][AioGuideGlossaryTypescript].
To learn more, see [Browser Support][AioGuideBrowserSupport].

并不是所有浏览器都支持最新的 ECMAScript 标准，不过你可以使用[转译器][AioGuideGlossaryTranspile]（比如[TypeScript][AioGuideGlossaryTypescript]）来用最新特性写代码，然后它会被转译成可以在浏览器的其它版本上运行的代码。
[转译器][AioGuideGlossaryTranspile]的例子之一就是 [TypeScript][AioGuideGlossaryTypescript]
要了解更多，参阅[浏览器支持][AioGuideBrowserSupport]页。

## element

## 元素（element）

Angular defines an `ElementRef` class to wrap render-specific native UI elements.
In most cases, this allows you to use Angular templates and data binding to access DOM elements without reference to the native element.

Angular 定义了 `ElementRef` 类来包装与渲染有关的原生 UI 元素。这让你可以在大多数情况下使用 Angular 的模板和数据绑定机制来访问 DOM 元素，而不必再引用原生元素。

The documentation generally refers to *elements* as distinct from *DOM elements*.
*Elements* are instances of a `ElementRef` class.
*DOM elements* are able to be accessed directly, if necessary.

本文档中一般会使用*元素（Element）*，以区别于 *DOM 元素*。这里的*元素*指的是 `ElementRef` 类的实例。
如果需要，*DOM 元素*是可以直接访问的。

To learn more, see also [custom element][AioGuideGlossaryCustomElement].

欲知详情，参阅[自定义元素][AioGuideGlossaryCustomElement]。

## entry point

## 入口点（entry point）

A [JavaScript module][AioGuideGlossaryModule] that is intended to be imported by a user of an [npm package][AioGuideNpmPackages].
An entry-point module typically re-exports symbols from other internal modules.
A package can contain multiple entry points.
For example, the `@angular/core` package has two entry-point modules, which can be imported using the module names `@angular/core` and `@angular/core/testing`.

[JavaScript 模块][AioGuideGlossaryModule]的目的是供 [npm 包][AioGuideNpmPackages]的用户进行导入。入口点模块通常会重新导出来自其它内部模块的一些符号。每个包可以包含多个入口点。比如 `@angular/core` 就有两个入口点模块，它们可以使用名字 `@angular/core` 和 `@angular/core/testing` 进行导入。

## form control

## 表单控件（form control）

A instance of `FormControl`, which is a fundamental building block for Angular forms.
Together with `FormGroup` and `FormArray`, tracks the value, validation, and status of a form input element.

一个 `FormControl` 实例，它是 Angular 表单的基本构造块。它会和 `FormGroup` 和 `FormArray` 一起，跟踪表单输入元素的值、有效性和状态。

Read more forms in the [Introduction to forms in Angular][AioGuideFormsOverview].

欲知详情，参阅 [Angular 表单简介][AioGuideFormsOverview]。

## form model

## 表单模型（form model）

The "source of truth" for the value and validation status of a form input element at a given point in time.
When using [reactive forms][AioGuideGlossaryReactiveForms], the form model is created explicitly in the component class.
When using [template-driven forms][AioGuideGlossaryTemplateDrivenForms], the form model is implicitly created by directives.

是指在指定的时间点，表单输入元素的值和验证状态的"事实之源"。当使用[响应式表单][AioGuideGlossaryReactiveForms]时，表单模型会在组件类中显式创建。当使用[模板驱动表单][AioGuideGlossaryTemplateDrivenForms]时，表单模型是由一些指令隐式创建的。

Learn more about reactive and template-driven forms in the [Introduction to forms in Angular][AioGuideFormsOverview].

要深入了解响应式表单和模板驱动表单，参阅 [Angular 表单简介][AioGuideFormsOverview]。

## form validation

## 表单验证（form validation）

A check that runs when form values change and reports whether the given values are correct and complete, according to the defined constraints.
Reactive forms apply [validator functions][AioGuideFormValidationAddingCustomValidatorsToReactiveForms].
Template-driven forms use [validator directives][AioGuideFormValidationAddingCustomValidatorsToTemplateDrivenForms].

一种检查，当表单值发生变化时运行，并根据预定义的约束来汇报指定的这些值是否正确并完全。响应式表单使用[验证器函数][AioGuideFormValidationAddingCustomValidatorsToReactiveForms]，而模板驱动表单则使用[验证器指令][AioGuideFormValidationAddingCustomValidatorsToTemplateDrivenForms]。

To learn more, see [Form Validation][AioGuideFormValidation].

要了解更多，参阅[表单验证器][AioGuideFormValidation]。

## immutability

## 不可变性（immutability）

The inability to alter the state of a value after its creation.
[Reactive forms][AioGuideGlossaryReactiveForms] perform immutable changes in that each change to the data model produces a new data model rather than modifying the existing one.
[Template-driven forms][AioGuideGlossaryTemplateDrivenForms] perform mutable changes with `NgModel` and [two-way data binding][AioGuideGlossaryDataBinding] to modify the existing data model in place.

是否能够在创建之后修改值的状态。[响应式表单][AioGuideGlossaryReactiveForms]会执行不可变性的更改，每次更改数据模型都会生成一个新的数据模型，而不是修改现有的数据模型。
[模板驱动表单][AioGuideGlossaryTemplateDrivenForms]则会执行可变的更改，它通过 `NgModel` 和[双向数据绑定][AioGuideGlossaryDataBinding]来就地修改现有的数据模型。

## injectable

## 可注入对象（injectable）

An Angular class or other definition that provides a dependency using the [dependency injection][AioGuideGlossaryDependencyInjectionDi] mechanism.
An injectable [service][AioGuideGlossaryService] class must be marked by the `@Injectable()` [decorator][AioGuideGlossaryDecoratorDecoration].
Other items, such as constant values, can also be injectable.

Angular 中的类或其它概念使用[依赖注入][AioGuideGlossaryDependencyInjectionDi]机制来提供依赖。
可供注入的[服务][AioGuideGlossaryService]类必须使用 `@Injectable()` [装饰器][AioGuideGlossaryDecoratorDecoration]标出来。其它条目，比如常量值，也可用于注入。

## injector

## 注入器 (injector)

An object in the Angular [dependency-injection][AioGuideGlossaryDependencyInjectionDi] system that can find a named dependency in its cache or create a dependency using a configured [provider][AioGuideGlossaryProvider].
Injectors are created for NgModules automatically as part of the bootstrap process and are inherited through the component hierarchy.

Angular [依赖注入系统][AioGuideGlossaryDependencyInjectionDi]中可以在缓存中根据名字查找依赖，也可以通过配置过的[提供者][AioGuideGlossaryProvider]来创建依赖。
启动过程中会自动为每个模块创建一个注入器，并被组件树继承。

* An injector provides a singleton instance of a dependency, and can inject this same instance in multiple components.

  注入器会提供依赖的一个单例，并把这个单例对象注入到多个组件中。

* A hierarchy of injectors at the NgModule and component level can provide different instances of a dependency to their own components and child components.

  模块和组件级别的注入器树可以为它们拥有的组件及其子组件提供同一个依赖的不同实例。

* You can configure injectors with different providers that can provide different implementations of the same dependency.

  你可以为同一个依赖使用不同的提供者来配置这些注入器，这些提供者可以为同一个依赖提供不同的实现。

Learn more about the injector hierarchy in [Hierarchical Dependency Injectors][AioGuideHierarchicalDependencyInjection].

要了解关于多级注入器的更多知识，参阅[多级依赖注入][AioGuideHierarchicalDependencyInjection]一章。

## input

## 输入属性 (input)

When defining a [directive][AioGuideGlossaryDirective], the `@Input()` decorator on a directive property makes that property available as a *target* of a [property binding][AioGuidePropertyBinding].
Data values flow into an input property from the data source identified in the [template expression][AioGuideGlossaryTemplateExpression] to the right of the equal sign.

当定义[指令][AioGuideGlossaryDirective]时，指令属性上的 `@Input()` 装饰器让该属性可以作为[属性绑定][AioGuidePropertyBinding]的*目标*使用。
数据值会从等号右侧的[模板表达式][AioGuideGlossaryTemplateExpression]所指定的数据源流入组件的输入属性。

To learn more, see [`@Input()` and `@Output()` decorator functions][AioGuideInputsOutputs].

要了解更多，参阅 [`@Input()` 和 `@Output()` 装饰器函数][AioGuideInputsOutputs]。

## interpolation

## 插值（interpolation）

A form of property [data binding][AioGuideGlossaryDataBinding] in which a [template expression][AioGuideGlossaryTemplateExpression] between double-curly braces renders as text.
That text can be concatenated with neighboring text before it is assigned to an element property or displayed between element tags, as in this example.

[属性数据绑定 (property data binding)][AioGuideGlossaryDataBinding] 的一种形式，位于双花括号中的[模板表达式 (template expression)][AioGuideGlossaryTemplateExpression]会被渲染成文本。
在被赋值给元素属性或者显示在元素标签中之前，这些文本可能会先与周边的文本合并，参阅下面的例子。

<code-example format="html" language="html">

&lt;label&gt;My current hero is {{hero.name}}&lt;/label&gt;

</code-example>

Read more in the [Interpolation][AioGuideInterpolation] guide.

在[插值][AioGuideInterpolation]指南中阅读更多内容。

## Ivy

Ivy is the historical code name for the current [compilation and rendering pipeline][AngularBlogAPlanForVersion80AndIvyB3318dfc19f7] in Angular.
It is now the only supported engine, so everything uses Ivy.

Ivy 是 Angular 当前[编译和渲染管道][AngularBlogAPlanForVersion80AndIvyB3318dfc19f7]的历史代号。它现在是唯一受支持的引擎，所以，一切都在使用 Ivy。

## JavaScript

To learn more, see [ECMAScript][AioGuideGlossaryEcmascript].
To learn more, see also [TypeScript][AioGuideGlossaryTypescript].

欲知详情，参阅 [ECMAScript][AioGuideGlossaryEcmascript]。
欲知详情，另见 [TypeScript][AioGuideGlossaryTypescript]。

<a id="jit"></a>

## just-in-time (JIT) compilation

## 即时 (just-in-time, JIT) 编译

The Angular just-in-time (JIT) compiler converts your Angular HTML and TypeScript code into efficient JavaScript code at run time, as part of bootstrapping.

在启动期间，Angular 的即时编译器（JIT)会在运行期间把你的 Angular HTML 和 TypeScript 代码转换成高效的 JavaScript 代码。

JIT compilation is the default (as opposed to AOT compilation) when you run the `ng build` and `ng serve` Angular CLI commands, and is a good choice during development.
JIT mode is strongly discouraged for production use because it results in large application payloads that hinder the bootstrap performance.

当你运行 Angular 的 CLI 命令 `ng build` 和 `ng serve` 时，JIT 编译是默认选项，而且是开发期间的最佳实践。但是强烈建议你不要在生产环境下使用 JIT 模式，因为它会导致巨大的应用负担，从而拖累启动时的性能。

Compare to [ahead-of-time (AOT) compilation][AioGuideGlossaryAheadOfTimeAotCompilation].

与[预先 (AOT) 编译相比][AioGuideGlossaryAheadOfTimeAotCompilation]。

## lazy loading

## 惰性加载（lazy loading）

A process that speeds up application load time by splitting the application into multiple bundles and loading them on demand.
For example, dependencies can be lazy loaded as needed.
The example differs from [eager-loaded][AioGuideGlossaryEagerLoading] modules that are required by the root module and are loaded on launch.

惰性加载过程会把应用拆分成多个包并且按需加载它们，从而提高应用加载速度。
比如，一些依赖可以根据需要进行惰性加载，与之相对的是那些 [急性加载][AioGuideGlossaryEagerLoading] 的模块，它们是根模块所要用的，因此会在启动期间加载。

The [router][AioGuideGlossaryRouter] makes use of lazy loading to load child views only when the parent view is activated.
Similarly, you can build custom elements that can be loaded into an Angular application when needed.

[路由器][AioGuideGlossaryRouter]只有当父视图激活时才需要加载子视图。同样，你还可以构建一些自定义元素，它们也可以在需要时才加载进 Angular 应用。

## library

## 库（library）

In Angular, a [project][AioGuideGlossaryProject] that provides functionality that can be included in other Angular applications.
A library is not a complete Angular application and cannot run independently.

一种 Angular [项目][AioGuideGlossaryProject]。用来让其它 Angular 应用包含它，以提供各种功能。库不是一个完整的 Angular 应用，不能独立运行。

To add re-usable Angular functionality to non-Angular web applications, use Angular [custom elements][AioGuideGlossaryAngularElement].

要想为非 Angular 应用添加可复用的 Angular 功能，你可以使用 Angular 的[自定义元素][AioGuideGlossaryAngularElement]。

* Library developers can use the [Angular CLI][AioGuideGlossaryCommandLineInterfaceCli] to `generate` scaffolding for a new library in an existing [workspace][AioGuideGlossaryWorkspace], and can publish a library as an `npm` package.

  库的开发者可以使用 [CLI][AioGuideGlossaryCommandLineInterfaceCli] 在现有的 [工作区][AioGuideGlossaryWorkspace] 中 `generate` 新库的脚手架，还能把库发布为 `npm` 包。

* Application developers can use the [Angular CLI][AioGuideGlossaryCommandLineInterfaceCli] to `add` a published library for use with an application in the same [workspace][AioGuideGlossaryWorkspace].

  应用开发者可以使用 [CLI][AioGuideGlossaryCommandLineInterfaceCli] 来把一个已发布的库 `add` 进这个应用所在的[工作区][AioGuideGlossaryWorkspace]。

See also [schematic][AioGuideGlossarySchematic].

参阅 [原理图（schematic）][AioGuideGlossarySchematic]。

## lifecycle hook

## 生命周期钩子（lifecycle hook）

An interface that allows you to tap into the lifecycle of [directives][AioGuideGlossaryDirective] and [components][AioGuideGlossaryComponent] as they are created, updated, and destroyed.

一种接口，它允许你监听[指令][AioGuideGlossaryDirective]和[组件][AioGuideGlossaryComponent]的生命周期，比如创建、更新和销毁等。

Each interface has a single hook method whose name is the interface name prefixed with `ng`.
For example, the `OnInit` interface has a hook method named `ngOnInit`.

每个接口只有一个钩子方法，方法名是接口名加前缀 `ng`。比如，`OnInit` 接口的钩子方法名为 `ngOnInit`。

Angular runs these hook methods in the following order:

Angular 会按以下顺序调用钩子方法：

|  | hook method | Details |
| :-- | :---------- | :------ |
|  | 钩子方法 | 详细信息 |
| 1 | `ngOnChanges` | When an [input][AioGuideGlossaryInput] or [output][AioGuideGlossaryOutput] binding value changes. |
| 1 | `ngOnChanges` | 当[输入][AioGuideGlossaryInput]或[输出][AioGuideGlossaryOutput]绑定值更改时。 |
| 2 | `ngOnInit` | After the first `ngOnChanges`. |
| 2 | `ngOnInit` | 在第一个 `ngOnChanges` 之后。 |
| 3 | `ngDoCheck` | Developer's custom change detection. |
| 3 | `ngDoCheck` | 开发人员的自定义变更检测。 |
| 4 | `ngAfterContentInit` | After component content initialized. |
| 4 | `ngAfterContentInit` | 组件内容初始化后。 |
| 5 | `ngAfterContentChecked` | After every check of component content. |
| 5 | `ngAfterContentChecked` | 在每次检查组件内容之后。 |
| 6 | `ngAfterViewInit` | After the views of a component are initialized. |
| 6 | `ngAfterViewInit` | 在组件的视图被初始化之后。 |
| 7 | `ngAfterViewChecked` | After every check of the views of a component. |
| 7 | `ngAfterViewChecked` | 在每次检查组件视图之后。 |
| 8 | `ngOnDestroy` | Just before the directive is destroyed. |
| 8 | `ngOnDestroy` | 就在指令被销毁之前。 |

To learn more, see [Lifecycle Hooks][AioGuideLifecycleHooks].

欲知详情，参阅[生命周期钩子][AioGuideLifecycleHooks]。

## module

## 模块（module）

In general, a module collects a block of code dedicated to a single purpose.
Angular uses standard JavaScript modules and also defines an Angular module, `NgModule`.

通常，模块会收集一组专注于单一目的的代码块。Angular 既使用 JavaScript 的标准模块，也定义了 Angular 自己的模块，也就是 `NgModule`。

In JavaScript, or ECMAScript, each file is a module and all objects defined in the file belong to that module.
Objects can be exported, making them public, and public objects can be imported for use by other modules.

在 JavaScript (ECMAScript) 中，每个文件都是一个模块，该文件中定义的所有对象都属于这个模块。这些对象可以导出为公共对象，而这些公共对象可以被其它模块导入后使用。

Angular ships as a collection of JavaScript modules.
A collection of JavaScript modules are also referenced as a library.
Each Angular library name begins with the `@angular` prefix.
Install Angular libraries with the [npm package manager][NpmjsDocsAboutNpm] and import parts of them with JavaScript `import` declarations.

Angular 就是用一组 JavaScript 模块的形式发布的。这些模块的集合也称为库。每个 Angular 库都带有 `@angular` 前缀。
使用 [NPM 包管理器][NpmjsDocsAboutNpm]安装它们，并且使用 JavaScript 的 `import` 声明语句从中导入各个部件。

Compare to [NgModule][AioGuideGlossaryNgmodule].

与 [NgModule][AioGuideGlossaryNgmodule] 的对比。

## ngcc

Angular compatibility compiler.
If you build your application using [Ivy][AioGuideGlossaryIvy], but it depends on libraries that have not been compiled with Ivy, the Angular CLI uses `ngcc` to automatically update the dependent libraries to use Ivy.

Angular 兼容性编译器。如果使用 [Ivy][AioGuideGlossaryIvy] 构建应用程序，但依赖未用 Ivy 编译的库，则 CLI 将使用 `ngcc` 自动更新依赖库以使用 Ivy。

## NgModule

## Ng 模块（NgModule）

A class definition preceded by the `@NgModule()` [decorator][AioGuideGlossaryDecoratorDecoration], which declares and serves as a manifest for a block of code dedicated to an application domain, a workflow, or a closely related set of capabilities.

一种带有 `@NgModule()` [装饰器][AioGuideGlossaryDecoratorDecoration]的类定义，它会声明并提供一组专注于特定功能的代码块，比如业务领域、工作流或一组紧密相关的能力集等。

Like a [JavaScript module][AioGuideGlossaryModule], an NgModule can export functionality for use by other NgModules and import public functionality from other NgModules.
The metadata for an NgModule class collects components, directives, and pipes that the application uses along with the list of imports and exports.
See also [declarable][AioGuideGlossaryDeclarable].

像 [JavaScript 模块][AioGuideGlossaryModule]一样，NgModule 能导出那些可供其它 NgModule 使用的功能，也可以从其它 NgModule 中导入其公开的功能。
NgModule 类的元数据中包括一些供应用使用的组件、指令和管道，以及导入、导出列表。参阅[可声明对象][AioGuideGlossaryDeclarable]。

NgModules are typically named after the file in which the exported thing is defined.
For example, the Angular [DatePipe][AioApiCommonDatepipe] class belongs to a feature module named `date_pipe` in the file `date_pipe.ts`.
You import them from an Angular [scoped package][AioGuideGlossaryScopedPackage] such as `@angular/core`.

NgModule 通常会根据它导出的内容决定其文件名，比如，Angular 的 [DatePipe][AioApiCommonDatepipe] 类就属于 `date_pipe.ts` 文件中一个名叫 `date_pipe` 的特性模块。
你可以从 Angular 的[范围化包][AioGuideGlossaryScopedPackage]中导入它们，比如 `@angular/core`。

Every Angular application has a root module.
By convention, the class is named `AppModule` and resides in a file named `app.module.ts`.

每个 Angular 应用都有一个根模块。通常，这个类会命名为 `AppModule`，并且位于一个名叫 `app.module.ts` 的文件中。

To learn more, see [NgModules][AioGuideNgmodules].

要了解更多，参阅 [NgModules][AioGuideNgmodules]。

## npm package

## npm 包

The [npm package manager][NpmjsDocsAboutNpm] is used to distribute and load Angular modules and libraries.

[npm 包管理器][NpmjsDocsAboutNpm]用于分发与加载 Angular 的模块和库。

Learn more about how Angular uses [Npm Packages][AioGuideNpmPackages].

你还可以了解 Angular 如何使用 [Npm 包][AioGuideNpmPackages] 的更多知识。

## ngc

`ngc` is a Typescript-to-Javascript transpiler that processes Angular decorators, metadata, and templates, and emits JavaScript code.
The most recent implementation is internally referred to as `ngtsc` because it is a minimalistic wrapper around the TypeScript compiler `tsc` that adds a transform for processing Angular code.

`ngc` 是一个 TypeScript 到 JavaScript 的转译器，它会处理 Angular 的注解、元数据、模板，并生成 JavaScript 代码。
其最新的实现在内部被称为 `ngtsc`，因为它是一个对 TypeScript 编译器 `tsc` 的最小化包装，为其加入了 Angular 代码的转换过程。

## observable

## 可观察对象（Observable）

A producer of multiple values, which it pushes to [subscribers][AioGuideGlossarySubscriber].
Used for asynchronous event handling throughout Angular.
You execute an observable by subscribing to it with its `subscribe()` method, passing callbacks for notifications of new values, errors, or completion.

一个多值生成器，这些值会被推送给[订阅者][AioGuideGlossarySubscriber]。
Angular 中到处都会用到异步事件处理。你要通过调用可观察对象的 `subscribe()` 方法来订阅它，从而让这个可观察对象得以执行，你还要给该方法传入一些回调函数来接收 "有新值"、"错误" 或 "完成" 等通知。

Observables can deliver in one the following ways a single value or multiple values of any type to subscribers.

可观察对象可以通过下列方式把一个或多个值传给订阅者。

* Synchronously as a function delivers a value to the requester

  作为函数同步地将值传递给请求者

* Scheduled

  预定后异步传递

A subscriber receives notification of new values as they are produced and notification of either normal completion or error completion.

订阅者会在生成了新值时收到包含这个新值的通知，以及正常结束或错误结束时的通知。

Angular uses a third-party library named [Reactive Extensions (RxJS)][RxjsMain].
To learn more, see [Observables][AioGuideObservables].

Angular 使用一个名叫[响应式扩展 (RxJS)][RxjsMain]的第三方包来实现这些功能。
要了解更多，参阅[可观察对象][AioGuideObservables]。

## observer

## 观察者（observer）

An object passed to the `subscribe()` method for an [observable][AioGuideGlossaryObservable].
The object defines the callbacks for the [subscriber][AioGuideGlossarySubscriber].

传给[可观察对象][AioGuideGlossaryObservable] 的 `subscribe()` 方法的一个对象，其中定义了[订阅者][AioGuideGlossarySubscriber]的一组回调函数。

## output

## 输出属性（output）

When defining a [directive][AioGuideGlossaryDirective], the `@Output{}` decorator on a directive property makes that property available as a *target* of [event binding][AioGuideEventBinding].
Events stream *out* of this property to the receiver identified in the [template expression][AioGuideGlossaryTemplateExpression] to the right of the equal sign.

当定义[指令][AioGuideGlossaryDirective]时，指令属性上的 `@Output()` 装饰器会让该属性可用作[事件绑定][AioGuideEventBinding]的*目标*。
事件从该属性流*出*到等号右侧指定的[模板表达式][AioGuideGlossaryTemplateExpression]中。

To learn more, see [`@Input()` and `@Output()` decorator functions][AioGuideInputsOutputs].

要了解更多，参阅 [`@Input()` 和 `@Output()` 装饰器函数][AioGuideInputsOutputs]。

## pipe

## 管道（pipe）

A class which is preceded by the `@Pipe{}` decorator and which defines a function that transforms input values to output values for display in a [view][AioGuideGlossaryView].
Angular defines various pipes, and you can define new pipes.

一个带有 `@Pipe{}` 装饰器的类，它定义了一个函数，用来把输入值转换成输出值，以显示在[视图][AioGuideGlossaryView]中。
Angular 定义了很多管道，并且你还可可以自定义新的管道。

To learn more, see [Pipes][AioGuidePipes].

欲知详情，参阅[管道][AioGuidePipes]。

## platform

## 平台（platform）

In Angular terminology, a platform is the context in which an Angular application runs.
The most common platform for Angular applications is a web browser, but it can also be an operating system for a mobile device, or a web server.

在 Angular 术语中，平台是供 Angular 应用程序在其中运行的上下文。Angular 应用程序最常见的平台是 Web 浏览器，但它也可以是移动设备的操作系统或 Web 服务器。

Support for the various Angular run-time platforms is provided by the `@angular/platform-*` packages.
These packages allow applications that make use of `@angular/core` and `@angular/common` to execute in different environments by providing implementation for gathering user input and rendering UIs for the given platform.
Isolating platform-specific functionality allows the developer to make platform-independent use of the rest of the framework.

`@angular/platform-*` 软件包提供了对各种 Angular 运行时平台的支持。这些软件包通过提供用于收集用户输入和渲染指定平台 UI 的实现，以允许使用 `@angular/core` 和 `@angular/common` 的应用程序在不同的环境中执行。隔离平台相关的功能使开发人员可以独立于平台使用框架的其余部分。

* When running in a web browser, [`BrowserModule`][AioApiPlatformBrowserBrowsermodule] is imported from the `platform-browser` package, and supports services that simplify security and event processing, and allows applications to access browser-specific features, such as interpreting keyboard input and controlling the title of the document being displayed.
  All applications running in the browser use the same platform service.

  在 Web 浏览器中运行时，[`BrowserModule`][AioApiPlatformBrowserBrowsermodule] 是从 `platform-browser` 软件包中导入的，并支持简化安全性和事件处理的服务，并允许应用程序访问浏览器专有的功能，比如解释键盘输入和控制文档要显示的标题。浏览器中运行的所有应用程序都使用同一个平台服务。

* When [server-side rendering (SSR)][AioGuideGlossaryServerSideRendering] is used, the [`platform-server`][AioApiPlatformServer] package provides web server implementations of the `DOM`, `XMLHttpRequest`, and other low-level features that do not rely on a browser.

  使用[服务端渲染][AioGuideGlossaryServerSideRendering]（SSR）时，[`platform-server`][AioApiPlatformServer] 包将提供 `DOM`、`XMLHttpRequest` 和其它不依赖浏览器的其它底层功能的 Web 服务器端实现。

## polyfill

## 腻子脚本（polyfill）

An [npm package][AioGuideNpmPackages] that plugs gaps in the JavaScript implementation of a browser.
See [Browser Support][AioGuideBrowserSupport] for polyfills that support particular functionality for particular platforms.

一个 [NPM 包][AioGuideNpmPackages]，它负责弥补浏览器 JavaScript 实现与最新标准之间的 "缝隙"。参阅[浏览器支持][AioGuideBrowserSupport]页，以了解要在特定平台支持特定功能时所需的腻子脚本。

## project

## 项目（project）

In the Angular CLI, a standalone application or [library][AioGuideGlossaryLibrary] that can be created or modified by a Angular CLI command.

在 Angular CLI 中，CLI 命令可能会创建或修改独立应用或[库][AioGuideGlossaryLibrary]。

A project, as generated by the [`ng new`][AioCliNew], contains the set of source files, resources, and configuration files that you need to develop and test the application using the Angular CLI.
Projects can also be created with the `ng generate application` and `ng generate library` commands.

由 [`ng new`][AioCliNew] 创建的项目中包含一组源文件、资源和配置文件，当你用 CLI 开发或测试此应用时就会用到它们。此外，还可以用 `ng generate application` 或 `ng generate library` 命令创建项目。

To learn more, see [Project File Structure][AioGuideFileStructure].

欲知详情，参阅[项目文件结构][AioGuideFileStructure]。

The [`angular.json`][AioGuideWorkspaceConfig] file configures all projects in a [workspace][AioGuideGlossaryWorkspace].

[`angular.json`][AioGuideWorkspaceConfig] 文件可以配置某个[工作区][AioGuideGlossaryWorkspace] 中的所有项目。

## provider

## 提供者（provider）

An object that implements one of the [`Provider`][AioApiCoreProvider] interfaces.
A provider object defines how to obtain an injectable dependency associated with a [DI token][AioGuideGlossaryDiToken].
An [injector][AioGuideGlossaryInjector] uses the provider to create a new instance of a dependency for a class that requires it.

一个实现了 [`Provider`][AioApiCoreProvider] 接口的对象。一个提供者对象定义了如何获取与 [DI 令牌（token）][AioGuideGlossaryDiToken] 相关联的可注入依赖。
[注入器][AioGuideGlossaryInjector]会使用这个提供者来创建它所依赖的那些类的实例。

Angular registers its own providers with every injector, for services that Angular defines.
You can register your own providers for services that your application needs.

Angular 会为每个注入器注册一些 Angular 自己的服务。你也可以注册应用自己所需的服务提供者。

See also [service][AioGuideGlossaryService], [dependency injection][AioGuideGlossaryDependencyInjectionDi].

参阅[服务][AioGuideGlossaryService]和[依赖注入][AioGuideGlossaryDependencyInjectionDi]。

See also [service][AioGuideGlossaryService].
See also [dependency injection][AioGuideGlossaryDependencyInjectionDi].

参阅[服务][AioGuideGlossaryService]。
参阅[依赖注入][AioGuideGlossaryDependencyInjectionDi]。

Learn more in [Dependency Injection][AioGuideDependencyInjection].

在[依赖注入][AioGuideDependencyInjection]中了解更多信息。

## reactive forms

## 响应式表单（reactive forms）

A framework for building Angular forms through code in a component.
The alternative is a [template-driven form][AioGuideGlossaryTemplateDrivenForms].

通过组件中代码构建 Angular 表单的一个框架。
另一种技术是[模板驱动表单][AioGuideGlossaryTemplateDrivenForms]

When using reactive forms:

构建响应式表单时：

* The "source of truth", the form model, is defined in the component class.

  "事实之源"（表单模型）定义在组件类中。

* Validation is set up through validation functions rather than validation directives.

  表单验证在组件代码而不是验证器指令中定义。

* Each control is explicitly created in the component class by creating a `FormControl` instance manually or with `FormBuilder`.

  在组件类中，通过创建 `FormControl` 实例或使用 `FormBuilder` 显性地创建每个控件。

* The template input elements do *not* use `ngModel`.

  模板中的 `input` 元素**不**使用 `ngModel`。

* The associated Angular directives are prefixed with `form`, such as `formControl`, `formGroup`, and `formControlName`.

  相关联的 Angular 指令全部以 `Form` 开头，比如 `FormGroup()`、`FormControl()` 和 `FormControlName()`。

The alternative is a template-driven form.
For an introduction and comparison of both forms approaches, see [Introduction to Angular Forms][AioGuideFormsOverview].

另一种方式是模板驱动表单。模板驱动表单的简介和这两种方式的比较，参阅 [Angular 表单简介][AioGuideFormsOverview]。

## resolver

## 解析器（resolver）

A class that implements the [Resolve][AioApiRouterResolve] interface that you use to produce or retrieve data that is needed before navigation to a requested route can be completed.
You may use a function with the same signature as the [resolve()][AioApiRouterResolve] method in place of the [Resolve][AioApiRouterResolve] interface.
Resolvers run after all [route guards][AioGuideGlossaryRouteGuard] for a route tree have been executed and have succeeded.

一个实现了 [Resolve][AioApiRouterResolve] 接口的类，你可以在导航到所请求的路由之前，先用它来生成或获取数据。
你还可以在 [Resolve][AioApiRouterResolve] 接口的位置使用一个与 [resolve() 方法][AioApiRouterResolve]具有相同签名的方法。一些解析器会在一棵路由树的所有[路由守卫][AioGuideGlossaryRouteGuard]都执行并成功之后运行。

See an example of using a [resolve guard][AioGuideRouterTutorialTohResolvePreFetchingComponentData] to retrieve dynamic data.

参见使用[解析守卫][AioGuideRouterTutorialTohResolvePreFetchingComponentData]获取动态数据一章中的例子。

## route guard

## 路由守卫（route guard）

A method that controls navigation to a requested route in a routing application.
Guards determine whether a route can be activated or deactivated, and whether a lazy-loaded module can be loaded.

一种在带路由的应用中对导航到所要求的路由进行控制的方式。
这些守卫会决定一个路由是否可以激活或停止激活，以及惰性加载模块是否可以被加载。

Learn more in the [Routing and Navigation][AioGuideRouterPreventingUnauthorizedAccess] guide.

欲知详情，参见[路由与导航][AioGuideRouterPreventingUnauthorizedAccess]一章。

<a id="router-module"></a>

## router

## 路由器（router）

A tool that configures and implements navigation among states and [views][AioGuideGlossaryView] within an Angular application.

一种工具，用来配置和实现 Angular 应用中各个状态和[视图][AioGuideGlossaryView]之间的导航。

The `Router` module is an [NgModule][AioGuideGlossaryNgmodule] that provides the necessary service providers and directives for navigating through application views.
A [routing component][AioGuideGlossaryRoutingComponent] is one that imports the `Router` module and whose template contains a `RouterOutlet` element where it can display views produced by the router.

`Router` 模块是一个 [NgModule][AioGuideGlossaryNgmodule]，它提供在应用视图间导航时需要的服务提供者和指令。[路由组件][AioGuideGlossaryRoutingComponent]是一种组件，它导入了 `Router` 模块，并且其模板中包含 `RouterOutlet` 元素，路由器生成的视图就会被显示在那里。

The router defines navigation among views on a single page, as opposed to navigation among pages.
It interprets URL-like links to determine which views to create or destroy, and which components to load or unload.
It allows you to take advantage of [lazy loading][AioGuideGlossaryLazyLoading] in your Angular applications.

路由器定义了在单页面中的各个视图之间导航的方式，而不是在页面之间。它会解释类似 URL 的链接，以决定该创建或销毁哪些视图，以及要加载或卸载哪些组件。它让你可以在 Angular 应用中获得[惰性加载][AioGuideGlossaryLazyLoading]的好处。

To learn more, see [Routing and Navigation][AioGuideRouter].

要了解更多，参阅[路由与导航][AioGuideRouter]。

## router outlet

## 路由出口（router outlet）

A [directive][AioGuideGlossaryDirective] that acts as a placeholder in the template of a routing component.
Angular dynamically renders the template based on the current router state.

一种[指令][AioGuideGlossaryDirective]，它在路由组件的模板中扮演占位符的角色，Angular 会根据当前的路由状态动态填充它。

## routing component

## 路由组件（routing component）

An Angular [component][AioGuideGlossaryComponent] with a `RouterOutlet` directive in its template that displays views based on router navigations.

一个模板中带有 `RouterOutlet` 指令的 Angular [组件][AioGuideGlossaryComponent]，用于根据路由器的导航显示相应的视图。

To learn more, see [Routing and Navigation][AioGuideRouter].

要了解更多，参阅[路由与导航][AioGuideRouter]。

## rule

## 规则（rule）

In [schematics][AioGuideGlossarySchematic], a function that operates on a [file tree][AioGuideGlossaryTree] to create, delete, or modify files in a specific manner.

在[原理图][AioGuideGlossarySchematic] 中，是指一个在[文件树][AioGuideGlossaryTree]上运行的函数，用于以指定方式创建、删除或修改文件，并返回一个新的 `Tree` 对象。

## schematic

## 原理图（schematic）

A scaffolding library that defines how to generate or transform a programming project by creating, modifying, refactoring, or moving files and code.
A schematic defines [rules][AioGuideGlossaryRule] that operate on a virtual file system referenced as a [tree][AioGuideGlossaryTree].

脚手架库会定义如何借助创建、修改、重构或移动文件和代码等操作来生成或转换某个项目。每个原理图定义了[一些规则][AioGuideGlossaryRule]，以操作一个被称为[文件树][AioGuideGlossaryTree]的虚拟文件系统。

The [Angular CLI][AioGuideGlossaryCommandLineInterfaceCli] uses schematics to generate and modify [Angular projects][AioGuideGlossaryProject] and parts of projects.

Angular [CLI][AioGuideGlossaryCommandLineInterfaceCli] 使用原理图来生成和修改 [Angular 项目][AioGuideGlossaryProject]及其部件。

* Angular provides a set of schematics for use with the Angular CLI.
  See the [Angular CLI command reference][AioCliMain].
  The [`ng add`][AioCliAdd] Angular [CLI][AioGuideGlossaryCommandLineInterfaceCli] command runs schematics as part of adding a library to your project.
  The [`ng generate`][AioCliGenerate] Angular [CLI][AioGuideGlossaryCommandLineInterfaceCli] command runs schematics to create applications, libraries, and Angular code constructs.

  Angular 提供了一组用于 CLI 的原理图。参阅 [Angular CLI 命令参考手册][AioCliMain]。当 [`ng add`][AioCliAdd] 命令向项目中添加某个库时，就会运行原理图。[`ng generate`][AioCliGenerate] 命令则会运行原理图，来创建应用、库和 Angular 代码块。

* [Library][AioGuideGlossaryLibrary] developers can create schematics that enable the Angular CLI to add and update their published libraries, and to generate artifacts the library defines.
  Add these schematics to the npm package that you use to publish and share your library.

  公共[库][AioGuideGlossaryLibrary]的开发者可以创建原理图，来让 Angular CLI 添加或升级他们自己的发布的库，还可以生成此库中定义的工件。请把这些原理图添加到要用来发布和共享本库的 npm 包中。

To learn more, see [Schematics][AioGuideSchematics].
To learn more, see also [Integrating Libraries with the CLI][AioGuideCreatingLibrariesIntegratingWithTheCliUsingCodeGenerationSchematics].

欲知详情，参阅[原理图][AioGuideSchematics]。
欲知详情，参阅[将库与 CLI 集成][AioGuideCreatingLibrariesIntegratingWithTheCliUsingCodeGenerationSchematics]。

## Schematics CLI

## 原理图 CLI

Schematics come with their own command-line tool.
Use Node 6.9 or above to install the Schematics CLI globally.

Schematics 自带了一个命令行工具。
使用 Node 6.9 或更高版本，可以全局安装这个 Schematics CLI：

<code-example format="shell" language="shell">

npm install -g @angular-devkit/schematics-cli

</code-example>

This installs the `schematics` executable, which you can use to create a new schematics [collection][AioGuideGlossaryCollection] with an initial named schematic.
The collection directory is a workspace for schematics.
You can also use the `schematics` command to add a new schematic to an existing collection, or extend an existing schematic.

这会安装可执行文件 `schematics`，你可以用它来创建新工程、往现有工程中添加新的 schematic，或扩展某个现有的 schematic。

## scoped package

## 范围化包 (scoped package)

A way to group related [npm packages][AioGuideNpmPackages].
NgModules are delivered within scoped packages whose names begin with the Angular *scope name* `@angular`.
For example, `@angular/core`, `@angular/common`, `@angular/forms`, and `@angular/router`.

一种把相关的 [npm 包][AioGuideNpmPackages]分组到一起的方式。
Angular 的 NgModule 都是在一些以 `@angular` 为范围名的*范围化包*中发布的。比如 `@angular/core`、`@angular/common`、`@angular/forms` 和 `@angular/router`。

Import a scoped package in the same way that you import a normal package.

和导入普通包相同的方式导入范围化包。

<code-example path="architecture/src/app/app.component.ts" header="architecture/src/app/app.component.ts (import)" region="import"></code-example>

## server-side rendering

## 服务端渲染

A technique that generates static application pages on the server, and can generate and serve those pages in response to requests from browsers.
It can also pre-generate pages as HTML files that you serve later.

一项在服务端生成静态应用页面的技术，它可以在对来自浏览器的请求进行响应时生成这些页面或用它们提供服务。
它还可以提前把这些页面生成为 HTML 文件，以便稍后用它们来提供服务。

This technique can improve performance on mobile and low-powered devices and improve the user experience by showing a static first page quickly while the client-side application is loading.
The static version can also make your application more visible to web crawlers.

该技术可以增强手机和低功耗设备的性能，而且会在应用加载通过快速展示一个静态首屏来提升用户体验。这个静态版本还能让你的应用对网络蜘蛛更加友好。

You can easily prepare an application for server-side rendering by using the [Angular CLI][AioGuideGlossaryCommandLineInterfaceCli] to run the [Angular Universal][AioGuideGlossaryUniversal] tool, using the `@nguniversal/express-engine` [schematic][AioGuideGlossarySchematic].

你可以通过 [CLI][AioGuideGlossaryCommandLineInterfaceCli] 运行 [Angular Universal][AioGuideGlossaryUniversal] 工具，借助 `@nguniversal/express-engine` [schematic][AioGuideGlossarySchematic] 原理图来更轻松的让应用支持服务端渲染。

## service

## 服务（service）

In Angular, a class with the [@Injectable()][AioGuideGlossaryInjectable] decorator that encapsulates non-UI logic and code that can be reused across an application.
Angular distinguishes components from services to increase modularity and reusability.

在 Angular 中，服务就是一个带有 [@Injectable][AioGuideGlossaryInjectable] 装饰器的类，它封装了可以在应用程序中复用的非 UI 逻辑和代码。
Angular 把组件和服务分开，是为了增进模块化程度和可复用性。

The `@Injectable()` metadata allows the service class to be used with the [dependency injection][AioGuideGlossaryDependencyInjectionDi] mechanism.
The injectable class is instantiated by a [provider][AioGuideGlossaryProvider].
[Injectors][AioGuideGlossaryInjector] maintain lists of providers and use them to provide service instances when they are required by components or other services.

`@Injectable` 元数据让服务类能用于[依赖注入][AioGuideGlossaryDependencyInjectionDi]机制中。可注入的类是用[提供者][AioGuideGlossaryProvider]进行实例化的。
[各个注入器][AioGuideGlossaryInjector]会维护一个提供者的列表，并根据组件或其它服务的需要，用它们来提供服务的实例。

For To learn more, see [Introduction to Services and Dependency Injection][AioGuideArchitectureServices].

要了解更多，参阅[服务与依赖注入简介][AioGuideArchitectureServices]。

## structural directive

## 结构型指令（structural directive）

A category of [directive][AioGuideGlossaryDirective] that is responsible for shaping HTML layout by modifying the DOM.
Modification of the DOM includes, adding, removing, or manipulating elements and the associated children.

一种[指令][AioGuideGlossaryDirective]类型，它能通过修改 DOM 来修整或重塑 HTML 的布局。
这里所说的修改 DOM 包括添加、删除或操纵元素及其相关子元素。

To learn more, see [Structural Directives][AioGuideStructuralDirectives].

欲知详情，参阅[结构型指令][AioGuideStructuralDirectives]。

## subscriber

## 订阅者（Subscriber）

A function that defines how to obtain or generate values or messages to be published.
This function is executed when a consumer runs the `subscribe()` method of an [observable][AioGuideGlossaryObservable].

一个函数，用于定义如何获取或生成要发布的值或消息。
当有消费者调用[可观察对象][AioGuideGlossaryObservable]的 `subscribe()` 方法时，该函数就会执行。

The act of subscribing to an observable triggers its execution, associates callbacks with it, and creates a `Subscription` object that lets you unsubscribe.

订阅一个可观察对象就会触发该对象的执行、为该对象关联一些回调函数，并创建一个 `Subscription`（订阅记录）对象来让你能取消订阅。

The `subscribe()` method takes an [observer][AioGuideGlossaryObserver] JavaScript object with up to three callbacks, one for each type of notification that an observable can deliver.

`subscribe()` 方法接收一个名叫[观察者（observer）][AioGuideGlossaryObserver]的 JavaScript 对象，其中最多可以包含三个回调，分别对应可观察对象可以发出的几种通知类型：

* The `next` notification sends a value such as a number, a string, or an object.

  `next`（下一个）通知会发送一个值，比如数字、字符串、对象。

* The `error` notification sends a JavaScript Error or exception.

  `error`（错误）通知会发送 JavaScript 错误或异常。

* The `complete` notification does not send a value, but the handler is run when the method completes.
  Scheduled values can continue to be returned after the method completes.

  `complete`（完成）通知不会发送值，但是当调用结束时会调用这个处理器。异步的值可能会在调用了完成之后继续发送过来。

## target

## 目标（target）

A buildable or runnable subset of a [project][AioGuideGlossaryProject], configured as an object in the [workspace configuration file][AioGuideWorkspaceConfigProjectToolConfigurationOptions], and executed by an [Architect][AioGuideGlossaryArchitect] [builder][AioGuideGlossaryBuilder].

[项目][AioGuideGlossaryProject]的一个可构建或可运行的子集，它是[工作区配置文件][AioGuideWorkspaceConfigProjectToolConfigurationOptions]中的一个子对象，它会被[建筑师（Architect）][AioGuideGlossaryArchitect]的[构建器（Builder）][AioGuideGlossaryBuilder]执行。

In the `angular.json` file, each project has an "architect" section that contains targets which configure builders.
Some of these targets correspond to Angular [CLI][AioGuideGlossaryCommandLineInterfaceCli] command, such as `build`, `serve`, `test`, and `lint`.

在 `angular.json` 文件中，每个项目都有一个 `architect` 分区，其中包含一些用于配置构建器的目标。其中一些目标对应于 [CLI 命令][AioGuideGlossaryCommandLineInterfaceCli]，比如 `build`、`serve`、`test` 和 `lint`。

For example, the Architect builder invoked by the `ng build` command to compile a project uses a particular build tool, and has a default configuration with values that you can override on the command line.
The `build` target also defines an alternate configuration for a "development" build, which you can invoke with the `--configuration development` flag on the `build` command.

比如，`ng build` 命令用来编译项目时所调用的构建器会使用一个特定的构建工具，并且具有一份默认配置，此配置中的值可以通过命令行参数进行覆盖。目标 `build` 还为 "开发环境" 构建定义了另一个配置，可以通过在 `build` 命令上添加 `--configuration development` 标志来调用它。

The Architect tool provides a set of builders.
The [`ng new`][AioCliNew] Angular [CLI][AioGuideGlossaryCommandLineInterfaceCli] command provides a set of targets for the initial application project.
The [`ng generate application`][AioCliGenerateApplication] and [`ng generate library`][AioCliGenerateLibrary] Angular [CLI][AioGuideGlossaryCommandLineInterfaceCli] commands provide a set of targets for each new [project][AioGuideGlossaryProject].
These targets, their options and configurations, can be customized to meet the needs of your project.
For example, you may want to add a "staging" or "testing" configuration to the "build" target of a project.

建筑师工具提供了一组构建器。[`ng new` 命令][AioCliNew]为初始应用项目提供了一组目标。[`ng generate application`][AioCliGenerateApplication] 和 [`ng generate library`][AioCliGenerateLibrary] 命令则为每个新[项目][AioGuideGlossaryProject]提供了一组目标。这些目标的选项和配置都可以进行自定义，以便适应你项目的需求。比如，你可能会想为项目的 "build" 目标添加一个 "staging" 或 "testing" 配置。

You can also define a custom builder, and add a target to the project configuration that uses your custom builder.
You can then run the target using the [`ng run`][AioCliRun] Angular [CLI][AioGuideGlossaryCommandLineInterfaceCli] command.

你还可以定义一个自定义构建器，并且往项目配置中添加一个目标，来使用你的自定义构建器。然后你就可以通过 [`ng run`][AioCliRun] 这个 [CLI][AioGuideGlossaryCommandLineInterfaceCli] 命令来运行此目标。

## template

## 模板（template）

Code that defines how to render the [view][AioGuideGlossaryView] of a component.

用来定义要如何渲染组件[视图][AioGuideGlossaryView]的代码。

A template combines straight HTML with Angular [data-binding][AioGuideGlossaryDataBinding] syntax, [directives][AioGuideGlossaryDirective], and [template expressions][AioGuideGlossaryTemplateExpression] (logical constructs).
The Angular elements insert or calculate values that modify the HTML elements before the page is displayed.
Learn more about Angular template language in the [Template Syntax][AioGuideTemplateSyntax] guide.

模板会把纯 HTML 和 Angular 的[数据绑定][AioGuideGlossaryDataBinding]语法、[指令][AioGuideGlossaryDirective]和[模板表达式][AioGuideGlossaryTemplateExpression]组合起来。Angular 的元素会插入或计算那些值，以便在页面显示出来之前修改 HTML 元素。
在[模板语法][AioGuideTemplateSyntax]指南中了解有关 Angular 模板语言的更多信息。

A template is associated with a [component class][AioGuideGlossaryComponent] through the `@Component()` [decorator][AioGuideGlossaryDecoratorDecoration].
The template code can be provided inline, as the value of the `template` property, or in a separate HTML file linked through the `templateUrl` property.

模板通过 `@Component()` [装饰器][AioGuideGlossaryDecoratorDecoration]与[组件类][AioGuideGlossaryComponent]类关联起来。模板代码可以作为 `template` 属性的值用内联的方式提供，也可以通过 `templateUrl` 属性链接到一个独立的 HTML 文件。

Additional templates, represented by `TemplateRef` objects, can define alternative or *embedded* views, which can be referenced from multiple components.

用 `TemplateRef` 对象表示的其它模板用来定义一些备用视图或*内嵌*视图，它们可以来自多个不同的组件。

## template-driven forms

## 模板驱动表单（template-driven forms）

A format for building Angular forms using HTML forms and input elements in the view.
The alternative format uses the [reactive forms][AioGuideGlossaryReactiveForms] framework.

一种在视图中使用 HTML 表单和输入类元素构建 Angular 表单的格式。
它的替代方案是[响应式表单][AioGuideGlossaryReactiveForms]框架。

When using template-driven forms:

当构建模板驱动表单时：

* The "source of truth" is the template.
  The validation is defined using attributes on the individual input elements.

  模板是“事实之源”。使用属性 (attribute) 在单个输入元素上定义验证规则。

* [Two-way binding][AioGuideGlossaryDataBinding] with `ngModel` keeps the component model synchronized with the user's entry into the input elements.

  使用 `ngModel` 进行[双向绑定][AioGuideGlossaryDataBinding]，保持组件模型和用户输入之间的同步。

* Behind the scenes, Angular creates a new control for each input element, provided you have set up a `name` attribute and two-way binding for each input.

  在幕后，Angular 为每个带有 `name` 属性和双向绑定的输入元素创建了一个新的控件。

* The associated Angular directives are prefixed with `ng` such as `ngForm`, `ngModel`, and `ngModelGroup`.

  相关的 Angular 指令都带有 `ng` 前缀，比如 `ngForm`、`ngModel` 和 `ngModelGroup`。

The alternative is a reactive form.
For an introduction and comparison of both forms approaches, see [Introduction to Angular Forms][AioGuideFormsOverview].

另一种方式是响应式表单。响应式表单的简介和两种方式的比较参阅 [Angular 表单简介][AioGuideFormsOverview]。

## template expression

## 模板表达式（template expression）

A TypeScript-like syntax that Angular evaluates within a [data binding][AioGuideGlossaryDataBinding].

一种类似 TypeScript 的语法，Angular 用它对[数据绑定 (data binding)][AioGuideGlossaryDataBinding]进行求值。

<!--todo: have Alex review this -->

<!-- Read about how to write template expressions in the [template expressions][AioGuideInterpolationTemplateExpressions] section of the [Interpolation][AioGuideInterpolation] guide. -->

## template reference variable

## 模板引用变量（template reference variable）

A variable defined in a template that references an instance associated with an element, such as a directive instance, component instance, template as in `TemplateRef`, or DOM element.
After declaring a template reference variable on an element in a template, you can access values from that variable elsewhere within the same template.
The following example defines a template reference variable named `#phone`.

模板中定义的一个变量，它可以引用与某元素相关的实例，比如指令实例、组件实例、模板（`TemplateRef`）或 DOM 元素。
在模板中的某个元素上声明了模板引用变量之后，你可以从同一个模板中的其它位置访问这些值。
下面的例子定义了一个名叫 `#phone` 的模板引用变量。

<code-example path="template-reference-variables/src/app/app.component.html" region="ref-var" header="src/app/app.component.html"></code-example>

To learn more, see [Template reference variable][AioGuideTemplateReferenceVariables].

欲知详情，参阅[模板引用变量][AioGuideTemplateReferenceVariables]。

## template input variable

## 模板输入变量（template input variable）

A template input variable is a variable you can reference within a single instance of the template.
You declare a template input variable using the `let` keyword as in `let customer`.

模板输入变量是一种你可以在模板的单个实例中引用的变量。你可以使用 `let` 关键字来声明模板输入变量，就像 `let customer` 一样。

<code-example format="html" language="html">

&lt;tr *ngFor="let customer of customers;"&gt;
    &lt;td&gt;{{customer.customerNo}}&lt;/td&gt;
    &lt;td&gt;{{customer.name}}&lt;/td&gt;
    &lt;td&gt;{{customer.address}}&lt;/td&gt;
    &lt;td&gt;{{customer.city}}&lt;/td&gt;
    &lt;td&gt;{{customer.state}}&lt;/td&gt;
    &lt;button (click)="selectedCustomer=customer"&gt;Select&lt;/button&gt;
&lt;/tr&gt;

</code-example>

Read and learn more about [template input variables][AioGuideTemplateReferenceVariablesTemplateInputVariable].

欲知详情，参阅[模板输入变量][AioGuideTemplateReferenceVariablesTemplateInputVariable]。

## token

## 令牌（token）

An opaque identifier used for efficient table lookup.
In Angular, a [DI token][AioGuideGlossaryDiToken] is used to find [providers][AioGuideGlossaryProvider] of dependencies in the [dependency injection][AioGuideGlossaryDependencyInjectionDi] system.

用于高效查表的不透明标识符（译注：不透明是指你不必了解其细节）。在 Angular 中，[DI 令牌][AioGuideGlossaryDiToken]用于在[依赖注入][AioGuideGlossaryDependencyInjectionDi]系统中查找[服务提供者][AioGuideGlossaryProvider]。

## transpile

## 转译（transpile）

The translation process that transforms one version of JavaScript to another version; for example, down-leveling ES2015 to the older ES5 version.

一种翻译过程，它会把一个版本的 JavaScript 转换成另一个版本，比如把下一版的 ES2015 转换成老版本的 ES5。

## tree

## 目录树（tree）

In [schematics][AioGuideGlossarySchematic], a virtual file system represented by the `Tree` class.
Schematic [rules][AioGuideGlossaryRule] take a tree object as input, operate on them, and return a new tree object.

在 [schematics][AioGuideGlossarySchematic] 中，一个用 `Tree` 类表示的虚拟文件系统。
Schematic [规则][AioGuideGlossaryRule]以一个 `tree` 对象作为输入，对它们进行操作，并且返回一个新的 `tree` 对象。

## TypeScript

A programming language based on JavaScript that is notable for its optional typing system.
TypeScript provides compile-time type checking and strong tooling support
The type checking and tooling support include code completion, refactoring, inline documentation, and intelligent search.
Many code editors and IDEs support TypeScript either natively or with plug-ins.

TypeScript 是一种基于 JavaScript 的程序设计语言，以其可选类型系统著称。
TypeScript 提供了编译时类型检查和强大的工具支持。
这里所说的类型检查和工具支持包括代码补齐、重构、内联文档和智能搜索等。
许多代码编辑器和 IDE 都原生支持 TypeScript 或通过插件提供支持。

TypeScript is the preferred language for Angular development.
To learn more about TypeScript, see [typescriptlang.org][TypescriptlangMain].

TypeScript 是 Angular 的首选语言。要了解更多，参阅 [typescriptlang.org][TypescriptlangMain]。

## TypeScript configuration file

## TypeScript 配置文件

A file specifies the root files and the compiler options required to compile a TypeScript project.
To learn more, see [TypeScript configuration][AioGuideTypescriptConfiguration].

一个文件，用来指定编译 TypeScript 项目时的根文件和编译器选项。欲知详情，参阅 [TypeScript 配置][AioGuideTypescriptConfiguration]。

## unidirectional data flow

## 单向数据流

A data flow model where the component tree is always checked for changes in one direction from parent to child, which prevents cycles in the change detection graph.

一种数据流模型，它总是在一个方向（从父到子）上检查组件树是否有变化，以防止在变更检测图中出现循环。

In practice, this means that data in Angular flows downward during change detection.
A parent component can easily change values in its child components because the parent is checked first.
A failure could occur, however, if a child component tries to change a value in its parent during change detection (inverting the expected data flow), because the parent component has already been rendered.
In development mode, Angular throws the `ExpressionChangedAfterItHasBeenCheckedError` error if your application attempts to do this, rather than silently failing to render the new value.

在实践中，这意味着 Angular 中的数据会在变更检测过程中向下流动。父组件可以很容易地改变子组件中的值，因为父组件是先检查的。但是，如果子组件在变更检测期间（反转预期的数据流）尝试更改其父组件中的值，则可能会导致错误，因为父组件已经渲染过了。在开发模式下，如果你的应用尝试这样做，Angular 会抛出 `ExpressionChangedAfterItHasBeenCheckedError` 错误，而不是沉默地渲染新值。

To avoid this error, a [lifecycle hook][AioGuideLifecycleHooks] method that seeks to make such a change should trigger a new change detection run.
The new run follows the same direction as before, but succeeds in picking up the new value.

为了避免这个错误，进行此类更改的[生命周期钩子][AioGuideLifecycleHooks]方法中就要触发一次新的变更检测。这次新的变更检测与之前那次的方向一样，但可以成功获得新值。

## Universal

## 通用

A tool for implementing [server-side rendering][AioGuideGlossaryServerSideRendering] of an Angular application.
When integrated with an app, Universal generates and serves static pages on the server in response to requests from browsers.
The initial static page serves as a fast-loading placeholder while the full application is being prepared for normal execution in the browser.
To learn more, see [Angular Universal: server-side rendering][AioGuideUniversal].

用来帮 Angular 应用实现[服务端渲染][AioGuideGlossaryServerSideRendering]的工具。
当与应用集成在一起时，Universal 可以在服务端生成静态页面并用它们来响应来自浏览器的请求。
当浏览器正准备运行完整版应用的时候，这个初始的静态页可以用作一个可快速加载的占位符。
欲知详情，参阅 [Angular Universal: 服务端渲染][AioGuideUniversal]。

## view

## 视图（view）

The smallest grouping of display elements that can be created and destroyed together.
Angular renders a view under the control of one or more [directives][AioGuideGlossaryDirective].

视图是可显示元素的最小分组单位，它们会被同时创建和销毁。
Angular 在一个或多个[指令 (directive)][AioGuideGlossaryDirective] 的控制下渲染视图。

A [component][AioGuideGlossaryComponent] class and its associated [template][AioGuideGlossaryTemplate] define a view.
A view is specifically represented by a `ViewRef` instance associated with a component.
A view that belongs immediately to a component is referenced as a *host view*.
Views are typically collected into [view hierarchies][AioGuideGlossaryViewHierarchy].

[组件 (component)][AioGuideGlossaryComponent] 类及其关联的[模板 (template)][AioGuideGlossaryTemplate]定义了一个视图。
具体实现上，视图由一个与该组件相关的 `ViewRef` 实例表示。
直属于某个组件的视图叫做*宿主视图*。
通常会把视图组织成一些[视图树（view hierarchies）][AioGuideGlossaryViewHierarchy]。

Properties of elements in a view can change dynamically, in response to user actions; the structure (number and order) of elements in a view cannot.
You can change the structure of elements by inserting, moving, or removing nested views within their view containers.

视图中各个元素的属性可以动态修改以响应用户的操作，而这些元素的结构（数量或顺序）则不能。你可以通过在它们的视图容器中插入、移动或移除内嵌视图来修改这些元素的结构。

View hierarchies can be loaded and unloaded dynamically as the user navigates through the application, typically under the control of a [router][AioGuideGlossaryRouter].

当用户在应用中导航时（比如使用[路由器][AioGuideGlossaryRouter]），视图树可以动态加载或卸载。

<a id="ve"></a>

## View Engine

## 视图引擎（View Engine）

A previous compilation and rendering pipeline used by Angular.
It has since been replaced by [Ivy][AioGuideGlossaryIvy] and is no longer in use.
View Engine was deprecated in version 9 and removed in version 13.

Angular 曾经用过的编译和渲染管道。它已被 [Ivy][AioGuideGlossaryIvy] 取代，不再使用了。View Engine 在版本 9 中已弃用，并在版本 13 中删除。

<a id="view-tree"></a>

## view hierarchy

## 视图树（View hierarchy）

A tree of related views that can be acted on as a unit.
The root view referenced as the *host view* of a component.
A host view is the root of a tree of *embedded views*, collected in a `ViewContainerRef` view container attached to an anchor element in the hosting component.
The view hierarchy is a key part of Angular [change detection][AioGuideGlossaryChangeDetection].

一棵相关视图的树，它们可以作为一个整体行动。其根视图就是组件的*宿主视图*。宿主视图可以是*内嵌视图*树的根，它被收集到了宿主组件上的一个*视图容器（`ViewContainerRef`）*中。视图树是 Angular [变更检测][AioGuideGlossaryChangeDetection]的关键部件之一。

The view hierarchy does not imply a component hierarchy.
Views that are embedded in the context of a particular hierarchy can be host views of other components.
Those components can be in the same NgModule as the hosting component, or belong to other NgModules.

视图树和组件树并不是一一对应的。那些嵌入到指定视图树上下文中的视图也可能是其它组件的宿主视图。那些组件可能和宿主组件位于同一个 NgModule 中，也可能属于其它 NgModule。

<a id="web-component"></a>

## web component

## Web 组件

See [custom element][AioGuideGlossaryCustomElement].

参阅[自定义元素][AioGuideGlossaryCustomElement]

## workspace

## 工作区（workspace）

A collection of Angular [projects][AioGuideGlossaryProject] (that is, applications and libraries) powered by the Angular [CLI][AioGuideGlossaryCommandLineInterfaceCli] that are typically co-located in a single source-control repository (such as [git][GitScmMain]).

一组基于 [Angular CLI][AioGuideGlossaryCommandLineInterfaceCli] 的 Angular [项目][AioGuideGlossaryProject]（也就是说应用或库），它们通常共同位于一个单一的源码仓库（比如 [git][GitScmMain]）中。

The [`ng new`][AioCliNew] Angular [CLI][AioGuideGlossaryCommandLineInterfaceCli] command creates a file system directory (the "workspace root").
In the workspace root, it also creates the workspace [configuration file][AioGuideGlossaryConfiguration] (`angular.json`) and, by default, an initial application project with the same name.

[CLI][AioGuideGlossaryCommandLineInterfaceCli] 的 [`ng new` 命令][AioCliNew]会在文件系统中创建一个目录（也就是工作区的根目录）。
在工作区根目录下，还会创建此工作区的[配置文件][AioGuideGlossaryConfiguration]（`angular.json`），并且还会默认初始化一个同名的应用项目。

Commands that create or operate on applications and libraries (such as `add` and `generate`) must be executed from within a workspace directory.
To learn more, see [Workspace Configuration][AioGuideWorkspaceConfig].

而用来创建或操作应用和库的命令（比如 `add` 和 `generate`）必须在工作区目录下才能执行。
欲知详情，参阅[工作区配置][AioGuideWorkspaceConfig]。

## workspace configuration

## 工作区配置（workspace configuration）

A file named `angular.json` at the root level of an Angular [workspace][AioGuideGlossaryWorkspace] provides workspace-wide and project-specific configuration defaults for build and development tools that are provided by or integrated with the [Angular CLI][AioGuideGlossaryCommandLineInterfaceCli].
To learn more, see [Workspace Configuration][AioGuideWorkspaceConfig].

一个名叫 `angular.json` 的文件，它位于 Angular [工作区][AioGuideGlossaryWorkspace] 的根目录下，并为 [Angular CLI][AioGuideGlossaryCommandLineInterfaceCli] 提供的或集成的各个构建/开发工具提供工作区级和项目专属的默认配置项。
欲知详情，参阅[工作区配置][AioGuideWorkspaceConfig]。

Additional project-specific configuration files are used by tools, such as `package.json` for the [npm package manager][AioGuideGlossaryNpmPackage], `tsconfig.json` for [TypeScript transpilation][AioGuideGlossaryTranspile], and `tslint.json` for [TSLint][GithubPalantirTslint].
To learn more, see [Workspace and Project File Structure][AioGuideFileStructure].

还有一些项目专属的配置文件是给某些工具使用的。比如 `package.json` 是给 [npm 包管理器][AioGuideGlossaryNpmPackage]使用的，`tsconfig.json` 是给 [TypeScript 转译器][AioGuideGlossaryTranspile]使用的，而 `tslint.json` 是给 [TSLint][GithubPalantirTslint] 使用的。
欲知详情，参阅[工作区和项目文件结构][AioGuideFileStructure]。

## zone

## 区域 (zone)

An execution context for a set of asynchronous tasks.
Useful for debugging, profiling, and testing applications that include asynchronous operations such as event processing, promises, and runs to remote servers.

一组异步任务的执行上下文。它对于调试、性能分析和测试那些包含了异步操作（如事件处理、 Promise 、远程服务器调用等）的应用是非常有用的。

An Angular application runs in a zone where it can respond to asynchronous events by checking for data changes and updating the information it displays by resolving [data bindings][AioGuideGlossaryDataBinding].

Angular 应用会运行在一个 Zone 区域中，在这里，它可以对异步事件做出反应，可以通过检查数据变更、利用[数据绑定 (data bindings)][AioGuideGlossaryDataBinding] 来更新信息显示。

A zone client can take action before and after an async operation completes.

Zone 的使用方可以在异步操作完成之前或之后采取行动。

Learn more about zones in this [Brian Ford video][YoutubeWatchV3iqtmusceU].

在此[Brian Ford 视频][YoutubeWatchV3iqtmusceU]中了解有关区域的更多信息。

<!-- links -->

[AioApiCommonDatepipe]: api/common/DatePipe "DatePipe | @angular/common - API | Angular"

[AioApiCoreChangedetectorref]: api/core/ChangeDetectorRef "ChangeDetectorRef | @angular/core - API | Angular"

[AioApiCoreProvider]: api/core/Provider "Provider | @angular/core - API | Angular"

[AioApiPlatformBrowserBrowsermodule]: api/platform-browser/BrowserModule "BrowserModule | @angular/platform-browser - API | Angular"

[AioApiPlatformServer]: api/platform-server "@angular/platform-server | API | Angular"

[AioApiRouterResolve]: api/router/Resolve "Resolve | @angular/router - API | Angular"

[AioCliAdd]: cli/add "ng add | CLI | Angular"

[AioCliGenerate]: cli/generate "ng generate | CLI | Angular"

[AioCliGenerateApplication]: cli/generate#application "application - ng generate | CLI | Angular"

[AioCliGenerateAppShell]: cli/generate#app-shell "app-shell - ng generate | CLI | Angular"

[AioCliGenerateLibrary]: cli/generate#library "library - ng generate | CLI | Angular"

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"

[AioCliNew]: cli/new "ng new | CLI | Angular"

[AioCliRun]: cli/run "ng run | CLI | Angular"

[AioGuideAngularPackageFormat]: guide/angular-package-format "Angular Package Format | Angular"

[AioGuideAnimations]: guide/animations "Introduction to Angular animations | Angular"

[AioGuideArchitecture]: guide/architecture "Introduction to Angular concepts | Angular"

[AioGuideArchitectureServices]: guide/architecture-services "Introduction to services and dependency injection | Angular"

[AioGuideAttributeBinding]: guide/attribute-binding "Attribute binding | Angular"

[AioGuideAttributeBindingBindingToTheClassAttribute]: guide/class-binding "Class and style binding | Angular"

[AioGuideAttributeDirectives]: guide/attribute-directives "Attribute directives | Angular"

[AioGuideBootstrapping]: guide/bootstrapping "Launching your app with a root module | Angular"

[AioGuideBrowserSupport]: guide/browser-support "Browser support | Angular"

[AioGuideBuiltInDirectivesDisplayingAndUpdatingPropertiesWithNgmodel]: guide/built-in-directives#displaying-and-updating-properties-with-ngmodel "Displaying and updating properties with ngModel - Built-in directives | Angular"

[AioGuideLifecycleHooks]: guide/lifecycle-hooks "Lifecycle Hooks | Angular"

[AioGuideLifecycleHooksRespondingToProjectedContentChanges]: guide/lifecycle-hooks#responding-to-projected-content-changes "Responding to projected content changes - Lifecycle Hooks | Angular"

[AioGuideInputsOutputs]: guide/inputs-outputs "Sharing data between child and parent directives and components | Angular"

[AioGuideCreatingLibrariesIntegratingWithTheCliUsingCodeGenerationSchematics]: guide/creating-libraries#integrating-with-the-cli-using-code-generation-schematics "Integrating with the CLI using code-generation schematics - Creating libraries | Angular"

[AioGuideDependencyInjection]: guide/dependency-injection "Dependency injection in Angular | Angular"

[AioGuideElements]: guide/elements "Angular elements overview | Angular"

[AioGuideEventBinding]: guide/event-binding "Event binding | Angular"

[AioGuideForms]: guide/forms "Building a template-driven form | Angular"

[AioGuideFileStructure]: guide/file-structure "Workspace and project file structure | Angular"

[AioGuideFormsOverview]: guide/forms-overview "Introduction to forms in Angular | Angular"

[AioGuideFormValidation]: guide/form-validation "Validating form input | Angular"

[AioGuideFormValidationAddingCustomValidatorsToReactiveForms]: guide/form-validation#adding-custom-validators-to-reactive-forms "Adding custom validators to reactive forms - Validating form input | Angular"

[AioGuideFormValidationAddingCustomValidatorsToTemplateDrivenForms]: guide/form-validation#adding-custom-validators-to-template-driven-forms "Adding custom validators to template-driven forms - Validating form input | Angular"

[AioGuideGlossaryA]: guide/glossary#ahead-of-time-aot-compilation "A - Glossary | Angular"

[AioGuideGlossaryAheadOfTimeAotCompilation]: guide/glossary#ahead-of-time-aot-compilation "ahead-of-time (AOT) compilation - Glossary | Angular"

[AioGuideGlossaryAngularElement]: guide/glossary#angular-element "Angular element - Glossary | Angular"

[AioGuideGlossaryArchitect]: guide/glossary#architect "Architect - Glossary | Angular"

[AioGuideGlossaryAttributeDirective]: guide/glossary#attribute-directive "attribute directive - Glossary | Angular"

[AioGuideGlossaryB]: guide/glossary#binding "B - Glossary | Angular"

[AioGuideGlossaryBuilder]: guide/glossary#builder "builder - Glossary | Angular"

[AioGuideGlossaryC]: guide/glossary#case-types "C - Glossary | Angular"

[AioGuideGlossaryChangeDetection]: guide/glossary#change-detection " change detection - Glossary | Angular"

[AioGuideGlossaryClassDecorator]: guide/glossary#class-decorator "class decorator - Glossary | Angular"

[AioGuideGlossaryClassFieldDecorator]: guide/glossary#class-field-decorator "class field decorator - Glossary | Angular"

[AioGuideGlossaryCollection]: guide/glossary#collection "collection - Glossary | Angular"

[AioGuideGlossaryCommandLineInterfaceCli]: guide/glossary#command-line-interface-cli "command-line interface (CLI) - Glossary | Angular"

[AioGuideGlossaryComponent]: guide/glossary#component "component - Glossary | Angular"

[AioGuideGlossaryConfiguration]: guide/glossary#configuration "configuration - Glossary | Angular"

[AioGuideGlossaryCustomElement]: guide/glossary#custom-element "custom element - Glossary | Angular"

[AioGuideGlossaryD]: guide/glossary#data-binding "D - Glossary | Angular"

[AioGuideGlossaryDataBinding]: guide/glossary#data-binding "data binding - Glossary | Angular"

[AioGuideGlossaryDeclarable]: guide/glossary#declarable "declarable - Glossary | Angular"

[AioGuideGlossaryDecoratorDecoration]: guide/glossary#decorator--decoration "decorator | decoration - Glossary | Angular"

[AioGuideGlossaryDependencyInjectionDi]: guide/glossary#dependency-injection-di "dependency injection (DI) - Glossary | Angular"

[AioGuideGlossaryDirective]: guide/glossary#directive "directive - Glossary | Angular"

[AioGuideGlossaryDiToken]: guide/glossary#di-token "DI token - Glossary | Angular"

[AioGuideGlossaryDynamicComponentLoading]: guide/glossary#dynamic-component-loading "dynamic component loading - Glossary | Angular"

[AioGuideGlossaryE]: guide/glossary#eager-loading "E - Glossary | Angular"

[AioGuideGlossaryEagerLoading]: guide/glossary#eager-loading "eager loading - Glossary | Angular"

[AioGuideGlossaryEcmascript]: guide/glossary#ecmascript "ECMAScript - Glossary | Angular"

[AioGuideGlossaryF]: guide/glossary#form-control "F - Glossary | Angular"

[AioGuideGlossaryG]: guide/glossary#immutability "G - Glossary | Angular"

[AioGuideGlossaryH]: guide/glossary#immutability "H - Glossary | Angular"

[AioGuideGlossaryI]: guide/glossary#immutability "I - Glossary | Angular"

[AioGuideGlossaryInjectable]: guide/glossary#injectable "injectable - Glossary | Angular"

[AioGuideGlossaryInjector]: guide/glossary#injector "injector - Glossary | Angular"

[AioGuideGlossaryInput]: guide/glossary#input "input - Glossary | Angular"

[AioGuideGlossaryIvy]: guide/glossary#ivy "Ivy - Glossary | Angular"

[AioGuideGlossaryJ]: guide/glossary#javascript "J - Glossary | Angular"

[AioGuideGlossaryJustInTimeJitCompilation]: guide/glossary#just-in-time-jit-compilation "just-in-time (JIT) compilation - Glossary | Angular"

[AioGuideGlossaryK]: guide/glossary#lazy-loading "K - Glossary | Angular"

[AioGuideGlossaryL]: guide/glossary#lazy-loading "L - Glossary | Angular"

[AioGuideGlossaryLazyLoading]: guide/glossary#lazy-loading "lazy loading - Glossary | Angular"

[AioGuideGlossaryLibrary]: guide/glossary#library "library - Glossary | Angular"

[AioGuideGlossaryM]: guide/glossary#module "M - Glossary | Angular"

[AioGuideGlossaryModule]: guide/glossary#module "module - Glossary | Angular"

[AioGuideGlossaryN]: guide/glossary#ngcc "N - Glossary | Angular"

[AioGuideGlossaryNgmodule]: guide/glossary#ngmodule "NgModule - Glossary | Angular"

[AioGuideGlossaryNpmPackage]: guide/glossary#npm-package "npm package - Glossary | Angular"

[AioGuideGlossaryO]: guide/glossary#observable "O - Glossary | Angular"

[AioGuideGlossaryObservable]: guide/glossary#observable "observable - Glossary | Angular"

[AioGuideGlossaryObserver]: guide/glossary#observer "observer - Glossary | Angular"

[AioGuideGlossaryOutput]: guide/glossary#output "output - Glossary | Angular"

[AioGuideGlossaryP]: guide/glossary#pipe "P - Glossary | Angular"

[AioGuideGlossaryPipe]: guide/glossary#pipe "pipe - Glossary | Angular"

[AioGuideGlossaryProject]: guide/glossary#project "project - Glossary | Angular"

[AioGuideGlossaryProvider]: guide/glossary#provider "provider - Glossary | Angular"

[AioGuideGlossaryQ]: guide/glossary#reactive-forms "Q - Glossary | Angular"

[AioGuideGlossaryR]: guide/glossary#reactive-forms "R - Glossary | Angular"

[AioGuideGlossaryReactiveForms]: guide/glossary#reactive-forms "reactive forms - Glossary | Angular"

[AioGuideGlossaryRouteGuard]: guide/glossary#route-guard "route guard - Glossary | Angular"

[AioGuideGlossaryRouter]: guide/glossary#router "router - Glossary | Angular"

[AioGuideGlossaryRoutingComponent]: guide/glossary#routing-component "routing component - Glossary | Angular"

[AioGuideGlossaryRule]: guide/glossary#rule "rule - Glossary | Angular"

[AioGuideGlossaryS]: guide/glossary#schematic "S - Glossary | Angular"

[AioGuideGlossarySchematic]: guide/glossary#schematic "schematic - Glossary | Angular"

[AioGuideGlossarySchematicsCli]: guide/glossary#schematics-cli "Schematics CLI - Glossary | Angular"

[AioGuideGlossaryScopedPackage]: guide/glossary#scoped-package "scoped package - Glossary | Angular"

[AioGuideGlossaryServerSideRendering]: guide/glossary#server-side-rendering "server-side rendering - Glossary | Angular"

[AioGuideGlossaryService]: guide/glossary#service "service - Glossary | Angular"

[AioGuideGlossaryStructuralDirective]: guide/glossary#structural-directive "structural directive - Glossary | Angular"

[AioGuideGlossarySubscriber]: guide/glossary#subscriber "subscriber - Glossary | Angular"

[AioGuideGlossaryT]: guide/glossary#target "T - Glossary | Angular"

[AioGuideGlossaryTarget]: guide/glossary#target "target - Glossary | Angular"

[AioGuideGlossaryTemplate]: guide/glossary#template "template - Glossary | Angular"

[AioGuideGlossaryTemplateDrivenForms]: guide/glossary#template-driven-forms "template-driven forms - Glossary | Angular"

[AioGuideGlossaryTemplateExpression]: guide/glossary#template-expression "template expression - Glossary | Angular"

[AioGuideGlossaryToken]: guide/glossary#token "token - Glossary | Angular"

[AioGuideGlossaryTranspile]: guide/glossary#transpile "transpile - Glossary | Angular"

[AioGuideGlossaryTree]: guide/glossary#tree "tree - Glossary | Angular"

[AioGuideGlossaryTypescript]: guide/glossary#typescript "TypeScript - Glossary | Angular"

[AioGuideGlossaryU]: guide/glossary#unidirectional-data-flow "U - Glossary | Angular"

[AioGuideGlossaryUniversal]: guide/glossary#universal "Universal - Glossary | Angular"

[AioGuideGlossaryV]: guide/glossary#view "V - Glossary | Angular"

[AioGuideGlossaryView]: guide/glossary#view "view - Glossary | Angular"

[AioGuideGlossaryViewHierarchy]: guide/glossary#view-hierarchy "view hierarchy - Glossary | Angular"

[AioGuideGlossaryW]: guide/glossary#web-component "W - Glossary | Angular"

[AioGuideGlossaryWorkspace]: guide/glossary#workspace "workspace - Glossary | Angular"

[AioGuideGlossaryWorkspaceConfig]: guide/glossary#workspace-configuration "workspace configuration - Glossary | Angular"

[AioGuideGlossaryX]: guide/glossary#zone "X - Glossary | Angular"

[AioGuideGlossaryY]: guide/glossary#zone "Y - Glossary | Angular"

[AioGuideGlossaryZ]: guide/glossary#zone "Z - Glossary | Angular"

[AioGuideHierarchicalDependencyInjection]: guide/hierarchical-dependency-injection "Hierarchical injectors | Angular"

[AioGuideInterpolation]: guide/interpolation "Text interpolation | Angular"

<!-- [AioGuideInterpolationTemplateExpressions]: guide/interpolation#template-expressions "Template expressions - Text interpolation | Angular" -->

[AioGuideNgmodules]: guide/ngmodules "NgModules | Angular"

[AioGuideNpmPackages]: guide/npm-packages "Workspace npm dependencies | Angular"

[AioGuideObservables]: guide/observables "Using observables to pass values | Angular"

[AioGuidePipes]: guide/pipes "Transforming Data Using Pipes | Angular"

[AioGuidePropertyBinding]: guide/property-binding "Property binding | Angular"

[AioGuideRouter]: guide/router "Common Routing Tasks | Angular"

[AioGuideRouterPreventingUnauthorizedAccess]: guide/router#preventing-unauthorized-access "Preventing unauthorized access - Common Routing Tasks | Angular"

[AioGuideRouterTutorialTohResolvePreFetchingComponentData]: guide/router-tutorial-toh#resolve-pre-fetching-component-data "Resolve: pre-fetching component data - Router tutorial: tour of heroes | Angular"

[AioGuideSchematics]: guide/schematics "Generating code using schematics | Angular"

[AioGuideServiceWorkerIntro]: guide/service-worker-intro "Angular service worker introduction | Angular"

[AioGuideSetupLocal]: guide/setup-local "Setting up the local environment and workspace | Angular"

[AioGuideStructuralDirectives]: guide/structural-directives "Writing structural directives | Angular"

[AioGuideStyleguide0201]: guide/styleguide#02-01 "Style 02-01 - Angular coding style guide | Angular"

[AioGuideTemplateReferenceVariables]: guide/template-reference-variables "Template variables | Angular"

[AioGuideTemplateReferenceVariablesTemplateInputVariable]: guide/template-reference-variables#template-input-variable "Template input variable - Template variables | Angular"

[AioGuideTemplateSyntax]: guide/template-syntax "Template syntax | Angular"

[AioGuideTypescriptConfiguration]: guide/typescript-configuration "TypeScript configuration | Angular"

[AioGuideUniversal]: guide/universal "Server-side rendering (SSR) with Angular Universal | Angular"

[AioGuideWorkspaceConfig]: guide/workspace-config "Angular workspace configuration | Angular"

[AioGuideWorkspaceConfigProjectToolConfigurationOptions]: guide/workspace-config#project-tool-configuration-options "Project tool configuration options - Angular workspace configuration | Angular"

<!-- external links -->

[AngularBlogAPlanForVersion80AndIvyB3318dfc19f7]: https://blog.angular.io/a-plan-for-version-8-0-and-ivy-b3318dfc19f7 "A plan for version 8.0 and Ivy | Angular Blog"

[GithubAngularAngularCliTreePrimaryPackagesAngularDevkitBuildAngularSrcBuildersBrowser]: https://github.com/angular/angular-cli/tree/main/packages/angular_devkit/build_angular/src/builders/browser "packages/angular_devkit/build_angular/src/builders/browser | angular/angular-cli | GitHub"

[GithubAngularAngularCliTreePrimaryPackagesAngularDevkitBuildAngularSrcBuildersKarma]: https://github.com/angular/angular-cli/tree/main/packages/angular_devkit/build_angular/src/builders/karma "packages/angular_devkit/build_angular/src/builders/karma | angular/angular-cli | GitHub"

[GithubPalantirTslint]: https://palantir.github.io/tslint "TSLint | Palantir | GitHub"

[GithubTC39ProposalDecorators]: https://github.com/tc39/proposal-decorators "tc39/proposal-decorators | GitHub"

[GitScmMain]: https://git-scm.com "Git"

[GoogleDevelopersWebFundamentalsArchitectureAppShell]: https://developers.google.com/web/fundamentals/architecture/app-shell "The App Shell Model | Web Fundamentals | Google Developers"

[JsWebpackMain]: https://webpack.js.org "webpack | JS.ORG"

[MdnDocsWebApiCustomelementregistry]: https://developer.mozilla.org/docs/Web/API/CustomElementRegistry "CustomElementRegistry | MDN"

[NpmjsDocsAboutNpm]: https://docs.npmjs.com/about-npm "About npm | npm"

[RxjsMain]: https://rxjs.dev "RxJS"

[TypescriptlangMain]: https://www.typescriptlang.org "TypeScript"

[WebDevFasterAngularChangeDetection]: https://web.dev/faster-angular-change-detection "Optimize Angular's change detection | web.dev"

[WikipediaWikiDomainSpecificLanguage]: https://en.wikipedia.org/wiki/Domain-specific_language "Domain-specific language | Wikipedia"

[WikipediaWikiEcmascript]: https://en.wikipedia.org/wiki/ECMAScript "ECMAScript | Wikipedia"

[YoutubeWatchV3iqtmusceU]: https://www.youtube.com/watch?v=3IqtmUscE_U "Brian Ford - Zones - NG-Conf 2014 | YouTube"

<!-- end links -->

@reviewed 2022-02-28
# Creating libraries

# 创建库

This page provides a conceptual overview of how to create and publish new libraries to extend Angular functionality.

对于如何创建和发布新库，以扩展 Angular 的功能，本页面提供了一个概念性的总览

If you find that you need to solve the same problem in more than one application (or want to share your solution with other developers), you have a candidate for a library.
A simple example might be a button that sends users to your company website, that would be included in all applications that your company builds.

如果你发现自己要在多个应用中解决同样的问题（或者要把你的解决方案分享给其它开发者），你就有了一个潜在的库。简单的例子就是一个用来把用户带到你公司网站上的按钮，该按钮会包含在你公司构建的所有应用中。

## Getting started

## 快速上手

Use the Angular CLI to generate a new library skeleton in a new workspace with the following commands.

使用 Angular CLI，用以下命令在新的工作区中生成一个新库的骨架：

<code-example format="shell" language="shell">

ng new my-workspace --no-create-application
cd my-workspace
ng generate library my-lib

</code-example>

<div class="callout is-important">

<header>Naming your library</header>

<header>命名你的库</header>

You should be very careful when choosing the name of your library if you want to publish it later in a public package registry such as npm.
See [Publishing your library](guide/creating-libraries#publishing-your-library).

如果你想稍后在公共包注册表（比如 npm）中发布它，则在选择库名称时应该非常小心。参阅[发布你的库](guide/creating-libraries#publishing-your-library)。

Avoid using a name that is prefixed with `ng-`, such as `ng-library`.
The `ng-` prefix is a reserved keyword used from the Angular framework and its libraries.
The `ngx-` prefix is preferred as a convention used to denote that the library is suitable for use with Angular.
It is also an excellent indication to consumers of the registry to differentiate between libraries of different JavaScript frameworks.

避免使用以 `ng-` 为前缀的名称，比如 `ng-library`。`ng-` 前缀是 Angular 框架及其库中使用的保留关键字。首选 `ngx-` 前缀作为用于表示该库适合与 Angular 一起使用的约定。这也是注册表的使用者区分不同 JavaScript 框架库的优秀指示器。

</div>

The `ng generate` command creates the `projects/my-lib` folder in your workspace, which contains a component and a service inside an NgModule.

`ng generate` 命令会在你的工作区中创建 `projects/my-lib` 文件夹，其中包含带有一个组件和一个服务的 NgModule。

<div class="alert is-helpful">

For more details on how a library project is structured, refer to the [Library project files](guide/file-structure#library-project-files) section of the [Project File Structure guide](guide/file-structure).

要了解关于库项目的目录结构的详细信息，参阅[项目文件结构](guide/file-structure)中的[库项目文件](guide/file-structure#library-project-files)部分。

Use the monorepo model to use the same workspace for multiple projects.
See [Setting up for a multi-project workspace](guide/file-structure#multiple-projects).

可以使用单一仓库（monorepo）模式将同一个工作区用于多个项目。参阅[建立多项目型工作区](guide/file-structure#multiple-projects)。

</div>

When you generate a new library, the workspace configuration file, `angular.json`, is updated with a project of type `library`.

当你生成一个新库时，该工作区的配置文件 `angular.json` 中也增加了一个 'library' 类型的项目。

<code-example format="json">

"projects": {
  &hellip;
  "my-lib": {
    "root": "projects/my-lib",
    "sourceRoot": "projects/my-lib/src",
    "projectType": "library",
    "prefix": "lib",
    "architect": {
      "build": {
        "builder": "&commat;angular-devkit/build-angular:ng-packagr",
        &hellip;

</code-example>

Build, test, and lint the project with CLI commands:

可以使用 CLI 命令来构建、测试和 lint 这个项目：

<code-example format="shell" language="shell">

ng build my-lib --configuration development
ng test my-lib
ng lint my-lib

</code-example>

Notice that the configured builder for the project is different from the default builder for application projects.
This builder, among other things, ensures that the library is always built with the [AOT compiler](guide/aot-compiler).

注意，该项目配置的构建器与应用类项目的默认构建器不同。此构建器可以确保库永远使用 [AoT 编译器](guide/aot-compiler)构建。

To make library code reusable you must define a public API for it.
This "user layer" defines what is available to consumers of your library.
A user of your library should be able to access public functionality (such as NgModules, service providers and general utility functions) through a single import path.

要让库代码可以复用，你必须为它定义一个公共的 API。这个“用户层”定义了库中消费者的可用内容。该库的用户应该可以通过单个的导入路径来访问公共功能（如 NgModules、服务提供者和工具函数）。

The public API for your library is maintained in the `public-api.ts` file in your library folder.
Anything exported from this file is made public when your library is imported into an application.
Use an NgModule to expose services and components.

库的公共 API 是在库文件夹下的 `public-api.ts` 文件中维护的。当你的库被导入应用时，从该文件导出的所有内容都会公开。请使用 NgModule 来暴露这些服务和组件。

Your library should supply documentation (typically a README file) for installation and maintenance.

你的库里应该提供一些文档（通常是 README 文件）来指导别人安装和维护。

## Refactoring parts of an application into a library

## 把应用中的部分内容重构成一个库

To make your solution reusable, you need to adjust it so that it does not depend on application-specific code.
Here are some things to consider in migrating application functionality to a library.

为了让你的解决方案可供复用，你需要对它进行调整，以免它依赖应用特有的代码。在将应用的功能迁移到库中时，需要注意以下几点。

* Declarations such as components and pipes should be designed as stateless, meaning they don't rely on or alter external variables.
  If you do rely on state, you need to evaluate every case and decide whether it is application state or state that the library would manage.

  组件和管道之类的可声明对象应该设计成无状态的，这意味着它们不依赖或修改外部变量。如果确实依赖于状态，就需要对每种情况进行评估，以决定它是应用的状态还是库要管理的状态。

* Any observables that the components subscribe to internally should be cleaned up and disposed of during the lifecycle of those components

  组件内部订阅的所有可观察对象都应该在这些组件的生命周期内进行清理和释放

* Components should expose their interactions through inputs for providing context, and outputs for communicating events to other components

  组件对外暴露交互方式时，应该通过输入参数来提供上下文，通过输出参数来将事件传给其它组件

* Check all internal dependencies.

  检查所有内部依赖。

  * For custom classes or interfaces used in components or service, check whether they depend on additional classes or interfaces that also need to be migrated

    对于在组件或服务中使用的自定义类或接口，检查它们是否依赖于其它类或接口，它们也需要一起迁移

  * Similarly, if your library code depends on a service, that service needs to be migrated

    同样，如果你的库代码依赖于某个服务，则需要迁移该服务

  * If your library code or its templates depend on other libraries (such as Angular Material, for instance), you must configure your library with those dependencies

    如果你的库代码或其模板依赖于其它库（比如 Angular Material），你就必须把它们配置为该库的依赖

* Consider how you provide services to client applications.

  考虑如何为客户端应用提供服务。

  * Services should declare their own providers, rather than declaring providers in the NgModule or a component.
    Declaring a provider makes that service *tree-shakable*.
    This practice lets the compiler leave the service out of the bundle if it never gets injected into the application that imports the library.
    For more about this, see [Tree-shakable providers](guide/architecture-services#providing-services).

    服务应该自己声明提供者（而不是在 NgModule 或组件中声明提供者），以便它们是*可摇树优化的*。这样，如果服务器从未被注入到导入该库的应用中，编译器就会把该服务从该 bundle 中删除。关于这方面的更多信息，参阅[Tree-shakable 提供者](guide/architecture-services#providing-services)。

  * If you register global service providers or share providers across multiple NgModules, use the [`forRoot()` and `forChild()` design patterns](guide/singleton-services) provided by the [RouterModule](api/router/RouterModule)

    如果你在多个 NgModules 注册全局服务提供者或提供者共享，使用[`forRoot()` 和 `forChild()` 设计模式](guide/singleton-services)由提供[RouterModule](api/router/RouterModule) 

  * If your library provides optional services that might not be used by all client applications, support proper tree-shaking for that case by using the [lightweight token design pattern](guide/lightweight-injection-tokens)

    如果你的库中提供的可选服务可能并没有被所有的客户端应用所使用，那么就可以通过[轻量级令牌设计模式](guide/lightweight-injection-tokens)为这种情况支持正确的树状[结构了](guide/lightweight-injection-tokens) 

<a id="integrating-with-the-cli"></a>

## Integrating with the CLI using code-generation schematics

## 使用代码生成原理图与 CLI 集成

A library typically includes *reusable code* that defines components, services, and other Angular artifacts (pipes, directives) that you import into a project.
A library is packaged into an npm package for publishing and sharing.
This package can also include [schematics](guide/glossary#schematic) that provide instructions for generating or transforming code directly in your project, in the same way that the CLI creates a generic new component with `ng generate component`.
A schematic that is packaged with a library can, for example, provide the Angular CLI with the information it needs to generate a component that configures and uses a particular feature, or set of features, defined in that library.
One example of this is [Angular Material's navigation schematic](https://material.angular.io/guide/schematics#navigation-schematic) which configures the CDK's [BreakpointObserver](https://material.angular.io/cdk/layout/overview#breakpointobserver) and uses it with Material's [MatSideNav](https://material.angular.io/components/sidenav/overview) and [MatToolbar](https://material.angular.io/components/toolbar/overview) components.

一个库通常都包含*可复用的代码*，用于定义组件，服务，以及你刚才导入到项目中的其他 Angular 工件（管道，指令等等）。库被打包成一个 npm 包，用于发布和共享。这个包还可以包含一些[原理图](guide/glossary#schematic)，它提供直接在项目中生成或转换代码的指令，就像 CLI 用 `ng generate component` 创建一个通用的新 `ng generate component`。比如，用库打包的原理图可以为 Angular CLI 提供生成组件所需的信息，该组件用于配置和使用该库中定义的特定特性或一组特性。这方面的一个例子是 [Angular Material 的导航原理图](https://material.angular.cn/guide/schematics#navigation-schematic)，它用来配置 CDK 的 [`BreakpointObserver`](https://material.angular.cn/cdk/layout/overview#breakpointobserver) 并把它与 Material 的 [MatSideNav](https://material.angular.cn/components/sidenav/overview) 和 [MatToolbar](https://material.angular.cn/components/toolbar/overview) 组件一起使用。

Create and include the following kinds of schematics:

创建并包含以下几种原理图。

* Include an installation schematic so that `ng add` can add your library to a project

  包含一个安装原理图，以便 `ng add` 可以把你的库添加到项目中。

* Include generation schematics in your library so that `ng generate` can scaffold your defined artifacts (components, services, tests) in a project

  在库中包含了生成原理图，以便 `ng generate` 可以为项目中的已定义工件（组件，服务，测试等）提供支持。

* Include an update schematic so that `ng update` can update your library's dependencies and provide migrations for breaking changes in new releases

  包含一个更新的原理图，以便 `ng update` 可以更新你的库的依赖，并提供一些迁移来破坏新版本中的更改。

What you include in your library depends on your task.
For example, you could define a schematic to create a dropdown that is pre-populated with canned data to show how to add it to an application.
If you want a dropdown that would contain different passed-in values each time, your library could define a schematic to create it with a given configuration.
Developers could then use `ng generate` to configure an instance for their own application.

你的库中所包含的内容取决于你的任务。比如，你可以定义一个原理图来创建一个预先填充了固定数据的下拉列表，以展示如何把它添加到一个应用中。如果你想要一个每次包含不同传入值的下拉列表，那么你的库可以定义一个原理图来用指定的配置创建它。然后，开发人员可以使用 `ng generate` 为自己的应用配置一个实例。

Suppose you want to read a configuration file and then generate a form based on that configuration.
If that form needs additional customization by the developer who is using your library, it might work best as a schematic.
However, if the form will always be the same and not need much customization by developers, then you could create a dynamic component that takes the configuration and generates the form.
In general, the more complex the customization, the more useful the schematic approach.

假设你要读取配置文件，然后根据该配置生成表单。如果该表单需要库的用户进行额外的自定义，它可能最适合用作 schematic。但是，如果这些表单总是一样的，开发人员不需要做太多自定义工作，那么你就可以创建一个动态的组件来获取配置并生成表单。通常，自定义越复杂，schematic 方式就越有用。

For more information, see [Schematics Overview](guide/schematics) and [Schematics for Libraries](guide/schematics-for-libraries).

欲知详情，参阅 [原理图概览](guide/schematics) 和 [供库使用的原理图](guide/schematics-for-libraries)。

## Publishing your library

## 发布你的库

Use the Angular CLI and the npm package manager to build and publish your library as an npm package.

使用 Angular CLI 和 npm 包管理器来构建你的库并发布为 npm 包。

Angular CLI uses a tool called [ng-packagr](https://github.com/ng-packagr/ng-packagr/blob/master/README.md) to create packages from your compiled code that can be published to npm.
See [Building libraries with Ivy](guide/creating-libraries#ivy-libraries) for information on the distribution formats supported by `ng-packagr` and guidance on how
to choose the right format for your library.

Angular CLI 使用一个名为 [ng-packagr](https://github.com/ng-packagr/ng-packagr/blob/master/README.md) 的工具从已编译的代码中创建可以发布到 npm 的软件包。`ng-packagr` 支持的发行格式的信息以及有关如何为库选择正确格式的指南，参阅[使用 Ivy 构建库](guide/creating-libraries#ivy-libraries)。

You should always build libraries for distribution using the `production` configuration.
This ensures that generated output uses the appropriate optimizations and the correct package format for npm.

你应该总是使用 `production` 配置来构建用于分发的库。这样可以确保所生成的输出对 npm 使用了适当的优化和正确的软件包格式。

<code-example format="shell" language="shell">

ng build my-lib
cd dist/my-lib
npm publish

</code-example>

<a id="lib-assets"></a>

## Managing assets in a library

## 管理库中的资产（assets）

In your Angular library, the distributable can include additional assets like theming files, Sass mixins, or documentation (like a changelog).
For more information [copy assets into your library as part of the build](https://github.com/ng-packagr/ng-packagr/blob/master/docs/copy-assets.md) and [embed assets in component styles](https://github.com/ng-packagr/ng-packagr/blob/master/docs/embed-assets-css.md).

对于 Angular 库，可分发文件中可包含一些额外的资产，如主题文件、Sass mixins 或文档（如变更日志）。欲知详情，请参见[在构建时将资产复制到库中](https://github.com/ng-packagr/ng-packagr/blob/master/docs/copy-assets.md)和[将资产嵌入到组件样式中](https://github.com/ng-packagr/ng-packagr/blob/master/docs/embed-assets-css.md)。

<div class="alert is-important">

When including additional assets like Sass mixins or pre-compiled CSS.
You need to add these manually to the conditional ["exports"](guide/angular-package-format/#exports) in the `package.json` of the primary entrypoint.

当包含额外的资产（如 Sass mixins 或预编译的 CSS）时，你需要将这些手动添加到主入口点的 `package.json` 中的条件化 [“exports”](guide/angular-package-format/#exports) 部分。

`ng-packagr` will merge handwritten `"exports"` with the auto-generated ones, allowing for library authors to configure additional export subpaths, or custom conditions.

`ng-packagr` 会将手写的 `"exports"` 与自动生成的 `"exports"` 合并，以便让库作者配置额外的导出子路径或自定义条件。

<code-example language="json">

"exports": {
  ".": {
    "sass": "./_index.scss",
  },
  "./theming": {
    "sass": "./_theming.scss"
  },
  "./prebuilt-themes/indigo-pink.css": {
    "style": "./prebuilt-themes/indigo-pink.css"
  }
}

</code-example>

The above is an extract from the [@angular/material](https://unpkg.com/browse/@angular/material/package.json) distributable.

以上是 [@angular/material](https://unpkg.com/browse/@angular/material/package.json) 可分发文件的摘录。

</div>

## Peer dependencies

## 同级依赖

Angular libraries should list any `@angular/*` dependencies the library depends on as peer dependencies.
This ensures that when modules ask for Angular, they all get the exact same module.
If a library lists `@angular/core` in `dependencies` instead of `peerDependencies`, it might get a different Angular module instead, which would cause your application to break.

各种 Angular 库应该把自己依赖的所有 `@angular/*` 都列为同级依赖。这确保了当各个模块请求 Angular 时，都会得到完全相同的模块。如果某个库在 `dependencies` 列出 `@angular/core` 而不是用 `peerDependencies`，它可能会得到一个不同的 Angular 模块，这会破坏你的应用。

## Using your own library in applications

## 在应用中使用你自己的库

You don't have to publish your library to the npm package manager to use it the same workspace, but you do have to build it first.

如果要在同一个工作空间中使用某个库，你不必把它发布到 npm 包管理器，但你还是得先构建它。

To use your own library in an application:

要想在应用中使用你自己的库：

* Build the library.
  You cannot use a library before it is built.

  构建该库。在构建之前，无法使用库。

  <code-example format="shell" language="shell">

  ng build my-lib

  </code-example>

* In your applications, import from the library by name:

  在你的应用中，按名字从库中导入：

  <code-example format="typescript" language="typescript">

  import { myExport } from 'my-lib';

  </code-example>

### Building and rebuilding your library

### 构建和重建你的库

The build step is important if you haven't published your library as an npm package and then installed the package back into your application from npm.
For instance, if you clone your git repository and run `npm install`, your editor shows the `my-lib` imports as missing if you haven't yet built your library.

如果你没有把库发布为 npm 包，然后把它从 npm 安装到你的应用中，那么构建步骤就是必要的。比如，如果你克隆了 git 仓库并运行了 `npm install`，编辑器就会把 `my-lib` 的导入显示为缺失状态（如果你还没有构建过该库）。

<div class="alert is-helpful">

When you import something from a library in an Angular application, Angular looks for a mapping between the library name and a location on disk.
When you install a library package, the mapping is in the `node_modules` folder.
When you build your own library, it has to find the mapping in your `tsconfig` paths.

当你在 Angular 应用中从某个库导入一些东西时，Angular 就会寻找库名和磁盘上某个位置之间的映射关系。当你用 npm 包安装该库时，它就映射到 `node_modules` 目录下。当你自己构建库时，它就会在 `tsconfig` 路径中查找这个映射。

Generating a library with the Angular CLI automatically adds its path to the `tsconfig` file.
The Angular CLI uses the `tsconfig` paths to tell the build system where to find the library.

用 Angular CLI 生成库时，会自动把它的路径添加到 `tsconfig` 文件中。Angular CLI 使用 `tsconfig` 路径告诉构建系统在哪里寻找这个库。

For more information, see [Path mapping overview](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping).

欲知详情，参见[路径映射概览](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)。

</div>

If you find that changes to your library are not reflected in your application, your application is probably using an old build of the library.

如果你发现库中的更改没有反映到应用中，那么你的应用很可能正在使用这个库的旧版本。

You can rebuild your library whenever you make changes to it, but this extra step takes time.
*Incremental builds* functionality improves the library-development experience.
Every time a file is changed a partial build is performed that emits the amended files.

每当你对它进行修改时，都可以重建你的库，但这个额外的步骤需要时间。*增量构建*功能可以改善库的开发体验。每当文件发生变化时，都会执行局部构建，并修补一些文件。

Incremental builds can be run as a background process in your development environment.
To take advantage of this feature add the `--watch` flag to the build command:

增量构建可以作为开发环境中的后台进程运行。要启用这个特性，可以在构建命令中加入 `--watch` 标志：

<code-example format="shell" language="shell">

ng build my-lib --watch

</code-example>

<div class="alert is-important">

The CLI `build` command uses a different builder and invokes a different build tool for libraries than it does for applications.

CLI 的 `build` 命令为库使用与应用不同的构建器，并调用不同的构建工具。

* The build system for applications, `@angular-devkit/build-angular`, is based on `webpack`, and is included in all new Angular CLI projects

  应用的构建体系（`@angular-devkit/build-angular`）基于 `webpack`，并被包含在所有新的 Angular CLI 项目中。

* The build system for libraries is based on `ng-packagr`.
  It is only added to your dependencies when you add a library using `ng generate library my-lib`.

  库的构建体系基于 `ng-packagr`。只有在使用 `ng generate library my-lib` 添加库时，它才会添加到依赖项中。

The two build systems support different things, and even where they support the same things, they do those things differently.
This means that the TypeScript source can result in different JavaScript code in a built library than it would in a built application.

这两种构建体系支持不同的东西，即使它们支持相同的东西，它们的执行方式也不同。这意味着同一套 TypeScript 源码在生成库时生成的 JavaScript 代码可能与生成应用时生成的 JavaScript 代码也不同。

For this reason, an application that depends on a library should only use TypeScript path mappings that point to the *built library*.
TypeScript path mappings should *not* point to the library source `.ts` files.

因此，依赖于库的应用应该只使用指向*内置库*的 TypeScript 路径映射。TypeScript 的路径映射*不应该*指向库的 `.ts` 源文件。

</div>

<a id="ivy-libraries"></a>

## Publishing libraries

## 发布库

There are two distribution formats to use when publishing a library:

发布库时可以使用两种分发格式：

| Distribution formats | Details |
| :------------------- | :------ |
| 分发格式 | 详情 |
| Partial-Ivy (recommended) | Contains portable code that can be consumed by Ivy applications built with any version of Angular from v12 onwards. |
| 部分 Ivy（推荐）| 包含可移植代码，从 v12 开始，使用任何版本的 Angular 构建的 Ivy 应用都可以使用这些可移植代码。|
| Full-Ivy | Contains private Angular Ivy instructions, which are not guaranteed to work across different versions of Angular. This format requires that the library and application are built with the *exact* same version of Angular. This format is useful for environments where all library and application code is built directly from source. |
| 完全 Ivy | 包含专用的 Angular Ivy 指令，不能保证它们可在 Angular 的不同版本中使用。这种格式要求库和应用使用*完全相同*的 Angular 版本构建。这种格式对于直接从源代码构建所有库和应用代码的环境很有用。|

For publishing to npm use the partial-Ivy format as it is stable between patch versions of Angular.

对于发布到 npm 的库，请使用 partial-Ivy 格式，因为它在 Angular 的各个补丁版本之间是稳定的。

Avoid compiling libraries with full-Ivy code if you are publishing to npm because the generated Ivy instructions are not part of Angular's public API, and so might change between patch versions.

如果要发布到 npm，请避免使用完全 Ivy 的方式编译库，因为生成的 Ivy 指令不属于 Angular 公共 API 的一部分，因此在补丁版本之间可能会有所不同。

## Ensuring library version compatibility

## 确保库版本兼容性

The Angular version used to build an application should always be the same or greater than the Angular versions used to build any of its dependent libraries.
For example, if you had a library using Angular version 13, the application that depends on that library should use Angular version 13 or later.
Angular does not support using an earlier version for the application.

用于构建应用的 Angular 版本应始终与用于构建其任何依赖库的 Angular 版本相同或更大。比如，如果你有一个使用 Angular 13 版的库，则依赖于该库的应用应该使用 Angular 13 版或更高版本。Angular 不支持为该应用使用早期版本。

If you intend to publish your library to npm, compile with partial-Ivy code by setting `"compilationMode": "partial"` in `tsconfig.prod.json`.
This partial format is stable between different versions of Angular, so is safe to publish to npm.
Code with this format is processed during the application build using the same version of the Angular compiler, ensuring that the application and all of its libraries use a single version of Angular.

如果打算将库发布到 npm，请通过在 `tsconfig.prod.json` 的 `"compilationMode": "partial"` 来使用部分 Ivy 代码进行编译。这种部分格式在不同版本的 Angular 之间是稳定的，因此可以安全地发布到 npm。这种格式的代码在应用程序构建期间会使用相同版本的 Angular 编译器进行处理，以确保应用程序及其所有库使用的是同一个版本的 Angular。

Avoid compiling libraries with full-Ivy code if you are publishing to npm because the generated Ivy instructions are not part of Angular's public API, and so might change between patch versions.

如果要发布到 npm，请避免使用完全 Ivy 代码来编译库，因为生成的 Ivy 指令不属于 Angular 公共 API 的一部分，因此在补丁版本之间可能会有所不同。

If you've never published a package in npm before, you must create a user account.
Read more in [Publishing npm Packages](https://docs.npmjs.com/getting-started/publishing-npm-packages).

如果你以前从未在 npm 中发布过软件包，则必须创建一个用户帐户。在[发布 npm 程序包](https://docs.npmjs.com/getting-started/publishing-npm-packages)中了解更多信息。

## Consuming partial-Ivy code outside the Angular CLI

## 在 Angular CLI 之外使用部分 Ivy 代码

An application installs many Angular libraries from npm into its `node_modules` directory.
However, the code in these libraries cannot be bundled directly along with the built application as it is not fully compiled.
To finish compilation, use the Angular linker.

应用将 npm 中的许多 Angular 库安装到其 `node_modules` 目录中。但是，这些库中的代码不能与已编译的应用直接捆绑在一起，因为它尚未完全编译。要完成编译，可以使用 Angular 链接器。

For applications that don't use the Angular CLI, the linker is available as a [Babel](https://babeljs.io) plugin.
The plugin is to be imported from `@angular/compiler-cli/linker/babel`.

对于不使用 Angular CLI 的应用程序，此链接器可用作 [Babel](https://babeljs.io) 插件。该插件要从 `@angular/compiler-cli/linker/babel` 导入。

The Angular linker Babel plugin supports build caching, meaning that libraries only need to be processed by the linker a single time, regardless of other npm operations.

Angular 链接器的 Babel 插件支持构建缓存，这意味着链接器只需一次处理库，而与其他 npm 操作无关。

Example of integrating the plugin into a custom [Webpack](https://webpack.js.org) build by registering the linker as a [Babel](https://babeljs.io) plugin using [babel-loader](https://webpack.js.org/loaders/babel-loader/#options).

下面的例子借助 [babel-loader](https://webpack.js.org/loaders/babel-loader/#options) 把此链接器注册为 [Babel](https://babeljs.io) 插件，从而将此插件集成到自定义 [Webpack](https://webpack.js.org) 构建中。

<code-example header="webpack.config.mjs" path="angular-linker-plugin/webpack.config.mjs" region="webpack-config"></code-example>

<div class="alert is-helpful">

The Angular CLI integrates the linker plugin automatically, so if consumers of your library are using the CLI, they can install Ivy-native libraries from npm without any additional configuration.

Angular CLI 自动集成了链接器插件，因此，如果你这个库的使用方也在使用 CLI，则他们可以从 npm 安装 Ivy 原生库，而无需任何其他配置。

</div>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
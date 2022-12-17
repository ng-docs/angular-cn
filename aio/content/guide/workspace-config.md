# Angular workspace configuration

# Angular 工作区配置

The `angular.json` file at the root level of an Angular [workspace](guide/glossary#workspace) provides workspace-wide and project-specific configuration defaults. These are used for build and development tools provided by the Angular CLI.
Path values given in the configuration are relative to the root workspace directory.

Angular [工作区](guide/glossary#workspace)根目录下的 `angular.json` 文件提供了全工作区级的配置和具体项目的默认配置，供 Angular CLI 中的构建工具和开发工具使用。此配置中所提供的路径值都是相对于工作区根目录的。

## General JSON structure

## JSON 的总体结构

At the top-level of `angular.json`, a few properties configure the workspace and a `projects` section contains the remaining per-project configuration options.
You can override Angular CLI defaults set at the workspace level through defaults set at the project level.
You can also override defaults set at the project level using the command line.

在 `angular.json` 的顶层，一些属性用于配置工作区，其中的 `projects` 区则包含其余的针对每个项目的配置项。CLI 在工作区级的默认设置可以被项目级的设置所覆盖，而项目级的设置可以被命令行中的设置所覆盖。

The following properties, at the top-level of the file, configure the workspace.

下列属性位于文件的顶层，用于配置工作区。

| Properties | Details |
| :--------- | :------ |
| 属性 | 详情 |
| `version` | The configuration-file version. |
| `version` | 该配置文件的版本 |
| `newProjectRoot` | Path where new projects are created. Absolute or relative to the workspace directory. |
| `newProjectRoot` | 用来创建新工程的位置。绝对路径或相对于工作区目录的路径。 |
| `cli` | A set of options that customize the [Angular CLI](cli). See the [CLI configuration options](#cli-configuration-options) section. |
| `cli` | 一组用于自定义 [Angular CLI](cli) 的选项。参见 [Angular CLI 配置选项](#cli-configuration-options)部分。 |
| `schematics` | A set of [schematics](guide/glossary#schematic) that customize the `ng generate` sub-command option defaults for this workspace. See the [Generation schematics](#schematics) section. |
| `schematics` | 一组[原理图](guide/glossary#schematic)，用于定制 `ng generate` 子命令在本工作区中的默认选项。参阅[生成器原理图](#schematics)。 |
| `projects` | Contains a subsection for each library or application in the workspace, with the per-project configuration options. |
| `projects` | 对于工作区中的每个应用或库都会包含一个子分区，子分区中是每个项目的配置项。 |

The initial application that you create with `ng new app_name` is listed under "projects":

你通过 `ng new app_name` 命令创建的初始应用会列在 `projects` 目录下：

<code-example language="json">

"projects": {
  "app_name": {
    &hellip;
  }
  &hellip;
}

</code-example>

When you create a library project with `ng generate library`, the library project is also added to the `projects` section.

当你使用 `ng generate library` 创建库项目时，库项目也会添加到 `projects` 节。

<div class="alert is-helpful">

**NOTE**: <br />
The `projects` section of the configuration file does not correspond exactly to the workspace file structure.

**注意**：<br />
配置文件的 `projects` 节与工作区的文件结构并不完全对应。

* The initial application created by `ng new` is at the top level of the workspace file structure

  `ng new` 创建的这个初始应用位于工作区文件结构的顶层

* Other applications and libraries go into a `projects` directory in the workspace

  其它应用和库位于工作区的 `projects` 文件夹中

For more information, see [Workspace and project file structure](guide/file-structure).

欲知详情，参阅[工作区和项目文件结构](guide/file-structure)。

</div>

<a id="cli-configuration-options"></a>

## Angular CLI configuration options

## Angular CLI 配置选项

The following configuration properties are a set of options that customize the Angular CLI.

下列配置属性是 Angular CLI 的一组自定义选项。

| Property | Details | Value type |
| :------- | :------ | :--------- |
| 属性 | 详情 | 值的类型 |
| `analytics` | Share anonymous [usage data](cli/analytics) with the Angular Team. | `boolean` &verbar; `ci` |
| `analytics` | 与 Angular 团队共享匿名[使用数据](cli/analytics)。 | `boolean` &verbar; `ci` |
| `cache` | Control [persistent disk cache](cli/cache) used by [Angular CLI Builders](guide/cli-builder). | [Cache options](#cache-options) |
| `cache` | 控制 [Angular CLI 构建器](guide/cli-builder)使用的[持久化磁盘缓存](cli/cache)。 | [缓存选项](#cache-options) |
| `schematicCollections` | A list of default schematics collections to use. | `string[]` |
| `schematicCollections` | 要使用的默认原理图集的列表。 | `string[]` |
| `packageManager` | The preferred package manager tool to use. | `npm` &verbar; `cnpm` &verbar; `pnpm` &verbar;`yarn` |
| `packageManager` | 要使用的首选包管理器工具。 | `npm` &verbar; `cnpm` &verbar; `pnpm` &verbar;`yarn` |
| `warnings` | Control Angular CLI specific console warnings. | [Warnings options](#warnings-options) |
| `warnings` | 控制 Angular CLI 特定的控制台警告。 | [警告选项](#warnings-options) |

### Cache options

### 缓存选项

| Property | Details | Value type | Default value |
| :------- | :------ | :--------- | :------------ |
| 属性 | 详情 | 值的类型 | 默认值 |
| `enabled` | Configure whether disk caching is enabled. | `boolean` | `true` |
| `enabled` | 配置是否启用磁盘缓存。 | `boolean` | `true` |
| `environment` | Configure in which environment disk cache is enabled. | `local` &verbar; `ci` &verbar; `all` | `local` |
| `environment` | 配置在哪个环境中启用磁盘缓存。 | `local` &verbar; `ci` &verbar; `all` | `local` |
| `path` | The directory used to stored cache results. | `string` | `.angular/cache` |
| `path` | 用于存储缓存结果的目录。 | `string` | `.angular/cache` |

### Warnings options

### 警告选项

| Property | Details | Value type | Default value |
| :------- | :------ | :--------- | :------------ |
| 属性 | 详情 | 值的类型 | 默认值 |
| `versionMismatch` | Show a warning when the global Angular CLI version is newer than the local one. | `boolean` | `true` |
| `versionMismatch` | 当全局 Angular CLI 版本比本地版本更新时显示警告。 | `boolean` | `true` |

## Project configuration options

## 项目配置选项

The following top-level configuration properties are available for each project, under `projects:<project_name>`.

每个项目的 `projects:<project_name>` 下都有以下顶层配置属性。

<code-example language="json">

"my-app": {
  "root": "",
  "sourceRoot": "src",
  "projectType": "application",
  "prefix": "app",
  "schematics": {},
  "architect": {}
}

</code-example>

| Property | Details |
| :------- | :------ |
| 属性 | 详情 |
| `root` | The root directory for this project's files, relative to the workspace directory. Empty for the initial application, which resides at the top level of the workspace. |
| `root` | 该项目的根文件夹，相对于工作区文件夹的路径。初始应用的值为空，因为它位于工作区的顶层。 |
| `sourceRoot` | The root directory for this project's source files. |
| `sourceRoot` | 该项目源文件的根文件夹。 |
| `projectType` | One of "application" or "library" An application can run independently in a browser, while a library cannot. |
| `projectType` | "application" 或 "library" 之一。应用可以在浏览器中独立运行，而库则不行。 |
| `prefix` | A string that Angular prepends to created selectors. Can be customized to identify an application or feature area. |
| `prefix` | Angular 所生成的选择器的前缀字符串。可以自定义它，以作为应用或功能区的标识。 |
| `schematics` | A set of schematics that customize the `ng generate` sub-command option defaults for this project. See the [Generation schematics](#schematics) section. |
| `schematics` | 一组原理图（schematic），它可以为该项目自定义 `ng generate` 子命令的默认选项。参见[生成原理图](#schematics)部分。 |
| `architect` | Configuration defaults for Architect builder targets for this project. |
| `architect` | 为本项目的各个构建器目标配置默认值。 |

<a id="schematics"></a>

## Generation schematics

## 生成（Generation）原理图

Angular generation [schematics](guide/glossary#schematic) are instructions for modifying a project by adding files or modifying existing files.
Individual schematics for the default Angular CLI `ng generate` sub-commands are collected in the package `@schematics/angular`.
Specify the schematic name for a subcommand in the format `schematic-package:schematic-name`;
for example, the schematic for generating a component is `@schematics/angular:component`.

Angular 生成器的[原理图](guide/glossary#schematic)是一组用来修改项目的指南，包括添加新文件或修改现有文件。默认情况下，Angular CLI 的 `ng generate` 子命令会从 `@schematics/angular` 包中收集原理图。可以用 `schematic-package:schematic-name` 格式来为子命令指定原理图名称；比如，用来生成组件的原理图名叫 `@schematics/angular:component`。

The JSON schemas for the default schematics used by the Angular CLI to create projects and parts of projects are collected in the package [`@schematics/angular`](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/application/schema.json).
The schema describes the options available to the Angular CLI for each of the `ng generate` sub-commands, as shown in the `--help` output.

供 Angular CLI 生成项目及其部件的默认原理图的 JSON 模式（schema）位于 [`@schematics/angular`](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/application/schema.json) 包中。
这个模式描述了 Angular CLI `ng generate` 子命令的每个选项，它们会显示在 `--help` 的输出中。

The fields given in the schema correspond to the allowed argument values and defaults for the Angular CLI sub-command options.
You can update your workspace schema file to set a different default for a sub-command option.

这个模式中的每个字段都对应于 Angular CLI 子命令选项的参数取值范围和默认值。你可以修改此命名空间的模式文件，来为某个子命令选项指定另外的默认值。

<a id="architect"></a>

## Project tool configuration options

## 项目工具的配置选项

Architect is the tool that the Angular CLI uses to perform complex tasks, such as compilation and test running.
Architect is a shell that runs a specified [builder](guide/glossary#builder) to perform a given task, according to a [target](guide/glossary#target) configuration.
You can define and configure new builders and targets to extend the Angular CLI.
See [Angular CLI Builders](guide/cli-builder).

建筑师（Architect）是 Angular CLI 用来执行复杂任务（比如编译和测试运行）的工具。Architect 是一个根据[目标](guide/glossary#target)配置运行指定的[构建器](guide/glossary#builder)以完成指定任务的外壳。你可以定义和配置新的构建器和目标以扩展 Angular CLI。请参阅 [Angular CLI 构建器](guide/cli-builder)。

<a id="default-build-targets"></a>

### Default Architect builders and targets

### 默认的建筑师构建器和目标

Angular defines default builders for use with specific commands, or with the general `ng run` command.
The JSON schemas that define the options and defaults for each of these default builders are collected in the [`@angular-devkit/build-angular`](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/builders.json) package.
The schemas configure options for the following builders.

Angular 定义了用于特定命令或常规 `ng run` 命令的默认构建器。为每个默认构建器定义选项和默认值的 JSON 模式收集在 [`@angular-devkit/build-angular`](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/builders.json) 包中。这些架构为以下构建器配置选项。

<!-- vale Angular.Google_WordListWarnings = NO -->

* [app-shell](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/src/builders/app-shell/schema.json)

  [应用程序外壳](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/src/builders/app-shell/schema.json)

* [browser](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/src/builders/browser/schema.json)

  [浏览器](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/src/builders/browser/schema.json)

* [dev-server](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/src/builders/dev-server/schema.json)

  [开发服务器](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/src/builders/dev-server/schema.json)

* [extract-i18n](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/src/builders/extract-i18n/schema.json)

  [提取-i18n](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/src/builders/extract-i18n/schema.json)

* [karma](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/src/builders/karma/schema.json)

  [业力](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/src/builders/karma/schema.json)

* [server](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/src/builders/server/schema.json)

  [服务器](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/src/builders/server/schema.json)

<!-- vale Angular.Google_WordListWarnings = YES -->

### Configuring builder targets

### 配置构建器目标

The `architect` section of `angular.json` contains a set of Architect targets.
Many of the targets correspond to the Angular CLI commands that run them.
Some extra predefined targets can be run using the `ng run` command, and you can define your own targets.

`angular.json` 的 `architect` 部分包含一组建筑目标。很多目标都对应于运行它们的 Angular CLI 命令。使用 `ng run` 命令可以运行一些额外的预定义目标，并可以定义自己的目标。

Each target object specifies the `builder` for that target, which is the npm package for the tool that Architect runs.
Each target also has an `options` section that configures default options for the target, and a `configurations` section that names and specifies alternative configurations for the target.
See the example in [Build target](#build-target) below.

每个目标对象都指定了该目标的 `builder`，它是建筑师所运行工具的 npm 包。此外，每个目标都有一个 `options` 部分，用于配置该目标的默认选项，`configurations` 部分可以为目标命名并指定备用配置。参阅稍后的[构建目标](#build-target)部分的例子。

<code-example language="json">

"architect": {
  "build": {},
  "serve": {},
  "e2e" : {},
  "test": {},
  "lint": {},
  "extract-i18n": {},
  "server": {},
  "app-shell": {}
}

</code-example>

| Sections | Details |
| :------- | :------ |
| 节 | 详情 |
| `architect/build` | Configures defaults for options of the `ng build` command. See the [Build target](#build-target) section for more information. |
| `architect/build` | 会为 `ng build` 命令的选项配置默认值。更多信息，参阅[构建目标](#build-target)部分。 |
| `architect/serve` | Overrides build defaults and supplies extra serve defaults for the `ng serve` command. Besides the options available for the `ng build` command, it adds options related to serving the application. |
| `architect/serve` | 覆盖构建默认值，并为 `ng serve` 命令提供额外的服务器默认值。除了 `ng build` 命令的可用选项之外，还增加了与开发服务器有关的选项。 |
| `architect/e2e` | Overrides build-option defaults for building end-to-end testing applications using the `ng e2e` command. |
| `architect/e2e` | 覆盖了构建选项默认值，以便用 `ng e2e` 命令构建端到端测试应用。 |
| `architect/test` | Overrides build-option defaults for test builds and supplies extra test-running defaults for the `ng test` command. |
| `architect/test` | 覆盖测试时的构建选项默认值，并为 `ng test` 命令提供额外的默认值以供运行测试。 |
| `architect/lint` | Configures defaults for options of the `ng lint` command, which performs code analysis on project source files. |
| `architect/lint` | 为 `ng lint` 命令配置了默认值选项，`ng lint` 用于对项目源文件进行代码分析。 |
| `architect/extract-i18n` | Configures defaults for options of the `ng extract-i18n` command, which extracts marked message strings from source code and outputs translation files. |
| `architect/extract-i18n` | 为 `ng extract-i18n` 命令的选项配置了默认值，该命令用于从源代码中提取带标记的消息串，并输出翻译文件。 |
| `architect/server` | Configures defaults for creating a Universal application with server-side rendering, using the `ng run <project>:server` command. |
| `architect/server` | 用于为使用 `ng run <project>:server` 命令创建带服务器端渲染的 Universal 应用配置默认值。 |
| `architect/app-shell` | Configures defaults for creating an application shell for a progressive web application (PWA), using the `ng run <project>:app-shell` command. |
| `architect/app-shell` | 配置了使用 `ng run <project>:app-shell` 命令为渐进式 Web 应用（PWA）配置创建应用外壳时的默认值。 |

In general, the options for which you can configure defaults correspond to the command options listed in the [Angular CLI reference page](cli) for each command.

一般来说，可以为 [Angular CLI 参考手册中](cli)列出的每个命令配置相应的默认值。

<div class="alert is-helpful">

**NOTE**: <br />
All options in the configuration file must use [camelCase](guide/glossary#case-conventions), rather than dash-case.

**注意**：<br />
配置文件中的所有选项都必须使用 [camelCase](guide/glossary#case-conventions)，而不是 dash-case。

</div>

<a id="build-target"></a>

## Build target

## 构建目标

The `architect/build` section configures defaults for options of the `ng build` command.
It has the following top-level properties.

`architect/build` 节会为 `ng build` 命令的选项配置默认值。它具有下列顶层属性。

| PROPERTY | Details |
| :------- | :------ |
| 属性 | 详情 |
| `builder` | The npm package for the build tool used to create this target. The default builder for an application (`ng build myApp`) is `@angular-devkit/build-angular:browser`, which uses the [webpack](https://webpack.js.org) package bundler. <div class="alert is-helpful"> **NOTE**: A different builder is used for building a library (`ng build myLib`). </div> |
| `builder` | 用于构建此目标的构建工具的 npm 包。默认为 `@angular-devkit/build-angular:browser`，它使用的是 [webpack](https://webpack.js.org) 打包器。<div class="alert is-helpful">**注意**：当构建库（`ng build myLib`）时使用了不同的构建器。</div> |
| `options` | This section contains default build target options, used when no named alternative configuration is specified. See the [Default build targets](#default-build-targets) section. |
| `options` | 本节包含构建选项的默认值，当没有指定命名的备用配置时使用。参阅[默认构建选项](#default-build-targets)。 |
| `configurations` | This section defines and names alternative configurations for different intended destinations. It contains a section for each named configuration, which sets the default options for that intended environment. See the [Alternate build configurations](#build-configs) section. |
| `configurations` | 本节定义并命名针对不同目标的备用配置。它为每个命名配置都包含一节，用于设置该目标环境的默认选项。参阅[备用的构建配置](#build-configs)。 |

<a id="build-configs"></a>

### Alternate build configurations

### 备用的构建配置

Angular CLI comes with two build configurations: `production` and `development`.
By default, the `ng build` command uses the `production` configuration, which applies several build optimizations, including:

Angular CLI 具有两种构建配置：`production` 和 `development`。默认情况下，`ng build` 命令使用 `production` 配置，该配置将应用许多构建优化，包括：

* Bundling files

  打包文件

* Minimizing excess whitespace

  最小化多余的空白

* Removing comments and dead code

  删除注释和无效代码

* Rewriting code to use short, mangled names, also known as minification

  重写代码，以使用简短、混乱的名称，也叫最小化

You can define and name extra alternate configurations (such as `stage`, for instance) appropriate to your development process.
Some examples of different build configurations are `stable`, `archive`, and `next` used by Angular.io itself, and the individual locale-specific configurations required for building localized versions of an application.
For details, see [Internationalization (i18n)][AioGuideI18nCommonMerge].

你可以定义和命名适用于你的开发过程的其它备用配置（比如 `stage`）。其它构建配置的一些例子是 AIO 自己使用的 `stable`、`archive`、`next`，以及构建本地化版本应用所需的各个与区域有关的配置置。欲知详情，参阅[国际化（i18n）][AioGuideI18nCommonMerge]。

You can select an alternate configuration by passing its name to the `--configuration` command line flag.

你可以通过将它们的名称传给 `--configuration` 命令行标志来选择替代配置。

You can also pass in more than one configuration name as a comma-separated list.
For example, to apply both `stage` and `fr` build configurations, use the command `ng build --configuration stage,fr`.
In this case, the command parses the named configurations from left to right.
If multiple configurations change the same setting, the last-set value is the final one.
In this example, if both `stage` and `fr` configurations set the output path the value in `fr` would get used.

你还可以用逗号分隔的列表传入多个配置名称。比如，要同时应用 `stage` 和 `fr` 构建配置，请使用命令 `ng build --configuration stage,fr`。在这种情况下，该命令从左到右解析命名的配置。如果多个配置更改了同一个设置，则最后设置的值生效。所以，在这个例子中，如果同时配置了 `stage` 和 `fr`，则会使用 `fr` 中设置的输出路径的值。

<a id="build-props"></a>

### Extra build and test options

### 额外的构建和测试选项

The configurable options for a default or targeted build generally correspond to the options available for the [`ng build`](cli/build), [`ng serve`](cli/serve), and [`ng test`](cli/test) commands.
For details of those options and their possible values, see the [Angular CLI Reference](cli).

[`ng build`](cli/build)、[`ng serve`](cli/serve) 和 [`ng test`](cli/test) 命令的可配置选项通常与 [`ng build`](cli/build)、[`ng serve`](cli/serve) 和 [`ng test`](cli/test) 命令的可用选项一一对应。关于这些选项及其取值范围的更多信息，参阅“ [CLI 参考手册”](cli)。

Some extra options can only be set through the configuration file, either by direct editing or with the [`ng config`](cli/config) command.

一些额外的选项（如下所列）只能通过配置文件来设置，可以直接编辑，也可以使用 [`ng config`](cli/config) 命令。

| Options properties | Details |
| :----------------- | :------ |
| 选项属性 | 详情 |
| `assets` | An object containing paths to static assets to add to the global context of the project. The default paths point to the project's icon file and its `assets` directory. See more in the [Assets configuration](#asset-config) section. |
| `assets` | 一个对象，包含一些用于添加到项目的全局上下文中的静态文件路径。它的默认路径指向项目的图标文件及项目的 `assets` 文件夹。参阅[项目资产（asset）配置](#asset-config)部分。 |
| `styles` | An array of style files to add to the global context of the project. Angular CLI supports CSS imports and all major CSS preprocessors: [sass/scss](https://sass-lang.com) and [less](http://lesscss.org). See more in the [Styles and scripts configuration](#style-script-config) section. |
| `styles` | 一个对象，包含一些要添加到项目全局上下文中的样式文件。Angular CLI 支持 CSS 导入和所有主要的 CSS 预处理器：[sass/scss](http://sass-lang.com) 和 [less](http://lesscss.org/)。参阅 [样式和脚本配置](#style-script-config)部分。 |
| `stylePreprocessorOptions` | An object containing option-value pairs to pass to style preprocessors. See more in the [Styles and scripts configuration](#style-script-config) section. |
| `stylePreprocessorOptions` | 一个对象，包含要传给样式预处理器的选项"值-对"。参阅 [样式和脚本配置](#style-script-config) 部分。 |
| `scripts` | An object containing JavaScript script files to add to the global context of the project. The scripts are loaded exactly as if you had added them in a `<script>` tag inside `index.html`. See more in the [Styles and scripts configuration](#style-script-config) section. |
| `scripts` | 一个对象，包含一些 JavaScript 脚本文件，用于添加到项目的全局上下文中。这些脚本的加载方式和在 `index.html` 的 `<script>` 标签中添加是完全一样的。参阅 [样式和脚本配置](#style-script-config) 部分。 |
| `budgets` | Default size-budget type and thresholds for all or parts of your application. You can configure the builder to report a warning or an error when the output reaches or exceeds a threshold size. See [Configure size budgets](guide/build#configure-size-budgets). (Not available in `test` section.) |
| `budgets` | 全部或部分应用的默认尺寸预算的类型和阈值。当构建的输出达到或超过阈值大小时，你可以将构建器配置为报告警告或错误。参阅[配置尺寸预算](guide/build#configure-size-budgets)。（不适用于 `test` 部分。） |
| `fileReplacements` | An object containing files and their compile-time replacements. See more in [Configure target-specific file replacements](guide/build#configure-target-specific-file-replacements). |
| `fileReplacements` | 一个对象，包含一些文件及其编译时替代品。参阅[为指定的目标配置文件替换规则](guide/build#configure-target-specific-file-replacements) 部分。 |

<a id="complex-config"></a>

## Complex configuration values

## 复杂配置的值

The `assets`, `styles`, and `scripts` options can have either simple path string values, or object values with specific fields.
The `sourceMap` and `optimization` options can be set to a simple Boolean value with a command flag. They can also be given a complex value using the configuration file.
The following sections provide more details of how these complex values are used in each case.

选项 `assets`，`styles` 和 `scripts` 的值可以是简单的路径字符串，也可以是带有特定字段的对象值。可以使用命令标志将 `sourceMap` 和 `optimization` 选项设置为简单的布尔值，但也可以使用配置文件为其指定复杂的值。以下各节提供了在每种情况下如何使用这些复数值的详细信息。

<a id="asset-config"></a>

### Assets configuration

### 项目资产（asset）配置

Each `build` target configuration can include an `assets` array that lists files or folders you want to copy as-is when building your project.
By default, the `src/assets/` directory and `src/favicon.ico` are copied over.

每个 `build` 目标配置都可以包含一个 `assets` 数组，它列出了当你构建项目时要复制的文件或文件夹。默认情况下，会复制 `src/assets/` 文件夹和 `src/favicon.ico`。

<code-example language="json">

"assets": [
  "src/assets",
  "src/favicon.ico"
]

</code-example>

<!-- vale off -->

To exclude an asset, you can remove it from the assets configuration.

要排除某个资产，可以从这份资产配置中删除它。

You can further configure assets to be copied by specifying assets as objects, rather than as simple paths relative to the workspace root.
An asset specification object can have the following fields.

你可以通过把资产指定为对象的形式来进一步配置要复制的资产，而不仅是相对于工作区根目录的路径。一个资产对象可以包含如下字段。

| Fields | Details |
| :----- | :------ |
| 字段 | 详情 |
| `glob` | A [node-glob](https://github.com/isaacs/node-glob/blob/master/README.md) using `input` as base directory. |
| `glob` | 一个 [node-glob](https://github.com/isaacs/node-glob/blob/master/README.md) 它使用 `input` 作为基准目录。 |
| `input` | A path relative to the workspace root. |
| `input` | 相对于工作区根目录的路径。 |
| `output` | A path relative to `outDir` (default is `dist/project-name`). Because of the security implications, the Angular CLI never writes files outside of the project output path. |
| `output` | 相对于 `outDir` 的路径（默认为 `dist/project-name`）。为了杜绝安全隐患，Angular CLI 永远不会在项目输出路径之外写文件。 |
| `ignore` | A list of globs to exclude. |
| `ignore` | 要排除的 glob 列表。 |
| `followSymlinks` | Allow glob patterns to follow symlink directories. This allows subdirectories of the symlink to be searched. Defaults to `false`. |
| `followSymlinks` | 允许这些 glob 模式跟踪目录的符号链接。这样会允许搜索符号链接过来的子目录。默认为 `false`。 |

For example, the default asset paths can be represented in more detail using the following objects.

比如，可以使用如下对象来更详细地表达默认的资产路径。

<!-- vale on -->

<code-example language="json">

"assets": [
  {
    "glob": "**/*",
    "input": "src/assets/",
    "output": "/assets/"
  },
  {
    "glob": "favicon.ico",
    "input": "src/",
    "output": "/"
  }
]

</code-example>

You can use this extended configuration to copy assets from outside your project.
For example, the following configuration copies assets from a node package:

你可以使用此扩展配置从项目外部复制资产。比如，以下配置会从 node 包中复制资产：

<code-example language="json">

"assets": [
  {
    "glob": "**/*",
    "input": "./node_modules/some-package/images",
    "output": "/some-package/"
  }
]

</code-example>

<!-- vale Angular.Google_Will = NO -->

The contents of `node_modules/some-package/images/` will be available in `dist/some-package/`.

`node_modules/some-package/images/` 中的内容将会复制到 `dist/some-package/` 中。

<!-- vale Angular.Google_Will = YES -->

The following example uses the `ignore` field to exclude certain files in the assets directory from being copied into the build:

下面的例子使用 `ignore` 字段排除了 assets 文件夹中的某些特定文件，防止它们被复制到 build 中：

<code-example language="json">

"assets": [
  {
    "glob": "**/*",
    "input": "src/assets/",
    "ignore": ["**/*.svg"],
    "output": "/assets/"
  }
]

</code-example>

<a id="style-script-config"></a>

### Styles and scripts configuration

### 样式和脚本配置

An array entry for the `styles` and `scripts` options can be a simple path string, or an object that points to an extra entry-point file.
The associated builder loads that file and its dependencies as a separate bundle during the build.
With a configuration object, you have the option of naming the bundle for the entry point, using a `bundleName` field.

`styles` 和 `scripts` 选项的数组型条目可以是简单的路径字符串，也可以是指向额外入口点文件的对象。其关联的构建器将在构建过程中将该文件及其依赖项作为单独的捆绑包进行加载。对于配置对象，你可以选择使用 `bundleName` 字段为该入口点命名捆绑包。

The bundle is injected by default, but you can set `inject` to `false` to exclude the bundle from injection.
For example, the following object values create and name a bundle that contains styles and scripts, and excludes it from injection:

默认情况下捆绑包会被注入这里，但是你可以将 `inject` 设置为 false，以将捆绑包从注入中排除。比如，以下对象值将创建并命名包含样式和脚本的包，并将其从注入中排除：

<code-example language="json">

"styles": [
  {
    "input": "src/external-module/styles.scss",
    "inject": false,
    "bundleName": "external-module"
  }
],
"scripts": [
  {
    "input": "src/external-module/main.js",
    "inject": false,
    "bundleName": "external-module"
  }
]

</code-example>

You can mix simple and complex file references for styles and scripts.

你可以混合使用简单和复杂的文件引用来获取样式和脚本。

<code-example language="json">

"styles": [
  "src/styles.css",
  "src/more-styles.css",
  { "input": "src/lazy-style.scss", "inject": false },
  { "input": "src/pre-rename-style.scss", "bundleName": "renamed-style" },
]

</code-example>

<a id="style-preprocessor"></a>

#### Style preprocessor options

#### 样式预处理器选项

In Sass you can make use of the `includePaths` feature for both component and global styles. This allows you to add extra base paths that are checked for imports.

在 Sass 中，你可以同时使用组件样式和全局样式的 `includePaths` 功能，从而可以添加将用来检查导入的额外基本路径。

To add paths, use the `stylePreprocessorOptions` option:

要添加路径，请使用 `stylePreprocessorOptions` 选项：

<code-example language="json">

"stylePreprocessorOptions": {
  "includePaths": [
    "src/style-paths"
  ]
}

</code-example>

Files in that directory, such as `src/style-paths/_variables.scss`, can be imported from anywhere in your project without the need for a relative path:

该文件夹中的文件，比如 `src/style-paths/_variables.scss`，可以从项目中的任何位置导入，而无需相对路径：

<code-example language="typescript">

// src/app/app.component.scss
// A relative path works
&commat;import '../style-paths/variables';
// But now this works as well
&commat;import 'variables';

</code-example>

<div class="alert is-helpful">

**NOTE**: <br />
You also need to add any styles or scripts to the `test` builder if you need them for unit tests.
See also [Using runtime-global libraries inside your application](guide/using-libraries#using-runtime-global-libraries-inside-your-app).

**注意**：<br />
如果要将其用于单元测试，则还需要向 `test` 构建器中添加某些样式或脚本。另请参阅[在应用程序内部使用运行时全局库](guide/using-libraries#using-runtime-global-libraries-inside-your-app)。

</div>

### Optimization configuration

### 优化配置

The `optimization` browser builder option can be either a Boolean or an Object for more fine-tune configuration.
This option enables various optimizations of the build output, including:

`optimization` 这个浏览器构建器选项可以是布尔值或对象，以进行更精细的配置。此选项可对构建输出进行各种优化，包括：

<!-- vale Angular.Angular_Spelling = NO-->

* Minification of scripts and styles

  脚本和样式的最小化

* Tree-shaking

  摇树优化

* Dead-code elimination

  消除死代码

* Inlining of critical CSS

  内联关键 CSS

* Fonts inlining

  字体内联

<!-- vale Angular.Angular_Spelling = YES-->

Several options can be used to fine-tune the optimization of an application.

有几个选项可用于微调应用程序的优化方式。

| Options | Details | Value type                                                                     | Default value |
| :------ | :------ |:-------------------------------------------------------------------------------| :------------ |
| 选项 | 详情 | 值的类型                                                                           | 默认值 |
| `scripts` | Enables optimization of the scripts output. | `boolean`                                                                      | `true` |
| `scripts` | 启用脚本输出优化。 | `boolean`                                                                      | `true` |
| `styles` | Enables optimization of the styles output. | `boolean` &verbar; [Styles optimization options](#styles-optimization-options) | `true` |
| `styles` | 启用样式输出优化。 | `boolean` &verbar; [样式优化选项](#styles-optimization-options)                      | `true` |
| `fonts` | Enables optimization for fonts. <div class="alert is-helpful"> **NOTE**: <br /> This requires internet access. </div> | `boolean` &verbar; [Fonts optimization options](#fonts-optimization-options)   | `true` |
| `fonts` | 启用字体优化。<div class="alert is-helpful"> **注意**：<br />这需要进行国际互联网访问。</div> | `boolean` &verbar; [字体优化选项](#fonts-optimization-options)                       | `true` |

#### Styles optimization options

#### 样式优化选项

<!-- vale Angular.Angular_Spelling = NO -->

| Options | Details | Value type | Default value |
| :------ | :------ | :--------- | :------------ |
| 选项 | 详情 | 值的类型 | 默认值 |
| `minify` | Minify CSS definitions by removing extraneous whitespace and comments, merging identifiers and minimizing values. | `boolean` | `true` |
| `minify` | 最小化 CSS 定义，移除多余的空格和注释、合并标识符，并对值进行最小化。 | `boolean` | `true` |
| `inlineCritical` | Extract and inline critical CSS definitions to improve [First Contentful Paint](https://web.dev/first-contentful-paint). | `boolean` | `true` |
| `inlineCritical` | 提取并内联一些关键 CSS 定义，以提高[首次内容绘制（FCP）性能](https://web.dev/first-contentful-paint)。 | `boolean` | `true` |

#### Fonts optimization options

#### 字体优化选项

| Options | Details | Value type | Default value |
| :------ | :------ | :--------- | :------------ |
| 选项 | 详情 | 值的类型 | 默认值 |
| `inline` | Reduce [render blocking requests](https://web.dev/render-blocking-resources) by inlining external Google Fonts and Adobe Fonts CSS definitions in the application's HTML index file. <div class="alert is-helpful"> **NOTE**: <br /> This requires internet access. </div> | `boolean` | `true` |
| `inline` | 通过在应用的 index.html 中内联外部 Google 字体和 Adobe 字体的 CSS 定义，来减少[阻塞渲染的请求](https://web.dev/render-blocking-resources)<div class="alert is-helpful">**注意**：<br />这需要国际互联网访问。</div> | `boolean` | `true` |

<!-- vale Angular.Angular_Spelling = YES -->

You can supply a value such as the following to apply optimization to one or the other:

你可以提供如下值，以便应用其中的一项或几项优化：

<code-example language="json">

"optimization": {
  "scripts": true,
  "styles": {
    "minify": true,
    "inlineCritical": true
  },
  "fonts": true
}

</code-example>

<div class="alert is-helpful">

For [Universal](guide/glossary#universal), you can reduce the code rendered in the HTML page by setting styles optimization to `true`.

字体优化需要互联网访问。当启用它时，将会把外部 Google 字体和图标的定义内联在应用的 HTML 索引文件中，从而缩减那些阻塞渲染的请求。

</div>

### Source map configuration

### Source map（源码映射）配置

The `sourceMap` browser builder option can be either a Boolean or an Object for more fine-tune configuration to control the source maps of an application.

`sourceMap` 这个浏览器构建器选项可以是 Boolean 或 Object，以进行更精细的配置以控制应用程序的源码映射。

| Options | Details | Value type | Default value |
| :------ | :------ | :--------- | :------------ |
| 选项 | 详情 | 值的类型 | 默认值 |
| `scripts` | Output source maps for all scripts. | `boolean` | `true` |
| `scripts` | 为所有脚本输出源码映射文件。 | `boolean` | `true` |
| `styles` | Output source maps for all styles. | `boolean` | `true` |
| `styles` | 为所有样式输出源码映射文件。 | `boolean` | `true` |
| `vendor` | Resolve vendor packages source maps. | `boolean` | `false` |
| `vendor` | 解析来自依赖包的源码映射信息。 | `boolean` | `false` |
| `hidden` | Output source maps used for error reporting tools. | `boolean` | `false` |
| `hidden` | 为错误报告工具输出源码映射文件。 | `boolean` | `false` |

The example below shows how to toggle one or more values to configure the source map outputs:

以下示例展示了如何切换一个或多个值以配置源码映射输出：

<code-example language="json">

"sourceMap": {
  "scripts": true,
  "styles": false,
  "hidden": true,
  "vendor": true
}

</code-example>

<div class="alert is-helpful">

When using hidden source maps, source maps are not referenced in the bundle.
These are useful if you only want source maps to map error stack traces in error reporting tools. Hidden source maps don't expose your source maps in the browser developer tools.

使用隐藏式源码映射时，捆绑包中不会引用源码映射。如果你只希望在错误报告工具中通过源码映射映射错误堆栈跟踪时会很有用。隐藏源码映射就不会在浏览器开发工具中暴露你的源码映射。

</div>

<!-- links -->

[AioGuideI18nCommonMerge]: guide/i18n-common-merge "Common Internationalization task #6: Merge translations into the application | Angular"

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
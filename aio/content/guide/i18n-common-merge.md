# Merge translations into the application

# 将翻译合并到应用程序中

{@a merge}
{@a merge-aot}

To merge the completed translations into your application, use the [Angular CLI][AioGuideGlossaryCommandLineInterfaceCli] to build a copy of the distributable files of your application for each locale.

要将完成的翻译合并到你的应用程序中，请使用 [Angular CLI][AioGuideGlossaryCommandLineInterfaceCli] 为每个语言环境构建应用程序的可分发文件的副本。

The build process replaces the original text with translated text, and sets the `LOCALE_ID` token for each distributable copy of your application.
It also loads and registers the locale data.

构建过程会用翻译文本替换原始文本，并为应用程序的每个可分发副本设置 `LOCALE_ID` 标记。它还会加载和注册语言环境数据。

After you merge the translations, serve each distributable copy of the application using server-side language detection or different subdirectories.
For more information about how to serve each distributable copy of the application, see [deploying multiple locales][AioGuideI18nCommonDeployMultipleLocales].

合并翻译后，可使用“服务器的语言检测功能”或不同的子目录来提供应用程序的每个可分发副本。有关如何为应用程序的每个可分发副本搭建服务器的更多信息，请参阅[部署多个语言环境][AioGuideI18nCommonDeployMultipleLocales]。

The build process uses [ahead-of-time (AOT) compilation][AioGuideGlossaryAheadOfTimeAotCompilation] to produce a small, fast, ready-to-run application.
With Ivy in Angular version 9, AOT is used by default for both development and production builds, and AOT is required to localize component templates.

构建过程使用[预先 (AOT) 编译][AioGuideGlossaryAheadOfTimeAotCompilation] 来生成小型、快速、可立即运行的应用程序。对于 Angular 9 中的 Ivy，默认情况下，AOT 用于开发和生产构建，并且需要 AOT 来本地化组件模板。

<div class="alert is-helpful">

For a detailed explanation of the build process, see [Building and serving Angular apps][AioGuideBuild].
This build process works for translation files in the `.xlf` format or in another format that Angular understands, such as `.xtb`.

有关构建过程的详细说明，请参阅[构建和启动 Angular 开发服务器][AioGuideBuild]。此构建过程适用于 `.xlf` 格式或 Angular 理解的其他格式的翻译文件，例如 `.xtb` 。

</div>

<div class="alert is-important">

Ivy does not support merging i18n translations when using JIT mode.
If you [disable Ivy][AioGuideIvyOptingOutOfIvyInVersion9] and are using JIT mode, navigate [merging with the JIT compiler][AngularV8GuideI18nMergeWithTheJitCompiler].

使用 JIT 模式时，Ivy 不支持合并 i18n 翻译。如果你[禁用 Ivy][AioGuideIvyOptingOutOfIvyInVersion9] 并使用 JIT 模式，请转到[与 JIT 编译器合并][AngularV8GuideI18nMergeWithTheJitCompiler]。

</div>

To build a separate distributable copy of the application for each locale, [define the locales in the build configuration][AioGuideI18nCommonMergeDefineLocalesInTheBuildConfiguration] in the workspace configuration file [`angular.json`][AioGuideWorkspaceConfig] of your project.

要为每个语言环境单独构建应用程序的可分发副本，请在项目的工作区配置文件 [`angular.json`][AioGuideWorkspaceConfig] 中[在构建配置中定义语言环境][AioGuideI18nCommonMergeDefineLocalesInTheBuildConfiguration]。

This method shortens the build process by removing the requirement to perform a full application build for each locale.

此方法不需要为每个语言环境各执行一遍完整的应用程序构建，从而缩短了构建过程。

Then, to [generate application versions for each locale][AioGuideI18nCommonMergeGenerateApplicationVersionsForEachLocale], use the `"localize"` option in `angular.json`.
Also, to [build from the command line][AioGuideI18nCommonMergeBuildFromTheCommandLine], use the [`build`][AioCliBuild] Angular CLI command with the `--localize` option.

接下来，要[为每个语言环境生成子版本][AioGuideI18nCommonMergeGenerateApplicationVersionsForEachLocale]，请使用 `angular.json` 中的 `"localize"` 选项。此外，如果要[从命令行进行构建][AioGuideI18nCommonMergeBuildFromTheCommandLine]，请使用带有 `--localize` 选项的 [`build`][AioCliBuild] Angular CLI 命令。

<div class="alert is-helpful">

Optionally, [apply specific build options for just one locale][AioGuideI18nCommonMergeApplySpecificBuildOptionsForJustOneLocale] for a custom locale configuration.

或者，[仅对一种语言环境应用特定的构建选项][AioGuideI18nCommonMergeApplySpecificBuildOptionsForJustOneLocale] 以便自定义语言环境配置。

</div>

### Define locales in the build configuration

### 在构建配置中定义语言环境

{@a localize-config}

Use the `i18n` project option in the build configuration file ([`angular.json`][AioGuideWorkspaceConfig]) of your application to define locales for a project.

使用应用程序的构建配置文件 ([`angular.json`][AioGuideWorkspaceConfig]) 中的 `i18n` 项目选项来定义项目的语言环境。

The following sub-options identify the source language and tell the compiler where to find supported translations for the project:

以下子选项标识源语言并告诉编译器在哪里可以找到项目支持的翻译文件：

* `sourceLocale`: The locale you use within the application source code (`en-US` by default)

  `sourceLocale`：你在应用程序源代码中使用的语言环境（默认为 `en-US` ）

* `locales`: A map of locale identifiers to translation files

  `locales` ：语言环境标识符到翻译文件的映射表

For example, the following excerpt of an `angular.json` file sets the source locale to `en-US` and provides the path to the `fr` (French) locale translation file:

例如，`angular.json` 文件中的下列片段会将源语言环境设置为 `en-US` 并提供 `fr` （法语）语言环境翻译文件的路径：

<code-example language="json" header="angular.json" path="i18n/angular.json" region="locale-config"></code-example>

### Generate application versions for each locale

### 为每个语言环境生成应用程序子版本

{@a localize-generate}

To use your locale definition in the build configuration, use the `"localize"` option in `angular.json` to tell the CLI which locales to generate for the build configuration:

要在构建配置中使用你的语言环境定义，请使用 `angular.json` 中的 `"localize"` 选项告诉 CLI 为构建配置生成哪些语言环境：

* Set `"localize"` to `true` for *all* the locales previously defined in the build configuration.

  将 `"localize"` 设置为 `true`，来构建先前在构建配置中定义的*所有*语言环境。

* Set `"localize"` to an array of a subset of the previously defined locale identifiers to build only those locale versions.

  将 `"localize"` 设置为先前定义的语言环境标识符子集的数组，来单独构建那些语言环境版本。

* Set `"localize"` to `false` to disable localization and not generate any locale-specific versions.

  将 `"localize"` 设置为 `false`，来禁用本地化并且不生成任何特定于语言环境的版本。

<div class="alert is-helpful">

**NOTE**: [Ahead-of-time (AOT) compilation][AioGuideGlossaryAheadOfTimeAotCompilation] is required to localize component templates.

**注意**：本地化组件模板需要[预先 (AOT) 编译][AioGuideGlossaryAheadOfTimeAotCompilation]。

If you changed this setting, set `"aot"` to `true` in order to use AOT.

如果你更改了此设置，请将 `"aot"` 设置为 `true` 以使用 AOT。

</div>

The following example displays the `"localize"` option set to `true` in `angular.json`, so that all locales defined in the build configuration are built.

以下示例展示在 `angular.json` 中的 `"localize"` 选项设置为 `true`，以便构建 `build` 配置中定义的所有语言环境。

<code-example language="json" header="angular.json" path="i18n/angular.json" region="build-localize-true"></code-example>

<div class="alert is-helpful">

Due to the deployment complexities of i18n and the need to minimize rebuild time, the development server only supports localizing a single locale at a time.
If you set the `"localize"` option to `true`, define more than one locale, and use `ng serve`; then an error occurs.
If you want to develop against a specific locale, set the `"localize"` option to a specific locale.  
For example, for French (`fr`), specify `"localize": ["fr"]`.

由于 i18n 部署的复杂性和最小化重建时间的需要，开发服务器只支持每次本地化一个语言环境。如果你将 `"localize"` 选项设置为 `true`，请定义多个语言环境，并使用 `ng serve`，就会发生错误。如果要针对特定语言环境进行开发，请将 `"localize"` 选项设置为特定语言环境。  
例如，对于法语 ( `fr` )，请指定 `"localize": ["fr"]` 。

</div>

The CLI loads and registers the locale data, places each generated version in a locale-specific directory to keep it separate from other locale versions, and puts the directories within the configured `outputPath` for the project.
For each application variant the `lang` attribute of the `html` element is set to the locale.
The CLI also adjusts the HTML base HREF for each version of the application by adding the locale to the configured `baseHref`.

CLI 会加载并注册语言环境数据，将每个生成的版本放置在语言环境的专属目录中，以便把它和其他语言环境版本分开，并将目录放在为本项目配置的 `outputPath` 中。对于应用程序的每个变体，其 `html` 元素的 `lang` 属性设置为语言环境。CLI 还会将语言环境添加到配置的 `baseHref` 中，以调整每个应用程序版本的 HTML base HREF。

Set the `"localize"` property as a shared configuration to effectively inherit for all the configurations. 
Also, set the property to override other configurations.

将 `"localize"` 属性设置为共享配置，以便让所有配置有效的继承它。此外，设置该属性会覆盖其他配置。

### Build from the command line

### 从命令行构建

{@a localize-build-command}

Also, use the `--localize` option with the [`ng build`][AioCliBuild] command and your existing `production` configuration.
The CLI builds all locales defined in the build configuration.
If you set the locales in build configuration, it is similar to when you set the `"localize"` option to `true`.
For more information about how to set the locales, see [Generate application versions for each locale][AioGuideI18nCommonMergeGenerateApplicationVersionsForEachLocale].

此外，将 `--localize` 选项与 [ `ng build` ][AioCliBuild] 命令和你现有的 `production` 配置结合使用。CLI 会构建 `build` 配置中定义的所有语言环境。如果要在 `build` 配置中设置语言环境，则同样把 `"localize"` 选项设置为 `true`。有关如何设置语言环境的更多信息，请参阅[为每个语言环境生成应用程序版本][AioGuideI18nCommonMergeGenerateApplicationVersionsForEachLocale]。

<code-example path="i18n/doc-files/commands.sh" region="build-localize" language="sh"></code-example>

### Apply specific build options for just one locale

### 仅对一种语言环境应用特定的 `build` 选项

{@a localize-build-one-locale}

To apply specific build options to only one locale, specify a single locale to create a custom locale-specific configuration.
The following example displays a custom locale-specific configuration using a single locale.

要让特定的构建选项仅应用于一种语言环境，请指定单个语言环境以创建自定义语言环境的专用配置。以下示例展示了使用单个语言环境的自定义语言环境的专用配置。

<code-example language="json" header="angular.json" path="i18n/angular.json" region="build-single-locale"></code-example>

Pass this configuration to the `ng serve` or `ng build` commands.
The following code example displays how to serve the French language file.

将此配置传递给 `ng serve` 或 `ng build` 命令。以下代码示例展示了如何提供法语文件。

<code-example path="i18n/doc-files/commands.sh" region="serve-french" language="sh"></code-example>

<div class="alert is-important">

Use the CLI development server (`ng serve`) with only a single locale.

使用只有一个语言环境的 CLI 开发服务器 ( `ng serve` )。

</div>

For production builds, use configuration composition to run both configurations.

对于生产构建，可以使用配置组合来运行这两种配置。

<code-example path="i18n/doc-files/commands.sh" region="build-production-french" language="sh"></code-example>

<code-example language="json" header="angular.json" path="i18n/angular.json" region="build-production-french" ></code-example>

### Report missing translations

### 报告缺失的翻译

{@a missing-translation}

When a translation is missing, the build succeeds but generates a warning such as `Missing translation for message "{translation_text}"`.
To configure the level of warning that is generated by the Angular compiler, specify one of the following levels.

当缺少翻译时，能构建成功但会生成警告，例如 `Missing translation for message "{translation_text}"` 。要配置 Angular 编译器生成的警告级别，请指定以下级别之一。

* `error`: Throw an error.
  If you are using AOT compilation, the build will fail.
  If you are using JIT compilation, the application will fail to load.

  `error` ：抛出错误。如果你使用 AOT 编译，则构建将失败。如果你使用 JIT 编译，应用程序将无法加载。

* `warning` (default): Displays a `Missing translation` warning in the console or shell.

  `warning` （默认）：在控制台或 shell 中显示 `Missing translation` 警告。

* `ignore`: Do nothing.

  `ignore` ：什么都不做。

Specify the warning level in the `options` section for the `build` target of your Angular CLI configuration file (`angular.json`).
The following example displays how to set the warning level to `error`.

在 Angular CLI 配置文件 ( `angular.json` ) 的 `build` 目标的 `options` 部分指定警告级别。以下示例展示如何将警告级别设置为 `error` 。

<code-example language="json" header="angular.json" path="i18n/angular.json" region="missing-translation-error" ></code-example>

<!-- links -->

[AioGuideI18nCommonMergeApplySpecificBuildOptionsForJustOneLocale]: guide/i18n-common-merge#apply-specific-build-options-for-just-one-locale "Apply specific build options for just one locale - Merge translations into the application | Angular"

[AioGuideI18nCommonMergeBuildFromTheCommandLine]: guide/i18n-common-merge#build-from-the-command-line "Build from the command line - Merge translations into the application | Angular"

[AioGuideI18nCommonMergeDefineLocalesInTheBuildConfiguration]: guide/i18n-common-merge#define-locales-in-the-build-configuration "Define locales in the build configuration - Merge translations into the application | Angular"

[AioGuideI18nCommonDeployMultipleLocales]: guide/i18n-common-deploy "Deploy multiple locales | Angular"

[AioGuideI18nCommonMergeGenerateApplicationVersionsForEachLocale]: guide/i18n-common-merge#generate-application-versions-for-each-locale "Generate application versions for each locale - Merge translations into the application | Angular"

[AioCliBuild]: cli/build "ng build | CLI | Angular"

[AioGuideBuild]: guide/build "Building and serving Angular apps | Angular"

[AioGuideGlossaryAheadOfTimeAotCompilation]: guide/glossary#ahead-of-time-aot-compilation "ahead-of-time (AOT) compilation - Glossary | Angular"

[AioGuideGlossaryCommandLineInterfaceCli]: guide/glossary#command-line-interface-cli "command-line interface (CLI) - Glossary | Angular"

[AioGuideIvyOptingOutOfIvyInVersion9]: guide/ivy#opting-out-of-ivy-in-version-9 "Opting out of Ivy in version 9 - Angular Ivy | Angular"

[AioGuideWorkspaceConfig]: guide/workspace-config "Angular workspace configuration | Angular"

<!-- external links -->

<!--[AngularV8GuideI18nMergeWithTheJitCompiler]: https://v8.angular.io/guide/i18n-common#merge-translations-into-the-app-with-the-jit-compiler "Merge with the JIT compiler - Internationalization (i18n) | Angular v8" -->

<!-- end links -->

@reviewed 2021-09-15

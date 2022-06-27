# Merge translations into the application

# 将翻译结果合并到应用程序中

To merge the completed translations into your project, complete the following actions

要将完成的翻译结果合并到你的项目中，请完成以下操作

1. Use the [Angular CLI][AioCliMain] to build a copy of the distributable files of your project

   使用 [Angular CLI][AioCliMain] 构建项目的可分发文件的副本

1. Use the `"localize"` option to replace all of the i18n messages with the valid translations and build a localized variant application.
   A variant application is a complete a copy of the distributable files of your application translated for a single locale.

   使用 `"localize"` 选项将所有 i18n 消息替换为有效的翻译并构建本地化的应用程序变体。应用程序变体就是为单个语言环境翻译的应用程序的可分发文件的完整副本。

After you merge the translations, serve each distributable copy of the application using server-side language detection or different subdirectories.

合并翻译后，可使用服务器端语言检测或不同的子目录来提供（serve）应用程序的每个可分发副本。

<div class="alert is-helpful">

For more information about how to serve each distributable copy of the application, see [deploying multiple locales][AioGuideI18nCommonDeploy].

有关如何为应用程序的每个可分发副本提供服务的更多信息，请参阅[部署多个语言环境][AioGuideI18nCommonDeploy]。

</div>

For a compile time translation of the application, the build process uses [ahead-of-time (AOT) compilation][AioGuideGlossaryAheadOfTimeAotCompilation] to produce a small, fast, ready-to-run application.

对于应用程序的编译期转换，构建过程会使用[预先 (AOT) 编译][AioGuideGlossaryAheadOfTimeAotCompilation]来生成小型、快速、可立即运行的应用程序。

<div class="alert is-helpful">

For a detailed explanation of the build process, see [Building and serving Angular apps][AioGuideBuild].
The build process works for translation files in the `.xlf` format or in another format that Angular understands, such as `.xtb`.
For more information about translation file formats used by Angular, see [Change the source language file format][AioGuideI18nCommonTranslationFilesChangeTheSourceLanguageFileFormat]

有关构建过程的详细说明，请参阅[构建和提供 Angular 应用程序][AioGuideBuild]。构建过程适用于 `.xlf` 格式或 Angular 能理解的另一种格式的翻译文件，比如 `.xtb`。有关 Angular 使用的翻译文件格式的更多信息，请参阅[更改源语言文件格式][AioGuideI18nCommonTranslationFilesChangeTheSourceLanguageFileFormat]

</div>

To build a separate distributable copy of the application for each locale, [define the locales in the build configuration][AioGuideI18nCommonMergeDefineLocalesInTheBuildConfiguration] in the [`angular.json`][AioGuideWorkspaceConfig] workspace build configuration file of your project.

要为每个语言环境构建应用程序的单独可分发副本，请在项目的 [`angular.json`][AioGuideWorkspaceConfig] 工作区构建配置文件中[在构建配置中定义语言环境][AioGuideI18nCommonMergeDefineLocalesInTheBuildConfiguration]。

This method shortens the build process by removing the requirement to perform a full application build for each locale.

此方法不需要为每个语言环境执行完整的应用程序构建，从而缩短了构建过程。

To [generate application variants for each locale][AioGuideI18nCommonMergeGenerateApplicationVariantsForEachLocale], use the `"localize"` option in the [`angular.json`][AioGuideWorkspaceConfig] workspace build configuration file.
Also, to [build from the command line][AioGuideI18nCommonMergeBuildFromTheCommandLine], use the [`build`][AioCliBuild] [Angular CLI][AioCliMain] command with the `--localize` option.

要[为每个语言环境生成应用程序变体][AioGuideI18nCommonMergeGenerateApplicationVariantsForEachLocale]，请使用 [ `angular.json` ][AioGuideWorkspaceConfig] 工作区构建配置文件中的 `"localize"` 选项。此外，要[从命令行构建][AioGuideI18nCommonMergeBuildFromTheCommandLine]，请使用带有 `--localize` 选项的[ `build` ][AioCliBuild] [Angular CLI][AioCliMain] 命令。

<div class="alert is-helpful">

Optionally, [apply specific build options for just one locale][AioGuideI18nCommonMergeApplySpecificBuildOptionsForJustOneLocale] for a custom locale configuration.

或者，[仅对一种语言环境应用特定构建选项][AioGuideI18nCommonMergeApplySpecificBuildOptionsForJustOneLocale] 以自定义语言环境配置。

</div>

## Define locales in the build configuration

## 在构建配置中定义语言环境

Use the `i18n` project option in the [`angular.json`][AioGuideWorkspaceConfig] workspace build configuration file of your project to define locales for a project.

使用项目的工作区构建配置文件 [`angular.json`][AioGuideWorkspaceConfig] 中的 `i18n` 项目选项来定义项目的语言环境。

The following sub-options identify the source language and tell the compiler where to find supported translations for the project.

以下子选项标识源语言并告诉编译器在哪里可以找到项目支持的翻译。

| Suboption | Details |
| :-------- | :------ |
| 子选项 | 详情 |
| `sourceLocale` | The locale you use within the application source code (`en-US` by default) |
| `sourceLocale` | 你在应用程序源代码中使用的语言环境（默认为 `en-US` ） |
| `locales` | A map of locale identifiers to translation files |
| `locales` | 语言环境标识符到翻译文件的映射表 |

### `angular.json` for `en-US` and `fr` example

### `angular.json` 用于 `en-US` 和 `fr` 示例

For example, the following excerpt of an [`angular.json`][AioGuideWorkspaceConfig] workspace build configuration file sets the source locale to `en-US` and provides the path to the French (`fr`) locale translation file.

比如，工作区构建配置文件 [`angular.json`][AioGuideWorkspaceConfig] 的以下代码片段会将源语言环境设置为 `en-US` 并提供法语 ( `fr` ) 语言环境翻译文件的路径。

<code-example header="angular.json" path="i18n/angular.json" region="locale-config"></code-example>

## Generate application variants for each locale

## 为每个语言环境生成应用程序变体

To use your locale definition in the build configuration, use the `"localize"` option in the [`angular.json`][AioGuideWorkspaceConfig] workspace build configuration file to tell the CLI which locales to generate for the build configuration.

要在构建配置中使用你的语言环境定义，请使用工作空间构建配置文件 [`angular.json`][AioGuideWorkspaceConfig] 中的 `"localize"` 选项来告诉 CLI 要为此构建配置生成哪些语言环境。

* Set `"localize"` to `true` for all the locales previously defined in the build configuration.

  对于先前在构建配置中定义的所有语言环境，将 `"localize"` 设置为 `true` 。

* Set `"localize"` to an array of a subset of the previously defined locale identifiers to build only those locale versions.

  将 `"localize"` 设置为先前定义的语言环境标识符子集的数组，以单独构建那些语言环境版本。

* Set `"localize"` to `false` to disable localization and not generate any locale-specific versions.

  将 `"localize"` 设置为 `false` 以禁用本地化并且不生成任何特定于语言环境的版本。

<div class="alert is-helpful">

**NOTE**: <br />
[Ahead-of-time (AOT) compilation][AioGuideGlossaryAheadOfTimeAotCompilation] is required to localize component templates.

**注意**：<br />
本地化组件模板需要[预先 (AOT) 编译][AioGuideGlossaryAheadOfTimeAotCompilation]。

If you changed this setting, set `"aot"` to `true` in order to use AOT.

如果你更改了此设置，请将 `"aot"` 设置为 `true` 以使用 AOT。

</div>

<div class="alert is-helpful">

Due to the deployment complexities of i18n and the need to minimize rebuild time, the development server only supports localizing a single locale at a time.
If you set the `"localize"` option to `true`, define more than one locale, and use `ng serve`; then an error occurs.
If you want to develop against a specific locale, set the `"localize"` option to a specific locale.
For example, for French (`fr`), specify `"localize": ["fr"]`.

由于 i18n 的部署复杂性和最小化重建时间的需要，开发服务器一次仅支持本地化单个语言环境。如果你将 `"localize"` 选项设置为 `true`，定义了多个语言环境，并使用 `ng serve`，就会发生错误。如果要针对特定语言环境进行开发，请将 `"localize"` 选项设置为特定的语言环境。比如，对于法语 ( `fr` )，请指定 `"localize": ["fr"]` 。

</div>

The CLI loads and registers the locale data, places each generated version in a locale-specific directory to keep it separate from other locale versions, and puts the directories within the configured `outputPath` for the project.
For each application variant the `lang` attribute of the `html` element is set to the locale.
The CLI also adjusts the HTML base HREF for each version of the application by adding the locale to the configured `baseHref`.

CLI 加载并注册语言环境数据，将每个生成的版本放置在特定语言环境的目录中以使其与其他语言环境版本分开，并将其目录放在为此项目配置的 `outputPath` 中。对于每个应用程序变体，将 `html` 元素的 `lang` 属性设置为其语言环境。 CLI 还通过将语言环境添加到所配置的 `baseHref` 中来调整每个应用程序版本的 HTML baseHref。

Set the `"localize"` property as a shared configuration to effectively inherit for all the configurations.
Also, set the property to override other configurations.

将 `"localize"` 属性设置为共享配置以有效继承所有配置。此外，会将该属性设置为覆盖其他配置。

### `angular.json` include all locales from build example

### `angular.json` 包含构建示例中的所有语言环境

The following example displays the `"localize"` option set to `true` in the [`angular.json`][AioGuideWorkspaceConfig] workspace build configuration file, so that all locales defined in the build configuration are built.

以下示例展示了如何把工作区构建配置文件 [`angular.json`][AioGuideWorkspaceConfig] 中的 `"localize"` 选项设置为 `true`，以构建构建配置中定义的所有语言环境。

<code-example header="angular.json" path="i18n/angular.json" region="build-localize-true"></code-example>

## Build from the command line

## 从命令行构建

Also, use the `--localize` option with the [`ng build`][AioCliBuild] command and your existing `production` configuration.
The CLI builds all locales defined in the build configuration.
If you set the locales in build configuration, it is similar to when you set the `"localize"` option to `true`.

此外，可以将 `--localize` 选项与 [ `ng build` ][AioCliBuild] 命令和你现有的 `production` 配置结合使用。 CLI 会构建配置中定义的所有语言环境。如果在构建配置中设置了语言环境，则相当于将 `"localize"` 选项设置为 `true` 。

<div class="alert is-helpful">

For more information about how to set the locales, see [Generate application variants for each locale][AioGuideI18nCommonMergeGenerateApplicationVariantsForEachLocale].

有关如何设置语言环境的更多信息，请参阅[为每个语言环境生成应用程序变体][AioGuideI18nCommonMergeGenerateApplicationVariantsForEachLocale]。

</div>

<code-example path="i18n/doc-files/commands.sh" region="build-localize"></code-example>

## Apply specific build options for just one locale

## 仅对一种语言环境应用特定的构建选项

To apply specific build options to only one locale, specify a single locale to create a custom locale-specific configuration.

要将特定构建选项仅应用于一个语言环境，请指定单个语言环境以创建自定义的语言环境专有配置。

<div class="alert is-important">

Use the [Angular CLI][AioCliMain] development server (`ng serve`) with only a single locale.

请使用只有一个语言环境的 [Angular CLI][AioCliMain] 开发服务器 ( `ng serve` )。

</div>

### build for French example

### 为法语构建的例子

The following example displays a custom locale-specific configuration using a single locale.

以下示例显示使用单个语言环境的自定义语言环境专属配置。

<code-example header="angular.json" path="i18n/angular.json" region="build-single-locale"></code-example>

Pass this configuration to the `ng serve` or `ng build` commands.
The following code example displays how to serve the French language file.

将此配置传递给 `ng serve` 或 `ng build` 命令。以下代码示例显示了如何提供法语文件。

<code-example path="i18n/doc-files/commands.sh" region="serve-french"></code-example>

For production builds, use configuration composition to run both configurations.

对于生产构建，可使用配置组合来同时运行这两种配置。

<code-example path="i18n/doc-files/commands.sh" region="build-production-french"></code-example>

<code-example header="angular.json" path="i18n/angular.json" region="build-production-french" ></code-example>

## Report missing translations

## 报告缺失的翻译

When a translation is missing, the build succeeds but generates a warning such as `Missing translation for message "{translation_text}"`.
To configure the level of warning that is generated by the Angular compiler, specify one of the following levels.

当缺少翻译时，可以构建成功但会生成警告，比如 `Missing translation for message "{translation_text}"` 。要配置 Angular 编译器生成的警告级别，请指定以下级别之一。

| Warning level | Details | Output |
| :------------ | :------ | :----- |
| 警告级别 | 详情 | 输出 |
| `error` | Throw an error and the build fails | n/a |
| `error` | 抛出错误，构建失败 | 不适用 |
| `ignore` | Do nothing | n/a |
| `ignore` | 什么也不做 | 不适用 |
| `warning` | Displays the default warning in the console or shell | `Missing translation for message "{translation_text}"` |
| `warning` | 在控制台或 shell 中显示默认警告 | `Missing translation for message "{translation_text}"` |

Specify the warning level in the `options` section for the `build` target of your [`angular.json`][AioGuideWorkspaceConfig] workspace build configuration file.

在工作区构建配置文件 [`angular.json`][AioGuideWorkspaceConfig] 中 `build` 目标的 `options` 部分指定警告级别。

### `angular.json` `error` warning example

### `angular.json` `error` 警告级别示例

The following example displays how to set the warning level to `error`.

以下示例显示如何将警告级别设置为 `error` 。

<code-example header="angular.json" path="i18n/angular.json" region="missing-translation-error" ></code-example>

<div class="alert is-helpful">

When you compile your Angular project into an Angular application, the instances of the `i18n` attribute are replaced with instances of the [`$localize`][AioApiLocalizeInitLocalize] tagged message string.
This means that your Angular application is translated after compilation.
This also means that you can create localized versions of your Angular application without re-compiling your entire Angular project for each locale.

当你将 Angular 项目编译为 Angular 应用程序时，`i18n` 属性的实例将被替换为 [`$localize`][AioApiLocalizeInitLocalize] 标记的消息字符串的实例。这意味着你的 Angular 应用程序会在编译后被翻译。这也意味着你可以创建 Angular 应用程序的本地化版本，而无需为每个语言环境重新编译整个 Angular 项目。

When you translate your Angular application, the *translation transformation* replaces and reorders the parts (static strings and expressions) of the template literal string with strings from a collection of translations.
For more information, see [`$localize`][AioApiLocalizeInitLocalize].

当你翻译 Angular 应用程序时，*翻译转换*会用翻译集合中的字符串替换和重新排序模板文字字符串的部分（静态字符串和表达式）。有关详细信息，请参阅 [`$localize`][AioApiLocalizeInitLocalize]。

<div class="alert is-helpful">

**tldr;**

Compile once, then translate for each locale.

编译一次，然后为每个语言环境翻译。

</div>

</div>

## What's next

## 下一步呢？

* [Deploy multiple locales][AioGuideI18nCommonDeploy]

  [部署多个语言环境][AioGuideI18nCommonDeploy]

<!-- links -->

[AioApiLocalizeInitLocalize]: api/localize/init/$localize "$localize | init - localize - API | Angular"

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"

[AioCliBuild]: cli/build "ng build | CLI | Angular"

[AioGuideBuild]: guide/build "Building and serving Angular apps | Angular"

[AioGuideGlossaryAheadOfTimeAotCompilation]: guide/glossary#ahead-of-time-aot-compilation "ahead-of-time (AOT) compilation - Glossary | Angular"

[AioGuideI18nCommonDeploy]: guide/i18n-common-deploy "Deploy multiple locales | Angular"

[AioGuideI18nCommonMergeApplySpecificBuildOptionsForJustOneLocale]: guide/i18n-common-merge#apply-specific-build-options-for-just-one-locale "Apply specific build options for just one locale - Merge translations into the application | Angular"

[AioGuideI18nCommonMergeBuildFromTheCommandLine]: guide/i18n-common-merge#build-from-the-command-line "Build from the command line - Merge translations into the application | Angular"

[AioGuideI18nCommonMergeDefineLocalesInTheBuildConfiguration]: guide/i18n-common-merge#define-locales-in-the-build-configuration "Define locales in the build configuration - Merge translations into the application | Angular"

[AioGuideI18nCommonMergeGenerateApplicationVariantsForEachLocale]: guide/i18n-common-merge#generate-application-variants-for-each-locale "Generate application variants for each locale - Merge translations into the application | Angular"

[AioGuideI18nCommonTranslationFilesChangeTheSourceLanguageFileFormat]: guide/i18n-common-translation-files#change-the-source-language-file-format "Change the source language file format - Work with translation files | Angular"

[AioGuideWorkspaceConfig]: guide/workspace-config "Angular workspace configuration | Angular"

<!-- external links -->

[AngularV8GuideI18nMergeWithTheJitCompiler]: https://v8.angular.io/guide/i18n-common#merge-translations-into-the-app-with-the-jit-compiler "Merge with the JIT compiler - Internationalization (i18n) | Angular v8"

<!-- end links -->

@reviewed 2022-02-28
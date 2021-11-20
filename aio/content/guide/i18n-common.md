# Common Internationalization tasks

# 常见的国际化任务

Use Angular to internationalize your application

使用 Angular 让你的应用程序国际化

* Use built-in pipes to display dates, numbers, percentages, and currencies in a local format.

  使用内置管道以本地格式显示日期、数字、百分比和货币。

* Mark text in component templates for translation.

  在组件模板中标记文本以进行翻译。

* Mark plural forms of expressions for translation.

  标记复数形式的表达式以供翻译。

* Mark alternate text for translation.

  标记替代文本以进行翻译。

After you prepare your application for an international audience, use the [Angular CLI][AioCliMain] to localize your application.
Complete the following tasks to localize your application.

在为国际受众准备应用程序后，使用 [Angular CLI][AioCliMain] 来本地化你的应用程序。完成以下任务以本地化你的应用程序。

* Use the CLI to extract marked text to a *source language* file.

  使用 CLI 将标记的文本提取到*源语言*文件中。

* Make a copy of this file for each language, and send these *translation files* to a translator or service.

  为每种语言制作此文件的副本，并将这些*翻译文件*发送给翻译人员或服务。

* Use the CLI to merge the finished translation files when building your application for one or more locales.

  在为一种或多种语言环境构建应用程序时，使用 CLI 合并完成的翻译文件。

<div class="alert is-helpful">

To explore the sample application with French translations used in this guide, see <live-example></live-example>.

要浏览本指南中使用的法语翻译示例应用程序，请参阅<live-example></live-example> 。

</div>

## Prerequisites

## 先决条件

To prepare your application for translations, you should have a basic understanding of the following subjects.

要使你的应用准备好翻译，你应该对以下主题有基本的了解。

* [Templates][AioGuideGlossaryTemplate]

  [模板][AioGuideGlossaryTemplate]

* [Components][AioGuideGlossaryComponent]

  [组件][AioGuideGlossaryComponent]

* [Angular CLI][AioGuideGlossaryCommandLineInterfaceCli] command-line tool for managing the Angular development cycle

  [Angular CLI][AioGuideGlossaryCommandLineInterfaceCli] 用于管理 Angular 开发周期的命令行工具

* [Extensible Markup Language (XML)][W3Xml] used for translation files

  [Extensible Markup Language (XML)][W3Xml] 用于翻译文件

## Steps to localize your app

## 本地化应用程序的步骤

To localize your application, complete the following general actions.

要本地化你的应用程序，请完成以下常规操作。

1. [Add the localize package][AioGuideI18nCommonAddPackage].

   [添加本地化包][AioGuideI18nCommonAddPackage]。

1. [Refer to locales by ID][AioGuideI18nCommonLocaleId].

   [通过 ID 引用语言环境][AioGuideI18nCommonLocaleId]。

1. [Format data based on locale][AioGuideI18nCommonFormatDataLocale].

   [根据语言环境格式化数据][AioGuideI18nCommonFormatDataLocale]。

1. [Prepare templates for translations][AioGuideI18nCommonPrepare].

   [准备翻译模板][AioGuideI18nCommonPrepare]。

1. [Work with translation files][AioGuideI18nCommonTranslationFiles].

   [使用翻译文件][AioGuideI18nCommonTranslationFiles]。

1. [Merge translations into the app][AioGuideI18nCommonMerge].

   [将翻译合并到应用程序中][AioGuideI18nCommonMerge]。

1. [Deploy multiple locales][AioGuideI18nCommonDeploy].

   [部署多个语言环境][AioGuideI18nCommonDeploy]。

While you follow the actions, [explore the translated example app][AioGuideI18nExample].

当你按照操作进行操作时，[浏览已翻译的示例应用程序][AioGuideI18nExample]。

In special cases, the following actions are required.

在特殊情况下，需要执行以下操作。

* [Set the source locale manually][AioGuideI18nOptionalManualSourceLocale], if you need to set the [LOCALE_ID][AioApiCoreLocaleId] token.

  如果你需要设置 [LOCALE_ID][AioApiCoreLocaleId] 令牌，请[手动设置源语言环境][AioGuideI18nOptionalManualSourceLocale]。

* [Import global variants of the locale data][AioGuideI18nOptionalImportGlobalVariants] for extra locale data.

  [导入语言环境数据的全局变量][AioGuideI18nOptionalImportGlobalVariants] 以获得额外的语言环境数据。

* [Manage marked text with custom IDs][AioGuideI18nOptionalManageMarkedText], if you require more control over matching translations.

  如果你需要对匹配翻译进行更多控制，请[使用自定义 ID 管理标记文本][AioGuideI18nOptionalManageMarkedText]。

<!-- links -->

[AioApiCoreLocaleId]: api/core/LOCALE_ID "LOCALE_ID | Core - API | Angular"

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"

[AioGuideGlossaryCommandLineInterfaceCli]: guide/glossary#command-line-interface-cli "command-line interface (CLI) - Glossary | Angular"

[AioGuideGlossaryComponent]: guide/glossary#component "component - Glossary | Angular"

[AioGuideGlossaryTemplate]: guide/glossary#template "template - Glossary | Angular"

[AioGuideI18nCommonAddPackage]: guide/i18n-common-add-package "Common Internationalization task #1: Add the localize package | Angular"

[AioGuideI18nCommonDeploy]: guide/i18n-common-deploy "Deploy multiple locales | Angular"

[AioGuideI18nCommonFormatDataLocale]: guide/i18n-common-format-data-locale "Format data based on locale | Angular"

[AioGuideI18nCommonLocaleId]: guide/i18n-common-locale-id "Refer to locales by ID | Angular"

[AioGuideI18nCommonMerge]: guide/i18n-common-merge "Merge translations into the application | Angular"

[AioGuideI18nCommonPrepare]: guide/i18n-common-prepare "Prepare templates for translations | Angular"

[AioGuideI18nCommonTranslationFiles]: guide/i18n-common-translation-files "Work with translation files | Angular"

[AioGuideI18nExample]: guide/i18n-example "Example Angular application: Explore the translated example application | Angular"

[AioGuideI18nOptionalManageMarkedText]: guide/i18n-optional-manage-marked-text "Manage marked text with custom IDs | Angular"

[AioGuideI18nOptionalImportGlobalVariants]: guide/i18n-optional-import-global-variants "Import global variants of the locale data | Angular"

[AioGuideI18nOptionalManualSourceLocale]: guide/i18n-optional-manual-source-locale "Set the source locale manually | Angular"

<!-- externla links -->

[W3Xml]: https://www.w3.org/XML "Extensible Markup Language (XML) | W3C"

<!-- end links -->

@reviewed 2021-09-15

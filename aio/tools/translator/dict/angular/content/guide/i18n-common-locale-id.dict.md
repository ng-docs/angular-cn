Refer to locales by ID

通过 ID 引用语言环境

Angular uses the Unicode *locale identifier* \(Unicode locale ID\) to find the correct locale data for internationalization of text strings.

Angular 使用 Unicode *语言环境标识符*（Unicode 语言环境 ID）来查找正确的语言环境数据，以实现文本字符串的国际化。

A locale ID specifies the language, country, and an optional code for further variants or subdivisions.
A locale ID consists of the language identifier, a hyphen \(`-`\) character, and the locale extension.

语言环境 ID 指定语言、国家/地区和其他变体或细分的可选代码。语言环境 ID 由语言标识符、破折号（`-`）字符和语言环境扩展组成。

For the examples in this guide, use the following languages and locales.

对于本指南中的示例，使用了如下语言和语言环境。

French

法语

France

法国

Canada

加拿大

English

英语

United States of America

美国

Language

语言

Locale

地区

Unicode locale ID

Unicode 语言环境 ID

The [Angular repository][GithubAngularAngularTreeMasterPackagesCommonLocales] includes common locales.

[Angular 代码仓库][GithubAngularAngularTreeMasterPackagesCommonLocales]中包括常见的一些语言环境。

Set the source locale ID

设置源语言环境 ID

Use the Angular CLI to set the source language in which you are writing the component template and code.

使用 Angular CLI 设置编写组件模板和代码所用的源语言。

By default, Angular uses `en-US` as the source locale of your project.

默认情况下，Angular 使用 `en-US` 作为项目的源语言环境。

To change the source locale of your project for the build, complete the following actions.

要为此构建更改项目的源语言环境，请完成以下操作。

Open the [`angular.json`][AioGuideWorkspaceConfig] workspace build configuration file.

打开工作空间构建配置文件 [`angular.json`][AioGuideWorkspaceConfig]。

Change the source locale in the `sourceLocale` field.

在 `sourceLocale` 字段中更改源语言环境。

What's next

下一步呢？

[Format data based on locale][AioGuideI18nCommonFormatDataLocale]

[根据语言环境格式化数据][AioGuideI18nCommonFormatDataLocale]
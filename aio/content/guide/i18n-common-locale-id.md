# Refer to locales by ID

# 通过 ID 引用语言环境

Angular uses the Unicode *locale identifier* (Unicode locale ID) to find the correct locale data for internationalization of text strings.

Angular 使用 Unicode *语言环境标识符*（Unicode 语言环境 ID）来查找正确的语言环境数据，以实现文本字符串的国际化。

<div class="callout is-helpful">

<header>Unicode locale ID</header>

<header>Unicode 语言环境 ID</header>

* A locale ID conforms to the [Unicode Common Locale Data Repository (CLDR) core specification][UnicodeCldrDevelopmentCoreSpecification]. For more information about locale IDs, see [Unicode Language and Locale Identifiers][UnicodeCldrDevelopmentCoreSpecificationHVgyyng33o798].

  语言环境 ID 遵循 [Unicode 通用语言环境数据仓库 (CLDR) 核心规范][UnicodeCldrDevelopmentCoreSpecification]。有关语言环境 ID 的更多信息，请参阅 [Unicode 语言和语言环境标识符][UnicodeCldrDevelopmentCoreSpecificationHVgyyng33o798]。

* CLDR and Angular use [BCP 47 tags][RfcEditorInfoBcp47] as the base for the locale ID.

  CLDR 和 Angular 以 [BCP 47 标签][RfcEditorInfoBcp47] 作为语言环境 ID 的基础。

</div>

A locale ID specifies the language, country, and an optional code for further variants or subdivisions.
A locale ID consists of the language identifier, a dash (`-`) character, and the locale extension.

语言环境 ID 指定语言、国家/地区和其他变体或细分的可选代码。语言环境 ID 由语言标识符、破折号(`-`)字符和语言环境扩展组成。

<code-example>

{language_id}-{locale_extension}

</code-example>

<div class="alert is-helpful">

To accurately translate your Angular project, you must decide which languages and locales you are targeting for internationalization.

为了准确地翻译你的 Angular 项目，你必须决定你的国际化目标语言和地区。

Many countries share the same language, but differ in usage.
The differences include grammar, punctuation, formats for currency, decimal numbers, dates, and so on.

许多国家使用相同的语言，但用法上有些差异。这些差异包括语法、标点符号、货币格式、十进制数字、日期等。

</div>

For the examples in this guide, use the following languages and locales.

对于本指南中的示例，使用了如下语言和语言环境。

| Language | Locale | Unicode locale ID |
| :------- | :----- | :---------------- |
| 语言 | 地区 | Unicode 语言环境 ID |
| English | Canada | `en-CA` |
| 英语 | 加拿大 | `en-CA` |
| English | United States of America | `en-US` |
| 英语 | 美国 | `en-US` |
| French | Canada | `fr-CA` |
| 法语 | 加拿大 | `fr-CA` |
| French | France | `fr-FR` |
| 法语 | 法国 | `fr-FR` |

The [Angular repository][GithubAngularAngularTreeMasterPackagesCommonLocales] includes common locales.

[Angular 代码仓库][GithubAngularAngularTreeMasterPackagesCommonLocales]中包括常见的一些语言环境。

<div class="callout is-helpful">

For a list of language codes, see [ISO 639-2][LocStandardsIso6392].

有关语言代码列表，请参阅 [ISO 639-2][LocStandardsIso6392]。

<!--todo: Is this accurate.  ISO 639-2 is 3 digit.  ISO 639-1 is 2 digit.  Reference: http://www.loc.gov/standards/iso639-2/php/code_list.php -->

</div>

## Set the source locale ID

## 设置源语言环境 ID

Use the Angular CLI to set the source language in which you are writing the component template and code.

使用 Angular CLI 设置编写组件模板和代码所用的源语言。

By default, Angular uses `en-US` as the source locale of your project.

默认情况下，Angular 使用 `en-US` 作为项目的源语言环境。

To change the source locale of your project for the build, complete the following actions.

要为此构建更改项目的源语言环境，请完成以下操作。

1. Open the [`angular.json`][AioGuideWorkspaceConfig] workspace build configuration file

   打开工作空间构建配置文件 [`angular.json`][AioGuideWorkspaceConfig]

1. Change the source locale in the `sourceLocale` field

   在 `sourceLocale` 字段中更改源语言环境

## What's next

## 下一步是什么

* [Format data based on locale][AioGuideI18nCommonFormatDataLocale]

  [根据语言环境格式化数据][AioGuideI18nCommonFormatDataLocale]

<!-- links -->

[AioGuideI18nCommonFormatDataLocale]: guide/i18n-common-format-data-locale "Format data based on locale | Angular"

[AioGuideI18nCommonMerge]: guide/i18n-common-merge "Merge translations into the application | Angular"

[AioGuideWorkspaceConfig]: guide/workspace-config "Angular workspace configuration | Angular"

<!-- external links -->

[GithubAngularAngularTreeMasterPackagesCommonLocales]: https://github.com/angular/angular/tree/master/packages/common/locales "angular/packages/common/locales | angular/angular | GitHub"

[LocStandardsIso6392]: http://www.loc.gov/standards/iso639-2 "ISO 639-2 Registration Authority | Library of Congress"

[RfcEditorInfoBcp47]: https://www.rfc-editor.org/info/bcp47 "BCP 47 | RFC Editor"

[UnicodeCldrDevelopmentCoreSpecification]: https://cldr.unicode.org/development/core-specification "Core Specification | Unicode CLDR Project"

[UnicodeCldrDevelopmentCoreSpecificationHVgyyng33o798]: https://cldr.unicode.org/development/core-specification#h.vgyyng33o798 "Unicode Language and Locale Identifiers - Core Specification | Unicode CLDR Project"

<!-- end links -->

@reviewed 2021-10-28

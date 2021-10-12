# Refer to locales by ID

# 通过 ID 引用语言环境

{@a setting-up-locale}
{@a setting-up-the-locale-of-your-app}

Refer to a locale using the Unicode *locale identifier* (ID), which specifies the language, country, and an optional code for further variants or subdivisions.

使用 Unicode *语言环境标识符*(ID) 引用语言环境，该标识符会指定语言、国家/地区以及用于更下级变体或细分的可选代码。

<div class="callout is-helpful">

<header>Unicode locale identifiers</header>

<header>Unicode 语言环境标识符</header>

* For a list of language codes, see [ISO 639-2][LocStandardsIso6392].

  有关语言代码的列表，请参阅 [ISO 639-2][LocStandardsIso6392]。

* IDs conform to the Unicode Common Locale Data Repository (CLDR).
  For more information about Unicode locale identifiers, see [CLDR core specification][UnicodeCldrCoreSpecUnicodeLanguageAndLocaleIdentifiers].

  ID 符合 Unicode 通用语言环境数据存储库 (CLDR)。有关 Unicode 语言环境标识符的更多信息，请参阅 [CLDR 核心规范][UnicodeCldrCoreSpecUnicodeLanguageAndLocaleIdentifiers]。

* CLDR and Angular base their identifiers on [BCP47 tags][RfcEditorInfoBcp47].

  CLDR 和 Angular 的标识符基于 [BCP47 标签][RfcEditorInfoBcp47]。

</div>

The ID consists of a language identifier, such as `en` for English or `fr` for French, followed by a dash (`-`) and a locale extension, such as `US` for the United States or `CA` for Canada.
For example, `en-US` refers to English in the United States, and `fr-CA` refers to French in Canada.
Angular uses this ID to find the correct corresponding locale data.

ID 由语言标识符组成，例如 `en` 表示英语，`fr` 表示法语，后跟短划线 (`-`) 和语言环境扩展，例如 `US` 表示美国或 `CA` 表示加拿大。例如，`en-US` 表示美国英语， `fr-CA` 表示加拿大法语。 Angular 要用此 ID 来查找相应的语言环境数据。

<div class="alert is-helpful">

Many countries, such as France and Canada, use the same language (French, identified as `fr`) but differ in grammar, punctuation, and formats for currency, decimal numbers, and dates.
Use a more specific locale ID, such as French for Canada (`fr-CA`), when localizing your application.

许多国家/地区，例如法国和加拿大，使用相同的语言（法语，标识为 `fr` ），但在语法、标点符号和货币、十进制数字和日期格式方面有所不同。本地化你的应用程序时，请使用更具体的语言环境 ID，例如加拿大法语 ( `fr-CA` )。

</div>

Angular by default uses `en-US` (English in the United States) as the source locale of your application.

默认情况下，Angular 使用 `en-US` （美国英语）作为应用程序的源语言环境。

The [Angular repository][GithubAngularAngularTreeMasterPackagesCommonLocales] includes common locales.
To change the source locale of your application for the build, set the source locale in the `sourceLocale` field in the [workspace configuration][AioGuideWorkspaceConfig] file (`angular.json`) of your application.
The build process (described in [Merge translations into the app][AioGuideI18nCommonMerge] in this guide) uses the `angular.json` file of your application to automatically set the [`LOCALE_ID`][AioApiCoreLocaleId] token and load the locale data.

[Angular 存储库][GithubAngularAngularTreeMasterPackagesCommonLocales] 包括一些常见的语言环境。要在构建时更改应用程序的源语言环境，请在应用程序的[工作区配置][AioGuideWorkspaceConfig] 文件 ( `angular.json` ) 的 `sourceLocale` 字段中设置源语言环境。构建过程（在本指南的 [合并翻译到应用程序][AioGuideI18nCommonMerge] 中会讲到）使用应用程序的 `angular.json` 文件自动设置 [ `LOCALE_ID` ][AioApiCoreLocaleId] 令牌并加载语言环境数据。

<!-- links -->

[AioGuideI18nCommonMerge]: guide/i18n-common-merge "Merge translations into the application | Angular"

[AioApiCoreLocaleId]: api/core/LOCALE_ID "LOCALE_ID | Core - API | Angular"

[AioGuideWorkspaceConfig]: guide/workspace-config "Angular workspace configuration | Angular"

<!-- external links -->

[GithubAngularAngularTreeMasterPackagesCommonLocales]: https://github.com/angular/angular/tree/master/packages/common/locales "angular/packages/common/locales | angular/angular | GitHub"

[LocStandardsIso6392]: http://www.loc.gov/standards/iso639-2 "ISO 639-2 Registration Authority | Library of Congress"

[RfcEditorInfoBcp47]: https://www.rfc-editor.org/info/bcp47 "BCP 47 | RFC Editor"

[UnicodeCldrCoreSpecUnicodeLanguageAndLocaleIdentifiers]: http://cldr.unicode.org/core-spec#Unicode_Language_and_Locale_Identifiers "Unicode Language and Locale Identifiers - Core Specification | CLDR - Unicode Common Locale Data Repository | Unicode"

<!-- end links -->

@reviewed 2021-09-15

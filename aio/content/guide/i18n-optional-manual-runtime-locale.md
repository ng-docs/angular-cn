# Set the runtime locale manually

# 手动设置运行时语言环境

<!--todo: The Angular CLI sets the locale ID token as part of the translation. -->

<!--todo: To override the provider for the locale ID token. -->

The initial installation of Angular already contains locale data for English in the United States (`en-US`).
The [Angular CLI][AioCliMain] automatically includes the locale data and sets the `LOCALE_ID` value when you use the `--localize` option with [`ng build`][AioCliBuild] command.

Angular 的初始安装中已经包含了美国英语 (`en-US`) 的语言环境数据。当你将 `--localize` 选项与 [`ng build`][AioCliBuild] 命令一起使用时，[Angular CLI][AioCliMain] 会自动包含语言环境数据并设置 `LOCALE_ID` 值。

To manually set the runtime locale of an application to one other than the automatic value, complete the following actions.

要将应用程序的运行时语言环境手动设置为自动值以外的一种，请完成以下操作。

1. Search for the Unicode locale ID in the language-locale combination in the [`@angular/common/locales/`][UnpkgBrowseAngularCommonLocales] directory.

   在 [Angular 代码仓][GithubAngularAngularTreeMasterPackagesCommonLocales] 中的 language-locale 环境组合中搜索 Unicode 语言环境 ID。

1. Set the [`LOCALE_ID`][AioApiCoreLocaleId] token.

   设置 [`LOCALE_ID`][AioApiCoreLocaleId] 令牌。

The following example sets the value of `LOCALE_ID` to `fr` for French.

以下示例将 `LOCALE_ID` 的值设置为法语的 `fr`。

<code-example header="src/app/app.module.ts" path="i18n/doc-files/app.module.ts" region="locale-id"></code-example>

<!-- links -->

[AioApiCoreLocaleId]: api/core/LOCALE_ID "LOCALE_ID | Core - API | Angular"

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"

[AioCliBuild]: cli/build "ng build | CLI | Angular"

<!-- external links -->

[UnpkgBrowseAngularCommonLocales]: https://unpkg.com/browse/@angular/common/locales "@angular/common/locales | Unpkg"

<!-- end links -->

@reviewed 2022-02-28
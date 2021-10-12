# Set the source locale manually

# 手动设置源语言环境

{@a set-source-manually}

Angular already contains locale data for `en-US`.
The Angular CLI automatically includes the locale data and sets the `LOCALE_ID` value when you use the `--localize` option with [`ng build`][AioCliBuild].

Angular 已经包含 `en-US` 语言环境数据。当你将 `--localize` 选项与 [ `ng build` ][AioCliBuild] 一起使用时，Angular CLI 会自动包含语言环境数据并设置 `LOCALE_ID` 的值。

To manually set the source locale of an application to one other than the automatic value, complete the following actions.

要将应用程序的源语言环境手动设置为自动值以外的其他语言环境，请完成以下操作。

1. Search for the ID in the language-locale combination in [the Angular repository][GithubAngularAngularTreeMasterPackagesCommonLocales].

   在 [Angular 存储库][GithubAngularAngularTreeMasterPackagesCommonLocales] 中的“语言-语言环境”组合中搜索 ID。

1. Set the [`LOCALE_ID`][AioApiCoreLocaleId] token.

   设置 [ `LOCALE_ID` ][AioApiCoreLocaleId] 令牌。

The following example sets the value of `LOCALE_ID` to `fr` for French.

以下示例将 `LOCALE_ID` 的值设置为法语的 `fr` 。

<code-example path="i18n/doc-files/app.module.ts" header="src/app/app.module.ts" region="locale-id"></code-example>

<!-- links -->

[AioApiCoreLocaleId]: api/core/LOCALE_ID "LOCALE_ID | Core - API | Angular"

[AioCliBuild]: cli/build "ng build | CLI | Angular"

<!-- external links -->

[GithubAngularAngularTreeMasterPackagesCommonLocales]: https://github.com/angular/angular/tree/master/packages/common/locales "angular/packages/common/locales | angular/angular | GitHub"

<!-- end links -->

@reviewed 2021-09-15

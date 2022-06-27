# Set the runtime locale manually

<!--todo: The Angular CLI sets the locale ID token as part of the translation. -->

<!--todo: To override the provider for the locale ID token. -->

The initial installation of Angular already contains locale data for English in the United States (`en-US`).
The [Angular CLI][AioCliMain] automatically includes the locale data and sets the `LOCALE_ID` value when you use the `--localize` option with [`ng build`][AioCliBuild] command.

To manually set the runtime locale of an application to one other than the automatic value, complete the following actions.

要将应用程序的运行时语言环境手动设置为自动值以外的一种，请完成以下操作。

1. Search for the Unicode locale ID in the language-locale combination in the [`@angular/common/locales/`][UnpkgBrowseAngularCommonLocales] directory.

1. Set the [`LOCALE_ID`][AioApiCoreLocaleId] token.

The following example sets the value of `LOCALE_ID` to `fr` for French.

以下示例将 `LOCALE_ID` 的值设置为法语的 `fr` 。

<code-example header="src/app/app.module.ts" path="i18n/doc-files/app.module.ts" region="locale-id"></code-example>

<!-- links -->

[AioApiCoreLocaleId]: api/core/LOCALE_ID "LOCALE_ID | Core - API | Angular"

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"

[AioCliBuild]: cli/build "ng build | CLI | Angular"

<!-- external links -->

[UnpkgBrowseAngularCommonLocales]: https://unpkg.com/browse/@angular/common/locales "@angular/common/locales | Unpkg"

<!-- end links -->

@reviewed 2022-02-28
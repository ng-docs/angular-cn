Set the runtime locale manually

手动设置运行时语言环境

The initial installation of Angular already contains locale data for English in the United States \(`en-US`\).
The [Angular CLI][AioCliMain] automatically includes the locale data and sets the `LOCALE_ID` value when you use the `--localize` option with [`ng build`][AioCliBuild] command.

Angular 的初始安装中已经包含了美国英语（`en-US`）的语言环境数据。当你将 `--localize` 选项与 [`ng build`][AioCliBuild] 命令一起使用时，[Angular CLI][AioCliMain] 会自动包含语言环境数据并设置 `LOCALE_ID` 值。

To manually set the runtime locale of an application to one other than the automatic value, complete the following actions.

要将应用程序的运行时语言环境手动设置为自动值以外的一种，请完成以下操作。

Search for the Unicode locale ID in the language-locale combination in the [`@angular/common/locales/`][UnpkgBrowseAngularCommonLocales] directory.

在 [`@angular/common/locales/`][UnpkgBrowseAngularCommonLocales] 目录的 language-locale 环境组合中搜索 Unicode 语言环境 ID。

Set the [`LOCALE_ID`][AioApiCoreLocaleId] token.

设置 [`LOCALE_ID`][AioApiCoreLocaleId] 令牌。

The following example sets the value of `LOCALE_ID` to `fr` for French.

以下示例将 `LOCALE_ID` 的值设置为法语的 `fr`。
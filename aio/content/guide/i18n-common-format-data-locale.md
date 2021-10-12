# Format data based on locale

# 根据语言环境格式化数据

{@a i18n-pipes}

Angular provides the following built-in data transformation [pipes][AioGuideGlossaryPipe]. The data transformation pipes use the [`LOCALE_ID`][AioApiCoreLocaleId] token to format data based on rules of each locale.

Angular 提供了以下内置的数据转换[管道][AioGuideGlossaryPipe]。数据转换管道会使用 [`LOCALE_ID`][AioApiCoreLocaleId] 标记来根据每个语言环境的规则来格式化数据。

* [`DatePipe`][AioApiCommonDatepipe]: Formats a date value.

  [ `DatePipe` ][AioApiCommonDatepipe]：格式化日期值。

* [`CurrencyPipe`][AioApiCommonCurrencypipe]: Transforms a number to a currency string.

  [ `CurrencyPipe` ][AioApiCommonCurrencypipe]：将数字转换为货币字符串。

* [`DecimalPipe`][AioApiCommonDecimalpipe]: Transforms a number into a decimal number string.

  [ `DecimalPipe` ][AioApiCommonDecimalpipe]：将数字转换为十进制数字字符串。

* [`PercentPipe`][AioApiCommonPercentpipe]: Transforms a number to a percentage string.

  [ `PercentPipe` ][AioApiCommonPercentpipe]：将数字转换为百分比字符串。

For example, `{{today | date}}` uses `DatePipe` to display the current date in the format for the locale in `LOCALE_ID`.

例如， `{{today | date}}` 会使用 `DatePipe` 以 `LOCALE_ID` 中语言环境的格式显示当前日期。

To override the value of `LOCALE_ID`, add the `locale` parameter. For example, to force the currency to use `en-US` no matter which language-locale you set for `LOCALE_ID`, use this form: `{{amount | currency : 'en-US'}}`.

要覆盖 `LOCALE_ID` 的值，请添加 `locale` 参数。例如，无论你为 `LOCALE_ID` 设置哪种语言语言环境，要强制货币使用 `en-US` ，请使用以下形式： `{{amount | currency : 'en-US'}}` 。

<!-- links -->

[AioApiCommonCurrencypipe]: api/common/CurrencyPipe "CurrencyPipe | Common - API | Angular"

[AioApiCommonDatepipe]: api/common/DatePipe "DatePipe | Common - API | Angular"

[AioApiCommonDecimalpipe]: api/common/DecimalPipe "DecimalPipe | Common - API | Angular"

[AioApiCommonPercentpipe]: api/common/PercentPipe "PercentPipe | Common - API | Angular"

[AioApiCoreLocaleId]: api/core/LOCALE_ID "LOCALE_ID | Core - API | Angular"

[AioGuideGlossaryPipe]: guide/glossary#pipe "pipe - Glossary | Angular"

<!-- external links -->

<!-- end links -->

@reviewed 2021-09-15

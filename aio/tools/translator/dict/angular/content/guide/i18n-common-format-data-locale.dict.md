Format data based on locale

根据语言环境格式化数据

Angular provides the following built-in data transformation [pipes][AioGuideGlossaryPipe].
The data transformation pipes use the [`LOCALE_ID`][AioApiCoreLocaleId] token to format data based on rules of each locale.

Angular 提供了以下内置的数据转换[管道][AioGuideGlossaryPipe]。数据转换管道会使用 [`LOCALE_ID`][AioApiCoreLocaleId] 令牌来根据每个语言环境的规则来格式化数据。

[`PercentPipe`][AioApiCommonPercentpipe]

[`PercentPipe`][AioApiCommonPercentpipe]

Transforms a number into a percentage string.

将数字转换为百分比字符串。

[`DecimalPipe`][AioApiCommonDecimalpipe]

[`DecimalPipe`][AioApiCommonDecimalpipe]

Transforms a number into a decimal number string.

将数字转换为十进制数字字符串。

[`CurrencyPipe`][AioApiCommonCurrencypipe]

[`CurrencyPipe`][AioApiCommonCurrencypipe]

Transforms a number into a currency string.

将数字转换为货币字符串。

[`DatePipe`][AioApiCommonDatepipe]

[`DatePipe`][AioApiCommonDatepipe]

Formats a date value.

格式化日期值。

Data transformation pipe

数据转换管道

Details

详情

Use DatePipe to display the current date

使用 DatePipe 显示当前日期

To display the current date in the format for the current locale, use the following format for the `DatePipe`.

要以当前语言环境的格式显示当前日期，请对 `DatePipe` 使用以下格式。

Override current locale for CurrencyPipe

改写 CurrencyPipe 的当前语言环境

Add the `locale` parameter to the pipe to override the current value of `LOCALE_ID` token.

将 `locale` 参数添加到此管道以覆盖 `LOCALE_ID` 令牌的当前值。

To force the currency to use American English \(`en-US`\), use the following format for the `CurrencyPipe`

要强制货币使用美式英语（`en-US`），请以如下格式使用 `CurrencyPipe`

What's next

下一步呢？

[Prepare component for translation][AioGuideI18nCommonPrepare]

[准备翻译模板][AioGuideI18nCommonPrepare]
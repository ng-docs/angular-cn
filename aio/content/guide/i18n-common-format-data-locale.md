# Format data based on locale

# 基于语言环境格式化数据

Angular provides the following built-in data transformation [pipes][AioGuideGlossaryPipe].
The data transformation pipes use the [`LOCALE_ID`][AioApiCoreLocaleId] token to format data based on rules of each locale.

| Data transformation pipe | Details |
| :----------------------- | :------ |
| 数据转换管道 | 详情 |
| [`DatePipe`][AioApiCommonDatepipe] | Formats a date value. |
| [`DatePipe`][AioApiCommonDatepipe] | 格式化日期值。 |
| [`CurrencyPipe`][AioApiCommonCurrencypipe] | Transforms a number into a currency string. |
| [`CurrencyPipe`][AioApiCommonCurrencypipe] | 将数字转换为货币字符串。 |
| [`DecimalPipe`][AioApiCommonDecimalpipe] | Transforms a number into a decimal number string. |
| [`DecimalPipe`][AioApiCommonDecimalpipe] | 将数字转换为十进制数字字符串。 |
| [`PercentPipe`][AioApiCommonPercentpipe] | Transforms a number into a percentage string. |
| [`PercentPipe`][AioApiCommonPercentpipe] | 将数字转换为百分比字符串。 |

## Use DatePipe to display the current date

## 使用 DatePipe 显示当前日期

To display the current date in the format for the current locale, use the following format for the `DatePipe`.

要以当前语言环境的格式显示当前日期，请对 `DatePipe` 使用以下格式。

<!--todo: replace with code-example -->

<code-example format="typescript" language="typescript">

{{ today &verbar; date }}

</code-example>

## Override current locale for CurrencyPipe

## 改写 CurrencyPipe 的当前语言环境

Add the `locale` parameter to the pipe to override the current value of `LOCALE_ID` token.

将 `locale` 参数添加到此管道以覆盖 `LOCALE_ID` 标记的当前值。

To force the currency to use American English (`en-US`), use the following format for the `CurrencyPipe`

要强制货币使用美式英语 ( `en-US` )，请以如下格式使用 `CurrencyPipe`

<!--todo: replace with code-example -->

<code-example format="typescript" language="typescript">

{{ amount &verbar; currency : 'en-US' }}

</code-example>

<div class="alert is-helpful">

**NOTE**: <br />
The locale specified for the `CurrencyPipe` overrides the global `LOCALE_ID` token of your application.

</div>

## What's next

## 下一步是什么

* [Prepare templates for translations][AioGuideI18nCommonPrepare]

<!-- links -->

[AioApiCommonCurrencypipe]: api/common/CurrencyPipe "CurrencyPipe | Common - API | Angular"

[AioApiCommonDatepipe]: api/common/DatePipe "DatePipe | Common - API | Angular"

[AioApiCommonDecimalpipe]: api/common/DecimalPipe "DecimalPipe | Common - API | Angular"

[AioApiCommonPercentpipe]: api/common/PercentPipe "PercentPipe | Common - API | Angular"

[AioApiCoreLocaleId]: api/core/LOCALE_ID "LOCALE_ID | Core - API | Angular"

[AioGuideGlossaryPipe]: guide/glossary#pipe "pipe - Glossary | Angular"

[AioGuideI18nCommonPrepare]: guide/i18n-common-prepare "Prepare templates for translations | Angular"

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
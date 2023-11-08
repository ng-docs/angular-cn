Formats a value according to digit options and locale rules.
Locale determines group sizing and separator,
decimal point character, and other locale-specific configurations.

根据数字选项和区域设置规则格式化值。区域设置确定组的大小和分隔符、小数点字符和其他特定于区域设置的配置。

The value's decimal representation is specified by the `digitsInfo`
parameter, written in the following format:<br>

值的十进制表示由 `digitsInfo` 参数指定，格式如下：

`minIntegerDigits`:
The minimum number of integer digits before the decimal point.
Default is 1.

`minIntegerDigits`：小数点前的最小整数位数。默认值为 1。

`minFractionDigits`:
The minimum number of digits after the decimal point.
Default is 0.

`minFractionDigits`：小数点后的最小位数。默认值为 0。

`maxFractionDigits`:
The maximum number of digits after the decimal point.
Default is 3.

`maxFractionDigits`：小数点后的最大位数。默认值为 3。

If the formatted value is truncated it will be rounded using the "to-nearest" method:

如果格式化的值被截断，将使用“to-nearest”方法将其四舍五入：

locale

区域设置

`locale` will format a value according to locale rules.
Locale determines group sizing and separator,
decimal point character, and other locale-specific configurations.

`locale` 将根据区域设置规则格式化值。区域设置确定组的大小和分隔符、小数点字符和其他特定于区域设置的配置。

When not supplied, uses the value of `LOCALE_ID`, which is `en-US` by default.

未提供时，使用 `LOCALE_ID` 的值，默认为 `en-US`。

See [Setting your app locale](guide/i18n-common-locale-id).

请参阅[设置你的应用程序区域设置](guide/i18n-common-locale-id)。

Example

范例

The following code shows how the pipe transforms values
according to various format specifications,
where the caller's default locale is `en-US`.

以下代码显示了管道如何根据各种格式规范转换值，其中调用者的默认区域设置是 `en-US`。

The value to be formatted.

要格式化的值。

Sets digit and decimal representation.
[See more](#digitsinfo).

设置数字和十进制表示。[查看更多](#digitsinfo)。

Specifies what locale format rules to use.
[See more](#locale).

指定要使用的语言环境格式规则。[查看更多](#locale)。

Transforms a number to a percentage
string, formatted according to locale rules that determine group sizing and
separator, decimal-point character, and other locale-specific
configurations.

将数字转换为百分比字符串，根据确定组大小和分隔符、小数点字符和其他特定于区域设置的配置的区域设置规则进行格式化。

The following code shows how the pipe transforms numbers
into text strings, according to various format specifications,
where the caller's default locale is `en-US`.

以下代码显示了管道如何根据各种格式规范将数字转换为文本字符串，其中调用者的默认区域设置是 `en-US`。

The number to be formatted as a percentage.

要格式化为百分比的数字。

Decimal representation options, specified by a string
in the following format:<br>
<code>{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}</code>.

十进制表示选项，由以下格式的字符串指定：

`minIntegerDigits`: The minimum number of integer digits before the decimal point.
Default is `1`.

`minIntegerDigits`：小数点前的最小整数位数。默认为 `1`。

`minFractionDigits`: The minimum number of digits after the decimal point.
Default is `0`.

`minFractionDigits`：小数点后的最小位数。默认值为 `0`。

`maxFractionDigits`: The maximum number of digits after the decimal point.
Default is `0`.

`maxFractionDigits`：小数点后的最大位数。默认值为 `0`。

A locale code for the locale format rules to use.
When not supplied, uses the value of `LOCALE_ID`, which is `en-US` by default.
See [Setting your app locale](guide/i18n-common-locale-id).

可选值。默认值为 `undefined`。

Transforms a number to a currency string, formatted according to locale rules
that determine group sizing and separator, decimal-point character,
and other locale-specific configurations.

将数字转换为货币字符串，根据确定组大小和分隔符、小数点字符和其他特定于区域设置的配置的区域设置规则进行格式化。

The number to be formatted as currency.

要格式化为货币的数字。

The [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code,
such as `USD` for the US dollar and `EUR` for the euro. The default currency code can be
configured using the `DEFAULT_CURRENCY_CODE` injection token.

可选值。默认值为 `this._defaultCurrencyCode`。

The format for the currency indicator. One of the following:

货币指示器的格式。以下之一：

`code`: Show the code \(such as `USD`\).

`code`：显示代码（例如 `USD`）。

`symbol`\(default\): Show the symbol \(such as `$`\).

`symbol`（默认）：显示符号（例如 `$`）。

`symbol-narrow`: Use the narrow symbol for locales that have two symbols for their
currency.
For example, the Canadian dollar CAD has the symbol `CA$` and the symbol-narrow `$`. If the
locale has no narrow symbol, uses the standard symbol for the locale.

`symbol-narrow`：对有两个货币符号的区域设置使用窄符号。例如，加元 CAD 的符号是 `CA$` 和符号-narrow `$`。如果此区域设置没有窄符号，则使用此区域设置的标准符号。

String: Use the given string value instead of a code or a symbol.
For example, an empty string will suppress the currency & symbol.

字符串：使用给定的字符串值，而不是代码或符号。例如，空字符串将抑制货币 & 符号。

Boolean \(marked deprecated in v5\): `true` for symbol and false for `code`.

布尔值（在 v5 中标记为已弃用）：symbol 为 `true`，`code` 为 false。

`minFractionDigits`: The minimum number of digits after the decimal point.
Default is `2`.

`minFractionDigits`：小数点后的最小位数。默认为 `2`。

`maxFractionDigits`: The maximum number of digits after the decimal point.
Default is `2`.
If not provided, the number will be formatted with the proper amount of digits,
depending on what the [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) specifies.
For example, the Canadian dollar has 2 digits, whereas the Chilean peso has none.

`maxFractionDigits`：小数点后的最大位数。默认为 `2`。如果未提供，则该数字将根据[ISO 4217](https://en.wikipedia.org/wiki/ISO_4217)指定的内容使用适当的位数格式化。例如，加元有 2 位，而智利比索没有。

Transforms a string into a number \(if needed\).

将字符串转换为数字（如果需要）。
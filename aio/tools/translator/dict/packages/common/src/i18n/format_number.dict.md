Transforms a number to a locale string based on a style and a format.

根据样式和格式将数字转换为区域设置字符串。

Formats a number as currency using locale rules.

使用区域设置规则将数字格式化为货币。

The number to format.

要格式化的数字。

A locale code for the locale format rules to use.

用于要使用的语言环境格式规则的语言环境代码。

A string containing the currency symbol or its name,
such as "$" or "Canadian Dollar". Used in output string, but does not affect the operation
of the function.

包含货币符号或其名称的字符串，比如 “$” 或 “加元”。在输出字符串中使用，但不影响该函数的操作。

The [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217)
currency code, such as `USD` for the US dollar and `EUR` for the euro.
Used to determine the number of digits in the decimal part.

[ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) 货币代码，比如 `USD` 表示美元，`EUR`
表示欧元。用于确定小数部分的位数。

Decimal representation options, specified by a string in the following format:
`{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`. See `DecimalPipe` for more details.

十进制表示形式的选项，通过字符串以如下格式指定：`{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`
。欲知详情，请参见 `DecimalPipe`。

The formatted currency value.

要格式化的货币值。

[Internationalization \(i18n\) Guide](/guide/i18n-overview)

[国际化（i18n）指南](guide/i18n-overview)

Formats a number as a percentage according to locale rules.

根据语言环境规则将数字格式化为百分比。

The formatted percentage value.

已格式化的百分比值。

Formats a number as text, with group sizing, separator, and other
parameters based on the locale.

将数字格式化为文本格式，并根据区域来设置组大小、分隔符和其他参数。

The formatted text string.

已格式化的文本字符串。

Parses a number.
Significant bits of this parse algorithm came from https://github.com/MikeMcl/big.js/

解析一个数字。此解析算法的重要位来自 https://github.com/MikeMcl/big.js/

Round the parsed number to the specified number of decimal places
This function changes the parsedNumber in-place

将解析后的数字四舍五入到指定的小数位此函数会就地更改 parsedNumber
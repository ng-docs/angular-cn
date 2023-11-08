Generate contents for the basic locale data file

为基本区域设置数据文件生成内容

Collect up the basic locale data \[ `localeId`, `dateTime`, `number`, `currency`, `directionality`,
`pluralCase` \].

收集基本的区域设置数据 \[ `localeId`, `dateTime`, `number`, `currency`, `directionality`,
`pluralCase` \]。

'rtl' | 'ltr'



'rtl' | “ltr”



Returns the writing direction for a locale

返回区域设置的书写方向

Returns dateTime data for a locale

返回区域设置的 dateTime 数据

`symbols: [ decimal, group, list, percentSign, plusSign, minusSign, exponential, superscriptingExponent, perMille, infinity, nan, timeSeparator, currencyDecimal?, currencyGroup? ]`
`formats: [ currency, decimal, percent, scientific ]`



Returns the number symbols and formats for a locale

返回区域设置的数字符号和格式

Returns week-end range for a locale, based on US week days

根据美国工作日返回区域设置的周末范围

each value: `[ narrow, abbreviated, wide, short? ]`

每个值：`[ narrow, abbreviated, wide, short? ]`

Returns date-related translations for a locale

返回区域设置的与日期相关的翻译

each format: `[ short, medium, long, full ]`

每个格式：`[ short, medium, long, full ]`

Returns date, time and dateTime formats for a locale

返回区域设置的日期、时间和 dateTime 格式

Returns the first day of the week, based on US week days

根据美国工作日返回一周的第一天
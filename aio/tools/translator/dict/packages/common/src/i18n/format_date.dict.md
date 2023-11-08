Formats a date according to locale rules.

基于区域规则格式化日期。

The date to format, as a Date, or a number \(milliseconds since UTC epoch\)
or an [ISO date-time string](https://www.w3.org/TR/NOTE-datetime).

要格式化的日期，是一个日期、数字（从 UTC 时代以来的毫秒数）或 ISO 字符串
\(https://www.w3.org/TR/NOTE-datetime\\\\)。

The date-time components to include. See `DatePipe` for details.

表示要包含的日期/时间部件。欲知详情，参见 `DatePipe`。

A locale code for the locale format rules to use.

一个区域代码，用来表示要使用的区域格式规则。

The time zone. A time zone offset from GMT \(such as `'+0430'`\),
or a standard UTC/GMT or continental US time zone abbreviation.
If not specified, uses host system settings.

时区。可以是 GMT 中的时区偏移（如 `'+0430'`），或一个标准的 UTC/GMT 或美国大陆时区的缩写。
如果没有指定，就会使用宿主系统中的设定。

The formatted date string.

格式化之后的日期字符串。

[Internationalization \(i18n\) Guide](/guide/i18n-overview)

[国际化（i18n）指南](guide/i18n-overview)

Create a new Date object with the given date value, and the time set to midnight.

使用给定的日期值创建一个新的 Date 对象，并将时间设置为午夜。

We cannot use `new Date(year, month, date)` because it maps years between 0 and 99 to 1900-1999.
See: https://github.com/angular/angular/issues/40377

我们不能使用 `new Date(year, month, date)` 因为它将 0 到 99 之间的年份映射到 1900-1999。请参阅：
https://github.com/angular/angular/issues/40377

Note that this function returns a Date object whose time is midnight in the current locale's
timezone. In the future we might want to change this to be midnight in UTC, but this would be a
considerable breaking change.

请注意，此函数会返回一个 Date
对象，其时间是当前区域设置的时区中的午夜。将来，我们可能希望将其更改为 UTC
午夜，但这将是一个相当大的突破性更改。

Returns a date formatter that transforms a date into its locale digit representation

返回一个日期格式化器，它负责把日期转换成它的本地数字表示法

Returns a date formatter that transforms a date into its locale string representation

返回一个日期格式化器，它负责把日期转换成它的本地字符串表示法

Returns the locale translation of a date for a given form, type and width

返回一个日期的指定格式、类型和宽度的本地化格式

Returns a date formatter that transforms a date and an offset into a timezone with ISO8601 or
GMT format depending on the width \(eg: short = +0430, short:GMT = GMT+4, long = GMT+04:30,
extended = +04:30\)

返回一个日期格式化器，它会根据宽度把日期和偏移转换成 ISO8601 或 GMT 格式的时区
（如 short = +0430, short:GMT = GMT+4, long = GMT+04:30,
extended = +04:30）。

Returns a date formatter that provides the week-numbering year for the input date.

返回一个日期格式器，该格式器为输入日期提供按周编号的年份。

Converts a value to date.

把值转换为日期。

Supported input formats:

支持的输入格式：

number: timestamp

数字：时间戳

string: numeric \(e.g. "1234"\), ISO and date strings in a format supported by
  [`Date.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse).
  Note: ISO strings without time return a date without timeoffset.

字符串：数字（如 "1234"）、ISO 格式和
[`Date.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse)
  所支持的日期字符串格式。
  注意：不带时间的 ISO 字符串会返回一个没有时区偏移量的日期。

Throws if unable to convert to a date.

如果不能转换成日期，则抛出异常。

Converts a date in ISO8601 to a Date.
Used instead of `Date.parse` because of browser discrepancies.

把 ISO8601 格式的字符串转换成 `Date` 对象。
由于浏览器的差异而不能使用 `Date.parse`。
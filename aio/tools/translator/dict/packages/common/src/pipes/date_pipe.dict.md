use DATE_PIPE_DEFAULT_OPTIONS token to configure DatePipe

使用 DATE_PIPE_DEFAULT_OPTIONS 令牌来配置 DatePipe

Optionally-provided default timezone to use for all instances of `DatePipe` \(such as `'+0430'`\).
If the value isn't provided, the `DatePipe` will use the end-user's local system timezone.

用于所有 `DatePipe` 实例的（可选）提供的默认时区（例如 `'+0430'`）。如果未提供该值，则
`DatePipe` 将使用最终用户的本地系统时区。

Various date pipe default values can be overwritten by providing this token with
the value that has this interface.

可以通过向此令牌提供具有此接口的值来覆盖各种日期管道默认值。

For example:

例如：

Override the default date format by providing a value using the token:

通过使用令牌提供值来覆盖默认日期格式：

Override the default timezone by providing a value using the token:

通过使用令牌提供值来覆盖默认时区：

DI token that allows to provide default configuration for the `DatePipe` instances in an
application. The value is an object which can include the following fields:

允许为应用程序中的 `DatePipe` 实例提供默认配置的 DI 令牌。该值是一个对象，可以包含以下字段：

`dateFormat`: configures the default date format. If not provided, the `DatePipe`
will use the 'mediumDate' as a value.

`dateFormat`：配置默认日期格式。如果未提供，`DatePipe` 将使用 'mediumDate' 作为值。

`timezone`: configures the default timezone. If not provided, the `DatePipe` will
use the end-user's local system timezone.

`timezone`：配置默认时区。如果未提供，`DatePipe` 将使用最终用户的本地系统时区。

Formats a date value according to locale rules.

根据区域设置规则格式化日期值。

`DatePipe` is executed only when it detects a pure change to the input value.
A pure change is either a change to a primitive input value
\(such as `String`, `Number`, `Boolean`, or `Symbol`\),
or a changed object reference \(such as `Date`, `Array`, `Function`, or `Object`\).

`DatePipe` 仅当检测到输入值发生纯粹更改时才会执行。纯更改是对原始输入值的更改（例如 `String`、`Number`、`Boolean` 或 `Symbol`），或者是更改的对象引用（例如 `Date`、`Array`、`Function` 或 `Object`）。

Note that mutating a `Date` object does not cause the pipe to be rendered again.
To ensure that the pipe is executed, you must create a new `Date` object.

请注意，更改 `Date` 对象不会导致管道再次渲染。为确保管道被执行，你必须创建一个新的 `Date` 对象。

Only the `en-US` locale data comes with Angular. To localize dates
in another language, you must import the corresponding locale data.
See the [I18n guide](guide/i18n-common-format-data-locale) for more information.

Angular 只自带了 `en-US` 区域的数据。要想在其它语言中对日期进行本地化，你必须导入相应的区域数据。
欲知详情，参见 [I18n guide](guide/i18n-common-format-data-locale)。

The time zone of the formatted value can be specified either by passing it in as the second
parameter of the pipe, or by setting the default through the `DATE_PIPE_DEFAULT_OPTIONS`
injection token. The value that is passed in as the second parameter takes precedence over
the one defined using the injection token.

可以通过将格式化值的时区作为管道的第二个参数传入，或通过 `DATE_PIPE_DEFAULT_TIMEZONE` 注入令牌设置默认值来指定格式化值的时区。作为第二个参数传入的值优先于使用注入令牌定义的值。

The result of this pipe is not reevaluated when the input is mutated. To avoid the need to
reformat the date on every change-detection cycle, treat the date as an immutable object
and change the reference when the pipe needs to run again.

当输入值发生变化时，该管道的结果并不会改变。如果不想在每个变更检测周期中都强制重新格式化该日期，请把日期看做一个不可变对象，
当需要让该管道重新运行时，请赋给它一个新的对象，以更改它的引用。

Pre-defined format options

预定义的格式选项

Option

选项

Equivalent to

相当于

Examples \(given in `en-US` locale\)

示例（在 `en-US` 区域设置中给出）

Custom format options

自定义格式选项

You can construct a format string using symbols to specify the components
of a date-time value, as described in the following table.
Format details depend on the locale.
Fields marked with \(\*\) are only available in the extra data set for the given locale.

你可以用符号构造格式字符串来指定日期时间值的组成部分，如下表所述。格式详细信息取决于区域设置。标有 \(\*\) 的字段仅在给定区域设置的额外数据集中可用。

Long localized GMT format

长本地化 GMT 格式

GMT-08:00

GMT-08:00

O, OO & OOO

O，OO & OOO

Short localized GMT format

简短的本地化 GMT 格式

GMT-8

GMT-8

ISO8601 extended format + Z indicator for offset 0 \(= XXXXX\)

ISO8601 扩展格式 + 偏移量 0 的 Z 指示器（= XXXXX）

-08:00

-08:00

GMT-8:00

GMT-8:00

Z, ZZ & ZZZ

Z、ZZ 和 ZZZ

ISO8601 basic format

ISO8601 基本格式

-0800

-0800

zzzz

zzzz

Long specific non location format \(fallback to OOOO\)

长的特定非位置格式（回退到 OOOO）

Zone

时区

z, zz & zzz

z、zz 和 zzz

Short specific non location format \(fallback to O\)

简短的特定非位置格式（回退到 O）

Numeric: 3 digits + zero padded \(= milliseconds\)

数字：3 位 + 填充零（= 毫秒）

000... 999

000... 999

SS

SS

Numeric: 2 digits + zero padded

数字：2 位数字 + 填充零

00... 99

00... 99

Fractional seconds

小数秒

S

S

Numeric: 1 digit

数字：1 位

0... 9

0... 9

ss

ss

00... 59

00... 59

Second

秒

s

s

Numeric: minimum digits

数字：最小位数

0... 59

0... 59

mm

mm

08, 59

08、59

Minute

分钟

m

m

8, 59

8、59

HH

HH

00, 23

00、23

Hour 0-23

小时 0-23

H

H

0, 23

0、23

hh

hh

01, 12

01、12

Hour 1-12

小时（1-12）

h

h

1, 12

1、12

bbbbb

bbbbb

Narrow

窄

md

md

bbbb

bbbb

Wide

宽

am, pm, midnight, noon, morning, afternoon, evening, night

am, pm, midnight, noon, morning, afternoon, evening, night

Period standalone\*

单独时段\*

b, bb & bbb

b、bb & bbb

Abbreviated

缩写

mid.

mid.

Period\*

时段\*

B, BB & BBB

B、BB 和 BBB

aaaaa

aaaaa

a/p

a/p

aaaa

aaaa

Wide \(fallback to `a` when missing\)

宽（缺失时回退到 `a`）

ante meridiem/post meridiem

ante meridiem/post meridiem

Period

时段

a, aa & aaa

a、a 和 aaa

am/pm or AM/PM

am/pm or AM/PM

cccccc

cccccc

Short

短

Tu

Tu

ccccc

ccccc

T

T

cccc

cccc

Tuesday

Tuesday

ccc

ccc

Tue

Tue

Week day standalone

单独工作日

c, cc

c, cc

2

2

Week day

工作日

E, EE & EEE

E、EE 和 EEE

dd

dd

01

01

Day of month

一个月中的哪一天

d

d

1

1

Week of month

每月的一周

W

W

1... 5

1... 5

ww

ww

01... 53

01... 53

Week of year

一年中的一周

w

w

1... 53

1… 53

September

September

Sep

Sep

LL

LL

09, 12

09、12

Month standalone

独立月

L

L

9, 12

9、12

MM

MM

Month

月份

M

M

Numeric: 4 digits or more + zero padded

数字：4 位或更多位 + 填充零

0002, 0020, 0201, 2017, 20173

0002、0020、0201、2017、20173

Numeric: 3 digits + zero padded

数字：3 位数字 + 填充零

002, 020, 201, 2017, 20173

002、020、201、2017、20173

YY

YY

02, 20, 01, 17, 73

02、20、01、17、73

Week-numbering year

周编号年份

Y

Y

2, 20, 201, 2017, 20173

2、20、201、2017、20173

yyyy

yyyy

yyy

yyy

yy

yy

Year

年份

y

y

A

A

Anno Domini

Anno Domini

Era

年代

G, GG & GGG

G、GG 和 GGG

AD

AD

Field type

字段类型

Format

格式

Description

描述

Example Value

示例值

Format examples

格式范例

These examples transform a date into various formats,
assuming that `dateObj` is a JavaScript `Date` object for
year: 2015, month: 6, day: 15, hour: 21, minute: 43, second: 11,
given in the local time for the `en-US` locale.

下面这些例子会把日期转换成多种格式。
这里假设 `dateObj` 是个 JavaScript 的 `Date` 对象：2015 年 6 月 15 日 21 时 43 分 11 秒，
使用的是 `en-US` 区域的当地时间。

Usage example

使用范例

The following component uses a date pipe to display the current date in different formats.

下列组件借助一个日期管道来以不同的格式显示当前日期。

The date expression: a `Date` object,  a number
\(milliseconds since UTC epoch\), or an ISO string \(https://www.w3.org/TR/NOTE-datetime\\\\).

日期表达式：`Date` 对象、数字（从 UTC 时代以来的毫秒数）或一个 ISO 字符串
\(https://www.w3.org/TR/NOTE-datetime\\\\)。

The date/time components to include, using predefined options or a
custom format string.  When not provided, the `DatePipe` looks for the value using the
`DATE_PIPE_DEFAULT_OPTIONS` injection token \(and reads the `dateFormat` property\).
If the token is not configured, the `mediumDate` is used as a value.

要包含的日期/时间组件，使用预定义的选项或自定义格式字符串。当未提供时，`DatePipe` 会使用
`DATE_PIPE_DEFAULT_OPTIONS` 注入令牌查找值（并读取 `dateFormat` 属性）。如果未配置令牌，则使用
`mediumDate` 作为值。

A timezone offset \(such as `'+0430'`\), or a standard UTC/GMT, or continental US
timezone abbreviation. When not provided, the `DatePipe` looks for the value using the
`DATE_PIPE_DEFAULT_OPTIONS` injection token \(and reads the `timezone` property\). If the token
is not configured, the end-user's local system timezone is used as a value.

一个时区偏移（比如 `'+0430'`）或标准的 UTC/GMT
或美国大陆时区的缩写。默认为最终用户机器上的本地系统时区。

A locale code for the locale format rules to use.
When not supplied, uses the value of `LOCALE_ID`, which is `en-US` by default.
See [Setting your app locale](guide/i18n-common-locale-id).

要使用的区域格式规则的区域代码。
如果不提供，就使用 `LOCALE_ID` 的值，默认为 `en-US`。
参见[设置应用的区域](guide/i18n-common-locale-id)。

A date string in the desired format.

指定格式的日期字符串。
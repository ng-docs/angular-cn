/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Inject, InjectionToken, LOCALE_ID, Optional, Pipe, PipeTransform} from '@angular/core';

import {formatDate} from '../i18n/format_date';

import {DatePipeConfig, DEFAULT_DATE_FORMAT} from './date_pipe_config';
import {invalidPipeArgumentError} from './invalid_pipe_argument_error';

/**
 * Optionally-provided default timezone to use for all instances of `DatePipe` (such as `'+0430'`).
 * If the value isn't provided, the `DatePipe` will use the end-user's local system timezone.
 *
 * 用于所有 `DatePipe` 实例的（可选）提供的默认时区（例如 `'+0430'`）。如果未提供该值，则
 * `DatePipe` 将使用最终用户的本地系统时区。
 *
 * @deprecated
 *
 * use DATE_PIPE_DEFAULT_OPTIONS token to configure DatePipe
 *
 * 使用 DATE_PIPE_DEFAULT_OPTIONS 令牌来配置 DatePipe
 *
 */
export const DATE_PIPE_DEFAULT_TIMEZONE = new InjectionToken<string>('DATE_PIPE_DEFAULT_TIMEZONE');

/**
 * DI token that allows to provide default configuration for the `DatePipe` instances in an
 * application. The value is an object which can include the following fields:
 *
 * 允许为应用程序中的 `DatePipe` 实例提供默认配置的 DI 令牌。该值是一个对象，可以包含以下字段：
 *
 * - `dateFormat`: configures the default date format. If not provided, the `DatePipe`
 *   will use the 'mediumDate' as a value.
 *
 *   `dateFormat` ：配置默认日期格式。如果未提供， `DatePipe` 将使用 'mediumDate' 作为值。
 *
 * - `timezone`: configures the default timezone. If not provided, the `DatePipe` will
 *   use the end-user's local system timezone.
 *
 *   `timezone` ：配置默认时区。如果未提供， `DatePipe` 将使用最终用户的本地系统时区。
 *
 * @see `DatePipeConfig`
 * @usageNotes
 *
 * Various date pipe default values can be overwritten by providing this token with
 * the value that has this interface.
 *
 * 可以通过向此令牌提供具有此接口的值来覆盖各种日期管道默认值。
 *
 * For example:
 *
 * 例如：
 *
 * Override the default date format by providing a value using the token:
 *
 * 通过使用令牌提供值来覆盖默认日期格式：
 *
 * ```typescript
 * providers: [
 *   {provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: {dateFormat: 'shortDate'}}
 * ]
 * ```
 *
 * Override the default timezone by providing a value using the token:
 *
 * 通过使用令牌提供值来覆盖默认时区：
 *
 * ```typescript
 * providers: [
 *   {provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: {timezone: '-1200'}}
 * ]
 * ```
 *
 */
export const DATE_PIPE_DEFAULT_OPTIONS =
    new InjectionToken<DatePipeConfig>('DATE_PIPE_DEFAULT_OPTIONS');

// clang-format off
/**
 * @ngModule CommonModule
 * @description
 *
 * Formats a date value according to locale rules.
 *
 * 根据区域设置规则格式化日期值。
 *
 * `DatePipe` is executed only when it detects a pure change to the input value.
 * A pure change is either a change to a primitive input value
 * (such as `String`, `Number`, `Boolean`, or `Symbol`),
 * or a changed object reference (such as `Date`, `Array`, `Function`, or `Object`).
 *
 * `DatePipe` 仅当检测到输入值发生纯粹更改时才会执行。纯更改是对原始输入值的更改（例如 `String`、`Number`、`Boolean` 或 `Symbol`），或者是更改的对象引用（例如 `Date`、`Array`、`Function` 或 `Object`）。
 *
 * Note that mutating a `Date` object does not cause the pipe to be rendered again.
 * To ensure that the pipe is executed, you must create a new `Date` object.
 *
 * 请注意，更改 `Date` 对象不会导致管道再次呈现。为确保管道被执行，你必须创建一个新的 `Date` 对象。
 *
 * Only the `en-US` locale data comes with Angular. To localize dates
 * in another language, you must import the corresponding locale data.
 * See the [I18n guide](guide/i18n-common-format-data-locale) for more information.
 *
 * Angular 只自带了 `en-US` 区域的数据。要想在其它语言中对日期进行本地化，你必须导入相应的区域数据。
 * 欲知详情，参见 [I18n guide](guide/i18n-common-format-data-locale)。
 *
 * The time zone of the formatted value can be specified either by passing it in as the second
 * parameter of the pipe, or by setting the default through the `DATE_PIPE_DEFAULT_TIMEZONE`
 * injection token. The value that is passed in as the second parameter takes precedence over
 * the one defined using the injection token.
 *
 * 可以通过将格式化值的时区作为管道的第二个参数传入，或通过 `DATE_PIPE_DEFAULT_TIMEZONE` 注入令牌设置默认值来指定格式化值的时区。作为第二个参数传入的值优先于使用注入令牌定义的值。
 * @see `formatDate()`
 * @usageNotes
 *
 * The result of this pipe is not reevaluated when the input is mutated. To avoid the need to
 * reformat the date on every change-detection cycle, treat the date as an immutable object
 * and change the reference when the pipe needs to run again.
 *
 * 当输入值发生变化时，该管道的结果并不会改变。如果不想在每个变更检测周期中都强制重新格式化该日期，请把日期看做一个不可变对象，
 * 当需要让该管道重新运行时，请赋给它一个新的对象，以更改它的引用。
 *
 * ### Pre-defined format options
 *
 * ### 预定义的格式选项
 *
 * | Option | Equivalent to | Examples (given in `en-US` locale) |
 * | ------ | ------------- | ---------------------------------- |
 * | 选项 | 相当于 | 示例（在 `en-US` 区域设置中给出） |
 * | `'short'` | `'M/d/yy, h:mm a'` | `6/15/15, 9:03 AM` |
 * | `'medium'` | `'MMM d, y, h:mm:ss a'` | `Jun 15, 2015, 9:03:01 AM` |
 * | `'long'` | `'MMMM d, y, h:mm:ss a z'` | `June 15, 2015 at 9:03:01 AM GMT+1` |
 * | `'full'` | `'EEEE, MMMM d, y, h:mm:ss a zzzz'` | `Monday, June 15, 2015 at 9:03:01 AM GMT+01:00` |
 * | `'shortDate'` | `'M/d/yy'` | `6/15/15` |
 * | `'mediumDate'` | `'MMM d, y'` | `Jun 15, 2015` |
 * | `'longDate'` | `'MMMM d, y'` | `June 15, 2015` |
 * | `'fullDate'` | `'EEEE, MMMM d, y'` | `Monday, June 15, 2015` |
 * | `'shortTime'` | `'h:mm a'` | `9:03 AM` |
 * | `'mediumTime'` | `'h:mm:ss a'` | `9:03:01 AM` |
 * | `'longTime'` | `'h:mm:ss a z'` | `9:03:01 AM GMT+1` |
 * | `'fullTime'` | `'h:mm:ss a zzzz'` | `9:03:01 AM GMT+01:00` |
 *
 *   `'fullTime'`: 等价于 `'h:mm:ss a zzzz'` (`9:03:01 AM GMT+01:00`).
 *
 * ### Custom format options
 *
 * ### 自定义格式选项
 *
 * You can construct a format string using symbols to specify the components
 * of a date-time value, as described in the following table.
 * Format details depend on the locale.
 * Fields marked with (\*) are only available in the extra data set for the given locale.
 *
 * 你可以用符号构造格式字符串来指定日期时间值的组成部分，如下表所述。格式详细信息取决于区域设置。标有 (\*) 的字段仅在给定区域设置的额外数据集中可用。
 *
 * | Field type | Format | Description | Example Value |
 * | ---------- | ------ | ----------- | ------------- |
 * | 字段类型 | 格式 | 描述 | 示例值 |
 * | Era | G, GG & GGG | Abbreviated | AD |
 * | 时代 | G、GG 和 GGG | 缩写 | 广告 |
 * |  | GGGG | Wide | Anno Domini |
 * |  | GGGG | 宽 | 安诺·多米尼 |
 * |  | GGGGG | Narrow | A |
 * |  | GGGGG | 窄 | 一个 |
 * | Year | y | Numeric: minimum digits | 2, 20, 201, 2017, 20173 |
 * | 年份 | 是 | 数字：最小位数 | 2、20、201、2017、20173 |
 * |  | yy | Numeric: 2 digits + zero padded | 02, 20, 01, 17, 73 |
 * |  | yy | 数字： 2 位数字 + 填充零 | 02、20、01、17、73 |
 * |  | yyy | Numeric: 3 digits + zero padded | 002, 020, 201, 2017, 20173 |
 * |  | 年年 | 数字： 3 位数字 + 填充零 | 002、020、201、2017、20173 |
 * |  | yyyy | Numeric: 4 digits or more + zero padded | 0002, 0020, 0201, 2017, 20173 |
 * |  | yyyy | 数字： 4 位或更多位 + 填充零 | 0002、0020、0201、2017、20173 |
 * | Week-numbering year | Y | Numeric: minimum digits | 2, 20, 201, 2017, 20173 |
 * | 周编号年份 | 是 | 数字：最小位数 | 2、20、201、2017、20173 |
 * |  | YY | Numeric: 2 digits + zero padded | 02, 20, 01, 17, 73 |
 * |  | YY | 数字： 2 位数字 + 填充零 | 02、20、01、17、73 |
 * |  | YYY | Numeric: 3 digits + zero padded | 002, 020, 201, 2017, 20173 |
 * |  | YYY | 数字： 3 位数字 + 填充零 | 002、020、201、2017、20173 |
 * |  | YYYY | Numeric: 4 digits or more + zero padded | 0002, 0020, 0201, 2017, 20173 |
 * |  | YYYY | 数字： 4 位或更多位 + 填充零 | 0002、0020、0201、2017、20173 |
 * | Month | M | Numeric: 1 digit | 9, 12 |
 * | 月份 | 中号 | 数字： 1 位 | 9、12 |
 * |  | MM | Numeric: 2 digits + zero padded | 09, 12 |
 * |  | MM | 数字： 2 位数字 + 填充零 | 09、12 |
 * |  | MMM | Abbreviated | Sep |
 * |  | 嗯 | 缩写 | 九月 |
 * |  | MMMM | Wide | September |
 * |  | MMMM | 宽 | 9 月 |
 * |  | MMMMM | Narrow | S |
 * |  | 嗯嗯 | 窄 | 小号 |
 * | Month standalone | L | Numeric: 1 digit | 9, 12 |
 * | 独立月 | 大号 | 数字： 1 位 | 9、12 |
 * |  | LL | Numeric: 2 digits + zero padded | 09, 12 |
 * |  | LL | 数字： 2 位数字 + 填充零 | 09、12 |
 * |  | LLL | Abbreviated | Sep |
 * |  | LLL | 缩写 | 九月 |
 * |  | LLLL | Wide | September |
 * |  | LLLL | 宽 | 9 月 |
 * |  | LLLLL | Narrow | S |
 * |  | LLLL | 窄 | 小号 |
 * | Week of year | w | Numeric: minimum digits | 1... 53 |
 * | 一年中的一周 | w | 数字：最小位数 | 1… 53 |
 * |  | ww | Numeric: 2 digits + zero padded | 01... 53 |
 * |  | 万维网 | 数字： 2 位数字 + 填充零 | 01... 53 |
 * | Week of month | W | Numeric: 1 digit | 1... 5 |
 * | 每月的一周 | 瓦 | 数字： 1 位 | 1... 5 |
 * | Day of month | d | Numeric: minimum digits | 1 |
 * | 一个月中的哪一天 | d | 数字：最小位数 | 1 |
 * |  | dd | Numeric: 2 digits + zero padded | 01 |
 * |  | dd | 数字： 2 位数字 + 填充零 | 01 |
 * | Week day | E, EE & EEE | Abbreviated | Tue |
 * | 工作日 | E、EE 和 EEE | 缩写 | 星期二 |
 * |  | EEEE | Wide | Tuesday |
 * |  | EEEE | 宽 | 星期二 |
 * |  | EEEEE | Narrow | T |
 * |  | EEEE | 窄 | 吨 |
 * |  | EEEEEE | Short | Tu |
 * |  | EEEEEE | 短 | 涂 |
 * | Week day standalone | c, cc | Numeric: 1 digit | 2 |
 * | 工作日独立 | c, cc | 数字： 1 位 | 2 |
 * |  | ccc | Abbreviated | Tue |
 * |  | ccc | 缩写 | 星期二 |
 * |  | cccc | Wide | Tuesday |
 * |  | cccc | 宽 | 星期二 |
 * |  | ccccc | Narrow | T |
 * |  | cccc | 窄 | 牛 |
 * |  | cccccc | Short | Tu |
 * |  | cccccc | 短 | 涂 |
 * | Period | a, aa & aaa | Abbreviated | am/pm or AM/PM |
 * | 期间 | a、a 和 aaa | 缩写 | 上午/下午或上午/下午 |
 * |  | aaaa | Wide (fallback to `a` when missing) | ante meridiem/post meridiem |
 * |  | 啊啊 | 宽（缺失时回退到 `a`） | 子午前/子午后 |
 * |  | aaaaa | Narrow | a/p |
 * |  | 啊啊啊 | 窄 | a/p |
 * | Period\* | B, BB & BBB | Abbreviated | mid. |
 * | 期间\* | B、BB 和 BBB | 缩写 | 中。 |
 * |  | BBBB | Wide | am, pm, midnight, noon, morning, afternoon, evening, night |
 * |  | BBBB | 宽 | 上午, 下午, 午夜, 中午, 早上, 下午, 晚上, 夜 |
 * |  | BBBBB | Narrow | md |
 * |  | BBBBB | 窄 | MD |
 * | Period standalone\* | b, bb & bbb | Abbreviated | mid. |
 * | 独立期间\* | b、bb & bbb | 缩写 | 中。 |
 * |  | bbbb | Wide | am, pm, midnight, noon, morning, afternoon, evening, night |
 * |  | bbbb | 宽 | 上午, 下午, 午夜, 中午, 早上, 下午, 晚上, 夜 |
 * |  | bbbbb | Narrow | md |
 * |  | bbbbb | 窄 | MD |
 * | Hour 1-12 | h | Numeric: minimum digits | 1, 12 |
 * | 1-12 小时 | 小时 | 数字：最小位数 | 1、12 |
 * |  | hh | Numeric: 2 digits + zero padded | 01, 12 |
 * |  | hh | 数字： 2 位数字 + 填充零 | 01、12 |
 * | Hour 0-23 | H | Numeric: minimum digits | 0, 23 |
 * | 小时 0-23 | 高 | 数字：最小位数 | 0、23 |
 * |  | HH | Numeric: 2 digits + zero padded | 00, 23 |
 * |  | 高 | 数字： 2 位数字 + 填充零 | 00、23 |
 * | Minute | m | Numeric: minimum digits | 8, 59 |
 * | 分钟 | 米 | 数字：最小位数 | 8、59 |
 * |  | mm | Numeric: 2 digits + zero padded | 08, 59 |
 * |  | 毫米 | 数字： 2 位数字 + 填充零 | 08、59 |
 * | Second | s | Numeric: minimum digits | 0... 59 |
 * | 第二 | s | 数字：最小位数 | 0... 59 |
 * |  | ss | Numeric: 2 digits + zero padded | 00... 59 |
 * |  | ss | 数字： 2 位数字 + 填充零 | 00... 59 |
 * | Fractional seconds | S | Numeric: 1 digit | 0... 9 |
 * | 小数秒 | 小号 | 数字： 1 位 | 0... 9 |
 * |  | SS | Numeric: 2 digits + zero padded | 00... 99 |
 * |  | SS | 数字： 2 位数字 + 填充零 | 00... 99 |
 * |  | SSS | Numeric: 3 digits + zero padded (= milliseconds) | 000... 999 |
 * |  | SSS | 数字： 3 位 + 填充零（= 毫秒） | 000... 999 |
 * | Zone | z, zz & zzz | Short specific non location format (fallback to O) | GMT-8 |
 * | 区域 | z、zz 和 zzz | 简短的特定非位置格式（回退到 O） | GMT-8 |
 * |  | zzzz | Long specific non location format (fallback to OOOO) | GMT-08:00 |
 * |  | zzzz | 长的特定非位置格式（回退到 OOOO） | GMT-08:00 |
 * |  | Z, ZZ & ZZZ | ISO8601 basic format | -0800 |
 * |  | Z、ZZ 和 ZZZ | ISO8601 基本格式 | -0800 |
 * |  | ZZZZ | Long localized GMT format | GMT-8:00 |
 * |  | ZZZZ | 长本地化 GMT 格式 | GMT-8:00 |
 * |  | ZZZZZ | ISO8601 extended format + Z indicator for offset 0 (= XXXXX) | -08:00 |
 * |  | ZZZZZ | ISO8601 扩展格式 + 偏移量 0 的 Z 指示器（= XXXXX） | -08:00 |
 * |  | O, OO & OOO | Short localized GMT format | GMT-8 |
 * |  | 哦，OO & OOO | 简短的本地化 GMT 格式 | GMT-8 |
 * |  | OOOO | Long localized GMT format | GMT-08:00 |
 * |  | OOOO | 长本地化 GMT 格式 | GMT-08:00 |
 *
 * 请注意，时区校正不适用于没有时间部分的 ISO 字符串，比如“2016-09-19”
 *
 * ### Format examples
 *
 * ### 格式范例
 *
 * These examples transform a date into various formats,
 * assuming that `dateObj` is a JavaScript `Date` object for
 * year: 2015, month: 6, day: 15, hour: 21, minute: 43, second: 11,
 * given in the local time for the `en-US` locale.
 *
 * 下面这些例子会把日期转换成多种格式。
 * 这里假设 `dateObj` 是个 JavaScript 的 `Date` 对象： 2015 年 6 月 15 日 21 时 43 分 11 秒，
 * 使用的是 `en-US` 区域的当地时间。
 *
 * ```
 * {{ dateObj | date }}               // output is 'Jun 15, 2015'
 * {{ dateObj | date:'medium' }}      // output is 'Jun 15, 2015, 9:43:11 PM'
 * {{ dateObj | date:'shortTime' }}   // output is '9:43 PM'
 * {{ dateObj | date:'mm:ss' }}       // output is '43:11'
 * ```
 *
 * ### Usage example
 *
 * ### 使用范例
 *
 * The following component uses a date pipe to display the current date in different formats.
 *
 * 下列组件借助一个日期管道来以不同的格式显示当前日期。
 *
 * ```
 * @Component({
 *  selector: 'date-pipe',
 *  template: `<div>
 *    <p>Today is {{today | date}}</p>
 *    <p>Or if you prefer, {{today | date:'fullDate'}}</p>
 *    <p>The time is {{today | date:'h:mm a z'}}</p>
 *  </div>`
 * })
 * // Get the current date and time as a date-time value.
 * export class DatePipeComponent {
 *   today: number = Date.now();
 * }
 * ```
 *
 * @publicApi
 */
// clang-format on
@Pipe({
  name: 'date',
  pure: true,
  standalone: true,
})
export class DatePipe implements PipeTransform {
  constructor(
      @Inject(LOCALE_ID) private locale: string,
      @Inject(DATE_PIPE_DEFAULT_TIMEZONE) @Optional() private defaultTimezone?: string|null,
      @Inject(DATE_PIPE_DEFAULT_OPTIONS) @Optional() private defaultOptions?: DatePipeConfig|null,
  ) {}

  /**
   * @param value The date expression: a `Date` object,  a number
   * (milliseconds since UTC epoch), or an ISO string (<https://www.w3.org/TR/NOTE-datetime>).
   *
   * 日期表达式：`Date` 对象、数字（从 UTC 时代以来的毫秒数）或一个 ISO 字符串
   * (<https://www.w3.org/TR/NOTE-datetime>)。
   * @param format The date/time components to include, using predefined options or a
   * custom format string.  When not provided, the `DatePipe` looks for the value using the
   * `DATE_PIPE_DEFAULT_OPTIONS` injection token (and reads the `dateFormat` property).
   * If the token is not configured, the `mediumDate` is used as a value.
   *
   * 要包含的日期/时间组件，使用预定义的选项或自定义格式字符串。当未提供时， `DatePipe` 会使用
   * `DATE_PIPE_DEFAULT_OPTIONS` 注入令牌查找值（并读取 `dateFormat` 属性）。如果未配置令牌，则使用
   * `mediumDate` 作为值。
   *
   * @param timezone A timezone offset (such as `'+0430'`), or a standard UTC/GMT, or continental US
   * timezone abbreviation. When not provided, the `DatePipe` looks for the value using the
   * `DATE_PIPE_DEFAULT_OPTIONS` injection token (and reads the `timezone` property). If the token
   * is not configured, the end-user's local system timezone is used as a value.
   *
   * 一个时区偏移（比如 `'+0430'`）或标准的 UTC/GMT
   * 或美国大陆时区的缩写。默认为最终用户机器上的本地系统时区。
   * @param locale A locale code for the locale format rules to use.
   * When not supplied, uses the value of `LOCALE_ID`, which is `en-US` by default.
   * See [Setting your app locale](guide/i18n-common-locale-id).
   *
   * 要使用的区域格式规则的区域代码。
   * 如果不提供，就使用 `LOCALE_ID` 的值，默认为 `en-US`。
   * 参见[设置应用的区域](guide/i18n-common-locale-id)。
   * @see `DATE_PIPE_DEFAULT_OPTIONS`
   * @returns A date string in the desired format.
   *
   * 指定格式的日期字符串。
   */
  transform(value: Date|string|number, format?: string, timezone?: string, locale?: string): string
      |null;
  transform(value: null|undefined, format?: string, timezone?: string, locale?: string): null;
  transform(
      value: Date|string|number|null|undefined, format?: string, timezone?: string,
      locale?: string): string|null;
  transform(
      value: Date|string|number|null|undefined, format?: string, timezone?: string,
      locale?: string): string|null {
    if (value == null || value === '' || value !== value) return null;

    try {
      const _format = format ?? this.defaultOptions?.dateFormat ?? DEFAULT_DATE_FORMAT;
      const _timezone =
          timezone ?? this.defaultOptions?.timezone ?? this.defaultTimezone ?? undefined;
      return formatDate(value, _format, locale || this.locale, _timezone);
    } catch (error) {
      throw invalidPipeArgumentError(DatePipe, (error as Error).message);
    }
  }
}

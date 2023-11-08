This const is used to store the locale data registered with `registerLocaleData`

此 const 用于存储在 registerLocaleData `registerLocaleData` 的区域设置数据

Register locale data to be used internally by Angular. See the
["I18n guide"](guide/i18n-common-format-data-locale) to know how to import additional locale
data.

注册要供 Angular 内部使用的语言环境数据。请参阅[“I18n
指南”](guide/i18n-common-format-data-locale)以了解如何导入其他区域设置数据。

The signature `registerLocaleData(data: any, extraData?: any)` is deprecated since v5.1

自 v5.1 以来，不推荐使用签名 `registerLocaleData(data: any, extraData?: any)`

The locale code.

区域设置代码。

The locale data.

区域设置数据。

[Internationalization \(i18n\) Guide](https://angular.io/guide/i18n-overview)

[国际化（i18n）指南](https://angular.io/guide/i18n-overview)

Finds the locale data for a given locale.

查找给定区域设置的区域设置数据。

The code of the locale whose currency code we want.

我们想要其货币代码的区域设置的代码。

The code of the default currency for the given locale.

给定区域设置的默认货币代码。

Retrieves the default currency code for the given locale.

检索给定区域设置的默认货币代码。

The default is defined as the first currency which is still in use.

默认定义为仍在使用的第一种货币。

A locale code for the locale format rules to use.

要使用的区域设置格式规则的区域设置代码。

The plural function for the locale.

语言环境的复数函数。

[Internationalization \(i18n\) Guide](/guide/i18n-overview)

[国际化（i18n）指南](https://angular.io/guide/i18n-overview)

Retrieves the plural function used by ICU expressions to determine the plural case to use
for a given locale.

检索 ICU 表达式使用的复数函数，以确定要用于给定区域设置的复数大小写。

Helper function to get the given `normalizedLocale` from `LOCALE_DATA`
or from the global `ng.common.locale`.

从 `LOCALE_DATA` 或全局 `ng.common.locale` 获取给定的 `normalizedLocale` 的帮助器函数。

Helper function to remove all the locale data from `LOCALE_DATA`.

从 `LOCALE_DATA` 删除所有区域设置数据的帮助器函数。

Index of each type of locale data from the locale data array

区域设置数据数组中每种类型的区域设置数据的索引

Index of each type of locale data from the extra locale data array

额外区域设置数据数组中每种类型的区域设置数据的索引

Index of each value in currency data \(used to describe CURRENCIES_EN in currencies.ts\)

货币数据中每个值的索引（用于在 currency.ts 中描述 CURRENCIES_EN）

Returns the canonical form of a locale name - lowercase with `_` replaced with `-`.

返回区域设置名称的规范形式 - 小写，其中 `_` 替换为 `-`。
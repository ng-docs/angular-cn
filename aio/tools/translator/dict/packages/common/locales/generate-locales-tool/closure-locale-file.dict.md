Closure-supported locale names that resolve to this locale.

解析为此区域设置的闭包支持的区域设置名称。

Canonical locale name that is used to resolve the CLDR data.

用于解析 CLDR 数据的规范区域设置名称。

Locale data. Can have a different locale name if this captures an aliased locale.

区域设置数据。如果这捕获了别名区域设置，则可以有不同的区域设置名称。

Locales used by closure that need to be captured within the Closure Locale file. Extracted from:
https://github.com/google/closure-library/blob/c7445058af72f679ef3273274e936d5d5f40b55a/closure/goog/i18n/datetimepatterns.js#L2450

闭包使用的需要在 Closure 区域设置文件中捕获的区域设置。提取自：
https://github.com/google/closure-library/blob/c7445058af72f679ef3273274e936d5d5f40b55a/closure/goog/i18n/datetimepatterns.js#L2450

Union type matching possible Closure Library locales.

与可能的 Closure 库区域设置匹配的联合类型。

Locale ID aliases to support deprecated locale ids used by Closure. Maps locales supported
by Closure library to a list of aliases that match the same locale data.

支持 Closure 使用的不推荐使用的区域设置 ID 的区域设置 ID 别名。将 Closure
库支持的区域设置映射到与相同区域设置数据匹配的别名列表。

Generate a file that contains all locale to import for closure.
Tree shaking will only keep the data for the `goog.LOCALE` locale.

生成一个包含要导入以进行关闭的所有区域设置的文件。摇树将仅保留 `goog.LOCALE` 区域设置的数据。

Generates locale data constants for all locale names within the specified
Closure Library locale.

为指定的 Closure 库区域设置中的所有区域设置名称生成区域设置数据常量。

Generates a locale data constant for the specified locale.

为指定的区域设置生成区域设置数据常量。

Creates a locale extra data constant for the given locale.

为给定的区域设置创建一个区域设置额外数据常量。

Generates a TypeScript `switch` case for the specified locale.

为指定的区域设置生成 TypeScript `switch` 例。
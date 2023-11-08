Prefix for non-`goog.getMsg` i18n-related vars.
Note: the prefix uses lowercase characters intentionally due to a Closure behavior that
considers variables like `I18N_0` as constants and throws an error when their value changes.

非 `goog.getMsg` i18n 相关的 var 的前缀。注意：前缀故意使用小写字符，因为 Closure 行为 `I18N_0`
等变量视为常量，并在它们的值更改时抛出错误。

Name of the i18n attributes

i18n 属性的名称

Prefix of var expressions used in ICUs

ICU 中使用的 var 表达式的前缀

Prefix of ICU expressions for post processing

用于后处理的 ICU 表达式的前缀

Placeholder wrapper for i18n expressions

i18n 表达式的占位符包装器

A map of placeholder names to expressions.

占位符名称到表达式的映射。

whether to camelCase the placeholder name when formatting.

格式化时是否要将占位符名称 CamelCase。

A new map of formatted placeholder names to expressions.

格式化的占位符名称到表达式的新映射。

Format the placeholder names in a map of placeholders to expressions.

将占位符映射中的占位符名称格式化为表达式。

The placeholder names are converted from "internal" format \(e.g. `START_TAG_DIV_1`\) to "external"
format \(e.g. `startTagDiv_1`\).

占位符名称会从“内部”格式（例如 `START_TAG_DIV_1`）转换为“外部”格式（例如 `startTagDiv_1`）。

The placeholder name that should be formatted

应该格式化的占位符名称

Formatted placeholder name

格式化的占位符名称

Converts internal placeholder names to public-facing format
\(for example to use in goog.getMsg call\).
Example: `START_TAG_DIV_1` is converted to `startTagDiv_1`.

将内部占位符名称转换为面向公众的格式（例如在 goog.getMsg 调用中使用）。示例：`START_TAG_DIV_1`
被转换为 `startTagDiv_1`。

Additional local prefix that should be injected into translation var name

应该注入到翻译 var name 中的额外本地前缀

Complete translation const prefix

完全翻译 const 前缀

Generates a prefix for translation const name.

为翻译 const name 生成前缀。

the name of the variable to declare.

要声明的变量名。

Generate AST to declare a variable. E.g. `var I18N_1;`.

生成 AST 以声明变量。例如 `var I18N_1;` .
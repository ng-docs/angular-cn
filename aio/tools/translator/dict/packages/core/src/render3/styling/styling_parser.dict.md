Stores the locations of key/value indexes while parsing styling.

在解析样式时存储键/值索引的位置。

In case of `cssText` parsing the indexes are like so:

在 `cssText` 解析的情况下，索引是这样的：

In case of `className` parsing the indexes are like so:

在 `className` 解析的情况下，索引是这样的：

NOTE: `value` and `valueEnd` are used only for styles, not classes.

注意：`value` 和 `valueEnd` 仅用于样式，而不用于类。

the text to substring the key from.

要作为键的子字符串的文本。

Retrieves the last parsed `key` of style.

检索 style 的最后一个解析 `key`。

Retrieves the last parsed `value` of style.

检索 style 的最后解析的 `value`。

`className` to parse

要 `className` 的类名

index where the next invocation of `parseClassNameNext` should resume.

下一次调用 `parseClassNameNext` 应该恢复的索引。

Initializes `className` string for parsing and parses the first token.

初始化 `className` 字符串以进行解析并解析第一个标记。

This function is intended to be used in this format:

此函数旨在以这种格式使用：

where the parsing should resume.

解析应该在哪里恢复。

Parses next `className` token.

解析下一个 `className` 标记。

`cssText` to parse

要解析的 `cssText`

index where the next invocation of `parseStyleNext` should resume.

下一次调用 `parseStyleNext` 应该恢复的索引。

Initializes `cssText` string for parsing and parses the first key/values.

初始化 `cssText` 字符串以进行解析并解析第一个键/值。

Parses the next `cssText` key/values.

解析下一个 `cssText` 键/值。

The styling text to parse.

要解析的样式文本。

Reset the global state of the styling parser.

重置样式解析器的全局状态。

Text to scan

要扫描的文本

Starting index of character where the scan should start.

扫描应该开始的字符的起始索引。

Ending index of character where the scan should end.

扫描应该结束的字符的结束索引。

Index of next non-whitespace character \(May be the same as `start` if no whitespace at
         that location.\)

下一个非空格字符的索引（如果该位置没有空格，可能与 `start` 相同。）

Returns index of next non-whitespace character.

返回下一个非空格字符的索引。

Index after last char in class token.

类标记中最后一个 char 之后的索引。

Returns index of last char in class token.

返回类标记中最后一个 char 的索引。

Index after last style key character.

最后一个风格键字符之后的索引。

Consumes all of the characters belonging to style key and token.

使用属于样式键和标记的所有字符。

Index after separator and surrounding whitespace.

分隔符和周围的空格之后的索引。

Consumes all whitespace and the separator `:` after the style key.

使用样式键之后的所有空格和分隔符 `:`。

Index after last style value character.

最后一个样式值字符之后的索引。

Consumes style value honoring `url()` and `""` text.

使用尊重 `url()` 和 `""` 文本的样式值。

CharCode of either `"` or `'` quote or `)` for `url(...)`.

`url(...)` 的 `"` 或 `'` 引用或 `)` 的 CharCode。

Index after quoted characters.

引用字符后的索引。

Consumes all of the quoted characters.

使用所有引用的字符。
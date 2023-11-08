Options that modify how the text is tokenized.

修改文本标记化方式的选项。

Whether to tokenize ICU messages \(considered as text nodes when false\).

是否标记 ICU 消息（为 false 时被认为是文本节点）。

How to tokenize interpolation markers.

如何标记插值标记。

The start and end point of the text to parse within the `source` string.
The entire `source` string is parsed if this is not provided.

要在 `source` 字符串中解析的文本的起点和终点。如果未提供，则会解析整个 `source` 字符串。

If this text is stored in a JavaScript string, then we have to deal with escape sequences.

如果此文本存储在 JavaScript 字符串中，那么我们就必须处理转义序列。

**Example 1:**

**示例 1：**

The `\"` must be converted to `"`.

`\"` 必须转换为 `"`。

The `\n` must be converted to a new line character in a token,
but it should not increment the current line for source mapping.

`\n` 必须转换为标记中的换行符，但它不应该增加当前行以进行源映射。

**Example 2:**

**示例 2：**

The line continuation \(`\` followed by a newline\) should be removed from a token
but the new line should increment the current line for source mapping.

应该从标记中删除行继续（`\` 后跟换行符），但新行应该增加当前行以进行源映射。

If this text is stored in an external template \(e.g. via `templateUrl`\) then we need to decide
whether or not to normalize the line-endings \(from `\r\n` to `\n`\) when processing ICU
expressions.

如果此文本存储在外部模板中（例如通过 `templateUrl`），那么我们需要决定在处理 ICU
表达式时是否对行尾进行规范化（从 `\r\n` 到 `\n`）。

If `true` then we will normalize ICU expression line endings.
The default is `false`, but this will be switched in a future major release.

如果 `true`，那么我们将规范化 ICU 表达式行结尾。默认值为 `false`
，但这将在未来的主要版本中切换。

An array of characters that should be considered as leading trivia.
Leading trivia are characters that are not important to the developer, and so should not be
included in source-map segments.  A common example is whitespace.

应被视为前导琐事的字符数组。前导琐事是对开发人员不重要的字符，因此不应包含在 source-map
段中。一个常见的例子是空格。

If true, do not convert CRLF to LF.

如果为 true，则不要将 CRLF 转换为 LF。

The html source file being tokenized.

被标记化的 html 源文件。

A function that will retrieve a tag definition for a given tag name.

一个函数，它将检索给定标签名称的标签定义。

Configuration of the tokenization.

标记化的配置。

The \_Tokenizer uses objects of this type to move through the input text,
extracting "parsed characters". These could be more than one actual character
if the text contains escape sequences.

\_Tokenizer
使用此类型的对象在输入文本中移动，提取“解析的字符”。如果文本包含转义序列，这些可能是多个实际字符。

Initialize the cursor.

初始化光标。

The parsed character at the current cursor position.

当前光标位置的解析字符。

Advance the cursor by one parsed character.

将光标前进一个解析后的字符。

Get a span from the marked start point to the current point.

获取从标记的起点到当前点的跨度。

Get the parsed characters from the marked start point to the current point.

获取从标记的起点到当前点的解析字符。

The number of characters left before the end of the cursor.

光标结尾之前剩下的字符数。

The number of characters between `this` cursor and `other` cursor.

`this` 光标与 `other` 光标之间的字符数。

Make a copy of this cursor

复制此游标

Process the escape sequence that starts at the current position in the text.

处理从文本中当前位置开始的转义序列。

This method is called to ensure that `peek` has the unescaped value of escape sequences.

调用此方法是为了确保 `peek` 具有转义序列的未转义值。
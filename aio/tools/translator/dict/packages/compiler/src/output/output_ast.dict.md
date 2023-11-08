Calculates whether this expression produces the same value as the given expression.
Note: We don't check Types nor ParseSourceSpans nor function arguments.

计算此表达式是否生成与给定表达式相同的值。注意：我们不检查 Types、ParseSourceSpans
或函数参数。

Return true if the expression is constant.

如果表达式是常量，则返回 true。

the name of this placeholder \(e.g. `PH_1`\).

此占位符的名称（例如 `PH_1`）。

the location of this placeholder in its localized message the source code.

此占位符在其本地化消息源代码中的位置。

reference to another message that this placeholder is associated with.
The `associatedMessage` is mainly used to provide a relationship to an ICU message that has
been extracted out from the message containing the placeholder.

对此占位符关联的另一条消息的引用。`associatedMessage` 主要用于提供与 ICU
消息的关系，该消息已从包含占位符的消息中提取出来。

Create a new instance of a `PlaceholderPiece`.

创建 `PlaceholderPiece` 的新实例。

The metadata to serialize

要序列化的元数据

The first part of the tagged string

标记字符串的第一部分

Serialize the given `meta` and `messagePart` into "cooked" and "raw" strings that can be used
in a `$localize` tagged string. The format of the metadata is the same as that parsed by
`parseI18nMeta()`.

将给定的 `meta` 和 `messagePart` 序列化为可在 `$localize`
标记字符串中使用的“cooked”和“raw”字符串。元数据的格式与 `parseI18nMeta()` 解析的格式相同。

The index of the message part to serialize.

要序列化的消息部分的索引。

Serialize the given `placeholderName` and `messagePart` into "cooked" and "raw" strings that
can be used in a `$localize` tagged string.

将给定的 `placeholderName` 和 `messagePart` 序列化为可在 `$localize`
标记字符串中使用的“cooked”和“raw”字符串。

The format is `:<placeholder-name>[@@<associated-id>]:`.

格式是 `:<placeholder-name>[@@<associated-id>]:`。

The `associated-id` is the message id of the \(usually an ICU\) message to which this placeholder
refers.

`associated-id` 是此占位符引用的消息（通常是 ICU）的消息 id。

A structure to hold the cooked and raw strings of a template literal element, along with its
source-span range.

一种结构，用于保存模板文字元素的煮熟和原始字符串及其 source-span 范围。

Any metadata that should be prepended to the string

应该附加到字符串的任何元数据

The message part of the string

字符串的消息部分

Creates a `{cooked, raw}` object from the `metaBlock` and `messagePart`.

从 `metaBlock` 和 `messagePart` 创建一个 `{cooked, raw}` 对象。

The `raw` text must have various character sequences escaped:

`raw` 文本必须对各种字符序列进行转译：

"\\" would otherwise indicate that the next character is a control character.

“\\” 否则将表明下一个字符是控制字符。

"\`" and "${" are template string control sequences that would otherwise prematurely indicate
the end of a message part.

“\`” 和 “${” 是模板字符串控制序列，否则会过早地表明消息部分的结束。

":" inside a metablock would prematurely indicate the end of the metablock.

元块中的“:”会过早地表明元块的结束。

":" at the start of a messagePart with no metablock would erroneously indicate the start of a
metablock.

没有元块的 messagePart 开头的“:”将错误地表明元块的开始。

Calculates whether this statement produces the same value as the given statement.
Note: We don't check Types nor ParseSourceSpans nor function arguments.

计算此语句是否生成与给定语句相同的值。注意：我们不检查 Types、ParseSourceSpans 或函数参数。
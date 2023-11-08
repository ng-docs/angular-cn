A translation message that has been processed to extract the message parts and placeholders.

已处理以提取消息部分和占位符的翻译消息。

The internal structure used by the runtime localization to translate messages.

运行时本地化用于翻译消息的内部结构。

Translate the text of the `$localize` tagged-string \(i.e. `messageParts` and
`substitutions`\) using the given `translations`.

使用给定的 `translations` `$localize` 标记字符串的文本（即 `messageParts` 和 `substitutions`）。

The tagged-string is parsed to extract its `messageId` which is used to find an appropriate
`ParsedTranslation`. If this doesn't match and there are legacy ids then try matching a
translation using those.

tagged-string 被解析以提取其 `messageId`，该 messageId 用于查找适当的 `ParsedTranslation`
。如果这不匹配并且有旧版 id，请尝试使用它们来匹配翻译。

If one is found then it is used to translate the message into a new set of `messageParts` and
`substitutions`.
The translation may reorder \(or remove\) substitutions as appropriate.

如果找到了一个，则用它来将消息转换为一组新的 `messageParts` 和 `substitutions`
。翻译可能会酌情重新排序（或删除）替换。

If there is no translation with a matching message id then an error is thrown.
If a translation contains a placeholder that is not found in the message being translated then an
error is thrown.

如果没有具有匹配消息 ID
的翻译，则会抛出错误。如果翻译包含正在翻译的消息中找不到的占位符，则会抛出错误。

the message to be parsed.

要解析的消息。

Parse the `messageParts` and `placeholderNames` out of a target `message`.

从目标 `message` 中解析 `messageParts` 和 `placeholderNames`。

Used by `loadTranslations()` to convert target message strings into a structure that is more
appropriate for doing translation.

供 `loadTranslations()` 使用，将目标消息字符串转换为更适合进行翻译的结构。

The message parts to appear in the ParsedTranslation.

要出现在 ParsedTranslation 中的消息部分。

The names of the placeholders to intersperse between the `messageParts`.

要穿在 `messageParts` 之间的占位符的名称。

Create a `ParsedTranslation` from a set of `messageParts` and `placeholderNames`.

从一组 `messageParts` 和 `placeholderNames` 创建 `ParsedTranslation`。

The message parts with their escape codes processed.

已处理其转义代码的消息部分。

The message parts with their escaped codes as-is.

消息按原样使用其转义代码。

Create the specialized array that is passed to tagged-string tag functions.

创建传递给 tagged-string 标签函数的专用数组。
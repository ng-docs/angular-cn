This visitor walks over an i18n tree, capturing literal strings and placeholders.

此访问者走过一棵 i18n 树，捕获文字字符串和占位符。

The result can be used for generating the `$localize` tagged template literals.

结果可用于生成 `$localize` 标记的模板文字。

The message to be serialized.

要序列化的消息。

an object containing the messageParts and placeholders.

包含 messageParts 和占位符的对象。

Serialize an i18n message into two arrays: messageParts and placeholders.

将 i18n 消息序列化为两个数组：messageParts 和占位符。

These arrays will be used to generate `$localize` tagged template literals.

这些数组将用于生成 `$localize` 标记的模板文字。

The pieces to process.

要处理的部分。

Convert the list of serialized MessagePieces into two arrays.

将序列化 MessagePieces 列表转换为两个数组。

One contains the literal string pieces and the other the placeholders that will be replaced by
expressions when rendering `$localize` tagged template literals.

一个包含文字字符串，另一个包含在渲染 `$localize` 标记的模板文字时将被表达式替换的占位符。
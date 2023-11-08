Closure uses `goog.getMsg(message)` to lookup translations

闭包使用 `goog.getMsg(message)` 来查找翻译

Generates a `goog.getMsg()` statement and reassignment. The template:

生成 `goog.getMsg()` 语句和重新分配。模板：

Generates:

生成：

This visitor walks over i18n tree and generates its string representation, including ICUs and
placeholders in `{$placeholder}` \(for plain messages\) or `{PLACEHOLDER}` \(inside ICUs\) format.

此访问者会走过 i18n 树并生成其字符串表示，包括 ICU 和 `{$placeholder}`（用于纯消息）或
`{PLACEHOLDER}`（在 ICU 内）格式的占位符。
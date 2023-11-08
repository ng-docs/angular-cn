Verify that placeholders in translation strings match placeholders in the object defined in the
`goog.getMsg()` function arguments.

验证翻译字符串中的占位符是否与 `goog.getMsg()` 函数参数中定义的对象中的占位符匹配。

Verify that all the variables initialized with `goog.getMsg()` calls have
unique names.

验证使用 `goog.getMsg()` 调用初始化的所有变量都具有唯一名称。

The source code to parse.

要解析的源代码。

Extract pairs of `[msg, placeholders]`, in calls to `goog.getMsg()`, from the `source`.

在对 `goog.getMsg()` 的调用中，从 `source` 提取成对的 `[msg, placeholders]`。

The text of the message to parse.

要解析的消息的文本。

Extract placeholder names \(of the form `{$PLACEHOLDER}`\) from the `msg`.

从 `msg` 中提取占位符名称（格式 `{$PLACEHOLDER}`）。

The body of an object literal containing placeholder info.

包含占位符信息的对象文字的主体。

Extract the placeholder names \(of the form `"PLACEHOLDER": "XXX"`\) from the body of the argument
provided as `args`.

从作为 `args` 提供的参数主体中提取占位符名称（格式为 `"PLACEHOLDER": "XXX"`）。
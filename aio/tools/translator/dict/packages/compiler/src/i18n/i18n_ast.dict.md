Describes the text contents of a placeholder as it appears in an ICU expression, including its
source span information.

描述出现在 ICU 表达式中的占位符的文本内容，包括其源跨度信息。

The text contents of the placeholder

占位符的文本内容

The source span of the placeholder

占位符的源范围

The ids to use if there are no custom id and if `i18nLegacyMessageIdFormat` is not empty

如果没有自定义 id 并且 `i18nLegacyMessageIdFormat` 不为空，则要使用的 id

message AST

消息 AST

maps placeholder names to static content and their source spans

将占位符名称映射到静态内容及其源范围

maps placeholder names to messages \(used for nested ICU messages\)

将占位符名称映射到消息（用于嵌套 ICU 消息）

Used to capture a message computed from a previous processing pass \(see `setI18nRefs()`\).

用于捕获从上一个处理过程计算的消息（请参阅 `setI18nRefs()`）。

Each HTML node that is affect by an i18n tag will also have an `i18n` property that is of type
`I18nMeta`.
This information is either a `Message`, which indicates it is the root of an i18n message, or a
`Node`, which indicates is it part of a containing `Message`.

受 i18n 标签影响的每个 HTML 节点也将有一个 `I18nMeta` 类型的 `i18n` 属性。此信息可以是 `Message`
，表明它是 i18n 消息的根，或者是 `Node`，表明它是包含 `Message` 的一部分。

Serialize the message to the Localize backtick string format that would appear in compiled code.

将消息序列化为已编译代码中出现的 Localize 反引号字符串格式。
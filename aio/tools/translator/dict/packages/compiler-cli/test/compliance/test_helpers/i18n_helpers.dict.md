Unique message id index that is needed to avoid different i18n vars with the same name to appear
in the i18n block while generating an output string \(used to verify compiler-generated code\).

生成输出字符串（用于验证编译器生成的代码）时，为避免出现在 i18n 块中的不同 i18n var
所需的唯一消息 ID 索引。

Generate a string that represents expected i18n block content for a simple message.

生成一个字符串，该字符串表示简单消息的预期 i18n 块内容。

Describes options bag passed to `goog.getMsg()`.

描述传递给 `goog.getMsg()` 的选项包。

Generate a string that represents expected i18n block content for a message that requires
post-processing.

生成一个字符串，该字符串表示需要后处理的消息的预期 i18n 块内容。

Generates a string that represents expected i18n block content for an ICU.

生成一个字符串，该字符串表示 ICU 的预期 i18n 块内容。

Describes placeholder type used in tests.

描述测试中使用的占位符类型。

The first item is the placeholder name.

第一项是占位符名称。

The second item is the identifier of the variable that contains the placeholder.

第二项是包含占位符的变量的标识符。

The third \(optional\) items is the id of the message that this placeholder references.
This is used for matching ICU placeholders to ICU messages.

第三个（可选）条目是此占位符引用的消息的 id。这用于将 ICU 占位符与 ICU 消息匹配。

Describes message metadata object.

描述消息元数据对象。

Convert a set of placeholders to a string \(as it's expected from compiler\).

将一组占位符转换为字符串（正如编译器所预期的）。

Convert an object of `goog.getMsg()` options to the expected string.

将 `goog.getMsg()` 选项的对象转换为预期的字符串。

Transform a message in a Closure format to a $localize version.

将 Closure 格式的消息转换为 $localize 版本。

Generate a string that represents expected Closure metadata output comment.

生成一个表示预期的 Closure 元数据输出注释的字符串。

Generate a string that represents expected $localize metadata output.

生成一个表示预期的 $localize 元数据输出的字符串。

Wrap a string into quotes if needed.

如果需要，将字符串用引号引起来。

Note: if `value` starts with `$` it is a special case in tests when ICU reference is used as a
placeholder value. Such special cases should not be wrapped in quotes.

注意：如果 `value` 以 `$` 开头，则在测试中使用 ICU
引用作为占位符值时，这是一种特殊情况。此类特殊情况不应用引号引起来。
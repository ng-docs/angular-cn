The expression to check.

要检查的表达式。

The configured name of `$localize`.

`$localize` 的配置名称。

Is the given `expression` the global `$localize` identifier?

给定的 `expression` 是全局 `$localize` 标识符吗？

The name of the identifier we are looking for.

我们要查找的标识符的名称。

Is the given `expression` an identifier with the correct `name`?

给定的 `expression` 是具有正确 `name` 的标识符吗？

The identifier to check.

要检查的标识符。

Is the given `identifier` declared globally.

是全局声明的给定 `identifier`。

The static parts of the message.

消息的静态部分。

The expressions to substitute into the message.

要替换到消息中的表达式。

Build a translated expression to replace the call to `$localize`.

构建一个翻译后的表达式来替换对 `$localize` 的调用。

The AST node of the call to process.

调用 process 的 AST 节点。

The file system to use when computing source-map paths. If not provided then it uses
    the "current" FileSystem.

计算源映射路径时要使用的文件系统。如果未提供，则使用“当前”文件系统。

Extract the message parts from the given `call` \(to `$localize`\).

从给定的 `call` 中提取消息部分（到 `$localize`）。

The message parts will either by the first argument to the `call` or it will be wrapped in call
to a helper function like `__makeTemplateObject`.

消息部分将由 `call` 的第一个参数组成，或者它将被包装在对 `__makeTemplateObject`
等帮助器函数的调用中。

Parse the localize call expression to extract the arguments that hold the substitution
expressions.

解析 localize 调用表达式以提取包含替换表达式的参数。

The elements of the template literal to process.

要处理的模板文字的元素。

Parse the tagged template literal to extract the message parts.

解析标记的模板文字以提取消息部分。

The AST node of the template literal to process.

要处理的模板文字的 AST 节点。

Parse the tagged template literal to extract the interpolation expressions.

解析标记的模板文字以提取插值表达式。

The expression to potentially wrap.

要可能包装的表达式。

Wrap the given `expression` in parentheses if it is a binary expression.

如果给定表达式是二元表达式，则将给定 `expression` 放在括号中。

This ensures that this expression is evaluated correctly if it is embedded in another expression.

这可确保如果此表达式嵌入在另一个表达式中，则可以正确估算它。

The array to unwrap.

要解包的数组。

Extract the string values from an `array` of string literals.

从字符串文字 `array` 中提取字符串值。

the call expression to unwrap

要展开的调用表达式

the  call expression

调用表达式

This expression is believed to be a call to a "lazy-load" template object helper function.
This is expected to be of the form:

此表达式被认为是对“惰性加载”模板对象帮助器函数的调用。预期的形式为：

We unwrap this to return the call to `_taggedTemplateLiteral()`.

我们打开它以返回对 `_taggedTemplateLiteral()` 的调用。

The node to test.

要测试的节点。

Is the given `node` an array of literal strings?

给定的 `node` 是文字字符串数组吗？

The nodes to test.

要测试的节点。

Are all the given `nodes` expressions?

是所有给定的 `nodes` 表达式吗？

Options that affect how the `makeEsXXXTranslatePlugin()` functions work.

影响 `makeEsXXXTranslatePlugin()` 函数工作方式的选项。

Translate the text of the given message, using the given translations.

使用给定的翻译来翻译给定消息的文本。

Logs as warning if the translation is not available

如果翻译不可用，则记录为警告
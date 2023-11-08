When a constant requires some pre-processing \(e.g. i18n translation block that includes
goog.getMsg and $localize calls\), the `prepareStatements` section contains corresponding
statements.

当常量需要一些预处理（例如，包含 goog.getMsg 和 $localize 调用的 i18n 翻译块）时，
`prepareStatements` 部分包含相应的语句。

Actual expressions that represent constants.

表示常量的实际表达式。

Cache to avoid generating duplicated i18n translation blocks.

缓存以避免生成重复的 i18n 翻译块。

Name of the attribute, including the namespace.

属性的名称，包括命名空间。

Gets an array of literals that can be added to an expression
to represent the name and namespace of an attribute. E.g.
`:xlink:href` turns into `[AttributeMarker.NamespaceURI, 'xlink', 'href']`.

获取可以添加到表达式中以表示属性名称和命名空间的文字数组。例如 `:xlink:href` 会变成
`[AttributeMarker.NamespaceURI, 'xlink', 'href']`。

Function which is executed whenever a variable is referenced for the first time in a given
scope.

每当在给定范围内第一次引用变量时执行的函数。

It is expected that the function creates the `const localName = expression`; statement.

预期该函数会创建 `const localName = expression` ;声明。

The prefix used to get a shared context in BindingScope's map.

用于在 BindingScope 的映射中获取共享上下文的前缀。

This is used when one refers to variable such as: `let abc = nextContext(2).$implicit`.

当引用变量时使用此变量，例如：`let abc = nextContext(2).$implicit`。

key to the map is the string literal `"abc"`.

映射的键是字符串文字 `"abc"`。

value `retrievalLevel` is the level from which this value can be retrieved, which is 2 levels
up in example.

值 `retrievalLevel` 级别是可以从中检索此值的级别，在示例中是 2 级。

value `lhs` is the left hand side which is an AST representing `abc`.

值 `lhs` 是左侧，它是表示 `abc` 的 AST。

value `declareLocalCallback` is a callback that is invoked when declaring the local.

value `declareLocalCallback` 是声明本地时调用的回调。

value `declare` is true if this value needs to be declared.

如果需要声明此值，则 value `declare` 为 true。

value `localRef` is true if we are storing a local reference

如果我们要存储本地引用，则值 `localRef` 为 true

value `priority` dictates the sorting priority of this var declaration compared
  to other var declarations on the same retrieval level. For example, if there is a
  context variable and a local ref accessing the same parent view, the context var
  declaration should always come before the local ref declaration.

value `priority` 级表明此 var 声明与同一检索级别上的其他 var
声明相比的排序优先级。例如，如果有一个上下文变量和一个本地 ref 访问同一个父视图，则上下文 var
声明应始终位于本地 ref 声明之前。

The sorting priority of a local variable declaration. Higher numbers
mean the declaration will appear first in the generated code.

局部变量声明的排序优先级。数字越大，意味着声明将出现在生成的代码中。

The level from which this value can be retrieved

可以从中检索此值的级别

Name of the variable.

变量的名称。

AST representing the left hand side of the `let lhs = rhs;`.

表示 `let lhs = rhs;` 左侧的 AST .

The sorting priority of this var

此 var 的排序优先级

The callback to invoke when declaring this local var

声明此本地 var 时要调用的回调

Whether or not this is a local ref

这是否是本地参考

Create a local variable for later reference.

创建一个局部变量以供以后引用。

Gets or creates a shared context variable and returns its expression. Note that
this does not mean that the shared variable will be declared. Variables in the
binding scope will be only declared if they are used.

获取或创建共享上下文变量并返回其表达式。请注意，这并不意味着将声明共享变量。绑定范围内的变量只有在使用时才会声明。

Creates a `CssSelector` given a tag name and a map of attributes

在给定标签名称和属性映射表的情况下创建一个 `CssSelector`

Creates an array of expressions out of an `ngProjectAs` attributes
which can be added to the instruction parameters.

从可以添加到指令参数的 `ngProjectAs` 属性创建一个表达式数组。

An Interpolation AST

插值 AST

Gets the instruction to generate for an interpolated property

获取要为插值属性生成的指令

Gets the instruction to generate for an interpolated attribute

获取要为插值属性生成的指令

Gets the instruction to generate for interpolated text.

获取要为插值文本生成的指令。

Options that can be used to modify how a template is parsed by `parseTemplate()`.

可用于修改 `parseTemplate()` 解析模板的方式的选项。

Include whitespace nodes in the parsed output.

在解析的输出中包含空格节点。

Preserve original line endings instead of normalizing '\\r\\n' endings to '\\n'.

保留原始行结尾，而不是将 '\\r\\n' 结尾规范化为 '\\n'。

How to parse interpolation markers.

如何解析插值标记。

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

An array of characters that should be considered as leading trivia.
Leading trivia are characters that are not important to the developer, and so should not be
included in source-map segments.  A common example is whitespace.

应被视为前导琐事的字符数组。领先的琐事是对开发人员不重要的字符，因此不应包含在 source-map
段中。一个常见的例子是空格。

Render `$localize` message ids with additional legacy message ids.

使用额外的旧版消息 ID 渲染 `$localize` 消息 ID。

This option defaults to `true` but in the future the default will be flipped.

此选项默认为 `true`，但将来默认值将被翻转。

For now set this option to false if you have migrated the translation files to use the new
`$localize` message id format and you are not using compile time translation merging.

如果你已迁移翻译文件以使用新的 `$localize` 消息 ID
格式，并且你不使用编译时翻译合并，现在将此选项设置为 false。

If this text is stored in an external template \(e.g. via `templateUrl`\) then we need to decide
whether or not to normalize the line-endings \(from `\r\n` to `\n`\) when processing ICU
expressions.

如果此文本存储在外部模板中（例如通过 `templateUrl`），那么我们需要决定在处理 ICU
表达式时是否对行尾进行规范化（从 `\r\n` 到 `\n`）。

If `true` then we will normalize ICU expression line endings.
The default is `false`, but this will be switched in a future major release.

如果 `true`，那么我们将规范化 ICU 表达式行结尾。默认值为 `false`
，但这将在未来的主要版本中切换。

Whether to always attempt to convert the parsed HTML AST to an R3 AST, despite HTML or i18n
Meta parse errors.

是否始终尝试将解析后的 HTML AST 转换为 R3 AST，无论 HTML 或 i18n 元解析错误。

This option is useful in the context of the language service, where we want to get as much
information as possible, despite any errors in the HTML. As an example, a user may be adding
a new tag and expecting autocomplete on that tag. In this scenario, the HTML is in an errored
state, as there is an incomplete open tag. However, we're still able to convert the HTML AST
nodes to R3 AST nodes in order to provide information for the language service.

此选项在语言服务的上下文中很有用，我们希望在其中获取尽可能多的信息，尽管 HTML
中存在任何错误。例如，用户可能正在添加新标签并希望在该标签上自动完成。在这种情况下，HTML
处于错误状态，因为有一个不完整的 open 标签。但是，我们仍然能够将 HTML AST 节点转换为 R3 AST
节点，以便为语言服务提供信息。

Note that even when `true` the HTML parse and i18n errors are still appended to the errors
output, but this is done after converting the HTML AST to R3 AST.

请注意，即使为 `true`，HTML 解析和 i18n 错误仍然会附加到错误输出，但这是在将 HTML AST 转换为
R3 AST 之后完成的。

Include HTML Comment nodes in a top-level comments array on the returned R3 AST.

在返回的 R3 AST 上的顶级注释数组中包含 HTML Comment 节点。

This option is required by tooling that needs to know the location of comment nodes within the
AST. A concrete example is &commat;angular-eslint which requires this in order to enable
"eslint-disable" comments within HTML templates, which then allows users to turn off specific
rules on a case by case basis, instead of for their whole project within a configuration file.

需要知道注释节点在 AST 中位置的工具需要此选项。一个具体的例子是 &commat;angular-eslint
，它需要这个才能在 HTML
模板中启用“eslint-disable”注释，然后允许用户逐个关闭特定规则，而不是在配置中为整个项目关闭文件。

text of the template to parse

要解析的模板的文本

URL to use for source mapping of the parsed template

用于已解析模板的源映射的 URL

options to modify how the template is parsed

修改模板解析方式的选项

Parse a template into render3 `Node`s and additional metadata, with no other dependencies.

将模板解析为 render3 `Node` 和其他元数据，没有其他依赖项。

Construct a `BindingParser` with a default configuration.

构造具有默认配置的 `BindingParser`。

Name of the global variable that is used to determine if we use Closure translations or not

用于确定我们是否使用闭包翻译的全局变量的名称

The original i18n AST message node

原始 i18n AST 消息节点

The variable that will be assigned the translation, e.g. `I18N_1`.

将分配给翻译的变量，例如 `I18N_1`。

The variable for Closure `goog.getMsg` calls, e.g. `MSG_EXTERNAL_XXX`.

Closure `goog.getMsg` 调用的变量，例如 `MSG_EXTERNAL_XXX`。

Object mapping placeholder names to their values \(e.g.
`{ "interpolation": "\uFFFD0\uFFFD" }`\).

对象将占位符名称映射到它们的值（例如 `{ "interpolation": "\uFFFD0\uFFFD" }`）。

Optional transformation function that will be applied to the translation \(e.g.
post-processing\).

将应用于翻译的可选转换函数（例如后处理）。

An array of statements that defined a given translation.

定义给定翻译的语句数组。

Generate statements that define a given translation message.

生成定义给定翻译消息的语句。

Create the expression that will be used to guard the closure mode block
It is equivalent to:

创建将用于保护关闭模式块的表达式它等效于：

Information about the template which was extracted during parsing.

有关解析期间提取的模板的信息。

This contains the actual parsed template as well as any metadata collected during its parsing,
some of which might be useful for re-parsing the template with different options.

这包含实际解析的模板以及在其解析期间收集的任何元数据，其中一些可能可用于使用不同的选项重新解析模板。

Any errors from parsing the template the first time.

第一次解析模板时出现的任何错误。

`null` if there are no errors. Otherwise, the array of errors is guaranteed to be non-empty.

如果没有错误，则为 `null`。否则，错误数组保证是非空的。

The template AST, parsed from the template.

从模板解析的模板 AST。

Any styleUrls extracted from the metadata.

从元数据中提取的任何 styleUrls。

Any inline styles extracted from the metadata.

从元数据中提取的任何内联样式。

Any ng-content selectors extracted from the template.

从模板中提取的任何 ng-content 选择器。

Any R3 Comment Nodes extracted from the template when the `collectCommentNodes` parse template
option is enabled.

启用 `collectCommentNodes` 解析模板选项时从模板中提取的任何 R3 注释节点。
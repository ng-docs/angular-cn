Injection flags for DI.

DI 的注入标志。

Specifies that an injector should retrieve a dependency from any injector until reaching the
host element of the current component. \(Only used with Element Injector\)

指定注入器应该从任何注入器检索依赖项，直到到达当前组件的宿主元素。（仅与 Element Injector
一起使用）

Don't descend into ancestors of the node requesting injection.

不要下降到请求注入的节点的祖先。

Skip the node that is requesting injection.

跳过正在请求注入的节点。

Inject `defaultValue` instead if token not found.

如果找不到令牌，则注入 `defaultValue`。

This token is being injected into a pipe.

此令牌正在被注入管道。

Flags used to generate R3-style CSS Selectors. They are pasted from
core/src/render3/projection.ts because they cannot be referenced directly.

用于生成 R3 风格的 CSS 选择器的标志。它们是从 core/src/render3/projection.ts
粘贴的，因为它们不能直接引用。

Indicates this is the beginning of a new negative selector

表明这是新的否定选择器的开始

Mode for matching attributes

匹配属性的模式

Mode for matching tag names

匹配标签名称的模式

Mode for matching class names

匹配类名的模式

Flags passed into template functions to determine which blocks \(i.e. creation, update\)
should be executed.

传递给模板函数的标志，以确定应该执行哪些块（即创建、更新）。

Typically, a template runs both the creation block and the update block on initialization and
subsequent runs only execute the update block. However, dynamically created views require that
the creation block be executed separately from the update block \(for backwards compat\).

通常，模板在初始化时会同时运行 Creation 块和 update 块，随后的运行仅执行 update
块。但是，动态创建的视图要求创建块与更新块分开执行（用于向后兼容）。

A set of marker values to be used in the attributes arrays. These markers indicate that some
items are not regular attributes and the processing should be adapted accordingly.

要在属性数组中使用的一组标记值。这些标记表明某些条目不是常规属性，应相应地调整处理。

Marker indicates that the following 3 values in the attributes array are:
namespaceUri, attributeName, attributeValue
in that order.

标记表明 properties 数组中的以下 3 个值依次是：namespaceUri、attributeName、attributeValue。

Signals class declaration.

信号类声明。

Each value following `Classes` designates a class name to include on the element.

`Classes` 后面的每个值都指定要包含在元素中的类名。

Example:

示例：

Given:

给定：

the generated code is:

生成的代码是：

Signals style declaration.

信号风格声明。

Each pair of values following `Styles` designates a style name and value to include on the
element.

`Styles` 后面的每对值都指定要包含在元素中的样式名称和值。

Signals that the following attribute names were extracted from input or output bindings.

表明以下属性名称是从输入或输出绑定中提取的。

For example, given the following HTML:

例如，给定以下 HTML：

Signals that the following attribute names were hoisted from an inline-template declaration.

表明以下属性名称是从内联模板声明中提升的。

the generated code for the `template()` instruction would include:

为 `template()` 指令生成的代码将包括：

while the generated code for the `element()` instruction inside the template function would
include:

而模板函数中 `element()` 指令的生成代码将包括：

Signals that the following attribute is `ngProjectAs` and its value is a parsed `CssSelector`.

表明以下属性是 `ngProjectAs`，其值是解析后的 `CssSelector`。

the generated code for the `element()` instruction would include:

为 `element()` 指令生成的代码将包括：

Signals that the following attribute will be translated by runtime i18n

表明以下属性将由运行时 i18n 翻译的信号
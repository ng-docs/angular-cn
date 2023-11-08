This implementation of `AstHost` is able to get information from Babel AST nodes.

`AstHost` 的此实现能够从 Babel AST 节点获取信息。

Return true if the expression does not represent an empty element in an array literal.
For example in `[,foo]` the first element is "empty".

如果表达式不表示数组文字中的空元素，则返回 true。例如，在 `[,foo]` 中，第一个元素是“empty”。

Return true if the expression is not a spread element of an array literal.
For example in `[x, ...rest]` the `...rest` expression is a spread element.

如果表达式不是数组文字的扩展元素，则返回 true。例如，在 `[x, ...rest]` 中，`...rest`
表达式是扩展元素。

Return true if the node can be considered a text based property name for an
object expression.

如果节点可以被认为是对象表达式的基于文本的属性名称，则返回 true。

Notably in the Babel AST, object patterns \(for destructuring\) could be of type
`t.PrivateName` so we need a distinction between object expressions and patterns.

值得注意的是，在 Babel AST 中，对象模式（用于解构）可能是 `t.PrivateName`
类型，因此我们需要区分对象表达式和模式。

The declared type of an argument to a call expression.

调用表达式的参数的声明类型。

Return true if the argument is not a spread element.

如果参数不是展开元素，则返回 true。

Return true if the node is either `!0` or `!1`.

如果节点是 `!0` 或 `!1`，则返回 true。
This implementation of `AstHost` is able to get information from TypeScript AST nodes.

`AstHost` 的此实现能够从 TypeScript AST 节点获取信息。

This host is not actually used at runtime in the current code.

在当前代码中的运行时实际上并没有使用此宿主。

It is implemented here to ensure that the `AstHost` abstraction is not unfairly skewed towards
the Babel implementation. It could also provide a basis for a 3rd TypeScript compiler plugin to
do linking in the future.

在这里实现它是为了确保 `AstHost` 抽象不会不公平地倾向于 Babel 实现。它还可以为将来的第三个
TypeScript 编译器插件进行链接提供基础。

Return true if the expression does not represent an empty element in an array literal.
For example in `[,foo]` the first element is "empty".

如果表达式不表示数组文字中的空元素，则返回 true。例如，在 `[,foo]` 中，第一个元素是“empty”。

Return true if the expression is not a spread element of an array literal.
For example in `[x, ...rest]` the `...rest` expression is a spread element.

如果表达式不是数组文字的扩展元素，则返回 true。例如，在 `[x, ...rest]` 中，`...rest`
表达式是扩展元素。

Return true if the expression can be considered a text based property name.

如果表达式可以被认为是基于文本的属性名称，则返回 true。

Return true if the node is either `true` or `false` literals.

如果节点是 `true` 或 `false` 文字，则返回 true。

Return true if the node is either `!0` or `!1`.

如果节点是 `!0` 或 `!1`，则返回 true。
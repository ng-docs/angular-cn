Post-process a reified view compilation and convert sequential calls to chainable instructions
into chain calls.

对具体化的视图编译进行后处理，并将对可链接指令的顺序调用转换为链式调用。

For example, two `elementStart` operations in sequence:

例如，顺序执行两个 `elementStart` 操作：

Can be called as a chain instead:

可以改为称为链：

Structure representing an in-progress chain.

表示正在进行的链的结构。

The statement which holds the entire chain.

包含整个链的语句。

The expression representing the whole current chained call.

表示整个当前链式调用的表达式。

This should be the same as `op.statement.expression`, but is extracted here for convenience
since the `op` type doesn't capture the fact that `op.statement` is an `o.ExpressionStatement`.

这应该与 `op.statement.expression` 相同，但为方便起见在此处提取，因为 `op` 类型未捕获 `op.statement` 是 `o.ExpressionStatement` 的事实。

The instruction that is being chained.

被链接的指令。
Compiles semantic operations across all views and generates output `o.Statement`s with actual
runtime calls in their place.

跨所有视图编译语义操作并生成输出 `o.Statement`，并在其位置上使用实际的运行时调用。

Reification replaces semantic operations with selected Ivy instructions and other generated code
structures. After reification, the create/update operation lists of all views should only contain
`ir.StatementOp`s \(which wrap generated `o.Statement`s\).

Reification 用选定的 Ivy 指令和其他生成的代码结构替换语义操作。具体化后，所有视图的创建/更新操作列表应仅包含 `ir.StatementOp` （包装生成的 `o.Statement` ）。

Listeners get turned into a function expression, which may or may not have the `$event`
parameter defined.

监听器变成一个函数表达式，它可能有也可能没有定义 `$event` 参数。

Visitor which scans for reads of the `$event` special variable.

扫描 `$event` 特殊变量读取的访问者。
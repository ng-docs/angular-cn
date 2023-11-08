Generate names for functions and variables across all views.

为所有视图中的函数和变量生成名称。

This includes propagating those names into any `ir.ReadVariableExpr`s of those variables, so that
the reads can be emitted correctly.

这包括将这些名称传播到这些变量的任何 `ir.ReadVariableExpr` 中，以便可以正确发出读取。
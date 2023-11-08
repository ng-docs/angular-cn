An `o.Expression` subtype representing a logical expression in the intermediate representation.

表示中间表示中的逻辑表达式的 `o.Expression` 子类型。

Transformer type which converts expressions into general `o.Expression`s \(which may be an
identity transformation\).

将表达式转换为通用 `o.Expression` 转换器类型（可能是身份转换）。

Check whether a given `o.Expression` is a logical IR expression type.

检查给定的 `o.Expression` 是否是逻辑 IR 表达式类型。

Base type used for all logical IR expressions.

用于所有逻辑 IR 表达式的基本类型。

Run the transformer against any nested expressions which may be present in this IR expression
subtype.

针对此 IR 表达式子类型中可能存在的任何嵌套表达式运行转换器。

Logical expression representing a lexical read of a variable name.

表示变量名称的词法读取的逻辑表达式。

Runtime operation to retrieve the value of a local reference.

运行时操作以检索本地引用的值。

A reference to the current view context \(usually the `ctx` variable in a template function\).

对当前视图上下文的引用（通常是模板函数中的 `ctx` 变量）。

Runtime operation to navigate to the next view context in the view hierarchy.

运行时操作导航到视图层次结构中的下一个视图上下文。

Runtime operation to snapshot the current view context.

快照当前视图上下文的运行时操作。

The result of this operation can be stored in a variable and later used with the `RestoreView`
operation.

此操作的结果可以存储在一个变量中，稍后与 `RestoreView` 操作一起使用。

Runtime operation to restore a snapshotted view.

恢复快照视图的运行时操作。

Runtime operation to reset the current view context after `RestoreView`.

在 `RestoreView` 之后重置当前视图上下文的运行时操作。

Read of a variable declared as an `ir.VariableOp` and referenced through its `ir.XrefId`.

读取声明为 `ir.VariableOp` 并通过其 `ir.XrefId` 引用的变量。

The expression which should be memoized as a pure computation.

应该作为纯计算记忆的表达式。

This expression contains internal `PureFunctionParameterExpr`s, which are placeholders for the
positional argument expressions in \`args.

该表达式包含内部 `PureFunctionParameterExpr` s，它们是 \`args 中位置参数表达式的占位符。

Positional arguments to the pure function which will memoize the `body` expression, which act
as memoization keys.

纯函数的位置参数将记忆 `body` 表达式，充当记忆键。

Once extracted to the `ConstantPool`, a reference to the function which defines the computation
of `body`.

一旦提取到 `ConstantPool`，对定义 `body` 计算的函数的引用。

Visits all `Expression`s in the AST of `op` with the `visitor` function.

使用 `visitor` 函数访问 `op` 的 AST 中的所有 `Expression`。

Transform all `Expression`s in the AST of `op` with the `transform` function.

使用 `transform` 函数转换 `op` 的 AST 中的所有 `Expression`。

All such operations will be replaced with the result of applying `transform`, which may be an
identity transformation.

所有此类操作都将替换为应用 `transform` 的结果，这可能是身份转换。

Transform all `Expression`s in the AST of `expr` with the `transform` function.

使用 `transform` 函数转换 `expr` 的 AST 中的所有 `Expression`。

Transform all `Expression`s in the AST of `stmt` with the `transform` function.

使用 `transform` 函数转换 `stmt` 的 AST 中的所有 `Expression`。
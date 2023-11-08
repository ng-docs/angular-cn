Parses the value of an enum from the AST value's symbol name.

从 AST 值的符号名称解析枚举的值。

Parse a dependency structure from an AST object.

从 AST 对象解析依赖结构。

Return an `R3ProviderExpression` that represents either the extracted type reference expression
from a `forwardRef` function call, or the type itself.

返回一个 `R3ProviderExpression`，它表示从 `forwardRef`
函数调用中提取的类型引用表达式或类型本身。

For example, the expression `forwardRef(function() { return FooDir; })` returns `FooDir`. Note
that this expression is required to be wrapped in a closure, as otherwise the forward reference
would be resolved before initialization.

例如，表达式 `forwardRef(function() { return FooDir; })` 会返回 `FooDir`
。请注意，此表达式需要包装在闭包中，否则前向引用将在初始化之前被解析。

If there is no forwardRef call expression then we just return the opaque type.

如果没有 forwardRef 调用表达式，那么我们只返回 opaque 类型。
This class represents \(from the point of view of the `FileLinker`\) the scope in which
statements and expressions related to a linked partial declaration will be emitted.

此类表示（从 `FileLinker` 的角度来看）将发出与链接的部分声明相关的语句和表达式的范围。

It holds a copy of a `ConstantPool` that is used to capture any constant statements that need to
be emitted in this context.

它包含一个 `ConstantPool` 的副本，该副本用于捕获需要在此上下文中发出的任何常量语句。

This implementation will emit the definition and the constant statements separately.

此实现将分别发出定义和常量语句。

Translate the given Output AST definition expression into a generic `TExpression`.

将给定的输出 AST 定义表达式转换为通用 `TExpression`。

Use a `LinkerImportGenerator` to handle any imports in the definition.

使用 `LinkerImportGenerator` 来处理定义中的任何导入。

Return any constant statements that are shared between all uses of this `EmitScope`.

返回在此 `EmitScope` 的所有使用之间共享的任何常量语句。
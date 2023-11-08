A context which hosts one or more Type Check Blocks \(TCBs\).

托管一个或多个类型检查块（TCB）的上下文。

An `Environment` supports the generation of TCBs by tracking necessary imports, declarations of
type constructors, and other statements beyond the type-checking code within the TCB itself.
Through method calls on `Environment`, the TCB generator can request `ts.Expression`s which
reference declarations in the `Environment` for these artifacts\`.

`Environment` 通过跟踪必要的导入、类型构造函数的声明以及 TCB
本身中类型检查代码之外的其他语句来支持 TCB 的生成。通过 `Environment` 上的方法调用，TCB
生成器可以请求 `ts.Expression` s，哪个引用了 `Environment` 中这些工件的声明\`。

`Environment` can be used in a standalone fashion, or can be extended to support more specialized
usage.

`Environment` 可以独立使用，也可以扩展以支持更专业的用法。

Get an expression referring to a type constructor for the given directive.

获取引用给定指令的类型构造函数的表达式。

Depending on the shape of the directive itself, this could be either a reference to a declared
type constructor, or to an inline type constructor.

根据指令本身的形状，这可以是对声明的类型构造函数的引用，也可以是对内联类型构造函数的引用。

Generate a `ts.Expression` that references the given node.

生成一个引用给定节点的 `ts.Expression`。

This may involve importing the node into the file if it's not declared there already.

如果尚未在文件中声明，这可能涉及将节点导入到文件中。

Generate a `ts.TypeNode` that references the given node as a type.

生成一个将给定节点作为类型引用的 `ts.TypeNode`。

Generate a `ts.TypeNode` that references a given type from the provided module.

生成一个从提供的模块引用给定类型的 `ts.TypeNode`。

This will involve importing the type into the file, and will also add type parameters if
provided.

这将涉及将类型导入文件中，并且如果提供了类型参数，还将添加。

Generates a `ts.TypeNode` representing a type that is being referenced from a different place
in the program. Any type references inside the transplanted type will be rewritten so that
they can be imported in the context fiel.

生成一个 `ts.TypeNode` 表示从程序中不同位置引用的类型。移植类型中的任何类型引用都将被重写，以便它们可以在上下文字段中导入。
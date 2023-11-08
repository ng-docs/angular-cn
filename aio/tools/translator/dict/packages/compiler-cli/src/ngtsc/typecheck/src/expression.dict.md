Convert an `AST` to TypeScript code directly, without going through an intermediate `Expression`
AST.

直接将 `AST` 转换为 TypeScript 代码，而不通过中间的 `Expression` AST。

Checks whether View Engine will infer a type of 'any' for the left-hand side of a safe navigation
operation.

检查 View Engine 是否会为安全导航操作的左侧推断出一种“any”类型。

In View Engine's template type-checker, certain receivers of safe navigation operations will
cause a temporary variable to be allocated as part of the checking expression, to save the value
of the receiver and use it more than once in the expression. This temporary variable has type
'any'. In practice, this means certain receivers cause View Engine to not check the full
expression, and other receivers will receive more complete checking.

在 View Engine
的模板类型检查器中，某些安全导航操作的接收器将导致分配一个临时变量作为检查表达式的一部分，以保存接收器的值并在表达式中多次使用它。此临时变量的类型为“any”。在实践中，这意味着某些接收器会导致
View Engine 不检查完整的表达式，而其他接收器将接收到更完整的检查。

For compatibility, this logic is adapted from View Engine's expression_converter.ts so that the
Ivy checker can emulate this bug when needed.

为了兼容性，此逻辑是从 View Engine 的 expression_converter.ts 改编的，以便 Ivy
检查器可以在需要时模拟此错误。
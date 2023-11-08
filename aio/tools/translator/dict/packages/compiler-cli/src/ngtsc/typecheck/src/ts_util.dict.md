A `Set` of `ts.SyntaxKind`s of `ts.Expression` which are safe to wrap in a `ts.AsExpression`
without needing to be wrapped in parentheses.

`ts.SyntaxKind` 的 `ts.Expression` 的 `Set`，可以安全地包装在 `ts.AsExpression`
中，无需用括号括起来。

For example, `foo.bar()` is a `ts.CallExpression`, and can be safely cast to `any` with
`foo.bar() as any`. however, `foo !== bar` is a `ts.BinaryExpression`, and attempting to cast
without the parentheses yields the expression `foo !== bar as any`. This is semantically
equivalent to `foo !== (bar as any)`, which is not what was intended. Thus,
`ts.BinaryExpression`s need to be wrapped in parentheses before casting.

例如，`foo.bar()` 是 `ts.CallExpression`，并且可以用 `foo.bar() as any` `any` 但是，`foo !==
bar` 是 `ts.BinaryExpression`，并尝试在不带括号的情况下进行转换，会将表达式 `foo !== bar as any`
。这在语义上等效于 `foo !== (bar as any)`，这不是预期的。因此，`ts.BinaryExpression`
需要在强制转换之前用括号括起来。

Create an expression which instantiates an element by its HTML tagName.

创建一个表达式，该表达式通过其 HTML tagName 实例化元素。

Thanks to narrowing of `document.createElement()`, this expression will have its type inferred
based on the tag name, including for custom elements that have appropriate .d.ts definitions.

由于 `document.createElement()` 的缩小，此表达式将根据标签名称推断其类型，包括具有适当 .d.ts
定义的自定义元素。

Create a `ts.VariableStatement` which declares a variable without explicit initialization.

创建一个 `ts.VariableStatement`，它在没有显式初始化的情况下声明变量。

The initializer `null!` is used to bypass strict variable initialization checks.

初始化器 `null!` 用于绕过严格的变量初始化检查。

Unlike with `tsCreateVariable`, the type of the variable is explicitly specified.

与 `tsCreateVariable` 不同，变量的类型是显式指定的。

The `EntityName` of the Directive where the static coerced input is defined.

定义静态强制输入的指令的 `EntityName`。

The field name of the coerced input.

强制输入的字段名称。

Creates a `ts.TypeQueryNode` for a coerced input.

为强制输入创建 `ts.TypeQueryNode`。

For example: `typeof MatInput.ngAcceptInputType_value`, where MatInput is `typeName` and `value`
is the `coercedInputName`.

例如：`typeof MatInput.ngAcceptInputType_value`，其中 MatInput 是 `typeName`，`value` 是
`coercedInputName`。

Create a `ts.VariableStatement` that initializes a variable with a given expression.

创建一个使用给定表达式初始化变量的 `ts.VariableStatement`。

Unlike with `tsDeclareVariable`, the type of the variable is inferred from the initializer
expression.

与 `tsDeclareVariable` 不同，变量的类型是从初始化器表达式中推断的。

Construct a `ts.CallExpression` that calls a method on a receiver.

构造一个调用接收器上的方法的 `ts.CallExpression`。
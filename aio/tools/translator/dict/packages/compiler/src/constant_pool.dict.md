`ConstantPool` tries to reuse literal factories when two or more literals are identical.
We determine whether literals are identical by creating a key out of their AST using the
`KeyVisitor`. This constant is used to replace dynamic expressions which can't be safely
converted into a key. E.g. given an expression `{foo: bar()}`, since we don't know what
the result of `bar` will be, we create a key that looks like `{foo: <unknown>}`. Note
that we use a variable, rather than something like `null` in order to avoid collisions.

当两个或多个文字相同时，`ConstantPool` 会尝试重用文字工厂。我们通过使用 `KeyVisitor` 从 AST
创建键来确定文字是否相同。此常量用于替换无法安全地转换为键的动态表达式。例如，给定一个表达式
`{foo: bar()}`，由于我们不知道 `bar` 的结果将是什么，我们创建一个类似于 `{foo: <unknown>}`
的键。请注意，我们使用变量，而不是 `null` 之类的东西以避免冲突。

Context to use when producing a key.

生成键时要使用的上下文。

This ensures we see the constant not the reference variable when producing
a key.

这可确保我们在生成键时看到常量而不是引用变量。

Generally all primitive values are excluded from the `ConstantPool`, but there is an exclusion
for strings that reach a certain length threshold. This constant defines the length threshold for
strings.

一般来说，所有基元值都会从 `ConstantPool`
中排除，但达到一定长度阈值的字符串会被排除在外。此常量定义了字符串的长度阈值。

A node that is a place-holder that allows the node to be replaced when the actual
node is known.

作为占位符的节点，允许在已知实际节点时替换节点。

This allows the constant pool to change an expression from a direct reference to
a constant to a shared constant. It returns a fix-up node that is later allowed to
change the referenced expression.

这允许常量池将表达式从对常量的直接引用更改为共享常量。它返回一个 fix-up
节点，以后可以用该节点更改引用的表达式。

A constant pool allows a code emitter to share constant in an output context.

常量池允许代码发射器在输出上下文中共享常量。

The constant pool also supports sharing access to ivy definitions references.

常量池还支持共享对 ivy 定义引用的访问。

Produce a unique name.

生成一个唯一的名称。

The name might be unique among different prefixes if any of the prefixes end in
a digit so the prefix should be a constant string \(not based on user input\) and
must not end in a digit.

如果任何前缀以数字结尾，则该名称在不同的前缀中可能是唯一的，因此前缀应该是一个常量字符串（不基于用户输入），并且不能以数字结尾。
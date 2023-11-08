Create interpolation bindings with a variable number of expressions.

创建使用可变数量的表达式的插值绑定。

If there are 1 to 8 expressions `interpolation1()` to `interpolation8()` should be used instead.
Those are faster because there is no need to create an array of expressions and iterate over it.

如果有 1 到 8 个表达式，则应改用 `interpolation1()` 到 `interpolation8()`
。那些更快，因为无需创建表达式数组并迭代它。

`values`:



`values`：



has static text at even indexes,

在偶数索引处有静态文本，

has evaluated expressions at odd indexes.

在奇数索引处估算了表达式。

Returns the concatenated string when any of the arguments changes, `NO_CHANGE` otherwise.

当任何参数更改时返回连接字符串，否则返回 `NO_CHANGE`。

static value used for concatenation only.

仅用于连接的静态值。

value checked for change.

检查更改的值。

Creates an interpolation binding with 1 expression.

创建具有 1 个表达式的插值绑定。

Creates an interpolation binding with 2 expressions.

创建使用 2 个表达式的插值绑定。

Creates an interpolation binding with 3 expressions.

创建具有 3 个表达式的插值绑定。

Create an interpolation binding with 4 expressions.

创建使用 4 个表达式的插值绑定。

Creates an interpolation binding with 5 expressions.

创建具有 5 个表达式的插值绑定。

Creates an interpolation binding with 6 expressions.

创建具有 6 个表达式的插值绑定。

Creates an interpolation binding with 7 expressions.

创建具有 7 个表达式的插值绑定。

Creates an interpolation binding with 8 expressions.

创建具有 8 个表达式的插值绑定。
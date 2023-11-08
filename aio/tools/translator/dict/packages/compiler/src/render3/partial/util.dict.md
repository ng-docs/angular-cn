The array to transfer into literal array expression.

要转换为文字数组表达式的数组。

The logic to use for creating an expression for the array's values.

用于为数组值创建表达式的逻辑。

An array literal expression representing `values`, or null if `values` is empty or
is itself null.

表示 `values` 的数组文字表达式，如果 `values` 为空或本身为 null，则为 null。

Creates an array literal expression from the given array, mapping all values to an expression
using the provided mapping function. If the array is empty or null, then null is returned.

从给定数组创建一个数组文字表达式，使用提供的映射函数将所有值映射到一个表达式。如果数组为空或 null
，则返回 null。

The object to transfer into an object literal expression.

要转换为对象文字表达式的对象。

The logic to use for creating an expression for the object's values.

用于为对象的值创建表达式的逻辑。

An object literal expression representing `object`, or null if `object` does not have
any keys.

表示 `object` 的对象文字表达式，如果 `object` 没有任何键，则为 null。

Creates an object literal expression from the given object, mapping all values to an expression
using the provided mapping function. If the object has no keys, then null is returned.

从给定对象创建一个对象文字表达式，使用提供的映射函数将所有值映射到一个表达式。如果对象没有键，则返回
null。
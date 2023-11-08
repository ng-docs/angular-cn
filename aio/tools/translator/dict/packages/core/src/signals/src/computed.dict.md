Options passed to the `computed` creation function.

传递给 `computed` 创建函数的选项。

A comparison function which defines equality for computed values.

定义计算值相等性的比较函数。

Create a computed `Signal` which derives a reactive value from an expression.

创建一个计算 `Signal`，它从表达式中导出反应值。

A dedicated symbol used before a computed value has been calculated for the first time.
Explicitly typed as `any` so we can use it as signal's value.

在第一次计算计算值之前使用的专用符号。显式键入 `any` 以便我们可以将其用作信号的值。

A dedicated symbol used in place of a computed signal value to indicate that a given computation
is in progress. Used to detect cycles in computation chains.
Explicitly typed as `any` so we can use it as signal's value.

用于代替计算信号值的专用符号，用于指示给定计算正在进行中。用于检测计算链中的循环。显式键入 `any` 以便我们可以将其用作信号的值。

A dedicated symbol used in place of a computed signal value to indicate that a given computation
failed. The thrown error is cached until the computation gets dirty again.
Explicitly typed as `any` so we can use it as signal's value.

用于代替计算信号值的专用符号，用于指示给定计算失败。抛出的错误会被缓存，直到计算再次变脏。显式键入 `any` 以便我们可以将其用作信号的值。

A computation, which derives a value from a declarative reactive expression.

一种计算，它从声明性反应表达式中派生出一个值。

`Computed`s are both producers and consumers of reactivity.

`Computed` s 既是反应性的生产者又是消费者。
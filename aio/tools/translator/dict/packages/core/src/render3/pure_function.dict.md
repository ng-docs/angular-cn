Bindings for pure functions are stored after regular bindings.

纯函数的绑定是在常规绑定之后存储的。

|-------decls------|---------vars---------|                 |----- hostVars \(dir1\) ------\|



|-------decls------|---------vars----------| |----- hostVars \(dir1\) ------\|



| nodes/refs/pipes | bindings | fn slots  | injector | dir1 | host bindings | host slots |

|节点/引用/管道|绑定| fn 插槽|喷油器|目录 1 |宿主绑定|宿主插槽|

Pure function instructions are given an offset from the binding root. Adding the offset to the
binding root gives the first index where the bindings are stored. In component views, the binding
root is the bindingStartIndex. In host bindings, the binding root is the expandoStartIndex +
any directive instances + any hostVars in directives evaluated before it.

纯函数指令会被赋予从绑定根的偏移量。将偏移量添加到绑定根会给出存储绑定的第一个索引。在组件视图中，绑定根是
bindStartIndex。在宿主绑定中，绑定根是 expandoStartIndex + 任何指令实例 +
在它之前估算的指令中的任何 hostVars。

See VIEW_DATA.md for more information about host binding resolution.

有关宿主绑定解析的更多信息，请参阅 VIEW_DATA.md。

the offset from binding root to the reserved slot

从绑定根到保留槽的偏移量

Function that returns a value

返回值的函数

Optional calling context of pureFn

pureFn 的可选调用上下文

value

值

If the value hasn't been saved, calls the pure function to store and return the
value. If it has been saved, returns the saved value.

如果值尚未保存，则调用纯函数来存储并返回值。如果已保存，则返回保存的值。

Function that returns an updated value

返回更新值的函数

Updated expression value

更新的表达式值

Updated or cached value

更新或缓存的值

If the value of the provided exp has changed, calls the pure function to return
an updated value. Or if the value has not changed, returns cached value.

如果提供的 exp 的值发生了更改，则调用纯函数以返回更新后的值。或者，如果值没有更改，则返回缓存值。

If the value of any provided exp has changed, calls the pure function to return
an updated value. Or if no values have changed, returns cached value.

如果提供的任何 exp
的值发生了更改，则调用纯函数以返回更新后的值。或者，如果没有值发生更改，则返回缓存值。

A pure function that takes binding values and builds an object or array
containing those values.

一个纯函数，它接受绑定值并构建包含这些值的对象或数组。

An array of binding values

绑定值的数组

pureFunction instruction that can support any number of bindings.

可以支持任意数量的绑定的 pureFunction 指令。

Results of a pure function invocation are stored in LView in a dedicated slot that is initialized
to NO_CHANGE. In rare situations a pure pipe might throw an exception on the very first
invocation and not produce any valid results. In this case LView would keep holding the NO_CHANGE
value. The NO_CHANGE is not something that we can use in expressions / bindings thus we convert
it to `undefined`.

纯函数调用的结果存储在 LView 中初始化为 NO_CHANGE
的专用槽中。在极少数情况下，纯管道可能会在第一次调用时抛出异常并且不会产生任何有效结果。在这种情况下，LView
将继续保留 NO_CHANGE 值。NO_CHANGE 不是我们可以在表达式/绑定中使用的东西，因此我们将其转换为
`undefined`。

LView in which the function is being executed.

正在其中执行函数的 LView。

Binding root index.

绑定根索引。
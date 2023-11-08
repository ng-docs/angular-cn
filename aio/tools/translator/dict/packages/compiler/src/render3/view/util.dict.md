Checks whether an object key contains potentially unsafe chars, thus the key should be wrapped in
quotes. Note: we do not wrap all keys into quotes, as it may have impact on minification and may
bot work in some cases when object keys are mangled by minifier.

检查对象键是否包含可能不安全的字符，因此键应该用引号引起来。注意：我们不会将所有键都用引号引起来，因为它可能会影响缩小，并且当对象键被缩小器破坏时，在某些情况下可能会工作。

TODO\(FW-1136\): this is a temporary solution, we need to come up with a better way of working with
inputs that contain potentially unsafe chars.

TODO\(FW-1136\)
：这是一个临时解决方案，我们需要想出一种更好的方法来处理包含可能不安全的字符的输入。

Name of the temporary to use during data binding

数据绑定期间要使用的临时名称

Name of the context parameter passed into a template function

传递给模板函数的上下文参数的名称

Name of the RenderFlag passed into a template function

传递给模板函数的 RenderFlag 的名称

The prefix reference variables

前缀引用变量

The name of the implicit context reference

隐式上下文引用的名称

Non bindable attribute name

不可绑定的属性名称

Name for the variable keeping track of the context returned by `ɵɵrestoreView`.

跟踪 `ɵɵrestoreView` 返回的上下文的变量的名称。

Maximum length of a single instruction chain. Because our output AST uses recursion, we're
limited in how many expressions we can nest before we reach the call stack limit. This
length is set very conservatively in order to reduce the chance of problems.

单个指令链的最大长度。因为我们的输出 AST
使用了递归，所以我们在达到调用堆栈限制之前可以嵌套的表达式数量有限。这个长度的设置非常保守，以减少出现问题的机会。

Instructions that support chaining.

支持链接的指令。

Possible types that can be used to generate the parameters of an instruction call.
If the parameters are a function, the function will be invoked at the time the instruction
is generated.

可用于生成指令调用参数的可能类型。如果参数是函数，则函数将在生成指令时调用。

Necessary information to generate a call to an instruction function.

生成对指令函数的调用的必要信息。

Generates a call to a single instruction.

生成对单个指令的调用。

Creates an allocator for a temporary variable.

为临时变量创建分配器。

A variable declaration is added to the statements the first time the allocator is invoked.

第一次调用分配器时，会在语句中添加变量声明。

Remove trailing null nodes as they are implied.

删除隐含的尾随 null 节点。

A representation for an object literal used during codegen of definition objects. The generic
type `T` allows to reference a documented type of the generated structure, such that the
property names that are set can be resolved to their documented declaration.

在定义对象的代码生成期间使用的对象文字的表示。泛型 `T`
允许引用生成的结构的文档化类型，以便设置的属性名称可以解析为它们的文档化声明。

the element or template in question

有问题的元素或模板

an object set up for directive matching. For attributes on the element/template, this
object maps a property name to its \(static\) value. For any bindings, this map simply maps the
property name to an empty string.

为指令匹配设置的对象。对于元素/模板上的属性，此对象将属性名称映射到其（静态）值。对于任何绑定，此映射只是将属性名称映射到一个空字符串。

Extract a map of properties to values for a given element or template node, which can be used
by the directive matching machinery.

提取给定元素或模板节点的属性到值的映射，供指令匹配机制使用。

An interpolation ast

插值 ast

Gets the number of arguments expected to be passed to a generated instruction in the case of
interpolation instructions.

获取在插值指令的情况下要传递给生成的指令的参数的数量。

Generates the final instruction call statements based on the passed in configuration.
Will try to chain instructions as much as possible, if chaining is supported.

根据传入的配置生成最终的指令调用语句。如果支持链接，将尝试尽可能多地链接指令。
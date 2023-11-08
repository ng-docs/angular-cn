Processes `Target`s with a given set of directives and performs a binding operation, which
returns an object similar to TypeScript's `ts.TypeChecker` that contains knowledge about the
target.

使用给定的一组指令处理 `Target` 并执行绑定操作，该操作会返回一个类似于 TypeScript 的
`ts.TypeChecker` 的对象，其中包含有关目标的知识。

Perform a binding operation on the given `Target` and return a `BoundTarget` which contains
metadata about the types referenced in the template.

对给定的 `Target` 执行绑定操作，并返回一个 `BoundTarget`
，其中包含有关模板中引用的类型的元数据。

Represents a binding scope within a template.

表示模板中的绑定范围。

Any variables, references, or other named entities declared within the template will
be captured and available by name in `namedEntities`. Additionally, child templates will
be analyzed and have their child `Scope`s available in `childScopes`.

在模板中声明的任何变量、引用或其他命名实体都将被捕获，并在 `namedEntities`
中按名称提供。此外，将分析子模板，并让它们的子 `Scope` 在 `childScopes` 中可用。

Named members of the `Scope`, such as `Reference`s or `Variable`s.

`Scope` 的命名成员，例如 `Reference` 或 `Variable`。

Child `Scope`s for immediately nested `Template`s.

立即嵌套的 `Template` 的子 `Scope`。

Process a template \(either as a `Template` sub-template with variables, or a plain array of
template `Node`s\) and construct its `Scope`.

处理模板（作为带有变量的 `Template` 子模板，或模板 `Node` 的普通数组）并构造其 `Scope`。

Look up a variable within this `Scope`.

在此 `Scope` 中查找变量。

This can recurse into a parent `Scope` if it's available.

如果可用，这可以递归到父 `Scope`。

Get the child scope for a `Template`.

获取 `Template` 的子范围。

This should always be defined.

这应该始终被定义。

Processes a template and matches directives on nodes \(elements and templates\).

处理模板并匹配节点（元素和模板）上的指令。

Usually used via the static `apply()` method.

通常通过静态 `apply()` 方法使用。

the list of template `Node`s to match \(recursively\).

要匹配的模板 `Node` 列表（递归）。

a `SelectorMatcher` containing the directives that are in scope for
this template.

包含此模板范围内的指令的 `SelectorMatcher`。

three maps which contain information about directives in the template: the
`directives` map which lists directives matched on each node, the `bindings` map which
indicates which directives claimed which bindings \(inputs, outputs, etc\), and the `references`
map which resolves #references \(`Reference`s\) within the template to the named directive or
template node.

三个包含模板中指令信息的映射表：列出在每个节点上匹配的指令的 `directives`
映射表、表明哪些指令声明了哪些绑定（输入、输出等）的 `bindings` 映射表以及解析 #references（
`Reference`）的 `references` 映射表 s\) 在模板中到命名的指令或模板节点。

Process a template \(list of `Node`s\) and perform directive matching against each node.

处理模板（`Node` 列表）并对每个节点执行指令匹配。

Processes a template and extract metadata about expressions and symbols within.

处理模板并提取有关其中表达式和符号的元数据。

This is a companion to the `DirectiveBinder` that doesn't require knowledge of directives matched
within the template in order to operate.

这是 `DirectiveBinder` 的伴侣，它不需要了解模板中匹配的指令即可操作。

Expressions are visited by the superclass `RecursiveAstVisitor`, with custom logic provided
by overridden methods from that visitor.

超类 `RecursiveAstVisitor` 访问表达式，自定义逻辑由该访问者的覆盖方法提供。

the nodes of the template to process

要处理的模板的节点

the `Scope` of the template being processed.

正在处理的模板的 `Scope`。

three maps which contain metadata about the template: `expressions` which interprets
special `AST` nodes in expressions as pointing to references or variables declared within the
template, `symbols` which maps those variables and references to the nested `Template` which
declares them, if any, and `nestingLevel` which associates each `Template` with a integer
nesting level \(how many levels deep within the template structure the `Template` is\), starting
at 1.

三个包含有关模板的 `symbols` 数据的映射：`expressions`，将表达式中的特殊 `AST`
节点解释为指向模板中声明的引用或变量，将这些变量和引用映射到声明它们的嵌套 `Template`
（如果有）和 `nestingLevel` 每个 `Template` 都有一个整数嵌套级别（模板在 `Template`
结构中的深度是多少），从 1 开始。

Process a template and extract metadata about expressions and symbols within.

处理模板并提取有关其中表达式和符号的元数据。

Metadata container for a `Target` that allows queries for specific bits of metadata.

允许查询特定元数据位的 `Target` 的元数据容器。

See `BoundTarget` for documentation on the individual methods.

有关各个方法的文档，请参阅 `BoundTarget`。
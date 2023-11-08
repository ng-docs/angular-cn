Controls how generics for the component context class will be handled during TCB generation.

控制在 TCB 生成期间如何处理组件上下文类的泛型。

References to generic parameter bounds will be emitted via the `TypeParameterEmitter`.

对泛型参数范围的引用将通过 `TypeParameterEmitter` 发出。

The caller must verify that all parameter bounds are emittable in order to use this mode.

调用者必须验证所有参数范围都是可发出的才能使用此模式。

Generic parameter declarations will be copied directly from the `ts.ClassDeclaration` of the
component class.

通用参数声明将直接从组件类的 `ts.ClassDeclaration` 复制。

The caller must only use the generated TCB code in a context where such copies will still be
valid, such as an inline type check block.

调用者只能在此类副本仍然有效的上下文中使用生成的 TCB 代码，例如内联类型检查块。

Any generic parameters for the component context class will be set to `any`.

组件上下文类的任何泛型参数都将设置为 `any`。

Produces a less useful type, but is always safe to use.

生成一个不太有用的类型，但使用起来始终是安全的。

an `Environment` into which type-checking code will be generated.

将在其中生成类型检查代码的 `Environment`。

a `Reference` to the component class which should be type-checked.

a 对应该进行类型检查的组件类的 `Reference`。

a `ts.Identifier` to use for the generated `ts.FunctionDeclaration`.

用于生成的 `ts.Identifier` 的 `ts.FunctionDeclaration`。

metadata about the component's template and the function being generated.

有关组件模板和正在生成的函数的元数据。

used to check and record errors regarding improper usage of DOM elements
and bindings.

用于检查和记录有关不正确使用 DOM 元素和绑定的错误。

used to record errors regarding template elements which could not be correctly
translated into types during TCB generation.

用于记录有关在 TCB 生成期间无法正确转换为类型的模板元素的错误。

controls how generic parameters \(especially parameters with generic
bounds\) will be referenced from the generated TCB code.

控制如何从生成的 TCB 代码中引用泛型参数（尤其是具有泛型边界的参数）。

Given a `ts.ClassDeclaration` for a component, and metadata regarding that component, compose a
"type check block" function.

给定组件的 `ts.ClassDeclaration` 以及有关该组件的元数据，组成一个“类型检查块”函数。

When passed through TypeScript's TypeChecker, type errors that arise within the type check block
function indicate issues in the template itself.

当通过 TypeScript 的 TypeChecker 时，类型检查块函数中出现的类型错误表明模板本身存在问题。

As a side effect of generating a TCB for the component, `ts.Diagnostic`s may also be produced
directly for issues within the template which are identified during generation. These issues are
recorded in either the `domSchemaChecker` \(which checks usage of DOM elements and bindings\) as
well as the `oobRecorder` \(which records errors when the type-checking code generator is unable
to sufficiently understand a template\).

作为为组件生成 TCB 的副作用，也可以为生成期间识别的模板中的问题直接生成 `ts.Diagnostic`
。这些问题记录在 `domSchemaChecker`（检查 DOM 元素和绑定的使用情况）以及 `oobRecorder`
（当类型检查代码生成器无法充分理解模板时记录错误）中。

A code generation operation that's involved in the construction of a Type Check Block.

类型检查块的构建中涉及的代码生成操作。

The generation of a TCB is non-linear. Bindings within a template may result in the need to
construct certain types earlier than they otherwise would be constructed. That is, if the
generation of a TCB for a template is broken down into specific operations \(constructing a
directive, extracting a variable from a let- operation, etc\), then it's possible for operations
earlier in the sequence to depend on operations which occur later in the sequence.

TCB
的生成是非线性的。模板中的绑定可能导致需要比其他方式更早地构建某些类型。也就是说，如果为模板的
TCB 的生成分解为特定的操作（构造指令、从
let-操作中提取变量等），那么序列中靠前的操作可能会依赖于发生的操作在顺序的后面。

`TcbOp` abstracts the different types of operations which are required to convert a template into
a TCB. This allows for two phases of processing for the template, where 1\) a linear sequence of
`TcbOp`s is generated, and then 2\) these operations are executed, not necessarily in linear
order.

`TcbOp` 抽象了将模板转换为 TCB 所需的不同类型的操作。这允许对模板进行两个处理阶段，其中 1\) 生成
`TcbOp` 的线性序列，然后 2\) 执行这些操作，不一定按线性顺序。

Each `TcbOp` may insert statements into the body of the TCB, and also optionally return a
`ts.Expression` which can be used to reference the operation's result.

每个 `TcbOp` 都可以将语句插入 TCB 的主体，还可以选择返回可用于引用操作结果的 `ts.Expression`。

Set to true if this operation can be considered optional. Optional operations are only executed
when depended upon by other operations, otherwise they are disregarded. This allows for less
code to generate, parse and type-check, overall positively contributing to performance.

如果此操作可以被认为是可选的，则设置为 true
。可选操作仅在被其他操作依赖时才会执行，否则它们被忽略。这允许更少的代码生成、解析和类型检查，总体上对性能有积极影响。

Replacement value or operation used while this `TcbOp` is executing \(i.e. to resolve circular
references during its execution\).

执行此 `TcbOp` 时使用的替换值或操作（即在其执行期间解析循环引用）。

This is usually a `null!` expression \(which asks TS to infer an appropriate type\), but another
`TcbOp` can be returned in cases where additional code generation is necessary to deal with
circular references.

这通常是 `null!` 表达式（要求 TS
推断适当的类型），但在需要额外代码生成来处理循环引用的情况下，可以返回另一个 `TcbOp`。

A `TcbOp` which creates an expression for a native DOM element \(or web component\) from a
`TmplAstElement`.

一个 `TcbOp`，它从 `TmplAstElement` 为原生 DOM 元素（或 Web 组件）创建表达式。

Executing this operation returns a reference to the element variable.

执行此操作会返回对元素变量的引用。

A `TcbOp` which creates an expression for particular let- `TmplAstVariable` on a
`TmplAstTemplate`'s context.

一个 `TcbOp`，它在 `TmplAstVariable` 的上下文上为特定的 `TmplAstTemplate` -TmplAstVariable
创建表达式。

Executing this operation returns a reference to the variable variable \(lol\).

执行此操作会返回对变量 variable \(lol\) 的引用。

A `TcbOp` which generates a variable for a `TmplAstTemplate`'s context.

一个 `TcbOp`，它为 `TmplAstTemplate` 的上下文生成变量。

Executing this operation returns a reference to the template's context variable.

执行此操作会返回对模板的上下文变量的引用。

A `TcbOp` which descends into a `TmplAstTemplate`'s children and generates type-checking code for
them.

一个 `TcbOp`，它会下降到 `TmplAstTemplate` 的子项并为它们生成类型检查代码。

This operation wraps the children's type-checking code in an `if` block, which may include one
or more type guard conditions that narrow types within the template body.

此操作将子项的类型检查代码包装在 `if`
块中，该块可能包含一个或多个类型保护条件，可以缩小模板主体中的类型。

A `TcbOp` which renders a text binding \(interpolation\) into the TCB.

一个 `TcbOp`，它将文本绑定（插值）渲染到 TCB 中。

Executing this operation returns nothing.

执行此操作不返回任何内容。

A `TcbOp` which constructs an instance of a directive. For generic directives, generic
parameters are set to `any` type.

构造指令实例的 `TcbOp`。对于泛型指令，泛型参数被设置为 `any` 类型。

A `TcbOp` which constructs an instance of a non-generic directive _without_ setting any of its
inputs. Inputs are later set in the `TcbDirectiveInputsOp`. Type checking was found to be
faster when done in this way as opposed to `TcbDirectiveCtorOp` which is only necessary when the
directive is generic.

一个 `TcbOp`，它在 _ 不 _ 设置任何输入的情况下构造非泛型指令的实例。输入稍后在
`TcbDirectiveInputsOp` 中设置。发现以这种方式完成的类型检查比 TcbDirectiveCtorOp 更快，
`TcbDirectiveCtorOp` 仅在指令是泛型时才需要。

Executing this operation returns a reference to the directive instance variable with its inferred
type.

执行此操作会返回对具有推断类型的指令实例变量的引用。

Creates a variable declaration for this op's directive of the argument type. Returns the id of
the newly created variable.

为此 op 的参数类型的指令创建一个变量声明。返回新创建的变量的 id。

A `TcbOp` which constructs an instance of a generic directive with its generic parameters set
to `any` type. This op is like `TcbDirectiveTypeOp`, except that generic parameters are set to
`any` type. This is used for situations where we want to avoid inlining.

一个 `TcbOp`，它构造泛型指令的实例，其泛型参数设置为 `any` 类型。此操作类似于
`TcbDirectiveTypeOp`，只是泛型参数设置为 `any` 类型。这用于我们要避免内联的情况。

Executing this operation returns a reference to the directive instance variable with its generic
type parameters set to `any`.

执行此操作会返回对指令实例变量的引用，其泛型类型参数设置为 `any`。

A `TcbOp` which creates a variable for a local ref in a template.
The initializer for the variable is the variable expression for the directive, template, or
element the ref refers to. When the reference is used in the template, those TCB statements will
access this variable as well. For example:

一个 `TcbOp`，它为模板中的本地引用创建变量。变量的初始化器是 ref
所引用的指令、模板或元素的变量表达式。在模板中使用引用时，这些 TCB 语句也将访问此变量。例如：

This operation supports more fluent lookups for the `TemplateTypeChecker` when getting a symbol
for a reference. In most cases, this isn't essential; that is, the information for the symbol
could be gathered without this operation using the `BoundTarget`. However, for the case of
ng-template references, we will need this reference variable to not only provide a location in
the shim file, but also to narrow the variable to the correct `TemplateRef<T>` type rather than
`TemplateRef<any>` \(this work is still TODO\).

此操作支持在获取引用符号时对 `TemplateTypeChecker`
进行更流式查找。在大多数情况下，这不是必需的。也就是说，可以在不使用此操作的情况下使用
`BoundTarget` 收集符号的信息。但是，对于 ng-template 引用，我们将需要此引用变量，不仅要提供在
shim 文件中的位置，还要将变量范围缩小为正确的 `TemplateRef<T>` 类型，而不是 `TemplateRef<any>`
（此工作仍然是 TODO）。

A `TcbOp` which is used when the target of a reference is missing. This operation generates a
variable of type any for usages of the invalid reference to resolve to. The invalid reference
itself is recorded out-of-band.

缺少引用目标时使用的 `TcbOp`。此操作会为要解析的无效引用的用法生成一个 any
类型的变量。无效的引用本身会被带外记录。

A `TcbOp` which constructs an instance of a directive with types inferred from its inputs. The
inputs themselves are not checked here; checking of inputs is achieved in `TcbDirectiveInputsOp`.
Any errors reported in this statement are ignored, as the type constructor call is only present
for type-inference.

一个 `TcbOp`，它构造具有从其输入推断的类型的指令的实例。此处不会检查输入本身；在
`TcbDirectiveInputsOp`
中实现对输入的检查。此语句中报告的任何错误都被忽略，因为类型构造函数调用仅用于类型推断。

When a Directive is generic, it is required that the TCB generates the instance using this method
in order to infer the type information correctly.

当 Directive 是通用的时，要求 TCB 使用此方法生成实例，以便正确推断类型信息。

A `TcbOp` which generates code to check input bindings on an element that correspond with the
members of a directive.

一个 `TcbOp`，它生成代码以检查与指令成员对应的元素上的输入绑定。

A `TcbOp` which is used to generate a fallback expression if the inference of a directive type
via `TcbDirectiveCtorOp` requires a reference to its own type. This can happen using a template
reference:

一个 `TcbOp`，如果通过 `TcbDirectiveCtorOp`
的指令类型的推断需要对其自己的类型的引用，则用于生成后备表达式。这可以用模板引用来实现：

In this case, `TcbDirectiveCtorCircularFallbackOp` will add a second inference of the directive
type to the type-check block, this time calling the directive's type constructor without any
input expressions. This infers the widest possible supertype for the directive, which is used to
resolve any recursive references required to infer the real type.

在这种情况下，`TcbDirectiveCtorCircularFallbackOp`
将指令类型的第二个推断添加到类型检查块，这一次调用指令的类型构造函数而不使用任何输入表达式。这会推断出指令的最广泛的超类型，该超类型用于解析推断真实类型所需的任何递归引用。

A `TcbOp` which feeds elements and unclaimed properties to the `DomSchemaChecker`.

一个 `TcbOp`，它将元素和无人认领的属性提供给 `DomSchemaChecker`。

The DOM schema is not checked via TCB code generation. Instead, the `DomSchemaChecker` ingests
elements and property bindings and accumulates synthetic `ts.Diagnostic`s out-of-band. These are
later merged with the diagnostics generated from the TCB.

不会通过 TCB 代码生成检查 DOM 模式。相反，`DomSchemaChecker`
摄取元素和属性绑定，并带外累积合成的 `ts.Diagnostic`。这些稍后会与从 TCB 生成的诊断合并。

For convenience, the TCB iteration of the template is used to drive the `DomSchemaChecker` via
the `TcbDomSchemaCheckerOp`.

为方便起见，模板的 TCB 迭代用于通过 `TcbDomSchemaCheckerOp` `DomSchemaChecker`

Mapping between attributes names that don't correspond to their element property names.
Note: this mapping has to be kept in sync with the equally named mapping in the runtime.

与其元素属性名称不对应的属性名称之间的映射。注意：此映射必须与运行时中同名的映射保持同步。

A `TcbOp` which generates code to check "unclaimed inputs" - bindings on an element which were
not attributed to any directive or component, and are instead processed against the HTML element
itself.

一个 `TcbOp`，它生成代码以检查“无人认领的输入” -
元素上的绑定，这些绑定不属于任何指令或组件，而是针对 HTML 元素本身进行处理。

Currently, only the expressions of these bindings are checked. The targets of the bindings are
checked against the DOM schema via a `TcbDomSchemaCheckerOp`.

当前，仅检查这些绑定的表达式。通过 `TcbDomSchemaCheckerOp` 对照 DOM 模式检查绑定的目标。

A `TcbOp` which generates code to check event bindings on an element that correspond with the
outputs of a directive.

一个 `TcbOp`，它生成代码以检查元素上与指令输出对应的事件绑定。

A `TcbOp` which generates code to check "unclaimed outputs" - event bindings on an element which
were not attributed to any directive or component, and are instead processed against the HTML
element itself.

一种 `TcbOp`，它生成代码以检查“无人认领的输出” -
元素上的事件绑定，不属于任何指令或组件，而是针对 HTML 元素本身进行处理。

A `TcbOp` which generates a completion point for the component context.

一个 `TcbOp`，它为组件上下文生成完成点。

This completion point looks like `this. ;` in the TCB output, and does not produce diagnostics.
TypeScript autocompletion APIs can be used at this completion point \(after the '.'\) to produce
autocompletion results of properties and methods from the template's component context.

此完成点如下 `this. ;` 在 TCB 输出中，并且不生成诊断。可以在此完成点（“.”之后）使用 TypeScript
自动完成 API 来从模板的组件上下文生成属性和方法的自动完成结果。

Value used to break a circular reference between `TcbOp`s.

用于中断 `TcbOp` 之间的循环引用的值。

This value is returned whenever `TcbOp`s have a circular dependency. The expression is a non-null
assertion of the null value \(in TypeScript, the expression `null!`\). This construction will infer
the least narrow type for whatever it's assigned to.

每当 `TcbOp` 具有循环依赖项时，都会返回此值。该表达式是 null 值的非 null 断言（在 TypeScript
中，为表达式 `null!`）。这种构造将推断它分配给的任何内容的最小窄类型。

Overall generation context for the type check block.

类型检查块的整体生成上下文。

`Context` handles operations during code generation which are global with respect to the whole
block. It's responsible for variable name allocation and management of any imports needed. It
also contains the template metadata itself.

`Context`
会处理代码生成期间的操作，这些操作相对于整个块是全局的。它负责变量名分配和管理所需的任何导入。它还包含模板元数据本身。

Allocate a new variable name for use within the `Context`.

分配一个新的变量名以在 `Context` 中使用。

Currently this uses a monotonically increasing counter, but in the future the variable name
might change depending on the type of data being stored.

当前，这使用单调递增的计数器，但将来变量名可能会根据要存储的数据类型而更改。

Local scope within the type check block for a particular template.

特定模板的类型检查块中的本地范围。

The top-level template and each nested `<ng-template>` have their own `Scope`, which exist in a
hierarchy. The structure of this hierarchy mirrors the syntactic scopes in the generated type
check block, where each nested template is encased in an `if` structure.

顶级模板和每个嵌套 `<ng-template>` 都有自己的 `Scope`
，它们以层次结构存在。此层次结构的结构反映了生成的类型检查块中的语法范围，其中每个嵌套模板都包含在
`if` 结构中。

As a template's `TcbOp`s are executed in a given `Scope`, statements are added via
`addStatement()`. When this processing is complete, the `Scope` can be turned into a `ts.Block`
via `renderToBlock()`.

由于模板的 `TcbOp` 是在给定的 `Scope` 中执行的，因此可以通过 `addStatement()`
添加语句。完成此处理后，可以通过 `renderToBlock()` 将 `Scope` 转换为 `ts.Block`。

If a `TcbOp` requires the output of another, it can call `resolve()`.

如果 `TcbOp` 需要另一个 TcbOp 的输出，它可以调用 `resolve()`。

the overall context of TCB generation.

TCB 生成的整体上下文。

the `Scope` of the parent template \(if any\) or `null` if this is the root
`Scope`.

父模板的 `Scope`（如果有），如果这是根 `Scope`，则为 `null`。

either a `TmplAstTemplate` representing the template for which to
calculate the `Scope`, or a list of nodes if no outer template object is available.

表示要为其计算 `Scope` 的模板的 `TmplAstTemplate`，如果没有外部模板对象可用，则为节点列表。

an expression that is applied to this scope for type narrowing purposes.

用于此范围的类型缩小的表达式。

Constructs a `Scope` given either a `TmplAstTemplate` or a list of `TmplAstNode`s.

在给定 `TmplAstTemplate` 或 `TmplAstNode` 列表的情况下构造一个 `Scope`。

a `TmplAstNode` of the operation in question. The lookup performed will depend on
the type of this node:

相关操作的 `TmplAstNode`。执行的查找将取决于此节点的类型：

Assuming `directive` is not present, then `resolve` will return:

假设不存在 `directive`，则 `resolve` 将返回：

`TmplAstElement` - retrieve the expression for the element DOM node

`TmplAstElement` - 检索元素 DOM 节点的表达式

`TmplAstTemplate` - retrieve the template context variable

`TmplAstTemplate` - 检索模板上下文变量

`TmplAstVariable` - retrieve a template let- variable

`TmplAstVariable` - 检索模板 let-variable

`TmplAstReference` - retrieve variable created for the local ref

`TmplAstReference` - 检索为本地 ref 创建的变量

if present, a directive type on a `TmplAstElement` or `TmplAstTemplate` to
look up instead of the default for an element or template node.

如果存在，则为要查找的 `TmplAstElement` 或 `TmplAstTemplate`
上的指令类型，而不是元素或模板节点的默认值。

Look up a `ts.Expression` representing the value of some operation in the current `Scope`,
including any parent scope\(s\). This method always returns a mutable clone of the
`ts.Expression` with the comments cleared.

查找表示当前 `Scope` 中某些操作的值的 `ts.Expression`，包括任何父范围。此方法始终返回
`ts.Expression` 的可变克隆，并且清除了注释。

Add a statement to this scope.

向此范围添加语句。

Get the statements.

获取语句。

Returns an expression of all template guards that apply to this scope, including those of
parent scopes. If no guards have been applied, null is returned.

返回适用于此范围的所有模板保护的表达式，包括父范围的模板保护。如果没有应用保护，则返回 null。

Create the `this` parameter to the top-level TCB function, with the given generic type
arguments.

使用给定的泛型类型参数，为顶级 TCB 函数创建 `this` 参数。

Process an `AST` expression and convert it into a `ts.Expression`, generating references to the
correct identifiers in the current scope.

处理 `AST` 表达式并将其转换为 `ts.Expression`，在当前范围内生成对正确标识符的引用。

Resolve an `AST` expression within the given scope.

在给定范围内解析 `AST` 表达式。

Some `AST` expressions refer to top-level concepts \(references, variables, the component
context\). This method assists in resolving those.

某些 `AST` 表达式引用了顶级概念（引用、变量、组件上下文）。此方法可帮助解决这些问题。

Attempts to resolve a bound target for a given expression, and translates it into the
appropriate `ts.Expression` that represents the bound target. If no target is available,
`null` is returned.

尝试解析给定表达式的绑定目标，并将其转换为表示绑定目标的适当 `ts.Expression`
。如果没有目标可用，则返回 `null`。

Call the type constructor of a directive instance on a given template node, inferring a type for
the directive instance from any bound inputs.

在给定的模板节点上调用指令实例的类型构造函数，从任何绑定的输入中推断指令实例的类型。

Translates the given attribute binding to a `ts.Expression`.

将给定的属性绑定转换为 `ts.Expression`。

Potentially widens the type of `expr` according to the type-checking configuration.

根据类型检查的配置，可能会扩大 `expr` 的类型。

An input binding that corresponds with a field of a directive.

与指令的字段对应的输入绑定。

The name of a field on the directive that is set.

设置的指令上的字段名称。

The `ts.Expression` corresponding with the input binding expression.

与输入绑定表达式对应的 `ts.Expression`。

The source span of the full attribute binding.

完整属性绑定的源范围。

Indicates that a certain field of a directive does not have a corresponding input binding.

表明指令的某个字段没有对应的输入绑定。

The name of a field on the directive for which no input binding is present.

指令中不存在输入绑定的字段的名称。

Creates an arrow function to be used as handler function for event bindings. The handler
function has a single parameter `$event` and the bound event's handler `AST` represented as a
TypeScript expression as its body.

创建一个要用作事件绑定的处理程序函数的箭头函数。处理程序函数有一个参数 `$event`，并以 TypeScript
表达式的形式表示的绑定事件的处理程序 `AST` 作为其主体。

When `eventType` is set to `Infer`, the `$event` parameter will not have an explicit type. This
allows for the created handler function to have its `$event` parameter's type inferred based on
how it's used, to enable strict type checking of event bindings. When set to `Any`, the `$event`
parameter will have an explicit `any` type, effectively disabling strict type checking of event
bindings. Alternatively, an explicit type can be passed for the `$event` parameter.

当 `eventType` 设置为 `Infer` 时，`$event`
参数将没有显式类型。这允许创建的处理程序函数根据其使用方式推断其 `$event`
参数的类型，以启用对事件绑定的严格类型检查。当设置为 `Any` 时，`$event` 参数将具有显式 `any`
类型，有效禁用事件绑定的严格类型检查。或者，可以为 `$event` 参数传递显式类型。

Similar to `tcbExpression`, this function converts the provided `AST` expression into a
`ts.Expression`, with special handling of the `$event` variable that can be used within event
bindings.

与 `tcbExpression` 类似，此函数将提供的 `AST` 表达式转换为 `ts.Expression`
，并对可在事件绑定中使用的 `$event` 变量进行特殊处理。
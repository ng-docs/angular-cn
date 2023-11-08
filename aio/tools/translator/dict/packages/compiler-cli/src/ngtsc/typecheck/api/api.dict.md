Extension of `DirectiveMeta` that includes additional information required to type-check the
usage of a particular directive.

`DirectiveMeta` 的扩展，包括对特定指令的使用进行类型检查所需的附加信息。

A `ts.Diagnostic` with additional information about the diagnostic related to template
type-checking.

一个 `ts.Diagnostic`，其中包含有关与模板类型检查相关的诊断的附加信息。

The component with the template that resulted in this diagnostic.

具有导致此诊断的模板的组件。

The template id of the component that resulted in this diagnostic.

导致此诊断的组件的模板 ID。

A `TemplateDiagnostic` with a specific error code.

具有特定错误代码的 `TemplateDiagnostic`。

Metadata required in addition to a component class in order to generate a type check block \(TCB\)
for that component.

除了组件类之外还需要元数据，以便为该组件生成类型检查块 \(TCB\)。

A unique identifier for the class which gave rise to this TCB.

产生此 TCB 的类的唯一标识符。

This can be used to map errors back to the `ts.ClassDeclaration` for the component.

这可用于将错误映射回组件的 `ts.ClassDeclaration`。

Semantic information about the template of the component.

有关组件模板的语义信息。

Schemas that apply to this template.

适用于此模板的架构。

The name of the requested type constructor function.

请求的类型构造函数的名称。

Whether to generate a body for the function or not.

是否为函数生成主体。

Input, output, and query field names in the type which should be included as constructor input.

应作为构造函数输入包含的类型中的输入、输出和查询字段名称。

`Set` of field names which have type coercion enabled.

启用了类型强制的字段名称 `Set`。

Whether to check the left-hand side type of binding operations.

是否勾选左侧绑定操作类型。

For example, if this is `false` then the expression `[input]="expr"` will have `expr` type-
checked, but not the assignment of the resulting type to the `input` property of whichever
directive or component is receiving the binding. If set to `true`, both sides of the assignment
are checked.

例如，如果 this 为 `false`，则表达式 `[input]="expr"` 将进行 `expr`
类型检查，但不会将结果类型分配给正在接收绑定的任何指令或组件的 `input` 属性。如果设置为 `true`
，则会检查赋值的两边。

This flag only affects bindings to components/directives. Bindings to the DOM are checked if
`checkTypeOfDomBindings` is set.

此标志仅影响到组件/指令的绑定。如果设置了 `checkTypeOfDomBindings`，则检查与 DOM 的绑定。

Whether to honor the access modifiers on input bindings for the component/directive.

是否遵守组件/指令输入绑定的访问修饰符。

If a template binding attempts to assign to an input that is private/protected/readonly,
this will produce errors when enabled but will not when disabled.

如果模板绑定尝试分配给私有/受保护/只读的输入，这将在启用时产生错误，但在禁用时不会产生错误。

Whether to use strict null types for input bindings for directives.

是否对指令的输入绑定使用严格的 null 类型。

If this is `true`, applications that are compiled with TypeScript's `strictNullChecks` enabled
will produce type errors for bindings which can evaluate to `undefined` or `null` where the
inputs's type does not include `undefined` or `null` in its type. If set to `false`, all
binding expressions are wrapped in a non-null assertion operator to effectively disable strict
null checks. This may be particularly useful when the directive is from a library that is not
compiled with `strictNullChecks` enabled.

如果这是 `true`，则在启用 TypeScript 的 `strictNullChecks` 的情况下编译的应用程序将为绑定产生类型错误，这些绑定可以计算为 `undefined` 或 `null`，其中输入的类型不包括 `undefined` 或 `null` 的类型。如果设置为 `false`，所有绑定表达式都包含在非空断言运算符中以有效地禁用严格的空检查。当指令来自未启用 `strictNullChecks` 编译的库时，这可能特别有用。

If `checkTypeOfInputBindings` is set to `false`, this flag has no effect.

如果 `checkTypeOfInputBindings` 设置为 `false`，则此标志无效。

Whether to check text attributes that happen to be consumed by a directive or component.

是否检查恰好被指令或组件使用的文本属性。

For example, in a template containing `<input matInput disabled>` the `disabled` attribute ends
up being consumed as an input with type `boolean` by the `matInput` directive. At runtime, the
input will be set to the attribute's string value, which is an empty string for attributes
without a value, so with this flag set to `true`, an error would be reported. If set to
`false`, text attributes will never report an error.

例如，在包含 `<input matInput disabled>` 的模板中，`disabled` 属性最终会被 `matInput` 指令作为
`boolean`
类型的输入使用。在运行时，输入将设置为属性的字符串值，对于没有值的属性，这是一个空字符串，因此在此标志设置为
`true` 的情况下，将报告错误。如果设置为 `false`，则文本属性将永远不会报告错误。

Note that if `checkTypeOfInputBindings` is set to `false`, this flag has no effect.

请注意，如果 `checkTypeOfInputBindings` 设置为 `false`，则此标志无效。

Whether to check the left-hand side type of binding operations to DOM properties.

是否检查左侧类型对 DOM 属性的绑定操作。

As `checkTypeOfBindings`, but only applies to bindings to DOM properties.

作为 `checkTypeOfBindings`，但只适用于绑定到 DOM 属性。

This does not affect the use of the `DomSchemaChecker` to validate the template against the DOM
schema. Rather, this flag is an experimental, not yet complete feature which uses the
lib.dom.d.ts DOM typings in TypeScript to validate that DOM bindings are of the correct type
for assignability to the underlying DOM element properties.

这不会影响使用 `DomSchemaChecker` 根据 DOM 模式验证模板。相反，此标志是一个实验性的、尚未完成的功能，它使用 TypeScript 中的 lib.dom.d.ts DOM 类型来验证 DOM 绑定的类型是否正确，以便可分配给底层 DOM 元素属性。

Whether to infer the type of the `$event` variable in event bindings for directive outputs or
animation events.

是在指令输出或动画事件的事件绑定中推断 `$event` 变量的类型。

If this is `true`, the type of `$event` will be inferred based on the generic type of
`EventEmitter`/`Subject` of the output. If set to `false`, the `$event` variable will be of
type `any`.

如果为 `true`，则 `$event` 的类型将根据输出的 `EventEmitter` / `Subject`
的泛型类型来推断。如果设置为 `false`，则 `$event` 变量将是 `any` 类型。

Whether to infer the type of the `$event` variable in event bindings for animations.

是否推断动画事件绑定中 `$event` 变量的类型。

If this is `true`, the type of `$event` will be `AnimationEvent` from `@angular/animations`.
If set to `false`, the `$event` variable will be of type `any`.

如果这是 `true`，`$event` 的类型将是来自 `@angular/animations` 的 `AnimationEvent`。如果设置为 `false`，`$event` 变量将是 `any` 类型。

Whether to infer the type of the `$event` variable in event bindings to DOM events.

是否在到 DOM 事件的事件绑定中推断 `$event` 变量的类型。

If this is `true`, the type of `$event` will be inferred based on TypeScript's
`HTMLElementEventMap`, with a fallback to the native `Event` type. If set to `false`, the
`$event` variable will be of type `any`.

如果为 `true`，则 `$event` 的类型将根据 TypeScript 的 `HTMLElementEventMap` 推断，并回退到原生
`Event` 类型。如果设置为 `false`，则 `$event` 变量将是 `any` 类型。

Whether to infer the type of local references to DOM elements.

是否推断对 DOM 元素的局部引用的类型。

If this is `true`, the type of a `#ref` variable on a DOM node in the template will be
determined by the type of `document.createElement` for the given DOM node type. If set to
`false`, the type of `ref` for DOM nodes will be `any`.

如果这是 `true`，则模板中 DO​​M 节点上的 `#ref` 变量的类型将由给定 DOM 节点类型的 `document.createElement` 类型确定。如果设置为 `false`，DOM 节点的 `ref` 类型将为 `any`。

Whether to infer the type of local references.

是否推断本地引用的类型。

If this is `true`, the type of a `#ref` variable that points to a directive or `TemplateRef` in
the template will be inferred correctly. If set to `false`, the type of `ref` for will be
`any`.

如果这是 `true`，则指向模板中的指令或 `TemplateRef` `#ref` 变量的类型将被正确推断。如果设置为 `false`，则 `ref` 的类型将为 `any`。

Whether to adjust the output of the TCB to ensure compatibility with the `TemplateTypeChecker`.

是否调整 TCB 的输出以确保与 `TemplateTypeChecker` 的兼容性。

The statements generated in the TCB are optimized for performance and producing diagnostics.
These optimizations can result in generating a TCB that does not have all the information
needed by the `TemplateTypeChecker` for retrieving `Symbol`s. For example, as an optimization,
the TCB will not generate variable declaration statements for directives that have no
references, inputs, or outputs. However, the `TemplateTypeChecker` always needs these
statements to be present in order to provide `ts.Symbol`s and `ts.Type`s for the directives.

TCB 中生成的语句针对性能和生成诊断进行了优化。这些优化可能导致生成的 TCB 不具有 `TemplateTypeChecker` 检索 `Symbol` 所需的所有信息。例如，作为优化，TCB 不会为没有引用、输入或输出的指令生成变量声明语句。但是，`TemplateTypeChecker` 始终需要存在这些语句，以便为指令提供 `ts.Symbol` s 和 `ts.Type` s。

When set to `false`, enables TCB optimizations for template diagnostics.
When set to `true`, ensures all information required by `TemplateTypeChecker` to
retrieve symbols for template nodes is available in the TCB.

设置为 `false` 时，为模板诊断启用 TCB 优化。设置为 `true` 时，确保 `TemplateTypeChecker` 检索模板节点符号所需的所有信息在 TCB 中可用。

Whether to include type information from pipes in the type-checking operation.

是否在类型检查操作中包含来自管道的类型信息。

If this is `true`, then the pipe's type signature for `transform()` will be used to check the
usage of the pipe. If this is `false`, then the result of applying a pipe will be `any`, and
the types of the pipe's value and arguments will not be matched against the `transform()`
method.

如果这是 `true`，那么管道的 `transform()` 类型签名将用于检查管道的使用情况。如果这是 `false`，那么应用管道的结果将为 `any`，并且管道的值和参数的类型将不会与 `transform()` 方法匹配。

Whether to narrow the types of template contexts.

是否缩小模板上下文的类型。

Whether to use a strict type for null-safe navigation operations.

是否将严格类型用于 null 安全的导航操作。

If this is `false`, then the return type of `a?.b` or `a?()` will be `any`. If set to `true`,
then the return type of `a?.b` for example will be the same as the type of the ternary
expression `a != null ? a.b : a`.

如果这是 `false`，则 `a?.b` 或 `a?()` 的返回类型将是 `any`。如果设置为 `true`，则 `a?.b`
的返回类型将与三元表达式 `a != null ? ab : a` 的类型相同 `a != null ? ab : a`。

Whether to descend into template bodies and check any bindings there.

是否进入模板主体并检查那里的任何绑定。

Whether to always apply DOM schema checks in template bodies, independently of the
`checkTemplateBodies` setting.

是否始终在模板主体中应用 DOM 模式检查，独立于 `checkTemplateBodies` 设置。

Whether to check resolvable queries.

是否检查可解析的查询。

This is currently an unsupported feature.

这是目前不受支持的功能。

Whether to use any generic types of the context component.

是否使用上下文组件的任何通用类型。

If this is `true`, then if the context component has generic types, those will be mirrored in
the template type-checking context. If `false`, any generic type parameters of the context
component will be set to `any` during type-checking.

如果这是 `true`，那么如果上下文组件具有泛型类型，这些将在模板类型检查上下文中得到镜像。如果为 `false`，上下文组件的任何通用类型参数都将在类型检查期间设置为 `any`。

Whether or not to infer types for object and array literals in the template.

是否推断模板中对象和数组文字的类型。

If this is `true`, then the type of an object or an array literal in the template will be the
same type that TypeScript would infer if the literal appeared in code. If `false`, then such
literals are cast to `any` when declared.

如果这是 `true`，那么模板中的对象或数组文字的类型将与文字出现在代码中时 TypeScript 推断的类型相同。如果为 `false`，则此类文字在声明时将强制转换为 `any`。

Whether to use inline type constructors.

是否使用内联类型构造函数。

If this is `true`, create inline type constructors when required. For example, if a type
constructor's parameters has private types, it cannot be created normally, so we inline it in
the directives definition file.

如果这是 `true`，则在需要时创建内联类型构造函数。例如，如果类型构造函数的参数有私有类型，则无法正常创建，因此我们将其内联到指令定义文件中。

If false, do not create inline type constructors. Fall back to using `any` type for
constructors that normally require inlining.

如果为 false，则不创建内联类型构造函数。回退到对通常需要内联的构造函数使用 `any` 类型。

This option requires the environment to support inlining. If the environment does not support
inlining, this must be set to `false`.

此选项需要环境支持内联。如果环境不支持内联，则必须将其设置为 `false`。

Whether or not to produce diagnostic suggestions in cases where the compiler could have
inferred a better type for a construct, but was prevented from doing so by the current type
checking configuration.

在编译器可以为构造推断出更好的类型但被当前类型检查配置阻止这样做的情况下是否生成诊断建议。

For example, if the compiler could have used a template context guard to infer a better type
for a structural directive's context and `let-` variables, but the user is in
`fullTemplateTypeCheck` mode and such guards are therefore disabled.

例如，如果编译器可以使用模板上下文保护来为结构指令的上下文和 `let-` 变量推断更好的类型，但用户处于 `fullTemplateTypeCheck` 模式，因此此类保护被禁用。

This mode is useful for clients like the Language Service which want to inform users of
opportunities to improve their own developer experience.

这种模式对于像语言服务这样的客户很有用，他们希望通知用户有机会改善他们自己的开发者体验。

A mapping to an inline template in a TS file.

映射到 TS 文件中的内联模板。

`ParseSourceSpan`s for this template should be accurate for direct reporting in a TS error
message.

此模板的 `ParseSourceSpan` 应该是准确的，以便在 TS 错误消息中直接报告。

A mapping to a template which is still in a TS file, but where the node positions in any
`ParseSourceSpan`s are not accurate for one reason or another.

到仍在 TS 文件中的模板的映射，但由于某种原因，任何 `ParseSourceSpan` 中的节点位置都不准确。

This can occur if the template expression was interpolated in a way where the compiler could not
construct a contiguous mapping for the template string. The `node` refers to the `template`
expression.

如果以编译器无法为模板字符串构造连续映射的方式插入模板表达式，就会发生这种情况。`node` 引用 `template` 表达式。

A mapping to a template declared in an external HTML file, where node positions in
`ParseSourceSpan`s represent accurate offsets into the external file.

到外部 HTML 文件中声明的模板的映射，其中 `ParseSourceSpan` 中的节点位置表示到外部文件的准确偏移量。

In this case, the given `node` refers to the `templateUrl` expression.

在这种情况下，给定 `node` 引用 `templateUrl` 表达式。

A mapping of a TCB template id to a span in the corresponding template source.

TCB 模板 ID 到相应模板源中的跨度的映射。

A representation of all a node's template mapping information we know. Useful for producing
diagnostics based on a TCB node or generally mapping from a TCB node back to a template location.

我们知道的所有节点模板映射信息的表示。用于基于 TCB 节点生成诊断或通常从 TCB 节点映射回模板位置。
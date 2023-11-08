How the selector scope of an NgModule \(its declarations, imports, and exports\) should be emitted
as a part of the NgModule definition.

NgModule 的选择器范围（其声明、导入和导出）应如何作为 NgModule 定义的一部分发出。

Emit the declarations inline into the module definition.

将声明内联发送到模块定义中。

This option is useful in certain contexts where it's known that JIT support is required. The
tradeoff here is that this emit style prevents directives and pipes from being tree-shaken if
they are unused, but the NgModule is used.

此选项在某些已知需要 JIT 支持的上下文中很有用。这里的权衡是，这种 emit
风格可以防止指令和管道在未使用时被树形抖动，但使用了 NgModule。

Emit the declarations using a side effectful function call, `ɵɵsetNgModuleScope`, that is
guarded with the `ngJitMode` flag.

使用由 `ngJitMode` 标志保护的副作用函数调用 `ɵɵsetNgModuleScope` 发出声明。

This form of emit supports JIT and can be optimized away if the `ngJitMode` flag is set to
false, which allows unused directives and pipes to be tree-shaken.

这种形式的 Emit 支持 JIT，如果将 `ngJitMode` 标志设置为 false
，可以将其优化掉，这允许对未使用的指令和管道进行树形抖动。

Don't generate selector scopes at all.

根本不生成选择器范围。

This is useful for contexts where JIT support is known to be unnecessary.

这对于已知不需要 JIT 支持的上下文很有用。

Metadata required by the module compiler to generate a module def \(`ɵmod`\) for a type.

模块编译器为某种类型生成模块 def \( `ɵmod` \) 所需的元数据。

An expression representing the module type being compiled.

表示正在编译的模块类型的表达式。

An array of expressions representing the bootstrap components specified by the module.

表示模块指定的引导组件的表达式数组。

An array of expressions representing the directives and pipes declared by the module.

表示模块声明的指令和管道的表达式数组。

Those declarations which should be visible to downstream consumers. If not specified, all
declarations are made visible to downstream consumers.

下游消费者应该可见的那些声明。如果未指定，则所有声明都对下游消费者可见。

An array of expressions representing the imports of the module.

表示模块导入的表达式数组。

Whether or not to include `imports` in generated type declarations.

是否在生成的类型声明中包含 `imports`。

An array of expressions representing the exports of the module.

表示模块导出的表达式数组。

How to emit the selector scope values \(declarations, imports, exports\).

如何发出选择器范围值（声明、导入、导出）。

Whether to generate closure wrappers for bootstrap, declarations, imports, and exports.

是否为引导、声明、导入和导出生成闭包包装器。

The set of schemas that declare elements to be allowed in the NgModule.

声明 NgModule 中允许的元素的模式集。

Unique ID or expression representing the unique ID of an NgModule.

表示 NgModule 的唯一 ID 的唯一 ID 或表达式。

The shape of the object literal that is passed to the `ɵɵdefineNgModule()` call.

传递给 `ɵɵdefineNgModule()` 调用的对象文字的形状。

An expression evaluating to an array of expressions representing the bootstrap components
specified by the module.

一个表达式，估算为表示模块指定的引导组件的表达式数组。

An expression evaluating to an array of expressions representing the directives and pipes
declared by the module.

一个表达式，估算为表示模块声明的指令和管道的表达式数组。

An expression evaluating to an array of expressions representing the imports of the module.

一个表达式，估算为表示模块导入的表达式数组。

An expression evaluating to an array of expressions representing the exports of the module.

一个表达式，估算为表示模块导出的表达式数组。

A literal array expression containing the schemas that declare elements to be allowed in the
NgModule.

一个文字数组表达式，包含声明 NgModule 中允许的元素的模式。

An expression evaluating to the unique ID of an NgModule.

估算为 NgModule 的唯一 ID 的表达式。

Construct an `R3NgModuleDef` for the given `R3NgModuleMetadata`.

为给定的 `R3NgModuleMetadata` `R3NgModuleDef`

This function is used in JIT mode to generate the call to `ɵɵdefineNgModule()` from a call to
`ɵɵngDeclareNgModule()`.

此函数在 JIT 模式下使用，以通过对 ɵɵngDeclareNgModule\(\) 的调用生成对 `ɵɵdefineNgModule()`
`ɵɵngDeclareNgModule()` 调用。

Generates a function call to `ɵɵsetNgModuleScope` with all necessary information so that the
transitive module scope can be computed during runtime in JIT mode. This call is marked pure
such that the references to declarations, imports and exports may be elided causing these
symbols to become tree-shakeable.

使用所有必要信息生成对 `ɵɵsetNgModuleScope` 的函数调用，以便可以在运行时以 JIT
模式计算可传递模块范围。此调用被标记为 pure
，以便可以忽略对声明、导入和导出的引用，导致这些符号变得可树摇。
Keep track of the compilation depth to avoid reentrancy issues during JIT compilation. This
matters in the following scenario:

跟踪编译深度以避免 JIT 编译期间的重入问题。这在以下情况下很重要：

Consider a component 'A' that extends component 'B', both declared in module 'M'. During
the compilation of 'A' the definition of 'B' is requested to capture the inheritance chain,
potentially triggering compilation of 'B'. If this nested compilation were to trigger
`flushModuleScopingQueueAsMuchAsPossible` it may happen that module 'M' is still pending in the
queue, resulting in 'A' and 'B' to be patched with the NgModule scope. As the compilation of
'A' is still in progress, this would introduce a circular dependency on its compilation. To avoid
this issue, the module scope queue is only flushed for compilations at the depth 0, to ensure
all compilations have finished.

考虑一个扩展组件“B”的组件“A”，两者都在模块“M”中声明。在“A”的编译期间，会请求“B”的定义以捕获继承链，这可能会触发“B”的编译。如果此嵌套编译要触发
`flushModuleScopingQueueAsMuchAsPossible`
，则可能会出现模块“M”仍然在队列中挂起的情况，导致“A”和“B”要使用 NgModule
范围进行修补。由于“A”的编译仍在进行中，这将引入对其编译的循环依赖。为避免此问题，仅在深度 0
处进行编译时才会刷新模块范围队列，以确保所有编译都已完成。

Compile an Angular component according to its decorator metadata, and patch the resulting
component def \(ɵcmp\) onto the component type.

根据其装饰器元数据编译 Angular 组件，并将生成的组件 def \(ɵcmp\) 修补到组件类型上。

Compilation may be asynchronous \(due to the need to resolve URLs for the component template or
other resources, for example\). In the event that compilation is not immediate, `compileComponent`
will enqueue resource resolution into a global queue and will fail to return the `ɵcmp`
until the global queue has been resolved with a call to `resolveComponentResources`.

编译可能是异步的（例如，由于需要解析组件模板或其他资源的 URL）。如果不是立即编译，
`compileComponent` 会将资源解析排入全局队列，并且在调用 `resolveComponentResources`
解析全局队列之前，将无法返回 `ɵcmp`。

Build memoized `directiveDefs` and `pipeDefs` functions for the component definition of a
standalone component, which process `imports` and filter out directives and pipes. The use of
memoized functions here allows for the delayed resolution of any `forwardRef`s present in the
component's `imports`.

为独立组件的组件定义构建 memoized `directiveDefs` 和 `pipeDefs` 函数，它们会处理 `imports`
并过滤掉指令和管道。在这里使用记忆化函数允许延迟解析组件的 `imports` 中存在的任何 `forwardRef`。

Compile an Angular directive according to its decorator metadata, and patch the resulting
directive def onto the component type.

根据其装饰器元数据编译 Angular 指令，并将结果指令 def 修补到组件类型上。

In the event that compilation is not immediate, `compileDirective` will return a `Promise` which
will resolve when compilation completes and the directive becomes usable.

如果编译不是立即的，`compileDirective` 将返回一个 `Promise`
，它将在编译完成并且指令变得可用时解析。

Extract the `R3DirectiveMetadata` for a particular directive \(either a `Directive` or a
`Component`\).

提取特定指令（`Directive` 或 `Component`）的 `R3DirectiveMetadata`。

Adds a directive definition to all parent classes of a type that don't have an Angular decorator.

向一种没有 Angular 装饰器的类型的所有父类添加指令定义。
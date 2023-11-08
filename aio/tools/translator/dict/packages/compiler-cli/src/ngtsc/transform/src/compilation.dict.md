Records information about a specific class that has matched traits.

记录有关具有匹配特性的特定类的信息。

The `ClassDeclaration` of the class which has Angular traits applied.

应用了 Angular 特性的类的 `ClassDeclaration`。

All traits which matched on the class.

在类上匹配的所有特性。

Meta-diagnostics about the class, which are usually related to whether certain combinations of
Angular decorators are not permitted.

关于类的元诊断，通常与是否允许 Angular 装饰器的某些组合有关。

Whether `traits` contains traits matched from `DecoratorHandler`s marked as `WEAK`.

`traits` 是否包含从标记为 `WEAK` 的 `DecoratorHandler` 匹配的特性。

Whether `traits` contains a trait from a `DecoratorHandler` matched as `PRIMARY`.

`traits` 是否包含来自 `DecoratorHandler` 的匹配为 `PRIMARY` 的特性。

The heart of Angular compilation.

Angular 编译的核心。

The `TraitCompiler` is responsible for processing all classes in the program. Any time a
`DecoratorHandler` matches a class, a "trait" is created to represent that Angular aspect of the
class \(such as the class having a component definition\).

`TraitCompiler` 负责处理程序中的所有类。任何时候 `DecoratorHandler`
与类匹配时，都会创建一个“特征”来表示类的该 Angular 切面（例如具有组件定义的类）。

The `TraitCompiler` transitions each trait through the various phases of compilation, culminating
in the production of `CompileResult`s instructing the compiler to apply various mutations to the
class \(like adding fields or type declarations\).

`TraitCompiler` 通过编译的各个阶段转换每个特性，最终会生成 `CompileResult`
，以指示编译器对类应用各种突变（例如添加字段或类型声明）。

Generate type-checking code into the `TypeCheckContext` for any components within the given
`ts.SourceFile`.

为给定的 `TypeCheckContext` 中的任何组件在 `ts.SourceFile` 中生成类型检查代码。
The scope that is used for type-check code generation of a component template.

用于组件模板的类型检查代码生成的范围。

A `SelectorMatcher` instance that contains the flattened directive metadata of all directives
that are in the compilation scope of the declaring NgModule.

一个 `SelectorMatcher` 实例，包含声明的 NgModule 的编译范围内的所有指令的展平指令元数据。

All of the directives available in the compilation scope of the declaring NgModule.

声明的 NgModule 的编译范围内可用的所有指令。

The pipes that are available in the compilation scope.

编译范围中可用的管道。

The schemas that are used in this scope.

此范围中使用的模式。

Whether the original compilation scope which produced this `TypeCheckScope` was itself poisoned
\(contained semantic errors during its production\).

生成此 `TypeCheckScope` 的原始编译范围本身是否已中毒（在其生产过程中包含语义错误）。

Computes scope information to be used in template type checking.

计算要在模板类型检查中使用的范围信息。

Computes the type-check scope information for the component declaration. If the NgModule
contains an error, then 'error' is returned. If the component is not declared in any NgModule,
an empty type-check scope is returned.

计算组件声明的类型检查范围信息。如果 NgModule 包含错误，则返回 'error'。如果未在任何 NgModule
中声明组件，则返回空的类型检查范围。
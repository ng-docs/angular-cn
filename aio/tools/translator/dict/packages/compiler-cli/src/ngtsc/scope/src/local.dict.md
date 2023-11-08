A registry which collects information about NgModules, Directives, Components, and Pipes which
are local \(declared in the ts.Program being compiled\), and can produce `LocalModuleScope`s
which summarize the compilation scope of a component.

一个注册表，它收集有关本地的 NgModules、指令、组件和管道的信息（在正在编译的 ts.Program
中声明），并且可以生成 `LocalModuleScope`，它总结了组件的编译范围。

This class implements the logic of NgModule declarations, imports, and exports and can produce,
for a given component, the set of directives and pipes which are "visible" in that component's
template.

此类实现了 NgModule
声明、导入和导出的逻辑，并且可以为给定组件生成在该组件模板中“可见”的指令和管道集。

The `LocalModuleScopeRegistry` has two "modes" of operation. During analysis, data for each
individual NgModule, Directive, Component, and Pipe is added to the registry. No attempt is made
to traverse or validate the NgModule graph \(imports, exports, etc\). After analysis, one of
`getScopeOfModule` or `getScopeForComponent` can be called, which traverses the NgModule graph
and applies the NgModule logic to generate a `LocalModuleScope`, the full scope for the given
module or component.

`LocalModuleScopeRegistry` 有两种操作“模式”。在分析期间，每个
NgModule、Directive、组件和管道的数据都会添加到注册表。不会尝试遍历或验证 NgModule
图（导入、导出等）。经过分析，可以调用 `getScopeOfModule` 或 `getScopeForComponent`
之一，它会遍历 NgModule 图并应用 NgModule 逻辑生成 `LocalModuleScope`
，即给定模块或组件的完整范围。

The `LocalModuleScopeRegistry` is also capable of producing `ts.Diagnostic` errors when Angular
semantics are violated.

当违反 Angular 语义时，`LocalModuleScopeRegistry` 也能产生 `ts.Diagnostic` 错误。

Add an NgModule's data to the registry.

将 NgModule 的数据添加到注册表。

If `node` is declared in more than one NgModule \(duplicate declaration\), then get the
`DeclarationData` for each offending declaration.

如果 `node` 在多个 NgModule（重复声明）中声明，则获取每个有问题的声明的 `DeclarationData`。

Ordinarily a class is only declared in one NgModule, in which case this function returns
`null`.

通常，一个类仅在一个 NgModule 中声明，在这种情况下，此函数会返回 `null`。

Collects registered data for a module and its directives/pipes and convert it into a full
`LocalModuleScope`.

收集模块及其指令/管道的注册数据，并将其转换为完整的 `LocalModuleScope`。

This method implements the logic of NgModule imports and exports. It returns the
`LocalModuleScope` for the given NgModule if one can be produced, `null` if no scope was ever
defined, or the string `'error'` if the scope contained errors.

此方法实现了 NgModule 导入和导出的逻辑。如果可以生成，它会返回给定 `LocalModuleScope` 的
LocalModuleScope，如果没有定义范围，则返回 `null`，如果范围包含错误，则返回字符串 `'error'`
。

Retrieves any `ts.Diagnostic`s produced during the calculation of the `LocalModuleScope` for
the given NgModule, or `null` if no errors were present.

检索在计算给定 NgModule 的 `LocalModuleScope` 期间生成的任何 `ts.Diagnostic`
，如果不存在错误，则为 `null`。

Check whether a component requires remote scoping.

检查组件是否需要远程范围。

Set a component as requiring remote scoping, with the given directives and pipes to be
registered remotely.

将组件设置为需要远程范围，并使用要远程注册的给定指令和管道。

Produce a `ts.Diagnostic` for an invalid import or export from an NgModule.

为从 `ts.Diagnostic` 的无效导入或导出生成 ts.Diagnostic。

Produce a `ts.Diagnostic` for an import or export which itself has errors.

为本身有错误的导入或导出生成 `ts.Diagnostic`。

Produce a `ts.Diagnostic` for an exported directive or pipe which was not declared or imported
by the NgModule in question.

为 `ts.Diagnostic` 未声明或导入的导出指令或管道生成 ts.Diagnostic。

Produce a `ts.Diagnostic` for a collision in re-export names between two directives/pipes.

为两个指令/管道之间的重新导出名称冲突生成 `ts.Diagnostic`。
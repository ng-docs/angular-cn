Determines whether types may or may not export providers to NgModules, by transitively walking
the NgModule & standalone import graph.

通过传递遍历 NgModule 和独立导入图，确定类型是否可以将提供程序导出到 NgModules。

`true` if `ref` should be assumed to export providers, or `false` if the compiler can
    prove that it does not

如果应该假定 `ref` 导出提供程序，则为 `true` ；如果编译器可以证明它不导出提供程序，则为 `false`

Determines whether `ref` may or may not export providers to NgModules which import it.

确定 `ref` 是否可以将提供程序导出到导入它的 NgModules。

NgModules export providers if any are declared, and standalone components export providers from
their `imports` array \(if any\).

NgModules 导出提供者（如果有的话），独立组件从它们的 `imports` 数组（如果有的话）中导出提供者。

If `true`, then `ref` should be assumed to export providers. In practice, this could mean
either that `ref` is a local type that we _know_ exports providers, or it's imported from a
.d.ts library and is declared in a way where the compiler cannot prove that it doesn't.

如果为 `true`，则应假定 `ref` 导出提供程序。实际上，这可能意味着 `ref` 是我们 _ 知道的 _ 导出提供程序的本地类型，或者它是从 .d.ts 库导入的，并且以编译器无法证明它不是的方式声明。

If `false`, then `ref` is guaranteed not to export providers.

如果为 `false`，则 `ref` 保证不会导出提供者。
Wrap an array of `Provider`s into `EnvironmentProviders`, preventing them from being accidentally
referenced in \`&commat;Component in a component injector.

将 `Provider` 数组包装到 `EnvironmentProviders` 中，以防止它们在组件注入器的 \`&commat;Component 中被意外引用。

A source of providers for the `importProvidersFrom` function.

`importProvidersFrom` 函数的提供程序来源。

The results of the `importProvidersFrom` call can be used in the `bootstrapApplication` call:

`importProvidersFrom` 调用的结果可在 `bootstrapApplication` 调用中使用：

You can also use the `importProvidersFrom` results in the `providers` field of a route, when a
standalone component is used:

当使用独立组件时，你还可以在路由的 `providers` 字段中使用 `importProvidersFrom` 结果：

Collected providers from the specified list of types.

从指定的类型列表中收集的提供程序。

Collects providers from all NgModules and standalone components, including transitively imported
ones.

从所有 NgModule 和独立组件（包括可传递导入的组件）收集提供程序。

Providers extracted via `importProvidersFrom` are only usable in an application injector or
another environment injector \(such as a route injector\). They should not be used in component
providers.

通过 `importProvidersFrom`
提取的提供程序仅在应用程序注入器或另一个环境注入器（例如路由注入器）中可用。它们不应该在组件提供程序中使用。

More information about standalone components can be found in [this
guide](guide/standalone-components).

有关独立组件的更多信息，请参阅[本指南](guide/standalone-components)。

Collects all providers from the list of `ModuleWithProviders` and appends them to the provided
array.

从 `ModuleWithProviders` 列表中收集所有提供程序，并将它们附加到提供的数组。

Internal type for a single provider in a deep provider array.

深提供程序数组中单个提供程序的内部类型。

The logic visits an `InjectorType`, an `InjectorTypeWithProviders`, or a standalone
`ComponentType`, and all of its transitive providers and collects providers.

该逻辑会访问 `InjectorType`、`InjectorTypeWithProviders` 或独立 `ComponentType`
，以及其所有可传递提供者和集合提供者。

If an `InjectorTypeWithProviders` that declares providers besides the type is specified,
the function will return "true" to indicate that the providers of the type definition need
to be processed. This allows us to process providers of injector types after all imports of
an injector definition are processed. \(following View Engine semantics: see FW-1349\)

如果指定了除了类型之外还声明提供者的 `InjectorTypeWithProviders`
，则函数将返回“true”以表明需要处理此类型定义的提供者。这允许我们在处理注入器定义的所有导入之后处理注入器类型的提供者。
（遵循视图引擎语义：请参阅 FW-1349）
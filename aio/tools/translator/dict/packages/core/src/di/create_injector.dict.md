Create a new `Injector` which is configured using a `defType` of `InjectorType<any>`s.

创建一个新的 `Injector`，它使用 `InjectorType<any>` s 的 `defType` 配置。

Creates a new injector without eagerly resolving its injector types. Can be used in places
where resolving the injector types immediately can lead to an infinite loop. The injector types
should be resolved at a later point by calling `_resolveInjectorDefTypes`.

创建一个新的注入器，而不急切解析其注入器类型。可用于立即解析注入器类型可能导致无限循环的地方。注入器类型应该在以后通过调用
`_resolveInjectorDefTypes` 来解析。
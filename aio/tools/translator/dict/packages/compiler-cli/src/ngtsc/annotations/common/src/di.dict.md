Convert `ConstructorDeps` into the `R3DependencyMetadata` array for those deps if they're valid,
or into an `'invalid'` signal if they're not.

如果有效，则将 `ConstructorDeps` 转换为这些 deps 的 `R3DependencyMetadata`
数组，如果不是，则转换为 `'invalid'` 信号。

This is a companion function to `validateConstructorDependencies` which accepts invalid deps.

这是 `validateConstructorDependencies` 的伴随函数，它接受无效的 deps。

Validate that `ConstructorDeps` does not have any invalid dependencies and convert them into the
`R3DependencyMetadata` array if so, or raise a diagnostic if some deps are invalid.

验证 `ConstructorDeps` 没有任何无效的依赖项，如果是这样，则将它们转换为 `R3DependencyMetadata`
数组，如果某些 deps 无效，则引发诊断。

This is a companion function to `unwrapConstructorDependencies` which does not accept invalid
deps.

这是 `unwrapConstructorDependencies` 的伴随函数，它不接受无效的 deps。

The class for which the injection token was unavailable.

注入令牌不可用的类。

The reason why no valid injection token is available.

没有有效的注入令牌可用的原因。

Creates a fatal error with diagnostic for an invalid injection token.

使用无效注入令牌的诊断创建致命错误。
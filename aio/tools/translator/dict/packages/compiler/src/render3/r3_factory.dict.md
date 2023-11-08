Metadata required by the factory generator to generate a `factory` function for a type.

工厂生成器为类型生成 `factory` 函数所需的元数据。

String name of the type being generated \(used to name the factory function\).

正在生成的类型的字符串名称（用于命名工厂函数）。

An expression representing the interface type being constructed.

表示正在构造的接口类型的表达式。

Number of arguments for the `type`.

`type` 的参数数量。

Regardless of whether `fnOrClass` is a constructor function or a user-defined factory, it
may have 0 or more parameters, which will be injected according to the `R3DependencyMetadata`
for those parameters. If this is `null`, then the type's constructor is nonexistent and will
be inherited from `fnOrClass` which is interpreted as the current type. If this is `'invalid'`,
then one or more of the parameters wasn't resolvable and any attempt to use these deps will
result in a runtime error.

无论 `fnOrClass` 是构造函数还是用户自定义工厂，它都可能有 0 个或多个参数，这些参数将根据 `R3DependencyMetadata` 进行注入。如果为 `null`，则该类型的构造函数不存在，将从 `fnOrClass` 继承，后者被解释为当前类型。如果这是 `'invalid'`，则一个或多个参数不可解析，任何使用这些 deps 的尝试都将导致运行时错误。

Type of the target being created by the factory.

工厂正在创建的目标的类型。

An expression representing the token or value to be injected.
Or `null` if the dependency could not be resolved - making it invalid.

表示要注入的令牌或值的表达式。如果无法解析依赖项，则为 `null` - 使其无效。

If an &commat;Attribute decorator is present, this is the literal type of the attribute name, or
the unknown type if no literal type is available \(e.g. the attribute name is an expression\).
Otherwise it is null;

如果存在&commat;Attribute 装饰器，则这是属性名称的文字类型，如果没有可用的文字类型（例如，属性名称是表达式），则为未知类型。否则为空；

Whether the dependency has an &commat;Host qualifier.

依赖项是否具有 &commat;Host 限定符。

Whether the dependency has an &commat;Optional qualifier.

依赖项是否具有 &commat;Optional 限定符。

Whether the dependency has an &commat;Self qualifier.

依赖项是否具有 &commat;Self 限定符。

Whether the dependency has an &commat;SkipSelf qualifier.

依赖项是否具有 &commat;SkipSelf 限定符。

Construct a factory function expression for the given `R3FactoryMetadata`.

为给定的 `R3FactoryMetadata` 构造工厂函数表达式。
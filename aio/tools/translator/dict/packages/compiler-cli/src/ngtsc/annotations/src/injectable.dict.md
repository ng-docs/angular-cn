Adapts the `compileInjectable` compiler for `@Injectable` decorators to the Ivy compiler.

使 `@Injectable` 装饰器的 `compileInjectable` 编译器适应 Ivy 编译器。

Read metadata from the `@Injectable` decorator and produce the `IvyInjectableMetadata`, the
input metadata needed to run `compileInjectable`.

从 `@Injectable` 装饰器读取元数据并生成 `IvyInjectableMetadata`，这是运行 `compileInjectable`
所需的输入元数据。

A `null` return value indicates this is &commat;Injectable has invalid data.

`null` 返回值表明这是 &commat;Injectable 具有无效数据。

Get the `R3ProviderExpression` for this `expression`.

获取此 `expression` 的 `R3ProviderExpression`。

The `useValue`, `useExisting` and `useClass` properties might be wrapped in a `ForwardRef`, which
needs to be unwrapped. This function will do that unwrapping and set a flag on the returned
object to indicate whether the value needed unwrapping.

`useValue`、`useExisting` 和 `useClass` 属性可能包含在需要解包的 `ForwardRef`
中。此函数将执行此展开，并在返回的对象上设置一个标志以表明该值是否需要展开。
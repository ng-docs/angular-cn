Type of the Inject decorator / constructor function.

注入装饰器/构造函数的类型。

The following example shows a class constructor that specifies a
custom provider of a dependency using the parameter decorator.

下面的示例显示了一个类构造函数，该构造函数使用参数装饰器指定了依赖项的自定义提供者。

When `@Inject()` is not present, the injector uses the type annotation of the
parameter as the provider.

如果有 `@Inject()`，则注入器将参数的类型注解用作提供者。

["Dependency Injection Guide"](guide/dependency-injection)

[“依赖注入指南”](guide/dependency-injection)

Parameter decorator on a dependency parameter of a class constructor
that specifies a custom provider of the dependency.

类构造函数中依赖项参数上的参数装饰器，用于指定依赖项的自定义提供者。

Type of the Inject metadata.

注入元数据的类型。

A [DI token](guide/glossary#di-token) that maps to the dependency to be injected.

一个 [DI 令牌](guide/glossary#di-token)，映射到要注入的依赖项。

Inject decorator and metadata.

注入装饰器和元数据。

Type of the Optional decorator / constructor function.

可选装饰器/构造函数的类型。

The following code allows the possibility of a `null` result:

以下代码允许结果为空的可能性：

["Dependency Injection Guide"](guide/dependency-injection).

[“依赖注入指南”](guide/dependency-injection)。

Parameter decorator to be used on constructor parameters,
which marks the parameter as being an optional dependency.
The DI framework provides `null` if the dependency is not found.

用于构造函数参数的参数装饰器，将参数标记为可选依赖项。如果找不到依赖项，则 DI 框架提供 null。

Can be used together with other parameter decorators
that modify how dependency injection operates.

可以与其他修改依赖注入方式的参数装饰器一起使用。

Type of the Optional metadata.

可选元数据的类型。

Optional decorator and metadata.

可选的装饰器和元数据。

Type of the Self decorator / constructor function.

Self 装饰器/构造函数的类型。

In the following example, the dependency can be resolved
by the local injector when instantiating the class itself, but not
when instantiating a child.

在以下示例中，依赖关系可以在实例化类本身时由本地注入器解析，而在实例化子代时不能解析。

Parameter decorator to be used on constructor parameters,
which tells the DI framework to start dependency resolution from the local injector.

将在构造函数参数上使用参数装饰器，该装饰器告诉 DI 框架从本地注入器开始解析依赖项。

Resolution works upward through the injector hierarchy, so the children
of this class must configure their own providers or be prepared for a `null` result.

解析器在注入器层次结构中向上查找，因此此类的子级必须配置其自己的提供者或为空结果做好准备。

Type of the Self metadata.

Self 元数据的类型。

Self decorator and metadata.

Self 装饰器和元数据。

Type of the `SkipSelf` decorator / constructor function.

`SkipSelf` 装饰器/构造函数的类型。

In the following example, the dependency can be resolved when
instantiating a child, but not when instantiating the class itself.

在以下示例中，可以在实例化子级时解析依赖项，但在实例化类本身时不解析。

[Dependency Injection guide](guide/dependency-injection-in-action#skip).

[依赖注入指南](guide/dependency-injection-in-action#skip)。

Parameter decorator to be used on constructor parameters,
which tells the DI framework to start dependency resolution from the parent injector.
Resolution works upward through the injector hierarchy, so the local injector
is not checked for a provider.

将在构造函数参数上使用的参数装饰器，该参数指示 DI 框架从父注入器启动依赖项解析。解析器在注入器层次结构中向上查找，因此不会检查本地注入器的提供者。

Type of the `SkipSelf` metadata.

`SkipSelf` 元数据的类型。

`SkipSelf` decorator and metadata.

`SkipSelf` 装饰器和元数据。

Type of the `Host` decorator / constructor function.

`Host` 装饰器/构造函数的类型。

The following shows use with the `@Optional` decorator, and allows for a `null` result.

以下显示了与 `@Optional` 装饰器一起使用的情况，并允许空结果。

For an extended example, see ["Dependency Injection
Guide"](guide/dependency-injection-in-action#optional).

有关扩展的示例，请参见[“依赖项注入指南”](guide/dependency-injection-in-action#optional)。

Parameter decorator on a view-provider parameter of a class constructor
that tells the DI framework to resolve the view by checking injectors of child
elements, and stop when reaching the host element of the current component.

类构造函数的视图提供者参数上的参数修饰器，用于指示 DI 框架通过检查子元素的注入器来解析视图，并在到达当前组件的宿主元素时停止。

Type of the Host metadata.

宿主元数据的类型。

Host decorator and metadata.

宿主装饰器和元数据。
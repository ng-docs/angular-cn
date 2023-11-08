Injectable providers used in `@Injectable` decorator.

`@Injectable` 装饰器中使用的可注入对象提供者。

Type of the Injectable decorator / constructor function.

Injectable 装饰器的类型和构造函数

[Introduction to Services and DI](guide/architecture-services)

[服务和 DI 简介](guide/architecture-services)

[Dependency Injection Guide](guide/dependency-injection)

[依赖注入指南](guide/dependency-injection)

Marking a class with `@Injectable` ensures that the compiler
will generate the necessary metadata to create the class's
dependencies when the class is injected.

使用 `@Injectable` 标记一个类可确保编译器将在注入类时生成必要的元数据，以创建类的依赖项。

The following example shows how a service class is properly
 marked so that a supporting service can be injected upon creation.

下面的例子展示了如何正确的把服务类标记为可注入的（Injectable）。

Decorator that marks a class as available to be
provided and injected as a dependency.

标记性元数据，表示一个类可以由 `Injector` 进行创建。

Type of the Injectable metadata.

Injectable 元数据的类型。

Determines which injectors will provide the injectable.

确定哪些注入器将提供可注入。

`Type<any>` - associates the injectable with an `@NgModule` or other `InjectorType`. This
option is DEPRECATED.

`Type<any>` - 将可注入物与 `@NgModule` 或其他 `InjectorType` 相关联。此选项已弃用。

'null' : Equivalent to `undefined`. The injectable is not provided in any scope automatically
    and must be added to a `providers` array of an [&commat;NgModule](api/core/NgModule#providers),
    [&commat;Component](api/core/Directive#providers) or [&commat;Directive](api/core/Directive#providers).

'null'：等效于 `undefined`
。可注入物不会在任何范围内自动提供，必须添加到[&commat;NgModule](api/core/NgModule#providers) 、
  [&commat;Component](api/core/Directive#providers)或[&commat;Directive](api/core/Directive#providers)的
  `providers` 数组中。

The following options specify that this injectable should be provided in one of the following
injectors:

通过与 `@NgModule` 或其他 `InjectorType`
关联，或通过指定应在以下注入器之一中提供此可注入对象，来确定将提供该对象的注入器：

'root' : The application-level injector in most apps.

'root'：在大多数应用程序中是指应用程序级注入器。

'platform' : A special singleton platform injector shared by all
applications on the page.

'platform'：由页面上所有应用程序共享的特殊单例平台注入器。

'any' : Provides a unique instance in each lazy loaded module while all eagerly loaded
modules share one instance. This option is DEPRECATED.

'any'：在每个惰性加载的模块中提供一个唯一实例，而所有热切加载的模块共享一个实例。

Injectable decorator and metadata.

Injectable 的装饰器和元数据。
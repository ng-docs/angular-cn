Configures the `Injector` to return a value for a token.
Base for `ValueProvider` decorator.

配置 `Injector` 以返回令牌的值。是 `ValueProvider` 装饰器的基接口。

The value to inject.

要注入的值。

["Dependency Injection Guide"](guide/dependency-injection).

[“依赖注入指南”](guide/dependency-injection)。

Example

例子

{&commat;example core/di/ts/provider_spec.ts region='ValueProvider'}



Multi-value example

多值示例

{&commat;example core/di/ts/provider_spec.ts region='MultiProviderAspect'}



Configures the `Injector` to return a value for a token.

配置此 `Injector` 以返回令牌的值。

An injection token. Typically an instance of `Type` or `InjectionToken`, but can be `any`.

注入令牌。通常是 `Type` 或 `InjectionToken` 的实例，但也可以是 `any` 实例。

When true, injector returns an array of instances. This is useful to allow multiple
providers spread across many files to provide configuration information to a common token.

如果为
true，则注入器返回实例数组。这对于允许多个提供者散布在多个文件中，以向某个公共令牌提供配置信息时很有用。

Configures the `Injector` to return an instance of `useClass` for a token.
Base for `StaticClassProvider` decorator.

配置 `Injector` 以返回 `useClass` 的令牌实例。这是 `StaticClassProvider` 装饰器的基接口。

An optional class to instantiate for the `token`. By default, the `provide`
class is instantiated.

供 `token` 实例化的可选类。默认情况下，会把 `provide` 类实例化。

A list of `token`s to be resolved by the injector. The list of values is then
used as arguments to the `useClass` constructor.

由注入器解析的 `token` 列表。将这个值列表用作 `useClass` 构造函数的参数。

{&commat;example core/di/ts/provider_spec.ts region='StaticClassProvider'}



Note that following two providers are not equal:

请注意，以下两个提供者并不相等：

{&commat;example core/di/ts/provider_spec.ts region='StaticClassProviderDifference'}



Configures the `Injector` to return an instance of `useClass` for a token.

配置此 `Injector` 以便为令牌返回 `useClass` 的实例。

Configures the `Injector` to return an instance of a token.

配置此 `Injector`，以返回令牌的实例。

A list of `token`s to be resolved by the injector.

注入器要解析的 `token` 列表。

{&commat;example core/di/ts/provider_spec.ts region='ConstructorProvider'}



Configures the `Injector` to return a value of another `useExisting` token.

配置此 `Injector` 以返回另一个 `useExisting` 令牌的值。

Existing `token` to return. \(Equivalent to `injector.get(useExisting)`\)

返回现有的 `token`。（等效于 `injector.get(useExisting)`）

{&commat;example core/di/ts/provider_spec.ts region='ExistingProvider'}



Configures the `Injector` to return a value by invoking a `useFactory` function.

配置此 `Injector` 以便调用 `useFactory` 函数返回一个值。

A function to invoke to create a value for this `token`. The function is invoked with
resolved values of `token`s in the `deps` field.

供调用，来为此 `token` 创建值的函数。调用该函数时，会在 `deps` 字段中的传入 `token`
的解析结果。。

A list of `token`s to be resolved by the injector. The list of values is then
used as arguments to the `useFactory` function.

供注入器解析的 `token` 列表。然后，将值列表将用作 `useFactory` 函数的参数。

{&commat;example core/di/ts/provider_spec.ts region='FactoryProvider'}



Dependencies can also be marked as optional:

依赖项也可以标记为可选：

{&commat;example core/di/ts/provider_spec.ts region='FactoryProviderOptionalDeps'}



An injection token. \(Typically an instance of `Type` or `InjectionToken`, but can be `any`\).

注入令牌。（通常是 `Type` 或 `InjectionToken` 的实例，但也可以是 `any` 实例）。

`Injector.create()`.



`Injector.create()`。



["Dependency Injection Guide"](guide/dependency-injection-providers).

[“依赖注入指南”](guide/dependency-injection-providers)。

Describes how an `Injector` should be configured as static \(that is, without reflection\).
A static provider provides tokens to an injector for various types of dependencies.

描述如何将 `Injector`
配置为静态的（即不需要反射）。静态提供者为各种类型的依赖项提供令牌给注入器。

{&commat;example core/di/ts/provider_spec.ts region='TypeProvider'}



Configures the `Injector` to return an instance of `Type` when \`Type' is used as the token.

配置此 `Injector`，以将“类型”用作令牌时返回 `Type` 的实例。

Create an instance by invoking the `new` operator and supplying additional arguments.
This form is a short form of `TypeProvider`;

通过调用 `new` 运算符并提供其他参数来创建实例。这种形式是 `TypeProvider` 的缩写形式；

For more details, see the ["Dependency Injection Guide"](guide/dependency-injection).

欲知详情，请参见[“依赖项注入指南”](guide/dependency-injection)。

Configures the `Injector` to return a value by invoking a `useClass` function.
Base for `ClassProvider` decorator.

配置 `Injector` 以通过调用 `useClass` 函数返回某个值。是 `ClassProvider` 装饰器的基接口。

Class to instantiate for the `token`.

用于将此 `token` 实例化的类。

{&commat;example core/di/ts/provider_spec.ts region='ClassProvider'}



{&commat;example core/di/ts/provider_spec.ts region='ClassProviderDifference'}



Describes how the `Injector` should be configured.

描述应该如何配置 `Injector`。

Encapsulated `Provider`s that are only accepted during creation of an `EnvironmentInjector` \(e.g.
in an `NgModule`\).

封装的 `Provider` 仅在创建 `EnvironmentInjector` 期间被接受（例如在 `NgModule` 中）。

Using this wrapper type prevents providers which are only designed to work in
application/environment injectors from being accidentally included in
`@Component.providers` and ending up in a component injector.

使用此包装器类型可防止仅设计用于应用程序/环境注入器的提供程序被意外包含在 `@Component.providers` 中并最终出现在组件注入器中。

This wrapper type prevents access to the `Provider`s inside.

这种包装器类型阻止访问内部的 `Provider`。

If present, indicates that the `EnvironmentProviders` were derived from NgModule providers.

如果存在，则表示 `EnvironmentProviders` 派生自 NgModule 提供者。

This is used to produce clearer error messages.

这用于生成更清晰的错误消息。

Describes a function that is used to process provider lists \(such as provider
overrides\).

描述用于处理提供程序列表的函数（例如提供程序覆盖）。

[Deprecations](guide/deprecations#modulewithproviders-type-without-a-generic)

[弃用](guide/deprecations#modulewithproviders-type-without-a-generic)

A wrapper around an NgModule that associates it with [providers](guide/glossary#provider "Definition"). Usage without a generic type is deprecated.

将 NgModule 与[provider](guide/glossary#provider "定义")关联的 NgModule
的包装器。不推荐使用没有泛型类型的用法。

replaced by `EnvironmentProviders`

替换为 `EnvironmentProviders`

Providers that were imported from NgModules via the `importProvidersFrom` function.

通过 `importProvidersFrom` 函数从 NgModules 导入的提供程序。

These providers are meant for use in an application injector \(or other environment injectors\) and
should not be used in component injectors.

这些提供程序旨在用于应用程序注入器（或其他环境注入器），不应在组件注入器中使用。

This type cannot be directly implemented. It's returned from the `importProvidersFrom` function
and serves to prevent the extracted NgModule providers from being used in the wrong contexts.

这种类型不能直接实现。它是从 `importProvidersFrom` 函数返回的，用于防止提取的 NgModule
提供程序在错误的上下文中使用。
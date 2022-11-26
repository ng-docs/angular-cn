# Configuring dependency providers

The Creating and injecting services topic describes how to use classes as dependencies. Besides classes, you can also use other values such as Boolean, string, date, and objects as dependencies. Angular DI provides the necessary APIs to make the dependency configuration flexible, so you can make those values available in DI.

## Specifying a provider token

## 指定提供者令牌

If you specify the service class as the provider token, the default behavior is for the injector to instantiate that class using the `new` operator.

In the following example, the `Logger` class provides a `Logger` instance.

在下面这个例子中，`Logger` 类提供了 `Logger` 的实例。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-logger"></code-example>

You can, however, configure a DI to use a different class or any other different value to associate with the `Logger` class. So when the `Logger` is injected, this new value is used instead.

In fact, the class provider syntax is a shorthand expression that expands into a provider configuration, defined by the `Provider` interface.

Angular expands the `providers` value in this case into a full provider object as follows:

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-3" ></code-example>

The expanded provider configuration is an object literal with two properties:

扩展的提供者配置是一个具有两个属性的对象字面量：

- The `provide` property holds the token that serves as the key for both locating a dependency value and configuring the injector.

- The second property is a provider definition object, which tells the injector how to create the dependency value. The provider-definition key can be one of the following:

  - useClass - this option tells Angular DI to instantiate a provided class when a dependency is injected

  - useExisting - allows you to alias a token and reference any existing one.

  - useFactory - allows you to define a function that constructs a dependency.

  - useValue - provides a static value that should be used as a dependency.

The section below describes how to use the mentioned provider definition keys.

<a id="token"></a>
<a id="injection-token"></a>

### Class providers: useClass

The `useClass` provider key lets you create and return a new instance of the specified class.
You can use this type of provider to substitute an alternative implementation for a common or default class. The alternative implementation can, for example, implement a different strategy, extend the default class, or emulate the behavior of the real class in a test case.
In the following example, the `BetterLogger` class would be instantiated when the `Logger` dependency is requested in a component or any other class.

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-4" ></code-example>

<a id="class-provider-dependencies"></a>

If the alternative class providers have their own dependencies, specify both providers in the providers metadata property of the parent module or component.

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-5"></code-example>

In this example, `EvenBetterLogger` displays the user name in the log message. This logger gets the user from an injected `UserService` instance.

在这个例子中，`EvenBetterLogger` 会在日志信息里显示用户名。这个 logger 要从注入的 `UserService` 实例中来获取该用户。

<code-example path="dependency-injection/src/app/providers.component.ts" region="EvenBetterLogger"></code-example>

Angular DI knows how to construct the `UserService` dependency, since it has been configured above and is available in the injector.

### Alias providers: useExisting

The `useExisting` provider key lets you map one token to another. In effect, the first token is an alias for the service associated with the second token, creating two ways to access the same service object.

In the following example, the injector injects the singleton instance of `NewLogger` when the component asks for either the new or the old logger. In this way, `OldLogger` is an alias for `NewLogger`.

在下面的例子中，当组件请求新的或旧的记录器时，注入器都会注入一个 `NewLogger` 的实例。通过这种方式，`OldLogger` 就成了 `NewLogger` 的别名。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-6b"></code-example>

Ensure you do not alias `OldLogger` to `NewLogger` with `useClass`, as this creates two different `NewLogger` instances.

### Factory providers: useFactory

The `useFactory` provider key lets you create a dependency object by calling a factory function. With this approach you can create a dynamic value based on information available in the DI and elsewhere in the app.

In the following example, only authorized users should see secret heroes in the `HeroService`.
Authorization can change during the course of a single application session, as when a different user logs in .

在下面的例子中，只有授权用户才能看到 `HeroService` 中的秘密英雄。授权可能在单个应用会话期间发生变化，比如改用其他用户登录。

To keep security-sensitive information in `UserService` and out of `HeroService`, give the `HeroService` constructor a boolean flag to control display of secret heroes.

要想在 `UserService` 和 `HeroService` 中保存敏感信息，就要给 `HeroService` 的构造函数传一个逻辑标志来控制秘密英雄的显示。

<code-example path="dependency-injection/src/app/heroes/hero.service.ts" region="internals" header="src/app/heroes/hero.service.ts (excerpt)"></code-example>

To implement the `isAuthorized` flag, use a factory provider to create a new logger instance for `HeroService`.

要实现 `isAuthorized` 标志，可以用工厂提供者来为 `HeroService` 创建一个新的 logger 实例。

<code-example path="dependency-injection/src/app/heroes/hero.service.provider.ts" region="factory" header="src/app/heroes/hero.service.provider.ts (excerpt)"></code-example>

The factory function has access to `UserService`.
You inject both `Logger` and `UserService` into the factory provider so the injector can pass them along to the factory function.

这个工厂函数可以访问 `UserService`。你可以同时把 `Logger` 和 `UserService` 注入到工厂提供者中，这样注入器就可以把它们传给工厂函数了。

<code-example path="dependency-injection/src/app/heroes/hero.service.provider.ts" region="provider" header="src/app/heroes/hero.service.provider.ts (excerpt)"></code-example>

* The `useFactory` field specifies that the provider is a factory function whose implementation is `heroServiceFactory`.

  `useFactory` 字段指定该提供者是一个工厂函数，其实现代码是 `heroServiceFactory`。

* The `deps` property is an array of provider tokens.
  The `Logger` and `UserService` classes serve as tokens for their own class providers.
  The injector resolves these tokens and injects the corresponding services into the matching `heroServiceFactory` factory function parameters.

Capturing the factory provider in the exported variable, `heroServiceProvider`, makes the factory provider reusable.

通过把工厂提供者导出为变量 `heroServiceProvider`，就能让工厂提供者变得可复用。

### Value providers: useValue

The `useValue` key lets you associate a fixed value with a DI token. Use this technique to provide runtime configuration constants such as website base addresses and feature flags. You can also use a value provider in a unit test to provide mock data in place of a production data service. The next section provides more information about the `useValue` key.

## Using an `InjectionToken` object

## 使用 `InjectionToken` 对象

Define and use an `InjectionToken` object for choosing a provider token for non-class dependencies. The following example defines a token, `APP_CONFIG` of the type `InjectionToken`.

可以定义和使用一个 `InjectionToken` 对象来为非类的依赖选择一个提供者令牌。下列例子定义了一个类型为 `InjectionToken` 的 `APP_CONFIG`。

<code-example path="dependency-injection/src/app/app.config.ts" region="token" header="src/app/app.config.ts"></code-example>

The optional type parameter, `<AppConfig>`, and the token description, `app.config`, specify the token's purpose.

可选的参数 `<AppConfig>` 和令牌描述 `app.config` 指明了此令牌的用途。

Next, register the dependency provider in the component using the `InjectionToken` object of `APP_CONFIG`.

接着，用 `APP_CONFIG` 这个 `InjectionToken` 对象在组件中注册依赖提供者。

<code-example path="dependency-injection/src/app/providers.component.ts" header="src/app/providers.component.ts" region="providers-9"></code-example>

Now, inject the configuration object into the constructor with `@Inject()` parameter decorator.

现在，借助参数装饰器 `@Inject()`，你可以把这个配置对象注入到构造函数中。

<code-example path="dependency-injection/src/app/app.component.2.ts" region="ctor" header="src/app/app.component.ts"></code-example>

### Interfaces and DI

Though the TypeScript `AppConfig` interface supports typing within the class, the `AppConfig` interface plays no role in DI.
In TypeScript, an interface is a design-time artifact, and does not have a runtime representation, or token, that the DI framework can use.

When the transpiler changes TypeScript to JavaScript, the interface disappears because JavaScript doesn't have interfaces.

当转译器把 TypeScript 转换成 JavaScript 时，接口就会消失，因为 JavaScript 没有接口。

Because there is no interface for Angular to find at runtime, the interface cannot be a token, nor can you inject it.

由于 Angular 在运行期没有接口，所以该接口不能作为令牌，也不能注入它。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-9-interface"></code-example>

<code-example path="dependency-injection/src/app/providers.component.ts" region="provider-9-ctor-interface"></code-example>

## What's next

## 下一步呢？

* [Dependency Injection in Action](guide/dependency-injection-in-action)

  [依赖注入实战](guide/dependency-injection-in-action)

@reviewed 2022-08-02
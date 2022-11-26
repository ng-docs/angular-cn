# Creating an injectable service

# 创建可注入服务

Service is a broad category encompassing any value, function, or feature that an application needs. A service is typically a class with a narrow, well-defined purpose. A component is one type of class that can use DI.

服务是一个很宽泛的类别，它包含应用程序需要的任何值、功能或特性。服务通常是具有狭窄、明确定义的目标的类。组件是一种可以使用 DI 的类。

Angular distinguishes components from services to increase modularity and reusability. By separating a component's view-related features from other kinds of processing, you can make your component classes lean and efficient.

Angular 将组件与服务区分开来，是为了提高模块化程度和可复用性。通过将组件中与视图相关的特性与其他类型的处理分离开，可以让你的组件类更加精简高效。

Ideally, a component's job is to enable the user experience and nothing more. A component should present properties and methods for data binding, to mediate between the view (rendered by the template) and the application logic (which often includes some notion of a model).

理想情况下，组件的工作就是提供用户体验，并无其它职责。组件应该表达用于数据绑定的属性和方法，以在视图（由模板渲染）和应用逻辑（通常包括某个模型的一些概念）之间进行居中协调。

A component can delegate certain tasks to services, such as fetching data from the server, validating user input, or logging directly to the console. By defining such processing tasks in an injectable service class, you make those tasks available to any component. You can also make your application more adaptable by injecting different providers of the same kind of service, as appropriate in different circumstances.

组件可以将某些任务委托给服务，例如从服务器获取数据、验证用户输入或直接把日志记录到控制台。通过在可注入服务类中定义这样的处理任务，你可以让这些任务可用于任何组件。你还可以通过在不同的情况下注入同一个服务的不同提供者来让你的应用程序适应更多场景。

Angular does not enforce these principles. Angular helps you follow these principles by making it easy to factor your application logic into services and make those services available to components through DI.

Angular 不会强制执行这些原则。 Angular 只是让你可以轻松地将应用逻辑分解为服务，并通过 DI 让这些服务可用在组件中，从而帮助你遵循这些原则。

## Service examples

## 服务范例

Here's an example of a service class that logs to the browser console.

下面是一个服务类的范例，用于把日志记录到浏览器的控制台：。

<code-example header="src/app/logger.service.ts (class)" path="architecture/src/app/logger.service.ts" region="class"></code-example>

Services can depend on other services.
For example, here's a `HeroService` that depends on the `Logger` service, and also uses `BackendService` to get heroes.
That service in turn might depend on the `HttpClient` service to fetch heroes asynchronously from a server.

服务也可以依赖其它服务。比如，这里的 `HeroService` 就依赖于 `Logger` 服务，它还用 `BackendService` 来获取英雄数据。`BackendService` 还可能再转而依赖 `HttpClient` 服务来从服务器异步获取英雄列表。

<code-example header="src/app/hero.service.ts (class)" path="architecture/src/app/hero.service.ts" region="class"></code-example>

## Creating an injectable service

## 创建可注入的服务

Angular CLI provides a command to create a new service. In the following example, you add a new service to your application, which was created earlier with the `ng new` command. 

Angular CLI 提供了一个命令来创建新服务。在以下示例中，你会为应用程序添加新服务，该应用是之前使用 `ng new` 命令创建的。

To generate a new `HeroService` class in the `src/app/heroes` folder, follow these steps: 

要在 `src/app/heroes` 文件夹中生成新的 `HeroService` 类，请按照以下步骤操作：

1. Run this [Angular CLI](cli) command:

   运行此 [Angular CLI](cli) 命令：

<code-example language="sh">
ng generate service heroes/hero
</code-example>

This command creates the following default `HeroService`.

下列命令会创建默认的 `HeroService`。

<code-example path="dependency-injection/src/app/heroes/hero.service.0.ts" header="src/app/heroes/hero.service.ts (CLI-generated)">
</code-example>

The `@Injectable()` decorator specifies that Angular can use this class in the DI system.
The metadata, `providedIn: 'root'`, means that the `HeroService` is visible throughout the application.

`@Injectable()` 装饰器指出 Angular 可以在 DI 体系中使用此类。元数据 `providedIn: 'root'` 表示 `HeroService` 在整个应用程序中都是可见的。

2. Add a `getHeroes()` method that returns the heroes from `mock.heroes.ts` to get the hero mock data:

   添加一个 `getHeroes()` 方法，该方法会返回来自 `mock.heroes.ts` 的英雄列表，以获取英雄的模拟数据：

<code-example path="dependency-injection/src/app/heroes/hero.service.3.ts" header="src/app/heroes/hero.service.ts">
</code-example>

For clarity and maintainability, it is recommended that you define components and services in separate files.

为了清晰和可维护性，建议你在单独的文件中定义组件和服务。

## Injecting services

## 注入服务

To inject a service as a dependency into a component, you can use component's `constructor()` and supply a constructor argument with the dependency type. The following example specifies the `HeroService` in the `HeroListComponent` constructor. The type of the `heroService` is `HeroService`. Angular recognizes the `HeroService` as a dependency, since that class was previously annotated with the `@Injectable` decorator.

要将服务作为依赖项注入到组件中，你可以使用组件的 `constructor()`，并为构造函数添加一个该依赖类型的参数。以下示例会在 `HeroListComponent` 构造函数中指定 `HeroService`。这里 `heroService` 的类型是 `HeroService`。Angular 会将 `HeroService` 识别为依赖项，因为该类以前用 `@Injectable` 装饰器标记过。

<code-example header="src/app/heroes/hero-list.component (constructor signature)" path="dependency-injection/src/app/heroes/hero-list.component.ts"
region="ctor-signature">
</code-example>

## Injecting services in other services

## 在其他服务中注入服务

When a service depends on another service, follow the same pattern as injecting into a component.
In the following example `HeroService` depends on a `Logger` service to report its activities.

当某个服务依赖于另一个服务时，请遵循与注入组件相同的模式。在这里，`HeroService` 要依靠 `Logger` 服务来报告其活动。

First, import the `Logger` service. Next, inject the `Logger` service in the `HeroService` `constructor()` by specifying `private logger: Logger`.

首先，导入 `Logger` 服务。接下来，通过指定 `private logger: Logger` ，在 `HeroService` 的 `constructor()` 中注入 `Logger` 服务。

Here, the `constructor()` specifies a type of `Logger` and stores the instance of `Logger` in a private field called `logger`.

在这里，`constructor()` 指定了 `Logger` 的类型，并把 `Logger` 的实例存储在名叫 `logger` 的私有字段中。

The following code tabs feature the `Logger` service and two versions of `HeroService`. The first version of `HeroService` does not depend on the `Logger` service. The revised second version does depend on `Logger` service.

下列代码具有 `Logger` 服务和两个版本的 `HeroService`。`HeroService` 的第一个版本不依赖于 `Logger` 服务。修改后的第二个版本依赖于 `Logger` 服务。

<code-tabs>

  <code-pane header="src/app/heroes/hero.service (v2)" path="dependency-injection/src/app/heroes/hero.service.2.ts">
  </code-pane>

  <code-pane header="src/app/heroes/hero.service (v1)" path="dependency-injection/src/app/heroes/hero.service.1.ts">
  </code-pane>

  <code-pane header="src/app/logger.service"
  path="dependency-injection/src/app/logger.service.ts">
  </code-pane>

</code-tabs>

In this example, the `getHeroes()` method uses the `Logger` service by logging a message when fetching heroes.

在这个例子中，`getHeroes()` 方法在获取英雄时就会借助 `Logger` 记录一条消息。

## What's next

## 下一步呢？

* [How to configure dependencies in DI](guide/dependency-injection-providers)

  [如何在 DI 中配置依赖项](guide/dependency-injection-providers)

* [How to use `InjectionTokens` to provide and inject values other than services/classes](guide/dependency-injection-providers#configuring-dependency-providers)

  [如何使用 `InjectionTokens` 提供和注入服务/类之外的值](guide/dependency-injection-providers#configuring-dependency-providers)

* [Dependency Injection in Action](guide/dependency-injection-in-action)

  [依赖注入实战](guide/dependency-injection-in-action)

@reviewed 2022-08-02
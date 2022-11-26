# Understanding dependency injection

# 了解依赖注入

Dependency injection, or DI, is one of the fundamental concepts in Angular. DI is wired into the Angular framework and allows classes with Angular decorators, such as Components, Directives, Pipes, and Injectables, to configure dependencies that they need. 

依赖注入（DI）是 Angular 中的基本概念之一。 DI 被装配进 Angular 框架，并允许带有 Angular 装饰器的类（例如组件、指令、管道和可注入对象）配置它们所需的依赖项。

Two main roles exist in the DI system: dependency consumer and dependency provider. 

DI 系统中存在两个主要角色：依赖使用者和依赖提供者。

Angular facilitates the interaction between dependency consumers and dependency providers using an abstraction called [Injector](guide/glossary#injector). When a dependency is requested, the injector checks its registry to see if there is an instance already available there. If not, a new instance is created and stored in the registry. Angular creates an application-wide injector (also known as "root" injector) during the application bootstrap process, as well as any other injectors as needed. In most cases you don't need to manually create injectors, but you should know that there is a layer that connects providers and consumers.

Angular 使用一种称为 [Injector](guide/glossary#injector) 的抽象来促进依赖消费者和依赖提供者之间的互动。当有人请求依赖项时，注入器会检查其注册表以查看那里是否已有可用的实例。如果没有，就会创建一个新实例并将其存储在注册表中。Angular 会在应用的引导过程中创建一个应用范围的注入器（也称为“根”注入器），并会根据需要创建任何其它注入器。在大多数情况下，你都不需要手动创建注入器，但应该知道有这样一个连接提供者和消费者的层次。

This topic covers basic scenarios of how a class can act as a dependency. Angular also allows you to use functions, objects, primitive types such as string or Boolean, or any other types as dependencies. For more information, see [Dependency providers](guide/dependency-injection-providers).

本主题介绍了某个类如何作为依赖项的基本场景。Angular 还允许你使用函数、对象、基本类型（例如字符串或 Boolean）或任何其他类型作为依赖项。有关更多信息，请参阅[依赖提供者](guide/dependency-injection-providers)。

## Providing dependency

## 提供依赖项

Imagine there is a class called HeroService that needs to act as a dependency in a component.

假设有一个名为 HeroService 的类需要用作组件中的依赖项。

The first step is to add the @Injectable decorator to show that the class can be injected.

第一步是添加 @Injectable 装饰器以表明此类可以被注入。

<code-example language="typescript">
@Injectable()
class HeroService {}
</code-example>

The next step is to make it available in the DI by providing it.  A dependency can be provided in multiple places:

下一步是提供它，以便让其在 DI 中可用。可以在多种地方提供依赖项：

* At the Component level, using the `providers` field of the `@Component` decorator. In this case the `HeroService` becomes available to all instances of this component and other components and directives used in the template. For example:

  在组件级别，使用 `@Component` 装饰器的 `providers` 字段。在这种情况下，`HeroService` 将可用于此组件的所有实例以及它的模板中使用的其他组件和指令。例如：

<code-example language="typescript">
@Component({
  selector: 'hero-list',
  template: '...',
  providers: [HeroService]
})
class HeroListComponent {}
</code-example>

When you register a provider at the component level, you get a new instance of the service with each new instance of that component.

当你在组件级别注册提供者时，该组件的每个新实例都会获得一个新的服务实例。

* At the NgModule level, using the `providers` field of the `@NgModule` decorator. In this scenario, the `HeroService` is available to all components, directives, and pipes declared in this NgModule. For example:

  在 NgModule 级别，要使用 `@NgModule` 装饰器的 `providers` 字段。在这种情况下， `HeroService` 可用于此 NgModule 中声明的所有组件、指令和管道。例如：

<code-example language="typescript">
@NgModule({
  declarations: [HeroListComponent]
  providers: [HeroService]
})
class HeroListModule {}
</code-example>

When you register a provider with a specific NgModule, the same instance of a service is available to all components in that NgModule.

当你向特定的 NgModule 注册提供者时，同一个服务实例可用于该 NgModule 中的所有组件。

* At the application root level, which allows injecting it into other classes in the application. This can be done by adding the `providedIn: 'root'` field to the `@Injectable` decorator:

  在应用程序根级别，允许将其注入应用程序中的其他类。这可以通过将 `providedIn: 'root'` 字段添加到 `@Injectable` 装饰器来实现：

<code-example language="typescript">
@Injectable({
  providedIn: 'root'
})
class HeroService {}
</code-example>

When you provide the service at the root level, Angular creates a single, shared instance of the `HeroService` and injects it into any class that asks for it. Registering the provider in the `@Injectable` metadata also allows Angular to optimize an app by removing the service from the compiled application if it isn't used, a process known as tree-shaking.

当你在根级别提供服务时，Angular 会创建一个 `HeroService` 的共享实例，并将其注入到任何需要它的类中。在 `@Injectable` 元数据中注册提供者还允许 Angular 通过从已编译的应用程序中删除没用到的服务来优化应用程序，这个过程称为摇树优化（tree-shaking）。

## Injecting a dependency

## 注入依赖项

The most common way to inject a dependency is to declare it in a class constructor. When Angular creates a new instance of a component, directive, or pipe class, it determines which services or other dependencies that class needs by looking at the constructor parameter types. For example, if the `HeroListComponent` needs the `HeroService`, the constructor can look like this:

注入依赖项的最常见方法是在类的构造函数中声明它。当 Angular 创建组件、指令或管道类的新实例时，它会通过查看构造函数的参数类型来确定该类需要哪些服务或其他依赖项。例如，如果 `HeroListComponent` 要用 `HeroService` ，则构造函数可以如下所示：

<code-example language="typescript">
@Component({ … })
class HeroListComponent {
  constructor(private service: HeroService) {}
}
</code-example>

When Angular discovers that a component depends on a service, it first checks if the injector has any existing instances of that service. If a requested service instance doesn't yet exist, the injector creates one using the registered provider, and adds it to the injector before returning the service to Angular.

当 Angular 发现一个组件依赖于一项服务时，它会首先检查注入器中是否已有该服务的任何现有实例。如果所请求的服务实例尚不存在，注入器就会使用注册的提供者创建一个，并在将服务返回给 Angular 之前将其添加到注入器中。

When all requested services have been resolved and returned, Angular can call the component's constructor with those services as arguments.

当所有请求的服务都已解析并返回时，Angular 就可以用这些服务实例为参数，调用该组件的构造函数。

<div class="lightbox">
  <img src="generated/images/guide/architecture/injector-injects.png" alt="Service" class="left">
</div>

## What's next

## 下一步呢？

* [Creating and injecting services](guide/creating-injectable-service)

  [创建和注入服务](guide/creating-injectable-service)

* [Dependency Injection in Action](guide/dependency-injection-in-action)

  [依赖注入实战](guide/dependency-injection-in-action)

@reviewed 2022-08-02
# Introduction to services and dependency injection

# 服务与依赖注入简介

*Service* is a broad category encompassing any value, function, or feature that an application needs.
A service is typically a class with a narrow, well-defined purpose.
It should do something specific and do it well.

*服务*是一个广义的概念，它包括应用所需的任何值、函数或特性。狭义的服务是一个明确定义了用途的类。它应该做一些具体的事，并做好。

Angular distinguishes components from services to increase modularity and reusability.

Angular 把组件和服务区分开，以提高模块性和复用性。

Ideally, a component's job is to enable only the user experience.
A component should present properties and methods for data binding to mediate between the view and the application logic. The view is what the template renders and the application logic is what includes the notion of a *model*.

理想情况下，组件的工作只管用户体验，而不用顾及其它。它应该提供用于数据绑定的属性和方法，以便作为视图和应用逻辑的中介者。视图就是模板所渲染的东西，而程序逻辑就是用于承载模型概念的东西。

A component should use services for tasks that don't involve the view or application logic. Services are good for tasks such as fetching data from the server, validating user input, or logging directly to the console. By defining such processing tasks in an *injectable service class*, you make those tasks available to any component.
You can also make your application more adaptable by injecting different providers of the same kind of service, as appropriate in different circumstances.

组件应该使用服务来完成那些不涉及视图或应用逻辑的任务。服务很擅长诸如从服务器获取数据、验证用户输入或直接把日志写入控制台之类的任务。通过把各种处理任务定义到可注入的服务类中，你可以让它被任何组件使用。通过在不同的环境中注入同一种服务的不同提供者，你还可以让你的应用更具适应性。

Angular doesn't *enforce* these principles.
Instead, Angular helps you *follow* these principles by making it easy to factor your application logic into services. In Angular, *dependency injection* makes those services available to components.

Angular 不会*强迫*你遵循这些原则。Angular 只会通过*依赖注入*来帮你更容易地将应用逻辑分解为服务。在 Angular 中，*依赖注入*会令这些服务可用于各个组件中。

## Service examples

## 服务范例

Here's an example of a service class that logs to the browser console.

下面是一个服务类的范例，用于把日志记录到浏览器的控制台：

<code-example header="src/app/logger.service.ts (class)" path="architecture/src/app/logger.service.ts" region="class"></code-example>

Services can depend on other services.
For example, here's a `HeroService` that depends on the `Logger` service, and also uses `BackendService` to get heroes.
That service in turn might depend on the `HttpClient` service to fetch heroes asynchronously from a server.

服务也可以依赖其它服务。比如，这里的 `HeroService` 就依赖于 `Logger` 服务，它还用 `BackendService` 来获取英雄数据。`BackendService` 还可能再转而依赖 `HttpClient` 服务来从服务器异步获取英雄列表。

<code-example header="src/app/hero.service.ts (class)" path="architecture/src/app/hero.service.ts" region="class"></code-example>

## Dependency injection (DI)

## 依赖注入（dependency injection）

<div class="lightbox">

<img alt="Service" class="left" src="generated/images/guide/architecture/dependency-injection.png">

</div>

Dependency injection (DI) is the part of the Angular framework that provides components with access to services and other resources.
Angular provides the ability for you to *inject* a service into a component to give that component access to the service.

DI 是 Angular 框架的一部分，用于在任何地方给新建的组件提供服务和其它资源。Angular 提供了把某个服务*注入*到组件中的能力，以便那个组件得以访问该服务类。

The `@Injectable()` decorator defines a class as a service in Angular and allows Angular to inject it into a component as a *dependency*.
Likewise, the `@Injectable()` decorator indicates that a component, class, pipe, or NgModule *has* a dependency on a service.

`@Injectable()` 装饰器把一个类定义为 Angular 中的服务，并且允许 Angular 把它作为*依赖*注入到组件中。
类似的，`@Injectable()` 装饰器会标记出某个组件、类、管道或 NgModule 具有对某个服务的依赖。

* The *injector* is the main mechanism.
  Angular creates an application-wide injector for you during the bootstrap process, and additional injectors as needed.
  You don't have to create injectors.

  *注入器*是主要的机制。Angular 会在启动过程中为你创建全应用级注入器以及所需的其它注入器。你不用自己创建注入器。

* An injector creates dependencies and maintains a *container* of dependency instances that it reuses, if possible.

  该注入器会创建依赖、维护一个*容器*来管理这些依赖，并尽可能复用它们。

* A *provider* is an object that tells an injector how to obtain or create a dependency

  *提供者*是一个对象，用来告诉注入器应该如何获取或创建依赖

For any dependency that you need in your app, you must register a provider with the application's injector, so that the injector can use the provider to create new instances.
For a service, the provider is typically the service class itself.

你的应用中所需的任何依赖，都必须使用该应用的注入器来注册一个提供者，以便注入器可以使用这个提供者来创建新实例。对于服务，该提供者通常就是服务类本身。

<div class="alert is-helpful">

A dependency doesn't have to be a service —it could be a function, for example, or a value.

依赖不一定是服务 —— 它还可能是函数或值。

</div>

When Angular creates a new instance of a component class, it determines which services or other dependencies that component needs by looking at the constructor parameter types.
For example, the constructor of `HeroListComponent` needs `HeroService`.

当 Angular 创建组件类的新实例时，它会通过查看该组件类的构造函数，来决定该组件依赖哪些服务或其它依赖项。比如 `HeroListComponent` 的构造函数中需要 `HeroService`：

<code-example header="src/app/hero-list.component.ts (constructor)" path="architecture/src/app/hero-list.component.ts" region="ctor"></code-example>

When Angular discovers that a component depends on a service, it first checks if the injector has any existing instances of that service.
If a requested service instance doesn't yet exist, the injector makes one using the registered provider and adds it to the injector before returning the service to Angular.

当 Angular 发现某个组件依赖某个服务时，它会首先检查是否该注入器中已经有了那个服务的任何现有实例。如果所请求的服务尚不存在，注入器就会使用以前注册的服务提供者来制作一个，并把它加入注入器中，然后把该服务返回给 Angular。

When all requested services have been resolved and returned, Angular can call the component's constructor with those services as arguments.

当所有请求的服务已解析并返回时，Angular 可以用这些服务实例为参数，调用该组件的构造函数。

The process of `HeroService` injection looks something like this.

`HeroService` 的注入过程如下所示：

<div class="lightbox">

<img alt="Service" class="left" src="generated/images/guide/architecture/injector-injects.png">

</div>

### Providing services

### 提供服务

You must register at least one *provider* of any service you are going to use.
The provider can be part of the service's own metadata, making that service available everywhere, or you can register providers with specific modules or components.
You register providers in the metadata of the service (in the `@Injectable()` decorator), or in the `@NgModule()` or `@Component()` metadata

对于要用到的任何服务，你必须至少注册一个*提供者*。服务可以在自己的元数据中把自己注册为提供者，这样可以让自己随处可用。或者，你也可以为特定的模块或组件注册提供者。要注册提供者，就要在服务的 `@Injectable()` 装饰器中提供它的元数据，或者在 `@NgModule()` 或 `@Component()` 的元数据中。

* By default, the Angular CLI command [`ng generate service`](cli/generate) registers a provider with the root injector for your service by including provider metadata in the `@Injectable()` decorator.
   The tutorial uses this method to register the provider of HeroService class definition.

  默认情况下，Angular CLI 的 [`ng generate service`](cli/generate) 命令会在 `@Injectable()` 装饰器中提供元数据来把它注册到根注入器中。本教程就用这种方法注册了 HeroService 的提供者：

  <code-example format="typescript" language="typescript">

  &commat;Injectable({
   providedIn: 'root',
  })

  </code-example>

  When you provide the service at the root level, Angular creates a single, shared instance of `HeroService`
  and injects it into any class that asks for it.
  Registering the provider in the `@Injectable()` metadata also allows Angular to optimize an app
  by removing the service from the compiled application if it isn't used, a process known as *tree-shaking*.

  当你在根一级提供服务时，Angular 会为 HeroService 创建一个单一的共享实例，并且把它注入到任何想要它的类中。这种在 `@Injectable` 元数据中注册提供者的方式还让 Angular 能够通过移除那些从未被用过的服务来优化大小。

* When you register a provider with a [specific NgModule](guide/architecture-modules), the same instance of a service is available to all components in that NgModule.
  To register at this level, use the `providers` property of the `@NgModule()` decorator.

  当你使用[特定的 NgModule](guide/architecture-modules) 注册提供者时，该服务的同一个实例将会对该 NgModule 中的所有组件可用。要想在这一层注册，请用 `@NgModule()` 装饰器中的 `providers` 属性：

  <code-example format="typescript" language="typescript">

  &commat;NgModule({
    providers: [
    BackendService,
    Logger
   ],
   &hellip;
  })

  </code-example>

* When you register a provider at the component level, you get a new instance of the service with each new instance of that component.
   At the component level, register a service provider in the `providers` property of the `@Component()` metadata.

  当你在组件级注册提供者时，你会为该组件的每一个新实例提供该服务的一个新实例。要在组件级注册，就要在 `@Component()` 元数据的 `providers` 属性中注册服务提供者。

  <code-example header="src/app/hero-list.component.ts (component providers)" path="architecture/src/app/hero-list.component.ts" region="providers"></code-example>

For more detailed information, see the [Dependency Injection](guide/dependency-injection) section.

要了解更多细节，参阅[依赖注入](guide/dependency-injection)一节。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28

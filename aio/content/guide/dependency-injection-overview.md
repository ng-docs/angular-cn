# Dependency injection in Angular

# Angular 中的依赖注入

When you develop a smaller part of your system, like a module or a class, you may need to use features from other classes. For example, you may need an HTTP service to make backend calls. Dependency Injection, or DI, is a design pattern and mechanism for creating and delivering some parts of an application to other parts of an application that require them. Angular supports this design pattern and you can use it in your applications to increase flexibility and modularity. 

当你开发系统的某个较小部件时（例如模块或类），你可能需要使用来自其他类的特性。例如，你可能需要 HTTP 服务来进行后端调用。依赖注入或 DI 是一种设计模式和机制，用于创建应用程序的某些部分并将其传递到需要它们的应用程序的其他部分。 Angular 支持这种设计模式，你可以在应用程序中使用它来提高灵活性和模块化程度。

In Angular, dependencies are typically services, but they also can be values, such as strings or functions. An injector for an application (created automatically during bootstrap) instantiates dependencies when needed, using a configured provider of the service or value. 

在 Angular 中，依赖项通常是服务，但它们也可以是值，例如字符串或函数。应用程序的注入器（在引导期间自动创建）会在需要时使用已配置的服务或值的提供者来实例化依赖项。

<div class="alert is-helpful">

See the <live-example name="dependency-injection"></live-example> for a working example containing the code snippets in this guide.

参见这个<live-example name="dependency-injection"></live-example>，以查看包含本章代码片段的可运行范例。

</div>

## Prerequisites

## 前提条件

You should be familiar with the Angular apps in general, and have the fundamental knowledge of Components, Directives, and NgModules. It's highly recommended that you complete the following tutorial:

你应该大体上熟悉 Angular 应用程序，并具有组件、指令和 NgModules 的基础知识。强烈建议你完成以下教程：

[Tour of Heroes application and tutorial](tutorial)

[《英雄之旅》应用和教程](tutorial)

## Learn about Angular dependency injection

## 了解 Angular 依赖注入

<div class="card-container">
  <a href="guide/dependency-injection" class="docs-card" title="Understanding dependency injection">
    <section>Understanding dependency injection</section>
    <section>理解依赖注入</section>
    <p>Learn basic principles of dependency injection in Angular.</p>
    <p>学习 Angular 中依赖注入的基本原理。</p>
    <p class="card-footer">Understanding dependency injection</p>
    <p class="card-footer">理解依赖注入</p>
  </a>
  <a href="guide/creating-injectable-service" class="docs-card" title="Creating and injecting service">
    <section>Creating and injecting service</section>
    <section>创建与注入服务</section>
    <p>Describes how to create a service and inject it in other services and components.</p>
    <p>讲解如何创建服务，并把它注入另一个服务或组件中。</p>
    <p class="card-footer">Creating an injectable service</p>
    <p class="card-footer">创建可注入的服务</p>
  </a>
  <a href="guide/dependency-injection-providers" class="docs-card" title="Configuring dependency providers">
    <section>Configuring dependency providers</section>
    <section>配置依赖提供者</section>
    <p>Describes how to configure dependencies using the providers field on the @Component and @NgModule decorators. Also describes how to use InjectionToken to provide and inject values in DI, which can be helpful when you want to use a value other than classes as dependencies.</p>
    <p>讲解如何在 @Component 和 @NgModule 装饰器中使用 providers 字段来配置依赖。还讲解了如何使用 InjectionToken 在 DI 中提供和注入值，这在你想把某个值而不是类作为依赖时会用到。</p>
    <p class="card-footer">Configuring dependency providers</p>
    <p class="card-footer">配置依赖提供者</p>
  </a>
  <a href="guide/hierarchical-dependency-injection" class="docs-card" title="Hierarchical injectors">
    <section>Hierarchical injectors</section>
    <section>多级注入器</section>
    <p>Hierarchical DI enables you to share dependencies between different parts of the application only when and if you need to. This is an advanced topic.</p>
    <p>多级 DI 能让你根据需要在应用的不同部件之间共享依赖。这是高级话题。</p>
    <p class="card-footer">Hierarchical injectors</p>
    <p class="card-footer">多级注入器</p>
  </a>
</div>

@reviewed 2022-08-02
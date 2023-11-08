Dependency injection in Angular

Angular 中的依赖注入

When you develop a smaller part of your system, like a module or a class, you may need to use features from other classes. For example, you may need an HTTP service to make backend calls. Dependency Injection, or DI, is a design pattern and mechanism for creating and delivering some parts of an application to other parts of an application that require them. Angular supports this design pattern and you can use it in your applications to increase flexibility and modularity.

当你开发系统的某个较小部件时（例如模块或类），你可能需要使用来自其他类的特性。例如，你可能需要 HTTP 服务来进行后端调用。依赖注入或 DI 是一种设计模式和机制，用于创建应用程序的某些部分并将其传递到需要它们的应用程序的其他部分。Angular 支持这种设计模式，你可以在应用程序中使用它来提高灵活性和模块化程度。

In Angular, dependencies are typically services, but they also can be values, such as strings or functions. An injector for an application \(created automatically during bootstrap\) instantiates dependencies when needed, using a configured provider of the service or value.

在 Angular 中，依赖项通常是服务，但它们也可以是值，例如字符串或函数。应用程序的注入器（在引导期间自动创建）会在需要时使用已配置的服务或值的提供者来实例化依赖项。

Prerequisites

前提条件

You should be familiar with the Angular apps in general, and have the fundamental knowledge of Components, Directives, and NgModules. It's highly recommended that you complete the following tutorial:

你应该大体上熟悉 Angular 应用程序，并具有组件、指令和 NgModules 的基础知识。强烈建议你完成以下教程：

[Tour of Heroes application and tutorial](tutorial/tour-of-heroes)

[《英雄之旅》应用和教程](tutorial/tour-of-heroes)

Learn about Angular dependency injection

了解 Angular 依赖注入
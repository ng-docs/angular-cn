Introduction to modules

NgModule 简介

Angular applications are modular and Angular has its own modularity system called *NgModules*.
NgModules are containers for a cohesive block of code dedicated to an application domain, a workflow, or a closely related set of capabilities.
They can contain components, service providers, and other code files whose scope is defined by the containing NgModule.
They can import functionality that is exported from other NgModules, and export selected functionality for use by other NgModules.

Angular 应用是模块化的，它拥有自己的模块化系统，称作 *NgModule*。一个 NgModule 就是一个容器，用于存放一些内聚的代码块，这些代码块专注于某个应用领域、某个工作流或一组紧密相关的功能。它可以包含一些组件、服务提供者或其它代码文件，其作用域由包含它们的 NgModule 定义。它还可以导入一些由其它模块中导出的功能，并导出一些指定的功能供其它 NgModule 使用。

Every Angular application has at least one NgModule class, [the *root module*](guide/bootstrapping), which is conventionally named `AppModule` and resides in a file named `app.module.ts`.
You launch your application by *bootstrapping* the root NgModule.

每个 Angular 应用都至少有一个 NgModule 类，也就是[根模块](guide/bootstrapping)，它习惯上命名为 `AppModule`，并位于一个名叫 `app.module.ts` 的文件中。*引导*这个根模块就可以启动你的应用。

While a small application might have only one NgModule, most applications have many more *feature modules*.
The *root* NgModule for an application is so named because it can include child NgModules in a hierarchy of any depth.

虽然小型的应用可能只有一个 NgModule，不过大多数应用都会有很多*特性模块*。应用的*根模块*之所以叫根模块，是因为它可以包含任意深度的层次化子模块。

NgModule metadata

`@NgModule` 元数据

An NgModule is defined by a class decorated with `@NgModule()`.
The `@NgModule()` decorator is a function that takes a single metadata object, whose properties describe the module.
The most important properties are as follows.

NgModule 是一个带有 `@NgModule()` 装饰器的类。`@NgModule()` 装饰器是一个函数，它接受一个元数据对象，该对象的属性用来描述这个模块。其中最重要的属性如下。

The main application view, called the *root component*, which hosts all other application views. Only the *root NgModule* should set the `bootstrap` property.

应用的主视图，称为*根组件*。它是应用中所有其它视图的宿主。只有*根模块*才应该设置这个 `bootstrap` 属性。

Creators of [services](guide/architecture-services) that this NgModule contributes to the global collection of services; they become accessible in all parts of the application. \(You can also specify providers at the component level.\)

本模块向全局服务中贡献的那些[服务](guide/architecture-services)的创建器。这些服务能被本应用中的任何部分使用。（你也可以在组件级别指定服务提供者。）

Other modules whose exported classes are needed by component templates declared in *this* NgModule.

那些导出了*本*模块中的组件模板所需的类的其它模块。

The subset of declarations that should be visible and usable in the *component templates* of other NgModules.

那些能在其它模块的*组件模板*中使用的可声明对象的子集。

The [components](guide/architecture-components), *directives*, and *pipes* that belong to this NgModule.

那些属于本 NgModule 的[组件](guide/architecture-components)、*指令*、*管道*。

Properties

属性

Details

详情

Here's a simple root NgModule definition.

下面是一个简单的根 NgModule 定义：

NgModules and components

NgModule 和组件

NgModules provide a *compilation context* for their components.
A root NgModule always has a root component that is created during bootstrap but any NgModule can include any number of additional components, which can be loaded through the router or created through the template.
The components that belong to an NgModule share a compilation context.

NgModule 为其中的组件提供了一个*编译上下文环境*。根模块总会有一个根组件，并在引导期间创建它。但是，任何模块都能包含任意数量的其它组件，这些组件可以通过路由器加载，也可以通过模板创建。那些属于这个 NgModule 的组件会共享同一个编译上下文环境。

<br class="clear">



A component and its template together define a *view*.
A component can contain a *view hierarchy*, which allows you to define arbitrarily complex areas of the screen that can be created, modified, and destroyed as a unit.
A view hierarchy can mix views defined in components that belong to different NgModules.
This is often the case, especially for UI libraries.

组件及其模板共同定义*视图*。组件还可以包含*视图层次结构*，它能让你定义任意复杂的屏幕区域，可以将其作为一个整体进行创建、修改和销毁。一个视图层次结构中可以混合使用由不同 NgModule 中的组件定义的视图。这种情况很常见，特别是对一些 UI 库来说。

When you create a component, it's associated directly with a single view, called the *host view*.
The host view can be the root of a view hierarchy, which can contain *embedded views*, which are in turn the host views of other components.
Those components can be in the same NgModule, or can be imported from other NgModules.
Views in the tree can be nested to any depth.

当你创建一个组件时，它直接与一个叫做*宿主视图*的视图关联起来。宿主视图可以是视图层次结构的根，该视图层次结构可以包含一些*内嵌视图*，这些内嵌视图又是其它组件的宿主视图。这些组件可以位于相同的 NgModule 中，也可以从其它 NgModule 中导入。树中的视图可以嵌套到任意深度。

NgModules and JavaScript modules

NgModule 和 JavaScript 的模块

The NgModule system is different from, and unrelated to, the JavaScript \(ES2015\) module system for managing collections of JavaScript objects.
These are *complementary* module systems that you can use together to write your applications.

NgModule 系统与 JavaScript（ES2015）用来管理 JavaScript 对象的模块系统不同，而且也没有直接关联。这两种模块系统不同但*互补*。你可以使用它们来共同编写你的应用。

In JavaScript each *file* is a module and all objects defined in the file belong to that module.
The module declares some objects to be public by marking them with the `export` key word.
Other JavaScript modules use *import statements* to access public objects from other modules.

JavaScript 中，每个*文件*是一个模块，文件中定义的所有对象都从属于那个模块。通过 `export` 关键字，模块可以把它的某些对象声明为公共的。其它 JavaScript 模块可以使用*import 语句*来访问这些公共对象。

Angular libraries

Angular 自带的库

Angular loads as a collection of JavaScript modules.
You can think of them as library modules.
Each Angular library name begins with the `@angular` prefix.
Install them with the node package manager `npm` and import parts of them with JavaScript `import` statements.

Angular 会作为一组 JavaScript 模块进行加载，你可以把它们看成库模块。每个 Angular 库的名称都带有 `@angular` 前缀。使用 `npm` 包管理器安装 Angular 的库，并使用 JavaScript 的 `import` 语句导入其中的各个部分。

For example, import Angular's `Component` decorator from the `@angular/core` library like this.

比如，像下面这样，从 `@angular/core` 库中导入 Angular 的 `Component` 装饰器：

You also import NgModules from Angular *libraries* using JavaScript import statements.
For example, the following code imports the `BrowserModule` NgModule from the `platform-browser` library.

还可以使用 JavaScript 的导入语句从 Angular *库*中导入 Angular *模块*。比如，下列代码从 `platform-browser` 库中导入了 `BrowserModule` 这个 NgModule。

In the example of the simple root module above, the application module needs material from within
`BrowserModule`.
To access that material, add it to the `@NgModule` metadata `imports` like this.

在上面这个简单的根模块范例中，应用的根模块需要来自 `BrowserModule` 中的素材。要访问这些素材，就要把它加入 `@NgModule` 元数据的 `imports` 中，代码如下：

In this way, you're using the Angular and JavaScript module systems *together*.
Although it's easy to confuse the two systems, which share the common vocabulary of "imports" and "exports", you will become familiar with the different contexts in which they are used.

通过这种方式，你可以*同时*使用 Angular 和 JavaScript 的这两种模块系统。虽然这两种模块系统容易混淆（它们共享了同样的词汇 `import` 和 `export`），不过只要多用用你就会熟悉它们各自的语境了。
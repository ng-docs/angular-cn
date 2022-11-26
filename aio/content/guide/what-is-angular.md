# What is Angular?

# 什么是 Angular？

This topic can help you understand Angular: what Angular is, what advantages it provides, and what you might expect as you start to build your applications.

本主题会帮你了解 Angular：什么是 Angular？它有哪些优势？当构建应用时它能为你提供什么帮助？

Angular is a development platform, built on [TypeScript](https://www.typescriptlang.org).
As a platform, Angular includes:

Angular 是一个基于 [TypeScript](https://www.typescriptlang.org) 构建的开发平台。它包括：

* A component-based framework for building scalable web applications

  一个基于组件的框架，用于构建可伸缩的 Web 应用

* A collection of well-integrated libraries that cover a wide variety of features, including routing, forms management, client-server communication, and more

  一组完美集成的库，涵盖各种功能，包括路由、表单管理、客户端-服务器通信等

* A suite of developer tools to help you develop, build, test, and update your code

  一套开发工具，可帮助你开发、构建、测试和更新代码

With Angular, you're taking advantage of a platform that can scale from single-developer projects to enterprise-level applications.
Angular is designed to make updating as straightforward as possible, so take advantage of the latest developments with minimal effort.
Best of all, the Angular ecosystem consists of a diverse group of over 1.7 million developers, library authors, and content creators.

借助 Angular，无论单人项目还是企业级应用，你都能获得平台带来的优势。Angular 的设计目标之一就是让更新更容易，因此你可以用最小的成本升级到最新的 Angular 版本。最重要的是，Angular 的生态系统由包括 170 万名开发人员、库作者和内容创作者在内的多元团队构成。

<div class="alert is-helpful">

See the <live-example name="what-is-angular"></live-example> for a working example containing the code snippets in this guide.

要试用包含本指南中代码片段的可工作范例，请看<live-example name="what-is-angular"></live-example>。

</div>

<a id="essentials"></a>

## Angular applications: The essentials

## Angular 应用：知识要点

This section explains the core ideas behind Angular.
Understanding these ideas can help you design and build your applications more effectively.

本节会解释 Angular 背后的核心思想。了解这些思想可以帮助你更有效地设计和构建应用。

<a id="components"></a>

### Components

### 组件

Components are the building blocks that compose an application.
A component includes a TypeScript class with a `@Component()` decorator, an HTML template, and styles.
The `@Component()` decorator specifies the following Angular-specific information:

组件是构成应用的砖块。组件包括三个部分：带有 `@Component()` 装饰器的 TypeScript 类、HTML 模板和样式文件。`@Component()` 装饰器会指定如下 Angular 专属信息：

* A CSS selector that defines how the component is used in a template.
  HTML elements in your template that match this selector become instances of the component.

  一个 CSS 选择器，用于定义如何在模板中使用组件。模板中与此选择器匹配的 HTML 元素将成为该组件的实例。

* An HTML template that instructs Angular how to render the component

  一个 HTML 模板，用于指示 Angular 如何渲染此组件

* An optional set of CSS styles that define the appearance of the template's HTML elements

  一组可选的 CSS 样式，用于定义模板中 HTML 元素的外观

The following is a minimal Angular component.

下面是一个最小化的 Angular 组件。

<code-example format="typescript" language="typescript" path="what-is-angular/src/app/hello-world/hello-world.component.ts"></code-example>

To use this component, you write the following in a template:

要使用此组件，请在模板中编写以下内容：

<code-example format="html" language="html" path="what-is-angular/src/app/app.component.html" region="hello-world-selector"></code-example>

When Angular renders this component, the resulting DOM looks like this:

当 Angular 渲染此组件时，生成的 DOM 如下所示：

<code-example format="html" language="html" path="what-is-angular/src/app/hello-world-example.html"></code-example>

Angular's component model offers strong encapsulation and an intuitive application structure.
Components also make your application painless to unit test and can improve the general readability of your code.

Angular 的组件模型提供了强大的封装能力和直观的应用结构。组件还能让你的应用更容易进行单元测试，并可以提高代码的整体可读性。

For more information on what to do with components, see the [Components](guide/component-overview) section.

有关可以用组件做什么的更多信息，请参见[“组件”](guide/component-overview)部分。

<a id="templates"></a>

### Templates

### 模板

<!-- vale Angular.Google_WordListWarnings = NO -->

Every component has an HTML template that declares how that component renders.
You define this template either inline or by file path.

每个组件都有一个 HTML 模板，用于声明该组件的渲染方式。你可以内联它或用文件路径定义此模板。

<!-- vale Angular.Google_WordListWarnings = YES -->

Angular adds syntax elements that extend HTML so you can insert dynamic values from your component.
Angular automatically updates the rendered DOM when your component's state changes.
One application of this feature is inserting dynamic text, as shown in the following example.

Angular 添加了一些语法元素以扩展 HTML，让你可以从组件中插入动态值。当组件的状态更改时，Angular 会自动更新已渲染的 DOM。此功能的应用之一是插入动态文本，如下例子所示。

<code-example format="html" language="html" path="what-is-angular/src/app/hello-world-interpolation/hello-world-interpolation.component.html" region="say-hello"></code-example>

The value for message comes from the component class:

这里 message 的值来自组件类：

<code-example format="typescript" language="typescript" path="what-is-angular/src/app/hello-world-interpolation/hello-world-interpolation.component.ts"></code-example>

When the application loads the component and its template, the user sees the following:

当应用加载组件及其模板时，用户将看到以下内容：

<code-example format="shell" language="html">

&lt;p&gt;Hello, World!&lt;/p&gt;

</code-example>

Notice the use of double curly braces—they instruct Angular to interpolate the contents within them.

注意这里所用的双花括号 —— 它们指示 Angular 对其中的内容进行插值。

Angular also supports property bindings, to help you set values for properties and attributes of HTML elements and pass values to your application's presentation logic.

Angular 还支持属性绑定，以帮助你设置 HTML 元素的 Property 和 Attribute 的值，并将这些值传给应用的展示逻辑。

<code-example format="html" language="html" path="what-is-angular/src/app/hello-world-bindings/hello-world-bindings.component.html" region="bindings"></code-example>

Notice the use of the square brackets—that syntax indicates that you're binding the property or attribute to a value in the component class.

注意这里所用的方括号 —— 该语法表明你正在将 Property 或 Attribute 绑定到组件类中的值。

Declare event listeners to listen for and respond to user actions such as keystrokes, mouse movements, clicks, and touches.
You declare an event listener by specifying the event name in parentheses:

可以声明事件监听器来监听并响应用户的操作，比如按键、鼠标移动、单击和触摸等。你可以通过在圆括号中指定事件名称来声明一个事件监听器：

<code-example format="html" language="html" path="what-is-angular/src/app/hello-world-bindings/hello-world-bindings.component.html" region="event-binding"></code-example>

The preceding example calls a method, which is defined in the component class:

前面的例子中调用了一个方法，该方法是在组件类中定义的：

<code-example format="typescript" language="typescript" path="what-is-angular/src/app/hello-world-bindings/hello-world-bindings.component.ts" region="method"></code-example>

The following is a combined example of Interpolation, Property Binding, and Event Binding within an Angular template:

以下是在 Angular 模板中插值和绑定的例子：

<code-tabs linenums="true">
    <code-pane header="hello-world-bindings.component.ts" path="what-is-angular/src/app/hello-world-bindings/hello-world-bindings.component.ts"></code-pane>
    <code-pane header="hello-world-bindings.component.html" path="what-is-angular/src/app/hello-world-bindings/hello-world-bindings.component.html"></code-pane>
</code-tabs>

Add features to your templates by using [directives](guide/built-in-directives).
The most popular directives in Angular are `*ngIf` and `*ngFor`.
Use directives to perform a variety of tasks, such as dynamically modifying the DOM structure.
And create your own custom directives to create great user experiences.

可以用[指令](guide/built-in-directives)来为模板添加额外功能。Angular 中最常用的指令是 `*ngIf` 和 `*ngFor`。你可以使用指令执行各种任务，比如动态修改 DOM 结构。你还可以用自定义指令来创建出色的用户体验。

The following code is an example of the `*ngIf` directive.

以下代码是 `*ngIf` 指令的例子。

<code-tabs linenums="true">
  <code-pane header="hello-world-ngif.component.ts" path="what-is-angular/src/app/hello-world-ngif/hello-world-ngif.component.ts"></code-pane>
  <code-pane header="hello-world-ngif.component.html" path="what-is-angular/src/app/hello-world-ngif/hello-world-ngif.component.html"></code-pane>
</code-tabs>

Angular's declarative templates let you cleanly separate your application's logic from its presentation.
Templates are based on standard HTML, for ease in building, maintaining, and updating.

Angular 的声明式模板使让可以将应用的逻辑和外观完全分开。模板基于标准 HTML，因此易于构建、维护和更新。

For more information on templates, see the [Templates](guide/template-syntax) section.

关于模板用法和用途的更多信息，请参见[“模板”](guide/template-syntax)部分。

<a id="di"></a>

### Dependency injection

### 依赖注入

Dependency injection lets you declare the dependencies of your TypeScript classes without taking care of their instantiation.
Instead, Angular handles the instantiation for you.
This design pattern lets you write more testable and flexible code.
Understanding dependency injection is not critical to start using Angular, but it is strongly recommended as a best practice. Many aspects of Angular take advantage of it to some degree.

依赖注入让你可以声明 TypeScript 类的依赖项，而无需操心如何实例化它们，Angular 会为你处理这些琐事。这种设计模式能让你写出更加可测试、也更灵活的代码。尽管了解依赖注入对于开始用 Angular 并不是至关重要的事，但我们还是强烈建议你将其作为最佳实践，并且 Angular 自身的方方面面都在一定程度上利用了它。

To illustrate how dependency injection works, consider the following example.
The first file, `logger.service.ts`, defines a `Logger` class.
This class contains a `writeCount` function that logs a number to the console.

为了说明依赖注入的工作原理，请考虑以下例子。第一个文件 `logger.service.ts` 中定义了一个 `Logger` 类。它包含一个 `writeCount` 函数，该函数将一个数字记录到控制台。

<code-example format="typescript" language="typescript" path="what-is-angular/src/app/logger.service.ts"></code-example>

Next, the `hello-world-di.component.ts` file defines an Angular component.
This component contains a button that uses the `writeCount` function of the Logger class.
To access that function, the `Logger` service is injected into the `HelloWorldDI` class by adding `private logger: Logger` to the constructor.

接下来，`hello-world-di.component.ts` 文件中定义了一个 Angular 组件。该组件包含一个按钮，它会使用此 Logger 类的 `writeCount` 函数。要访问此功能，可通过向构造函数中添加 `private logger: Logger` 来把 `Logger` 服务注入到 `HelloWorldDI` 类中。

<code-example format="typescript" language="typescript" path="what-is-angular/src/app/hello-world-di/hello-world-di.component.ts"></code-example>

For more information about dependency injection and Angular, see the [Dependency injection in Angular](guide/dependency-injection) section.

有关依赖注入和 Angular 的更多信息，请参见 Angular 中的[依赖注入](guide/dependency-injection)部分。

<a id="cli"></a>

## Angular CLI

The Angular CLI is the fastest, straightforward, and recommended way to develop Angular applications.
The Angular CLI makes some tasks trouble-free.
For example:

<!-- vale Angular.Google_WordListSuggestions = NO -->

Angular CLI 是开发 Angular 应用的最快、最简单和推荐的方式。Angular CLI 能简化许多任务。这里有些例子：

| Command | Details |
| :------ | :------ |
| 命令 | 详情 |
| [ng build](cli/build) | Compiles an Angular application into an output directory. |
| [ng build](cli/build) | 把 Angular 应用编译到一个输出目录中。 |
| [ng serve](cli/serve) | Builds and serves your application, rebuilding on file changes. |
| [ng serve](cli/serve) | 构建你的应用并启动开发服务器，当有文件变化时就重新构建。 |
| [ng generate](cli/generate) | Generates or modifies files based on a schematic. |
| [ng generate](cli/generate) | 基于原理图（schematic）生成或修改某些文件。 |
| [ng test](cli/test) | Runs unit tests on a given project. |
| [ng test](cli/test) | 在指定的项目上运行单元测试。 |
| [ng e2e](cli/e2e) | Builds and serves an Angular application, then runs end-to-end tests. |
| [ng e2e](cli/e2e) | 构建一个 Angular 应用并启动开发服务器，然后运行端到端测试。 |

<!-- vale Angular.Google_WordListSuggestions = YES -->

The Angular CLI is a valuable tool for building out your applications.

For more information about the Angular CLI, see the [Angular CLI Reference](cli) section.

有关 Angular CLI 的更多信息，请参阅 [“Angular CLI 参考手册”](cli)部分。

<a id="1p-libraries"></a>

## First-party libraries

## 自带库

The section, [Angular applications: the essentials](#essentials), provides a brief overview of a couple of the key architectural elements that are used when building Angular applications.
The many benefits of Angular really become clear when your application grows and you want to add functions such as site navigation or user input.
Use the Angular platform to incorporate one of the many first-party libraries that Angular provides.

[“Angular 应用：基本知识”](#essentials)部分提供了构建 Angular 应用时要用到的几个关键架构元素的简要描述。但是，当你的应用不断成长并且想要添加其他功能（比如站点导航或用户输入）时，Angular 的许多优势才会真正显现出来。届时，你可以通过 Angular 平台，来引入 Angular 所提供的众多自带库之一。

Some of the libraries available to you include:

你可以使用的一些库包括：

| Library | Details |
| :------ | :------ |
| 库 | 详情 |
| [Angular Router](guide/router) | Advanced client-side navigation and routing based on Angular components. Supports lazy-loading, nested routes, custom path matching, and more. |
| [Angular 路由器](guide/router) | 高级的客户侧导航功能与基于 Angular 组件的路由机制。支持惰性加载、嵌套路由、自定义路径匹配规则等。 |
| [Angular Forms](guide/forms-overview) | Uniform system for form participation and validation. |
| [Angular 表单](guide/forms-overview) | 统一的表单填报与验证体系。 |
| [Angular HttpClient](guide/http) | Robust HTTP client that can power more advanced client-server communication. |
| [Angular HttpClient](guide/http) | 健壮的 HTTP 客户端库，它可以支持更高级的客户端-服务器通讯。 |
| [Angular Animations](guide/animations) | Rich system for driving animations based on application state. |
| [Angular 动画](guide/animations) | 丰富的动画体系，用于驱动基于应用状态的动画。 |
| [Angular PWA](guide/service-worker-intro) | Tools for building Progressive Web Applications (PWAs) including a service worker and Web app manifest. |
| [Angular PWA](guide/service-worker-intro) | 一些用于构建渐进式 Web 应用（PWA）的工具，包括 Service Worker 和 Web 应用清单（Manifest）。 |
| [Angular Schematics](guide/schematics) | Automated scaffolding, refactoring, and update tools that simplify development at large scale. |
| [Angular 原理图](guide/schematics) | 一些搭建脚手架、重构和升级的自动化工具。用于简化大规模应用的开发。 |

<!-- vale Angular.Google_Acronyms = YES -->

These libraries expand your application's capabilities while also letting you focus more on the features that make your application unique.
Add these libraries knowing that they're designed to integrate flawlessly into and update simultaneously with the Angular framework.

这些库在扩展应用能力的同时，还能让你将更多精力放在那些令你的应用与众不同的功能上。你可以添加这些库，并相信它们能与 Angular 框架无缝集成并同步更新。

These libraries are only required when they can help you add features to your applications or solve a particular problem.

只有当它们可以帮你向应用中添加功能或解决特定的问题时，你才需要这些库。

## Next steps

## 下一步

This topic gives you a brief overview of what Angular is, the advantages it provides, and what to expect as you start to build your applications.

本主题旨在帮你了解 Angular：什么是 Angular？它有哪些优势？当构建应用时它能为你提供什么帮助？

To see Angular in action, see the [Getting Started](start) tutorial.
This tutorial uses [stackblitz.com](https://stackblitz.com), for you to explore a working example of Angular without any installation requirements.

要实际使用 Angular，请参阅我们的[入门](start)教程。本教程使用 [stackblitz.com](https://stackblitz.com)，因此你可以浏览 Angular 的可工作范例，而不必先做任何安装工作。

The following sections are recommended to explore Angular's capabilities further:

*   [Understanding Angular](guide/understanding-angular-overview)
*   [Angular Developer Guide](guide/developer-guide-overview)

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
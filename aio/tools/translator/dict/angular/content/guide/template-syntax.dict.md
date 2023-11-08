Template syntax

模板语法

In Angular, a *template* is a chunk of HTML.
Use special syntax within a template to build on many of Angular's features.

在 Angular 中，*模板*就是一块 HTML。你可以在模板中通过一种特殊的语法来使用 Angular 的诸多特性。

Prerequisites

前提条件

Before learning template syntax, you should be familiar with the following:

在学习模板语法之前，你应该熟悉下列内容：

[Angular concepts](guide/architecture)

[Angular 的概念](guide/architecture)

Each Angular template in your application is a section of HTML to include as a part of the page that the browser displays.
An Angular HTML template renders a view, or user interface, in the browser, just like regular HTML, but with a lot more functionality.

应用程序中的每个 Angular 模板都是一块 HTML，你可以将其包含在浏览器显示的页面中。Angular 中的 HTML 模板与常规 HTML 一样，可以在浏览器中渲染视图或用户界面，但功能要多得多。

When you generate an Angular application with the Angular CLI, the `app.component.html` file is the default template containing placeholder HTML.

使用 Angular CLI 生成 Angular 应用时，`app.component.html` 文件是一个包含占位符 HTML 的默认模板。

The template syntax guides show you how to control the UX/UI by coordinating data between the class and the template.

本模板语法指南向你展示了如何通过协调类和模板之间的数据来控制 UX/UI。

Empower your HTML

为你的 HTML 赋能

Extend the HTML vocabulary of your applications With special Angular syntax in your templates.
For example, Angular helps you get and set DOM \(Document Object Model\) values dynamically with features such as built-in template functions, variables, event listening, and data binding.

在模板中使用 Angular 的特有语法来扩展应用程序的 HTML 词汇表。比如，Angular 可以通过内置的模板函数、变量、事件监听和数据绑定等功能来帮助你动态获取和设置 DOM（文档对象模型）中的值。

Almost all HTML syntax is valid template syntax.
However, because an Angular template is part of an overall webpage, and not the entire page, you don't need to include elements such as `<html>`, `<body>`, or `<base>`, and can focus exclusively on the part of the page you are developing.

几乎所有的 HTML 语法都是有效的模板语法。但是，由于 Angular 模板只是整个网页的一部分，而不是整个网页，因此你不需要包含诸如 `<html>`，`<body>` 或 `<base>` 元素。这样你可以专注于正在开发的那部分页面。

More on template syntax

关于模板语法的更多信息

You might also be interested in the following:

你可能还对下列内容感兴趣：

[SVG in templates](guide/svg-in-templates)

[模板中的 SVG](guide/svg-in-templates)

Dynamically generate interactive graphics.

动态生成交互式图形。

[Template expression operators](guide/template-expression-operators)

[模板表达式运算符](guide/template-expression-operators)

Learn about the pipe operator \(<code>&verbar;</code>\), and protect against `null` or `undefined` values in your HTML.

了解管道运算符 &verbar;，以及如何防范空值 `null` 或 `undefined`。

[Inputs and Outputs](guide/inputs-outputs)

[输入和输出](guide/inputs-outputs)

Share data between the parent context and child directives or components

在父级上下文和子指令或组件之间共享数据

[Template reference variables](guide/template-reference-variables)

[模板引用变量](guide/template-reference-variables)

Use special variables to reference a DOM element within a template.

U 使用特殊变量来引用模板中的 DOM 元素。

[Built-in directives](guide/built-in-directives)

[内置指令](guide/built-in-directives)

Listen to and modify the behavior and layout of HTML.

监听和修改 HTML 的行为和布局。

[Two-way binding](guide/two-way-binding)

[双向绑定](guide/two-way-binding)

Share data between a class and its template.

在类及其模板之间共享数据。

[Event binding](guide/event-binding)

[事件绑定](guide/event-binding)

Listen for events and your HTML.

监听事件和 HTML。

[Attribute, class, and style bindings](guide/attribute-binding)

[属性（Attribute），类和样式绑定](guide/attribute-binding)

Set the value of attributes, classes, and styles.

设置 Attribute、类和样式的值。

[Property binding](guide/property-binding)

[property 绑定](guide/property-binding)

Set properties of target elements or directive `@Input()` decorators.

设置目标元素的属性或指令中带 `@Input()` 装饰器的属性。

[Binding syntax](guide/binding-syntax)

[绑定语法](guide/binding-syntax)

Use binding to coordinate values in your application.

使用绑定来协调应用程序中的值。

[Template statements](guide/template-statements)

[模板语句](guide/template-statements)

Respond to events in your templates.

响应模板中的事件。

[Interpolation](guide/interpolation)

[插值](guide/interpolation)

Learn how to use interpolation and expressions in HTML.

学习如何在 HTML 中使用插值和表达式。

Topics

主题

Details

详情
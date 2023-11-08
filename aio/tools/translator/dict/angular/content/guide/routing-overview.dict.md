Angular Routing

Angular 路由

In a single-page app, you change what the user sees by showing or hiding portions of the display that correspond to particular components, rather than going out to the server to get a new page.
As users perform application tasks, they need to move between the different [views](guide/glossary#view "Definition of view") that you have defined.

在单页应用中，你可以通过显示或隐藏与特定组件相对应的部分来更改用户看到的内容，而不用去服务器获取新页面。用户执行应用程序任务时，他们需要在定义好的不同[视图](guide/glossary#view "视图的定义")之间移动。

To handle the navigation from one [view](guide/glossary#view) to the next, you use the Angular **`Router`**.
The **`Router`** enables navigation by interpreting a browser URL as an instruction to change the view.

要处理从一个[视图](guide/glossary#view)到下一个视图的导航，请使用 Angular **`Router`**。**`Router`** 会通过将浏览器 URL 解释为更改视图的操作指令来启用导航。

To explore a sample app featuring the router's primary features, see the <live-example name="router"></live-example>.

要浏览具有主要路由器功能的示例应用，请参阅<live-example name="router"></live-example>。

Prerequisites

前提条件

Before creating a route, you should be familiar with the following:

在创建路由之前，你应该熟悉以下内容：

[Basics of components](guide/architecture-components)

[组件基础](guide/architecture-components)

[Basics of templates](guide/glossary#template)

[模板基础](guide/glossary#template)

An Angular app —you can generate a basic Angular application using the [Angular CLI](cli).

一个 Angular 应用程序 - 你可以使用 [Angular CLI](cli) 生成基本的 Angular 应用程序。

Learn about Angular routing

了解 Angular 路由
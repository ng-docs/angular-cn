# Tour of Heroes application and tutorial

# 教程：英雄之旅

<div class="callout is-helpful">

<header>Getting Started</header>

<header>快速上手</header>

In this tutorial, you build your own Angular application from the start.
This is a good way to experience a typical development process as you learn Angular application-design concepts, tools, and terminology.

在本教程中，你将从头开始构建自己的应用，体验典型的开发过程。这里还有一些对基本的应用设计概念、工具和术语的介绍。

If you're new to Angular, try the [**Try it now**](start) quick-start application first.
**Try it now** is based on a ready-made  partially completed project.
You can edit the application in StackBlitz and see the results in real time.

如果你对 Angular 还不熟悉，你可能要先[**试一试**](start) 快速上手应用。它基于一个现成的、已部分完成的项目，你可以在 StacBlitz 的交互式开发环境中检查和修改，你还可以在那里实时查看结果。

**Try it now** covers the same major topics &mdash;components, template syntax, routing, services, and accessing data using HTTP&mdash; in a condensed format, following best practices.

“试一试”教程遵循最佳实践，以简明的格式，涵盖了与其相同的主要话题 - 组件、模板语法、路由、服务，以及通过 HTTP 访问数据。

</div>

This *Tour of Heroes* tutorial provides an introduction to the fundamentals of Angular and shows you how to:

* Set up your local Angular development environment.

* Use the [Angular CLI](cli "CLI command reference") to develop an application

这个*“英雄之旅”*教程向你展示了如何使用 [Angular CLI 工具](cli "CLI 命令参考：")搭建本地开发环境并开发应用，还对 [Angular CLI 工具](cli "CLI 命令参考：") 的基础知识进行了介绍。

The *Tour of Heroes* application that you build helps a staffing agency manage its stable of heroes.
The application has many of the features that you'd expect to find in any data-driven application.

The finished application:

* Gets a list of heroes

* Displays the heroes in a list

* Edits a selected hero's details

* Navigates between different views of heroic data

This tutorial helps you gain confidence that Angular can do whatever you need it to do by showing you how to:

* Use Angular [directives](guide/glossary#directive "Directives definition") to show and hide elements and display lists of hero data.

* Create Angular [components](guide/glossary#component "Components definition") to display hero details and show an array of heroes.

  创建 Angular [组件](guide/glossary#component "Components definition")以显示英雄的详情，并显示一个英雄数组。

* Use one-way [data binding](guide/glossary#data-binding "Data binding definition") for read-only data.

  为只读数据使用单向[数据绑定](guide/glossary#data-binding "Data binding definition")。

* Add editable fields to update a model with two-way data binding.

  添加可编辑字段，使用双向数据绑定来更新模型。

* Bind component methods to user events, like keystrokes and clicks.

  把组件中的方法绑定到用户事件上，比如按键和点击。

* Enable users to select a hero from a list and edit that hero in the details view.

* Format data with [pipes](guide/glossary#pipe "Pipe definition").

  使用[管道](guide/glossary#pipe "Pipe definition")来格式化数据。

* Create a shared [service](guide/glossary#service "Service definition") to assemble the heroes.

  创建共享的[服务](guide/glossary#service "Service definition")来管理这些英雄。

* Use [routing](guide/glossary#router "Router definition") to navigate among different views and their components.

  使用[路由](guide/glossary#router "Router definition")在不同的视图及其组件之间导航。

<div class="callout is-helpful">

<header>Solution</header>

<header>最终解</header>

After you complete all tutorial steps, the final application looks like this example.
<live-example name="toh-pt6"></live-example>.

完成本教程的所有步骤之后，最终的应用会是这样的：<live-example name="toh-pt6"></live-example>。

</div>

## Design your new application

## 你要构建出什么

Here's an image of where this tutorial leads, showing the Dashboard view and the most heroic heroes:

下面是本教程关于界面的构想：开始是“Dashboard（仪表盘）”视图，来展示最勇敢的英雄。

<div class="lightbox">

<img alt="Output of heroes dashboard" src="generated/images/guide/toh/heroes-dashboard-1.png">

</div>

You can click the **Dashboard** and **Heroes** links in the dashboard to navigate between the views.

If you click the dashboard hero "Magneta," the router opens a "Hero Details" view where you can change the hero's name.

当你点击仪表盘上名叫“Magneta”的英雄时，路由会打开英雄详情页，在这里，你可以修改英雄的名字。

<div class="lightbox">

<img alt="Details of hero in application" src="generated/images/guide/toh/hero-details-1.png">

</div>

Clicking the "Back" button returns you to the Dashboard.
Links at the top take you to either of the main views.
If you click "Heroes," the application displays the "Heroes" list view.

点击“Back（后退）”按钮将返回到“Dashboard（仪表盘）”。顶部的链接可以把你带到任何一个主视图。如果你点击“Heroes（英雄列表）”链接，应用将把你带到“英雄”列表主视图。

<div class="lightbox">

<img alt="Output of heroes list application" src="generated/images/guide/toh/heroes-list-2.png">

</div>

When you click a different hero name, the read-only mini detail beneath the list reflects the new choice.

当你点击另一位英雄时，一个只读的“微型详情视图”会显示在列表下方，以体现你的选择。

You can click the "View Details" button to drill into the editable details of the selected hero.

你可以点击“View Details（查看详情）”按钮进入所选英雄的编辑视图。

The following diagram illustrates the navigation options.

下面这张图汇总了所有可能的导航路径。

<div class="lightbox">

<img alt="View navigations" src="generated/images/guide/toh/nav-diagram.png">

</div>

Here's the application in action:

下图演示了本应用中的动图。

<div class="lightbox">

<img alt="Tour of Heroes in Action" src="generated/images/guide/toh/toh-anim.gif">

</div>

@reviewed 2022-05-16
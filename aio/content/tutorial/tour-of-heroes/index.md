# Tour of Heroes application and tutorial

# 英雄之旅应用程序和教程

<div class="callout is-helpful">

<header>Getting Started</header>

<header>快速入门</header>

In this tutorial, you build your own Angular application from the start.
This is a good way to experience a typical development process as you learn Angular application-design concepts, tools, and terminology.

在本教程中，你将从头构建出自己的 Angular 应用程序。这是让你学习 Angular 应用程序设计概念、工具和术语，并体验典型开发过程的好办法。

If you're new to Angular, try the [**Try it now**](start) quick-start application first.
**Try it now** is based on a ready-made  partially completed project.
You can edit the application in StackBlitz and see the results in real time.

如果你是 Angular 的新手，请先试用“[**立即试用”**](start)快速入门应用程序。**立即试用**基于一个现成的已部分完成的项目。你可以在 StackBlitz 中编辑应用程序并实时查看结果。

**Try it now** covers the same major topics —components, template syntax, routing, services, and accessing data using HTTP— in a condensed format, following best practices.

**立即试用**涵盖了相同的主要主题 —— 组件、模板语法、路由、服务和使用 HTTP 访问数据，但以一种更精简的格式，且遵循最佳实践。

</div>

This *Tour of Heroes* tutorial provides an introduction to the fundamentals of Angular and shows you how to:

这个*英雄之旅*教程介绍了 Angular 的基础知识，并向你展示了如何：

* Set up your local Angular development environment.

  建立本地 Angular 开发环境。

* Use the [Angular CLI](cli "CLI command reference") to develop an application

  使用 [Angular CLI](cli "CLI 命令参考")开发应用程序

The *Tour of Heroes* application that you build helps a staffing agency manage its stable of heroes.
The application has many of the features that you'd expect to find in any data-driven application.

你构建的*英雄之旅*应用程序帮助英雄管理局管理其英雄围栏。该应用程序具有你将在任何数据驱动的应用程序中找到的许多特性。

The finished application:

完成的应用程序：

* Gets a list of heroes

  获取英雄列表

* Displays the heroes in a list

  在列表中显示英雄

* Edits a selected hero's details

  编辑选定英雄的详情

* Navigates between different views of heroic data

  在英雄数据的不同视图之间导航

This tutorial helps you gain confidence that Angular can do whatever you need it to do by showing you how to:

本教程通过向你展示如何：

* Use Angular [directives](guide/glossary#directive "Directives definition") to show and hide elements and display lists of hero data.

  使用 Angular [指令](guide/glossary#directive "指令定义")来显示和隐藏元素，并显示英雄数据列表。

* Create Angular [components](guide/glossary#component "Components definition") to display hero details and show an array of heroes.

  创建 Angular [组件](guide/glossary#component "Components definition")来显示英雄的详情，并显示一个英雄数组。

* Use one-way [data binding](guide/glossary#data-binding "Data binding definition") for read-only data.

  为只读数据使用单向[数据绑定](guide/glossary#data-binding "Data binding definition")。

* Add editable fields to update a model with two-way data binding.

  添加可编辑字段，使用双向数据绑定来更新模型。

* Bind component methods to user events, like keystrokes and clicks.

  把组件中的方法绑定到用户事件上，比如按键和点击。

* Enable users to select a hero from a list and edit that hero in the details view.

  允许用户从列表中选择一个英雄，并在详情视图中编辑该英雄。

* Format data with [pipes](guide/glossary#pipe "Pipe definition").

  使用[管道](guide/glossary#pipe "Pipe definition")来格式化数据。

* Create a shared [service](guide/glossary#service "Service definition") to assemble the heroes.

  创建共享的[服务](guide/glossary#service "Service definition")来管理这些英雄。

* Use [routing](guide/glossary#router "Router definition") to navigate among different views and their components.

  使用[路由](guide/glossary#router "Router definition")在不同的视图及其组件之间导航。

<div class="callout is-helpful">

<header>Solution</header>

<header>解决方案</header>

After you complete all tutorial steps, the final application looks like this example.

在你完成了教程中的所有步骤之后，最终的应用应该是下面这样的。

<live-example name="toh-pt6"></live-example>.

</div>

## Design your new application

## 设计你的新应用程序

Here's an image of where this tutorial leads, showing the Dashboard view and the most heroic heroes:

这是本教程的最终效果图，显示了仪表盘视图和最有英雄气概的英雄：

<div class="lightbox">

<img alt="Output of heroes dashboard" src="generated/images/guide/toh/heroes-dashboard-1.png">

</div>

You can click the **Dashboard** and **Heroes** links in the dashboard to navigate between the views.

你可以单击仪表板中的**仪表盘**和**英雄**链接以在视图之间导航。

If you click the dashboard hero "Magneta," the router opens a "Hero Details" view where you can change the hero's name.

如果你单击仪表板英雄 “Magneta”，路由器就会打开一个“英雄详情”视图，你可以在其中更改英雄的名称。

<div class="lightbox">

<img alt="Details of hero in application" src="generated/images/guide/toh/hero-details-1.png">

</div>

Clicking the "Back" button returns you to the Dashboard.
Links at the top take you to either of the main views.
If you click "Heroes," the application displays the "Heroes" list view.

单击“后退”按钮可返回仪表板。顶部的链接会将你带到任一主要视图。如果单击 “Heroes”，应用程序就会显示 “Heroes” 列表视图。

<div class="lightbox">

<img alt="Output of heroes list application" src="generated/images/guide/toh/heroes-list-2.png">

</div>

When you click a different hero name, the read-only mini detail beneath the list reflects the new choice.

当你单击不同的英雄名称时，列表下方的只读迷你详情会反映出新的选择。

You can click the "View Details" button to drill into the editable details of the selected hero.

你可以点击“查看详情”按钮，深入了解所选英雄的可编辑详情。

The following diagram illustrates the navigation options.

下图说明了导航选项。

<div class="lightbox">

<img alt="View navigations" src="generated/images/guide/toh/nav-diagram.png">

</div>

Here's the application in action:

这是正在运行的应用程序：

<div class="lightbox">

<img alt="Tour of Heroes in Action" src="generated/images/guide/toh/toh-anim.gif">

</div>

@reviewed 2022-05-16

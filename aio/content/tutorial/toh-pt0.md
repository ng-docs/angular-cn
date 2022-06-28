# Create a new project

# 应用的外壳

You begin by creating an initial application using the Angular CLI.
Throughout this tutorial, you'll modify and extend that starter application to create the Tour of Heroes application.

首先，使用 Angular CLI 来创建最初的应用程序。在本教程中，你将修改并扩展这个入门级的应用程序，以创建出《英雄之旅》应用。

In this part of the tutorial, you'll do the following:

在教程的这个部分，你将完成下列工作：

1. Set up your environment.

   设置开发环境。

1. Create a new workspace and initial application project.

   创建新的工作区，并初始化应用项目。

1. Serve the application.

   启动开发服务器。

1. Make changes to the application.

   修改此应用。

<div class="alert is-helpful">

For the sample application that this page describes, see the <live-example></live-example>.

要查看本页所讲的范例程序，请参阅<live-example></live-example>。

</div>

## Set up your environment

## 搭建开发环境

To set up your development environment, follow the instructions in [Local Environment Setup](guide/setup-local "Setting up for Local Development").

要想搭建开发环境，请遵循[搭建本地环境](guide/setup-local "Setting up for Local Development")中的步骤进行操作。

## Create a new workspace and an initial application

## 创建新的工作区和一个初始应用

You develop applications in the context of an Angular [workspace](guide/glossary#workspace).
A workspace contains the files for one or more [projects](guide/glossary#project).
A project is the set of files that comprise an application or a library.
For this tutorial, you will create a new workspace.

Angular 的[工作区](guide/glossary#workspace)就是你开发应用所在的上下文环境。一个工作区包含一个或多个[项目](guide/glossary#project)所需的文件。每个项目都是一组由应用、库或端到端（e2e）测试组成的文件集合。在本教程中，你将创建一个新的工作区。

To create a new workspace and an initial application project:

要想创建一个新的工作区和一个初始应用项目，需要：

1. Ensure that you are not already in an Angular workspace folder.
   For example, if you have previously created the Getting Started workspace, change to the parent of that folder.

   确保你现在没有位于 Angular 工作区的文件夹中。比如，如果你之前已经创建过 "快速上手" 工作区，请回到其父目录中。

1. Run the CLI command `ng new` and provide the name `angular-tour-of-heroes`, as shown here:

   运行 CLI 命令 `ng new`，空间名请使用 `angular-tour-of-heroes`，如下所示：

   <code-example format="shell" language="shell">

   ng new angular-tour-of-heroes

   </code-example>

1. The `ng new` command prompts you for information about features to include in the initial application project.
   Accept the defaults by pressing the Enter or Return key.

   `ng new` 命令会提示你输入要在初始应用项目中包含哪些特性，请按 Enter 或 Return 键接受其默认值。

The Angular CLI installs the necessary Angular `npm` packages and other dependencies.
This can take a few minutes.

Angular CLI 会安装必要的 Angular `npm` 包和其它依赖项。这可能需要几分钟。

It also creates the following workspace and starter project files:

它还会创建下列工作区和初始项目的文件：

* A new workspace, with a root folder named `angular-tour-of-heroes`

  新的工作区，其根目录名叫 `angular-tour-of-heroes`。

* An initial skeleton app project in the `src/app` subfolder

  一个最初的骨架应用项目，位于 `src/app` 子目录下。

* Related configuration files

  相关的配置文件。

The initial app project contains a simple Welcome application, ready to run.

初始应用项目是一个简单的 "欢迎" 应用，随时可以运行它。

## Serve the application

## 启动应用服务器

Go to the workspace directory and launch the application.

进入工作区目录，并启动这个应用。

<code-example format="shell" language="shell">

cd angular-tour-of-heroes
ng serve --open

</code-example>

<div class="alert is-helpful">

The `ng serve` command builds the app, starts the development server,
watches the source files, and rebuilds the application as you make changes to those files.

`ng serve` 命令会构建本应用、启动开发服务器、监听源文件，并且当那些文件发生变化时重新构建本应用。

The `--open` flag opens a browser to `http://localhost:4200`.

`--open` 标志会打开浏览器，并访问 `http://localhost:4200/`。

</div>

You should see the application running in your browser.

你会发现本应用正运行在浏览器中。

## Angular components

## Angular 组件

The page you see is the *application shell*.
The shell is controlled by an Angular **component** named `AppComponent`.

你所看到的这个页面就是*应用的外壳*。这个外壳是被一个名叫 `AppComponent` 的 Angular 组件控制的。

*Components* are the fundamental building blocks of Angular applications.
They display data on the screen, listen for user input, and take action based on that input.

*组件*是 Angular 应用中的基本构造块。它们在屏幕上显示数据，监听用户输入，并且根据这些输入执行相应的动作。

## Make changes to the application

## 修改应用标题

Open the project in your favorite editor or IDE and navigate to the `src/app` folder to make some changes to the starter application.

用你最喜欢的编辑器或 IDE 打开这个项目，并访问 `src/app` 目录，来对这个起始应用做一些修改。

You'll find the implementation of the shell `AppComponent` distributed over three files:

你会在这里看到 `AppComponent` 壳的三个实现文件：

| Files | Details |
| :---- | :------ |
| 文件 | 详情 |
| `app.component.ts` | The component class code, written in TypeScript. |
| `app.component.ts` | 组件的类代码，这是用 TypeScript 写的。|
| `app.component.html` | The component template, written in HTML. |
| `app.component.html` | 组件的模板，这是用 HTML 写的。|
| `app.component.css` | The component's private CSS styles. |
| `app.component.css` | 组件的私有 CSS 样式。|

### Change the application title

### 更改应用标题

Open the component class file (`app.component.ts`) and change the value of the `title` property to 'Tour of Heroes'.

打开组件的类文件 (`app.component.ts`)，并把 `title` 属性的值修改为 'Tour of Heroes'（英雄之旅）。

<code-example header="app.component.ts (class title property)" path="toh-pt0/src/app/app.component.ts" region="set-title"></code-example>

Open the component template file (`app.component.html`) and delete the default template generated by the Angular CLI.
Replace it with the following line of HTML.

打开组件的模板文件 `app.component.html` 并清空 Angular CLI 自动生成的默认模板。改为下列 HTML 内容。

<code-example header="app.component.html (template)" path="toh-pt0/src/app/app.component.html"></code-example>

The double curly braces are Angular's *interpolation binding* syntax.
This interpolation binding presents the component's `title` property value inside the HTML header tag.

双花括号语法是 Angular 的*插值绑定*语法。这个插值绑定的意思是把组件的 `title` 属性的值绑定到 HTML 中的 `h1` 标记中。

The browser refreshes and displays the new application title.

浏览器自动刷新，并且显示出了新的应用标题。

<a id="app-wide-styles"></a>

### Add application styles

### 添加应用样式

Most apps strive for a consistent look across the application.
The CLI generated an empty `styles.css` for this purpose.
Put your application-wide styles there.

大多数应用都会努力让整个应用保持一致的外观。因此，CLI 会生成一个空白的 `styles.css` 文件。你可以把全应用级别的样式放进去。

Open `src/styles.css` and add the code below to the file.

打开 `src/styles.css` 并把下列代码添加到此文件中。

<code-example header="src/styles.css (excerpt)" path="toh-pt0/src/styles.1.css"></code-example>

## Final code review

## 查看最终代码

Here are the code files discussed on this page.

下面是本页所提到的源代码。

<code-tabs>
    <code-pane header="src/app/app.component.ts" path="toh-pt0/src/app/app.component.ts"></code-pane>
    <code-pane header="src/app/app.component.html" path="toh-pt0/src/app/app.component.html"></code-pane>
    <code-pane header="src/styles.css (excerpt)" path="toh-pt0/src/styles.1.css"></code-pane>
</code-tabs>

## Summary

## 小结

* You created the initial application structure using the Angular CLI

  你使用 Angular CLI 创建了初始的应用结构

* You learned that Angular components display data

  你学会了使用 Angular 组件来显示数据

* You used the double curly braces of interpolation to display the application title

  你使用双花括号插值显示了应用标题

@reviewed 2022-02-28
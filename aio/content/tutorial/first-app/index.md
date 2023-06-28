# Introduction to Angular tutorial - the First Angular app

# Angular 教程简介 - 第一个 Angular 应用程序

This tutorial consists of lessons that introduce the Angular concepts you need to know to start coding in Angular.

本教程包含介绍开始使用 Angular 编码所需了解的 Angular 概念的课程。

If you're just starting out with Angular, completing the lessons in sequence provides the best learning experience, because each lesson builds on the previous lessons.
After you're familiar with Angular, you can come back into any lesson for a refresher.

如果您刚刚开始使用 Angular，那么按顺序完成课程可提供最佳的学习体验，因为每节课都建立在前一课的基础上。
熟悉 Angular 后，您可以返回任何课程进行复习。

If you're more experienced, the lessons in this tutorial can be completed individually.
You can do as many or as few as you would like and you can do them in any order.

如果您更有经验，可以单独完成本教程中的课程。
您可以按照自己的意愿进行任意数量的操作，并且可以按任何顺序进行操作。

## Before you start

## 在你开始之前

For the best experience with this tutorial, review these requirements to make sure you have what you need to be successful.

为了获得本教程的最佳体验，请查看这些要求，以确保您具备成功所需的条件。

<!-- markdownLint-disable MD001 -->

### Your experience

### 您的经历

The lessons in this tutorial assume that you have done the following:

本教程中的课程假设您已完成以下操作：

1.  **Created an HTML web page by editing the HTML directly.**
        This tutorial makes references to HTML elements and the Document Object Model (DOM). If these terms are not familiar, review HTML programming before you start this tutorial.

1.  **通过直接编辑 HTML 创建 HTML 网页。**
        本教程引用了 HTML 元素和文档对象模型 (DOM)。如果这些术语不熟悉，请在开始本教程之前回顾一下 HTML 编程。

2.  **Programmed web site content in JavaScript.**
        This tutorial has many examples of TypeScript programming, which is based on JavaScript. TypeScript-specific feature are explained, but familiarity with JavaScript programming is necessary to understand the lessons in this tutorial.

2.  **用 JavaScript 编程的网站内容。**
        本教程有许多基于 JavaScript 的 TypeScript 编程示例。解释了 TypeScript 特定的功能，但要理解本教程中的课程，需要熟悉 JavaScript 编程。

3.  **Read Cascading Style Sheet (CSS) content and understand how selectors are used.**
        This tutorial does not require any CSS coding, but if these terms are not familiar, review CSS and selectors before you start this tutorial.

3. **阅读层叠样式表 (CSS) 内容并了解如何使用选择器。**
        本教程不需要任何 CSS 编码，但如果这些术语不熟悉，请在开始本教程之前查看 CSS 和选择器。

4.  **Used command-line instructions to perform tasks on your computer.**
        Angular uses the Angular CLI to perform many tasks. This tutorial provides the commands to use and assumes that you know how to open the command line tool or terminal interface in which to use them. If you aren't sure how to use a command line tool or terminal interface, review that before starting this tutorial.

4. **使用命令行指令在计算机上执行任务。**
        Angular 使用 Angular CLI 来执行许多任务。本教程提供了要使用的命令，并假设您知道如何打开命令行工具或终端界面来使用它们。如果您不确定如何使用命令行工具或终端界面，请在开始本教程之前查看。

### Your equipment

### 你的设备

These lessons can be completed by using a local installation of the Angular tools or by using StackBlitz in a web browser. Local Angular development can be completed on Windows, MacOS or Linux based systems.

这些课程可以通过使用本地安装的 Angular 工具或在 Web 浏览器中使用 StackBlitz 来完成。本地 Angular 开发可以在基于 Windows、MacOS 或 Linux 的系统上完成。

Working on your own computer has the advantage of being able to save your work locally for future reference. Working in StackBlitz allows you to work through the lessons without loading any software on your own computer.

在您自己的计算机上工作的优点是能够在本地保存您的工作以供将来参考。在 StackBlitz 中工作使您无需在自己的计算机上使用任何软件即可完成课程。

## Conceptual preview of your first Angular app

## 您的第一个 Angular 应用程序的概念预览

The lessons in this tutorial create a simple Angular app that lists houses for rent and show the details of individual houses.
This app uses features that are common to many Angular apps.

本教程中的课程创建了一个简单的 Angular 应用程序，其中列出了一些出租房屋并显示了各个房屋的详细信息。此应用程序使用许多 Angular 应用程序所共有的功能。

<section class="lightbox">
  <img alt="Output of heroes dashboard" src="generated/images/guide/faa/homes-app-landing-page.png">
</section>

## Development environment

## 开发环境

If you plan to complete this tutorial on your local computer, you must install the required software.
If you have already installed some of the required software, you must verify that it is the correct version.

如果您计划在本地计算机上完成本教程，则必须安装所需的软件。
如果您已经安装了某些必需的软件，则必须验证其版本是否正确。

Perform these steps in a command-line tool on the computer you want to use for this tutorial.

在要用于本教程的计算机上的命令行工具中执行这些步骤。

<section class="alert is-important">

**IMPORTANT:**
If you plan to use StackBlitz to do the lessons, you can proceed to the first lesson.
You don't need to install any software.

如果您计划使用 StackBlitz 来完成课程，您可以继续学习第一课。
您不需要安装任何软件。

</section>

### Step 1 - Identify the version of `node.js` that Angular requires

### 第 1 步 - 确定 Angular 所需的 `node.js` 版本
<section class="alert is-important">

**IMPORTANT:**
This step is only required if you have a version of node installed, otherwise, proceed to step 2 below.

仅当您安装了某个版本的节点时才需要执行此步骤，否则，请继续执行下面的步骤 2。

</section>

Angular requires an active LTS or maintenance LTS version of Node. Let's confirm your version of `node.js`. For information about specific version requirements, see the engines property in the [package.json file](https://unpkg.com/browse/@angular/core@15.1.5/package.json).

Angular 需要 Node.js 的活动 LTS 或维护 LTS 版本。让我们确认您的 `node.js` 版本。有关特定版本要求的信息，请参阅 [package.json 文件](https://unpkg.com/browse/@angular/core@15.1.5/package.json)中的engines 属性。

From a **Terminal** window:

从**终端**窗口：

1. Run the following command: `node --version`

1. 运行以下命令：`node --version`

2. Confirm that the version number displayed meets the requirements.

2. 确认显示的版本号符合要求。

### Step 2 - Install the correct version of `node.js` for Angular

### 第 2 步 - 安装适用于 Angular 的正确版本的 `node.js`

If you do not have a version of `node.js` installed, please follow the [directions for installation on nodejs.org](https://nodejs.org/en/download/)

如果您没有安装 `node.js` 版本，请按照 [nodejs.org 上的安装说明](https://nodejs.org/en/download/)进行操作


### Step 3 - Install the latest version of Angular

### 第 3 步 - 安装最新版本的 Angular

With `node.js` and `npm` installed, the next step is to install the [Angular CLI](/cli) which provides tooling for effective Angular development.

安装了 `node.js` 和 `npm` 后，下一步是安装 [Angular CLI](/cli)，它为有效的 Angular 开发提供了工具。

From a **Terminal** window:

从**终端**窗口：

1. Run the following command: `npm install -g @angular/cli`

1. 运行以下命令：`npm install -g @angular/cli`

2. Once the installation completes, the terminal window will display details of the Angular CLI version installed on your local computer.

2. 安装完成后，终端窗口将显示本地计算机上安装的 Angular CLI 版本的详细信息。

### Step 4 - Install integrated development environment (IDE)

### 第 4 步 - 安装集成开发环境 (IDE)

You are free to use any tool you prefer to build apps with Angular. We recommend the following:

您可以自由使用您喜欢的任何工具来通过 Angular 构建应用程序。我们建议如下：

1. [Visual Studio Code](https://code.visualstudio.com/)

1. [Visual Studio Code](https://code.visualstudio.com/)

2. As an optional, but recommended step you can further improve your developer experience by installing the [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)

2. 作为可选但推荐的步骤，您可以通过安装 [Angular 语言服务](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)来进一步改善开发人员体验 

## Lesson review

## 课程回顾

In this lesson, you learned about the app that you build in this tutorial and prepared your local computer to develop Angular apps.

在本课程中，您了解了在本教程中构建的应用程序，并准备好本地计算机来开发 Angular 应用程序。

## Next steps

## 下一步

[First Angular app lesson 1 - Hello world](tutorial/first-app/first-app-lesson-01)

[第一个 Angular 应用程序：课程 1 - Hello world](tutorial/first-app/first-app-lesson-01)

## More information

## 更多信息

For more information about the topics covered in this lesson, visit:

有关这节课中涵盖的主题的更多信息，请访问：

* [What is Angular](/guide/what-is-angular)

  [什么是 Angular](/guide/what-is-angular)

* [Angular CLI Reference](/cli)

  [Angular CLI 参考手册](/cli)

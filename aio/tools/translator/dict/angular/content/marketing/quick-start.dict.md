<h1 class="no-toc">Your first Angular app</h1>

<h1 class="no-toc">你的第一个 Angular 应用</h1>

A few lines of TypeScript are all it takes to create your first Angular app. As your app grows, you can separate the markup and code into different files.

只需几行 TypeScript 即可创建你的第一个 Angular 应用程序。随着应用程序的增长，你可以将标记和代码分离到不同的文件中。

Try your first Angular app

尝试你的第一个 Angular 应用程序

The code editor contains a complete Angular app.

此代码编辑器中包含一个完整的 Angular 应用程序。

<iframe src="https://stackblitz.com/github/angular/angular/tree/main/aio/content/demos/first-app?embed=1&file=src/main.ts&hideExplorer=1&hideNavigation=1" height="550" width="100%" style="border: solid 1px 777"></iframe>



The Angular app in the code editor shows the TypeScript that makes a simple, but complete, Angular component.
It imports resources from existing libraries and defines the properties of the new component.

此代码编辑器中的 Angular 应用程序显示了 TypeScript，它构成了一个简单但完整的 Angular 组件。它从现有库中导入资源并定义新组件的属性。

Explore further

进一步探索

See more about [Angular features](/features) or try the following exercises for some hands-on experience with Angular.

查看关于 [Angular 特性](/features)的更多信息，或尝试以下练习以获得 Angular 的一些实践经验。

Add features to your first Angular app

为你的第一个 Angular 应用程序添加功能

To give your component a reset button that sets the counter back to 0:

为你的组件提供一个重置按钮，将计数器设置回 0：

In the code editor, in the `template` value, after the line that starts with `<button (click)=`, add this line.

在代码编辑器中的 `template` 值中，在以 `<button (click)=` 开头的行之后添加此行。

After you make this change, the `template` definition should look like this:

进行此更改后，`template` 定义应如下所示：

Click **Add one** several times and then click **Reset**. The counter value should return to zero.

多次单击 **Add one**，然后单击 **Reset**。计数器值应返回零。

The new line adds a new `<button>` element. When the `click` event occurs in the button, the TypeScript code in the double quotes sets the `count` property to `0`.

新行添加了一个新的 `<button>` 元素。当按钮中发生 `click` 事件时，双引号中的 TypeScript 代码会将 `count` 属性设置为 `0`。

You can also add styles to your new component.

你还可以向新组件添加样式。

In the code editor, after the `selector` value and before the line that starts with `standalone`, add this code to give your buttons bold text and rounded corners.

在代码编辑器中，在 `selector` 值和 `standalone` 开头的行之间，添加此代码，为你的按钮提供粗体文本和圆角。

The buttons in your new Angular app should now have bold text and rounded corners.

你新建的 Angular 应用程序中的按钮现在应该有粗体文本和圆角。

Create a new Angular app from the command line

从命令行创建一个新的 Angular 应用程序

To create a new Angular app, perform these steps in a command-line tool on your local computer.

要创建新的 Angular 应用程序，请在本地计算机上的命令行工具中执行这些步骤。

Make sure you have the correct version of `node.js` and `npm` installed on your system.

确保你的系统上安装了正确版本的 `node.js` 和 `npm`。

Run this command to display the current version of npm.

运行此命令以显示 npm 的当前版本。

If you see a version number that's `8.5.0` or later, you're ready to create an Angular app.
For information about the supported versions of node and npm, see [Prerequisites](guide/setup-local#prerequisites).

如果你看到版本号为 `8.5.0` 或更高版本，就说明已准备好创建 Angular 应用程序了。有关受支持的 Node 和 npm 版本的信息，请参阅[先决条件](guide/setup-local#prerequisites)。

If you do not see such a version number, [update `node`][update-node] and try this step again before you continue.

如果你没有看到这样的版本号，[请更新 `node`][update-node] 并在继续之前重试此步骤。

Create a new Angular app.

创建一个新的 Angular 应用程序。

Create or navigate to the directory into which you want to create your Angular app.

创建或导航到要在其中创建 Angular 应用程序的目录。

Run this command to create your new Angular app.

运行此命令以创建新的 Angular 应用程序。

When prompted to make a choice, press **Enter** to accept the default option.
This creates a new Angular app in the `myApp` directory.

当提示做出选择时，按 **Enter** 接受默认选项。这会在 `myApp` 目录中创建一个新的 Angular 应用程序。

Run this command to navigate to the new directory.

运行此命令以导航到新目录。

Run this command to build your new app.

运行此命令来构建你的新应用程序。

When prompted to make a choice, press **Enter** to accept the default option.
Note the URL in the message displayed in the command-line tool for the next step.

当提示做出选择时，请按 **Enter** 接受默认选项。要记住在下一步命令行工具中显示的消息中的 URL。

Open a browser on the system with the new Angular app.

使用新的 Angular 应用程序在系统上打开浏览器。

In the browser's address bar, enter the URL in the message displayed in the command-line tool.
The default URL is `http://localhost:4200`.

在浏览器的地址栏中，输入命令行工具中显示的消息中的 URL。默认 URL 是 `http://localhost:4200`。

Your new Angular app displays its default landing page with the Angular logo. Review the tutorials in the following section for ideas about how to start changing your new app to make it your own.

新建的 Angular 应用程序会显示带有 Angular 徽标的默认登录页面。查看下一节中的教程，了解有关如何开始更改你的新应用程序以使其成为你自己的应用程序的想法。

Try more tutorials

尝试更多教程

For more demonstrations of Angular coding, visit:

有关 Angular 编码的更多演示，请访问：

[Introduction to Angular][intro-to-angular-video]
  A video tutorial about developing an Angular app. The Angular team produced this video for beginners to get *hands-on* with Angular. \(42-min\)

[Angular 简介][intro-to-angular-video]是关于开发 Angular 应用程序的视频教程。Angular 团队制作了这个视频，供初学者*亲身体验* Angular。（42 分钟）

[A basic shopping cart demo][shopping-cart]
  A basic app that demonstrates a few more Angular features. This demonstration takes you through the steps of building a simple app in a StackBlitz editor.

[一个基本的购物车演示][shopping-cart]是一个基本的应用程序，演示了更多的 Angular 特性。此演示将带你完成在 StackBlitz 编辑器中构建简单应用程序的步骤。

[A Tour of Heroes][toh-tutorial]
  A tutorial in which you create an Angular app from scratch with Angular development tools. You can develop this tutorial in an IDE on your own system or in a StackBlitz editor.

[英雄之旅][toh-tutorial]是一个教程，你可以在其中使用 Angular 开发工具从头开始创建 Angular 应用程序。你可以在自己系统上的 IDE 中或在 StackBlitz 编辑器中开发本教程。
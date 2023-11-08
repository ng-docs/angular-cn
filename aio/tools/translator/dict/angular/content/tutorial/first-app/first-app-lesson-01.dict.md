First Angular app lesson 1 - Hello world

第一个 Angular 应用程序：课程 1 - Hello world

This first lesson serves as the starting point from which each lesson in this tutorial adds new features to build a complete Angular app. In this lesson, we'll update the application to display the famous text, "Hello World".

以第一课作为起点，本教程中的每一课都会添加一些新功能以构建出完整的 Angular 应用程序。在这一课，我们将更新应用程序以显示著名的文本 “Hello World”。

**Time required:** expect to spend about 15 minutes to complete this lesson.

**所需时间：** 完成这节课预计需要 15 分钟左右。

Before you start

开始之前

This lesson starts from a pre-built app that will serve as a baseline for the application you'll be building in this tutorial. We've provided starter code so you can:

这节课从一个预构建的应用程序开始，它将作为你构建出应用程序的基线。我们提供了入门代码，因此你可以：

Start with the code example for the beginning of this lesson. Choose from the <live-example name="first-app-lesson-00"></live-example> to:

从这节课开头的代码示例开始。选择<live-example name="first-app-lesson-00"></live-example>，以便：

Use the *live example* in StackBlitz, where the StackBlitz interface is your IDE.

使用 StackBlitz 中的*在线例子*，其中 StackBlitz 的界面就是你的 IDE。

Use the *download example* and unzip it into a directory named: `first-app`. Open that directory in your IDE.

使用*下载示例*并将其解压缩到名为：`first-app` 目录中。在你的 IDE 中打开该目录。

If you haven't reviewed the introduction, visit the [tutorial overview page](tutorial/first-app) to make sure you have everything you need to complete this lesson.

如果你还没看过简介，请访问 [教程概述页面](tutorial/first-app)以确保你已具备完成这节课所需的一切知识。

If you have any trouble during this lesson, you can review the completed code for this lesson, in the <live-example></live-example> for this lesson.

如果你在这一课遇到任何问题，都可以查看这一课的完整代码，参见<live-example></live-example>。

After you finish

完成之后

The updated app you have after this lesson confirms that you and your IDE are ready to begin creating an Angular app.

在这节课后更新你的应用程序，以确认你本人以及你的 IDE 已经准备好了创建 Angular 应用程序。

Lesson steps

课程步骤

Perform these steps on the app code in your chosen IDE \(locally or using the StackBlitz\).

在你选择的 IDE（本地 IDE 或使用 StackBlitz）中对应用程序代码执行下列步骤。

Step 1 - Test the default app

第 1 步 - 测试默认应用

In this step, after you download the default starting app, you build the default Angular app.
This confirms that your development environment has what you need to continue the tutorial.

在此步骤中，当下载完默认启动的应用程序后，就可以开始构建默认的 Angular 应用程序了。这可以确保你的开发环境具有继续本教程所需的内容。

In the **Terminal** pane of your IDE:

在 IDE 的**终端**窗格中：

In your project directory, navigate to the `first-app` directory.

在你的项目目录中，导航到 `first-app` 目录。

Run this command to install the dependencies needed to run the app.

运行此命令以安装运行应用程序所需的依赖项。

Run this command to build and serve the default app.

运行此命令以构建和为默认应用程序启动开发服务器。

The app should build without errors.

该应用程序应该能没有任何错误地构建成功。

In a web browser on your development computer, open `http://localhost:4200`.

在开发机上的 Web 浏览器中，打开 `http://localhost:4200`。

Confirm that the default web site appears in the browser.

确认浏览器中出现了默认网站。

You can leave `ng serve` running for as you complete the next steps.

完成后续步骤后，你可以让 `ng serve` 继续运行。

Step 2 - Review the files in the project

第 2 步 - 查看项目中的文件

In this step, you get to know the files that make up a default Angular app.

在这一步中，你将认识那些构成默认 Angular 应用程序的文件。

In the **Explorer** pane of your IDE:

在 IDE 的**浏览**窗格中：

Open the `src` directory to see these files.

打开 `src` 目录可以看到这些文件。

In the file explorer, find the Angular app files \(`/src`\).

在文件资源管理器中，找到 Angular 应用程序文件（`/src`）。

`index.html` is the app's top level HTML template.

`index.html` 是应用程序的顶级 HTML 模板。

`style.css` is the app's top level style sheet.

`style.css` 是应用程序的顶级样式表。

`main.ts` is where the app start running.

`main.ts` 是应用程序开始运行的地方。

`favicon.ico` is the app's icon, just as you would find in web site.

`favicon.ico` 是应用程序的图标，就像你在网站上找到的一样。

In the file explorer, find the Angular app's component files \(`/app`\).

在文件资源管理器中，找到 Angular 应用程序的组件文件（`/app`）。

`app.component.ts` is the source file that describes the `app-root` component.
This is the top-level Angular component in the app. A component is the basic building block of an Angular application.
The component description includes the component's code, HTML template, and styles, which can be described in this file, or in separate files.

`app.component.ts` 是描述 `app-root` 组件的源文件。这是应用程序中的顶级 Angular 组件。组件是 Angular 应用程序的基本构建块。组件的描述包括组件的代码、HTML 模板和样式，可以在这个文件中描述，也可以在单独的文件中描述。

In this app, the styles are in a separate file while the component's code and HTML template are in this file.

在此应用程序中，样式位于单独的文件中，而组件的代码和 HTML 模板位于此文件中。

`app.component.css` is the style sheet for this component.

`app.component.css` 是这个组件的样式表。

New components are added to this directory.

新组件会添加到此目录中。

In the file explorer, find the image directory \(`/assets`\) contains images used by the app.

在文件资源管理器中，找到图像目录（`/assets`），其中包含应用程序要用到的图像。

In the file explorer, find the support files are files and directories that an Angular app needs to build and run, but they are not files that you normally interact with.

在文件资源管理器中，找到的支持文件是 Angular 在构建和运行时所需的文件和目录，但它们并不是你要经常打交道的文件。

`.angular` has files required to build the Angular app.

`.angular` 包含构建 Angular 应用程序时所需的文件。

`.e2e` has files used to test the app.

`.e2e` 包含用于测试应用程序的文件。

`.node_modules` has the node.js packages that the app uses.

`.node_modules` 包含应用程序使用的 node.js 包。

`angular.json` describes the Angular app to the app building tools.

`angular.json` 将向应用程序构建工具描述 Angular 应用程序。

`package.json` is used by `npm` \(the node package manager\) to run the finished app.

`package.json` 被 `npm`（Node 包管理器）用来运行已完成的应用程序。

`tsconfig.*` are the files that describe the app's configuration to the TypeScript compiler.

`tsconfig.*` 是向 TypeScript 编译器描述应用程序配置的文件。

After you have reviewed the files that make up an Angular app project, continue to the next step.

复查构成 Angular 应用程序项目的文件后，继续下一步。

Step 3 - Create `Hello World`

第 3 步 - 创建 `Hello World`

In this step, you update the Angular project files to change the displayed content.

在此步骤中，你将更新 Angular 项目文件以更改显示的内容。

In your IDE:

在你的 IDE 中：

Open `first-app/src/index.html`.

打开 `first-app/src/index.html`。

In `index.html`, replace the `<title>` element with this code to update the title of the app.

在 `index.html` 中，用此代码替换 `<title>` 元素以更新应用程序的标题。

Then, save the changes you just made to `index.html`.

然后，保存你刚刚对 `index.html` 所做的更改。

Next, open  `first-app/src/app/app.component.ts`.

接下来，打开 `first-app/src/app/app.component.ts`。

In `app.component.ts`, in the `@Component` definition, replace the `template` line with this code to change the text in the app component.

在 `app.component.ts` 的 `@Component` 定义中，将 `template` 行替换为如下代码以更改 app 组件中的文本。

In `app.component.ts`, in the `AppComponent` class definition, replace the `title` line with this code to change the component title.

在 `app.component.ts` 的 `AppComponent` 类定义中，用如下代码替换 `title` 行以更改组件标题。

Then, save the changes you made to `app.component.ts`.

然后，保存对 `app.component.ts` 所做的更改。

If you stopped the `ng serve` command from step 1, in the **Terminal** window of your IDE, run `ng serve` again.

如果你在第 1 步曾停止了 `ng serve` 命令，请在 IDE 的**终端**窗口中再次运行 `ng serve`。

Open your browser and navigate to `localhost:4200` and confirm that the app builds without error and displays *Hello world* in the title and body of your app:

打开你的浏览器并导航至 `localhost:4200` 并确认该应用程序构建无误并在应用程序的标题和正文中显示出了*Hello world*：

Lesson review

课程回顾

In this lesson, you updated a default Angular app to display *Hello world*.
In the process, you learned about the `ng serve` command to serve your app locally for testing.

在这一课，你更新了默认的 Angular 应用程序以显示 *Hello world*。在此过程中，你了解了 `ng serve` 命令以便在本地为应用程序启动开发服务器以进行测试。

If have any trouble with this lesson, review the completed code for it in the <live-example></live-example>.

如果对这节课有任何问题，请到<live-example></live-example>查看完整代码。

Next steps

下一步

[First Angular app lesson 2 - Creating Components](tutorial/first-app/first-app-lesson-02)

[第一个 Angular 应用程序：第 2 课 - 创建组件](tutorial/first-app/first-app-lesson-02)

More information

更多信息

For more information about the topics covered in this lesson, visit:

有关这节课中涵盖的主题的更多信息，请访问：

[Angular Components](/guide/component-overview)

[Angular 组件](/guide/component-overview)

[Creating applications with the Angular CLI](/cli)

[使用 Angular CLI 创建应用程序](/cli)
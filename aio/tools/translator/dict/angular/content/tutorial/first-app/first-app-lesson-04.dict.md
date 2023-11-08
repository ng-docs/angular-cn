First Angular app lesson 4 - Creating an interface

第一个 Angular 应用程序：第 4 课 - 创建接口

This tutorial lesson demonstrates how to create an interface and include it in a component of your app.

本教程的课程演示了如何创建接口并将其包含在应用程序的组件中。

**Time required:** expect to spend about 10 minutes to complete this lesson.

**所需时间：** 完成这节课预计需要 10 分钟左右。

Before you start

开始之前

This lesson starts with the code from the previous lesson, so you can:

这节课以上一课的代码为起点，因此你可以：

Use the code that you created in Lesson 3 in your integrated development environment \(IDE\).

在集成开发环境（IDE）中使用你在第 3 课中创建的代码。

Start with the code example from the previous lesson. Choose the <live-example name="first-app-lesson-03"></live-example> from Lesson 3 where you can:

从上一课的代码示例开始。选择<live-example name="first-app-lesson-03"></live-example>，以便：

Use the *live example* in StackBlitz, where the StackBlitz interface is your IDE.

使用 StackBlitz 中的*在线例子*，其中 StackBlitz 的界面就是你的 IDE。

Use the *download example* and open it in your IDE.

使用*下载示例*并在你的 IDE 中打开它。

If you haven't reviewed the introduction, visit the [Introduction to Angular tutorial](tutorial/first-app) to make sure you have everything you need to complete this lesson.

如果你还没看过简介，请访问 [Angular 教程简介](tutorial/first-app)以确保你已具备完成这节课所需的一切知识。

If you have any trouble during this lesson, you can review the completed code for this lesson, in the <live-example></live-example> for this lesson.

如果你在这节课中遇到任何问题，可以查看这节课的完整代码，参见<live-example></live-example>。

After you finish

完成之后

Your app has a new interface that it can use as a data type.

应用程序会有一个可以用作数据类型的新接口。

Your app has an instance of the new interface with sample data.

应用程序会有一个带有示例数据的新接口实例。

Conceptual preview of interfaces

接口的概念性预览

[Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html) are custom data types for your app.

[接口](https://www.typescriptlang.org/docs/handbook/interfaces.html)是应用程序的自定义数据类型。

Angular uses TypeScript to take advantage of working in a strongly typed programming environment.
Strong type checking reduces the likelihood of one element in your app sending incorrectly formatted data to another.
Such type-mismatch errors are caught by the TypeScript compiler and many such errors can also be caught in your IDE.

Angular 使用 TypeScript 来充分发挥在强类型编程环境中工作的优势。强类型检查降低了应用程序中的一个元素向另一个元素发送错误格式数据的可能性。这种类型不匹配错误会被 TypeScript 编译器捕获，许多此类错误也可以在你的 IDE 中捕获。

In this lesson, you'll create an interface to define properties that represent data about a single housing location.

在这一课中，你将创建一个接口来定义表示关于单个房屋位置的数据的属性。

Lesson steps

课程的步骤

Perform these steps on the app code in your IDE.

在 IDE 中对应用程序代码执行下列步骤。

Step 1 - Create a new Angular interface

第 1 步 - 创建一个新的 Angular 接口

This step creates a new interface in your app.

此步骤会在你的应用中创建一个新接口。

In the **Terminal** pane of your IDE:

在 IDE 的**终端**窗格中：

In your project directory, navigate to the `first-app` directory.

在项目目录中，导航到 `first-app` 目录。

In the `first-app` directory, run this command to create the new interface.

在 `first-app` 目录中，运行此命令以创建新接口。

Run `ng serve` to build the app and serve it to `http://localhost:4200`.

运行 `ng serve` 来构建应用程序并在 `http://localhost:4200` 上启动开发服务器。

In a browser, open `http://localhost:4200` to see your app.

在浏览器中，打开 `http://localhost:4200` 以查看应用程序。

Confirm that the app builds without error.
Correct any errors before you continue to the next step.

确保应用在构建时没有错误。在继续下一步之前更正所有错误。

Step 2 - Add properties to the new interface

第 2 步 - 将属性添加到新接口

This step adds the properties to the interface that your app needs to represent a housing location.

此步骤会将属性添加到应用程序用以代表房屋位置的接口中。

In the **Terminal** pane of your IDE, start the `ng serve` command, if it isn't already running, to build the app and serve it to `http://localhost:4200`.

在 IDE 的**终端**窗格中，启动 `ng serve` 命令（如果它尚未运行）以构建应用程序并用其在 `http://localhost:4200` 上启动开发服务器。

In the **Edit** pane of your IDE, open the `src/app/housinglocation.ts` file.

在 IDE 的**编辑**窗格中，打开 `src/app/housinglocation.ts` 文件。

In `housinglocation.ts`, replace the default content with the following code to make your new interface to match this example.

在 `housinglocation.ts` 中，将默认内容替换为以下代码，来让你的新接口与此示例一致。

Save your changes and confirm the app does not display any errors. Correct any errors before you continue to the next step.

保存你的更改并确认应用程序未显示任何错误。在继续下一步之前更正所有错误。

At this point, you've defined an interface that represents data about a housing location including an id, name, and location information.

此时，你已经定义了一个接口，该接口表示有关房屋位置的数据，包括 id、名称和位置信息。

Step 3 - Create a test house for your app

第 3 步 - 为你的应用创建测试用的房屋

You have an interface, but you aren't using it yet.

你有了一个接口，但还没有使用它。

In this step, you create an instance of the interface and assign some sample data to it.
You won't see this sample data appear in your app yet.
There are a few more lessons to complete before that happens.

在此步骤中，你将创建接口实例并为其赋值一些示例数据。但你仍然无法在应用程序中看到此示例数据。在那之前，还有另一些课程需要完成。

In the **Terminal** pane of your IDE, run the `ng serve` command, if it isn't already running, to build the app and serve your app to `http://localhost:4200`.

在 IDE 的**终端**窗格中，运行 `ng serve` 命令（如果它没在运行）以构建应用程序并在 `http://localhost:4200` 上用它提供服务。

In the **Edit** pane of your IDE, open `src/app/home/home.component.ts`.

在 IDE 的**编辑**窗格中，打开 `src/app/home/home.component.ts` 文件。

In `src/app/home/home.component.ts`, add this import statement after the existing `import` statements so that `HomeComponent` can use the new interface.

在 `src/app/home/home.component.ts` 中，在现有 `import` 语句之后添加此导入语句，以便 `HomeComponent` 可以使用新接口。

In `src/app/home/home.component.ts`, replace the empty `export class HomeComponent {}` definition with this code to create a single instance of the new interface in the component.

在 `src/app/home/home.component.ts` 中，用如下代码替换空定义 `export class HomeComponent {}`，以在组件中创建新接口的单个实例。

Confirm that your `home.component.ts` file matches like this example.

确认你的 `home.component.ts` 文件与此示例匹配。

By adding the `housingLocation` property of type `HousingLocation` to the `HomeComponent` class, we're able to confirm that the data matches the description of the interface. If the data didn't satisfy the description of the if the IDE has enough information to give us helpful errors.

通过将 `HousingLocation` 类型的 `housingLocation` 属性添加到 `HomeComponent` 类，我们能够确保数据与接口的描述相匹配。如果数据不满足接口描述，IDE 也有足够的信息为我们提供有用的错误描述。

Save your changes and confirm the app does not have any errors. Open the browser and confirm that your application still displays the message "housing-location works!"

保存你的更改并确认应用程序没有任何错误。打开浏览器并确认应用程序仍然能显示消息 “housing-location works!”

Correct any errors before you continue to the next step.

在继续下一步之前更正所有错误。

Lesson review

课程回顾

In this lesson, you created an interface that created a new data type for your app.
This new data type makes it possible for you to specify where `HousingLocation` data is required.
This new data type also makes it possible for your IDE and the TypeScript compiler can ensure that `HousingLocation` data is used where it's required.

在这一课中，你创建了一个为应用程序创建新数据类型的接口。这种新数据类型能让你指定哪里需要 `HousingLocation` 型数据。这个新的数据类型还能让 IDE 和 TypeScript 编译器可以确保在需要的地方确实使用了 `HousingLocation` 数据。

If you are having any trouble with this lesson, you can review the completed code for it in the <live-example></live-example>.

如果你在学习这节课时遇到了任何问题，可以到<live-example></live-example>查看完整代码。

Next steps

下一步

[Lesson 5 - Add an input parameter to the component](tutorial/first-app/first-app-lesson-05)

[第 5 课 - 向组件添加输入参数](tutorial/first-app/first-app-lesson-05)

More information

更多信息

For more information about the topics covered in this lesson, visit:

有关这节课中涵盖的主题的更多信息，请访问：

[ng generate interface](cli/generate#interface-command)



[ng generate](cli/generate)
First Angular app lesson 2 - Create Home component

第一个 Angular 应用程序：第 2 课 - 创建 Home 组件

This tutorial lesson demonstrates how to create a new [component](/guide/component-overview) for your Angular app.

本教程示范了如何为 Angular 应用程序创建新[组件](/guide/component-overview)。

**Time required:** expect to spend about 10 minutes to complete this lesson.

**所需时间：** 完成这节课预计需要 10 分钟左右。

Before you start

开始之前

This lesson starts with the code from the previous lesson, so you can:

这节课会以上一课的代码为起点，这样你就可以：

Use the code that you created in Lesson 1 in your integrated development environment \(IDE\).

在集成开发环境（IDE）中使用你在第 1 课中创建的代码。

Start with the code example from the previous lesson. Choose the <live-example name="first-app-lesson-01"></live-example> from Lesson 1 where you can:

从上一课的代码示例开始。选择<live-example name="first-app-lesson-01"></live-example>，以便：

Use the *live example* in StackBlitz, where the StackBlitz interface is your IDE.

使用 StackBlitz 中的*在线例子*，其中 StackBlitz 界面就是你的 IDE。

Use the *download example* and open it in your IDE.

使用*下载示例*并在你的 IDE 中打开它。

If you haven't reviewed the introduction, visit the [Introduction to Angular tutorial](tutorial/first-app) to make sure you have everything you need to complete this lesson.

如果你还没看过简介，请访问 [Angular 教程简介](tutorial/first-app)以确保你已具备完成这节课所需的一切知识。

If you have any trouble during this lesson, you can review the completed code for this lesson, in the <live-example></live-example> for this lesson.

如果你在这节课中遇到任何问题，可以查看这节课的完整代码，参见<live-example></live-example>。

After you finish

完成之后

Your app has a new component: `HomeComponent`.

应用程序有了一个新组件：`HomeComponent`。

Conceptual preview of Angular components

Angular 组件的概念性预览

Angular apps are built around components, which are Angular's building blocks.
Components contain the code, HTML layout, and CSS style information that provide the function and appearance of an element in the app.
In Angular, components can contain other components. An app's functions and appearance can divided and partitioned into components.

Angular 应用程序是围绕组件构建的，组件是 Angular 的基本构建块。组件包含为应用程序中的元素提供功能和外观的代码、HTML 布局和 CSS 样式信息。在 Angular 中，组件可以包含其他组件。应用程序的功能和外观可以拆分成一系列组件。

In [Lesson 1](tutorial/first-app/first-app-lesson-01), you updated the `AppComponent`, whose function is to contain all the other components.
In this lesson, you create a `HomeComponent` to display the home page of the app.
In later lessons, you create more components to provide more features to the app.

在[第 1 课](tutorial/first-app/first-app-lesson-01)中，你已更新了 `AppComponent`，其功能是作为所有其他组件的容器。在这节课中，你将创建一个 `HomeComponent` 来显示应用程序的首页。在后面的课程中，你将创建更多组件来为应用程序提供更多功能。

In Angular, components have metadata that define its properties.
When you create your `HomeComponent`, you use these properties:

在 Angular 中，组件具有一些用来定义其属性的元数据。当你创建 `HomeComponent` 时，会用到这些属性：

`selector`: to describe how Angular refers to the component in templates.

`selector`：描述了 Angular 要如何在模板中引用本组件。

`standalone`: to describe whether the component requires a `ngModule`.

`standalone`：描述组件是否需要 `ngModule`。

`imports`: to describe the component's dependencies.

`imports`：描述组件的依赖关系。

`template`: to describe the component's HTML markup and layout.

`template`：描述组件的 HTML 标记和布局。

`styleUrls`: to list the URLs of the CSS files that the component users in an array.

`styleUrls`：在数组中列出组件使用的 CSS 文件的 URL。

Components have other [properties](/api/core/Component), but these are the ones used by `HomeComponent`.

组件还有另一些[属性](/api/core/Component)，但 `HomeComponent` 中只会使用这些属性。

Lesson steps

课程步骤

Perform these steps on the app code in your IDE.

在 IDE 中对应用程序代码执行下列步骤。

Step 1 - Create the `HomeComponent`

第 1 步 - 创建 `HomeComponent`

In this step, you create a new component for your app.

在此步骤中，你将为应用程序创建一个新组件。

In the **Terminal** pane of your IDE:

在 IDE 的**终端**窗格中：

In your project directory, navigate to the `first-app` directory.

在你的项目目录中，导航到 `first-app` 目录。

Run this command to create a new `HomeComponent`

运行此命令以创建一个新的 `HomeComponent`

Run this command to build and serve your app.

运行此命令以构建和提供应用程序。

Open a browser and navigate to `http://localhost:4200` to find the application.

打开浏览器并导航到 `http://localhost:4200` 以找到该应用程序。

Confirm that the app builds without error.

确保应用在构建时没有错误。

*Note: It should render the same as it did in the previous lesson because even though you added a new component, you haven't included it in any of the app's templates, yet.*

*注意：它应该渲染出与上一课相同的效果，因为虽然你添加了一个新组件，却还没有将它包含在应用程序的任何模板中。*

Leave `ng serve` running as you complete the next steps.

在完成后续步骤时让 `ng serve` 保持运行。

Step 2 - Add the new component to your app's layout

第 2 步 - 将新组件添加到应用的布局中

In this step, you add the new component, `HomeComponent` to your app's root component, `AppComponent`, so that it displays in your app's layout.

在此步骤中，你要将新组件 `HomeComponent` 添加到应用的根组件 `AppComponent` 中，以便它能显示在应用的布局中。

In the **Edit** pane of your IDE:

在 IDE 的**编辑**窗格中：

Open `app.component.ts` in the editor.

在编辑器中打开 `app.component.ts`。

In `app.component.ts`, import `HomeComponent` by adding this line to the file level imports.

在 `app.component.ts` 中，通过将此行添加到文件顶部来导入 `HomeComponent`。

In `app.component.ts`, in `@Component`, update the `imports` array property and add `HomeComponent`.

在 `app.component.ts` 中的 `@Component` 中，更新数组属性 `imports` 以把 `HomeComponent` 添加到其中。

In `app.component.ts`, in `@Component`, update the `template` property to include the following HTML code.

在 `app.component.ts` 中的 `@Component` 中，更新 `template` 属性以包含以下 HTML 代码。

Save your changes to  `app.component.ts`.

保存对 `app.component.ts` 的更改。

If `ng serve` is running, the app should update.
If `ng serve` is not running, start it again.
*Hello world* in your app should change to *home works!* from the `HomeComponent`.

如果 `ng serve` 正在运行，应用程序应该更新。如果 `ng serve` 没有运行，请重新启动它。你应用中的*Hello world* 应该已改为来自 `HomeComponent` 的 *home works!*。

Check the running app in the browser and confirm that the app has been updated.

在浏览器中检查正在运行的应用程序并确认该应用程序已更新。

Step 3 - Add features to `HomeComponent`

第 3 步 - 向 `HomeComponent` 添加一些特性

In this step you add features to `HomeComponent`.

在此步骤中，你将向 `HomeComponent` 添加一些特性。

In the previous step, you added the default `HomeComponent` to your app's template so its default HTML appeared in the app.
In this step, you add a search filter and button that is used in a later lesson.
For now, that's all that `HomeComponent` has.
Note that, this step just adds the search elements to the layout without any function, yet.

在上一步中，你将默认的 `HomeComponent` 添加到了应用程序模板中，因此它的默认 HTML 会出现在应用程序中。在此步骤中，你将添加一个搜索过滤器和按钮，以供后面的课程中使用。目前，这就是 `HomeComponent` 全部内容。请注意，此步骤只是将搜索元素添加到了布局中，还没有实现任何功能。

In the `first-app` directory, open `home.component.ts` in the editor.

在 `first-app` 目录下，在编辑器中打开 `home.component.ts`。

In `home.component.ts`, in `@Component`, update the `template` property with this code.

在 `home.component.ts` 的 `@Component` 中，使用如下代码更新 `template` 属性。

Next, open `home.component.css` in the editor and update the content with these styles.

接下来，在编辑器中打开 `home.component.css` 并使用如下样式更新其内容。

Confirm that the app builds without error.
You should find the filter query box and button in your app and they should be styled.
Correct any errors before you continue to the next step.

确保应用在构建时没有错误。你应该能在应用程序中找到过滤器查询框和按钮，并且设置它们的样式。在继续下一步之前更正所有错误。

Lesson review

课程回顾

In this lesson, you created a new component for your app and gave it a filter edit control and button.

在这节课中，你为应用程序创建了一个新组件，并为其提供了过滤器编辑控件和按钮。

If you are having any trouble with this lesson, you can review the completed code for it in the <live-example></live-example>.

如果你在学习这节课时遇到任何问题，可以在<live-example></live-example>中查看完整代码。

Next steps

下一步

[First Angular app lesson 3 - Create the application’s HousingLocation component](tutorial/first-app/first-app-lesson-03)

[第一个 Angular 应用程序：第 3 课 - 创建应用程序的 HousingLocation 组件](tutorial/first-app/first-app-lesson-03)

More information

更多信息

For more information about the topics covered in this lesson, visit:

有关这节课中涵盖的主题的更多信息，请访问：

[`ng generate component`](cli/generate#component-command)



[`Component` reference](api/core/Component)

[`Component` 参考手册](api/core/Component)

[Angular components overview](guide/component-overview)

[Angular 组件概述](guide/component-overview)
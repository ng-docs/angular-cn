First Angular app lesson 3 - Create the application’s HousingLocation component

第一个 Angular 应用程序：第 3 课 - 创建应用程序的 HousingLocation 组件

This tutorial lesson demonstrates how to add the `HousingLocation` component to your Angular app.

本教程示范了如何将 `HousingLocation` 组件添加到 Angular 应用程序中。

**Time required:** expect to spend about 10 minutes to complete this lesson.

**所需时间：** 完成这节课预计需要 10 分钟左右。

Before you start

开始之前

This lesson starts with the code from the previous lesson, so you can:

这节课以上一课的代码为起点，你可以：

Use the code that you created in Lesson 2 in your integrated development environment \(IDE\).

在集成开发环境（IDE）中使用你在第 2 课中创建的代码。

Start with the code example from the previous lesson. Choose the <live-example name="first-app-lesson-02"></live-example> from Lesson 1 where you can:

从上一课的代码示例开始。选择<live-example name="first-app-lesson-02"></live-example>，以便：

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

Your app has a new component: `HousingLocationComponent` and it displays a message confirming that the component was added to your application.

应用程序有一个新组件：`HousingLocationComponent`，它会显示一条消息，以确认该组件成功添加到了应用程序中。

Lesson steps

课程步骤

Perform these steps on the app code in your IDE.

在 IDE 中对应用程序代码执行下列步骤。

Step 1 - Create the `HousingLocationComponent`

第 1 步 - 创建 `HousingLocationComponent`

In this step, you create a new component for your app.

在此步骤中，你将为应用程序创建一个新组件。

In the **Terminal** pane of your IDE:

在 IDE 的**终端**窗格中：

Run this command to create a new `HousingLocationComponent`

运行此命令以创建一个新的 `HousingLocationComponent`

Run this command to build and serve your app.

运行此命令以构建并启动应用开发服务器。

Open a browser and navigate to `http://localhost:4200` to find the application.

打开浏览器并导航到 `http://localhost:4200` 以找到该应用程序。

Confirm that the app builds without error.

确认应用构建时没有错误。

*Note: It should render the same as it did in the previous lesson because even though you added a new component, you haven't included it in any of the app's templates, yet.*

*注意：它应该渲染出与上一课相同的效果，因为即使你添加了一个新组件，但还没有把它包含在应用程序的任何模板中。*

Leave `ng serve` running as you complete the next steps.

在完成后续步骤时让 `ng serve` 保持运行。

Step 2 - Add the new component to your app's layout

第 2 步 - 将新组件添加到应用的布局中

In this step, you add the new component, `HousingLocationComponent` to your app's `HomeComponent`, so that it displays in your app's layout.

在此步骤中，你将新组件 `HousingLocationComponent` 添加到应用的 `HomeComponent` 中，以便让它显示在应用的布局中。

In the **Edit** pane of your IDE:

在 IDE 的**编辑**窗格中：

Open `home.component.ts` in the editor.

在编辑器中打开 `home.component.ts`。

In `home.component.ts`, import `HousingLocationComponent` by adding this line to the file level imports.

在 `home.component.ts` 中，通过将此行添加到文件顶部来导入 `HousingLocationComponent`。

Next update the `imports` property of the `@Component` metadata by adding `HousingLocationComponent` to the array.

接下来将 `HousingLocationComponent` 添加到 `@Component` 元数据的 `imports` 数组中。

Now the component is ready for use in the template for the `HomeComponent`. Update the `template` property of the `@Component` metadata to include a reference to the `<app-housing-location>` tag.

现在该组件已准备好在 `HomeComponent` 的模板中使用了。更新 `@Component` 元数据的 `template` 属性，以便包含对 `<app-housing-location>` 标记的引用。

Step 3 - Add the styles for the component

第 3 步 - 为组件添加样式

In this step, you will copy over the pre-written styles for the `HousingLocationComponent` to your app so that the app renders properly.

在此步骤中，你会将 `HousingLocationComponent` 的预写样式复制到应用程序中，以便应用程序能正确渲染。

Open `src/app/housing-location/housing-location.css`, and paste the styles below into the file:

打开 `src/app/housing-location/housing-location.css`，并将以下样式粘贴到文件中：

Save your code, return to the browser and confirm that the app builds without error. You should find the message "housing-location works!" rendered to the screen.Correct any errors before you continue to the next step.

保存你的代码，返回浏览器并确认应用程序构建没有错误。你应该看到屏幕上渲染出了消息 “housing-location works!”。在继续下一步之前更正所有错误。

Lesson review

课程回顾

In this lesson, you created a new component for your app and added it to the app's layout.

在这节课中，你为应用创建了一个新组件并将其添加到了应用的布局中。

If you are having any trouble with this lesson, you can review the completed code for it in the <live-example></live-example>.

如果你在学习这节课时遇到任何问题，可以在<live-example></live-example>查看完整代码。

Next steps

下一步

[First Angular app lesson 4 -  Add a housing location interface to the application](tutorial/first-app/first-app-lesson-04)

[第一个 Angular 应用程序：第 4 课 - 向应用程序添加房屋位置界面](tutorial/first-app/first-app-lesson-04)
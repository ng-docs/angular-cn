First Angular app lesson 12 - Adding a form to your Angular app

第 12 课 Angular 应用程序 - 向 Angular 应用程序中添加表单

This tutorial lesson demonstrates how to add a form that collects user data to an Angular app.
This lesson starts with a functional Angular app and shows how to add a form it.

本教程示范了如何将用以收集用户数据的表单添加到 Angular 应用程序。这节课从一个功能性的 Angular 应用程序开始，并展示了如何添加一个表单。

The data that the form collects is sent only to the app's service, which writes it to the browser's console.
Using a REST API to send and receive the form's data is not covered in this lesson.

表单收集的数据只会发送到应用程序的服务，后者会将其写入浏览器的控制台。这节课不涉及使用 REST API 发送和接收表单数据。

**Time required:** expect to spend about 20 minutes to complete this lesson.

**所需时间：** 完成这节课预计需要 20 分钟左右。

Before you start

开始之前

This lesson starts with the code from the previous lesson, so you can:

这节课以上一课的代码为起点，你可以：

Use the code that you created in Lesson 11 in your integrated development environment \(IDE\).

在集成开发环境（IDE）中使用你在第 11 课中创建的代码。

Start with the code example from the previous lesson. Choose the <live-example name="first-app-lesson-11"></live-example> from Lesson 11 where you can:

从上一课的代码示例开始。选择<live-example name="first-app-lesson-11"></live-example>，以便

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

Your app has a form into which users can enter data that is sent to your app's service.

应用程序有一个表单，用户可以在其中输入要发送给服务的数据。

The service writes the data from the form to the browser's console.

该服务将表单中的数据写入浏览器的控制台。

Lesson steps

课程步骤

Perform these steps on the app code in your IDE.

在 IDE 中对应用程序代码执行下列步骤。

Step 1 - Add a method to send form data

第 1 步 - 添加发送表单数据的方法

This step adds a method to your app's service that receives the form data to send to the data's destination.
In this example, the method writes the data from the form to the browser's console log.

此步骤会向服务中添加一个方法，该方法接收要发送到数据目的地的表单数据。在此示例中，该方法将表单中的数据写入浏览器的控制台日志。

In the **Edit** pane of your IDE:

在 IDE 的**编辑**窗格中：

In `src/app/housing.service.ts`, inside the `HousingService` class, paste this method at the bottom of the class definition.

在 `src/app/housing.service.ts` 的 `HousingService` 类中，将此方法粘贴到类定义的底部。

Confirm that the app builds without error.
Correct any errors before you continue to the next step.

确保应用在构建时没有错误。在继续下一步之前更正所有错误。

Step 2 - Add the form functions to the details page

第 2 步 - 将表单功能添加到详情页面

This step adds the code to the details page that handles the form interactions.

此步骤将代码添加到处理表单交互的详情页面。

In the **Edit** pane of your IDE, in `src/app/details/details.component.ts`:

在 IDE 的**编辑**窗格中，打开 `src/app/details/details.component.ts` 文件：

After the `import` statements at the top of the file, add the following code to import the Angular form classes.

在文件顶部的 `import` 语句之后，添加以下代码以导入 Angular 表单类。

In the `DetailsComponent` decorator metadata, update the `imports` property with the following code:

在 `DetailsComponent` 装饰器的元数据中，使用以下代码更新 `imports` 属性：

In the `DetailsComponent` class, before the `constructor()` method, add the following code to create the form object.

在 `DetailsComponent` 类中的 `constructor()` 方法之前，添加以下代码以创建表单对象。

In Angular, `FormGroup` and `FormControl` are types that enable you to build forms. The `FormControl` type can provide a default value and shape the form data. In this example `firstName` is a `string` and the default value is empty string.

在 Angular 中，`FormGroup` 和 `FormControl` 是能帮你构建出表单的类型。`FormControl` 类型可以提供默认值并塑造表单数据的形态。在此示例中，`firstName` 是一个 `string`，默认值为空字符串。

In the `DetailsComponent` class, after the `constructor()` method, add the following code to handle the **Apply now** click.

在 `DetailsComponent` 类中的 `constructor()` 方法之后，添加以下代码来处理 **Apply now** 的点击事件。

This button does not exist yet - you will add it in the next step. In the above code, the `FormControl`s may return `null`. This code uses the nullish coalescing operator to default to empty string if the value is `null`.

此按钮尚不存在 - 你将在下一步中添加它。在上面的代码中，`FormControl` 可能会返回 `null`。如果值为 `null`，此代码使用空值合并运算符 `??` 将其默认为空字符串。

Step 3 - Add the form's markup to the details page

第 3 步 - 将表单的标记添加到详情页面

This step adds the markup to the details page that displays the form.

此步骤将标记添加到显示表单的详情页面。

In the `DetailsComponent` decorator metadata, update the `template` HTML to match the following code to add the form's markup.

在 `DetailsComponent` 装饰器的元数据中，把 `template` 的 HTML 更新成如下代码，以添加表单的标记。

The template now includes an event handler `(submit)="submitApplication()"`. Angular uses parentheses syntax around the event name to create define events in the template code. The code on the right hand side of the equals sign is the code that should be executed when this event is triggered. You can bind to browser events and custom events.

该模板现在包含一个事件处理程序 `(submit)="submitApplication()"`。Angular 在事件名称周围使用圆括号语法来在模板代码中创建定义事件。等号右边的代码是当触发此事件时应执行的代码。你可以绑定到浏览器事件和自定义事件。

<section class="lightbox">
 <img alt="details page with a form for applying to live at this location" src="generated/images/guide/faa/homes-app-lesson-12-step-3.png">



</section>



Step 4 - Test your app's new form

第 4 步 - 测试应用的新表单

This step tests the new form to see that when the form data is submitted to the app, the form data appears in the console log.

此步骤会测试新表单，以查看当表单数据提交到应用程序时，表单数据会出现在控制台日志中。

In the **Terminal** pane of your IDE, run `ng serve`, if it isn't already running.

在 IDE 的**终端**窗格中，运行 `ng serve` （如果它尚未运行）。

In your browser, open your app at `http://localhost:4200`.

在你的浏览器中，通过 `http://localhost:4200` 打开应用程序。

In your app, right click in the app and from the context menu, choose **Inspect**.

在应用程序中，右键单击应用程序，然后从上下文菜单中选择 **Inspect**。

In the developer tools window, choose the **Console** tab.
Make sure that the developer tools window is visible for the next steps

在开发者工具窗口中，选择**控制台**选项卡。确保开发者工具窗口对后续步骤可见

In your app:

在应用程序中：

Select a housing location and click **Learn more**, to see details about the house.

选择房屋位置并单击**了解更多**，以查看有关房屋的详情。

In the house's details page, scroll to the bottom to find the new form.

在房屋的详情页面中，滚动到底部以找到新表格。

Enter data into the form's fields - any data is fine.

在表单的字段中输入数据 - 任何数据都可以。

Choose **Apply now** to submit the data.

选择**立即应用**以提交数据。

In the developer tools window, review the log output to find your form data.

在开发者工具窗口中，查看日志输出以找到你的表单数据。

Lesson review

课程回顾

In this lesson, you updated your app to:

在这节课中，你将应用更新为：

add a form using Angular's forms feature

使用 Angular 的表单功能添加表单

connect the data captured in the form to a form using an event handler

使用事件处理程序将表单中捕获的数据连接到表单

If you are having any trouble with this lesson, you can review the completed code for it in the <live-example></live-example>.

如果你在学习这节课时遇到了任何问题，可以在<live-example></live-example>查看完整代码。

Next steps

下一步

[Lesson 13 - Add the search feature to your application](tutorial/first-app/first-app-lesson-13)

[第 13 课 - 将搜索功能添加到应用程序](tutorial/first-app/first-app-lesson-13)

More information

更多信息

For more information about the topics covered in this lesson, visit:

有关这节课中涵盖的主题的更多信息，请访问：

[Angular Forms](/guide/forms)

[Angular 表单](/guide/forms)

[Event Handling](/guide/event-binding)

[事件处理](/guide/event-binding)
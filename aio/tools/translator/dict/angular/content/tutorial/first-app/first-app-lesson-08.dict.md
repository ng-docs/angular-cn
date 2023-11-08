Lesson 8 - Use \*ngFor to list objects in component

第 8 课 - 使用 \*ngFor 列出组件中的对象

This tutorial lesson demonstrates how to use `ngFor` directive in Angular templates in order to display dynamically repeat data data in a template.

本教程示范了如何在 Angular 模板中使用 `ngFor` 指令，以便在模板中动态显示出重复数据。

**Time required:** expect to spend about 10 minutes to complete this lesson.

**所需时间：** 完成这节课预计需要 10 分钟左右。

Before you start

开始之前

This lesson starts with the code from the previous lesson, so you can:

这节课以上一课的代码为起点，你可以：

Use the code that you created in Lesson 7 in your integrated development environment \(IDE\).

在集成开发环境（IDE）中使用你在第 7 课中创建的代码。

Start with the code example from the previous lesson. Choose the <live-example name="first-app-lesson-07"></live-example> from Lesson 7 where you can:

从上一课的代码示例开始。选择<live-example name="first-app-lesson-07"></live-example>，以便

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

You will have added a data set to the app

你将向应用程序添加一个数据集

Your app will display a list of elements from the new data set using `ngFor`

应用程序将使用 `ngFor` 显示新数据集中的元素列表

Conceptual preview of ngFor

ngFor 的概念性预览

In Angular, `ngFor` is a specific type of [directive](guide/built-in-directives) used to dynamically repeat data in a template. In plain JavaScript you would use a for loop - ngFor provides similar functionality for Angular templates. We use [Angular template syntax](guide/template-syntax) to specify the details for the directive.

在 Angular 中，`ngFor` 是一种特定类型的[指令](guide/built-in-directives)，用于动态重复模板中的数据。在纯 JavaScript 中，你会使用 for 循环 —— 而 ngFor 为 Angular 模板提供了类似的功能。我们使用[Angular 模板语法](guide/template-syntax)来指定指令的详细信息。

You can utilize `ngFor` to iterate over arrays and even asynchronous values. In this lesson, you'll add a new array of data to iterate over.

你可以利用 `ngFor` 来迭代数组甚至异步值。在这节课中，你将添加一个新的数据数组以进行迭代。

For a more in depth explanation, please refer to the [Built-in directives](guide/built-in-directives#ngFor) guide.

更深入的解释，请参阅[内置指令](guide/built-in-directives#ngFor)指南。

Lesson steps

课程步骤

Perform these steps on the app code in your IDE.

在 IDE 中对应用程序代码执行下列步骤。

Step 1 - Add housing data to the `HomeComponent`

第 1 步 - 将房屋数据添加到 `HomeComponent`

In the `HomeComponent` there is only a single housing location. In this step, you will add an array of `HousingLocation` entries.

在 `HomeComponent` 中只有一个房屋位置。在此步骤中，你将添加一组 `HousingLocation` 条目。

In `src/app/home/home.component.ts`, remove the `housingLocation` property from the `HomeComponent` class.

在 `src/app/home/home.component.ts` 中，从 `HomeComponent` 类删除 `housingLocation` 属性。

update the `HomeComponent` class to have a property called `housingLocationList`. Update your code to match the following code:

更新 `HomeComponent` 类，来让它具备名为 `housingLocationList` 的属性。更新你的代码以匹配以下代码：

Note: Do not remove the `@Component` decorator, you will update that code in an upcoming step.

注意：不要删除 `@Component` 装饰器，你将在接下来的步骤中更新该代码。

Step 2 - Update the `HomeComponent` template to use `ngFor`

第 2 步 - 更新 `HomeComponent` 模板以使用 `ngFor`

Now the app has a dataset that you can use to display the entries in the browser using the `ngFor` directive.

现在应用程序有一个数据集，你可以使用它来借助 `ngFor` 指令在浏览器中显示条目。

Update the `<app-housing-location>` tag in the template code to this:

将模板代码中的 `<app-housing-location>` 标签更新为：

Note, the code `[housingLocation] = "housingLocation"` the `housingLocation` value now refers to the variable used in the `ngFor` directive. Before this change, it refered to the property on the `HomeComponent` class.

注意，代码 `[housingLocation] = "housingLocation"` 中的 `housingLocation` 值现在指的是 `ngFor` 指令中使用的变量。在本次更改之前，它引用的是 `HomeComponent` 类上的属性。

Save all changes.

保存所有更改。

Refresh the browser and confirm that the app now renders a grid of housing locations.

刷新浏览器并确认应用程序现在渲染出了房屋位置网格。

Lesson review

课程回顾

In this lesson, you used the `ngFor` directive to repeat data dynamically in Angular templates. You also added a new array of data to be used in the Angular app. The application now dynamically renders a list of housing locations in the browser.

在这节课中，你使用 `ngFor` 指令在 Angular 模板中动态重复渲染数据。你还添加了要在 Angular 应用程序中使用的新数据数组。该应用程序现在在浏览器中动态渲染房屋位置列表。

The app is taking shape, great job.

该应用程序正在成形，干得好。

If you are having any trouble with this lesson, you can review the completed code for it in the <live-example></live-example>.

如果你在学习这节课时遇到了任何问题，可以在<live-example></live-example>查看完整代码。

Next steps

下一步

[Lesson 9 - Add a service to the application](tutorial/first-app/first-app-lesson-09)

[第 9 课 - 向应用程序添加服务](tutorial/first-app/first-app-lesson-09)

For more information about the topics covered in this lesson, visit:

有关这节课中涵盖的主题的更多信息，请访问：

[Structural Directives](/guide/structural-directives)

[结构型指令](/guide/structural-directives)

[ngFor guide](/guide/built-in-directives#ngFor)

[ngFor 指南](/guide/built-in-directives#ngFor)

[ngFor](/api/common/NgFor)
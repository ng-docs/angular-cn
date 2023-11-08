Lesson 13 - Add the search feature to your app

第 13 课 - 将搜索功能添加到应用程序中

This tutorial lesson demonstrates how to add a search functionality to your Angular app.

本教程示范了如何向 Angular 应用程序添加搜索功能。

The app will enable users to search through the data provided by your app and display only the results that match the entered term.

该应用程序将使用户能够搜索应用程序提供的数据，并且只显示与输入的字词匹配的结果。

**Time required:** expect to spend about 20 minutes to complete this lesson.

**所需时间：** 完成这节课预计需要 20 分钟左右。

Before you start

开始之前

This lesson starts with the code from the previous lesson, so you can:

这节课以上一课的代码为起点，你可以：

Use the code that you created in Lesson 12 in your integrated development environment \(IDE\).

在集成开发环境（IDE）中使用你在第 12 课中创建的代码。

Start with the code example from the previous lesson. Choose the <live-example name="first-app-lesson-12"></live-example> from Lesson 12 where you can:

从上一课的代码示例开始。选择<live-example name="first-app-lesson-12"></live-example>，以便

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

Your app will use data from a form to search for matching housing locations

应用程序将使用表单中的数据来搜索相匹配的房屋位置

Your app will display only the matching housing locations

应用程序将仅显示匹配的房屋位置

Lesson steps

课程步骤

Perform these steps on the app code in your IDE.

在 IDE 中对应用程序代码执行下列步骤。

Step 1 - Update the home component properties

第 1 步 - 更新 home 组件属性

In this step, you'll update the `HomeComponent` class to store data in a new array property that you will use for filtering.

在此步骤中，你将更新 `HomeComponent` 类以将数据存储在供过滤的新数组属性中。

In `src/app/home/home.component.ts`, add new property to the class called `filteredLocationList`.

在 `src/app/home/home.component.ts` 中，将新属性添加到名为 `filteredLocationList` 的类中。

The `filteredLocationList` hold the values that match the search criteria entered by the user.

`filteredLocationList` 持有与用户输入的搜索条件相匹配的值。

The `filteredLocationList` should contain the total set of housing locations values by default when the page loads. Update the `constructor` for the `HomeComponent` to set the value.

页面加载时，`filteredLocationList` 应默认包含所有房屋位置值。更新 `HomeComponent` 的 `constructor` 以设置值。

Step 2 - Update the home component template

第 2 步 - 更新 home 组件模板

The `HomeComponent` already contains an input field that you will use to capture input from the user. That string text will be used to filter the results.

`HomeComponent` 已经包含一个输入字段，你将使用它来捕获用户的输入。该字符串文本将用于过滤结果。

Update the `HomeComponent` template to include a template variable in the input called `#filter`.

更新 `HomeComponent` 模板以在名为 `#filter` 的输入中包含一个模板变量。

This example uses a [template variable](/guide/template-reference-variables) to get access to the input as its value.

此示例使用[模板变量](/guide/template-reference-variables)来访问输入框作为其值。

Next, update the component template to attach an event handler to the "search" button.

接下来，更新组件模板以将事件处理程序附加到“搜索”按钮上。

By binding to the click event on the button, you are able to call the `filterResults` function. The argument to the function is the `value` property of the `filter` template variable. Specifically, the `.value` property from the `input` HTML element.

通过绑定到按钮上的单击事件，你可以调用 `filterResults` 函数。该函数的参数是 `filter` 模板变量的 `value` 属性。具体来说，`input` HTML 元素中的 `.value` 属性。

The last template update is to the `ngFor` directive. Update the `ngFor` value to iterate over values from the `filteredLocationList` array.

最后的模板更新是针对 `ngFor` 指令的。更新 `ngFor` 值以迭代 `filteredLocationList` 数组中的值。

Step 3 - Implement the event handler function

第 3 步 - 实现事件处理函数

The template has been updated to bind the `filterResults` function to the `click` event. Next, your task is to implement the `filterResults` function in the `HomeComponent` class.

模板已更新为将 `filterResults` 函数绑定到 `click` 事件。接下来，你的任务是在 `HomeComponent` 类中实现 `filterResults` 函数。

Update the `HomeComponent` class to include the implementation of the `filterResults` function.

更新 `HomeComponent` 类以包含 `filterResults` 函数的实现。

This function uses the `String` filter function to compare the value of the `text` parameter against the `housingLocation.city` property. You can update this function to match against any property or multiple properties for a fun exercise.

此函数使用 `String` 过滤器函数将 `text` 参数的值与 `housingLocation.city` 属性进行比较。你可以更新此函数以匹配任何属性或多个属性以进行有趣的练习。

Save your code.

保存你的代码。

Refresh the browser and confirm that you can search the housing location data by city when you click the "Search" button after entering text.

刷新浏览器，输入文字后点击“搜索”按钮，确认这样可以按城市搜索房源位置数据。

Lesson review

课程回顾

In this lesson, you updated your app to:

在这节课中，你将应用更新为：

use template variables to interact with template values

使用模板变量与模板值交互

add search functionality using event binding and array functions

使用事件绑定和数组函数来添加搜索功能

If you are having any trouble with this lesson, you can review the completed code for it in the <live-example></live-example>.

如果你在学习这节课时遇到了任何问题，可以在<live-example></live-example>查看完整代码。

Next steps

下一步

[Lesson 14 - Add HTTP communication to your app](tutorial/first-app/first-app-lesson-14)

[第 14 课 - 为应用程序添加 HTTP 通信](tutorial/first-app/first-app-lesson-14)

More information

更多信息

For more information about the topics covered in this lesson, visit:

有关这节课中涵盖的主题的更多信息，请访问：

[Template Variables](/guide/template-reference-variables)

[模板变量](/guide/template-reference-variables)

[Event Handling](/guide/event-binding)

[事件处理](/guide/event-binding)
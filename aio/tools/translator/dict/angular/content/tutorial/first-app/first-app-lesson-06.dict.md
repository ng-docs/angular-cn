Lesson 6 - Add a property binding to a component’s template

第 6 课 - 将属性绑定添加到组件的模板中

This tutorial lesson demonstrates how to add property binding to a template and use it to pass dynamic data to components.

这节课演示了如何将属性绑定添加到模板中并通过它将动态数据传给组件。

**Time required:** expect to spend about 5 minutes to complete this lesson.

**所需时间：** 完成这节课预计需要 5 分钟左右。

Before you start

开始之前

This lesson starts with the code from the previous lesson, so you can:

这节课以上一课的代码为起点，你可以：

Use the code that you created in Lesson 5 in your integrated development environment \(IDE\).

在集成开发环境（IDE）中使用你在第 5 课中创建的代码。

Start with the code example from the previous lesson. Choose the <live-example name="first-app-lesson-05"></live-example> from Lesson 5 where you can:

从上一课的代码示例开始。选择<live-example name="first-app-lesson-05"></live-example>，以便：

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

Your app has data bindings in the `HomeComponent` template.

应用程序在 `HomeComponent` 模板中具有一些数据绑定。

Your app sends data from the `HomeComponent` to the `HousingLocationComponent`.

应用程序将数据从 `HomeComponent` 发送到 `HousingLocationComponent`。

Conceptual preview of Inputs

输入属性的概念性预览

In lesson 5, you added `@Input` decorators to properties in the `HousingLocationComponent` allow the component to receive data. In this lesson, you'll continue the process of sharing data from the parent component to the child component by binding data to those properties in the template. There are several forms of data binding in Angular, in this lesson you'll use property binding.

在第 5 课中，你将 `@Input` 装饰器添加到 `HousingLocationComponent` 中的属性上，以允许组件接收数据。在这节课中，你将通过将数据绑定到模板中的那些属性来从父组件向子组件共享数据。Angular 中有多种形式的数据绑定，在这节课中，你将使用属性绑定。

Property binding enables you to connect a variable to an `Input` in an Angular template. The data is then dynamically bound to the `Input`.

属性绑定能让你将变量连接到 Angular 模板中的 `Input` 属性。然后把数据动态绑定到此 `Input`。

For a more in depth explanation, please refer to the [Property binding](guide/property-binding) guide.

更深入的解释，请参阅[属性绑定](guide/property-binding)指南。

Lesson steps

课程步骤

Perform these steps on the app code in your IDE.

在 IDE 中对应用程序代码执行下列步骤。

Step 1 - Update <app-housing-location> tag in the `HomeComponent` template

第 1 步 - 更新 `HomeComponent` 模板中的 `<app-housing-location>` 标记

This step adds property binding to the `<app-housing-location>` tag.

此步骤将属性绑定添加到 `<app-housing-location>` 标记上。

In the code editor:

在代码编辑器中：

Navigate to `src/app/home/home.component.ts`

导航到 `src/app/home/home.component.ts`

In the template property of the `@Component` decorator, update the code to match the code below:

在 `@Component` 装饰器的模板属性中，把代码更新成这样：

When adding a property binding to a component tag, we use the `[attribute] = "value"` syntax to notify Angular that the assigned value should be treated as a property from the component class and not a string value.

当向组件标签添加属性绑定时，我们使用 `[attribute] = "value"` 语法来通知 Angular 所赋的值应该视为来自组件类的属性，而不是字符串值。

The value on the right handside is the name of the property from the `HomeComponent`.

右侧的值是 `HomeComponent` 中的属性名称。

Step 2 - Confirm the code still works

第 2 步 - 确认代码仍然能工作

Save your changes and confirm the app does not have any errors.

保存你的更改并确认应用程序没有任何错误。

Correct any errors before you continue to the next step.

在继续下一步之前更正所有错误。

Lesson review

课程回顾

In this lesson, you added a new property binding and passed in a reference to a class property. Now, the `HousingLocationComponent` has access to data that it can use to customize the component's display.

在这节课中，你添加了一个新的属性绑定，并传入了对类属性的引用。现在，`HousingLocationComponent` 就能访问可用来在自定义组件中显示的数据了。

If you are having any trouble with this lesson, you can review the completed code for it in the <live-example></live-example>.

如果你在学习这节课时遇到了任何问题，可以在<live-example></live-example>查看完整代码。

Next steps

下一步

[Lesson 7 - Add an interpolation to a component’s template](tutorial/first-app/first-app-lesson-07)

[第 7 课 - 向组件模板添加插值](tutorial/first-app/first-app-lesson-07)

For more information about the topics covered in this lesson, visit:

有关这节课中涵盖的主题的更多信息，请访问：

[Property binding](guide/property-binding)

[属性绑定](guide/property-binding)
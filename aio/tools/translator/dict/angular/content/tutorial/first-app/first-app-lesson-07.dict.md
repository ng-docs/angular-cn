Lesson 7 - Add an interpolation to a component’s template

第 7 课 - 向组件模板中添加插值

This tutorial lesson demonstrates how to add interpolation to Angular templates in order to display dynamic data in a template.

本教程示范了如何向 Angular 模板中添加插值，以便在模板中显示动态数据。

**Time required:** expect to spend about 10 minutes to complete this lesson.

**所需时间：** 完成这节课预计需要 10 分钟左右。

Before you start

开始之前

This lesson starts with the code from the previous lesson, so you can:

这节课以上一课的代码为起点，你可以：

Use the code that you created in Lesson 6 in your integrated development environment \(IDE\).

在集成开发环境（IDE）中使用你在第 6 课中创建的代码。

Start with the code example from the previous lesson. Choose the <live-example name="first-app-lesson-06"></live-example> from Lesson 6 where you can:

从上一课的代码示例开始。选择<live-example name="first-app-lesson-06"></live-example>，以便

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

Your app will display interpolated values in the `HousingLocationComponent` template.

应用程序将在 `HousingLocationComponent` 模板中显示插值。

Your app will render a housing location data to the browser.

应用程序将向浏览器渲染出房屋位置数据。

Conceptual preview of interpolation

插值的概念性预览

In lesson 6, you added data binding to the template to enable developers to pass data from the `HomeComponent` to the `HousingLocationComponent`. The next step is to display values \(properties and `Input` values\) in a template. In order to accomplish this task you have to use interpolation.

在第 6 课中，你向模板添加了数据绑定，使开发者能够将数据从 `HomeComponent` 传给 `HousingLocationComponent`。下一步就是在模板中显示值（包括属性和 `Input` 值）。为了完成此任务，你必须使用插值。

The [Angular template syntax](guide/template-syntax) supports mixing static template content with dynamic values and expressions.

[Angular 模板语法](guide/template-syntax)支持将静态模板内容与动态值和表达式混用。

Using the `{{ expression }}` in Angular templates, you can render values from properties, `Inputs` and valid JavaScript expressions.

在 Angular 模板中使用 `{{ expression }}`，可以从属性、`Input` 和有效的 JavaScript 表达式中渲染出值。

For a more in depth explanation, please refer to the [Displaying values with interpolation](guide/interpolation) guide.

更深入的解释，请参阅[使用插值显示值](guide/interpolation)指南。

Lesson steps

课程步骤

Perform these steps on the app code in your IDE.

在 IDE 中对应用程序代码执行下列步骤。

Step 1 - Update `HousingLocationComponent` template to include interpolated values

第 1 步 - 更新 `HousingLocationComponent` 模板以包含插值

This step adds new HTML structure and interpolated values in the `HousingLocationComponent` template.

此步骤在 `HousingLocationComponent` 模板中添加新的 HTML 结构和插值。

In the code editor:

在代码编辑器中：

Navigate to `src/app/housing-location/housing-location.component.ts`

导航到 `src/app/housing-location/housing-location.component.ts`

In the template property of the `@Component` decorator, replace the existing HTML markup with the following code:

在 `@Component` 装饰器的 `template` 属性中，将现有的 HTML 标记替换为以下代码：

In this updated template code you have used property binding to bind the `housingLocation.photo` to the `src` attribute. The `alt` attribute uses interpolation to give more context to the alt text of the image.

在此更新过的模板代码中，你已使用属性绑定将 `housingLocation.photo` 绑定到 `src` 属性。而 `alt` 属性通过插值为图像的替代文本提供更多上下文。

You use interpolation to include the values for name, city and state of the `housingLocation` property.

你使用插值来包含 `housingLocation` 属性的名称（name）、城市（city）和州（state）的值。

Step 2 - Confirm the changes render in the browser

第 2 步 - 确认在浏览器中渲染出的更改

Save all changes.

保存所有更改。

Open the browser can confirm that the app renders the photo, city and state sample data.

打开浏览器可以确认应用程序渲染了照片、城市和州的样本数据。

Lesson review

课程回顾

In this lesson, you added a new HTML structure and used Angular template syntax to render values in the `HousingLocation` template. Now, you have two important skills:

在这节课中，你添加了一个新的 HTML 结构并使用 Angular 模板语法在 `HousingLocation` 模板中渲染出了值。现在，你有了两个重要的技能：

passing data to components

将数据传给组件

Interpolating values into a template

将值插入模板

With these skills, your app can now share data and display dynamic values in the browser. Great work so far.

有了这些技能，应用程序现在就可以共享数据并在浏览器中显示动态值。到目前为止这工作得很好。

If you are having any trouble with this lesson, you can review the completed code for it in the <live-example></live-example>.

如果你在学习这节课时遇到了任何问题，可以在<live-example></live-example>查看完整代码。

Next steps

下一步

[Lesson 8 - Use \*ngFor to list objects in component](tutorial/first-app/first-app-lesson-08)

[第 8 课 - 使用 \*ngFor 列出组件中的对象](tutorial/first-app/first-app-lesson-08)

For more information about the topics covered in this lesson, visit:

有关这节课中涵盖的主题的更多信息，请访问：

[Displaying values with interpolation](/guide/interpolation)

[显示带插值的值](/guide/interpolation)

[Template syntax](guide/template-syntax)

[模板语法](guide/template-syntax)
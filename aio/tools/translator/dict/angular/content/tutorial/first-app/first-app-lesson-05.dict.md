Lesson 5 - Add an input parameter to the component

第 5 课 - 向组件添加输入参数

This tutorial lesson demonstrates how to create a component `@Input()`, use it to pass data to a component for customization.

本课程示范了如何创建组件的 `@Input()`，通过它将数据传给组件以便自定义组件。

**Time required:** expect to spend about 10 minutes to complete this lesson.

**所需时间：** 完成这节课预计需要 10 分钟左右。

Before you start

开始之前

This lesson starts with the code from the previous lesson, so you can:

这节课以上一课的代码为起点，因此你可以：

Use the code that you created in Lesson 4 in your integrated development environment \(IDE\).

在集成开发环境（IDE）中使用你在第 4 课中创建的代码。

Start with the code example from the previous lesson. Choose the <live-example name="first-app-lesson-04"></live-example> from Lesson 4 where you can:

从上一课的代码示例开始。选择<live-example name="first-app-lesson-04"></live-example>，以便：

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

应用程序有了一个可以用作数据类型的新接口。

Your app has an instance of the new interface with sample data.

应用程序有了一个带有示例数据的新接口实例。

Conceptual preview of Inputs

输入属性的概念性预览

[Inputs](api/core/Input) allow components to share data. The direction of the data sharing is from parent component to child component.

[输入属性](api/core/Input)允许组件共享数据。数据共享的方向是从父组件到子组件。

To receive data from a parent component, a child component must mark a class property with the `@Input()` decorator. This decorator can be used in components and directives.

要从父组件接收数据，子组件必须使用 `@Input()` 装饰器标记出类属性。这个装饰器可以用在组件和指令中。

For a more in depth explanation, please refer to the [Sharing data between child and parent directives and components](guide/inputs-outputs) guide.

更深入的解释，请参阅[子指令与父指令和组件之间共享数据](guide/inputs-outputs)指南。

In this lesson, you'll define `@Input()` properties in the `HousingLocationComponent` component which will enable you to customize the data displayed in the component.

在这节课中，你将在 `HousingLocationComponent` 组件中定义 `@Input()` 属性，这能让你自定义要在组件中显示的数据。

Lesson steps

课程步骤

Perform these steps on the app code in your IDE.

在 IDE 中对应用程序代码执行下列步骤。

Step 1 - Import the Input decorator

第 1 步 - 导入 `Input` 装饰器

This step imports the `Input` decorator into the class.

此步骤将 `Input` 装饰器导入到类中。

In the code editor:

在代码编辑器中：

Navigate to `src/app/housing-location/housing-location.component.ts`

导航到 `src/app/housing-location/housing-location.component.ts`

Update the file imports to include `Input` and `HousingLocation`:

更新文件的导入代码以包含 `Input` 和 `HousingLocation`：

Step 2 - Add the Input property

第 2 步 - 添加输入属性

In the same file, add a property called `housingLocation` of type `HousingLocation` to the `HousingLocationComponent` class. Add an `!` after the property name and prefix it with the `@Input()` decorator:

在同一个文件中，名为 `housingLocation` 的 `HousingLocation` 型属性添加到 `HousingLocationComponent` 类。在属性名之后添加一个 `!` 并在它前面加上 `@Input()` 装饰器：

You have to add the `!` because the input is expecting the value to be passed. In this case, there is no default value. In our example application case we know that the value will be passed in - this is by design. The exclamation point is called the non-null assertion operator and it tells the TypeScript compiler that the value of this property won't be null or undefined.

你必须加上 `!`，是因为这个输入属性期望有传入值。在这种情况下，没有合适的默认值。在这个示例应用程序中，我们就知道必须传入该值 —— 设计意图就是如此。感叹号称为非空断言运算符，它告诉 TypeScript 编译器此属性的值不能是 `null` 或 `undefined`。

Save your changes and confirm the app does not have any errors.

保存你的更改并确认应用程序没有任何错误。

Correct any errors before you continue to the next step.

在继续下一步之前更正所有错误。

Lesson review

课程回顾

In this lesson, you created a new property decorated with the `@Input()` decorator. You also used the non-null assertion operator to notify the compiler that the value of the new property won't be `null` or `undefined`.

在这节课中，你创建了一个用 `@Input()` 装饰器装饰的新属性。还使用了非空断言运算符来通知编译器新属性的值不能是 `null` 或 `undefined`。

If you are having any trouble with this lesson, you can review the completed code for it in the <live-example></live-example>.

如果你在学习这节课时遇到任何问题，可以在<live-example></live-example>中查看完整的代码。

Next steps

下一步

[Lesson 6 - Add a property binding to an component’s template](tutorial/first-app/first-app-lesson-06)

[第 6 课 - 将属性绑定添加到组件的模板中](tutorial/first-app/first-app-lesson-06)

For more information about the topics covered in this lesson, visit:

有关这节课中涵盖的主题的更多信息，请访问：

[Sharing data between child and parent directives and components](guide/inputs-outputs)

[在子指令与父指令和组件之间共享数据](guide/inputs-outputs)
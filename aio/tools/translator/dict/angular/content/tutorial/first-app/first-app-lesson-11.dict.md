Lesson 11 - Integrate details page into application

第 11 课 - 将详情页面集成到应用程序中

This tutorial lesson demonstrates how to connect the details page to your app.

本课程示范了如何将详情页面连接到应用程序中。

**Time required:** expect to spend about 20 minutes to complete this lesson.

**所需时间：** 完成这节课预计需要 20 分钟左右。

Before you start

开始之前

This lesson starts with the code from the previous lesson, so you can:

这节课以上一课的代码为起点，你可以：

Use the code that you created in Lesson 10 in your integrated development environment \(IDE\).

在集成开发环境（IDE）中使用你在第 10 课中创建的代码。

Start with the code example from the previous lesson. Choose the <live-example name="first-app-lesson-10"></live-example> from Lesson 10 where you can:

从上一课的代码示例开始。选择<live-example name="first-app-lesson-10"></live-example>，以便

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

At the end of this lesson your application will have support for routing to the details page.

当这节课结束时，应用程序将支持路由到详情页面。

Conceptual preview of routing with route parameters

带参数路由的概念性预览

In the previous lesson, you added routing to your app and in this lesson you will expand the types of routing your app supports. Each housing location has specific details that should be displayed when a user navigates to the details page for that item. To accomplish this goal, you will need to use route parameters.

在上一课中，你向应用添加了路由，在这节课中，你将扩展应用支持的路由类型。每个房屋位置都有自己的详情，当用户导航到该条目的详情页面时应显示这些详情。要实现此目标，就要使用路由参数。

Route parameters enable you to include dynamic information as a part of your route URL. To identify which housing location a user has clicked on you will use the `id` property of the `HousingLocation` type.

路由参数使你能够将动态信息作为路由 URL 的一部分。要确定用户点击了哪个房屋位置，你要使用 `HousingLocation` 类型的 `id` 属性。

Lesson steps

课程步骤

Perform these steps on the app code in your IDE.

在 IDE 中对应用程序代码执行下列步骤。

Step 1 - Create a new service for your app

第 1 步 - 为你的应用创建新服务

In lesson 10, you added a second route to `src/app/routes.ts`, this route includes a special segment that identifies the route parameter, `id`:

在第 10 课中，你向 `src/app/routes.ts` 添加了第二条路由，该路由包含一个特殊区段，用于标识路由参数 `id`：

<code-example format="javascript" language="javascript">
    'details/:id'
    </code-example>



In this case, `:id` is dynamic and will change based on how the route is requested by the code.

在这种情况下，`:id` 是动态的，并且会根据代码请求路由的方式而变化。

In `src/app/housing-location/housing-location.component.ts`, add an anchor tag to the `section` element and include the `routerLink` directive:

在 `src/app/housing-location/housing-location.component.ts` 中，将锚点标记（`<a>`）添加到 `section` 元素并包含 `routerLink` 指令：

The `routerLink` directive enables Angular's router to create dynamic links in the application. The value assigned to the `routerLink` is an array with two entries: the static portion of the path and the dynamic data.

`routerLink` 指令使 Angular 的路由器能够在应用程序中创建动态链接。赋值给 `routerLink` 的值是一个包含两个条目的数组：路径的静态部分和动态数据。

At this point you can confirm that the routing is working in your app. In the browser, refresh the home page and click the "learn more" button for a housing location.

此时你可以确认路由在应用程序中能正常工作。在浏览器中，刷新主页并单击房屋位置的“了解更多”按钮。

Step 2 - Get route parameters

第 2 步 - 获取路由参数

In this step, you will get the route parameter in the `DetailsComponent`. Currently, the app displays `details works!`, next you'll update the code to display the `id` value passed using the route parameters.

在此步骤中，你将获取 `DetailsComponent` 中的路由参数。目前，该应用程序显示 `details works!`，接下来你将更新代码以显示使用路由参数传过来的 `id` 值。

In `src/app/details/details.component.ts` update the template to import the functions, classes and services that you'll need to use in the `DetailsComponent`:

在 `src/app/details/details.component.ts` 中更新模板以导入你需要在 `DetailsComponent` 中使用的函数、类和服务：

Update the `template` property of the `@Component` decorator to display the value `housingLocationId`:

更新 `@Component` 装饰器的 `template` 属性以显示值 `housingLocationId`：

Update the body of the `DetailsComponent` with the following code:

使用以下代码更新 `DetailsComponent` 的主体：

This code give the `DetailsComponent` access to the `ActivatedRoute` router feature that enables you to have access to the data about the current route. In the constructor, the code converts the id parameter from the route to a number.

此代码令 `DetailsComponent` 可以访问路由器特性 `ActivatedRoute`，使你能访问关于当前路由的数据。在构造函数中，代码将 id 参数从路由转换为数字。

Save all changes.

保存所有更改。

In the browser, click on one of the housing location "learn more" links and confirm that the numeric value displayed on the page matches the `id` property for that location in the data.

在浏览器中，单击其中一个房屋位置的“了解更多”链接，并确认页面上显示的数值与数据中该位置的 `id` 属性匹配。

Step 3 - Customize the `DetailComponent`

第 3 步 - 自定义 `DetailComponent`

Now that routing is working properly in the application this is a great time to update the template of the `DetailsComponent` to display the specific data represented by the housing location for the route parameter.

路由已能在应用程序中正常工作，接下来要更新 `DetailsComponent` 的模板，以显示由路由参数的房屋位置表示的特定数据。

To access the data you will add a call to the `HousingService`.

要访问数据，你需要添加对 `HousingService` 的调用。

Update the template code to match the following code:

把模板代码更新成这样：

Notice that the `housingLocation` properties are being accessed with the optional chaining operator `?`. This ensures that if the `housingLocation` value is null or undefined the application doesn't crash.

请注意，正在使用可选的链式运算符（`?`）访问 `housingLocation` 属性。这会确保如果 `housingLocation` 值为 `null` 或 `undefined` 时，应用程序不会崩溃。

Update the body of the `DetailsComponent` class to match the following code:

把 `DetailsComponent` 类的主体更新成这样：

Now the component has the code to display the correct information based on the selected housing location. The constructor now includes a call to the `HousingService` to pass the route parameter as an argument to the `getHousingLocationById` service function.

现在该组件有了根据所选房屋位置显示正确信息的代码。构造函数现在包括对 `HousingService` 的调用，以将路由参数作为实参传给 `getHousingLocationById` 服务函数。

Copy the following styles into the `src/app/details/details.component.css` file:

将以下样式复制到 `src/app/details/details.component.css` 文件中：

Save your changes.

保存你的更改。

In the browser refresh the page and confirm that when you click on the "learn more" link for a given housing location the details page displays the correct information based on the data for that selected item.

在浏览器中刷新页面并确认当你单击给定房屋位置的“了解更多”链接时，详情页面会根据所选条目的数据显示正确的信息。

Step 4 - Add navigation to the `HomeComponent`

第 4 步 - 将导航添加到 `HomeComponent` 中

In a previous lesson you updated the `AppComponent` template to include a `routerLink`. Adding that code updated your app to enable navigation back to the `HomeComponent` whenever the logo is clicked.

在上一课中，你更新了 `AppComponent` 模板以包含 `routerLink`。添加该代码会更新应用程序，以便在单击徽标时能够导航回 `HomeComponent`。

Confirm that your code matches the following:

确认你的代码与以下内容一致：

Your code may already be up-to-date but confirm to be sure.

你的代码可能已经是最新的，但还是请再次确认。

Lesson Review

课程复习

In this lesson you updated your app to:

在这节课中，你将应用更新为：

use route parameters to pass data to a route

使用路由参数将数据传给路由

use the `routerLink` directive to use dynamic data to create a route

使用 `routerLink` 指令使用动态数据创建路由

use route parameter to retrieve data from the `HousingService` to display housing location specific information.

使用路由参数从 `HousingService` 检索数据以显示特定房屋位置的信息。

Really great work so far.

到目前为止真的很棒。

If you are having any trouble with this lesson, you can review the completed code for it in the <live-example></live-example>.

如果你在学习这节课时遇到了任何问题，可以在<live-example></live-example>查看完整代码。

Next Steps

下一步

[Lesson 12 - Adding forms to your Angular application](tutorial/first-app/first-app-lesson-12)

[第 12 课 - 向 Angular 应用程序中添加表单](tutorial/first-app/first-app-lesson-12)

More information

更多信息

For more information about the topics covered in this lesson, visit:

有关这节课中涵盖的主题的更多信息，请访问：

[Route Parameters](guide/router#accessing-query-parameters-and-fragments)

[路由参数](guide/router#accessing-query-parameters-and-fragments)

[Routing in Angular Overview](guide/routing-overview)

[Angular 中的路由概述](guide/routing-overview)

[Common Routing Tasks](guide/router)

[常见路由任务](guide/router)

[Optional Chaining Operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)

[可选的链接运算符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
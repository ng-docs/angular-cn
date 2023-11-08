Lesson 10 - Add routes to the application

第 10 课 - 向应用程序添加路由

This tutorial lesson demonstrates how to add routes to your app.

本课程示范了如何将路由添加到应用程序。

**Time required:** expect to spend about 25 minutes to complete this lesson.

**所需时间：** 完成这节课预计需要 25 分钟左右。

Before you start

开始之前

This lesson starts with the code from the previous lesson, so you can:

这节课以上一课的代码为起点，你可以：

Use the code that you created in Lesson 9 in your integrated development environment \(IDE\).

在集成开发环境（IDE）中使用你在第 9 课中创建的代码。

Start with the code example from the previous lesson. Choose the <live-example name="first-app-lesson-09"></live-example> from Lesson 9 where you can:

从上一课的代码示例开始。选择<live-example name="first-app-lesson-09"></live-example>，以便

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

At the end of this lesson your application will have support for routing.

在这节课结束时，应用程序将支持路由。

Conceptual preview of routing

路由的概念性预览

This tutorial introduces routing in Angular. Routing is the ability to navigate from one component in the application to another. In [single page applications \(SPA\)](/guide/router-tutorial#using-angular-routes-in-a-single-page-application), only parts of the page is updated to represent the requested view for the user.

本教程会介绍 Angular 中的路由。路由是从应用程序中的一个组件导航到另一个组件的能力。在[单页应用程序（SPA）](/guide/router-tutorial#using-angular-routes-in-a-single-page-application)中，只有部分页面会更新以表示用户请求的视图。

The [Angular Router](/guide/router-tutorial) enables users to declare routes and specify which component should be displayed on the screen if that route is requested by the application.

[Angular 路由器（Router）](/guide/router-tutorial)使用户能够声明路由并指定在应用程序请求该路由时应在屏幕上显示哪个组件。

In this lesson, you will enable routing in your application to navigate to the details page.

在这节课中，你将在应用程序中启用路由以导航到详情页。

Lesson steps

课程步骤

Perform these steps on the app code in your IDE.

在 IDE 中对应用程序代码执行下列步骤。

Step 1 - Create a default details component

第 1 步 - 创建默认详情组件

From the terminal, enter the following command to create the `DetailsComponent`:

从终端输入以下命令以创建 `DetailsComponent`：

This component will represent the details page that provides more information on a given housing location.

该组件将展现详情页面，该页面提供有关给定房屋位置的更多信息。

Step 2 - Add routing to the application

第 2 步 - 向应用程序添加路由

In the `src/app` directory, create a file called `routes.ts`. This file is where we will define the routes in the application.

在 `src/app` 目录中，创建一个名为 `routes.ts` 的文件。该文件是我们将在应用程序中定义路由的地方。

In `main.ts`, make the following updates to enable routing in the application:

在 `main.ts` 中，进行以下更新以在应用程序中启用路由：

Import the routes file and the `provideRouter` function:

导入路由文件和 `provideRouter` 函数：

Update the call to `bootstrapApplication` to include the routing configuration:

更新对 `bootstrapApplication` 的调用以包含路由配置：

In `src/app/app.component.ts`, update the component to use routing:

在 `src/app/app.component.ts` 中，更新组件以使用路由：

Add a file level import for `RoutingModule`:

为 `RoutingModule` 添加文件级导入：

Add `RouterModule` to the `@Component` metadata imports

将 `RouterModule` 添加到 `@Component` 元数据的 `imports` 中

In the `template` property, replace the `<app-home></app-home>` tag with the `<router-outlet>` directive and add a link back to the home page. Your code should match this code:

在 `template` 属性中，将 `<app-home></app-home>` 标记替换为 `<router-outlet>` 指令并添加返回主页的链接。你的代码应与此代码匹配：

Step 3 - Add route to new component

第 3 步 - 将路由添加到新组件

In the previous step you removed the reference to the `<app-home>` component in the template. In this step, you will add a new route to that component.

在上一步中，你删除了模板中对 `<app-home>` 组件的引用。在此步骤中，你将向该组件添加一条新路由。

In `routes.ts`, perform the following updates to create a route.

在 `routes.ts` 中，执行以下更新以创建路由。

Add a file level imports for the `HomeComponent`, `DetailsComponent` and the `Routes` type that you'll use in the route definitions.

为你将在路由定义中使用的 `HomeComponent` 、 `DetailsComponent` 和 `Routes` 类型添加文件级导入。

Define a variable called `routeConfig` of type `Routes` and define two  routes for the app:

定义一个名为 `routeConfig` 的变量，类型为 `Routes` 并为应用程序定义两个路由：

The entries in the `routeConfig` array represent the routes in the application. The first entry navigates to the `HomeComponent` whenever the url matches `''`. The second entry uses some special formatting that will be revisited in a future lesson.

`routeConfig` 数组中的条目表示应用程序中的路由。只要 url 与 `''` 匹配，第一个条目就会导航到 `HomeComponent`。第二个条目使用了一些特殊的格式，将在以后的课程中重新讨论。

Save all changes and confirm that the application works in the browser. The application should still display the list of housing locations.

保存所有更改并确认应用程序正在浏览器中运行。该应用程序应该仍旧显示着房屋位置列表。

Lesson review

课程回顾

In this lesson, you enabled routing in your app as well as defined new routes. Now your app can support navigation between views. In the next lesson, you will learn to navigate to the "details" page for a given housing location.

在这节课中，你在应用程序中启用了路由并定义了新路由。现在应用程序可以支持视图之间的导航。在下一课中，你将学习导航到给定房屋位置的“详情”页面。

You are making great progress with your app, well done.

应用程序取得了很大进步，干得好。

If you are having any trouble with this lesson, you can review the completed code for it in the <live-example></live-example>.

如果你在学习这节课时遇到了任何问题，可以在<live-example></live-example>查看完整代码。

Next steps

下一步

[Lesson 11 - Integrate details page into application](tutorial/first-app/first-app-lesson-11)

[第 11 课 - 将详情页面集成到应用程序中](tutorial/first-app/first-app-lesson-11)

More information

更多信息

For more information about the topics covered in this lesson, visit:

有关这节课中涵盖的主题的更多信息，请访问：

[Routing in Angular Overview](guide/routing-overview)

[Angular 中的路由概述](guide/routing-overview)

[Common Routing Tasks](guide/router)

[常见路由任务](guide/router)
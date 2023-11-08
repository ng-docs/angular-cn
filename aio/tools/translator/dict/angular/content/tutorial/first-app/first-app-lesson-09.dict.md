First Angular app lesson 09 - Angular services

第一个 Angular 应用程序：第 09 课 - Angular 服务

This tutorial lesson demonstrates how to create an Angular service and use dependency injection to include it in your app.

本课程示范了如何创建 Angular 服务并使用依赖注入将其包含在应用程序中。

**Time required:** expect to spend about 15 minutes to complete this lesson.

**所需时间：** 完成这节课预计需要 15 分钟左右。

Before you start

开始之前

This lesson starts with the code from the previous lesson, so you can:

这节课以上一课的代码为起点，你可以：

Use the code that you created in Lesson 8 in your integrated development environment \(IDE\).

在集成开发环境（IDE）中使用你在第 8 课中创建的代码。

Start with the code example from the previous lesson. Choose the <live-example name="first-app-lesson-08"></live-example> from Lesson 8 where you can:

从上一课的代码示例开始。选择<live-example name="first-app-lesson-08"></live-example>，以便

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

Your app has a service to serve the data to your app.
At the end of this lesson, the service reads data from local, static data.
In a later lesson, you update the service to get data from a web service.

应用程序有一项服务可以为应用程序提供数据。在这节课结束时，服务会从本地静态数据中读取数据。在后面的课程中，你将更新服务以从 Web 服务获取数据。

Conceptual preview of services

服务的概念性预览

This tutorial introduces Angular services and dependency injection.

本教程会介绍 Angular 服务和依赖注入。

Angular services

Angular 服务

*Angular services* provide a way for you to separate Angular app data and functions that can be used by multiple components in your app.
To be used by multiple components, a service must be made *injectable*.
Services that are injectable and used by a component become dependencies of that component.
The component depends on those services and can't function without them.

*Angular 服务*为你提供了一种分离 Angular 应用程序数据和功能的方法，这些数据和功能可由应用程序中的多个组件使用。要被多个组件使用，服务必须是可*注入的*。由组件注入和使用的服务就成了该组件的依赖项。该组件依赖于这些服务，没有它们就无法运行。

Dependency injection

依赖注入

*Dependency injection* is the mechanism that manages the dependencies of an app's components and the services that other components can use.

*依赖注入*是一种用于管理应用程序组件和其他组件可以使用的服务的依赖关系的机制。

Lesson steps

课程步骤

Perform these steps on the app code in your IDE.

在 IDE 中对应用程序代码执行下列步骤。

Step 1 - Create a new service for your app

第 1 步 - 为你的应用创建新服务

This step creates an injectable service for your app.

此步骤为应用程序创建可注入服务。

In the **Terminal** pane of your IDE:

在 IDE 的**终端**窗格中：

In your project directory, navigate to the `first-app` directory.

在你的项目目录中，导航到 `first-app` 目录。

In the `first-app` directory, run this command to create the new service.

在 `first-app` 目录中，运行此命令以创建新服务。

Run `ng serve` to build the app and serve it to `http://localhost:4200`.

运行 `ng serve` 来构建应用程序并将其提供给 `http://localhost:4200`。

Confirm that the app builds without error.
Correct any errors before you continue to the next step.

确保应用在构建时没有错误。在继续下一步之前更正所有错误。

Step 2 - Add static data to the new service

第 2 步 - 将静态数据添加到新服务中

This step adds some sample data to your new service.
In a later lesson, you replace the static data with a web interface to get data as you might in a real app.
For now, your app's new service uses the data that has, so far, been created locally in `HomeComponent`.

此步骤将一些样本数据添加到你的新服务中。在后面的课程中，你将用 Web 界面替换静态数据，以便像真实应用程序中一样获取数据。迄今为止，应用程序的新服务使用的都是在 `HomeComponent` 中本地创建的数据。

In the **Edit** pane of your IDE:

在 IDE 的**编辑**窗格中：

In `src/app/home/home.component.ts`, from `HomeComponent`, copy the `housingLocationList` variable and its array value.

在 `src/app/home/home.component.ts` 中，从 `HomeComponent` 复制 `housingLocationList` 变量及其数组值。

In `src/app/housing.service.ts`:

在 `src/app/housing.service.ts` 中：

Inside the `HousingService` class, paste the variable that you copied from `HomeComponent` in the previous step.

在 `HousingService` 类中，粘贴你上一步从 `HomeComponent` 复制出来的变量。

Inside the `HousingService` class, paste these functions after the data you just copied.
These functions allow dependencies to access the service's data.

在 `HousingService` 类中，将这些函数粘贴到你刚刚复制的数据之后。这些函数允许依赖项访问此服务的数据。

You will need these functions in a future lesson. For now, it is enough to understand that these functions return either a specific `HousingLocation` by id or the entire list.

在以后的课程中你将用到这些功能。现在，只要了解这些函数会通过 id 返回特定的 `HousingLocation` 或整个列表就足够了。

Add a file level import for the `HousingLocation`.

为 `HousingLocation` 添加文件级导入。

Step 3 - Inject the new service into `HomeComponent`

第 3 步 - 将新服务注入 `HomeComponent`

This step injects the new service into your app's `HomeComponent` so that it can read the app's data from a service.
In a later lesson, you replace the static data with a live data source to get data as you might in a real app.

此步骤会将新服务注入到应用的 `HomeComponent` 中，以便它可以从服务中读取应用的数据。在后面的课程中，你会将静态数据替换为实时数据源，以像在真实应用程序中一样获取数据。

In the **Edit** pane of your IDE, in `src/app/home/home.component.ts`:

在 IDE 的**编辑**窗格中，打开 `src/app/home/home.component.ts` 文件：

At the top of `src/app/home/home.component.ts`, add the `inject` to the items imported from `@angular/common`. This will import the `inject` function into the `HomeComponent` class.

在 `src/app/home/home.component.ts` 的顶部，将 `inject` 添加到从 `@angular/common` 导入的条目中。这会将注入函数 `inject` 导入到 `HomeComponent` 类中。

Add a new file level import for the `HousingService`:

为 `HousingService` 添加一个新的文件级导入：

From `HomeComponent`, delete the `housingLocationList` delete the array entries and assign `housingLocationList` the value of empty array \(`[]`\). In a few steps you will update the code to pull the data from the `HousingService`.

从 `HomeComponent` 中，删除 `housingLocationList` 数组的条目并把 `housingLocationList` 赋值为空数组值（`[]`）。在少量步骤中，你将更新代码以便从 `HousingService` 中提取数据。

In `HomeComponent`, add this code to inject the new service and initialize the data for the app. The `constructor` is the first function that runs when this component is created. The code in the `constructor` will assign the `housingLocationList` the value returned from the call to `getAllHousingLocations`.

在 `HomeComponent` 中，添加此代码以注入新服务并初始化应用程序的数据。`constructor` 是创建此组件时运行的第一个函数。`constructor` 中的代码将把调用 `getAllHousingLocations` 返回的值赋值给 `housingLocationList`。

Save the changes to `src/app/home/home.component.ts` and confirm your app builds without error.
Correct any errors before you continue to the next step.

将更改保存到 `src/app/home/home.component.ts` 确保应用在构建时没有错误。在继续下一步之前更正所有错误。

Lesson review

课程回顾

In this lesson, you added an Angular service to your app and injected it into the `HomeComponent` class.
This compartmentalizes how your app gets its data.
For now, the new service gets its data from a static array of data.
In a later lesson, you refactor the service to get its data from a from an API endpoint.

在这节课中，你向应用程序添加了一个 Angular 服务并将其注入到 `HomeComponent` 类中。这分离了应用程序获取数据的方式。目前，新服务会从静态数据数组中获取数据。在后面的课程中，你将重构服务以便从 API 端点获取数据。

If you are having any trouble with this lesson, you can review the completed code for it in the <live-example></live-example>.

如果你在学习这节课时遇到了任何问题，可以在<live-example></live-example>查看完整代码。

Next steps

下一步

[Lesson 10 - Add routes to the application](tutorial/first-app/first-app-lesson-10)

[第 10 课 - 向应用程序添加路由](tutorial/first-app/first-app-lesson-10)

More information

更多信息

For more information about the topics covered in this lesson, visit:

有关这节课中涵盖的主题的更多信息，请访问：

[Creating an injectable service](guide/creating-injectable-service)

[创建可注入服务](guide/creating-injectable-service)

[Dependency injection in Angular](guide/dependency-injection-overview)

[Angular 中的依赖注入](guide/dependency-injection-overview)

[ng generate service](cli/generate#service)



[ng generate](cli/generate)
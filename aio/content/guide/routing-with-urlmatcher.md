# Tutorial: Creating custom route matches

The Angular Router supports a powerful matching strategy that you can use to help users navigate your application.
This matching strategy supports static routes, variable routes with parameters, wildcard routes, and so on.
Also, build your own custom pattern matching for situations in which the URLs are more complicated.

Angular Router 支持强大的匹配策略，你可以使用它来帮助用户在应用中导航。该匹配策略支持静态路由、带参数的可变路由、通配符路由等。此外，还可以为更复杂的 URL 构建你自己的自定义模式匹配。

In this tutorial, you'll build a custom route matcher using Angular's `UrlMatcher`.
This matcher looks for a Twitter handle in the URL.

在本教程中，你将使用 Angular 的 `UrlMatcher` 来构建自定义路由匹配器。此匹配器在 URL 中查找 Twitter ID。

For a working example of the final version of this tutorial, see the <live-example></live-example>.

## Objectives

## 目标

Implement Angular's `UrlMatcher` to create a custom route matcher.

实现 Angular 的 `UrlMatcher` 以创建自定义路由匹配器。

## Prerequisites

## 先决条件

To complete this tutorial, you should have a basic understanding of the following concepts:

要完成本教程，你应该对以下概念有基本的了解：

* JavaScript

* HTML

* CSS

* [Angular CLI](cli)

If you are unfamiliar with how Angular's router works, review [Using Angular routes in a single-page application](guide/router-tutorial).

如果你不熟悉 Angular 路由器的工作原理，请阅读[在单页应用程序中使用 Angular 路由](guide/router-tutorial)。

## Create a sample application

## 创建一个范例应用

Using the Angular CLI, create a new application, *angular-custom-route-match*.
In addition to the default Angular application framework, you will also create a *profile* component.

使用 Angular CLI，创建一个新应用程序 *angular-custom-route-match* 。除了默认的 Angular 应用程序框架之外，还将创建一个 *profile* 组件。

1. Create a new Angular project, *angular-custom-route-match*.

   创建一个新的 Angular 项目 *angular-custom-route-match* 。

   <code-example format="shell" language="shell">

   ng new angular-custom-route-match

   </code-example>

   When prompted with `Would you like to add Angular routing?`, select `Y`.

   当提示 `Would you like to add Angular routing?` 时，选择 `Y` 。

   When prompted with `Which stylesheet format would you like to use?`, select `CSS`.

   当系统提示 `Which stylesheet format would you like to use?` 时，选择 `CSS`。

   After a few moments, a new project, `angular-custom-route-match`, is ready.

   片刻之后，一个新项目 `angular-custom-route-match` 就准备好了。

1. From your terminal, navigate to the `angular-custom-route-match` directory.

   打开终端窗口，进到 `angular-custom-route-match` 目录。

1. Create a component, *profile*.

   创建一个组件 *profile* 。

   <code-example format="shell" language="shell">

   ng generate component profile

   </code-example>

1. In your code editor, locate the file, `profile.component.html` and replace the placeholder content with the following HTML.

   在你的代码编辑器中，找到文件 `profile.component.html` 并将其占位内容替换为以下 HTML。

   <code-example header="src/app/profile/profile.component.html" path="routing-with-urlmatcher/src/app/profile/profile.component.html"></code-example>

1. In your code editor, locate the file, `app.component.html` and replace the placeholder content with the following HTML.

   在你的代码编辑器中，找到文件 `app.component.html` 并将其占位内容替换为以下 HTML。

   <code-example header="src/app/app.component.html" path="routing-with-urlmatcher/src/app/app.component.html"></code-example>

## Configure your routes for your application

## 为你的应用程序配置路由

With your application framework in place, you next need to add routing capabilities to the `app.module.ts` file.
As a part of this process, you will create a custom URL matcher that looks for a Twitter handle in the URL.
This handle is identified by a preceding `@` symbol.

应用程序框架就绪后，接下来就要向 `app.module.ts` 文件中添加路由能力。首先，你要创建一个自定义 URL 匹配器，用于在 URL 中查找 Twitter ID。此 ID 由其前导 `@` 符号标识出来。

1. In your code editor, open your `app.module.ts` file.

   在你的代码编辑器中，打开 `app.module.ts` 文件。

1. Add an `import` statement for Angular's `RouterModule` and `UrlMatcher`.

   为 Angular 的 `RouterModule` 和 `UrlMatcher` 添加 `import` 语句。

   <code-example header="src/app/app.module.ts" path="routing-with-urlmatcher/src/app/app.module.ts" region="import"></code-example>

1. In the imports array, add a `RouterModule.forRoot([])` statement.

   在 `imports` 数组中，添加 `RouterModule.forRoot([])` 语句。

   <code-example header="src/app/app.module.ts" path="routing-with-urlmatcher/src/app/app.module.ts" region="imports-array"></code-example>

1. Define the custom route matcher by adding the following code to the `RouterModule.forRoot()` statement.

   将如下代码添加到 `RouterModule.forRoot()` 语句中，以便使用自定义路由匹配器。

   <code-example header="src/app/app.module.ts" path="routing-with-urlmatcher/src/app/app.module.ts" region="matcher"></code-example>

This custom matcher is a function that performs the following tasks:

这个自定义匹配器是一个执行以下任务的函数：

* The matcher verifies that the array contains only one segment

  匹配器验证数组是否只包含一个区段。

* The matcher employs a regular expression to ensure that the format of the username is a match

  匹配器使用正则表达式来确保用户名的格式是匹配的。

* If there is a match, the function returns the entire URL, defining a `username` route parameter as a substring of the path

  如果匹配，则该函数返回整个 URL，将路由参数 `username` 定义为路径的子字符串。

* If there isn't a match, the function returns null and the router continues to look for other routes that match the URL

  如果不匹配，则该函数返回 `null` 并且路由器继续查找与 URL 匹配的其他路由。

<div class="is-helpful">

A custom URL matcher behaves like any other route definition.
Define child routes or lazy loaded routes as you would with any other route.

自定义 URL 匹配器的行为与任何其他路由定义方式是一样的。请像定义任何其他路由一样定义子路由或惰性加载路由。

</div>

## Subscribe to the route parameters

## 订阅路由参数

With the custom matcher in place, you now need to subscribe to the route parameters in the `profile` component.

自定义匹配器就位后，你现在需要订阅 `profile` 组件中的路由参数。

1. In your code editor, open your `profile.component.ts` file.

   在你的代码编辑器中，打开 `profile.component.ts` 文件。

1. Add an `import` statement for Angular's `ActivatedRoute` and `ParamMap`.

   为 Angular 的 `ActivatedRoute` 和 `ParamMap` 添加 `import` 语句。

   <code-example header="src/app/profile/profile.component.ts" path="routing-with-urlmatcher/src/app/profile/profile.component.ts" region="activated-route-and-parammap"></code-example>

1. Add an `import` statement for RxJS `map`.

   为 RxJS 的 `map` 添加 `import` 语句。

   <code-example header="src/app/profile/profile.component.ts" path="routing-with-urlmatcher/src/app/profile/profile.component.ts" region="rxjs-map"></code-example>

1. Subscribe to the `username` route parameter.

   订阅 `username` 路由参数。

   <code-example header="src/app/profile/profile.component.ts" path="routing-with-urlmatcher/src/app/profile/profile.component.ts" region="subscribe"></code-example>

1. Inject the `ActivatedRoute` into the component's constructor.

   将 `ActivatedRoute` 注入到组件的构造函数中。

   <code-example header="src/app/profile/profile.component.ts" path="routing-with-urlmatcher/src/app/profile/profile.component.ts" region="activatedroute"></code-example>

## Test your custom URL matcher

## 测试你的自定义 URL 匹配器

With your code in place, you can now test your custom URL matcher.

代码就绪后，就可以测试自定义 URL 匹配器了。

1. From a terminal window, run the `ng serve` command.

   在终端窗口中，运行 `ng serve` 命令。

   <code-example format="shell" language="shell">

   ng serve

   </code-example>

1. Open a browser to `http://localhost:4200`.

   打开浏览器访问 `http://localhost:4200`。

   You should see a single web page, consisting of a sentence that reads `Navigate to my profile`.

   你会看到一个网页，其中包含一个句子，内容为 `Navigate to my profile` 。

1. Click the **my profile** hyperlink.

   单击 **my profile** 超链接。

   A new sentence, reading `Hello, Angular!` appears on the page.

   一个新的句子 `Hello, Angular!` 出现在页面上。

## Next steps

## 下一步

Pattern matching with the Angular Router provides you with a lot of flexibility when you have dynamic URLs in your application.
To learn more about the Angular Router, see the following topics:

当你的应用程序中有动态 URL 时，使用 Angular Router 提供的模式匹配功能，可以为你提供很大的灵活性。要了解有关 Angular Router 的更多信息，请参阅以下主题：

* [In-app Routing and Navigation](guide/router)

  [应用内路由和导航](/guide/router)

* [Router API](api/router)

  [路由器 API](/api/router)

<div class="alert is-helpful">

This content is based on [Custom Route Matching with the Angular Router](https://medium.com/@brandontroberts/custom-route-matching-with-the-angular-router-fbdd48665483), by [Brandon Roberts](https://twitter.com/brandontroberts).

此内容基于 [Brandon Roberts](https://twitter.com/brandontroberts) 的[为 Angular Router 使用自定义路由匹配](https://medium.com/@brandontroberts/custom-route-matching-with-the-angular-router-fbdd48665483) 。

</div>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
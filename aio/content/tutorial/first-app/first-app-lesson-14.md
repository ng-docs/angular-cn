# Lesson 14 - Add HTTP communication to your app

# 第 14 课 - 为应用程序添加 HTTP 通讯

This tutorial demonstrates how to integrate HTTP and an API into your app. 

本教程演示如何将 HTTP 和 API 集成到应用程序中。

Up until this point your app has read data from a static array in an Angular service. The next step is to use a JSON server that your app will communicate with over HTTP. The HTTP request will simulate the experience of working with data from a server.

到目前为止，应用程序都在从 Angular 服务中的静态数组读取数据。下一步是让应用程序通过 HTTP 与 JSON 服务器通信。HTTP 请求将会模拟处理来自服务器的数据的体验。

**Time required:** expect to spend about 20 minutes to complete this lesson.

**所需时间：** 完成这节课预计需要 20 分钟左右。

## Before you start

## 开始之前

This lesson starts with the code from the previous lesson, so you can:

这节课以上一课的代码为起点，你可以：

* Use the code that you created in Lesson 13 in your integrated development environment \(IDE\).

  在集成开发环境（IDE）中使用你在第 13 课中创建的代码。

* Start with the code example from the previous lesson. Choose the <live-example name="first-app-lesson-13"></live-example> from Lesson 13 where you can:

  从上一课的代码示例开始。选择<live-example name="first-app-lesson-13"></live-example>，以便

  * Use the *live example* in StackBlitz, where the StackBlitz interface is your IDE.

    使用 StackBlitz 中的*在线例子*，其中 StackBlitz 的界面就是你的 IDE。

  * Use the *download example* and open it in your IDE.

    使用*下载示例*并在你的 IDE 中打开它。

If you haven't reviewed the introduction, visit the [Introduction to Angular tutorial](tutorial/first-app) to make sure you have everything you need to complete this lesson.

如果你还没看过简介，请访问 [Angular 教程简介](tutorial/first-app)以确保你已具备完成这节课所需的一切知识。

## After you finish

## 完成之后

* Your app will use data from a JSON server

  应用程序将使用来自 JSON 服务器的数据

## Lesson steps

## 课程步骤

Perform these steps in the terminal on your local computer.

在本地计算机的终端中执行这些步骤。

### Step 1 - Configure the JSON server

### 第 1 步 - 配置 JSON 服务器

JSON Server is an open source tool used to create mock REST APIs. You'll use it to serve the housing location data that is currently stored in the housing service.

JSON Server 是一种用于创建模拟 REST API 的开源工具。你将使用它来提供当前存储在房屋服务中的房屋位置数据。

1. Install `json-server` from npm by using the following command.

   使用以下命令从 npm 安装 `json-server` 。

   <code-example language="bash" format="bash">
       npm install -g json-server
   </code-example>

1. In the root directory of your project, create a file called `db.json`. This is where you will store the data for the `json-server`.

   在项目的根目录中，创建一个名为 `db.json` 的文件。这是你将存储 `json-server` 数据的地方。

1. Open `db.json` and copy the following code into the file

   打开 `db.json` 并将以下代码复制到文件中

   <code-example language="json" format="json">
       {
           "locations": [
               {
                   "id": 0,
                   "name": "Acme Fresh Start Housing",
                   "city": "Chicago",
                   "state": "IL",
                   "photo": "/assets/bernard-hermant-CLKGGwIBTaY-unsplash.jpg",
                   "availableUnits": 4,
                   "wifi": true,
                   "laundry": true
               },
               {
                   "id": 1,
                   "name": "A113 Transitional Housing",
                   "city": "Santa Monica",
                   "state": "CA",
                   "photo": "/assets/brandon-griggs-wR11KBaB86U-unsplash.jpg",
                   "availableUnits": 0,
                   "wifi": false,
                   "laundry": true
               },
               {
                   "id": 2,
                   "name": "Warm Beds Housing Support",
                   "city": "Juneau",
                   "state": "AK",
                   "photo": "/assets/i-do-nothing-but-love-lAyXdl1-Wmc-unsplash.jpg",
                   "availableUnits": 1,
                   "wifi": false,
                   "laundry": false
               },
               {
                   "id": 3,
                   "name": "Homesteady Housing",
                   "city": "Chicago",
                   "state": "IL",
                   "photo": "/assets/ian-macdonald-W8z6aiwfi1E-unsplash.jpg",
                   "availableUnits": 1,
                   "wifi": true,
                   "laundry": false
               },
               {
                   "id": 4,
                   "name": "Happy Homes Group",
                   "city": "Gary",
                   "state": "IN",
                   "photo": "/assets/krzysztof-hepner-978RAXoXnH4-unsplash.jpg",
                   "availableUnits": 1,
                   "wifi": true,
                   "laundry": false
               },
               {
                   "id": 5,
                   "name": "Hopeful Apartment Group",
                   "city": "Oakland",
                   "state": "CA",
                   "photo": "/assets/r-architecture-JvQ0Q5IkeMM-unsplash.jpg",
                   "availableUnits": 2,
                   "wifi": true,
                   "laundry": true
               },
               {
                   "id": 6,
                   "name": "Seriously Safe Towns",
                   "city": "Oakland",
                   "state": "CA",
                   "photo": "/assets/phil-hearing-IYfp2Ixe9nM-unsplash.jpg",
                   "availableUnits": 5,
                   "wifi": true,
                   "laundry": true
               },
               {
                   "id": 7,
                   "name": "Hopeful Housing Solutions",
                   "city": "Oakland",
                   "state": "CA",
                   "photo": "/assets/r-architecture-GGupkreKwxA-unsplash.jpg",
                   "availableUnits": 2,
                   "wifi": true,
                   "laundry": true
               },
               {
                   "id": 8,
                   "name": "Seriously Safe Towns",
                   "city": "Oakland",
                   "state": "CA",
                   "photo": "/assets/saru-robert-9rP3mxf8qWI-unsplash.jpg",
                   "availableUnits": 10,
                   "wifi": false,
                   "laundry": false
               },
               {
                   "id": 9,
                   "name": "Capital Safe Towns",
                   "city": "Portland",
                   "state": "OR",
                   "photo": "/assets/webaliser-_TPTXZd9mOo-unsplash.jpg",
                   "availableUnits": 6,
                   "wifi": true,
                   "laundry": true
               }
           ]
       }
   </code-example>

1. Save this file.

   保存此文件。

1. Time to test your configuration. From the command line, at the root of your project run the following commands.

   是时候测试你的配置了。打开命令行窗口，在项目的根目录下运行以下命令。

   <code-example language="bash" format="bash">
       json-server --watch db.json
   </code-example>

1. In your web browser, navigate to the `http://localhost:3000/locations` and confirm that the response includes the data stored in `db.json`.

   在你的 Web 浏览器中，导航到 `http://localhost:3000/locations` 并确认响应里包括存储在 `db.json` 中的数据。

If you have any trouble with your configuration, you can find more details in the [official documentation](https://www.npmjs.com/package/json-server).

如果你的配置有任何问题，可以在[官方文档](https://www.npmjs.com/package/json-server)中找到更多详细信息。

### Step 2 - Update service to use web server instead of local array

### 第 2 步 - 更新服务以使用 Web 服务器而非本地数组

The data source has been configured, the next step is to update your web app to connect to it use the data.

数据源已配置，下一步是更新你的 Web 应用程序以连接到它来使用数据。

1. In `src/app/housing.service.ts`, make the following changes:

   在 `src/app/housing.service.ts` 中，进行以下更改：

   1. Update the code to remove `housingLocationList` property and the array containing the data.

      更新代码以删除 `housingLocationList` 属性和包含数据的数组。

   1. Add a string property called and set the value to `'http://localhost:3000/locations'`

      添加一个名叫 `url` 的字符串属性并将值设置为 `'http://localhost:3000/locations'`

      <code-example anguage="javascript" format="javascript">
      url = 'http://localhost:3000/locations';
      </code-example>

      This code will result in errors in the rest of the file because it depends on the `housingLocationList` property. We're going to update the service methods next.

      此代码将导致文件其余部分出错，因为它依赖 `housingLocationList` 属性。接下来我们将更新服务方法。

   1. Update the `getAllHousingLocations` function to make a call to the web server you configured.

      更新 `getAllHousingLocations` 函数以调用你配置好的 Web 服务器。

      <code-example header="" path="first-app-lesson-14/src/app/housing.service.ts" region="update-getAllHousingLocations"></code-example>

      The code now uses asynchronous code to make a `get` request over `HTTP`. Notice, for this example, the code uses fetch. For more advanced use cases consider using `HttpClient` provided by Angular.

      该代码现在使用异步代码通过 `HTTP` 发出 `get` 请求。请注意，对于此示例，代码使用了 `fetch`。对于更高级的用例，请考虑使用 Angular 提供的 `HttpClient` 。

   1. Update the `getHousingLocationsById` function to make a call to the web server you configured.

      更新 `getHousingLocationsById` 函数以调用你配置好的 Web 服务器。

      <code-example header="" path="first-app-lesson-14/src/app/housing.service.ts" region="update-getHousingLocationById"></code-example>

   1. Once all the updates are complete, your updated service will match the following code.

      所有这些更新完成后，更新后的服务代码将是这样的。

      <code-example header="Final version of housing.service.ts" path="first-app-lesson-14/src/app/housing.service.ts"></code-example>

### Step 3 - Update the components to use asynchronous calls to the housing service

### 第 3 步 - 更新组件以使用异步方式调用房屋服务

The server is now reading data from the `HTTP` request but the components that rely on the service now have errors because they were programmed to use the synchronous version of the service.

服务器现在正在从 `HTTP` 请求中读取数据，但依赖该服务的组件现在出错了，因为它们被编码成了使用该服务的同步版本。

1. In `src/app/home/home.component.ts`, update the constructor to use the new asynchronous version of the `getAllHousingLocations` method.

   在 `src/app/home/home.component.ts` 中，更新构造函数以使用新的异步版本的 `getAllHousingLocations` 方法。

   <code-example header="" path="first-app-lesson-14/src/app/home/home.component.ts" region="update-home-component-constructor"></code-example>

1. In `src/app/details/details.component.ts`, update the constructor to use the new asynchronous version of the `getHousingLocationById` method.

   在 `src/app/details/details.component.ts` 中，更新构造函数以使用新的异步版本的 `getHousingLocationById` 方法。

   <code-example header="" path="first-app-lesson-14/src/app/details/details.component.ts" region="update-details-component-constructor"></code-example>

1. Save your code.

   保存你的代码。

1. Open the application in the browser and confirm that it runs without any errors.

   在浏览器中打开应用程序并确认它运行没有任何错误。

## Lesson review

## 课程回顾

In this lesson, you updated your app to:

在这节课中，你将应用更新为：

* use a local web server \(`json-server`\)

  使用本地网络服务器（`json-server`）

* use asynchronous service methods to retrieve data.

  使用异步服务方法来检索数据。

Congratulations! You've successfully completed this tutorial and are ready to continue your journey with building even more complex Angular Apps. If you would like to learn more, please consider completing some of Angular's other developer [tutorials](tutorial) and [guides](/guide/developer-guide-overview).

恭喜！你已成功完成本教程，并已准备好继续构建更复杂的 Angular 应用程序。如果你想了解更多信息，请考虑完成 Angular 的一些其他开发者[教程](tutorial)和[指南](/guide/developer-guide-overview)。

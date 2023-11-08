<a id="top"></a>



{&commat;searchKeywords test testing karma jasmine coverage}



Testing

测试

Testing your Angular application helps you check that your application is working as you expect.

测试你的 Angular 应用可以帮助你检查此应用是否正常运行。

Prerequisites

前提条件

Before writing tests for your Angular application, you should have a basic understanding of the following concepts:

在为 Angular 应用编写测试之前，你应该对这些概念有一个基本的了解：

[Angular fundamentals](guide/architecture)

[Angular 的基本原理](guide/architecture)

[JavaScript](https://javascript.info/)



[Angular CLI](cli)



The testing documentation offers tips and techniques for unit and integration testing Angular applications through a sample application created with the [Angular CLI](cli).
This sample application is much like the one in the [*Tour of Heroes* tutorial](tutorial/tour-of-heroes).

测试文档提供了通过使用 [Angular CLI](cli) 创建的示例应用程序对 Angular 应用程序进行单元和集成测试的提示和技术。这个示例应用程序与[*英雄之旅*教程](tutorial/tour-of-heroes)中的示例应用程序非常相似。

<a id="setup"></a>



Set up testing

建立环境

The Angular CLI downloads and installs everything you need to test an Angular application with [Jasmine testing framework](https://jasmine.github.io).

Angular CLI 会下载并安装试用 [Jasmine 测试框架](https://jasmine.github.io) 测试 Angular 应用时所需的一切。

The project you create with the CLI is immediately ready to test.
Just run the [`ng test`](cli/test) CLI command:

你使用 CLI 创建的项目是可以立即用于测试的。运行 CLI 命令 [`ng test`](cli/test) 即可：

The `ng test` command builds the application in *watch mode*,
and launches the [Karma test runner](https://karma-runner.github.io).

`ng test` 命令在*监视模式*下构建应用，并启动 [karma 测试运行器](https://karma-runner.github.io)。

The console output looks the below:

它的控制台输出一般是这样的：

The last line of the log shows that Karma ran three tests that all passed.

日志的最后一行显示 Karma 运行了三个测试，这些测试都通过了。

The test output is displayed in the browser using [Karma Jasmine HTML Reporter](https://github.com/dfederm/karma-jasmine-html-reporter).

测试输出使用 [Karma Jasmine HTML Reporter](https://github.com/dfederm/karma-jasmine-html-reporter) 显示在浏览器中。

Click on a test row to re-run just that test or click on a description to re-run the tests in the selected test group \("test suite"\).

可以点击某一行测试，来单独重跑这个测试，或者点击一行描述信息来重跑所选测试组（“测试套件”）中的那些测试。

Meanwhile, the `ng test` command is watching for changes.

同时，`ng test` 命令还会监听这些变化。

To see this in action, make a small change to `app.component.ts` and save.
The tests run again, the browser refreshes, and the new test results appear.

要查看它的实际效果，就对 `app.component.ts` 做一个小修改，并保存它。这些测试就会重新运行，浏览器也会刷新，然后新的测试结果就出现了。

Configuration

配置

The Angular CLI takes care of Jasmine and Karma configuration for you. It constructs the full configuration in memory, based on options specified in the `angular.json` file.

Angular CLI 会为你处理 Jasmine 和 Karma 配置。它根据 `angular.json` 文件中指定的选项在内存中构建完整配置。

If you want to customize Karma, you can create a `karma.conf.js` by running the following command:

如果你想自定义 Karma，你可以通过运行以下命令创建一个 `karma.conf.js`：

Other test frameworks

其他测试框架

You can also unit test an Angular application with other testing libraries and test runners.
Each library and runner has its own distinctive installation procedures, configuration, and syntax.

你还可以使用其它的测试库和测试运行器来对 Angular 应用进行单元测试。每个库和运行器都有自己特有的安装过程、配置项和语法。

Test file name and location

测试文件名及其位置

Inside the `src/app` folder the Angular CLI generated a test file for the `AppComponent` named `app.component.spec.ts`.

在 `src/app` 目录中，CLI 为 `AppComponent` 生成了一个名叫 `app.component.spec.ts` 的测试文件。

The `app.component.ts` and `app.component.spec.ts` files are siblings in the same folder.
The root file names \(`app.component`\) are the same for both files.

`app.component.ts` 和 `app.component.spec.ts` 文件位于同一个文件夹中，而且相邻。其根文件名部分（`app.component`）都是一样的。

Adopt these two conventions in your own projects for *every kind* of test file.

请在你的项目中对*任意类型*的测试文件都坚持这两条约定。

<a id="q-spec-file-location"></a>



Place your spec file next to the file it tests

把测试规约（spec）文件放在它要测试的文件旁边

It's a good idea to put unit test spec files in the same folder
as the application source code files that they test:

最好把单元测试规约文件放到与它们测试的应用源码文件相同的文件夹中：

Such tests are painless to find

这些测试很容易找到。

You see at a glance if a part of your application lacks tests

你一眼就能看到应用中是否缺少一些测试。

Nearby tests can reveal how a part works in context

临近的测试可以揭示一个部件会如何在上下文中工作。

When you move the source \(inevitable\), you remember to move the test

当移动源代码时（在所难免），你不会忘了同时移动测试。

When you rename the source file \(inevitable\), you remember to rename the test file

当重命名源文件时（在所难免），你不会忘了重命名测试文件。

<a id="q-specs-in-test-folder"></a>



Place your spec files in a test folder

把 spec 文件放到 test 目录下

Application integration specs can test the interactions of multiple parts
spread across folders and modules.
They don't really belong to any part in particular, so they don't have a
natural home next to any one file.

应用的集成测试规范可以测试跨文件夹和模块的多个部分之间的交互。它们并不属于任何一个特定的部分，所以把它们放在任何一个文件旁都很不自然。

It's often better to create an appropriate folder for them in the `tests` directory.

最好在 `tests` 目录下为它们创建一个合适的文件夹。

Of course specs that test the test helpers belong in the `test` folder,
next to their corresponding helper files.

当然，用来测试那些测试助手的规约也位于 `test` 目录下，紧挨着相应的测试助手文件。

<a id="ci"></a>



Testing in continuous integration

建立持续集成环境

One of the best ways to keep your project bug-free is through a test suite, but you might forget to run tests all the time.

保持项目无错误的最佳方法之一是通过测试套件，但你可能会忘记一直运行测试。

Continuous integration \(CI\) servers let you set up your project repository so that your tests run on every commit and pull request.

避免项目出 BUG 的最佳方式之一，就是使用测试套件。但是很容易忘了一直运行它。持续集成（CI）服务器让你可以配置项目的代码仓库，以便每次提交和收到 Pull Request 时就会运行你的测试。

To test your Angular CLI application in Continuous integration \(CI\) run the following command:

要在持续集成 \(CI\) 中测试你的 Angular CLI 应用程序，请运行以下命令：

More information on testing

关于测试的更多信息

After you've set up your application for testing, you might find the following testing guides useful.

当你设置准备好测试环境之后，可能会发现以下测试指南很有用。

[Testing utility APIs](guide/testing-utility-apis)

[测试实用工具 API](guide/testing-utility-apis)

Angular testing features.

Angular 的测试特性。

[Debugging tests](guide/test-debugging)

[调试测试代码](guide/test-debugging)

Common testing bugs.

发现测试代码的常见 BUG。

[Testing pipes](guide/testing-pipes)

[测试管道](guide/testing-pipes)

How to test pipes.

如何测试管道。

[Testing attribute directives](guide/testing-attribute-directives)

[测试属性型指令](guide/testing-attribute-directives)

How to test your attribute directives.

如何测试你的属性型指令。

[Component testing scenarios](guide/testing-components-scenarios)

[组件测试场景](guide/testing-components-scenarios)

Various kinds of component testing scenarios and use cases.

了解各种组件测试场景和用例。

[Basics of testing components](guide/testing-components-basics)

[测试组件的基础知识](guide/testing-components-basics)

Basics of testing Angular components.

测试 Angular 组件的基础知识。

[Testing services](guide/testing-services)

[测试服务](guide/testing-services)

How to test the services your application uses.

如何测试应用中所用的服务。

[Code coverage](guide/testing-code-coverage)

[代码覆盖](guide/testing-code-coverage)

How much of your app your tests are covering and how to specify required amounts.

找出你的测试覆盖了多少应用，以及如何指定所需的数量。

Details

详情
<a id="top"></a>

{@searchKeywords test testing karma jasmine coverage}

# Testing

# 测试

Testing your Angular application helps you check that your application is working as you expect.

测试你的 Angular 应用可以帮助你检查此应用是否正常运行。

## Prerequisites

## 前提条件

Before writing tests for your Angular application, you should have a basic understanding of the following concepts:

在为 Angular 应用编写测试之前，你应该对这些概念有一个基本的了解：

* [Angular fundamentals](guide/architecture)

  Angular 的基本原理

* [JavaScript](https://javascript.info/)

* HTML

* CSS

* [Angular CLI](cli)

The testing documentation offers tips and techniques for unit and integration testing Angular applications through a sample application created with the [Angular CLI](cli).
This sample application is much like the one in the [*Tour of Heroes* tutorial](tutorial).

本测试文档通过使用 [Angular CLI](cli) 创建的范例应用，为对 Angular 应用进行单元测试和集成测试提供了技巧和方法。这个范例应用很像[*“英雄之旅”*教程](tutorial)中的应用。

<div class="alert is-helpful">

If you'd like to experiment with the application that this guide describes, <live-example name="testing" noDownload>run it in your browser</live-example> or <live-example name="testing" downloadOnly>download and run it locally</live-example>.

如果你要试用本指南中所讲的应用，请<live-example name="testing" noDownload>在浏览器中运行它</live-example>或<live-example name="testing" downloadOnly>下载并在本地运行它</live-example>。

</div>

<a id="setup"></a>

## Set up testing

## 建立环境

The Angular CLI downloads and installs everything you need to test an Angular application with [Jasmine testing framework](https://jasmine.github.io).

Angular CLI 会下载并安装试用 [Jasmine 测试框架](https://jasmine.github.io) 测试 Angular 应用时所需的一切。

The project you create with the CLI is immediately ready to test.
Just run the [`ng test`](cli/test) CLI command:

你使用 CLI 创建的项目是可以立即用于测试的。运行 CLI 命令 [`ng test`](cli/test) 即可：

<code-example format="shell" language="shell">

ng test

</code-example>

The `ng test` command builds the application in *watch mode*,
and launches the [Karma test runner](https://karma-runner.github.io).

`ng test` 命令在*监视模式*下构建应用，并启动 [karma 测试运行器](https://karma-runner.github.io)。

The console output looks the below:

它的控制台输出一般是这样的：

<code-example format="shell" language="shell">

02 11 2022 09:08:28.605:INFO [karma-server]: Karma v6.4.1 server started at http://localhost:9876/
02 11 2022 09:08:28.607:INFO [launcher]: Launching browsers Chrome with concurrency unlimited
02 11 2022 09:08:28.620:INFO [launcher]: Starting browser Chrome
02 11 2022 09:08:31.312:INFO [Chrome]: Connected on socket -LaEYvD2R7MdcS0-AAAB with id 31534482
Chrome: Executed 3 of 3 SUCCESS (0.193 secs / 0.172 secs)
TOTAL: 3 SUCCESS

</code-example>

The last line of the log shows that Karma ran three tests that all passed.

The test output is displayed in the browser using [Karma Jasmine HTML Reporter](https://github.com/dfederm/karma-jasmine-html-reporter).

<div class="lightbox">

<img alt="Jasmine HTML Reporter in the browser" src="generated/images/guide/testing/initial-jasmine-html-reporter.png">

</div>

Click on a test row to re-run just that test or click on a description to re-run the tests in the selected test group ("test suite").

大多数人都会觉得浏览器中的报告比控制台中的日志更容易阅读。可以点击某一行测试，来单独重跑这个测试，或者点击一行描述信息来重跑所选测试组（“测试套件”）中的那些测试。

Meanwhile, the `ng test` command is watching for changes.

同时，`ng test` 命令还会监听这些变化。

To see this in action, make a small change to `app.component.ts` and save.
The tests run again, the browser refreshes, and the new test results appear.

要查看它的实际效果，就对 `app.component.ts` 做一个小修改，并保存它。这些测试就会重新运行，浏览器也会刷新，然后新的测试结果就出现了。

## Configuration

## 配置

The Angular CLI takes care of Jasmine and Karma configuration for you. It constructs the full configuration in memory, based on options specified in the `angular.json` file.

If you require to fine-tune Karma, follow the below steps:

1. Create a `karma.conf.js` in the root folder of the project.

    <code-example format="javascript" language="javascript" header="karma.conf.js">

    module.exports = function (config) {
      config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
          require('karma-jasmine'),
          require('karma-chrome-launcher'),
          require('karma-jasmine-html-reporter'),
          require('karma-coverage'),
          require('@angular-devkit/build-angular/plugins/karma')
        ],
        client: {
          jasmine: {
            // you can add configuration options for Jasmine here
            // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
            // for example, you can disable the random execution with `random: false`
            // or set a specific seed with `seed: 4321`
          },
          clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        jasmineHtmlReporter: {
          suppressAll: true // removes the duplicated traces
        },
        coverageReporter: {
          dir: require('path').join(__dirname, './coverage/<project-name>'),
          subdir: '.',
          reporters: [
            { type: 'html' },
            { type: 'text-summary' }
          ]
        },
        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        restartOnFileChange: true
      });
    };

    </code-example>

1. In the `angular.json`, use the [`karmaConfig`](cli/test) option to configure the Karma builder to use the created configuration file.

  <code-example format="jsonc" language="jsonc">

  "test": {
    "builder": "@angular-devkit/build-angular:karma",
    "options": {
      "karmaConfig": "karma.conf.js",
      "polyfills": ["zone.js", "zone.js/testing"],
      "tsConfig": "src/tsconfig.spec.json",
      "styles": ["src/styles.css"]
    }
  }

  </code-example>


<div class="alert is-helpful">

Read more about Karma configuration in the [Karma configuration guide](http://karma-runner.github.io/6.4/config/configuration-file.html).

</div>

### Other test frameworks

### 其他测试框架

You can also unit test an Angular application with other testing libraries and test runners.
Each library and runner has its own distinctive installation procedures, configuration, and syntax.

你还可以使用其它的测试库和测试运行器来对 Angular 应用进行单元测试。每个库和运行器都有自己特有的安装过程、配置项和语法。

### Test file name and location

### 测试文件名及其位置

Inside the `src/app` folder the Angular CLI generated a test file for the `AppComponent` named `app.component.spec.ts`.

在 `src/app` 目录中，CLI 为 `AppComponent` 生成了一个名叫 `app.component.spec.ts` 的测试文件。

<div class="alert is-important">

The test file extension **must be `.spec.ts`** so that tooling can identify it as a file with tests (also known as a *spec* file).

测试文件的扩展名**必须是 `.spec.ts`**，这样工具才能识别出它是一个测试文件，也叫规约（spec）文件。

</div>

The `app.component.ts` and `app.component.spec.ts` files are siblings in the same folder.
The root file names (`app.component`) are the same for both files.

`app.component.ts` 和 `app.component.spec.ts` 文件位于同一个文件夹中，而且相邻。其根文件名部分（`app.component`）都是一样的。

Adopt these two conventions in your own projects for *every kind* of test file.

请在你的项目中对*任意类型*的测试文件都坚持这两条约定。

<a id="q-spec-file-location"></a>

#### Place your spec file next to the file it tests

#### 把测试规约（spec）文件放在它要测试的文件旁边

It's a good idea to put unit test spec files in the same folder
as the application source code files that they test:

最好把单元测试规约文件放到与它们测试的应用源码文件相同的文件夹中：

* Such tests are painless to find

  这些测试很容易找到。

* You see at a glance if a part of your application lacks tests

  你一眼就能看到应用中是否缺少一些测试。

* Nearby tests can reveal how a part works in context

  临近的测试可以揭示一个部件会如何在上下文中工作。

* When you move the source (inevitable), you remember to move the test

  当移动源代码时（在所难免），你不会忘了同时移动测试。

* When you rename the source file (inevitable), you remember to rename the test file

  当重命名源文件时（在所难免），你不会忘了重命名测试文件。

<a id="q-specs-in-test-folder"></a>

#### Place your spec files in a test folder

#### 把 spec 文件放到 test 目录下

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

## Testing in continuous integration

## 建立持续集成环境

One of the best ways to keep your project bug-free is through a test suite, but you might forget to run tests all the time.

Continuous integration (CI) servers let you set up your project repository so that your tests run on every commit and pull request.

避免项目出 BUG 的最佳方式之一，就是使用测试套件。但是很容易忘了一直运行它。持续集成（CI）服务器让你可以配置项目的代码仓库，以便每次提交和收到 Pull Request 时就会运行你的测试。

To test your Angular CLI application in Continuous integration \(CI\) run the following command:

<code-example format="shell" language="shell">

ng test --no-watch --no-progress

</code-example>


## More information on testing

## 关于测试的更多信息

After you've set up your application for testing, you might find the following testing guides useful.

当你设置准备好测试环境之后，可能会发现以下测试指南很有用。

|  | Details |
| :-- | :------ |
|  | 详情 |
| [Code coverage](guide/testing-code-coverage) | How much of your app your tests are covering and how to specify required amounts. |
| [代码覆盖](guide/testing-code-coverage) | 找出你的测试覆盖了多少应用，以及如何指定所需的数量。 |
| [Testing services](guide/testing-services) | How to test the services your application uses. |
| [测试服务](guide/testing-services) | 如何测试应用中所用的服务。 |
| [Basics of testing components](guide/testing-components-basics) | Basics of testing Angular components. |
| [测试组件的基础知识](guide/testing-components-basics) | 测试 Angular 组件的基础知识。 |
| [Component testing scenarios](guide/testing-components-scenarios) | Various kinds of component testing scenarios and use cases. |
| [组件测试场景](guide/testing-components-scenarios) | 了解各种组件测试场景和用例。 |
| [Testing attribute directives](guide/testing-attribute-directives) | How to test your attribute directives. |
| [测试属性型指令](guide/testing-attribute-directives) | 如何测试你的属性型指令。 |
| [Testing pipes](guide/testing-pipes) | How to test pipes. |
| [测试管道](guide/testing-pipes) | 如何测试管道。 |
| [Debugging tests](guide/test-debugging) | Common testing bugs. |
| [调试测试代码](guide/test-debugging) | 发现测试代码的常见 BUG。 |
| [Testing utility APIs](guide/testing-utility-apis) | Angular testing features. |
| [测试实用工具 API](guide/testing-utility-apis) | Angular 的测试特性。 |

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-11-02
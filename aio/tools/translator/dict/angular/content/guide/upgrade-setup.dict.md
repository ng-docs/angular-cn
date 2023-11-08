Setup for upgrading from AngularJS

准备从 AngularJS 升级

This guide describes how to develop locally on your own machine.
Setting up a new project on your machine is quick and easy with the [QuickStart seed on GitHub](https://github.com/angular/quickstart "Install the github QuickStart repo").

本指南讲的是如何在你自己的机器上进行本地化开发。利用 [github 上的**《快速上手》种子**](https://github.com/angular/quickstart "安装 github 《快速上手》库")在你的电脑上搭建一个新项目是很快很容易的。

Prerequisites

前提条件

Make sure you have [Node.js® and npm installed](guide/setup-local#prerequisites "Angular prerequisites").

确保你已经安装好了 [Node.js® 和 npm](guide/setup-local#prerequisites "Angular prerequisites")。

<a id="clone"></a>



Clone

克隆

Perform the *clone-to-launch* steps with these terminal commands.

运行下列命令来执行*克隆并启动*步骤。

<a id="download"></a>



Download

下载

[Download the QuickStart seed](https://github.com/angular/quickstart/archive/master.zip "Download the QuickStart seed repository") and unzip it into your project folder.
Then perform the remaining steps with these terminal commands.

[下载《快速上手》种子](https://github.com/angular/quickstart/archive/master.zip "下载《快速上手》种子库") 并解压到你的项目目录中。然后执行下面的命令完成剩余步骤。

<a id="non-essential"></a>



Delete *non-essential* files \(optional\)

删除*非必需*文件（可选）

You can quickly delete the *non-essential* files that concern testing and QuickStart repository maintenance \(***including all git-related artifacts*** such as the `.git` folder and `.gitignore`\).

你可以快速删除一些涉及到测试和维护快速开始版本库的 *非必需* 文件（***包括所有 git 相关的文件***如 `.git` 文件夹和 `.gitignore`！）。

Open a terminal window in the project folder and enter the following commands for your environment:

在项目目录下打开一个终端窗口，并根据你的操作系统执行以下命令：

macOS / Mac OS X \(bash\)



Windows



Update dependency versions

更新依赖版本

Since the quickstart repository is deprecated, it is no longer updated and you need some additional steps to use the latest Angular.

由于不推荐使用快速入门仓库（它已不再更新），所以你需要一些额外的步骤来使用最新的 Angular。

Remove the obsolete `@angular/http` package \(both from `package.json > dependencies` and `src/systemjs.config.js > SystemJS.config() > map`\).

删除过时的 `@angular/http` 包（全都来自 `package.json > dependencies` 和 `src/systemjs.config.js > SystemJS.config() > map`）。

Install the latest versions of the Angular framework packages by running:

通过运行以下命令来安装最新版本的 Angular 框架包：

Install the latest versions of other packages used by Angular \(RxJS, TypeScript, Zone.js\) by running:

通过运行以下命令安装 Angular 用到的其它包的最新版本（RxJS、TypeScript、Zone.js）：

Install the `systemjs-plugin-babel` package.
This will later be used to load the Angular framework files, which are in ES2015 format, using SystemJS.

安装 `systemjs-plugin-babel` 包。稍后它将用于使用 SystemJS 加载 ES2015 格式的 Angular 框架文件。

In order to be able to load the latest Angular framework packages \(in ES2015 format\) correctly, replace the relevant entries in `src/systemjs.config.js`:

为了能正确加载最新的 Angular 框架包（ES2015 格式），请替换 `src/systemjs.config.js` 中的相关条目：

In order to be able to load the latest RxJS package correctly, replace the relevant entries in `src/systemjs.config.js`:

为了能够正确加载最新的 RxJS 包，请替换 `src/systemjs.config.js` 中的相关条目：

In order to be able to load the `tslib` package \(which is required for files transpiled by TypeScript\), add the following entry to `src/systemjs.config.js`:

为了能够加载 `tslib` 包（这是由 TypeScript 转译后的文件所必需的），请将以下条目添加到 `src/systemjs.config.js`：

In order for SystemJS to be able to load the ES2015 Angular files correctly, add the following entries to `src/systemjs.config.js`:

为了使 SystemJS 能够正确加载 ES2015 Angular 文件，请将以下条目添加到 `src/systemjs.config.js`：

Finally, in order to prevent TypeScript typecheck errors for dependencies, add the following entry to `src/tsconfig.json`:

最后，为了防止依赖项的 TypeScript 类型检查错误，请将以下条目添加到 `src/tsconfig.json`：

With that, you can now run `npm start` and have the application built and served.
Once built, the application will be automatically opened in a new browser tab and it will be automatically reloaded when you make changes to the source code.

有了这些，你现在就可以运行 `npm start` 并构建和启动应用程序了。构建后，应用程序将自动在新的浏览器选项卡中打开，并在你更改源代码时自动重新加载。

<a id="seed"></a>



What's in the QuickStart seed?

《快速上手》种子库里都有什么？

The **QuickStart seed** provides a basic QuickStart playground application and other files necessary for local development.
Consequently, there are many files in the project folder on your machine, most of which you can [learn about later](guide/file-structure).

**《快速上手》种子** 提供了一个基本的《快速上手》游乐场应用，以及进行本地开发的其它必要文件。所以，你电脑里的项目目录中有*更多文件*，其中的大部分你都会[在稍后学到](guide/file-structure)。

<a id="app-files"></a>



Focus on the following three TypeScript \(`.ts`\) files in the `/src` folder.

注意 `/src` 目录中以下三个 TypeScript （`.ts`） 文件：

All guides and cookbooks have *at least these core files*.
Each file has a distinct purpose and evolves independently as the application grows.

所有指南和烹饪书都至少有*这几个核心文件*。每个文件都有独特的用途，并且随着应用的成长各自独立演变。

Files outside `src/` concern building, deploying, and testing your application.
They include configuration files and external dependencies.

`src/` 目录之外的文件为构建、部署和测试 app 相关的文件，他们只包括配置文件和外部依赖。

Files inside `src/` "belong" to your application.
Add new Typescript, HTML and CSS files inside the `src/` directory, most of them inside `src/app`, unless told to do otherwise.

`src/` 目录下的文件才“属于”你的 app。除非明确指出，否则教程中添加的 TypeScript，HTML 和 CSS 文件都在 `src/` 目录下，大多数在 `src/app` 目录中。

The following are all in `src/`

`src/` 目录文件详情如下：

main.ts

main.ts

Compiles the application with the [JIT compiler](guide/glossary#jit) and [bootstraps](guide/bootstrapping) the application's main module \(`AppModule`\) to run in the browser. The JIT compiler is a reasonable choice during the development of most projects and it's the only viable choice for a sample running in a *live-coding* environment such as Stackblitz. Alternative [compilation](guide/aot-compiler), [build](guide/build), and [deployment](guide/deployment) options are available.

使[即时 （JIT） 编译器](guide/glossary#jit)用编译应用并且在浏览器中[启动](guide/bootstrapping "启动应用")并运行应用。对于大多数项目的开发，这都是合理的选择。而且它是在像 Stackblitz 这样的*在线编程*环境中运行例子的唯一选择。你将在本文档中学习其它编译和开发选择。

app/app.module.ts

app/app.module.ts

Defines `AppModule`, the  [root module](guide/bootstrapping "AppModule: the root module") that tells Angular how to assemble the application. When initially created, it declares only the `AppComponent`. Over time, you add more components to declare.

定义 `AppModule`，[根模块](guide/bootstrapping "AppModule: 根模块")为 Angular 描述如何组装应用。目前，它只声明了 `AppComponent`。不久，它将声明更多组件。

app/app.component.ts

app/app.component.ts

Defines the same `AppComponent` as the one in the QuickStart playground. It is the **root** component of what will become a tree of nested components as the application evolves.

定义与《快速上手》游乐场同样的 `AppComponent`。它是**根**组件，随着应用的演变，它将变成一颗嵌套组件树。

File

文件

Purpose

用途

Appendix: Test using `fakeAsync()/waitForAsync()`

附录：使用 `fakeAsync()/waitForAsync()` 进行测试

If you use the `fakeAsync()` or `waitForAsync()` helper functions to run unit tests \(for details, read the [Testing guide](guide/testing-components-scenarios#fake-async)\), you need to import `zone.js/testing` in your test setup file.

如果你使用 `fakeAsync()` 或 `async()` 辅助函数来运行单元测试（详情参阅[测试指南](guide/testing-components-scenarios#fake-async)），就要在测试的准备文件中导入 `zone.js/testing`。

And in the earlier versions of `Angular`, the following files were imported or added in your html file:

在以前版本的 `Angular` 中，下列文件曾被导入或添加到 html 文件中：

You can still load those files separately, but the order is important, you must import `proxy` before `sync-test`, `async-test`, `fake-async-test` and `jasmine-patch`.
And you also need to import `sync-test` before `jasmine-patch`, so it is recommended to just import `zone-testing` instead of loading those separated files.

你仍然可以分别导入这些文件，不过导入顺序很重要，你必须在 `sync-test`、`async-test`、`fake-async-test` 和 `jasmine-patch` 之前导入 `proxy`。还要注意在 `jasmine-patch` 之前导入 `sync-test`。所以，建议你只导入 `zone-testing` 而不要分别加载那些文件。
# Prepare to edit Angular documentation

# 准备编辑 Angular 文档

This topic describes the steps that prepare your local computer to edit and submit Angular documentation.

本主题介绍了让本地计算机准备好编辑和提交 Angular 文档的步骤。

<div class="alert is-important">

**IMPORTANT**: <br />
To submit changes to the Angular documentation, you must have:

*   A [GitHub][GithubMain] account
*   A signed [Contributor License Agreement][GithubAngularAngularBlobMainContributingSigningTheCla]

</div>

## Complete a contributor's license agreement

## 完成贡献者的许可协议

Review [Contributing to Angular](https://github.com/angular/angular/blob/main/CONTRIBUTING.md).
These sections are particularly important for documentation contributions:

查看[对 Angular 的贡献](https://github.com/angular/angular/blob/main/CONTRIBUTING.md)。这些部分对于文档贡献特别重要：

1. Read the Angular [Code of conduct](https://github.com/angular/code-of-conduct/blob/main/CODE_OF_CONDUCT.md)

   阅读 Angular[行为准则](https://github.com/angular/code-of-conduct/blob/main/CODE_OF_CONDUCT.md)

1. Read the [Submission guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-submission-guidelines).

   阅读[提交指南](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-submission-guidelines)。

   <div class="alert is-helpful">

   **NOTE**: <br />
   The topics in this section explain these guidelines specifically for documentation contributions.

   </div>

1. Read and complete the [Contributor license agreement](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-signing-the-cla) that applies to you.

   阅读并完成适用于你的[贡献者许可协议](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-signing-the-cla)。

## Install the required software

## 安装所需的软件

To edit, build, and test Angular documentation on your local computer, you need the following software.
The instructions in this section assume that you are using the software in this list to complete the tasks.

要在本地计算机上编辑、构建和测试 Angular 文档，你需要以下软件。本节中的说明假定你使用此列表中的软件来完成任务。

Some software in this list, such as the integrated development environment (IDE), can be substituted with similar software.
If you use a substitute IDE, you might need to adapt the instructions in this section to your IDE.

此列表中的某些软件，例如集成开发环境 (IDE)，可以用类似的软件替换。如果你使用替代 IDE，你可能需要将本节中的说明适应你的 IDE。

For more information about the required software, see [Setting up the local environment and workspace](guide/setup-local).

有关所需软件的更多信息，请参阅[设置本地环境和工作区](guide/setup-local)。

* **Version control software**

  **版本控制软件**

  * [Git command line](https://github.com/git-guides/install-git)

    [Git 命令行](https://github.com/git-guides/install-git)

  * [GitHub desktop](https://desktop.github.com) (optional)

    [GitHub 桌面](https://desktop.github.com)（可选）

* **Integrated development environment**

  **集成开发环境**

  * [Visual Studio Code](https://code.visualstudio.com)

    [Visual Studio 代码](https://code.visualstudio.com)

* **Utility software**

  **工具软件**

  * [node.js](https://nodejs.org/en/download)

    Angular requires an [active long-term-support (LTS) or maintenance LTS version](https://nodejs.org/about/releases) of Node.js.

    Angular 需要[活动的长期支持 (LTS) 或维护 LTS 版本](https://nodejs.org/about/releases)的 Node.js。

  * [nvm](https://github.com/nvm-sh/nvm#about)

    [非虚拟机](https://github.com/nvm-sh/nvm#about)

  * [Yarn](https://yarnpkg.com/getting-started/install)

    [纱线](https://yarnpkg.com/getting-started/install)

  * [Homebrew](https://brew.sh) for macOS or [Chocolatey](https://chocolatey.org/install) for Windows

    macOS 的[Homebrew](https://brew.sh)或 Windows 的[Chocolatey](https://chocolatey.org/install)

  * [Vale][GithubAngularAngularTreeMainAioToolsDocLinterInstallValeOnYourDevelopmentSystemReadmeMd] (see note)

    [淡水河谷][GithubAngularAngularTreeMainAioToolsDocLinterInstallValeOnYourDevelopmentSystemReadmeMd]（见注）

<div class="alert is-important">

**IMPORTANT**: <br />
Wait until after you clone your fork of the [`https://github.com/angular/angular`][GithubAngularAngular] repo to your local computer before you configure Vale settings.

</div>

You can also install other tools and IDE extensions that you find helpful.

你还可以安装你认为有帮助的其他工具和 IDE 扩展。

## Set up your workspaces

## 设置你的工作区

The Angular documentation is stored with the Angular framework code in a GitHub source code repository, also called a *repo*, at:
<https://github.com/angular/angular>.
To contribute documentation to Angular, you need:

Angular 文档与 Angular 框架代码一起存储在 GitHub 源代码存储库（也称为*repo* ）中，位于： <https://github.com/angular/angular> 。要向 Angular 贡献文档，你需要：

* A GitHub account

  GitHub 帐户

* A *fork* of the Angular repo in your personal GitHub account.

  你个人 GitHub 帐户中 Angular 存储库的*fork* 。

  This guide refers to your personal GitHub account as `personal`.
  You must replace `personal` in a GitHub reference with your GitHub username.
  The URL:
  `https://github.com/personal` is not a valid GitHub account.
  For convenience, this documentation uses these shorthand references:

  本指南将你的 `personal` GitHub 帐户称为 Personal 。你必须将 GitHub 引用中的 `personal` 替换为你的 GitHub 用户名。 URL： `https://github.com/personal` 不是有效的 GitHub 帐户。为方便起见，本文档使用这些速记引用：

  * `angular/angular`

    Refers to the Angular repo.
    This is also known as the *upstream* repo.

    指 Angular 存储库。这也称为*上游*存储库。

  * `personal/angular`

    Refers to your personal fork of the Angular repo.
    Replace `personal` with your GitHub username to identify your specific repo.
    This is also known as the *origin* repo.

    指你的 Angular 存储库的个人 fork。将 `personal` 替换为你的 GitHub 用户名以标识你的特定存储库。这也称为*原始*存储库。

* A *clone* of your `personal/angular` repo on your local computer

  在本地计算机上*复制*你的 `personal/angular` 存储库

GitHub repos are cloned into a `git` workspace on your local computer.
With this workspace and required tools, you can build, edit, and review the documentation from your local computer.

GitHub 存储库被克隆到你本地计算机上的 `git` 工作区。使用此工作区和所需的工具，你可以从本地计算机构建、编辑和查看文档。

When you can build the documentation from a workspace on your local computer, you are ready to make major changes to the Angular documentation.

当你可以从本地计算机上的工作区构建文档时，你就可以对 Angular 文档进行重大更改。

For more detailed information about how to set up your workspace, see [Create your repo and workspaces for Angular documentation](#create-your-repo-and-workspace-for-angular-documentation).

有关如何设置工作区的更详细信息，请参阅[为 Angular 文档创建存储库和工作区](#create-your-repo-and-workspace-for-angular-documentation)。

For more detailed information about how to build and test the documentation from your local computer, see [Build and test the Angular documentation](#build-and-test-the-angular-documentation).

有关如何从本地计算机构建和测试文档的更详细信息，请参阅[构建和测试 Angular 文档](#build-and-test-the-angular-documentation)。

## Create your repo and workspace for Angular documentation

## 为 Angular 文档创建你的存储库和工作区

This section describes how to create the repo and the `git` workspace necessary to edit, test, and submit changes to the Angular documentation.

本节介绍如何创建编辑、测试和提交对 Angular 文档的更改所需的存储库和 `git` 工作区。

<div class="alert is-important">

**IMPORTANT**: <br />
Because `git` commands are not beginner friendly, the topics in this section include procedures that should reduce the chance of `git` mishaps.
Fortunately, because you are working in your own account, even if you make a mistake, you can't harm any of the Angular code or documentation.

To follow the procedures in these topics, you must use the repo and directory configuration presented in this topic.
The procedures in these topics are designed to work with this configuration.

If you use a different configuration, the procedures in these topics might not work as expected and you could lose some of your changes.

</div>

The code and documentation for the Angular framework are stored in a public repository, or repo, on [github.com](https://github.com) in the `angular` account.
The path to the Angular repo is <https://github.com/angular/angular>, hence the abbreviated name, `angular/angular`.

Angular 框架的代码和文档存储在[github.com](https://github.com)上的 `angular` 帐户的公共存储库或存储库中。 Angular 存储库的路径是<https://github.com/angular/angular> ，因此是缩写名称 `angular/angular` 。

[GitHub](https://github.com) is a cloud service that hosts many accounts and repositories.
You can imagine the `angular/angular` repo in GitHub as shown in this image.

[GitHub](https://github.com)是一项托管许多帐户和存储库的云服务。你可以想象 GitHub 中的 `angular/angular` 存储库，如图所示。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="An image of the angular/angular repo in the github.com cloud service" src="generated/images/guide/doc-prepare-to-edit/github-angular-cloud.png">

</div>

### Fork the `angular/angular` repo to your account

### 将 `angular/angular` 存储库 fork 到你的帐户

As a public repo, `angular/angular` is available for anyone to read and copy, but not to change.
While only specific accounts have permission to make changes to `angular/angular`, anyone with a GitHub account can request a change to it.
Change requests to `angular/angular` are called *pull requests*.
A pull request is created by one account to ask another account to pull in a change.

作为公共存储库， `angular/angular` 可供任何人阅读和复制，但不能更改。虽然只有特定帐户有权对 `angular/angular` 进行更改，但拥有 GitHub 帐户的任何人都可以请求更改它。对 `angular/angular` 的更改请求称为*Pull Request* 。一个帐户创建 Pull Request 以请求另一个帐户提取更改。

Before you can open a pull request, you need a forked copy of `angular/angular` in your personal GitHub account.

在打开 Pull Request 之前，你需要个人 GitHub 帐户中的 `angular/angular` 的 fork 副本。

To get a forked copy of `angular/angular`, you fork the `angular/angular` repo into your personal GitHub account and end up with the repos shown in the following image.
From the perspective of `personal/angular`, `angular/angular` is the upstream repo and `personal/angular` is the origin repo.

要获取 `angular/angular` 的 fork 副本，你将 `angular/angular` 存储库 fork 到你的个人 GitHub 帐户中，并最终获得下图所示的存储库。从 `personal/angular` 的角度来看， `angular/angular` 是上游存储库， `personal/angular` 是原始存储库。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="An image of the angular/angular repo in the github.com cloud service that was forked to a personal account" src="generated/images/guide/doc-prepare-to-edit/github-personal-cloud.png">

</div>

#### To fork the angular repo to your account

#### 将 Angular 存储库 fork 到你的帐户

Perform this procedure in a browser.

在浏览器中执行此过程。

1. Sign into your [GitHub](https://github.com) account.
   If you don't have a GitHub account, [create a new account][GithubJoin] before you continue.

   登录你的[GitHub](https://github.com)帐户。如果你没有 GitHub 帐户，请在继续之前[创建一个新帐户][GithubJoin]。

1. Navigate to [`https://github.com/angular/angular`][GithubAngularAngular].

   导航到[`https://github.com/angular/angular`][GithubAngularAngular] 。

1. In [`https://github.com/angular/angular`][GithubAngularAngular], click the **Fork** button near the top-right corner of the page.
   This image is from the top of the [`https://github.com/angular/angular`][GithubAngularAngular] page and shows the **Fork** button.

   在[`https://github.com/angular/angular`][GithubAngularAngular]中，单击页面右上角附近的**Fork**按钮。此图片来自[`https://github.com/angular/angular`][GithubAngularAngular]页面的顶部，并显示了**Fork**按钮。

   <div class="lightbox">

   <img alt="An image of the angular/angular website in github.com that identifies the fork button" src="generated/images/guide/doc-prepare-to-edit/angular-angular-github.png">

   </div>

1. In **Create a new fork**:

   在**创建新 fork**中：

   1. Accept the default values in **Owner** and **Repository name**.

      接受**Owner**和**Repository name**中的默认值。

   1. Confirm that **Copy the `main` branch only** is checked.

      确认选中**了仅复制 `main` 分支**。

   1. Click **Create repository**.
      The forking process can take a few minutes.

      单击**创建存储库**。 forking 过程可能需要几分钟。

1. You now have a copy of the `angular/angular` repo in your GitHub account.

   你现在在 GitHub 帐户中有了 `angular/angular` 存储库的副本。

After your fork of `angular/angular` is ready, your browser opens the web page of the forked repo in your GitHub account.
In this image, notice that the account now shows the username of your personal GitHub account instead of the `angular` account.

在你的 `angular/angular` 的 fork 就绪后，你的浏览器会在你的 GitHub 帐户中打开 fork 存储库的网页。在此图中，请注意该帐户现在显示了你的个人 GitHub 帐户的用户名，而不是 `angular` 帐户。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="An image of the personal/angular website in github.com that identifies the fork forked repo" src="generated/images/guide/doc-prepare-to-edit/personal-angular-github.png">

</div>

As a forked repo, your new repo maintains a reference to `angular/angular`.
From your account, `git` considers your `personal/angular` repo as the origin repo and `angular/angular` as the upstream repo.
You can think of this as: your changes originate in the *origin* repo and you send them *upstream* to the `angular/angular` repo.
The message below the repo name in your account, `forked from angular/angular`, contains a link back to the upstream repo.

作为分叉的存储库，你的新存储库会保持对 `angular/angular` 的引用。在你的帐户中， `git` 将你的 `personal/angular` 存储库视为原始存储库，将 `angular/angular` 视为上游存储库。你可以将其视为：你的更改源自*原始*存储库，并且你将它们发送到*上游*的 `angular/angular` 存储库。你帐户中存储库名称下方的消息（ `forked from angular/angular` ）包含一个返回上游存储库的链接。

This relationship comes into play later, such as when you update your `personal/angular` repo and when you open a pull request.

这种关系稍后会发挥作用，例如当你更新 `personal/angular` 存储库以及打开 Pull Request 时。

### Create a git workspace on your local computer

### 在本地计算机上创建 git 工作区

A `git` workspace on your local computer is where copies of GitHub repos in the cloud are stored on your local computer. To edit Angular documentation on your local computer, you need a clone of your origin repo, `personal/angular`.

本地计算机上的 `git` 工作区是云中 GitHub 存储库的副本存储在本地计算机上的地方。要在本地计算机上编辑 Angular 文档，你需要原始存储库的克隆 `personal/angular` 。

Clone the `personal/angular` repo into the subdirectory for your account, as this illustration shows.
Remember to replace `personal` with your GitHub username.
The `personal/angular` directory in your workspace becomes your `working` directory.
You do your editing in the working directory of your `personal/angular` repo.

如图所示，将 `personal/angular` 存储库克隆到你帐户的子目录中。请记住将 `personal` 替换为你的 GitHub 用户名。工作区中的 `personal/angular` 目录将成为你的 `working` 目录。你在 `personal/angular` 存储库的工作目录中进行编辑。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="An image of the angular repo from the angular and personal accounts in the github.com cloud service as they are cloned into local computer workspaces" src="generated/images/guide/doc-prepare-to-edit/github-clone-img.png">

</div>

Cloning a repo duplicates the repo that's in the cloud on your local computer.
There are procedures to keep the clone on your local computer in sync with the repo in the cloud that are described later.

克隆存储库会复制本地计算机上云中的存储库。有一些过程可以使本地计算机上的克隆与云中的存储库同步，稍后会介绍。

#### To clone the Angular repo into your workspace

#### 将 Angular 存储库克隆到你的工作区

Perform these steps in a command-line tool on your local computer.

在本地计算机上的命令行工具中执行这些步骤。

1. Navigate to the `workspace` directory.
   In this example, this is the directory named, `github-projects`.

   导航到 `workspace` 目录。在此示例中，这是名为 `github-projects` 的目录。

   <div class="lightbox">

   <!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
   <img alt="An image of the project directory on a local computer" src="generated/images/guide/doc-prepare-to-edit/pc-directory-start-img.png">

   </div>

   If this directory isn't on your local computer, create it, and then navigate to it before you continue.

   如果此目录不在你的本地计算机上，请创建它，然后在继续之前导航到它。

1. From the workspace directory, run this command to create a directory for the repo from your `personal` account
   Remember to replace `personal` with your GitHub username.

   在工作区目录中，运行此命令以从你的 `personal` 帐户为存储库创建一个目录，请记住将 `personal` 替换为你的 GitHub 用户名。

   <code-example format="shell" language="shell">

   mkdir personal

   </code-example>

1. From the workspace directory, run this command to clone the origin `personal/angular` repo into the `personal` account directory.
   Remember to replace `personal` with your GitHub username.

   从工作区目录，运行此命令以将原始 `personal/angular` 存储库克隆到 `personal` 帐户目录。请记住将 `personal` 替换为你的 GitHub 用户名。

   <!-- markdownLint-disable MD034 -->

   <code-example format="shell" language="shell">

   git clone https://github.com/personal/angular personal/angular

   </code-example>

   <!-- markdownLint-enable MD034 -->

Your local computer is now configured as shown in the following illustration.

你的本地计算机现在已配置为如下图所示。

<a id="doc-working-directory"></a>

Your `working` directory is the `personal/angular` directory in your `git` workspace directory.
This directory and its subdirectories have the files that you edit to fix documentation issues.

你的 `working` 目录是 `git` 工作区目录中的 `personal/angular` 目录。此目录及其子目录包含你为解决文档问题而编辑的文件。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="An image of the working directories on a local computer" src="generated/images/guide/doc-prepare-to-edit/pc-directory-config-img.png">

</div>

### Complete the software installation

### 完成软件安装

After you clone the origin repo on your local computer, run these commands from a command-line tool:

在本地计算机上克隆原始存储库后，从命令行工具运行这些命令：

1. Install the npm modules used by the Angular project.
   In a command line tool on your local computer:

   安装 Angular 项目使用的 npm 模块。在本地计算机上的命令行工具中：

   1. Navigate to your `git` workspace.
      In this example, this is the `github-projects` directory.

      导航到你的 `git` 工作区。在此示例中，这是 `github-projects` 目录。

   1. In your `git` workspace, run this command to navigate to the documentation root directory in your clone of the `personal/angular` repo.
      Remember to replace `personal` with your GitHub username.

      在你的 `git` 工作区中，运行此命令以导航到你的 `personal/angular` 存储库克隆中的文档根目录。请记住将 `personal` 替换为你的 GitHub 用户名。

      <code-example format="shell" language="shell">

      cd personal/angular

      </code-example>

   1. Run this command to install the Angular dependencies.

      运行此命令以安装 Angular 依赖项。

      <code-example format="shell" language="shell">

      yarn install

      </code-example>

   1. Run this command to navigate to the documentation project.

      运行此命令以导航到文档项目。

      <code-example format="shell" language="shell">

      cd aio

      </code-example>

   1. Run this command to install the npm modules for the documentation.

      运行此命令以安装文档的 npm 模块。

      <code-example format="shell" language="shell">

      yarn setup

      </code-example>

1. Locate `angular/aio/tools/doc-linter/vale.ini` in your working directory to use in the next step as the path to the configuration file in the  **Vale:Config** setting.

   在你的工作目录中定位 `angular/aio/tools/doc-linter/vale.ini` ，以在下一步中用作**Vale:Config**设置中配置文件的路径。

1. [Install Vale][GithubAngularAngularTreeMainAioToolsDocLinterInstallValeOnYourDevelopmentSystemReadmeMd] to complete the software installation.

   [安装 Vale][GithubAngularAngularTreeMainAioToolsDocLinterInstallValeOnYourDevelopmentSystemReadmeMd]以完成软件安装。

## Build and test the Angular documentation

## 构建和测试 Angular 文档

Angular provides tools to build and test the documentation.
To review your work and before you submit your updates in a pull request, be sure to build, test, and verify your changes using these tools.

Angular 提供了一些工具来构建和测试文档。要查看你的工作，并在你在 Pull Request 中提交更新之前，请确保使用这些工具构建、测试和验证你的更改。

<div class="alert is-important">

Note that the instructions found in [https://github.com/angular/angular/blob/main/docs/DEVELOPER.md](https://github.com/angular/angular/blob/main/docs/DEVELOPER.md) are to build and test the Angular framework and not the Angular documentation.

The procedures on this page build only the Angular documentation.
You don't need to build the Angular framework to build the Angular documentation.

</div>

<!-- markdownLint-disable MD033 -->

### To navigate to the Angular documentation directory

### 导航到 Angular 文档目录

Perform these steps from a command-line tool on your local computer.

从本地计算机上的命令行工具执行这些步骤。

1. Navigate to the Angular documentation in the working directory of your account in your `git` workspace on your local computer.

   导航到本地计算机上 `git` 工作区中帐户工作目录中的 Angular 文档。

1. Navigate to your `git` workspace directory.
   In this example, this is the `github-projects` directory.

   导航到你的 `git` 工作区目录。在此示例中，这是 `github-projects` 目录。

   1. Run this command to navigate to the working directory with the `angular` repo you forked to your personal account.
      Remember to replace `personal` with your GitHub username.

      运行此命令，以导航到使用你 fork 到个人帐户的 `angular` 存储库的工作目录。请记住将 `personal` 替换为你的 GitHub 用户名。

      <code-example format="shell" language="shell">

      cd personal/angular

      </code-example>

   1. Run this command to navigate to the Angular documentation directory.

      运行此命令以导航到 Angular 文档目录。

      <code-example format="shell" language="shell">

      cd aio

      </code-example>

The Angular documentation directory is the root of the Angular documentation files.
These directories in the `angular/aio` directory are where you find the files that are edited the most.

Angular 文档目录是 Angular 文档文件的根。 `angular/aio` 目录中的这些目录是你找到编辑最多的文件的地方。

| Directory | Files |
| :-------- | :---- |
| Directory | 文件 |
| `angular/aio/content` | Files and other assets used in the Angular documentation |
| `angular/aio/content` | Angular 文档中使用的文件和其他资产 |
| `angular/aio/content/guide` | The markdown files for most Angular documentation |
| `angular/aio/content/guide` | 大多数 Angular 文档的 Markdown 文件 |
| `angular/aio/content/tutorial` | The markdown files used by the Tour of Heroes tutorial |
| `angular/aio/content/tutorial` | 英雄之旅教程使用的 Markdown 文件 |

The Angular documentation source has many other directories in `angular/aio` but they don't change often.

Angular 文档源在 `angular/aio` 中有许多其他目录，但它们不会经常更改。

### To build and view the Angular documentation on your computer

### 在你的计算机上构建和查看 Angular 文档

Perform these steps from a command-line tool on your local computer.

从本地计算机上的命令行工具执行这些步骤。

1. Build the Angular documentation.

   构建 Angular 文档。

   1. From the Angular documentation directory, run this command:

      从 Angular 文档目录，运行以下命令：

      <code-example format="shell" language="shell">

      yarn build

      </code-example>

   1. If building the documentation reports one or more errors, fix the errors and repeat the previous step before you continue.

      如果构建文档报告了一个或多个错误，请修复错误并在继续之前重复上一步。

1. Start the local documentation server.

   启动本地文档服务器。

   1. From the documentation directory, run this command:

      从文档目录中，运行以下命令：

      <code-example format="shell" language="shell">

      yarn serve-and-sync

      </code-example>

   1. Open a browser on your local computer and view your documentation at `https://localhost:4200`.

      在本地计算机上打开浏览器，并在 `https://localhost:4200` 上查看你的文档。

1. Review the documentation in the browser.

   在浏览器中查看文档。

### To run the automated tests on the Angular documentation

### 在 Angular 文档上运行自动测试

Perform these steps from a command-line tool on your local computer.

从本地计算机上的命令行工具执行这些步骤。

1. [Navigate to the documentation directory](#to-navigate-to-the-angular-documentation-directory), if you're not already there.

   如果你还不在那里，[请导航到文档目录](#to-navigate-to-the-angular-documentation-directory)。

1. From the documentation directory, run this command to build the documentation before you test it:

   从文档目录，在测试之前运行此命令以构建文档：

   <code-example format="shell" language="shell">

   yarn build

   </code-example>

1. If building the documentation returns one or more errors, fix those and build the documentation again before you continue.

   如果构建文档返回一个或多个错误，请修复这些错误并在继续之前再次构建文档。

1. From the documentation directory, run this command to start the automated tests that verify the docs are consistent.
   These are most, but not all, of the tests that are performed after you open your pull request.
   Some tests can only be run in the automated testing environment.

   从文档目录，运行此命令以启动验证文档一致的自动测试。这些是打开 Pull Request 后执行的大多数测试，但不是全部。某些测试只能在自动测试环境中运行。

   <code-example format="shell" language="shell">

   yarn e2e

   </code-example>

When you run these tests on your documentation updates, be sure to correct any errors before you open a pull request.

当你对文档更新运行这些测试时，请确保在打开 Pull Request 之前更正任何错误。

## Next steps

## 下一步

After you build the documentation from your forked repo on your local computer and the tests run without error, you are ready to continue.

从本地计算机上的 fork 存储库构建文档并且测试运行没有错误后，你就可以继续了。

You have successfully configured your local computer to edit Angular documentation and open pull requests.

你已成功配置本地计算机以编辑 Angular 文档并打开 Pull Request。

Continue to the other topics in this section for information about how to perform other documentation tasks.

继续阅读本节中的其他主题，以获取有关如何执行其他文档任务的信息。

<!-- links -->

<!-- external links -->

[GithubJoin]: https://github.com/join "Join GitHub | GitHub"

[GithubMain]: https://github.com "GitHub"

[GithubAngularAngular]: https://github.com/angular/angular "angular/angular | GitHub"

[GithubAngularAngularBlobMainContributingSigningTheCla]: https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-signing-the-cla "Signing the CLA - Contributing to Angular | angular/angular | GitHub"

[GithubAngularAngularTreeMainAioToolsDocLinterInstallValeOnYourDevelopmentSystemReadmeMd]: https://github.com/angular/angular/tree/main/aio/tools/doc-linter/README.md#install-vale-on-your-development-system "Install Vale on your development system - Angular documentation lint tool | angular/angular | Github"

<!-- end links -->

@reviewed 2022-10-12
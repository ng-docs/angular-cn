# Start to edit a documentation topic

# 开始编辑文档主题

<!-- markdownLint-disable MD001 -->

This topic describes the tasks that you perform when you start to work on a documentation issue.

本主题介绍当你开始处理文档问题时要执行的任务。

The documentation in angular.io is built from [markdown](https://en.wikipedia.org/wiki/Markdown) source code files.
The markdown source code files are stored in the `angular` repo that you forked into your GitHub account.

angular.io 中的文档是从[markdown](https://en.wikipedia.org/wiki/Markdown)源代码文件构建的。 Markdown 源代码文件存储在你 fork 到 GitHub 帐户中的 `angular` 存储库中。

To update the Angular documentation, you need:

要更新 Angular 文档，你需要：

* A clone of `personal/angular`

  `personal/angular` 的克隆

  You created this when you [created your workspace](guide/doc-prepare-to-edit#create-a-git-workspace-on-your-local-computer).
  Before you start editing a topic, [update your clone of `personal/angular`](#update-your-fork-with-the-upstream-repo).

  你在[创建工作区](guide/doc-prepare-to-edit#create-a-git-workspace-on-your-local-computer)时创建了它。在开始编辑主题之前，请[更新你的 `personal/angular` 克隆](#update-your-fork-with-the-upstream-repo)。

* A `working` branch that you create from an up-to-date `main` branch.

  你从最新的 `main` 分支创建的 `working` 分支。

  Creating your `working` branch is described [later in this topic](#create-a-working-branch-for-editing).

  [本主题后面](#create-a-working-branch-for-editing)会介绍如何创建 `working` 分支。

<!-- markdownLint-disable MD033 -->

The procedures in this topic assume that the files on your local computer are organized as illustrated in the following diagram. On your local computer, you should have:

本主题中的过程假定本地计算机上的文件的组织方式如下图所示。在你的本地计算机上，你应该有：

* Your 'git' workspace directory.
  In this example, the path to your 'git' workspace directory is `github-projects`.

  你的 'git' 工作区目录。在此示例中，你的 “git” 工作空间目录的路径是 `github-projects` 。

* Your working directory, which is the directory that you created when you cloned your fork into your `git` workspace.
  In this example, the path to your working directory is `github-projects/personal/angular`, where `personal` is replaced with your GitHub username.

  你的工作目录，这是你将 fork 克隆到 `git` 工作区时创建的目录。在此示例中，你的工作目录的路径是 `github-projects/personal/angular` ，其中的 `personal` 被替换为你的 GitHub 用户名。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="An image of the working directories on a local computer" src="generated/images/guide/doc-update-start/pc-directory-config.png">

</div>

<div class="alert is-important">

**IMPORTANT**: <br />
Remember to replace `personal` with your GitHub username in the commands and examples in this topic.

</div>

The procedures in this topic assume that you are starting from your workspace directory.

本主题中的过程假定你是从工作区目录启动的。

## Update your fork with the upstream repo

## 使用上游存储库更新你的 fork

Before you start editing the documentation files, you want to sync the `main` branch of your fork and its clone with the `main` branch of the upstream `angular/angular` repo.

在开始编辑文档文件之前，你希望将 fork 的 `main` 分支及其克隆与上游 `angular/angular` 存储库的 `main` 分支同步。

This procedure updates the your `personal/angular` repo in the cloud and its clone on your local computer, as illustrated here.
The circled numbers correspond to procedure steps.

此过程会更新你在云端的 `personal/angular` 存储库及其本地计算机上的克隆，如此处所示。带圆圈的数字对应于过程步骤。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="An image of the git fetch/merge/push process used to update the local computer" src="generated/images/guide/doc-update-start/github-fetch-merge.png">

</div>

#### To update your fork and its clone with the upstream repo

#### 使用上游存储库更新你的 fork 及其克隆

Perform these steps from a command-line tool on your local computer.

从本地计算机上的命令行工具执行这些步骤。

1. From your [workspace](guide/doc-prepare-to-edit#create-a-git-workspace-on-your-local-computer) directory, run this command to navigate to your [working directory](guide/doc-prepare-to-edit#doc-working-directory).
   This step is not shown in the image.
   Remember to replace `personal` with your GitHub username.

   从你的[工作区](guide/doc-prepare-to-edit#create-a-git-workspace-on-your-local-computer)目录，运行此命令以导航到你的[工作目录](guide/doc-prepare-to-edit#doc-working-directory)。图像中未显示此步骤。请记住将 `personal` 替换为你的 GitHub 用户名。

   <code-example format="shell" language="shell">

   cd personal/angular

   </code-example>

1. Run this command to check out the `main` branch.
   This step is not shown in the image.

   运行此命令以签出 `main` 分支。图像中未显示此步骤。

   <code-example format="shell" language="shell">

   git checkout main

   </code-example>

1. Run this command to update the `main` branch in the working directory on your local computer from the upstream `angular/angular` repo.

   运行此命令，以从上游 `angular/angular` 存储库更新本地计算机工作目录中的 `main` 分支。

   <code-example format="shell" language="shell">

   git fetch upstream
   git merge upstream/main

   </code-example>

1. Run this command to update your `personal/angular` repo on `github.com` with the latest from the upstream `angular/angular` repo.

   运行此命令，使用上游 `angular/angular` 存储库中的最新内容更新你在 `github.com` 上的 `personal/angular` 存储库。

   <code-example format="shell" language="shell">

   git push

   </code-example>

The `main` branch on your local computer is now in sync with your origin repo on `github.com`.
They have been updated with any changes that have been made to the upstream `angular/angular` repo since the last time you updated your fork.

你本地计算机上的 `main` 分支现在与你在 `github.com` 上的原始存储库同步。自你上次更新 fork 以来，它们已经使用对上游 `angular/angular` 存储库所做的任何更改进行了更新。

## Create a working branch for editing

## 创建工作分支进行编辑

All your edits to the Angular documentation are made in a `working` branch in the clone of `personal/angular` on your local computer.
You create the working branch from the up-to-date `main` branch of `personal/angular` on your local computer.

你对 Angular 文档的所有编辑都是在本地计算机上 `personal/angular` 克隆的 `working` 分支中进行的。你从本地计算机上的 `personal/angular` 的最新 `main` 分支创建工作分支。

A working branch keeps your changes to the Angular documentation separate from the published documentation until it is ready.
A working branch also keeps your edits for one issue separate from those of another issue.
Finally, a working branch identifies the changes you made in the pull request that you submit when you're finished.

工作分支会将你对 Angular 文档的更改与已发布的文档分开，直到它准备就绪。工作分支还会将你对一个问题的编辑与另一个问题的编辑分开。最后，一个工作分支会识别你在完成后提交的 Pull Request 中所做的更改。

<div class="alert is-important">

**IMPORTANT**: <br />
Before you edit any Angular documentation, make sure that you are using the correct `working` branch.
You can confirm your current branch by running `git status` from your `working` directory before you start editing.

</div>

#### To create a `working` branch for editing

#### 创建 `working` 分支进行编辑

Perform these steps in a command-line program on your local computer.

在本地计算机上的命令行程序中执行这些步骤。

1. [Update your fork of `angular/angular`](#update-your-fork-with-the-upstream-repo).

   [更新你的 `angular/angular` 的 fork](#update-your-fork-with-the-upstream-repo) 。

1. From your [workspace](guide/doc-prepare-to-edit#create-a-git-workspace-on-your-local-computer) directory, run this command to navigate to your [working directory](guide/doc-prepare-to-edit#doc-working-directory).
   Remember to replace `personal` with your GitHub username.

   从你的[工作区](guide/doc-prepare-to-edit#create-a-git-workspace-on-your-local-computer)目录，运行此命令以导航到你的[工作目录](guide/doc-prepare-to-edit#doc-working-directory)。请记住将 `personal` 替换为你的 GitHub 用户名。

   <code-example format="shell" language="shell">

   cd personal/angular

   </code-example>

1. Run this command to check out the `main` branch.

   运行此命令以签出 `main` 分支。

   <code-example format="shell" language="shell">

   git checkout main

   </code-example>

1. Run this command to create your working branch.
   Replace `working-branch` with the name of your working branch.

   运行此命令以创建你的工作分支。将 `working-branch` 替换为你的工作分支的名称。

   Name your working branch something that relates to your editing task, for example, if you are resolving `issue #12345`, you might name the branch, `issue-12345`.
   If you are improving error messages, you might name it, `error-message-improvements`.
   A branch name can have alphanumeric characters, hyphens, underscores, and slashes, but it can't have any spaces or other special characters.

   为你的工作分支命名与你的编辑任务相关的内容，例如，如果你要解决 `issue #12345` ，你可以将分支命名为 `issue-12345` 。如果你正在改进错误消息，你可以将其命名为 `error-message-improvements` 。分支名称可以有字母数字字符、连字符、下划线和斜线，但不能有任何空格或其他特殊字符。

   <code-example format="shell" language="shell">

   git checkout -b working-branch

   </code-example>

1. Run this command to make a copy of your working branch in your repo on `github.com` in the cloud.
   Remember to replace `working-branch` with the name of your working branch.

   运行此命令，在云端的 `github.com` 上的存储库中复制你的工作分支。请记住将 `working-branch` 替换为你的工作分支的名称。

   <code-example format="shell" language="shell">

   git push --set-upstream origin working-branch

   </code-example>

## Edit the documentation

## 编辑文档

After you create a working branch, you're ready to start editing and creating topics.

创建工作分支后，你就可以开始编辑和创建主题了。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-10-12
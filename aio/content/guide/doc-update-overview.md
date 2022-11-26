# Overview of Angular documentation editorial workflow

# Angular 文档编辑工作流概览

This section describes the process of making major changes to the Angular documentation.
It also describes how Angular documentation is stored, built, revised, and tested.

本节介绍对 Angular 文档进行重大更改的过程。它还介绍了如何存储、构建、修订和测试 Angular 文档。

The following diagram illustrates the workflow for revising Angular documentation.
The steps are summarized below and described in the topics of this section.

下图展示了修改 Angular 文档的工作流。下面总结了这些步骤，并在本节的主题中进行了描述。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="A block diagram that shows the steps in the writing workflow" src="generated/images/guide/doc-update-overview/writing-workflow.png">

</div>

## Prepare to edit the docs

## 准备编辑文档

You perform this step one time to prepare your local computer to update the Angular documentation.

你执行一次此步骤以准备本地计算机以更新 Angular 文档。

For more information about how to prepare to edit the docs, see [Preparing to edit documentation](guide/doc-prepare-to-edit).

有关如何准备编辑文档的更多信息，请参阅[准备编辑文档](guide/doc-prepare-to-edit)。

## Select a documentation issue

## 选择一个文档问题

The first step in resolving a documentation issue is to select one to fix.
The issue that you fix can be one from the [list of documentation issues](https://github.com/angular/angular/issues?q=is%3Aissue+is%3Aopen+label%3A%22comp%3A+docs%22) in the `angular/angular` repo or one you create.

解决文档问题的第一步是选择要修复的一个。你修复的问题可以是 `angular/angular` 存储库[中的文档问题列表](https://github.com/angular/angular/issues?q=is%3Aissue+is%3Aopen+label%3A%22comp%3A+docs%22)之一，也可以是你创建的问题。

For more information about how to select an issue to fix, see [Selecting a documentation issue](guide/doc-select-issue).

有关如何选择要修复的问题的更多信息，请参阅[选择文档问题](guide/doc-select-issue)。

### Create a documentation issue

### 创建文档问题

If you want to fix a problem that has not already been described in an issue, [open a documentation issue](https://github.com/angular/angular/issues/new?assignees=&labels=&template=3-docs-bug.yaml) before you start.
When you can relate an issue to your pull request, reviewers can understand the problem better when they review your pull request.

如果你想解决问题中尚未描述的问题，请在开始之前[打开一个文档问题](https://github.com/angular/angular/issues/new?assignees=&labels=&template=3-docs-bug.yaml)。当你可以将问题与你的 Pull Request 关联起来时，审阅者在查看你的 Pull Request 时可以更好地了解问题。

### Create a working branch

### 创建工作分支

After you select an issue to resolve, create a `working` branch in the `working` directory on your local computer.
You need to make your changes in this branch to save and test them while you edit.
After you fix the issue, you use this branch when you open the pull request for your solution to be merged into `angular/angular`.

选择要解决的问题后，在本地计算机的 `working` 目录中创建一个 `working` 分支。你需要在此分支中进行更改，以在编辑时保存和测试它们。解决问题后，你在打开要合并到 `angular/angular` 中的解决方案的 Pull Request 时使用此分支。

For more information about how to create a `working` branch, see [Starting to edit a documentation topic](guide/doc-update-start).

有关如何创建 `working` 分支的更多信息，请参阅[开始编辑文档主题](guide/doc-update-start)。

## Revise topics

## 修改主题

In your `working` branch, you edit and create the documentation topics necessary to resolve the issue.
You perform most of this work in your integrated development environment (IDE).

在你的 `working` 分支中，你可以编辑和创建解决问题所需的文档主题。你在集成开发环境 (IDE) 中执行大部分此类工作。

For more information about how to revise a documentation topic, see [Revising a documentation topic](guide/doc-editing).

有关如何修订文档主题的更多信息，请参阅[修订文档主题](guide/doc-editing)。

### Resolve lint errors

### 解决 lint 错误

Each time you save your edits to a documentation topic, the documentation linter reviews your topic.
It reports the problems it finds in your topic to your IDE.
To prevent delays later in the pull request process, you should correct these problems as they are reported.
The documentation linter errors must be corrected before you open the pull request to pass the pull request review.
Having lint errors in a topic can prevent the pull request from being approved for merging.

每次你保存对文档主题的编辑时，文档 linter 都会查看你的主题。它将在你的主题中发现的问题报告给你的 IDE。为防止稍后在 Pull Request 过程中出现延迟，你应该在报告时更正这些问题。在打开 Pull Request 以通过 Pull Request 审查之前，必须更正文档 linter 错误。主题中存在 lint 错误可能会导致 Pull Request 无法被批准合并。

For more information about how to resolve lint problems in a documentation topic, see [Resolving documentation linter messages](guide/docs-lint-errors).

有关如何解决文档主题中的 lint 问题的更多信息，请参阅[解决文档 linter 消息](guide/docs-lint-errors)。

### Test your changes

### 测试你的更改

As you edit documentation topics to resolve the issue you selected, you want to build a local version of the updated documentation.
This is the easiest way to review your changes in the same context as the documentation's users.

当你编辑文档主题以解决你选择的问题时，你要构建更新文档的本地版本。这是在与文档用户相同的上下文中查看更改的最简单方法。

You can also run some of the automated tests on your local computer to catch other errors.
Running these tests on your local computer before you open a pull request speeds up the pull-request approval process.

你还可以在本地计算机上运行一些自动测试以捕获其他错误。在打开 Pull Request 之前在本地计算机上运行这些测试可以加快 Pull-request 批准过程。

For more information about how to build and test your changes before you open a pull request, see [Building and testing documentation](guide/doc-build-test).

有关如何在打开 Pull Request 之前构建和测试你的更改的更多信息，请参阅[构建和测试文档](guide/doc-build-test)。

## Prepare your pull request

## 准备你的 Pull Request

To make your documentation changes ready to be added to the `angular/angular` repo, there are a few things to do before you open a pull request.
For example, to make your pull request easy to review and approve, the commits and commit messages in your `working` branch must be formatted correctly.

为了使你的文档更改可以添加到 `angular/angular` 存储库，在你打开 Pull Request 之前有一些事情要做。例如，为了使你的 Pull Request 易于查看和批准，你的 `working` 分支中的提交和提交消息必须具有正确的格式。

For information about how to prepare your branch for a pull request, see [Preparing documentation for a pull request](guide/doc-pr-prep).

有关如何为 Pull Request 准备分支的信息，请参阅[为 Pull Request 准备文档](guide/doc-pr-prep)。

### Open your pull request

### 打开你的 Pull Request

Opening a documentation pull request sends your changes to the Angular reviewers who are familiar with the topic.
To be processed correctly, pull requests for `angular/angular` must be formatted correctly and contain specific information.

打开文档 Pull Request 会将你的更改发送给熟悉该主题的 Angular 审阅者。要被正确处理，对 `angular/angular` 的 Pull Request 必须具有正确的格式并包含特定信息。

For information about how to format a pull request for your documentation update, see [Opening a documentation pull request](guide/doc-pr-open).

有关如何为文档更新格式化 Pull Request 的信息，请参阅[打开文档 Pull Request](guide/doc-pr-open) 。

### Update your pull request

### 更新你的 Pull Request

You might get feedback about your pull request that requires you to revise the topic.
Because the pull-request process is designed for all Angular code, as well as the documentation, this process might seem intimidating the first time.

你可能会收到有关需要你修改主题的 Pull Request 的反馈。因为 Pull-request 过程是为所有 Angular 代码以及文档设计的，所以这个过程第一次可能看起来很吓人。

For information about how to update your topics and respond to feedback on your changes, see [Updating a documentation pull request in progress](guide/doc-pr-update).

有关如何更新主题和响应对更改的反馈的信息，请参阅[更新正在进行的文档 Pull Request](guide/doc-pr-update) 。

## Clean up after merge

## 合并后清理

After your pull request is approved and merged into `angular/angular`, it becomes part of the official Angular documentation.
At that point, your changes are now in the `main` branch of `angular/angular`.
This means that you can safely delete your `working` branch.

在你的 Pull Request 被批准并合并到 `angular/angular` 后，它成为官方 Angular 文档的一部分。此时，你的更改现在位于 `angular/angular` 的 `main` 分支中。这意味着你可以安全地删除你的 `working` 分支。

It is generally a good practice to delete `working` branches after their changes are merged into the `main` branch of `angular/angular`.
This prevents your personal fork from collecting lots of branches that could be confusing in the future.

一般来说，在工作分支的更改合并到 `angular/angular` 的 `main` 分支之后删除 `working` 分支是一个很好的实践。这可以防止你的个人 fork 收集许多将来可能会令人困惑的分支。

For information about how to clean up safely after your pull request is merged, see [Finishing up a documentation pull request](guide/doc-edit-finish).

有关如何在 Pull Request 合并后安全清理的信息，请参阅[完成文档 Pull Request](guide/doc-edit-finish) 。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-10-12
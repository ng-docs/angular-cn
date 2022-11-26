# Documentation contributors guide

# 文档贡献者指南

<!-- markdownLint-disable MD001 -->

The topics in this section describe how you can contribute to this documentation.
For information about contributing code to the Angular framework, see [Contributing to Angular][GithubAngularAngularBlobMainContributingMd].

本节中的主题介绍了如何为本文档做出贡献。有关向 Angular 框架贡献代码的信息，请参阅[对 Angular 的贡献][GithubAngularAngularBlobMainContributingMd]。

Angular is an open source project that appreciates its community support, especially when it comes to the documentation.

Angular 是一个开源项目，感谢其社区支持，尤其是在文档方面。

You can update the Angular documentation in these ways:

你可以通过以下方式更新 Angular 文档：

* [Make a minor change][AioGuideContributorsGuideOverviewMakeAMinorChange]

  [做一个小的改变][AioGuideContributorsGuideOverviewMakeAMinorChange]

* [Make a major change][AioGuideContributorsGuideOverviewMakeAMajorChange]

  [进行重大更改][AioGuideContributorsGuideOverviewMakeAMajorChange]

<div class="alert is-important">

**IMPORTANT**:<br />
To submit changes to the Angular documentation, you must have:

*   A [GitHub][GithubMain] account
*   A signed [Contributor License Agreement][GithubAngularAngularBlobMainContributingMdSigningTheCla]

</div>

## Make a minor change

## 做一个次要更改

You can make minor changes to a documentation topic without downloading any software.
Many common documentation maintenance tasks require only minor changes to a few words or characters in a topic.
Examples of minor changes include:

你可以在不下载任何软件的情况下对文档主题进行细微更改。许多常见的文档维护任务只需要对主题中的几个单词或字符进行细微更改。次要更改的示例包括：

* [Correcting a typo or two][AioGuideContributorGuideOverviewToMakeAMinorChangeToADocumentationTopic]

  [更正一两个错别字][AioGuideContributorGuideOverviewToMakeAMinorChangeToADocumentationTopic]

* [Reviewing a topic and updating its review date][AioGuideReviewingContentUpdateTheLastReviewedDate]

  [审核主题并更新其审核日期][AioGuideReviewingContentUpdateTheLastReviewedDate]

* [Adding or updating search keywords][AioGuideUpdatingSearchKeywords]

  [添加或更新搜索关键字][AioGuideUpdatingSearchKeywords]

For more about keeping the documentation up to date, see [Common documentation maintenance tasks][AioGuideDocTasks].

有关使文档保持最新的更多信息，请参阅[常见文档维护任务][AioGuideDocTasks]。

To make larger changes to the documentation, you must install an Angular development environment on your local computer.
You need this environment to edit and test your changes before you submit them.
For information about configuring your local computer to make larger documentation updates, see [Preparing to edit the documentation][AioGuideDocPrepareToEdit].

要对文档进行更大的更改，你必须在本地计算机上安装 Angular 开发环境。你需要此环境在提交之前编辑和测试你的更改。有关配置本地计算机以进行更大范围的文档更新的信息，请参阅[准备编辑文档][AioGuideDocPrepareToEdit]。

<!-- markdownLint-disable MD033 -->

#### To make a minor change to a documentation topic

#### 对文档主题进行小的更改

Perform these steps in a browser.

在浏览器中执行这些步骤。

1. Confirm you have a [signed Contributor License Agreement (CLA)][GoogleDeveloperClaClas] on file.
   If you don't, [sign a CLA][GithubAngularAngularBlobMainContributingMdSigningTheCla].

   确认你有[已签署的贡献者许可协议 (CLA)][GoogleDeveloperClaClas]存档。如果没这样做过，请先[签署 CLA][GithubAngularAngularBlobMainContributingMdSigningTheCla] 。

1. Sign into [github.com][GithubMain], or if you don't have a GitHub account, [create a new GitHub account][GithubJoin].

   登录 [github.com][GithubMain] ，或者如果你没有 GitHub 帐户，请[创建一个新的 GitHub 帐户][GithubJoin]。

1. Navigate to the page in [angular.io][AngularMain] that you want to update.

   导航到 [angular.io][AngularMain] 中要更新的页面。

1. On the page that you want to update, locate this pencil icon to the right of the topic's title

   在你要更新的页面上，找到主题标题右侧的铅笔图标

   <div class="lightbox">

   <img alt="drawing of a pencil used as the topic edit icon" src="generated/images/guide/contributors-guide/edit-icon.png">

   </div>

1. Click this icon to open the suggestion page.

   单击此图标可打开建议页面。

1. In the suggestion page, in **Edit file**, update the content to fix the problem.
   If the fix requires more than correcting a few characters, it might be better to treat this as a [major change][AioGuideContributorsGuideOverviewMakeAMajorChange].

   在建议页面的 **Edit file** 中，更新内容以解决问题。如果修复需要的不仅仅是更正几个字符，最好将其视为[重大更改][AioGuideContributorsGuideOverviewMakeAMajorChange]。

1. Click the **Preview** tab to see how your markdown changes look when rendered.
   This view shows how the markdown renders.
   It won't look exactly like the documentation page because it doesn't display the text with the styles used in the documentation.

   单击 **Preview** 选项卡以查看你的这些 Markdown 更改在渲染时的外观。此视图显示了 Markdown 的渲染方式。它看起来不会与文档页面完全一样，因为它不会显示具有文档中使用的样式的文本。

1. After you finish making your changes:

   完成更改后：

   1. In **Propose changes**, enter a brief description of your changes that starts with `docs:` and is 100 characters or less in length.
      If necessary, you can add more information about the change in the larger edit window below the brief description.

      在**Propose changes**中，输入以 `docs:` 开头的更改的简短描述，并且长度不超过 100 个字符。如有必要，你可以在简短描述下方的较大编辑窗口中添加有关此更改的更多信息。

   1. Select **Create a new branch for this commit and start a pull request** and accept the default branch name.

      选择 **Create a new branch for this commit and start a pull request** 并接受默认分支名称。

   1. Click **Propose changes** to open a pull request with your updated text.

      单击 **Propose changes** 以打开使用更新后的文本的 Pull Request。

After you open a pull request, the Angular team reviews your change and merges it into the documentation.
You can follow the progress of your pull request in the pull request's page.
You might receive a notification from GitHub if the Angular team has any questions about your change.

在你打开 Pull Request 后，Angular 团队会查看你的更改并将其合并到文档中。你可以在 Pull Request 的页面中关注 Pull Request 的进度。如果 Angular 团队对你的更改有任何问题，你可能会收到来自 GitHub 的通知。

## Make a major change

## 进行重大更改

Making major changes or adding new topics to the documentation follows a different workflow.
Major changes to a topic require that you build and test your changes before you send them to the Angular team.

对文档进行重大更改或添加新主题要遵循不同的工作流程。对主题的重大更改要求你在将更改发送给 Angular 之前构建并测试你的更改。

These topics provide information about how to set up your local computer to edit, build, and test Angular documentation to make major changes to it.

这些主题提供了有关如何设置本地计算机以编辑、构建和测试 Angular 文档以对其进行重大更改的信息。

* [Overview of the Angular documentation editorial workflow][AioGuideDocUpdateOverview]

  [Angular 文档编辑工作流概览][AioGuideDocUpdateOverview]

  Describes how to configure your local computer to build, edit, and test Angular documentation

  描述如何配置本地计算机以构建、编辑和测试 Angular 文档

* [Documentation style guide][AioGuideDocStyleGuide]

  [文档风格指南][AioGuideDocStyleGuide]

  Describes the standards used in the Angular documentation

  描述 Angular 文档中使用的标准

## Localize Angular documentation in a new language

## 用新语言本地化 Angular 文档

Localizing Angular documentation is another way to contribute to Angular documentation.
For information about localizing the Angular documentation in a new language, see [Angular localization guidelines][AioGuideLocalizingAngular].

本地化 Angular 文档是为 Angular 文档做贡献的另一种方式。有关用新语言本地化 Angular 文档的信息，请参阅[Angular 本地化指南][AioGuideLocalizingAngular]。

<!-- links -->

[AioGuideContributorsGuideOverviewMakeAMajorChange]: guide/contributors-guide-overview#make-a-major-change "Make a major change - Documentation contributors guide | Angular"

[AioGuideContributorsGuideOverviewMakeAMinorChange]: guide/contributors-guide-overview#make-a-minor-change "Make a minor change - Documentation contributors guide | Angular"

[AioGuideContributorGuideOverviewToMakeAMinorChangeToADocumentationTopic]: guide/contributors-guide-overview#to-make-a-minor-change-to-a-documentation-topic "To make a minor change to a documentation topic - Documentation contributors guide | Angular"

[AioGuideDocPrepareToEdit]: guide/doc-prepare-to-edit "Preparing to edit documentation | Angular"

[AioGuideDocStyleGuide]: guide/docs-style-guide "Angular documentation style guide | Angular"

[AioGuideDocTasks]: guide/doc-tasks "Common documentation maintenance tasks | Angular"

[AioGuideDocUpdateOverview]: guide/doc-update-overview "Overview of Angular documentation editing | Angular"

[AioGuideLocalizingAngular]: guide/localizing-angular "Angular documentation style guide | Angular"

[AioGuideReviewingContentUpdateTheLastReviewedDate]: guide/reviewing-content#update-the-last-reviewed-date "Update the last reviewed date - Test a documentation update | Angular"

[AioGuideUpdatingSearchKeywords]: guide/updating-search-keywords "Updating search keywords | Angular"

<!-- external links -->

[AngularMain]: https://angular.io "Angular"

[GithubAngularAngularBlobMainContributingMd]: https://github.com/angular/angular/blob/main/CONTRIBUTING.md "Contributing to Angular | angular/angular | GitHub"

[GithubAngularAngularBlobMainContributingMdSigningTheCla]: https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-signing-the-cla "Signing the CLA - Contributing to Angular | angular/angular | GitHub"

[GithubMain]: https://github.com "GitHub"

[GithubJoin]: https://github.com/join "Join GitHub | GitHub"

[GoogleDeveloperClaClas]: https://cla.developers.google.com/clas "Contributor License Agreements | Google Open Source"

<!--end links -->

@reviewed 2022-10-12
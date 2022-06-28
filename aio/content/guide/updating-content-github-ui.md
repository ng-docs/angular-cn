# Updating topics through the GitHub user interface

# 通过 GitHub 用户界面更新主题

This topic describes how to submit pull requests to the Angular repository using GitHub's user interface.
If you are unfamiliar with [Git](https://git-scm.com), you might find this process easier for making changes.

本主题介绍如何使用 GitHub 的用户界面将 Pull Request 提交到 Angular 存储库。如果你对[Git](https://git-scm.com)不熟悉，可能会发现此过程更易于进行更改。

<div class="alert is-important">

Using the GitHub user interface for updates is recommended only for small changes to one file at a time, such as fixing typos, [updating the review date](guide/reviewing-content) or [updating search keywords](guide/updating-search-keywords).

建议仅对一次对一个文件的小的更改使用 GitHub 用户界面进行更新，例如修复拼写错误、[更新审核日期](guide/reviewing-content)或[更新搜索关键字](guide/updating-search-keywords)。

</div>

**To update a topic through the GitHub user interface:**

**通过 GitHub 用户界面更新主题：**

1. Navigate to the topic for which you want to file a pull request.

   导航到你要提交 Pull 请求的主题。

1. Click the edit icon at the top of the topic.

   单击主题顶部的编辑图标。

   <div class="lightbox">

   <img alt="The edit icon for an Angular topic." src="generated/images/guide/contributors-guide/edit-icon.png">

   </div>

   A GitHub page appears, displaying the source of the topic.

   会出现一个 GitHub 页面，显示主题的来源。

1. Update the topic.

   更新主题。

1. At the bottom of the screen, update the **Commit changes** box with a description of the change.
   Use the format `docs: <short-description-of-change>`, where `<short-description-of-change>` briefly describes your change.
   Keep the description under 100 characters.
   For example:

   在屏幕底部，使用更改的描述更新**Commit changes**框。使用格式 `docs: <short-description-of-change>`，其中 `<short-description-of-change>` 简要描述你的更改。将描述保持在 100 个字符以下。例如：

   <code-example format="github" language="markdown">

   docs: fix typo in Tour of Heroes pt.1

   </code-example>

1. Verify that the **create new branch** option is selected, then click **Commit changes**.

   验证是否选择了**创建新分支**选项，然后单击**提交更改**。

   A Pull Request screen opens.

   一个 Pull Request 屏幕将打开。

1. Fill out the form in the Pull Request screen.
   At a minimum, put an `x` in the **Docs have been added / updated** option and the **Documentation content changes** option.

   在 Pull Request 屏幕中填写表格。至少，在“**文档已添加/更新**”选项和“**文档内容更改**”选项中放一个 `x`。

1. Click **Create pull request**.

   单击**创建 Pull Request**。

At this point, your pull request is added to a list of current requests, which the documentation team reviews weekly.

此时，你的 Pull Request 被添加到当前请求列表中，文档团队每周都会对其进行审核。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
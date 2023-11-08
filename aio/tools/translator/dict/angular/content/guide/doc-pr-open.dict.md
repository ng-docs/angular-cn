Open a documentation pull request

打开文档 Pull Request

This topic describes how to open the pull request that requests your documentation update to be added to the `angular/angular` repo.

本主题介绍如何打开请求将文档更新添加到 `angular/angular` 存储库的 Pull Request。

These steps are performed in your web browser.

这些步骤是在你的 Web 浏览器中执行的。

Locate the `working` branch that you want to use for your pull request.
In this example, `test-1` is the name of the `working` branch.
Choose one of these options to open a pull request.

定位要用于 Pull Request 的 `working` 分支。在此示例中，`test-1` 是 `working` 分支的名称。选择这些选项之一以打开 Pull Request。

If you recently pushed the branch that you want to use to the `origin` repo, you might see it listed on the code page of the `angular` repo in your GitHub account.
This image shows an example of a repo that has had several recent updates.

如果你最近将要使用的分支推送到 `origin` 存储库，你可能会看到它在你的 GitHub 帐户的 `angular` 存储库的代码页上列出。此图显示了一个最近有几次更新的存储库示例。

In the alert message with your `working` branch, click **Compare & pull request** to open a pull request and continue to the next step.

在与你的 `working` 分支的警报消息中，单击**比较&Pull Request**以打开 Pull Request 并继续下一步。

You can also select your `working` branch in the code page of the origin repo.

你还可以在原始存储库的代码页中选择你的 `working` 分支。

Click the link text in the `"This branch is"` message to open the **Comparing changes** page.

单击 `"This branch is"` 消息中的链接文本以打开“**比较更改**”页面。

In the **Comparing changes** page, click **Create pull request** to open the new pull request page.

在**比较更改**页面中，单击**创建 Pull Request**以打开新的 Pull Request 页面。

Review and complete the form in the comment field.
Most documentation updates require responses to the entries noted by an arrow and described below.

查看并完成评论字段中的表格。大多数文档更新都需要响应用箭头标出并在下面描述的条目。

**The commit message follows our guidelines**

**提交信息遵循我们的指南**

Mark this comment when you're sure your commit messages are in the correct format.
Remember that the commit messages and the pull request title are different.
For more information about commit message formatting, see [Preparing a documentation update for a pull request](guide/doc-pr-prep) and [Commit message format](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit).

当你确定提交消息的格式正确时，请标记此评论。请记住，提交消息和拉取请求标题是不同的。有关提交消息格式的更多信息，请参阅[为拉取请求准备文档更新](guide/doc-pr-prep)和[提交消息格式](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)。

**Docs have been added / updated \(for bug fixes / features\)**

**文档已添加/更新（用于错误修复/功能）**

Mark this comment to show that documentation has been updated.

标记此评论以表明文档已更新。

**Documentation content changes**

**文档内容变更**

Mark this comment to identify this is a documentation pull request.
If you also updated other types of content, you can mark those as well.

标记此评论以标识这是文档拉取请求。如果你还更新了其他类型的内容，你也可以标记这些内容。

**What is the current behavior?**

**目前的行为是什么？**

Briefly describe what wasn't working or what was incorrect in the documentation before you made the changes in this pull request.
Add the issue number here, if the problem is described in an issue.

在你在此拉取请求中进行更改之前，简要描述文档中的哪些内容不起作用或不正确。如果问题在问题中有所描述，请在此处添加问题编号。

**What is the new behavior?**

**什么是新行为？**

Briefly describe what was added to fix the problem.

简要描述为解决问题而添加的内容。

**Does this PR introduce a breaking change?**

**此 PR 是否引入了重大更改？**

For most documentation updates, the answer to this should be `No`.

对于大多数文档更新，答案应该是 `No`。

**Other information**

**其他信息**

Add any other information that can help reviewers understand your pull request here.

在此处添加可以帮助审阅者理解你的拉取请求的任何其他信息。

Click the arrow next to **Draft pull request** and select whether you want to create a draft pull request or a pull request.

单击**草稿 Pull Request**旁边的箭头，并选择要创建草稿 Pull Request 还是 Pull Request。

A draft pull request runs the continuous integration \(CI\) testing, but does not send the pull request to reviewers.
You can ask people to review it by sending them the pull request link.
You might use this option to see how your pull request passes the CI testing before you send it for review to be merged.
Draft pull requests cannot be merged.

Pull Request 草案会运行持续集成（CI）测试，但不会将 Pull Request 发送给审阅者。你可以通过向人们发送 Pull Request 链接来让他们查看它。你可以用此选项来查看你的 Pull Request 如何在将其发送以供审核之前通过 CI 测试。无法合并草稿 Pull Request。

A pull request runs the continuous integration \(CI\) testing and sends your pull request to reviewers to review and merge.

Pull Request 运行持续集成（CI）测试，并将你的 Pull Request 发送给审阅者以查看和合并。

Click **Create the pull request** or **Draft pull request** to open the pull request.
After GitHub creates the pull request, the browser opens the new pull request page.

单击**创建 Pull Request**或**草稿 Pull Request**以打开 Pull Request。在 GitHub 创建 Pull 请求后，浏览器会打开新的 Pull Request 页面。

After you open the pull request, the automated tests start running.

打开 Pull Request 后，自动测试开始运行。

What happens after you open a pull request

打开 Pull Request 后会发生什么

In most cases, documentation pull requests that pass the automated tests are approved within a few days.

在大多数情况下，通过自动化测试的文档 Pull Request 会在几天内获得批准。

Sometimes, reviewers suggest changes for you to make to improve your pull request.
In those case, review the suggestions and [update the pull request](guide/doc-pr-update) with a comment or an updated file.

有时，审阅者会建议你进行更改以改进你的 Pull Request。在这种情况下，请查看建议并使用注释或更新的文件[更新 Pull Request](guide/doc-pr-update)。

What happens to abandoned pull requests

被放弃的 Pull Request 会发生什么

While it can take a few days to respond to comments, try to respond as quickly as you can.
Pull requests that appear to abandoned or ignored are closed according to this schedule:

虽然回复评论可能需要几天时间，但请尝试尽快回复。似乎被放弃或忽略的 Pull Request 会根据此时间表关闭：

After 14 days of inactivity after the last comment, the author is reminded that the pull request has pending comments

在最后一条评论后 14 天不活动后，作者会被提醒此 Pull Request 有待处理的评论

After 28 days of inactivity after the last comment, the pull request is closed and not merged

在最后一条评论后 28 天不活动后，Pull Request 已关闭并且不会合并
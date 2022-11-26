# Update a documentation pull request

# 更新文档 Pull Request

<!-- markdownLint-disable MD001 -->

This topic describes how to respond to test failures and feedback on your pull request.

本主题介绍如何响应测试失败和对你的 Pull Request 的反馈。

After you open a pull request, it is tested and reviewed.
After it's approved, the changes are merged into `angular/angular` and they become part of the Angular documentation.

在你打开 Pull Request 后，它会被测试和审查。获得批准后，这些更改会合并到 `angular/angular` 中，并成为 Angular 文档的一部分。

While some pull requests are approved with no further action on your part, most pull requests receive feedback that requires you to make a change.

虽然某些 Pull Request 会在你没有进一步操作的情况下获得批准，但大多数 Pull Request 都会收到需要你进行更改的反馈。

## Anatomy of a pull request

## Pull Request 的剖析

After you open a pull request, the pull request page records the activity on the pull request as it is reviewed, updated, and approved.
This is an example of the top of a pull request page followed by a description of the information it contains.

打开 Pull Request 后，Pull Request 页面会记录 Pull Request 中的活动，因为它被查看、更新和批准。这是 Pull Request 页面顶部的示例，后跟其包含的信息的描述。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="Screenshot of github.com page showing a branch listing from a repo" src="generated/images/guide/doc-pr-update/pull-request-heading.png">

</div>

Above the pull-request tabs is a summary of the pull request that includes:

Pull-request 选项卡上方是 Pull Request 的摘要，包括：

* The pull request title and index

  Pull Request 标题和索引

* The status of the pull request:
  open or closed

  拉取请求的状态：打开或关闭

* A description of the branch with the changes and the branch to update

  具有更改的分支和要更新的分支的描述

The tabs contain different aspects of the pull request.

这些选项卡包含 Pull Request 的不同方面。

* **Conversation**

  **对话**

  All comments and changes to the pull request, system messages, and a summary of the automated tests and approvals.

  对 Pull Request、系统消息以及自动测试和批准的摘要的所有注释和更改。

* **Commits**

  **提交**

  The log of the commits included in this pull request.

  此 Pull Request 中包含的提交的日志。

* **Checks**

  **检查**

  The results of the checks run on the commit.
  This is different from the automated tests that are also run and summarized at the bottom of the **Conversation** tab.

  检查的结果在提交时运行。这与也在“**对话”**选项卡底部运行和汇总的自动测试不同。

* **Files changed**

  **文件已更改**

  The changes this request makes to the code.
  In this tab is where you find specific comments to the changes in your pull request.
  You can reply to those comments in this tab, as well.

  此请求对代码所做的更改。在此选项卡中，你可以在其中找到对 Pull Request 中更改的特定注释。你也可以在此标签中回复这些评论。

## Respond to a comment

## 回复评论

If your pull request receives comments from a reviewer, you can respond in several ways.

如果你的 Pull Request 收到来自审阅者的评论，你可以用多种方式回复。

* Reply to the feedback.

  回复反馈。

  For example, you can ask for more information or reply with an explanation.

  例如，你可以要求提供更多信息或回复解释。

* Make the changes to the documentation that the reviewer recommends.

  对审阅者建议的文档进行更改。

  If you update the working branch with the suggested changes, resolve the comment.

  如果你使用建议的更改更新工作分支，请解析注释。

* Make other changes to the documentation.

  对文档进行其他更改。

  After reviewing the feedback, you might see an even better improvement.
  Update the working branch with your improvement and explain why you chose that to your reviewers in a comment.

  在查看反馈后，你可能会看到更好的改进。通过你的改进来更新工作分支，并在评论中向审阅者解释你选择它的原因。

Remember that pull requests that do not receive a response to a review comment are considered abandoned and closed.
For more information about abandoned pull requests, see [What happens to abandoned pull requests](guide/doc-pr-open#what-happens-to-abandoned-pull-requests).

请记住，没有收到对审核注释的响应的 Pull Request 被认为是被放弃并关闭。有关被放弃的 Pull Request 的更多信息，请参阅[被放弃的 Pull 请求会发生什么](guide/doc-pr-open#what-happens-to-abandoned-pull-requests)。

### Update a file in the pull request

### 更新 Pull Request 中的文件

Follow this procedure to change a file in the pull request or to add a new file to the pull request.

请按照此过程更改 Pull Request 中的文件或将新文件添加到 Pull 请求中。

1. In your `git` workspace, in your working directory, checkout your working branch.

   在你的 `git` 工作区的工作目录中，签出你的工作分支。

1. Update the documentation to respond to the feedback you received.
   The procedures used to [revise a documentation topic](guide/doc-editing) are also used to update the documentation while there's an open pull request.

   更新文档以响应你收到的反馈。用于[修改文档主题](guide/doc-editing)的过程也用于在有打开的 Pull Request 时更新文档。

1. Test your update locally as described in [Testing a documentation update](guide/doc-build-test).

   如[测试文档更新中所述，在本地测试你的更新](guide/doc-build-test)。

1. After your updates have been tested, commit your changes and push the new commits to the working branch of your repo on your `origin` server.

   在你的更新经过测试后，提交你的更改并将新提交推送到 `origin` 服务器上存储库的工作分支。

1. After you update the working branch on your `origin` server, the fork of the `angular/angular` repo in your GitHub account, your pull request updates automatically.

   在你更新 `origin` 服务器上的工作分支（你的 GitHub 帐户中 `angular/angular` 存储库的 fork）后，你的 Pull Request 会自动更新。

1. After the pull request updates, the automated tests are restarted and the reviewers are notified.

   在 Pull Request 更新后，会重新启动自动测试并通知审阅者。

Repeat this process as needed to address the feedback you get from reviews of the pull request.

根据需要重复此过程，以解决你从 Pull Request 审查中获得的反馈。

## Clean up the branch

## 清理分支

If you added commits to address review feedback, you might be requested to clean up your working branch.
If some of the commits you made address only review feedback from your reviewers, they can probably be squashed.
Squashing commits combines the changes made in multiple commits into a single commit.

如果你添加了提交来解决审查反馈，可能会要求你清理工作分支。如果你所做的某些提交只解决了审阅者的反馈，它们可能会被压缩。压缩提交将在多个提交中所做的更改组合到一个提交中。

<!-- markdownLint-disable MD033 -->

#### To squash commits in your working branch

#### 在工作分支中压缩提交

Perform these steps from a command-line tool on your local computer.

从本地计算机上的命令行工具执行这些步骤。

1. In your [workspace](guide/doc-prepare-to-edit#create-a-git-workspace-on-your-local-computer) directory, in your [working directory](guide/doc-prepare-to-edit#doc-working-directory), checkout your working branch.

   在你的[工作区](guide/doc-prepare-to-edit#create-a-git-workspace-on-your-local-computer)目录中的[工作目录](guide/doc-prepare-to-edit#doc-working-directory)中，签出你的工作分支。

1. Run this command to view the commits in your working branch.

   运行此命令以查看工作分支中的提交。

   <code-example format="shell" language="shell">

   git log --pretty=format:"%h %as %an %Cblue%s %Cgreen%D"

   </code-example>

1. In the output of the previous `git log` command, find the entry that contains `upstream/main`.
   It should be near the top of the list.

   在前一个 `git log` 命令的输出中，查找包含 `upstream/main` 的条目。它应该在列表的顶部附近。

   1. **Confirm that entry also contains `origin/main` and `main`**

      **确认条目还包含 `origin/main` 和 `main`**

      If it doesn't, you must resync the clone on your local computer and your `personal/angular` repo with the `upstream` repo.
      After you resync the repos, [rebase the working branch](guide/doc-pr-prep#rebase-your-working-branch) before you continue.

      如果不是，你必须将本地计算机上的克隆以及你的 `personal/angular` 存储库与 `upstream` 存储库重新同步。重新同步存储库后，请在继续之前重新[定位工作分支](guide/doc-pr-prep#rebase-your-working-branch)。

   1. **Confirm that all commits for your update are after the entry that contains `upstream/main`**

      **确认你的更新的所有提交都在包含 `upstream/main` 的条目之后**

      Remember that the log output is displayed with the most recent commit first.
      Your commits should all be on top of the entry that contains `upstream/main` in the log output.
      If you have commits that are listed after the entry that contains `upstream/main`, somehow your commits in the working branch got mixed up.
      You must fix the branch before you try to squash any commits.

      请记住，日志输出会首先显示最近的提交。你的提交应该都在日志输出中包含 `upstream/main` 的条目之上。如果你有包含 `upstream/main` 的条目之后列出的提交，则你在工作分支中的提交会以某种方式混淆。你必须在尝试压缩任何提交之前修复分支。

1. Count the lines that are on top of the entry that contains `upstream/main`.
   For example, in this log output, the working branch name is `update-doc-contribution` and there are five commit entries that are on top of the entry that contains `upstream/main`.

   计算包含 `upstream/main` 的条目顶部的行数。例如，在此日志输出中，工作分支名称是 `update-doc-contribution` ，并且在包含 `upstream/main` 的条目之上有五个提交条目。

   <div class="lightbox">

   <!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
   <a href="generated/images/guide/doc-pr-update/git-log-output-large.png"><img alt="Screenshot of git log output" src="generated/images/guide/doc-pr-update/git-log-output.png"></a>

   </div>

1. Run this command to squash the commits that occurred after the entry that contains `upstream/main`.
   In your command, replace the `5` after `HEAD` with the number of commits on top of the entry that contains `upstream/main`.

   运行此命令以压缩在包含 `upstream/main` 的条目之后发生的提交。在你的命令中，将 `HEAD` 之后的 `5` 替换为包含 `upstream/main` 的条目顶部的提交数。

   <code-example format="shell" language="shell">

   git rebase -i HEAD~5

   </code-example>

1. This command opens your default editor with entries for the commits that you selected in the `git rebase` command.

   此命令会打开你的默认编辑器，其中包含你在 `git rebase` 命令中选择的提交的条目。

   <div class="lightbox">

   <!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
   <img alt="Screenshot of git rebase editor screen" src="generated/images/guide/doc-pr-update/git-squash-edit.png">

   </div>

1. To squash the commits, edit the commands in the file that's presented in the editor.
   The commands in the editor are listed from oldest to newest, which is the opposite order from how they are listed by the `git log` command.
   The possible command options are listed in the editor below the commands.
   To squash the commits for your pull request, you only need: `pick` and `squash`.

   要压缩提交，请编辑编辑器中显示的文件中的命令。编辑器中的命令从最旧到最新列出，这与 `git log` 命令列出它们的顺序相反。可能的命令选项在命令下方的编辑器中列出。要压缩你的 Pull Request 的提交，你只需要： `pick` 和 `squash` 。

1. Review the commands in the editor and change them to match your intention.

   查看编辑器中的命令并更改它们以符合你的意图。

   The commands are processed from top to bottom, that is from oldest commit to the most recent.\\
   To merge all commits in this branch for this pull request, change the `pick` commands to `squash` for all commits except for the first one.
   This text shows how this looks for this example.

   命令会从上到下处理，即从最旧的提交到最近的提交。\\要合并此 Pull Request 中此分支中的所有提交，请将除了第一个提交之外的所有提交的 `pick` 命令更改为 `squash` 。本文本显示了它在此示例中的外观。

   <code-example language="none" hideCopy>

   pick bb0ff71891 docs: update of documentation contrib. guide
   squash c040d76685 docs: more content for doc updates
   squash 472585c43f docs: fix links that were broken by renamed files
   squash 3e6f4c73ac docs: add more info about open PR
   squash 8e50fad064 docs: more pr docs

   </code-example>

   With this edit, `git rebase` picks the first commit and combines the later commits into the first one.

   通过此编辑， `git rebase` 会选择第一个提交并将后提交的合并到第一个提交中。

   The commit message of the commit with the `pick` command, is the commit message used for the resulting commit.
   Make sure that it in the correct format and starts with `docs:`.
   If you need to change the commit message, you can edit it in the editor.

   使用 `pick` 命令的提交的提交消息是用于结果提交的提交消息。确保它的格式正确并以 `docs:` 开头。如果你需要更改提交消息，可以在编辑器中编辑它。

1. After you update the commands, save and exit the editor.
   The `git rebase` commit processes the commands and updates the commit log in your workspace.
   In this example, the rebase command combined the five commits to create a single commit in your working branch.
   This is the commit log after the rebase command completes.

   更新命令后，保存并退出编辑器。 `git rebase` commit 会处理这些命令并更新你工作区中的提交日志。在此示例中，rebase 命令结合了五个提交，以在你的工作分支中创建一个提交。这是 rebase 命令完成后的提交日志。

   <div class="lightbox">

   <!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
   <a href="generated/images/guide/doc-pr-update/git-log-after-squash-large.png"><img alt="Screenshot of commit log after git rebase command" src="generated/images/guide/doc-pr-update/git-log-after-squash.png"></a>

   </div>

1. The `git rebase` command changes the commit log in your local computer so it is now different from the one in your online repo.
   To update your online repo, you must force your push of changes from your local computer using this command.

   `git rebase` 命令会更改本地计算机中的提交日志，因此它现在与你的在线存储库中的不同。要更新你的在线存储库，你必须使用此命令强制从本地计算机推送更改。

   <code-example format="shell" language="shell">

   git push --force-with-lease

   </code-example>

   This action is also called a *force push* because it changes the commit log that was stored in your GitHub account.
   Normally, when you run `git push`, you add new commits to the online repo.
   When other people have forked a repo, a force push can have undesired effects for them.
   This force-push is to your forked repo, which should not be shared, so it should be OK.

   此操作也称为*强制推送*，因为它会更改存储在你 GitHub 帐户中的提交日志。通常，当你运行 `git push` 时，你会将新提交添加到在线存储库。当其他人 fork 存储库时，强制推送可能会对他们产生不良影响。此 force-push 是到你的 fork 存储库的，不应该共享，因此应该没问题。

1. After your force push updates the online repo, your pull request restarts the automated tests and notifies the reviewers of the update.

   在你的强制推送更新在线存储库后，你的 Pull Request 会重新启动自动测试并通知审阅者此更新。

## Next steps

## 下一步

Repeat these update steps as necessary to respond to all the feedback you receive.

根据需要重复这些更新步骤，以回复你收到的所有反馈。

After you address all the feedback and your pull request has been approved, it is merged into `angular/angular`.
The changes in your pull request should appear in the documentation shortly afterwards.

在你解决所有反馈并且你的 Pull Request 被批准后，它会合并到 `angular/angular` 。你的 Pull Request 中的更改应该很快出现在文档中。

After your pull request is merged into `angular/angular`, you can [clean up your workspace](guide/doc-edit-finish).

在你的 Pull Request 合并到 `angular/angular` 后，你可以[清理你的工作区](guide/doc-edit-finish)。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-10-12
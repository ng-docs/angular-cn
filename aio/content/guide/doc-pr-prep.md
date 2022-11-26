# Prepare a documentation update for a pull request

# 为 Pull Request 准备文档更新

This topic describes how to prepare your update to the Angular documentation so that you can open a pull request.
A pull request is how you share your update in a way that allows it to be merged it into the `angular/angular` repo.

本主题介绍如何准备对 Angular 文档的更新，以便你可以打开 Pull Request。 Pull Request 是你以允许将更新合并到 `angular/angular` 存储库的方式共享更新的方式。

<div class="alert is-important">

**IMPORTANT**: <br />
Make sure that you have reviewed your documentation update, removed any lint errors, and confirmed that it passes the end-to-end \(e2e\) tests without errors.

</div>

A pull request shares a branch in `personal/angular`, your forked repo, with the `angular/angular` repo.
After your pull request is approved and merged, the new commits from your branch are added to the main branch in the `angular/angular` repo.
The commits in your branch, and their messages, become part of the `angular/angular` repo.

Pull Request 与 `angular/angular` 存储库共享你的 fork 存储库 `personal/angular` 中的分支。在你的 Pull Request 被批准并合并后，你分支中的新提交会添加到 `angular/angular` 存储库中的主分支。你的分支中的提交及其消息，将成为 `angular/angular` 存储库的一部分。

What does this mean for your pull request?

这对你的 Pull Request 意味着什么？

1. Your commit messages become part of the documentation of the changes made to Angular.
   Because they become part of the `angular/angular` repo, they must conform to a specific format so that they are easy to read.
   If they aren't correctly formatted, you can fix that before you open your pull request.

   你的提交消息将成为对 Angular 所做更改的文档的一部分。因为它们成为 `angular/angular` 存储库的一部分，所以它们必须符合特定的格式，以便易于阅读。如果它们的格式不正确，你可以在打开 Pull Request 之前修复它。

1. You might need to squash the commits that you made while developing your update.
   It's normal to save your changes as intermediate commits while you're developing a large update, but your pull request represents only one change to the `angular/angular` repo.
   Squashing the commits from your working branch into fewer, or just one commit, makes the commits in your pull request match the changes your update makes to the `angular/angular` repo.

   你可能需要压缩在开发更新时所做的提交。在开发大型更新时，将更改保存为中间提交是正常的，但你的 Pull Request 仅代表对 `angular/angular` 存储库的一项更改。将工作分支中的提交压缩为更少或仅一个提交，使 Pull Request 中的提交与你的更新对 `angular/angular` 存储库的更改相匹配。

## Format commit messages for a pull request

## 格式化 Pull Request 的提交消息

Commits merged to `angular/angular` must have messages that are correctly formatted.
This section describes how to correctly format commit messages.

合并到 `angular/angular` 的提交必须包含格式正确的消息。本节介绍如何正确格式化提交消息。

Remember that the commit message is different from the pull request comment.

请记住，提交消息与 Pull Request 注释不同。

### Single line commit messages

### 单行提交消息

The simplest commit message is a single-line of text.
All commit messages in a pull request that updates documentation must begin with `docs:` and be followed by a short description of the change.

最简单的提交消息是单行文本。更新文档的 Pull Request 中的所有提交消息都必须以 `docs:` 开头，后跟对更改的简短描述。

The following is an example a valid Angular commit message.

以下是有效的 Angular 提交消息的示例。

<code-example language="none" hideCopy>

docs: a short summary in present tense without capitalization or ending period

</code-example>

This is an example of a commit command with the single-line commit message from the previous example.

这是带有前一个示例中的单行提交消息的提交命令的示例。

<code-example format="shell" language="shell">

git commit -m "docs: a short summary in present tense without capitalization or ending period"

</code-example>

### Multi-line commit messages

### 多行提交消息

You can include more information by providing a more detailed, multi-line message.
The detailed body text of the message must be separated by a blank line after the summary.
The footer that lists the issue the commit fixes must also be separated from the body text by a blank line.

你可以通过提供更详细的多行消息来包含更多信息。消息的详细正文在摘要后必须用空行分隔。列出提交修复的问题的页脚也必须用空行与正文分隔。

<code-example language="none" hideCopy>

docs: a short summary in present tense without capitalization or ending period

A description of what was fixed, and why.
This description can be as detailed as necessary and can be written with
appropriate capitalization and punctuation

Fixes &num;34353

</code-example>

This is an example of a commit command with a multi-line commit message from the previous example.

这是带有前一个示例中的多行提交消息的提交命令的示例。

<code-example format="shell" language="shell">

git commit -m "docs: a short summary in present tense without capitalization or ending period

A description of what was fixed, and why.
This description can be as detailed as necessary and can be
written with appropriate capitalization and punctuation.

Fixes &num;34353"

</code-example>

This example is for documentation updates only.
For the complete specification of Angular commit messages, see [Commit message format](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit).

此示例仅用于文档更新。有关 Angular 提交消息的完整规范，请参阅[提交消息格式](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)。

### Change a commit message

### 更改提交消息

If the last commit you made has a message that isn't in the correct format, you can update the message.
Changing the message of an earlier commit or of multiple commits is also possible, but requires a more complex procedure.

如果你所做的最后一次提交中有一条格式不正确的消息，你可以更新该消息。更改较早提交或多次提交的消息也是可以的，但需要更复杂的过程。

Run this command to change the commit message of the most recent commit.
The new commit message is formatted as described in the previous procedures.

运行此命令以更改最近提交的提交消息。新的提交消息会如前面的过程中所述进行格式化。

<code-example format="shell" language="shell">

git commit --amend -m "New commit message"

</code-example>

This command creates a new commit on your local computer that replaces the previous commit.
You must push this new commit before you open your pull request.
If you pushed the original commit to the repo in your GitHub account, run this command to force-push the commit with the new message.

此命令会在你的本地计算机上创建一个新提交，以替换以前的提交。你必须在打开 Pull Request 之前推送此新提交。如果你将原始提交推送到 GitHub 帐户中的存储库，请运行此命令以使用新消息强制推送提交。

<code-example format="shell" language="shell">

git push --force-with-lease

</code-example>

If you haven't pushed the commit you amended, you can run `git push` with no parameters to push your updated commit.

如果你没有推送你修改的提交，则可以运行不带参数的 `git push` 来推送你更新的提交。

## Prepare your branch for a pull request

## 准备你的分支以进行 Pull Request

When you created your working branch to update the documentation, you branched off the `main` branch.
Your changes in the working branch were based on the state of the `main` branch at that time you created the branch.

当你创建工作分支以更新文档时，你分支了 `main` 分支。你在工作分支中的更改是基于你创建分支时 `main` 分支的状态。

Since you created your working branch, it's quite likely that the `main` branch has been updated.
To make sure that your updates work with the current `main` branch, you should `rebase` your working branch to catch it up to what is current.
You might also need to squash the commits you made in your working branch to combine them for the pull request.

由于你创建了工作分支，因此 `main` 分支很可能已更新。为确保你的更新适用于当前的 `main` 分支，你应该重新 `rebase` 你的工作分支以将其赶上当前。你可能还需要压缩在工作分支中所做的提交，以将它们组合用于 Pull Request。

### Rebase your working branch

### 重新定位你的工作分支

<!-- markdownLint-disable MD033 -->

Rebasing your working branch changes the starting point of your commits from where the `main` branch was when you started to where it is now.

重新定位你的工作分支会将提交的起点从你开始时 `main` 分支的位置更改为现在的位置。

Before you can rebase your working branch, you must update both your *clone* and your *fork* of the upstream repo.

在你可以 rebase 你的工作分支之前，你必须更新你的*克隆*和上游存储库的*fork* 。

#### Why you rebase your working branch

#### 为什么要重新定位工作分支

Rebasing your working branch to the current state of the `main` branch eliminates conflicts before your working branch is merged back into `main`.
By rebasing your working branch, the commits in your working branch show only those changes that you made to fix the issue.
If you don't rebase your working branch, it can have merge commits.
Merge commits are commits that `git` creates to make up for the changes in the `main` branch since the `working` branch was created.
Merge commits aren't harmful, but they can complicate a future review of the changes.
The following illustrates the rebase process.

将工作分支重新绑定到 `main` 分支的当前状态可以在你的工作分支合并回 `main` 之前消除冲突。通过重新定位你的工作分支，工作分支中的提交仅显示你为解决问题所做的那些更改。如果你不重新定位工作分支，它可以有合并提交。合并提交是 `git` 为弥补自 `working` 分支创建以来 `main` 分支中的更改而创建的提交。合并提交是无害的，但它们可能会使将来对更改的查看复杂化。下面说明了 rebase 过程。

This image shows a `working` branch created from commit 5 of the `main` branch and then updated twice.
The numbered circles in these diagrams represent commits.

此图显示了一个从 `main` 分支的提交 5 创建然后更新两次的 `working` 分支。这些图中的编号圆圈表示提交。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="An image of a git repo with a working branch created from a main branch" src="generated/images/guide/doc-pr-prep/feature-with-new-branch.png">

</div>

This image shows the `main` branch after it was updated twice as the `working` branch was updated.

此图显示了随着 `working` 分支更新两次后的 `main` 分支。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="An image of a git repo with a working branch and an updated main branch" src="generated/images/guide/doc-pr-prep/feature-branch-w-update.png">

</div>

If the working branch was merged, a merge commit would be needed.
This image illustrates the result.

如果工作分支已合并，则需要合并提交。此图像说明了结果。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="An image of a git repo with a working branch and merged into the main branch" src="generated/images/guide/doc-pr-prep/feature-branch-w-merge.png">

</div>

To make it easy for future contributors, the Angular team tries to keep the commit log as a linear sequence of changes.
Incorporating merge commits includes changes that are the result of the merge along with what the author or developer changed. This makes it harder for future developers and authors to tell how the content evolved.

为了让未来的贡献者更轻松，Angular 团队会尝试将提交日志保留为线性更改顺序。合并合并提交包括作为合并结果的更改以及作者或开发人员更改的内容。这使得未来的开发人员和作者更难告诉我们内容是如何演变的。

To create a linear sequence of changes, you might need to update your `working` branch and update your changes. To add your updates to the current state of the `main` branch and prevent a merge commit, you rebase the `working` branch.

要创建线性更改序列，你可能需要更新 `working` 分支并更新你的更改。要将更新添加到 `main` 分支的当前状态并防止合并提交，你可以重新定位 `working` 分支。

Rebasing is how `git` updates your working branch to make it look like you created it from commit `9`.
To do this, it updates the commits in the `working` branch.
After rebasing the `working` branch, its commits now start from the last commit of the `main` branch.

重新定基是 `git` 更新你的工作分支以使其看起来就像你从提交 `9` 创建它的方式。为此，它会更新 `working` 分支中的提交。在重新定位 `working` 分支之后，其提交现在从 `main` 分支的最后一次提交开始。

This image shows the rebased `working` branch with is updated commits.

此图显示了具有更新提交的重新定位 `working` 分支。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="An image of a git repo with an updated working branch" src="generated/images/guide/doc-pr-prep/feature-branch-w-rebase.png">

</div>

When the rebased `working` branch is merged to main, its commits can now be appended to the `main` branch with no extra merge commits.

当重新定位的 `working` 分支合并到 main 时，其提交现在可以附加到 `main` 分支，而无需额外的合并提交。

This image shows the linear, `main` branch after merging the updated and rebased `working` branch.

此图显示了合并更新和重新定位的 `working` 分支后的线性 `main` 分支。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="An image of a git repo with an updated working branch" src="generated/images/guide/doc-pr-prep/feature-branch-merged.png">

</div>

#### To update your fork of the upstream repo

#### 更新上游存储库的 fork

You want to sync the `main` branch of your origin repo with the `main` branch of the upstream `angular/angular` before you open a pull request.

你希望在打开 Pull Request 之前将原始存储库的 `main` 分支与上游 `angular/angular` 的 `main` 分支同步。

This procedure updates your origin repo, the `personal/angular` repo, on your local computer so it has the current code, as illustrated here.
The circled numbers correspond to procedure steps.
The last step of this procedure then pushes the update to the fork of the `angular` in your GitHub account.

此过程会更新你本地计算机上的原始存储库（ `personal/angular` 存储库），以便它具有当前代码，如此处所示。带圆圈的数字对应于过程步骤。然后，此过程的最后一步将更新推送到你 GitHub 帐户中 `angular` 的 fork。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="An image of the git fetch/merge/push process used to update the local computer" src="generated/images/guide/doc-pr-prep/github-fetch-merge.png">

</div>

Perform these steps from a command-line tool on your local computer.

从本地计算机上的命令行工具执行这些步骤。

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

1. Update the `main` branch in the `working` directory on your local computer from the upstream `angular/angular` repo.

   从上游 `angular/angular` 存储库更新本地计算机 `working` 目录中的 `main` 分支。

   <code-example format="shell" language="shell">

   git fetch upstream
   git merge upstream/main

   </code-example>

1. Update your `personal/angular` repo on `github.com` with the latest from the upstream `angular/angular` repo.

   使用上游 `angular/angular` 存储库中的最新内容更新你在 `github.com` 上的 `personal/angular` 存储库。

   <code-example format="shell" language="shell">

   git push

   </code-example>

The `main` branch on your local computer and your origin repo on `github.com` are now in sync.
They have been updated with any changes to the upstream `angular/angular` repo that were made since the last time you updated your fork.

你本地计算机上的 `main` 分支和你在 `github.com` 上的原始存储库现在已同步。自你上次更新 fork 以来，对上游 `angular/angular` 存储库所做的任何更改都对它们进行了更新。

#### To rebase your working branch

#### 重新定位你的工作分支

Perform these steps from a command-line tool on your local computer.

从本地计算机上的命令行工具执行这些步骤。

1. From your [workspace](guide/doc-prepare-to-edit#create-a-git-workspace-on-your-local-computer) directory, run this command to navigate to your [working directory](guide/doc-prepare-to-edit#doc-working-directory).
   Remember to replace `personal` with your GitHub username.

   从你的[工作区](guide/doc-prepare-to-edit#create-a-git-workspace-on-your-local-computer)目录，运行此命令以导航到你的[工作目录](guide/doc-prepare-to-edit#doc-working-directory)。请记住将 `personal` 替换为你的 GitHub 用户名。

   <code-example format="shell" language="shell">

   cd personal/angular

   </code-example>

1. Run this command to check out your `working` branch.
   Replace `working-branch` with the name of your `working` branch.

   运行此命令以检查你的 `working` 分支。将 `working-branch` 替换为你的 `working` 分支的名称。

   <code-example format="shell" language="shell">

   git checkout working-branch

   </code-example>

1. Run this command to rebase your branch to add the commits from your `working` branch to the current content in the `main` branch.

   运行此命令来 rebase 你的分支，以将 `working` 分支中的提交添加到 `main` 分支中的当前内容。

   <code-example format="shell" language="shell">

   git rebase main

   </code-example>

1. Run this command to update your `working` branch in the repo in your GitHub account.

   运行此命令以更新你的 GitHub 帐户的存储库中的 `working` 分支。

   <code-example format="shell" language="shell">

   git push --force-with-lease

   </code-example>

### Review the commits in your working branch

### 查看工作分支中的提交

After you rebase your `working` branch, your commits should be after those of the current `main` branch.

在你对 `working` 分支进行 rebase 后，你的提交应该在当前 `main` 分支的提交之后。

#### To review the commits that you've added to the `working` branch

#### 查看你添加到 `working` 分支的提交

Perform these steps from a command-line tool on your local computer.

从本地计算机上的命令行工具执行这些步骤。

1. From your [workspace](guide/doc-prepare-to-edit#create-a-git-workspace-on-your-local-computer) directory, run this command to navigate to your [working directory](guide/doc-prepare-to-edit#doc-working-directory).
   Remember to replace `personal` with your GitHub username.

   从你的[工作区](guide/doc-prepare-to-edit#create-a-git-workspace-on-your-local-computer)目录，运行此命令以导航到你的[工作目录](guide/doc-prepare-to-edit#doc-working-directory)。请记住将 `personal` 替换为你的 GitHub 用户名。

   <code-example format="shell" language="shell">

   cd personal/angular

   </code-example>

1. Run this command to confirm that you are using the correct `working` branch.
   If you aren't in the correct branch, replace `working-branch` with the name of your `working` branch and run `git checkout working-branch` to select the correct branch.

   运行此命令以确认你使用了正确的 `working` 分支。如果你不在正确的分支中，请将 `working-branch` 替换为你的 `working` 分支的名称，并运行 `git checkout working-branch` 以选择正确的分支。

   <code-example format="shell" language="shell">

   git status

   </code-example>

1. Review the message from the previous `git status` command.
   If you aren't in the correct branch, replace `working-branch` with the name of your `working` branch and run `git checkout working-branch` to select the correct branch.

   查看来自上一个 `git status` 命令的消息。如果你不在正确的分支中，请将 `working-branch` 替换为你的 `working` 分支的名称，并运行 `git checkout working-branch` 以选择正确的分支。

1. Run this command to get a list of the commits in your `working` branch.

   运行此命令以获取 `working` 分支中的提交列表。

   <code-example format="shell" language="shell">

   git log --pretty=format:"%h %as %an %Cblue%s %Cgreen%D"

   </code-example>

   This command returns the log of commits in the `working` branch with the most recent commit at the top of the list.

   此命令会返回 `working` 分支中的提交日志，最近的提交在列表顶部。

1. In the output of the previous `git log` command, find the entry that contains `upstream/main`.
   It should be near the top of the list.

   在前一个 `git log` 命令的输出中，查找包含 `upstream/main` 的条目。它应该在列表的顶部附近。

   1. **Confirm that the entry that contains `upstream/main` also contains `origin/main` and `main`**

      **确认包含 `upstream/main` 的条目还包含 `origin/main` 和 `main`**

      If it doesn't, you must resync your clone and your fork of `angular/angular`, and then rebase the branch before you continue.

      如果不是，你必须重新同步你的克隆和 `angular/angular` 的 fork，然后在继续之前重新定位分支。

   1. **Confirm that all commits for your update are after the entry that contains `upstream/main`**

      **确认你的更新的所有提交都在包含 `upstream/main` 的条目之后**

      Remember that the log output is displayed with the most recent commit first. Your commits should all be on top of the entry that contains `upstream/main` in the log output.
      If any of your commits are listed after the entry that contains `upstream/main`, somehow your commits in the `working` branch got mixed up. You must fix the branch before you open a pull request.

      请记住，日志输出会首先显示最近的提交。你的提交应该都在日志输出中包含 `upstream/main` 的条目之上。如果你的任何提交在包含 `upstream/main` 的条目之后列出，则你在 `working` 分支中的提交会以某种方式混淆。你必须在打开 Pull Request 之前修复分支。

   1. **Confirm that your commit messages are in the correct format**

      **确认你的提交消息的格式正确**

      The commit message format is tested by the automated tests and it must be in the correct format before the pull request can be approved.

      提交消息格式由自动测试测试，它必须是正确的格式，然后可以批准 Pull Request。

   1. **Confirm that your commits and their messages reflect the changes your update makes to Angular**

      **确认你的提交及其消息反映了你的更新对 Angular 所做的更改**

      If you have more commits than changes, you might need to squash them into fewer commits before your pull request is approved.

      如果你的提交多于更改，你可能需要在你的 Pull Request 被批准之前将它们压缩为更少的提交。

## Next step

## 下一步

After you confirm that your updates and your `working` branch are correct, you are ready to [open a pull request](guide/doc-pr-open).

在你确认你的更新和 `working` 分支正确后，你就可以[打开 Pull Request 了](guide/doc-pr-open)。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-10-12
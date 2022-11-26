# Finish up a documentation pull request

# 完成文档 Pull Request

<!-- markdownLint-disable MD001 -->

This topic describes how to keep your workspace tidy after your pull request is merged and closed.

本主题介绍如何在合并和关闭 Pull Request 后保持工作区的整洁。

## Review the commit log of the upstream repo

## 查看上游存储库的提交日志

This procedure confirms that your commit is now in the `main` branch of the `angular/angular` repo.

此过程确认你的提交现在在 `angular/angular` 存储库的 `main` 分支中。

#### To review the commit log on <code>github.com</code> for your commit

#### 在上查看提交日志<code>github.com</code>对于你的提交

In a web browser, open [`https://https://github.com/angular/angular/commits/main`](https://github.com/angular/angular/commits/main).

在 Web 浏览器中，打开[`https://https://github.com/angular/angular/commits/main`](https://github.com/angular/angular/commits/main) 。

1. Review the commit list.

   查看提交列表。

   1. Find the entry with your GitHub username, commit message, and pull request number of your commit.
      The commit number might not match the commit from your working branch because of how commits are merged.

      查找包含你的 GitHub 用户名、提交消息和提交的 Pull Request 号的条目。由于提交的合并方式，提交号可能与你的工作分支中的提交不匹配。

   1. If you see your commit listed, your commit has been merged into `angular/angular` and you can continue cleaning up your workspace.

      如果你看到列出了你的提交，则你的提交已合并到 `angular/angular` 中，你可以继续清理你的工作区。

   1. If you don't see your commit in the list, you might need to wait before you retry this step.
      Do not continue cleaning your workspace until you see your commit listed in or after the log entry that contains `origin/main`.

      如果你在列表中没有看到你的提交，可能需要等待，然后重试此步骤。在你看到包含 `origin/main` 的日志条目中或之后列出你的提交之前，请不要继续清理你的工作区。

   1. If you see your commit listed above the log entry that contains `origin/main`, then you might need to update your clone of the `angular/angular` repo again.

      如果你看到包含 `origin/main` 的日志条目上方列出了你的提交，那么你可能需要再次更新 a `angular/angular` 存储库的克隆。

## Update your fork from the upstream repo

## 从上游存储库更新你的 fork

After you see that the commit from your pull request has been merged into the upstream `angular/angular` repo, update your fork.

在你看到 Pull Request 中的提交已合并到上游 `angular/angular` 存储库后，更新你的 fork。

This procedure updates your clone of `personal/angular` on your local computer and then, the repo in the cloud.

此过程会更新你本地计算机上的 `personal/angular` 克隆，然后更新云中的存储库。

#### To update your fork with the upstream repo

#### 使用上游存储库更新你的 fork

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

1. Run this command to update the `main` branch in the `working` directory on your local computer from the upstream `angular/angular` repo.

   运行此命令，以从上游 `angular/angular` 存储库更新本地计算机 `working` 目录中的 `main` 分支。

   <code-example format="shell" language="shell">

   git fetch upstream
   git merge upstream/main

   </code-example>

1. Run this command to update your `personal/angular` repo on `github.com` with the latest from the upstream `angular/angular` repo.

   运行此命令，使用上游 `angular/angular` 存储库中的最新内容更新你在 `github.com` 上的 `personal/angular` 存储库。

   <code-example format="shell" language="shell">

   git push

   </code-example>

1. Run this command to review the commit log of your fork.

   运行此命令以查看 fork 的提交日志。

   The `main` branch on your local computer and your origin repo on `github.com` are now in sync with the upstream `angular/angular` repo.
   Run this command to list the recent commits.

   本地计算机上的 `main` 分支和 `github.com` 上的原始存储库现在与上游 `angular/angular` 存储库同步。运行此命令以列出最近的提交。

   <code-example format="shell" language="shell">

   git log --pretty=format:"%h %as %an %Cblue%s %Cgreen%D"

   </code-example>

1. In the output of the previous `git log` command, find the entry with your GitHub username, commit message, and pull request number of your commit.
   The commit number might not match the commit from your working branch because of how commits are merged.

   在前一个 `git log` 命令的输出中，查找包含你的 GitHub 用户名、提交消息和提交的 Pull Request 号的条目。由于提交的合并方式，提交号可能与你的工作分支中的提交不匹配。

   You should find the commit from your pull request in or near the log entry that contains `upstream/main`.

   你应该在包含 `upstream/main` 的日志条目中或附近找到 Pull Request 中的提交。

If you find the commit from your pull request in the correct place, you can continue to delete your working branch.

如果你在正确的位置找到 Pull Request 中的提交，则可以继续删除你的工作分支。

## Delete the working branch

## 删除工作分支

After you confirm that your pull request is merged into `angular/angular` and appears in the `main` branch of your fork, you can delete the `working` branch.

在你确认你的 Pull Request 已合并为 `angular/angular` 并出现在 fork 的 `main` 分支中之后，你可以删除 `working` 分支。

Because your working branch was merged into the `main` branch of your fork, and the pull request has been closed, you no longer need the `working` branch.
It might be tempting to keep it around, just in case, but it is probably not necessary.
If you keep all your old working branches, your repository can collect unnecessary clutter.

因为你的工作分支已合并到 fork 的 `main` 分支中，并且 Pull Request 已关闭，所以你不再需要 `working` 分支。以防万一，可能很想保留它，但这可能不是必要的。如果你保留所有旧的工作分支，你的存储库可能会收集不必要的混乱。

#### To delete your working branch

#### 删除你的工作分支

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

1. Run this command to delete the working branch used in the pull request from your local computer.
   Replace `working-branch-name` with the name of your working branch.

   运行此命令，从本地计算机删除 Pull 请求中使用的工作分支。将 `working-branch-name` 替换为你的工作分支的名称。

   <code-example format="shell" language="shell">

   git branch -d working-branch-name

   </code-example>

1. Run this command to delete the working branch from your `personal/angular` repo on `github.com`.
   Replace `working-branch-name` with the name of your working branch.

   运行此命令，从 `github.com` 上的 `personal/angular` 存储库中删除工作分支。将 `working-branch-name` 替换为你的工作分支的名称。

   <code-example format="shell" language="shell">

    git push -d origin working-branch-name

   </code-example>

## Next step

## 下一步

After you delete the working branch for your last issue, you're ready to [select another issue to resolve](guide/doc-select-issue).

删除上一个问题的工作分支后，你就可以[选择另一个要解决的问题](guide/doc-select-issue)。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-10-12
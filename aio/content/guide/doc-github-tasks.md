# Common GitHub tasks to edit angular.io

# 编辑 angular.io 的通用 GitHub 任务

<!-- markdownLint-disable MD001 -->

<!-- markdownLint-disable MD033 -->

These are some of the common `git` tasks that you perform while editing Angular documentation.

这些是你在编辑 Angular 文档时执行的一些常见的 `git` 任务。

The procedures in this topic assume that the files on your local computer are organized as illustrated in the following diagram.

本主题中的过程假定本地计算机上的文件的组织方式如下图所示。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="An image of the working directories on a local computer" src="generated/images/guide/doc-github-tasks/pc-directory-config.png">

</div>

<div class="alert is-important">

**IMPORTANT**: <br />
Remember to replace `personal` with your GitHub username in the commands and examples in this topic.

</div>

* The procedures assume that your working directories are in a single `workspace` directory such that

  这些过程假定你的工作目录位于单个 `workspace` 目录中，以便

  * The local `working` directory of the upstream repo, `angular/angular` is in the `angular` subdirectory of the `angular` subdirectory of the `workspace` directory

    上游存储库的本地 `working` 目录 `angular/angular` 在 `workspace` 目录的 `angular` 子目录的 `angular` 子目录中

  * The local `working` directory of the origin repo, `personal/angular` is in the `angular` subdirectory of the `personal` subdirectory of the `workspace` directory

    原始存储库的本地 `working` 目录 `personal/angular` 在 `workspace` 目录的 `personal` 子目录的 `angular` 子目录中

* The procedures assume that you are starting from your `workspace` directory

  这些过程假定你是从 `workspace` 目录启动

## Update your clone of the upstream repo

## 更新你的上游存储库的克隆

The upstream repo is the `angular/angular` repo.
As it is updated, such as by merging pull requests, your clone falls behind.
To keep your clone of `angular/angular` up-to-date, you want to follow this procedure daily.

上游存储库是 `angular/angular` 存储库。随着它的更新，例如通过合并 Pull Request，你的克隆会落后。为了使你的 `angular/angular` 克隆保持最新，你要每天遵循此过程。

This procedure updates your **clone** of the `angular/angular` repo on your local computer so it has the current code, as illustrated here.
The circled number correspond to the procedure step.

此过程会更新你在本地计算机上对 `angular/angular` 存储库的**克隆**，以便它具有当前代码，如此处所示。带圆圈的数字对应于程序步骤。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="An image of the git pull process used to update the local computer" src="generated/images/guide/doc-github-tasks/github-sync-upstream.png">

</div>

#### To update your clone of the upstream repo

#### 更新你的上游存储库的克隆

1. From your `workspace` directory, navigate to the `working` directory of the upstream repo.

   从你的 `workspace` 目录，导航到上游存储库的 `working` 目录。

   <code-example format="shell" language="shell">

   cd angular/angular

   </code-example>

1. Check out the `main` branch.

   查看 `main` 分支。

   <code-example format="shell" language="shell">

   git checkout main

   </code-example>

1. Update the `main` branch in the `working` directory on your local computer with any changes in the upstream `angular/angular` repo.

   使用上游 `angular/angular` 存储库中的任何更改来更新本地计算机 `working` 目录中的 `main` 分支。

   <code-example format="shell" language="shell">

   git pull

   </code-example>

The `main` branch of the clone on your local computer and the upstream repo on `github.com` are now in sync.
Now would be a good time to update your fork as well.

本地计算机上克隆的 `main` 分支和 `github.com` 上的上游存储库现在已同步。现在也是更新你的 fork 的好时机。

## Update your fork with the upstream repo

## 使用上游存储库更新你的 fork

You want to sync the `main` branch of your fork with the `main` branch of the upstream, `angular/angular` repo at least daily.
This is good thing to do at the beginning of each day.
Sync your fork after you update your clone of the upstream repo and before you start working on the Angular documentation.

你要至少每天将 fork 的 `main` 分支与上游的 `angular/angular` 存储库的 `main` 分支同步。这是在每一天开始时做的好事。在更新上游存储库的克隆之后、开始处理 Angular 文档之前，同步你的 fork。

This procedure updates your **fork** of the `angular/angular` repo on your local computer so it has the current code, as illustrated here.
The circled numbers correspond to procedure steps.

此过程会更新你本地计算机上 `angular/angular` 存储库的**fork** ，以便它具有当前代码，如此处所示。带圆圈的数字对应于过程步骤。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="An image of the git fetch/merge/push process used to update the local computer" src="generated/images/guide/doc-github-tasks/github-fetch-merge.png">

</div>

#### To update your fork with the upstream repo

#### 使用上游存储库更新你的 fork

1. From your workspace directory, navigate to your working directory.

   从你的工作区目录，导航到你的工作目录。

   <code-example format="shell" language="shell">

   cd personal/angular

   </code-example>

1. Check out the `main` branch.

   查看 `main` 分支。

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

The `main` branch on your local computer and your *origin* repo on `github.com` are now in sync.
They have been updated with any changes to the upstream `angular/angular` repo that were made since the last time you updated your fork.

你本地计算机上的 `main` 分支和你在 `github.com` 上的*原始*存储库现在已同步。自你上次更新 fork 以来，对上游 `angular/angular` 存储库所做的任何更改都对它们进行了更新。

## Create a working branch for editing

## 创建工作分支进行编辑

Almost all your editing on the Angular documentation is done:

几乎你对 Angular 文档的所有编辑都已完成：

* In the clone of your fork of `angular/angular`, not in your clone of `angular/angular`

  在你的 `angular/angular` 的 fork 的克隆中，而不是在你的 `angular/angular` 的克隆中

* In a `working` or `feature` branch made from the `main` branch

  在从 `main` 分支创建的 `working` 或 `feature` 分支中

If this isn't clear, see [More about branches](#more-about-branches).

如果这不清楚，请参阅[有关分支的更多信息](#more-about-branches)。

Before you start editing the Angular documentation, you want to:

在开始编辑 Angular 文档之前，你要：

1. [Update your clone of `angular/angular`](#update-your-clone-of-the-upstream-repo).

   [更新你的 `angular/angular` 克隆](#update-your-clone-of-the-upstream-repo)。

1. [Update your fork of `angular/angular`](#update-your-fork-with-the-upstream-repo).

   [更新你的 `angular/angular` 的 fork](#update-your-fork-with-the-upstream-repo) 。

1. Create a working branch from the `main` branch.

   从 `main` 分支创建一个工作分支。

A working branch gives you a way to keep track of the changes that you make to the Angular documentation.
You also need a separate branch to submit those changes in a pull request.
Creating a working branch also keeps your changes for one update separate from those of another.

工作分支为你提供了一种方式来跟踪你对 Angular 文档所做的更改。你还需要一个单独的分支来在 Pull Request 中提交这些更改。创建工作分支还会将你对一个更新的更改与另一个更新分开。

<div class="alert is-informational">

**NOTE**: <br />
Before you edit Angular documentation, make sure that you are using the correct `working` branch.
You can confirm your current branch by running `git status` from your `working` directory before you start editing.

</div>

#### To create a `working` branch for editing

#### 创建 `working` 分支进行编辑

1. [Update your clone of `angular/angular`](#update-your-clone-of-the-upstream-repo).

   [更新你的 `angular/angular` 克隆](#update-your-clone-of-the-upstream-repo)。

1. [Update your fork of `angular/angular`](#update-your-fork-with-the-upstream-repo).

   [更新你的 `angular/angular` 的 fork](#update-your-fork-with-the-upstream-repo) 。

1. From your `workspace` directory, navigate to your `working` directory.

   从你的 `workspace` 目录，导航到你的 `working` 目录。

   <code-example format="shell" language="shell">

   cd personal/angular

   </code-example>

1. Check out the `main` branch.

   查看 `main` 分支。

   <code-example format="shell" language="shell">

   git checkout main

   </code-example>

1. Create your new branch.
   Replace `new-branch` with the name of your new branch.

   创建你的新分支。将 `new-branch` 替换为新分支的名称。

   Name the branch something that relates to your editing task, for example, if you are resolving `issue #12345`, you might name the branch, `issue-12345`.
   If you are improving error messages, you might name it, `error-message-improvements`.
   A branch name can have alphanumeric characters, hyphens, underscores, and slashes, but it can't have any spaces or other special characters.

   将分支命名为与你的编辑任务相关的内容，例如，如果你要解决 `issue #12345` ，你可以将分支命名为 `issue-12345` 。如果你正在改进错误消息，你可以将其命名为 `error-message-improvements` 。分支名称可以有字母数字字符、连字符、下划线和斜线，但不能有任何空格或其他特殊字符。

   <code-example format="shell" language="shell">

   git checkout -b new-branch

   </code-example>

1. Push the new branch to your repo on `github.com` so you have a copy of it in the cloud.
   Remember to replace `new-branch` with the name of your new branch.

   将新分支推送到你在 `github.com` 上的存储库，以便你在云端拥有它的副本。请记住将 `new-branch` 替换为新分支的名称。

   <code-example format="shell" language="shell">

   git push --set-upstream origin new-branch

   </code-example>

## Save your changes

## 保存你的更改

This section describes how to save the changes you make to files in the working directory of your fork of the Angular repo.
If you are new to using git and GitHub, review this section carefully to understand how to save your changes as you make them.

本节介绍如何保存你对 Angular 存储库的 fork 工作目录中的文件所做的更改。如果你是使用 git 和 GitHub 的新手，请仔细查看本节，以了解如何在进行更改时保存更改。

As you make changes to files in the working directory of your fork of the Angular repo, your changes can be:

当你对 Angular 存储库的 fork 工作目录中的文件进行更改时，你的更改可以是：

* **Made but not saved**

  **已创建但未保存**

  This is the state of your changes as you edit a file in your integrated development environment (IDE).
    This is the state of your changes as you're making them in your IDE.

  这是你在集成开发环境 (IDE) 中编辑文件时所做的更改的状态。这是你在 IDE 中进行更改时的状态。

* **Saved but not committed**

  **已保存但未提交**

  After you save changes to a file from the IDE, they are saved to your local computer.
    While the changes have been saved, they have not been recorded as a change by `git`, the version control software.
    Your files are typically in this state as you review your work in progress.

  从 IDE 保存对文件的更改后，它们会保存到你的本地计算机。虽然更改已保存，但它们并没有被版本控制软件 `git` 记录为更改。当你查看正在进行的工作时，你的文件通常处于此状态。

* **Committed but not pushed**

  **已提交但未推送**

  After you commit your changes to `git`, your changes are recorded as a *commit* on your local computer, but they are not saved in the cloud.
    This is the state of your files when you've reached a milestone and save your progress locally.

  将更改提交到 `git` 后，你的更改会记录为本地计算机上的*提交*，但它们不会保存在云端。这是你达到里程碑并在本地保存进度时文件的状态。

* **Committed and pushed**

  **承诺并推动**

  After you push your commits to your personal repo in `github.com`, your changes have been recorded by `git` and saved to the cloud. They are not yet part of the `angular/angular` repo.
    This is the state your files need to be in before you can open a pull request for it to become part of the `angular/angular` repo.

  在你将提交推送到 `github.com` 中的个人存储库后，你的更改已被 `git` 记录并保存到云端。它们还不是 `angular/angular` 存储库的一部分。这是你的文件需要处于的状态，然后你可以打开 Pull Request 以使其成为 `angular/angular` 存储库的一部分。

* **Merged into Angular**

  **合并到 Angular**

  After your pull request is approved and merged, the changes you made are now part of the `angular/angular` repo.

  在你的 Pull Request 被批准并合并后，你所做的更改现在是 `angular/angular` 存储库的一部分。

### Save your changes to your local computer

### 将更改保存到本地计算机

How to save changes to a file on your local computer is determined by your IDE.
Refer to your IDE for the specific procedure of saving changes.

如何保存对本地计算机上文件的更改由你的 IDE 确定。有关保存更改的具体过程，请参阅你的 IDE。

### Commit your changes on your local computer

### 在本地计算机上提交你的更改

Follow this procedure after you save changes on your local computer and you are ready to commit changes to `git` on your local computer.

在本地计算机上保存更改并准备好将更改提交到本地计算机上的 `git` 后，请按照此过程进行操作。

#### To commit your changes on your local computer

#### 在本地计算机上提交你的更改

1. From your workspace directory, navigate to your working directory.

   从你的工作区目录，导航到你的工作目录。

   <code-example format="shell" language="shell">

   cd personal/angular

   </code-example>

1. Confirm you are using the correct branch.
   If you aren't in the correct branch, run `git checkout branch-name` to select the correct branch.

   确认你使用了正确的分支。如果你不在正确的分支中，请运行 `git checkout branch-name` 以选择正确的分支。

   <code-example format="shell" language="shell">

   git status

   </code-example>

1. Review the list of files to add to the commit is correct.

   查看要添加到提交的文件列表是否正确。

   <code-example format="shell" language="shell">

   git status

   </code-example>

1. Add the files you want to commit.

   添加你要提交的文件。

   <code-example format="shell" language="shell">

   git add filename

   </code-example>

   You can add multiple files in a single command by using wildcard characters in the filename parameter.
   You can also add all changed files that are already being tracked by `git` to the commit by using `--all` option as this example shows.

   你可以通过在 filename 参数中使用通配符来在单个命令中添加多个文件。如此示例所示，你还可以用 `--all` 选项将 `git` 已经跟踪的所有更改文件添加到提交中。

   <code-example format="shell" language="shell">

   git add --all

   </code-example>

1. Commit the changes to the local computer.
   Replace `detailed-commit-comment` with a specific comment that describes the changes you made.

   将更改提交到本地计算机。将 `detailed-commit-comment` 替换为描述你所做更改的特定注释。

   <code-example format="shell" language="shell">

   git commit -m 'docs: detailed-commit-comment'

   </code-example>

### Push your changes to your GitHub account in the cloud

### 将你的更改推送到云中的 GitHub 帐户

After you have committed changes to your local computer, this procedure saves your commits to your GitHub account in the cloud.

在你提交对本地计算机的更改后，此过程会将你的提交保存到云中的 GitHub 帐户。

#### To push your changes to your GitHub account in the cloud

#### 将你的更改推送到云中的 GitHub 帐户

1. From your `workspace` directory, navigate to your `working` directory.

   从你的 `workspace` 目录，导航到你的 `working` 目录。

   <code-example format="shell" language="shell">

   cd personal/angular

   </code-example>

1. Confirm you are using the correct branch.
   If you aren't in the correct branch, run `git checkout branch-name` to select the correct branch.

   确认你使用了正确的分支。如果你不在正确的分支中，请运行 `git checkout branch-name` 以选择正确的分支。

   <code-example format="shell" language="shell">

   git status

   </code-example>

1. Push the commits on your local computer to your account on GitHub in the cloud.

   将本地计算机上的提交推送到你在云中的 GitHub 上的帐户。

   <code-example format="shell" language="shell">

   git push

   </code-example>

   If this is the first time you've pushed commits from the branch, you can see a message such as this.

   如果这是你第一次从分支推送提交，你可以看到如下消息。

   <code-example format="shell" language="shell">

   fatal: The current branch my-new-branch has no upstream branch.
   To push the current branch and set the remote as upstream, use

       git push --set-upstream origin my-new-branch

   To have this happen automatically for branches without a tracking
   upstream, see 'push.autoSetupRemote' in 'git help config'.

   </code-example>

   If you get this message, copy the command that the message provides and run it as shown here:

   如果你收到此消息，请复制消息提供的命令并运行它，如下所示：

   <code-example format="shell" language="shell">

   git push --set-upstream origin my-new-branch

   </code-example>

### Open pull requests to merge a change into `angular/angular`

### 打开 Pull Request 以将更改合并为 `angular/angular`

For information about preparing your changes to open a pull request, see [Preparing documentation for a pull request](guide/doc-pr-prep).

有关准备更改以打开 Pull Request 的信息，请参阅[为 Pull Request 准备文档](guide/doc-pr-prep)。

## Keep your branch up-to-date

## 使你的分支保持最新

If your changes to the documentation take more than a day, the `angular/angular` repo can change while you're editing.
Before you can merge your changes, they must be made on top of the current code.
You must update your working branch after you've made all your changes and before you open a pull request.
You might also want to keep your working branch updated as you're editing.
Either way, the procedure to update your branch is the same.

如果你对文档的更改需要一天以上的时间，则 `angular/angular` 存储库可以在你编辑时更改。在合并更改之前，必须在当前代码之上进行。在进行所有更改之后、打开 Pull Request 之前，你必须更新你的工作分支。你可能还希望在编辑时保持工作分支更新。无论哪种方式，更新分支的过程都是相同的。

#### To keep your branch up-to-date

#### 使你的分支保持最新

1. [Update your clone of `angular/angular`](#update-your-clone-of-the-upstream-repo).

   [更新你的 `angular/angular` 克隆](#update-your-clone-of-the-upstream-repo)。

1. [Update your fork of `angular/angular`](#update-your-fork-with-the-upstream-repo).

   [更新你的 `angular/angular` 的 fork](#update-your-fork-with-the-upstream-repo) 。

1. From your workspace directory, navigate to your working directory.

   从你的工作区目录，导航到你的工作目录。

   <code-example format="shell" language="shell">

   cd personal/angular

   </code-example>

1. Confirm that you are using the correct branch.
   If you aren't in the correct branch, run `git checkout branch-name` to select the correct branch.

   确认你使用了正确的分支。如果你不在正确的分支中，请运行 `git checkout branch-name` 以选择正确的分支。

   <code-example format="shell" language="shell">

   git status

   </code-example>

   If you have any un-commited changes, [Commit your changes on your local computer](#commit-your-changes-on-your-local-computer) before you continue.

   如果你有任何未提交的更改，请在继续之前[在本地计算机上提交你的更改](#commit-your-changes-on-your-local-computer)。

1. Rebase your branch to add the changes in your branch to the current content in the `main` branch.

   重新定位你的分支以将分支中的更改添加到 `main` 分支中的当前内容。

   <code-example format="shell" language="shell">

   git rebase main

   </code-example>

1. Update the branch in your repo in the cloud.

   在云中更新你的存储库中的分支。

   <code-example format="shell" language="shell">

   git push --force-with-lease

   </code-example>

## More about branches

## 有关分支的更多信息

`git` is a version control system that tracks the changes made to the files in a repo.
It does this by maintaining a lists of changes called `commits`.
A commit is a list of all the things that changed in a repo since the last commit.

`git` 是一个版本控制系统，可以跟踪对存储库中文件所做的更改。它通过维护一个称为 `commits` 的更改列表来实现。提交是自上次提交以来在存储库中更改的所有内容的列表。

### What are branches

### 什么是分支

A `branch` is a list of commits.
The `main` branch is the list of commits that reflects the current state of the project.

`branch` 是提交的列表。 `main` 分支是反映项目当前状态的提交列表。

When a repo is created, the first commit is usually to the `main` branch and contains the files used in the creation of the repo.
The change list in that commit contains the names and the contents of the files that were added to create the repo.

创建存储库时，第一次提交通常是到 `main` 分支，并包含创建存储库中使用的文件。该提交中的更改列表包含为创建存储库添加的文件的名称和内容。

The next time files in the repo are added or changed, another commit is created to describe what has changed.

下次添加或更改存储库中的文件时，会创建另一个提交来描述发生的更改。

After a five commits, the `main` branch can be imagined as the following diagram.
The diagram shows a series of changes that are recorded as commits, each represented as a circle and identified by a unique number.

在五次提交之后， `main` 分支可以想象为下图。该图显示了记录为提交的一系列更改，每个更改都表示为一个圆圈并由一个唯一的数字标识。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="A row of circles, each numbered 1 through 5 and connected by a horizontal line" src="generated/images/guide/doc-github-tasks/main-branch.png">

</div>

In this example, the result of all the changes in commits one through five is the current state of the repo.

在此示例中，提交 1 到 5 中所有更改的结果是存储库的当前状态。

### Creating a working branch

### 创建工作分支

In `angular/angular`, the `main` branch contains all the changes that have been made to the Angular project since it began to get it to where it is today.
The list of commits in the `main` branch have all been reviewed and tested.

在 `angular/angular` 中， `main` 分支包含自 Angular 项目开始到达今天的位置以来对它所做的所有更改。 `main` 分支中的提交列表都已经过审查和测试。

When you update the documentation, you might need to make several changes before have exactly what you want.
You don't want to open a pull request to merge your changes into `main` until you have had a chance to test and review them.

更新文档时，你可能需要进行一些更改才能获得你想要的内容。在你有机会测试和查看它们之前，你不希望打开 Pull Request 将你的更改合并到 `main` 中。

To do this you create a new `working` branch in which to work.
This example names the new `working` branch.

为此，你创建一个要在其中工作的新 `working` 分支。此示例命名新的 `working` 分支。

<code-example format="shell" language="shell">

&num; From the working directory of your personal/angular repo
git checkout main;        &num; start from the main branch
git checkout -b working;  &num; create a new branch named "working"

</code-example>

The `working` branch starts with all the changes that have already been made in the `main` branch.
From this, you can make your own changes.
After making two commits in the `working` branch, the branches in the repo can be imagined as this illustration.

`working` 分支从 `main` 分支中已经进行的所有更改开始。由此，你可以进行自己的更改。在 `working` 分支中进行两次提交后，存储库中的分支可以想象成这个插图。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="A row of circles, each numbered 3 through 5 connected by a horizontal line with a line coming vertically out of circle 5 to create a branch" src="generated/images/guide/doc-github-tasks/feature-with-new-branch.png">

</div>

### Merging your work into the main branch

### 将你的工作合并到主分支

If the changes you made in the two commits from the previous section have what you want to use.
That is, you have reviewed and tested those changes.
You can open a pull request to merge those new changes into the `main` branch.

如果你在上一节的两个提交中所做的更改具有你想要使用的内容。也就是说，你已经查看并测试了这些更改。你可以打开一个 Pull Request 以将这些新更改合并到 `main` 分支。

If no changes have been made to the `main` branch since you created your branch, the merge is called `fast-forwarding`.
In a `fast-forward` merge the two commits you added to the `working` branch are added to the `main` branch.

如果自创建分支以来没有对 `main` 分支进行任何更改，则合并称为 `fast-forwarding` 。在 `fast-forward` 合并中，你添加到 `working` 分支的两个提交会添加到 `main` 分支。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="A row of circles, each numbered 3 through 7 connected by a horizontal line with a line coming vertically out of circle 5 to create a branch" src="generated/images/guide/doc-github-tasks/feature-branch-ff.png">

</div>

After the `working` branch has been merged with the `main` branch, the `main` branch now includes the two commits you made in the `working` branch.
Because both branches include commits 1-7, they now have the same content.

在 `working` 分支与 `main` 分支合并后， `main` 分支现在包含你在 `working` 分支中所做的两个提交。因为这两个分支都包含提交 1-7，所以它们现在具有相同的内容。

### Merging your work into a changed main branch

### 将你的工作合并到更改后的主分支

Being able to `fast-foward` a merge is simple.
Unfortunately, in a repo like `angular/angular` that has many contributors, the main branch is changing frequently.
A more likely scenario is illustrated here, where the `main` branch changed while you're working on your changes in the `working` branch.
The resulting branches could be imagined as the following illustration.
While you were working on commits six and seven, others had contributed commits eight and nine.

能够 `fast-foward` 合并很简单。不幸的是，在像 `angular/angular` 这样有许多贡献者的存储库中，主分支经常更改。这里展示了一个更有可能的场景，其中的 `main` 分支在你处理 `working` 分支中的更改时发生了更改。生成的分支可以想象为下图。当你处理提交 6 和 7 时，其他人也贡献了提交 8 和 9。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="A row of circles, each numbered 3 through 9 connected by a horizontal line with a line coming vertically out of circle 5 to create a branch" src="generated/images/guide/doc-github-tasks/feature-branch-w-update.png">

</div>

The commits six and seven can't be used to fast-forward.
Remember that a commit is a list of changes.
Commit six is the list of changes from commit five plus the first edit you made.
Commit seven is the list of changes from your commit six plus the changes you made in response to your review comments.
In any case, the commits from your `working` branch can't be added to the commit nine in the main branch.
The commits from the `working` branch don't include the changes from commits eight and nine, so they could be lost.

提交 6 和 7 不能用于快进。请记住，提交是更改的列表。提交 6 是从提交 5 开始的更改列表加上你所做的第一个编辑。提交 7 是你的提交 6 中的更改列表以及你为响应审阅评论所做的更改。无论如何，来自 `working` 分支的提交都不能添加到主分支中的提交 9。 `working` 分支的提交不包括来自提交 8 和 9 的更改，因此它们可能会丢失。

You cam choose to merge the changes in the two branches or to rebase the commits in your `working` branch.
Merging creates a `merge` commit to reconcile the changes necessary to represent the net result of both branches.
While merging isn't bad, it makes it hard to undo the individual changes.

你可以选择合并两个分支中的更改或重新定位 `working` 分支中的提交。合并会创建一个 `merge` 提交，以协调为表示两个分支的最终结果所需的更改。虽然合并也不错，但它很难撤消单个更改。

@reviewed 2022-09-30
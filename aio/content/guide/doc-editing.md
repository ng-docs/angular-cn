# Make and save changes to a documentation topic

# 对文档主题进行更改并保存

<!-- markdownLint-disable MD001 -->

<!-- markdownLint-disable MD033 -->

This topic describes tasks that you perform while making changes to the documentation.

本主题介绍你在更改文档时要执行的任务。

<div class="alert is-important">

**IMPORTANT**: <br />
Only perform these tasks after you have created a working branch in which to work as described in [Create a working branch for editing](guide/doc-update-start#create-a-working-branch-for-editing).

</div>

## Work in the correct working branch

## 在正确的工作分支中工作

Before you change any files, make sure that you are working in the correct working branch.

在更改任何文件之前，请确保你正在正确的工作分支中工作。

#### To set the correct working branch for editing

#### 设置正确的工作分支进行编辑

Perform these steps from a command-line tool on your local computer.

从本地计算机上的命令行工具执行这些步骤。

1. From your [workspace](guide/doc-prepare-to-edit#create-a-git-workspace-on-your-local-computer) directory, run this command to navigate to your [working directory](guide/doc-prepare-to-edit#doc-working-directory).
   Remember to replace `personal` with your GitHub username.

   从你的[工作区](guide/doc-prepare-to-edit#create-a-git-workspace-on-your-local-computer)目录，运行此命令以导航到你的[工作目录](guide/doc-prepare-to-edit#doc-working-directory)。请记住将 `personal` 替换为你的 GitHub 用户名。

   <code-example language="shell">

   cd personal/angular

   </code-example>

1. Run this command to check out your working branch.
   Replace `working-branch` with the name of the branch that you created for the documentation issue.

   运行此命令以检查你的工作分支。将 `working-branch` 替换为你为文档问题创建的分支名称。

   <code-example language="shell">

   git checkout working-branch

   </code-example>

## Edit the documentation

## 编辑文档

Review the [Angular documentation style guide](guide/styleguide) before you start editing to understand how to write and format the text in the documentation.

在开始编辑之前，请查看[Angular 文档风格指南](guide/styleguide)，以了解如何编写文档中的文本并设置其格式。

In your working branch, edit the files that need to be changed. Most documentation source files are found in the `aio/content/guide` directory of the `angular` repo.

在你的工作分支中，编辑需要更改的文件。大多数文档源文件都可以在 `angular` 存储库的 `aio/content/guide` 目录中找到。

Angular development tools can render the documentation as you make your changes.

Angular 开发工具可以在你进行更改时呈现文档。

#### To view the rendered documentation while you are editing

#### 在编辑时查看渲染的文档

<!-- vale Angular.Google_WordListSuggestions = NO -->

Perform these steps from a command-line tool on your local computer or in the **terminal** pane of your IDE.

从本地计算机上的命令行工具或 IDE 的**终端**窗格中执行这些步骤。

<!-- vale Angular.Google_WordListSuggestions = YES -->

1. Navigate to your [working directory](guide/doc-prepare-to-edit#doc-working-directory).

   导航到你的[工作目录](guide/doc-prepare-to-edit#doc-working-directory)。

1. From your working directory, run this command to navigate to the `aio` directory. The `aio` directory contains Angular's documentation files and tools.

   从你的工作目录，运行此命令以导航到 `aio` 目录。 `aio` 目录包含 Angular 的文档文件和工具。

   <code-example language="shell">

   cd aio

   </code-example>

1. Run this command to build the documentation locally.

   运行此命令以在本地构建文档。

   <code-example language="shell">

   yarn build

   </code-example>

   This builds the documentation from scratch, but does not serve it.

   这会从头开始构建文档，但不提供它。

1. Run this command to serve and sync the documentation.

   运行此命令以提供和同步文档。

   <code-example language="shell">

   yarn serve-and-sync

   </code-example>

   This serves your draft of the angular.io website locally at `http://localhost:4200` and watches for changes to documentation files.
   Each time you save an update to a documentation file, the angular.io website at `http://localhost:4200` is updated.
   You might need to refresh your browser to see the changes after you save them.

   这会在本地为你的 angular.io 网站草稿提供 `http://localhost:4200` ，并监视对文档文件的更改。每次你将更新保存到文档文件时，位于 `http://localhost:4200` 的 angular.io 网站都会更新。保存后，你可能需要刷新浏览器以查看更改。

### Documentation linting

### 文档 linting

If you installed Vale on your local computer and your IDE, each time you save a markdown file, Vale reviews it for common errors.
Vale, the documentation linter, reports the errors it finds in the **Problems** pane of Visual Studio Code.
The errors are also reflected in the documentation source code, as close to the problem as possible.

如果你在本地计算机和 IDE 上安装了 Vale，每次你保存 Markdown 文件时，Vale 都会检查它的常见错误。文档 linter Vale 会报告它在 Visual Studio Code 的“**问题**”窗格中发现的错误。这些错误也会反映在文档源代码中，尽可能接近问题。

For more information about documentation linting and resolving lint problems, see [Resolve documentation linter messages](guide/docs-lint-errors).

有关文档 linting 和解决 lint 问题的更多信息，请参阅[解决文档 linter 消息](guide/docs-lint-errors)。

## Save your changes

## 保存你的更改

As you make changes to the documentation source files on your local computer, your changes can be in one of these states.

当你对本地计算机上的文档源文件进行更改时，你的更改可以处于这些状态之一。

* **Made, but not saved**

  **已创建，但未保存**

  This is the state of your changes as you edit a file in your integrated development environment (IDE).

  这是你在集成开发环境 (IDE) 中编辑文件时所做的更改的状态。

* **Saved, but not committed**

  **已保存，但未提交**

  After you save changes to a file from the IDE, they are saved to your local computer.
   While the changes have been saved, they have not been recorded as a change by `git`, the version control software.
   Your files are typically in this state as you review your work in progress.

  从 IDE 保存对文件的更改后，它们会保存到你的本地计算机。虽然更改已保存，但它们并没有被版本控制软件 `git` 记录为更改。当你查看正在进行的工作时，你的文件通常处于此状态。

* **Committed, but not pushed**

  **已提交，但未推送**

  After you commit your changes to `git`, your changes are recorded as a *commit* on your local computer, but they are not saved in the cloud.
   This is the state of your files when you've made some progress and you want to save that progress as a commit.

  将更改提交到 `git` 后，你的更改会记录为本地计算机上的*提交*，但它们不会保存在云端。这是你取得一些进展并且你希望将该进度保存为提交时的文件状态。

* **Committed and pushed**

  **承诺并推动**

  After you push your commits to your personal repo in `github.com`, your changes are recorded by `git` and saved to the cloud.
   They are not yet part of the `angular/angular` repo.
   This is the state your files must be in before you can open a pull request for them to become part of the `angular/angular` repo.

  在你将提交推送到 `github.com` 中的个人存储库后，你的更改会由 `git` 记录并保存到云端。它们还不是 `angular/angular` 存储库的一部分。这是你的文件必须处于的状态，然后你可以打开 Pull Request 以使它们成为 `angular/angular` 存储库的一部分。

* **Merged into Angular**

  **合并到 Angular**

  After your pull request is approved and merged, the changes you made are now part of the `angular/angular` repo and appear in the [angular.io](https://angular.io) web site.
   Your documentation update is complete.

  在你的 Pull Request 被批准并合并后，你所做的更改现在是 `angular/angular` 存储库的一部分，并出现在[angular.io](https://angular.io)网站中。你的文档更新已完成。

This section describes how to save the changes you make to files in your working directory.
If you are new to using `git` and GitHub, review this section carefully to understand how to save your changes as you make them.

本节介绍如何保存对工作目录中的文件所做的更改。如果你是使用 `git` 和 GitHub 的新手，请仔细查看本节，以了解如何在进行更改时保存更改。

### Save your changes to your local computer

### 将更改保存到本地计算机

How to save changes that you make to a file on your local computer is determined by your IDE.
Refer to your IDE for the specific procedure of saving changes.
This process makes your changes *saved, but not committed*.

如何保存你对本地计算机上的文件所做的更改由你的 IDE 确定。有关保存更改的具体过程，请参阅你的 IDE。此过程会*保存你的更改，但未提交*。

### Review your rendered topics

### 查看你呈现的主题

After you save changes to a documentation topic, and before you commit those changes on your local computer, review the rendered topic in a browser.

保存对文档主题的更改之后，在本地计算机上提交这些更改之前，请在浏览器中查看呈现的主题。

#### To render your changes in a browser on your local computer

#### 在本地计算机的浏览器中呈现你的更改

<!-- vale Angular.Google_WordListSuggestions = NO -->

Perform these steps from a command-line tool on your local computer or in the **terminal** pane of your IDE.

从本地计算机上的命令行工具或 IDE 的**终端**窗格中执行这些步骤。

<!-- vale Angular.Google_WordListSuggestions = YES -->

1. From your [workspace](guide/doc-prepare-to-edit#create-a-git-workspace-on-your-local-computer) directory, run this command to navigate to the `aio` directory in your [working directory](guide/doc-prepare-to-edit#doc-working-directory).
   Remember to replace `personal` with your GitHub username.

   从你的[工作区](guide/doc-prepare-to-edit#create-a-git-workspace-on-your-local-computer)目录，运行此命令以导航到[工作目录](guide/doc-prepare-to-edit#doc-working-directory)中的 `aio` 目录。请记住将 `personal` 替换为你的 GitHub 用户名。

   ```
   <code-example language="shell">

   cd personal/angular/aio

   </code-example>
   ```

1. Run this command to build the documentation using the files on your local computer.

   运行此命令以使用本地计算机上的文件构建文档。

   <code-example language="shell">

   yarn build

   </code-example>

   This command builds the documentation from scratch, but does not serve it for viewing.

   此命令从头开始构建文档，但不提供查看。

1. Run this command to serve the documentation locally and rebuild it after it changes.

   运行此命令以在本地提供文档，并在其更改后重建它。

   <code-example language="shell">

   yarn serve-and-sync

   </code-example>

   This command serves the Angular documentation at [`http://localhost:4200`](http://localhost:4200).
   You might need to refresh the browser after the documentation is updated to see the changes in your browser.

   此命令在[`http://localhost:4200`](http://localhost:4200)提供 Angular 文档。更新文档后，你可能需要刷新浏览器以查看浏览器中的更改。

After you are satisfied with the changes, commit them on your local computer.

对更改感到满意后，请在本地计算机上提交它们。

### Commit your changes on your local computer

### 在本地计算机上提交你的更改

Perform this procedure after you save the changes on your local computer and you are ready to commit changes on your local computer.

在本地计算机上保存更改并准备好在本地计算机上提交更改后，执行此过程。

#### To commit your changes on your local computer

#### 在本地计算机上提交你的更改

<!-- vale Angular.Google_WordListSuggestions = NO -->

Perform these steps from a command-line tool on your local computer or in the **terminal** pane of your IDE.

从本地计算机上的命令行工具或 IDE 的**终端**窗格中执行这些步骤。

<!-- vale Angular.Google_WordListSuggestions = YES -->

1. From your [workspace](guide/doc-prepare-to-edit#create-a-git-workspace-on-your-local-computer) directory, run this command to navigate to the `aio` directory in your [working directory](guide/doc-prepare-to-edit#doc-working-directory).
   Remember to replace `personal` with your GitHub username.

   从你的[工作区](guide/doc-prepare-to-edit#create-a-git-workspace-on-your-local-computer)目录，运行此命令以导航到[工作目录](guide/doc-prepare-to-edit#doc-working-directory)中的 `aio` 目录。请记住将 `personal` 替换为你的 GitHub 用户名。

   <code-example language="shell">

   cd personal/angular/aio

   </code-example>

1. Run this command to confirm that you are ready to commit your changes.

   运行此命令以确认你已准备好提交更改。

   <code-example language="shell">

   git status

   </code-example>

   The `git status` command returns an output like this.

   `git status` 命令会返回这样的输出。

   <!-- Formatting this example as output hides the <file> text. -->

   <code-example language="none" hideCopy>

   On branch working-branch
   Your branch is up to date with 'origin/working-branch
   Changes not staged for commit:
     (use "git add &lt;file&gt;..." to update what will be committed)
     (use "git restore &lt;file&gt;..." to discard changes in working directory)
           modified:   content/guide/doc-build-test.md
           modified:   content/guide/doc-edit-finish.md
           modified:   content/guide/doc-editing.md
           modified:   content/guide/doc-pr-prep.md
           modified:   content/guide/doc-pr-update.md
           modified:   content/guide/doc-prepare-to-edit.md
           modified:   content/guide/doc-select-issue.md
           modified:   content/guide/doc-update-start.md

   no changes added to commit (use "git add" and/or "git commit -a")

   </code-example>

   1. Confirm that you in the correct working branch.

      确认你在正确的工作分支中。

      If you are not in the correct branch, replace `working-branch` with the name of your working branch and then run `git checkout working-branch` to select the correct branch.

      如果你不在正确的分支中，请将 `working-branch` 替换为你的工作分支的名称，然后运行 `git checkout working-branch` 以选择正确的分支。

   1. Review the  modified files in the list.
      Confirm that they are those that you have changed and saved, but not committed.
      The list of modified files varies, depending on what you have edited.

      查看列表中修改后的文件。确认它们是你已更改并保存但尚未提交的那些。已修改文件的列表因你编辑的内容而异。

1. Run this command to add a file that you want to commit.
   Replace `filename` with a filename from the `git status` output.

   运行此命令以添加要提交的文件。将 `filename` 替换为 `git status` 输出中的文件名。

   <code-example language="shell">

   git add filename

   </code-example>

   You can add multiple files in a single command by using wildcard characters in the filename parameter.
   You can also run this command to add all changed files that are being tracked by `git` to the commit by using `*` filename as this example shows.

   你可以通过在 filename 参数中使用通配符来在单个命令中添加多个文件。如此示例所示，你还可以运行此命令，以使用 `*` filename 将 `git` 跟踪的所有更改文件添加到提交中。

   <code-example language="shell">

   git add *

   </code-example>

   <div class="alert is-important">

   **IMPORTANT**: <br />
   Files that are not tracked by `git` are not committed or pushed to your repo on `github.com` and they do not appear in your pull request.

   </div>

1. Run `git status` again.

   再次运行 `git status` 。

   <code-example language="shell">

   git status

   </code-example>

1. Review the output and confirm the files that are ready to be committed.

   查看输出并确认已准备好提交的文件。

   <!-- Formatting this example as output hides the <file> text. -->

   <code-example language="none" hideCopy>

   On branch working-branch
   Your branch is up to date with 'origin/working-branch'.

   Changes to be committed:
     (use "git restore --staged &lt;file&gt;..." to unstage)
     modified:   content/guide/doc-build-test.md
     modified:   content/guide/doc-edit-finish.md
     modified:   content/guide/doc-editing.md
     modified:   content/guide/doc-pr-prep.md
     modified:   content/guide/doc-pr-update.md
     modified:   content/guide/doc-prepare-to-edit.md
     modified:   content/guide/doc-select-issue.md
     modified:   content/guide/doc-update-start.md

   </code-example>

1. Run this command to commit the changed files to your local computer.
   The commit message that follows the `-m` parameter must start with `docs:` followed by space, and your message.
   Replace `detailed commit message` with a message that describes the changes you made.

   运行此命令以将更改的文件提交到你的本地计算机。 `-m` 参数后面的提交消息必须以 `docs:` 开头，后跟空格和你的消息。将 `detailed commit message` 替换为描述你所做更改的消息。

   <code-example language="shell">

   git commit -m 'docs: detailed commit message'

   </code-example>

   For more information about Angular commit messages, see [Formatting commit messages for a pull request](guide/doc-pr-prep#format-commit-messages-for-a-pull-request).

   有关 Angular 提交消息的更多信息，请参阅[格式化 Pull Request 的提交消息](guide/doc-pr-prep#format-commit-messages-for-a-pull-request)。

Your changes to the documentation are now *committed, but not pushed*.

你对文档的更改现在已*提交，但没有 push* 。

### Push your commits to the cloud

### 将你的提交推送到云端

After you commit the changes to your local computer, this procedure pushes those commits to your `origin` repo in the cloud.

在你将更改提交到本地计算机后，此过程会将这些提交推送到你在云中的 `origin` 存储库。

#### To push your changes to your origin repo in the cloud

#### 将你的更改推送到云中的原始存储库

<!-- vale Angular.Google_WordListSuggestions = NO -->

Perform these steps from a command-line tool on your local computer or in the **terminal** pane of your IDE.

从本地计算机上的命令行工具或 IDE 的**终端**窗格中执行这些步骤。

<!-- vale Angular.Google_WordListSuggestions = YES -->

1. From your [workspace](guide/doc-prepare-to-edit#create-a-git-workspace-on-your-local-computer) directory, run this command to navigate to the `aio` directory in your [working directory](guide/doc-prepare-to-edit#doc-working-directory).
   Remember to replace `personal` with your GitHub username.

   从你的[工作区](guide/doc-prepare-to-edit#create-a-git-workspace-on-your-local-computer)目录，运行此命令以导航到[工作目录](guide/doc-prepare-to-edit#doc-working-directory)中的 `aio` 目录。请记住将 `personal` 替换为你的 GitHub 用户名。

   <code-example language="shell">

   cd personal/angular/aio

   </code-example>

1. Run this command to confirm that you are using the correct branch.

   运行此命令以确认你使用了正确的分支。

   <code-example language="shell">

   git status

   </code-example>

   If you aren't in the correct branch, replace `working-branch` with the name of your working branch and run `git checkout working-branch` to select the correct branch.

   如果你不在正确的分支中，请将 `working-branch` 替换为你的工作分支的名称，并运行 `git checkout working-branch` 以选择正确的分支。

   Git status also shows whether you have changes on your local computer that have not been pushed to the cloud.

   Git 状态还会显示你在本地计算机上是否有尚未推送到云端的更改。

   <code-example language="none" hideCopy>

   On branch working-branch
   Your branch is ahead of 'origin/working-branch' by 1 commit.
     (use "git push" to publish your local commits)

   </code-example>

   This example output says that there is one commit on the local computer that's not in the `working-branch` branch on the `origin` repo.
   The `origin` is the `personal/angular` repo in GitHub.
   The next command pushes that commit to the `origin` repo.

   此示例输出说，本地计算机上有一个提交不在 `origin` 存储库的 `working-branch` 分支中。 `origin` 是 GitHub 中的 `personal/angular` 存储库。下一个命令将该提交推送到 `origin` 存储库。

1. Run this command to push the commits on your local computer to your account on GitHub in the cloud.

   运行此命令，将本地计算机上的提交推送到你在云 GitHub 上的帐户。

   <code-example language="shell">

   git push

   </code-example>

   If this is the first time you've pushed commits from the branch, you can see a message such as this.

   如果这是你第一次从分支推送提交，你可以看到如下消息。

   <code-example language="none" hideCopy>

   fatal: The current branch working-branch has no upstream branch.
   To push the current branch and set the remote as upstream, use

       git push --set-upstream origin working-branch

   To have this happen automatically for branches without a tracking
   upstream, see 'push.autoSetupRemote' in 'git help config'.

   </code-example>

   If you get this message, copy the command that the message provides and run it as shown here:

   如果你收到此消息，请复制消息提供的命令并运行它，如下所示：

   <code-example language="shell">

   git push --set-upstream origin working-branch

   </code-example>

The changes that you made in the `working-branch` branch on your local computer have been saved on `github.com`.
Your changes to the documentation are now *committed and pushed*.

你在本地计算机上的 `working-branch` 分支中所做的更改已保存在 `github.com` 上。你对文档的更改现在已*提交并推送*。

## Test your documentation

## 测试你的文档

After you update the documentation to fix the issue that you picked, you are ready to test the documentation.
Testing documentation consists of:

更新文档以解决你选择的问题后，你就可以测试文档了。测试文档包括：

* **Documentation linting**

  **文档 linting**

  Each time you open and save a documentation topic, the documentation linter checks for common errors.
    For more information about documentation linting, see [Resolving documentation linter messages](guide/docs-lint-errors).

  每次你打开并保存文档主题时，文档 linter 都会检查常见的错误。有关文档 linting 的更多信息，请参阅[解析文档 linter 消息](guide/docs-lint-errors)。

* **Manual review**

  **手动审核**

  When your documentation update is complete, have another person review your changes.
    If you have updated technical content, have a subject matter expert on the topic review your update, as well.

  当你的文档更新完成后，请让另一个人查看你的更改。如果你更新了技术内容，请让该主题的主题专家查看你的更新。

* **Automated testing**

  **自动测试**

  The Angular documentation is tested automatically after you open a pull request.
    It must pass this testing before the pull request can be merged.
    For more information about automated documentation testing, see [Testing a documentation update](/guide/doc-build-test).

  在你打开 Pull Request 后，Angular 文档会自动测试。它必须通过此测试，然后才能合并 Pull Request。有关自动文档测试[的更多信息，请参阅测试文档更新](/guide/doc-build-test)。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-10-12
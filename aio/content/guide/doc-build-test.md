# Build and test a documentation update

# 构建和测试文档更新

<!-- markdownLint-disable MD001 -->

<!-- markdownLint-disable MD033 -->

After you have completed your documentation update, you want to run the documentation's end-to-end tests on your local computer. These tests are some of the tests that are run after you open a pull request. You can find end-to-end test failures faster when you run them on your local computer than after you open a pull request.

完成文档更新后，你希望在本地计算机上运行文档的端到端测试。这些测试是你打开 Pull Request 后运行的一些测试。当你在本地计算机上运行端到端测试失败时，可以比打开 Pull Request 后更快地发现它们。

## Build the documentation on your local computer

## 在本地计算机上构建文档

Before you test your updated documentation, you want to build it to make sure you test your latest changes.

在测试更新的文档之前，你要构建它以确保测试了最新的更改。

#### To build the documentation on your local computer

#### 在本地计算机上构建文档

<!-- vale Angular.Google_WordListSuggestions = NO -->

Perform these steps from a command-line tool on your local computer or in the **terminal** pane of your IDE.

从本地计算机上的命令行工具或 IDE 的**终端**窗格中执行这些步骤。

<!-- vale Angular.Google_WordListSuggestions = YES -->

1. Navigate to your [working directory](guide/doc-prepare-to-edit#doc-working-directory).

   导航到你的[工作目录](guide/doc-prepare-to-edit#doc-working-directory)。

2. From your working directory, run this command to navigate to the `aio` directory. The `aio` directory contains Angular's documentation files and tools.

   从你的工作目录，运行此命令以导航到 `aio` 目录。 `aio` 目录包含 Angular 的文档文件和工具。

   <code-example language="shell">

   cd aio

   </code-example>

3. Run this command to build the documentation locally.

   运行此命令以在本地构建文档。

   <code-example language="shell">

   yarn build

   </code-example>

   This builds the documentation from scratch.

   这会从头开始构建文档。

After you build the documentation on your local computer, you can run the angular.io end-to-end test.

在本地计算机上构建文档后，你可以运行 angular.io 端到端测试。

## Run the angular.io end-to-end test on your local computer

## 在本地计算机上运行 angular.io 端到端测试

This procedure runs most, but not all, of the tests that are run after you open a pull request.

此过程会运行你打开 Pull Request 后运行的大多数（但不是全部）测试。

#### To run the angular.io end-to-end test on your local computer

#### 在本地计算机上运行 angular.io 端到端测试

On your local computer, in a command line tool or the **Terminal** pane of your IDE:

在本地计算机上的命令行工具或 IDE 的“**终端**”窗格中：

1. Run this command from your [workspace](guide/doc-prepare-to-edit#create-a-git-workspace-on-your-local-computer) directory to navigate to your [working directory](guide/doc-prepare-to-edit#doc-working-directory).

   从你的[工作区](guide/doc-prepare-to-edit#create-a-git-workspace-on-your-local-computer)目录运行此命令以导航到你的[工作目录](guide/doc-prepare-to-edit#doc-working-directory)。

   <code-example format="shell" language="shell">

   cd personal/angular

   </code-example>

1. Replace `working-branch` with the name of your `working` branch and run this command to check out your `working` branch.

   将 `working-branch` 替换为你的 `working` 分支的名称，并运行此命令以签出你的 `working` 分支。

   <code-example format="shell" language="shell">

   git checkout working-branch

   </code-example>

1. Run this command to navigate to the documentation.

   运行此命令以导航到文档。

   <code-example format="shell" language="shell">

   cd aio

   </code-example>

1. Run this command to start the end-to-end tests.

   运行此命令以启动端到端测试。

   <code-example format="shell" language="shell">

   yarn e2e

   </code-example>

1. Watch for errors that the test might report.

   监视测试可能报告的错误。

## No errors reported

## 没有报告错误

If the end-to-end tests report no errors and your update has passed [all other reviews](guide/doc-editing#test-your-documentation) required,
your documentation update is ready for a pull request.

如果端到端测试没有报告错误，并且你的更新已通过[所有其他所需的审查](guide/doc-editing#test-your-documentation)，则你的文档更新已准备好接受 Pull Request。

After you open your pull request, GitHub tests the code in your pull request.
The tests that GitHub runs include the end-to-end tests that you just ran and other tests that only run in the GitHub repo.
Because of that, even though your update passed the end-to-end tests locally, your update could still report an error after you open a pull request.

打开 Pull Request 后，GitHub 会测试你的 Pull 请求中的代码。 GitHub 运行的测试包括你刚刚运行的端到端测试以及仅在 GitHub 存储库中运行的其他测试。因此，即使你的更新在本地通过了端到端测试，但你的更新在你打开 Pull Request 后仍然可能会报告错误。

## Errors reported

## 报告的错误

If the end-to-end tests report an error on your local computer, be sure to correct it before you open a pull request.
If the update fails the end-to-end test locally, it is likely to also fail the tests that run after you open a pull request.

如果端到端测试在你的本地计算机上报告错误，请确保在打开 Pull Request 之前更正它。如果更新在本地未能通过端到端测试，则很可能会导致你打开 Pull Request 后运行的测试失败。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-10-12
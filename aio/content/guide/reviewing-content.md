# Review documentation

# 查看文档

You can review the Angular documentation, even if you have never contributed to Angular before.
Reviewing the Angular documentation provides a valuable contribution to the community.

你可以查看 Angular 文档，即使你以前从未为 Angular 做出过贡献。查看 Angular 文档为社区提供了宝贵的贡献。

Finding and reporting issues in the documentation helps the community know that the content is up to date.
Even if you don't find any problems, seeing that a document has been reviewed recently, gives readers confidence in the content.

在文档中查找和报告问题可帮助社区知道内容是最新的。即使你没有发现任何问题，看到某个文档最近已被审阅，也会让读者对内容充满信心。

This topic describes how you can review and update the Angular documentation to help keep it up to date.

本主题介绍如何查看和更新 Angular 文档以帮助其保持最新。

<!-- markdownLint-disable MD001 -->

<!-- markdownLint-disable MD033 -->

#### To review a topic in angular.io

#### 在 angular.io 中查看主题

Perform these steps in a browser.

在浏览器中执行这些步骤。

1. [Find a topic to review](#find-topics-to-review) by:

   [查找要查看的主题](#find-topics-to-review)：

   1. Finding a topic with a **Last reviewed** date that is six months or more in the past.

      查找**上次查看**日期是过去六个月或更长时间的主题。

   1. Finding a topic that has no **Last reviewed** date.

      查找没有**上次审查**日期的主题。

   1. Finding a topic that you've read recently.

      查找你最近读过的主题。

1. Review the topic for errors or inaccuracies.

   查看主题中的错误或不准确之处。

1. Complete the review.

   完成审核。

   1. If the topic looks good:

      如果主题看起来不错：

      1. [Update or add the `@reviewed` entry](#update-the-last-reviewed-date) at the end of the topic's source code.

         在主题源代码的末尾[更新或添加 `@reviewed` 条目](#update-the-last-reviewed-date)。

      1. [Make a minor change to a documentation topic](/guide/contributors-guide-overview#to-make-a-minor-change-to-a-documentation-topic) to publish the new reviewed date.

         [对文档主题进行细微更改以](/guide/contributors-guide-overview#to-make-a-minor-change-to-a-documentation-topic)发布新的审核日期。

   1. If you find an error that you don't feel comfortable fixing:

      如果你发现一个你觉得修复起来不舒服的错误：

      1. [Open a docs issue in GitHub](https://github.com/angular/angular/issues/new?assignees=&labels=&template=3-docs-bug.yaml).

         [在 GitHub 中打开一个文档问题](https://github.com/angular/angular/issues/new?assignees=&labels=&template=3-docs-bug.yaml)。

      1. [Update or add the `@reviewed` entry](#update-the-last-reviewed-date) at the end of the topic's source code.

         在主题源代码的末尾[更新或添加 `@reviewed` 条目](#update-the-last-reviewed-date)。

      1. [Make a minor change to a documentation topic](/guide/contributors-guide-overview#to-make-a-minor-change-to-a-documentation-topic) to publish the new reviewed date.

         [对文档主题进行细微更改以](/guide/contributors-guide-overview#to-make-a-minor-change-to-a-documentation-topic)发布新的审核日期。

   1. If you find an error that needs only a minor change:

      如果你发现只需要细微更改的错误：

      1. [Update or add the `@reviewed` entry](#update-the-last-reviewed-date) at the end of the topic's source code.

         在主题源代码的末尾[更新或添加 `@reviewed` 条目](#update-the-last-reviewed-date)。

      1. [Make a minor change to a documentation topic](/guide/contributors-guide-overview#to-make-a-minor-change-to-a-documentation-topic) to fix the error and save the new reviewed date.

         [对文档主题进行细微更改以](/guide/contributors-guide-overview#to-make-a-minor-change-to-a-documentation-topic)修复错误并保存新的查看日期。

   1. If you find an error that needs major changes:

      如果你发现需要进行重大更改的错误：

      1. Address the error:

         解决错误：

         1. [Make a major change](guide/contributors-guide-overview#make-a-major-change), if you're comfortable, or

            如果你愿意，可以[进行重大更改](guide/contributors-guide-overview#make-a-major-change)，或者

         1. [Open a docs issue in GitHub](https://github.com/angular/angular/issues/new?assignees=&labels=&template=3-docs-bug.yaml).

            [在 GitHub 中打开一个文档问题](https://github.com/angular/angular/issues/new?assignees=&labels=&template=3-docs-bug.yaml)。

      1. Whether you fix the error or open a new issue, [update or add the `@reviewed` entry](#update-the-last-reviewed-date) at the end of the topic's source code.

         无论你是修复错误还是打开新问题，请在主题源代码的末尾[更新或添加 `@reviewed` 条目](#update-the-last-reviewed-date)。

      1. [Make a minor change to a documentation topic](/guide/contributors-guide-overview#to-make-a-minor-change-to-a-documentation-topic) to save the new reviewed date.

         [对文档主题进行细微更改以](/guide/contributors-guide-overview#to-make-a-minor-change-to-a-documentation-topic)保存新的查看日期。

## Find topics to review

## 查找要查看的主题

You can review any topic in the Angular documentation, but these are the topics that benefit most from your review.

你可以查看 Angular 文档中的任何主题，但这些是从你的查看中受益最大的主题。

### Topics that have not been reviewed in over six months

### 超过六个月未审核的主题

At the bottom of some topics, there's a date that shows when the topic was last reviewed.
If that date is over six months ago, the topic is ready for a review.

在某些主题的底部，有一个日期会显示此主题的最后一次审核时间。如果该日期是六个月前，则该主题已准备好供审核。

This is an example of a **Last reviewed** date from the bottom of a topic.
You can also see an example of this at the end of this topic.

这是主题底部的**上次查看**日期的示例。你还可以在本主题的结尾看到一个例子。

<div class="lightbox">

<img alt="Example of the last reviewed date entry showing the date the topic was reviewed as month, day, and year" src="generated/images/guide/contributors-guide/last-reviewed.png">

</div>

### Topics that have never been reviewed

### 从未审查过的主题

If a topic doesn't have a **Last reviewed** date at the bottom, it has never been reviewed.
You can review such a topic and add a new **Last reviewed** date after you review it.

如果一个主题的底部没有“**最后审查”**日期，则表明它从未被审查过。你可以查看这样的主题，并在查看之后添加新的**上次查看**日期。

### Topics that you know have a problem

### 你知道有问题的主题

If you know of a topic that has an error or inaccuracy, you can review it and make corrections during your review. If you don't feel comfortable fixing an error during your review, [open a docs issue in GitHub](https://github.com/angular/angular/issues/new?assignees=&labels=&template=3-docs-bug.yaml).
Be sure to add or update the **Last reviewed** date after you review the topic. Whether you fix the error or just open an issue, you still reviewed the topic.

如果你知道某个主题有错误或不准确，可以查看它并在查看期间进行更正。如果你在查看期间对修复错误感到不自在，请[在 GitHub 中打开一个文档问题](https://github.com/angular/angular/issues/new?assignees=&labels=&template=3-docs-bug.yaml)。查看主题后，请确保添加或更新**上次查看**的日期。无论你修复错误还是只是打开一个问题，你仍然查看了该主题。

## Update the last reviewed date

## 更新上次查看的日期

After you review a topic, whether you change it or not, update the topic's **Last reviewed** date.
The **Last reviewed** text at the bottom of the topic is created by the `@reviewed` tag followed by the date you reviewed the topic.

在你查看主题后，无论你是否更改它，请更新该主题的**上次查看**日期。主题底部的**上次查看**的文本是由 `@reviewed` 标签后跟你查看主题的日期创建的。

This is an example of an `@reviewed` tag at the end of the topic's source code as it appears in a code editor.

这是主题源代码末尾的 `@reviewed` 标签的示例，因为它出现在代码编辑器中。

<code-example>

@reviewed 2022-09-08

</code-example>

The date is formatted as `YYYY-MM-DD` where:

日期格式为 `YYYY-MM-DD` ，其中：

* `YYYY` is the current year

  `YYYY` 是当前年份

* `MM` is the two-digit number of the current month with a leading zero if the month is 01 (January) through 09 (September)

  `MM` 是当前月的两位数，如果月份是 01（一月）到 09（九月），则以前导零

* `DD` is the two-digit number of the current day of the month with a leading zero if the day is 01-09.

  `DD` 是当月当前天的两位数，如果当天是 01-09 ，则以零为前导。

For example:

比如：

| Review date | `@reviewed` tag | Resulting text displayed in the docs |
| :---------- | :-------------- | :----------------------------------- |
| 审核日期 | `@reviewed` 标签 | 文档中显示的结果文本 |
| January 12, 2023 | `@reviewed 2023-01-12` | *Last reviewed on Thu Jan 12, 2023* |
| 2023 年 1 月 12 日 | `@reviewed 2023-01-12` | *最后审核时间：2023 年 1 月 12 日星期四* |
| November 3, 2022 | `@reviewed 2022-11-03` | *Last reviewed on Fri Nov 03, 2022* |
| 2022 年 11 月 3 日 | `@reviewed 2022-11-03` | *最后点评日期：2022 年 11 月 3 日，星期五* |

## Reviewing and updating a topic

## 查看和更新主题

These are the actions you can take after you review a topic.

这些是你在查看主题后可以采取的操作。

### The topic is accurate and has no errors

### 主题准确，没有错误

If the topic is accurate and has no errors, [make a minor change](/guide/contributors-guide-overview#to-make-a-minor-change-to-a-documentation-topic) to [update the **Last reviewed** date](#update-the-last-reviewed-date) at the bottom of the page. You can use the GitHub user interface to edit the topic's source code.

如果主题是准确的并且没有错误，请[进行细微更改](/guide/contributors-guide-overview#to-make-a-minor-change-to-a-documentation-topic)以[更新页面底部的**上次查看**日期](#update-the-last-reviewed-date)。你可以用 GitHub 用户界面编辑主题的源代码。

### The topic requires minor changes

### 该主题需要较小的更改

If the topic has minor errors, you can fix them when you [make a minor change](/guide/contributors-guide-overview#to-make-a-minor-change-to-a-documentation-topic). Remember to [update the **Last reviewed** date](#update-the-last-reviewed-date) at the bottom of the page when you fix the error. For a minor change, you can use the GitHub user interface in a browser to edit the topic's source code.

如果主题有小错误，你可以在进行[小的更改](/guide/contributors-guide-overview#to-make-a-minor-change-to-a-documentation-topic)时修复它们。修复错误时，请记住[更新页面底部的**上次查看**日期](#update-the-last-reviewed-date)。对于较小的更改，你可以在浏览器中使用 GitHub 用户界面来编辑主题的源代码。

### The topic requires major changes

### 该主题需要重大更改

If the topic requires major changes, you can [make a major change](guide/contributors-guide-overview#make-a-major-change), or [open a docs issue in GitHub](https://github.com/angular/angular/issues/new?assignees=&labels=&template=3-docs-bug.yaml). You shouldn't make major changes in the GitHub user interface because it doesn't allow you to test them before you submit them.

如果主题需要重大更改，你可以[进行重大更改](guide/contributors-guide-overview#make-a-major-change)，或[在 GitHub 中打开一个文档问题](https://github.com/angular/angular/issues/new?assignees=&labels=&template=3-docs-bug.yaml)。你不应该在 GitHub 用户界面中进行重大更改，因为它不允许你在提交之前测试它们。

Whether you make the changes the topic needs or open a docs issue, you should still [update the **Last reviewed** date](#update-the-last-reviewed-date). You can use the GitHub user interface in the browse if you only want to update the **Last reviewed** date.

无论你是进行主题需要的更改还是打开文档问题，你仍然应该[更新**Last review** date](#update-the-last-reviewed-date) 。如果你只想更新**上次查看**的日期，可以在浏览中使用 GitHub 用户界面。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-10-12
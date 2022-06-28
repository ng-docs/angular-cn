# Reviewing Content

# 审查内容

Angular developers work best when they have access to accurate and complete documentation.
Keeping existing content up-to-date is an essential part of ensuring that all developers have a great documentation experience.

当 Angular 开发人员可以访问准确而完整的文档时，他们的工作效果最好。使现有内容保持最新是确保所有开发人员都有良好的文档体验的重要部分。

This topic describes how you can help keep Angular content up-to-date by reviewing content.

本主题介绍如何通过查看内容来帮助 Angular 内容保持最新。

## Before you begin

## 在你开始之前

You can review content even if you've never contributed to Angular before.
However, you may find it helpful to have the [Contributing to Angular](https://github.com/angular/angular/blob/main/CONTRIBUTING.md) guide available if you're filing your first pull request in the repository.

即使你以前从未为 Angular 做出过贡献，你也可以查看内容。但是，如果你在存储库中提交第一个 Pull Request，可能会发现[提供对 Angular 的贡献](https://github.com/angular/angular/blob/main/CONTRIBUTING.md)指南会很有帮助。

## Reviewing content (`@reviewed`)

## 审查内容 ( `@reviewed` )

All of the task-based guides, tutorials, and conceptual topics that you find on Angular.io support a `@reviewed` tag.
When present, this tag is followed by the date representing when a given topic was reviewed for accuracy and completeness.
On the published topic, this reviewed information appears at the bottom of the topic; for example, `Last reviewed on` followed by the day of the week, month, day, and year.

你在 Angular.io 上找到的所有基于任务的指南、教程和概念主题都支持 `@reviewed` 标签。当存在时，此标签后是表示给定主题的准确性和完整性审查的日期。在已发布的主题上，此经过审核的信息出现在主题的底部；例如，`Last reviewed on` 的时间是星期、月、日和年。

<div class="lightbox">

<img alt="Example of the last reviewed date specifying the day of the week, the month, the date, and the year on a page footer." src="generated/images/guide/contributors-guide/last-reviewed.png">

</div>

This reviewed date indicates when someone last reviewed the topic to ensure that its contents were accurate.

此审核日期表明有人最后一次审核此主题以确保其内容准确的时间。

You can review a topic using either the GitHub user interface or in an editor on your local machine.
You can also review any topic that you like.
 Previous experience in the subject of the topic is helpful, but not required.

你可以用 GitHub 用户界面或在本地机器上的编辑器中查看主题。你还可以查看你喜欢的任何主题。以前在该主题上的经验会很有帮助，但不是必需的。

**To review a topic:**

**要查看主题：**

1. Navigate to the topic that you want to review.

   导航到你要查看的主题。

1. Locate the last reviewed date at the bottom of the topic and verify that the topic meets the [review criteria](#review-criteria).

   在主题底部找到最后一次审阅的日期，并验证该主题是否符合[审阅标准](#review-criteria)。

   If the topic does not have a last reviewed date, you are welcome to add it to the topic.
   To add a date, use the `YYYY-MM-DD` date format.
   Example:
   `@reviewed 2021-03-23`

   如果该主题没有最后审查日期，欢迎你将其添加到该主题。要添加日期，请使用 `YYYY-MM-DD` 日期格式。示例：`@reviewed 2021-03-23`

1. Read through the topic.

   通读该主题。

1. If the topic requires an update, either [file an issue](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#submit-issue) that describes the update required, or [create a pull request](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#submit-pr) with the update.

   如果主题需要更新，请[提交描述所需更新的问题](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#submit-issue)，或[创建使用更新的 Pull Request](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#submit-pr)。

1. Update the `@reviewed` tag, either through the [GitHub user interface](guide/updating-content-github-ui) or through Angular's [standard pull request process](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#submit-pr).

   通过[GitHub 用户界面](guide/updating-content-github-ui)或通过 Angular 的[标准 Pull Request 过程](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#submit-pr)来更新 `@reviewed` 标签。

<a id="review-criteria"></a>

### Review criteria

### 审核标准

In general, topics should be reviewed either every six months, or around every major release.

一般来说，应该每六个月或在每个主要版本前后审查一次主题。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
# Updating search keywords

# 更新搜索关键字

In documentation, being able to find the content you need is equally as important as the content itself.
In [angular.io](https://angular.io), users can discover content in several ways, including:

在文档中，能够找到你需要的内容与内容本身一样重要。在[angular.io](https://angular.io)中，用户可以通过多种方式发现内容，包括：

* Organic search results, such as through [google.com](https://google.com)

  自然搜索结果，例如通过[google.com](https://google.com)

* The left navigation bar, also known as sidenav

  左侧导航栏，也称为 sidenav

* Using the search box in the header

  使用标题中的搜索框

You can help improve the documentation experience by adding search keywords to a given topic.
Updating search keywords can help bring users to the content they need faster.

你可以通过向给定主题添加搜索关键字来帮助改善文档体验。更新搜索关键字可以帮助用户更快地找到他们需要的内容。

## Before you begin

## 在你开始之前

You can update search keywords for a topic even if you've never contributed to Angular before.
However, you may find it helpful to have the [Contributing to Angular](https://github.com/angular/angular/blob/main/CONTRIBUTING.md) guide available if you're filing your first pull request in the repository.

即使你以前从未为 Angular 做出过贡献，也可以更新主题的搜索关键字。但是，如果你在存储库中提交第一个 Pull Request，可能会发现[提供对 Angular 的贡献](https://github.com/angular/angular/blob/main/CONTRIBUTING.md)指南会很有帮助。

## Updating search keywords

## 更新搜索关键字

To update search keywords:

要更新搜索关键字：

1. Navigate to the topic to which you want to update search keywords.

   导航到要更新搜索关键字的主题。

1. Decide what search keywords you'd like to add to the topic.
   For information on how to format keywords, see [Search keywords format](#format).

   确定你要添加到主题的搜索关键字。有关如何格式化关键字的信息，请参阅[搜索关键字格式](#format)。

1. Update the `@searchKeywords` tag, either through the [GitHub user interface](guide/updating-content-github-ui) or through Angular's [standard pull request process](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#submit-pr).

   通过[GitHub 用户界面](guide/updating-content-github-ui)或 Angular 的[标准 Pull Request 过程](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#submit-pr)更新 `@searchKeywords` 标签。

   If a topic does not have a `@searchKeywords` tag, you can add it to the end of the topic.

   如果某个主题没有 `@searchKeywords` 标签，你可以将其添加到主题的末尾。

<a id="format"></a>

## Search keywords format

## 搜索关键字格式

You add search keywords to a topic using the `@searchKeywords` tag.
This tag takes a set of single words, separated by spaces.
The tag and the keywords must be enclosed in curly bracket (`{` `}`) characters.
For example:

你可以使用 `@searchKeywords` 标签将搜索关键字添加到主题。此标记采用一组单个单词，以空格分隔。标签和关键字必须用大括号 ( `{` `}` ) 字符括起来。例如：

<code-example>

&lcub;&commat;searchKeywords route router routing navigation&rcub;

</code-example>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
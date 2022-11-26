# Update search keywords

# 更新搜索关键字

You can help readers find the topics in the Angular documentation by adding keywords to a topic.
Keywords help readers find topics by relating alternate terms and related concepts to a topic.

你可以通过向主题添加关键字来帮助读者在 Angular 文档中找到这些主题。关键字通过将替代术语和相关概念与主题相关联来帮助读者查找主题。

In [angular.io](https://angular.io), readers search for content by using:

在[angular.io](https://angular.io)中，读者可以用：

* External search, such as by using [google.com](https://google.com)

  外部搜索，例如使用[google.com](https://google.com)

* The search box at the top of each page

  每页顶部的搜索框

Each of these methods can be made more effective by adding relevant keywords to the topics.

通过向主题添加相关关键字，可以使这些方法中的每一种都更有效。

## To update search keywords in a topic

## 更新主题中的搜索关键字

Perform these steps in a browser.

在浏览器中执行这些步骤。

1. Navigate to the topic to which you want to add or update search keywords.

   导航到要添加或更新搜索关键字的主题。

1. Decide what search keywords you'd like to add to the topic.<br />Keywords should be words that relate to the topic and are not found in the topic headings.

   确定你要添加到主题的搜索关键字。<br />关键字应该是与主题相关并且在主题标题中找不到的单词。

1. Open the topic's **Edit file** page to [make a minor change](guide/contributors-guide-overview#to-make-a-minor-change-to-a-documentation-topic).

   打开主题的**编辑文件**页面[进行小的更改](guide/contributors-guide-overview#to-make-a-minor-change-to-a-documentation-topic)。

1. Add or update the `@searchKeywords` tag at the end of the topic with your keywords. The `@searchKeywords` tag takes a set of single-word keywords that are separated by spaces. The tag and the keywords must be enclosed in curly brackets. A sample tag is shown here to add these keywords to a page: *route*, *router*, *routing*, and *navigation*.

   使用你的关键字在主题末尾添加或更新 `@searchKeywords` 标签。 `@searchKeywords` 标签采用一组由空格分隔的单字关键字。标签和关键字必须用大括号括起来。此处显示了一个示例标签，以将这些关键字添加到页面： *route* 、 *router* 、 *routing*和*Navigation* 。

   <code-example>

   &lcub;&commat;searchKeywords route router routing navigation&rcub;

   </code-example>

1. [Update or add the `@reviewed` entry](guide/reviewing-content#update-the-last-reviewed-date) at the end of the topic's source code.

   在主题源代码的末尾[更新或添加 `@reviewed` 条目](guide/reviewing-content#update-the-last-reviewed-date)。

1. Propose your changes from as described in [make a minor change](guide/contributors-guide-overview#to-make-a-minor-change-to-a-documentation-topic).

   按照[进行次要更改中的描述提出你的更改](guide/contributors-guide-overview#to-make-a-minor-change-to-a-documentation-topic)。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-10-12
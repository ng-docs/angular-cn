Angular documentation style guide

Angular 文档风格指南

This style guide covers the standards for writing [Angular documentation on angular.io](docs).
These standards ensure consistency in writing style, Markdown conventions, and code snippets.

本风格指南涵盖了[在 angular.io 上编写 Angular 文档](docs)的标准。这些标准确保了写作风格、Markdown 约定和代码片段的一致性。

Prerequisites

前提条件

Before contributing to the Angular documentation, it is helpful if you are familiar with the following:

在为 Angular 文档做贡献之前，如果你熟悉以下内容，会很有帮助：

Google writing style

谷歌的写作风格

The [Google Developer Documentation Style Guide](https://developers.google.com/style) is a comprehensive resource that this Angular documentation style guide builds upon

[Google 开发者文档风格指南](https://developers.google.com/style)是本 Angular 文档风格指南所基于的综合资源

Angular coding style

Angular 编码风格

See the [Angular Style Guide](guide/styleguide "Angular Application Code Style Guide")

参阅[Angular 风格指南](guide/styleguide "Angular 应用程序代码风格指南")

Markdown

降价

See GitHub's [Mastering Markdown](https://guides.github.com/features/mastering-markdown)

参阅 GitHub 的[精通 Markdown](https://guides.github.com/features/mastering-markdown)

For an introduction, see GitHub's [Hello World](https://guides.github.com/activities/hello-world)

有关介绍，参阅 GitHub 的[Hello World](https://guides.github.com/activities/hello-world)

For an introduction, see GitHub's [Git Handbook](https://guides.github.com/introduction/git-handbook)

有关介绍，参阅 GitHub 的[Git 手册](https://guides.github.com/introduction/git-handbook)

Subjects

主题

Details

详细信息

Kinds of Angular documentation

Angular 文档的种类

The categories of Angular documentation include:

Angular 文档的类别包括：

[CLI documentation](cli)

[CLI 文档](cli)

The [angular.io](https://angular.io) infrastructure generates these documents from CLI source code.

[angular.io](https://angular.io)基础设施从 CLI 源代码生成这些文档。

[API documentation](api)

[API 文档](api)

Reference documents for the [Angular Application Programming Interface, or API](api). These are more succinct than guides and serve as a reference for Angular features. They are especially helpful for people already acquainted with Angular concepts. The [angular.io](https://angular.io) infrastructure generates these documents from source code and comments that contributors edit.

[Angular 应用程序编程接口或 API](api)的参考文档。这些比指南更简洁，可作为 Angular 特性的参考。它们对于已经熟悉 Angular 概念的人特别有帮助。[angular.io](https://angular.io)基础设施从源代码和贡献者编辑的注释生成这些文档。

[Guides](docs)

[指南](docs)

Much of what's in the [documentation section of angular.io](docs). Guides walk the reader step-by-step through tasks to demonstrate concepts and are often accompanied by a working example. These include [Getting Started](start), [Tour of Heroes](tutorial/tour-of-heroes), and pages about [Forms](guide/forms-overview), [Dependency Injection](guide/dependency-injection), and [HttpClient](guide/http). Contributing members of the community and Angular team members maintain this documentation in [Markdown](https://daringfireball.net/projects/markdown/syntax "Markdown").

[angular.io 文档部分中的大部分内容](docs)。指南会引导读者一步步完成任务以展示概念，并且通常伴随着一个工作示例。其中包括[入门](start)、[英雄之旅](tutorial/tour-of-heroes)以及有关[Forms](guide/forms-overview) 、[依赖注入](guide/dependency-injection)和[HttpClient](guide/http)的页面。社区的贡献成员和 Angular 团队成员在[Markdown](https://daringfireball.net/projects/markdown/syntax "降价")中维护本文档。

Angular documentation categories

Angular 文档类别

Markdown and HTML

Markdown 和 HTML

While the Angular guides are [Markdown](https://daringfireball.net/projects/markdown/syntax "Markdown") files, there are some sections within the guides that use HTML.

虽然 Angular 指南是[Markdown](https://daringfireball.net/projects/markdown/syntax "降价")文件，但指南中的某些部分使用了 HTML。

Notice the required blank line after the opening `<div>` in the following example:

请注意以下示例中打开 `<div>` 之后所需的空行：

It is customary but not required to precede the closing HTML tag with a blank line as well.

习惯上，但不要求在结束 HTML 标签之前有一个空行。

Title

标题

Every guide document must have a title, and it should appear at the top of the page.

每个指南文档都必须有一个标题，并且它应该出现在页面的顶部。

Begin the title with the Markdown hash \(`#`\) character, which renders as an `<h1>` in the browser.

标题以 Markdown 哈希（`#`）字符开头，在浏览器中渲染为 `<h1>`。

Always follow the title with at least one blank line

始终在标题后面至少有一个空行

The corresponding text in the left nav is in *Title Case*, which means that you use capital letters to start the first words and all principal words. Use lower case letters for secondary words such as "in", "of", and "the". You can also shorten the nav title to fit in the column.

左侧导航中的相应文本在*Title Case*中，这意味着你可以用大写字母来开头第一个单词和所有主要单词。对“in”、“of”和“the”等次要词使用小写字母。你还可以缩短导航标题以适合列。

A document can have only one `<h1>`

一个文档只能有一个 `<h1>`

Title text should be in *Sentence case*, which means the first word is capitalized and all other words are lower case. Technical terms that are always capitalized, like "Angular", are the exception. <code-example format="html" language="html"> &num; Deprecation policy in Angular </code-example>

标题文本应该是*Sentence case*，这意味着第一个单词是大写的，所有其他单词都是小写的。始终大写的技术术语，比如“Angular”，是个例外。<code-example format="html" language="html"># Angular 中的弃用策略</code-example>

Title guidance

标题指导

Sections

部分

A typical document has sections.

典型的文档有部分。

All section headings are in *Sentence case*, which means the first word is capitalized and all other words are lower case.

所有部分标题都用*Sentence case*，这意味着第一个单词是大写的，所有其他单词都是小写的。

**Always follow a section heading with at least one blank line.**

**始终遵循至少有一个空行的部分标题。**

Main section heading

主要部分标题

There are usually one or more main sections that may be further divided into secondary sections.

通常有一个或多个主要部分，可以进一步分为次要部分。

Begin a main section heading with the Markdown `##` characters, which renders as an `<h2>` in the browser.

以 Markdown `##` 字符开头的主要部分标题，在浏览器中渲染为 `<h2>`。

Follow main section headings with a blank line and then the content for that heading as in the following example:

在主要部分标题之后使用空行，然后是该标题的内容，如以下示例所示：

Secondary section heading

次要部分标题

A secondary section heading is related to a main heading and falls textually within the bounds of that main heading.

次要部分标题与主标题相关，在文本上属于该主标题的范围。

Begin a secondary heading with the Markdown `###` characters, which renders as an `<h3>` in the browser.

以 Markdown `###` 字符开头的辅助标题，在浏览器中渲染为 `<h3>`。

Follow a secondary heading by a blank line and then the content for that heading as in the following example:

在次标题后面加一个空行，然后是该标题的内容，如以下示例所示：

Additional section headings

其他节标题

While you can use additional section headings, the [Table-of-contents \(TOC\)](#table-of-contents) generator only shows `<h2>` and `<h3>` headings in the TOC on the right of the page.

虽然你可以用其他部分标题，但[目录（TOC）](#table-of-contents)生成器仅在页面右侧的 TOC 中显示 `<h2>` 和 `<h3>` 标题。

Table of contents

目录

Most pages display a table of contents or TOC.
The TOC appears in the right panel when the viewport is wide.
When narrow, the TOC appears in a collapsible region near the top of the page.

大多数页面会显示目录或 TOC。当视口很宽时，TOC 会出现在右侧面板中。缩小时，TOC 会出现在页面顶部附近的可折叠区域。

You don't need to create your own TOC by hand because the TOC generator creates one automatically from the page's  `<h2>` and `<h3>` headers.

你无需手动创建自己的 TOC，因为 TOC 生成器会自动从页面的 `<h2>` 和 `<h3>` 标头创建一个。

To exclude a heading from the TOC, create the heading as an `<h2>` or `<h3>` element with a class called 'no-toc'.

要从 TOC 中排除标题，请使用名为 'no-toc' 的类将标题创建为 `<h2>` 或 `<h3>` 元素。

You can turn off TOC generation for the entire page by writing the title with an `<h1>` tag and the `no-toc` class.

你可以通过使用 `<h1>` 标签和 `no-toc` 类编写标题来关闭整个页面的 TOC 生成。

Navigation

导航

To generate the navigation links at the top, left, and bottom of the screen, use the JSON configuration file, `content/navigation.json`.

要在屏幕的顶部、左侧和底部生成导航链接，请使用 JSON 配置文件 `content/navigation.json`。

For a new guide page, edit the `SideNav` node in `navigation.json`.
The `SideNav` node is an array of navigation nodes.
Each node is either an item node for a single document or a header node with child nodes.

对于新的指南页面，请编辑 `navigation.json` 中的 `SideNav` 节点。`SideNav` 节点是一个导航节点数组。每个节点要么是单个文档的条目节点，要么是带有子节点的标头节点。

Find the header for your page.
For example, a guide page that describes an Angular feature is probably a child of the `Fundamentals` header.

查找页面的标头。比如，描述 Angular 特性的指南页面可能是 `Fundamentals` 标头的子项。

A header node child can be an item node or another header node.
If your guide page belongs under a sub-header, find that sub-header in the JSON.

标头节点子项可以是 item 节点或另一个标头节点。如果你的指南页面属于子标题下，请在 JSON 中查找该子标题。

Add an item node for your guide page as a child of the appropriate header node as in the following example:

为你的指南页面添加一个 item 节点作为适当的标头节点的子项，如以下示例所示：

A navigation node has the following properties:

导航节点具有以下属性：

Defined and set `true` if this is a guide page that should not be displayed in the navigation panel.

如果这是不应该在导航面板中显示的指南页面，则已定义并设置为 `true`。

An array of child nodes, which is a header node only.

子节点数组，仅是标头节点。

Text that appears when the reader hovers over the navigation link.

当阅读器将鼠标悬停在导航链接上时出现的文本。

The text displayed in the side nav.

侧面导航中显示的文本。

The URL of the guide page, which is an item node only.

指南页面的 URL，仅是 item 节点。

Properties

属性

Code snippets

代码片段

[Angular.io](docs) has a custom framework that enables authors to include code snippets directly from working example applications that are automatically tested as part of documentation builds.

[Angular.io](docs)有一个自定义框架，使作者能够直接包含来自工作示例应用程序的代码片段，这些代码片段会作为文档构建的一部分自动测试。

In addition to working code snippets, example code can include terminal commands, a fragment of TypeScript or HTML, or an entire code file.

除了工作代码片段之外，示例代码还可以包括终端命令、TypeScript 或 HTML 的片段或整个代码文件。

Whatever the source, the document viewer renders them as code snippets, either individually with the [code-example](#code-example "code-example") component or as a tabbed collection with the [code-tabs](#code-tabs "code-tabs") component.

无论来源是什么，文档查看器都会将它们渲染为代码片段，可以单独使用[code-example](#code-example "代码示例")组件，也可以作为带有[code-tabs](#code-tabs "代码标签")组件的选项卡式集合。

The following is the HTML for creating a link to the image:

以下是用于创建图像链接的 HTML：

Image compression

图像压缩

For faster load times, always compress images.
Consider using an image compression web site such as [tinypng](https://tinypng.com/ "tinypng").

为了更快的加载时间，请始终压缩图像。考虑使用图像压缩网站，比如[tinypng](https://tinypng.com/ "tinypng")。

Floated images

浮动图像

You can float the image to the left or right of text by applying the `class="left"` or `class="right"` attributes respectively.
For example:

你可以通过分别应用 `class="left"` 或 `class="right"` 属性来将图像浮动到文本的左侧或右侧。比如：

The browser renders the following:

浏览器会渲染以下内容：

<img alt="flying Angular hero"
     class="left"
     src="generated/images/guide/docs-style-guide/flying-hero.png"
     width="200">



This text wraps around to the right of the floating "flying hero" image.

此文本会在浮动的“飞行英雄”图像的右侧环绕。

Headings and `<code-example>` components automatically clear a floated image.
To explicitly clear a floated image, add `<br class="clear">` where the text should break.

标题和 `<code-example>` 组件会自动清除浮动图像。要显式清除浮动图像，请在文本应该中断的位置添加 `<br class="clear">`。

<br class="clear">



Generally, you don't wrap a floated image in a `<figure>` element.

一般来说，你不会将浮动图像包装在 `<figure>` 元素中。

Floats within a subsection

在小节内浮动

If you have a floated image inside an alert, callout, or a subsection, apply the `clear-fix` class to the `<div>` to ensure that the image doesn't overflow its container.
For example:

如果你在警报、标注或小节中有浮动图像，请将 `clear-fix` 类应用于 `<div>`，以确保图像不会溢出其容器。比如：

Help with documentation style

文档风格的帮助

For specific language and grammar usage, a word list, style, tone, and formatting recommendations, see the [Google Developer Documentation Style Guide](https://developers.google.com/style).

有关特定语言和语法的用法、单词列表、风格、语气和格式建议，参阅[Google 开发者文档风格指南](https://developers.google.com/style)。

If you have any questions that this style guide doesn't answer or you would like to discuss documentation styles, see the [Angular repo](https://github.com/angular/angular) and [file a documentation issue](https://github.com/angular/angular/issues/new/choose).

如果你有任何本风格指南无法解答的问题，或者你想讨论文档风格，请访问[Angular](https://github.com/angular/angular)存储库并[提交文档问题](https://github.com/angular/angular/issues/new/choose)。
# Angular documentation style guide

# Angular 文档风格指南

This style guide covers the standards for writing [Angular documentation on angular.io](docs).
These standards ensure consistency in writing style, Markdown conventions, and code snippets.

本风格指南涵盖了[在 angular.io 上编写 Angular 文档](docs)的标准。这些标准确保了写作风格、Markdown 约定和代码片段的一致性。

## Prerequisites

## 前提条件

Before contributing to the Angular documentation, it is helpful if you are familiar with the following:

在为 Angular 文档做贡献之前，如果你熟悉以下内容，会很有帮助：

| Subjects | Details |
| :------- | :------ |
| 主题 | 详细信息 |
| `git` | For an introduction, see GitHub's [Git Handbook](https://guides.github.com/introduction/git-handbook) |
| `git` | 有关介绍，参阅 GitHub 的[Git 手册](https://guides.github.com/introduction/git-handbook) |
| GitHub | For an introduction, see GitHub's [Hello World](https://guides.github.com/activities/hello-world) |
| GitHub | 有关介绍，参阅 GitHub 的[Hello World](https://guides.github.com/activities/hello-world) |
| Markdown | See GitHub's [Mastering Markdown](https://guides.github.com/features/mastering-markdown) |
| 降价 | 参阅 GitHub 的[精通 Markdown](https://guides.github.com/features/mastering-markdown) |
| Angular coding style | See the [Angular Style Guide](guide/styleguide "Angular Application Code Style Guide") |
| Angular 编码风格 | 参阅[Angular 风格指南](guide/styleguide "Angular 应用程序代码风格指南") |
| Google writing style | The [Google Developer Documentation Style Guide](https://developers.google.com/style) is a comprehensive resource that this Angular documentation style guide builds upon |
| 谷歌的写作风格 | [Google 开发者文档风格指南](https://developers.google.com/style)是本 Angular 文档风格指南所基于的综合资源 |

## Kinds of Angular documentation

## Angular 文档的种类

The categories of Angular documentation include:

Angular 文档的类别包括：

| Angular documentation categories | Details |
| :------------------------------- | :------ |
| Angular 文档类别 | 详细信息 |
| [Guides](docs) | Much of what's in the [documentation section of angular.io](docs). Guides walk the reader step-by-step through tasks to demonstrate concepts and are often accompanied by a working example. These include [Getting Started](start), [Tour of Heroes](tutorial), and pages about [Forms](guide/forms-overview), [Dependency Injection](guide/dependency-injection), and [HttpClient](guide/http). Contributing members of the community and Angular team members maintain this documentation in [Markdown](https://daringfireball.net/projects/markdown/syntax "Markdown"). |
| [指南](docs) | [angular.io 文档部分中的大部分内容](docs)。指南会引导读者一步步完成任务以展示概念，并且通常伴随着一个工作示例。其中包括[入门](start)、[英雄之旅](tutorial)以及有关[Forms](guide/forms-overview) 、[依赖注入](guide/dependency-injection)和[HttpClient](guide/http)的页面。社区的贡献成员和 Angular 团队成员在[Markdown](https://daringfireball.net/projects/markdown/syntax "降价")中维护本文档。 |
| [API documentation](api) | Reference documents for the [Angular Application Programming Interface, or API](api). These are more succinct than guides and serve as a reference for Angular features. They are especially helpful for people already acquainted with Angular concepts. The [angular.io](https://angular.io) infrastructure generates these documents from source code and comments that contributors edit. |
| [API 文档](api) | [Angular 应用程序编程接口或 API](api)的参考文档。这些比指南更简洁，可作为 Angular 特性的参考。它们对于已经熟悉 Angular 概念的人特别有帮助。[angular.io](https://angular.io)基础设施从源代码和贡献者编辑的注释生成这些文档。 |
| [CLI documentation](cli) | The [angular.io](https://angular.io) infrastructure generates these documents from CLI source code. |
| [CLI 文档](cli) | [angular.io](https://angular.io)基础设施从 CLI 源代码生成这些文档。 |

## Markdown and HTML

## Markdown 和 HTML

While the Angular guides are [Markdown](https://daringfireball.net/projects/markdown/syntax "Markdown") files, there are some sections within the guides that use HTML.

虽然 Angular 指南是[Markdown](https://daringfireball.net/projects/markdown/syntax "降价")文件，但指南中的某些部分使用了 HTML。

<div class="alert is-helpful">

To enable HTML in an Angular guide, **always** follow every opening and closing HTML tag with a blank line.

要在 Angular 指南中启用 HTML，请**始终**在每个打开和关闭 HTML 标签之后使用空行。

</div>

Notice the required blank line after the opening `<div>` in the following example:

请注意以下示例中打开 `<div>` 之后所需的空行：

<code-example format="html" language="html">

&lt;div class="alert is-helpful"&gt;

&ast;&ast;Always&ast;&ast; follow every opening and closing HTML tag with &ast;a blank line&ast;.

&lt;/div&gt;

</code-example>

It is customary but not required to precede the closing HTML tag with a blank line as well.

习惯上，但不要求在结束 HTML 标签之前有一个空行。

## Title

## 标题

Every guide document must have a title, and it should appear at the top of the page.

每个指南文档都必须有一个标题，并且它应该出现在页面的顶部。

Begin the title with the Markdown hash (`#`) character, which renders as an `<h1>` in the browser.

标题以 Markdown 哈希 ( `#` ) 字符开头，在浏览器中渲染为 `<h1>`。

<code-example format="html" language="html">

&num; Angular documentation style guide

</code-example>

| Title guidance | Details |
| :------------- | :------ |
| 标题指导 | 详细信息 |
| A document can have only one `<h1>` | Title text should be in *Sentence case*, which means the first word is capitalized and all other words are lower case. Technical terms that are always capitalized, like "Angular", are the exception. <code-example format="html" language="html"> &num; Deprecation policy in Angular </code-example> |
| 一个文档只能有一个 `<h1>` | 标题文本应该是*Sentence case*，这意味着第一个单词是大写的，所有其他单词都是小写的。始终大写的技术术语，比如“Angular”，是个例外。<code-example format="html" language="html"># Angular 中的弃用策略</code-example> |
| Always follow the title with at least one blank line | The corresponding text in the left nav is in *Title Case*, which means that you use capital letters to start the first words and all principal words. Use lower case letters for secondary words such as "in", "of", and "the". You can also shorten the nav title to fit in the column. |
| 始终在标题后面至少有一个空行 | 左侧导航中的相应文本在*Title Case*中，这意味着你可以用大写字母来开头第一个单词和所有主要单词。对“in”、“of”和“the”等次要词使用小写字母。你还可以缩短导航标题以适合列。 |

## Sections

## 部分

A typical document has sections.

典型的文档有部分。

All section headings are in *Sentence case*, which means the first word is capitalized and all other words are lower case.

所有部分标题都用*Sentence case*，这意味着第一个单词是大写的，所有其他单词都是小写的。

**Always follow a section heading with at least one blank line.**

**始终遵循至少有一个空行的部分标题。**

### Main section heading

### 主要部分标题

There are usually one or more main sections that may be further divided into secondary sections.

通常有一个或多个主要部分，可以进一步分为次要部分。

Begin a main section heading with the Markdown `##` characters, which renders as an `<h2>` in the browser.

以 Markdown `##` 字符开头的主要部分标题，在浏览器中渲染为 `<h2>`。

Follow main section headings with a blank line and then the content for that heading as in the following example:

在主要部分标题之后使用空行，然后是该标题的内容，如以下示例所示：

<code-example format="html" language="html">

&num;&num; Main section heading

Content after a blank line.

</code-example>

### Secondary section heading

### 次要部分标题

A secondary section heading is related to a main heading and falls textually within the bounds of that main heading.

次要部分标题与主标题相关，在文本上属于该主标题的范围。

Begin a secondary heading with the Markdown `###` characters, which renders as an `<h3>` in the browser.

以 Markdown `###` 字符开头的辅助标题，在浏览器中渲染为 `<h3>`。

Follow a secondary heading by a blank line and then the content for that heading as in the following example:

在次标题后面加一个空行，然后是该标题的内容，如以下示例所示：

<code-example format="html" language="html">

&num;&num;&num; Secondary section heading

Content after a blank line.

</code-example>

### Additional section headings

### 其他节标题

While you can use additional section headings, the [Table-of-contents (TOC)](#table-of-contents) generator only shows `<h2>` and `<h3>` headings in the TOC on the right of the page.

虽然你可以用其他部分标题，但[目录 (TOC)](#table-of-contents)生成器仅在页面右侧的 TOC 中显示 `<h2>` 和 `<h3>` 标题。

<code-example format="html" language="html">

&num;&num;&num;&num; The TOC won't display this

Content after a blank line.

</code-example>

## Table of contents

## 目录

Most pages display a table of contents or TOC.
The TOC appears in the right panel when the viewport is wide.
When narrow, the TOC appears in a collapsible region near the top of the page.

大多数页面会显示目录或 TOC。当视口很宽时，TOC 会出现在右侧面板中。缩小时，TOC 会出现在页面顶部附近的可折叠区域。

You don't need to create your own TOC by hand because the TOC generator creates one automatically from the page's  `<h2>` and `<h3>` headers.

你无需手动创建自己的 TOC，因为 TOC 生成器会自动从页面的 `<h2>` 和 `<h3>` 标头创建一个。

To exclude a heading from the TOC, create the heading as an `<h2>` or `<h3>` element with a class called 'no-toc'.

要从 TOC 中排除标题，请使用名为 'no-toc' 的类将标题创建为 `<h2>` 或 `<h3>` 元素。

<code-example format="html" language="html">

&lt;h3 class="no-toc"&gt;

This heading is not displayed in the TOC

&lt;/h3&gt;

</code-example>

You can turn off TOC generation for the entire page by writing the title with an `<h1>` tag and the `no-toc` class.

你可以通过使用 `<h1>` 标签和 `no-toc` 类编写标题来关闭整个页面的 TOC 生成。

<code-example format="html" language="html">

&lt;h1 class="no-toc"&gt;

A guide without a TOC

&lt;/h1&gt;

</code-example>

## Navigation

## 导航

To generate the navigation links at the top, left, and bottom of the screen, use the JSON configuration file, `content/navigation.json`.

要在屏幕的顶部、左侧和底部生成导航链接，请使用 JSON 配置文件 `content/navigation.json`。

<div class="alert is-helpful">

If you have an idea that would result in navigation changes, [file an issue](https://github.com/angular/angular/issues/new/choose) first so that the Angular team and community can discuss the change.

如果你有一个会导致导航更改的想法，请首先[提交问题](https://github.com/angular/angular/issues/new/choose)，以便 Angular 团队和社区可以讨论此更改。

</div>

For a new guide page, edit the `SideNav` node in `navigation.json`.
The `SideNav` node is an array of navigation nodes.
Each node is either an item node for a single document or a header node with child nodes.

对于新的指南页面，请编辑 `navigation.json` 中的 `SideNav` 节点。`SideNav` 节点是一个导航节点数组。每个节点要么是单个文档的条目节点，要么是带有子节点的标头节点。

Find the header for your page.
For example, a guide page that describes an Angular feature is probably a child of the `Fundamentals` header.

查找页面的标头。比如，描述 Angular 特性的指南页面可能是 `Fundamentals` 标头的子项。

<code-example format="json" language="json">

{
  "title": "Fundamentals",
  "tooltip": "The fundamentals of Angular",
  "children": [ &hellip; ]
}

</code-example>

A header node child can be an item node or another header node.
If your guide page belongs under a sub-header, find that sub-header in the JSON.

标头节点子项可以是 item 节点或另一个标头节点。如果你的指南页面属于子标题下，请在 JSON 中查找该子标题。

Add an item node for your guide page as a child of the appropriate header node as in the following example:

为你的指南页面添加一个 item 节点作为适当的标头节点的子项，如以下示例所示：

<code-example format="json" language="json">

{
  "url": "guide/docs-style-guide",
  "title": "Doc authors style guide",
  "tooltip": "Style guide for documentation authors.",
},

</code-example>

A navigation node has the following properties:

导航节点具有以下属性：

| Properties | Details |
| :--------- | :------ |
| 属性 | 详细信息 |
| `url` | The URL of the guide page, which is an item node only. |
| `url` | 指南页面的 URL，仅是 item 节点。 |
| `title` | The text displayed in the side nav. |
| `title` | 侧面导航中显示的文本。 |
| `tooltip` | Text that appears when the reader hovers over the navigation link. |
| `tooltip` | 当阅读器将鼠标悬停在导航链接上时出现的文本。 |
| `children` | An array of child nodes, which is a header node only. |
| `children` | 子节点数组，仅是标头节点。 |
| `hidden` | Defined and set `true` if this is a guide page that should not be displayed in the navigation panel. |
| `hidden` | 如果这是不应该在导航面板中显示的指南页面，则已定义并设置为 `true`。 |

<div class="alert is-critical">

Do not create a node that is both a header and an item node by specifying the `url` property of a header node.

不要通过指定标头节点的 `url` 属性来创建同时作为标头和条目节点的节点。

</div>

## Code snippets

## 代码片段

[Angular.io](docs) has a custom framework that enables authors to include code snippets directly from working example applications that are automatically tested as part of documentation builds.

[Angular.io](docs)有一个自定义框架，使作者能够直接包含来自工作示例应用程序的代码片段，这些代码片段会作为文档构建的一部分自动测试。

In addition to working code snippets, example code can include terminal commands, a fragment of TypeScript or HTML, or an entire code file.

除了工作代码片段之外，示例代码还可以包括终端命令、TypeScript 或 HTML 的片段或整个代码文件。

Whatever the source, the document viewer renders them as code snippets, either individually with the [code-example](#code-example "code-example") component or as a tabbed collection with the [code-tabs](#code-tabs "code-tabs") component.

无论来源是什么，文档查看器都会将它们渲染为代码片段，可以单独使用[code-example](#code-example "代码示例")组件，也可以作为带有[code-tabs](#code-tabs "代码标签")组件的选项卡式集合。

<a id="code-example"></a>

### When to use code font

### 何时使用代码字体

You can display a minimal, inline code snippet with the Markdown backtick syntax.
Use a single backtick on either side of a term when referring to code or the name of a file in a sentence.
The following are some examples:

你可以用 Markdown 反引号语法显示最小的内联代码段。在句子中引用代码或文件名时，在术语的任一侧使用单个反引号。以下是一些例子：

* In the `app.component.ts`, add a `logger()` method.

  在 `app.component.ts` 中，添加 `logger()` 方法。

* The `name` property is `Sally`.

  `name` 属性是 `Sally`。

* Add the component class name to the `declarations` array.

  将组件类名添加到 `declarations` 数组。

The Markdown is as follows:

Markdown 如下：

<code-example format="markdown" language="markdown">

&ast;   In the `app.component.ts`, add a `logger()` method.
&ast;   The &lt;code class="no-auto-link"&gt;item&lt;/code&gt; property is `true`.
&ast;   Add the component class name to the `declarations` array.

</code-example>

### Auto-linking in code snippets

### 代码片段中的自动链接

In certain cases, when you apply backticks around a term, it may auto-link to the API documentation.
If you do not intend the term to be a link, use the following syntax:

在某些情况下，当你在某个术语周围应用反引号时，它可能会自动链接到 API 文档。如果你不打算将该术语作为链接，请使用以下语法：

<code-example format="html" language="html">

The &lt;code class="no-auto-link"&gt;item&lt;/code&gt; property is &grave;true&grave;.

</code-example>

### Hard-coded snippets

### 硬编码的片段

Ideally, you should source code snippets [from working sample code](#from-code-samples), though there are times when an inline snippet is necessary.

理想情况下，你应该[从工作示例代码](#from-code-samples)中获取代码片段，尽管有时需要内联代码段。

For terminal input and output, place the content between `<code-example>` tags and set the language attribute to `sh` as in this example:

对于终端输入和输出，将内容放在 `<code-example>` 标签之间，并将语言属性设置为 `sh`，如此示例所示：

<code-example format="shell" language="shell">

npm start

</code-example>

<code-example format="html" language="html">

&lt;code-example language="shell"&gt;

npm start

&lt;/code-example&gt;

</code-example>

Inline, hard-coded snippets like this one are not testable and, therefore, intrinsically unreliable.
This example belongs to the small set of pre-approved, inline snippets that includes user input in a command shell or the output of some process.

像这样的内联硬编码片段不可测试，因此本质上不可靠。此示例属于一小组预先批准的内联代码段，其中包括命令 shell 中的用户输入或某些进程的输出。

In all other cases, code snippets should be generated automatically from tested code samples.

在所有其他情况下，代码片段应该从经过测试的代码示例自动生成。

For hypothetical examples such as illustrations of configuration options in a JSON file, use the `<code-example>` tag with the `header` attribute to identify the context.

对于假设的示例，比如 JSON 文件中的配置选项插图，请使用带有 `header` 属性的 `<code-example>` 标签来标识上下文。

<a id="from-code-samples"></a>

### Compilable example apps

### 可编译的示例应用程序

One of the Angular documentation design goals is that guide page code snippets be examples of working code.

Angular 文档的设计目标之一是指南页面代码段是可工作代码的示例。

Authors meet this goal by displaying code snippets directly from working sample applications, written specifically for these guide pages.

作者通过直接显示来自工作示例应用程序的、专门为这些指南页面编写的代码片段来实现这一目标。

Find sample applications in sub-folders of the `content/examples` directory of the `angular/angular` repository.
An example folder name is often the same as the guide page it supports.

在 `angular/angular` 存储库的 `content/examples` 目录的子文件夹中查找示例应用程序。示例文件夹名称通常与其支持的指南页面相同。

<div class="alert is-helpful">

A guide page might not have its own sample code.
It might refer instead to a sample belonging to another page.

指南页面可能没有自己的示例代码。相反，它可能会引用属于另一个页面的示例。

</div>

The Angular CI process runs all end-to-end tests for every Angular PR.
Angular re-tests the samples after every new version of a sample and every new version of Angular.

Angular CI 过程为每个 Angular PR 运行所有端到端测试。在每个新版本的示例和每个新版本的 Angular 之后，Angular 都会重新测试这些示例。

When possible, every snippet of code on a guide page should be derived from a code sample file.
You tell the Angular documentation engine which code file —or fragment of a code file— to display by configuring `<code-example>` attributes.

如果可能，指南页面上的每个代码片段都应该来自代码示例文件。你通过配置 `<code-example>` 属性来告诉 Angular 文档引擎要显示哪个代码文件（或代码文件的片段）。

<a id="display-whole-file"></a>

### Displaying an entire code file

### 显示整个代码文件

This Angular documentation style guide that you are currently reading has its own example application, located in the `content/examples/docs-style-guide` folder.

你当前正在阅读的本 Angular 文档风格指南有自己的示例应用程序，位于 `content/examples/docs-style-guide` 文件夹中。

The following `<code-example>` displays the sample's `app.module.ts`:

以下 `<code-example>` 显示示例的 `app.module.ts` ：

<code-example header="src/app/app.module.ts" path="docs-style-guide/src/app/app.module.ts"></code-example>

The following markup produces that snippet:

以下标注会生成该代码段：

<code-example format="html" language="html">

&lt;code-example path="docs-style-guide/src/app/app.module.ts" header="src/app/app.module.ts"&gt;&lt;/code-example&gt;

</code-example>

The `path` attribute identifies the snippet's source file at the example application folder's location within `content/examples`.
In this example, that path is  `docs-style-guide/src/app/app.module.ts`.

`path` 属性在 `content/examples` 中的示例应用程序文件夹位置标识代码段的源文件。在此示例中，该路径是 `docs-style-guide/src/app/app.module.ts`。

The header tells the reader where to find the file.
Following convention, set the `header` attribute to the file's location within the example application's root folder.

标头告诉读者在哪里可以找到文件。按照约定，将 `header` 属性设置为示例应用程序根文件夹中的文件位置。

Unless otherwise commented, all code snippets in this page are from sample source code located in the `content/examples/docs-style-guide` directory.

除非另有注释，否则本页面中的所有代码片段都来自位于 `content/examples/docs-style-guide` 目录中的示例源代码。

<div class="alert is-important">

The documentation tooling reports an error if the file identified in the path does not exist or is in the [`.git-ignore` file](https://github.com/angular/angular/blob/main/aio/content/examples/.gitignore).
Most `.js` files are in `.git-ignore`.

如果路径中标识的文件不存在或在[`.git-ignore` 文件](https://github.com/angular/angular/blob/main/aio/content/examples/.gitignore)中，文档工具会报告错误。大多数 `.js` 文件都在 `.git-ignore` 中。

To include an ignored code file in your project and display it in a guide, remove it from `.git-ignore`.
Update the `content/examples/.gitignore` as follows:

要在项目中包含被忽略的代码文件并在指南中显示它，请将其从 `.git-ignore` 中删除。更新 `content/examples/.gitignore`，如下所示：

<code-example header="content/examples/.gitignore">

&num; my-guide
!my-guide/src/something.js
!my-guide/more-javascript*.js

</code-example>

</div>

<a id="region"></a>

### Displaying part of a code file

### 显示代码文件的一部分

To include a snippet of code within a sample code file, rather than the entire file, use the `<code-example>` `region` attribute.
The following example focuses on the `AppModule` class and its `@NgModule()` metadata:

要在示例代码文件中包含代码片段，而不是整个文件，请使用 `<code-example>` `region` 属性。以下示例侧重于 `AppModule` 类及其 `@NgModule()` 元数据：

<code-example header="src/app/app.module.ts"
  path="docs-style-guide/src/app/app.module.ts"

  region="class"></code-example>

To render the above example, the HTML in the Markdown file is as follows:

要渲染上面的示例，Markdown 文件中的 HTML 如下：

<code-example format="html" language="html">

&lt;code-example
  path="docs-style-guide/src/app/app.module.ts"
  header="src/app/app.module.ts"
  region="class"&gt;&lt;/code-example&gt;

</code-example>

The `path` points to the file, just as in examples that render the [entire file](guide/docs-style-guide#display-whole-file).
The `region` attribute specifies a portion of the source file delineated by an opening `#docregion` and a closing `#enddocregion`.

`path` 指向文件，就像渲染[整个文件](guide/docs-style-guide#display-whole-file)的示例一样。`region` 属性指定源文件的一部分，由打开的 `#docregion` 和关闭的 `#enddocregion`。

You can see the `class` `#docregion` in the source file below.
Notice the commented lines `#docregion` and `#enddocregion` in `content/examples/docs-style-guide/src/app/app.module.ts` with the name `class`.

你可以在下面的源文件中看到 `#docregion` `class`。请注意 `content/examples/docs-style-guide/src/app/app.module.ts` 中名为 `class` 的注释行 `#docregion` 和 `#enddocregion`。

<code-example header="src/app/app.module.ts">

import { NgModule }      from '&commat;angular/core';
import { BrowserModule } from '&commat;angular/platform-browser';
import { FormsModule }   from '&commat;angular/forms';

import { AppComponent }  from './app.component';

// #docregion class
&commat;NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
// #enddocregion class

</code-example>

The opening and ending `#docregion` lines designate any lines of code between them as being included in the code snippet.
This is why the import statements outside of the `class` `#docregion` are not in the code snippet.

开头和结尾的 `#docregion` 它们之间的任何代码行指定为包含在代码段中。这就是为什么 `#docregion` `class` 之外的导入语句不在代码片段中的原因。

For more information on how to prepare example application files for use in guides, see [Source code markup](#source-code-markup).

有关如何准备在指南中使用的示例应用程序文件的更多信息，参阅[源代码标注](#source-code-markup)。

### Code snippet options

### 代码段选项

Specify the `<code-example>` output with the following attributes:

使用以下属性指定 `<code-example>` 输出：

| Attributes | Details |
| :--------- | :------ |
| 属性 | 详细信息 |
| `path` | The path to the file in the `content/examples` folder. |
| `path` | `content/examples` 文件夹中文件的路径。 |
| `header` | The header of the code listing. This is the title of the code snippet and can include the path and extra information such as whether the snippet is an excerpt. |
| `header` | 代码列表的标头。这是代码段的标题，可以包含路径和额外的信息，比如代码段是否是摘录。 |
| `region` | Displays the source file fragment with that region name; regions are identified by `#docregion` markup in the source file. See [Displaying a code snippet](#region "Displaying a code snippet"). |
| `region` | 显示具有该区域名称的源文件片段；区域由源文件中的 `#docregion` 标注标识。参阅[显示代码段](#region "显示代码段")。 |
| `linenums` | Value may be `true`, `false`, or a `number`. The default is `false`, which means that the browser displays no line numbers. The `number` option starts line numbering at the given value. For example, `linenums=4` sets the starting line number to 4. |
| `linenums` | 值可以是 `true` 、 `false` 或 `number`。默认值为 `false`，这意味着浏览器不显示行号。`number` 选项从给定值开始行号。比如，`linenums=4` 将起始行号设置为 4。 |
| `class` | Code snippets can be styled with the CSS classes `no-box` and `avoid`. |
| `class` | 代码片段可以用 CSS 类 `no-box` 和 `avoid` 来设置样式。 |
| `hideCopy` | Hides the copy button. |
| `hideCopy` | 隐藏复制按钮。 |
| `language` | The source code language such as `javascript`, `html`, `css`, `typescript`, `json`, or `shell`. This attribute only applies to hard-coded examples. |
| `language` | 源代码语言，比如 `javascript` 、 `html` 、 `css` 、 `typescript` 、 `json` 或 `shell`。此属性仅适用于硬编码示例。 |

### Displaying bad code

### 显示错误代码

Occasionally, you want to display an example of less than ideal code or design, such as with **avoid** examples in the [Angular Style Guide](guide/styleguide).
Because it is possible for readers to copy and paste examples of inferior code in their own applications, try to minimize use of such code.

有时，你希望显示一个不太理想的代码或设计的示例，比如**Angular**[风格指南](guide/styleguide)中的 exclude 示例。因为读者有可能在自己的应用程序中复制并粘贴劣质代码的示例，因此请尽量减少对此类代码的使用。

In cases where you need unacceptable examples, you can set the `class` to `avoid` or have the word `avoid` in the filename of the source file.
By putting the word `avoid` in the filename or path, the documentation generator automatically adds the `avoid` class to the `<code-example>`.
Either of these options frames the code snippet in bright red to grab the reader's attention.

在你需要不可接受的示例的情况下，你可以将 `class` 设置为 `avoid` 或在源文件的文件名中包含单词 `avoid`。通过将 `avoid` 一词放在文件名或路径中，文档生成器会自动将 `avoid` 类添加到 `<code-example>`。这些选项中的任何一个都以鲜红色框住代码片段，以吸引读者的注意力。

Here's the markup for an "avoid" example in the
[Angular Style Guide](guide/styleguide#style-05-03 "Style 05-03: components as elements") that uses the word `avoid` in the path name:

这是[Angular 风格指南](guide/styleguide#style-05-03 "风格 05-03：组件作为元素")中一个“ `avoid` ”示例的标注，该示例在路径名中使用了 Avoid 单词：

<code-example format="html" language="html">

&lt;code-example
  header="app/heroes/hero-button/hero-button.component.ts"
  path="styleguide/src/05-03/app/heroes/shared/hero-button/hero-button.component.avoid.ts"
  region="example"&gt;&lt;/code-example&gt;

</code-example>

Having the word "avoid" in the file name causes the browser to render the code snippet with a red header and border:

文件名中包含“avoid”一词会导致浏览器渲染带有红色标头和边框的代码片段：

<code-example header="app/heroes/hero-button/hero-button.component.ts" path="styleguide/src/05-03/app/heroes/shared/hero-button/hero-button.component.avoid.ts" region="example"></code-example>

Alternatively, the HTML could include the `avoid` class as in the following:

或者，HTML 可以包含 `avoid` 类，如下所示：

<code-example format="html" language="html">

&lt;code-example
   class="avoid"
   header="docs-style-guide/src/app/not-great.component.ts"
   path="docs-style-guide/src/app/not-great.component.ts"
  region="not-great"&gt;&lt;/code-example&gt;

</code-example>

Explicitly applying the class `avoid` causes the same result of a red header and red border:

显式应用类 `avoid` 会导致红色标题和红色边框的相同结果：

<code-example header="docs-style-guide/src/app/not-great.component.ts" path="docs-style-guide/src/app/not-great.component.ts" region="not-great" class="avoid"></code-example>

<a id="code-tabs"></a>

### Code Tabs

### 代码选项卡

Code tabs display code much like `code-examples` with the added advantage of displaying multiple code samples within a tabbed interface.
Each tab displays code using a `code-pane`.

代码选项卡显示代码的方式与 `code-examples` 非常相似，并且具有在选项卡式界面中显示多个代码示例的额外优势。每个选项卡都使用 `code-pane` 显示代码。

#### `code-tabs` attributes

#### `code-tabs` 属性

* `linenums`: The value can be `true`, `false`, or a number indicating the starting line number.
  The default is `false`.

  `linenums` ：值可以是 `true` 、 `false` 或表示起始行号的数字。默认值为 `false`。

#### `code-pane` attributes

#### `code-pane` 属性

| Attributes | Details |
| :--------- | :------ |
| 属性 | 详细信息 |
| `path` | A file in the `content/examples` folder |
| `path` | `content/examples` 文件夹中的文件 |
| `header` | What displays in the header of a tab |
| `header` | 选项卡标题中显示的内容 |
| `linenums` | Overrides the `linenums` property at the `code-tabs` level for this particular pane. The value can be `true`, `false`, or a number indicating the starting line number. The default is `false`. |
| `linenums` | 覆盖此特定窗格的 `code-tabs` 级别的 `linenums` 属性。该值可以是 `true` 、 `false` 或指示起始行号的数字。默认值为 `false`。 |

The following example displays multiple code tabs, each with its own header.
It demonstrates showing line numbers in `<code-tabs>` and `<code-pane>`.

以下示例显示多个代码选项卡，每个都有自己的标头。它演示了在 `<code-tabs>` 和 `<code-pane>` 中显示行号。

<code-tabs linenums="true">

  <code-pane
    header="app.component.html"
    path="docs-style-guide/src/app/app.component.html"></code-pane>
  <code-pane
    header="app.component.ts"
    path="docs-style-guide/src/app/app.component.ts"
    linenums="false"></code-pane>
  <code-pane
    header="app.component.css (heroes)"
    path="docs-style-guide/src/app/app.component.css"
    region="heroes"></code-pane>
    <code-pane header="hero-search/hero-search.component.html" path="toh-pt6/src/app/hero-search/hero-search.component.html"></code-pane>

</code-tabs>

The `linenums` attribute set to `true` on `<code-tabs>` explicitly enables numbering for all panes.
However, the `linenums` attribute set to `false` in the second `<code-pane>` disables line numbering only for itself.

`<code-tabs>` 上设置为 `true` 的 `linenums` 属性显式启用所有窗格的编号。但是，第二个 `<code-pane>` 中设置为 `false` 的 `linenums` 属性只会为自己禁用行号。

<code-example format="html" language="html">

&lt;code-tabs linenums="true"&gt;
  &lt;code-pane
    header="app.component.html"
    path="docs-style-guide/src/app/app.component.html"&gt;
  &lt;/code-pane&gt;
  &lt;code-pane
    header="app.component.ts"
    path="docs-style-guide/src/app/app.component.ts"
    linenums="false"&gt;
  &lt;/code-pane&gt;
  &lt;code-pane
    header="app.component.css (heroes)"
    path="docs-style-guide/src/app/app.component.css"
    region="heroes"&gt;
  &lt;/code-pane&gt;
  &lt;code-pane
    header="package.json (scripts)"
    path="docs-style-guide/package.1.json"&gt;
  &lt;/code-pane&gt;
&lt;/code-tabs&gt;

</code-example>

<a id="source-code-markup"></a>

## Preparing source code for code snippets

## 为代码片段准备源代码

To display  `<code-example>` and `<code-tabs>` snippets, add code snippet markup to sample source code files.

要显示 `<code-example>` 和 `<code-tabs>` 代码段，请将代码段标记添加到示例源代码文件。

<div class="alert is-helpful">

The sample source code for this page, located in `content/examples/docs-style-guide`, contains examples of every code snippet markup described in this section.

本页面的示例源代码位于 `content/examples/docs-style-guide` 中，包含本节中描述的每个代码段标记的示例。

</div>

Code snippet markup is always in the form of a comment.
The default `#docregion` markup for a TypeScript or JavaScript file is as follows:

代码段标记始终采用注释的形式。TypeScript 或 JavaScript 文件的默认 `#docregion` 标记如下：

<code-example format="typescript" language="typescript">

// #docregion
&hellip; some TypeScript or JavaScript code &hellip;
// #enddocregion

</code-example>

<code-example format="html" language="html">

&lt;!-- #docregion --&gt;
&hellip; some HTML &hellip;
&lt;!-- #enddocregion --&gt;

</code-example>

<code-example format="css" language="css">

/* #docregion */
&hellip; some CSS &hellip;
/* #enddocregion */

</code-example>

The documentation generation process erases these comments before displaying them in the documentation viewer, StackBlitz, and sample code downloads.

文档生成过程会先删除这些注释，然后在文档查看器 StackBlitz 和示例代码下载中显示它们。

<div class="alert is-important">

Because JSON does not allow comments, code snippet markup doesn't work in JSON files.
See the section on [JSON files](#json-files) for more information.

由于 JSON 不允许注释，因此代码段标记在 JSON 文件中不起作用。有关更多信息，参阅有关[JSON 文件](#json-files)的部分。

</div>

### `#docregion`

Use `#docregion` in source files to mark code for use in `<code-example>` or `<code-tabs>` components.

在源文件中使用 `#docregion` 来标记要在 `<code-example>` 或 `<code-tabs>` 组件中使用的代码。

The `#docregion` comment begins a code snippet region.
Every line of code after that comment belongs in the region until the code fragment processor encounters the end of the file or a closing `#enddocregion`.

`#docregion` 注释开始一个代码片段区域。该注释之后的每一行代码都属于该区域，直到代码片段处理器遇到文件结尾或关闭 `#enddocregion`。

The following `src/main.ts` is a an example of a file with a single `#docregion` at the top of the file.

以下 `src/main.ts` 是文件顶部带有单个 `#docregion` 的文件示例。

<code-example header="src/main.ts" path="docs-style-guide/src/main.ts"></code-example>

As a result, the entire file is in the `<code-example>`.

因此，整个文件都在 `<code-example>` 中。

### Naming a `#docregion`

### 命名 `#docregion`

To display multiple snippets from different fragments within the same file, give each fragment its own `#docregion` name as follows, where `your-region-name` is a hyphenated lowercase string:

要显示同一个文件中来自不同片段的多个片段，请为每个片段指定其自己的 `#docregion` 名称，如下所示，其中 `your-region-name` 是一个带有连字符的小写字符串：

<code-example format="typescript" language="typescript">

// #docregion your-region-name
&hellip; some code &hellip;
// #enddocregion your-region-name

</code-example>

Reference this region by name in the `region` attribute of the `<code-example>` or `<code-pane>` as follows:

在 `<code-example>` 或 `<code-pane>` 的 `region` 属性中按名称引用此区域，如下所示：

<code-example format="html" language="html">

&lt;code-example
  path="your-example-app/src/app/your-file.ts"
  region="your-region-name"&gt;&lt;/code-example&gt;

</code-example>

Because the `#docregion` with no name is the default region, you do not need to set the `region` attribute when referring to the default `#docregion`.

因为没有名称的 `#docregion` 是默认区域，所以你在引用默认 `#docregion` 时无需设置 `region` 属性。

### Nesting a `#docregion`

### 嵌套 `#docregion`

Place a `#docregion` within another `#docregion` as in the following example with a nested `inner-region`:

将 `#docregion` 放在另一个 `#docregion` 中，如以下示例所示，具有嵌套的 `inner-region` ：

<code-example format="typescript" language="typescript">

// #docregion
&hellip; some code &hellip;
// #docregion inner-region
&hellip; more code &hellip;
// #enddocregion inner-region
&hellip; yet more code &hellip;
/// #enddocregion

</code-example>

### Combining code fragments

### 组合代码片段

Combine several fragments from the same file into a single code snippet by defining multiple `#docregion` sections with the same region name.
The following example defines two nested `#docregion` sections.

通过定义具有相同区域名称的多个 `#docregion` 部分，将同一个文件中的多个片段合并到一个代码段中。以下示例定义了两个嵌套的 `#docregion` 部分。

The inner region, `class-skeleton`, appears twice —once to capture the code that opens the class definition and a second time to capture the code that closes the class definition.

内部区域 `class-skeleton` 出现两次——一次是为了捕获打开类定义的代码，第二次是为了捕获关闭类定义的代码。

<code-example format="typescript" header="src/app/app.component.ts" language="typescript">

// #docplaster
&hellip;
// #docregion class, class-skeleton
export class AppComponent {
// #enddocregion class-skeleton
  title = 'Authors Style Guide Sample';
  heroes = HEROES;
  selectedHero: Hero;

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }
// #docregion class-skeleton
}
// #enddocregion class, class-skeleton

</code-example>

The `#docplaster` marker tells the processor what text string to use —that is, the "plaster"— to join each of the fragments into a single snippet.
Place the "plaster" text on the same line.
For example, `#docplaster ---` would use `---` as the "plaster" text.
In the case of the previous file, the "plaster" text is empty so there will be nothing in between each fragment.

`#docplaster` 标记告诉处理器要使用什么文本字符串（即“plaster”）将每个片段连接为单个片段。将“石膏”文本放在同一行。比如，`#docplaster ---` 将使用 `---` 作为“plaster”文本。对于前一个文件，“plaster”文本是空的，因此每个片段之间将没有任何内容。

Without `#docplaster`, the processor inserts the default plaster —an ellipsis comment— between the fragments.

如果没有 `#docplaster`，处理器会在片段之间插入默认的 plaster（省略号注释）。

Here are the two corresponding code snippets for side-by-side comparison.

这是两个对应的代码片段，用于并排比较。

<code-tabs>
    <code-pane header="app.component.ts (class #docregion)" path="docs-style-guide/src/app/app.component.ts" region="class"></code-pane>
    <code-pane header="app.component.ts (class-skeleton #docregion)" path="docs-style-guide/src/app/app.component.ts" region="class-skeleton"></code-pane>
</code-tabs>

The above example also demonstrates that one `#docregion` or `#enddocregion` comment can specify two region names, which is a convenient way to start or stop multiple regions on the same code line.
Alternatively, you could put these comments on separate lines as in the following example:

上面的示例还演示了一个 `#docregion` 或 `#enddocregion` 注释可以指定两个区域名称，这是一种在同一代码行上启动或停止多个区域的便捷方式。或者，你可以将这些注释放在单独的行中，如下例所示：

<code-example header="src/app/app.component.ts">

// #docplaster
&hellip;
// #docregion class
// #docregion class-skeleton
export class AppComponent {
// #enddocregion class-skeleton
  title = 'Authors Style Guide Sample';
  heroes = HEROES;
  selectedHero: Hero;

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }
// #docregion class-skeleton
}
// #enddocregion class
// #enddocregion class-skeleton

</code-example>

### JSON files

### JSON 文件

The `<code-example>` component cannot display portions of a JSON file because JSON forbids comments.
However, you can display an entire JSON file by referencing it in the `<code-example>` `src` attribute.

`<code-example>` 组件无法显示 JSON 文件的某些部分，因为 JSON 禁止注释。但是，你可以通过在 `<code-example>` `src` 属性中引用整个 JSON 文件来显示它。

For large JSON files, you could copy the nodes-of-interest into Markdown backticks, but as it's easy to mistakenly create invalid JSON that way, consider creating a JSON partial file with the fragment you want to display.

对于大型 JSON 文件，你可以将感兴趣的节点复制到 Markdown 反引号中，但由于这种方式很容易错误地创建无效的 JSON，请考虑使用要显示的片段创建 JSON 部分文件。

You can't test a partial file nor use it in the application, but at least your editor can confirm that it is syntactically correct.
You can also store the partial file next to the original, so it is more likely that the author will remember to keep the two in sync.

你不能测试部分文件，也不能在应用程序中使用它，但至少你的编辑器可以确认它在语法上是正确的。你还可以将部分文件存储在原始文件旁边，因此作者更有可能记住使两者保持同步。

Here's an example that excerpts certain scripts from `package.json` into a partial file named `package.1.json`.

这是一个示例，它将 package.json 中的某些脚本摘录到名为 `package.json` 的部分文件中 `package.1.json`

<code-example header="package.json (selected scripts)" path="docs-style-guide/package.1.json"></code-example>

<code-example format="html" language="html">

&lt;code-example header="package.json (selected scripts)" path="docs-style-guide/package.1.json"&gt;&lt;/code-example&gt;

</code-example>

In some cases, it is preferable to use the name of the full file rather than the partial.
In this case, the full file is `package.json` and the partial file is `package.1.json`.
Since the focus is generally on the full file rather than the partial, using the name of the file the reader edits, in this example `package.json`, clarifies which file to work in.

在某些情况下，最好使用完整文件名，而不是部分文件名。在这种情况下，完整文件是 `package.json`，部分文件是 `package.1.json`。由于重点通常在完整文件上，而不是部分文件上，因此使用阅读器编辑的文件名，在此示例中是 `package.json`，可以阐明要在哪个文件中工作。

### Partial file naming

### 部分文件命名

The step-by-step nature of the guides necessitate refactoring, which means there are code snippets that evolve through a guide.

指南的分步性质需要重构，这意味着有些代码片段是通过指南演变的。

Use partial files to demonstrate intermediate versions of the final source code with fragments of code that don't appear in the final app.
The sample naming convention adds a number before the file extension, as follows:

使用部分文件来演示最终源代码的中间版本以及不会出现在最终应用程序中的代码片段。示例命名约定在文件扩展名之前添加一个数字，如下所示：

<code-example format="html" language="html">

package.1.json
app.component.1.ts
app.component.2.ts

</code-example>

Remember to exclude these files from StackBlitz by listing them in the `stackblitz.json` as illustrated here:

请记住通过在 `stackblitz.json` 中列出这些文件来从 StackBlitz 中排除它们，如下所示：

<code-example header="stackblitz.json" path="docs-style-guide/stackblitz.json"></code-example>

### Source code styling

### 源代码样式

Source code should follow [Angular's style guide](guide/styleguide) where possible.

源代码应尽可能遵循[Angular 的风格指南](guide/styleguide)。

#### Hexadecimals

#### 十六进制

Hexadecimal should use the shorthand where possible, and use only lowercase letters.

十六进制应尽可能使用速记，并且仅使用小写字母。

<a id="live-examples"></a>

## Live examples

## 实时示例

Adding `<live-example></live-example>` to a page generates two default links:
<live-example></live-example>.

将 `<live-example></live-example>` 添加到页面会生成两个默认链接：<live-example></live-example>.

The first is a link to the StackBlitz example, which the default `stackblitz.json` file defines.
You can find the `stackblitz.json` file in the `content/examples/example-app` directory, where `example-app` is the sample application folder you're using for the guide.

第一个是指向 StackBlitz 示例的链接，这是默认的 `stackblitz.json` 文件定义的。你可以在 `content/examples/example-app` 目录中找到 `stackblitz.json` 文件，其中 `example-app` 是你用于本指南的示例应用程序文件夹。

By default, the documentation generator uses the name of the guide as the name of the example.
So, if you're working on `router.md`, and use `<live-example></live-example>` in the document, the documentation generator looks for `content/examples/router`.
Clicking this link opens the code sample on StackBlitz in a new browser tab.

默认情况下，文档生成器使用指南名称作为示例名称。因此，如果你正在使用 `router.md`，并在文档中使用 `<live-example></live-example>`，文档生成器会查找 `content/examples/router`。单击此链接会在新的浏览器选项卡中打开 StackBlitz 上的代码示例。

The second link downloads the sample app.

第二个链接下载示例应用程序。

Define live examples by one or more `stackblitz.json` files in the root of a code sample folder.
Each sample folder usually has a single unnamed definition file, the default `stackblitz.json`.

通过代码示例文件夹根目录中的一个或多个 `stackblitz.json` 文件定义实时示例。每个示例文件夹通常都有一个未命名的定义文件，默认 `stackblitz.json`。

### Live Example for named StackBlitz

### 名为 StackBlitz 的实时示例

You can create additional, named definition files in the form `name.stackblitz.json`.
The [Testing](guide/testing) guide (`aio/content/guide/testing.md`) references a named StackBlitz file as follows:

你可以以 `name.stackblitz.json` 的形式创建其他命名定义文件。[测试](guide/testing)指南 ( `aio/content/guide/testing.md` ) 引用了一个名为 StackBlitz 的文件，如下所示：

<code-example format="html" language="html">

&lt;live-example stackblitz="specs"&gt;Tests&lt;/live-example&gt;

</code-example>

The `stackblitz` attribute value of `specs` refers to the `examples/testing/specs.stackblitz.json` file.
If you were to leave out the `stackblitz` attribute, the default would be `examples/testing/stackblitz.json`.

`specs` 的 `stackblitz` 属性值是指 `examples/testing/specs.stackblitz.json` 文件。如果你要 `stackblitz` 属性，则默认 `examples/testing/stackblitz.json`。

### Custom label and tooltip

### 自定义标签和工具提示

Change the appearance and behavior of the live example with attributes and classes.
The following example gives the live example anchor a custom label and tooltip by setting the `title` attribute:

使用属性和类更改实时示例的外观和行为。以下示例通过设置 `title` 属性，为实时示例锚点提供自定义标签和工具提示：

<code-example format="html" language="html">

&lt;live-example title="Live Example with title"&gt;&lt;/live-example&gt;

</code-example>

The browser renders the following:

浏览器会渲染以下内容：

<live-example title="Live Example with title"></live-example>

<live-example title="带有标题的实时示例"></live-example>

You can achieve the same effect by putting the label between the `<live-example>` tags:

你可以通过将标签放在 `<live-example>` 标签之间来实现相同的效果：

<code-example format="html" language="html">

&lt;live-example&gt;Live example with content label&lt;/live-example&gt;

</code-example>

The browser renders the following:

浏览器会渲染以下内容：

<live-example>Live example with content label</live-example>

<live-example>带有内容标签的实时示例</live-example>

### Live example from another guide

### 来自另一个指南的实时示例

To link to an example in a folder where the name is not the same as the current guide page, set the `name` attribute to the name of that folder.

要链接到文件夹中名称与当前指南页面不同的示例，请将 `name` 属性设置为该文件夹的名称。

For example, to include the [Router](guide/router) guide example in this style guide, set the `name` attribute to `router`, that is, the name of the folder where that example resides.

比如，要在本风格指南中包含[Router](guide/router)指南示例，请将 `name` 属性设置为 `router`，即该示例所在的文件夹的名称。

<code-example format="html" language="html">

&lt;live-example name="router"&gt;Live example from the Router guide&lt;/live-example&gt;

</code-example>

<live-example name="router">Live example from the Router guide</live-example>

<live-example name="router">路由器指南中的实时示例</live-example>

### Live Example without download

### 无需下载的实时示例

To omit the download link, add the `noDownload` attribute.

要省略下载链接，请添加 `noDownload` 属性。

<code-example format="html" language="html">

&lt;live-example noDownload&gt;Just the StackBlitz&lt;/live-example&gt;

</code-example>

The browser renders the following:

浏览器会渲染以下内容：

<live-example noDownload>Just the StackBlitz</live-example>

<live-example nodownload="">只是 StackBlitz</live-example>

### Live Example with download-only

### 仅下载的实时示例

To omit the live StackBlitz link and only link to the download, add the `downloadOnly` attribute.

要省略实时 StackBlitz 链接并仅链接到下载，请添加 `downloadOnly` 属性。

<code-example format="html" language="html">

&lt;live-example downloadOnly&gt;Download only&lt;/live-example&gt;

</code-example>

The browser renders the following:

浏览器会渲染以下内容：

<live-example downloadOnly>Download only</live-example>

<live-example downloadonly="">仅下载</live-example>

### Embedded live example

### 嵌入式实时示例

By default, a live example link opens a StackBlitz example in a separate browser tab.
You can embed the StackBlitz example within the guide page by adding the `embedded` attribute.

默认情况下，实时示例链接会在单独的浏览器选项卡中打开 StackBlitz 示例。你可以通过添加 `embedded` 属性来将 StackBlitz 示例嵌入在指南页面中。

For performance reasons, StackBlitz does not start right away.
Instead, the `<live-example>` component renders an image.
Clicking the image starts the process of launching the embedded StackBlitz within an `<iframe>`.

出于性能原因，StackBlitz 不会立即启动。相反，`<live-example>` 组件会渲染图像。单击图像会开始在 `<iframe>` 中启动嵌入式 StackBlitz 的过程。

The following is an embedded `<live-example>` for this guide:

以下是本指南的嵌入式 `<live-example>` ：

<code-example format="html" language="html">

&lt;live-example embedded&gt;&lt;/live-example&gt;

</code-example>

The browser renders the following `<iframe>` and a `<p>` with a link to download the example:

浏览器会渲染以下 `<iframe>` 和带有下载示例的链接的 `<p>` ：

<live-example embedded></live-example>

<live-example embedded=""></live-example>

<a id="anchors"></a>

## Anchors

## 锚

Every section header is also an anchor point.
Another guide page could add a link to this "Anchors" section with the following:

每个节标题也是一个锚点。另一个指南页面可以添加到此“Anchors”部分的链接，其内容如下：

<code-example format="html" language="html">

&lt;div class="alert is-helpful"&gt;

See the &lsqb;"Anchors"&rsqb;(guide/docs-style-guide#anchors "Style Guide &mdash;Anchors") section for details.

&lt;/div&gt;

</code-example>

The browser renders the following:

浏览器会渲染以下内容：

<div class="alert is-helpful">

See the ["Anchors"](guide/docs-style-guide#anchors "Style Guide —Anchors") section for details.

有关详细信息，参阅[“锚”](guide/docs-style-guide#anchors "风格指南——锚")部分。

</div>

Notice that the above example includes a title of "Style Guide —Anchors".
Use titles on anchors to create tooltips and improve UX.

请注意，上面的示例包含一个标题“Style Guide —Anchors”。使用锚点上的标题来创建工具提示并改进 UX。

When navigating within a page, you can omit the page URL when specifying the link that [scrolls up](#anchors "Anchors") to the beginning of this section, as in the following:

在页面中导航时，你可以在指定[向上滚动](#anchors "锚")到本节开头的链接时省略页面 URL，如下所示：

<code-example format="html" language="html">

&hellip; the link that &lsqb;scrolls up&rsqb;(#anchors "Anchors") to &hellip;

</code-example>

<a id="section-anchors"></a>

### Section header anchors

### 节标题锚点

While the documentation generator automatically creates anchors for headers based on the header wording, titles can change, which can potentially break any links to that section.

虽然文档生成器会根据标头的措辞自动为标头创建锚点，但标题是可以更改的，这可能会中断到该部分的任何链接。

To mitigate link breakage, add a custom anchor explicitly, just above the heading or text to which it applies, using the special `<a id="name"></a>` syntax as follows:

为了减轻链接破损，请使用特殊的 `<a id="name"></a>` 语法在其适用的标题或文本的正上方显式添加自定义锚点：

<code-example  language="html">

<a id="section-anchors"></a>

&num;&num;&num;&num; Section header anchors

</code-example>

Then reference that anchor like this:

然后像这样引用该锚：

<code-example format="html" language="html">

This is a &lsqb;link to that custom anchor name&rsqb;(#section-anchors).

</code-example>

The browser renders the following:

浏览器会渲染以下内容：

This is a [link to that custom anchor name](#section-anchors).

这是[到该自定义锚点名称的链接](#section-anchors)。

When editing a file, don't remove any anchors.
If you change the document structure, you can move an existing anchor within that same document without breaking a link.
You can also add more anchors with more appropriate text.

编辑文件时，请不要删除任何锚点。如果更改了文档结构，则可以在不中断链接的情况下移动同一个文档中的现有锚点。你还可以添加使用更适当文本的更多锚点。

<div class="alert is-helpful">

As an alternative, you can use the HTML `<a>` tag.
When using the `<a>` element, set the `id` attribute —rather than the `name` attribute because the documentation generator does not convert the `name` to the proper link URL.
For example:

作为替代方案，你可以用 HTML `<a>` 标签。使用 `<a>` 元素时，请设置 `id` 属性——而不是 `name` 属性，因为文档生成器不会将 `name` 转换为正确的链接 URL。比如：

<code-example format="html" language="html">

&lt;a id="anchors"&gt;&lt;/a&gt;

&num;&num; Anchors

</code-example>

</div>

## Alerts and callouts

## 警报和标注

Alerts and callouts present warnings, extra detail, or references to related topics.

警报和标注会显示警告、额外的详细信息或对相关主题的引用。

An alert or callout should not contain anything essential to understanding the main content.
Instructions or tutorial steps should be in the main body of a guide rather than in a subsection.

警报或标注不应包含任何对于了解主要内容所必需的内容。操作指南或教程步骤应该在指南的主体而不是小节中。

### Alerts

### 警报

Alerts draw attention to short, important points.
For multi-line content, see [callouts](#callouts "callouts").

警报会引起人们对简短而重要的点的注意。对于多行内容，参阅[标注](#callouts "标注")。

<div class="alert is-helpful">

See the [live examples](guide/docs-style-guide#live-examples "Live examples") section for more information.

有关更多信息，参阅[实时示例](guide/docs-style-guide#live-examples "实时示例")部分。

</div>

<div class="alert is-helpful">

**NOTE**: <br />
At least one blank line must follow both the opening and closing `<div>` tags.
A blank line before the closing `</div>` is conventional but not required.

**注意**：<br />
开始和结束 `<div>` 标签后必须至少有一个空行。关闭 `</div>` 之前的空行是常规的，但不是必需的。

</div>

<code-example format="html" language="html">

&lt;div class="alert is-helpful"&gt;

See the &lsqb;live examples&rsqb;(guide/docs-style-guide#live-examples "Live examples") section for more information.

&lt;/div&gt;

</code-example>

There are three different levels for styling the alerts according to the importance of the content.

根据内容的重要性，可以将警报的样式分为三个不同的级别。

Use the following the `alert` class along with the appropriate `is-helpful`, `is-important`, or `is-critical` CSS class, as follows:

使用以下 `alert` 类以及适当 `is-helpful` 、 `is-important` 或 `is-critical` CSS 类，如下所示：

<code-example format="html" language="html">

&lt;div class="alert is-helpful"&gt;

A helpful, informational alert.

&lt;/div&gt;

</code-example>

<code-example format="html" language="html">

&lt;div class="alert is-important"&gt;

An important alert.

&lt;/div&gt;

</code-example>

<code-example format="html" language="html">

&lt;div class="alert is-critical"&gt;

A critical alert.

&lt;/div&gt;

</code-example>

The browser renders the following:

浏览器会渲染以下内容：

<div class="alert is-helpful">

A helpful, informational alert.

一个有用的信息警报。

</div>

<div class="alert is-important">

An important alert.

一个重要的警报。

</div>

<div class="alert is-critical">

A critical alert.

严重警报。

</div>

### Callouts

### 标注

Callouts, like alerts, highlight important points.
Use a callout when you need a header and multi-line content.

标注（比如警报）会突出显示要点。当你需要标头和多行内容时，使用标注。

If you have more than two paragraphs, consider creating a new page or making it part of the main content.

如果你有两个以上的段落，请考虑创建一个新页面或将其作为主要内容的一部分。

Callouts use the same styling levels as alerts.

标注使用与警报相同的样式级别。

Use the CSS class `callout` in conjunction with the appropriate `is-helpful`, `is-important`, or `is-critical` class.
The following example uses the `is-helpful` class:

将 CSS 类 `callout` 与适当 `is-helpful` 、 `is-important` 或 `is-critical` 类结合使用。以下示例使用 `is-helpful` 类：

<code-example format="html" language="html">

&lt;div class="callout is-helpful"&gt;

&lt;header&gt;A helpful or informational point&lt;/header&gt;

&ast;&ast;A helpful note&ast;&ast;.
Use a helpful callout for information requiring explanation.
Callouts are typically multi-line notes.
They can also contain code snippets.

&lt;/div&gt;

</code-example>

The browser renders the three styles as follows:

浏览器会渲染这三种样式，如下所示：

<div class="callout is-helpful">

<header>A helpful or informational point</header>

<header>有用的或信息性的点</header>

**A helpful note**.
Use a helpful callout for information requiring explanation.
Callouts are typically multi-line notes.
They can also contain code snippets.

**一个有用的说明**。对需要解释的信息使用有用的标注。标注通常是多行注释。它们还可以包含代码片段。

</div>

<div class="callout is-important">

<header>An important point</header>

<header>一个重要的点</header>

**An important note**.
Use an important callout for significant information requiring explanation.
Callouts are typically multi-line notes.
They can also contain code snippets.

**一个重要说明**。对需要解释的重要信息使用重要标注。标注通常是多行注释。它们还可以包含代码片段。

</div>

<div class="callout is-critical">

<header>A critical point</header>

<header>一个临界点</header>

**A critical note**.
Use a critical callout for compelling information requiring explanation.
Callouts are typically multi-line notes.
They can also contain code snippets.

**一个批判性的说明**。对需要解释的令人信服的信息使用关键标注。标注通常是多行注释。它们还可以包含代码片段。

</div>

When using callouts, consider the following points:

使用标注时，请考虑以下几点：

* The callout header text style is uppercase

  标注标题文本样式是大写

* The header does not render in the table of contents

  标头不会在目录中呈现

* You can write the callout body in Markdown

  你可以在 Markdown 中编写标注正文

* A blank line separates the `<header>` tag from the Markdown content

  空行将 `<header>` 标签与 Markdown 内容分开

* Avoid using an `<h2>`, `<h3>`, `<h4>`, `<h5>`, or `<h6>`, as the CSS for callouts styles the `<header>` element

  避免使用 `<h2>` 、 `<h3>` 、 `<h4>` 、 `<h5>` 或 `<h6>`，因为标注的 CSS 是 `<header>` 元素的样式

Use callouts sparingly to grab the user's attention.

谨慎使用标注来吸引用户的注意力。

## Trees

## 树木

Use trees to represent hierarchical data such as directory structure.

使用树来表示分层数据，比如目录结构。

<div class="filetree">
  <div class="file">
    sample-dir
  </div>
  <div class="children">
    <div class="file">
      src
    </div>
    <div class="children">
      <div class="file">
        app
      </div>
      <div class="children">
        <div class="file">
          app.component.ts
        </div>
        <div class="file">
          app.module.ts
        </div>
      </div>
      <div class="file">
        styles.css
      </div>
      <div class="file">
        tsconfig.json
      </div>
    </div>
    <div class="file">
      node_modules &hellip;
    </div>
    <div class="file">
      package.json
    </div>
  </div>
</div>

Here is the markup for this file tree.

这是此文件树的标记。

<code-example format="html" language="html">

&lt;div class="filetree"&gt;
    &lt;div class="file"&gt;
        sample-dir
    &lt;/div&gt;
    &lt;div class="children"&gt;
        &lt;div class="file"&gt;
          src
        &lt;/div&gt;
        &lt;div class="children"&gt;
            &lt;div class="file"&gt;
              app
            &lt;/div&gt;
            &lt;div class="children"&gt;
                &lt;div class="file"&gt;
                  app.component.ts
                &lt;/div&gt;
                &lt;div class="file"&gt;
                  app.module.ts
                &lt;/div&gt;
            &lt;/div&gt;
            &lt;div class="file"&gt;
              styles.css
            &lt;/div&gt;
            &lt;div class="file"&gt;
              tsconfig.json
            &lt;/div&gt;
        &lt;/div&gt;
        &lt;div class="file"&gt;
          node_modules &hellip;
        &lt;/div&gt;
        &lt;div class="file"&gt;
          package.json
        &lt;/div&gt;
    &lt;/div&gt;
&lt;/div&gt;

</code-example>

## Images

## 镜像

Store images in the `content/images/guide` directory in a folder with the **same name** as the guide page.
Because Angular documentation generation copies these images to `generated/images/guide/your-guide-directory`, set the image `src` attribute to the runtime location of `generated/images/guide/your-guide-directory`.

将图像存储在 `content/images/guide` 目录中与指南页面**同名**的文件夹中。因为 Angular 文档的生成会将这些镜像复制到 `generated/images/guide/your-guide-directory`，因此将镜像 `src` 属性设置为 Generated `generated/images/guide/your-guide-directory` 的运行时位置。

For example, images for this "Angular documentation style guide" are in the `content/images/guide/docs-style-guide` folder, but the `src` attribute specifies the `generated` location.

比如，本“Angular 文档风格指南”的图像在 `content/images/guide/docs-style-guide` 文件夹中，但 `src` 属性指定了 `generated` 的位置。

The following is the `src` attribute for the "flying hero" image belonging to this guide:

以下是属于本指南的“flying hero”图像的 `src` 属性：

<code-example format="html" language="html">

src="generated/images/guide/docs-style-guide/flying-hero.png"

</code-example>

<div class="callout is-important">

<header>Use the HTML <code>&lt;img></code> tag</header>

<header>使用 HTML<code>&lt;img></code>标签</header>

Specify images using the `<img>` tag.
**Do not use the Markdown image syntax, `![... ](... )`.**

使用 `<img>` 标签指定图像。**不要使用 Markdown 图像语法 `![... ](... )`。**

For accessibility, always set the `alt` attribute with a meaningful description of the image.

对于无障碍性，请始终使用对图像进行有意义的描述来设置 `alt` 属性。

Nest the `<img>` tag within a `<div class="lightbox">` tag, which styles the image according to the documentation standard.

将 `<img>` 标签嵌套在 `<div class="lightbox">` 标签中，该标签会根据文档标准来设置图像的样式。

<code-example format="html" language="html">

&lt;div class="lightbox"&gt;

&lt;img alt="flying hero" src="generated/images/guide/docs-style-guide/flying-hero.png"&gt;

&lt;/div&gt;

</code-example>

<div class="alert is-helpful">

**NOTE**: <br />
The HTML `<img>` element does not have a closing tag.

**注意**：<br />
HTML `<img>` 元素没有关闭标签。

</div>

The browser renders the following:

浏览器会渲染以下内容：

<div class="lightbox">

<img alt="flying hero" src="generated/images/guide/docs-style-guide/flying-hero.png">

</div>

</div>

### Image captions and figure captions

### 图片说明和图形说明

A caption appears underneath the image as a concise and comprehensive summary of the image.
Captions are optional unless you are using numbered figures, such as Figure 1, Figure 2, and so on.
If you are using numbered figures in a page, follow the guidelines in [Figure captions](https://developers.google.com/style/images#figure-captions) in the Google Developer Documentation Style Guide.

标题显示在图像下方，作为图像的简明而全面的摘要。除非你使用编号的图形，比如图 1、图 2 等，否则标题是可选的。如果你在页面中使用编号的图形，请按照 Google 开发者文档风格指南中的[图形标题](https://developers.google.com/style/images#figure-captions)中的指南进行操作。

### Image dimensions

### 图像尺寸

The doc generator reads the image dimensions from an image file and adds `width` and `height` attributes to the `<img>` tag automatically.

文档生成器从图像文件中读取图像尺寸，并自动将 `width` 和 `height` 属性添加到 `<img>` 标签。

To control the size of the image, supply your own `width` and `height` attributes.

要控制图像的大小，请提供你自己的 `width` 和 `height` 属性。

Here's the "flying hero" markup with a 200px width:

这是宽度为 200px 的“飞行英雄”标记：

<code-example format="html" language="html">

&lt;div class="lightbox"&gt;

&lt;img alt="flying Angular hero"
     src="generated/images/guide/docs-style-guide/flying-hero.png"
     width="200"&gt;

&lt;/div&gt;

</code-example>

The browser renders the following:

浏览器会渲染以下内容：

<div class="lightbox">

<img alt="flying Angular hero"
     src="generated/images/guide/docs-style-guide/flying-hero.png"
     width="200">

</div>

### Wide images

### 宽幅图像

To prevent images overflowing their viewports, **use image widths under 700px**.
To display a larger image, provide a link to the actual image that the user can click to see the full size image separately, as in this example of `source-map-explorer` output from the "Ahead-of-time Compilation" guide:

为防止图像溢出其视口，**请使用低于 700px 的图像宽度**。要显示更大的图像，请提供指向实际图像的链接，用户可以单击该链接以单独查看完整大小的图像，比如“Ahead-of-time Compilation”指南中的 `source-map-explorer` 输出的示例：

<a href="generated/images/guide/docs-style-guide/toh-pt6-bundle.png" title="Click to view larger image">

<div class="lightbox">

<img alt="toh-pt6-bundle" src="generated/images/guide/docs-style-guide/toh-pt6-bundle-700w.png" width="300px">

</div>

</a>

The following is the HTML for creating a link to the image:

以下是用于创建图像链接的 HTML：

<code-example format="html" language="html">

&lt;a href="generated/images/guide/docs-style-guide/toh-pt6-bundle.png" title="Click to view larger image"&gt;

&lt;div class="lightbox"&gt;

&lt;img alt="toh-pt6-bundle" src="generated/images/guide/docs-style-guide/toh-pt6-bundle-700w.png" width="300px"&gt;

&lt;/div&gt;

&lt;/a&gt;

</code-example>

### Image compression

### 图像压缩

For faster load times, always compress images.
Consider using an image compression web site such as [tinypng](https://tinypng.com/ "tinypng").

为了更快的加载时间，请始终压缩图像。考虑使用图像压缩网站，比如[tinypng](https://tinypng.com/ "tinypng")。

### Floated images

### 浮动图像

You can float the image to the left or right of text by applying the `class="left"` or `class="right"` attributes respectively.
For example:

你可以通过分别应用 `class="left"` 或 `class="right"` 属性来将图像浮动到文本的左侧或右侧。比如：

<code-example format="html" language="html">

&lt;img alt="flying Angular hero"
     class="left"
     src="generated/images/guide/docs-style-guide/flying-hero.png"
     width="200"&gt;

This text wraps around to the right of the floating "flying hero" image.

Headings and code-examples automatically clear a floated image.
If you need to force a piece of text to clear a floating image, add &grave;&lt;br class="clear"&gt;&grave; where the text should break.

&lt;br class="clear"&gt;

</code-example>

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

### Floats within a subsection

### 在小节内浮动

If you have a floated image inside an alert, callout, or a subsection, apply the `clear-fix` class to the `<div>` to ensure that the image doesn't overflow its container.
For example:

如果你在警报、标注或小节中有浮动图像，请将 `clear-fix` 类应用于 `<div>`，以确保图像不会溢出其容器。比如：

<code-example format="html" language="html">

&lt;div class="alert is-helpful clear-fix"&gt;

&lt;img alt="flying Angular hero"
     src="generated/images/guide/docs-style-guide/flying-hero.png"
     class="right"
     width="100"&gt;

A subsection with **Markdown** formatted text.

&lt;/div&gt;

</code-example>

The browser renders the following:

浏览器会渲染以下内容：

<div class="alert is-helpful clear-fix">

<img alt="flying Angular hero"
     class="right"
     src="generated/images/guide/docs-style-guide/flying-hero.png"
     width="100">

A subsection with **Markdown** formatted text.

带有**Markdown**格式文本的小节。

</div>

## Help with documentation style

## 文档风格的帮助

For specific language and grammar usage, a word list, style, tone, and formatting recommendations, see the [Google Developer Documentation Style Guide](https://developers.google.com/style).

有关特定语言和语法的用法、单词列表、风格、语气和格式建议，参阅[Google 开发者文档风格指南](https://developers.google.com/style)。

If you have any questions that this style guide doesn't answer or you would like to discuss documentation styles visit the [Angular repo](https://github.com/angular/angular) and [file a documentation issue](https://github.com/angular/angular/issues/new/choose).

如果你有任何本风格指南无法解答的问题，或者你想讨论文档风格，请访问[Angular](https://github.com/angular/angular)存储库并[提交文档问题](https://github.com/angular/angular/issues/new/choose)。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
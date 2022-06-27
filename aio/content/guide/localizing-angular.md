# Angular documentation localization guidelines

# Angular 文档本地化指南

One way to contribute to Angular's documentation is to localize it into another language.
This topic describes what you need to know to localize Angular and have it listed on our [Localized documentation](guide/localized-documentation) page.

为 Angular 文档做贡献的一种方法是将其本地化为另一种语言。本主题介绍了为了对 Angular 进行本地化并将其列在我们的[本地化文档](guide/localized-documentation)页面上，你需要了解的知识。

## Before you begin

## 在你开始之前

Before you start localizing the Angular documentation, first check to see if a localized version already exists.
See [Localized documentation](guide/localized-documentation) for a current list of localized versions of Angular documentation.

在开始本地化 Angular 文档之前，请首先检查是否已经存在本地化版本。有关 Angular 文档的本地化版本的当前列表，请参阅[本地化](guide/localized-documentation)文档。

## Getting started

## 快速上手

To have a localized version of Angular documentation listed on [angular.io](https://angular.io), you must either:

要在[angular.io](https://angular.io)上列出本地化版本的 Angular 文档，你必须：

* Be an Angular [Google Developer Expert (GDE)](https://developers.google.com/community/experts)

  成为 Angular [Google 开发人员专家 (GDE)](https://developers.google.com/community/experts)

* Have an Angular GDE nominate you for localizing the content

  让 Angular GDE 提名你对内容进行本地化

Nomination, in this instance, means that the GDE knows who you are and can vouch for your capabilities.
An Angular GDE can nominate someone by contacting the Angular team, providing your name, contact information, and the language to which you are localizing.

在这种情况下，提名意味着 GDE 知道你是谁，并且可以保证你的能力。 Angular GDE 可以通过联系 Angular 团队、提供你的姓名、联系信息和你要本地化的语言来提名某人。

## What to localize

## 要本地化什么

To localize Angular documentation, you must include, at a minimum, the following topics:

要本地化 Angular 文档，你必须至少包含以下主题：

* [Introduction to the Angular docs](docs)

  [Angular 文档介绍](docs)

* [What is Angular?](guide/what-is-angular)

  [什么是 Angular？](guide/what-is-angular)

* [Getting started with Angular](start)

  [Angular 入门](start)

  * [Adding navigation](start/start-routing)

    [添加导航](start/start-routing)

  * [Managing data](start/start-data)

    [管理数据](start/start-data)

  * [Using forms for user input](start/start-forms)

    [使用表单进行用户输入](start/start-forms)

  * [Deploying an application](start/start-deployment)

    [部署应用程序](start/start-deployment)

  * [Setting up the local environment and workspace](guide/setup-local)

    [设置本地环境和工作区](guide/setup-local)

* [Tour of Heroes app and tutorial](tutorial)

  [英雄之旅应用程序和教程](tutorial)

  * [Create a new project](tutorial/toh-pt0)

    [创建一个新项目](tutorial/toh-pt0)

  * [The hero editor](tutorial/toh-pt1)

    [英雄编辑](tutorial/toh-pt1)

  * [Display a selection list](tutorial/toh-pt2)

    [显示选择列表](tutorial/toh-pt2)

  * [Create a feature component](tutorial/toh-pt3)

    [创建特性组件](tutorial/toh-pt3)

  * [Add services](tutorial/toh-pt4)

    [添加服务](tutorial/toh-pt4)

  * [Add navigation with routing](tutorial/toh-pt5)

    [使用路由添加导航](tutorial/toh-pt5)

  * [Get data from a server](tutorial/toh-pt6)

    [从服务器获取数据](tutorial/toh-pt6)

Because these topics reflect the minimum documentation set for localization, the Angular documentation team takes special precautions when making any changes to these topics.
Specifically:

因为这些主题反映了为本地化设置的最少文档，所以 Angular 文档团队在对这些主题进行任何更改时会采取特殊的预防措施。具体来说：

* The Angular team carefully assesses any incoming pull requests or issues to determine their impact on localized content.

  Angular 团队会仔细评估任何传入的 Pull Request 或问题，以确定它们对本地化内容的影响。

* If the Angular team incorporates changes into these topics, the Angular team will communicate those changes to members of the localization community.
  See the section, [Communications](#communications), for more information.

  如果 Angular 团队将更改合并到这些主题中，则 Angular 团队将把这些更改传达给本地化社区的成员。有关更多信息，请参阅[通信](#communications)部分。

## Hosting

## 托管

Individuals and teams that localize Angular documentation assume responsibility for hosting their localized site.
The Angular team does not host localized content.
The Angular team is also not responsible for providing domain names.

将 Angular 文档本地化的个人和团队负责托管他们的本地化网站。 Angular 团队不托管本地化内容。 Angular 团队也不负责提供域名。

## Awareness

## 意识

As part of the localization effort, the Angular documentation team adds localized documentation to the [Localized documentation](guide/localized-documentation) page.
This topic lists:

作为本地化工作的一部分，Angular 文档团队将本地化文档添加到[本地化文档](guide/localized-documentation)页面。本主题列出了：

* The language of the localized documentation

  本地化文档的语言

* The URL for the localized documentation

  本地化文档的 URL

The Angular team can remove a link on this page for any reason, including but not limited to:

Angular 团队可以出于任何原因删除此页面上的链接，包括但不限于：

* Inability to contact the individual or team

  无法联系个人或团队

* Issues or complaints about the documentation that go unaddressed

  有关未解决的文档的问题或投诉

## Communications

## 通讯

The Angular documentation team uses a Slack channel to communicate with members of the community focused on localization efforts.
After receiving a nomination to localize content, an individual or team can contact the Angular team to get access to this Slack channel.

Angular 文档团队使用 Slack 频道与专注于本地化工作的社区成员进行沟通。在收到内容本地化的提名后，个人或团队可以联系 Angular 团队以访问此 Slack 频道。

The Angular documentation team may also conduct meetings to discuss localization efforts.
For example:

Angular 文档团队也可能会召开会议来讨论本地化工作。例如：

* To discuss additional topics that should be part of the minimum documentation set

  讨论应该作为最低文档集一部分的其他主题

* To discuss issues with content language that is difficult to translate/localize

  讨论使用难以翻译/本地化的内容语言的问题

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
Angular Roadmap

Angular 路线图

<p class="roadmap-last-updated">Last updated: 2023-05-03</p>

<p class="roadmap-last-updated">最后更新：2022-11-05</p>

Angular receives many feature requests, both from inside Google and the broader open-source community.
At the same time, our list of projects contains plenty of maintenance tasks, code refactorings, and potential performance improvements.
We bring together developer relations, product management, and engineering representatives to prioritize this list.
As new projects come into the queue, we regularly position them based on relative priority to other projects.
As work gets done, projects move up in the queue.

Angular 从 Google 内部和更广泛的开源社区都收到了大量的特性请求。与此同时，我们的项目列表包含大量维护任务、代码重构、潜在的性能提升等等。我们汇集了来自来自开发者关系部门、产品管理部门和工程部门的代表，以确定此列表的优先顺序。当新项目进入队列时，我们会根据其它项目的相对优先级定期对它们进行排位。当工作完成后，项目就会在队列中向上移动。

The following projects are not associated with a particular Angular version.
We will release them on completion, and they will be part of a specific version based on our release schedule, following semantic versioning.
For example, we release features in the next minor after completion or the next major if they include breaking changes.

下面这些项目并没有关联到特定的 Angular 版本。我们会在完成时发布它们，它们会根据我们的发布计划，并遵循语义化版本规范，变成特定版本的一部分。比如，当完成各种特性后会在下一个次要版本中发布，如果包含重大变更，则会到下一个主版本中发布。

In progress

进行中

Explore hydration and server-side rendering improvements

探索水合和服务端渲染改进

In v16, we released a developer preview of non-destructive full hydration, see the [hydration guide](guide/hydration) and the [blog post](https://blog.angular.io/whats-next-for-server-side-rendering-in-angular-2a6f27662b67) for additional information. We're already seeing significant improvements to Core Web Vitals, including [LCP](https://web.dev/lcp) and [CLS](https://web.dev/cls). In lab tests, we consistently observed 45% better LCP of a real-world app.

在 v16 中，我们发布了无损完全水合的开发者预览版，请参阅[水合指南](guide/hydration)和[博客文章](https://blog.angular.io/whats-next-for-server-side-rendering-in-angular-2a6f27662b67)了解更多信息。我们已经看到 Core Web Vitals 的显着改进，包括[LCP](https://web.dev/lcp)和[CLS](https://web.dev/cls)。在实验室测试中，我们始终观察到真实应用程序的 LCP 提高了 45%。

As the next step, we will iterate on polishing full hydration and further explore the dynamically evolving space of partial hydration and resumability. These more advanced patterns carry their own trade-offs; we'll share updates as we progress.

作为该项目的第一步，我们将实现无损水合。这项技术将允许我们复用服务端渲染好的 DOM，而不是重新渲染它，仅会附加事件侦听器并创建 Angular 运行时所需的数据结构。下一步，我们将进一步探索部分水合和可恢复的动态演化空间。每种方法都有它们的权衡，我们希望做出明智的决定，什么是 Angular 的最佳长期解决方案。

Improve runtime performance and developer experience with a new reactivity model

提高运行时性能并使 Zone.js 可选

In v16, we shared a developer preview of Angular Signals which fully implemented make Zone.js optional. The feature resulted from hundreds of discussions, conversations with developers, feedback sessions, user experience studies, and a series of [RFCs](https://github.com/angular/angular/discussions/49685), which received over 1,000 comments. As part of the release, we made a signals library and an RxJS interoperability package available. Next, after addressing the feedback we received from developers, we’ll continue implementing the proposals from the RFC.

在 v16 中，我们分享了 Angular Signals 的开发者预览版，它完全实现了让 Zone.js 变成可选的。该功能是数百次讨论、与开发人员的对话、反馈会议、用户体验研究和一系列[RFC](https://github.com/angular/angular/discussions/49685)的结果，收到了 1,000 多条评论。作为发布的一部分，我们提供了一个信号库和一个 RxJS 互操作性包。接下来，在解决了我们从开发人员那里收到的反馈后，我们将继续实施 RFC 中的建议。

Explore ergonomic component-level code-splitting APIs

探索符合人体工程学的组件级代码拆分 API

A common problem with web apps is their slow initial load time.
A way to improve it is to apply more granular code-splitting on a component level.
We will be working on more ergonomic code-splitting APIs to encourage this practice.

Web 应用程序的一个常见问题是它们的初始加载时间很慢。改进它的一种方法是在组件级别应用更细粒度的代码拆分。我们将致力于开发更符合人体工程学的代码拆分 API，以鼓励这种做法。

Improve documentation and schematics for standalone components

改进独立组件的文档和原理图

We released a developer preview of the `ng new --standalone` schematics collection, allowing you to create apps free of NgModules. Next, we'll iterate on the schematics to fill feature gaps and release a new tutorial based on standalone components.

我们正在努力为使用独立组件引导的应用程序开发一个 `ng new --standalone` 原理图集合。此外，我们正在逐步填补简化的独立组件 API 的文档空白。

Introduce dependency injection debugging APIs

介绍依赖注入调试 API

To improve the debugging utilities of Angular and Angular DevTools, we'll work on APIs that provide access to the dependency injection runtime. As part of the project, we'll expose debugging methods that allow us to explore the injector hierarchy and the dependencies across their associated providers. As of v16, we have a design of a feature that enables us to plug into the dependency injection life-cycle. As the next step, we'll implement the functionality and provide integration with Angular DevTools.

为了改进Angular和Angular DevTools的调试工具，我们将致力于提供访问依赖注入运行时的 API。作为该项目的一部分，我们将公开调试方法，以便探索注入器层次结构和其关联提供程序中的依赖关系。截至 v16，我们已经设计出了一项特性，可以让我们介入到依赖注入的生命周期中。下一步，我们将实现该特性并与 Angular DevTools 进行集成。

Streamline standalone imports with Language Service

使用 Language Service 简化独立导入

As part of this initiative, the language service automatically imports components and pipes in standalone and NgModule-based apps. Additionally, to enable smaller app bundles, we'll work on allowing the language service to propose the automatic removal of unused imports.

作为该举措的一部分，语言服务将自动在独立应用程序和基于 NgModule 的应用程序中导入组件和管道。此外，为了实现更小的应用包，我们将致力于让语言服务向你建议自动删除未使用的导入。

Investigate modern bundles

调查现代包

In Angular v16, we released a developer preview of an esbuild-based builder with support for `ng build` and `ng serve`. The `ng serve` development server uses Vite and a multi-file compilation by esbuild and the Angular compiler. As the next step before we graduate the feature out of developer preview, we'll work on enabling internationalization support and fixing stability issues.

在 Angular v16 中，我们发布了基于 esbuild 的构建器的开发人员预览版，支持 `ng build` 和 `ng serve`。`ng serve` 开发服务器使用 Vite 以及 esbuild 和 Angular 编译器的多文件编译。在我们将该功能从开发人员预览版中移除之前的下一步，我们将致力于启用国际化支持并解决稳定性问题。

New CDK primitives

新的 CDK 原语

We are working on new CDK primitives to facilitate creating custom components based on the WAI-ARIA design patterns for [Combobox](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox). Angular v14 introduced stable [menu and dialog primitives](https://material.angular.io/cdk/categories) as part of this project, and in v15 [Listbox](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox).

我们正在开发新的 CDK 原语，以促进基于[Combobox](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox)的 WAI-ARIA 设计模式创建自定义组件。作为本项目的一部分和 v15 [Listbox](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox)，Angular v14 引入了稳定的[菜单和对话框原语](https://material.angular.io/cdk/categories)。

Angular component accessibility

Angular 组件无障碍性

We are evaluating components in Angular Material against accessibility standards such as WCAG and working to fix any issues that arise from this process.

我们正在根据 WCAG 等无障碍性标准评估 Angular Material 中的组件，并努力解决此过程中出现的任何问题。

Investigate micro frontend architecture for scalable development processes

研究可扩展开发流程的微前端架构

We understood and defined the problem space for the past couple of quarters. We will follow up with a blog post on best practices when developing apps at scale. The project got delayed due to the prioritization of other initiatives.

我们了解并定义了过去几个季度的问题空间。我们将跟进一篇关于大规模开发应用程序最佳实践的博文。由于其他计划的优先顺序，该项目被推迟。

Update getting started tutorial

更新入门教程

Over the past two quarters, we developed a new video and textual tutorial based on standalone components. They are in the final review stages, and we expect to publish them by the end of Q2.

在过去的两个季度中，我们开发了一个基于独立组件的新视频和文本教程。它们正处于最终审查阶段，我们希望在第二季度末发布它们。

Token-based theming APIs

基于令牌的主题 API

To provide better customization of our Angular material components and enable Material 3 capabilities, we'll be collaborating with Google's Material Design team on defining token-based theming APIs. As of Q2 2023, we're refactoring components to use the new API, finalizing the comprehensive set of tokens, and updating the Sass API based on the new tokens.

为了更好地定制我们的 Angular Material 组件并启用 Material 3 功能，我们将与 Google 的 Material Design 团队合作定义基于令牌的主题 API。从 2023 年第二季度开始，我们正在重构组件以使用新的 API，最终确定完整的令牌集，并根据新令牌更新 Sass API。

Modernize Angular's unit testing tooling

现代化 Angular 的单元测试工具

In v12, we revisited the Angular end-to-end testing experience by replacing Protractor with modern alternatives such as Cypress, Nightwatch, and Webdriver.io. Next, we'd like to tackle `ng test` to modernize Angular's unit testing experience. In Q2, we introduced experimental [Jest](https://jestjs.io/) support and [announced](https://blog.angular.io/moving-angular-cli-to-jest-and-web-test-runner-ef85ef69ceca) the transition from Karma to the [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/).

在 v12 中，我们通过用 Cypress、Nightwatch 和 Webdriver.io 等现代替代品替换 Protractor，重新审视了 Angular 端到端测试体验。接下来，我们想解决 `ng test` 以现代化 Angular 的单元测试体验。在第二季度，我们引入了实验性的[Jest](https://jestjs.io/)支持，并[宣布](https://blog.angular.io/moving-angular-cli-to-jest-and-web-test-runner-ef85ef69ceca)从 Karma 过渡到[Web Test Runner](https://modern-web.dev/docs/test-runner/overview/)。

Future

未来

Investigation for authoring format improvements

创作格式改进调查

Based on our developer surveys' results we saw there are opportunities for improving the ergonomics of the component authoring format. The first step of the process will be to gather requirements and understand the problem space in advanced to an RFC. We'll share updates as we make progress. High priority in the future work will be backward compatibility and interoperability.

根据我们的开发人员调查结果，我们看到了改进组件创作格式的人体工程学的机会。该过程的第一步是收集需求并提前了解 RFC 的问题空间。我们将在取得进展时分享更新。未来工作的重中之重将是向后兼容性和互操作性。

Ensure smooth adoption for future RxJS changes \(version 8 and beyond\)

确保未来 RxJS 更改（版本 8 及更高版本）的顺利采用

We want to ensure Angular developers are taking advantage of the latest capabilities of RxJS and have a smooth transition to the subsequent major releases of the framework.
For this purpose, we will explore and document the scope of the changes in v7 and beyond RxJS and plan an update strategy.

我们希望确保 Angular 开发人员正在利用 RxJS 的最新特性，并平滑过渡到框架的下一个主要版本。为此，我们将探索并记录 v7 及更高版本的 RxJS 中更改的范围，并计划更新策略。

Support two-dimensional drag-and-drop

支持二维拖放

As part of this project, we'd like to implement mixed orientation support for the Angular CDK drag and drop. This is one of the repository's most highly [requested features](https://github.com/angular/components/issues/13372).

作为本项目的一部分，我们想实现对 Angular CDK 拖放的混合方向支持。这是存储库中[要求最高的特性](https://github.com/angular/components/issues/13372)之一。
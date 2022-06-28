# Angular Roadmap

# Angular 路线图

<p class="roadmap-last-updated">Last updated: 2022-05-23</p>

<p class="roadmap-last-updated">最后更新于: 2022-05-23</p>

Angular receives a large number of feature requests, both from inside Google and from the broader open-source community.
At the same time, our list of projects contains plenty of maintenance tasks, code refactorings, and potential performance improvements.
We bring together representatives from developer relations, product management, and engineering to prioritize this list.
As new projects come into the queue, we regularly position them based on relative priority to other projects.
As work gets done, projects move up in the queue.

Angular 从 Google 内部和更广泛的开源社区都收到了大量的特性请求。与此同时，我们的项目列表包含大量维护任务、代码重构、潜在的性能提升等等。我们汇集了来自来自开发者关系部门、产品管理部门和工程部门的代表，以确定此列表的优先顺序。当新项目进入队列时，我们会根据其它项目的相对优先级定期对它们进行排位。当工作完成后，项目就会在队列中向上移动。

The following projects are not associated with a particular Angular version.
We will release them on completion, and they will be part of a specific version based on our release schedule, following semantic versioning.
For example, features are released in the next minor after they are complete, or the next major if they include breaking changes.

下面这些项目并没有关联到特定的 Angular 版本。我们会在完成时发布它们，它们会根据我们的发布计划，并遵循语义化版本规范，变成特定版本的一部分。比如，当完成各种特性后会在下一个次要版本中发布，如果包含重大变更，则会到下一个主版本中发布。

## In progress

## 进行中

### Implement APIs for optional NgModules

### 为可选的 NgModules 实现 API

In the process of making Angular simpler, we are working on introducing APIs that allow developers to initialize applications, instantiate components, and use the router without NgModules. Angular v14 introduces developer preview of the APIs for standalone components, directives, and pipes. In the next few quarters we'll collect feedback from developers and finalize the project making the APIs stable. As the next step we will work on improving use cases such as `TestBed`, Angular elements, etc.

在使 Angular 更简单的过程中，我们正在努力引入 API，允许开发人员初始化应用程序、实例化组件，以及在不使用 NgModules 的情况下使用路由器。Angular v14 引入了独立组件、指令和管道的 API 的开发人员预览。在接下来的几个季度，我们将收集开发人员的反馈，并完成使 API 稳定的项目。作为下一步，我们将努力改进用例，例如 `TestBed` 、Angular 元素等。

### Improve image performance

### 提高镜像性能

The [Aurora](https://web.dev/introducing-aurora/) and the Angular teams are working on the implementation of an image directive that aims to improve [Core Web Vitals](https://web.dev/vitals). Currently, the project is in a prototyping phase and the teams are validating the image directive with partners.

[Aurora](https://web.dev/introducing-aurora/)和 Angular 团队正在努力实现旨在改进[Core Web Vitals](https://web.dev/vitals)的镜像指令。目前，该项目处于原型设计阶段，团队正在与合作伙伴验证镜像指令。

### Investigate micro frontend architecture for scalable development processes

### 研究可扩展开发流程的微前端架构

We conducted a series of 40 interviews to understand the requirements for micro-frontend architecture of the community. We followed up with a broader community survey. As the next step, we'll share analysis of the results publicly.

我们进行了 40 次系列采访，以了解社区对微前端架构的需求。我们随后进行了更广泛的社区调查。下一步，我们将公开分享对结果的分析。

### Investigate modern bundles

### 调查现代包

To improve development experience by speeding up build times research modern bundles.
As part of the project experiment with [esbuild](https://esbuild.github.io) and other open source solutions, compare them with the state of the art tooling in Angular CLI, and report the findings. In Angular v14 we're releasing an [experimental support](https://github.com/angular/angular-cli/pull/22995) for esbuild. Next, the team will focus on validating the new prototype and implementing watch and Sass support.

通过加快构建时间研究现代包来改善开发体验。作为使用[esbuild](https://esbuild.github.io)和其他开源解决方案的项目试验的一部分，将它们与 Angular CLI 中的最先进工具进行比较，并报告结果。在 Angular v14 中，我们发布了对 esbuild 的[实验性支持](https://github.com/angular/angular-cli/pull/22995)。接下来，团队将专注于验证新原型以及实现 watch 和 Sass 支持。

### Modern CSS

### 现代 CSS

The Web ecosystem evolves constantly and we want to reflect the latest modern standards in Angular. In this project we aim to provide guidelines on using modern CSS features in Angular to ensure developers follow best practices for layout, styling, etc.

Web 生态系统在不断发展，我们希望在 Angular 中反映最新的现代标准。在这个项目中，我们旨在提供有关在 Angular 中使用现代 CSS 特性的指南，以确保开发人员遵循布局、样式等方面的最佳实践。

### Support adding directives to host elements

### 支持向宿主元素添加指令

A [long-standing feature request](https://github.com/angular/angular/issues/8785) is to add the ability to add directives to host elements.
The feature lets developers augment their own components with additional behaviors without using inheritance.
The project requires substantial effort in terms of the definition of APIs, semantics, and implementation.

一个[长期存在的特性请求](https://github.com/angular/angular/issues/8785)是添加向宿主元素添加指令的能力。该特性允许开发人员在不使用继承的情况下使用其他行为来增强自己的组件。该项目需要在 API 的定义、语义和实现方面付出巨大的努力。

### Better stack traces

### 更好的堆栈跟踪

The Angular and the Chrome DevTools are working together to enable more readable stack traces for error messages.

Angular 和 Chrome DevTools 正在共同努力，为错误消息启用更具可读性的堆栈跟踪。

### New CDK primitives

### 新的 CDK 原语

We are working on new CDK primitives to facilitate creating custom components based on the WAI-ARIA design patterns for [Listbox](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox) and [Combobox](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox). Angular v14 introduced stable [menu and dialog primitives](https://material.angular.io/cdk/categories) as part of this project.

我们正在开发新的 CDK 原语，以促进根据 WAI-ARIA 设计模式为[Listbox](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox)和[Combobox](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox)创建自定义组件。作为该项目的一部分，Angular v14 引入了稳定的[菜单和对话框原语](https://material.angular.io/cdk/categories)。

### Enhanced Angular Material components by integrating MDC Web

### 通过集成 MDC Web 增强 Angular Material 组件

[MDC Web](https://material.io/develop/web) is a library created by the Google Material Design team that provides reusable primitives for building Material Design components.
The Angular team is incorporating these primitives into Angular Material.
Using MDC Web aligns Angular Material more closely with the Material Design specification, expand accessibility, improve component quality, and improve the velocity of our team.

[MDC Web](https://material.io/develop/web)是由 Google Material Design 团队创建的一个库，它为构建 Material Design 组件提供了可重用的原语。Angular 团队正在将这些原语合并到 Angular Material 中。使用 MDC Web 可以使 Angular Material 与 Material Design 规范更紧密地保持一致，扩展无障碍性，提高组件质量，并提高我们团队的速度。

### Angular component accessibility

### Angular 组件无障碍性

We are evaluating components in Angular Material against accessibility standards such as WCAG and working to fix any issues that arise from this process.

我们正在根据 WCAG 等无障碍性标准评估 Angular Material 中的组件，并努力解决此过程中出现的任何问题。

### Documentation refactoring

### 文档重构

Ensure all existing documentation fits into a consistent set of content types. Update excessive use of tutorial-style documentation into independent topics. We want to ensure the content outside the main tutorials is self-sufficient without being tightly coupled to a series of guides. In Q2 2022, we refactored the [template content](https://github.com/angular/angular/pull/45897). The next steps are to introduce better structure for components and dependency injection.

确保所有现有的文档都适合一组一致的内容类型。将过度使用教程风格的文档更新为独立的主题。我们希望确保主教程之外的内容是自给自足的，而不与一系列指南紧密耦合。在 2022 年第二季度，我们重构了[模板内容](https://github.com/angular/angular/pull/45897)。下一步是为组件和依赖注入引入更好的结构。

## Future

## 未来

### Explore hydration and server-side rendering usability improvements

### 探索水化和服务器端渲染可用性的改进

As part of this effort we'll explore the problem space of hydration with server-side rendering, different approaches, and opportunities for Angular. As outcome of this project we'll have validation of the effort as well as a plan for action.

作为这项工作的一部分，我们将使用服务器端渲染、不同的方法和 Angular 的机会来探索水化的问题空间。作为这个项目的结果，我们将验证所做的工作以及行动计划。

### Revamp performance dashboards to detect regressions

### 改进性能仪表板以支持回归检测

We have a set of benchmarks that we run against every code change to ensure Angular aligns with our performance standards.
To ensure the runtime of the framework does not regress after a code change, we need to refine some of the existing infrastructure the dashboards step on.

我们有一套针对每一次代码更改都要运行的基准测试，以确保 Angular 符合我们的性能标准。为确保框架的运行时在代码更改后不会退化，我们需要改进仪表板所使用的一些现有基础设施。

### Leverage full framework capabilities with Zone.js opt-out

### 提升无 Zone.js 方案的完整框架能力

We are going to design and implement a plan to make Zone.js optional from Angular applications.
This way, we simplify the framework, improve debugging, and reduce application bundle size.
Additionally, this lets us take advantage of built-in async/await syntax, which currently Zone.js does not support.

我们将设计并实施一项计划，使 Zone.js 在 Angular 应用程序中成为可选项。这样，我们简化了框架，改进了调试，并减少了应用程序包的大小。此外，这让我们可以利用当前 Zone.js 不支持的内置 async/await 语法。

### Improved build performance with ngc as a tsc plugin distribution

### 将 ngc 作为 tsc 的插件，以提高构建性能

Distributing the Angular compiler as a plugin of the TypeScript compiler will substantially improve build performance for developers and reduce maintenance costs.

将 Angular 编译器作为 TypeScript 编译器的插件分发将大大提高开发人员的构建性能并降低维护成本。

### Ergonomic component level code-splitting APIs

### 更符合工效学的组件级代码分割 API

A common problem with web applications is their slow initial load time.
A way to improve it is to apply more granular code-splitting on a component level.
To encourage this practice, we will be working on more ergonomic code-splitting APIs.

Web 应用程序的一个常见问题是它们的初始加载时间很慢。改进它的一种方法是在组件级别应用更精细的代码拆分。为了鼓励这种实践，我们将致力于开发更符合人体工程学的代码拆分 API。

### Ensure smooth adoption for future RxJS changes (version 8 and beyond)

### 确保未来 RxJS 更改（版本 8 及更高版本）的顺利采用

We want to ensure Angular developers are taking advantage of the latest capabilities of RxJS and have a smooth transition to the next major releases of the framework.
For this purpose, we will explore and document the scope of the changes in v7 and beyond RxJS, and plan an update strategy.

我们希望确保 Angular 开发人员正在利用 RxJS 的最新特性，并平滑过渡到框架的下一个主要版本。为此，我们将探索并记录 v7 及更高版本的 RxJS 中更改的范围，并计划更新策略。

### Introduce dependency injection debugging APIs

### 介绍依赖注入调试 API

To improve the debugging utilities of Angular and Angular DevTools, we'll work on APIs that provide access the dependency injection runtime. As part of the project we'll expose debugging methods that allow us to explore the injector hierarchy and the dependencies across their associated providers.

为了改进 Angular 和 Angular DevTools 的调试工具，我们将使用提供依赖注入运行时访问的 API。作为项目的一部分，我们将公开调试方法，这些方法允许我们探索注入器层次结构以及跨关联提供程序的依赖项。

### Support two-dimensional drag-and-drop

### 支持二维拖放

As part of this project we'd like to implement mixed orientation support for the Angular CDK drag and drop. This is one of the most highly [requested features](https://github.com/angular/components/issues/13372) in the repository.

作为本项目的一部分，我们想实现对 Angular CDK 拖放的混合方向支持。这是存储库中[要求最高的特性](https://github.com/angular/components/issues/13372)之一。

<details class="completed-details" open="true">

  <summary>
    <h2>Completed</h2>
    <span class="actions">
      <span class="action-expand">Show all</span>
      <span class="action-collapse">Hide all</span>
      <i class="material-icons expand">expand_more</i>
    </span>
  </summary>

  <div class="details-content">

### Allow binding to protected fields in templates

### 允许绑定到模板中的受保护字段

*Completed Q2 2022*

*2022 年第二季度完成*

To improve the encapsulation of Angular components we enabled binding to protected members of the component instance. This way you'll no longer have to expose a field or a method as public to use it inside your templates.

为了改进 Angular 组件的封装，我们启用了绑定到组件实例的受保护成员的功能。这样，你将不再需要将字段或方法公开为 public 来在模板中使用它。

### Publish guides on advanced concepts

### 发布有关高级概念的指南

*Completed Q2 2022*

*2022 年第二季度完成*

Develop and publish an in-depth guide on change detection.
Develop content for performance profiling of Angular applications.
Cover how change detection interacts with Zone.js and explain when it gets triggered, how to profile its duration, as well as common practices for performance optimization.

开发并发布有关变更检测的深入指南。开发用于 Angular 应用程序性能分析的内容。介绍变更检测如何与 Zone.js 交互，并解释它何时被触发、如何分析其持续时间以及性能优化的常见实践。

### Rollout strict typings for `@angular/forms`

### 为 `@angular/forms` 推出严格类型

*Completed Q2 2022*

*2022 年第二季度完成*

In Q4 2021 we designed a solution for introducing strict typings for forms and in Q1 2022 we concluded the corresponding [request for comments](https://github.com/angular/angular/discussions/44513).
Currently, we are implementing a rollout strategy with an automated migration step that will enable the improvements for existing projects.
We are first testing the solution with more than 2,500 projects at Google to ensure a smooth migration path for the external community.

在 2021 年第四季度，我们设计了一个为表单引入严格类型的解决方案，并在 2022 年第一季度，我们完成了相应[的评论请求](https://github.com/angular/angular/discussions/44513)。目前，我们正在实施具有自动迁移步骤的推出策略，这将支持对现有项目的改进。我们会首先在 Google 的 2500 多个项目中测试此解决方案，以确保为外部社区提供顺畅的迁移路径。

### Remove legacy [View Engine](guide/glossary#ve)

### 删除旧版[视图引擎](guide/glossary#ve)

*Completed Q1 2022*

*2022 年第一季度完成*

After the transition of all our internal tooling to Ivy is completed, we will remove the legacy View Engine for reduced Angular conceptual overhead, smaller package size, lower maintenance cost, and lower codebase complexity.

在我们所有内部工具向 Ivy 的转换完成后，我们将移除旧的 View Engine，以减少 Angular 的概念开销、获得更小的包大小、更低的维护成本和更低的代码库复杂度。

### Simplified Angular mental model with optional NgModules

### 带有可选 NgModules 的简化 Angular 心智模型

*Completed Q1 2022*

*2022 年第一季度完成*

To simplify the Angular mental model and learning journey, we will be working on making NgModules optional.
This work lets developers develop standalone components and implement an alternative API for declaring the compilation scope of the component.
We kicked this project off with high-level design discussions that we captured in an [RFC](https://github.com/angular/angular/discussions/43784).

为了简化 Angular 心智模型和学习旅程，我们将努力使 NgModules 成为可选。这项工作允许开发人员开发独立组件并实现另一种 API 来声明组件的编译范围。我们通过在[RFC](https://github.com/angular/angular/discussions/43784)中捕获的高级设计讨论来启动这个项目。

### Design strict typing for `@angular/forms`

### 为 `@angular/forms` 设计严格类型

*Completed Q1 2022*

*2022 年第一季度完成*

We will work on finding a way to implement stricter type checking for reactive forms with minimal backward incompatible implications.
This way, we let developers catch more issues during development time, enable better text editor and IDE support, and improve the type checking for reactive forms.

我们将努力寻找一种方法，以具有最小向后不兼容影响的方式对响应式表单实施更严格的类型检查。通过这种方式，我们可以让开发人员在开发期间发现更多问题，启用更好的文本编辑器和 IDE 支持，并改进响应式表单的类型检查。

### Improve integration of Angular DevTools with framework

### 改进 Angular DevTools 与框架的集成

*Completed Q1 2022*

*2022 年第一季度完成*

To improve the integration of Angular DevTools with the framework, we are working on moving the codebase to the [angular/angular](https://github.com/angular/angular) monorepository.
This includes transitioning Angular DevTools to Bazel and integrating it into the existing processes and CI pipeline.

为了改进 Angular DevTools 与框架的集成，我们正在努力将代码库移至[angular/angular](https://github.com/angular/angular)这个单一仓库。这包括将 Angular DevTools 转换为 Bazel，并将其集成到现有流程和 CI 管道中。

### Launch advanced compiler diagnostics

### 启动高级编译器诊断

*Completed Q1 2022*

*2022 年第一季度完成*

Extend the diagnostics of the Angular compiler outside type checking.
Introduce other correctness and conformance checks to further guarantee correctness and best practices.

将 Angular 编译器的诊断扩展到类型检查之外。引入其他正确性和一致性检查，以进一步保证正确性和最佳实践。

### Update our e2e testing strategy

### 更新我们的 e2e 测试策略

*Completed Q3 2021*

*2021 年第三季度完成*

To ensure we provide a future-proof e2e testing strategy, we want to evaluate the state of Protractor, community innovations, e2e best practices, and explore novel opportunities.
As first steps of the effort, we shared an [RFC](https://github.com/angular/protractor/issues/5502) and worked with partners to ensure smooth integration between the Angular CLI and state of the art tooling for e2e testing.
As the next step, we need to finalize the recommendations and compile a list of resources for the transition.

为确保我们提供面向未来的 e2e 测试策略，我们希望评估 Protractor 的状态、社区创新、e2e 最佳实践，并探索新的机会。作为努力的第一步，我们共享了一个[RFC](https://github.com/angular/protractor/issues/5502)，并与合作伙伴合作，以确保 Angular CLI 与用于 e2e 测试的最先进工具之间的顺利集成。下一步，我们需要最终确定建议并为过渡编译资源列表。

### Angular libraries use Ivy

### Angular 库使用 Ivy

*Completed Q3 2021*

*2021 年第三季度完成*

Earlier in 2020, we shared an [RFC](https://github.com/angular/angular/issues/38366) for Ivy library distribution.
After invaluable feedback from the community, we developed a design of the project.
We are now investing in the development of Ivy library distribution, including an update of the library package format to use Ivy compilation, unblock the deprecation of the View Engine library format, and [ngcc](guide/glossary#ngcc).

在 2020 年初，我们共享了一个用于 Ivy 库分发的[RFC](https://github.com/angular/angular/issues/38366)。在来自社区的宝贵反馈之后，我们开发了该项目的设计。我们现在正在投资开发 Ivy 库发行版，包括更新库包格式以使用 Ivy 编译、取消阻止 View Engine 库格式的弃用以及[ngcc](guide/glossary#ngcc)。

### Improve test times and debugging with automatic test environment tear down

### 通过自动测试环境拆除来改善测试时间和调试

*Completed Q3 2021*

*2021 年第三季度完成*

To improve test time and create better isolation across tests, we want to change [`TestBed`](api/core/testing/TestBed) to automatically clean up and tear down the test environment after each test run.

为了缩短测试时间并在测试之间创建更好的隔离，我们希望将[`TestBed`](api/core/testing/TestBed)更改为在每次测试运行后自动清理和拆除测试环境。

### Deprecate and remove IE11 support

### 弃用并删除 IE11 支持

*Completed Q3 2021*

*2021 年第三季度完成*

Internet Explorer 11 (IE11) has been preventing Angular from taking advantage of some of the modern features of the Web platform.
As part of this project we are going to deprecate and remove IE11 support to open the path for modern features that evergreen browsers provide.
We ran an [RFC](https://github.com/angular/angular/issues/41840) to collect feedback from the community and decide on next steps to move forward.

Internet Explorer 11 (IE11) 一直在阻止 Angular 利用 Web 平台的一些现代特性。作为本项目的一部分，我们将弃用并删除 IE11 支持，为常绿浏览器提供的现代特性打开道路。我们运行了一个[RFC](https://github.com/angular/angular/issues/41840)来收集社区的反馈，并决定接下来的步骤。

### Leverage ES2017+ as the default output language

### 利用 ES2017+ 作为默认输出语言

*Completed Q3 2021*

*2021 年第三季度完成*

Supporting modern browsers lets us take advantage of the more compact, expressive, and performant new syntax of JavaScript.
As part of this project we will investigate what the blockers are to moving forward with this effort, and take the steps to enable it.

支持现代浏览器让我们可以利用 JavaScript 更紧凑、更具表现力和高性能的新语法。作为本项目的一部分，我们将调查哪些障碍是为了推进这项工作，并采取措施启用它。

### Accelerated debugging and performance profiling with Angular DevTools

### 使用 Angular DevTools 加速调试和性能分析

*Completed Q2 2021*

*2021 年第二季度已完成*

We are working on development tooling for Angular that provides utilities for debugging and performance profiling.
This project aims to help developers understand the component structure and the change detection in an Angular application.

我们正在开发 Angular 的开发工具，它提供用于调试和性能分析的实用程序。该项目旨在帮助开发人员了解 Angular 应用程序中的组件结构和变更检测。

### Streamline releases with consolidated Angular versioning & branching

### 通过整合的 Angular 版本控制和分支来简化发布

*Completed Q2 2021*

*2021 年第二季度已完成*

We want to consolidate release management tooling between the multiple GitHub repositories for Angular ([angular/angular](https://github.com/angular/angular), [angular/angular-cli](https://github.com/angular/angular-cli), and [angular/components](https://github.com/angular/components)).
This effort lets us reuse infrastructure, unify and simplify processes, and improve the reliability of our release process.

我们希望在 Angular 的多个 GitHub 存储库（[angular/angular](https://github.com/angular/angular) 、 [angular/angular-cli](https://github.com/angular/angular-cli)和[angular/components](https://github.com/angular/components)）之间整合发布管理工具。这项工作让我们可以复用基础设施，统一和简化流程，并提高我们发布流程的可靠性。

### Higher developer consistency with commit message standardization

### 通过提交消息标准化提高开发人员的一致性

*Completed Q2 2021*

*2021 年第二季度已完成*

We want to unify commit message requirements and conformance across Angular repositories ([angular/angular](https://github.com/angular/angular), [angular/components](https://github.com/angular/components), and [angular/angular-cli](https://github.com/angular/angular-cli)) to bring consistency to our development process and reuse infrastructure tooling.

我们希望统一跨 Angular 存储库（[angular/angular](https://github.com/angular/angular) 、 [angular/components](https://github.com/angular/components) 、 [angular/angular-cli](https://github.com/angular/angular-cli)）的提交消息要求和一致性，以便为我们的开发过程带来一致性并复用基础设施工具。

### Transition the Angular language service to Ivy

### 将 Angular 语言服务转换为 Ivy

*Completed Q2 2021*

*2021 年第二季度已完成*

The goal of this project is to improve the experience and remove legacy dependency by transitioning the language service to Ivy.
Today the language service still uses the View Engine compiler and type checking, even for Ivy applications.
We want to use the Ivy template parser and improved type checking for the Angular Language service to match application behavior.
This migration is also a step towards unblocking the removal of View Engine, which will simplify Angular, reduce the npm package size, and improve the maintainability of the framework.

该项目的目标是通过将语言服务转换为 Ivy 来改善体验并消除遗留依赖。今天，语言服务仍然使用 View Engine 编译器和类型检查，即使对于 Ivy 应用程序也是如此。我们希望使用 Ivy 模板解析器和改进的 Angular 语言服务类型检查来匹配应用程序行为。此次迁移也是朝着移除 View Engine 的方向迈出的一步，这将简化 Angular，减少 npm 包大小，并提高框架的可维护性。

### Increased security with native Trusted Types in Angular

### 在 Angular 中使用本机受信任类型提高安全性

*Completed Q2 2021*

*2021 年第二季度已完成*

In collaboration with the Google security team, we are adding support for the new [Trusted Types](https://web.dev/trusted-types) API.
This web platform API helps developers build more secure web applications.

我们与 Google 的安全团队合作，增加了对新 Trusted Types API 的支持。此 Web 平台 API 可帮助开发人员构建更安全的 Web 应用程序。

### Optimized build speed and bundle sizes with Angular CLI webpack 5

### 使用 Angular CLI webpack 5 优化构建速度和包大小

*Completed Q2 2021*

*2021 年第二季度已完成*

As part of the v11 release, we introduced an opt-in preview of webpack 5 in the Angular CLI.
To ensure stability, we will continue iterating on the implementation to enable build speed and bundle size improvements.

作为 v11 版本的一部分，我们在 Angular CLI 中引入了 webpack 5 的可选预览。为确保稳定性，我们将继续迭代实现以实现构建速度和包大小改进。

### Faster apps by inlining critical styles in Universal applications

### 通过在 Universal 应用中内联关键样式来提速

*Completed Q1 2021*

*2021 年第一季度已完成*

Loading external stylesheets is a blocking operation, which means that the browser cannot start rendering your application until it loads all the referenced CSS.
Having render-blocking resources in the header of a page can significantly impact its load performance, for example, its [first contentful paint](https://web.dev/first-contentful-paint).
To make apps faster, we have been collaborating with the Google Chrome team on inlining critical CSS and loading the rest of the styles asynchronously.

加载外部样式表是一个阻塞型操作，这意味着浏览器在加载所有引用的 CSS 之前无法开始渲染你的应用程序。在页面的标题中拥有阻塞渲染的资源会显著影响其加载性能，比如，它的[首次内容绘制](https://web.dev/first-contentful-paint)。为了使应用程序更快，我们一直在与 Google Chrome 团队合作内联关键 CSS 并异步加载其余样式。

### Improve debugging with better Angular error messages

### 使用更好的 Angular 错误消息改进调试

*Completed Q1 2021*

*2021 年第一季度已完成*

Error messages often bring limited actionable information to help developers resolve them.
We have been working on making error messages more discoverable by adding associated codes, developing guides, and other materials to ensure a smoother debugging experience.

错误消息通常会带来有限的行动指南来帮助开发人员解决它们。我们一直致力于通过添加相关代码、开发指南和其他资料来使错误消息更易于发现，以确保更顺畅的调试体验。

### Improved developer onboarding with refreshed introductory documentation

### 通过更新的介绍性文档改进了开发人员入门

*Completed Q1 2021*

*2021 年第一季度已完成*

We will redefine the user learning journeys and refresh the introductory documentation.
We will clearly state the benefits of Angular, how to explore its capabilities and provide guidance so developers can become proficient with the framework in as little time as possible.

我们将重新定义用户学习旅程并刷新介绍性文档。我们将清楚地说明 Angular 的好处，如何探索其功能并提供指导，以便开发人员可以在尽可能短的时间内精通该框架。

### Expand component harnesses best practices

### 扩展组件线束最佳实践

*Completed Q1 2021*

*2021 年第一季度已完成*

Angular CDK introduced the concept of [component test harnesses](https://material.angular.io/cdk/test-harnesses) to Angular in version 9.
Test harnesses let component authors create supported APIs for testing component interactions.
We are continuing to improve this harness infrastructure and clarifying the best practices around using harnesses.
We are also working to drive more harness adoption inside of Google.

Angular CDK 在 Angular 9 中引入了[组件测试工具](https://material.angular.io/cdk/test-harnesses)的概念。测试工具能让组件作者创建支持的 API 来测试组件交互。我们将继续改进此测试工具基础架构，并阐明有关使用这些测试工具的最佳实践。我们还在努力推动 Google 内部更多地采用测试工具。

### Author a guide for content projection

### 编写内容投影指南

*Completed Q2 2021*

*2021 年第二季度已完成*

Content projection is a core Angular concept that does not have the presence it deserves in the documentation.
As part of this project we want to identify the core use cases and concepts for content projection and document them.

内容投影是一个核心的 Angular 概念，但在文档中却没有足够的篇幅来讲它。作为该项目的一部分，我们希望确定内容投影的核心用例和概念并记录它们。

### Migrate to ESLint

### 迁移到 ESLint

*Completed Q4 2020*

*2020 年第四季度已完成*

With the deprecation of TSLint we will be moving to ESLint.
As part of the process, we will work on ensuring backward compatibility with our current recommended TSLint configuration, implement a migration strategy for existing Angular applications and introduce new tooling to the Angular CLI toolchain.

随着 TSLint 的弃用，我们将转向 ESLint。作为该过程的一部分，我们将努力确保与我们当前推荐的 TSLint 配置向后兼容，为现有 Angular 应用程序实施迁移策略，并将新工具引入 Angular CLI 工具链。

### Operation Bye Bye Backlog (also known as Operation Byelog)

### Operation Bye Bye Backlog（也称为 Operation Byelog）

*Completed Q4 2020*

*2020 年第四季度已完成*

We are actively investing up to 50% of our engineering capacity on triaging issues and PRs until we have a clear understanding of broader community needs.
After that, we will commit up to 20% of our engineering capacity to keep up with new submissions promptly.

我们正努力将高达 50% 的工程能力投入到分类问题和 PR 上，直到我们清楚了解更广泛的社区需求。之后，我们将投入多达 20% 的工程能力，以便及时跟进新提交的要求。

</div>

</details>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
# Angular Roadmap

# Angular 路线图

<p class="roadmap-last-updated">Last updated: 2021-11-03</p>

<p class="roadmap-last-updated">最后更新于: 2021-11-03</p>

Angular receives a large number of feature requests, both from inside Google and from the broader open-source community. At the same time, our list of projects contains plenty of maintenance tasks, code refactorings, and potential performance improvements. We bring together representatives from developer relations, product management, and engineering to prioritize this list. As new projects come into the queue, we regularly position them based on relative priority to other projects. As work gets done, projects move up in the queue.

Angular 从 Google 内部和更广泛的开源社区都收到了大量的特性请求。与此同时，我们的项目列表包含大量维护任务、代码重构、潜在的性能提升等等。我们汇集了来自来自开发者关系部门、产品管理部门和工程部门的代表，以确定此列表的优先顺序。当新项目进入队列时，我们会根据其它项目的相对优先级定期对它们进行排位。当工作完成后，项目就会在队列中向上移动。

The following projects are not associated with a particular Angular version. We'll release them on completion, and they will be part of a specific version based on our release schedule, following semantic versioning. For example, features are released in the next minor after they are complete, or the next major if they include breaking changes.

下面这些项目并没有关联到特定的 Angular 版本。我们会在完成时发布它们，它们会根据我们的发布计划，并遵循语义化版本规范，变成特定版本的一部分。例如，当完成各种特性后会在下一个次要版本中发布，如果包含重大变更，则会到下一个主版本中发布。

## In progress

## 进行中

### Better developer ergonomics with strict typing for `@angular/forms`

### 更好的开发者工程学，带有严格类型的 `@angular/forms`

We will work on finding a way to implement stricter type checking for reactive forms with minimal backward incompatible implications. This way, we let developers catch more issues during development time, enable better text editor and IDE support, and improve the type checking for reactive forms.

我们将努力寻找一种方法，以具有最小向后不兼容影响的方式对响应式表单实施更严格的类型检查。通过这种方式，我们可以让开发人员在开发期间发现更多问题，启用更好的文本编辑器和 IDE 支持，并改进响应式表单的类型检查。

### Simplified Angular mental model with optional NgModules

### 带有可选 NgModules 的简化 Angular 心智模型

To simplify the Angular mental model and learning journey, we’ll be working on making NgModules optional. This work lets developers develop standalone components and implement an alternative API for declaring the component’s compilation scope. We kicked this project off with high-level design discussions that we captured in an [RFC](https://github.com/angular/angular/discussions/43784).

为了简化 Angular 心智模型和学习之旅，我们将努力使 NgModules 成为可选的。这项工作使开发人员可以开发独立组件并实现用于声明组件编译范围的替代 API。我们通过从[RFC](https://github.com/angular/angular/discussions/43784)中获得的高级设计讨论开始了这个项目。

### Investigate micro frontend architecture for scalable development processes

### 研究可扩展开发流程的微前端架构

Look into independent deployability and development of large-scale applications to improve efficiency and productivity. The Angular community has an established story for micro frontend support. As part of this effort, we’d investigate what would be the correct abstractions to provide better support.

研究大规模应用程序的独立部署和开发，以提高效率和生产力。 Angular 社区有一个关于微前端支持的既定故事。作为这项工作的一部分，我们将研究什么才是能提供更好支持的正确抽象。

### Enhanced Angular Material components by integrating [MDC Web](https://material.io/develop/web/)

### 通过集成 [MDC Web](https://material.io/develop/web/) 改进 Angular Material 组件

MDC Web is a library created by Google's Material Design team that provides reusable primitives for building Material Design components. The Angular team is incorporating these primitives into Angular Material. Using MDC Web aligns Angular Material more closely with the Material Design specification, expand accessibility, improve component quality, and improve our team's velocity.

MDC Web 是一个由 Google 的 Material Design 团队创建的库，它为构建 Material Design 组件提供了可复用的原语。 Angular 团队正在将这些原语合并到 Angular Material 中。使用 MDC Web 可以使 Angular Material 与 Material Design 规范更紧密地对齐，扩展无障碍性，提高组件质量，并提高我们团队的速度。

### Angular component accessibility

### Angular 组件无障碍性

We're evaluating components in Angular Material against accessibility standards such as WCAG and working to fix any issues that arise from this process.

我们正在根据 WCAG 等无障碍性标准评估 Angular Material 中的组件，并努力解决此过程中出现的任何问题。

### Remove legacy [View Engine](guide/glossary#ve)

### 删除旧版[视图引擎](guide/glossary#ve)

After the transition of all our internal tooling to Ivy is completed, we will remove the legacy View Engine for reduced Angular conceptual overhead, smaller package size, lower maintenance cost, and lower codebase complexity.

在我们所有内部工具向 Ivy 的转换完成后，我们将移除旧的 View Engine，以减少 Angular 的概念开销、获得更小的包大小、更低的维护成本和更低的代码库复杂度。

### Launch advanced compiler diagnostics

### 启动高级编译器诊断

Extend the diagnostics of the Angular compiler outside type checking. Introduce other correctness and conformance checks to further guarantee correctness and best practices.

将 Angular 编译器的诊断扩展到类型检查之外。引入其他正确性和一致性检查，以进一步保证正确性和最佳实践。

### Improve Angular DevTools' integration with framework

### 改进 Angular DevTools 与框架的集成

To improve the integration of Angular DevTools with the framework, we are working on moving the codebase to the [angular/angular](https://github.com/angular/angular) monorepository. This includes transitioning Angular DevTools to Bazel and integrating it into the existing processes and CI pipeline.

为了改进 Angular DevTools 与框架的集成，我们正在努力将代码库移至[angular/angular](https://github.com/angular/angular)这个单一仓库。这包括将 Angular DevTools 转换为 Bazel，并将其集成到现有流程和 CI 管道中。

## Future

## 未来

### Revamp performance dashboards to detect regressions

### 改进性能仪表板以支持回归检测

We have a set of benchmarks that we run against every code change to ensure Angular aligns with our performance standards. To ensure the framework’s runtime does not regress after a code change, we need to refine some of the existing infrastructure the dashboards step on.

我们有一套针对每一次代码更改都要运行的基准测试，以确保 Angular 符合我们的性能标准。为确保框架的运行时在代码更改后不会退化，我们需要改进仪表板所使用的一些现有基础设施。

### Leverage full framework capabilities with Zone.js opt-out

### 提升无 Zone.js 方案的完整框架能力

We are going to design and implement a plan to make Zone.js optional from Angular applications. This way, we simplify the framework, improve debugging, and reduce application bundle size. Additionally, this lets us take advantage of built-in async/await syntax, which currently Zone.js does not support.

我们将设计并实施一项计划，使 Zone.js 在 Angular 应用程序中成为可选项。这样，我们简化了框架，改进了调试，并减少了应用程序包的大小。此外，这让我们可以利用当前 Zone.js 不支持的内置 async/await 语法。

### Improved build performance with ngc as a tsc plugin distribution

### 将 ngc 作为 tsc 的插件，以提高构建性能

Distributing the Angular compiler as a plugin of the TypeScript compiler will substantially improve developers' build performance and reduce maintenance costs.

将 Angular 编译器作为 TypeScript 编译器的插件进行发布，可以大大提高开发人员的构建性能，降低维护成本。

### Support adding directives to host elements

### 支持向宿主元素添加指令

A long-standing feature request is to add the ability to add directives to host elements. The feature lets developers augment their own components with additional behaviors without using inheritance. The project requires substantial effort in terms of the definition of APIs, semantics, and implementation.

一项由来已久的特性请求是增加为宿主元素添加指令的能力。该特性允许开发人员使用额外的行为来扩展自己的组件，而不必使用继承。该项目在定义 API、语义和实现方面都需要付出巨大的努力。

### Ergonomic component level code-splitting APIs

### 更符合工效学的组件级代码分割 API

A common problem with web applications is their slow initial load time. A way to improve it is to apply more granular code-splitting on a component level. To encourage this practice, we’ll be working on more ergonomic code-splitting APIs.

Web 应用程序的一个常见问题是它们的初始加载时间很慢。改进它的方法之一是在组件级别应用更细粒度的代码拆分。为了鼓励这种做法，我们将致力于开发更符合人体工程学的代码拆分 API。

### Publish guides on advanced concepts

Develop and publish an in-depth guide on change detection. Develop content for performance profiling of Angular applications. Cover how change detection interacts with Zone.js and explain when it gets triggered, how to profile its duration, as well as common practices for performance optimization.

### Ensure smooth adoption for future RxJS changes (version 8 and beyond)

We want to ensure Angular developers are taking advantage of the latest capabilities of RxJS and have a smooth transition to the next major releases of the framework. For this purpose, we will explore and document the scope of the changes in v7 and beyond RxJS, and plan an update strategy.

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

### Update our e2e testing strategy

_Completed Q3 2021_

To ensure we provide a future-proof e2e testing strategy, we want to evaluate the state of Protractor, community innovations, e2e best practices, and explore novel opportunities. As first steps of the effort, we shared an [RFC](https://github.com/angular/protractor/issues/5502) and worked with partners to ensure smooth integration between the Angular CLI and state of the art tooling for e2e testing. As the next step, we need to finalize the recommendations and compile a list of resources for the transition.

### Angular libraries use Ivy

_Completed Q3 2021_

Earlier in 2020, we shared an [RFC](https://github.com/angular/angular/issues/38366) for Ivy library distribution. After invaluable feedback from the community, we developed a design of the project. We are now investing in the development of Ivy library distribution, including an update of the library package format to use Ivy compilation, unblock the deprecation of the View Engine library format, and [ngcc](guide/glossary#ngcc).

### Improve test times and debugging with automatic test environment tear down

_Completed Q3 2021_

To improve test time and create better isolation across tests, we want to change <code>[TestBed](api/core/testing/TestBed)</code> to automatically clean up and tear down the test environment after each test run.

### Deprecate and remove IE11 support

_Completed Q3 2021_

Internet Explorer 11 (IE11) has been preventing Angular from taking advantage of some of the modern features of the Web platform. As part of this project we are going to deprecate and remove IE11 support to open the path for modern features that evergreen browsers provide. We ran an [RFC](https://github.com/angular/angular/issues/41840) to collect feedback from the community and decide on next steps to move forward.

### Leverage ES2017+ as the default output language

_Completed Q3 2021_

Supporting modern browsers lets us take advantage of the more compact, expressive, and performant new syntax of JavaScript. As part of this project we’ll investigate what the blockers are to moving forward with this effort, and take the steps to enable it.

### Accelerated debugging and performance profiling with Angular DevTools

### 使用 Angular DevTools 加速调试和性能分析

*Completed Q2 2021*

*2021 年第二季度已完成*

We are working on development tooling for Angular that provides utilities for debugging and performance profiling. This project aims to help developers understand the component structure and the change detection in an Angular application.

我们正在开发 Angular 的开发工具，它提供用于调试和性能分析的实用程序。该项目旨在帮助开发人员了解 Angular 应用程序中的组件结构和变更检测。

### Streamline releases with consolidated Angular versioning & branching

### 通过整合的 Angular 版本控制和分支来简化发布

*Completed Q2 2021*

*2021 年第二季度已完成*

We want to consolidate release management tooling between Angular's multiple GitHub repositories ([angular/angular](https://github.com/angular/angular), [angular/angular-cli](https://github.com/angular/angular-cli), and [angular/components](https://github.com/angular/components)). This effort lets us reuse infrastructure, unify and simplify processes, and improve our release process's reliability.

我们希望在 Angular 的多个 GitHub 存储库（ [angular/angular](https://github.com/angular/angular) 、 [angular/angular-cli](https://github.com/angular/angular-cli)和[angular/components](https://github.com/angular/components) ）之间整合发布管理工具。这项工作让我们可以复用基础设施，统一和简化流程，并提高我们发布流程的可靠性。

### Higher developer consistency with commit message standardization

### 通过提交消息标准化提高开发人员的一致性

*Completed Q2 2021*

*2021 年第二季度已完成*

We want to unify commit message requirements and conformance across Angular repositories ([angular/angular](https://github.com/angular/angular), [angular/components](https://github.com/angular/components), [angular/angular-cli](https://github.com/angular/angular-cli)) to bring consistency to our development process and reuse infrastructure tooling.

我们希望统一跨 Angular 存储库（ [angular/angular](https://github.com/angular/angular) 、 [angular/components](https://github.com/angular/components) 、 [angular/angular-cli](https://github.com/angular/angular-cli) ）的提交消息要求和一致性，以便为我们的开发过程带来一致性并复用基础设施工具。

### Transition the Angular language service to Ivy

### 将 Angular 语言服务转换为 Ivy

*Completed Q2 2021*

*2021 年第二季度已完成*

The goal of this project is to improve the experience and remove legacy dependency by transitioning the language service to Ivy. Today the language service still uses the View Engine compiler and type checking, even for Ivy applications. We want to use the Ivy template parser and improved type checking for the Angular Language service to match application behavior. This migration is also a step towards unblocking the removal of View Engine, which will simplify Angular, reduce the npm package size, and improve the framework's maintainability.

该项目的目标是通过将语言服务转换为 Ivy 来改善体验并消除遗留依赖。今天，语言服务仍然使用 View Engine 编译器和类型检查，即使对于 Ivy 应用程序也是如此。我们希望使用 Ivy 模板解析器和改进的 Angular 语言服务类型检查来匹配应用程序行为。此次迁移也是朝着移除 View Engine 的方向迈出的一步，这将简化 Angular，减少 npm 包大小，并提高框架的可维护性。

### Increased security with native [Trusted Types](https://web.dev/trusted-types/) in Angular

### 使用 Angular 中的本机[可信类型](https://web.dev/trusted-types/)提高安全性

*Completed Q2 2021*

*2021 年第二季度已完成*

In collaboration with Google's security team, we're adding support for the new Trusted Types API. This web platform API helps developers build more secure web applications.

我们与 Google 的安全团队合作，增加了对新 Trusted Types API 的支持。此 Web 平台 API 可帮助开发人员构建更安全的 Web 应用程序。

### Optimized build speed and bundle sizes with Angular CLI webpack 5

### 使用 Angular CLI webpack 5 优化构建速度和包大小

*Completed Q2 2021*

*2021 年第二季度已完成*

As part of the v11 release, we introduced an opt-in preview of webpack 5 in the Angular CLI. To ensure stability, we’ll continue iterating on the implementation to enable build speed and bundle size improvements.

作为 v11 版本的一部分，我们在 Angular CLI 中引入了 webpack 5 的可选预览。为确保稳定性，我们将继续迭代实现以实现构建速度和包大小改进。

### Faster apps by inlining critical styles in Universal applications

### 通过在 Universal 应用中内联关键样式来提速

*Completed Q1 2021*

*2021 年第一季度已完成*

Loading external stylesheets is a blocking operation, which means that the browser can’t start rendering your application until it loads all the referenced CSS. Having render-blocking resources in the header of a page can significantly impact its load performance, for example, its [first contentful paint](https://web.dev/first-contentful-paint/). To make apps faster, we’ve been collaborating with the Google Chrome team on inlining critical CSS and loading the rest of the styles asynchronously.

加载外部样式表是一个阻塞型操作，这意味着浏览器在加载所有引用的 CSS 之前无法开始渲染你的应用程序。在页面的标题中拥有阻塞渲染的资源会显著影响其加载性能，例如，它的[首次内容绘制](https://web.dev/first-contentful-paint/)。为了使应用程序更快，我们一直在与 Google Chrome 团队合作内联关键 CSS 并异步加载其余样式。

### Improve debugging with better Angular error messages

### 使用更好的 Angular 错误消息改进调试

*Completed Q1 2021*

*2021 年第一季度已完成*

Error messages often bring limited actionable information to help developers resolve them. We’ve been working on making error messages more discoverable by adding associated codes, developing guides, and other materials to ensure a smoother debugging experience.

错误消息通常会带来有限的行动指南来帮助开发人员解决它们。我们一直致力于通过添加相关代码、开发指南和其他资料来使错误消息更易于发现，以确保更顺畅的调试体验。

### Improved developer onboarding with refreshed introductory documentation

### 通过更新的介绍性文档改进了开发人员入门

*Completed Q1 2021*

*2021 年第一季度已完成*

We will redefine the user learning journeys and refresh the introductory documentation. We will clearly state the benefits of Angular, how to explore its capabilities and provide guidance so developers can become proficient with the framework in as little time as possible.

我们将重新定义用户学习旅程并刷新介绍性文档。我们将清楚地说明 Angular 的好处，如何探索其功能并提供指导，以便开发人员可以在尽可能短的时间内精通该框架。

### Expand component harnesses best practices

### 扩展组件线束最佳实践

*Completed Q1 2021*

*2021 年第一季度已完成*

Angular CDK introduced the concept of [component test harnesses](https://material.angular.io/cdk/test-harnesses) to Angular in version 9. Test harnesses let component authors create supported APIs for testing component interactions. We're continuing to improve this harness infrastructure and clarifying the best practices around using harnesses. We're also working to drive more harness adoption inside of Google.

Angular CDK 在 Angular 9 中引入了[组件测试工具](https://material.angular.io/cdk/test-harnesses)的概念。测试工具能让组件作者创建支持的 API 来测试组件交互。我们将继续改进此测试工具基础架构，并阐明有关使用这些测试工具的最佳实践。我们还在努力推动 Google 内部更多地采用测试工具。

### Author a guide for content projection

### 编写内容投影指南

*Completed Q2 2021*

*2021 年第二季度已完成*

Content projection is a core Angular concept that does not have the presence it deserves in the documentation. As part of this project we want to identify the core use cases and concepts for content projection and document them.

内容投影是一个核心的 Angular 概念，但在文档中却没有足够的篇幅来讲它。作为该项目的一部分，我们希望确定内容投影的核心用例和概念并记录它们。

### Migrate to ESLint

### 迁移到 ESLint

*Completed Q4 2020*

*2020 年第四季度已完成*

With the deprecation of TSLint we will be moving to ESLint. As part of the process, we will work on ensuring backward compatibility with our current recommended TSLint configuration, implement a migration strategy for existing Angular applications and introduce new tooling to the Angular CLI toolchain.

随着 TSLint 的弃用，我们将转向 ESLint。作为该过程的一部分，我们将努力确保与我们当前推荐的 TSLint 配置向后兼容，为现有 Angular 应用程序实施迁移策略，并将新工具引入 Angular CLI 工具链。

### Operation Bye Bye Backlog (also known as Operation Byelog)

### Operation Bye Bye Backlog（也称为 Operation Byelog）

*Completed Q4 2020*

*2020 年第四季度已完成*

We are actively investing up to 50% of our engineering capacity on triaging issues and PRs until we have a clear understanding of broader community needs. After that, we'll commit up to 20% of our engineering capacity to keep up with new submissions promptly.

我们正努力将高达 50% 的工程能力投入到分类问题和 PR 上，直到我们清楚了解更广泛的社区需求。之后，我们将投入多达 20% 的工程能力，以便及时跟进新提交的要求。

</div>
</details>

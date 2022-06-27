# Angular versioning and releases

# Angular 的版本与发布

We recognize that you need stability from the Angular framework.
Stability ensures that reusable components and libraries, tutorials, tools, and learned practices don't become obsolete unexpectedly.
Stability is essential for the ecosystem around Angular to thrive.

你肯定希望 Angular 框架具有稳定性（stability）。稳定性可以确保组件与库、教程、工具和现有实践不会突然被弃用。稳定性是让基于 Angular 的生态系统变得繁荣的基石。

We also share with you the need for Angular to keep evolving.
We strive to ensure that the foundation on top of which you are building is continuously improving and enabling you to stay up-to-date with the rest of the web ecosystem and your user needs.

我们也和你一样希望 Angular 能持续演进。我们会努力确保这些你用于构建应用的基础能得到持续的改进，并让你能及时同步到 Web 生态系统的其它部分的最新进展，用户需求也是一样。

This document contains the practices that we follow to provide you with a leading-edge application development platform, balanced with stability.
We strive to ensure that future changes are always introduced in a predictable way.
We want everyone who depends on Angular to know when and how new features are added, and to be well-prepared when obsolete ones are removed.

本文档包含一些我们所遵循的实践，它让我们能为你提供一个前沿的应用开发平台，同时兼顾稳定性。我们会努力确保将来的变化总是以一种可预期的方式引入。我们希望每个 Angular 用户都明白我们将在何时添加以及如何添加新特性，并且为那些将要移除的、准备弃用的特性提前做好准备。

<div class="alert is-helpful">

The practices described in this document apply to Angular 2.0 and later.
If you are currently using AngularJS, see [Upgrading from AngularJS](guide/upgrade "Upgrading from Angular JS").
*AngularJS* is the name for all v1.x versions of Angular.

本文档中提及的这些实践适用于 Angular 2.0 及以后的版本。如果你正在使用 AngularJS，请参阅[从 AngularJS 升级](guide/upgrade "Upgrading from Angular JS")。*AngularJS*专指 Angular 所有的 v1.x 版本。

</div>

<a id="versioning"></a>

## Angular versioning

## Angular 的版本

Angular version numbers indicate the level of changes that are introduced by the release.
This use of [semantic versioning](https://semver.org/ "Semantic Versioning Specification") helps you understand the potential impact of updating to a new version.

Angular 的版本号表明本次发布中所引入的变更级别。它使用[语义化版本号](https://semver.org/ "Semantic Versioning Specification")来帮助你理解升级到新版本时的潜在影响。

Angular version numbers have three parts: `major.minor.patch`.
For example, version 7.2.11 indicates major version 7, minor version 2, and patch level 11.

Angular 的版本号包括三个部分：`major.minor.patch`。比如，版本 7.2.11 表示主版本号是 7，小版本号是 2，补丁版本号是 11。

The version number is incremented based on the level of change included in the release.

版本号是根据本次发布中包含的变更的级别进行递增的。

| Level of change | Details |
| :-------------- | :------ |
| Level of change | 详情 |
| Major release | Contains significant new features, some but minimal developer assistance is expected during the update. When updating to a new major release, you might need to run update scripts, refactor code, run additional tests, and learn new APIs. |
| Minor release | Contains new smaller features. Minor releases are fully backward-compatible; no developer assistance is expected during update, but you can optionally modify your applications and libraries to begin using new APIs, features, and capabilities that were added in the release. We update peer dependencies in minor versions by expanding the supported versions, but we do not require projects to update these dependencies. |
| Patch release | Low risk, bug fix release. No developer assistance is expected during update. |

<div class="alert is-helpful">

**NOTE**: <br />
As of Angular version 7, the major versions of Angular core and the CLI are aligned.
This means that in order to use the CLI as you develop an Angular app, the version of `@angular/core` and the CLI need to be the same.

</div>

<a id="updating"></a>

### Supported update paths

### 所支持的升级路径

You can `ng update` to any version of Angular, provided that the following criteria are met:

你可以 `ng update` 到任何版本的 Angular，前提是满足以下条件：

* The version you want to update *to* is supported.

  CLI 支持你要更新*到*的版本。

* The version you want to update *from* is within one major version of the version you want to
  upgrade to.

  你要更新“自”的版本是受支持的主要版本之一。

For example, you can update from version 11 to version 12, provided that version 12 is still supported.
If you want to update across multiple major versions, perform each update one major version at a time.
For example, to update from version 10 to version 12:

例如，你可以从版本 11 更新到版本 12，前提是版本 12 仍受支持。如果要跨多个主要版本进行更新，请每次更新一个主要版本。例如，要从版本 10 更新到版本 12 时：

1. Update from version 10 to version 11.

   从版本 10 更新到版本 11。

1. Update from version 11 to version 12.

   从版本 11 更新到版本 12。

See [Keeping Up-to-Date](guide/updating "Updating your projects") for more information about updating your Angular projects to the most recent version.

参阅[保持更新](guide/updating "Updating your projects")以了解把 Angular 项目升级到最新版本的更多信息。

<a id="previews"></a>

### Preview releases

### 预览发布

We let you preview what's coming by providing "Next" and Release Candidates (`rc`) pre-releases for each major and minor release:

我们还会通过提供 Next 版和 RC（候选发布）版来让你预览每个即将到来的大版本和小版本。

| Pre-release type | Details |
| :--------------- | :------ |
| Pre-release type | 详情 |
| Next | The release that is under active development and testing. The next release is indicated by a release tag appended with the `-next` identifier, such as  `8.1.0-next.0`. |
| Release candidate | A release that is feature complete and in final testing. A release candidate is indicated by a release tag appended with the `-rc` identifier, such as version `8.1.0-rc.0`. |

The latest `next` or `rc` pre-release version of the documentation is available at [next.angular.io](https://next.angular.io).

`next` 或 `rc` 预发布版的文档位于 [next.angular.io](https://next.angular.io)。

<a id="frequency"></a>

## Release frequency

## 发布频率

We work toward a regular schedule of releases, so that you can plan and coordinate your updates with the continuing evolution of Angular.

我们会定期发布新版本，以便随着 Angular 的不断演进，你可以提前计划并协调这些升级工作。

<div class="alert is-helpful">

Dates are offered as general guidance and are subject to change.

这些日期仅供一般性参考，如有更改，恕不另行通知。

</div>

In general, expect the following release cycle:

通常的发布周期如下：

* A major release every 6 months

  每 6 个月一个主版本

* 1-3 minor releases for each major release

  每个主版本中包含 1~3 个小版本

* A patch release and pre-release (`next` or `rc`) build almost every week

  差不多每周一个发行版或预发行版(`next` 或 `rc`)的补丁版本

This cadence of releases gives eager developers access to new features as soon as they are fully developed and pass through our code review and integration testing processes, while maintaining the stability and reliability of the platform for production users that prefer to receive features after they have been validated by Google and other developers that use the pre-release builds.

这种发布的节奏能让渴望新功能的开发者在这些功能开发开发完成并通过我们的代码审查和集成测试流程后立即就可以使用，同时为那些喜欢在新功能经过 Google 和其他使用预发布版本的开发人员的验证后才采纳的生产环境用户，保持平台的稳定性和可靠性。

<a id="lts"></a>
<a id="support"></a>

## Support policy and schedule

## 支持策略与计划

<div class="alert is-helpful">

Dates are offered as general guidance and are subject to change.

这些日期仅供一般性参考，如有更改，恕不另行通知。

</div>

All major releases are typically supported for 18 months.

所有主版本的典型支持周期都是 18 个月。

| Support stage | Support Timing | Details |
| :------------ | :------------- | :------ |
| Support stage | Support Timing | 详情 |
| Active | 6 months | Regularly-scheduled updates and patches are released |
| 活跃 | 6 months | Regularly-scheduled updates and patches are released |
| Long-term (LTS) | 12 months | Only [critical fixes and security patches](#lts-fixes) are released |

The following table provides the status for Angular versions under support.

下表中提供了目前受支持的 Angular 版本的状态。

| Version | Status | Released | Active ends | LTS ends |
| :------ | :----- | :------- | :---------- | :------- |
| 版本 | 状态 | 发布 | 停止活动【模糊翻译】 | LTS 结束【模糊翻译】 |
| ^14.0.0 | Active | 2022-06-02 | 2022-12-02 | 2023-12-02 |
| ^14.0.0 | 活跃 | 2022-06-02 | 2022-12-02 | 2023-12-02 |
| ^13.0.0 | Active | 2021-11-04 | 2022-06-02 | 2023-05-04 |
| ^13.0.0 | 活跃 | 2021-11-04 | 2022-06-02 | 2023-05-04 |
| ^12.0.0 | LTS | 2021-05-12 | 2021-11-12 | 2022-11-12 |

Angular versions v2 to v11 are no longer under support.

### LTS fixes

### LTS 修复

As a general rule, a fix is considered for an LTS version if it resolves one of:

作为一个通用的规则，如果解决了下列问题之一，就会考虑对 LTS 版本进行修复：

* A newly identified security vulnerability,

  一个新发现的安全漏洞。

* A regression, since the start of LTS, caused by a 3rd party change, such as a new browser version.

  LTS 发布以后，由于第三方更改引起的回归性问题，比如浏览器的新版本。

<a id="deprecation"></a>

## Deprecation practices

## 弃用策略

Sometimes "breaking changes", such as the removal of support for select APIs and features, are necessary to innovate and stay current with new best practices, changing dependencies, or changes in the (web) platform itself.

"重大变更"（比如移除特定的 API 和特性）有时候是必须的，比如创新、让最佳实践与时俱进、变更依赖关系甚至来自 Web 平台自身的变化。

To make these transitions as straightforward as possible, we make these commitments to you:

要让这些转变尽可能的简单，我们会给你下列保证：

* We work hard to minimize the number of breaking changes and to provide migration tools when possible

  我们会尽量减少重大变更的数量，并尽可能提供迁移工具。

* We follow the deprecation policy described here, so you have time to update your applications to the latest APIs and best practices

  我们会遵循这里所讲的弃用策略，让你有时间把应用升级到最新的 API 和最佳实践。

To help ensure that you have sufficient time and a clear path to update, this is our deprecation policy:

为了保证你能有充足的时间和清晰的路径进行升级，我们制定了如下弃用策略：

| Deprecation stages | Details |
| :----------------- | :------ |
| Deprecation stages | 详情 |
| Announcement | We announce deprecated APIs and features in the [change log](https://github.com/angular/angular/blob/main/CHANGELOG.md "Angular change log"). Deprecated APIs appear in the [documentation](api?status=deprecated) with ~~strikethrough~~. When we announce a deprecation, we also announce a recommended update path. For convenience, [Deprecations](guide/deprecations) contains a summary of deprecated APIs and features. |
| Deprecation period | When an API or a feature is deprecated, it is still present in the next two major releases. After that, deprecated APIs and features are candidates for removal. A deprecation can be announced in any release, but the removal of a deprecated API or feature happens only in major release. Until a deprecated API or feature is removed, it is maintained according to the LTS support policy, meaning that only critical and security issues are fixed. |
| npm dependencies | We only make npm dependency updates that require changes to your applications in a major release. In minor releases, we update peer dependencies by expanding the supported versions, but we do not require projects to update these dependencies until a future major version. This means that during minor Angular releases, npm dependency updates within Angular applications and libraries are optional. |

<a id="public-api"></a>

## Public API surface

## 公共 API

Angular is a collection of many packages, sub-projects, and tools.
To prevent accidental use of private APIs and so that you can clearly understand what is covered by the practices described here — we document what is and is not considered our public API surface.
For details, see [Supported Public API Surface of Angular](https://github.com/angular/angular/blob/main/docs/PUBLIC_API.md "Supported Public API Surface of Angular").

Any changes to the public API surface are done using the versioning, support, and depreciation policies previously described.

任何对公共 API 的修改都适用于上述这些版本、支持和弃用策略。

<a id="developer-preview"></a>

## Developer Preview

Occasionally we introduce new APIs under the label of "Developer Preview". These are APIs that are fully functional and polished, but that we are not ready to stabilize under our normal deprecation policy.

This may be because we want to gather feedback from real applications before stabilization, or because the associated documentation or migration tooling is not fully complete.

The policies and practices that are described in this document do not apply to APIs marked as Developer Preview. Such APIs can change at any time, even in new patch versions of the framework. Teams should decide for themselves whether the benefits of using Developer Preview APIs are worth the risk of breaking changes outside of our normal use of semantic versioning.

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
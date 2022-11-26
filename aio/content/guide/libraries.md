# Overview of Angular libraries

# Angular 库开发概述

Many applications need to solve the same general problems, such as presenting a unified user interface, presenting data, and allowing data entry.
Developers can create general solutions for particular domains that can be adapted for re-use in different applications.
Such a solution can be built as Angular *libraries* and these libraries can be published and shared as *npm packages*.

许多应用都需要解决一些同样的常见问题，比如提供统一的用户界面、渲染数据，以及允许数据输入。开发人员可以为特定的领域创建一些通用解决方案，以便在不同的应用中重复使用。像这样的解决方案就可以构建成 Angular *库*，这些库可以作为 *npm 包*进行发布和共享。

An Angular library is an Angular [project](guide/glossary#project) that differs from an application in that it cannot run on its own.
A library must be imported and used in an application.

Angular 库是一个 Angular [项目](guide/glossary#project)，它与应用的不同之处在于它本身是不能运行的。必须在某个应用中导入库并使用它。

Libraries extend Angular's base features.
For example, to add [reactive forms](guide/reactive-forms) to an application, add the library package using `ng add @angular/forms`, then import the `ReactiveFormsModule` from the `@angular/forms` library in your application code.
Similarly, adding the [service worker](guide/service-worker-intro) library to an Angular application is one of the steps for turning an application into a [Progressive Web App](https://developers.google.com/web/progressive-web-apps) (PWA).
[Angular Material](https://material.angular.io) is an example of a large, general-purpose library that provides sophisticated, reusable, and adaptable UI components.

Any application developer can use these and other libraries that have been published as npm packages by the Angular team or by third parties.
See [Using Published Libraries](guide/using-libraries).

任何一位应用开发者都可以使用这样或那样的库，它们都已经由 Angular 团队或第三方发布为 npm 包。参阅[使用已发布的库](guide/using-libraries)。

## Creating libraries

## 创建库

If you have developed features that are suitable for reuse, you can create your own libraries.
These libraries can be used locally in your workspace, or you can publish them as [npm packages](guide/npm-packages) to share with other projects or other Angular developers.
These packages can be published to the npm registry, a private npm Enterprise registry, or a private package management system that supports npm packages.
See [Creating Libraries](guide/creating-libraries).

Deciding to package features as a library is an architectural decision. It is comparable to deciding whether a feature is a component or a service, or deciding on the scope of a component.

Packaging features as a library forces the artifacts in the library to be decoupled from the application's business logic.
This can help to avoid various bad practices or architecture mistakes that can make it difficult to decouple and reuse code in the future.

Putting code into a separate library is more complex than simply putting everything in one application.
It requires more of an investment in time and thought for managing, maintaining, and updating the library.
This complexity can pay off when the library is being used in multiple applications.

<div class="alert is-helpful">

**NOTE**: <br />
Libraries are intended to be used by Angular applications.
To add Angular features to non-Angular web applications, use [Angular custom elements](guide/elements).

</div>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
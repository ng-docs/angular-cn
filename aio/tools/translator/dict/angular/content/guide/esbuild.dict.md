Getting started with the CLI's esbuild-based build system

开始使用 CLI 的基于 esbuild 的构建系统

In v16 and higher, the new build system provides a way to build Angular applications. This new build system includes:

在 v16 及更高版本中，新的构建系统提供了一种构建 Angular 应用程序的方法。这个新的构建系统包括：

A modern output format using ESM, with dynamic import expressions to support lazy module loading.

使用 ESM 的现代输出格式，带有动态导入表达式以支持延迟模块加载。

Faster build-time performance for both initial builds and incremental rebuilds.

初始构建和增量重建的构建时性能更快。

Newer JavaScript ecosystem tools such as [esbuild](https://esbuild.github.io/) and [Vite](https://vitejs.dev/).

较新的 JavaScript 生态系统工具，例如[esbuild](https://esbuild.github.io/)和[Vite](https://vitejs.dev/)。

You can opt-in to use the new builder on a per application basis with minimal configuration updates required.

你可以选择对每个应用程序单独使用新的构建器，只需最少的配置更新。

Trying the ESM build system in an Angular CLI application

在 Angular CLI 应用程序中尝试 ESM 构建系统

A new builder named `browser-esbuild` is available within the `@angular-devkit/build-angular` package that is present in an Angular CLI generated application. The build is a drop-in replacement for the existing `browser` builder that provides the current stable browser application build system.
You can try out the new build system for applications that use the `browser` builder.

`@angular-devkit/build-angular` 包中有一个名为 `browser-esbuild` 的新构建器，它存在于 Angular CLI 生成的应用程序中。该构建是现有 `browser` 构建器的直接替代品，可提供已稳定的浏览器应用程序构建系统。你可以为使用 `browser` 构建器的应用程序试用新的构建系统。

Updating the application configuration

更新应用配置

The new build system was implemented to minimize the amount of changes necessary to transition your applications. Currently, the new build system is provided via an alternate builder \(`browser-esbuild`\). You can update the `build` target for any application target to try out the new build system.

实现新的构建系统是为了最大限度地减少转换应用程序所需的更改量。目前，新的构建系统是通过备用构建器 \( `browser-esbuild` \) 提供的。你可以更新任何应用程序目标的 `build` 目标以试用新的构建系统。

The following is what you would typically find in `angular.json` for an application:

以下是你通常会在应用程序的 `angular.json` 中找到的内容：

Changing the `builder` field is the only change you will need to make.

更改 `builder` 字段就是你要进行的唯一更改。

Executing a build

执行构建

Once you have updated the application configuration, builds can be performed using the `ng build` as was previously done. For the remaining options that are currently not yet implemented in the developer preview, a warning will be issued for each and the option will be ignored during the build.

更新应用程序配置后，可以像以前一样使用 `ng build` 执行构建。对于开发者预览版中目前尚未实现的其余选项，将针对每个选项发出警告，并在构建期间忽略该选项。

Starting the development server

启动开发服务器

The development server now has the ability to automatically detect the new build system and use it to build the application. To start the development server no changes are necessary to the `dev-server` builder configuration or command line.

开发服务器现在能够自动检测新的构建系统并使用它来构建应用程序。要启动开发服务器，无需更改 `dev-server` 构建器配置或命令行。

You can continue to use the [command line options](/cli/serve) you have used in the past with the development server.

你可以继续使用以前在开发服务器上使用过的那些[命令行选项](/cli/serve)。

Unimplemented options and behavior

未实现的选项和行为

Several build options are not yet implemented but will be added in the future as the build system moves towards a stable status. If your application uses these options, you can still try out the build system without removing them. Warnings will be issued for any unimplemented options but they will otherwise be ignored. However, if your application relies on any of these options to function, you may want to wait to try.

几个构建选项尚未实现，但将在构建系统走向稳定状态时添加进去。如果你的应用程序使用这些选项，你仍然可以在不删除它们的情况下试用构建系统。将为任何未实现的选项发出警告，并在构建时忽略它们。但是，如果你的应用程序依赖于这些选项中的任何一个来运行，你可能需要等等才能尝试。

[Bundle budgets](https://github.com/angular/angular-cli/issues/25100) \(`budgets`\)

[打包预算](https://github.com/angular/angular-cli/issues/25100)（ `budgets` ）

[Localization](https://github.com/angular/angular-cli/issues/25099) \(`localize`/`i18nDuplicateTranslation`/`i18nMissingTranslation`\)

[本地化](https://github.com/angular/angular-cli/issues/25099)（ `localize` / `i18nDuplicateTranslation` / `i18nMissingTranslation` ）

[Web workers](https://github.com/angular/angular-cli/issues/25101) \(`webWorkerTsConfig`\)



[WASM imports](https://github.com/angular/angular-cli/issues/25102) -- WASM can still be loaded manually via [standard web APIs](https://developer.mozilla.org/en-US/docs/WebAssembly/Loading_and_running).

[WASM 导入](https://github.com/angular/angular-cli/issues/25102) —— WASM 仍然可以通过[标准的网络 API](https://developer.mozilla.org/en-US/docs/WebAssembly/Loading_and_running)手动加载。

Building libraries with the new build system via `ng-packagr` is also not yet possible but library build support will be available in a future release.

通过 `ng-packagr` 使用新的构建系统来构建库目前也不可能，但对构建库的支持将在未来的版本中提供。

ESM default imports vs. namespace imports

ESM 默认导入与命名空间导入

TypeScript by default allows default exports to be imported as namespace imports and then used in call expressions. This is unfortunately a divergence from the ECMAScript specification. The underlying bundler \(`esbuild`\) within the new build system expects ESM code that conforms to the specification. The build system will now generate a warning if your application uses an incorrect type of import of a package. However, to allow TypeScript to accept the correct usage, a TypeScript option must be enabled within the application's `tsconfig` file. When enabled, the [`esModuleInterop`](https://www.typescriptlang.org/tsconfig#esModuleInterop) option provides better alignment with the ECMAScript specification and is also recommended by the TypeScript team. Once enabled, you can update package imports where applicable to an ECMAScript conformant form.

默认情况下，TypeScript 允许将默认导出作为命名空间导入，然后在调用表达式中使用。不幸的是，这与 ECMAScript 规范不同。新构建系统中的底层捆绑器 \( `esbuild` \) 需要符合规范的 ESM 代码。如果你的应用程序使用不正确的包导入类型，构建系统现在将生成警告。但是，为了让 TypeScript 接受正确的用法，必须在应用程序的 `tsconfig` 文件中启用 TypeScript 选项。启用后，[`esModuleInterop`](https://www.typescriptlang.org/tsconfig#esModuleInterop)选项可以更好地与 ECMAScript 规范保持一致，并且也被 TypeScript 团队推荐。启用后，你可以在适用于 ECMAScript 兼容形式的情况下更新包的导入代码。

Using the [`moment`](https://npmjs.com/package/moment) package as an example, the following application code will cause runtime errors:

以 [`moment`](https://npmjs.com/package/moment) 包为例，以下应用代码会导致运行时错误：

The build will generate a warning to notify you that there is a potential problem. The warning will be similar to:

构建时将生成警告，通知你存在潜在问题。警告将类似于：

However, you can avoid the runtime errors and the warning by enabling the `esModuleInterop` TypeScript option for the application and changing the import to the following:

但是，你可以通过为应用程序启用 `esModuleInterop` TypeScript 选项并将导入更改为以下内容来避免运行时错误和警告：

Vite as a development server

Vite 作为开发服务器

The usage of Vite in the Angular CLI is currently only within a _development server capacity only_. Even without using the underlying Vite build system, Vite provides a full-featured development server with client side support that has been bundled into a low dependency npm package. This makes it an ideal candidate to provide comprehensive development server functionality. The current development server process uses the new build system to generate a development build of the application in memory and passes the results to Vite to serve the application. The usage of Vite, much like the Webpack-based development server, is encapsulated within the Angular CLI `dev-server` builder and currently cannot be directly configured.

Angular CLI 中 Vite 目前仅仅用在**开发服务器范围**内。即使不使用底层的 Vite 构建系统，Vite 也提供了一个功能齐全的开发服务器和客户端支持，该服务器已被捆绑到一个低依赖性 npm 包中。这让它成为提供综合开发服务器功能的理想选择。当前的开发服务器进程使用新构建系统在内存中生成应用程序的开发构建，并将结果传递给 Vite 为应用程序提供服务。Vite 的使用很像基于 Webpack 的开发服务器，封装在 Angular CLI `dev-server` builder 中，目前无法直接配置。

Known Issues

已知的问题

There are currently several known issues that you may encounter when trying the new build system. This list will be updated to stay current. If any of these issues are currently blocking you from trying out the new build system, please check back in the future as it may have been solved.

当前，你在尝试新构建系统时可能会遇到几个已知问题。此列表将更新以保持最新。如果这些问题中的任何一个正在阻止你尝试新的构建系统，请稍后再回来查看，那时候它可能已经解决了。

Runtime-evaluated dynamic import expressions

运行时计算的动态导入表达式

Dynamic import expressions that do not contain static values will be kept in their original form and not processed at build time. This is a limitation of the underlying bundler but is [planned](https://github.com/evanw/esbuild/pull/2508) to be implemented in the future. In many cases, application code can be made to work by changing the import expressions into static strings with some form of conditional statement such as an `if` or `switch` for the known potential files.

不包含静态值的动态导入表达式将保留其原始形式，不会在构建时处理。这是底层捆绑器的限制，但[计划](https://github.com/evanw/esbuild/pull/2508)在未来实现。在许多情况下，可以通过使用某种形式的条件语句（例如已知潜在文件的 `if` 或 `switch` 将导入表达式更改为静态字符串来让应用程序代码正常工作。

Unsupported:

不支持：

Supported:

支持：

Order-dependent side-effectful imports in lazy modules

惰性模块中依赖于顺序的副作用导入

Import statements that are dependent on a specific ordering and are also used in multiple lazy modules can cause top-level statements to be executed out of order.
This is not common as it depends on the usage of side-effectful modules and does not apply to the `polyfills` option.
This is caused by a [defect](https://github.com/evanw/esbuild/issues/399) in the underlying bundler but will be addressed in a future update.

依赖于特定顺序并且也在多个惰性模块中使用的 import 语句会导致顶级语句乱序执行。这并不常见，因为它取决于有副作用模块的使用，并且不适用于 `polyfills` 选项。这是由底层捆绑器中的[缺陷](https://github.com/evanw/esbuild/issues/399)引起的，但将在未来的更新中解决。

Hashed filenames for non-injected global styles/scripts

非注入全局样式/脚本的哈希文件名

If your application currently uses the [`inject`](guide/workspace-config#styles-and-scripts-configuration) sub-option for any global styles and scripts via the `styles` or `scripts` build options, the output file names for those styles/scripts will incorrectly contain a hash. Depending on the usage of the output files, this may cause runtime failures for your application. See the related [issue](https://github.com/angular/angular-cli/issues/25098) for more information.

如果你的应用程序当前通过 `styles` 或 `scripts` 构建选项对任何全局样式和脚本使用 [`inject`](guide/workspace-config#styles-and-scripts-configuration) 子选项，则这些样式/脚本的输出文件名将错误地包含哈希。根据输出文件的用途，这可能会导致你的应用程序运行时失败。有关详细信息，请参阅相关[问题](https://github.com/angular/angular-cli/issues/25098)。

Bug reports

错误报告

Report issues and feature requests on [GitHub](https://github.com/angular/angular-cli/issues).

在 [GitHub](https://github.com/angular/angular-cli/issues) 上报告问题和功能请求。

Please provide a minimal reproduction where possible to aid the team in addressing issues.

请尽可能提供最小化的重现工程，以帮助团队解决问题。
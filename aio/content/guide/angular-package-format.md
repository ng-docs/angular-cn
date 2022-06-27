# Angular Package Format

# Angular 包格式

This document describes the Angular Package Format (APF).
APF is an Angular specific specification for the structure and format of npm packages that is used by all first-party Angular packages (`@angular/core`, `@angular/material`, etc.) and most third-party Angular libraries.

本文档描述了 Angular 包格式 (APF)。 APF 是针对 npm 包结构和格式的 Angular 专用规范，所有第一方 Angular 包（ `@angular/core` 、 `@angular/material` 等）和大多数第三方 Angular 库都使用了该规范。

APF enables a package to work seamlessly under most common scenarios that use Angular.
Packages that use APF are compatible with the tooling offered by the Angular team as well as wider JavaScript ecosystem.
It is recommended that third-party library developers follow the same npm package format.

APF 能让包在使用 Angular 的大多数常见场景下无缝工作。使用 APF 的包与 Angular 团队提供的工具以及更广泛的 JavaScript 生态系统兼容。建议第三方库开发者也都遵循这种格式。

<div class="alert is-helpful">

APF is versioned along with the rest of Angular, and every major version improves the package format.
You can find the versions of the specification prior to v13 in this [google doc](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview).

APF 与 Angular 的其余部分一起进行版本控制，每个主要版本都改进了包格式。你可以在此 [google doc](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview) 中找到 v13 之前版本的规范。

</div>

## Why specify a package format?

## 为什么要指定包格式？

In today's JavaScript landscape, developers will consume packages in many different ways, using many different toolchains (Webpack, rollup, esbuild, etc.).
These tools may understand and require different inputs - some tools may be able to process the latest ES language version, while others may benefit from directly consuming an older ES version.

在当今的 JavaScript 环境中，开发人员将使用多种不同的工具链（Webpack、rollup、esbuild 等）以多种不同的方式使用包。这些工具可能理解并需要不同的输入 —— 一些工具能处理最新的 ES 语言版本，而其他工具也许要直接使用较旧的 ES 版本。

The Angular distribution format supports all of the commonly used development tools and workflows, and adds emphasis on optimizations that result either in smaller application payload size or faster development iteration cycle (build time).

这种 Angular 分发格式支持所有常用的开发工具和工作流，并着重于优化，从而缩小应用程序有效负载大小或缩短开发迭代周期（构建时间）。

Developers can rely on Angular CLI and [ng-packagr](https://github.com/ng-packagr/ng-packagr) (a build tool Angular CLI uses) to produce packages in the Angular package format.
See the [Creating Libraries](guide/creating-libraries) guide for more details.

开发人员可以依靠 Angular CLI 和 [ng-packagr](https://github.com/ng-packagr/ng-packagr) （Angular CLI 使用的构建工具）来生成 APF 格式的包。有关更多详细信息，参阅[创建库](guide/creating-libraries)指南。

## File layout

## 文件布局

The following example shows a simplified version of the `@angular/core` package's file layout, with an explanation for each file in the package.

以下示例显示了 `@angular/core` 包文件布局的简化版本，并附有对包中每个文件的解释。

<div class='filetree'>
    <div class='file'>
      node_modules/@angular/core
    </div>
    <div class='children'>
        <div class='file'>
          README.md &nbsp; <!-- // &lt;-- Package README, used by npmjs web UI. -->
        </div>
        <div class='file'>
          package.json &nbsp; <!-- // &lt;-- Primary package.json, describing the package itself as well as all available entrypoints and code formats. This file contains the "exports" mapping used by runtimes and tools to perform module resolution. -->
        </div>
        <div class='file'>
          index.d.ts &nbsp; <!-- // &lt;-- Bundled .d.ts for the primary entrypoint &commat;angular/core. -->
        </div>
        <div class='file'>
          esm2020 &nbsp; <!-- // &lt;-- Tree of &commat;angular/core sources in unflattened ES2020 format. -->
        </div>
        <div class='children'>
            <div class='file'>
              core.mjs
            </div>
            <div class='file'>
              index.mjs
            </div>
            <div class='file'>
              public_api.mjs
            </div>
            <div class='file'>
              testing &nbsp; <!-- // &lt;-- Tree of the &commat;angular/core/testing entrypoint in unflattened ES2020 format. -->
            </div>
        </div>
        <div class='file'>
          fesm2015 &nbsp; <!-- // &lt;-- Code for all entrypoints in a flattened \(FESM\) ES2015 format, along with sourcemaps. -->
        </div>
        <div class='children'>
            <div class='file'>
              core.mjs
            </div>
            <div class='file'>
              core.mjs.map
            </div>
            <div class='file'>
              testing.mjs
            </div>
            <div class='file'>
              testing.mjs.map
            </div>
        </div>
        <div class='file'>
          fesm2020 &nbsp; <!-- // &lt;-- Code for all entrypoints in flattened \(FESM\) ES2020 format, along with sourcemaps. -->
        </div>
        <div class='children'>
            <div class='file'>
              core.mjs
            </div>
            <div class='file'>
              core.mjs.map
            </div>
            <div class='file'>
              testing.mjs
            </div>
            <div class='file'>
              testing.mjs.map
            </div>
        </div>
        <div class='file'>
          testing &nbsp; <!-- // &lt;-- Directory representing the "testing" entrypoint. -->
        </div>
        <div class='children'>
            <div class='file'>
              index.d.ts &nbsp; <!-- // &lt;-- Bundled .d.ts for the &commat;angular/core/testing entrypoint. -->
            </div>
        </div>
    </div>
</div>

This table describes the file layout under `node_modules/@angular/core` annotated to describe the purpose of files and directories:

此表描述了 `node_modules/@angular/core` 下的文件布局，注释为描述文件和目录的用途：

| Files | Purpose |
| :---- | :------ |
| 文件 | 用途 |
| `README.md` | Package README, used by npmjs web UI. |
| `README.md` | 包 README，由 npmjs web UI 使用。 |
| `package.json` | Primary `package.json`, describing the package itself as well as all available entrypoints and code formats. This file contains the "exports" mapping used by runtimes and tools to perform module resolution. |
| `package.json` | 主要的 `package.json` ，描述包本身以及所有可用的入口点和代码格式。此文件包含供运行时使用的 `"exports"` 映射和一些用于执行模块解析的工具。 |
| `index.d.ts` | Bundled `.d.ts` for the primary entrypoint `@angular/core`. |
| `index.d.ts` | 主入口点 `@angular/core` 捆绑的 `.d.ts` 。 |
| `esm2020/` <br /> &nbsp;&nbsp;─ `core.mjs` <br /> &nbsp;&nbsp;─ `index.mjs` <br /> &nbsp;&nbsp;─ `public_api.mjs` | Tree of `@angular/core` sources in unflattened ES2020 format. |
| `esm2020/`<br />─ `core.mjs`<br />── `index.mjs`<br />── `public_api.mjs` | 未展平的 ES2020 格式的 `@angular/core` 源代码树。 |
| `esm2020/testing/` | Tree of the `@angular/core/testing` entrypoint in unflattened ES2020 format. |
| `esm2020/testing/` | 未扁平化的 ES2020 格式的 `@angular/core/testing` 入口点的树。 |
| `fesm2015/` <br /> &nbsp;&nbsp;─ `core.mjs` <br /> &nbsp;&nbsp;─ `core.mjs.map` <br /> &nbsp;&nbsp;─ `testing.mjs` <br /> &nbsp;&nbsp;─ `testing.mjs.map` | Code for all entrypoints in a flattened (FESM) ES2015 format, along with sourcemaps. |
| `fesm2015/` <br /> &nbsp;&nbsp;─ `core.mjs` <br /> &nbsp;&nbsp;─ `core.mjs.map` <br /> &nbsp;&nbsp;─ `testing.mjs` <br /> &nbsp;&nbsp;─ `testing.mjs.map` | 扁平化 (FESM) ES2015 格式的所有入口点的代码，以及源码映射。 |
| `fesm2020/` <br /> &nbsp;&nbsp;─ `core.mjs` <br /> &nbsp;&nbsp;─ `core.mjs.map` <br /> &nbsp;&nbsp;─ `testing.mjs` <br /> &nbsp;&nbsp;─ `testing.mjs.map` | Code for all entrypoints in flattened (FESM) ES2020 format, along with sourcemaps. |
| `fesm2020/` <br /> &nbsp;&nbsp;─ `core.mjs` <br /> &nbsp;&nbsp;─ `core.mjs.map` <br /> &nbsp;&nbsp;─ `testing.mjs` <br /> &nbsp;&nbsp;─ `testing.mjs.map` | 扁平化 (FESM) ES2020 格式的所有入口点的代码，以及源码映射。 |
| `testing/` | Directory representing the "testing" entrypoint. |
| `testing/` | 代表 `testing` 入口点的目录。 |
| `testing/index.d.ts` | Bundled `.d.ts` for the `@angular/core/testing` entrypoint. |
| `testing/index.d.ts` | 为 `@angular/core/testing` 入口点打包的 `.d.ts` 。 |

## `package.json`

The primary `package.json` contains important package metadata, including the following:

主 `package.json` 包含重要的包元数据，包括以下内容：

* It [declares](#esm-declaration) the package to be in EcmaScript Module (ESM) format

  它把此包[声明](#esm-declaration)为 EcmaScript 模块 (ESM) 格式

* It contains an [`"exports"` field](#exports) which defines the available source code formats of all entrypoints

  它包含一个 [`"exports"` 字段](#exports)，用于定义所有入口点的可用源码格式

* It contains [keys](#legacy-resolution-keys) which define the available source code formats of the primary `@angular/core` entrypoint, for tools which do not understand `"exports"`.
  These keys are considered deprecated, and will be removed as the support for `"exports"` rolls out across the ecosystem.

  它包含定义主入口点 `@angular/core` 的可用源代码格式的 [key](#legacy-resolution-keys)，供不理解 `"exports"` 的工具使用。这些键已弃用，随着对 `"exports"` 的支持在整个生态系统中逐步退出，这些键将被删除。

* It declares whether the package contains [side-effects](#side-effects)

  它声明此包是否包含[副作用](#side-effects)

### ESM declaration

### ESM 声明

The top-level `package.json` contains the key:

顶级 `package.json` 包含此键：

<code-example language="javascript">

{
  "type": "module"
}

</code-example>

This informs resolvers that code within the package is using EcmaScript Modules as opposed to CommonJS modules.

这会通知解析器，此包中的代码正在使用 EcmaScript 模块而不是 CommonJS 模块。

### `"exports"`

The `"exports"` field has the following structure:

`"exports"` 字段具有以下结构：

<code-example language="javascript">

"exports": {
  "./schematics/*": {
    "default": "./schematics/*.js"
  },
  "./package.json": {
    "default": "./package.json"
  },
  ".": {
    "types": "./core.d.ts",
    "esm2020": "./esm2020/core.mjs",
    "es2020": "./fesm2020/core.mjs",
    "es2015": "./fesm2015/core.mjs",
    "node": "./fesm2015/core.mjs",
    "default": "./fesm2020/core.mjs"
  },
  "./testing": {
    "types": "./testing/testing.d.ts",
    "esm2020": "./esm2020/testing/testing.mjs",
    "es2020": "./fesm2020/testing.mjs",
    "es2015": "./fesm2015/testing.mjs",
    "node": "./fesm2015/testing.mjs",
    "default": "./fesm2020/testing.mjs"
  }
}

</code-example>

Of primary interest are the `"."` and the `"./testing"` keys, which define the available code formats for the `@angular/core` primary entrypoint and the `@angular/core/testing` secondary entrypoint, respectively.
For each entrypoint, the available formats are:

主要看 `"."` 和 `"./testing"` 这两个键，它们分别定义了 `@angular/core` 主要入口点和 `@angular/core/testing` 次要入口点的可用代码格式。对于每个入口点，可用的格式为：

| Formats | Details |
| :------ | :------ |
| 格式 | 详情 |
| Typings (`.d.ts` files) | `.d.ts` files are used by TypeScript when depending on a given package. |
| 类型定义（ `.d.ts` 文件） | TypeScript 在依赖于给定包时使用 `.d.ts` 文件。 |
| `es2020` | ES2020 code flattened into a single source file. |
| `es2020` | 已展平为单个源文件的 ES2020 代码。 |
| `es2015` | ES2015 code flattened into a single source file. |
| `es2015` | 已展平为单个源文件的 ES2015 代码。 |
| `esm2020` | ES2020 code in unflattened source files (this format is included for experimentation - see [this discussion of defaults](#note-about-the-defaults-in-packagejson) for details). |
| `esm2020` | 未展平的源文件中的 ES2020 代码（包含此格式用于试验 - 有关详细信息，参阅[此默认值讨论](#note-about-the-defaults-in-packagejson)）。 |

Tooling that is aware of these keys may preferentially select a desirable code format from `"exports"`.
The remaining 2 keys control the default behavior of tooling:

认识这些键的工具可以优先从 `"exports"` 中选择所需的代码格式。其余 2 个键控制工具的默认行为：

* `"node"` selects flattened ES2015 code when the package is loaded in Node.

  `"node"` 在 Node.js 中加载包时选择扁平化的 ES2015 代码。

  This format is used due to the requirements of `zone.js`, which does not support native `async`/`await` ES2017 syntax.
  Therefore, Node is instructed to use ES2015 code, where `async`/`await` structures have been downleveled into Promises.

  使用这种格式是由于 `zone.js` 的要求，因为它不支持原生的 `async` / `await` ES2017 语法。因此，指示 Node 使用 ES2015 代码，其中 `async` / `await` 结构已降级为 Promises。

* `"default"` selects flattened ES2020 code for all other consumers.

  `"default"` 为所有其他消费者选择扁平化的 ES2020 代码。

Libraries may want to expose additional static files which are not captured by the exports of the JavaScript-based entry-points such as Sass mixins or pre-compiled CSS.

库可能希望公开其他静态文件，这些文件没有被基于 JavaScript 的入口点（比如 Sass mixins 或预编译的 CSS）的导出所捕获。

For more information, see [Managing assets in a library](guide/creating-libraries#managing-assets-in-a-library).

有关更多信息，参阅[管理库中的资产](guide/creating-libraries#managing-assets-in-a-library)。

### Legacy resolution keys

### 旧版解析键

In addition to `"exports"`, the top-level `package.json` also defines legacy module resolution keys for resolvers that don't support `"exports"`.
For `@angular/core` these are:

除了 `"exports"` 之外，顶级 `package.json` 还为不支持 `"exports"` 的解析器定义了旧模块解析键。对于 `@angular/core` ，这些是：

<code-example language="javascript">

{
  "fesm2020": "./fesm2020/core.mjs",
  "fesm2015": "./fesm2015/core.mjs",
  "esm2020": "./esm2020/core.mjs",
  "typings": "./core.d.ts",
  "module": "./fesm2015/core.mjs",
  "es2020": "./fesm2020/core.mjs",
}

</code-example>

As above, a module resolver can use these keys to load a specific code format.

如上，模块解析器可以用这些键来加载特定的代码格式。

<div class="alert is-helpful">

**NOTE**: <br />
Instead of `"default"`, `"module"` selects the format both for Node as well as any tooling not configured to use a specific key.
As with `"node"`, ES2015 code is selected due to the constraints of ZoneJS.

**注意**：<br />
与 `"default"` 不同，`"module"` 是为 Node 以及任何未配置为使用特定键的工具选择的格式。它基本和 `"node"` 一样，但由于 ZoneJS 的限制，选择了 ES2015 代码。

</div>

### Side effects

### 副作用

The last function of `package.json` is to declare whether the package has [side-effects](#sideeffects-flag).

`package.json` 的最后一个功能是声明此包是否有[副作用](#sideeffects-flag)。

<code-example language="javascript">

{
  "sideEffects": false
}

</code-example>

Most Angular packages should not depend on top-level side effects, and thus should include this declaration.

大多数 Angular 包不应该依赖于顶级副作用，因此应该包含这个声明。

## Entrypoints and Code Splitting

## 入口点和代码拆分

Packages in the Angular Package Format contain one primary entrypoint and zero or more secondary entrypoints (for example, `@angular/common/http`).
Entrypoints serve several functions.

APF 中的包，包含一个主要入口点和零到多个次要入口点（比如 `@angular/common/http` ）。入口点有多种功能。

1. They define the module specifiers from which users import code (for example, `@angular/core` and `@angular/core/testing`).

   它们定义了用户要从中导入代码的模块说明符（比如， `@angular/core` 和 `@angular/core/testing` ）。

   Users typically perceive these entrypoints as distinct groups of symbols, with different purposes or functionality.

   用户通常将这些入口点视为具有不同用途或功能的不同符号组。

   Specific entrypoints might only be used for special purposes, such as testing.
   Such APIs can be separated out from the primary entrypoint to reduce the chance of them being used accidentally or incorrectly.

   特定入口点可能仅用于特殊目的，比如测试。此类 API 可以与主入口点分离，以减少它们被意外或错误使用的机会。

1. They define the granularity at which code can be lazily loaded.

   它们定义了可以惰性加载代码的粒度。

   Many modern build tools are only capable of "code splitting" (aka lazy loading) at the ES Module level.
   Since the Angular Package Format uses primarily a single "flat" ES Module per entrypoint, this means that most build tooling will not be able to split code in a single entrypoint into multiple output chunks.

   许多现代构建工具只能在 ES 模块级别进行“代码拆分”（又名惰性加载）。由于 APF 主要为每个入口点使用一个“扁平” ES 模块，这意味着大多数构建工具无法将单个入口点中的代码拆分为多个输出块。

The general rule for APF packages is to use entrypoints for the smallest sets of logically connected code possible.
For example, the Angular Material package publishes each logical component or set of components as a separate entrypoint - one for Button, one for Tabs, etc.
This allows each Material component to be lazily loaded separately, if desired.

APF 包的一般规则是为尽可能小的逻辑相关代码集使用入口点。比如，Angular Material 包将每个逻辑组件或一组组件作为单独的入口点发布 - 一个用于按钮，一个用于选项卡等。如果需要，这允许单独惰性加载每个 Material 组件。

Not all libraries require such granularity.
Most libraries with a single logical purpose should be published as a single entrypoint.
`@angular/core` for example uses a single entrypoint for the runtime, because the Angular runtime is generally used as a single entity.

并非所有库都需要这样的粒度。大多数具有单一逻辑目的的库应该作为单一入口点发布。比如 `@angular/core` 为运行时使用单个入口点，因为 Angular 运行时通常用作单个实体。

### Resolution of Secondary Entrypoints

### 次要入口点的解析

Secondary entrypoints can be resolved via the `"exports"` field of the `package.json` for the package.

可以通过包的 `package.json` 的 `"exports"` 字段解析辅助入口点。

## README.md

## 自述文件

The readme file in the markdown format that is used to display description of a package on npm and github.

markdown 格式的自述文件，用于在 npm 和 github 上显示包的描述。

Example readme content of `@angular/core` package:

`@angular/core` 包的示例自述内容：

<code-example language="html">

Angular
=======

The sources for this package are in the main [Angular](https://github.com/angular/angular) repo.Please file issues and pull requests against that repo.

License: MIT

</code-example>

## Partial Compilation

## 部分编译

Libraries in the Angular Package Format must be published in "partial compilation" mode.
This is a compilation mode for `ngc` which produces compiled Angular code that is not tied to a specific Angular runtime version, in contrast to the full compilation used for applications, where the Angular compiler and runtime versions must match exactly.

APF 格式的库必须以“部分编译”模式发布。这是 `ngc` 的一种编译模式，它生成不依赖于特定 Angular 运行时版本的已编译 Angular 代码，与用于应用程序的完整编译形成对比，其中 Angular 编译器和运行时版本必须完全匹配。

To partially compile Angular code, use the `"compilationMode"` flag in `"angularCompilerOptions"` in your `tsconfig.json`:

要部分编译 Angular 代码，请在 `tsconfig.json` 中的 `"angularCompilerOptions"` 中使用 `"compilationMode"` 标志：

<code-example language="javascript">
{
  &hellip;
  "angularCompilerOptions": {
    "compilationMode": "partial",
  }
}
</code-example>

Partially compiled library code is then converted to fully compiled code during the application build process by the Angular CLI.

然后，在应用程序构建过程中，Angular CLI 将部分编译的库代码转换为完全编译的代码。

If your build pipeline does not use the Angular CLI then refer to the [Consuming partial ivy code outside the Angular CLI](guide/creating-libraries#consuming-partial-ivy-code-outside-the-angular-cli) guide.

如果你的构建管道不使用 Angular CLI，参阅[在 Angular CLI 之外使用部分编译的 Ivy 代码](guide/creating-libraries#consuming-partial-ivy-code-outside-the-angular-cli)指南。

## Optimizations

## 优化

### Flattening of ES Modules

### ES 模块的扁平化

The Angular Package Format specifies that code be published in "flattened" ES module format.
This significantly reduces the build time of Angular applications as well as download and parse time of the final application bundle.
Please check out the excellent post ["The cost of small modules"](https://nolanlawson.com/2016/08/15/the-cost-of-small-modules) by Nolan Lawson.

APF 指定代码要以“扁平化”的 ES 模块格式发布。这显著减少了 Angular 应用程序的构建时间以及最终应用程序包的下载和解析时间。请查看 Nolan Lawson 发表的优秀文章[“小模块的成本”](https://nolanlawson.com/2016/08/15/the-cost-of-small-modules) 。

The Angular compiler has support for generating index ES module files that can then be used to generate flattened modules using tools like Rollup, resulting in a file format we call Flattened ES Module or FESM.

Angular 编译器支持生成索引 ES 模块文件，然后可以让这些文件借助 Rollup 等工具生成扁平化模块，从而生成我们称为扁平化 ES 模块或 FESM 的文件格式。

FESM is a file format created by flattening all ES Modules accessible from an entrypoint into a single ES Module.
It's formed by following all imports from a package and copying that code into a single file while preserving all public ES exports and removing all private imports.

FESM 是一种文件格式，它会将所有可从入口点访问的 ES 模块扁平化为单个 ES 模块。它是通过跟踪包中的所有导入并将该代码复制到单个文件中而生成的，同时保留所有公共 ES 导出并删除所有私有导入。

The shortened name "FESM" (pronounced "phesom") can have a number after it such as "FESM5" or "FESM2015".
The number refers to the language level of the JavaScript inside the module.
So a FESM5 file would be ESM+ES5 (import/export statements and ES5 source code).

缩写名称“FESM”（发音为“phesom”）后面可以有一个数字，比如“FESM5”或“FESM2015”。数字是指模块内 JavaScript 的语言级别。所以 FESM5 文件将是 ESM+ES5（导入/导出语句和 ES5 源代码）。

To generate a flattened ES Module index file, use the following configuration options in your tsconfig.json file:

要生成扁平化的 ES 模块索引文件，请在 tsconfig.json 文件中使用以下配置选项：

<code-example language="javascript">

{
  "compilerOptions": {
    &hellip;
    "module": "esnext",
    "target": "es2020",
    &hellip;
  },
  "angularCompilerOptions": {
    &hellip;
    "flatModuleOutFile": "my-ui-lib.js",
    "flatModuleId": "my-ui-lib"
  }
}

</code-example>

Once the index file (for example, `my-ui-lib.js`) is generated by ngc, bundlers and optimizers like Rollup can be used to produce the flattened ESM file.

一旦索引文件（比如 `my-ui-lib.js` ）由 ngc 生成，打包器和优化器（如 Rollup）就可用于生成扁平化的 ESM 文件。

#### Note about the defaults in package.json

#### 注意 package.json 中的默认值

As of webpack v4 the flattening of ES modules optimization should not be necessary for webpack users, and in fact theoretically we should be able to get better code-splitting without flattening of modules in webpack.
In practice we still see size regressions when using unflattened modules as input for webpack v4.
This is why `"module"` and `"es2020"` package.json entries still point to fesm files.
We are investigating this issue and expect that we'll switch the `"module"` and `"es2020"` package.json entry points to unflattened files when the size regression issue is resolved.
The APF currently includes unflattened ESM2020 code for the purpose of validating such a future change.

从 webpack v4 开始，对于 webpack 用户来说，ES 模块优化的扁平化应该不是必需的，其实理论上我们应该能够在不扁平化 webpack 中的模块的情况下获得更好的代码拆分。在实践中，当使用非扁平化模块作为 webpack v4 的输入时，我们仍然会看到大小增加了。这就是为什么 package.json 中的 `"module"` 和 `"es2020"` 条目仍然指向 fesm 文件的原因。我们正在调查此问题，并希望在解决大小回归问题后将 package.json 中的 `"module"` 和 `"es2020"` 入口点切换到未扁平化的文件。 APF 目前包含未扁平化的 ESM2020 代码，目的是验证此类未来的更改。

### "sideEffects" flag

### “副作用”标志

By default, EcmaScript Modules are side-effectful: importing from a module ensures that any code at the top level of that module will execute.
This is often undesirable, as most side-effectful code in typical modules is not truly side-effectful, but instead only affects specific symbols.
If those symbols are not imported and used, it's often desirable to remove them in an optimization process known as tree-shaking, and the side-effectful code can prevent this.

默认情况下，EcmaScript 模块是有副作用的：从模块导入可确保该模块顶层的任何代码都将执行。这通常是不可取的，因为典型模块中的大多数副作用代码并不是真正的副作用，而是仅影响特定符号。如果没有导入和使用这些符号，通常需要在称为 tree-shaking 的优化过程中将它们删除，而副作用代码可以防止这种情况发生。

Build tools such as Webpack support a flag which allows packages to declare that they do not depend on side-effectful code at the top level of their modules, giving the tools more freedom to tree-shake code from the package.
The end result of these optimizations should be smaller bundle size and better code distribution in bundle chunks after code-splitting.
This optimization can break your code if it contains non-local side-effects - this is however not common in Angular applications and it's usually a sign of bad design.
Our recommendation is for all packages to claim the side-effect free status by setting the `sideEffects` property to `false`, and that developers follow the [Angular Style Guide](https://angular.io/guide/styleguide) which naturally results in code without non-local side-effects.

诸如 Webpack 之类的构建工具支持一个标志，该标志允许 package 声明它们不依赖于其模块顶层的副作用代码，从而使工具可以更自由地对包中的代码进行摇树优化。这些优化的最终结果应该是较小的包大小和代码拆分后包块中更好的代码分布。如果此优化包含非本地副作用，则此优化可能会破坏你的代码 - 然而，这在 Angular 应用程序中并不常见，并且通常是糟糕设计的标志。我们的建议是让所有包通过将 `sideEffects` 属性设置为 `false` 来声明无副作用状态，并且让开发人员遵循 [Angular 风格指南](https://angular.io/guide/styleguide)，这自然会导致代码没有非本地副作用。

More info: [webpack docs on side-effects](https://github.com/webpack/webpack/tree/master/examples/side-effects)

更多信息：[关于副作用的 webpack 文档](https://github.com/webpack/webpack/tree/master/examples/side-effects)

### ES2020 Language Level

### ES2020 语言级别

ES2020 Language level is now the default language level that is consumed by Angular CLI and other tooling.
The Angular CLI will downlevel the bundle to a language level that is supported by all targeted browsers at application build time.

ES2020 语言级别现在是 Angular CLI 和其他工具使用的默认语言级别。 Angular CLI 会将捆绑包降级到所有目标浏览器在应用程序构建时都支持的语言级别。

### d.ts bundling / type definition flattening

### d.ts 捆绑/类型定义的扁平化

As of APF v8 we now prefer to run [API Extractor](https://api-extractor.com), to bundle TypeScript definitions so that the entire API appears in a single file.

从 APF v8 开始，我们现在更喜欢运行 [API Extractor](https://api-extractor.com) 来打包 TypeScript 定义，以便整个 API 都出现在单个文件中。

In prior APF versions each entry point would have a `src` directory next to the .d.ts entry point and this directory contained individual d.ts files matching the structure of the original source code.
While this distribution format is still allowed and supported, it is highly discouraged because it confuses tools like IDEs that then offer incorrect autocompletion, and allows users to depend on deep-import paths which are typically not considered to be public API of a library or a package.

在之前的 APF 版本中，每个入口点都会在 .d.ts 入口点旁边有一个 `src` 目录，该目录包含与原始源代码结构匹配的单个 d.ts 文件。虽然这种分发格式仍然被允许和支持，但非常不鼓励它，因为它会弄晕 IDE 之类的工具，然后提供错误的自动完成，并允许用户依赖深度导入的路径，这些路径通常不被认为是库或包的公共 API。

### Tslib

### 库

As of APF v10, we recommend adding tslib as a direct dependency of your primary entry-point.
This is because the tslib version is tied to the TypeScript version used to compile your library.

从 APF v10 开始，我们建议添加 tslib 作为主要入口点的直接依赖项。这是因为 tslib 版本与用来编译库的 TypeScript 版本相关联。

## Examples

## 例子

* [@angular/core package](https://unpkg.com/browse/@angular/core@13.0.0-rc.0)

  [@angular/core 包](https://unpkg.com/browse/@angular/core@13.0.0-rc.0)

* [@angular/material package](https://unpkg.com/browse/@angular/material@13.0.0-rc.0)

  [@angular/material 包](https://unpkg.com/browse/@angular/material@13.0.0-rc.0)

## Definition of Terms

## 术语定义

The following terms are used throughout this document very intentionally.
In this section we define all of them to provide additional clarity.

本文档中特意使用了以下术语。在本节中，我们定义所有这些以便更清晰。

#### Package

#### 包

The smallest set of files that are published to NPM and installed together, for example `@angular/core`.
This package includes a manifest called package.json, compiled source code, typescript definition files, source maps, metadata, etc.
The package is installed with `npm install @angular/core`.

发布到 NPM 并一起安装的最小文件集，比如 `@angular/core` 。该包中包含一个名为 package.json 的清单、编译后的源代码、TypeScript 定义文件、源码映射、元数据等。该包是通过 `npm install @angular/core` 安装的。

#### Symbol

#### 符号

A class, function, constant or variable contained in a module and optionally made visible to the external world via a module export.

包含在模块中的类、函数、常量或变量，可选择通过模块导出，以便对外界可见。

#### Module

#### 模块

Short for ECMAScript Modules.
A file containing statements that import and export symbols.
This is identical to the definition of modules in the ECMAScript spec.

ECMAScript 模块的缩写。包含导入和导出符号的语句的文件。这与 ECMAScript 规范中模块的定义相同。

#### ESM

#### 无害环境管理

Short for ECMAScript Modules (see above).

ECMAScript 模块的缩写（见上文）。

#### FESM

Short for Flattened ES Modules and consists of a file format created by flattening all ES Modules accessible from an entry point into a single ES Module.

Flattened ES Modules 的缩写，由一种文件格式组成，该文件格式是通过将所有可从入口点访问的 ES 模块扁平化为单个 ES 模块而创建的。

#### Module ID

#### 模块标识

The identifier of a module used in the import statements (for example, `@angular/core`).
The ID often maps directly to a path on the filesystem, but this is not always the case due to various module resolution strategies.

导入语句中使用的模块的标识符（比如 `@angular/core` ）。此 ID 通常直接映射到文件系统上的路径，但由于有各种模块解析策略，情况也并非总是如此。

#### Module Specifier

#### 模块说明符

A module identifier (see above).

模块标识符（见上文）。

#### Module Resolution Strategy

#### 模块解析策略

Algorithm used to convert Module IDs to paths on the filesystem.
Node.js has one that is well specified and widely used, TypeScript supports several module resolution strategies, [Closure Compiler](https://developers.google.com/closure/compiler) has yet another strategy.

用于将模块 ID 转换为文件系统路径的算法。 Node.js 就有一个良好定义且广泛使用的，TypeScript 支持多种模块解析策略， [Closure Compiler](https://developers.google.com/closure/compiler) 还有另一种策略。

#### Module Format

#### 模块格式

Specification of the module syntax that covers at minimum the syntax for the importing and exporting from a file.
Common module formats are CommonJS (CJS, typically used for Node.js applications) or ECMAScript Modules (ESM).
The module format indicates only the packaging of the individual modules, but not the JavaScript language features used to make up the module content.
Because of this, the Angular team often uses the language level specifier as a suffix to the module format, (for example, ESM+ES2015 specifies that the module is in ESM format and contains code down-leveled to ES2015).

模块语法规范，至少涵盖用于从文件导入和导出的语法。常见的模块格式是 CommonJS（CJS，通常用于 Node.js 应用程序）或 ECMAScript 模块（ESM）。模块格式仅表示单个模块的封装，而不表示用于构成模块内容的 JavaScript 语言特性。正因为如此，Angular 团队经常使用语言级别说明符作为模块格式的后缀，比如 ESM+ES2015 指定模块为 ESM 格式并包含降级到 ES2015 的代码。

#### Bundle

#### 捆绑包

An artifact in the form of a single JS file, produced by a build tool (for example, [Webpack](https://webpack.js.org) or [Rollup](https://rollupjs.org)) that contains symbols originating in one or more modules.
Bundles are a browser-specific workaround that reduce network strain that would be caused if browsers were to start downloading hundreds if not tens of thousands of files.
Node.js typically doesn't use bundles.
Common bundle formats are UMD and System.register.

单个 JS 文件形式的工件，由构建工具（比如 [Webpack](https://webpack.js.org)或[Rollup](https://rollupjs.org/) ）生成，其中包含源自一个或多个模块的符号。捆绑包是一种特定于浏览器的解决方案，可减少浏览器开始下载数百甚至数万个文件时可能造成的网络压力。 Node.js 通常不使用捆绑包。常见的捆绑包格式是 UMD 和 System.register。

#### Language Level

#### 语言级别

The language of the code (ES2015 or ES2020).
Independent of the module format.

代码的语言（ES2015 或 ES2020）。独立于模块格式。

#### Entry Point

#### 入口点

A module intended to be imported by the user.
It is referenced by a unique module ID and exports the public API referenced by that module ID.
An example is `@angular/core` or `@angular/core/testing`.
Both entry points exist in the `@angular/core` package, but they export different symbols.
A package can have many entry points.

旨在由用户导入的模块。它由唯一的模块 ID 引用，并导出该模块 ID 引用的公共 API。一个例子是 `@angular/core` 或 `@angular/core/testing` 。 `@angular/core` 包中存在两个入口点，但它们导出不同的符号。一个包可以有许多入口点。

#### Deep Import

#### 深度导入

A process of retrieving symbols from modules that are not Entry Points.
These module IDs are usually considered to be private APIs that can change over the lifetime of the project or while the bundle for the given package is being created.

从不是入口点的模块中检索符号的过程。这些模块 ID 通常被认为是私有 API，它们可以在项目的生命周期内或在创建给定包的捆绑包时更改。

#### Top-Level Import

#### 顶级导入

An import coming from an entry point.
The available top-level imports are what define the public API and are exposed in "@angular/name" modules, such as `@angular/core` or `@angular/common`.

来自入口点的导入。可用的顶级导入定义了公共 API，并在“@angular/name”模块中公开，比如 `@angular/core` 或 `@angular/common` 。

#### Tree-shaking

#### 摇树优化

The process of identifying and removing code not used by an application - also known as dead code elimination.
This is a global optimization performed at the application level using tools like [Rollup](https://rollupjs.org), [Closure Compiler](https://developers.google.com/closure/compiler), or [Terser](https://github.com/terser/terser).

识别和删除应用程序中未使用的代码的过程 - 也称为死代码消除。这是使用 [Rollup](https://rollupjs.org) 、 [Closure Compiler](https://developers.google.com/closure/compiler) 或 [Terser](https://github.com/terser/terser/) 等工具在应用程序级别执行的全局优化。

#### AOT Compiler

#### AOT 编译器

The Ahead of Time Compiler for Angular.

Angular 的预先编译器。

#### Flattened Type Definitions

#### 扁平类型定义

The bundled TypeScript definitions generated from [API Extractor](https://api-extractor.com).

从 [API Extractor](https://api-extractor.com) 生成的捆绑 TypeScript 定义。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
# Browser support

# 浏览器支持

Angular supports most recent browsers.
This includes the following specific versions:

Angular 支持大多数常用浏览器，包括下列版本：

| Browser | Supported versions |
| :------ | :----------------- |
| 浏览器 | 支持的版本 |
| Chrome | latest |
| Chrome | 最新 |
| Firefox | latest and extended support release (ESR) |
| Firefox | 最新版以及扩展支持版本 (ESR) |
| Edge | 2 most recent major versions |
| Edge | 最近的两个主版本 |
| Safari | 2 most recent major versions |
| Safari | 最近的两个主版本 |
| iOS | 2 most recent major versions |
| iOS | 最近的两个主版本 |
| Android | 2 most recent major versions |
| Android | 最近的两个主版本 |

<div class="alert is-helpful">

Angular's continuous integration process runs unit tests of the framework on all of these browsers for every pull request, using [Sauce Labs](https://saucelabs.com).

Angular 在持续集成过程中，对每一个提交都会使用 [Sauce Labs](https://saucelabs.com) 在上述所有浏览器上执行单元测试。

</div>

## Polyfills

## 腻子脚本 (polyfill)

Angular is built on the latest standards of the web platform.
Targeting such a wide range of browsers is challenging because they do not support all features of modern browsers.
You compensate by loading polyfill scripts ("polyfills") for the browsers that you must support.
See instructions on how to include polyfills into your project below.

Angular 构建于 Web 平台的最新标准之上。要支持这么多浏览器是一个不小的挑战，因为它们不支持现代浏览器的所有特性。你可以通过加载腻子脚本("polyfills")来为想要支持的浏览器弥补这些特性。下面讲解了如何将腻子脚本包含到你的项目中。

<div class="alert is-important">

The suggested polyfills are the ones that run full Angular applications.
You might need additional polyfills to support features not covered by this list.

这些建议的腻子脚本是运行完整 Angular 应用所需的。
你可能还会需要另一些的腻子脚本来支持没有出现在此列表中的哪些特性。

</div>

<div class="alert is-helpful">

**NOTE**: <br />
Polyfills cannot magically transform an old, slow browser into a modern, fast one.

**注意**：<br />
这些腻子脚本并没有神奇的魔力来把老旧、慢速的浏览器变成现代、快速的浏览器。

</div>

## Enabling polyfills with CLI projects

## 在 CLI 项目中启用腻子脚本

The [Angular CLI](cli) provides support for polyfills.
If you are not using the CLI to create your projects, see [Polyfill instructions for non-CLI users](#non-cli).

[Angular CLI](cli) 提供了对腻子脚本的支持。如果未使用 CLI 创建项目，参阅[针对非 CLI 用户的腻子脚本说明](#non-cli)。

The `polyfills` options of the [browser](cli/build) and [test](cli/test) builder can be a full path for a file \(Example: `src/polyfills.ts`\) or,
relative to the current workspace or module specifier \(Example: `zone.js`\).

[browser](cli/build) 和 [test](cli/test) 构建器的 `polyfills` 选项可以是到一个文件的完整路径（比如 `src/polyfills.ts`）或相对于当前工作空间或模块的标识符（比如 `zone.js`）。

If you create a TypeScript file, make sure to include it in the `files` property of your `tsconfig` file.

如果你创建了某个 TypeScript 文件，请确保 `tsconfig` 文件的 `files` 属性中包含了它。

<code-example language="jsonc" syntax="jsonc">

{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    ...
  },
  "files": [
    "src/main.ts",
    "src/polyfills.ts"
  ]
  ...
}

</code-example>


<a id="non-cli"></a>

## Polyfills for non-CLI users

## 非 CLI 的用户的腻子脚本

If you are not using the CLI, add your polyfill scripts directly to the host web page (`index.html`).

如果你不使用 CLI，就要直接把腻子脚本添加到宿主页（`index.html`）中，就像这样：

For example:

比如：

<code-example header="src/index.html" language="html">

&lt;!-- pre-zone polyfills --&gt;
&lt;script src="node_modules/core-js/client/shim.min.js"&gt;&lt;/script&gt;
&lt;script>
  /**
   &ast; you can configure some zone flags which can disable zone interception for some
   &ast; asynchronous activities to improve startup performance - use these options only
   &ast; if you know what you are doing as it could result in hard to trace down bugs.
   */
  // &lowbar;&lowbar;Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
  // &lowbar;&lowbar;Zone_disable_on_property = true; // disable patch onProperty such as onclick
  // &lowbar;&lowbar;zone_symbol__UNPATCHED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames
  /*
   &ast; in Edge developer tools, the addEventListener will also be wrapped by zone.js
   &ast; with the following flag, it will bypass `zone.js` patch for Edge.
   */
  // &lowbar;&lowbar;Zone_enable_cross_context_check = true;
&lt;/script&gt;
&lt;!-- zone.js required by Angular --&gt;
&lt;script src="node_modules/zone.js/bundles/zone.umd.js"&gt;&lt;/script&gt;
&lt;!-- application polyfills --&gt;

</code-example>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-11-04
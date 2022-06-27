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

Angular 在持续集成过程中，对每一个提交都会使用 [Sauce Labs](https://saucelabs.com/) 在上述所有浏览器上执行单元测试。

</div>

## Polyfills

## 腻子脚本 (polyfill)

Angular is built on the latest standards of the web platform.
Targeting such a wide range of browsers is challenging because they do not support all features of modern browsers.
You compensate by loading polyfill scripts ("polyfills") for the browsers that you must support.
See instructions on how to include polyfills into your project below.

Angular 构建于 Web 平台的最新标准之上。 要支持这么多浏览器是一个不小的挑战，因为它们不支持现代浏览器的所有特性。 你可以通过加载腻子脚本("polyfills")来为想要支持的浏览器弥补这些特性。 下面讲解了如何将腻子脚本包含到你的项目中。

<div class="alert is-important">

The suggested polyfills are the ones that run full Angular applications.
You might need additional polyfills to support features not covered by this list.

<div class="alert is-helpful">

**NOTE**: <br />
Polyfills cannot magically transform an old, slow browser into a modern, fast one.

</div>

</div>

## Enabling polyfills with CLI projects

## 在 CLI 项目中启用腻子脚本

The [Angular CLI](cli) provides support for polyfills.
If you are not using the CLI to create your projects, see [Polyfill instructions for non-CLI users](#non-cli).

When you create a project with the `ng new` command, a `src/polyfills.ts` configuration file is created as part of your project folder.
This file incorporates the mandatory and many of the optional polyfills as JavaScript `import` statements.

使用 `ng new` 命令创建项目时，会在项目文件夹中创建一个 `src/polyfills.ts` 配置文件。该文件包含许多强制性和可选腻子脚本的 JavaScript `import` 语句。

* The npm packages for the mandatory polyfills (such as `zone.js`) are installed automatically for you when you create your project with `ng new`, and their corresponding `import` statements are already enabled in the `src/polyfills.ts` configuration file

  使用 `ng new` 创建项目时，会自动为你安装一些强制性腻子脚本（例如 `zone.js` ），并且它对应的 `import` 语句已在 `src/polyfills.ts` 配置文件中启用。

* If you need an *optional* polyfill, you must install its npm package, then uncomment or create the corresponding import statement in the `src/polyfills.ts` configuration file

  如果你需要一个**可选的**填充库，就必须安装它们的 npm 包，然后在 `src/polyfills.ts` 文件中反注释或创建一个对应的导入语句。

<a id="non-cli"></a>

## Polyfills for non-CLI users

## 非 CLI 的用户的腻子脚本

If you are not using the CLI, add your polyfill scripts directly to the host web page (`index.html`).

如果你不使用 CLI，就要直接把腻子脚本添加到宿主页（`index.html`）中，就像这样：。

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

@reviewed 2022-02-28
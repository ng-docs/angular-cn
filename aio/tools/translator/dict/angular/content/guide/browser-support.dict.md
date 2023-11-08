Browser support

浏览器支持

Angular supports most recent browsers.
This includes the following specific versions:

Angular 支持大多数常用浏览器，包括下列版本：

Android

Android

2 most recent major versions

最近的两个主版本

Safari

Safari

Edge

Edge

Firefox

Firefox

latest and extended support release \(ESR\)

最新版以及扩展支持版本（ESR）

Chrome

Chrome

2 most recent versions

最近的两个版本

Browser

浏览器

Supported versions

支持的版本

Polyfills

腻子脚本（polyfill）

Angular is built on the latest standards of the web platform.
Targeting such a wide range of browsers is challenging because they do not support all features of modern browsers.
You compensate by loading polyfill scripts \("polyfills"\) for the browsers that you must support.
See instructions on how to include polyfills into your project below.

Angular 构建于 Web 平台的最新标准之上。要支持这么多浏览器是一个不小的挑战，因为它们不支持现代浏览器的所有特性。你可以通过加载腻子脚本（"polyfills"）来为想要支持的浏览器弥补这些特性。下面讲解了如何将腻子脚本包含到你的项目中。

Enabling polyfills with CLI projects

在 CLI 项目中启用腻子脚本

The [Angular CLI](cli) provides support for polyfills.
If you are not using the CLI to create your projects, see [Polyfill instructions for non-CLI users](#non-cli).

[Angular CLI](cli) 提供了对腻子脚本的支持。如果未使用 CLI 创建项目，参阅[针对非 CLI 用户的腻子脚本说明](#non-cli)。

The `polyfills` options of the [browser](cli/build) and [test](cli/test) builder can be a full path for a file \(Example: `src/polyfills.ts`\) or,
relative to the current workspace or module specifier \(Example: `zone.js`\).

[browser](cli/build) 和 [test](cli/test) 构建器的 `polyfills` 选项可以是到一个文件的完整路径（比如 `src/polyfills.ts`）或相对于当前工作空间或模块的标识符（比如 `zone.js`）。

If you create a TypeScript file, make sure to include it in the `files` property of your `tsconfig` file.

如果你创建了某个 TypeScript 文件，请确保 `tsconfig` 文件的 `files` 属性中包含了它。

<a id="non-cli"></a>



Polyfills for non-CLI users

非 CLI 的用户的腻子脚本

If you are not using the CLI, add your polyfill scripts directly to the host web page \(`index.html`\).

如果你不使用 CLI，就要直接把腻子脚本添加到宿主页（`index.html`）中，就像这样：。

For example:

比如：
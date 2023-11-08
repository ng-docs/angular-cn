A [DI token](guide/glossary#di-token "DI token definition") representing a string ID, used
primarily for prefixing application attributes and CSS styles when
{&commat;link ViewEncapsulation#Emulated ViewEncapsulation.Emulated} is being used.

表示字符串 ID 的[DI 令牌](guide/glossary#di-token "DI 代币定义")，主要用于在使用 {&commat;link ViewEncapsulation#Emulated ViewEncapsulation.Emulated} 时为应用程序属性和 CSS 样式添加前缀。

The token is needed in cases when multiple applications are bootstrapped on a page
\(for example, using `bootstrapApplication` calls\). In this case, ensure that those applications
have different `APP_ID` value setup. For example:

在页面上引导多个应用程序（例如，使用 `bootstrapApplication` 调用）时需要令牌。在这种情况下，请确保这些应用程序具有不同的 `APP_ID` 值设置。例如：

By default, when there is only one application bootstrapped, you don't need to provide the
`APP_ID` token \(the `ng` will be used as an app ID\).

默认情况下，当只有一个应用程序启动时，你不需要提供 `APP_ID` 令牌（ `ng` 将用作应用程序 ID）。

Default value of the `APP_ID` token.

`APP_ID` 令牌的默认值。

A function that is executed when a platform is initialized.

平台初始化时执行的函数。

A token that indicates an opaque platform ID.

标识不透明平台 ID 的令牌。

A [DI token](guide/glossary#di-token "DI token definition") that indicates the root directory of
the application

一个 [DI 令牌](guide/glossary#di-token "DI 令牌定义")，指示应用程序的根目录

A [DI token](guide/glossary#di-token "DI token definition") that indicates which animations
module has been loaded.

一个[DI 令牌](guide/glossary#di-token "DI 令牌定义")，表明已加载了哪个动画模块。

Token used to configure the [Content Security Policy](https://web.dev/strict-csp/) nonce that
Angular will apply when inserting inline styles. If not provided, Angular will look up its value
from the `ngCspNonce` attribute of the application root node.

Token 用于配置 Angular 在插入内联样式时应用的[内容安全策略](https://web.dev/strict-csp/)随机数。如果未提供，Angular 将从应用程序根节点的 `ngCspNonce` 属性中查找它的值。

Internal token to collect all SSR-related features enabled for this application.

用于收集为此应用程序启用的所有 SSR 相关功能的内部令牌。

Note: the token is in `core` to let other packages register features \(the `core`
package is imported in other packages\).

注意：token 在 `core` 中是为了让其他包注册特性（ `core` 包是在其他包中导入的）。
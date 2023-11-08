Enables the `Location` service to read route state from the browser's URL.
Angular provides two strategies:
`HashLocationStrategy` and `PathLocationStrategy`.

使 `Location` 服务能够从浏览器的 URL 读取路由状态。Angular 提供了两种策略：
`HashLocationStrategy` 和 `PathLocationStrategy`。

Applications should use the `Router` or `Location` services to
interact with application route state.

应用程序应使用 `Router` 或 `Location` 服务与应用程序的路由状态进行交互。

For instance, `HashLocationStrategy` produces URLs like
<code class="no-auto-link">http://example.com#/foo</code>,
and `PathLocationStrategy` produces
<code class="no-auto-link">http://example.com/foo</code> as an equivalent URL.

比如，`HashLocationStrategy` 会处理像 <code class="no-auto-link">http://example.com#/foo</code>
这样的 URL，而 `PathLocationStrategy` 会处理像 <code
class="no-auto-link">http://example.com/foo</code> 这样的等价 URL。

See these two classes for more.

有关更多信息，请参见这两个类。

The following example shows how to use this token to configure the root app injector
with a base href value, so that the DI framework can supply the dependency anywhere in the app.

以下示例演示了如何使用此令牌为基本应用注入器配置 base href 值，以便 DI
框架可以在应用中的任何位置提供依赖项。

A predefined [DI token](guide/glossary#di-token) for the base href
to be used with the `PathLocationStrategy`.
The base href is the URL prefix that should be preserved when generating
and recognizing URLs.

预定义的 [DI 令牌](guide/glossary#di-token)，用于和 `PathLocationStrategy` 一起使用的 base
href。base href 是在生成和识别 URL 时应保留的 URL 前缀。

A {&commat;link LocationStrategy} used to configure the {&commat;link Location} service to
represent its state in the
[path](https://en.wikipedia.org/wiki/Uniform_Resource_Locator#Syntax) of the
browser's URL.

此 {&commat;link LocationStrategy} 用来配置 {&commat;link Location} 服务，以便在浏览器 URL 的
[path](https://en.wikipedia.org/wiki/Uniform_Resource_Locator#Syntax) 中表示其状态。

If you're using `PathLocationStrategy`, you may provide a {&commat;link APP_BASE_HREF}
or add a `<base href>` element to the document to override the default.

如果你使用 `PathLocationStrategy`，则必须提供一个 {&commat;link APP_BASE_HREF} 或在文档中添加 `<base
href>`。

For instance, if you provide an `APP_BASE_HREF` of `'/my/app/'` and call
`location.go('/foo')`, the browser's URL will become
`example.com/my/app/foo`. To ensure all relative URIs resolve correctly,
the `<base href>` and/or `APP_BASE_HREF` should end with a `/`.

比如，如果你提供的 `APP_BASE_HREF` 是 `'/my/app/'`，并调用 `location.go('/foo')`，则浏览器的 URL
将变为 `example.com/my/app/foo`。为了确保所有相对 URI 都能正确解析，`<base href>` 和/或
`APP_BASE_HREF` 都应该以 `/` 结尾。

Similarly, if you add `<base href='/my/app/'/>` to the document and call
`location.go('/foo')`, the browser's URL will become
`example.com/my/app/foo`.

同样，如果将 `<base href='/my/app/'/>` 添加到文档中并调用 `location.go('/foo')`，则浏览器的 URL
将变为 `example.com/my/app/foo`。

Note that when using `PathLocationStrategy`, neither the query nor
the fragment in the `<base href>` will be preserved, as outlined
by the [RFC](https://tools.ietf.org/html/rfc3986#section-5.2.2).

请注意，使用 `PathLocationStrategy` 时，如
[RFC](https://tools.ietf.org/html/rfc3986#section-5.2.2) 所述，查询和 `<base href>`
的片段部分都不会保留。

Example

例子

{&commat;example common/location/ts/path_location_component.ts region='LocationComponent'}
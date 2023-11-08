Creates an instance of a server platform \(with or without JIT compiler support
depending on the `ngJitMode` global const value\), using provided options.

使用提供的选项创建服务器平台的实例（有或没有 JIT 编译器支持取决于 `ngJitMode` 全局常量值）。

Adds the `ng-server-context` attribute to host elements of all bootstrapped components
within a given application.

将 `ng-server-context` 属性添加到给定应用程序中所有引导组件的宿主元素。

Specifies the value that should be used if no server context value has been provided.

指定在未提供服务器上下文值时应使用的值。

An internal token that allows providing extra information about the server context
\(e.g. whether SSR or SSG was used\). The value is a string and characters other
than [a-zA-Z0-9\-] are removed. See the default value in `DEFAULT_SERVER_CONTEXT` const.

允许提供有关服务器上下文的额外信息的内部令牌（例如，是否使用了 SSR 或 SSG）。该值是一个字符串，除了[a-zA-Z0-9-][a-zA-Z0-9\-]之外的字符都被删除了。查看 `DEFAULT_SERVER_CONTEXT` const 中的默认值。

Sanitizes provided server context:

清理提供的服务器上下文：

removes all characters other than a-z, A-Z, 0-9 and `-`

删除除 az、AZ、0-9 和 `-` 以外的所有字符

returns `other` if nothing is provided or the string is empty after sanitization

如果未提供任何内容或清理后字符串为空，则返回 `other`

A reference to an NgModule that should be used for bootstrap.

对应该用于引导的 NgModule 的引用。

Additional configuration for the render operation:

渲染操作的附加配置：

`document` - the document of the page to render, either as an HTML string or
             as a reference to the `document` instance.

`document` - 要渲染的页面的文档，可以是 HTML 字符串，也可以是对 `document` 实例的引用。

`url` - the URL for the current render request.

`url` - 当前渲染请求的 URL。

`extraProviders` - set of platform level providers for the current render request.

`extraProviders` - 当前渲染请求的平台级提供程序集。

Bootstraps an application using provided NgModule and serializes the page content to string.

使用提供的 NgModule 引导应用程序，并将页面内容序列化为字符串。

A method that when invoked returns a promise that returns an `ApplicationRef`
    instance once resolved.

一种在调用时返回一个承诺的方法，该承诺在解决后返回一个 `ApplicationRef` 实例。

`platformProviders` - the platform level providers for the current render request.

`platformProviders` - 当前渲染请求的平台级提供程序。

A Promise, that returns serialized \(to a string\) rendered page, once resolved.

一个承诺，一旦解决，它就会返回序列化（到一个字符串）渲染的页面。

Bootstraps an instance of an Angular application and renders it to a string.

引导 Angular 应用程序的实例并将其渲染为字符串。
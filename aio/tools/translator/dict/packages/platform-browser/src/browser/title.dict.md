Factory to create Title service.

工厂创建 Title 服务。

A service that can be used to get and set the title of a current HTML document.

可以用来获取和设置当前 HTML 文档标题的服务。

Since an Angular application can't be bootstrapped on the entire HTML document \(`<html>` tag\)
it is not possible to bind to the `text` property of the `HTMLTitleElement` elements
\(representing the `<title>` tag\). Instead, this service can be used to set and get the current
title value.

由于 Angular 应用程序不能在整个 HTML 文档\(`<html>` 标签\)上引导，因此无法绑定到 `HTMLTitleElement`
的 `text` 属性（即 `<title>` 标签）。可以改用此服务来设置和获取当前标题值。

Get the title of the current HTML document.

获取当前 HTML 文档的标题。

Set the title of the current HTML document.

设置当前 HTML 文档的标题。
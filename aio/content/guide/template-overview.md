# Understanding templates

# 了解模板

In Angular, a template is a blueprint for a fragment of a user interface (UI).  Templates are written in HTML, and special syntax can be used within a template to build on many of Angular's features.

在 Angular 中，模板是用户界面 (UI) 片段的蓝图。模板是用 HTML 编写的，可以在模板中使用特殊语法来构建 Angular 的许多特性。

## Prerequisites

## 前提条件

Before learning template syntax, you should be familiar with the following:

在学习模板语法之前，你应该熟悉下列内容：

* [Angular concepts](guide/architecture)

  [Angular 的概念](guide/architecture)

* JavaScript

* HTML

* CSS

## Enhancing HTML

## 增强 HTML

Angular extends the HTML syntax in your templates with additional functionality.  
For example, Angular’s data binding syntax helps to set Document Object Model (DOM) properties dynamically.

Angular 使用额外的特性扩展了模板中的 HTML 语法。<br />例如，Angular 的数据绑定语法有助于动态设置文档对象模型 (DOM) 属性。

Almost all HTML syntax is valid template syntax.  However, because an Angular template is only a fragment of the UI, it does not include elements such as `<html>`, `<body>`, or `<base>`.

几乎所有 HTML 语法都是有效的模板语法。但是，由于 Angular 模板只是 UI 的一个片段，因此它不包含 `<html>` 、 `<body>` 或 `<base>` 等元素。

<div class="alert is-important">

To eliminate the risk of script injection attacks, Angular does not support the `<script>` element in templates.  Angular ignores the `<script>` tag and outputs a warning to the browser console.
For more information, see the [Security](guide/security) page.

为了消除脚本注入攻击的风险，Angular 不支持模板中使用 `<script>` 元素。Angular 会忽略 `<script>` 标记，并向浏览器控制台输出一条警告。欲知详情，参阅[“安全性”](guide/security)页面。

</div>

## More on template syntax

## 关于模板语法的更多信息

You might also be interested in the following:

你可能还对下列内容感兴趣：

<div class="card-container">
    <a href="guide/interpolation" class="docs-card" title="Interpolation">

```
    <section>Interpolation</section>
    <p>Learn how to use interpolation and expressions in HTML.</p>
    <p class="card-footer">Interpolation</p>
</a>
<a href="guide/property-binding" class="docs-card" title="Property binding">
    <section>Property binding</section>
    <p>Set properties of target elements or directive @Input() decorators.</p>
    <p class="card-footer">Property binding</p>
</a>
<a href="guide/attribute-binding" class="docs-card" title="Attribute binding">
    <section>Attribute binding</section>
    <p>Set the value of attributes.</p>
    <p class="card-footer">Attribute binding</p>
</a>
<a href="guide/class-binding" class="docs-card" title="Class and style binding">
    <section>Class and style binding</section>
    <p>Set the value of class and style.</p>
    <p class="card-footer">Class and style binding</p>
</a>
<a href="guide/event-binding" class="docs-card" title="Event binding">
    <section>Event binding</section>
    <p>Listen for events and your HTML.</p>
    <p class="card-footer">Event binding</p>
</a>
<a href="guide/template-reference-variables" class="docs-card" title="Template reference variables">
    <section>Template reference variables</section>
    <p>Use special variables to reference a DOM element within a template.</p>
    <p class="card-footer">Template reference variables</p>
</a>
<a href="guide/built-in-directives" class="docs-card" title="Built-in directives">
    <section>Built-in directives</section>
    <p>Listen to and modify the behavior and layout of HTML.</p>
    <p class="card-footer">Built-in directives</p>
</a>
<a href="guide/inputs-outputs" class="docs-card" title="Inputs and Outputs">
    <section>Inputs and Outputs</section>
    <p>Share data between the parent context and child directives or components.</p>
    <p class="card-footer">Inputs and Outputs</p>
</a>
```

</div>

@reviewed 2022-05-11
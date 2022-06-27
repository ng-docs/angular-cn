# Attribute binding

# Attribute 绑定

Attribute binding in Angular helps you set values for attributes directly.
With attribute binding, you can improve accessibility, style your application dynamically, and manage multiple CSS classes or styles simultaneously.

Angular 中的 Attribute 绑定可帮助你直接设置 Attribute 值。使用 Attribute 绑定，你可以提升无障碍性、动态设置应用程序样式以及同时管理多个 CSS 类或样式。

<div class="alert is-helpful">

See the <live-example></live-example> for a working example containing the code snippets in this guide.

包含本指南中的代码片段的可工作示例，请参阅<live-example></live-example>。

</div>

## Prerequisites

## 前提条件

* [Property Binding](guide/property-binding)

  [property 绑定](guide/property-binding)

## Syntax

## 语法

Attribute binding syntax resembles [property binding](guide/property-binding), but instead of an element property between brackets, you precede the name of the attribute with the prefix `attr`, followed by a dot.
Then, you set the attribute value with an expression that resolves to a string.

Attribute 绑定语法类似于 [Property 绑定](guide/property-binding)，但不是直接在方括号之间放置元素的 Property，而是在 Attribute 名称前面加上前缀 `attr`，后跟一个点 `.`。然后，使用解析为字符串的表达式设置 Attribute 值。

<code-example format="html" language="html">

&lt;p [attr.attribute-you-are-targeting]="expression"&gt;&lt;/p&gt;

</code-example>

<div class="alert is-helpful">

When the expression resolves to `null` or `undefined`, Angular removes the attribute altogether.

当表达式解析为 `null` 或 `undefined` 时，Angular 会完全删除该 Attribute。

</div>

## Binding ARIA attributes

## 绑定 ARIA Attribute

One of the primary use cases for attribute binding is to set ARIA attributes.

Attribute 绑定的主要用例之一是设置 ARIA Attribute。

To bind to an ARIA attribute, type the following:

要绑定到 ARIA Attribute，请键入以下内容：

<code-example header="src/app/app.component.html" path="attribute-binding/src/app/app.component.html" region="attrib-binding-aria"></code-example>

<a id="colspan"></a>

## Binding to `colspan`

## 绑定到 `colspan`

Another common use case for attribute binding is with the `colspan` attribute in tables.  Binding to the `colspan` attribute helps you to keep your tables programmatically dynamic.  Depending on the amount of data that your application populates a table with, the number of columns that a row spans could change.

Attribute 绑定的另一个常见用例是绑定到表格中的 `colspan` Attribute。`colspan` Attribute 可帮助你以编程方式让表格保持动态。根据应用中用来填充表的数据量，某一行要跨越的列数可能会发生变化。

To use attribute binding with the `<td>` attribute `colspan`

要将 Attribute 绑定到 `<td>` 的 `colspan` Attribute

1. Specify the `colspan` attribute by using the following syntax: `[attr.colspan]`.

   使用以下语法指定 `colspan`：`[attr.colspan]` 。

1. Set `[attr.colspan]` equal to an expression.

   将 `[attr.colspan]` 设置为等于某个表达式。

In the following example, you bind the `colspan` attribute to the expression `1 + 1`.

在下面的示例中，我们将 `colspan` Attribute 绑定到表达式 `1 + 1`。

<code-example header="src/app/app.component.html" path="attribute-binding/src/app/app.component.html" region="colspan"></code-example>

This binding causes the `<tr>` to span two columns.

此绑定会导致 `<tr>` 跨越两列。

<div class="alert is-helpful">

Sometimes there are differences between the name of property and an attribute.

有时，Property 名和 Attribute 名之间存在差异。

`colspan` is an attribute of `<tr>`, while `colSpan`  with a capital "S" is a property.
When using attribute binding, use `colspan` with a lowercase "s".

`colspan` 是 `<tr>` 的 Attibute，而带有大写 "S" 的 `colSpan` 是 Property。使用 Attribute 绑定时，请使用带有小写“s”的 `colspan` 。

For more information on how to bind to the `colSpan` property, see the [`colspan` and `colSpan`](guide/property-binding#colspan) section of [Property Binding](guide/property-binding).

有关如何绑定到 `colSpan` Property 的更多信息，参阅 [Property 绑定](guide/property-binding)中的 [`colspan` 和 `colSpan`](guide/property-binding#colspan) 部分。

</div>

## What’s next

## 下一步呢？

* [Class & Style Binding](guide/class-binding)

  [类和样式绑定](guide/class-binding)

@reviewed 2022-05-02
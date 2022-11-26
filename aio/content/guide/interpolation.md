# Displaying values with interpolation

# 使用插值语法显示值

## Prerequisites

## 前提条件

* [Basics of components](guide/architecture-components)

  [组件基础](guide/architecture-components)

* [Basics of templates](guide/glossary#template)

  [模板基础](guide/glossary#template)

* [Binding syntax](guide/binding-syntax)

  [绑定语法](guide/binding-syntax)

<!--todo: needs a level 2 heading for info below -->

Interpolation refers to embedding expressions into marked up text. By default, interpolation uses the double curly braces `{{` and `}}` as delimiters.

插值是指将表达式嵌入到被标记的文本中。默认情况下，插值使用双花括号 `{{` 和 `}}` 作为定界符。

To illustrate how interpolation works, consider an Angular component that contains a `currentCustomer` variable:

为了说明插值的工作原理，请考虑一个包含 `currentCustomer` 变量的 Angular 组件：

<code-example path="interpolation/src/app/app.component.ts" region="customer"></code-example>

Use interpolation to display the value of this variable in the corresponding component template:

可以用插值在相应的组件模板中显示此变量的值：

<code-example path="interpolation/src/app/app.component.html" region="interpolation-example1"></code-example>

Angular replaces `currentCustomer` with the string value of the corresponding component property. In this case, the value is `Maria`.

Angular 会用相应组件属性的字符串值替换掉 `currentCustomer`。在这里，它的值是 `Maria`。

In the following example, Angular evaluates the `title` and `itemImageUrl` properties to display some title text and an image.

在以下示例中，Angular 会求出 `title` 和 `itemImageUrl` 属性的值，以显示一些标题文本和图像。

<code-example path="interpolation/src/app/app.component.html" region="component-property"></code-example>

## What's Next

## 下一步呢？

* [Property binding](guide/property-binding)

  [property 绑定](guide/property-binding)

* [Event binding](guide/event-binding)

  [事件绑定](guide/event-binding)

@reviewed 2022-04-14
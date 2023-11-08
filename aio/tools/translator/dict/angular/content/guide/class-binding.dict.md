Class and style binding

类和样式绑定

Use class and style bindings to add and remove CSS class names from an element's `class` attribute and to set styles dynamically.

使用类和样式绑定从元素的 `class` 属性中添加和删除 CSS 类名，以及动态设置样式。

Prerequisites

前提条件

[Property binding](guide/property-binding)

[property 绑定](guide/property-binding)

Binding to a single CSS `class`

绑定到单个 CSS `class`

To create a single class binding, type the following:

要创建单个类绑定，请键入以下内容：

Angular adds the class when the bound expression, `onSale` is truthy, and it removes the class when the expression is falsy—with the exception of `undefined`. See [styling delegation](guide/style-precedence#styling-delegation) for more information.

当绑定表达式 `onSale` 为真值时，Angular 会添加类，当表达式为假值时，它会删除类 —— `undefined` 除外。有关更多信息，参阅[样式委托](guide/style-precedence#styling-delegation)。

Binding to multiple CSS classes

绑定到多个 CSS 类

To bind to multiple classes, type the following:

要绑定到多个类，请键入以下内容：

The expression can be one of:

表达式可以是以下之一：

A space-delimited string of class names.

用空格分隔的类名字符串。

An object with class names as the keys and truthy or falsy expressions as the values.

以类名作为键名并将真或假表达式作为值的对象。

An array of class names.

类名的数组。

With the object format, Angular adds a class only if its associated value is truthy.

对于对象格式，Angular 会在其关联的值为真时才添加类。

If there are multiple bindings to the same class name, Angular uses [styling precedence](guide/style-precedence) to determine which binding to use.

如果同一类名有多个绑定，Angular 会根据[样式优先级](guide/style-precedence)来确定要使用的绑定。

The following table summarizes class binding syntax.

下表是各种类绑定语法的小结。

Multi-class binding

多重类绑定

<code>Array&lt;string></code>

<code>Array&lt;string></code>

<code>Record&lt;string, boolean &verbar; undefined &verbar; null></code>

<code>Record&lt;string, boolean &verbar; undefined &verbar; null></code>

Single class binding

单一类绑定

<code>boolean &verbar; undefined &verbar; null</code>

<code>boolean &verbar; undefined &verbar; null</code>

`true`, `false`

`true`, `false`

Binding Type

绑定类型

Syntax

语法

Input Type

输入属性

Example Input Values

范例输入值

Binding to a single style

绑定到单一样式

To create a single style binding, use the prefix `style` followed by a dot and the name of the CSS style.

要创建单个样式绑定，请使用 `style` 前缀，后跟一个点和 CSS 样式的名称。

For example, to set the `width` style, type the following:  `[style.width]="width"`

比如，要设置 'width' 样式，请键入以下内容：`[style.width]="width"`

Angular sets the property to the value of the bound expression, which is usually a string. Optionally, you can add a unit extension like `em` or `%`, which requires a number type.

Angular 将该属性设置为绑定表达式的值，这通常是一个字符串。（可选）你可以添加单位扩展名，比如 `em` 或 `%`，这需要数字类型。

To write a style in dash-case, type the following:

要以中线格式（dash-case）编写样式，请键入以下内容：

To write a style in camelCase, type the following:

要以驼峰格式（camelCase）编写样式，请键入以下内容：

Binding to multiple styles

绑定到多个样式

To toggle multiple styles, bind to the `[style]` attribute—for example, `[style]="styleExpression"`. The `styleExpression` can be one of:

要切换多个样式，请绑定到 `[style]` Attribute，比如 `[style]="styleExpression"`。`styleExpression` 可以是如下格式之一：

A string list of styles such as `"width: 100px; height: 100px; background-color: cornflowerblue;"`.

样式的字符串列表，比如 `"width: 100px; height: 100px; background-color: cornflowerblue;"`。

An object with style names as the keys and style values as the values, such as `{width: '100px', height: '100px', backgroundColor: 'cornflowerblue'}`.

一个对象，其键名是样式名，其值是样式值，比如 `{width: '100px', height: '100px', backgroundColor: 'cornflowerblue'}`。

Note that binding an array to `[style]` is not supported.

注意，不支持把数组绑定给 `[style]`。

Single and multiple-style binding example

单样式和多样式绑定示例

If there are multiple bindings to the same style attribute, Angular uses [styling precedence](guide/style-precedence) to determine which binding to use.

如果同一个样式 Attribute 有多个绑定，Angular 将使用[样式优先级](guide/style-precedence)来确定要使用的绑定。

The following table summarizes style binding syntax.

下表是各种样式绑定语法的小结。

Multi-style binding

多重样式绑定

<code>Record&lt;string, string &verbar; undefined &verbar; null></code>

<code>Record&lt;string, string &verbar; undefined &verbar; null></code>

Single style binding with units

带单位的单一样式绑定

<code>number &verbar; undefined &verbar; null</code>

<code>number &verbar; undefined &verbar; null</code>

Single style binding

单一样式绑定

<code>string &verbar; undefined &verbar; null</code>

<code>string &verbar; undefined &verbar; null</code>

Styling precedence

样式优先级

A single HTML element can have its CSS class list and style values bound to multiple sources \(for example, host bindings from multiple directives\).

一个 HTML 元素可以将其 CSS 类列表和样式值绑定到多个源（比如，来自多个指令的宿主绑定）。

What’s next

下一步呢？

[Component styles](/guide/component-styles)

[组件样式](/guide/component-styles)

[Introduction to Angular animations](/guide/animations)

[Angular 动画介绍](/guide/animations)
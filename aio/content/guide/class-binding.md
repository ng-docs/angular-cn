# Class and style binding

Use class and style bindings to add and remove CSS class names from an element's `class` attribute and to set styles dynamically.

## Prerequisites

## 先决条件

* [Property binding](guide/property-binding)

  [property 绑定](guide/property-binding)

## Binding to a single CSS `class`

## 绑定到单个 CSS `class`

To create a single class binding, type the following:

[class.sale]="onSale"

Angular adds the class when the bound expression, `onSale` is truthy, and it removes the class when the expression is falsy—with the exception of `undefined`.  See [styling delegation](guide/style-precedence#styling-delegation) for more information.

## Binding to multiple CSS classes

## 绑定到多个 CSS 类

To bind to multiple classes, type the following:

`[class]="classExpression"`

The expression can be one of:

* A space-delimited string of class names.

  用空格分隔的类名字符串。

* An object with class names as the keys and truthy or falsy expressions as the values.

  以类名作为键名并将真或假表达式作为值的对象。

* An array of class names.

  类名的数组。

With the object format, Angular adds a class only if its associated value is truthy.

对于对象格式，Angular 会在其关联的值为真时才添加类。

<div class="alert is-important">

With any object-like expression—such as `object`, `Array`, `Map`, or `Set`—the identity of the object must change for Angular to update the class list.
Updating the property without changing object identity has no effect.

对于任何类似对象的表达式（例如 `object`、`Array`、`Map` 或 `Set`，必须更改对象的引用，Angular 才能更新类列表。在不更改对象引用的情况下只更新其 Attribute 是不会生效的。

</div>

If there are multiple bindings to the same class name, Angular uses [styling precedence](guide/style-precedence) to determine which binding to use.

如果同一类名有多个绑定，Angular 会根据[样式优先级](guide/style-precedence)来确定要使用的绑定。

The following table summarizes class binding syntax.

下表是各种类绑定语法的小结。

| Binding Type | Syntax | Input Type | Example Input Values |
| :----------- | :----- | :--------- | :------------------- |
| 绑定类型 | 语法 | 输入属性 | 范例输入值 |
| Single class binding | `[class.sale]="onSale"` | <code>boolean &verbar; undefined &verbar; null</code> | `true`, `false` |
| 单一类绑定 | `[class.sale]="onSale"` | <code>boolean &verbar; undefined &verbar; null</code> | `true`, `false` |
| Multi-class binding | `[class]="classExpression"` | `string` | `"my-class-1 my-class-2 my-class-3"` |
| 多重类绑定 | `[class]="classExpression"` | `string` | `"my-class-1 my-class-2 my-class-3"` |
| Multi-class binding | `[class]="classExpression"` | <code>Record&lt;string, boolean &verbar; undefined &verbar; null></code> | `{foo: true, bar: false}` |
| 多重类绑定 | `[class]="classExpression"` | <code>Record&lt;string, boolean &verbar; undefined &verbar; null></code> | `{foo: true, bar: false}` |
| Multi-class binding | `[class]="classExpression"` | <code>Array&lt;string></code> | `['foo', 'bar']` |
| 多重类绑定 | `[class]="classExpression"` | <code>Array&lt;string></code> | `['foo', 'bar']` |

## Binding to a single style

## 绑定到单一样式

To create a single style binding, use the prefix `style` followed by a dot and the name of the CSS style.

For example, set the ‘width’ style, type the following:  `[style.width]="width"`

Angular sets the property to the value of the bound expression, which is usually a string.  Optionally, you can add a unit extension like `em` or `%`, which requires a number type.

1. To write a style in dash-case, type the following:

   <code-example language="html">&lt;nav [style.background-color]="expression"&gt;&lt;/nav&gt;</code-example>

2. To write a style in camelCase, type the following:

   <code-example language="html">&lt;nav [style.backgroundColor]="expression"&gt;&lt;/nav&gt;</code-example>

## Binding to multiple styles

## 绑定到多个样式

To toggle multiple styles, bind to the `[style]` attribute—for example, `[style]="styleExpression"`.  The `styleExpression` can be one of:

要切换多个样式，请绑定到 `[style]` Attribute，例如 `[style]="styleExpression"` 。`styleExpression` 可以是如下格式之一：

* A string list of styles such as `"width: 100px; height: 100px; background-color: cornflowerblue;"`.

  样式的字符串列表，例如 `"width: 100px; height: 100px; background-color: cornflowerblue;"`。

* An object with style names as the keys and style values as the values, such as `{width: '100px', height: '100px', backgroundColor: 'cornflowerblue'}`.

  一个对象，其键名是样式名，其值是样式值，比如 `{width: '100px', height: '100px', backgroundColor: 'cornflowerblue'}`。

Note that binding an array to `[style]` is not supported.

注意，不支持把数组绑定给 `[style]`。

<div class="alert is-important">

When binding `[style]` to an object expression, the identity of the object must change for Angular to update the class list.
Updating the property without changing object identity has no effect.

当把 `[style]` 绑定到对象表达式时，该对象的引用必须改变，这样 Angular 才能更新这个类列表。在不改变对象引用的情况下更新其属性值是不会生效的。

</div>

### Single and multiple-style binding example

### 单样式和多样式绑定示例

<code-example path="attribute-binding/src/app/single-and-multiple-style-binding.component.ts" header="nav-bar.component.ts"></code-example>

If there are multiple bindings to the same style attribute, Angular uses [styling precedence](guide/style-precedence) to determine which binding to use.

如果同一个样式 Attribute 有多个绑定，Angular 将使用[样式优先级](guide/style-precedence)来确定要使用的绑定。

The following table summarizes style binding syntax.

下表是各种样式绑定语法的小结。

| Binding Type | Syntax | Input Type | Example Input Values |
| :----------- | :----- | :--------- | :------------------- |
| 绑定类型 | 语法 | 输入属性 | 范例输入值 |
| Single style binding | `[style.width]="width"` | <code>string &verbar; undefined &verbar; null</code> | `"100px"` |
| 单一样式绑定 | `[style.width]="width"` | <code>string &verbar; undefined &verbar; null</code> | `"100px"` |
| Single style binding with units | `[style.width.px]="width"` | <code>number &verbar; undefined &verbar; null</code> | `100` |
| 带单位的单一样式绑定 | `[style.width.px]="width"` | <code>number &verbar; undefined &verbar; null</code> | `100` |
| Multi-style binding | `[style]="styleExpression"` | `string` | `"width: 100px; height: 100px"` |
| 多重样式绑定 | `[style]="styleExpression"` | `string` | `"width: 100px; height: 100px"` |
| Multi-style binding | `[style]="styleExpression"` | <code>Record&lt;string, string &verbar; undefined &verbar; null></code> | `{width: '100px', height: '100px'}` |
| 多重样式绑定 | `[style]="styleExpression"` | <code>Record&lt;string, string &verbar; undefined &verbar; null></code> | `{width: '100px', height: '100px'}` |

{@a styling-precedence}

## Styling precedence

## 样式优先级【模糊翻译】

A single HTML element can have its CSS class list and style values bound to multiple sources (for example, host bindings from multiple directives).

一个 HTML 元素可以将其 CSS 类列表和样式值绑定到多个源（例如，来自多个指令的宿主绑定）。

## What’s next

## 下一步是什么【模糊翻译】

* [Component styles](https://angular.io/guide/component-styles)

* [Introduction to Angular animations](https://angular.io/guide/animations)

@reviewed 2022-05-09
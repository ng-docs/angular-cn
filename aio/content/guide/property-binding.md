# Property binding

# 属性绑定

Property binding in Angular helps you set values for properties of HTML elements or directives.  Use property binding to do things such as toggle button functionality, set paths programmatically, and share values between components.

Angular 中的属性绑定可帮助你设置 HTML 元素或指令的属性值。使用属性绑定，可以执行诸如切换按钮、以编程方式设置路径，以及在组件之间共享值之类的功能。

<div class="alert is-helpful">

See the <live-example></live-example> for a working example containing the code snippets in this guide.

包含本指南中的代码片段的工作示例，请参阅<live-example></live-example>。

</div>

## Prerequisites

## 前提条件

* [Basics of components](guide/architecture-components)

  [组件基础](guide/architecture-components)

* [Basics of templates](guide/glossary#template)

  [模板基础](guide/glossary#template)

* [Binding syntax](guide/binding-syntax)

  [绑定语法](guide/binding-syntax)

## Understanding the flow of data

## 了解数据流

Property binding moves a value in one direction, from a component's property into a target element property.

属性绑定在单一方向上将值从组件的属性送到目标元素的属性。

<div class="alert is-helpful">

For more information on listening for events, see [Event binding](guide/event-binding).

有关侦听事件的更多信息，请参阅[事件绑定](guide/event-binding)。

</div>

To read a target element property or call one of its methods, see the API reference for [ViewChild](api/core/ViewChild) and [ContentChild](api/core/ContentChild).

要读取目标元素的属性或调用其方法，请参阅 [ViewChild](api/core/ViewChild) 和 [ContentChild](api/core/ContentChild) 的 API 参考手册。

## Binding to a property

## 绑定到属性

To bind to an element's property, enclose it in square brackets, `[]`, which identifies the property as a target property.

要绑定到元素的属性，请将其放在方括号 `[]` 中，这会将此属性标识为目标属性。

A target property is the DOM property to which you want to assign a value.

要绑定到元素的属性 ，请将其括在方括号 `[]` 内，这会将此属性标为目标属性。目标属性就是你要对其进行赋值的 DOM 属性 。

To assign a value to a target property for the image element's `src` property, type the following code:

要为 image 元素的目标属性（`src`）赋值，请键入以下代码：

<code-example path="property-binding/src/app/app.component.html" region="property-binding" header="src/app/app.component.html"></code-example>

In most cases, the target name is the name of a property, even when it appears to be the name of an attribute.

在大多数情况下，目标名称是 Property（属性）名称，即使它看起来是 Attribute（属性）名称。

In this example, `src` is the name of the `<img>` element property.

在这个例子中，`src` 就是 `<img>` 元素的 Property 名称。

The brackets, `[]`, cause Angular to evaluate the right-hand side of the assignment as a dynamic expression.

方括号 `[]` 使 Angular 将等号的右侧看作动态表达式进行求值。

Without the brackets, Angular treats the right-hand side as a string literal and sets the property to that static value.

如果不使用方括号，Angular 就会将右侧视为字符串字面量并将此属性设置为该静态值。

To assign a string to a property, type the following code:

要将字符串赋值给属性，请键入以下代码：

<code-example path="property-binding/src/app/app.component.html" region="no-evaluation" header="src/app.component.html"></code-example>

Omitting the brackets renders the string `parentItem`, not the value of `parentItem`.

省略方括号就会渲染出字符串 `parentItem`，而不是 `parentItem` 的值。

## Setting an element property to a component property value

## 将元素的属性设置为组件属性的值

To bind the `src` property of an `<img>` element to a component's property, place the target, `src`, in square brackets followed by an equal sign and then the property.

要将 `<img>` 的 `src` 属性绑定到组件的属性，请将目标 `src` 放在方括号中，后跟等号，然后是组件的属性。

Using the property `itemImageUrl`, type the following code:

使用属性 `itemImageUrl`，键入以下代码：

<code-example path="property-binding/src/app/app.component.html" region="property-binding" header="src/app/app.component.html"></code-example>

Declare the `itemImageUrl` property in the class, in this case `AppComponent`.

在组件类 `AppComponent` 中声明 `itemImageUrl` 属性。

<code-example path="property-binding/src/app/app.component.ts" region="item-image" header="src/app/app.component.ts"></code-example>

{@a colspan}

#### `colspan` and `colSpan`

#### `colspan` 和 `colSpan`

A common point of confusion is between the attribute, `colspan`, and the property, `colSpan`.  Notice that these two names differ by only a single letter.

最容易混淆的地方是 `colspan` 这个 Attribute 和 `colSpan` 这个 Property。请注意，这两个名称只有一个字母的大小写不同。

To use property binding using colSpan, type the following:

要通过 colSpan 使用属性绑定，请键入以下内容：

<code-example path="attribute-binding/src/app/app.component.html" region="colSpan" header="src/app/app.component.html"></code-example>

To disable a button when the component says that it `isUnchanged`, type the following:

要在组件显示 `isUnchanged` 时禁用按钮，请键入以下内容：

<code-example path="property-binding/src/app/app.component.html" region="disabled-button" header="src/app/app.component.html"></code-example>

To set a property of a directive, type the following:

要设置指令的属性，请键入以下内容：

<code-example path="property-binding/src/app/app.component.html" region="class-binding" header="src/app/app.component.html"></code-example>

To set the model property of a custom component for parent and child components to communicated, type the following:

要将自定义组件的模型属性设置为父组件和子组件进行通信，请键入以下内容：

<code-example path="property-binding/src/app/app.component.html" region="model-property-binding" header="src/app/app.component.html"></code-example>

## Toggling button functionality

## 切换按钮功能

To disable a button's functionality depending on a Boolean value, bind the DOM `disabled` property to a property in the class that is `true` or `false`.

若要根据布尔值禁用按钮的功能，请将 DOM 的 `disabled` Property 设置为类中的源属性（可能为 `true` 或 `false`）。

<code-example path="property-binding/src/app/app.component.html" region="disabled-button" header="src/app/app.component.html"></code-example>

Because the value of the property `isUnchanged` is `true` in the `AppComponent`, Angular disables the button.

由于 `AppComponent` 中属性 `isUnchanged` 的值是 `true`，Angular 会禁用该按钮。

<code-example path="property-binding/src/app/app.component.ts" region="boolean" header="src/app/app.component.ts"></code-example>

## What's next

## 下一步呢？

* [Property binding best practices](guide/property-binding-best-practices)

  [属性绑定的最佳实践](guide/property-binding-best-practices)

* [Event binding](guide/event-binding)

  [事件绑定](guide/event-binding)

* [Text Interpolation](guide/interpolation)

  [文本插值](guide/interpolation)

* [Class & Style Binding](guide/class-binding)

  [类和样式绑定](guide/class-binding)

* [Attribute Binding](guide/attribute-binding)

  [attribute 绑定](guide/attribute-binding)

@reviewed 2022-04-14
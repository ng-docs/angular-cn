# Event binding

Event binding lets you listen for and respond to user actions such as keystrokes, mouse movements, clicks, and touches.

通过事件绑定，你可以侦听并响应用户操作，例如按键、鼠标移动、点击和触摸。

<div class="alert is-helpful">

See the <live-example></live-example> for a working example containing the code snippets in this guide.

</div>

## Prerequisites

## 先决条件

* [Basics of components](guide/architecture-components)

  [组件基础](guide/architecture-components)

* [Basics of templates](guide/glossary#template)

  [模板基础](guide/glossary#template)

* [Binding syntax](guide/binding-syntax)

  [绑定语法](guide/binding-syntax)

* [Template statements](guide/template-statements)

## Binding to events

## 绑定到事件

To bind to an event you use the Angular event binding syntax.
This syntax consists of a target event name within parentheses to the left of an equal sign, and a quoted template statement to the right.

Create the following example; the target event name is `click` and the template statement is `onSave()`.

<code-example language="html" header="Event binding syntax">
&lt;button (click)="onSave()"&gt;Save&lt;/button&gt;
</code-example>

The event binding listens for the button's click events and calls the component's `onSave()` method whenever a click occurs.

事件绑定侦听按钮的单击事件，并在发生单击时调用组件的 `onSave()`。

<div class="lightbox">
  <img src='generated/images/guide/template-syntax/syntax-diagram.svg' alt="Syntax diagram">

</div>

### Determining an event target

### 确定事件目标（target）

To determine an event target, Angular checks if the name of the target event matches an event property of a known directive.

Create the following example: (Angular checks to see if `myClick` is an event on the custom `ClickDirective`)

<code-example path="event-binding/src/app/app.component.html" region="custom-directive" header="src/app/app.component.html"></code-example>

If the target event name, `myClick` fails to match an output property of `ClickDirective`, Angular will instead bind to the `myClick` event on the underlying DOM element.

## Binding to passive events

## 绑定到被动事件

This is an advanced technique that is not necessary for most applications. You may find this useful if you want to optimize frequently occurring events that are causing performance problems.

Angular also supports passive event listeners. For example, use the following steps to make a scroll event passive.

Angular 还支持被动事件侦听器。例如，使用以下步骤使滚动事件变为被动的。

1. Create a file `zone-flags.ts` under `src` directory.

   在 `src` 目录下创建一个文件 `zone-flags.ts` 。

2. Add the following line into this file.

   将以下行添加到此文件中。

3. In the `src/polyfills.ts` file, before importing zone.js, import the newly created `zone-flags`.

   在 `src/polyfills.ts` 文件中，在导入 zone.js 之前，先导入新创建的 `zone-flags` 。

```
import './zone-flags';
import 'zone.js';  // Included with Angular CLI.
```

After those steps, if you add event listeners for the `scroll` event, the listeners will be `passive`.

在这些步骤之后，如果你为 `scroll` 事件添加事件侦听器，侦听器就会是 `passive` 的。

## What's next

## 下一步是什么

* For more information on how event binding works, see [How event binding works](guide/event-binding-concepts).

  关于事件绑定工作原理的更多信息，请参阅[事件绑定工作原理](guide/event-binding-concepts)。

* [Property binding](guide/property-binding)

  [property 绑定](guide/property-binding)

* [Text interpolation](guide/interpolation)

* [Two-way binding](guide/two-way-binding)

@reviewed 2022-05-10
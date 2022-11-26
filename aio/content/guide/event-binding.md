# Event binding

# 事件绑定

Event binding lets you listen for and respond to user actions such as keystrokes, mouse movements, clicks, and touches.

通过事件绑定，你可以侦听并响应用户操作，比如按键、鼠标移动、点击和触摸。

<div class="alert is-helpful">

See the <live-example></live-example> for a working example containing the code snippets in this guide.

包含本指南中代码片段的可工作范例，参阅<live-example></live-example>。

</div>

## Prerequisites

## 前提条件

* [Basics of components](guide/architecture-components)

  [组件基础](guide/architecture-components)

* [Basics of templates](guide/glossary#template)

  [模板基础](guide/glossary#template)

* [Binding syntax](guide/binding-syntax)

  [绑定语法](guide/binding-syntax)

* [Template statements](guide/template-statements)

  [模板语句](guide/template-statements)

## Binding to events

## 绑定到事件

To bind to an event you use the Angular event binding syntax.
This syntax consists of a target event name within parentheses to the left of an equal sign, and a quoted template statement to the right.

要绑定到事件，你可以使用 Angular 事件绑定语法。此语法由等号左侧括号中的目标事件名称和右侧带引号的模板语句组成。

Create the following example; the target event name is `click` and the template statement is `onSave()`.

创建以下示例；目标事件名是 `click`，模板语句是 `onSave()`。

<code-example language="html" header="Event binding syntax">
&lt;button (click)="onSave()"&gt;Save&lt;/button&gt;
</code-example>

The event binding listens for the button's click events and calls the component's `onSave()` method whenever a click occurs.

事件绑定侦听按钮的单击事件，并在发生单击时调用组件的 `onSave()`。

<div class="lightbox">
  <img src='generated/images/guide/template-syntax/syntax-diagram.svg' alt="Syntax diagram">

</div>

### Determining an event target

### 确定事件目标

To determine an event target, Angular checks if the name of the target event matches an event property of a known directive.

为了确定事件目标，Angular 会检查目标事件的名称是否与已知指令的 event 属性匹配。

Create the following example: (Angular checks to see if `myClick` is an event on the custom `ClickDirective`)

创建以下示例：（Angular 会检查 `myClick` 是否是自定义 `ClickDirective` 上的事件）

<code-example path="event-binding/src/app/app.component.html" region="custom-directive" header="src/app/app.component.html"></code-example>

If the target event name, `myClick` fails to match an output property of `ClickDirective`, Angular will instead bind to the `myClick` event on the underlying DOM element.

如果目标事件名称 `myClick` 与 `ClickDirective` 的输出属性不匹配，Angular 将改为绑定到基础 DOM 元素上的 `myClick` 事件。

## Binding to passive events

## 绑定到被动事件

This is an advanced technique that is not necessary for most applications. You may find this useful if you want to optimize frequently occurring events that are causing performance problems.

这是一项高级技术，对于大多数应用程序来说不是必需的。如果你想优化导致性能问题的频繁发生的事件，可能会发现这很有用。

Angular also supports passive event listeners. For example, use the following steps to make a scroll event passive.

Angular 还支持被动事件侦听器。比如，使用以下步骤使滚动事件变为被动的。

1. Create a file `zone-flags.ts` under `src` directory.

   在 `src` 目录下创建一个文件 `zone-flags.ts`。

2. Add the following line into this file.

   将以下行添加到此文件中。

   ```typescript
   (window as any)['__zone_symbol__PASSIVE_EVENTS'] = ['scroll'];
   ```

3. In the `src/polyfills.ts` file, before importing zone.js, import the newly created `zone-flags`.

   在 `src/polyfills.ts` 文件中，在导入 zone.js 之前，先导入新创建的 `zone-flags`。

   ```typescript
   import './zone-flags';
   import 'zone.js';  // Included with Angular CLI.
   ```

After those steps, if you add event listeners for the `scroll` event, the listeners will be `passive`.

在这些步骤之后，如果你为 `scroll` 事件添加事件侦听器，侦听器就会是 `passive` 的。

## Binding to keyboard events

You can bind to keyboard events using Angular's binding syntax. You can specify the key or code that you would like to bind to keyboard events. They `key` and `code` fields are a native part of the browser keyboard event object. By default, event binding assumes you want to use the `key` field on the keyboard event. You can also use the `code` field.

Combinations of keys can be separated by a `.` (period). For example, `keydown.enter` will allow you to bind events to the `enter` key. You can also use modifier keys, such as `shift`, `alt`, `control`, and the `command` keys from Mac. The following example shows how to bind a keyboard event to `keydown.shift.t`.

```typescript
<input (keydown.shift.t)="onKeydown($event)" />
```

Depending on the operating system, some key combinations might create special characters instead of the key combination that you expect. MacOS, for example, creates special characters when you use the option and shift keys together. If you bind to `keydown.shift.alt.t`, on macOS, that combination produces a `ˇ` character instead of a `t`, which doesn't match the binding and won't trigger your event handler. To bind to `keydown.shift.alt.t` on macOS, use the `code` keyboard event field to get the correct behavior, such as `keydown.code.shiftleft.altleft.keyt` shown in this example.

```typescript
<input (keydown.code.shiftleft.altleft.keyt)="onKeydown($event)" />
```

The `code` field is more specific than the `key` field. The `key` field always reports `shift`, whereas the `code` field will specify `leftshift` or `rightshift`. When using the `code` field, you might need to add separate bindings to catch all the behaviors you want. Using the `code` field avoids the need to handle OS specific behaviors such as the `shift + option` behavior on macOS.

For more information, visit the full reference for [key](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values) and [code](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values) to help build out your event strings.

## What's next

## 接下来呢？

* For more information on how event binding works, see [How event binding works](guide/event-binding-concepts).

  关于事件绑定工作原理的更多信息，请参阅[事件绑定工作原理](guide/event-binding-concepts)。

* [Property binding](guide/property-binding)

  [property 绑定](guide/property-binding)

* [Text interpolation](guide/interpolation)

  [文本插值](guide/interpolation)

* [Two-way binding](guide/two-way-binding)

  [双向绑定](guide/two-way-binding)

@reviewed 2022-05-10
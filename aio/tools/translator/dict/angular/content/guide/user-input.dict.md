User input

用户输入

User actions such as clicking a link, pushing a button, and entering text raise DOM events.
This page explains how to bind those events to component event handlers using the Angular event binding syntax.

当用户点击链接、按下按钮或者输入文字时，这些用户动作都会产生 DOM 事件。本章解释如何使用 Angular 事件绑定语法把这些事件绑定到事件处理器。

Run the <live-example></live-example>.

运行<live-example></live-example>

Binding to user input events

绑定到用户输入事件

You can use [Angular event bindings](guide/event-binding) to respond to any [DOM event](https://developer.mozilla.org/docs/Web/Events).
Many DOM events are triggered by user input.
Binding to these events provides a way to get input from the user.

你可以使用 [Angular 事件绑定](guide/event-binding)机制来响应任何 [DOM 事件](https://developer.mozilla.org/docs/Web/Events)。
许多 DOM 事件是由用户输入触发的。绑定这些事件可以获取用户输入。

To bind to a DOM event, surround the DOM event name in parentheses and assign a quoted [template statement](guide/template-statements) to it.

要绑定 DOM 事件，只要把 DOM 事件的名字包裹在圆括号中，然后用放在引号中的[模板语句](guide/template-statements)对它赋值就可以了。

The following example shows an event binding that implements a click handler:

下例展示了一个事件绑定，它实现了一个点击事件处理器：

<a id="click"></a>



The `(click)` to the left of the equals sign identifies the button's click event as the **target of the binding**.
The text in quotes to the right of the equals sign is the **template statement**. The statement responds to the click event by calling the component's `onClickMe` method.

等号左边的 `(click)` 表示把按钮的点击事件作为**绑定目标**。等号右边引号中的文本是**模板语句**，通过调用组件的 `onClickMe` 方法来响应这个点击事件。

When writing a binding, be aware of a template statement's **execution context**.
The identifiers in a template statement belong to a specific context object, usually the Angular component controlling the template.
The preceding example shows a single line of HTML, but that HTML belongs to a larger component:

写绑定时，需要知道模板语句的**执行上下文**。出现在模板语句中的每个标识符都属于特定的上下文对象。这个对象通常都是控制此模板的 Angular 组件。上例中只显示了一行 HTML，那段 HTML 片段属于下面这个组件：

When the user clicks the button, Angular calls the `onClickMe` method from `ClickMeComponent`.

当用户点击按钮时，Angular 调用 `ClickMeComponent` 的 `onClickMe` 方法。

Get user input from the $event object

通过 $event 对象取得用户输入

DOM events carry a payload of information that may be useful to the component.
This section shows how to bind to the `keyup` event of an input box to get the user's input after each keystroke.

DOM 事件可以携带可能对组件有用的信息。本节将展示如何绑定输入框的 `keyup` 事件，在每个敲按键盘时获取用户输入。

The following code listens to the `keyup` event and passes the entire event payload \(`$event`\) to the component event handler.

下面的代码监听 `keyup` 事件，并将整个事件载荷 （`$event`） 传给组件的事件处理器。

When a user presses and releases a key, the `keyup` event occurs. Angular then provides a corresponding DOM event object in the `$event` variable which this code passes as a parameter to the component's `onKey()` method.

当用户按下并释放一个按键时，触发 `keyup` 事件，Angular 在 `$event` 变量提供一个相应的 DOM 事件对象，上面的代码将它作为参数传给 `onKey()` 方法。

The properties of an `$event` object vary depending on the type of DOM event.
For example, a mouse event includes different information than an input box editing event.

`$event` 对象的属性取决于 DOM 事件的类型。比如，鼠标事件与输入框编辑事件包含了不同的信息。

All [standard DOM event objects](https://developer.mozilla.org/docs/Web/API/Event) have a `target` property, a reference to the element that raised the event.
In this case, `target` refers to the [`<input>` element](https://developer.mozilla.org/docs/Web/API/HTMLInputElement) and `event.target.value` returns the current contents of that element.

所有[标准 DOM 事件对象](https://developer.mozilla.org/docs/Web/API/Event)都有一个 `target` 属性，
引用触发该事件的元素。
在本例中，`target` 是[`<input>` 元素](https://developer.mozilla.org/docs/Web/API/HTMLInputElement)，
`event.target.value` 返回该元素的当前内容。

After each call, the `onKey()` method appends the contents of the input box value to the list in the component's `values` property, followed by a separator character \(`|`\).
The [interpolation](guide/interpolation) displays the accumulating input box changes from the `values` property.

在组件的 `onKey()` 方法中，把输入框的值和分隔符 （`|`） 追加组件的 `values` 属性。
使用[插值](guide/interpolation)来把存放累加结果的 `values` 属性回显到屏幕上。

Suppose the user enters the letters "abc" and then backspaces to remove them one by one.
Here's what the UI displays:

假设用户输入字母“abc”，然后用退格键一个一个删除它们。用户界面将显示：

<a id="keyup1"></a>



Type the `$event`

`$event` 的类型

The preceding example casts the `$event` as an `any` type.
That simplifies the code at a cost.
There is no type information that could reveal properties of the event object and prevent silly mistakes.

上例将 `$event` 转换为 `any` 类型。这样简化了代码，但是有成本。没有任何类型信息能够揭示事件对象的属性，防止简单的错误。

The following example rewrites the method with types:

下面的例子，使用了带类型方法：

The `$event` is now a specific `KeyboardEvent`.
Not all elements have a `value` property so it casts `target` to an input element.
The `OnKey` method more clearly expresses what it expects from the template and how it interprets the event.

`$event` 的类型现在是 `KeyboardEvent`。不是所有的元素都有 `value` 属性，所以它将 `target` 转换为输入元素。`OnKey` 方法更加清晰地表达了它期望从模板得到什么，以及它是如何解析事件的。

Passing `$event` is a dubious practice

传入 `$event` 是靠不住的做法

Typing the event object reveals a significant objection to passing the entire DOM event into the method. Namely, the component has too much awareness of the template details.
It can't extract information without knowing more than it should about the HTML implementation.
That breaks the separation of concerns between the template, *what the user sees*, and the component, *how the application processes user data*.

类型化事件对象揭露了重要的一点，即反对把整个 DOM 事件传到方法中，因为这样组件会知道太多模板的信息。只有当它知道更多它本不应了解的 HTML 实现细节时，它才能提取信息。这就违反了模板（*用户看到的*）和组件（*应用如何处理用户数据*）之间的分离关注原则。

The next section shows how to use template reference variables to address this problem.

下面将介绍如何用模板引用变量来解决这个问题。

Get user input from a template reference variable

从一个模板引用变量中获得用户输入

There's another way to get the user data:
use Angular [**template reference variables**](guide/template-reference-variables).
These variables provide direct access to an element from within the template.
To declare a template reference variable, precede an identifier with a hash/pound character \(`#`\).

还有另一种获取用户数据的方式：使用 Angular 的[**模板引用变量**](guide/template-reference-variables)。
这些变量提供了从模块中直接访问元素的能力。
在标识符前加上井号 （`#`） 就能声明一个模板引用变量。

The following example uses a template reference variable to implement a keystroke loopback in a simple template.

下面的例子使用了局部模板变量，在一个超简单的模板中实现按键反馈功能。

The template reference variable named `box`, declared on the `<input>` element, refers to the `<input>` element itself.
The code uses the `box` variable to get the input element's `value` and display it with interpolation between `<p>` tags.

这个模板引用变量名叫 `box`，在 `<input>` 元素声明，它引用 `<input>` 元素本身。代码使用 `box` 获得输入元素的 `value` 值，并通过插值把它显示在 `<p>` 标签中。

The template is completely self-contained.
It doesn't bind to the component, and the component does nothing.

这个模板完全是完全自包含的。它没有绑定到组件，组件也没做任何事情。

Type something in the input box, and watch the display update with each keystroke.

在输入框中输入，就会看到每次按键时，显示也随之更新了。

It's easier to get to the input box with the template reference variable than to go through the `$event` object.
Here's a rewrite of the previous `keyup` example that uses a template reference variable to get the user's input.

从模板变量获得输入框比通过 `$event` 对象更加简单。下面的代码重写了之前 `keyup` 范例，它使用变量来获得用户输入。

A nice aspect of this approach is that the component gets clean data values from the view.
It no longer requires knowledge of the `$event` and its structure.

这个方法最漂亮的一点是：组件代码从视图中获得了干净的数据值。再也不用了解 `$event` 变量及其结构了。

<a id="key-event"></a>



Key event filtering \(with `key.enter`\)

按键事件过滤（通过 `key.enter`）

The `(keyup)` event handler hears *every keystroke*.
Sometimes only the *Enter* key matters, because it signals that the user has finished typing.
One way to reduce the noise would be to examine every `$event.keyCode` and take action only when the key is *Enter*.

`(keyup)` 事件处理器监听*每一次按键*。有时只在意*回车*键，因为它标志着用户结束输入。解决这个问题的一种方法是检查每个 `$event.keyCode`，只有键值是*回车*键时才采取行动。

There's an easier way:
bind to Angular's `keyup.enter` pseudo-event.
Then Angular calls the event handler only when the user presses *Enter*.

更简单的方法是：绑定到 Angular 的 `keyup.enter` 模拟事件。然后，只有当用户敲*回车*键时，Angular 才会调用事件处理器。

Here's how it works.

下面展示了它的工作原理。

On blur

失焦事件 （blur）

In the previous example, the current state of the input box is lost if the user mouses away and clicks elsewhere without first pressing *Enter*.
The component's `value` property is updated only when the user presses *Enter*.

前上例中，如果用户没有先按回车键，而是移开了鼠标，点击了页面中其它地方，输入框的当前值就会丢失。只有当用户按下了回车键候，组件的 `value` 属性才能更新。

To fix this issue, listen to both the *Enter* key and the `blur` event.

下面通过同时监听输入框的回车键和 `blur` 事件来修正这个问题。

Put it all together

把它们放在一起

This page demonstrated several event binding techniques.

本章展示了一些事件绑定技术。

Now, put it all together in a micro-app that can display a list of heroes and add new heroes to the list.
The user can add a hero by typing the hero's name in the input box and clicking **Add**.

现在，在一个微型应用中一起使用它们，应用能显示一个英雄列表，并把新的英雄加到列表中。用户可以通过输入英雄名和点击“添加”按钮来添加英雄。

Below is the "Little Tour of Heroes" component.

下面就是“简版英雄之旅”组件。

Observations

小结

Keep template statements simple

保持模板语句简单

The `(blur)` event is bound to two JavaScript statements. The first statement calls `addHero`. The second statement, `newHero.value=''`, clears the input box after a new hero is added to the list.

`(blur)` 事件被绑定到两个 JavaScript 语句。第一句调用 `addHero`。第二句 `newHero.value=''` 在添加新英雄到列表中后清除输入框。

Pass values, not elements

传递数值，而非元素

Instead of passing the `newHero` into the component's `addHero` method, get the input box value and pass *that* to `addHero`.

获取输入框的值并将*它*传给组件的 `addHero`，而不要传递 `newHero`。

Use template variables to refer to elements

使用模板变量来引用元素

The `newHero` template variable refers to the `<input>` element. You can reference `newHero` from any sibling or child of the `<input>` element.

`newHero` 模板变量引用了 `<input>` 元素。你可以在 `<input>` 的任何兄弟或子级元素中引用 `newHero`。

Details

详情

Source code

源代码

Following is all the code discussed in this page.

下面是本章讨论过的所有源码。

Angular also supports passive event listeners.
For example, you can use the following steps to make the scroll event passive.

Angular 还支持被动事件监听器。比如，你可以使用以下步骤使滚动事件变为被动监听。

Create a file `zone-flags.ts` under `src` directory.

在 `src` 目录下创建一个文件 `zone-flags.ts`。

Add the following line into this file.

将以下行添加到此文件中。

In the `src/polyfills.ts` file, before importing zone.js, import the newly created `zone-flags`.

在 `src/polyfills.ts` 文件中，在导入 zone.js 之前，先导入新创建的 `zone-flags`。

After those steps, if you add event listeners for the `scroll` event, the listeners are going to be `passive`.

在这些步骤之后，如果你为 `scroll` 事件添加事件侦听器，侦听器就会是 `passive` 的。

Summary

小结

You have mastered the basic primitives for responding to user input and gestures.

你已经掌握了响应用户输入和操作的基础技术。

These techniques are useful for small-scale demonstrations, but they quickly become verbose and clumsy when handling large amounts of user input.
Two-way data binding is a more elegant and compact way to move values between data entry fields and model properties.
The [`Forms`](guide/forms-overview) page explains how to write two-way bindings with `NgModel`.

这些技术对小规模演示很实用，但是在处理大量用户输入时，很容易变得累赘和笨拙。要在数据录入字段和模型属性之间传递数据，双向数据绑定是更加优雅和简洁的方式。下一章 `表单` 解释了如何用 `NgModel` 来进行双向绑定。
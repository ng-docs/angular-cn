We must check whether the agent is Android because composition events
behave differently between iOS and Android.

我们必须检查代理是否是 Android，因为组合事件在 iOS 和 Android 之间的行为方式不同。

Provide this token to control if form directives buffer IME input until
the "compositionend" event occurs.

提供此令牌来控制表单指令是否要缓冲 IME 输入，直到发生“ compositionend” 事件为止。

Using the default value accessor

使用默认值访问器

The following example shows how to use an input element that activates the default value accessor
\(in this case, a text field\).

以下示例演示了如何使用输入元素激活默认值访问器（在这种情况下为文本字段）。

This value accessor is used by default for `<input type="text">` and `<textarea>` elements, but
you could also use it for custom components that have similar behavior and do not require special
processing. In order to attach the default value accessor to a custom element, add the
`ngDefaultControl` attribute as shown below.

默认情况下，此值访问器用于 `<input type="text">` 和 `<textarea>`
元素，但你也可以将其用于具有类似行为且不需要特殊处理的自定义组件。为了将默认值访问器附加到自定义元素，请添加
`ngDefaultControl` 属性，如下所示。

The default `ControlValueAccessor` for writing a value and listening to changes on input
elements. The accessor is used by the `FormControlDirective`, `FormControlName`, and
`NgModel` directives.

默认的 `ControlValueAccessor`，用于写入值并监听输入元素的更改。该访问器供 `FormControlDirective`
、`FormControlName` 和 `NgModel` 指令使用。

{&commat;searchKeywords ngDefaultControl}



Sets the "value" property on the input element.

在输入元素上设置 “value” 属性。
Mock interface for HTML Options

HTML 选项的模拟接口

Mock interface for HTMLCollection

HTMLCollection 的模拟接口

The `ControlValueAccessor` for writing multi-select control values and listening to multi-select
control changes. The value accessor is used by the `FormControlDirective`, `FormControlName`, and
`NgModel` directives.

本 `ControlValueAccessor` 用于写入多选控件值和监听多选控件更改。这个值访问器由
`FormControlDirective`、`FormControlName` 和 `NgModel` 指令使用。

Using a multi-select control

使用多选控件

The follow example shows you how to use a multi-select control with a reactive form.

下面的示例向你演示了如何将多选控件与响应式表单一起使用。

Customizing option selection

自定义选项选取方式

To customize the default option comparison algorithm, `<select>` supports `compareWith` input.
See the `SelectControlValueAccessor` for usage.

要自定义默认的选项比较算法，可以用 `<select>` 支持的输入属性 `compareWith`。有关用法，请参见
`SelectControlValueAccessor`

The current value.

当前值。

Tracks the option comparison algorithm for tracking identities when
checking for changes.

跟踪选项的比较算法，以在检查更改时跟踪其标识。

Sets the "value" property on one or of more of the select's options.

在此 select 的一个或多个选项上设置 “value” 属性。

Registers a function called when the control value changes
and writes an array of the selected options.

注册一个当控件的值更改并写入所选选项的数组时要调用的函数。

Marks `<option>` as dynamic, so Angular can be notified when options change.

将 `<option>` 标记为动态，以便在选项更改时通知 Angular。

Tracks the value bound to the option element. Unlike the value binding,
ngValue supports binding to objects.

跟踪绑定到选项元素的值。与值绑定不同，ngValue 支持绑定到对象。

Tracks simple string values bound to the option element.
For objects, use the `ngValue` input binding.

跟踪绑定到 option 元素的简单字符串值。对于对象，请使用 `ngValue` 输入绑定。
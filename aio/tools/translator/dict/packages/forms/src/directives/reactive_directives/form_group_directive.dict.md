Binds an existing `FormGroup` or `FormRecord` to a DOM element.

将现有的 `FormGroup` 绑定到 DOM 元素。

This directive accepts an existing `FormGroup` instance. It will then use this
`FormGroup` instance to match any child `FormControl`, `FormGroup`/`FormRecord`,
and `FormArray` instances to child `FormControlName`, `FormGroupName`,
and `FormArrayName` directives.

该指令接受现有的 `FormGroup` 实例。然后，它将使用此 `FormGroup` 实例中的任何子控件
`FormControl`、`FormGroup` 和 `FormArray` 的实例与其子指令 `FormControlName`、`FormGroupName` 和
`FormArrayName` 匹配。

[Reactive Forms Guide](guide/reactive-forms)

[响应式表单指南](guide/reactive-forms)

Register Form Group

注册表单组

The following example registers a `FormGroup` with first name and last name controls,
and listens for the *ngSubmit* event when the button is clicked.

下面的示例使用名字和姓氏控件 `FormGroup`，并在单击按钮时*侦听 ngSubmit 事件。*

{&commat;example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}



Reports whether the form submission has been triggered.

报告是否已触发表单提交。

Tracks the list of added `FormControlName` instances

跟踪已添加的 `FormControlName` 实例的列表

Tracks the `FormGroup` bound to this directive.

跟踪绑定到此指令的 `FormGroup`。

Emits an event when the form submission has been triggered.

触发表单提交后，发出事件。

Returns this directive's instance.

返回此指令的实例。

Returns the `FormGroup` bound to this directive.

返回绑定到该指令的 `FormGroup`。

Returns an array representing the path to this group. Because this directive
always lives at the top level of a form, it always an empty array.

返回表示该表单组的路径的数组。由于此指令始终位于表单的顶层，因此它始终为空数组。

Method that sets up the control directive in this group, re-calculates its value
and validity, and adds the instance to the internal list of directives.

在该组中设置控件指令，重新计算其值和有效性并将该实例添加到内部指令列表的方法。

The `FormControlName` directive instance.

`FormControlName` 指令实例。

Retrieves the `FormControl` instance from the provided `FormControlName` directive

从给定 `FormControlName` 指令中检索 `FormControl`

Removes the `FormControlName` instance from the internal list of directives

从内部指令列表中删除此 `FormControlName` 实例

The `FormGroupName` directive instance.

`FormGroupName` 指令实例。

Adds a new `FormGroupName` directive instance to the form.

将新的 `FormGroupName` 指令实例添加到表单。

Performs the necessary cleanup when a `FormGroupName` directive instance is removed from the
view.

用于删除表单组的空白方法。

Retrieves the `FormGroup` for a provided `FormGroupName` directive instance

检索给定 `FormGroupName` 指令实例的 `FormGroup`

The `FormArrayName` directive instance.

`FormArrayName` 指令实例。

Performs the necessary setup when a `FormArrayName` directive instance is added to the view.

向表单添加一个新的 `FormArrayName` 指令实例。

Performs the necessary cleanup when a `FormArrayName` directive instance is removed from the
view.

用于删除表单组的空白方法。

Retrieves the `FormArray` for a provided `FormArrayName` directive instance.

检索给定 `FormArrayName` 指令实例的 `FormArray`。

The new value for the directive's control.

指令控件的新值。

Sets the new value for the provided `FormControlName` directive.

为给定 `FormControlName` 指令设置新值。

Method called with the "submit" event is triggered on the form.
Triggers the `ngSubmit` emitter to emit the "submit" event as its payload.

当表单上触发了 “submit” 事件时要调用的方法。触发带有 “submit” 事件的 `ngSubmit`。

Method called when the "reset" event is triggered on the form.

在表单上触发“reset”事件时调用的方法。

Resets the form to an initial value and resets its submitted status.

将表单重置为初始值并重置其提交状态。

The new value for the form.

表单的新值。
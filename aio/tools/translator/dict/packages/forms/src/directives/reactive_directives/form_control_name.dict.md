Syncs a `FormControl` in an existing `FormGroup` to a form control
element by name.

根据名字将现有 `FormGroup` 中的 `FormControl` 与一个表单控件进行同步。

[Reactive Forms Guide](guide/reactive-forms)

[响应式表单指南](guide/reactive-forms)

Register `FormControl` within a group

把 `FormControl` 注册进一个组

The following example shows how to register multiple form controls within a form group
and set their value.

下面的例子演示了如何把多个表单控件注册进一个表单组，并设置它们的值。

{&commat;example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}



To see `formControlName` examples with different form control types, see:

要查看把 `formControlName` 应用于不同类型的表单控件的例子，参见：

Radio buttons: `RadioControlValueAccessor`

单选按钮: `RadioControlValueAccessor`

Selects: `SelectControlValueAccessor`

单选下拉框: `SelectControlValueAccessor`

Use with ngModel is deprecated

和 ngModel 一起使用

Support for using the `ngModel` input property and `ngModelChange` event with reactive
form directives has been deprecated in Angular v6 and is scheduled for removal in
a future version of Angular.

在 Angular v6 中已弃用对使用 `ngModel` 输入属性和 `ngModelChange` 事件的响应式指令的支持，并计划在 Angular 的未来版本中删除。

For details, see [Deprecated features](guide/deprecations#ngmodel-with-reactive-forms).

有关详细信息，请参阅[弃用的功能](guide/deprecations#ngmodel-with-reactive-forms)。

Internal reference to the view model value.

对视图模型值的内部引用。

Tracks the `FormControl` instance bound to the directive.

跟踪绑定到此指令的 `FormControl` 实例。

Tracks the name of the `FormControl` bound to the directive. The name corresponds
to a key in the parent `FormGroup` or `FormArray`.
Accepts a name as a string or a number.
The name in the form of a string is useful for individual forms,
while the numerical form allows for form controls to be bound
to indices when iterating over controls in a `FormArray`.

跟踪绑定到此指令的 `FormControl` 名称。该名称对应于父 `FormGroup` 或 `FormArray`
中的键。接受字符串形式的名称或数字。字符串形式的名称对于独立表单很有用，而数字形式则允许在
`FormArray` 控件上进行迭代时将表单控件绑定到索引。

Triggers a warning in dev mode that this input should not be used with reactive forms.

在开发人员模式下触发警告，该输入不应与响应式表单一起使用。

as of v6

从 v6 开始

Static property used to track whether any ngModel warnings have been sent across
all instances of FormControlName. Used to support warning config of "once".

静态属性，用于跟踪是否曾在所有的 `FormControlName` 实例中发出过这种 ngModel
警告。用于支持警告选项 `"once"`。

Instance property used to track whether an ngModel warning has been sent out for this
particular FormControlName instance. Used to support warning config of "always".

实例属性，用于跟踪是否曾在特定的 `FormControlName` 实例中发出过这种 ngModel
警告。用于支持警告选项 `"always"`

Sets the new value for the view model and emits an `ngModelChange` event.

设置视图模型的新值并发出 `ngModelChange` 事件。

The new value for the view model.

视图模型的新值。

Returns an array that represents the path from the top-level form to this control.
Each index is the string name of the control on that level.

返回一个数组，该数组表示从顶级表单到此控件的路径。每个索引是该级别上控件的字符串名称。

The top-level directive for this group if present, otherwise null.

该组的顶级指令（如果存在），否则为 null。
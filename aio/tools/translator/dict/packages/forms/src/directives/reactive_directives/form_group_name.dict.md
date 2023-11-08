Syncs a nested `FormGroup` or `FormRecord` to a DOM element.

将嵌套的 `FormGroup` 同步到 DOM 元素上。

This directive can only be used with a parent `FormGroupDirective`.

本指令只能与父 `FormGroupDirective` 一起使用。

It accepts the string name of the nested `FormGroup` or `FormRecord` to link, and
looks for a `FormGroup` or `FormRecord` registered with that name in the parent
`FormGroup` instance you passed into `FormGroupDirective`.

它接受嵌套的字符串名称 `FormGroup` 链接，并寻找使用这个名字在你传给 `FormGroupDirective` 的父
`FormGroup` 实例中注册的 `FormGroup`。

Use nested form groups to validate a sub-group of a
form separately from the rest or to group the values of certain
controls into their own nested object.

使用嵌套表单组可以与其余表单分开验证表单的子组，也可以将某些控件的值分组到自己的嵌套对象中。

[Reactive Forms Guide](guide/reactive-forms)

[响应式表单指南](guide/reactive-forms)

Access the group by name

按名称访问组

The following example uses the `AbstractControl.get` method to access the
associated `FormGroup`

下面的示例使用 {&commat;link AbstractControl#get get} 方法访问关联的 `FormGroup`

Access individual controls in the group

访问组中的各个控件

The following example uses the `AbstractControl.get` method to access
individual controls within the group using dot syntax.

下面的示例使用 {&commat;link AbstractControl#get get} 方法使用点语法访问组中的各个控件。

Register a nested `FormGroup`.

注册一个嵌套的 `FormGroup`。

The following example registers a nested *name* `FormGroup` within an existing `FormGroup`,
and provides methods to retrieve the nested `FormGroup` and individual controls.

下面的示例在现有 `FormGroup` 注册一个嵌套*名称*的 `FormGroup`，并提供检索嵌套 `FormGroup`
和各个控件的方法。

{&commat;example forms/ts/nestedFormGroup/nested_form_group_example.ts region='Component'}



Tracks the name of the `FormGroup` bound to the directive. The name corresponds
to a key in the parent `FormGroup` or `FormArray`.
Accepts a name as a string or a number.
The name in the form of a string is useful for individual forms,
while the numerical form allows for form groups to be bound
to indices when iterating over groups in a `FormArray`.

跟踪绑定到此指令的 `FormGroup` 名称。该名称对应于父 `FormGroup` 或 `FormArray`
中的键名。接受字符串或数字形式的名称。字符串形式的名称对于单个表单很有用，而数字形式则允许在
`FormArray` 组上进行迭代时将表单组绑定到索引。

Syncs a nested `FormArray` to a DOM element.

将嵌套的 `FormArray` 同步到 DOM 元素。

This directive is designed to be used with a parent `FormGroupDirective` \(selector:
`[formGroup]`\).

此指令旨在与父 `FormGroupDirective`（选择器为 `[formGroup]`）一起使用。

It accepts the string name of the nested `FormArray` you want to link, and
will look for a `FormArray` registered with that name in the parent
`FormGroup` instance you passed into `FormGroupDirective`.

它接受你要链接的嵌套 `FormArray` 的字符串名称，并寻找使用这个名字在你传给 `FormGroupDirective`
的父 `FormGroup` 实例中注册的 `FormGroup`。

Example

例子

{&commat;example forms/ts/nestedFormArray/nested_form_array_example.ts region='Component'}



Tracks the name of the `FormArray` bound to the directive. The name corresponds
to a key in the parent `FormGroup` or `FormArray`.
Accepts a name as a string or a number.
The name in the form of a string is useful for individual forms,
while the numerical form allows for form arrays to be bound
to indices when iterating over arrays in a `FormArray`.

跟踪绑定到指令 `FormArray` 的名称。该名称对应于父 `FormGroup` 或 `FormArray`
中的键名。接受字符串或数字形式的名称。字符串形式的名称对于单个表单很有用，而数字形式则允许在
`FormArray` 数组上进行迭代时将表单数组绑定到索引。

If the directive does not have a valid parent.

如果指令没有有效的父项。

A lifecycle method called when the directive's inputs are initialized. For internal use only.

已初始化指令的各个输入属性时要调用的生命周期方法。仅限内部使用。

A lifecycle method called before the directive's instance is destroyed. For internal use only.

销毁指令实例之前调用的生命周期方法。仅限内部使用。

The `FormArray` bound to this directive.

要绑定到此指令的 `FormArray`。

The top-level directive for this group if present, otherwise null.

该组的顶级指令（如果存在），否则为 null。

Returns an array that represents the path from the top-level form to this control.
Each index is the string name of the control on that level.

返回一个数组，该数组表示从顶级表单到此控件的路径。每个索引是该级别上控件的字符串名称。
Creates and binds a `FormGroup` instance to a DOM element.

创建 `FormGroup` 的实例并将其绑定到 DOM 元素。

This directive can only be used as a child of `NgForm` \(within `<form>` tags\).

此指令只能用作 `NgForm` 的子级（在 `<form>` 标记内）。

Use this directive to validate a sub-group of your form separately from the
rest of your form, or if some values in your domain model make more sense
to consume together in a nested object.

使用此指令可以独立于表单的其余部分来验证表单的子组，或者当把领域模型中的某些值和嵌套对象一起使用更有意义时。

Provide a name for the sub-group and it will become the key
for the sub-group in the form's full value. If you need direct access, export the directive into
a local template variable using `ngModelGroup` \(ex: `#myGroup="ngModelGroup"`\).

为子组提供一个名称，它将成为表单完整值中子组的关键字。如果你需要直接访问它，可以使用
`ngModelGroup`（比如：`#myGroup="ngModelGroup"`）来把此指令导出到本地模板变量中。

Consuming controls in a grouping

在表单组中使用控件

The following example shows you how to combine controls together in a sub-group
of the form.

下面的示例向你展示了如何在表单的子组中将控件组合在一起。

{&commat;example forms/ts/ngModelGroup/ng_model_group_example.ts region='Component'}



Tracks the name of the `NgModelGroup` bound to the directive. The name corresponds
to a key in the parent `NgForm`.

跟踪绑定到指令 `NgModelGroup` 的名称。该名称对应于父 `NgForm` 中的键名。
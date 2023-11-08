Creates a top-level `FormGroup` instance and binds it to a form
to track aggregate form value and validation status.

创建一个顶级的 `FormGroup` 实例，并把它绑定到一个表单，以跟踪表单的聚合值及其验证状态。

As soon as you import the `FormsModule`, this directive becomes active by default on
all `<form>` tags.  You don't need to add a special selector.

只要你导入了 `FormsModule`，该指令就会默认在所有 `<form>`
标签上生效。你不需要再添加任何特殊的选择器。

You optionally export the directive into a local template variable using `ngForm` as the key
\(ex: `#myForm="ngForm"`\). This is optional, but useful.  Many properties from the underlying
`FormGroup` instance are duplicated on the directive itself, so a reference to it
gives you access to the aggregate value and validity status of the form, as well as
user interaction properties like `dirty` and `touched`.

你可以以 `ngForm` 作为 key 把该指令导出到一个局部模板变量（如
`#myForm="ngForm"`）。这是可选的，但很有用。来自本指令背后的 `FormGroup`
实例的很多属性，都被复制到了指令自身，所以拿到一个对该指令的引用就可以让你访问此表单的聚合值和验证状态，
还有那些用户交互类的属性，比如 `dirty` 和 `touched`。

To register child controls with the form, use `NgModel` with a `name`
attribute. You may use `NgModelGroup` to create sub-groups within the form.

要使用该表单注册的子控件，请使用带有 `name` 属性的 `NgModel`。你可以使用 `NgModelGroup`
在表单中创建子组。

If necessary, listen to the directive's `ngSubmit` event to be notified when the user has
triggered a form submission. The `ngSubmit` event emits the original form
submission event.

如果需要，还可以监听该指令的 `ngSubmit` 事件，以便当用户触发了一次表单提交时得到通知。发出
`ngSubmit` 事件时，会携带原始的 DOM 表单提交事件。

In template driven forms, all `<form>` tags are automatically tagged as `NgForm`.
To import the `FormsModule` but skip its usage in some forms,
for example, to use native HTML5 validation, add the `ngNoForm` and the `<form>`
tags won't create an `NgForm` directive. In reactive forms, using `ngNoForm` is
unnecessary because the `<form>` tags are inert. In that case, you would
refrain from using the `formGroup` directive.

在模板驱动表单中，所有 `<form>` 标签都会自动应用上 `NgForm` 指令。
如果你只想导入 `FormsModule` 而不想把它应用于某些表单中，比如，要想使用 HTML5 验证，你可以添加
`ngNoForm` 属性，这样标签就不会在 `<form>` 上创建 `NgForm` 指令了。在响应式表单中，则不需要用
`ngNoForm`，因为 `NgForm` 指令不会自动应用到 `<form>` 标签上，你只要别主动添加 `formGroup`
指令就可以了。

Listening for form submission

监听表单提交

The following example shows how to capture the form values from the "ngSubmit" event.

下面的示例显示如何从 “ngSubmit” 事件中捕获表单值。

{&commat;example forms/ts/simpleForm/simple_form_example.ts region='Component'}



Setting the update options

设置更新选项

The following example shows you how to change the "updateOn" option from its default using
ngFormOptions.

以下示例向你展示了如何使用 ngFormOptions 更改“updateOn”选项的默认值。

Native DOM validation UI

原生 DOM 验证 UI

In order to prevent the native DOM form validation UI from interfering with Angular's form
validation, Angular automatically adds the `novalidate` attribute on any `<form>` whenever
`FormModule` or `ReactiveFormModule` are imported into the application.
If you want to explicitly enable native DOM validation UI with Angular forms, you can add the
`ngNativeValidate` attribute to the `<form>` element:

为了防止原生 DOM 表单验证 UI 干扰 Angular 的表单验证，每当将 `FormModule` 或 `ReactiveFormModule` 导入应用程序时，Angular 都会自动在任何 `<form>` 上添加 `novalidate` 属性。如果你想显式启用 Angular 表单的原生 DOM 验证 UI，你可以将 `ngNativeValidate` 属性添加到 `<form>` 元素：

Returns whether the form submission has been triggered.

返回是否已触发表单提交。

The `FormGroup` instance created for this form.

为此表单创建的 `FormGroup`

Event emitter for the "ngSubmit" event

“ngSubmit” 的事件发射器

Tracks options for the `NgForm` instance.

`NgForm` 实例的选项。接受下列属性：

**updateOn**: Sets the default `updateOn` value for all child `NgModels` below it
unless explicitly set by a child `NgModel` using `ngModelOptions`\). Defaults to 'change'.
Possible values: `'change'` \| `'blur'` \| `'submit'`

**updateOn**：为所有子级的 `NgModel` 设置 `updateOn` 的默认值（除非子 `NgModel` 通过
`ngModelOptions` 显式指定了这个值）。可能的值有：`'change'` \| `'blur'` \| `'submit'`.

The directive instance.

指令实例。

The internal `FormGroup` instance.

内部 `FormGroup` 实例。

Returns an array representing the path to this group. Because this directive
always lives at the top level of a form, it is always an empty array.

返回表示该组路径的数组。由于此指令始终位于调用表单的顶层，因此它始终是一个空数组。

Returns a map of the controls in this group.

返回此组中控件的映射表。

Method that sets up the control directive in this group, re-calculates its value
and validity, and adds the instance to the internal list of directives.

在该组中设置控件指令，重新计算其值和有效性并将该实例添加到内部指令列表的方法。

The `NgModel` directive instance.

`NgModel` 指令实例。

Retrieves the `FormControl` instance from the provided `NgModel` directive.

从提供的 `NgModel` 指令中检索 `FormControl`

Removes the `NgModel` instance from the internal list of directives

从指令的内部列表中删除 `NgModel`

Adds a new `NgModelGroup` directive instance to the form.

向表单添加一个新的 `NgModelGroup` 指令实例。

The `NgModelGroup` directive instance.

`NgModelGroup` 指令实例。

Removes the `NgModelGroup` directive instance from the form.

从表单中删除 `NgModelGroup`

Retrieves the `FormGroup` for a provided `NgModelGroup` directive instance

为所提供的 `NgModelGroup` 指令实例检索其 `FormGroup`

The `NgControl` directive instance.

`NgControl` 指令实例。

The new value for the directive's control.

指令控件的新值。

Sets the new value for the provided `NgControl` directive.

为所提供的 `NgControl` 指令设置新值。

Sets the value for this `FormGroup`.

设置此 `FormGroup` 的值。

The new value

新值

Method called when the "submit" event is triggered on the form.
Triggers the `ngSubmit` emitter to emit the "submit" event as its payload.

在表单上触发 “submit” 事件时调用的方法。触发 `ngSubmit` 发出 “submit” 事件。

Method called when the "reset" event is triggered on the form.

在表单上触发 “reset” 事件时要调用的方法。

Resets the form to an initial value and resets its submitted status.

将表单重置为初始值并重置其提交状态。

The new value for the form.

表单的新值。
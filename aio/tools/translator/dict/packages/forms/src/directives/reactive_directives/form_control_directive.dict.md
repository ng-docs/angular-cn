Token to provide to turn off the ngModel warning on formControl and formControlName.

要提供以关闭 formControl 和 formControlName 上的 ngModel 警告的标记。

Synchronizes a standalone `FormControl` instance to a form control element.

将独立的 `FormControl` 实例同步到表单控件元素。

Note that support for using the `ngModel` input property and `ngModelChange` event with reactive
form directives was deprecated in Angular v6 and is scheduled for removal in
a future version of Angular.
For details, see [Deprecated features](guide/deprecations#ngmodel-with-reactive-forms).

请注意，已弃用将 `ngModel` 输入属性和 `ngModelChange`
事件与响应式表单指令一起使用的方式，并计划在 Angular
的未来版本中删除。有关详细信息，请参阅[已弃用特性](guide/deprecations#ngmodel-with-reactive-forms)。

[Reactive Forms Guide](guide/reactive-forms)

[响应式表单指南](guide/reactive-forms)

The following example shows how to register a standalone control and set its value.

下面的示例演示如何注册独立控件并设置其值。

{&commat;example forms/ts/simpleFormControl/simple_form_control_example.ts region='Component'}



Internal reference to the view model value.

对视图模型值的内部引用。

Tracks the `FormControl` instance bound to the directive.

跟踪绑定到本指令的 `FormControl` 实例。

Triggers a warning in dev mode that this input should not be used with reactive forms.

在开发人员模式下触发警告，该输入不应与响应式表单一起使用。

as of v6

从 v6 开始

Static property used to track whether any ngModel warnings have been sent across
all instances of FormControlDirective. Used to support warning config of "once".

静态属性，用于跟踪是否已在 FormControlDirective 的所有实例之间发送任何 ngModel 警告。用于支持
"once" 警告配置。

Instance property used to track whether an ngModel warning has been sent out for this
particular `FormControlDirective` instance. Used to support warning config of "always".

实例属性，用于跟踪是否已为此特定 `FormControlDirective` 实例发送过 ngModel 警告。用于支持
"always" 警告配置。

Returns an array that represents the path from the top-level form to this control.
Each index is the string name of the control on that level.

返回一个数组，该数组表示从顶级表单到此控件的路径。每个索引是该级别上控件的字符串名称。

The `FormControl` bound to this directive.

绑定到此指令的 `FormControl`。

Sets the new value for the view model and emits an `ngModelChange` event.

设置视图模型的新值并发出 `ngModelChange` 事件。

The new value for the view model.

视图模型的新值。
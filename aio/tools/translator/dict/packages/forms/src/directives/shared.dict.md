Token to provide to allow SetDisabledState to always be called when a CVA is added, regardless of
whether the control is disabled or enabled.

要提供以允许在添加 CVA 时始终调用 SetDisabledState 的标记，无论控件是禁用还是启用。

The type for CALL_SET_DISABLED_STATE. If `always`, then ControlValueAccessor will always call
`setDisabledState` when attached, which is the most correct behavior. Otherwise, it will only be
called when disabled, which is the legacy behavior for compatibility.

CALL_SET_DISABLED_STATE 的类型。如果 `always`，则 ControlValueAccessor 将在附加时始终调用 `setDisabledState`，这是最正确的行为。否则，它只会在禁用时被调用，这是为了兼容的传统行为。

Whether to use the fixed setDisabledState behavior by default.

默认情况下，是否使用固定的 setDisabledState 行为。

Form control instance that should be linked.

应该链接的表单控件实例。

Directive that should be linked with a given control.

应该与给定控件链接的指令。

Links a Form control and a Form directive by setting up callbacks \(such as `onChange`\) on both
instances. This function is typically invoked when form directive is being initialized.

通过在两个实例上设置回调（例如 `onChange`）来链接 Form 控件和 Form 指令。此函数通常在初始化 form
指令时调用。

Form control which should be cleaned up.

应该清理的表单控件。

Directive that should be disconnected from a given control.

应该与给定控件断开连接的指令。

Flag that indicates whether onChange handler should
    contain asserts to verify that it's not called once directive is destroyed. We need this flag
    to avoid potentially breaking changes caused by better control cleanup introduced in #39235.

指示 onChange
处理程序是否应该包含断言的标志，以验证在指令被销毁后不会调用它。我们需要此标志来避免由于 #39235
中引入的更好的控件清理而引起的潜在破坏性更改。

Reverts configuration performed by the `setUpControl` control function.
Effectively disconnects form control with a given form directive.
This function is typically invoked when corresponding form directive is being destroyed.

`setUpControl` 控制函数执行的配置。有效地断开表单控制与给定的表单指令的连接。此函数通常在相应的
form 指令被销毁时调用。

Form control where disabled change handler should be setup.

应该设置禁用的更改处理程序的表单控件。

Corresponding directive instance associated with this control.

与此控件关联的对应指令实例。

Sets up disabled change handler function on a given form control if ControlValueAccessor
associated with a given directive instance supports the `setDisabledState` call.

如果与给定指令实例关联的 ControlValueAccessor 支持 `setDisabledState`
调用，则在给定的表单控件上设置禁用的更改处理程序函数。

Form control where directive validators should be setup.

表单控制应该设置指令验证器的位置。

Directive instance that contains validators to be setup.

包含要设置的验证器的指令实例。

Sets up sync and async directive validators on provided form control.
This function merges validators from the directive into the validators of the control.

在提供的表单控件上设置同步和异步指令验证器。此函数将指令中的验证器合并到控件的验证器中。

Form control from where directive validators should be removed.

应该从中删除指令验证器的表单控件。

Directive instance that contains validators to be removed.

包含要删除的验证器的指令实例。

true if a control was updated as a result of this action.

如果控件由于此操作而更新，则为 true。

Cleans up sync and async directive validators on provided form control.
This function reverts the setup performed by the `setUpValidators` function, i.e.
removes directive-specific validators from a given control instance.

清理提供的表单控件上的同步和异步指令验证器。此函数会恢复 `setUpValidators`
函数执行的设置，即从给定的控件实例中删除特定于指令的验证器。

FormGroup or FormArray instance that should be linked.

应该链接的 FormGroup 或 FormArray 实例。

Directive that provides view validators.

提供视图验证器的指令。

Links a FormGroup or FormArray instance and corresponding Form directive by setting up validators
present in the view.

通过设置视图中的验证器来链接 FormGroup 或 FormArray 实例和对应的 Form 指令。

FormGroup or FormArray instance that should be cleaned up.

应该清理的 FormGroup 或 FormArray 实例。

Directive that provided view validators.

提供视图验证器的指令。

Reverts the setup performed by the `setUpFormContainer` function.

`setUpFormContainer` 函数执行的设置。
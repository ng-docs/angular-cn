The `ControlValueAccessor` for writing a range value and listening to range input changes.
The value accessor is used by the `FormControlDirective`, `FormControlName`, and  `NgModel`
directives.

此 `ControlValueAccessor` 用于写入范围输入器的值，并监听范围输入器的变化。它被 `FormControlDirective`、`FormControlName` 和 `NgModel` 使用。

Using a range input with a reactive form

使用带响应式表单的范围输入器

The following example shows how to use a range input with a reactive form.

以下示例显示了如何在响应式表单中使用范围输入器。

Sets the "value" property on the input element.

在 input 元素上设置 “value” 属性。

Registers a function called when the control value changes.

注册控件值更改时要调用的函数。
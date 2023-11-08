Internal-only NgModule that works as a host for the `RadioControlRegistry` tree-shakable
provider. Note: the `InternalFormsSharedModule` can not be used here directly, since it's
declared *after* the `RadioControlRegistry` class and the `providedIn` doesn't support
`forwardRef` logic.

仅供内部的 NgModule，作为 `RadioControlRegistry` 树形抖动提供程序的宿主。注意：
`InternalFormsSharedModule` 不能在这里直接使用，因为它是在 `RadioControlRegistry`
类*之后*声明的，并且 `providedIn` 不支持 `forwardRef` 逻辑。

Class used by Angular to track radio buttons. For internal use only.

Angular 用来跟踪单选按钮的类。仅供内部使用。

Adds a control to the internal registry. For internal use only.

将控件添加到内部注册表。仅供内部使用。

Removes a control from the internal registry. For internal use only.

从内部注册表中删除控件。仅供内部使用。

Selects a radio button. For internal use only.

选择一个单选按钮。仅供内部使用。

The `ControlValueAccessor` for writing radio control values and listening to radio control
changes. The value accessor is used by the `FormControlDirective`, `FormControlName`, and
`NgModel` directives.

`ControlValueAccessor` 用于写入单选控件的值和监听单选控件值的更改。这个值访问器由
`FormControlDirective`、`FormControlName` 和 `NgModel` 指令使用。

Using radio buttons with reactive form directives

将单选按钮与响应式表单指令一起使用

The follow example shows how to use radio buttons in a reactive form. When using radio buttons in
a reactive form, radio buttons in the same group should have the same `formControlName`.
Providing a `name` attribute is optional.

下面的示例演示了如何在响应式表单中使用单选按钮。当使用响应式表单的单选按钮时，同一组中的单选按钮应具有相同的
`formControlName`。所提供的 `name` 属性是可选的。

{&commat;example forms/ts/reactiveRadioButtons/reactive_radio_button_example.ts region='Reactive'}



The registered callback function called when a change event occurs on the input element.

在此 input 元素上发生 change 事件时调用的已注册回调函数。

Note: we declare `onChange` here \(also used as host listener\) as a function with no arguments
to override the `onChange` function \(which expects 1 argument\) in the parent
`BaseControlValueAccessor` class.

注意：我们在此将 `onChange`（也用作宿主侦听器）声明为不带参数的函数，以覆盖父
`BaseControlValueAccessor` 类中的 `onChange` 函数（需要 1 个参数）。

Tracks the name of the radio input element.

跟踪单选 input 元素的名称。

Tracks the name of the `FormControl` bound to the directive. The name corresponds
to a key in the parent `FormGroup` or `FormArray`.

跟踪绑定到指令的 `FormControl` 的名称。该名称对应于父 `FormGroup` 或 `FormArray`。

Tracks the value of the radio input element

跟踪单选 input 元素的值

Sets the "checked" property value on the radio input element.

在单选 input 元素上设置 “checked” 属性的值。

Registers a function called when the control value changes.

注册控件值更改时要调用的函数。

Sets the "value" on the radio input element and unchecks it.

在单选 input 元素上设置 “value”，并取消选中它。
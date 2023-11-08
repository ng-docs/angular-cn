FormArrayValue extracts the type of `.value` from a FormArray's element type, and wraps it in an
array.

FormArrayValue 会从 FormArray 的元素类型中提取 `.value` 的类型，并将其包装在一个数组中。

Angular uses this type internally to support Typed Forms; do not use it directly. The untyped
case falls back to any\[\].

Angular 在内部使用此类型来支持类型化表单；不要直接使用它。无类型的情况会回落到 any\[\]。

FormArrayRawValue extracts the type of `.getRawValue()` from a FormArray's element type, and
wraps it in an array. The untyped case falls back to any\[\].

FormArrayRawValue 从 FormArray 的元素类型中提取 `.getRawValue()`
的类型，并将其包装在一个数组中。无类型的情况会回落到 any\[\]。

Angular uses this type internally to support Typed Forms; do not use it directly.

Angular 在内部使用此类型来支持类型化表单；不要直接使用它。

Create an array of form controls

创建一个表单控件数组

Create a form array with array-level validators

创建带有数组级验证器的表单数组

You include array-level validators and async validators. These come in handy
when you want to perform validation that considers the value of more than one child
control.

你包括数组级验证器和异步验证器。当你要执行考虑多个子控件的值的验证时，它们会派上用场。

The two types of validators are passed in separately as the second and third arg
respectively, or together as part of an options object.

这两种类型的验证器分别作为第二个和第三个 arg 单独传入，或作为 options 对象的一部分一起传入。

Set the updateOn property for all controls in a form array

为表单数组中的所有控件设置 updateOn 属性

The options object is used to set a default value for each child
control's `updateOn` property. If you set `updateOn` to `'blur'` at the
array level, all child controls default to 'blur', unless the child
has explicitly specified a different `updateOn` value.

options 对象用于为每个子控件的 `updateOn` 属性设置默认值。如果你在数组级别将 `updateOn` 设置为
`'blur'`，则所有子控件默认为 'blur'，除非子项显式指定不同的 `updateOn` 值。

Adding or removing controls from a form array

在表单数组中添加或删除控件

To change the controls in the array, use the `push`, `insert`, `removeAt` or `clear` methods
in `FormArray` itself. These methods ensure the controls are properly tracked in the
form's hierarchy. Do not modify the array of `AbstractControl`s used to instantiate
the `FormArray` directly, as that result in strange and unexpected behavior such
as broken change detection.

要更改数组中的控件，请使用 `FormArray` 本身中的 `push`、`insert`、`removeAt` 或 `clear`
方法。这些方法可确保在表单的层次结构中正确跟踪控件。不要修改用于直接实例化 `FormArray` 的
`AbstractControl` 数组，因为这会导致奇怪和意外的行为，例如破损的变更检测。

Tracks the value and validity state of an array of `FormControl`,
`FormGroup` or `FormArray` instances.

跟踪 `FormControl`、`FormGroup` 或 `FormArray` 实例的数组的值和有效状态。

A `FormArray` aggregates the values of each child `FormControl` into an array.
It calculates its status by reducing the status values of its children. For example, if one of
the controls in a `FormArray` is invalid, the entire array becomes invalid.

`FormArray` 每个子 `FormControl`
的值聚合到一个数组中。它通过减少其子项的状态值来计算其状态。例如，如果 `FormArray`
中的控件之一无效，则整个数组将变得无效。

`FormArray` accepts one generic argument, which is the type of the controls inside.
If you need a heterogenous array, use {&commat;link UntypedFormArray}.

`FormArray` 接受一个通用参数，即内部控件的类型。如果需要异构数组，请使用 {&commat;link UntypedFormArray}
。

`FormArray` is one of the four fundamental building blocks used to define forms in Angular,
along with `FormControl`, `FormGroup`, and `FormRecord`.

`FormArray` 是用于在 Angular 中定义表单的四个基本构建块之一，与 `FormControl`、`FormGroup` 和
`FormRecord`。

An array of child controls. Each child control is given an index
where it is registered.

子控件的数组。每个子控件都会被赋予一个注册它的索引。

A synchronous validator function, or an array of
such functions, or an `AbstractControlOptions` object that contains validation functions
and a validation trigger.

同步验证器函数，或此类函数的数组，或包含验证函数和验证触发器的 `AbstractControlOptions` 对象。

A single async validator or array of async validator functions

单个异步验证器或异步验证器函数数组

Creates a new `FormArray` instance.

创建一个新的 `FormArray` 实例。

Index in the array to retrieve the control. If `index` is negative, it will wrap
    around from the back, and if index is greatly negative \(less than `-length`\), the result is
undefined. This behavior is the same as `Array.at(index)`.

要检索控件的数组中的索引。如果 `index` 为负数，它将从后面回绕，如果 index 为大大负数（小于
`-length`），则结果是未定义的。此行为与 `Array.at(index)` 相同。

Get the `AbstractControl` at the given `index` in the array.

获取数组中给定 `index` 处的 `AbstractControl`。

Form control to be inserted

要插入的表单控件

Specifies whether this FormArray instance should emit events after a new
    control is added.

指定此 FormArray 实例是否应在添加新控件后发出事件。

`emitEvent`: When true or not supplied \(the default\), both the `statusChanges` and
  `valueChanges` observables emit events with the latest status and value when the control is
  inserted. When false, no events are emitted.

`emitEvent`：当 true 或不提供（默认）时，`statusChanges` 和 `valueChanges`
可观察对象在插入控件时会发出具有最新状态和值的事件。当 false 时，不会发出事件。

Insert a new `AbstractControl` at the end of the array.

在数组的末尾插入一个新的 `AbstractControl`。

Index in the array to insert the control. If `index` is negative, wraps around
    from the back. If `index` is greatly negative \(less than `-length`\), prepends to the array.
This behavior is the same as `Array.splice(index, 0, control)`.

要插入控件的数组中的索引。如果 `index` 为负数，则从后面环绕。如果 `index` 为很大的负数（小于
`-length`），则添加到数组。此行为与 `Array.splice(index, 0, control)` 相同。

Specifies whether this FormArray instance should emit events after a new
    control is inserted.

指定此 FormArray 实例是否应在插入新控件后发出事件。

Insert a new `AbstractControl` at the given `index` in the array.

在数组中的给定 `index` 处插入新的 `AbstractControl`。

Index in the array to remove the control.  If `index` is negative, wraps around
    from the back. If `index` is greatly negative \(less than `-length`\), removes the first
    element. This behavior is the same as `Array.splice(index, 1)`.

要删除控件的数组中的索引。如果 `index` 为负数，则从后面环绕。如果 `index` 为大大负数（小于
`-length`），则删除第一个元素。此行为与 `Array.splice(index, 1)` 相同。

Specifies whether this FormArray instance should emit events after a
    control is removed.

指定此 FormArray 实例是否应在删除控件后发出事件。

`emitEvent`: When true or not supplied \(the default\), both the `statusChanges` and
  `valueChanges` observables emit events with the latest status and value when the control is
  removed. When false, no events are emitted.

`emitEvent`：当为 true 或不提供（默认）时，`statusChanges` 和 `valueChanges`
可观察对象会在删除控件时发出具有最新状态和值的事件。当 false 时，不会发出事件。

Remove the control at the given `index` in the array.

删除数组中给定 `index` 处的控件。

Index in the array to replace the control. If `index` is negative, wraps around
    from the back. If `index` is greatly negative \(less than `-length`\), replaces the first
    element. This behavior is the same as `Array.splice(index, 1, control)`.

要替换控件的数组中的索引。如果 `index` 为负数，则从后面环绕。如果 `index` 为很大的负数（小于
`-length`），则替换第一个元素。此行为与 `Array.splice(index, 1, control)` 相同。

The `AbstractControl` control to replace the existing control

替换现有控件的 `AbstractControl` 控件

Specifies whether this FormArray instance should emit events after an
    existing control is replaced with a new one.

指定在将现有控件替换为新控件后此 FormArray 实例是否应发出事件。

`emitEvent`: When true or not supplied \(the default\), both the `statusChanges` and
  `valueChanges` observables emit events with the latest status and value when the control is
  replaced with a new one. When false, no events are emitted.

`emitEvent`：当为 true 或不提供（默认）时，当控件被替换为新控件时，`statusChanges` 和
`valueChanges` 可观察对象都会发出具有最新状态和值的事件。当 false 时，不会发出事件。

Replace an existing control.

替换现有的控件。

Length of the control array.

控件数组的长度。

Set the values for the controls in the form array

在表单数组中设置控件的值

Array of values for the controls

控件的值数组

Configure options that determine how the control propagates changes and
emits events after the value changes

配置用于确定控件如何传播更改并在值更改后发出事件的选项

`onlySelf`: When true, each change only affects this control, and not its parent. Default
is false.

`onlySelf`：当为 true 时，每次更改只影响此控件，而不影响其父控件。默认为 false。

`emitEvent`: When true or not supplied \(the default\), both the `statusChanges` and
  `valueChanges`
  observables emit events with the latest status and value when the control value is updated.
  When false, no events are emitted.
  The configuration options are passed to the {&commat;link AbstractControl#updateValueAndValidity
  updateValueAndValidity} method.

`emitEvent`：当 true 或未提供（默认）时，`statusChanges` 和 `valueChanges`
可观察对象会在更新控件值时发出具有最新状态和值的事件。当 false
时，不会发出事件。配置选项会传递给 {&commat;link AbstractControl#updateValueAndValidity
updateValueAndValidity} 方法。

Sets the value of the `FormArray`. It accepts an array that matches
the structure of the control.

设置 `FormArray` 的值。它接受与控件结构匹配的数组。

This method performs strict checks, and throws an error if you try
to set the value of a control that doesn't exist or if you exclude the
value of a control.

此方法会执行严格检查，如果你尝试设置不存在的控件的值或者排除控件的值，则会抛出错误。

Patch the values for controls in a form array

修补表单数组中控件的值

Array of latest values for the controls

控件的最新值数组

`emitEvent`: When true or not supplied \(the default\), both the `statusChanges` and
  `valueChanges` observables emit events with the latest status and value when the control
  value is updated. When false, no events are emitted. The configuration options are passed to
  the {&commat;link AbstractControl#updateValueAndValidity updateValueAndValidity} method.

`emitEvent`：当为 true 或不提供（默认）时，`statusChanges` 和 `valueChanges`
可观察对象会在更新控件值时发出具有最新状态和值的事件。当 false
时，不会发出事件。配置选项会传递给 {&commat;link AbstractControl#updateValueAndValidity
updateValueAndValidity} 方法。

Patches the value of the `FormArray`. It accepts an array that matches the
structure of the control, and does its best to match the values to the correct
controls in the group.

修补 `FormArray` 的值。它接受与控件结构匹配的数组，并尽力将值与组中的正确控件匹配。

It accepts both super-sets and sub-sets of the array without throwing an error.

它接受数组的超集和子集，而不会抛出错误。

Reset the values in a form array

重置表单数组中的值

Reset the values in a form array and the disabled status for the first control

重置表单数组中的值和第一个控件的禁用状态

`emitEvent`: When true or not supplied \(the default\), both the `statusChanges` and
  `valueChanges`
  observables emit events with the latest status and value when the control is reset.
  When false, no events are emitted.
  The configuration options are passed to the {&commat;link AbstractControl#updateValueAndValidity
  updateValueAndValidity} method.

`emitEvent`：当 true 或未提供（默认）时，`statusChanges` 和 `valueChanges`
可观察对象会在控件重置时发出具有最新状态和值的事件。当 false
时，不会发出事件。配置选项会传递给 {&commat;link AbstractControl#updateValueAndValidity
updateValueAndValidity} 方法。

Resets the `FormArray` and all descendants are marked `pristine` and `untouched`, and the
value of all descendants to null or null maps.

重置 `FormArray`，并把所有后代标记为 `pristine` 和 `untouched`，并将所有后代的值映射为 null
或 null。

You reset to a specific form state by passing in an array of states
that matches the structure of the control. The state is a standalone value
or a form state object with both a value and a disabled status.

你通过传入与控件结构匹配的状态数组来重置为特定的表单状态。状态是独立值或具有值和禁用状态的表单状态对象。

The aggregate value of the array, including any disabled controls.

数组的聚合值，包括任何禁用的控件。

Reports all values regardless of disabled status.

无论禁用状态如何，都会报告所有值。

Specifies whether this FormArray instance should emit events after all
    controls are removed.

指定此 FormArray 实例是否应在删除所有控件后发出事件。

`emitEvent`: When true or not supplied \(the default\), both the `statusChanges` and
  `valueChanges` observables emit events with the latest status and value when all controls
  in this FormArray instance are removed. When false, no events are emitted.

`emitEvent`：当为 true 或未提供（默认）时，当删除此 FormArray 实例中的所有控件时，
`statusChanges` 和 `valueChanges` 可观察对象都会发出具有最新状态和值的事件。当 false
时，不会发出事件。

Remove all elements from a FormArray

从 FormArray 中删除所有元素

It's a simpler and more efficient alternative to removing all elements one by one:

这是一种比一个一个删除所有元素更简单、更高效的替代方案：

Remove all controls in the `FormArray`.

删除 `FormArray` 中的所有控件。

The presence of an explicit `prototype` property provides backwards-compatibility for apps that
manually inspect the prototype chain.

显式 `prototype` 属性的存在为手动检查原型链的应用程序提供了向后兼容。

UntypedFormArray is a non-strongly-typed version of `FormArray`, which
permits heterogenous controls.

UntypedFormArray 是 &commat;see FormArray 的非强类型版本，它允许进行异构控件。

Asserts that the given control is an instance of `FormArray`

断言给定的控件是 `FormArray` 的一个实例
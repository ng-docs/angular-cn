FormGroupValue extracts the type of `.value` from a FormGroup's inner object type. The untyped
case falls back to {[key: string]&#x3A; any}.

FormGroupValue 从 FormGroup 的内部对象类型中提取 `.value` 的类型。未类型化的大小写回落到 { [key: string][key: string] : any}。

Angular uses this type internally to support Typed Forms; do not use it directly.

Angular 在内部使用此类型来支持类型化表单；不要直接使用它。

For internal use only.

仅供内部使用。

FormGroupRawValue extracts the type of `.getRawValue()` from a FormGroup's inner object type. The
untyped case falls back to {[key: string]&#x3A; any}.

FormGroupRawValue 从 FormGroup 的内部对象类型中提取 `.getRawValue()` 的类型。未类型化的大小写回落到 { [key: string][key: string] : any}。

OptionalKeys returns the union of all optional keys in the object.

OptionalKeys 返回对象中所有可选键的联合。

Create a form group with 2 controls

创建一个带有两个控件的表单组

The type argument, and optional controls

类型参数和可选控件

`FormGroup` accepts one generic argument, which is an object containing its inner controls.
This type will usually be inferred automatically, but you can always specify it explicitly if you
wish.

`FormGroup` 接受一个通用参数，该参数是一个包含其内部控件的对象。这种类型通常会被自动推断，但如果你愿意，你始终可以显式指定它。

If you have controls that are optional \(i.e. they can be removed, you can use the `?` in the
type\):

如果你有可选的控件（即它们可以被删除，你可以在类型中使用 `?`）：

Create a form group with a group-level validator

创建一个具有组级验证器的表单组

You include group-level validators as the second arg, or group-level async
validators as the third arg. These come in handy when you want to perform validation
that considers the value of more than one child control.

你可以用第二个参数传入一些组级验证器或用第三个参数传入一些组级异步验证器。当你要根据一个以上子控件的值来决定有效性时，这很好用。

Like `FormControl` instances, you choose to pass in
validators and async validators as part of an options object.

像 `FormControl` 实例一样，你也可以在配置对象中传入验证器和异步验证器。

Set the updateOn property for all controls in a form group

为表单组中的所有空间设置 `updateOn` 属性

The options object is used to set a default value for each child
control's `updateOn` property. If you set `updateOn` to `'blur'` at the
group level, all child controls default to 'blur', unless the child
has explicitly specified a different `updateOn` value.

该选项对象可用来为每个子控件的 `updateOn` 属性设置默认值。如果在组级把 `updateOn` 设置为 `'blur'`，则所有子控件的默认值也是 `'blur'`，除非这个子控件显式的指定了另一个 `updateOn` 值。

Using a FormGroup with optional controls

使用带有可选控件的 FormGroup

It is possible to have optional controls in a FormGroup. An optional control can be removed later
using `removeControl`, and can be omitted when calling `reset`. Optional controls must be
declared optional in the group's type.

FormGroup 中可以有可选控件。可选控件可以在以后使用 `removeControl` 删除，并且在调用 `reset` 时可以省略。可选控件必须在组的类型中声明为 optional。

Notice that `c.value.one` has type `string|null|undefined`. This is because calling `c.reset({})`
without providing the optional key `one` will cause it to become `null`.

请注意，`c.value.one` 的类型为 `string|null|undefined`。这是因为在不提供可选键 `one` 的情况下调用 `c.reset({})` 将导致它变为 `null`。

Tracks the value and validity state of a group of `FormControl` instances.

跟踪一组 `FormControl` 实例的值和有效状态。

A `FormGroup` aggregates the values of each child `FormControl` into one object,
with each control name as the key.  It calculates its status by reducing the status values
of its children. For example, if one of the controls in a group is invalid, the entire
group becomes invalid.

当实例化 `FormGroup` 时，在第一个参数中传入一组子控件。每个子控件会用控件名把自己注册进去。

`FormGroup` is one of the four fundamental building blocks used to define forms in Angular,
along with `FormControl`, `FormArray`, and `FormRecord`.

`FormGroup` 是用于在 Angular 中定义表单的四个基本构建块之一，与 `FormControl`、`FormArray` 和 `FormRecord`。

When instantiating a `FormGroup`, pass in a collection of child controls as the first
argument. The key for each child registers the name for the control.

实例化 `FormGroup` 时，请传入子控件的集合作为第一个参数。每个子项的键都会注册控件的名称。

`FormGroup` is intended for use cases where the keys are known ahead of time.
If you need to dynamically add and remove controls, use {&commat;link FormRecord} instead.

`FormGroup` 适用于提前知道密钥的用例。如果你需要动态添加和删除控件，请改用 {&commat;link FormRecord}。

`FormGroup` accepts an optional type parameter `TControl`, which is an object type with inner
control types as values.

`FormGroup` 接受一个可选的类型参数 `TControl`，它是一种以内部控件类型作为值的对象类型。

A collection of child controls. The key for each child is the name
under which it is registered.

子控件的集合。每个子控件的键就是其注册名称。

A synchronous validator function, or an array of
such functions, or an `AbstractControlOptions` object that contains validation functions
and a validation trigger.

一个同步验证器函数或其数组，或者一个包含验证函数和验证触发器的 `AbstractControlOptions` 对象。

A single async validator or array of async validator functions

单个的异步验证器函数或其数组。

Creates a new `FormGroup` instance.

创建一个新的 `FormGroup` 实例。

The control name to register in the collection

注册到集合中的控件名

Provides the control for the given name

提供这个名字对应的控件

Registers a control with the group's list of controls. In a strongly-typed group, the control
must be in the group's type \(possibly as an optional key\).

使用组的控件列表注册控件。在强类型组中，控件必须是组的类型（可能作为可选键）。

This method does not update the value or validity of the control.
Use {&commat;link FormGroup#addControl addControl} instead.

此方法不更新控件的值或有效性。使用 {&commat;link FormGroup#addControl addControl} 代替。

The control name to add to the collection

要注册到集合中的控件名

Specifies whether this FormGroup instance should emit events after a new
    control is added.

指定此 FormGroup 实例是否应在添加新控件后发出事件。

`emitEvent`: When true or not supplied \(the default\), both the `statusChanges` and
`valueChanges` observables emit events with the latest status and value when the control is
added. When false, no events are emitted.

`emitEvent`：当 true 或未提供（默认）时，`statusChanges` 和 `valueChanges` 可观察对象在添加控件时会发出具有最新状态和值的事件。当 false 时，不会发出事件。

Add a control to this group. In a strongly-typed group, the control must be in the group's type
\(possibly as an optional key\).

向此组添加控件。在强类型组中，控件必须是组的类型（可能作为可选键）。

If a control with a given name already exists, it would *not* be replaced with a new one.
If you want to replace an existing control, use the {&commat;link FormGroup#setControl setControl}
method instead. This method also updates the value and validity of the control.

如果具有给定名称的控件已经存在，则*不会*用新名称替换它。如果要替换现有控件，请改用 {&commat;link FormGroup#setControl setControl} 方法。此方法还更新控件的值和有效性。

The control name to remove from the collection

要从集合中移除的控件名

Specifies whether this FormGroup instance should emit events after a
    control is removed.

指定此 FormGroup 实例是否应在删除控件后发出事件。

`emitEvent`: When true or not supplied \(the default\), both the `statusChanges` and
`valueChanges` observables emit events with the latest status and value when the control is
removed. When false, no events are emitted.

`emitEvent`：当为 true 或不提供（默认）时，`statusChanges` 和 `valueChanges` 可观察对象会在删除控件时发出具有最新状态和值的事件。当 false 时，不会发出事件。

Remove a control from this group. In a strongly-typed group, required controls cannot be
removed.

从此组中删除控件。在强类型组中，无法删除所需的控件。

This method also updates the value and validity of the control.

该方法还会更新本空间的值和有效性。

The control name to replace in the collection

要从集合中替换掉的控件名

Specifies whether this FormGroup instance should emit events after an
    existing control is replaced.

指定此 FormGroup 实例是否应在替换现有控件后发出事件。

`emitEvent`: When true or not supplied \(the default\), both the `statusChanges` and
`valueChanges` observables emit events with the latest status and value when the control is
replaced with a new one. When false, no events are emitted.

`emitEvent`：当为 true 或不提供（默认）时，当控件被替换为新控件时，`statusChanges` 和 `valueChanges` 可观察对象都会发出具有最新状态和值的事件。当 false 时，不会发出事件。

Replace an existing control. In a strongly-typed group, the control must be in the group's type
\(possibly as an optional key\).

替换现有的控件。在强类型组中，控件必须是组的类型（可能作为可选键）。

If a control with a given name does not exist in this `FormGroup`, it will be added.

如果此 `FormGroup` 中不存在具有给定名称的控件，则将添加它。

The control name to check for existence in the collection

要在集合中检查是否存在的控件名

false for disabled controls, true otherwise.

对于禁用的控件为 false，否则为 true。

Check whether there is an enabled control with the given name in the group.

检查组内是否有一个具有指定名字的已启用的控件。

Reports false for disabled controls. If you'd like to check for existence in the group
only, use {&commat;link AbstractControl#get get} instead.

对禁用的控件报告 false。如果你只想检查组中是否存在，请改用 {&commat;link AbstractControl#get get}。

Set the complete value for the form group

设置表单组的完整值

When strict checks fail, such as setting the value of a control
that doesn't exist or if you exclude a value of a control that does exist.

当严格检查失败时，例如设置不存在的控件的值，或者如果你排除存在的控件的值。

The new value for the control that matches the structure of the group.

控件的新值，其结构必须和该组的结构相匹配。

Configuration options that determine how the control propagates changes
and emits events after the value changes.
The configuration options are passed to the {&commat;link AbstractControl#updateValueAndValidity
updateValueAndValidity} method.

确定控件如何传播更改并在值更改后发出事件的配置选项。配置选项被传递给 {&commat;link AbstractControl#updateValueAndValidity updateValueAndValidity} 方法。

`onlySelf`: When true, each change only affects this control, and not its parent. Default is
false.

`onlySelf`:：如果为 `true`，则每个变更仅仅影响当前控件，而不会影响父控件。默认为 `false`。

`emitEvent`: When true or not supplied \(the default\), both the `statusChanges` and
`valueChanges`
observables emit events with the latest status and value when the control value is updated.
When false, no events are emitted.

`emitEvent`：如果为 `true` 或未提供（默认），则当控件值变化时，`statusChanges` 和 `valueChanges` 这两个 Observable 都会以最近的状态和值发出事件。如果为 `false`，则不会发出事件。

Sets the value of the `FormGroup`. It accepts an object that matches
the structure of the group, with control names as keys.

设置此 `FormGroup` 的值。它接受一个与组结构对应的对象，以控件名作为 key。

Patch the value for a form group

修补表单组的值

The object that matches the structure of the group.

与该组的结构匹配的对象。

Configuration options that determine how the control propagates changes and
emits events after the value is patched.

在修补了该值之后，此配置项会决定控件如何传播变更以及发出事件。

`onlySelf`: When true, each change only affects this control and not its parent. Default is
true.

`onlySelf`：当为 true 时，每次更改都只影响此控件，而不影响其父级。默认为 true。

`emitEvent`: When true or not supplied \(the default\), both the `statusChanges` and
`valueChanges` observables emit events with the latest status and value when the control value
is updated. When false, no events are emitted. The configuration options are passed to
the {&commat;link AbstractControl#updateValueAndValidity updateValueAndValidity} method.

`emitEvent`：当 true 或未提供（默认）时，`statusChanges` 和 `valueChanges`
可观察对象会在更新控件值时发出具有最新状态和值的事件。当 false
时，不会发出事件。配置选项会传递给 {&commat;link AbstractControl#updateValueAndValidity
updateValueAndValidity} 方法。

Patches the value of the `FormGroup`. It accepts an object with control
names as keys, and does its best to match the values to the correct controls
in the group.

修补此 `FormGroup` 的值。它接受一个以控件名为 key 的对象，并尽量把它们的值匹配到组中正确的控件上。

It accepts both super-sets and sub-sets of the group without throwing an error.

它能接受组的超集和子集，而不会抛出错误。

Resets the control with an initial value,
or an object that defines the initial value and disabled state.

使用初始值或一个包含初始值和禁用状态的对象来重置该控件。

Configuration options that determine how the control propagates changes
and emits events when the group is reset.

当该组被重置时，此配置项会决定该控件如何传播变更以及发出事件。

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

Reset the form group values

重置该表单组的值

Reset the form group values and disabled status

重置该表单组的值以及禁用状态

Resets the `FormGroup`, marks all descendants `pristine` and `untouched` and sets
the value of all descendants to their default values, or null if no defaults were provided.

重置 `FormGroup`，将所有后代标记为 `pristine` 和 `untouched`，并将所有后代的值设置为默认值，如果没有提供默认值，则为 null。

You reset to a specific form state by passing in a map of states
that matches the structure of your form, with control names as keys. The state
is a standalone value or a form state object with both a value and a disabled
status.

你可以通过传入一个与表单结构相匹配的以控件名为 key 的 Map，来把表单重置为特定的状态。其状态可以是一个单独的值，也可以是一个同时具有值和禁用状态的表单状态对象。

The aggregate value of the `FormGroup`, including any disabled controls.

这个 `FormGroup` 的聚合值，包括所有已禁用的控件。

Retrieves all values regardless of disabled status.

无论禁用状态如何，都检索所有值。

The presence of an explicit `prototype` property provides backwards-compatibility for apps that
manually inspect the prototype chain.

显式 `prototype` 属性的存在为手动检查原型链的应用程序提供了向后兼容。

UntypedFormGroup is a non-strongly-typed version of `FormGroup`.

UntypedFormGroup 是 `FormGroup` 的非强类型版本。

Asserts that the given control is an instance of `FormGroup`

断言给定的控件是 `FormGroup` 的一个实例

Tracks the value and validity state of a collection of `FormControl` instances, each of which has
the same value type.

跟踪 `FormControl` 实例集合的值和有效性状态，每个实例都具有相同的值类型。

`FormRecord` is very similar to {&commat;link FormGroup}, except it can be used with a dynamic keys,
with controls added and removed as needed.

`FormRecord` 与 {&commat;link FormGroup} 非常相似，除了它可以与动态键一起使用，并根据需要添加和删除控件。

`FormRecord` accepts one generic argument, which describes the type of the controls it contains.

`FormRecord` 接受一个通用参数，该参数描述了它包含的控件的类型。

Registers a control with the records's list of controls.

使用记录的控件列表注册一个控件。

See `FormGroup#registerControl` for additional information.

有关其他信息，请参阅 `FormGroup#registerControl`。

Add a control to this group.

往组中添加一个控件。

See `FormGroup#addControl` for additional information.

有关其他信息，请参阅 `FormGroup#addControl`。

Remove a control from this group.

从该组中移除一个控件。

See `FormGroup#removeControl` for additional information.

有关其他信息，请参阅 `FormGroup#removeControl`。

Replace an existing control.

替换现有控件。

See `FormGroup#setControl` for additional information.

有关其他信息，请参阅 `FormGroup#setControl`。

See `FormGroup#contains` for additional information.

有关其他信息，请参阅 `FormGroup#contains`。

Sets the value of the `FormRecord`. It accepts an object that matches
the structure of the group, with control names as keys.

设置 `FormRecord` 的值。它接受一个与组结构匹配的对象，以控件名称作为键。

See `FormGroup#setValue` for additional information.

有关其他信息，请参阅 `FormGroup#setValue`。

Patches the value of the `FormRecord`. It accepts an object with control
names as keys, and does its best to match the values to the correct controls
in the group.

修补 `FormRecord` 的值。它接受以控件名称作为键的对象，并尽力将值与组中的正确控件进行匹配。

See `FormGroup#patchValue` for additional information.

有关其他信息，请参阅 `FormGroup#patchValue`。

Resets the `FormRecord`, marks all descendants `pristine` and `untouched` and sets
the value of all descendants to null.

重置 `FormRecord`，将所有后代标记为 `pristine` 和 `untouched`，并将所有后代的值设置为 null。

See `FormGroup#reset` for additional information.

有关其他信息，请参阅 `FormGroup#reset`。

The aggregate value of the `FormRecord`, including any disabled controls.

`FormRecord` 的聚合值，包括任何禁用的控件。

See `FormGroup#getRawValue` for additional information.

有关其他信息，请参阅 `FormGroup#getRawValue`。

Asserts that the given control is an instance of `FormRecord`

断言给定的控件是 `FormRecord` 的一个实例
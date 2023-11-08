The union of all validator types that can be accepted by a ControlConfig.

ControlConfig 可以接受的所有验证器类型的联合。

The compiler may not always be able to prove that the elements of the control config are a tuple
\(i.e. occur in a fixed order\). This slightly looser type is used for inference, to catch cases
where the compiler cannot prove order and position.

编译器可能并不总是能够证明控制配置的元素是一个元组（即以固定顺序出现）。这种稍微松散的类型用于推理，以捕获编译器无法证明顺序和位置的情况。

For example, consider the simple case `fb.group({foo: ['bar', Validators.required]})`. The
compiler will infer this as an array, not as a tuple.

例如，考虑简单的情况 `fb.group({foo: ['bar', Validators.required]})`。编译器会将其推断为数组，而不是元组。

Helper type to allow the compiler to accept [XXXX, { updateOn: string }] as a valid shorthand
argument for .group\(\)

允许编译器接受[XXXX, { updateOn: string }][XXXX, { updateOn: string }]作为 .group\(\) 的有效速记参数的辅助类型

ControlConfig<T> is a tuple containing a value of type T, plus optional validators and async
validators.

控制配置

FormBuilder accepts values in various container shapes, as well as raw values.
Element returns the appropriate corresponding model class, given the container T.
The flag N, if not never, makes the resulting `FormControl` have N in its type.

FormBuilder 接受各种容器形状的值以及原始值。给定容器 T，Element 返回适当的对应模型类。标志 N（如果不是从不）使生成的 `FormControl` 在其类型中具有 N。

Creates an `AbstractControl` from a user-specified configuration.

使用用户指定的配置创建 `AbstractControl`。

The `FormBuilder` provides syntactic sugar that shortens creating instances of a
`FormControl`, `FormGroup`, or `FormArray`. It reduces the amount of boilerplate needed to
build complex forms.

`FormBuilder` 提供了一个语法糖，以简化 `FormControl`、`FormGroup` 或 `FormArray` 实例的创建过程。它会减少构建复杂表单时所需的样板代码的数量。

[Reactive Forms Guide](guide/reactive-forms)

[响应式表单](/guide/reactive-forms)

Returns a FormBuilder in which automatically constructed `FormControl` elements
have `{nonNullable: true}` and are non-nullable.

返回一个 FormBuilder，其中自动构造的 `FormControl` 元素具有 `{nonNullable: true}` 并且不可为 null。

**Constructing non-nullable controls**

**构建不可为空的控件**

When constructing a control, it will be non-nullable, and will reset to its initial value.

构造控件时，它将是不可为空的，并将重置为其初始值。

**Constructing non-nullable groups or arrays**

**构造不可为空的组或数组**

When constructing a group or array, all automatically created inner controls will be
non-nullable, and will reset to their initial values.

构造组或数组时，所有自动创建的内部控件都将不可为空，并将重置为它们的初始值。

**Constructing *nullable* fields on groups or arrays**

**在组或数组上构造可以为*空*的字段**

It is still possible to have a nullable field. In particular, any `FormControl` which is
*already* constructed will not be altered. For example:

仍然可以有一个可以为 null 的字段。特别是，任何*已经*构建的 `FormControl` 都不会被更改。例如：

Because the inner control is constructed explicitly by the caller, the builder has
no control over how it is created, and cannot exclude the `null`.

因为内部控件是由调用者显式构造的，所以构建器无法控制它的创建方式，并且不能排除 `null`。

Constructs a new `FormGroup` instance. Accepts a single generic argument, which is an object
containing all the keys and corresponding inner control types.

构造一个新的 `FormGroup` 实例。接受单个泛型参数，该参数是包含所有键和对应的内部控件类型的对象。

A collection of child controls. The key for each child is the name
under which it is registered.

子控件的集合。每个子控件的键就是其注册名称。

Configuration options object for the `FormGroup`. The object should have the
`AbstractControlOptions` type and might contain the following fields:

`FormGroup` 的配置选项对象。该对象应该具有 `AbstractControlOptions` 类型，并可能包含以下字段：

`validators`: A synchronous validator function, or an array of validator functions.

`validators`：一个同步验证器函数或其数组。

`asyncValidators`: A single async validator or array of async validator functions.

`asyncValidators`：一个异步验证器函数或其数组。

`updateOn`: The event upon which the control should be updated \(options: 'change' | 'blur'
| submit'\).

`updateOn`：控件应更新的事件（选项：'change' | 'blur' | submit'）。

Constructs a new `FormGroup` instance.

构造一个新的 `FormGroup` 实例。

This API is not typesafe and can result in issues with Closure Compiler renaming.
Use the `FormBuilder#group` overload with `AbstractControlOptions` instead.
Note that `AbstractControlOptions` expects `validators` and `asyncValidators` to be valid
validators. If you have custom validators, make sure their validation function parameter is
`AbstractControl` and not a sub-class, such as `FormGroup`. These functions will be called
with an object of type `AbstractControl` and that cannot be automatically downcast to a
subclass, so TypeScript sees this as an error. For example, change the `(group: FormGroup) =>
ValidationErrors|null` signature to be `(group: AbstractControl) => ValidationErrors|null`.

此 API 不是类型安全的，可能会导致 Closure Compiler 重命名问题。改用带有 `AbstractControlOptions` 的 `FormBuilder#group` 重载。请注意，`AbstractControlOptions` 期望 `validators` 和 `asyncValidators` 是有效的验证器。如果你有自定义验证器，请确保它们的验证函数参数是 `AbstractControl` 而不是子类，例如 `FormGroup`。这些函数将使用 `AbstractControl` 类型的对象调用，并且不能自动向下转换为子类，因此 TypeScript 将此视为错误。例如，将 `(group: FormGroup) => ValidationErrors|null` 签名更改为 `(group: AbstractControl) => ValidationErrors|null`。

A record of child controls. The key for each child is the name
under which the control is registered.

子控件的集合。每个子控件的键就是其注册名称。

Configuration options object for the `FormGroup`. The legacy configuration
object consists of:

`FormGroup` 配置选项对象。旧的配置对象包括：

`validator`: A synchronous validator function, or an array of validator functions.

`validator`：一个同步验证器函数或其数组。

`asyncValidator`: A single async validator or array of async validator functions
Note: the legacy format is deprecated and might be removed in one of the next major versions
of Angular.

`asyncValidator`：单个异步验证器或异步验证器函数数组。注意：不推荐使用旧格式，并且会在 Angular 的后面的某个主要版本中将其删除。

Constructs a new `FormRecord` instance. Accepts a single generic argument, which is an object
containing all the keys and corresponding inner control types.

构造一个新的 `FormRecord` 实例。接受单个泛型参数，该参数是包含所有键和对应的内部控件类型的对象。

Configuration options object for the `FormRecord`. The object should have the
`AbstractControlOptions` type and might contain the following fields:

`FormRecord` 的配置选项对象。该对象应该具有 `AbstractControlOptions` 类型，并可能包含以下字段：

Use `nonNullable` instead.

请改用 `nonNullable`。

When passing an `options` argument, the `asyncValidator` argument has no effect.

传递 `options` 参数时，`asyncValidator` 参数无效。

Constructs a new `FormControl` with the given state, validators and options. Sets
`{nonNullable: true}` in the options to get a non-nullable control. Otherwise, the
control will be nullable. Accepts a single generic argument, which is the type  of the
control's value.

构建一个新的 `FormControl` 实例。

Initializes the control with an initial state value, or
with an object that contains both a value and a disabled status.

使用一个初始值或一个定义了初始值和禁用状态的对象初始化该控件。

A synchronous validator function, or an array of
such functions, or a `FormControlOptions` object that contains
validation functions and a validation trigger.

同步验证器函数，或此类函数的数组，或包含验证函数和验证触发器的 `FormControlOptions` 对象。

A single async validator or array of async validator
functions.

单个的异步验证器函数或其数组。

Initialize a control as disabled

把控件初始化为禁用状态

The following example returns a control with an initial value in a disabled state.

下面的例子返回一个带有初始值并已禁用的控件。

An array of child controls or control configs. Each child control is given an
    index when it is registered.

一个子控件数组。每个子控件的 key 都是它在数组中的索引。

A synchronous validator function, or an array of such functions, or an
    `AbstractControlOptions` object that contains
validation functions and a validation trigger.

一个同步验证器函数或其数组，或者一个包含验证函数和验证触发器的 `AbstractControlOptions` 对象。

A single async validator or array of async validator functions.

单个的异步验证器函数或其数组。

Constructs a new `FormArray` from the given array of configurations,
validators and options. Accepts a single generic argument, which is the type of each control
inside the array.

构造一个新的 `FormArray` 实例。

`NonNullableFormBuilder` is similar to {&commat;link FormBuilder}, but automatically constructed
{&commat;link FormControl} elements have `{nonNullable: true}` and are non-nullable.

`NonNullableFormBuilder` 类似于 {&commat;link FormBuilder}，但自动构建的 {&commat;link FormControl} 元素具有 `{nonNullable: true}` 且不可为 null。

Similar to `FormBuilder#group`, except any implicitly constructed `FormControl`
will be non-nullable \(i.e. it will have `nonNullable` set to true\). Note
that already-constructed controls will not be altered.

类似于 `FormBuilder#group`，只是任何隐式构造的 `FormControl` 都将是不可空的（即它将 `nonNullable` 设置为 true）。请注意，已经构建的控件不会被更改。

Similar to `FormBuilder#record`, except any implicitly constructed `FormControl`
will be non-nullable \(i.e. it will have `nonNullable` set to true\). Note
that already-constructed controls will not be altered.

与 `FormBuilder#record` 类似，只是任何隐式构造的 `FormControl` 都将是不可为空的（即它将 `nonNullable` 设置为 true ）。请注意，已经构建的控件不会被更改。

Similar to `FormBuilder#array`, except any implicitly constructed `FormControl`
will be non-nullable \(i.e. it will have `nonNullable` set to true\). Note
that already-constructed controls will not be altered.

类似于 `FormBuilder#array`，只是任何隐式构造的 `FormControl` 都将是不可为空的（即它将 `nonNullable` 设置为 true）。请注意，已经构建的控件不会被更改。

Similar to `FormBuilder#control`, except this overridden version of `control` forces
`nonNullable` to be `true`, resulting in the control always being non-nullable.

类似于 `FormBuilder#control`，只是此 `control` 的覆盖版本会强制 `nonNullable` 为 `true`，导致控件始终不可为空。

UntypedFormBuilder is the same as `FormBuilder`, but it provides untyped controls.

UntypedFormBuilder 与 `FormBuilder` 相同，但它提供无类型控件。

Like `FormBuilder#group`, except the resulting group is untyped.

与 `FormBuilder#group` 一样，只是结果组是无类型的。

This API is not typesafe and can result in issues with Closure Compiler renaming.
Use the `FormBuilder#group` overload with `AbstractControlOptions` instead.

此 API 不是类型安全的，可能会导致 Closure Compiler 重命名问题。改用带有 `AbstractControlOptions` 的 `FormBuilder#group` 重载。

Like `FormBuilder#control`, except the resulting control is untyped.

与 `FormBuilder#control` 一样，只是结果控件是无类型的。

Like `FormBuilder#array`, except the resulting array is untyped.

与 `FormBuilder#array` 一样，只是结果数组是无类型的。
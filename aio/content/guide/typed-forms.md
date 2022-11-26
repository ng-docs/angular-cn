# Typed Forms

# 键入的表单

As of Angular 14, reactive forms are strictly typed by default.

从 Angular 14 开始，响应式表单默认是严格类型的。

<a id="prerequisites"></a>

## Prerequisites

## 前提条件

As background for this guide, you should already be familiar with [Angular Reactive Forms](guide/reactive-forms "Reactive Forms").

作为本指南的背景，你应该已经熟悉[Angular 响应式表单](guide/reactive-forms "响应式表单")。

<a id="intro"></a>

## Overview of Typed Forms

## 类型化表单概览

<iframe width="560" height="315" src="https://www.youtube.com/embed/L-odCf4MfJc" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

With Angular reactive forms, you explicitly specify a *form model*. As a simple example, consider this basic user login form:

使用 Angular 响应式表单，你可以显式指定*表单 model*。作为一个简单的例子，考虑这个基本的用户登录表单：

```ts
const login = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
});
```

Angular provides many APIs for interacting with this `FormGroup`. For example, you may call `login.value`, `login.controls`, `login.patchValue`, etc. (For a full API reference, see the [API documentation](api/forms/FormGroup).)

Angular 提供了许多 API 来与此 `FormGroup` 交互。例如，你可以调用 `login.value` 、 `login.controls` 、 `login.patchValue` 等。（有关完整的 API 参考，请参阅[API 文档](api/forms/FormGroup)。）

In previous Angular versions, most of these APIs included `any` somewhere in their types, and interacting with the structure of the controls, or the values themselves, was not type-safe. For example: you could write the following invalid code:

在以前的 Angular 版本中，这些 API 中的大多数都在其类型中的某处包含 `any`，并且与控件结构或值本身的交互不是类型安全的。例如：你可以编写以下无效代码：

```ts
const emailDomain = login.value.email.domain;
```

With strictly typed reactive forms, the above code does not compile, because there is no `domain` property on `email`.

使用严格类型的响应式形式，上面的代码不会编译，因为 `email` 上没有 `domain` 属性。

In addition to the added safety, the types enable a variety of other improvements, such as better autocomplete in IDEs, and an explicit way to specify form structure.

除了增加安全性之外，这些类型还支持各种其他改进，例如 IDE 中更好的自动完成，以及显式指定表单结构的方式。

These improvements currently apply only to *reactive* forms (not [*template-driven* forms](guide/forms "Forms Guide")).

这些改进当前仅适用于*响应*式表单（不适用于[*模板驱动的*表单](guide/forms "表单指南")）。

<a id="automated-migration"></a>

## Automated Untyped Forms Migration

## 自动无类型表单迁移

When upgrading to Angular 14, an included migration will automatically replace all the forms classes in your code with corresponding untyped versions. For example, the snippet from above would become:

升级到 Angular 14 时，包含的迁移将自动使用相应的无类型版本替换代码中的所有表单类。例如，上面的代码段将变为：

```ts
const login = new UntypedFormGroup({
    email: new UntypedFormControl(''),
    password: new UntypedFormControl(''),
});
```

Each `Untyped` symbol has exactly the same semantics as in previous Angular versions, so your application should continue to compile as before. By removing the `Untyped` prefixes, you can incrementally enable the types.

每个 `Untyped` 符号都与以前的 Angular 版本具有完全相同的语义，因此你的应用程序应该像以前一样继续编译。通过删除 `Untyped` 前缀，你可以增量启用这些类型。

<a id="form-control-inference"></a>

## `FormControl`: Getting Started

## `FormControl` ：入门

The simplest possible form consists of a single control:

最简单的形式由单个控件组成：

```ts
const email = new FormControl('angularrox@gmail.com');
```

This control will be automatically inferred to have the type `FormControl<string|null>`. TypeScript will automatically enforce this type throughout the [`FormControl` API](api/forms/FormControl), such as `email.value`, `email.valueChanges`, `email.setValue(...)`, etc.

此控件将被自动推断为 `FormControl<string|null>` 类型。TypeScript 会在整个[`FormControl` API](api/forms/FormControl)中自动强制执行此类型，例如 `email.value` 、 `email.valueChanges` 、 `email.setValue(...)` 等。

### Nullability

### 可空性

You might wonder: why does the type of this control include `null`?  This is because the control can become `null` at any time, by calling reset:

你可能想知道：为什么此控件的类型包含 `null` ？这是因为控件可以随时通过调用 reset 变为 `null` ：

```ts
const email = new FormControl('angularrox@gmail.com');
email.reset();
console.log(email.value); // null
```

TypeScript will enforce that you always handle the possibility that the control has become `null`. If you want to make this control non-nullable, you may use the `nonNullable` option. This will cause the control to reset to its initial value, instead of `null`:

TypeScript 将强制你始终处理控件已变为 `null` 的可能性。如果要使此控件不可为空，可以用 `nonNullable` 选项。这将导致控件重置为其初始值，而不是 `null` ：

```ts
const email = new FormControl('angularrox@gmail.com', {nonNullable: true});
email.reset();
console.log(email.value); // angularrox@gmail.com
```

To reiterate, this option affects the runtime behavior of your form when `.reset()` is called, and should be flipped with care.

重申一下，此选项会在调用 `.reset()` 时影响表单的运行时行为，应小心翻转。

### Specifying an Explicit Type

### 指定显式类型

It is possible to specify the type, instead of relying on inference. Consider a control that is initialized to `null`. Because the initial value is `null`, TypeScript will infer `FormControl<null>`, which is narrower than we want.

可以指定类型，而不是依赖推理。考虑一个初始化为 `null` 的控件。因为初始值为 `null`，所以 TypeScript 将推断 `FormControl<null>`，这比我们想要的要窄。

```ts
const email = new FormControl(null);
email.setValue('angularrox@gmail.com'); // Error!
```

To prevent this, we explicitly specify the type as `string|null`:

为防止这种情况，我们将类型显式指定为 `string|null` ：

```ts
const email = new FormControl<string|null>(null);
email.setValue('angularrox@gmail.com');
```

<a id="form-array"></a>

## `FormArray`: Dynamic, Homogenous Collections

## `FormArray` ：动态的、同质的集合

A `FormArray` contains an open-ended list of controls. The type parameter corresponds to the type of each inner control:

`FormArray` 包含一个开放式控件列表。type 参数对应于每个内部控件的类型：

```ts
const names = new FormArray([new FormControl('Alex')]);
names.push(new FormControl('Jess'));
```

This `FormArray` will have the inner controls type `FormControl<string|null>`.

此 `FormArray` 将具有内部控件类型 `FormControl<string|null>`。

If you want to have multiple different element types inside the array, you must use `UntypedFormArray`, because TypeScript cannot infer which element type will occur at which position.

如果你想在数组中有多个不同的元素类型，则必须使用 `UntypedFormArray`，因为 TypeScript 无法推断哪种元素类型将出现在哪个位置。

<a id="form-group-record"></a>

## `FormGroup` and `FormRecord`

## `FormGroup` 和 `FormRecord`

Angular provides the `FormGroup` type for forms with an enumerated set of keys, and a type called `FormRecord`, for open-ended or dynamic groups.

Angular 为具有枚举键集的表单提供了 `FormGroup` 类型，并为开放式或动态组提供了一种名为 `FormRecord` 的类型。

### Partial Values

### 部分值

Consider again a login form:

再次考虑一个登录表单：

```ts
const login = new FormGroup({
    email: new FormControl('', {nonNullable: true}),
    password: new FormControl('', {nonNullable: true}),
});
```

On any `FormGroup`, it is [possible to disable controls](api/forms/FormGroup). Any disabled control will not appear in the group's value.

在任何 `FormGroup` 上，都[可以禁用控件](api/forms/FormGroup)。任何禁用的控件都不会出现在组的值中。

As a consequence, the type of `login.value` is `Partial<{email: string, password: string}>`. The `Partial` in this type means that each member might be undefined.

因此，`login.value` 的类型是 `Partial<{email: string, password: string}>`。这种类型的 `Partial` 意味着每个成员可能是未定义的。

More specifically, the type of `login.value.email` is `string|undefined`, and TypeScript will enforce that you handle the possibly `undefined` value (if you have `strictNullChecks` enabled).

更具体地说，`login.value.email` 的类型是 `string|undefined`，TypeScript 将强制你处理可能 `undefined` 的值（如果你启用了 `strictNullChecks`）。

If you want to access the value *including* disabled controls, and thus bypass possible `undefined` fields, you can use `login.getRawValue()`.

如果你想访问*包括*禁用控件的值，从而绕过可能的 `undefined` 字段，可以用 `login.getRawValue()`。

### Optional Controls and Dynamic Groups

### 可选控件和动态组

Some forms have controls that may or may not be present, which can be added and removed at runtime. You can represent these controls using *optional fields*:

某些表单的控件可能存在也可能不存在，可以在运行时添加和删除。你可以用*可选字段*来表示这些控件：

```ts
interface LoginForm {
    email: FormControl<string>;
    password?: FormControl<string>;
}

const login = new FormGroup<LoginForm>({
    email: new FormControl('', {nonNullable: true}),
    password: new FormControl('', {nonNullable: true}),
});

login.removeControl('password');
```

In this form, we explicitly specify the type, which allows us to make the `password` control optional. TypeScript will enforce that only optional controls can be added or removed.

在这种形式中，我们显式指定类型，这允许我们将 `password` 控制设置为可选。TypeScript 将强制要求只能添加或删除可选控件。

### `FormRecord`

Some `FormGroup` usages do not fit the above pattern because the keys are not known ahead of time. The `FormRecord` class is designed for that case:

某些 `FormGroup` 的用法不符合上述模式，因为键是无法提前知道的。`FormRecord` 类就是为这种情况设计的：

```ts
const addresses = new FormRecord<FormControl<string|null>>({});
addresses.addControl('Andrew', new FormControl('2340 Folsom St'));
```

Any control of type `string|null` can be added to this `FormRecord`.

任何 `string|null` 类型的控件都可以添加到此 `FormRecord`。

If you need a `FormGroup` that is both dynamic (open-ended) and heterogeneous (the controls are different types), no improved type safety is possible, and you should use `UntypedFormGroup`.

如果你需要一个动态（开放式）和异构（控件是不同类型）的 `FormGroup` ，则无法提升为类型安全的，这时你应该使用 `UntypedFormGroup` 。

A `FormRecord` can also be built with the `FormBuilder`:

`FormRecord` 也可以用 `FormBuilder` 构建：

```ts
const addresses = fb.record({'Andrew': '2340 Folsom St'});
```

如果你需要一个动态（开放式）和异构（控件是不同类型）的 `FormGroup`，则无法提高类型安全，你应该使用 `UntypedFormGroup`。

## `FormBuilder` and `NonNullableFormBuilder`

## `FormBuilder` 和 `NonNullableFormBuilder`

The `FormBuilder` class has been upgraded to support the new types as well, in the same manner as the above examples.

`FormBuilder` 类已升级为支持新类型，方式与上面的示例相同。

Additionally, an additional builder is available: `NonNullableFormBuilder`. This type is shorthand for specifying `{nonNullable: true}` on every control, and can eliminate significant boilerplate from large non-nullable forms. You can access it using the `nonNullable` property on a `FormBuilder`:

此外，还提供了一个额外的构建器：`NonNullableFormBuilder`。这种类型是在每个控件上指定 `{nonNullable: true}` 的简写，并且可以从大型不可为空形式中消除重要的样板。你可以用 `FormBuilder` 上的 `nonNullable` 属性访问它：

```ts
const fb = new FormBuilder();
const login = fb.nonNullable.group({
    email: '',
    password: '',
});
```

On the above example, both inner controls will be non-nullable (i.e. `nonNullable` will be set).

在上面的示例中，两个内部控件都将不可为空（即将设置 `nonNullable`）。

You can also inject it using the name `NonNullableFormBuilder`.

你还可以用名称 `NonNullableFormBuilder` 注入它。

<!-- links -->

<!-- external links -->

[NinjaSquadTypedFormsBlog]: https://blog.ninja-squad.com/2022/04/21/strictly-typed-forms-angular/ "NinjaSquad | Strictly typed forms in Angular"

<!-- end links -->

@reviewed 2022-05-10
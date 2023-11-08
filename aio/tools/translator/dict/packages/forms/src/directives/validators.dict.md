The value to convert to integer.

要转换为整数的值。

value of parameter converted to number or integer.

转换为数字或整数的参数值。

Method that updates string to integer if not already a number

如果还不是数字，则将字符串更新为整数的方法

The value to convert to float.

要转换为浮点数的值。

value of parameter converted to number or float.

转换为数字或浮点数的参数值。

Method that ensures that provided value is a float \(and converts it to float if needed\).

确保提供的值是浮点数（并如果需要将其转换为浮点数）的方法。

Defines the map of errors returned from failed validation checks.

定义从失败的验证检查返回的错误映射表。

An interface implemented by classes that perform synchronous validation.

一个接口，实现了它的类可以扮演验证器的角色。

Provide a custom validator

提供一个自定义的验证器

The following example implements the `Validator` interface to create a
validator directive with a custom error key.

下面的例子实现了 `Validator` 接口，以便用一个自定义的错误键来创建验证器指令。

Method that performs synchronous validation against the provided control.

对所提供的控件执行同步验证的方法。

The control to validate against.

要验证的控件。

A map of validation errors if validation fails,
otherwise null.

如果验证失败，则验证错误的映射表，否则为 null。

Registers a callback function to call when the validator inputs change.

注册一个回调函数以在验证器的输入发生更改时调用。

The callback function

回调函数

A base class for Validator-based Directives. The class contains common logic shared across such
Directives.

基于 Validator 的指令的基类。该类包含在此类指令之间共享的通用逻辑。

For internal use only, this class is not intended for use outside of the Forms package.

仅供内部使用，此类不适合在 Forms 包之外使用。

A flag that tracks whether this validator is enabled.

跟踪此验证器是否启用的标志。

Marking it `internal` \(vs `protected`\), so that this flag can be used in host bindings of
directive classes that extend this base class.

将其标记为 `internal`（vs `protected`
），以便此标志可以在扩展此基类的指令类的宿主绑定中使用。

Name of an input that matches directive selector attribute \(e.g. `minlength` for
`MinLengthDirective`\). An input with a given name might contain configuration information \(like
`minlength='10'`\) or a flag that indicates whether validator should be enabled \(like
`[required]='false'`\).

与指令选择器属性匹配的输入的名称（例如 `minlength` 的 `MinLengthDirective`
）。具有给定名称的输入可能包含配置信息（例如 `minlength='10'`
）或表明是否应启用验证器的标志（例如 `[required]='false'`）。

Creates an instance of a validator \(specific to a directive that extends this base class\).

创建验证器的实例（特定于扩展此基类的指令）。

Performs the necessary input normalization based on a specific logic of a Directive.
For example, the function might be used to convert string-based representation of the
`minlength` input to an integer value that can later be used in the `Validators.minLength`
validator.

根据指令的特定逻辑执行必要的输入规范化。例如，该函数可能用于将 `minlength`
输入的基于字符串的表示转换为整数值，该值以后可以在 `Validators.minLength` 验证器中使用。

Determines whether this validator should be active or not based on an input.
Base class implementation checks whether an input is defined \(if the value is different from
`null` and `undefined`\). Validator classes that extend this base class can override this
function with the logic specific to a particular validator directive.

根据输入确定此验证器是否应该处于活动状态。基类实现会检查输入是否已定义（如果值不同于 `null` 和
`undefined`）。扩展此基类的验证器类可以用特定于特定验证器指令的逻辑覆盖此函数。

Provider which adds `MaxValidator` to the `NG_VALIDATORS` multi-provider list.

将 `MaxValidator` 添加到 `NG_VALIDATORS` 多提供程序列表的提供程序。

[Form Validation](guide/form-validation)

[表单验证](guide/form-validation)

Adding a max validator

添加 max 验证器

The following example shows how to add a max validator to an input attached to an
ngModel binding.

以下示例展示了如何将 max 验证器添加到附加到 ngModel 绑定的输入。

A directive which installs the {&commat;link MaxValidator} for any `formControlName`,
`formControl`, or control with `ngModel` that also has a `max` attribute.

一个指令，它为任何 `formControlName`、`formControl` 或使用也具有 `max` 属性的 `ngModel`
的控件安装 {&commat;link MaxValidator}。

Tracks changes to the max bound to this directive.

跟踪对此指令绑定的最大值的更改。

Provider which adds `MinValidator` to the `NG_VALIDATORS` multi-provider list.

将 `MinValidator` 添加到 `NG_VALIDATORS` 多提供程序列表的提供程序。

Adding a min validator

添加最小值验证器

The following example shows how to add a min validator to an input attached to an
ngModel binding.

以下示例展示了如何将 min 验证器添加到附加到 ngModel 绑定的输入。

A directive which installs the {&commat;link MinValidator} for any `formControlName`,
`formControl`, or control with `ngModel` that also has a `min` attribute.

一个指令，它为任何 `formControlName`、`formControl` 或使用也具有 `min` 属性的 `ngModel`
的控件安装 {&commat;link MinValidator}。

Tracks changes to the min bound to this directive.

跟踪对此指令绑定的 min 的更改。

An interface implemented by classes that perform asynchronous validation.

由执行异步验证的类实现的接口。

Provide a custom async validator directive

提供自定义异步验证程序指令

The following example implements the `AsyncValidator` interface to create an
async validator directive with a custom error key.

以下示例实现 `AsyncValidator` 接口，以使用自定义错误键名创建异步验证程序指令。

Method that performs async validation against the provided control.

对提供的控件执行异步验证的方法。

A promise or observable that resolves a map of validation errors
if validation fails, otherwise null.

如果验证失败，则将解决验证错误映射表的 Promise 或 Observable，否则为 null。

Provider which adds `RequiredValidator` to the `NG_VALIDATORS` multi-provider list.

将 `RequiredValidator` 添加到 `NG_VALIDATORS` 多提供程序列表的提供程序。

Provider which adds `CheckboxRequiredValidator` to the `NG_VALIDATORS` multi-provider list.

将 `CheckboxRequiredValidator` 添加到 `NG_VALIDATORS` 多提供程序列表的提供程序。

A directive that adds the `required` validator to any controls marked with the
`required` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.

该指令会借助 `NG_VALIDATORS` 绑定把 `required` 验证器添加到任何带 `required` 属性的控件上。

Adding a required validator using template-driven forms

使用模板驱动表单添加必填项验证器

Tracks changes to the required attribute bound to this directive.

跟踪对该指令绑定的 required 属性的更改。

Adding a required checkbox validator using template-driven forms

使用模板驱动表单为复选框添加必填项验证器

The following example shows how to add a checkbox required validator to an input attached to an\*
ngModel binding.

下面的例子展示了如何为一个带有 ngModel 绑定的检查框添加必填项验证器。

A Directive that adds the `required` validator to checkbox controls marked with the
`required` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.

该指令会借助 `NG_VALIDATORS` 绑定把 `required` 验证器添加到任何带有 `required`
属性的检查框控件上。

Provider which adds `EmailValidator` to the `NG_VALIDATORS` multi-provider list.

该提供者用于把 `EmailValidator` 添加到 `NG_VALIDATORS` 中。

Adding an email validator

添加 email 验证器

The following example shows how to add an email validator to an input attached to an ngModel\*
binding.

下面的例子演示了如何为一个带有 ngModel 绑定的输入框添加 email 验证器。

A directive that adds the `email` validator to controls marked with the
`email` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.

该指令会借助 `NG_VALIDATORS` 绑定把 `email` 验证器添加到任何带有 `email` 属性的控件上。

The email validation is based on the WHATWG HTML specification with some enhancements to
incorporate more RFC rules. More information can be found on the [Validators.email
page](api/forms/Validators#email).

电子邮件验证基于 WHATWG HTML 规范，并进行了一些增强以包含更多 RFC
规则。更多信息，请参阅[Validator.email 页面](api/forms/Validators#email)。

Tracks changes to the email attribute bound to this directive.

跟踪绑定到该指令的 email 属性的更改。

A function that receives a control and synchronously returns a map of
validation errors if present, otherwise null.

本函数接收控件并同步返回验证错误的映射表（如果存在），否则返回 null。

A function that receives a control and returns a Promise or observable
that emits validation errors if present, otherwise null.

本函数接收控件并返回 Promise 或 Observable，如果存在，则该函数会发出验证错误，否则为 null。

Provider which adds `MinLengthValidator` to the `NG_VALIDATORS` multi-provider list.

一个提供者，用于把 `MinLengthValidator` 添加到 `NG_VALIDATORS` 多重提供者列表中。

Adding a minimum length validator

添加最小长度验证器

The following example shows how to add a minimum length validator to an input attached to an
ngModel binding.

下面的例子演示了如何为带有 ngModel 绑定的输入框添加最小长度验证器。

A directive that adds minimum length validation to controls marked with the
`minlength` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.

该指令用于为带有 `minlength` 属性的控件添加最小长度验证器。该指令会提供 `NG_VALIDATORS`
多重提供者列表。

Tracks changes to the minimum length bound to this directive.

跟踪对此指令绑定的最小长度的更改。

Provider which adds `MaxLengthValidator` to the `NG_VALIDATORS` multi-provider list.

一个提供者，用于把 `MaxLengthValidator` 添加到 `NG_VALIDATORS` 多重提供者列表中。

Adding a maximum length validator

添加最大长度验证器

The following example shows how to add a maximum length validator to an input attached to an
ngModel binding.

下面的例子演示了如何为一个带有 ngModel 绑定的输入框添加最大长度验证器。

A directive that adds max length validation to controls marked with the
`maxlength` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.

该指令用于为带有 `maxlength` 属性的控件添加最大长度验证器。该指令会提供 `NG_VALIDATORS`
多重提供者列表。

Provider which adds `PatternValidator` to the `NG_VALIDATORS` multi-provider list.

将 `PatternValidator` 添加到 `NG_VALIDATORS` 多提供程序列表的提供程序。

A directive that adds regex pattern validation to controls marked with the
`pattern` attribute. The regex must match the entire control value.
The directive is provided with the `NG_VALIDATORS` multi-provider list.

该指令会借助 `NG_VALIDATORS` 绑定来把 `pattern` 验证器添加到任何带有 `pattern` 属性的控件上。
它会使用该属性的值作为正则表达式来验证控件的值。
它会遵循 `pattern` 属性的语义，也就是说，该正则表达式必须匹配整个控件值。

Adding a pattern validator

添加模式（pattern）验证器

The following example shows how to add a pattern validator to an input attached to an
ngModel binding.

下面的例子演示了如何为一个带有 ngModel 绑定的输入框添加模式验证器。

Tracks changes to the pattern bound to this directive.

跟踪对与此指令绑定的模式（pattern）的更改。
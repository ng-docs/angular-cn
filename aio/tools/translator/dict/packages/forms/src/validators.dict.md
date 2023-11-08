An `InjectionToken` for registering additional synchronous validators used with
`AbstractControl`s.

一个 `InjectionToken`，用于注册额外的同步验证器，供 `AbstractControl` 使用。

Providing a custom validator

提供自定义验证器

The following example registers a custom validator directive. Adding the validator to the
existing collection of validators requires the `multi: true` option.

下面的例子注册了一个自定义验证器指令。要把该验证器添加到现存的验证器集合中，需要使用 `multi:
true` 选项。

An `InjectionToken` for registering additional asynchronous validators used with
`AbstractControl`s.

一个 `InjectionToken`，用于注册额外的异步验证器，供 `AbstractControl` 使用。

Provide a custom async validator directive

提供自定义异步验证器指令

The following example implements the `AsyncValidator` interface to create an
async validator directive with a custom error key.

以下示例实现了 `AsyncValidator` 接口，以创建使用自定义错误键的异步验证器指令。

A regular expression that matches valid e-mail addresses.

与有效电子邮件地址匹配的正则表达式。

At a high level, this regexp matches e-mail addresses of the format `local-part@tld`, where:

在较高级别，此正则表达式会匹配 `local-part@tld` 格式的电子邮件地址，其中：

`local-part` consists of one or more of the allowed characters \(alphanumeric and some
punctuation symbols\).

`local-part` 由一个或多个允许的字符（字母数字和一些标点符号）组成。

`local-part` cannot begin or end with a period \(`.`\).

`local-part` 不能以句点 \( `.` \) 开头或结尾。

`local-part` cannot be longer than 64 characters.

`local-part` 不能长于 64 个字符。

`tld` consists of one or more `labels` separated by periods \(`.`\). For example `localhost` or
`foo.com`.

`tld` 由一个或多个用句点 \( `.` \) 分隔的 `labels` 组成。例如 `localhost` 或 `foo.com`。

A `label` consists of one or more of the allowed characters \(alphanumeric, dashes \(`-`\) and
periods \(`.`\)\).

`label` 由一个或多个允许的字符（字母数字、破折号 \( `-` \) 和句点 \( `.` \)）组成。

A `label` cannot begin or end with a dash \(`-`\) or a period \(`.`\).

`label` 不能以短划线 \( `-` \) 或句点 \( `.` \) 开头或结尾。

A `label` cannot be longer than 63 characters.

`label` 不能超过 63 个字符。

The whole address cannot be longer than 254 characters.

整个地址不能超过 254 个字符。

Implementation background

实现背景

This regexp was ported over from AngularJS \(see there for git history\):
https://github.com/angular/angular.js/blob/c133ef836/src/ng/directive/input.js#L27
It is based on the
[WHATWG version](https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address) with
some enhancements to incorporate more RFC rules \(such as rules related to domain names and the
lengths of different parts of the address\). The main differences from the WHATWG version are:

此正则表达式是从 AngularJS 移植的（有关 git 历史记录，请参阅那里）：
https://github.com/angular/angular.js/blob/c133ef836/src/ng/directive/input.js#L27 它基于[WHATWG](https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address)具有一些增强功能以包含更多
RFC
规则的[版本](https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address)（例如与域名和地址不同部分的长度相关的规则）。与
WHATWG 版本的主要区别是：

Disallow `local-part` to begin or end with a period \(`.`\).

不允许 `local-part` 以句点 \( `.` \) 开头或结尾。

Disallow `local-part` length to exceed 64 characters.

不允许 `local-part` 长度超过 64 个字符。

Disallow total address length to exceed 254 characters.

不允许总地址长度超过 254 个字符。

See [this commit](https://github.com/angular/angular.js/commit/f3f5cf72e) for more details.

有关更多详细信息，请参阅[此提交](https://github.com/angular/angular.js/commit/f3f5cf72e)。

Provides a set of built-in validators that can be used by form controls.

提供一组内置验证器，可用于各种表单控件。

A validator is a function that processes a `FormControl` or collection of
controls and returns an error map or null. A null map means that validation has passed.

验证器就是一个函数，它可以处理单个 `FormControl` 或一组控件，并返回一个错误映射表（map）或
null。null 表示验证已通过了。

[Form Validation](/guide/form-validation)

[表单验证](/guide/form-validation)

Validator that requires the control's value to be greater than or equal to the provided number.

此验证器要求控件的值大于或等于指定的数字。
它只有函数形式，没有指令形式。

Validate against a minimum of 3

验证至少为 3

A validator function that returns an error map with the
`min` property if the validation check fails, otherwise `null`.

如果验证失败，则此验证器函数返回一个带有 `min` 属性的映射表（map），否则为 `null`。

Validator that requires the control's value to be less than or equal to the provided number.

此验证器要求控件的值小于等于指定的数字。
它只有函数形式，没有指令形式。

Validate against a maximum of 15

验证最大为 15

A validator function that returns an error map with the
`max` property if the validation check fails, otherwise `null`.

如果验证失败，则此验证器函数返回一个带有 `max` 属性的映射表（map），否则为 `null`。

Validator that requires the control have a non-empty value.

此验证器要求控件具有非空值。

Validate that the field is non-empty

验证该字段不是空的

An error map with the `required` property
if the validation check fails, otherwise `null`.

如果验证失败，则此验证器函数返回一个带有 `required` 属性的映射表（map），否则为 `null`。

Validator that requires the control's value be true. This validator is commonly
used for required checkboxes.

此验证器要求控件的值为真。它通常用来验证检查框。

Validate that the field value is true

验证字段值为真

An error map that contains the `required` property
set to `true` if the validation check fails, otherwise `null`.

如果验证失败，则此验证器函数返回一个带有 `required` 属性、值为 `true` 的映射表（map），否则为
`null`。

Validator that requires the control's value pass an email validation test.

此验证器要求控件的值能通过 email 格式验证。

Tests the value using a [regular
expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
pattern suitable for common use cases. The pattern is based on the definition of a valid email
address in the [WHATWG HTML
specification](https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address) with
some enhancements to incorporate more RFC rules \(such as rules related to domain names and the
lengths of different parts of the address\).

使用适合普通用例的[正则表达式模式测试值](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)。该模式基于
[WHATWG HTML
规范](https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address)中有效电子邮件地址的定义，并进行了一些增强以支持更多的
RFC 规则（比如与域名相关的规则以及地址不同部分的长度）。

The differences from the WHATWG version include:

与 WHATWG 版本的区别包括：

Disallow `local-part` \(the part before the `@` symbol\) to begin or end with a period \(`.`\).

禁止 `local-part`（`@` 符号前面的部分）以句点（`.`）开头或结尾。

Disallow `local-part` to be longer than 64 characters.

不允许 `local-part` 超过 64 个字符。

Disallow the whole address to be longer than 254 characters.

不允许整个地址超过 254 个字符。

If this pattern does not satisfy your business needs, you can use `Validators.pattern()` to
validate the value against a different pattern.

如果此模式不能满足你的业务需求，则可以使用 `Validators.pattern()` 来针对其他模式验证值。

Validate that the field matches a valid email pattern

验证该字段匹配有效的 email 格式。

A validator function that returns an error map with the
`minlength` property if the validation check fails, otherwise `null`.

如果验证失败，则此验证器函数返回一个带有 `minlength` 属性的映射表（map），否则为 `null`。

&commat;description
Validator that requires the length of the control's value to be greater than or equal
to the provided minimum length. This validator is also provided by default if you use the
the HTML5 `minlength` attribute. Note that the `minLength` validator is intended to be used
only for types that have a numeric `length` property, such as strings or arrays. The
`minLength` validator logic is also not invoked for values when their `length` property is 0
\(for example in case of an empty string or an empty array\), to support optional controls. You
can use the standard `required` validator if empty values should not be considered valid.

此验证器要求控件值的长度大于等于所指定的最小长度。当使用 HTML5 的 `minlength`
属性时，此验证器也会生效。

&commat;usageNotes

用法说明

Validate that the field has a minimum of 3 characters

验证该字段至少有 3 个字符

Validator that requires the length of the control's value to be less than or equal
to the provided maximum length. This validator is also provided by default if you use the
the HTML5 `maxlength` attribute. Note that the `maxLength` validator is intended to be used
only for types that have a numeric `length` property, such as strings or arrays.

此验证器要求控件值的长度小于等于所指定的最大长度。当使用 HTML5 的 `maxlength`
属性时，此验证器也会生效。

Validate that the field has maximum of 5 characters

验证该字段最多具有 5 个字符

A validator function that returns an error map with the
`maxlength` property if the validation check fails, otherwise `null`.

如果验证失败，则此验证器函数返回一个带有 `maxlength` 属性的映射表（map），否则为 `null`。

Validator that requires the control's value to match a regex pattern. This validator is also
provided by default if you use the HTML5 `pattern` attribute.

此验证器要求控件的值匹配某个正则表达式。当使用 HTML5 的 `pattern` 属性时，它也会生效。

Validate that the field only contains letters or spaces

验证该字段只包含字母或空格

Pattern matching with the global or sticky flag

带有全局或粘性（sticky）标志的匹配模式

`RegExp` objects created with the `g` or `y` flags that are passed into `Validators.pattern`
can produce different results on the same input when validations are run consecutively. This is
due to how the behavior of `RegExp.prototype.test` is
specified in [ECMA-262](https://tc39.es/ecma262/#sec-regexpbuiltinexec)
\(`RegExp` preserves the index of the last match when the global or sticky flag is used\).
Due to this behavior, it is recommended that when using
`Validators.pattern` you **do not** pass in a `RegExp` object with either the global or sticky
flag enabled.

当要连续运行验证时，使用传递给 `Validators.pattern` 的 `g` 或 `y` 标志创建的 `RegExp`
对象可以在同一输入上产生不同的结果。这是由于在 [ECMA-262
中](https://tc39.es/ecma262/#sec-regexpbuiltinexec)为 `RegExp.prototype.test`
定义的行为（`RegExp` 保留了最后一个匹配项的索引）。由于这种现象，建议你使用
`Validators.pattern` 时**不要**传入启用了全局或粘性标志的 `RegExp`。

A regular expression to be used as is to test the values, or a string.
If a string is passed, the `^` character is prepended and the `$` character is
appended to the provided string \(if not already present\), and the resulting regular
expression is used to test the values.

用于测试值的正则表达式或字符串。如果传递了字符串，会在它前面追加 `^` 字符，并在后面追加 `$`
字符（如果尚不存在），然后使用所得的正则表达式测试这些值。

A validator function that returns an error map with the
`pattern` property if the validation check fails, otherwise `null`.

如果验证失败，则此验证器函数返回一个带有 `pattern` 属性的映射表（map），否则为 `null`。

Validator that performs no operation.

此验证器什么也不做。

Compose multiple validators into a single function that returns the union
of the individual error maps for the provided control.

把多个验证器合并成一个函数，它会返回指定控件的各个错误映射表的并集。

A validator function that returns an error map with the
merged error maps of the validators if the validation check fails, otherwise `null`.

如果验证失败，则此验证器函数返回各个验证器所返回错误对象的一个并集，否则为 `null`。

Compose multiple async validators into a single function that returns the union
of the individual error objects for the provided control.

把多个异步验证器合并成一个函数，它会返回指定控件的各个错误映射表的并集。

A validator function that returns an error map with the
merged error objects of the async validators if the validation check fails, otherwise `null`.

如果验证失败，则此验证器函数返回各异步验证器所返回错误对象的一个并集，否则为 `null`。

Validator that requires the control's value to be greater than or equal to the provided number.
See `Validators.min` for additional information.

要求控件的值大于或等于提供的数字的验证器。有关其他信息，请参阅 `Validators.min`。

Validator that requires the control's value to be less than or equal to the provided number.
See `Validators.max` for additional information.

要求控件的值小于或等于提供的数字的验证器。有关其他信息，请参阅 `Validators.max`。

Validator that requires the control have a non-empty value.
See `Validators.required` for additional information.

需要控件的验证器具有非空值。有关其他信息，请参阅 `Validators.required`。

Validator that requires the control's value be true. This validator is commonly
used for required checkboxes.
See `Validators.requiredTrue` for additional information.

要求控件的值为 true 的验证器。此验证器通常用于所需的复选框。有关其他信息，请参阅
`Validators.requiredTrue`。

Validator that requires the control's value pass an email validation test.
See `Validators.email` for additional information.

需要控件值的验证器通过电子邮件验证测试。有关其他信息，请参阅 `Validators.email`。

Validator that requires the length of the control's value to be greater than or equal
to the provided minimum length. See `Validators.minLength` for additional information.

要求控件值的长度大于或等于提供的最小长度的验证器。有关其他信息，请参阅 `Validators.minLength`。

Validator that requires the length of the control's value to be less than or equal
to the provided maximum length. See `Validators.maxLength` for additional information.

要求控件值的长度小于或等于提供的最大长度的验证器。有关其他信息，请参阅 `Validators.maxLength`。

Validator that requires the control's value to match a regex pattern.
See `Validators.pattern` for additional information.

需要控件的值与正则表达式模式匹配的验证器。有关其他信息，请参阅 `Validators.pattern`。

Function that has `ValidatorFn` shape, but performs no operation.

具有 `ValidatorFn` 形状但不执行任何操作的函数。

The set of validators that may contain validators both in plain function form
    as well as represented as a validator class.

可能包含普通函数形式的验证器以及表示为验证器类的验证器集。

Given the list of validators that may contain both functions as well as classes, return the list
of validator functions \(convert validator classes into validator functions\). This is needed to
have consistent structure in validators list before composing them.

给定可能包含函数和类的验证器列表，返回验证器函数列表（将验证器类转换为验证器函数）。这需要在组成验证器列表之前在验证器列表中具有一致的结构。

Merges synchronous validators into a single validator function.
See `Validators.compose` for additional information.

将同步验证器合并到单个验证器函数中。有关其他信息，请参阅 `Validators.compose`。

Accepts a list of validators of different possible shapes \(`Validator` and `ValidatorFn`\),
normalizes the list \(converts everything to `ValidatorFn`\) and merges them into a single
validator function.

接受具有不同可能形状的验证器列表（`Validator` 和 `ValidatorFn`
），对列表进行规范化（将所有内容转换为 `ValidatorFn`）并将它们合并到一个验证器函数中。

Merges asynchronous validators into a single validator function.
See `Validators.composeAsync` for additional information.

将异步验证器合并到单个验证器函数中。有关其他信息，请参阅 `Validators.composeAsync`。

Accepts a list of async validators of different possible shapes \(`AsyncValidator` and
`AsyncValidatorFn`\), normalizes the list \(converts everything to `AsyncValidatorFn`\) and merges
them into a single validator function.

接受具有不同可能形状的异步验证器列表（`AsyncValidator` 和 `AsyncValidatorFn`
），对该列表进行规范化（将所有内容转换为 `AsyncValidatorFn`）并将它们合并到一个验证器函数中。

Merges raw control validators with a given directive validator and returns the combined list of
validators as an array.

将原始控制验证器与给定的指令验证器合并，并以数组的形式返回验证器的组合列表。

Retrieves the list of raw synchronous validators attached to a given control.

检索附加到给定控件的原始同步验证器列表。

Retrieves the list of raw asynchronous validators attached to a given control.

检索附加到给定控件的原始异步验证器列表。

A validator, validators, or null.

一个验证器，一个或多个验证器，或 null。

A validators array.

验证器数组。

Accepts a singleton validator, an array, or null, and returns an array type with the provided
validators.

接受单例验证器、数组或 null，并返回使用提供的验证器的数组类型。

The validator or validators to compare against.

要比较的验证器。

The validator to check.

要检查的验证器。

Whether the validator is present.

验证器是否存在。

Determines whether a validator or validators array has a given validator.

确定验证器或验证器数组是否具有给定的验证器。

The new validators.

新的验证器。

The base array of current validators.

当前验证器的基础数组。

An array of validators.

验证器数组。

Combines two arrays of validators into one. If duplicates are provided, only one will be added.

将两个验证器数组合并为一个。如果提供了重复项，则只会添加一个。
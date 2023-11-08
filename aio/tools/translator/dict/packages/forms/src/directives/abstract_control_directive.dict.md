Base class for control directives.

控件指令的基类。

This class is only used internally in the `ReactiveFormsModule` and the `FormsModule`.

此类仅在 `ReactiveFormsModule` 和 `FormsModule` 内部使用。

A reference to the underlying control.

对基础控件的引用。

the control that backs this directive. Most properties fall through to that instance.

支持此指令的控件。大多数属性都属于该实例。

Reports the value of the control if it is present, otherwise null.

报告控件的值（如果存在），否则为 null。

Reports whether the control is valid. A control is considered valid if no
validation errors exist with the current value.
If the control is not present, null is returned.

报告控件是否有效。如果当前值不存在验证错误，则控件被视为有效。如果控件不存在，则返回 null。

Reports whether the control is invalid, meaning that an error exists in the input value.
If the control is not present, null is returned.

报告控件是否无效，表示输入值中存在错误。如果控件不存在，则返回 null。

Reports whether a control is pending, meaning that that async validation is occurring and
errors are not yet available for the input value. If the control is not present, null is
returned.

报告控件是否处于挂起状态，这意味着异步验证正在发生，并且错误尚未可用于输入值。如果控件不存在，则返回
null。

Reports whether the control is disabled, meaning that the control is disabled
in the UI and is exempt from validation checks and excluded from aggregate
values of ancestor controls. If the control is not present, null is returned.

报告该控件是否被禁用，这意味着该控件在 UI
中被禁用，并且免于进行验证检查，并被排除在祖先控件的聚合值之外。如果控件不存在，则返回 null。

Reports whether the control is enabled, meaning that the control is included in ancestor
calculations of validity or value. If the control is not present, null is returned.

报告控件是否被启用，这意味着控件已包含在祖先的有效性计算或值计算中。如果控件不存在，则返回
null。

Reports the control's validation errors. If the control is not present, null is returned.

报告控件的验证错误。如果控件不存在，则返回 null。

Reports whether the control is pristine, meaning that the user has not yet changed
the value in the UI. If the control is not present, null is returned.

报告控件是否为原始状态，原始的意思是用户尚未更改过 UI 中的值。如果控件不存在，则返回 null。

Reports whether the control is dirty, meaning that the user has changed
the value in the UI. If the control is not present, null is returned.

报告控件是否脏状态，脏的意思是用户已更改过 UI 中的值。如果控件不存在，则返回 null。

Reports whether the control is touched, meaning that the user has triggered
a `blur` event on it. If the control is not present, null is returned.

报告控件是否被接触过，被接触过的意思是用户已在控件上触发过 `blur` 事件。如果控件不存在，则返回
null。

Reports the validation status of the control. Possible values include:
'VALID', 'INVALID', 'DISABLED', and 'PENDING'.
If the control is not present, null is returned.

报告控件的验证状态。可能的值包括：“VALID”、“INVALID”、“DISABLED” 和
“PENDING”。如果控件不存在，则返回 null。

Reports whether the control is untouched, meaning that the user has not yet triggered
a `blur` event on it. If the control is not present, null is returned.

报告控件是否未被接触过，未被接触过的意思是用户尚未在其上触发过 `blur`
事件。如果控件不存在，则返回 null。

Returns a multicasting observable that emits a validation status whenever it is
calculated for the control. If the control is not present, null is returned.

返回一个多播的可观察对象，它会发出为此控件计算过的验证状态。如果控件不存在，则返回 null。

Returns a multicasting observable of value changes for the control that emits every time the
value of the control changes in the UI or programmatically.
If the control is not present, null is returned.

返回控件值变更的多播可观察对象，它会在每次控件的值在 UI
中或以编程方式更改时触发。如果控件不存在，则返回 null。

Returns an array that represents the path from the top-level form to this control.
Each index is the string name of the control on that level.

返回一个数组，该数组表示从顶级表单到此控件的路径。每个索引是该级别上控件的字符串名称。

Set of synchronous validators as they were provided while calling `setValidators` function.

调用 `setValidators` 函数时提供的一组同步验证器。

Set of asynchronous validators as they were provided while calling `setAsyncValidators`
function.

调用 `setAsyncValidators` 函数时提供的一组异步验证器。

Sets synchronous validators for this directive.

为此指令设置同步验证器。

Sets asynchronous validators for this directive.

为此指令设置异步验证器。

Synchronous validator function composed of all the synchronous validators registered with this
directive.

同步验证器函数，由使用此指令注册的所有同步验证器组合而成。

Asynchronous validator function composed of all the asynchronous validators registered with
this directive.

异步验证器函数，由使用此指令注册的所有异步验证器组合而成。

Internal function to register callbacks that should be invoked
when directive instance is being destroyed.

内部函数，用于注册在销毁指令实例时应调用的回调。

Internal function to invoke all registered "on destroy" callbacks.
Note: calling this function also clears the list of callbacks.

内部函数，用于调用所有已注册的 “on destroy” 回调。注意：调用此函数还会清除回调列表。

Resets the control with the provided value if the control is present.

如果此控件存在，则使用所提供的值重置它。

Reports whether the control with the given path has the error specified.

报告给定路径下的控件是否具有指定的错误。

The code of the error to check

要检查的错误代码

A list of control names that designates how to move from the current control
to the control that should be queried for errors.

控件名称列表，用于指定如何从当前控件移至要查询错误的控件。

For example, for the following `FormGroup`:

比如下面的 `FormGroup`：

The path to the 'street' control from the root form would be 'address' -> 'street'.

此 'street' 控件的从根表单开始的路径应该是 'address' -> 'street'。

It can be provided to this method in one of two formats:

调用此方法有两种形式：

An array of string control names, e.g. `['address', 'street']`

控件名称的字符串数组，如 `['address', 'street']`

A period-delimited list of control names in one string, e.g. `'address.street'`

以一个字符串表示的句号分隔的控件名称列表，如 `'address.street'`

If no path is given, this method checks for the error on the current control.

如果没有给出路径，则此方法检查当前控件上的错误。

whether the given error is present in the control at the given path.

给定路径中的控件中是否存在给定错误。

If the control is not present, false is returned.

如果控件不存在，则返回 false。

Reports error data for the control with the given path.

报告给定路径下的控件的错误数据。

error data for that particular error. If the control or error is not present,
null is returned.

该特定错误的错误数据。如果控件或错误不存在，则返回 null。
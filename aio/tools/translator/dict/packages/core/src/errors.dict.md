The list of error codes used in runtime code of the `core` package.
Reserved error code range: 100-999.

`core` 包的运行时代码中使用的错误代码列表。预留错误代码范围：100-999。

Note: the minus sign denotes the fact that a particular code has a detailed guide on
angular.io. This extra annotation is needed to avoid introducing a separate set to store
error codes which have guides, which might leak into runtime code.

注意：减号表示特定代码在 angular.io 上有详细的指南。需要这个额外的注释来避免引入一个单独的集合来存储具有指南的错误代码，这可能会泄漏到运行时代码中。

Full list of available error guides can be found at https://angular.io/errors.

可以在 https://angular.io/errors 找到可用错误指南的完整列表。

Error code ranges per package:

每个包的错误代码范围：

core \(this package\): 100-999

核心（本套餐）：100-999

forms: 1000-1999

表格：1000-1999

common: 2000-2999

普通：2000-2999

animations: 3000-3999

动画：3000-3999

router: 4000-4999

路由器：4000-4999

platform-browser: 5000-5500

平台浏览器：5000-5500

Class that represents a runtime error.
Formats and outputs the error message in a consistent way.

表示运行时错误的类。以一致的方式格式化和输出错误消息。

Example:

范例：

Note: the `message` argument contains a descriptive error message as a string in development
mode \(when the `ngDevMode` is defined\). In production mode \(after tree-shaking pass\), the
`message` argument becomes `false`, thus we account for it in the typings and the runtime
logic.

注意：`message` 参数在开发模式中包含一个描述性错误消息作为字符串（当定义了 `ngDevMode` 时）。在生产模式下（在 tree-shaking 通过之后），`message` 参数变为 `false`，因此我们在类型和运行时逻辑中考虑它。

Called to format a runtime error.
See additional info on the `message` argument type in the `RuntimeError` class description.

调用以格式化运行时错误。请参阅 `RuntimeError` 类描述中有关 `message` 参数类型的其他信息。
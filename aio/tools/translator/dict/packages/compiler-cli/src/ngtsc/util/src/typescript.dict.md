Type describing a symbol that is guaranteed to have a value declaration.

描述保证具有 value 声明的符号的类型。

Resolve the specified `moduleName` using the given `compilerOptions` and `compilerHost`.

使用给定的 `compilerOptions` 和 `compilerHost` 解析指定的 `moduleName`。

This helper will attempt to use the `CompilerHost.resolveModuleNames()` method if available.
Otherwise it will fallback on the `ts.ResolveModuleName()` function.

如果可用，此帮助器将尝试使用 `CompilerHost.resolveModuleNames()` 方法。否则，它将回
`ts.ResolveModuleName()` 函数。

Returns true if the node is an assignment expression.

如果节点是赋值表达式，则返回 true。

Asserts that the keys `K` form a subset of the keys of `T`.

断言键 `K` 形成 `T` 的键的子集。

Represents the type `T`, with a transformation applied that turns all methods \(even optional
ones\) into required fields \(which may be `undefined`, if the method was optional\).

表示 `T` 类型，并应用了转换，将所有方法（甚至是可选的）转换为必需字段（如果方法是可选的，则可能是
`undefined`）。

Source files may become redirects to other source files when their package name and version are
identical. TypeScript creates a proxy source file for such source files which has an internal
`redirectInfo` property that refers to the original source file.

当包名和版本相同时，源文件可能会重定向到其他源文件。TypeScript
为此类源文件创建一个代理源文件，该文件具有引用原始源文件的内部 `redirectInfo` 属性。

Obtains the non-redirected source file for `sf`.

获取 `sf` 的非重定向源文件。
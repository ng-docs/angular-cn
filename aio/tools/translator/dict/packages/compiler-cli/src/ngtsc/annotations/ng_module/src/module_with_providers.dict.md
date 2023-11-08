The reflection host to use for analyzing the syntax.

用于分析语法的反射宿主。

Whether the

是否

Creates a foreign function resolver to detect a `ModuleWithProviders<T>` type in a return type
position of a function or method declaration. A `SyntheticValue` is produced if such a return
type is recognized.

创建一个外部函数解析器，以检测函数或方法声明的返回类型位置中的 `ModuleWithProviders<T>`
类型。如果识别到这样的返回类型，则会生成 `SyntheticValue`。

The type to reflect on.

要反射的类型。

the identifier of the NgModule type if found, or null otherwise.

如果找到，则为 NgModule 类型的标识符，否则为 null。

Retrieve an `NgModule` identifier \(T\) from the specified `type`, if it is of the form:
`ModuleWithProviders<T>`

从指定的 `type` 检索 `NgModule` 标识符（T），如果它是以下形式：`ModuleWithProviders<T>`

Retrieve an `NgModule` identifier \(T\) from the specified `type`, if it is of the form:
`A|B|{ngModule: T}|C`.

从指定的 `type` 检索 `NgModule` 标识符（T），如果它是以下格式：`A|B|{ngModule: T}|C`。
Label for various kinds of Angular entities for TS display info.

TS 显示信息的各种 Angular 实体的标签。

Name of the target

目标的名称

component, directive, pipe, etc.

组件、指令、管道等

either the Symbol's container or the NgModule that contains the directive

Symbol 的容器或包含该指令的 NgModule

user-friendly name of the type

类型的用户友好名称

docstring or comment

文档字符串或注释

Construct a compound `ts.SymbolDisplayPart[]` which incorporates the container and type of a
target declaration.

构造一个复合 `ts.SymbolDisplayPart[]`，它包含 target 声明的容器和类型。

Convert a `SymbolDisplayInfoKind` to a `ts.ScriptElementKind` type, allowing it to pass through
TypeScript APIs.

将 `SymbolDisplayInfoKind` 转换为 `ts.ScriptElementKind` 类型，允许它通过 TypeScript API。

In practice, this is an "illegal" type cast. Since `ts.ScriptElementKind` is a string, this is
safe to do if TypeScript only uses the value in a string context. Consumers of this conversion
function are responsible for ensuring this is the case.

在实践中，这是一种“非法”类型的转换。由于 `ts.ScriptElementKind` 是一个字符串，因此如果 TypeScript
仅在字符串上下文中使用该值，则这样做是安全的。此转换函数的使用者有责任确保是这种情况。
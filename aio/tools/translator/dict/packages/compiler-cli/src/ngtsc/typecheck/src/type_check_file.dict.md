An `Environment` representing the single type-checking file into which most \(if not all\) Type
Check Blocks \(TCBs\) will be generated.

一个 `Environment`，表示将在其中生成大多数（如果不是全部）类型检查块（TCB）的单个类型检查文件。

The `TypeCheckFile` hosts multiple TCBs and allows the sharing of declarations \(e.g. type
constructors\) between them. Rather than return such declarations via `getPreludeStatements()`, it
hoists them to the top of the generated `ts.SourceFile`.

`TypeCheckFile` 托管多个 TCB，并允许在它们之间共享声明（例如类型构造函数）。它没有通过
`getPreludeStatements()` 返回此类声明，而是将它们提升到生成的 `ts.SourceFile` 的顶部。
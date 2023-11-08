Potentially convert a `ts.TypeNode` to a `TypeValueReference`, which indicates how to use the
type given in the `ts.TypeNode` in a value position.

可能将 `ts.TypeNode` 转换为 `TypeValueReference`，这表明如何在值位置中使用 `ts.TypeNode`
中给定的类型。

This can return `null` if the `typeNode` is `null`, if it does not refer to a symbol with a value
declaration, or if it is not possible to statically understand.

如果 `typeNode` 为 `null` 、如果它不引用带有 value 声明的符号，或者无法静态理解，这可以返回
`null`。

Attempt to extract a `ts.Expression` that's equivalent to a `ts.TypeNode`, as the two have
different AST shapes but can reference the same symbols.

尝试提取与 `ts.Expression` 等效的 `ts.TypeNode`，因为两者具有不同的 AST
形状，但可以引用相同的符号。

This will return `null` if an equivalent expression cannot be constructed.

如果无法构造等效表达式，这将返回 `null`。

Resolve a `TypeReference` node to the `ts.Symbol`s for both its declaration and its local source.

将 `TypeReference` 节点解析为 `ts.Symbol` s，以作为其声明和本地源。

In the event that the `TypeReference` refers to a locally declared symbol, these will be the
same. If the `TypeReference` refers to an imported symbol, then `decl` will be the fully resolved
`ts.Symbol` of the referenced symbol. `local` will be the `ts.Symbol` of the `ts.Identifier`
which points to the import statement by which the symbol was imported.

如果 `TypeReference` 引用本地声明的符号，这些将是相同的。如果 `TypeReference`
引用了导入的符号，则 `decl` 将是被引用符号的完全解析的 `ts.Symbol`。`local` 将是 `ts.Symbol` 的
`ts.Identifier`，它指向了导入符号的 import 语句。

All symbol names that make up the type reference are returned left-to-right into the
`symbolNames` array, which is guaranteed to include at least one entry.

构成类型引用的所有符号名称都会从左到右返回到 `symbolNames` 数组中，该数组保证至少包含一个条目。
Generates and caches `Symbol`s for various template structures for a given component.

为给定组件的各种模板结构生成并缓存 `Symbol`。

The `SymbolBuilder` internally caches the `Symbol`s it creates, and must be destroyed and
replaced if the component's template changes.

`SymbolBuilder` 在内部缓存它创建的 `Symbol`，如果组件的模板更改，则必须销毁和替换。

Filter predicate function that matches any AST node.

过滤与任何 AST 节点匹配的谓词函数。
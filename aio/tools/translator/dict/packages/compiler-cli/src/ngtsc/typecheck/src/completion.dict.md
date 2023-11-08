Powers autocompletion for a specific component.

支持特定组件的自动完成。

Internally caches autocompletion results, and must be discarded if the component template or
surrounding TS program have changed.

在内部缓存自动完成结果，如果组件模板或周围的 TS 程序发生更改，则必须丢弃。

the given template context - either a `TmplAstTemplate` embedded view, or `null`
    for the root
template context.

给定的模板上下文 - `TmplAstTemplate` 嵌入式视图，或根模板上下文为 `null`。

the given AST node

给定的 AST 节点

Get global completions within the given template context and AST node.

在给定的模板上下文和 AST 节点中获取全局自动完成。
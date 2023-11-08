Resolves `ir.ContextExpr` expressions \(which represent embedded view or component contexts\) to
either the `ctx` parameter to component functions \(for the current view context\) or to variables
that store those contexts \(for contexts accessed via the `nextContext()` instruction\).

将 `ir.ContextExpr` 表达式（表示嵌入式视图或组件上下文）解析为组件函数的 `ctx` 参数（对于当前视图上下文）或存储这些上下文的变量（对于通过 `nextContext()` 指令访问的上下文）。
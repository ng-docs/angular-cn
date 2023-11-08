Resolves lexical references in views \(`ir.LexicalReadExpr`\) to either a target variable or to
property reads on the top-level component context.

将视图中的词法引用 \( `ir.LexicalReadExpr` \) 解析为目标变量或顶级组件上下文中的属性读取。

Also matches `ir.RestoreViewExpr` expressions with the variables of their corresponding saved
views.

还将 `ir.RestoreViewExpr` 表达式与其对应的已保存视图的变量相匹配。

Information about a `SavedView` variable.

有关 `SavedView` 变量的信息。

The view `ir.XrefId` which was saved into this variable.

保存到此变量中的视图 `ir.XrefId`。

The `ir.XrefId` of the variable into which the view was saved.

保存视图的变量的 `ir.XrefId`。
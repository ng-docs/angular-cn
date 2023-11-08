Merges logically sequential `NextContextExpr` operations.

合并逻辑顺序的 `NextContextExpr` 操作。

`NextContextExpr` can be referenced repeatedly, "popping" the runtime's context stack each time.
When two such expressions appear back-to-back, it's possible to merge them together into a single
`NextContextExpr` that steps multiple contexts. This merging is possible if all conditions are
met:

`NextContextExpr` 可以重复引用，每次都“弹出”运行时的上下文堆栈。当两个这样的表达式背靠背出现时，可以将它们合并到一个单步执行多个上下文的 `NextContextExpr` 中。如果满足所有条件，则可以进行此合并：

The result of the `NextContextExpr` that's folded into the subsequent one is not stored \(that
is, the call is purely side-effectful\).

折叠到后续结果中的 `NextContextExpr` 的结果不会被存储（也就是说，调用纯粹是副作用）。

No operations in between them uses the implicit context.

它们之间的任何操作都不使用隐式上下文。
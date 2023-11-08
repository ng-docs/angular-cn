A `PartialLinker` that is designed to process `ɵɵngDeclareNgModule()` call expressions.

一个 `PartialLinker`，旨在处理 `ɵɵngDeclareNgModule()` 调用表达式。

Derives the `R3NgModuleMetadata` structure from the AST object.

从 AST 对象 `R3NgModuleMetadata` 结构。

Extract an array from the body of the function.

从函数体中提取一个数组。

If `field` is `function() { return [exp1, exp2, exp3]; }` then we return `[exp1, exp2, exp3]`.

如果 `field` 是 `function() { return [exp1, exp2, exp3]; }` 那我们就返回 `[exp1, exp2, exp3]`。

Wrap the array of expressions into an array of R3 references.

将表达式数组包装到 R3 引用数组中。
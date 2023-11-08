type of the template node in question, narrowed accordingly.

相关模板节点的类型，相应缩小。

Performs autocompletion operations on a given node in the template.

在模板中的给定节点上执行自动完成操作。

This class acts as a closure around all of the context required to perform the 3 autocompletion
operations \(completions, get details, and get symbol\) at a specific node.

此类作为在特定节点上执行 3
个自动完成操作（自动完成、获取详细信息和获取符号）所需的所有上下文的闭包。

The generic `N` type for the template node is narrowed internally for certain operations, as the
compiler operations required to implement completion may be different for different node types.

对于某些操作，模板节点的通用 `N`
类型会在内部缩小，因为实现自动完成所需的编译器操作对于不同的节点类型可能不同。

Analogue for `ts.LanguageService.getCompletionsAtPosition`.

`ts.LanguageService.getCompletionsAtPosition` 的类似物。

Analogue for `ts.LanguageService.getCompletionEntryDetails`.

`ts.LanguageService.getCompletionEntryDetails` 的类似物。

Analogue for `ts.LanguageService.getCompletionEntrySymbol`.

`ts.LanguageService.getCompletionEntrySymbol` 的类似物。
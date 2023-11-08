The files that need to be re-emitted.

需要重新发出的文件。

The files for which the type-check block should be regenerated.

应该重新生成类型检查块的文件。

The newly built graph that represents the current compilation.

表示当前编译的新建图。

Represents a declaration for which no semantic symbol has been registered. For example,
declarations from external dependencies have not been explicitly registered and are represented
by this symbol. This allows the unresolved symbol to still be compared to a symbol from a prior
compilation.

表示没有注册语义符号的声明。例如，来自外部依赖项的声明尚未被显式注册，并由此符号表示。这允许仍将未解析的符号与先前编译中的符号进行比较。

The semantic dependency graph of a single compilation.

单个编译的语义依赖图。

Registers a symbol in the graph. The symbol is given a unique identifier if possible, such that
its equivalent symbol can be obtained from a prior graph even if its declaration node has
changed across rebuilds. Symbols without an identifier are only able to find themselves in a
prior graph if their declaration node is identical.

在图中注册一个符号。如果可能，该符号会被赋予唯一标识符，以便即使其声明节点在重建中发生了更改，也可以从先前的图中获得其等效符号。没有标识符的符号只有在它们的声明节点相同时才能在前面的图中找到自己。

The symbol from another graph for which its equivalent in this graph should be
found.

另一个图中的符号，应该在此图中找到其等效项。

Attempts to resolve a symbol in this graph that represents the given symbol from another graph.
If no matching symbol could be found, null is returned.

尝试解析此图中的一个符号，该符号表示另一个图中的给定符号。如果找不到匹配的符号，则返回 null。

Attempts to resolve the declaration to its semantic symbol.

尝试将声明解析为其语义符号。

Implements the logic to go from a previous dependency graph to a new one, along with information
on which files have been affected.

实现从上一个依赖图转到新依赖图的逻辑，以及有关哪些文件受到影响的信息。

Registers the symbol in the new graph that is being created.

在正在创建的新图中注册符号。

Takes all facts that have been gathered to create a new semantic dependency graph. In this
process, the semantic impact of the changes is determined which results in a set of files that
need to be emitted and/or type-checked.

采用已收集的所有事实来创建新的语义依赖图。在此过程中，确定更改的语义影响，这会产生一组需要发出和/或类型检查的文件。

Creates a `SemanticReference` for the reference to `decl` using the expression `expr`. See
the documentation of `SemanticReference` for details.

使用表达式 `expr` 为对 `decl` 的引用创建一个 `SemanticReference`。有关详细信息，请参阅
`SemanticReference` 的文档。

Gets the `SemanticSymbol` that was registered for `decl` during the current compilation, or
returns an opaque symbol that represents `decl`.

获取在当前编译期间为 `decl` 注册的 `SemanticSymbol`，或返回表示 `decl` 的不透明符号。
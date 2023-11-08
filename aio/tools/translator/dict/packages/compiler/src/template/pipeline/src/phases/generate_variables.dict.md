Generate a preamble sequence for each view creation block and listener function which declares
any variables that be referenced in other operations in the block.

为每个视图创建块和侦听器函数生成一个前导序列，该函数声明在块中的其他操作中引用的任何变量。

Variables generated include:

生成的变量包括：

a saved view context to be used to restore the current view in event listeners.

一个已保存的视图上下文，用于在事件侦听器中恢复当前视图。

the context of the restored view within event listener handlers.

事件侦听器处理程序中恢复视图的上下文。

context variables from the current view as well as all parent views \(including the root
context if needed\).

来自当前视图以及所有父视图的上下文变量（如果需要，包括根上下文）。

local references from elements within the current view and any lexical parents.

来自当前视图和任何词法父元素中的元素的本地引用。

Variables are generated here unconditionally, and may optimized away in future operations if it
turns out their values \(and any side effects\) are unused.

变量在这里无条件地生成，如果发现它们的值（和任何副作用）未被使用，则可能会在未来的操作中优化掉。

Process the given `ViewCompilation` and generate preambles for it and any listeners that it
declares.

处理给定的 `ViewCompilation` 并为它和它声明的任何侦听器生成前导码。

Lexical scope of a view, including a reference to its parent view's scope, if any.

视图的词法范围，包括对其父视图范围的引用（如果有）。

`XrefId` of the view to which this scope corresponds.

此范围对应的视图的 `XrefId`。

Local references collected from elements within the view.

从视图中的元素收集的本地引用。

`Scope` of the parent view, if any.

父视图的 `Scope` （如果有）。

Information needed about a local reference collected from an element within a view.

有关从视图中的元素收集的本地引用所需的信息。

Name given to the local reference variable within the template.

为模板中的局部引用变量指定的名称。

This is not the name which will be used for the variable declaration in the generated
template code.

这不是将在生成的模板代码中用于变量声明的名称。

`XrefId` of the element-like node which this reference targets.

此引用指向的类元素节点的 `XrefId`。

The reference may be either to the element \(or template\) itself, or to a directive on it.

引用可以是元素（或模板）本身，也可以是其上的指令。

A generated offset of this reference among all the references on a specific element.

此引用在特定元素的所有引用中生成的偏移量。

Process a view and generate a `Scope` representing the variables available for reference within
that view.

处理一个视图并生成一个 `Scope`，表示该视图中可供引用的变量。

Generate declarations for all variables that are in scope for a given view.

为给定视图范围内的所有变量生成声明。

This is a recursive process, as views inherit variables available from their parent view, which
itself may have inherited variables, etc.

这是一个递归过程，因为视图继承了其父视图可用的变量，父视图本身可能具有继承变量等。
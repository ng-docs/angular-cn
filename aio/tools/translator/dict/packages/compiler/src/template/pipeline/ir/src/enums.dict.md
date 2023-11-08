Distinguishes different kinds of IR operations.

区分不同类型的 IR 操作。

Includes both creation and update operations.

包括创建和更新操作。

A special operation type which is used to represent the beginning and end nodes of a linked
list of operations.

一种特殊的操作类型，用于表示操作链表的开始和结束节点。

An operation which wraps an output AST statement.

包装输出 AST 语句的操作。

An operation which declares and initializes a `SemanticVariable`.

声明并初始化 `SemanticVariable` 操作。

An operation to begin rendering of an element.

开始渲染元素的操作。

An operation to render an element with no children.

渲染没有子元素的元素的操作。

An operation which declares an embedded view.

声明嵌入视图的操作。

An operation to end rendering of an element previously started with `ElementStart`.

结束之前使用 `ElementStart` 开始的元素渲染的操作。

An operation to begin an `ng-container`.

开始 `ng-container` 操作。

An operation for an `ng-container` with no children.

对没有子节点的 `ng-container` 的操作。

An operation to end an `ng-container`.

结束 `ng-container` 操作。

An operation to render a text node.

渲染文本节点的操作。

An operation declaring an event listener for an element.

为元素声明事件侦听器的操作。

An operation to interpolate text into a text node.

将文本插入文本节点的操作。

An operation to bind an expression to a property of an element.

将表达式绑定到元素属性的操作。

An operation to interpolate text into a property binding.

将文本插入属性绑定的操作。

An operation to advance the runtime's implicit slot context during the update phase of a view.

在视图的更新阶段推进运行时的隐式插槽上下文的操作。

An operation to instantiate a pipe.

实例化管道的操作。

Distinguishes different kinds of IR expressions.

区分不同类型的 IR 表达式。

Read of a variable in a lexical scope.

读取词法作用域中的变量。

A reference to the current view context.

对当前视图上下文的引用。

Read of a variable declared in a `VariableOp`.

读取在 `VariableOp` 中声明的变量。

Runtime operation to navigate to the next view context in the view hierarchy.

运行时操作导航到视图层次结构中的下一个视图上下文。

Runtime operation to retrieve the value of a local reference.

运行时操作以检索本地引用的值。

Runtime operation to snapshot the current view context.

快照当前视图上下文的运行时操作。

Runtime operation to restore a snapshotted view.

恢复快照视图的运行时操作。

Runtime operation to reset the current view context after `RestoreView`.

在 `RestoreView` 之后重置当前视图上下文的运行时操作。

Defines and calls a function with change-detected arguments.

定义并调用带有变更检测参数的函数。

Indicates a positional parameter to a pure function definition.

指示纯函数定义的位置参数。

Binding to a pipe transformation.

绑定到管道转换。

Binding to a pipe transformation with a variable number of arguments.

绑定到具有可变数量参数的管道转换。

Distinguishes between different kinds of `SemanticVariable`s.

区分不同种类的 `SemanticVariable` s。

Represents the context of a particular view.

表示特定视图的上下文。

Represents an identifier declared in the lexical scope of a view.

表示在视图的词法范围内声明的标识符。

Represents a saved state that can be used to restore a view in a listener handler function.

表示可用于在侦听器处理程序函数中恢复视图的已保存状态。
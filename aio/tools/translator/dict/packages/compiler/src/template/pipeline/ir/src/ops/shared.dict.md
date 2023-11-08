A special `Op` which is used internally in the `OpList` linked list to represent the head and
tail nodes of the list.

`OpList` 链表内部使用的特殊 `Op`，表示链表的头节点和尾节点。

`ListEndOp` is created internally in the `OpList` and should not be instantiated directly.

`ListEndOp` 是在 `OpList` 内部创建的，不应直接实例化。

An `Op` which directly wraps an output `Statement`.

直接包装输出 `Statement` `Op`。

Often `StatementOp`s are the final result of IR processing.

通常 `StatementOp` 是 IR 处理的最终结果。

The output statement.

输出语句。

Create a `StatementOp`.

创建一个 `StatementOp`。

Operation which declares and initializes a `SemanticVariable`, that is valid either in create or
update IR.

声明并初始化 `SemanticVariable` 操作，该操作在创建或更新 IR 中均有效。

`XrefId` which identifies this specific variable, and is used to reference this variable from
other parts of the IR.

`XrefId` 标识此特定变量，并用于从 IR 的其他部分引用此变量。

The `SemanticVariable` which describes the meaning behind this variable.

描述此变量背后含义的 `SemanticVariable`。

Expression representing the value of the variable.

表示变量值的表达式。

Create a `VariableOp`.

创建一个 `VariableOp`。

Static structure shared by all operations.

所有操作共享的静态结构。

Used as a convenience via the spread operator \(`...NEW_OP`\) when creating new operations, and
ensures the fields are always in the same order.

在创建新操作时通过扩展运算符 \( `...NEW_OP` \) 方便使用，并确保字段始终处于相同顺序。
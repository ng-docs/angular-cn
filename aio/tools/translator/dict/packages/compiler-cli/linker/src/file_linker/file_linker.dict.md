This class is responsible for linking all the partial declarations found in a single file.

此类负责链接在单个文件中找到的所有部分声明。

Return true if the given callee name matches a partial declaration that can be linked.

如果给定的被调用者名称与可以链接的部分声明匹配，则返回 true。

the name of the function used to declare the partial declaration - e.g.
    `ɵɵngDeclareDirective`.

用于声明部分声明的函数名 - 例如 `ɵɵngDeclareDirective`。

the arguments passed to the declaration function, should be a single object that
    corresponds to the `R3DeclareDirectiveMetadata` or `R3DeclareComponentMetadata` interfaces.

传递给声明函数的参数应该是对应于 `R3DeclareDirectiveMetadata` 或 `R3DeclareComponentMetadata`
接口的单个对象。

the scope that contains this call to the declaration function.

包含对声明函数的此调用的范围。

Link the metadata extracted from the args of a call to a partial declaration function.

将从调用的 args 中提取的元数据链接到部分声明函数。

The `declarationScope` is used to determine the scope and strategy of emission of the linked
definition and any shared constant statements.

`declarationScope` 用于确定链接定义和任何共享常量语句的范围和发出策略。

Return all the shared constant statements and their associated constant scope references, so
that they can be inserted into the source code.

返回所有共享常量语句及其关联的常量范围引用，以便它们可以插入源代码。
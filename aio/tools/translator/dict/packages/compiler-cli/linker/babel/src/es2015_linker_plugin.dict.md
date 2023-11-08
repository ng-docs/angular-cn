Create a Babel plugin that visits the program, identifying and linking partial declarations.

创建一个访问程序、识别和链接部分声明的 Babel 插件。

The plugin delegates most of its work to a generic `FileLinker` for each file \(`t.Program` in
Babel\) that is visited.

该插件将其大部分工作委托给每个访问的文件（Babel 中的 `t.Program`）的通用 `FileLinker`。

Create a new `FileLinker` as we enter each file \(`t.Program` in Babel\).

当我们输入每个文件（Babel 中的 `t.Program`）时，创建一个新的 `FileLinker`。

On exiting the file, insert any shared constant statements that were generated during
linking of the partial declarations.

退出文件时，插入在链接部分声明期间生成的任何共享常量语句。

Test each call expression to see if it is a partial declaration; it if is then replace it
with the results of linking the declaration.

测试每个调用表达式以查看它是否是部分声明；如果是，则将其替换为链接声明的结果。

Insert the `statements` at the location defined by `path`.

在 `path` 定义的位置插入 `statements`。

The actual insertion strategy depends upon the type of the `path`.

实际的插入策略取决于 `path` 的类型。

Insert the `statements` at the top of the body of the `fn` function.

在 `fn` 函数体的顶部插入 `statements`。

Insert the `statements` at the top of the `program`, below any import statements.

在 `program` 顶部，任何 import 语句下方插入 `statements`。

Return true if all the `nodes` are Babel expressions.

如果所有 `nodes` 都是 Babel 表达式，则返回 true。

Assert that the given `obj` is `null`.

断言给定的 `obj` 是 `null`。

Assert that the given `obj` is not `null`.

断言给定的 `obj` 不为 `null`。

Create a string representation of an error that includes the code frame of the `node`.

创建包含 `node` 的代码框架的错误的字符串表示。
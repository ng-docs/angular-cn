A helper class to manage the evaluation of JIT generated code.

一个帮助器类，用于管理对 JIT 生成的代码的估算。

The URL of the generated code.

生成的代码的 URL。

An array of Angular statement AST nodes to be evaluated.

要估算的 Angular 语句 AST 节点的数组。

Resolves `o.ExternalReference`s into values.

`o.ExternalReference` s 解析为值。

If true then create a source-map for the generated code and include it
inline as a source-map comment.

如果为 true，则为生成的代码创建一个 source-map，并将其作为 source-map 注释内联包含。

A map of all the variables in the generated code.

生成的代码中所有变量的映射表。

The URL of this generated code.

此生成的代码的 URL。

A context object that contains an AST of the code to be evaluated.

包含要估算的代码的 AST 的上下文对象。

A map containing the names and values of variables that the evaluated code might
reference.

包含已估算代码可能引用的变量的名称和值的映射表。

The result of evaluating the code.

估算代码的结果。

Evaluate a piece of JIT generated code.

估算一段 JIT 生成的代码。

A function to execute.

要执行的函数。

The arguments to pass to the function being executed.

要传递给正在执行的函数的参数。

The return value of the executed function.

已执行函数的返回值。

Execute a JIT generated function by calling it.

通过调用来执行 JIT 生成的函数。

This method can be overridden in tests to capture the functions that are generated
by this `JitEvaluator` class.

可以在测试中覆盖此方法以捕获此 `JitEvaluator` 类生成的函数。

An Angular AST visitor that converts AST nodes into executable JavaScript code.

一个 Angular AST 访问器，可将 AST 节点转换为可执行的 JavaScript 代码。
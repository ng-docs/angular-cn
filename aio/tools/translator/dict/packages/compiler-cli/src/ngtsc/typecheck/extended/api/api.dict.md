A Template Check receives information about the template it's checking and returns
information about the diagnostics to be generated.

模板检查会接收有关它正在检查的模板的信息，并返回有关要生成的诊断的信息。

Unique template check code, used for configuration and searching the error.

唯一的模板检查代码，用于配置和搜索错误。

Runs check and returns information about the diagnostics to be generated.

运行检查并返回有关要生成的诊断的信息。

The TemplateContext provided to a Template Check to get diagnostic information.

提供给模板检查以获取诊断信息的 TemplateContext。

Interface that provides information about template nodes.

提供有关模板节点信息的接口。

TypeScript interface that provides type information about symbols that appear
in the template \(it is not to query types outside the Angular component\).

TypeScript 接口，提供有关模板中出现的符号的类型信息（它不会查询 Angular 组件之外的类型）。

Creates a template diagnostic with the given information for the template being processed and
using the diagnostic category configured for the extended template diagnostic.

使用正在处理的模板的给定信息并使用为扩展模板诊断配置的诊断类别创建模板诊断。

A factory which creates a template check for a particular code and name. This binds the two
together and associates them with a specific `TemplateCheck`.

为特定代码和名称创建模板检查的工厂。这将两者绑定在一起，并将它们与特定的 `TemplateCheck`
关联起来。

This abstract class provides a base implementation for the run method.

此抽象类为 run 方法提供了基础实现。

Base implementation for run function, visits all nodes in template and calls
`visitNode()` for each one.

run 函数的基础实现，访问模板中的所有节点并为每个节点调用 `visitNode()`。

Visit a TmplAstNode or AST node of the template. Authors should override this
method to implement the check and return diagnostics.

访问模板的 TmplAstNode 或 AST 节点。作者应该覆盖此方法以实现检查并返回诊断。

Visits all nodes in a template \(TmplAstNode and AST\) and calls `visitNode` for each one.

访问模板中的所有节点（TmplAstNode 和 AST）并为每个节点调用 `visitNode`。
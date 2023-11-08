Collects `ts.Diagnostic`s on problems which occur in the template which aren't directly sourced
from Type Check Blocks.

收集有关模板中发生的并非直接来自类型检查块的问题的 `ts.Diagnostic`。

During the creation of a Type Check Block, the template is traversed and the
`OutOfBandDiagnosticRecorder` is called to record cases when a correct interpretation for the
template cannot be found. These operations create `ts.Diagnostic`s which are stored by the
recorder for later display.

在创建类型检查块期间，会遍历模板并调用 `OutOfBandDiagnosticRecorder`
以记录无法找到对模板的正确解释的情况。这些操作会创建 `ts.Diagnostic`，由记录器存储以供以后显示。

the template type-checking ID of the template which contains the broken
reference.

包含损坏的引用的模板的模板类型检查 ID。

the `TmplAstReference` which could not be matched to a directive.

无法与指令匹配的 `TmplAstReference`。

Reports a `#ref="target"` expression in the template for which a target directive could not be
found.

报告模板中找不到 target 指令的 `#ref="target"` 表达式。

the template type-checking ID of the template which contains the unknown
pipe.

包含未知管道的模板的模板类型检查 ID。

the `BindingPipe` invocation of the pipe which could not be found.

找不到管道的 `BindingPipe` 调用。

Reports usage of a `| pipe` expression in the template for which the named pipe could not be
found.

报告 a `| pipe` 的使用情况模板中无法找到命名管道的 `| pipe` 表达式。

the template type-checking ID of the template which contains the duplicate
declaration.

包含重复声明的模板的模板类型检查 ID。

the `TmplAstVariable` which duplicates a previously declared variable.

复制以前声明的变量的 `TmplAstVariable`。

the first variable declaration which uses the same name as `variable`.

第一个使用与 variable 同名的 `variable` 声明。

Reports a duplicate declaration of a template variable.

报告模板变量的重复声明。

Report a warning when structural directives support context guards, but the current
type-checking configuration prohibits their usage.

当结构指令支持上下文保护时报告警告，但当前的类型检查配置禁止使用它们。

Reports a split two way binding error message.

报告拆分双向绑定错误消息。

Reports required inputs that haven't been bound.

报告需要尚未绑定的输入。
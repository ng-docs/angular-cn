This context is the info includes the `errorCode` at the given span the user selected in the
editor and the `NgCompiler` could help to fix it.

此上下文是包含用户在编辑器中选择的给定范围内的 `errorCode` 信息，`NgCompiler` 可以帮助修复它。

When the editor tries to provide a code fix for a diagnostic in a span of a template file, this
context will be provided to the `CodeActionMeta` which could handle the `errorCode`.

当编辑器尝试为模板文件范围内的诊断提供代码修复时，此上下文将提供给可以处理 `errorCode` `CodeActionMeta`。

This context is the info includes all diagnostics in the `scope` and the `NgCompiler` that could
help to fix it.

这个上下文是信息，包括 `scope` 内的所有诊断和可以帮助修复它的 `NgCompiler`。

When the editor tries to fix the all same type of diagnostics selected by the user in the
`scope`, this context will be provided to the `CodeActionMeta` which could handle the `fixId`.

当编辑器尝试修复 `scope` 内用户选择的所有相同类型的诊断时，此上下文将提供给可以处理 `fixId` `CodeActionMeta`。

Convert the span of `textChange` in the TCB to the span of the template.

将 TCB 中 `textChange` 的 span 转换为模板的 span。

'fix all' is only available when there are multiple diagnostics that the code action meta
indicates it can fix.

“全部修复”仅在存在代码操作元指示它可以修复的多个诊断时可用。
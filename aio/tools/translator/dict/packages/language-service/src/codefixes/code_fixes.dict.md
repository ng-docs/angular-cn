When the user moves the cursor or hovers on a diagnostics, this function will be invoked by LS,
and collect all the responses from the `codeActionMetas` which could handle the `errorCodes`.

当用户移动光标或悬停在诊断上时，LS 将调用此函数，并收集来自可以处理 `errorCodes` `codeActionMetas` 的所有响应。

When the user wants to fix the all same type of diagnostics in the `scope`, this function will
be called and fix all diagnostics which will be filtered by the `errorCodes` from the
`CodeActionMeta` that the `fixId` belongs to.

当用户想要修复 `scope` 内所有相同类型的诊断时，将调用此函数并修复所有诊断，这些诊断将由 `fixId` 所属的 `CodeActionMeta` 中的 `errorCodes` 过滤。
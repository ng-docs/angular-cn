Create a `ts.Diagnostic` which indicates the given class is part of the declarations of two or
more NgModules.

创建一个 `ts.Diagnostic` 指示给定类是两个或多个 NgModule 声明的一部分。

The resulting `ts.Diagnostic` will have a context entry for each NgModule showing the point where
the directive/pipe exists in its `declarations` \(if possible\).

生成的 `ts.Diagnostic` 将为每个 NgModule 提供一个上下文条目，显示指令/管道在其 `declarations` 中存在的位置（如果可能）。

The node for which the diagnostic should be produced.

应为其生成诊断的节点。

The evaluated value that has the wrong type.

类型错误的评估值。

The message text of the error.

错误的消息文本。

Creates a `FatalDiagnosticError` for a node that did not evaluate to the expected type. The
diagnostic that is created will include details on why the value is incorrect, i.e. it includes
a representation of the actual type that was unsupported, or in the case of a dynamic value the
trace to the node where the dynamic value originated.

为未评估为预期类型的​​节点创建 `FatalDiagnosticError`。创建的诊断将包括有关为什么值不正确的详细信息，即它包括不受支持的实际类型的表示，或者在动态值的情况下跟踪到动态值起源的节点。

Classes that should be checked.

应该检查的类。

Node that declares the providers array.

声明提供者数组的节点。

Registry that keeps track of the registered injectable classes.

跟踪注册的可注入类的注册表。

Gets the diagnostics for a set of provider classes.

获取一组提供程序类的诊断信息。
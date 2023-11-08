`ts.SourceFile` of the library's entrypoint, which should export the library's
public API.

库入口点的 `ts.SourceFile`，应导出库的公共 API。

`ts.TypeChecker` for the current program.

当前程序的 `ts.TypeChecker`。

`ReferenceGraph` tracking the visibility of Angular types.

`ReferenceGraph` 跟踪 Angular 类型的可见性。

an array of `ts.Diagnostic`s representing errors when visible classes are not exported
properly.

一个 `ts.Diagnostic` s 数组，表示可见类无法正确导出时出现的错误。

Produce `ts.Diagnostic`s for classes that are visible from exported types \(e.g. directives
exposed by exported `NgModule`s\) that are not themselves exported.

为从本身不是导出的导出类型（例如导出的 `NgModule` 公开的指令）中可见的类生成 `ts.Diagnostic`。

This function reconciles two concepts:

此函数调和了两个概念：

A class is Exported if it's exported from the main library `entryPoint` file.
A class is Visible if, via Angular semantics, a downstream consumer can import an Exported class
and be affected by the class in question. For example, an Exported NgModule may expose a
directive class to its consumers. Consumers that import the NgModule may have the directive
applied to elements in their templates. In this case, the directive is considered Visible.

如果一个类是从主库 `entryPoint` 文件导出的，则它是 Exported。如果下游使用者可以通过 Angular
语义导入 Exported 类并受相关类的影响，则一个类是 Visible。例如，Exported NgModule
可能会向其使用者公开一个指令类。导入 NgModule
的消费者可能会将该指令应用于其模板中的元素。在这种情况下，该指令被认为是可见的。

`checkForPrivateExports` attempts to verify that all Visible classes are Exported, and report
`ts.Diagnostic`s for those that aren't.

`checkForPrivateExports` 会尝试验证是否所有 Visible 类都已导出，并为那些未导出的类报告
`ts.Diagnostic`。
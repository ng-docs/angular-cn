Whether to replace the `templateUrl` and `styleUrls` property in all

是否替换所有 `templateUrl` 和 `styleUrls` 属性

Whether NGC should generate re-exports for external symbols which are referenced
in Angular metadata \(e.g. &commat;Component, &commat;Inject, &commat;ViewChild\). This can be enabled in
order to avoid dynamically generated module dependencies which can break strict
dependency enforcements. This is not enabled by default.
Read more about this here: https://github.com/angular/angular/issues/25644.

NGC 是否应该为 Angular
元数据中引用的外部符号（例如 &commat;Component、&commat;Inject、&commat;ViewChild）生成重新导出。可以启用此功能以避免动态生成的模块依赖项，这可能会破坏严格的依赖强制执行。默认情况下，此未启用。在这里读更多关于这个的内容：
https://github.com/angular/angular/issues/25644。

Converts a module name that is used in an `import` to a file path.
I.e. `path/to/containingFile.ts` containing `import {...} from 'module-name'`.

将 `import` 中使用的模块名称转换为文件路径。即包含 `import {...} from 'module-name'`
`path/to/containingFile.ts`。

the source file that refers to fileName

引用 fileName 的源文件

Converts a file name into a representation that should be stored in a summary file.
This has to include changing the suffix as well.
E.g.
`some_file.ts` -> `some_file.d.ts`

将文件名转换为应该存储在摘要文件中的表示。这还必须包括更改后缀。例如 `some_file.ts` ->
`some_file.d.ts`

Converts a fileName that was processed by `toSummaryFileName` back into a real fileName
given the fileName of the library that is referring to it.

给定引用它的库的文件名，将 `toSummaryFileName` 处理的文件名转换回真实的文件名。

Produce an AMD module name for the source file. Used in Bazel.

为源文件生成 AMD 模块名称。在 Bazel 中使用。

An AMD module can have an arbitrary name, so that it is require'd by name
rather than by path. See https://requirejs.org/docs/whyamd.html#namedmodules

AMD
模块可以有任意名称，因此它是按名称而不是路径要求的。请参阅 https://requirejs.org/docs/whyamd.html#namedmodules

Retrieve the TypeScript program used to produce semantic diagnostics and emit the sources.

检索用于生成语义诊断并发出源代码的 TypeScript 程序。

Angular structural information is required to produce the program.

生成程序需要 Angular 结构信息。

Retrieve options diagnostics for the TypeScript options used to create the program. This is
faster than calling `getTsProgram().getOptionsDiagnostics()` since it does not need to
collect Angular structural information to produce the errors.

检索用于创建程序的 TypeScript 选项的选项诊断。这比调用 `getTsProgram().getOptionsDiagnostics()`
快，因为它不需要收集 Angular 结构信息来生成错误。

Retrieve options diagnostics for the Angular options used to create the program.

检索用于创建程序的 Angular 选项的选项诊断。

Retrieve the syntax diagnostics from TypeScript. This is faster than calling
`getTsProgram().getSyntacticDiagnostics()` since it does not need to collect Angular structural
information to produce the errors.

从 TypeScript 检索语法诊断。这比调用 `getTsProgram().getSyntacticDiagnostics()`
快，因为它不需要收集 Angular 结构信息来产生错误。

Retrieve the diagnostics for the structure of an Angular application is correctly formed.
This includes validating Angular annotations and the syntax of referenced and imbedded HTML
and CSS.

检索对 Angular 应用程序结构的诊断是否正确。这包括验证 Angular 注解以及引用和嵌入的 HTML 和 CSS
的语法。

Note it is important to displaying TypeScript semantic diagnostics along with Angular
structural diagnostics as an error in the program structure might cause errors detected in
semantic analysis and a semantic error might cause errors in specifying the program structure.

请注意，将 TypeScript 语义诊断与 Angular
结构诊断一起显示很重要，因为程序结构中的错误可能会导致在语义分析中检测到错误，并且语义错误可能会导致指定程序结构时出错。

Angular structural information is required to produce these diagnostics.

生成这些诊断需要 Angular 结构信息。

Retrieve the semantic diagnostics from TypeScript. This is equivalent to calling
`getTsProgram().getSemanticDiagnostics()` directly and is included for completeness.

从 TypeScript 检索语义诊断。这等效于直接调用 `getTsProgram().getSemanticDiagnostics()`
，并且为了完整起见被包含在内。

Retrieve the Angular semantic diagnostics.

检索 Angular 语义诊断。

Load Angular structural information asynchronously. If this method is not called then the
Angular structural information, including referenced HTML and CSS files, are loaded
synchronously. If the supplied Angular compiler host returns a promise from `loadResource()`
will produce a diagnostic error message or, `getTsProgram()` or `emit` to throw.

异步加载 Angular 结构信息。如果不调用此方法，则会同步加载 Angular 结构信息，包括引用的 HTML 和
CSS 文件。如果提供的 Angular 编译器宿主从 `loadResource()` 返回一个
Promise，则将生成诊断错误消息，或者，`getTsProgram()` 或 `emit` 来抛出。

This method is obsolete and always returns an empty array.

此方法已过时，并且始终返回一个空数组。

Emit the files requested by emitFlags implied by the program.

发出程序隐含的 emitFlags 请求的文件。

Angular structural information is required to emit files.

发出文件需要 Angular 结构信息。
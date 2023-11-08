State information about a compilation which is only generated once some data is requested from
the `NgCompiler` \(for example, by calling `getDiagnostics`\).

有关编译的状态信息，仅在从 `NgCompiler` 请求某些数据时才会生成（例如，通过调用 `getDiagnostics`
）。

Discriminant type for a `CompilationTicket`.

`CompilationTicket` 的判别类型。

Begin an Angular compilation operation from scratch.

从头开始 Angular 编译操作。

Begin an Angular compilation operation that incorporates changes to TypeScript code.

开始一个包含对 TypeScript 代码更改的 Angular 编译操作。

A request to begin Angular compilation, either starting from scratch or from a known prior state.

开始 Angular 编译的请求，可以从头开始或从已知的先前状态开始。

`CompilationTicket`s are used to initialize \(or update\) an `NgCompiler` instance, the core of the
Angular compiler. They abstract the starting state of compilation and allow `NgCompiler` to be
managed independently of any incremental compilation lifecycle.

`CompilationTicket` 用于初始化（或更新）`NgCompiler` 实例，这是 Angular
编译器的核心。它们抽象了编译的启动状态，并允许 `NgCompiler` 独立于任何增量编译生命周期进行管理。

Create a `CompilationTicket` for a brand new compilation, using no prior state.

为全新的编译创建一个 `CompilationTicket`，不使用先前的状态。

Create a `CompilationTicket` as efficiently as possible, based on a previous `NgCompiler`
instance and a new `ts.Program`.

根据以前的 `NgCompiler` 实例和新的 `ts.Program`，尽可能高效地创建一个 `CompilationTicket`。

Create a `CompilationTicket` directly from an old `ts.Program` and associated Angular compilation
state, along with a new `ts.Program`.

直接从旧的 `ts.Program` 和关联的 Angular 编译状态以及新的 `ts.Program` `CompilationTicket`

The heart of the Angular Ivy compiler.

Angular Ivy 编译器的核心。

The `NgCompiler` provides an API for performing Angular compilation within a custom TypeScript
compiler. Each instance of `NgCompiler` supports a single compilation, which might be
incremental.

`NgCompiler` 提供了一个 API，用于在自定义 TypeScript 编译器中执行 Angular 编译。`NgCompiler`
的每个实例都支持单次编译，这可能是增量的。

`NgCompiler` is lazy, and does not perform any of the work of the compilation until one of its
output methods \(e.g. `getDiagnostics`\) is called.

`NgCompiler` 是延迟的，在调用其输出方法之一（例如 `getDiagnostics`）之前不会执行任何编译工作。

See the README.md for more information.

有关更多信息，请参阅 README.md。

Convert a `CompilationTicket` into an `NgCompiler` instance for the requested compilation.

将 `CompilationTicket` 转换为 `NgCompiler` 实例以进行所请求的编译。

Depending on the nature of the compilation request, the `NgCompiler` instance may be reused
from a previous compilation and updated with any changes, it may be a new instance which
incrementally reuses state from a previous compilation, or it may represent a fresh
compilation entirely.

根据编译请求的性质，`NgCompiler`
实例可以从以前的编译中重用并使用任何更改进行更新，它可能是一个新实例，可以增量地重用以前编译中的状态，或者它可能完全代表一个新的编译。

Get the resource dependencies of a file.

获取文件的资源依赖项。

If the file is not part of the compilation, an empty array will be returned.

如果文件不是编译的一部分，则将返回一个空数组。

Get all Angular-related diagnostics for this compilation.

获取此编译的所有与 Angular 相关的诊断。

If a `ts.SourceFile` is passed, only diagnostics related to that file are returned.

如果传递了 `ts.SourceFile`，则仅返回与该文件相关的诊断信息。

Get all `ts.Diagnostic`s currently available that pertain to the given component.

获取当前可用的与给定组件有关的所有 `ts.Diagnostic`。

Get all setup-related diagnostics for this compilation.

获取此编译的所有与设置相关的诊断。

Get the current `ts.Program` known to this `NgCompiler`.

获取此 `ts.Program` 已知的当前 `NgCompiler`。

Compilation begins with an input `ts.Program`, and during template type-checking operations new
`ts.Program`s may be produced using the `ProgramDriver`. The most recent such `ts.Program` to
be produced is available here.

编译从输入 `ts.Program` 开始，在模板类型检查操作期间，可以用 `ProgramDriver` 生成新的
`ts.Program`。要生成的最新的此类 `ts.Program` 可在此获得。

This `ts.Program` serves two key purposes:

此 `ts.Program` 有两个主要目的：

As an incremental starting point for creating the next `ts.Program` based on files that the
  user has changed \(for clients using the TS compiler program APIs\).

作为根据用户更改的文件创建下一个 `ts.Program` 的增量起点（对于使用 TS 编译器程序 API
的客户端）。

As the "before" point for an incremental compilation invocation, to determine what's changed
between the old and new programs \(for all compilations\).

作为增量编译调用的“之前”点，以确定新旧程序之间发生的变化（对于所有编译）。

Retrieves the `ts.Declaration`s for any component\(s\) which use the given template file.

检索使用给定模板文件的任何组件的 `ts.Declaration`。

Retrieves external resources for the given component.

检索给定组件的外部资源。

Perform Angular's analysis step \(as a precursor to `getDiagnostics` or `prepareEmit`\)
asynchronously.

异步执行 Angular 的分析步骤（作为 `getDiagnostics` 或 `prepareEmit` 的前体）。

Normally, this operation happens lazily whenever `getDiagnostics` or `prepareEmit` are called.
However, certain consumers may wish to allow for an asynchronous phase of analysis, where
resources such as `styleUrls` are resolved asynchronously. In these cases `analyzeAsync` must
be called first, and its `Promise` awaited prior to calling any other APIs of `NgCompiler`.

通常，每当 `getDiagnostics` 或 `prepareEmit`
时，此操作都会延迟发生。但是，某些消费者可能希望允许分析的异步阶段，其中的资源（例如
`styleUrls`）会被异步解析。在这些情况下，必须首先调用 `analyzeAsync`，并在调用 `NgCompiler`
的任何其他 API 之前等待其 `Promise`。

Fetch transformers and other information which is necessary for a consumer to `emit` the
program with Angular-added definitions.

获取消费者使用 Angular 添加的定义 `emit` 程序所需的转换器和其他信息。

Run the indexing process and return a `Map` of all indexed components.

运行索引过程并返回所有索引组件的 `Map`。

See the `indexing` package for more details.

有关更多详细信息，请参阅 `indexing` 包。

Collect i18n messages into the `Xi18nContext`.

将 i18n 消息收集到 `Xi18nContext` 中。

Determine if the given `Program` is &commat;angular/core.

确定给定的 `Program` 是否为 &commat;angular/core。

Find the 'r3_symbols.ts' file in the given `Program`, or return `null` if it wasn't there.

在给定的 `Program` 中查找 “r3_symbols.ts” 文件，如果不存在，则返回 `null`。

Since "strictTemplates" is a true superset of type checking capabilities compared to
"fullTemplateTypeCheck", it is required that the latter is not explicitly disabled if the
former is enabled.

由于与“fullTemplateTypeCheck”相比，“strictTemplates”是类型检查特性的真正超集，因此如果启用了前者，则要求不显式禁用后者。
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * A phase of compilation for which time is tracked in a distinct bucket.
 *
 * 在不同的存储桶中跟踪时间的编译阶段。
 *
 */
export enum PerfPhase {
  /**
   * The "default" phase which tracks time not spent in any other phase.
   *
   * “默认”阶段，用于跟踪未在任何其他阶段花费的时间。
   *
   */
  Unaccounted,

  /**
   * Time spent setting up the compiler, before a TypeScript program is created.
   *
   * 在创建 TypeScript 程序之前设置编译器所花费的时间。
   *
   * This includes operations like configuring the `ts.CompilerHost` and any wrappers.
   *
   * 这包括配置 `ts.CompilerHost` 和任何包装器等操作。
   *
   */
  Setup,

  /**
   * Time spent in `ts.createProgram`, including reading and parsing `ts.SourceFile`s in the
   * `ts.CompilerHost`.
   *
   * 在 `ts.createProgram` 中花费的时间，包括读取和解析 `ts.SourceFile` 中的 `ts.CompilerHost` 。
   *
   * This might be an incremental program creation operation.
   *
   * 这可能是增量程序创建操作。
   *
   */
  TypeScriptProgramCreate,

  /**
   * Time spent reconciling the contents of an old `ts.Program` with the new incremental one.
   *
   * 将旧 `ts.Program` 的内容与新的增量内容调和所花费的时间。
   *
   * Only present in incremental compilations.
   *
   * 仅存在于增量编译中。
   *
   */
  Reconciliation,

  /**
   * Time spent updating an `NgCompiler` instance with a resource-only change.
   *
   * 使用仅资源更改更新 `NgCompiler` 实例所花费的时间。
   *
   * Only present in incremental compilations where the change was resource-only.
   *
   * 仅存在于更改是纯资源的增量编译中。
   *
   */
  ResourceUpdate,

  /**
   * Time spent calculating the plain TypeScript diagnostics (structural and semantic).
   *
   * 计算普通的 TypeScript 诊断（结构和语义）所花费的时间。
   *
   */
  TypeScriptDiagnostics,

  /**
   * Time spent in Angular analysis of individual classes in the program.
   *
   * 对程序中单个类进行 Angular 分析所花费的时间。
   *
   */
  Analysis,

  /**
   * Time spent in Angular global analysis (synthesis of analysis information into a complete
   * understanding of the program).
   *
   * 花在 Angular 全局分析（将分析信息合成为对程序的完整了解）上的时间。
   *
   */
  Resolve,

  /**
   * Time spent building the import graph of the program in order to perform cycle detection.
   *
   * 构建程序导入图以执行周期检测所花费的时间。
   *
   */
  CycleDetection,

  /**
   * Time spent generating the text of Type Check Blocks in order to perform template type checking.
   *
   * 生成类型检查块的文本以执行模板类型检查所花费的时间。
   *
   */
  TcbGeneration,

  /**
   * Time spent updating the `ts.Program` with new Type Check Block code.
   *
   * 使用新的类型检查块代码更新 `ts.Program` 所花费的时间。
   *
   */
  TcbUpdateProgram,

  /**
   * Time spent by TypeScript performing its emit operations, including downleveling and writing
   * output files.
   *
   * TypeScript 执行其发出操作所花费的时间，包括降级和编写输出文件。
   *
   */
  TypeScriptEmit,

  /**
   * Time spent by Angular performing code transformations of ASTs as they're about to be emitted.
   *
   * Angular 在即将发出时对 AST 执行代码转换所花费的时间。
   *
   * This includes the actual code generation step for templates, and occurs during the emit phase
   * (but is tracked separately from `TypeScriptEmit` time).
   *
   * 这包括模板的实际代码生成步骤，并且发生在发出阶段（但与 `TypeScriptEmit` 时间分开跟踪）。
   *
   */
  Compile,

  /**
   * Time spent performing a `TemplateTypeChecker` autocompletion operation.
   *
   * 执行 `TemplateTypeChecker` 自动完成操作所花费的时间。
   *
   */
  TtcAutocompletion,

  /**
   * Time spent computing template type-checking diagnostics.
   *
   * 计算模板类型检查诊断所花费的时间。
   *
   */
  TtcDiagnostics,

  /**
   * Time spent getting a `Symbol` from the `TemplateTypeChecker`.
   *
   * 从 `TemplateTypeChecker` 获取 `Symbol` 所花费的时间。
   *
   */
  TtcSymbol,

  /**
   * Time spent by the Angular Language Service calculating a "get references" or a renaming
   * operation.
   *
   * Angular 语言服务计算“获取引用”或重命名操作所花费的时间。
   *
   */
  LsReferencesAndRenames,

  /**
   * Time spent by the Angular Language Service calculating a "quick info" operation.
   *
   * Angular 语言服务计算“快速信息”操作所花费的时间。
   *
   */
  LsQuickInfo,

  /**
   * Time spent by the Angular Language Service calculating a "get type definition" or "get
   * definition" operation.
   *
   * Angular 语言服务计算“获取类型定义”或“获取定义”操作所花费的时间。
   *
   */
  LsDefinition,

  /**
   * Time spent by the Angular Language Service calculating a "get completions" (AKA autocomplete)
   * operation.
   *
   * Angular 语言服务计算“获取自动完成”（AKA 自动完成）操作所花费的时间。
   *
   */
  LsCompletions,

  /**
   * Time spent by the Angular Language Service calculating a "view template typecheck block"
   * operation.
   *
   * Angular 语言服务计算“查看模板类型检查块”操作所花费的时间。
   *
   */
  LsTcb,

  /**
   * Time spent by the Angular Language Service calculating diagnostics.
   *
   * Angular 语言服务计算诊断所花费的时间。
   *
   */
  LsDiagnostics,

  /**
   * Time spent by the Angular Language Service calculating a "get component locations for template"
   * operation.
   *
   * Angular 语言服务计算“获取模板的组件位置”操作所花费的时间。
   *
   */
  LsComponentLocations,

  /**
   * Time spent by the Angular Language Service calculating signature help.
   *
   * Angular 语言服务计算签名帮助所花费的时间。
   *
   */
  LsSignatureHelp,

  /**
   * Tracks the number of `PerfPhase`s, and must appear at the end of the list.
   *
   * 跟踪 `PerfPhase` 的数量，并且必须出现在列表的末尾。
   *
   */
  LAST,

  /**
   * Time spent by the Angular Language Service calculating code fixes.
   */
  LsCodeFixes,

  /**
   * Time spent by the Angular Language Service to fix all detected same type errors.
   */
  LsCodeFixesAll,
}

/**
 * Represents some occurrence during compilation, and is tracked with a counter.
 *
 * 表示编译期间发生的某些事件，并使用计数器进行跟踪。
 *
 */
export enum PerfEvent {
  /**
   * Counts the number of `.d.ts` files in the program.
   *
   * 计算程序中 `.d.ts` 文件的数量。
   *
   */
  InputDtsFile,

  /**
   * Counts the number of non-`.d.ts` files in the program.
   *
   * 计算程序 `.d.ts` 文件的数量。
   *
   */
  InputTsFile,

  /**
   * An `@Component` class was analyzed.
   *
   * 分析了一个 `@Component` 类。
   *
   */
  AnalyzeComponent,

  /**
   * An `@Directive` class was analyzed.
   *
   * 分析了一个 `@Directive` 类。
   *
   */
  AnalyzeDirective,

  /**
   * An `@Injectable` class was analyzed.
   *
   * 分析了一个 `@Injectable` 类。
   *
   */
  AnalyzeInjectable,

  /**
   * An `@NgModule` class was analyzed.
   *
   * 分析了一个 `@NgModule` 类。
   *
   */
  AnalyzeNgModule,

  /**
   * An `@Pipe` class was analyzed.
   *
   * 分析了 `@Pipe` 类。
   *
   */
  AnalyzePipe,

  /**
   * A trait was analyzed.
   *
   * 分析了一个性状。
   *
   * In theory, this should be the sum of the `Analyze` counters for each decorator type.
   *
   * 理论上，这应该是每种装饰器类型的 `Analyze` 计数器的总和。
   *
   */
  TraitAnalyze,

  /**
   * A trait had a prior analysis available from an incremental program, and did not need to be
   * re-analyzed.
   *
   * 一个特性有一个可从增量程序中获得的先前分析，并且不需要重新分析。
   *
   */
  TraitReuseAnalysis,

  /**
   * A `ts.SourceFile` directly changed between the prior program and a new incremental compilation.
   *
   * `ts.SourceFile` 在前面的程序和新的增量编译之间直接更改。
   *
   */
  SourceFilePhysicalChange,

  /**
   * A `ts.SourceFile` did not physically changed, but according to the file dependency graph, has
   * logically changed between the prior program and a new incremental compilation.
   *
   * `ts.SourceFile` 没有物理更改，但根据文件依赖图，在前面的程序和新的增量编译之间发生了逻辑更改。
   *
   */
  SourceFileLogicalChange,

  /**
   * A `ts.SourceFile` has not logically changed and all of its analysis results were thus available
   * for reuse.
   *
   * `ts.SourceFile` 在逻辑上没有更改，因此其所有分析结果都可供重用。
   *
   */
  SourceFileReuseAnalysis,

  /**
   * A Type Check Block (TCB) was generated.
   *
   * 生成了类型检查块 (TCB)。
   *
   */
  GenerateTcb,

  /**
   * A Type Check Block (TCB) could not be generated because inlining was disabled, and the block
   * would've required inlining.
   *
   * 无法生成类型检查块 (TCB)，因为内联已禁用，并且该块将需要内联。
   *
   */
  SkipGenerateTcbNoInline,

  /**
   * A `.ngtypecheck.ts` file could be reused from the previous program and did not need to be
   * regenerated.
   *
   * `.ngtypecheck.ts` 文件可以从以前的程序中重用，并且不需要重新生成。
   *
   */
  ReuseTypeCheckFile,

  /**
   * The template type-checking program required changes and had to be updated in an incremental
   * step.
   *
   * 模板类型检查程序需要更改，并且必须分步更新。
   *
   */
  UpdateTypeCheckProgram,

  /**
   * The compiler was able to prove that a `ts.SourceFile` did not need to be re-emitted.
   *
   * 编译器能够证明 `ts.SourceFile` 不需要重新发出。
   *
   */
  EmitSkipSourceFile,

  /**
   * A `ts.SourceFile` was emitted.
   *
   * 发出了 `ts.SourceFile` 。
   *
   */
  EmitSourceFile,

  /**
   * Tracks the number of `PrefEvent`s, and must appear at the end of the list.
   *
   * 跟踪 `PrefEvent` 的数量，并且必须出现在列表的末尾。
   *
   */
  LAST,
}

/**
 * Represents a checkpoint during compilation at which the memory usage of the compiler should be
 * recorded.
 *
 * 表示编译期间的检查点，在该检查点处应该记录编译器的内存使用情况。
 *
 */
export enum PerfCheckpoint {
  /**
   * The point at which the `PerfRecorder` was created, and ideally tracks memory used before any
   * compilation structures are created.
   *
   * 创建 `PerfRecorder` 的点，理想情况下，在创建任何编译结构之前跟踪使用的内存。
   *
   */
  Initial,

  /**
   * The point just after the `ts.Program` has been created.
   *
   * 创建 `ts.Program` 之后的点。
   *
   */
  TypeScriptProgramCreate,

  /**
   * The point just before Angular analysis starts.
   *
   * Angular 分析开始之前的点。
   *
   * In the main usage pattern for the compiler, TypeScript diagnostics have been calculated at this
   * point, so the `ts.TypeChecker` has fully ingested the current program, all `ts.Type` structures
   * and `ts.Symbol`s have been created.
   *
   * 在编译器的主要使用模式中，此时已经计算了 TypeScript 诊断，因此 `ts.TypeChecker`
   * 已完全摄取当前程序，所有 `ts.Type` 结构和 `ts.Symbol` 都已创建。
   *
   */
  PreAnalysis,

  /**
   * The point just after Angular analysis completes.
   *
   * Angular 分析完成之后的点。
   *
   */
  Analysis,

  /**
   * The point just after Angular resolution is complete.
   *
   * Angular 解析完成之后的点。
   *
   */
  Resolve,

  /**
   * The point just after Type Check Blocks (TCBs) have been generated.
   *
   * 已生成类型检查块 (TCB) 之后的点。
   *
   */
  TtcGeneration,

  /**
   * The point just after the template type-checking program has been updated with any new TCBs.
   *
   * 模板类型检查程序已使用任何新的 TCB 更新之后的点。
   *
   */
  TtcUpdateProgram,

  /**
   * The point just before emit begins.
   *
   * emit 开始之前的点。
   *
   * In the main usage pattern for the compiler, all template type-checking diagnostics have been
   * requested at this point.
   *
   * 在编译器的主要使用模式中，此时已请求所有模板类型检查诊断。
   *
   */
  PreEmit,

  /**
   * The point just after the program has been fully emitted.
   *
   * 程序完全发出之后的点。
   *
   */
  Emit,

  /**
   * Tracks the number of `PerfCheckpoint`s, and must appear at the end of the list.
   *
   * 跟踪 `PerfCheckpoint` 的数量，并且必须出现在列表的末尾。
   *
   */
  LAST,
}

/**
 * Records timing, memory, or counts at specific points in the compiler's operation.
 *
 * 记录编译器操作中特定点的时序、内存或计数。
 *
 */
export interface PerfRecorder {
  /**
   * Set the current phase of compilation.
   *
   * 设置编译的当前阶段。
   *
   * Time spent in the previous phase will be accounted to that phase. The caller is responsible for
   * exiting the phase when work that should be tracked within it is completed, and either returning
   * to the previous phase or transitioning to the next one directly.
   *
   * 在前一个阶段花费的时间将计入该阶段。调用者负责在其中应该跟踪的工作完成时退出此阶段，并返回上一个阶段或直接转换到下一个阶段。
   *
   * In general, prefer using `inPhase()` to instrument a section of code, as it automatically
   * handles entering and exiting the phase. `phase()` should only be used when the former API
   * cannot be cleanly applied to a particular operation.
   *
   * 一般来说，更喜欢使用 `inPhase()` 来检测一段代码，因为它会自动处理进入和退出阶段。只有当前一个
   * API 无法完全应用于特定操作时，才应该使用 `phase()` 。
   *
   * @returns
   *
   * the previous phase
   *
   * 上一个阶段
   *
   */
  phase(phase: PerfPhase): PerfPhase;

  /**
   * Run `fn` in the given `PerfPhase` and return the result.
   *
   * 在给定的 `PerfPhase` 中运行 `fn` 并返回结果。
   *
   * Enters `phase` before executing the given `fn`, then exits the phase and returns the result.
   * Prefer this API to `phase()` where possible.
   *
   * 在执行给定的 `fn` 之前进入 `phase` ，然后退出 Phase 并返回结果。在可能的情况下，首选此 API 而
   * `phase()` 。
   *
   */
  inPhase<T>(phase: PerfPhase, fn: () => T): T;

  /**
   * Record the memory usage of the compiler at the given checkpoint.
   *
   * 记录编译器在给定检查点的内存使用情况。
   *
   */
  memory(after: PerfCheckpoint): void;

  /**
   * Record that a specific event has occurred, possibly more than once.
   *
   * 记录已发生的特定事件，可能不止一次。
   *
   */
  eventCount(event: PerfEvent, incrementBy?: number): void;

  /**
   * Return the `PerfRecorder` to an empty state (clear all tracked statistics) and reset the zero
   * point to the current time.
   *
   * 将 `PerfRecorder` 恢复为空状态（清除所有跟踪的统计信息）并将零点重置为当前时间。
   *
   */
  reset(): void;
}

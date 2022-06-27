/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {ExtendedTsCompilerHost, NgCompilerOptions} from '../ngtsc/core/api';

export const DEFAULT_ERROR_CODE = 100;
export const UNKNOWN_ERROR_CODE = 500;
export const SOURCE = 'angular' as 'angular';

export function isTsDiagnostic(diagnostic: any): diagnostic is ts.Diagnostic {
  return diagnostic != null && diagnostic.source !== 'angular';
}

export interface CompilerOptions extends NgCompilerOptions, ts.CompilerOptions {
  // NOTE: These comments and aio/content/guides/aot-compiler.md should be kept in sync.

  // Write statistics about compilation (e.g. total time, ...)
  // Note: this is the --diagnostics command line option from TS (which is @internal
  // on ts.CompilerOptions interface).
  diagnostics?: boolean;

  // Absolute path to a directory where generated file structure is written.
  // If unspecified, generated files will be written alongside sources.
  // @deprecated - no effect
  genDir?: string;

  // Path to the directory containing the tsconfig.json file.
  basePath?: string;

  // Don't produce .metadata.json files (they don't work for bundled emit with --out)
  skipMetadataEmit?: boolean;

  // Produce an error if the metadata written for a class would produce an error if used.
  strictMetadataEmit?: boolean;

  // Don't produce .ngfactory.js or .ngstyle.js files
  skipTemplateCodegen?: boolean;

  // A prefix to insert in generated private symbols, e.g. for "my_prefix_" we
  // would generate private symbols named like `ɵmy_prefix_a`.
  flatModulePrivateSymbolPrefix?: string;

  // Whether to generate code for library code.
  // If true, produce .ngfactory.ts and .ngstyle.ts files for .d.ts inputs.
  // Default is true.
  generateCodeForLibraries?: boolean;

  // Modify how angular annotations are emitted to improve tree-shaking.
  // Default is static fields.
  // decorators: Leave the Decorators in-place. This makes compilation faster.
  //             TypeScript will emit calls to the __decorate helper.
  //             `--emitDecoratorMetadata` can be used for runtime reflection.
  //             However, the resulting code will not properly tree-shake.
  // static fields: Replace decorators with a static field in the class.
  //                Allows advanced tree-shakers like Closure Compiler to remove
  //                unused classes.
  annotationsAs?: 'decorators'|'static fields';

  // Print extra information while running the compiler
  trace?: boolean;

  // Whether to enable lowering expressions lambdas and expressions in a reference value
  // position.
  disableExpressionLowering?: boolean;

  // Import format if different from `i18nFormat`
  i18nInFormat?: string;
  // Path to the translation file
  i18nInFile?: string;
  // How to handle missing messages
  i18nInMissingTranslations?: 'error'|'warning'|'ignore';

  /**
   * Whether to generate .ngsummary.ts files that allow to use AOTed artifacts
   * in JIT mode. This is off by default.
   *
   * 是否生成允许在 JIT 模式下使用 AOTed 工件的 .ngsummary.ts 文件。默认情况下，这是关闭的。
   *
   */
  enableSummariesForJit?: boolean;

  /**
   * Whether to replace the `templateUrl` and `styleUrls` property in all
   *
   * 是否替换所有 `templateUrl` 和 `styleUrls` 属性
   *
   * @Component decorators with inlined contents in `template` and `styles`
   * properties.
   * When enabled, the .js output of ngc will have no lazy-loaded `templateUrl`
   * or `styleUrl`s. Note that this requires that resources be available to
   * load statically at compile-time.
   */
  enableResourceInlining?: boolean;

  /** @internal */
  collectAllErrors?: boolean;

  /**
   * Whether NGC should generate re-exports for external symbols which are referenced
   * in Angular metadata (e.g. @Component, @Inject, @ViewChild). This can be enabled in
   * order to avoid dynamically generated module dependencies which can break strict
   * dependency enforcements. This is not enabled by default.
   * Read more about this here: <https://github.com/angular/angular/issues/25644>.
   *
   * NGC 是否应该为 Angular
   * 元数据中引用的外部符号（例如 @Component、@Inject、@ViewChild）生成重新导出。可以启用此功能以避免动态生成的模块依赖项，这可能会破坏严格的依赖强制执行。默认情况下，此未启用。在这里读更多关于这个的内容：
   * <https://github.com/angular/angular/issues/25644> 。
   *
   */
  createExternalSymbolFactoryReexports?: boolean;
}

export interface CompilerHost extends ts.CompilerHost, ExtendedTsCompilerHost {
  /**
   * Converts a module name that is used in an `import` to a file path.
   * I.e. `path/to/containingFile.ts` containing `import {...} from 'module-name'`.
   *
   * 将 `import` 中使用的模块名称转换为文件路径。即包含 `import {...} from 'module-name'`
   * `path/to/containingFile.ts` 。
   *
   */
  moduleNameToFileName?(moduleName: string, containingFile: string): string|null;
  /**
   * Converts a file name into a representation that should be stored in a summary file.
   * This has to include changing the suffix as well.
   * E.g.
   * `some_file.ts` -> `some_file.d.ts`
   *
   * 将文件名转换为应该存储在摘要文件中的表示。这还必须包括更改后缀。例如 `some_file.ts` ->
   * `some_file.d.ts`
   *
   * @param referringSrcFileName the soure file that refers to fileName
   *
   * 引用 fileName 的源文件
   *
   */
  toSummaryFileName?(fileName: string, referringSrcFileName: string): string;
  /**
   * Converts a fileName that was processed by `toSummaryFileName` back into a real fileName
   * given the fileName of the library that is referrig to it.
   *
   * 给定引用它的库的文件名，将 `toSummaryFileName` 处理的文件名转换回真实的文件名。
   *
   */
  fromSummaryFileName?(fileName: string, referringLibFileName: string): string;
  /**
   * Produce an AMD module name for the source file. Used in Bazel.
   *
   * 为源文件生成 AMD 模块名称。在 Bazel 中使用。
   *
   * An AMD module can have an arbitrary name, so that it is require'd by name
   * rather than by path. See <https://requirejs.org/docs/whyamd.html#namedmodules>
   *
   * AMD
   * 模块可以有任意名称，因此它是按名称而不是路径要求的。请参阅<https://requirejs.org/docs/whyamd.html#namedmodules>
   *
   */
  amdModuleName?(sf: ts.SourceFile): string|undefined;
}

export enum EmitFlags {
  DTS = 1 << 0,
  JS = 1 << 1,
  Metadata = 1 << 2,
  I18nBundle = 1 << 3,
  Codegen = 1 << 4,

  Default = DTS | JS | Codegen,
  All = DTS | JS | Metadata | I18nBundle | Codegen,
}

export interface CustomTransformers {
  beforeTs?: ts.TransformerFactory<ts.SourceFile>[];
  afterTs?: ts.TransformerFactory<ts.SourceFile>[];
}

export interface TsEmitArguments {
  program: ts.Program;
  host: CompilerHost;
  options: CompilerOptions;
  targetSourceFile?: ts.SourceFile;
  writeFile?: ts.WriteFileCallback;
  cancellationToken?: ts.CancellationToken;
  emitOnlyDtsFiles?: boolean;
  customTransformers?: ts.CustomTransformers;
}

export interface TsEmitCallback {
  (args: TsEmitArguments): ts.EmitResult;
}
export interface TsMergeEmitResultsCallback {
  (results: ts.EmitResult[]): ts.EmitResult;
}

export interface LazyRoute {
  route: string;
  module: {name: string, filePath: string};
  referencedModule: {name: string, filePath: string};
}

export interface Program {
  /**
   * Retrieve the TypeScript program used to produce semantic diagnostics and emit the sources.
   *
   * 检索用于生成语义诊断并发出源代码的 TypeScript 程序。
   *
   * Angular structural information is required to produce the program.
   *
   * 生成程序需要角度结构信息。
   *
   */
  getTsProgram(): ts.Program;

  /**
   * Retrieve options diagnostics for the TypeScript options used to create the program. This is
   * faster than calling `getTsProgram().getOptionsDiagnostics()` since it does not need to
   * collect Angular structural information to produce the errors.
   *
   * 检索用于创建程序的 TypeScript 选项的选项诊断。这比调用 `getTsProgram().getOptionsDiagnostics()`
   * 快，因为它不需要收集 Angular 结构信息来生成错误。
   *
   */
  getTsOptionDiagnostics(cancellationToken?: ts.CancellationToken): ReadonlyArray<ts.Diagnostic>;

  /**
   * Retrieve options diagnostics for the Angular options used to create the program.
   *
   * 检索用于创建程序的 Angular 选项的选项诊断。
   *
   */
  getNgOptionDiagnostics(cancellationToken?: ts.CancellationToken): ReadonlyArray<ts.Diagnostic>;

  /**
   * Retrieve the syntax diagnostics from TypeScript. This is faster than calling
   * `getTsProgram().getSyntacticDiagnostics()` since it does not need to collect Angular structural
   * information to produce the errors.
   *
   * 从 TypeScript 检索语法诊断。这比调用 `getTsProgram().getSyntacticDiagnostics()`
   * 快，因为它不需要收集 Angular 结构信息来产生错误。
   *
   */
  getTsSyntacticDiagnostics(sourceFile?: ts.SourceFile, cancellationToken?: ts.CancellationToken):
      ReadonlyArray<ts.Diagnostic>;

  /**
   * Retrieve the diagnostics for the structure of an Angular application is correctly formed.
   * This includes validating Angular annotations and the syntax of referenced and imbedded HTML
   * and CSS.
   *
   * 检索对 Angular 应用程序结构的诊断是否正确。这包括验证 Angular 注解以及引用和嵌入的 HTML 和 CSS
   * 的语法。
   *
   * Note it is important to displaying TypeScript semantic diagnostics along with Angular
   * structural diagnostics as an error in the program structure might cause errors detected in
   * semantic analysis and a semantic error might cause errors in specifying the program structure.
   *
   * 请注意，将 TypeScript 语义诊断与 Angular
   * 结构诊断一起显示很重要，因为程序结构中的错误可能会导致在语义分析中检测到错误，并且语义错误可能会导致指定程序结构时出错。
   *
   * Angular structural information is required to produce these diagnostics.
   *
   * 生成这些诊断需要角度结构信息。
   *
   */
  getNgStructuralDiagnostics(cancellationToken?: ts.CancellationToken):
      ReadonlyArray<ts.Diagnostic>;

  /**
   * Retrieve the semantic diagnostics from TypeScript. This is equivalent to calling
   * `getTsProgram().getSemanticDiagnostics()` directly and is included for completeness.
   *
   * 从 TypeScript 检索语义诊断。这等效于直接调用 `getTsProgram().getSemanticDiagnostics()`
   * ，并且为了完整起见被包含在内。
   *
   */
  getTsSemanticDiagnostics(sourceFile?: ts.SourceFile, cancellationToken?: ts.CancellationToken):
      ReadonlyArray<ts.Diagnostic>;

  /**
   * Retrieve the Angular semantic diagnostics.
   *
   * 检索 Angular 语义诊断。
   *
   * Angular structural information is required to produce these diagnostics.
   *
   * 生成这些诊断需要角度结构信息。
   *
   */
  getNgSemanticDiagnostics(fileName?: string, cancellationToken?: ts.CancellationToken):
      ReadonlyArray<ts.Diagnostic>;

  /**
   * Load Angular structural information asynchronously. If this method is not called then the
   * Angular structural information, including referenced HTML and CSS files, are loaded
   * synchronously. If the supplied Angular compiler host returns a promise from `loadResource()`
   * will produce a diagnostic error message or, `getTsProgram()` or `emit` to throw.
   *
   * 异步加载 Angular 结构信息。如果不调用此方法，则会同步加载 Angular 结构信息，包括引用的 HTML 和
   * CSS 文件。如果提供的 Angular 编译器主机从 `loadResource()` 返回一个
   * Promise，则将生成诊断错误消息，或者， `getTsProgram()` 或 `emit` 来抛出。
   *
   */
  loadNgStructureAsync(): Promise<void>;

  /**
   * This method is obsolete and always returns an empty array.
   *
   * 此方法已过时，并且始终返回一个空数组。
   *
   */
  listLazyRoutes(entryRoute?: string): LazyRoute[];

  /**
   * Emit the files requested by emitFlags implied by the program.
   *
   * 发出程序隐含的 emitFlags 请求的文件。
   *
   * Angular structural information is required to emit files.
   *
   * 发出文件需要 Angular 结构信息。
   *
   */
  emit({emitFlags, cancellationToken, customTransformers, emitCallback, mergeEmitResultsCallback}?:
           {
             emitFlags?: EmitFlags,
             cancellationToken?: ts.CancellationToken,
             customTransformers?: CustomTransformers,
             emitCallback?: TsEmitCallback,
             mergeEmitResultsCallback?: TsMergeEmitResultsCallback
           }): ts.EmitResult;

  /**
   * @internal
   */
  getEmittedSourceFiles(): Map<string, ts.SourceFile>;
}

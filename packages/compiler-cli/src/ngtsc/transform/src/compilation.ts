/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ConstantPool} from '@angular/compiler';
import ts from 'typescript';

import {SourceFileTypeIdentifier} from '../../core/api';
import {ErrorCode, FatalDiagnosticError} from '../../diagnostics';
import {IncrementalBuild} from '../../incremental/api';
import {SemanticDepGraphUpdater, SemanticSymbol} from '../../incremental/semantic_graph';
import {IndexingContext} from '../../indexer';
import {PerfEvent, PerfRecorder} from '../../perf';
import {ClassDeclaration, DeclarationNode, Decorator, isNamedClassDeclaration, ReflectionHost} from '../../reflection';
import {ProgramTypeCheckAdapter, TypeCheckContext} from '../../typecheck/api';
import {ExtendedTemplateChecker} from '../../typecheck/extended/api';
import {getSourceFile} from '../../util/src/typescript';
import {Xi18nContext} from '../../xi18n';

import {AnalysisOutput, CompilationMode, CompileResult, DecoratorHandler, HandlerFlags, HandlerPrecedence, ResolveResult} from './api';
import {DtsTransformRegistry} from './declaration';
import {PendingTrait, Trait, TraitState} from './trait';


/**
 * Records information about a specific class that has matched traits.
 *
 * 记录有关具有匹配特性的特定类的信息。
 *
 */
export interface ClassRecord {
  /**
   * The `ClassDeclaration` of the class which has Angular traits applied.
   *
   * 应用了 Angular 特性的类的 `ClassDeclaration` 。
   *
   */
  node: ClassDeclaration;

  /**
   * All traits which matched on the class.
   *
   * 在类上匹配的所有特性。
   *
   */
  traits: Trait<unknown, unknown, SemanticSymbol|null, unknown>[];

  /**
   * Meta-diagnostics about the class, which are usually related to whether certain combinations of
   * Angular decorators are not permitted.
   *
   * 关于类的元诊断，通常与是否允许 Angular 装饰器的某些组合有关。
   *
   */
  metaDiagnostics: ts.Diagnostic[]|null;

  // Subsequent fields are "internal" and used during the matching of `DecoratorHandler`s. This is
  // mutable state during the `detect`/`analyze` phases of compilation.

  /**
   * Whether `traits` contains traits matched from `DecoratorHandler`s marked as `WEAK`.
   *
   * `traits` 是否包含从标记为 `WEAK` 的 `DecoratorHandler` 匹配的特性。
   *
   */
  hasWeakHandlers: boolean;

  /**
   * Whether `traits` contains a trait from a `DecoratorHandler` matched as `PRIMARY`.
   *
   * `traits` 是否包含来自 `DecoratorHandler` 的匹配为 `PRIMARY` 的特性。
   *
   */
  hasPrimaryHandler: boolean;
}

/**
 * The heart of Angular compilation.
 *
 * Angular 编译的核心。
 *
 * The `TraitCompiler` is responsible for processing all classes in the program. Any time a
 * `DecoratorHandler` matches a class, a "trait" is created to represent that Angular aspect of the
 * class (such as the class having a component definition).
 *
 * `TraitCompiler` 负责处理程序中的所有类。任何时候 `DecoratorHandler`
 * 与类匹配时，都会创建一个“特征”来表示类的该 Angular 切面（例如具有组件定义的类）。
 *
 * The `TraitCompiler` transitions each trait through the various phases of compilation, culminating
 * in the production of `CompileResult`s instructing the compiler to apply various mutations to the
 * class (like adding fields or type declarations).
 *
 * `TraitCompiler` 通过编译的各个阶段转换每个特性，最终会生成 `CompileResult`
 * ，以指示编译器对类应用各种突变（例如添加字段或类型声明）。
 *
 */
export class TraitCompiler implements ProgramTypeCheckAdapter {
  /**
   * Maps class declarations to their `ClassRecord`, which tracks the Ivy traits being applied to
   * those classes.
   *
   * 将类声明映射到它们的 `ClassRecord` ，后者会跟踪应用于这些类的 Ivy 特性。
   *
   */
  private classes = new Map<ClassDeclaration, ClassRecord>();

  /**
   * Maps source files to any class declaration(s) within them which have been discovered to contain
   * Ivy traits.
   *
   * 将源文件映射到其中已发现包含 Ivy 特性的任何类声明。
   *
   */
  protected fileToClasses = new Map<ts.SourceFile, Set<ClassDeclaration>>();

  /**
   * Tracks which source files have been analyzed but did not contain any traits. This set allows
   * the compiler to skip analyzing these files in an incremental rebuild.
   *
   * 跟踪哪些源文件已被分析但不包含任何特性。此设置允许编译器在增量重建中跳过分析这些文件。
   *
   */
  protected filesWithoutTraits = new Set<ts.SourceFile>();

  private reexportMap = new Map<string, Map<string, [string, string]>>();

  private handlersByName =
      new Map<string, DecoratorHandler<unknown, unknown, SemanticSymbol|null, unknown>>();

  constructor(
      private handlers: DecoratorHandler<unknown, unknown, SemanticSymbol|null, unknown>[],
      private reflector: ReflectionHost,
      private perf: PerfRecorder,
      private incrementalBuild: IncrementalBuild<ClassRecord, unknown>,
      private compileNonExportedClasses: boolean,
      private compilationMode: CompilationMode,
      private dtsTransforms: DtsTransformRegistry,
      private semanticDepGraphUpdater: SemanticDepGraphUpdater|null,
      private sourceFileTypeIdentifier: SourceFileTypeIdentifier,
  ) {
    for (const handler of handlers) {
      this.handlersByName.set(handler.name, handler);
    }
  }

  analyzeSync(sf: ts.SourceFile): void {
    this.analyze(sf, false);
  }

  analyzeAsync(sf: ts.SourceFile): Promise<void>|undefined {
    return this.analyze(sf, true);
  }

  private analyze(sf: ts.SourceFile, preanalyze: false): void;
  private analyze(sf: ts.SourceFile, preanalyze: true): Promise<void>|undefined;
  private analyze(sf: ts.SourceFile, preanalyze: boolean): Promise<void>|undefined {
    // We shouldn't analyze declaration, shim, or resource files.
    if (sf.isDeclarationFile || this.sourceFileTypeIdentifier.isShim(sf) ||
        this.sourceFileTypeIdentifier.isResource(sf)) {
      return undefined;
    }

    // analyze() really wants to return `Promise<void>|void`, but TypeScript cannot narrow a return
    // type of 'void', so `undefined` is used instead.
    const promises: Promise<void>[] = [];

    const priorWork = this.incrementalBuild.priorAnalysisFor(sf);
    if (priorWork !== null) {
      this.perf.eventCount(PerfEvent.SourceFileReuseAnalysis);

      if (priorWork.length > 0) {
        for (const priorRecord of priorWork) {
          this.adopt(priorRecord);
        }

        this.perf.eventCount(PerfEvent.TraitReuseAnalysis, priorWork.length);
      } else {
        this.filesWithoutTraits.add(sf);
      }

      // Skip the rest of analysis, as this file's prior traits are being reused.
      return;
    }

    const visit = (node: ts.Node): void => {
      if (this.reflector.isClass(node)) {
        this.analyzeClass(node, preanalyze ? promises : null);
      }
      ts.forEachChild(node, visit);
    };

    visit(sf);

    if (!this.fileToClasses.has(sf)) {
      // If no traits were detected in the source file we record the source file itself to not have
      // any traits, such that analysis of the source file can be skipped during incremental
      // rebuilds.
      this.filesWithoutTraits.add(sf);
    }

    if (preanalyze && promises.length > 0) {
      return Promise.all(promises).then(() => undefined as void);
    } else {
      return undefined;
    }
  }

  recordFor(clazz: ClassDeclaration): ClassRecord|null {
    if (this.classes.has(clazz)) {
      return this.classes.get(clazz)!;
    } else {
      return null;
    }
  }

  recordsFor(sf: ts.SourceFile): ClassRecord[]|null {
    if (!this.fileToClasses.has(sf)) {
      return null;
    }
    const records: ClassRecord[] = [];
    for (const clazz of this.fileToClasses.get(sf)!) {
      records.push(this.classes.get(clazz)!);
    }
    return records;
  }

  getAnalyzedRecords(): Map<ts.SourceFile, ClassRecord[]> {
    const result = new Map<ts.SourceFile, ClassRecord[]>();
    for (const [sf, classes] of this.fileToClasses) {
      const records: ClassRecord[] = [];
      for (const clazz of classes) {
        records.push(this.classes.get(clazz)!);
      }
      result.set(sf, records);
    }
    for (const sf of this.filesWithoutTraits) {
      result.set(sf, []);
    }
    return result;
  }

  /**
   * Import a `ClassRecord` from a previous compilation.
   *
   * 从以前的编译中导入 `ClassRecord` 。
   *
   * Traits from the `ClassRecord` have accurate metadata, but the `handler` is from the old program
   * and needs to be updated (matching is done by name). A new pending trait is created and then
   * transitioned to analyzed using the previous analysis. If the trait is in the errored state,
   * instead the errors are copied over.
   *
   * `ClassRecord` 中的特性具有准确的元数据，但 `handler`
   * 来自旧程序，需要更新（匹配是按名称完成的）。创建了一个新的待处理特性，然后使用以前的分析转换为
   * analyzer 。如果特性处于错误状态，则会复制错误。
   *
   */
  private adopt(priorRecord: ClassRecord): void {
    const record: ClassRecord = {
      hasPrimaryHandler: priorRecord.hasPrimaryHandler,
      hasWeakHandlers: priorRecord.hasWeakHandlers,
      metaDiagnostics: priorRecord.metaDiagnostics,
      node: priorRecord.node,
      traits: [],
    };

    for (const priorTrait of priorRecord.traits) {
      const handler = this.handlersByName.get(priorTrait.handler.name)!;
      let trait: Trait<unknown, unknown, SemanticSymbol|null, unknown> =
          Trait.pending(handler, priorTrait.detected);

      if (priorTrait.state === TraitState.Analyzed || priorTrait.state === TraitState.Resolved) {
        const symbol = this.makeSymbolForTrait(handler, record.node, priorTrait.analysis);
        trait = trait.toAnalyzed(priorTrait.analysis, priorTrait.analysisDiagnostics, symbol);
        if (trait.analysis !== null && trait.handler.register !== undefined) {
          trait.handler.register(record.node, trait.analysis);
        }
      } else if (priorTrait.state === TraitState.Skipped) {
        trait = trait.toSkipped();
      }

      record.traits.push(trait);
    }

    this.classes.set(record.node, record);
    const sf = record.node.getSourceFile();
    if (!this.fileToClasses.has(sf)) {
      this.fileToClasses.set(sf, new Set<ClassDeclaration>());
    }
    this.fileToClasses.get(sf)!.add(record.node);
  }

  private scanClassForTraits(clazz: ClassDeclaration):
      PendingTrait<unknown, unknown, SemanticSymbol|null, unknown>[]|null {
    if (!this.compileNonExportedClasses && !this.reflector.isStaticallyExported(clazz)) {
      return null;
    }

    const decorators = this.reflector.getDecoratorsOfDeclaration(clazz);

    return this.detectTraits(clazz, decorators);
  }

  protected detectTraits(clazz: ClassDeclaration, decorators: Decorator[]|null):
      PendingTrait<unknown, unknown, SemanticSymbol|null, unknown>[]|null {
    let record: ClassRecord|null = this.recordFor(clazz);
    let foundTraits: PendingTrait<unknown, unknown, SemanticSymbol|null, unknown>[] = [];

    for (const handler of this.handlers) {
      const result = handler.detect(clazz, decorators);
      if (result === undefined) {
        continue;
      }

      const isPrimaryHandler = handler.precedence === HandlerPrecedence.PRIMARY;
      const isWeakHandler = handler.precedence === HandlerPrecedence.WEAK;
      const trait = Trait.pending(handler, result);

      foundTraits.push(trait);

      if (record === null) {
        // This is the first handler to match this class. This path is a fast path through which
        // most classes will flow.
        record = {
          node: clazz,
          traits: [trait],
          metaDiagnostics: null,
          hasPrimaryHandler: isPrimaryHandler,
          hasWeakHandlers: isWeakHandler,
        };

        this.classes.set(clazz, record);
        const sf = clazz.getSourceFile();
        if (!this.fileToClasses.has(sf)) {
          this.fileToClasses.set(sf, new Set<ClassDeclaration>());
        }
        this.fileToClasses.get(sf)!.add(clazz);
      } else {
        // This is at least the second handler to match this class. This is a slower path that some
        // classes will go through, which validates that the set of decorators applied to the class
        // is valid.

        // Validate according to rules as follows:
        //
        // * WEAK handlers are removed if a non-WEAK handler matches.
        // * Only one PRIMARY handler can match at a time. Any other PRIMARY handler matching a
        //   class with an existing PRIMARY handler is an error.

        if (!isWeakHandler && record.hasWeakHandlers) {
          // The current handler is not a WEAK handler, but the class has other WEAK handlers.
          // Remove them.
          record.traits =
              record.traits.filter(field => field.handler.precedence !== HandlerPrecedence.WEAK);
          record.hasWeakHandlers = false;
        } else if (isWeakHandler && !record.hasWeakHandlers) {
          // The current handler is a WEAK handler, but the class has non-WEAK handlers already.
          // Drop the current one.
          continue;
        }

        if (isPrimaryHandler && record.hasPrimaryHandler) {
          // The class already has a PRIMARY handler, and another one just matched.
          record.metaDiagnostics = [{
            category: ts.DiagnosticCategory.Error,
            code: Number('-99' + ErrorCode.DECORATOR_COLLISION),
            file: getSourceFile(clazz),
            start: clazz.getStart(undefined, false),
            length: clazz.getWidth(),
            messageText: 'Two incompatible decorators on class',
          }];
          record.traits = foundTraits = [];
          break;
        }

        // Otherwise, it's safe to accept the multiple decorators here. Update some of the metadata
        // regarding this class.
        record.traits.push(trait);
        record.hasPrimaryHandler = record.hasPrimaryHandler || isPrimaryHandler;
      }
    }

    return foundTraits.length > 0 ? foundTraits : null;
  }

  private makeSymbolForTrait(
      handler: DecoratorHandler<unknown, unknown, SemanticSymbol|null, unknown>,
      decl: ClassDeclaration, analysis: Readonly<unknown>|null): SemanticSymbol|null {
    if (analysis === null) {
      return null;
    }
    const symbol = handler.symbol(decl, analysis);
    if (symbol !== null && this.semanticDepGraphUpdater !== null) {
      const isPrimary = handler.precedence === HandlerPrecedence.PRIMARY;
      if (!isPrimary) {
        throw new Error(
            `AssertionError: ${handler.name} returned a symbol but is not a primary handler.`);
      }
      this.semanticDepGraphUpdater.registerSymbol(symbol);
    }

    return symbol;
  }

  protected analyzeClass(clazz: ClassDeclaration, preanalyzeQueue: Promise<void>[]|null): void {
    const traits = this.scanClassForTraits(clazz);

    if (traits === null) {
      // There are no Ivy traits on the class, so it can safely be skipped.
      return;
    }

    for (const trait of traits) {
      const analyze = () => this.analyzeTrait(clazz, trait);

      let preanalysis: Promise<void>|null = null;
      if (preanalyzeQueue !== null && trait.handler.preanalyze !== undefined) {
        // Attempt to run preanalysis. This could fail with a `FatalDiagnosticError`; catch it if it
        // does.
        try {
          preanalysis = trait.handler.preanalyze(clazz, trait.detected.metadata) || null;
        } catch (err) {
          if (err instanceof FatalDiagnosticError) {
            trait.toAnalyzed(null, [err.toDiagnostic()], null);
            return;
          } else {
            throw err;
          }
        }
      }
      if (preanalysis !== null) {
        preanalyzeQueue!.push(preanalysis.then(analyze));
      } else {
        analyze();
      }
    }
  }

  protected analyzeTrait(
      clazz: ClassDeclaration, trait: Trait<unknown, unknown, SemanticSymbol|null, unknown>,
      flags?: HandlerFlags): void {
    if (trait.state !== TraitState.Pending) {
      throw new Error(`Attempt to analyze trait of ${clazz.name.text} in state ${
          TraitState[trait.state]} (expected DETECTED)`);
    }

    this.perf.eventCount(PerfEvent.TraitAnalyze);

    // Attempt analysis. This could fail with a `FatalDiagnosticError`; catch it if it does.
    let result: AnalysisOutput<unknown>;
    try {
      result = trait.handler.analyze(clazz, trait.detected.metadata, flags);
    } catch (err) {
      if (err instanceof FatalDiagnosticError) {
        trait.toAnalyzed(null, [err.toDiagnostic()], null);
        return;
      } else {
        throw err;
      }
    }

    const symbol = this.makeSymbolForTrait(trait.handler, clazz, result.analysis ?? null);
    if (result.analysis !== undefined && trait.handler.register !== undefined) {
      trait.handler.register(clazz, result.analysis);
    }
    trait = trait.toAnalyzed(result.analysis ?? null, result.diagnostics ?? null, symbol);
  }

  resolve(): void {
    const classes = Array.from(this.classes.keys());
    for (const clazz of classes) {
      const record = this.classes.get(clazz)!;
      for (let trait of record.traits) {
        const handler = trait.handler;
        switch (trait.state) {
          case TraitState.Skipped:
            continue;
          case TraitState.Pending:
            throw new Error(`Resolving a trait that hasn't been analyzed: ${clazz.name.text} / ${
                Object.getPrototypeOf(trait.handler).constructor.name}`);
          case TraitState.Resolved:
            throw new Error(`Resolving an already resolved trait`);
        }

        if (trait.analysis === null) {
          // No analysis results, cannot further process this trait.
          continue;
        }

        if (handler.resolve === undefined) {
          // No resolution of this trait needed - it's considered successful by default.
          trait = trait.toResolved(null, null);
          continue;
        }

        let result: ResolveResult<unknown>;
        try {
          result = handler.resolve(clazz, trait.analysis as Readonly<unknown>, trait.symbol);
        } catch (err) {
          if (err instanceof FatalDiagnosticError) {
            trait = trait.toResolved(null, [err.toDiagnostic()]);
            continue;
          } else {
            throw err;
          }
        }

        trait = trait.toResolved(result.data ?? null, result.diagnostics ?? null);

        if (result.reexports !== undefined) {
          const fileName = clazz.getSourceFile().fileName;
          if (!this.reexportMap.has(fileName)) {
            this.reexportMap.set(fileName, new Map<string, [string, string]>());
          }
          const fileReexports = this.reexportMap.get(fileName)!;
          for (const reexport of result.reexports) {
            fileReexports.set(reexport.asAlias, [reexport.fromModule, reexport.symbolName]);
          }
        }
      }
    }
  }

  /**
   * Generate type-checking code into the `TypeCheckContext` for any components within the given
   * `ts.SourceFile`.
   *
   * 为给定的 `TypeCheckContext` 中的任何组件在 `ts.SourceFile` 中生成类型检查代码。
   *
   */
  typeCheck(sf: ts.SourceFile, ctx: TypeCheckContext): void {
    if (!this.fileToClasses.has(sf)) {
      return;
    }

    for (const clazz of this.fileToClasses.get(sf)!) {
      const record = this.classes.get(clazz)!;
      for (const trait of record.traits) {
        if (trait.state !== TraitState.Resolved) {
          continue;
        } else if (trait.handler.typeCheck === undefined) {
          continue;
        }
        if (trait.resolution !== null) {
          trait.handler.typeCheck(ctx, clazz, trait.analysis, trait.resolution);
        }
      }
    }
  }

  extendedTemplateCheck(sf: ts.SourceFile, extendedTemplateChecker: ExtendedTemplateChecker):
      ts.Diagnostic[] {
    const classes = this.fileToClasses.get(sf);
    if (classes === undefined) {
      return [];
    }

    const diagnostics: ts.Diagnostic[] = [];
    for (const clazz of classes) {
      if (!isNamedClassDeclaration(clazz)) {
        continue;
      }
      const record = this.classes.get(clazz)!;
      for (const trait of record.traits) {
        if (trait.handler.extendedTemplateCheck === undefined) {
          continue;
        }
        diagnostics.push(...trait.handler.extendedTemplateCheck(clazz, extendedTemplateChecker));
      }
    }
    return diagnostics;
  }

  index(ctx: IndexingContext): void {
    for (const clazz of this.classes.keys()) {
      const record = this.classes.get(clazz)!;
      for (const trait of record.traits) {
        if (trait.state !== TraitState.Resolved) {
          // Skip traits that haven't been resolved successfully.
          continue;
        } else if (trait.handler.index === undefined) {
          // Skip traits that don't affect indexing.
          continue;
        }

        if (trait.resolution !== null) {
          trait.handler.index(ctx, clazz, trait.analysis, trait.resolution);
        }
      }
    }
  }

  xi18n(bundle: Xi18nContext): void {
    for (const clazz of this.classes.keys()) {
      const record = this.classes.get(clazz)!;
      for (const trait of record.traits) {
        if (trait.state !== TraitState.Analyzed && trait.state !== TraitState.Resolved) {
          // Skip traits that haven't been analyzed successfully.
          continue;
        } else if (trait.handler.xi18n === undefined) {
          // Skip traits that don't support xi18n.
          continue;
        }

        if (trait.analysis !== null) {
          trait.handler.xi18n(bundle, clazz, trait.analysis);
        }
      }
    }
  }

  updateResources(clazz: DeclarationNode): void {
    if (!this.reflector.isClass(clazz) || !this.classes.has(clazz)) {
      return;
    }
    const record = this.classes.get(clazz)!;
    for (const trait of record.traits) {
      if (trait.state !== TraitState.Resolved || trait.handler.updateResources === undefined) {
        continue;
      }

      trait.handler.updateResources(clazz, trait.analysis, trait.resolution);
    }
  }

  compile(clazz: DeclarationNode, constantPool: ConstantPool): CompileResult[]|null {
    const original = ts.getOriginalNode(clazz) as typeof clazz;
    if (!this.reflector.isClass(clazz) || !this.reflector.isClass(original) ||
        !this.classes.has(original)) {
      return null;
    }

    const record = this.classes.get(original)!;

    let res: CompileResult[] = [];

    for (const trait of record.traits) {
      if (trait.state !== TraitState.Resolved || containsErrors(trait.analysisDiagnostics) ||
          containsErrors(trait.resolveDiagnostics)) {
        // Cannot compile a trait that is not resolved, or had any errors in its declaration.
        continue;
      }

      // `trait.resolution` is non-null asserted here because TypeScript does not recognize that
      // `Readonly<unknown>` is nullable (as `unknown` itself is nullable) due to the way that
      // `Readonly` works.

      let compileRes: CompileResult|CompileResult[];
      if (this.compilationMode === CompilationMode.PARTIAL &&
          trait.handler.compilePartial !== undefined) {
        compileRes = trait.handler.compilePartial(clazz, trait.analysis, trait.resolution!);
      } else {
        compileRes =
            trait.handler.compileFull(clazz, trait.analysis, trait.resolution!, constantPool);
      }

      const compileMatchRes = compileRes;
      if (Array.isArray(compileMatchRes)) {
        for (const result of compileMatchRes) {
          if (!res.some(r => r.name === result.name)) {
            res.push(result);
          }
        }
      } else if (!res.some(result => result.name === compileMatchRes.name)) {
        res.push(compileMatchRes);
      }
    }

    // Look up the .d.ts transformer for the input file and record that at least one field was
    // generated, which will allow the .d.ts to be transformed later.
    this.dtsTransforms.getIvyDeclarationTransform(original.getSourceFile())
        .addFields(original, res);

    // Return the instruction to the transformer so the fields will be added.
    return res.length > 0 ? res : null;
  }

  decoratorsFor(node: ts.Declaration): ts.Decorator[] {
    const original = ts.getOriginalNode(node) as typeof node;
    if (!this.reflector.isClass(original) || !this.classes.has(original)) {
      return [];
    }

    const record = this.classes.get(original)!;
    const decorators: ts.Decorator[] = [];

    for (const trait of record.traits) {
      if (trait.state !== TraitState.Resolved) {
        continue;
      }

      if (trait.detected.trigger !== null && ts.isDecorator(trait.detected.trigger)) {
        decorators.push(trait.detected.trigger);
      }
    }

    return decorators;
  }

  get diagnostics(): ReadonlyArray<ts.Diagnostic> {
    const diagnostics: ts.Diagnostic[] = [];
    for (const clazz of this.classes.keys()) {
      const record = this.classes.get(clazz)!;
      if (record.metaDiagnostics !== null) {
        diagnostics.push(...record.metaDiagnostics);
      }
      for (const trait of record.traits) {
        if ((trait.state === TraitState.Analyzed || trait.state === TraitState.Resolved) &&
            trait.analysisDiagnostics !== null) {
          diagnostics.push(...trait.analysisDiagnostics);
        }
        if (trait.state === TraitState.Resolved && trait.resolveDiagnostics !== null) {
          diagnostics.push(...trait.resolveDiagnostics);
        }
      }
    }
    return diagnostics;
  }

  get exportStatements(): Map<string, Map<string, [string, string]>> {
    return this.reexportMap;
  }
}

function containsErrors(diagnostics: ts.Diagnostic[]|null): boolean {
  return diagnostics !== null &&
      diagnostics.some(diag => diag.category === ts.DiagnosticCategory.Error);
}

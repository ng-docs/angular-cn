/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {AotCompiler, AotCompilerHost, AotCompilerOptions, EmitterVisitorContext, GeneratedFile, MessageBundle, NgAnalyzedFile, NgAnalyzedModules, ParseSourceSpan, Serializer, TypeScriptEmitter, Xliff, Xliff2, Xmb, core, createAotCompiler, getParseErrors, isSyntaxError} from '@angular/compiler';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

import {TypeCheckHost, translateDiagnostics} from '../diagnostics/translate_diagnostics';
import {ModuleMetadata, createBundleIndexHost} from '../metadata/index';

import {CompilerHost, CompilerOptions, CustomTransformers, DEFAULT_ERROR_CODE, Diagnostic, EmitFlags, LibrarySummary, Program, SOURCE, TsEmitArguments, TsEmitCallback} from './api';
import {CodeGenerator, TsCompilerAotCompilerTypeCheckHostAdapter, getOriginalReferences} from './compiler_host';
import {LowerMetadataCache, getExpressionLoweringTransformFactory} from './lower_expressions';
import {getAngularEmitterTransformFactory} from './node_emitter_transform';
import {GENERATED_FILES, StructureIsReused, createMessageDiagnostic, tsStructureIsReused} from './util';

/**
 * Maximum number of files that are emitable via calling ts.Program.emit
 * passing individual targetSourceFiles.
 */
const MAX_FILE_COUNT_FOR_SINGLE_FILE_EMIT = 20;

const emptyModules: NgAnalyzedModules = {
  ngModules: [],
  ngModuleByPipeOrDirective: new Map(),
  files: []
};

const defaultEmitCallback: TsEmitCallback =
    ({program, targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles,
      customTransformers}) =>
        program.emit(
            targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles, customTransformers);

class AngularCompilerProgram implements Program {
  private metadataCache: LowerMetadataCache;
  private oldProgramLibrarySummaries: Map<string, LibrarySummary>|undefined;
  private oldProgramEmittedGeneratedFiles: Map<string, GeneratedFile>|undefined;
  private oldProgramEmittedSourceFiles: Map<string, ts.SourceFile>|undefined;
  // Note: This will be cleared out as soon as we create the _tsProgram
  private oldTsProgram: ts.Program|undefined;
  private emittedLibrarySummaries: LibrarySummary[]|undefined;
  private emittedGeneratedFiles: GeneratedFile[]|undefined;
  private emittedSourceFiles: ts.SourceFile[]|undefined;

  // Lazily initialized fields
  private _typeCheckHost: TypeCheckHost;
  private _compiler: AotCompiler;
  private _tsProgram: ts.Program;
  private _analyzedModules: NgAnalyzedModules|undefined;
  private _structuralDiagnostics: Diagnostic[]|undefined;
  private _programWithStubs: ts.Program|undefined;
  private _optionsDiagnostics: Diagnostic[] = [];

  constructor(
      private rootNames: string[], private options: CompilerOptions, private host: CompilerHost,
      private oldProgram?: Program) {
    const [major, minor] = ts.version.split('.');
    if (Number(major) < 2 || (Number(major) === 2 && Number(minor) < 4)) {
      throw new Error('The Angular Compiler requires TypeScript >= 2.4.');
    }
    this.oldTsProgram = oldProgram ? oldProgram.getTsProgram() : undefined;
    if (oldProgram) {
      this.oldProgramLibrarySummaries = oldProgram.getLibrarySummaries();
      this.oldProgramEmittedGeneratedFiles = oldProgram.getEmittedGeneratedFiles();
      this.oldProgramEmittedSourceFiles = oldProgram.getEmittedSourceFiles();
    }

    if (options.flatModuleOutFile) {
      const {host: bundleHost, indexName, errors} = createBundleIndexHost(options, rootNames, host);
      if (errors) {
        // TODO(tbosch): once we move MetadataBundler from tsc_wrapped into compiler_cli,
        // directly create ng.Diagnostic instead of using ts.Diagnostic here.
        this._optionsDiagnostics.push(...errors.map(e => ({
                                                      category: e.category,
                                                      messageText: e.messageText as string,
                                                      source: SOURCE,
                                                      code: DEFAULT_ERROR_CODE
                                                    })));
      } else {
        rootNames.push(indexName !);
        this.host = bundleHost;
      }
    }
    this.metadataCache = new LowerMetadataCache({quotedNames: true}, !!options.strictMetadataEmit);
  }

  getLibrarySummaries(): Map<string, LibrarySummary> {
    const result = new Map<string, LibrarySummary>();
    if (this.oldProgramLibrarySummaries) {
      this.oldProgramLibrarySummaries.forEach((summary, fileName) => result.set(fileName, summary));
    }
    if (this.emittedLibrarySummaries) {
      this.emittedLibrarySummaries.forEach(
          (summary, fileName) => result.set(summary.fileName, summary));
    }
    return result;
  }

  getEmittedGeneratedFiles(): Map<string, GeneratedFile> {
    const result = new Map<string, GeneratedFile>();
    if (this.oldProgramEmittedGeneratedFiles) {
      this.oldProgramEmittedGeneratedFiles.forEach(
          (genFile, fileName) => result.set(fileName, genFile));
    }
    if (this.emittedGeneratedFiles) {
      this.emittedGeneratedFiles.forEach((genFile) => result.set(genFile.genFileUrl, genFile));
    }
    return result;
  }

  getEmittedSourceFiles(): Map<string, ts.SourceFile> {
    const result = new Map<string, ts.SourceFile>();
    if (this.oldProgramEmittedSourceFiles) {
      this.oldProgramEmittedSourceFiles.forEach((sf, fileName) => result.set(fileName, sf));
    }
    if (this.emittedSourceFiles) {
      this.emittedSourceFiles.forEach((sf) => result.set(sf.fileName, sf));
    }
    return result;
  }

  getTsProgram(): ts.Program { return this.tsProgram; }

  getTsOptionDiagnostics(cancellationToken?: ts.CancellationToken) {
    return this.tsProgram.getOptionsDiagnostics(cancellationToken);
  }

  getNgOptionDiagnostics(cancellationToken?: ts.CancellationToken): Diagnostic[] {
    return [...this._optionsDiagnostics, ...getNgOptionDiagnostics(this.options)];
  }

  getTsSyntacticDiagnostics(sourceFile?: ts.SourceFile, cancellationToken?: ts.CancellationToken):
      ts.Diagnostic[] {
    return this.tsProgram.getSyntacticDiagnostics(sourceFile, cancellationToken);
  }

  getNgStructuralDiagnostics(cancellationToken?: ts.CancellationToken): Diagnostic[] {
    return this.structuralDiagnostics;
  }

  getTsSemanticDiagnostics(sourceFile?: ts.SourceFile, cancellationToken?: ts.CancellationToken):
      ts.Diagnostic[] {
    if (sourceFile) {
      return this.tsProgram.getSemanticDiagnostics(sourceFile, cancellationToken);
    }
    let diags: ts.Diagnostic[] = [];
    this.tsProgram.getSourceFiles().forEach(sf => {
      if (!GENERATED_FILES.test(sf.fileName)) {
        diags.push(...this.tsProgram.getSemanticDiagnostics(sf, cancellationToken));
      }
    });
    return diags;
  }

  getNgSemanticDiagnostics(fileName?: string, cancellationToken?: ts.CancellationToken):
      Diagnostic[] {
    let diags: ts.Diagnostic[] = [];
    this.tsProgram.getSourceFiles().forEach(sf => {
      if (GENERATED_FILES.test(sf.fileName) && !sf.isDeclarationFile) {
        diags.push(...this.tsProgram.getSemanticDiagnostics(sf, cancellationToken));
      }
    });
    const {ng} = translateDiagnostics(this.typeCheckHost, diags);
    return ng;
  }

  loadNgStructureAsync(): Promise<void> {
    if (this._analyzedModules) {
      throw new Error('Angular structure already loaded');
    }
    const {tmpProgram, sourceFiles, hostAdapter, rootNames} = this._createProgramWithBasicStubs();
    return this._compiler.loadFilesAsync(sourceFiles)
        .catch(this.catchAnalysisError.bind(this))
        .then(analyzedModules => {
          if (this._analyzedModules) {
            throw new Error('Angular structure loaded both synchronously and asynchronsly');
          }
          this._updateProgramWithTypeCheckStubs(
              tmpProgram, analyzedModules, hostAdapter, rootNames);
        });
  }

  emit(
      {emitFlags = EmitFlags.Default, cancellationToken, customTransformers,
       emitCallback = defaultEmitCallback}: {
        emitFlags?: EmitFlags,
        cancellationToken?: ts.CancellationToken,
        customTransformers?: CustomTransformers,
        emitCallback?: TsEmitCallback
      } = {}): ts.EmitResult {
    const emitStart = Date.now();
    if (emitFlags & EmitFlags.I18nBundle) {
      const locale = this.options.i18nOutLocale || null;
      const file = this.options.i18nOutFile || null;
      const format = this.options.i18nOutFormat || null;
      const bundle = this.compiler.emitMessageBundle(this.analyzedModules, locale);
      i18nExtract(format, file, this.host, this.options, bundle);
    }
    if ((emitFlags & (EmitFlags.JS | EmitFlags.DTS | EmitFlags.Metadata | EmitFlags.Codegen)) ===
        0) {
      return {emitSkipped: true, diagnostics: [], emittedFiles: []};
    }
    let {genFiles, genDiags} = this.generateFilesForEmit(emitFlags);
    if (genDiags.length) {
      return {
        diagnostics: genDiags,
        emitSkipped: true,
        emittedFiles: [],
      };
    }
    this.emittedGeneratedFiles = genFiles;
    const outSrcMapping: Array<{sourceFile: ts.SourceFile, outFileName: string}> = [];
    const genFileByFileName = new Map<string, GeneratedFile>();
    genFiles.forEach(genFile => genFileByFileName.set(genFile.genFileUrl, genFile));
    this.emittedLibrarySummaries = [];
    const emittedSourceFiles = [] as ts.SourceFile[];
    const writeTsFile: ts.WriteFileCallback =
        (outFileName, outData, writeByteOrderMark, onError?, sourceFiles?) => {
          const sourceFile = sourceFiles && sourceFiles.length == 1 ? sourceFiles[0] : null;
          let genFile: GeneratedFile|undefined;
          if (sourceFile) {
            outSrcMapping.push({outFileName: outFileName, sourceFile});
            genFile = genFileByFileName.get(sourceFile.fileName);
            if (!sourceFile.isDeclarationFile && !GENERATED_FILES.test(sourceFile.fileName)) {
              // Note: sourceFile is the transformed sourcefile, not the original one!
              emittedSourceFiles.push(this.tsProgram.getSourceFile(sourceFile.fileName));
            }
          }
          this.writeFile(outFileName, outData, writeByteOrderMark, onError, genFile, sourceFiles);
        };
    const tsCustomTansformers = this.calculateTransforms(genFileByFileName, customTransformers);
    const emitOnlyDtsFiles = (emitFlags & (EmitFlags.DTS | EmitFlags.JS)) == EmitFlags.DTS;
    // Restore the original references before we emit so TypeScript doesn't emit
    // a reference to the .d.ts file.
    const augmentedReferences = new Map<ts.SourceFile, ts.FileReference[]>();
    for (const sourceFile of this.tsProgram.getSourceFiles()) {
      const originalReferences = getOriginalReferences(sourceFile);
      if (originalReferences) {
        augmentedReferences.set(sourceFile, sourceFile.referencedFiles);
        sourceFile.referencedFiles = originalReferences;
      }
    }
    const genTsFiles: GeneratedFile[] = [];
    const genJsonFiles: GeneratedFile[] = [];
    genFiles.forEach(gf => {
      if (gf.stmts) {
        genTsFiles.push(gf);
      }
      if (gf.source) {
        genJsonFiles.push(gf);
      }
    });
    let emitResult: ts.EmitResult;
    let emittedUserTsCount: number;
    try {
      const sourceFilesToEmit = this.getSourceFilesForEmit();
      if (sourceFilesToEmit &&
          (sourceFilesToEmit.length + genTsFiles.length) < MAX_FILE_COUNT_FOR_SINGLE_FILE_EMIT) {
        const fileNamesToEmit =
            [...sourceFilesToEmit.map(sf => sf.fileName), ...genTsFiles.map(gf => gf.genFileUrl)];
        emitResult = mergeEmitResults(
            fileNamesToEmit.map((fileName) => emitResult = emitCallback({
                                  program: this.tsProgram,
                                  host: this.host,
                                  options: this.options,
                                  writeFile: writeTsFile, emitOnlyDtsFiles,
                                  customTransformers: tsCustomTansformers,
                                  targetSourceFile: this.tsProgram.getSourceFile(fileName),
                                })));
        emittedUserTsCount = sourceFilesToEmit.length;
      } else {
        emitResult = emitCallback({
          program: this.tsProgram,
          host: this.host,
          options: this.options,
          writeFile: writeTsFile, emitOnlyDtsFiles,
          customTransformers: tsCustomTansformers
        });
        emittedUserTsCount = this.tsProgram.getSourceFiles().length - genTsFiles.length;
      }
    } finally {
      // Restore the references back to the augmented value to ensure that the
      // checks that TypeScript makes for project structure reuse will succeed.
      for (const [sourceFile, references] of Array.from(augmentedReferences)) {
        sourceFile.referencedFiles = references;
      }
    }
    this.emittedSourceFiles = emittedSourceFiles;

    if (!outSrcMapping.length) {
      // if no files were emitted by TypeScript, also don't emit .json files
      emitResult.diagnostics.push(createMessageDiagnostic(`Emitted no files.`));
      return emitResult;
    }

    let sampleSrcFileName: string|undefined;
    let sampleOutFileName: string|undefined;
    if (outSrcMapping.length) {
      sampleSrcFileName = outSrcMapping[0].sourceFile.fileName;
      sampleOutFileName = outSrcMapping[0].outFileName;
    }
    const srcToOutPath =
        createSrcToOutPathMapper(this.options.outDir, sampleSrcFileName, sampleOutFileName);
    if (emitFlags & EmitFlags.Codegen) {
      genJsonFiles.forEach(gf => {
        const outFileName = srcToOutPath(gf.genFileUrl);
        this.writeFile(outFileName, gf.source !, false, undefined, gf);
      });
    }
    let metadataJsonCount = 0;
    if (emitFlags & EmitFlags.Metadata) {
      this.tsProgram.getSourceFiles().forEach(sf => {
        if (!sf.isDeclarationFile && !GENERATED_FILES.test(sf.fileName)) {
          metadataJsonCount++;
          const metadata = this.metadataCache.getMetadata(sf);
          const metadataText = JSON.stringify([metadata]);
          const outFileName = srcToOutPath(sf.fileName.replace(/\.ts$/, '.metadata.json'));
          this.writeFile(outFileName, metadataText, false, undefined, undefined, [sf]);
        }
      });
    }
    const emitEnd = Date.now();
    if (this.options.diagnostics) {
      emitResult.diagnostics.push(createMessageDiagnostic([
        `Emitted in ${emitEnd - emitStart}ms`,
        `- ${emittedUserTsCount} user ts files`,
        `- ${genTsFiles.length} generated ts files`,
        `- ${genJsonFiles.length + metadataJsonCount} generated json files`,
      ].join('\n')));
    }
    return emitResult;
  }

  // Private members
  private get compiler(): AotCompiler {
    if (!this._compiler) {
      this.initSync();
    }
    return this._compiler !;
  }

  private get analyzedModules(): NgAnalyzedModules {
    if (!this._analyzedModules) {
      this.initSync();
    }
    return this._analyzedModules !;
  }

  private get structuralDiagnostics(): Diagnostic[] {
    if (!this._structuralDiagnostics) {
      this.initSync();
    }
    return this._structuralDiagnostics !;
  }

  private get tsProgram(): ts.Program {
    if (!this._tsProgram) {
      this.initSync();
    }
    return this._tsProgram !;
  }

  private get typeCheckHost(): TypeCheckHost {
    if (!this._typeCheckHost) {
      this.initSync();
    }
    return this._typeCheckHost !;
  }

  private calculateTransforms(
      genFiles: Map<string, GeneratedFile>,
      customTransformers?: CustomTransformers): ts.CustomTransformers {
    const beforeTs: ts.TransformerFactory<ts.SourceFile>[] = [];
    if (!this.options.disableExpressionLowering) {
      beforeTs.push(getExpressionLoweringTransformFactory(this.metadataCache));
    }
    beforeTs.push(getAngularEmitterTransformFactory(genFiles));
    if (customTransformers && customTransformers.beforeTs) {
      beforeTs.push(...customTransformers.beforeTs);
    }
    const afterTs = customTransformers ? customTransformers.afterTs : undefined;
    return {before: beforeTs, after: afterTs};
  }

  private initSync() {
    if (this._analyzedModules) {
      return;
    }
    const {tmpProgram, sourceFiles, hostAdapter, rootNames} = this._createProgramWithBasicStubs();
    let analyzedModules: NgAnalyzedModules|null;
    try {
      analyzedModules = this._compiler.loadFilesSync(sourceFiles);
    } catch (e) {
      analyzedModules = this.catchAnalysisError(e);
    }
    this._updateProgramWithTypeCheckStubs(tmpProgram, analyzedModules, hostAdapter, rootNames);
  }

  private _createProgramWithBasicStubs(): {
    tmpProgram: ts.Program,
    hostAdapter: TsCompilerAotCompilerTypeCheckHostAdapter,
    rootNames: string[],
    sourceFiles: string[],
  } {
    if (this._analyzedModules) {
      throw new Error(`Internal Error: already initalized!`);
    }
    // Note: This is important to not produce a memory leak!
    const oldTsProgram = this.oldTsProgram;
    this.oldTsProgram = undefined;

    const codegen: CodeGenerator = {
      generateFile: (genFileName, baseFileName) =>
                        this._compiler.emitBasicStub(genFileName, baseFileName),
      findGeneratedFileNames: (fileName) => this._compiler.findGeneratedFileNames(fileName),
    };

    const hostAdapter = new TsCompilerAotCompilerTypeCheckHostAdapter(
        this.rootNames, this.options, this.host, this.metadataCache, codegen,
        this.oldProgramLibrarySummaries);
    const aotOptions = getAotCompilerOptions(this.options);
    this._compiler = createAotCompiler(hostAdapter, aotOptions).compiler;
    this._typeCheckHost = hostAdapter;
    this._structuralDiagnostics = [];

    let rootNames =
        this.rootNames.filter(fn => !GENERATED_FILES.test(fn) || !hostAdapter.isSourceFile(fn));
    if (this.options.noResolve) {
      this.rootNames.forEach(rootName => {
        if (hostAdapter.shouldGenerateFilesFor(rootName)) {
          rootNames.push(...this._compiler.findGeneratedFileNames(rootName));
        }
      });
    }

    const tmpProgram = ts.createProgram(rootNames, this.options, hostAdapter, oldTsProgram);
    const sourceFiles: string[] = [];
    tmpProgram.getSourceFiles().forEach(sf => {
      if (hostAdapter.isSourceFile(sf.fileName)) {
        sourceFiles.push(sf.fileName);
      }
    });
    return {tmpProgram, sourceFiles, hostAdapter, rootNames};
  }

  private _updateProgramWithTypeCheckStubs(
      tmpProgram: ts.Program, analyzedModules: NgAnalyzedModules|null,
      hostAdapter: TsCompilerAotCompilerTypeCheckHostAdapter, rootNames: string[]) {
    this._analyzedModules = analyzedModules || emptyModules;
    if (analyzedModules) {
      tmpProgram.getSourceFiles().forEach(sf => {
        if (sf.fileName.endsWith('.ngfactory.ts')) {
          const {generate, baseFileName} = hostAdapter.shouldGenerateFile(sf.fileName);
          if (generate) {
            // Note: ! is ok as hostAdapter.shouldGenerateFile will always return a basefileName
            // for .ngfactory.ts files.
            const genFile = this._compiler.emitTypeCheckStub(sf.fileName, baseFileName !);
            if (genFile) {
              hostAdapter.updateGeneratedFile(genFile);
            }
          }
        }
      });
    }
    this._tsProgram = ts.createProgram(rootNames, this.options, hostAdapter, tmpProgram);
    // Note: the new ts program should be completely reusable by TypeScript as:
    // - we cache all the files in the hostAdapter
    // - new new stubs use the exactly same imports/exports as the old once (we assert that in
    // hostAdapter.updateGeneratedFile).
    if (tsStructureIsReused(tmpProgram) !== StructureIsReused.Completely) {
      throw new Error(`Internal Error: The structure of the program changed during codegen.`);
    }
  }

  private catchAnalysisError(e: any): NgAnalyzedModules|null {
    if (isSyntaxError(e)) {
      const parserErrors = getParseErrors(e);
      if (parserErrors && parserErrors.length) {
        this._structuralDiagnostics =
            parserErrors.map<Diagnostic>(e => ({
                                           messageText: e.contextualMessage(),
                                           category: ts.DiagnosticCategory.Error,
                                           span: e.span,
                                           source: SOURCE,
                                           code: DEFAULT_ERROR_CODE
                                         }));
      } else {
        this._structuralDiagnostics = [{
          messageText: e.message,
          category: ts.DiagnosticCategory.Error,
          source: SOURCE,
          code: DEFAULT_ERROR_CODE
        }];
      }
      return null;
    }
    throw e;
  }

  // Note: this returns a ts.Diagnostic so that we
  // can return errors in a ts.EmitResult
  private generateFilesForEmit(emitFlags: EmitFlags):
      {genFiles: GeneratedFile[], genDiags: ts.Diagnostic[]} {
    try {
      if (!(emitFlags & EmitFlags.Codegen)) {
        return {genFiles: [], genDiags: []};
      }
      let genFiles = this.compiler.emitAllImpls(this.analyzedModules);
      if (this.oldProgramEmittedGeneratedFiles) {
        const oldProgramEmittedGeneratedFiles = this.oldProgramEmittedGeneratedFiles;
        genFiles = genFiles.filter(genFile => {
          const oldGenFile = oldProgramEmittedGeneratedFiles.get(genFile.genFileUrl);
          return !oldGenFile || !genFile.isEquivalent(oldGenFile);
        });
      }
      return {genFiles, genDiags: []};
    } catch (e) {
      // TODO(tbosch): check whether we can actually have syntax errors here,
      // as we already parsed the metadata and templates before to create the type check block.
      if (isSyntaxError(e)) {
        const genDiags: ts.Diagnostic[] = [{
          file: undefined,
          start: undefined,
          length: undefined,
          messageText: e.message,
          category: ts.DiagnosticCategory.Error,
          source: SOURCE,
          code: DEFAULT_ERROR_CODE
        }];
        return {genFiles: [], genDiags};
      }
      throw e;
    }
  }

  /**
   * Returns undefined if all files should be emitted.
   */
  private getSourceFilesForEmit(): ts.SourceFile[]|undefined {
    // TODO(tbosch): if one of the files contains a `const enum`
    // always emit all files -> return undefined!
    let sourceFilesToEmit: ts.SourceFile[]|undefined;
    if (this.oldProgramEmittedSourceFiles) {
      sourceFilesToEmit = this.tsProgram.getSourceFiles().filter(sf => {
        const oldFile = this.oldProgramEmittedSourceFiles !.get(sf.fileName);
        return !sf.isDeclarationFile && !GENERATED_FILES.test(sf.fileName) && sf !== oldFile;
      });
    }
    return sourceFilesToEmit;
  }

  private writeFile(
      outFileName: string, outData: string, writeByteOrderMark: boolean,
      onError?: (message: string) => void, genFile?: GeneratedFile, sourceFiles?: ts.SourceFile[]) {
    // collect emittedLibrarySummaries
    let baseFile: ts.SourceFile|undefined;
    if (genFile) {
      baseFile = this.tsProgram.getSourceFile(genFile.srcFileUrl);
      if (baseFile) {
        if (!this.emittedLibrarySummaries) {
          this.emittedLibrarySummaries = [];
        }
        if (genFile.genFileUrl.endsWith('.ngsummary.json') && baseFile.fileName.endsWith('.d.ts')) {
          this.emittedLibrarySummaries.push({
            fileName: baseFile.fileName,
            text: baseFile.text,
            sourceFile: baseFile,
          });
          this.emittedLibrarySummaries.push({fileName: genFile.genFileUrl, text: outData});
          if (!this.options.declaration) {
            // If we don't emit declarations, still record an empty .ngfactory.d.ts file,
            // as we might need it lateron for resolving module names from summaries.
            const ngFactoryDts =
                genFile.genFileUrl.substring(0, genFile.genFileUrl.length - 15) + '.ngfactory.d.ts';
            this.emittedLibrarySummaries.push({fileName: ngFactoryDts, text: ''});
          }
        } else if (outFileName.endsWith('.d.ts') && baseFile.fileName.endsWith('.d.ts')) {
          const dtsSourceFilePath = genFile.genFileUrl.replace(/\.ts$/, '.d.ts');
          // Note: Don't use sourceFiles here as the created .d.ts has a path in the outDir,
          // but we need one that is next to the .ts file
          this.emittedLibrarySummaries.push({fileName: dtsSourceFilePath, text: outData});
        }
      }
    }
    // Filter out generated files for which we didn't generate code.
    // This can happen as the stub caclulation is not completely exact.
    // Note: sourceFile refers to the .ngfactory.ts / .ngsummary.ts file
    const isGenerated = GENERATED_FILES.test(outFileName);
    if (isGenerated) {
      if (!genFile || !genFile.stmts || genFile.stmts.length === 0) {
        if (this.options.allowEmptyCodegenFiles) {
          outData = '';
        } else {
          return;
        }
      }
    }
    if (baseFile) {
      sourceFiles = sourceFiles ? [...sourceFiles, baseFile] : [baseFile];
    }
    this.host.writeFile(outFileName, outData, writeByteOrderMark, onError, sourceFiles);
  }
}

export function createProgram(
    {rootNames, options, host, oldProgram}:
        {rootNames: string[], options: CompilerOptions, host: CompilerHost, oldProgram?: Program}):
    Program {
  return new AngularCompilerProgram(rootNames, options, host, oldProgram);
}

// Compute the AotCompiler options
function getAotCompilerOptions(options: CompilerOptions): AotCompilerOptions {
  let missingTranslation = core.MissingTranslationStrategy.Warning;

  switch (options.i18nInMissingTranslations) {
    case 'ignore':
      missingTranslation = core.MissingTranslationStrategy.Ignore;
      break;
    case 'error':
      missingTranslation = core.MissingTranslationStrategy.Error;
      break;
  }

  let translations: string = '';

  if (options.i18nInFile) {
    if (!options.i18nInLocale) {
      throw new Error(`The translation file (${options.i18nInFile}) locale must be provided.`);
    }
    translations = fs.readFileSync(options.i18nInFile, 'utf8');
  } else {
    // No translations are provided, ignore any errors
    // We still go through i18n to remove i18n attributes
    missingTranslation = core.MissingTranslationStrategy.Ignore;
  }

  return {
    locale: options.i18nInLocale,
    i18nFormat: options.i18nInFormat || options.i18nOutFormat, translations, missingTranslation,
    enableLegacyTemplate: options.enableLegacyTemplate,
    enableSummariesForJit: options.enableSummariesForJit,
    preserveWhitespaces: options.preserveWhitespaces,
    fullTemplateTypeCheck: options.fullTemplateTypeCheck,
    allowEmptyCodegenFiles: options.allowEmptyCodegenFiles,
  };
}

function getNgOptionDiagnostics(options: CompilerOptions): Diagnostic[] {
  if (options.annotationsAs) {
    switch (options.annotationsAs) {
      case 'decorators':
      case 'static fields':
        break;
      default:
        return [{
          messageText:
              'Angular compiler options "annotationsAs" only supports "static fields" and "decorators"',
          category: ts.DiagnosticCategory.Error,
          source: SOURCE,
          code: DEFAULT_ERROR_CODE
        }];
    }
  }
  return [];
}

/**
 * Returns a function that can adjust a path from source path to out path,
 * based on an existing mapping from source to out path.
 *
 * TODO(tbosch): talk to the TypeScript team to expose their logic for calculating the `rootDir`
 * if none was specified.
 *
 * Note: This function works on normalized paths from typescript.
 *
 * @param outDir
 * @param outSrcMappings
 */
export function createSrcToOutPathMapper(
    outDir: string | undefined, sampleSrcFileName: string | undefined,
    sampleOutFileName: string | undefined, host: {
      dirname: typeof path.dirname,
      resolve: typeof path.resolve,
      relative: typeof path.relative
    } = path): (srcFileName: string) => string {
  let srcToOutPath: (srcFileName: string) => string;
  if (outDir) {
    if (sampleSrcFileName == null || sampleOutFileName == null) {
      throw new Error(`Can't calculate the rootDir without a sample srcFileName / outFileName. `);
    }
    const srcFileDir = host.dirname(sampleSrcFileName).replace(/\\/g, '/');
    const outFileDir = host.dirname(sampleOutFileName).replace(/\\/g, '/');
    if (srcFileDir === outFileDir) {
      return (srcFileName) => srcFileName;
    }
    const srcDirParts = srcFileDir.split('/');
    const outDirParts = outFileDir.split('/');
    // calculate the common suffix
    let i = 0;
    while (i < Math.min(srcDirParts.length, outDirParts.length) &&
           srcDirParts[srcDirParts.length - 1 - i] === outDirParts[outDirParts.length - 1 - i])
      i++;
    const rootDir = srcDirParts.slice(0, srcDirParts.length - i).join('/');
    srcToOutPath = (srcFileName) => host.resolve(outDir, host.relative(rootDir, srcFileName));
  } else {
    srcToOutPath = (srcFileName) => srcFileName;
  }
  return srcToOutPath;
}

export function i18nExtract(
    formatName: string | null, outFile: string | null, host: ts.CompilerHost,
    options: CompilerOptions, bundle: MessageBundle): string[] {
  formatName = formatName || 'null';
  // Checks the format and returns the extension
  const ext = i18nGetExtension(formatName);
  const content = i18nSerialize(bundle, formatName, options);
  const dstFile = outFile || `messages.${ext}`;
  const dstPath = path.resolve(options.outDir || options.basePath, dstFile);
  host.writeFile(dstPath, content, false);
  return [dstPath];
}

export function i18nSerialize(
    bundle: MessageBundle, formatName: string, options: CompilerOptions): string {
  const format = formatName.toLowerCase();
  let serializer: Serializer;

  switch (format) {
    case 'xmb':
      serializer = new Xmb();
      break;
    case 'xliff2':
    case 'xlf2':
      serializer = new Xliff2();
      break;
    case 'xlf':
    case 'xliff':
    default:
      serializer = new Xliff();
  }
  return bundle.write(
      serializer, (sourcePath: string) =>
                      options.basePath ? path.relative(options.basePath, sourcePath) : sourcePath);
}

export function i18nGetExtension(formatName: string): string {
  const format = (formatName || 'xlf').toLowerCase();

  switch (format) {
    case 'xmb':
      return 'xmb';
    case 'xlf':
    case 'xlif':
    case 'xliff':
    case 'xlf2':
    case 'xliff2':
      return 'xlf';
  }

  throw new Error(`Unsupported format "${formatName}"`);
}

function mergeEmitResults(emitResults: ts.EmitResult[]): ts.EmitResult {
  const diagnostics: ts.Diagnostic[] = [];
  let emitSkipped = false;
  const emittedFiles: string[] = [];
  for (const er of emitResults) {
    diagnostics.push(...er.diagnostics);
    emitSkipped = emitSkipped || er.emitSkipped;
    emittedFiles.push(...er.emittedFiles);
  }
  return {diagnostics, emitSkipped, emittedFiles};
}

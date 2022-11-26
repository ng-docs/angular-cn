/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {AbsoluteFsPath} from '../../file_system';
import {copyFileShimData, retagAllTsFiles, ShimReferenceTagger, untagAllTsFiles} from '../../shims';
import {RequiredDelegations, toUnredirectedSourceFile} from '../../util/src/typescript';

import {FileUpdate, MaybeSourceFileWithOriginalFile, NgOriginalFile, ProgramDriver, UpdateMode} from './api';

/**
 * Delegates all methods of `ts.CompilerHost` to a delegate, with the exception of
 * `getSourceFile`, `fileExists` and `writeFile` which are implemented in `TypeCheckProgramHost`.
 *
 * 将 `ts.CompilerHost` 的所有方法委托给委托，但在 `TypeCheckProgramHost` 中实现的 `getSourceFile`
 *、`fileExists` 和 `writeFile` 除外。
 *
 * If a new method is added to `ts.CompilerHost` which is not delegated, a type error will be
 * generated for this class.
 *
 * 如果将新方法添加到未委托的 `ts.CompilerHost` ，则会为此类生成类型错误。
 *
 */
export class DelegatingCompilerHost implements
    Omit<RequiredDelegations<ts.CompilerHost>, 'getSourceFile'|'fileExists'|'writeFile'> {
  constructor(protected delegate: ts.CompilerHost) {}

  private delegateMethod<M extends keyof ts.CompilerHost>(name: M): ts.CompilerHost[M] {
    return this.delegate[name] !== undefined ? (this.delegate[name] as any).bind(this.delegate) :
                                               undefined;
  }

  // Excluded are 'getSourceFile', 'fileExists' and 'writeFile', which are actually implemented by
  // `TypeCheckProgramHost` below.
  createHash = this.delegateMethod('createHash');
  directoryExists = this.delegateMethod('directoryExists');
  getCancellationToken = this.delegateMethod('getCancellationToken');
  getCanonicalFileName = this.delegateMethod('getCanonicalFileName');
  getCurrentDirectory = this.delegateMethod('getCurrentDirectory');
  getDefaultLibFileName = this.delegateMethod('getDefaultLibFileName');
  getDefaultLibLocation = this.delegateMethod('getDefaultLibLocation');
  getDirectories = this.delegateMethod('getDirectories');
  getEnvironmentVariable = this.delegateMethod('getEnvironmentVariable');
  getNewLine = this.delegateMethod('getNewLine');
  getParsedCommandLine = this.delegateMethod('getParsedCommandLine');
  getSourceFileByPath = this.delegateMethod('getSourceFileByPath');
  readDirectory = this.delegateMethod('readDirectory');
  readFile = this.delegateMethod('readFile');
  realpath = this.delegateMethod('realpath');
  resolveModuleNames = this.delegateMethod('resolveModuleNames');
  resolveTypeReferenceDirectives = this.delegateMethod('resolveTypeReferenceDirectives');
  trace = this.delegateMethod('trace');
  useCaseSensitiveFileNames = this.delegateMethod('useCaseSensitiveFileNames');
  getModuleResolutionCache = this.delegateMethod('getModuleResolutionCache');
  // @ts-ignore 'hasInvalidatedResolutions' is visible (and thus required here) in latest TSC
  // main. It's already present, so the code works at runtime.
  // TODO: remove this comment including the suppression once Angular uses a TSC version that
  // includes this change (github.com/microsoft/TypeScript@a455955).
  hasInvalidatedResolutions = this.delegateMethod('hasInvalidatedResolutions');
}

/**
 * A `ts.CompilerHost` which augments source files.
 *
 * 一个 `ts.CompilerHost` ，可扩展源文件。
 *
 */
class UpdatedProgramHost extends DelegatingCompilerHost {
  /**
   * Map of source file names to `ts.SourceFile` instances.
   *
   * 源文件名到 `ts.SourceFile` 实例的映射。
   *
   */
  private sfMap: Map<string, ts.SourceFile>;

  /**
   * The `ShimReferenceTagger` responsible for tagging `ts.SourceFile`s loaded via this host.
   *
   * 负责标记通过此宿主加载的 `ShimReferenceTagger` 的 `ts.SourceFile` 。
   *
   * The `UpdatedProgramHost` is used in the creation of a new `ts.Program`. Even though this new
   * program is based on a prior one, TypeScript will still start from the root files and enumerate
   * all source files to include in the new program.  This means that just like during the original
   * program's creation, these source files must be tagged with references to per-file shims in
   * order for those shims to be loaded, and then cleaned up afterwards. Thus the
   * `UpdatedProgramHost` has its own `ShimReferenceTagger` to perform this function.
   *
   * `UpdatedProgramHost` 用于创建新的 `ts.Program` 。尽管这个新程序是基于前一个程序的，但
   * TypeScript
   * 仍将从根文件启动并枚举要包含在新程序中的所有源文件。这意味着，就像在原始程序的创建期间一样，这些源文件必须使用对每个文件
   * shim 的引用进行标记，以便加载这些 shim，然后进行清理。因此，`UpdatedProgramHost` 有自己的
   * `ShimReferenceTagger` 来执行此功能。
   *
   */
  private shimTagger = new ShimReferenceTagger(this.shimExtensionPrefixes);

  constructor(
      sfMap: Map<string, ts.SourceFile>, private originalProgram: ts.Program,
      delegate: ts.CompilerHost, private shimExtensionPrefixes: string[]) {
    super(delegate);
    this.sfMap = sfMap;
  }

  getSourceFile(
      fileName: string, languageVersion: ts.ScriptTarget,
      onError?: ((message: string) => void)|undefined,
      shouldCreateNewSourceFile?: boolean|undefined): ts.SourceFile|undefined {
    // Try to use the same `ts.SourceFile` as the original program, if possible. This guarantees
    // that program reuse will be as efficient as possible.
    let delegateSf: ts.SourceFile|undefined = this.originalProgram.getSourceFile(fileName);
    if (delegateSf === undefined) {
      // Something went wrong and a source file is being requested that's not in the original
      // program. Just in case, try to retrieve it from the delegate.
      delegateSf = this.delegate.getSourceFile(
          fileName, languageVersion, onError, shouldCreateNewSourceFile)!;
    }
    if (delegateSf === undefined) {
      return undefined;
    }

    // Look for replacements.
    let sf: ts.SourceFile;
    if (this.sfMap.has(fileName)) {
      sf = this.sfMap.get(fileName)!;
      copyFileShimData(delegateSf, sf);
    } else {
      sf = delegateSf;
    }
    // TypeScript doesn't allow returning redirect source files. To avoid unforeseen errors we
    // return the original source file instead of the redirect target.
    sf = toUnredirectedSourceFile(sf);

    this.shimTagger.tag(sf);
    return sf;
  }

  postProgramCreationCleanup(): void {
    this.shimTagger.finalize();
  }

  writeFile(): never {
    throw new Error(`TypeCheckProgramHost should never write files`);
  }

  fileExists(fileName: string): boolean {
    return this.sfMap.has(fileName) || this.delegate.fileExists(fileName);
  }
}


/**
 * Updates a `ts.Program` instance with a new one that incorporates specific changes, using the
 * TypeScript compiler APIs for incremental program creation.
 *
 * 使用 TypeScript 编译器 API 进行增量程序创建，使用包含特定更改的新实例更新 `ts.Program` 实例。
 *
 */
export class TsCreateProgramDriver implements ProgramDriver {
  /**
   * A map of source file paths to replacement `ts.SourceFile`s for those paths.
   *
   * 源文件路径到这些路径的替换 `ts.SourceFile` 的映射。
   *
   * Effectively, this tracks the delta between the user's program (represented by the
   * `originalHost`) and the template type-checking program being managed.
   *
   * 实际上，这会跟踪用户程序（由 `originalHost` 表示）与正在管理的模板类型检查程序之间的变化。
   *
   */
  private sfMap = new Map<string, ts.SourceFile>();

  private program: ts.Program = this.originalProgram;

  constructor(
      private originalProgram: ts.Program, private originalHost: ts.CompilerHost,
      private options: ts.CompilerOptions, private shimExtensionPrefixes: string[]) {}

  readonly supportsInlineOperations = true;

  getProgram(): ts.Program {
    return this.program;
  }

  updateFiles(contents: Map<AbsoluteFsPath, FileUpdate>, updateMode: UpdateMode): void {
    if (contents.size === 0) {
      // No changes have been requested. Is it safe to skip updating entirely?
      // If UpdateMode is Incremental, then yes. If UpdateMode is Complete, then it's safe to skip
      // only if there are no active changes already (that would be cleared by the update).

      if (updateMode !== UpdateMode.Complete || this.sfMap.size === 0) {
        // No changes would be made to the `ts.Program` anyway, so it's safe to do nothing here.
        return;
      }
    }

    if (updateMode === UpdateMode.Complete) {
      this.sfMap.clear();
    }

    for (const [filePath, {newText, originalFile}] of contents.entries()) {
      const sf = ts.createSourceFile(filePath, newText, ts.ScriptTarget.Latest, true);
      if (originalFile !== null) {
        (sf as MaybeSourceFileWithOriginalFile)[NgOriginalFile] = originalFile;
      }
      this.sfMap.set(filePath, sf);
    }

    const host = new UpdatedProgramHost(
        this.sfMap, this.originalProgram, this.originalHost, this.shimExtensionPrefixes);
    const oldProgram = this.program;

    // Retag the old program's `ts.SourceFile`s with shim tags, to allow TypeScript to reuse the
    // most data.
    retagAllTsFiles(oldProgram);

    this.program = ts.createProgram({
      host,
      rootNames: this.program.getRootFileNames(),
      options: this.options,
      oldProgram,
    });
    host.postProgramCreationCleanup();

    // And untag them afterwards. We explicitly untag both programs here, because the oldProgram
    // may still be used for emit and needs to not contain tags.
    untagAllTsFiles(this.program);
    untagAllTsFiles(oldProgram);
  }
}

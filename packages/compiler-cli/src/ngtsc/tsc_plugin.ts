/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {CompilationTicket, freshCompilationTicket, incrementalFromStateTicket, NgCompiler, NgCompilerHost} from './core';
import {NgCompilerOptions, UnifiedModulesHost} from './core/api';
import {AbsoluteFsPath, NodeJSFileSystem, resolve, setFileSystem} from './file_system';
import {PatchedProgramIncrementalBuildStrategy} from './incremental';
import {ActivePerfRecorder, PerfPhase} from './perf';
import {TsCreateProgramDriver} from './program_driver';
import {untagAllTsFiles} from './shims';
import {OptimizeFor} from './typecheck/api';

// The following is needed to fix a the chicken-and-egg issue where the sync (into g3) script will
// refuse to accept this file unless the following string appears:
// import * as plugin from '@bazel/concatjs/internal/tsc_wrapped/plugin_api';

/**
 * A `ts.CompilerHost` which also returns a list of input files, out of which the `ts.Program`
 * should be created.
 *
 * 一个 `ts.CompilerHost` ，它还返回输入文件的列表，应该从中创建 `ts.Program` 。
 *
 * Currently mirrored from @bazel/concatjs/internal/tsc_wrapped/plugin_api (with the naming of
 * `fileNameToModuleName` corrected).
 *
 * 当前从 @bazel/concatjs/internal/tsc_wrapped/plugin_api 镜像（更正了 `fileNameToModuleName`
 * 的命名）。
 *
 */
interface PluginCompilerHost extends ts.CompilerHost, Partial<UnifiedModulesHost> {
  readonly inputFiles: ReadonlyArray<string>;
}

/**
 * Mirrors the plugin interface from tsc_wrapped which is currently under active development. To
 * enable progress to be made in parallel, the upstream interface isn't implemented directly.
 * Instead, `TscPlugin` here is structurally assignable to what tsc_wrapped expects.
 *
 * 镜像当前正在积极开发的 tsc_wrapped
 * 的插件接口。为了允许并行取得进展，不会直接实现上游接口。相反，这里的 `TscPlugin`
 * 在结构上可以分配给 tsc_wrapped 所期望的。
 *
 */
interface TscPlugin {
  readonly name: string;

  wrapHost(
      host: ts.CompilerHost&Partial<UnifiedModulesHost>, inputFiles: ReadonlyArray<string>,
      options: ts.CompilerOptions): PluginCompilerHost;

  setupCompilation(program: ts.Program, oldProgram?: ts.Program): {
    ignoreForDiagnostics: Set<ts.SourceFile>,
    ignoreForEmit: Set<ts.SourceFile>,
  };

  getDiagnostics(file?: ts.SourceFile): ts.Diagnostic[];

  getOptionDiagnostics(): ts.Diagnostic[];

  getNextProgram(): ts.Program;

  createTransformers(): ts.CustomTransformers;
}

/**
 * A plugin for `tsc_wrapped` which allows Angular compilation from a plain `ts_library`.
 *
 * `tsc_wrapped` 的插件，允许从普通的 `ts_library` 进行 Angular 编译。
 *
 */
export class NgTscPlugin implements TscPlugin {
  name = 'ngtsc';

  private options: NgCompilerOptions|null = null;
  private host: NgCompilerHost|null = null;
  private _compiler: NgCompiler|null = null;

  get compiler(): NgCompiler {
    if (this._compiler === null) {
      throw new Error('Lifecycle error: setupCompilation() must be called first.');
    }
    return this._compiler;
  }

  constructor(private ngOptions: {}) {
    setFileSystem(new NodeJSFileSystem());
  }

  wrapHost(
      host: ts.CompilerHost&Partial<UnifiedModulesHost>, inputFiles: readonly string[],
      options: ts.CompilerOptions): PluginCompilerHost {
    // TODO(alxhub): Eventually the `wrapHost()` API will accept the old `ts.Program` (if one is
    // available). When it does, its `ts.SourceFile`s need to be re-tagged to enable proper
    // incremental compilation.
    this.options = {...this.ngOptions, ...options} as NgCompilerOptions;
    this.host = NgCompilerHost.wrap(host, inputFiles, this.options, /* oldProgram */ null);
    return this.host;
  }

  setupCompilation(program: ts.Program, oldProgram?: ts.Program): {
    ignoreForDiagnostics: Set<ts.SourceFile>,
    ignoreForEmit: Set<ts.SourceFile>,
  } {
    // TODO(alxhub): we provide a `PerfRecorder` to the compiler, but because we're not driving the
    // compilation, the information captured within it is incomplete, and may not include timings
    // for phases such as emit.
    //
    // Additionally, nothing actually captures the perf results here, so recording stats at all is
    // somewhat moot for now :)
    const perfRecorder = ActivePerfRecorder.zeroedToNow();
    if (this.host === null || this.options === null) {
      throw new Error('Lifecycle error: setupCompilation() before wrapHost().');
    }
    this.host.postProgramCreationCleanup();
    untagAllTsFiles(program);
    const programDriver = new TsCreateProgramDriver(
        program, this.host, this.options, this.host.shimExtensionPrefixes);
    const strategy = new PatchedProgramIncrementalBuildStrategy();
    const oldState = oldProgram !== undefined ? strategy.getIncrementalState(oldProgram) : null;
    let ticket: CompilationTicket;

    const modifiedResourceFiles = new Set<AbsoluteFsPath>();
    if (this.host.getModifiedResourceFiles !== undefined) {
      for (const resourceFile of this.host.getModifiedResourceFiles() ?? []) {
        modifiedResourceFiles.add(resolve(resourceFile));
      }
    }

    if (oldProgram === undefined || oldState === null) {
      ticket = freshCompilationTicket(
          program, this.options, strategy, programDriver, perfRecorder,
          /* enableTemplateTypeChecker */ false, /* usePoisonedData */ false);
    } else {
      strategy.toNextBuildStrategy().getIncrementalState(oldProgram);
      ticket = incrementalFromStateTicket(
          oldProgram, oldState, program, this.options, strategy, programDriver,
          modifiedResourceFiles, perfRecorder, false, false);
    }
    this._compiler = NgCompiler.fromTicket(ticket, this.host);
    return {
      ignoreForDiagnostics: this._compiler.ignoreForDiagnostics,
      ignoreForEmit: this._compiler.ignoreForEmit,
    };
  }

  getDiagnostics(file?: ts.SourceFile): ts.Diagnostic[] {
    if (file === undefined) {
      return this.compiler.getDiagnostics();
    }
    return this.compiler.getDiagnosticsForFile(file, OptimizeFor.WholeProgram);
  }

  getOptionDiagnostics(): ts.Diagnostic[] {
    return this.compiler.getOptionDiagnostics();
  }

  getNextProgram(): ts.Program {
    return this.compiler.getCurrentProgram();
  }

  createTransformers(): ts.CustomTransformers {
    // The plugin consumer doesn't know about our perf tracing system, so we consider the emit phase
    // as beginning now.
    this.compiler.perfRecorder.phase(PerfPhase.TypeScriptEmit);
    return this.compiler.prepareEmit().transformers;
  }
}

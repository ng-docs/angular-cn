/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CompilationTicket, freshCompilationTicket, incrementalFromCompilerTicket, NgCompiler, resourceChangeTicket} from '@angular/compiler-cli/src/ngtsc/core';
import {NgCompilerOptions} from '@angular/compiler-cli/src/ngtsc/core/api';
import {AbsoluteFsPath, resolve} from '@angular/compiler-cli/src/ngtsc/file_system';
import {TrackedIncrementalBuildStrategy} from '@angular/compiler-cli/src/ngtsc/incremental';
import {ProgramDriver} from '@angular/compiler-cli/src/ngtsc/program_driver';

import {LanguageServiceAdapter} from './adapters';

/**
 * Manages the `NgCompiler` instance which backs the language service, updating or replacing it as
 * needed to produce an up-to-date understanding of the current program.
 *
 * 管理支持语言服务的 `NgCompiler` 实例，根据需要更新或替换它，以产生对当前程序的最新了解。
 *
 * TODO(alxhub): currently the options used for the compiler are specified at `CompilerFactory`
 * construction, and are not changable. In a real project, users can update `tsconfig.json`. We need
 * to properly handle a change in the compiler options, either by having an API to update the
 * `CompilerFactory` to use new options, or by replacing it entirely.
 *
 * TODO(alxhub) ：当前用于编译器的选项是在 `CompilerFactory`
 * 构造时指定的，并且不可更改。在真实项目中，用户可以更新 `tsconfig.json`
 * 。我们需要正确处理编译器选项的更改，方法是让 API 更新 `CompilerFactory`
 * 以使用新选项，或完全替换它。
 *
 */
export class CompilerFactory {
  private readonly incrementalStrategy = new TrackedIncrementalBuildStrategy();
  private compiler: NgCompiler|null = null;

  constructor(
      private readonly adapter: LanguageServiceAdapter,
      private readonly programStrategy: ProgramDriver,
      private readonly options: NgCompilerOptions,
  ) {}

  getOrCreate(): NgCompiler {
    const program = this.programStrategy.getProgram();
    const modifiedResourceFiles = new Set<AbsoluteFsPath>();
    for (const fileName of this.adapter.getModifiedResourceFiles() ?? []) {
      modifiedResourceFiles.add(resolve(fileName));
    }

    if (this.compiler !== null && program === this.compiler.getCurrentProgram()) {
      if (modifiedResourceFiles.size > 0) {
        // Only resource files have changed since the last NgCompiler was created.
        const ticket = resourceChangeTicket(this.compiler, modifiedResourceFiles);
        this.compiler = NgCompiler.fromTicket(ticket, this.adapter);
      } else {
        // The previous NgCompiler is being reused, but we still want to reset its performance
        // tracker to capture only the operations that are needed to service the current request.
        this.compiler.perfRecorder.reset();
      }

      return this.compiler;
    }

    let ticket: CompilationTicket;
    if (this.compiler === null) {
      ticket = freshCompilationTicket(
          program, this.options, this.incrementalStrategy, this.programStrategy,
          /* perfRecorder */ null, true, true);
    } else {
      ticket = incrementalFromCompilerTicket(
          this.compiler, program, this.incrementalStrategy, this.programStrategy,
          modifiedResourceFiles, /* perfRecorder */ null);
    }
    this.compiler = NgCompiler.fromTicket(ticket, this.adapter);
    return this.compiler;
  }
}

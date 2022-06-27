/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {AbsoluteFsPath} from '../file_system';

/**
 * Interface of the incremental build engine.
 *
 * 增量构建引擎的接口。
 *
 * `AnalysisT` is a generic type representing a unit of work. This is generic to avoid a cyclic
 * dependency between the incremental engine API definition and its consumer(s).
 * `FileTypeCheckDataT` is a generic type representing template type-checking data for a particular
 * input file, which is generic for the same reason.
 *
 * `AnalysisT` 是表示工作单元的泛型类型。这是通用的，可以避免增量引擎 API
 * 定义及其使用者之间的循环依赖。 `FileTypeCheckDataT`
 * 是一种泛型类型，表示特定输入文件的模板类型检查数据，出于相同的原因，它是通用的。
 *
 */
export interface IncrementalBuild<AnalysisT, FileTypeCheckDataT> {
  /**
   * Retrieve the prior analysis work, if any, done for the given source file.
   *
   * 检索为给定源文件完成的先前的分析工作（如果有）。
   *
   */
  priorAnalysisFor(sf: ts.SourceFile): AnalysisT[]|null;

  /**
   * Retrieve the prior type-checking work, if any, that's been done for the given source file.
   *
   * 检索对给定源文件完成的先前的类型检查工作（如果有）。
   *
   */
  priorTypeCheckingResultsFor(fileSf: ts.SourceFile): FileTypeCheckDataT|null;

  /**
   * Reports that template type-checking has completed successfully, with a map of type-checking
   * data for each user file which can be reused in a future incremental iteration.
   *
   * 报告模板类型检查已成功完成，以及每个用户文件的类型检查数据映射表，可以在未来的增量迭代中重用。
   *
   */
  recordSuccessfulTypeCheck(results: Map<AbsoluteFsPath, FileTypeCheckDataT>): void;
}

/**
 * Tracks dependencies between source files or resources in the application.
 *
 * 跟踪应用程序中源文件或资源之间的依赖关系。
 *
 */
export interface DependencyTracker<T extends {fileName: string} = ts.SourceFile> {
  /**
   * Record that the file `from` depends on the file `on`.
   *
   * 记录 `from` 的文件 `on` .
   *
   */
  addDependency(from: T, on: T): void;

  /**
   * Record that the file `from` depends on the resource file `on`.
   *
   * 记录 `from` 的文件 `on` .
   *
   */
  addResourceDependency(from: T, on: AbsoluteFsPath): void;

  /**
   * Record that the given file contains unresolvable dependencies.
   *
   * 记录给定文件包含无法解析的依赖项。
   *
   * In practice, this means that the dependency graph cannot provide insight into the effects of
   * future changes on that file.
   *
   * 在实践中，这意味着依赖图无法提供对未来更改对该文件的影响的深入了解。
   *
   */
  recordDependencyAnalysisFailure(file: T): void;
}

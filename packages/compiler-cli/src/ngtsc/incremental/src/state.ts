/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {AbsoluteFsPath} from '../../file_system';
import {ClassRecord} from '../../transform';
import {FileTypeCheckingData} from '../../typecheck/src/checker';
import {SemanticDepGraph} from '../semantic_graph';

import {FileDependencyGraph} from './dependency_tracking';

/**
 * Discriminant of the `IncrementalState` union.
 *
 * `IncrementalState` 联盟的判别式。
 *
 */
export enum IncrementalStateKind {
  Fresh,
  Delta,
  Analyzed,
}

/**
 * Placeholder state for a fresh compilation that has never been successfully analyzed.
 *
 * 从未成功分析的全新编译的占位符状态。
 *
 */
export interface FreshIncrementalState {
  kind: IncrementalStateKind.Fresh;
}

/**
 * State captured from a compilation that completed analysis successfully, that can serve as a
 * starting point for a future incremental build.
 *
 * 从成功完成分析的编译中捕获的状态，可以作为未来增量构建的起点。
 *
 */
export interface AnalyzedIncrementalState {
  kind: IncrementalStateKind.Analyzed;

  /**
   * Dependency graph extracted from the build, to be used to determine the logical impact of
   * physical file changes.
   *
   * 从构建中提取的依赖图，用于确定物理文件更改的逻辑影响。
   *
   */
  depGraph: FileDependencyGraph;

  /**
   * The semantic dependency graph from the build.
   *
   * 构建中的语义依赖图。
   *
   * This is used to perform in-depth comparison of Angular decorated classes, to determine
   * which files have to be re-emitted and/or re-type-checked.
   *
   * 这用于对 Angular 装饰类进行深入比较，以确定哪些文件必须重新发出和/或重新类型检查。
   *
   */
  semanticDepGraph: SemanticDepGraph;

  /**
   * The analysis data from a prior compilation. This stores the trait information for all source
   * files that was present in a prior compilation.
   *
   * 来自先前编译的分析数据。这存储了先前编译中存在的所有源文件的特征信息。
   *
   */
  priorAnalysis: Map<ts.SourceFile, ClassRecord[]>;

  /**
   * All generated template type-checking files produced as part of this compilation, or `null` if
   * type-checking was not (yet) performed.
   *
   * 作为此编译的一部分生成的所有生成的模板类型检查文件，如果（尚未）执行类型检查，则为 `null` 。
   *
   */
  typeCheckResults: Map<AbsoluteFsPath, FileTypeCheckingData>|null;

  /**
   * Cumulative set of source file paths which were definitively emitted by this compilation or
   * carried forward from a prior one.
   *
   * 由此编译明确发出或从前一个编译结转的源文件路径的累积集。
   *
   */
  emitted: Set<AbsoluteFsPath>;

  /**
   * Map of source file paths to the version of this file as seen in the compilation.
   *
   * 在编译中看到的源文件路径到此文件版本的映射。
   *
   */
  versions: Map<AbsoluteFsPath, string>|null;
}

/**
 * Incremental state for a compilation that has not been successfully analyzed, but that can be
 * based on a previous compilation which was.
 *
 * 尚未成功分析的编译的增量状态，但这可以基于以前的编译。
 *
 * This is the state produced by an incremeental compilation until its own analysis succeeds. If
 * analysis fails, this state carries forward information about which files have changed since the
 * last successful build (the `lastAnalyzedState`), so that the next incremental build can consider
 * the total delta between the `lastAnalyzedState` and the current program in its incremental
 * analysis.
 *
 * 这是增量编译在其自己的分析成功之前产生的状态。如果分析失败，此状态会携带有关自上次成功构建 (
 * `lastAnalyzedState` ) 以来哪些文件已更改的信息，以便下一个增量构建可以在其增量分析中考虑
 * `lastAnalyzedState` 和当前程序之间的总变化。
 *
 */
export interface DeltaIncrementalState {
  kind: IncrementalStateKind.Delta;

  /**
   * If available, the `AnalyzedIncrementalState` for the most recent ancestor of the current
   * program which was successfully analyzed.
   *
   * 如果可用，则为已成功 `AnalyzedIncrementalState` 的当前程序的最近祖先的
   * AnalyzerdIncrementalState。
   *
   */
  lastAnalyzedState: AnalyzedIncrementalState;

  /**
   * Set of file paths which have changed since the `lastAnalyzedState` compilation.
   *
   * 自 `lastAnalyzedState` 编译以来已更改的文件路径集。
   *
   */
  physicallyChangedTsFiles: Set<AbsoluteFsPath>;

  /**
   * Set of resource file paths which have changed since the `lastAnalyzedState` compilation.
   *
   * 自 `lastAnalyzedState` 编译以来已更改的资源文件路径集。
   *
   */
  changedResourceFiles: Set<AbsoluteFsPath>;
}

/**
 * State produced by a compilation that's usable as the starting point for a subsequent compilation.
 *
 * 编译生成的状态，可作为后续编译的起点。
 *
 * Discriminated by the `IncrementalStateKind` enum.
 *
 * 由 `IncrementalStateKind` 枚举区分。
 *
 */
export type IncrementalState = AnalyzedIncrementalState|DeltaIncrementalState|FreshIncrementalState;

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {ImportGraph} from './imports';

/**
 * Analyzes a `ts.Program` for cycles.
 *
 * 分析 `ts.Program` 的周期。
 *
 */
export class CycleAnalyzer {
  /**
   * Cycle detection is requested with the same `from` source file for all used directives and pipes
   * within a component, which makes it beneficial to cache the results as long as the `from` source
   * file has not changed. This avoids visiting the import graph that is reachable from multiple
   * directives/pipes more than once.
   *
   * 对于组件中所有使用的指令和管道，都会使用相同 `from` 源文件请求周期检测，这使得只要 `from`
   * 源文件没有更改，就可以缓存结果。这避免了访问可从多个指令/管道多次访问的导入图。
   *
   */
  private cachedResults: CycleResults|null = null;

  constructor(private importGraph: ImportGraph) {}

  /**
   * Check for a cycle to be created in the `ts.Program` by adding an import between `from` and
   * `to`.
   *
   * 通过在 `from` 和 `to` 之间添加导入来检查要在 `ts.Program` 中创建的循环。
   *
   * @returns
   *
   * a `Cycle` object if an import between `from` and `to` would create a cycle; `null`
   *     otherwise.
   *
   * 如果 `from` 和 `to` 之间的导入将创建一个循环，则为 `Cycle` 对象；否则 `null` 。
   *
   */
  wouldCreateCycle(from: ts.SourceFile, to: ts.SourceFile): Cycle|null {
    // Try to reuse the cached results as long as the `from` source file is the same.
    if (this.cachedResults === null || this.cachedResults.from !== from) {
      this.cachedResults = new CycleResults(from, this.importGraph);
    }

    // Import of 'from' -> 'to' is illegal if an edge 'to' -> 'from' already exists.
    return this.cachedResults.wouldBeCyclic(to) ? new Cycle(this.importGraph, from, to) : null;
  }

  /**
   * Record a synthetic import from `from` to `to`.
   *
   * 记录从 `from` to `to` 的合成导入。
   *
   * This is an import that doesn't exist in the `ts.Program` but will be considered as part of the
   * import graph for cycle creation.
   *
   * 这是 `ts.Program` 中不存在的导入，但将被视为创建周期的导入图的一部分。
   *
   */
  recordSyntheticImport(from: ts.SourceFile, to: ts.SourceFile): void {
    this.cachedResults = null;
    this.importGraph.addSyntheticImport(from, to);
  }
}

const NgCyclicResult = Symbol('NgCyclicResult');
type CyclicResultMarker = {
  __brand: 'CyclicResultMarker';
};
type CyclicSourceFile = ts.SourceFile&{[NgCyclicResult]?: CyclicResultMarker};

/**
 * Stores the results of cycle detection in a memory efficient manner. A symbol is attached to
 * source files that indicate what the cyclic analysis result is, as indicated by two markers that
 * are unique to this instance. This alleviates memory pressure in large import graphs, as each
 * execution is able to store its results in the same memory location (i.e. in the symbol
 * on the source file) as earlier executions.
 *
 * 以内存高效的方式存储周期检测的结果。源文件上会附加一个符号，以表明循环分析结果是什么，由此实例唯一的两个标记表示。这减轻了大型导入图中的内存压力，因为每次执行都能够将其结果存储在与早期执行相同的内存位置（即源文件上的符号中）。
 *
 */
class CycleResults {
  private readonly cyclic = {} as CyclicResultMarker;
  private readonly acyclic = {} as CyclicResultMarker;

  constructor(readonly from: ts.SourceFile, private importGraph: ImportGraph) {}

  wouldBeCyclic(sf: ts.SourceFile): boolean {
    const cached = this.getCachedResult(sf);
    if (cached !== null) {
      // The result for this source file has already been computed, so return its result.
      return cached;
    }

    if (sf === this.from) {
      // We have reached the source file that we want to create an import from, which means that
      // doing so would create a cycle.
      return true;
    }

    // Assume for now that the file will be acyclic; this prevents infinite recursion in the case
    // that `sf` is visited again as part of an existing cycle in the graph.
    this.markAcyclic(sf);

    const imports = this.importGraph.importsOf(sf);
    for (const imported of imports) {
      if (this.wouldBeCyclic(imported)) {
        this.markCyclic(sf);
        return true;
      }
    }
    return false;
  }

  /**
   * Returns whether the source file is already known to be cyclic, or `null` if the result is not
   * yet known.
   *
   * 返回源文件是否已知是循环的，如果结果未知，则返回 `null` 。
   *
   */
  private getCachedResult(sf: CyclicSourceFile): boolean|null {
    const result = sf[NgCyclicResult];
    if (result === this.cyclic) {
      return true;
    } else if (result === this.acyclic) {
      return false;
    } else {
      // Either the symbol is missing or its value does not correspond with one of the current
      // result markers. As such, the result is unknown.
      return null;
    }
  }

  private markCyclic(sf: CyclicSourceFile): void {
    sf[NgCyclicResult] = this.cyclic;
  }

  private markAcyclic(sf: CyclicSourceFile): void {
    sf[NgCyclicResult] = this.acyclic;
  }
}

/**
 * Represents an import cycle between `from` and `to` in the program.
 *
 * 表示程序中 `from` 和 `to` 之间的导入周期。
 *
 * This class allows us to do the work to compute the cyclic path between `from` and `to` only if
 * needed.
 *
 * 此类允许我们仅在需要时才计算 `from` 和 `to` 之间的循环路径。
 *
 */
export class Cycle {
  constructor(
      private importGraph: ImportGraph, readonly from: ts.SourceFile, readonly to: ts.SourceFile) {}

  /**
   * Compute an array of source-files that illustrates the cyclic path between `from` and `to`.
   *
   * 计算一个源文件数组，以说明 `from` 和 `to` 之间的循环路径。
   *
   * Note that a `Cycle` will not be created unless a path is available between `to` and `from`,
   * so `findPath()` will never return `null`.
   *
   * 请注意，除非 `to` 和 `from` 之间有路径，否则不会创建 `Cycle` ，因此 `findPath()` 将永远不会返回
   * `null` 。
   *
   */
  getPath(): ts.SourceFile[] {
    return [this.from, ...this.importGraph.findPath(this.to, this.from)!];
  }
}


/**
 * What to do if a cycle is detected.
 *
 * 如果检测到周期该怎么办。
 *
 */
export const enum CycleHandlingStrategy {
  /**
   * Add "remote scoping" code to avoid creating a cycle.
   *
   * 添加“远程范围”代码以避免创建循环。
   *
   */
  UseRemoteScoping,
  /**
   * Fail the compilation with an error.
   *
   * 编译失败并出现错误。
   *
   */
  Error,
}

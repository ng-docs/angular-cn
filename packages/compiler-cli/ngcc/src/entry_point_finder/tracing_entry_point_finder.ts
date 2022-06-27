/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {AbsoluteFsPath, PathManipulation, ReadonlyFileSystem} from '../../../src/ngtsc/file_system';
import {Logger} from '../../../src/ngtsc/logging';
import {EntryPointWithDependencies} from '../dependencies/dependency_host';
import {DependencyResolver, SortedEntryPointsInfo} from '../dependencies/dependency_resolver';
import {NgccConfiguration} from '../packages/configuration';
import {PathMappings} from '../path_mappings';

import {EntryPointFinder} from './interface';
import {getBasePaths} from './utils';

/**
 * An EntryPointFinder that starts from a set of initial files and only returns entry-points that
 * are dependencies of these files.
 *
 * 一个 EntryPointFinder，它从一组初始文件开始，并且仅返回作为这些文件的依赖项的入口点。
 *
 * This is faster than processing all entry-points in the entire file-system, and is used primarily
 * by the CLI integration.
 *
 * 这比处理整个文件系统中的所有入口点快，并且主要供 CLI 集成使用。
 *
 * There are two concrete implementations of this class.
 *
 * 此类有两个具体实现。
 *
 * * `TargetEntryPointFinder` - is given a single entry-point as the initial entry-point. This can
 *   be used in the synchronous CLI integration where the build tool has identified an external
 *   import to one of the source files being built.
 *
 *   `TargetEntryPointFinder` - 被给予单个入口点作为初始入口点。这可用于同步 CLI
 * 集成，其中构建工具已识别到对正在构建的源文件之一的外部导入。
 *
 * * `ProgramBasedEntryPointFinder` - computes the initial entry-points from the source files
 *   computed from a `tsconfig.json` file. This can be used in the asynchronous CLI integration
 *   where the `tsconfig.json` to be used to do the build is known.
 *
 *   `ProgramBasedEntryPointFinder` - 根据从 `tsconfig.json`
 * 文件计算的源文件计算初始入口点。这可以用在已知用于进行构建的 `tsconfig.json` 的异步 CLI 集成中。
 *
 */
export abstract class TracingEntryPointFinder implements EntryPointFinder {
  private basePaths: AbsoluteFsPath[]|null = null;

  constructor(
      protected fs: ReadonlyFileSystem, protected config: NgccConfiguration,
      protected logger: Logger, protected resolver: DependencyResolver,
      protected basePath: AbsoluteFsPath, protected pathMappings: PathMappings|undefined) {}

  /**
   * Search for Angular package entry-points.
   *
   * 搜索 Angular 包入口点。
   *
   */
  findEntryPoints(): SortedEntryPointsInfo {
    const unsortedEntryPoints = new Map<AbsoluteFsPath, EntryPointWithDependencies>();
    const unprocessedPaths = this.getInitialEntryPointPaths();
    while (unprocessedPaths.length > 0) {
      const path = unprocessedPaths.shift()!;
      const entryPointWithDeps = this.getEntryPointWithDeps(path);
      if (entryPointWithDeps === null) {
        continue;
      }
      unsortedEntryPoints.set(entryPointWithDeps.entryPoint.path, entryPointWithDeps);
      entryPointWithDeps.depInfo.dependencies.forEach(dep => {
        if (!unsortedEntryPoints.has(dep)) {
          unprocessedPaths.push(dep);
        }
      });
    }
    return this.resolver.sortEntryPointsByDependency(Array.from(unsortedEntryPoints.values()));
  }


  /**
   * Return an array of entry-point paths from which to start the trace.
   *
   * 返回要开始跟踪的入口点路径数组。
   *
   */
  protected abstract getInitialEntryPointPaths(): AbsoluteFsPath[];

  /**
   * For the given `entryPointPath`, compute, or retrieve, the entry-point information, including
   * paths to other entry-points that this entry-point depends upon.
   *
   * 对于给定的 `entryPointPath` ，计算或检索入口点信息，包括到此入口点依赖的其他入口点的路径。
   *
   * @param entryPointPath the path to the entry-point whose information and dependencies are to be
   *     retrieved or computed.
   *
   * 要检索或计算其信息和依赖项的入口点的路径。
   *
   * @returns
   *
   * the entry-point and its dependencies or `null` if the entry-point is not compiled by
   *     Angular or cannot be determined.
   *
   * 入口点及其依赖项；如果入口点不是由 Angular 编译或无法确定，则为 `null` 。
   *
   */
  protected abstract getEntryPointWithDeps(entryPointPath: AbsoluteFsPath):
      EntryPointWithDependencies|null;


  /**
   * Parse the path-mappings to compute the base-paths that need to be considered when finding
   * entry-points.
   *
   * 解析路径映射以计算查找入口点时需要考虑的基本路径。
   *
   * This processing can be time-consuming if the path-mappings are complex or extensive.
   * So the result is cached locally once computed.
   *
   * 如果路径映射复杂或广泛，此处理可能会很耗时。因此，结果一旦计算就会在本地缓存。
   *
   */
  protected getBasePaths() {
    if (this.basePaths === null) {
      this.basePaths = getBasePaths(this.logger, this.basePath, this.pathMappings);
    }
    return this.basePaths;
  }
}

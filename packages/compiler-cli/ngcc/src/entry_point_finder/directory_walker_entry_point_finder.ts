/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {AbsoluteFsPath} from '../../../src/ngtsc/file_system';
import {Logger} from '../../../src/ngtsc/logging';
import {EntryPointWithDependencies} from '../dependencies/dependency_host';
import {DependencyResolver, SortedEntryPointsInfo} from '../dependencies/dependency_resolver';
import {EntryPointManifest} from '../packages/entry_point_manifest';
import {PathMappings} from '../path_mappings';

import {EntryPointCollector} from './entry_point_collector';
import {EntryPointFinder} from './interface';
import {getBasePaths, trackDuration} from './utils';

/**
 * An EntryPointFinder that searches for all entry-points that can be found given a `basePath` and
 * `pathMappings`.
 *
 * 一个 EntryPointFinder ，它搜索给定 `basePath` 和 `pathMappings` 可以找到的所有入口点。
 *
 */
export class DirectoryWalkerEntryPointFinder implements EntryPointFinder {
  private basePaths = getBasePaths(this.logger, this.sourceDirectory, this.pathMappings);
  constructor(
      private logger: Logger, private resolver: DependencyResolver,
      private entryPointCollector: EntryPointCollector,
      private entryPointManifest: EntryPointManifest, private sourceDirectory: AbsoluteFsPath,
      private pathMappings: PathMappings|undefined) {}

  /**
   * Search the `sourceDirectory`, and sub-directories, using `pathMappings` as necessary, to find
   * all package entry-points.
   *
   * 搜索 `sourceDirectory` 和子目录，必要时使用 `pathMappings` ，以查找所有包入口点。
   *
   */
  findEntryPoints(): SortedEntryPointsInfo {
    const unsortedEntryPoints: EntryPointWithDependencies[] = [];
    for (const basePath of this.basePaths) {
      const entryPoints = this.entryPointManifest.readEntryPointsUsingManifest(basePath) ||
          this.walkBasePathForPackages(basePath);
      entryPoints.forEach(e => unsortedEntryPoints.push(e));
    }
    return this.resolver.sortEntryPointsByDependency(unsortedEntryPoints);
  }

  /**
   * Search the `basePath` for possible Angular packages and entry-points.
   *
   * 在 `basePath` 中搜索可能的 Angular 包和入口点。
   *
   * @param basePath The path at which to start the search.
   *
   * 开始搜索的路径。
   *
   * @returns
   *
   * an array of `EntryPoint`s that were found within `basePath`.
   *
   * 在 `basePath` 中找到的 `EntryPoint` 数组。
   *
   */
  walkBasePathForPackages(basePath: AbsoluteFsPath): EntryPointWithDependencies[] {
    this.logger.debug(
        `No manifest found for ${basePath} so walking the directories for entry-points.`);
    const entryPoints = trackDuration(
        () => this.entryPointCollector.walkDirectoryForPackages(basePath),
        duration => this.logger.debug(`Walking ${basePath} for entry-points took ${duration}s.`));
    this.entryPointManifest.writeEntryPointManifest(basePath, entryPoints);
    return entryPoints;
  }
}

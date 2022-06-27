/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {AbsoluteFsPath, ReadonlyFileSystem} from '../../../src/ngtsc/file_system';
import {Logger} from '../../../src/ngtsc/logging';
import {ParsedConfiguration} from '../../../src/perform_compile';
import {createDependencyInfo, EntryPointWithDependencies} from '../dependencies/dependency_host';
import {DependencyResolver} from '../dependencies/dependency_resolver';
import {EsmDependencyHost} from '../dependencies/esm_dependency_host';
import {ModuleResolver} from '../dependencies/module_resolver';
import {NgccConfiguration} from '../packages/configuration';
import {EntryPointManifest} from '../packages/entry_point_manifest';
import {getPathMappingsFromTsConfig} from '../path_mappings';

import {EntryPointCollector} from './entry_point_collector';
import {TracingEntryPointFinder} from './tracing_entry_point_finder';
import {trackDuration} from './utils';

/**
 * An EntryPointFinder that starts from the files in the program defined by the given tsconfig.json
 * and only returns entry-points that are dependencies of these files.
 *
 * 一个 EntryPointFinder ，从给定 tsconfig.json
 * 定义的程序中的文件启动，并且仅返回作为这些文件的依赖项的入口点。
 *
 * This is faster than searching the entire file-system for all the entry-points,
 * and is used primarily by the CLI integration.
 *
 * 这比在整个文件系统中搜索所有入口点快，并且主要供 CLI 集成使用。
 *
 */
export class ProgramBasedEntryPointFinder extends TracingEntryPointFinder {
  private entryPointsWithDependencies: Map<AbsoluteFsPath, EntryPointWithDependencies>|null = null;

  constructor(
      fs: ReadonlyFileSystem, config: NgccConfiguration, logger: Logger,
      resolver: DependencyResolver, private entryPointCollector: EntryPointCollector,
      private entryPointManifest: EntryPointManifest, basePath: AbsoluteFsPath,
      private tsConfig: ParsedConfiguration, projectPath: AbsoluteFsPath) {
    super(
        fs, config, logger, resolver, basePath,
        getPathMappingsFromTsConfig(fs, tsConfig, projectPath));
  }

  /**
   * Return an array containing the external import paths that were extracted from the source-files
   * of the program defined by the tsconfig.json.
   *
   * 返回一个数组，其中包含从 tsconfig.json 定义的程序的 source-files 中提取的外部导入路径。
   *
   */
  protected override getInitialEntryPointPaths(): AbsoluteFsPath[] {
    const moduleResolver = new ModuleResolver(this.fs, this.pathMappings, ['', '.ts', '/index.ts']);
    const host = new EsmDependencyHost(this.fs, moduleResolver);
    const dependencies = createDependencyInfo();
    const rootFiles = this.tsConfig.rootNames.map(rootName => this.fs.resolve(rootName));
    this.logger.debug(
        `Using the program from ${this.tsConfig.project} to seed the entry-point finding.`);
    this.logger.debug(
        `Collecting dependencies from the following files:` + rootFiles.map(file => `\n- ${file}`));
    host.collectDependenciesInFiles(rootFiles, dependencies);
    return Array.from(dependencies.dependencies);
  }

  /**
   * For the given `entryPointPath`, compute, or retrieve, the entry-point information, including
   * paths to other entry-points that this entry-point depends upon.
   *
   * 对于给定的 `entryPointPath` ，计算或检索入口点信息，包括到此入口点依赖的其他入口点的路径。
   *
   * In this entry-point finder, we use the `EntryPointManifest` to avoid computing each
   * entry-point's dependencies in the case that this had been done previously.
   *
   * 在此入口点查找器中，我们使用 `EntryPointManifest`
   * 来避免计算每个入口点的依赖项，因为这以前已经完成。
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
  protected override getEntryPointWithDeps(entryPointPath: AbsoluteFsPath):
      EntryPointWithDependencies|null {
    const entryPoints = this.findOrLoadEntryPoints();
    if (!entryPoints.has(entryPointPath)) {
      return null;
    }
    const entryPointWithDeps = entryPoints.get(entryPointPath)!;
    if (!entryPointWithDeps.entryPoint.compiledByAngular) {
      return null;
    }
    return entryPointWithDeps;
  }

  /**
   * Walk the base paths looking for entry-points or load this information from an entry-point
   * manifest, if available.
   *
   * 走基本路径以查找入口点，或从入口点清单（如果可用）加载此信息。
   *
   */
  private findOrLoadEntryPoints(): Map<AbsoluteFsPath, EntryPointWithDependencies> {
    if (this.entryPointsWithDependencies === null) {
      const entryPointsWithDependencies = this.entryPointsWithDependencies =
          new Map<AbsoluteFsPath, EntryPointWithDependencies>();
      for (const basePath of this.getBasePaths()) {
        const entryPoints = this.entryPointManifest.readEntryPointsUsingManifest(basePath) ||
            this.walkBasePathForPackages(basePath);
        for (const e of entryPoints) {
          entryPointsWithDependencies.set(e.entryPoint.path, e);
        }
      }
    }
    return this.entryPointsWithDependencies;
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

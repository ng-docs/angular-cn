/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {DepGraph} from 'dependency-graph';
import module from 'module';

import {AbsoluteFsPath, ReadonlyFileSystem} from '../../../src/ngtsc/file_system';
import {Logger} from '../../../src/ngtsc/logging';
import {NgccConfiguration} from '../packages/configuration';
import {EntryPoint, EntryPointFormat, getEntryPointFormat, SUPPORTED_FORMAT_PROPERTIES} from '../packages/entry_point';
import {PartiallyOrderedList} from '../utils';

import {createDependencyInfo, DependencyHost, EntryPointWithDependencies} from './dependency_host';

const builtinNodeJsModules = new Set<string>(module.builtinModules);

/**
 * Holds information about entry points that are removed because
 * they have dependencies that are missing (directly or transitively).
 *
 * 保留有关已删除的入口点的信息，因为它们具有缺失的依赖项（直接或传递）。
 *
 * This might not be an error, because such an entry point might not actually be used
 * in the application. If it is used then the `ngc` application compilation would
 * fail also, so we don't need ngcc to catch this.
 *
 * 这可能不是错误，因为这样的入口点可能并没有在应用程序中真正使用。如果使用了它，那么 `ngc`
 * 应用程序编译也将失败，因此我们不需要 ngcc 来捕获它。
 *
 * For example, consider an application that uses the `@angular/router` package.
 * This package includes an entry-point called `@angular/router/upgrade`, which has a dependency
 * on the `@angular/upgrade` package.
 * If the application never uses code from `@angular/router/upgrade` then there is no need for
 * `@angular/upgrade` to be installed.
 * In this case the ngcc tool should just ignore the `@angular/router/upgrade` end-point.
 *
 * 例如，考虑一个使用 `@angular/router` 包的应用程序。此包包含一个名为 `@angular/router/upgrade`
 * 的入口点，它依赖于 `@angular/upgrade` 包。如果应用程序从不使用 `@angular/router/upgrade`
 * 中的代码，则无需安装 `@angular/upgrade` 。在这种情况下，ngcc 工具应该只忽略
 * `@angular/router/upgrade` 端点。
 *
 */
export interface InvalidEntryPoint {
  entryPoint: EntryPoint;
  missingDependencies: string[];
}

/**
 * Holds information about dependencies of an entry-point that do not need to be processed
 * by the ngcc tool.
 *
 * 保存有关不需要由 ngcc 工具处理的入口点依赖项的信息。
 *
 * For example, the `rxjs` package does not contain any Angular decorators that need to be
 * compiled and so this can be safely ignored by ngcc.
 *
 * 例如， `rxjs` 包不包含任何需要编译的 Angular 装饰器，因此这可以被 ngcc 安全地忽略。
 *
 */
export interface IgnoredDependency {
  entryPoint: EntryPoint;
  dependencyPath: string;
}

export interface DependencyDiagnostics {
  invalidEntryPoints: InvalidEntryPoint[];
  ignoredDependencies: IgnoredDependency[];
}

/**
 * Represents a partially ordered list of entry-points.
 *
 * 表示入口点的部分有序列表。
 *
 * The entry-points' order/precedence is such that dependent entry-points always come later than
 * their dependencies in the list.
 *
 * 入口点的顺序/优先级是这样的，即依赖的入口点在列表中始终晚于它们的依赖项。
 *
 * See `DependencyResolver#sortEntryPointsByDependency()`.
 *
 * 请参阅 `DependencyResolver#sortEntryPointsByDependency()` 。
 *
 */
export type PartiallyOrderedEntryPoints = PartiallyOrderedList<EntryPoint>;

/**
 * A list of entry-points, sorted by their dependencies, and the dependency graph.
 *
 * 按依赖项排序的入口点列表和依赖图。
 *
 * The `entryPoints` array will be ordered so that no entry point depends upon an entry point that
 * appears later in the array.
 *
 * `entryPoints` 数组将被排序，以便没有入口点依赖于数组中靠后出现的入口点。
 *
 * Some entry points or their dependencies may have been ignored. These are captured for
 * diagnostic purposes in `invalidEntryPoints` and `ignoredDependencies` respectively.
 *
 * 某些入口点或其依赖项可能已被忽略。出于诊断目的，它们会分别在 `invalidEntryPoints` 和
 * `ignoredDependencies` 中捕获。
 *
 */
export interface SortedEntryPointsInfo extends DependencyDiagnostics {
  entryPoints: PartiallyOrderedEntryPoints;
  graph: DepGraph<EntryPoint>;
}

/**
 * A class that resolves dependencies between entry-points.
 *
 * 解析入口点之间依赖项的类。
 *
 */
export class DependencyResolver {
  constructor(
      private fs: ReadonlyFileSystem, private logger: Logger, private config: NgccConfiguration,
      private hosts: Partial<Record<EntryPointFormat, DependencyHost>>,
      private typingsHost: DependencyHost) {}
  /**
   * Sort the array of entry points so that the dependant entry points always come later than
   * their dependencies in the array.
   *
   * 对入口点数组进行排序，以使依赖的入口点在数组中始终晚于它们的依赖项。
   *
   * @param entryPoints An array entry points to sort.
   *
   * 要排序的数组条目。
   *
   * @param target If provided, only return entry-points depended on by this entry-point.
   *
   * 如果提供，则仅返回此入口点依赖的入口点。
   *
   * @returns
   *
   * the result of sorting the entry points by dependency.
   *
   * 按依赖项对入口点进行排序的结果。
   *
   */
  sortEntryPointsByDependency(entryPoints: EntryPointWithDependencies[], target?: EntryPoint):
      SortedEntryPointsInfo {
    const {invalidEntryPoints, ignoredDependencies, graph} =
        this.computeDependencyGraph(entryPoints);

    let sortedEntryPointNodes: string[];
    if (target) {
      if (target.compiledByAngular && graph.hasNode(target.path)) {
        sortedEntryPointNodes = graph.dependenciesOf(target.path);
        sortedEntryPointNodes.push(target.path);
      } else {
        sortedEntryPointNodes = [];
      }
    } else {
      sortedEntryPointNodes = graph.overallOrder();
    }

    return {
      entryPoints: (sortedEntryPointNodes as PartiallyOrderedList<string>)
                       .map(path => graph.getNodeData(path)),
      graph,
      invalidEntryPoints,
      ignoredDependencies,
    };
  }

  getEntryPointWithDependencies(entryPoint: EntryPoint): EntryPointWithDependencies {
    const dependencies = createDependencyInfo();
    if (entryPoint.compiledByAngular) {
      // Only bother to compute dependencies of entry-points that have been compiled by Angular
      const formatInfo = this.getEntryPointFormatInfo(entryPoint);
      const host = this.hosts[formatInfo.format];
      if (!host) {
        throw new Error(
            `Could not find a suitable format for computing dependencies of entry-point: '${
                entryPoint.path}'.`);
      }
      host.collectDependencies(formatInfo.path, dependencies);
      this.typingsHost.collectDependencies(entryPoint.typings, dependencies);
    }
    return {entryPoint, depInfo: dependencies};
  }

  /**
   * Computes a dependency graph of the given entry-points.
   *
   * 计算给定入口点的依赖图。
   *
   * The graph only holds entry-points that ngcc cares about and whose dependencies
   * (direct and transitive) all exist.
   *
   * 该图仅包含 ngcc 关心的并且都存在其依赖项（直接和可传递）的入口点。
   *
   */
  private computeDependencyGraph(entryPoints: EntryPointWithDependencies[]): DependencyGraph {
    const invalidEntryPoints: InvalidEntryPoint[] = [];
    const ignoredDependencies: IgnoredDependency[] = [];
    const graph = new DepGraph<EntryPoint>();

    const angularEntryPoints = entryPoints.filter(e => e.entryPoint.compiledByAngular);

    // Add the Angular compiled entry points to the graph as nodes
    angularEntryPoints.forEach(e => graph.addNode(e.entryPoint.path, e.entryPoint));

    // Now add the dependencies between them
    angularEntryPoints.forEach(({entryPoint, depInfo: {dependencies, missing, deepImports}}) => {
      const missingDependencies = Array.from(missing).filter(dep => !builtinNodeJsModules.has(dep));

      if (missingDependencies.length > 0 && !entryPoint.ignoreMissingDependencies) {
        // This entry point has dependencies that are missing
        // so remove it from the graph.
        removeNodes(entryPoint, missingDependencies);
      } else {
        dependencies.forEach(dependencyPath => {
          if (!graph.hasNode(entryPoint.path)) {
            // The entry-point has already been identified as invalid so we don't need
            // to do any further work on it.
          } else if (graph.hasNode(dependencyPath)) {
            // The entry-point is still valid (i.e. has no missing dependencies) and
            // the dependency maps to an entry point that exists in the graph so add it
            graph.addDependency(entryPoint.path, dependencyPath);
          } else if (invalidEntryPoints.some(i => i.entryPoint.path === dependencyPath)) {
            // The dependency path maps to an entry-point that was previously removed
            // from the graph, so remove this entry-point as well.
            removeNodes(entryPoint, [dependencyPath]);
          } else {
            // The dependency path points to a package that ngcc does not care about.
            ignoredDependencies.push({entryPoint, dependencyPath});
          }
        });
      }

      if (deepImports.size > 0) {
        const notableDeepImports = this.filterIgnorableDeepImports(entryPoint, deepImports);
        if (notableDeepImports.length > 0) {
          const imports = notableDeepImports.map(i => `'${i}'`).join(', ');
          this.logger.warn(
              `Entry point '${entryPoint.name}' contains deep imports into ${imports}. ` +
              `This is probably not a problem, but may cause the compilation of entry points to be out of order.`);
        }
      }
    });

    return {invalidEntryPoints, ignoredDependencies, graph};

    function removeNodes(entryPoint: EntryPoint, missingDependencies: string[]) {
      const nodesToRemove = [entryPoint.path, ...graph.dependantsOf(entryPoint.path)];
      nodesToRemove.forEach(node => {
        invalidEntryPoints.push({entryPoint: graph.getNodeData(node), missingDependencies});
        graph.removeNode(node);
      });
    }
  }

  private getEntryPointFormatInfo(entryPoint: EntryPoint):
      {format: EntryPointFormat, path: AbsoluteFsPath} {
    for (const property of SUPPORTED_FORMAT_PROPERTIES) {
      const formatPath = entryPoint.packageJson[property];
      if (formatPath === undefined) continue;

      const format = getEntryPointFormat(this.fs, entryPoint, property);
      if (format === undefined) continue;

      return {format, path: this.fs.resolve(entryPoint.path, formatPath)};
    }

    throw new Error(
        `There is no appropriate source code format in '${entryPoint.path}' entry-point.`);
  }

  /**
   * Filter out the deepImports that can be ignored, according to this entryPoint's config.
   *
   * 根据此 entryPoint 的配置，过滤掉可以忽略的 deepImport 。
   *
   */
  private filterIgnorableDeepImports(entryPoint: EntryPoint, deepImports: Set<AbsoluteFsPath>):
      AbsoluteFsPath[] {
    const version = (entryPoint.packageJson.version || null) as string | null;
    const packageConfig =
        this.config.getPackageConfig(entryPoint.packageName, entryPoint.packagePath, version);
    const matchers = packageConfig.ignorableDeepImportMatchers;
    return Array.from(deepImports)
        .filter(deepImport => !matchers.some(matcher => matcher.test(deepImport)));
  }
}

interface DependencyGraph extends DependencyDiagnostics {
  graph: DepGraph<EntryPoint>;
}

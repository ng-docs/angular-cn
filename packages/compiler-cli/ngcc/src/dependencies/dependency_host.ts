/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {AbsoluteFsPath, PathSegment, ReadonlyFileSystem} from '../../../src/ngtsc/file_system';
import {EntryPoint} from '../packages/entry_point';
import {resolveFileWithPostfixes} from '../utils';

import {ModuleResolver, ResolvedDeepImport, ResolvedRelativeModule} from './module_resolver';

export interface DependencyHost {
  collectDependencies(
      entryPointPath: AbsoluteFsPath, {dependencies, missing, deepImports}: DependencyInfo): void;
}

export interface DependencyInfo {
  dependencies: Set<AbsoluteFsPath>;
  missing: Set<AbsoluteFsPath|PathSegment>;
  deepImports: Set<AbsoluteFsPath>;
}

export interface EntryPointWithDependencies {
  entryPoint: EntryPoint;
  depInfo: DependencyInfo;
}

export function createDependencyInfo(): DependencyInfo {
  return {dependencies: new Set(), missing: new Set(), deepImports: new Set()};
}

export abstract class DependencyHostBase implements DependencyHost {
  constructor(protected fs: ReadonlyFileSystem, protected moduleResolver: ModuleResolver) {}

  /**
   * Find all the dependencies for the entry-point at the given path.
   *
   * 在给定路径处查找入口点的所有依赖项。
   *
   * @param entryPointPath The absolute path to the JavaScript file that represents an entry-point.
   *
   * 表示入口点的 JavaScript 文件的绝对路径。
   *
   * @param dependencyInfo An object containing information about the dependencies of the
   * entry-point, including those that were missing or deep imports into other entry-points. The
   * sets in this object will be updated with new information about the entry-point's dependencies.
   *
   * 包含有关入口点依赖项的信息的对象，包括那些缺失的或深度导入到其他入口点的信息。此对象中的集将使用有关入口点依赖项的新信息进行更新。
   *
   */
  collectDependencies(
      entryPointPath: AbsoluteFsPath, {dependencies, missing, deepImports}: DependencyInfo): void {
    const resolvedFile =
        resolveFileWithPostfixes(this.fs, entryPointPath, this.moduleResolver.relativeExtensions);
    if (resolvedFile !== null) {
      const alreadySeen = new Set<AbsoluteFsPath>();
      this.recursivelyCollectDependencies(
          resolvedFile, dependencies, missing, deepImports, alreadySeen);
    }
  }

  /**
   * Find all the dependencies for the provided paths.
   *
   * 查找提供的路径的所有依赖项。
   *
   * @param files The list of absolute paths of JavaScript files to scan for dependencies.
   *
   * 要扫描依赖项的 JavaScript 文件的绝对路径列表。
   *
   * @param dependencyInfo An object containing information about the dependencies of the
   * entry-point, including those that were missing or deep imports into other entry-points. The
   * sets in this object will be updated with new information about the entry-point's dependencies.
   *
   * 包含有关入口点依赖项的信息的对象，包括那些缺失的或深度导入到其他入口点的信息。此对象中的集将使用有关入口点依赖项的新信息进行更新。
   *
   */
  collectDependenciesInFiles(
      files: AbsoluteFsPath[], {dependencies, missing, deepImports}: DependencyInfo): void {
    const alreadySeen = new Set<AbsoluteFsPath>();
    for (const file of files) {
      this.processFile(file, dependencies, missing, deepImports, alreadySeen);
    }
  }

  /**
   * Compute the dependencies of the given file.
   *
   * 计算给定文件的依赖项。
   *
   * @param file An absolute path to the file whose dependencies we want to get.
   *
   * 我们要获取其依赖项的文件的绝对路径。
   *
   * @param dependencies A set that will have the absolute paths of resolved entry points added to
   * it.
   *
   * 将添加已解析入口点的绝对路径的集。
   *
   * @param missing A set that will have the dependencies that could not be found added to it.
   *
   * 将具有无法找到的依赖项添加到它的集合。
   *
   * @param deepImports A set that will have the import paths that exist but cannot be mapped to
   * entry-points, i.e. deep-imports.
   *
   * 一个具有存在但无法映射到入口点的导入路径的集，即 deep-imports。
   *
   * @param alreadySeen A set that is used to track internal dependencies to prevent getting stuck
   * in a circular dependency loop.
   *
   * 用于跟踪内部依赖项以防止陷入循环依赖循环的集合。
   *
   */
  protected recursivelyCollectDependencies(
      file: AbsoluteFsPath, dependencies: Set<AbsoluteFsPath>, missing: Set<string>,
      deepImports: Set<string>, alreadySeen: Set<AbsoluteFsPath>): void {
    const fromContents = this.fs.readFile(file);
    if (this.canSkipFile(fromContents)) {
      return;
    }
    const imports = this.extractImports(file, fromContents);
    for (const importPath of imports) {
      const resolved =
          this.processImport(importPath, file, dependencies, missing, deepImports, alreadySeen);
      if (!resolved) {
        missing.add(importPath);
      }
    }
  }

  protected abstract canSkipFile(fileContents: string): boolean;
  protected abstract extractImports(file: AbsoluteFsPath, fileContents: string): Set<string>;

  /**
   * Resolve the given `importPath` from `file` and add it to the appropriate set.
   *
   * 解析给定的 `importPath` 从 `file` 并将其添加到适当的集。
   *
   * If the import is local to this package then follow it by calling
   * `recursivelyCollectDependencies()`.
   *
   * 如果导入对此包是本地的，则通过调用 `recursivelyCollectDependencies()` 来跟踪它。
   *
   * @returns
   *
   * `true` if the import was resolved (to an entry-point, a local import, or a
   * deep-import), `false` otherwise.
   *
   * `true` 导入已解析（到入口点、本地导入或深度导入），则为 true ，否则为 `false` 。
   *
   */
  protected processImport(
      importPath: string, file: AbsoluteFsPath, dependencies: Set<AbsoluteFsPath>,
      missing: Set<string>, deepImports: Set<string>, alreadySeen: Set<AbsoluteFsPath>): boolean {
    const resolvedModule = this.moduleResolver.resolveModuleImport(importPath, file);
    if (resolvedModule === null) {
      return false;
    }
    if (resolvedModule instanceof ResolvedRelativeModule) {
      this.processFile(resolvedModule.modulePath, dependencies, missing, deepImports, alreadySeen);
    } else if (resolvedModule instanceof ResolvedDeepImport) {
      deepImports.add(resolvedModule.importPath);
    } else {
      dependencies.add(resolvedModule.entryPointPath);
    }
    return true;
  }

  /**
   * Processes the file if it has not already been seen. This will also recursively process
   * all files that are imported from the file, while taking the set of already seen files
   * into account.
   *
   * 如果尚未看到文件，则处理它。这还将递归处理从文件导入的所有文件，同时考虑到已看到的文件集。
   *
   */
  protected processFile(
      file: AbsoluteFsPath, dependencies: Set<AbsoluteFsPath>, missing: Set<string>,
      deepImports: Set<string>, alreadySeen: Set<AbsoluteFsPath>): void {
    if (!alreadySeen.has(file)) {
      alreadySeen.add(file);
      this.recursivelyCollectDependencies(file, dependencies, missing, deepImports, alreadySeen);
    }
  }
}

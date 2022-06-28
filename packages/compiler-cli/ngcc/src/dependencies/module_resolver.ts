/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {AbsoluteFsPath, ReadonlyFileSystem} from '../../../src/ngtsc/file_system';
import {PathMappings} from '../path_mappings';
import {isRelativePath, loadJson, loadSecondaryEntryPointInfoForApfV14, resolveFileWithPostfixes} from '../utils';

/**
 * This is a very cut-down implementation of the TypeScript module resolution strategy.
 *
 * 这是 TypeScript 模块解析策略的一个非常精简的实现。
 *
 * It is specific to the needs of ngcc and is not intended to be a drop-in replacement
 * for the TS module resolver. It is used to compute the dependencies between entry-points
 * that may be compiled by ngcc.
 *
 * 它特定于 ngcc 的需求，并非旨在成为 TS 模块解析器的直接替代方案。它用于计算可以由 ngcc
 * 编译的入口点之间的依赖关系。
 *
 * The algorithm only finds `.js` files for internal/relative imports and paths to
 * the folder containing the `package.json` of the entry-point for external imports.
 *
 * 该算法仅查找内部/相对导入的 `.js` 文件，以及包含外部导入入口点 `package.json` 的文件夹的路径。
 *
 * It can cope with nested `node_modules` folders and also supports `paths`/`baseUrl`
 * configuration properties, as provided in a `ts.CompilerOptions` object.
 *
 * 它可以处理嵌套 `node_modules` 文件夹，并且还支持 `ts.CompilerOptions` 对象中提供的 `paths` /
 * `baseUrl` 配置属性。
 *
 */
export class ModuleResolver {
  private pathMappings: ProcessedPathMapping[];

  constructor(
      private fs: ReadonlyFileSystem, pathMappings?: PathMappings,
      readonly relativeExtensions = ['', '.js', '/index.js']) {
    this.pathMappings = pathMappings ? this.processPathMappings(pathMappings) : [];
  }

  /**
   * Resolve an absolute path for the `moduleName` imported into a file at `fromPath`.
   *
   * 解析导入到 `fromPath` 文件中的 `moduleName` 的绝对路径。
   *
   * @param moduleName The name of the import to resolve.
   *
   * 要解析的导入的名称。
   *
   * @param fromPath The path to the file containing the import.
   *
   * 包含导入的文件的路径。
   *
   * @returns
   *
   * A path to the resolved module or null if missing.
   * Specifically:
   *
   * 已解析模块的路径，如果不存在，则为 null 。具体来说：
   *
   * - the absolute path to the package.json of an external module
   *
   *   外部模块的 package.json 的绝对路径
   *
   * - a JavaScript file of an internal module
   *
   *   内部模块的 JavaScript 文件
   *
   * - null if none exists.
   *
   *   如果不存在，则为 null 。
   *
   */
  resolveModuleImport(moduleName: string, fromPath: AbsoluteFsPath): ResolvedModule|null {
    if (isRelativePath(moduleName)) {
      return this.resolveAsRelativePath(moduleName, fromPath);
    } else {
      return this.pathMappings.length && this.resolveByPathMappings(moduleName, fromPath) ||
          this.resolveAsEntryPoint(moduleName, fromPath);
    }
  }

  /**
   * Convert the `pathMappings` into a collection of `PathMapper` functions.
   *
   * 将 `pathMappings` 转换为 `PathMapper` 函数的集合。
   *
   */
  private processPathMappings(pathMappings: PathMappings): ProcessedPathMapping[] {
    const baseUrl = this.fs.resolve(pathMappings.baseUrl);
    return Object.keys(pathMappings.paths).map(pathPattern => {
      const matcher = splitOnStar(pathPattern);
      const templates = pathMappings.paths[pathPattern].map(splitOnStar);
      return {matcher, templates, baseUrl};
    });
  }

  /**
   * Try to resolve a module name, as a relative path, from the `fromPath`.
   *
   * 尝试从 `fromPath` 将模块名称解析为相对路径。
   *
   * As it is relative, it only looks for files that end in one of the `relativeExtensions`.
   * For example: `${moduleName}.js` or `${moduleName}/index.js`.
   * If neither of these files exist then the method returns `null`.
   *
   * 由于它是相对的，它仅查找以 `relativeExtensions` 之一结尾的文件。例如： `${moduleName}.js` 或
   * `${moduleName}/index.js` 。如果这些文件都不存在，则该方法返回 `null` 。
   *
   */
  private resolveAsRelativePath(moduleName: string, fromPath: AbsoluteFsPath): ResolvedModule|null {
    const resolvedPath = resolveFileWithPostfixes(
        this.fs, this.fs.resolve(this.fs.dirname(fromPath), moduleName), this.relativeExtensions);
    return resolvedPath && new ResolvedRelativeModule(resolvedPath);
  }

  /**
   * Try to resolve the `moduleName`, by applying the computed `pathMappings` and
   * then trying to resolve the mapped path as a relative or external import.
   *
   * 尝试通过应用计算的 `pathMappings` 来解析 `moduleName`
   * ，然后尝试将映射路径解析为相对导入或外部导入。
   *
   * Whether the mapped path is relative is defined as it being "below the `fromPath`" and not
   * containing `node_modules`.
   *
   * 映射路径是否是相对的，定义为它“在 `fromPath` ”并且不包含 `node_modules` 。
   *
   * If the mapped path is not relative but does not resolve to an external entry-point, then we
   * check whether it would have resolved to a relative path, in which case it is marked as a
   * "deep-import".
   *
   * 如果映射路径不是相对路径但不解析为外部入口点，那么我们会检查它是否会解析为相对路径，在这种情况下，它被标记为“deep-import”。
   *
   */
  private resolveByPathMappings(moduleName: string, fromPath: AbsoluteFsPath): ResolvedModule|null {
    const mappedPaths = this.findMappedPaths(moduleName);
    if (mappedPaths.length > 0) {
      const packagePath = this.findPackagePath(fromPath);
      if (packagePath !== null) {
        for (const mappedPath of mappedPaths) {
          if (this.isEntryPoint(mappedPath)) {
            return new ResolvedExternalModule(mappedPath);
          }
          const nonEntryPointImport = this.resolveAsRelativePath(mappedPath, fromPath);
          if (nonEntryPointImport !== null) {
            return isRelativeImport(packagePath, mappedPath) ? nonEntryPointImport :
                                                               new ResolvedDeepImport(mappedPath);
          }
        }
      }
    }
    return null;
  }

  /**
   * Try to resolve the `moduleName` as an external entry-point by searching the `node_modules`
   * folders up the tree for a matching `.../node_modules/${moduleName}`.
   *
   * 尝试通过在树上搜索 `node_modules` 文件夹中匹配的 `.../node_modules/${moduleName}` 来将
   * `moduleName` 解析为外部入口点。
   *
   * If a folder is found but the path is not considered an entry-point (see `isEntryPoint()`) then
   * it is marked as a "deep-import".
   *
   * 如果找到了一个文件夹，但该路径不被视为入口点（请参阅 `isEntryPoint()`
   *），则将其标记为“deep-import”。
   *
   */
  private resolveAsEntryPoint(moduleName: string, fromPath: AbsoluteFsPath): ResolvedModule|null {
    let folder = fromPath;
    while (!this.fs.isRoot(folder)) {
      folder = this.fs.dirname(folder);
      if (folder.endsWith('node_modules')) {
        // Skip up if the folder already ends in node_modules
        folder = this.fs.dirname(folder);
      }
      const modulePath = this.fs.resolve(folder, 'node_modules', moduleName);
      if (this.isEntryPoint(modulePath)) {
        return new ResolvedExternalModule(modulePath);
      } else if (this.resolveAsRelativePath(modulePath, fromPath)) {
        return new ResolvedDeepImport(modulePath);
      }
    }
    return null;
  }


  /**
   * Can we consider the given path as an entry-point to a package?
   *
   * 我们可以将给定的路径视为包的入口点吗？
   *
   * This is achieved by checking for the existence of `${modulePath}/package.json`.
   * If there is no `package.json`, we check whether this is an APF v14+ secondary entry-point,
   * which does not have its own `package.json` but has an `exports` entry in the package's primary
   * `package.json`.
   *
   * 这是通过检查是否存在 `${modulePath}/package.json` 的。如果没有 `package.json`
   * ，我们会检查这是否是 APF v14+ 辅助入口点，它没有自己的 `package.json` ，但在包的主要
   * `package.json` 中有一个 `exports` 条目。
   *
   */
  private isEntryPoint(modulePath: AbsoluteFsPath): boolean {
    if (this.fs.exists(this.fs.join(modulePath, 'package.json'))) {
      return true;
    }

    const packagePath = this.findPackagePath(modulePath);
    if (packagePath === null) {
      return false;
    }

    const packagePackageJson = loadJson(this.fs, this.fs.join(packagePath, 'package.json'));
    const entryPointInfoForApfV14 =
        loadSecondaryEntryPointInfoForApfV14(this.fs, packagePackageJson, packagePath, modulePath);

    return entryPointInfoForApfV14 !== null;
  }

  /**
   * Apply the `pathMappers` to the `moduleName` and return all the possible
   * paths that match.
   *
   * 将 `pathMappers` 应用于 `moduleName` 并返回匹配的所有可能路径。
   *
   * The mapped path is computed for each template in `mapping.templates` by
   * replacing the `matcher.prefix` and `matcher.postfix` strings in `path with
   * the`template.prefix`and`template.postfix\` strings.
   *
   * 通过将 path 中的 `matcher.prefix` 和 `matcher.postfix` 字符串替换 `path with the`
   * template.prefix `and` template.postfix \` 字符串来为 `mapping.templates`
   * 中的每个模板计算映射路径。
   *
   */
  private findMappedPaths(moduleName: string): AbsoluteFsPath[] {
    const matches = this.pathMappings.map(mapping => this.matchMapping(moduleName, mapping));

    let bestMapping: ProcessedPathMapping|undefined;
    let bestMatch: string|undefined;

    for (let index = 0; index < this.pathMappings.length; index++) {
      const mapping = this.pathMappings[index];
      const match = matches[index];
      if (match !== null) {
        // If this mapping had no wildcard then this must be a complete match.
        if (!mapping.matcher.hasWildcard) {
          bestMatch = match;
          bestMapping = mapping;
          break;
        }
        // The best matched mapping is the one with the longest prefix.
        if (!bestMapping || mapping.matcher.prefix > bestMapping.matcher.prefix) {
          bestMatch = match;
          bestMapping = mapping;
        }
      }
    }

    return (bestMapping !== undefined && bestMatch !== undefined) ?
        this.computeMappedTemplates(bestMapping, bestMatch) :
        [];
  }

  /**
   * Attempt to find a mapped path for the given `path` and a `mapping`.
   *
   * 尝试查找给定 `path` 的映射路径和 `mapping` 。
   *
   * The `path` matches the `mapping` if if it starts with `matcher.prefix` and ends with
   * `matcher.postfix`.
   *
   * 如果路径以 `matcher.postfix` 开头并以 `matcher.prefix` 结尾，则 `path` 与 `mapping` 匹配。
   *
   * @returns
   *
   * the wildcard segment of a matched `path`, or `null` if no match.
   *
   * 匹配的 `path` 的通配符段，如果不匹配，则为 `null` 。
   *
   */
  private matchMapping(path: string, mapping: ProcessedPathMapping): string|null {
    const {prefix, postfix, hasWildcard} = mapping.matcher;
    if (hasWildcard) {
      return (path.startsWith(prefix) && path.endsWith(postfix)) ?
          path.substring(prefix.length, path.length - postfix.length) :
          null;
    } else {
      return (path === prefix) ? '' : null;
    }
  }

  /**
   * Compute the candidate paths from the given mapping's templates using the matched
   * string.
   *
   * 使用匹配的字符串从给定映射的模板计算候选路径。
   *
   */
  private computeMappedTemplates(mapping: ProcessedPathMapping, match: string) {
    return mapping.templates.map(
        template => this.fs.resolve(mapping.baseUrl, template.prefix + match + template.postfix));
  }

  /**
   * Search up the folder tree for the first folder that contains `package.json`
   * or `null` if none is found.
   *
   * 向上搜索文件夹树以查找包含 `package.json` 的第一个文件夹，如果找不到，则为 `null` 。
   *
   */
  private findPackagePath(path: AbsoluteFsPath): AbsoluteFsPath|null {
    let folder = path;
    while (!this.fs.isRoot(folder)) {
      folder = this.fs.dirname(folder);
      if (this.fs.exists(this.fs.join(folder, 'package.json'))) {
        return folder;
      }
    }
    return null;
  }
}

/**
 * The result of resolving an import to a module.
 *
 * 解析到模块的导入的结果。
 *
 */
export type ResolvedModule = ResolvedExternalModule|ResolvedRelativeModule|ResolvedDeepImport;

/**
 * A module that is external to the package doing the importing.
 * In this case we capture the folder containing the entry-point.
 *
 * 执行导入的包外部的模块。在这种情况下，我们会捕获包含入口点的文件夹。
 *
 */
export class ResolvedExternalModule {
  constructor(public entryPointPath: AbsoluteFsPath) {}
}

/**
 * A module that is relative to the module doing the importing, and so internal to the
 * source module's package.
 *
 * 相对于执行导入的模块的模块，因此在源模块的包内部。
 *
 */
export class ResolvedRelativeModule {
  constructor(public modulePath: AbsoluteFsPath) {}
}

/**
 * A module that is external to the package doing the importing but pointing to a
 * module that is deep inside a package, rather than to an entry-point of the package.
 *
 * 进行导入的包外部的模块，但指向了包内部的模块，而不是指向包的入口点。
 *
 */
export class ResolvedDeepImport {
  constructor(public importPath: AbsoluteFsPath) {}
}

function splitOnStar(str: string): PathMappingPattern {
  const [prefix, postfix] = str.split('*', 2);
  return {prefix, postfix: postfix || '', hasWildcard: postfix !== undefined};
}

interface ProcessedPathMapping {
  baseUrl: AbsoluteFsPath;
  matcher: PathMappingPattern;
  templates: PathMappingPattern[];
}

interface PathMappingPattern {
  prefix: string;
  postfix: string;
  hasWildcard: boolean;
}

function isRelativeImport(from: AbsoluteFsPath, to: AbsoluteFsPath) {
  return to.startsWith(from) && !to.includes('node_modules');
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';

import {AbsoluteFsPath, ReadonlyFileSystem} from '../../../src/ngtsc/file_system';

/**
 * A cache that holds on to source files that can be shared for processing all entry-points in a
 * single invocation of ngcc. In particular, the following files are shared across all entry-points
 * through this cache:
 *
 * 保留可以共享的源文件的缓存，以在单次 ngcc
 * 调用中处理所有入口点。特别是，以下文件通过此缓存在所有入口点之间共享：
 *
 * 1. Default library files such as `lib.dom.d.ts` and `lib.es5.d.ts`. These files don't change
 *       and some are very large, so parsing is expensive. Therefore, the parsed `ts.SourceFile`s for
 *       the default library files are cached.
 *
 *    默认库文件，例如 `lib.dom.d.ts` 和 `lib.es5.d.ts`
 *    。这些文件不会更改，并且有些非常大，因此解析成本很高。因此，会缓存默认库文件的解析后的
 *    `ts.SourceFile` 。
 *
 * 2. The typings of @angular scoped packages. The typing files for @angular packages are typically
 *    used in the entry-points that ngcc processes, so benefit from a single source file cache.
 *    Especially `@angular/core/core.d.ts` is large and expensive to parse repeatedly. In contrast
 *    to default library files, we have to account for these files to be invalidated during a single
 *    invocation of ngcc, as ngcc will overwrite the .d.ts files during its processing.
 *
 * The lifecycle of this cache corresponds with a single invocation of ngcc. Separate invocations,
 * e.g. the CLI's synchronous module resolution fallback will therefore all have their own cache.
 * This allows for the source file cache to be garbage collected once ngcc processing has completed.
 *
 * 此缓存的生命周期对应于 ngcc 的单次调用。因此，单独的调用（例如 CLI
 * 的同步模块解析后备）都将有自己的缓存。这允许在 ngcc 处理完成后对源文件缓存进行垃圾收集。
 *
 */
export class SharedFileCache {
  private sfCache = new Map<AbsoluteFsPath, ts.SourceFile>();

  constructor(private fs: ReadonlyFileSystem) {}

  /**
   * Loads a `ts.SourceFile` if the provided `fileName` is deemed appropriate to be cached. To
   * optimize for memory usage, only files that are generally used in all entry-points are cached.
   * If `fileName` is not considered to benefit from caching or the requested file does not exist,
   * then `undefined` is returned.
   *
   * 如果提供的 `fileName` 被认为适合缓存，则加载 `ts.SourceFile`
   * 。为了优化内存使用情况，只有通常在所有入口点中使用的文件才会被缓存。如果 `fileName`
   * 被认为不能从缓存中受益，或者所请求的文件不存在，则返回 `undefined` 。
   *
   */
  getCachedSourceFile(fileName: string): ts.SourceFile|undefined {
    const absPath = this.fs.resolve(fileName);
    if (isDefaultLibrary(absPath, this.fs)) {
      return this.getStableCachedFile(absPath);
    } else if (isAngularDts(absPath, this.fs)) {
      return this.getVolatileCachedFile(absPath);
    } else {
      return undefined;
    }
  }

  /**
   * Attempts to load the source file from the cache, or parses the file into a `ts.SourceFile` if
   * it's not yet cached. This method assumes that the file will not be modified for the duration
   * that this cache is valid for. If that assumption does not hold, the `getVolatileCachedFile`
   * method is to be used instead.
   *
   * 尝试从缓存中加载源文件，如果尚未缓存，则将文件解析为 `ts.SourceFile`
   * 。此方法假定在此缓存有效的持续时间内不会修改文件。如果该假设不成立，则将
   * `getVolatileCachedFile` 方法。
   *
   */
  private getStableCachedFile(absPath: AbsoluteFsPath): ts.SourceFile|undefined {
    if (!this.sfCache.has(absPath)) {
      const content = readFile(absPath, this.fs);
      if (content === undefined) {
        return undefined;
      }
      const sf = ts.createSourceFile(absPath, content, ts.ScriptTarget.ES2015);
      this.sfCache.set(absPath, sf);
    }
    return this.sfCache.get(absPath)!;
  }

  /**
   * In contrast to `getStableCachedFile`, this method always verifies that the cached source file
   * is the same as what's stored on disk. This is done for files that are expected to change during
   * ngcc's processing, such as @angular scoped packages for which the .d.ts files are overwritten
   * by ngcc. If the contents on disk have changed compared to a previously cached source file, the
   * content from disk is re-parsed and the cache entry is replaced.
   *
   * 与 `getStableCachedFile` ，此方法始终验证缓存的源文件与磁盘上存储的文件相同。这是针对预期在
   * ngcc 处理期间会更改的文件完成的，例如 .d.ts 文件被 ngcc 覆盖的 @angular
   * 范围包。如果磁盘上的内容与以前缓存的源文件相比发生了更改，则会重新解析磁盘中的内容并替换缓存条目。
   *
   */
  private getVolatileCachedFile(absPath: AbsoluteFsPath): ts.SourceFile|undefined {
    const content = readFile(absPath, this.fs);
    if (content === undefined) {
      return undefined;
    }
    if (!this.sfCache.has(absPath) || this.sfCache.get(absPath)!.text !== content) {
      const sf = ts.createSourceFile(absPath, content, ts.ScriptTarget.ES2015);
      this.sfCache.set(absPath, sf);
    }
    return this.sfCache.get(absPath)!;
  }
}

const DEFAULT_LIB_PATTERN = ['node_modules', 'typescript', 'lib', /^lib\..+\.d\.ts$/];

/**
 * Determines whether the provided path corresponds with a default library file inside of the
 * typescript package.
 *
 * 确定提供的路径是否与 typescript 包中的默认库文件对应。
 *
 * @param absPath The path for which to determine if it corresponds with a default library file.
 *
 * 要确定它是否与默认库文件对应的路径。
 *
 * @param fs The filesystem to use for inspecting the path.
 *
 * 用于检查路径的文件系统。
 *
 */
export function isDefaultLibrary(absPath: AbsoluteFsPath, fs: ReadonlyFileSystem): boolean {
  return isFile(absPath, DEFAULT_LIB_PATTERN, fs);
}

const ANGULAR_DTS_PATTERN = ['node_modules', '@angular', /./, /\.d\.ts$/];

/**
 * Determines whether the provided path corresponds with a .d.ts file inside of an @angular
 * scoped package. This logic only accounts for the .d.ts files in the root, which is sufficient
 * to find the large, flattened entry-point files that benefit from caching.
 *
 * 确定提供的路径是否与 @angular 范围包中的 .d.ts 文件对应。此逻辑仅考虑根中的 .d.ts
 * 文件，这足以找到从缓存中受益的大的、展平的入口点文件。
 *
 * @param absPath The path for which to determine if it corresponds with an
 *
 * 要确定它是否与
 *
 * @angular .d.ts file.
 * @param fs The filesystem to use for inspecting the path.
 *
 * 用于检查路径的文件系统。
 *
 */
export function isAngularDts(absPath: AbsoluteFsPath, fs: ReadonlyFileSystem): boolean {
  return isFile(absPath, ANGULAR_DTS_PATTERN, fs);
}

/**
 * Helper function to determine whether a file corresponds with a given pattern of segments.
 *
 * 确定文件是否与给定的段模式对应的帮助器函数。
 *
 * @param path The path for which to determine if it corresponds with the provided segments.
 *
 * 要确定它是否与提供的段对应的路径。
 *
 * @param segments Array of segments; the `path` must have ending segments that match the
 * patterns in this array.
 *
 * 段数组； `path` 必须有与此数组中的模式匹配的结尾段。
 *
 * @param fs The filesystem to use for inspecting the path.
 *
 * 用于检查路径的文件系统。
 *
 */
function isFile(
    path: AbsoluteFsPath, segments: ReadonlyArray<string|RegExp>, fs: ReadonlyFileSystem): boolean {
  for (let i = segments.length - 1; i >= 0; i--) {
    const pattern = segments[i];
    const segment = fs.basename(path);
    if (typeof pattern === 'string') {
      if (pattern !== segment) {
        return false;
      }
    } else {
      if (!pattern.test(segment)) {
        return false;
      }
    }
    path = fs.dirname(path);
  }
  return true;
}

/**
 * A cache for processing a single entry-point. This exists to share `ts.SourceFile`s between the
 * source and typing programs that are created for a single program.
 *
 * 用于处理单个入口点的缓存。存在是为了在为单个程序创建的源程序和键入程序之间共享 `ts.SourceFile` 。
 *
 */
export class EntryPointFileCache {
  private readonly sfCache = new Map<AbsoluteFsPath, ts.SourceFile>();

  constructor(
      private fs: ReadonlyFileSystem, private sharedFileCache: SharedFileCache,
      private processSourceText: (sourceText: string) => string) {}

  /**
   * Returns and caches a parsed `ts.SourceFile` for the provided `fileName`. If the `fileName` is
   * cached in the shared file cache, that result is used. Otherwise, the source file is cached
   * internally. This method returns `undefined` if the requested file does not exist.
   *
   * 返回并缓存所提供的 `fileName` 的解析后的 `ts.SourceFile` 。如果 `fileName`
   * 缓存在共享文件缓存中，则使用该结果。否则，源文件会在内部缓存。如果请求的文件不存在，则此方法返回
   * `undefined` 。
   *
   * @param fileName The path of the file to retrieve a source file for.
   *
   * 要为其检索源文件的文件的路径。
   *
   * @param languageVersion The language version to use for parsing the file.
   *
   * 用于解析文件的语言版本。
   *
   */
  getCachedSourceFile(fileName: string, languageVersion: ts.ScriptTarget): ts.SourceFile|undefined {
    const staticSf = this.sharedFileCache.getCachedSourceFile(fileName);
    if (staticSf !== undefined) {
      return staticSf;
    }

    const absPath = this.fs.resolve(fileName);
    if (this.sfCache.has(absPath)) {
      return this.sfCache.get(absPath);
    }

    const content = readFile(absPath, this.fs);
    if (content === undefined) {
      return undefined;
    }
    const processed = this.processSourceText(content);
    const sf = ts.createSourceFile(fileName, processed, languageVersion);
    this.sfCache.set(absPath, sf);
    return sf;
  }
}

function readFile(absPath: AbsoluteFsPath, fs: ReadonlyFileSystem): string|undefined {
  if (!fs.exists(absPath) || !fs.stat(absPath).isFile()) {
    return undefined;
  }
  return fs.readFile(absPath);
}

/**
 * Creates a `ts.ModuleResolutionCache` that uses the provided filesystem for path operations.
 *
 * 创建一个使用提供的文件系统进行路径操作的 `ts.ModuleResolutionCache` 。
 *
 * @param fs The filesystem to use for path operations.
 *
 * 用于路径操作的文件系统。
 *
 */
export function createModuleResolutionCache(fs: ReadonlyFileSystem): ts.ModuleResolutionCache {
  return ts.createModuleResolutionCache(fs.pwd(), fileName => {
    return fs.isCaseSensitive() ? fileName : fileName.toLowerCase();
  });
}

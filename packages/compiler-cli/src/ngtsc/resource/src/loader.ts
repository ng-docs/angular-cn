/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {ResourceLoader, ResourceLoaderContext} from '../../annotations';
import {NgCompilerAdapter, ResourceHostContext} from '../../core/api';
import {AbsoluteFsPath, join, PathSegment} from '../../file_system';
import {RequiredDelegations} from '../../util/src/typescript';

const CSS_PREPROCESSOR_EXT = /(\.scss|\.sass|\.less|\.styl)$/;

const RESOURCE_MARKER = '.$ngresource$';
const RESOURCE_MARKER_TS = RESOURCE_MARKER + '.ts';

/**
 * `ResourceLoader` which delegates to an `NgCompilerAdapter`'s resource loading methods.
 *
 * `ResourceLoader` ，它委托给 `NgCompilerAdapter` 的资源加载方法。
 *
 */
export class AdapterResourceLoader implements ResourceLoader {
  private cache = new Map<string, string>();
  private fetching = new Map<string, Promise<void>>();
  private lookupResolutionHost = createLookupResolutionHost(this.adapter);

  canPreload = !!this.adapter.readResource;
  canPreprocess = !!this.adapter.transformResource;

  constructor(private adapter: NgCompilerAdapter, private options: ts.CompilerOptions) {}

  /**
   * Resolve the url of a resource relative to the file that contains the reference to it.
   * The return value of this method can be used in the `load()` and `preload()` methods.
   *
   * 解析资源相对于包含对它的引用的文件的 url。此方法的返回值可在 `load()` 和 `preload()`
   * 方法中使用。
   *
   * Uses the provided CompilerHost if it supports mapping resources to filenames.
   * Otherwise, uses a fallback mechanism that searches the module resolution candidates.
   *
   * 如果支持将资源映射到文件名，则使用提供的 CompilerHost
   * 。否则，使用搜索模块解析候选者的后备机制。
   *
   * @param url The, possibly relative, url of the resource.
   *
   * 资源的可能是相对的 url。
   *
   * @param fromFile The path to the file that contains the URL of the resource.
   *
   * 包含资源 URL 的文件的路径。
   *
   * @returns
   *
   * A resolved url of resource.
   *
   * 资源的解析 url。
   *
   * @throws An error if the resource cannot be resolved.
   *
   * 如果无法解析资源，则会出现错误。
   *
   */
  resolve(url: string, fromFile: string): string {
    let resolvedUrl: string|null = null;
    if (this.adapter.resourceNameToFileName) {
      resolvedUrl = this.adapter.resourceNameToFileName(
          url, fromFile, (url: string, fromFile: string) => this.fallbackResolve(url, fromFile));
    } else {
      resolvedUrl = this.fallbackResolve(url, fromFile);
    }
    if (resolvedUrl === null) {
      throw new Error(`HostResourceResolver: could not resolve ${url} in context of ${fromFile})`);
    }
    return resolvedUrl;
  }

  /**
   * Preload the specified resource, asynchronously.
   *
   * 异步预加载指定的资源。
   *
   * Once the resource is loaded, its value is cached so it can be accessed synchronously via the
   * `load()` method.
   *
   * 加载资源后，它的值会被缓存，以便可以通过 `load()` 方法同步访问它。
   *
   * @param resolvedUrl The url (resolved by a call to `resolve()`) of the resource to preload.
   *
   * 要预加载的资源的 url（通过调用 `resolve()` 来解析）。
   *
   * @param context Information about the resource such as the type and containing file.
   *
   * 有关资源的信息，例如类型和包含文件。
   *
   * @returns
   *
   * A Promise that is resolved once the resource has been loaded or `undefined` if the
   * file has already been loaded.
   *
   * 加载资源后解析的 Promise ，如果已加载文件，则为 `undefined` 。
   *
   * @throws An Error if pre-loading is not available.
   *
   * 如果预加载不可用，则会出现错误。
   *
   */
  preload(resolvedUrl: string, context: ResourceLoaderContext): Promise<void>|undefined {
    if (!this.adapter.readResource) {
      throw new Error(
          'HostResourceLoader: the CompilerHost provided does not support pre-loading resources.');
    }
    if (this.cache.has(resolvedUrl)) {
      return undefined;
    } else if (this.fetching.has(resolvedUrl)) {
      return this.fetching.get(resolvedUrl);
    }

    let result = this.adapter.readResource(resolvedUrl);

    if (this.adapter.transformResource && context.type === 'style') {
      const resourceContext: ResourceHostContext = {
        type: 'style',
        containingFile: context.containingFile,
        resourceFile: resolvedUrl,
      };
      result = Promise.resolve(result).then(async (str) => {
        const transformResult = await this.adapter.transformResource!(str, resourceContext);
        return transformResult === null ? str : transformResult.content;
      });
    }

    if (typeof result === 'string') {
      this.cache.set(resolvedUrl, result);
      return undefined;
    } else {
      const fetchCompletion = result.then(str => {
        this.fetching.delete(resolvedUrl);
        this.cache.set(resolvedUrl, str);
      });
      this.fetching.set(resolvedUrl, fetchCompletion);
      return fetchCompletion;
    }
  }

  /**
   * Preprocess the content data of an inline resource, asynchronously.
   *
   * 异步预处理内联资源的内容数据。
   *
   * @param data The existing content data from the inline resource.
   *
   * 内联资源中的现有内容数据。
   *
   * @param context Information regarding the resource such as the type and containing file.
   *
   * 有关资源的信息，例如类型和包含文件。
   *
   * @returns
   *
   * A Promise that resolves to the processed data. If no processing occurs, the
   * same data string that was passed to the function will be resolved.
   *
   * 解析为已处理数据的 Promise。如果不发生处理，则将解析传递给函数的同一个数据字符串。
   *
   */
  async preprocessInline(data: string, context: ResourceLoaderContext): Promise<string> {
    if (!this.adapter.transformResource || context.type !== 'style') {
      return data;
    }

    const transformResult = await this.adapter.transformResource(
        data, {type: 'style', containingFile: context.containingFile, resourceFile: null});
    if (transformResult === null) {
      return data;
    }

    return transformResult.content;
  }

  /**
   * Load the resource at the given url, synchronously.
   *
   * 同步加载给定 url 的资源。
   *
   * The contents of the resource may have been cached by a previous call to `preload()`.
   *
   * 资源的内容可能已通过先前对 `preload()` 的调用而被缓存。
   *
   * @param resolvedUrl The url (resolved by a call to `resolve()`) of the resource to load.
   *
   * 要加载的资源的 url（通过调用 `resolve()` 来解析）。
   *
   * @returns
   *
   * The contents of the resource.
   *
   * 资源的内容。
   *
   */
  load(resolvedUrl: string): string {
    if (this.cache.has(resolvedUrl)) {
      return this.cache.get(resolvedUrl)!;
    }

    const result = this.adapter.readResource ? this.adapter.readResource(resolvedUrl) :
                                               this.adapter.readFile(resolvedUrl);
    if (typeof result !== 'string') {
      throw new Error(`HostResourceLoader: loader(${resolvedUrl}) returned a Promise`);
    }
    this.cache.set(resolvedUrl, result);
    return result;
  }

  /**
   * Invalidate the entire resource cache.
   *
   * 使整个资源缓存无效。
   *
   */
  invalidate(): void {
    this.cache.clear();
  }

  /**
   * Attempt to resolve `url` in the context of `fromFile`, while respecting the rootDirs
   * option from the tsconfig. First, normalize the file name.
   *
   * 尝试在 `fromFile` 的上下文中解析 `url` ，同时尊重 tsconfig 中的 rootDirs
   * 选项。首先，规范化文件名。
   *
   */
  private fallbackResolve(url: string, fromFile: string): string|null {
    let candidateLocations: string[];
    if (url.startsWith('/')) {
      // This path is not really an absolute path, but instead the leading '/' means that it's
      // rooted in the project rootDirs. So look for it according to the rootDirs.
      candidateLocations = this.getRootedCandidateLocations(url);
    } else {
      // This path is a "relative" path and can be resolved as such. To make this easier on the
      // downstream resolver, the './' prefix is added if missing to distinguish these paths from
      // absolute node_modules paths.
      if (!url.startsWith('.')) {
        url = `./${url}`;
      }
      candidateLocations = this.getResolvedCandidateLocations(url, fromFile);
    }

    for (const candidate of candidateLocations) {
      if (this.adapter.fileExists(candidate)) {
        return candidate;
      } else if (CSS_PREPROCESSOR_EXT.test(candidate)) {
        /**
         * If the user specified styleUrl points to *.scss, but the Sass compiler was run before
         * Angular, then the resource may have been generated as *.css. Simply try the resolution
         * again.
         *
         * 如果用户指定的 styleUrl 指向了*.scss，但 Sass 编译器是在 Angular
         * 之前运行的，则资源可能已生成为*.css。只需再次尝试此分辨率。
         *
         */
        const cssFallbackUrl = candidate.replace(CSS_PREPROCESSOR_EXT, '.css');
        if (this.adapter.fileExists(cssFallbackUrl)) {
          return cssFallbackUrl;
        }
      }
    }
    return null;
  }

  private getRootedCandidateLocations(url: string): AbsoluteFsPath[] {
    // The path already starts with '/', so add a '.' to make it relative.
    const segment: PathSegment = ('.' + url) as PathSegment;
    return this.adapter.rootDirs.map(rootDir => join(rootDir, segment));
  }

  /**
   * TypeScript provides utilities to resolve module names, but not resource files (which aren't
   * a part of the ts.Program). However, TypeScript's module resolution can be used creatively
   * to locate where resource files should be expected to exist. Since module resolution returns
   * a list of file names that were considered, the loader can enumerate the possible locations
   * for the file by setting up a module resolution for it that will fail.
   *
   * TypeScript 提供了工具来解析模块名称，但不提供资源文件（不属于 ts.Program
   * 的一部分）。但是，TypeScript
   * 的模块解析可以创造性地用于定位资源文件应该存在的位置。由于模块解析会返回被考虑的文件名列表，因此加载器可以通过为文件设置将失败的模块解析来枚举文件的可能位置。
   *
   */
  private getResolvedCandidateLocations(url: string, fromFile: string): string[] {
    // `failedLookupLocations` is in the name of the type ts.ResolvedModuleWithFailedLookupLocations
    // but is marked @internal in TypeScript. See
    // https://github.com/Microsoft/TypeScript/issues/28770.
    type ResolvedModuleWithFailedLookupLocations =
        ts.ResolvedModuleWithFailedLookupLocations&{failedLookupLocations: ReadonlyArray<string>};

    // clang-format off
    const failedLookup = ts.resolveModuleName(url + RESOURCE_MARKER, fromFile, this.options, this.lookupResolutionHost) as ResolvedModuleWithFailedLookupLocations;
    // clang-format on
    if (failedLookup.failedLookupLocations === undefined) {
      throw new Error(
          `Internal error: expected to find failedLookupLocations during resolution of resource '${
              url}' in context of ${fromFile}`);
    }

    return failedLookup.failedLookupLocations
        .filter(candidate => candidate.endsWith(RESOURCE_MARKER_TS))
        .map(candidate => candidate.slice(0, -RESOURCE_MARKER_TS.length));
  }
}

/**
 * Derives a `ts.ModuleResolutionHost` from a compiler adapter that recognizes the special resource
 * marker and does not go to the filesystem for these requests, as they are known not to exist.
 *
 * 从可识别特殊资源标记的编译器适配器派生一个 `ts.ModuleResolutionHost`
 * ，并且不会转到这些请求的文件系统，因为已知它们不存在。
 *
 */
function createLookupResolutionHost(adapter: NgCompilerAdapter):
    RequiredDelegations<ts.ModuleResolutionHost> {
  return {
    directoryExists(directoryName: string): boolean {
      if (directoryName.includes(RESOURCE_MARKER)) {
        return false;
      } else if (adapter.directoryExists !== undefined) {
        return adapter.directoryExists(directoryName);
      } else {
        // TypeScript's module resolution logic assumes that the directory exists when no host
        // implementation is available.
        return true;
      }
    },
    fileExists(fileName: string): boolean {
      if (fileName.includes(RESOURCE_MARKER)) {
        return false;
      } else {
        return adapter.fileExists(fileName);
      }
    },
    readFile: adapter.readFile.bind(adapter),
    getCurrentDirectory: adapter.getCurrentDirectory.bind(adapter),
    getDirectories: adapter.getDirectories?.bind(adapter),
    realpath: adapter.realpath?.bind(adapter),
    trace: adapter.trace?.bind(adapter),
    useCaseSensitiveFileNames: typeof adapter.useCaseSensitiveFileNames === 'function' ?
        adapter.useCaseSensitiveFileNames.bind(adapter) :
        adapter.useCaseSensitiveFileNames
  };
}

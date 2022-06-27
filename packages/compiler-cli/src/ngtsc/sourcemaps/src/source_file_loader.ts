/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import mapHelpers from 'convert-source-map';

import {AbsoluteFsPath, ReadonlyFileSystem} from '../../file_system';
import {Logger} from '../../logging';

import {ContentOrigin} from './content_origin';
import {MapAndPath, RawSourceMap, SourceMapInfo} from './raw_source_map';
import {SourceFile} from './source_file';

const SCHEME_MATCHER = /^([a-z][a-z0-9.-]*):\/\//i;

/**
 * This class can be used to load a source file, its associated source map and any upstream sources.
 *
 * 此类可用于加载源文件、其关联的源映射和任何上游源。
 *
 * Since a source file might reference (or include) a source map, this class can load those too.
 * Since a source map might reference other source files, these are also loaded as needed.
 *
 * 由于源文件可能引用（或包含）源映射，因此此类也可以加载它们。由于源映射可能会引用其他源文件，因此还会根据需要加载这些文件。
 *
 * This is done recursively. The result is a "tree" of `SourceFile` objects, each containing
 * mappings to other `SourceFile` objects as necessary.
 *
 * 这是递归完成的。结果是一棵 `SourceFile` 对象的“树”，每个对象都根据需要包含到其他 `SourceFile`
 * 对象的映射。
 *
 */
export class SourceFileLoader {
  private currentPaths: AbsoluteFsPath[] = [];

  constructor(
      private fs: ReadonlyFileSystem, private logger: Logger,
      /** A map of URL schemes to base paths. The scheme name should be lowercase. */
      private schemeMap: Record<string, AbsoluteFsPath>) {}

  /**
   * Load a source file from the provided content and source map, and recursively load any
   * referenced source files.
   *
   * 从提供的内容和源映射加载源文件，并递归加载任何引用的源文件。
   *
   * @param sourcePath The path to the source file to load.
   *
   * 要加载的源文件的路径。
   *
   * @param contents The contents of the source file to load.
   *
   * 要加载的源文件的内容。
   *
   * @param mapAndPath The raw source-map and the path to the source-map file.
   *
   * 原始 source-map 和 source-map 文件的路径。
   *
   * @returns
   *
   * a SourceFile object created from the `contents` and provided source-map info.
   *
   * 从 `contents` 创建并提供 source-map 信息的 SourceFile 对象。
   *
   */
  loadSourceFile(sourcePath: AbsoluteFsPath, contents: string, mapAndPath: MapAndPath): SourceFile;
  /**
   * Load a source file from the provided content, compute its source map, and recursively load any
   * referenced source files.
   *
   * 从提供的内容加载源文件，计算其源映射，并递归加载任何引用的源文件。
   *
   * @param sourcePath The path to the source file to load.
   *
   * 要加载的源文件的路径。
   *
   * @param contents The contents of the source file to load.
   *
   * 要加载的源文件的内容。
   *
   * @returns
   *
   * a SourceFile object created from the `contents` and computed source-map info.
   *
   * 从 `contents` 和计算的 source-map 信息创建的 SourceFile 对象。
   *
   */
  loadSourceFile(sourcePath: AbsoluteFsPath, contents: string): SourceFile;
  /**
   * Load a source file from the file-system, compute its source map, and recursively load any
   * referenced source files.
   *
   * 从文件系统加载源文件，计算其源映射，并递归加载任何引用的源文件。
   *
   * @param sourcePath The path to the source file to load.
   *
   * 要加载的源文件的路径。
   *
   * @returns
   *
   * a SourceFile object if its contents could be loaded from disk, or null otherwise.
   *
   * 如果可以从磁盘加载其内容，则为 SourceFile 对象，否则为 null 。
   *
   */
  loadSourceFile(sourcePath: AbsoluteFsPath): SourceFile|null;
  loadSourceFile(
      sourcePath: AbsoluteFsPath, contents: string|null = null,
      mapAndPath: MapAndPath|null = null): SourceFile|null {
    const contentsOrigin = contents !== null ? ContentOrigin.Provided : ContentOrigin.FileSystem;
    const sourceMapInfo: SourceMapInfo|null =
        mapAndPath && {origin: ContentOrigin.Provided, ...mapAndPath};
    return this.loadSourceFileInternal(sourcePath, contents, contentsOrigin, sourceMapInfo);
  }

  /**
   * The overload used internally to load source files referenced in a source-map.
   *
   * 在内部用于加载 source-map 中引用的源文件的重载。
   *
   * In this case there is no guarantee that it will return a non-null SourceMap.
   *
   * 在这种情况下，不能保证它将返回非 null SourceMap。
   *
   * @param sourcePath The path to the source file to load.
   *
   * 要加载的源文件的路径。
   *
   * @param contents The contents of the source file to load, if provided inline. If `null`,
   *     the contents will be read from the file at the `sourcePath`.
   *
   * 要加载的源文件的内容（如果内联提供）。如果为 `null` ，则将从 `sourcePath` 处的文件中读取内容。
   *
   * @param sourceOrigin Describes where the source content came from.
   *
   * 描述源内容的来源。
   *
   * @param sourceMapInfo The raw contents and path of the source-map file. If `null` the
   *     source-map will be computed from the contents of the source file, either inline or loaded
   *     from the file-system.
   *
   * source-map 文件的原始内容和路径。如果为 `null` ，则 source-map
   * 将根据源文件的内容计算，可以是内联的，也可以是从文件系统加载的。
   *
   * @returns
   *
   * a SourceFile if the content for one was provided or was able to be loaded from disk,
   * `null` otherwise.
   *
   * 如果提供了某个内容的内容或可以从磁盘加载，则为 SourceFile ，否则为 `null` 。
   *
   */
  private loadSourceFileInternal(
      sourcePath: AbsoluteFsPath, contents: string|null, sourceOrigin: ContentOrigin,
      sourceMapInfo: SourceMapInfo|null): SourceFile|null {
    const previousPaths = this.currentPaths.slice();
    try {
      if (contents === null) {
        if (!this.fs.exists(sourcePath)) {
          return null;
        }
        contents = this.readSourceFile(sourcePath);
      }

      // If not provided try to load the source map based on the source itself
      if (sourceMapInfo === null) {
        sourceMapInfo = this.loadSourceMap(sourcePath, contents, sourceOrigin);
      }

      let sources: (SourceFile|null)[] = [];
      if (sourceMapInfo !== null) {
        const basePath = sourceMapInfo.mapPath || sourcePath;
        sources = this.processSources(basePath, sourceMapInfo);
      }

      return new SourceFile(sourcePath, contents, sourceMapInfo, sources, this.fs);
    } catch (e) {
      this.logger.warn(
          `Unable to fully load ${sourcePath} for source-map flattening: ${(e as Error).message}`);
      return null;
    } finally {
      // We are finished with this recursion so revert the paths being tracked
      this.currentPaths = previousPaths;
    }
  }

  /**
   * Find the source map associated with the source file whose `sourcePath` and `contents` are
   * provided.
   *
   * 查找与提供了 `sourcePath` 和 `contents` 的源文件关联的源映射。
   *
   * Source maps can be inline, as part of a base64 encoded comment, or external as a separate file
   * whose path is indicated in a comment or implied from the name of the source file itself.
   *
   * 源映射可以是内联的，作为 base64
   * 编码注释的一部分，也可以是外部的作为单独的文件，其路径在注释中指示或从源文件本身的名称中暗示。
   *
   * @param sourcePath the path to the source file.
   *
   * 源文件的路径。
   *
   * @param sourceContents the contents of the source file.
   *
   * 源文件的内容。
   *
   * @param sourceOrigin where the content of the source file came from.
   *
   * 源文件的内容来自哪里。
   *
   * @returns
   *
   * the parsed contents and path of the source-map, if loading was successful, null
   *     otherwise.
   *
   * source-map 的解析内容和路径，如果加载成功，则为 null 。
   *
   */
  private loadSourceMap(
      sourcePath: AbsoluteFsPath, sourceContents: string,
      sourceOrigin: ContentOrigin): SourceMapInfo|null {
    // Only consider a source-map comment from the last non-empty line of the file, in case there
    // are embedded source-map comments elsewhere in the file (as can be the case with bundlers like
    // webpack).
    const lastLine = this.getLastNonEmptyLine(sourceContents);
    const inline = mapHelpers.commentRegex.exec(lastLine);
    if (inline !== null) {
      return {
        map: mapHelpers.fromComment(inline.pop()!).sourcemap,
        mapPath: null,
        origin: ContentOrigin.Inline,
      };
    }

    if (sourceOrigin === ContentOrigin.Inline) {
      // The source file was provided inline and its contents did not include an inline source-map.
      // So we don't try to load an external source-map from the file-system, since this can lead to
      // invalid circular dependencies.
      return null;
    }

    const external = mapHelpers.mapFileCommentRegex.exec(lastLine);
    if (external) {
      try {
        const fileName = external[1] || external[2];
        const externalMapPath = this.fs.resolve(this.fs.dirname(sourcePath), fileName);
        return {
          map: this.readRawSourceMap(externalMapPath),
          mapPath: externalMapPath,
          origin: ContentOrigin.FileSystem,
        };
      } catch (e) {
        this.logger.warn(`Unable to fully load ${sourcePath} for source-map flattening: ${
            (e as Error).message}`);
        return null;
      }
    }

    const impliedMapPath = this.fs.resolve(sourcePath + '.map');
    if (this.fs.exists(impliedMapPath)) {
      return {
        map: this.readRawSourceMap(impliedMapPath),
        mapPath: impliedMapPath,
        origin: ContentOrigin.FileSystem,
      };
    }

    return null;
  }

  /**
   * Iterate over each of the "sources" for this source file's source map, recursively loading each
   * source file and its associated source map.
   *
   * 迭代此源文件的源映射的每个“源”，递归加载每个源文件及其关联的源映射。
   *
   */
  private processSources(basePath: AbsoluteFsPath, {map, origin: sourceMapOrigin}: SourceMapInfo):
      (SourceFile|null)[] {
    const sourceRoot = this.fs.resolve(
        this.fs.dirname(basePath), this.replaceSchemeWithPath(map.sourceRoot || ''));
    return map.sources.map((source, index) => {
      const path = this.fs.resolve(sourceRoot, this.replaceSchemeWithPath(source));
      const content = map.sourcesContent && map.sourcesContent[index] || null;
      // The origin of this source file is "inline" if we extracted it from the source-map's
      // `sourcesContent`, except when the source-map itself was "provided" in-memory.
      // An inline source file is treated as if it were from the file-system if the source-map that
      // contains it was provided in-memory. The first call to `loadSourceFile()` is special in that
      // if you "provide" the contents of the source-map in-memory then we don't want to block
      // loading sources from the file-system just because this source-map had an inline source.
      const sourceOrigin = content !== null && sourceMapOrigin !== ContentOrigin.Provided ?
          ContentOrigin.Inline :
          ContentOrigin.FileSystem;
      return this.loadSourceFileInternal(path, content, sourceOrigin, null);
    });
  }

  /**
   * Load the contents of the source file from disk.
   *
   * 从磁盘加载源文件的内容。
   *
   * @param sourcePath The path to the source file.
   *
   * 源文件的路径。
   *
   */
  private readSourceFile(sourcePath: AbsoluteFsPath): string {
    this.trackPath(sourcePath);
    return this.fs.readFile(sourcePath);
  }

  /**
   * Load the source map from the file at `mapPath`, parsing its JSON contents into a `RawSourceMap`
   * object.
   *
   * 从 `mapPath` 的文件加载源映射，将其 JSON 内容解析为 `RawSourceMap` 对象。
   *
   * @param mapPath The path to the source-map file.
   *
   * source-map 文件的路径。
   *
   */
  private readRawSourceMap(mapPath: AbsoluteFsPath): RawSourceMap {
    this.trackPath(mapPath);
    return JSON.parse(this.fs.readFile(mapPath)) as RawSourceMap;
  }

  /**
   * Track source file paths if we have loaded them from disk so that we don't get into an infinite
   * recursion.
   *
   * 如果我们从磁盘加载了源文件路径，则跟踪它们，以便我们不会进入无限递归。
   *
   */
  private trackPath(path: AbsoluteFsPath): void {
    if (this.currentPaths.includes(path)) {
      throw new Error(
          `Circular source file mapping dependency: ${this.currentPaths.join(' -> ')} -> ${path}`);
    }
    this.currentPaths.push(path);
  }

  private getLastNonEmptyLine(contents: string): string {
    let trailingWhitespaceIndex = contents.length - 1;
    while (trailingWhitespaceIndex > 0 &&
           (contents[trailingWhitespaceIndex] === '\n' ||
            contents[trailingWhitespaceIndex] === '\r')) {
      trailingWhitespaceIndex--;
    }
    let lastRealLineIndex = contents.lastIndexOf('\n', trailingWhitespaceIndex - 1);
    if (lastRealLineIndex === -1) {
      lastRealLineIndex = 0;
    }
    return contents.slice(lastRealLineIndex + 1);
  }

  /**
   * Replace any matched URL schemes with their corresponding path held in the schemeMap.
   *
   * 将任何匹配的 URL 方案替换为 schemeMap 中保存的相应路径。
   *
   * Some build tools replace real file paths with scheme prefixed paths - e.g. `webpack://`.
   * We use the `schemeMap` passed to this class to convert such paths to "real" file paths.
   * In some cases, this is not possible, since the file was actually synthesized by the build tool.
   * But the end result is better than prefixing the sourceRoot in front of the scheme.
   *
   * 某些构建工具将真实文件路径替换为以 scheme 为前缀的路径——例如 `webpack://`
   * 。我们使用传递给此类的 `schemeMap`
   * 将此类路径转换为“真实”文件路径。在某些情况下，这是不可能的，因为该文件实际上是由构建工具合成的。但最终结果比在方案前面添加
   * sourceRoot 前缀要好。
   *
   */
  private replaceSchemeWithPath(path: string): string {
    return path.replace(
        SCHEME_MATCHER, (_: string, scheme: string) => this.schemeMap[scheme.toLowerCase()] || '');
  }
}

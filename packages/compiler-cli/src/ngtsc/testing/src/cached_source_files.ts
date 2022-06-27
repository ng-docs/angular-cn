/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {basename} from '../../file_system';

// A cache of source files that are typically used across tests and are expensive to parse.
let sourceFileCache = new Map<string, ts.SourceFile>();

/**
 * If the `fileName` is determined to benefit from caching across tests, a parsed `ts.SourceFile`
 * is returned from a shared cache. If caching is not applicable for the requested `fileName`, then
 * `null` is returned.
 *
 * 如果确定 `fileName` 可以从跨测试的缓存中受益，则会从共享缓存返回解析后的 `ts.SourceFile`
 * 。如果缓存不适用于所请求的 `fileName` ，则返回 `null` 。
 *
 * Even if a `ts.SourceFile` already exists for the given `fileName` will the contents be loaded
 * from disk, such that it can be verified whether the cached `ts.SourceFile` is identical to the
 * disk contents. If there is a difference, a new `ts.SourceFile` is parsed from the loaded contents
 * which replaces the prior cache entry.
 *
 * 即使给定 `fileName` 名的 `ts.SourceFile` 已经存在，也会从磁盘加载内容，以便可以验证缓存的
 * `ts.SourceFile` 是否与磁盘内容相同。如果有区别，则会从加载的内容中解析一个新的 `ts.SourceFile`
 * ，它会替换以前的缓存条目。
 *
 * @param fileName the path of the file to request a source file for.
 *
 * 要请求源文件的文件的路径。
 *
 * @param load a callback to load the contents of the file; this is even called when a cache entry
 * is available to verify that the cached `ts.SourceFile` corresponds with the contents on disk.
 *
 * 加载文件内容的回调；当有缓存条目可用于验证缓存的 `ts.SourceFile`
 * 与磁盘上的内容对应时，甚至会调用此方法。
 *
 */
export function getCachedSourceFile(
    fileName: string, load: () => string | undefined): ts.SourceFile|null {
  if (!/^lib\..+\.d\.ts$/.test(basename(fileName))) {
    return null;
  }

  const content = load();
  if (content === undefined) {
    return null;
  }
  if (!sourceFileCache.has(fileName) || sourceFileCache.get(fileName)!.text !== content) {
    const sf = ts.createSourceFile(fileName, content, ts.ScriptTarget.ES2015);
    sourceFileCache.set(fileName, sf);
  }
  return sourceFileCache.get(fileName)!;
}

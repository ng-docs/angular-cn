/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {AbsoluteFsPath} from '../../../src/ngtsc/file_system';
import {SourceFile, SourceFileLoader} from '../../../src/ngtsc/sourcemaps';

/**
 * A function that will return a `SourceFile` object (or null) for the current file being linked.
 *
 * 一个函数，它将返回正在链接的当前文件的 `SourceFile` 对象（或 null）。
 *
 */
export type GetSourceFileFn = () => SourceFile|null;

/**
 * Create a `GetSourceFileFn` that will return the `SourceFile` being linked or `null`, if not
 * available.
 *
 * 创建一个 `GetSourceFileFn` ，它将返回正在链接的 `SourceFile` 或 `null`（如果不可用）。
 *
 */
export function createGetSourceFile(
    sourceUrl: AbsoluteFsPath, code: string, loader: SourceFileLoader|null): GetSourceFileFn {
  if (loader === null) {
    // No source-mapping so just return a function that always returns `null`.
    return () => null;
  } else {
    // Source-mapping is available so return a function that will load (and cache) the `SourceFile`.
    let sourceFile: SourceFile|null|undefined = undefined;
    return () => {
      if (sourceFile === undefined) {
        sourceFile = loader.loadSourceFile(sourceUrl, code);
      }
      return sourceFile;
    };
  }
}

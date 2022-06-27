/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';

import {AbsoluteFsPath} from '../../../src/ngtsc/file_system';
import {ImportRewriter, NoopImportRewriter, R3SymbolsImportRewriter} from '../../../src/ngtsc/imports';

import {NgccFlatImportRewriter} from './ngcc_import_rewriter';

/**
 * Information about a file that has been rendered.
 *
 * 有关已呈现的文件的信息。
 *
 */
export interface FileToWrite {
  /**
   * Path to where the file should be written.
   *
   * 应该写入文件的路径。
   *
   */
  path: AbsoluteFsPath;
  /**
   * The contents of the file to be be written.
   *
   * 要写入的文件的内容。
   *
   */
  contents: string;
}

/**
 * Create an appropriate ImportRewriter given the parameters.
 *
 * 给定参数，创建一个适当的 ImportRewriter 。
 *
 */
export function getImportRewriter(
    r3SymbolsFile: ts.SourceFile|null, isCore: boolean, isFlat: boolean): ImportRewriter {
  if (isCore && isFlat) {
    return new NgccFlatImportRewriter();
  } else if (isCore) {
    return new R3SymbolsImportRewriter(r3SymbolsFile!.fileName);
  } else {
    return new NoopImportRewriter();
  }
}

export function stripExtension<T extends string>(filePath: T): T {
  return filePath.replace(/\.(js|d\.ts)$/, '') as T;
}

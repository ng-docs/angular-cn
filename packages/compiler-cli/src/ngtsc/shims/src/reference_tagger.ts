/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {absoluteFromSourceFile} from '../../file_system';
import {isNonDeclarationTsPath} from '../../util/src/typescript';

import {isShim, sfExtensionData} from './expando';
import {makeShimFileName} from './util';

/**
 * Manipulates the `referencedFiles` property of `ts.SourceFile`s to add references to shim files
 * for each original source file, causing the shims to be loaded into the program as well.
 *
 * 操作 `ts.SourceFile` s 的 `referencedFiles` 属性以添加对每个原始源文件的 shim 文件的引用，从而使
 * shims 也被加载到程序中。
 *
 * `ShimReferenceTagger`s are intended to operate during program creation only.
 *
 * `ShimReferenceTagger` 旨在仅在程序创建期间运行。
 *
 */
export class ShimReferenceTagger {
  private suffixes: string[];

  /**
   * Tracks which original files have been processed and had shims generated if necessary.
   *
   * 跟踪哪些原始文件已被处理并在必要时生成了 shim。
   *
   * This is used to avoid generating shims twice for the same file.
   *
   * 这用于避免为同一个文件生成两次 shim。
   *
   */
  private tagged = new Set<ts.SourceFile>();

  /**
   * Whether shim tagging is currently being performed.
   *
   * 当前是否正在执行 shim 标记。
   *
   */
  private enabled: boolean = true;

  constructor(shimExtensions: string[]) {
    this.suffixes = shimExtensions.map(extension => `.${extension}.ts`);
  }

  /**
   * Tag `sf` with any needed references if it's not a shim itself.
   *
   * 如果 `sf` 不是 shim 本身，则使用任何需要的引用标记它。
   *
   */
  tag(sf: ts.SourceFile): void {
    if (!this.enabled || sf.isDeclarationFile || isShim(sf) || this.tagged.has(sf) ||
        !isNonDeclarationTsPath(sf.fileName)) {
      return;
    }

    const ext = sfExtensionData(sf);

    // If this file has never been tagged before, capture its `referencedFiles` in the extension
    // data.
    if (ext.originalReferencedFiles === null) {
      ext.originalReferencedFiles = sf.referencedFiles;
    }

    const referencedFiles = [...ext.originalReferencedFiles];


    const sfPath = absoluteFromSourceFile(sf);
    for (const suffix of this.suffixes) {
      referencedFiles.push({
        fileName: makeShimFileName(sfPath, suffix),
        pos: 0,
        end: 0,
      });
    }

    ext.taggedReferenceFiles = referencedFiles;
    sf.referencedFiles = referencedFiles;
    this.tagged.add(sf);
  }

  /**
   * Disable the `ShimReferenceTagger` and free memory associated with tracking tagged files.
   *
   * 禁用 `ShimReferenceTagger` 并释放与跟踪标记文件关联的内存。
   *
   */
  finalize(): void {
    this.enabled = false;
    this.tagged.clear();
  }
}

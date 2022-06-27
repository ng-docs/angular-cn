/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {NgtscCompilerHost} from '../../file_system';

import {getCachedSourceFile} from './cached_source_files';

/**
 * A compiler host intended to improve test performance by caching default library source files for
 * reuse across tests.
 *
 * 一种编译器主机，旨在通过缓存默认库源文件以供跨测试重用来提高测试性能。
 *
 */
export class NgtscTestCompilerHost extends NgtscCompilerHost {
  override getSourceFile(fileName: string, languageVersion: ts.ScriptTarget): ts.SourceFile
      |undefined {
    const cachedSf = getCachedSourceFile(fileName, () => this.readFile(fileName));
    if (cachedSf !== null) {
      return cachedSf;
    }
    return super.getSourceFile(fileName, languageVersion);
  }
}

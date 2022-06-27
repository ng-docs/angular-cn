/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {ImportManagerUpdateRecorder} from '../../utils/import_manager';

/**
 * Update recorder interface that is used to transform source files
 * in a non-colliding way.
 *
 * 更新用于以非冲突方式转换源文件的记录器接口。
 *
 */
export interface UpdateRecorder extends ImportManagerUpdateRecorder {
  updateNode(
      oldNode: ts.VariableDeclaration, newNode: ts.VariableDeclaration,
      sourceFile: ts.SourceFile): void;
  commitUpdate(): void;
}

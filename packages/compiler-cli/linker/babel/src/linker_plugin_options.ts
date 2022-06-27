/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {LinkerOptions} from '../..';
import {ReadonlyFileSystem} from '../../../src/ngtsc/file_system';
import {Logger} from '../../../src/ngtsc/logging';

export interface LinkerPluginOptions extends Partial<LinkerOptions> {
  /**
   * File-system, used to load up the input source-map and content.
   *
   * 文件系统，用于加载输入的 source-map 和内容。
   *
   */
  fileSystem: ReadonlyFileSystem;

  /**
   * Logger used by the linker.
   *
   * 链接器使用的记录器。
   *
   */
  logger: Logger;
}


/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {AbsoluteFsPath} from '../../../src/ngtsc/file_system';
import {EntryPoint, EntryPointJsonProperty} from '../packages/entry_point';
import {EntryPointBundle} from '../packages/entry_point_bundle';
import {FileToWrite} from '../rendering/utils';

/**
 * Responsible for writing out the transformed files to disk.
 *
 * 负责将转换后的文件写出到磁盘。
 *
 */
export interface FileWriter {
  writeBundle(
      bundle: EntryPointBundle, transformedFiles: FileToWrite[],
      formatProperties: EntryPointJsonProperty[]): void;

  /**
   * Revert the changes to an entry-point processed for the specified format-properties by the same
   * `FileWriter` implementation.
   *
   * 将更改恢复到同一个 `FileWriter` 实现为指定的 format-properties 处理的入口点。
   *
   * @param entryPoint The entry-point to revert.
   *
   * 要恢复的入口点。
   *
   * @param transformedFilePaths The original paths of the transformed files. (The transformed files
   *     may be written at the same or a different location, depending on the `FileWriter`
   *     implementation.)
   *
   * 转换后文件的原始路径。（转换后的文件可以写在相同或不同的位置，具体取决于 `FileWriter` 实现。）
   *
   * @param formatProperties The format-properties pointing to the entry-point.
   *
   * 指向入口点的格式属性。
   *
   */
  revertBundle(
      entryPoint: EntryPoint, transformedFilePaths: AbsoluteFsPath[],
      formatProperties: EntryPointJsonProperty[]): void;
}

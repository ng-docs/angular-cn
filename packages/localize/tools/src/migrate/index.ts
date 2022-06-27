/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {getFileSystem, Logger} from '@angular/compiler-cli/private/localize';

import {migrateFile, MigrationMapping} from './migrate';

export interface MigrateFilesOptions {
  /**
   * The base path for other paths provided in these options.
   * This should either be absolute or relative to the current working directory.
   *
   * 这些选项中提供的其他路径的基本路径。这应该是绝对的或相对于当前工作目录。
   *
   */
  rootPath: string;

  /**
   * Paths to the files that should be migrated. Should be relative to the `rootPath`.
   *
   * 应该迁移的文件的路径。应该相对于 `rootPath` 。
   *
   */
  translationFilePaths: string[];

  /**
   * Path to the file containing the message ID mappings. Should be relative to the `rootPath`.
   *
   * 包含消息 ID 映射的文件的路径。应该相对于 `rootPath` 。
   *
   */
  mappingFilePath: string;

  /**
   * Logger to use for diagnostic messages.
   *
   * 用于诊断消息的记录器。
   *
   */
  logger: Logger;
}

/**
 * Migrates the legacy message IDs based on the passed in configuration.
 *
 * 根据传入的配置迁移旧版消息 ID。
 *
 */
export function migrateFiles({
  rootPath,
  translationFilePaths,
  mappingFilePath,
  logger,
}: MigrateFilesOptions) {
  const fs = getFileSystem();
  const absoluteMappingPath = fs.resolve(rootPath, mappingFilePath);
  const mapping = JSON.parse(fs.readFile(absoluteMappingPath)) as MigrationMapping;

  if (Object.keys(mapping).length === 0) {
    logger.warn(
        `Mapping file at ${absoluteMappingPath} is empty. Either there are no messages ` +
        `that need to be migrated, or the extraction step failed to find them.`);
  } else {
    translationFilePaths.forEach(path => {
      const absolutePath = fs.resolve(rootPath, path);
      const sourceCode = fs.readFile(absolutePath);
      fs.writeFile(absolutePath, migrateFile(sourceCode, mapping));
    });
  }
}

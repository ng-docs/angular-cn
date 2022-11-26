/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Mapping between legacy message IDs and their canonical counterparts.
 *
 * 旧版消息 ID 与其规范对应项之间的映射。
 *
 */
export type MigrationMapping = {
  [legacyId: string]: string;
};

/**
 * Migrates the legacy message IDs within a single file.
 *
 * 迁移单个文件中的旧版消息 ID。
 *
 */
export function migrateFile(sourceCode: string, mapping: MigrationMapping) {
  const legacyIds = Object.keys(mapping);

  for (const legacyId of legacyIds) {
    const canonicalId = mapping[legacyId];
    const pattern = new RegExp(escapeRegExp(legacyId), 'g');
    sourceCode = sourceCode.replace(pattern, canonicalId);
  }

  return sourceCode;
}

/**
 * Escapes special regex characters in a string.
 *
 * 转义字符串中的特殊正则表达式字符。
 *
 */
function escapeRegExp(str: string): string {
  return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}

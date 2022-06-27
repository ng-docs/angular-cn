/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * An unrecoverable error during linking.
 *
 * 链接期间出现不可恢复的错误。
 *
 */
export class FatalLinkerError extends Error {
  readonly type = 'FatalLinkerError';

  /**
   * Create a new FatalLinkerError.
   *
   * 创建一个新的 FatalLinkerError 。
   *
   * @param node The AST node where the error occurred.
   *
   * 发生错误的 AST 节点。
   *
   * @param message A description of the error.
   *
   * 错误的描述。
   *
   */
  constructor(public node: unknown, message: string) {
    super(message);
  }
}

/**
 * Whether the given object `e` is a FatalLinkerError.
 *
 * 给定的对象 `e` 是否是 FatalLinkerError。
 *
 */
export function isFatalLinkerError(e: any): e is FatalLinkerError {
  return e && e.type === 'FatalLinkerError';
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * The list of error codes used in runtime code of the `common` package.
 * Reserved error code range: 2000-2999.
 *
 * `common` 包的运行时代码中使用的错误代码列表。保留的错误代码范围： 2000-2999。
 *
 */
export const enum RuntimeErrorCode {
  // NgSwitch errors
  PARENT_NG_SWITCH_NOT_FOUND = 2000,
  // Pipe errors
  INVALID_PIPE_ARGUMENT = 2100
}

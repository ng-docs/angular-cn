/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * The list of error codes used in runtime code of the `forms` package.
 * Reserved error code range: 1000-1999.
 *
 * `forms` 包的运行时代码中使用的错误代码列表。保留的错误代码范围： 1000-1999。
 *
 */
export const enum RuntimeErrorCode {
  // Reactive Forms errors (10xx)

  // Basic structure validation errors
  NO_CONTROLS = 1000,
  MISSING_CONTROL = 1001,
  MISSING_CONTROL_VALUE = 1002,

  // Template-driven Forms errors (11xx)
}

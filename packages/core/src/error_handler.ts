/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {getOriginalError} from './util/errors';

/**
 * Provides a hook for centralized exception handling.
 *
 * 提供用于集中式异常处理的挂钩。
 *
 * The default implementation of `ErrorHandler` prints error messages to the `console`. To
 * intercept error handling, write a custom exception handler that replaces this default as
 * appropriate for your app.
 *
 * `ErrorHandler` 的默认实现将错误消息打印到
 * `console`。要拦截错误处理，请编写一个自定义的异常处理器，该异常处理器将把此默认行为改成你应用所需的。
 *
 * @usageNotes
 *
 * ### Example
 *
 * ### 例子
 *
 * ```
 * class MyErrorHandler implements ErrorHandler {
 *   handleError(error) {
 *     // do something with the exception
 *   }
 * }
 * ```
 *
 * @NgModule ({
 *   providers: [{provide: ErrorHandler, useClass: MyErrorHandler}]
 * })
 * class MyModule {}
 * ```
 * @publicApi
 */
export class ErrorHandler {
  /**
   * @internal
   */
  _console: Console = console;

  handleError(error: any): void {
    const originalError = this._findOriginalError(error);

    this._console.error('ERROR', error);
    if (originalError) {
      this._console.error('ORIGINAL ERROR', originalError);
    }
  }

  /** @internal */
  _findOriginalError(error: any): Error|null {
    let e = error && getOriginalError(error);
    while (e && getOriginalError(e)) {
      e = getOriginalError(e);
    }

    return e || null;
  }
}

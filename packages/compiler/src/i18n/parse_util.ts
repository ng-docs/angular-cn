/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ParseError, ParseSourceSpan} from '../parse_util';

/**
 * An i18n error.
 *
 * 一个 i18n 错误。
 *
 */
export class I18nError extends ParseError {
  constructor(span: ParseSourceSpan, msg: string) {
    super(span, msg);
  }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {XhrFactory} from '@angular/common';
import {Injectable} from '@angular/core';

/**
 * A factory for `HttpXhrBackend` that uses the `XMLHttpRequest` browser API.
 *
 * 使用 `XMLHttpRequest` 浏览器 API 的 `HttpXhrBackend` 工厂。
 *
 */
@Injectable()
export class BrowserXhr implements XhrFactory {
  build(): XMLHttpRequest {
    return new XMLHttpRequest();
  }
}

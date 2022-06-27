/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * A wrapper around the `XMLHttpRequest` constructor.
 *
 * `XMLHttpRequest` 构造函数的包装器。
 *
 * @publicApi
 */
export abstract class XhrFactory {
  abstract build(): XMLHttpRequest;
}

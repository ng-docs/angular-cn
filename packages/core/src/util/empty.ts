/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {initNgDevMode} from './ng_dev_mode';

/**
 * This file contains reuseable "empty" symbols that can be used as default return values
 * in different parts of the rendering code. Because the same symbols are returned, this
 * allows for identity checks against these values to be consistently used by the framework
 * code.
 *
 * 此文件包含可重用的“空”符号，这些符号可以作为渲染代码的不同部分的默认返回值。因为返回了相同的符号，这允许框架代码一致地使用对这些值的身份检查。
 *
 */

export const EMPTY_OBJ: {} = {};
export const EMPTY_ARRAY: any[] = [];

// freezing the values prevents any code from accidentally inserting new values in
if ((typeof ngDevMode === 'undefined' || ngDevMode) && initNgDevMode()) {
  // These property accesses can be ignored because ngDevMode will be set to false
  // when optimizing code and the whole if statement will be dropped.
  // tslint:disable-next-line:no-toplevel-property-access
  Object.freeze(EMPTY_OBJ);
  // tslint:disable-next-line:no-toplevel-property-access
  Object.freeze(EMPTY_ARRAY);
}

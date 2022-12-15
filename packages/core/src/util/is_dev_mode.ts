/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {global} from './global';

/**
 * Returns whether Angular is in development mode.
 *
 * 返回 Angular 是否处于开发模式。
 *
 * By default, this is true, unless `enableProdMode` is invoked prior to calling this method or the
 * application is built using the Angular CLI with the `optimization` option.
 *
 * 默认情况下，这是 true，除非在调用此方法之前调用了 `enableProdMode` ，或者应用程序是使用带有
 * `optimization` 选项的 Angular CLI 构建的。
 *
 * @see {@link cli/build ng build}
 *
 * 默认情况下，这是正确的，除非用户在调用它之前调用 `enableProdMode`
 * @publicApi
 */
export function isDevMode(): boolean {
  return typeof ngDevMode === 'undefined' || !!ngDevMode;
}

/**
 * Disable Angular's development mode, which turns off assertions and other
 * checks within the framework.
 *
 * 禁用 Angular 的开发模式，该模式将关闭框架中的断言和其他检查。
 *
 * One important assertion this disables verifies that a change detection pass
 * does not result in additional changes to any bindings (also known as
 * unidirectional data flow).
 *
 * 一个重要的断言，它禁用了对变更检测不会导致对任何绑定的（也称为单向数据流）额外更改的验证。
 *
 * Using this method is discouraged as the Angular CLI will set production mode when using the
 * `optimization` option.
 *
 * 不鼓励使用此方法，因为 Angular CLI 将在使用 `optimization` 选项时设置生产模式。
 *
 * @see {@link cli/build ng build}
 * @publicApi
 */
export function enableProdMode(): void {
  // The below check is there so when ngDevMode is set via terser
  // `global['ngDevMode'] = false;` is also dropped.
  if (typeof ngDevMode === 'undefined' || ngDevMode) {
    global['ngDevMode'] = false;
  }
}

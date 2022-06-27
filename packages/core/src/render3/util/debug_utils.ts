/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Patch a `debug` property on top of the existing object.
 *
 * 在现有对象之上修补 `debug` 属性。
 *
 * NOTE: always call this method with `ngDevMode && attachDebugObject(...)`
 *
 * 注意：始终使用 `ngDevMode && attachDebugObject(...)` 调用此方法
 *
 * @param obj Object to patch
 *
 * 要修补的对象
 *
 * @param debug Value to patch
 *
 * 要修补的值
 *
 */
export function attachDebugObject(obj: any, debug: any): void {
  if (ngDevMode) {
    Object.defineProperty(obj, 'debug', {value: debug, enumerable: false});
  } else {
    throw new Error(
        'This method should be guarded with `ngDevMode` so that it can be tree shaken in production!');
  }
}

/**
 * Patch a `debug` property getter on top of the existing object.
 *
 * 在现有对象之上修补 `debug` 属性获取器。
 *
 * NOTE: always call this method with `ngDevMode && attachDebugObject(...)`
 *
 * 注意：始终使用 `ngDevMode && attachDebugObject(...)` 调用此方法
 *
 * @param obj Object to patch
 *
 * 要修补的对象
 *
 * @param debugGetter Getter returning a value to patch
 *
 * 将值返回到补丁的获取器
 *
 */
export function attachDebugGetter<T>(obj: T, debugGetter: (this: T) => any): void {
  if (ngDevMode) {
    Object.defineProperty(obj, 'debug', {get: debugGetter, enumerable: false});
  } else {
    throw new Error(
        'This method should be guarded with `ngDevMode` so that it can be tree shaken in production!');
  }
}

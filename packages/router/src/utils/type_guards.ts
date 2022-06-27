/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CanActivate, CanActivateChild, CanDeactivate, CanLoad} from '../models';
import {UrlTree} from '../url_tree';

/**
 * Simple function check, but generic so type inference will flow. Example:
 *
 * 简单的函数检查，但是通用的，因此类型推断会流动。示例：
 *
 * function product(a: number, b: number) {
 *   return a \* b;
 * }
 *
 * 函数 product(a: number, b: number) { return a \* b; }
 *
 * if (isFunction<product>(fn)) {
 *   return fn(1, 2);
 * } else {
 *   throw "Must provide the `product` function";
 * }
 *
 * if (isFunction<product>(fn)) { return fn(1, 2); } else { throw “必须提供 `product` 函数”; }
 *
 */
export function isFunction<T>(v: any): v is T {
  return typeof v === 'function';
}

export function isBoolean(v: any): v is boolean {
  return typeof v === 'boolean';
}

export function isUrlTree(v: any): v is UrlTree {
  return v instanceof UrlTree;
}

export function isCanLoad(guard: any): guard is CanLoad {
  return guard && isFunction<CanLoad>(guard.canLoad);
}

export function isCanActivate(guard: any): guard is CanActivate {
  return guard && isFunction<CanActivate>(guard.canActivate);
}

export function isCanActivateChild(guard: any): guard is CanActivateChild {
  return guard && isFunction<CanActivateChild>(guard.canActivateChild);
}

export function isCanDeactivate<T>(guard: any): guard is CanDeactivate<T> {
  return guard && isFunction<CanDeactivate<T>>(guard.canDeactivate);
}

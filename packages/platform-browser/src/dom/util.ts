/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ɵglobal as global} from '@angular/core';

const CAMEL_CASE_REGEXP = /([A-Z])/g;
const DASH_CASE_REGEXP = /-([a-z])/g;


export function camelCaseToDashCase(input: string): string {
  return input.replace(CAMEL_CASE_REGEXP, (...m: string[]) => '-' + m[1].toLowerCase());
}

export function dashCaseToCamelCase(input: string): string {
  return input.replace(DASH_CASE_REGEXP, (...m: string[]) => m[1].toUpperCase());
}

/**
 * Exports the value under a given `name` in the global property `ng`. For example `ng.probe` if
 * `name` is `'probe'`.
 *
 * 导出全局属性 `ng` 中给定 `name` 下的值。例如，如果 `name` 为 `'probe'` ，则 `ng.probe` 。
 *
 * @param name Name under which it will be exported. Keep in mind this will be a property of the
 * global `ng` object.
 *
 * 将其导出时所使用的名称。请记住，这将是全局 `ng` 对象的属性。
 *
 * @param value The value to export.
 *
 * 要导出的值。
 *
 */
export function exportNgVar(name: string, value: any): void {
  if (typeof COMPILED === 'undefined' || !COMPILED) {
    // Note: we can't export `ng` when using closure enhanced optimization as:
    // - closure declares globals itself for minified names, which sometimes clobber our `ng` global
    // - we can't declare a closure extern as the namespace `ng` is already used within Google
    //   for typings for angularJS (via `goog.provide('ng....')`).
    const ng = global['ng'] = (global['ng'] as {[key: string]: any} | undefined) || {};
    ng[name] = value;
  }
}

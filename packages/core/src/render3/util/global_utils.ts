/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {assertDefined} from '../../util/assert';
import {global} from '../../util/global';
import {setProfiler} from '../profiler';

import {applyChanges} from './change_detection_utils';
import {getComponent, getContext, getDirectiveMetadata, getDirectives, getHostElement, getInjector, getListeners, getOwningComponent, getRootComponents} from './discovery_utils';



/**
 * This file introduces series of globally accessible debug tools
 * to allow for the Angular debugging story to function.
 *
 * 本文件介绍了一系列可全局访问的调试工具，以允许 Angular 调试故事发挥作用。
 *
 * To see this in action run the following command:
 *
 * 要查看这一点，请运行以下命令：
 *
 *   bazel run //packages/core/test/bundling/todo:devserver
 *
 * bazel 运行 //packages/core/test/bundling/todo:devserver
 *
 *  Then load `localhost:5432` and start using the console tools.
 *
 * 然后加载 `localhost:5432` 并开始使用控制台工具。
 *
 */

/**
 * This value reflects the property on the window where the dev
 * tools are patched (window.ng).
 *
 * 此值反映了修补开发工具的窗口 (window.ng) 上的属性。
 *
 */
export const GLOBAL_PUBLISH_EXPANDO_KEY = 'ng';

let _published = false;
/**
 * Publishes a collection of default debug tools onto`window.ng`.
 *
 * 将默认调试工具的集合发布到 `window.ng` 上。
 *
 * These functions are available globally when Angular is in development
 * mode and are automatically stripped away from prod mode is on.
 *
 * 当 Angular 处于开发模式时，这些函数在全局范围内可用，并会自动从 prod 模式打开中剥离。
 *
 */
export function publishDefaultGlobalUtils() {
  if (!_published) {
    _published = true;

    /**
     * Warning: this function is *INTERNAL* and should not be relied upon in application's code.
     * The contract of the function might be changed in any release and/or the function can be
     * removed completely.
     *
     * 警告：此函数是*INTERNAL*
     * ，不应在应用程序代码中依赖。函数的契约可能会在任何版本中更改和/或可以完全删除该函数。
     *
     */
    publishGlobalUtil('ɵsetProfiler', setProfiler);
    publishGlobalUtil('getDirectiveMetadata', getDirectiveMetadata);
    publishGlobalUtil('getComponent', getComponent);
    publishGlobalUtil('getContext', getContext);
    publishGlobalUtil('getListeners', getListeners);
    publishGlobalUtil('getOwningComponent', getOwningComponent);
    publishGlobalUtil('getHostElement', getHostElement);
    publishGlobalUtil('getInjector', getInjector);
    publishGlobalUtil('getRootComponents', getRootComponents);
    publishGlobalUtil('getDirectives', getDirectives);
    publishGlobalUtil('applyChanges', applyChanges);
  }
}

export declare type GlobalDevModeContainer = {
  [GLOBAL_PUBLISH_EXPANDO_KEY]: {[fnName: string]: Function};
};

/**
 * Publishes the given function to `window.ng` so that it can be
 * used from the browser console when an application is not in production.
 *
 * 将给定的函数发布到 `window.ng` ，以便在应用程序不处于生产状态时可以从浏览器控制台使用它。
 *
 */
export function publishGlobalUtil(name: string, fn: Function): void {
  if (typeof COMPILED === 'undefined' || !COMPILED) {
    // Note: we can't export `ng` when using closure enhanced optimization as:
    // - closure declares globals itself for minified names, which sometimes clobber our `ng` global
    // - we can't declare a closure extern as the namespace `ng` is already used within Google
    //   for typings for AngularJS (via `goog.provide('ng....')`).
    const w = global as any as GlobalDevModeContainer;
    ngDevMode && assertDefined(fn, 'function not defined');
    if (w) {
      let container = w[GLOBAL_PUBLISH_EXPANDO_KEY];
      if (!container) {
        container = w[GLOBAL_PUBLISH_EXPANDO_KEY] = {};
      }
      container[name] = fn;
    }
  }
}

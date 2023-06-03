/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {InjectionToken} from '../di/injection_token';

/**
 * Internal token that specifies whether DOM reuse logic
 * during hydration is enabled.
 *
 * 指定是否启用水合作用期间的 DOM 重用逻辑的内部令牌。
 *
 */
export const IS_HYDRATION_DOM_REUSE_ENABLED = new InjectionToken<boolean>(
    (typeof ngDevMode === 'undefined' || !!ngDevMode) ? 'IS_HYDRATION_DOM_REUSE_ENABLED' : '');

// By default (in client rendering mode), we remove all the contents
// of the host element and render an application after that.
export const PRESERVE_HOST_CONTENT_DEFAULT = false;

/**
 * Internal token that indicates whether host element content should be
 * retained during the bootstrap.
 *
 * 指示在引导过程中是否应保留宿主元素内容的内部标记。
 *
 */
export const PRESERVE_HOST_CONTENT = new InjectionToken<boolean>(
    (typeof ngDevMode === 'undefined' || !!ngDevMode) ? 'PRESERVE_HOST_CONTENT' : '', {
      providedIn: 'root',
      factory: () => PRESERVE_HOST_CONTENT_DEFAULT,
    });

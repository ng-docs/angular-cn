/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {InjectionToken} from './injection_token';

/**
 * A multi-provider token for initialization functions that will run upon construction of an
 * environment injector.
 *
 * 初始化函数的多提供者标记，将在构建环境注入器时运行。
 *
 * @publicApi
 */
export const ENVIRONMENT_INITIALIZER = new InjectionToken<() => void>('ENVIRONMENT_INITIALIZER');

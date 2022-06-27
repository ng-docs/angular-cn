/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {InjectionToken} from './injection_token';


export type InjectorScope = 'root'|'platform'|'environment';

/**
 * An internal token whose presence in an injector indicates that the injector should treat itself
 * as a root scoped injector when processing requests for unknown tokens which may indicate
 * they are provided in the root scope.
 *
 * 一种内部标记，其存在于注入器中表明注入器在处理对未知标记的请求时应该将自己视为根范围注入器，这可能表明它们是在根范围中提供的。
 *
 */
export const INJECTOR_SCOPE = new InjectionToken<InjectorScope|null>('Set Injector scope.');

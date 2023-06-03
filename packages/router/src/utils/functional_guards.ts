/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {inject, Type} from '@angular/core';

import {CanActivateChildFn, CanActivateFn, CanDeactivateFn, CanMatchFn, ResolveFn} from '../models';

/**
 * Maps an array of injectable classes with canMatch functions to an array of equivalent
 * `CanMatchFn` for use in a `Route` definition.
 *
 * 将具有 canMatch 函数的可注入类数组映射到等效的 `CanMatchFn` 数组，以便在 `Route` 定义中使用。
 *
 * Usage {@example router/utils/functional_guards.ts region='CanActivate'}
 *
 * 用法 {@example router/utils/functional_guards.ts region='CanActivate'}
 *
 * @publicApi
 * @see Route
 *
 * 路由
 */
export function mapToCanMatch(providers: Array<Type<{canMatch: CanMatchFn}>>): CanMatchFn[] {
  return providers.map(provider => (...params) => inject(provider).canMatch(...params));
}

/**
 * Maps an array of injectable classes with canActivate functions to an array of equivalent
 * `CanActivateFn` for use in a `Route` definition.
 *
 * 将具有 canActivate 函数的可注入类数组映射到等效的 `CanActivateFn` 数组，以便在 `Route` 定义中使用。
 *
 * Usage {@example router/utils/functional_guards.ts region='CanActivate'}
 *
 * 用法 {@example router/utils/functional_guards.ts region='CanActivate'}
 *
 * @publicApi
 * @see Route
 *
 * 路由
 */
export function mapToCanActivate(providers: Array<Type<{canActivate: CanActivateFn}>>):
    CanActivateFn[] {
  return providers.map(provider => (...params) => inject(provider).canActivate(...params));
}
/**
 * Maps an array of injectable classes with canActivateChild functions to an array of equivalent
 * `CanActivateChildFn` for use in a `Route` definition.
 *
 * 将具有 canActivateChild 函数的可注入类数组映射到等效的 `CanActivateChildFn` 数组，以便在 `Route` 定义中使用。
 *
 * Usage {@example router/utils/functional_guards.ts region='CanActivate'}
 *
 * 用法 {@example router/utils/functional_guards.ts region='CanActivate'}
 *
 * @publicApi
 * @see Route
 *
 * 路由
 */
export function mapToCanActivateChild(
    providers: Array<Type<{canActivateChild: CanActivateChildFn}>>): CanActivateChildFn[] {
  return providers.map(provider => (...params) => inject(provider).canActivateChild(...params));
}
/**
 * Maps an array of injectable classes with canDeactivate functions to an array of equivalent
 * `CanDeactivateFn` for use in a `Route` definition.
 *
 * 将具有 canDeactivate 函数的可注入类数组映射到等效的 `CanDeactivateFn` 数组，以便在 `Route` 定义中使用。
 *
 * Usage {@example router/utils/functional_guards.ts region='CanActivate'}
 *
 * 用法 {@example router/utils/functional_guards.ts region='CanActivate'}
 *
 * @publicApi
 * @see Route
 *
 * 路由
 */
export function mapToCanDeactivate<T = unknown>(
    providers: Array<Type<{canDeactivate: CanDeactivateFn<T>}>>): CanDeactivateFn<T>[] {
  return providers.map(provider => (...params) => inject(provider).canDeactivate(...params));
}
/**
 * Maps an injectable class with a resolve function to an equivalent `ResolveFn`
 * for use in a `Route` definition.
 *
 * 将具有解析函数的可注入类映射到等效的 `ResolveFn` 以用于 `Route` 定义。
 *
 * Usage {@example router/utils/functional_guards.ts region='Resolve'}
 *
 * 用法 {@example router/utils/functional_guards.ts region='Resolve'}
 *
 * @publicApi
 * @see Route
 *
 * 路由
 */
export function mapToResolve<T>(provider: Type<{resolve: ResolveFn<T>}>): ResolveFn<T> {
  return (...params) => inject(provider).resolve(...params);
}

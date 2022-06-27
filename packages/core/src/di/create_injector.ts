/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {flatten} from '../util/array_utils';
import {EMPTY_ARRAY} from '../util/empty';
import {stringify} from '../util/stringify';

import {Injector} from './injector';
import {StaticProvider} from './interface/provider';
import {importProvidersFrom} from './provider_collection';
import {getNullInjector, R3Injector} from './r3_injector';
import {InjectorScope} from './scope';

/**
 * Create a new `Injector` which is configured using a `defType` of `InjectorType<any>`s.
 *
 * 创建一个新的 `Injector` ，它使用 `InjectorType<any>` s 的 `defType` 配置。
 *
 * @publicApi
 */
export function createInjector(
    defType: /* InjectorType<any> */ any, parent: Injector|null = null,
    additionalProviders: StaticProvider[]|null = null, name?: string): Injector {
  const injector =
      createInjectorWithoutInjectorInstances(defType, parent, additionalProviders, name);
  injector.resolveInjectorInitializers();
  return injector;
}

/**
 * Creates a new injector without eagerly resolving its injector types. Can be used in places
 * where resolving the injector types immediately can lead to an infinite loop. The injector types
 * should be resolved at a later point by calling `_resolveInjectorDefTypes`.
 *
 * 创建一个新的注入器，而不急切解析其注入器类型。可用于立即解析注入器类型可能导致无限循环的地方。注入器类型应该在以后通过调用
 * `_resolveInjectorDefTypes` 来解析。
 *
 */
export function createInjectorWithoutInjectorInstances(
    defType: /* InjectorType<any> */ any, parent: Injector|null = null,
    additionalProviders: StaticProvider[]|null = null, name?: string,
    scopes = new Set<InjectorScope>()): R3Injector {
  const providers = [
    additionalProviders || EMPTY_ARRAY,
    importProvidersFrom(defType),
  ];
  name = name || (typeof defType === 'object' ? undefined : stringify(defType));

  return new R3Injector(providers, parent || getNullInjector(), name || null, scopes);
}

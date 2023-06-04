/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {EnvironmentProviders, Provider} from './di';

/**
 * Set of config options available during the application bootstrap operation.
 *
 * 在引导操作期间通过 `bootstrapApplication` 调用可用的一组配置选项。
 *
 * @publicApi
 */
export interface ApplicationConfig {
  /**
   * List of providers that should be available to the root component and all its children.
   *
   * 应该可用于根组件及其所有子组件的提供者列表。
   *
   */
  providers: Array<Provider|EnvironmentProviders>;
}

/**
 * Merge multiple application configurations from left to right.
 *
 * 从左到右合并多个应用程序配置。
 *
 * @param configs Two or more configurations to be merged.
 *
 * 要合并的两个或多个配置。
 *
 * @returns
 *
 * A merged [ApplicationConfig](api/core/ApplicationConfig).
 *
 * 合并的[ApplicationConfig](api/core/ApplicationConfig)。
 *
 * @publicApi
 */
export function mergeApplicationConfig(...configs: ApplicationConfig[]): ApplicationConfig {
  return configs.reduce((prev, curr) => {
    return Object.assign(prev, curr, {providers: [...prev.providers, ...curr.providers]});
  }, {providers: []});
}

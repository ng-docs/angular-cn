/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ModuleWithProviders, NgModule} from '@angular/core';

import {provideServiceWorker, SwRegistrationOptions} from './provider';
import {SwPush} from './push';
import {SwUpdate} from './update';

/**
 * @publicApi
 */
@NgModule({providers: [SwPush, SwUpdate]})
export class ServiceWorkerModule {
  /**
   * Register the given Angular Service Worker script.
   *
   * 注册给定的 Angular Service Worker 脚本。
   *
   * If `enabled` is set to `false` in the given options, the module will behave as if service
   * workers are not supported by the browser, and the service worker will not be registered.
   *
   * 如果给定选项中的 `enabled` 设置为 `false`，则模块将表现为浏览器不支持服务工作人员，并且不会注册服务工作人员。
   *
   */
  static register(script: string, options: SwRegistrationOptions = {}):
      ModuleWithProviders<ServiceWorkerModule> {
    return {
      ngModule: ServiceWorkerModule,
      providers: [provideServiceWorker(script, options)],
    };
  }
}

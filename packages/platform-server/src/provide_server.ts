/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {EnvironmentProviders, makeEnvironmentProviders} from '@angular/core';
import {provideNoopAnimations} from '@angular/platform-browser/animations';

import {PLATFORM_SERVER_PROVIDERS} from './server';

/**
 * Sets up providers necessary to enable server rendering functionality for the application.
 *
 * 设置为应用程序启用服务器呈现功能所需的提供程序。
 *
 * @usageNotes
 *
 * Basic example of how you can add server support to your application:
 *
 * 如何向应用程序添加服务器支持的基本示例：
 *
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideServerRendering()]
 * });
 * ```
 *
 * @publicApi
 * @returns
 *
 * A set of providers to setup the server.
 *
 * 一组用于设置服务器的提供程序。
 *
 */
export function provideServerRendering(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideNoopAnimations(),
    ...PLATFORM_SERVER_PROVIDERS,
  ]);
}

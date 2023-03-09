/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {EnvironmentProviders, makeEnvironmentProviders} from '@angular/core';
import {provideNoopAnimations} from '@angular/platform-browser/animations';

import {PLATFORM_SERVER_PROVIDERS} from './server';

/**
 * Sets up providers necessary to enable server rendering functionality for the application.
 *
 * @usageNotes
 *
 * Basic example of how you can add server support to your application:
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideServerSupport()]
 * });
 * ```
 *
 * @publicApi
 * @returns A set of providers to setup the server.
 */
export function provideServerSupport(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideHttpClient(withInterceptorsFromDi()),
    provideNoopAnimations(),
    ...PLATFORM_SERVER_PROVIDERS,
  ]);
}

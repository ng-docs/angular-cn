/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ResourceLoader} from '@angular/compiler';
import {createPlatformFactory, Provider} from '@angular/core';

import {platformCoreDynamic} from './platform_core_dynamic';
import {INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS} from './platform_providers';
import {CachedResourceLoader} from './resource_loader/resource_loader_cache';

export * from './private_export';
export {VERSION} from './version';
export {JitCompilerFactory} from './compiler_factory';

/**
 * @publicApi
 *
 * @deprecated This was previously necessary in some cases to test AOT-compiled components with View
 *     Engine, but is no longer since Ivy.

 */
export const RESOURCE_CACHE_PROVIDER: Provider[] =
    [{provide: ResourceLoader, useClass: CachedResourceLoader, deps: []}];

/**
 * @publicApi
 */
export const platformBrowserDynamic = createPlatformFactory(
    platformCoreDynamic, 'browserDynamic', INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS);

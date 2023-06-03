/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export const PLATFORM_BROWSER_ID = 'browser';
export const PLATFORM_SERVER_ID = 'server';
export const PLATFORM_WORKER_APP_ID = 'browserWorkerApp';
export const PLATFORM_WORKER_UI_ID = 'browserWorkerUi';

/**
 * Returns whether a platform id represents a browser platform.
 *
 * 返回平台 ID 是否代表浏览器平台。
 *
 * @publicApi
 */
export function isPlatformBrowser(platformId: Object): boolean {
  return platformId === PLATFORM_BROWSER_ID;
}

/**
 * Returns whether a platform id represents a server platform.
 *
 * 返回平台 ID 是否代表服务器平台。
 *
 * @publicApi
 */
export function isPlatformServer(platformId: Object): boolean {
  return platformId === PLATFORM_SERVER_ID;
}

/**
 * Returns whether a platform id represents a web worker app platform.
 *
 * 返回平台 ID 是否代表 Web Worker 应用平台。
 *
 * @publicApi
 * @deprecated
 *
 * This function serves no purpose since the removal of the Webworker platform. It will
 *     always return `false`.
 *
 * 自从 Webworker 平台被移除后，这个功能就没有用了。 它总是会返回 `false` 。
 *
 */
export function isPlatformWorkerApp(platformId: Object): boolean {
  return platformId === PLATFORM_WORKER_APP_ID;
}

/**
 * Returns whether a platform id represents a web worker UI platform.
 *
 * 返回平台 ID 是否代表 Web Worker UI 平台。
 *
 * @publicApi
 * @deprecated
 *
 * This function serves no purpose since the removal of the Webworker platform. It will
 *     always return `false`.
 *
 * 自从 Webworker 平台被移除后，这个功能就没有用了。 它总是会返回 `false` 。
 *
 */
export function isPlatformWorkerUi(platformId: Object): boolean {
  return platformId === PLATFORM_WORKER_UI_ID;
}

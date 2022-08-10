/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injectable} from '@angular/core';
import {NEVER, Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';

import {ERR_SW_NOT_SUPPORTED, NgswCommChannel, UnrecoverableStateEvent, UpdateActivatedEvent, UpdateAvailableEvent, VersionEvent, VersionReadyEvent} from './low_level';



/**
 * Subscribe to update notifications from the Service Worker, trigger update
 * checks, and forcibly activate updates.
 *
 * 订阅来自 Service Worker 的更新通知、触发更新检查以及强制激活更新。
 *
 * @see {@link guide/service-worker-communications Service worker communication guide}
 * @publicApi
 */
@Injectable()
export class SwUpdate {
  /**
   * Emits a `VersionDetectedEvent` event whenever a new version is detected on the server.
   *
   * 每当在服务器上检测到新版本时，都会发出 `VersionDetectedEvent` 事件。
   *
   * Emits a `VersionInstallationFailedEvent` event whenever checking for or downloading a new
   * version fails.
   *
   * 每当检查或下载新版本失败时都会发出 `VersionInstallationFailedEvent` 事件。
   *
   * Emits a `VersionReadyEvent` event whenever a new version has been downloaded and is ready for
   * activation.
   *
   * 每当已下载新版本并准备好激活时，都会发出 `VersionReadyEvent` 事件。
   *
   */
  readonly versionUpdates: Observable<VersionEvent>;

  /**
   * Emits an `UpdateAvailableEvent` event whenever a new app version is available.
   *
   * 每当有新应用版本可用时都会发出 `UpdateAvailableEvent` 事件。
   *
   * @deprecated
   *
   * Use {@link versionUpdates} instead.
   *
   * 改用 {@link versionUpdates} 。
   *
   * The of behavior `available` can be rebuild by filtering for the `VersionReadyEvent`:
   *
   * 可以通过过滤 `VersionReadyEvent` 来重建 `available` 的 of 行为：
   *
   * ```
   * import {filter, map} from 'rxjs/operators';
   * // ...
   * const updatesAvailable = swUpdate.versionUpdates.pipe(
   *   filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
   *   map(evt => ({
   *     type: 'UPDATE_AVAILABLE',
   *     current: evt.currentVersion,
   *     available: evt.latestVersion,
   *   })));
   * ```
   *
   */
  readonly available: Observable<UpdateAvailableEvent>;

  /**
   * Emits an `UpdateActivatedEvent` event whenever the app has been updated to a new version.
   *
   * 每当应用更新到新版本时都会发出 `UpdateActivatedEvent` 事件。
   *
   * @deprecated
   *
   * Use the return value of {@link SwUpdate#activateUpdate} instead.
   *
   * 改用 {@link SwUpdate#activateUpdate} 的返回值。
   *
   */
  readonly activated: Observable<UpdateActivatedEvent>;

  /**
   * Emits an `UnrecoverableStateEvent` event whenever the version of the app used by the service
   * worker to serve this client is in a broken state that cannot be recovered from without a full
   * page reload.
   *
   * 每当 Service Worker
   * 用于为此客户端提供服务的应用程序版本处于破损状态（如果不重新加载完整页面就无法恢复）时，都会发出
   * `UnrecoverableStateEvent` 事件。
   *
   */
  readonly unrecoverable: Observable<UnrecoverableStateEvent>;

  /**
   * True if the Service Worker is enabled (supported by the browser and enabled via
   * `ServiceWorkerModule`).
   *
   * 如果启用了 Service Worker（受浏览器支持并通过 `ServiceWorkerModule` 启用），则为真。
   *
   */
  get isEnabled(): boolean {
    return this.sw.isEnabled;
  }

  constructor(private sw: NgswCommChannel) {
    if (!sw.isEnabled) {
      this.versionUpdates = NEVER;
      this.available = NEVER;
      this.activated = NEVER;
      this.unrecoverable = NEVER;
      return;
    }
    this.versionUpdates = this.sw.eventsOfType<VersionEvent>([
      'VERSION_DETECTED',
      'VERSION_INSTALLATION_FAILED',
      'VERSION_READY',
      'NO_NEW_VERSION_DETECTED',
    ]);
    this.available = this.versionUpdates.pipe(
        filter((evt: VersionEvent): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        map(evt => ({
              type: 'UPDATE_AVAILABLE',
              current: evt.currentVersion,
              available: evt.latestVersion,
            })));
    this.activated = this.sw.eventsOfType<UpdateActivatedEvent>('UPDATE_ACTIVATED');
    this.unrecoverable = this.sw.eventsOfType<UnrecoverableStateEvent>('UNRECOVERABLE_STATE');
  }

  /**
   * Checks for an update and waits until the new version is downloaded from the server and ready
   * for activation.
   *
   * 检查更新并等到从服务器下载新版本并准备好激活。
   *
   * @returns
   *
   * a promise that
   *
   * 一个 Promise
   *
   * - resolves to `true` if a new version was found and is ready to be activated.
   *
   *   如果找到了新版本并准备好激活，则解析为 `true` 。
   *
   * - resolves to `false` if no new version was found
   *
   *   如果没有找到新版本，则解析为 `false`
   *
   * - rejects if any error occurs
   *
   *   如果发生任何错误，则拒绝
   *
   */
  checkForUpdate(): Promise<boolean> {
    if (!this.sw.isEnabled) {
      return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
    }
    const nonce = this.sw.generateNonce();
    return this.sw.postMessageWithOperation('CHECK_FOR_UPDATES', {nonce}, nonce);
  }

  /**
   * Updates the current client (i.e. browser tab) to the latest version that is ready for
   * activation.
   *
   * 将当前客户端（即浏览器选项卡）更新到可激活的最新版本。
   *
   * @returns
   *
   * a promise that
   *
   * 一个 Promise
   *
   * - resolves to `true` if an update was activated successfully
   *
   *   如果更新已成功激活，则解析为 `true`
   *
   * - resolves to `false` if no update was available (for example, the client was already on the
   *   latest version).
   *
   *   如果没有可用的更新（例如，客户端已经在最新版本上），则解析为 `false` 。
   *
   * - rejects if any error occurs
   *
   *   如果发生任何错误，则拒绝
   *
   */
  activateUpdate(): Promise<boolean> {
    if (!this.sw.isEnabled) {
      return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
    }
    const nonce = this.sw.generateNonce();
    return this.sw.postMessageWithOperation('ACTIVATE_UPDATE', {nonce}, nonce);
  }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {concat, ConnectableObservable, defer, fromEvent, Observable, of, throwError} from 'rxjs';
import {filter, map, publish, switchMap, take, tap} from 'rxjs/operators';

export const ERR_SW_NOT_SUPPORTED = 'Service workers are disabled or not supported by this browser';

/**
 * An event emitted when a new version of the app is available.
 *
 * 有新版本的应用程序可用时发出的事件。
 *
 * @see {
 * @link guide/service-worker-communications Service worker communication guide}
 * @deprecated
 *
 * This event is only emitted by the deprecated {@link SwUpdate#available}.
 * Use the {@link VersionReadyEvent} instead, which is emitted by {@link SwUpdate#versionUpdates}.
 * See {@link SwUpdate#available} docs for an example.
 *
 * 此事件仅由已过时的 {@link SwUpdate#available} 发出。改用 {@link VersionReadyEvent} ，它由 {@link
 * SwUpdate#versionUpdates} 发出。有关示例，请参阅 {@link SwUpdate#available} 文档。
 *
 * @publicApi
 */
export interface UpdateAvailableEvent {
  type: 'UPDATE_AVAILABLE';
  current: {hash: string, appData?: Object};
  available: {hash: string, appData?: Object};
}

/**
 * An event emitted when a new version of the app has been downloaded and activated.
 *
 * 下载并激活新版本的应用程序时发出的事件。
 *
 * @see {
 * @link guide/service-worker-communications Service worker communication guide}
 * @deprecated
 *
 * This event is only emitted by the deprecated {@link SwUpdate#activated}.
 * Use the return value of {@link SwUpdate#activateUpdate} instead.
 *
 * 此事件仅由已过时的 {@link SwUpdate#activate} 发出。改用 {@link SwUpdate#activateUpdate}
 * 的返回值。
 *
 * @publicApi
 */
export interface UpdateActivatedEvent {
  type: 'UPDATE_ACTIVATED';
  previous?: {hash: string, appData?: Object};
  current: {hash: string, appData?: Object};
}

/**
 * An event emitted when the service worker has checked the version of the app on the server and it
 * didn't find a new version that it doesn't have already downloaded.
 *
 * 当服务工作人员检查了服务器上应用程序的版本并且没有找到尚未下载的新版本时发出的事件。
 *
 * @see {
 * @link guide/service-worker-communications Service worker communication guide}
 * @publicApi
 */
export interface NoNewVersionDetectedEvent {
  type: 'NO_NEW_VERSION_DETECTED';
  version: {hash: string; appData?: Object;};
}

/**
 * An event emitted when the service worker has detected a new version of the app on the server and
 * is about to start downloading it.
 *
 * 当 Service Worker 在服务器上检测到应用程序的新版本并即将开始下载时发出的事件。
 *
 * @see {
 * @link guide/service-worker-communications Service worker communication guide}
 * @publicApi
 */
export interface VersionDetectedEvent {
  type: 'VERSION_DETECTED';
  version: {hash: string; appData?: object;};
}

/**
 * An event emitted when the installation of a new version failed.
 * It may be used for logging/monitoring purposes.
 *
 * 新版本安装失败时发出的事件。它可用于日志/监控目的。
 *
 * @see {
 * @link guide/service-worker-communications Service worker communication guide}
 * @publicApi
 */
export interface VersionInstallationFailedEvent {
  type: 'VERSION_INSTALLATION_FAILED';
  version: {hash: string; appData?: object;};
  error: string;
}

/**
 * An event emitted when a new version of the app is available.
 *
 * 有新版本的应用程序可用时发出的事件。
 *
 * @see {
 * @link guide/service-worker-communications Service worker communication guide}
 * @publicApi
 */
export interface VersionReadyEvent {
  type: 'VERSION_READY';
  currentVersion: {hash: string; appData?: object;};
  latestVersion: {hash: string; appData?: object;};
}


/**
 * A union of all event types that can be emitted by
 * {@link api/service-worker/SwUpdate#versionUpdates SwUpdate#versionUpdates}.
 *
 * {@link api/service-worker/SwUpdate#versionUpdates SwUpdate#versionUpdates}
 * 可以发出的所有事件类型的联合。
 *
 * @publicApi
 */
export type VersionEvent =
    VersionDetectedEvent|VersionInstallationFailedEvent|VersionReadyEvent|NoNewVersionDetectedEvent;

/**
 * An event emitted when the version of the app used by the service worker to serve this client is
 * in a broken state that cannot be recovered from and a full page reload is required.
 *
 * 当 Service Worker
 * 用来为此客户端提供服务的应用程序版本处于无法恢复的损坏状态并且需要重新加载整页时发出的事件。
 *
 * For example, the service worker may not be able to retrieve a required resource, neither from the
 * cache nor from the server. This could happen if a new version is deployed to the server and the
 * service worker cache has been partially cleaned by the browser, removing some files of a previous
 * app version but not all.
 *
 * 例如，服务工作者可能无法从缓存或服务器中检索所需的资源。如果将新版本部署到服务器并且浏览器已部分清除
 * Service Worker 缓存（删除了以前应用程序版本的某些文件，但不是全部），可能会发生这种情况。
 *
 * @see {
 * @link guide/service-worker-communications Service worker communication guide}
 * @publicApi
 */
export interface UnrecoverableStateEvent {
  type: 'UNRECOVERABLE_STATE';
  reason: string;
}

/**
 * An event emitted when a `PushEvent` is received by the service worker.
 *
 * 服务工作者收到 `PushEvent` 时发出的事件。
 *
 */
export interface PushEvent {
  type: 'PUSH';
  data: any;
}

export type IncomingEvent = UpdateActivatedEvent|UnrecoverableStateEvent|VersionEvent;

export interface TypedEvent {
  type: string;
}

type OperationCompletedEvent = {
  type: 'OPERATION_COMPLETED'; nonce: number; result: boolean;
}|{
  type: 'OPERATION_COMPLETED';
  nonce: number;
  result?: undefined;
  error: string;
};


function errorObservable(message: string): Observable<any> {
  return defer(() => throwError(new Error(message)));
}

/**
 * @publicApi
 */
export class NgswCommChannel {
  readonly worker: Observable<ServiceWorker>;

  readonly registration: Observable<ServiceWorkerRegistration>;

  readonly events: Observable<TypedEvent>;

  constructor(private serviceWorker: ServiceWorkerContainer|undefined) {
    if (!serviceWorker) {
      this.worker = this.events = this.registration = errorObservable(ERR_SW_NOT_SUPPORTED);
    } else {
      const controllerChangeEvents = fromEvent(serviceWorker, 'controllerchange');
      const controllerChanges = controllerChangeEvents.pipe(map(() => serviceWorker.controller));
      const currentController = defer(() => of(serviceWorker.controller));
      const controllerWithChanges = concat(currentController, controllerChanges);

      this.worker = controllerWithChanges.pipe(filter((c): c is ServiceWorker => !!c));

      this.registration = <Observable<ServiceWorkerRegistration>>(
          this.worker.pipe(switchMap(() => serviceWorker.getRegistration())));

      const rawEvents = fromEvent<MessageEvent>(serviceWorker, 'message');
      const rawEventPayload = rawEvents.pipe(map(event => event.data));
      const eventsUnconnected = rawEventPayload.pipe(filter(event => event && event.type));
      const events = eventsUnconnected.pipe(publish()) as ConnectableObservable<IncomingEvent>;
      events.connect();

      this.events = events;
    }
  }

  postMessage(action: string, payload: Object): Promise<void> {
    return this.worker
        .pipe(take(1), tap((sw: ServiceWorker) => {
                sw.postMessage({
                  action,
                  ...payload,
                });
              }))
        .toPromise()
        .then(() => undefined);
  }

  postMessageWithOperation(type: string, payload: Object, operationNonce: number):
      Promise<boolean> {
    const waitForOperationCompleted = this.waitForOperationCompleted(operationNonce);
    const postMessage = this.postMessage(type, payload);
    return Promise.all([postMessage, waitForOperationCompleted]).then(([, result]) => result);
  }

  generateNonce(): number {
    return Math.round(Math.random() * 10000000);
  }

  eventsOfType<T extends TypedEvent>(type: T['type']|T['type'][]): Observable<T> {
    let filterFn: (event: TypedEvent) => event is T;
    if (typeof type === 'string') {
      filterFn = (event: TypedEvent): event is T => event.type === type;
    } else {
      filterFn = (event: TypedEvent): event is T => type.includes(event.type);
    }
    return this.events.pipe(filter(filterFn));
  }

  nextEventOfType<T extends TypedEvent>(type: T['type']): Observable<T> {
    return this.eventsOfType(type).pipe(take(1));
  }

  waitForOperationCompleted(nonce: number): Promise<boolean> {
    return this.eventsOfType<OperationCompletedEvent>('OPERATION_COMPLETED')
        .pipe(filter(event => event.nonce === nonce), take(1), map(event => {
                if (event.result !== undefined) {
                  return event.result;
                }
                throw new Error(event.error!);
              }))
        .toPromise();
  }

  get isEnabled(): boolean {
    return !!this.serviceWorker;
  }
}

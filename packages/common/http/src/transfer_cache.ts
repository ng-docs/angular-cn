/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {APP_BOOTSTRAP_LISTENER, ApplicationRef, inject, InjectionToken, makeStateKey, Provider, StateKey, TransferState, ɵENABLED_SSR_FEATURES as ENABLED_SSR_FEATURES} from '@angular/core';
import {Observable, of} from 'rxjs';
import {first, tap} from 'rxjs/operators';

import {HttpHeaders} from './headers';
import {HTTP_ROOT_INTERCEPTOR_FNS, HttpHandlerFn} from './interceptor';
import {HttpRequest} from './request';
import {HttpEvent, HttpResponse} from './response';

interface TransferHttpResponse {
  body: any;
  headers: Record<string, string[]>;
  status?: number;
  statusText?: string;
  url?: string;
  responseType?: HttpRequest<unknown>['responseType'];
}

const CACHE_STATE = new InjectionToken<{isCacheActive: boolean}>(
    ngDevMode ? 'HTTP_TRANSFER_STATE_CACHE_STATE' : '');

/**
 * A list of allowed HTTP methods to cache.
 *
 * 允许缓存的 HTTP 方法列表。
 *
 */
const ALLOWED_METHODS = ['GET', 'HEAD'];

export function transferCacheInterceptorFn(
    req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const {isCacheActive} = inject(CACHE_STATE);

  // Stop using the cache if the application has stabilized, indicating initial rendering
  // is complete.
  if (!isCacheActive || !ALLOWED_METHODS.includes(req.method)) {
    // Cache is no longer active or method is not HEAD or GET.
    // Pass the request through.
    return next(req);
  }

  const transferState = inject(TransferState);
  const storeKey = makeCacheKey(req);
  const response = transferState.get(storeKey, null);

  if (response) {
    // Request found in cache. Respond using it.
    let body: ArrayBuffer|Blob|string|undefined = response.body;

    switch (response.responseType) {
      case 'arraybuffer':
        body = new TextEncoder().encode(response.body).buffer;
        break;
      case 'blob':
        body = new Blob([response.body]);
        break;
    }

    return of(
        new HttpResponse({
          body,
          headers: new HttpHeaders(response.headers),
          status: response.status,
          statusText: response.statusText,
          url: response.url,
        }),
    );
  }

  // Request not found in cache. Make the request and cache it.
  return next(req).pipe(
      tap((event: HttpEvent<unknown>) => {
        if (event instanceof HttpResponse) {
          transferState.set<TransferHttpResponse>(storeKey, {
            body: event.body,
            headers: getHeadersMap(event.headers),
            status: event.status,
            statusText: event.statusText,
            url: event.url || '',
            responseType: req.responseType,
          });
        }
      }),
  );
}

function getHeadersMap(headers: HttpHeaders): Record<string, string[]> {
  const headersMap: Record<string, string[]> = {};

  for (const key of headers.keys()) {
    const values = headers.getAll(key);
    if (values !== null) {
      headersMap[key] = values;
    }
  }

  return headersMap;
}

function makeCacheKey(request: HttpRequest<any>): StateKey<TransferHttpResponse> {
  // make the params encoded same as a url so it's easy to identify
  const {params, method, responseType, url} = request;
  const encodedParams = params.keys().sort().map((k) => `${k}=${params.getAll(k)}`).join('&');
  const key = method + '.' + responseType + '.' + url + '?' + encodedParams;

  const hash = generateHash(key);

  return makeStateKey(hash);
}

/**
 * A method that returns a hash representation of a string using a variant of DJB2 hash
 * algorithm.
 *
 * 一种使用 DJB2 哈希算法的变体返回字符串的哈希表示形式的方法。
 *
 * This is the same hashing logic that is used to generate component ids.
 *
 * 这与用于生成组件 ID 的哈希逻辑相同。
 *
 */
function generateHash(value: string): string {
  let hash = 0;

  for (const char of value) {
    hash = Math.imul(31, hash) + char.charCodeAt(0) << 0;
  }

  // Force positive number hash.
  // 2147483647 = equivalent of Integer.MAX_VALUE.
  hash += 2147483647 + 1;

  return hash.toString();
}

/**
 * Returns the DI providers needed to enable HTTP transfer cache.
 *
 * 返回启用 HTTP 传输缓存所需的 DI 提供程序。
 *
 * By default, when using server rendering, requests are performed twice: once on the server and
 * other one on the browser.
 *
 * 默认情况下，当使用服务器渲染时，请求执行两次：一次在服务器上，另一次在浏览器上。
 *
 * When these providers are added, requests performed on the server are cached and reused during the
 * bootstrapping of the application in the browser thus avoiding duplicate requests and reducing
 * load time.
 *
 * 添加这些提供程序后，在服务器上执行的请求将被缓存并在浏览器中引导应用程序期间重复使用，从而避免重复请求并减少加载时间。
 *
 */
export function withHttpTransferCache(): Provider[] {
  return [
    {
      provide: CACHE_STATE,
      useFactory: () => {
        inject(ENABLED_SSR_FEATURES).add('httpcache');
        return {isCacheActive: true};
      }
    },
    {
      provide: HTTP_ROOT_INTERCEPTOR_FNS,
      useValue: transferCacheInterceptorFn,
      multi: true,
      deps: [TransferState, CACHE_STATE]
    },
    {
      provide: APP_BOOTSTRAP_LISTENER,
      multi: true,
      useFactory: () => {
        const appRef = inject(ApplicationRef);
        const cacheState = inject(CACHE_STATE);

        return () => {
          appRef.isStable.pipe(first((isStable) => isStable)).toPromise().then(() => {
            cacheState.isCacheActive = false;
          });
        };
      }
    }
  ];
}

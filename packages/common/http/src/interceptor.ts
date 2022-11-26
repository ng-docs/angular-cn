/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {EnvironmentInjector, inject, Injectable, InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpBackend, HttpHandler} from './backend';
import {HttpRequest} from './request';
import {HttpEvent} from './response';

/**
 * Intercepts and handles an `HttpRequest` or `HttpResponse`.
 *
 * 拦截 `HttpRequest` 并处理它们。
 *
 * Most interceptors transform the outgoing request before passing it to the
 * next interceptor in the chain, by calling `next.handle(transformedReq)`.
 * An interceptor may transform the
 * response event stream as well, by applying additional RxJS operators on the stream
 * returned by `next.handle()`.
 *
 * 大多数拦截器都会在外发的请求由 `next.handle(transformedReq)`
 * 发给拦截器链中的下一个拦截器之前，对该请求进行转换。 拦截器还可以通过为 `next.handle()`
 * 返回的流添加额外的 RxJS 操作符，来对响应事件流进行转换。
 *
 * More rarely, an interceptor may handle the request entirely,
 * and compose a new event stream instead of invoking `next.handle()`. This is an
 * acceptable behavior, but keep in mind that further interceptors will be skipped entirely.
 *
 * 极少数情况下，拦截器也可以自己完全处理一个请求，并且组合出新的事件流来而不必调用
 * `next.handle()`。 这也是允许的，不过要时刻记住，这将会完全跳过所有后继拦截器。
 *
 * It is also rare but valid for an interceptor to return multiple responses on the
 * event stream for a single request.
 *
 * 另一种同样罕见但是有用的拦截器，会为单个请求在事件流上给出多个响应对象。
 *
 * @publicApi
 *
 * @see [HTTP Guide](guide/http#intercepting-requests-and-responses)
 *
 * [HTTP 一章](guide/http#intercepting-requests-and-responses)
 *
 * @usageNotes
 *
 * To use the same instance of `HttpInterceptors` for the entire app, import the `HttpClientModule`
 * only in your `AppModule`, and add the interceptors to the root application injector.
 * If you import `HttpClientModule` multiple times across different modules (for example, in lazy
 * loading modules), each import creates a new copy of the `HttpClientModule`, which overwrites the
 * interceptors provided in the root module.
 *
 * 要想在整个应用中使用 `HttpInterceptors` 的同一个实例，就只能在 `AppModule` 模块中导入
 * `HttpClientModule`，并且把拦截器都添加到应用的根注入器中。 如果你在不同的模块中多次导入
 * `HttpClientModule`，则每次导入都会创建 `HttpClientModule`
 * 的一个新复本，它将会覆盖根模块上提供的那些拦截器。
 *
 */
export interface HttpInterceptor {
  /**
   * Identifies and handles a given HTTP request.
   *
   * 标识并处理给定的 HTTP 请求。
   *
   * @param req The outgoing request object to handle.
   *
   * 要处理的传出请求对象。
   *
   * @param next The next interceptor in the chain, or the backend
   * if no interceptors remain in the chain.
   *
   * 链中的下一个拦截器，如果链中没有拦截器，则为其后端接口。
   *
   * @returns An observable of the event stream.
   *
   * 事件流的可观察值。
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}

/**
 * Represents the next interceptor in an interceptor chain, or the real backend if there are no
 * further interceptors.
 *
 * Most interceptors will delegate to this function, and either modify the outgoing request or the
 * response when it arrives. Within the scope of the current request, however, this function may be
 * called any number of times, for any number of downstream requests. Such downstream requests need
 * not be to the same URL or even the same origin as the current request. It is also valid to not
 * call the downstream handler at all, and process the current request entirely within the
 * interceptor.
 *
 * This function should only be called within the scope of the request that's currently being
 * intercepted. Once that request is complete, this downstream handler function should not be
 * called.
 *
 * @publicApi
 *
 * @see [HTTP Guide](guide/http#intercepting-requests-and-responses)
 */
export type HttpHandlerFn = (req: HttpRequest<unknown>) => Observable<HttpEvent<unknown>>;

/**
 * An interceptor for HTTP requests made via `HttpClient`.
 *
 * `HttpInterceptorFn`s are middleware functions which `HttpClient` calls when a request is made.
 * These functions have the opportunity to modify the outgoing request or any response that comes
 * back, as well as block, redirect, or otherwise change the request or response semantics.
 *
 * An `HttpHandlerFn` representing the next interceptor (or the backend which will make a real HTTP
 * request) is provided. Most interceptors will delegate to this function, but that is not required
 * (see `HttpHandlerFn` for more details).
 *
 * `HttpInterceptorFn`s have access to `inject()` via the `EnvironmentInjector` from which they were
 * configured.
 */
export type HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) =>
    Observable<HttpEvent<unknown>>;

/**
 * Function which invokes an HTTP interceptor chain.
 *
 * `HttpHandler` 会把 `HttpInterceptor` 应用到 `HttpRequest` 上。
 *
 * Each interceptor in the interceptor chain is turned into a `ChainedInterceptorFn` which closes
 * over the rest of the chain (represented by another `ChainedInterceptorFn`). The last such
 * function in the chain will instead delegate to the `finalHandlerFn`, which is passed down when
 * the chain is invoked.
 *
 * This pattern allows for a chain of many interceptors to be composed and wrapped in a single
 * `HttpInterceptorFn`, which is a useful abstraction for including different kinds of interceptors
 * (e.g. legacy class-based interceptors) in the same chain.
 */
type ChainedInterceptorFn<RequestT> = (req: HttpRequest<RequestT>, finalHandlerFn: HttpHandlerFn) =>
    Observable<HttpEvent<RequestT>>;

function interceptorChainEndFn(
    req: HttpRequest<any>, finalHandlerFn: HttpHandlerFn): Observable<HttpEvent<any>> {
  return finalHandlerFn(req);
}

/**
 * Constructs a `ChainedInterceptorFn` which adapts a legacy `HttpInterceptor` to the
 * `ChainedInterceptorFn` interface.
 */
function adaptLegacyInterceptorToChain(
    chainTailFn: ChainedInterceptorFn<any>,
    interceptor: HttpInterceptor): ChainedInterceptorFn<any> {
  return (initialRequest, finalHandlerFn) => interceptor.intercept(initialRequest, {
    handle: (downstreamRequest) => chainTailFn(downstreamRequest, finalHandlerFn),
  });
}

/**
 * Constructs a `ChainedInterceptorFn` which wraps and invokes a functional interceptor in the given
 * injector.
 */
function chainedInterceptorFn(
    chainTailFn: ChainedInterceptorFn<unknown>, interceptorFn: HttpInterceptorFn,
    injector: EnvironmentInjector): ChainedInterceptorFn<unknown> {
  // clang-format off
  return (initialRequest, finalHandlerFn) => injector.runInContext(() =>
    interceptorFn(
      initialRequest,
      downstreamRequest => chainTailFn(downstreamRequest, finalHandlerFn)
    )
  );
  // clang-format on
}

/**
 * A multi-provider token that represents the array of registered
 * `HttpInterceptor` objects.
 *
 * 一个多重提供者（multi-provider）令牌，它代表所有已注册的 `HttpInterceptor` 构成的数组。
 *
 * @publicApi
 */
export const HTTP_INTERCEPTORS = new InjectionToken<HttpInterceptor[]>('HTTP_INTERCEPTORS');

/**
 * A multi-provided token of `HttpInterceptorFn`s.
 */
export const HTTP_INTERCEPTOR_FNS = new InjectionToken<HttpInterceptorFn[]>('HTTP_INTERCEPTOR_FNS');

/**
 * Creates an `HttpInterceptorFn` which lazily initializes an interceptor chain from the legacy
 * class-based interceptors and runs the request through it.
 */
export function legacyInterceptorFnFactory(): HttpInterceptorFn {
  let chain: ChainedInterceptorFn<any>|null = null;

  return (req, handler) => {
    if (chain === null) {
      const interceptors = inject(HTTP_INTERCEPTORS, {optional: true}) ?? [];
      // Note: interceptors are wrapped right-to-left so that final execution order is
      // left-to-right. That is, if `interceptors` is the array `[a, b, c]`, we want to
      // produce a chain that is conceptually `c(b(a(end)))`, which we build from the inside
      // out.
      chain = interceptors.reduceRight(
          adaptLegacyInterceptorToChain, interceptorChainEndFn as ChainedInterceptorFn<any>);
    }

    return chain(req, handler);
  };
}

@Injectable()
export class HttpInterceptorHandler extends HttpHandler {
  private chain: ChainedInterceptorFn<unknown>|null = null;

  constructor(private backend: HttpBackend, private injector: EnvironmentInjector) {
    super();
  }

  override handle(initialRequest: HttpRequest<any>): Observable<HttpEvent<any>> {
    if (this.chain === null) {
      const dedupedInterceptorFns = Array.from(new Set(this.injector.get(HTTP_INTERCEPTOR_FNS)));

      // Note: interceptors are wrapped right-to-left so that final execution order is
      // left-to-right. That is, if `dedupedInterceptorFns` is the array `[a, b, c]`, we want to
      // produce a chain that is conceptually `c(b(a(end)))`, which we build from the inside
      // out.
      this.chain = dedupedInterceptorFns.reduceRight(
          (nextSequencedFn, interceptorFn) =>
              chainedInterceptorFn(nextSequencedFn, interceptorFn, this.injector),
          interceptorChainEndFn as ChainedInterceptorFn<unknown>);
    }
    return this.chain(initialRequest, downstreamRequest => this.backend.handle(downstreamRequest));
  }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {isPlatformBrowser} from '@angular/common';
import {APP_INITIALIZER, ApplicationRef, InjectionToken, Injector, ModuleWithProviders, NgModule, NgZone, PLATFORM_ID} from '@angular/core';
import {merge, Observable, of} from 'rxjs';
import {delay, filter, take} from 'rxjs/operators';

import {NgswCommChannel} from './low_level';
import {SwPush} from './push';
import {SwUpdate} from './update';

/**
 * Token that can be used to provide options for `ServiceWorkerModule` outside of
 * `ServiceWorkerModule.register()`.
 *
 * 可用于在 `ServiceWorkerModule.register()` 之外为 `ServiceWorkerModule` 提供选项的标记。
 *
 * You can use this token to define a provider that generates the registration options at runtime,
 * for example via a function call:
 *
 * 你可以用此标记来定义一个在运行时生成注册选项的提供者，例如通过函数调用：
 *
 * {@example service-worker/registration-options/module.ts region="registration-options"
 *     header="app.module.ts"}
 *
 * @publicApi
 */
export abstract class SwRegistrationOptions {
  /**
   * Whether the ServiceWorker will be registered and the related services (such as `SwPush` and
   * `SwUpdate`) will attempt to communicate and interact with it.
   *
   * ServiceWorker 是否将被注册，并且相关服务（例如 `SwPush` 和 `SwUpdate`
   *）将尝试与它进行通信和交互。
   *
   * Default: true
   *
   * 默认值： true
   *
   */
  enabled?: boolean;

  /**
   * A URL that defines the ServiceWorker's registration scope; that is, what range of URLs it can
   * control. It will be used when calling
   * [ServiceWorkerContainer#register()](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register).
   *
   * 定义 ServiceWorker 的注册范围的 URL；也就是说，它可以控制的 URL
   * 范围。调用[ServiceWorkerContainer#register()](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register)时将使用它。
   *
   */
  scope?: string;

  /**
   * Defines the ServiceWorker registration strategy, which determines when it will be registered
   * with the browser.
   *
   * 定义 ServiceWorker 注册策略，该策略确定它将何时注册到浏览器。
   *
   * The default behavior of registering once the application stabilizes (i.e. as soon as there are
   * no pending micro- and macro-tasks) is designed to register the ServiceWorker as soon as
   * possible but without affecting the application's first time load.
   *
   * 应用程序稳定后注册的默认行为（即一旦没有挂起的微任务和宏任务）旨在尽快注册
   * ServiceWorker，但不影响应用程序的首次加载。
   *
   * Still, there might be cases where you want more control over when the ServiceWorker is
   * registered (for example, there might be a long-running timeout or polling interval, preventing
   * the app from stabilizing). The available option are:
   *
   * 不过，在某些情况下，你可能希望对 ServiceWorker
   * 的注册时间进行更多控制（例如，可能会有长时间运行的超时或轮询间隔，以防止应用程序稳定）。可用的选项是：
   *
   * - `registerWhenStable:<timeout>`: Register as soon as the application stabilizes (no pending
   *     micro-/macro-tasks) but no later than `<timeout>` milliseconds. If the app hasn't
   *     stabilized after `<timeout>` milliseconds (for example, due to a recurrent asynchronous
   *     task), the ServiceWorker will be registered anyway.
   *     If `<timeout>` is omitted, the ServiceWorker will only be registered once the app
   *     stabilizes.
   *
   *   `registerWhenStable:<timeout>` ：一旦应用程序稳定（没有挂起的微/宏任务）后注册，但不迟于
   * `<timeout>` 毫秒。如果应用程序在 `<timeout>` 毫秒后尚未稳定（例如，由于经常出现的异步任务），则
   * ServiceWorker 无论如何都会被注册。如果省略 `<timeout>` ，则 ServiceWorker
   * 将仅在应用稳定后才会注册。
   *
   * - `registerImmediately`: Register immediately.
   *
   *   `registerImmediately` ：立即注册。
   *
   * - `registerWithDelay:<timeout>`: Register with a delay of `<timeout>` milliseconds. For
   *     example, use `registerWithDelay:5000` to register the ServiceWorker after 5 seconds. If
   *     `<timeout>` is omitted, is defaults to `0`, which will register the ServiceWorker as soon
   *     as possible but still asynchronously, once all pending micro-tasks are completed.
   *
   *   `registerWithDelay:<timeout>` ：使用 `<timeout>` 毫秒的延迟进行注册。例如，使用
   * `registerWithDelay:5000` 在 5 秒后注册 ServiceWorker。如果省略 `<timeout>` ，则默认为 `0`
   * ，一旦所有挂起的微任务完成，它将尽快注册 ServiceWorker，但仍然是异步的。
   *
   * - An [Observable](guide/observables) factory function: A function that returns an `Observable`.
   *     The function will be used at runtime to obtain and subscribe to the `Observable` and the
   *     ServiceWorker will be registered as soon as the first value is emitted.
   *
   *   [Observable](guide/observables)工厂函数：返回 `Observable`
   * 的函数。该函数将在运行时用于获取和订阅 `Observable` ，并且一旦发出第一个值，ServiceWorker
   * 就会被注册。
   *
   * Default: 'registerWhenStable:30000'
   *
   * 默认值：“registerWhenStable:30000”
   *
   */
  registrationStrategy?: string|(() => Observable<unknown>);
}

export const SCRIPT = new InjectionToken<string>('NGSW_REGISTER_SCRIPT');

export function ngswAppInitializer(
    injector: Injector, script: string, options: SwRegistrationOptions,
    platformId: string): Function {
  const initializer = () => {
    if (!(isPlatformBrowser(platformId) && ('serviceWorker' in navigator) &&
          options.enabled !== false)) {
      return;
    }

    // Wait for service worker controller changes, and fire an INITIALIZE action when a new SW
    // becomes active. This allows the SW to initialize itself even if there is no application
    // traffic.
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (navigator.serviceWorker.controller !== null) {
        navigator.serviceWorker.controller.postMessage({action: 'INITIALIZE'});
      }
    });

    let readyToRegister$: Observable<unknown>;

    if (typeof options.registrationStrategy === 'function') {
      readyToRegister$ = options.registrationStrategy();
    } else {
      const [strategy, ...args] =
          (options.registrationStrategy || 'registerWhenStable:30000').split(':');

      switch (strategy) {
        case 'registerImmediately':
          readyToRegister$ = of(null);
          break;
        case 'registerWithDelay':
          readyToRegister$ = delayWithTimeout(+args[0] || 0);
          break;
        case 'registerWhenStable':
          readyToRegister$ = !args[0] ? whenStable(injector) :
                                        merge(whenStable(injector), delayWithTimeout(+args[0]));
          break;
        default:
          // Unknown strategy.
          throw new Error(
              `Unknown ServiceWorker registration strategy: ${options.registrationStrategy}`);
      }
    }

    // Don't return anything to avoid blocking the application until the SW is registered.
    // Also, run outside the Angular zone to avoid preventing the app from stabilizing (especially
    // given that some registration strategies wait for the app to stabilize).
    // Catch and log the error if SW registration fails to avoid uncaught rejection warning.
    const ngZone = injector.get(NgZone);
    ngZone.runOutsideAngular(
        () => readyToRegister$.pipe(take(1)).subscribe(
            () =>
                navigator.serviceWorker.register(script, {scope: options.scope})
                    .catch(err => console.error('Service worker registration failed with:', err))));
  };
  return initializer;
}

function delayWithTimeout(timeout: number): Observable<unknown> {
  return of(null).pipe(delay(timeout));
}

function whenStable(injector: Injector): Observable<unknown> {
  const appRef = injector.get(ApplicationRef);
  return appRef.isStable.pipe(filter(stable => stable));
}

export function ngswCommChannelFactory(
    opts: SwRegistrationOptions, platformId: string): NgswCommChannel {
  return new NgswCommChannel(
      isPlatformBrowser(platformId) && opts.enabled !== false ? navigator.serviceWorker :
                                                                undefined);
}

/**
 * @publicApi
 */
@NgModule({
  providers: [SwPush, SwUpdate],
})
export class ServiceWorkerModule {
  /**
   * Register the given Angular Service Worker script.
   *
   * 注册给定的 Angular Service Worker 脚本。
   *
   * If `enabled` is set to `false` in the given options, the module will behave as if service
   * workers are not supported by the browser, and the service worker will not be registered.
   *
   * 如果给定选项中的 `enabled` 设置为 `false`
   * ，则模块将表现为浏览器不支持服务工作人员，并且不会注册服务工作人员。
   *
   */
  static register(script: string, opts: SwRegistrationOptions = {}):
      ModuleWithProviders<ServiceWorkerModule> {
    return {
      ngModule: ServiceWorkerModule,
      providers: [
        {provide: SCRIPT, useValue: script},
        {provide: SwRegistrationOptions, useValue: opts},
        {
          provide: NgswCommChannel,
          useFactory: ngswCommChannelFactory,
          deps: [SwRegistrationOptions, PLATFORM_ID]
        },
        {
          provide: APP_INITIALIZER,
          useFactory: ngswAppInitializer,
          deps: [Injector, SCRIPT, SwRegistrationOptions, PLATFORM_ID],
          multi: true,
        },
      ],
    };
  }
}

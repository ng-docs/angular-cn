/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ApplicationRef, ImportedNgModuleProviders, importProvidersFrom, Injector, NgModuleFactory, NgModuleRef, PlatformRef, Provider, StaticProvider, Type, ɵinternalBootstrapApplication as internalBootstrapApplication, ɵisPromise} from '@angular/core';
import {BrowserModule, ɵTRANSITION_ID} from '@angular/platform-browser';
import {first} from 'rxjs/operators';

import {PlatformState} from './platform_state';
import {platformDynamicServer, platformServer, ServerModule} from './server';
import {BEFORE_APP_SERIALIZED, INITIAL_CONFIG} from './tokens';

interface PlatformOptions {
  document?: string;
  url?: string;
  platformProviders?: Provider[];
}

function _getPlatform(
    platformFactory: (extraProviders: StaticProvider[]) => PlatformRef,
    options: PlatformOptions): PlatformRef {
  const extraProviders = options.platformProviders ?? [];
  return platformFactory([
    {provide: INITIAL_CONFIG, useValue: {document: options.document, url: options.url}},
    extraProviders
  ]);
}

function _render<T>(
    platform: PlatformRef,
    bootstrapPromise: Promise<NgModuleRef<T>|ApplicationRef>): Promise<string> {
  return bootstrapPromise.then((moduleOrApplicationRef) => {
    const environmentInjector = (moduleOrApplicationRef as {injector: Injector}).injector;
    const transitionId = environmentInjector.get(ɵTRANSITION_ID, null);
    if (!transitionId) {
      throw new Error(
          `renderModule[Factory]() requires the use of BrowserModule.withServerTransition() to ensure
the server-rendered app can be properly bootstrapped into a client app.`);
    }
    const applicationRef: ApplicationRef = moduleOrApplicationRef instanceof ApplicationRef ?
        moduleOrApplicationRef :
        environmentInjector.get(ApplicationRef);
    return applicationRef.isStable.pipe((first((isStable: boolean) => isStable)))
        .toPromise()
        .then(() => {
          const platformState = platform.injector.get(PlatformState);

          const asyncPromises: Promise<any>[] = [];

          // Run any BEFORE_APP_SERIALIZED callbacks just before rendering to string.
          const callbacks = environmentInjector.get(BEFORE_APP_SERIALIZED, null);

          if (callbacks) {
            for (const callback of callbacks) {
              try {
                const callbackResult = callback();
                if (ɵisPromise(callbackResult)) {
                  // TODO: in TS3.7, callbackResult is void.
                  asyncPromises.push(callbackResult as any);
                }

              } catch (e) {
                // Ignore exceptions.
                console.warn('Ignoring BEFORE_APP_SERIALIZED Exception: ', e);
              }
            }
          }

          const complete = () => {
            const output = platformState.renderToString();
            platform.destroy();
            return output;
          };

          if (asyncPromises.length === 0) {
            return complete();
          }

          return Promise
              .all(asyncPromises.map(asyncPromise => {
                return asyncPromise.catch(e => {
                  console.warn('Ignoring BEFORE_APP_SERIALIZED Exception: ', e);
                });
              }))
              .then(complete);
        });
  });
}

/**
 * Renders a Module to string.
 *
 * 将模块渲染为字符串。
 *
 * `document` is the full document HTML of the page to render, as a string.
 * `url` is the URL for the current render request.
 * `extraProviders` are the platform level providers for the current render request.
 *
 * `document` 是要渲染的页面的完整文档 HTML，为字符串形式。`url` 是当前渲染请求的
 * URL。`extraProviders` 是当前渲染请求的平台级提供者。
 *
 * @publicApi
 */
export function renderModule<T>(
    module: Type<T>, options: {document?: string, url?: string, extraProviders?: StaticProvider[]}):
    Promise<string> {
  const {document, url, extraProviders: platformProviders} = options;
  const platform = _getPlatform(platformDynamicServer, {document, url, platformProviders});
  return _render(platform, platform.bootstrapModule(module));
}

/**
 * Bootstraps an instance of an Angular application and renders it to a string.
 *
 * 引导 Angular 应用程序的实例并将其呈现为字符串。
 *
 * Note: the root component passed into this function *must* be a standalone one (should have the
 * `standalone: true` flag in the `@Component` decorator config).
 *
 * 注意：传递给此函数的根组件*必须*是独立的（应该在 `@Component` 装饰器配置中具有 `standalone: true`
 * 标志）。
 *
 * ```typescript
 *
 * ```
 *
 * @Component ({
 *   standalone: true,
 *   template: 'Hello world!'
 * })
 * class RootComponent {}
 *
 * const output: string = await renderApplication(RootComponent, {appId: 'server-app'});
 * ```
 * @param rootComponent A reference to a Standalone Component that should be rendered.
 *
 * 对应该呈现的独立组件的引用。
 *
 * @param options Additional configuration for the render operation:
 *
 * 渲染操作的附加配置：
 *
 * - `appId` - a string identifier of this application. The appId is used to prefix all
 *             server-generated stylings and state keys of the application in TransferState
 *             use-cases.
 *
 *   `appId` - 此应用程序的字符串标识符。 appId 用于在 TransferState
 * 用例中作为应用程序的所有服务器生成的样式和状态键的前缀。
 *
 * - `document` - the full document HTML of the page to render, as a string.
 *
 *   `document` - 要呈现的页面的完整文档 HTML，以字符串形式。
 *
 * - `url` - the URL for the current render request.
 *
 *   `url` - 当前呈现请求的 URL。
 *
 * - `providers` - set of application level providers for the current render request.
 *
 *   `providers` - 当前渲染请求的应用程序级提供程序集。
 *
 * - `platformProviders` - the platform level providers for the current render request.
 *
 *   `platformProviders` - 当前渲染请求的平台级提供程序。
 *
 * @returns
 *
 * A Promise, that returns serialized (to a string) rendered page, once resolved.
 *
 * 一个 Promise，一旦解析，就会返回序列化（到字符串）呈现的页面。
 *
 * @publicApi
 * @developerPreview
 */
export function renderApplication<T>(rootComponent: Type<T>, options: {
  appId: string,
  document?: string,
  url?: string,
  providers?: Array<Provider|ImportedNgModuleProviders>,
  platformProviders?: Provider[],
}): Promise<string> {
  const {document, url, platformProviders, appId} = options;
  const platform = _getPlatform(platformDynamicServer, {document, url, platformProviders});
  const appProviders = [
    importProvidersFrom(BrowserModule.withServerTransition({appId})),
    importProvidersFrom(ServerModule),
    ...(options.providers ?? []),
  ];
  return _render(platform, internalBootstrapApplication({rootComponent, appProviders}));
}

/**
 * Renders a {@link NgModuleFactory} to string.
 *
 * 将 {@link NgModuleFactory} 渲染为字符串。
 *
 * `document` is the full document HTML of the page to render, as a string.
 * `url` is the URL for the current render request.
 * `extraProviders` are the platform level providers for the current render request.
 *
 * `document` 是要渲染的页面的完整文档 HTML，为字符串形式。`url` 是当前渲染请求的
 * URL。`extraProviders` 是当前渲染请求的平台级提供者。
 *
 * @publicApi
 * @deprecated
 *
 * This symbol is no longer necessary as of Angular v13.
 * Use {@link renderModule} API instead.
 *
 * 从 Angular v13 开始，不再需要此符号。改用 {@link renderModule} API。
 *
 */
export function renderModuleFactory<T>(
    moduleFactory: NgModuleFactory<T>,
    options: {document?: string, url?: string, extraProviders?: StaticProvider[]}):
    Promise<string> {
  const {document, url, extraProviders: platformProviders} = options;
  const platform = _getPlatform(platformServer, {document, url, platformProviders});
  return _render(platform, platform.bootstrapModuleFactory(moduleFactory));
}

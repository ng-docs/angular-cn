/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ApplicationRef, EnvironmentProviders, importProvidersFrom, InjectionToken, NgModuleFactory, NgModuleRef, PlatformRef, Provider, Renderer2, StaticProvider, Type, ɵinternalCreateApplication as internalCreateApplication, ɵisPromise} from '@angular/core';
import {BrowserModule, ɵTRANSITION_ID} from '@angular/platform-browser';
import {first} from 'rxjs/operators';

import {PlatformState} from './platform_state';
import {platformDynamicServer, platformServer, ServerModule} from './server';
import {BEFORE_APP_SERIALIZED, INITIAL_CONFIG} from './tokens';
import {TRANSFER_STATE_SERIALIZATION_PROVIDERS} from './transfer_state';

interface PlatformOptions {
  document?: string|Document;
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

/**
 * Adds the `ng-server-context` attribute to host elements of all bootstrapped components
 * within a given application.
 *
 * 将 `ng-server-context` 属性添加到给定应用程序中所有引导组件的宿主元素。
 *
 */
function appendServerContextInfo(serverContext: string, applicationRef: ApplicationRef) {
  applicationRef.components.forEach(componentRef => {
    const renderer = componentRef.injector.get(Renderer2);
    const element = componentRef.location.nativeElement;
    if (element) {
      renderer.setAttribute(element, 'ng-server-context', serverContext);
    }
  });
}

function _render<T>(
    platform: PlatformRef,
    bootstrapPromise: Promise<NgModuleRef<T>|ApplicationRef>): Promise<string> {
  return bootstrapPromise.then((moduleOrApplicationRef) => {
    const environmentInjector = moduleOrApplicationRef.injector;
    const transitionId = environmentInjector.get(ɵTRANSITION_ID, null);
    if (!transitionId) {
      throw new Error(
          `renderModule[Factory]() requires the use of BrowserModule.withServerTransition() to ensure
the server-rendered app can be properly bootstrapped into a client app.`);
    }
    const applicationRef: ApplicationRef = moduleOrApplicationRef instanceof ApplicationRef ?
        moduleOrApplicationRef :
        environmentInjector.get(ApplicationRef);
    const serverContext =
        sanitizeServerContext(environmentInjector.get(SERVER_CONTEXT, DEFAULT_SERVER_CONTEXT));
    return applicationRef.isStable.pipe((first((isStable: boolean) => isStable)))
        .toPromise()
        .then(() => {
          appendServerContextInfo(serverContext, applicationRef);

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
 * Specifies the value that should be used if no server context value has been provided.
 *
 * 指定在没有提供服务器上下文值的情况下应该使用的值。
 *
 */
const DEFAULT_SERVER_CONTEXT = 'other';

/**
 * An internal token that allows providing extra information about the server context
 * (e.g. whether SSR or SSG was used). The value is a string and characters other
 * than [a-zA-Z0-9\-] are removed. See the default value in `DEFAULT_SERVER_CONTEXT` const.
 *
 * 一个内部标记，允许提供有关服务器上下文的额外信息（例如，是使用 SSR 还是 SSG）。该值是一个字符串，并删除[a-zA-Z0-9-][a-zA-Z0-9\-]以外的字符。请参阅 `DEFAULT_SERVER_CONTEXT` const 中的默认值。
 *
 */
export const SERVER_CONTEXT = new InjectionToken<string>('SERVER_CONTEXT');

/**
 * Sanitizes provided server context:
 *
 * 清理提供的服务器上下文：
 *
 * - removes all characters other than a-z, A-Z, 0-9 and `-`
 *
 *   删除 az、AZ、0-9 和 `-` 之外的所有字符
 *
 * - returns `other` if nothing is provided or the string is empty after sanitization
 *
 *   如果未提供任何内容或清理后字符串为空，则返回 `other`
 *
 */
function sanitizeServerContext(serverContext: string): string {
  const context = serverContext.replace(/[^a-zA-Z0-9\-]/g, '');
  return context.length > 0 ? context : DEFAULT_SERVER_CONTEXT;
}

/**
 * Bootstraps an application using provided NgModule and serializes the page content to string.
 *
 * 使用提供的 NgModule 引导应用程序，并将页面内容序列化为字符串。
 *
 * @param moduleType A reference to an NgModule that should be used for bootstrap.
 *
 * 对应该用于引导的 NgModule 的引用。
 *
 * @param options Additional configuration for the render operation:
 *
 * 渲染操作的附加配置：
 *
 * - `document` - the document of the page to render, either as an HTML string or
 *                as a reference to the `document` instance.
 *
 *   `document` - 要呈现的页面的文档，可以是 HTML 字符串，也可以是对 `document` 实例的引用。
 *
 * - `url` - the URL for the current render request.
 *
 *   `url` - 当前呈现请求的 URL。
 *
 * - `extraProviders` - set of platform level providers for the current render request.
 *
 *   `extraProviders` - 当前渲染请求的平台级提供程序集。
 *
 * @publicApi
 */
export function renderModule<T>(moduleType: Type<T>, options: {
  document?: string|Document,
  url?: string,
  extraProviders?: StaticProvider[],
}): Promise<string> {
  const {document, url, extraProviders: platformProviders} = options;
  const platform = _getPlatform(platformDynamicServer, {document, url, platformProviders});
  return _render(platform, platform.bootstrapModule(moduleType));
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
 * @Component ({
 *   standalone: true,
 *   template: 'Hello world!'
 * })
 * class RootComponent {}
 *
 * const output: string = await renderApplication(RootComponent, {appId: 'server-app'});
 * ```
 *
 * @param rootComponent A reference to a Standalone Component that should be rendered.
 *
 * 对应该呈现的独立组件的引用。
 * @param options Additional configuration for the render operation:
 *
 * 渲染操作的附加配置：
 *
 * - `appId` - a string identifier of this application. The appId is used to prefix all
 *             server-generated stylings and state keys of the application in TransferState
 *             use-cases.
 *
 *   `appId` - 此应用程序的字符串标识符。 appId 用于在 TransferState 用例中作为应用程序的所有服务器生成的样式和状态键的前缀。
 *
 * - `document` - the document of the page to render, either as an HTML string or
 *                as a reference to the `document` instance.
 *
 *   `document` - 要呈现的页面的文档，可以是 HTML 字符串，也可以是对 `document` 实例的引用。
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
  document?: string|Document,
  url?: string,
  providers?: Array<Provider|EnvironmentProviders>,
  platformProviders?: Provider[],
}): Promise<string> {
  const {document, url, platformProviders, appId} = options;
  const platform = _getPlatform(platformDynamicServer, {document, url, platformProviders});
  const appProviders = [
    importProvidersFrom(BrowserModule.withServerTransition({appId})),
    importProvidersFrom(ServerModule),
    ...TRANSFER_STATE_SERIALIZATION_PROVIDERS,
    ...(options.providers ?? []),
  ];
  return _render(platform, internalCreateApplication({rootComponent, appProviders}));
}

/**
 * Bootstraps an application using provided {@link NgModuleFactory} and serializes the page content
 * to string.
 *
 * 使用提供的 {@link NgModuleFactory} 引导应用程序，并将页面内容序列化为字符串。
 *
 * @param moduleFactory An instance of the {@link NgModuleFactory} that should be used for
 *     bootstrap.
 *
 * 应该用于引导的 {@link NgModuleFactory} 的实例。
 *
 * @param options Additional configuration for the render operation:
 *
 * 渲染操作的附加配置：
 *
 * - `document` - the document of the page to render, either as an HTML string or
 *                as a reference to the `document` instance.
 *
 *   `document` - 要呈现的页面的文档，可以是 HTML 字符串，也可以是对 `document` 实例的引用。
 *
 * - `url` - the URL for the current render request.
 *
 *   `url` - 当前呈现请求的 URL。
 *
 * - `extraProviders` - set of platform level providers for the current render request.
 *
 *   `extraProviders` - 当前渲染请求的平台级提供程序集。
 *
 * @publicApi
 * @deprecated
 *
 * This symbol is no longer necessary as of Angular v13.
 * Use {@link renderModule} API instead.
 *
 * 从 Angular v13 开始，不再需要此符号。改用 {@link renderModule} API。
 */
export function renderModuleFactory<T>(moduleFactory: NgModuleFactory<T>, options: {
  document?: string,
  url?: string,
  extraProviders?: StaticProvider[],
}): Promise<string> {
  const {document, url, extraProviders: platformProviders} = options;
  const platform = _getPlatform(platformServer, {document, url, platformProviders});
  return _render(platform, platform.bootstrapModuleFactory(moduleFactory));
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ApplicationRef, InjectionToken, PlatformRef, Provider, Renderer2, StaticProvider, Type, ɵannotateForHydration as annotateForHydration, ɵENABLED_SSR_FEATURES as ENABLED_SSR_FEATURES, ɵInitialRenderPendingTasks as InitialRenderPendingTasks, ɵIS_HYDRATION_DOM_REUSE_ENABLED as IS_HYDRATION_DOM_REUSE_ENABLED} from '@angular/core';
import {first} from 'rxjs/operators';

import {PlatformState} from './platform_state';
import {platformServer} from './server';
import {BEFORE_APP_SERIALIZED, INITIAL_CONFIG} from './tokens';

interface PlatformOptions {
  document?: string|Document;
  url?: string;
  platformProviders?: Provider[];
}

/**
 * Creates an instance of a server platform \(with or without JIT compiler support
 * depending on the `ngJitMode` global const value\), using provided options.
 *
 * 使用提供的选项创建服务器平台的实例（有或没有 JIT 编译器支持取决于 `ngJitMode` 全局常量值）。
 *
 */
function createServerPlatform(options: PlatformOptions): PlatformRef {
  const extraProviders = options.platformProviders ?? [];
  return platformServer([
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
function appendServerContextInfo(applicationRef: ApplicationRef) {
  const injector = applicationRef.injector;
  let serverContext = sanitizeServerContext(injector.get(SERVER_CONTEXT, DEFAULT_SERVER_CONTEXT));
  const features = injector.get(ENABLED_SSR_FEATURES);
  if (features.size > 0) {
    // Append features information into the server context value.
    serverContext += `|${Array.from(features).join(',')}`;
  }
  applicationRef.components.forEach(componentRef => {
    const renderer = componentRef.injector.get(Renderer2);
    const element = componentRef.location.nativeElement;
    if (element) {
      renderer.setAttribute(element, 'ng-server-context', serverContext);
    }
  });
}

async function _render(platformRef: PlatformRef, applicationRef: ApplicationRef): Promise<string> {
  const environmentInjector = applicationRef.injector;

  // Block until application is stable.
  await applicationRef.isStable.pipe((first((isStable: boolean) => isStable))).toPromise();

  const platformState = platformRef.injector.get(PlatformState);
  if (applicationRef.injector.get(IS_HYDRATION_DOM_REUSE_ENABLED, false)) {
    annotateForHydration(applicationRef, platformState.getDocument());
  }

  // Run any BEFORE_APP_SERIALIZED callbacks just before rendering to string.
  const callbacks = environmentInjector.get(BEFORE_APP_SERIALIZED, null);
  if (callbacks) {
    const asyncCallbacks: Promise<void>[] = [];
    for (const callback of callbacks) {
      try {
        const callbackResult = callback();
        if (callbackResult) {
          asyncCallbacks.push(callbackResult);
        }
      } catch (e) {
        // Ignore exceptions.
        console.warn('Ignoring BEFORE_APP_SERIALIZED Exception: ', e);
      }
    }

    if (asyncCallbacks.length) {
      for (const result of await Promise.allSettled(asyncCallbacks)) {
        if (result.status === 'rejected') {
          console.warn('Ignoring BEFORE_APP_SERIALIZED Exception: ', result.reason);
        }
      }
    }
  }

  appendServerContextInfo(applicationRef);
  const output = platformState.renderToString();
  platformRef.destroy();

  return output;
}

/**
 * Specifies the value that should be used if no server context value has been provided.
 *
 * 指定在未提供服务器上下文值时应使用的值。
 *
 */
const DEFAULT_SERVER_CONTEXT = 'other';

/**
 * An internal token that allows providing extra information about the server context
 * \(e.g. whether SSR or SSG was used\). The value is a string and characters other
 * than [a-zA-Z0-9\-] are removed. See the default value in `DEFAULT_SERVER_CONTEXT` const.
 *
 * 允许提供有关服务器上下文的额外信息的内部令牌（例如，是否使用了 SSR 或 SSG）。该值是一个字符串，除了[a-zA-Z0-9-][a-zA-Z0-9\-]之外的字符都被删除了。查看 `DEFAULT_SERVER_CONTEXT` const 中的默认值。
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
 *   删除除 az、AZ、0-9 和 `-` 以外的所有字符
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
 *   `document` - 要渲染的页面的文档，可以是 HTML 字符串，也可以是对 `document` 实例的引用。
 *
 * - `url` - the URL for the current render request.
 *
 *   `url` - 当前渲染请求的 URL。
 *
 * - `extraProviders` - set of platform level providers for the current render request.
 *
 *   `extraProviders` - 当前渲染请求的平台级提供程序集。
 *
 * @publicApi
 */
export async function renderModule<T>(moduleType: Type<T>, options: {
  document?: string|Document,
  url?: string,
  extraProviders?: StaticProvider[],
}): Promise<string> {
  const {document, url, extraProviders: platformProviders} = options;
  const platformRef = createServerPlatform({document, url, platformProviders});
  const moduleRef = await platformRef.bootstrapModule(moduleType);
  const applicationRef = moduleRef.injector.get(ApplicationRef);
  return _render(platformRef, applicationRef);
}

/**
 * Bootstraps an instance of an Angular application and renders it to a string.
 *
 * 引导 Angular 应用程序的实例并将其渲染为字符串。
 *
 * ```typescript
 * const bootstrap = () => bootstrapApplication(RootComponent, appConfig);
 * const output: string = await renderApplication(bootstrap);
 * ```
 *
 * @param bootstrap A method that when invoked returns a promise that returns an `ApplicationRef`
 *     instance once resolved.
 *
 * 一种在调用时返回一个承诺的方法，该承诺在解决后返回一个 `ApplicationRef` 实例。
 *
 * @param options Additional configuration for the render operation:
 *
 * 渲染操作的附加配置：
 *
 * - `document` - the document of the page to render, either as an HTML string or
 *                as a reference to the `document` instance.
 *
 *   `document` - 要渲染的页面的文档，可以是 HTML 字符串，也可以是对 `document` 实例的引用。
 *
 * - `url` - the URL for the current render request.
 *
 *   `url` - 当前渲染请求的 URL。
 *
 * - `platformProviders` - the platform level providers for the current render request.
 *
 *   `platformProviders` - 当前渲染请求的平台级提供程序。
 * @returns
 *
 * A Promise, that returns serialized \(to a string\) rendered page, once resolved.
 *
 * 一个承诺，一旦解决，它就会返回序列化（到一个字符串）渲染的页面。
 *
 * @publicApi
 * @developerPreview
 */
export async function renderApplication<T>(bootstrap: () => Promise<ApplicationRef>, options: {
  document?: string|Document,
  url?: string,
  platformProviders?: Provider[],
}): Promise<string> {
  const platformRef = createServerPlatform(options);
  const applicationRef = await bootstrap();
  return _render(platformRef, applicationRef);
}

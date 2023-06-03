/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ɵwithHttpTransferCache as withHttpTransferCache} from '@angular/common/http';
import {ENVIRONMENT_INITIALIZER, EnvironmentProviders, inject, makeEnvironmentProviders, NgZone, Provider, ɵConsole as Console, ɵformatRuntimeError as formatRuntimeError, ɵwithDomHydration as withDomHydration} from '@angular/core';

import {RuntimeErrorCode} from './errors';

/**
 * The list of features as an enum to uniquely type each `HydrationFeature`.
 *
 * 作为枚举的功能列表，用于唯一键入每个 `HydrationFeature` 。
 *
 * @see HydrationFeature
 * @publicApi
 * @developerPreview
 */
export const enum HydrationFeatureKind {
  NoDomReuseFeature,
  NoHttpTransferCache
}

/**
 * Helper type to represent a Hydration feature.
 *
 * 表示水合功能的助手类型。
 *
 * @publicApi
 * @developerPreview
 */
export interface HydrationFeature<FeatureKind extends HydrationFeatureKind> {
  ɵkind: FeatureKind;
  ɵproviders: Provider[];
}

/**
 * Helper function to create an object that represents a Hydration feature.
 *
 * 用于创建表示水合功能的对象的辅助函数。
 *
 */
function hydrationFeature<FeatureKind extends HydrationFeatureKind>(
    kind: FeatureKind, providers: Provider[] = []): HydrationFeature<FeatureKind> {
  return {ɵkind: kind, ɵproviders: providers};
}

/**
 * Disables DOM nodes reuse during hydration. Effectively makes
 * Angular re-render an application from scratch on the client.
 *
 * 在水合作用期间禁用 DOM 节点重用。 有效地使 Angular 在客户端从头开始重新呈现应用程序。
 *
 * When this option is enabled, make sure that the initial navigation
 * option is configured for the Router as `enabledBlocking` by using the
 * `withEnabledBlockingInitialNavigation` in the `provideRouter` call:
 *
 * 启用此选项后，请确保通过在 `provideRouter` 调用中使用 `withEnabledBlockingInitialNavigation` 将路由器的初始导航选项配置为 `enabledBlocking` ：
 *
 * ```
 * bootstrapApplication(RootComponent, {
 *   providers: [
 *     provideRouter(
 *       // ... other features ...
 *       withEnabledBlockingInitialNavigation()
 *     ),
 *     provideClientHydration(withNoDomReuse())
 *   ]
 * });
 * ```
 *
 * This would ensure that the application is rerendered after all async
 * operations in the Router \(such as lazy-loading of components,
 * waiting for async guards and resolvers\) are completed to avoid
 * clearing the DOM on the client too soon, thus causing content flicker.
 *
 * 这将确保在 Router 中的所有异步操作（例如组件的延迟加载、等待异步守卫和解析器）完成后重新渲染应用程序，以避免过早清除客户端上的 DOM，从而导致内容闪烁。
 *
 * @see `provideRouter`
 * @see `withEnabledBlockingInitialNavigation`
 * @publicApi
 * @developerPreview
 */
export function withNoDomReuse(): HydrationFeature<HydrationFeatureKind.NoDomReuseFeature> {
  // This feature has no providers and acts as a flag that turns off
  // non-destructive hydration (which otherwise is turned on by default).
  return hydrationFeature(HydrationFeatureKind.NoDomReuseFeature);
}

/**
 * Disables HTTP transfer cache. Effectively causes HTTP requests to be performed twice: once on the
 * server and other one on the browser.
 *
 * 禁用 HTTP 传输缓存。 有效地导致 HTTP 请求执行两次：一次在服务器上，另一次在浏览器上。
 *
 * @publicApi
 * @developerPreview
 */
export function withNoHttpTransferCache():
    HydrationFeature<HydrationFeatureKind.NoHttpTransferCache> {
  // This feature has no providers and acts as a flag that turns off
  // HTTP transfer cache (which otherwise is turned on by default).
  return hydrationFeature(HydrationFeatureKind.NoHttpTransferCache);
}

/**
 * Returns an `ENVIRONMENT_INITIALIZER` token setup with a function
 * that verifies whether compatible ZoneJS was used in an application
 * and logs a warning in a console if it's not the case.
 *
 * 返回一个 `ENVIRONMENT_INITIALIZER` 令牌设置，该令牌设置具有验证是否在应用程序中使用了兼容的 ZoneJS 的功能，如果不是这种情况，则在控制台中记录警告。
 *
 */
function provideZoneJsCompatibilityDetector(): Provider[] {
  return [{
    provide: ENVIRONMENT_INITIALIZER,
    useValue: () => {
      const ngZone = inject(NgZone);
      // Checking `ngZone instanceof NgZone` would be insufficient here,
      // because custom implementations might use NgZone as a base class.
      if (ngZone.constructor !== NgZone) {
        const console = inject(Console);
        const message = formatRuntimeError(
            RuntimeErrorCode.UNSUPPORTED_ZONEJS_INSTANCE,
            'Angular detected that hydration was enabled for an application ' +
                'that uses a custom or a noop Zone.js implementation. ' +
                'This is not yet a fully supported configuration.');
        // tslint:disable-next-line:no-console
        console.warn(message);
      }
    },
    multi: true,
  }];
}

/**
 * Sets up providers necessary to enable hydration functionality for the application.
 * By default, the function enables the recommended set of features for the optimal
 * performance for most of the applications. You can enable/disable features by
 * passing special functions \(from the `HydrationFeatures` set\) as arguments to the
 * `provideClientHydration` function.
 *
 * 设置为应用程序启用水合功能所需的提供程序。 默认情况下，该函数启用推荐的一组功能以获得大多数应用程序的最佳性能。 你可以通过将特殊函数（来自 `HydrationFeatures` 集）作为参数传递给 `provideClientHydration` 函数来启用/禁用功能。
 *
 * @usageNotes
 *
 * Basic example of how you can enable hydration in your application when
 * `bootstrapApplication` function is used:
 *
 * 使用 `bootstrapApplication` 函数时如何在应用程序中启用水合作用的基本示例：
 *
 * ```
 * bootstrapApplication(AppComponent, {
 *   providers: [provideClientHydration()]
 * });
 * ```
 *
 * Alternatively if you are using NgModules, you would add `provideClientHydration`
 * to your root app module's provider list.
 *
 * 或者，如果你使用的是 NgModules，你可以将 `provideClientHydration` 添加到根应用程序模块的提供者列表中。
 *
 * ```
 * @NgModule({
 *   declarations: [RootCmp],
 *   bootstrap: [RootCmp],
 *   providers: [provideClientHydration()],
 * })
 * export class AppModule {}
 * ```
 *
 * @see `withNoDomReuse`
 * @see `withNoHttpTransferCache`
 * @param features Optional features to configure additional router behaviors.
 *
 * 配置其他路由器行为的可选特性。
 * @returns
 *
 * A set of providers to enable hydration.
 *
 * 一组启用水合作用的提供程序。
 *
 * @publicApi
 * @developerPreview
 */
export function provideClientHydration(...features: HydrationFeature<HydrationFeatureKind>[]):
    EnvironmentProviders {
  const providers: Provider[] = [];
  const featuresKind = new Set<HydrationFeatureKind>();

  for (const {ɵproviders, ɵkind} of features) {
    featuresKind.add(ɵkind);

    if (ɵproviders.length) {
      providers.push(ɵproviders);
    }
  }

  return makeEnvironmentProviders([
    (typeof ngDevMode !== 'undefined' && ngDevMode) ? provideZoneJsCompatibilityDetector() : [],
    (featuresKind.has(HydrationFeatureKind.NoDomReuseFeature) ? [] : withDomHydration()),
    (featuresKind.has(HydrationFeatureKind.NoHttpTransferCache) ? [] : withHttpTransferCache()),
    providers,
  ]);
}

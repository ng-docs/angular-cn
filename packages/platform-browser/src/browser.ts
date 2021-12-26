/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CommonModule, DOCUMENT, XhrFactory, ɵPLATFORM_BROWSER_ID as PLATFORM_BROWSER_ID} from '@angular/common';
import {APP_ID, ApplicationModule, createPlatformFactory, ErrorHandler, Inject, ModuleWithProviders, NgModule, NgZone, Optional, PLATFORM_ID, PLATFORM_INITIALIZER, platformCore, PlatformRef, RendererFactory2, Sanitizer, SkipSelf, StaticProvider, Testability, ɵINJECTOR_SCOPE as INJECTOR_SCOPE, ɵsetDocument} from '@angular/core';

import {BrowserDomAdapter} from './browser/browser_adapter';
import {SERVER_TRANSITION_PROVIDERS, TRANSITION_ID} from './browser/server-transition';
import {BrowserGetTestability} from './browser/testability';
import {BrowserXhr} from './browser/xhr';
import {DomRendererFactory2} from './dom/dom_renderer';
import {DomEventsPlugin} from './dom/events/dom_events';
import {EVENT_MANAGER_PLUGINS, EventManager} from './dom/events/event_manager';
import {KeyEventsPlugin} from './dom/events/key_events';
import {DomSharedStylesHost, SharedStylesHost} from './dom/shared_styles_host';
import {DomSanitizer, DomSanitizerImpl} from './security/dom_sanitization_service';

export function initDomAdapter() {
  BrowserDomAdapter.makeCurrent();
  BrowserGetTestability.init();
}

export function errorHandler(): ErrorHandler {
  return new ErrorHandler();
}

export function _document(): any {
  // Tell ivy about the global document
  ɵsetDocument(document);
  return document;
}

export const INTERNAL_BROWSER_PLATFORM_PROVIDERS: StaticProvider[] = [
  {provide: PLATFORM_ID, useValue: PLATFORM_BROWSER_ID},
  {provide: PLATFORM_INITIALIZER, useValue: initDomAdapter, multi: true},
  {provide: DOCUMENT, useFactory: _document, deps: []},
];

/**
 * A factory function that returns a `PlatformRef` instance associated with browser service
 * providers.
 *
 * 一个工厂函数，它返回与浏览器服务提供者关联的 `PlatformRef`实例
 *
 * @publicApi
 */
export const platformBrowser: (extraProviders?: StaticProvider[]) => PlatformRef =
    createPlatformFactory(platformCore, 'browser', INTERNAL_BROWSER_PLATFORM_PROVIDERS);

export const BROWSER_MODULE_PROVIDERS: StaticProvider[] = [
  {provide: INJECTOR_SCOPE, useValue: 'root'},
  {provide: ErrorHandler, useFactory: errorHandler, deps: []},
  {
    provide: EVENT_MANAGER_PLUGINS,
    useClass: DomEventsPlugin,
    multi: true,
    deps: [DOCUMENT, NgZone, PLATFORM_ID]
  },
  {provide: EVENT_MANAGER_PLUGINS, useClass: KeyEventsPlugin, multi: true, deps: [DOCUMENT]},
  {
    provide: DomRendererFactory2,
    useClass: DomRendererFactory2,
    deps: [EventManager, DomSharedStylesHost, APP_ID]
  },
  {provide: RendererFactory2, useExisting: DomRendererFactory2},
  {provide: SharedStylesHost, useExisting: DomSharedStylesHost},
  {provide: DomSharedStylesHost, useClass: DomSharedStylesHost, deps: [DOCUMENT]},
  {provide: Testability, useClass: Testability, deps: [NgZone]},
  {provide: EventManager, useClass: EventManager, deps: [EVENT_MANAGER_PLUGINS, NgZone]},
  {provide: XhrFactory, useClass: BrowserXhr, deps: []},
];

/**
 * Exports required infrastructure for all Angular apps.
 * Included by default in all Angular apps created with the CLI
 * `new` command.
 * Re-exports `CommonModule` and `ApplicationModule`, making their
 * exports and providers available to all apps.
 *
 * 导出所有 Angular 应用都需要的基础设施。默认包含在用 CLI 的 `new` 命令创建的所有 Angular 应用中。
 * 它二次导出了 `CommonModule` 和 `ApplicationModule`，以便它们的导出物和提供者能用于所有应用中。
 *
 * @publicApi
 */
@NgModule({providers: BROWSER_MODULE_PROVIDERS, exports: [CommonModule, ApplicationModule]})
export class BrowserModule {
  constructor(@Optional() @SkipSelf() @Inject(BrowserModule) parentModule: BrowserModule|null) {
    if (parentModule) {
      throw new Error(
          `BrowserModule has already been loaded. If you need access to common directives such as NgIf and NgFor from a lazy loaded module, import CommonModule instead.`);
    }
  }

  /**
   * Configures a browser-based app to transition from a server-rendered app, if
   * one is present on the page.
   *
   * 配置基于浏览器的应用，使其可以从当前页面上的服务端渲染（SSR）应用过渡而来。
   * 指定的参数必须包含一个应用 id，在客户端应用和服务端应用之间它必须一致。
   *
   * @param params An object containing an identifier for the app to transition.
   * The ID must match between the client and server versions of the app.
   *
   * 包含要迁移的应用 id 的对象。在应用的客户端版本和服务端版本中这个 ID 必须匹配。
   *
   * @returns The reconfigured `BrowserModule` to import into the app's root `AppModule`.
   *
   * 重新配置过的 `BrowserModule`，可供导入到应用的根模块 `AppModule` 中。
   *
   */
  static withServerTransition(params: {appId: string}): ModuleWithProviders<BrowserModule> {
    return {
      ngModule: BrowserModule,
      providers: [
        {provide: APP_ID, useValue: params.appId},
        {provide: TRANSITION_ID, useExisting: APP_ID},
        SERVER_TRANSITION_PROVIDERS,
      ],
    };
  }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

// Re-export TransferState to the public API of the `platform-browser` for backwards-compatibility.
import {makeStateKey as makeStateKeyFromCore, StateKey as StateKeyFromCore, TransferState as TransferStateFromCore} from '@angular/core';

/**
 * Create a `StateKey<T>` that can be used to store value of type T with `TransferState`.
 *
 * 创建一个 `StateKey<T>`，可用于把 T 类型的值存储在 `TransferState` 中。
 *
 * Example:
 *
 * 范例：
 *
 * ```
 * const COUNTER_KEY = makeStateKey<number>('counter');
 * let value = 10;
 *
 * transferState.set(COUNTER_KEY, value);
 * ```
 *
 * @publicApi
 * @deprecated `makeStateKey` has moved, please import `makeStateKey` from `@angular/core` instead.
 */
// The below is a workaround to add a deprecated message.
export const makeStateKey = makeStateKeyFromCore;

/**
 * A key value store that is transferred from the application on the server side to the application
 * on the client side.
 *
 * 从服务器端的应用程序传到客户端的应用程序的键值存储。
 *
 * The `TransferState` is available as an injectable token.
 * On the client, just inject this token using DI and use it, it will be lazily initialized.
 * On the server it's already included if `renderApplication` function is used. Otherwise, import
 * the `ServerTransferStateModule` module to make the `TransferState` available.
 *
 * The values in the store are serialized/deserialized using JSON.stringify/JSON.parse. So only
 * boolean, number, string, null and non-class objects will be serialized and deserialized in a
 * non-lossy manner.
 *
 * 这里会使用 JSON.stringify/JSON.parse 对存储中的值进行序列化/反序列化。因此，仅布尔、数字、字符串、null 和非类对象能以无损的方式进行序列化和反序列化。
 *
 * @publicApi
 * @deprecated `TransferState` has moved, please import `TransferState` from `@angular/core`
 *     instead.
 */
// The below is a workaround to add a deprecated message.
export const TransferState: {new (): TransferStateFromCore} = TransferStateFromCore;

/**
 * A type-safe key to use with `TransferState`.
 *
 * 与 `TransferState` 一起使用的类型安全的键名。
 *
 * Example:
 *
 * 范例：
 *
 * ```
 * const COUNTER_KEY = makeStateKey<number>('counter');
 * let value = 10;
 *
 * transferState.set(COUNTER_KEY, value);
 * ```
 *
 * @publicApi
 * @deprecated `StateKey` has moved, please import `StateKey` from `@angular/core` instead.
 */
// The below is a workaround to add a deprecated message.
export type StateKey<T> = StateKeyFromCore<T>;

export {ApplicationConfig, bootstrapApplication, BrowserModule, createApplication, platformBrowser, provideProtractorTestingSupport} from './browser';
export {Meta, MetaDefinition} from './browser/meta';
export {Title} from './browser/title';
export {disableDebugTools, enableDebugTools} from './browser/tools/tools';
export {BrowserTransferStateModule} from './browser/transfer_state_module';
export {By} from './dom/debug/by';
export {REMOVE_STYLES_ON_COMPONENT_DESTROY} from './dom/dom_renderer';
export {EVENT_MANAGER_PLUGINS, EventManager} from './dom/events/event_manager';
export {HAMMER_GESTURE_CONFIG, HAMMER_LOADER, HammerGestureConfig, HammerLoader, HammerModule} from './dom/events/hammer_gestures';
export {DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl, SafeValue} from './security/dom_sanitization_service';
export {HydrationFeature, provideClientHydration, HydrationFeatureKind, withNoDomReuse, withNoHttpTransferCache} from './hydration';

export * from './private_export';
export {VERSION} from './version';

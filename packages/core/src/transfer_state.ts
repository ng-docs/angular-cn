/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {APP_ID, PLATFORM_ID} from './application_tokens';
import {inject} from './di/injector_compatibility';
import {ɵɵdefineInjectable} from './di/interface/defs';
import {getDocument} from './render3/interfaces/document';

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
 */
export type StateKey<T> = string&{
  __not_a_string: never,
  __value_type?: T,
};

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
 */
export function makeStateKey<T = void>(key: string): StateKey<T> {
  return key as StateKey<T>;
}

function initTransferState(): TransferState {
  const transferState = new TransferState();
  if (inject(PLATFORM_ID) === 'browser') {
    transferState.store = retrieveTransferredState(getDocument(), inject(APP_ID));
  }

  return transferState;
}

/**
 * A key value store that is transferred from the application on the server side to the application
 * on the client side.
 *
 * 从服务端的应用程序传到客户端的应用程序的键值存储。
 *
 * The `TransferState` is available as an injectable token.
 * On the client, just inject this token using DI and use it, it will be lazily initialized.
 * On the server it's already included if `renderApplication` function is used. Otherwise, import
 * the `ServerTransferStateModule` module to make the `TransferState` available.
 *
 * `TransferState` 可用作可注入令牌。在客户端，只需使用 DI 注入此令牌并使用它，它将被延迟初始化。如果使用 `renderApplication` 函数，它已经包含在服务器上。否则，导入 `ServerTransferStateModule` 模块以使 `TransferState` 可用。
 *
 * The values in the store are serialized/deserialized using JSON.stringify/JSON.parse. So only
 * boolean, number, string, null and non-class objects will be serialized and deserialized in a
 * non-lossy manner.
 *
 * 这里会使用 JSON.stringify/JSON.parse 对存储中的值进行序列化/反序列化。因此，仅布尔、数字、字符串、null 和非类对象能以无损的方式进行序列化和反序列化。
 *
 * @publicApi
 */
export class TransferState {
  /** @nocollapse */
  static ɵprov =
      /** @pureOrBreakMyCode */ ɵɵdefineInjectable({
        token: TransferState,
        providedIn: 'root',
        factory: initTransferState,
      });

  /** @internal */
  store: Record<string, unknown|undefined> = {};

  private onSerializeCallbacks: {[k: string]: () => unknown | undefined} = {};

  /**
   * Get the value corresponding to a key. Return `defaultValue` if key is not found.
   *
   * 获取与键名对应的值。如果找不到键名，则返回 `defaultValue`。
   *
   */
  get<T>(key: StateKey<T>, defaultValue: T): T {
    return this.store[key] !== undefined ? this.store[key] as T : defaultValue;
  }

  /**
   * Set the value corresponding to a key.
   *
   * 设置与键名对应的值。
   *
   */
  set<T>(key: StateKey<T>, value: T): void {
    this.store[key] = value;
  }

  /**
   * Remove a key from the store.
   *
   * 从 store 中移除 key。
   *
   */
  remove<T>(key: StateKey<T>): void {
    delete this.store[key];
  }

  /**
   * Test whether a key exists in the store.
   *
   * 测试存储中是否存在键名。
   *
   */
  hasKey<T>(key: StateKey<T>): boolean {
    return this.store.hasOwnProperty(key);
  }

  /**
   * Indicates whether the state is empty.
   *
   * 指示状态是否为空。
   *
   */
  get isEmpty(): boolean {
    return Object.keys(this.store).length === 0;
  }

  /**
   * Register a callback to provide the value for a key when `toJson` is called.
   *
   * 注册一个回调，以在调用 `toJson` 时为指定的键名提供一个值。
   *
   */
  onSerialize<T>(key: StateKey<T>, callback: () => T): void {
    this.onSerializeCallbacks[key] = callback;
  }

  /**
   * Serialize the current state of the store to JSON.
   *
   * 将存储的当前状态序列化为 JSON。
   *
   */
  toJson(): string {
    // Call the onSerialize callbacks and put those values into the store.
    for (const key in this.onSerializeCallbacks) {
      if (this.onSerializeCallbacks.hasOwnProperty(key)) {
        try {
          this.store[key] = this.onSerializeCallbacks[key]();
        } catch (e) {
          console.warn('Exception in onSerialize callback: ', e);
        }
      }
    }

    // Escape script tag to avoid break out of <script> tag in serialized output.
    // Encoding of `<` is the same behaviour as G3 script_builders.
    return JSON.stringify(this.store).replace(/</g, '\\u003C');
  }
}

function retrieveTransferredState(doc: Document, appId: string): Record<string, unknown|undefined> {
  // Locate the script tag with the JSON data transferred from the server.
  // The id of the script tag is set to the Angular appId + 'state'.
  const script = doc.getElementById(appId + '-state');
  if (script?.textContent) {
    try {
      // Avoid using any here as it triggers lint errors in google3 (any is not allowed).
      // Decoding of `<` is done of the box by browsers and node.js, same behaviour as G3
      // script_builders.
      return JSON.parse(script.textContent) as {};
    } catch (e) {
      console.warn('Exception while restoring TransferState for app ' + appId, e);
    }
  }

  return {};
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * A token used to manipulate and access values stored in `HttpContext`.
 *
 * 用于操作和访问存储在 `HttpContext` 中的值的令牌。
 *
 * @publicApi
 */
export class HttpContextToken<T> {
  constructor(public readonly defaultValue: () => T) {}
}

/**
 * Http context stores arbitrary user defined values and ensures type safety without
 * actually knowing the types. It is backed by a `Map` and guarantees that keys do not clash.
 *
 * Http 上下文存储任意用户定义的值，并在不了解类型的情况下确保类型安全。它由 `Map`
 * 支持，并保证键不会冲突。
 *
 * This context is mutable and is shared between cloned requests unless explicitly specified.
 *
 * 除非显式指定，否则此上下文是可变的，并且在克隆的请求之间共享。
 *
 * @usageNotes
 *
 * ### Usage Example
 *
 * ### 使用示例
 *
 * ```typescript
 * // inside cache.interceptors.ts
 * export const IS_CACHE_ENABLED = new HttpContextToken<boolean>(() => false);
 *
 * export class CacheInterceptor implements HttpInterceptor {
 *
 *   intercept(req: HttpRequest<any>, delegate: HttpHandler): Observable<HttpEvent<any>> {
 *     if (req.context.get(IS_CACHE_ENABLED) === true) {
 *       return ...;
 *     }
 *     return delegate.handle(req);
 *   }
 * }
 *
 * // inside a service
 *
 * this.httpClient.get('/api/weather', {
 *   context: new HttpContext().set(IS_CACHE_ENABLED, true)
 * }).subscribe(...);
 * ```
 *
 * @publicApi
 */
export class HttpContext {
  private readonly map = new Map<HttpContextToken<unknown>, unknown>();

  /**
   * Store a value in the context. If a value is already present it will be overwritten.
   *
   * 在上下文中存储一个值。如果一个值已经存在，它将被覆盖。
   *
   * @param token The reference to an instance of `HttpContextToken`.
   *
   * 对 `HttpContextToken` 实例的引用。
   *
   * @param value The value to store.
   *
   * 要存储的值。
   *
   * @returns
   *
   * A reference to itself for easy chaining.
   *
   * 对自身的引用，以便于链接。
   *
   */
  set<T>(token: HttpContextToken<T>, value: T): HttpContext {
    this.map.set(token, value);
    return this;
  }

  /**
   * Retrieve the value associated with the given token.
   *
   * 检索与给定令牌关联的值。
   *
   * @param token The reference to an instance of `HttpContextToken`.
   *
   * 对 `HttpContextToken` 实例的引用。
   *
   * @returns
   *
   * The stored value or default if one is defined.
   *
   * 存储的值或默认值（如果已定义）。
   *
   */
  get<T>(token: HttpContextToken<T>): T {
    if (!this.map.has(token)) {
      this.map.set(token, token.defaultValue());
    }
    return this.map.get(token) as T;
  }

  /**
   * Delete the value associated with the given token.
   *
   * 删除与给定令牌关联的值。
   *
   * @param token The reference to an instance of `HttpContextToken`.
   *
   * 对 `HttpContextToken` 实例的引用。
   *
   * @returns
   *
   * A reference to itself for easy chaining.
   *
   * 对自身的引用，以便于链接。
   *
   */
  delete(token: HttpContextToken<unknown>): HttpContext {
    this.map.delete(token);
    return this;
  }

  /**
   * Checks for existence of a given token.
   *
   * 检查给定令牌是否存在。
   *
   * @param token The reference to an instance of `HttpContextToken`.
   *
   * 对 `HttpContextToken` 实例的引用。
   *
   * @returns
   *
   * True if the token exists, false otherwise.
   *
   * 如果令牌存在，则为 true ，否则为 false 。
   *
   */
  has(token: HttpContextToken<unknown>): boolean {
    return this.map.has(token);
  }

  /**
   * @returns
   *
   * a list of tokens currently stored in the context.
   *
   * 当前存储在上下文中的令牌列表。
   *
   */
  keys(): IterableIterator<HttpContextToken<unknown>> {
    return this.map.keys();
  }
}

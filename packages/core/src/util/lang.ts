/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Observable, Subscribable} from 'rxjs';

/**
 * Determine if the argument is shaped like a Promise
 *
 * 确定参数是否类似于 Promise
 *
 */
export function isPromise<T = any>(obj: any): obj is Promise<T> {
  // allow any Promise/A+ compliant thenable.
  // It's up to the caller to ensure that obj.then conforms to the spec
  return !!obj && typeof obj.then === 'function';
}

/**
 * Determine if the argument is a Subscribable
 *
 * 确定参数是否是 Subscribable
 *
 */
export function isSubscribable(obj: any|Subscribable<any>): obj is Subscribable<any> {
  return !!obj && typeof obj.subscribe === 'function';
}

/**
 * Determine if the argument is an Observable
 *
 * 确定参数是否是 Observable
 *
 * Strictly this tests that the `obj` is `Subscribable`, since `Observable`
 * types need additional methods, such as `lift()`. But it is adequate for our
 * needs since within the Angular framework code we only ever need to use the
 * `subscribe()` method, and RxJS has mechanisms to wrap `Subscribable` objects
 * into `Observable` as needed.
 *
 * 严格地说，这会测试 `obj` 是 `Subscribable` ，因为 `Observable` 类型需要额外的方法，例如 `lift()`
 * 。但这足以满足我们的需求，因为在 Angular 框架代码中我们只需要使用 `subscribe()` 方法，并且 RxJS
 * 具有根据需要将 `Subscribable` 对象包装到 `Observable` 中的机制。
 *
 */
export const isObservable =
    isSubscribable as ((obj: any|Observable<any>) => obj is Observable<any>);

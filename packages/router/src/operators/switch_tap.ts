/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {from, MonoTypeOperatorFunction, ObservableInput, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

/**
 * Perform a side effect through a switchMap for every emission on the source Observable,
 * but return an Observable that is identical to the source. It's essentially the same as
 * the `tap` operator, but if the side effectful `next` function returns an ObservableInput,
 * it will wait before continuing with the original value.
 *
 * 通过 switchMap 对源 Observable 上的每次发射执行副作用，但返回与源相同的 Observable。它本质上与
 * `tap` 操作符相同，但如果有副作用的 `next` 函数返回 ObservableInput
 * ，它会在继续使用原始值之前等待。
 *
 */
export function switchTap<T>(next: (x: T) => void|ObservableInput<any>):
    MonoTypeOperatorFunction<T> {
  return switchMap(v => {
    const nextResult = next(v);
    if (nextResult) {
      return from(nextResult).pipe(map(() => v));
    }
    return of(v);
  });
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {assertInInjectionContext, DestroyRef, inject} from '@angular/core';
import {MonoTypeOperatorFunction, Observable} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

/**
 * Operator which completes the Observable when the calling context \(component, directive, service,
 * etc\) is destroyed.
 *
 * 当调用上下文（组件、指令、服务等）被销毁时完成 Observable 的操作符。
 *
 * @param destroyRef optionally, the `DestroyRef` representing the current context. This can be
 *     passed explicitly to use `takeUntilDestroyed` outside of an injection context. Otherwise, the
 * current `DestroyRef` is injected.
 *
 * 可选地，代表当前上下文的 `DestroyRef` 。 这可以显式传递以在注入上下文之外使用 `takeUntilDestroyed` 。 否则，将注入当前的 `DestroyRef` 。
 *
 * @developerPreview
 */
export function takeUntilDestroyed<T>(destroyRef?: DestroyRef): MonoTypeOperatorFunction<T> {
  if (!destroyRef) {
    assertInInjectionContext(takeUntilDestroyed);
    destroyRef = inject(DestroyRef);
  }

  const destroyed$ = new Observable<void>(observer => {
    const unregisterFn = destroyRef!.onDestroy(observer.next.bind(observer));
    return unregisterFn;
  });

  return <T>(source: Observable<T>) => {
    return source.pipe(takeUntil(destroyed$));
  };
}

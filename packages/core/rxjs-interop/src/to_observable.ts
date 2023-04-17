/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {assertInInjectionContext, DestroyRef, effect, EffectRef, inject, Injector, Signal, untracked} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';

/**
 * Options for `toObservable`.
 *
 * @developerPreview
 */
export interface ToObservableOptions {
  /**
   * The `Injector` to use when creating the effect.
   *
   * If this isn't specified, the current injection context will be used.
   */
  injector?: Injector;
}

/**
 * Exposes the value of an Angular `Signal` as an RxJS `Observable`.
 *
 * The signal's value will be propagated into the `Observable`'s subscribers using an `effect`.
 *
 * `toObservable` must be called in an injection context.
 *
 * @developerPreview
 */
export function toObservable<T>(
    source: Signal<T>,
    options?: ToObservableOptions,
    ): Observable<T> {
  !options?.injector && assertInInjectionContext(toObservable);
  const injector = options?.injector ?? inject(Injector);
  const subject = new ReplaySubject<T>(1);

  const watcher = effect(() => {
    let value: T;
    try {
      value = source();
    } catch (err) {
      untracked(() => subject.error(err));
      return;
    }
    untracked(() => subject.next(value));
  }, {injector, manualCleanup: true});

  injector.get(DestroyRef).onDestroy(() => {
    watcher.destroy();
    subject.complete();
  });

  return subject.asObservable();
}

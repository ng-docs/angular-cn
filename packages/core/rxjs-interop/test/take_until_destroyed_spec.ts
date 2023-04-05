/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {DestroyRef, EnvironmentInjector, Injector, runInInjectionContext} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {takeUntilDestroyed} from '../src/take_until_destroyed';

describe('takeUntilDestroyed', () => {
  it('should complete an observable when the current context is destroyed', () => {
    const injector = Injector.create({providers: []}) as EnvironmentInjector;
    const source$ = new BehaviorSubject(0);
    const tied$ = runInInjectionContext(injector, () => source$.pipe(takeUntilDestroyed()));

    let completed = false;
    let last = 0;

    tied$.subscribe({
      next(value) {
        last = value;
      },
      complete() {
        completed = true;
      }
    });

    source$.next(1);
    expect(last).toBe(1);

    injector.destroy();
    expect(completed).toBeTrue();
    source$.next(2);
    expect(last).toBe(1);
  });

  it('should allow a manual DestroyRef to be passed', () => {
    const injector = Injector.create({providers: []}) as EnvironmentInjector;
    const source$ = new BehaviorSubject(0);
    const tied$ = source$.pipe(takeUntilDestroyed(injector.get(DestroyRef)));

    let completed = false;
    let last = 0;

    tied$.subscribe({
      next(value) {
        last = value;
      },
      complete() {
        completed = true;
      }
    });

    source$.next(1);
    expect(last).toBe(1);

    injector.destroy();
    expect(completed).toBeTrue();
    source$.next(2);
    expect(last).toBe(1);
  });
});

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Observable} from 'rxjs';
import {filter, map, take} from 'rxjs/operators';

import {Event, NavigationCancel, NavigationCancellationCode, NavigationEnd, NavigationError, NavigationSkipped} from '../events';

enum NavigationResult {
  COMPLETE,
  FAILED,
  REDIRECTING,
}

/**
 * Performs the given action once the router finishes its next/current navigation.
 *
 * 一旦路由器完成其下一个/当前导航，就执行给定的操作。
 *
 * The navigation is considered complete under the following conditions:
 *
 * 在下列条件下，导航被认为是完成的：
 *
 * - `NavigationCancel` event emits and the code is not `NavigationCancellationCode.Redirect` or
 *   `NavigationCancellationCode.SupersededByNewNavigation`. In these cases, the
 *   redirecting/superseding navigation must finish.
 *
 *   `NavigationCancel` 事件发出并且代码不是 `NavigationCancellationCode.Redirect` 或 `NavigationCancellationCode.SupersededByNewNavigation`。在这些情况下，重定向/取代导航必须完成。
 *
 * - `NavigationError`, `NavigationEnd`, or `NavigationSkipped` event emits
 *
 *   `NavigationError` 、 `NavigationEnd` 或 `NavigationSkipped` 事件发出
 *
 */
export function afterNextNavigation(router: {events: Observable<Event>}, action: () => void) {
  router.events
      .pipe(
          filter(
              (e): e is NavigationEnd|NavigationCancel|NavigationError|NavigationSkipped =>
                  e instanceof NavigationEnd || e instanceof NavigationCancel ||
                  e instanceof NavigationError || e instanceof NavigationSkipped),
          map(e => {
            if (e instanceof NavigationEnd || e instanceof NavigationSkipped) {
              return NavigationResult.COMPLETE;
            }
            const redirecting = e instanceof NavigationCancel ?
                (e.code === NavigationCancellationCode.Redirect ||
                 e.code === NavigationCancellationCode.SupersededByNewNavigation) :
                false;
            return redirecting ? NavigationResult.REDIRECTING : NavigationResult.FAILED;
          }),
          filter(
              (result): result is NavigationResult.COMPLETE|NavigationResult.FAILED =>
                  result !== NavigationResult.REDIRECTING),
          take(1),
          )
      .subscribe(() => {
        action();
      });
}

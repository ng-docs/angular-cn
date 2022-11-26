/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {getComponentViewByInstance} from '../context_discovery';
import {TVIEW} from '../interfaces/view';

import {detectChangesInternal} from './shared';

/**
 * Synchronously perform change detection on a component (and possibly its sub-components).
 *
 * 对组件（可能还有其子组件）同步执行变更检测。
 *
 * This function triggers change detection in a synchronous way on a component.
 *
 * 此函数以同步的方式触发组件上的变更检测。
 *
 * @param component The component which the change detection should be performed on.
 *
 * 应该在其上执行变更检测的组件。
 *
 */
export function detectChanges(component: {}): void {
  const view = getComponentViewByInstance(component);
  detectChangesInternal(view[TVIEW], view, component);
}

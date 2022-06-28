/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {assertDefined} from '../../util/assert';
import {getComponentViewByInstance} from '../context_discovery';
import {CONTEXT, RootContext, RootContextFlags, TVIEW} from '../interfaces/view';
import {getRootView} from '../util/view_traversal_utils';

import {detectChangesInternal, markViewDirty, scheduleTick, tickRootContext} from './shared';

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

/**
 * Marks the component as dirty (needing change detection). Marking a component dirty will
 * schedule a change detection on it at some point in the future.
 *
 * 将组件标记为脏（需要变更检测）。将组件标记为脏将安排在将来的某个时候对其进行变更检测。
 *
 * Marking an already dirty component as dirty won't do anything. Only one outstanding change
 * detection can be scheduled per component tree.
 *
 * 将已经脏的组件标记为脏不会做任何事情。每个组件树只能调度一个未完成的变更检测。
 *
 * @param component Component to mark as dirty.
 *
 * 要标记为脏的组件。
 *
 */
export function markDirty(component: {}): void {
  ngDevMode && assertDefined(component, 'component');
  const rootView = markViewDirty(getComponentViewByInstance(component))!;

  ngDevMode && assertDefined(rootView[CONTEXT], 'rootContext should be defined');
  scheduleTick(rootView[CONTEXT] as RootContext, RootContextFlags.DetectChanges);
}

/**
 * Used to perform change detection on the whole application.
 *
 * 用于对整个应用程序执行变更检测。
 *
 * This is equivalent to `detectChanges`, but invoked on root component. Additionally, `tick`
 * executes lifecycle hooks and conditionally checks components based on their
 * `ChangeDetectionStrategy` and dirtiness.
 *
 * 这等效于 `detectChanges` ，但在根组件上调用。此外，`tick` 执行生命周期钩子，并根据组件的
 * `ChangeDetectionStrategy` 和脏度有条件地检查组件。
 *
 * The preferred way to trigger change detection is to call `markDirty`. `markDirty` internally
 * schedules `tick` using a scheduler in order to coalesce multiple `markDirty` calls into a
 * single change detection run. By default, the scheduler is `requestAnimationFrame`, but can
 * be changed when calling `renderComponent` and providing the `scheduler` option.
 *
 * 触发变更检测的首选方法是调用 `markDirty` 。 `markDirty` 使用调度程序在内部调度 `tick`
 * ，以便将多个 `markDirty` 调用合并到一次变更检测运行中。默认情况下，调度程序是
 * `requestAnimationFrame` ，但可以在调用 `renderComponent` 并提供 `scheduler` 选项时更改。
 *
 */
export function tick(component: {}): void {
  const rootView = getRootView(component);
  const rootContext = rootView[CONTEXT] as RootContext;
  tickRootContext(rootContext);
}

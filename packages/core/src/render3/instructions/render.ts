/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {retrieveHydrationInfo} from '../../hydration/utils';
import {assertEqual} from '../../util/assert';
import {RenderFlags} from '../interfaces/definition';
import {CONTEXT, FLAGS, HOST, HYDRATION, INJECTOR, LView, LViewFlags, TVIEW, TView} from '../interfaces/view';
import {enterView, leaveView} from '../state';
import {getComponentLViewByIndex, isCreationMode} from '../util/view_utils';

import {executeTemplate, executeViewQueryFn, refreshContentQueries} from './shared';

export function renderComponent(hostLView: LView, componentHostIdx: number) {
  ngDevMode && assertEqual(isCreationMode(hostLView), true, 'Should be run in creation mode');
  const componentView = getComponentLViewByIndex(componentHostIdx, hostLView);
  const componentTView = componentView[TVIEW];
  syncViewWithBlueprint(componentTView, componentView);

  const hostRNode = componentView[HOST];
  // Populate an LView with hydration info retrieved from the DOM via TransferState.
  if (hostRNode !== null && componentView[HYDRATION] === null) {
    componentView[HYDRATION] = retrieveHydrationInfo(hostRNode, componentView[INJECTOR]!);
  }

  renderView(componentTView, componentView, componentView[CONTEXT]);
}

/**
 * Syncs an LView instance with its blueprint if they have gotten out of sync.
 *
 * 如果 LView 实例不同步，则将它们与其蓝图同步。
 *
 * Typically, blueprints and their view instances should always be in sync, so the loop here
 * will be skipped. However, consider this case of two components side-by-side:
 *
 * 通常，蓝图和它们的视图实例应该总是同步的，所以这里的循环将被跳过。 但是，并排考虑两个组件的情况：
 *
 * App template:
 *
 * 应用模板：
 *
 * ```
 * <comp></comp>
 * <comp></comp>
 * ```
 *
 * The following will happen:
 *
 * 1. App template begins processing.
 * 2. First <comp> is matched as a component and its LView is created.
 * 3. Second <comp> is matched as a component and its LView is created.
 * 4. App template completes processing, so it's time to check child templates.
 * 5. First <comp> template is checked. It has a directive, so its def is pushed to blueprint.
 * 6. Second <comp> template is checked. Its blueprint has been updated by the first
 *    <comp> template, but its LView was created before this update, so it is out of sync.
 *
 * Note that embedded views inside ngFor loops will never be out of sync because these views
 * are processed as soon as they are created.
 *
 * 请注意，ngFor 循环中的嵌入式视图永远不会不同步，因为这些视图在创建后会立即处理。
 *
 * @param tView The `TView` that contains the blueprint for syncing
 *
 * 包含同步蓝图的 `TView`
 *
 * @param lView The view to sync
 *
 * 要同步的视图
 *
 */
export function syncViewWithBlueprint(tView: TView, lView: LView) {
  for (let i = lView.length; i < tView.blueprint.length; i++) {
    lView.push(tView.blueprint[i]);
  }
}

/**
 * Processes a view in the creation mode. This includes a number of steps in a specific order:
 *
 * 在创建模式下处理视图。 这包括按特定顺序执行的多个步骤：
 *
 * - creating view query functions \(if any\);
 *
 *   创建视图查询函数（如果有的话）；
 *
 * - executing a template function in the creation mode;
 *
 *   在创建模式下执行模板函数；
 *
 * - updating static queries \(if any\);
 *
 *   更新静态查询（如果有的话）；
 *
 * - creating child components defined in a given view.
 *
 *   创建在给定视图中定义的子组件。
 *
 */
export function renderView<T>(tView: TView, lView: LView<T>, context: T): void {
  ngDevMode && assertEqual(isCreationMode(lView), true, 'Should be run in creation mode');
  enterView(lView);
  try {
    const viewQuery = tView.viewQuery;
    if (viewQuery !== null) {
      executeViewQueryFn<T>(RenderFlags.Create, viewQuery, context);
    }

    // Execute a template associated with this view, if it exists. A template function might not be
    // defined for the root component views.
    const templateFn = tView.template;
    if (templateFn !== null) {
      executeTemplate<T>(tView, lView, templateFn, RenderFlags.Create, context);
    }

    // This needs to be set before children are processed to support recursive components.
    // This must be set to false immediately after the first creation run because in an
    // ngFor loop, all the views will be created together before update mode runs and turns
    // off firstCreatePass. If we don't set it here, instances will perform directive
    // matching, etc again and again.
    if (tView.firstCreatePass) {
      tView.firstCreatePass = false;
    }

    // We resolve content queries specifically marked as `static` in creation mode. Dynamic
    // content queries are resolved during change detection (i.e. update mode), after embedded
    // views are refreshed (see block above).
    if (tView.staticContentQueries) {
      refreshContentQueries(tView, lView);
    }

    // We must materialize query results before child components are processed
    // in case a child component has projected a container. The LContainer needs
    // to exist so the embedded views are properly attached by the container.
    if (tView.staticViewQueries) {
      executeViewQueryFn<T>(RenderFlags.Update, tView.viewQuery!, context);
    }

    // Render child component views.
    const components = tView.components;
    if (components !== null) {
      renderChildComponents(lView, components);
    }

  } catch (error) {
    // If we didn't manage to get past the first template pass due to
    // an error, mark the view as corrupted so we can try to recover.
    if (tView.firstCreatePass) {
      tView.incompleteFirstPass = true;
      tView.firstCreatePass = false;
    }

    throw error;
  } finally {
    lView[FLAGS] &= ~LViewFlags.CreationMode;
    leaveView();
  }
}

/**
 * Renders child components in the current view \(creation mode\).
 *
 * 在当前视图（创建模式）中呈现子组件。
 *
 */
function renderChildComponents(hostLView: LView, components: number[]): void {
  for (let i = 0; i < components.length; i++) {
    renderComponent(hostLView, components[i]);
  }
}

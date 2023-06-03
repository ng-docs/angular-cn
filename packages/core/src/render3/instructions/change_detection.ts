/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {assertDefined, assertEqual} from '../../util/assert';
import {assertLContainer} from '../assert';
import {getComponentViewByInstance} from '../context_discovery';
import {executeCheckHooks, executeInitAndCheckHooks, incrementInitPhaseFlags} from '../hooks';
import {CONTAINER_HEADER_OFFSET, HAS_TRANSPLANTED_VIEWS, LContainer, MOVED_VIEWS} from '../interfaces/container';
import {ComponentTemplate, RenderFlags} from '../interfaces/definition';
import {CONTEXT, DESCENDANT_VIEWS_TO_REFRESH, ENVIRONMENT, FLAGS, InitPhaseState, LView, LViewFlags, PARENT, TVIEW, TView} from '../interfaces/view';
import {enterView, isInCheckNoChangesMode, leaveView, setBindingIndex, setIsInCheckNoChangesMode} from '../state';
import {getFirstLContainer, getNextLContainer} from '../util/view_traversal_utils';
import {clearViewRefreshFlag, getComponentLViewByIndex, isCreationMode, markViewForRefresh, resetPreOrderHookFlags, viewAttachedToChangeDetector} from '../util/view_utils';

import {executeTemplate, executeViewQueryFn, handleError, processHostBindingOpCodes, refreshContentQueries} from './shared';

export function detectChangesInternal<T>(
    tView: TView, lView: LView, context: T, notifyErrorHandler = true) {
  const rendererFactory = lView[ENVIRONMENT].rendererFactory;

  // Check no changes mode is a dev only mode used to verify that bindings have not changed
  // since they were assigned. We do not want to invoke renderer factory functions in that mode
  // to avoid any possible side-effects.
  const checkNoChangesMode = !!ngDevMode && isInCheckNoChangesMode();

  if (!checkNoChangesMode && rendererFactory.begin) rendererFactory.begin();
  try {
    refreshView(tView, lView, tView.template, context);
  } catch (error) {
    if (notifyErrorHandler) {
      handleError(lView, error);
    }
    throw error;
  } finally {
    if (!checkNoChangesMode && rendererFactory.end) rendererFactory.end();

    // One final flush of the effects queue to catch any effects created in `ngAfterViewInit` or
    // other post-order hooks.
    !checkNoChangesMode && lView[ENVIRONMENT].effectManager?.flush();
  }
}

export function checkNoChangesInternal<T>(
    tView: TView, lView: LView, context: T, notifyErrorHandler = true) {
  setIsInCheckNoChangesMode(true);
  try {
    detectChangesInternal(tView, lView, context, notifyErrorHandler);
  } finally {
    setIsInCheckNoChangesMode(false);
  }
}

/**
 * Synchronously perform change detection on a component \(and possibly its sub-components\).
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
 */
export function detectChanges(component: {}): void {
  const view = getComponentViewByInstance(component);
  detectChangesInternal(view[TVIEW], view, component);
}

/**
 * Different modes of traversing the logical view tree during change detection.
 *
 * 在变更检测期间遍历逻辑视图树的不同模式。
 *
 * The change detection traversal algorithm switches between these modes based on various
 * conditions.
 *
 * 变化检测遍历算法根据各种条件在这些模式之间切换。
 *
 */
const enum ChangeDetectionMode {
  /**
   * In `Global` mode, `Dirty` and `CheckAlways` views are refreshed as well as views with the
   * `RefreshTransplantedView` flag.
   *
   * 在 `Global` 模式下，刷新 `Dirty` 和 `CheckAlways` 视图以及带有 `RefreshTransplantedView` 标志的视图。
   *
   */
  Global,
  /**
   * In `Targeted` mode, only views with the `RefreshTransplantedView`
   * flag are refreshed.
   *
   * 在 `Targeted` 模式下，仅刷新带有 `RefreshTransplantedView` 标志的视图。
   *
   */
  Targeted,
  /**
   * Used when refreshing a view to force a refresh of its embedded views. This mode
   * refreshes views without taking into account their LView flags, i.e. non-dirty OnPush components
   * will be refreshed in this mode.
   *
   * 在刷新视图以强制刷新其嵌入视图时使用。 此模式刷新视图时不考虑它们的 LView 标志，即非脏 OnPush 组件将在此模式下刷新。
   *
   * TODO: we should work to remove this mode. It's used in `refreshView` because that's how the
   * code worked before introducing ChangeDetectionMode. Instead, it should pass `Global` to the
   * `detectChangesInEmbeddedViews`. We should aim to fix this by v17 or, at the very least, prevent
   * this flag from affecting signal views not specifically marked for refresh \(currently, this flag
   * would _also_ force signal views to be refreshed\).
   *
   * TODO：我们应该努力移除这个模式。 它在 `refreshView` 中使用，因为在引入 ChangeDetectionMode 之前代码就是这样工作的。 相反，它应该将 `Global` 传递给 `detectChangesInEmbeddedViews` 。 我们的目标应该是在 v17 之前解决这个问题，或者至少，防止这个标志影响没有特别标记为刷新的信号视图（目前，这个标志 _ 也会 _ 强制刷新信号视图）。
   *
   */
  BugToForceRefreshAndIgnoreViewFlags
}

/**
 * Processes a view in update mode. This includes a number of steps in a specific order:
 *
 * 在更新模式下处理视图。 这包括按特定顺序执行的多个步骤：
 *
 * - executing a template function in update mode;
 *
 *   在更新模式下执行模板函数；
 *
 * - executing hooks;
 *
 *   执行挂钩；
 *
 * - refreshing queries;
 *
 *   刷新查询；
 *
 * - setting host bindings;
 *
 *   设置宿主绑定；
 *
 * - refreshing child \(embedded and component\) views.
 *
 *   刷新子（嵌入式和组件）视图。
 *
 */

export function refreshView<T>(
    tView: TView, lView: LView, templateFn: ComponentTemplate<{}>|null, context: T) {
  ngDevMode && assertEqual(isCreationMode(lView), false, 'Should be run in update mode');
  const flags = lView[FLAGS];
  if ((flags & LViewFlags.Destroyed) === LViewFlags.Destroyed) return;

  // Check no changes mode is a dev only mode used to verify that bindings have not changed
  // since they were assigned. We do not want to execute lifecycle hooks in that mode.
  const isInCheckNoChangesPass = ngDevMode && isInCheckNoChangesMode();

  !isInCheckNoChangesPass && lView[ENVIRONMENT].effectManager?.flush();

  enterView(lView);
  try {
    resetPreOrderHookFlags(lView);

    setBindingIndex(tView.bindingStartIndex);
    if (templateFn !== null) {
      executeTemplate(tView, lView, templateFn, RenderFlags.Update, context);
    }

    const hooksInitPhaseCompleted =
        (flags & LViewFlags.InitPhaseStateMask) === InitPhaseState.InitPhaseCompleted;

    // execute pre-order hooks (OnInit, OnChanges, DoCheck)
    // PERF WARNING: do NOT extract this to a separate function without running benchmarks
    if (!isInCheckNoChangesPass) {
      if (hooksInitPhaseCompleted) {
        const preOrderCheckHooks = tView.preOrderCheckHooks;
        if (preOrderCheckHooks !== null) {
          executeCheckHooks(lView, preOrderCheckHooks, null);
        }
      } else {
        const preOrderHooks = tView.preOrderHooks;
        if (preOrderHooks !== null) {
          executeInitAndCheckHooks(lView, preOrderHooks, InitPhaseState.OnInitHooksToBeRun, null);
        }
        incrementInitPhaseFlags(lView, InitPhaseState.OnInitHooksToBeRun);
      }
    }

    // First mark transplanted views that are declared in this lView as needing a refresh at their
    // insertion points. This is needed to avoid the situation where the template is defined in this
    // `LView` but its declaration appears after the insertion component.
    markTransplantedViewsForRefresh(lView);
    detectChangesInEmbeddedViews(lView, ChangeDetectionMode.BugToForceRefreshAndIgnoreViewFlags);

    // Content query results must be refreshed before content hooks are called.
    if (tView.contentQueries !== null) {
      refreshContentQueries(tView, lView);
    }

    // execute content hooks (AfterContentInit, AfterContentChecked)
    // PERF WARNING: do NOT extract this to a separate function without running benchmarks
    if (!isInCheckNoChangesPass) {
      if (hooksInitPhaseCompleted) {
        const contentCheckHooks = tView.contentCheckHooks;
        if (contentCheckHooks !== null) {
          executeCheckHooks(lView, contentCheckHooks);
        }
      } else {
        const contentHooks = tView.contentHooks;
        if (contentHooks !== null) {
          executeInitAndCheckHooks(
              lView, contentHooks, InitPhaseState.AfterContentInitHooksToBeRun);
        }
        incrementInitPhaseFlags(lView, InitPhaseState.AfterContentInitHooksToBeRun);
      }
    }

    processHostBindingOpCodes(tView, lView);

    // Refresh child component views.
    const components = tView.components;
    if (components !== null) {
      detectChangesInChildComponents(lView, components, ChangeDetectionMode.Global);
    }

    // View queries must execute after refreshing child components because a template in this view
    // could be inserted in a child component. If the view query executes before child component
    // refresh, the template might not yet be inserted.
    const viewQuery = tView.viewQuery;
    if (viewQuery !== null) {
      executeViewQueryFn<T>(RenderFlags.Update, viewQuery, context);
    }

    // execute view hooks (AfterViewInit, AfterViewChecked)
    // PERF WARNING: do NOT extract this to a separate function without running benchmarks
    if (!isInCheckNoChangesPass) {
      if (hooksInitPhaseCompleted) {
        const viewCheckHooks = tView.viewCheckHooks;
        if (viewCheckHooks !== null) {
          executeCheckHooks(lView, viewCheckHooks);
        }
      } else {
        const viewHooks = tView.viewHooks;
        if (viewHooks !== null) {
          executeInitAndCheckHooks(lView, viewHooks, InitPhaseState.AfterViewInitHooksToBeRun);
        }
        incrementInitPhaseFlags(lView, InitPhaseState.AfterViewInitHooksToBeRun);
      }
    }
    if (tView.firstUpdatePass === true) {
      // We need to make sure that we only flip the flag on successful `refreshView` only
      // Don't do this in `finally` block.
      // If we did this in `finally` block then an exception could block the execution of styling
      // instructions which in turn would be unable to insert themselves into the styling linked
      // list. The result of this would be that if the exception would not be throw on subsequent CD
      // the styling would be unable to process it data and reflect to the DOM.
      tView.firstUpdatePass = false;
    }

    // Do not reset the dirty state when running in check no changes mode. We don't want components
    // to behave differently depending on whether check no changes is enabled or not. For example:
    // Marking an OnPush component as dirty from within the `ngAfterViewInit` hook in order to
    // refresh a `NgClass` binding should work. If we would reset the dirty state in the check
    // no changes cycle, the component would be not be dirty for the next update pass. This would
    // be different in production mode where the component dirty state is not reset.
    if (!isInCheckNoChangesPass) {
      lView[FLAGS] &= ~(LViewFlags.Dirty | LViewFlags.FirstLViewPass);
    }
    clearViewRefreshFlag(lView);
  } finally {
    leaveView();
  }
}

/**
 * Goes over embedded views \(ones created through ViewContainerRef APIs\) and refreshes
 * them by executing an associated template function.
 *
 * 遍历嵌入式视图（通过 ViewContainerRef API 创建的视图）并通过执行关联的模板函数来刷新它们。
 *
 */
function detectChangesInEmbeddedViews(lView: LView, mode: ChangeDetectionMode) {
  for (let lContainer = getFirstLContainer(lView); lContainer !== null;
       lContainer = getNextLContainer(lContainer)) {
    for (let i = CONTAINER_HEADER_OFFSET; i < lContainer.length; i++) {
      const embeddedLView = lContainer[i];
      detectChangesInView(embeddedLView, mode);
    }
  }
}

/**
 * Mark transplanted views as needing to be refreshed at their insertion points.
 *
 * 将移植的视图标记为需要在其插入点刷新。
 *
 * @param lView The `LView` that may have transplanted views.
 *
 * 可能有移植视图的 `LView` 。
 *
 */
function markTransplantedViewsForRefresh(lView: LView) {
  for (let lContainer = getFirstLContainer(lView); lContainer !== null;
       lContainer = getNextLContainer(lContainer)) {
    if (!lContainer[HAS_TRANSPLANTED_VIEWS]) continue;

    const movedViews = lContainer[MOVED_VIEWS]!;
    ngDevMode && assertDefined(movedViews, 'Transplanted View flags set but missing MOVED_VIEWS');
    for (let i = 0; i < movedViews.length; i++) {
      const movedLView = movedViews[i]!;
      const insertionLContainer = movedLView[PARENT] as LContainer;
      ngDevMode && assertLContainer(insertionLContainer);
      markViewForRefresh(movedLView);
    }
  }
}

/**
 * Detects changes in a component by entering the component view and processing its bindings,
 * queries, etc. if it is CheckAlways, OnPush and Dirty, etc.
 *
 * 通过进入组件视图并处理其绑定、查询等来检测组件中的更改，如果它是 CheckAlways、OnPush 和 Dirty 等。
 *
 * @param componentHostIdx  Element index in LView\[\] \(adjusted for HEADER_OFFSET\)
 *
 * LView\[\] 中的元素索引（针对 HEADER_OFFSET 进行了调整）
 *
 */
function detectChangesInComponent(
    hostLView: LView, componentHostIdx: number, mode: ChangeDetectionMode): void {
  ngDevMode && assertEqual(isCreationMode(hostLView), false, 'Should be run in update mode');
  const componentView = getComponentLViewByIndex(componentHostIdx, hostLView);
  detectChangesInView(componentView, mode);
}

/**
 * Visits a view as part of change detection traversal.
 *
 * 作为变更检测遍历的一部分访问视图。
 *
 * - If the view is detached, no additional traversal happens.
 *
 *   如果视图是分离的，则不会发生额外的遍历。
 *
 * The view is refreshed if:
 *
 * 在以下情况下刷新视图：
 *
 * - If the view is CheckAlways or Dirty and ChangeDetectionMode is `Global`
 *
 *   如果视图是 CheckAlways 或 Dirty 并且 ChangeDetectionMode 是 `Global`
 *
 * - If the view has the `RefreshTransplantedView` flag
 *
 *   如果视图具有 `RefreshTransplantedView` 标志
 *
 * The view is not refreshed, but descendants are traversed in `ChangeDetectionMode.Targeted` if the
 * view has a non-zero TRANSPLANTED_VIEWS_TO_REFRESH counter.
 *
 * 不刷新视图，但在 `ChangeDetectionMode.Targeted` 中遍历后代（如果视图具有非零 TRANSPLANTED_VIEWS_TO_REFRESH 计数器）。
 *
 */
function detectChangesInView(lView: LView, mode: ChangeDetectionMode) {
  if (!viewAttachedToChangeDetector(lView)) {
    return;
  }

  const tView = lView[TVIEW];
  if ((lView[FLAGS] & (LViewFlags.CheckAlways | LViewFlags.Dirty) &&
       mode === ChangeDetectionMode.Global) ||
      lView[FLAGS] & LViewFlags.RefreshView ||
      mode === ChangeDetectionMode.BugToForceRefreshAndIgnoreViewFlags) {
    refreshView(tView, lView, tView.template, lView[CONTEXT]);
  } else if (lView[DESCENDANT_VIEWS_TO_REFRESH] > 0) {
    detectChangesInEmbeddedViews(lView, ChangeDetectionMode.Targeted);

    const tView = lView[TVIEW];
    const components = tView.components;
    if (components !== null) {
      detectChangesInChildComponents(lView, components, ChangeDetectionMode.Targeted);
    }
  }
}

/**
 * Refreshes child components in the current view \(update mode\).
 *
 * 刷新当前视图中的子组件（更新模式）。
 *
 */
function detectChangesInChildComponents(
    hostLView: LView, components: number[], mode: ChangeDetectionMode): void {
  for (let i = 0; i < components.length; i++) {
    detectChangesInComponent(hostLView, components[i], mode);
  }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ViewEncapsulation} from '../metadata/view';
import {RendererStyleFlags2} from '../render/api_flags';
import {addToArray, removeFromArray} from '../util/array_utils';
import {assertDefined, assertEqual, assertFunction, assertNumber, assertString} from '../util/assert';
import {escapeCommentText} from '../util/dom';

import {assertLContainer, assertLView, assertParentView, assertProjectionSlots, assertTNodeForLView} from './assert';
import {attachPatchData} from './context_discovery';
import {icuContainerIterate} from './i18n/i18n_tree_shaking';
import {CONTAINER_HEADER_OFFSET, HAS_TRANSPLANTED_VIEWS, LContainer, MOVED_VIEWS, NATIVE, unusedValueExportToPlacateAjd as unused1} from './interfaces/container';
import {ComponentDef} from './interfaces/definition';
import {NodeInjectorFactory} from './interfaces/injector';
import {unregisterLView} from './interfaces/lview_tracking';
import {TElementNode, TIcuContainerNode, TNode, TNodeFlags, TNodeType, TProjectionNode, unusedValueExportToPlacateAjd as unused2} from './interfaces/node';
import {unusedValueExportToPlacateAjd as unused3} from './interfaces/projection';
import {Renderer, unusedValueExportToPlacateAjd as unused4} from './interfaces/renderer';
import {RComment, RElement, RNode, RTemplate, RText} from './interfaces/renderer_dom';
import {isLContainer, isLView} from './interfaces/type_checks';
import {CHILD_HEAD, CLEANUP, DECLARATION_COMPONENT_VIEW, DECLARATION_LCONTAINER, DestroyHookData, FLAGS, HookData, HookFn, HOST, LView, LViewFlags, NEXT, PARENT, QUERIES, RENDERER, T_HOST, TVIEW, TView, TViewType, unusedValueExportToPlacateAjd as unused5} from './interfaces/view';
import {assertTNodeType} from './node_assert';
import {profiler, ProfilerEvent} from './profiler';
import {setUpAttributes} from './util/attrs_utils';
import {getLViewParent} from './util/view_traversal_utils';
import {getNativeByTNode, unwrapRNode, updateTransplantedViewCount} from './util/view_utils';



const unusedValueToPlacateAjd = unused1 + unused2 + unused3 + unused4 + unused5;

const enum WalkTNodeTreeAction {
  /**
   * node create in the native environment. Run on initial creation.
   *
   * node 在本机环境中创建。在初始创建时运行。
   *
   */
  Create = 0,

  /**
   * node insert in the native environment.
   * Run when existing node has been detached and needs to be re-attached.
   *
   * 本机环境中的节点插入。在现有节点已分离并需要重新附加时运行。
   *
   */
  Insert = 1,

  /**
   * node detach from the native environment
   *
   * 节点从本机环境分离
   *
   */
  Detach = 2,

  /**
   * node destruction using the renderer's API
   *
   * 使用渲染器的 API 销毁节点
   *
   */
  Destroy = 3,
}



/**
 * NOTE: for performance reasons, the possible actions are inlined within the function instead of
 * being passed as an argument.
 *
 * 注意：出于性能原因，可能的操作是在函数中内联的，而不是作为参数传递。
 *
 */
function applyToElementOrContainer(
    action: WalkTNodeTreeAction, renderer: Renderer, parent: RElement|null,
    lNodeToHandle: RNode|LContainer|LView, beforeNode?: RNode|null) {
  // If this slot was allocated for a text node dynamically created by i18n, the text node itself
  // won't be created until i18nApply() in the update block, so this node should be skipped.
  // For more info, see "ICU expressions should work inside an ngTemplateOutlet inside an ngFor"
  // in `i18n_spec.ts`.
  if (lNodeToHandle != null) {
    let lContainer: LContainer|undefined;
    let isComponent = false;
    // We are expecting an RNode, but in the case of a component or LContainer the `RNode` is
    // wrapped in an array which needs to be unwrapped. We need to know if it is a component and if
    // it has LContainer so that we can process all of those cases appropriately.
    if (isLContainer(lNodeToHandle)) {
      lContainer = lNodeToHandle;
    } else if (isLView(lNodeToHandle)) {
      isComponent = true;
      ngDevMode && assertDefined(lNodeToHandle[HOST], 'HOST must be defined for a component LView');
      lNodeToHandle = lNodeToHandle[HOST]!;
    }
    const rNode: RNode = unwrapRNode(lNodeToHandle);

    if (action === WalkTNodeTreeAction.Create && parent !== null) {
      if (beforeNode == null) {
        nativeAppendChild(renderer, parent, rNode);
      } else {
        nativeInsertBefore(renderer, parent, rNode, beforeNode || null, true);
      }
    } else if (action === WalkTNodeTreeAction.Insert && parent !== null) {
      nativeInsertBefore(renderer, parent, rNode, beforeNode || null, true);
    } else if (action === WalkTNodeTreeAction.Detach) {
      nativeRemoveNode(renderer, rNode, isComponent);
    } else if (action === WalkTNodeTreeAction.Destroy) {
      ngDevMode && ngDevMode.rendererDestroyNode++;
      renderer.destroyNode!(rNode);
    }
    if (lContainer != null) {
      applyContainer(renderer, action, lContainer, parent, beforeNode);
    }
  }
}

export function createTextNode(renderer: Renderer, value: string): RText {
  ngDevMode && ngDevMode.rendererCreateTextNode++;
  ngDevMode && ngDevMode.rendererSetText++;
  return renderer.createText(value);
}

export function updateTextNode(renderer: Renderer, rNode: RText, value: string): void {
  ngDevMode && ngDevMode.rendererSetText++;
  renderer.setValue(rNode, value);
}

export function createCommentNode(renderer: Renderer, value: string): RComment {
  ngDevMode && ngDevMode.rendererCreateComment++;
  return renderer.createComment(escapeCommentText(value));
}

/**
 * Creates a native element from a tag name, using a renderer.
 *
 * 使用渲染器从标签名称创建本机元素。
 *
 * @param renderer A renderer to use
 *
 * 要使用的渲染器
 *
 * @param name the tag name
 *
 * 标签名称
 *
 * @param namespace Optional namespace for element.
 *
 * 元素的可选命名空间。
 *
 * @returns
 *
 * the element created
 *
 * 创建的元素
 *
 */
export function createElementNode(
    renderer: Renderer, name: string, namespace: string|null): RElement {
  ngDevMode && ngDevMode.rendererCreateElement++;
  return renderer.createElement(name, namespace);
}


/**
 * Removes all DOM elements associated with a view.
 *
 * 删除与视图关联的所有 DOM 元素。
 *
 * Because some root nodes of the view may be containers, we sometimes need
 * to propagate deeply into the nested containers to remove all elements in the
 * views beneath it.
 *
 * 因为视图的某些根节点可能是容器，所以我们有时需要深入传播到嵌套容器中以删除其下方视图中的所有元素。
 *
 * @param tView The `TView' of the`LView\` from which elements should be added or removed
 *
 * 应该添加或删除元素 `TView' of the`
 *
 * @param lView The view from which elements should be added or removed
 *
 * 应该添加或删除元素的视图
 *
 */
export function removeViewFromContainer(tView: TView, lView: LView): void {
  const renderer = lView[RENDERER];
  applyView(tView, lView, renderer, WalkTNodeTreeAction.Detach, null, null);
  lView[HOST] = null;
  lView[T_HOST] = null;
}

/**
 * Adds all DOM elements associated with a view.
 *
 * 添加与视图关联的所有 DOM 元素。
 *
 * Because some root nodes of the view may be containers, we sometimes need
 * to propagate deeply into the nested containers to add all elements in the
 * views beneath it.
 *
 * 因为视图的某些根节点可能是容器，所以我们有时需要深入传播到嵌套容器中，以添加其下方视图中的所有元素。
 *
 * @param tView The `TView' of the`LView\` from which elements should be added or removed
 *
 * 应该添加或删除元素 `TView' of the`
 *
 * @param parentTNode The `TNode` where the `LView` should be attached to.
 *
 * `TNode` 应该附加到的 `LView` 。
 *
 * @param renderer Current renderer to use for DOM manipulations.
 *
 * 用于 DOM 操作的当前渲染器。
 *
 * @param lView The view from which elements should be added or removed
 *
 * 应该添加或删除元素的视图
 *
 * @param parentNativeNode The parent `RElement` where it should be inserted into.
 *
 * 应将其插入到的父 `RElement` 。
 *
 * @param beforeNode The node before which elements should be added, if insert mode
 *
 * 如果是插入模式，则应在其之前添加元素的节点
 *
 */
export function addViewToContainer(
    tView: TView, parentTNode: TNode, renderer: Renderer, lView: LView, parentNativeNode: RElement,
    beforeNode: RNode|null): void {
  lView[HOST] = parentNativeNode;
  lView[T_HOST] = parentTNode;
  applyView(tView, lView, renderer, WalkTNodeTreeAction.Insert, parentNativeNode, beforeNode);
}


/**
 * Detach a `LView` from the DOM by detaching its nodes.
 *
 * 通过分离其节点来将 `LView` 从 DOM 中分离。
 *
 * @param tView The `TView' of the`LView\` to be detached
 *
 * 要分离 `TView' of the`
 *
 * @param lView the `LView` to be detached.
 *
 * 要分离的 `LView` 。
 *
 */
export function renderDetachView(tView: TView, lView: LView) {
  applyView(tView, lView, lView[RENDERER], WalkTNodeTreeAction.Detach, null, null);
}

/**
 * Traverses down and up the tree of views and containers to remove listeners and
 * call onDestroy callbacks.
 *
 * 向下和向上遍历视图和容器树以删除侦听器并调用 onDestroy 回调。
 *
 * Notes:
 *
 * 说明：
 *
 * - Because it's used for onDestroy calls, it needs to be bottom-up.
 *
 *   因为它用于 onDestroy 调用，所以它需要是自下而上的。
 *
 * - Must process containers instead of their views to avoid splicing
 *   when views are destroyed and re-added.
 *
 *   必须处理容器而不是它们的视图，以避免在视图被破坏和重新添加时发生拼接。
 *
 * - Using a while loop because it's faster than recursion
 *
 *   使用 while 循环，因为它比递归快
 *
 * - Destroy only called on movement to sibling or movement to parent (laterally or up)
 *
 *   仅在移动到同级或移动到父级（横向或向上）时才调用销毁
 *
 * @param rootView The view to destroy
 *
 * 要破坏的视图
 *
 */
export function destroyViewTree(rootView: LView): void {
  // If the view has no children, we can clean it up and return early.
  let lViewOrLContainer = rootView[CHILD_HEAD];
  if (!lViewOrLContainer) {
    return cleanUpView(rootView[TVIEW], rootView);
  }

  while (lViewOrLContainer) {
    let next: LView|LContainer|null = null;

    if (isLView(lViewOrLContainer)) {
      // If LView, traverse down to child.
      next = lViewOrLContainer[CHILD_HEAD];
    } else {
      ngDevMode && assertLContainer(lViewOrLContainer);
      // If container, traverse down to its first LView.
      const firstView: LView|undefined = lViewOrLContainer[CONTAINER_HEADER_OFFSET];
      if (firstView) next = firstView;
    }

    if (!next) {
      // Only clean up view when moving to the side or up, as destroy hooks
      // should be called in order from the bottom up.
      while (lViewOrLContainer && !lViewOrLContainer![NEXT] && lViewOrLContainer !== rootView) {
        if (isLView(lViewOrLContainer)) {
          cleanUpView(lViewOrLContainer[TVIEW], lViewOrLContainer);
        }
        lViewOrLContainer = lViewOrLContainer[PARENT];
      }
      if (lViewOrLContainer === null) lViewOrLContainer = rootView;
      if (isLView(lViewOrLContainer)) {
        cleanUpView(lViewOrLContainer[TVIEW], lViewOrLContainer);
      }
      next = lViewOrLContainer && lViewOrLContainer![NEXT];
    }
    lViewOrLContainer = next;
  }
}

/**
 * Inserts a view into a container.
 *
 * 将视图插入容器。
 *
 * This adds the view to the container's array of active views in the correct
 * position. It also adds the view's elements to the DOM if the container isn't a
 * root node of another view (in that case, the view's elements will be added when
 * the container's parent view is added later).
 *
 * 这会将视图添加到容器的活动视图数组中的正确位置。如果容器不是另一个视图的根节点，它还会将视图的元素添加到
 * DOM（在这种情况下，稍后添加容器的父视图时将添加视图的元素）。
 *
 * @param tView The `TView' of the`LView\` to insert
 *
 * 要插入的 LView\` 的 `TView' of the`
 *
 * @param lView The view to insert
 *
 * 要插入的视图
 *
 * @param lContainer The container into which the view should be inserted
 *
 * 应该插入视图的容器
 *
 * @param index Which index in the container to insert the child view into
 *
 * 要将子视图插入到容器中的哪个索引
 *
 */
export function insertView(tView: TView, lView: LView, lContainer: LContainer, index: number) {
  ngDevMode && assertLView(lView);
  ngDevMode && assertLContainer(lContainer);
  const indexInContainer = CONTAINER_HEADER_OFFSET + index;
  const containerLength = lContainer.length;

  if (index > 0) {
    // This is a new view, we need to add it to the children.
    lContainer[indexInContainer - 1][NEXT] = lView;
  }
  if (index < containerLength - CONTAINER_HEADER_OFFSET) {
    lView[NEXT] = lContainer[indexInContainer];
    addToArray(lContainer, CONTAINER_HEADER_OFFSET + index, lView);
  } else {
    lContainer.push(lView);
    lView[NEXT] = null;
  }

  lView[PARENT] = lContainer;

  // track views where declaration and insertion points are different
  const declarationLContainer = lView[DECLARATION_LCONTAINER];
  if (declarationLContainer !== null && lContainer !== declarationLContainer) {
    trackMovedView(declarationLContainer, lView);
  }

  // notify query that a new view has been added
  const lQueries = lView[QUERIES];
  if (lQueries !== null) {
    lQueries.insertView(tView);
  }

  // Sets the attached flag
  lView[FLAGS] |= LViewFlags.Attached;
}

/**
 * Track views created from the declaration container (TemplateRef) and inserted into a
 * different LContainer.
 *
 * 跟踪从声明容器 (TemplateRef) 创建并插入到不同 LContainer 中的视图。
 *
 */
function trackMovedView(declarationContainer: LContainer, lView: LView) {
  ngDevMode && assertDefined(lView, 'LView required');
  ngDevMode && assertLContainer(declarationContainer);
  const movedViews = declarationContainer[MOVED_VIEWS];
  const insertedLContainer = lView[PARENT] as LContainer;
  ngDevMode && assertLContainer(insertedLContainer);
  const insertedComponentLView = insertedLContainer[PARENT]![DECLARATION_COMPONENT_VIEW];
  ngDevMode && assertDefined(insertedComponentLView, 'Missing insertedComponentLView');
  const declaredComponentLView = lView[DECLARATION_COMPONENT_VIEW];
  ngDevMode && assertDefined(declaredComponentLView, 'Missing declaredComponentLView');
  if (declaredComponentLView !== insertedComponentLView) {
    // At this point the declaration-component is not same as insertion-component; this means that
    // this is a transplanted view. Mark the declared lView as having transplanted views so that
    // those views can participate in CD.
    declarationContainer[HAS_TRANSPLANTED_VIEWS] = true;
  }
  if (movedViews === null) {
    declarationContainer[MOVED_VIEWS] = [lView];
  } else {
    movedViews.push(lView);
  }
}

function detachMovedView(declarationContainer: LContainer, lView: LView) {
  ngDevMode && assertLContainer(declarationContainer);
  ngDevMode &&
      assertDefined(
          declarationContainer[MOVED_VIEWS],
          'A projected view should belong to a non-empty projected views collection');
  const movedViews = declarationContainer[MOVED_VIEWS]!;
  const declarationViewIndex = movedViews.indexOf(lView);
  const insertionLContainer = lView[PARENT] as LContainer;
  ngDevMode && assertLContainer(insertionLContainer);

  // If the view was marked for refresh but then detached before it was checked (where the flag
  // would be cleared and the counter decremented), we need to decrement the view counter here
  // instead.
  if (lView[FLAGS] & LViewFlags.RefreshTransplantedView) {
    lView[FLAGS] &= ~LViewFlags.RefreshTransplantedView;
    updateTransplantedViewCount(insertionLContainer, -1);
  }

  movedViews.splice(declarationViewIndex, 1);
}

/**
 * Detaches a view from a container.
 *
 * 从容器中分离视图。
 *
 * This method removes the view from the container's array of active views. It also
 * removes the view's elements from the DOM.
 *
 * 此方法会从容器的活动视图数组中删除视图。它还会从 DOM 中删除视图的元素。
 *
 * @param lContainer The container from which to detach a view
 *
 * 要从中分离视图的容器
 *
 * @param removeIndex The index of the view to detach
 *
 * 要分离的视图的索引
 *
 * @returns
 *
 * Detached LView instance.
 *
 * 分离的 LView 实例。
 *
 */
export function detachView(lContainer: LContainer, removeIndex: number): LView|undefined {
  if (lContainer.length <= CONTAINER_HEADER_OFFSET) return;

  const indexInContainer = CONTAINER_HEADER_OFFSET + removeIndex;
  const viewToDetach = lContainer[indexInContainer];

  if (viewToDetach) {
    const declarationLContainer = viewToDetach[DECLARATION_LCONTAINER];
    if (declarationLContainer !== null && declarationLContainer !== lContainer) {
      detachMovedView(declarationLContainer, viewToDetach);
    }


    if (removeIndex > 0) {
      lContainer[indexInContainer - 1][NEXT] = viewToDetach[NEXT] as LView;
    }
    const removedLView = removeFromArray(lContainer, CONTAINER_HEADER_OFFSET + removeIndex);
    removeViewFromContainer(viewToDetach[TVIEW], viewToDetach);

    // notify query that a view has been removed
    const lQueries = removedLView[QUERIES];
    if (lQueries !== null) {
      lQueries.detachView(removedLView[TVIEW]);
    }

    viewToDetach[PARENT] = null;
    viewToDetach[NEXT] = null;
    // Unsets the attached flag
    viewToDetach[FLAGS] &= ~LViewFlags.Attached;
  }
  return viewToDetach;
}

/**
 * A standalone function which destroys an LView,
 * conducting clean up (e.g. removing listeners, calling onDestroys).
 *
 * 一个独立函数，它销毁 LView、进行清理（例如删除侦听器、调用 onDestroys）。
 *
 * @param tView The `TView' of the`LView\` to be destroyed
 *
 * 要销毁的 LView\` 的 `TView' of the`
 *
 * @param lView The view to be destroyed.
 *
 * 要被破坏的视图。
 *
 */
export function destroyLView(tView: TView, lView: LView) {
  if (!(lView[FLAGS] & LViewFlags.Destroyed)) {
    const renderer = lView[RENDERER];
    if (renderer.destroyNode) {
      applyView(tView, lView, renderer, WalkTNodeTreeAction.Destroy, null, null);
    }

    destroyViewTree(lView);
  }
}

/**
 * Calls onDestroys hooks for all directives and pipes in a given view and then removes all
 * listeners. Listeners are removed as the last step so events delivered in the onDestroys hooks
 * can be propagated to @Output listeners.
 *
 * 为给定视图中的所有指令和管道调用 onDestroys
 * 钩子，然后删除所有侦听器。侦听器作为最后一步被删除，因此 onDestroys
 * 钩子中传递的事件可以传播给 @Output 侦听器。
 *
 * @param tView `TView` for the `LView` to clean up.
 *
 * 要清理的 `TView` 的 `LView` 。
 *
 * @param lView The LView to clean up
 *
 * 要清理的 LView
 *
 */
function cleanUpView(tView: TView, lView: LView): void {
  if (!(lView[FLAGS] & LViewFlags.Destroyed)) {
    // Usually the Attached flag is removed when the view is detached from its parent, however
    // if it's a root view, the flag won't be unset hence why we're also removing on destroy.
    lView[FLAGS] &= ~LViewFlags.Attached;

    // Mark the LView as destroyed *before* executing the onDestroy hooks. An onDestroy hook
    // runs arbitrary user code, which could include its own `viewRef.destroy()` (or similar). If
    // We don't flag the view as destroyed before the hooks, this could lead to an infinite loop.
    // This also aligns with the ViewEngine behavior. It also means that the onDestroy hook is
    // really more of an "afterDestroy" hook if you think about it.
    lView[FLAGS] |= LViewFlags.Destroyed;

    executeOnDestroys(tView, lView);
    processCleanups(tView, lView);
    // For component views only, the local renderer is destroyed at clean up time.
    if (lView[TVIEW].type === TViewType.Component) {
      ngDevMode && ngDevMode.rendererDestroy++;
      lView[RENDERER].destroy();
    }

    const declarationContainer = lView[DECLARATION_LCONTAINER];
    // we are dealing with an embedded view that is still inserted into a container
    if (declarationContainer !== null && isLContainer(lView[PARENT])) {
      // and this is a projected view
      if (declarationContainer !== lView[PARENT]) {
        detachMovedView(declarationContainer, lView);
      }

      // For embedded views still attached to a container: remove query result from this view.
      const lQueries = lView[QUERIES];
      if (lQueries !== null) {
        lQueries.detachView(tView);
      }
    }

    // Unregister the view once everything else has been cleaned up.
    unregisterLView(lView);
  }
}

/**
 * Removes listeners and unsubscribes from output subscriptions
 *
 * 删除侦听器并从输出订阅中取消订阅
 *
 */
function processCleanups(tView: TView, lView: LView): void {
  const tCleanup = tView.cleanup;
  const lCleanup = lView[CLEANUP]!;
  // `LCleanup` contains both share information with `TCleanup` as well as instance specific
  // information appended at the end. We need to know where the end of the `TCleanup` information
  // is, and we track this with `lastLCleanupIndex`.
  let lastLCleanupIndex = -1;
  if (tCleanup !== null) {
    for (let i = 0; i < tCleanup.length - 1; i += 2) {
      if (typeof tCleanup[i] === 'string') {
        // This is a native DOM listener. It will occupy 4 entries in the TCleanup array (hence i +=
        // 2 at the end of this block).
        const targetIdx = tCleanup[i + 3];
        ngDevMode && assertNumber(targetIdx, 'cleanup target must be a number');
        if (targetIdx >= 0) {
          // unregister
          lCleanup[lastLCleanupIndex = targetIdx]();
        } else {
          // Subscription
          lCleanup[lastLCleanupIndex = -targetIdx].unsubscribe();
        }
        i += 2;
      } else {
        // This is a cleanup function that is grouped with the index of its context
        const context = lCleanup[lastLCleanupIndex = tCleanup[i + 1]];
        tCleanup[i].call(context);
      }
    }
  }
  if (lCleanup !== null) {
    for (let i = lastLCleanupIndex + 1; i < lCleanup.length; i++) {
      const instanceCleanupFn = lCleanup[i];
      ngDevMode && assertFunction(instanceCleanupFn, 'Expecting instance cleanup function.');
      instanceCleanupFn();
    }
    lView[CLEANUP] = null;
  }
}

/**
 * Calls onDestroy hooks for this view
 *
 * 调用此视图的 onDestroy 钩子
 *
 */
function executeOnDestroys(tView: TView, lView: LView): void {
  let destroyHooks: DestroyHookData|null;

  if (tView != null && (destroyHooks = tView.destroyHooks) != null) {
    for (let i = 0; i < destroyHooks.length; i += 2) {
      const context = lView[destroyHooks[i] as number];

      // Only call the destroy hook if the context has been requested.
      if (!(context instanceof NodeInjectorFactory)) {
        const toCall = destroyHooks[i + 1] as HookFn | HookData;

        if (Array.isArray(toCall)) {
          for (let j = 0; j < toCall.length; j += 2) {
            const callContext = context[toCall[j] as number];
            const hook = toCall[j + 1] as HookFn;
            profiler(ProfilerEvent.LifecycleHookStart, callContext, hook);
            try {
              hook.call(callContext);
            } finally {
              profiler(ProfilerEvent.LifecycleHookEnd, callContext, hook);
            }
          }
        } else {
          profiler(ProfilerEvent.LifecycleHookStart, context, toCall);
          try {
            toCall.call(context);
          } finally {
            profiler(ProfilerEvent.LifecycleHookEnd, context, toCall);
          }
        }
      }
    }
  }
}

/**
 * Returns a native element if a node can be inserted into the given parent.
 *
 * 如果可以将节点插入给定的父级，则返回本机元素。
 *
 * There are two reasons why we may not be able to insert a element immediately.
 *
 * 我们可能无法立即插入元素有两个原因。
 *
 * - Projection: When creating a child content element of a component, we have to skip the
 *   insertion because the content of a component will be projected.
 *   `<component><content>delayed due to projection</content></component>`
 *
 *   投影：创建组件的子内容元素时，我们必须跳过插入，因为组件的内容将被投影。
 * `<component><content>delayed due to projection</content></component>`
 *
 * - Parent container is disconnected: This can happen when we are inserting a view into
 *   parent container, which itself is disconnected. For example the parent container is part
 *   of a View which has not be inserted or is made for projection but has not been inserted
 *   into destination.
 *
 *   父容器已断开连接：当我们将视图插入本身已断开连接的父容器时，可能会发生这种情况。例如，父容器是
 * View 的一部分，它尚未插入或用于投影但尚未插入目标。
 *
 * @param tView: Current `TView`.
 * @param tNode: `TNode` for which we wish to retrieve render parent.
 * @param lView: Current `LView`.
 */
export function getParentRElement(tView: TView, tNode: TNode, lView: LView): RElement|null {
  return getClosestRElement(tView, tNode.parent, lView);
}

/**
 * Get closest `RElement` or `null` if it can't be found.
 *
 * 获取最近的 `RElement` ，如果找不到，则获取 `null` 。
 *
 * If `TNode` is `TNodeType.Element` => return `RElement` at `LView[tNode.index]` location.
 * If `TNode` is `TNodeType.ElementContainer|IcuContain` => return the parent (recursively).
 * If `TNode` is `null` then return host `RElement`:
 *
 * 如果 `TNode` 是 `TNodeType.Element` => 在 `LView[tNode.index]` 位置返回 `RElement` 。如果 `TNode`
 * 是 `TNodeType.ElementContainer|IcuContain` => 返回父级（递归）。如果 `TNode` 为 `null`
 * ，则返回主机 `RElement` ：
 *
 * - return `null` if projection
 *
 *   如果是投影，则返回 `null`
 *
 * - return `null` if parent container is disconnected (we have no parent.)
 *
 *   如果父容器已断开连接，则返回 `null`（我们没有父容器。）
 *
 * @param tView: Current `TView`.
 * @param tNode: `TNode` for which we wish to retrieve `RElement` (or `null` if host element is
 *     needed).
 * @param lView: Current `LView`.
 * @returns
 *
 * `null` if the `RElement` can't be determined at this time (no parent / projection)
 *
 * 如果此时无法确定 `RElement`（无父/投影），则为 `null`
 *
 */
export function getClosestRElement(tView: TView, tNode: TNode|null, lView: LView): RElement|null {
  let parentTNode: TNode|null = tNode;
  // Skip over element and ICU containers as those are represented by a comment node and
  // can't be used as a render parent.
  while (parentTNode !== null &&
         (parentTNode.type & (TNodeType.ElementContainer | TNodeType.Icu))) {
    tNode = parentTNode;
    parentTNode = tNode.parent;
  }

  // If the parent tNode is null, then we are inserting across views: either into an embedded view
  // or a component view.
  if (parentTNode === null) {
    // We are inserting a root element of the component view into the component host element and
    // it should always be eager.
    return lView[HOST];
  } else {
    ngDevMode && assertTNodeType(parentTNode, TNodeType.AnyRNode | TNodeType.Container);
    const {componentOffset} = parentTNode;
    if (componentOffset > -1) {
      ngDevMode && assertTNodeForLView(parentTNode, lView);
      const {encapsulation} =
          (tView.data[parentTNode.directiveStart + componentOffset] as ComponentDef<unknown>);
      // We've got a parent which is an element in the current view. We just need to verify if the
      // parent element is not a component. Component's content nodes are not inserted immediately
      // because they will be projected, and so doing insert at this point would be wasteful.
      // Since the projection would then move it to its final destination. Note that we can't
      // make this assumption when using the Shadow DOM, because the native projection placeholders
      // (<content> or <slot>) have to be in place as elements are being inserted.
      if (encapsulation === ViewEncapsulation.None ||
          encapsulation === ViewEncapsulation.Emulated) {
        return null;
      }
    }

    return getNativeByTNode(parentTNode, lView) as RElement;
  }
}

/**
 * Inserts a native node before another native node for a given parent.
 * This is a utility function that can be used when native nodes were determined.
 *
 * 使用 {@link Renderer3}
 * 在给定父级的另一个本机节点之前插入本机节点。这是一个工具函数，可以在确定本机节点时使用 -
 * 它抽象了正在使用的实际渲染器。
 *
 */
export function nativeInsertBefore(
    renderer: Renderer, parent: RElement, child: RNode, beforeNode: RNode|null,
    isMove: boolean): void {
  ngDevMode && ngDevMode.rendererInsertBefore++;
  renderer.insertBefore(parent, child, beforeNode, isMove);
}

function nativeAppendChild(renderer: Renderer, parent: RElement, child: RNode): void {
  ngDevMode && ngDevMode.rendererAppendChild++;
  ngDevMode && assertDefined(parent, 'parent node must be defined');
  renderer.appendChild(parent, child);
}

function nativeAppendOrInsertBefore(
    renderer: Renderer, parent: RElement, child: RNode, beforeNode: RNode|null, isMove: boolean) {
  if (beforeNode !== null) {
    nativeInsertBefore(renderer, parent, child, beforeNode, isMove);
  } else {
    nativeAppendChild(renderer, parent, child);
  }
}

/**
 * Removes a node from the DOM given its native parent.
 *
 * 在给定其本机父级的情况下从 DOM 中删除一个节点。
 *
 */
function nativeRemoveChild(
    renderer: Renderer, parent: RElement, child: RNode, isHostElement?: boolean): void {
  renderer.removeChild(parent, child, isHostElement);
}

/**
 * Checks if an element is a `<template>` node.
 *
 * 检查元素是否是 `<template>` 节点。
 *
 */
function isTemplateNode(node: RElement): node is RTemplate {
  return node.tagName === 'TEMPLATE' && (node as RTemplate).content !== undefined;
}

/**
 * Returns a native parent of a given native node.
 *
 * 返回给定本机节点的本机父级。
 *
 */
export function nativeParentNode(renderer: Renderer, node: RNode): RElement|null {
  return renderer.parentNode(node);
}

/**
 * Returns a native sibling of a given native node.
 *
 * 返回给定本机节点的本机同级。
 *
 */
export function nativeNextSibling(renderer: Renderer, node: RNode): RNode|null {
  return renderer.nextSibling(node);
}

/**
 * Find a node in front of which `currentTNode` should be inserted.
 *
 * 查找应该在其前面插入 `currentTNode` 的节点。
 *
 * This method determines the `RNode` in front of which we should insert the `currentRNode`. This
 * takes `TNode.insertBeforeIndex` into account if i18n code has been invoked.
 *
 * 此方法确定我们应该在其前面插入 `currentRNode` 的 `RNode` 。如果已调用 i18n 代码，这会考虑
 * `TNode.insertBeforeIndex` 。
 *
 * @param parentTNode parent `TNode`
 *
 * 父 `TNode`
 *
 * @param currentTNode current `TNode` (The node which we would like to insert into the DOM)
 *
 * 当前 `TNode`（我们要插入到 DOM 中的节点）
 *
 * @param lView current `LView`
 *
 * 当前的 `LView`
 *
 */
function getInsertInFrontOfRNode(parentTNode: TNode, currentTNode: TNode, lView: LView): RNode|
    null {
  return _getInsertInFrontOfRNodeWithI18n(parentTNode, currentTNode, lView);
}


/**
 * Find a node in front of which `currentTNode` should be inserted. (Does not take i18n into
 * account)
 *
 * 查找应该在其前面插入 `currentTNode` 的节点。（不考虑 i18n）
 *
 * This method determines the `RNode` in front of which we should insert the `currentRNode`. This
 * does not take `TNode.insertBeforeIndex` into account.
 *
 * 此方法确定我们应该在其前面插入 `currentRNode` 的 `RNode` 。这不会将 `TNode.insertBeforeIndex`
 * 考虑在内。
 *
 * @param parentTNode parent `TNode`
 *
 * 父 `TNode`
 *
 * @param currentTNode current `TNode` (The node which we would like to insert into the DOM)
 *
 * 当前 `TNode`（我们要插入到 DOM 中的节点）
 *
 * @param lView current `LView`
 *
 * 当前的 `LView`
 *
 */
export function getInsertInFrontOfRNodeWithNoI18n(
    parentTNode: TNode, currentTNode: TNode, lView: LView): RNode|null {
  if (parentTNode.type & (TNodeType.ElementContainer | TNodeType.Icu)) {
    return getNativeByTNode(parentTNode, lView);
  }
  return null;
}

/**
 * Tree shakable boundary for `getInsertInFrontOfRNodeWithI18n` function.
 *
 * `getInsertInFrontOfRNodeWithI18n` 函数的树形可摇边界。
 *
 * This function will only be set if i18n code runs.
 *
 * 只有在 i18n 代码运行时才会设置此函数。
 *
 */
let _getInsertInFrontOfRNodeWithI18n: (parentTNode: TNode, currentTNode: TNode, lView: LView) =>
    RNode | null = getInsertInFrontOfRNodeWithNoI18n;

/**
 * Tree shakable boundary for `processI18nInsertBefore` function.
 *
 * `processI18nInsertBefore` 函数的树形可摇边界。
 *
 * This function will only be set if i18n code runs.
 *
 * 只有在 i18n 代码运行时才会设置此函数。
 *
 */
let _processI18nInsertBefore: (
    renderer: Renderer, childTNode: TNode, lView: LView, childRNode: RNode|RNode[],
    parentRElement: RElement|null) => void;

export function setI18nHandling(
    getInsertInFrontOfRNodeWithI18n: (parentTNode: TNode, currentTNode: TNode, lView: LView) =>
        RNode | null,
    processI18nInsertBefore: (
        renderer: Renderer, childTNode: TNode, lView: LView, childRNode: RNode|RNode[],
        parentRElement: RElement|null) => void) {
  _getInsertInFrontOfRNodeWithI18n = getInsertInFrontOfRNodeWithI18n;
  _processI18nInsertBefore = processI18nInsertBefore;
}

/**
 * Appends the `child` native node (or a collection of nodes) to the `parent`.
 *
 * 将 `child` 本机节点（或节点集合）附加到 `parent` 。
 *
 * @param tView The \`TView' to be appended
 *
 * 要附加的 \`TView'
 *
 * @param lView The current LView
 *
 * 当前的 LView
 *
 * @param childRNode The native child (or children) that should be appended
 *
 * 应该附加的本机子项（或多个子项）
 *
 * @param childTNode The TNode of the child element
 *
 * 子元素的 TNode
 *
 */
export function appendChild(
    tView: TView, lView: LView, childRNode: RNode|RNode[], childTNode: TNode): void {
  const parentRNode = getParentRElement(tView, childTNode, lView);
  const renderer = lView[RENDERER];
  const parentTNode: TNode = childTNode.parent || lView[T_HOST]!;
  const anchorNode = getInsertInFrontOfRNode(parentTNode, childTNode, lView);
  if (parentRNode != null) {
    if (Array.isArray(childRNode)) {
      for (let i = 0; i < childRNode.length; i++) {
        nativeAppendOrInsertBefore(renderer, parentRNode, childRNode[i], anchorNode, false);
      }
    } else {
      nativeAppendOrInsertBefore(renderer, parentRNode, childRNode, anchorNode, false);
    }
  }

  _processI18nInsertBefore !== undefined &&
      _processI18nInsertBefore(renderer, childTNode, lView, childRNode, parentRNode);
}

/**
 * Returns the first native node for a given LView, starting from the provided TNode.
 *
 * 返回给定 LView 的第一个本机节点，从提供的 TNode 开始。
 *
 * Native nodes are returned in the order in which those appear in the native tree (DOM).
 *
 * 本机节点会按照它们在本机树 (DOM) 中出现的顺序返回。
 *
 */
function getFirstNativeNode(lView: LView, tNode: TNode|null): RNode|null {
  if (tNode !== null) {
    ngDevMode &&
        assertTNodeType(
            tNode,
            TNodeType.AnyRNode | TNodeType.AnyContainer | TNodeType.Icu | TNodeType.Projection);

    const tNodeType = tNode.type;
    if (tNodeType & TNodeType.AnyRNode) {
      return getNativeByTNode(tNode, lView);
    } else if (tNodeType & TNodeType.Container) {
      return getBeforeNodeForView(-1, lView[tNode.index]);
    } else if (tNodeType & TNodeType.ElementContainer) {
      const elIcuContainerChild = tNode.child;
      if (elIcuContainerChild !== null) {
        return getFirstNativeNode(lView, elIcuContainerChild);
      } else {
        const rNodeOrLContainer = lView[tNode.index];
        if (isLContainer(rNodeOrLContainer)) {
          return getBeforeNodeForView(-1, rNodeOrLContainer);
        } else {
          return unwrapRNode(rNodeOrLContainer);
        }
      }
    } else if (tNodeType & TNodeType.Icu) {
      let nextRNode = icuContainerIterate(tNode as TIcuContainerNode, lView);
      let rNode: RNode|null = nextRNode();
      // If the ICU container has no nodes, than we use the ICU anchor as the node.
      return rNode || unwrapRNode(lView[tNode.index]);
    } else {
      const projectionNodes = getProjectionNodes(lView, tNode);
      if (projectionNodes !== null) {
        if (Array.isArray(projectionNodes)) {
          return projectionNodes[0];
        }
        const parentView = getLViewParent(lView[DECLARATION_COMPONENT_VIEW]);
        ngDevMode && assertParentView(parentView);
        return getFirstNativeNode(parentView!, projectionNodes);
      } else {
        return getFirstNativeNode(lView, tNode.next);
      }
    }
  }

  return null;
}

export function getProjectionNodes(lView: LView, tNode: TNode|null): TNode|RNode[]|null {
  if (tNode !== null) {
    const componentView = lView[DECLARATION_COMPONENT_VIEW];
    const componentHost = componentView[T_HOST] as TElementNode;
    const slotIdx = tNode.projection as number;
    ngDevMode && assertProjectionSlots(lView);
    return componentHost.projection![slotIdx];
  }
  return null;
}

export function getBeforeNodeForView(viewIndexInContainer: number, lContainer: LContainer): RNode|
    null {
  const nextViewIndex = CONTAINER_HEADER_OFFSET + viewIndexInContainer + 1;
  if (nextViewIndex < lContainer.length) {
    const lView = lContainer[nextViewIndex] as LView;
    const firstTNodeOfView = lView[TVIEW].firstChild;
    if (firstTNodeOfView !== null) {
      return getFirstNativeNode(lView, firstTNodeOfView);
    }
  }

  return lContainer[NATIVE];
}

/**
 * Removes a native node itself using a given renderer. To remove the node we are looking up its
 * parent from the native tree as not all platforms / browsers support the equivalent of
 * node.remove().
 *
 * 使用给定的渲染器删除本机节点本身。要删除节点，我们会从本机树中查找其父级，因为并非所有平台/浏览器都支持等效的
 * node.remove() 。
 *
 * @param renderer A renderer to be used
 *
 * 要使用的渲染器
 *
 * @param rNode The native node that should be removed
 *
 * 应该删除的本机节点
 *
 * @param isHostElement A flag indicating if a node to be removed is a host of a component.
 *
 * 指示要删除的节点是否是组件的主机的标志。
 *
 */
export function nativeRemoveNode(renderer: Renderer, rNode: RNode, isHostElement?: boolean): void {
  ngDevMode && ngDevMode.rendererRemoveNode++;
  const nativeParent = nativeParentNode(renderer, rNode);
  if (nativeParent) {
    nativeRemoveChild(renderer, nativeParent, rNode, isHostElement);
  }
}


/**
 * Performs the operation of `action` on the node. Typically this involves inserting or removing
 * nodes on the LView or projection boundary.
 *
 * 在节点上执行 `action` 的操作。通常，这涉及在 LView 或投影边界上插入或删除节点。
 *
 */
function applyNodes(
    renderer: Renderer, action: WalkTNodeTreeAction, tNode: TNode|null, lView: LView,
    parentRElement: RElement|null, beforeNode: RNode|null, isProjection: boolean) {
  while (tNode != null) {
    ngDevMode && assertTNodeForLView(tNode, lView);
    ngDevMode &&
        assertTNodeType(
            tNode,
            TNodeType.AnyRNode | TNodeType.AnyContainer | TNodeType.Projection | TNodeType.Icu);
    const rawSlotValue = lView[tNode.index];
    const tNodeType = tNode.type;
    if (isProjection) {
      if (action === WalkTNodeTreeAction.Create) {
        rawSlotValue && attachPatchData(unwrapRNode(rawSlotValue), lView);
        tNode.flags |= TNodeFlags.isProjected;
      }
    }
    if ((tNode.flags & TNodeFlags.isDetached) !== TNodeFlags.isDetached) {
      if (tNodeType & TNodeType.ElementContainer) {
        applyNodes(renderer, action, tNode.child, lView, parentRElement, beforeNode, false);
        applyToElementOrContainer(action, renderer, parentRElement, rawSlotValue, beforeNode);
      } else if (tNodeType & TNodeType.Icu) {
        const nextRNode = icuContainerIterate(tNode as TIcuContainerNode, lView);
        let rNode: RNode|null;
        while (rNode = nextRNode()) {
          applyToElementOrContainer(action, renderer, parentRElement, rNode, beforeNode);
        }
        applyToElementOrContainer(action, renderer, parentRElement, rawSlotValue, beforeNode);
      } else if (tNodeType & TNodeType.Projection) {
        applyProjectionRecursive(
            renderer, action, lView, tNode as TProjectionNode, parentRElement, beforeNode);
      } else {
        ngDevMode && assertTNodeType(tNode, TNodeType.AnyRNode | TNodeType.Container);
        applyToElementOrContainer(action, renderer, parentRElement, rawSlotValue, beforeNode);
      }
    }
    tNode = isProjection ? tNode.projectionNext : tNode.next;
  }
}


/**
 * `applyView` performs operation on the view as specified in `action` (insert, detach, destroy)
 *
 * `applyView` 对 `action` 中指定的视图执行操作（插入、分离、销毁）
 *
 * Inserting a view without projection or containers at top level is simple. Just iterate over the
 * root nodes of the View, and for each node perform the `action`.
 *
 * 在顶级插入没有投影或容器的视图很简单。只需迭代 View 的根节点，并为每个节点执行 `action` 。
 *
 * Things get more complicated with containers and projections. That is because coming across:
 *
 * 使用容器和投影，事情会变得更加复杂。那是因为遇到：
 *
 * - Container: implies that we have to insert/remove/destroy the views of that container as well
 *              which in turn can have their own Containers at the View roots.
 *
 *   容器：意味着我们还必须插入/删除/销毁该容器的视图，它又可以在视图根有自己的容器。
 *
 * - Projection: implies that we have to insert/remove/destroy the nodes of the projection. The
 *               complication is that the nodes we are projecting can themselves have Containers
 *               or other Projections.
 *
 *   投影：意味着我们必须插入/删除/销毁投影的节点。复杂的是，我们要投影的节点本身可以有容器或其他投影。
 *
 * As you can see this is a very recursive problem. Yes recursion is not most efficient but the
 * code is complicated enough that trying to implemented with recursion becomes unmaintainable.
 *
 * 正如你所看到的，这是一个非常递归的问题。是的，递归不是最有效的，但代码足够复杂，以至于尝试使用递归实现变得无法维护。
 *
 * @param tView The \`TView' which needs to be inserted, detached, destroyed
 *
 * 需要插入、分离、销毁的 \`TView'
 *
 * @param lView The LView which needs to be inserted, detached, destroyed.
 *
 * 需要插入、分离、销毁的 LView。
 *
 * @param renderer Renderer to use
 *
 * 要使用的渲染器
 *
 * @param action action to perform (insert, detach, destroy)
 *
 * 要执行的操作（插入、分离、销毁）
 *
 * @param parentRElement parent DOM element for insertion (Removal does not need it).
 *
 * 要插入的父 DOM 元素（删除不需要它）。
 *
 * @param beforeNode Before which node the insertions should happen.
 *
 * 插入应该发生在哪个节点之前。
 *
 */
function applyView(
    tView: TView, lView: LView, renderer: Renderer, action: WalkTNodeTreeAction.Destroy,
    parentRElement: null, beforeNode: null): void;
function applyView(
    tView: TView, lView: LView, renderer: Renderer, action: WalkTNodeTreeAction,
    parentRElement: RElement|null, beforeNode: RNode|null): void;
function applyView(
    tView: TView, lView: LView, renderer: Renderer, action: WalkTNodeTreeAction,
    parentRElement: RElement|null, beforeNode: RNode|null): void {
  applyNodes(renderer, action, tView.firstChild, lView, parentRElement, beforeNode, false);
}

/**
 * `applyProjection` performs operation on the projection.
 *
 * `applyProjection` 对投影执行操作。
 *
 * Inserting a projection requires us to locate the projected nodes from the parent component. The
 * complication is that those nodes themselves could be re-projected from their parent component.
 *
 * 插入投影需要我们从父组件定位投影的节点。复杂的是，这些节点本身可以从它们的父组件重新投影。
 *
 * @param tView The `TView` of `LView` which needs to be inserted, detached, destroyed
 *
 * 需要插入、分离、销毁的 `TView` 的 `LView`
 *
 * @param lView The `LView` which needs to be inserted, detached, destroyed.
 *
 * 需要插入、分离、销毁的 `LView` 。
 *
 * @param tProjectionNode node to project
 *
 * 节点到项目
 *
 */
export function applyProjection(tView: TView, lView: LView, tProjectionNode: TProjectionNode) {
  const renderer = lView[RENDERER];
  const parentRNode = getParentRElement(tView, tProjectionNode, lView);
  const parentTNode = tProjectionNode.parent || lView[T_HOST]!;
  let beforeNode = getInsertInFrontOfRNode(parentTNode, tProjectionNode, lView);
  applyProjectionRecursive(
      renderer, WalkTNodeTreeAction.Create, lView, tProjectionNode, parentRNode, beforeNode);
}

/**
 * `applyProjectionRecursive` performs operation on the projection specified by `action` (insert,
 * detach, destroy)
 *
 * `applyProjectionRecursive` 对 `action` 指定的投影执行操作（插入、分离、销毁）
 *
 * Inserting a projection requires us to locate the projected nodes from the parent component. The
 * complication is that those nodes themselves could be re-projected from their parent component.
 *
 * 插入投影需要我们从父组件定位投影的节点。复杂的是，这些节点本身可以从它们的父组件重新投影。
 *
 * @param renderer Render to use
 *
 * 要使用的渲染方式
 *
 * @param action action to perform (insert, detach, destroy)
 *
 * 要执行的操作（插入、分离、销毁）
 *
 * @param lView The LView which needs to be inserted, detached, destroyed.
 *
 * 需要插入、分离、销毁的 LView。
 *
 * @param tProjectionNode node to project
 *
 * 节点到项目
 *
 * @param parentRElement parent DOM element for insertion/removal.
 *
 * 用于插入/删除的父 DOM 元素。
 *
 * @param beforeNode Before which node the insertions should happen.
 *
 * 插入应该发生在哪个节点之前。
 *
 */
function applyProjectionRecursive(
    renderer: Renderer, action: WalkTNodeTreeAction, lView: LView, tProjectionNode: TProjectionNode,
    parentRElement: RElement|null, beforeNode: RNode|null) {
  const componentLView = lView[DECLARATION_COMPONENT_VIEW];
  const componentNode = componentLView[T_HOST] as TElementNode;
  ngDevMode &&
      assertEqual(typeof tProjectionNode.projection, 'number', 'expecting projection index');
  const nodeToProjectOrRNodes = componentNode.projection![tProjectionNode.projection]!;
  if (Array.isArray(nodeToProjectOrRNodes)) {
    // This should not exist, it is a bit of a hack. When we bootstrap a top level node and we
    // need to support passing projectable nodes, so we cheat and put them in the TNode
    // of the Host TView. (Yes we put instance info at the T Level). We can get away with it
    // because we know that that TView is not shared and therefore it will not be a problem.
    // This should be refactored and cleaned up.
    for (let i = 0; i < nodeToProjectOrRNodes.length; i++) {
      const rNode = nodeToProjectOrRNodes[i];
      applyToElementOrContainer(action, renderer, parentRElement, rNode, beforeNode);
    }
  } else {
    let nodeToProject: TNode|null = nodeToProjectOrRNodes;
    const projectedComponentLView = componentLView[PARENT] as LView;
    applyNodes(
        renderer, action, nodeToProject, projectedComponentLView, parentRElement, beforeNode, true);
  }
}


/**
 * `applyContainer` performs an operation on the container and its views as specified by
 * `action` (insert, detach, destroy)
 *
 * `applyContainer` 对容器及其视图执行操作指定的 `action`（插入、分离、销毁）
 *
 * Inserting a Container is complicated by the fact that the container may have Views which
 * themselves have containers or projections.
 *
 * 插入容器很复杂，因为容器可能有 View ，而 View 本身也有容器或投影。
 *
 * @param renderer Renderer to use
 *
 * 要使用的渲染器
 *
 * @param action action to perform (insert, detach, destroy)
 *
 * 要执行的操作（插入、分离、销毁）
 *
 * @param lContainer The LContainer which needs to be inserted, detached, destroyed.
 *
 * 需要插入、分离、销毁的 LContainer。
 *
 * @param parentRElement parent DOM element for insertion/removal.
 *
 * 用于插入/删除的父 DOM 元素。
 *
 * @param beforeNode Before which node the insertions should happen.
 *
 * 插入应该发生在哪个节点之前。
 *
 */
function applyContainer(
    renderer: Renderer, action: WalkTNodeTreeAction, lContainer: LContainer,
    parentRElement: RElement|null, beforeNode: RNode|null|undefined) {
  ngDevMode && assertLContainer(lContainer);
  const anchor = lContainer[NATIVE];  // LContainer has its own before node.
  const native = unwrapRNode(lContainer);
  // An LContainer can be created dynamically on any node by injecting ViewContainerRef.
  // Asking for a ViewContainerRef on an element will result in a creation of a separate anchor
  // node (comment in the DOM) that will be different from the LContainer's host node. In this
  // particular case we need to execute action on 2 nodes:
  // - container's host node (this is done in the executeActionOnElementOrContainer)
  // - container's host node (this is done here)
  if (anchor !== native) {
    // This is very strange to me (Misko). I would expect that the native is same as anchor. I
    // don't see a reason why they should be different, but they are.
    //
    // If they are we need to process the second anchor as well.
    applyToElementOrContainer(action, renderer, parentRElement, anchor, beforeNode);
  }
  for (let i = CONTAINER_HEADER_OFFSET; i < lContainer.length; i++) {
    const lView = lContainer[i] as LView;
    applyView(lView[TVIEW], lView, renderer, action, parentRElement, anchor);
  }
}

/**
 * Writes class/style to element.
 *
 * 将类/样式写入元素。
 *
 * @param renderer Renderer to use.
 *
 * 要使用的渲染器。
 *
 * @param isClassBased `true` if it should be written to `class` (`false` to write to `style`)
 *
 * 如果应该写入 `class` ，则为 `true`（写入 `style` 为 `false`）
 *
 * @param rNode The Node to write to.
 *
 * 要写入的节点。
 *
 * @param prop Property to write to. This would be the class/style name.
 *
 * 要写入的属性。这将是类/样式名称。
 *
 * @param value Value to write. If `null`/`undefined`/`false` this is considered a remove (set/add
 *        otherwise).
 *
 * 要写入的值。如果 `null` / `undefined` / `false` ，则将其视为删除（否则设置/添加）。
 *
 */
export function applyStyling(
    renderer: Renderer, isClassBased: boolean, rNode: RElement, prop: string, value: any) {
  if (isClassBased) {
    // We actually want JS true/false here because any truthy value should add the class
    if (!value) {
      ngDevMode && ngDevMode.rendererRemoveClass++;
      renderer.removeClass(rNode, prop);
    } else {
      ngDevMode && ngDevMode.rendererAddClass++;
      renderer.addClass(rNode, prop);
    }
  } else {
    let flags = prop.indexOf('-') === -1 ? undefined : RendererStyleFlags2.DashCase as number;
    if (value == null /** || value === undefined */) {
      ngDevMode && ngDevMode.rendererRemoveStyle++;
      renderer.removeStyle(rNode, prop, flags);
    } else {
      // A value is important if it ends with `!important`. The style
      // parser strips any semicolons at the end of the value.
      const isImportant = typeof value === 'string' ? value.endsWith('!important') : false;

      if (isImportant) {
        // !important has to be stripped from the value for it to be valid.
        value = value.slice(0, -10);
        flags! |= RendererStyleFlags2.Important;
      }

      ngDevMode && ngDevMode.rendererSetStyle++;
      renderer.setStyle(rNode, prop, value, flags);
    }
  }
}


/**
 * Write `cssText` to `RElement`.
 *
 * 将 `cssText` 写入 `RElement` 。
 *
 * This function does direct write without any reconciliation. Used for writing initial values, so
 * that static styling values do not pull in the style parser.
 *
 * 此函数会直接写入，无需任何对账。用于编写初始值，以便静态样式值不会拉入风格解析器。
 *
 * @param renderer Renderer to use
 *
 * 要使用的渲染器
 *
 * @param element The element which needs to be updated.
 *
 * 需要更新的元素。
 *
 * @param newValue The new class list to write.
 *
 * 要编写的新类列表。
 *
 */
export function writeDirectStyle(renderer: Renderer, element: RElement, newValue: string) {
  ngDevMode && assertString(newValue, '\'newValue\' should be a string');
  renderer.setAttribute(element, 'style', newValue);
  ngDevMode && ngDevMode.rendererSetStyle++;
}

/**
 * Write `className` to `RElement`.
 *
 * 将 `className` 写入 `RElement` 。
 *
 * This function does direct write without any reconciliation. Used for writing initial values, so
 * that static styling values do not pull in the style parser.
 *
 * 此函数会直接写入，无需任何对账。用于编写初始值，以便静态样式值不会拉入风格解析器。
 *
 * @param renderer Renderer to use
 *
 * 要使用的渲染器
 *
 * @param element The element which needs to be updated.
 *
 * 需要更新的元素。
 *
 * @param newValue The new class list to write.
 *
 * 要编写的新类列表。
 *
 */
export function writeDirectClass(renderer: Renderer, element: RElement, newValue: string) {
  ngDevMode && assertString(newValue, '\'newValue\' should be a string');
  if (newValue === '') {
    // There are tests in `google3` which expect `element.getAttribute('class')` to be `null`.
    renderer.removeAttribute(element, 'class');
  } else {
    renderer.setAttribute(element, 'class', newValue);
  }
  ngDevMode && ngDevMode.rendererSetClassName++;
}

/** Sets up the static DOM attributes on an `RNode`. */
export function setupStaticAttributes(renderer: Renderer, element: RElement, tNode: TNode) {
  const {mergedAttrs, classes, styles} = tNode;

  if (mergedAttrs !== null) {
    setUpAttributes(renderer, element, mergedAttrs);
  }

  if (classes !== null) {
    writeDirectClass(renderer, element, classes);
  }

  if (styles !== null) {
    writeDirectStyle(renderer, element, styles);
  }
}

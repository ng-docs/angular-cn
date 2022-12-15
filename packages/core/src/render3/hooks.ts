/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, DoCheck, OnChanges, OnDestroy, OnInit} from '../interface/lifecycle_hooks';
import {assertDefined, assertEqual, assertNotEqual} from '../util/assert';

import {assertFirstCreatePass} from './assert';
import {NgOnChangesFeatureImpl} from './features/ng_onchanges_feature';
import {DirectiveDef} from './interfaces/definition';
import {TNode} from './interfaces/node';
import {FLAGS, HookData, InitPhaseState, LView, LViewFlags, PREORDER_HOOK_FLAGS, PreOrderHookFlags, TView} from './interfaces/view';
import {profiler, ProfilerEvent} from './profiler';
import {isInCheckNoChangesMode} from './state';



/**
 * Adds all directive lifecycle hooks from the given `DirectiveDef` to the given `TView`.
 *
 * 将给定 `DirectiveDef` 中的所有指令生命周期钩子添加到给定的 `TView` 。
 *
 * Must be run *only* on the first template pass.
 *
 * 必须*仅*在第一个模板传递上运行。
 *
 * Sets up the pre-order hooks on the provided `tView`,
 * see {@link HookData} for details about the data structure.
 *
 * 在提供的 `tView` 上设置预购钩子，有关数据结构的详细信息，请参阅{@link HookData} 。
 *
 * @param directiveIndex The index of the directive in LView
 *
 * LView 中指令的索引
 *
 * @param directiveDef The definition containing the hooks to setup in tView
 *
 * 包含要在 tView 中设置的钩子的定义
 *
 * @param tView The current TView
 *
 * 当前的 TView
 *
 */
export function registerPreOrderHooks(
    directiveIndex: number, directiveDef: DirectiveDef<any>, tView: TView): void {
  ngDevMode && assertFirstCreatePass(tView);
  const {ngOnChanges, ngOnInit, ngDoCheck} =
      directiveDef.type.prototype as OnChanges & OnInit & DoCheck;

  if (ngOnChanges as Function | undefined) {
    const wrappedOnChanges = NgOnChangesFeatureImpl(directiveDef);
    (tView.preOrderHooks || (tView.preOrderHooks = [])).push(directiveIndex, wrappedOnChanges);
    (tView.preOrderCheckHooks || (tView.preOrderCheckHooks = []))
        .push(directiveIndex, wrappedOnChanges);
  }

  if (ngOnInit) {
    (tView.preOrderHooks || (tView.preOrderHooks = [])).push(0 - directiveIndex, ngOnInit);
  }

  if (ngDoCheck) {
    (tView.preOrderHooks || (tView.preOrderHooks = [])).push(directiveIndex, ngDoCheck);
    (tView.preOrderCheckHooks || (tView.preOrderCheckHooks = [])).push(directiveIndex, ngDoCheck);
  }
}

/**
 * Loops through the directives on the provided `tNode` and queues hooks to be
 * run that are not initialization hooks.
 *
 * 循环通过提供的 `tNode` 上的指令，并将要运行的不是初始化钩子的钩子排队。
 *
 * Should be executed during `elementEnd()` and similar to
 * preserve hook execution order. Content, view, and destroy hooks for projected
 * components and directives must be called *before* their hosts.
 *
 * 应该在 `elementEnd()`
 * 期间执行，并且类似于保留钩子执行顺序。投影组件和指令的内容、视图和销毁钩子必须在其宿主*之前*调用。
 *
 * Sets up the content, view, and destroy hooks on the provided `tView`,
 * see {@link HookData} for details about the data structure.
 *
 * 在提供的 `tView` 上设置内容、视图和销毁钩子，有关数据结构的详细信息，请参阅{@link HookData} 。
 *
 * NOTE: This does not set up `onChanges`, `onInit` or `doCheck`, those are set up
 * separately at `elementStart`.
 *
 * 注意：这不会设置 `onChanges`、`onInit` 或 `doCheck` ，它们是在 `elementStart` 处单独设置的。
 *
 * @param tView The current TView
 *
 * 当前的 TView
 *
 * @param tNode The TNode whose directives are to be searched for hooks to queue
 *
 * 要搜索其指令以查找要排队的钩子的 TNode
 *
 */
export function registerPostOrderHooks(tView: TView, tNode: TNode): void {
  ngDevMode && assertFirstCreatePass(tView);
  // It's necessary to loop through the directives at elementEnd() (rather than processing in
  // directiveCreate) so we can preserve the current hook order. Content, view, and destroy
  // hooks for projected components and directives must be called *before* their hosts.
  for (let i = tNode.directiveStart, end = tNode.directiveEnd; i < end; i++) {
    const directiveDef = tView.data[i] as DirectiveDef<any>;
    ngDevMode && assertDefined(directiveDef, 'Expecting DirectiveDef');
    const lifecycleHooks: AfterContentInit&AfterContentChecked&AfterViewInit&AfterViewChecked&
        OnDestroy = directiveDef.type.prototype;
    const {
      ngAfterContentInit,
      ngAfterContentChecked,
      ngAfterViewInit,
      ngAfterViewChecked,
      ngOnDestroy
    } = lifecycleHooks;

    if (ngAfterContentInit) {
      (tView.contentHooks || (tView.contentHooks = [])).push(-i, ngAfterContentInit);
    }

    if (ngAfterContentChecked) {
      (tView.contentHooks || (tView.contentHooks = [])).push(i, ngAfterContentChecked);
      (tView.contentCheckHooks || (tView.contentCheckHooks = [])).push(i, ngAfterContentChecked);
    }

    if (ngAfterViewInit) {
      (tView.viewHooks || (tView.viewHooks = [])).push(-i, ngAfterViewInit);
    }

    if (ngAfterViewChecked) {
      (tView.viewHooks || (tView.viewHooks = [])).push(i, ngAfterViewChecked);
      (tView.viewCheckHooks || (tView.viewCheckHooks = [])).push(i, ngAfterViewChecked);
    }

    if (ngOnDestroy != null) {
      (tView.destroyHooks || (tView.destroyHooks = [])).push(i, ngOnDestroy);
    }
  }
}

/**
 * Executing hooks requires complex logic as we need to deal with 2 constraints.
 *
 * 执行钩子需要复杂的逻辑，因为我们需要处理 2 个约束。
 *
 * 1. Init hooks (ngOnInit, ngAfterContentInit, ngAfterViewInit) must all be executed once and only
 *       once, across many change detection cycles. This must be true even if some hooks throw, or
 * if some recursively trigger a change detection cycle. To solve that, it is required to track the
 * state of the execution of these init hooks. This is done by storing and maintaining flags in the
 * view: the {@link InitPhaseState}, and the index within that phase. They can be seen as a cursor
 * in the following structure:
 *       \[[onInit1, onInit2], [afterContentInit1], [afterViewInit1, afterViewInit2,
 * afterViewInit3]] They are are stored as flags in LView[FLAGS].
 *
 *    初始化钩子（ngOnInit、ngAfterContentInit、ngAfterViewInit
 *    ）都必须在许多变更检测周期中执行一次，并且只能执行一次。即使某些钩子抛出，或者某些递归触发变更检测周期，也必须是真的。为了解决这个问题，需要跟踪这些初始化钩子的执行状态。这是通过在视图中存储和维护标志来完成的： {@link
 * InitPhaseState} 和该阶段中的索引。它们可以被视为以下结构中的游标： \[ [onInit1, onInit2][onInit1,
 * onInit2] , [afterContentInit1][afterContentInit1] , [afterViewInit1, afterViewInit2,
 * afterViewInit3][afterViewInit1, afterViewInit2, afterViewInit3] ]它们作为标志存储在 LView
 * [FLAGS][FLAGS]中。
 *
 * 2. Pre-order hooks can be executed in batches, because of the select instruction.
 *       To be able to pause and resume their execution, we also need some state about the hook's
 * array that is being processed:
 *
 *    由于 select
 *    指令，预购钩子可以分批执行。为了能够暂停和恢复它们的执行，我们还需要正在处理的钩子数组的一些状态：
 *
 * - the index of the next hook to be executed
 *
 *   下一个要执行的钩子的索引
 *
 * - the number of init hooks already found in the processed part of the  array
 *     They are are stored as flags in LView[PREORDER_HOOK_FLAGS].
 *
 *   在数组的已处理部分中已经找到的初始化钩子的数量它们作为标志存储在 LView
 *   [PREORDER_HOOK_FLAGS][PREORDER_HOOK_FLAGS]中。
 *
 */


/**
 * Executes pre-order check hooks ( OnChanges, DoChanges) given a view where all the init hooks were
 * executed once. This is a light version of executeInitAndCheckPreOrderHooks where we can skip read
 * / write of the init-hooks related flags.
 *
 * 在给定所有初始化钩子都执行一次的视图的情况下，执行预购检查钩子（OnChanges、DoChanges）。这是
 * executeInitAndCheckPreOrderHooks 的轻型版本，我们可以在其中跳过与 init-hooks 相关的标志的读/写。
 *
 * @param lView The LView where hooks are defined
 *
 * 定义钩子的 LView
 *
 * @param hooks Hooks to be run
 *
 * 要运行的挂钩
 *
 * @param nodeIndex 3 cases depending on the value:
 *
 * 3 种情况，取决于值：
 *
 * - undefined: all hooks from the array should be executed (post-order case)
 *
 *   未定义：应该执行数组中的所有钩子（后序案例）
 *
 * - null: execute hooks only from the saved index until the end of the array (pre-order case, when
 *   flushing the remaining hooks)
 *
 *   null ：仅从保存的索引到数组末尾执行钩子（预购情况，刷新其余钩子时）
 *
 * - number: execute hooks only from the saved index until that node index exclusive (pre-order
 *   case, when executing select(number))
 *
 *   number ：仅从保存的索引执行钩子，直到该节点索引排他（预购情况，执行 select(number) 时）
 *
 */
export function executeCheckHooks(lView: LView, hooks: HookData, nodeIndex?: number|null) {
  callHooks(lView, hooks, InitPhaseState.InitPhaseCompleted, nodeIndex);
}

/**
 * Executes post-order init and check hooks (one of AfterContentInit, AfterContentChecked,
 * AfterViewInit, AfterViewChecked) given a view where there are pending init hooks to be executed.
 *
 * 给定一个视图，其中有要执行的挂起的 init 钩子，执行后序初始化和检查钩子（
 * AfterContentInit、AfterContentChecked、AfterViewInit、AfterViewChecked 之一）。
 *
 * @param lView The LView where hooks are defined
 *
 * 定义钩子的 LView
 *
 * @param hooks Hooks to be run
 *
 * 要运行的挂钩
 *
 * @param initPhase A phase for which hooks should be run
 *
 * 应该运行钩子的阶段
 *
 * @param nodeIndex 3 cases depending on the value:
 *
 * 3 种情况，取决于值：
 *
 * - undefined: all hooks from the array should be executed (post-order case)
 *
 *   未定义：应该执行数组中的所有钩子（后序案例）
 *
 * - null: execute hooks only from the saved index until the end of the array (pre-order case, when
 *   flushing the remaining hooks)
 *
 *   null ：仅从保存的索引到数组末尾执行钩子（预购情况，刷新其余钩子时）
 *
 * - number: execute hooks only from the saved index until that node index exclusive (pre-order
 *   case, when executing select(number))
 *
 *   number ：仅从保存的索引执行钩子，直到该节点索引排他（预购情况，执行 select(number) 时）
 *
 */
export function executeInitAndCheckHooks(
    lView: LView, hooks: HookData, initPhase: InitPhaseState, nodeIndex?: number|null) {
  ngDevMode &&
      assertNotEqual(
          initPhase, InitPhaseState.InitPhaseCompleted,
          'Init pre-order hooks should not be called more than once');
  if ((lView[FLAGS] & LViewFlags.InitPhaseStateMask) === initPhase) {
    callHooks(lView, hooks, initPhase, nodeIndex);
  }
}

export function incrementInitPhaseFlags(lView: LView, initPhase: InitPhaseState): void {
  ngDevMode &&
      assertNotEqual(
          initPhase, InitPhaseState.InitPhaseCompleted,
          'Init hooks phase should not be incremented after all init hooks have been run.');
  let flags = lView[FLAGS];
  if ((flags & LViewFlags.InitPhaseStateMask) === initPhase) {
    flags &= LViewFlags.IndexWithinInitPhaseReset;
    flags += LViewFlags.InitPhaseStateIncrementer;
    lView[FLAGS] = flags;
  }
}

/**
 * Calls lifecycle hooks with their contexts, skipping init hooks if it's not
 * the first LView pass
 *
 * 使用它们的上下文调用生命周期钩子，如果不是第一个 LView 传递，则跳过初始化钩子
 *
 * @param currentView The current view
 *
 * 当前视图
 *
 * @param arr The array in which the hooks are found
 *
 * 在其中找到钩子的数组
 *
 * @param initPhaseState the current state of the init phase
 *
 * 初始化阶段的当前状态
 *
 * @param currentNodeIndex 3 cases depending on the value:
 *
 * 3 种情况，取决于值：
 *
 * - undefined: all hooks from the array should be executed (post-order case)
 *
 *   未定义：应该执行数组中的所有钩子（后序案例）
 *
 * - null: execute hooks only from the saved index until the end of the array (pre-order case, when
 *   flushing the remaining hooks)
 *
 *   null ：仅从保存的索引到数组末尾执行钩子（预购情况，刷新其余钩子时）
 *
 * - number: execute hooks only from the saved index until that node index exclusive (pre-order
 *   case, when executing select(number))
 *
 *   number ：仅从保存的索引执行钩子，直到该节点索引不包括在内（预购情况，执行 select(number) 时）
 *
 */
function callHooks(
    currentView: LView, arr: HookData, initPhase: InitPhaseState,
    currentNodeIndex: number|null|undefined): void {
  ngDevMode &&
      assertEqual(
          isInCheckNoChangesMode(), false,
          'Hooks should never be run when in check no changes mode.');
  const startIndex = currentNodeIndex !== undefined ?
      (currentView[PREORDER_HOOK_FLAGS] & PreOrderHookFlags.IndexOfTheNextPreOrderHookMaskMask) :
      0;
  const nodeIndexLimit = currentNodeIndex != null ? currentNodeIndex : -1;
  const max = arr.length - 1;  // Stop the loop at length - 1, because we look for the hook at i + 1
  let lastNodeIndexFound = 0;
  for (let i = startIndex; i < max; i++) {
    const hook = arr[i + 1] as number | (() => void);
    if (typeof hook === 'number') {
      lastNodeIndexFound = arr[i] as number;
      if (currentNodeIndex != null && lastNodeIndexFound >= currentNodeIndex) {
        break;
      }
    } else {
      const isInitHook = arr[i] < 0;
      if (isInitHook)
        currentView[PREORDER_HOOK_FLAGS] += PreOrderHookFlags.NumberOfInitHooksCalledIncrementer;
      if (lastNodeIndexFound < nodeIndexLimit || nodeIndexLimit == -1) {
        callHook(currentView, initPhase, arr, i);
        currentView[PREORDER_HOOK_FLAGS] =
            (currentView[PREORDER_HOOK_FLAGS] & PreOrderHookFlags.NumberOfInitHooksCalledMask) + i +
            2;
      }
      i++;
    }
  }
}

/**
 * Execute one hook against the current `LView`.
 *
 * 对当前的 `LView` 执行一个钩子。
 *
 * @param currentView The current view
 *
 * 当前视图
 *
 * @param initPhaseState the current state of the init phase
 *
 * 初始化阶段的当前状态
 *
 * @param arr The array in which the hooks are found
 *
 * 在其中找到钩子的数组
 *
 * @param i The current index within the hook data array
 *
 * 钩子数据数组中的当前索引
 *
 */
function callHook(currentView: LView, initPhase: InitPhaseState, arr: HookData, i: number) {
  const isInitHook = arr[i] < 0;
  const hook = arr[i + 1] as () => void;
  const directiveIndex = isInitHook ? -arr[i] : arr[i] as number;
  const directive = currentView[directiveIndex];
  if (isInitHook) {
    const indexWithintInitPhase = currentView[FLAGS] >> LViewFlags.IndexWithinInitPhaseShift;
    // The init phase state must be always checked here as it may have been recursively updated.
    if (indexWithintInitPhase <
            (currentView[PREORDER_HOOK_FLAGS] >> PreOrderHookFlags.NumberOfInitHooksCalledShift) &&
        (currentView[FLAGS] & LViewFlags.InitPhaseStateMask) === initPhase) {
      currentView[FLAGS] += LViewFlags.IndexWithinInitPhaseIncrementer;
      profiler(ProfilerEvent.LifecycleHookStart, directive, hook);
      try {
        hook.call(directive);
      } finally {
        profiler(ProfilerEvent.LifecycleHookEnd, directive, hook);
      }
    }
  } else {
    profiler(ProfilerEvent.LifecycleHookStart, directive, hook);
    try {
      hook.call(directive);
    } finally {
      profiler(ProfilerEvent.LifecycleHookEnd, directive, hook);
    }
  }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ChangeDetectorRef as viewEngine_ChangeDetectorRef} from '../change_detection/change_detector_ref';
import {RuntimeError, RuntimeErrorCode} from '../errors';
import {EmbeddedViewRef as viewEngine_EmbeddedViewRef, InternalViewRef as viewEngine_InternalViewRef, ViewRefTracker} from '../linker/view_ref';
import {removeFromArray} from '../util/array_utils';
import {assertEqual} from '../util/assert';

import {collectNativeNodes} from './collect_native_nodes';
import {checkNoChangesInternal, detectChangesInternal, markViewDirty, storeCleanupWithContext} from './instructions/shared';
import {CONTAINER_HEADER_OFFSET, VIEW_REFS} from './interfaces/container';
import {isLContainer} from './interfaces/type_checks';
import {CONTEXT, FLAGS, LView, LViewFlags, PARENT, TVIEW} from './interfaces/view';
import {destroyLView, detachView, renderDetachView} from './node_manipulation';



// Needed due to tsickle downleveling where multiple `implements` with classes creates
// multiple @extends in Closure annotations, which is illegal. This workaround fixes
// the multiple @extends by making the annotation @implements instead
export interface viewEngine_ChangeDetectorRef_interface extends viewEngine_ChangeDetectorRef {}

export class ViewRef<T> implements viewEngine_EmbeddedViewRef<T>, viewEngine_InternalViewRef,
                                   viewEngine_ChangeDetectorRef_interface {
  private _appRef: ViewRefTracker|null = null;
  private _attachedToViewContainer = false;

  get rootNodes(): any[] {
    const lView = this._lView;
    const tView = lView[TVIEW];
    return collectNativeNodes(tView, lView, tView.firstChild, []);
  }

  constructor(
      /**
       * This represents `LView` associated with the component when ViewRef is a ChangeDetectorRef.
       *
       * When ViewRef is created for a dynamic component, this also represents the `LView` for the
       * component.
       *
       * For a "regular" ViewRef created for an embedded view, this is the `LView` for the embedded
       * view.
       *
       * @internal
       */
      public _lView: LView,

      /**
       * This represents the `LView` associated with the point where `ChangeDetectorRef` was
       * requested.
       *
       * This may be different from `_lView` if the `_cdRefInjectingView` is an embedded view.
       */
      private _cdRefInjectingView?: LView) {}

  get context(): T {
    return this._lView[CONTEXT] as unknown as T;
  }

  set context(value: T) {
    this._lView[CONTEXT] = value as unknown as {};
  }

  get destroyed(): boolean {
    return (this._lView[FLAGS] & LViewFlags.Destroyed) === LViewFlags.Destroyed;
  }

  destroy(): void {
    if (this._appRef) {
      this._appRef.detachView(this);
    } else if (this._attachedToViewContainer) {
      const parent = this._lView[PARENT];
      if (isLContainer(parent)) {
        const viewRefs = parent[VIEW_REFS] as ViewRef<unknown>[] | null;
        const index = viewRefs ? viewRefs.indexOf(this) : -1;
        if (index > -1) {
          ngDevMode &&
              assertEqual(
                  index, parent.indexOf(this._lView) - CONTAINER_HEADER_OFFSET,
                  'An attached view should be in the same position within its container as its ViewRef in the VIEW_REFS array.');
          detachView(parent, index);
          removeFromArray(viewRefs!, index);
        }
      }
      this._attachedToViewContainer = false;
    }
    destroyLView(this._lView[TVIEW], this._lView);
  }

  onDestroy(callback: Function) {
    storeCleanupWithContext(this._lView[TVIEW], this._lView, null, callback);
  }

  /**
   * Marks a view and all of its ancestors dirty.
   *
   * 将视图及其所有祖先标记为脏。
   *
   * This can be used to ensure an {@link ChangeDetectionStrategy#OnPush OnPush} component is
   * checked when it needs to be re-rendered but the two normal triggers haven't marked it
   * dirty (i.e. inputs haven't changed and events haven't fired in the view).
   *
   * 这可用于确保在需要重新渲染但两个普通触发器尚未将其标记为脏（即输入没有更改并且事件没有触发）时检查 {@link
   * ChangeDetectionStrategy#OnPush OnPush} 组件在视图中）。
   *
   * <!-- TODO: Add a link to a chapter on OnPush components -->
   *
   * @usageNotes
   *
   * ### Example
   *
   * ### 例子
   *
   * ```typescript
   * @Component({
   *   selector: 'app-root',
   *   template: `Number of ticks: {{numberOfTicks}}`
   *   changeDetection: ChangeDetectionStrategy.OnPush,
   * })
   * class AppComponent {
   *   numberOfTicks = 0;
   *
   *   constructor(private ref: ChangeDetectorRef) {
   *     setInterval(() => {
   *       this.numberOfTicks++;
   *       // the following is required, otherwise the view will not be updated
   *       this.ref.markForCheck();
   *     }, 1000);
   *   }
   * }
   * ```
   */
  markForCheck(): void {
    markViewDirty(this._cdRefInjectingView || this._lView);
  }

  /**
   * Detaches the view from the change detection tree.
   *
   * 将视图从变更检测树中分离。
   *
   * Detached views will not be checked during change detection runs until they are
   * re-attached, even if they are dirty. `detach` can be used in combination with
   * {@link ChangeDetectorRef#detectChanges detectChanges} to implement local change
   * detection checks.
   *
   * 在重新连接之前，在变更检测运行期间不会检查分离的视图，即使它们是脏的。 `detach` 可以与 {@link
   * ChangeDetectorRef#detectChangesdetectChanges} 结合使用来实现本地变更检测检查。
   *
   * <!-- TODO: Add a link to a chapter on detach/reattach/local digest -->
   *
   * <!-- TODO: Add a live demo once ref.detectChanges is merged into master -->
   *
   * @usageNotes
   *
   * ### Example
   *
   * ### 例子
   *
   * The following example defines a component with a large list of readonly data.
   * Imagine the data changes constantly, many times per second. For performance reasons,
   * we want to check and update the list every five seconds. We can do that by detaching
   * the component's change detector and doing a local check every five seconds.
   *
   * 以下示例定义了一个具有大量只读数据列表的组件。想象一下数据不断变化，每秒很多次。出于性能原因，我们希望每五秒检查并更新一次列表。我们可以通过分离组件的变更检测器并每五秒进行一次本地检查来实现。
   *
   * ```typescript
   * class DataProvider {
   *   // in a real application the returned data will be different every time
   *   get data() {
   *     return [1,2,3,4,5];
   *   }
   * }
   *
   * @Component({
   *   selector: 'giant-list',
   *   template: `
   *     <li *ngFor="let d of dataProvider.data">Data {{d}}</li>
   *   `,
   * })
   * class GiantList {
   *   constructor(private ref: ChangeDetectorRef, private dataProvider: DataProvider) {
   *     ref.detach();
   *     setInterval(() => {
   *       this.ref.detectChanges();
   *     }, 5000);
   *   }
   * }
   *
   * @Component({
   *   selector: 'app',
   *   providers: [DataProvider],
   *   template: `
   *     <giant-list><giant-list>
   *   `,
   * })
   * class App {
   * }
   * ```
   */
  detach(): void {
    this._lView[FLAGS] &= ~LViewFlags.Attached;
  }

  /**
   * Re-attaches a view to the change detection tree.
   *
   * 将视图重新附加到变更检测树。
   *
   * This can be used to re-attach views that were previously detached from the tree
   * using {@link ChangeDetectorRef#detach detach}. Views are attached to the tree by default.
   *
   * 这可用于重新附加以前使用 {@link ChangeDetectorRef#detach detach}
   * 从树中分离的视图。默认情况下，视图附加到树。
   *
   * <!-- TODO: Add a link to a chapter on detach/reattach/local digest -->
   *
   * @usageNotes
   *
   * ### Example
   *
   * ### 例子
   *
   * The following example creates a component displaying `live` data. The component will detach
   * its change detector from the main change detector tree when the component's live property
   * is set to false.
   *
   * 以下示例创建一个显示 `live` 数据的组件。当组件的 live 属性设置为 false
   * 时，组件将其变更检测器与主变更检测器树分离。
   *
   * ```typescript
   * class DataProvider {
   *   data = 1;
   *
   *   constructor() {
   *     setInterval(() => {
   *       this.data = this.data * 2;
   *     }, 500);
   *   }
   * }
   *
   * @Component({
   *   selector: 'live-data',
   *   inputs: ['live'],
   *   template: 'Data: {{dataProvider.data}}'
   * })
   * class LiveData {
   *   constructor(private ref: ChangeDetectorRef, private dataProvider: DataProvider) {}
   *
   *   set live(value) {
   *     if (value) {
   *       this.ref.reattach();
   *     } else {
   *       this.ref.detach();
   *     }
   *   }
   * }
   *
   * @Component({
   *   selector: 'app-root',
   *   providers: [DataProvider],
   *   template: `
   *     Live Update: <input type="checkbox" [(ngModel)]="live">
   *     <live-data [live]="live"><live-data>
   *   `,
   * })
   * class AppComponent {
   *   live = true;
   * }
   * ```
   */
  reattach(): void {
    this._lView[FLAGS] |= LViewFlags.Attached;
  }

  /**
   * Checks the view and its children.
   *
   * 检查视图及其子项。
   *
   * This can also be used in combination with {@link ChangeDetectorRef#detach detach} to implement
   * local change detection checks.
   *
   * 这也可以与 {@link ChangeDetectorRef#detach detach} 结合使用来实现本地变更检测检查。
   *
   * <!-- TODO: Add a link to a chapter on detach/reattach/local digest -->
   *
   * <!-- TODO: Add a live demo once ref.detectChanges is merged into master -->
   *
   * @usageNotes
   *
   * ### Example
   *
   * ### 例子
   *
   * The following example defines a component with a large list of readonly data.
   * Imagine, the data changes constantly, many times per second. For performance reasons,
   * we want to check and update the list every five seconds.
   *
   * 以下示例定义了一个具有大量只读数据列表的组件。想象一下，数据会不断变化，每秒很多次。出于性能原因，我们希望每五秒检查并更新一次列表。
   *
   * We can do that by detaching the component's change detector and doing a local change detection
   * check every five seconds.
   *
   * 我们可以通过分离组件的变更检测器并每五秒进行一次本地变更检测检查来实现。
   *
   * See {@link ChangeDetectorRef#detach detach} for more information.
   *
   * 有关更多信息，请参阅 {@link ChangeDetectorRef#detach detach} 。
   *
   */
  detectChanges(): void {
    detectChangesInternal(this._lView[TVIEW], this._lView, this.context as unknown as {});
  }

  /**
   * Checks the change detector and its children, and throws if any changes are detected.
   *
   * 检查变更检测器及其子项，如果检测到任何更改，则抛出。
   *
   * This is used in development mode to verify that running change detection doesn't
   * introduce other changes.
   *
   * 这在开发模式下用于验证正在运行的变更检测不会引入其他更改。
   *
   */
  checkNoChanges(): void {
    if (ngDevMode) {
      checkNoChangesInternal(this._lView[TVIEW], this._lView, this.context as unknown as {});
    }
  }

  attachToViewContainerRef() {
    if (this._appRef) {
      throw new RuntimeError(
          RuntimeErrorCode.VIEW_ALREADY_ATTACHED,
          ngDevMode && 'This view is already attached directly to the ApplicationRef!');
    }
    this._attachedToViewContainer = true;
  }

  detachFromAppRef() {
    this._appRef = null;
    renderDetachView(this._lView[TVIEW], this._lView);
  }

  attachToAppRef(appRef: ViewRefTracker) {
    if (this._attachedToViewContainer) {
      throw new RuntimeError(
          RuntimeErrorCode.VIEW_ALREADY_ATTACHED,
          ngDevMode && 'This view is already attached to a ViewContainer!');
    }
    this._appRef = appRef;
  }
}

/** @internal */
export class RootViewRef<T> extends ViewRef<T> {
  constructor(public _view: LView) {
    super(_view);
  }

  override detectChanges(): void {
    const lView = this._view;
    const tView = lView[TVIEW];
    const context = lView[CONTEXT];
    detectChangesInternal(tView, lView, context, false);
  }

  override checkNoChanges(): void {
    if (ngDevMode) {
      const lView = this._view;
      const tView = lView[TVIEW];
      const context = lView[CONTEXT];
      checkNoChangesInternal(tView, lView, context, false);
    }
  }

  override get context(): T {
    return null!;
  }
}

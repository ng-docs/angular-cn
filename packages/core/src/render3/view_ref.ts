/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ViewContainerRef as viewEngine_ViewContainerRef} from '../linker/view_container_ref';
import {EmbeddedViewRef as viewEngine_EmbeddedViewRef} from '../linker/view_ref';

import {checkNoChanges, detectChanges, markViewDirty, storeCleanupFn} from './instructions';
import {ComponentTemplate} from './interfaces/definition';
import {LViewNode} from './interfaces/node';
import {LView, LViewFlags} from './interfaces/view';
import {destroyLView} from './node_manipulation';

export class ViewRef<T> implements viewEngine_EmbeddedViewRef<T> {
  context: T;
  rootNodes: any[];

  constructor(protected _view: LView, context: T|null) { this.context = context !; }

  /** @internal */
  _setComponentContext(view: LView, context: T) {
    this._view = view;
    this.context = context;
  }

  get destroyed(): boolean {
    return (this._view.flags & LViewFlags.Destroyed) === LViewFlags.Destroyed;
  }

  destroy(): void { destroyLView(this._view); }

  onDestroy(callback: Function) { storeCleanupFn(this._view, callback); }

  /**
   * Marks a view and all of its ancestors dirty.
   *
   * It also triggers change detection by calling `scheduleTick` internally, which coalesces
   * multiple `markForCheck` calls to into one change detection run.
   *
   * This can be used to ensure an {@link ChangeDetectionStrategy#OnPush OnPush} component is
   * checked when it needs to be re-rendered but the two normal triggers haven't marked it
   * dirty (i.e. inputs haven't changed and events haven't fired in the view).
   *
   * <!-- TODO: Add a link to a chapter on OnPush components -->
   *
   * ### Example ([live demo](https://stackblitz.com/edit/angular-kx7rrw))
   *
   * ```typescript
   * @Component({
   *   selector: 'my-app',
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
  markForCheck(): void { markViewDirty(this._view); }

  /**
   * Detaches the view from the change detection tree.
   *
   * Detached views will not be checked during change detection runs until they are
   * re-attached, even if they are dirty. `detach` can be used in combination with
   * {@link ChangeDetectorRef#detectChanges detectChanges} to implement local change
   * detection checks.
   *
   * <!-- TODO: Add a link to a chapter on detach/reattach/local digest -->
   * <!-- TODO: Add a live demo once ref.detectChanges is merged into master -->
   *
   * ### Example
   *
   * The following example defines a component with a large list of readonly data.
   * Imagine the data changes constantly, many times per second. For performance reasons,
   * we want to check and update the list every five seconds. We can do that by detaching
   * the component's change detector and doing a local check every five seconds.
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
  detach(): void { this._view.flags &= ~LViewFlags.Attached; }

  /**
   * Re-attaches a view to the change detection tree.
   *
   * This can be used to re-attach views that were previously detached from the tree
   * using {@link ChangeDetectorRef#detach detach}. Views are attached to the tree by default.
   *
   * <!-- TODO: Add a link to a chapter on detach/reattach/local digest -->
   *
   * ### Example ([live demo](https://stackblitz.com/edit/angular-ymgsxw))
   *
   * The following example creates a component displaying `live` data. The component will detach
   * its change detector from the main change detector tree when the component's live property
   * is set to false.
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
   *   selector: 'my-app',
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
  reattach(): void { this._view.flags |= LViewFlags.Attached; }

  /**
   * Checks the view and its children.
   *
   * This can also be used in combination with {@link ChangeDetectorRef#detach detach} to implement
   * local change detection checks.
   *
   * <!-- TODO: Add a link to a chapter on detach/reattach/local digest -->
   * <!-- TODO: Add a live demo once ref.detectChanges is merged into master -->
   *
   * ### Example
   *
   * The following example defines a component with a large list of readonly data.
   * Imagine, the data changes constantly, many times per second. For performance reasons,
   * we want to check and update the list every five seconds.
   *
   * We can do that by detaching the component's change detector and doing a local change detection
   * check every five seconds.
   *
   * See {@link ChangeDetectorRef#detach detach} for more information.
   */
  detectChanges(): void { detectChanges(this.context); }

  /**
   * Checks the change detector and its children, and throws if any changes are detected.
   *
   * This is used in development mode to verify that running change detection doesn't
   * introduce other changes.
   */
  checkNoChanges(): void { checkNoChanges(this.context); }
}


export class EmbeddedViewRef<T> extends ViewRef<T> {
  /**
   * @internal
   */
  _lViewNode: LViewNode;
  private _viewContainerRef: viewEngine_ViewContainerRef|null = null;

  constructor(viewNode: LViewNode, template: ComponentTemplate<T>, context: T) {
    super(viewNode.data, context);
    this._lViewNode = viewNode;
  }

  destroy(): void {
    if (this._viewContainerRef &&
        (this._view.flags & LViewFlags.Attached) === LViewFlags.Attached) {
      this._viewContainerRef.detach(this._viewContainerRef.indexOf(this));
      this._viewContainerRef = null;
    }
    super.destroy();
  }

  attachToViewContainerRef(vcRef: viewEngine_ViewContainerRef) { this._viewContainerRef = vcRef; }
}

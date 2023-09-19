/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ChangeDetectorRef, ComponentRef, Directive, EnvironmentInjector, EventEmitter, inject, Injectable, InjectionToken, Injector, Input, OnDestroy, OnInit, Output, reflectComponentType, SimpleChanges, ViewContainerRef, ɵRuntimeError as RuntimeError,} from '@angular/core';
import {combineLatest, of, Subscription} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {RuntimeErrorCode} from '../errors';
import {Data} from '../models';
import {ChildrenOutletContexts} from '../router_outlet_context';
import {ActivatedRoute} from '../router_state';
import {PRIMARY_OUTLET} from '../shared';


/**
 * An interface that defines the contract for developing a component outlet for the `Router`.
 *
 * 一个接口，定义了为 `Router` 开发组件出口的契约。
 *
 * An outlet acts as a placeholder that Angular dynamically fills based on the current router state.
 *
 * 出口充当占位符，Angular 会根据当前的路由器状态动态填充。
 *
 * A router outlet should register itself with the `Router` via
 * `ChildrenOutletContexts#onChildOutletCreated` and unregister with
 * `ChildrenOutletContexts#onChildOutletDestroyed`. When the `Router` identifies a matched `Route`,
 * it looks for a registered outlet in the `ChildrenOutletContexts` and activates it.
 *
 * 路由器出口应该通过 ChildrenOutletContexts#onChildOutletCreated 向 `Router` 注册自己，并通过 `ChildrenOutletContexts#onChildOutletCreated` `ChildrenOutletContexts#onChildOutletDestroyed` 注册。当 `Router` 识别到匹配的 `Route` 时，它会在 `ChildrenOutletContexts` 中查找注册的插座并激活它。
 *
 * @see `ChildrenOutletContexts`
 * @publicApi
 */
export interface RouterOutletContract {
  /**
   * Whether the given outlet is activated.
   *
   * 给定的插座是否已激活。
   *
   * An outlet is considered "activated" if it has an active component.
   *
   * 如果插座有活动组件，则认为它是“激活的”。
   *
   */
  isActivated: boolean;

  /**
   * The instance of the activated component or `null` if the outlet is not activated.
   *
   * 已激活组件的实例；如果未激活插座，则为 `null`。
   *
   */
  component: Object|null;

  /**
   * The `Data` of the `ActivatedRoute` snapshot.
   *
   * `ActivatedRoute` 快照的 `Data`。
   *
   */
  activatedRouteData: Data;

  /**
   * The `ActivatedRoute` for the outlet or `null` if the outlet is not activated.
   *
   * 插座的 `ActivatedRoute`，如果此插座未激活，则为 `null`。
   *
   */
  activatedRoute: ActivatedRoute|null;

  /**
   * Called by the `Router` when the outlet should activate \(create a component\).
   *
   * 在插座应该激活（创建组件）时由 `Router` 调用。
   *
   */
  activateWith(activatedRoute: ActivatedRoute, environmentInjector: EnvironmentInjector|null): void;

  /**
   * A request to destroy the currently activated component.
   *
   * 销毁当前激活的组件的请求。
   *
   * When a `RouteReuseStrategy` indicates that an `ActivatedRoute` should be removed but stored for
   * later re-use rather than destroyed, the `Router` will call `detach` instead.
   *
   * 当 `RouteReuseStrategy` 表明应该删除 `ActivatedRoute` 但存储以供以后重用而不是销毁时，`Router` 将改为调用 `detach`。
   *
   */
  deactivate(): void;

  /**
   * Called when the `RouteReuseStrategy` instructs to detach the subtree.
   *
   * 受 `RouteReuseStrategy` 的指示，从子树中分离开时调用。
   *
   * This is similar to `deactivate`, but the activated component should _not_ be destroyed.
   * Instead, it is returned so that it can be reattached later via the `attach` method.
   *
   * 这类似于 `deactivate`，但激活的组件 _ 不应 _ 被销毁。相反，它会被返回，以便稍后可以通过 `attach` 方法重新附加它。
   *
   */
  detach(): ComponentRef<unknown>;

  /**
   * Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree.
   *
   * `RouteReuseStrategy` 的指示，把以前分离的子树重新附加回来时调用。
   *
   */
  attach(ref: ComponentRef<unknown>, activatedRoute: ActivatedRoute): void;

  /**
   * Emits an activate event when a new component is instantiated
   *
   * 实例化新组件时发出 activate 事件
   *
   */
  activateEvents?: EventEmitter<unknown>;

  /**
   * Emits a deactivate event when a component is destroyed.
   *
   * 当组件被销毁时发出 deactivate 事件。
   *
   */
  deactivateEvents?: EventEmitter<unknown>;

  /**
   * Emits an attached component instance when the `RouteReuseStrategy` instructs to re-attach a
   * previously detached subtree.
   *
   * 当 `RouteReuseStrategy` 指示重新附加以前分离的子树时，发出一个附加的组件实例。
   *
   */
  attachEvents?: EventEmitter<unknown>;

  /**
   * Emits a detached component instance when the `RouteReuseStrategy` instructs to detach the
   * subtree.
   *
   * 当 `RouteReuseStrategy` 指示分离子树时发出一个分离的组件实例。
   *
   */
  detachEvents?: EventEmitter<unknown>;

  /**
   * Used to indicate that the outlet is able to bind data from the `Router` to the outlet
   * component's inputs.
   *
   * 用于指示出口能够将数据从 `Router` 绑定到出口组件的输入。
   *
   * When this is `undefined` or `false` and the developer has opted in to the
   * feature using `withComponentInputBinding`, a warning will be logged in dev mode if this outlet
   * is used in the application.
   *
   * 当这是 `undefined` 或 `false` 并且开发人员已选择使用 `withComponentInputBinding` 功能时，如果在应用程序中使用此出口，将在开发模式下记录警告。
   *
   */
  readonly supportsBindingToComponentInputs?: true;
}

/**
 * @description
 *
 * Acts as a placeholder that Angular dynamically fills based on the current router state.
 *
 * 一个占位符，Angular 会根据当前的路由器状态动态填充它。
 *
 * Each outlet can have a unique name, determined by the optional `name` attribute.
 * The name cannot be set or changed dynamically. If not set, default value is "primary".
 *
 * 每个出口可以具有唯一的名称，该 `name` 由可选的 name 属性确定。该名称不能动态设置或更改。如果未设置，则默认值为 “primary”。
 *
 * ```
 * <router-outlet></router-outlet>
 * <router-outlet name='left'></router-outlet>
 * <router-outlet name='right'></router-outlet>
 * ```
 *
 * Named outlets can be the targets of secondary routes.
 * The `Route` object for a secondary route has an `outlet` property to identify the target outlet:
 *
 * 每当新组件实例化之后，路由出口就会发出一个激活事件；在销毁时则发出取消激活的事件。
 *
 * `{path: <base-path>, component: <component>, outlet: <target_outlet_name>}`
 *
 * Using named outlets and secondary routes, you can target multiple outlets in
 * the same `RouterLink` directive.
 *
 * 使用命名的出口和辅助路由，你可以在同一 `RouterLink` 指令中定位多个出口。
 *
 * The router keeps track of separate branches in a navigation tree for each named outlet and
 * generates a representation of that tree in the URL.
 * The URL for a secondary route uses the following syntax to specify both the primary and secondary
 * routes at the same time:
 *
 * 路由器在导航树中跟踪每个命名出口的单独分支，并在 URL 中生成该树的表示形式。辅助路由的 URL 使用以下语法同时指定主要路由和辅助路由：
 *
 * `http://base-path/primary-route-path(outlet-name:route-path)`
 *
 * A router outlet emits an activate event when a new component is instantiated,
 * deactivate event when a component is destroyed.
 * An attached event emits when the `RouteReuseStrategy` instructs the outlet to reattach the
 * subtree, and the detached event emits when the `RouteReuseStrategy` instructs the outlet to
 * detach the subtree.
 *
 * 每当新组件实例化之后，路由出口就会发出一个激活事件；在销毁时则发出取消激活的事件。
 *
 * ```
 * <router-outlet
 *   (activate)='onActivate($event)'
 *   (deactivate)='onDeactivate($event)'
 *   (attach)='onAttach($event)'
 *   (detach)='onDetach($event)'></router-outlet>
 * ```
 * @see [Routing tutorial](guide/router-tutorial-toh#named-outlets "Example of a named
 * outlet and secondary route configuration").
 *
 * [路由导航](guide/router-tutorial-toh#named-outlets "命名出口与第二路由的配置范例")。
 * @see `RouterLink`
 * @see `Route`
 * @ngModule RouterModule
 * @publicApi
 */
@Directive({
  selector: 'router-outlet',
  exportAs: 'outlet',
  standalone: true,
})
export class RouterOutlet implements OnDestroy, OnInit, RouterOutletContract {
  private activated: ComponentRef<any>|null = null;
  /** @internal */
  get activatedComponentRef(): ComponentRef<any>|null {
    return this.activated;
  }
  private _activatedRoute: ActivatedRoute|null = null;
  /**
   * The name of the outlet
   *
   * 出口名称
   *
   * @see [named outlets](guide/router-tutorial-toh#displaying-multiple-routes-in-named-outlets)
   *
   * [命名出口](guide/router-tutorial-toh#displaying-multiple-routes-in-named-outlets)
   *
   */
  @Input() name = PRIMARY_OUTLET;

  @Output('activate') activateEvents = new EventEmitter<any>();
  @Output('deactivate') deactivateEvents = new EventEmitter<any>();
  /**
   * Emits an attached component instance when the `RouteReuseStrategy` instructs to re-attach a
   * previously detached subtree.
   *
   * 当 `RouteReuseStrategy` 指示重新附加以前分离的子树时，发出一个附加的组件实例。
   *
   */
  @Output('attach') attachEvents = new EventEmitter<unknown>();
  /**
   * Emits a detached component instance when the `RouteReuseStrategy` instructs to detach the
   * subtree.
   *
   * 当 `RouteReuseStrategy` 指示分离子树时发出一个分离的组件实例。
   *
   */
  @Output('detach') detachEvents = new EventEmitter<unknown>();

  private parentContexts = inject(ChildrenOutletContexts);
  private location = inject(ViewContainerRef);
  private changeDetector = inject(ChangeDetectorRef);
  private environmentInjector = inject(EnvironmentInjector);
  private inputBinder = inject(INPUT_BINDER, {optional: true});
  /** @nodoc */
  readonly supportsBindingToComponentInputs = true;

  /** @nodoc */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['name']) {
      const {firstChange, previousValue} = changes['name'];
      if (firstChange) {
        // The first change is handled by ngOnInit. Because ngOnChanges doesn't get called when no
        // input is set at all, we need to centrally handle the first change there.
        return;
      }

      // unregister with the old name
      if (this.isTrackedInParentContexts(previousValue)) {
        this.deactivate();
        this.parentContexts.onChildOutletDestroyed(previousValue);
      }
      // register the new name
      this.initializeOutletWithName();
    }
  }

  /** @nodoc */
  ngOnDestroy(): void {
    // Ensure that the registered outlet is this one before removing it on the context.
    if (this.isTrackedInParentContexts(this.name)) {
      this.parentContexts.onChildOutletDestroyed(this.name);
    }
    this.inputBinder?.unsubscribeFromRouteData(this);
  }

  private isTrackedInParentContexts(outletName: string) {
    return this.parentContexts.getContext(outletName)?.outlet === this;
  }

  /** @nodoc */
  ngOnInit(): void {
    this.initializeOutletWithName();
  }

  private initializeOutletWithName() {
    this.parentContexts.onChildOutletCreated(this.name, this);
    if (this.activated) {
      return;
    }

    // If the outlet was not instantiated at the time the route got activated we need to populate
    // the outlet when it is initialized (ie inside a NgIf)
    const context = this.parentContexts.getContext(this.name);
    if (context?.route) {
      if (context.attachRef) {
        // `attachRef` is populated when there is an existing component to mount
        this.attach(context.attachRef, context.route);
      } else {
        // otherwise the component defined in the configuration is created
        this.activateWith(context.route, context.injector);
      }
    }
  }

  get isActivated(): boolean {
    return !!this.activated;
  }

  /**
   * @returns
   *
   * The currently activated component instance.
   *
   * 当前激活的组件实例。
   *
   * @throws An error if the outlet is not activated.
   *
   * 如果插座未激活，则会出现错误。
   *
   */
  get component(): Object {
    if (!this.activated)
      throw new RuntimeError(
          RuntimeErrorCode.OUTLET_NOT_ACTIVATED,
          (typeof ngDevMode === 'undefined' || ngDevMode) && 'Outlet is not activated');
    return this.activated.instance;
  }

  get activatedRoute(): ActivatedRoute {
    if (!this.activated)
      throw new RuntimeError(
          RuntimeErrorCode.OUTLET_NOT_ACTIVATED,
          (typeof ngDevMode === 'undefined' || ngDevMode) && 'Outlet is not activated');
    return this._activatedRoute as ActivatedRoute;
  }

  get activatedRouteData(): Data {
    if (this._activatedRoute) {
      return this._activatedRoute.snapshot.data;
    }
    return {};
  }

  /**
   * Called when the `RouteReuseStrategy` instructs to detach the subtree
   *
   * 受 `RouteReuseStrategy` 的指示，从子树中分离开时调用
   *
   */
  detach(): ComponentRef<any> {
    if (!this.activated)
      throw new RuntimeError(
          RuntimeErrorCode.OUTLET_NOT_ACTIVATED,
          (typeof ngDevMode === 'undefined' || ngDevMode) && 'Outlet is not activated');
    this.location.detach();
    const cmp = this.activated;
    this.activated = null;
    this._activatedRoute = null;
    this.detachEvents.emit(cmp.instance);
    return cmp;
  }

  /**
   * Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree
   *
   * `RouteReuseStrategy` 的指示，把以前分离的子树重新附加回来时调用
   *
   */
  attach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute) {
    this.activated = ref;
    this._activatedRoute = activatedRoute;
    this.location.insert(ref.hostView);
    this.inputBinder?.bindActivatedRouteToOutletComponent(this);
    this.attachEvents.emit(ref.instance);
  }

  deactivate(): void {
    if (this.activated) {
      const c = this.component;
      this.activated.destroy();
      this.activated = null;
      this._activatedRoute = null;
      this.deactivateEvents.emit(c);
    }
  }

  activateWith(activatedRoute: ActivatedRoute, environmentInjector?: EnvironmentInjector|null) {
    if (this.isActivated) {
      throw new RuntimeError(
          RuntimeErrorCode.OUTLET_ALREADY_ACTIVATED,
          (typeof ngDevMode === 'undefined' || ngDevMode) &&
              'Cannot activate an already activated outlet');
    }
    this._activatedRoute = activatedRoute;
    const location = this.location;
    const snapshot = activatedRoute.snapshot;
    const component = snapshot.component!;
    const childContexts = this.parentContexts.getOrCreateContext(this.name).children;
    const injector = new OutletInjector(activatedRoute, childContexts, location.injector);

    this.activated = location.createComponent(component, {
      index: location.length,
      injector,
      environmentInjector: environmentInjector ?? this.environmentInjector
    });
    // Calling `markForCheck` to make sure we will run the change detection when the
    // `RouterOutlet` is inside a `ChangeDetectionStrategy.OnPush` component.
    this.changeDetector.markForCheck();
    this.inputBinder?.bindActivatedRouteToOutletComponent(this);
    this.activateEvents.emit(this.activated.instance);
  }
}

class OutletInjector implements Injector {
  constructor(
      private route: ActivatedRoute, private childContexts: ChildrenOutletContexts,
      private parent: Injector) {}

  get(token: any, notFoundValue?: any): any {
    if (token === ActivatedRoute) {
      return this.route;
    }

    if (token === ChildrenOutletContexts) {
      return this.childContexts;
    }

    return this.parent.get(token, notFoundValue);
  }
}

export const INPUT_BINDER = new InjectionToken<RoutedComponentInputBinder>('');

/**
 * Injectable used as a tree-shakable provider for opting in to binding router data to component
 * inputs.
 *
 * Injectable 用作 tree-shakable 提供程序，用于选择将路由器数据绑定到组件输入。
 *
 * The RouterOutlet registers itself with this service when an `ActivatedRoute` is attached or
 * activated. When this happens, the service subscribes to the `ActivatedRoute` observables \(params,
 * queryParams, data\) and sets the inputs of the component using `ComponentRef.setInput`.
 * Importantly, when an input does not have an item in the route data with a matching key, this
 * input is set to `undefined`. If it were not done this way, the previous information would be
 * retained if the data got removed from the route \(i.e. if a query parameter is removed\).
 *
 * 当附加或激活 `ActivatedRoute` 时，RouterOutlet 将自己注册到此服务。发生这种情况时，服务会订阅 `ActivatedRoute` 可观察对象（参数、查询参数、数据）并使用 `ComponentRef.setInput` 设置组件的输入。重要的是，当输入在路由数据中没有具有匹配键的项目时，此输入将设置为 `undefined`。如果不这样做，如果数据从路由中移除（即，如果查询参数被移除），先前的信息将被保留。
 *
 * The `RouterOutlet` should unregister itself when destroyed via `unsubscribeFromRouteData` so that
 * the subscriptions are cleaned up.
 *
 * `RouterOutlet` 应该在通过 `unsubscribeFromRouteData` 销毁时自行注销，以便清理订阅。
 *
 */
@Injectable()
export class RoutedComponentInputBinder {
  private outletDataSubscriptions = new Map<RouterOutlet, Subscription>;

  bindActivatedRouteToOutletComponent(outlet: RouterOutlet) {
    this.unsubscribeFromRouteData(outlet);
    this.subscribeToRouteData(outlet);
  }

  unsubscribeFromRouteData(outlet: RouterOutlet) {
    this.outletDataSubscriptions.get(outlet)?.unsubscribe();
    this.outletDataSubscriptions.delete(outlet);
  }

  private subscribeToRouteData(outlet: RouterOutlet) {
    const {activatedRoute} = outlet;
    const dataSubscription =
        combineLatest([
          activatedRoute.queryParams,
          activatedRoute.params,
          activatedRoute.data,
        ])
            .pipe(switchMap(([queryParams, params, data], index) => {
              data = {...queryParams, ...params, ...data};
              // Get the first result from the data subscription synchronously so it's available to
              // the component as soon as possible (and doesn't require a second change detection).
              if (index === 0) {
                return of(data);
              }
              // Promise.resolve is used to avoid synchronously writing the wrong data when
              // two of the Observables in the `combineLatest` stream emit one after
              // another.
              return Promise.resolve(data);
            }))
            .subscribe(data => {
              // Outlet may have been deactivated or changed names to be associated with a different
              // route
              if (!outlet.isActivated || !outlet.activatedComponentRef ||
                  outlet.activatedRoute !== activatedRoute || activatedRoute.component === null) {
                this.unsubscribeFromRouteData(outlet);
                return;
              }

              const mirror = reflectComponentType(activatedRoute.component);
              if (!mirror) {
                this.unsubscribeFromRouteData(outlet);
                return;
              }

              for (const {templateName} of mirror.inputs) {
                outlet.activatedComponentRef.setInput(templateName, data[templateName]);
              }
            });

    this.outletDataSubscriptions.set(outlet, dataSubscription);
  }
}

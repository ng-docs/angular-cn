/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Location} from '@angular/common';
import {NgModuleRef, Type} from '@angular/core';
import {BehaviorSubject, combineLatest, EMPTY, Observable, of, Subject} from 'rxjs';
import {catchError, defaultIfEmpty, filter, finalize, map, switchMap, take, tap} from 'rxjs/operators';

import {createRouterState} from './create_router_state';
import {Event, GuardsCheckEnd, GuardsCheckStart, NavigationCancel, NavigationCancellationCode, NavigationError, NavigationStart, NavigationTrigger, ResolveEnd, ResolveStart, RoutesRecognized} from './events';
import {NavigationBehaviorOptions, QueryParamsHandling, Routes} from './models';
import {isNavigationCancelingError, isRedirectingNavigationCancelingError, redirectingNavigationError} from './navigation_canceling_error';
import {activateRoutes} from './operators/activate_routes';
import {applyRedirects} from './operators/apply_redirects';
import {checkGuards} from './operators/check_guards';
import {recognize} from './operators/recognize';
import {resolveData} from './operators/resolve_data';
import {switchTap} from './operators/switch_tap';
import {RouteReuseStrategy} from './route_reuse_strategy';
import {ErrorHandler} from './router_config';
import {RouterConfigLoader} from './router_config_loader';
import {ChildrenOutletContexts} from './router_outlet_context';
import {ActivatedRoute, ActivatedRouteSnapshot, createEmptyState, RouterState, RouterStateSnapshot} from './router_state';
import {Params} from './shared';
import {UrlHandlingStrategy} from './url_handling_strategy';
import {isUrlTree, UrlSerializer, UrlTree} from './url_tree';
import {Checks, getAllRouteGuards} from './utils/preactivation';


const NG_DEV_MODE = typeof ngDevMode === 'undefined' || !!ngDevMode;

/**
 * @description
 *
 * Options that modify the `Router` URL.
 * Supply an object containing any of these properties to a `Router` navigation function to
 * control how the target URL should be constructed.
 *
 * 修改 `Router` URL 的选项。将包含这些属性中的任何一个的对象提供给 `Router` 导航函数，以控制目标 URL 的构建方式。
 *
 * @see [Router.navigate() method](api/router/Router#navigate)
 *
 * [Router.navigate() 方法](api/router/Router#navigate)
 *
 * @see [Router.createUrlTree() method](api/router/Router#createurltree)
 *
 * [Router.createUrlTree() 方法](api/router/Router#createurltree)
 *
 * @see [Routing and Navigation guide](guide/router)
 *
 * [路由和导航指南](guide/router)
 *
 * @publicApi
 */
export interface UrlCreationOptions {
  /**
   * Specifies a root URI to use for relative navigation.
   *
   * 指定要用于相对导航的根 URI。
   *
   * For example, consider the following route configuration where the parent route
   * has two children.
   *
   * 例如，考虑以下路由配置，其中的父路由有两个子项。
   *
   * ```
   * [{
   *   path: 'parent',
   *   component: ParentComponent,
   *   children: [{
   *     path: 'list',
   *     component: ListComponent
   *   },{
   *     path: 'child',
   *     component: ChildComponent
   *   }]
   * }]
   * ```
   *
   * The following `go()` function navigates to the `list` route by
   * interpreting the destination URI as relative to the activated `child`  route
   *
   * 以下 `go()` 函数通过将目标 URI 解释为相对于激活的 `child` 由来导航到 `list` 路由
   *
   * ```
   *  @Component({...})
   *  class ChildComponent {
   *    constructor(private router: Router, private route: ActivatedRoute) {}
   *
   *    go() {
   *      this.router.navigate(['../list'], { relativeTo: this.route });
   *    }
   *  }
   * ```
   *
   * A value of `null` or `undefined` indicates that the navigation commands should be applied
   * relative to the root.
   *
   * 值为 `null` 或 `undefined` 表明导航命令应该相对于根应用。
   *
   */
  relativeTo?: ActivatedRoute|null;

  /**
   * Sets query parameters to the URL.
   *
   * 将查询参数设置为 URL。
   *
   * ```
   * // Navigate to /results?page=1
   * this.router.navigate(['/results'], { queryParams: { page: 1 } });
   * ```
   *
   */
  queryParams?: Params|null;

  /**
   * Sets the hash fragment for the URL.
   *
   * 设置 URL 的哈希片段。
   *
   * ```
   * // Navigate to /results#top
   * this.router.navigate(['/results'], { fragment: 'top' });
   * ```
   *
   */
  fragment?: string;

  /**
   * How to handle query parameters in the router link for the next navigation.
   * One of:
   *
   * 如何处理路由器链接中的查询参数以进行下一次导航。之一：
   *
   * * `preserve` : Preserve current parameters.
   *
   *   `preserve` ：保留当前参数。
   *
   * * `merge` : Merge new with current parameters.
   *
   *   `merge` ：将新参数与当前参数合并。
   *
   * The "preserve" option discards any new query params:
   *
   * “preserve” 选项会丢弃任何新的查询参数：
   *
   * ```
   * // from /view1?page=1 to/view2?page=1
   * this.router.navigate(['/view2'], { queryParams: { page: 2 },  queryParamsHandling: "preserve"
   * });
   * ```
   *
   * The "merge" option appends new query params to the params from the current URL:
   *
   * “merge” 选项将新的查询参数附加到当前 URL 的参数：
   *
   * ```
   * // from /view1?page=1 to/view2?page=1&otherKey=2
   * this.router.navigate(['/view2'], { queryParams: { otherKey: 2 },  queryParamsHandling: "merge"
   * });
   * ```
   *
   * In case of a key collision between current parameters and those in the `queryParams` object,
   * the new value is used.
   *
   * 如果当前参数与 `queryParams` 对象中的参数之间发生键冲突，则使用新值。
   *
   */
  queryParamsHandling?: QueryParamsHandling|null;

  /**
   * When true, preserves the URL fragment for the next navigation
   *
   * 当为 true 时，为下一个导航保留 URL 片段
   *
   * ```
   * // Preserve fragment from /results#top to /view#top
   * this.router.navigate(['/view'], { preserveFragment: true });
   * ```
   *
   */
  preserveFragment?: boolean;
}

/**
 * @description
 *
 * Options that modify the `Router` navigation strategy.
 * Supply an object containing any of these properties to a `Router` navigation function to
 * control how the target URL should be constructed or interpreted.
 *
 * 修改 `Router` 导航策略的选项。将包含这些属性中的任何一个的对象提供给 `Router` 导航函数，以控制目标 URL 的构建或解释方式。
 *
 * @see [Router.navigate() method](api/router/Router#navigate)
 *
 * [Router.navigate() 方法](api/router/Router#navigate)
 *
 * @see [Router.navigateByUrl() method](api/router/Router#navigatebyurl)
 *
 * [Router.navigateByUrl() 方法](api/router/Router#navigatebyurl)
 *
 * @see [Router.createUrlTree() method](api/router/Router#createurltree)
 *
 * [Router.createUrlTree() 方法](api/router/Router#createurltree)
 *
 * @see [Routing and Navigation guide](guide/router)
 *
 * [路由和导航指南](guide/router)
 *
 * @see UrlCreationOptions
 * @see NavigationBehaviorOptions
 *
 * 导航行为选项
 *
 * @publicApi
 */
export interface NavigationExtras extends UrlCreationOptions, NavigationBehaviorOptions {}

export type RestoredState = {
  [k: string]: any,
  // TODO(#27607): Remove `navigationId` and `ɵrouterPageId` and move to `ng` or `ɵ` namespace.
  navigationId: number,
  // The `ɵ` prefix is there to reduce the chance of colliding with any existing user properties on
  // the history state.
  ɵrouterPageId?: number,
};

/**
 * Information about a navigation operation.
 * Retrieve the most recent navigation object with the
 * [Router.getCurrentNavigation() method](api/router/Router#getcurrentnavigation) .
 *
 * 有关导航操作的信息。使用[Router.getCurrentNavigation() 方法](api/router/Router#getcurrentnavigation)检索最新的导航对象。
 *
 * * *id* : The unique identifier of the current navigation.
 *
 *   *id* ：当前导航的唯一标识符。
 *
 * * *initialUrl* : The target URL passed into the `Router#navigateByUrl()` call before navigation.
 *   This is the value before the router has parsed or applied redirects to it.
 *
 *   *initialUrl* ：在导航之前传递给 `Router#navigateByUrl()` 调用的目标 URL。这是路由器解析或应用重定向之前的值。
 *
 * * *extractedUrl* : The initial target URL after being parsed with `UrlSerializer.extract()`.
 *
 *   *extractUrl* ：使用 `UrlSerializer.extract()` 解析后的初始目标 URL。
 *
 * * *finalUrl* : The extracted URL after redirects have been applied.
 *   This URL may not be available immediately, therefore this property can be `undefined`.
 *   It is guaranteed to be set after the `RoutesRecognized` event fires.
 *
 *   *finalUrl* ：应用重定向后提取的 URL。此 URL 可能无法立即使用，因此此属性可以是 `undefined` 。保证在 `RoutesRecognized` 事件触发之后设置。
 *
 * * *trigger* : Identifies how this navigation was triggered.
 *   \-- 'imperative'--Triggered by `router.navigateByUrl` or `router.navigate`.
 *   \-- 'popstate'--Triggered by a popstate event.
 *   \-- 'hashchange'--Triggered by a hashchange event.
 *
 *   *trigger* ：标识此导航的触发方式。 -- “命令式”--由 `router.navigateByUrl` 或 `router.navigate` 触发。 -- “popstate”--由 popstate 事件触发。 -- 'hashchange'--由 hashchange 事件触发。
 *
 * * *extras* : A `NavigationExtras` options object that controlled the strategy used for this
 *   navigation.
 *
 *   *extras* ：控制此导航使用的策略的 `NavigationExtras` 选项对象。
 *
 * * *previousNavigation* : The previously successful `Navigation` object. Only one previous
 *   navigation is available, therefore this previous `Navigation` object has a `null` value for its
 *   own `previousNavigation`.
 *
 *   *previousNavigation* ：以前成功的 `Navigation` 对象。只有一个以前的导航可用，因此这 `previousNavigation` 的 `Navigation` 对象的 `null` 。
 *
 * @publicApi
 */
export interface Navigation {
  /**
   * The unique identifier of the current navigation.
   *
   * 当前导航的唯一标识符。
   *
   */
  id: number;
  /**
   * The target URL passed into the `Router#navigateByUrl()` call before navigation. This is
   * the value before the router has parsed or applied redirects to it.
   *
   * 在导航之前传递给 `Router#navigateByUrl()` 调用的目标 URL。这是路由器解析或应用重定向之前的值。
   *
   */
  initialUrl: UrlTree;
  /**
   * The initial target URL after being parsed with `UrlHandlingStrategy.extract()`.
   *
   * 使用 `UrlHandlingStrategy.extract()` 解析后的初始目标 URL。
   *
   */
  extractedUrl: UrlTree;
  /**
   * The extracted URL after redirects have been applied.
   * This URL may not be available immediately, therefore this property can be `undefined`.
   * It is guaranteed to be set after the `RoutesRecognized` event fires.
   *
   * 应用重定向后提取的 URL。此 URL 可能无法立即使用，因此此属性可以是 `undefined` 。保证在 `RoutesRecognized` 事件触发之后设置。
   *
   */
  finalUrl?: UrlTree;
  /**
   * Identifies how this navigation was triggered.
   *
   * 标识此导航的触发方式。
   *
   * * 'imperative'--Triggered by `router.navigateByUrl` or `router.navigate`.
   *
   *   “命令式” - 由 `router.navigateByUrl` 或 `router.navigate` 触发。
   *
   * * 'popstate'--Triggered by a popstate event.
   *
   *   “popstate”--由 popstate 事件触发。
   *
   * * 'hashchange'--Triggered by a hashchange event.
   *
   *   “hashchange”--由 hashchange 事件触发。
   *
   */
  trigger: 'imperative'|'popstate'|'hashchange';
  /**
   * Options that controlled the strategy used for this navigation.
   * See `NavigationExtras`.
   *
   * 控制此导航使用的策略的选项。请参阅 `NavigationExtras` 。
   *
   */
  extras: NavigationExtras;
  /**
   * The previously successful `Navigation` object. Only one previous navigation
   * is available, therefore this previous `Navigation` object has a `null` value
   * for its own `previousNavigation`.
   *
   * 以前成功的 `Navigation` 对象。只有一个以前的导航可用，因此这 `previousNavigation` 的 `Navigation` 对象的 `null` 。
   *
   */
  previousNavigation: Navigation|null;
}

export interface NavigationTransition {
  id: number;
  targetPageId: number;
  currentUrlTree: UrlTree;
  extractedUrl: UrlTree;
  urlAfterRedirects?: UrlTree;
  rawUrl: UrlTree;
  extras: NavigationExtras;
  resolve: any;
  reject: any;
  promise: Promise<boolean>;
  source: NavigationTrigger;
  restoredState: RestoredState|null;
  currentSnapshot: RouterStateSnapshot;
  targetSnapshot: RouterStateSnapshot|null;
  currentRouterState: RouterState;
  targetRouterState: RouterState|null;
  guards: Checks;
  guardsResult: boolean|UrlTree|null;
}

/**
 * The interface from the Router needed by the transitions. Used to avoid a circular dependency on
 * Router. This interface should be whittled down with future refactors. For example, we do not need
 * to get `UrlSerializer` from the Router. We can instead inject it in `NavigationTransitions`
 * directly.
 *
 * 转换所需的 Router 中的接口。用于避免对 Router 的循环依赖。这个接口应该通过未来的重构来减少。例如，我们不需要从 Router 获取 `UrlSerializer` 。我们也可以直接将它注入 `NavigationTransitions` 中。
 *
 */
interface InternalRouterInterface {
  events: Observable<Event>;
  lastSuccessfulNavigation: Navigation|null;
  browserUrlTree: UrlTree;
  currentUrlTree: UrlTree;
  rawUrlTree: UrlTree;
  transitions: BehaviorSubject<NavigationTransition>;
  navigationId: number;
  configLoader: RouterConfigLoader;
  ngModule: NgModuleRef<any>;
  readonly routerState: RouterState;
  errorHandler: ErrorHandler;
  malformedUriErrorHandler: (error: URIError, urlSerializer: UrlSerializer, url: string) => UrlTree;
  navigated: boolean;
  afterPreactivation: () => Observable<void>;
  urlHandlingStrategy: UrlHandlingStrategy;
  routeReuseStrategy: RouteReuseStrategy;
  onSameUrlNavigation: 'reload'|'ignore';
  paramsInheritanceStrategy: 'emptyOnly'|'always';
  urlUpdateStrategy: 'deferred'|'eager';
  serializeUrl(url: UrlTree): string;
  config: Routes;
  rootComponentType: Type<any>|null;
  urlSerializer: UrlSerializer;
  rootContexts: ChildrenOutletContexts;
  location: Location;
  triggerEvent(event: Event): void;
  setBrowserUrl(url: UrlTree, t: NavigationTransition): void;
  restoreHistory(t: NavigationTransition, restoringFromCaughtError?: boolean): void;
  cancelNavigationTransition(
      t: NavigationTransition, reason: string, code: NavigationCancellationCode): void;
  scheduleNavigation(
      rawUrl: UrlTree, source: NavigationTrigger, restoredState: RestoredState|null,
      extras: NavigationExtras,
      priorPromise?: {resolve: any, reject: any, promise: Promise<boolean>}): Promise<boolean>;
}

export class NavigationTransitions {
  currentNavigation: Navigation|null = null;

  constructor(readonly router: InternalRouterInterface) {}

  setupNavigations(transitions: Observable<NavigationTransition>):
      Observable<NavigationTransition> {
    const eventsSubject = (this.router.events as Subject<Event>);
    return transitions.pipe(
               filter(t => t.id !== 0),

               // Extract URL
               map(t =>
                       ({...t, extractedUrl: this.router.urlHandlingStrategy.extract(t.rawUrl)} as
                        NavigationTransition)),

               // Using switchMap so we cancel executing navigations when a new one comes in
               switchMap(overallTransitionState => {
                 let completed = false;
                 let errored = false;
                 return of(overallTransitionState)
                     .pipe(
                         // Store the Navigation object
                         tap(t => {
                           this.currentNavigation = {
                             id: t.id,
                             initialUrl: t.rawUrl,
                             extractedUrl: t.extractedUrl,
                             trigger: t.source,
                             extras: t.extras,
                             previousNavigation: !this.router.lastSuccessfulNavigation ? null : {
                               ...this.router.lastSuccessfulNavigation,
                               previousNavigation: null,
                             },
                           };
                         }),
                         switchMap(t => {
                           const browserUrlTree = this.router.browserUrlTree.toString();
                           const urlTransition = !this.router.navigated ||
                               t.extractedUrl.toString() !== browserUrlTree ||
                               // Navigations which succeed or ones which fail and are cleaned up
                               // correctly should result in `browserUrlTree` and `currentUrlTree`
                               // matching. If this is not the case, assume something went wrong and
                               // try processing the URL again.
                               browserUrlTree !== this.router.currentUrlTree.toString();
                           const processCurrentUrl =
                               (this.router.onSameUrlNavigation === 'reload' ? true :
                                                                               urlTransition) &&
                               this.router.urlHandlingStrategy.shouldProcessUrl(t.rawUrl);


                           if (processCurrentUrl) {
                             // If the source of the navigation is from a browser event, the URL is
                             // already updated. We already need to sync the internal state.
                             if (isBrowserTriggeredNavigation(t.source)) {
                               this.router.browserUrlTree = t.extractedUrl;
                             }
                             return of(t).pipe(
                                 // Fire NavigationStart event
                                 switchMap(t => {
                                   const transition = this.router.transitions.getValue();
                                   eventsSubject.next(new NavigationStart(
                                       t.id, this.router.serializeUrl(t.extractedUrl), t.source,
                                       t.restoredState));
                                   if (transition !== this.router.transitions.getValue()) {
                                     return EMPTY;
                                   }

                                   // This delay is required to match old behavior that forced
                                   // navigation to always be async
                                   return Promise.resolve(t);
                                 }),

                                 // ApplyRedirects
                                 applyRedirects(
                                     this.router.ngModule.injector, this.router.configLoader,
                                     this.router.urlSerializer, this.router.config),

                                 // Update the currentNavigation
                                 // `urlAfterRedirects` is guaranteed to be set after this point
                                 tap(t => {
                                   this.currentNavigation = {
                                     ...this.currentNavigation!,
                                     finalUrl: t.urlAfterRedirects
                                   };
                                   overallTransitionState.urlAfterRedirects = t.urlAfterRedirects;
                                 }),

                                 // Recognize
                                 recognize(
                                     this.router.ngModule.injector, this.router.rootComponentType,
                                     this.router.config, this.router.urlSerializer,
                                     this.router.paramsInheritanceStrategy),

                                 // Update URL if in `eager` update mode
                                 tap(t => {
                                   overallTransitionState.targetSnapshot = t.targetSnapshot;
                                   if (this.router.urlUpdateStrategy === 'eager') {
                                     if (!t.extras.skipLocationChange) {
                                       const rawUrl = this.router.urlHandlingStrategy.merge(
                                           t.urlAfterRedirects!, t.rawUrl);
                                       this.router.setBrowserUrl(rawUrl, t);
                                     }
                                     this.router.browserUrlTree = t.urlAfterRedirects!;
                                   }

                                   // Fire RoutesRecognized
                                   const routesRecognized = new RoutesRecognized(
                                       t.id, this.router.serializeUrl(t.extractedUrl),
                                       this.router.serializeUrl(t.urlAfterRedirects!),
                                       t.targetSnapshot!);
                                   eventsSubject.next(routesRecognized);
                                 }));
                           } else {
                             const processPreviousUrl = urlTransition && this.router.rawUrlTree &&
                                 this.router.urlHandlingStrategy.shouldProcessUrl(
                                     this.router.rawUrlTree);
                             /* When the current URL shouldn't be processed, but the previous one
                              * was, we handle this "error condition" by navigating to the
                              * previously successful URL, but leaving the URL intact.*/
                             if (processPreviousUrl) {
                               const {id, extractedUrl, source, restoredState, extras} = t;
                               const navStart = new NavigationStart(
                                   id, this.router.serializeUrl(extractedUrl), source,
                                   restoredState);
                               eventsSubject.next(navStart);
                               const targetSnapshot =
                                   createEmptyState(extractedUrl, this.router.rootComponentType)
                                       .snapshot;

                               overallTransitionState = {
                                 ...t,
                                 targetSnapshot,
                                 urlAfterRedirects: extractedUrl,
                                 extras: {...extras, skipLocationChange: false, replaceUrl: false},
                               };
                               return of(overallTransitionState);
                             } else {
                               /* When neither the current or previous URL can be processed, do
                                * nothing other than update router's internal reference to the
                                * current "settled" URL. This way the next navigation will be coming
                                * from the current URL in the browser.
                                */
                               this.router.rawUrlTree = t.rawUrl;
                               t.resolve(null);
                               return EMPTY;
                             }
                           }
                         }),

                         // --- GUARDS ---
                         tap(t => {
                           const guardsStart = new GuardsCheckStart(
                               t.id, this.router.serializeUrl(t.extractedUrl),
                               this.router.serializeUrl(t.urlAfterRedirects!), t.targetSnapshot!);
                           this.router.triggerEvent(guardsStart);
                         }),

                         map(t => {
                           overallTransitionState = {
                             ...t,
                             guards: getAllRouteGuards(
                                 t.targetSnapshot!, t.currentSnapshot, this.router.rootContexts)
                           };
                           return overallTransitionState;
                         }),

                         checkGuards(
                             this.router.ngModule.injector,
                             (evt: Event) => this.router.triggerEvent(evt)),
                         tap(t => {
                           overallTransitionState.guardsResult = t.guardsResult;
                           if (isUrlTree(t.guardsResult)) {
                             throw redirectingNavigationError(
                                 this.router.urlSerializer, t.guardsResult);
                           }

                           const guardsEnd = new GuardsCheckEnd(
                               t.id, this.router.serializeUrl(t.extractedUrl),
                               this.router.serializeUrl(t.urlAfterRedirects!), t.targetSnapshot!,
                               !!t.guardsResult);
                           this.router.triggerEvent(guardsEnd);
                         }),

                         filter(t => {
                           if (!t.guardsResult) {
                             this.router.restoreHistory(t);
                             this.router.cancelNavigationTransition(
                                 t, '', NavigationCancellationCode.GuardRejected);
                             return false;
                           }
                           return true;
                         }),

                         // --- RESOLVE ---
                         switchTap(t => {
                           if (t.guards.canActivateChecks.length) {
                             return of(t).pipe(
                                 tap(t => {
                                   const resolveStart = new ResolveStart(
                                       t.id, this.router.serializeUrl(t.extractedUrl),
                                       this.router.serializeUrl(t.urlAfterRedirects!),
                                       t.targetSnapshot!);
                                   this.router.triggerEvent(resolveStart);
                                 }),
                                 switchMap(t => {
                                   let dataResolved = false;
                                   return of(t).pipe(
                                       resolveData(
                                           this.router.paramsInheritanceStrategy,
                                           this.router.ngModule.injector),
                                       tap({
                                         next: () => dataResolved = true,
                                         complete: () => {
                                           if (!dataResolved) {
                                             this.router.restoreHistory(t);
                                             this.router.cancelNavigationTransition(
                                                 t,
                                                 NG_DEV_MODE ?
                                                     `At least one route resolver didn't emit any value.` :
                                                     '',
                                                 NavigationCancellationCode.NoDataFromResolver);
                                           }
                                         }
                                       }),
                                   );
                                 }),
                                 tap(t => {
                                   const resolveEnd = new ResolveEnd(
                                       t.id, this.router.serializeUrl(t.extractedUrl),
                                       this.router.serializeUrl(t.urlAfterRedirects!),
                                       t.targetSnapshot!);
                                   this.router.triggerEvent(resolveEnd);
                                 }));
                           }
                           return undefined;
                         }),

                         // --- LOAD COMPONENTS ---
                         switchTap((t: NavigationTransition) => {
                           const loadComponents =
                               (route: ActivatedRouteSnapshot): Array<Observable<void>> => {
                                 const loaders: Array<Observable<void>> = [];
                                 if (route.routeConfig?.loadComponent &&
                                     !route.routeConfig._loadedComponent) {
                                   loaders.push(
                                       this.router.configLoader.loadComponent(route.routeConfig)
                                           .pipe(
                                               tap(loadedComponent => {
                                                 route.component = loadedComponent;
                                               }),
                                               map(() => void 0),
                                               ));
                                 }
                                 for (const child of route.children) {
                                   loaders.push(...loadComponents(child));
                                 }
                                 return loaders;
                               };
                           return combineLatest(loadComponents(t.targetSnapshot!.root))
                               .pipe(defaultIfEmpty(), take(1));
                         }),

                         switchTap(() => this.router.afterPreactivation()),

                         map((t: NavigationTransition) => {
                           const targetRouterState = createRouterState(
                               this.router.routeReuseStrategy, t.targetSnapshot!,
                               t.currentRouterState);
                           overallTransitionState = {...t, targetRouterState};
                           return (overallTransitionState);
                         }),

                         /* Once here, we are about to activate synchronously. The assumption is
                            this will succeed, and user code may read from the Router service.
                            Therefore before activation, we need to update router properties storing
                            the current URL and the RouterState, as well as updated the browser URL.
                            All this should happen *before* activating. */
                         tap((t: NavigationTransition) => {
                           this.router.currentUrlTree = t.urlAfterRedirects!;
                           this.router.rawUrlTree = this.router.urlHandlingStrategy.merge(
                               t.urlAfterRedirects!, t.rawUrl);

                           (this.router as {routerState: RouterState}).routerState =
                               t.targetRouterState!;

                           if (this.router.urlUpdateStrategy === 'deferred') {
                             if (!t.extras.skipLocationChange) {
                               this.router.setBrowserUrl(this.router.rawUrlTree, t);
                             }
                             this.router.browserUrlTree = t.urlAfterRedirects!;
                           }
                         }),

                         activateRoutes(
                             this.router.rootContexts, this.router.routeReuseStrategy,
                             (evt: Event) => this.router.triggerEvent(evt)),

                         tap({
                           next() {
                             completed = true;
                           },
                           complete() {
                             completed = true;
                           }
                         }),
                         finalize(() => {
                           /* When the navigation stream finishes either through error or success,
                            * we set the `completed` or `errored` flag. However, there are some
                            * situations where we could get here without either of those being set.
                            * For instance, a redirect during NavigationStart. Therefore, this is a
                            * catch-all to make sure the NavigationCancel event is fired when a
                            * navigation gets cancelled but not caught by other means. */
                           if (!completed && !errored) {
                             const cancelationReason = NG_DEV_MODE ?
                                 `Navigation ID ${
                                     overallTransitionState
                                         .id} is not equal to the current navigation id ${
                                     this.router.navigationId}` :
                                 '';
                             this.router.cancelNavigationTransition(
                                 overallTransitionState, cancelationReason,
                                 NavigationCancellationCode.SupersededByNewNavigation);
                           }
                           // Only clear current navigation if it is still set to the one that
                           // finalized.
                           if (this.currentNavigation?.id === overallTransitionState.id) {
                             this.currentNavigation = null;
                           }
                         }),
                         catchError((e) => {
                           errored = true;
                           /* This error type is issued during Redirect, and is handled as a
                            * cancellation rather than an error. */
                           if (isNavigationCancelingError(e)) {
                             if (!isRedirectingNavigationCancelingError(e)) {
                               // Set property only if we're not redirecting. If we landed on a page
                               // and redirect to `/` route, the new navigation is going to see the
                               // `/` isn't a change from the default currentUrlTree and won't
                               // navigate. This is only applicable with initial navigation, so
                               // setting `navigated` only when not redirecting resolves this
                               // scenario.
                               this.router.navigated = true;
                               this.router.restoreHistory(overallTransitionState, true);
                             }
                             const navCancel = new NavigationCancel(
                                 overallTransitionState.id,
                                 this.router.serializeUrl(overallTransitionState.extractedUrl),
                                 e.message, e.cancellationCode);
                             eventsSubject.next(navCancel);

                             // When redirecting, we need to delay resolving the navigation
                             // promise and push it to the redirect navigation
                             if (!isRedirectingNavigationCancelingError(e)) {
                               overallTransitionState.resolve(false);
                             } else {
                               const mergedTree = this.router.urlHandlingStrategy.merge(
                                   e.url, this.router.rawUrlTree);
                               const extras = {
                                 skipLocationChange:
                                     overallTransitionState.extras.skipLocationChange,
                                 // The URL is already updated at this point if we have 'eager' URL
                                 // updates or if the navigation was triggered by the browser (back
                                 // button, URL bar, etc). We want to replace that item in history
                                 // if the navigation is rejected.
                                 replaceUrl: this.router.urlUpdateStrategy === 'eager' ||
                                     isBrowserTriggeredNavigation(overallTransitionState.source)
                               };

                               this.router.scheduleNavigation(
                                   mergedTree, 'imperative', null, extras, {
                                     resolve: overallTransitionState.resolve,
                                     reject: overallTransitionState.reject,
                                     promise: overallTransitionState.promise
                                   });
                             }

                             /* All other errors should reset to the router's internal URL reference
                              * to the pre-error state. */
                           } else {
                             this.router.restoreHistory(overallTransitionState, true);
                             const navError = new NavigationError(
                                 overallTransitionState.id,
                                 this.router.serializeUrl(overallTransitionState.extractedUrl), e,
                                 overallTransitionState.targetSnapshot ?? undefined);
                             eventsSubject.next(navError);
                             try {
                               overallTransitionState.resolve(this.router.errorHandler(e));
                             } catch (ee) {
                               overallTransitionState.reject(ee);
                             }
                           }
                           return EMPTY;
                         }));
                 // TODO(jasonaden): remove cast once g3 is on updated TypeScript
               })) as any as Observable<NavigationTransition>;
  }
}

export function isBrowserTriggeredNavigation(source: 'imperative'|'popstate'|'hashchange') {
  return source !== 'imperative';
}

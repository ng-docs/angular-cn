/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {EnvironmentInjector, inject, Injectable, Type} from '@angular/core';
import {BehaviorSubject, combineLatest, EMPTY, Observable, of, Subject} from 'rxjs';
import {catchError, defaultIfEmpty, filter, finalize, map, switchMap, take, tap} from 'rxjs/operators';

import {createRouterState} from './create_router_state';
import {INPUT_BINDER} from './directives/router_outlet';
import {Event, GuardsCheckEnd, GuardsCheckStart, IMPERATIVE_NAVIGATION, NavigationCancel, NavigationCancellationCode, NavigationEnd, NavigationError, NavigationSkipped, NavigationSkippedCode, NavigationStart, NavigationTrigger, ResolveEnd, ResolveStart, RouteConfigLoadEnd, RouteConfigLoadStart, RoutesRecognized} from './events';
import {NavigationBehaviorOptions, QueryParamsHandling, Route, Routes} from './models';
import {isNavigationCancelingError, isRedirectingNavigationCancelingError, redirectingNavigationError} from './navigation_canceling_error';
import {activateRoutes} from './operators/activate_routes';
import {checkGuards} from './operators/check_guards';
import {recognize} from './operators/recognize';
import {resolveData} from './operators/resolve_data';
import {switchTap} from './operators/switch_tap';
import {TitleStrategy} from './page_title_strategy';
import {RouteReuseStrategy} from './route_reuse_strategy';
import {ErrorHandler} from './router_config';
import {RouterConfigLoader} from './router_config_loader';
import {ChildrenOutletContexts} from './router_outlet_context';
import {ActivatedRoute, ActivatedRouteSnapshot, createEmptyState, RouterState, RouterStateSnapshot} from './router_state';
import {Params} from './shared';
import {UrlHandlingStrategy} from './url_handling_strategy';
import {isUrlTree, UrlSerializer, UrlTree} from './url_tree';
import {Checks, getAllRouteGuards} from './utils/preactivation';



/**
 * @description
 *
 * Options that modify the `Router` URL.
 * Supply an object containing any of these properties to a `Router` navigation function to
 * control how the target URL should be constructed.
 *
 * 修改 `Router` URL 的选项。将包含这些属性中的任何一个的对象提供给 `Router` 导航函数，以控制目标 URL 的构建方式。
 * @see [Router.navigate\(\) method](api/router/Router#navigate)
 *
 * [Router.navigate\(\) 方法](api/router/Router#navigate)
 *
 * @see [Router.createUrlTree\(\) method](api/router/Router#createurltree)
 *
 * [Router.createUrlTree\(\) 方法](api/router/Router#createurltree)
 *
 * @see [Routing and Navigation guide](guide/router)
 *
 * [路由和导航指南](guide/router)
 * @publicApi
 */
export interface UrlCreationOptions {
  /**
   * Specifies a root URI to use for relative navigation.
   *
   * 允许从当前激活的路由进行相对导航。
   *
   * For example, consider the following route configuration where the parent route
   * has two children.
   *
   * 比如，考虑下列路由器配置，parent 路由拥有两个子路由。
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
   * 下面的 `go()` 函数会把目标 URI 解释为相对于已激活路由 `child` 的，从而导航到 `list` 路由。
   *
   * ```
   *  @Component({...})
   *  class ChildComponent {
   *    constructor(private router: Router, private route: ActivatedRoute) {}
   *
   *    go() {
   *      router.navigate(['../list'], { relativeTo: this.route });
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
   * 设置 URL 的查询参数。
   *
   * ```
   * // Navigate to /results?page=1
   * router.navigate(['/results'], { queryParams: { page: 1 } });
   * ```
   *
   */
  queryParams?: Params|null;

  /**
   * Sets the hash fragment for the URL.
   *
   * 设置 URL 的哈希片段（`#`）。
   *
   * ```
   * // Navigate to /results#top
   * router.navigate(['/results'], { fragment: 'top' });
   * ```
   *
   */
  fragment?: string;

  /**
   * How to handle query parameters in the router link for the next navigation.
   * One of:
   *
   * 如何在路由器链接中处理查询参数以进行下一个导航。为下列值之一：
   *
   * * `preserve` : Preserve current parameters.
   *
   *   `preserve` ：保留当前参数。
   *
   * * `merge` : Merge new with current parameters.
   *
   *   `merge` ：合并新的当前参数。
   *
   * The "preserve" option discards any new query params:
   *
   * “preserve” 选项将放弃所有新的查询参数：
   *
   * ```
   * // from /view1?page=1 to/view2?page=1
   * router.navigate(['/view2'], { queryParams: { page: 2 },  queryParamsHandling: "preserve"
   * });
   * ```
   *
   * The "merge" option appends new query params to the params from the current URL:
   *
   * “merge” 选项会将新的查询参数附加到当前 URL 的参数中：
   *
   * ```
   * // from /view1?page=1 to/view2?page=1&otherKey=2
   * router.navigate(['/view2'], { queryParams: { otherKey: 2 },  queryParamsHandling: "merge"
   * });
   * ```
   *
   * In case of a key collision between current parameters and those in the `queryParams` object,
   * the new value is used.
   *
   * `queryParams` 对象中的参数之间发生键名冲突，则使用新值。
   *
   */
  queryParamsHandling?: QueryParamsHandling|null;

  /**
   * When true, preserves the URL fragment for the next navigation
   *
   * 在后续导航时保留 `#` 片段
   *
   * ```
   * // Preserve fragment from /results#top to /view#top
   * router.navigate(['/view'], { preserveFragment: true });
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
 * @see [Router.navigate\(\) method](api/router/Router#navigate)
 *
 * [Router.navigate\(\) 方法](api/router/Router#navigate)
 *
 * @see [Router.navigateByUrl\(\) method](api/router/Router#navigatebyurl)
 *
 * [Router.navigateByUrl\(\) 方法](api/router/Router#navigatebyurl)
 *
 * @see [Router.createUrlTree\(\) method](api/router/Router#createurltree)
 *
 * [Router.createUrlTree\(\) 方法](api/router/Router#createurltree)
 *
 * @see [Routing and Navigation guide](guide/router)
 *
 * [路由和导航指南](guide/router)
 * @see UrlCreationOptions
 * @see NavigationBehaviorOptions
 *
 * 导航行为选项
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
 * [Router.getCurrentNavigation\(\) method](api/router/Router#getcurrentnavigation) .
 *
 * 有关导航操作的信息。使用[Router.getCurrentNavigation\(\) 方法](api/router/Router#getcurrentnavigation)检索最新的导航对象。
 *
 * * *id* : The unique identifier of the current navigation.
 *
 *   *id* ：当前导航的唯一标识符。
 *
 * * *initialUrl* : The target URL passed into the `Router#navigateByUrl()` call before navigation.
 *   This is the value before the router has parsed or applied redirects to it.
 *
 *   *initialUrl*：在导航前传给 `Router#navigateByUrl()` 调用的目标 URL。这是路由器解析或对其应用重定向之前的值。
 *
 * * *extractedUrl* : The initial target URL after being parsed with `UrlSerializer.extract()`.
 *
 *   *extractedUrl*：使用 `UrlSerializer.extract()` 解析后的初始目标 URL。
 *
 * * *finalUrl* : The extracted URL after redirects have been applied.
 *   This URL may not be available immediately, therefore this property can be `undefined`.
 *   It is guaranteed to be set after the `RoutesRecognized` event fires.
 *
 *   *finalUrl*：应用重定向之后提取的 URL。该 URL 可能不会立即可用，因此该属性也可以是 `undefined`。在 `RoutesRecognized` 事件触发后进行设置。
 *
 * * *trigger* : Identifies how this navigation was triggered.
 *   \-- 'imperative'--Triggered by `router.navigateByUrl` or `router.navigate`.
 *   \-- 'popstate'--Triggered by a popstate event.
 *   \-- 'hashchange'--Triggered by a hashchange event.
 *
 *   *trigger*：表明这次导航是如何触发的。 -- 'imperative'-- 由 `router.navigateByUrl` 或 `router.navigate` 触发。 -- 'popstate'-- 由 popstate 事件触发。 -- 'hashchange'-- 由 hashchange 事件触发。
 *
 * * *extras* : A `NavigationExtras` options object that controlled the strategy used for this
 *   navigation.
 *
 *   *extras*：一个 `NavigationExtras` 选项对象，它控制用于此导航的策略。
 *
 * * *previousNavigation* : The previously successful `Navigation` object. Only one previous
 *   navigation is available, therefore this previous `Navigation` object has a `null` value for its
 *   own `previousNavigation`.
 *
 *   *previousNavigation*：先前成功的 `Navigation` 对象。只有一个先前的导航可用，因此该先前的 `Navigation` 对象自己的 `previousNavigation` 值为 `null`。
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
  currentRawUrl: UrlTree;
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
 */
interface InternalRouterInterface {
  browserUrlTree: UrlTree;
  currentUrlTree: UrlTree;
  rawUrlTree: UrlTree;
  readonly routerState: RouterState;
  errorHandler: ErrorHandler;
  titleStrategy?: TitleStrategy;
  navigated: boolean;
  urlHandlingStrategy: UrlHandlingStrategy;
  routeReuseStrategy: RouteReuseStrategy;
  onSameUrlNavigation: 'reload'|'ignore';
  paramsInheritanceStrategy: 'emptyOnly'|'always';
  urlUpdateStrategy: 'deferred'|'eager';
  serializeUrl(url: UrlTree): string;
  config: Routes;
  setBrowserUrl(url: UrlTree, t: NavigationTransition): void;
  restoreHistory(t: NavigationTransition, restoringFromCaughtError?: boolean): void;
  scheduleNavigation(
      rawUrl: UrlTree, source: NavigationTrigger, restoredState: RestoredState|null,
      extras: NavigationExtras,
      priorPromise?: {resolve: any, reject: any, promise: Promise<boolean>}): Promise<boolean>;
}

@Injectable({providedIn: 'root'})
export class NavigationTransitions {
  currentNavigation: Navigation|null = null;
  lastSuccessfulNavigation: Navigation|null = null;
  readonly events = new Subject<Event>();
  private readonly configLoader = inject(RouterConfigLoader);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly urlSerializer = inject(UrlSerializer);
  private readonly rootContexts = inject(ChildrenOutletContexts);
  private readonly inputBindingEnabled = inject(INPUT_BINDER, {optional: true}) !== null;
  navigationId = 0;
  get hasRequestedNavigation() {
    return this.navigationId !== 0;
  }
  private transitions?: BehaviorSubject<NavigationTransition>;
  /**
   * Hook that enables you to pause navigation after the preactivation phase.
   * Used by `RouterModule`.
   *
   * @internal
   */
  afterPreactivation: () => Observable<void> = () => of(void 0);
  /** @internal */
  rootComponentType: Type<any>|null = null;

  constructor() {
    const onLoadStart = (r: Route) => this.events.next(new RouteConfigLoadStart(r));
    const onLoadEnd = (r: Route) => this.events.next(new RouteConfigLoadEnd(r));
    this.configLoader.onLoadEndListener = onLoadEnd;
    this.configLoader.onLoadStartListener = onLoadStart;
  }

  complete() {
    this.transitions?.complete();
  }

  handleNavigationRequest(
      request: Pick<
          NavigationTransition,
          'targetPageId'|'source'|'restoredState'|'currentUrlTree'|'currentRawUrl'|'rawUrl'|
          'extras'|'resolve'|'reject'|'promise'|'currentSnapshot'|'currentRouterState'>) {
    const id = ++this.navigationId;
    this.transitions?.next({...this.transitions.value, ...request, id});
  }

  setupNavigations(router: InternalRouterInterface): Observable<NavigationTransition> {
    this.transitions = new BehaviorSubject<NavigationTransition>({
      id: 0,
      targetPageId: 0,
      currentUrlTree: router.currentUrlTree,
      currentRawUrl: router.currentUrlTree,
      extractedUrl: router.urlHandlingStrategy.extract(router.currentUrlTree),
      urlAfterRedirects: router.urlHandlingStrategy.extract(router.currentUrlTree),
      rawUrl: router.currentUrlTree,
      extras: {},
      resolve: null,
      reject: null,
      promise: Promise.resolve(true),
      source: IMPERATIVE_NAVIGATION,
      restoredState: null,
      currentSnapshot: router.routerState.snapshot,
      targetSnapshot: null,
      currentRouterState: router.routerState,
      targetRouterState: null,
      guards: {canActivateChecks: [], canDeactivateChecks: []},
      guardsResult: null,
    });
    return this.transitions.pipe(
               filter(t => t.id !== 0),

               // Extract URL
               map(t =>
                       ({...t, extractedUrl: router.urlHandlingStrategy.extract(t.rawUrl)} as
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
                             previousNavigation: !this.lastSuccessfulNavigation ? null : {
                               ...this.lastSuccessfulNavigation,
                               previousNavigation: null,
                             },
                           };
                         }),
                         switchMap(t => {
                           const browserUrlTree = router.browserUrlTree.toString();
                           const urlTransition = !router.navigated ||
                               t.extractedUrl.toString() !== browserUrlTree ||
                               // Navigations which succeed or ones which fail and are cleaned up
                               // correctly should result in `browserUrlTree` and `currentUrlTree`
                               // matching. If this is not the case, assume something went wrong and
                               // try processing the URL again.
                               browserUrlTree !== router.currentUrlTree.toString();


                           const onSameUrlNavigation =
                               t.extras.onSameUrlNavigation ?? router.onSameUrlNavigation;
                           if (!urlTransition && onSameUrlNavigation !== 'reload') {
                             const reason = (typeof ngDevMode === 'undefined' || ngDevMode) ?
                                 `Navigation to ${
                                     t.rawUrl} was ignored because it is the same as the current Router URL.` :
                                 '';
                             this.events.next(new NavigationSkipped(
                                 t.id, router.serializeUrl(overallTransitionState.rawUrl), reason,
                                 NavigationSkippedCode.IgnoredSameUrlNavigation));
                             router.rawUrlTree = t.rawUrl;
                             t.resolve(null);
                             return EMPTY;
                           }

                           if (router.urlHandlingStrategy.shouldProcessUrl(t.rawUrl)) {
                             // If the source of the navigation is from a browser event, the URL is
                             // already updated. We already need to sync the internal state.
                             if (isBrowserTriggeredNavigation(t.source)) {
                               router.browserUrlTree = t.extractedUrl;
                             }
                             return of(t).pipe(
                                 // Fire NavigationStart event
                                 switchMap(t => {
                                   const transition = this.transitions?.getValue();
                                   this.events.next(new NavigationStart(
                                       t.id, this.urlSerializer.serialize(t.extractedUrl), t.source,
                                       t.restoredState));
                                   if (transition !== this.transitions?.getValue()) {
                                     return EMPTY;
                                   }

                                   // This delay is required to match old behavior that forced
                                   // navigation to always be async
                                   return Promise.resolve(t);
                                 }),

                                 // Recognize
                                 recognize(
                                     this.environmentInjector, this.configLoader,
                                     this.rootComponentType, router.config, this.urlSerializer,
                                     router.paramsInheritanceStrategy),

                                 // Update URL if in `eager` update mode
                                 tap(t => {
                                   overallTransitionState.targetSnapshot = t.targetSnapshot;
                                   overallTransitionState.urlAfterRedirects = t.urlAfterRedirects;
                                   this.currentNavigation = {
                                     ...this.currentNavigation!,
                                     finalUrl: t.urlAfterRedirects
                                   };

                                   if (router.urlUpdateStrategy === 'eager') {
                                     if (!t.extras.skipLocationChange) {
                                       const rawUrl = router.urlHandlingStrategy.merge(
                                           t.urlAfterRedirects!, t.rawUrl);
                                       router.setBrowserUrl(rawUrl, t);
                                     }
                                     router.browserUrlTree = t.urlAfterRedirects!;
                                   }

                                   // Fire RoutesRecognized
                                   const routesRecognized = new RoutesRecognized(
                                       t.id, this.urlSerializer.serialize(t.extractedUrl),
                                       this.urlSerializer.serialize(t.urlAfterRedirects!),
                                       t.targetSnapshot!);
                                   this.events.next(routesRecognized);
                                 }));
                           } else if (
                               urlTransition &&
                               router.urlHandlingStrategy.shouldProcessUrl(router.rawUrlTree)) {
                             /* When the current URL shouldn't be processed, but the previous one
                              * was, we handle this "error condition" by navigating to the
                              * previously successful URL, but leaving the URL intact.*/
                             const {id, extractedUrl, source, restoredState, extras} = t;
                             const navStart = new NavigationStart(
                                 id, this.urlSerializer.serialize(extractedUrl), source,
                                 restoredState);
                             this.events.next(navStart);
                             const targetSnapshot =
                                 createEmptyState(extractedUrl, this.rootComponentType).snapshot;

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
                             const reason = (typeof ngDevMode === 'undefined' || ngDevMode) ?
                                 `Navigation was ignored because the UrlHandlingStrategy` +
                                     ` indicated neither the current URL ${
                                         router.rawUrlTree} nor target URL ${
                                         t.rawUrl} should be processed.` :
                                 '';
                             this.events.next(new NavigationSkipped(
                                 t.id, router.serializeUrl(overallTransitionState.extractedUrl),
                                 reason, NavigationSkippedCode.IgnoredByUrlHandlingStrategy));
                             router.rawUrlTree = t.rawUrl;
                             t.resolve(null);
                             return EMPTY;
                           }
                         }),

                         // --- GUARDS ---
                         tap(t => {
                           const guardsStart = new GuardsCheckStart(
                               t.id, this.urlSerializer.serialize(t.extractedUrl),
                               this.urlSerializer.serialize(t.urlAfterRedirects!),
                               t.targetSnapshot!);
                           this.events.next(guardsStart);
                         }),

                         map(t => {
                           overallTransitionState = {
                             ...t,
                             guards: getAllRouteGuards(
                                 t.targetSnapshot!, t.currentSnapshot, this.rootContexts)
                           };
                           return overallTransitionState;
                         }),

                         checkGuards(
                             this.environmentInjector, (evt: Event) => this.events.next(evt)),
                         tap(t => {
                           overallTransitionState.guardsResult = t.guardsResult;
                           if (isUrlTree(t.guardsResult)) {
                             throw redirectingNavigationError(this.urlSerializer, t.guardsResult);
                           }

                           const guardsEnd = new GuardsCheckEnd(
                               t.id, this.urlSerializer.serialize(t.extractedUrl),
                               this.urlSerializer.serialize(t.urlAfterRedirects!),
                               t.targetSnapshot!, !!t.guardsResult);
                           this.events.next(guardsEnd);
                         }),

                         filter(t => {
                           if (!t.guardsResult) {
                             router.restoreHistory(t);
                             this.cancelNavigationTransition(
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
                                       t.id, this.urlSerializer.serialize(t.extractedUrl),
                                       this.urlSerializer.serialize(t.urlAfterRedirects!),
                                       t.targetSnapshot!);
                                   this.events.next(resolveStart);
                                 }),
                                 switchMap(t => {
                                   let dataResolved = false;
                                   return of(t).pipe(
                                       resolveData(
                                           router.paramsInheritanceStrategy,
                                           this.environmentInjector),
                                       tap({
                                         next: () => dataResolved = true,
                                         complete: () => {
                                           if (!dataResolved) {
                                             router.restoreHistory(t);
                                             this.cancelNavigationTransition(
                                                 t,
                                                 (typeof ngDevMode === 'undefined' || ngDevMode) ?
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
                                       t.id, this.urlSerializer.serialize(t.extractedUrl),
                                       this.urlSerializer.serialize(t.urlAfterRedirects!),
                                       t.targetSnapshot!);
                                   this.events.next(resolveEnd);
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
                                   loaders.push(this.configLoader.loadComponent(route.routeConfig)
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

                         switchTap(() => this.afterPreactivation()),

                         map((t: NavigationTransition) => {
                           const targetRouterState = createRouterState(
                               router.routeReuseStrategy, t.targetSnapshot!, t.currentRouterState);
                           overallTransitionState = {...t, targetRouterState};
                           return (overallTransitionState);
                         }),

                         /* Once here, we are about to activate synchronously. The assumption is
                            this will succeed, and user code may read from the Router service.
                            Therefore before activation, we need to update router properties storing
                            the current URL and the RouterState, as well as updated the browser URL.
                            All this should happen *before* activating. */
                         tap((t: NavigationTransition) => {
                           router.currentUrlTree = t.urlAfterRedirects!;
                           router.rawUrlTree =
                               router.urlHandlingStrategy.merge(t.urlAfterRedirects!, t.rawUrl);

                           (router as {routerState: RouterState}).routerState =
                               t.targetRouterState!;

                           if (router.urlUpdateStrategy === 'deferred') {
                             if (!t.extras.skipLocationChange) {
                               router.setBrowserUrl(router.rawUrlTree, t);
                             }
                             router.browserUrlTree = t.urlAfterRedirects!;
                           }
                         }),

                         activateRoutes(
                             this.rootContexts, router.routeReuseStrategy,
                             (evt: Event) => this.events.next(evt), this.inputBindingEnabled),

                         // Ensure that if some observable used to drive the transition doesn't
                         // complete, the navigation still finalizes This should never happen, but
                         // this is done as a safety measure to avoid surfacing this error (#49567).
                         take(1),

                         tap({
                           next: (t: NavigationTransition) => {
                             completed = true;
                             this.lastSuccessfulNavigation = this.currentNavigation;
                             router.navigated = true;
                             this.events.next(new NavigationEnd(
                                 t.id, this.urlSerializer.serialize(t.extractedUrl),
                                 this.urlSerializer.serialize(router.currentUrlTree)));
                             router.titleStrategy?.updateTitle(t.targetRouterState!.snapshot);
                             t.resolve(true);
                           },
                           complete: () => {
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
                             const cancelationReason =
                                 (typeof ngDevMode === 'undefined' || ngDevMode) ?
                                 `Navigation ID ${
                                     overallTransitionState
                                         .id} is not equal to the current navigation id ${
                                     this.navigationId}` :
                                 '';
                             this.cancelNavigationTransition(
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
                               router.navigated = true;
                               router.restoreHistory(overallTransitionState, true);
                             }
                             const navCancel = new NavigationCancel(
                                 overallTransitionState.id,
                                 this.urlSerializer.serialize(overallTransitionState.extractedUrl),
                                 e.message, e.cancellationCode);
                             this.events.next(navCancel);

                             // When redirecting, we need to delay resolving the navigation
                             // promise and push it to the redirect navigation
                             if (!isRedirectingNavigationCancelingError(e)) {
                               overallTransitionState.resolve(false);
                             } else {
                               const mergedTree =
                                   router.urlHandlingStrategy.merge(e.url, router.rawUrlTree);
                               const extras = {
                                 skipLocationChange:
                                     overallTransitionState.extras.skipLocationChange,
                                 // The URL is already updated at this point if we have 'eager' URL
                                 // updates or if the navigation was triggered by the browser (back
                                 // button, URL bar, etc). We want to replace that item in history
                                 // if the navigation is rejected.
                                 replaceUrl: router.urlUpdateStrategy === 'eager' ||
                                     isBrowserTriggeredNavigation(overallTransitionState.source)
                               };

                               router.scheduleNavigation(
                                   mergedTree, IMPERATIVE_NAVIGATION, null, extras, {
                                     resolve: overallTransitionState.resolve,
                                     reject: overallTransitionState.reject,
                                     promise: overallTransitionState.promise
                                   });
                             }

                             /* All other errors should reset to the router's internal URL reference
                              * to the pre-error state. */
                           } else {
                             router.restoreHistory(overallTransitionState, true);
                             const navError = new NavigationError(
                                 overallTransitionState.id,
                                 this.urlSerializer.serialize(overallTransitionState.extractedUrl),
                                 e, overallTransitionState.targetSnapshot ?? undefined);
                             this.events.next(navError);
                             try {
                               overallTransitionState.resolve(router.errorHandler(e));
                             } catch (ee) {
                               overallTransitionState.reject(ee);
                             }
                           }
                           return EMPTY;
                         }));
                 // casting because `pipe` returns observable({}) when called with 8+ arguments
               })) as Observable<NavigationTransition>;
  }

  private cancelNavigationTransition(
      t: NavigationTransition, reason: string, code: NavigationCancellationCode) {
    const navCancel =
        new NavigationCancel(t.id, this.urlSerializer.serialize(t.extractedUrl), reason, code);
    this.events.next(navCancel);
    t.resolve(false);
  }
}

export function isBrowserTriggeredNavigation(source: NavigationTrigger) {
  return source !== IMPERATIVE_NAVIGATION;
}

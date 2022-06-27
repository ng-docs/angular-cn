/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Location} from '@angular/common';
import {Compiler, Injectable, Injector, NgModuleRef, NgZone, Type, ɵConsole as Console} from '@angular/core';
import {BehaviorSubject, combineLatest, EMPTY, Observable, of, Subject, SubscriptionLike} from 'rxjs';
import {catchError, defaultIfEmpty, filter, finalize, map, switchMap, take, tap} from 'rxjs/operators';

import {createRouterState} from './create_router_state';
import {createUrlTree} from './create_url_tree';
import {Event, GuardsCheckEnd, GuardsCheckStart, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, NavigationTrigger, ResolveEnd, ResolveStart, RouteConfigLoadEnd, RouteConfigLoadStart, RoutesRecognized} from './events';
import {QueryParamsHandling, Route, Routes} from './models';
import {activateRoutes} from './operators/activate_routes';
import {applyRedirects} from './operators/apply_redirects';
import {checkGuards} from './operators/check_guards';
import {recognize} from './operators/recognize';
import {resolveData} from './operators/resolve_data';
import {switchTap} from './operators/switch_tap';
import {TitleStrategy} from './page_title_strategy';
import {DefaultRouteReuseStrategy, RouteReuseStrategy} from './route_reuse_strategy';
import {RouterConfigLoader} from './router_config_loader';
import {ChildrenOutletContexts} from './router_outlet_context';
import {ActivatedRoute, ActivatedRouteSnapshot, createEmptyState, RouterState, RouterStateSnapshot} from './router_state';
import {isNavigationCancelingError, navigationCancelingError, Params} from './shared';
import {DefaultUrlHandlingStrategy, UrlHandlingStrategy} from './url_handling_strategy';
import {containsTree, createEmptyUrlTree, IsActiveMatchOptions, UrlSerializer, UrlTree} from './url_tree';
import {standardizeConfig, validateConfig} from './utils/config';
import {Checks, getAllRouteGuards} from './utils/preactivation';
import {isUrlTree} from './utils/type_guards';


const NG_DEV_MODE = typeof ngDevMode === 'undefined' || !!ngDevMode;

/**
 * @description
 *
 * Options that modify the `Router` URL.
 * Supply an object containing any of these properties to a `Router` navigation function to
 * control how the target URL should be constructed.
 *
 * 本选项用来修改 `Router` 的 URL。向 `Router`
 * 导航功能提供包含任何这些属性的对象，以控制应如何构造目标 URL。
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
 * 用于修订导航策略的额外选项。
 *
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
   *
   * ```
   *
   * @Component ({...})
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
   */
  relativeTo?: ActivatedRoute|null;

  /**
   * Sets query parameters to the URL.
   *
   * 设置 URL 的查询参数。
   *
   * ```
   * // Navigate to /results?page=1
   * this.router.navigate(['/results'], { queryParams: { page: 1 } });
   * ```
   */
  queryParams?: Params|null;

  /**
   * Sets the hash fragment for the URL.
   *
   * 设置 URL 的哈希片段（`#`）。
   *
   * ```
   * // Navigate to /results#top
   * this.router.navigate(['/results'], { fragment: 'top' });
   * ```
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
   * this.router.navigate(['/view2'], { queryParams: { page: 2 },  queryParamsHandling: "preserve"
   * });
   * ```
   *
   * The "merge" option appends new query params to the params from the current URL:
   *
   * “merge” 选项会将新的查询参数附加到当前 URL 的参数中：
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
   * `queryParams` 对象中的参数之间发生键名冲突，则使用新值。
   */
  queryParamsHandling?: QueryParamsHandling|null;

  /**
   * When true, preserves the URL fragment for the next navigation
   *
   * 在后续导航时保留 `#` 片段
   *
   * ```
   * // Preserve fragment from /results#top to /view#top
   * this.router.navigate(['/view'], { preserveFragment: true });
   * ```
   */
  preserveFragment?: boolean;
}

/**
 * @description
 *
 * Options that modify the `Router` navigation strategy.
 * Supply an object containing any of these properties to a `Router` navigation function to
 * control how the navigation should be handled.
 *
 * 修改 `Router` 导航策略的选项。为 `Router`
 * 导航功能提供包含任何这些属性的对象，以控制导航的处理方式。
 *
 * @see [Router.navigate() method](api/router/Router#navigate)
 *
 * [Router.navigate() 方法](api/router/Router#navigate)
 *
 * @see [Router.navigateByUrl() method](api/router/Router#navigatebyurl)
 *
 * [Router.navigateByUrl() 方法](api/router/Router#navigatebyurl)
 *
 * @see [Routing and Navigation guide](guide/router)
 *
 * [路由和导航指南](guide/router)
 *
 * @publicApi
 */
export interface NavigationBehaviorOptions {
  /**
   * When true, navigates without pushing a new state into history.
   *
   * 导航时不要把新状态记入历史
   *
   * ```
   * // Navigate silently to /view
   * this.router.navigate(['/view'], { skipLocationChange: true });
   * ```
   */
  skipLocationChange?: boolean;

  /**
   * When true, navigates while replacing the current state in history.
   *
   * 导航时不要把当前状态记入历史
   *
   * ```
   * // Navigate to /view
   * this.router.navigate(['/view'], { replaceUrl: true });
   * ```
   */
  replaceUrl?: boolean;

  /**
   * Developer-defined state that can be passed to any navigation.
   * Access this value through the `Navigation.extras` object
   * returned from the [Router.getCurrentNavigation()
   * method](api/router/Router#getcurrentnavigation) while a navigation is executing.
   *
   * 由开发人员定义的状态，可以传递给任何导航。当执行导航时会通过由 [Router.getCurrentNavigation()
   * 方法](api/router/Router#getcurrentnavigation)返回的 `Navigation.extras` 对象来访问此值。
   *
   * After a navigation completes, the router writes an object containing this
   * value together with a `navigationId` to `history.state`.
   * The value is written when `location.go()` or `location.replaceState()`
   * is called before activating this route.
   *
   * 导航完成后，路由器会将包含该值和 `navigationId` 的对象写入
   * `history.state`。在激活此路由之前，会在调用 `location.go()` 或 `location.replaceState()`
   * 时写入该值。
   *
   * Note that `history.state` does not pass an object equality test because
   * the router adds the `navigationId` on each navigation.
   *
   * 需要注意的是 `history.state` 不应该用于对象相等测试，因为每次导航时路由器都会添加
   * `navigationId`。
   *
   */
  state?: {[k: string]: any};
}

/**
 * @description
 *
 * Options that modify the `Router` navigation strategy.
 * Supply an object containing any of these properties to a `Router` navigation function to
 * control how the target URL should be constructed or interpreted.
 *
 * 修改 `Router` 导航策略的选项。为 `Router`
 * 导航功能提供包含任何这些属性的对象，以控制应如何构造或解释目标 URL。
 * @see [Router.navigate() method](api/router/Router#navigate)
 *
 * [Router.navigate() 方法](api/router/Router#navigate)
 * @see [Router.navigateByUrl() method](api/router/Router#navigatebyurl)
 *
 * [Router.navigateByUrl() 方法](api/router/Router#navigatebyurl)
 * @see [Router.createUrlTree() method](api/router/Router#createurltree)
 *
 * [Router.createUrlTree() 方法](api/router/Router#createurltree)
 * @see [Routing and Navigation guide](guide/router)
 *
 * [路由和导航指南](guide/router)
 * @see UrlCreationOptions
 * @see NavigationBehaviorOptions
 *
 * 导航行为选项
 *
 * @publicApi
 */
export interface NavigationExtras extends UrlCreationOptions, NavigationBehaviorOptions {}

/**
 * Error handler that is invoked when a navigation error occurs.
 *
 * 错误处理器会在导航出错时调用。
 *
 * If the handler returns a value, the navigation Promise is resolved with this value.
 * If the handler throws an exception, the navigation Promise is rejected with
 * the exception.
 *
 * 如果该处理器返回一个值，那么本次导航返回的 Promise 就会使用这个值进行解析（resolve）。
 * 如果该处理器抛出异常，那么本次导航返回的 Promise 就会使用这个异常进行拒绝（reject）。
 *
 * @publicApi
 */
export type ErrorHandler = (error: any) => any;

function defaultErrorHandler(error: any): any {
  throw error;
}

function defaultMalformedUriErrorHandler(
    error: URIError, urlSerializer: UrlSerializer, url: string): UrlTree {
  return urlSerializer.parse('/');
}

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
 * 有关导航操作的信息。使用 [Router.getCurrentNavigation()
 * 方法](api/router/Router#getcurrentnavigation)检索最新的导航对象。
 *
 * * *id* : The unique identifier of the current navigation.
 *
 *   *id* ：当前导航的唯一标识符。
 *
 * * *initialUrl* : The target URL passed into the `Router#navigateByUrl()` call before navigation.
 *   This is the value before the router has parsed or applied redirects to it.
 *
 *   *initialUrl* ：在导航之前传递给 `Router#navigateByUrl()` 调用的目标
 * URL。这是路由器解析或应用重定向之前的值。
 *
 *   ```
 *   *initialUrl*：在导航前传给 `Router#navigateByUrl()` 调用的目标
 *   ```
 *
 *   URL。这是路由器解析或对其应用重定向之前的值。
 *
 * * *extractedUrl* : The initial target URL after being parsed with `UrlSerializer.extract()`.
 *
 *   *extractedUrl*：使用 `UrlSerializer.extract()` 解析后的初始目标 URL。
 *
 * * *finalUrl* : The extracted URL after redirects have been applied.
 *   This URL may not be available immediately, therefore this property can be `undefined`.
 *   It is guaranteed to be set after the `RoutesRecognized` event fires.
 *
 *   *finalUrl* ：应用重定向后提取的 URL。此 URL 可能无法立即使用，因此此属性可以是 `undefined`
 * 。保证在 `RoutesRecognized` 事件触发之后设置。
 *
 *   ```
 *   *finalUrl*：应用重定向之后提取的 URL。该 URL 可能不会立即可用，因此该属性也可以是
 *   ```
 *
 *   `undefined`。在 `RoutesRecognized` 事件触发后进行设置。
 *
 * * *trigger* : Identifies how this navigation was triggered.
 *   \-- 'imperative'--Triggered by `router.navigateByUrl` or `router.navigate`.
 *   \-- 'popstate'--Triggered by a popstate event.
 *   \-- 'hashchange'--Triggered by a hashchange event.
 *
 *     *trigger*：表明这次导航是如何触发的。
 *     \-- 'imperative'-- 由 `router.navigateByUrl` 或 `router.navigate` 触发。
 *     \-- 'popstate'-- 由 popstate 事件触发。
 *     \-- 'hashchange'-- 由 hashchange 事件触发。
 *
 * * *extras* : A `NavigationExtras` options object that controlled the strategy used for this
 *   navigation.
 *
 *   *extras* ：控制此导航使用的策略的 `NavigationExtras` 选项对象。
 *
 *   ```
 *   *extras*：一个 `NavigationExtras` 选项对象，它控制用于此导航的策略。
 *   ```
 *
 * * *previousNavigation* : The previously successful `Navigation` object. Only one previous
 *   navigation is available, therefore this previous `Navigation` object has a `null` value for its
 *   own `previousNavigation`.
 *
 *   *previousNavigation* ：以前成功的 `Navigation` 对象。只有一个以前的导航可用，因此这
 * `previousNavigation` 的 `Navigation` 对象的 nextNavigation 有一个 `null` 值。
 *
 *   ```
 *   *previousNavigation*：先前成功的 `Navigation` 对象。只有一个先前的导航可用，因此该先前的
 *   ```
 *
 *   `Navigation` 对象自己的 `previousNavigation` 值为 `null`。
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
   * 导航之前，将目标 URL 传递到 `Router#navigateByUrl()`
   * 调用中。这是路由器解析或对其应用重定向之前的值。
   *
   */
  initialUrl: UrlTree;
  /**
   * The initial target URL after being parsed with `UrlSerializer.extract()`.
   *
   * `UrlSerializer.extract()` 解析后的初始目标 URL。
   *
   */
  extractedUrl: UrlTree;
  /**
   * The extracted URL after redirects have been applied.
   * This URL may not be available immediately, therefore this property can be `undefined`.
   * It is guaranteed to be set after the `RoutesRecognized` event fires.
   *
   * 应用重定向后的已提取 URL。该 URL 可能不会立即可用，因此该属性也可能是 `undefined`。这会在
   * `RoutesRecognized` 事件触发后进行设置。
   *
   */
  finalUrl?: UrlTree;
  /**
   * Identifies how this navigation was triggered.
   *
   * 标识此导航是如何触发的。
   *
   * * 'imperative'--Triggered by `router.navigateByUrl` or `router.navigate`.
   *
   *   'imperative' - 由 `router.navigateByUrl` 或 `router.navigate` 触发。
   *
   * * 'popstate'--Triggered by a popstate event.
   *
   *   'popstate'-由 popstate 事件触发。
   *
   * * 'hashchange'--Triggered by a hashchange event.
   *
   *   'hashchange' - 由 hashchange 事件触发。
   */
  trigger: 'imperative'|'popstate'|'hashchange';
  /**
   * Options that controlled the strategy used for this navigation.
   * See `NavigationExtras`.
   *
   * 本选项控制用于此导航的策略。请参阅 `NavigationExtras` 。
   *
   */
  extras: NavigationExtras;
  /**
   * The previously successful `Navigation` object. Only one previous navigation
   * is available, therefore this previous `Navigation` object has a `null` value
   * for its own `previousNavigation`.
   *
   * 先前成功的 `Navigation` 对象。只有一个先前的导航可用，因此该先前 `Navigation` 对象自己的
   * `previousNavigation` 值为 `null`。
   *
   */
  previousNavigation: Navigation|null;
}

export interface NavigationTransition {
  id: number;
  targetPageId: number;
  currentUrlTree: UrlTree;
  currentRawUrl: UrlTree;
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
 * @internal
 */
export type RouterHook = (snapshot: RouterStateSnapshot, runExtras: {
  appliedUrlTree: UrlTree,
  rawUrlTree: UrlTree,
  skipLocationChange: boolean,
  replaceUrl: boolean,
  navigationId: number
}) => Observable<void>;

/**
 * @internal
 */
function defaultRouterHook(snapshot: RouterStateSnapshot, runExtras: {
  appliedUrlTree: UrlTree,
  rawUrlTree: UrlTree,
  skipLocationChange: boolean,
  replaceUrl: boolean,
  navigationId: number
}): Observable<void> {
  return of(null) as any;
}

/**
 * The equivalent `IsActiveMatchOptions` options for `Router.isActive` is called with `true`
 * (exact = true).
 *
 * `Router.isActive` 的等效 `IsActiveMatchOptions` 选项是使用 `true` (exact = true) 调用的。
 *
 */
export const exactMatchOptions: IsActiveMatchOptions = {
  paths: 'exact',
  fragment: 'ignored',
  matrixParams: 'ignored',
  queryParams: 'exact'
};

/**
 * The equivalent `IsActiveMatchOptions` options for `Router.isActive` is called with `false`
 * (exact = false).
 *
 * `Router.isActive` 的等效 `IsActiveMatchOptions` 选项使用 `false` (exact = false) 调用。
 *
 */
export const subsetMatchOptions: IsActiveMatchOptions = {
  paths: 'subset',
  fragment: 'ignored',
  matrixParams: 'ignored',
  queryParams: 'subset'
};

/**
 * @description
 *
 * A service that provides navigation among views and URL manipulation capabilities.
 *
 * 一个提供导航和操纵 URL 能力的 NgModule。
 * @see `Route`.
 *
 * `Route` 。
 *
 * @see [Routing and Navigation Guide](guide/router).
 *
 * [路由与导航](guide/router)。
 * @ngModule RouterModule
 * @publicApi
 */
@Injectable()
export class Router {
  /**
   * Represents the activated `UrlTree` that the `Router` is configured to handle (through
   * `UrlHandlingStrategy`). That is, after we find the route config tree that we're going to
   * activate, run guards, and are just about to activate the route, we set the currentUrlTree.
   *
   * 表示 `Router` 配置为处理的激活的 `UrlTree` （通过 `UrlHandlingStrategy`
   * ）。也就是说，在我们找到要激活的路由配置树、运行警卫并即将激活路由之后，我们设置 currentUrlTree
   * 。
   *
   * This should match the `browserUrlTree` when a navigation succeeds. If the
   * `UrlHandlingStrategy.shouldProcessUrl` is `false`, only the `browserUrlTree` is updated.
   *
   * 导航成功时，这应该与 `browserUrlTree` 匹配。如果 `UrlHandlingStrategy.shouldProcessUrl` 为
   * `false` ，则仅更新 `browserUrlTree` 。
   *
   */
  private currentUrlTree: UrlTree;
  /**
   * Meant to represent the entire browser url after a successful navigation. In the life of a
   * navigation transition:
   * 1\. The rawUrl represents the full URL that's being navigated to
   * 2\. We apply redirects, which might only apply to _part_ of the URL (due to
   * `UrlHandlingStrategy`).
   * 3\. Right before activation (because we assume activation will succeed), we update the
   * rawUrlTree to be a combination of the urlAfterRedirects (again, this might only apply to part
   * of the initial url) and the rawUrl of the transition (which was the original navigation url in
   * its full form).
   *
   * 旨在表示成功导航后的整个浏览器 url。在导航转换的生命周期中： 1.rawUrl 表示被导航到的完整
   * URL 2.我们应用重定向，这可能仅适用于 URL 的 _ 一部分 _（由于 `UrlHandlingStrategy`
   * ）。 3.在激活之前（因为我们假设激活会成功），我们将 rawUrlTree 更新为 urlAfterRedirects
   * （同样，这可能仅适用于初始 url 的一部分）和转换的 rawUrl （这是原始的完整形式的导航 url）。
   *
   */
  private rawUrlTree: UrlTree;
  /**
   * Meant to represent the part of the browser url that the `Router` is set up to handle (via the
   * `UrlHandlingStrategy`). This value is updated immediately after the browser url is updated (or
   * the browser url update is skipped via `skipLocationChange`). With that, note that
   * `browserUrlTree` _may not_ reflect the actual browser URL for two reasons:
   *
   * 旨在表示 `Router` 设置要处理的浏览器 url 部分（通过 `UrlHandlingStrategy`
   * ）。此值会在更新浏览器 url 后立即更新（或通过 `skipLocationChange` 跳过浏览器 url
   * 更新）。因此，请注意 `browserUrlTree`_ 可能无法 _ 反映实际的浏览器 URL，原因有两个：
   *
   * 1. `UrlHandlingStrategy` only handles part of the URL
   *
   *    `UrlHandlingStrategy` 仅处理部分 URL
   *
   * 2. `skipLocationChange` does not update the browser url.
   *
   *    `skipLocationChange` 不会更新浏览器 url。
   *
   * So to reiterate, `browserUrlTree` only represents the Router's internal understanding of the
   * current route, either before guards with `urlUpdateStrategy === 'eager'` or right before
   * activation with `'deferred'`.
   *
   * 因此，重申一下， `browserUrlTree` 仅代表路由器对当前路由的内部理解，无论是在使用
   * `urlUpdateStrategy === 'eager'` 保护之前或使用 `'deferred'` 激活之前。
   *
   * This should match the `currentUrlTree` when the navigation succeeds.
   *
   * 导航成功时，这应该与 `currentUrlTree` 匹配。
   *
   */
  private browserUrlTree: UrlTree;
  private readonly transitions: BehaviorSubject<NavigationTransition>;
  private navigations: Observable<NavigationTransition>;
  private lastSuccessfulNavigation: Navigation|null = null;
  private currentNavigation: Navigation|null = null;
  private disposed = false;

  private locationSubscription?: SubscriptionLike;
  private navigationId: number = 0;

  /**
   * The id of the currently active page in the router.
   * Updated to the transition's target id on a successful navigation.
   *
   * 路由器中当前活动页面的 id。成功导航后更新为转换的目标 ID。
   *
   * This is used to track what page the router last activated. When an attempted navigation fails,
   * the router can then use this to compute how to restore the state back to the previously active
   * page.
   *
   * 这用于跟踪路由器最后激活的页面。当尝试的导航失败时，路由器可以用它来计算如何将状态恢复到以前的活动页面。
   *
   */
  private currentPageId: number = 0;
  /**
   * The ɵrouterPageId of whatever page is currently active in the browser history. This is
   * important for computing the target page id for new navigations because we need to ensure each
   * page id in the browser history is 1 more than the previous entry.
   *
   * 浏览器历史记录中当前处于活动状态的任何页面的 ɵrouterPageId。这对于计算新导航的目标页面 id
   * 很重要，因为我们需要确保浏览器历史记录中的每个页面 id 都比前一个条目大 1。
   *
   */
  private get browserPageId(): number|undefined {
    return (this.location.getState() as RestoredState | null)?.ɵrouterPageId;
  }
  private configLoader: RouterConfigLoader;
  private ngModule: NgModuleRef<any>;
  private console: Console;
  private isNgZoneEnabled: boolean = false;

  /**
   * An event stream for routing events in this NgModule.
   *
   * 用于表示此 NgModule 中路由事件的事件流。
   *
   */
  public readonly events: Observable<Event> = new Subject<Event>();
  /**
   * The current state of routing in this NgModule.
   *
   * 此 NgModule 中路由的当前状态。
   *
   */
  public readonly routerState: RouterState;

  /**
   * A handler for navigation errors in this NgModule.
   *
   * 本模块中的导航错误处理器。
   *
   */
  errorHandler: ErrorHandler = defaultErrorHandler;

  /**
   * A handler for errors thrown by `Router.parseUrl(url)`
   * when `url` contains an invalid character.
   * The most common case is a `%` sign
   * that's not encoded and is not part of a percent encoded sequence.
   *
   * uri 格式无效错误的处理器，在 `Router.parseUrl(url)` 由于 `url` 包含无效字符而报错时调用。
   * 最常见的情况可能是 `%` 本身既没有被编码，又不是正常 `%` 编码序列的一部分。
   */
  malformedUriErrorHandler:
      (error: URIError, urlSerializer: UrlSerializer,
       url: string) => UrlTree = defaultMalformedUriErrorHandler;

  /**
   * True if at least one navigation event has occurred,
   * false otherwise.
   *
   * 如果为 True 则表示是否发生过至少一次导航，反之为 False。
   */
  navigated: boolean = false;
  private lastSuccessfulId: number = -1;

  /**
   * Hooks that enable you to pause navigation,
   * either before or after the preactivation phase.
   * Used by `RouterModule`.
   *
   * 让你可以在预激活阶段之前或之后暂停导航的钩子。由 `RouterModule` 使用。
   *
   * @internal
   */
  hooks: {
    beforePreactivation: RouterHook,
    afterPreactivation: RouterHook
  } = {beforePreactivation: defaultRouterHook, afterPreactivation: defaultRouterHook};

  /**
   * A strategy for extracting and merging URLs.
   * Used for AngularJS to Angular migrations.
   *
   * 提取并合并 URL。在 AngularJS 向 Angular 迁移时会用到。
   */
  urlHandlingStrategy: UrlHandlingStrategy = new DefaultUrlHandlingStrategy();

  /**
   * A strategy for re-using routes.
   *
   * 复用路由的策略。
   *
   */
  routeReuseStrategy: RouteReuseStrategy = new DefaultRouteReuseStrategy();

  /**
   * A strategy for setting the title based on the `routerState`.
   *
   * 根据 `routerState` 设置标题的策略。
   *
   */
  titleStrategy?: TitleStrategy;

  /**
   * How to handle a navigation request to the current URL. One of:
   *
   * 定义当路由器收到一个导航到当前 URL 的请求时应该怎么做。可取下列值之一：
   *
   * - `'ignore'` :  The router ignores the request.
   *
   *   `'ignore'`：路由器会忽略此请求。
   *
   * - `'reload'` : The router reloads the URL. Use to implement a "refresh" feature.
   *
   *   `'reload'`：路由器会重新加载当前 URL。用来实现"刷新"功能。
   *
   * Note that this only configures whether the Route reprocesses the URL and triggers related
   * action and events like redirects, guards, and resolvers. By default, the router re-uses a
   * component instance when it re-navigates to the same component type without visiting a different
   * component first. This behavior is configured by the `RouteReuseStrategy`. In order to reload
   * routed components on same url navigation, you need to set `onSameUrlNavigation` to `'reload'`
   * _and_ provide a `RouteReuseStrategy` which returns `false` for `shouldReuseRoute`.
   *
   * 请注意，这仅配置 Route 是否重新处理 URL
   * 并触发相关的操作和事件，例如重定向、防护和解析器。默认情况下，路由器在不首先访问不同的组件的情况下重新导航到同一个组件类型时会重用组件实例。此行为由
   * `RouteReuseStrategy` 配置。为了在同一个 url 导航上重新加载路由组件，你需要将
   * `onSameUrlNavigation` 设置为 `'reload'`_ 并 _ 提供一个 `RouteReuseStrategy` ，它为
   * `shouldReuseRoute` 返回 `false` 。
   *
   */
  onSameUrlNavigation: 'reload'|'ignore' = 'ignore';

  /**
   * How to merge parameters, data, resolved data, and title from parent to child
   * routes. One of:
   *
   * 如何从父路由向子路由合并参数、数据和解析到的数据。可取下列值之一：
   *
   * - `'emptyOnly'` : Inherit parent parameters, data, and resolved data
   *   for path-less or component-less routes.
   *
   *     `'emptyOnly'`：让无路径或无组件的路由继承父级的参数、数据和解析到的数据。
   *
   * - `'always'` : Inherit parent parameters, data, and resolved data
   *   for all child routes.
   *
   *     `'always'`：让所有子路由都继承父级的参数、数据和解析到的数据。
   *
   */
  paramsInheritanceStrategy: 'emptyOnly'|'always' = 'emptyOnly';

  /**
   * Determines when the router updates the browser URL.
   * By default (`"deferred"`), updates the browser URL after navigation has finished.
   * Set to `'eager'` to update the browser URL at the beginning of navigation.
   * You can choose to update early so that, if navigation fails,
   * you can show an error message with the URL that failed.
   *
   * 确定路由器何时更新浏览器 URL。默认情况下（`"deferred"`）在导航完成后更新浏览器 URL。设置为
   * `'eager'` 可以在浏览开始时更新浏览器
   * URL。你可以选择早期更新，这样，如果导航失败，则可以显示带有失败 URL 的错误消息。
   *
   */
  urlUpdateStrategy: 'deferred'|'eager' = 'deferred';

  /**
   * Enables a bug fix that corrects relative link resolution in components with empty paths.
   *
   * 启用错误修复功能，以更正带空路径的组件中的相对链接。
   *
   * @see `RouterModule`
   *
   * @deprecated
   */
  relativeLinkResolution: 'legacy'|'corrected' = 'corrected';

  /**
   * Configures how the Router attempts to restore state when a navigation is cancelled.
   *
   * 配置在取消导航时路由器如何尝试恢复状态。
   *
   * 'replace' - Always uses `location.replaceState` to set the browser state to the state of the
   * router before the navigation started. This means that if the URL of the browser is updated
   * _before_ the navigation is canceled, the Router will simply replace the item in history rather
   * than trying to restore to the previous location in the session history. This happens most
   * frequently with `urlUpdateStrategy: 'eager'` and navigations with the browser back/forward
   * buttons.
   *
   * 'replace' - 始终使用 `location.replaceState`
   * 将浏览器状态设置为导航开始之前的路由器状态。这意味着，如果在取消导航 _ 之前 _ 更新了浏览器的
   * URL，则路由器将简单地替换历史记录中的条目，而不是尝试恢复到会话历史记录中的前一个位置。这种情况最常见的情况是
   * `urlUpdateStrategy: 'eager'` 和使用浏览器后退/前进按钮进行导航。
   *
   * 'computed' - Will attempt to return to the same index in the session history that corresponds
   * to the Angular route when the navigation gets cancelled. For example, if the browser back
   * button is clicked and the navigation is cancelled, the Router will trigger a forward navigation
   * and vice versa.
   *
   * “comped” - 当导航被取消时，将尝试返回会话历史记录中与 Angular
   * 路由对应的同一个索引。例如，如果单击浏览器后退按钮并取消导航，则路由器将触发向前导航，反之亦然。
   *
   * Note: the 'computed' option is incompatible with any `UrlHandlingStrategy` which only
   * handles a portion of the URL because the history restoration navigates to the previous place in
   * the browser history rather than simply resetting a portion of the URL.
   *
   * 注意： ' `UrlHandlingStrategy` ' 选项与任何仅处理一部分 URL 的 UrlHandlingStrategy
   * 不兼容，因为历史恢复会导航到浏览器历史记录中的上一个位置，而不是简单地重置 URL 的一部分。
   *
   * The default value is `replace`.
   *
   * 默认值是 `replace` 。
   *
   */
  canceledNavigationResolution: 'replace'|'computed' = 'replace';

  /**
   * Creates the router service.
   *
   * 创建路由器服务。
   */
  // TODO: vsavkin make internal after the final is out.
  constructor(
      private rootComponentType: Type<any>|null, private urlSerializer: UrlSerializer,
      private rootContexts: ChildrenOutletContexts, private location: Location, injector: Injector,
      compiler: Compiler, public config: Routes) {
    const onLoadStart = (r: Route) => this.triggerEvent(new RouteConfigLoadStart(r));
    const onLoadEnd = (r: Route) => this.triggerEvent(new RouteConfigLoadEnd(r));
    this.configLoader = injector.get(RouterConfigLoader);
    this.configLoader.onLoadEndListener = onLoadEnd;
    this.configLoader.onLoadStartListener = onLoadStart;

    this.ngModule = injector.get(NgModuleRef);
    this.console = injector.get(Console);
    const ngZone = injector.get(NgZone);
    this.isNgZoneEnabled = ngZone instanceof NgZone && NgZone.isInAngularZone();

    this.resetConfig(config);
    this.currentUrlTree = createEmptyUrlTree();
    this.rawUrlTree = this.currentUrlTree;
    this.browserUrlTree = this.currentUrlTree;

    this.routerState = createEmptyState(this.currentUrlTree, this.rootComponentType);

    this.transitions = new BehaviorSubject<NavigationTransition>({
      id: 0,
      targetPageId: 0,
      currentUrlTree: this.currentUrlTree,
      currentRawUrl: this.currentUrlTree,
      extractedUrl: this.urlHandlingStrategy.extract(this.currentUrlTree),
      urlAfterRedirects: this.urlHandlingStrategy.extract(this.currentUrlTree),
      rawUrl: this.currentUrlTree,
      extras: {},
      resolve: null,
      reject: null,
      promise: Promise.resolve(true),
      source: 'imperative',
      restoredState: null,
      currentSnapshot: this.routerState.snapshot,
      targetSnapshot: null,
      currentRouterState: this.routerState,
      targetRouterState: null,
      guards: {canActivateChecks: [], canDeactivateChecks: []},
      guardsResult: null,
    });
    this.navigations = this.setupNavigations(this.transitions);

    this.processNavigations();
  }

  private setupNavigations(transitions: Observable<NavigationTransition>):
      Observable<NavigationTransition> {
    const eventsSubject = (this.events as Subject<Event>);
    return transitions.pipe(
               filter(t => t.id !== 0),

               // Extract URL
               map(t =>
                       ({...t, extractedUrl: this.urlHandlingStrategy.extract(t.rawUrl)} as
                        NavigationTransition)),

               // Using switchMap so we cancel executing navigations when a new one comes in
               switchMap(t => {
                 let completed = false;
                 let errored = false;
                 return of(t).pipe(
                     // Store the Navigation object
                     tap(t => {
                       this.currentNavigation = {
                         id: t.id,
                         initialUrl: t.rawUrl,
                         extractedUrl: t.extractedUrl,
                         trigger: t.source,
                         extras: t.extras,
                         previousNavigation: this.lastSuccessfulNavigation ?
                             {...this.lastSuccessfulNavigation, previousNavigation: null} :
                             null
                       };
                     }),
                     switchMap(t => {
                       const browserUrlTree = this.browserUrlTree.toString();
                       const urlTransition = !this.navigated ||
                           t.extractedUrl.toString() !== browserUrlTree ||
                           // Navigations which succeed or ones which fail and are cleaned up
                           // correctly should result in `browserUrlTree` and `currentUrlTree`
                           // matching. If this is not the case, assume something went wrong and try
                           // processing the URL again.
                           browserUrlTree !== this.currentUrlTree.toString();
                       const processCurrentUrl =
                           (this.onSameUrlNavigation === 'reload' ? true : urlTransition) &&
                           this.urlHandlingStrategy.shouldProcessUrl(t.rawUrl);


                       if (processCurrentUrl) {
                         // If the source of the navigation is from a browser event, the URL is
                         // already updated. We already need to sync the internal state.
                         if (isBrowserTriggeredNavigation(t.source)) {
                           this.browserUrlTree = t.extractedUrl;
                         }
                         return of(t).pipe(
                             // Fire NavigationStart event
                             switchMap(t => {
                               const transition = this.transitions.getValue();
                               eventsSubject.next(new NavigationStart(
                                   t.id, this.serializeUrl(t.extractedUrl), t.source,
                                   t.restoredState));
                               if (transition !== this.transitions.getValue()) {
                                 return EMPTY;
                               }

                               // This delay is required to match old behavior that forced
                               // navigation to always be async
                               return Promise.resolve(t);
                             }),

                             // ApplyRedirects
                             applyRedirects(
                                 this.ngModule.injector, this.configLoader, this.urlSerializer,
                                 this.config),

                             // Update the currentNavigation
                             // `urlAfterRedirects` is guaranteed to be set after this point
                             tap(t => {
                               this.currentNavigation = {
                                 ...this.currentNavigation!,
                                 finalUrl: t.urlAfterRedirects
                               };
                             }),

                             // Recognize
                             recognize(
                                 this.rootComponentType, this.config,
                                 (url) => this.serializeUrl(url), this.paramsInheritanceStrategy,
                                 this.relativeLinkResolution),

                             // Update URL if in `eager` update mode
                             tap(t => {
                               if (this.urlUpdateStrategy === 'eager') {
                                 if (!t.extras.skipLocationChange) {
                                   const rawUrl = this.urlHandlingStrategy.merge(
                                       t.urlAfterRedirects!, t.rawUrl);
                                   this.setBrowserUrl(rawUrl, t);
                                 }
                                 this.browserUrlTree = t.urlAfterRedirects!;
                               }

                               // Fire RoutesRecognized
                               const routesRecognized = new RoutesRecognized(
                                   t.id, this.serializeUrl(t.extractedUrl),
                                   this.serializeUrl(t.urlAfterRedirects!), t.targetSnapshot!);
                               eventsSubject.next(routesRecognized);
                             }));
                       } else {
                         const processPreviousUrl = urlTransition && this.rawUrlTree &&
                             this.urlHandlingStrategy.shouldProcessUrl(this.rawUrlTree);
                         /* When the current URL shouldn't be processed, but the previous one was,
                          * we handle this "error condition" by navigating to the previously
                          * successful URL, but leaving the URL intact.*/
                         if (processPreviousUrl) {
                           const {id, extractedUrl, source, restoredState, extras} = t;
                           const navStart = new NavigationStart(
                               id, this.serializeUrl(extractedUrl), source, restoredState);
                           eventsSubject.next(navStart);
                           const targetSnapshot =
                               createEmptyState(extractedUrl, this.rootComponentType).snapshot;

                           return of({
                             ...t,
                             targetSnapshot,
                             urlAfterRedirects: extractedUrl,
                             extras: {...extras, skipLocationChange: false, replaceUrl: false},
                           });
                         } else {
                           /* When neither the current or previous URL can be processed, do nothing
                            * other than update router's internal reference to the current "settled"
                            * URL. This way the next navigation will be coming from the current URL
                            * in the browser.
                            */
                           this.rawUrlTree = t.rawUrl;
                           t.resolve(null);
                           return EMPTY;
                         }
                       }
                     }),

                     // Before Preactivation
                     switchTap(t => {
                       const {
                         targetSnapshot,
                         id: navigationId,
                         extractedUrl: appliedUrlTree,
                         rawUrl: rawUrlTree,
                         extras: {skipLocationChange, replaceUrl}
                       } = t;
                       return this.hooks.beforePreactivation(targetSnapshot!, {
                         navigationId,
                         appliedUrlTree,
                         rawUrlTree,
                         skipLocationChange: !!skipLocationChange,
                         replaceUrl: !!replaceUrl,
                       });
                     }),

                     // --- GUARDS ---
                     tap(t => {
                       const guardsStart = new GuardsCheckStart(
                           t.id, this.serializeUrl(t.extractedUrl),
                           this.serializeUrl(t.urlAfterRedirects!), t.targetSnapshot!);
                       this.triggerEvent(guardsStart);
                     }),

                     map(t => ({
                           ...t,
                           guards: getAllRouteGuards(
                               t.targetSnapshot!, t.currentSnapshot, this.rootContexts)
                         })),

                     checkGuards(this.ngModule.injector, (evt: Event) => this.triggerEvent(evt)),
                     tap(t => {
                       if (isUrlTree(t.guardsResult)) {
                         const error: Error&{url?: UrlTree} = navigationCancelingError(
                             `Redirecting to "${this.serializeUrl(t.guardsResult)}"`);
                         error.url = t.guardsResult;
                         throw error;
                       }

                       const guardsEnd = new GuardsCheckEnd(
                           t.id, this.serializeUrl(t.extractedUrl),
                           this.serializeUrl(t.urlAfterRedirects!), t.targetSnapshot!,
                           !!t.guardsResult);
                       this.triggerEvent(guardsEnd);
                     }),

                     filter(t => {
                       if (!t.guardsResult) {
                         this.restoreHistory(t);
                         this.cancelNavigationTransition(t, '');
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
                                   t.id, this.serializeUrl(t.extractedUrl),
                                   this.serializeUrl(t.urlAfterRedirects!), t.targetSnapshot!);
                               this.triggerEvent(resolveStart);
                             }),
                             switchMap(t => {
                               let dataResolved = false;
                               return of(t).pipe(
                                   resolveData(
                                       this.paramsInheritanceStrategy, this.ngModule.injector),
                                   tap({
                                     next: () => dataResolved = true,
                                     complete: () => {
                                       if (!dataResolved) {
                                         this.restoreHistory(t);
                                         this.cancelNavigationTransition(
                                             t,
                                             `At least one route resolver didn't emit any value.`);
                                       }
                                     }
                                   }),
                               );
                             }),
                             tap(t => {
                               const resolveEnd = new ResolveEnd(
                                   t.id, this.serializeUrl(t.extractedUrl),
                                   this.serializeUrl(t.urlAfterRedirects!), t.targetSnapshot!);
                               this.triggerEvent(resolveEnd);
                             }));
                       }
                       return undefined;
                     }),

                     // --- AFTER PREACTIVATION ---
                     switchTap((t: NavigationTransition) => {
                       const {
                         targetSnapshot,
                         id: navigationId,
                         extractedUrl: appliedUrlTree,
                         rawUrl: rawUrlTree,
                         extras: {skipLocationChange, replaceUrl}
                       } = t;
                       return this.hooks.afterPreactivation(targetSnapshot!, {
                         navigationId,
                         appliedUrlTree,
                         rawUrlTree,
                         skipLocationChange: !!skipLocationChange,
                         replaceUrl: !!replaceUrl,
                       });
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

                     map((t: NavigationTransition) => {
                       const targetRouterState = createRouterState(
                           this.routeReuseStrategy, t.targetSnapshot!, t.currentRouterState);
                       return ({...t, targetRouterState});
                     }),

                     /* Once here, we are about to activate syncronously. The assumption is this
                        will succeed, and user code may read from the Router service. Therefore
                        before activation, we need to update router properties storing the current
                        URL and the RouterState, as well as updated the browser URL. All this should
                        happen *before* activating. */
                     tap((t: NavigationTransition) => {
                       this.currentUrlTree = t.urlAfterRedirects!;
                       this.rawUrlTree =
                           this.urlHandlingStrategy.merge(t.urlAfterRedirects!, t.rawUrl);

                       (this as {routerState: RouterState}).routerState = t.targetRouterState!;

                       if (this.urlUpdateStrategy === 'deferred') {
                         if (!t.extras.skipLocationChange) {
                           this.setBrowserUrl(this.rawUrlTree, t);
                         }
                         this.browserUrlTree = t.urlAfterRedirects!;
                       }
                     }),

                     activateRoutes(
                         this.rootContexts, this.routeReuseStrategy,
                         (evt: Event) => this.triggerEvent(evt)),

                     tap({
                       next() {
                         completed = true;
                       },
                       complete() {
                         completed = true;
                       }
                     }),
                     finalize(() => {
                       /* When the navigation stream finishes either through error or success, we
                        * set the `completed` or `errored` flag. However, there are some situations
                        * where we could get here without either of those being set. For instance, a
                        * redirect during NavigationStart. Therefore, this is a catch-all to make
                        * sure the NavigationCancel
                        * event is fired when a navigation gets cancelled but not caught by other
                        * means. */
                       if (!completed && !errored) {
                         const cancelationReason = `Navigation ID ${
                             t.id} is not equal to the current navigation id ${this.navigationId}`;
                         this.cancelNavigationTransition(t, cancelationReason);
                       }
                       // Only clear current navigation if it is still set to the one that
                       // finalized.
                       if (this.currentNavigation?.id === t.id) {
                         this.currentNavigation = null;
                       }
                     }),
                     catchError((e) => {
                       // TODO(atscott): The NavigationTransition `t` used here does not accurately
                       // reflect the current state of the whole transition because some operations
                       // return a new object rather than modifying the one in the outermost
                       // `switchMap`.
                       //  The fix can likely be to:
                       //  1. Rename the outer `t` variable so it's not shadowed all the time and
                       //  confusing
                       //  2. Keep reassigning to the outer variable after each stage to ensure it
                       //  gets updated. Or change the implementations to not return a copy.
                       // Not changed yet because it affects existing code and would need to be
                       // tested more thoroughly.
                       errored = true;
                       /* This error type is issued during Redirect, and is handled as a
                        * cancellation rather than an error. */
                       if (isNavigationCancelingError(e)) {
                         const redirecting = isUrlTree(e.url);
                         if (!redirecting) {
                           // Set property only if we're not redirecting. If we landed on a page and
                           // redirect to `/` route, the new navigation is going to see the `/`
                           // isn't a change from the default currentUrlTree and won't navigate.
                           // This is only applicable with initial navigation, so setting
                           // `navigated` only when not redirecting resolves this scenario.
                           this.navigated = true;
                           this.restoreHistory(t, true);
                         }
                         const navCancel = new NavigationCancel(
                             t.id, this.serializeUrl(t.extractedUrl), e.message);
                         eventsSubject.next(navCancel);

                         // When redirecting, we need to delay resolving the navigation
                         // promise and push it to the redirect navigation
                         if (!redirecting) {
                           t.resolve(false);
                         } else {
                           const mergedTree =
                               this.urlHandlingStrategy.merge(e.url, this.rawUrlTree);
                           const extras = {
                             skipLocationChange: t.extras.skipLocationChange,
                             // The URL is already updated at this point if we have 'eager' URL
                             // updates or if the navigation was triggered by the browser (back
                             // button, URL bar, etc). We want to replace that item in history if
                             // the navigation is rejected.
                             replaceUrl: this.urlUpdateStrategy === 'eager' ||
                                 isBrowserTriggeredNavigation(t.source)
                           };

                           this.scheduleNavigation(
                               mergedTree, 'imperative', null, extras,
                               {resolve: t.resolve, reject: t.reject, promise: t.promise});
                         }

                         /* All other errors should reset to the router's internal URL reference to
                          * the pre-error state. */
                       } else {
                         this.restoreHistory(t, true);
                         const navError =
                             new NavigationError(t.id, this.serializeUrl(t.extractedUrl), e);
                         eventsSubject.next(navError);
                         try {
                           t.resolve(this.errorHandler(e));
                         } catch (ee) {
                           t.reject(ee);
                         }
                       }
                       return EMPTY;
                     }));
                 // TODO(jasonaden): remove cast once g3 is on updated TypeScript
               })) as any as Observable<NavigationTransition>;
  }

  /**
   * @internal
   * TODO: this should be removed once the constructor of the router made internal
   */
  resetRootComponentType(rootComponentType: Type<any>): void {
    this.rootComponentType = rootComponentType;
    // TODO: vsavkin router 4.0 should make the root component set to null
    // this will simplify the lifecycle of the router.
    this.routerState.root.component = this.rootComponentType;
  }

  private setTransition(t: Partial<NavigationTransition>): void {
    this.transitions.next({...this.transitions.value, ...t});
  }

  /**
   * Sets up the location change listener and performs the initial navigation.
   *
   * 设置位置变化监听器，并执行首次导航。
   */
  initialNavigation(): void {
    this.setUpLocationChangeListener();
    if (this.navigationId === 0) {
      this.navigateByUrl(this.location.path(true), {replaceUrl: true});
    }
  }

  /**
   * Sets up the location change listener. This listener detects navigations triggered from outside
   * the Router (the browser back/forward buttons, for example) and schedules a corresponding Router
   * navigation so that the correct events, guards, etc. are triggered.
   *
   * 设置 location
   * 更改监听器。该监听器检测从路由器外部触发的导航（比如，浏览器的后退/前进按钮），并安排相应的路由器导航，以便触发正确的事件、守卫等。
   *
   */
  setUpLocationChangeListener(): void {
    // Don't need to use Zone.wrap any more, because zone.js
    // already patch onPopState, so location change callback will
    // run into ngZone
    if (!this.locationSubscription) {
      this.locationSubscription = this.location.subscribe(event => {
        const source = event['type'] === 'popstate' ? 'popstate' : 'hashchange';
        if (source === 'popstate') {
          // The `setTimeout` was added in #12160 and is likely to support Angular/AngularJS
          // hybrid apps.
          setTimeout(() => {
            const extras: NavigationExtras = {replaceUrl: true};
            // Navigations coming from Angular router have a navigationId state
            // property. When this exists, restore the state.
            const state = event.state?.navigationId ? event.state : null;
            if (state) {
              const stateCopy = {...state} as Partial<RestoredState>;
              delete stateCopy.navigationId;
              delete stateCopy.ɵrouterPageId;
              if (Object.keys(stateCopy).length !== 0) {
                extras.state = stateCopy;
              }
            }
            const urlTree = this.parseUrl(event['url']!);
            this.scheduleNavigation(urlTree, source, state, extras);
          }, 0);
        }
      });
    }
  }

  /**
   * The current URL.
   *
   * 当前 URL
   */
  get url(): string {
    return this.serializeUrl(this.currentUrlTree);
  }

  /**
   * Returns the current `Navigation` object when the router is navigating,
   * and `null` when idle.
   *
   * 路由器正在导航时返回当前的 `Navigation` 对象，空闲时返回 `null` 。
   *
   */
  getCurrentNavigation(): Navigation|null {
    return this.currentNavigation;
  }

  /** @internal */
  triggerEvent(event: Event): void {
    (this.events as Subject<Event>).next(event);
  }

  /**
   * Resets the route configuration used for navigation and generating links.
   *
   * 重置供导航和生成链接使用的配置项。
   *
   * @param config The route array for the new configuration.
   *
   * 新配置中的路由定义数组。
   *
   * @usageNotes
   *
   * ```
   * router.resetConfig([
   *  { path: 'team/:id', component: TeamCmp, children: [
   *    { path: 'simple', component: SimpleCmp },
   *    { path: 'user/:name', component: UserCmp }
   *  ]}
   * ]);
   * ```
   */
  resetConfig(config: Routes): void {
    NG_DEV_MODE && validateConfig(config);
    this.config = config.map(standardizeConfig);
    this.navigated = false;
    this.lastSuccessfulId = -1;
  }

  /** @nodoc */
  ngOnDestroy(): void {
    this.dispose();
  }

  /**
   * Disposes of the router.
   *
   * 销毁路由器
   *
   */
  dispose(): void {
    this.transitions.complete();
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
      this.locationSubscription = undefined;
    }
    this.disposed = true;
  }

  /**
   * Appends URL segments to the current URL tree to create a new URL tree.
   *
   * 将 URL 段添加到当前 URL 树中以创建新的 URL 树。
   *
   * @param commands An array of URL fragments with which to construct the new URL tree.
   * If the path is static, can be the literal URL string. For a dynamic path, pass an array of path
   * segments, followed by the parameters for each segment.
   * The fragments are applied to the current URL tree or the one provided  in the `relativeTo`
   * property of the options object, if supplied.
   *
   * 一个 URL 段的数组，用于构造新的 URL 树。如果此路径是静态的，则可能是 URL
   * 字符串字面量。对于动态路径，可以传入一个路径段的数组，后跟每个段的参数。这些段会应用到当前 URL
   * 树上，或者在选项对象中的 `relativeTo` 属性上（如果有）。
   *
   * @param navigationExtras Options that control the navigation strategy.
   *
   * 控制导航策略的选项。
   *
   * @returns The new URL tree.
   *
   * 新的 URL Tree。
   *
   * @usageNotes
   *
   * ```
   * // create /team/33/user/11
   * router.createUrlTree(['/team', 33, 'user', 11]);
   *
   * // create /team/33;expand=true/user/11
   * router.createUrlTree(['/team', 33, {expand: true}, 'user', 11]);
   *
   * // you can collapse static segments like this (this works only with the first passed-in value):
   * router.createUrlTree(['/team/33/user', userId]);
   *
   * // If the first segment can contain slashes, and you do not want the router to split it,
   * // you can do the following:
   * router.createUrlTree([{segmentPath: '/one/two'}]);
   *
   * // create /team/33/(user/11//right:chat)
   * router.createUrlTree(['/team', 33, {outlets: {primary: 'user/11', right: 'chat'}}]);
   *
   * // remove the right secondary node
   * router.createUrlTree(['/team', 33, {outlets: {primary: 'user/11', right: null}}]);
   *
   * // assuming the current url is `/team/33/user/11` and the route points to `user/11`
   *
   * // navigate to /team/33/user/11/details
   * router.createUrlTree(['details'], {relativeTo: route});
   *
   * // navigate to /team/33/user/22
   * router.createUrlTree(['../22'], {relativeTo: route});
   *
   * // navigate to /team/44/user/22
   * router.createUrlTree(['../../team/44/user/22'], {relativeTo: route});
   *
   * Note that a value of `null` or `undefined` for `relativeTo` indicates that the
   * tree should be created relative to the root.
   * ```
   */
  createUrlTree(commands: any[], navigationExtras: UrlCreationOptions = {}): UrlTree {
    const {relativeTo, queryParams, fragment, queryParamsHandling, preserveFragment} =
        navigationExtras;
    const a = relativeTo || this.routerState.root;
    const f = preserveFragment ? this.currentUrlTree.fragment : fragment;
    let q: Params|null = null;
    switch (queryParamsHandling) {
      case 'merge':
        q = {...this.currentUrlTree.queryParams, ...queryParams};
        break;
      case 'preserve':
        q = this.currentUrlTree.queryParams;
        break;
      default:
        q = queryParams || null;
    }
    if (q !== null) {
      q = this.removeEmptyProps(q);
    }
    return createUrlTree(a, this.currentUrlTree, commands, q, f ?? null);
  }

  /**
   * Navigates to a view using an absolute route path.
   *
   * 基于所提供的 URL 进行导航，必须使用绝对路径。
   *
   * @param url An absolute path for a defined route. The function does not apply any delta to the
   *     current URL.
   *
   * 一个绝对 URL。该函数不会对当前 URL 做任何修改。
   *
   * @param extras An object containing properties that modify the navigation strategy.
   *
   * 一个包含一组属性的对象，它会修改导航策略。
   * 该函数会忽略 `NavigationExtras` 中任何可能会改变所提供的 URL 的属性
   *
   * @returns A Promise that resolves to 'true' when navigation succeeds,
   * to 'false' when navigation fails, or is rejected on error.
   *
   *   一个 Promise，当导航成功时，它会解析成 `true`；导航失败或出错时，它会解析成 `false`。
   *
   * @usageNotes
   *
   * The following calls request navigation to an absolute path.
   *
   * 以下调用要求导航到绝对路径。
   *
   * ```
   * router.navigateByUrl("/team/33/user/11");
   *
   * // Navigate without updating the URL
   * router.navigateByUrl("/team/33/user/11", { skipLocationChange: true });
   * ```
   *
   * @see [Routing and Navigation guide](guide/router)
   *
   * [路由和导航指南](guide/router)
   *
   */
  navigateByUrl(url: string|UrlTree, extras: NavigationBehaviorOptions = {
    skipLocationChange: false
  }): Promise<boolean> {
    if (typeof ngDevMode === 'undefined' ||
        ngDevMode && this.isNgZoneEnabled && !NgZone.isInAngularZone()) {
      this.console.warn(
          `Navigation triggered outside Angular zone, did you forget to call 'ngZone.run()'?`);
    }

    const urlTree = isUrlTree(url) ? url : this.parseUrl(url);
    const mergedTree = this.urlHandlingStrategy.merge(urlTree, this.rawUrlTree);

    return this.scheduleNavigation(mergedTree, 'imperative', null, extras);
  }

  /**
   * Navigate based on the provided array of commands and a starting point.
   * If no starting route is provided, the navigation is absolute.
   *
   * 基于所提供的命令数组和起点路由进行导航。
   * 如果没有指定起点路由，则从根路由开始进行绝对导航。
   *
   * @param commands An array of URL fragments with which to construct the target URL.
   * If the path is static, can be the literal URL string. For a dynamic path, pass an array of path
   * segments, followed by the parameters for each segment.
   * The fragments are applied to the current URL or the one provided  in the `relativeTo` property
   * of the options object, if supplied.
   *
   * 一个 URL 段的数组，用于构造目标 URL 树。如果此路径是静态的，则可能是 URL
   * 字符串字面量。对于动态路径，可以传入一个路径段的数组，后跟每个段的参数。这些段会应用到当前
   * URL，或者在选项对象中的 `relativeTo` 属性上（如果有）。
   *
   * @param extras An options object that determines how the URL should be constructed or
   *     interpreted.
   *
   * 一个选项对象，用于确定应如何构造或解释 URL。
   *
   * @returns A Promise that resolves to `true` when navigation succeeds, to `false` when navigation
   *     fails,
   * or is rejected on error.
   *
   * 一个 Promise，在导航成功时解析为 `true`，导航失败时解析为 `false`，或者在出错时被拒绝。
   *
   * @usageNotes
   *
   * The following calls request navigation to a dynamic route path relative to the current URL.
   *
   * 以下调用请求导航到相对于当前 URL 的动态路由路径。
   *
   * ```
   * router.navigate(['team', 33, 'user', 11], {relativeTo: route});
   *
   * // Navigate without updating the URL, overriding the default behavior
   * router.navigate(['team', 33, 'user', 11], {relativeTo: route, skipLocationChange: true});
   * ```
   *
   * @see [Routing and Navigation guide](guide/router)
   *
   * [路由和导航指南](guide/router)
   *
   */
  navigate(commands: any[], extras: NavigationExtras = {skipLocationChange: false}):
      Promise<boolean> {
    validateCommands(commands);
    return this.navigateByUrl(this.createUrlTree(commands, extras), extras);
  }

  /**
   * Serializes a `UrlTree` into a string
   *
   * 把 `UrlTree` 序列化为字符串
   */
  serializeUrl(url: UrlTree): string {
    return this.urlSerializer.serialize(url);
  }

  /**
   * Parses a string into a `UrlTree`
   *
   * 把字符串解析为 `UrlTree`
   */
  parseUrl(url: string): UrlTree {
    let urlTree: UrlTree;
    try {
      urlTree = this.urlSerializer.parse(url);
    } catch (e) {
      urlTree = this.malformedUriErrorHandler(e as URIError, this.urlSerializer, url);
    }
    return urlTree;
  }

  /**
   * Returns whether the url is activated.
   *
   * 返回 url 是否已激活。
   *
   * @deprecated
   *
   * Use `IsActiveMatchOptions` instead.
   *
   * 改用 `IsActiveMatchOptions` 。
   *
   * - The equivalent `IsActiveMatchOptions` for `true` is
   *   `{paths: 'exact', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored'}`.
   *
   *   `true` 的等效 `IsActiveMatchOptions` 是 `{paths: 'exact', queryParams: 'exact', fragment:
   * 'ignored', matrixParams: 'ignored'}` 。
   *
   * - The equivalent for `false` is
   *   `{paths: 'subset', queryParams: 'subset', fragment: 'ignored', matrixParams: 'ignored'}`.
   *
   *   `false` 的等价物是 `{paths: 'subset', queryParams: 'subset', fragment: 'ignored',
   * matrixParams: 'ignored'}` 。
   *
   */
  isActive(url: string|UrlTree, exact: boolean): boolean;
  /**
   * Returns whether the url is activated.
   *
   * 返回 url 是否已激活。
   *
   */
  isActive(url: string|UrlTree, matchOptions: IsActiveMatchOptions): boolean;
  /** @internal */
  isActive(url: string|UrlTree, matchOptions: boolean|IsActiveMatchOptions): boolean;
  isActive(url: string|UrlTree, matchOptions: boolean|IsActiveMatchOptions): boolean {
    let options: IsActiveMatchOptions;
    if (matchOptions === true) {
      options = {...exactMatchOptions};
    } else if (matchOptions === false) {
      options = {...subsetMatchOptions};
    } else {
      options = matchOptions;
    }
    if (isUrlTree(url)) {
      return containsTree(this.currentUrlTree, url, options);
    }

    const urlTree = this.parseUrl(url);
    return containsTree(this.currentUrlTree, urlTree, options);
  }

  private removeEmptyProps(params: Params): Params {
    return Object.keys(params).reduce((result: Params, key: string) => {
      const value: any = params[key];
      if (value !== null && value !== undefined) {
        result[key] = value;
      }
      return result;
    }, {});
  }

  private processNavigations(): void {
    this.navigations.subscribe(
        t => {
          this.navigated = true;
          this.lastSuccessfulId = t.id;
          this.currentPageId = t.targetPageId;
          (this.events as Subject<Event>)
              .next(new NavigationEnd(
                  t.id, this.serializeUrl(t.extractedUrl), this.serializeUrl(this.currentUrlTree)));
          this.lastSuccessfulNavigation = this.currentNavigation;
          this.titleStrategy?.updateTitle(this.routerState.snapshot);
          t.resolve(true);
        },
        e => {
          this.console.warn(`Unhandled Navigation Error: ${e}`);
        });
  }

  private scheduleNavigation(
      rawUrl: UrlTree, source: NavigationTrigger, restoredState: RestoredState|null,
      extras: NavigationExtras,
      priorPromise?: {resolve: any, reject: any, promise: Promise<boolean>}): Promise<boolean> {
    if (this.disposed) {
      return Promise.resolve(false);
    }

    let resolve: any;
    let reject: any;
    let promise: Promise<boolean>;
    if (priorPromise) {
      resolve = priorPromise.resolve;
      reject = priorPromise.reject;
      promise = priorPromise.promise;

    } else {
      promise = new Promise<boolean>((res, rej) => {
        resolve = res;
        reject = rej;
      });
    }

    const id = ++this.navigationId;
    let targetPageId: number;
    if (this.canceledNavigationResolution === 'computed') {
      const isInitialPage = this.currentPageId === 0;
      if (isInitialPage) {
        restoredState = this.location.getState() as RestoredState | null;
      }
      // If the `ɵrouterPageId` exist in the state then `targetpageId` should have the value of
      // `ɵrouterPageId`. This is the case for something like a page refresh where we assign the
      // target id to the previously set value for that page.
      if (restoredState && restoredState.ɵrouterPageId) {
        targetPageId = restoredState.ɵrouterPageId;
      } else {
        // If we're replacing the URL or doing a silent navigation, we do not want to increment the
        // page id because we aren't pushing a new entry to history.
        if (extras.replaceUrl || extras.skipLocationChange) {
          targetPageId = this.browserPageId ?? 0;
        } else {
          targetPageId = (this.browserPageId ?? 0) + 1;
        }
      }
    } else {
      // This is unused when `canceledNavigationResolution` is not computed.
      targetPageId = 0;
    }

    this.setTransition({
      id,
      targetPageId,
      source,
      restoredState,
      currentUrlTree: this.currentUrlTree,
      currentRawUrl: this.rawUrlTree,
      rawUrl,
      extras,
      resolve,
      reject,
      promise,
      currentSnapshot: this.routerState.snapshot,
      currentRouterState: this.routerState
    });

    // Make sure that the error is propagated even though `processNavigations` catch
    // handler does not rethrow
    return promise.catch((e: any) => {
      return Promise.reject(e);
    });
  }

  private setBrowserUrl(url: UrlTree, t: NavigationTransition) {
    const path = this.urlSerializer.serialize(url);
    const state = {...t.extras.state, ...this.generateNgRouterState(t.id, t.targetPageId)};
    if (this.location.isCurrentPathEqualTo(path) || !!t.extras.replaceUrl) {
      this.location.replaceState(path, '', state);
    } else {
      this.location.go(path, '', state);
    }
  }

  /**
   * Performs the necessary rollback action to restore the browser URL to the
   * state before the transition.
   *
   * 执行必要的回滚操作以将浏览器 URL 恢复到转换之前的状态。
   *
   */
  private restoreHistory(t: NavigationTransition, restoringFromCaughtError = false) {
    if (this.canceledNavigationResolution === 'computed') {
      const targetPagePosition = this.currentPageId - t.targetPageId;
      // The navigator change the location before triggered the browser event,
      // so we need to go back to the current url if the navigation is canceled.
      // Also, when navigation gets cancelled while using url update strategy eager, then we need to
      // go back. Because, when `urlUpdateSrategy` is `eager`; `setBrowserUrl` method is called
      // before any verification.
      const browserUrlUpdateOccurred =
          (t.source === 'popstate' || this.urlUpdateStrategy === 'eager' ||
           this.currentUrlTree === this.currentNavigation?.finalUrl);
      if (browserUrlUpdateOccurred && targetPagePosition !== 0) {
        this.location.historyGo(targetPagePosition);
      } else if (
          this.currentUrlTree === this.currentNavigation?.finalUrl && targetPagePosition === 0) {
        // We got to the activation stage (where currentUrlTree is set to the navigation's
        // finalUrl), but we weren't moving anywhere in history (skipLocationChange or replaceUrl).
        // We still need to reset the router state back to what it was when the navigation started.
        this.resetState(t);
        // TODO(atscott): resetting the `browserUrlTree` should really be done in `resetState`.
        // Investigate if this can be done by running TGP.
        this.browserUrlTree = t.currentUrlTree;
        this.resetUrlToCurrentUrlTree();
      } else {
        // The browser URL and router state was not updated before the navigation cancelled so
        // there's no restoration needed.
      }
    } else if (this.canceledNavigationResolution === 'replace') {
      // TODO(atscott): It seems like we should _always_ reset the state here. It would be a no-op
      // for `deferred` navigations that haven't change the internal state yet because guards
      // reject. For 'eager' navigations, it seems like we also really should reset the state
      // because the navigation was cancelled. Investigate if this can be done by running TGP.
      if (restoringFromCaughtError) {
        this.resetState(t);
      }
      this.resetUrlToCurrentUrlTree();
    }
  }

  private resetState(t: NavigationTransition): void {
    (this as {routerState: RouterState}).routerState = t.currentRouterState;
    this.currentUrlTree = t.currentUrlTree;
    // Note here that we use the urlHandlingStrategy to get the reset `rawUrlTree` because it may be
    // configured to handle only part of the navigation URL. This means we would only want to reset
    // the part of the navigation handled by the Angular router rather than the whole URL. In
    // addition, the URLHandlingStrategy may be configured to specifically preserve parts of the URL
    // when merging, such as the query params so they are not lost on a refresh.
    this.rawUrlTree = this.urlHandlingStrategy.merge(this.currentUrlTree, t.rawUrl);
  }

  private resetUrlToCurrentUrlTree(): void {
    this.location.replaceState(
        this.urlSerializer.serialize(this.rawUrlTree), '',
        this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId));
  }

  private cancelNavigationTransition(t: NavigationTransition, reason: string) {
    const navCancel = new NavigationCancel(t.id, this.serializeUrl(t.extractedUrl), reason);
    this.triggerEvent(navCancel);
    t.resolve(false);
  }

  private generateNgRouterState(navigationId: number, routerPageId?: number) {
    if (this.canceledNavigationResolution === 'computed') {
      return {navigationId, ɵrouterPageId: routerPageId};
    }
    return {navigationId};
  }
}

function validateCommands(commands: string[]): void {
  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i];
    if (cmd == null) {
      throw new Error(`The requested path contains ${cmd} segment at index ${i}`);
    }
  }
}

function isBrowserTriggeredNavigation(source: 'imperative'|'popstate'|'hashchange') {
  return source !== 'imperative';
}

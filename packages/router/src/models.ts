/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {EnvironmentInjector, ImportedNgModuleProviders, NgModuleFactory, Provider, Type} from '@angular/core';
import {Observable} from 'rxjs';

import {ActivatedRouteSnapshot, RouterStateSnapshot} from './router_state';
import {UrlSegment, UrlSegmentGroup, UrlTree} from './url_tree';


/**
 * Represents a route configuration for the Router service.
 * An array of `Route` objects, used in `Router.config` and for nested route configurations
 * in `Route.children`.
 *
 * 表示 Router 服务的路由配置。 `Route` 对象的数组，在 `Route.children` 中使用以及在 `Router.config`
 * 中用于嵌套路由配置。
 *
 * @see `Route`
 * @see `Router`
 * @see [Router configuration guide](guide/router-reference#configuration)
 *
 * [路由器配置指南](guide/router-reference#configuration)
 *
 * @publicApi
 */
export type Routes = Route[];

/**
 * Represents the result of matching URLs with a custom matching function.
 *
 * 表示使用自定义匹配函数匹配 URL 的结果。
 *
 * * `consumed` is an array of the consumed URL segments.
 *
 *   Consumer 是已 `consumed` 的 URL 段的数组。
 *
 * * `posParams` is a map of positional parameters.
 *
 *   `posParams` 是位置参数的映射表。
 *
 * @see `UrlMatcher()`
 * @publicApi
 */
export type UrlMatchResult = {
  consumed: UrlSegment[];
  posParams?: {[name: string]: UrlSegment};
};

/**
 * A function for matching a route against URLs. Implement a custom URL matcher
 * for `Route.matcher` when a combination of `path` and `pathMatch`
 * is not expressive enough. Cannot be used together with `path` and `pathMatch`.
 *
 * 将路由与 URL 匹配的函数。当 `path` 和 `pathMatch` 的组合没有足够的表现力时，为 `Route.matcher`
 * 实现自定义 URL 匹配器。不能与 `path` 和 `pathMatch` 一起使用。
 *
 * The function takes the following arguments and returns a `UrlMatchResult` object.
 *
 * 该函数接受以下参数并返回一个 `UrlMatchResult` 对象。
 *
 * * *segments* : An array of URL segments.
 *
 *   *Segments* ： URL 段的数组。
 *
 * * *group* : A segment group.
 *
 *   *group* ：一个段组。
 *
 * * *route* : The route to match against.
 *
 *   *route* ：要匹配的路由。
 *
 * The following example implementation matches HTML files.
 *
 * 以下示例实现与 HTML 文件匹配。
 *
 * ```
 * export function htmlFiles(url: UrlSegment[]) {
 *   return url.length === 1 && url[0].path.endsWith('.html') ? ({consumed: url}) : null;
 * }
 *
 * export const routes = [{ matcher: htmlFiles, component: AnyComponent }];
 * ```
 *
 * @publicApi
 */
export type UrlMatcher = (segments: UrlSegment[], group: UrlSegmentGroup, route: Route) =>
    UrlMatchResult|null;

/**
 * Represents static data associated with a particular route.
 *
 * 表示与特定路由关联的静态数据。
 *
 * @see `Route#data`
 * @publicApi
 */
export type Data = {
  [key: string|symbol]: any
};

/**
 * Represents the resolved data associated with a particular route.
 *
 * 表示与特定路由关联的解析数据。
 *
 * @see `Route#resolve`.
 *
 * `Route#resolve` 。
 *
 * @publicApi
 */
export type ResolveData = {
  [key: string|symbol]: any
};

/**
 * A function that is called to resolve a collection of lazy-loaded routes.
 * Must be an arrow function of the following form:
 * `() => import('...').then(mod => mod.MODULE)`
 * or
 * `() => import('...').then(mod => mod.ROUTES)`
 *
 * 为解析惰性加载的路由集合而调用的函数。必须是以下形式的箭头函数： `() => import('...').then(mod =>
 * mod.MODULE)` 或 `() => import('...').then(mod => mod.ROUTES)`
 *
 * For example:
 *
 * 例如：
 *
 * ```
 * [{
 *   path: 'lazy',
 *   loadChildren: () => import('./lazy-route/lazy.module').then(mod => mod.LazyModule),
 * }];
 * ```
 *
 * or
 *
 * 或
 *
 * ```
 * [{
 *   path: 'lazy',
 *   loadChildren: () => import('./lazy-route/lazy.routes').then(mod => mod.ROUTES),
 * }];
 * ```
 *
 * @see [Route.loadChildren](api/router/Route#loadChildren)
 * @publicApi
 */
export type LoadChildrenCallback = () => Type<any>|NgModuleFactory<any>|Routes|
    Observable<Type<any>|Routes>|Promise<NgModuleFactory<any>|Type<any>|Routes>;

/**
 * A function that returns a set of routes to load.
 *
 * 返回一组要加载的路由的函数。
 *
 * @see `LoadChildrenCallback`
 * @publicApi
 */
export type LoadChildren = LoadChildrenCallback;

/**
 * How to handle query parameters in a router link.
 * One of:
 *
 * 如何处理路由器链接中的查询参数。之一：
 *
 * - `merge` : Merge new with current parameters.
 *
 *   `merge` ：将新参数与当前参数合并。
 *
 * - `preserve` : Preserve current parameters.
 *
 *   `preserve` ：保留当前参数。
 *
 * @see `UrlCreationOptions#queryParamsHandling`
 * @see `RouterLink`
 * @publicApi
 */
export type QueryParamsHandling = 'merge'|'preserve'|'';

/**
 * A policy for when to run guards and resolvers on a route.
 *
 * 何时在路由上运行警卫和解析器的策略。
 *
 * @see [Route.runGuardsAndResolvers](api/router/Route#runGuardsAndResolvers)
 * @publicApi
 */
export type RunGuardsAndResolvers =
    'pathParamsChange'|'pathParamsOrQueryParamsChange'|'paramsChange'|'paramsOrQueryParamsChange'|
    'always'|((from: ActivatedRouteSnapshot, to: ActivatedRouteSnapshot) => boolean);

/**
 * A configuration object that defines a single route.
 * A set of routes are collected in a `Routes` array to define a `Router` configuration.
 * The router attempts to match segments of a given URL against each route,
 * using the configuration options defined in this object.
 *
 * 定义单个路由的配置对象。一组路由被收集在 `Routes` 数组中以定义 `Router`
 * 配置。路由器会尝试使用此对象中定义的配置选项，将给定 URL 的段与每个路由进行匹配。
 *
 * Supports static, parameterized, redirect, and wildcard routes, as well as
 * custom route data and resolve methods.
 *
 * 支持静态、参数化、重定向和通配符路由，以及自定义路由数据和解析方法。
 *
 * For detailed usage information, see the [Routing Guide](guide/router).
 *
 * 有关详细的用法信息，请参阅[路由指南](guide/router)。
 *
 * @usageNotes
 *
 * ### Simple Configuration
 *
 * ### 简单配置
 *
 * The following route specifies that when navigating to, for example,
 * `/team/11/user/bob`, the router creates the 'Team' component
 * with the 'User' child component in it.
 *
 * 以下路由指定当导航到例如 `/team/11/user/bob` 时，路由器会创建包含“User”子组件的“Team”组件。
 *
 * ```
 * [{
 *   path: 'team/:id',
 *  component: Team,
 *   children: [{
 *     path: 'user/:name',
 *     component: User
 *   }]
 * }]
 * ```
 *
 * ### Multiple Outlets
 *
 * ### 多个网点
 *
 * The following route creates sibling components with multiple outlets.
 * When navigating to `/team/11(aux:chat/jim)`, the router creates the 'Team' component next to
 * the 'Chat' component. The 'Chat' component is placed into the 'aux' outlet.
 *
 * 以下路线创建具有多个出口的同级组件。导航到 `/team/11(aux:chat/jim)`
 * 时，路由器会在“Chat”组件旁边创建“Team”组件。 “Chat” 组件被放置在 'aux' 插座中。
 *
 * ```
 * [{
 *   path: 'team/:id',
 *   component: Team
 * }, {
 *   path: 'chat/:user',
 *   component: Chat
 *   outlet: 'aux'
 * }]
 * ```
 *
 * ### Wild Cards
 *
 * ### 通配符
 *
 * The following route uses wild-card notation to specify a component
 * that is always instantiated regardless of where you navigate to.
 *
 * 以下路由使用通配符表示法来指定一个无论你导航到哪里都始终实例化的组件。
 *
 * ```
 * [{
 *   path: '**',
 *   component: WildcardComponent
 * }]
 * ```
 *
 * ### Redirects
 *
 * ### 重定向
 *
 * The following route uses the `redirectTo` property to ignore a segment of
 * a given URL when looking for a child path.
 *
 * 以下路由使用 `redirectTo` 属性在查找子路径时忽略给定 URL 的段。
 *
 * When navigating to '/team/11/legacy/user/jim', the router changes the URL segment
 * '/team/11/legacy/user/jim' to '/team/11/user/jim', and then instantiates
 * the Team component with the User child component in it.
 *
 * 当导航到“/team/11/legacy/user/jim”时，路由器将 URL
 * 段“/team/11/legacy/user/jim”更改为“/team/11/user/jim”，然后实例化包含 User 子组件的团队组件。
 *
 * ```
 * [{
 *   path: 'team/:id',
 *   component: Team,
 *   children: [{
 *     path: 'legacy/user/:name',
 *     redirectTo: 'user/:name'
 *   }, {
 *     path: 'user/:name',
 *     component: User
 *   }]
 * }]
 * ```
 *
 * The redirect path can be relative, as shown in this example, or absolute.
 * If we change the `redirectTo` value in the example to the absolute URL segment '/user/:name',
 * the result URL is also absolute, '/user/jim'.
 *
 * 重定向路径可以是相对的，如此示例所示，也可以是绝对的。如果我们将示例中的 `redirectTo`
 * 值更改为绝对 URL 段“/user/:name”，则结果 URL 也是绝对的，“/user/jim”。
 *
 * ### Empty Path
 *
 * ### 空路径
 *
 * Empty-path route configurations can be used to instantiate components that do not 'consume'
 * any URL segments.
 *
 * 空路径路由配置可用于实例化不“使用”任何 URL 段的组件。
 *
 * In the following configuration, when navigating to
 * `/team/11`, the router instantiates the 'AllUsers' component.
 *
 * 在以下配置中，导航到 `/team/11` 时，路由器会实例化 'AllUsers' 组件。
 *
 * ```
 * [{
 *   path: 'team/:id',
 *   component: Team,
 *   children: [{
 *     path: '',
 *     component: AllUsers
 *   }, {
 *     path: 'user/:name',
 *     component: User
 *   }]
 * }]
 * ```
 *
 * Empty-path routes can have children. In the following example, when navigating
 * to `/team/11/user/jim`, the router instantiates the wrapper component with
 * the user component in it.
 *
 * 空路径路由可以有子项。在以下示例中，当导航到 `/team/11/user/jim`
 * 时，路由器会实例化包含用户组件的包装器组件。
 *
 * Note that an empty path route inherits its parent's parameters and data.
 *
 * 请注意，空路径路由会继承其父级的参数和数据。
 *
 * ```
 * [{
 *   path: 'team/:id',
 *   component: Team,
 *   children: [{
 *     path: '',
 *     component: WrapperCmp,
 *     children: [{
 *       path: 'user/:name',
 *       component: User
 *     }]
 *   }]
 * }]
 * ```
 *
 * ### Matching Strategy
 *
 * ### 匹配策略
 *
 * The default path-match strategy is 'prefix', which means that the router
 * checks URL elements from the left to see if the URL matches a specified path.
 * For example, '/team/11/user' matches 'team/:id'.
 *
 * 默认的路径匹配策略是 'prefix'，这意味着路由器会从左侧检查 URL 元素以查看 URL
 * 是否与指定的路径匹配。例如，“/team/11/user”与“team/:id”匹配。
 *
 * ```
 * [{
 *   path: '',
 *   pathMatch: 'prefix', //default
 *   redirectTo: 'main'
 * }, {
 *   path: 'main',
 *   component: Main
 * }]
 * ```
 *
 * You can specify the path-match strategy 'full' to make sure that the path
 * covers the whole unconsumed URL. It is important to do this when redirecting
 * empty-path routes. Otherwise, because an empty path is a prefix of any URL,
 * the router would apply the redirect even when navigating to the redirect destination,
 * creating an endless loop.
 *
 * 你可以指定路径匹配策略 'full' 以确保路径覆盖整个未使用的
 * URL。重定向空路径路由时，这样做很重要。否则，由于空路径是任何 URL
 * 的前缀，因此路由器即使导航到重定向目标时也会应用重定向，从而创建一个无限循环。
 *
 * In the following example, supplying the 'full' `pathMatch` strategy ensures
 * that the router applies the redirect if and only if navigating to '/'.
 *
 * 在以下示例中，提供 'full' `pathMatch` 策略可确保路由器当且仅当导航到 '/' 时应用重定向。
 *
 * ```
 * [{
 *   path: '',
 *   pathMatch: 'full',
 *   redirectTo: 'main'
 * }, {
 *   path: 'main',
 *   component: Main
 * }]
 * ```
 *
 * ### Componentless Routes
 *
 * ### 无组件路由
 *
 * You can share parameters between sibling components.
 * For example, suppose that two sibling components should go next to each other,
 * and both of them require an ID parameter. You can accomplish this using a route
 * that does not specify a component at the top level.
 *
 * 你可以在同级组件之间共享参数。例如，假设两个同级组件应该彼此相邻，并且它们都需要一个 ID
 * 参数。你可以用未在顶级指定组件的路由来实现此目的。
 *
 * In the following example, 'MainChild' and 'AuxChild' are siblings.
 * When navigating to 'parent/10/(a//aux:b)', the route instantiates
 * the main child and aux child components next to each other.
 * For this to work, the application component must have the primary and aux outlets defined.
 *
 * 在以下示例中，“MainChild”和“AuxChild”是同级。当导航到 'parent/10/(a//aux:b)'
 * 时，该路由会实例化彼此相邻的主子组件和辅助子组件。为此，应用程序组件必须定义主要的出口和辅助出口。
 *
 * ```
 * [{
 *    path: 'parent/:id',
 *    children: [
 *      { path: 'a', component: MainChild },
 *      { path: 'b', component: AuxChild, outlet: 'aux' }
 *    ]
 * }]
 * ```
 *
 * The router merges the parameters, data, and resolve of the componentless
 * parent into the parameters, data, and resolve of the children.
 *
 * 路由器将无组件父级的参数、数据和解析合并为子项的参数、数据和解析。
 *
 * This is especially useful when child components are defined
 * with an empty path string, as in the following example.
 * With this configuration, navigating to '/parent/10' creates
 * the main child and aux components.
 *
 * 当使用空路径字符串定义子组件时，这特别有用，如下例所示。使用此配置，导航到 '/parent/10'
 * 会创建主子组件和 aux 组件。
 *
 * ```
 * [{
 *    path: 'parent/:id',
 *    children: [
 *      { path: '', component: MainChild },
 *      { path: '', component: AuxChild, outlet: 'aux' }
 *    ]
 * }]
 * ```
 *
 * ### Lazy Loading
 *
 * ### 惰性加载
 *
 * Lazy loading speeds up application load time by splitting the application
 * into multiple bundles and loading them on demand.
 * To use lazy loading, provide the `loadChildren` property in the `Route` object,
 * instead of the `children` property.
 *
 * 惰性加载通过将应用程序拆分为多个包并按需加载它们来加快应用程序加载时间。要使用惰性加载，请在
 * `Route` 对象中提供 `loadChildren` 属性，而不是 `children` 属性。
 *
 * Given the following example route, the router will lazy load
 * the associated module on demand using the browser native import system.
 *
 * 对于以下示例路由，路由器将使用浏览器本机导入系统按需惰性加载关联的模块。
 *
 * ```
 * [{
 *   path: 'lazy',
 *   loadChildren: () => import('./lazy-route/lazy.module').then(mod => mod.LazyModule),
 * }];
 * ```
 *
 * @publicApi
 */
export interface Route {
  /**
   * Used to define a page title for the route. This can be a static string or an `Injectable` that
   * implements `Resolve`.
   *
   * 用于定义路由的页面标题。这可以是静态字符串或实现 `Resolve` 的 `Injectable` 。
   *
   * @see `PageTitleStrategy`
   */
  title?: string|Type<Resolve<string>>;

  /**
   * The path to match against. Cannot be used together with a custom `matcher` function.
   * A URL string that uses router matching notation.
   * Can be a wild card (`**`) that matches any URL (see Usage Notes below).
   * Default is "/" (the root path).
   *
   * 要匹配的路径。不能与自定义 `matcher` 函数一起使用。使用路由器匹配表示法的 URL
   * 字符串。可以是与任何 URL 匹配的通配符 ( `**` )（请参阅下面的使用说明）。默认是“/”（根路径）。
   *
   */
  path?: string;
  /**
   * The path-matching strategy, one of 'prefix' or 'full'.
   * Default is 'prefix'.
   *
   * 路径匹配策略，是 'prefix' 或 'full' 之一。默认是“前缀”。
   *
   * By default, the router checks URL elements from the left to see if the URL
   * matches a given path and stops when there is a config match. Importantly there must still be a
   * config match for each segment of the URL. For example, '/team/11/user' matches the prefix
   * 'team/:id' if one of the route's children matches the segment 'user'. That is, the URL
   * '/team/11/user' matches the config
   * `{path: 'team/:id', children: [{path: ':user', component: User}]}`
   * but does not match when there are no children as in `{path: 'team/:id', component: Team}`.
   *
   * 默认情况下，路由器会从左侧检查 URL 元素以查看 URL
   * 是否与给定路径匹配，并在匹配上某个配置时停止。重要的是，URL
   * 的每个段仍然必须与某个配置匹配。例如，如果路由的子项（children）之一与段“user”匹配，则认为“/team/11/user”与前缀“team/:id”匹配。也就是说，URL
   * '/team/11/user' 可以匹配 `{path: 'team/:id', children: [{path: ':user', component: User}]}`
   * 配置项， 但当 `{path: 'team/:id', component: Team}` 中没有子项（children 属性）时则不匹配。
   *
   * The path-match strategy 'full' matches against the entire URL.
   * It is important to do this when redirecting empty-path routes.
   * Otherwise, because an empty path is a prefix of any URL,
   * the router would apply the redirect even when navigating
   * to the redirect destination, creating an endless loop.
   *
   * 路径匹配策略 'full' 匹配整个 URL。重定向空路径路由时，这样做很重要。否则，由于空路径是任何 URL
   * 的前缀，因此路由器即使导航到重定向目标时也会应用重定向，从而创建一个无限循环。
   *
   */
  pathMatch?: 'prefix'|'full';
  /**
   * A custom URL-matching function. Cannot be used together with `path`.
   *
   * 自定义 URL 匹配函数。不能与 `path` 一起使用。
   *
   */
  matcher?: UrlMatcher;
  /**
   * The component to instantiate when the path matches.
   * Can be empty if child routes specify components.
   *
   * 路径匹配时要实例化的组件。如果子路由指定组件，则可以为空。
   *
   */
  component?: Type<any>;

  /**
   * An object specifying a lazy-loaded component.
   *
   * 指定惰性加载组件的对象。
   *
   */
  loadComponent?: () => Type<unknown>| Observable<Type<unknown>>| Promise<Type<unknown>>;
  /**
   * Filled for routes `loadComponent` once the component is loaded.
   *
   * 加载组件后，为路由 `loadComponent` 填充。
   *
   * @internal
   */
  _loadedComponent?: Type<unknown>;

  /**
   * A URL to redirect to when the path matches.
   *
   * 路径匹配时要重定向到的 URL。
   *
   * Absolute if the URL begins with a slash (/), otherwise relative to the path URL.
   * Note that no further redirects are evaluated after an absolute redirect.
   *
   * 如果 URL 以斜杠 (/) 开头，则为绝对值，否则相对于路径
   * URL。请注意，在绝对重定向之后不会估算进一步的重定向。
   *
   * When not present, router does not redirect.
   *
   * 当不存在时，路由器不会重定向。
   *
   */
  redirectTo?: string;
  /**
   * Name of a `RouterOutlet` object where the component can be placed
   * when the path matches.
   *
   * 在路径匹配时可以放置组件的 `RouterOutlet` 对象的名称。
   *
   */
  outlet?: string;
  /**
   * An array of dependency-injection tokens used to look up `CanActivate()`
   * handlers, in order to determine if the current user is allowed to
   * activate the component. By default, any user can activate.
   *
   * 一个依赖注入标记的数组，用于查找 `CanActivate()`
   * 处理程序，以确定是否允许当前用户激活组件。默认情况下，任何用户都可以激活。
   *
   */
  canActivate?: any[];
  /**
   * An array of DI tokens used to look up `CanActivateChild()` handlers,
   * in order to determine if the current user is allowed to activate
   * a child of the component. By default, any user can activate a child.
   *
   * 用于查找 `CanActivateChild()` 处理程序的 DI
   * 标记数组，以确定是否允许当前用户激活组件的子项。默认情况下，任何用户都可以激活子项。
   *
   */
  canActivateChild?: any[];
  /**
   * An array of DI tokens used to look up `CanDeactivate()`
   * handlers, in order to determine if the current user is allowed to
   * deactivate the component. By default, any user can deactivate.
   *
   * 用于查找 `CanDeactivate()` 处理程序的 DI
   * 标记数组，以确定是否允许当前用户停用组件。默认情况下，任何用户都可以停用。
   *
   */
  canDeactivate?: any[];
  /**
   * An array of DI tokens used to look up `CanLoad()`
   * handlers, in order to determine if the current user is allowed to
   * load the component. By default, any user can load.
   *
   * 用于查找 `CanLoad()` 处理程序的 DI
   * 标记数组，以确定是否允许当前用户加载组件。默认情况下，任何用户都可以加载。
   *
   */
  canLoad?: any[];
  /**
   * Additional developer-defined data provided to the component via
   * `ActivatedRoute`. By default, no additional data is passed.
   *
   * 通过 `ActivatedRoute` 提供给组件的额外开发人员定义的数据。默认情况下，不会传递额外的数据。
   *
   */
  data?: Data;
  /**
   * A map of DI tokens used to look up data resolvers. See `Resolve`.
   *
   * 用于查找数据解析器的 DI 标记映射。请参阅 `Resolve` 。
   *
   */
  resolve?: ResolveData;
  /**
   * An array of child `Route` objects that specifies a nested route
   * configuration.
   *
   * 指定嵌套路由配置的子 `Route` 对象数组。
   *
   */
  children?: Routes;
  /**
   * An object specifying lazy-loaded child routes.
   *
   * 指定惰性加载的子路由的对象。
   *
   */
  loadChildren?: LoadChildren;

  /**
   * Defines when guards and resolvers will be run. One of
   *
   * 定义何时运行警卫和解析器。之一
   *
   * - `paramsOrQueryParamsChange` : Run when query parameters change.
   *
   *   `paramsOrQueryParamsChange` ：查询参数更改时运行。
   *
   * - `always` : Run on every execution.
   *   By default, guards and resolvers run only when the matrix
   *   parameters of the route change.
   *
   *   `always` ：在每次执行时运行。默认情况下，守卫和解析器仅在路由的矩阵参数更改时运行。
   *
   */
  runGuardsAndResolvers?: RunGuardsAndResolvers;

  /**
   * A `Provider` array to use for this `Route` and its `children`.
   *
   * 用于此 `Route` 及其 `children` 项的 `Provider` 数组。
   *
   * The `Router` will create a new `EnvironmentInjector` for this
   * `Route` and use it for this `Route` and its `children`. If this
   * route also has a `loadChildren` function which returns an `NgModuleRef`, this injector will be
   * used as the parent of the lazy loaded module.
   *
   * `Router` 将为此 `Route` 创建一个新的 `EnvironmentInjector` ，并将其用于此 `Route` 及其
   * `children` 。如果此路由还有一个返回 `NgModuleRef` 的 `loadChildren`
   * 函数，则此注入器将被用作惰性加载模块的父级。
   *
   */
  providers?: Array<Provider|ImportedNgModuleProviders>;

  /**
   * Injector created from the static route providers
   *
   * 从静态路由提供程序创建的注入器
   *
   * @internal
   */
  _injector?: EnvironmentInjector;

  /**
   * Filled for routes with `loadChildren` once the routes are loaded.
   *
   * 加载路由后，使用 `loadChildren` 填充路由。
   *
   * @internal
   */
  _loadedRoutes?: Route[];

  /**
   * Filled for routes with `loadChildren` once the routes are loaded
   *
   * 加载路由后使用 `loadChildren` 填充路由
   *
   * @internal
   */
  _loadedInjector?: EnvironmentInjector;
}

export interface LoadedRouterConfig {
  routes: Route[];
  injector: EnvironmentInjector|undefined;
}

/**
 * @description
 *
 * Interface that a class can implement to be a guard deciding if a route can be activated.
 * If all guards return `true`, navigation continues. If any guard returns `false`,
 * navigation is cancelled. If any guard returns a `UrlTree`, the current navigation
 * is cancelled and a new navigation begins to the `UrlTree` returned from the guard.
 *
 * 类可以实现的接口，作为决定是否可以激活路由的守卫。如果所有警卫都返回 `true`
 * ，则导航继续。如果任何警卫返回 `false` ，则导航被取消。如果任何警卫返回 `UrlTree`
 * ，则当前导航被取消，并开始对从警卫返回的 `UrlTree` 进行新的导航。
 *
 * The following example implements a `CanActivate` function that checks whether the
 * current user has permission to activate the requested route.
 *
 * 以下示例实现了一个 `CanActivate` 函数，该函数会检查当前用户是否有权激活所请求的路由。
 *
 * ```
 * class UserToken {}
 * class Permissions {
 *   canActivate(user: UserToken, id: string): boolean {
 *     return true;
 *   }
 * }
 *
 * @Injectable ()
 * class CanActivateTeam implements CanActivate {
 *   constructor(private permissions: Permissions, private currentUser: UserToken) {}
 *
 *   canActivate(
 *     route: ActivatedRouteSnapshot,
 *     state: RouterStateSnapshot
 *   ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
 *     return this.permissions.canActivate(this.currentUser, route.params.id);
 *   }
 * }
 * ```
 *
 * Here, the defined guard function is provided as part of the `Route` object
 * in the router configuration:
 *
 * ```
 * @NgModule ({
 *   imports: [
 *     RouterModule.forRoot([
 *       {
 *         path: 'team/:id',
 *         component: TeamComponent,
 *         canActivate: [CanActivateTeam]
 *       }
 *     ])
 *   ],
 *   providers: [CanActivateTeam, UserToken, Permissions]
 * })
 * class AppModule {}
 * ```
 *
 * You can alternatively provide an in-line function with the `canActivate` signature:
 *
 * ```
 * @NgModule ({
 *   imports: [
 *     RouterModule.forRoot([
 *       {
 *         path: 'team/:id',
 *         component: TeamComponent,
 *         canActivate: ['canActivateTeam']
 *       }
 *     ])
 *   ],
 *   providers: [
 *     {
 *       provide: 'canActivateTeam',
 *       useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => true
 *     }
 *   ]
 * })
 * class AppModule {}
 * ```
 * @publicApi
 */
export interface CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
      Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree;
}

export type CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
    Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree;

/**
 * @description
 *
 * Interface that a class can implement to be a guard deciding if a child route can be activated.
 * If all guards return `true`, navigation continues. If any guard returns `false`,
 * navigation is cancelled. If any guard returns a `UrlTree`, current navigation
 * is cancelled and a new navigation begins to the `UrlTree` returned from the guard.
 *
 * 类可以实现的接口，作为决定是否可以激活子路由的守卫。如果所有警卫都返回 `true`
 * ，则导航继续。如果任何警卫返回 `false` ，则导航被取消。如果任何警卫返回 `UrlTree`
 * ，则当前导航被取消，并开始对从警卫返回的 `UrlTree` 进行新的导航。
 *
 * The following example implements a `CanActivateChild` function that checks whether the
 * current user has permission to activate the requested child route.
 *
 * 以下示例实现了一个 `CanActivateChild` 函数，该函数会检查当前用户是否有权激活所请求的子路由。
 *
 * ```
 * class UserToken {}
 * class Permissions {
 *   canActivate(user: UserToken, id: string): boolean {
 *     return true;
 *   }
 * }
 *
 * @Injectable ()
 * class CanActivateTeam implements CanActivateChild {
 *   constructor(private permissions: Permissions, private currentUser: UserToken) {}
 *
 *   canActivateChild(
 *     route: ActivatedRouteSnapshot,
 *     state: RouterStateSnapshot
 *   ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
 *     return this.permissions.canActivate(this.currentUser, route.params.id);
 *   }
 * }
 * ```
 *
 * Here, the defined guard function is provided as part of the `Route` object
 * in the router configuration:
 *
 * ```
 * @NgModule ({
 *   imports: [
 *     RouterModule.forRoot([
 *       {
 *         path: 'root',
 *         canActivateChild: [CanActivateTeam],
 *         children: [
 *           {
 *              path: 'team/:id',
 *              component: TeamComponent
 *           }
 *         ]
 *       }
 *     ])
 *   ],
 *   providers: [CanActivateTeam, UserToken, Permissions]
 * })
 * class AppModule {}
 * ```
 *
 * You can alternatively provide an in-line function with the `canActivateChild` signature:
 *
 * ```
 * @NgModule ({
 *   imports: [
 *     RouterModule.forRoot([
 *       {
 *         path: 'root',
 *         canActivateChild: ['canActivateTeam'],
 *         children: [
 *           {
 *             path: 'team/:id',
 *             component: TeamComponent
 *           }
 *         ]
 *       }
 *     ])
 *   ],
 *   providers: [
 *     {
 *       provide: 'canActivateTeam',
 *       useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => true
 *     }
 *   ]
 * })
 * class AppModule {}
 * ```
 * @publicApi
 */
export interface CanActivateChild {
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot):
      Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree;
}

export type CanActivateChildFn = (childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
    Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree;

/**
 * @description
 *
 * Interface that a class can implement to be a guard deciding if a route can be deactivated.
 * If all guards return `true`, navigation continues. If any guard returns `false`,
 * navigation is cancelled. If any guard returns a `UrlTree`, current navigation
 * is cancelled and a new navigation begins to the `UrlTree` returned from the guard.
 *
 * 类可以实现的接口，作为决定是否可以停用路由的警卫。如果所有警卫都返回 `true`
 * ，则导航继续。如果任何警卫返回 `false` ，则导航被取消。如果任何警卫返回 `UrlTree`
 * ，则当前导航被取消，并开始对从警卫返回的 `UrlTree` 进行新的导航。
 *
 * The following example implements a `CanDeactivate` function that checks whether the
 * current user has permission to deactivate the requested route.
 *
 * 以下示例实现了一个 `CanDeactivate` 函数，该函数会检查当前用户是否有权停用所请求的路由。
 *
 * ```
 * class UserToken {}
 * class Permissions {
 *   canDeactivate(user: UserToken, id: string): boolean {
 *     return true;
 *   }
 * }
 * ```
 *
 * Here, the defined guard function is provided as part of the `Route` object
 * in the router configuration:
 *
 * 在这里，定义的保护函数作为路由器配置中 `Route` 对象的一部分提供：
 *
 * ```
 *
 * @Injectable ()
 * class CanDeactivateTeam implements CanDeactivate<TeamComponent> {
 *   constructor(private permissions: Permissions, private currentUser: UserToken) {}
 *
 *   canDeactivate(
 *     component: TeamComponent,
 *     currentRoute: ActivatedRouteSnapshot,
 *     currentState: RouterStateSnapshot,
 *     nextState: RouterStateSnapshot
 *   ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
 *     return this.permissions.canDeactivate(this.currentUser, route.params.id);
 *   }
 * }
 * @NgModule ({
 *   imports: [
 *     RouterModule.forRoot([
 *       {
 *         path: 'team/:id',
 *         component: TeamComponent,
 *         canDeactivate: [CanDeactivateTeam]
 *       }
 *     ])
 *   ],
 *   providers: [CanDeactivateTeam, UserToken, Permissions]
 * })
 * class AppModule {}
 * ```
 *
 * You can alternatively provide an in-line function with the `canDeactivate` signature:
 *
 * ```
 * @NgModule ({
 *   imports: [
 *     RouterModule.forRoot([
 *       {
 *         path: 'team/:id',
 *         component: TeamComponent,
 *         canDeactivate: ['canDeactivateTeam']
 *       }
 *     ])
 *   ],
 *   providers: [
 *     {
 *       provide: 'canDeactivateTeam',
 *       useValue: (component: TeamComponent, currentRoute: ActivatedRouteSnapshot, currentState:
 * RouterStateSnapshot, nextState: RouterStateSnapshot) => true
 *     }
 *   ]
 * })
 * class AppModule {}
 * ```
 * @publicApi
 */
export interface CanDeactivate<T> {
  canDeactivate(
      component: T, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot,
      nextState?: RouterStateSnapshot): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean
      |UrlTree;
}

export type CanDeactivateFn<T> =
    (component: T, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot,
     nextState?: RouterStateSnapshot) =>
        Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree;

/**
 * @description
 *
 * Interface that classes can implement to be a data provider.
 * A data provider class can be used with the router to resolve data during navigation.
 * The interface defines a `resolve()` method that is invoked right after the `ResolveStart`
 * router event. The router waits for the data to be resolved before the route is finally activated.
 *
 * 类可以实现为数据提供者的接口。数据提供者类可以与路由器一起使用，以在导航期间解析数据。该接口定义了一个
 * `resolve()` 方法，该方法会在 `ResolveStart`
 * 路由器事件之后立即调用。路由器会在最终激活路由之前等待数据被解析。
 *
 * The following example implements a `resolve()` method that retrieves the data
 * needed to activate the requested route.
 *
 * 以下示例实现了一个 `resolve()` 方法，该方法会检索激活所请求的路由所需的数据。
 *
 * ```
 *
 * @Injectable ({ providedIn: 'root' })
 * export class HeroResolver implements Resolve<Hero> {
 *   constructor(private service: HeroService) {}
 *
 *   resolve(
 *     route: ActivatedRouteSnapshot,
 *     state: RouterStateSnapshot
 *   ): Observable<Hero>|Promise<Hero>|Hero {
 *     return this.service.getHero(route.paramMap.get('id'));
 *   }
 * }
 * ```
 *
 * Here, the defined `resolve()` function is provided as part of the `Route` object
 * in the router configuration:
 *
 * ```
 * @NgModule ({
 *   imports: [
 *     RouterModule.forRoot([
 *       {
 *         path: 'detail/:id',
 *         component: HeroDetailComponent,
 *         resolve: {
 *           hero: HeroResolver
 *         }
 *       }
 *     ])
 *   ],
 *   exports: [RouterModule]
 * })
 * export class AppRoutingModule {}
 * ```
 *
 * You can alternatively provide an in-line function with the `resolve()` signature:
 *
 * ```
 * export const myHero: Hero = {
 *   // ...
 * }
 * @NgModule ({
 *   imports: [
 *     RouterModule.forRoot([
 *       {
 *         path: 'detail/:id',
 *         component: HeroComponent,
 *         resolve: {
 *           hero: 'heroResolver'
 *         }
 *       }
 *     ])
 *   ],
 *   providers: [
 *     {
 *       provide: 'heroResolver',
 *       useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => myHero
 *     }
 *   ]
 * })
 * export class AppModule {}
 * ```
 *
 * And you can access to your resolved data from `HeroComponent`:
 *
 * ```
 * @Component ({
 *  selector: "app-hero",
 *  templateUrl: "hero.component.html",
 * })
 * export class HeroComponent {
 *
 *  constructor(private activatedRoute: ActivatedRoute) {}
 *
 *  ngOnInit() {
 *    this.activatedRoute.data.subscribe(({ hero }) => {
 *      // do something with your resolved data ...
 *    })
 *  }
 *
 * }
 * ```
 * @usageNotes
 *
 * When both guard and resolvers are specified, the resolvers are not executed until
 * all guards have run and succeeded.
 * For example, consider the following route configuration:
 *
 * 当同时指定警卫和解析器时，在所有警卫都运行并成功之前，不会执行解析器。例如，考虑以下路由配置：
 *
 * ```
 * {
 *  path: 'base'
 *  canActivate: [BaseGuard],
 *  resolve: {data: BaseDataResolver}
 *  children: [
 *   {
 *     path: 'child',
 *     guards: [ChildGuard],
 *     component: ChildComponent,
 *     resolve: {childData: ChildDataResolver}
 *    }
 *  ]
 * }
 * ```
 *
 * The order of execution is: BaseGuard, ChildGuard, BaseDataResolver, ChildDataResolver.
 *
 * 执行顺序是： BaseGuard、ChildGuard、BaseDataResolver、ChildDataResolver 。
 *
 * @publicApi
 */
export interface Resolve<T> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T>|Promise<T>|T;
}

/**
 * @description
 *
 * Interface that a class can implement to be a guard deciding if children can be loaded.
 * If all guards return `true`, navigation continues. If any guard returns `false`,
 * navigation is cancelled. If any guard returns a `UrlTree`, current navigation
 * is cancelled and a new navigation starts to the `UrlTree` returned from the guard.
 *
 * 类可以实现的接口作为决定是否可以加载子项的守卫。如果所有警卫都返回 `true`
 * ，则导航继续。如果任何警卫返回 `false` ，则导航被取消。如果任何警卫返回 `UrlTree`
 * ，则当前导航被取消，并开始对从警卫返回的 `UrlTree` 进行新的导航。
 *
 * The following example implements a `CanLoad` function that decides whether the
 * current user has permission to load requested child routes.
 *
 * 以下示例实现了一个 `CanLoad` 函数，该函数决定当前用户是否有权加载所请求的子路由。
 *
 * ```
 * class UserToken {}
 * class Permissions {
 *   canLoadChildren(user: UserToken, id: string, segments: UrlSegment[]): boolean {
 *     return true;
 *   }
 * }
 *
 * @Injectable ()
 * class CanLoadTeamSection implements CanLoad {
 *   constructor(private permissions: Permissions, private currentUser: UserToken) {}
 *
 *   canLoad(route: Route, segments: UrlSegment[]): Observable<boolean>|Promise<boolean>|boolean {
 *     return this.permissions.canLoadChildren(this.currentUser, route, segments);
 *   }
 * }
 * ```
 *
 * Here, the defined guard function is provided as part of the `Route` object
 * in the router configuration:
 *
 * ```
 * @NgModule ({
 *   imports: [
 *     RouterModule.forRoot([
 *       {
 *         path: 'team/:id',
 *         component: TeamComponent,
 *         loadChildren: () => import('./team').then(mod => mod.TeamModule),
 *         canLoad: [CanLoadTeamSection]
 *       }
 *     ])
 *   ],
 *   providers: [CanLoadTeamSection, UserToken, Permissions]
 * })
 * class AppModule {}
 * ```
 *
 * You can alternatively provide an in-line function with the `canLoad` signature:
 *
 * ```
 * @NgModule ({
 *   imports: [
 *     RouterModule.forRoot([
 *       {
 *         path: 'team/:id',
 *         component: TeamComponent,
 *         loadChildren: () => import('./team').then(mod => mod.TeamModule),
 *         canLoad: ['canLoadTeamSection']
 *       }
 *     ])
 *   ],
 *   providers: [
 *     {
 *       provide: 'canLoadTeamSection',
 *       useValue: (route: Route, segments: UrlSegment[]) => true
 *     }
 *   ]
 * })
 * class AppModule {}
 * ```
 * @publicApi
 */
export interface CanLoad {
  canLoad(route: Route, segments: UrlSegment[]):
      Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree;
}

export type CanLoadFn = (route: Route, segments: UrlSegment[]) =>
    Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree;

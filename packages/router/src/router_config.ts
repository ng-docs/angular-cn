/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {InjectionToken} from '@angular/core';

import {UrlSerializer, UrlTree} from './url_tree';

const NG_DEV_MODE = typeof ngDevMode === 'undefined' || !!ngDevMode;

/**
 * Error handler that is invoked when a navigation error occurs.
 *
 * 发生导航错误时调用的错误处理程序。
 *
 * If the handler returns a value, the navigation Promise is resolved with this value.
 * If the handler throws an exception, the navigation Promise is rejected with
 * the exception.
 *
 * 如果处理程序返回一个值，则导航 Promise 会使用此值解析。如果处理程序抛出异常，则导航 Promise 会因异常而被拒绝。
 *
 * @publicApi
 */
export type ErrorHandler = (error: any) => any;

/**
 * Allowed values in an `ExtraOptions` object that configure
 * when the router performs the initial navigation operation.
 *
 * 在路由器执行初始导航操作时配置的 `ExtraOptions` 对象中允许的值。
 *
 * * 'enabledNonBlocking' - (default) The initial navigation starts after the
 *   root component has been created. The bootstrap is not blocked on the completion of the initial
 *   navigation.
 *
 *   'enabledNonBlocking' - （默认）初始导航在创建根组件后开始。完成初始导航后，引导程序不会被阻止。
 *
 * * 'enabledBlocking' - The initial navigation starts before the root component is created.
 *   The bootstrap is blocked until the initial navigation is complete. This value is required
 *   for [server-side rendering](guide/universal) to work.
 *
 *   'enabledBlocking' - 初始导航在创建根组件之前开始。在初始导航完成之前，引导程序被阻止。[服务器端渲染](guide/universal)需要此值。
 *
 * * 'disabled' - The initial navigation is not performed. The location listener is set up before
 *   the root component gets created. Use if there is a reason to have
 *   more control over when the router starts its initial navigation due to some complex
 *   initialization logic.
 *
 *   'disabled' - 不执行初始导航。位置侦听器是在创建根组件之前设置的。如果由于某些复杂的初始化逻辑而有理由对路由器何时开始其初始导航有更多控制权，可以使用。
 *
 * @see `forRoot()`
 * @publicApi
 */
export type InitialNavigation = 'disabled'|'enabledBlocking'|'enabledNonBlocking';

/**
 * Extra configuration options that can be used with the `withRouterConfig` function.
 *
 * 可以与 `withRouterConfig` 函数一起使用的额外配置选项。
 *
 * @publicApi
 */
export interface RouterConfigOptions {
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
   * 'replace' - 始终使用 `location.replaceState` 将浏览器状态设置为导航开始之前的路由器状态。这意味着，如果在取消导航 _ 之前 _ 更新了浏览器的 URL，则路由器将简单地替换历史记录中的条目，而不是尝试恢复到会话历史记录中的前一个位置。这种情况最常见的情况是 `urlUpdateStrategy: 'eager'` 和使用浏览器后退/前进按钮进行导航。
   *
   * 'computed' - Will attempt to return to the same index in the session history that corresponds
   * to the Angular route when the navigation gets cancelled. For example, if the browser back
   * button is clicked and the navigation is cancelled, the Router will trigger a forward navigation
   * and vice versa.
   *
   * “compute” - 当导航被取消时，将尝试返回会话历史记录中与 Angular 路由对应的同一个索引。例如，如果单击浏览器后退按钮并取消导航，则路由器将触发向前导航，反之亦然。
   *
   * Note: the 'computed' option is incompatible with any `UrlHandlingStrategy` which only
   * handles a portion of the URL because the history restoration navigates to the previous place in
   * the browser history rather than simply resetting a portion of the URL.
   *
   * 注意： ' `UrlHandlingStrategy` ' 选项与任何仅处理一部分 URL 的 UrlHandlingStrategy 不兼容，因为历史恢复会导航到浏览器历史记录中的上一个位置，而不是简单地重置 URL 的一部分。
   *
   * The default value is `replace` when not set.
   *
   * 默认值是未设置时的 `replace` 。
   *
   */
  canceledNavigationResolution?: 'replace'|'computed';

  /**
   * Define what the router should do if it receives a navigation request to the current URL.
   * Default is `ignore`, which causes the router ignores the navigation.
   * This can disable features such as a "refresh" button.
   * Use this option to configure the behavior when navigating to the
   * current URL. Default is 'ignore'.
   *
   * 定义路由器在收到对当前 URL 的导航请求时应该做什么。默认是 `ignore` ，这会导致路由器忽略导航。这可以禁用“刷新”按钮等特性。导航到当前 URL 时，可以使用此选项配置行为。默认是“忽略”。
   *
   */
  onSameUrlNavigation?: 'reload'|'ignore';

  /**
   * Defines how the router merges parameters, data, and resolved data from parent to child
   * routes. By default ('emptyOnly'), inherits parent parameters only for
   * path-less or component-less routes.
   *
   * 定义路由器如何将参数、数据和解析的数据从父路由合并到子路由。默认情况下， ('emptyOnly') 仅继承无路径或无组件路由的 parent 参数。
   *
   * Set to 'always' to enable unconditional inheritance of parent parameters.
   *
   * 设置为 'always' 以启用父参数的无条件继承。
   *
   * Note that when dealing with matrix parameters, "parent" refers to the parent `Route`
   * config which does not necessarily mean the "URL segment to the left". When the `Route` `path`
   * contains multiple segments, the matrix parameters must appear on the last segment. For example,
   * matrix parameters for `{path: 'a/b', component: MyComp}` should appear as `a/b;foo=bar` and not
   * `a;foo=bar/b`.
   *
   * 请注意，在处理矩阵参数时，“parent”是指父 `Route` 配置，并不一定意味着“左侧的 URL 段”。当 `Route` `path` 包含多个段时，矩阵参数必须出现在最后一个段上。例如， `{path: 'a/b', component: MyComp}` 矩阵参数应该显示为 `a/b;foo=bar` 而不是 `a;foo=bar/b` 。
   *
   */
  paramsInheritanceStrategy?: 'emptyOnly'|'always';

  /**
   * Defines when the router updates the browser URL. By default ('deferred'),
   * update after successful navigation.
   * Set to 'eager' if prefer to update the URL at the beginning of navigation.
   * Updating the URL early allows you to handle a failure of navigation by
   * showing an error message with the URL that failed.
   *
   * 定义路由器何时更新浏览器 URL。默认情况下（“延迟”），成功导航后更新。如果更想在导航开始时更新 URL，请设置为 “eager”。及早更新 URL 允许你通过显示带有失败的 URL 的错误消息来处理导航失败。
   *
   */
  urlUpdateStrategy?: 'deferred'|'eager';
}

/**
 * Configuration options for the scrolling feature which can be used with `withInMemoryScrolling`
 * function.
 *
 * 可与 `withInMemoryScrolling` 函数一起使用的滚动特性的配置选项。
 *
 * @publicApi
 */
export interface InMemoryScrollingOptions {
  /**
   * When set to 'enabled', scrolls to the anchor element when the URL has a fragment.
   * Anchor scrolling is disabled by default.
   *
   * 当设置为 'enabled' 时，当 URL 有片段时滚动到锚元素。默认情况下禁用锚滚动。
   *
   * Anchor scrolling does not happen on 'popstate'. Instead, we restore the position
   * that we stored or scroll to the top.
   *
   * “popstate”上不会发生锚滚动。相反，我们会恢复我们存储的位置或滚动到顶部。
   *
   */
  anchorScrolling?: 'disabled'|'enabled';

  /**
   * Configures if the scroll position needs to be restored when navigating back.
   *
   * 配置向后导航时是否需要恢复滚动位置。
   *
   * * 'disabled'- (Default) Does nothing. Scroll position is maintained on navigation.
   *
   *   “禁用”-（默认）不执行任何操作。滚动位置在导航上保持。
   *
   * * 'top'- Sets the scroll position to x = 0, y = 0 on all navigation.
   *
   *   “top”-在所有导航上将滚动位置设置为 x = 0, y = 0。
   *
   * * 'enabled'- Restores the previous scroll position on backward navigation, else sets the
   *   position to the anchor if one is provided, or sets the scroll position to [0, 0] \(forward
   *   navigation). This option will be the default in the future.
   *
   *   “enabled”- 在向后导航时恢复上一个滚动位置，否则将位置设置为锚点（如果提供了），或将滚动位置设置为[0, 0][0, 0] （向前导航）。此选项将是将来的默认值。
   *
   * You can implement custom scroll restoration behavior by adapting the enabled behavior as
   * in the following example.
   *
   * 你可以通过调整 enabled 行为来实现自定义滚动恢复行为，如下例所示。
   *
   * ```typescript
   * class AppComponent {
   *   movieData: any;
   *
   *   constructor(private router: Router, private viewportScroller: ViewportScroller,
   * changeDetectorRef: ChangeDetectorRef) {
   *   router.events.pipe(filter((event: Event): event is Scroll => event instanceof Scroll)
   *     ).subscribe(e => {
   *       fetch('http://example.com/movies.json').then(response => {
   *         this.movieData = response.json();
   *         // update the template with the data before restoring scroll
   *         changeDetectorRef.detectChanges();
   *
   *         if (e.position) {
   *           viewportScroller.scrollToPosition(e.position);
   *         }
   *       });
   *     });
   *   }
   * }
   * ```
   *
   */
  scrollPositionRestoration?: 'disabled'|'enabled'|'top';
}

/**
 * A set of configuration options for a router module, provided in the
 * `forRoot()` method.
 *
 * 路由器模块的一组配置选项，在 `forRoot()` 方法中提供。
 *
 * @see `forRoot()`
 * @publicApi
 */
export interface ExtraOptions extends InMemoryScrollingOptions, RouterConfigOptions {
  /**
   * When true, log all internal navigation events to the console.
   * Use for debugging.
   *
   * 当为 true 时，将所有内部导航事件记录到控制台。用于调试。
   *
   */
  enableTracing?: boolean;

  /**
   * When true, enable the location strategy that uses the URL fragment
   * instead of the history API.
   *
   * 当为 true 时，启用使用 URL 片段而不是历史 API 的位置策略。
   *
   */
  useHash?: boolean;

  /**
   * One of `enabled`, `enabledBlocking`, `enabledNonBlocking` or `disabled`.
   * When set to `enabled` or `enabledBlocking`, the initial navigation starts before the root
   * component is created. The bootstrap is blocked until the initial navigation is complete. This
   * value is required for [server-side rendering](guide/universal) to work. When set to
   * `enabledNonBlocking`, the initial navigation starts after the root component has been created.
   * The bootstrap is not blocked on the completion of the initial navigation. When set to
   * `disabled`, the initial navigation is not performed. The location listener is set up before the
   * root component gets created. Use if there is a reason to have more control over when the router
   * starts its initial navigation due to some complex initialization logic.
   *
   * `enabled` 、 `enabledBlocking` 、 `enabledNonBlocking` 或 `disabled` 之一。当设置为 `enabled` 或 `enabledBlocking` 时，初始导航会在创建根组件之前开始。在初始导航完成之前，引导程序被阻止。[服务器端渲染](guide/universal)需要此值。当设置为 `enabledNonBlocking` 时，初始导航会在创建根组件后开始。完成初始导航后，引导程序不会被阻止。当设置为 `disabled` 时，不会执行初始导航。位置侦听器是在创建根组件之前设置的。如果由于某些复杂的初始化逻辑而有理由对路由器何时开始其初始导航有更多控制权，可以使用。
   *
   */
  initialNavigation?: InitialNavigation;

  /**
   * A custom error handler for failed navigations.
   * If the handler returns a value, the navigation Promise is resolved with this value.
   * If the handler throws an exception, the navigation Promise is rejected with the exception.
   *
   * 失败的导航的自定义错误处理程序。如果处理程序返回一个值，则导航 Promise 会使用此值解析。如果处理程序抛出异常，则导航 Promise 会因异常而被拒绝。
   *
   */
  errorHandler?: ErrorHandler;

  /**
   * Configures a preloading strategy.
   * One of `PreloadAllModules` or `NoPreloading` (the default).
   *
   * 配置预加载策略。 `PreloadAllModules` 或 `NoPreloading` （默认值）之一。
   *
   */
  preloadingStrategy?: any;

  /**
   * Configures the scroll offset the router will use when scrolling to an element.
   *
   * 配置路由器在滚动到元素时将使用的滚动偏移量。
   *
   * When given a tuple with x and y position value,
   * the router uses that offset each time it scrolls.
   * When given a function, the router invokes the function every time
   * it restores scroll position.
   *
   * 当给定具有 x 和 y 位置值的元组时，路由器每次滚动时都会使用该偏移量。当给定一个函数时，路由器每次恢复滚动位置时都会调用该函数。
   *
   */
  scrollOffset?: [number, number]|(() => [number, number]);

  /**
   * A custom handler for malformed URI errors. The handler is invoked when `encodedURI` contains
   * invalid character sequences.
   * The default implementation is to redirect to the root URL, dropping
   * any path or parameter information. The function takes three parameters:
   *
   * 格式错误的 URI 错误的自定义处理程序。当 `encodedURI` 包含无效的字符序列时，会调用此处理程序。默认实现是重定向到根 URL，同时删除任何路径或参数信息。该函数接受三个参数：
   *
   * - `'URIError'` - Error thrown when parsing a bad URL.
   *
   *   `'URIError'` - 解析错误的 URL 时抛出的错误。
   *
   * - `'UrlSerializer'` - UrlSerializer that’s configured with the router.
   *
   *   `'UrlSerializer'` - 使用路由器配置的 UrlSerializer 。
   *
   * - `'url'` -  The malformed URL that caused the URIError
   *
   *   `'url'` - 导致 URIError 的格式错误的 URL
   *
   */
  malformedUriErrorHandler?:
      (error: URIError, urlSerializer: UrlSerializer, url: string) => UrlTree;
}

/**
 * A [DI token](guide/glossary/#di-token) for the router service.
 *
 * 路由器服务的[DI 令牌](guide/glossary/#di-token)。
 *
 * @publicApi
 */
export const ROUTER_CONFIGURATION =
    new InjectionToken<ExtraOptions>(NG_DEV_MODE ? 'router config' : '', {
      providedIn: 'root',
      factory: () => ({}),
    });

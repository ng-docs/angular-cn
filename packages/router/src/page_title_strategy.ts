/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';

import {RouteTitle as TitleKey} from './operators/resolve_data';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from './router_state';
import {PRIMARY_OUTLET} from './shared';

/**
 * Provides a strategy for setting the page title after a router navigation.
 *
 * 提供一种在路由器导航后设置页面标题的策略。
 *
 * The built-in implementation traverses the router state snapshot and finds the deepest primary
 * outlet with `title` property. Given the `Routes` below, navigating to
 * `/base/child(popup:aux)` would result in the document title being set to "child".
 *
 * 内置实现会遍历路由器状态快照，并使用 `title` 属性查找最深的主要出口。给定下面的 `Routes` ，导航到
 * `/base/child(popup:aux)` 将导致文档标题被设置为“child”。
 *
 * ```
 * [
 *   {path: 'base', title: 'base', children: [
 *     {path: 'child', title: 'child'},
 *   ],
 *   {path: 'aux', outlet: 'popup', title: 'popupTitle'}
 * ]
 * ```
 *
 * This class can be used as a base class for custom title strategies. That is, you can create your
 * own class that extends the `TitleStrategy`. Note that in the above example, the `title`
 * from the named outlet is never used. However, a custom strategy might be implemented to
 * incorporate titles in named outlets.
 *
 * 此类可以作为自定义标题策略的基类。也就是说，你可以创建自己的扩展 `TitleStrategy`
 * 的类。请注意，在上面的示例中，永远不会使用命名插座中的 `title`
 * 。但是，可以实现自定义策略以将标题合并到命名的插座中。
 *
 * @publicApi
 * @see [Page title guide](guide/router#setting-the-page-title)
 *
 * [页面标题指南](guide/router#setting-the-page-title)
 *
 */
export abstract class TitleStrategy {
  /**
   * Performs the application title update.
   *
   * 执行应用程序标题更新。
   *
   */
  abstract updateTitle(snapshot: RouterStateSnapshot): void;

  /**
   * @returns
   *
   * The `title` of the deepest primary route.
   *
   * 最深的主要路由的 `title` 。
   *
   */
  buildTitle(snapshot: RouterStateSnapshot): string|undefined {
    let pageTitle: string|undefined;
    let route: ActivatedRouteSnapshot|undefined = snapshot.root;
    while (route !== undefined) {
      pageTitle = this.getResolvedTitleForRoute(route) ?? pageTitle;
      route = route.children.find(child => child.outlet === PRIMARY_OUTLET);
    }
    return pageTitle;
  }

  /**
   * Given an `ActivatedRouteSnapshot`, returns the final value of the
   * `Route.title` property, which can either be a static string or a resolved value.
   *
   * 给定一个 `Route.title` `ActivatedRouteSnapshot` 的最终值，该值可以是静态字符串或解析的值。
   *
   */
  getResolvedTitleForRoute(snapshot: ActivatedRouteSnapshot) {
    return snapshot.data[TitleKey];
  }
}

/**
 * The default `TitleStrategy` used by the router that updates the title using the `Title` service.
 *
 * 使用 `Title` 服务更新标题的路由器使用的默认 `TitleStrategy` 。
 *
 */
@Injectable({providedIn: 'root'})
export class DefaultTitleStrategy extends TitleStrategy {
  constructor(readonly title: Title) {
    super();
  }

  /**
   * Sets the title of the browser to the given value.
   *
   * 将浏览器的标题设置为给定的值。
   *
   * @param title The `pageTitle` from the deepest primary route.
   *
   * 来自最深主要路由的 `pageTitle` 。
   *
   */
  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot);
    if (title !== undefined) {
      this.title.setTitle(title);
    }
  }
}

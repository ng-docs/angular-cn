/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {LocationStrategy} from '@angular/common';
import {Attribute, Directive, ElementRef, HostBinding, HostListener, Input, OnChanges, OnDestroy, Renderer2, SimpleChanges, ɵcoerceToBoolean as coerceToBoolean, ɵɵsanitizeUrlOrResourceUrl} from '@angular/core';
import {Subject, Subscription} from 'rxjs';

import {Event, NavigationEnd} from '../events';
import {QueryParamsHandling} from '../models';
import {Router} from '../router';
import {ActivatedRoute} from '../router_state';
import {Params} from '../shared';
import {UrlTree} from '../url_tree';


/**
 * @description
 *
 * When applied to an element in a template, makes that element a link
 * that initiates navigation to a route. Navigation opens one or more routed components
 * in one or more `<router-outlet>` locations on the page.
 *
 * 当应用于模板中的元素时，使该元素成为开始导航到某个路由的链接。导航会在页面上的 `<router-outlet>`
 * 位置上打开一个或多个路由组件。
 *
 * Given a route configuration `[{ path: 'user/:name', component: UserCmp }]`,
 * the following creates a static link to the route:
 * `<a routerLink="/user/bob">link to user component</a>`
 *
 * 给定路由配置 `[{ path: 'user/:name', component: UserCmp }]`
 * ，以下内容将创建一个到该路由的静态链接：`<a routerLink="/user/bob">link to user component</a>`
 *
 * You can use dynamic values to generate the link.
 * For a dynamic link, pass an array of path segments,
 * followed by the params for each segment.
 * For example, `['/team', teamId, 'user', userName, {details: true}]`
 * generates a link to `/team/11/user/bob;details=true`.
 *
 * 你也可以使用动态值来生成链接。对于动态链接，请传递路径段数组，然后传递每个段的参数。比如，
 * `['/team', teamId, 'user', userName, {details: true}]` 生成到 `/team/11/user/bob;details=true` 。
 *
 * Multiple static segments can be merged into one term and combined with dynamic segments.
 * For example, `['/team/11/user', userName, {details: true}]`
 *
 * 多个静态段可以合并为一个词，并与动态段组合。比如，`['/team/11/user', userName, {details: true}]`
 *
 * The input that you provide to the link is treated as a delta to the current URL.
 * For instance, suppose the current URL is `/user/(box//aux:team)`.
 * The link `<a [routerLink]="['/user/jim']">Jim</a>` creates the URL
 * `/user/(jim//aux:team)`.
 * See {@link Router#createUrlTree createUrlTree} for more information.
 *
 * 你提供给链接的输入将被视为当前 URL 的增量。比如，假设当前 URL 是 `/user/(box//aux:team)`。则链接
 * `<a [routerLink]="['/user/jim']">Jim</a>` 会创建 URL `/user/(jim//aux:team)`
 * 。欲知详情，请参见 {@link Router#createUrlTree createUrlTree}。
 * @usageNotes
 *
 * You can use absolute or relative paths in a link, set query parameters,
 * control how parameters are handled, and keep a history of navigation states.
 *
 * 你可以在链接中使用绝对或相对路径、设置查询参数、控制如何处理参数以及保留导航状态的历史记录。
 *
 * ### Relative link paths
 *
 * ### 相对链接路径
 *
 * The first segment name can be prepended with `/`, `./`, or `../`.
 *
 * 第一段名称可以用 `/`、`./` 或 `../` 开头。
 *
 * * If the first segment begins with `/`, the router looks up the route from the root of the
 *   app.
 *
 *   如果第一个片段用 `/` 开头，则路由器会从应用的根路由开始查找。
 *
 * * If the first segment begins with `./`, or doesn't begin with a slash, the router
 *   looks in the children of the current activated route.
 *
 *   如果第一个片段用 `./` 开头或者没有用斜杠开头，路由器就会从当前激活路由开始查找。
 *
 * * If the first segment begins with `../`, the router goes up one level in the route tree.
 *
 *   如果第一段以 `../` 开头，则路由器将去往路由树中的上一层。
 *
 * ### Setting and handling query params and fragments
 *
 * ### 设置和处理查询参数和片段
 *
 * The following link adds a query parameter and a fragment to the generated URL:
 *
 * 以下链接将查询参数和一个片段添加到所生成的 URL：
 *
 * ```
 * <a [routerLink]="['/user/bob']" [queryParams]="{debug: true}" fragment="education">
 *   link to user component
 * </a>
 * ```
 *
 * By default, the directive constructs the new URL using the given query parameters.
 * The example generates the link: `/user/bob?debug=true#education`.
 *
 * 默认情况下，该指令使用给定的查询参数构造新的
 * URL。该示例生成链接：`/user/bob?debug=true#education`。
 *
 * You can instruct the directive to handle query parameters differently
 * by specifying the `queryParamsHandling` option in the link.
 * Allowed values are:
 *
 * 你可以通过在链接中使用 `queryParamsHandling`
 * 选项，来指示该指令以不同的方式处理查询参数。允许的值为：
 *
 * - `'merge'`: Merge the given `queryParams` into the current query params.
 *
 *   `'merge'` ：将给定的 `queryParams` 合并到当前查询参数中。
 *
 * - `'preserve'`: Preserve the current query params.
 *
 *   `'preserve'` ：保留当前的查询参数。
 *
 * For example:
 *
 * 比如：
 *
 * ```
 * <a [routerLink]="['/user/bob']" [queryParams]="{debug: true}" queryParamsHandling="merge">
 *   link to user component
 * </a>
 * ```
 *
 * See {@link UrlCreationOptions.queryParamsHandling UrlCreationOptions#queryParamsHandling}.
 *
 * 请参阅 {@link UrlCreationOptions.queryParamsHandling UrlCreationOptions#queryParamsHandling}。
 *
 * ### Preserving navigation history
 *
 * ### 保留导航历史
 *
 * You can provide a `state` value to be persisted to the browser's
 * [`History.state` property](https://developer.mozilla.org/en-US/docs/Web/API/History#Properties).
 * For example:
 *
 * 你可以提供要持久到浏览器的 [`History.state`
 * 属性](https://developer.mozilla.org/en-US/docs/Web/API/History#Properties)中的 `state` 值。比如：
 *
 * ```
 * <a [routerLink]="['/user/bob']" [state]="{tracingId: 123}">
 *   link to user component
 * </a>
 * ```
 *
 * Use {@link Router.getCurrentNavigation() Router#getCurrentNavigation} to retrieve a saved
 * navigation-state value. For example, to capture the `tracingId` during the `NavigationStart`
 * event:
 *
 * 使用 {@link Router.getCurrentNavigation() Router#getCurrentNavigation}
 * 来检索保存的导航状态值。比如，要在 `NavigationStart` 事件中捕获 `tracingId`
 *
 * ```
 * // Get NavigationStart events
 * router.events.pipe(filter(e => e instanceof NavigationStart)).subscribe(e => {
 *   const navigation = router.getCurrentNavigation();
 *   tracingService.trace({id: navigation.extras.state.tracingId});
 * });
 * ```
 *
 * @ngModule RouterModule
 * @publicApi
 */
@Directive({
  selector: '[routerLink]',
  standalone: true,
})
export class RouterLink implements OnChanges, OnDestroy {
  private _preserveFragment = false;
  private _skipLocationChange = false;
  private _replaceUrl = false;

  /**
   * Represents an `href` attribute value applied to a host element,
   * when a host element is `<a>`. For other tags, the value is `null`.
   */
  href: string|null = null;

  /**
   * Represents the `target` attribute on a host element.
   * This is only used when the host element is an `<a>` tag.
   */
  @HostBinding('attr.target') @Input() target?: string;

  /**
   * Passed to {@link Router#createUrlTree Router#createUrlTree} as part of the
   * `UrlCreationOptions`.
   *
   * 作为 `UrlCreationOptions` 的一部分传递给 {@link Router#createUrlTree Router#createUrlTree}。
   *
   * @see {@link UrlCreationOptions#queryParams UrlCreationOptions#queryParams}
   * @see {@link Router#createUrlTree Router#createUrlTree}
   */
  @Input() queryParams?: Params|null;
  /**
   * Passed to {@link Router#createUrlTree Router#createUrlTree} as part of the
   * `UrlCreationOptions`.
   *
   * 作为 `UrlCreationOptions` 的一部分传递给 {@link Router#createUrlTree Router#createUrlTree}。
   *
   * @see {@link UrlCreationOptions#fragment UrlCreationOptions#fragment}
   * @see {@link Router#createUrlTree Router#createUrlTree}
   */
  @Input() fragment?: string;
  /**
   * Passed to {@link Router#createUrlTree Router#createUrlTree} as part of the
   * `UrlCreationOptions`.
   *
   * 作为 `UrlCreationOptions` 的一部分传递给 {@link Router#createUrlTree Router#createUrlTree}。
   *
   * @see {@link UrlCreationOptions#queryParamsHandling UrlCreationOptions#queryParamsHandling}
   * @see {@link Router#createUrlTree Router#createUrlTree}
   */
  @Input() queryParamsHandling?: QueryParamsHandling|null;
  /**
   * Passed to {@link Router#navigateByUrl Router#navigateByUrl} as part of the
   * `NavigationBehaviorOptions`.
   *
   * 作为 `NavigationBehaviorOptions` 的一部分传递给 {@link Router#navigateByUrl
   * Router#navigateByUrl}。
   *
   * @see {@link NavigationBehaviorOptions#state NavigationBehaviorOptions#state}
   * @see {@link Router#navigateByUrl Router#navigateByUrl}
   */
  @Input() state?: {[k: string]: any};
  /**
   * Passed to {@link Router#createUrlTree Router#createUrlTree} as part of the
   * `UrlCreationOptions`.
   * Specify a value here when you do not want to use the default value
   * for `routerLink`, which is the current activated route.
   * Note that a value of `undefined` here will use the `routerLink` default.
   *
   * 作为 UrlCreationOptions 的一部分传递给 {@link Router#createUrlTree Router# `UrlCreationOptions`
   * } 。当你不想使用 `routerLink` 的默认值（当前激活的路由）时，在此指定一个值。请注意，此处的
   * `undefined` 值将使用 `routerLink` 默认值。
   *
   * @see {@link UrlCreationOptions#relativeTo UrlCreationOptions#relativeTo}
   * @see {@link Router#createUrlTree Router#createUrlTree}
   */
  @Input() relativeTo?: ActivatedRoute|null;

  private commands: any[]|null = null;

  /** Whether a host element is an `<a>` tag. */
  private isAnchorElement: boolean;

  private subscription?: Subscription;

  /** @internal */
  onChanges = new Subject<RouterLink>();

  constructor(
      private router: Router, private route: ActivatedRoute,
      @Attribute('tabindex') private readonly tabIndexAttribute: string|null|undefined,
      private readonly renderer: Renderer2, private readonly el: ElementRef,
      private locationStrategy?: LocationStrategy) {
    const tagName = el.nativeElement.tagName;
    this.isAnchorElement = tagName === 'A' || tagName === 'AREA';

    if (this.isAnchorElement) {
      this.subscription = router.events.subscribe((s: Event) => {
        if (s instanceof NavigationEnd) {
          this.updateHref();
        }
      });
    } else {
      this.setTabIndexIfNotOnNativeEl('0');
    }
  }

  /**
   * Passed to {@link Router#createUrlTree Router#createUrlTree} as part of the
   * `UrlCreationOptions`.
   *
   * 作为 `UrlCreationOptions` 的一部分传递给 {@link Router#createUrlTree Router#createUrlTree}。
   *
   * @see {@link UrlCreationOptions#preserveFragment UrlCreationOptions#preserveFragment}
   * @see {@link Router#createUrlTree Router#createUrlTree}
   */
  @Input()
  set preserveFragment(preserveFragment: boolean|string|null|undefined) {
    this._preserveFragment = coerceToBoolean(preserveFragment);
  }

  get preserveFragment(): boolean {
    return this._preserveFragment;
  }

  /**
   * Passed to {@link Router#navigateByUrl Router#navigateByUrl} as part of the
   * `NavigationBehaviorOptions`.
   *
   * 作为 `NavigationBehaviorOptions` 的一部分传递给 {@link Router#navigateByUrl
   * Router#navigateByUrl}。
   *
   * @see {@link NavigationBehaviorOptions#skipLocationChange NavigationBehaviorOptions#skipLocationChange}
   * @see {@link Router#navigateByUrl Router#navigateByUrl}
   */
  @Input()
  set skipLocationChange(skipLocationChange: boolean|string|null|undefined) {
    this._skipLocationChange = coerceToBoolean(skipLocationChange);
  }

  get skipLocationChange(): boolean {
    return this._skipLocationChange;
  }

  /**
   * Passed to {@link Router#navigateByUrl Router#navigateByUrl} as part of the
   * `NavigationBehaviorOptions`.
   *
   * 作为 `NavigationBehaviorOptions` 的一部分传递给 {@link Router#navigateByUrl
   * Router#navigateByUrl}。
   *
   * @see {@link NavigationBehaviorOptions#replaceUrl NavigationBehaviorOptions#replaceUrl}
   * @see {@link Router#navigateByUrl Router#navigateByUrl}
   */
  @Input()
  set replaceUrl(replaceUrl: boolean|string|null|undefined) {
    this._replaceUrl = coerceToBoolean(replaceUrl);
  }

  get replaceUrl(): boolean {
    return this._replaceUrl;
  }

  /**
   * Modifies the tab index if there was not a tabindex attribute on the element during
   * instantiation.
   */
  private setTabIndexIfNotOnNativeEl(newTabIndex: string|null) {
    if (this.tabIndexAttribute != null /* both `null` and `undefined` */ || this.isAnchorElement) {
      return;
    }
    this.applyAttributeValue('tabindex', newTabIndex);
  }

  /** @nodoc */
  ngOnChanges(changes: SimpleChanges) {
    if (this.isAnchorElement) {
      this.updateHref();
    }
    // This is subscribed to by `RouterLinkActive` so that it knows to update when there are changes
    // to the RouterLinks it's tracking.
    this.onChanges.next(this);
  }

  /**
   * Commands to pass to {@link Router#createUrlTree Router#createUrlTree}.
   *
   * 传递给 {@link Router#createUrlTree Router#createUrlTree} 的命令。
   *
   * - **array**: commands to pass to {@link Router#createUrlTree Router#createUrlTree}.
   *
   *   **array** ：传递给 {@link Router#createUrlTree Router#createUrlTree} 的命令。
   *
   * - **string**: shorthand for array of commands with just the string, i.e. `['/route']`
   *
   *   **string**：仅包含字符串的命令数组的简写，即 `['/route']`
   *
   * - **null|undefined**: effectively disables the `routerLink`
   *
   *   **null | undefined** ：空命令数组的简写，即 `[]`
   *
   * @see {@link Router#createUrlTree Router#createUrlTree}
   */
  @Input()
  set routerLink(commands: any[]|string|null|undefined) {
    if (commands != null) {
      this.commands = Array.isArray(commands) ? commands : [commands];
      this.setTabIndexIfNotOnNativeEl('0');
    } else {
      this.commands = null;
      this.setTabIndexIfNotOnNativeEl(null);
    }
  }

  /** @nodoc */
  @HostListener(
      'click',
      ['$event.button', '$event.ctrlKey', '$event.shiftKey', '$event.altKey', '$event.metaKey'])
  onClick(button: number, ctrlKey: boolean, shiftKey: boolean, altKey: boolean, metaKey: boolean):
      boolean {
    if (this.urlTree === null) {
      return true;
    }

    if (this.isAnchorElement) {
      if (button !== 0 || ctrlKey || shiftKey || altKey || metaKey) {
        return true;
      }

      if (typeof this.target === 'string' && this.target != '_self') {
        return true;
      }
    }

    const extras = {
      skipLocationChange: this.skipLocationChange,
      replaceUrl: this.replaceUrl,
      state: this.state,
    };
    this.router.navigateByUrl(this.urlTree, extras);

    // Return `false` for `<a>` elements to prevent default action
    // and cancel the native behavior, since the navigation is handled
    // by the Router.
    return !this.isAnchorElement;
  }

  /** @nodoc */
  ngOnDestroy(): any {
    this.subscription?.unsubscribe();
  }

  private updateHref(): void {
    this.href = this.urlTree !== null && this.locationStrategy ?
        this.locationStrategy?.prepareExternalUrl(this.router.serializeUrl(this.urlTree)) :
        null;

    const sanitizedValue = this.href === null ?
        null :
        // This class represents a directive that can be added to both `<a>` elements,
        // as well as other elements. As a result, we can't define security context at
        // compile time. So the security context is deferred to runtime.
        // The `ɵɵsanitizeUrlOrResourceUrl` selects the necessary sanitizer function
        // based on the tag and property names. The logic mimics the one from
        // `packages/compiler/src/schema/dom_security_schema.ts`, which is used at compile time.
        //
        // Note: we should investigate whether we can switch to using `@HostBinding('attr.href')`
        // instead of applying a value via a renderer, after a final merge of the
        // `RouterLinkWithHref` directive.
        ɵɵsanitizeUrlOrResourceUrl(this.href, this.el.nativeElement.tagName.toLowerCase(), 'href');
    this.applyAttributeValue('href', sanitizedValue);
  }

  private applyAttributeValue(attrName: string, attrValue: string|null) {
    const renderer = this.renderer;
    const nativeElement = this.el.nativeElement;
    if (attrValue !== null) {
      renderer.setAttribute(nativeElement, attrName, attrValue);
    } else {
      renderer.removeAttribute(nativeElement, attrName);
    }
  }

  get urlTree(): UrlTree|null {
    if (this.commands === null) {
      return null;
    }
    return this.router.createUrlTree(this.commands, {
      // If the `relativeTo` input is not defined, we want to use `this.route` by default.
      // Otherwise, we should use the value provided by the user in the input.
      relativeTo: this.relativeTo !== undefined ? this.relativeTo : this.route,
      queryParams: this.queryParams,
      fragment: this.fragment,
      queryParamsHandling: this.queryParamsHandling,
      preserveFragment: this.preserveFragment,
    });
  }
}

/**
 * @description
 * An alias for the `RouterLink` directive.
 * Deprecated since v15, use `RouterLink` directive instead.
 *
 * @deprecated use `RouterLink` directive instead.
 * @publicApi
 */
export {RouterLink as RouterLinkWithHref};

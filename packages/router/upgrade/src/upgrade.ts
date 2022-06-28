/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Location} from '@angular/common';
import {APP_BOOTSTRAP_LISTENER, ComponentRef, InjectionToken} from '@angular/core';
import {Router, ɵRestoredState as RestoredState} from '@angular/router';
import {UpgradeModule} from '@angular/upgrade/static';

/**
 * Creates an initializer that sets up `ngRoute` integration
 * along with setting up the Angular router.
 *
 * 创建一个初始化程序，该初始化程序设置 `ngRoute` 集成并设置 Angular 路由器。
 *
 * @usageNotes
 *
 * <code-example language="typescript">
 * @NgModule({
 *  imports: [
 *   RouterModule.forRoot(SOME_ROUTES),
 *   UpgradeModule
 * ],
 * providers: [
 *   RouterUpgradeInitializer
 * ]
 * })
 * export class AppModule {
 *   ngDoBootstrap() {}
 * }
 * </code-example>
 *
 * @publicApi
 */
export const RouterUpgradeInitializer = {
  provide: APP_BOOTSTRAP_LISTENER,
  multi: true,
  useFactory: locationSyncBootstrapListener as (ngUpgrade: UpgradeModule) => () => void,
  deps: [UpgradeModule]
};

/**
 * @internal
 */
export function locationSyncBootstrapListener(ngUpgrade: UpgradeModule) {
  return () => {
    setUpLocationSync(ngUpgrade);
  };
}

/**
 * Sets up a location change listener to trigger `history.pushState`.
 * Works around the problem that `onPopState` does not trigger `history.pushState`.
 * Must be called *after* calling `UpgradeModule.bootstrap`.
 *
 * 设置 location 更改监听器以触发 `history.pushState`。解决 `onPopState` 不会触发
 * `history.pushState` 的问题。必须在调用 `UpgradeModule.bootstrap` *之后*调用。
 *
 * @param ngUpgrade The upgrade NgModule.
 *
 * 升级 NgModule。
 *
 * @param urlType The location strategy.
 *
 * location 策略。
 *
 * @see `HashLocationStrategy`
 * @see `PathLocationStrategy`
 *
 * @publicApi
 */
export function setUpLocationSync(ngUpgrade: UpgradeModule, urlType: 'path'|'hash' = 'path') {
  if (!ngUpgrade.$injector) {
    throw new Error(`
        RouterUpgradeInitializer can be used only after UpgradeModule.bootstrap has been called.
        Remove RouterUpgradeInitializer and call setUpLocationSync after UpgradeModule.bootstrap.
      `);
  }

  const router: Router = ngUpgrade.injector.get(Router);
  const location: Location = ngUpgrade.injector.get(Location);

  ngUpgrade.$injector.get('$rootScope')
      .$on(
          '$locationChangeStart',
          (event: any, newUrl: string, oldUrl: string,
           newState?: {[k: string]: unknown}|RestoredState,
           oldState?: {[k: string]: unknown}|RestoredState) => {
            // Navigations coming from Angular router have a navigationId state
            // property. Don't trigger Angular router navigation again if it is
            // caused by a URL change from the current Angular router
            // navigation.
            const currentNavigationId = router.getCurrentNavigation()?.id;
            const newStateNavigationId = newState?.navigationId;
            if (newStateNavigationId !== undefined &&
                newStateNavigationId === currentNavigationId) {
              return;
            }

            let url;
            if (urlType === 'path') {
              url = resolveUrl(newUrl);
            } else if (urlType === 'hash') {
              // Remove the first hash from the URL
              const hashIdx = newUrl.indexOf('#');
              url = resolveUrl(newUrl.substring(0, hashIdx) + newUrl.substring(hashIdx + 1));
            } else {
              throw 'Invalid URLType passed to setUpLocationSync: ' + urlType;
            }
            const path = location.normalize(url.pathname);
            router.navigateByUrl(path + url.search + url.hash);
          });
}

/**
 * Normalizes and parses a URL.
 *
 * 规范化和解析 URL。
 *
 * - Normalizing means that a relative URL will be resolved into an absolute URL in the context of
 *   the application document.
 *
 *   规范化意味着相对 URL 将在应用程序文档的上下文中被解析为绝对 URL。
 *
 * - Parsing means that the anchor's `protocol`, `hostname`, `port`, `pathname` and related
 *   properties are all populated to reflect the normalized URL.
 *
 *   解析意味着锚的 `protocol`、`hostname`、`port`、`pathname`
 * 和相关属性都会被填充以反映规范化的 URL。
 *
 * While this approach has wide compatibility, it doesn't work as expected on IE. On IE, normalizing
 * happens similar to other browsers, but the parsed components will not be set. (E.g. if you assign
 * `a.href = 'foo'`, then `a.protocol`, `a.host`, etc. will not be correctly updated.)
 * We work around that by performing the parsing in a 2nd step by taking a previously normalized URL
 * and assigning it again. This correctly populates all properties.
 *
 * 虽然这种方法具有广泛的兼容性，但它在 IE 上无法按预期工作。在 IE
 * 上，规范化与其他浏览器类似，但不会设置解析后的组件。（例如，如果你分配 `a.href = 'foo'` ，那么
 * `a.protocol`、`a.host` 等将不会被正确更新。）我们通过在第二步中通过获取以前规范化的 URL
 * 来执行解析来解决这个问题，并且再次分配它。这会正确填充所有属性。
 *
 * See
 * <https://github.com/angular/angular.js/blob/2c7400e7d07b0f6cec1817dab40b9250ce8ebce6/src/ng/urlUtils.js#L26-L33>
 * for more info.
 *
 * 有关更多信息，请参阅<https://github.com/angular/angular.js/blob/2c7400e7d07b0f6cec1817dab40b9250ce8ebce6/src/ng/urlUtils.js#L26-L33>
 * 。
 *
 */
let anchor: HTMLAnchorElement|undefined;
function resolveUrl(url: string): {pathname: string, search: string, hash: string} {
  if (!anchor) {
    anchor = document.createElement('a');
  }

  anchor.setAttribute('href', url);
  anchor.setAttribute('href', anchor.href);

  return {
    // IE does not start `pathname` with `/` like other browsers.
    pathname: `/${anchor.pathname.replace(/^\//, '')}`,
    search: anchor.search,
    hash: anchor.hash
  };
}

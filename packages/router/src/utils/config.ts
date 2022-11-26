/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {createEnvironmentInjector, EnvironmentInjector, Type, ɵisStandalone as isStandalone, ɵRuntimeError as RuntimeError} from '@angular/core';

import {EmptyOutletComponent} from '../components/empty_outlet';
import {RuntimeErrorCode} from '../errors';
import {Route, Routes} from '../models';
import {ActivatedRouteSnapshot} from '../router_state';
import {PRIMARY_OUTLET} from '../shared';

/**
 * Creates an `EnvironmentInjector` if the `Route` has providers and one does not already exist
 * and returns the injector. Otherwise, if the `Route` does not have `providers`, returns the
 * `currentInjector`.
 *
 * 如果 `Route` 有提供者并且不存在，则创建一个 `EnvironmentInjector` 并返回注入器。否则，如果
 * `Route` 没有 `providers` ，则返回 `currentInjector` 。
 *
 * @param route The route that might have providers
 *
 * 可能有提供者的路由
 *
 * @param currentInjector The parent injector of the `Route`
 *
 * `Route` 的父注入器
 *
 */
export function getOrCreateRouteInjectorIfNeeded(
    route: Route, currentInjector: EnvironmentInjector) {
  if (route.providers && !route._injector) {
    route._injector =
        createEnvironmentInjector(route.providers, currentInjector, `Route: ${route.path}`);
  }
  return route._injector ?? currentInjector;
}

export function getLoadedRoutes(route: Route): Route[]|undefined {
  return route._loadedRoutes;
}

export function getLoadedInjector(route: Route): EnvironmentInjector|undefined {
  return route._loadedInjector;
}
export function getLoadedComponent(route: Route): Type<unknown>|undefined {
  return route._loadedComponent;
}

export function getProvidersInjector(route: Route): EnvironmentInjector|undefined {
  return route._injector;
}

export function validateConfig(
    config: Routes, parentPath: string = '', requireStandaloneComponents = false): void {
  // forEach doesn't iterate undefined values
  for (let i = 0; i < config.length; i++) {
    const route: Route = config[i];
    const fullPath: string = getFullPath(parentPath, route);
    validateNode(route, fullPath, requireStandaloneComponents);
  }
}

export function assertStandalone(fullPath: string, component: Type<unknown>|undefined) {
  if (component && !isStandalone(component)) {
    throw new RuntimeError(
        RuntimeErrorCode.INVALID_ROUTE_CONFIG,
        `Invalid configuration of route '${fullPath}'. The component must be standalone.`);
  }
}

function validateNode(route: Route, fullPath: string, requireStandaloneComponents: boolean): void {
  if (typeof ngDevMode === 'undefined' || ngDevMode) {
    if (!route) {
      throw new RuntimeError(RuntimeErrorCode.INVALID_ROUTE_CONFIG, `
      Invalid configuration of route '${fullPath}': Encountered undefined route.
      The reason might be an extra comma.

      Example:
      const routes: Routes = [
        { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
        { path: 'dashboard',  component: DashboardComponent },, << two commas
        { path: 'detail/:id', component: HeroDetailComponent }
      ];
    `);
    }
    if (Array.isArray(route)) {
      throw new RuntimeError(
          RuntimeErrorCode.INVALID_ROUTE_CONFIG,
          `Invalid configuration of route '${fullPath}': Array cannot be specified`);
    }
    if (!route.redirectTo && !route.component && !route.loadComponent && !route.children &&
        !route.loadChildren && (route.outlet && route.outlet !== PRIMARY_OUTLET)) {
      throw new RuntimeError(
          RuntimeErrorCode.INVALID_ROUTE_CONFIG,
          `Invalid configuration of route '${
              fullPath}': a componentless route without children or loadChildren cannot have a named outlet set`);
    }
    if (route.redirectTo && route.children) {
      throw new RuntimeError(
          RuntimeErrorCode.INVALID_ROUTE_CONFIG,
          `Invalid configuration of route '${
              fullPath}': redirectTo and children cannot be used together`);
    }
    if (route.redirectTo && route.loadChildren) {
      throw new RuntimeError(
          RuntimeErrorCode.INVALID_ROUTE_CONFIG,
          `Invalid configuration of route '${
              fullPath}': redirectTo and loadChildren cannot be used together`);
    }
    if (route.children && route.loadChildren) {
      throw new RuntimeError(
          RuntimeErrorCode.INVALID_ROUTE_CONFIG,
          `Invalid configuration of route '${
              fullPath}': children and loadChildren cannot be used together`);
    }
    if (route.redirectTo && (route.component || route.loadComponent)) {
      throw new RuntimeError(
          RuntimeErrorCode.INVALID_ROUTE_CONFIG,
          `Invalid configuration of route '${
              fullPath}': redirectTo and component/loadComponent cannot be used together`);
    }
    if (route.component && route.loadComponent) {
      throw new RuntimeError(
          RuntimeErrorCode.INVALID_ROUTE_CONFIG,
          `Invalid configuration of route '${
              fullPath}': component and loadComponent cannot be used together`);
    }
    if (route.redirectTo && route.canActivate) {
      throw new RuntimeError(
          RuntimeErrorCode.INVALID_ROUTE_CONFIG,
          `Invalid configuration of route '${
              fullPath}': redirectTo and canActivate cannot be used together. Redirects happen before activation ` +
              `so canActivate will never be executed.`);
    }
    if (route.path && route.matcher) {
      throw new RuntimeError(
          RuntimeErrorCode.INVALID_ROUTE_CONFIG,
          `Invalid configuration of route '${fullPath}': path and matcher cannot be used together`);
    }
    if (route.redirectTo === void 0 && !route.component && !route.loadComponent &&
        !route.children && !route.loadChildren) {
      throw new RuntimeError(
          RuntimeErrorCode.INVALID_ROUTE_CONFIG,
          `Invalid configuration of route '${
              fullPath}'. One of the following must be provided: component, loadComponent, redirectTo, children or loadChildren`);
    }
    if (route.path === void 0 && route.matcher === void 0) {
      throw new RuntimeError(
          RuntimeErrorCode.INVALID_ROUTE_CONFIG,
          `Invalid configuration of route '${
              fullPath}': routes must have either a path or a matcher specified`);
    }
    if (typeof route.path === 'string' && route.path.charAt(0) === '/') {
      throw new RuntimeError(
          RuntimeErrorCode.INVALID_ROUTE_CONFIG,
          `Invalid configuration of route '${fullPath}': path cannot start with a slash`);
    }
    if (route.path === '' && route.redirectTo !== void 0 && route.pathMatch === void 0) {
      const exp =
          `The default value of 'pathMatch' is 'prefix', but often the intent is to use 'full'.`;
      throw new RuntimeError(
          RuntimeErrorCode.INVALID_ROUTE_CONFIG,
          `Invalid configuration of route '{path: "${fullPath}", redirectTo: "${
              route.redirectTo}"}': please provide 'pathMatch'. ${exp}`);
    }
    if (requireStandaloneComponents) {
      assertStandalone(fullPath, route.component);
    }
  }
  if (route.children) {
    validateConfig(route.children, fullPath, requireStandaloneComponents);
  }
}

function getFullPath(parentPath: string, currentRoute: Route): string {
  if (!currentRoute) {
    return parentPath;
  }
  if (!parentPath && !currentRoute.path) {
    return '';
  } else if (parentPath && !currentRoute.path) {
    return `${parentPath}/`;
  } else if (!parentPath && currentRoute.path) {
    return currentRoute.path;
  } else {
    return `${parentPath}/${currentRoute.path}`;
  }
}

/**
 * Makes a copy of the config and adds any default required properties.
 *
 * 制作配置的副本并添加任何默认的必需属性。
 *
 */
export function standardizeConfig(r: Route): Route {
  const children = r.children && r.children.map(standardizeConfig);
  const c = children ? {...r, children} : {...r};
  if ((!c.component && !c.loadComponent) && (children || c.loadChildren) &&
      (c.outlet && c.outlet !== PRIMARY_OUTLET)) {
    c.component = EmptyOutletComponent;
  }
  return c;
}

/**
 * Returns the `route.outlet` or PRIMARY_OUTLET if none exists.
 *
 * 如果不存在，则返回 `route.outlet` 或 PRIMARY_OUTLET。
 *
 */
export function getOutlet(route: Route): string {
  return route.outlet || PRIMARY_OUTLET;
}

/**
 * Sorts the `routes` such that the ones with an outlet matching `outletName` come first.
 * The order of the configs is otherwise preserved.
 *
 * 对 `routes` 进行排序，以使具有与 `outletName`
 * 匹配的插座的路径排在第一位。否则配置的顺序会被保留。
 *
 */
export function sortByMatchingOutlets(routes: Routes, outletName: string): Routes {
  const sortedConfig = routes.filter(r => getOutlet(r) === outletName);
  sortedConfig.push(...routes.filter(r => getOutlet(r) !== outletName));
  return sortedConfig;
}

/**
 * Gets the first injector in the snapshot's parent tree.
 *
 * 获取快照的父树中的第一个注入器。
 *
 * If the `Route` has a static list of providers, the returned injector will be the one created from
 * those. If it does not exist, the returned injector may come from the parents, which may be from a
 * loaded config or their static providers.
 *
 * 如果 `Route`
 * 有一个静态提供者列表，则返回的注入器将是从这些提供者创建的。如果不存在，则返回的注入器可能来自父级，它们可能来自加载的配置或它们的静态提供程序。
 *
 * Returns `null` if there is neither this nor any parents have a stored injector.
 *
 * 如果不存在 this 或任何父级都没有存储的注入器，则返回 `null` 。
 *
 * Generally used for retrieving the injector to use for getting tokens for guards/resolvers and
 * also used for getting the correct injector to use for creating components.
 *
 * 通常用于检索注入器以获取保护器/解析器的标记，还用于获取正确的注入器以创建组件。
 *
 */
export function getClosestRouteInjector(snapshot: ActivatedRouteSnapshot): EnvironmentInjector|
    null {
  if (!snapshot) return null;

  // If the current route has its own injector, which is created from the static providers on the
  // route itself, we should use that. Otherwise, we start at the parent since we do not want to
  // include the lazy loaded injector from this route.
  if (snapshot.routeConfig?._injector) {
    return snapshot.routeConfig._injector;
  }

  for (let s = snapshot.parent; s; s = s.parent) {
    const route = s.routeConfig;
    // Note that the order here is important. `_loadedInjector` stored on the route with
    // `loadChildren: () => NgModule` so it applies to child routes with priority. The `_injector`
    // is created from the static providers on that parent route, so it applies to the children as
    // well, but only if there is no lazy loaded NgModuleRef injector.
    if (route?._loadedInjector) return route._loadedInjector;
    if (route?._injector) return route._injector;
  }

  return null;
}

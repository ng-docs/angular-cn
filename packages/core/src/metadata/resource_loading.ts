/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Type} from '../interface/type';

import {Component} from './directives';


/**
 * Used to resolve resource URLs on `@Component` when used with JIT compilation.
 *
 * 与 JIT 编译一起使用时，用于解析 `@Component` 上的资源 URL。
 *
 * Example:
 *
 * 示例：
 *
 * ```
 * @Component ({
 *   selector: 'my-comp',
 *   templateUrl: 'my-comp.html', // This requires asynchronous resolution
 * })
 * class MyComponent{
 * }
 *
 * // Calling `renderComponent` will fail because `renderComponent` is a synchronous process
 * // and `MyComponent`'s `@Component.templateUrl` needs to be resolved asynchronously.
 *
 * // Calling `resolveComponentResources()` will resolve `@Component.templateUrl` into
 * // `@Component.template`, which allows `renderComponent` to proceed in a synchronous manner.
 *
 * // Use browser's `fetch()` function as the default resource resolution strategy.
 * resolveComponentResources(fetch).then(() => {
 *   // After resolution all URLs have been converted into `template` strings.
 *   renderComponent(MyComponent);
 * });
 * ```
 *
 * NOTE: In AOT the resolution happens during compilation, and so there should be no need
 * to call this method outside JIT mode.
 *
 * 注意：在 AOT 中，解析发生在编译期间，因此应该没有必要在 JIT 模式之外调用此方法。
 *
 * @param resourceResolver a function which is responsible for returning a `Promise` to the
 * contents of the resolved URL. Browser's `fetch()` method is a good default implementation.
 *
 * 一个函数，负责将 `Promise` 返回到已解析的 URL 的内容。浏览器的 `fetch()`
 * 方法是一个很好的默认实现。
 */
export function resolveComponentResources(
    resourceResolver: (url: string) => (Promise<string|{text(): Promise<string>}>)): Promise<void> {
  // Store all promises which are fetching the resources.
  const componentResolved: Promise<void>[] = [];

  // Cache so that we don't fetch the same resource more than once.
  const urlMap = new Map<string, Promise<string>>();
  function cachedResourceResolve(url: string): Promise<string> {
    let promise = urlMap.get(url);
    if (!promise) {
      const resp = resourceResolver(url);
      urlMap.set(url, promise = resp.then(unwrapResponse));
    }
    return promise;
  }

  componentResourceResolutionQueue.forEach((component: Component, type: Type<any>) => {
    const promises: Promise<void>[] = [];
    if (component.templateUrl) {
      promises.push(cachedResourceResolve(component.templateUrl).then((template) => {
        component.template = template;
      }));
    }
    const styleUrls = component.styleUrls;
    const styles = component.styles || (component.styles = []);
    const styleOffset = component.styles.length;
    styleUrls && styleUrls.forEach((styleUrl, index) => {
      styles.push('');  // pre-allocate array.
      promises.push(cachedResourceResolve(styleUrl).then((style) => {
        styles[styleOffset + index] = style;
        styleUrls.splice(styleUrls.indexOf(styleUrl), 1);
        if (styleUrls.length == 0) {
          component.styleUrls = undefined;
        }
      }));
    });
    const fullyResolved = Promise.all(promises).then(() => componentDefResolved(type));
    componentResolved.push(fullyResolved);
  });
  clearResolutionOfComponentResourcesQueue();
  return Promise.all(componentResolved).then(() => undefined);
}

let componentResourceResolutionQueue = new Map<Type<any>, Component>();

// Track when existing ɵcmp for a Type is waiting on resources.
const componentDefPendingResolution = new Set<Type<any>>();

export function maybeQueueResolutionOfComponentResources(type: Type<any>, metadata: Component) {
  if (componentNeedsResolution(metadata)) {
    componentResourceResolutionQueue.set(type, metadata);
    componentDefPendingResolution.add(type);
  }
}

export function isComponentDefPendingResolution(type: Type<any>): boolean {
  return componentDefPendingResolution.has(type);
}

export function componentNeedsResolution(component: Component): boolean {
  return !!(
      (component.templateUrl && !component.hasOwnProperty('template')) ||
      component.styleUrls && component.styleUrls.length);
}
export function clearResolutionOfComponentResourcesQueue(): Map<Type<any>, Component> {
  const old = componentResourceResolutionQueue;
  componentResourceResolutionQueue = new Map();
  return old;
}

export function restoreComponentResolutionQueue(queue: Map<Type<any>, Component>): void {
  componentDefPendingResolution.clear();
  queue.forEach((_, type) => componentDefPendingResolution.add(type));
  componentResourceResolutionQueue = queue;
}

export function isComponentResourceResolutionQueueEmpty() {
  return componentResourceResolutionQueue.size === 0;
}

function unwrapResponse(response: string|{text(): Promise<string>}): string|Promise<string> {
  return typeof response == 'string' ? response : response.text();
}

function componentDefResolved(type: Type<any>): void {
  componentDefPendingResolution.delete(type);
}

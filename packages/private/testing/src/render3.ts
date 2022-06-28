/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ɵresetJitOptions as resetJitOptions} from '@angular/core';

/**
 * Wraps a function in a new function which sets up document and HTML for running a test.
 *
 * 将函数包装在一个新函数中，该函数会设置文档和 HTML 以运行测试。
 *
 * This function is intended to wrap an existing testing function. The wrapper
 * adds HTML to the `body` element of the `document` and subsequently tears it down.
 *
 * 此函数旨在包装现有的测试函数。包装器将 HTML 添加到 `document` 的 `body` 元素，然后将其删除。
 *
 * This function is intended to be used with `async await` and `Promise`s. If the wrapped
 * function returns a promise (or is `async`) then the teardown is delayed until that `Promise`
 * is resolved.
 *
 * 此函数旨在与 `async await` 和 `Promise` 一起使用。如果包装的函数返回 Promise（或者是 `async`
 *），则拆卸会延迟，直到该 `Promise` 被解析。
 *
 * On `node` this function detects if `document` is present and if not it will create one by
 * loading `domino` and installing it.
 *
 * 在 `node` 上，此函数会检测是否存在 `document` ，如果不存在，它将通过加载 `domino`
 * 并安装它来创建一个。
 *
 * Example:
 *
 * 示例：
 *
 * ```
 * describe('something', () => {
 *   it('should do something', withBody('<app-root></app-root>', async () => {
 *     const myApp = renderComponent(MyApp);
 *     await whenRendered(myApp);
 *     expect(getRenderedText(myApp)).toEqual('Hello World!');
 *   }));
 * });
 * ```
 *
 * @param html HTML which should be inserted into `body` of the `document`.
 *
 * 应该插入到 `document` `body` 中的 HTML。
 *
 * @param blockFn function to wrap. The function can return promise or be `async`.
 *
 * 要包装的函数。该函数可以返回 promise 或者是 `async` 。
 *
 * @publicApi
 */
export function withBody<T extends Function>(html: string, blockFn: T): T {
  return function(done: DoneFn) {
    if (typeof blockFn === 'function') {
      document.body.innerHTML = html;
      const blockReturn = blockFn();
      if (blockReturn instanceof Promise) {
        blockReturn.then(done, done.fail);
      } else {
        done();
      }
    }
  } as any;
}

/**
 * Runs jasmine expectations against the provided keys for `ngDevMode`.
 *
 * 根据为 `ngDevMode` 提供的键运行 jasmine 预期。
 *
 * Will not perform expectations for keys that are not provided.
 *
 * 不会对未提供的键执行预期。
 *
 * ```ts
 * // Expect that `ngDevMode.styleMap` is `1`, and `ngDevMode.tNode` is `3`, but we don't care
 * // about the other values.
 * expectPerfCounters({
 *   stylingMap: 1,
 *   tNode: 3,
 * })
 * ```
 *
 */
export function expectPerfCounters(expectedCounters: Partial<NgDevModePerfCounters>): void {
  Object.keys(expectedCounters).forEach(key => {
    const expected = (expectedCounters as any)[key];
    const actual = (ngDevMode as any)[key];
    expect(actual).toBe(expected, `ngDevMode.${key}`);
  });
}

let savedDocument: Document|undefined = undefined;
let savedRequestAnimationFrame: ((callback: FrameRequestCallback) => number)|undefined = undefined;
let savedNode: typeof Node|undefined = undefined;
let requestAnimationFrameCount = 0;

/**
 * System.js uses regexp to look for `require` statements. `domino` has to be
 * extracted into a constant so that the regexp in the System.js does not match
 * and does not try to load domino in the browser.
 *
 * System.js 使用正则表达式来查找 `require` 语句。必须将 `domino` 提取为常量，以便 System.js
 * 中的正则表达式不匹配，并且不会尝试在浏览器中加载 domino。
 *
 */
const domino: any = (function(domino) {
  if (typeof global == 'object' && global.process && typeof require == 'function') {
    try {
      return require(domino);
    } catch (e) {
      // It is possible that we don't have domino available in which case just give up.
    }
  }
  // Seems like we don't have domino, give up.
  return null;
})('domino');

/**
 * Ensure that global has `Document` if we are in node.js
 *
 * 如果我们在 node.js 中，请确保全局具有 `Document`
 *
 * @publicApi
 */
export function ensureDocument(): void {
  if (domino) {
    // we are in node.js.
    const window = domino.createWindow('', 'http://localhost');
    savedDocument = (global as any).document;
    (global as any).window = window;
    (global as any).document = window.document;
    // Trick to avoid Event patching from
    // https://github.com/angular/angular/blob/7cf5e95ac9f0f2648beebf0d5bd9056b79946970/packages/platform-browser/src/dom/events/dom_events.ts#L112-L132
    // It fails with Domino with TypeError: Cannot assign to read only property
    // 'stopImmediatePropagation' of object '#<Event>'
    (global as any).Event = null;
    savedNode = (global as any).Node;
    (global as any).Node = domino.impl.Node;

    savedRequestAnimationFrame = (global as any).requestAnimationFrame;
    (global as any).requestAnimationFrame = function(cb: FrameRequestCallback): number {
      setImmediate(cb);
      return requestAnimationFrameCount++;
    };
  }
}

/**
 * Restore the state of `Document` between tests.
 *
 * 在测试之间恢复 `Document` 的状态。
 *
 * @publicApi
 */
export function cleanupDocument(): void {
  if (savedDocument) {
    (global as any).document = savedDocument;
    (global as any).window = undefined;
    savedDocument = undefined;
  }
  if (savedNode) {
    (global as any).Node = savedNode;
    savedNode = undefined;
  }
  if (savedRequestAnimationFrame) {
    (global as any).requestAnimationFrame = savedRequestAnimationFrame;
    savedRequestAnimationFrame = undefined;
  }
}

if (typeof beforeEach == 'function') beforeEach(ensureDocument);
if (typeof afterEach == 'function') afterEach(cleanupDocument);

if (typeof afterEach === 'function') afterEach(resetJitOptions);

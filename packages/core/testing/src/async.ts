/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Wraps a test function in an asynchronous test zone. The test will automatically
 * complete when all asynchronous calls within this zone are done. Can be used
 * to wrap an {@link inject} call.
 *
 * 把一个测试函数包装进一个异步测试 Zone。当该 Zone 中的所有异步调用都已完成时，该测试将会自动完成。
 * 可用于包装 {@link inject} 调用。
 *
 * Example:
 *
 * 例子：
 *
 * ```
 * it('...', waitForAsync(inject([AClass], (object) => {
 *   object.doSomething.then(() => {
 *     expect(...);
 *   })
 * });
 * ```
 *
 * @publicApi
 */
export function waitForAsync(fn: Function): (done: any) => any {
  const _Zone: any = typeof Zone !== 'undefined' ? Zone : null;
  if (!_Zone) {
    return function() {
      return Promise.reject(
          'Zone is needed for the waitForAsync() test helper but could not be found. ' +
          'Please make sure that your environment includes zone.js');
    };
  }
  const asyncTest = _Zone && _Zone[_Zone.__symbol__('asyncTest')];
  if (typeof asyncTest === 'function') {
    return asyncTest(fn);
  }
  return function() {
    return Promise.reject(
        'zone-testing.js is needed for the async() test helper but could not be found. ' +
        'Please make sure that your environment includes zone.js/testing');
  };
}

/**
 * @deprecated
 *
 * use `waitForAsync()`, \(expected removal in v12\)
 *
 * 改用 `waitForAsync()`（将在 v12 中删除）
 *
 * @see {@link waitForAsync}
 * @publicApi
 */
export function async(fn: Function): (done: any) => any {
  return waitForAsync(fn);
}

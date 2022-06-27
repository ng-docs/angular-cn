/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * An object with helpers for mocking/spying on an object's property.
 *
 * 带有用于模拟/监视对象属性的帮助器的对象。
 *
 */
export interface IPropertySpyHelpers<T, P extends keyof T> {
  /**
   * A `jasmine.Spy` for `get` operations on the property (i.e. reading the current property value).
   * (This is useful in case one needs to make assertions against property reads.)
   *
   * 用于对属性进行 `get` 操作（即读取当前属性值）的 `jasmine.Spy` 。
   * （如果需要对属性读取进行断言，这会很有用。）
   *
   */
  getSpy: jasmine.Spy;

  /**
   * A `jasmine.Spy` for `set` operations on the property (i.e. setting a new property value).
   * (This is useful in case one needs to make assertions against property writes.)
   *
   * 用于对属性进行 `set` 操作（即设置新属性值）的 `jasmine.Spy` 。
   * （如果需要对属性写入进行断言，这会很有用。）
   *
   */
  setSpy: jasmine.Spy;

  /**
   * Install the getter/setter spies for the property.
   *
   * 为属性安装 getter/setter 间谍。
   *
   */
  installSpies(): void;

  /**
   * Uninstall the property spies and restore the original value (from before installing the
   * spies), including the property descriptor.
   *
   * 卸载属性间谍并恢复原始值（从安装间谍之前），包括属性描述符。
   *
   */
  uninstallSpies(): void;

  /**
   * Update the current value of the mocked property.
   *
   * 更新模拟属性的当前值。
   *
   */
  setMockValue(value: T[P]): void;
}

/**
 * Set up mocking an object's property (using spies) and return a function for updating the mocked
 * property's value during tests.
 *
 * 设置模拟对象的属性（使用间谍），并返回一个函数，以在测试期间更新被模拟的属性的值。
 *
 * This is, essentially, a wrapper around `spyProperty()` which additionally takes care of
 * installing the spies before each test (via `beforeEach()`) and uninstalling them after each test
 * (via `afterEach()`).
 *
 * 从本质上，这是 `spyProperty()` 的包装器，它额外负责在每次测试之前安装间谍（通过 `beforeEach()`
 * ）并在每次测试之后卸载它们（通过 `afterEach()` ）。
 *
 * Example usage:
 *
 * 示例用法：
 *
 * ```ts
 * describe('something', () => {
 *   // Assuming `window.foo` is an object...
 *   const mockWindowFooBar = mockProperty(window.foo, 'bar');
 *
 *   it('should do this', () => {
 *     mockWindowFooBar('baz');
 *     expect(window.foo.bar).toBe('baz');
 *
 *     mockWindowFooBar('qux');
 *     expect(window.foo.bar).toBe('qux');
 *   });
 * });
 * ```
 *
 * @param ctx The object whose property needs to be spied on.
 *
 * 需要监视其属性的对象。
 *
 * @param prop The name of the property to spy on.
 *
 * 要监视的属性名称。
 *
 * @return A function for updating the current value of the mocked property.
 *
 * 用于更新模拟属性的当前值的函数。
 *
 */
export const mockProperty =
    <T, P extends keyof T>(ctx: T, prop: P): IPropertySpyHelpers<T, P>['setMockValue'] => {
      const {setMockValue, installSpies, uninstallSpies} = spyProperty(ctx, prop);

      beforeEach(installSpies);
      afterEach(uninstallSpies);

      return setMockValue;
    };

/**
 * Return utility functions to help mock and spy on an object's property.
 *
 * 返回工具函数以帮助模拟和监视对象的属性。
 *
 * It supports spying on properties that are either defined on the object instance itself or on its
 * prototype. It also supports spying on non-writable properties (as long as they are configurable).
 *
 * 它支持监视在对象实例本身或其原型上定义的属性。它还支持监视不可写属性（只要它们是可配置的）。
 *
 * NOTE: Unlike `jasmine`'s spying utilities, spies are not automatically installed/uninstalled, so
 *       the caller is responsible for manually taking care of that (by calling
 *       `installSpies()`/`uninstallSpies()` as necessary).
 *
 * 注意：与 `jasmine` 的间谍实用程序不同，spie
 * 不会自动安装/卸载，因此调用者要负责手动处理它（根据需要调用 `installSpies()` / `uninstallSpies()`
 * ）。
 *
 * @param ctx The object whose property needs to be spied on.
 *
 * 需要监视其属性的对象。
 *
 * @param prop The name of the property to spy on.
 *
 * 要监视的属性名称。
 *
 * @return An object with helpers for mocking/spying on an object's property.
 *
 * 带有用于模拟/监视对象属性的帮助器的对象。
 *
 */
export const spyProperty = <T, P extends keyof T>(ctx: T, prop: P): IPropertySpyHelpers<T, P> => {
  const originalDescriptor = Object.getOwnPropertyDescriptor(ctx, prop);

  let value = ctx[prop];
  const setMockValue = (mockValue: typeof value) => value = mockValue;
  const setSpy = jasmine.createSpy(`set ${String(prop)}`).and.callFake(setMockValue);
  const getSpy = jasmine.createSpy(`get ${String(prop)}`).and.callFake(() => value);

  const installSpies = () => {
    value = ctx[prop];
    Object.defineProperty(ctx, prop, {
      configurable: true,
      enumerable: originalDescriptor ? originalDescriptor.enumerable : true,
      get: getSpy,
      set: setSpy,
    });
  };
  const uninstallSpies = () =>
      originalDescriptor ? Object.defineProperty(ctx, prop, originalDescriptor) : delete ctx[prop];

  return {installSpies, uninstallSpies, setMockValue, getSpy, setSpy};
};

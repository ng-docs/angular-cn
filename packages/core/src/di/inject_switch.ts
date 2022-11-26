/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {throwProviderNotFoundError} from '../render3/errors_di';
import {assertNotEqual} from '../util/assert';
import {stringify} from '../util/stringify';

import {getInjectableDef, ɵɵInjectableDeclaration} from './interface/defs';
import {InjectFlags} from './interface/injector';
import {ProviderToken} from './provider_token';


/**
 * Current implementation of inject.
 *
 * 注入的当前实现。
 *
 * By default, it is `injectInjectorOnly`, which makes it `Injector`-only aware. It can be changed
 * to `directiveInject`, which brings in the `NodeInjector` system of ivy. It is designed this
 * way for two reasons:
 *  1. `Injector` should not depend on ivy logic.
 *  2. To maintain tree shake-ability we don't want to bring in unnecessary code.
 *
 * 默认情况下，它是 `injectInjectorOnly` ，这使得它可以感知 `Injector` 。它可以更改为
 * `directiveInject` ，它会引入 ivy 的 `NodeInjector` 系统。它是这样设计的，有两个原因： 1.
 * `Injector` 不应该依赖于 ivy 逻辑。 2.为了保持树的抖动能力，我们不想引入不必要的代码。
 *
 */
let _injectImplementation: (<T>(token: ProviderToken<T>, flags?: InjectFlags) => T | null)|
    undefined;
export function getInjectImplementation() {
  return _injectImplementation;
}


/**
 * Sets the current inject implementation.
 *
 * 设置当前的注入实现。
 *
 */
export function setInjectImplementation(
    impl: (<T>(token: ProviderToken<T>, flags?: InjectFlags) => T | null)|
    undefined): (<T>(token: ProviderToken<T>, flags?: InjectFlags) => T | null)|undefined {
  const previous = _injectImplementation;
  _injectImplementation = impl;
  return previous;
}


/**
 * Injects `root` tokens in limp mode.
 *
 * 以 limp 模式注入 `root` 标记。
 *
 * If no injector exists, we can still inject tree-shakable providers which have `providedIn` set to
 * `"root"`. This is known as the limp mode injection. In such case the value is stored in the
 * injectable definition.
 *
 * 如果不存在注入器，我们仍然可以注入 providerIn `providedIn` 为 `"root"` 的可 tree-shakable
 * 提供程序。这被称为跛行模式注入。在这种情况下，该值存储在可注入定义中。
 *
 */
export function injectRootLimpMode<T>(
    token: ProviderToken<T>, notFoundValue: T|undefined, flags: InjectFlags): T|null {
  const injectableDef: ɵɵInjectableDeclaration<T>|null = getInjectableDef(token);
  if (injectableDef && injectableDef.providedIn == 'root') {
    return injectableDef.value === undefined ? injectableDef.value = injectableDef.factory() :
                                               injectableDef.value;
  }
  if (flags & InjectFlags.Optional) return null;
  if (notFoundValue !== undefined) return notFoundValue;
  throwProviderNotFoundError(stringify(token), 'Injector');
}


/**
 * Assert that `_injectImplementation` is not `fn`.
 *
 * 断言 `_injectImplementation` 不是 `fn` 。
 *
 * This is useful, to prevent infinite recursion.
 *
 * 这对防止无限递归很有用。
 *
 * @param fn Function which it should not equal to
 *
 * 它不应该等于的函数
 *
 */
export function assertInjectImplementationNotEqual(
    fn: (<T>(token: ProviderToken<T>, flags?: InjectFlags) => T | null)) {
  ngDevMode &&
      assertNotEqual(_injectImplementation, fn, 'Calling ɵɵinject would cause infinite recursion');
}

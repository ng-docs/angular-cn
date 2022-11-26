/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


import {createInjector} from './create_injector';
import {THROW_IF_NOT_FOUND, ɵɵinject} from './injector_compatibility';
import {InjectorMarkers} from './injector_marker';
import {INJECTOR} from './injector_token';
import {ɵɵdefineInjectable} from './interface/defs';
import {InjectFlags, InjectOptions} from './interface/injector';
import {StaticProvider} from './interface/provider';
import {NullInjector} from './null_injector';
import {ProviderToken} from './provider_token';

/**
 * Concrete injectors implement this interface. Injectors are configured
 * with [providers](guide/glossary#provider) that associate
 * dependencies of various types with [injection tokens](guide/glossary#di-token).
 *
 * 具体的注入器会实现此接口。配置有[某些提供者](guide/glossary#provider)的注入器，这些提供者会将各种类型的依赖项与[注入令牌](guide/glossary#di-token)相关联。
 *
 * @see ["DI Providers"](guide/dependency-injection-providers).
 *
 * [“DI 提供者”](guide/dependency-injection-providers) 。
 *
 * @see `StaticProvider`
 *
 * @usageNotes
 *
 *  The following example creates a service injector instance.
 *
 * 以下示例创建一个服务注入器实例。
 *
 * {@example core/di/ts/provider_spec.ts region='ConstructorProvider'}
 *
 * ### Usage example
 *
 * ### 使用范例
 *
 * {@example core/di/ts/injector_spec.ts region='Injector'}
 *
 * `Injector` returns itself when given `Injector` as a token:
 *
 * {@example core/di/ts/injector_spec.ts region='injectInjector'}
 *
 * @publicApi
 */
export abstract class Injector {
  static THROW_IF_NOT_FOUND = THROW_IF_NOT_FOUND;
  static NULL: Injector = (/* @__PURE__ */ new NullInjector());

  /**
   * Internal note on the `options?: InjectOptions|InjectFlags` override of the `get`
   * method: consider dropping the `InjectFlags` part in one of the major versions.
   * It can **not** be done in minor/patch, since it's breaking for custom injectors
   * that only implement the old `InjectorFlags` interface.
   */

  /**
   * Retrieves an instance from the injector based on the provided token.
   *
   * 根据提供的令牌从注入器中检索实例。
   *
   * @returns The instance from the injector if defined, otherwise the `notFoundValue`.
   *
   * 注入器的实例（如果已定义），否则为 `notFoundValue` 。
   *
   * @throws When the `notFoundValue` is `undefined` or `Injector.THROW_IF_NOT_FOUND`.
   *
   * 当 `notFoundValue` 为 `undefined` 或 `Injector.THROW_IF_NOT_FOUND` 时。
   *
   */
  abstract get<T>(token: ProviderToken<T>, notFoundValue: undefined, options: InjectOptions&{
    optional?: false;
  }): T;
  /**
   * Retrieves an instance from the injector based on the provided token.
   * @returns The instance from the injector if defined, otherwise the `notFoundValue`.
   * @throws When the `notFoundValue` is `undefined` or `Injector.THROW_IF_NOT_FOUND`.
   */
  abstract get<T>(token: ProviderToken<T>, notFoundValue: null|undefined, options: InjectOptions): T
      |null;
  /**
   * Retrieves an instance from the injector based on the provided token.
   * @returns The instance from the injector if defined, otherwise the `notFoundValue`.
   * @throws When the `notFoundValue` is `undefined` or `Injector.THROW_IF_NOT_FOUND`.
   */
  abstract get<T>(token: ProviderToken<T>, notFoundValue?: T, options?: InjectOptions|InjectFlags):
      T;
  /**
   * Retrieves an instance from the injector based on the provided token.
   * @returns The instance from the injector if defined, otherwise the `notFoundValue`.
   * @throws When the `notFoundValue` is `undefined` or `Injector.THROW_IF_NOT_FOUND`.
   * @deprecated use object-based flags (`InjectOptions`) instead.
   */
  abstract get<T>(token: ProviderToken<T>, notFoundValue?: T, flags?: InjectFlags): T;
  /**
   * @deprecated from v4.0.0 use ProviderToken<T>
   *
   *   从 v4.0.0 开始，改用 Type<T>、AbstractType<T> 或 InjectionToken<T>
   *
   * @suppress {duplicate}
   */
  abstract get(token: any, notFoundValue?: any): any;

  /**
   * @deprecated from v5 use the new signature Injector.create(options)
   *
   * 从 v5 开始使用新的签名 Injector.create（options）
   *
   */
  static create(providers: StaticProvider[], parent?: Injector): Injector;

  /**
   * Creates a new injector instance that provides one or more dependencies,
   * according to a given type or types of `StaticProvider`.
   *
   * 创建一个新的注入器实例，该实例会根据指定的类型或 `StaticProvider` 的类型提供一个或多个依赖项。
   *
   * @param options An object with the following properties:
   *
   * 具有以下属性的对象：
   *
   * * `providers`: An array of providers of the [StaticProvider type](api/core/StaticProvider).
   *
   *   `providers` ：一组 [StaticProvider 类型](api/core/StaticProvider)的提供者。
   *
   * * `parent`: (optional) A parent injector.
   *
   *   `parent` ：（可选）父注入器。
   *
   * - `name`: (optional) A developer-defined identifying name for the new injector.
   *
   *   `name` ：（可选）新注入器的开发人员自定义的标识名称。
   *
   * @returns The new injector instance.
   *
   * 新的注入器实例。
   */
  static create(options: {providers: StaticProvider[], parent?: Injector, name?: string}): Injector;


  static create(
      options: StaticProvider[]|{providers: StaticProvider[], parent?: Injector, name?: string},
      parent?: Injector): Injector {
    if (Array.isArray(options)) {
      return createInjector({name: ''}, parent, options, '');
    } else {
      const name = options.name ?? '';
      return createInjector({name}, options.parent, options.providers, name);
    }
  }

  /** @nocollapse */
  static ɵprov = /** @pureOrBreakMyCode */ ɵɵdefineInjectable({
    token: Injector,
    providedIn: 'any',
    factory: () => ɵɵinject(INJECTOR),
  });

  /**
   * @internal
   * @nocollapse
   */
  static __NG_ELEMENT_ID__ = InjectorMarkers.Injector;
}

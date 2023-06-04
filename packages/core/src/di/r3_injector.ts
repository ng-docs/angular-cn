/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import '../util/ng_dev_mode';

import {RuntimeError, RuntimeErrorCode} from '../errors';
import {OnDestroy} from '../interface/lifecycle_hooks';
import {Type} from '../interface/type';
import {FactoryFn, getFactoryDef} from '../render3/definition_factory';
import {throwCyclicDependencyError, throwInvalidProviderError, throwMixedMultiProviderError} from '../render3/errors_di';
import {NG_ENV_ID} from '../render3/fields';
import {newArray} from '../util/array_utils';
import {EMPTY_ARRAY} from '../util/empty';
import {stringify} from '../util/stringify';

import {resolveForwardRef} from './forward_ref';
import {ENVIRONMENT_INITIALIZER} from './initializer_token';
import {setInjectImplementation} from './inject_switch';
import {InjectionToken} from './injection_token';
import {Injector} from './injector';
import {catchInjectorError, convertToBitFlags, injectArgs, NG_TEMP_TOKEN_PATH, setCurrentInjector, THROW_IF_NOT_FOUND, ɵɵinject} from './injector_compatibility';
import {INJECTOR} from './injector_token';
import {getInheritedInjectableDef, getInjectableDef, InjectorType, ɵɵInjectableDeclaration} from './interface/defs';
import {InjectFlags, InjectOptions} from './interface/injector';
import {ClassProvider, ConstructorProvider, EnvironmentProviders, InternalEnvironmentProviders, isEnvironmentProviders, Provider, StaticClassProvider} from './interface/provider';
import {INJECTOR_DEF_TYPES} from './internal_tokens';
import {NullInjector} from './null_injector';
import {isExistingProvider, isFactoryProvider, isTypeProvider, isValueProvider, SingleProvider} from './provider_collection';
import {ProviderToken} from './provider_token';
import {INJECTOR_SCOPE, InjectorScope} from './scope';

/**
 * Marker which indicates that a value has not yet been created from the factory function.
 *
 * 表明尚未从工厂函数创建值的标记。
 *
 */
const NOT_YET = {};

/**
 * Marker which indicates that the factory function for a token is in the process of being called.
 *
 * 指示标记的工厂函数正在被调用的过程中的标记。
 *
 * If the injector is asked to inject a token with its value set to CIRCULAR, that indicates
 * injection of a dependency has recursively attempted to inject the original token, and there is
 * a circular dependency among the providers.
 *
 * 如果要求注入器注入值设置为 CIRCULAR
 * 的标记，则表明依赖注入已递归尝试注入原始标记，并且提供者之间存在循环依赖。
 *
 */
const CIRCULAR = {};

/**
 * A lazily initialized NullInjector.
 *
 * 延迟初始化的 NullInjector。
 *
 */
let NULL_INJECTOR: Injector|undefined = undefined;

export function getNullInjector(): Injector {
  if (NULL_INJECTOR === undefined) {
    NULL_INJECTOR = new NullInjector();
  }
  return NULL_INJECTOR;
}

/**
 * An entry in the injector which tracks information about the given token, including a possible
 * current value.
 *
 * 注入器中的条目，用于跟踪有关给定标记的信息，包括可能的当前值。
 *
 */
interface Record<T> {
  factory: (() => T)|undefined;
  value: T|{};
  multi: any[]|undefined;
}

/**
 * An `Injector` that's part of the environment injector hierarchy, which exists outside of the
 * component tree.
 *
 * 创建一个新的 `Injector`，它是使用 `InjectorType<any>` 的 `defType` 配置的。
 *
 */
export abstract class EnvironmentInjector implements Injector {
  /**
   * Retrieves an instance from the injector based on the provided token.
   *
   * 根据提供的标记从注入器中检索实例。
   *
   * @returns
   *
   * The instance from the injector if defined, otherwise the `notFoundValue`.
   *
   * 注入器中的实例（如果已定义），否则为 `notFoundValue`。
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
   *
   * 根据提供的标记从注入器中检索实例。
   *
   * @returns
   *
   * The instance from the injector if defined, otherwise the `notFoundValue`.
   *
   * 注入器中的实例（如果已定义），否则为 `notFoundValue`。
   *
   * @throws When the `notFoundValue` is `undefined` or `Injector.THROW_IF_NOT_FOUND`.
   *
   * 当 `notFoundValue` 为 `undefined` 或 `Injector.THROW_IF_NOT_FOUND` 时。
   *
   */
  abstract get<T>(token: ProviderToken<T>, notFoundValue: null|undefined, options: InjectOptions): T
      |null;
  /**
   * Retrieves an instance from the injector based on the provided token.
   *
   * 根据提供的标记从注入器中检索实例。
   *
   * @returns
   *
   * The instance from the injector if defined, otherwise the `notFoundValue`.
   *
   * 注入器中的实例（如果已定义），否则为 `notFoundValue`。
   *
   * @throws When the `notFoundValue` is `undefined` or `Injector.THROW_IF_NOT_FOUND`.
   *
   * 当 `notFoundValue` 为 `undefined` 或 `Injector.THROW_IF_NOT_FOUND` 时。
   *
   */
  abstract get<T>(token: ProviderToken<T>, notFoundValue?: T, options?: InjectOptions): T;
  /**
   * Retrieves an instance from the injector based on the provided token.
   *
   * 根据提供的标记从注入器中检索实例。
   *
   * @returns
   *
   * The instance from the injector if defined, otherwise the `notFoundValue`.
   *
   * 注入器中的实例（如果已定义），否则为 `notFoundValue`。
   * @throws When the `notFoundValue` is `undefined` or `Injector.THROW_IF_NOT_FOUND`.
   *
   * 当 `notFoundValue` 为 `undefined` 或 `Injector.THROW_IF_NOT_FOUND` 时。
   * @deprecated
   *
   * use object-based flags \(`InjectOptions`\) instead.
   *
   * 改用基于对象的标志（`InjectOptions`）。
   *
   */
  abstract get<T>(token: ProviderToken<T>, notFoundValue?: T, flags?: InjectFlags): T;
  /**
   * @deprecated
   *
   * from v4.0.0 use ProviderToken<T>
   *
   * 从 v4.0.0 使用 ProviderToken<T>
   *
   * @suppress {duplicate}
   */
  abstract get(token: any, notFoundValue?: any): any;

  /**
   * Runs the given function in the context of this `EnvironmentInjector`.
   *
   * 在此 `EnvironmentInjector` 的上下文中运行给定的函数。
   *
   * Within the function's stack frame, `inject` can be used to inject dependencies from this
   * injector. Note that `inject` is only usable synchronously, and cannot be used in any
   * asynchronous callbacks or after any `await` points.
   *
   * 在函数的堆栈框架中，`inject` 可用于从此注入器注入依赖项。请注意，`inject` 仅可同步使用，不能在任何异步回调或任何 `await` 点之后使用。
   *
   * @param fn the closure to be run in the context of this injector
   *
   * 要在此注入器的上下文中运行的闭包
   * @returns
   *
   * the return value of the function, if any
   *
   * 函数的返回值，如果有的话
   *
   * @deprecated
   *
   * use the standalone function `runInInjectionContext` instead
   *
   * 改为使用独立函数 `runInInjectionContext`
   *
   */
  abstract runInContext<ReturnT>(fn: () => ReturnT): ReturnT;

  abstract destroy(): void;

  /**
   * @internal
   */
  abstract onDestroy(callback: () => void): () => void;
}

export class R3Injector extends EnvironmentInjector {
  /**
   * Map of tokens to records which contain the instances of those tokens.
   *
   * 标记到包含这些标记实例的记录的映射。
   *
   * - `null` value implies that we don't have the record. Used by tree-shakable injectors
   *   to prevent further searches.
   *
   *   `null` 值意味着我们没有记录。被 tree-shakable 注入器使用以防止进一步搜索。
   *
   */
  private records = new Map<ProviderToken<any>, Record<any>|null>();

  /**
   * Set of values instantiated by this injector which contain `ngOnDestroy` lifecycle hooks.
   *
   * 此注入器实例化的值集，包含 `ngOnDestroy` 生命周期钩子。
   *
   */
  private _ngOnDestroyHooks = new Set<OnDestroy>();

  private _onDestroyHooks: Array<() => void> = [];

  /**
   * Flag indicating that this injector was previously destroyed.
   *
   * 表明此注入器以前被破坏的标志。
   *
   */
  get destroyed(): boolean {
    return this._destroyed;
  }
  private _destroyed = false;

  private injectorDefTypes: Set<Type<unknown>>;

  constructor(
      providers: Array<Provider|EnvironmentProviders>, readonly parent: Injector,
      readonly source: string|null, readonly scopes: Set<InjectorScope>) {
    super();
    // Start off by creating Records for every provider.
    forEachSingleProvider(
        providers as Array<Provider|InternalEnvironmentProviders>,
        provider => this.processProvider(provider));

    // Make sure the INJECTOR token provides this injector.
    this.records.set(INJECTOR, makeRecord(undefined, this));

    // And `EnvironmentInjector` if the current injector is supposed to be env-scoped.
    if (scopes.has('environment')) {
      this.records.set(EnvironmentInjector, makeRecord(undefined, this));
    }

    // Detect whether this injector has the APP_ROOT_SCOPE token and thus should provide
    // any injectable scoped to APP_ROOT_SCOPE.
    const record = this.records.get(INJECTOR_SCOPE) as Record<InjectorScope|null>;
    if (record != null && typeof record.value === 'string') {
      this.scopes.add(record.value as InjectorScope);
    }

    this.injectorDefTypes =
        new Set(this.get(INJECTOR_DEF_TYPES.multi, EMPTY_ARRAY, InjectFlags.Self));
  }

  /**
   * Destroy the injector and release references to every instance or provider associated with it.
   *
   * 销毁注入器并释放对与其关联的每个实例或提供者的引用。
   *
   * Also calls the `OnDestroy` lifecycle hooks of every instance that was created for which a
   * hook was found.
   *
   * 还会调用为其创建的每个实例的 `OnDestroy` 生命周期钩子。
   *
   */
  override destroy(): void {
    this.assertNotDestroyed();

    // Set destroyed = true first, in case lifecycle hooks re-enter destroy().
    this._destroyed = true;
    try {
      // Call all the lifecycle hooks.
      for (const service of this._ngOnDestroyHooks) {
        service.ngOnDestroy();
      }
      const onDestroyHooks = this._onDestroyHooks;
      // Reset the _onDestroyHooks array before iterating over it to prevent hooks that unregister
      // themselves from mutating the array during iteration.
      this._onDestroyHooks = [];
      for (const hook of onDestroyHooks) {
        hook();
      }
    } finally {
      // Release all references.
      this.records.clear();
      this._ngOnDestroyHooks.clear();
      this.injectorDefTypes.clear();
    }
  }

  override onDestroy(callback: () => void): () => void {
    this.assertNotDestroyed();
    this._onDestroyHooks.push(callback);
    return () => this.removeOnDestroy(callback);
  }

  override runInContext<ReturnT>(fn: () => ReturnT): ReturnT {
    this.assertNotDestroyed();

    const previousInjector = setCurrentInjector(this);
    const previousInjectImplementation = setInjectImplementation(undefined);
    try {
      return fn();
    } finally {
      setCurrentInjector(previousInjector);
      setInjectImplementation(previousInjectImplementation);
    }
  }

  override get<T>(
      token: ProviderToken<T>, notFoundValue: any = THROW_IF_NOT_FOUND,
      flags: InjectFlags|InjectOptions = InjectFlags.Default): T {
    this.assertNotDestroyed();

    if (token.hasOwnProperty(NG_ENV_ID)) {
      return (token as any)[NG_ENV_ID](this);
    }

    flags = convertToBitFlags(flags) as InjectFlags;

    // Set the injection context.
    const previousInjector = setCurrentInjector(this);
    const previousInjectImplementation = setInjectImplementation(undefined);
    try {
      // Check for the SkipSelf flag.
      if (!(flags & InjectFlags.SkipSelf)) {
        // SkipSelf isn't set, check if the record belongs to this injector.
        let record: Record<T>|undefined|null = this.records.get(token);
        if (record === undefined) {
          // No record, but maybe the token is scoped to this injector. Look for an injectable
          // def with a scope matching this injector.
          const def = couldBeInjectableType(token) && getInjectableDef(token);
          if (def && this.injectableDefInScope(def)) {
            // Found an injectable def and it's scoped to this injector. Pretend as if it was here
            // all along.
            record = makeRecord(injectableDefOrInjectorDefFactory(token), NOT_YET);
          } else {
            record = null;
          }
          this.records.set(token, record);
        }
        // If a record was found, get the instance for it and return it.
        if (record != null /* NOT null || undefined */) {
          return this.hydrate(token, record);
        }
      }

      // Select the next injector based on the Self flag - if self is set, the next injector is
      // the NullInjector, otherwise it's the parent.
      const nextInjector = !(flags & InjectFlags.Self) ? this.parent : getNullInjector();
      // Set the notFoundValue based on the Optional flag - if optional is set and notFoundValue
      // is undefined, the value is null, otherwise it's the notFoundValue.
      notFoundValue = (flags & InjectFlags.Optional) && notFoundValue === THROW_IF_NOT_FOUND ?
          null :
          notFoundValue;
      return nextInjector.get(token, notFoundValue);
    } catch (e: any) {
      if (e.name === 'NullInjectorError') {
        const path: any[] = e[NG_TEMP_TOKEN_PATH] = e[NG_TEMP_TOKEN_PATH] || [];
        path.unshift(stringify(token));
        if (previousInjector) {
          // We still have a parent injector, keep throwing
          throw e;
        } else {
          // Format & throw the final error message when we don't have any previous injector
          return catchInjectorError(e, token, 'R3InjectorError', this.source);
        }
      } else {
        throw e;
      }
    } finally {
      // Lastly, restore the previous injection context.
      setInjectImplementation(previousInjectImplementation);
      setCurrentInjector(previousInjector);
    }
  }

  /** @internal */
  resolveInjectorInitializers() {
    const previousInjector = setCurrentInjector(this);
    const previousInjectImplementation = setInjectImplementation(undefined);
    try {
      const initializers = this.get(ENVIRONMENT_INITIALIZER.multi, EMPTY_ARRAY, InjectFlags.Self);
      if (ngDevMode && !Array.isArray(initializers)) {
        throw new RuntimeError(
            RuntimeErrorCode.INVALID_MULTI_PROVIDER,
            'Unexpected type of the `ENVIRONMENT_INITIALIZER` token value ' +
                `(expected an array, but got ${typeof initializers}). ` +
                'Please check that the `ENVIRONMENT_INITIALIZER` token is configured as a ' +
                '`multi: true` provider.');
      }
      for (const initializer of initializers) {
        initializer();
      }
    } finally {
      setCurrentInjector(previousInjector);
      setInjectImplementation(previousInjectImplementation);
    }
  }

  override toString() {
    const tokens: string[] = [];
    const records = this.records;
    for (const token of records.keys()) {
      tokens.push(stringify(token));
    }
    return `R3Injector[${tokens.join(', ')}]`;
  }

  assertNotDestroyed(): void {
    if (this._destroyed) {
      throw new RuntimeError(
          RuntimeErrorCode.INJECTOR_ALREADY_DESTROYED,
          ngDevMode && 'Injector has already been destroyed.');
    }
  }

  /**
   * Process a `SingleProvider` and add it.
   *
   * 处理 `SingleProvider` 并添加它。
   *
   */
  private processProvider(provider: SingleProvider): void {
    // Determine the token from the provider. Either it's its own token, or has a {provide: ...}
    // property.
    provider = resolveForwardRef(provider);
    let token: any =
        isTypeProvider(provider) ? provider : resolveForwardRef(provider && provider.provide);

    // Construct a `Record` for the provider.
    const record = providerToRecord(provider);

    if (!isTypeProvider(provider) && provider.multi === true) {
      // If the provider indicates that it's a multi-provider, process it specially.
      // First check whether it's been defined already.
      let multiRecord = this.records.get(token);
      if (multiRecord) {
        // It has. Throw a nice error if
        if (ngDevMode && multiRecord.multi === undefined) {
          throwMixedMultiProviderError();
        }
      } else {
        multiRecord = makeRecord(undefined, NOT_YET, true);
        multiRecord.factory = () => injectArgs(multiRecord!.multi!);
        this.records.set(token, multiRecord);
      }
      token = provider;
      multiRecord.multi!.push(provider);
    } else {
      const existing = this.records.get(token);
      if (ngDevMode && existing && existing.multi !== undefined) {
        throwMixedMultiProviderError();
      }
    }
    this.records.set(token, record);
  }

  private hydrate<T>(token: ProviderToken<T>, record: Record<T>): T {
    if (ngDevMode && record.value === CIRCULAR) {
      throwCyclicDependencyError(stringify(token));
    } else if (record.value === NOT_YET) {
      record.value = CIRCULAR;
      record.value = record.factory!();
    }
    if (typeof record.value === 'object' && record.value && hasOnDestroy(record.value)) {
      this._ngOnDestroyHooks.add(record.value);
    }
    return record.value as T;
  }

  private injectableDefInScope(def: ɵɵInjectableDeclaration<any>): boolean {
    if (!def.providedIn) {
      return false;
    }
    const providedIn = resolveForwardRef(def.providedIn);
    if (typeof providedIn === 'string') {
      return providedIn === 'any' || (this.scopes.has(providedIn));
    } else {
      return this.injectorDefTypes.has(providedIn);
    }
  }

  private removeOnDestroy(callback: () => void): void {
    const destroyCBIdx = this._onDestroyHooks.indexOf(callback);
    if (destroyCBIdx !== -1) {
      this._onDestroyHooks.splice(destroyCBIdx, 1);
    }
  }
}

function injectableDefOrInjectorDefFactory(token: ProviderToken<any>): FactoryFn<any> {
  // Most tokens will have an injectable def directly on them, which specifies a factory directly.
  const injectableDef = getInjectableDef(token);
  const factory = injectableDef !== null ? injectableDef.factory : getFactoryDef(token);

  if (factory !== null) {
    return factory;
  }

  // InjectionTokens should have an injectable def (ɵprov) and thus should be handled above.
  // If it's missing that, it's an error.
  if (token instanceof InjectionToken) {
    throw new RuntimeError(
        RuntimeErrorCode.INVALID_INJECTION_TOKEN,
        ngDevMode && `Token ${stringify(token)} is missing a ɵprov definition.`);
  }

  // Undecorated types can sometimes be created if they have no constructor arguments.
  if (token instanceof Function) {
    return getUndecoratedInjectableFactory(token);
  }

  // There was no way to resolve a factory for this token.
  throw new RuntimeError(RuntimeErrorCode.INVALID_INJECTION_TOKEN, ngDevMode && 'unreachable');
}

function getUndecoratedInjectableFactory(token: Function) {
  // If the token has parameters then it has dependencies that we cannot resolve implicitly.
  const paramLength = token.length;
  if (paramLength > 0) {
    const args: string[] = newArray(paramLength, '?');
    throw new RuntimeError(
        RuntimeErrorCode.INVALID_INJECTION_TOKEN,
        ngDevMode && `Can't resolve all parameters for ${stringify(token)}: (${args.join(', ')}).`);
  }

  // The constructor function appears to have no parameters.
  // This might be because it inherits from a super-class. In which case, use an injectable
  // def from an ancestor if there is one.
  // Otherwise this really is a simple class with no dependencies, so return a factory that
  // just instantiates the zero-arg constructor.
  const inheritedInjectableDef = getInheritedInjectableDef(token);
  if (inheritedInjectableDef !== null) {
    return () => inheritedInjectableDef.factory(token as Type<any>);
  } else {
    return () => new (token as Type<any>)();
  }
}

function providerToRecord(provider: SingleProvider): Record<any> {
  if (isValueProvider(provider)) {
    return makeRecord(undefined, provider.useValue);
  } else {
    const factory: (() => any)|undefined = providerToFactory(provider);
    return makeRecord(factory, NOT_YET);
  }
}

/**
 * Converts a `SingleProvider` into a factory function.
 *
 * 将 `SingleProvider` 转换为工厂函数。
 *
 * @param provider provider to convert to factory
 *
 * 要转换为工厂的提供者
 *
 */
export function providerToFactory(
    provider: SingleProvider, ngModuleType?: InjectorType<any>, providers?: any[]): () => any {
  let factory: (() => any)|undefined = undefined;
  if (ngDevMode && isEnvironmentProviders(provider)) {
    throwInvalidProviderError(undefined, providers, provider);
  }

  if (isTypeProvider(provider)) {
    const unwrappedProvider = resolveForwardRef(provider);
    return getFactoryDef(unwrappedProvider) || injectableDefOrInjectorDefFactory(unwrappedProvider);
  } else {
    if (isValueProvider(provider)) {
      factory = () => resolveForwardRef(provider.useValue);
    } else if (isFactoryProvider(provider)) {
      factory = () => provider.useFactory(...injectArgs(provider.deps || []));
    } else if (isExistingProvider(provider)) {
      factory = () => ɵɵinject(resolveForwardRef(provider.useExisting));
    } else {
      const classRef = resolveForwardRef(
          provider &&
          ((provider as StaticClassProvider | ClassProvider).useClass || provider.provide));
      if (ngDevMode && !classRef) {
        throwInvalidProviderError(ngModuleType, providers, provider);
      }
      if (hasDeps(provider)) {
        factory = () => new (classRef)(...injectArgs(provider.deps));
      } else {
        return getFactoryDef(classRef) || injectableDefOrInjectorDefFactory(classRef);
      }
    }
  }
  return factory;
}

function makeRecord<T>(
    factory: (() => T)|undefined, value: T|{}, multi: boolean = false): Record<T> {
  return {
    factory: factory,
    value: value,
    multi: multi ? [] : undefined,
  };
}

function hasDeps(value: ClassProvider|ConstructorProvider|
                 StaticClassProvider): value is ClassProvider&{deps: any[]} {
  return !!(value as any).deps;
}

function hasOnDestroy(value: any): value is OnDestroy {
  return value !== null && typeof value === 'object' &&
      typeof (value as OnDestroy).ngOnDestroy === 'function';
}

function couldBeInjectableType(value: any): value is ProviderToken<any> {
  return (typeof value === 'function') ||
      (typeof value === 'object' && value instanceof InjectionToken);
}

function forEachSingleProvider(
    providers: Array<Provider|EnvironmentProviders>, fn: (provider: SingleProvider) => void): void {
  for (const provider of providers) {
    if (Array.isArray(provider)) {
      forEachSingleProvider(provider, fn);
    } else if (provider && isEnvironmentProviders(provider)) {
      forEachSingleProvider(provider.ɵproviders, fn);
    } else {
      fn(provider as SingleProvider);
    }
  }
}

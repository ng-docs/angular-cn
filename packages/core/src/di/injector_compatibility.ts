/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import '../util/ng_dev_mode';

import {RuntimeError, RuntimeErrorCode} from '../errors';
import {Type} from '../interface/type';
import {stringify} from '../util/stringify';

import {resolveForwardRef} from './forward_ref';
import {getInjectImplementation, injectRootLimpMode} from './inject_switch';
import {Injector} from './injector';
import {DecoratorFlags, InjectFlags, InjectOptions, InternalInjectFlags} from './interface/injector';
import {ProviderToken} from './provider_token';


const _THROW_IF_NOT_FOUND = {};
export const THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;

/*
 * Name of a property (that we patch onto DI decorator), which is used as an annotation of which
 * InjectFlag this decorator represents. This allows to avoid direct references to the DI decorators
 * in the code, thus making them tree-shakable.
 */
const DI_DECORATOR_FLAG = '__NG_DI_FLAG__';

export const NG_TEMP_TOKEN_PATH = 'ngTempTokenPath';
const NG_TOKEN_PATH = 'ngTokenPath';
const NEW_LINE = /\n/gm;
const NO_NEW_LINE = 'ɵ';
export const SOURCE = '__source';

/**
 * Current injector value used by `inject`.
 *
 * injection 使用的当前 `inject` 器值。
 *
 * - `undefined`: it is an error to call `inject`
 *
 *   `undefined`：调用 `inject` 是错误的
 *
 * - `null`: `inject` can be called but there is no injector \(limp-mode\).
 *
 *   `null`：可以调用 injection，但没有 `inject` 器（limp-mode）。
 *
 * - Injector instance: Use the injector for resolution.
 *
 *   注入器实例：使用注入器进行解析。
 *
 */
let _currentInjector: Injector|undefined|null = undefined;

export function getCurrentInjector(): Injector|undefined|null {
  return _currentInjector;
}

export function setCurrentInjector(injector: Injector|null|undefined): Injector|undefined|null {
  const former = _currentInjector;
  _currentInjector = injector;
  return former;
}

export function injectInjectorOnly<T>(token: ProviderToken<T>): T;
export function injectInjectorOnly<T>(token: ProviderToken<T>, flags?: InjectFlags): T|null;
export function injectInjectorOnly<T>(token: ProviderToken<T>, flags = InjectFlags.Default): T|
    null {
  if (_currentInjector === undefined) {
    throw new RuntimeError(
        RuntimeErrorCode.MISSING_INJECTION_CONTEXT,
        ngDevMode &&
            `inject() must be called from an injection context such as a constructor, a factory function, a field initializer, or a function used with \`runInInjectionContext\`.`);
  } else if (_currentInjector === null) {
    return injectRootLimpMode(token, undefined, flags);
  } else {
    return _currentInjector.get(token, flags & InjectFlags.Optional ? null : undefined, flags);
  }
}

/**
 * Generated instruction: injects a token from the currently active injector.
 *
 * 生成的方式：从当前活动的注入器注入令牌。
 *
 * \(Additional documentation moved to `inject`, as it is the public API, and an alias for this
 * instruction\)
 *
 * （其他文档移到了 `inject`，因为它是公共 API，并且是此指令的别名）
 *
 * @see inject
 *
 * 注入
 * @codeGenApi
 * @publicApi This instruction has been emitted by ViewEngine for some time and is deployed to npm.
 */
export function ɵɵinject<T>(token: ProviderToken<T>): T;
export function ɵɵinject<T>(token: ProviderToken<T>, flags?: InjectFlags): T|null;
export function ɵɵinject<T>(token: ProviderToken<T>, flags = InjectFlags.Default): T|null {
  return (getInjectImplementation() || injectInjectorOnly)(resolveForwardRef(token), flags);
}

/**
 * Throws an error indicating that a factory function could not be generated by the compiler for a
 * particular class.
 *
 * 抛出一个错误，表明编译器无法为特定类生成工厂函数。
 *
 * The name of the class is not mentioned here, but will be in the generated factory function name
 * and thus in the stack trace.
 *
 * 这里没有提到类名，但将在生成的工厂函数名中，因此在堆栈跟踪中。
 *
 * @codeGenApi
 */
export function ɵɵinvalidFactoryDep(index: number): never {
  throw new RuntimeError(
      RuntimeErrorCode.INVALID_FACTORY_DEPENDENCY,
      ngDevMode &&
          `This constructor is not compatible with Angular Dependency Injection because its dependency at index ${
              index} of the parameter list is invalid.
This can happen if the dependency type is a primitive like a string or if an ancestor of this class is missing an Angular decorator.

Please check that 1) the type for the parameter at index ${
              index} is correct and 2) the correct Angular decorators are defined for this class and its ancestors.`);
}

/**
 * @param token A token that represents a dependency that should be injected.
 *
 * 表示应该注入的依赖项的标记。
 *
 * @returns
 *
 * the injected value if operation is successful, `null` otherwise.
 *
 * 如果操作成功，则注入注入的值，否则为 `null`。
 *
 * @throws if called outside of a supported context.
 *
 * 如果在受支持的上下文之外调用。
 *
 * @publicApi
 */
export function inject<T>(token: ProviderToken<T>): T;
/**
 * @param token A token that represents a dependency that should be injected.
 *
 * 表示应该注入的依赖项的标记。
 * @param flags Control how injection is executed. The flags correspond to injection strategies that
 *     can be specified with parameter decorators `@Host`, `@Self`, `@SkipSelf`, and `@Optional`.
 *
 * 控制注入的执行方式。这些标志对应于可以用参数装饰器 `@Host`、`@Self`、`@SkipSelf` 和
 * `@Optional` 指定的注入策略。
 * @returns
 *
 * the injected value if operation is successful, `null` otherwise.
 *
 * 如果操作成功，则注入注入的值，否则为 `null`。
 * @throws if called outside of a supported context.
 *
 * 如果在受支持的上下文之外调用。
 * @publicApi
 * @deprecated
 *
 * prefer an options object instead of `InjectFlags`
 *
 * 更喜欢 options 对象而不是 `InjectFlags`
 *
 */
export function inject<T>(token: ProviderToken<T>, flags?: InjectFlags): T|null;
/**
 * @param token A token that represents a dependency that should be injected.
 *
 * 表示应该注入的依赖项的标记。
 *
 * @param options Control how injection is executed. Options correspond to injection strategies
 *     that can be specified with parameter decorators `@Host`, `@Self`, `@SkipSelf`, and
 *     `@Optional`.
 *
 * 控制注入的执行方式。选项对应于可以用参数装饰器 `@Host` 、 `@Self` 、 `@SkipSelf` 和 `@Optional` 指定的注入策略。
 *
 * @returns
 *
 * the injected value if operation is successful.
 *
 * 如果操作成功，则注入的值。
 *
 * @throws if called outside of a supported context, or if the token is not found.
 *
 * 如果在受支持的上下文之外调用，或者找不到标记。
 *
 * @publicApi
 */
export function inject<T>(token: ProviderToken<T>, options: InjectOptions&{optional?: false}): T;
/**
 * @param token A token that represents a dependency that should be injected.
 *
 * 表示应该注入的依赖项的标记。
 *
 * @param options Control how injection is executed. Options correspond to injection strategies
 *     that can be specified with parameter decorators `@Host`, `@Self`, `@SkipSelf`, and
 *     `@Optional`.
 *
 * 控制注入的执行方式。选项对应于可以用参数装饰器 `@Host` 、 `@Self` 、 `@SkipSelf` 和 `@Optional` 指定的注入策略。
 *
 * @returns
 *
 * the injected value if operation is successful,  `null` if the token is not
 *     found and optional injection has been requested.
 *
 * 如果操作成功，则为注入的值，如果找不到标记并且已请求可选注入，则为 `null`。
 *
 * @throws if called outside of a supported context, or if the token is not found and optional
 *     injection was not requested.
 *
 * 如果在受支持的上下文之外调用，或者找不到标记并且未请求可选注入。
 *
 * @publicApi
 */
export function inject<T>(token: ProviderToken<T>, options: InjectOptions): T|null;
/**
 * Injects a token from the currently active injector.
 * `inject` is only supported during instantiation of a dependency by the DI system. It can be used
 * during:
 *
 * 从当前活动的注入器注入令牌。`inject` 仅在 DI 系统实例化依赖项期间受支持。它可以在以下期间使用：
 *
 * - Construction \(via the `constructor`\) of a class being instantiated by the DI system, such
 *   as an `@Injectable` or `@Component`.
 *
 *   由 DI 系统实例化的类的构造（通过 `constructor`），例如 `@Injectable` 或 `@Component`。
 *
 * - In the initializer for fields of such classes.
 *
 *   在此类类的字段的初始化器中。
 *
 * - In the factory function specified for `useFactory` of a `Provider` or an `@Injectable`.
 *
 *   在为 `Provider` 的 `@Injectable` `useFactory` 的工厂函数中。
 *
 * - In the `factory` function specified for an `InjectionToken`.
 *
 *   在为 `InjectionToken` 指定的 `factory` 函数中。
 *
 * @param token A token that represents a dependency that should be injected.
 *
 * 表示应该注入的依赖项的标记。
 * @param flags Optional flags that control how injection is executed.
 * The flags correspond to injection strategies that can be specified with
 * parameter decorators `@Host`, `@Self`, `@SkipSelf`, and `@Optional`.
 *
 * 控制执行注入方式的可选标志。这些标志对应于可以使用参数装饰器 `@Host`、`@Self`、`@SkipSef` 和
 * `@Optional` 指定的注入策略。
 * @returns
 *
 * the injected value if operation is successful, `null` otherwise.
 *
 * 如果操作成功，则注入注入的值，否则为 `null`。
 * @throws if called outside of a supported context.
 *
 * 如果注入成功，则为 true，否则为 null。
 * @usageNotes
 *
 * In practice the `inject()` calls are allowed in a constructor, a constructor parameter and a
 * field initializer:
 *
 * 在实践中，构造函数、构造函数参数和字段初始化器中允许进行 `inject()` 调用：
 *
 * ```typescript
 * @Injectable ({providedIn: 'root'})
 * export class Car {
 *   radio: Radio|undefined;
 *   // OK: field initializer
 *   spareTyre = inject(Tyre);
 *
 *   constructor() {
 *     // OK: constructor body
 *     this.radio = inject(Radio);
 *   }
 * }
 * ```
 *
 * It is also legal to call `inject` from a provider's factory:
 *
 * 从提供者的工厂调用 `inject` 也是合法的：
 *
 * ```typescript
 * providers: [
 *   {provide: Car, useFactory: () => {
 *     // OK: a class factory
 *     const engine = inject(Engine);
 *     return new Car(engine);
 *   }}
 * ]
 * ```
 *
 * Calls to the `inject()` function outside of the class creation context will result in error. Most
 * notably, calls to `inject()` are disallowed after a class instance was created, in methods
 * \(including lifecycle hooks\):
 *
 * 在类创建上下文之外调用 `inject()` 函数将导致错误。最值得注意的是，在创建类实例之后，不允许在方法（包括生命周期钩子）中调用 `inject()`）：
 *
 * ```typescript
 * @Component ({ ... })
 * export class CarComponent {
 *   ngOnInit() {
 *     // ERROR: too late, the component instance was already created
 *     const engine = inject(Engine);
 *     engine.start();
 *   }
 * }
 * ```
 *
 * @publicApi
 */
export function inject<T>(
    token: ProviderToken<T>, flags: InjectFlags|InjectOptions = InjectFlags.Default): T|null {
  return ɵɵinject(token, convertToBitFlags(flags));
}

// Converts object-based DI flags (`InjectOptions`) to bit flags (`InjectFlags`).
export function convertToBitFlags(flags: InjectOptions|InjectFlags|undefined): InjectFlags|
    undefined {
  if (typeof flags === 'undefined' || typeof flags === 'number') {
    return flags;
  }

  // While TypeScript doesn't accept it without a cast, bitwise OR with false-y values in
  // JavaScript is a no-op. We can use that for a very codesize-efficient conversion from
  // `InjectOptions` to `InjectFlags`.
  return (InternalInjectFlags.Default |  // comment to force a line break in the formatter
          ((flags.optional && InternalInjectFlags.Optional) as number) |
          ((flags.host && InternalInjectFlags.Host) as number) |
          ((flags.self && InternalInjectFlags.Self) as number) |
          ((flags.skipSelf && InternalInjectFlags.SkipSelf) as number)) as InjectFlags;
}

export function injectArgs(types: (ProviderToken<any>|any[])[]): any[] {
  const args: any[] = [];
  for (let i = 0; i < types.length; i++) {
    const arg = resolveForwardRef(types[i]);
    if (Array.isArray(arg)) {
      if (arg.length === 0) {
        throw new RuntimeError(
            RuntimeErrorCode.INVALID_DIFFER_INPUT,
            ngDevMode && 'Arguments array must have arguments.');
      }
      let type: Type<any>|undefined = undefined;
      let flags: InjectFlags = InjectFlags.Default;

      for (let j = 0; j < arg.length; j++) {
        const meta = arg[j];
        const flag = getInjectFlag(meta);
        if (typeof flag === 'number') {
          // Special case when we handle @Inject decorator.
          if (flag === DecoratorFlags.Inject) {
            type = meta.token;
          } else {
            flags |= flag;
          }
        } else {
          type = meta;
        }
      }

      args.push(ɵɵinject(type!, flags));
    } else {
      args.push(ɵɵinject(arg));
    }
  }
  return args;
}

/**
 * Attaches a given InjectFlag to a given decorator using monkey-patching.
 * Since DI decorators can be used in providers `deps` array \(when provider is configured using
 * `useFactory`\) without initialization \(e.g. `Host`\) and as an instance \(e.g. `new Host()`\), we
 * attach the flag to make it available both as a static property and as a field on decorator
 * instance.
 *
 * 使用 Monkey-patching 将给定的 InjectFlag 附加到给定的装饰器。由于 DI 装饰器可以在 provider `deps`
 * 数组（当使用 `useFactory` 配置提供程序时）而无需初始化（例如 `Host`）和作为实例（例如 `new
 * Host()`）中使用，我们附加标志以使其同时作为静态属性和作为装饰器实例上的字段。
 *
 * @param decorator Provided DI decorator.
 *
 * 提供了 DI 装饰器。
 * @param flag InjectFlag that should be applied.
 *
 * 应该应用的 InjectFlag。
 */
export function attachInjectFlag(decorator: any, flag: InternalInjectFlags|DecoratorFlags): any {
  decorator[DI_DECORATOR_FLAG] = flag;
  decorator.prototype[DI_DECORATOR_FLAG] = flag;
  return decorator;
}

/**
 * Reads monkey-patched property that contains InjectFlag attached to a decorator.
 *
 * 读取包含附加到装饰器的 InjectFlag 的 Monkey-patched 属性。
 *
 * @param token Token that may contain monkey-patched DI flags property.
 *
 * 可能包含猴子修补的 DI flags 属性的标记。
 *
 */
export function getInjectFlag(token: any): number|undefined {
  return token[DI_DECORATOR_FLAG];
}

export function catchInjectorError(
    e: any, token: any, injectorErrorName: string, source: string|null): never {
  const tokenPath: any[] = e[NG_TEMP_TOKEN_PATH];
  if (token[SOURCE]) {
    tokenPath.unshift(token[SOURCE]);
  }
  e.message = formatError('\n' + e.message, tokenPath, injectorErrorName, source);
  e[NG_TOKEN_PATH] = tokenPath;
  e[NG_TEMP_TOKEN_PATH] = null;
  throw e;
}

export function formatError(
    text: string, obj: any, injectorErrorName: string, source: string|null = null): string {
  text = text && text.charAt(0) === '\n' && text.charAt(1) == NO_NEW_LINE ? text.slice(2) : text;
  let context = stringify(obj);
  if (Array.isArray(obj)) {
    context = obj.map(stringify).join(' -> ');
  } else if (typeof obj === 'object') {
    let parts = <string[]>[];
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        let value = obj[key];
        parts.push(
            key + ':' + (typeof value === 'string' ? JSON.stringify(value) : stringify(value)));
      }
    }
    context = `{${parts.join(', ')}}`;
  }
  return `${injectorErrorName}${source ? '(' + source + ')' : ''}[${context}]: ${
      text.replace(NEW_LINE, '\n  ')}`;
}

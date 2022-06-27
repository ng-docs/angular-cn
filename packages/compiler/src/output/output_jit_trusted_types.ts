/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @fileoverview
 * A module to facilitate use of a Trusted Types policy within the JIT
 * compiler. It lazily constructs the Trusted Types policy, providing helper
 * utilities for promoting strings to Trusted Types. When Trusted Types are not
 * available, strings are used as a fallback.
 * @security All use of this module is security-sensitive and should go through
 * security review.
 */

import {global} from '../util';

/**
 * While Angular only uses Trusted Types internally for the time being,
 * references to Trusted Types could leak into our core.d.ts, which would force
 * anyone compiling against @angular/core to provide the @types/trusted-types
 * package in their compilation unit.
 *
 * 虽然 Angular 暂时仅在内部使用受信任类型，但对受信任类型的引用可能会泄漏到我们的 core.d.ts
 * 中，这将迫使任何针对 @angular/core 编译的人在他们的编译单元中提供 @types/trusted-types 包.
 *
 * Until <https://github.com/microsoft/TypeScript/issues/30024> is resolved, we
 * will keep Angular's public API surface free of references to Trusted Types.
 * For internal and semi-private APIs that need to reference Trusted Types, the
 * minimal type definitions for the Trusted Types API provided by this module
 * should be used instead. They are marked as "declare" to prevent them from
 * being renamed by compiler optimization.
 *
 * 在解决<https://github.com/microsoft/TypeScript/issues/30024>之前，我们将保持 Angular 的公共 API
 * 图面不存在对受信任类型的引用。对于需要引用受信任类型的内部和半私有
 * API，应改为使用此模块提供的受信任类型 API
 * 的最小类型定义。它们被标记为“declare”，以防止它们被编译器优化重命名。
 *
 * Adapted from
 * <https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/trusted-types/index.d.ts>
 * but restricted to the API surface used within Angular.
 *
 * 改编自<https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/trusted-types/index.d.ts>
 * ，但仅限于 Angular 中使用的 API 图面。
 *
 */

export declare interface TrustedScript {
  __brand__: 'TrustedScript';
}

export declare interface TrustedTypePolicyFactory {
  createPolicy(policyName: string, policyOptions: {
    createScript?: (input: string) => string,
  }): TrustedTypePolicy;
}

export declare interface TrustedTypePolicy {
  createScript(input: string): TrustedScript;
}


/**
 * The Trusted Types policy, or null if Trusted Types are not
 * enabled/supported, or undefined if the policy has not been created yet.
 *
 * 受信任的类型策略，如果未启用/支持受信任的类型，则为 null ，如果尚未创建策略，则为 undefined 。
 *
 */
let policy: TrustedTypePolicy|null|undefined;

/**
 * Returns the Trusted Types policy, or null if Trusted Types are not
 * enabled/supported. The first call to this function will create the policy.
 *
 * 返回受信任的类型策略，如果不启用/支持受信任的类型，则返回 null 。对此函数的第一次调用将创建策略。
 *
 */
function getPolicy(): TrustedTypePolicy|null {
  if (policy === undefined) {
    policy = null;
    if (global.trustedTypes) {
      try {
        policy =
            (global.trustedTypes as TrustedTypePolicyFactory).createPolicy('angular#unsafe-jit', {
              createScript: (s: string) => s,
            });
      } catch {
        // trustedTypes.createPolicy throws if called with a name that is
        // already registered, even in report-only mode. Until the API changes,
        // catch the error not to break the applications functionally. In such
        // cases, the code will fall back to using strings.
      }
    }
  }
  return policy;
}

/**
 * Unsafely promote a string to a TrustedScript, falling back to strings when
 * Trusted Types are not available.
 *
 * 将字符串不安全地提升为 TrustedScript，在受信任的类型不可用时回退为字符串。
 *
 * @security In particular, it must be assured that the provided string will
 * never cause an XSS vulnerability if used in a context that will be
 * interpreted and executed as a script by a browser, e.g. when calling eval.
 */
function trustedScriptFromString(script: string): TrustedScript|string {
  return getPolicy()?.createScript(script) || script;
}

/**
 * Unsafely call the Function constructor with the given string arguments.
 *
 * 使用给定的字符串参数不安全地调用 Function 构造函数。
 *
 * @security This is a security-sensitive function; any use of this function
 * must go through security review. In particular, it must be assured that it
 * is only called from the JIT compiler, as use in other code can lead to XSS
 * vulnerabilities.
 */
export function newTrustedFunctionForJIT(...args: string[]): Function {
  if (!global.trustedTypes) {
    // In environments that don't support Trusted Types, fall back to the most
    // straightforward implementation:
    return new Function(...args);
  }

  // Chrome currently does not support passing TrustedScript to the Function
  // constructor. The following implements the workaround proposed on the page
  // below, where the Chromium bug is also referenced:
  // https://github.com/w3c/webappsec-trusted-types/wiki/Trusted-Types-for-function-constructor
  const fnArgs = args.slice(0, -1).join(',');
  const fnBody = args[args.length - 1];
  const body = `(function anonymous(${fnArgs}
) { ${fnBody}
})`;

  // Using eval directly confuses the compiler and prevents this module from
  // being stripped out of JS binaries even if not used. The global['eval']
  // indirection fixes that.
  const fn = global['eval'](trustedScriptFromString(body) as string) as Function;
  if (fn.bind === undefined) {
    // Workaround for a browser bug that only exists in Chrome 83, where passing
    // a TrustedScript to eval just returns the TrustedScript back without
    // evaluating it. In that case, fall back to the most straightforward
    // implementation:
    return new Function(...args);
  }

  // To completely mimic the behavior of calling "new Function", two more
  // things need to happen:
  // 1. Stringifying the resulting function should return its source code
  fn.toString = () => body;
  // 2. When calling the resulting function, `this` should refer to `global`
  return fn.bind(global);

  // When Trusted Types support in Function constructors is widely available,
  // the implementation of this function can be simplified to:
  // return new Function(...args.map(a => trustedScriptFromString(a)));
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @fileoverview
 * A module to facilitate use of a Trusted Types policy internally within
 * Angular specifically for bypassSecurityTrust* and custom sanitizers. It
 * lazily constructs the Trusted Types policy, providing helper utilities for
 * promoting strings to Trusted Types. When Trusted Types are not available,
 * strings are used as a fallback.
 * @security All use of this module is security-sensitive and should go through
 * security review.
 */

import {global} from '../global';

import {TrustedHTML, TrustedScript, TrustedScriptURL, TrustedTypePolicy, TrustedTypePolicyFactory} from './trusted_type_defs';

/**
 * The Trusted Types policy, or null if Trusted Types are not
 * enabled/supported, or undefined if the policy has not been created yet.
 *
 * 受信任的类型策略，如果不启用/支持受信任的类型，则为 null ，如果尚未创建策略，则为 undefined 。
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
        policy = (global.trustedTypes as TrustedTypePolicyFactory)
                     .createPolicy('angular#unsafe-bypass', {
                       createHTML: (s: string) => s,
                       createScript: (s: string) => s,
                       createScriptURL: (s: string) => s,
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
 * Unsafely promote a string to a TrustedHTML, falling back to strings when
 * Trusted Types are not available.
 *
 * 将字符串不安全地提升为 TrustedHTML，在受信任的类型不可用时回退为字符串。
 *
 * @security This is a security-sensitive function; any use of this function
 * must go through security review. In particular, it must be assured that it
 * is only passed strings that come directly from custom sanitizers or the
 * bypassSecurityTrust* functions.
 */
export function trustedHTMLFromStringBypass(html: string): TrustedHTML|string {
  return getPolicy()?.createHTML(html) || html;
}

/**
 * Unsafely promote a string to a TrustedScript, falling back to strings when
 * Trusted Types are not available.
 *
 * 将字符串不安全地提升为 TrustedScript，在受信任的类型不可用时回退为字符串。
 *
 * @security This is a security-sensitive function; any use of this function
 * must go through security review. In particular, it must be assured that it
 * is only passed strings that come directly from custom sanitizers or the
 * bypassSecurityTrust* functions.
 */
export function trustedScriptFromStringBypass(script: string): TrustedScript|string {
  return getPolicy()?.createScript(script) || script;
}

/**
 * Unsafely promote a string to a TrustedScriptURL, falling back to strings
 * when Trusted Types are not available.
 *
 * 将字符串不安全地提升为 TrustedScriptURL，在受信任的类型不可用时回退为字符串。
 *
 * @security This is a security-sensitive function; any use of this function
 * must go through security review. In particular, it must be assured that it
 * is only passed strings that come directly from custom sanitizers or the
 * bypassSecurityTrust* functions.
 */
export function trustedScriptURLFromStringBypass(url: string): TrustedScriptURL|string {
  return getPolicy()?.createScriptURL(url) || url;
}

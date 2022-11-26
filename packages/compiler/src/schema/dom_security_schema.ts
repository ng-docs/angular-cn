/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {SecurityContext} from '../core';

// =================================================================================================
// =================================================================================================
// =========== S T O P   -  S T O P   -  S T O P   -  S T O P   -  S T O P   -  S T O P  ===========
// =================================================================================================
// =================================================================================================
//
//        DO NOT EDIT THIS LIST OF SECURITY SENSITIVE PROPERTIES WITHOUT A SECURITY REVIEW!
//                               Reach out to mprobst for details.
//
// =================================================================================================

/**
 * Map from tagName|propertyName to SecurityContext. Properties applying to all tags use '\*'.
 *
 * 从 tagName|propertyName 映射到 SecurityContext。适用于所有标签的属性都使用 '\*'。
 *
 */
let _SECURITY_SCHEMA!: {[k: string]: SecurityContext};

export function SECURITY_SCHEMA(): {[k: string]: SecurityContext} {
  if (!_SECURITY_SCHEMA) {
    _SECURITY_SCHEMA = {};
    // Case is insignificant below, all element and attribute names are lower-cased for lookup.

    registerContext(SecurityContext.HTML, [
      'iframe|srcdoc',
      '*|innerHTML',
      '*|outerHTML',
    ]);
    registerContext(SecurityContext.STYLE, ['*|style']);
    // NB: no SCRIPT contexts here, they are never allowed due to the parser stripping them.
    registerContext(SecurityContext.URL, [
      '*|formAction',
      'area|href',
      'area|ping',
      'audio|src',
      'a|href',
      'a|ping',
      'blockquote|cite',
      'body|background',
      'del|cite',
      'form|action',
      'img|src',
      'input|src',
      'ins|cite',
      'q|cite',
      'source|src',
      'track|src',
      'video|poster',
      'video|src',
    ]);
    registerContext(SecurityContext.RESOURCE_URL, [
      'applet|code',
      'applet|codebase',
      'base|href',
      'embed|src',
      'frame|src',
      'head|profile',
      'html|manifest',
      'iframe|src',
      'link|href',
      'media|src',
      'object|codebase',
      'object|data',
      'script|src',
    ]);
  }
  return _SECURITY_SCHEMA;
}

function registerContext(ctx: SecurityContext, specs: string[]) {
  for (const spec of specs) _SECURITY_SCHEMA[spec.toLowerCase()] = ctx;
}

/**
 * The set of security-sensitive attributes of an `<iframe>` that *must* be
 * applied as a static attribute only. This ensures that all security-sensitive
 * attributes are taken into account while creating an instance of an `<iframe>`
 * at runtime.
 *
 * `<iframe>` 的安全敏感属性集，*必须*仅作为静态属性应用。这可确保在运行时创建 `<iframe>` 实例时考虑所有安全敏感属性。
 *
 * Note: avoid using this set directly, use the `isIframeSecuritySensitiveAttr` function
 * in the code instead.
 *
 * 注意：避免直接使用此集，请改用代码中的 `isIframeSecuritySensitiveAttr` 函数。
 *
 */
export const IFRAME_SECURITY_SENSITIVE_ATTRS =
    new Set(['sandbox', 'allow', 'allowfullscreen', 'referrerpolicy', 'csp', 'fetchpriority']);

/**
 * Checks whether a given attribute name might represent a security-sensitive
 * attribute of an <iframe>.
 *
 * 检查给定的属性名称是否可能表示<iframe>.
 *
 */
export function isIframeSecuritySensitiveAttr(attrName: string): boolean {
  // The `setAttribute` DOM API is case-insensitive, so we lowercase the value
  // before checking it against a known security-sensitive attributes.
  return IFRAME_SECURITY_SENSITIVE_ATTRS.has(attrName.toLowerCase());
}

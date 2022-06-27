/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Set of tagName|propertyName corresponding to Trusted Types sinks. Properties applying to all
 * tags use '\*'.
 *
 * 与 Trusted Types 接收器对应的 tagName|propertyName 集。适用于所有标签的属性都使用 '\*'。
 *
 * Extracted from, and should be kept in sync with
 * <https://w3c.github.io/webappsec-trusted-types/dist/spec/#integrations>
 *
 * 从<https://w3c.github.io/webappsec-trusted-types/dist/spec/#integrations>提取并应保持同步
 *
 */
const TRUSTED_TYPES_SINKS = new Set<string>([
  // NOTE: All strings in this set *must* be lowercase!

  // TrustedHTML
  'iframe|srcdoc',
  '*|innerhtml',
  '*|outerhtml',

  // NB: no TrustedScript here, as the corresponding tags are stripped by the compiler.

  // TrustedScriptURL
  'embed|src',
  'object|codebase',
  'object|data',
]);

/**
 * isTrustedTypesSink returns true if the given property on the given DOM tag is a Trusted Types
 * sink. In that case, use `ElementSchemaRegistry.securityContext` to determine which particular
 * Trusted Type is required for values passed to the sink:
 *
 * 如果给定 DOM 标签上的给定属性是 Trusted Types 接收器，则 isTrustedTypesSink 会返回
 * true。在这种情况下，请使用 `ElementSchemaRegistry.securityContext`
 * 来确定传递给接收器的值需要哪个特定的 Trusted Type：
 *
 * - SecurityContext.HTML corresponds to TrustedHTML
 *
 *   SecurityContext.HTML 对应于 TrustedHTML
 *
 * - SecurityContext.RESOURCE_URL corresponds to TrustedScriptURL
 *
 *   SecurityContext.RESOURCE_URL 对应于 TrustedScriptURL
 *
 */
export function isTrustedTypesSink(tagName: string, propName: string): boolean {
  // Make sure comparisons are case insensitive, so that case differences between attribute and
  // property names do not have a security impact.
  tagName = tagName.toLowerCase();
  propName = propName.toLowerCase();

  return TRUSTED_TYPES_SINKS.has(tagName + '|' + propName) ||
      TRUSTED_TYPES_SINKS.has('*|' + propName);
}

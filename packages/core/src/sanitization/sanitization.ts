/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {RuntimeError, RuntimeErrorCode} from '../errors';
import {getDocument} from '../render3/interfaces/document';
import {SANITIZER} from '../render3/interfaces/view';
import {getLView} from '../render3/state';
import {renderStringify} from '../render3/util/stringify_utils';
import {TrustedHTML, TrustedScript, TrustedScriptURL} from '../util/security/trusted_type_defs';
import {trustedHTMLFromString, trustedScriptURLFromString} from '../util/security/trusted_types';
import {trustedHTMLFromStringBypass, trustedScriptFromStringBypass, trustedScriptURLFromStringBypass} from '../util/security/trusted_types_bypass';

import {allowSanitizationBypassAndThrow, BypassType, unwrapSafeValue} from './bypass';
import {_sanitizeHtml as _sanitizeHtml} from './html_sanitizer';
import {Sanitizer} from './sanitizer';
import {SecurityContext} from './security';
import {_sanitizeUrl as _sanitizeUrl} from './url_sanitizer';



/**
 * An `html` sanitizer which converts untrusted `html` **string** into trusted string by removing
 * dangerous content.
 *
 * 一种 `html` 清洁器，可通过删除危险内容将不受信任的 `html`**字符串**转换为受信任的字符串。
 *
 * This method parses the `html` and locates potentially dangerous content (such as urls and
 * javascript) and removes it.
 *
 * 此方法会解析 `html` 并定位具有潜在危险的内容（例如 urls 和 javascript）并将其删除。
 *
 * It is possible to mark a string as trusted by calling {@link bypassSanitizationTrustHtml}.
 *
 * 可以通过调用 {@link bypassSanitizationTrustHtml} 来将字符串标记为受信任。
 *
 * @param unsafeHtml untrusted `html`, typically from the user.
 *
 * 不受信任的 `html` ，通常来自用户。
 *
 * @returns
 *
 * `html` string which is safe to display to user, because all of the dangerous javascript
 * and urls have been removed.
 *
 * 可以安全地显示给用户的 `html` 字符串，因为所有危险的 javascript 和 url 都已删除。
 *
 * @codeGenApi
 */
export function ɵɵsanitizeHtml(unsafeHtml: any): TrustedHTML|string {
  const sanitizer = getSanitizer();
  if (sanitizer) {
    return trustedHTMLFromStringBypass(sanitizer.sanitize(SecurityContext.HTML, unsafeHtml) || '');
  }
  if (allowSanitizationBypassAndThrow(unsafeHtml, BypassType.Html)) {
    return trustedHTMLFromStringBypass(unwrapSafeValue(unsafeHtml));
  }
  return _sanitizeHtml(getDocument(), renderStringify(unsafeHtml));
}

/**
 * A `style` sanitizer which converts untrusted `style` **string** into trusted string by removing
 * dangerous content.
 *
 * 一种 `style` 消毒器，可通过删除危险内容将不受信任的 `style`**字符串**转换为受信任的字符串。
 *
 * It is possible to mark a string as trusted by calling {@link bypassSanitizationTrustStyle}.
 *
 * 可以通过调用 {@link bypassSanitizationTrustStyle} 来将字符串标记为受信任。
 *
 * @param unsafeStyle untrusted `style`, typically from the user.
 *
 * 不受信任的 `style` ，通常来自用户。
 *
 * @returns
 *
 * `style` string which is safe to bind to the `style` properties.
 *
 * 可以安全地绑定到 `style` 属性的 `style` 字符串。
 *
 * @codeGenApi
 */
export function ɵɵsanitizeStyle(unsafeStyle: any): string {
  const sanitizer = getSanitizer();
  if (sanitizer) {
    return sanitizer.sanitize(SecurityContext.STYLE, unsafeStyle) || '';
  }
  if (allowSanitizationBypassAndThrow(unsafeStyle, BypassType.Style)) {
    return unwrapSafeValue(unsafeStyle);
  }
  return renderStringify(unsafeStyle);
}

/**
 * A `url` sanitizer which converts untrusted `url` **string** into trusted string by removing
 * dangerous
 * content.
 *
 * 一种 `url` 清洁器，可通过删除危险内容将不受信任的 `url`**字符串**转换为受信任的字符串。
 *
 * This method parses the `url` and locates potentially dangerous content (such as javascript) and
 * removes it.
 *
 * 此方法会解析 `url` 并定位具有潜在危险的内容（例如 javascript）并将其删除。
 *
 * It is possible to mark a string as trusted by calling {@link bypassSanitizationTrustUrl}.
 *
 * 可以通过调用 {@link bypassSanitizationTrustUrl} 来将字符串标记为受信任。
 *
 * @param unsafeUrl untrusted `url`, typically from the user.
 *
 * 不受信任的 `url` ，通常来自用户。
 *
 * @returns
 *
 * `url` string which is safe to bind to the `src` properties such as `<img src>`, because
 * all of the dangerous javascript has been removed.
 *
 * 可以安全绑定到 `src` 属性的 `url` 字符串，例如 `<img src>` ，因为所有危险的 javascript 都已删除。
 *
 * @codeGenApi
 */
export function ɵɵsanitizeUrl(unsafeUrl: any): string {
  const sanitizer = getSanitizer();
  if (sanitizer) {
    return sanitizer.sanitize(SecurityContext.URL, unsafeUrl) || '';
  }
  if (allowSanitizationBypassAndThrow(unsafeUrl, BypassType.Url)) {
    return unwrapSafeValue(unsafeUrl);
  }
  return _sanitizeUrl(renderStringify(unsafeUrl));
}

/**
 * A `url` sanitizer which only lets trusted `url`s through.
 *
 * 一种 `url` 清洁器，仅允许受信任的 `url` 通过。
 *
 * This passes only `url`s marked trusted by calling {@link bypassSanitizationTrustResourceUrl}.
 *
 * 这仅通过调用 {@link bypassSanitizationTrustResourceUrl} 来传递标记为受信任的 `url` 。
 *
 * @param unsafeResourceUrl untrusted `url`, typically from the user.
 *
 * 不受信任的 `url` ，通常来自用户。
 *
 * @returns
 *
 * `url` string which is safe to bind to the `src` properties such as `<img src>`, because
 * only trusted `url`s have been allowed to pass.
 *
 * 可以安全地绑定到 `src` 属性的 `url` 字符串，例如 `<img src>` ，因为只有受信任的 `url`
 * 被允许通过。
 *
 * @codeGenApi
 */
export function ɵɵsanitizeResourceUrl(unsafeResourceUrl: any): TrustedScriptURL|string {
  const sanitizer = getSanitizer();
  if (sanitizer) {
    return trustedScriptURLFromStringBypass(
        sanitizer.sanitize(SecurityContext.RESOURCE_URL, unsafeResourceUrl) || '');
  }
  if (allowSanitizationBypassAndThrow(unsafeResourceUrl, BypassType.ResourceUrl)) {
    return trustedScriptURLFromStringBypass(unwrapSafeValue(unsafeResourceUrl));
  }
  const errorMessage = (typeof ngDevMode === 'undefined' || ngDevMode) ?
      'unsafe value used in a resource URL context (see https://g.co/ng/security#xss)' :
      '';
  throw new RuntimeError(RuntimeErrorCode.UNSAFE_VALUE_IN_RESOURCE_URL, errorMessage);
}

/**
 * A `script` sanitizer which only lets trusted javascript through.
 *
 * 一种 `script` 清洁器，仅允许受信任的 javascript 通过。
 *
 * This passes only `script`s marked trusted by calling {@link
 * bypassSanitizationTrustScript}.
 *
 * 这只会通过调用 {@link bypassSanitizationTrustScript} 来传递标记为受信任的 `script` 。
 *
 * @param unsafeScript untrusted `script`, typically from the user.
 *
 * 不受信任的 `script` ，通常来自用户。
 *
 * @returns
 *
 * `url` string which is safe to bind to the `<script>` element such as `<img src>`,
 * because only trusted `scripts` have been allowed to pass.
 *
 * 可以安全绑定到 `<script>` 元素的 `url` 字符串，例如 `<img src>` ，因为只有受信任的 `scripts`
 * 被允许通过。
 *
 * @codeGenApi
 */
export function ɵɵsanitizeScript(unsafeScript: any): TrustedScript|string {
  const sanitizer = getSanitizer();
  if (sanitizer) {
    return trustedScriptFromStringBypass(
        sanitizer.sanitize(SecurityContext.SCRIPT, unsafeScript) || '');
  }
  if (allowSanitizationBypassAndThrow(unsafeScript, BypassType.Script)) {
    return trustedScriptFromStringBypass(unwrapSafeValue(unsafeScript));
  }
  const errorMessage = (typeof ngDevMode === 'undefined' || ngDevMode) ?
      'unsafe value used in a script context' :
      '';
  throw new RuntimeError(RuntimeErrorCode.UNSAFE_VALUE_IN_SCRIPT, errorMessage);
}

/**
 * A template tag function for promoting the associated constant literal to a
 * TrustedHTML. Interpolation is explicitly not allowed.
 *
 * 用于将关联的常量文字提升为 TrustedHTML 的模板标记函数。显式不允许插值。
 *
 * @param html constant template literal containing trusted HTML.
 *
 * 包含受信任的 HTML 的常量模板文字。
 *
 * @returns
 *
 * TrustedHTML wrapping `html`.
 *
 * TrustedHTML 包装 `html` 。
 *
 * @security This is a security-sensitive function and should only be used to
 * convert constant values of attributes and properties found in
 * application-provided Angular templates to TrustedHTML.
 * @codeGenApi
 */
export function ɵɵtrustConstantHtml(html: TemplateStringsArray): TrustedHTML|string {
  // The following runtime check ensures that the function was called as a
  // template tag (e.g. ɵɵtrustConstantHtml`content`), without any interpolation
  // (e.g. not ɵɵtrustConstantHtml`content ${variable}`). A TemplateStringsArray
  // is an array with a `raw` property that is also an array. The associated
  // template literal has no interpolation if and only if the length of the
  // TemplateStringsArray is 1.
  if (ngDevMode && (!Array.isArray(html) || !Array.isArray(html.raw) || html.length !== 1)) {
    throw new Error(`Unexpected interpolation in trusted HTML constant: ${html.join('?')}`);
  }
  return trustedHTMLFromString(html[0]);
}

/**
 * A template tag function for promoting the associated constant literal to a
 * TrustedScriptURL. Interpolation is explicitly not allowed.
 *
 * 用于将关联的常量文字提升为 TrustedScriptURL 的模板标记函数。显式不允许插值。
 *
 * @param url constant template literal containing a trusted script URL.
 *
 * 包含受信任的脚本 URL 的常量模板文字。
 *
 * @returns
 *
 * TrustedScriptURL wrapping `url`.
 *
 * TrustedScriptURL 包装 `url` 。
 *
 * @security This is a security-sensitive function and should only be used to
 * convert constant values of attributes and properties found in
 * application-provided Angular templates to TrustedScriptURL.
 * @codeGenApi
 */
export function ɵɵtrustConstantResourceUrl(url: TemplateStringsArray): TrustedScriptURL|string {
  // The following runtime check ensures that the function was called as a
  // template tag (e.g. ɵɵtrustConstantResourceUrl`content`), without any
  // interpolation (e.g. not ɵɵtrustConstantResourceUrl`content ${variable}`). A
  // TemplateStringsArray is an array with a `raw` property that is also an
  // array. The associated template literal has no interpolation if and only if
  // the length of the TemplateStringsArray is 1.
  if (ngDevMode && (!Array.isArray(url) || !Array.isArray(url.raw) || url.length !== 1)) {
    throw new Error(`Unexpected interpolation in trusted URL constant: ${url.join('?')}`);
  }
  return trustedScriptURLFromString(url[0]);
}

/**
 * Detects which sanitizer to use for URL property, based on tag name and prop name.
 *
 * 根据标签名称和道具名称检测要用于 URL 属性的清洁器。
 *
 * The rules are based on the RESOURCE_URL context config from
 * `packages/compiler/src/schema/dom_security_schema.ts`.
 * If tag and prop names don't match Resource URL schema, use URL sanitizer.
 *
 * 这些规则基于 `packages/compiler/src/schema/dom_security_schema.ts` 中的 RESOURCE_URL
 * 上下文配置。如果标记和道具名称与资源 URL 架构不匹配，请使用 URL sanitizer。
 *
 */
export function getUrlSanitizer(tag: string, prop: string) {
  if ((prop === 'src' &&
       (tag === 'embed' || tag === 'frame' || tag === 'iframe' || tag === 'media' ||
        tag === 'script')) ||
      (prop === 'href' && (tag === 'base' || tag === 'link'))) {
    return ɵɵsanitizeResourceUrl;
  }
  return ɵɵsanitizeUrl;
}

/**
 * Sanitizes URL, selecting sanitizer function based on tag and property names.
 *
 * 清理 URL，根据标签和属性名称选择 sanitizer 函数。
 *
 * This function is used in case we can't define security context at compile time, when only prop
 * name is available. This happens when we generate host bindings for Directives/Components. The
 * host element is unknown at compile time, so we defer calculation of specific sanitizer to
 * runtime.
 *
 * 如果我们无法在编译时定义安全上下文，则可以用此函数，当时只有 prop
 * 名称可用。当我们为指令/组件生成主机绑定时，会发生这种情况。宿主元素在编译时是未知的，因此我们将特定清洁剂的计算推迟到运行时。
 *
 * @param unsafeUrl untrusted `url`, typically from the user.
 *
 * 不受信任的 `url` ，通常来自用户。
 *
 * @param tag target element tag name.
 *
 * 目标元素标记名称。
 *
 * @param prop name of the property that contains the value.
 *
 * 包含该值的属性的名称。
 *
 * @returns
 *
 * `url` string which is safe to bind.
 *
 * 可以安全绑定的 `url` 字符串。
 *
 * @codeGenApi
 */
export function ɵɵsanitizeUrlOrResourceUrl(unsafeUrl: any, tag: string, prop: string): any {
  return getUrlSanitizer(tag, prop)(unsafeUrl);
}

export function validateAgainstEventProperties(name: string) {
  if (name.toLowerCase().startsWith('on')) {
    const errorMessage =
        `Binding to event property '${name}' is disallowed for security reasons, ` +
        `please use (${name.slice(2)})=...` +
        `\nIf '${name}' is a directive input, make sure the directive is imported by the` +
        ` current module.`;
    throw new RuntimeError(RuntimeErrorCode.INVALID_EVENT_BINDING, errorMessage);
  }
}

export function validateAgainstEventAttributes(name: string) {
  if (name.toLowerCase().startsWith('on')) {
    const errorMessage =
        `Binding to event attribute '${name}' is disallowed for security reasons, ` +
        `please use (${name.slice(2)})=...`;
    throw new RuntimeError(RuntimeErrorCode.INVALID_EVENT_BINDING, errorMessage);
  }
}

function getSanitizer(): Sanitizer|null {
  const lView = getLView();
  return lView && lView[SANITIZER];
}

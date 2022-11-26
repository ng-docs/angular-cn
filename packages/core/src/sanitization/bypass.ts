/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {XSS_SECURITY_URL} from '../error_details_base_url';

export const enum BypassType {
  Url = 'URL',
  Html = 'HTML',
  ResourceUrl = 'ResourceURL',
  Script = 'Script',
  Style = 'Style',
}

/**
 * Marker interface for a value that's safe to use in a particular context.
 *
 * 标记界面，可在特定上下文中安全使用值。
 *
 * @publicApi
 */
export interface SafeValue {}

/**
 * Marker interface for a value that's safe to use as HTML.
 *
 * 标记界面，可安全用作 HTML 值。
 *
 * @publicApi
 */
export interface SafeHtml extends SafeValue {}

/**
 * Marker interface for a value that's safe to use as style (CSS).
 *
 * 标记界面，可安全用作样式（CSS）。
 *
 * @publicApi
 */
export interface SafeStyle extends SafeValue {}

/**
 * Marker interface for a value that's safe to use as JavaScript.
 *
 * 标记界面，可安全用作 JavaScript 的值。
 *
 * @publicApi
 */
export interface SafeScript extends SafeValue {}

/**
 * Marker interface for a value that's safe to use as a URL linking to a document.
 *
 * 标记界面，用于安全地用作链接到文档的 URL 的值。
 *
 * @publicApi
 */
export interface SafeUrl extends SafeValue {}

/**
 * Marker interface for a value that's safe to use as a URL to load executable code from.
 *
 * 标记接口，用于安全地用作 URL 的值，以从中加载可执行代码。
 *
 * @publicApi
 */
export interface SafeResourceUrl extends SafeValue {}


abstract class SafeValueImpl implements SafeValue {
  constructor(public changingThisBreaksApplicationSecurity: string) {}

  abstract getTypeName(): string;

  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity}` +
        ` (see ${XSS_SECURITY_URL})`;
  }
}

class SafeHtmlImpl extends SafeValueImpl implements SafeHtml {
  override getTypeName() {
    return BypassType.Html;
  }
}
class SafeStyleImpl extends SafeValueImpl implements SafeStyle {
  override getTypeName() {
    return BypassType.Style;
  }
}
class SafeScriptImpl extends SafeValueImpl implements SafeScript {
  override getTypeName() {
    return BypassType.Script;
  }
}
class SafeUrlImpl extends SafeValueImpl implements SafeUrl {
  override getTypeName() {
    return BypassType.Url;
  }
}
class SafeResourceUrlImpl extends SafeValueImpl implements SafeResourceUrl {
  override getTypeName() {
    return BypassType.ResourceUrl;
  }
}

export function unwrapSafeValue(value: SafeValue): string;
export function unwrapSafeValue<T>(value: T): T;
export function unwrapSafeValue<T>(value: T|SafeValue): T {
  return value instanceof SafeValueImpl ? value.changingThisBreaksApplicationSecurity as any as T :
                                          value as any as T;
}


export function allowSanitizationBypassAndThrow(
    value: any, type: BypassType.Html): value is SafeHtml;
export function allowSanitizationBypassAndThrow(
    value: any, type: BypassType.ResourceUrl): value is SafeResourceUrl;
export function allowSanitizationBypassAndThrow(
    value: any, type: BypassType.Script): value is SafeScript;
export function allowSanitizationBypassAndThrow(
    value: any, type: BypassType.Style): value is SafeStyle;
export function allowSanitizationBypassAndThrow(value: any, type: BypassType.Url): value is SafeUrl;
export function allowSanitizationBypassAndThrow(value: any, type: BypassType): boolean;
export function allowSanitizationBypassAndThrow(value: any, type: BypassType): boolean {
  const actualType = getSanitizationBypassType(value);
  if (actualType != null && actualType !== type) {
    // Allow ResourceURLs in URL contexts, they are strictly more trusted.
    if (actualType === BypassType.ResourceUrl && type === BypassType.Url) return true;
    throw new Error(`Required a safe ${type}, got a ${actualType} (see ${XSS_SECURITY_URL})`);
  }
  return actualType === type;
}

export function getSanitizationBypassType(value: any): BypassType|null {
  return value instanceof SafeValueImpl && value.getTypeName() as BypassType || null;
}

/**
 * Mark `html` string as trusted.
 *
 * 将 `html` 字符串标记为受信任。
 *
 * This function wraps the trusted string in `String` and brands it in a way which makes it
 * recognizable to {@link htmlSanitizer} to be trusted implicitly.
 *
 * 此函数将受信任的字符串包装在 `String` 中，并以一种使 {@link htmlSanitizer}
 * 可识别为隐式信任的方式对它进行标记。
 *
 * @param trustedHtml `html` string which needs to be implicitly trusted.
 *
 * 需要隐式信任的 `html` 字符串。
 *
 * @returns
 *
 * a `html` which has been branded to be implicitly trusted.
 *
 * 已被标记为隐式信任的 `html` 。
 *
 */
export function bypassSanitizationTrustHtml(trustedHtml: string): SafeHtml {
  return new SafeHtmlImpl(trustedHtml);
}
/**
 * Mark `style` string as trusted.
 *
 * 将 `style` 字符串标记为受信任。
 *
 * This function wraps the trusted string in `String` and brands it in a way which makes it
 * recognizable to {@link styleSanitizer} to be trusted implicitly.
 *
 * 此函数将受信任的字符串包装在 `String` 中，并以一种使 {@link styleSanitizer}
 * 可识别为隐式信任的方式对它进行标记。
 *
 * @param trustedStyle `style` string which needs to be implicitly trusted.
 *
 * 需要隐式信任的 `style` 字符串。
 *
 * @returns
 *
 * a `style` hich has been branded to be implicitly trusted.
 *
 * 一种被认为是隐式信任的 `style` 。
 *
 */
export function bypassSanitizationTrustStyle(trustedStyle: string): SafeStyle {
  return new SafeStyleImpl(trustedStyle);
}
/**
 * Mark `script` string as trusted.
 *
 * 将 `script` 字符串标记为受信任。
 *
 * This function wraps the trusted string in `String` and brands it in a way which makes it
 * recognizable to {@link scriptSanitizer} to be trusted implicitly.
 *
 * 此函数将受信任的字符串包装在 `String` 中，并以一种使 {@link scriptSanitizer}
 * 可识别为隐式信任的方式对它进行标记。
 *
 * @param trustedScript `script` string which needs to be implicitly trusted.
 *
 * 需要隐式信任的 `script` 字符串。
 *
 * @returns
 *
 * a `script` which has been branded to be implicitly trusted.
 *
 * 已被标记为隐式信任的 `script` 。
 *
 */
export function bypassSanitizationTrustScript(trustedScript: string): SafeScript {
  return new SafeScriptImpl(trustedScript);
}
/**
 * Mark `url` string as trusted.
 *
 * 将 `url` 字符串标记为受信任。
 *
 * This function wraps the trusted string in `String` and brands it in a way which makes it
 * recognizable to {@link urlSanitizer} to be trusted implicitly.
 *
 * 此函数将受信任的字符串包装在 `String` 中，并以一种使 {@link urlSanitizer}
 * 可识别为隐式信任的方式对它进行标记。
 *
 * @param trustedUrl `url` string which needs to be implicitly trusted.
 *
 * 需要隐式信任的 `url` 字符串。
 *
 * @returns
 *
 * a `url`  which has been branded to be implicitly trusted.
 *
 * 已被标记为隐式信任的 `url` 。
 *
 */
export function bypassSanitizationTrustUrl(trustedUrl: string): SafeUrl {
  return new SafeUrlImpl(trustedUrl);
}
/**
 * Mark `url` string as trusted.
 *
 * 将 `url` 字符串标记为受信任。
 *
 * This function wraps the trusted string in `String` and brands it in a way which makes it
 * recognizable to {@link resourceUrlSanitizer} to be trusted implicitly.
 *
 * 此函数将受信任的字符串包装在 `String` 中，并以一种使 {@link resourceUrlSanitizer}
 * 可识别为隐式信任的方式对它进行标记。
 *
 * @param trustedResourceUrl `url` string which needs to be implicitly trusted.
 *
 * 需要隐式信任的 `url` 字符串。
 *
 * @returns
 *
 * a `url` which has been branded to be implicitly trusted.
 *
 * 已被标记为隐式信任的 `url` 。
 *
 */
export function bypassSanitizationTrustResourceUrl(trustedResourceUrl: string): SafeResourceUrl {
  return new SafeResourceUrlImpl(trustedResourceUrl);
}

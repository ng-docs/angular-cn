/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


/**
 * A pattern that recognizes a commonly useful subset of URLs that are safe.
 *
 * 一种模式，可以识别通常有用的安全 URL 子集。
 *
 * This regular expression matches a subset of URLs that will not cause script
 * execution if used in URL context within a HTML document. Specifically, this
 * regular expression matches if (comment from here on and regex copied from
 * Soy's EscapingConventions):
 * (1) Either an allowed protocol (http, https, mailto or ftp).
 * (2) or no protocol.  A protocol must be followed by a colon. The below
 *     allows that by allowing colons only after one of the characters [/?#].
 *     A colon after a hash (#) must be in the fragment.
 *     Otherwise, a colon after a (?) must be in a query.
 *     Otherwise, a colon after a single solidus (/) must be in a path.
 *     Otherwise, a colon after a double solidus (//) must be in the authority
 *     (before port).
 *
 * 此正则表达式会匹配如果在 HTML 文档中的 URL 上下文中使用时不会导致脚本执行的 URL
 * 子集。具体来说，此正则表达式与 if （从这里开始的注释和从 Soy 的 EscapingConventions
 * 复制的正则表达式）匹配：（1）允许的协议（http、https、mailto 或 ftp）。
 * （2）或没有协议。协议后面必须跟一个冒号。下面的方法是只允许在字符[/?#][/?#]之一之后使用冒号。哈希
 * (#) 后面的冒号必须在片段中。否则， (?) 之后的冒号必须在查询中。否则，单个斜线 (/)
 * 之后的冒号必须在路径中。否则，双斜线 (//) 之后的冒号必须在权限中（port 之前）。
 *
 * The pattern disallows &, used in HTML entity declarations before
 * one of the characters in [/?#]. This disallows HTML entities used in the
 * protocol name, which should never happen, e.g. "http" for "http".
 * It also disallows HTML entities in the first path part of a relative path,
 * e.g. "foo&lt;bar/baz".  Our existing escaping functions should not produce
 * that. More importantly, it disallows masking of a colon,
 * e.g. "javascript:...".
 *
 * 该模式不允许 & ，在 HTML 实体声明中使用[/?#][/?#]中的字符之一。这不允许在协议名称中使用 HTML
 * 实体，这种情况永远不应该发生，例如“http”代表“http”。它还不允许在相对路径的第一个路径部分中出现
 * HTML
 * 实体，例如“foo&lt;bar/baz”。我们现有的转义函数不应该产生它。更重要的是，它不允许屏蔽冒号，例如“javascript:…”。
 *
 * This regular expression was taken from the Closure sanitization library.
 *
 * 此正则表达式来自 Closure 清理库。
 *
 */
const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi;

/* A pattern that matches safe srcset values */
const SAFE_SRCSET_PATTERN = /^(?:(?:https?|file):|[^&:/?#]*(?:[/?#]|$))/gi;

/**
 * A pattern that matches safe data URLs. Only matches image, video and audio types.
 *
 * 与安全数据 URL 匹配的模式。仅匹配图像、视频和音频类型。
 *
 */
const DATA_URL_PATTERN =
    /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+\/]+=*$/i;

export function _sanitizeUrl(url: string): string {
  url = String(url);
  if (url.match(SAFE_URL_PATTERN) || url.match(DATA_URL_PATTERN)) return url;

  if (typeof ngDevMode === 'undefined' || ngDevMode) {
    console.warn(`WARNING: sanitizing unsafe URL value ${url} (see https://g.co/ng/security#xss)`);
  }

  return 'unsafe:' + url;
}

export function sanitizeSrcset(srcset: string): string {
  srcset = String(srcset);
  return srcset.split(',').map((srcset) => _sanitizeUrl(srcset.trim())).join(', ');
}

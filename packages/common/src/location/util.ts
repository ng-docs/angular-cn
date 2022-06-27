/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


/**
 * Joins two parts of a URL with a slash if needed.
 *
 * 如果需要，使用斜杠连接 URL 的两部分。
 *
 * @param start  URL string
 *
 * 网址字符串
 *
 * @param end    URL string
 *
 * 网址字符串
 *
 * @returns
 *
 * The joined URL string.
 *
 * 联接的 URL 字符串。
 *
 */
export function joinWithSlash(start: string, end: string): string {
  if (start.length == 0) {
    return end;
  }
  if (end.length == 0) {
    return start;
  }
  let slashes = 0;
  if (start.endsWith('/')) {
    slashes++;
  }
  if (end.startsWith('/')) {
    slashes++;
  }
  if (slashes == 2) {
    return start + end.substring(1);
  }
  if (slashes == 1) {
    return start + end;
  }
  return start + '/' + end;
}

/**
 * Removes a trailing slash from a URL string if needed.
 * Looks for the first occurrence of either `#`, `?`, or the end of the
 * line as `/` characters and removes the trailing slash if one exists.
 *
 * 如果需要，从 URL 字符串中删除尾部斜杠。寻找 `#` , `?` 的第一次出现，或将行尾作为 `/`
 * 字符，如果存在，则删除尾部斜杠。
 *
 * @param url URL string.
 *
 * 网址字符串。
 *
 * @returns
 *
 * The URL string, modified if needed.
 *
 * URL 字符串，如果需要，可以修改。
 *
 */
export function stripTrailingSlash(url: string): string {
  const match = url.match(/#|\?|$/);
  const pathEndIdx = match && match.index || url.length;
  const droppedSlashIdx = pathEndIdx - (url[pathEndIdx - 1] === '/' ? 1 : 0);
  return url.slice(0, droppedSlashIdx) + url.slice(pathEndIdx);
}

/**
 * Normalizes URL parameters by prepending with `?` if needed.
 *
 * 通过前缀 `?` 来规范化 URL 参数如果需要。
 *
 * @param  params String of URL parameters.
 * @returns
 *
 * The normalized URL parameters string.
 *
 * 规范化的 URL 参数字符串。
 *
 */
export function normalizeQueryParams(params: string): string {
  return params && params[0] !== '?' ? '?' + params : params;
}

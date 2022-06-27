/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export function stringify(token: any): string {
  if (typeof token === 'string') {
    return token;
  }

  if (Array.isArray(token)) {
    return '[' + token.map(stringify).join(', ') + ']';
  }

  if (token == null) {
    return '' + token;
  }

  if (token.overriddenName) {
    return `${token.overriddenName}`;
  }

  if (token.name) {
    return `${token.name}`;
  }

  const res = token.toString();

  if (res == null) {
    return '' + res;
  }

  const newLineIndex = res.indexOf('\n');
  return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
}

/**
 * Concatenates two strings with separator, allocating new strings only when necessary.
 *
 * 使用分隔符连接两个字符串，仅在必要时分配新字符串。
 *
 * @param before before string.
 *
 * 在字符串之前。
 *
 * @param separator separator string.
 *
 * 分隔符字符串。
 *
 * @param after after string.
 *
 * 在字符串之后。
 *
 * @returns
 *
 * concatenated string.
 *
 * 连接的字符串。
 *
 */
export function concatStringsWithSpace(before: string|null, after: string|null): string {
  return (before == null || before === '') ?
      (after === null ? '' : after) :
      ((after == null || after === '') ? before : before + ' ' + after);
}

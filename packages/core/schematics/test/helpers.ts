/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Template string function that can be used to dedent the resulting
 * string literal. The smallest common indentation will be omitted.
 * Additionally, whitespace in empty lines is removed.
 *
 * 可用于减少结果字符串文字的模板字符串函数。最小的公共缩进将被省略。此外，空行中的空格被删除。
 *
 */
export function dedent(strings: TemplateStringsArray, ...values: any[]) {
  let joinedString = '';
  for (let i = 0; i < values.length; i++) {
    joinedString += `${strings[i]}${values[i]}`;
  }
  joinedString += strings[strings.length - 1];

  const matches = joinedString.match(/^[ \t]*(?=\S)/gm);
  if (matches === null) {
    return joinedString;
  }

  const minLineIndent = Math.min(...matches.map(el => el.length));
  const omitMinIndentRegex = new RegExp(`^[ \\t]{${minLineIndent}}`, 'gm');
  const omitEmptyLineWhitespaceRegex = /^[ \t]+$/gm;
  const result = minLineIndent > 0 ? joinedString.replace(omitMinIndentRegex, '') : joinedString;
  return result.replace(omitEmptyLineWhitespaceRegex, '');
}

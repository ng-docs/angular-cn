/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {assertEqual, throwError} from '../../util/assert';
import {CharCode} from '../../util/char_code';

/**
 * Stores the locations of key/value indexes while parsing styling.
 *
 * 在解析样式时存储键/值索引的位置。
 *
 * In case of `cssText` parsing the indexes are like so:
 *
 * 在 `cssText` 解析的情况下，索引是这样的：
 *
 * ```
 *   "key1: value1; key2: value2; key3: value3"
 *                  ^   ^ ^     ^             ^
 *                  |   | |     |             +-- textEnd
 *                  |   | |     +---------------- valueEnd
 *                  |   | +---------------------- value
 *                  |   +------------------------ keyEnd
 *                  +---------------------------- key
 * ```
 *
 * In case of `className` parsing the indexes are like so:
 *
 * 在 `className` 解析的情况下，索引是这样的：
 *
 * ```
 *   "key1 key2 key3"
 *         ^   ^    ^
 *         |   |    +-- textEnd
 *         |   +------------------------ keyEnd
 *         +---------------------------- key
 * ```
 *
 * NOTE: `value` and `valueEnd` are used only for styles, not classes.
 *
 * 注意： `value` 和 `valueEnd` 仅用于样式，而不用于类。
 *
 */
interface ParserState {
  textEnd: number;
  key: number;
  keyEnd: number;
  value: number;
  valueEnd: number;
}
// Global state of the parser. (This makes parser non-reentrant, but that is not an issue)
const parserState: ParserState = {
  textEnd: 0,
  key: 0,
  keyEnd: 0,
  value: 0,
  valueEnd: 0,
};

/**
 * Retrieves the last parsed `key` of style.
 *
 * 检索 style 的最后一个解析 `key` 。
 *
 * @param text the text to substring the key from.
 *
 * 要作为键的子字符串的文本。
 *
 */
export function getLastParsedKey(text: string): string {
  return text.substring(parserState.key, parserState.keyEnd);
}

/**
 * Retrieves the last parsed `value` of style.
 *
 * 检索 style 的最后解析的 `value` 。
 *
 * @param text the text to substring the key from.
 *
 * 要作为键的子字符串的文本。
 *
 */
export function getLastParsedValue(text: string): string {
  return text.substring(parserState.value, parserState.valueEnd);
}

/**
 * Initializes `className` string for parsing and parses the first token.
 *
 * 初始化 `className` 字符串以进行解析并解析第一个标记。
 *
 * This function is intended to be used in this format:
 *
 * 此函数旨在以这种格式使用：
 *
 * ```
 * for (let i = parseClassName(text); i >= 0; i = parseClassNameNext(text, i)) {
 *   const key = getLastParsedKey();
 *   ...
 * }
 * ```
 *
 * @param text `className` to parse
 *
 * 要 `className` 的类名
 *
 * @returns
 *
 * index where the next invocation of `parseClassNameNext` should resume.
 *
 * 下一次调用 `parseClassNameNext` 应该恢复的索引。
 *
 */
export function parseClassName(text: string): number {
  resetParserState(text);
  return parseClassNameNext(text, consumeWhitespace(text, 0, parserState.textEnd));
}

/**
 * Parses next `className` token.
 *
 * 解析下一个 `className` 标记。
 *
 * This function is intended to be used in this format:
 *
 * 此函数旨在以这种格式使用：
 *
 * ```
 * for (let i = parseClassName(text); i >= 0; i = parseClassNameNext(text, i)) {
 *   const key = getLastParsedKey();
 *   ...
 * }
 * ```
 *
 * @param text `className` to parse
 *
 * 要 `className` 的类名
 *
 * @param index where the parsing should resume.
 *
 * 解析应该在哪里恢复。
 *
 * @returns
 *
 * index where the next invocation of `parseClassNameNext` should resume.
 *
 * 下一次调用 `parseClassNameNext` 应该恢复的索引。
 *
 */
export function parseClassNameNext(text: string, index: number): number {
  const end = parserState.textEnd;
  if (end === index) {
    return -1;
  }
  index = parserState.keyEnd = consumeClassToken(text, parserState.key = index, end);
  return consumeWhitespace(text, index, end);
}

/**
 * Initializes `cssText` string for parsing and parses the first key/values.
 *
 * 初始化 `cssText` 字符串以进行解析并解析第一个键/值。
 *
 * This function is intended to be used in this format:
 *
 * 此函数旨在以这种格式使用：
 *
 * ```
 * for (let i = parseStyle(text); i >= 0; i = parseStyleNext(text, i))) {
 *   const key = getLastParsedKey();
 *   const value = getLastParsedValue();
 *   ...
 * }
 * ```
 *
 * @param text `cssText` to parse
 *
 * 要解析的 `cssText`
 *
 * @returns
 *
 * index where the next invocation of `parseStyleNext` should resume.
 *
 * 下一次调用 `parseStyleNext` 应该恢复的索引。
 *
 */
export function parseStyle(text: string): number {
  resetParserState(text);
  return parseStyleNext(text, consumeWhitespace(text, 0, parserState.textEnd));
}

/**
 * Parses the next `cssText` key/values.
 *
 * 解析下一个 `cssText` 键/值。
 *
 * This function is intended to be used in this format:
 *
 * 此函数旨在以这种格式使用：
 *
 * ```
 * for (let i = parseStyle(text); i >= 0; i = parseStyleNext(text, i))) {
 *   const key = getLastParsedKey();
 *   const value = getLastParsedValue();
 *   ...
 * }
 * ```
 *
 * @param text `cssText` to parse
 *
 * 要解析的 `cssText`
 *
 * @param index where the parsing should resume.
 *
 * 解析应该在哪里恢复。
 *
 * @returns
 *
 * index where the next invocation of `parseStyleNext` should resume.
 *
 * 下一次调用 `parseStyleNext` 应该恢复的索引。
 *
 */
export function parseStyleNext(text: string, startIndex: number): number {
  const end = parserState.textEnd;
  let index = parserState.key = consumeWhitespace(text, startIndex, end);
  if (end === index) {
    // we reached an end so just quit
    return -1;
  }
  index = parserState.keyEnd = consumeStyleKey(text, index, end);
  index = consumeSeparator(text, index, end, CharCode.COLON);
  index = parserState.value = consumeWhitespace(text, index, end);
  index = parserState.valueEnd = consumeStyleValue(text, index, end);
  return consumeSeparator(text, index, end, CharCode.SEMI_COLON);
}

/**
 * Reset the global state of the styling parser.
 *
 * 重置样式解析器的全局状态。
 *
 * @param text The styling text to parse.
 *
 * 要解析的样式文本。
 *
 */
export function resetParserState(text: string): void {
  parserState.key = 0;
  parserState.keyEnd = 0;
  parserState.value = 0;
  parserState.valueEnd = 0;
  parserState.textEnd = text.length;
}

/**
 * Returns index of next non-whitespace character.
 *
 * 返回下一个非空格字符的索引。
 *
 * @param text Text to scan
 *
 * 要扫描的文本
 *
 * @param startIndex Starting index of character where the scan should start.
 *
 * 扫描应该开始的字符的起始索引。
 *
 * @param endIndex Ending index of character where the scan should end.
 *
 * 扫描应该结束的字符的结束索引。
 *
 * @returns
 *
 * Index of next non-whitespace character (May be the same as `start` if no whitespace at
 *          that location.)
 *
 * 下一个非空格字符的索引（如果该位置没有空格，可能与 `start` 相同。）
 *
 */
export function consumeWhitespace(text: string, startIndex: number, endIndex: number): number {
  while (startIndex < endIndex && text.charCodeAt(startIndex) <= CharCode.SPACE) {
    startIndex++;
  }
  return startIndex;
}

/**
 * Returns index of last char in class token.
 *
 * 返回类标记中最后一个 char 的索引。
 *
 * @param text Text to scan
 *
 * 要扫描的文本
 *
 * @param startIndex Starting index of character where the scan should start.
 *
 * 扫描应该开始的字符的起始索引。
 *
 * @param endIndex Ending index of character where the scan should end.
 *
 * 扫描应该结束的字符的结束索引。
 *
 * @returns
 *
 * Index after last char in class token.
 *
 * 类标记中最后一个 char 之后的索引。
 *
 */
export function consumeClassToken(text: string, startIndex: number, endIndex: number): number {
  while (startIndex < endIndex && text.charCodeAt(startIndex) > CharCode.SPACE) {
    startIndex++;
  }
  return startIndex;
}

/**
 * Consumes all of the characters belonging to style key and token.
 *
 * 使用属于样式键和标记的所有字符。
 *
 * @param text Text to scan
 *
 * 要扫描的文本
 *
 * @param startIndex Starting index of character where the scan should start.
 *
 * 扫描应该开始的字符的起始索引。
 *
 * @param endIndex Ending index of character where the scan should end.
 *
 * 扫描应该结束的字符的结束索引。
 *
 * @returns
 *
 * Index after last style key character.
 *
 * 最后一个风格键字符之后的索引。
 *
 */
export function consumeStyleKey(text: string, startIndex: number, endIndex: number): number {
  let ch: number;
  while (startIndex < endIndex &&
         ((ch = text.charCodeAt(startIndex)) === CharCode.DASH || ch === CharCode.UNDERSCORE ||
          ((ch & CharCode.UPPER_CASE) >= CharCode.A && (ch & CharCode.UPPER_CASE) <= CharCode.Z) ||
          (ch >= CharCode.ZERO && ch <= CharCode.NINE))) {
    startIndex++;
  }
  return startIndex;
}

/**
 * Consumes all whitespace and the separator `:` after the style key.
 *
 * 使用样式键之后的所有空格和分隔符 `:` 。
 *
 * @param text Text to scan
 *
 * 要扫描的文本
 *
 * @param startIndex Starting index of character where the scan should start.
 *
 * 扫描应该开始的字符的起始索引。
 *
 * @param endIndex Ending index of character where the scan should end.
 *
 * 扫描应该结束的字符的结束索引。
 *
 * @returns
 *
 * Index after separator and surrounding whitespace.
 *
 * 分隔符和周围的空格之后的索引。
 *
 */
export function consumeSeparator(
    text: string, startIndex: number, endIndex: number, separator: number): number {
  startIndex = consumeWhitespace(text, startIndex, endIndex);
  if (startIndex < endIndex) {
    if (ngDevMode && text.charCodeAt(startIndex) !== separator) {
      malformedStyleError(text, String.fromCharCode(separator), startIndex);
    }
    startIndex++;
  }
  return startIndex;
}


/**
 * Consumes style value honoring `url()` and `""` text.
 *
 * 使用尊重 `url()` 和 `""` 文本的样式值。
 *
 * @param text Text to scan
 *
 * 要扫描的文本
 *
 * @param startIndex Starting index of character where the scan should start.
 *
 * 扫描应该开始的字符的起始索引。
 *
 * @param endIndex Ending index of character where the scan should end.
 *
 * 扫描应该结束的字符的结束索引。
 *
 * @returns
 *
 * Index after last style value character.
 *
 * 最后一个样式值字符之后的索引。
 *
 */
export function consumeStyleValue(text: string, startIndex: number, endIndex: number): number {
  let ch1 = -1;  // 1st previous character
  let ch2 = -1;  // 2nd previous character
  let ch3 = -1;  // 3rd previous character
  let i = startIndex;
  let lastChIndex = i;
  while (i < endIndex) {
    const ch: number = text.charCodeAt(i++);
    if (ch === CharCode.SEMI_COLON) {
      return lastChIndex;
    } else if (ch === CharCode.DOUBLE_QUOTE || ch === CharCode.SINGLE_QUOTE) {
      lastChIndex = i = consumeQuotedText(text, ch, i, endIndex);
    } else if (
        startIndex ===
            i - 4 &&  // We have seen only 4 characters so far "URL(" (Ignore "foo_URL()")
        ch3 === CharCode.U &&
        ch2 === CharCode.R && ch1 === CharCode.L && ch === CharCode.OPEN_PAREN) {
      lastChIndex = i = consumeQuotedText(text, CharCode.CLOSE_PAREN, i, endIndex);
    } else if (ch > CharCode.SPACE) {
      // if we have a non-whitespace character then capture its location
      lastChIndex = i;
    }
    ch3 = ch2;
    ch2 = ch1;
    ch1 = ch & CharCode.UPPER_CASE;
  }
  return lastChIndex;
}

/**
 * Consumes all of the quoted characters.
 *
 * 使用所有引用的字符。
 *
 * @param text Text to scan
 *
 * 要扫描的文本
 *
 * @param quoteCharCode CharCode of either `"` or `'` quote or `)` for `url(...)`.
 *
 * `url(...)` 的 `"` 或 `'` 引用或 `)` 的 CharCode。
 *
 * @param startIndex Starting index of character where the scan should start.
 *
 * 扫描应该开始的字符的起始索引。
 *
 * @param endIndex Ending index of character where the scan should end.
 *
 * 扫描应该结束的字符的结束索引。
 *
 * @returns
 *
 * Index after quoted characters.
 *
 * 引用字符后的索引。
 *
 */
export function consumeQuotedText(
    text: string, quoteCharCode: number, startIndex: number, endIndex: number): number {
  let ch1 = -1;  // 1st previous character
  let index = startIndex;
  while (index < endIndex) {
    const ch = text.charCodeAt(index++);
    if (ch == quoteCharCode && ch1 !== CharCode.BACK_SLASH) {
      return index;
    }
    if (ch == CharCode.BACK_SLASH && ch1 === CharCode.BACK_SLASH) {
      // two back slashes cancel each other out. For example `"\\"` should properly end the
      // quotation. (It should not assume that the last `"` is escaped.)
      ch1 = 0;
    } else {
      ch1 = ch;
    }
  }
  throw ngDevMode ? malformedStyleError(text, String.fromCharCode(quoteCharCode), endIndex) :
                    new Error();
}

function malformedStyleError(text: string, expecting: string, index: number): never {
  ngDevMode && assertEqual(typeof text === 'string', true, 'String expected here');
  throw throwError(
      `Malformed style at location ${index} in string '` + text.substring(0, index) + '[>>' +
      text.substring(index, index + 1) + '<<]' + text.slice(index + 1) +
      `'. Expecting '${expecting}'.`);
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {MessageId, ɵParsedTranslation} from '@angular/localize';

import {Diagnostics} from '../../../diagnostics';

/**
 * Indicates that a parser can parse a given file, with a hint that can be used to speed up actual
 * parsing.
 *
 * 表示解析器可以解析给定的文件，并带有可用于加快实际解析的提示。
 *
 */
export interface CanParseAnalysis<Hint> {
  canParse: true;
  diagnostics: Diagnostics;
  hint: Hint;
}

/**
 * Indicates that a parser cannot parse a given file with diagnostics as why this is.
 *
 * 表明解析器无法通过诊断来解析给定文件，这就是为什么。
 *
 */
export interface CannotParseAnalysis {
  canParse: false;
  diagnostics: Diagnostics;
}

/**
 * Information about whether a `TranslationParser` can parse a given file.
 *
 * 有关 `TranslationParser` 是否可以解析给定文件的信息。
 *
 */
export type ParseAnalysis<Hint> = CanParseAnalysis<Hint>|CannotParseAnalysis;

/**
 * An object that holds translations that have been parsed from a translation file.
 *
 * 包含已从翻译文件解析的翻译的对象。
 *
 */
export interface ParsedTranslationBundle {
  locale: string|undefined;
  translations: Record<MessageId, ɵParsedTranslation>;
  diagnostics: Diagnostics;
}

/**
 * Implement this interface to provide a class that can parse the contents of a translation file.
 *
 * 实现此接口以提供一个可以解析翻译文件内容的类。
 *
 * The `analyze()` method can return a hint that can be used by the `parse()` method to speed
 * up parsing. This allows the parser to do significant work to determine if the file can be parsed
 * without duplicating the work when it comes to actually parsing the file.
 *
 * `canParse()` 方法可以返回一个提示，`parse()`
 * 方法可以用该提示来加快解析速度。这允许解析器做大量工作来确定在实际解析文件时是否可以在不重复工作的情况下解析文件。
 *
 * Example usage:
 *
 * 示例用法：
 *
 * ```
 * const parser: TranslationParser = getParser();
 * const analysis = parser.analyze(filePath, content);
 * if (analysis.canParse) {
 *   return parser.parse(filePath, content, analysis.hint);
 * }
 * ```
 *
 */
export interface TranslationParser<Hint = true> {
  /**
   * Analyze the file to see if this parser can parse the given file.
   *
   * 分析文件以查看此解析器是否可以解析给定的文件。
   *
   * @param filePath The absolute path to the translation file.
   *
   * 翻译文件的绝对路径。
   *
   * @param contents The contents of the translation file.
   *
   * 翻译文件的内容。
   *
   * @returns
   *
   * Information indicating whether the file can be parsed by this parser.
   *
   * 表明此解析器是否可以解析文件的信息。
   *
   */
  analyze(filePath: string, contents: string): ParseAnalysis<Hint>;

  /**
   * Parses the given file, extracting the target locale and translations.
   *
   * 解析给定的文件，提取目标区域设置和翻译。
   *
   * Note that this method should not throw an error. Check the `bundle.diagnostics` property for
   * potential parsing errors and warnings.
   *
   * 请注意，此方法不应抛出错误。检查 `bundle.diagnostics` 属性以获取潜在的解析错误和警告。
   *
   * @param filePath The absolute path to the translation file.
   *
   * 翻译文件的绝对路径。
   *
   * @param contents The contents of the translation file.
   *
   * 翻译文件的内容。
   *
   * @param hint A value that can be used by the parser to speed up parsing of the file. This will
   * have been provided as the return result from calling `analyze()`.
   *
   * 解析器可以用来加快文件解析的值。这将作为调用 `canParse()` 的返回结果提供。
   *
   * @returns
   *
   * The translation bundle parsed from the file.
   *
   * 从文件解析的翻译包。
   *
   * @throws No errors. If there was a problem with parsing the bundle will contain errors
   * in the `diagnostics` property.
   *
   * 没有错误。如果解析包时出现问题，则 `diagnostics` 属性中将包含错误。
   *
   */
  parse(filePath: string, contents: string, hint: Hint): ParsedTranslationBundle;
}

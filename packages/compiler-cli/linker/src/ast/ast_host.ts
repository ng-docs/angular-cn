/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * An abstraction for getting information from an AST while being agnostic to the underlying AST
 * implementation.
 *
 * 从 AST 获取信息的一种抽象，同时与底层 AST 实现无关。
 *
 */
export interface AstHost<TExpression> {
  /**
   * Get the name of the symbol represented by the given expression node, or `null` if it is not a
   * symbol.
   *
   * 获取给定表达式节点表示的符号的名称，如果不是符号，则为 `null` 。
   *
   */
  getSymbolName(node: TExpression): string|null;

  /**
   * Return `true` if the given expression is a string literal, or false otherwise.
   *
   * 如果给定的表达式是字符串文字，则返回 `true` ，否则返回 false 。
   *
   */
  isStringLiteral(node: TExpression): boolean;
  /**
   * Parse the string value from the given expression, or throw if it is not a string literal.
   *
   * 解析给定表达式中的字符串值，如果不是字符串文字，则抛出异常。
   *
   */
  parseStringLiteral(str: TExpression): string;

  /**
   * Return `true` if the given expression is a numeric literal, or false otherwise.
   *
   * 如果给定的表达式是数字文字，则返回 `true` ，否则返回 false 。
   *
   */
  isNumericLiteral(node: TExpression): boolean;
  /**
   * Parse the numeric value from the given expression, or throw if it is not a numeric literal.
   *
   * 解析给定表达式中的数值，如果不是数字文字，则抛出异常。
   *
   */
  parseNumericLiteral(num: TExpression): number;

  /**
   * Return `true` if the given expression can be considered a boolean literal, or false otherwise.
   *
   * 如果给定的表达式可以被认为是布尔文字，则返回 `true` ，否则返回 false 。
   *
   * Note that this should also cover the special case of some minified code where `true` and
   * `false` are replaced by `!0` and `!1` respectively.
   *
   * 请注意，这还应该涵盖某些缩小代码的特殊情况，其中 `true` 和 `false` 分别由 `!0` 和 `!1` 替换。
   *
   */
  isBooleanLiteral(node: TExpression): boolean;
  /**
   * Parse the boolean value from the given expression, or throw if it is not a boolean literal.
   *
   * 解析给定表达式中的布尔值，如果不是布尔文字，则抛出异常。
   *
   * Note that this should also cover the special case of some minified code where `true` and
   * `false` are replaced by `!0` and `!1` respectively.
   *
   * 请注意，这还应该涵盖某些缩小代码的特殊情况，其中 `true` 和 `false` 分别由 `!0` 和 `!1` 替换。
   *
   */
  parseBooleanLiteral(bool: TExpression): boolean;

  /**
   * Return `true` if the given expression is an array literal, or false otherwise.
   *
   * 如果给定的表达式是数组文字，则返回 `true` ，否则返回 false 。
   *
   */
  isArrayLiteral(node: TExpression): boolean;
  /**
   * Parse an array of expressions from the given expression, or throw if it is not an array
   * literal.
   *
   * 从给定的表达式解析表达式数组，如果它不是数组文字，则抛出。
   *
   */
  parseArrayLiteral(array: TExpression): TExpression[];

  /**
   * Return `true` if the given expression is an object literal, or false otherwise.
   *
   * 如果给定的表达式是对象文字，则返回 `true` ，否则返回 false 。
   *
   */
  isObjectLiteral(node: TExpression): boolean;
  /**
   * Parse the given expression into a map of object property names to property expressions, or
   * throw if it is not an object literal.
   *
   * 将给定的表达式解析为对象属性名称到属性表达式的映射，如果它不是对象文字，则 throw 。
   *
   */
  parseObjectLiteral(obj: TExpression): Map<string, TExpression>;

  /**
   * Return `true` if the given expression is a function, or false otherwise.
   *
   * 如果给定的表达式是函数，则返回 `true` ，否则返回 false 。
   *
   */
  isFunctionExpression(node: TExpression): boolean;
  /**
   * Compute the "value" of a function expression by parsing its body for a single `return`
   * statement, extracting the returned expression, or throw if it is not possible.
   *
   * 通过解析函数表达式的主体以获取单个 `return`
   * 语句、提取返回的表达式来计算函数表达式的“值”，如果不可能，则 throw 。
   *
   */
  parseReturnValue(fn: TExpression): TExpression;

  /**
   * Return true if the given expression is a call expression, or false otherwise.
   *
   * 如果给定的表达式是调用表达式，则返回 true ，否则返回 false 。
   *
   */
  isCallExpression(node: TExpression): boolean;
  /**
   * Returns the expression that is called in the provided call expression, or throw if it is not
   * a call expression.
   *
   * 返回在提供的调用表达式中调用的表达式，如果不是调用表达式，则返回 throw。
   *
   */
  parseCallee(call: TExpression): TExpression;
  /**
   * Returns the argument expressions for the provided call expression, or throw if it is not
   * a call expression.
   *
   * 返回所提供的调用表达式的参数表达式，如果不是调用表达式，则返回 throw 。
   *
   */
  parseArguments(call: TExpression): TExpression[];

  /**
   * Compute the location range of the expression in the source file, to be used for source-mapping.
   *
   * 计算表达式在源文件中的位置范围，用于源映射。
   *
   */
  getRange(node: TExpression): Range;
}

/**
 * The location of the start and end of an expression in the original source file.
 *
 * 表达式在原始源文件中的开始和结束的位置。
 *
 */
export interface Range {
  /**
   * 0-based character position of the range start in the source file text.
   *
   * 源文件文本中范围开始的从 0 开始的字符位置。
   *
   */
  startPos: number;
  /**
   * 0-based line index of the range start in the source file text.
   *
   * 源文件文本中开始范围的从 0 开始的行索引。
   *
   */
  startLine: number;
  /**
   * 0-based column position of the range start in the source file text.
   *
   * 源文件文本中范围开始的从 0 开始的列位置。
   *
   */
  startCol: number;
  /**
   * 0-based character position of the range end in the source file text.
   *
   * 源文件文本中范围结尾的从 0 开始的字符位置。
   *
   */
  endPos: number;
}

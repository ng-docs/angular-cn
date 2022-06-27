/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Verify that all functions in the output have a unique name.
 *
 * 验证输出中的所有函数都有唯一名称。
 *
 * @param output Compiler output.
 *
 * 编译器输出。
 *
 * @param functionNamePattern Only match function whose names match this pattern.
 *    Will be converted into a regular expression.
 *
 * 仅 match 名称与此模式匹配的函数。将被转换为正则表达式。
 *
 * @param expectedCount Expected number of functions.
 *
 * 预期的函数数量。
 *
 */
export function verifyUniqueFunctions(
    output: string, functionNamePattern?: string, expectedCount?: number): boolean {
  const pattern = functionNamePattern ? new RegExp(functionNamePattern) : null;
  const allTemplateFunctionsNames = (output.match(/function ([^\s(]+)/g) || [])
                                        .map(match => match.slice(9))
                                        .filter(name => !pattern || pattern.test(name));
  const uniqueTemplateFunctionNames = new Set(allTemplateFunctionsNames);
  const lengthMatches = allTemplateFunctionsNames.length === uniqueTemplateFunctionNames.size;
  const expectedCountMatches =
      (expectedCount == null ? allTemplateFunctionsNames.length > 0 :
                               allTemplateFunctionsNames.length === expectedCount);
  return lengthMatches && expectedCountMatches &&
      allTemplateFunctionsNames.every(name => uniqueTemplateFunctionNames.has(name));
}

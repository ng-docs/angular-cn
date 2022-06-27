/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * The symbol name and import namespace of an imported symbol,
 * which has been registered through the ImportGenerator.
 *
 * 已通过 ImportGenerator 注册的导入符号的符号名称和导入命名空间。
 *
 */
export interface NamedImport<TExpression> {
  /**
   * The import namespace containing this imported symbol.
   *
   * 包含此导入符号的导入命名空间。
   *
   */
  moduleImport: TExpression|null;
  /**
   * The (possibly rewritten) name of the imported symbol.
   *
   * 导入的符号的（可能是重写的）名称。
   *
   */
  symbol: string;
}

/**
 * Generate import information based on the context of the code being generated.
 *
 * 根据正在生成的代码的上下文生成导入信息。
 *
 * Implementations of these methods return a specific identifier that corresponds to the imported
 * module.
 *
 * 这些方法的实现会返回与导入的模块对应的特定标识符。
 *
 */
export interface ImportGenerator<TExpression> {
  generateNamespaceImport(moduleName: string): TExpression;
  generateNamedImport(moduleName: string, originalSymbol: string): NamedImport<TExpression>;
}

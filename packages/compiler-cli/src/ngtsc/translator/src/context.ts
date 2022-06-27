/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * The current context of a translator visitor as it traverses the AST tree.
 *
 * 翻译器访问者遍历 AST 树时的当前上下文。
 *
 * It tracks whether we are in the process of outputting a statement or an expression.
 *
 * 它跟踪我们是正在输出语句还是表达式。
 *
 */
export class Context {
  constructor(readonly isStatement: boolean) {}

  get withExpressionMode(): Context {
    return this.isStatement ? new Context(false) : this;
  }

  get withStatementMode(): Context {
    return !this.isStatement ? new Context(true) : this;
  }
}

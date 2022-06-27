/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {LinkedDefinition} from '../partial_linkers/partial_linker';

import {EmitScope} from './emit_scope';

/**
 * This class is a specialization of the `EmitScope` class that is designed for the situation where
 * there is no clear shared scope for constant statements. In this case they are bundled with the
 * translated definition and will be emitted into an IIFE.
 *
 * 此类是 `EmitScope`
 * 类的特化，专为常量语句没有明确共享范围的情况而设计。在这种情况下，它们与翻译后的定义打包在一起，并将被发出到
 * IIFE 中。
 *
 */
export class LocalEmitScope<TStatement, TExpression> extends EmitScope<TStatement, TExpression> {
  /**
   * Translate the given Output AST definition expression into a generic `TExpression`.
   *
   * 将给定的输出 AST 定义表达式转换为通用 `TExpression` 。
   *
   * Merges the `ConstantPool` statements with the definition statements when generating the
   * definition expression. This means that `ConstantPool` statements will be emitted into an IIFE.
   *
   * 生成定义表达式时，将 `ConstantPool` 语句与定义语句合并。这意味着 `ConstantPool` 语句将被发出到
   * IIFE 中。
   *
   */
  override translateDefinition(definition: LinkedDefinition): TExpression {
    // Treat statements from the ConstantPool as definition statements.
    return super.translateDefinition({
      expression: definition.expression,
      statements: [...this.constantPool.statements, ...definition.statements],
    });
  }

  /**
   * It is not valid to call this method, since there will be no shared constant statements - they
   * are already emitted in the IIFE alongside the translated definition.
   *
   * 调用此方法是无效的，因为不会有共享常量语句 - 它们已经在 IIFE 中与翻译后的定义一起发出。
   *
   */
  override getConstantStatements(): TStatement[] {
    throw new Error('BUG - LocalEmitScope should not expose any constant statements');
  }
}

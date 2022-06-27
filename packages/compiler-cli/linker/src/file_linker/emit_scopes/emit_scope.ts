/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ConstantPool, outputAst as o} from '@angular/compiler';

import {AstFactory} from '../../../../src/ngtsc/translator';
import {LinkerImportGenerator} from '../../linker_import_generator';
import {LinkedDefinition} from '../partial_linkers/partial_linker';
import {Translator} from '../translator';

/**
 * This class represents (from the point of view of the `FileLinker`) the scope in which
 * statements and expressions related to a linked partial declaration will be emitted.
 *
 * 此类表示（从 `FileLinker` 的角度来看）将发出与链接的部分声明相关的语句和表达式的范围。
 *
 * It holds a copy of a `ConstantPool` that is used to capture any constant statements that need to
 * be emitted in this context.
 *
 * 它包含一个 `ConstantPool` 的副本，该副本用于捕获需要在此上下文中发出的任何常量语句。
 *
 * This implementation will emit the definition and the constant statements separately.
 *
 * 此实现将分别发出定义和常量语句。
 *
 */
export class EmitScope<TStatement, TExpression> {
  readonly constantPool = new ConstantPool();

  constructor(
      protected readonly ngImport: TExpression,
      protected readonly translator: Translator<TStatement, TExpression>,
      private readonly factory: AstFactory<TStatement, TExpression>) {}

  /**
   * Translate the given Output AST definition expression into a generic `TExpression`.
   *
   * 将给定的输出 AST 定义表达式转换为通用 `TExpression` 。
   *
   * Use a `LinkerImportGenerator` to handle any imports in the definition.
   *
   * 使用 `LinkerImportGenerator` 来处理定义中的任何导入。
   *
   */
  translateDefinition(definition: LinkedDefinition): TExpression {
    const expression = this.translator.translateExpression(
        definition.expression, new LinkerImportGenerator(this.ngImport));

    if (definition.statements.length > 0) {
      // Definition statements must be emitted "after" the declaration for which the definition is
      // being emitted. However, the linker only transforms individual declaration calls, and can't
      // insert statements after definitions. To work around this, the linker transforms the
      // definition into an IIFE which executes the definition statements before returning the
      // definition expression.
      const importGenerator = new LinkerImportGenerator(this.ngImport);
      return this.wrapInIifeWithStatements(
          expression,
          definition.statements.map(
              statement => this.translator.translateStatement(statement, importGenerator)));
    } else {
      // Since there are no definition statements, just return the definition expression directly.
      return expression;
    }
  }

  /**
   * Return any constant statements that are shared between all uses of this `EmitScope`.
   *
   * 返回在此 `EmitScope` 的所有使用之间共享的任何常量语句。
   *
   */
  getConstantStatements(): TStatement[] {
    const importGenerator = new LinkerImportGenerator(this.ngImport);
    return this.constantPool.statements.map(
        statement => this.translator.translateStatement(statement, importGenerator));
  }

  private wrapInIifeWithStatements(expression: TExpression, statements: TStatement[]): TExpression {
    const returnStatement = this.factory.createReturnStatement(expression);
    const body = this.factory.createBlock([...statements, returnStatement]);
    const fn = this.factory.createFunctionExpression(/* name */ null, /* args */[], body);
    return this.factory.createCallExpression(fn, /* args */[], /* pure */ false);
  }
}

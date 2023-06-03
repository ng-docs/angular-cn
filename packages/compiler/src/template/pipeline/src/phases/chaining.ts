/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as o from '../../../../output/output_ast';
import {Identifiers as R3} from '../../../../render3/r3_identifiers';
import * as ir from '../../ir';
import {ComponentCompilation} from '../compilation';

const CHAINABLE = new Set([
  R3.elementStart,
  R3.elementEnd,
  R3.property,
  R3.elementContainerStart,
  R3.elementContainerEnd,
  R3.elementContainer,
]);

/**
 * Post-process a reified view compilation and convert sequential calls to chainable instructions
 * into chain calls.
 *
 * 对具体化的视图编译进行后处理，并将对可链接指令的顺序调用转换为链式调用。
 *
 * For example, two `elementStart` operations in sequence:
 *
 * 例如，顺序执行两个 `elementStart` 操作：
 *
 * ```typescript
 * elementStart(0, 'div');
 * elementStart(1, 'span');
 * ```
 *
 * Can be called as a chain instead:
 *
 * 可以改为称为链：
 *
 * ```typescript
 * elementStart(0, 'div')(1, 'span');
 * ```
 *
 */
export function phaseChaining(cpl: ComponentCompilation): void {
  for (const [_, view] of cpl.views) {
    chainOperationsInList(view.create);
    chainOperationsInList(view.update);
  }
}

function chainOperationsInList(opList: ir.OpList<ir.CreateOp|ir.UpdateOp>): void {
  let chain: Chain|null = null;
  for (const op of opList) {
    if (op.kind !== ir.OpKind.Statement || !(op.statement instanceof o.ExpressionStatement)) {
      // This type of statement isn't chainable.
      chain = null;
      continue;
    }
    if (!(op.statement.expr instanceof o.InvokeFunctionExpr) ||
        !(op.statement.expr.fn instanceof o.ExternalExpr)) {
      // This is a statement, but not an instruction-type call, so not chainable.
      chain = null;
      continue;
    }

    const instruction = op.statement.expr.fn.value;
    if (!CHAINABLE.has(instruction)) {
      // This instruction isn't chainable.
      chain = null;
      continue;
    }

    // This instruction can be chained. It can either be added on to the previous chain (if
    // compatible) or it can be the start of a new chain.
    if (chain !== null && chain.instruction === instruction) {
      // This instruction can be added onto the previous chain.
      const expression = chain.expression.callFn(
          op.statement.expr.args, op.statement.expr.sourceSpan, op.statement.expr.pure);
      chain.expression = expression;
      chain.op.statement = expression.toStmt();
      ir.OpList.remove(op as ir.Op<ir.CreateOp|ir.UpdateOp>);
    } else {
      // Leave this instruction alone for now, but consider it the start of a new chain.
      chain = {
        op,
        instruction,
        expression: op.statement.expr,
      };
    }
  }
}

/**
 * Structure representing an in-progress chain.
 *
 * 表示正在进行的链的结构。
 *
 */
interface Chain {
  /**
   * The statement which holds the entire chain.
   *
   * 包含整个链的语句。
   *
   */
  op: ir.StatementOp<ir.CreateOp|ir.UpdateOp>;

  /**
   * The expression representing the whole current chained call.
   *
   * 表示整个当前链式调用的表达式。
   *
   * This should be the same as `op.statement.expression`, but is extracted here for convenience
   * since the `op` type doesn't capture the fact that `op.statement` is an `o.ExpressionStatement`.
   *
   * 这应该与 `op.statement.expression` 相同，但为方便起见在此处提取，因为 `op` 类型未捕获 `op.statement` 是 `o.ExpressionStatement` 的事实。
   *
   */
  expression: o.Expression;

  /**
   * The instruction that is being chained.
   *
   * 被链接的指令。
   *
   */
  instruction: o.ExternalReference;
}

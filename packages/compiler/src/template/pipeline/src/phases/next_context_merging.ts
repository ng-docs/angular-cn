/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as o from '../../../../output/output_ast';
import * as ir from '../../ir';

import type {ComponentCompilation} from '../compilation';

/**
 * Merges logically sequential `NextContextExpr` operations.
 *
 * 合并逻辑顺序的 `NextContextExpr` 操作。
 *
 * `NextContextExpr` can be referenced repeatedly, "popping" the runtime's context stack each time.
 * When two such expressions appear back-to-back, it's possible to merge them together into a single
 * `NextContextExpr` that steps multiple contexts. This merging is possible if all conditions are
 * met:
 *
 * `NextContextExpr` 可以重复引用，每次都“弹出”运行时的上下文堆栈。当两个这样的表达式背靠背出现时，可以将它们合并到一个单步执行多个上下文的 `NextContextExpr` 中。如果满足所有条件，则可以进行此合并：
 *
 * - The result of the `NextContextExpr` that's folded into the subsequent one is not stored \(that
 *   is, the call is purely side-effectful\).
 *
 *   折叠到后续结果中的 `NextContextExpr` 的结果不会被存储（也就是说，调用纯粹是副作用）。
 *
 * - No operations in between them uses the implicit context.
 *
 *   它们之间的任何操作都不使用隐式上下文。
 *
 */
export function phaseMergeNextContext(cpl: ComponentCompilation): void {
  for (const view of cpl.views.values()) {
    for (const op of view.create) {
      if (op.kind === ir.OpKind.Listener) {
        mergeNextContextsInOps(op.handlerOps);
      }
    }
    mergeNextContextsInOps(view.update);
  }
}

function mergeNextContextsInOps(ops: ir.OpList<ir.UpdateOp>): void {
  for (const op of ops) {
    // Look for a candidate operation to maybe merge.
    if (op.kind !== ir.OpKind.Statement || !(op.statement instanceof o.ExpressionStatement) ||
        !(op.statement.expr instanceof ir.NextContextExpr)) {
      continue;
    }

    const mergeSteps = op.statement.expr.steps;

    // Try to merge this `ir.NextContextExpr`.
    let tryToMerge = true;
    for (let candidate = op.next!; candidate.kind !== ir.OpKind.ListEnd && tryToMerge;
         candidate = candidate.next!) {
      ir.visitExpressionsInOp(candidate, (expr, flags) => {
        if (!ir.isIrExpression(expr)) {
          return expr;
        }

        if (!tryToMerge) {
          // Either we've already merged, or failed to merge.
          return;
        }

        if (flags & ir.VisitorContextFlag.InChildOperation) {
          // We cannot merge into child operations.
          return;
        }

        switch (expr.kind) {
          case ir.ExpressionKind.NextContext:
            // Merge the previous `ir.NextContextExpr` into this one.
            expr.steps += mergeSteps;
            ir.OpList.remove(op as ir.UpdateOp);
            tryToMerge = false;
            break;
          case ir.ExpressionKind.GetCurrentView:
          case ir.ExpressionKind.Reference:
            // Can't merge past a dependency on the context.
            tryToMerge = false;
            break;
        }
      });
    }
  }
}

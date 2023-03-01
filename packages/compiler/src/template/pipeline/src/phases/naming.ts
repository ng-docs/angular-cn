/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as ir from '../../ir';

import type {ComponentCompilation, ViewCompilation} from '../compilation';

/**
 * Generate names for functions and variables across all views.
 *
 * This includes propagating those names into any `ir.ReadVariableExpr`s of those variables, so that
 * the reads can be emitted correctly.
 */
export function phaseNaming(cpl: ComponentCompilation): void {
  addNamesToView(cpl.root, {index: 0});
}

function addNamesToView(view: ViewCompilation, state: {index: number}): void {
  if (view.fnName === null) {
    // TODO(alxhub): convert this temporary name to match how the `TemplateDefinitionBuilder`
    // names embedded view functions.
    if (view === view.tpl.root) {
      view.fnName = `${view.tpl.componentName}_Template`;
    } else {
      view.fnName = `${view.tpl.componentName}_EmbeddedView_${state.index++}`;
    }
  }

  // Keep track of the names we assign to variables in the view. We'll need to propagate these
  // into reads of those variables afterwards.
  const varNames = new Map<ir.XrefId, string>();

  for (const op of view.ops()) {
    switch (op.kind) {
      case ir.OpKind.Listener:
        if (op.handlerFnName === null) {
          // TODO(alxhub): convert this temporary name to match how the
          // `TemplateDefinitionBuilder` names listener functions.
          op.handlerFnName = `${view.fnName}_${op.name}_listener`;
        }
        break;
      case ir.OpKind.Variable:
        varNames.set(op.xref, getVariableName(op.variable, state));
        break;
      case ir.OpKind.Template:
        addNamesToView(view.tpl.views.get(op.xref)!, state);
        break;
    }
  }

  // Having named all variables declared in the view, now we can push those names into the
  // `ir.ReadVariableExpr` expressions which represent reads of those variables.
  for (const op of view.ops()) {
    ir.visitExpressionsInOp(op, expr => {
      if (!(expr instanceof ir.ReadVariableExpr) || expr.name !== null) {
        return;
      }
      if (!varNames.has(expr.xref)) {
        throw new Error(`Variable ${expr.xref} not yet named`);
      }
      expr.name = varNames.get(expr.xref)!;
    });
  }
}

function getVariableName(variable: ir.SemanticVariable, state: {index: number}): string {
  if (variable.name === null) {
    switch (variable.kind) {
      case ir.SemanticVariableKind.Identifier:
        variable.name = `${variable.identifier}_${state.index++}`;
        break;
      default:
        variable.name = `_r${state.index++}`;
        break;
    }
  }
  return variable.name;
}

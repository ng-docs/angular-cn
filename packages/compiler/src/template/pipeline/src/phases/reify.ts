/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as o from '../../../../output/output_ast';
import * as ir from '../../ir';

import type {ComponentCompilation, ViewCompilation} from '../compilation';
import * as ng from '../instruction';

/**
 * Compiles semantic operations across all views and generates output `o.Statement`s with actual
 * runtime calls in their place.
 *
 * 跨所有视图编译语义操作并生成输出 `o.Statement` ，并在其位置上使用实际的运行时调用。
 *
 * Reification replaces semantic operations with selected Ivy instructions and other generated code
 * structures. After reification, the create/update operation lists of all views should only contain
 * `ir.StatementOp`s \(which wrap generated `o.Statement`s\).
 *
 * Reification 用选定的 Ivy 指令和其他生成的代码结构替换语义操作。 具体化后，所有视图的创建/更新操作列表应仅包含 `ir.StatementOp` （包装生成的 `o.Statement` ）。
 *
 */
export function phaseReify(cpl: ComponentCompilation): void {
  for (const [_, view] of cpl.views) {
    reifyCreateOperations(view, view.create);
    reifyUpdateOperations(view, view.update);
  }
}

function reifyCreateOperations(view: ViewCompilation, ops: ir.OpList<ir.CreateOp>): void {
  for (const op of ops) {
    ir.transformExpressionsInOp(op, reifyIrExpression, ir.VisitorContextFlag.None);

    switch (op.kind) {
      case ir.OpKind.Text:
        ir.OpList.replace(op, ng.text(op.slot!, op.initialValue));
        break;
      case ir.OpKind.ElementStart:
        ir.OpList.replace(
            op,
            ng.elementStart(
                op.slot!, op.tag, op.attributes as number | null, op.localRefs as number | null));
        break;
      case ir.OpKind.Element:
        ir.OpList.replace(
            op,
            ng.element(
                op.slot!, op.tag, op.attributes as number | null, op.localRefs as number | null));
        break;
      case ir.OpKind.ElementEnd:
        ir.OpList.replace(op, ng.elementEnd());
        break;
      case ir.OpKind.ContainerStart:
        ir.OpList.replace(
            op,
            ng.elementContainerStart(
                op.slot!, op.attributes as number | null, op.localRefs as number | null));
        break;
      case ir.OpKind.Container:
        ir.OpList.replace(
            op,
            ng.elementContainer(
                op.slot!, op.attributes as number | null, op.localRefs as number | null));
        break;
      case ir.OpKind.ContainerEnd:
        ir.OpList.replace(op, ng.elementContainerEnd());
        break;
      case ir.OpKind.Template:
        const childView = view.tpl.views.get(op.xref)!;
        ir.OpList.replace(
            op,
            ng.template(
                op.slot!,
                o.variable(childView.fnName!),
                childView.decls!,
                childView.vars!,
                op.tag,
                op.attributes as number,
                ),
        );
        break;
      case ir.OpKind.Pipe:
        ir.OpList.replace(op, ng.pipe(op.slot!, op.name));
        break;
      case ir.OpKind.Listener:
        const listenerFn = reifyListenerHandler(view, op.handlerFnName!, op.handlerOps);
        ir.OpList.replace(
            op,
            ng.listener(
                op.name,
                listenerFn,
                ));
        break;
      case ir.OpKind.Variable:
        if (op.variable.name === null) {
          throw new Error(`AssertionError: unnamed variable ${op.xref}`);
        }
        ir.OpList.replace<ir.CreateOp>(
            op,
            ir.createStatementOp(new o.DeclareVarStmt(
                op.variable.name, op.initializer, undefined, o.StmtModifier.Final)));
        break;
      case ir.OpKind.Statement:
        // Pass statement operations directly through.
        break;
      default:
        throw new Error(
            `AssertionError: Unsupported reification of create op ${ir.OpKind[op.kind]}`);
    }
  }
}

function reifyUpdateOperations(_view: ViewCompilation, ops: ir.OpList<ir.UpdateOp>): void {
  for (const op of ops) {
    ir.transformExpressionsInOp(op, reifyIrExpression, ir.VisitorContextFlag.None);

    switch (op.kind) {
      case ir.OpKind.Advance:
        ir.OpList.replace(op, ng.advance(op.delta));
        break;
      case ir.OpKind.Property:
        ir.OpList.replace(op, ng.property(op.name, op.expression));
        break;
      case ir.OpKind.InterpolateProperty:
        ir.OpList.replace(op, ng.propertyInterpolate(op.name, op.strings, op.expressions));
        break;
      case ir.OpKind.InterpolateText:
        ir.OpList.replace(op, ng.textInterpolate(op.strings, op.expressions));
        break;
      case ir.OpKind.Variable:
        if (op.variable.name === null) {
          throw new Error(`AssertionError: unnamed variable ${op.xref}`);
        }
        ir.OpList.replace<ir.UpdateOp>(
            op,
            ir.createStatementOp(new o.DeclareVarStmt(
                op.variable.name, op.initializer, undefined, o.StmtModifier.Final)));
        break;
      case ir.OpKind.Statement:
        // Pass statement operations directly through.
        break;
      default:
        throw new Error(
            `AssertionError: Unsupported reification of update op ${ir.OpKind[op.kind]}`);
    }
  }
}

function reifyIrExpression(expr: o.Expression): o.Expression {
  if (!ir.isIrExpression(expr)) {
    return expr;
  }

  switch (expr.kind) {
    case ir.ExpressionKind.NextContext:
      return ng.nextContext(expr.steps);
    case ir.ExpressionKind.Reference:
      return ng.reference(expr.slot! + 1 + expr.offset);
    case ir.ExpressionKind.LexicalRead:
      throw new Error(`AssertionError: unresolved LexicalRead of ${expr.name}`);
    case ir.ExpressionKind.RestoreView:
      if (typeof expr.view === 'number') {
        throw new Error(`AssertionError: unresolved RestoreView`);
      }
      return ng.restoreView(expr.view);
    case ir.ExpressionKind.ResetView:
      return ng.resetView(expr.expr);
    case ir.ExpressionKind.GetCurrentView:
      return ng.getCurrentView();
    case ir.ExpressionKind.ReadVariable:
      if (expr.name === null) {
        throw new Error(`Read of unnamed variable ${expr.xref}`);
      }
      return o.variable(expr.name);
    case ir.ExpressionKind.PureFunctionExpr:
      if (expr.fn === null) {
        throw new Error(`AssertionError: expected PureFunctions to have been extracted`);
      }
      return ng.pureFunction(expr.varOffset!, expr.fn, expr.args);
    case ir.ExpressionKind.PureFunctionParameterExpr:
      throw new Error(`AssertionError: expected PureFunctionParameterExpr to have been extracted`);
    case ir.ExpressionKind.PipeBinding:
      return ng.pipeBind(expr.slot!, expr.varOffset!, expr.args);
    case ir.ExpressionKind.PipeBindingVariadic:
      return ng.pipeBindV(expr.slot!, expr.varOffset!, expr.args);
    default:
      throw new Error(`AssertionError: Unsupported reification of ir.Expression kind: ${
          ir.ExpressionKind[(expr as ir.Expression).kind]}`);
  }
}

/**
 * Listeners get turned into a function expression, which may or may not have the `$event`
 * parameter defined.
 *
 * 监听器变成一个函数表达式，它可能有也可能没有定义 `$event` 参数。
 *
 */
function reifyListenerHandler(
    view: ViewCompilation, name: string, handlerOps: ir.OpList<ir.UpdateOp>): o.FunctionExpr {
  const lookForEvent = new LookForEventVisitor();

  // First, reify all instruction calls within `handlerOps`.
  reifyUpdateOperations(view, handlerOps);

  // Next, extract all the `o.Statement`s from the reified operations. We can expect that at this
  // point, all operations have been converted to statements.
  const handlerStmts: o.Statement[] = [];
  for (const op of handlerOps) {
    if (op.kind !== ir.OpKind.Statement) {
      throw new Error(
          `AssertionError: expected reified statements, but found op ${ir.OpKind[op.kind]}`);
    }
    handlerStmts.push(op.statement);
  }

  // Scan the statement list for usages of `$event`. If referenced, we need to generate it as a
  // parameter.
  lookForEvent.visitAllStatements(handlerStmts, null);

  const params: o.FnParam[] = [];
  if (lookForEvent.seenEventRead) {
    // We need the `$event` parameter.
    params.push(new o.FnParam('$event'));
  }

  return o.fn(params, handlerStmts, undefined, undefined, name);
}

/**
 * Visitor which scans for reads of the `$event` special variable.
 *
 * 扫描 `$event` 特殊变量读取的访问者。
 *
 */
class LookForEventVisitor extends o.RecursiveAstVisitor {
  seenEventRead = false;

  override visitReadVarExpr(ast: o.ReadVarExpr, context: any) {
    if (ast.name === '$event') {
      this.seenEventRead = true;
    }
  }
}

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

/**
 * Generate a preamble sequence for each view creation block and listener function which declares
 * any variables that be referenced in other operations in the block.
 *
 * 为每个视图创建块和侦听器函数生成一个前导序列，该函数声明在块中的其他操作中引用的任何变量。
 *
 * Variables generated include:
 *
 * 生成的变量包括：
 *
 * - a saved view context to be used to restore the current view in event listeners.
 *
 *   一个已保存的视图上下文，用于在事件侦听器中恢复当前视图。
 *
 * - the context of the restored view within event listener handlers.
 *
 *   事件侦听器处理程序中恢复视图的上下文。
 *
 * - context variables from the current view as well as all parent views \(including the root
 *   context if needed\).
 *
 *   来自当前视图以及所有父视图的上下文变量（如果需要，包括根上下文）。
 *
 * - local references from elements within the current view and any lexical parents.
 *
 *   来自当前视图和任何词法父元素中的元素的本地引用。
 *
 * Variables are generated here unconditionally, and may optimized away in future operations if it
 * turns out their values \(and any side effects\) are unused.
 *
 * 变量在这里无条件地生成，如果发现它们的值（和任何副作用）未被使用，则可能会在未来的操作中优化掉。
 *
 */
export function phaseGenerateVariables(cpl: ComponentCompilation): void {
  recursivelyProcessView(cpl.root, /* there is no parent scope for the root view */ null);
}

/**
 * Process the given `ViewCompilation` and generate preambles for it and any listeners that it
 * declares.
 *
 * 处理给定的 `ViewCompilation` 并为它和它声明的任何侦听器生成前导码。
 *
 * @param `parentScope` a scope extracted from the parent view which captures any variables which
 *     should be inherited by this view. `null` if the current view is the root view.
 */
function recursivelyProcessView(view: ViewCompilation, parentScope: Scope|null): void {
  // Extract a `Scope` from this view.
  const scope = getScopeForView(view, parentScope);

  // Embedded views require an operation to save/restore the view context.
  if (view.parent !== null) {
    // Start the view creation block with an operation to save the current view context. This may be
    // used to restore the view context in any listeners that may be present.
  }

  for (const op of view.create) {
    switch (op.kind) {
      case ir.OpKind.Template:
        // Descend into child embedded views.
        recursivelyProcessView(view.tpl.views.get(op.xref)!, scope);
        break;
      case ir.OpKind.Listener:
        // Prepend variables to listener handler functions.
        op.handlerOps.prepend(generateVariablesInScopeForView(view, scope));
        break;
    }
  }

  // Prepend the declarations for all available variables in scope to the `update` block.
  const preambleOps = generateVariablesInScopeForView(view, scope);
  view.update.prepend(preambleOps);
}

/**
 * Lexical scope of a view, including a reference to its parent view's scope, if any.
 *
 * 视图的词法范围，包括对其父视图范围的引用（如果有）。
 *
 */
interface Scope {
  /**
   * `XrefId` of the view to which this scope corresponds.
   *
   * 此范围对应的视图的 `XrefId`。
   *
   */
  view: ir.XrefId;

  viewContextVariable: ir.SemanticVariable;

  contextVariables: Map<string, ir.SemanticVariable>;

  /**
   * Local references collected from elements within the view.
   *
   * 从视图中的元素收集的本地引用。
   *
   */
  references: Reference[];

  /**
   * `Scope` of the parent view, if any.
   *
   * 父视图的 `Scope` （如果有）。
   *
   */
  parent: Scope|null;
}

/**
 * Information needed about a local reference collected from an element within a view.
 *
 * 有关从视图中的元素收集的本地引用所需的信息。
 *
 */
interface Reference {
  /**
   * Name given to the local reference variable within the template.
   *
   * 为模板中的局部引用变量指定的名称。
   *
   * This is not the name which will be used for the variable declaration in the generated
   * template code.
   *
   * 这不是将在生成的模板代码中用于变量声明的名称。
   *
   */
  name: string;

  /**
   * `XrefId` of the element-like node which this reference targets.
   *
   * 此引用指向的类元素节点的 `XrefId`。
   *
   * The reference may be either to the element \(or template\) itself, or to a directive on it.
   *
   * 引用可以是元素（或模板）本身，也可以是其上的指令。
   *
   */
  targetId: ir.XrefId;

  /**
   * A generated offset of this reference among all the references on a specific element.
   *
   * 此引用在特定元素的所有引用中生成的偏移量。
   *
   */
  offset: number;

  variable: ir.SemanticVariable;
}

/**
 * Process a view and generate a `Scope` representing the variables available for reference within
 * that view.
 *
 * 处理一个视图并生成一个 `Scope`，表示该视图中可供引用的变量。
 *
 */
function getScopeForView(view: ViewCompilation, parent: Scope|null): Scope {
  const scope: Scope = {
    view: view.xref,
    viewContextVariable: {
      kind: ir.SemanticVariableKind.Context,
      name: null,
      view: view.xref,
    },
    contextVariables: new Map<string, ir.SemanticVariable>(),
    references: [],
    parent,
  };

  for (const identifier of view.contextVariables.keys()) {
    scope.contextVariables.set(identifier, {
      kind: ir.SemanticVariableKind.Identifier,
      name: null,
      identifier,
    });
  }

  for (const op of view.create) {
    switch (op.kind) {
      case ir.OpKind.Element:
      case ir.OpKind.ElementStart:
      case ir.OpKind.Template:
        if (!Array.isArray(op.localRefs)) {
          throw new Error(`AssertionError: expected localRefs to be an array`);
        }

        // Record available local references from this element.
        for (let offset = 0; offset < op.localRefs.length; offset++) {
          scope.references.push({
            name: op.localRefs[offset].name,
            targetId: op.xref,
            offset,
            variable: {
              kind: ir.SemanticVariableKind.Identifier,
              name: null,
              identifier: op.localRefs[offset].name,
            },
          });
        }
        break;
    }
  }

  return scope;
}

/**
 * Generate declarations for all variables that are in scope for a given view.
 *
 * 为给定视图范围内的所有变量生成声明。
 *
 * This is a recursive process, as views inherit variables available from their parent view, which
 * itself may have inherited variables, etc.
 *
 * 这是一个递归过程，因为视图继承了其父视图可用的变量，父视图本身可能具有继承变量等。
 *
 */
function generateVariablesInScopeForView(
    view: ViewCompilation, scope: Scope): ir.VariableOp<ir.UpdateOp>[] {
  const newOps: ir.VariableOp<ir.UpdateOp>[] = [];

  if (scope.view !== view.xref) {
    // Before generating variables for a parent view, we need to switch to the context of the parent
    // view with a `nextContext` expression. This context switching operation itself declares a
    // variable, because the context of the view may be referenced directly.
    newOps.push(ir.createVariableOp(
        view.tpl.allocateXrefId(), scope.viewContextVariable, new ir.NextContextExpr()));
  }

  // Add variables for all context variables available in this scope's view.
  for (const [name, value] of view.tpl.views.get(scope.view)!.contextVariables) {
    newOps.push(ir.createVariableOp(
        view.tpl.allocateXrefId(), scope.contextVariables.get(name)!,
        new o.ReadPropExpr(new ir.ContextExpr(scope.view), value)));
  }

  // Add variables for all local references declared for elements in this scope.
  for (const ref of scope.references) {
    newOps.push(ir.createVariableOp(
        view.tpl.allocateXrefId(), ref.variable, new ir.ReferenceExpr(ref.targetId, ref.offset)));
  }

  if (scope.parent !== null) {
    // Recursively add variables from the parent scope.
    newOps.push(...generateVariablesInScopeForView(view, scope.parent));
  }
  return newOps;
}

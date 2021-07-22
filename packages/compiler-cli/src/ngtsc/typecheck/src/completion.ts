/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {TmplAstReference, TmplAstTemplate} from '@angular/compiler';
import {AST, EmptyExpr, ImplicitReceiver, LiteralPrimitive, MethodCall, PropertyRead, PropertyWrite, SafeMethodCall, SafePropertyRead, TmplAstNode} from '@angular/compiler/src/compiler';
import {TextAttribute} from '@angular/compiler/src/render3/r3_ast';
import * as ts from 'typescript';

import {AbsoluteFsPath} from '../../file_system';
import {CompletionKind, GlobalCompletion, ReferenceCompletion, ShimLocation, VariableCompletion} from '../api';

import {ExpressionIdentifier, findFirstMatchingNode} from './comments';
import {TemplateData} from './context';

/**
 * Powers autocompletion for a specific component.
 *
 * Internally caches autocompletion results, and must be discarded if the component template or
 * surrounding TS program have changed.
 */
export class CompletionEngine {
  private componentContext: ShimLocation|null;

  /**
   * Cache of completions for various levels of the template, including the root template (`null`).
   * Memoizes `getTemplateContextCompletions`.
   */
  private templateContextCache =
      new Map<TmplAstTemplate|null, Map<string, ReferenceCompletion|VariableCompletion>>();

  private expressionCompletionCache = new Map<
      PropertyRead|SafePropertyRead|MethodCall|SafeMethodCall|LiteralPrimitive|TextAttribute,
      ShimLocation>();


  constructor(private tcb: ts.Node, private data: TemplateData, private shimPath: AbsoluteFsPath) {
    // Find the component completion expression within the TCB. This looks like: `ctx. /* ... */;`
    const globalRead = findFirstMatchingNode(this.tcb, {
      filter: ts.isPropertyAccessExpression,
      withExpressionIdentifier: ExpressionIdentifier.COMPONENT_COMPLETION
    });

    if (globalRead !== null) {
      this.componentContext = {
        shimPath: this.shimPath,
        // `globalRead.name` is an empty `ts.Identifier`, so its start position immediately follows
        // the `.` in `ctx.`. TS autocompletion APIs can then be used to access completion results
        // for the component context.
        positionInShimFile: globalRead.name.getStart(),
      };
    } else {
      this.componentContext = null;
    }
  }

  /**
   * Get global completions within the given template context and AST node.
   *
   * @param context the given template context - either a `TmplAstTemplate` embedded view, or `null`
   *     for the root
   * template context.
   * @param node the given AST node
   */
  getGlobalCompletions(context: TmplAstTemplate|null, node: AST|TmplAstNode): GlobalCompletion
      |null {
    if (this.componentContext === null) {
      return null;
    }

    const templateContext = this.getTemplateContextCompletions(context);
    if (templateContext === null) {
      return null;
    }

    let nodeContext: ShimLocation|null = null;
    if (node instanceof EmptyExpr) {
      const nodeLocation = findFirstMatchingNode(this.tcb, {
        filter: ts.isIdentifier,
        withSpan: node.sourceSpan,
      });
      if (nodeLocation !== null) {
        nodeContext = {
          shimPath: this.shimPath,
          positionInShimFile: nodeLocation.getStart(),
        };
      }
    }

    if (node instanceof PropertyRead && node.receiver instanceof ImplicitReceiver) {
      const nodeLocation = findFirstMatchingNode(this.tcb, {
        filter: ts.isPropertyAccessExpression,
        withSpan: node.sourceSpan,
      });
      if (nodeLocation) {
        nodeContext = {
          shimPath: this.shimPath,
          positionInShimFile: nodeLocation.getStart(),
        };
      }
    }

    return {
      componentContext: this.componentContext,
      templateContext,
      nodeContext,
    };
  }

  getExpressionCompletionLocation(expr: PropertyRead|PropertyWrite|MethodCall|
                                  SafeMethodCall): ShimLocation|null {
    if (this.expressionCompletionCache.has(expr)) {
      return this.expressionCompletionCache.get(expr)!;
    }

    // Completion works inside property reads and method calls.
    let tsExpr: ts.PropertyAccessExpression|null = null;
    if (expr instanceof PropertyRead || expr instanceof MethodCall ||
        expr instanceof PropertyWrite) {
      // Non-safe navigation operations are trivial: `foo.bar` or `foo.bar()`
      tsExpr = findFirstMatchingNode(this.tcb, {
        filter: ts.isPropertyAccessExpression,
        withSpan: expr.nameSpan,
      });
    } else if (expr instanceof SafePropertyRead || expr instanceof SafeMethodCall) {
      // Safe navigation operations are a little more complex, and involve a ternary. Completion
      // happens in the "true" case of the ternary.
      const ternaryExpr = findFirstMatchingNode(this.tcb, {
        filter: ts.isParenthesizedExpression,
        withSpan: expr.sourceSpan,
      });
      if (ternaryExpr === null || !ts.isConditionalExpression(ternaryExpr.expression)) {
        return null;
      }
      const whenTrue = ternaryExpr.expression.whenTrue;

      if (expr instanceof SafePropertyRead && ts.isPropertyAccessExpression(whenTrue)) {
        tsExpr = whenTrue;
      } else if (
          expr instanceof SafeMethodCall && ts.isCallExpression(whenTrue) &&
          ts.isPropertyAccessExpression(whenTrue.expression)) {
        tsExpr = whenTrue.expression;
      }
    }

    if (tsExpr === null) {
      return null;
    }

    const res: ShimLocation = {
      shimPath: this.shimPath,
      positionInShimFile: tsExpr.name.getEnd(),
    };
    this.expressionCompletionCache.set(expr, res);
    return res;
  }

  getLiteralCompletionLocation(expr: LiteralPrimitive|TextAttribute): ShimLocation|null {
    if (this.expressionCompletionCache.has(expr)) {
      return this.expressionCompletionCache.get(expr)!;
    }

    let tsExpr: ts.StringLiteral|ts.NumericLiteral|null = null;

    if (expr instanceof TextAttribute) {
      const strNode = findFirstMatchingNode(this.tcb, {
        filter: ts.isParenthesizedExpression,
        withSpan: expr.sourceSpan,
      });
      if (strNode !== null && ts.isStringLiteral(strNode.expression)) {
        tsExpr = strNode.expression;
      }
    } else {
      tsExpr = findFirstMatchingNode(this.tcb, {
        filter: (n: ts.Node): n is ts.NumericLiteral | ts.StringLiteral =>
            ts.isStringLiteral(n) || ts.isNumericLiteral(n),
        withSpan: expr.sourceSpan,
      });
    }

    if (tsExpr === null) {
      return null;
    }

    let positionInShimFile = tsExpr.getEnd();
    if (ts.isStringLiteral(tsExpr)) {
      // In the shimFile, if `tsExpr` is a string, the position should be in the quotes.
      positionInShimFile -= 1;
    }
    const res: ShimLocation = {
      shimPath: this.shimPath,
      positionInShimFile,
    };
    this.expressionCompletionCache.set(expr, res);
    return res;
  }

  /**
   * Get global completions within the given template context - either a `TmplAstTemplate` embedded
   * view, or `null` for the root context.
   */
  private getTemplateContextCompletions(context: TmplAstTemplate|null):
      Map<string, ReferenceCompletion|VariableCompletion>|null {
    if (this.templateContextCache.has(context)) {
      return this.templateContextCache.get(context)!;
    }

    const templateContext = new Map<string, ReferenceCompletion|VariableCompletion>();

    // The bound template already has details about the references and variables in scope in the
    // `context` template - they just need to be converted to `Completion`s.
    for (const node of this.data.boundTarget.getEntitiesInTemplateScope(context)) {
      if (node instanceof TmplAstReference) {
        templateContext.set(node.name, {
          kind: CompletionKind.Reference,
          node,
        });
      } else {
        templateContext.set(node.name, {
          kind: CompletionKind.Variable,
          node,
        });
      }
    }

    this.templateContextCache.set(context, templateContext);
    return templateContext;
  }
}

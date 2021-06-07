/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {AbsoluteSourceSpan} from '@angular/compiler';
import * as e from '../../../src/expression_parser/ast';
import * as t from '../../../src/render3/r3_ast';
import {unparse} from '../../expression_parser/utils/unparser';

type HumanizedExpressionSource = [string, AbsoluteSourceSpan];
class ExpressionSourceHumanizer extends e.RecursiveAstVisitor implements t.Visitor {
  result: HumanizedExpressionSource[] = [];

  private recordAst(ast: e.AST) {
    this.result.push([unparse(ast), ast.sourceSpan]);
  }

  // This method is defined to reconcile the type of ExpressionSourceHumanizer
  // since both RecursiveAstVisitor and Visitor define the visit() method in
  // their interfaces.
  override visit(node: e.AST|t.Node, context?: any) {
    if (node instanceof e.AST) {
      node.visit(this, context);
    } else {
      node.visit(this);
    }
  }

  visitASTWithSource(ast: e.ASTWithSource) {
    this.recordAst(ast);
    this.visitAll([ast.ast], null);
  }
  override visitBinary(ast: e.Binary) {
    this.recordAst(ast);
    super.visitBinary(ast, null);
  }
  override visitChain(ast: e.Chain) {
    this.recordAst(ast);
    super.visitChain(ast, null);
  }
  override visitConditional(ast: e.Conditional) {
    this.recordAst(ast);
    super.visitConditional(ast, null);
  }
  override visitFunctionCall(ast: e.FunctionCall) {
    this.recordAst(ast);
    super.visitFunctionCall(ast, null);
  }
  override visitImplicitReceiver(ast: e.ImplicitReceiver) {
    this.recordAst(ast);
    super.visitImplicitReceiver(ast, null);
  }
  override visitInterpolation(ast: e.Interpolation) {
    this.recordAst(ast);
    super.visitInterpolation(ast, null);
  }
  override visitKeyedRead(ast: e.KeyedRead) {
    this.recordAst(ast);
    super.visitKeyedRead(ast, null);
  }
  override visitKeyedWrite(ast: e.KeyedWrite) {
    this.recordAst(ast);
    super.visitKeyedWrite(ast, null);
  }
  override visitLiteralPrimitive(ast: e.LiteralPrimitive) {
    this.recordAst(ast);
    super.visitLiteralPrimitive(ast, null);
  }
  override visitLiteralArray(ast: e.LiteralArray) {
    this.recordAst(ast);
    super.visitLiteralArray(ast, null);
  }
  override visitLiteralMap(ast: e.LiteralMap) {
    this.recordAst(ast);
    super.visitLiteralMap(ast, null);
  }
  override visitMethodCall(ast: e.MethodCall) {
    this.recordAst(ast);
    super.visitMethodCall(ast, null);
  }
  override visitNonNullAssert(ast: e.NonNullAssert) {
    this.recordAst(ast);
    super.visitNonNullAssert(ast, null);
  }
  override visitPipe(ast: e.BindingPipe) {
    this.recordAst(ast);
    super.visitPipe(ast, null);
  }
  override visitPrefixNot(ast: e.PrefixNot) {
    this.recordAst(ast);
    super.visitPrefixNot(ast, null);
  }
  override visitPropertyRead(ast: e.PropertyRead) {
    this.recordAst(ast);
    super.visitPropertyRead(ast, null);
  }
  override visitPropertyWrite(ast: e.PropertyWrite) {
    this.recordAst(ast);
    super.visitPropertyWrite(ast, null);
  }
  override visitSafeMethodCall(ast: e.SafeMethodCall) {
    this.recordAst(ast);
    super.visitSafeMethodCall(ast, null);
  }
  override visitSafePropertyRead(ast: e.SafePropertyRead) {
    this.recordAst(ast);
    super.visitSafePropertyRead(ast, null);
  }
  override visitQuote(ast: e.Quote) {
    this.recordAst(ast);
    super.visitQuote(ast, null);
  }
  override visitSafeKeyedRead(ast: e.SafeKeyedRead) {
    this.recordAst(ast);
    super.visitSafeKeyedRead(ast, null);
  }

  visitTemplate(ast: t.Template) {
    t.visitAll(this, ast.children);
    t.visitAll(this, ast.templateAttrs);
  }
  visitElement(ast: t.Element) {
    t.visitAll(this, ast.children);
    t.visitAll(this, ast.inputs);
    t.visitAll(this, ast.outputs);
  }
  visitReference(ast: t.Reference) {}
  visitVariable(ast: t.Variable) {}
  visitEvent(ast: t.BoundEvent) {
    ast.handler.visit(this);
  }
  visitTextAttribute(ast: t.TextAttribute) {}
  visitBoundAttribute(ast: t.BoundAttribute) {
    ast.value.visit(this);
  }
  visitBoundEvent(ast: t.BoundEvent) {
    ast.handler.visit(this);
  }
  visitBoundText(ast: t.BoundText) {
    ast.value.visit(this);
  }
  visitContent(ast: t.Content) {}
  visitText(ast: t.Text) {}
  visitIcu(ast: t.Icu) {
    for (const key of Object.keys(ast.vars)) {
      ast.vars[key].visit(this);
    }
    for (const key of Object.keys(ast.placeholders)) {
      ast.placeholders[key].visit(this);
    }
  }
}

/**
 * Humanizes expression AST source spans in a template by returning an array of tuples
 *   [unparsed AST, AST source span]
 * for each expression in the template.
 * @param templateAsts template AST to humanize
 */
export function humanizeExpressionSource(templateAsts: t.Node[]): HumanizedExpressionSource[] {
  const humanizer = new ExpressionSourceHumanizer();
  t.visitAll(humanizer, templateAsts);
  return humanizer.result;
}

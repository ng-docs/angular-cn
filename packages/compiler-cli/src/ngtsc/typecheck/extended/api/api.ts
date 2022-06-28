/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {AST, ASTWithSource, ParseSourceSpan, RecursiveAstVisitor, TmplAstBoundAttribute, TmplAstBoundEvent, TmplAstBoundText, TmplAstContent, TmplAstElement, TmplAstIcu, TmplAstNode, TmplAstRecursiveVisitor, TmplAstReference, TmplAstTemplate, TmplAstText, TmplAstTextAttribute, TmplAstVariable} from '@angular/compiler';
import ts from 'typescript';

import {NgCompilerOptions} from '../../../core/api';
import {ErrorCode, ExtendedTemplateDiagnosticName} from '../../../diagnostics';
import {NgTemplateDiagnostic, TemplateTypeChecker} from '../../api';

/**
 * A Template Check receives information about the template it's checking and returns
 * information about the diagnostics to be generated.
 *
 * 模板检查会接收有关它正在检查的模板的信息，并返回有关要生成的诊断的信息。
 *
 */
export interface TemplateCheck<Code extends ErrorCode> {
  /**
   * Unique template check code, used for configuration and searching the error.
   *
   * 唯一的模板检查代码，用于配置和搜索错误。
   *
   */
  code: Code;

  /**
   * Runs check and returns information about the diagnostics to be generated.
   *
   * 运行检查并返回有关要生成的诊断的信息。
   *
   */
  run(ctx: TemplateContext<Code>, component: ts.ClassDeclaration,
      template: TmplAstNode[]): NgTemplateDiagnostic<Code>[];
}

/**
 * The TemplateContext provided to a Template Check to get diagnostic information.
 *
 * 提供给模板检查以获取诊断信息的 TemplateContext。
 *
 */
export interface TemplateContext<Code extends ErrorCode> {
  /**
   * Interface that provides information about template nodes.
   *
   * 提供有关模板节点信息的接口。
   *
   */
  templateTypeChecker: TemplateTypeChecker;

  /**
   * TypeScript interface that provides type information about symbols that appear
   * in the template (it is not to query types outside the Angular component).
   *
   * TypeScript 接口，提供有关模板中出现的符号的类型信息（它不会查询 Angular 组件之外的类型）。
   *
   */
  typeChecker: ts.TypeChecker;

  /**
   * Creates a template diagnostic with the given information for the template being processed and
   * using the diagnostic category configured for the extended template diagnostic.
   *
   * 使用正在处理的模板的给定信息并使用为扩展模板诊断配置的诊断类别创建模板诊断。
   *
   */
  makeTemplateDiagnostic(sourceSpan: ParseSourceSpan, message: string, relatedInformation?: {
    text: string,
    start: number,
    end: number,
    sourceFile: ts.SourceFile,
  }[]): NgTemplateDiagnostic<Code>;
}

/**
 * A factory which creates a template check for a particular code and name. This binds the two
 * together and associates them with a specific `TemplateCheck`.
 *
 * 为特定代码和名称创建模板检查的工厂。这将两者绑定在一起，并将它们与特定的 `TemplateCheck`
 * 关联起来。
 *
 */
export interface TemplateCheckFactory<
  Code extends ErrorCode,
  Name extends ExtendedTemplateDiagnosticName,
> {
  code: Code;
  name: Name;
  create(options: NgCompilerOptions): TemplateCheck<Code>|null;
}

/**
 * This abstract class provides a base implementation for the run method.
 *
 * 此抽象类为 run 方法提供了基础实现。
 *
 */
export abstract class TemplateCheckWithVisitor<Code extends ErrorCode> implements
    TemplateCheck<Code> {
  abstract code: Code;

  /**
   * Base implementation for run function, visits all nodes in template and calls
   * `visitNode()` for each one.
   *
   * run 函数的基础实现，访问模板中的所有节点并为每个节点调用 `visitNode()` 。
   *
   */
  run(ctx: TemplateContext<Code>, component: ts.ClassDeclaration,
      template: TmplAstNode[]): NgTemplateDiagnostic<Code>[] {
    const visitor = new TemplateVisitor<Code>(ctx, component, this);
    return visitor.getDiagnostics(template);
  }

  /**
   * Visit a TmplAstNode or AST node of the template. Authors should override this
   * method to implement the check and return diagnostics.
   *
   * 访问模板的 TmplAstNode 或 AST 节点。作者应该覆盖此方法以实现检查并返回诊断。
   *
   */
  abstract visitNode(
      ctx: TemplateContext<Code>, component: ts.ClassDeclaration,
      node: TmplAstNode|AST): NgTemplateDiagnostic<Code>[];
}

/**
 * Visits all nodes in a template (TmplAstNode and AST) and calls `visitNode` for each one.
 *
 * 访问模板中的所有节点（TmplAstNode 和 AST）并为每个节点调用 `visitNode` 。
 *
 */
class TemplateVisitor<Code extends ErrorCode> extends RecursiveAstVisitor implements
    TmplAstRecursiveVisitor {
  diagnostics: NgTemplateDiagnostic<Code>[] = [];

  constructor(
      private readonly ctx: TemplateContext<Code>, private readonly component: ts.ClassDeclaration,
      private readonly check: TemplateCheckWithVisitor<Code>) {
    super();
  }

  override visit(node: AST|TmplAstNode, context?: any) {
    this.diagnostics.push(...this.check.visitNode(this.ctx, this.component, node));
    node.visit(this);
  }

  visitAllNodes(nodes: TmplAstNode[]) {
    for (const node of nodes) {
      this.visit(node);
    }
  }

  visitAst(ast: AST) {
    if (ast instanceof ASTWithSource) {
      ast = ast.ast;
    }
    this.visit(ast);
  }

  visitElement(element: TmplAstElement) {
    this.visitAllNodes(element.attributes);
    this.visitAllNodes(element.inputs);
    this.visitAllNodes(element.outputs);
    this.visitAllNodes(element.references);
    this.visitAllNodes(element.children);
  }

  visitTemplate(template: TmplAstTemplate) {
    this.visitAllNodes(template.attributes);
    if (template.tagName === 'ng-template') {
      // Only visit input/outputs/templateAttrs if this isn't an inline template node
      // generated for a structural directive (like `<div *ngIf></div>`). These nodes
      // would be visited when the underlying element of an inline template node is processed.
      this.visitAllNodes(template.inputs);
      this.visitAllNodes(template.outputs);
      this.visitAllNodes(template.templateAttrs);
    }
    this.visitAllNodes(template.variables);
    this.visitAllNodes(template.references);
    this.visitAllNodes(template.children);
  }
  visitContent(content: TmplAstContent): void {}
  visitVariable(variable: TmplAstVariable): void {}
  visitReference(reference: TmplAstReference): void {}
  visitTextAttribute(attribute: TmplAstTextAttribute): void {}
  visitBoundAttribute(attribute: TmplAstBoundAttribute): void {
    this.visitAst(attribute.value);
  }
  visitBoundEvent(attribute: TmplAstBoundEvent): void {
    this.visitAst(attribute.handler);
  }
  visitText(text: TmplAstText): void {}
  visitBoundText(text: TmplAstBoundText): void {
    this.visitAst(text.value);
  }
  visitIcu(icu: TmplAstIcu): void {}

  getDiagnostics(template: TmplAstNode[]): NgTemplateDiagnostic<Code>[] {
    this.diagnostics = [];
    this.visitAllNodes(template);
    return this.diagnostics;
  }
}

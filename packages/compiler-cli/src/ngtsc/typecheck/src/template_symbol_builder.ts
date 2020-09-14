/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {AST, ASTWithSource, BindingPipe, MethodCall, PropertyWrite, SafeMethodCall, SafePropertyRead, TmplAstBoundAttribute, TmplAstBoundEvent, TmplAstElement, TmplAstNode, TmplAstReference, TmplAstTemplate, TmplAstTextAttribute, TmplAstVariable} from '@angular/compiler';
import * as ts from 'typescript';

import {AbsoluteFsPath} from '../../file_system';
import {isAssignment} from '../../util/src/typescript';
import {DirectiveSymbol, DomBindingSymbol, ElementSymbol, ExpressionSymbol, InputBindingSymbol, OutputBindingSymbol, ReferenceSymbol, Symbol, SymbolKind, TemplateSymbol, TsNodeSymbolInfo, TypeCheckableDirectiveMeta, VariableSymbol} from '../api';

import {ExpressionIdentifier, findAllMatchingNodes, findFirstMatchingNode, hasExpressionIdentifier} from './comments';
import {TemplateData} from './context';
import {isAccessExpression} from './ts_util';
import {TcbDirectiveOutputsOp} from './type_check_block';

/**
 * A class which extracts information from a type check block.
 * This class is essentially used as just a closure around the constructor parameters.
 */
export class SymbolBuilder {
  constructor(
      private readonly typeChecker: ts.TypeChecker, private readonly shimPath: AbsoluteFsPath,
      private readonly typeCheckBlock: ts.Node, private readonly templateData: TemplateData) {}

  getSymbol(node: TmplAstTemplate|TmplAstElement): TemplateSymbol|ElementSymbol|null;
  getSymbol(node: TmplAstReference|TmplAstVariable): ReferenceSymbol|VariableSymbol|null;
  getSymbol(node: AST|TmplAstNode): Symbol|null;
  getSymbol(node: AST|TmplAstNode): Symbol|null {
    if (node instanceof TmplAstBoundAttribute || node instanceof TmplAstTextAttribute) {
      // TODO(atscott): input and output bindings only return the first directive match but should
      // return a list of bindings for all of them.
      return this.getSymbolOfInputBinding(node);
    } else if (node instanceof TmplAstBoundEvent) {
      return this.getSymbolOfBoundEvent(node);
    } else if (node instanceof TmplAstElement) {
      return this.getSymbolOfElement(node);
    } else if (node instanceof TmplAstTemplate) {
      return this.getSymbolOfAstTemplate(node);
    } else if (node instanceof TmplAstVariable) {
      return this.getSymbolOfVariable(node);
    } else if (node instanceof TmplAstReference) {
      return this.getSymbolOfReference(node);
    } else if (node instanceof AST) {
      return this.getSymbolOfTemplateExpression(node);
    }
    // TODO(atscott): TmplAstContent, TmplAstIcu
    return null;
  }

  private getSymbolOfAstTemplate(template: TmplAstTemplate): TemplateSymbol|null {
    const directives = this.getDirectivesOfNode(template);
    return {kind: SymbolKind.Template, directives};
  }

  private getSymbolOfElement(element: TmplAstElement): ElementSymbol|null {
    const elementSourceSpan = element.startSourceSpan ?? element.sourceSpan;

    const node = findFirstMatchingNode(
        this.typeCheckBlock, {withSpan: elementSourceSpan, filter: ts.isVariableDeclaration});
    if (node === null) {
      return null;
    }

    const symbolFromDeclaration = this.getSymbolOfVariableDeclaration(node);
    if (symbolFromDeclaration === null || symbolFromDeclaration.tsSymbol === null) {
      return null;
    }

    const directives = this.getDirectivesOfNode(element);
    // All statements in the TCB are `Expression`s that optionally include more information.
    // An `ElementSymbol` uses the information returned for the variable declaration expression,
    // adds the directives for the element, and updates the `kind` to be `SymbolKind.Element`.
    return {
      ...symbolFromDeclaration,
      kind: SymbolKind.Element,
      directives,
    };
  }

  private getDirectivesOfNode(element: TmplAstElement|TmplAstTemplate): DirectiveSymbol[] {
    const elementSourceSpan = element.startSourceSpan ?? element.sourceSpan;
    const tcbSourceFile = this.typeCheckBlock.getSourceFile();
    // directives could be either:
    // - var _t1: TestDir /*T:D*/ = (null!);
    // - var _t1 /*T:D*/ = _ctor1({});
    const isDirectiveDeclaration = (node: ts.Node): node is ts.TypeNode|ts.Identifier =>
        (ts.isTypeNode(node) || ts.isIdentifier(node)) &&
        hasExpressionIdentifier(tcbSourceFile, node, ExpressionIdentifier.DIRECTIVE);

    const nodes = findAllMatchingNodes(
        this.typeCheckBlock, {withSpan: elementSourceSpan, filter: isDirectiveDeclaration});
    return nodes
        .map(node => {
          const symbol = (ts.isIdentifier(node) && ts.isVariableDeclaration(node.parent)) ?
              this.getSymbolOfVariableDeclaration(node.parent) :
              this.getSymbolOfTsNode(node);
          if (symbol === null || symbol.tsSymbol === null ||
              symbol.tsSymbol.declarations.length === 0) {
            return null;
          }

          const meta = this.getDirectiveMeta(element, symbol.tsSymbol.declarations[0]);
          if (meta === null) {
            return null;
          }

          const selector = meta.selector ?? null;
          const isComponent = meta.isComponent ?? null;
          const directiveSymbol: DirectiveSymbol = {
            ...symbol,
            tsSymbol: symbol.tsSymbol,
            selector,
            isComponent,
            kind: SymbolKind.Directive
          };
          return directiveSymbol;
        })
        .filter((d): d is DirectiveSymbol => d !== null);
  }

  private getDirectiveMeta(
      host: TmplAstTemplate|TmplAstElement,
      directiveDeclaration: ts.Declaration): TypeCheckableDirectiveMeta|null {
    const directives = this.templateData.boundTarget.getDirectivesOfNode(host);
    if (directives === null) {
      return null;
    }

    return directives.find(m => m.ref.node === directiveDeclaration) ?? null;
  }

  private getSymbolOfBoundEvent(eventBinding: TmplAstBoundEvent): OutputBindingSymbol|null {
    // Outputs are a `ts.CallExpression` that look like one of the two:
    // * _outputHelper(_t1["outputField"]).subscribe(handler);
    // * _t1.addEventListener(handler);
    const node = findFirstMatchingNode(
        this.typeCheckBlock, {withSpan: eventBinding.sourceSpan, filter: ts.isCallExpression});
    if (node === null) {
      return null;
    }

    const consumer = this.templateData.boundTarget.getConsumerOfBinding(eventBinding);
    if (consumer === null || consumer instanceof TmplAstTemplate ||
        consumer instanceof TmplAstElement) {
      // Bindings to element or template events produce `addEventListener` which
      // we cannot get the field for.
      return null;
    }
    const outputFieldAccess = TcbDirectiveOutputsOp.decodeOutputCallExpression(node);
    if (outputFieldAccess === null) {
      return null;
    }

    const tsSymbol = this.typeChecker.getSymbolAtLocation(outputFieldAccess.argumentExpression);
    if (tsSymbol === undefined) {
      return null;
    }


    const target = this.getDirectiveSymbolForAccessExpression(outputFieldAccess, consumer);
    if (target === null) {
      return null;
    }

    const positionInShimFile = this.getShimPositionForNode(outputFieldAccess);
    const tsType = this.typeChecker.getTypeAtLocation(node);
    return {
      kind: SymbolKind.Output,
      bindings: [{
        kind: SymbolKind.Binding,
        tsSymbol,
        tsType,
        target,
        shimLocation: {shimPath: this.shimPath, positionInShimFile},
      }],
    };
  }

  private getSymbolOfInputBinding(binding: TmplAstBoundAttribute|
                                  TmplAstTextAttribute): InputBindingSymbol|DomBindingSymbol|null {
    const consumer = this.templateData.boundTarget.getConsumerOfBinding(binding);
    if (consumer === null) {
      return null;
    }

    if (consumer instanceof TmplAstElement || consumer instanceof TmplAstTemplate) {
      const host = this.getSymbol(consumer);
      return host !== null ? {kind: SymbolKind.DomBinding, host} : null;
    }

    const node = findFirstMatchingNode(
        this.typeCheckBlock, {withSpan: binding.sourceSpan, filter: isAssignment});
    if (node === null || !isAccessExpression(node.left)) {
      return null;
    }

    const symbolInfo = this.getSymbolOfTsNode(node.left);
    if (symbolInfo === null || symbolInfo.tsSymbol === null) {
      return null;
    }

    const target = this.getDirectiveSymbolForAccessExpression(node.left, consumer);
    if (target === null) {
      return null;
    }

    return {
      kind: SymbolKind.Input,
      bindings: [{
        ...symbolInfo,
        tsSymbol: symbolInfo.tsSymbol,
        kind: SymbolKind.Binding,
        target,
      }],
    };
  }

  private getDirectiveSymbolForAccessExpression(
      node: ts.ElementAccessExpression|ts.PropertyAccessExpression,
      {isComponent, selector}: TypeCheckableDirectiveMeta): DirectiveSymbol|null {
    // In either case, `_t1["index"]` or `_t1.index`, `node.expression` is _t1.
    // The retrieved symbol for _t1 will be the variable declaration.
    const tsSymbol = this.typeChecker.getSymbolAtLocation(node.expression);
    if (tsSymbol === undefined || tsSymbol.declarations.length === 0) {
      return null;
    }

    const [declaration] = tsSymbol.declarations;
    if (!ts.isVariableDeclaration(declaration) ||
        !hasExpressionIdentifier(
            // The expression identifier could be on the type (for regular directives) or the name
            // (for generic directives and the ctor op).
            declaration.getSourceFile(), declaration.type ?? declaration.name,
            ExpressionIdentifier.DIRECTIVE)) {
      return null;
    }

    const symbol = this.getSymbolOfVariableDeclaration(declaration);
    if (symbol === null || symbol.tsSymbol === null) {
      return null;
    }

    return {
      kind: SymbolKind.Directive,
      tsSymbol: symbol.tsSymbol,
      tsType: symbol.tsType,
      shimLocation: symbol.shimLocation,
      isComponent,
      selector,
    };
  }

  private getSymbolOfVariable(variable: TmplAstVariable): VariableSymbol|null {
    const node = findFirstMatchingNode(
        this.typeCheckBlock, {withSpan: variable.sourceSpan, filter: ts.isVariableDeclaration});
    if (node === null) {
      return null;
    }

    const expressionSymbol = this.getSymbolOfVariableDeclaration(node);
    if (expressionSymbol === null) {
      return null;
    }

    return {...expressionSymbol, kind: SymbolKind.Variable, declaration: variable};
  }

  private getSymbolOfReference(ref: TmplAstReference): ReferenceSymbol|null {
    const target = this.templateData.boundTarget.getReferenceTarget(ref);
    // Find the node for the reference declaration, i.e. `var _t2 = _t1;`
    let node = findFirstMatchingNode(
        this.typeCheckBlock, {withSpan: ref.sourceSpan, filter: ts.isVariableDeclaration});
    if (node === null || target === null || node.initializer === undefined) {
      return null;
    }

    // TODO(atscott): Shim location will need to be adjusted
    const symbol = this.getSymbolOfTsNode(node.name);
    if (symbol === null || symbol.tsSymbol === null) {
      return null;
    }

    if (target instanceof TmplAstTemplate || target instanceof TmplAstElement) {
      return {
        ...symbol,
        tsSymbol: symbol.tsSymbol,
        kind: SymbolKind.Reference,
        target,
        declaration: ref,
      };
    } else {
      if (!ts.isClassDeclaration(target.directive.ref.node)) {
        return null;
      }

      return {
        ...symbol,
        kind: SymbolKind.Reference,
        tsSymbol: symbol.tsSymbol,
        declaration: ref,
        target: target.directive.ref.node,
      };
    }
  }

  private getSymbolOfTemplateExpression(expression: AST): VariableSymbol|ReferenceSymbol
      |ExpressionSymbol|null {
    if (expression instanceof ASTWithSource) {
      expression = expression.ast;
    }

    const expressionTarget = this.templateData.boundTarget.getExpressionTarget(expression);
    if (expressionTarget !== null) {
      return this.getSymbol(expressionTarget);
    }

    // The `name` part of a `PropertyWrite` and `MethodCall` does not have its own
    // AST so there is no way to retrieve a `Symbol` for just the `name` via a specific node.
    const withSpan = (expression instanceof PropertyWrite || expression instanceof MethodCall) ?
        expression.nameSpan :
        expression.sourceSpan;

    let node = findFirstMatchingNode(
        this.typeCheckBlock, {withSpan, filter: (n: ts.Node): n is ts.Node => true});
    if (node === null) {
      return null;
    }

    while (ts.isParenthesizedExpression(node)) {
      node = node.expression;
    }

    // - If we have safe property read ("a?.b") we want to get the Symbol for b, the `whenTrue`
    // expression.
    // - If our expression is a pipe binding ("a | test:b:c"), we want the Symbol for the
    // `transform` on the pipe.
    // - Otherwise, we retrieve the symbol for the node itself with no special considerations
    if ((expression instanceof SafePropertyRead || expression instanceof SafeMethodCall) &&
        ts.isConditionalExpression(node)) {
      const whenTrueSymbol =
          (expression instanceof SafeMethodCall && ts.isCallExpression(node.whenTrue)) ?
          this.getSymbolOfTsNode(node.whenTrue.expression) :
          this.getSymbolOfTsNode(node.whenTrue);
      if (whenTrueSymbol === null) {
        return null;
      }

      return {
        ...whenTrueSymbol,
        kind: SymbolKind.Expression,
        // Rather than using the type of only the `whenTrue` part of the expression, we should
        // still get the type of the whole conditional expression to include `|undefined`.
        tsType: this.typeChecker.getTypeAtLocation(node)
      };
    } else if (expression instanceof BindingPipe && ts.isCallExpression(node)) {
      // TODO(atscott): Create a PipeSymbol to include symbol for the Pipe class
      const symbolInfo = this.getSymbolOfTsNode(node.expression);
      return symbolInfo === null ? null : {...symbolInfo, kind: SymbolKind.Expression};
    } else {
      const symbolInfo = this.getSymbolOfTsNode(node);
      return symbolInfo === null ? null : {...symbolInfo, kind: SymbolKind.Expression};
    }
  }

  private getSymbolOfTsNode(node: ts.Node): TsNodeSymbolInfo|null {
    while (ts.isParenthesizedExpression(node)) {
      node = node.expression;
    }

    let tsSymbol: ts.Symbol|undefined;
    if (ts.isPropertyAccessExpression(node)) {
      tsSymbol = this.typeChecker.getSymbolAtLocation(node.name);
    } else if (ts.isElementAccessExpression(node)) {
      tsSymbol = this.typeChecker.getSymbolAtLocation(node.argumentExpression);
    } else {
      tsSymbol = this.typeChecker.getSymbolAtLocation(node);
    }

    const positionInShimFile = this.getShimPositionForNode(node);
    const type = this.typeChecker.getTypeAtLocation(node);
    return {
      // If we could not find a symbol, fall back to the symbol on the type for the node.
      // Some nodes won't have a "symbol at location" but will have a symbol for the type.
      // Examples of this would be literals and `document.createElement('div')`.
      tsSymbol: tsSymbol ?? type.symbol ?? null,
      tsType: type,
      shimLocation: {shimPath: this.shimPath, positionInShimFile},
    };
  }

  private getSymbolOfVariableDeclaration(declaration: ts.VariableDeclaration): TsNodeSymbolInfo
      |null {
    // Instead of returning the Symbol for the temporary variable, we want to get the `ts.Symbol`
    // for:
    // - The type reference for `var _t2: MyDir = xyz` (prioritize/trust the declared type)
    // - The initializer for `var _t2 = _t1.index`.
    if (declaration.type && ts.isTypeReferenceNode(declaration.type)) {
      return this.getSymbolOfTsNode(declaration.type.typeName);
    }
    if (declaration.initializer === undefined) {
      return null;
    }

    const symbol = this.getSymbolOfTsNode(declaration.initializer);
    if (symbol === null) {
      return null;
    }
    return symbol;
  }

  private getShimPositionForNode(node: ts.Node): number {
    if (ts.isTypeReferenceNode(node)) {
      return this.getShimPositionForNode(node.typeName);
    } else if (ts.isQualifiedName(node)) {
      return node.right.getStart();
    } else if (ts.isPropertyAccessExpression(node)) {
      return node.name.getStart();
    } else if (ts.isElementAccessExpression(node)) {
      return node.argumentExpression.getStart();
    } else {
      return node.getStart();
    }
  }
}

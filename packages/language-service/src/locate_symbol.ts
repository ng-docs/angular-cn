/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Attribute, BoundDirectivePropertyAst, CssSelector, DirectiveAst, ElementAst, EmbeddedTemplateAst, RecursiveTemplateAstVisitor, SelectorMatcher, StaticSymbol, TemplateAst, TemplateAstPath, templateVisitAll, tokenReference} from '@angular/compiler';
import * as tss from 'typescript/lib/tsserverlibrary';

import {AstResult} from './common';
import {getExpressionScope} from './expression_diagnostics';
import {getExpressionSymbol} from './expressions';
import {Definition, DirectiveKind, Span, Symbol} from './types';
import {diagnosticInfoFromTemplateInfo, findOutputBinding, findTemplateAstAt, getPathToNodeAtPosition, inSpan, invertMap, isNarrower, offsetSpan, spanOf} from './utils';

export interface SymbolInfo {
  symbol: Symbol;
  span: tss.TextSpan;
  staticSymbol?: StaticSymbol;
}

/**
 * Traverses a template AST and locates symbol(s) at a specified position.
 * @param info template AST information set
 * @param position location to locate symbols at
 */
export function locateSymbols(info: AstResult, position: number): SymbolInfo[] {
  const templatePosition = position - info.template.span.start;
  // TODO: update `findTemplateAstAt` to use absolute positions.
  const path = findTemplateAstAt(info.templateAst, templatePosition);
  const attribute = findAttribute(info, position);

  if (!path.tail) return [];

  const narrowest = spanOf(path.tail);
  const toVisit: TemplateAst[] = [];
  for (let node: TemplateAst|undefined = path.tail;
       node && isNarrower(spanOf(node.sourceSpan), narrowest); node = path.parentOf(node)) {
    toVisit.push(node);
  }

  // For the structural directive, only care about the last template AST.
  if (attribute?.name.startsWith('*')) {
    toVisit.splice(0, toVisit.length - 1);
  }

  return toVisit.map(ast => locateSymbol(ast, path, info))
      .filter((sym): sym is SymbolInfo => sym !== undefined);
}

/**
 * Visits a template node and locates the symbol in that node at a path position.
 * @param ast template AST node to visit
 * @param path non-empty set of narrowing AST nodes at a position
 * @param info template AST information set
 */
function locateSymbol(ast: TemplateAst, path: TemplateAstPath, info: AstResult): SymbolInfo|
    undefined {
  const templatePosition = path.position;
  const position = templatePosition + info.template.span.start;
  let symbol: Symbol|undefined;
  let span: Span|undefined;
  let staticSymbol: StaticSymbol|undefined;
  const attributeValueSymbol = (): boolean => {
    const attribute = findAttribute(info, position);
    if (attribute) {
      if (inSpan(templatePosition, spanOf(attribute.valueSpan))) {
        const result = getSymbolInAttributeValue(info, path, attribute);
        if (result) {
          symbol = result.symbol;
          span = offsetSpan(result.span, attribute.valueSpan !.start.offset);
        }
        return true;
      }
    }
    return false;
  };
  ast.visit(
      {
        visitNgContent(ast) {},
        visitEmbeddedTemplate(ast) {},
        visitElement(ast) {
          const component = ast.directives.find(d => d.directive.isComponent);
          if (component) {
            // Need to cast because 'reference' is typed as any
            staticSymbol = component.directive.type.reference as StaticSymbol;
            symbol = info.template.query.getTypeSymbol(staticSymbol);
            symbol = symbol && new OverrideKindSymbol(symbol, DirectiveKind.COMPONENT);
            span = spanOf(ast);
          } else {
            // Find a directive that matches the element name
            const directive = ast.directives.find(
                d => d.directive.selector != null && d.directive.selector.indexOf(ast.name) >= 0);
            if (directive) {
              // Need to cast because 'reference' is typed as any
              staticSymbol = directive.directive.type.reference as StaticSymbol;
              symbol = info.template.query.getTypeSymbol(staticSymbol);
              symbol = symbol && new OverrideKindSymbol(symbol, DirectiveKind.DIRECTIVE);
              span = spanOf(ast);
            }
          }
        },
        visitReference(ast) {
          symbol = ast.value && info.template.query.getTypeSymbol(tokenReference(ast.value));
          span = spanOf(ast);
        },
        visitVariable(ast) {},
        visitEvent(ast) {
          if (!attributeValueSymbol()) {
            symbol = findOutputBinding(info, path, ast);
            symbol = symbol && new OverrideKindSymbol(symbol, DirectiveKind.EVENT);
            span = spanOf(ast);
          }
        },
        visitElementProperty(ast) { attributeValueSymbol(); },
        visitAttr(ast) {
          const element = path.head;
          if (!element || !(element instanceof ElementAst)) return;
          // Create a mapping of all directives applied to the element from their selectors.
          const matcher = new SelectorMatcher<DirectiveAst>();
          for (const dir of element.directives) {
            if (!dir.directive.selector) continue;
            matcher.addSelectables(CssSelector.parse(dir.directive.selector), dir);
          }

          // See if this attribute matches the selector of any directive on the element.
          const attributeSelector = `[${ast.name}=${ast.value}]`;
          const parsedAttribute = CssSelector.parse(attributeSelector);
          if (!parsedAttribute.length) return;
          matcher.match(parsedAttribute[0], (_, {directive}) => {
            // Need to cast because 'reference' is typed as any
            staticSymbol = directive.type.reference as StaticSymbol;
            symbol = info.template.query.getTypeSymbol(staticSymbol);
            symbol = symbol && new OverrideKindSymbol(symbol, DirectiveKind.DIRECTIVE);
            span = spanOf(ast);
          });
        },
        visitBoundText(ast) {
          const expressionPosition = templatePosition - ast.sourceSpan.start.offset;
          if (inSpan(expressionPosition, ast.value.span)) {
            const dinfo = diagnosticInfoFromTemplateInfo(info);
            const scope = getExpressionScope(dinfo, path);
            const result =
                getExpressionSymbol(scope, ast.value, templatePosition, info.template.query);
            if (result) {
              symbol = result.symbol;
              span = offsetSpan(result.span, ast.sourceSpan.start.offset);
            }
          }
        },
        visitText(ast) {},
        visitDirective(ast) {
          // Need to cast because 'reference' is typed as any
          staticSymbol = ast.directive.type.reference as StaticSymbol;
          symbol = info.template.query.getTypeSymbol(staticSymbol);
          span = spanOf(ast);
        },
        visitDirectiveProperty(ast) {
          if (!attributeValueSymbol()) {
            const directive = findParentOfBinding(info.templateAst, ast, templatePosition);
            const attribute = findAttribute(info, position);
            if (directive && attribute) {
              if (attribute.name.startsWith('*')) {
                const compileTypeSummary = directive.directive;
                symbol = info.template.query.getTypeSymbol(compileTypeSummary.type.reference);
                symbol = symbol && new OverrideKindSymbol(symbol, DirectiveKind.DIRECTIVE);
                // Use 'attribute.sourceSpan' instead of the directive's,
                // because the span of the directive is the whole opening tag of an element.
                span = spanOf(attribute.sourceSpan);
              } else {
                symbol = findInputBinding(info, ast.templateName, directive);
                span = spanOf(ast);
              }
            }
          }
        }
      },
      null);
  if (symbol && span) {
    const {start, end} = offsetSpan(span, info.template.span.start);
    return {
      symbol,
      span: tss.createTextSpanFromBounds(start, end), staticSymbol,
    };
  }
}

// Get the symbol in attribute value at template position.
function getSymbolInAttributeValue(info: AstResult, path: TemplateAstPath, attribute: Attribute):
    {symbol: Symbol, span: Span}|undefined {
  if (!attribute.valueSpan) {
    return;
  }
  let result: {symbol: Symbol, span: Span}|undefined;
  const {templateBindings} = info.expressionParser.parseTemplateBindings(
      attribute.name, attribute.value, attribute.sourceSpan.toString(),
      attribute.valueSpan.start.offset);
  // Find where the cursor is relative to the start of the attribute value.
  const valueRelativePosition = path.position - attribute.valueSpan.start.offset;

  // Find the symbol that contains the position.
  templateBindings.filter(tb => !tb.keyIsVar).forEach(tb => {
    if (inSpan(valueRelativePosition, tb.expression?.ast.span)) {
      const dinfo = diagnosticInfoFromTemplateInfo(info);
      const scope = getExpressionScope(dinfo, path);
      result = getExpressionSymbol(scope, tb.expression !, path.position, info.template.query);
    } else if (inSpan(valueRelativePosition, tb.span)) {
      const template = path.first(EmbeddedTemplateAst);
      if (template) {
        // One element can only have one template binding.
        const directiveAst = template.directives[0];
        if (directiveAst) {
          const symbol = findInputBinding(info, tb.key.substring(1), directiveAst);
          if (symbol) {
            result = {symbol, span: tb.span};
          }
        }
      }
    }
  });
  return result;
}

function findAttribute(info: AstResult, position: number): Attribute|undefined {
  const templatePosition = position - info.template.span.start;
  const path = getPathToNodeAtPosition(info.htmlAst, templatePosition);
  return path.first(Attribute);
}

// TODO: remove this function after the path includes 'DirectiveAst'.
// Find the directive that corresponds to the specified 'binding'
// at the specified 'position' in the 'ast'.
function findParentOfBinding(
    ast: TemplateAst[], binding: BoundDirectivePropertyAst, position: number): DirectiveAst|
    undefined {
  let res: DirectiveAst|undefined;
  const visitor = new class extends RecursiveTemplateAstVisitor {
    visit(ast: TemplateAst): any {
      const span = spanOf(ast);
      if (!inSpan(position, span)) {
        // Returning a value here will result in the children being skipped.
        return true;
      }
    }

    visitEmbeddedTemplate(ast: EmbeddedTemplateAst, context: any): any {
      return this.visitChildren(context, visit => {
        visit(ast.directives);
        visit(ast.children);
      });
    }

    visitElement(ast: ElementAst, context: any): any {
      return this.visitChildren(context, visit => {
        visit(ast.directives);
        visit(ast.children);
      });
    }

    visitDirective(ast: DirectiveAst) {
      const result = this.visitChildren(ast, visit => { visit(ast.inputs); });
      return result;
    }

    visitDirectiveProperty(ast: BoundDirectivePropertyAst, context: DirectiveAst) {
      if (ast === binding) {
        res = context;
      }
    }
  };
  templateVisitAll(visitor, ast);
  return res;
}

// Find the symbol of input binding in 'directiveAst' by 'name'.
function findInputBinding(info: AstResult, name: string, directiveAst: DirectiveAst): Symbol|
    undefined {
  const invertedInput = invertMap(directiveAst.directive.inputs);
  const fieldName = invertedInput[name];
  if (fieldName) {
    const classSymbol = info.template.query.getTypeSymbol(directiveAst.directive.type.reference);
    if (classSymbol) {
      return classSymbol.members().get(fieldName);
    }
  }
}

/**
 * Wrap a symbol and change its kind to component.
 */
class OverrideKindSymbol implements Symbol {
  public readonly kind: DirectiveKind;
  constructor(private sym: Symbol, kindOverride: DirectiveKind) { this.kind = kindOverride; }

  get name(): string { return this.sym.name; }

  get language(): string { return this.sym.language; }

  get type(): Symbol|undefined { return this.sym.type; }

  get container(): Symbol|undefined { return this.sym.container; }

  get public(): boolean { return this.sym.public; }

  get callable(): boolean { return this.sym.callable; }

  get nullable(): boolean { return this.sym.nullable; }

  get definition(): Definition { return this.sym.definition; }

  get documentation(): ts.SymbolDisplayPart[] { return this.sym.documentation; }

  members() { return this.sym.members(); }

  signatures() { return this.sym.signatures(); }

  selectSignature(types: Symbol[]) { return this.sym.selectSignature(types); }

  indexed(argument: Symbol) { return this.sym.indexed(argument); }

  typeArguments(): Symbol[]|undefined { return this.sym.typeArguments(); }
}

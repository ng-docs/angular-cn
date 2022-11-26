/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {AST, BindingPipe, LiteralPrimitive, PropertyRead, PropertyWrite, SafePropertyRead, TmplAstBoundAttribute, TmplAstBoundEvent, TmplAstNode, TmplAstReference, TmplAstTextAttribute, TmplAstVariable} from '@angular/compiler';
import {NgCompiler} from '@angular/compiler-cli/src/ngtsc/core';
import {absoluteFrom} from '@angular/compiler-cli/src/ngtsc/file_system';
import {DirectiveMeta, PipeMeta} from '@angular/compiler-cli/src/ngtsc/metadata';
import {DirectiveSymbol, Symbol, SymbolKind, TcbLocation, TemplateTypeChecker} from '@angular/compiler-cli/src/ngtsc/typecheck/api';
import {ExpressionIdentifier, hasExpressionIdentifier} from '@angular/compiler-cli/src/ngtsc/typecheck/src/comments';
import ts from 'typescript';

import {getTargetAtPosition, TargetNodeKind} from './template_target';
import {findTightestNode, getParentClassDeclaration} from './ts_utils';
import {getDirectiveMatchesForAttribute, getDirectiveMatchesForElementTag, getTemplateLocationFromTcbLocation, isWithin, TemplateInfo, toTextSpan} from './utils';

/**
 * Represents a location in a file.
 *
 * 表示文件中的位置。
 *
 */
export interface FilePosition {
  fileName: string;
  position: number;
}

/**
 * Converts a `TcbLocation` to a more genericly named `FilePosition`.
 *
 * 将 `TcbLocation` 转换为更通用的 `FilePosition` 。
 *
 */
function toFilePosition(tcbLocation: TcbLocation): FilePosition {
  return {fileName: tcbLocation.tcbPath, position: tcbLocation.positionInFile};
}
export interface TemplateLocationDetails {
  /**
   * A target node in a template.
   *
   * 模板中的目标节点。
   *
   */
  templateTarget: TmplAstNode|AST;

  /**
   * TypeScript locations which the template node maps to. A given template node might map to
   * several TS nodes. For example, a template node for an attribute might resolve to several
   * directives or a directive and one of its inputs.
   *
   * 模板节点映射到的 TypeScript 位置。给定的模板节点可能会映射到多个 TS
   * 节点。例如，属性的模板节点可能会解析为多个指令或一个指令及其输入之一。
   *
   */
  typescriptLocations: FilePosition[];

  /**
   * The resolved Symbol for the template target.
   *
   * 模板目标的解析后的 Symbol。
   *
   */
  symbol: Symbol;
}


/**
 * Takes a position in a template and finds equivalent targets in TS files as well as details about
 * the targeted template node.
 *
 * 在模板中获取一个位置，并在 TS 文件中查找等效目标以及有关目标模板节点的详细信息。
 *
 */
export function getTargetDetailsAtTemplatePosition(
    {template, component}: TemplateInfo, position: number,
    templateTypeChecker: TemplateTypeChecker): TemplateLocationDetails[]|null {
  // Find the AST node in the template at the position.
  const positionDetails = getTargetAtPosition(template, position);
  if (positionDetails === null) {
    return null;
  }

  const nodes = positionDetails.context.kind === TargetNodeKind.TwoWayBindingContext ?
      positionDetails.context.nodes :
      [positionDetails.context.node];

  const details: TemplateLocationDetails[] = [];

  for (const node of nodes) {
    // Get the information about the TCB at the template position.
    const symbol = templateTypeChecker.getSymbolOfNode(node, component);
    if (symbol === null) {
      continue;
    }

    const templateTarget = node;
    switch (symbol.kind) {
      case SymbolKind.Directive:
      case SymbolKind.Template:
        // References to elements, templates, and directives will be through template references
        // (#ref). They shouldn't be used directly for a Language Service reference request.
        break;
      case SymbolKind.Element: {
        const matches = getDirectiveMatchesForElementTag(symbol.templateNode, symbol.directives);
        details.push({
          typescriptLocations: getPositionsForDirectives(matches),
          templateTarget,
          symbol,
        });
        break;
      }
      case SymbolKind.DomBinding: {
        // Dom bindings aren't currently type-checked (see `checkTypeOfDomBindings`) so they don't
        // have a shim location. This means we can't match dom bindings to their lib.dom
        // reference, but we can still see if they match to a directive.
        if (!(node instanceof TmplAstTextAttribute) && !(node instanceof TmplAstBoundAttribute)) {
          return null;
        }
        const directives = getDirectiveMatchesForAttribute(
            node.name, symbol.host.templateNode, symbol.host.directives);
        details.push({
          typescriptLocations: getPositionsForDirectives(directives),
          templateTarget,
          symbol,
        });
        break;
      }
      case SymbolKind.Reference: {
        details.push({
          typescriptLocations: [toFilePosition(symbol.referenceVarLocation)],
          templateTarget,
          symbol,
        });
        break;
      }
      case SymbolKind.Variable: {
        if ((templateTarget instanceof TmplAstVariable)) {
          if (templateTarget.valueSpan !== undefined &&
              isWithin(position, templateTarget.valueSpan)) {
            // In the valueSpan of the variable, we want to get the reference of the initializer.
            details.push({
              typescriptLocations: [toFilePosition(symbol.initializerLocation)],
              templateTarget,
              symbol,
            });
          } else if (isWithin(position, templateTarget.keySpan)) {
            // In the keySpan of the variable, we want to get the reference of the local variable.
            details.push({
              typescriptLocations: [toFilePosition(symbol.localVarLocation)],
              templateTarget,
              symbol,
            });
          }
        } else {
          // If the templateNode is not the `TmplAstVariable`, it must be a usage of the
          // variable somewhere in the template.
          details.push({
            typescriptLocations: [toFilePosition(symbol.localVarLocation)],
            templateTarget,
            symbol,
          });
        }
        break;
      }
      case SymbolKind.Input:
      case SymbolKind.Output: {
        details.push({
          typescriptLocations: symbol.bindings.map(binding => toFilePosition(binding.tcbLocation)),
          templateTarget,
          symbol,
        });
        break;
      }
      case SymbolKind.Pipe:
      case SymbolKind.Expression: {
        details.push({
          typescriptLocations: [toFilePosition(symbol.tcbLocation)],
          templateTarget,
          symbol,
        });
        break;
      }
    }
  }

  return details.length > 0 ? details : null;
}

/**
 * Given a set of `DirectiveSymbol`s, finds the equivalent `FilePosition` of the class declaration.
 *
 * 给定一组 `DirectiveSymbol` ，查找类声明的等效 `FilePosition` 。
 *
 */
function getPositionsForDirectives(directives: Set<DirectiveSymbol>): FilePosition[] {
  const allDirectives: FilePosition[] = [];
  for (const dir of directives.values()) {
    const dirClass = dir.tsSymbol.valueDeclaration;
    if (dirClass === undefined || !ts.isClassDeclaration(dirClass) || dirClass.name === undefined) {
      continue;
    }

    const {fileName} = dirClass.getSourceFile();
    const position = dirClass.name.getStart();
    allDirectives.push({fileName, position});
  }

  return allDirectives;
}

/**
 * Creates a "key" for a rename/reference location by concatenating file name, span start, and span
 * length. This allows us to de-duplicate template results when an item may appear several times
 * in the TCB but map back to the same template location.
 *
 * 通过连接文件名、跨度开始和跨度长度为重命名/引用位置创建“键”。这允许我们当一个条目可能在 TCB
 * 中出现多次但映射回同一个模板位置时，可以对模板结果进行重复数据删除。
 *
 */
export function createLocationKey(ds: ts.DocumentSpan) {
  return ds.fileName + ds.textSpan.start + ds.textSpan.length;
}

/**
 * Converts a given `ts.DocumentSpan` in a shim file to its equivalent `ts.DocumentSpan` in the
 * template.
 *
 * 将 shim 文件中的给定 `ts.DocumentSpan` 转换为模板中的等效 `ts.DocumentSpan` 。
 *
 * You can optionally provide a `requiredNodeText` that ensures the equivalent template node's text
 * matches. If it does not, this function will return `null`.
 *
 * 你可以选择提供 `requiredNodeText` ，以确保等效模板节点的文本匹配。如果不是，此函数将返回 `null`
 * 。
 *
 */
export function convertToTemplateDocumentSpan<T extends ts.DocumentSpan>(
    shimDocumentSpan: T, templateTypeChecker: TemplateTypeChecker, program: ts.Program,
    requiredNodeText?: string): T|null {
  const sf = program.getSourceFile(shimDocumentSpan.fileName);
  if (sf === undefined) {
    return null;
  }
  const tcbNode = findTightestNode(sf, shimDocumentSpan.textSpan.start);
  if (tcbNode === undefined ||
      hasExpressionIdentifier(sf, tcbNode, ExpressionIdentifier.EVENT_PARAMETER)) {
    // If the reference result is the $event parameter in the subscribe/addEventListener
    // function in the TCB, we want to filter this result out of the references. We really only
    // want to return references to the parameter in the template itself.
    return null;
  }
  // TODO(atscott): Determine how to consistently resolve paths. i.e. with the project
  // serverHost or LSParseConfigHost in the adapter. We should have a better defined way to
  // normalize paths.
  const mapping = getTemplateLocationFromTcbLocation(
      templateTypeChecker, absoluteFrom(shimDocumentSpan.fileName), /* tcbIsShim */ true,
      shimDocumentSpan.textSpan.start);
  if (mapping === null) {
    return null;
  }

  const {span, templateUrl} = mapping;
  if (requiredNodeText !== undefined && span.toString() !== requiredNodeText) {
    return null;
  }

  return {
    ...shimDocumentSpan,
    fileName: templateUrl,
    textSpan: toTextSpan(span),
    // Specifically clear other text span values because we do not have enough knowledge to
    // convert these to spans in the template.
    contextSpan: undefined,
    originalContextSpan: undefined,
    originalTextSpan: undefined,
  };
}

/**
 * Finds the text and `ts.TextSpan` for the node at a position in a template.
 *
 * 在模板中的某个位置查找节点的文本和 `ts.TextSpan` 。
 *
 */
export function getRenameTextAndSpanAtPosition(
    node: TmplAstNode|AST, position: number): {text: string, span: ts.TextSpan}|null {
  if (node instanceof TmplAstBoundAttribute || node instanceof TmplAstTextAttribute ||
      node instanceof TmplAstBoundEvent) {
    if (node.keySpan === undefined) {
      return null;
    }
    return {text: node.name, span: toTextSpan(node.keySpan)};
  } else if (node instanceof TmplAstVariable || node instanceof TmplAstReference) {
    if (isWithin(position, node.keySpan)) {
      return {text: node.keySpan.toString(), span: toTextSpan(node.keySpan)};
    } else if (node.valueSpan && isWithin(position, node.valueSpan)) {
      return {text: node.valueSpan.toString(), span: toTextSpan(node.valueSpan)};
    }
  }

  if (node instanceof PropertyRead || node instanceof PropertyWrite ||
      node instanceof SafePropertyRead || node instanceof BindingPipe) {
    return {text: node.name, span: toTextSpan(node.nameSpan)};
  } else if (node instanceof LiteralPrimitive) {
    const span = toTextSpan(node.sourceSpan);
    const text = node.value;
    if (typeof text === 'string') {
      // The span of a string literal includes the quotes but they should be removed for renaming.
      span.start += 1;
      span.length -= 2;
    }
    return {text, span};
  }

  return null;
}

/**
 * Retrieves the `PipeMeta` or `DirectiveMeta` of the given `ts.Node`'s parent class.
 *
 * 检索给定 `ts.Node` 父类的 `PipeMeta` 或 `DirectiveMeta` 。
 *
 * Returns `null` if the node has no parent class or there is no meta associated with the class.
 *
 * 如果节点没有父类或没有与类关联的元，则返回 `null` 。
 *
 */
export function getParentClassMeta(requestNode: ts.Node, compiler: NgCompiler): PipeMeta|
    DirectiveMeta|null {
  const parentClass = getParentClassDeclaration(requestNode);
  if (parentClass === undefined) {
    return null;
  }
  return compiler.getMeta(parentClass);
}

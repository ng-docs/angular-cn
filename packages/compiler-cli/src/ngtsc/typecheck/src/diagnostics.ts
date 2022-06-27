/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {AbsoluteSourceSpan, ParseSourceSpan} from '@angular/compiler';
import ts from 'typescript';

import {TemplateDiagnostic, TemplateId} from '../api';
import {makeTemplateDiagnostic} from '../diagnostics';

import {getTemplateMapping, TemplateSourceResolver} from './tcb_util';


/**
 * Wraps the node in parenthesis such that inserted span comments become attached to the proper
 * node. This is an alias for `ts.factory.createParenthesizedExpression` with the benefit that it
 * signifies that the inserted parenthesis are for diagnostic purposes, not for correctness of the
 * rendered TCB code.
 *
 * 将节点包装在括号中，以便插入的 span 注释附加到正确的节点。这是
 * `ts.factory.createParenthesizedExpression`
 * 的别名，其好处是它表明插入的括号用于诊断目的，而不是为了呈现的 TCB 代码的正确性。
 *
 * Note that it is important that nodes and its attached comment are not wrapped into parenthesis
 * by default, as it prevents correct translation of e.g. diagnostics produced for incorrect method
 * arguments. Such diagnostics would then be produced for the parenthesised node whereas the
 * positional comment would be located within that node, resulting in a mismatch.
 *
 * 请注意，默认情况下，节点及其附加的注释不会被包装在括号中，因为它会阻止正确翻译，例如为不正确的方法参数生成的诊断结果。然后将为括号中的节点生成这样的诊断，而位置注释将位于该节点中，导致不匹配。
 *
 */
export function wrapForDiagnostics(expr: ts.Expression): ts.Expression {
  return ts.factory.createParenthesizedExpression(expr);
}

/**
 * Wraps the node in parenthesis such that inserted span comments become attached to the proper
 * node. This is an alias for `ts.factory.createParenthesizedExpression` with the benefit that it
 * signifies that the inserted parenthesis are for use by the type checker, not for correctness of
 * the rendered TCB code.
 *
 * 将节点包装在括号中，以便插入的 span 注释附加到正确的节点。这是
 * `ts.factory.createParenthesizedExpression`
 * 的别名，其好处是它表明插入的括号是供类型检查器使用的，而不是为了呈现的 TCB 代码的正确性。
 *
 */
export function wrapForTypeChecker(expr: ts.Expression): ts.Expression {
  return ts.factory.createParenthesizedExpression(expr);
}

/**
 * Adds a synthetic comment to the expression that represents the parse span of the provided node.
 * This comment can later be retrieved as trivia of a node to recover original source locations.
 *
 * 向表示所提供节点的解析跨度的表达式添加合成注释。此注释以后可以作为节点的琐事检索以恢复原始源位置。
 *
 */
export function addParseSpanInfo(node: ts.Node, span: AbsoluteSourceSpan|ParseSourceSpan): void {
  let commentText: string;
  if (span instanceof AbsoluteSourceSpan) {
    commentText = `${span.start},${span.end}`;
  } else {
    commentText = `${span.start.offset},${span.end.offset}`;
  }
  ts.addSyntheticTrailingComment(
      node, ts.SyntaxKind.MultiLineCommentTrivia, commentText, /* hasTrailingNewLine */ false);
}

/**
 * Adds a synthetic comment to the function declaration that contains the template id
 * of the class declaration.
 *
 * 向包含类声明的模板 id 的函数声明添加合成注释。
 *
 */
export function addTemplateId(tcb: ts.FunctionDeclaration, id: TemplateId): void {
  ts.addSyntheticLeadingComment(tcb, ts.SyntaxKind.MultiLineCommentTrivia, id, true);
}

/**
 * Determines if the diagnostic should be reported. Some diagnostics are produced because of the
 * way TCBs are generated; those diagnostics should not be reported as type check errors of the
 * template.
 *
 * 确定是否应报告诊断。由于 TCB 的生成方式，会产生某些诊断；这些诊断不应报告为模板的类型检查错误。
 *
 */
export function shouldReportDiagnostic(diagnostic: ts.Diagnostic): boolean {
  const {code} = diagnostic;
  if (code === 6133 /* $var is declared but its value is never read. */) {
    return false;
  } else if (code === 6199 /* All variables are unused. */) {
    return false;
  } else if (code === 2695 /* Left side of comma operator is unused and has no side effects. */) {
    return false;
  } else if (code === 7006 /* Parameter '$event' implicitly has an 'any' type. */) {
    return false;
  }
  return true;
}

/**
 * Attempts to translate a TypeScript diagnostic produced during template type-checking to their
 * location of origin, based on the comments that are emitted in the TCB code.
 *
 * 尝试根据 TCB 代码中发出的注释将模板类型检查期间生成的 TypeScript 诊断转换为它们的原始位置。
 *
 * If the diagnostic could not be translated, `null` is returned to indicate that the diagnostic
 * should not be reported at all. This prevents diagnostics from non-TCB code in a user's source
 * file from being reported as type-check errors.
 *
 * 如果无法转换诊断，则返回 `null` 以表明根本不应该报告诊断。这可以防止来自用户源文件中的非 TCB
 * 代码的诊断被报告为类型检查错误。
 *
 */
export function translateDiagnostic(
    diagnostic: ts.Diagnostic, resolver: TemplateSourceResolver): TemplateDiagnostic|null {
  if (diagnostic.file === undefined || diagnostic.start === undefined) {
    return null;
  }
  const fullMapping = getTemplateMapping(
      diagnostic.file, diagnostic.start, resolver, /*isDiagnosticsRequest*/ true);
  if (fullMapping === null) {
    return null;
  }

  const {sourceLocation, templateSourceMapping, span} = fullMapping;
  return makeTemplateDiagnostic(
      sourceLocation.id, templateSourceMapping, span, diagnostic.category, diagnostic.code,
      diagnostic.messageText);
}

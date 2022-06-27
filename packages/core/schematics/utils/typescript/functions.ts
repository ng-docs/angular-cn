/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

/**
 * Checks whether a given node is a function like declaration.
 *
 * 检查给定的节点是否是类似于函数的声明。
 *
 */
export function isFunctionLikeDeclaration(node: ts.Node): node is ts.FunctionLikeDeclaration {
  return ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node) ||
      ts.isArrowFunction(node) || ts.isFunctionExpression(node) ||
      ts.isGetAccessorDeclaration(node) || ts.isSetAccessorDeclaration(node);
}

/**
 * Unwraps a given expression TypeScript node. Expressions can be wrapped within multiple
 * parentheses or as expression. e.g. "(((({exp}))))()". The function should return the
 * TypeScript node referring to the inner expression. e.g "exp".
 *
 * 展开给定的表达式 TypeScript
 * 节点。表达式可以用多个括号或作为表达式包装。例如“(((({exp})))))()”。该函数应返回引用内部表达式的
 * TypeScript 节点。例如“exp”。
 *
 */
export function unwrapExpression(node: ts.Expression|ts.ParenthesizedExpression): ts.Expression {
  if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node)) {
    return unwrapExpression(node.expression);
  } else {
    return node;
  }
}

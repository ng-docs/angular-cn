/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {assert, AstHost, FatalLinkerError, Range} from '../../../../linker';
import {types as t} from '../babel_core';

/**
 * This implementation of `AstHost` is able to get information from Babel AST nodes.
 *
 * `AstHost` 的此实现能够从 Babel AST 节点获取信息。
 *
 */
export class BabelAstHost implements AstHost<t.Expression> {
  getSymbolName(node: t.Expression): string|null {
    if (t.isIdentifier(node)) {
      return node.name;
    } else if (t.isMemberExpression(node) && t.isIdentifier(node.property)) {
      return node.property.name;
    } else {
      return null;
    }
  }

  isStringLiteral = t.isStringLiteral;

  parseStringLiteral(str: t.Expression): string {
    assert(str, t.isStringLiteral, 'a string literal');
    return str.value;
  }

  isNumericLiteral = t.isNumericLiteral;

  parseNumericLiteral(num: t.Expression): number {
    assert(num, t.isNumericLiteral, 'a numeric literal');
    return num.value;
  }

  isBooleanLiteral(bool: t.Expression): boolean {
    return t.isBooleanLiteral(bool) || isMinifiedBooleanLiteral(bool);
  }

  parseBooleanLiteral(bool: t.Expression): boolean {
    if (t.isBooleanLiteral(bool)) {
      return bool.value;
    } else if (isMinifiedBooleanLiteral(bool)) {
      return !bool.argument.value;
    } else {
      throw new FatalLinkerError(bool, 'Unsupported syntax, expected a boolean literal.');
    }
  }

  isArrayLiteral = t.isArrayExpression;

  parseArrayLiteral(array: t.Expression): t.Expression[] {
    assert(array, t.isArrayExpression, 'an array literal');
    return array.elements.map(element => {
      assert(element, isNotEmptyElement, 'element in array not to be empty');
      assert(element, isNotSpreadElement, 'element in array not to use spread syntax');
      return element;
    });
  }

  isObjectLiteral = t.isObjectExpression;

  parseObjectLiteral(obj: t.Expression): Map<string, t.Expression> {
    assert(obj, t.isObjectExpression, 'an object literal');

    const result = new Map<string, t.Expression>();
    for (const property of obj.properties) {
      assert(property, t.isObjectProperty, 'a property assignment');
      assert(property.value, t.isExpression, 'an expression');
      assert(property.key, isObjectExpressionPropertyName, 'a property name');

      const key = t.isIdentifier(property.key) ? property.key.name : property.key.value;
      result.set(`${key}`, property.value);
    }
    return result;
  }

  isFunctionExpression(node: t.Expression): node is Extract<t.Function, t.Expression> {
    return t.isFunction(node);
  }

  parseReturnValue(fn: t.Expression): t.Expression {
    assert(fn, this.isFunctionExpression, 'a function');
    if (!t.isBlockStatement(fn.body)) {
      // it is a simple array function expression: `(...) => expr`
      return fn.body;
    }

    // it is a function (arrow or normal) with a body. E.g.:
    // * `(...) => { stmt; ... }`
    // * `function(...) { stmt; ... }`

    if (fn.body.body.length !== 1) {
      throw new FatalLinkerError(
          fn.body, 'Unsupported syntax, expected a function body with a single return statement.');
    }
    const stmt = fn.body.body[0];
    assert(stmt, t.isReturnStatement, 'a function body with a single return statement');

    // Babel declares `argument` as optional and nullable, so we account for both scenarios.
    if (stmt.argument === null || stmt.argument === undefined) {
      throw new FatalLinkerError(stmt, 'Unsupported syntax, expected function to return a value.');
    }

    return stmt.argument;
  }

  isCallExpression = t.isCallExpression;
  parseCallee(call: t.Expression): t.Expression {
    assert(call, t.isCallExpression, 'a call expression');
    assert(call.callee, t.isExpression, 'an expression');
    return call.callee;
  }
  parseArguments(call: t.Expression): t.Expression[] {
    assert(call, t.isCallExpression, 'a call expression');
    return call.arguments.map(arg => {
      assert(arg, isNotSpreadArgument, 'argument not to use spread syntax');
      assert(arg, t.isExpression, 'argument to be an expression');
      return arg;
    });
  }

  getRange(node: t.Expression): Range {
    if (node.loc == null || node.start == null || node.end == null) {
      throw new FatalLinkerError(
          node, 'Unable to read range for node - it is missing location information.');
    }
    return {
      startLine: node.loc.start.line - 1,  // Babel lines are 1-based
      startCol: node.loc.start.column,
      startPos: node.start,
      endPos: node.end,
    };
  }
}

/**
 * Return true if the expression does not represent an empty element in an array literal.
 * For example in `[,foo]` the first element is "empty".
 *
 * 如果表达式不表示数组文字中的空元素，则返回 true。例如，在 `[,foo]` 中，第一个元素是“empty”。
 *
 */
function isNotEmptyElement(e: t.Expression|t.SpreadElement|null): e is t.Expression|
    t.SpreadElement {
  return e !== null;
}

/**
 * Return true if the expression is not a spread element of an array literal.
 * For example in `[x, ...rest]` the `...rest` expression is a spread element.
 *
 * 如果表达式不是数组文字的扩展元素，则返回 true。例如，在 `[x, ...rest]` 中， `...rest`
 * 表达式是扩展元素。
 *
 */
function isNotSpreadElement(e: t.Expression|t.SpreadElement): e is t.Expression {
  return !t.isSpreadElement(e);
}


/**
 * Return true if the node can be considered a text based property name for an
 * object expression.
 *
 * 如果节点可以被认为是对象表达式的基于文本的属性名称，则返回 true 。
 *
 * Notably in the Babel AST, object patterns (for destructuring) could be of type
 * `t.PrivateName` so we need a distinction between object expressions and patterns.
 *
 * 值得注意的是，在 Babel AST 中，对象模式（用于解构）可能是 `t.PrivateName`
 * 类型，因此我们需要区分对象表达式和模式。
 *
 */
function isObjectExpressionPropertyName(n: t.Node): n is t.Identifier|t.StringLiteral|
    t.NumericLiteral {
  return t.isIdentifier(n) || t.isStringLiteral(n) || t.isNumericLiteral(n);
}

/**
 * The declared type of an argument to a call expression.
 *
 * 调用表达式的参数的声明类型。
 *
 */
type ArgumentType = t.CallExpression['arguments'][number];

/**
 * Return true if the argument is not a spread element.
 *
 * 如果参数不是展开元素，则返回 true 。
 *
 */
function isNotSpreadArgument(arg: ArgumentType): arg is Exclude<ArgumentType, t.SpreadElement> {
  return !t.isSpreadElement(arg);
}

type MinifiedBooleanLiteral = t.Expression&t.UnaryExpression&{argument: t.NumericLiteral};

/**
 * Return true if the node is either `!0` or `!1`.
 *
 * 如果节点是 `!0` 或 `!1` ，则返回 true 。
 *
 */
function isMinifiedBooleanLiteral(node: t.Expression): node is MinifiedBooleanLiteral {
  return t.isUnaryExpression(node) && node.prefix && node.operator === '!' &&
      t.isNumericLiteral(node.argument) && (node.argument.value === 0 || node.argument.value === 1);
}

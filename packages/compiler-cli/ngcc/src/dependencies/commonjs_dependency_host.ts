/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';

import {AbsoluteFsPath} from '../../../src/ngtsc/file_system';
import {isRequireCall, isWildcardReexportStatement, RequireCall} from '../host/commonjs_umd_utils';

import {DependencyHostBase} from './dependency_host';

/**
 * Helper functions for computing dependencies.
 *
 * 用于计算依赖项的帮助函数。
 *
 */
export class CommonJsDependencyHost extends DependencyHostBase {
  protected override canSkipFile(fileContents: string): boolean {
    return !hasRequireCalls(fileContents);
  }

  protected override extractImports(file: AbsoluteFsPath, fileContents: string): Set<string> {
    // Parse the source into a TypeScript AST and then walk it looking for imports and re-exports.
    const sf =
        ts.createSourceFile(file, fileContents, ts.ScriptTarget.ES2015, false, ts.ScriptKind.JS);
    const requireCalls: RequireCall[] = [];

    for (const stmt of sf.statements) {
      if (ts.isVariableStatement(stmt)) {
        // Regular import(s):
        // `var foo = require('...')` or `var foo = require('...'), bar = require('...')`
        const declarations = stmt.declarationList.declarations;
        for (const declaration of declarations) {
          if ((declaration.initializer !== undefined) && isRequireCall(declaration.initializer)) {
            requireCalls.push(declaration.initializer);
          }
        }
      } else if (ts.isExpressionStatement(stmt)) {
        if (isRequireCall(stmt.expression)) {
          // Import for the side-effects only:
          // `require('...')`
          requireCalls.push(stmt.expression);
        } else if (isWildcardReexportStatement(stmt)) {
          // Re-export in one of the following formats:
          // - `__export(require('...'))`
          // - `__export(<identifier>)`
          // - `tslib_1.__exportStar(require('...'), exports)`
          // - `tslib_1.__exportStar(<identifier>, exports)`
          const firstExportArg = stmt.expression.arguments[0];

          if (isRequireCall(firstExportArg)) {
            // Re-export with `require()` call:
            // `__export(require('...'))` or `tslib_1.__exportStar(require('...'), exports)`
            requireCalls.push(firstExportArg);
          }
        } else if (
            ts.isBinaryExpression(stmt.expression) &&
            (stmt.expression.operatorToken.kind === ts.SyntaxKind.EqualsToken)) {
          if (isRequireCall(stmt.expression.right)) {
            // Import with assignment. E.g.:
            // `exports.foo = require('...')`
            requireCalls.push(stmt.expression.right);
          } else if (ts.isObjectLiteralExpression(stmt.expression.right)) {
            // Import in object literal. E.g.:
            // `module.exports = {foo: require('...')}`
            stmt.expression.right.properties.forEach(prop => {
              if (ts.isPropertyAssignment(prop) && isRequireCall(prop.initializer)) {
                requireCalls.push(prop.initializer);
              }
            });
          }
        }
      }
    }

    return new Set(requireCalls.map(call => call.arguments[0].text));
  }
}

/**
 * Check whether a source file needs to be parsed for imports.
 * This is a performance short-circuit, which saves us from creating
 * a TypeScript AST unnecessarily.
 *
 * 检查是否需要解析源文件以进行导入。这是一个性能短路，它使我们免于创建不必要的 TypeScript AST。
 *
 * @param source The content of the source file to check.
 *
 * 要检查的源文件的内容。
 *
 * @returns
 *
 * false if there are definitely no require calls
 * in this file, true otherwise.
 *
 * 如果此文件中绝对没有 require 调用，则为 false ，否则为 true 。
 *
 */
export function hasRequireCalls(source: string): boolean {
  return /require\(['"]/.test(source);
}

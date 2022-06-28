/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NodePath} from '@babel/traverse';

import {FileLinker, isFatalLinkerError, LinkerEnvironment} from '../../../linker';

import {BabelAstFactory} from './ast/babel_ast_factory';
import {BabelAstHost} from './ast/babel_ast_host';
import {BabelFile, PluginObj, types as t} from './babel_core';
import {BabelDeclarationScope, ConstantScopePath} from './babel_declaration_scope';
import {LinkerPluginOptions} from './linker_plugin_options';

/**
 * Create a Babel plugin that visits the program, identifying and linking partial declarations.
 *
 * 创建一个访问程序、识别和链接部分声明的 Babel 插件。
 *
 * The plugin delegates most of its work to a generic `FileLinker` for each file (`t.Program` in
 * Babel) that is visited.
 *
 * 该插件将其大部分工作委托给每个访问的文件（Babel 中的 `t.Program`）的通用 `FileLinker` 。
 *
 */
export function createEs2015LinkerPlugin({fileSystem, logger, ...options}: LinkerPluginOptions):
    PluginObj {
  let fileLinker: FileLinker<ConstantScopePath, t.Statement, t.Expression>|null = null;

  return {
    visitor: {
      Program: {

        /**
         * Create a new `FileLinker` as we enter each file (`t.Program` in Babel).
         *
         * 当我们输入每个文件（Babel 中的 `t.Program`）时，创建一个新的 `FileLinker` 。
         *
         */
        enter(path: NodePath<t.Program>): void {
          assertNull(fileLinker);
          // Babel can be configured with a `filename` or `relativeFilename` (or both, or neither) -
          // possibly relative to the optional `cwd` path.
          const file = path.hub.file;
          const filename = file.opts.filename ?? file.opts.filenameRelative;
          if (!filename) {
            throw new Error(
                'No filename (nor filenameRelative) provided by Babel. This is required for the linking of partially compiled directives and components.');
          }
          const sourceUrl = fileSystem.resolve(file.opts.cwd ?? '.', filename);

          const linkerEnvironment = LinkerEnvironment.create<t.Statement, t.Expression>(
              fileSystem, logger, new BabelAstHost(), new BabelAstFactory(sourceUrl), options);
          fileLinker = new FileLinker(linkerEnvironment, sourceUrl, file.code);
        },

        /**
         * On exiting the file, insert any shared constant statements that were generated during
         * linking of the partial declarations.
         *
         * 退出文件时，插入在链接部分声明期间生成的任何共享常量语句。
         *
         */
        exit(): void {
          assertNotNull(fileLinker);
          for (const {constantScope, statements} of fileLinker.getConstantStatements()) {
            insertStatements(constantScope, statements);
          }
          fileLinker = null;
        }
      },

      /**
       * Test each call expression to see if it is a partial declaration; it if is then replace it
       * with the results of linking the declaration.
       *
       * 测试每个调用表达式以查看它是否是部分声明；如果是，则将其替换为链接声明的结果。
       *
       */
      CallExpression(call: NodePath<t.CallExpression>): void {
        if (fileLinker === null) {
          // Any statements that are inserted upon program exit will be visited outside of an active
          // linker context. These call expressions are known not to contain partial declarations,
          // so it's safe to skip visiting those call expressions.
          return;
        }

        try {
          const calleeName = getCalleeName(call);
          if (calleeName === null) {
            return;
          }
          const args = call.node.arguments;
          if (!fileLinker.isPartialDeclaration(calleeName) || !isExpressionArray(args)) {
            return;
          }

          const declarationScope = new BabelDeclarationScope(call.scope);
          const replacement = fileLinker.linkPartialDeclaration(calleeName, args, declarationScope);

          call.replaceWith(replacement);
        } catch (e) {
          const node = isFatalLinkerError(e) ? e.node as t.Node : call.node;
          throw buildCodeFrameError(call.hub.file, (e as Error).message, node);
        }
      }
    }
  };
}

/**
 * Insert the `statements` at the location defined by `path`.
 *
 * 在 `path` 定义的位置插入 `statements` 。
 *
 * The actual insertion strategy depends upon the type of the `path`.
 *
 * 实际的插入策略取决于 `path` 的类型。
 *
 */
function insertStatements(path: ConstantScopePath, statements: t.Statement[]): void {
  if (path.isProgram()) {
    insertIntoProgram(path, statements);
  } else {
    insertIntoFunction(path, statements);
  }
}

/**
 * Insert the `statements` at the top of the body of the `fn` function.
 *
 * 在 `fn` 函数体的顶部插入 `statements` 。
 *
 */
function insertIntoFunction(
    fn: NodePath<t.FunctionExpression|t.FunctionDeclaration>, statements: t.Statement[]): void {
  const body = fn.get('body');
  body.unshiftContainer('body', statements);
}

/**
 * Insert the `statements` at the top of the `program`, below any import statements.
 *
 * 在 `program` 顶部，任何 import 语句下方插入 `statements` 。
 *
 */
function insertIntoProgram(program: NodePath<t.Program>, statements: t.Statement[]): void {
  const body = program.get('body');
  const importStatements = body.filter(statement => statement.isImportDeclaration());
  if (importStatements.length === 0) {
    program.unshiftContainer('body', statements);
  } else {
    importStatements[importStatements.length - 1].insertAfter(statements);
  }
}

function getCalleeName(call: NodePath<t.CallExpression>): string|null {
  const callee = call.node.callee;
  if (t.isIdentifier(callee)) {
    return callee.name;
  } else if (t.isMemberExpression(callee) && t.isIdentifier(callee.property)) {
    return callee.property.name;
  } else if (t.isMemberExpression(callee) && t.isStringLiteral(callee.property)) {
    return callee.property.value;
  } else {
    return null;
  }
}

/**
 * Return true if all the `nodes` are Babel expressions.
 *
 * 如果所有 `nodes` 都是 Babel 表达式，则返回 true 。
 *
 */
function isExpressionArray(nodes: t.Node[]): nodes is t.Expression[] {
  return nodes.every(node => t.isExpression(node));
}

/**
 * Assert that the given `obj` is `null`.
 *
 * 断言给定的 `obj` 是 `null` 。
 *
 */
function assertNull<T>(obj: T|null): asserts obj is null {
  if (obj !== null) {
    throw new Error('BUG - expected `obj` to be null');
  }
}

/**
 * Assert that the given `obj` is not `null`.
 *
 * 断言给定的 `obj` 不为 `null` 。
 *
 */
function assertNotNull<T>(obj: T|null): asserts obj is T {
  if (obj === null) {
    throw new Error('BUG - expected `obj` not to be null');
  }
}

/**
 * Create a string representation of an error that includes the code frame of the `node`.
 *
 * 创建包含 `node` 的代码框架的错误的字符串表示。
 *
 */
function buildCodeFrameError(file: BabelFile, message: string, node: t.Node): string {
  const filename = file.opts.filename || '(unknown file)';
  const error = file.buildCodeFrameError(node, message);
  return `${filename}: ${error.message}`;
}

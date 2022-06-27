/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {identifierName} from '../parse_util';

import {EmitterVisitorContext} from './abstract_emitter';
import {AbstractJsEmitterVisitor} from './abstract_js_emitter';
import * as o from './output_ast';
import {newTrustedFunctionForJIT} from './output_jit_trusted_types';

export interface ExternalReferenceResolver {
  resolveExternalReference(ref: o.ExternalReference): unknown;
}

/**
 * A helper class to manage the evaluation of JIT generated code.
 *
 * 一个帮助器类，用于管理对 JIT 生成的代码的估算。
 *
 */
export class JitEvaluator {
  /**
   *
   * @param sourceUrl The URL of the generated code.
   *
   * 生成的代码的 URL。
   *
   * @param statements An array of Angular statement AST nodes to be evaluated.
   *
   * 要估算的 Angular 语句 AST 节点的数组。
   *
   * @param refResolver Resolves `o.ExternalReference`s into values.
   *
   * `o.ExternalReference` s 解析为值。
   *
   * @param createSourceMaps If true then create a source-map for the generated code and include it
   * inline as a source-map comment.
   *
   * 如果为 true，则为生成的代码创建一个 source-map ，并将其作为 source-map 注释内联包含。
   *
   * @returns
   *
   * A map of all the variables in the generated code.
   *
   * 生成的代码中所有变量的映射表。
   *
   */
  evaluateStatements(
      sourceUrl: string, statements: o.Statement[], refResolver: ExternalReferenceResolver,
      createSourceMaps: boolean): {[key: string]: any} {
    const converter = new JitEmitterVisitor(refResolver);
    const ctx = EmitterVisitorContext.createRoot();
    // Ensure generated code is in strict mode
    if (statements.length > 0 && !isUseStrictStatement(statements[0])) {
      statements = [
        o.literal('use strict').toStmt(),
        ...statements,
      ];
    }
    converter.visitAllStatements(statements, ctx);
    converter.createReturnStmt(ctx);
    return this.evaluateCode(sourceUrl, ctx, converter.getArgs(), createSourceMaps);
  }

  /**
   * Evaluate a piece of JIT generated code.
   *
   * 估算一段 JIT 生成的代码。
   *
   * @param sourceUrl The URL of this generated code.
   *
   * 此生成的代码的 URL。
   *
   * @param ctx A context object that contains an AST of the code to be evaluated.
   *
   * 包含要估算的代码的 AST 的上下文对象。
   *
   * @param vars A map containing the names and values of variables that the evaluated code might
   * reference.
   *
   * 包含已估算代码可能引用的变量的名称和值的映射表。
   *
   * @param createSourceMap If true then create a source-map for the generated code and include it
   * inline as a source-map comment.
   *
   * 如果为 true，则为生成的代码创建一个 source-map ，并将其作为 source-map 注释内联包含。
   *
   * @returns
   *
   * The result of evaluating the code.
   *
   * 估算代码的结果。
   *
   */
  evaluateCode(
      sourceUrl: string, ctx: EmitterVisitorContext, vars: {[key: string]: any},
      createSourceMap: boolean): any {
    let fnBody = `"use strict";${ctx.toSource()}\n//# sourceURL=${sourceUrl}`;
    const fnArgNames: string[] = [];
    const fnArgValues: any[] = [];
    for (const argName in vars) {
      fnArgValues.push(vars[argName]);
      fnArgNames.push(argName);
    }
    if (createSourceMap) {
      // using `new Function(...)` generates a header, 1 line of no arguments, 2 lines otherwise
      // E.g. ```
      // function anonymous(a,b,c
      // /**/) { ... }```
      // We don't want to hard code this fact, so we auto detect it via an empty function first.
      const emptyFn = newTrustedFunctionForJIT(...fnArgNames.concat('return null;')).toString();
      const headerLines = emptyFn.slice(0, emptyFn.indexOf('return null;')).split('\n').length - 1;
      fnBody += `\n${ctx.toSourceMapGenerator(sourceUrl, headerLines).toJsComment()}`;
    }
    const fn = newTrustedFunctionForJIT(...fnArgNames.concat(fnBody));
    return this.executeFunction(fn, fnArgValues);
  }

  /**
   * Execute a JIT generated function by calling it.
   *
   * 通过调用来执行 JIT 生成的函数。
   *
   * This method can be overridden in tests to capture the functions that are generated
   * by this `JitEvaluator` class.
   *
   * 可以在测试中覆盖此方法以捕获此 `JitEvaluator` 类生成的函数。
   *
   * @param fn A function to execute.
   *
   * 要执行的函数。
   *
   * @param args The arguments to pass to the function being executed.
   *
   * 要传递给正在执行的函数的参数。
   *
   * @returns
   *
   * The return value of the executed function.
   *
   * 已执行函数的返回值。
   *
   */
  executeFunction(fn: Function, args: any[]) {
    return fn(...args);
  }
}

/**
 * An Angular AST visitor that converts AST nodes into executable JavaScript code.
 *
 * 一个 Angular AST 访问器，可将 AST 节点转换为可执行的 JavaScript 代码。
 *
 */
export class JitEmitterVisitor extends AbstractJsEmitterVisitor {
  private _evalArgNames: string[] = [];
  private _evalArgValues: any[] = [];
  private _evalExportedVars: string[] = [];

  constructor(private refResolver: ExternalReferenceResolver) {
    super();
  }

  createReturnStmt(ctx: EmitterVisitorContext) {
    const stmt = new o.ReturnStatement(new o.LiteralMapExpr(this._evalExportedVars.map(
        resultVar => new o.LiteralMapEntry(resultVar, o.variable(resultVar), false))));
    stmt.visitStatement(this, ctx);
  }

  getArgs(): {[key: string]: any} {
    const result: {[key: string]: any} = {};
    for (let i = 0; i < this._evalArgNames.length; i++) {
      result[this._evalArgNames[i]] = this._evalArgValues[i];
    }
    return result;
  }

  override visitExternalExpr(ast: o.ExternalExpr, ctx: EmitterVisitorContext): any {
    this._emitReferenceToExternal(ast, this.refResolver.resolveExternalReference(ast.value), ctx);
    return null;
  }

  override visitWrappedNodeExpr(ast: o.WrappedNodeExpr<any>, ctx: EmitterVisitorContext): any {
    this._emitReferenceToExternal(ast, ast.node, ctx);
    return null;
  }

  override visitDeclareVarStmt(stmt: o.DeclareVarStmt, ctx: EmitterVisitorContext): any {
    if (stmt.hasModifier(o.StmtModifier.Exported)) {
      this._evalExportedVars.push(stmt.name);
    }
    return super.visitDeclareVarStmt(stmt, ctx);
  }

  override visitDeclareFunctionStmt(stmt: o.DeclareFunctionStmt, ctx: EmitterVisitorContext): any {
    if (stmt.hasModifier(o.StmtModifier.Exported)) {
      this._evalExportedVars.push(stmt.name);
    }
    return super.visitDeclareFunctionStmt(stmt, ctx);
  }

  private _emitReferenceToExternal(ast: o.Expression, value: any, ctx: EmitterVisitorContext):
      void {
    let id = this._evalArgValues.indexOf(value);
    if (id === -1) {
      id = this._evalArgValues.length;
      this._evalArgValues.push(value);
      const name = identifierName({reference: value}) || 'val';
      this._evalArgNames.push(`jit_${name}_${id}`);
    }
    ctx.print(ast, this._evalArgNames[id]);
  }
}


function isUseStrictStatement(statement: o.Statement): boolean {
  return statement.isEquivalent(o.literal('use strict').toStmt());
}

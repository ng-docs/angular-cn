/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {R3PartialDeclaration} from '@angular/compiler';

import {AbsoluteFsPath} from '../../../src/ngtsc/file_system';
import {AstObject} from '../ast/ast_value';

import {DeclarationScope} from './declaration_scope';
import {EmitScope} from './emit_scopes/emit_scope';
import {LocalEmitScope} from './emit_scopes/local_emit_scope';
import {LinkerEnvironment} from './linker_environment';
import {createLinkerMap, PartialLinkerSelector} from './partial_linkers/partial_linker_selector';

export const NO_STATEMENTS: Readonly<any[]> = [] as const;

/**
 * This class is responsible for linking all the partial declarations found in a single file.
 *
 * 此类负责链接在单个文件中找到的所有部分声明。
 *
 */
export class FileLinker<TConstantScope, TStatement, TExpression> {
  private linkerSelector: PartialLinkerSelector<TExpression>;
  private emitScopes = new Map<TConstantScope, EmitScope<TStatement, TExpression>>();

  constructor(
      private linkerEnvironment: LinkerEnvironment<TStatement, TExpression>,
      sourceUrl: AbsoluteFsPath, code: string) {
    this.linkerSelector = new PartialLinkerSelector<TExpression>(
        createLinkerMap(this.linkerEnvironment, sourceUrl, code), this.linkerEnvironment.logger,
        this.linkerEnvironment.options.unknownDeclarationVersionHandling);
  }

  /**
   * Return true if the given callee name matches a partial declaration that can be linked.
   *
   * 如果给定的被调用者名称与可以链接的部分声明匹配，则返回 true 。
   *
   */
  isPartialDeclaration(calleeName: string): boolean {
    return this.linkerSelector.supportsDeclaration(calleeName);
  }

  /**
   * Link the metadata extracted from the args of a call to a partial declaration function.
   *
   * 将从调用的 args 中提取的元数据链接到部分声明函数。
   *
   * The `declarationScope` is used to determine the scope and strategy of emission of the linked
   * definition and any shared constant statements.
   *
   * `declarationScope` 用于确定链接定义和任何共享常量语句的范围和发出策略。
   *
   * @param declarationFn the name of the function used to declare the partial declaration - e.g.
   *     `ɵɵngDeclareDirective`.
   *
   * 用于声明部分声明的函数名 - 例如 `ɵɵngDeclareDirective` 。
   *
   * @param args the arguments passed to the declaration function, should be a single object that
   *     corresponds to the `R3DeclareDirectiveMetadata` or `R3DeclareComponentMetadata` interfaces.
   *
   * 传递给声明函数的参数应该是对应于 `R3DeclareDirectiveMetadata` 或 `R3DeclareComponentMetadata`
   * 接口的单个对象。
   *
   * @param declarationScope the scope that contains this call to the declaration function.
   *
   * 包含对声明函数的此调用的范围。
   *
   */
  linkPartialDeclaration(
      declarationFn: string, args: TExpression[],
      declarationScope: DeclarationScope<TConstantScope, TExpression>): TExpression {
    if (args.length !== 1) {
      throw new Error(
          `Invalid function call: It should have only a single object literal argument, but contained ${
              args.length}.`);
    }

    const metaObj =
        AstObject.parse<R3PartialDeclaration, TExpression>(args[0], this.linkerEnvironment.host);
    const ngImport = metaObj.getNode('ngImport');
    const emitScope = this.getEmitScope(ngImport, declarationScope);

    const minVersion = metaObj.getString('minVersion');
    const version = metaObj.getString('version');
    const linker = this.linkerSelector.getLinker(declarationFn, minVersion, version);
    const definition = linker.linkPartialDeclaration(emitScope.constantPool, metaObj);

    return emitScope.translateDefinition(definition);
  }

  /**
   * Return all the shared constant statements and their associated constant scope references, so
   * that they can be inserted into the source code.
   *
   * 返回所有共享常量语句及其关联的常量范围引用，以便它们可以插入源代码。
   *
   */
  getConstantStatements(): {constantScope: TConstantScope, statements: TStatement[]}[] {
    const results: {constantScope: TConstantScope, statements: TStatement[]}[] = [];
    for (const [constantScope, emitScope] of this.emitScopes.entries()) {
      const statements = emitScope.getConstantStatements();
      results.push({constantScope, statements});
    }
    return results;
  }

  private getEmitScope(
      ngImport: TExpression, declarationScope: DeclarationScope<TConstantScope, TExpression>):
      EmitScope<TStatement, TExpression> {
    const constantScope = declarationScope.getConstantScopeRef(ngImport);
    if (constantScope === null) {
      // There is no constant scope so we will emit extra statements into the definition IIFE.
      return new LocalEmitScope(
          ngImport, this.linkerEnvironment.translator, this.linkerEnvironment.factory);
    }

    if (!this.emitScopes.has(constantScope)) {
      this.emitScopes.set(
          constantScope,
          new EmitScope(
              ngImport, this.linkerEnvironment.translator, this.linkerEnvironment.factory));
    }
    return this.emitScopes.get(constantScope)!;
  }
}

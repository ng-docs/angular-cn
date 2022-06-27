/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ExpressionType, ExternalExpr, Type, TypeModifier} from '@angular/compiler';
import ts from 'typescript';

import {assertSuccessfulReferenceEmit, ImportFlags, Reference, ReferenceEmitKind, ReferenceEmitter} from '../../imports';
import {ClassDeclaration, ReflectionHost} from '../../reflection';
import {ImportManager, translateExpression, translateType} from '../../translator';
import {TypeCheckableDirectiveMeta, TypeCheckingConfig, TypeCtorMetadata} from '../api';

import {ReferenceEmitEnvironment} from './tcb_util';
import {tsDeclareVariable} from './ts_util';
import {generateTypeCtorDeclarationFn, requiresInlineTypeCtor} from './type_constructor';
import {TypeParameterEmitter} from './type_parameter_emitter';

/**
 * A context which hosts one or more Type Check Blocks (TCBs).
 *
 * 托管一个或多个类型检查块 (TCB) 的上下文。
 *
 * An `Environment` supports the generation of TCBs by tracking necessary imports, declarations of
 * type constructors, and other statements beyond the type-checking code within the TCB itself.
 * Through method calls on `Environment`, the TCB generator can request `ts.Expression`s which
 * reference declarations in the `Environment` for these artifacts\`.
 *
 * `Environment` 通过跟踪必要的导入、类型构造函数的声明以及 TCB
 * 本身中类型检查代码之外的其他语句来支持 TCB 的生成。通过 `Environment` 上的方法调用，TCB
 * 生成器可以请求 `ts.Expression` s，哪个引用了 `Environment` 中这些工件的声明\`。
 *
 * `Environment` can be used in a standalone fashion, or can be extended to support more specialized
 * usage.
 *
 * `Environment` 可以独立使用，也可以扩展以支持更专业的用法。
 *
 */
export class Environment implements ReferenceEmitEnvironment {
  private nextIds = {
    pipeInst: 1,
    typeCtor: 1,
  };

  private typeCtors = new Map<ClassDeclaration, ts.Expression>();
  protected typeCtorStatements: ts.Statement[] = [];

  private pipeInsts = new Map<ClassDeclaration, ts.Expression>();
  protected pipeInstStatements: ts.Statement[] = [];

  constructor(
      readonly config: TypeCheckingConfig, protected importManager: ImportManager,
      private refEmitter: ReferenceEmitter, readonly reflector: ReflectionHost,
      protected contextFile: ts.SourceFile) {}

  /**
   * Get an expression referring to a type constructor for the given directive.
   *
   * 获取引用给定指令的类型构造函数的表达式。
   *
   * Depending on the shape of the directive itself, this could be either a reference to a declared
   * type constructor, or to an inline type constructor.
   *
   * 根据指令本身的形状，这可以是对声明的类型构造函数的引用，也可以是对内联类型构造函数的引用。
   *
   */
  typeCtorFor(dir: TypeCheckableDirectiveMeta): ts.Expression {
    const dirRef = dir.ref as Reference<ClassDeclaration<ts.ClassDeclaration>>;
    const node = dirRef.node;
    if (this.typeCtors.has(node)) {
      return this.typeCtors.get(node)!;
    }

    if (requiresInlineTypeCtor(node, this.reflector, this)) {
      // The constructor has already been created inline, we just need to construct a reference to
      // it.
      const ref = this.reference(dirRef);
      const typeCtorExpr = ts.factory.createPropertyAccessExpression(ref, 'ngTypeCtor');
      this.typeCtors.set(node, typeCtorExpr);
      return typeCtorExpr;
    } else {
      const fnName = `_ctor${this.nextIds.typeCtor++}`;
      const nodeTypeRef = this.referenceType(dirRef);
      if (!ts.isTypeReferenceNode(nodeTypeRef)) {
        throw new Error(`Expected TypeReferenceNode from reference to ${dirRef.debugName}`);
      }
      const meta: TypeCtorMetadata = {
        fnName,
        body: true,
        fields: {
          inputs: dir.inputs.classPropertyNames,
          outputs: dir.outputs.classPropertyNames,
          // TODO: support queries
          queries: dir.queries,
        },
        coercedInputFields: dir.coercedInputFields,
      };
      const typeParams = this.emitTypeParameters(node);
      const typeCtor = generateTypeCtorDeclarationFn(node, meta, nodeTypeRef.typeName, typeParams);
      this.typeCtorStatements.push(typeCtor);
      const fnId = ts.factory.createIdentifier(fnName);
      this.typeCtors.set(node, fnId);
      return fnId;
    }
  }

  /*
   * Get an expression referring to an instance of the given pipe.
   */
  pipeInst(ref: Reference<ClassDeclaration<ts.ClassDeclaration>>): ts.Expression {
    if (this.pipeInsts.has(ref.node)) {
      return this.pipeInsts.get(ref.node)!;
    }

    const pipeType = this.referenceType(ref);
    const pipeInstId = ts.factory.createIdentifier(`_pipe${this.nextIds.pipeInst++}`);

    this.pipeInstStatements.push(tsDeclareVariable(pipeInstId, pipeType));
    this.pipeInsts.set(ref.node, pipeInstId);

    return pipeInstId;
  }

  /**
   * Generate a `ts.Expression` that references the given node.
   *
   * 生成一个引用给定节点的 `ts.Expression` 。
   *
   * This may involve importing the node into the file if it's not declared there already.
   *
   * 如果尚未在文件中声明，这可能涉及将节点导入到文件中。
   *
   */
  reference(ref: Reference<ClassDeclaration<ts.ClassDeclaration>>): ts.Expression {
    // Disable aliasing for imports generated in a template type-checking context, as there is no
    // guarantee that any alias re-exports exist in the .d.ts files. It's safe to use direct imports
    // in these cases as there is no strict dependency checking during the template type-checking
    // pass.
    const ngExpr = this.refEmitter.emit(ref, this.contextFile, ImportFlags.NoAliasing);
    assertSuccessfulReferenceEmit(ngExpr, this.contextFile, 'class');

    // Use `translateExpression` to convert the `Expression` into a `ts.Expression`.
    return translateExpression(ngExpr.expression, this.importManager);
  }

  canReferenceType(ref: Reference): boolean {
    const result = this.refEmitter.emit(
        ref, this.contextFile,
        ImportFlags.NoAliasing | ImportFlags.AllowTypeImports |
            ImportFlags.AllowRelativeDtsImports);
    return result.kind === ReferenceEmitKind.Success;
  }

  /**
   * Generate a `ts.TypeNode` that references the given node as a type.
   *
   * 生成一个将给定节点作为类型引用的 `ts.TypeNode` 。
   *
   * This may involve importing the node into the file if it's not declared there already.
   *
   * 如果尚未在文件中声明，这可能涉及将节点导入到文件中。
   *
   */
  referenceType(ref: Reference): ts.TypeNode {
    const ngExpr = this.refEmitter.emit(
        ref, this.contextFile,
        ImportFlags.NoAliasing | ImportFlags.AllowTypeImports |
            ImportFlags.AllowRelativeDtsImports);
    assertSuccessfulReferenceEmit(ngExpr, this.contextFile, 'symbol');

    // Create an `ExpressionType` from the `Expression` and translate it via `translateType`.
    // TODO(alxhub): support references to types with generic arguments in a clean way.
    return translateType(new ExpressionType(ngExpr.expression), this.importManager);
  }

  private emitTypeParameters(declaration: ClassDeclaration<ts.ClassDeclaration>):
      ts.TypeParameterDeclaration[]|undefined {
    const emitter = new TypeParameterEmitter(declaration.typeParameters, this.reflector);
    return emitter.emit(ref => this.referenceType(ref));
  }

  /**
   * Generate a `ts.TypeNode` that references a given type from the provided module.
   *
   * 生成一个从提供的模块引用给定类型的 `ts.TypeNode` 。
   *
   * This will involve importing the type into the file, and will also add type parameters if
   * provided.
   *
   * 这将涉及将类型导入文件中，并且如果提供了类型参数，还将添加。
   *
   */
  referenceExternalType(moduleName: string, name: string, typeParams?: Type[]): ts.TypeNode {
    const external = new ExternalExpr({moduleName, name});
    return translateType(
        new ExpressionType(external, /* modifiers */ TypeModifier.None, typeParams),
        this.importManager);
  }

  getPreludeStatements(): ts.Statement[] {
    return [
      ...this.pipeInstStatements,
      ...this.typeCtorStatements,
    ];
  }
}

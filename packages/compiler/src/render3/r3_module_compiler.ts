/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {R3DeclareNgModuleFacade} from '../compiler_facade_interface';
import * as o from '../output/output_ast';

import {Identifiers as R3} from './r3_identifiers';
import {jitOnlyGuardedExpression, R3CompiledExpression, R3Reference, refsToArray} from './util';
import {DefinitionMap} from './view/util';

/**
 * How the selector scope of an NgModule (its declarations, imports, and exports) should be emitted
 * as a part of the NgModule definition.
 *
 * NgModule 的选择器范围（其声明、导入和导出）应如何作为 NgModule 定义的一部分发出。
 *
 */
export enum R3SelectorScopeMode {
  /**
   * Emit the declarations inline into the module definition.
   *
   * 将声明内联发送到模块定义中。
   *
   * This option is useful in certain contexts where it's known that JIT support is required. The
   * tradeoff here is that this emit style prevents directives and pipes from being tree-shaken if
   * they are unused, but the NgModule is used.
   *
   * 此选项在某些已知需要 JIT 支持的上下文中很有用。这里的权衡是，这种 emit
   * 风格可以防止指令和管道在未使用时被树形抖动，但使用了 NgModule。
   *
   */
  Inline,

  /**
   * Emit the declarations using a side effectful function call, `ɵɵsetNgModuleScope`, that is
   * guarded with the `ngJitMode` flag.
   *
   * 使用由 `ngJitMode` 标志保护的副作用函数调用 `ɵɵsetNgModuleScope` 发出声明。
   *
   * This form of emit supports JIT and can be optimized away if the `ngJitMode` flag is set to
   * false, which allows unused directives and pipes to be tree-shaken.
   *
   * 这种形式的 Emit 支持 JIT，如果将 `ngJitMode` 标志设置为 false
   * ，可以将其优化掉，这允许对未使用的指令和管道进行树形抖动。
   *
   */
  SideEffect,

  /**
   * Don't generate selector scopes at all.
   *
   * 根本不生成选择器范围。
   *
   * This is useful for contexts where JIT support is known to be unnecessary.
   *
   * 这对于已知不需要 JIT 支持的上下文很有用。
   *
   */
  Omit,
}

/**
 * Metadata required by the module compiler to generate a module def (`ɵmod`) for a type.
 *
 * 模块编译器为某种类型生成模块 def ( `ɵmod` ) 所需的元数据。
 *
 */
export interface R3NgModuleMetadata {
  /**
   * An expression representing the module type being compiled.
   *
   * 表示正在编译的模块类型的表达式。
   *
   */
  type: R3Reference;

  /**
   * An expression representing the module type being compiled, intended for use within a class
   * definition itself.
   *
   * 表示正在编译的模块类型的表达式，旨在在类定义本身中使用。
   *
   * This can differ from the outer `type` if the class is being compiled by ngcc and is inside
   * an IIFE structure that uses a different name internally.
   *
   * 如果类正在由 ngcc 编译并且在内部使用不同名称的 IIFE 结构中，这可能与外部 `type` 不同。
   *
   */
  internalType: o.Expression;

  /**
   * An expression intended for use by statements that are adjacent (i.e. tightly coupled) to but
   * not internal to a class definition.
   *
   * 旨在供与类定义相邻（即紧耦合）但不在类定义内部的语句使用的表达式。
   *
   * This can differ from the outer `type` if the class is being compiled by ngcc and is inside
   * an IIFE structure that uses a different name internally.
   *
   * 如果类正在由 ngcc 编译并且在内部使用不同名称的 IIFE 结构中，这可能与外部 `type` 不同。
   *
   */
  adjacentType: o.Expression;

  /**
   * An array of expressions representing the bootstrap components specified by the module.
   *
   * 表示模块指定的引导组件的表达式数组。
   *
   */
  bootstrap: R3Reference[];

  /**
   * An array of expressions representing the directives and pipes declared by the module.
   *
   * 表示模块声明的指令和管道的表达式数组。
   *
   */
  declarations: R3Reference[];

  /**
   * Those declarations which should be visible to downstream consumers. If not specified, all
   * declarations are made visible to downstream consumers.
   *
   * 下游消费者应该可见的那些声明。如果未指定，则所有声明都对下游消费者可见。
   *
   */
  publicDeclarationTypes: o.Expression[]|null;

  /**
   * An array of expressions representing the imports of the module.
   *
   * 表示模块导入的表达式数组。
   *
   */
  imports: R3Reference[];

  /**
   * Whether or not to include `imports` in generated type declarations.
   *
   * 是否在生成的类型声明中包含 `imports` 。
   *
   */
  includeImportTypes: boolean;

  /**
   * An array of expressions representing the exports of the module.
   *
   * 表示模块导出的表达式数组。
   *
   */
  exports: R3Reference[];

  /**
   * How to emit the selector scope values (declarations, imports, exports).
   *
   * 如何发出选择器范围值（声明、导入、导出）。
   *
   */
  selectorScopeMode: R3SelectorScopeMode;

  /**
   * Whether to generate closure wrappers for bootstrap, declarations, imports, and exports.
   *
   * 是否为引导、声明、导入和导出生成闭包包装器。
   *
   */
  containsForwardDecls: boolean;

  /**
   * The set of schemas that declare elements to be allowed in the NgModule.
   *
   * 声明 NgModule 中允许的元素的模式集。
   *
   */
  schemas: R3Reference[]|null;

  /**
   * Unique ID or expression representing the unique ID of an NgModule.
   *
   * 表示 NgModule 的唯一 ID 的唯一 ID 或表达式。
   *
   */
  id: o.Expression|null;
}

/**
 * The shape of the object literal that is passed to the `ɵɵdefineNgModule()` call.
 *
 * 传递给 `ɵɵdefineNgModule()` 调用的对象文字的形状。
 *
 */
interface R3NgModuleDefMap {
  /**
   * An expression representing the module type being compiled.
   *
   * 表示正在编译的模块类型的表达式。
   *
   */
  type: o.Expression;
  /**
   * An expression evaluating to an array of expressions representing the bootstrap components
   * specified by the module.
   *
   * 一个表达式，估算为表示模块指定的引导组件的表达式数组。
   *
   */
  bootstrap?: o.Expression;
  /**
   * An expression evaluating to an array of expressions representing the directives and pipes
   * declared by the module.
   *
   * 一个表达式，估算为表示模块声明的指令和管道的表达式数组。
   *
   */
  declarations?: o.Expression;
  /**
   * An expression evaluating to an array of expressions representing the imports of the module.
   *
   * 一个表达式，估算为表示模块导入的表达式数组。
   *
   */
  imports?: o.Expression;
  /**
   * An expression evaluating to an array of expressions representing the exports of the module.
   *
   * 一个表达式，估算为表示模块导出的表达式数组。
   *
   */
  exports?: o.Expression;
  /**
   * A literal array expression containing the schemas that declare elements to be allowed in the
   * NgModule.
   *
   * 一个文字数组表达式，包含声明 NgModule 中允许的元素的模式。
   *
   */
  schemas?: o.LiteralArrayExpr;
  /**
   * An expression evaluating to the unique ID of an NgModule.
   *
   * 估算为 NgModule 的唯一 ID 的表达式。
   *
   */
  id?: o.Expression;
}

/**
 * Construct an `R3NgModuleDef` for the given `R3NgModuleMetadata`.
 *
 * 为给定的 `R3NgModuleMetadata` `R3NgModuleDef`
 *
 */
export function compileNgModule(meta: R3NgModuleMetadata): R3CompiledExpression {
  const {
    adjacentType,
    internalType,
    bootstrap,
    declarations,
    imports,
    exports,
    schemas,
    containsForwardDecls,
    selectorScopeMode,
    id
  } = meta;

  const statements: o.Statement[] = [];
  const definitionMap = new DefinitionMap<R3NgModuleDefMap>();
  definitionMap.set('type', internalType);

  if (bootstrap.length > 0) {
    definitionMap.set('bootstrap', refsToArray(bootstrap, containsForwardDecls));
  }

  if (selectorScopeMode === R3SelectorScopeMode.Inline) {
    // If requested to emit scope information inline, pass the `declarations`, `imports` and
    // `exports` to the `ɵɵdefineNgModule()` call directly.

    if (declarations.length > 0) {
      definitionMap.set('declarations', refsToArray(declarations, containsForwardDecls));
    }

    if (imports.length > 0) {
      definitionMap.set('imports', refsToArray(imports, containsForwardDecls));
    }

    if (exports.length > 0) {
      definitionMap.set('exports', refsToArray(exports, containsForwardDecls));
    }
  } else if (selectorScopeMode === R3SelectorScopeMode.SideEffect) {
    // In this mode, scope information is not passed into `ɵɵdefineNgModule` as it
    // would prevent tree-shaking of the declarations, imports and exports references. Instead, it's
    // patched onto the NgModule definition with a `ɵɵsetNgModuleScope` call that's guarded by the
    // `ngJitMode` flag.
    const setNgModuleScopeCall = generateSetNgModuleScopeCall(meta);
    if (setNgModuleScopeCall !== null) {
      statements.push(setNgModuleScopeCall);
    }
  } else {
    // Selector scope emit was not requested, so skip it.
  }

  if (schemas !== null && schemas.length > 0) {
    definitionMap.set('schemas', o.literalArr(schemas.map(ref => ref.value)));
  }

  if (id !== null) {
    definitionMap.set('id', id);

    // Generate a side-effectful call to register this NgModule by its id, as per the semantics of
    // NgModule ids.
    statements.push(o.importExpr(R3.registerNgModuleType).callFn([adjacentType, id]).toStmt());
  }

  const expression =
      o.importExpr(R3.defineNgModule).callFn([definitionMap.toLiteralMap()], undefined, true);
  const type = createNgModuleType(meta);

  return {expression, type, statements};
}

/**
 * This function is used in JIT mode to generate the call to `ɵɵdefineNgModule()` from a call to
 * `ɵɵngDeclareNgModule()`.
 *
 * 此函数在 JIT 模式下使用，以通过对 ɵɵngDeclareNgModule() 的调用生成对 `ɵɵdefineNgModule()`
 * `ɵɵngDeclareNgModule()` 调用。
 *
 */
export function compileNgModuleDeclarationExpression(meta: R3DeclareNgModuleFacade): o.Expression {
  const definitionMap = new DefinitionMap<R3NgModuleDefMap>();
  definitionMap.set('type', new o.WrappedNodeExpr(meta.type));
  if (meta.bootstrap !== undefined) {
    definitionMap.set('bootstrap', new o.WrappedNodeExpr(meta.bootstrap));
  }
  if (meta.declarations !== undefined) {
    definitionMap.set('declarations', new o.WrappedNodeExpr(meta.declarations));
  }
  if (meta.imports !== undefined) {
    definitionMap.set('imports', new o.WrappedNodeExpr(meta.imports));
  }
  if (meta.exports !== undefined) {
    definitionMap.set('exports', new o.WrappedNodeExpr(meta.exports));
  }
  if (meta.schemas !== undefined) {
    definitionMap.set('schemas', new o.WrappedNodeExpr(meta.schemas));
  }
  if (meta.id !== undefined) {
    definitionMap.set('id', new o.WrappedNodeExpr(meta.id));
  }
  return o.importExpr(R3.defineNgModule).callFn([definitionMap.toLiteralMap()]);
}

export function createNgModuleType(
    {type: moduleType, declarations, exports, imports, includeImportTypes, publicDeclarationTypes}:
        R3NgModuleMetadata): o.ExpressionType {
  return new o.ExpressionType(o.importExpr(R3.NgModuleDeclaration, [
    new o.ExpressionType(moduleType.type),
    publicDeclarationTypes === null ? tupleTypeOf(declarations) :
                                      tupleOfTypes(publicDeclarationTypes),
    includeImportTypes ? tupleTypeOf(imports) : o.NONE_TYPE,
    tupleTypeOf(exports),
  ]));
}

/**
 * Generates a function call to `ɵɵsetNgModuleScope` with all necessary information so that the
 * transitive module scope can be computed during runtime in JIT mode. This call is marked pure
 * such that the references to declarations, imports and exports may be elided causing these
 * symbols to become tree-shakeable.
 *
 * 使用所有必要信息生成对 `ɵɵsetNgModuleScope` 的函数调用，以便可以在运行时以 JIT
 * 模式计算可传递模块范围。此调用被标记为 pure
 * ，以便可以忽略对声明、导入和导出的引用，导致这些符号变得可树摇。
 *
 */
function generateSetNgModuleScopeCall(meta: R3NgModuleMetadata): o.Statement|null {
  const {adjacentType: moduleType, declarations, imports, exports, containsForwardDecls} = meta;

  const scopeMap = new DefinitionMap<
      {declarations: o.Expression, imports: o.Expression, exports: o.Expression}>();

  if (declarations.length > 0) {
    scopeMap.set('declarations', refsToArray(declarations, containsForwardDecls));
  }

  if (imports.length > 0) {
    scopeMap.set('imports', refsToArray(imports, containsForwardDecls));
  }

  if (exports.length > 0) {
    scopeMap.set('exports', refsToArray(exports, containsForwardDecls));
  }

  if (Object.keys(scopeMap.values).length === 0) {
    return null;
  }

  // setNgModuleScope(...)
  const fnCall = new o.InvokeFunctionExpr(
      /* fn */ o.importExpr(R3.setNgModuleScope),
      /* args */[moduleType, scopeMap.toLiteralMap()]);

  // (ngJitMode guard) && setNgModuleScope(...)
  const guardedCall = jitOnlyGuardedExpression(fnCall);

  // function() { (ngJitMode guard) && setNgModuleScope(...); }
  const iife = new o.FunctionExpr(
      /* params */[],
      /* statements */[guardedCall.toStmt()]);

  // (function() { (ngJitMode guard) && setNgModuleScope(...); })()
  const iifeCall = new o.InvokeFunctionExpr(
      /* fn */ iife,
      /* args */[]);

  return iifeCall.toStmt();
}

function tupleTypeOf(exp: R3Reference[]): o.Type {
  const types = exp.map(ref => o.typeofExpr(ref.type));
  return exp.length > 0 ? o.expressionType(o.literalArr(types)) : o.NONE_TYPE;
}

function tupleOfTypes(types: o.Expression[]): o.Type {
  const typeofTypes = types.map(type => o.typeofExpr(type));
  return types.length > 0 ? o.expressionType(o.literalArr(typeofTypes)) : o.NONE_TYPE;
}

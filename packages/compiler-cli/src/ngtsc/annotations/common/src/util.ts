/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Expression, ExternalExpr, FactoryTarget, ParseLocation, ParseSourceFile, ParseSourceSpan, R3CompiledExpression, R3FactoryMetadata, R3Reference, ReadPropExpr, Statement, WrappedNodeExpr} from '@angular/compiler';
import ts from 'typescript';

import {assertSuccessfulReferenceEmit, ImportedFile, ImportFlags, ModuleResolver, Reference, ReferenceEmitter} from '../../../imports';
import {attachDefaultImportDeclaration} from '../../../imports/src/default';
import {DynamicValue, ForeignFunctionResolver, PartialEvaluator} from '../../../partial_evaluator';
import {ClassDeclaration, Decorator, Import, ImportedTypeValueReference, isNamedClassDeclaration, LocalTypeValueReference, ReflectionHost, TypeValueReference, TypeValueReferenceKind} from '../../../reflection';
import {CompileResult} from '../../../transform';

/**
 * Convert a `TypeValueReference` to an `Expression` which refers to the type as a value.
 *
 * 将 `TypeValueReference` 转换为将类型作为值引用的 `Expression` 。
 *
 * Local references are converted to a `WrappedNodeExpr` of the TypeScript expression, and non-local
 * references are converted to an `ExternalExpr`. Note that this is only valid in the context of the
 * file in which the `TypeValueReference` originated.
 *
 * 本地引用会转换为 TypeScript 表达式的 `WrappedNodeExpr` ，非本地引用会转换为 `ExternalExpr`
 * 。请注意，这仅在 `TypeValueReference` 源自的文件的上下文中有效。
 *
 */
export function valueReferenceToExpression(valueRef: LocalTypeValueReference|
                                           ImportedTypeValueReference): Expression;
export function valueReferenceToExpression(valueRef: TypeValueReference): Expression|null;
export function valueReferenceToExpression(valueRef: TypeValueReference): Expression|null {
  if (valueRef.kind === TypeValueReferenceKind.UNAVAILABLE) {
    return null;
  } else if (valueRef.kind === TypeValueReferenceKind.LOCAL) {
    const expr = new WrappedNodeExpr(valueRef.expression);
    if (valueRef.defaultImportStatement !== null) {
      attachDefaultImportDeclaration(expr, valueRef.defaultImportStatement);
    }
    return expr;
  } else {
    let importExpr: Expression =
        new ExternalExpr({moduleName: valueRef.moduleName, name: valueRef.importedName});
    if (valueRef.nestedPath !== null) {
      for (const property of valueRef.nestedPath) {
        importExpr = new ReadPropExpr(importExpr, property);
      }
    }
    return importExpr;
  }
}

export function toR3Reference(
    origin: ts.Node, valueRef: Reference, typeRef: Reference, valueContext: ts.SourceFile,
    typeContext: ts.SourceFile, refEmitter: ReferenceEmitter): R3Reference {
  const emittedValueRef = refEmitter.emit(valueRef, valueContext);
  assertSuccessfulReferenceEmit(emittedValueRef, origin, 'class');

  const emittedTypeRef = refEmitter.emit(
      typeRef, typeContext, ImportFlags.ForceNewImport | ImportFlags.AllowTypeImports);
  assertSuccessfulReferenceEmit(emittedTypeRef, origin, 'class');

  return {
    value: emittedValueRef.expression,
    type: emittedTypeRef.expression,
  };
}

export function isAngularCore(decorator: Decorator): decorator is Decorator&{import: Import} {
  return decorator.import !== null && decorator.import.from === '@angular/core';
}

export function isAngularCoreReference(reference: Reference, symbolName: string): boolean {
  return reference.ownedByModuleGuess === '@angular/core' && reference.debugName === symbolName;
}

export function findAngularDecorator(
    decorators: Decorator[], name: string, isCore: boolean): Decorator|undefined {
  return decorators.find(decorator => isAngularDecorator(decorator, name, isCore));
}

export function isAngularDecorator(decorator: Decorator, name: string, isCore: boolean): boolean {
  if (isCore) {
    return decorator.name === name;
  } else if (isAngularCore(decorator)) {
    return decorator.import.name === name;
  }
  return false;
}

/**
 * Unwrap a `ts.Expression`, removing outer type-casts or parentheses until the expression is in its
 * lowest level form.
 *
 * 展开 `ts.Expression` ，删除外部类型转换或括号，直到表达式处于最低级别形式。
 *
 * For example, the expression "(foo as Type)" unwraps to "foo".
 *
 * 例如，表达式“(foo as Type)”会展开为“foo”。
 *
 */
export function unwrapExpression(node: ts.Expression): ts.Expression {
  while (ts.isAsExpression(node) || ts.isParenthesizedExpression(node)) {
    node = node.expression;
  }
  return node;
}

function expandForwardRef(arg: ts.Expression): ts.Expression|null {
  arg = unwrapExpression(arg);
  if (!ts.isArrowFunction(arg) && !ts.isFunctionExpression(arg)) {
    return null;
  }

  const body = arg.body;
  // Either the body is a ts.Expression directly, or a block with a single return statement.
  if (ts.isBlock(body)) {
    // Block body - look for a single return statement.
    if (body.statements.length !== 1) {
      return null;
    }
    const stmt = body.statements[0];
    if (!ts.isReturnStatement(stmt) || stmt.expression === undefined) {
      return null;
    }
    return stmt.expression;
  } else {
    // Shorthand body - return as an expression.
    return body;
  }
}


/**
 * If the given `node` is a forwardRef() expression then resolve its inner value, otherwise return
 * `null`.
 *
 * 如果给定 `node` 是 forwardRef() 表达式，则解析其内部值，否则返回 `null` 。
 *
 * @param node the forwardRef() expression to resolve
 *
 * 要解析的 forwardRef() 表达式
 *
 * @param reflector a ReflectionHost
 *
 * 反射宿主
 *
 * @returns
 *
 * the resolved expression, if the original expression was a forwardRef(), or `null`
 *     otherwise.
 *
 * 解析的表达式（如果原始表达式是 forwardRef()），否则为 `null` 。
 *
 */
export function tryUnwrapForwardRef(node: ts.Expression, reflector: ReflectionHost): ts.Expression|
    null {
  node = unwrapExpression(node);
  if (!ts.isCallExpression(node) || node.arguments.length !== 1) {
    return null;
  }

  const fn =
      ts.isPropertyAccessExpression(node.expression) ? node.expression.name : node.expression;
  if (!ts.isIdentifier(fn)) {
    return null;
  }

  const expr = expandForwardRef(node.arguments[0]);
  if (expr === null) {
    return null;
  }

  const imp = reflector.getImportOfIdentifier(fn);
  if (imp === null || imp.from !== '@angular/core' || imp.name !== 'forwardRef') {
    return null;
  }

  return expr;
}

/**
 * A foreign function resolver for `staticallyResolve` which unwraps forwardRef() expressions.
 *
 * staticlyResolve 的外来函数解析器，它会解开 `staticallyResolve` () 表达式。
 *
 * @param ref a Reference to the declaration of the function being called (which might be
 * forwardRef)
 *
 * 对被调用函数声明的引用（可能是 forwardRef）
 *
 * @param args the arguments to the invocation of the forwardRef expression
 *
 * 调用 forwardRef 表达式的参数
 *
 * @returns
 *
 * an unwrapped argument if `ref` pointed to forwardRef, or null otherwise
 *
 * 如果 `ref` 指向 forwardRef ，则为未包装的参数，否则为 null
 *
 */
export const forwardRefResolver: ForeignFunctionResolver =
    (fn, callExpr, resolve, unresolvable) => {
      if (!isAngularCoreReference(fn, 'forwardRef') || callExpr.arguments.length !== 1) {
        return unresolvable;
      }
      const expanded = expandForwardRef(callExpr.arguments[0]);
      if (expanded !== null) {
        return resolve(expanded);
      } else {
        return unresolvable;
      }
    };

/**
 * Combines an array of resolver functions into a one.
 *
 * 将一组解析器函数组合为一个。
 *
 * @param resolvers Resolvers to be combined.
 *
 * 要组合的解析器。
 *
 */
export function combineResolvers(resolvers: ForeignFunctionResolver[]): ForeignFunctionResolver {
  return (fn, callExpr, resolve, unresolvable) => {
    for (const resolver of resolvers) {
      const resolved = resolver(fn, callExpr, resolve, unresolvable);
      if (resolved !== unresolvable) {
        return resolved;
      }
    }
    return unresolvable;
  };
}

export function isExpressionForwardReference(
    expr: Expression, context: ts.Node, contextSource: ts.SourceFile): boolean {
  if (isWrappedTsNodeExpr(expr)) {
    const node = ts.getOriginalNode(expr.node);
    return node.getSourceFile() === contextSource && context.pos < node.pos;
  } else {
    return false;
  }
}

export function isWrappedTsNodeExpr(expr: Expression): expr is WrappedNodeExpr<ts.Node> {
  return expr instanceof WrappedNodeExpr;
}

export function readBaseClass(
    node: ClassDeclaration, reflector: ReflectionHost,
    evaluator: PartialEvaluator): Reference<ClassDeclaration>|'dynamic'|null {
  const baseExpression = reflector.getBaseClassExpression(node);
  if (baseExpression !== null) {
    const baseClass = evaluator.evaluate(baseExpression);
    if (baseClass instanceof Reference && reflector.isClass(baseClass.node)) {
      return baseClass as Reference<ClassDeclaration>;
    } else {
      return 'dynamic';
    }
  }

  return null;
}

const parensWrapperTransformerFactory: ts.TransformerFactory<ts.Expression> =
    (context: ts.TransformationContext) => {
      const visitor: ts.Visitor = (node: ts.Node): ts.Node => {
        const visited = ts.visitEachChild(node, visitor, context);
        if (ts.isArrowFunction(visited) || ts.isFunctionExpression(visited)) {
          return ts.factory.createParenthesizedExpression(visited);
        }
        return visited;
      };
      return (node: ts.Expression) => ts.visitEachChild(node, visitor, context);
    };

/**
 * Wraps all functions in a given expression in parentheses. This is needed to avoid problems
 * where Tsickle annotations added between analyse and transform phases in Angular may trigger
 * automatic semicolon insertion, e.g. if a function is the expression in a `return` statement.
 * More
 * info can be found in Tsickle source code here:
 * <https://github.com/angular/tsickle/blob/d7974262571c8a17d684e5ba07680e1b1993afdd/src/jsdoc_transformer.ts#L1021>
 *
 * 将给定表达式中的所有函数包装在括号中。这是为了避免在 Angular 的分析和转换阶段之间添加的 Tsickle
 * 注解可能会触发自动插入分号的问题，例如，如果函数是 `return` 语句中的表达式。更多信息可以在这里的
 * Tsickle 源代码中找到：
 * <https://github.com/angular/tsickle/blob/d7974262571c8a17d684e5ba07680e1b1993afdd/src/jsdoc_transformer.ts#L1021>
 *
 * @param expression Expression where functions should be wrapped in parentheses
 *
 * 函数应该用括号括起来的表达式
 *
 */
export function wrapFunctionExpressionsInParens(expression: ts.Expression): ts.Expression {
  return ts.transform(expression, [parensWrapperTransformerFactory]).transformed[0];
}

/**
 * Resolves the given `rawProviders` into `ClassDeclarations` and returns
 * a set containing those that are known to require a factory definition.
 *
 * 将给定的 `rawProviders` 解析为 `ClassDeclarations`
 * 并返回一个集合，其中包含已知需要工厂定义的那些。
 *
 * @param rawProviders Expression that declared the providers array in the source.
 *
 * 在源中声明 provider 数组的表达式。
 *
 */
export function resolveProvidersRequiringFactory(
    rawProviders: ts.Expression, reflector: ReflectionHost,
    evaluator: PartialEvaluator): Set<Reference<ClassDeclaration>> {
  const providers = new Set<Reference<ClassDeclaration>>();
  const resolvedProviders = evaluator.evaluate(rawProviders);

  if (!Array.isArray(resolvedProviders)) {
    return providers;
  }

  resolvedProviders.forEach(function processProviders(provider) {
    let tokenClass: Reference|null = null;

    if (Array.isArray(provider)) {
      // If we ran into an array, recurse into it until we've resolve all the classes.
      provider.forEach(processProviders);
    } else if (provider instanceof Reference) {
      tokenClass = provider;
    } else if (provider instanceof Map && provider.has('useClass') && !provider.has('deps')) {
      const useExisting = provider.get('useClass')!;
      if (useExisting instanceof Reference) {
        tokenClass = useExisting;
      }
    }

    // TODO(alxhub): there was a bug where `getConstructorParameters` would return `null` for a
    // class in a .d.ts file, always, even if the class had a constructor. This was fixed for
    // `getConstructorParameters`, but that fix causes more classes to be recognized here as needing
    // provider checks, which is a breaking change in g3. Avoid this breakage for now by skipping
    // classes from .d.ts files here directly, until g3 can be cleaned up.
    if (tokenClass !== null && !tokenClass.node.getSourceFile().isDeclarationFile &&
        reflector.isClass(tokenClass.node)) {
      const constructorParameters = reflector.getConstructorParameters(tokenClass.node);

      // Note that we only want to capture providers with a non-trivial constructor,
      // because they're the ones that might be using DI and need to be decorated.
      if (constructorParameters !== null && constructorParameters.length > 0) {
        providers.add(tokenClass as Reference<ClassDeclaration>);
      }
    }
  });

  return providers;
}

/**
 * Create an R3Reference for a class.
 *
 * 为类创建 R3Reference。
 *
 * The `value` is the exported declaration of the class from its source file.
 * The `type` is an expression that would be used by ngcc in the typings (.d.ts) files.
 *
 * 该 `value` 是从源文件中导出的类的声明。该 `type` 是 ngcc 在 typings (.d.ts) 文件中使用的表达式。
 *
 */
export function wrapTypeReference(reflector: ReflectionHost, clazz: ClassDeclaration): R3Reference {
  const dtsClass = reflector.getDtsDeclaration(clazz);
  const value = new WrappedNodeExpr(clazz.name);
  const type = dtsClass !== null && isNamedClassDeclaration(dtsClass) ?
      new WrappedNodeExpr(dtsClass.name) :
      value;
  return {value, type};
}

/**
 * Creates a ParseSourceSpan for a TypeScript node.
 *
 * 为 TypeScript 节点创建 ParseSourceSpan 。
 *
 */
export function createSourceSpan(node: ts.Node): ParseSourceSpan {
  const sf = node.getSourceFile();
  const [startOffset, endOffset] = [node.getStart(), node.getEnd()];
  const {line: startLine, character: startCol} = sf.getLineAndCharacterOfPosition(startOffset);
  const {line: endLine, character: endCol} = sf.getLineAndCharacterOfPosition(endOffset);
  const parseSf = new ParseSourceFile(sf.getFullText(), sf.fileName);

  // +1 because values are zero-indexed.
  return new ParseSourceSpan(
      new ParseLocation(parseSf, startOffset, startLine + 1, startCol + 1),
      new ParseLocation(parseSf, endOffset, endLine + 1, endCol + 1));
}

/**
 * Collate the factory and definition compiled results into an array of CompileResult objects.
 *
 * 将工厂和定义的编译结果整理到 CompileResult 对象数组中。
 *
 */
export function compileResults(
    fac: CompileResult, def: R3CompiledExpression, metadataStmt: Statement|null,
    propName: string): CompileResult[] {
  const statements = def.statements;
  if (metadataStmt !== null) {
    statements.push(metadataStmt);
  }
  return [
    fac, {
      name: propName,
      initializer: def.expression,
      statements: def.statements,
      type: def.type,
    }
  ];
}

export function toFactoryMetadata(
    meta: Omit<R3FactoryMetadata, 'target'>, target: FactoryTarget): R3FactoryMetadata {
  return {
    name: meta.name,
    type: meta.type,
    internalType: meta.internalType,
    typeArgumentCount: meta.typeArgumentCount,
    deps: meta.deps,
    target
  };
}

export function resolveImportedFile(
    moduleResolver: ModuleResolver, importedFile: ImportedFile, expr: Expression,
    origin: ts.SourceFile): ts.SourceFile|null {
  // If `importedFile` is not 'unknown' then it accurately reflects the source file that is
  // being imported.
  if (importedFile !== 'unknown') {
    return importedFile;
  }

  // Otherwise `expr` has to be inspected to determine the file that is being imported. If `expr`
  // is not an `ExternalExpr` then it does not correspond with an import, so return null in that
  // case.
  if (!(expr instanceof ExternalExpr)) {
    return null;
  }

  // Figure out what file is being imported.
  return moduleResolver.resolveModule(expr.value.moduleName!, origin.fileName);
}


/**
 * Determines the most appropriate expression for diagnostic reporting purposes. If `expr` is
 * contained within `container` then `expr` is used as origin node, otherwise `container` itself is
 * used.
 *
 * 确定用于诊断报告的最合适的表达式。如果 `expr` 包含在 `container` ，则使用 `expr`
 * 作为源节点，否则使用 `container` 本身。
 *
 */
export function getOriginNodeForDiagnostics(
    expr: ts.Expression, container: ts.Expression): ts.Expression {
  const nodeSf = expr.getSourceFile();
  const exprSf = container.getSourceFile();

  if (nodeSf === exprSf && expr.pos >= container.pos && expr.end <= container.end) {
    // `expr` occurs within the same source file as `container` and is contained within it, so
    // `expr` is appropriate to use as origin node for diagnostics.
    return expr;
  } else {
    return container;
  }
}

export function isAbstractClassDeclaration(clazz: ClassDeclaration): boolean {
  return clazz.modifiers !== undefined &&
      clazz.modifiers.some(mod => mod.kind === ts.SyntaxKind.AbstractKeyword);
}

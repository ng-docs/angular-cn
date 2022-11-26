/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {ClassDeclaration, ReflectionHost} from '../../reflection';
import {TypeCtorMetadata} from '../api';

import {checkIfGenericTypeBoundsCanBeEmitted, ReferenceEmitEnvironment} from './tcb_util';
import {tsCreateTypeQueryForCoercedInput} from './ts_util';

export function generateTypeCtorDeclarationFn(
    node: ClassDeclaration<ts.ClassDeclaration>, meta: TypeCtorMetadata, nodeTypeRef: ts.EntityName,
    typeParams: ts.TypeParameterDeclaration[]|undefined): ts.Statement {
  const rawTypeArgs = typeParams !== undefined ? generateGenericArgs(typeParams) : undefined;
  const rawType = ts.factory.createTypeReferenceNode(nodeTypeRef, rawTypeArgs);

  const initParam = constructTypeCtorParameter(node, meta, rawType);

  const typeParameters = typeParametersWithDefaultTypes(typeParams);

  if (meta.body) {
    const fnType = ts.factory.createFunctionTypeNode(
        /* typeParameters */ typeParameters,
        /* parameters */[initParam],
        /* type */ rawType,
    );

    const decl = ts.factory.createVariableDeclaration(
        /* name */ meta.fnName,
        /* exclamationToken */ undefined,
        /* type */ fnType,
        /* body */ ts.factory.createNonNullExpression(ts.factory.createNull()));
    const declList = ts.factory.createVariableDeclarationList([decl], ts.NodeFlags.Const);
    return ts.factory.createVariableStatement(
        /* modifiers */ undefined,
        /* declarationList */ declList);
  } else {
    return ts.factory.createFunctionDeclaration(
        /* decorators */ undefined,
        /* modifiers */[ts.factory.createModifier(ts.SyntaxKind.DeclareKeyword)],
        /* asteriskToken */ undefined,
        /* name */ meta.fnName,
        /* typeParameters */ typeParameters,
        /* parameters */[initParam],
        /* type */ rawType,
        /* body */ undefined);
  }
}

/**
 * Generate an inline type constructor for the given class and metadata.
 *
 * 为给定的类和元数据生成内联类型构造函数。
 *
 * An inline type constructor is a specially shaped TypeScript static method, intended to be placed
 * within a directive class itself, that permits type inference of any generic type parameters of
 * the class from the types of expressions bound to inputs or outputs, and the types of elements
 * that match queries performed by the directive. It also catches any errors in the types of these
 * expressions. This method is never called at runtime, but is used in type-check blocks to
 * construct directive types.
 *
 * 内联类型构造函数是一种特殊形状的 TypeScript
 * 静态方法，旨在放在指令类本身中，它允许从绑定到输入或输出的表达式类型以及元素类型中对类的任何泛型类型参数进行类型推断与指令执行的查询匹配的。它还会捕获这些表达式类型中的任何错误。此方法永远不会在运行时调用，但用于在类型检查块中构造指令类型。
 *
 * An inline type constructor for NgFor looks like:
 *
 * NgFor 的内联类型构造函数类似于：
 *
 * static ngTypeCtor<T>(init: Pick&lt;NgForOf<T>, 'ngForOf'|'ngForTrackBy'|'ngForTemplate'>):
 *   NgForOf<T>;
 *
 * 静态 ngTypeCtor<T>（初始化： Pick&lt;NgForOf<T>, 'ngForOf'|'ngForTrackBy'|'ngForTemplate'>):
 * NgForOf<T>;
 *
 * A typical constructor would be:
 *
 * 典型的构造函数是：
 *
 * NgForOf.ngTypeCtor(init: {
 *   ngForOf: ['foo', 'bar'],
 *   ngForTrackBy: null as any,
 *   ngForTemplate: null as any,
 * }); // Infers a type of NgForOf<string>.
 *
 * NgForOf.ngTypeCtor(init: { ngForOf: ['foo', 'bar']['foo', 'bar'] , ngForTrackBy: null as any,
 * ngForTemplate: null as any, }); // 推断 NgForOf 的类型<string>.
 *
 * Any inputs declared on the type for which no property binding is present are assigned a value of
 * type `any`, to avoid producing any type errors for unset inputs.
 *
 * 在不存在属性绑定的类型上声明的任何输入都会被分配为 `any`
 * 类型的值，以避免为未设置的输入产生任何类型错误。
 *
 * Inline type constructors are used when the type being created has bounded generic types which
 * make writing a declared type constructor (via `generateTypeCtorDeclarationFn`) difficult or
 * impossible.
 *
 * 当正在创建的类型具有有界泛型类型，这使得编写声明的类型构造函数（通过
 * `generateTypeCtorDeclarationFn`）变得困难或不可能时，使用内联类型构造函数。
 *
 * @param node the `ClassDeclaration<ts.ClassDeclaration>` for which a type constructor will be
 * generated.
 *
 * 将为其生成类型构造函数的 `ClassDeclaration<ts.ClassDeclaration>` 。
 *
 * @param meta additional metadata required to generate the type constructor.
 *
 * 生成类型构造函数所需的额外元数据。
 *
 * @returns
 *
 * a `ts.MethodDeclaration` for the type constructor.
 *
 * 类型构造函数的 `ts.MethodDeclaration` 。
 *
 */
export function generateInlineTypeCtor(
    node: ClassDeclaration<ts.ClassDeclaration>, meta: TypeCtorMetadata): ts.MethodDeclaration {
  // Build rawType, a `ts.TypeNode` of the class with its generic parameters passed through from
  // the definition without any type bounds. For example, if the class is
  // `FooDirective<T extends Bar>`, its rawType would be `FooDirective<T>`.
  const rawTypeArgs =
      node.typeParameters !== undefined ? generateGenericArgs(node.typeParameters) : undefined;
  const rawType = ts.factory.createTypeReferenceNode(node.name, rawTypeArgs);

  const initParam = constructTypeCtorParameter(node, meta, rawType);

  // If this constructor is being generated into a .ts file, then it needs a fake body. The body
  // is set to a return of `null!`. If the type constructor is being generated into a .d.ts file,
  // it needs no body.
  let body: ts.Block|undefined = undefined;
  if (meta.body) {
    body = ts.factory.createBlock([
      ts.factory.createReturnStatement(ts.factory.createNonNullExpression(ts.factory.createNull())),
    ]);
  }

  // Create the type constructor method declaration.
  return ts.factory.createMethodDeclaration(
      /* decorators */ undefined,
      /* modifiers */[ts.factory.createModifier(ts.SyntaxKind.StaticKeyword)],
      /* asteriskToken */ undefined,
      /* name */ meta.fnName,
      /* questionToken */ undefined,
      /* typeParameters */ typeParametersWithDefaultTypes(node.typeParameters),
      /* parameters */[initParam],
      /* type */ rawType,
      /* body */ body,
  );
}

function constructTypeCtorParameter(
    node: ClassDeclaration<ts.ClassDeclaration>, meta: TypeCtorMetadata,
    rawType: ts.TypeReferenceNode): ts.ParameterDeclaration {
  // initType is the type of 'init', the single argument to the type constructor method.
  // If the Directive has any inputs, its initType will be:
  //
  // Pick<rawType, 'inputA'|'inputB'>
  //
  // Pick here is used to select only those fields from which the generic type parameters of the
  // directive will be inferred.
  //
  // In the special case there are no inputs, initType is set to {}.
  let initType: ts.TypeNode|null = null;

  const keys: string[] = meta.fields.inputs;
  const plainKeys: ts.LiteralTypeNode[] = [];
  const coercedKeys: ts.PropertySignature[] = [];
  for (const key of keys) {
    if (!meta.coercedInputFields.has(key)) {
      plainKeys.push(ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(key)));
    } else {
      coercedKeys.push(ts.factory.createPropertySignature(
          /* modifiers */ undefined,
          /* name */ key,
          /* questionToken */ undefined,
          /* type */ tsCreateTypeQueryForCoercedInput(rawType.typeName, key)));
    }
  }
  if (plainKeys.length > 0) {
    // Construct a union of all the field names.
    const keyTypeUnion = ts.factory.createUnionTypeNode(plainKeys);

    // Construct the Pick<rawType, keyTypeUnion>.
    initType = ts.factory.createTypeReferenceNode('Pick', [rawType, keyTypeUnion]);
  }
  if (coercedKeys.length > 0) {
    const coercedLiteral = ts.factory.createTypeLiteralNode(coercedKeys);

    initType = initType !== null ?
        ts.factory.createIntersectionTypeNode([initType, coercedLiteral]) :
        coercedLiteral;
  }

  if (initType === null) {
    // Special case - no inputs, outputs, or other fields which could influence the result type.
    initType = ts.factory.createTypeLiteralNode([]);
  }

  // Create the 'init' parameter itself.
  return ts.factory.createParameterDeclaration(
      /* decorators */ undefined,
      /* modifiers */ undefined,
      /* dotDotDotToken */ undefined,
      /* name */ 'init',
      /* questionToken */ undefined,
      /* type */ initType,
      /* initializer */ undefined);
}

function generateGenericArgs(params: ReadonlyArray<ts.TypeParameterDeclaration>): ts.TypeNode[] {
  return params.map(param => ts.factory.createTypeReferenceNode(param.name, undefined));
}

export function requiresInlineTypeCtor(
    node: ClassDeclaration<ts.ClassDeclaration>, host: ReflectionHost,
    env: ReferenceEmitEnvironment): boolean {
  // The class requires an inline type constructor if it has generic type bounds that can not be
  // emitted into the provided type-check environment.
  return !checkIfGenericTypeBoundsCanBeEmitted(node, host, env);
}

/**
 * Add a default `= any` to type parameters that don't have a default value already.
 *
 * 添加 default `= any` 以键入还没有默认值的参数。
 *
 * TypeScript uses the default type of a type parameter whenever inference of that parameter fails.
 * This can happen when inferring a complex type from 'any'. For example, if `NgFor`'s inference is
 * done with the TCB code:
 *
 * 每当类型参数的推断失败时，TypeScript 都会使用该类型参数的默认类型。从 “any”
 * 推断复杂类型时可能会发生这种情况。例如，如果 `NgFor` 的推理是使用 TCB 代码完成的：
 *
 * ```
 * class NgFor<T> {
 *   ngForOf: T[];
 * }
 *
 * declare function ctor<T>(o: Pick<NgFor<T>, 'ngForOf'|'ngForTrackBy'|'ngForTemplate'>): NgFor<T>;
 * ```
 *
 * An invocation looks like:
 *
 * 调用类似于：
 *
 * ```
 * var _t1 = ctor({ngForOf: [1, 2], ngForTrackBy: null as any, ngForTemplate: null as any});
 * ```
 *
 * This correctly infers the type `NgFor<number>` for `_t1`, since `T` is inferred from the
 * assignment of type `number[]` to `ngForOf`'s type `T[]`. However, if `any` is passed instead:
 *
 * 这正确地推断了 \_t1 的类型 `_t1` `NgFor<number>` ，因为 `T` 是从 `number[]` 类型的赋值给
 * `ngForOf` 的 `T[]` 类型的赋值中推断出来的。但是，如果而是通过了 `any` ：
 *
 * ```
 * var _t2 = ctor({ngForOf: [1, 2] as any, ngForTrackBy: null as any, ngForTemplate: null as any});
 * ```
 *
 * then inference for `T` fails (it cannot be inferred from `T[] = any`). In this case, `T` takes
 * the type `{}`, and so `_t2` is inferred as `NgFor<{}>`. This is obviously wrong.
 *
 * 然后对 `T` 的推断失败（不能从 `T[] = any` 推断）。在这种情况下，`T` 采用 `{}` 类型，因此 `_t2`
 * 被推断为 `NgFor<{}>` 。这显然是错误的。
 *
 * Adding a default type to the generic declaration in the constructor solves this problem, as the
 * default type will be used in the event that inference fails.
 *
 * 向构造函数中的泛型声明添加默认类型可以解决这个问题，因为默认类型将在推理失败的事件中使用。
 *
 * ```
 * declare function ctor<T = any>(o: Pick<NgFor<T>, 'ngForOf'>): NgFor<T>;
 *
 * var _t3 = ctor({ngForOf: [1, 2] as any});
 * ```
 *
 * This correctly infers `T` as `any`, and therefore `_t3` as `NgFor<any>`.
 *
 * 这正确地将 `T` 推断为 `any` ，因此 `_t3` 推断为 `NgFor<any>` 。
 *
 */
function typeParametersWithDefaultTypes(params: ReadonlyArray<ts.TypeParameterDeclaration>|
                                        undefined): ts.TypeParameterDeclaration[]|undefined {
  if (params === undefined) {
    return undefined;
  }

  return params.map(param => {
    if (param.default === undefined) {
      return ts.factory.updateTypeParameterDeclaration(
          param, param.modifiers, param.name, param.constraint,
          ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword));
    } else {
      return param;
    }
  });
}

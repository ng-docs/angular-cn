/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';

import {ClassDeclaration} from '../../../reflection';

import {isArrayEqual} from './util';

/**
 * Describes a generic type parameter of a semantic symbol. A class declaration with type parameters
 * needs special consideration in certain contexts. For example, template type-check blocks may
 * contain type constructors of used directives which include the type parameters of the directive.
 * As a consequence, if a change is made that affects the type parameters of said directive, any
 * template type-check blocks that use the directive need to be regenerated.
 *
 * 描述语义符号的泛型类型参数。在某些上下文中，带有类型参数的类声明需要特别考虑。例如，模板类型检查块可能包含
 * used
 * 指令的类型构造函数，其中包含指令的类型参数。因此，如果进行的更改影响了所述指令的类型参数，则任何使用该指令的模板类型检查块都需要重新生成。
 *
 * This type represents a single generic type parameter. It currently only tracks whether the
 * type parameter has a constraint, i.e. has an `extends` clause. When a constraint is present, we
 * currently assume that the type parameter is affected in each incremental rebuild; proving that
 * a type parameter with constraint is not affected is non-trivial as it requires full semantic
 * understanding of the type constraint.
 *
 * 此类型表示单个泛型类型参数。它当前仅跟踪类型参数是否有约束，即有 `extends`
 * 子句。当存在约束时，我们当前假定类型参数在每次增量重建中都会受到影响；证明带有约束的类型参数不受影响是很重要的，因为它需要对类型约束的完全语义理解。
 *
 */
export interface SemanticTypeParameter {
  /**
   * Whether a type constraint, i.e. an `extends` clause is present on the type parameter.
   *
   * 类型参数上是否存在类型约束，即 `extends` 子句。
   *
   */
  hasGenericTypeBound: boolean;
}

/**
 * Converts the type parameters of the given class into their semantic representation. If the class
 * does not have any type parameters, then `null` is returned.
 *
 * 将给定类的类型参数转换为它们的语义表示。如果类没有任何类型参数，则返回 `null` 。
 *
 */
export function extractSemanticTypeParameters(node: ClassDeclaration): SemanticTypeParameter[]|
    null {
  if (!ts.isClassDeclaration(node) || node.typeParameters === undefined) {
    return null;
  }

  return node.typeParameters.map(
      typeParam => ({hasGenericTypeBound: typeParam.constraint !== undefined}));
}

/**
 * Compares the list of type parameters to determine if they can be considered equal.
 *
 * 比较类型参数列表以确定它们是否可以被认为是相等的。
 *
 */
export function areTypeParametersEqual(
    current: SemanticTypeParameter[]|null, previous: SemanticTypeParameter[]|null): boolean {
  // First compare all type parameters one-to-one; any differences mean that the list of type
  // parameters has changed.
  if (!isArrayEqual(current, previous, isTypeParameterEqual)) {
    return false;
  }

  // If there is a current list of type parameters and if any of them has a generic type constraint,
  // then the meaning of that type parameter may have changed without us being aware; as such we
  // have to assume that the type parameters have in fact changed.
  if (current !== null && current.some(typeParam => typeParam.hasGenericTypeBound)) {
    return false;
  }

  return true;
}

function isTypeParameterEqual(a: SemanticTypeParameter, b: SemanticTypeParameter): boolean {
  return a.hasGenericTypeBound === b.hasGenericTypeBound;
}

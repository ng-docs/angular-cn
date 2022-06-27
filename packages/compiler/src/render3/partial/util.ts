/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as o from '../../output/output_ast';
import {R3DependencyMetadata} from '../r3_factory';
import {DefinitionMap} from '../view/util';

import {R3DeclareDependencyMetadata} from './api';

/**
 * Creates an array literal expression from the given array, mapping all values to an expression
 * using the provided mapping function. If the array is empty or null, then null is returned.
 *
 * 从给定数组创建一个数组文字表达式，使用提供的映射函数将所有值映射到一个表达式。如果数组为空或 null
 * ，则返回 null 。
 *
 * @param values The array to transfer into literal array expression.
 *
 * 要转换为文字数组表达式的数组。
 *
 * @param mapper The logic to use for creating an expression for the array's values.
 *
 * 用于为数组值创建表达式的逻辑。
 *
 * @returns
 *
 * An array literal expression representing `values`, or null if `values` is empty or
 * is itself null.
 *
 * 表示 `values` 的数组文字表达式，如果 `values` 为空或本身为 null ，则为 null 。
 *
 */
export function toOptionalLiteralArray<T>(
    values: T[]|null, mapper: (value: T) => o.Expression): o.LiteralArrayExpr|null {
  if (values === null || values.length === 0) {
    return null;
  }
  return o.literalArr(values.map(value => mapper(value)));
}

/**
 * Creates an object literal expression from the given object, mapping all values to an expression
 * using the provided mapping function. If the object has no keys, then null is returned.
 *
 * 从给定对象创建一个对象文字表达式，使用提供的映射函数将所有值映射到一个表达式。如果对象没有键，则返回
 * null 。
 *
 * @param object The object to transfer into an object literal expression.
 *
 * 要转换为对象文字表达式的对象。
 *
 * @param mapper The logic to use for creating an expression for the object's values.
 *
 * 用于为对象的值创建表达式的逻辑。
 *
 * @returns
 *
 * An object literal expression representing `object`, or null if `object` does not have
 * any keys.
 *
 * 表示 `object` 的对象文字表达式，如果 `object` 没有任何键，则为 null 。
 *
 */
export function toOptionalLiteralMap<T>(
    object: {[key: string]: T}, mapper: (value: T) => o.Expression): o.LiteralMapExpr|null {
  const entries = Object.keys(object).map(key => {
    const value = object[key];
    return {key, value: mapper(value), quoted: true};
  });

  if (entries.length > 0) {
    return o.literalMap(entries);
  } else {
    return null;
  }
}

export function compileDependencies(deps: R3DependencyMetadata[]|'invalid'|null): o.LiteralExpr|
    o.LiteralArrayExpr {
  if (deps === 'invalid') {
    // The `deps` can be set to the string "invalid"  by the `unwrapConstructorDependencies()`
    // function, which tries to convert `ConstructorDeps` into `R3DependencyMetadata[]`.
    return o.literal('invalid');
  } else if (deps === null) {
    return o.literal(null);
  } else {
    return o.literalArr(deps.map(compileDependency));
  }
}

export function compileDependency(dep: R3DependencyMetadata): o.LiteralMapExpr {
  const depMeta = new DefinitionMap<R3DeclareDependencyMetadata>();
  depMeta.set('token', dep.token);
  if (dep.attributeNameType !== null) {
    depMeta.set('attribute', o.literal(true));
  }
  if (dep.host) {
    depMeta.set('host', o.literal(true));
  }
  if (dep.optional) {
    depMeta.set('optional', o.literal(true));
  }
  if (dep.self) {
    depMeta.set('self', o.literal(true));
  }
  if (dep.skipSelf) {
    depMeta.set('skipSelf', o.literal(true));
  }
  return depMeta.toLiteralMap();
}

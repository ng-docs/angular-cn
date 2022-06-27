/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {Reference} from '../../imports';
import {Declaration} from '../../reflection';

import {DynamicValue} from './dynamic';
import {SyntheticValue} from './synthetic';


/**
 * A value resulting from static resolution.
 *
 * 由静态分辨率产生的值。
 *
 * This could be a primitive, collection type, reference to a `ts.Node` that declares a
 * non-primitive value, or a special `DynamicValue` type which indicates the value was not
 * available statically.
 *
 * 这可以是基元、集合类型、对声明非原始值的 `ts.Node` 的引用，或者是表明该值不是静态可用的特殊
 * `DynamicValue` 类型。
 *
 */
export type ResolvedValue =
    number|boolean|string|null|undefined|Reference|EnumValue|ResolvedValueArray|ResolvedValueMap|
    ResolvedModule|KnownFn|SyntheticValue<unknown>|DynamicValue<unknown>;

/**
 * An array of `ResolvedValue`s.
 *
 * `ResolvedValue` 的数组。
 *
 * This is a reified type to allow the circular reference of `ResolvedValue` -> `ResolvedValueArray`
 * \-> `ResolvedValue`.
 *
 * 这是一个具体化类型，允许循环引用 `ResolvedValue` -> `ResolvedValueArray` -> `ResolvedValue` 。
 *
 */
export interface ResolvedValueArray extends Array<ResolvedValue> {}

/**
 * A map of strings to `ResolvedValue`s.
 *
 * 字符串到 `ResolvedValue` 的映射。
 *
 * This is a reified type to allow the circular reference of `ResolvedValue` -> `ResolvedValueMap`
 * \-> `ResolvedValue`.
 *
 * 这是一个具体化类型，允许 `ResolvedValue` -> `ResolvedValueMap` -> `ResolvedValue` 的循环引用。
 *
 */
export interface ResolvedValueMap extends Map<string, ResolvedValue> {}

/**
 * A collection of publicly exported declarations from a module. Each declaration is evaluated
 * lazily upon request.
 *
 * 模块中公开导出的声明的集合。每个声明都会根据请求延迟估算。
 *
 */
export class ResolvedModule {
  constructor(
      private exports: Map<string, Declaration>,
      private evaluate: (decl: Declaration) => ResolvedValue) {}

  getExport(name: string): ResolvedValue {
    if (!this.exports.has(name)) {
      return undefined;
    }

    return this.evaluate(this.exports.get(name)!);
  }

  getExports(): ResolvedValueMap {
    const map = new Map<string, ResolvedValue>();
    this.exports.forEach((decl, name) => {
      map.set(name, this.evaluate(decl));
    });
    return map;
  }
}

/**
 * A value member of an enumeration.
 *
 * 枚举的值成员。
 *
 * Contains a `Reference` to the enumeration itself, and the name of the referenced member.
 *
 * 包含对枚举本身的 `Reference` 以及被引用成员的名称。
 *
 */
export class EnumValue {
  constructor(
      readonly enumRef: Reference<ts.Declaration>, readonly name: string,
      readonly resolved: ResolvedValue) {}
}

/**
 * An implementation of a known function that can be statically evaluated.
 * It could be a built-in function or method (such as `Array.prototype.slice`) or a TypeScript
 * helper (such as `__spread`).
 *
 * 可以静态估算的已知函数的实现。它可以是内置函数或方法（例如 `Array.prototype.slice` ）或
 * TypeScript 帮助器（例如 `__spread` ）。
 *
 */
export abstract class KnownFn {
  abstract evaluate(node: ts.CallExpression, args: ResolvedValueArray): ResolvedValue;
}

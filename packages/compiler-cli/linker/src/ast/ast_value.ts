/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as o from '@angular/compiler';

import {FatalLinkerError} from '../fatal_linker_error';

import {AstHost, Range} from './ast_host';

/**
 * Represents only those types in `T` that are object types.
 *
 * 仅表示 `T` 中作为对象类型的那些类型。
 *
 */
type ObjectType<T> = Extract<T, object>;

/**
 * Represents the value type of an object literal.
 *
 * 表示对象文字的值类型。
 *
 */
type ObjectValueType<T> = T extends Record<string, infer R>? R : never;

/**
 * Represents the value type of an array literal.
 *
 * 表示数组文字的值类型。
 *
 */
type ArrayValueType<T> = T extends Array<infer R>? R : never;

/**
 * Ensures that `This` has its generic type `Actual` conform to the expected generic type in
 * `Expected`, to disallow calling a method if the generic type does not conform.
 *
 * 确保 `This` 的泛型类型 `Actual` 符合 `Expected`
 * 中的预期泛型类型，以在泛型类型不符合的情况下禁止调用方法。
 *
 */
type ConformsTo<This, Actual, Expected> = Actual extends Expected ? This : never;

/**
 * Ensures that `This` is an `AstValue` whose generic type conforms to `Expected`, to disallow
 * calling a method if the value's type does not conform.
 *
 * 确保 `This` 是一个 `AstValue` ，其泛型类型符合 `Expected`
 * ，如果值的类型不符合，则不允许调用方法。
 *
 */
type HasValueType<This, Expected> =
    This extends AstValue<infer Actual, any>? ConformsTo<This, Actual, Expected>: never;

/**
 * Represents only the string keys of type `T`.
 *
 * 仅表示 `T` 类型的字符串键。
 *
 */
type PropertyKey<T> = keyof T&string;

/**
 * This helper class wraps an object expression along with an `AstHost` object, exposing helper
 * methods that make it easier to extract the properties of the object.
 *
 * 此帮助器类将对象表达式与 `AstHost` 对象包装在一起，公开了可以更轻松地提取对象属性的帮助器方法。
 *
 * The generic `T` is used as reference type of the expected structure that is represented by this
 * object. It does not achieve full type-safety for the provided operations in correspondence with
 * `T`; its main goal is to provide references to a documented type and ensure that the properties
 * that are read from the object are present.
 *
 * 泛型 `T` 用作此对象表示的预期结构的引用类型。它没有为与 `T`
 * 对应的提供的操作实现完全类型安全；其主要目标是提供对文档化类型的引用，并确保存在从对象读取的属性。
 *
 * Unfortunately, the generic types are unable to prevent reading an optional property from the
 * object without first having called `has` to ensure that the property exists. This is one example
 * of where full type-safety is not achieved.
 *
 * 不幸的是，泛型类型无法在不首先调用 `has`
 * 以确保属性存在的情况下防止从对象读取可选属性。这是未实现完全类型安全的一个例子。
 *
 */
export class AstObject<T extends object, TExpression> {
  /**
   * Create a new `AstObject` from the given `expression` and `host`.
   *
   * 从给定的 `expression` 和 `host` 创建一个新的 `AstObject` 。
   *
   */
  static parse<T extends object, TExpression>(expression: TExpression, host: AstHost<TExpression>):
      AstObject<T, TExpression> {
    const obj = host.parseObjectLiteral(expression);
    return new AstObject(expression, obj, host);
  }

  private constructor(
      readonly expression: TExpression, private obj: Map<string, TExpression>,
      private host: AstHost<TExpression>) {}

  /**
   * Returns true if the object has a property called `propertyName`.
   *
   * 如果对象有一个名为 `propertyName` 的属性，则返回 true 。
   *
   */
  has(propertyName: PropertyKey<T>): boolean {
    return this.obj.has(propertyName);
  }

  /**
   * Returns the number value of the property called `propertyName`.
   *
   * 返回名为 `propertyName` 的属性的数字值。
   *
   * Throws an error if there is no such property or the property is not a number.
   *
   * 如果不存在这样的属性或该属性不是数字，则会抛出错误。
   *
   */
  getNumber<K extends PropertyKey<T>>(this: ConformsTo<this, T[K], number>, propertyName: K):
      number {
    return this.host.parseNumericLiteral(this.getRequiredProperty(propertyName));
  }

  /**
   * Returns the string value of the property called `propertyName`.
   *
   * 返回名为 `propertyName` 的属性的字符串值。
   *
   * Throws an error if there is no such property or the property is not a string.
   *
   * 如果不存在这样的属性或者该属性不是字符串，则抛出错误。
   *
   */
  getString<K extends PropertyKey<T>>(this: ConformsTo<this, T[K], string>, propertyName: K):
      string {
    return this.host.parseStringLiteral(this.getRequiredProperty(propertyName));
  }

  /**
   * Returns the boolean value of the property called `propertyName`.
   *
   * 返回名为 `propertyName` 的属性的布尔值。
   *
   * Throws an error if there is no such property or the property is not a boolean.
   *
   * 如果不存在这样的属性或者该属性不是布尔值，则抛出错误。
   *
   */
  getBoolean<K extends PropertyKey<T>>(this: ConformsTo<this, T[K], boolean>, propertyName: K):
      boolean {
    return this.host.parseBooleanLiteral(this.getRequiredProperty(propertyName)) as any;
  }

  /**
   * Returns the nested `AstObject` parsed from the property called `propertyName`.
   *
   * 返回从名为 `propertyName` 的属性解析的嵌套 `AstObject` 。
   *
   * Throws an error if there is no such property or the property is not an object.
   *
   * 如果不存在这样的属性或该属性不是对象，则抛出错误。
   *
   */
  getObject<K extends PropertyKey<T>>(this: ConformsTo<this, T[K], object>, propertyName: K):
      AstObject<ObjectType<T[K]>, TExpression> {
    const expr = this.getRequiredProperty(propertyName);
    const obj = this.host.parseObjectLiteral(expr);
    return new AstObject(expr, obj, this.host);
  }

  /**
   * Returns an array of `AstValue` objects parsed from the property called `propertyName`.
   *
   * 返回从名为 `propertyName` 的属性解析的 `AstValue` 对象的数组。
   *
   * Throws an error if there is no such property or the property is not an array.
   *
   * 如果不存在这样的属性或该属性不是数组，则抛出错误。
   *
   */
  getArray<K extends PropertyKey<T>>(this: ConformsTo<this, T[K], unknown[]>, propertyName: K):
      AstValue<ArrayValueType<T[K]>, TExpression>[] {
    const arr = this.host.parseArrayLiteral(this.getRequiredProperty(propertyName));
    return arr.map(entry => new AstValue(entry, this.host));
  }

  /**
   * Returns a `WrappedNodeExpr` object that wraps the expression at the property called
   * `propertyName`.
   *
   * 返回一个 `WrappedNodeExpr` 对象，该对象在名为 `propertyName` 的属性处包装表达式。
   *
   * Throws an error if there is no such property.
   *
   * 如果没有这样的属性，则抛出错误。
   *
   */
  getOpaque(propertyName: PropertyKey<T>): o.WrappedNodeExpr<TExpression> {
    return new o.WrappedNodeExpr(this.getRequiredProperty(propertyName));
  }

  /**
   * Returns the raw `TExpression` value of the property called `propertyName`.
   *
   * 返回名为 `propertyName` 的属性的原始 `TExpression` 值。
   *
   * Throws an error if there is no such property.
   *
   * 如果没有这样的属性，则抛出错误。
   *
   */
  getNode(propertyName: PropertyKey<T>): TExpression {
    return this.getRequiredProperty(propertyName);
  }

  /**
   * Returns an `AstValue` that wraps the value of the property called `propertyName`.
   *
   * 返回一个 `AstValue` ，它包含名为 `propertyName` 的属性的值。
   *
   * Throws an error if there is no such property.
   *
   * 如果没有这样的属性，则抛出错误。
   *
   */
  getValue<K extends PropertyKey<T>>(propertyName: K): AstValue<T[K], TExpression> {
    return new AstValue(this.getRequiredProperty(propertyName), this.host);
  }

  /**
   * Converts the AstObject to a raw JavaScript object, mapping each property value (as an
   * `AstValue`) to the generic type (`T`) via the `mapper` function.
   *
   * 将 AstObject 转换为原始 JavaScript 对象，通过 `mapper` 函数将每个属性值（作为 `AstValue`
   *）映射到泛型类型 ( `T` )。
   *
   */
  toLiteral<V>(mapper: (value: AstValue<ObjectValueType<T>, TExpression>) => V): Record<string, V> {
    const result: Record<string, V> = {};
    for (const [key, expression] of this.obj) {
      result[key] = mapper(new AstValue(expression, this.host));
    }
    return result;
  }

  /**
   * Converts the AstObject to a JavaScript Map, mapping each property value (as an
   * `AstValue`) to the generic type (`T`) via the `mapper` function.
   *
   * 将 AstObject 转换为 JavaScript Map，通过 `mapper` 函数将每个属性值（作为 `AstValue`
   *）映射到泛型类型 ( `T` )。
   *
   */
  toMap<V>(mapper: (value: AstValue<ObjectValueType<T>, TExpression>) => V): Map<string, V> {
    const result = new Map<string, V>();
    for (const [key, expression] of this.obj) {
      result.set(key, mapper(new AstValue(expression, this.host)));
    }
    return result;
  }

  private getRequiredProperty(propertyName: PropertyKey<T>): TExpression {
    if (!this.obj.has(propertyName)) {
      throw new FatalLinkerError(
          this.expression, `Expected property '${propertyName}' to be present.`);
    }
    return this.obj.get(propertyName)!;
  }
}

/**
 * This helper class wraps an `expression`, exposing methods that use the `host` to give
 * access to the underlying value of the wrapped expression.
 *
 * 此帮助器类包装了一个 `expression` ，公开了使用 `host` 来提供对包装表达式的基础值的访问的方法。
 *
 * The generic `T` is used as reference type of the expected type that is represented by this value.
 * It does not achieve full type-safety for the provided operations in correspondence with `T`; its
 * main goal is to provide references to a documented type.
 *
 * 泛型 `T` 用作此值表示的预期类型的引用类型。它没有为与 `T`
 * 对应的提供的操作实现完全类型安全；其主要目标是提供对文档类型的引用。
 *
 */
export class AstValue<T, TExpression> {
  constructor(readonly expression: TExpression, private host: AstHost<TExpression>) {}

  /**
   * Get the name of the symbol represented by the given expression node, or `null` if it is not a
   * symbol.
   *
   * 获取给定表达式节点表示的符号的名称，如果不是符号，则为 `null` 。
   *
   */
  getSymbolName(): string|null {
    return this.host.getSymbolName(this.expression);
  }

  /**
   * Is this value a number?
   *
   * 这个值是数字吗？
   *
   */
  isNumber(): boolean {
    return this.host.isNumericLiteral(this.expression);
  }

  /**
   * Parse the number from this value, or error if it is not a number.
   *
   * 从此值解析数字，如果不是数字，则错误。
   *
   */
  getNumber(this: HasValueType<this, number>): number {
    return this.host.parseNumericLiteral(this.expression);
  }

  /**
   * Is this value a string?
   *
   * 这个值是字符串吗？
   *
   */
  isString(): boolean {
    return this.host.isStringLiteral(this.expression);
  }

  /**
   * Parse the string from this value, or error if it is not a string.
   *
   * 从此值解析字符串，如果不是字符串，则解析错误。
   *
   */
  getString(this: HasValueType<this, string>): string {
    return this.host.parseStringLiteral(this.expression);
  }

  /**
   * Is this value a boolean?
   *
   * 这个值是布尔值吗？
   *
   */
  isBoolean(): boolean {
    return this.host.isBooleanLiteral(this.expression);
  }

  /**
   * Parse the boolean from this value, or error if it is not a boolean.
   *
   * 从此值解析布尔值，如果不是布尔值，则解析错误。
   *
   */
  getBoolean(this: HasValueType<this, boolean>): boolean {
    return this.host.parseBooleanLiteral(this.expression);
  }

  /**
   * Is this value an object literal?
   *
   * 此值是对象文字吗？
   *
   */
  isObject(): boolean {
    return this.host.isObjectLiteral(this.expression);
  }

  /**
   * Parse this value into an `AstObject`, or error if it is not an object literal.
   *
   * 将此值解析为 `AstObject` ，如果它不是对象文字，则解析为错误。
   *
   */
  getObject(this: HasValueType<this, object>): AstObject<ObjectType<T>, TExpression> {
    return AstObject.parse(this.expression, this.host);
  }

  /**
   * Is this value an array literal?
   *
   * 此值是数组文字吗？
   *
   */
  isArray(): boolean {
    return this.host.isArrayLiteral(this.expression);
  }

  /**
   * Parse this value into an array of `AstValue` objects, or error if it is not an array literal.
   *
   * 将此值解析为 `AstValue` 对象数组，如果它不是数组文字，则解析为错误。
   *
   */
  getArray(this: HasValueType<this, unknown[]>): AstValue<ArrayValueType<T>, TExpression>[] {
    const arr = this.host.parseArrayLiteral(this.expression);
    return arr.map(entry => new AstValue(entry, this.host));
  }

  /**
   * Is this value a function expression?
   *
   * 此值是函数表达式吗？
   *
   */
  isFunction(): boolean {
    return this.host.isFunctionExpression(this.expression);
  }

  /**
   * Extract the return value as an `AstValue` from this value as a function expression, or error if
   * it is not a function expression.
   *
   * 从此值中将返回值作为 `AstValue` 提取为函数表达式，如果不是函数表达式，则将其提取为错误。
   *
   */
  getFunctionReturnValue<R>(this: HasValueType<this, Function>): AstValue<R, TExpression> {
    return new AstValue(this.host.parseReturnValue(this.expression), this.host);
  }

  isCallExpression(): boolean {
    return this.host.isCallExpression(this.expression);
  }

  getCallee(): AstValue<unknown, TExpression> {
    return new AstValue(this.host.parseCallee(this.expression), this.host);
  }

  getArguments(): AstValue<unknown, TExpression>[] {
    const args = this.host.parseArguments(this.expression);
    return args.map(arg => new AstValue(arg, this.host));
  }

  /**
   * Return the `TExpression` of this value wrapped in a `WrappedNodeExpr`.
   *
   * 返回包装在 `TExpression` 中的此值的 `WrappedNodeExpr` 。
   *
   */
  getOpaque(): o.WrappedNodeExpr<TExpression> {
    return new o.WrappedNodeExpr(this.expression);
  }

  /**
   * Get the range of the location of this value in the original source.
   *
   * 获取此值在原始源中的位置范围。
   *
   */
  getRange(): Range {
    return this.host.getRange(this.expression);
  }
}

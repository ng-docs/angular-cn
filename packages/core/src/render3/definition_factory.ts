/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Type} from '../interface/type';
import {stringify} from '../util/stringify';

import {NG_FACTORY_DEF} from './fields';


/**
 * Definition of what a factory function should look like.
 *
 * 工厂函数应该是什么样子的定义。
 *
 */
export type FactoryFn<T> = {
  /**
   * Subclasses without an explicit constructor call through to the factory of their base
   * definition, providing it with their own constructor to instantiate.
   *
   * 没有显式构造函数的子类会调用其基础定义的工厂，为它提供自己的构造函数来实例化。
   *
   */
  <U extends T>(t?: Type<U>): U;

  /**
   * If no constructor to instantiate is provided, an instance of type T itself is created.
   *
   * 如果没有提供要实例化的构造函数，则会创建 T 本身的实例。
   *
   */
  (t?: undefined): T;
};


export function getFactoryDef<T>(type: any, throwNotFound: true): FactoryFn<T>;
export function getFactoryDef<T>(type: any): FactoryFn<T>|null;
export function getFactoryDef<T>(type: any, throwNotFound?: boolean): FactoryFn<T>|null {
  const hasFactoryDef = type.hasOwnProperty(NG_FACTORY_DEF);
  if (!hasFactoryDef && throwNotFound === true && ngDevMode) {
    throw new Error(`Type ${stringify(type)} does not have 'ɵfac' property.`);
  }
  return hasFactoryDef ? type[NG_FACTORY_DEF] : null;
}

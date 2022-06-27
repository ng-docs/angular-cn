/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Type} from '../interface/type';

export interface PlatformReflectionCapabilities {
  factory(type: Type<any>): Function;
  hasLifecycleHook(type: any, lcProperty: string): boolean;

  /**
   * Return a list of annotations/types for constructor parameters
   *
   * 返回构造函数参数的注解/类型列表
   *
   */
  parameters(type: Type<any>): any[][];

  /**
   * Return a list of annotations declared on the class
   *
   * 返回类上声明的注解列表
   *
   */
  annotations(type: Type<any>): any[];

  /**
   * Return a object literal which describes the annotations on Class fields/properties.
   *
   * 返回一个描述 Class 字段/属性上的注解的对象文字。
   *
   */
  propMetadata(typeOrFunc: Type<any>): {[key: string]: any[]};
}

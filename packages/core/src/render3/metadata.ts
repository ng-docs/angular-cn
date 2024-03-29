/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Type} from '../interface/type';
import {noSideEffects} from '../util/closure';

interface TypeWithMetadata extends Type<any> {
  decorators?: any[];
  ctorParameters?: () => any[];
  propDecorators?: {[field: string]: any};
}

/**
 * Adds decorator, constructor, and property metadata to a given type via static metadata fields
 * on the type.
 *
 * 通过类型上的静态元数据字段将装饰器、构造函数和属性元数据添加到给定类型。
 *
 * These metadata fields can later be read with Angular's `ReflectionCapabilities` API.
 *
 * 这些元数据字段以后可以用 Angular 的 `ReflectionCapabilities` API 读取。
 *
 * Calls to `setClassMetadata` can be guarded by ngDevMode, resulting in the metadata assignments
 * being tree-shaken away during production builds.
 *
 * 对 `setClassMetadata` 的调用可以由 ngDevMode 保护，导致元数据分配在生产构建期间被树形抖动掉。
 *
 */
export function setClassMetadata(
    type: Type<any>, decorators: any[]|null, ctorParameters: (() => any[])|null,
    propDecorators: {[field: string]: any}|null): void {
  return noSideEffects(() => {
           const clazz = type as TypeWithMetadata;

           if (decorators !== null) {
             if (clazz.hasOwnProperty('decorators') && clazz.decorators !== undefined) {
               clazz.decorators.push(...decorators);
             } else {
               clazz.decorators = decorators;
             }
           }
           if (ctorParameters !== null) {
             // Rather than merging, clobber the existing parameters. If other projects exist which
             // use tsickle-style annotations and reflect over them in the same way, this could
             // cause issues, but that is vanishingly unlikely.
             clazz.ctorParameters = ctorParameters;
           }
           if (propDecorators !== null) {
             // The property decorator objects are merged as it is possible different fields have
             // different decorator types. Decorators on individual fields are not merged, as it's
             // also incredibly unlikely that a field will be decorated both with an Angular
             // decorator and a non-Angular decorator that's also been downleveled.
             if (clazz.hasOwnProperty('propDecorators') && clazz.propDecorators !== undefined) {
               clazz.propDecorators = {...clazz.propDecorators, ...propDecorators};
             } else {
               clazz.propDecorators = propDecorators;
             }
           }
         }) as never;
}

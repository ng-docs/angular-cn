/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Mutable} from '../../interface/type';
import {DirectiveDef, InputTransformFunction} from '../interfaces/definition';

/**
 * Decorates the directive definition with support for input transform functions.
 *
 * 使用对输入转换函数的支持来修饰指令定义。
 *
 * If the directive uses inheritance, the feature should be included before the
 * `InheritDefinitionFeature` to ensure that the `inputTransforms` field is populated.
 *
 * 如果指令使用继承，则应在 `InheritDefinitionFeature` 之前包含该功能，以确保填充 `inputTransforms` 字段。
 *
 * @codeGenApi
 */
export function ɵɵInputTransformsFeature(definition: DirectiveDef<unknown>): void {
  const inputs = definition.inputConfig;
  const inputTransforms: Record<string, InputTransformFunction> = {};

  for (const minifiedKey in inputs) {
    if (inputs.hasOwnProperty(minifiedKey)) {
      // Note: the private names are used for the keys, rather than the public ones, because public
      // names can be re-aliased in host directives which would invalidate the lookup.
      const value = inputs[minifiedKey];
      if (Array.isArray(value) && value[2]) {
        inputTransforms[minifiedKey] = value[2];
      }
    }
  }

  (definition as Mutable<DirectiveDef<unknown>, 'inputTransforms'>).inputTransforms =
      inputTransforms;
}

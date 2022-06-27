/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Reference} from '../../imports';
import {ClassDeclaration} from '../../reflection';

import {DirectiveMeta, MetadataReader} from './api';
import {ClassPropertyMapping, ClassPropertyName} from './property_mapping';

/**
 * Given a reference to a directive, return a flattened version of its `DirectiveMeta` metadata
 * which includes metadata from its entire inheritance chain.
 *
 * 给定对指令的引用，返回其 `DirectiveMeta` 元数据的展平版本，其中包括来自整个继承链的元数据。
 *
 * The returned `DirectiveMeta` will either have `baseClass: null` if the inheritance chain could be
 * fully resolved, or `baseClass: 'dynamic'` if the inheritance chain could not be completely
 * followed.
 *
 * 如果继承链可以被完全解析，则返回的 `DirectiveMeta` 将具有 `baseClass: null`
 * ，如果不能完全遵循继承链，则返回的 DirectiveMeta 将具有 baseClass `baseClass: 'dynamic'` 。
 *
 */
export function flattenInheritedDirectiveMetadata(
    reader: MetadataReader, dir: Reference<ClassDeclaration>): DirectiveMeta {
  const topMeta = reader.getDirectiveMetadata(dir);
  if (topMeta === null) {
    throw new Error(`Metadata not found for directive: ${dir.debugName}`);
  }
  if (topMeta.baseClass === null) {
    return topMeta;
  }

  const coercedInputFields = new Set<ClassPropertyName>();
  const undeclaredInputFields = new Set<ClassPropertyName>();
  const restrictedInputFields = new Set<ClassPropertyName>();
  const stringLiteralInputFields = new Set<ClassPropertyName>();
  let isDynamic = false;
  let inputs = ClassPropertyMapping.empty();
  let outputs = ClassPropertyMapping.empty();
  let isStructural: boolean = false;

  const addMetadata = (meta: DirectiveMeta): void => {
    if (meta.baseClass === 'dynamic') {
      isDynamic = true;
    } else if (meta.baseClass !== null) {
      const baseMeta = reader.getDirectiveMetadata(meta.baseClass);
      if (baseMeta !== null) {
        addMetadata(baseMeta);
      } else {
        // Missing metadata for the base class means it's effectively dynamic.
        isDynamic = true;
      }
    }

    isStructural = isStructural || meta.isStructural;

    inputs = ClassPropertyMapping.merge(inputs, meta.inputs);
    outputs = ClassPropertyMapping.merge(outputs, meta.outputs);

    for (const coercedInputField of meta.coercedInputFields) {
      coercedInputFields.add(coercedInputField);
    }
    for (const undeclaredInputField of meta.undeclaredInputFields) {
      undeclaredInputFields.add(undeclaredInputField);
    }
    for (const restrictedInputField of meta.restrictedInputFields) {
      restrictedInputFields.add(restrictedInputField);
    }
    for (const field of meta.stringLiteralInputFields) {
      stringLiteralInputFields.add(field);
    }
  };

  addMetadata(topMeta);

  return {
    ...topMeta,
    inputs,
    outputs,
    coercedInputFields,
    undeclaredInputFields,
    restrictedInputFields,
    stringLiteralInputFields,
    baseClass: isDynamic ? 'dynamic' : null,
    isStructural,
  };
}

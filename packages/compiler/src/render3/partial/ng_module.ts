/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as o from '../../output/output_ast';
import {Identifiers as R3} from '../r3_identifiers';
import {createNgModuleType, R3NgModuleMetadata} from '../r3_module_compiler';
import {R3CompiledExpression, refsToArray} from '../util';
import {DefinitionMap} from '../view/util';

import {R3DeclareNgModuleMetadata} from './api';

/**
 * Every time we make a breaking change to the declaration interface or partial-linker behavior, we
 * must update this constant to prevent old partial-linkers from incorrectly processing the
 * declaration.
 *
 * 每次我们对声明接口或部分链接器行为进行重大更改时，我们都必须更新此常量以防止旧的部分链接器错误地处理声明。
 *
 * Do not include any prerelease in these versions as they are ignored.
 *
 * 不要在这些版本中包含任何预发行版，因为它们被忽略。
 *
 */
const MINIMUM_PARTIAL_LINKER_VERSION = '14.0.0';

export function compileDeclareNgModuleFromMetadata(meta: R3NgModuleMetadata): R3CompiledExpression {
  const definitionMap = createNgModuleDefinitionMap(meta);

  const expression = o.importExpr(R3.declareNgModule).callFn([definitionMap.toLiteralMap()]);
  const type = createNgModuleType(meta);

  return {expression, type, statements: []};
}

/**
 * Gathers the declaration fields for an NgModule into a `DefinitionMap`.
 *
 * 将 NgModule 的声明字段收集到 `DefinitionMap` 中。
 *
 */
function createNgModuleDefinitionMap(meta: R3NgModuleMetadata):
    DefinitionMap<R3DeclareNgModuleMetadata> {
  const definitionMap = new DefinitionMap<R3DeclareNgModuleMetadata>();

  definitionMap.set('minVersion', o.literal(MINIMUM_PARTIAL_LINKER_VERSION));
  definitionMap.set('version', o.literal('0.0.0-PLACEHOLDER'));
  definitionMap.set('ngImport', o.importExpr(R3.core));
  definitionMap.set('type', meta.internalType);

  // We only generate the keys in the metadata if the arrays contain values.

  // We must wrap the arrays inside a function if any of the values are a forward reference to a
  // not-yet-declared class. This is to support JIT execution of the `ɵɵngDeclareNgModule()` call.
  // In the linker these wrappers are stripped and then reapplied for the `ɵɵdefineNgModule()` call.

  if (meta.bootstrap.length > 0) {
    definitionMap.set('bootstrap', refsToArray(meta.bootstrap, meta.containsForwardDecls));
  }

  if (meta.declarations.length > 0) {
    definitionMap.set('declarations', refsToArray(meta.declarations, meta.containsForwardDecls));
  }

  if (meta.imports.length > 0) {
    definitionMap.set('imports', refsToArray(meta.imports, meta.containsForwardDecls));
  }

  if (meta.exports.length > 0) {
    definitionMap.set('exports', refsToArray(meta.exports, meta.containsForwardDecls));
  }

  if (meta.schemas !== null && meta.schemas.length > 0) {
    definitionMap.set('schemas', o.literalArr(meta.schemas.map(ref => ref.value)));
  }

  if (meta.id !== null) {
    definitionMap.set('id', meta.id);
  }

  return definitionMap;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as o from '../../output/output_ast';
import {Identifiers as R3} from '../r3_identifiers';
import {createInjectorType, R3InjectorMetadata} from '../r3_injector_compiler';
import {R3CompiledExpression} from '../util';
import {DefinitionMap} from '../view/util';

import {R3DeclareInjectorMetadata} from './api';

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
const MINIMUM_PARTIAL_LINKER_VERSION = '12.0.0';

export function compileDeclareInjectorFromMetadata(meta: R3InjectorMetadata): R3CompiledExpression {
  const definitionMap = createInjectorDefinitionMap(meta);

  const expression = o.importExpr(R3.declareInjector).callFn([definitionMap.toLiteralMap()]);
  const type = createInjectorType(meta);

  return {expression, type, statements: []};
}

/**
 * Gathers the declaration fields for an Injector into a `DefinitionMap`.
 *
 * 将 Injector 的声明字段收集到 `DefinitionMap` 中。
 *
 */
function createInjectorDefinitionMap(meta: R3InjectorMetadata):
    DefinitionMap<R3DeclareInjectorMetadata> {
  const definitionMap = new DefinitionMap<R3DeclareInjectorMetadata>();

  definitionMap.set('minVersion', o.literal(MINIMUM_PARTIAL_LINKER_VERSION));
  definitionMap.set('version', o.literal('0.0.0-PLACEHOLDER'));
  definitionMap.set('ngImport', o.importExpr(R3.core));

  definitionMap.set('type', meta.internalType);
  definitionMap.set('providers', meta.providers);
  if (meta.imports.length > 0) {
    definitionMap.set('imports', o.literalArr(meta.imports));
  }

  return definitionMap;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {createInjectableType, R3InjectableMetadata} from '../../injectable_compiler_2';
import * as o from '../../output/output_ast';
import {Identifiers as R3} from '../r3_identifiers';
import {convertFromMaybeForwardRefExpression, R3CompiledExpression} from '../util';
import {DefinitionMap} from '../view/util';

import {R3DeclareInjectableMetadata} from './api';
import {compileDependency} from './util';

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

/**
 * Compile a Injectable declaration defined by the `R3InjectableMetadata`.
 *
 * 编译由 `R3InjectableMetadata` 定义的 Injectable 声明。
 *
 */
export function compileDeclareInjectableFromMetadata(meta: R3InjectableMetadata):
    R3CompiledExpression {
  const definitionMap = createInjectableDefinitionMap(meta);

  const expression = o.importExpr(R3.declareInjectable).callFn([definitionMap.toLiteralMap()]);
  const type = createInjectableType(meta);

  return {expression, type, statements: []};
}

/**
 * Gathers the declaration fields for a Injectable into a `DefinitionMap`.
 *
 * 将 Injectable 的声明字段收集到 `DefinitionMap` 中。
 *
 */
export function createInjectableDefinitionMap(meta: R3InjectableMetadata):
    DefinitionMap<R3DeclareInjectableMetadata> {
  const definitionMap = new DefinitionMap<R3DeclareInjectableMetadata>();

  definitionMap.set('minVersion', o.literal(MINIMUM_PARTIAL_LINKER_VERSION));
  definitionMap.set('version', o.literal('0.0.0-PLACEHOLDER'));
  definitionMap.set('ngImport', o.importExpr(R3.core));
  definitionMap.set('type', meta.internalType);

  // Only generate providedIn property if it has a non-null value
  if (meta.providedIn !== undefined) {
    const providedIn = convertFromMaybeForwardRefExpression(meta.providedIn);
    if ((providedIn as o.LiteralExpr).value !== null) {
      definitionMap.set('providedIn', providedIn);
    }
  }

  if (meta.useClass !== undefined) {
    definitionMap.set('useClass', convertFromMaybeForwardRefExpression(meta.useClass));
  }
  if (meta.useExisting !== undefined) {
    definitionMap.set('useExisting', convertFromMaybeForwardRefExpression(meta.useExisting));
  }
  if (meta.useValue !== undefined) {
    definitionMap.set('useValue', convertFromMaybeForwardRefExpression(meta.useValue));
  }
  // Factories do not contain `ForwardRef`s since any types are already wrapped in a function call
  // so the types will not be eagerly evaluated. Therefore we do not need to process this expression
  // with `convertFromProviderExpression()`.
  if (meta.useFactory !== undefined) {
    definitionMap.set('useFactory', meta.useFactory);
  }

  if (meta.deps !== undefined) {
    definitionMap.set('deps', o.literalArr(meta.deps.map(compileDependency)));
  }

  return definitionMap;
}

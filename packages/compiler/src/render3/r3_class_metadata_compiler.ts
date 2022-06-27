/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as o from '../output/output_ast';

import {Identifiers as R3} from './r3_identifiers';
import {devOnlyGuardedExpression} from './util';

export type CompileClassMetadataFn = (metadata: R3ClassMetadata) => o.Expression;

/**
 * Metadata of a class which captures the original Angular decorators of a class. The original
 * decorators are preserved in the generated code to allow TestBed APIs to recompile the class
 * using the original decorator with a set of overrides applied.
 *
 * 捕获类的原始 Angular 装饰器的类的元数据。原始装饰器保留在生成的代码中，以允许 TestBed API
 * 使用原始装饰器并应用一组覆盖来重新编译类。
 *
 */
export interface R3ClassMetadata {
  /**
   * The class type for which the metadata is captured.
   *
   * 要捕获其元数据的类类型。
   *
   */
  type: o.Expression;

  /**
   * An expression representing the Angular decorators that were applied on the class.
   *
   * 表示应用于类的 Angular 装饰器的表达式。
   *
   */
  decorators: o.Expression;

  /**
   * An expression representing the Angular decorators applied to constructor parameters, or `null`
   * if there is no constructor.
   *
   * 表示应用于构造函数参数的 Angular 装饰器的表达式，如果没有构造函数，则为 `null` 。
   *
   */
  ctorParameters: o.Expression|null;

  /**
   * An expression representing the Angular decorators that were applied on the properties of the
   * class, or `null` if no properties have decorators.
   *
   * 表示应用于类属性的 Angular 装饰器的表达式，如果没有属性具有装饰器，则为 `null` 。
   *
   */
  propDecorators: o.Expression|null;
}

export function compileClassMetadata(metadata: R3ClassMetadata): o.Expression {
  // Generate an ngDevMode guarded call to setClassMetadata with the class identifier and its
  // metadata.
  const fnCall = o.importExpr(R3.setClassMetadata).callFn([
    metadata.type,
    metadata.decorators,
    metadata.ctorParameters ?? o.literal(null),
    metadata.propDecorators ?? o.literal(null),
  ]);
  const iife = o.fn([], [devOnlyGuardedExpression(fnCall).toStmt()]);
  return iife.callFn([]);
}

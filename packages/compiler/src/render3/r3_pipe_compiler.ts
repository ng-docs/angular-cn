/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as o from '../output/output_ast';

import {R3DependencyMetadata} from './r3_factory';
import {Identifiers as R3} from './r3_identifiers';
import {R3CompiledExpression, R3Reference, typeWithParameters} from './util';

export interface R3PipeMetadata {
  /**
   * Name of the pipe type.
   *
   * 管道类型的名称。
   *
   */
  name: string;

  /**
   * An expression representing a reference to the pipe itself.
   *
   * 表示对管道本身的引用的表达式。
   *
   */
  type: R3Reference;

  /**
   * An expression representing the pipe being compiled, intended for use within a class definition
   * itself.
   *
   * 表示正在编译的管道的表达式，用于在类定义本身中使用。
   *
   * This can differ from the outer `type` if the class is being compiled by ngcc and is inside an
   * IIFE structure that uses a different name internally.
   *
   * 如果类正在由 ngcc 编译并且在内部使用不同名称的 IIFE 结构中，这可能与外部 `type` 不同。
   *
   */
  internalType: o.Expression;

  /**
   * Number of generic type parameters of the type itself.
   *
   * 类型本身的泛型类型参数的数量。
   *
   */
  typeArgumentCount: number;

  /**
   * Name of the pipe.
   *
   * 管道的名称。
   *
   */
  pipeName: string;

  /**
   * Dependencies of the pipe's constructor.
   *
   * 管道构造函数的依赖项。
   *
   */
  deps: R3DependencyMetadata[]|null;

  /**
   * Whether the pipe is marked as pure.
   *
   * 管道是否标记为纯。
   *
   */
  pure: boolean;

  /**
   * Whether the pipe is standalone.
   *
   * 管道是否是独立的。
   *
   */
  isStandalone: boolean;
}

export function compilePipeFromMetadata(metadata: R3PipeMetadata): R3CompiledExpression {
  const definitionMapValues: {key: string, quoted: boolean, value: o.Expression}[] = [];

  // e.g. `name: 'myPipe'`
  definitionMapValues.push({key: 'name', value: o.literal(metadata.pipeName), quoted: false});

  // e.g. `type: MyPipe`
  definitionMapValues.push({key: 'type', value: metadata.type.value, quoted: false});

  // e.g. `pure: true`
  definitionMapValues.push({key: 'pure', value: o.literal(metadata.pure), quoted: false});

  if (metadata.isStandalone) {
    definitionMapValues.push({key: 'standalone', value: o.literal(true), quoted: false});
  }

  const expression =
      o.importExpr(R3.definePipe).callFn([o.literalMap(definitionMapValues)], undefined, true);
  const type = createPipeType(metadata);

  return {expression, type, statements: []};
}

export function createPipeType(metadata: R3PipeMetadata): o.Type {
  return new o.ExpressionType(o.importExpr(R3.PipeDeclaration, [
    typeWithParameters(metadata.type.type, metadata.typeArgumentCount),
    new o.ExpressionType(new o.LiteralExpr(metadata.pipeName)),
    new o.ExpressionType(new o.LiteralExpr(metadata.isStandalone)),
  ]));
}

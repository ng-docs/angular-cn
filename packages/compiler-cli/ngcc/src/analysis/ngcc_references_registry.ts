/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {ReferencesRegistry} from '../../../src/ngtsc/annotations';
import {Reference} from '../../../src/ngtsc/imports';
import {Declaration, DeclarationNode, ReflectionHost} from '../../../src/ngtsc/reflection';
import {hasNameIdentifier} from '../utils';

/**
 * This is a place for DecoratorHandlers to register references that they
 * find in their analysis of the code.
 *
 * 这是 DecoratorHandlers 注册他们在分析代码中找到的引用的地方。
 *
 * This registry is used to ensure that these references are publicly exported
 * from libraries that are compiled by ngcc.
 *
 * 此注册表用于确保这些引用是从 ngcc 编译的库公开导出的。
 *
 */
export class NgccReferencesRegistry implements ReferencesRegistry {
  private map = new Map<ts.Identifier, Declaration>();

  constructor(private host: ReflectionHost) {}

  /**
   * Register one or more references in the registry.
   * Only `ResolveReference` references are stored. Other types are ignored.
   *
   * 在注册表中注册一个或多个引用。仅存储 `ResolveReference` 引用。其他类型被忽略。
   *
   * @param references A collection of references to register.
   *
   * 要注册的引用的集合。
   *
   */
  add(source: DeclarationNode, ...references: Reference<DeclarationNode>[]): void {
    references.forEach(ref => {
      // Only store relative references. We are not interested in literals.
      if (ref.bestGuessOwningModule === null && hasNameIdentifier(ref.node)) {
        const declaration = this.host.getDeclarationOfIdentifier(ref.node.name);
        if (declaration && hasNameIdentifier(declaration.node)) {
          this.map.set(declaration.node.name, declaration);
        }
      }
    });
  }

  /**
   * Create and return a mapping for the registered resolved references.
   *
   * 为注册的解析引用创建并返回映射。
   *
   * @returns
   *
   * A map of reference identifiers to reference declarations.
   *
   * 引用标识符到引用声明的映射。
   *
   */
  getDeclarationMap(): Map<ts.Identifier, Declaration> {
    return this.map;
  }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Reference} from '../../../imports';
import {DeclarationNode} from '../../../reflection';

/**
 * Implement this interface if you want DecoratorHandlers to register
 * references that they find in their analysis of the code.
 *
 * 如果你希望 DecoratorHandlers 注册它们在代码分析中找到的引用，请实现此接口。
 *
 */
export interface ReferencesRegistry {
  /**
   * Register one or more references in the registry.
   *
   * 在注册表中注册一个或多个引用。
   *
   * @param references A collection of references to register.
   *
   * 要注册的引用的集合。
   *
   */
  add(source: DeclarationNode, ...references: Reference<DeclarationNode>[]): void;
}

/**
 * This registry does nothing, since ngtsc does not currently need
 * this functionality.
 * The ngcc tool implements a working version for its purposes.
 *
 * 此注册表什么都不做，因为 ngtsc 当前不需要此特性。 ngcc 工具为其目的实现了一个工作版本。
 *
 */
export class NoopReferencesRegistry implements ReferencesRegistry {
  add(source: DeclarationNode, ...references: Reference<DeclarationNode>[]): void {}
}

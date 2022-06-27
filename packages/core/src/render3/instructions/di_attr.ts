/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {injectAttributeImpl} from '../di';
import {getCurrentTNode} from '../state';

/**
 * Facade for the attribute injection from DI.
 *
 * 来自 DI 的属性注入的门面。
 *
 * @codeGenApi
 */
export function ɵɵinjectAttribute(attrNameToInject: string): string|null {
  return injectAttributeImpl(getCurrentTNode()!, attrNameToInject);
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {Cycle} from '../../../cycles';
import {makeRelatedInformation} from '../../../diagnostics';
import {Reference} from '../../../imports';


/**
 * Generate a diagnostic related information object that describes a potential cyclic import path.
 *
 * 生成一个描述可能的循环导入路径的诊断相关信息对象。
 *
 */
export function makeCyclicImportInfo(
    ref: Reference, type: string, cycle: Cycle): ts.DiagnosticRelatedInformation {
  const name = ref.debugName || '(unknown)';
  const path = cycle.getPath().map(sf => sf.fileName).join(' -> ');
  const message =
      `The ${type} '${name}' is used in the template but importing it would create a cycle: `;
  return makeRelatedInformation(ref.node, message + path);
}


/**
 * Checks whether a selector is a valid custom element tag name.
 * Based loosely on <https://github.com/sindresorhus/validate-element-name>.
 *
 * 检查选择器是否是有效的自定义元素标签名称。松散地基于<https://github.com/sindresorhus/validate-element-name>
 * 。
 *
 */
export function checkCustomElementSelectorForErrors(selector: string): string|null {
  // Avoid flagging components with an attribute or class selector. This isn't bulletproof since it
  // won't catch cases like `foo[]bar`, but we don't need it to be. This is mainly to avoid flagging
  // something like `foo-bar[baz]` incorrectly.
  if (selector.includes('.') || (selector.includes('[') && selector.includes(']'))) {
    return null;
  }

  if (!(/^[a-z]/.test(selector))) {
    return 'Selector of a ShadowDom-encapsulated component must start with a lower case letter.';
  }

  if (/[A-Z]/.test(selector)) {
    return 'Selector of a ShadowDom-encapsulated component must all be in lower case.';
  }

  if (!selector.includes('-')) {
    return 'Selector of a component that uses ViewEncapsulation.ShadowDom must contain a hyphen.';
  }

  return null;
}

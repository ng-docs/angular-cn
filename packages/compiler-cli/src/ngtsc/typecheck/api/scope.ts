/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as ts from 'typescript';

/**
 * Metadata on a directive which is available in the scope of a template.
 */
export interface DirectiveInScope {
  /**
   * The `ts.Symbol` for the directive class.
   */
  tsSymbol: ts.Symbol;

  /**
   * The selector for the directive or component.
   */
  selector: string;

  /**
   * `true` if this directive is a component.
   */
  isComponent: boolean;
}

/**
 * Metadata for a pipe which is available in the scope of a template.
 */
export interface PipeInScope {
  /**
   * The `ts.Symbol` for the pipe class.
   */
  tsSymbol: ts.Symbol;

  /**
   * Name of the pipe.
   */
  name: string;
}

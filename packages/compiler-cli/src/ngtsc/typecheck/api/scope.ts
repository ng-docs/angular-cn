/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {ClassDeclaration} from '../../reflection';
import {SymbolWithValueDeclaration} from '../../util/src/typescript';

/**
 * Metadata on a directive which is available in the scope of a template.
 *
 * 模板范围内可用的指令上的元数据。
 *
 */
export interface DirectiveInScope {
  /**
   * The `ts.Symbol` for the directive class.
   *
   * 指令类的 `ts.Symbol` 。
   *
   */
  tsSymbol: SymbolWithValueDeclaration;

  /**
   * The module which declares the directive.
   *
   * 声明该指令的模块。
   *
   */
  ngModule: ClassDeclaration|null;

  /**
   * The selector for the directive or component.
   *
   * 指令或组件的选择器。
   *
   */
  selector: string;

  /**
   * `true` if this directive is a component.
   *
   * 如果此指令是组件，则为 `true` 。
   *
   */
  isComponent: boolean;

  /**
   * `true` if this directive is a structural directive.
   *
   * 如果此指令是结构指令，则为 `true` 。
   *
   */
  isStructural: boolean;
}

/**
 * Metadata for a pipe which is available in the scope of a template.
 *
 * 在模板范围内可用的管道元数据。
 *
 */
export interface PipeInScope {
  /**
   * The `ts.Symbol` for the pipe class.
   *
   * 管道类的 `ts.Symbol` 。
   *
   */
  tsSymbol: ts.Symbol;

  /**
   * Name of the pipe.
   *
   * 管道的名称。
   *
   */
  name: string;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import ts from 'typescript';

import {EmittedReference, Reference} from '../../imports';
import {ClassDeclaration} from '../../reflection';
import {SymbolWithValueDeclaration} from '../../util/src/typescript';

/**
 * A PotentialImport for some Angular trait has a TypeScript module specifier, which can be
 * relative, as well as an identifier name.
 */
export interface PotentialImport {
  kind: PotentialImportKind;
  moduleSpecifier: string;
  symbolName: string;
}

/**
 * Which kind of Angular Trait the import targets.
 *
 * 模板范围内可用的指令上的元数据。
 *
 */
export enum PotentialImportKind {
  NgModule,
  Standalone,
}

/**
 * Metadata on a directive which is available in a template.
 */
export interface PotentialDirective {
  ref: Reference<ClassDeclaration>;

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
  selector: string|null;

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

  /**
   * Whether or not this directive is in scope.
   */
  isInScope: boolean;
}

/**
 * Metadata for a pipe which is available in a template.
 *
 * 在模板范围内可用的管道元数据。
 *
 */
export interface PotentialPipe {
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

  /**
   * Whether or not this pipe is in scope.
   */
  isInScope: boolean;
}

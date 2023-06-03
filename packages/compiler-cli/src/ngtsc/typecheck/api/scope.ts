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
 *
 * 某些 Angular 特征的 PotentialImport 有一个 TypeScript 模块说明符，它可以是相对的，以及一个标识符名称。
 *
 */
export interface PotentialImport {
  kind: PotentialImportKind;
  // If no moduleSpecifier is present, the given symbol name is already in scope.
  moduleSpecifier?: string;
  symbolName: string;
  isForwardReference: boolean;
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
 *
 * 模板中可用的指令元数据。
 *
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
   *
   * 该指令是否在范围内。
   *
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
  ref: Reference<ClassDeclaration>;

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
   *
   * 此管道是否在范围内。
   *
   */
  isInScope: boolean;
}

/**
 * Possible modes in which to look up a potential import.
 *
 * 查找潜在导入的可能模式。
 *
 */
export enum PotentialImportMode {
  /**
   * Whether an import is standalone is inferred based on its metadata.
   *
   * 导入是否独立是根据其元数据推断的。
   *
   */
  Normal,

  /**
   * An import is assumed to be standalone and is imported directly. This is useful for migrations
   * where a declaration wasn't standalone when the program was created, but will become standalone
   * as a part of the migration.
   *
   * 假定导入是独立的并直接导入。 这对于在创建程序时声明不是独立的但将作为迁移的一部分变得独立的迁移很有用。
   *
   */
  ForceDirect,
}

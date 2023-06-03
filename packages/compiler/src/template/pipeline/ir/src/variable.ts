/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import type {SemanticVariableKind} from './enums';
import type {XrefId} from './operations';

/**
 * Union type for the different kinds of variables.
 *
 * 不同类型变量的联合类型。
 *
 */
export type SemanticVariable = ContextVariable|IdentifierVariable|SavedViewVariable;

export interface SemanticVariableBase {
  kind: SemanticVariableKind;

  /**
   * Name assigned to this variable in generated code, or `null` if not yet assigned.
   *
   * 在生成的代码中分配给此变量的名称，如果尚未分配则为 `null` 。
   *
   */
  name: string|null;
}

/**
 * A variable that represents the context of a particular view.
 *
 * 表示特定视图上下文的变量。
 *
 */
export interface ContextVariable extends SemanticVariableBase {
  kind: SemanticVariableKind.Context;

  /**
   * `XrefId` of the view that this variable represents.
   *
   * 此变量表示的视图的 `XrefId` 。
   *
   */
  view: XrefId;
}

/**
 * A variable that represents a specific identifier within a template.
 *
 * 表示模板中特定标识符的变量。
 *
 */
export interface IdentifierVariable extends SemanticVariableBase {
  kind: SemanticVariableKind.Identifier;

  /**
   * The identifier whose value in the template is tracked in this variable.
   *
   * 在此变量中跟踪其在模板中的值的标识符。
   *
   */
  identifier: string;
}

/**
 * A variable that represents a saved view context.
 *
 * 表示已保存视图上下文的变量。
 *
 */
export interface SavedViewVariable extends SemanticVariableBase {
  kind: SemanticVariableKind.SavedView;

  /**
   * The view context saved in this variable.
   *
   * 保存在此变量中的视图上下文。
   *
   */
  view: XrefId;
}

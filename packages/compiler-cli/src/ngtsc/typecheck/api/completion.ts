/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {TmplAstReference, TmplAstVariable} from '@angular/compiler';

import {TcbLocation} from './symbols';

/**
 * An autocompletion source of any kind.
 *
 * 任何类型的自动完成源。
 *
 */
export type Completion = ReferenceCompletion|VariableCompletion;

/**
 * Discriminant of an autocompletion source (a `Completion`).
 *
 * 自动完成源（`Completion`）的判别式。
 *
 */

export enum CompletionKind {
  Reference,
  Variable,
}

/**
 * An autocompletion result representing a local reference declared in the template.
 *
 * 表示模板中声明的本地引用的自动完成结果。
 *
 */
export interface ReferenceCompletion {
  kind: CompletionKind.Reference;

  /**
   * The `TmplAstReference` from the template which should be available as a completion.
   *
   * 模板中的 `TmplAstReference` ，应该作为自动完成提供。
   *
   */
  node: TmplAstReference;
}

/**
 * An autocompletion result representing a variable declared in the template.
 *
 * 表示模板中声明的变量的自动完成结果。
 *
 */
export interface VariableCompletion {
  kind: CompletionKind.Variable;

  /**
   * The `TmplAstVariable` from the template which should be available as a completion.
   *
   * 模板中的 `TmplAstVariable` ，应该作为自动完成提供。
   *
   */
  node: TmplAstVariable;
}

/**
 * Autocompletion data for an expression in the global scope.
 *
 * 全局范围中表达式的自动完成数据。
 *
 * Global completion is accomplished by merging data from two sources:
 *
 * 全局自动完成是通过合并来自两个来源的数据来实现的：
 *
 * - TypeScript completion of the component's class members.
 *
 *   组件的类成员的 TypeScript 自动完成。
 *
 * - Local references and variables that are in scope at a given template level.
 *
 *   在给定模板级别的范围内的本地引用和变量。
 *
 */
export interface GlobalCompletion {
  /**
   * A location within the type-checking shim where TypeScript's completion APIs can be used to
   * access completions for the template's component context (component class members).
   *
   * 类型检查 shim 中的位置，TypeScript 的自动完成 API
   * 可用于访问模板的组件上下文（组件类成员）的自动完成。
   *
   */
  componentContext: TcbLocation;

  /**
   * `Map` of local references and variables that are visible at the requested level of the
   * template.
   *
   * 在模板的请求级别可见的本地引用和变量的 `Map` 表。
   *
   * Shadowing of references/variables from multiple levels of the template has already been
   * accounted for in the preparation of `templateContext`. Entries here shadow component members of
   * the same name (from the `componentContext` completions).
   *
   * 在 templateContext 的准备过程中，已经考虑了来自 `templateContext`
   * 多个级别的引用/变量的阴影。此处的条目会影响同名的组件成员（来自 `componentContext` 自动完成）。
   *
   */
  templateContext: Map<string, ReferenceCompletion|VariableCompletion>;

  /**
   * A location within the type-checking shim where TypeScript's completion APIs can be used to
   * access completions for the AST node of the cursor position (primitive constants).
   *
   * 类型检查 shim 中的一个位置，TypeScript 的自动完成 API 可用于访问光标位置的 AST
   * 节点的自动完成（原始常量）。
   *
   */
  nodeContext: TcbLocation|null;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ParseError, ParseSourceFile, R3TargetBinder, SchemaMetadata, TmplAstNode} from '@angular/compiler';
import ts from 'typescript';

import {Reference} from '../../imports';
import {ClassDeclaration} from '../../reflection';

import {TemplateSourceMapping, TypeCheckableDirectiveMeta} from './api';

/**
 * A currently pending type checking operation, into which templates for type-checking can be
 * registered.
 *
 * 当前挂起的类型检查操作，可以在其中注册用于类型检查的模板。
 *
 */
export interface TypeCheckContext {
  /**
   * Register a template to potentially be type-checked.
   *
   * 注册要可能要进行类型检查的模板。
   *
   * Templates registered via `addTemplate` are available for checking, but might be skipped if
   * checking of that component is not required. This can happen for a few reasons, including if
   * the component was previously checked and the prior results are still valid.
   *
   * 通过 `addTemplate`
   * 注册的模板可用于检查，但如果不需要检查该组件，可能会跳过。发生这种情况的原因有多种，包括此组件之前是否已检查过并且之前的结果仍然有效。
   *
   * @param ref a `Reference` to the component class which yielded this template.
   *
   * a 对产生此模板的组件类的 `Reference` 。
   *
   * @param binder an `R3TargetBinder` which encapsulates the scope of this template, including all
   * available directives.
   *
   * 一个 `R3TargetBinder` ，它封装了此模板的范围，包括所有可用的指令。
   *
   * @param template the original template AST of this component.
   *
   * 此组件的原始模板 AST。
   *
   * @param pipes a `Map` of pipes available within the scope of this template.
   *
   * 本模板范围内可用的管道 `Map` 表。
   *
   * @param schemas any schemas which apply to this template.
   *
   * 适用于此模板的任何模式。
   *
   * @param sourceMapping a `TemplateSourceMapping` instance which describes the origin of the
   * template text described by the AST.
   *
   * 一个 `TemplateSourceMapping` 实例，它描述了 AST 描述的模板文本的来源。
   *
   * @param file the `ParseSourceFile` associated with the template.
   *
   * 与模板关联的 `ParseSourceFile` 。
   *
   * @param parseErrors the `ParseError`'s associated with the template.
   *
   * 与模板关联的 `ParseError` 。
   *
   * @param isStandalone a boolean indicating whether the component is standalone.
   *
   * 一个布尔值，指示组件是否是独立的。
   *
   */
  addTemplate(
      ref: Reference<ClassDeclaration<ts.ClassDeclaration>>,
      binder: R3TargetBinder<TypeCheckableDirectiveMeta>, template: TmplAstNode[],
      pipes: Map<string, Reference<ClassDeclaration<ts.ClassDeclaration>>>,
      schemas: SchemaMetadata[], sourceMapping: TemplateSourceMapping, file: ParseSourceFile,
      parseErrors: ParseError[]|null, isStandalone: boolean): void;
}

/**
 * Interface to trigger generation of type-checking code for a program given a new
 * `TypeCheckContext`.
 *
 * 在给定新的 `TypeCheckContext` 的情况下，触发为程序生成类型检查代码的接口。
 *
 */
export interface ProgramTypeCheckAdapter {
  typeCheck(sf: ts.SourceFile, ctx: TypeCheckContext): void;
}

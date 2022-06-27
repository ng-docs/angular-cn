/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {BoundTarget, DirectiveMeta, ParseSourceFile} from '@angular/compiler';

import {Reference} from '../../imports';
import {ClassDeclaration} from '../../reflection';

export interface ComponentMeta extends DirectiveMeta {
  ref: Reference<ClassDeclaration>;
  /**
   * Unparsed selector of the directive, or null if the directive does not have a selector.
   *
   * 指令的未解析的选择器，如果指令没有选择器，则为 null 。
   *
   */
  selector: string|null;
}

/**
 * An intermediate representation of a component.
 *
 * 组件的中间表示。
 *
 */
export interface ComponentInfo {
  /**
   * Component TypeScript class declaration
   *
   * 组件 TypeScript 类声明
   *
   */
  declaration: ClassDeclaration;

  /**
   * Component template selector if it exists, otherwise null.
   *
   * 组件模板选择器如果存在，否则为 null。
   *
   */
  selector: string|null;

  /**
   * BoundTarget containing the parsed template. Can also be used to query for directives used in
   * the template.
   *
   * 包含解析后的模板的 BoundTarget。也可用于查询模板中使用的指令。
   *
   */
  boundTemplate: BoundTarget<ComponentMeta>;

  /**
   * Metadata about the template
   *
   * 有关模板的元数据
   *
   */
  templateMeta: {
    /**
     * Whether the component template is inline
     *
     * 组件模板是否是内联的
     *
     */
    isInline: boolean;

    /**
     * Template file recorded by template parser
     *
     * 模板解析器记录的模板文件
     *
     */
    file: ParseSourceFile;
  };
}

/**
 * A context for storing indexing infromation about components of a program.
 *
 * 用于存储有关程序组件的索引信息的上下文。
 *
 * An `IndexingContext` collects component and template analysis information from
 * `DecoratorHandler`s and exposes them to be indexed.
 *
 * `IndexingContext` 会从 `DecoratorHandler` 收集组件和模板分析信息，并将它们公开以被索引。
 *
 */
export class IndexingContext {
  readonly components = new Set<ComponentInfo>();

  /**
   * Adds a component to the context.
   *
   * 将组件添加到上下文。
   *
   */
  addComponent(info: ComponentInfo) {
    this.components.add(info);
  }
}

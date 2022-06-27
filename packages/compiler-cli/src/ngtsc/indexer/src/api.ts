/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ParseSourceFile} from '@angular/compiler';

import {ClassDeclaration, DeclarationNode} from '../../reflection';

/**
 * Describes the kind of identifier found in a template.
 *
 * 描述在模板中找到的标识符类型。
 *
 */
export enum IdentifierKind {
  Property,
  Method,  // TODO: No longer being used. To be removed together with `MethodIdentifier`.
  Element,
  Template,
  Attribute,
  Reference,
  Variable,
}

/**
 * Describes a semantically-interesting identifier in a template, such as an interpolated variable
 * or selector.
 *
 * 描述模板中一个在语义上有趣的标识符，例如插值变量或选择器。
 *
 */
export interface TemplateIdentifier {
  name: string;
  span: AbsoluteSourceSpan;
  kind: IdentifierKind;
}

/**
 * Describes a template expression, which may have a template reference or variable target.
 *
 * 描述一个模板表达式，它可能有一个模板引用或变量 target。
 *
 */
interface ExpressionIdentifier extends TemplateIdentifier {
  /**
   * ReferenceIdentifier or VariableIdentifier in the template that this identifier targets, if
   * any. If the target is `null`, it points to a declaration on the component class.
   *
   * 此标识符所针对的模板中的 ReferenceIdentifier 或 VariableIdentifier （如果有）。如果目标是
   * `null` ，则指向组件类上的声明。
   *
   */
  target: ReferenceIdentifier|VariableIdentifier|null;
}

/**
 * Describes a property accessed in a template.
 *
 * 描述在模板中访问的属性。
 *
 */
export interface PropertyIdentifier extends ExpressionIdentifier {
  kind: IdentifierKind.Property;
}

/**
 * Describes a method accessed in a template.
 *
 * 描述在模板中访问的方法。
 *
 * @deprecated
 *
 * No longer being used. To be removed.
 *
 * 不再被使用。要被删除。
 *
 */
export interface MethodIdentifier extends ExpressionIdentifier {
  kind: IdentifierKind.Method;
}

/**
 * Describes an element attribute in a template.
 *
 * 描述模板中的元素属性。
 *
 */
export interface AttributeIdentifier extends TemplateIdentifier {
  kind: IdentifierKind.Attribute;
}

/**
 * A reference to a directive node and its selector.
 *
 * 对指令节点及其选择器的引用。
 *
 */
interface DirectiveReference {
  node: ClassDeclaration;
  selector: string;
}
/**
 * A base interface for element and template identifiers.
 *
 * 元素和模板标识符的基础接口。
 *
 */
interface BaseElementOrTemplateIdentifier extends TemplateIdentifier {
  /**
   * Attributes on an element or template.
   *
   * 元素或模板上的属性。
   *
   */
  attributes: Set<AttributeIdentifier>;

  /**
   * Directives applied to an element or template.
   *
   * 应用于元素或模板的指令。
   *
   */
  usedDirectives: Set<DirectiveReference>;
}
/**
 * Describes an indexed element in a template. The name of an `ElementIdentifier` is the entire
 * element tag, which can be parsed by an indexer to determine where used directives should be
 * referenced.
 *
 * 描述模板中的索引元素。 `ElementIdentifier` 的名称是整个元素标记，可以由索引器解析以确定应该引用
 * used 指令的位置。
 *
 */
export interface ElementIdentifier extends BaseElementOrTemplateIdentifier {
  kind: IdentifierKind.Element;
}

/**
 * Describes an indexed template node in a component template file.
 *
 * 描述组件模板文件中的索引模板节点。
 *
 */
export interface TemplateNodeIdentifier extends BaseElementOrTemplateIdentifier {
  kind: IdentifierKind.Template;
}

/**
 * Describes a reference in a template like "foo" in `<div #foo></div>`.
 *
 * 描述模板中的引用，例如 `<div #foo></div>` 中的 "foo" 。
 *
 */
export interface ReferenceIdentifier extends TemplateIdentifier {
  kind: IdentifierKind.Reference;

  /**
   * The target of this reference. If the target is not known, this is `null`.
   *
   * 此引用的目标。如果目标未知，则为 `null` 。
   *
   */
  target: {
    /**
     * The template AST node that the reference targets.
     *
     * 引用所针对的模板 AST 节点。
     *
     */
    node: ElementIdentifier|TemplateIdentifier;

    /**
     * The directive on `node` that the reference targets. If no directive is targeted, this is
     * `null`.
     *
     * 引用所针对的 `node` 上的指令。如果没有目标指令，则这是 `null` 。
     *
     */
    directive: ClassDeclaration | null;
  }|null;
}

/**
 * Describes a template variable like "foo" in `<div *ngFor="let foo of foos"></div>`.
 *
 * 在 `<div *ngFor="let foo of foos"></div>` 中描述一个类似于“foo”的模板变量。
 *
 */
export interface VariableIdentifier extends TemplateIdentifier {
  kind: IdentifierKind.Variable;
}

/**
 * Identifiers recorded at the top level of the template, without any context about the HTML nodes
 * they were discovered in.
 *
 * 记录在模板顶层的标识符，没有关于在其中找到它们的 HTML 节点的任何上下文。
 *
 */
export type TopLevelIdentifier = PropertyIdentifier|ElementIdentifier|TemplateNodeIdentifier|
    ReferenceIdentifier|VariableIdentifier|MethodIdentifier;

/**
 * Describes the absolute byte offsets of a text anchor in a source code.
 *
 * 描述源代码中文本锚点的绝对字节偏移。
 *
 */
export class AbsoluteSourceSpan {
  constructor(public start: number, public end: number) {}
}

/**
 * Describes an analyzed, indexed component and its template.
 *
 * 描述一个已分析的、索引的组件及其模板。
 *
 */
export interface IndexedComponent {
  name: string;
  selector: string|null;
  file: ParseSourceFile;
  template: {
    identifiers: Set<TopLevelIdentifier>,
    usedComponents: Set<DeclarationNode>,
    isInline: boolean,
    file: ParseSourceFile;
  };
  errors: Error[];
}

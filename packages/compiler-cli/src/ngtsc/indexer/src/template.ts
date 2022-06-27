/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {AST, ASTWithSource, BoundTarget, ImplicitReceiver, ParseSourceSpan, PropertyRead, PropertyWrite, RecursiveAstVisitor, TmplAstBoundAttribute, TmplAstBoundEvent, TmplAstBoundText, TmplAstElement, TmplAstNode, TmplAstRecursiveVisitor, TmplAstReference, TmplAstTemplate, TmplAstVariable} from '@angular/compiler';

import {ClassDeclaration, DeclarationNode} from '../../reflection';

import {AbsoluteSourceSpan, AttributeIdentifier, ElementIdentifier, IdentifierKind, MethodIdentifier, PropertyIdentifier, ReferenceIdentifier, TemplateNodeIdentifier, TopLevelIdentifier, VariableIdentifier} from './api';
import {ComponentMeta} from './context';

/**
 * A parsed node in a template, which may have a name (if it is a selector) or
 * be anonymous (like a text span).
 *
 * 模板中的解析节点，可能有一个名称（如果它是选择器）或是匿名的（如文本跨度）。
 *
 */
interface HTMLNode extends TmplAstNode {
  tagName?: string;
  name?: string;
}

type ExpressionIdentifier = PropertyIdentifier|MethodIdentifier;
type TmplTarget = TmplAstReference|TmplAstVariable;
type TargetIdentifier = ReferenceIdentifier|VariableIdentifier;
type TargetIdentifierMap = Map<TmplTarget, TargetIdentifier>;

/**
 * Visits the AST of an Angular template syntax expression, finding interesting
 * entities (variable references, etc.). Creates an array of Entities found in
 * the expression, with the location of the Entities being relative to the
 * expression.
 *
 * 访问 Angular 模板语法表达式的 AST，查找有趣的实体（变量引用等）。创建在表达式中找到的 Entity
 * 数组，其中 Entity 的位置是相对于表达式的。
 *
 * Visiting `text {{prop}}` will return
 * `[TopLevelIdentifier {name: 'prop', span: {start: 7, end: 11}}]`.
 *
 * 访问 `text {{prop}}` 将返回 `[TopLevelIdentifier {name: 'prop', span: {start: 7, end: 11}}]` 。
 *
 */
class ExpressionVisitor extends RecursiveAstVisitor {
  readonly identifiers: ExpressionIdentifier[] = [];
  readonly errors: Error[] = [];

  private constructor(
      private readonly expressionStr: string, private readonly absoluteOffset: number,
      private readonly boundTemplate: BoundTarget<ComponentMeta>,
      private readonly targetToIdentifier: (target: TmplTarget) => TargetIdentifier | null) {
    super();
  }

  /**
   * Returns identifiers discovered in an expression.
   *
   * 返回在表达式中找到的标识符。
   *
   * @param ast expression AST to visit
   *
   * 要访问的表达式 AST
   *
   * @param source expression AST source code
   *
   * 表达式 AST 源代码
   *
   * @param absoluteOffset absolute byte offset from start of the file to the start of the AST
   * source code.
   *
   * 从文件开头到 AST 源代码开头的绝对字节偏移量。
   *
   * @param boundTemplate bound target of the entire template, which can be used to query for the
   * entities expressions target.
   *
   * 整个模板的绑定目标，可用于查询实体表达式目标。
   *
   * @param targetToIdentifier closure converting a template target node to its identifier.
   *
   * 闭包将模板目标节点转换为其标识符。
   *
   */
  static getIdentifiers(
      ast: AST, source: string, absoluteOffset: number, boundTemplate: BoundTarget<ComponentMeta>,
      targetToIdentifier: (target: TmplTarget) => TargetIdentifier |
          null): {identifiers: TopLevelIdentifier[], errors: Error[]} {
    const visitor =
        new ExpressionVisitor(source, absoluteOffset, boundTemplate, targetToIdentifier);
    visitor.visit(ast);
    return {identifiers: visitor.identifiers, errors: visitor.errors};
  }

  override visit(ast: AST) {
    ast.visit(this);
  }

  override visitPropertyRead(ast: PropertyRead, context: {}) {
    this.visitIdentifier(ast, IdentifierKind.Property);
    super.visitPropertyRead(ast, context);
  }

  override visitPropertyWrite(ast: PropertyWrite, context: {}) {
    this.visitIdentifier(ast, IdentifierKind.Property);
    super.visitPropertyWrite(ast, context);
  }

  /**
   * Visits an identifier, adding it to the identifier store if it is useful for indexing.
   *
   * 访问一个标识符，如果它可用于索引，则将其添加到标识符存储中。
   *
   * @param ast expression AST the identifier is in
   *
   * 标识符所在的表达式 AST
   *
   * @param kind identifier kind
   *
   * 标识符类型
   *
   */
  private visitIdentifier(
      ast: AST&{name: string, receiver: AST}, kind: ExpressionIdentifier['kind']) {
    // The definition of a non-top-level property such as `bar` in `{{foo.bar}}` is currently
    // impossible to determine by an indexer and unsupported by the indexing module.
    // The indexing module also does not currently support references to identifiers declared in the
    // template itself, which have a non-null expression target.
    if (!(ast.receiver instanceof ImplicitReceiver)) {
      return;
    }

    // The source span of the requested AST starts at a location that is offset from the expression.
    let identifierStart = ast.sourceSpan.start - this.absoluteOffset;

    if (ast instanceof PropertyRead || ast instanceof PropertyWrite) {
      // For `PropertyRead` and `PropertyWrite`, the identifier starts at the `nameSpan`, not
      // necessarily the `sourceSpan`.
      identifierStart = ast.nameSpan.start - this.absoluteOffset;
    }

    if (!this.expressionStr.substring(identifierStart).startsWith(ast.name)) {
      this.errors.push(new Error(`Impossible state: "${ast.name}" not found in "${
          this.expressionStr}" at location ${identifierStart}`));
      return;
    }

    // Join the relative position of the expression within a node with the absolute position
    // of the node to get the absolute position of the expression in the source code.
    const absoluteStart = this.absoluteOffset + identifierStart;
    const span = new AbsoluteSourceSpan(absoluteStart, absoluteStart + ast.name.length);

    const targetAst = this.boundTemplate.getExpressionTarget(ast);
    const target = targetAst ? this.targetToIdentifier(targetAst) : null;
    const identifier = {
      name: ast.name,
      span,
      kind,
      target,
    } as ExpressionIdentifier;

    this.identifiers.push(identifier);
  }
}

/**
 * Visits the AST of a parsed Angular template. Discovers and stores
 * identifiers of interest, deferring to an `ExpressionVisitor` as needed.
 *
 * 访问已解析的 Angular 模板的 AST。发现并存储感兴趣的标识符，根据需要推迟到 `ExpressionVisitor` 。
 *
 */
class TemplateVisitor extends TmplAstRecursiveVisitor {
  // Identifiers of interest found in the template.
  readonly identifiers = new Set<TopLevelIdentifier>();
  readonly errors: Error[] = [];

  // Map of targets in a template to their identifiers.
  private readonly targetIdentifierCache: TargetIdentifierMap = new Map();

  // Map of elements and templates to their identifiers.
  private readonly elementAndTemplateIdentifierCache =
      new Map<TmplAstElement|TmplAstTemplate, ElementIdentifier|TemplateNodeIdentifier>();

  /**
   * Creates a template visitor for a bound template target. The bound target can be used when
   * deferred to the expression visitor to get information about the target of an expression.
   *
   * 为绑定的模板目标创建模板访问器。当延迟到表达式访问者以获取有关表达式目标的信息时，可以用绑定目标。
   *
   * @param boundTemplate bound template target
   *
   * 绑定模板目标
   *
   */
  constructor(private boundTemplate: BoundTarget<ComponentMeta>) {
    super();
  }

  /**
   * Visits a node in the template.
   *
   * 访问模板中的节点。
   *
   * @param node node to visit
   *
   * 要访问的节点
   *
   */
  visit(node: HTMLNode) {
    node.visit(this);
  }

  visitAll(nodes: TmplAstNode[]) {
    nodes.forEach(node => this.visit(node));
  }

  /**
   * Add an identifier for an HTML element and visit its children recursively.
   *
   * 为 HTML 元素添加标识符并递归访问其子项。
   *
   * @param element
   */
  override visitElement(element: TmplAstElement) {
    const elementIdentifier = this.elementOrTemplateToIdentifier(element);
    if (elementIdentifier !== null) {
      this.identifiers.add(elementIdentifier);
    }


    this.visitAll(element.references);
    this.visitAll(element.inputs);
    this.visitAll(element.attributes);
    this.visitAll(element.children);
    this.visitAll(element.outputs);
  }
  override visitTemplate(template: TmplAstTemplate) {
    const templateIdentifier = this.elementOrTemplateToIdentifier(template);

    if (templateIdentifier !== null) {
      this.identifiers.add(templateIdentifier);
    }

    this.visitAll(template.variables);
    this.visitAll(template.attributes);
    this.visitAll(template.templateAttrs);
    this.visitAll(template.children);
    this.visitAll(template.references);
  }
  override visitBoundAttribute(attribute: TmplAstBoundAttribute) {
    // If the bound attribute has no value, it cannot have any identifiers in the value expression.
    if (attribute.valueSpan === undefined) {
      return;
    }

    const {identifiers, errors} = ExpressionVisitor.getIdentifiers(
        attribute.value, attribute.valueSpan.toString(), attribute.valueSpan.start.offset,
        this.boundTemplate, this.targetToIdentifier.bind(this));
    identifiers.forEach(id => this.identifiers.add(id));
    this.errors.push(...errors);
  }
  override visitBoundEvent(attribute: TmplAstBoundEvent) {
    this.visitExpression(attribute.handler);
  }
  override visitBoundText(text: TmplAstBoundText) {
    this.visitExpression(text.value);
  }
  override visitReference(reference: TmplAstReference) {
    const referenceIdentifer = this.targetToIdentifier(reference);
    if (referenceIdentifer === null) {
      return;
    }

    this.identifiers.add(referenceIdentifer);
  }
  override visitVariable(variable: TmplAstVariable) {
    const variableIdentifier = this.targetToIdentifier(variable);
    if (variableIdentifier === null) {
      return;
    }

    this.identifiers.add(variableIdentifier);
  }

  /**
   * Creates an identifier for a template element or template node.
   *
   * 为模板元素或模板节点创建一个标识符。
   *
   */
  private elementOrTemplateToIdentifier(node: TmplAstElement|TmplAstTemplate): ElementIdentifier
      |TemplateNodeIdentifier|null {
    // If this node has already been seen, return the cached result.
    if (this.elementAndTemplateIdentifierCache.has(node)) {
      return this.elementAndTemplateIdentifierCache.get(node)!;
    }

    let name: string;
    let kind: IdentifierKind.Element|IdentifierKind.Template;
    if (node instanceof TmplAstTemplate) {
      name = node.tagName ?? 'ng-template';
      kind = IdentifierKind.Template;
    } else {
      name = node.name;
      kind = IdentifierKind.Element;
    }
    // Namespaced elements have a particular format for `node.name` that needs to be handled.
    // For example, an `<svg>` element has a `node.name` of `':svg:svg'`.
    // TODO(alxhub): properly handle namespaced elements
    if (name.startsWith(':')) {
      name = name.split(':').pop()!;
    }

    const sourceSpan = node.startSourceSpan;
    // An element's or template's source span can be of the form `<element>`, `<element />`, or
    // `<element></element>`. Only the selector is interesting to the indexer, so the source is
    // searched for the first occurrence of the element (selector) name.
    const start = this.getStartLocation(name, sourceSpan);
    if (start === null) {
      return null;
    }
    const absoluteSpan = new AbsoluteSourceSpan(start, start + name.length);

    // Record the nodes's attributes, which an indexer can later traverse to see if any of them
    // specify a used directive on the node.
    const attributes = node.attributes.map(({name, sourceSpan}): AttributeIdentifier => {
      return {
        name,
        span: new AbsoluteSourceSpan(sourceSpan.start.offset, sourceSpan.end.offset),
        kind: IdentifierKind.Attribute,
      };
    });
    const usedDirectives = this.boundTemplate.getDirectivesOfNode(node) || [];

    const identifier = {
      name,
      span: absoluteSpan,
      kind,
      attributes: new Set(attributes),
      usedDirectives: new Set(usedDirectives.map(dir => {
        return {
          node: dir.ref.node,
          selector: dir.selector,
        };
      })),
      // cast b/c pre-TypeScript 3.5 unions aren't well discriminated
    } as ElementIdentifier |
        TemplateNodeIdentifier;

    this.elementAndTemplateIdentifierCache.set(node, identifier);
    return identifier;
  }

  /**
   * Creates an identifier for a template reference or template variable target.
   *
   * 为模板引用或模板变量目标创建标识符。
   *
   */
  private targetToIdentifier(node: TmplAstReference|TmplAstVariable): TargetIdentifier|null {
    // If this node has already been seen, return the cached result.
    if (this.targetIdentifierCache.has(node)) {
      return this.targetIdentifierCache.get(node)!;
    }

    const {name, sourceSpan} = node;
    const start = this.getStartLocation(name, sourceSpan);
    if (start === null) {
      return null;
    }

    const span = new AbsoluteSourceSpan(start, start + name.length);
    let identifier: ReferenceIdentifier|VariableIdentifier;
    if (node instanceof TmplAstReference) {
      // If the node is a reference, we care about its target. The target can be an element, a
      // template, a directive applied on a template or element (in which case the directive field
      // is non-null), or nothing at all.
      const refTarget = this.boundTemplate.getReferenceTarget(node);
      let target = null;
      if (refTarget) {
        let node: ElementIdentifier|TemplateNodeIdentifier|null = null;
        let directive: ClassDeclaration<DeclarationNode>|null = null;
        if (refTarget instanceof TmplAstElement || refTarget instanceof TmplAstTemplate) {
          node = this.elementOrTemplateToIdentifier(refTarget);
        } else {
          node = this.elementOrTemplateToIdentifier(refTarget.node);
          directive = refTarget.directive.ref.node;
        }

        if (node === null) {
          return null;
        }
        target = {
          node,
          directive,
        };
      }

      identifier = {
        name,
        span,
        kind: IdentifierKind.Reference,
        target,
      };
    } else {
      identifier = {
        name,
        span,
        kind: IdentifierKind.Variable,
      };
    }

    this.targetIdentifierCache.set(node, identifier);
    return identifier;
  }

  /**
   * Gets the start location of a string in a SourceSpan
   *
   * 获取字符串在 SourceSpan 中的开始位置
   *
   */
  private getStartLocation(name: string, context: ParseSourceSpan): number|null {
    const localStr = context.toString();
    if (!localStr.includes(name)) {
      this.errors.push(new Error(`Impossible state: "${name}" not found in "${localStr}"`));
      return null;
    }
    return context.start.offset + localStr.indexOf(name);
  }

  /**
   * Visits a node's expression and adds its identifiers, if any, to the visitor's state.
   * Only ASTs with information about the expression source and its location are visited.
   *
   * 访问节点的表达式并将其标识符（如果有）添加到访问者的状态。只有包含有关表达式源及其位置的信息的
   * AST 才会被访问。
   *
   * @param node node whose expression to visit
   *
   * 要访问其表达式的节点
   *
   */
  private visitExpression(ast: AST) {
    // Only include ASTs that have information about their source and absolute source spans.
    if (ast instanceof ASTWithSource && ast.source !== null) {
      // Make target to identifier mapping closure stateful to this visitor instance.
      const targetToIdentifier = this.targetToIdentifier.bind(this);
      const absoluteOffset = ast.sourceSpan.start;
      const {identifiers, errors} = ExpressionVisitor.getIdentifiers(
          ast, ast.source, absoluteOffset, this.boundTemplate, targetToIdentifier);
      identifiers.forEach(id => this.identifiers.add(id));
      this.errors.push(...errors);
    }
  }
}

/**
 * Traverses a template AST and builds identifiers discovered in it.
 *
 * 遍历模板 AST 并构建在其中找到的标识符。
 *
 * @param boundTemplate bound template target, which can be used for querying expression targets.
 *
 * 绑定的模板目标，可用于查询表达式目标。
 *
 * @return identifiers in template
 *
 * 模板中的标识符
 *
 */
export function getTemplateIdentifiers(boundTemplate: BoundTarget<ComponentMeta>):
    {identifiers: Set<TopLevelIdentifier>, errors: Error[]} {
  const visitor = new TemplateVisitor(boundTemplate);
  if (boundTemplate.target.template !== undefined) {
    visitor.visitAll(boundTemplate.target.template);
  }
  return {identifiers: visitor.identifiers, errors: visitor.errors};
}

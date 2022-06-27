/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ParseSpan, TmplAstBoundEvent} from '@angular/compiler';
import * as e from '@angular/compiler/src/expression_parser/ast';  // e for expression AST
import * as t from '@angular/compiler/src/render3/r3_ast';         // t for template AST

import {isBoundEventWithSyntheticHandler, isTemplateNodeWithKeyAndValue, isWithin, isWithinKeyValue} from './utils';

/**
 * Contextual information for a target position within the template.
 *
 * 模板中目标位置的上下文信息。
 *
 */
export interface TemplateTarget {
  /**
   * Target position within the template.
   *
   * 模板中的目标位置。
   *
   */
  position: number;

  /**
   * The template (or AST expression) node or nodes closest to the search position.
   *
   * 离搜索位置最近的模板（或 AST 表达式）节点。
   *
   */
  context: TargetContext;

  /**
   * The `t.Template` which contains the found node or expression (or `null` if in the root
   * template).
   *
   * 包含找到的节点或表达式的 `t.Template` （如果在根模板中，则为 `null` ）。
   *
   */
  template: t.Template|null;

  /**
   * The immediate parent node of the targeted node.
   *
   * 目标节点的直接父节点。
   *
   */
  parent: t.Node|e.AST|null;
}

/**
 * A node or nodes targeted at a given position in the template, including potential contextual
 * information about the specific aspect of the node being referenced.
 *
 * 针对模板中给定位置的一个或多个节点，包括有关被引用节点的特定切面的潜在上下文信息。
 *
 * Some nodes have multiple interior contexts. For example, `t.Element` nodes have both a tag name
 * as well as a body, and a given position definitively points to one or the other. `TargetNode`
 * captures the node itself, as well as this additional contextual disambiguation.
 *
 * 某些节点有多个内部上下文。例如， `t.Element`
 * 节点既有标签名称也有主体，并且给定的位置最终指向了两者。 `TargetNode`
 * 捕获节点本身，以及这种额外的上下文消歧。
 *
 */
export type TargetContext = SingleNodeTarget|MultiNodeTarget;

/**
 * Contexts which logically target only a single node in the template AST.
 *
 * 在逻辑上仅针对模板 AST 中的单个节点的上下文。
 *
 */
export type SingleNodeTarget = RawExpression|CallExpressionInArgContext|RawTemplateNode|
    ElementInBodyContext|ElementInTagContext|AttributeInKeyContext|AttributeInValueContext;

/**
 * Contexts which logically target multiple nodes in the template AST, which cannot be
 * disambiguated given a single position because they are all equally relavent. For example, in the
 * banana-in-a-box syntax `[(ngModel)]="formValues.person"`, the position in the template for the
 * key `ngModel` refers to both the bound event `ngModelChange` and the input `ngModel`.
 *
 * 逻辑上以模板 AST
 * 中的多个节点为目标的上下文，在给定单个位置的情况下无法消除歧义，因为它们都是同样相关的。例如，在
 * banner-in-a-box 语法 `[(ngModel)]="formValues.person"` 中，键 `ngModel`
 * 在模板中的位置是指绑定事件 `ngModelChange` 和输入 `ngModel` 。
 *
 */
export type MultiNodeTarget = TwoWayBindingContext;

/**
 * Differentiates the various kinds of `TargetNode`s.
 *
 * 区分各种类型的 `TargetNode` 。
 *
 */
export enum TargetNodeKind {
  RawExpression,
  CallExpressionInArgContext,
  RawTemplateNode,
  ElementInTagContext,
  ElementInBodyContext,
  AttributeInKeyContext,
  AttributeInValueContext,
  TwoWayBindingContext,
}

/**
 * An `e.AST` expression that's targeted at a given position, with no additional context.
 *
 * 针对给定位置的 `e.AST` 表达式，没有额外的上下文。
 *
 */
export interface RawExpression {
  kind: TargetNodeKind.RawExpression;
  node: e.AST;
  parents: e.AST[];
}

/**
 * An `e.Call` expression with the cursor in a position where an argument could appear.
 *
 * 光标位于可能出现参数的位置的 `e.Call` 表达式。
 *
 * This is returned when the only matching node is the method call expression, but the cursor is
 * within the method call parentheses. For example, in the expression `foo(|)` there is no argument
 * expression that the cursor could be targeting, but the cursor is in a position where one could
 * appear.
 *
 * 当唯一匹配的节点是方法调用表达式，但光标在方法调用括号内时，会返回此值。例如，在表达式 `foo(|)`
 * 中，没有光标可以作为目标的参数表达式，但光标位于可以出现的位置。
 *
 */
export interface CallExpressionInArgContext {
  kind: TargetNodeKind.CallExpressionInArgContext;
  node: e.Call|e.SafeCall;
}

/**
 * A `t.Node` template node that's targeted at a given position, with no additional context.
 *
 * 以给定位置为目标的 `t.Node` 模板节点，没有额外的上下文。
 *
 */
export interface RawTemplateNode {
  kind: TargetNodeKind.RawTemplateNode;
  node: t.Node;
}

/**
 * A `t.Element` (or `t.Template`) element node that's targeted, where the given position is within
 * the tag name.
 *
 * 目标的 `t.Element` （或 `t.Template` ）元素节点，其中的给定位置在标签名称中。
 *
 */
export interface ElementInTagContext {
  kind: TargetNodeKind.ElementInTagContext;
  node: t.Element|t.Template;
}

/**
 * A `t.Element` (or `t.Template`) element node that's targeted, where the given position is within
 * the element body.
 *
 * 目标的 `t.Element` （或 `t.Template` ）元素节点，其中的给定位置在元素体中。
 *
 */
export interface ElementInBodyContext {
  kind: TargetNodeKind.ElementInBodyContext;
  node: t.Element|t.Template;
}

export interface AttributeInKeyContext {
  kind: TargetNodeKind.AttributeInKeyContext;
  node: t.TextAttribute|t.BoundAttribute|t.BoundEvent;
}

export interface AttributeInValueContext {
  kind: TargetNodeKind.AttributeInValueContext;
  node: t.TextAttribute|t.BoundAttribute|t.BoundEvent;
}

/**
 * A `t.BoundAttribute` and `t.BoundEvent` pair that are targeted, where the given position is
 * within the key span of both.
 *
 * 目标的 `t.BoundAttribute` 和 `t.BoundEvent` 对，其中的给定位置在两者的键范围内。
 *
 */
export interface TwoWayBindingContext {
  kind: TargetNodeKind.TwoWayBindingContext;
  nodes: [t.BoundAttribute, t.BoundEvent];
}

/**
 * Special marker AST that can be used when the cursor is within the `sourceSpan` but not
 * the key or value span of a node with key/value spans.
 *
 * 当光标在 `sourceSpan` 但不在具有键/值范围的节点的键或值范围内时可以用的特殊标记 AST。
 *
 */
class OutsideKeyValueMarkerAst extends e.AST {
  override visit(): null {
    return null;
  }
}

/**
 * This special marker is added to the path when the cursor is within the sourceSpan but not the key
 * or value span of a node with key/value spans.
 *
 * 当光标在 sourceSpan 但不在具有键/值范围的节点的键或值范围内时，会将此特殊标记添加到路径中。
 *
 */
const OUTSIDE_K_V_MARKER =
    new OutsideKeyValueMarkerAst(new ParseSpan(-1, -1), new e.AbsoluteSourceSpan(-1, -1));

/**
 * Return the template AST node or expression AST node that most accurately
 * represents the node at the specified cursor `position`.
 *
 * 返回最准确地表示指定光标 `position` 处的节点的模板 AST 节点或表达式 AST 节点。
 *
 * @param template AST tree of the template
 *
 * 模板的 AST 树
 *
 * @param position target cursor position
 *
 * 目标光标位置
 *
 */
export function getTargetAtPosition(template: t.Node[], position: number): TemplateTarget|null {
  const path = TemplateTargetVisitor.visitTemplate(template, position);
  if (path.length === 0) {
    return null;
  }

  const candidate = path[path.length - 1];
  // Walk up the result nodes to find the nearest `t.Template` which contains the targeted node.
  let context: t.Template|null = null;
  for (let i = path.length - 2; i >= 0; i--) {
    const node = path[i];
    if (node instanceof t.Template) {
      context = node;
      break;
    }
  }

  // Given the candidate node, determine the full targeted context.
  let nodeInContext: TargetContext;
  if ((candidate instanceof e.Call || candidate instanceof e.SafeCall) &&
      isWithin(position, candidate.argumentSpan)) {
    nodeInContext = {
      kind: TargetNodeKind.CallExpressionInArgContext,
      node: candidate,
    };
  } else if (candidate instanceof e.AST) {
    const parents = path.filter((value: e.AST|t.Node): value is e.AST => value instanceof e.AST);
    // Remove the current node from the parents list.
    parents.pop();

    nodeInContext = {
      kind: TargetNodeKind.RawExpression,
      node: candidate,
      parents,
    };
  } else if (candidate instanceof t.Element) {
    // Elements have two contexts: the tag context (position is within the element tag) or the
    // element body context (position is outside of the tag name, but still in the element).

    // Calculate the end of the element tag name. Any position beyond this is in the element body.
    const tagEndPos =
        candidate.sourceSpan.start.offset + 1 /* '<' element open */ + candidate.name.length;
    if (position > tagEndPos) {
      // Position is within the element body
      nodeInContext = {
        kind: TargetNodeKind.ElementInBodyContext,
        node: candidate,
      };
    } else {
      nodeInContext = {
        kind: TargetNodeKind.ElementInTagContext,
        node: candidate,
      };
    }
  } else if (
      (candidate instanceof t.BoundAttribute || candidate instanceof t.BoundEvent ||
       candidate instanceof t.TextAttribute) &&
      candidate.keySpan !== undefined) {
    const previousCandidate = path[path.length - 2];
    if (candidate instanceof t.BoundEvent && previousCandidate instanceof t.BoundAttribute &&
        candidate.name === previousCandidate.name + 'Change') {
      const boundAttribute: t.BoundAttribute = previousCandidate;
      const boundEvent: t.BoundEvent = candidate;
      nodeInContext = {
        kind: TargetNodeKind.TwoWayBindingContext,
        nodes: [boundAttribute, boundEvent],
      };
    } else if (isWithin(position, candidate.keySpan)) {
      nodeInContext = {
        kind: TargetNodeKind.AttributeInKeyContext,
        node: candidate,
      };
    } else {
      nodeInContext = {
        kind: TargetNodeKind.AttributeInValueContext,
        node: candidate,
      };
    }
  } else {
    nodeInContext = {
      kind: TargetNodeKind.RawTemplateNode,
      node: candidate,
    };
  }

  let parent: t.Node|e.AST|null = null;
  if (nodeInContext.kind === TargetNodeKind.TwoWayBindingContext && path.length >= 3) {
    parent = path[path.length - 3];
  } else if (path.length >= 2) {
    parent = path[path.length - 2];
  }

  return {position, context: nodeInContext, template: context, parent};
}

/**
 * Visitor which, given a position and a template, identifies the node within the template at that
 * position, as well as records the path of increasingly nested nodes that were traversed to reach
 * that position.
 *
 * 访问者，给定一个位置和模板，可识别模板中该位置的节点，并记录为到达该位置而遍历的越来越多的嵌套节点的路径。
 *
 */
class TemplateTargetVisitor implements t.Visitor {
  // We need to keep a path instead of the last node because we might need more
  // context for the last node, for example what is the parent node?
  readonly path: Array<t.Node|e.AST> = [];

  static visitTemplate(template: t.Node[], position: number): Array<t.Node|e.AST> {
    const visitor = new TemplateTargetVisitor(position);
    visitor.visitAll(template);
    const {path} = visitor;

    const strictPath = path.filter(v => v !== OUTSIDE_K_V_MARKER);
    const candidate = strictPath[strictPath.length - 1];
    const matchedASourceSpanButNotAKvSpan = path.some(v => v === OUTSIDE_K_V_MARKER);
    if (matchedASourceSpanButNotAKvSpan &&
        (candidate instanceof t.Template || candidate instanceof t.Element)) {
      // Template nodes with key and value spans are always defined on a `t.Template` or
      // `t.Element`. If we found a node on a template with a `sourceSpan` that includes the cursor,
      // it is possible that we are outside the k/v spans (i.e. in-between them). If this is the
      // case and we do not have any other candidate matches on the `t.Element` or `t.Template`, we
      // want to return no results. Otherwise, the `t.Element`/`t.Template` result is incorrect for
      // that cursor position.
      return [];
    }
    return strictPath;
  }

  // Position must be absolute in the source file.
  private constructor(private readonly position: number) {}

  visit(node: t.Node) {
    const {start, end} = getSpanIncludingEndTag(node);
    if (end !== null && !isWithin(this.position, {start, end})) {
      return;
    }

    const last: t.Node|e.AST|undefined = this.path[this.path.length - 1];
    const withinKeySpanOfLastNode =
        last && isTemplateNodeWithKeyAndValue(last) && isWithin(this.position, last.keySpan);
    const withinKeySpanOfCurrentNode =
        isTemplateNodeWithKeyAndValue(node) && isWithin(this.position, node.keySpan);
    if (withinKeySpanOfLastNode && !withinKeySpanOfCurrentNode) {
      // We've already identified that we are within a `keySpan` of a node.
      // Unless we are _also_ in the `keySpan` of the current node (happens with two way bindings),
      // we should stop processing nodes at this point to prevent matching any other nodes. This can
      // happen when the end span of a different node touches the start of the keySpan for the
      // candidate node. Because our `isWithin` logic is inclusive on both ends, we can match both
      // nodes.
      return;
    }
    if (isTemplateNodeWithKeyAndValue(node) && !isWithinKeyValue(this.position, node)) {
      // If cursor is within source span but not within key span or value span,
      // do not return the node.
      this.path.push(OUTSIDE_K_V_MARKER);
    } else {
      this.path.push(node);
      node.visit(this);
    }
  }

  visitElement(element: t.Element) {
    this.visitElementOrTemplate(element);
  }


  visitTemplate(template: t.Template) {
    this.visitElementOrTemplate(template);
  }

  visitElementOrTemplate(element: t.Template|t.Element) {
    this.visitAll(element.attributes);
    this.visitAll(element.inputs);
    // We allow the path to contain both the `t.BoundAttribute` and `t.BoundEvent` for two-way
    // bindings but do not want the path to contain both the `t.BoundAttribute` with its
    // children when the position is in the value span because we would then logically create a path
    // that also contains the `PropertyWrite` from the `t.BoundEvent`. This early return condition
    // ensures we target just `t.BoundAttribute` for this case and exclude `t.BoundEvent` children.
    if (this.path[this.path.length - 1] !== element &&
        !(this.path[this.path.length - 1] instanceof t.BoundAttribute)) {
      return;
    }
    this.visitAll(element.outputs);
    if (element instanceof t.Template) {
      this.visitAll(element.templateAttrs);
    }
    this.visitAll(element.references);
    if (element instanceof t.Template) {
      this.visitAll(element.variables);
    }

    // If we get here and have not found a candidate node on the element itself, proceed with
    // looking for a more specific node on the element children.
    if (this.path[this.path.length - 1] !== element) {
      return;
    }

    this.visitAll(element.children);
  }

  visitContent(content: t.Content) {
    t.visitAll(this, content.attributes);
  }

  visitVariable(variable: t.Variable) {
    // Variable has no template nodes or expression nodes.
  }

  visitReference(reference: t.Reference) {
    // Reference has no template nodes or expression nodes.
  }

  visitTextAttribute(attribute: t.TextAttribute) {
    // Text attribute has no template nodes or expression nodes.
  }

  visitBoundAttribute(attribute: t.BoundAttribute) {
    if (attribute.valueSpan !== undefined) {
      const visitor = new ExpressionVisitor(this.position);
      visitor.visit(attribute.value, this.path);
    }
  }

  visitBoundEvent(event: t.BoundEvent) {
    if (!isBoundEventWithSyntheticHandler(event)) {
      const visitor = new ExpressionVisitor(this.position);
      visitor.visit(event.handler, this.path);
    }
  }

  visitText(text: t.Text) {
    // Text has no template nodes or expression nodes.
  }

  visitBoundText(text: t.BoundText) {
    const visitor = new ExpressionVisitor(this.position);
    visitor.visit(text.value, this.path);
  }

  visitIcu(icu: t.Icu) {
    for (const boundText of Object.values(icu.vars)) {
      this.visit(boundText);
    }
    for (const boundTextOrText of Object.values(icu.placeholders)) {
      this.visit(boundTextOrText);
    }
  }

  visitAll(nodes: t.Node[]) {
    for (const node of nodes) {
      this.visit(node);
    }
  }
}

class ExpressionVisitor extends e.RecursiveAstVisitor {
  // Position must be absolute in the source file.
  constructor(private readonly position: number) {
    super();
  }

  override visit(node: e.AST, path: Array<t.Node|e.AST>) {
    if (node instanceof e.ASTWithSource) {
      // In order to reduce noise, do not include `ASTWithSource` in the path.
      // For the purpose of source spans, there is no difference between
      // `ASTWithSource` and and underlying node that it wraps.
      node = node.ast;
    }
    // The third condition is to account for the implicit receiver, which should
    // not be visited.
    if (isWithin(this.position, node.sourceSpan) && !(node instanceof e.ImplicitReceiver)) {
      path.push(node);
      node.visit(this, path);
    }
  }
}

function getSpanIncludingEndTag(ast: t.Node) {
  const result = {
    start: ast.sourceSpan.start.offset,
    end: ast.sourceSpan.end.offset,
  };
  // For Element and Template node, sourceSpan.end is the end of the opening
  // tag. For the purpose of language service, we need to actually recognize
  // the end of the closing tag. Otherwise, for situation like
  // <my-component></my-comp¦onent> where the cursor is in the closing tag
  // we will not be able to return any information.
  if (ast instanceof t.Element || ast instanceof t.Template) {
    if (ast.endSourceSpan) {
      result.end = ast.endSourceSpan.end.offset;
    } else if (ast.children.length > 0) {
      // If the AST has children but no end source span, then it is an unclosed element with an end
      // that should be the end of the last child.
      result.end = getSpanIncludingEndTag(ast.children[ast.children.length - 1]).end;
    } else {
      // This is likely a self-closing tag with no children so the `sourceSpan.end` is correct.
    }
  }
  return result;
}

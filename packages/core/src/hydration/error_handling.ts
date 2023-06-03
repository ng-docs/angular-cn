/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {RuntimeError, RuntimeErrorCode} from '../errors';
import {getDeclarationComponentDef} from '../render3/instructions/element_validation';
import {TNode, TNodeType} from '../render3/interfaces/node';
import {RNode} from '../render3/interfaces/renderer_dom';
import {LView, TVIEW} from '../render3/interfaces/view';
import {getParentRElement} from '../render3/node_manipulation';

const AT_THIS_LOCATION = '<-- AT THIS LOCATION';

/**
 * Retrieves a user friendly string for a given TNodeType for use in
 * friendly error messages
 *
 * 检索给定 TNodeType 的用户友好字符串，用于友好的错误消息
 *
 * @param tNodeType
 * @returns
 */
function getFriendlyStringFromTNodeType(tNodeType: TNodeType): string {
  switch (tNodeType) {
    case TNodeType.Container:
      return 'view container';
    case TNodeType.Element:
      return 'element';
    case TNodeType.ElementContainer:
      return 'ng-container';
    case TNodeType.Icu:
      return 'icu';
    case TNodeType.Placeholder:
      return 'i18n';
    case TNodeType.Projection:
      return 'projection';
    case TNodeType.Text:
      return 'text';
    default:
      // This should not happen as we cover all possible TNode types above.
      return '<unknown>';
  }
}

/**
 * Validates that provided nodes match during the hydration process.
 *
 * 验证提供的节点在水化过程中是否匹配。
 *
 */
export function validateMatchingNode(
    node: RNode, nodeType: number, tagName: string|null, lView: LView, tNode: TNode,
    isViewContainerAnchor = false): void {
  if (!node ||
      ((node as Node).nodeType !== nodeType ||
       ((node as Node).nodeType === Node.ELEMENT_NODE &&
        (node as HTMLElement).tagName.toLowerCase() !== tagName?.toLowerCase()))) {
    const expectedNode = shortRNodeDescription(nodeType, tagName, null);
    let header = `During hydration Angular expected ${expectedNode} but `;

    const hostComponentDef = getDeclarationComponentDef(lView);
    const componentClassName = hostComponentDef?.type?.name;

    const expected = `Angular expected this DOM:\n\n${
        describeExpectedDom(lView, tNode, isViewContainerAnchor)}\n\n`;

    let actual = '';

    if (!node) {
      // No node found during hydration.
      header += `the node was not found.\n\n`;
    } else {
      const actualNode = shortRNodeDescription(
          (node as Node).nodeType, (node as HTMLElement).tagName ?? null,
          (node as HTMLElement).textContent ?? null);

      header += `found ${actualNode}.\n\n`;
      actual = `Actual DOM is:\n\n${describeDomFromNode(node)}\n\n`;
    }

    const footer = getHydrationErrorFooter(componentClassName);
    const message = header + expected + actual + getHydrationAttributeNote() + footer;
    throw new RuntimeError(RuntimeErrorCode.HYDRATION_NODE_MISMATCH, message);
  }
}

/**
 * Validates that a given node has sibling nodes
 *
 * 验证给定节点是否具有兄弟节点
 *
 */
export function validateSiblingNodeExists(node: RNode|null): void {
  validateNodeExists(node);
  if (!node!.nextSibling) {
    const header = 'During hydration Angular expected more sibling nodes to be present.\n\n';
    const actual = `Actual DOM is:\n\n${describeDomFromNode(node!)}\n\n`;
    const footer = getHydrationErrorFooter();

    const message = header + actual + footer;
    throw new RuntimeError(RuntimeErrorCode.HYDRATION_MISSING_SIBLINGS, message);
  }
}

/**
 * Validates that a node exists or throws
 *
 * 验证节点是否存在或抛出
 *
 */
export function validateNodeExists(
    node: RNode|null, lView: LView|null = null, tNode: TNode|null = null): void {
  if (!node) {
    const header =
        'During hydration, Angular expected an element to be present at this location.\n\n';
    let expected = '';
    let footer = '';
    if (lView !== null && tNode !== null) {
      expected = `${describeExpectedDom(lView, tNode, false)}\n\n`;
      footer = getHydrationErrorFooter();
    }
    throw new RuntimeError(RuntimeErrorCode.HYDRATION_MISSING_NODE, header + expected + footer);
  }
}

/**
 * Builds the hydration error message when a node is not found
 *
 * 找不到节点时构建水合作用错误消息
 *
 * @param lView the LView where the node exists
 *
 * 节点所在的 LView
 *
 * @param tNode the TNode
 *
 * 节点
 *
 */
export function nodeNotFoundError(lView: LView, tNode: TNode): Error {
  const header = 'During serialization, Angular was unable to find an element in the DOM:\n\n';
  const expected = `${describeExpectedDom(lView, tNode, false)}\n\n`;
  const footer = getHydrationErrorFooter();

  throw new RuntimeError(RuntimeErrorCode.HYDRATION_MISSING_NODE, header + expected + footer);
}

/**
 * Builds a hydration error message when a node is not found at a path location
 *
 * 当在路径位置找不到节点时构建水合作用错误消息
 *
 * @param host the Host Node
 *
 * 宿主节点
 *
 * @param path the path to the node
 *
 * 节点的路径
 *
 */
export function nodeNotFoundAtPathError(host: Node, path: string): Error {
  const header = `During hydration Angular was unable to locate a node ` +
      `using the "${path}" path, starting from the ${describeRNode(host)} node.\n\n`;
  const footer = getHydrationErrorFooter();

  throw new RuntimeError(RuntimeErrorCode.HYDRATION_MISSING_NODE, header + footer);
}


/**
 * Builds the hydration error message in the case that dom nodes are created outside of
 * the Angular context and are being used as projected nodes
 *
 * 在 dom 节点是在 Angular 上下文之外创建并被用作投影节点的情况下构建水合作用错误消息
 *
 * @param lView the LView
 *
 * 左视图
 *
 * @param tNode the TNode
 *
 * 节点
 *
 * @returns
 *
 * an error
 *
 * 一个错误
 *
 */
export function unsupportedProjectionOfDomNodes(rNode: RNode): Error {
  const header = 'During serialization, Angular detected DOM nodes ' +
      'that were created outside of Angular context and provided as projectable nodes ' +
      '(likely via `ViewContainerRef.createComponent` or `createComponent` APIs). ' +
      'Hydration is not supported for such cases, consider refactoring the code to avoid ' +
      'this pattern or using `ngSkipHydration` on the host element of the component.\n\n';
  const actual = `${describeDomFromNode(rNode)}\n\n`;
  const message = header + actual + getHydrationAttributeNote();
  return new RuntimeError(RuntimeErrorCode.UNSUPPORTED_PROJECTION_DOM_NODES, message);
}

/**
 * Builds the hydration error message in the case that ngSkipHydration was used on a
 * node that is not a component host element or host binding
 *
 * 在 ngSkipHydration 用于非组件宿主元素或宿主绑定的节点上时构建水合作用错误消息
 *
 * @param rNode the HTML Element
 *
 * HTML 元素
 *
 * @returns
 *
 * an error
 *
 * 一个错误
 *
 */
export function invalidSkipHydrationHost(rNode: RNode): Error {
  const header = 'The `ngSkipHydration` flag is applied on a node ' +
      'that doesn\'t act as a component host. Hydration can be ' +
      'skipped only on per-component basis.\n\n';
  const actual = `${describeDomFromNode(rNode)}\n\n`;
  const footer = 'Please move the `ngSkipHydration` attribute to the component host element.\n\n';
  const message = header + actual + footer;
  return new RuntimeError(RuntimeErrorCode.INVALID_SKIP_HYDRATION_HOST, message);
}

// Stringification methods

/**
 * Stringifies a given TNode's attributes
 *
 * 字符串化给定 TNode 的属性
 *
 * @param tNode a provided TNode
 *
 * 提供的 TNode
 *
 * @returns string
 */
function stringifyTNodeAttrs(tNode: TNode): string {
  const results = [];
  if (tNode.attrs) {
    for (let i = 0; i < tNode.attrs.length;) {
      const attrName = tNode.attrs[i++];
      // Once we reach the first flag, we know that the list of
      // attributes is over.
      if (typeof attrName == 'number') {
        break;
      }
      const attrValue = tNode.attrs[i++];
      results.push(`${attrName}="${shorten(attrValue as string)}"`);
    }
  }
  return results.join(' ');
}

/**
 * The list of internal attributes that should be filtered out while
 * producing an error message.
 *
 * 生成错误消息时应过滤掉的内部属性列表。
 *
 */
const internalAttrs = new Set(['ngh', 'ng-version', 'ng-server-context']);

/**
 * Stringifies an HTML Element's attributes
 *
 * 字符串化 HTML 元素的属性
 *
 * @param rNode an HTML Element
 *
 * 一个 HTML 元素
 *
 * @returns string
 */
function stringifyRNodeAttrs(rNode: HTMLElement): string {
  const results = [];
  for (let i = 0; i < rNode.attributes.length; i++) {
    const attr = rNode.attributes[i];
    if (internalAttrs.has(attr.name)) continue;
    results.push(`${attr.name}="${shorten(attr.value)}"`);
  }
  return results.join(' ');
}

// Methods for Describing the DOM

/**
 * Converts a tNode to a helpful readable string value for use in error messages
 *
 * 将 tNode 转换为有用的可读字符串值，以便在错误消息中使用
 *
 * @param tNode a given TNode
 *
 * 给定的 TNode
 *
 * @param innerContent the content of the node
 *
 * 节点的内容
 *
 * @returns string
 */
function describeTNode(tNode: TNode, innerContent: string = '…'): string {
  switch (tNode.type) {
    case TNodeType.Text:
      const content = tNode.value ? `(${tNode.value})` : '';
      return `#text${content}`;
    case TNodeType.Element:
      const attrs = stringifyTNodeAttrs(tNode);
      const tag = tNode.value.toLowerCase();
      return `<${tag}${attrs ? ' ' + attrs : ''}>${innerContent}</${tag}>`;
    case TNodeType.ElementContainer:
      return '<!-- ng-container -->';
    case TNodeType.Container:
      return '<!-- container -->';
    default:
      const typeAsString = getFriendlyStringFromTNodeType(tNode.type);
      return `#node(${typeAsString})`;
  }
}

/**
 * Converts an RNode to a helpful readable string value for use in error messages
 *
 * 将 RNode 转换为有用的可读字符串值，以便在错误消息中使用
 *
 * @param rNode a given RNode
 *
 * 给定的 RNode
 *
 * @param innerContent the content of the node
 *
 * 节点的内容
 *
 * @returns string
 */
function describeRNode(rNode: RNode, innerContent: string = '…'): string {
  const node = rNode as HTMLElement;
  switch (node.nodeType) {
    case Node.ELEMENT_NODE:
      const tag = node.tagName!.toLowerCase();
      const attrs = stringifyRNodeAttrs(node);
      return `<${tag}${attrs ? ' ' + attrs : ''}>${innerContent}</${tag}>`;
    case Node.TEXT_NODE:
      const content = node.textContent ? shorten(node.textContent) : '';
      return `#text${content ? `(${content})` : ''}`;
    case Node.COMMENT_NODE:
      return `<!-- ${shorten(node.textContent ?? '')} -->`;
    default:
      return `#node(${node.nodeType})`;
  }
}

/**
 * Builds the string containing the expected DOM present given the LView and TNode
 * values for a readable error message
 *
 * 在给定可读错误消息的 LView 和 TNode 值的情况下，构建包含预期 DOM 的字符串
 *
 * @param lView the lView containing the DOM
 *
 * 包含 DOM 的 lView
 *
 * @param tNode the tNode
 *
 * t 节点
 *
 * @param isViewContainerAnchor boolean
 *
 * 。【模糊翻译】【模糊翻译】
 *
 * @returns string
 */
function describeExpectedDom(lView: LView, tNode: TNode, isViewContainerAnchor: boolean): string {
  const spacer = '  ';
  let content = '';
  if (tNode.prev) {
    content += spacer + '…\n';
    content += spacer + describeTNode(tNode.prev) + '\n';
  } else if (tNode.type && tNode.type & TNodeType.AnyContainer) {
    content += spacer + '…\n';
  }
  if (isViewContainerAnchor) {
    content += spacer + describeTNode(tNode) + '\n';
    content += spacer + `<!-- container -->  ${AT_THIS_LOCATION}\n`;
  } else {
    content += spacer + describeTNode(tNode) + `  ${AT_THIS_LOCATION}\n`;
  }
  content += spacer + '…\n';

  const parentRNode = tNode.type ? getParentRElement(lView[TVIEW], tNode, lView) : null;
  if (parentRNode) {
    content = describeRNode(parentRNode as unknown as Node, '\n' + content);
  }
  return content;
}

/**
 * Builds the string containing the DOM present around a given RNode for a
 * readable error message
 *
 * 为可读的错误消息构建包含给定 RNode 周围存在的 DOM 的字符串
 *
 * @param node the RNode
 *
 * 节点
 *
 * @returns string
 */
function describeDomFromNode(node: RNode): string {
  const spacer = '  ';
  let content = '';
  const currentNode = node as HTMLElement;
  if (currentNode.previousSibling) {
    content += spacer + '…\n';
    content += spacer + describeRNode(currentNode.previousSibling) + '\n';
  }
  content += spacer + describeRNode(currentNode) + `  ${AT_THIS_LOCATION}\n`;
  if (node.nextSibling) {
    content += spacer + '…\n';
  }
  if (node.parentNode) {
    content = describeRNode(currentNode.parentNode as Node, '\n' + content);
  }
  return content;
}

/**
 * Shortens the description of a given RNode by its type for readability
 *
 * 按类型缩短给定 RNode 的描述以提高可读性
 *
 * @param nodeType the type of node
 *
 * 节点类型
 *
 * @param tagName the node tag name
 *
 * 节点标签名称
 *
 * @param textContent the text content in the node
 *
 * 节点中的文本内容
 *
 * @returns string
 */
function shortRNodeDescription(
    nodeType: number, tagName: string|null, textContent: string|null): string {
  switch (nodeType) {
    case Node.ELEMENT_NODE:
      return `<${tagName!.toLowerCase()}>`;
    case Node.TEXT_NODE:
      const content = textContent ? ` (with the "${shorten(textContent)}" content)` : '';
      return `a text node${content}`;
    case Node.COMMENT_NODE:
      return 'a comment node';
    default:
      return `#node(nodeType=${nodeType})`;
  }
}


/**
 * Builds the footer hydration error message
 *
 * 构建页脚水合作用错误消息
 *
 * @param componentClassName the name of the component class
 *
 * 组件类的名称
 *
 * @returns string
 */
function getHydrationErrorFooter(componentClassName?: string): string {
  const componentInfo = componentClassName ? `the "${componentClassName}"` : 'corresponding';
  return `To fix this problem:\n` +
      `  * check ${componentInfo} component for hydration-related issues\n` +
      `  * check to see if your template has valid HTML structure\n` +
      `  * or skip hydration by adding the \`ngSkipHydration\` attribute ` +
      `to its host node in a template\n\n`;
}

/**
 * An attribute related note for hydration errors
 *
 * 水合作用错误的属性相关注释
 *
 */
function getHydrationAttributeNote(): string {
  return 'Note: attributes are only displayed to better represent the DOM' +
      ' but have no effect on hydration mismatches.\n\n';
}

// Node string utility functions

/**
 * Strips all newlines out of a given string
 *
 * 从给定字符串中去除所有换行符
 *
 * @param input a string to be cleared of new line characters
 *
 * 要清除换行符的字符串
 *
 * @returns
 */
function stripNewlines(input: string): string {
  return input.replace(/\s+/gm, '');
}

/**
 * Reduces a string down to a maximum length of characters with ellipsis for readability
 *
 * 使用省略号将字符串减少到最大字符长度以提高可读性
 *
 * @param input a string input
 *
 * 字符串输入
 *
 * @param maxLength a maximum length in characters
 *
 * 字符的最大长度
 *
 * @returns string
 */
function shorten(input: string|null, maxLength = 50): string {
  if (!input) {
    return '';
  }
  input = stripNewlines(input);
  return input.length > maxLength ? `${input.substring(0, maxLength - 1)}…` : input;
}

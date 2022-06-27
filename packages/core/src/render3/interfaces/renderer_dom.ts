/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {TrustedHTML, TrustedScript, TrustedScriptURL} from '../../util/security/trusted_type_defs';

/**
 * The goal here is to make sure that the browser DOM API is the Renderer.
 * We do this by defining a subset of DOM API to be the renderer and then
 * use that at runtime for rendering.
 *
 * 这里的目标是确保浏览器 DOM API 是 Renderer。我们通过定义 DOM API
 * 的一个子集作为渲染器，然后在运行时使用它进行渲染来实现。
 *
 * At runtime we can then use the DOM api directly, in server or web-worker
 * it will be easy to implement such API.
 *
 * 然后在运行时，我们可以直接使用 DOM api，在服务器或 Web-worker 中很容易实现这样的 API。
 *
 */

/**
 * Subset of API needed for appending elements and text nodes.
 *
 * 附加元素和文本节点所需的 API 子集。
 *
 */
export interface RNode {
  /**
   * Returns the parent Element, Document, or DocumentFragment
   *
   * 返回父 Element、Document 或 DocumentFragment
   *
   */
  parentNode: RNode|null;


  /**
   * Returns the parent Element if there is one
   *
   * 如果有父元素，则返回
   *
   */
  parentElement: RElement|null;

  /**
   * Gets the Node immediately following this one in the parent's childNodes
   *
   * 获取父级的 childNodes 中紧跟此的 Node
   *
   */
  nextSibling: RNode|null;

  /**
   * Removes a child from the current node and returns the removed node
   *
   * 从当前节点中删除子项并返回被删除的节点
   *
   * @param oldChild the child node to remove
   *
   * 要删除的子节点
   *
   */
  removeChild(oldChild: RNode): RNode;

  /**
   * Insert a child node.
   *
   * 插入子节点。
   *
   * Used exclusively for adding View root nodes into ViewAnchor location.
   *
   * 专门用于将 View 根节点添加到 ViewAnchor 位置。
   *
   */
  insertBefore(newChild: RNode, refChild: RNode|null, isViewRoot: boolean): void;

  /**
   * Append a child node.
   *
   * 附加一个子节点。
   *
   * Used exclusively for building up DOM which are static (ie not View roots)
   *
   * 专门用于构建静态 DOM（即不是 View 根）
   *
   */
  appendChild(newChild: RNode): RNode;
}

/**
 * Subset of API needed for writing attributes, properties, and setting up
 * listeners on Element.
 *
 * 在 Element 上编写属性、属性和设置侦听器所需的 API 子集。
 *
 */
export interface RElement extends RNode {
  style: RCssStyleDeclaration;
  classList: RDomTokenList;
  className: string;
  tagName: string;
  textContent: string|null;
  setAttribute(name: string, value: string|TrustedHTML|TrustedScript|TrustedScriptURL): void;
  removeAttribute(name: string): void;
  setAttributeNS(
      namespaceURI: string, qualifiedName: string,
      value: string|TrustedHTML|TrustedScript|TrustedScriptURL): void;
  addEventListener(type: string, listener: EventListener, useCapture?: boolean): void;
  removeEventListener(type: string, listener?: EventListener, options?: boolean): void;

  setProperty?(name: string, value: any): void;
}

export interface RCssStyleDeclaration {
  removeProperty(propertyName: string): string;
  setProperty(propertyName: string, value: string|null, priority?: string): void;
}

export interface RDomTokenList {
  add(token: string): void;
  remove(token: string): void;
}

export interface RText extends RNode {
  textContent: string|null;
}

export interface RComment extends RNode {
  textContent: string|null;
}

export interface RTemplate extends RElement {
  tagName: 'TEMPLATE';
  content: RNode;
}

// Note: This hack is necessary so we don't erroneously get a circular dependency
// failure based on types.
export const unusedValueExportToPlacateAjd = 1;

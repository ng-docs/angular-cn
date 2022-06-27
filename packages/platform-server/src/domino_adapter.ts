/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ɵsetRootDomAdapter as setRootDomAdapter} from '@angular/common';
import {ɵBrowserDomAdapter as BrowserDomAdapter} from '@angular/platform-browser';
import * as domino from 'domino';

export function setDomTypes() {
  // Make all Domino types available in the global env.
  Object.assign(global, domino.impl);
  (global as any)['KeyboardEvent'] = domino.impl.Event;
}

/**
 * Parses a document string to a Document object.
 *
 * 将文档字符串解析为 Document 对象。
 *
 */
export function parseDocument(html: string, url = '/') {
  let window = domino.createWindow(html, url);
  let doc = window.document;
  return doc;
}

/**
 * Serializes a document to string.
 *
 * 将文档序列化为字符串。
 *
 */
export function serializeDocument(doc: Document): string {
  return (doc as any).serialize();
}

/**
 * DOM Adapter for the server platform based on <https://github.com/fgnass/domino>.
 *
 * 基于<https://github.com/fgnass/domino>的服务器平台的 DOM 适配器。
 *
 */
export class DominoAdapter extends BrowserDomAdapter {
  static override makeCurrent() {
    setDomTypes();
    setRootDomAdapter(new DominoAdapter());
  }

  override readonly supportsDOMEvents = false;
  private static defaultDoc: Document;

  override createHtmlDocument(): Document {
    return parseDocument('<html><head><title>fakeTitle</title></head><body></body></html>');
  }

  override getDefaultDocument(): Document {
    if (!DominoAdapter.defaultDoc) {
      DominoAdapter.defaultDoc = domino.createDocument();
    }
    return DominoAdapter.defaultDoc;
  }

  override isElementNode(node: any): boolean {
    return node ? node.nodeType === DominoAdapter.defaultDoc.ELEMENT_NODE : false;
  }
  override isShadowRoot(node: any): boolean {
    return node.shadowRoot == node;
  }

  /**
   * @deprecated
   *
   * No longer being used in Ivy code. To be removed in version 14.
   *
   * 不再在 Ivy 代码中使用。要在版本 14 中删除。
   *
   */
  override getGlobalEventTarget(doc: Document, target: string): EventTarget|null {
    if (target === 'window') {
      return doc.defaultView;
    }
    if (target === 'document') {
      return doc;
    }
    if (target === 'body') {
      return doc.body;
    }
    return null;
  }

  override getBaseHref(doc: Document): string {
    // TODO(alxhub): Need relative path logic from BrowserDomAdapter here?
    return doc.documentElement!.querySelector('base')?.getAttribute('href') || '';
  }

  override dispatchEvent(el: Node, evt: any) {
    el.dispatchEvent(evt);

    // Dispatch the event to the window also.
    const doc = el.ownerDocument || el;
    const win = (doc as any).defaultView;
    if (win) {
      win.dispatchEvent(evt);
    }
  }

  override getUserAgent(): string {
    return 'Fake user agent';
  }

  override getCookie(name: string): string {
    throw new Error('getCookie has not been implemented');
  }
}

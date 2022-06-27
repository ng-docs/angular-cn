/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {trustedHTMLFromString} from '../util/security/trusted_types';

/**
 * This helper is used to get hold of an inert tree of DOM elements containing dirty HTML
 * that needs sanitizing.
 * Depending upon browser support we use one of two strategies for doing this.
 * Default: DOMParser strategy
 * Fallback: InertDocument strategy
 *
 * 此帮助器用于获取包含需要清理的脏 HTML 的 DOM
 * 元素的惰性树。根据浏览器的支持，我们会使用两种策略之一来执行此操作。默认： DOMParser 策略 后备：
 * InertDocument 策略
 *
 */
export function getInertBodyHelper(defaultDoc: Document): InertBodyHelper {
  const inertDocumentHelper = new InertDocumentHelper(defaultDoc);
  return isDOMParserAvailable() ? new DOMParserHelper(inertDocumentHelper) : inertDocumentHelper;
}

export interface InertBodyHelper {
  /**
   * Get an inert DOM element containing DOM created from the dirty HTML string provided.
   *
   * 获取一个包含从提供的脏 HTML 字符串创建的 DOM 的惰性 DOM 元素。
   *
   */
  getInertBodyElement: (html: string) => HTMLElement | null;
}

/**
 * Uses DOMParser to create and fill an inert body element.
 * This is the default strategy used in browsers that support it.
 *
 * 使用 DOMParser 来创建和填充惰性 body 元素。这是支持它的浏览器中使用的默认策略。
 *
 */
class DOMParserHelper implements InertBodyHelper {
  constructor(private inertDocumentHelper: InertBodyHelper) {}

  getInertBodyElement(html: string): HTMLElement|null {
    // We add these extra elements to ensure that the rest of the content is parsed as expected
    // e.g. leading whitespace is maintained and tags like `<meta>` do not get hoisted to the
    // `<head>` tag. Note that the `<body>` tag is closed implicitly to prevent unclosed tags
    // in `html` from consuming the otherwise explicit `</body>` tag.
    html = '<body><remove></remove>' + html;
    try {
      const body = new window.DOMParser()
                       .parseFromString(trustedHTMLFromString(html) as string, 'text/html')
                       .body as HTMLBodyElement;
      if (body === null) {
        // In some browsers (e.g. Mozilla/5.0 iPad AppleWebKit Mobile) the `body` property only
        // becomes available in the following tick of the JS engine. In that case we fall back to
        // the `inertDocumentHelper` instead.
        return this.inertDocumentHelper.getInertBodyElement(html);
      }
      body.removeChild(body.firstChild!);
      return body;
    } catch {
      return null;
    }
  }
}

/**
 * Use an HTML5 `template` element, if supported, or an inert body element created via
 * `createHtmlDocument` to create and fill an inert DOM element.
 * This is the fallback strategy if the browser does not support DOMParser.
 *
 * 使用 HTML5 `template` 元素（如果支持）或通过 `createHtmlDocument` 创建的惰性 body
 * 元素来创建和填充 DOM 元素。如果浏览器不支持 DOMParser，这是后备策略。
 *
 */
class InertDocumentHelper implements InertBodyHelper {
  private inertDocument: Document;

  constructor(private defaultDoc: Document) {
    this.inertDocument = this.defaultDoc.implementation.createHTMLDocument('sanitization-inert');

    if (this.inertDocument.body == null) {
      // usually there should be only one body element in the document, but IE doesn't have any, so
      // we need to create one.
      const inertHtml = this.inertDocument.createElement('html');
      this.inertDocument.appendChild(inertHtml);
      const inertBodyElement = this.inertDocument.createElement('body');
      inertHtml.appendChild(inertBodyElement);
    }
  }

  getInertBodyElement(html: string): HTMLElement|null {
    // Prefer using <template> element if supported.
    const templateEl = this.inertDocument.createElement('template');
    if ('content' in templateEl) {
      templateEl.innerHTML = trustedHTMLFromString(html) as string;
      return templateEl;
    }

    // Note that previously we used to do something like `this.inertDocument.body.innerHTML = html`
    // and we returned the inert `body` node. This was changed, because IE seems to treat setting
    // `innerHTML` on an inserted element differently, compared to one that hasn't been inserted
    // yet. In particular, IE appears to split some of the text into multiple text nodes rather
    // than keeping them in a single one which ends up messing with Ivy's i18n parsing further
    // down the line. This has been worked around by creating a new inert `body` and using it as
    // the root node in which we insert the HTML.
    const inertBody = this.inertDocument.createElement('body');
    inertBody.innerHTML = trustedHTMLFromString(html) as string;

    // Support: IE 11 only
    // strip custom-namespaced attributes on IE<=11
    if ((this.defaultDoc as any).documentMode) {
      this.stripCustomNsAttrs(inertBody);
    }

    return inertBody;
  }

  /**
   * When IE11 comes across an unknown namespaced attribute e.g. 'xlink:foo' it adds 'xmlns:ns1'
   * attribute to declare ns1 namespace and prefixes the attribute with 'ns1' (e.g.
   * 'ns1:xlink:foo').
   *
   * 当 IE11 遇到未知的命名空间属性时，例如“xlink:foo”，它会添加“xmlns:ns1”属性以声明 ns1
   * 命名空间，并以“ns1”为属性（例如“ns1:xlink:foo”）。
   *
   * This is undesirable since we don't want to allow any of these custom attributes. This method
   * strips them all.
   *
   * 这是不可取的，因为我们不想允许任何这些自定义属性。这种方法会剥离它们。
   *
   */
  private stripCustomNsAttrs(el: Element) {
    const elAttrs = el.attributes;
    // loop backwards so that we can support removals.
    for (let i = elAttrs.length - 1; 0 < i; i--) {
      const attrib = elAttrs.item(i);
      const attrName = attrib!.name;
      if (attrName === 'xmlns:ns1' || attrName.indexOf('ns1:') === 0) {
        el.removeAttribute(attrName);
      }
    }
    let childNode = el.firstChild as Node | null;
    while (childNode) {
      if (childNode.nodeType === Node.ELEMENT_NODE) this.stripCustomNsAttrs(childNode as Element);
      childNode = childNode.nextSibling;
    }
  }
}

/**
 * We need to determine whether the DOMParser exists in the global context and
 * supports parsing HTML; HTML parsing support is not as wide as other formats, see
 * <https://developer.mozilla.org/en-US/docs/Web/API/DOMParser#Browser_compatibility>.
 *
 * 我们需要确定 DOMParser 是否存在于全局上下文中并支持解析 HTML； HTML
 * 解析支持不如其他格式广泛，请参阅<https://developer.mozilla.org/en-US/docs/Web/API/DOMParser#Browser_compatibility>
 * 。
 *
 * @suppress {uselessCode}
 */
export function isDOMParserAvailable() {
  try {
    return !!new window.DOMParser().parseFromString(
        trustedHTMLFromString('') as string, 'text/html');
  } catch {
    return false;
  }
}

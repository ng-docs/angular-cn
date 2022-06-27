/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ɵɵdefineInjectable, ɵɵinject} from '@angular/core';

import {DOCUMENT} from './dom_tokens';



/**
 * Defines a scroll position manager. Implemented by `BrowserViewportScroller`.
 *
 * 定义滚动位置管理器。由 `BrowserViewportScroller` 实现。
 *
 * @publicApi
 */
export abstract class ViewportScroller {
  // De-sugared tree-shakable injection
  // See #23917
  /** @nocollapse */
  static ɵprov = /** @pureOrBreakMyCode */ ɵɵdefineInjectable({
    token: ViewportScroller,
    providedIn: 'root',
    factory: () => new BrowserViewportScroller(ɵɵinject(DOCUMENT), window)
  });

  /**
   * Configures the top offset used when scrolling to an anchor.
   *
   * 配置滚动到锚点时使用的顶部偏移量。
   *
   * @param offset A position in screen coordinates (a tuple with x and y values)
   * or a function that returns the top offset position.
   *
   * 屏幕坐标中的位置（具有 x 和 y 值的元组）或返回顶部偏移位置的函数。
   *
   */
  abstract setOffset(offset: [number, number]|(() => [number, number])): void;

  /**
   * Retrieves the current scroll position.
   *
   * 检索当前滚动位置。
   *
   * @returns A position in screen coordinates (a tuple with x and y values).
   *
   * 屏幕坐标中的位置（具有 x 和 y 值的元组）。
   *
   */
  abstract getScrollPosition(): [number, number];

  /**
   * Scrolls to a specified position.
   *
   * 滚动到指定位置。
   *
   * @param position A position in screen coordinates (a tuple with x and y values).
   *
   * 屏幕坐标中的位置（具有 x 和 y 值的元组）。
   *
   */
  abstract scrollToPosition(position: [number, number]): void;

  /**
   * Scrolls to an anchor element.
   *
   * 滚动到锚点元素。
   *
   * @param anchor The ID of the anchor element.
   *
   * 锚点元素的 ID。
   *
   */
  abstract scrollToAnchor(anchor: string): void;

  /**
   * Disables automatic scroll restoration provided by the browser.
   * See also [window.history.scrollRestoration
   * info](https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration).
   *
   * 禁用浏览器提供的自动滚动恢复功能。另请参见 [window.history.scrollRestoration
   * 信息](https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration)。
   *
   */
  abstract setHistoryScrollRestoration(scrollRestoration: 'auto'|'manual'): void;
}

/**
 * Manages the scroll position for a browser window.
 *
 * 管理浏览器窗口的滚动位置。
 *
 */
export class BrowserViewportScroller implements ViewportScroller {
  private offset: () => [number, number] = () => [0, 0];

  constructor(private document: Document, private window: Window) {}

  /**
   * Configures the top offset used when scrolling to an anchor.
   *
   * 配置滚动到锚点时使用的顶部偏移量。
   *
   * @param offset A position in screen coordinates (a tuple with x and y values)
   * or a function that returns the top offset position.
   *
   * 屏幕坐标中的位置（具有 x 和 y 值的元组）或返回顶部偏移位置的函数。
   *
   */
  setOffset(offset: [number, number]|(() => [number, number])): void {
    if (Array.isArray(offset)) {
      this.offset = () => offset;
    } else {
      this.offset = offset;
    }
  }

  /**
   * Retrieves the current scroll position.
   *
   * 检索当前的滚动位置。
   *
   * @returns
   *
   * The position in screen coordinates.
   *
   * 屏幕坐标中的位置。
   *
   */
  getScrollPosition(): [number, number] {
    if (this.supportsScrolling()) {
      return [this.window.pageXOffset, this.window.pageYOffset];
    } else {
      return [0, 0];
    }
  }

  /**
   * Sets the scroll position.
   *
   * 设置滚动位置。
   *
   * @param position The new position in screen coordinates.
   *
   * 屏幕坐标中的新位置。
   *
   */
  scrollToPosition(position: [number, number]): void {
    if (this.supportsScrolling()) {
      this.window.scrollTo(position[0], position[1]);
    }
  }

  /**
   * Scrolls to an element and attempts to focus the element.
   *
   * 滚动到一个元素并尝试聚焦该元素。
   *
   * Note that the function name here is misleading in that the target string may be an ID for a
   * non-anchor element.
   *
   * 请注意，这里的函数名具有误导性，因为目标字符串可能是非锚元素的 ID。
   *
   * @param target The ID of an element or name of the anchor.
   *
   * 元素的 ID 或锚点的名称。
   *
   * @see <https://html.spec.whatwg.org/#the-indicated-part-of-the-document>
   *
   * @see <https://html.spec.whatwg.org/#scroll-to-fragid>
   *
   */
  scrollToAnchor(target: string): void {
    if (!this.supportsScrolling()) {
      return;
    }

    const elSelected = findAnchorFromDocument(this.document, target);

    if (elSelected) {
      this.scrollToElement(elSelected);
      // After scrolling to the element, the spec dictates that we follow the focus steps for the
      // target. Rather than following the robust steps, simply attempt focus.
      //
      // @see https://html.spec.whatwg.org/#get-the-focusable-area
      // @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/focus
      // @see https://html.spec.whatwg.org/#focusable-area
      elSelected.focus();
    }
  }

  /**
   * Disables automatic scroll restoration provided by the browser.
   *
   * 禁用浏览器提供的自动滚动恢复。
   *
   */
  setHistoryScrollRestoration(scrollRestoration: 'auto'|'manual'): void {
    if (this.supportScrollRestoration()) {
      const history = this.window.history;
      if (history && history.scrollRestoration) {
        history.scrollRestoration = scrollRestoration;
      }
    }
  }

  /**
   * Scrolls to an element using the native offset and the specified offset set on this scroller.
   *
   * 使用本机偏移量和此滚动器上设置的指定偏移量滚动到一个元素。
   *
   * The offset can be used when we know that there is a floating header and scrolling naively to an
   * element (ex: `scrollIntoView`) leaves the element hidden behind the floating header.
   *
   * 当我们知道有一个浮动标头并且天真滚动到一个元素（例如： `scrollIntoView`
   * ）使该元素隐藏在浮动标头后面时，可以用此偏移量。
   *
   */
  private scrollToElement(el: HTMLElement): void {
    const rect = el.getBoundingClientRect();
    const left = rect.left + this.window.pageXOffset;
    const top = rect.top + this.window.pageYOffset;
    const offset = this.offset();
    this.window.scrollTo(left - offset[0], top - offset[1]);
  }

  /**
   * We only support scroll restoration when we can get a hold of window.
   * This means that we do not support this behavior when running in a web worker.
   *
   * 我们仅在可以获得窗口时支持滚动恢复。这意味着我们在 Web Worker 中运行时不支持此行为。
   *
   * Lifting this restriction right now would require more changes in the dom adapter.
   * Since webworkers aren't widely used, we will lift it once RouterScroller is
   * battle-tested.
   *
   * 现在取消此限制将需要对 dom 适配器进行更多更改。由于 Webworkers 并没有被广泛使用，因此我们将在
   * RouterScroller 经过实战测试后解除它。
   *
   */
  private supportScrollRestoration(): boolean {
    try {
      if (!this.supportsScrolling()) {
        return false;
      }
      // The `scrollRestoration` property could be on the `history` instance or its prototype.
      const scrollRestorationDescriptor = getScrollRestorationProperty(this.window.history) ||
          getScrollRestorationProperty(Object.getPrototypeOf(this.window.history));
      // We can write to the `scrollRestoration` property if it is a writable data field or it has a
      // setter function.
      return !!scrollRestorationDescriptor &&
          !!(scrollRestorationDescriptor.writable || scrollRestorationDescriptor.set);
    } catch {
      return false;
    }
  }

  private supportsScrolling(): boolean {
    try {
      return !!this.window && !!this.window.scrollTo && 'pageXOffset' in this.window;
    } catch {
      return false;
    }
  }
}

function getScrollRestorationProperty(obj: any): PropertyDescriptor|undefined {
  return Object.getOwnPropertyDescriptor(obj, 'scrollRestoration');
}

function findAnchorFromDocument(document: Document, target: string): HTMLElement|null {
  const documentResult = document.getElementById(target) || document.getElementsByName(target)[0];

  if (documentResult) {
    return documentResult;
  }

  // `getElementById` and `getElementsByName` won't pierce through the shadow DOM so we
  // have to traverse the DOM manually and do the lookup through the shadow roots.
  if (typeof document.createTreeWalker === 'function' && document.body &&
      ((document.body as any).createShadowRoot || document.body.attachShadow)) {
    const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    let currentNode = treeWalker.currentNode as HTMLElement | null;

    while (currentNode) {
      const shadowRoot = currentNode.shadowRoot;

      if (shadowRoot) {
        // Note that `ShadowRoot` doesn't support `getElementsByName`
        // so we have to fall back to `querySelector`.
        const result =
            shadowRoot.getElementById(target) || shadowRoot.querySelector(`[name="${target}"]`);
        if (result) {
          return result;
        }
      }

      currentNode = treeWalker.nextNode() as HTMLElement | null;
    }
  }

  return null;
}

/**
 * Provides an empty implementation of the viewport scroller.
 *
 * 提供视口滚动器的空实现。
 *
 */
export class NullViewportScroller implements ViewportScroller {
  /**
   * Empty implementation
   *
   * 空实现
   *
   */
  setOffset(offset: [number, number]|(() => [number, number])): void {}

  /**
   * Empty implementation
   *
   * 空实现
   *
   */
  getScrollPosition(): [number, number] {
    return [0, 0];
  }

  /**
   * Empty implementation
   *
   * 空实现
   *
   */
  scrollToPosition(position: [number, number]): void {}

  /**
   * Empty implementation
   *
   * 空实现
   *
   */
  scrollToAnchor(anchor: string): void {}

  /**
   * Empty implementation
   *
   * 空实现
   *
   */
  setHistoryScrollRestoration(scrollRestoration: 'auto'|'manual'): void {}
}

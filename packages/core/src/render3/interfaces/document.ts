/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Most of the use of `document` in Angular is from within the DI system so it is possible to simply
 * inject the `DOCUMENT` token and are done.
 *
 * Angular 中 `document` 的大多数使用都是来自 DI 系统中的，因此可以简单地注入 `DOCUMENT`
 * 标记并完成。
 *
 * Ivy is special because it does not rely upon the DI and must get hold of the document some other
 * way.
 *
 * Ivy 很特殊，因为它不依赖 DI，并且必须以其他方式获取文档。
 *
 * The solution is to define `getDocument()` and `setDocument()` top-level functions for ivy.
 * Wherever ivy needs the global document, it calls `getDocument()` instead.
 *
 * 解决方案是为 ivy 定义 `getDocument()` 和 `setDocument()` 顶级函数。无论 ivy
 * 需要全局文档，它都会改为调用 `getDocument()` 。
 *
 * When running ivy outside of a browser environment, it is necessary to call `setDocument()` to
 * tell ivy what the global `document` is.
 *
 * 在浏览器环境之外运行 ivy 时，有必要调用 `setDocument()` 来告诉 ivy 全局 `document` 是什么。
 *
 * Angular does this for us in each of the standard platforms (`Browser`, `Server`, and `WebWorker`)
 * by calling `setDocument()` when providing the `DOCUMENT` token.
 *
 * Angular 在每个标准平台（ `Browser` 、 `Server` 和 `WebWorker` ）中通过在提供 `DOCUMENT`
 * 标记时调用 `setDocument()` 来为我们完成此操作。
 *
 */
let DOCUMENT: Document|undefined = undefined;

/**
 * Tell ivy what the `document` is for this platform.
 *
 * 告诉 ivy 这个平台的 `document` 是什么。
 *
 * It is only necessary to call this if the current platform is not a browser.
 *
 * 只有在当前平台不是浏览器时才需要调用它。
 *
 * @param document The object representing the global `document` in this environment.
 *
 * 表示此环境中的全局 `document` 的对象。
 *
 */
export function setDocument(document: Document|undefined): void {
  DOCUMENT = document;
}

/**
 * Access the object that represents the `document` for this platform.
 *
 * 访问表示此平台的 `document` 的对象。
 *
 * Ivy calls this whenever it needs to access the `document` object.
 * For example to create the renderer or to do sanitization.
 *
 * Ivy 每当需要访问 `document` 对象时都会调用它。例如，创建渲染器或进行清理。
 *
 */
export function getDocument(): Document {
  if (DOCUMENT !== undefined) {
    return DOCUMENT;
  } else if (typeof document !== 'undefined') {
    return document;
  }
  // No "document" can be found. This should only happen if we are running ivy outside Angular and
  // the current platform is not a browser. Since this is not a supported scenario at the moment
  // this should not happen in Angular apps.
  // Once we support running ivy outside of Angular we will need to publish `setDocument()` as a
  // public API. Meanwhile we just return `undefined` and let the application fail.
  return undefined!;
}

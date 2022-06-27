/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * DOMAnimation represents the Animation Web API.
 *
 * DOMAnimation 表示动画 Web API。
 *
 * It is an external API by the browser, and must thus use "declare interface",
 * to prevent renaming by Closure Compiler.
 *
 * 它是浏览器的外部 API，因此必须使用“声明接口”，以防止被 Closure Compiler 重命名。
 *
 * @see <https://developer.mozilla.org/de/docs/Web/API/Animation>
 *
 */
export declare interface DOMAnimation {
  cancel(): void;
  play(): void;
  pause(): void;
  finish(): void;
  onfinish: Function;
  position: number;
  currentTime: number;
  addEventListener(eventName: string, handler: (event: any) => any): any;
  dispatchEvent(eventName: string): any;
}

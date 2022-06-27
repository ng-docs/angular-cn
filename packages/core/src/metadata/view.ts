/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Defines the CSS styles encapsulation policies for the {@link Component} decorator's
 * `encapsulation` option.
 *
 * 定义可用于 Component 的 {@link Component} 的模板和样式封装选项。
 *
 * See {@link Component#encapsulation encapsulation}.
 *
 * 请参阅 {@link Component#encapsulation encapsulation}。
 *
 * @usageNotes
 *
 * ### Example
 *
 * ### 例子
 *
 * {@example core/ts/metadata/encapsulation.ts region='longform'}
 *
 * @publicApi
 */
export enum ViewEncapsulation {
  // TODO: consider making `ViewEncapsulation` a `const enum` instead. See
  // https://github.com/angular/angular/issues/44119 for additional information.

  /**
   * Emulates a native Shadow DOM encapsulation behavior by adding a specific attribute to the
   * component's host element and applying the same attribute to all the CSS selectors provided
   * via {@link Component#styles styles} or {@link Component#styleUrls styleUrls}.
   *
   * 通过向宿主元素添加包含替代 ID 的属性并预处理通过 {@link Component#styles styles} 或 {@link
   * Component#styleUrls styleUrls} 提供的样式规则，来模拟 `Native` 所有选择器。
   *
   * This is the default option.
   *
   * 这是默认选项。
   */
  Emulated = 0,

  // Historically the 1 value was for `Native` encapsulation which has been removed as of v11.

  /**
   * Doesn't provide any sort of CSS style encapsulation, meaning that all the styles provided
   * via {@link Component#styles styles} or {@link Component#styleUrls styleUrls} are applicable
   * to any HTML element of the application regardless of their host Component.
   *
   * 不要提供任何模板或样式封装。
   *
   */
  None = 2,

  /**
   * Uses the browser's native Shadow DOM API to encapsulate CSS styles, meaning that it creates
   * a ShadowRoot for the component's host element which is then used to encapsulate
   * all the Component's styling.
   *
   * 使用浏览器的本机 Shadow DOM API 来封装 CSS 样式，这意味着它会为组件的宿主元素创建一个
   * ShadowRoot，然后用该元素来封装所有组件的样式。
   *
   */
  ShadowDom = 3
}

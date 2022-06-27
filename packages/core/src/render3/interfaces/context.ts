/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


import {getLViewById} from './lview_tracking';
import {RNode} from './renderer_dom';
import {LView} from './view';


/**
 * The internal view context which is specific to a given DOM element, directive or
 * component instance. Each value in here (besides the LView and element node details)
 * can be present, null or undefined. If undefined then it implies the value has not been
 * looked up yet, otherwise, if null, then a lookup was executed and nothing was found.
 *
 * 特定于给定 DOM 元素、指令或组件实例的内部视图上下文。此处的每个值（除了 LView
 * 和元素节点详细信息之外）都可以存在、 null 或
 * undefined。如果未定义，则表示该值尚未被查找，否则，如果为 null ，则执行查找并且没有找到任何内容。
 *
 * Each value will get filled when the respective value is examined within the getContext
 * function. The component, element and each directive instance will share the same instance
 * of the context.
 *
 * 在 getContext
 * 函数中检查各自的值时，每个值都将被填充。组件、元素和每个指令实例将共享同一个上下文实例。
 *
 */
export class LContext {
  /**
   * The instance of the Component node.
   *
   * Component 节点的实例。
   *
   */
  public component: {}|null|undefined;

  /**
   * The list of active directives that exist on this element.
   *
   * 此元素上存在的活动指令的列表。
   *
   */
  public directives: any[]|null|undefined;

  /**
   * The map of local references (local reference name => element or directive instance) that
   * exist on this element.
   *
   * 此元素上存在的本地引用（本地引用名称 => 元素或指令实例）的映射。
   *
   */
  public localRefs: {[key: string]: any}|null|undefined;

  /**
   * Component's parent view data.
   *
   * 组件的父视图数据。
   *
   */
  get lView(): LView|null {
    return getLViewById(this.lViewId);
  }

  constructor(
      /**
       * ID of the component's parent view data.
       */
      private lViewId: number,

      /**
       * The index instance of the node.
       */
      public nodeIndex: number,

      /**
       * The instance of the DOM node that is attached to the lNode.
       */
      public native: RNode) {}
}

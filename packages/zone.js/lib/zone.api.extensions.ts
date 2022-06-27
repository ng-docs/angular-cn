/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Additional `EventTarget` methods added by `Zone.js`.
 *
 * `Zone.js` 添加的额外 `EventTarget` 方法。
 *
 * 1. removeAllListeners, remove all event listeners of the given event name.
 *
 *    removeAllListeners，删除给定事件名称的所有事件侦听器。
 *
 * 2. eventListeners, get all event listeners of the given event name.
 *
 *    eventListeners，获取给定事件名称的所有事件侦听器。
 *
 */
interface EventTarget {
  /**
   * Remove all event listeners by name for this event target.
   *
   * 按名称删除此事件目标的所有事件侦听器。
   *
   * This method is optional because it may not be available if you use `noop zone` when
   * bootstrapping Angular application or disable the `EventTarget` monkey patch by `zone.js`.
   *
   * 此方法是可选的，因为如果你在引导 Angular 应用程序时使用 `noop zone` 或通过 `zone.js` 禁用
   * `EventTarget` 猴子补丁，它可能不可用。
   *
   * If the `eventName` is provided, will remove event listeners of that name.
   * If the `eventName` is not provided, will remove all event listeners associated with
   * `EventTarget`.
   *
   * 如果提供了 `eventName` ，将删除该名称的事件侦听器。如果未提供 `eventName` ，将删除与
   * `EventTarget` 关联的所有事件侦听器。
   *
   * @param eventName the name of the event, such as `click`. This parameter is optional.
   *
   * 事件的名称，例如 `click` 。此参数是可选的。
   *
   */
  removeAllListeners?(eventName?: string): void;
  /**
   * Retrieve all event listeners by name.
   *
   * 按名称检索所有事件侦听器。
   *
   * This method is optional because it may not be available if you use `noop zone` when
   * bootstrapping Angular application or disable the `EventTarget` monkey patch by `zone.js`.
   *
   * 此方法是可选的，因为如果你在引导 Angular 应用程序时使用 `noop zone` 或通过 `zone.js` 禁用
   * `EventTarget` 猴子补丁，它可能不可用。
   *
   * If the `eventName` is provided, will return an array of event handlers or event listener
   * objects of the given event.
   * If the `eventName` is not provided, will return all listeners.
   *
   * 如果提供了 `eventName` ，将返回给定事件的事件处理程序或事件侦听器对象的数组。如果未提供
   * `eventName` ，将返回所有侦听器。
   *
   * @param eventName the name of the event, such as click. This parameter is optional.
   *
   * 事件的名称，例如 click 。此参数是可选的。
   *
   */
  eventListeners?(eventName?: string): EventListenerOrEventListenerObject[];
}
